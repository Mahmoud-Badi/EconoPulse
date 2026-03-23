# Integration Testing Strategies

> Integration tests that depend on live third-party APIs are slow, flaky, and expensive. This guide covers the testing strategies that give you confidence in your integration layer without requiring every service to be available and perfectly behaved during every CI run.

---

## Testing Pyramid for Integrations

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E ╲        Live sandbox, pre-deploy smoke tests
                 ╱────────╲      (minutes, expensive, run pre-deploy)
                ╱          ╲
               ╱ Integration ╲   Contract tests, recorded fixtures
              ╱──────────────╲   (seconds, reliable, run in CI)
             ╱                ╲
            ╱    Unit Tests     ╲ Mocked clients, business logic
           ╱────────────────────╲ (milliseconds, deterministic, run always)
```

### What Each Layer Covers

| Layer | Tests | Dependencies | Speed | Reliability |
|-------|-------|-------------|-------|-------------|
| **Unit** | Business logic using mocked integration clients | None | ~1ms | 100% deterministic |
| **Contract** | Your code handles the provider's actual response format | Recorded fixtures | ~10ms | 99%+ deterministic |
| **Integration** | Full round-trip to sandbox/test environment | Provider sandbox | ~1-5s | 80-95% (network dependent) |
| **E2E** | Complete user flow including real API calls | Live environment | ~10-30s | 70-90% (everything can fail) |

---

## Contract Testing with Pact

### What is Contract Testing?

Contract testing verifies that your code correctly handles the response format of a third-party API. You define a "contract" (expected request/response pairs), and tests verify both sides independently:

- **Consumer test:** Your code sends the expected request and can parse the expected response
- **Provider verification:** The provider's API actually returns responses matching the contract

For third-party APIs, you typically only write consumer-side tests and validate contracts against recorded responses.

### When to Use Pact

| Scenario | Use Pact? | Alternative |
|----------|-----------|-------------|
| Internal microservice communication | ✅ Yes — both sides run Pact | — |
| Third-party REST API | ⚠️ Consumer-side only | Recorded fixtures may be simpler |
| Third-party GraphQL API | ⚠️ Consumer-side only | Schema validation may be simpler |
| Webhook payloads | ✅ Yes — verify handler parses correctly | — |
| File format exchanges | ❌ | Schema validation |

### Pact Workflow for Third-Party APIs

1. Record a real response from the provider's sandbox
2. Define a Pact contract based on that response
3. Write consumer tests that verify your code handles the contract
4. Re-record periodically (monthly) to catch provider-side changes
5. If a contract breaks, investigate whether it's a provider change or a recording issue

---

## API Mocking with MSW (Mock Service Worker)

### When to Use MSW

MSW intercepts HTTP requests at the network level and returns predefined responses. Use it for:

- **Unit tests:** Fast, deterministic tests of integration client code
- **Development:** Work offline or without API keys
- **CI/CD:** No network dependencies in the test pipeline

### Mock Organization

```
tests/
  mocks/
    handlers/
      stripe.ts          ← MSW handlers for Stripe endpoints
      sendgrid.ts        ← MSW handlers for SendGrid endpoints
      auth0.ts           ← MSW handlers for Auth0 endpoints
    fixtures/
      stripe/
        payment-intent-succeeded.json
        payment-intent-failed.json
        customer-created.json
      sendgrid/
        send-success.json
        send-rate-limited.json
    server.ts            ← MSW server setup
```

### Mock Fidelity Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| **Minimal** | Correct status code + minimal valid response | Unit tests that only check your logic |
| **Realistic** | Full response body matching real API | Contract validation, UI testing |
| **Error simulation** | 4xx/5xx responses, timeouts, malformed data | Resilience testing, error handling |
| **Stateful** | Mock maintains state across requests | Complex workflow testing (create → update → delete) |

---

## Recorded Fixture Testing

### Workflow

1. **Record:** Make real API calls to sandbox, save request/response pairs
2. **Replay:** Tests use recorded responses instead of making live calls
3. **Re-record:** Periodically update fixtures to catch API changes

### Tools

| Tool | Language | Mechanism |
|------|----------|-----------|
| **Polly.js** | JavaScript | Records/replays HTTP interactions |
| **VCR.py** | Python | Records/replays HTTP cassettes |
| **Nock** | Node.js | HTTP mocking (manual fixtures) |
| **WireMock** | Java/standalone | HTTP mock server with recording |
| **Betamax** | Multiple | HTTP recording/replay |

### Best Practices

1. **Sanitize recordings:** Remove API keys, PII, and sensitive data from fixtures
2. **Version fixtures:** Store in git alongside tests — fixtures are part of the test
3. **Tag with API version:** Name fixtures with the API version they were recorded against
4. **Automate re-recording:** CI job that re-records fixtures monthly and opens a PR if they change
5. **Fail on unmatched requests:** If your code makes an API call not covered by fixtures, the test should fail (not silently pass)

---

## Webhook Testing

### Testing Webhook Handlers

```
Test Categories:
1. Signature verification (valid, invalid, missing, expired timestamp)
2. Event routing (each event type reaches the correct handler)
3. Idempotency (duplicate events are safely ignored)
4. Error handling (malformed payload, unknown event type, handler failure)
5. Queue processing (events are correctly enqueued and processed)
6. DLQ behavior (failed events land in dead letter queue)
```

### Webhook Test Fixtures

Store fixture files for every webhook event type you handle:

```
tests/fixtures/webhooks/
  stripe/
    checkout.session.completed.json
    payment_intent.succeeded.json
    payment_intent.payment_failed.json
    customer.subscription.created.json
    customer.subscription.deleted.json
  shopify/
    orders-create.json
    orders-updated.json
    products-update.json
  github/
    push.json
    pull_request.opened.json
    pull_request.closed.json
```

### Generating Test Fixtures

| Method | Pros | Cons |
|--------|------|------|
| Provider CLI (`stripe trigger`) | Authentic payloads | Requires CLI setup |
| Provider webhook test button | Authentic, from dashboard | Manual process |
| Copy from provider docs | Quick | May be outdated or incomplete |
| Record from development | Matches your account's data | Requires live setup |

---

## Chaos Testing for Integrations

### What to Simulate

| Failure Mode | How to Simulate | What to Verify |
|-------------|-----------------|----------------|
| Provider timeout | Add artificial delay in mock | Circuit breaker opens, graceful degradation activates |
| Provider 500 error | Return 500 from mock/proxy | Retry fires, eventually DLQ or fallback |
| Provider rate limit | Return 429 from mock | Rate limiter backs off, queue drains slowly |
| Network partition | Block outbound requests | Circuit breaker opens, cached data served |
| Slow response | Add 10-30s delay | Timeout fires before cascade |
| Malformed response | Return invalid JSON | Error caught, logged, doesn't crash application |
| Certificate error | Use self-signed cert in proxy | Connection rejected safely, logged |

### Chaos Testing Schedule

| Frequency | Scope | Environment |
|-----------|-------|-------------|
| Every CI run | Mock-based chaos (timeout, 500, 429 simulation) | CI |
| Weekly | Proxy-based chaos for P0 integrations | Staging |
| Monthly | Full failover drill (see `multi-provider-fallback.template.md`) | Staging |
| Quarterly | Extended chaos (multiple integrations failing simultaneously) | Staging |

---

## Test Environment Strategy

### Environment Options

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Provider sandbox** | Use provider's test/sandbox environment | Most authentic | Rate limited, may differ from prod |
| **Local mock server** | Run MSW/WireMock locally | Fast, offline capable | Requires maintenance |
| **Shared staging** | All developers share one staging environment | Close to production | Conflicts between developers |
| **Ephemeral environments** | Spin up per-PR environments with mocked integrations | Isolated | Complex infrastructure |
| **Docker Compose** | Run mock services in containers | Reproducible | Initial setup effort |

### Recommended Strategy by Integration Criticality

| Criticality | Unit Tests | CI Integration Tests | Staging | Pre-Deploy |
|------------|------------|---------------------|---------|------------|
| P0-Critical | MSW mocks | Contract tests + sandbox | Real sandbox | Smoke test against sandbox |
| P1-High | MSW mocks | Contract tests | Real sandbox | — |
| P2-Medium | MSW mocks | Recorded fixtures | Mocked | — |
| P3-Low | MSW mocks | — | Mocked | — |

---

## CI/CD Integration Testing Pipeline

### Recommended CI Configuration

```
Pipeline Stages:
  1. Unit tests (mocked integrations)     → Must pass     → ~30s
  2. Contract tests (recorded fixtures)   → Must pass     → ~1m
  3. Integration tests (sandbox APIs)     → Must pass*    → ~3m
  4. Chaos tests (failure simulation)     → Should pass   → ~2m
  5. Smoke tests (pre-deploy)             → Must pass     → ~1m

* Integration tests may be skipped on non-critical PRs to save time and API quota
```

### Flaky Test Management

Integration tests are inherently more flaky than unit tests. Manage flakiness:

1. **Retry policy:** Auto-retry failed integration tests up to 2 times in CI
2. **Quarantine:** Isolate consistently flaky tests, run them on a separate schedule
3. **Timeout tuning:** Set generous timeouts for sandbox API calls (10-30s)
4. **Skip on rate limit:** If sandbox returns 429, skip (not fail) the test with a warning
5. **Track flake rate:** Monitor which integration tests fail most often — fix or replace them

---

## Checklist

- [ ] Unit tests use MSW/mocks for all integration clients
- [ ] Contract tests verify response parsing for P0/P1 integrations
- [ ] Webhook handlers have fixture-based tests for every event type
- [ ] Signature verification tests cover valid, invalid, and missing signatures
- [ ] Idempotency tests verify duplicate event handling
- [ ] Error scenario tests cover timeout, 429, 500, and malformed responses
- [ ] CI pipeline runs contract tests on every PR
- [ ] Recorded fixtures are re-verified monthly
- [ ] Chaos tests run weekly in staging
- [ ] Integration test flake rate is tracked and below 5%
