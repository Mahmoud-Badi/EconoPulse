# Post-Launch Metrics Dashboard

> **The metrics that tell you whether {{PROJECT_NAME}} is healthy, growing, or quietly dying.** This is not a vanity metrics dashboard. Every metric here has an alerting threshold, a review cadence, and a "what to do when it is red" action plan.

---

## Dashboard Philosophy

There are two types of metrics: metrics you look at and metrics that look at you. Vanity metrics (page views, total signups, social followers) make you feel good but tell you nothing actionable. Health metrics tell you the truth, even when it hurts.

This dashboard is built around health metrics. Every metric has:
1. **A definition** — What exactly are we measuring?
2. **A target** — What does "good" look like?
3. **An alert threshold** — When should someone wake up?
4. **An action plan** — What do you do when the number is bad?

---

## Core Product Metrics

### Engagement: DAU/MAU Ratio

| Field | Value |
|-------|-------|
| **Definition** | Daily Active Users / Monthly Active Users. Measures how often your monthly users come back daily. |
| **Formula** | `DAU / MAU * 100` |
| **Target** | > 20% for B2B SaaS, > 30% for consumer apps, > 50% for communication/social tools |
| **Alert threshold** | Drops more than 5 percentage points week-over-week |
| **Review frequency** | Weekly |

**What "Active" Means for {{PROJECT_NAME}}:**

Define "active" precisely. A page view is not active. A meaningful action is active. Examples:

```
GOOD definitions of "active":
  - Created or edited a document
  - Completed a workflow
  - Sent a message
  - Made an API call

BAD definitions of "active":
  - Visited the login page
  - Opened the app but did nothing
  - Received a notification
  - Was logged in (session existed)
```

### Retention Curves

| Cohort | Definition | Target (B2B SaaS) | Target (Consumer) | Alert If Below |
|--------|-----------|-------------------|-------------------|----------------|
| **D1** | % of new users who return 1 day after signup | 40%+ | 25%+ | 20% |
| **D7** | % of new users who return 7 days after signup | 30%+ | 15%+ | 10% |
| **D30** | % of new users who return 30 days after signup | 20%+ | 8%+ | 5% |
| **D90** | % of new users who return 90 days after signup | 15%+ | 5%+ | 3% |

**How to read retention curves:**

```
100% ┐
     │\
     │ \  ← Steep drop = onboarding problem
     │  \___________  ← Flattening = retention (good!)
     │              \___  ← Continued decline = product-market fit problem
     │
  0% └─────────────────────
     D0  D1  D7  D30  D90
```

- **Steep initial drop, then flat:** Normal. Fix onboarding to reduce the initial drop.
- **Gradual continuous decline:** Dangerous. Users are not finding long-term value.
- **Flat from D1:** Exceptional. Your onboarding converts users to retained users immediately.

### Error Rates

| Metric | Definition | Target | Alert Threshold |
|--------|-----------|--------|-----------------|
| **Client error rate (4xx)** | % of requests returning 4xx status codes | < 2% | > 5% |
| **Server error rate (5xx)** | % of requests returning 5xx status codes | < 0.1% | > 0.5% |
| **Unhandled exception rate** | Unhandled exceptions per 1,000 sessions | < 1 | > 5 |
| **JavaScript error rate** | JS errors per 1,000 page loads | < 2 | > 10 |

**Action when error rate exceeds threshold:**

1. Check {{MONITORING_PROVIDER}} for the specific errors driving the spike
2. Determine if it is a single endpoint/page or systemic
3. If single endpoint: hotfix or disable the feature
4. If systemic: check recent deploys, infrastructure changes, or third-party outages
5. Communicate to users if user-facing impact exceeds 5 minutes

### Latency (Response Times)

| Percentile | Definition | Target | Alert Threshold |
|-----------|-----------|--------|-----------------|
| **p50** | Median response time (half of requests are faster) | < 200ms | > 500ms |
| **p95** | 95th percentile (only 5% of requests are slower) | < 1,000ms | > 2,000ms |
| **p99** | 99th percentile (only 1% of requests are slower) | < 3,000ms | > 5,000ms |

**Why p50 is not enough:**

If your p50 is 100ms but your p99 is 10 seconds, 1 in 100 users has a terrible experience. At 10,000 requests per day, that is 100 users daily seeing unacceptable performance. Always monitor p95 and p99.

### Uptime

| Metric | Definition | Target | Alert Threshold |
|--------|-----------|--------|-----------------|
| **Uptime percentage** | Time the application is available / Total time | 99.9% (3 nines) | < 99.5% |
| **Monthly downtime budget** | Minutes of downtime allowed per month at target | 43.8 minutes (at 99.9%) | N/A |
| **Mean Time to Recovery (MTTR)** | Average time from incident detection to resolution | < 30 minutes | > 60 minutes |
| **Mean Time Between Failures (MTBF)** | Average time between incidents | > 30 days | < 7 days |

**Uptime table for context:**

| Uptime | Annual Downtime | Monthly Downtime |
|--------|----------------|-----------------|
| 99% (two nines) | 3.65 days | 7.3 hours |
| 99.9% (three nines) | 8.76 hours | 43.8 minutes |
| 99.95% | 4.38 hours | 21.9 minutes |
| 99.99% (four nines) | 52.56 minutes | 4.38 minutes |
| 99.999% (five nines) | 5.26 minutes | 26.3 seconds |

Most startups should target three nines (99.9%). Four nines requires significant infrastructure investment. Five nines is for banks and hospitals.

---

## User Satisfaction Metrics

### Net Promoter Score (NPS)

| Field | Value |
|-------|-------|
| **Definition** | "How likely are you to recommend {{PROJECT_NAME}} to a colleague?" (0-10 scale) |
| **Formula** | `% Promoters (9-10) - % Detractors (0-6)` |
| **Target** | > 30 (Year 1), > 50 (Year 2+) |
| **Alert threshold** | Drops below 0 (more detractors than promoters) |
| **Measurement frequency** | Quarterly |
| **Sample size needed** | Minimum 100 responses for statistical significance |

### Customer Satisfaction Score (CSAT)

| Field | Value |
|-------|-------|
| **Definition** | "How satisfied are you with [specific interaction]?" (1-5 scale) |
| **Formula** | `(# of 4-5 responses / Total responses) * 100` |
| **Target** | > 85% |
| **Alert threshold** | < 70% |
| **Measurement frequency** | After every support interaction and monthly for product satisfaction |

### Customer Effort Score (CES)

| Field | Value |
|-------|-------|
| **Definition** | "How easy was it to [complete specific action]?" (1-7 scale) |
| **Formula** | Average score across responses |
| **Target** | > 5.5 / 7 |
| **Alert threshold** | < 4.0 / 7 (users are struggling) |
| **Measurement frequency** | After onboarding and after key workflows |

---

## Business Metrics

### Revenue and Growth

| Metric | Definition | Target | Alert Threshold |
|--------|-----------|--------|-----------------|
| **MRR** (Monthly Recurring Revenue) | Total recurring revenue per month | Growing month-over-month | Declining for 2+ consecutive months |
| **ARR** (Annual Recurring Revenue) | MRR * 12 | Reference metric | N/A (use MRR for alerts) |
| **ARPU** (Average Revenue Per User) | Total revenue / Active paying users | Stable or growing | Declining 10%+ month-over-month |
| **Conversion rate** (free to paid) | Paid users / Total signups | 2-5% (freemium), 10-25% (free trial) | Below 1% (freemium) or 5% (trial) |
| **Trial-to-paid rate** | Users who convert during/after trial | > 15% | < 8% |

### Churn

| Metric | Definition | Target | Alert Threshold |
|--------|-----------|--------|-----------------|
| **Monthly user churn** | Users who leave / Total users at start of month | < 5% (B2C), < 3% (B2B) | > 8% (B2C), > 5% (B2B) |
| **Monthly revenue churn** | Lost MRR / Starting MRR | < 2% | > 5% |
| **Net revenue retention** | (Starting MRR - Churn + Expansion) / Starting MRR | > 100% (expansion exceeds churn) | < 90% |
| **Logo churn** | Number of accounts that cancel / Total accounts | Track trend | Increasing for 3+ months |

**Churn is the silent killer.** A 5% monthly churn rate means you lose half your users every year. Even with strong acquisition, high churn makes growth impossible. Investigate churn before investing in acquisition.

### Feature Adoption

| Metric | Definition | Target |
|--------|-----------|--------|
| **Feature activation rate** | % of eligible users who use a feature at least once | > 30% for core features, > 10% for secondary |
| **Feature frequency** | Average uses per user per week for each feature | Depends on feature |
| **Feature breadth** | Average number of features used per user | Growing over time |
| **Time to first value** | Time from signup to first meaningful action | < 5 minutes |

---

## Performance Metrics (Web)

### Core Web Vitals

| Metric | What It Measures | Good | Needs Improvement | Poor |
|--------|-----------------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | Loading speed — when the main content is visible | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Interactivity — how fast the page responds to input | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability — how much the page layout shifts | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Backend Performance

| Metric | Definition | Target | Alert Threshold |
|--------|-----------|--------|-----------------|
| **API p50 response time** | Median API response time | < 100ms | > 300ms |
| **API p99 response time** | 99th percentile API response time | < 2,000ms | > 5,000ms |
| **Database query p95** | 95th percentile database query time | < 100ms | > 500ms |
| **Slow query count** | Queries taking > 1 second per hour | < 10 | > 50 |
| **Connection pool utilization** | Active connections / Max connections | < 70% | > 85% |
| **Memory utilization** | Application memory usage | < 70% | > 85% |
| **CPU utilization** | Application CPU usage | < 60% average | > 80% sustained |

---

## Alerting Configuration

### Alert Priority Levels

| Priority | Response Time | Examples | Notification Channel |
|----------|-------------|---------|---------------------|
| **P0 — Critical** | Immediate (< 5 min) | Site down, data loss, security breach | PagerDuty / SMS / Phone call |
| **P1 — High** | < 30 min | Core feature broken, error rate spike, payment failures | Slack + PagerDuty |
| **P2 — Medium** | < 4 hours | Performance degradation, non-critical feature broken | Slack |
| **P3 — Low** | Next business day | Minor UI bug, cosmetic issue, non-impactful error | Email / Ticket |

### Alert Rules for {{MONITORING_PROVIDER}}

```yaml
alerts:
  # P0 — Critical
  - name: "Site Unreachable"
    condition: uptime_check_fails >= 3 consecutive
    priority: P0
    notify: [pagerduty, sms]

  - name: "Error Rate Spike"
    condition: error_rate_5xx > 1% for 5 minutes
    priority: P0
    notify: [pagerduty, slack]

  # P1 — High
  - name: "High Latency"
    condition: api_p95 > 3000ms for 10 minutes
    priority: P1
    notify: [slack, pagerduty]

  - name: "Database Connection Saturation"
    condition: db_connections > 85% of max for 5 minutes
    priority: P1
    notify: [slack]

  - name: "Payment Processing Failure"
    condition: payment_error_rate > 5% for 5 minutes
    priority: P1
    notify: [pagerduty, slack]

  # P2 — Medium
  - name: "Elevated Client Errors"
    condition: error_rate_4xx > 5% for 30 minutes
    priority: P2
    notify: [slack]

  - name: "Memory Usage High"
    condition: memory_usage > 85% for 15 minutes
    priority: P2
    notify: [slack]

  - name: "Slow Queries Increasing"
    condition: slow_query_count > 50 per hour
    priority: P2
    notify: [slack]

  # P3 — Low
  - name: "Disk Usage Warning"
    condition: disk_usage > 70%
    priority: P3
    notify: [email]

  - name: "Certificate Expiry Warning"
    condition: ssl_cert_expiry < 30 days
    priority: P3
    notify: [email, slack]
```

### Alert Fatigue Prevention

If you are getting more than 5 non-actionable alerts per week, your alerting is broken. Fix it:

1. **Tune thresholds.** If an alert fires constantly and nobody acts on it, the threshold is wrong.
2. **Add hysteresis.** Require the condition to persist for a duration before alerting (e.g., "error rate > 1% for 5 minutes" not "error rate > 1% for 1 second").
3. **Deduplicate.** Multiple alerts for the same root cause should consolidate into one.
4. **Escalate, do not repeat.** If P2 is not acknowledged in 4 hours, escalate to P1. Do not send the same P2 alert every hour.
5. **Review and prune monthly.** Delete alerts nobody has acted on in 30 days.

---

## Dashboard Tool Recommendations

| Tool | Best For | Pricing | Key Strength |
|------|---------|---------|-------------|
| **Grafana** | Self-hosted, custom dashboards | Free (self-hosted), Cloud from $29/mo | Maximum flexibility, open source |
| **Datadog** | Full-stack observability | From $15/host/mo | All-in-one: logs, metrics, traces, APM |
| **PostHog** | Product analytics + session replay | Free up to 1M events/mo | Open source, event-based, feature flags |
| **Mixpanel** | Product analytics (funnels, cohorts) | Free up to 20M events/mo | Best-in-class funnel analysis |
| **Sentry** | Error tracking | Free up to 5K events/mo | Source maps, breadcrumbs, session replay |
| **Better Uptime** | Uptime monitoring + status page | Free tier available | Simple setup, public status page |
| **Stripe Dashboard** | Revenue metrics | Included with Stripe | Real-time revenue, churn, MRR |

### Recommended Stack (Cost-Conscious)

```
Error tracking:     Sentry (free tier)
Product analytics:  PostHog (free tier) or Mixpanel (free tier)
Uptime monitoring:  Better Uptime (free tier)
Performance:        Vercel Analytics (included) or Web Vitals API (free)
Revenue:            Stripe Dashboard (included)
Custom dashboards:  Grafana Cloud (free tier)
```

### Recommended Stack (Growth Stage)

```
Observability:      Datadog (logs + metrics + APM)
Product analytics:  Mixpanel or Amplitude
Error tracking:     Sentry (paid tier with session replay)
Status page:        Better Uptime or Statuspage
Revenue:            ChartMogul or Baremetrics (connects to Stripe)
```

---

## Weekly Metrics Review Template

Use this template every Monday morning. Takes 30 minutes.

```markdown
# {{PROJECT_NAME}} Weekly Metrics Review — Week of [DATE]

## Quick Health Check
| Metric | This Week | Last Week | Trend | Status |
|--------|-----------|-----------|-------|--------|
| DAU | | | ↑/↓/→ | Green/Yellow/Red |
| WAU | | | ↑/↓/→ | Green/Yellow/Red |
| Error rate (5xx) | | | ↑/↓/→ | Green/Yellow/Red |
| p95 latency | | | ↑/↓/→ | Green/Yellow/Red |
| New signups | | | ↑/↓/→ | Green/Yellow/Red |
| Churn (users) | | | ↑/↓/→ | Green/Yellow/Red |
| MRR | | | ↑/↓/→ | Green/Yellow/Red |
| Support tickets | | | ↑/↓/→ | Green/Yellow/Red |

## Highlights
- [What went well this week]

## Concerns
- [What needs attention]

## Incidents
- [Any incidents this week? Link to postmortems.]

## Action Items
- [ ] [Action 1 — Owner — Due date]
- [ ] [Action 2 — Owner — Due date]

## Next Week Focus
- [Top priority for next week based on this data]
```

---

## Metric Definitions Glossary

| Abbreviation | Full Name | Category |
|-------------|-----------|----------|
| DAU | Daily Active Users | Engagement |
| MAU | Monthly Active Users | Engagement |
| WAU | Weekly Active Users | Engagement |
| MRR | Monthly Recurring Revenue | Business |
| ARR | Annual Recurring Revenue | Business |
| ARPU | Average Revenue Per User | Business |
| LTV | Lifetime Value | Business |
| CAC | Customer Acquisition Cost | Business |
| NPS | Net Promoter Score | Satisfaction |
| CSAT | Customer Satisfaction Score | Satisfaction |
| CES | Customer Effort Score | Satisfaction |
| LCP | Largest Contentful Paint | Performance |
| INP | Interaction to Next Paint | Performance |
| CLS | Cumulative Layout Shift | Performance |
| MTTR | Mean Time to Recovery | Reliability |
| MTBF | Mean Time Between Failures | Reliability |
| SLA | Service Level Agreement | Reliability |
| SLO | Service Level Objective | Reliability |
| SLI | Service Level Indicator | Reliability |

---

## Cross-References

- **Unified metrics registry**: `35-business-intelligence/metrics-hub/unified-metrics-registry.template.md` — all product health and operational metrics from this file are mapped into the enterprise metrics hierarchy
- **Data pipeline**: `35-business-intelligence/etl-pipeline-design.template.md` — how post-launch metrics flow from application database to the BI warehouse
- **Cohort analysis**: `35-business-intelligence/executive-reporting/cohort-analysis.template.md` — retention curves from this file feed into deeper cohort analysis with revenue and behavioral dimensions
- **Alert thresholds**: `35-business-intelligence/metrics-hub/alert-threshold-registry.template.md` — unified business metric alerting that complements the operational alerting defined here
