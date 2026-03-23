# Chaos Tests

## What It Is

Chaos testing deliberately injects failures into your system to verify that it degrades gracefully rather than catastrophically. Instead of hoping your error handling works, you prove it by killing database connections mid-request, returning 500s from third-party APIs, injecting network latency, and simulating disk exhaustion. The question isn't "does it work when everything is fine?" — it's "what happens to users when something breaks?" A well-chaos-tested system shows error messages instead of blank screens, retries failed operations instead of losing data, and recovers automatically when the failure resolves.

---

## What It Catches

- **Unhandled third-party API failures** — Stripe returns a 500, and your checkout page shows a white screen because nobody wrapped the API call in a try/catch with a fallback UI
- **Database connection loss cascading to full outage** — Database restarts for 30 seconds, the connection pool throws unhandled exceptions, the Node process crashes, the load balancer health check fails, all pods restart simultaneously
- **Missing retry logic** — Email service times out once, the user's account verification email is never sent, and there's no retry queue or manual re-send
- **Circuit breaker absence** — A downstream service is down, and every request to your app waits 30 seconds for the timeout before failing, making the entire app feel frozen
- **Graceful degradation gaps** — The recommendation engine is unreachable, and instead of showing "popular items" as a fallback, the product page renders with a broken empty section
- **Data loss during failures** — User submits a form, the API starts processing, the database write succeeds but the cache update fails, the error propagates up, the API returns 500, the user retries and creates a duplicate
- **Memory exhaustion under failure** — Failed requests stack up in a retry queue with no backpressure, consuming all available memory until the process is OOM-killed
- **Split-brain after network partition** — Two instances of the app both accept writes during a network split, creating conflicting data that's never reconciled
- **Zombie connections** — Database connection appears alive but is actually broken (TCP half-open), every query using it hangs until the TCP timeout (usually 2+ minutes)
- **Log storms during failure** — A failing service generates 10,000 error log lines per second, filling disk space and causing the logging infrastructure itself to fail

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Your app depends on third-party services (Stripe, SendGrid, Auth0, etc.) | They will go down, and your app needs a plan |
| You run microservices or service-oriented architecture | More services = more failure points |
| You have SLAs (99.9% uptime = 8.7 hours downtime/year max) | You need to know your actual recovery behavior |
| Your database is a single point of failure | What happens during a failover? |
| Users can lose data or money if a request partially fails | Partial failure handling must be proven, not assumed |
| You use caching layers (Redis, CDN) | Cache failures should degrade to slower responses, not errors |
| You're preparing for production launch | The first time you discover your failure handling doesn't work should not be in production |
| You've had a production incident caused by a dependency failure | Chaos tests prevent the same class of incident from recurring |

**Skip when:** Single-page app with no backend, prototype with no users, app with zero external dependencies.

---

## Setup Guide

### Approach: Application-Level Chaos

Enterprise chaos tools (Chaos Monkey, Litmus) operate at the infrastructure level — killing pods, partitioning networks. That's valuable, but most application teams benefit more from application-level chaos: intercepting and manipulating HTTP calls, database queries, and network conditions within their test suite.

### Tools

```bash
# Playwright (you already have it) — network manipulation, request interception
npm install -D @playwright/test

# nock — HTTP request interception for Node.js (API-level chaos)
npm install -D nock

# MSW (Mock Service Worker) — intercept requests in both Node and browser
npm install -D msw

# Testcontainers — spin up real databases for connection failure testing
npm install -D testcontainers
```

### Project Structure

```
tests/
  chaos/
    network-failures.spec.ts     # Network latency, disconnection, DNS failure
    api-failures.spec.ts         # Third-party API 500s, timeouts, bad responses
    database-failures.spec.ts    # Connection loss, slow queries, deadlocks
    resource-exhaustion.spec.ts  # Memory pressure, disk full, connection limits
    recovery.spec.ts             # Does the system recover when failure resolves?
    helpers/
      chaos-interceptors.ts      # Reusable failure injection utilities
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **Playwright route interception** | Frontend chaos (network failures, slow APIs) | Built into your E2E framework |
| **nock / MSW** | Backend chaos (intercept HTTP to third-party services) | Node.js request interception |
| **Testcontainers** | Real database failure simulation | Start/stop actual DB containers |
| **Toxiproxy** | Network-level fault injection | Proxy that adds latency, drops connections |
| **Chaos Monkey / Litmus** | Kubernetes pod killing | Infrastructure-level, requires K8s |
| **AWS Fault Injection Simulator** | Cloud infrastructure chaos | Kill EC2 instances, throttle APIs |

---

## Template

### Network Failure Tests (Playwright)

```ts
// tests/chaos/network-failures.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Network Failure Resilience', () => {

  test('app shows offline indicator when network drops', async ({ page, context }) => {
    await page.goto('/dashboard');
    await expect(page.locator('.dashboard-content')).toBeVisible();

    // Kill all network requests
    await context.setOffline(true);

    // Try to perform an action that requires network
    await page.click('[data-testid="refresh-button"]');

    // Should show offline state, not crash
    await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
    await expect(page.locator('[data-testid="offline-banner"]')).toContainText(
      /offline|no connection|network/i
    );

    // Page content should still be visible (cached/stale data)
    await expect(page.locator('.dashboard-content')).toBeVisible();
  });

  test('app recovers automatically when network returns', async ({ page, context }) => {
    await page.goto('/dashboard');

    // Go offline
    await context.setOffline(true);
    await page.click('[data-testid="refresh-button"]');
    await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();

    // Come back online
    await context.setOffline(false);

    // App should detect reconnection and refresh data
    await expect(page.locator('[data-testid="offline-banner"]')).toBeHidden({
      timeout: 10000,
    });
    await expect(page.locator('.dashboard-content')).toBeVisible();
  });

  test('slow network shows loading states, not timeouts', async ({ page }) => {
    // Add 5 seconds of latency to all API calls
    await page.route('**/api/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.continue();
    });

    await page.goto('/dashboard');

    // Should show loading indicator, not a blank screen
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

    // Should eventually load (after the latency)
    await expect(page.locator('.dashboard-content')).toBeVisible({
      timeout: 15000,
    });
  });

  test('request timeout shows retry option', async ({ page }) => {
    // Abort all API requests (simulate complete timeout)
    await page.route('**/api/dashboard', (route) => route.abort('timedout'));

    await page.goto('/dashboard');

    // Should show a meaningful error with a retry button
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

    // Remove the abort, then click retry
    await page.unroute('**/api/dashboard');
    await page.click('[data-testid="retry-button"]');

    // Should recover
    await expect(page.locator('.dashboard-content')).toBeVisible();
  });
});
```

### Third-Party API Failure Tests (Playwright)

```ts
// tests/chaos/api-failures.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Third-Party API Failures', () => {

  test('payment failure shows user-friendly error, not crash', async ({ page }) => {
    // Intercept Stripe/payment API calls and return 500
    await page.route('**/api/payments/**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    );

    await page.goto('/checkout');
    await page.fill('[name="card"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvc"]', '123');
    await page.click('[data-testid="pay-button"]');

    // Should show a friendly error, NOT a blank screen or unhandled exception
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText(
      /try again|contact support|temporary/i
    );

    // The form data should still be present (don't clear it on error)
    await expect(page.locator('[name="card"]')).toHaveValue('4242424242424242');
  });

  test('email service failure does not block signup', async ({ page }) => {
    // Email API fails, but signup should still succeed
    await page.route('**/api/email/send', (route) =>
      route.fulfill({ status: 503 })
    );

    await page.goto('/signup');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('[data-testid="signup-button"]');

    // Account should still be created
    await expect(page).toHaveURL(/\/welcome|\/verify/);

    // Should show a note that email might be delayed
    await expect(page.locator('text=/verification email|check your email/i')).toBeVisible();
  });

  test('search service failure falls back to basic results', async ({ page }) => {
    // External search service (e.g., Algolia, Elasticsearch) is down
    await page.route('**/api/search**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [],
          fallback: true,
          message: 'Search is temporarily limited',
        }),
      })
    );

    await page.goto('/products');
    await page.fill('[data-testid="search-input"]', 'blue widget');
    await page.press('[data-testid="search-input"]', 'Enter');

    // Should show degraded-but-functional search, not an error page
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('API returning malformed JSON does not crash', async ({ page }) => {
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"data": [{"id": 1, "name": INVALID_JSON',
      })
    );

    await page.goto('/dashboard');

    // Should show error state, not white screen
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    // Page should still be navigable
    await expect(page.locator('nav')).toBeVisible();
  });
});
```

### Backend Service Failure Tests (nock/MSW)

```ts
// tests/chaos/service-failures.test.ts
import nock from 'nock';
import request from 'supertest';
import { app } from '../../src/app';

describe('Backend Service Chaos', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  test('payment processing retries on 503', async () => {
    // First call fails, second succeeds
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(503, { error: 'Service Unavailable' })
      .post('/v1/charges')
      .reply(200, { id: 'ch_123', status: 'succeeded' });

    const res = await request(app)
      .post('/api/payments/charge')
      .send({ amount: 1000, currency: 'usd' })
      .set('Authorization', 'Bearer valid-token');

    // Should succeed after retry
    expect(res.status).toBe(200);
    expect(res.body.chargeId).toBe('ch_123');
  });

  test('circuit breaker opens after 5 consecutive failures', async () => {
    // All calls fail
    nock('https://api.external-service.com')
      .get('/data')
      .times(10)
      .reply(500);

    // Make 5 requests to trip the circuit breaker
    for (let i = 0; i < 5; i++) {
      await request(app).get('/api/external-data');
    }

    // 6th request should be rejected immediately by circuit breaker
    // (not waiting for timeout)
    const start = Date.now();
    const res = await request(app).get('/api/external-data');
    const duration = Date.now() - start;

    expect(res.status).toBe(503);
    expect(res.body.message).toMatch(/service unavailable|circuit open/i);
    expect(duration).toBeLessThan(100); // Should fail fast, not wait for timeout
  });

  test('partial failure: cache miss falls through to database', async () => {
    // Redis is down, but the request should still work (just slower)
    // This tests that your caching layer is a performance optimization,
    // not a hard dependency
    nock('http://localhost:6379')
      .get(/.*/)
      .replyWithError('Connection refused');

    const res = await request(app)
      .get('/api/items/1')
      .set('Authorization', 'Bearer valid-token');

    // Should still return data (from database, bypassing cache)
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });
});
```

### Database Connection Failure (Testcontainers)

```ts
// tests/chaos/database-failures.test.ts
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Pool } from 'pg';

describe('Database Connection Chaos', () => {
  let container: StartedTestContainer;
  let pool: Pool;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:15')
      .withEnvironment({ POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'testdb' })
      .withExposedPorts(5432)
      .start();

    pool = new Pool({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      database: 'testdb',
      user: 'postgres',
      password: 'test',
    });
  }, 60000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  test('app handles database restart gracefully', async () => {
    // Verify connection works
    const before = await pool.query('SELECT 1 as check');
    expect(before.rows[0].check).toBe(1);

    // Restart the database (simulates maintenance window)
    await container.restart();

    // First query after restart may fail — that's expected
    // But the connection pool should reconnect automatically
    let recovered = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        const result = await pool.query('SELECT 1 as check');
        if (result.rows[0].check === 1) {
          recovered = true;
          break;
        }
      } catch {
        // Expected — pool is reconnecting
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    expect(recovered).toBe(true);
  });

  test('slow queries do not block the entire connection pool', async () => {
    // Simulate a slow query holding a connection
    const slowQuery = pool.query('SELECT pg_sleep(10)').catch(() => {});

    // Other queries should still work (using different connections from pool)
    const fastQuery = await pool.query('SELECT 1 as check');
    expect(fastQuery.rows[0].check).toBe(1);

    // Clean up
    await pool.query('SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE query LIKE \'%pg_sleep%\' AND pid != pg_backend_pid()').catch(() => {});
  });
});
```

### Recovery Verification

```ts
// tests/chaos/recovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Recovery After Failure', () => {

  test('queued actions are processed after reconnection', async ({ page, context }) => {
    await page.goto('/dashboard');

    // Go offline
    await context.setOffline(true);

    // Perform actions that should be queued
    await page.click('[data-testid="mark-complete-1"]');
    await page.click('[data-testid="mark-complete-2"]');

    // Should show pending indicator
    await expect(page.locator('[data-testid="pending-sync"]')).toBeVisible();

    // Come back online
    await context.setOffline(false);

    // Queued actions should sync
    await expect(page.locator('[data-testid="pending-sync"]')).toBeHidden({
      timeout: 10000,
    });

    // Verify the actions were actually applied
    await page.reload();
    await expect(page.locator('[data-testid="item-1-status"]')).toHaveText('complete');
    await expect(page.locator('[data-testid="item-2-status"]')).toHaveText('complete');
  });
});
```

---

## Common Pitfalls

### 1. Chaos tests that are too chaotic
**Problem:** You inject 15 different failures simultaneously. Everything breaks, and you learn nothing about which failure caused which symptom.
**Fix:** Inject one failure at a time. Test database connection loss in isolation. Test API timeout in isolation. Only combine failures once individual failure handling is solid.

### 2. Not testing the recovery path
**Problem:** You verify the app shows an error when the API is down. You never verify it recovers when the API comes back.
**Fix:** Every chaos test should have three phases: (1) verify normal operation, (2) inject failure and verify graceful degradation, (3) remove failure and verify recovery.

### 3. Chaos tests that rely on timing
**Problem:** `sleep(5000)` to "wait for the circuit breaker to trip." This creates flaky tests that fail when CI is under load.
**Fix:** Poll for the expected state instead of sleeping. Use `waitForSelector`, `expect.poll()`, or retry loops with timeouts.

### 4. Testing only the frontend
**Problem:** Playwright route interception makes the frontend think the API failed, but the backend's actual error handling is never tested.
**Fix:** Pair frontend chaos tests (Playwright route interception) with backend chaos tests (nock/MSW intercepting outbound HTTP calls from your server).

### 5. Not documenting expected failure behavior
**Problem:** The chaos test verifies "the page doesn't crash" — but what should it actually show? Nobody agreed on the expected degraded experience.
**Fix:** Before writing chaos tests, document the expected behavior for each failure scenario. "When payment API is down, show message X and offer retry." Make the chaos test assert the specific expected behavior.

### 6. Forgetting about partial failures
**Problem:** You test "API is completely down." You never test "API responds, but with invalid data" or "API responds 200 but with an empty body."
**Fix:** Test the full spectrum: timeout, connection refused, 500 error, 200 with empty body, 200 with malformed JSON, 200 with valid JSON but missing fields.

---

## Proof Artifact

A chaos test pass produces these artifacts:

### Test output
```
Running 18 tests using 3 workers
  ✓ Network Failure › app shows offline indicator when network drops (2.1s)
  ✓ Network Failure › app recovers automatically when network returns (4.3s)
  ✓ Network Failure › slow network shows loading states (8.2s)
  ✓ Network Failure › request timeout shows retry option (3.1s)
  ✓ API Failures › payment failure shows user-friendly error (1.8s)
  ✓ API Failures › email service failure does not block signup (2.4s)
  ✓ API Failures › search service failure falls back to basic results (1.5s)
  ✓ API Failures › malformed JSON does not crash (1.2s)
  ✓ Service Chaos › payment processing retries on 503 (0.3s)
  ✓ Service Chaos › circuit breaker opens after 5 failures (1.1s)
  ✓ Service Chaos › cache miss falls through to database (0.2s)
  ✓ Database Chaos › app handles database restart gracefully (12.4s)
  ✓ Database Chaos › slow queries don't block pool (2.1s)
  ✓ Recovery › queued actions processed after reconnection (5.8s)

  18 passed (46.5s)
```

### What constitutes a pass:
1. **Every failure injection test** shows the app degrading gracefully (user-friendly errors, fallbacks, not crashes or blank screens)
2. **Every recovery test** shows the app returning to normal operation after the failure is removed
3. **Backend chaos tests** show retry logic, circuit breakers, and fallback mechanisms working correctly
4. **No unhandled exceptions** in console output during any chaos scenario
5. **CI pipeline** completes the chaos test step with exit code 0
