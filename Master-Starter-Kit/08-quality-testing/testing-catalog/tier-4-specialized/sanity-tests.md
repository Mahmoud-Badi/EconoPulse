# Sanity Tests

## What It Is

Sanity tests are a narrow, targeted verification run after a hotfix or minor change to confirm two things: the fix actually works, and it didn't break anything in the immediately surrounding area. Unlike smoke tests (which check "is the whole app alive?") or full regression suites (which check everything), sanity tests focus specifically on the changed area plus its direct dependencies. They answer: "Did the fix work, and did we accidentally break something obvious nearby?" A sanity test should run in under 1 minute and give a developer immediate confidence that their targeted change is safe to ship.

---

## What It Catches

- **Fix didn't actually fix the bug** — The hotfix addressed a symptom but not the root cause, and the bug still reproduces under slightly different conditions
- **Fix broke adjacent functionality** — Fixing the "add to cart" button broke the "update quantity" button because they shared a state handler that was refactored
- **Regression in the same module** — Changing the date formatter for one locale broke formatting for three other locales that use the same function
- **Side effects from dependency changes** — Updating a validation library to fix one field's validation silently changed the validation behavior for other fields
- **CSS change cascading to siblings** — Fixing the padding on the checkout button shifted the layout of the adjacent price display
- **Database query changes affecting related queries** — Optimizing one query's WHERE clause accidentally changed the results of a view that depends on the same table
- **State management side effects** — Fixing a Redux action for the profile page caused the notification badge to stop updating because it listened to the same action type
- **API response shape changes** — Adding a field to one API response broke a frontend component that used strict destructuring

---

## When It's Required

| Scenario | Run Sanity Tests? | Why |
|----------|------------------|-----|
| Hotfix for a production bug | **Yes** | You're rushing — this is when mistakes happen |
| Single-file CSS fix | **Yes** | CSS changes cascade unpredictably |
| Copy/text change | **Yes** (lightweight) | Verify the change renders, check for truncation or overflow |
| Dependency version bump | **Yes** | Even minor versions can change behavior |
| Config/environment change | **Yes** | Run smoke tests too, but sanity-test the specific config area |
| Feature branch before merge | **No** — use full regression | Sanity tests are too narrow for feature-level changes |
| Refactoring multiple files | **No** — use full regression | Too many blast radius areas for a sanity check |

### Sanity vs Smoke vs Full Regression

| Aspect | Sanity | Smoke | Full Regression |
|--------|--------|-------|-----------------|
| **Scope** | Changed area + direct neighbors | Entire app critical paths | Every known user flow |
| **Trigger** | After a hotfix or small change | After every deployment | Before merge / scheduled |
| **Duration** | < 1 minute | < 2 minutes | 10-30 minutes |
| **Question answered** | "Did the fix work?" | "Is the app alive?" | "Did anything break?" |
| **Failure action** | Fix the fix | Roll back deployment | Block the PR |

---

## Setup Guide

### Approach: Tagged Test Subsets

Sanity tests aren't a separate framework — they're a way of running a focused subset of your existing tests. The key is tagging tests by feature area so you can run just the relevant ones.

### With Playwright

```bash
# Tag-based test selection is built into Playwright
# Use @tag annotations in test titles or test.describe blocks
npx playwright test --grep @cart
npx playwright test --grep @auth
npx playwright test --grep @payments
```

### With Jest

```bash
# Use --testPathPattern to target specific test files
npx jest --testPathPattern="cart|checkout"

# Or use test.only / describe.only during development
# (never commit .only — use eslint-plugin-jest to catch it)
```

### Project Structure

```
tests/
  e2e/
    cart.spec.ts           # Tag: @cart
    checkout.spec.ts       # Tag: @cart @payments
    auth.spec.ts           # Tag: @auth
    profile.spec.ts        # Tag: @auth @profile
    dashboard.spec.ts      # Tag: @dashboard
    search.spec.ts         # Tag: @search
  sanity/
    sanity-map.json        # Maps file paths to test tags
    run-sanity.sh          # Script that determines which tests to run
```

### Alternatives

| Approach | Best For | Notes |
|----------|----------|-------|
| **Playwright --grep** | Tagged E2E test subsets | Built-in, zero setup |
| **Jest --testPathPattern** | Unit/integration test subsets | Pattern matching on file paths |
| **Custom sanity runner script** | Automated tag selection based on git diff | Maps changed files to test areas |
| **CI label-based** | Manual sanity scope selection | PR labels trigger specific test subsets |

---

## Template

### Tagged E2E Tests

```ts
// tests/e2e/cart.spec.ts
import { test, expect } from '@playwright/test';

// Tagging: all tests in this file belong to @cart
test.describe('@cart Cart Functionality', () => {

  test('@cart add item to cart', async ({ page }) => {
    await page.goto('/products/1');
    await page.click('[data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('@cart update item quantity', async ({ page }) => {
    await page.goto('/cart');
    await page.fill('[data-testid="quantity-input-1"]', '3');
    await page.click('[data-testid="update-quantity-1"]');
    await expect(page.locator('[data-testid="item-total-1"]')).toContainText('$');
  });

  test('@cart remove item from cart', async ({ page }) => {
    await page.goto('/cart');
    const initialCount = await page.locator('[data-testid="cart-item"]').count();
    await page.click('[data-testid="remove-item-1"]');
    const newCount = await page.locator('[data-testid="cart-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('@cart @payments proceed to checkout', async ({ page }) => {
    await page.goto('/cart');
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
  });
});
```

### Sanity Test Runner (Maps Git Changes to Tests)

```bash
#!/bin/bash
# tests/sanity/run-sanity.sh
# Automatically determines which sanity tests to run based on changed files

set -e

# Get files changed since the branch point (or last commit for hotfixes)
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only main...HEAD)

echo "Changed files:"
echo "$CHANGED_FILES"
echo "────────────────────"

# Map changed file paths to test tags
TAGS=""

if echo "$CHANGED_FILES" | grep -q "cart\|shopping\|basket"; then
  TAGS="$TAGS|@cart"
fi

if echo "$CHANGED_FILES" | grep -q "auth\|login\|signup\|session"; then
  TAGS="$TAGS|@auth"
fi

if echo "$CHANGED_FILES" | grep -q "payment\|checkout\|billing\|stripe"; then
  TAGS="$TAGS|@payments"
fi

if echo "$CHANGED_FILES" | grep -q "profile\|account\|settings"; then
  TAGS="$TAGS|@profile"
fi

if echo "$CHANGED_FILES" | grep -q "dashboard\|analytics\|widget"; then
  TAGS="$TAGS|@dashboard"
fi

if echo "$CHANGED_FILES" | grep -q "search\|filter\|sort"; then
  TAGS="$TAGS|@search"
fi

# Remove leading pipe
TAGS="${TAGS#|}"

if [ -z "$TAGS" ]; then
  echo "No sanity test tags matched. Running smoke tests as fallback."
  npx playwright test --config=tests/smoke/smoke.config.ts
else
  echo "Running sanity tests for: $TAGS"
  npx playwright test --grep "$TAGS" --timeout 60000
fi
```

### Sanity Test Map (JSON Configuration)

```json
{
  "mappings": [
    {
      "paths": ["src/features/cart/**", "src/components/Cart*", "src/api/cart*"],
      "tags": ["@cart"],
      "description": "Cart add/remove/update, cart display, cart API"
    },
    {
      "paths": ["src/features/auth/**", "src/middleware/auth*", "src/api/auth*"],
      "tags": ["@auth"],
      "description": "Login, signup, session management, token validation"
    },
    {
      "paths": ["src/features/payments/**", "src/features/checkout/**", "src/api/payments*"],
      "tags": ["@payments", "@cart"],
      "description": "Payment processing, checkout flow (also re-test cart)"
    },
    {
      "paths": ["src/styles/**", "src/components/ui/**"],
      "tags": ["@visual"],
      "description": "Shared UI components — run visual regression on affected pages"
    },
    {
      "paths": ["src/lib/validators*", "src/utils/format*"],
      "tags": ["@cart", "@auth", "@payments", "@profile"],
      "description": "Shared utilities — run broad sanity (these affect everything)"
    }
  ]
}
```

### Unit-Level Sanity Test Pattern

```ts
// When a developer runs sanity tests locally after a fix

// tests/unit/cart/cart-utils.test.ts
describe('@cart Cart Utilities', () => {

  // THE FIX: verify it works
  test('calculates discount correctly for percentage-based coupons', () => {
    const result = calculateDiscount({
      subtotal: 100,
      coupon: { type: 'percentage', value: 20 },
    });
    expect(result.discount).toBe(20);
    expect(result.total).toBe(80);
  });

  // NEIGHBORS: verify nothing nearby broke
  test('calculates discount correctly for fixed-amount coupons', () => {
    const result = calculateDiscount({
      subtotal: 100,
      coupon: { type: 'fixed', value: 15 },
    });
    expect(result.discount).toBe(15);
    expect(result.total).toBe(85);
  });

  test('handles zero subtotal', () => {
    const result = calculateDiscount({
      subtotal: 0,
      coupon: { type: 'percentage', value: 20 },
    });
    expect(result.discount).toBe(0);
    expect(result.total).toBe(0);
  });

  test('discount does not exceed subtotal', () => {
    const result = calculateDiscount({
      subtotal: 10,
      coupon: { type: 'fixed', value: 25 },
    });
    expect(result.discount).toBe(10); // Capped at subtotal
    expect(result.total).toBe(0);
  });
});
```

### package.json Scripts

```json
{
  "scripts": {
    "test:sanity": "bash tests/sanity/run-sanity.sh",
    "test:sanity:cart": "playwright test --grep @cart --timeout 60000",
    "test:sanity:auth": "playwright test --grep @auth --timeout 60000",
    "test:sanity:payments": "playwright test --grep '@payments|@cart' --timeout 60000",
    "test:sanity:quick": "jest --testPathPattern='__tests__' --changedSince=HEAD~1"
  }
}
```

---

## Common Pitfalls

### 1. Sanity tests that are actually full regression tests
**Problem:** "Sanity test for the cart fix" runs 85 tests across the entire checkout flow. It takes 12 minutes.
**Fix:** Sanity tests should run 5-15 tests maximum, targeting the changed area and its immediate neighbors. If you need more than that, you're doing regression testing — which is fine, but call it what it is and don't expect it to finish in 1 minute.

### 2. Not testing the neighbors
**Problem:** You fix the bug, run the exact test case for that bug, it passes, you ship. Two hours later, the adjacent feature is broken.
**Fix:** The "sanity" part means also testing the area around the fix. If you fixed the cart total calculation, also test coupon application, tax calculation, and quantity updates — they likely share code or state.

### 3. Skipping sanity tests because "it's a small change"
**Problem:** "I just changed one line of CSS, no need to test." That one line removed the `overflow: hidden` that was preventing a layout-breaking scrollbar on the checkout page.
**Fix:** The smaller the change, the more tempting it is to skip testing. Fight this. Small, rushed changes are where regressions hide. Run the sanity tests — they take under 1 minute.

### 4. Manual sanity testing
**Problem:** Developer manually clicks through the affected area, says "looks good," and ships. They didn't check the mobile viewport, the error state, or the empty state.
**Fix:** Automate sanity tests so they run the same checks every time. Manual testing is for exploratory discovery. Sanity testing is for repeatable verification.

### 5. Stale sanity test mappings
**Problem:** You added a new feature module 3 months ago but never updated the sanity test map. Changes to that module don't trigger any sanity tests.
**Fix:** Review the sanity-map.json whenever you add a new feature area. Include it as a step in your "new feature checklist."

---

## Proof Artifact

A sanity test pass produces these artifacts:

### Terminal output
```
Changed files:
  src/features/cart/utils/calculate-discount.ts
  src/features/cart/utils/calculate-discount.test.ts
────────────────────
Running sanity tests for: @cart

Running 4 tests using 1 worker
  ✓ Cart Functionality › add item to cart (0.9s)
  ✓ Cart Functionality › update item quantity (1.1s)
  ✓ Cart Functionality › remove item from cart (0.8s)
  ✓ Cart Functionality › proceed to checkout (1.3s)

  4 passed (4.1s)
```

### What constitutes a pass:
1. **Targeted tests pass** — all tests in the affected area(s) pass
2. **Duration under 1 minute** (E2E portion; unit tests should be seconds)
3. **The specific fix is verified** — the exact bug scenario is covered by at least one test
4. **Adjacent functionality verified** — neighboring features in the same module also pass
5. **No new console errors** visible in test output
