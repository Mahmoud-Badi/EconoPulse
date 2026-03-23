# Mutation Tests

## What It Is

Mutation testing tests your tests. It works by automatically making small changes (mutations) to your source code — flipping conditions, changing operators, removing statements, swapping return values — and then running your test suite against each mutated version. If your tests still pass after the code was deliberately broken, those tests are weak: they wouldn't catch a real bug in that code. The percentage of mutations your tests catch is your mutation score, and it's a far more meaningful measure of test quality than code coverage. A codebase can have 95% line coverage and a 40% mutation score — meaning more than half the covered code could break without any test noticing.

---

## What It Catches

- **Tests that assert nothing meaningful** — `expect(result).toBeDefined()` passes whether the function returns the correct answer, the wrong answer, or an error object. A mutation that changes `return total * taxRate` to `return total / taxRate` still passes this assertion.
- **Missing boundary condition tests** — You test that `isEligible(18)` returns true but never test `isEligible(17)`. A mutation flips `>=` to `>` and your tests don't catch it.
- **Dead code in test coverage** — A function has 100% line coverage, but a critical `if` branch is only tested in one direction. Removing the `else` block entirely doesn't fail any test.
- **Copy-pasted tests with wrong assertions** — A test was duplicated for a similar function, but the assertion still checks the original function's output. Mutation reveals the new function has zero effective coverage.
- **Weak snapshot tests** — Snapshot tests cover the output shape but not the data values. Mutations to calculation logic are invisible because the snapshot only checks that certain keys exist.
- **Over-mocked tests** — You mocked so many dependencies that the function under test is barely executing real code. Mutations to the real code don't affect the test because the mocks bypass all the logic.
- **Tests that test the framework, not the business logic** — "Component renders without crashing" passes regardless of what the component actually displays. Mutating the render logic changes nothing.
- **Stale tests** — Tests that passed when written but the code they cover has been refactored since. The tests still pass because they test an abstraction layer that's no longer connected to the current implementation.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Financial calculations (pricing, tax, billing, discounts) | A wrong operator means wrong money. Mutation testing proves your math tests are airtight. |
| Authentication and authorization logic | A flipped condition (`===` to `!==`) in auth code is a security vulnerability. Must be caught. |
| Healthcare, legal, or safety-critical logic | Regulatory requirements often demand evidence that tests are meaningful, not just present. |
| Core business rules (eligibility, matching, scoring) | The rules that define your product must be verified thoroughly. |
| High code coverage but low confidence | "We have 90% coverage but bugs still ship" — mutation testing reveals why. |
| Shared utility libraries used across the codebase | A subtle bug in a shared function propagates to every consumer. |

**Skip when:** UI layout tests (mutation testing is too slow and noisy for visual code), test suites under 50 tests (fix weak tests manually instead), prototype code that will be rewritten.

**Important warning:** Mutation testing is computationally expensive. Running Stryker against an entire codebase can take hours. Always use it in a targeted way — on critical modules, not everything.

---

## Setup Guide

### Stryker Mutator (JavaScript/TypeScript)

```bash
# Install Stryker
npm install -D @stryker-mutator/core

# Install the runner for your test framework
npm install -D @stryker-mutator/jest-runner
# OR
npm install -D @stryker-mutator/vitest-runner

# Install the TypeScript checker (if using TS)
npm install -D @stryker-mutator/typescript-checker

# Initialize config
npx stryker init
```

### Project Structure

```
stryker.config.mjs            # Stryker configuration
tests/
  unit/
    billing/
      calculate-total.test.ts    # Tests to verify via mutation
    auth/
      check-permissions.test.ts  # Tests to verify via mutation
src/
  billing/
    calculate-total.ts           # Source code that gets mutated
  auth/
    check-permissions.ts         # Source code that gets mutated
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **Stryker Mutator** | JavaScript / TypeScript | Most mature JS mutation testing framework |
| **Stryker (C#)** | .NET projects | Same project, different language target |
| **PIT (pitest)** | Java / JVM | Industry standard for Java mutation testing |
| **mutmut** | Python | Simple, focused Python mutation tester |
| **cargo-mutants** | Rust | Mutation testing for Rust projects |

---

## Template

### Stryker Configuration

```js
// stryker.config.mjs
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  // Only mutate critical business logic files
  mutate: [
    'src/billing/**/*.ts',
    'src/auth/**/*.ts',
    'src/utils/validators/**/*.ts',
    'src/core/pricing/**/*.ts',
    // Exclude test files and type definitions
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
  ],

  testRunner: 'jest',
  // OR: testRunner: 'vitest',

  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',

  reporters: [
    'html',        // Visual report in reports/mutation/
    'clear-text',  // Terminal summary
    'progress',    // Progress bar during execution
  ],

  // Thresholds
  thresholds: {
    high: 80,    // Green: 80%+ mutation score
    low: 60,     // Red: below 60% mutation score
    break: 50,   // Fail the build if below 50%
  },

  // Performance: limit concurrent test runners
  concurrency: 4,

  // Timeout: how long to wait for a mutant test run
  // (each mutant re-runs relevant tests; 10s is usually enough)
  timeoutMS: 10000,
  timeoutFactor: 1.5,

  // Incremental: only re-test mutants for changed files
  incremental: true,
  incrementalFile: '.stryker-cache/incremental.json',
};

export default config;
```

### Source Code Example (What Gets Mutated)

```ts
// src/billing/calculate-total.ts
export interface LineItem {
  price: number;
  quantity: number;
  taxRate: number;
}

export interface OrderTotal {
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
}

export function calculateOrderTotal(
  items: LineItem[],
  couponPercent: number = 0
): OrderTotal {
  // Stryker will mutate: + to -, * to /, >= to <, etc.
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = couponPercent >= 0 && couponPercent <= 100
    ? subtotal * (couponPercent / 100)
    : 0;

  const discountedSubtotal = subtotal - discount;

  const tax = items.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.taxRate),
    0
  );

  const total = discountedSubtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    discount: Math.round(discount * 100) / 100,
  };
}
```

### Strong Tests That Survive Mutations

```ts
// src/billing/calculate-total.test.ts
import { calculateOrderTotal, LineItem } from './calculate-total';

describe('calculateOrderTotal', () => {
  const singleItem: LineItem[] = [
    { price: 29.99, quantity: 2, taxRate: 0.08 },
  ];

  const multipleItems: LineItem[] = [
    { price: 29.99, quantity: 2, taxRate: 0.08 },
    { price: 9.99, quantity: 1, taxRate: 0.08 },
    { price: 49.99, quantity: 3, taxRate: 0.0 },  // Tax-exempt item
  ];

  // ── Exact value assertions (not just "is defined") ──────────

  test('calculates subtotal correctly for single item', () => {
    const result = calculateOrderTotal(singleItem);
    expect(result.subtotal).toBe(59.98); // 29.99 * 2
  });

  test('calculates subtotal correctly for multiple items', () => {
    const result = calculateOrderTotal(multipleItems);
    expect(result.subtotal).toBe(219.94); // (29.99*2) + (9.99*1) + (49.99*3)
  });

  test('calculates tax correctly', () => {
    const result = calculateOrderTotal(singleItem);
    expect(result.tax).toBe(4.8); // 59.98 * 0.08
  });

  test('tax-exempt items contribute zero tax', () => {
    const taxExemptOnly: LineItem[] = [
      { price: 100, quantity: 1, taxRate: 0.0 },
    ];
    const result = calculateOrderTotal(taxExemptOnly);
    expect(result.tax).toBe(0);
  });

  test('calculates total as subtotal + tax', () => {
    const result = calculateOrderTotal(singleItem);
    expect(result.total).toBe(64.78); // 59.98 + 4.80
  });

  // ── Coupon tests ────────────────────────────────────────────

  test('applies percentage coupon correctly', () => {
    const result = calculateOrderTotal(singleItem, 20);
    expect(result.discount).toBe(12.0); // 59.98 * 0.20
    expect(result.total).toBe(52.78);   // (59.98 - 12.00) + 4.80
  });

  test('zero coupon means no discount', () => {
    const result = calculateOrderTotal(singleItem, 0);
    expect(result.discount).toBe(0);
  });

  test('100% coupon makes subtotal zero (tax still applies)', () => {
    const result = calculateOrderTotal(singleItem, 100);
    expect(result.discount).toBe(59.98);
    expect(result.total).toBe(4.8); // Only tax remains
  });

  // ── Boundary conditions (catch operator mutations) ──────────

  test('negative coupon percent is treated as zero', () => {
    const result = calculateOrderTotal(singleItem, -10);
    expect(result.discount).toBe(0);
  });

  test('coupon over 100% is treated as zero', () => {
    const result = calculateOrderTotal(singleItem, 150);
    expect(result.discount).toBe(0);
  });

  // ── Edge cases ──────────────────────────────────────────────

  test('empty items array returns all zeros', () => {
    const result = calculateOrderTotal([]);
    expect(result.subtotal).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
    expect(result.discount).toBe(0);
  });

  test('quantity of 1 does not multiply incorrectly', () => {
    const result = calculateOrderTotal([{ price: 10, quantity: 1, taxRate: 0 }]);
    expect(result.subtotal).toBe(10); // Not 100, not 0, not 1
  });

  test('rounding handles fractional cents', () => {
    const result = calculateOrderTotal([
      { price: 1.01, quantity: 3, taxRate: 0.0725 },
    ]);
    // 1.01 * 3 = 3.03; tax = 3.03 * 0.0725 = 0.219675 → 0.22
    expect(result.subtotal).toBe(3.03);
    expect(result.tax).toBe(0.22);
    expect(result.total).toBe(3.25);
  });
});
```

### CI Integration

```yaml
# .github/workflows/mutation.yml
name: Mutation Tests
on:
  # Run weekly (too slow for every PR)
  schedule:
    - cron: '0 2 * * 0'  # Sunday 2 AM
  # Also allow manual trigger
  workflow_dispatch:
  # Run on PRs that touch critical paths
  pull_request:
    paths:
      - 'src/billing/**'
      - 'src/auth/**'
      - 'src/core/pricing/**'

jobs:
  mutation-test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - name: Run Stryker mutation tests
        run: npx stryker run
      - name: Upload mutation report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: mutation-report
          path: reports/mutation/
```

### package.json Scripts

```json
{
  "scripts": {
    "test:mutation": "stryker run",
    "test:mutation:billing": "stryker run --mutate 'src/billing/**/*.ts'",
    "test:mutation:auth": "stryker run --mutate 'src/auth/**/*.ts'",
    "test:mutation:incremental": "stryker run --incremental"
  }
}
```

---

## Common Pitfalls

### 1. Running mutation tests on the entire codebase
**Problem:** Stryker generates 3,000 mutants and runs the full test suite for each one. Total runtime: 14 hours. Nobody ever runs it again.
**Fix:** Target mutation testing at critical business logic only. Use the `mutate` config to scope it to billing, auth, and core algorithm files. 50-200 mutants is a manageable target.

### 2. Chasing 100% mutation score
**Problem:** Some mutants are equivalent (the mutated code does the same thing as the original) or test infrastructure code that doesn't need mutation coverage. Trying to kill every mutant wastes time.
**Fix:** Aim for 80%+ on critical modules. Use Stryker's `// Stryker disable next-line` for intentionally unkilled mutants (e.g., logging statements, dev-only code). Review survivors to decide if they matter.

### 3. Fixing surviving mutants with bad tests
**Problem:** A mutant survives because `>=` was changed to `>`. You add a test: `expect(isEligible(18)).toBe(true)` — but this doesn't actually test the boundary. The mutant still survives with `>` because 18 > 18 is false and 18 >= 18 is true, so you need to test the exact boundary value.
**Fix:** When a mutant survives, think about what input would produce different output between the original and mutated code. Test that specific input.

### 4. Mutation testing replacing real test quality work
**Problem:** Team focuses on killing mutants instead of thinking about what to test. Tests become mutation-score-optimized but don't cover real user scenarios.
**Fix:** Mutation testing is a supplement to good test design, not a replacement. Use it to find gaps in existing tests, not as the primary driver of test creation.

### 5. Not using incremental mode
**Problem:** Every run re-tests all mutants from scratch, even if only one source file changed.
**Fix:** Enable `incremental: true` in Stryker config. It caches results and only re-tests mutants for changed files.

### 6. Ignoring the mutation report
**Problem:** Mutation tests run in CI, produce a report, and nobody looks at it. The mutation score drops from 78% to 52% over 6 months.
**Fix:** Set a `break` threshold in the config. If the mutation score drops below the threshold, the build fails. Review the HTML report after each run to understand which mutations survived and why.

---

## Proof Artifact

A mutation test pass produces these artifacts:

### Terminal output (clear-text reporter)
```
All tests
  ✓ calculateOrderTotal › calculates subtotal correctly for single item [survived]
    Mutant: ArithmeticOperator - src/billing/calculate-total.ts:14:32
    - sum + item.price * item.quantity
    + sum - item.price * item.quantity
    Status: Killed

  ...

Mutation testing report:
-----------------------
  Files             Mutants  Killed  Survived  Timeout  No coverage
  calculate-total     42      38        2         2         0
  check-permissions   28      26        0         2         0
  validators          31      28        1         2         0
-----------------------
  Total              101      92        3         6         0
  Mutation score: 91.09% (> 80% threshold ✓)
  Build threshold: 50% ✓
```

### HTML Report
Stryker generates an interactive HTML report at `reports/mutation/html/index.html` showing:
- Each source file with mutations highlighted inline
- Color-coded: green (killed), red (survived), orange (timeout), gray (no coverage)
- Click any mutation to see which test killed it (or which tests failed to catch it)

### What constitutes a pass:
1. **Mutation score above the `break` threshold** (recommended: 50% minimum, 80% target)
2. **No survived mutants in critical financial/auth logic** — these must be investigated and tests strengthened
3. **HTML report** saved as CI artifact for review
4. **Any new survived mutants** from the incremental run are documented and tracked
5. **CI pipeline** exits with code 0 (mutation score above `break` threshold)
