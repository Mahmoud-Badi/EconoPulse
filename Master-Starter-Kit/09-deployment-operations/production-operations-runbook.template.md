# Production Operations Runbook — {{PROJECT_NAME}}

> Standard operating procedures for routine production tasks. The gap between "deploy it" and "incident happened" — these are the Tuesday afternoon operations.

---

## 1. Secret Rotation

### When to Rotate

| Secret | Rotation Schedule | Trigger |
|--------|------------------|---------|
| Database password | Every 90 days | Schedule |
| API keys (third-party) | Every 90 days or on team change | Schedule / Event |
| JWT / session secret | Every 90 days | Schedule |
| Webhook signing secrets | On suspected compromise | Event |
| Encryption keys | Annually | Schedule |
| OAuth client secrets | On team member departure | Event |

### Rotation Procedure

```
1. Generate new secret
2. Add new secret to hosting provider (Vercel, AWS, etc.)
   - Vercel: `vercel env add SECRET_NAME production`
   - AWS: Update in Secrets Manager / Parameter Store
3. Deploy application with new secret
4. Verify application works with new secret
5. Revoke/delete old secret from the provider (Stripe dashboard, etc.)
6. Update documentation / password manager
7. Log rotation in DEVLOG.md
```

### Critical: Zero-Downtime Rotation

For secrets used by running sessions (JWT_SECRET, AUTH_SECRET):

```
1. Add new secret alongside old one (support both temporarily)
2. Deploy: application accepts tokens signed with either secret
3. Wait for all old sessions to expire (or force rotation)
4. Remove old secret
5. Deploy: application only accepts new secret
```

---

## 2. Database Migration Execution

### Pre-Migration Checklist

- [ ] Migration tested on staging with production-like data
- [ ] Backup taken before migration
- [ ] Rollback migration prepared
- [ ] Estimated execution time documented
- [ ] Off-peak window selected (if migration locks tables)
- [ ] Team notified

### Zero-Downtime Migration Patterns

**Expand-Contract Pattern** (for schema changes):

```
Phase 1 — EXPAND: Add new column/table (old code still works)
  Deploy code that writes to BOTH old and new locations
  Backfill existing data to new location

Phase 2 — MIGRATE: Switch reads to new location
  Deploy code that reads from new location
  Verify all reads work correctly

Phase 3 — CONTRACT: Remove old column/table
  Deploy code that no longer references old location
  Drop old column/table in next migration
```

**Example:** Renaming `user.name` to `user.full_name`

```sql
-- Migration 1 (expand): Add new column
ALTER TABLE users ADD COLUMN full_name TEXT;
UPDATE users SET full_name = name;

-- Deploy code that writes to BOTH name and full_name
-- Deploy code that reads from full_name (fallback to name)

-- Migration 2 (contract): After verification
ALTER TABLE users DROP COLUMN name;
```

### Migration Execution

```bash
# 1. Take backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Run migration on staging first
DATABASE_URL=$STAGING_DB pnpm db:migrate

# 3. Verify staging
pnpm test:e2e --env staging

# 4. Run migration on production
DATABASE_URL=$PRODUCTION_DB pnpm db:migrate

# 5. Verify production
curl -s https://{{DOMAIN}}/api/health | jq .

# 6. If issues: rollback
DATABASE_URL=$PRODUCTION_DB pnpm db:migrate:rollback
```

---

## 3. Production Data Fix

### When a Data Fix Is Needed

- Customer reports incorrect data
- Bug caused incorrect writes (already fixed in code)
- Migration needs manual correction
- Data import had errors

### Data Fix Protocol

```
1. DOCUMENT: Describe the issue and affected records in DEVLOG.md
2. APPROVE: Get sign-off from team lead / product owner
3. BACKUP: pg_dump the affected table(s)
4. SCRIPT: Write the fix as a SQL script (NOT inline commands)
5. TEST: Run the script on staging with production-like data
6. EXECUTE: Run on production within a transaction
7. VERIFY: Confirm the fix resolved the issue
8. LOG: Document what was changed, why, and by whom
```

### Template: Data Fix Script

```sql
-- DATA FIX: [Brief description]
-- Author: [Your name]
-- Date: [Date]
-- Ticket: [Link to issue/ticket]
-- Reason: [Why this fix is needed]
-- Affected rows: [Estimated count]
-- Approved by: [Name]

BEGIN;

-- Show affected rows BEFORE fix
SELECT id, [columns] FROM [table] WHERE [condition];

-- Apply fix
UPDATE [table]
SET [column] = [value]
WHERE [condition];

-- Show affected rows AFTER fix
SELECT id, [columns] FROM [table] WHERE [condition];

-- Verify count matches expectation
-- If correct: COMMIT;
-- If wrong:   ROLLBACK;

COMMIT;
```

---

## 4. Dependency Updates

### Update Strategy

| Update Type | Frequency | Process |
|------------|-----------|---------|
| **Patch** (1.0.x) | Weekly (auto-merge OK) | Renovate/Dependabot auto-PR |
| **Minor** (1.x.0) | Bi-weekly | Review changelog, run tests, manual merge |
| **Major** (x.0.0) | As needed | Review breaking changes, test thoroughly, dedicate time |
| **Security** | Immediately | Drop everything, update, deploy |

### Recommended: Renovate Configuration

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "schedule": ["before 7am on Monday"],
  "automerge": true,
  "automergeType": "pr",
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": false,
      "labels": ["dependencies", "minor"]
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["dependencies", "major", "breaking"]
    }
  ]
}
```

### Major Update Procedure

```
1. Read the changelog / migration guide
2. Create a branch: git checkout -b deps/upgrade-[package]-v[version]
3. Update the package: pnpm update [package]@latest
4. Run full test suite: pnpm verify (lint + typecheck + test + build)
5. Fix any breaking changes
6. Test critical user flows manually
7. Deploy to staging and verify
8. Create PR with changelog notes
9. Deploy to production
```

---

## 5. Infrastructure Scaling

### When to Scale

| Signal | Metric | Action |
|--------|--------|--------|
| Slow responses | P95 latency > 500ms | Scale compute |
| Database slow | Query time > 100ms (avg) | Add indexes, read replica, or upgrade |
| High error rate | 5xx rate > 1% | Investigate root cause first |
| Memory pressure | Memory > 80% sustained | Scale memory or optimize |
| Connection exhaustion | DB connections near limit | Add connection pooling |

### Vercel Scaling

Vercel auto-scales serverless functions. Key limits to monitor:

| Limit | Free | Pro | Enterprise |
|-------|------|-----|-----------|
| Function duration | 10s | 60s | 900s |
| Function memory | 1024 MB | 3009 MB | 3009 MB |
| Concurrent executions | 10 | 1000 | Custom |
| Bandwidth | 100 GB | 1 TB | Custom |

### Database Scaling Path

```
Step 1: Optimize queries (add indexes, fix N+1)
  ↓ Still slow?
Step 2: Add connection pooling (PgBouncer / Supabase pooler)
  ↓ Still slow?
Step 3: Upgrade database tier (more CPU/RAM)
  ↓ Still slow?
Step 4: Add read replica for read-heavy queries
  ↓ Still slow?
Step 5: Implement caching layer (Redis)
  ↓ Still slow?
Step 6: Consider database sharding or switching to a horizontally scalable DB
```

---

## 6. SSL / TLS Certificate Management

### Managed Certificates (RECOMMENDED)

If using Vercel, Cloudflare, or similar: certificates are auto-managed. No action needed.

### Custom Domains

- Verify auto-renewal is enabled
- Set up monitoring alerts for expiring certificates (30 days before)
- Keep DNS records documented

### Certificate Monitoring

```bash
# Check certificate expiry
echo | openssl s_client -connect {{DOMAIN}}:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 7. Operational Checklists

### Daily (Automated)

- [ ] Health check endpoints responding (`/api/health`)
- [ ] Error rate below threshold (< 1%)
- [ ] No critical alerts in monitoring dashboard

### Weekly

- [ ] Review error tracking dashboard (Sentry) — new errors?
- [ ] Check dependency update PRs (Renovate/Dependabot)
- [ ] Review server costs — any unexpected spikes?
- [ ] Check database connection pool utilization

### Monthly

- [ ] Verify backups can be restored (test restore)
- [ ] Review and rotate secrets nearing 90-day mark
- [ ] Check for unused resources (orphaned files, stale data)
- [ ] Review access logs for suspicious activity
- [ ] Update staging environment to match production config

### Quarterly

- [ ] Full dependency audit (`pnpm audit`)
- [ ] Performance benchmark (Lighthouse, load test)
- [ ] Review infrastructure costs and optimize
- [ ] Test disaster recovery procedure
- [ ] Review and update this runbook
