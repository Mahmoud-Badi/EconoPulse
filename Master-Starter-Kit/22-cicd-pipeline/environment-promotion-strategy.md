# Environment Promotion Strategy

> Code flows in one direction: dev to staging to production. Every promotion is gated by automated checks and human verification. No shortcuts, no exceptions.

---

## The Promotion Pipeline

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   Dev    │────▶│  Staging  │────▶│  Production  │
│          │     │           │     │              │
│ Automatic│     │ Automatic │     │   Manual     │
│ on push  │     │ on merge  │     │   approval   │
│ to branch│     │ to develop│     │   required   │
└──────────┘     └───────────┘     └──────────────┘
```

---

## Environment Definitions

### Development Environment

| Attribute | Value |
|-----------|-------|
| **Purpose** | Individual developer testing and iteration |
| **Trigger** | Push to feature branch or local development |
| **Data** | Fake/seed data, generated fixtures |
| **Infrastructure** | Minimal — may run locally or as preview deploy |
| **Who has access** | Individual developer |
| **Uptime expectation** | Best effort, no SLA |
| **Cost profile** | Minimal or free tier |

### Staging Environment

| Attribute | Value |
|-----------|-------|
| **Purpose** | Pre-production validation, QA, stakeholder review |
| **Trigger** | Push to `develop` branch (automatic) |
| **Data** | Anonymized production data or realistic synthetic data |
| **Infrastructure** | Must mirror production (same services, same config, smaller scale) |
| **Who has access** | Dev team, QA, product managers, stakeholders |
| **Uptime expectation** | Business hours, occasional resets acceptable |
| **Cost profile** | 30-50% of production cost |

### Production Environment

| Attribute | Value |
|-----------|-------|
| **Purpose** | Live user-facing application |
| **Trigger** | Manual approval after staging validation |
| **Data** | Real user data |
| **Infrastructure** | Full scale, high availability, monitored |
| **Who has access** | All users; admin access restricted to ops team |
| **Uptime expectation** | 99.9%+ SLA |
| **Cost profile** | Full cost |

---

## Environment Parity Requirements

Staging must mirror production. If it does not, every test you run on staging is a lie.

### What Must Be Identical

| Component | Dev | Staging | Production |
|-----------|-----|---------|------------|
| **Runtime version** (Node, Python, etc.) | Same | Same | Same |
| **OS / container base image** | Same | Same | Same |
| **Database engine + version** | Same | Same | Same |
| **Cache layer** (Redis version, config) | Same or local | Same | Same |
| **API versions** (third-party services) | Sandbox/mock | Sandbox | Live |
| **Feature flags** | All enabled | Selective | Selective |
| **SSL/TLS configuration** | Optional | Required | Required |
| **CDN configuration** | None | Same provider | Same provider |
| **DNS resolution** | Local/preview | Same provider | Same provider |

### What Can Differ

| Component | Dev | Staging | Production |
|-----------|-----|---------|------------|
| **Instance count / replicas** | 1 | 1-2 | 2+ (auto-scaling) |
| **Instance size** (CPU, memory) | Minimal | Medium | Full |
| **Database size** | Seed data | Anonymized subset | Full |
| **Monitoring verbosity** | Debug | Info | Info/Warn |
| **Rate limiting** | Disabled | Relaxed | Enforced |
| **Email sending** | Intercepted (Mailtrap) | Intercepted | Live |
| **Payment processing** | Sandbox | Sandbox | Live |
| **Domain** | localhost / preview URL | staging.domain.com | domain.com |

### Common Parity Failures (and Their Consequences)

| Parity Violation | What Happens |
|-----------------|--------------|
| Staging runs Node 18, prod runs Node 20 | Code that works on staging breaks on production due to API differences |
| Staging has no CDN, prod uses CloudFront | Cache-related bugs only appear in production |
| Staging uses SQLite, prod uses PostgreSQL | Query syntax differences cause production errors |
| Staging skips SSL, prod enforces HTTPS | Mixed content errors only appear in production |
| Staging has no rate limiting | Performance issues only surface under production load |

---

## Promotion Gates

### Dev to Staging

This promotion is **automatic** when code is merged to the `develop` branch.

**Required Gates:**

- [ ] All PR checks pass (lint, type-check, unit tests, build)
- [ ] At least 1 code review approval
- [ ] No merge conflicts
- [ ] Branch is up-to-date with `develop`
- [ ] Security scan passes (no critical/high vulnerabilities)
- [ ] Test coverage meets minimum threshold (e.g., 80%)

**Automated Actions on Promotion:**

1. Build application from `develop` branch
2. Run full test suite (unit + integration)
3. Deploy to staging environment
4. Run database migrations (if any)
5. Execute staging smoke tests
6. Notify team via Slack: "New staging build deployed"

### Staging to Production

This promotion requires **manual approval** after staging validation.

**Required Gates:**

- [ ] All staging tests pass (unit, integration, e2e)
- [ ] Staging environment verified by QA (manual or automated)
- [ ] No open critical/blocker bugs
- [ ] Performance benchmarks meet thresholds
- [ ] Security scan passes (no critical vulnerabilities)
- [ ] Database migration is reversible (or expand-contract verified)
- [ ] Rollback plan documented and tested
- [ ] At least 1 production deploy approval from authorized reviewer
- [ ] Change window is acceptable (not Friday 5pm, not during peak traffic)

**Automated Actions on Promotion:**

1. Create a git tag with semantic version
2. Build production artifacts from `main` branch
3. Run full test suite one final time
4. Execute pre-deploy checks (DB connectivity, service health)
5. Deploy using configured strategy (blue-green, canary, rolling)
6. Run database migrations
7. Execute production smoke tests
8. Verify health checks pass
9. Notify team: "Production deploy complete"
10. If smoke tests fail: automatic rollback + incident notification

---

## Data Strategy Per Environment

### Development Data

```
Source:    Generated seed data
Volume:    Small (100-1,000 records per table)
Content:   Fake names, emails, addresses (Faker.js)
Refresh:   On environment reset or manual reseed
PII:       None — fully synthetic
```

**Seed Script Requirements:**
- Deterministic (same seed = same data) for reproducible testing
- Covers all edge cases (empty states, max lengths, special characters)
- Includes at least one record for every enum/status value
- Fast to execute (< 30 seconds)

### Staging Data

```
Source:    Anonymized production snapshot OR realistic synthetic data
Volume:    Medium (10-50% of production volume)
Content:   Real structure, anonymized values
Refresh:   Weekly or on-demand
PII:       Scrubbed — no real user data
```

**Anonymization Requirements:**
- All email addresses replaced with `user-{id}@staging.example.com`
- All names replaced with generated fake names
- All phone numbers replaced with `555-xxxx` pattern
- All addresses replaced with generated fake addresses
- Payment tokens/cards fully removed (replaced with test tokens)
- Passwords reset to a known staging password hash
- API keys and secrets replaced with staging equivalents
- IP addresses randomized
- Preserve referential integrity after anonymization

**Anonymization Script:**

```sql
-- Example: Anonymize users table
UPDATE users SET
  email = CONCAT('user-', id, '@staging.example.com'),
  first_name = 'Test',
  last_name = CONCAT('User-', id),
  phone = CONCAT('555-', LPAD(id::text, 4, '0')),
  password_hash = '$2b$10$staging-password-hash',
  address_line1 = CONCAT(id, ' Staging Street'),
  city = 'Testville',
  state = 'TS',
  zip = '00000';

-- Remove sensitive tokens
UPDATE users SET
  stripe_customer_id = NULL,
  api_key = NULL;
```

### Production Data

```
Source:    Real user data
Volume:    Full
Content:   Real data, encrypted at rest and in transit
Refresh:   N/A — live data
PII:       Full PII — governed by privacy policy and regulations
```

---

## Feature Flag Gating Per Environment

Feature flags control which features are active in each environment without code changes.

| Flag State | Dev | Staging | Production |
|-----------|-----|---------|------------|
| **New feature (in development)** | ON | OFF | OFF |
| **New feature (QA ready)** | ON | ON | OFF |
| **New feature (canary rollout)** | ON | ON | ON (10% of users) |
| **New feature (full rollout)** | ON | ON | ON (100%) |
| **Deprecated feature** | OFF | OFF | ON (sunset period) |
| **Kill switch (incident)** | N/A | N/A | OFF (emergency disable) |

### Flag Lifecycle

```
1. Developer creates flag: default OFF everywhere
2. Developer enables in dev: builds and tests feature
3. Flag enabled in staging: QA validates feature
4. Flag enabled in production at 10%: canary rollout
5. Monitor metrics for 24-48 hours
6. Ramp to 50%, then 100% over days/weeks
7. Remove flag from code once feature is stable (clean up tech debt)
```

---

## Environment-Specific Configuration Management

### Configuration Hierarchy

```
config/
├── default.json          # Base config (all environments)
├── development.json      # Dev overrides
├── staging.json          # Staging overrides
├── production.json       # Production overrides (non-sensitive)
└── custom-environment-variables.json  # Maps env vars to config keys
```

### What Goes Where

| Configuration Type | Where It Lives | Example |
|-------------------|---------------|---------|
| **App behavior** (timeouts, limits) | Config files (committed) | `{ "api": { "timeout": 30000 } }` |
| **Feature flags** | Feature flag service | LaunchDarkly, Unleash, environment variable |
| **Secrets** (API keys, DB URLs) | CI/CD secrets + secret manager | GitHub Secrets, AWS SSM, Vault |
| **Infrastructure** (instance size, replicas) | IaC files (committed) | Terraform variables, Pulumi config |
| **Domain/URLs** | Environment variables | `APP_URL=https://staging.example.com` |

### Never Do This

- Never commit secrets to the repository (use `.env.example` with dummy values)
- Never use the same API keys across environments
- Never hardcode environment URLs in application code
- Never toggle behavior with `if (process.env.NODE_ENV === 'production')` — use feature flags

---

## Database Migration Promotion Strategy

Database migrations are the highest-risk part of any deployment. A bad migration can take down production and be difficult to reverse.

### Migration Rules

1. **Migrations are forward-only in production.** Never run `migrate:rollback` in production unless it is an absolute emergency with a tested rollback script.

2. **Use expand-contract pattern** for breaking schema changes:
   ```
   Step 1 (expand):   Add new column, keep old column → Deploy code that writes to both
   Step 2 (migrate):  Backfill new column from old column
   Step 3 (contract): Deploy code that reads from new column only → Drop old column
   ```

3. **Every migration must be reversible** or explicitly marked as irreversible with team sign-off.

4. **Test migrations against staging data** before production. Run the migration on a copy of the staging database first.

5. **Never run migrations in the deploy step.** Run them as a separate, monitored step with rollback capability.

### Migration Promotion Flow

```
Developer writes migration
    ↓
Migration runs on dev database (automatic)
    ↓
Migration runs on staging database (automatic on staging deploy)
    ↓
Verify staging database state (manual or automated check)
    ↓
Migration runs on production database (separate step, monitored)
    ↓
Verify production database state
    ↓
Continue with application deployment
```

### Migration Safety Checklist

- [ ] Migration is backward-compatible (old code can run against new schema)
- [ ] Migration has been tested against realistic data volume
- [ ] Migration completes within acceptable downtime window (or is zero-downtime)
- [ ] Rollback script exists and has been tested
- [ ] No data loss — only additive changes in first deploy
- [ ] Indexes are created concurrently (not locking the table)
- [ ] Large table migrations use batching (not a single transaction)

---

## Rollback Strategy Per Environment

### Development

**Strategy:** Rebuild and redeploy. Development environments are disposable.

```bash
# Just redeploy the previous commit
git checkout <previous-commit>
# Or reset the preview environment
```

### Staging

**Strategy:** Automatic revert. Staging should be easy to roll back.

```bash
# Option 1: Revert the merge commit
git revert <merge-commit-sha>
git push origin develop

# Option 2: Redeploy previous build
# (Most CI providers keep build artifacts for this)
```

**Database rollback:** Acceptable to run `migrate:rollback` on staging. Data loss on staging is recoverable.

### Production

**Strategy:** Depends on deployment pattern. Always prefer deployment-level rollback over code revert.

| Deployment Pattern | Rollback Method | Rollback Time |
|-------------------|-----------------|---------------|
| **Blue-green** | Switch traffic back to blue | < 1 minute |
| **Canary** | Stop canary, route all traffic to stable | < 1 minute |
| **Rolling** | Redeploy previous version | 5-10 minutes |
| **Vercel/Netlify** | Promote previous deployment | < 1 minute |
| **Docker** | Pull and run previous image tag | 2-5 minutes |

**Database rollback in production:**
- If migration was expand-only (additive): No rollback needed, old code still works
- If migration was contract (destructive): This is why you use expand-contract pattern
- Emergency: Restore from point-in-time backup (last resort, causes data loss)

### Rollback Runbook

```
1. Detect failure (automated smoke test or manual report)
2. Assess severity (P1: all users affected, P2: partial, P3: minor)
3. For P1: Immediately rollback deployment (< 5 min decision)
4. For P2/P3: Investigate first, rollback if fix is not obvious (< 15 min)
5. Execute rollback command
6. Verify rollback successful (smoke tests, monitoring)
7. Notify team: "Production rolled back to version X"
8. Create incident report
9. Fix the issue on a branch, go through normal promotion flow
10. Never hotfix production directly
```

---

## Promotion Schedule and Change Windows

### Recommended Deploy Windows

| Day | Deploy to Staging | Deploy to Production |
|-----|-------------------|----------------------|
| Monday | Anytime | 10 AM - 2 PM (local time) |
| Tuesday | Anytime | 10 AM - 2 PM |
| Wednesday | Anytime | 10 AM - 2 PM |
| Thursday | Anytime | 10 AM - 12 PM (early only) |
| Friday | Anytime | **No production deploys** |
| Weekend | Anytime | **Emergency only** |

### Exceptions

- **Hotfixes** for P1 incidents can deploy anytime with on-call approval
- **Feature flag toggles** are not deploys and can happen anytime
- **Config-only changes** (environment variables) follow relaxed windows
- **Zero-risk deploys** (docs, copy changes) can deploy anytime with reviewer agreement
