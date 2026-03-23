# Rate Limiting Architecture — {{PROJECT_NAME}}

## Strategy

| Dimension | Value |
|-----------|-------|
| Provider | {{RATE_LIMIT_PROVIDER}} |
| Storage | {{RATE_LIMIT_STORAGE}} |
| Algorithm | {{RATE_LIMIT_ALGORITHM}} |

## Rate Limit Tiers

<!-- Adjust tiers based on billing plans -->

| Tier | Requests/min | Requests/hour | Burst | Who |
|------|-------------|---------------|-------|-----|
| **Anonymous** | 20 | 200 | 5/s | Unauthenticated visitors |
| **Free** | 60 | 1,000 | 10/s | Free plan users |
| **Pro** | 300 | 10,000 | 50/s | Paid plan users |
| **Enterprise** | 1,000 | 100,000 | 200/s | Enterprise contracts |
| **Internal** | Unlimited | Unlimited | — | Service-to-service |

## Per-Endpoint Limits

| Endpoint | Limit | Window | Reason |
|----------|-------|--------|--------|
| `POST /auth/login` | 5 | 15 min | Brute force prevention |
| `POST /auth/register` | 3 | 1 hour | Spam prevention |
| `POST /auth/forgot-password` | 3 | 1 hour | Abuse prevention |
| `GET /api/*` (read) | Tier default | 1 min | Standard read rate |
| `POST /api/*` (write) | Tier default / 2 | 1 min | Writes cost more |
| `POST /api/*/upload` | 10 | 1 hour | Storage cost control |
| `GET /api/*/export` | 5 | 1 hour | Heavy compute |

## Implementation Pattern

### Token Bucket Algorithm (Recommended)

```
Each user/IP gets a bucket:
- Capacity: {tier burst limit}
- Refill rate: {tier requests/min ÷ 60} tokens per second
- Each request consumes 1 token
- When empty: 429 Too Many Requests
```

### Redis-Based Implementation

```
Key format: ratelimit:{identifier}:{window}
Identifier: user_id (authenticated) or IP (anonymous)
Window: sliding window in seconds

Headers returned:
  X-RateLimit-Limit: {max requests}
  X-RateLimit-Remaining: {remaining requests}
  X-RateLimit-Reset: {unix timestamp when window resets}
  Retry-After: {seconds to wait} (only on 429)
```

### Response on Limit Exceeded

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again in {seconds} seconds.",
    "retryAfter": 30
  }
}
```

## Multi-Tenant Considerations

<!-- IF {{MULTI_TENANT}} == "true" -->

| Scope | Key Pattern | Purpose |
|-------|-------------|---------|
| Per-user | `ratelimit:user:{userId}` | Individual abuse prevention |
| Per-tenant | `ratelimit:tenant:{tenantId}` | Tenant-level fair usage |
| Per-IP | `ratelimit:ip:{ip}` | DDoS mitigation |
| Global | `ratelimit:global:{endpoint}` | Service protection |

**Priority:** Per-user limits are checked first. If a single user hits their limit, other users in the same tenant are unaffected. Tenant-level limits are a secondary safety net.

<!-- ENDIF -->

## Monitoring & Alerting

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| 429 response rate | > 5% of requests | Investigate — may need to raise limits |
| Single IP 429 rate | > 50 in 5 min | Potential attack — consider IP block |
| Tenant 429 rate | > 10% of tenant requests | Contact tenant — may need plan upgrade |
| Redis latency | > 10ms p99 | Rate limiter is becoming a bottleneck |
