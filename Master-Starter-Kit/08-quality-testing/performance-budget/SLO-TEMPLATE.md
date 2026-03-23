# Service Level Objectives (SLOs)

## Purpose

SLOs define measurable targets for service reliability. They set expectations for users and guide engineering trade-offs between feature velocity and stability.

---

## Core SLOs

### SLO-1: Availability

| Metric | Target | Measurement Window |
|--------|--------|-------------------|
| **Availability** | 99.5% | 30-day rolling |
| **Allowed downtime** | ~3.6 hours/month | Unplanned only |
| **Maintenance windows** | Excluded | Scheduled, communicated 24h ahead |

**Calculation:** `(total_minutes - downtime_minutes) / total_minutes * 100`

### SLO-2: Latency

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API p50** | < 200ms | Median response time |
| **API p95** | < 500ms | 95th percentile |
| **API p99** | < 1000ms | 99th percentile |
| **Page load (LCP)** | < 2.5s | 75th percentile |

**Calculation:** Measured at the load balancer/CDN edge, not at the application server.

### SLO-3: Error Rate

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Server errors (5xx)** | < 1% | Of total requests |
| **Client errors (4xx)** | < 10% | Of total requests (expected from validation) |
| **Unhandled exceptions** | 0 | Per deployment |

**Calculation:** `5xx_responses / total_responses * 100`

### SLO-4: Data Durability

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Data loss** | 0 events | Per year |
| **Backup success** | 100% | Daily automated backups |
| **Recovery time (RTO)** | < 4 hours | Time to restore from backup |
| **Recovery point (RPO)** | < 1 hour | Maximum data loss window |

---

## Error Budget

The error budget is the allowed amount of unreliability.

| SLO | Target | Error Budget (30 days) |
|-----|--------|----------------------|
| Availability 99.5% | 0.5% unreliability | 3.6 hours downtime |
| Latency p95 < 500ms | 5% over threshold | 5% of requests can be slow |
| Error rate < 1% | 1% errors allowed | 1 in 100 requests can fail |

**When error budget is consumed:**
1. Stop all feature deployments
2. Focus 100% on reliability improvements
3. Resume feature work only when budget replenishes

---

## SLO Review Cadence

| Frequency | Action |
|-----------|--------|
| **Daily** | Automated dashboard check (SLO burn rate) |
| **Weekly** | Team review of SLO compliance |
| **Monthly** | Error budget review + adjustment |
| **Quarterly** | SLO target reassessment |

---

## Alerting Thresholds

| Alert | Condition | Action |
|-------|-----------|--------|
| **SLO Warning** | Burn rate 2x normal | Investigate, no immediate action |
| **SLO Critical** | Burn rate 5x normal | On-call engineer investigates |
| **SLO Breach** | Target missed for measurement window | Incident review, remediation plan |
| **Budget Exhausted** | Error budget at 0% | Feature freeze until budget replenishes |

---

## Template: Custom SLO

```markdown
### SLO-N: {{SLO_NAME}}

| Metric | Target | Measurement |
|--------|--------|-------------|
| **{{METRIC}}** | {{TARGET}} | {{HOW_MEASURED}} |

**Error Budget:** {{BUDGET}}
**Alert Threshold:** {{THRESHOLD}}
**Owner:** {{TEAM_OR_PERSON}}
```
