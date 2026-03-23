# SLO / SLI / Error Budget Framework — {{PROJECT_NAME}}

> **Purpose:** Define measurable reliability targets so the team knows exactly when the system is "good enough" and when to stop feature work and fix reliability.

**Project Phase:** {{PROJECT_PHASE}}
**Review Cadence:** {{SLO_REVIEW_CADENCE}}
**Last Review:** {{LAST_REVIEW_DATE}}
**SLO Owner:** {{SLO_OWNER}}

---

## 1. Availability Targets by Project Phase

Not every project needs five nines. Over-investing in reliability too early wastes time. Under-investing at scale loses customers.

| Phase | Target | Monthly Downtime Budget | Rationale |
|-------|--------|------------------------|-----------|
| **MVP / Prototype** | 99.0% | 7 hours 18 min | You're validating the idea. Users tolerate some roughness. Spend time on features. |
| **Early Growth** (paying customers) | 99.5% | 3 hours 39 min | Real users depend on you. Outages now cost reputation. |
| **Growth** (>1K users) | 99.9% | 43 min 28 sec | Downtime visibly impacts revenue. Invest in redundancy. |
| **Scale** (>10K users) | 99.95% | 21 min 44 sec | Requires active-active infra, automated failover. |
| **Enterprise** | 99.99% | 4 min 21 sec | Contractual SLAs. Requires dedicated SRE. Do not target this unless customers demand it. |

> **Gotcha:** "Availability" means different things. Define it precisely: Is a 10-second blip downtime? Is degraded performance (slow but working) counted? Document your measurement method below.

### Availability Measurement

```
Availability = (Total Minutes - Downtime Minutes) / Total Minutes * 100

Downtime is defined as: {{DOWNTIME_DEFINITION}}
Measurement source: {{MONITORING_TOOL}} (e.g., Checkly, UptimeRobot, Datadog Synthetics)
Measurement interval: {{CHECK_INTERVAL}} (recommend: 1-minute checks from 3+ regions)
```

**Common mistake:** Measuring availability only from your server's perspective. Your server can return 200 OK while a CDN, DNS, or third-party auth provider is down. Measure from the user's perspective with synthetic checks.

---

## 2. Error Budget Calculation

The error budget is the inverse of your availability target. It's the amount of unreliability you're allowed before you must stop feature work and focus on reliability.

### Formula

```
Error Budget (minutes/month) = 30 days * 24 hours * 60 min * (1 - SLO target)

99.0%  → 30 * 24 * 60 * 0.01  = 432 minutes  (7h 12m)
99.5%  → 30 * 24 * 60 * 0.005 = 216 minutes  (3h 36m)
99.9%  → 30 * 24 * 60 * 0.001 = 43.2 minutes
99.95% → 30 * 24 * 60 * 0.0005 = 21.6 minutes
99.99% → 30 * 24 * 60 * 0.0001 = 4.32 minutes
```

### Error Budget Consumption Tracking

| Week | Incidents | Downtime Used | Budget Remaining | Status |
|------|-----------|---------------|-----------------|--------|
| Week 1 | {{INCIDENT_COUNT}} | {{MINUTES}} min | {{REMAINING}} min | {{STATUS}} |
| Week 2 | {{INCIDENT_COUNT}} | {{MINUTES}} min | {{REMAINING}} min | {{STATUS}} |
| Week 3 | {{INCIDENT_COUNT}} | {{MINUTES}} min | {{REMAINING}} min | {{STATUS}} |
| Week 4 | {{INCIDENT_COUNT}} | {{MINUTES}} min | {{REMAINING}} min | {{STATUS}} |

**Budget status values:** `GREEN` (>50% remaining), `YELLOW` (25-50% remaining), `RED` (<25% remaining), `EXHAUSTED` (0% remaining)

### What Happens When the Budget Is Exhausted

This is the part most teams skip. An SLO without consequences is just a suggestion.

| Budget Status | Action |
|--------------|--------|
| **GREEN** | Normal feature development. Ship freely. |
| **YELLOW** | Reliability work gets 30% of sprint capacity. Risky deploys need extra review. |
| **RED** | Feature freeze for non-critical items. All hands on reliability. No Friday deploys. |
| **EXHAUSTED** | Full freeze. Only reliability fixes and critical security patches ship. Post-mortem required for every incident. |

> **Gotcha:** Teams often set SLOs and then ignore exhausted budgets because a feature deadline is "more important." If leadership overrides the error budget, document it. Repeated overrides mean your SLO is set too high — lower it to something you'll actually respect.

---

## 3. API Response Time SLOs

Response time targets vary by operation type. A search endpoint and a simple GET have different acceptable latencies.

| Operation Type | Examples | p50 Target | p95 Target | p99 Target |
|---------------|----------|-----------|-----------|-----------|
| **Read (single)** | GET /api/users/:id | <50ms | <150ms | <500ms |
| **Read (list)** | GET /api/users?page=1 | <100ms | <200ms | <800ms |
| **Create** | POST /api/users | <150ms | <500ms | <1s |
| **Update** | PATCH /api/users/:id | <100ms | <300ms | <800ms |
| **Delete** | DELETE /api/users/:id | <50ms | <200ms | <500ms |
| **Search** (full-text) | GET /api/search?q=term | <300ms | <1s | <3s |
| **File upload** | POST /api/upload | <500ms | <3s | <10s |
| **Report generation** | GET /api/reports/monthly | <1s | <5s | <15s |
| **Webhook delivery** | POST (outbound) | <200ms | <1s | <3s |
| **Auth (login)** | POST /api/auth/login | <200ms | <500ms | <1.5s |

### Measurement

```
Where to measure: At the API gateway or load balancer, NOT inside the application.
                   Application-level timing misses serialization, middleware, and network overhead.

Tools: {{APM_TOOL}} (e.g., Datadog APM, New Relic, Sentry Performance)

What to exclude: Health checks (/healthz), OPTIONS preflight requests, static assets
```

**Common mistake:** Measuring averages instead of percentiles. An average of 100ms can hide a p99 of 8 seconds. Always use p95/p99.

**Common mistake:** Setting the same latency target for every endpoint. Your autocomplete endpoint (called on every keystroke) needs to be faster than your CSV export endpoint.

### Project-Specific API SLOs

| Endpoint | Method | p95 Target | p99 Target | Notes |
|----------|--------|-----------|-----------|-------|
| {{ENDPOINT_1}} | {{METHOD}} | {{P95_MS}}ms | {{P99_MS}}ms | {{NOTES}} |
| {{ENDPOINT_2}} | {{METHOD}} | {{P95_MS}}ms | {{P99_MS}}ms | {{NOTES}} |
| {{ENDPOINT_3}} | {{METHOD}} | {{P95_MS}}ms | {{P99_MS}}ms | {{NOTES}} |

---

## 4. Web Vitals Budgets

Google's Core Web Vitals directly affect SEO ranking and user experience. These are not aspirational — they're thresholds with real consequences.

| Metric | Good | Needs Improvement | Poor | Your Target |
|--------|------|-------------------|------|-------------|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5s–4.0s | >4.0s | {{LCP_TARGET}} |
| **INP** (Interaction to Next Paint) | <200ms | 200ms–500ms | >500ms | {{INP_TARGET}} |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1–0.25 | >0.25 | {{CLS_TARGET}} |
| **FCP** (First Contentful Paint) | <1.8s | 1.8s–3.0s | >3.0s | {{FCP_TARGET}} |
| **TTFB** (Time to First Byte) | <800ms | 800ms–1.8s | >1.8s | {{TTFB_TARGET}} |

### How to Measure

```bash
# Lab data (consistent, reproducible, but synthetic)
npx lighthouse https://{{DOMAIN}} --output=json --output-path=./lighthouse-report.json

# Field data (real users, noisy, but truthful)
# Use Chrome UX Report API or web-vitals JS library:
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(metric => sendToAnalytics('LCP', metric));
onINP(metric => sendToAnalytics('INP', metric));
onCLS(metric => sendToAnalytics('CLS', metric));
```

### Common CLS Offenders (Fix These First)

1. **Images without width/height attributes** — browser can't reserve space before load
2. **Web fonts causing FOUT/FOIT** — use `font-display: swap` + preload critical fonts
3. **Dynamic content injected above the fold** — banners, cookie notices, ads
4. **Client-side rendering replacing server-rendered placeholder** — hydration mismatch

### Common LCP Offenders

1. **Hero image not preloaded** — add `<link rel="preload" as="image" href="...">`
2. **Render-blocking CSS/JS** — defer non-critical resources
3. **Server response time** — fix TTFB first, LCP can't be faster than TTFB
4. **Third-party scripts blocking main thread** — load analytics/chat widgets async

---

## 5. Bundle Size Budgets

Every kilobyte costs mobile users real money and time. Set hard limits and enforce them in CI.

| Asset Type | Budget (gzipped) | Alarm Threshold | Action If Exceeded |
|-----------|------------------|-----------------|-------------------|
| **JS (total)** | <200KB | >250KB | Block merge. Analyze with `npx bundle-analyzer`. |
| **JS (per route chunk)** | <50KB | >75KB | Code-split or lazy-load. |
| **CSS (total)** | <50KB | >75KB | Audit for unused styles. Purge with PurgeCSS/Tailwind. |
| **Images (per image)** | <200KB | >500KB | Compress, convert to WebP/AVIF, resize. |
| **Fonts (total)** | <100KB | >150KB | Subset fonts. Use `unicode-range`. Limit to 2 font families. |
| **Third-party scripts** | <100KB | >150KB | Audit necessity. Load async. Consider self-hosting. |

### Enforcement in CI

```bash
# Using bundlesize (package.json)
"bundlesize": [
  { "path": ".next/static/chunks/*.js", "maxSize": "50 KB" },
  { "path": ".next/static/css/*.css", "maxSize": "50 KB" }
]

# Using Next.js built-in (next.config.js)
experimental: {
  bundlePagesRouterDependencies: true,
}

# Using size-limit
npx size-limit --why  # Shows what's taking space
```

**Common mistake:** Not accounting for third-party scripts. Your bundle is 180KB but then you add Intercom (200KB), Google Analytics (30KB), and Sentry (30KB). Total JS is now 440KB. Track everything.

---

## 6. Database Query Budgets

Slow queries are the #1 cause of API latency problems. Set limits early.

| Metric | Budget | How to Enforce |
|--------|--------|---------------|
| **Queries per page load** | <5 | Use query logging middleware. Alert if any page triggers >5 queries. |
| **Queries per API call** | <3 | Same as above. N+1 queries are the usual offender. |
| **Query execution time (p95)** | <100ms | Slow query log threshold. Auto-alert on violations. |
| **Query execution time (p99)** | <500ms | Investigate any query consistently above this. |
| **Connection pool utilization** | <70% | Alert at 70%. At 90% you'll start seeing timeouts. |
| **Total DB connections** | <{{MAX_CONNECTIONS}} | Set based on your DB plan. Serverless functions can exhaust pools fast. |

### N+1 Query Detection

```
# The most common performance bug in web applications.

# BAD: N+1 (1 query for posts + N queries for authors)
const posts = await db.query("SELECT * FROM posts LIMIT 20");
for (const post of posts) {
  post.author = await db.query("SELECT * FROM users WHERE id = ?", [post.authorId]);
}
// Result: 21 queries for 20 posts

# GOOD: JOIN or batch query (2 queries total)
const posts = await db.query(`
  SELECT posts.*, users.name as authorName
  FROM posts
  JOIN users ON posts.authorId = users.id
  LIMIT 20
`);
// Result: 1 query for 20 posts with authors
```

### Query Monitoring Setup

```sql
-- PostgreSQL: Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 100;  -- Log queries taking >100ms
SELECT pg_reload_conf();

-- Find your slowest queries
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

**Common mistake:** Using an ORM and never looking at the SQL it generates. ORMs love producing N+1 queries, unnecessary JOINs, and `SELECT *` when you only need two columns. Enable query logging in development.

---

## 7. SLO Review Process

### Review Cadence

| Project Phase | Review Frequency | Attendees | Duration |
|--------------|-----------------|-----------|----------|
| MVP | Weekly | Eng lead + 1 dev | 15 min |
| Growth | Bi-weekly | Eng lead + PM | 30 min |
| Scale | Monthly | Eng lead + PM + SRE | 45 min |
| Enterprise | Weekly | SRE team + on-call | 30 min |

### Review Agenda Template

```markdown
## SLO Review — {{REVIEW_DATE}}

### 1. Error Budget Status
- Current budget remaining: __% (__min of __min)
- Budget consumption rate: __ min/week (trend: increasing/stable/decreasing)
- Projected exhaustion date: ______

### 2. SLO Violations This Period
| SLO | Target | Actual | Gap | Root Cause |
|-----|--------|--------|-----|------------|
|     |        |        |     |            |

### 3. Top 3 Reliability Risks
1.
2.
3.

### 4. Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
|        |       |          |

### 5. SLO Adjustments (if any)
- Proposed change:
- Justification:
- Effective date:
```

---

## 8. Breach Response Protocol

When an SLO is violated, follow this escalation path. Do not wait until the monthly review.

### Severity Classification

| Severity | Criteria | Response Time | Notification |
|----------|----------|--------------|--------------|
| **SEV-1** | Complete outage, all users affected | Immediately | Page on-call, notify stakeholders |
| **SEV-2** | Partial outage or >50% error rate | <15 min | Page on-call |
| **SEV-3** | Performance degradation, SLO breach | <1 hour | Slack alert to eng channel |
| **SEV-4** | SLO approaching threshold (warning) | Next business day | Automated alert |

### Response Checklist

```markdown
## Incident Response — {{INCIDENT_DATE}}

- [ ] Incident detected at: ___
- [ ] On-call acknowledged at: ___
- [ ] Initial assessment: (what's broken, who's affected, what's the blast radius)
- [ ] Mitigation started at: ___
- [ ] Mitigation: (rollback / feature flag / scaling / DNS failover)
- [ ] Service restored at: ___
- [ ] Total downtime: ___ minutes
- [ ] Error budget consumed: ___ minutes (___% of monthly budget)
- [ ] Post-mortem scheduled: yes / no (required for SEV-1 and SEV-2)
- [ ] Post-mortem completed: ___
- [ ] Action items from post-mortem entered in tracker: yes / no
```

> **Gotcha:** The most common failure mode is not the incident itself — it's the lack of a post-mortem. Without a post-mortem, the same incident repeats. Make post-mortems blameless and mandatory for SEV-1/SEV-2.

---

## 9. Project-Specific SLOs

Fill this section with SLOs specific to {{PROJECT_NAME}}.

| SLO Name | Metric | Target | Measurement Source | Owner |
|----------|--------|--------|--------------------|-------|
| {{SLO_NAME_1}} | {{METRIC}} | {{TARGET}} | {{SOURCE}} | {{OWNER}} |
| {{SLO_NAME_2}} | {{METRIC}} | {{TARGET}} | {{SOURCE}} | {{OWNER}} |
| {{SLO_NAME_3}} | {{METRIC}} | {{TARGET}} | {{SOURCE}} | {{OWNER}} |
| {{SLO_NAME_4}} | {{METRIC}} | {{TARGET}} | {{SOURCE}} | {{OWNER}} |
| {{SLO_NAME_5}} | {{METRIC}} | {{TARGET}} | {{SOURCE}} | {{OWNER}} |

### SLO Dependencies

Map which SLOs depend on external services:

| SLO | Depends On | External SLA | Risk If External Fails |
|-----|-----------|-------------|----------------------|
| {{SLO_NAME}} | {{PROVIDER}} (e.g., Stripe, Auth0, AWS S3) | {{EXTERNAL_SLA}} | {{RISK_DESCRIPTION}} |

> **Gotcha:** Your availability can never exceed your least-reliable dependency. If your auth provider has 99.9% uptime and your payment provider has 99.95%, your realistic ceiling is ~99.85% (assuming independent failures). Don't promise 99.99% when your dependencies can't support it.

---

## Appendix: SLO Anti-Patterns

| Anti-Pattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| Setting SLOs but never reviewing them | They become decoration. No one knows if they're met. | Calendar the review. Make it a ritual. |
| Targeting 99.99% for an MVP | You'll spend all your time on infra instead of features | Start at 99%. Tighten as you grow. |
| Using averages instead of percentiles | Averages hide outliers. 100ms average can mean 10% of users wait 2s. | Always use p95/p99. |
| SLOs without consequences | If nothing changes when you breach, the SLO is meaningless | Define the error budget policy and enforce it. |
| Copying another company's SLOs | Your users, architecture, and constraints are different | Derive SLOs from your actual user expectations and business needs. |
| Not including third-party dependencies | You promise 99.9% but your auth provider is 99.5% | Map dependencies and factor in their reliability. |
