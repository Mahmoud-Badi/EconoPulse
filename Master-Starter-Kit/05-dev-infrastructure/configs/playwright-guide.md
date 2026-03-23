# Playwright E2E Test Configuration Guide

## Overview

Playwright runs end-to-end tests against the actual running application in real browsers. It lives in `apps/web/` alongside the Next.js app and tests complete user flows.

## Installation

```bash
pnpm add -D @playwright/test --filter @{project}/web

# Install browser binaries
cd apps/web && npx playwright install
```

## Configuration

**apps/web/playwright.config.ts:**

```typescript
import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || 3000;
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["github"]]
    : [["html", { open: "on-failure" }]],

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // CRITICAL: cwd must point to the MONOREPO ROOT, not apps/web/
    // pnpm dev runs from root via Turbo, which resolves workspace deps
    cwd: "../../",
  },
});
```

## Critical Configuration Details

### webServer.cwd (Most Common Gotcha)

The `webServer.cwd` property must point to the **monorepo root**, not `apps/web/`. This is because `pnpm dev` runs via Turbo from the root, which needs access to the workspace-linked packages.

```typescript
// CORRECT: Go up from apps/web/ to monorepo root
webServer: {
  command: "pnpm dev",
  cwd: "../../",
}

// WRONG: Runs in apps/web/ — can't resolve @{project}/db etc.
webServer: {
  command: "pnpm dev",
  // missing cwd, defaults to playwright config directory
}
```

### CI vs Local Settings

| Setting | Local | CI |
|---------|-------|-----|
| `fullyParallel` | true | true |
| `workers` | auto (CPU cores) | 1 (single worker) |
| `retries` | 0 | 2 |
| `forbidOnly` | false | true (fails if .only exists) |
| `reuseExistingServer` | true | false |
| `reporter` | html (opens on failure) | html + github |

### Trace and Screenshots

```typescript
use: {
  trace: "on-first-retry",         // Full trace on first retry (large files)
  screenshot: "only-on-failure",    // Screenshot final state of failed tests
  video: "retain-on-failure",       // Video only kept for failed tests
}
```

Traces include DOM snapshots, network requests, and console logs. View with `npx playwright show-trace trace.zip`.

## Directory Structure

```
apps/web/
  e2e/
    auth.spec.ts          # Login, logout, registration
    dashboard.spec.ts     # Dashboard page tests
    trips.spec.ts         # Trip CRUD flows
    fixtures/
      auth.ts             # Login helper fixture
      seed.ts             # Test data setup
    helpers/
      selectors.ts        # Shared selectors
  playwright.config.ts
  playwright-report/      # Generated reports (gitignored)
  test-results/           # Test artifacts (gitignored)
```

## Test Fixtures

### Authentication Fixture

```typescript
// apps/web/e2e/fixtures/auth.ts
import { test as base, type Page } from "@playwright/test";

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login with seed credentials
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill(process.env.TEST_PASSWORD ?? "Password123!");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Wait for redirect to dashboard
    await page.waitForURL("/dashboard");

    await use(page);
  },
});

export { expect } from "@playwright/test";
```

### Using the Fixture

```typescript
// apps/web/e2e/dashboard.spec.ts
import { test, expect } from "./fixtures/auth";

test.describe("Dashboard", () => {
  test("displays KPI cards with data", async ({ authenticatedPage: page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // KPI cards are visible
    await expect(page.getByText("Total Trips")).toBeVisible();
    await expect(page.getByText("Revenue")).toBeVisible();
    await expect(page.getByText("Active Drivers")).toBeVisible();
  });

  test("charts render without console errors", async ({ authenticatedPage: page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(2000); // Wait for charts to render

    expect(errors).toHaveLength(0);
  });
});
```

## Selector Strategy

Always use accessible selectors. Never use CSS classes or data-testid as primary selectors.

```typescript
// GOOD: Accessible selectors
page.getByRole("button", { name: "Create Trip" });
page.getByLabel("Email");
page.getByRole("heading", { name: "Dashboard" });
page.getByRole("link", { name: "Trips" });
page.getByText("No trips found");
page.getByRole("row").filter({ hasText: "John Doe" });

// ACCEPTABLE: data-testid for complex components
page.getByTestId("trip-kanban-board");
page.getByTestId("date-range-picker");

// BAD: CSS selectors (brittle, not accessible)
page.locator(".trip-card");
page.locator("#submit-btn");
page.locator("div.flex.items-center > span");
```

## Package Scripts

**apps/web/package.json:**

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed",
    "e2e:debug": "playwright test --debug",
    "e2e:report": "playwright show-report"
  }
}
```

## Running Tests

```bash
# All tests
cd apps/web && pnpm e2e

# Specific file
cd apps/web && npx playwright test e2e/auth.spec.ts

# Specific test by name
cd apps/web && npx playwright test -g "displays KPI cards"

# Single browser
cd apps/web && npx playwright test --project=chromium

# UI mode (interactive, best for development)
cd apps/web && pnpm e2e:ui

# Debug mode (step through with inspector)
cd apps/web && pnpm e2e:debug
```

## .gitignore Additions

```gitignore
# Playwright
playwright-report/
test-results/
blob-report/
```

## CI Pipeline Integration

**GitHub Actions example:**

```yaml
e2e:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: pnpm
    - run: pnpm install
    - run: npx playwright install --with-deps
    - run: cd apps/web && pnpm e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: apps/web/playwright-report/
```

## Common Gotchas

1. **webServer.cwd**: Must be monorepo root. This is the most common setup error. If tests fail to start with module resolution errors, check this first.

2. **Browser installation**: `npx playwright install` downloads browsers. Run this in CI and after Playwright version updates.

3. **Port conflicts**: If port 3000 is in use, `reuseExistingServer: true` lets Playwright use the existing server locally. In CI, always start fresh.

4. **Never use `waitForTimeout`**: Use `waitForURL`, `waitForSelector`, or `expect(...).toBeVisible()` instead. Fixed timeouts make tests flaky.

5. **Test independence**: Each test must be able to run in isolation. Don't rely on test execution order. Use fixtures for shared setup.

6. **`forbidOnly` in CI**: Set `forbidOnly: true` in CI to fail the pipeline if someone accidentally commits a `.only` test.

7. **Edge browser**: The Edge project requires Edge to be installed on the machine. In CI, either install it or skip this project.

8. **Large traces**: Trace files can be 5-50MB each. Use `on-first-retry` instead of `on` to avoid bloating CI artifacts.
