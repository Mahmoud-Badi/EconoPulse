# /scaffold-e2e $ARGUMENT

Generate a Playwright E2E test spec from the documented test scenarios.

## Steps

1. **Read the E2E scenario spec**:
   ```
   {DOCS_PATH}/testing/E2E-SCENARIOS.md
   ```
   Find the section for `$ARGUMENT`. Extract:
   - Test scenarios (happy path, edge cases, error cases)
   - Required preconditions (login, seed data)
   - User actions (click, fill, navigate)
   - Expected outcomes (visible text, URL change, toast message)

2. **Read the auth fixture** to understand login patterns:
   ```
   apps/web/e2e/fixtures/auth.ts
   ```

3. **Read existing E2E tests** for conventions:
   ```bash
   ls apps/web/e2e/
   ```
   Read one existing test file for reference.

4. **Generate the E2E test** at `apps/web/e2e/$ARGUMENT.spec.ts`:

   ```typescript
   import { test, expect } from "./fixtures/auth";

   test.describe("$ARGUMENT", () => {
     // ─── Happy Path ──────────────────────────────────────────────
     test.describe("core flows", () => {
       test("navigates to {feature} list page", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}");
         await expect(
           page.getByRole("heading", { name: "{Feature}" }),
         ).toBeVisible();
       });

       test("displays {feature} data from seed", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}");

         // Wait for data to load (skeleton disappears)
         await expect(page.getByRole("table")).toBeVisible();

         // Verify seed data is present
         const rows = page.getByRole("row");
         // Header row + at least one data row
         await expect(rows).toHaveCount({ minimum: 2 });
       });

       test("creates a new {entity}", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}/new");

         // Fill form fields
         await page.getByLabel("{Field 1}").fill("{test value 1}");
         await page.getByLabel("{Field 2}").fill("{test value 2}");
         // Select enum value
         await page.getByLabel("{Status}").click();
         await page.getByRole("option", { name: "{Active}" }).click();

         // Submit
         await page.getByRole("button", { name: "Create {Entity}" }).click();

         // Verify success
         await expect(page.getByText("{Entity} created successfully")).toBeVisible();

         // Verify redirect to list or detail
         await expect(page).toHaveURL(/{feature}/);
       });

       test("views {entity} detail page", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}");

         // Click first row to navigate to detail
         await page.getByRole("row").nth(1).click();

         // Verify detail page loaded
         await expect(
           page.getByRole("heading", { name: "{Entity} Details" }),
         ).toBeVisible();
       });

       test("edits an existing {entity}", async ({ authenticatedPage: page }) => {
         // Navigate to first entity's edit page
         await page.goto("/{feature}");
         await page.getByRole("row").nth(1).click();
         await page.getByRole("link", { name: "Edit" }).click();

         // Modify a field
         const nameField = page.getByLabel("{Field 1}");
         await nameField.clear();
         await nameField.fill("{updated value}");

         // Submit
         await page.getByRole("button", { name: "Save Changes" }).click();

         // Verify success
         await expect(page.getByText("{Entity} updated successfully")).toBeVisible();
       });
     });

     // ─── Empty State ─────────────────────────────────────────────
     test.describe("empty state", () => {
       test("shows empty state when no data exists", async ({ authenticatedPage: page }) => {
         // This test may need a filter that returns no results
         await page.goto("/{feature}?status=nonexistent");

         await expect(page.getByText(/no {feature} found/i)).toBeVisible();
         await expect(
           page.getByRole("link", { name: /create/i }),
         ).toBeVisible();
       });
     });

     // ─── Error Handling ──────────────────────────────────────────
     test.describe("error handling", () => {
       test("shows validation errors on invalid form submission", async ({
         authenticatedPage: page,
       }) => {
         await page.goto("/{feature}/new");

         // Submit empty form
         await page.getByRole("button", { name: "Create {Entity}" }).click();

         // Verify validation messages
         await expect(page.getByText(/required/i).first()).toBeVisible();
       });

       test("handles 404 for non-existent {entity}", async ({
         authenticatedPage: page,
       }) => {
         await page.goto("/{feature}/00000000-0000-0000-0000-000000000000");

         await expect(page.getByText(/not found/i)).toBeVisible();
       });
     });

     // ─── Filtering & Search ──────────────────────────────────────
     test.describe("filtering", () => {
       test("filters by status", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}");

         // Open status filter
         await page.getByRole("combobox", { name: /status/i }).click();
         await page.getByRole("option", { name: "{Active}" }).click();

         // Verify filtered results
         const rows = page.getByRole("row");
         // All visible rows should have "Active" status
         // (implementation depends on your table structure)
       });

       test("searches by name", async ({ authenticatedPage: page }) => {
         await page.goto("/{feature}");

         await page.getByPlaceholder(/search/i).fill("{search term from seed data}");

         // Wait for debounced search
         await page.waitForResponse((resp) =>
           resp.url().includes("{feature}") && resp.status() === 200,
         );

         // Verify filtered results contain search term
         await expect(page.getByText("{search term from seed data}")).toBeVisible();
       });
     });

     // ─── Responsive ─────────────────────────────────────────────
     test.describe("responsive", () => {
       test("renders correctly on mobile", async ({ authenticatedPage: page }) => {
         await page.setViewportSize({ width: 375, height: 812 });
         await page.goto("/{feature}");

         // Verify no horizontal scrollbar
         const scrollWidth = await page.evaluate(
           () => document.documentElement.scrollWidth,
         );
         const clientWidth = await page.evaluate(
           () => document.documentElement.clientWidth,
         );
         expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

         // Verify key content is visible
         await expect(
           page.getByRole("heading", { name: "{Feature}" }),
         ).toBeVisible();
       });
     });
   });
   ```

5. **Run typecheck**:
   ```bash
   cd apps/web && npx tsc --noEmit 2>&1 | tail -10
   ```

6. **Output report**:
   ```
   E2E TEST GENERATED
   ====================
   Feature: $ARGUMENT
   File: apps/web/e2e/$ARGUMENT.spec.ts
   Test Scenarios:
   - Core flows: {count} tests
   - Empty state: {count} tests
   - Error handling: {count} tests
   - Filtering: {count} tests
   - Responsive: {count} tests
   Total: {total} test cases
   ```

## Rules

- **Never use `waitForTimeout`**: Use `waitForURL`, `waitForResponse`, `waitForSelector`, or `expect().toBeVisible()` instead. Fixed timeouts make tests flaky.
- **Always use accessible selectors**: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`. Never CSS class selectors as primary method.
- **Each test must be independent**: Don't rely on test execution order. Each test logs in fresh via the auth fixture.
- **Screenshot on failure**: This is configured in `playwright.config.ts`, not per-test. Tests don't need explicit screenshot logic.
- **Use seed data for assertions**: Reference known values from SEED-DATA.md for predictable test assertions.
- **No test data creation in tests**: Tests should use existing seed data, not create their own via the UI (this makes tests slow and fragile).
