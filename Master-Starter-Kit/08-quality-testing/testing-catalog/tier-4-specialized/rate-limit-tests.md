# Rate Limit Tests

## What It Is

Rate limit testing verifies that your application's rate limiting actually works — that the Nth+1 request gets rejected with a 429 status code, that rate limit headers are correct, that the UI handles 429 responses gracefully, and that the configured limits match what you documented. It also tests the boundary conditions: per-user vs per-IP vs per-endpoint scoping, rate limit reset timing, burst allowances, and what happens when someone genuinely hits the limit versus a bug in your rate limiting middleware. Without these tests, your rate limits exist in configuration files but have never been proven to work, which means they might not work when you actually need them — during a DDoS, credential stuffing attack, or abusive API consumer.

---

## What It Catches

- **Rate limits not actually enforced** — Config says 100 requests/minute, but the middleware is registered on the wrong router or uses the wrong key function, so limits never apply
- **Wrong rate limit scope** — Rate limit is per-IP, but behind a load balancer all requests appear to come from the same IP (the LB's IP), so one user's traffic rate-limits all users
- **UI crash on 429** — API returns 429, frontend code doesn't handle this status code, user sees an unhandled error or white screen instead of "please slow down"
- **Missing Retry-After header** — API returns 429 but doesn't tell the client when to try again. Clients immediately retry in a tight loop, making the situation worse.
- **Rate limit headers incorrect** — `X-RateLimit-Remaining` shows 50 even after 80 requests, because the header is calculated from a different counter than the enforcement logic
- **Reset timing wrong** — Rate limit window is supposed to reset every 60 seconds, but actually resets every 60 minutes because the TTL unit was seconds, not milliseconds
- **Authenticated vs unauthenticated limits differ incorrectly** — Anonymous users get 10 requests/minute (intended), but authenticated users also get 10/minute because the auth check happens after the rate limiter
- **Rate limit bypass via header manipulation** — Attacker sets `X-Forwarded-For: random-ip` on every request, getting a fresh rate limit quota each time because the server trusts the header
- **Burst handling** — User sends 50 requests in 1 second (a page load that triggers many API calls). Rate limit is 100/minute but the burst window is 10/second, causing legitimate usage to be blocked.
- **Rate limit not isolated between endpoints** — Login attempts and API data fetches share the same rate limit counter. Normal API usage burns through the login attempt limit.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Public-facing API | Bots, scrapers, and attackers will test your limits |
| Authentication endpoints (login, password reset, signup) | Credential stuffing and brute force are guaranteed |
| File upload endpoints | Disk/storage abuse without rate limits |
| Resource-intensive operations (search, reports, exports) | A single user can accidentally DoS your system |
| Webhook delivery endpoints | Misconfigured third-party can flood you |
| Free tier with usage limits | Billing depends on correct enforcement |
| Multi-tenant application | One tenant shouldn't be able to degrade service for others |
| Any API documented with rate limits | If you promise limits, you must prove they work |

**Skip when:** Internal tool behind VPN with trusted users only, prototype with no public access, static site with no API.

---

## Setup Guide

### Rate Limiting Middleware

```bash
# Express
npm install express-rate-limit
npm install rate-limit-redis  # For distributed rate limiting (multi-server)

# Next.js API Routes
npm install @upstash/ratelimit @upstash/redis  # Serverless-compatible

# Alternatives
npm install bottleneck        # Client-side rate limiting (outbound requests)
```

### Testing Tools

```bash
# Playwright (test UI handling of 429s)
npm install -D @playwright/test

# autocannon or k6 (rapid request generation for limit testing)
# k6: brew install k6
# autocannon: npm install -D autocannon
```

### Project Structure

```
tests/
  rate-limit/
    enforcement.test.ts           # Do limits actually work?
    headers.test.ts               # Are rate limit headers correct?
    scoping.test.ts               # Per-user, per-IP, per-endpoint isolation
    ui-handling.spec.ts           # Does the UI handle 429 gracefully?
    reset-timing.test.ts          # Does the window reset at the right time?
    bypass-prevention.test.ts     # Can limits be circumvented?
```

---

## Template

### Rate Limit Enforcement Test

```ts
// tests/rate-limit/enforcement.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Rate Limit Enforcement', () => {
  const LIMIT = 100;  // Configured limit per window
  const WINDOW_MS = 60_000;  // 1 minute window

  test(`login endpoint rejects after ${LIMIT} requests`, async () => {
    const results: number[] = [];

    // Send LIMIT + 10 requests rapidly
    for (let i = 0; i < LIMIT + 10; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong-password' });
      results.push(res.status);
    }

    // First LIMIT requests should get normal responses (200 or 401)
    const allowedResponses = results.slice(0, LIMIT);
    expect(allowedResponses.every(s => s !== 429)).toBe(true);

    // Requests after LIMIT should get 429
    const blockedResponses = results.slice(LIMIT);
    expect(blockedResponses.every(s => s === 429)).toBe(true);
  });

  test('429 response includes Retry-After header', async () => {
    // Exhaust the rate limit
    for (let i = 0; i < LIMIT; i++) {
      await request(app).get('/api/items');
    }

    // Next request should be rate limited
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();

    // Retry-After should be a reasonable number (seconds until reset)
    const retryAfter = parseInt(res.headers['retry-after']);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(60);  // Should be within the window
  });

  test('429 response body has meaningful error message', async () => {
    // Exhaust the rate limit
    for (let i = 0; i < LIMIT; i++) {
      await request(app).get('/api/items');
    }

    const res = await request(app).get('/api/items');
    expect(res.status).toBe(429);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toMatch(/rate limit|too many requests|slow down/i);

    // Should NOT expose internal details
    expect(JSON.stringify(res.body)).not.toContain('redis');
    expect(JSON.stringify(res.body)).not.toContain('limiter');
  });

  test('rate limit resets after the window expires', async () => {
    // Exhaust the rate limit
    for (let i = 0; i < LIMIT; i++) {
      await request(app).get('/api/items');
    }

    // Verify we're rate limited
    let res = await request(app).get('/api/items');
    expect(res.status).toBe(429);

    // Wait for the window to reset (use a shorter window in test config)
    // In test environment, set RATE_LIMIT_WINDOW_MS=5000 (5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 5500));

    // Should be allowed again
    res = await request(app).get('/api/items');
    expect(res.status).not.toBe(429);
  }, 10000);
});
```

### Rate Limit Headers Test

```ts
// tests/rate-limit/headers.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Rate Limit Headers', () => {
  const LIMIT = 100;

  test('response includes X-RateLimit-Limit header', async () => {
    const res = await request(app).get('/api/items');
    expect(res.headers['x-ratelimit-limit']).toBe(String(LIMIT));
  });

  test('X-RateLimit-Remaining decrements correctly', async () => {
    // First request
    const res1 = await request(app).get('/api/items');
    const remaining1 = parseInt(res1.headers['x-ratelimit-remaining']);
    expect(remaining1).toBe(LIMIT - 1);

    // Second request
    const res2 = await request(app).get('/api/items');
    const remaining2 = parseInt(res2.headers['x-ratelimit-remaining']);
    expect(remaining2).toBe(LIMIT - 2);

    // Nth request
    for (let i = 0; i < 8; i++) {
      await request(app).get('/api/items');
    }
    const res10 = await request(app).get('/api/items');
    const remaining10 = parseInt(res10.headers['x-ratelimit-remaining']);
    expect(remaining10).toBe(LIMIT - 11);  // 11 total requests
  });

  test('X-RateLimit-Reset is a valid timestamp', async () => {
    const res = await request(app).get('/api/items');
    const resetTimestamp = parseInt(res.headers['x-ratelimit-reset']);

    // Should be a Unix timestamp in the future
    const now = Math.floor(Date.now() / 1000);
    expect(resetTimestamp).toBeGreaterThan(now);
    expect(resetTimestamp).toBeLessThan(now + 120);  // Within 2 minutes
  });

  test('X-RateLimit-Remaining reaches 0 before 429', async () => {
    let lastRemainingBeforeBlock = -1;

    for (let i = 0; i < LIMIT + 5; i++) {
      const res = await request(app).get('/api/items');
      if (res.status === 429) {
        break;
      }
      lastRemainingBeforeBlock = parseInt(res.headers['x-ratelimit-remaining']);
    }

    expect(lastRemainingBeforeBlock).toBe(0);
  });
});
```

### Rate Limit Scoping Test

```ts
// tests/rate-limit/scoping.test.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Rate Limit Scoping', () => {

  test('rate limits are per-user, not global', async () => {
    // Login as User A
    const loginA = await request(app)
      .post('/api/auth/login')
      .send({ email: 'userA@test.com', password: 'password' });
    const tokenA = loginA.body.token;

    // Login as User B
    const loginB = await request(app)
      .post('/api/auth/login')
      .send({ email: 'userB@test.com', password: 'password' });
    const tokenB = loginB.body.token;

    // User A sends 50 requests
    for (let i = 0; i < 50; i++) {
      await request(app)
        .get('/api/items')
        .set('Authorization', `Bearer ${tokenA}`);
    }

    // User B should NOT be affected by User A's usage
    const resB = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${tokenB}`);
    expect(resB.status).not.toBe(429);

    const remaining = parseInt(resB.headers['x-ratelimit-remaining']);
    expect(remaining).toBeGreaterThan(40);  // Should have nearly full quota
  });

  test('different endpoints have independent limits', async () => {
    // Exhaust /api/items limit
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api/items');
    }
    const itemsRes = await request(app).get('/api/items');
    expect(itemsRes.status).toBe(429);

    // /api/users should still be available
    const usersRes = await request(app).get('/api/users');
    expect(usersRes.status).not.toBe(429);
  });

  test('login endpoint has stricter limits than data endpoints', async () => {
    const LOGIN_LIMIT = 5;   // Stricter: 5 attempts per 15 minutes
    const API_LIMIT = 100;    // Normal: 100 per minute

    // Check login limit
    for (let i = 0; i < LOGIN_LIMIT; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });
    }
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong' });
    expect(loginRes.status).toBe(429);

    // API should still work
    const apiRes = await request(app).get('/api/items');
    expect(apiRes.status).not.toBe(429);
  });
});
```

### UI Handling of 429 (Playwright)

```ts
// tests/rate-limit/ui-handling.spec.ts
import { test, expect } from '@playwright/test';

test.describe('UI Rate Limit Handling', () => {

  test('429 response shows user-friendly message', async ({ page }) => {
    // Intercept API calls to return 429
    await page.route('**/api/items**', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '30',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 30),
        },
        body: JSON.stringify({
          error: 'Too many requests. Please try again in 30 seconds.',
        }),
      })
    );

    await page.goto('/dashboard');

    // Should show rate limit message, NOT a crash or generic error
    await expect(page.locator('[data-testid="rate-limit-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="rate-limit-message"]')).toContainText(
      /slow down|too many|try again|wait/i
    );

    // Page should still be navigable
    await expect(page.locator('nav')).toBeVisible();
  });

  test('429 triggers auto-retry after Retry-After period', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/dashboard**', (route) => {
      requestCount++;
      if (requestCount <= 1) {
        // First request: rate limited
        route.fulfill({
          status: 429,
          headers: { 'Retry-After': '2' },  // 2 seconds (short for testing)
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Rate limited' }),
        });
      } else {
        // Subsequent requests: succeed
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ widgets: [{ id: 1, name: 'Test' }] }),
        });
      }
    });

    await page.goto('/dashboard');

    // Should initially show rate limit / loading state
    await expect(page.locator('[data-testid="rate-limit-message"]')).toBeVisible();

    // After Retry-After period, should auto-retry and show data
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({
      timeout: 10000,
    });

    expect(requestCount).toBeGreaterThan(1); // Confirms auto-retry happened
  });

  test('rapid button clicks do not send duplicate requests', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/items', (route) => {
      if (route.request().method() === 'POST') {
        requestCount++;
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: requestCount }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/items/new');
    await page.fill('[name="title"]', 'Test Item');

    // Click submit 5 times rapidly
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Should have sent only 1 request (button disabled after first click)
    expect(requestCount).toBe(1);
  });
});
```

### Load Test to Find Breaking Point

```js
// tests/rate-limit/find-breaking-point.k6.js
import http from 'k6/http';
import { check } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const rateLimitedRate = new Rate('rate_limited');
const totalRequests = new Counter('total_requests');

export const options = {
  scenarios: {
    ramp_up: {
      executor: 'ramping-arrival-rate',
      startRate: 10,        // Start at 10 requests/second
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 200,
      stages: [
        { duration: '30s', target: 10 },    // 10 req/s baseline
        { duration: '30s', target: 50 },    // Ramp to 50 req/s
        { duration: '30s', target: 100 },   // Ramp to 100 req/s
        { duration: '30s', target: 200 },   // Ramp to 200 req/s
        { duration: '30s', target: 500 },   // Ramp to 500 req/s
      ],
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/items`);
  totalRequests.add(1);

  const isRateLimited = res.status === 429;
  rateLimitedRate.add(isRateLimited);

  if (isRateLimited) {
    check(res, {
      '429 has Retry-After header': (r) => r.headers['Retry-After'] !== undefined,
      '429 has error body': (r) => JSON.parse(r.body).error !== undefined,
    });
  } else {
    check(res, {
      'non-429 status is 200': (r) => r.status === 200,
    });
  }
}

export function handleSummary(data) {
  const rateLimited = data.metrics.rate_limited?.values?.rate || 0;
  const total = data.metrics.total_requests?.values?.count || 0;

  console.log(`\nRate Limit Analysis:`);
  console.log(`  Total requests sent: ${total}`);
  console.log(`  Rate limited (429): ${(rateLimited * 100).toFixed(1)}%`);
  console.log(`  Rate limit begins taking effect at the configured threshold`);

  return {};
}
```

### CI Integration

```yaml
# .github/workflows/rate-limit-tests.yml
name: Rate Limit Tests
on:
  push:
    paths:
      - 'src/middleware/rate-limit*'
      - 'src/config/rate-limit*'
      - 'tests/rate-limit/**'
  pull_request:
    paths:
      - 'src/middleware/rate-limit*'

jobs:
  rate-limit-tests:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Run rate limit unit/integration tests
        run: npx jest tests/rate-limit/ --forceExit --runInBand
        env:
          REDIS_URL: redis://localhost:6379
          RATE_LIMIT_WINDOW_MS: 5000   # Short window for testing
          RATE_LIMIT_MAX: 10           # Low limit for testing
      - name: Run UI rate limit tests
        run: |
          npx playwright install --with-deps
          npm run build && npm run start &
          npx wait-on http://localhost:3000
          npx playwright test tests/rate-limit/ui-handling.spec.ts
```

### package.json Scripts

```json
{
  "scripts": {
    "test:ratelimit": "jest tests/rate-limit/ --forceExit --runInBand",
    "test:ratelimit:ui": "playwright test tests/rate-limit/ui-handling.spec.ts",
    "test:ratelimit:load": "k6 run tests/rate-limit/find-breaking-point.k6.js",
    "test:ratelimit:all": "npm run test:ratelimit && npm run test:ratelimit:ui"
  }
}
```

---

## Common Pitfalls

### 1. Running rate limit tests in parallel
**Problem:** Jest runs test files in parallel. Two test files both send 100 requests to the same endpoint, interfering with each other's rate limit counts. Tests pass or fail randomly.
**Fix:** Always run rate limit tests with `--runInBand` (sequential). Each test should either use its own rate limit key (different user/IP) or reset the rate limit store between tests.

### 2. Not resetting rate limits between tests
**Problem:** Test 1 sends 50 requests. Test 2 expects to send 100 requests before hitting the limit, but the counter is already at 50 from test 1.
**Fix:** Reset the rate limit store (Redis `FLUSHDB`, in-memory store reset) in `beforeEach`. Or use a unique identifier per test as the rate limit key.

### 3. Testing against production rate limits
**Problem:** Production limit is 1,000 requests/minute. Your test sends 1,001 requests to verify the limit. The test takes 2 minutes and is painfully slow.
**Fix:** Use a separate rate limit configuration for tests with lower limits (10-20) and shorter windows (5 seconds). Verify the production config matches documentation through config tests, not load tests.

### 4. Rate limiting behind a proxy without X-Forwarded-For handling
**Problem:** All requests appear to come from `127.0.0.1` (the proxy's IP) in production. Rate limit applies globally to all users behind the same proxy.
**Fix:** Configure the rate limiter to trust the `X-Forwarded-For` header from trusted proxies only. Test this specifically: send requests with different `X-Forwarded-For` values and verify they get independent rate limits.

### 5. Not testing what the user actually sees
**Problem:** Backend rate limiting works perfectly. The frontend has no 429 handler, so the user sees "Something went wrong" instead of "You're sending too many requests, please wait 30 seconds."
**Fix:** Always include Playwright tests that verify the UI response to 429 status codes. The user experience of being rate limited matters as much as the enforcement.

### 6. Forgetting about authenticated vs unauthenticated rates
**Problem:** Authenticated users get the same low rate limit as anonymous users because the rate limiter runs before the auth middleware.
**Fix:** Either run the rate limiter after auth (so it can use user ID as the key) or configure two tiers: a strict anonymous limit (by IP) and a generous authenticated limit (by user ID).

---

## Proof Artifact

A rate limit test pass produces these artifacts:

### Test output
```
PASS  tests/rate-limit/enforcement.test.ts (8.2s)
  Rate Limit Enforcement
    ✓ login endpoint rejects after 10 requests (1.2s)
    ✓ 429 response includes Retry-After header (0.8s)
    ✓ 429 response body has meaningful error message (0.6s)
    ✓ rate limit resets after the window expires (5.3s)

PASS  tests/rate-limit/headers.test.ts (3.1s)
  Rate Limit Headers
    ✓ response includes X-RateLimit-Limit header (0.1s)
    ✓ X-RateLimit-Remaining decrements correctly (0.9s)
    ✓ X-RateLimit-Reset is a valid timestamp (0.1s)
    ✓ X-RateLimit-Remaining reaches 0 before 429 (0.8s)

PASS  tests/rate-limit/scoping.test.ts (4.5s)
  Rate Limit Scoping
    ✓ rate limits are per-user, not global (2.1s)
    ✓ different endpoints have independent limits (1.3s)
    ✓ login endpoint has stricter limits than data endpoints (0.9s)

PASS  tests/rate-limit/ui-handling.spec.ts (6.2s)
  UI Rate Limit Handling
    ✓ 429 response shows user-friendly message (1.8s)
    ✓ 429 triggers auto-retry after Retry-After period (3.2s)
    ✓ rapid button clicks do not send duplicate requests (1.1s)

  14 passed (22.0s)
```

### What constitutes a pass:
1. **Rate limits enforced** — requests beyond the limit receive 429 status codes
2. **Headers correct** — `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` are present and accurate
3. **Scoping verified** — per-user isolation works, endpoints have independent limits
4. **UI handles 429** — user-friendly message, auto-retry, no crashes
5. **Reset timing verified** — rate limit resets after the configured window
6. **CI pipeline** completes the rate limit test job with exit code 0
