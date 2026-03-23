# {{PROJECT_NAME}} — Integration Health Monitoring

> **Owner:** {{LEAD_DEVELOPER}}
> **Health Check Interval:** {{HEALTH_CHECK_INTERVAL_SECONDS}} seconds
> **Alert Channel:** {{HEALTH_ALERT_CHANNEL}}
> **SLA Target:** {{INTEGRATION_SLA_TARGET}}
> **Last Updated:** {{DATE}}

---

## 1. Health Check Endpoint

### Endpoint Design

```
GET /api/health/integrations

Response 200 (all healthy):
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "integrations": {
    "stripe": { "status": "healthy", "latency_ms": 45, "last_check": "..." },
    "sendgrid": { "status": "healthy", "latency_ms": 120, "last_check": "..." },
    "s3": { "status": "healthy", "latency_ms": 23, "last_check": "..." }
  }
}

Response 200 (degraded):
{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:00Z",
  "integrations": {
    "stripe": { "status": "healthy", "latency_ms": 45 },
    "sendgrid": { "status": "unhealthy", "error": "timeout", "last_healthy": "..." },
    "s3": { "status": "healthy", "latency_ms": 23 }
  }
}
```

**Important:** Always return HTTP 200 for the health endpoint itself — even when integrations are unhealthy. Use the response body to communicate integration status. Returning 500 causes load balancers and uptime monitors to flag your application as down when only a third-party service is impaired.

### Separate from Application Health

```
GET /api/health          → Application health (DB, cache, disk — what you control)
GET /api/health/integrations → Integration health (third-party services — what you don't control)
GET /api/health/ready    → Readiness probe (can this instance accept traffic?)
GET /api/health/live     → Liveness probe (is this instance alive?)
```

---

## 2. Per-Integration Health Checks

### Health Check Registry

| Integration | Check Type | Check Method | Interval | Timeout | Healthy Threshold | Unhealthy Threshold |
|-------------|-----------|-------------|----------|---------|-------------------|---------------------|
| {{INTEGRATION_1}} | {{CHECK_TYPE}} | {{CHECK_METHOD}} | {{INTERVAL}}s | {{TIMEOUT}}s | {{HEALTHY_THRESHOLD}} | {{UNHEALTHY_THRESHOLD}} |
| {{INTEGRATION_2}} | {{CHECK_TYPE}} | {{CHECK_METHOD}} | {{INTERVAL}}s | {{TIMEOUT}}s | {{HEALTHY_THRESHOLD}} | {{UNHEALTHY_THRESHOLD}} |

### Check Types

| Type | Description | Cost | Accuracy | Best For |
|------|-------------|------|----------|----------|
| **Active probe** | Make a real API call (lightweight operation) | Consumes API quota | High | P0/P1 integrations |
| **Passive check** | Monitor ongoing traffic for errors/latency | Zero extra cost | Medium | P2/P3 integrations |
| **Status page scrape** | Check provider's status page API | Zero API cost | Low (delayed) | Supplementary |
| **Synthetic transaction** | Run a full business operation end-to-end | Highest cost | Highest | Critical payment flows |

### Active Probe Examples

| Provider | Probe Method | Expected Response | Notes |
|----------|-------------|-------------------|-------|
| Stripe | `GET /v1/balance` | 200 with balance object | Costs 1 API call per check |
| SendGrid | `GET /v3/api_keys` (limited scope) | 200 with key list | Use read-only API key |
| AWS S3 | `HEAD /{bucket}/health-check.txt` | 200 | Upload a 1-byte file for HEAD checks |
| Auth0 | `GET /api/v2/tenants/settings` | 200 | Management API token required |
| Algolia | `POST /1/indexes/{index}/query` (empty) | 200 | Costs 1 search operation |
| Redis | `PING` | `PONG` | Built-in health check |
| PostgreSQL | `SELECT 1` | Result set | Connection pool health |

### Passive Check Metrics

Monitor these metrics from ongoing traffic (no extra API calls):

| Metric | Healthy | Warning | Unhealthy |
|--------|---------|---------|-----------|
| Error rate (5xx) | < 1% | 1–5% | > 5% |
| Error rate (timeout) | < 0.5% | 0.5–2% | > 2% |
| P95 latency | < 2x baseline | 2–5x baseline | > 5x baseline |
| P99 latency | < 3x baseline | 3–10x baseline | > 10x baseline |
| Request volume | Within normal range | ±50% of normal | > 2x or near 0 |

---

## 3. Dashboard Design

### Integration Status Board

```
┌─────────────────────────────────────────────────────┐
│ INTEGRATION HEALTH                    Last updated: now │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ● Stripe         Healthy    45ms    ▁▁▂▁▁▁▂▁▁▁     │
│  ● SendGrid       Healthy    120ms   ▁▁▁▁▃▁▁▁▁▁     │
│  ● AWS S3         Healthy    23ms    ▁▁▁▁▁▁▁▁▁▁     │
│  ● Auth0          Degraded   890ms   ▁▂▃▅▇▅▃▂▁▁     │
│  ● Algolia        Healthy    34ms    ▁▁▁▁▁▁▁▁▁▁     │
│  ○ Segment        Unknown    --      No recent data   │
│                                                       │
│  Overall: DEGRADED (1 of 6 impaired)                 │
└─────────────────────────────────────────────────────┘
```

### Dashboard Panels

| Panel | Visualization | Data Source | Refresh |
|-------|--------------|-------------|---------|
| Status overview | Status grid with color indicators | Health check endpoint | {{HEALTH_CHECK_INTERVAL_SECONDS}}s |
| Latency trends | Line chart per integration (P50, P95, P99) | Application metrics | 1 min |
| Error rates | Stacked area chart by integration | Application metrics | 1 min |
| Request volume | Bar chart by integration | Application metrics | 5 min |
| Circuit breaker state | State indicator per integration | Circuit breaker events | Real-time |
| SLA compliance | Gauge per integration (uptime %) | Health check history | 1 hour |
| Cost tracking | Running total per integration | Billing APIs / manual | Daily |
| Incident timeline | Event log with severity markers | Alert history | Real-time |

### Recommended Dashboard Tools

| Tool | Self-Hosted | Cloud | Best For |
|------|------------|-------|----------|
| Grafana | ✅ | ✅ (Cloud) | Comprehensive dashboards, multiple data sources |
| Datadog | — | ✅ | Full-stack monitoring with integrations built-in |
| New Relic | — | ✅ | APM with external service monitoring |
| Uptime Kuma | ✅ | — | Simple status page + monitoring |
| Better Uptime | — | ✅ | Status page + incident management |

---

## 4. Alerting Rules

### Alert Configuration

| Alert | Condition | Severity | Channel | Auto-Resolve |
|-------|-----------|----------|---------|-------------|
| Integration unhealthy | Health check fails {{UNHEALTHY_THRESHOLD}} consecutive times | Warning | {{HEALTH_ALERT_CHANNEL}} | Yes |
| Integration down | Health check fails for > 5 minutes | Critical | PagerDuty + {{HEALTH_ALERT_CHANNEL}} | Yes |
| Latency spike | P95 > 3x baseline for > 5 minutes | Warning | {{HEALTH_ALERT_CHANNEL}} | Yes |
| Error rate spike | Error rate > 5% for > 3 minutes | Warning | {{HEALTH_ALERT_CHANNEL}} | Yes |
| Circuit breaker open | Any P0/P1 circuit breaker opens | Critical | PagerDuty + {{HEALTH_ALERT_CHANNEL}} | Yes |
| Failover activated | Traffic shifted to fallback provider | Warning | {{HEALTH_ALERT_CHANNEL}} | Yes |
| All integrations healthy | Recovery from degraded state | Info | {{HEALTH_ALERT_CHANNEL}} | — |
| SLA breach risk | Monthly uptime drops below {{INTEGRATION_SLA_TARGET}} + 0.1% | Warning | Email + {{HEALTH_ALERT_CHANNEL}} | — |

### Alert Fatigue Prevention

- **Dedup window:** Group identical alerts within 5-minute windows
- **Escalation:** Warning → Critical only if condition persists > 15 minutes
- **Snooze:** Allow temporary snooze during known maintenance windows
- **Business hours routing:** Non-critical alerts during business hours only
- **Dependency-aware:** Don't alert on downstream failures caused by upstream (if auth is down, don't also alert on every service that depends on auth)

---

## 5. SLA Tracking

### Monthly SLA Report Template

```
Integration SLA Report — {{MONTH}} {{YEAR}}

Target SLA: {{INTEGRATION_SLA_TARGET}}

| Integration | Uptime % | Downtime | Incidents | SLA Met |
|-------------|----------|----------|-----------|---------|
| Stripe      | 99.97%   | 13 min   | 1         | ✅       |
| SendGrid    | 99.85%   | 65 min   | 2         | ❌       |
| S3          | 100%     | 0 min    | 0         | ✅       |

Overall Integration Layer Uptime: 99.94%
Target: {{INTEGRATION_SLA_TARGET}}
Status: ✅ / ❌
```

### SLA Calculation

```
Monthly uptime % = (total_minutes - downtime_minutes) / total_minutes × 100

Where:
  total_minutes = days_in_month × 24 × 60
  downtime_minutes = sum of all periods where health check reported unhealthy

Note: Scheduled maintenance windows may be excluded per your SLA definition.
```

### SLA by Target

| Target | Max Monthly Downtime | Roughly |
|--------|---------------------|---------|
| 99.0% | 7h 18m | ~2h/week |
| 99.5% | 3h 39m | ~1h/week |
| 99.9% | 43m 50s | ~10m/week |
| 99.95% | 21m 55s | ~5m/week |
| 99.99% | 4m 23s | ~1m/week |

---

## 6. Provider Status Page Monitoring

### Status Page URLs

| Provider | Status Page | API Endpoint | RSS Feed |
|----------|------------|-------------|----------|
| Stripe | status.stripe.com | `GET /api/v2/status.json` | ✅ |
| AWS | health.aws.amazon.com | AWS Health API | ✅ |
| SendGrid | status.sendgrid.com | `GET /api/v2/status.json` | ✅ |
| Auth0 | status.auth0.com | `GET /api/v2/status.json` | ✅ |
| GitHub | githubstatus.com | `GET /api/v2/status.json` | ✅ |
| Cloudflare | cloudflarestatus.com | `GET /api/v2/status.json` | ✅ |
| Vercel | vercel-status.com | `GET /api/v2/status.json` | ✅ |

Most status pages use Atlassian Statuspage or similar — the `/api/v2/status.json` endpoint is standardized.

### Correlation

Cross-reference your health check data with provider status page updates:
- Your health check detects the issue → provider acknowledges on status page (typical delay: 5–30 minutes)
- If your health check shows degradation but provider status page shows operational, the issue may be regional, routing-specific, or on your end

---

## 7. Implementation Checklist

- [ ] Health check endpoint created at `/api/health/integrations`
- [ ] Active probes configured for all P0/P1 integrations
- [ ] Passive monitoring configured for P2/P3 integrations
- [ ] Dashboard deployed with all panels from Section 3
- [ ] Alert rules configured per Section 4
- [ ] Alert routing tested (do alerts actually reach the right channel?)
- [ ] SLA tracking automated with monthly report generation
- [ ] Provider status page monitoring configured
- [ ] Health check endpoint excluded from rate limiting
- [ ] Health check endpoint excluded from authentication (or uses separate auth)
- [ ] Health check does NOT expose sensitive data (no API keys, no internal IPs)
- [ ] Health check has its own timeout (prevent health check from hanging)
- [ ] Health check runs on a separate thread/worker (prevent health check from affecting application performance)
