# Integration Failure Specification: {{INTEGRATION_NAME}}

> **Purpose:** Specify exactly what happens when an external API is slow, down, or returning errors. Service specs describe the happy path; this document specifies the failure path. Without this, agents either skip error handling or implement inconsistent fallback behavior.
>
> **Generate one file per P0/P1 integration.** Save to `dev_docs/specs/integrations/failure-specs/{{integration-slug}}.md`
> **For P2/P3 integrations:** Group into a single `dev_docs/specs/integrations/failure-specs/low-priority-integrations.md`

---

## Integration Overview

| Field | Value |
|-------|-------|
| **Provider** | {{PROVIDER_NAME}} (e.g., Google Maps, Stripe, Twilio) |
| **Priority** | {{P0-P3}} (P0 = blocks core workflow, P1 = degrades UX, P2 = affects reporting, P3 = nice-to-have) |
| **Used By** | {{SERVICE_LIST}} |
| **Base URL** | {{BASE_URL}} |
| **Auth Method** | {{AUTH_METHOD}} (API key, OAuth2, JWT, mTLS) |
| **Rate Limit** | {{RATE_LIMIT}} (e.g., "2,500 requests/day", "100 requests/second") |
| **Provider SLA** | {{SLA}} (e.g., "99.9% uptime", "no SLA") |
| **Provider Status Page** | {{STATUS_URL}} |

---

## Timeout Configuration

| Phase | Timeout (ms) | Rationale |
|-------|-------------|-----------|
| **Connection** | {{CONNECT_TIMEOUT}} (e.g., 3000) | Time to establish TCP connection |
| **Read/Response** | {{READ_TIMEOUT}} (e.g., 5000) | Time to receive full response after connection |
| **Total** | {{TOTAL_TIMEOUT}} (e.g., 8000) | Maximum wall-clock time for the entire request |

> **Why specific values matter:** "Reasonable defaults" is not a spec. Maps API needs 3s (fast CDN), payment APIs need 15s (fraud checks), email APIs need 5s (queue acceptance). Each API has different latency characteristics.

---

## Retry Policy

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Max Retries** | {{RETRY_COUNT}} (e.g., 2) | |
| **Backoff Strategy** | {{STRATEGY}} (exponential with jitter) | |
| **Base Delay** | {{BASE_DELAY_MS}} (e.g., 500ms) | |
| **Max Delay** | {{MAX_DELAY_MS}} (e.g., 5000ms) | |
| **Jitter** | {{JITTER}} (e.g., ±25%) | Prevents thundering herd |
| **Retry On** | {{RETRY_CONDITIONS}} (e.g., "5xx, ECONNRESET, ETIMEDOUT") | |
| **Do NOT Retry On** | {{NO_RETRY}} (e.g., "4xx except 429, invalid input") | |
| **Idempotency Key** | {{REQUIRED_YES_NO}} | Required for payment/financial APIs |

### Retry Schedule Example

```
Attempt 1: Immediate
Attempt 2: ~500ms (375-625ms with jitter)
Attempt 3: ~1500ms (1125-1875ms with jitter)
Total max wait: ~2000ms + request time
```

---

## Circuit Breaker Configuration

| Setting | Value |
|---------|-------|
| **Failure Threshold** | {{THRESHOLD}} (e.g., 5 consecutive failures OR 50% error rate in 60s window) |
| **Open Duration** | {{OPEN_DURATION}} (e.g., 30 seconds) |
| **Half-Open Tests** | {{HALF_OPEN_COUNT}} (e.g., 1 request allowed through) |
| **Success to Close** | {{SUCCESS_COUNT}} (e.g., 2 consecutive successes) |
| **Tracked Errors** | {{TRACKED}} (e.g., "5xx, timeouts, connection refused — NOT 4xx client errors") |

### State Machine

```
CLOSED → (failures reach threshold) → OPEN
OPEN → (cooldown expires) → HALF-OPEN
HALF-OPEN → (test succeeds) → CLOSED
HALF-OPEN → (test fails) → OPEN (reset cooldown)
```

---

## Fallback Behavior

| Scenario | Behavior | User Experience |
|----------|----------|----------------|
| **API timeout** | {{FALLBACK}} | {{UX_DESCRIPTION}} |
| **API returns 5xx** | {{FALLBACK}} | {{UX_DESCRIPTION}} |
| **Circuit breaker open** | {{FALLBACK}} | {{UX_DESCRIPTION}} |
| **Rate limit exceeded (429)** | {{FALLBACK}} | {{UX_DESCRIPTION}} |
| **Auth failure (401/403)** | {{FALLBACK}} | {{UX_DESCRIPTION}} |

### Fallback Patterns (choose per scenario)

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Cached data** | Non-critical, data changes slowly | Show last-known address from cache with "Last updated 2h ago" badge |
| **Degraded UX** | Feature works partially without integration | Disable auto-complete, allow manual text entry |
| **Queue for later** | Action can be deferred | "Your request has been queued and will be processed when the service recovers" |
| **Manual entry** | User can provide the data themselves | Replace map picker with manual address form |
| **Hard block** | Safety-critical, no fallback acceptable | "Cannot process — payment verification required. Please try again." |

---

## Per-Error-Code Handling

| Provider Error Code | HTTP Status | Our Error Code | Handling | Retry? |
|-------------------|-------------|---------------|----------|--------|
| {{PROVIDER_CODE}} | {{STATUS}} | {{OUR_CODE}} from error-catalog.md | {{ACTION}} | {{YES_NO}} |
<!-- List EVERY error code the provider can return, not just common ones. Check the provider's API docs. -->

---

## Caching Strategy

| Setting | Value |
|---------|-------|
| **Cache Duration** | {{DURATION}} (e.g., "24 hours for geocoding, 0 for payments") |
| **Cache Key** | {{KEY_PATTERN}} (e.g., "`geo:${address_hash}`") |
| **Cache Store** | {{STORE}} (e.g., Redis, in-memory, Edge Config) |
| **Invalidation Trigger** | {{TRIGGER}} (e.g., "manual refresh button", "address update", "TTL expiry") |
| **Stale-While-Revalidate** | {{SWR_DURATION}} (e.g., "serve stale for 1h while refreshing in background") |

---

## Monitoring & Alerting

| Metric | Warning Threshold | Alert Threshold | Page Threshold |
|--------|------------------|----------------|----------------|
| **Error rate** | {{WARNING}}% (e.g., 5%) | {{ALERT}}% (e.g., 25%) | {{PAGE}}% (e.g., 50%) |
| **Latency (p95)** | {{WARNING}}ms | {{ALERT}}ms | {{PAGE}}ms |
| **Circuit breaker opens** | — | 1 occurrence | 3 in 1 hour |
| **Rate limit proximity** | 80% of limit | 95% of limit | Limit reached |

### Health Check

```typescript
// Health check endpoint for this integration
async function check{{IntegrationName}}Health(): Promise<HealthCheckResult> {
  // {{DESCRIBE_HEALTH_CHECK}} (e.g., "GET /v1/status", "ping endpoint", "lightweight geocode query")
}
```

---

## Implementation Checklist

- [ ] Timeout values configured (connect, read, total)
- [ ] Retry logic implemented with backoff and jitter
- [ ] Circuit breaker implemented with correct thresholds
- [ ] Fallback behavior implemented for each failure scenario
- [ ] Per-error-code handling covers all provider error codes
- [ ] Caching layer implemented where applicable
- [ ] Monitoring/alerting configured with correct thresholds
- [ ] Health check endpoint registered
- [ ] Idempotency keys used for financial/payment operations
- [ ] Error codes registered in error-catalog.md
- [ ] Integration failure tested manually (disconnect network, mock 500s)
- [ ] Load tested at expected peak traffic
