# Deployment Patterns

> Every deployment pattern is a tradeoff between risk, complexity, rollback speed, and cost. Choose the pattern that matches your risk tolerance and operational maturity.

---

## Pattern Overview

| Pattern | Risk Level | Complexity | Rollback Speed | Extra Cost | Best For |
|---------|-----------|------------|----------------|-----------|---------|
| **Recreate** | High | None | Slow (redeploy) | None | Dev environments, non-critical |
| **Rolling Update** | Low-Medium | Low | Medium (2-5 min) | None | Most production workloads |
| **Blue-Green** | Low | Medium | Instant (< 1 min) | 2x infra during deploy | High-availability applications |
| **Canary** | Very Low | High | Instant (< 1 min) | Small (canary %) | High-traffic, metrics-driven teams |
| **Feature Flags** | Very Low | Medium | Instant (toggle) | Flag service cost | Any, best combined with other patterns |

---

## 1. Recreate Deployment

**How it works:** Stop the old version, start the new version. There is downtime between stop and start.

```
Time ──────────────────────────────────────▶

Old Version:  ██████████████████████░░░░░░░░░░░░░░░░░░░░░
                                    ↑ downtime
New Version:  ░░░░░░░░░░░░░░░░░░░░░░░░░██████████████████
```

**Implementation:**
```bash
# Simple recreate: stop old, start new
docker stop my-app
docker rm my-app
docker run -d --name my-app my-app:v2
```

**Pros:**
- Simplest possible deployment
- No resource duplication
- Clean state (no mixed-version traffic)

**Cons:**
- Downtime during deployment (seconds to minutes)
- No rollback path except redeploying old version
- Users experience interruption

**Use when:**
- Development or staging environments
- Background workers that can tolerate restarts
- Scheduled maintenance windows are acceptable
- The application cannot run two versions simultaneously (e.g., breaking DB migration)

---

## 2. Rolling Update

**How it works:** Replace instances one at a time (or in small batches). At any given moment, both old and new versions are running. Traffic shifts gradually as instances are replaced.

```
Time ──────────────────────────────────────▶

Instance 1:  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░
             old old old old old  new new new new new new

Instance 2:  ████████████████████████████░░░░░░░░░░░░░░░
             old old old old old old old  new new new new

Instance 3:  ████████████████████████████████████░░░░░░░
             old old old old old old old old old  new new

Traffic:     100% old ──▶ 66% old/33% new ──▶ 33%/66% ──▶ 100% new
```

**Implementation (Kubernetes):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Allow 1 extra pod during update
      maxUnavailable: 0   # Never have fewer than 3 healthy pods
  template:
    spec:
      containers:
        - name: my-app
          image: my-app:v2
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

**Implementation (ECS):**
```json
{
  "deploymentConfiguration": {
    "maximumPercent": 200,
    "minimumHealthyPercent": 100
  }
}
```

**Pros:**
- Zero downtime (when configured correctly)
- No extra infrastructure cost
- Built-in to most orchestrators (Kubernetes, ECS, etc.)
- Gradual rollout catches issues before full deployment

**Cons:**
- Both versions run simultaneously (must be backward-compatible)
- Rollback requires deploying the old version (2-5 minutes)
- Complex database migrations can be tricky (old code must work with new schema)
- Health check configuration is critical (bad checks = bad deploys)

**Use when:**
- Standard production deployments
- Your application supports running two versions simultaneously
- You do not need instant rollback

---

## 3. Blue-Green Deployment

**How it works:** Maintain two identical environments (Blue and Green). One is live (serving traffic), the other is idle. Deploy to the idle environment, verify it works, then switch traffic. The old environment remains available for instant rollback.

```
Time ──────────────────────────────────────▶

Blue (v1):   ████████████████████████████████████████░░░░
             live  live  live  live  live  live  standby

Green (v2):  ░░░░░░░░░░░deploy░░test░░░░░████████████████
             idle  idle  idle  idle  idle  live  live

Traffic:     ──── Blue ────────────────── ┤ ──── Green ──
                                    switch ↑
```

**Implementation (AWS ALB):**
```bash
# 1. Deploy new version to green target group
aws ecs update-service --cluster prod --service my-app-green --task-definition my-app:v2

# 2. Wait for green to be healthy
aws ecs wait services-stable --cluster prod --services my-app-green

# 3. Run smoke tests against green
curl -f https://green.internal.example.com/health

# 4. Switch ALB traffic from blue to green
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$GREEN_TARGET_GROUP

# 5. Rollback: switch back to blue (instant)
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$BLUE_TARGET_GROUP
```

**Implementation (Vercel):**
Vercel does blue-green by default. Every deploy creates a new "green" deployment. Promoting to production switches traffic instantly. Rolling back promotes the previous deployment.

```bash
# Deploy (creates new deployment, does not affect production)
vercel deploy --prod=false

# Verify the preview URL
curl -f https://my-app-abc123.vercel.app/health

# Promote to production (instant traffic switch)
vercel promote <deployment-url>

# Rollback (promote previous deployment)
vercel rollback
```

**Pros:**
- Instant rollback (switch traffic back in < 1 minute)
- Zero downtime
- Full testing of new version before any users see it
- Clean separation between old and new versions

**Cons:**
- 2x infrastructure cost during deployment (both environments running)
- Database must be shared between blue and green (schema must be compatible)
- More complex infrastructure setup
- Idle environment still costs money (unless using serverless)

**Use when:**
- High-availability applications where rollback speed is critical
- You need to test the full deployment before exposing to users
- Compliance requires pre-production verification of the exact production build
- Using a platform that provides blue-green natively (Vercel, AWS CodeDeploy)

---

## 4. Canary Release

**How it works:** Deploy the new version to a small percentage of traffic (the "canary"). Monitor error rates, latency, and business metrics. If the canary is healthy, gradually increase traffic. If the canary fails, route all traffic back to the stable version.

```
Time ──────────────────────────────────────▶

Stable (v1): ██████████████████████████████████████░░░░░
             100%  95%   90%   75%   50%   25%   0%

Canary (v2): ░░░░░░██████████████████████████████████████
             0%    5%    10%   25%   50%   75%   100%

             ↑     ↑     ↑     ↑     ↑     ↑     ↑
           deploy  ramp  ramp  ramp  ramp  ramp  complete
```

**Implementation (NGINX):**
```nginx
upstream backend {
    server stable.internal:3000 weight=95;
    server canary.internal:3000 weight=5;
}
```

**Implementation (AWS ALB with weighted target groups):**
```bash
# 5% canary
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions '[
    {
      "Type": "forward",
      "ForwardConfig": {
        "TargetGroups": [
          {"TargetGroupArn": "'$STABLE_TG'", "Weight": 95},
          {"TargetGroupArn": "'$CANARY_TG'", "Weight": 5}
        ]
      }
    }
  ]'

# Monitor for 15 minutes, then ramp to 25%
aws elbv2 modify-listener --listener-arn $LISTENER_ARN \
  --default-actions '[
    {
      "Type": "forward",
      "ForwardConfig": {
        "TargetGroups": [
          {"TargetGroupArn": "'$STABLE_TG'", "Weight": 75},
          {"TargetGroupArn": "'$CANARY_TG'", "Weight": 25}
        ]
      }
    }
  ]'
```

**Implementation (Google Cloud Run):**
```bash
# Deploy new revision without serving traffic
gcloud run deploy my-app --image my-app:v2 --no-traffic

# Send 5% traffic to canary
gcloud run services update-traffic my-app --to-revisions my-app-v2=5

# Ramp to 50%
gcloud run services update-traffic my-app --to-revisions my-app-v2=50

# Full rollout
gcloud run services update-traffic my-app --to-revisions my-app-v2=100

# Rollback: send all traffic to previous revision
gcloud run services update-traffic my-app --to-revisions my-app-v1=100
```

**Canary Promotion Criteria:**
```
Monitor for at least 15 minutes at each ramp level:

1. Error rate: Must stay within 0.5% of baseline
2. P50 latency: Must stay within 10% of baseline
3. P99 latency: Must stay within 20% of baseline
4. Business metrics: Conversion rate, signups must not drop
5. No new error types in error tracking (Sentry, Datadog)

If any metric breaches threshold → automatic rollback to 0% canary
```

**Pros:**
- Lowest risk deployment pattern
- Real user traffic validates the new version
- Instant rollback (route all traffic to stable)
- Metrics-driven promotion (data over gut feeling)

**Cons:**
- Most complex to implement and operate
- Requires robust monitoring and alerting
- Traffic splitting adds latency overhead
- Users on canary may see different behavior (support confusion)
- Stateful sessions can be disrupted by traffic rebalancing

**Use when:**
- High-traffic applications (enough traffic to generate meaningful metrics)
- Risk-averse organizations (finance, healthcare, enterprise)
- Team has mature monitoring and observability
- Changes have potential for subtle performance regressions

---

## 5. Feature Flags as Deployment

**How it works:** Deploy the code for new features to production but keep them disabled behind feature flags. Enable features independently of deployment. This decouples "deploy" from "release."

```
Deploy code ──────────────────────────────▶
(feature hidden)   (flag on for 10%)   (flag on for all)

Code is live:  ██████████████████████████████████████████
Feature off:   ██████████████████░░░░░░░░░░░░░░░░░░░░░░░
Feature 10%:   ░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░
Feature 100%:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░██████████████
```

**Implementation:**
```typescript
// Using a feature flag service (LaunchDarkly, Unleash, Flagsmith)
import { getFlag } from './feature-flags';

export async function handleRequest(req: Request) {
  const showNewCheckout = await getFlag('new-checkout', {
    userId: req.user.id,
    // percentage: 10  // rollout percentage configured in flag service
  });

  if (showNewCheckout) {
    return renderNewCheckout(req);
  }
  return renderLegacyCheckout(req);
}
```

**Feature Flag Services:**

| Service | Free Tier | Pricing | Strengths |
|---------|-----------|---------|-----------|
| **LaunchDarkly** | No | $10/seat/month | Enterprise leader, most features |
| **Unleash** | OSS (self-hosted) | $80/month (hosted) | Open source, self-hostable |
| **Flagsmith** | 50K requests/mo | $45/month | Open source, simple UI |
| **PostHog** | 1M events/mo | $0 (self-hosted) | Integrated with analytics |
| **Vercel Edge Config** | 1K reads/mo | Included in Pro | Fastest for Vercel projects |
| **Environment variables** | Free | Free | Simplest, no UI, restart needed |

**Pros:**
- Zero-risk deployments (code is deployed but feature is off)
- Instant enable/disable without redeployment
- Gradual rollout (10%, 25%, 50%, 100%)
- User targeting (enable for specific users, beta testers, internal team)
- Kill switch for emergencies (disable broken feature in seconds)

**Cons:**
- Adds code complexity (branching logic everywhere)
- Flag debt accumulates (old flags left in code)
- Testing combinatorial explosion (feature A on/off x feature B on/off)
- Requires a flag management process (who can toggle what, when)
- Stale flags become security and maintenance risks

**Use when:**
- You want to separate "deploy" from "release"
- You need instant rollback of specific features (not entire deployments)
- You want to A/B test features
- You have a large enough team that coordination is a bottleneck
- Best combined with any other deployment pattern (rolling + flags, canary + flags)

---

## Implementation Per Provider

### Vercel

Vercel provides blue-green deployments out of the box. Every `git push` creates a new deployment. Production promotion is instant.

```bash
# Preview deployment (created automatically on PR)
# URL: my-app-<hash>.vercel.app

# Production deployment
vercel --prod
# or: merge PR to main (auto-deploy)

# Rollback to previous production deployment
vercel rollback

# Promote a specific deployment to production
vercel promote <deployment-url>
```

**Deployment features:**
- Automatic preview URLs for every PR
- Instant production rollback
- Edge network (global CDN)
- Skew protection (ensures client and server versions match)
- Built-in analytics and speed insights

### AWS

**ECS Rolling Update:**
```yaml
# task-definition.json
{
  "containerDefinitions": [{
    "name": "my-app",
    "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:v2",
    "portMappings": [{"containerPort": 3000}],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
      "interval": 10,
      "timeout": 5,
      "retries": 3
    }
  }]
}
```

```bash
# Update service (triggers rolling update)
aws ecs update-service --cluster prod --service my-app \
  --task-definition my-app:v2 \
  --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"
```

**CodeDeploy Blue-Green:**
```yaml
# appspec.yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:us-east-1:123456789:task-definition/my-app:v2"
        LoadBalancerInfo:
          ContainerName: "my-app"
          ContainerPort: 3000
Hooks:
  - BeforeAllowTraffic: "LambdaFunctionToValidate"
  - AfterAllowTraffic: "LambdaFunctionForSmokeTests"
```

### Google Cloud

**Cloud Run (Canary / Traffic Splitting):**
```bash
# Deploy new revision (no traffic)
gcloud run deploy my-app \
  --image gcr.io/my-project/my-app:v2 \
  --no-traffic \
  --region us-central1

# Split traffic: 90% stable, 10% canary
gcloud run services update-traffic my-app \
  --to-revisions my-app-v1=90,my-app-v2=10 \
  --region us-central1

# Full rollout
gcloud run services update-traffic my-app \
  --to-latest \
  --region us-central1

# Rollback
gcloud run services update-traffic my-app \
  --to-revisions my-app-v1=100 \
  --region us-central1
```

### Railway

```bash
# Railway deploys automatically on git push
# Rollback via Railway dashboard or CLI

# Redeploy a specific commit
railway up --commit <sha>

# Railway supports preview environments per PR
# Configure in railway.json or dashboard
```

---

## Database Migration Deployment Strategy

Database migrations are the hardest part of zero-downtime deployments. A bad migration can make rollback impossible.

### The Expand-Contract Pattern

This is the only safe way to make breaking schema changes with zero downtime.

```
Phase 1: EXPAND (backward-compatible)
├── Add new column (nullable or with default)
├── Deploy code that writes to BOTH old and new columns
├── Backfill new column from old column
└── Verify data consistency

Phase 2: MIGRATE (switch reads)
├── Deploy code that reads from new column
├── Old column still receives writes (safety net)
└── Monitor for issues

Phase 3: CONTRACT (clean up)
├── Deploy code that only uses new column
├── Drop old column
└── Remove migration code
```

**Example: Renaming a column**

```sql
-- Phase 1: Expand (deploy with code that writes to both)
ALTER TABLE users ADD COLUMN full_name TEXT;
UPDATE users SET full_name = name WHERE full_name IS NULL;

-- Phase 2: Migrate (deploy code that reads from full_name)
-- Application code now reads full_name, writes to both name and full_name

-- Phase 3: Contract (deploy code that only uses full_name)
ALTER TABLE users DROP COLUMN name;
```

Each phase is a separate deployment with its own PR, review, and promotion cycle. Never combine phases.

### Migration Anti-Patterns

| Anti-Pattern | Why It Is Dangerous |
|-------------|---------------------|
| Renaming a column in one step | Old code cannot find the column, instant 500 errors |
| Adding a NOT NULL column without default | Existing rows violate constraint, migration fails |
| Locking a large table for migration | Table is unavailable during migration, requests timeout |
| Running migrations in the deploy step | If migration fails, deploy is stuck in a broken state |
| No rollback plan for migrations | You are one bad migration away from a multi-hour outage |

---

## Choosing Your Pattern

### Decision Flowchart

```
Is this a development/staging environment?
├── YES → Recreate (simplest, downtime is fine)
│
└── NO (production) →
    │
    ├── Does your platform handle deployments? (Vercel, Netlify, Railway)
    │   └── YES → Use platform's built-in pattern (usually blue-green)
    │
    ├── Do you have < 1,000 daily active users?
    │   └── YES → Rolling update (sufficient for most small-medium apps)
    │
    ├── Do you need instant rollback?
    │   └── YES → Blue-green (< 1 min rollback)
    │
    ├── Do you have > 10,000 daily active users AND monitoring?
    │   └── YES → Canary release (metrics-driven, lowest risk)
    │
    └── All of the above → Feature flags + any deployment pattern
```

### Recommended Starting Point

For most teams:

1. **Start with rolling updates** (built into every orchestrator, zero extra cost)
2. **Add feature flags** for high-risk features (decouple deploy from release)
3. **Graduate to blue-green** when you need instant rollback
4. **Graduate to canary** when you have enough traffic and monitoring maturity

Do not start with canary deployments. The monitoring and tooling requirements are significant, and without them, canary is just a slow rolling update.
