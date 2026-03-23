# Integration Resilience Patterns

> Your application is only as reliable as its least reliable integration. These patterns prevent third-party failures from cascading into your system. Apply them proportionally — P0 integrations get the full treatment, P3 integrations get basic retry and logging.

---

## Circuit Breaker Pattern

### Concept

A circuit breaker wraps integration calls and tracks failures. When failures exceed a threshold, the circuit "opens" and immediately rejects calls without hitting the failing service. After a cooldown period, it enters "half-open" state and allows a test call through. If the test succeeds, the circuit closes (normal operation). If it fails, the circuit opens again.

### States

```
CLOSED (normal) ──failure threshold exceeded──→ OPEN (rejecting)
    ↑                                              │
    │                                         cooldown expires
    │                                              │
    └──────── test call succeeds ←──────── HALF-OPEN (testing)
                                      test call fails → back to OPEN
```

### Configuration per Integration

| Parameter | P0-Critical | P1-High | P2-Medium | P3-Low |
|-----------|------------|---------|-----------|--------|
| Failure threshold | 5 failures in 60s | 10 in 60s | 20 in 60s | No circuit breaker |
| Cooldown period | 30s | 60s | 120s | — |
| Half-open max tests | 3 | 3 | 1 | — |
| Timeout per call | 5s | 10s | 30s | 30s |

### Implementation Options

| Library/Approach | Language | Notes |
|-----------------|----------|-------|
| `opossum` | Node.js | Most popular, supports fallbacks, events, metrics |
| `cockatiel` | Node.js/TS | Modern, policy-based (retry, circuit breaker, bulkhead, timeout) |
| `resilience4j` | Java | Full-featured, Spring Boot integration |
| `polly` | .NET | Policy-based resilience |
| Custom wrapper | Any | Simple state machine, ~50 lines. Fine for 1-3 integrations |

### What to Do When the Circuit Opens

The circuit opening is not an error to swallow — it's a signal that requires a response:

1. **Return cached data** (if available and acceptable staleness)
2. **Use fallback provider** (see `multi-provider-fallback.template.md`)
3. **Show degraded UI** ("This feature is temporarily unavailable")
4. **Queue for later** (if operation can be deferred)
5. **Fail with clear error** (last resort — tell the user what's happening)

---

## Retry with Exponential Backoff

### When to Retry

| Scenario | Retry? | Why |
|----------|--------|-----|
| Network timeout | Yes | Transient network issues |
| 429 Too Many Requests | Yes | Respect `Retry-After` header |
| 500 Internal Server Error | Yes (limited) | Provider may recover |
| 502 Bad Gateway | Yes | Usually transient |
| 503 Service Unavailable | Yes | Provider overloaded |
| 504 Gateway Timeout | Yes | Usually transient |
| 400 Bad Request | No | Your request is malformed — fix the code |
| 401 Unauthorized | No | Credential issue — fix the config |
| 403 Forbidden | No | Permission issue — fix the config |
| 404 Not Found | No | Resource doesn't exist |
| 409 Conflict | Maybe | Depends on business logic |
| 422 Unprocessable Entity | No | Validation error — fix the data |

### Backoff Strategy

```
delay = min(base * 2^attempt + random_jitter, max_delay)

base = 1 second
max_delay = 60 seconds
jitter = random(0, 1000ms)  ← CRITICAL: prevents thundering herd
max_retries = 3-5 depending on criticality
```

| Attempt | Base Delay | With Jitter (example) | Cumulative |
|---------|------------|----------------------|------------|
| 1 | 1s | 1.3s | 1.3s |
| 2 | 2s | 2.7s | 4.0s |
| 3 | 4s | 4.1s | 8.1s |
| 4 | 8s | 8.9s | 17.0s |
| 5 | 16s | 16.4s | 33.4s |

### Retry-After Header

Always check for `Retry-After` in 429 and 503 responses. This header tells you exactly when the provider wants you to retry:

- `Retry-After: 120` → Wait 120 seconds
- `Retry-After: Fri, 31 Dec 2024 23:59:59 GMT` → Wait until this time

**If the provider tells you when to retry, use their value — not your calculated backoff.**

---

## Timeout Configuration

### Timeout Layers

Every integration call has multiple timeout layers. Configure all of them:

| Layer | Description | Default | Recommendation |
|-------|-------------|---------|----------------|
| DNS lookup | Time to resolve hostname | 5s | Leave default |
| TCP connect | Time to establish connection | 10s | 5s |
| TLS handshake | Time for SSL/TLS negotiation | 10s | 5s |
| Request/response | Time from request sent to first byte received | 30s | Set per integration |
| Total | Overall time limit for the entire operation | 60s | Set per integration |

### Per-Integration Timeout Guidelines

| Integration Type | Timeout | Rationale |
|-----------------|---------|-----------|
| Auth verification | 3–5s | User is waiting, blocking login flow |
| Payment processing | 10–15s | Critical, but payment networks are slow |
| Email sending | 5–10s | Can queue if slow |
| File upload | 30–120s | Depends on file size |
| Search query | 3–5s | User is waiting for results |
| Analytics event | 2–3s | Non-critical, fire-and-forget |
| Webhook delivery | 10s | Industry standard |

### Cascading Timeout Protection

If Service A calls Service B which calls Service C, each layer must have a shorter timeout than its parent:

```
API endpoint timeout: 30s
  └─ Service A timeout: 25s
      └─ Service B timeout: 15s
          └─ Service C timeout: 5s
```

**Never set an inner timeout >= outer timeout.** The outer will fire first and you'll lose the inner error context.

---

## Bulkhead Pattern

### Concept

Isolate integrations from each other so that a slow or failing integration doesn't consume all resources (threads, connections, memory) and bring down unrelated integrations.

### Implementation Approaches

| Approach | Description | Best For |
|----------|-------------|----------|
| Separate connection pools | Each integration gets its own HTTP client with max connections | Most Node.js/Java apps |
| Separate queue workers | Each integration's async work runs in isolated worker processes | Queue-heavy architectures |
| Separate threads/processes | Integration calls run in dedicated thread pools | JVM-based applications |
| Rate-limited semaphore | Limit concurrent calls per integration | Simple applications |

### Configuration

| Integration | Max Concurrent Requests | Queue Depth | Timeout |
|-------------|------------------------|-------------|---------|
| P0 integrations | 50 | 100 | 5s |
| P1 integrations | 25 | 50 | 10s |
| P2 integrations | 10 | 25 | 30s |
| P3 integrations | 5 | 10 | 30s |

---

## Graceful Degradation

### Degradation Strategies by Integration

| Integration | Degradation Strategy | User-Facing Message |
|-------------|---------------------|---------------------|
| Auth provider | Allow cached sessions to continue, block new logins | "Login is temporarily unavailable. Active sessions are unaffected." |
| Payment provider | Queue payment, notify user of delay | "Your payment is being processed. We'll confirm within [X] minutes." |
| Email provider | Queue emails for delayed delivery | (Invisible to user — emails arrive late) |
| Search provider | Fall back to database LIKE query | "Search results may be limited right now." |
| Analytics provider | Drop events silently | (Invisible to user) |
| File storage | Serve cached/CDN version, block uploads | "File uploads are temporarily unavailable." |
| AI/LLM provider | Show cached response or disable AI feature | "AI suggestions are temporarily unavailable." |

### Degradation Levels

```
Level 0: NORMAL      — All integrations healthy
Level 1: DEGRADED    — Non-critical integrations impaired, core features work
Level 2: PARTIAL     — Some core features impaired, workarounds available
Level 3: EMERGENCY   — Critical integrations down, minimal functionality
```

### Status Page Integration

When integration health degrades, automatically update your status page:
- Level 0 → All Systems Operational
- Level 1 → Minor System Degradation (list affected features)
- Level 2 → Partial System Outage (list affected features)
- Level 3 → Major System Outage (incident response activated)

---

## Composing Patterns

In practice, you combine these patterns in a specific order:

```
API Call
  → Timeout (innermost — prevents hanging)
    → Retry with Backoff (retries on transient failure)
      → Circuit Breaker (stops retrying if service is confirmed down)
        → Bulkhead (isolates from other integrations)
          → Fallback (provides alternative when all else fails)
```

### Decision Matrix: Which Patterns for Which Criticality

| Pattern | P0-Critical | P1-High | P2-Medium | P3-Low |
|---------|------------|---------|-----------|--------|
| Timeout | ✅ Aggressive | ✅ Standard | ✅ Generous | ✅ Generous |
| Retry | ✅ 3 retries | ✅ 3 retries | ✅ 2 retries | ❌ No retry |
| Circuit Breaker | ✅ Required | ✅ Required | ⚠️ Optional | ❌ Skip |
| Bulkhead | ✅ Isolated pool | ✅ Shared pool | ⚠️ Semaphore | ❌ Skip |
| Fallback Provider | ✅ Required | ⚠️ If available | ❌ Skip | ❌ Skip |
| Graceful Degradation | ✅ Required | ✅ Required | ✅ Required | ✅ Fail silently |
| Health Check | ✅ Active probe | ✅ Active probe | ⚠️ Passive | ❌ Skip |

---

## Anti-Patterns to Avoid

1. **Retry storms:** Retrying without backoff or jitter creates a thundering herd that makes outages worse.
2. **Infinite retries:** Always set a max retry count. Some failures are permanent.
3. **Swallowing errors:** Catching and ignoring integration errors means you'll never know something's broken.
4. **Synchronous webhook processing:** Processing webhooks in the request handler blocks your web server and causes timeout failures.
5. **Shared circuit breakers:** One circuit breaker for multiple integrations means a Slack outage takes down your payment processing.
6. **Timeout without fallback:** Timing out and showing a generic error is barely better than hanging. Have a degradation plan.
7. **Testing only the happy path:** If you don't test circuit breaker transitions, retry exhaustion, and DLQ processing, they won't work in production.
