# Regression Tests

## What It Is

Regression tests are a curated collection of tests that each represent a specific, previously-discovered bug. Every bug that made it past your existing test suite into staging or production gets a regression test — a test that would have caught it if it had existed. Over time, this suite becomes a living history of your application's failure modes and a firewall against repeat offenders. Unlike unit or integration test suites that are organized by feature, the regression suite is organized by incident: each test file or test block is tagged with the bug ID, the date it was discovered, and a plain-language description of what went wrong. When someone asks "Could this happen again?", the regression suite is the answer.

## What It Catches

- **The exact same bug re-occurring** — A date parsing bug was fixed by switching from `new Date(string)` to `parseISO(string)`, but three months later someone reverts to the old pattern in a different module. The regression test catches it immediately.
- **Bugs in adjacent code paths** — A fix for "user cannot log in with email containing a plus sign" gets a regression test. Later, someone refactors the email normalization function and breaks plus-sign handling again — the regression test fails.
- **Interaction bugs that appear after refactoring** — A race condition between payment processing and inventory deduction was fixed with a transaction. A later refactor moves the code to a new service but forgets the transaction. The regression test (which submits a payment and verifies inventory updates atomically) catches this.
- **Data-specific edge cases** — A bug where a username containing Unicode characters (emoji, CJK, diacritics) caused a JSON serialization failure. The regression test includes these exact inputs.
- **Environment-specific failures** — A bug that only appeared when the timezone offset was negative (Americas). The regression test sets the timezone and reproduces the exact conditions.
- **Third-party library upgrade breakage** — Upgrading `date-fns` from v2 to v3 changed the `format` function signature. The regression test for the original date bug also covers the formatting, catching the upgrade breakage.

## When It's Required

A regression test is required for **every bug that meets any of these criteria:**

| Criteria | Why It Needs a Regression Test |
|----------|-------------------------------|
| Bug reached production | It bypassed all existing tests — there is clearly a gap in coverage |
| Bug affected user-facing functionality | Real users experienced the failure; repeat occurrence is unacceptable |
| Bug was caused by an interaction between modules | These bugs are inherently hard to catch with unit tests and easy to reintroduce |
| Bug took more than 1 hour to diagnose | If it was hard to find, it will be hard to notice if it comes back |
| Bug was introduced by a refactor | This proves the existing test suite did not adequately cover the behavior |
| Bug is in a business-critical path | Payment, authentication, data integrity — these paths need maximum protection |

**You can skip a regression test for:** Cosmetic-only bugs (typos in copy, minor spacing issues) that have no functional impact and are covered by visual regression tests.

The regression test is written **as part of the bug fix PR** — the fix is not complete until the regression test exists and passes.

## Setup Guide

### File organization

Regression tests live alongside the module they protect, tagged for easy identification:

```
src/
  features/
    auth/
      login.ts
      login.test.ts              # Unit tests
      login.integration.test.ts   # Integration tests
      login.regression.test.ts    # Regression tests for auth bugs
    payments/
      checkout.ts
      checkout.regression.test.ts # Regression tests for payment bugs
```

Alternatively, for a centralized regression suite:

```
test/
  regression/
    BUG-001-unicode-username.test.ts
    BUG-002-timezone-offset.test.ts
    BUG-003-concurrent-payment.test.ts
```

### Tagging strategy

Use Vitest's `describe` blocks and test file names to tag regression tests for filtering:

```ts
// Naming convention: BUG-{ID}-{short-description}.regression.test.ts
// Or within the test:
describe('[BUG-042] Double-charge on retry after timeout', () => { ... });
```

### Running specific test subsets

```json
{
  "scripts": {
    "test:regression": "vitest run --reporter=verbose \"**/*.regression.test.{ts,tsx}\"",
    "test:regression:payments": "vitest run \"**/payments/**/*.regression.test.ts\"",
    "test:smoke": "vitest run --reporter=verbose \"**/*.smoke.test.{ts,tsx}\""
  }
}
```

### Tag-based filtering with Vitest

Vitest does not have built-in tags, but you can use file naming conventions and include/exclude patterns:

```ts
// vitest.regression.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.regression.test.{ts,tsx}'],
    testTimeout: 15000,  // Regression tests may test complex scenarios
  },
});
```

### CI configuration

Regression tests run on every PR and on every merge to main:

```yaml
# .github/workflows/regression.yml
name: Regression Tests
on:
  pull_request:
  push:
    branches: [main]

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:regression
```

## Template

### Standard regression test structure

```ts
// src/features/auth/login.regression.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { authenticateUser } from './login';
import { createTestUser, cleanupTestData } from '../../../test/helpers';

/**
 * REGRESSION SUITE: Authentication
 *
 * Each test block corresponds to a specific bug that was found and fixed.
 * Do not remove these tests even if the code looks "obviously correct" —
 * they exist because it broke before and could break again.
 */

describe('[BUG-017] Email with plus sign rejected during login', () => {
  // Discovered: 2024-03-15
  // Impact: Users with Gmail plus-addressing could not log in
  // Root cause: Email validation regex did not allow "+" in local part
  // Fix PR: #234

  beforeEach(async () => {
    await cleanupTestData();
  });

  it('accepts email with plus sign', async () => {
    const user = await createTestUser({
      email: 'user+tag@gmail.com',
      password: 'SecurePass123!',
    });

    const result = await authenticateUser('user+tag@gmail.com', 'SecurePass123!');

    expect(result.success).toBe(true);
    expect(result.user.id).toBe(user.id);
  });

  it('accepts email with multiple plus signs', async () => {
    const user = await createTestUser({
      email: 'user+a+b@gmail.com',
      password: 'SecurePass123!',
    });

    const result = await authenticateUser('user+a+b@gmail.com', 'SecurePass123!');
    expect(result.success).toBe(true);
  });
});

describe('[BUG-023] Case-sensitive email comparison causing duplicate accounts', () => {
  // Discovered: 2024-04-02
  // Impact: Users could create two accounts with "User@Example.com" and "user@example.com"
  // Root cause: Email comparison was case-sensitive in the uniqueness check
  // Fix PR: #267

  beforeEach(async () => {
    await cleanupTestData();
  });

  it('treats emails as case-insensitive for login', async () => {
    await createTestUser({
      email: 'User@Example.com',
      password: 'SecurePass123!',
    });

    // Login with different casing should work
    const result = await authenticateUser('user@example.com', 'SecurePass123!');
    expect(result.success).toBe(true);
  });

  it('prevents duplicate registration with different casing', async () => {
    await createTestUser({
      email: 'user@example.com',
      password: 'SecurePass123!',
    });

    await expect(
      createTestUser({
        email: 'User@Example.com',
        password: 'AnotherPass456!',
      })
    ).rejects.toThrow(/already exists/i);
  });
});

describe('[BUG-031] Login fails silently when password hash is null', () => {
  // Discovered: 2024-05-18
  // Impact: OAuth-only users (no password) got a 500 error instead of
  //         a helpful "Please use Google Sign-In" message
  // Root cause: bcrypt.compare(password, null) throws instead of returning false
  // Fix PR: #312

  it('returns a clear error for OAuth-only users attempting password login', async () => {
    await createTestUser({
      email: 'oauth@example.com',
      password: null,  // OAuth user, no password set
      provider: 'google',
    });

    const result = await authenticateUser('oauth@example.com', 'anything');

    expect(result.success).toBe(false);
    expect(result.error).toBe('This account uses Google Sign-In. Please use the Google button to log in.');
    // Critically: this should NOT throw a 500
  });
});
```

### Payment regression test

```ts
// src/features/payments/checkout.regression.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processCheckout } from './checkout';
import { db } from '../../db';
import { orders, inventory } from '../../db/schema';

describe('[BUG-045] Double charge on payment retry after network timeout', () => {
  // Discovered: 2024-06-10
  // Impact: 23 customers were charged twice for the same order ($4,200 in duplicate charges)
  // Root cause: Payment gateway timeout triggered a retry, but the first request had
  //             actually succeeded. No idempotency key was sent with the retry.
  // Fix PR: #389

  beforeEach(async () => {
    await db.delete(orders);
  });

  it('uses idempotency key to prevent duplicate charges', async () => {
    const paymentGateway = vi.fn()
      .mockRejectedValueOnce(new Error('ETIMEDOUT'))  // First attempt times out
      .mockResolvedValueOnce({ chargeId: 'ch_123', status: 'succeeded' });  // Retry succeeds

    const result = await processCheckout({
      userId: 'user-1',
      items: [{ productId: 'prod-1', quantity: 1, price: 49.99 }],
      paymentGateway,
    });

    expect(result.status).toBe('completed');

    // Both calls should have used the same idempotency key
    const [firstCall, secondCall] = paymentGateway.mock.calls;
    expect(firstCall[0].idempotencyKey).toBeDefined();
    expect(firstCall[0].idempotencyKey).toBe(secondCall[0].idempotencyKey);

    // Only one order should exist
    const allOrders = await db.select().from(orders);
    expect(allOrders).toHaveLength(1);
  });

  it('does not create an order if all payment attempts fail', async () => {
    const paymentGateway = vi.fn()
      .mockRejectedValue(new Error('Card declined'));

    const result = await processCheckout({
      userId: 'user-1',
      items: [{ productId: 'prod-1', quantity: 1, price: 49.99 }],
      paymentGateway,
    });

    expect(result.status).toBe('failed');

    // No order should be created
    const allOrders = await db.select().from(orders);
    expect(allOrders).toHaveLength(0);
  });
});

describe('[BUG-052] Inventory goes negative on concurrent purchases', () => {
  // Discovered: 2024-07-22
  // Impact: Product showed "In Stock" but orders could not be fulfilled
  // Root cause: No database-level locking on inventory reads
  // Fix PR: #415

  it('prevents inventory from going below zero under concurrent requests', async () => {
    // Set inventory to 1
    await db.insert(inventory).values({ productId: 'prod-1', quantity: 1 });

    // Simulate two concurrent purchases
    const [result1, result2] = await Promise.allSettled([
      processCheckout({
        userId: 'user-1',
        items: [{ productId: 'prod-1', quantity: 1, price: 10 }],
      }),
      processCheckout({
        userId: 'user-2',
        items: [{ productId: 'prod-1', quantity: 1, price: 10 }],
      }),
    ]);

    // Exactly one should succeed and one should fail
    const successes = [result1, result2].filter(r => r.status === 'fulfilled' && r.value.status === 'completed');
    const failures = [result1, result2].filter(r => r.status === 'fulfilled' && r.value.status === 'failed');

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    // Inventory should be exactly 0, never negative
    const inv = await db.select().from(inventory).where(eq(inventory.productId, 'prod-1'));
    expect(inv[0].quantity).toBe(0);
  });
});
```

### Regression test index (optional tracking document)

```ts
// test/regression/REGRESSION-INDEX.md
// Maintain this as a quick reference for all regression tests

/**
 * | Bug ID  | Date       | Module    | Summary                              | Test File                       |
 * |---------|------------|-----------|--------------------------------------|---------------------------------|
 * | BUG-017 | 2024-03-15 | Auth      | Plus sign in email rejected          | auth/login.regression.test.ts   |
 * | BUG-023 | 2024-04-02 | Auth      | Case-sensitive email duplicates      | auth/login.regression.test.ts   |
 * | BUG-031 | 2024-05-18 | Auth      | Null password hash 500 error         | auth/login.regression.test.ts   |
 * | BUG-045 | 2024-06-10 | Payments  | Double charge on retry               | payments/checkout.regression.test.ts |
 * | BUG-052 | 2024-07-22 | Payments  | Negative inventory on concurrency    | payments/checkout.regression.test.ts |
 */
```

## Common Pitfalls

### 1. Deleting regression tests during "test cleanup"

Someone decides the test suite is too big and starts deleting "old" regression tests. Three months later, the exact same bug reappears. Regression tests are permanent. They are not deleted during refactors, test reorganizations, or "cleanup sprints." If the underlying feature is completely removed, only then can the regression test be removed.

### 2. Writing the regression test after the fix instead of before

The correct workflow is: reproduce the bug as a failing test, then fix the code to make the test pass (TDD for bugs). If you fix first and test second, you risk writing a test that always passes regardless of the fix — you have not proven it would have caught the bug.

### 3. Not documenting the bug context in the test

A regression test without context is just a random test. Future developers need to know: What was the bug? When was it found? What was the root cause? What PR fixed it? This context is a comment, not a separate document — it lives directly in the test file where it will be seen.

### 4. Making regression tests dependent on each other

If regression test for BUG-017 creates data that BUG-023's test depends on, a failure in BUG-017 cascades to BUG-023, making it look like two bugs reappeared when only one did. Each regression test must set up its own preconditions independently.

### 5. Only testing the exact scenario that caused the bug

The bug was "plus sign in email rejected" — but only testing `user+tag@gmail.com` is narrow. Also test `user+a+b@gmail.com`, `user+@gmail.com` (edge case), and other special characters that might have the same root cause. A regression test should cover the class of bug, not just the single instance.

### 6. Not running regression tests on every PR

Regression tests only work if they run frequently. If they are in a "nightly" suite that runs after hours, a bug can be reintroduced and merged before the regression test catches it. Regression tests must run on every PR, just like unit and integration tests. They are typically fast enough since they test specific scenarios, not broad coverage.

## Proof Artifact

The enforcement system accepts the following as evidence that regression tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Regression test results** | `pnpm test:regression --reporter=verbose 2>&1` | Every historical bug's test passed |
| **Bug-to-test mapping** | `REGRESSION-INDEX.md` or grep for `[BUG-` in test files | Every production bug has a corresponding test |
| **CI status check** | GitHub Actions regression job | Green checkmark = no regressions detected |

**Minimum passing criteria:**

- All regression tests pass (0 failures, 0 skipped)
- Every bug fix PR includes a regression test (enforced by PR review checklist)
- Regression tests include bug ID, discovery date, root cause, and fix PR in comments
- Regression tests run on every PR (not deferred to nightly or weekly)
- No regression test has been deleted without the underlying feature being removed
- The regression suite grows over time — a decreasing count indicates tests are being improperly removed
