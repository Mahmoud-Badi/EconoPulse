# E2E Test Templates

End-to-end test patterns for the most common page types. These tests run in a real browser via Playwright and verify the full stack — UI, API, database.

---

## Login Helper (Used by All Tests)

```typescript
// e2e/helpers/auth.ts
import { type Page } from "@playwright/test";

const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "Password123!";

export async function loginAs(
  page: Page,
  role: "admin" | "dispatcher" | "driver" | "billing"
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(`${role}@test.com`);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(/dashboard/);
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: /user menu/i }).click();
  await page.getByRole("menuitem", { name: /sign out/i }).click();
  await page.waitForURL(/login/);
}
```

---

## Authentication E2E

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Authentication", () => {
  test("can login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@test.com");
    await page.getByLabel("Password").fill(process.env.TEST_PASSWORD ?? "Password123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(/dashboard/);
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@test.com");
    await page.getByLabel("Password").fill("WrongPassword!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/login/);
    await expect(page).toHaveURL(/login/);
  });

  test("redirects to dashboard after login", async ({ page }) => {
    await loginAs(page, "admin");
    await expect(page).toHaveURL(/dashboard/);
  });

  test("can register new account", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Name").fill("New User");
    await page.getByLabel("Email").fill(`newuser-${Date.now()}@test.com`);
    await page.getByLabel("Password").fill(process.env.TEST_PASSWORD ?? "Password123!");
    await page.getByLabel("Confirm Password").fill(process.env.TEST_PASSWORD ?? "Password123!");
    await page.getByRole("button", { name: /sign up/i }).click();

    await page.waitForURL(/dashboard/);
  });

  test("shows validation errors for empty registration form", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test("can logout", async ({ page }) => {
    await loginAs(page, "admin");
    await page.getByRole("button", { name: /user menu/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    await page.waitForURL(/login/);
    await expect(page).toHaveURL(/login/);
  });
});
```

---

## List Page E2E (Data Table)

```typescript
// e2e/entity-list.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Entity List Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("renders table with data", async ({ page }) => {
    await page.goto("/entities");

    // Verify page title
    await expect(page.getByRole("heading", { name: /entities/i })).toBeVisible();

    // Verify table renders with column headers
    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /created/i })).toBeVisible();

    // Verify at least one row of data
    const rows = page.getByRole("row");
    await expect(rows).toHaveCount(/* header + data rows */);
  });

  test("can filter by status", async ({ page }) => {
    await page.goto("/entities");

    await page.getByRole("combobox", { name: /status/i }).click();
    await page.getByRole("option", { name: /active/i }).click();

    // Verify filtered results
    const statusCells = page.getByRole("cell").filter({ hasText: /active/i });
    const count = await statusCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test("can search by name", async ({ page }) => {
    await page.goto("/entities");

    await page.getByPlaceholder(/search/i).fill("Test Entity");
    // Wait for debounced search
    await page.waitForTimeout(500);

    await expect(page.getByText("Test Entity")).toBeVisible();
  });

  test("clicking row navigates to detail page", async ({ page }) => {
    await page.goto("/entities");

    // Click the first data row
    await page.getByRole("row").nth(1).click();

    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/entities\/.+/);
  });

  test("pagination works", async ({ page }) => {
    await page.goto("/entities");

    // Click next page
    const nextButton = page.getByRole("button", { name: /next/i });
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      // Verify page changed (URL params or content changed)
      await expect(page).toHaveURL(/page=2/);
    }
  });

  test("shows empty state when no results", async ({ page }) => {
    await page.goto("/entities");

    // Search for something that does not exist
    await page.getByPlaceholder(/search/i).fill("zzznonexistent999");
    await page.waitForTimeout(500);

    await expect(page.getByText(/no entities found/i)).toBeVisible();
  });
});
```

---

## Form Page E2E (Create/Edit)

```typescript
// e2e/entity-form.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Create Entity Form", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("can create entity with valid data", async ({ page }) => {
    await page.goto("/entities/new");

    // Fill all required fields
    await page.getByLabel("Name").fill("E2E Test Entity");
    await page.getByLabel("Email").fill("e2e@test.com");
    await page.getByLabel("Phone").fill("555-0100");
    await page.getByRole("combobox", { name: /status/i }).click();
    await page.getByRole("option", { name: /active/i }).click();

    // Submit form
    await page.getByRole("button", { name: /create/i }).click();

    // Verify success
    await expect(page.getByText(/created successfully/i)).toBeVisible();

    // Verify redirect to detail or list page
    await expect(page).toHaveURL(/\/entities\/.+/);
  });

  test("shows validation errors for empty required fields", async ({ page }) => {
    await page.goto("/entities/new");

    // Submit without filling anything
    await page.getByRole("button", { name: /create/i }).click();

    // Verify validation errors appear
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/entities/new");

    await page.getByLabel("Name").fill("Test");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("cancel button navigates back without saving", async ({ page }) => {
    await page.goto("/entities/new");

    await page.getByLabel("Name").fill("Should Not Save");
    await page.getByRole("button", { name: /cancel/i }).click();

    await expect(page).toHaveURL(/\/entities$/);
  });

  test("preserves form data on validation error", async ({ page }) => {
    await page.goto("/entities/new");

    await page.getByLabel("Name").fill("Test Entity");
    // Leave email empty to trigger validation error
    await page.getByRole("button", { name: /create/i }).click();

    // Name should still be filled
    await expect(page.getByLabel("Name")).toHaveValue("Test Entity");
  });
});

test.describe("Edit Entity Form", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("loads existing data into form", async ({ page }) => {
    await page.goto("/entities");
    await page.getByRole("row").nth(1).click();
    await page.getByRole("button", { name: /edit/i }).click();

    // Verify fields are pre-filled
    await expect(page.getByLabel("Name")).not.toHaveValue("");
  });

  test("can update entity", async ({ page }) => {
    await page.goto("/entities");
    await page.getByRole("row").nth(1).click();
    await page.getByRole("button", { name: /edit/i }).click();

    await page.getByLabel("Name").clear();
    await page.getByLabel("Name").fill("Updated Entity Name");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page.getByText(/updated successfully/i)).toBeVisible();
  });
});
```

---

## Detail Page E2E

```typescript
// e2e/entity-detail.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Entity Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
    // Navigate to a known entity
    await page.goto("/entities");
    await page.getByRole("row").nth(1).click();
  });

  test("displays all entity sections", async ({ page }) => {
    // Verify main sections render
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/status/i).first()).toBeVisible();
    await expect(page.getByText(/created/i).first()).toBeVisible();
  });

  test("tabs switch content correctly", async ({ page }) => {
    // Click a tab
    await page.getByRole("tab", { name: /history/i }).click();

    // Verify tab content changed
    await expect(page.getByText(/timeline/i)).toBeVisible();
  });

  test("action buttons are functional", async ({ page }) => {
    // Edit button
    await expect(page.getByRole("button", { name: /edit/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /edit/i })).toBeEnabled();

    // Delete button (should open confirmation dialog)
    await page.getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText(/are you sure/i)).toBeVisible();

    // Cancel deletion
    await page.getByRole("button", { name: /cancel/i }).click();
  });

  test("breadcrumbs navigate correctly", async ({ page }) => {
    const breadcrumb = page.getByRole("navigation", { name: /breadcrumb/i });
    await expect(breadcrumb).toBeVisible();

    // Click parent breadcrumb to go back to list
    await breadcrumb.getByRole("link", { name: /entities/i }).click();
    await expect(page).toHaveURL(/\/entities$/);
  });

  test("no console errors on page", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Reload to capture any errors
    await page.reload();
    await page.waitForLoadState("networkidle");

    expect(consoleErrors).toEqual([]);
  });
});
```

---

## Responsive Layout E2E

```typescript
// e2e/responsive.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("Responsive Layout", () => {
  test("desktop layout shows sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await loginAs(page, "admin");

    await expect(page.getByRole("navigation", { name: /sidebar/i })).toBeVisible();
  });

  test("mobile layout hides sidebar and shows hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "admin");

    // Sidebar should be hidden on mobile
    await expect(page.getByRole("navigation", { name: /sidebar/i })).not.toBeVisible();

    // Hamburger menu should be visible
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  });

  test("mobile hamburger opens navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "admin");

    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page.getByRole("navigation", { name: /sidebar/i })).toBeVisible();
  });

  test("table scrolls horizontally on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page, "admin");
    await page.goto("/entities");

    // Table should be visible (scrollable container)
    await expect(page.getByRole("table")).toBeVisible();
    // No content overflow beyond viewport
    const tableWidth = await page.getByRole("table").evaluate((el) => el.scrollWidth);
    expect(tableWidth).toBeGreaterThan(375); // Table is wider than viewport (scrollable)
  });
});
```

---

## Playwright Configuration Template

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 14"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    cwd: "../../", // Monorepo root (adjust based on your structure)
    timeout: 120 * 1000,
  },
});
```

---

## Tips for Reliable E2E Tests

1. **Never use `waitForTimeout`.** It is inherently flaky. Use `waitForURL`, `waitForSelector`, `expect().toBeVisible()` instead.
2. **Use accessible selectors.** `getByRole`, `getByLabel`, `getByText` are more stable than CSS selectors because they survive refactors.
3. **Each test must be independent.** No shared state. If test B depends on test A creating data, test B will fail when run alone.
4. **Use `test.beforeEach` for login.** Every test should start authenticated (unless testing auth itself).
5. **Check console errors.** Add a console listener to catch errors that do not cause visual failures.
6. **Screenshot on failure.** Configure Playwright to capture screenshots on test failure for debugging.
7. **Test with seed data.** Never test against an empty database — use the same seed data as development.
