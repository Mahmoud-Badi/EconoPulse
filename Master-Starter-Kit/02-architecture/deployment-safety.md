# Deployment Safety & Rollback Strategy — {{PROJECT_NAME}}

> **Purpose:** Every deploy is a controlled risk. This framework ensures you can ship confidently, detect problems fast, and roll back without scrambling.

**Deployment Target:** {{DEPLOYMENT_TARGET}} (e.g., Vercel, AWS, GCP, Railway)
**Deployment Method:** {{DEPLOYMENT_METHOD}} (e.g., Git push, CI/CD pipeline, manual)
**Current Strategy:** {{DEPLOYMENT_STRATEGY}} (e.g., rolling, blue-green, canary)
**Deploy Owner:** {{DEPLOY_OWNER}}

---

## 1. Deployment Patterns

### 1.1 Rolling Deploy (Default for Most Platforms)

**How it works:** New version gradually replaces old instances. During the transition, both versions serve traffic.

**When to use:** Default for most web applications on platforms like Vercel, Railway, Fly.io.

```
Timeline:
[Old v1] [Old v1] [Old v1] [Old v1]    ← Before deploy
[Old v1] [Old v1] [New v2] [New v2]    ← During deploy (mixed traffic)
[New v2] [New v2] [New v2] [New v2]    ← After deploy
```

**Gotcha:** During the transition window, BOTH versions are running. If v2 changes an API response shape or database schema, v1 instances will break. Always ensure backward compatibility during the transition.

### 1.2 Blue-Green Deployment

**How it works:** Two identical environments (Blue = current, Green = new). All traffic switches from Blue to Green at once. Blue stays warm for instant rollback.

**When to use:** When you need zero-downtime deploys with instant rollback. Good for critical applications where you can't afford mixed-version traffic.

```
Before:    [Blue v1] ← ALL TRAFFIC       [Green idle]
Deploy:    [Blue v1] ← ALL TRAFFIC       [Green v2 starting]
Test:      [Blue v1] ← ALL TRAFFIC       [Green v2 ✓ smoke tests pass]
Switch:    [Blue v1 warm standby]         [Green v2] ← ALL TRAFFIC
Rollback:  [Blue v1] ← ALL TRAFFIC       [Green v2 stopped]  (instant)
```

**Requirements:**
- Two identical environments (double the infrastructure cost during deploy)
- A load balancer or DNS that can switch traffic instantly
- Database must be compatible with both versions (migrations run before the switch)

**Gotcha:** Blue-green with database migrations is tricky. If v2's migration adds a non-nullable column, v1 (Blue) will crash when it tries to insert. Run migrations as a separate step that's compatible with both versions.

### 1.3 Canary Release

**How it works:** Route a small percentage of traffic to the new version. Monitor for errors. Gradually increase traffic if healthy.

**When to use:** High-risk changes, large user bases, or when you need real-user validation before full rollout.

```
Stage 1:   [v1 99%] ← traffic    [v2 1%]    ← canary (internal users or random 1%)
Stage 2:   [v1 90%] ← traffic    [v2 10%]   ← if metrics look good after 15 min
Stage 3:   [v1 50%] ← traffic    [v2 50%]   ← if metrics look good after 30 min
Stage 4:   [v2 100%] ← traffic                ← full rollout after 1 hour
```

### Canary Promotion Criteria

| Metric | Promote If | Rollback If |
|--------|-----------|-------------|
| Error rate (5xx) | <0.5% (same as baseline) | >1% OR >2x baseline |
| Latency p95 | Within 10% of baseline | >50% increase from baseline |
| Latency p99 | Within 20% of baseline | >100% increase from baseline |
| Client-side errors (JS) | No increase | >2x baseline |
| Business metrics | Conversion rate stable | >5% drop in conversion |
| CPU/Memory | Within normal range | >80% utilization |

> **Common mistake:** Setting the canary at 1% of traffic but only having 100 requests/minute total. At 1%, the canary gets 1 request/minute — not enough data to detect problems. Scale your canary percentage to your traffic volume. You need at least 50-100 requests in the canary to be statistically meaningful.

---

## 2. Rollback Triggers

A rollback should be an automatic reflex, not a debated decision. Define triggers upfront.

### Automatic Rollback Triggers (No Discussion Needed)

| Trigger | Threshold | Detection | Action |
|---------|-----------|-----------|--------|
| Error rate (5xx) | >1% of requests for 5+ minutes | APM alerting (Datadog, Sentry) | Immediate rollback |
| Latency p99 | >5 seconds for 5+ minutes | APM alerting | Immediate rollback |
| Crash rate | Any crash loop (>3 crashes in 5 min) | Container orchestrator / platform | Immediate rollback |
| Health check failure | 3 consecutive failures | Load balancer | Automatic (platform handles this) |
| Database connection errors | >5 connection failures in 1 min | Application logs | Immediate rollback |

### Manual Rollback Triggers (Requires Human Judgment)

| Trigger | Indicator | Who Decides |
|---------|-----------|-------------|
| Business metric drop | Conversion rate down >5%, signup rate drop | PM + Eng lead |
| User reports | >3 user reports of the same issue within 30 min | Support + Eng lead |
| Visual regression | Layout broken, missing content, wrong data displayed | Anyone who notices |
| Security vulnerability discovered post-deploy | Security team or automated scanner flags | Security owner + Eng lead |
| Data inconsistency | Wrong data written to database | Eng lead (immediate) |

> **Gotcha:** "Let's wait and see if it gets better" is never the right call during an active rollback trigger. Roll back first, investigate second. You can always re-deploy after fixing the issue.

---

## 3. Rollback Procedure

### 3.1 Application Rollback (Code)

| Platform | Rollback Command | Time to Rollback |
|----------|-----------------|-----------------|
| **Vercel** | `vercel rollback` or Dashboard → Deployments → Promote previous | <30 seconds |
| **Fly.io** | `fly releases rollback` | <60 seconds |
| **Railway** | Dashboard → Deployments → Rollback | <60 seconds |
| **AWS ECS** | `aws ecs update-service --force-new-deployment` with previous task definition | 2-5 minutes |
| **Kubernetes** | `kubectl rollout undo deployment/{{DEPLOYMENT_NAME}}` | 1-3 minutes |
| **Docker Compose** | `docker compose up -d --no-build` with previous image tag | <60 seconds |

### 3.2 Database Rollback

Database rollbacks are the hard part. Code rollbacks are instant; schema rollbacks can be destructive.

**Rule: Every migration must be forward-compatible with the previous code version.**

| Migration Type | Rollback Strategy | Risk |
|---------------|-------------------|------|
| **Add column (nullable)** | Leave the column in place. Previous code ignores it. | LOW — no action needed |
| **Add column (non-nullable with default)** | Leave it. Previous code ignores it. | LOW |
| **Add column (non-nullable, no default)** | DANGER: Previous code can't insert rows. Always add as nullable first. | HIGH |
| **Remove column** | NEVER drop columns in the same deploy as the code change. Step 1: Stop reading the column (deploy). Step 2: Drop the column (next deploy). | HIGH if done in one step |
| **Rename column** | Treat as add new + copy data + drop old. Three separate deploys. | HIGH |
| **Add table** | Leave it. Previous code ignores it. | LOW |
| **Drop table** | Ensure no code references it. Back up data first. Don't do this on Friday. | MEDIUM |
| **Add index** | Leave it. Indexes don't affect read/write compatibility. | LOW |
| **Data migration** | Must be reversible or idempotent. Test on a copy of production data first. | MEDIUM-HIGH |

```
SAFE migration pattern for removing a column:

Deploy 1: Stop reading from `old_column`, start reading from `new_column` (with fallback)
Deploy 2: Stop writing to `old_column`
Deploy 3: Run migration to drop `old_column`

Each deploy is independently rollback-safe because no deploy assumes the previous one succeeded.
```

> **Common mistake:** Running `ALTER TABLE DROP COLUMN` in the same PR as the code that removes references to that column. If the code rolls back but the migration doesn't, every query referencing that column will fail.

### 3.3 Feature Flag Rollback

The safest rollback is one that doesn't require a deploy at all.

```typescript
// Wrap risky features in flags
if (await featureFlag.isEnabled('new-billing-page', { userId: user.id })) {
  return <NewBillingPage />;
} else {
  return <OldBillingPage />;
}

// Rollback = flip the flag off in your feature flag dashboard
// No deploy needed. Takes effect in seconds.
```

| Feature Flag Tool | Cost | Complexity |
|------------------|------|-----------|
| Environment variable | Free | Low (requires deploy to change) |
| Database-backed flags | Free | Medium (no deploy needed, but need admin UI) |
| LaunchDarkly | $$$ | Low (great UI, targeting, analytics) |
| Unleash (self-hosted) | Free/$ | Medium (self-host and maintain) |
| PostHog Feature Flags | Free tier | Low (integrated with analytics) |
| Vercel Edge Config | $ | Low (Vercel-native, ultra-fast reads) |

---

## 4. Deploy Freeze Policies

| Policy | Rule | Rationale |
|--------|------|-----------|
| **No Friday deploys** | No production deploys after 2pm Friday local time. Hotfixes excepted with on-call available. | Nobody wants to debug at 11pm Friday. Issues deployed Friday sit all weekend. |
| **Holiday freezes** | No deploys from Dec 20 - Jan 3 and during major holidays. Emergency patches only with VP approval. | Skeleton crew can't handle incidents. |
| **Pre-launch freeze** | 48-hour freeze before any major launch or marketing event. | You want a stable, well-understood system when traffic spikes. |
| **Incident freeze** | No deploys during an active incident unless the deploy IS the fix. | Don't add variables during firefighting. |
| **Release branch cutoff** | For versioned releases: branch cut 48h before release. Only cherry-picked fixes after cutoff. | Prevents scope creep into releases. |

> **Gotcha:** Deploy freezes work only if the team respects them. If leadership routinely overrides the Friday freeze for "just this one feature," the policy is worthless. Enforce it or don't have it.

---

## 5. Post-Deploy Smoke Test Checklist

Run these checks after every production deploy. Automate as many as possible.

```markdown
## Post-Deploy Smoke Tests — {{DEPLOY_DATE}}

Deploy: {{DEPLOY_ID}}
Version: {{GIT_SHA}}
Deployer: {{DEPLOYER}}

### Critical Path (Must pass — rollback if any fail)
- [ ] Homepage loads successfully (HTTP 200, content visible)
- [ ] Login flow works (login → dashboard → see user data)
- [ ] Core feature #1 works: {{CORE_FEATURE_1}}
- [ ] Core feature #2 works: {{CORE_FEATURE_2}}
- [ ] API health check returns 200: `GET /api/health`
- [ ] Database connectivity confirmed (health check queries DB)

### Business Critical (Rollback if user-facing impact)
- [ ] Payment flow works (test mode transaction)
- [ ] Email sending works (trigger a test notification)
- [ ] File upload works (upload a small file, verify it's accessible)
- [ ] Search returns results

### Monitoring (Verify within 15 minutes of deploy)
- [ ] Error rate: Normal (not spiking)
- [ ] Latency p95: Normal (not degraded)
- [ ] CPU/Memory: Normal (no unexpected increase)
- [ ] No new error types in Sentry/error tracking
- [ ] Deployment annotation added to monitoring dashboard

### Automated Smoke Test Script
```

```bash
#!/bin/bash
# Automated post-deploy smoke test
BASE_URL="https://{{PRODUCTION_DOMAIN}}"

echo "=== Post-Deploy Smoke Tests ==="

# Health check
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")
if [ "$STATUS" != "200" ]; then
  echo "FAIL: Health check returned $STATUS"
  exit 1
fi
echo "PASS: Health check"

# Homepage
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$STATUS" != "200" ]; then
  echo "FAIL: Homepage returned $STATUS"
  exit 1
fi
echo "PASS: Homepage loads"

# API response check
RESPONSE=$(curl -s "$BASE_URL/api/health")
if ! echo "$RESPONSE" | grep -q '"status":"ok"'; then
  echo "FAIL: Health API response unexpected: $RESPONSE"
  exit 1
fi
echo "PASS: API responding correctly"

echo "=== All smoke tests passed ==="
```

---

## 6. Monitoring During Deploy

What to watch during and immediately after a deploy.

### Dashboard Requirements

| Panel | Metric | Alert Threshold |
|-------|--------|----------------|
| **Error rate** | 5xx responses / total responses | >1% for 3 min |
| **Latency** | p50, p95, p99 response time | p99 >5s for 3 min |
| **Traffic** | Requests per second | >50% drop from baseline (might indicate broken routing) |
| **CPU** | Average CPU utilization | >80% sustained |
| **Memory** | Average memory utilization | >85% sustained |
| **Database** | Connection count, query latency | Connections >80% of pool, query p95 >200ms |
| **External services** | Stripe, auth provider, email API response times | Any 5xx from external services |
| **Client errors** | JavaScript errors from browser | >2x baseline |

### Deploy Monitoring Timeline

```
T-5 min:  Check baseline metrics. Screenshot or note current error rate, latency, traffic.
T-0:      Deploy triggered.
T+1 min:  Verify new version is serving traffic (check version endpoint or deploy ID).
T+2 min:  Run automated smoke tests.
T+5 min:  Check error rate and latency. Compare to baseline.
T+15 min: Check business metrics (signups, conversions, if real-time).
T+30 min: Final check. If all green, deploy is considered stable.
T+1 hr:   Monitoring enters normal mode. Deploy annotation marks the timestamp.
```

---

## 7. Incident Response During Deploy

When a deploy goes wrong and smoke tests or monitoring catch it.

### Incident Response Flowchart

```
Deploy detected as problematic
│
├── Is the issue affecting users RIGHT NOW?
│   ├── YES → Roll back immediately (don't investigate first)
│   │         → Notify stakeholders: "Rolling back deploy {{DEPLOY_ID}} due to {{ISSUE}}"
│   │         → After rollback: verify old version is stable
│   │         → Schedule post-mortem
│   │
│   └── NO → Is the issue likely to affect users soon?
│       ├── YES → Roll back as precaution
│       └── NO → Attempt hotfix if fix is <15 minutes
│               → If fix takes >15 minutes → Roll back, fix properly, re-deploy
│
└── Post-incident (regardless of rollback or hotfix):
    ├── Document what happened (timeline)
    ├── Root cause analysis
    ├── Add missing test/monitoring for the failure mode
    └── Update smoke tests if they didn't catch it
```

### Communication Template

```markdown
## Deploy Incident — {{DATE}}

**Severity:** SEV-{{LEVEL}}
**Deploy ID:** {{DEPLOY_ID}}
**Timeline:**
- {{TIME}} — Deploy triggered
- {{TIME}} — Issue detected: {{ISSUE_DESCRIPTION}}
- {{TIME}} — Rollback initiated
- {{TIME}} — Service restored

**Impact:**
- Duration: {{MINUTES}} minutes
- Users affected: ~{{COUNT}}
- Revenue impact: {{IMPACT}}

**Root cause:** {{ROOT_CAUSE}}

**Action items:**
- [ ] {{ACTION_1}}
- [ ] {{ACTION_2}}
```

---

## 8. Project-Specific Deploy Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Deployment platform | {{DEPLOYMENT_TARGET}} | |
| Deploy trigger | {{TRIGGER}} (e.g., merge to main, manual, tag) | |
| Deploy frequency | {{FREQUENCY}} (e.g., multiple daily, weekly) | |
| Rollback method | {{ROLLBACK_METHOD}} | |
| Feature flag system | {{FLAG_SYSTEM}} | |
| Smoke test automation | {{SMOKE_TEST_STATUS}} (manual / partial / full) | |
| Deploy freeze schedule | {{FREEZE_SCHEDULE}} | |
| On-call during deploy | {{ON_CALL_REQUIRED}} (yes / no) | |
| Approval required | {{APPROVAL_REQUIRED}} (yes / no, who) | |
