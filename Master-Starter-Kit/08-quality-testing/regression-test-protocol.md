# Regression Test Protocol

Every bug fix MUST add a regression test before the fix is applied. No exceptions. A bug without a regression test is a bug that will come back.

---

## The Rule

**Write the test first. Watch it fail. Then fix the bug. Watch the test pass.**

This is not TDD philosophy — it is a mechanical safeguard. The regression test proves two things:
1. The bug was real (the test fails without the fix)
2. The bug is fixed (the test passes with the fix)

If you skip the "watch it fail" step, you might write a test that passes for the wrong reason and never actually catches the bug.

---

## Regression Test Naming Convention

```
{feature}.regression.{bug-id}.test.{ext}
```

| Component | Source | Example |
|-----------|--------|---------|
| `{feature}` | The feature/module where the bug was found | `invoice`, `auth`, `trips` |
| `{bug-id}` | Issue tracker ID or short descriptor | `GH-142`, `null-customer`, `timezone-offset` |
| `{ext}` | Test file extension matching your stack | `ts`, `tsx`, `js` |

### Examples

```
invoice.regression.GH-142.test.ts
auth.regression.session-expiry-race.test.ts
trips.regression.null-driver-assignment.test.ts
billing.regression.GH-287-duplicate-charge.test.ts
```

### Where to Place Regression Tests

Place them alongside the module they test:

```
src/
  features/
    invoice/
      invoice.service.ts
      invoice.service.unit.test.ts
      invoice.regression.GH-142.test.ts        ← here
      invoice.regression.GH-287-duplicate.test.ts
    auth/
      auth.service.ts
      auth.regression.session-expiry-race.test.ts  ← here
```

---

## Regression Test Structure

Every regression test follows this 4-part structure:

```typescript
// invoice.regression.GH-142.test.ts

/**
 * Regression test for GH-142
 * Bug: Invoice total calculated incorrectly when discount is exactly 100%
 * Root cause: Division by zero when discount percentage equals 100
 * Fixed in: commit abc123 / PR #145
 * Date: 2026-03-20
 */
describe('GH-142: 100% discount causes division by zero', () => {
  // 1. SETUP — Create the exact conditions that triggered the bug
  const invoice = createInvoice({
    lineItems: [{ description: 'Widget', quantity: 1, unitPrice: 100 }],
    discountPercent: 100,
  });

  // 2. REPRODUCE — The operation that triggered the bug
  it('calculates total correctly with 100% discount', () => {
    const total = calculateInvoiceTotal(invoice);

    // 3. ASSERT — The correct behavior (this would have FAILED before the fix)
    expect(total).toBe(0);
    expect(Number.isFinite(total)).toBe(true); // Was NaN before fix
  });

  // 4. BOUNDARY — Test adjacent cases to prevent similar bugs
  it('handles 99.99% discount without error', () => {
    const almostFree = { ...invoice, discountPercent: 99.99 };
    expect(calculateInvoiceTotal(almostFree)).toBeCloseTo(0.01);
  });

  it('handles 0% discount without error', () => {
    const noDiscount = { ...invoice, discountPercent: 0 };
    expect(calculateInvoiceTotal(noDiscount)).toBe(100);
  });
});
```

### The 4 Parts Explained

| Part | Purpose | Required? |
|------|---------|-----------|
| **Setup** | Recreate the exact conditions that caused the bug | Yes |
| **Reproduce** | Execute the operation that triggered the bug | Yes |
| **Assert** | Verify the correct behavior (would have failed before fix) | Yes |
| **Boundary** | Test adjacent inputs to prevent similar bugs | Recommended |

---

## Workflow: Bug Fix with Regression Test

```
1. Bug reported (issue GH-142)
2. Reproduce locally — confirm bug exists
3. Write regression test — name: feature.regression.GH-142.test.ts
4. Run test — MUST FAIL (proves the test catches the bug)
5. Fix the bug in the application code
6. Run test — MUST PASS (proves the fix works)
7. Run full test suite — MUST PASS (fix doesn't break anything else)
8. Commit with message: "fix(invoice): handle 100% discount (GH-142)"
9. Update bug-to-test mapping table
10. Update STATUS.md with regression test entry
```

---

## Phase Gate Verification

At each phase gate, verify that regression tests exist for every bug fixed during that phase.

### Verification Script

```bash
#!/bin/bash
# scripts/verify-regression-tests.sh
# Checks that every bug-fix commit has a corresponding regression test

echo "=== Regression Test Verification ==="

# Find all bug-fix commits in this phase
FIX_COMMITS=$(git log --oneline --grep="^fix" --since="{{PHASE_START_DATE}}" | wc -l)
REGRESSION_TESTS=$(find . -name "*.regression.*.test.*" -not -path "*/node_modules/*" -newer "{{PHASE_START_MARKER}}" | wc -l)

echo "Bug-fix commits this phase: $FIX_COMMITS"
echo "Regression tests added:     $REGRESSION_TESTS"

if [ "$REGRESSION_TESTS" -lt "$FIX_COMMITS" ]; then
  echo "FAIL: Missing regression tests. Every bug fix needs a regression test."
  echo "Missing: $((FIX_COMMITS - REGRESSION_TESTS)) regression test(s)"
  exit 1
else
  echo "PASS: All bug fixes have regression tests."
fi
```

### Phase Gate Checklist Addition

Add to `enforcement/phase-gate.md` Section 2:

- [ ] Every bug fix in this phase has a corresponding `*.regression.*.test.*` file
- [ ] Every regression test has the 4-part structure (setup, reproduce, assert, boundary)
- [ ] Regression test verification script passes
- [ ] Bug-to-test mapping table is up to date

---

## Bug-to-Test Mapping Table

Maintain this table in `dev_docs/quality/regression-map.md`. It is the single source of truth for which bugs have regression tests.

```markdown
# Bug-to-Test Mapping — {{PROJECT_NAME}}

| Bug ID | Summary | Module | Regression Test File | Fix Commit | Phase | Date |
|--------|---------|--------|---------------------|------------|-------|------|
| {{BUG_ID}} | {{BUG_SUMMARY}} | {{MODULE}} | {{REGRESSION_TEST_PATH}} | {{FIX_COMMIT}} | {{PHASE_NUMBER}} | {{DATE}} |

### Example Entries

| Bug ID | Summary | Module | Regression Test File | Fix Commit | Phase | Date |
|--------|---------|--------|---------------------|------------|-------|------|
| GH-142 | 100% discount causes NaN total | invoice | `invoice.regression.GH-142.test.ts` | abc123 | 2 | 2026-03-15 |
| GH-187 | Session expires during form submit | auth | `auth.regression.GH-187.test.ts` | def456 | 2 | 2026-03-18 |
| GH-203 | Null driver crashes trip assignment | trips | `trips.regression.GH-203.test.ts` | ghi789 | 3 | 2026-03-22 |
```

---

## Good vs Bad Regression Tests

### Bad: Regression Test That Doesn't Prove the Bug

```typescript
// BAD — This test would pass even WITHOUT the fix
describe('GH-142: discount calculation', () => {
  it('calculates discount', () => {
    const total = calculateInvoiceTotal({
      lineItems: [{ unitPrice: 100, quantity: 1 }],
      discountPercent: 10, // <-- 10% doesn't trigger the bug (100% does)
    });
    expect(total).toBe(90);
  });
});
```

Why it's bad: The test uses `discountPercent: 10`, but the bug only triggers at `100`. This test would pass on both the buggy and fixed code, proving nothing.

### Bad: Regression Test That Tests Too Broadly

```typescript
// BAD — Integration test when a unit test would suffice
describe('GH-142: discount calculation', () => {
  it('handles 100% discount via API', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .send({ lineItems: [...], discountPercent: 100 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });
});
```

Why it's bad: The bug is in `calculateInvoiceTotal()` — a pure function. Testing through the API adds network, database, and serialization to the test, making it slower and potentially flaky. Test the function directly.

### Good: Precise Regression Test

```typescript
// GOOD — Tests the exact conditions and the exact function
describe('GH-142: 100% discount causes division by zero', () => {
  it('returns 0 for 100% discount (was NaN before fix)', () => {
    const total = calculateInvoiceTotal({
      lineItems: [{ unitPrice: 100, quantity: 1, description: 'Widget' }],
      discountPercent: 100,
    });
    expect(total).toBe(0);
    expect(Number.isFinite(total)).toBe(true);
  });
});
```

Why it's good: Tests the exact input that triggers the bug, calls the exact function that was broken, and asserts the specific behavior that was wrong (`NaN` → `0`).

---

## Integration with STATUS.md

When a bug is fixed with a regression test, add it to STATUS.md:

```markdown
### Bug Fixes (Phase {{PHASE_NUMBER}})

- [x] GH-142: 100% discount NaN — regression test: `invoice.regression.GH-142.test.ts`
- [x] GH-187: Session expiry race — regression test: `auth.regression.GH-187.test.ts`
- [ ] GH-203: Null driver crash — regression test: `trips.regression.GH-203.test.ts` (in progress)
```

---

## Common Regression Test Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Writing the test after the fix | You can't prove the test catches the bug | Write test first, watch it fail, then fix |
| Testing with different inputs than the bug | Test passes on buggy code | Use the exact inputs from the bug report |
| Deleting regression tests during refactors | Bug can return silently | Regression tests are permanent — adapt them, never delete |
| No bug ID in the test name | Can't trace test to original bug | Always include the issue ID |
| Skipping boundary tests | Similar bugs in adjacent inputs | Add at least one boundary case |
