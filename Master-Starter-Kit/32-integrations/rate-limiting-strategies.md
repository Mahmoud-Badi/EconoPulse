# Rate Limiting Strategies for Consumed APIs

> You don't control third-party rate limits, but you control how your application respects them. This guide covers client-side rate limiting patterns that prevent throttling, avoid bans, and handle quota exhaustion gracefully.

---

## Know Your Limits

### Rate Limit Documentation

Before writing code, document the rate limits for every integration:

| Provider | Limit | Window | Scope | Burst Allowed | Overage Behavior |
|----------|-------|--------|-------|---------------|-----------------|
| Stripe | 100 req/s (test), 100 req/s (live) | Per second | Per API key | Brief bursts OK | 429 with `Retry-After` |
| SendGrid | 1000 req/s | Per second | Per API key | No | 429 |
| GitHub | 5000 req/h (authenticated) | Per hour | Per token | Yes | 403 with `X-RateLimit-Reset` |
| Shopify | 2 req/s (REST), 1000 points/s (GraphQL) | Per second | Per app per store | Leaky bucket | 429 |
| Slack | Varies by method (1-100 req/min) | Per minute | Per token per method | No | 429 with `Retry-After` |
| OpenAI | Varies by model and tier | Per minute | Per org | No | 429 with `Retry-After` |
| Google Maps | 50 QPS (most APIs) | Per second | Per API key | Brief | 429 |
| Twilio | 100 req/s (API), 1 msg/s (SMS per number) | Per second | Per account / number | No | 429 |

### Rate Limit Headers

Most providers include rate limit information in response headers:

| Header | Meaning | Example |
|--------|---------|---------|
| `X-RateLimit-Limit` | Max requests allowed in window | `100` |
| `X-RateLimit-Remaining` | Requests remaining in window | `47` |
| `X-RateLimit-Reset` | When the window resets (Unix timestamp) | `1694188800` |
| `Retry-After` | Seconds to wait before retrying (on 429) | `30` |
| `RateLimit-Policy` | Rate limit policy description | `100;w=60` (100 per 60s) |

**Always parse and respect these headers.** They're more accurate than documentation because they reflect your actual current quota state.

---

## Client-Side Rate Limiting Patterns

### Pattern 1: Token Bucket

Best for: Steady throughput with burst tolerance.

```
Configuration:
  bucket_size: 100 (max burst capacity)
  refill_rate: 10 tokens/second

Behavior:
  - Start with full bucket (100 tokens)
  - Each API call consumes 1 token
  - Bucket refills at 10 tokens/second
  - When empty, caller waits until tokens available
  - Allows bursts up to bucket_size, then throttles to refill_rate
```

### Pattern 2: Sliding Window

Best for: Matching provider's rate limit window exactly.

```
Configuration:
  max_requests: 100
  window_seconds: 60

Behavior:
  - Track timestamps of last 100 requests
  - Before each request, check if oldest request was > 60s ago
  - If yes, allow the request (remove oldest, add current)
  - If no, wait until oldest request falls out of window
```

### Pattern 3: Queue-Based Throttling

Best for: High-volume async operations (bulk emails, data sync, batch processing).

```
Configuration:
  queue_name: "integration-{provider}"
  drain_rate: 10 per second (match provider limit)
  max_queue_depth: 10000

Behavior:
  - All API calls enqueued instead of called directly
  - Worker drains queue at configured rate
  - Backpressure: reject new items when queue is full
  - Priority support: urgent items jump the queue
```

### Pattern 4: Adaptive Rate Limiting

Best for: Providers with dynamic or undocumented limits.

```
Behavior:
  - Start at conservative rate (50% of documented limit)
  - Monitor X-RateLimit-Remaining in responses
  - When remaining > 50% of limit: maintain or increase rate
  - When remaining < 20% of limit: reduce rate by 50%
  - When 429 received: back off exponentially
  - When X-RateLimit-Reset passes: restore normal rate
```

---

## Provider-Specific Strategies

### Shopify (Leaky Bucket)

Shopify uses a leaky bucket algorithm. Track the bucket fill level via `X-Shopify-Shop-Api-Call-Limit` header:

```
X-Shopify-Shop-Api-Call-Limit: 32/40

→ 32 requests in bucket, 40 max capacity
→ Bucket drains at 2 requests/second
→ When 40/40, you get 429 until bucket drains
```

**Strategy:** Monitor header, pause when bucket > 35/40, resume when < 20/40.

### GitHub (Hourly Window)

GitHub gives you 5000 requests per hour per authenticated token. Use conditional requests to avoid consuming quota:

- Use `If-None-Match` header with cached `ETag` — 304 responses don't count against quota
- Use `If-Modified-Since` header — only fetch if changed
- Use GraphQL API (1 complex query vs. multiple REST calls)

### OpenAI (Tiered + Per-Model)

OpenAI rate limits vary by organization tier, model, and endpoint:

- **Strategy:** Maintain separate rate limiters per model
- **Token limits:** Track token usage, not just request count
- **Queuing:** Use a priority queue — user-facing requests > batch processing

---

## Handling Rate Limit Exhaustion

### Decision Tree

```
429 Received
  │
  ├─ Has Retry-After header?
  │   ├─ Yes → Wait that exact duration, then retry
  │   └─ No → Apply exponential backoff (start: 1s, max: 60s)
  │
  ├─ Is this a user-facing request?
  │   ├─ Yes → Return degraded response or cached data immediately
  │   │         Queue the actual API call for later
  │   └─ No → Queue for retry, continue processing other work
  │
  └─ Are we consistently hitting limits?
      ├─ Yes → Review rate limiter config, consider:
      │         - Batching requests
      │         - Caching responses
      │         - Upgrading API tier
      │         - Reducing call frequency
      └─ No → Transient spike, backoff is sufficient
```

### Quota Monitoring

Set up alerts before you hit the limit:

| Threshold | Alert Level | Action |
|-----------|-------------|--------|
| 50% consumed | Info (log only) | No action needed |
| 75% consumed | Warning | Investigate if expected |
| 90% consumed | Alert | Reduce non-critical calls, enable aggressive caching |
| 100% consumed | Critical | Activate queue-based throttling, alert team |

---

## Request Optimization

Before adding rate limiting complexity, reduce the number of requests you make:

### Batch Operations

| Provider | Batch Endpoint | Max Batch Size | Savings |
|----------|---------------|----------------|---------|
| Stripe | `POST /v1/invoices` (bulk) | 100 | 100:1 |
| SendGrid | `POST /v3/mail/send` (personalizations) | 1000 recipients | 1000:1 |
| Algolia | `POST /1/indexes/{index}/batch` | 1000 objects | 1000:1 |
| GitHub | GraphQL (multiple queries in one request) | ~500KB payload | Variable |

### Response Caching

| Data Type | TTL | Cache Layer | Invalidation |
|-----------|-----|-------------|-------------|
| User profile from auth provider | 5 min | Redis | On user action |
| Product catalog from e-commerce | 15 min | Redis | Webhook event |
| Exchange rates | 1 hour | Application memory | Timer |
| Static config/settings | 24 hours | Application memory | Manual/deploy |

### Conditional Requests

Use HTTP conditional request headers to avoid re-fetching unchanged data:

| Header | Purpose | Provider Support |
|--------|---------|-----------------|
| `If-None-Match` / `ETag` | Skip if content unchanged | GitHub, most REST APIs |
| `If-Modified-Since` | Skip if not modified since date | S3, CDN endpoints |
| `since` parameter | Only fetch items created/updated after timestamp | Many list endpoints |

---

## Multi-Tenant Considerations

If your application is multi-tenant and each tenant has their own API keys:

- **Per-tenant rate limiters:** Each tenant's usage is tracked independently
- **Tenant quota allocation:** Divide your global API quota among tenants
- **Noisy neighbor prevention:** Cap per-tenant API usage to prevent one tenant from exhausting shared quota
- **Tenant-aware queuing:** Separate queues per tenant to ensure fair scheduling

See Section 26 (Multi-Tenant SaaS) for tenant isolation patterns.

---

## Monitoring & Dashboards

Track these metrics per integration:

| Metric | Purpose | Alert Threshold |
|--------|---------|----------------|
| Requests per minute | Trending toward limit | > 80% of limit |
| 429 responses per hour | Hitting limits | > 0 (investigate) |
| Average queue depth | Backlog growing | > 1000 (adjust drain rate) |
| Quota remaining % | Approaching exhaustion | < 20% |
| Cache hit ratio | Optimization effectiveness | < 50% (review caching strategy) |
