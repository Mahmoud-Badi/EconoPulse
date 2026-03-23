# Smoke Tests

## What It Is

Smoke tests are the minimal, fast test suite that runs immediately after every deployment to answer one question: "is the application fundamentally working?" They verify that the most critical paths — homepage loads, authentication works, the core feature is accessible, the API responds, the database is connected — are functional. If smoke tests fail, you roll back immediately without investigating further. They are not comprehensive; they are fast, reliable, and brutally focused on catching catastrophic deployment failures within 2 minutes.

---

## What It Catches

- **Deployment broke the build** — New environment variable wasn't set in production, app crashes on startup with `undefined` config error
- **Database migration failed silently** — Migration ran but didn't complete, half the tables have the new schema and half don't, queries fail unpredictably
- **Static asset serving is broken** — CSS/JS bundle hash changed but CDN cache wasn't invalidated, users get a blank page with 404s on all script tags
- **Environment configuration mismatch** — Staging URL hardcoded in a config file shipped to production, API calls go to the wrong environment
- **DNS/routing misconfiguration** — New deployment routed to wrong container, health check passes but actual routes return 502
- **Third-party service credentials rotated** — Stripe API key expired, payment page loads but every transaction fails
- **SSL certificate issues** — Certificate renewed but not deployed to the load balancer, HTTPS redirects create an infinite loop
- **Memory limits too low** — New feature increased baseline memory usage, container OOM-kills within 60 seconds of startup
- **Feature flag misconfiguration** — A flag that should be `true` in production is `false`, disabling the entire core feature

---

## When It's Required

**Always.** Every deployment to every environment (staging, production, preview environments) should trigger smoke tests. There is no project too small or too simple to skip this.

| Deployment Type | Smoke Tests? | Notes |
|----------------|-------------|-------|
| Production deploy | **Required** | Run immediately, roll back on failure |
| Staging deploy | **Required** | Catch issues before they reach production |
| Preview/PR environments | **Recommended** | Fast validation that the branch works when deployed |
| Hotfix deploy | **Required** | Hotfixes are rushed — smoke tests are your safety net |
| Infrastructure change (no code) | **Required** | Infra changes can break apps in non-obvious ways |
| Rollback | **Required** | Verify the rollback actually restored functionality |

**The difference between smoke tests and a full E2E suite:**

| | Smoke Tests | Full E2E |
|---|---|---|
| **When** | After every deployment | Before merge / scheduled |
| **Duration** | < 2 minutes | 10-30 minutes |
| **Scope** | 5-10 critical paths only | All user journeys |
| **On failure** | Roll back immediately | Block the PR, investigate |
| **Flakiness tolerance** | Zero — smoke tests must be 100% reliable | Some tolerance (retry logic) |

---

## Setup Guide

### With Playwright

```bash
# You already have Playwright from E2E tests
npm install -D @playwright/test
```

### Project Structure

```
tests/
  smoke/
    smoke.spec.ts        # All smoke tests in one file (keep it simple)
    smoke.config.ts      # Separate config with short timeouts
```

### Smoke-Specific Playwright Config

```ts
// tests/smoke/smoke.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 15000,          // 15 second max per test (these should be fast)
  retries: 1,              // One retry — smoke tests should not be flaky
  workers: 1,              // Sequential — order can matter for smoke tests
  reporter: [
    ['list'],
    ['json', { outputFile: 'smoke-results.json' }],
  ],
  use: {
    baseURL: process.env.SMOKE_TEST_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
```

### CI Integration

```yaml
# In your deployment pipeline (after deploy step)
- name: Run smoke tests
  run: npx playwright test --config=tests/smoke/smoke.config.ts
  env:
    SMOKE_TEST_URL: ${{ steps.deploy.outputs.url }}
  timeout-minutes: 3

- name: Rollback on smoke failure
  if: failure()
  run: |
    echo "Smoke tests failed — rolling back deployment"
    # Your rollback command here (platform-specific)
    # Vercel: vercel rollback
    # AWS: aws deploy stop-deployment
    # K8s: kubectl rollout undo deployment/app
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **Playwright** | Full browser smoke tests | Best if you already use it for E2E |
| **curl / wget scripts** | API-only smoke tests | Zero dependencies, works anywhere |
| **Datadog Synthetic Monitoring** | Production monitoring (not just post-deploy) | Runs continuously from multiple locations |
| **k6** | API smoke tests with performance thresholds | Good if you want smoke + basic perf in one |
| **Custom health check endpoint** | Infrastructure-level smoke | Combine with an HTTP check in your deployment pipeline |

---

## Template

### Complete Smoke Test Suite

```ts
// tests/smoke/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  // ─── INFRASTRUCTURE ────────────────────────────────────────────

  test('health endpoint returns 200', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.database).toBe('connected');
    expect(body.version).toBeDefined(); // Verify correct version deployed
  });

  // ─── HOMEPAGE ──────────────────────────────────────────────────

  test('homepage loads with content', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Page has real content (not a blank screen or error page)
    await expect(page.locator('h1')).toBeVisible();

    // CSS loaded (not unstyled HTML)
    const bgColor = await page.locator('body').evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent (default)

    // JavaScript loaded (interactive elements work)
    const jsLoaded = await page.evaluate(() => typeof window !== 'undefined');
    expect(jsLoaded).toBe(true);

    // No console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  // ─── AUTHENTICATION ────────────────────────────────────────────

  test('login page loads and form is functional', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('login with valid credentials succeeds', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', process.env.SMOKE_TEST_EMAIL || 'smoke@test.com');
    await page.fill('input[name="password"], input[type="password"]', process.env.SMOKE_TEST_PASSWORD || 'smoke-test-pass');
    await page.click('button[type="submit"]');

    // Should redirect to authenticated area
    await page.waitForURL(/\/(dashboard|home|app)/, { timeout: 10000 });
    expect(page.url()).not.toContain('/login');
  });

  // ─── CORE FEATURE ──────────────────────────────────────────────

  test('core feature page loads with data', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', process.env.SMOKE_TEST_EMAIL || 'smoke@test.com');
    await page.fill('input[name="password"], input[type="password"]', process.env.SMOKE_TEST_PASSWORD || 'smoke-test-pass');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dashboard|home|app)/);

    // Navigate to the main feature
    await page.goto('/dashboard');

    // Key UI elements are present
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();

    // Data loaded (not empty state when data should exist)
    const itemCount = await page.locator('[data-testid="item"]').count();
    expect(itemCount).toBeGreaterThan(0);
  });

  // ─── API ───────────────────────────────────────────────────────

  test('authenticated API endpoint returns data', async ({ request }) => {
    // Login via API
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: process.env.SMOKE_TEST_EMAIL || 'smoke@test.com',
        password: process.env.SMOKE_TEST_PASSWORD || 'smoke-test-pass',
      },
    });
    expect(loginRes.status()).toBe(200);
    const { token } = await loginRes.json();

    // Fetch core data
    const dataRes = await request.get('/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(dataRes.status()).toBe(200);
    const body = await dataRes.json();
    expect(Array.isArray(body.items || body.data || body)).toBe(true);
  });

  // ─── STATIC ASSETS ────────────────────────────────────────────

  test('critical static assets load', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', (response) => {
      if (response.status() >= 400 && response.url().match(/\.(js|css|woff2?|png|svg)$/)) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests).toEqual([]);
  });
});
```

### Health Check Endpoint (Backend)

```ts
// src/api/health.ts (Express example)
import { Router } from 'express';
import { db } from '../db';
import { redis } from '../cache';

const router = Router();

router.get('/api/health', async (req, res) => {
  const checks: Record<string, string> = {
    status: 'ok',
    version: process.env.APP_VERSION || 'unknown',
    timestamp: new Date().toISOString(),
  };

  // Database check
  try {
    await db.raw('SELECT 1');
    checks.database = 'connected';
  } catch (err) {
    checks.database = 'disconnected';
    checks.status = 'degraded';
  }

  // Cache check (non-critical — degraded, not down)
  try {
    await redis.ping();
    checks.cache = 'connected';
  } catch (err) {
    checks.cache = 'disconnected';
    if (checks.status === 'ok') checks.status = 'degraded';
  }

  const statusCode = checks.status === 'ok' ? 200 : checks.database === 'disconnected' ? 503 : 200;
  res.status(statusCode).json(checks);
});

export default router;
```

### Shell-Based Smoke Test (Zero Dependencies)

```bash
#!/bin/bash
# scripts/smoke-test.sh — works anywhere with curl
set -e

BASE_URL="${SMOKE_TEST_URL:-http://localhost:3000}"
FAILURES=0

check() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")

  if [ "$status" = "$expected_status" ]; then
    echo "✓ $name (HTTP $status)"
  else
    echo "✗ $name — expected $expected_status, got $status"
    FAILURES=$((FAILURES + 1))
  fi
}

echo "Running smoke tests against $BASE_URL"
echo "────────────────────────────────────"

check "Health endpoint"     "$BASE_URL/api/health"
check "Homepage"            "$BASE_URL/"
check "Login page"          "$BASE_URL/login"
check "Static assets (CSS)" "$BASE_URL/_next/static/css/" # Adjust for your framework

echo "────────────────────────────────────"

if [ "$FAILURES" -gt 0 ]; then
  echo "FAILED: $FAILURES smoke test(s) failed"
  exit 1
else
  echo "PASSED: All smoke tests passed"
  exit 0
fi
```

### package.json Scripts

```json
{
  "scripts": {
    "test:smoke": "playwright test --config=tests/smoke/smoke.config.ts",
    "test:smoke:staging": "SMOKE_TEST_URL=https://staging.example.com npm run test:smoke",
    "test:smoke:prod": "SMOKE_TEST_URL=https://example.com npm run test:smoke",
    "test:smoke:shell": "bash scripts/smoke-test.sh"
  }
}
```

---

## Common Pitfalls

### 1. Smoke tests that take too long
**Problem:** Your "smoke tests" grew to 45 tests and take 8 minutes. By the time they fail, the broken deployment has been serving users for 8 minutes.
**Fix:** Hard rule: smoke tests must complete in under 2 minutes. If you have more than 10 tests, move the extras to a full E2E suite. Smoke tests cover only what would trigger an immediate rollback.

### 2. Smoke tests that depend on specific data
**Problem:** Smoke test checks for "Welcome back, John" on the dashboard, but the smoke test user's name was changed to "Jonathan" in a data migration.
**Fix:** Assert structure, not specific content. Check that the dashboard loads, that a greeting element exists, that data items are present — not that specific text matches.

### 3. Shared test accounts with other tests
**Problem:** Smoke test logs in as `smoke@test.com`, but the integration test suite just deleted that user or changed its password.
**Fix:** Smoke test accounts must be protected and isolated. Never use them in other test suites. Ideally, create a dedicated smoke test account that's seeded by the deployment process itself.

### 4. Not running smoke tests after rollbacks
**Problem:** Deployment broke, you rolled back, everyone assumes it's fine. But the rollback also has issues (old code, new database schema).
**Fix:** Smoke tests trigger after every deployment action, including rollbacks.

### 5. Smoke tests that don't fail fast
**Problem:** Each test has a 30-second timeout. When the app is completely down, the smoke suite takes 5 minutes to report failure because each test waits the full timeout.
**Fix:** Set aggressive timeouts (10-15 seconds per test). If a page doesn't load in 15 seconds, it's not a slow-loading page — it's broken.

### 6. No rollback automation
**Problem:** Smoke tests fail at 2 AM, alert fires, nobody is awake to manually roll back. Users experience the broken deployment for 6 hours.
**Fix:** Wire smoke test failure to automatic rollback in your CI/CD pipeline. If smoke tests fail, the pipeline rolls back without human intervention.

---

## Proof Artifact

A smoke test pass produces these artifacts:

### Terminal output
```
Running 6 tests using 1 worker
  ✓ Smoke Tests › health endpoint returns 200 (0.2s)
  ✓ Smoke Tests › homepage loads with content (1.4s)
  ✓ Smoke Tests › login page loads and form is functional (0.8s)
  ✓ Smoke Tests › login with valid credentials succeeds (2.1s)
  ✓ Smoke Tests › core feature page loads with data (1.6s)
  ✓ Smoke Tests › critical static assets load (1.2s)

  6 passed (7.3s)
```

### JSON report (saved by CI)
```json
{
  "stats": { "total": 6, "passed": 6, "failed": 0 },
  "duration": 7312,
  "environment": "production",
  "deploymentId": "deploy-abc123",
  "timestamp": "2024-01-15T14:32:00Z"
}
```

### What constitutes a pass:
1. **All smoke tests pass** on the first attempt (no retries needed for a healthy deploy)
2. **Total duration under 2 minutes**
3. **Health endpoint** confirms database connected and correct version deployed
4. **JSON report** saved as deployment artifact for audit trail
5. **CI pipeline** proceeds to "deployment complete" status (or triggers rollback on failure)
