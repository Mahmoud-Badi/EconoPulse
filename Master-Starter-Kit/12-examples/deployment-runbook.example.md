# Deployment Runbook — TaskFlow

> **Last Updated:** 2026-03-10
> **Owner:** Platform Engineering
> **Deployment Pattern:** Blue-Green
> **Environments:** Staging → Production
> **Typical Deploy Time:** 12–18 minutes (including smoke tests)

---

## 1. Pre-Deployment Checklist

Complete every item before initiating deployment. Any unchecked item is a **STOP** — do not proceed.

| # | Check | Command / Action | Owner |
| --- | --- | --- | --- |
| 1 | All tests pass on `main` | `pnpm test` — 0 failures | CI |
| 2 | E2E smoke suite passes | `pnpm test:e2e` — 5/5 critical paths | CI |
| 3 | No P0/P1 bugs open for this release | Check issue tracker, filter by milestone | PM |
| 4 | Database migrations reviewed | `prisma migrate diff` — reviewed by 2nd engineer | Backend Lead |
| 5 | Migrations are backward-compatible | Old code can run against new schema (expand-contract) | Backend Lead |
| 6 | Environment variables verified | All new env vars set in production config | DevOps |
| 7 | Feature flags configured | New features behind flags, default OFF | PM + Backend |
| 8 | Bundle size within budget | `ANALYZE=true pnpm build` — no chunk > 100KB | Frontend Lead |
| 9 | Sentry release created | `sentry-cli releases new $VERSION` | CI |
| 10 | Source maps uploaded to Sentry | `sentry-cli releases files $VERSION upload-sourcemaps` | CI |
| 11 | Changelog entry written | `CHANGELOG.md` updated with user-facing changes | PM |
| 12 | On-call engineer confirmed available | Slack confirmation in #deployments | On-call |

---

## 2. Deployment Steps (Blue-Green)

### Architecture

```text
                    ┌─────────────┐
                    │   Load      │
                    │  Balancer   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼─────┐
        │   BLUE    │           │   GREEN    │
        │ (current) │           │  (new)     │
        │  v2.0.9   │           │  v2.1.0    │
        └───────────┘           └────────────┘
              │                         │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    │ (shared)    │
                    └─────────────┘
```

### Step-by-Step

#### Phase A: Prepare (5 min)

```bash
# 1. Tag the release
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin v2.1.0

# 2. Verify staging deployment succeeded
curl -s https://staging.taskflow.app/api/health | jq .
# Expected: { "status": "ok", "version": "2.1.0" }

# 3. Notify team
# Post in #deployments: "Deploying v2.1.0 to production. ETA 15 min."
```

#### Phase B: Database Migration (3 min)

```bash
# 4. Run migrations against production database
# IMPORTANT: Migrations must be backward-compatible (expand-contract)
npx prisma migrate deploy

# 5. Verify migration success
npx prisma migrate status
# Expected: All migrations applied, no pending

# 6. Verify old code still works with new schema
curl -s https://app.taskflow.app/api/health | jq .
# Expected: { "status": "ok" } — old version still running fine
```

#### Phase C: Deploy to Green (5 min)

```bash
# 7. Deploy new version to GREEN environment (not receiving traffic yet)
# This is platform-specific. Examples:
# Railway:  railway up --environment green
# AWS ECS:  aws ecs update-service --cluster prod --service green --task-definition taskflow:v2.1.0
# Vercel:   vercel deploy --prod (Vercel handles this automatically)

# 8. Wait for GREEN health check
MAX_RETRIES=30
for i in $(seq 1 $MAX_RETRIES); do
  STATUS=$(curl -s https://green.taskflow.app/api/health | jq -r .status)
  if [ "$STATUS" = "ok" ]; then
    echo "GREEN is healthy"
    break
  fi
  echo "Waiting for GREEN... attempt $i/$MAX_RETRIES"
  sleep 5
done
```

#### Phase D: Smoke Tests on Green (3 min)

```bash
# 9. Run smoke test suite against GREEN (before traffic switch)
SMOKE_TARGET=https://green.taskflow.app pnpm test:smoke

# 10. Verify all 5 critical paths pass (see Section 3)
# If any smoke test fails: ABORT — do not switch traffic
```

#### Phase E: Switch Traffic (1 min)

```bash
# 11. Switch load balancer from BLUE to GREEN
# Platform-specific:
# AWS ALB:  aws elbv2 modify-listener --listener-arn $ARN --default-actions TargetGroupArn=$GREEN_TG
# Nginx:    update upstream to point to green, reload
# Vercel:   automatic (promote deployment)

# 12. Verify production serves new version
curl -s https://app.taskflow.app/api/health | jq .
# Expected: { "status": "ok", "version": "2.1.0" }
```

#### Phase F: Monitor (5 min)

```bash
# 13. Watch error rate for 5 minutes
# Sentry: check for new errors in v2.1.0 release
# Monitoring dashboard: error rate should stay < 0.1%

# 14. Verify key metrics stable
# - Response times: p95 within 20% of baseline
# - Error rate: < 0.1%
# - CPU/Memory: within normal bounds

# 15. If stable after 5 minutes: deployment SUCCESS
# Post in #deployments: "v2.1.0 deployed to production. All clear."
```

---

## 3. Smoke Test Suite

Five critical paths that must pass before traffic switch. Each test runs against the GREEN environment.

### Test 1: Authentication Flow

```typescript
describe('Smoke: Auth', () => {
  it('should login, access protected route, and refresh token', async () => {
    // Login
    const login = await api.post('/auth/login', {
      email: 'smoke-test@taskflow.app',
      password: process.env.SMOKE_TEST_PASSWORD,
    });
    expect(login.status).toBe(200);
    expect(login.headers['set-cookie']).toBeDefined(); // httpOnly cookie

    // Access protected route
    const me = await api.get('/auth/me');
    expect(me.status).toBe(200);
    expect(me.data.data.email).toBe('smoke-test@taskflow.app');

    // Refresh token
    const refresh = await api.post('/auth/refresh');
    expect(refresh.status).toBe(200);
  });
});
```

### Test 2: Core CRUD (Loads)

```typescript
describe('Smoke: Loads CRUD', () => {
  it('should create, read, update, and list loads', async () => {
    // Create
    const created = await api.post('/loads', smokeLoadPayload);
    expect(created.status).toBe(201);
    const loadId = created.data.data.id;

    // Read
    const fetched = await api.get(`/loads/${loadId}`);
    expect(fetched.data.data.referenceNumber).toBe(smokeLoadPayload.referenceNumber);

    // Update
    const updated = await api.patch(`/loads/${loadId}`, { status: 'DISPATCHED' });
    expect(updated.data.data.status).toBe('DISPATCHED');

    // List with pagination
    const list = await api.get('/loads?page=1&limit=10');
    expect(list.data.data.length).toBeGreaterThan(0);
    expect(list.data.pagination).toBeDefined();

    // Cleanup
    await api.delete(`/loads/${loadId}`);
  });
});
```

### Test 3: Financial Operations (Invoice)

```typescript
describe('Smoke: Invoices', () => {
  it('should create invoice and verify totals', async () => {
    const invoice = await api.post('/invoices', smokeInvoicePayload);
    expect(invoice.status).toBe(201);
    expect(invoice.data.data.total).toBe(250000); // $2,500.00 in cents

    // Verify line items sum to total
    const fetched = await api.get(`/invoices/${invoice.data.data.id}`);
    const lineTotal = fetched.data.data.lineItems.reduce(
      (sum: number, item: { amount: number }) => sum + item.amount, 0
    );
    expect(lineTotal).toBe(fetched.data.data.total);

    // Cleanup
    await api.delete(`/invoices/${invoice.data.data.id}`);
  });
});
```

### Test 4: Search

```typescript
describe('Smoke: Search', () => {
  it('should return results for known entity', async () => {
    const results = await api.get('/loads/search?q=SMOKE-TEST-REF');
    expect(results.status).toBe(200);
    expect(results.data.data.length).toBeGreaterThan(0);

    // Verify tenant isolation — should not return other tenants' data
    const allResults = results.data.data;
    const foreignData = allResults.filter(
      (r: { tenantId: string }) => r.tenantId !== smokeTestTenantId
    );
    expect(foreignData.length).toBe(0);
  });
});
```

### Test 5: Real-Time (WebSocket)

```typescript
describe('Smoke: WebSocket', () => {
  it('should connect and receive heartbeat', async () => {
    const socket = io(GREEN_WS_URL, {
      auth: { token: smokeTestToken },
      transports: ['websocket'],
    });

    const heartbeat = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('WS timeout')), 5000);
      socket.on('heartbeat', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    expect(heartbeat).toBeDefined();
    socket.disconnect();
  });
});
```

---

## 4. Rollback Procedure

### When to Rollback

Trigger an immediate rollback if ANY of these conditions occur within 30 minutes of deployment:

| Condition | Threshold | Detection |
| --- | --- | --- |
| Error rate spike | > 1% (baseline is < 0.1%) | Sentry alert or monitoring dashboard |
| Response time degradation | p95 > 2x baseline | APM dashboard |
| Critical feature broken | Any smoke test path fails in production | Manual verification or synthetic monitoring |
| Data integrity issue | Any report of wrong data shown to user | Customer report or automated reconciliation |
| Health check failing | `/api/health` returns non-200 | Uptime monitor alert |

### How to Rollback (Target: < 5 minutes)

```bash
# Step 1: Switch traffic back to BLUE (old version) — 30 seconds
# AWS ALB:
aws elbv2 modify-listener --listener-arn $ARN --default-actions TargetGroupArn=$BLUE_TG

# Step 2: Verify old version is serving
curl -s https://app.taskflow.app/api/health | jq .
# Expected: { "status": "ok", "version": "2.0.9" } (previous version)

# Step 3: Notify team
# Post in #deployments: "ROLLBACK v2.1.0 -> v2.0.9. Reason: [description]"

# Step 4: If database migration was applied and is NOT backward-compatible:
# Run the down migration (this should be rare — expand-contract prevents this)
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# Step 5: Create incident ticket
# Title: "Rollback v2.1.0 — [root cause summary]"
# Assign to: deploying engineer + on-call
```

### Rollback Decision Tree

```text
Problem detected
  │
  ├── Error rate > 5%? ──YES──> IMMEDIATE rollback (no investigation)
  │
  ├── Error rate 1-5%? ──YES──> Rollback within 5 min
  │                              Investigate after rollback
  │
  ├── p95 > 2x baseline? ──YES──> Monitor for 5 min
  │                                 Still degraded? Rollback
  │                                 Recovering? Hold
  │
  └── Isolated issue? ──YES──> Feature flag OFF
                                Fix forward if < 30 min
                                Rollback if > 30 min
```

---

## 5. Post-Deployment Verification

### Monitoring Dashboard Checks (First 30 Minutes)

| Dashboard | What to Watch | Normal Range |
| --- | --- | --- |
| Error Tracking (Sentry) | New errors in release `v2.1.0` | 0 new errors first 5 min |
| APM (Response Times) | p50, p95, p99 per endpoint | Within 20% of last release |
| Infrastructure | CPU, Memory, Disk, Network | CPU < 70%, Memory < 80% |
| Database | Active connections, slow queries | Connections < pool size, no new slow queries |
| Business Metrics | Signups, load creations, invoices | Within historical daily range |

### Sentry Error Spike Detection

```text
Normal: 0-2 errors/minute (background noise)
Warning: 3-5 errors/minute → investigate immediately
Critical: >5 errors/minute → initiate rollback
```

**Sentry alert rule:**
- Trigger: > 5 new events in 5 minutes for release `v2.1.0`
- Action: Slack #alerts + PagerDuty on-call
- Auto-resolve: When rate drops below 2/min for 10 minutes

---

## 6. Database Migration Safety

### Expand-Contract Pattern

Every migration must be backward-compatible. The old version of the code must work against the new schema. This enables zero-downtime deployments and safe rollbacks.

#### Expand Phase (deploy migration before code)

```sql
-- Adding a column: safe (old code ignores new columns)
ALTER TABLE loads ADD COLUMN priority VARCHAR(10) DEFAULT 'NORMAL';

-- Adding a table: safe (old code doesn't query it)
CREATE TABLE load_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID REFERENCES loads(id),
  tag VARCHAR(50) NOT NULL
);

-- Adding an index: safe (use CONCURRENTLY to avoid locks)
CREATE INDEX CONCURRENTLY idx_loads_priority ON loads (priority);
```

#### Contract Phase (deploy after all code uses new schema)

```sql
-- Removing a column: only after NO code references it (separate deploy)
ALTER TABLE loads DROP COLUMN legacy_status;

-- Renaming: NEVER rename directly. Instead:
-- Deploy 1: Add new column, backfill, update code to write both
-- Deploy 2: Update code to read from new column
-- Deploy 3: Drop old column
```

#### Dangerous Operations (Require Manual Approval)

| Operation | Risk | Mitigation |
| --- | --- | --- |
| DROP TABLE | Data loss | Require `--force` flag + backup verification |
| DROP COLUMN | Data loss | 3-deploy rename pattern above |
| ALTER COLUMN type | Lock + data truncation | Create new column, backfill, swap |
| ADD NOT NULL without default | Breaks inserts | Always add DEFAULT, remove later |
| Large backfill | Table lock on big tables | Batch in chunks of 1,000 rows |

---

## 7. Emergency Response

### Escalation Path

```text
Level 1: Deploying Engineer (0-5 min)
  │ Can rollback, toggle feature flags, restart services
  │
Level 2: On-Call Engineer (5-15 min)
  │ Can investigate root cause, apply hotfixes, scale infrastructure
  │
Level 3: Engineering Lead (15-30 min)
  │ Can authorize emergency patches, coordinate cross-team response
  │
Level 4: CTO (30+ min)
  │ Customer communication, business continuity decisions
```

### War Room Procedure

When a deployment causes a SEV1 or SEV2 incident:

1. **Open war room** — Slack huddle in #incident-response or video call
2. **Assign roles:**
   - **Incident Commander (IC):** Coordinates response, makes decisions
   - **Investigator:** Digs into logs, traces, and code
   - **Communicator:** Posts updates to #incidents every 10 minutes
3. **Timeline:** IC maintains a running timeline of events and actions
4. **Resolution:** Once resolved, IC declares "all clear" in #incidents
5. **Post-mortem:** Scheduled within 48 hours (blameless)

### Contact List

| Role | Primary | Backup | Contact |
| --- | --- | --- | --- |
| On-Call Engineer | Rotates weekly | See PagerDuty schedule | PagerDuty escalation |
| Engineering Lead | [Name] | [Name] | Slack DM or phone |
| DevOps | [Name] | [Name] | Slack #devops |
| CTO | [Name] | N/A | Phone (emergencies only) |

---

## 8. Incident Severity During Deployment

| Severity | Definition | Response Time | Example |
| --- | --- | --- | --- |
| SEV1 | Complete outage or data breach | Immediate (< 5 min) | All API requests returning 500. Customer data exposed. |
| SEV2 | Major feature broken, >10% users affected | < 15 min | Invoice creation failing. Login broken for one tenant. |
| SEV3 | Minor feature broken, workaround exists | < 1 hour | PDF export not working (users can screenshot). Search slow but functional. |
| SEV4 | Cosmetic or low-impact issue | Next business day | Tooltip text wrong. Non-critical log warnings. |

### Severity-Based Actions

| Severity | Rollback? | Feature Flag? | Hotfix? | Post-Mortem? |
| --- | --- | --- | --- | --- |
| SEV1 | Immediate | N/A (rollback first) | After rollback | Required (48h) |
| SEV2 | If not fixed in 15 min | Try first | If flag insufficient | Required (1 week) |
| SEV3 | No | If available | Next deploy | Optional |
| SEV4 | No | No | Next sprint | No |

---

## Deployment Log Template

After every deployment, append an entry:

```markdown
### v2.1.0 — 2026-03-10

- **Deployer:** [Name]
- **Start:** 14:00 UTC | **End:** 14:18 UTC
- **Duration:** 18 minutes
- **Migrations:** 1 (add `priority` column to loads)
- **Feature Flags:** `load-priority` (OFF by default)
- **Smoke Tests:** 5/5 passed
- **Rollback:** Not needed
- **Issues:** None
- **Notes:** Smooth deployment. Priority feature will be enabled per-tenant next week.
```
