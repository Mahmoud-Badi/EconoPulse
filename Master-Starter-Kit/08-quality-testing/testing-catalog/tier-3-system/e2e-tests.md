# E2E Tests

## What It Is

End-to-end tests verify complete user journeys through the real running application — browser, server, database, third-party services, all connected. Unlike integration tests that verify module boundaries, E2E tests answer the question "can a real user actually complete this task?" by automating the exact sequence of clicks, form fills, navigations, and assertions a human would perform. Playwright is the primary tool because it provides auto-waiting, multi-browser support, and a trace viewer for debugging failures. E2E tests are the most expensive tests in the pyramid (slow, flaky-prone, hard to debug), which means you write fewer of them and target only critical paths — the flows where failure means lost revenue, lost users, or broken trust.

## What It Catches

- **Broken user flows after refactoring** — login form works in isolation but the redirect after auth lands on a 404 because the route changed
- **Environment integration failures** — API returns data but the frontend crashes because the response shape changed and no contract test existed
- **State management bugs across pages** — user adds item to cart on page A, navigates to page B, cart is empty because state wasn't persisted correctly
- **Auth flow breakage** — sign-up works but the email verification link redirects to the wrong environment URL
- **Third-party widget failures** — Stripe checkout element fails to mount because CSP headers block the iframe in staging
- **Race conditions in real network timing** — form double-submits because the button isn't disabled during the API call, creating duplicate records
- **Navigation and routing errors** — deep links that worked in development return 404 in production because of missing server-side route configuration
- **Cookie/session expiration mid-flow** — user starts a multi-step wizard, takes a break, returns to find step 3 throws an unhandled error instead of redirecting to login

## When It's Required

- The feature has a user-facing interface (C4) with multi-step flows
- The feature involves authentication or authorization (C6)
- The feature handles money, billing, or financial data (C7) — every payment flow needs E2E coverage
- The feature involves user input that triggers server-side processing (C5)
- You're modifying an existing critical path (C9) — regression E2E tests prove you didn't break the journey
- The feature is the primary revenue-generating flow (sign-up, checkout, onboarding)

**Skip when:** The feature is a pure backend service with no UI, or a standalone utility component with no user journey.

## Setup Guide

### Playwright (Primary — Node/React/Next.js)

```bash
# Install
npm init playwright@latest

# This creates:
# playwright.config.ts — main configuration
# tests/ — test directory
# .github/workflows/playwright.yml — CI template (if selected)
```

**playwright.config.ts — production-grade configuration:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // Auth setup — runs once, saves state for all tests
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

**Auth setup file (e2e/auth.setup.ts):**

```typescript
import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('testpassword123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: authFile });
});
```

### Alternatives

- **Cypress** — good DX with time-travel debugging, but single-browser (Chromium-based), slower parallel execution, and the dashboard is paid
- **TestCafe** — no WebDriver dependency, built-in waiting, but smaller ecosystem and fewer CI integrations
- **Selenium** — the original, supports every browser and language, but verbose API and significantly slower

## Template

### Critical flow: Sign up, onboard, use core feature

```typescript
import { test, expect } from '@playwright/test';

test.describe('New user journey', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // No auth — fresh user

  test('sign up → onboard → create first project', async ({ page }) => {
    // Step 1: Sign up
    await page.goto('/signup');
    await page.getByLabel('Full name').fill('Test User');
    await page.getByLabel('Email').fill(`test+${Date.now()}@example.com`);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    // Step 2: Verify redirect to onboarding
    await expect(page).toHaveURL(/\/onboarding/);
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

    // Step 3: Complete onboarding
    await page.getByRole('button', { name: 'Personal' }).click();
    await page.getByLabel('Company name').fill('Test Corp');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/onboarding\/step-2/);

    await page.getByRole('checkbox', { name: /project management/i }).check();
    await page.getByRole('button', { name: 'Finish setup' }).click();

    // Step 4: Land on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome, Test User')).toBeVisible();

    // Step 5: Create first project (core feature)
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project name').fill('My First Project');
    await page.getByRole('button', { name: 'Create' }).click();

    // Step 6: Verify project exists
    await expect(page.getByRole('heading', { name: 'My First Project' })).toBeVisible();
    await expect(page.getByText('0 tasks')).toBeVisible();
  });
});
```

### Page Object Model (for reuse across tests)

```typescript
// e2e/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### CI configuration (GitHub Actions)

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

## Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| **Using `waitForTimeout()`** | Developer wants to "wait for the thing" and reaches for sleep. This is always wrong — it's either too slow (wasting CI time) or too fast (flaky). | Use `waitForURL()`, `expect().toBeVisible()`, `waitForResponse()`, or `waitForSelector()`. Playwright auto-waits on actions — trust it. |
| **CSS selectors instead of accessible selectors** | `page.click('.btn-primary.mt-4')` breaks when any class name changes. | Use `getByRole('button', { name: 'Submit' })`, `getByLabel()`, `getByText()`, `getByTestId()` (last resort). This also improves accessibility. |
| **Testing implementation, not behavior** | Asserting internal state, checking specific DOM structure, verifying CSS classes. | Assert what the user sees: text content, element visibility, URL changes, downloaded files. |
| **No auth state reuse** | Every test logs in through the UI, adding 5-10 seconds per test. 50 tests = 4-8 extra minutes. | Use Playwright's `storageState` to authenticate once in setup, share the session with all tests. |
| **Tests depend on each other** | Test B assumes test A created a record. Test A fails, test B fails for a different reason, debugging is hell. | Every test creates its own data, cleans up after itself. Use `test.beforeEach()` for setup, API calls for data seeding (not UI). |
| **Flaky tests ignored** | A test fails intermittently, team adds `.skip()` or ignores it. The flake hides a real race condition. | Quarantine flaky tests in a separate project, fix them within 48 hours. Use `retries: 2` in CI but track retry rates — if a test retries often, it has a bug. |
| **Testing too many paths E2E** | Team writes E2E tests for every edge case, CI takes 45 minutes, developers stop running tests. | E2E tests cover critical paths only (5-10 journeys). Edge cases belong in unit/integration tests. Apply the testing pyramid. |

## Proof Artifact

The E2E test suite must produce all of the following:

1. **Test results summary** — all tests passing with exit code 0
   ```
   Running 12 tests using 4 workers
   12 passed (1m 23s)
   ```

2. **HTML report** — `playwright-report/index.html` generated by `npx playwright show-report`, showing each test with timing, screenshots on failure, and trace files

3. **CI pipeline green** — screenshot or link to the passing GitHub Actions / CI run showing the E2E job completed

4. **Trace file for critical path** — at minimum, the primary user journey test should have a trace (`.zip`) viewable via `npx playwright show-trace` that shows the full timeline of actions, network requests, and DOM snapshots

5. **Coverage of critical paths documented** — a comment or table mapping each E2E test to the user story or flow it covers:
   ```
   | Test File                | Critical Path Covered           |
   |--------------------------|---------------------------------|
   | signup-onboard.spec.ts   | New user → sign up → onboard    |
   | checkout.spec.ts         | Browse → cart → pay → confirm   |
   | invite-team.spec.ts      | Owner → invite → accept → join  |
   ```
