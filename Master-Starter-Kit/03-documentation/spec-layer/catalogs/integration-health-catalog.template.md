# Integration Health Catalog

> **Purpose:** Monitoring strategy per external integration in {{PROJECT_NAME}}.
> Every third-party service, external API, and infrastructure dependency is registered here with its health check method, failure impact, and fallback strategy.
> If an integration is not in this catalog, it is not monitored.

---

## How to Use This Catalog

1. **During spec writing:** When a service spec references an external dependency, add it here.
2. **During implementation:** DevOps configures health checks, circuit breakers, and alerts based on this catalog.
3. **During incident response:** On-call engineers reference this catalog to understand failure impact and available fallbacks.
4. **Cross-reference:** Every integration referenced in service specs must appear here. The CROSS-REFERENCE-VALIDATOR checks this.

---

## Integration Registry

| Integration | Health Check Method | Frequency | Failure Impact | Fallback Strategy | Alert Severity | SLA |
|------------|--------------------|-----------|--------------|--------------------|----------------|-----|
| {{AUTH_PROVIDER}} (e.g., Auth0, Clerk) | `GET /health` or token validation | 30s | Critical — no user can authenticate | Cached session tokens valid for {{SESSION_CACHE_TTL}} | P0 — page immediately | 99.99% |
| {{PAYMENT_PROVIDER}} (e.g., Stripe) | `GET /v1/balance` with test key | 60s | High — payments cannot process | Queue payments, retry when restored | P1 — alert within 5 min | 99.95% |
| {{EMAIL_PROVIDER}} (e.g., SendGrid, SES) | `GET /v3/mail/send` dry-run or API status | 120s | Medium — notifications delayed | Queue emails, switch to {{BACKUP_EMAIL_PROVIDER}} if down >{{EMAIL_FAILOVER_MINUTES}} min | P2 — alert within 15 min | 99.9% |
| {{STORAGE_PROVIDER}} (e.g., S3, Cloudflare R2) | `HEAD` request on test object | 60s | High — file uploads/downloads fail | Serve cached versions, show "temporarily unavailable" for uploads | P1 — alert within 5 min | 99.99% |
| {{SEARCH_PROVIDER}} (e.g., Algolia, Elasticsearch) | Index stats query | 60s | Medium — search degraded | Fall back to database `LIKE` queries (slower, limited) | P2 — alert within 15 min | 99.9% |
| {{PUSH_PROVIDER}} (e.g., FCM, APNs) | Send test notification to internal device | 300s | Medium — push notifications fail | Queue for retry, users still have in-app + email | P2 — alert within 15 min | 99.5% |
| {{SMS_PROVIDER}} (e.g., Twilio) | `GET /2010-04-01/Accounts` | 120s | Medium — SMS notifications fail | Switch to email for critical notifications | P2 — alert within 15 min | 99.5% |
| {{DATABASE}} Primary | Connection pool check + simple query | 15s | Critical — all services down | Promote read replica, enter read-only mode | P0 — page immediately | 99.99% |
| {{CACHE_PROVIDER}} (e.g., Redis) | `PING` command | 15s | High — performance degradation, sessions lost | Bypass cache, serve from DB (slower) | P1 — alert within 5 min | 99.9% |
| {{CDN_PROVIDER}} (e.g., CloudFront, Vercel Edge) | Probe request to known asset | 120s | Medium — slow asset loading | Serve from origin directly | P2 — alert within 15 min | 99.9% |
| {{INTEGRATION_N}} | {{HEALTH_CHECK_METHOD}} | {{FREQUENCY}} | {{FAILURE_IMPACT}} | {{FALLBACK_STRATEGY}} | {{ALERT_SEVERITY}} | {{SLA}} |
<!-- Add one row per external integration. Include ALL third-party services, APIs, databases, caches, CDNs, etc. -->

---

## Circuit Breaker Configuration

Each integration uses a circuit breaker to prevent cascade failures.

### Circuit Breaker Parameters

| Integration | Failure Threshold | Monitoring Window | Open Duration | Half-Open Max Requests | Success Threshold to Close |
|------------|-------------------|-------------------|---------------|----------------------|---------------------------|
| {{AUTH_PROVIDER}} | {{FAILURE_COUNT}} failures | {{WINDOW_SECONDS}}s | {{OPEN_DURATION_SECONDS}}s | {{HALF_OPEN_REQUESTS}} | {{SUCCESS_COUNT}} consecutive |
| {{PAYMENT_PROVIDER}} | {{FAILURE_COUNT}} failures | {{WINDOW_SECONDS}}s | {{OPEN_DURATION_SECONDS}}s | {{HALF_OPEN_REQUESTS}} | {{SUCCESS_COUNT}} consecutive |
| {{EMAIL_PROVIDER}} | {{FAILURE_COUNT}} failures | {{WINDOW_SECONDS}}s | {{OPEN_DURATION_SECONDS}}s | {{HALF_OPEN_REQUESTS}} | {{SUCCESS_COUNT}} consecutive |
| {{INTEGRATION_N}} | {{FAILURE_COUNT}} failures | {{WINDOW_SECONDS}}s | {{OPEN_DURATION_SECONDS}}s | {{HALF_OPEN_REQUESTS}} | {{SUCCESS_COUNT}} consecutive |
<!-- One row per integration from the registry above. -->

### Circuit Breaker States

| State | Behavior | Transition |
|-------|----------|------------|
| **Closed** (normal) | All requests pass through to integration | Opens when failure threshold is reached within monitoring window |
| **Open** (failing) | All requests immediately return fallback response | Transitions to Half-Open after open duration expires |
| **Half-Open** (testing) | Limited requests pass through to test recovery | Closes if success threshold met; re-opens if any request fails |

### Implementation

- Library: `{{CIRCUIT_BREAKER_LIBRARY}}` (e.g., `opossum` for Node.js, `pybreaker` for Python, `sony/gobreaker` for Go)
- Configuration location: `{{BACKEND_SRC}}/integrations/circuit-breaker.config.{{FILE_EXT}}`
- Metrics emitted: `integration.circuit.{state_change}` events sent to {{OBSERVABILITY_PROVIDER}}

---

## Degraded Mode Behavior

When an integration is unavailable, the system enters degraded mode for affected features.

### Degraded Mode Matrix

| Integration Down | Features Affected | User-Visible Impact | System Behavior |
|-----------------|-------------------|--------------------|-----------------|
| {{AUTH_PROVIDER}} | Login, registration, password reset | "Sign-in temporarily unavailable. Existing sessions continue to work." | Extend existing session TTLs, disable new auth flows, queue auth events |
| {{PAYMENT_PROVIDER}} | Checkout, subscription changes, refunds | "Payment processing is temporarily delayed. Your order is saved." | Queue payment intents, process when restored, send confirmation after |
| {{EMAIL_PROVIDER}} | All email notifications | No user-visible impact (silent) | Queue emails, retry with backoff, switch to backup provider if configured |
| {{STORAGE_PROVIDER}} | File uploads, image display | "File uploads are temporarily unavailable. Your work is saved." | Disable upload buttons, serve cached/placeholder images |
| {{DATABASE}} | All features | "{{PROJECT_NAME}} is experiencing issues. We're working on it." | Return 503 for all API requests, display maintenance page |
| {{INTEGRATION_N}} | {{AFFECTED_FEATURES}} | {{USER_MESSAGE}} | {{SYSTEM_BEHAVIOR}} |

### Degraded Mode UI Patterns

| Pattern | When to Show | Component |
|---------|-------------|-----------|
| Banner warning | Integration degraded but app usable | `<DegradedBanner integration="payment" />` |
| Feature disabled | Specific feature unavailable | Disable buttons, show tooltip explaining why |
| Maintenance page | Critical infrastructure down | Full-page maintenance screen with status page link |
| Queued confirmation | Action queued for later processing | Toast: "Your request is saved and will process shortly" |

---

## Health Check Dashboard

### Monitoring Endpoints

| Endpoint | Purpose | Auth Required | Response |
|----------|---------|---------------|----------|
| `GET /health` | Basic liveness check | No | `{ "status": "ok" }` |
| `GET /health/ready` | Readiness (all critical integrations up) | No | `{ "status": "ready", "checks": [...] }` |
| `GET /health/detailed` | Per-integration status | Yes (admin) | Full integration status with latencies |

### Status Page Integration

- External status page: `{{STATUS_PAGE_URL}}` (e.g., Statuspage.io, Instatus)
- Auto-update: Circuit breaker state changes push to status page via webhook
- Incident creation: P0/P1 alerts auto-create incidents on status page

---

## Alerting Rules

| Severity | Response Time | Notification Channel | Escalation |
|----------|--------------|---------------------|------------|
| P0 (Critical) | Immediate page | {{PAGING_SERVICE}} (e.g., PagerDuty, Opsgenie) + Slack #incidents | Escalate to {{ESCALATION_CONTACT}} if unacknowledged in {{P0_ESCALATION_MINUTES}} min |
| P1 (High) | 5 minutes | Slack #alerts + email to on-call | Escalate to P0 if unresolved in {{P1_ESCALATION_MINUTES}} min |
| P2 (Medium) | 15 minutes | Slack #alerts | Review in next standup if unresolved |
| P3 (Low) | Next business day | Slack #monitoring | Track in backlog |

---

## Completeness Checklist

- [ ] Every third-party service in the tech stack has an entry
- [ ] Every integration has a health check method and frequency defined
- [ ] Every integration has a circuit breaker configuration
- [ ] Every integration has a degraded mode behavior documented
- [ ] Every integration has an alert severity and SLA defined
- [ ] Fallback strategies are implementable (not just "handle gracefully")
- [ ] Health check endpoints implemented and accessible
- [ ] Status page configured and auto-updating
