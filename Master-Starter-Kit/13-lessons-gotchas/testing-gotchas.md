# Testing Gotchas

Testing tools are simple in concept but full of configuration traps. These gotchas cover Vitest and Playwright specifically.

---

## Vitest

### Per-Package Config, No Root-Level Config

In a monorepo, each package gets its own `vitest.config.ts`. Do not create a root-level config — it causes path resolution issues.

```
packages/api/vitest.config.ts        # Tests for API package
packages/validators/vitest.config.ts  # Tests for validators
packages/db/vitest.config.ts          # Tests for DB utilities
```

```typescript
// packages/api/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,           // Enables describe/it/expect without imports
    environment: "node",     // Use "jsdom" for component tests
    include: ["src/**/*.test.ts"],
  },
});
```

**Symptom:** Tests pass in one package but imports fail in another. Or: running `vitest` from root picks up wrong config.
**Fix:** One config per package. Run tests with `pnpm --filter @{project}/api test`.

---

### globals: true Removes Import Boilerplate

```typescript
// Without globals: true — must import everything
import { describe, it, expect, vi, beforeEach } from "vitest";

// With globals: true — available globally (like Jest)
// No imports needed for describe, it, expect, vi, beforeEach
```

**Gotcha:** When `globals: true` is set, you still need to add Vitest types to your tsconfig:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Without this, TypeScript will show errors for `describe`, `it`, etc. even though they work at runtime.

---

### Environment: node vs jsdom

```typescript
// For API/router/validator tests:
environment: "node"

// For React component tests:
environment: "jsdom"
```

**Gotcha:** jsdom is slower than node. Only use it for tests that need DOM APIs. Split your test configs if one package has both API and component tests.

---

## Playwright

### webServer.cwd Must Point to Monorepo Root

```typescript
// playwright.config.ts (in apps/web/)
export default defineConfig({
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    cwd: "../../",           // Monorepo root (2 levels up from apps/web)
    timeout: 120 * 1000,
  },
});
```

**Symptom:** Playwright cannot start the dev server. Error: "command pnpm dev failed" or "package.json not found."
**Root cause:** `pnpm dev` must run from the monorepo root (where the root package.json and turbo.json live). Playwright defaults to running commands from the config file's directory.
**Fix:** Set `cwd` to the monorepo root relative to the Playwright config file.

---

### reuseExistingServer for Local Development

```typescript
webServer: {
  reuseExistingServer: !process.env.CI,
  // true in local dev: reuses already-running dev server (fast)
  // false in CI: starts a fresh server (clean state)
}
```

**Gotcha:** If `reuseExistingServer: true` and no dev server is running, Playwright will start one. But if a dev server IS running on a different port, Playwright will still try to start a new one and fail with "port already in use."

**Fix:** Either always start the dev server before running tests, or use a port check in the config.

---

### Never Use waitForTimeout (Flaky)

```typescript
// WRONG — arbitrary wait, will be flaky
await page.waitForTimeout(2000);

// CORRECT — wait for specific condition
await page.waitForURL(/dashboard/);
await page.getByText("Dashboard").waitFor();
await expect(page.getByRole("table")).toBeVisible();
await page.waitForLoadState("networkidle");
```

**Why waitForTimeout is always wrong:**
- 2000ms might be enough on your machine but not in CI (slower)
- 2000ms might be too long (wasting time on fast machines)
- If the condition is never met, the test passes anyway (false positive)

**Fix:** Always wait for a specific condition. If you cannot identify the condition, the test is poorly designed.

---

### Accessible Selectors Over CSS Selectors

```typescript
// WRONG — fragile, breaks on CSS refactoring
await page.click(".btn-primary.submit-btn");
await page.locator("div.card > h3").textContent();

// CORRECT — stable, survives refactoring
await page.getByRole("button", { name: "Submit" }).click();
await page.getByRole("heading", { level: 3 }).textContent();
await page.getByLabel("Email").fill("test@example.com");
await page.getByText("Trip created successfully").waitFor();
```

**Selector preference order:**
1. `getByRole` — most stable, tests accessibility too
2. `getByLabel` — for form inputs
3. `getByText` — for visible text content
4. `getByPlaceholder` — for inputs with placeholders
5. `getByTestId` — last resort, requires data-testid attribute

---

### Each Test Must Be Independent

```typescript
// WRONG — test B depends on test A creating data
test("A: create trip", async ({ page }) => {
  await createTrip(page, "Test Trip");
});
test("B: edit trip", async ({ page }) => {
  await page.getByText("Test Trip").click();  // Fails if test A did not run or failed
});

// CORRECT — each test sets up its own data
test("can edit trip", async ({ page }) => {
  await loginAs(page, "admin");
  // Navigate to a known trip (from seed data)
  await page.goto("/trips");
  await page.getByRole("row").nth(1).click();
  await page.getByRole("button", { name: "Edit" }).click();
  // ... perform edit
});
```

**Why independence matters:** Tests run in parallel (or in random order in CI). A test that depends on another test's side effects will fail intermittently — the worst kind of flaky test.

---

### Screenshot on Failure Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: "only-on-failure",    // Captures screenshot when test fails
    trace: "on-first-retry",          // Captures trace on retry for debugging
    video: "retain-on-failure",       // Records video, keeps only for failures
  },
});
```

**Where screenshots are saved:** `test-results/` directory, organized by test name.

---

## Coverage

### @vitest/coverage-v8 for Istanbul-Compatible Reports

```bash
pnpm add -D @vitest/coverage-v8
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "src/**/index.ts"],
    },
  },
});
```

**Run coverage:**
```bash
pnpm test -- --coverage
```

---

### Coverage Targets

| Metric | Target | Warning |
|--------|--------|---------|
| Statements | > 80% | Below = tech debt accumulating |
| Functions | > 88% | Below = untested logic paths |
| Branches | > 75% | Below = untested edge cases |
| Lines | > 80% | Below = dead code or missing tests |

**Rule:** Coverage must never decrease. If a PR drops coverage, it needs more tests before merging.

**Gotcha:** High coverage does not mean good tests. You can have 100% coverage with tests that assert nothing. Coverage measures which code runs, not whether the assertions are meaningful.

---

## General Testing Tips

### Test File Naming Convention

```
src/
  routers/
    trips.ts                    # Source file
    __tests__/
      trips.test.ts             # Test file (Vitest)
e2e/
  trips.spec.ts                 # E2E test file (Playwright)
```

**Vitest:** `*.test.ts` or `*.test.tsx`
**Playwright:** `*.spec.ts`

### Mock Only at Boundaries

```typescript
// WRONG — mocking internal implementation details
vi.mock("./calculate-fare", () => ({
  calculateFare: vi.fn().mockReturnValue(1500),
}));

// CORRECT — mocking external boundary (database)
vi.mock("@{project}/db", () => ({
  db: { query: { trips: { findMany: vi.fn() } } },
}));
```

**Why:** Mocking internal functions makes tests brittle — they break when you refactor, even if the behavior is unchanged. Mock at the boundary (database, external API, file system) and let everything inside run for real.
