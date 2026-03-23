# Deployment Rollback Runbook

> Symptoms: Issues immediately following a deployment — new errors, performance degradation, feature breakage | Likely Causes: Code regression, misconfiguration, incompatible database migration, dependency conflict | Expected Resolution Time: 5-15 minutes for rollback, longer for migration rollback

---

## Symptoms

- Error rates spike immediately after or shortly after a deployment
- New error types appear in logs that did not exist before the deployment
- Performance degrades across the board (latency increase, throughput decrease)
- Users report broken functionality that was working before
- Health checks fail on newly deployed instances
- New instances fail to start or crash on boot
- Feature that was just deployed is not working as expected
- Database migration errors in logs
- Deployment pipeline shows partial deployment (some instances on old version, some on new)

---

## Diagnostic Steps

### 1. Confirm the Deployment Caused the Issue

```bash
# When was the last deployment?
# Check deployment logs for timestamp

# Do the error metrics correlate with deployment time?
# Overlay deployment markers on your monitoring dashboard

# Are errors coming from the new code specifically?
# Check error stack traces — do they reference new/changed files?

# Is the issue on all instances or only newly deployed ones?
# Check per-instance metrics if available
```

### 2. Assess Rollback Safety

Before rolling back, determine if it is safe:

| Question | Yes = Safe to Rollback | No = Proceed with Caution |
|----------|----------------------|---------------------------|
| Were there database migrations in this deployment? | No migrations | Migrations ran — rollback may break schema compatibility |
| Were there API contract changes (new required fields, removed endpoints)? | No changes | Clients may depend on new contract |
| Were there queue/message format changes? | No changes | In-flight messages may be incompatible |
| Were there cache key/format changes? | No changes | Stale cache may cause issues |
| Were there third-party integration changes (webhook URLs, API versions)? | No changes | Third-party may be sending to new format |

**If all "Yes":** Rollback is safe. Proceed to Mitigation Steps.
**If any "No":** Read the caution notes for that specific case before rolling back.

### 3. Identify What Changed

```bash
# View the deployment diff
git diff <previous-version>..<current-version> --stat

# Check for database migrations
# Look in: migrations/, db/migrate/, prisma/migrations/, etc.

# Check for environment variable changes
# Were any env vars added, removed, or changed?

# Check for infrastructure changes
# New services, changed ports, modified configs
```

---

## Mitigation Steps

### Option 1: Feature Flag Kill Switch (Fastest — Seconds)

If the broken feature is behind a feature flag:

1. **Open your feature flag dashboard** (LaunchDarkly, Unleash, Flagsmith, or config)
2. **Disable the flag** for the broken feature
3. **Verify** the issue is resolved (errors stop, feature returns to previous behavior)
4. **This preserves the deployment** while disabling only the broken part
5. **Investigate and fix** the feature at normal pace, re-enable when ready

This is the safest option because it does not touch infrastructure, code, or database state.

### Option 2: Platform Rollback (Fast — 1-5 Minutes)

#### Vercel

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel rollback

# Or promote a specific deployment
vercel promote <deployment-url>

# Verify the rollback
curl -s https://your-app.com/health
```

#### Netlify

```bash
# Via Netlify CLI
netlify deploy --prod --dir=<previous-build-directory>

# Or via Netlify dashboard:
# Go to Deploys > find the last good deploy > "Publish deploy"
```

#### AWS (ECS/Fargate)

```bash
# Update service to previous task definition
aws ecs update-service --cluster <cluster> --service <service> \
  --task-definition <previous-task-definition-arn>

# Force new deployment
aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment
```

#### Kubernetes

```bash
# Rollback to previous deployment revision
kubectl rollout undo deployment/<deployment-name>

# Or rollback to a specific revision
kubectl rollout undo deployment/<deployment-name> --to-revision=<N>

# Check rollout status
kubectl rollout status deployment/<deployment-name>
```

#### Docker Compose

```bash
# Pull the previous image version
docker compose pull

# Restart with previous version
# Update docker-compose.yml image tag to previous version, then:
docker compose up -d
```

#### Heroku

```bash
# Rollback to previous release
heroku rollback

# Or rollback to a specific version
heroku rollback v123
```

### Option 3: Git Revert + Redeploy (5-15 Minutes)

If platform rollback is not available or the previous deployment is not accessible:

```bash
# Find the merge commit that caused the issue
git log --oneline -10

# Revert the commit
git revert <commit-hash>

# Push the revert
git push origin main

# The CI/CD pipeline will deploy the reverted code
```

**Advantage:** Creates a clear audit trail of what was reverted and why.
**Disadvantage:** Slower than platform rollback. Requires CI/CD pipeline to run.

---

## Special Cases

### Database Migration Rollback

**This is the most dangerous rollback scenario.** Proceed carefully.

#### If the Migration Is Reversible (Down Migration Exists)

```bash
# Run the down migration
# Prisma:
npx prisma migrate reset --skip-seed  # WARNING: This resets the entire DB in development only

# Rails:
rails db:rollback STEP=1

# Django:
python manage.py migrate <app_name> <previous_migration_number>

# Knex:
npx knex migrate:rollback

# Flyway:
flyway undo
```

**After running the down migration:**
1. Verify database schema matches the expected state
2. Verify the application code (previous version) works with the rolled-back schema
3. Check for data loss — did the migration delete any data that the rollback cannot restore?

#### If the Migration Is NOT Reversible

Some migrations cannot be reversed (dropped columns, dropped tables, data transformations):

1. **Do NOT roll back the deployment** — the old code may not work with the new schema
2. **Fix forward** — deploy a fix that works with the current schema
3. **If you must restore data:**
   - Check if you have a database backup from before the migration
   - Restore the backup to a separate database
   - Extract the lost data and apply it to the current database
4. **Create a ticket** for a follow-up migration to clean up

#### Migration Rollback Decision Tree

```
Can the migration be reversed (down migration)?
  |
  YES --> Will the rollback cause data loss?
  |         YES --> Is the data recoverable from backups?
  |         |         YES --> Rollback migration, restore data, rollback code
  |         |         NO  --> Fix forward (do not rollback)
  |         NO  --> Rollback migration, then rollback code
  |
  NO --> Can old code work with new schema?
    |
    YES --> Rollback code only (leave schema as-is)
    NO  --> Fix forward (do not rollback)
```

### Cache Invalidation After Rollback

After rolling back, stale cache entries may cause issues:

1. **Identify affected cache keys** — what did the new code cache differently?
2. **Flush specific cache keys** if possible (targeted is safer than full flush)
3. **If unsure, flush the entire cache:**
   ```bash
   # Redis
   redis-cli FLUSHDB

   # Or with a specific prefix
   redis-cli --scan --pattern "app:cache:*" | xargs redis-cli DEL
   ```
4. **CDN cache:** Purge affected paths
   ```bash
   # Cloudflare
   curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/purge_cache" \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

### Queue / Background Job Considerations

After rolling back, there may be jobs in the queue that were created by the new code:

1. **Check queue depth** — are there pending jobs from the new version?
2. **If the old code can process them:** Let them process naturally
3. **If the old code cannot process them:** Dead-letter or delete them
4. **If jobs contain new data formats:** They will fail. Clear the queue and replay from source data if possible

---

## Resolution Steps

After rolling back:

1. **Verify service is restored:**
   - Error rates back to baseline
   - Latency back to normal
   - User-facing features working
   - Health checks passing on all instances
2. **Confirm all instances are on the rollback version:**
   - Check deployment dashboard
   - Hit the version/health endpoint on multiple instances
3. **Monitor for 30 minutes** for any residual issues
4. **Investigate the root cause** of the bad deployment:
   - What was the bug?
   - Why did it not get caught in testing?
   - Why did it not get caught in staging?
   - Was the deployment process followed correctly?
5. **Fix the code** and prepare a new deployment with:
   - The bug fix included
   - Additional test coverage for the failure mode
   - Canary deployment if not already in use
6. **Update the postmortem** with rollback details

---

## Prevention

- **Use canary deployments** — deploy to 5% of traffic first, monitor for 15 minutes, then roll out fully
- **Implement automated rollback** — if error rates exceed threshold within 10 minutes of deployment, automatically rollback
- **Always write reversible database migrations** — avoid destructive operations (DROP COLUMN, DROP TABLE) unless absolutely necessary
- **Separate database migrations from code deployments** — migrate schema first, deploy code second. This allows independent rollback.
- **Use feature flags for new features** — deploy code with the flag off, enable incrementally, disable instantly if broken
- **Run integration tests in staging** with production-like data before promoting to production
- **Keep the previous deployment artifact accessible** — you should be able to rollback to the last known good version in under 5 minutes
- **Deploy during business hours** when the team is available to respond to issues (not Friday afternoon)
- **Maintain a deployment checklist** — pre-deployment verification, deployment execution, post-deployment verification
- **Document deployment dependencies** — if this deployment requires a migration, env var change, or third-party config change, note it
- **Never deploy multiple large changes at once** — small, frequent deployments are safer and easier to rollback than large, infrequent ones
