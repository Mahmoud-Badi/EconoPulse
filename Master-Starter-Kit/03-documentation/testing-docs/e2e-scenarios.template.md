# E2E Test Scenarios — {{PROJECT_NAME}}

> **End-to-end tests verify what users actually do.** Each scenario represents a real user workflow tested through the browser with Playwright. Define scenarios before writing tests.

---

## Test Infrastructure

### Framework

| Aspect | Value |
|--------|-------|
| Framework | Playwright |
| Config | `apps/web/playwright.config.ts` |
| Test dir | `apps/web/e2e/` |
| Base URL | `http://localhost:{{PORT}}` |
| Browsers | Chromium (primary), Firefox, WebKit (CI only) |
| Timeout | 30 seconds per test |
| Retries | 2 (CI), 0 (local) |

### Auth Login Helper

```typescript
// apps/web/e2e/helpers/auth.ts
import { type Page } from "@playwright/test";

/**
 * Login as a specific user role.
 * Uses seed data credentials.
 */
export async function loginAs(page: Page, role: "admin" | "{role_2}" | "{role_3}") {
  const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "Password123!";

  const credentials: Record<string, { email: string; password: string }> = {
    admin: {
      email: "admin@{DOMAIN}.com",
      password: TEST_PASSWORD,
    },
    {role_2}: {
      email: "{role_2}@{DOMAIN}.com",
      password: TEST_PASSWORD,
    },
    {role_3}: {
      email: "{role_3}@{DOMAIN}.com",
      password: TEST_PASSWORD,
    },
  };

  const cred = credentials[role]!;
  await page.goto("/login");
  await page.getByLabel("Email").fill(cred.email);
  await page.getByLabel("Password").fill(cred.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
}

/**
 * Login and save auth state for reuse across tests.
 * Use in globalSetup to avoid logging in every test.
 */
export async function setupAuthState(
  page: Page,
  role: string,
  storagePath: string
) {
  await loginAs(page, role as "admin");
  await page.context().storageState({ path: storagePath });
}
```

### Test Setup Pattern

```typescript
// apps/web/e2e/{feature}.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/auth";

test.describe("{Feature Name}", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
  });

  test("{scenario name}", async ({ page }) => {
    // Steps...
  });
});
```

---

## Scenario Inventory

### 1. Auth Flows

#### AUTH-01: Successful Login

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page displayed with email + password fields |
| 2 | Enter valid email | Email field populated |
| 3 | Enter valid password | Password field populated (masked) |
| 4 | Click "Sign in" | Loading spinner on button |
| 5 | Wait for redirect | Redirected to `/dashboard` |
| 6 | Verify dashboard | User name shown in header, sidebar visible |

#### AUTH-02: Failed Login (Wrong Password)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page displayed |
| 2 | Enter valid email, wrong password | Fields populated |
| 3 | Click "Sign in" | Error toast: "Invalid email or password" |
| 4 | Verify state | Still on login page, password field cleared |

#### AUTH-03: Logout

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin | Dashboard visible |
| 2 | Click user menu → "Sign out" | Logging out |
| 3 | Wait for redirect | Redirected to `/login` |
| 4 | Navigate to `/dashboard` | Redirected back to `/login` (auth guard) |

#### AUTH-04: Protected Route Guard

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear all cookies/storage | No session |
| 2 | Navigate to `/dashboard` | Redirected to `/login` |
| 3 | Navigate to `/{entities}` | Redirected to `/login` |

#### AUTH-05: Forgot Password Flow

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login page |
| 2 | Click "Forgot password?" | Navigate to `/forgot-password` |
| 3 | Enter email, submit | Success message: "Check your email" |

---

### 2. CRUD Flows

#### CRUD-{{ENTITY}}-01: Create {Entity}

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}` | List page with existing records |
| 2 | Click "New {Entity}" button | Navigate to `/{entities}/new` |
| 3 | Fill in required fields | Fields accept input, no validation errors |
| 4 | Click "Create {Entity}" | Loading spinner, then success toast |
| 5 | Verify redirect | Back on `/{entities}` list |
| 6 | Verify new record | New {entity} appears in list |

#### CRUD-{{ENTITY}}-02: View {Entity} Detail

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}` | List page visible |
| 2 | Click on first row | Navigate to `/{entities}/{id}` |
| 3 | Verify detail page | All fields displayed: name, status, relations |
| 4 | Verify related data | {Related entities} section shows correct data |

#### CRUD-{{ENTITY}}-03: Edit {Entity}

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}/{id}` | Detail page |
| 2 | Click "Edit" button | Navigate to `/{entities}/{id}/edit` |
| 3 | Change name field | Field updated |
| 4 | Click "Save Changes" | Loading spinner, success toast |
| 5 | Verify redirect | Back on detail page |
| 6 | Verify changes | Updated name displayed |

#### CRUD-{{ENTITY}}-04: Delete {Entity}

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}/{id}` | Detail page |
| 2 | Click "Delete" button | Confirmation dialog appears |
| 3 | Click "Cancel" | Dialog closes, nothing changes |
| 4 | Click "Delete" again, then "Confirm" | Loading, success toast |
| 5 | Verify redirect | Back on list page |
| 6 | Verify removal | Deleted record no longer in list |

#### CRUD-{{ENTITY}}-05: Filter and Search

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}` | Full list displayed |
| 2 | Type in search box | List filters after 300ms debounce |
| 3 | Select status filter | List shows only matching status |
| 4 | Clear all filters | Full list restored |
| 5 | Verify URL params | Filters persisted in URL |

---

### 3. Workflow Flows

#### WORKFLOW-{{ENTITY}}-01: Complete Status Workflow

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create {entity} in `{{STATE_1}}` | Status badge shows "{{STATE_1}}" |
| 2 | Perform action to transition to `{{STATE_2}}` | Status updates, toast confirmation |
| 3 | Perform action to transition to `{{STATE_3}}` | Status updates |
| 4 | Perform action to transition to `{{STATE_4}}` (terminal) | Status shows terminal, no more actions available |

#### WORKFLOW-{{ENTITY}}-02: Cancel/Exception Flow

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Create {entity} in `{{STATE_2}}` | Active entity |
| 2 | Click "Cancel" action | Reason dialog appears |
| 3 | Enter cancellation reason | Text field accepts input |
| 4 | Confirm cancellation | Status changes to `{{STATE_5}}`, reason saved |

---

### 4. Dashboard & Reports

#### DASH-01: Dashboard Loads with Data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login, navigate to `/dashboard` | Dashboard loads |
| 2 | Verify KPI cards | {N} cards with non-zero values |
| 3 | Verify charts | At least one chart renders with data |
| 4 | Verify recent activity | Activity list shows recent items |

#### DASH-02: Dashboard Empty State

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as new user (no data) | Dashboard loads |
| 2 | Verify KPI cards | All show 0 or "No data" |
| 3 | Verify empty state | Helpful message with CTA to create first record |

---

### 5. Edge Cases

#### EDGE-01: Form Validation Errors

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to create form | Empty form |
| 2 | Click submit without filling fields | Validation errors shown on required fields |
| 3 | Fill one field, submit again | Only remaining errors shown |
| 4 | Fill all required fields, submit | Success |

#### EDGE-02: Unauthorized Access

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as `{{ROLE_LOWEST}}` | Dashboard visible |
| 2 | Navigate to admin-only page | 403 or redirect, not a blank page |

#### EDGE-03: Not Found Page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/{entities}/nonexistent-uuid` | 404 page with "Go back" link |
| 2 | Navigate to `/completely-wrong-url` | 404 page |

#### EDGE-04: Mobile Viewport

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set viewport to 375x667 (iPhone) | |
| 2 | Login and navigate to dashboard | Content readable, no horizontal scroll |
| 3 | Navigate to list page | Table or card layout fits viewport |
| 4 | Open create form | Form is usable, fields full-width |

---

## Test Organization

```
apps/web/e2e/
├── helpers/
│   ├── auth.ts           — Login helpers
│   └── utils.ts          — Common test utilities
├── auth.spec.ts          — AUTH-01 through AUTH-05
├── {entity_1}.spec.ts    — CRUD-{ENTITY_1}-01 through 05, WORKFLOW-01/02
├── {entity_2}.spec.ts    — CRUD-{ENTITY_2}-01 through 05
├── {entity_3}.spec.ts    — CRUD-{ENTITY_3}-01 through 05
├── dashboard.spec.ts     — DASH-01, DASH-02
└── edge-cases.spec.ts    — EDGE-01 through EDGE-04
```

---

## Scenario Tracking

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| AUTH-01 | Successful Login | P0 | {{STATUS}} |
| AUTH-02 | Failed Login | P0 | {{STATUS}} |
| AUTH-03 | Logout | P1 | {{STATUS}} |
| AUTH-04 | Protected Route Guard | P0 | {{STATUS}} |
| AUTH-05 | Forgot Password | P2 | {{STATUS}} |
| CRUD-{E}-01 | Create {Entity} | P0 | {{STATUS}} |
| CRUD-{E}-02 | View Detail | P0 | {{STATUS}} |
| CRUD-{E}-03 | Edit | P1 | {{STATUS}} |
| CRUD-{E}-04 | Delete | P1 | {{STATUS}} |
| CRUD-{E}-05 | Filter/Search | P1 | {{STATUS}} |
| WORKFLOW-{E}-01 | Complete Workflow | P0 | {{STATUS}} |
| WORKFLOW-{E}-02 | Cancel/Exception | P1 | {{STATUS}} |
| DASH-01 | Dashboard with Data | P0 | {{STATUS}} |
| DASH-02 | Dashboard Empty | P2 | {{STATUS}} |
| EDGE-01 | Form Validation | P1 | {{STATUS}} |
| EDGE-02 | Unauthorized | P0 | {{STATUS}} |
| EDGE-03 | Not Found | P2 | {{STATUS}} |
| EDGE-04 | Mobile Viewport | P1 | {{STATUS}} |
