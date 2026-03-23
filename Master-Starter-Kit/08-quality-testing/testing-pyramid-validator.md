# Testing Pyramid Validator

Enforce the testing pyramid so your test suite stays fast, reliable, and maintainable. An inverted pyramid (many E2E, few unit tests) is a slow, flaky CI pipeline waiting to happen.

---

## Target Distribution

| Test Type | File Pattern | Target Range | Hard Minimum |
|-----------|-------------|--------------|--------------|
| Unit | `*.unit.test.*` | ≥ 60% | 50% |
| Integration | `*.integration.test.*` | ≥ 20% | 15% |
| E2E | `*.e2e.test.*` | ≤ 20% | — (max, not min) |

These are percentages of total test files, not lines of code. A project with 100 test files should have at least 60 unit, at least 20 integration, and no more than 20 E2E.

---

## How to Measure

### Manual Count

```bash
# Count test files by type
UNIT=$(find . -name "*.unit.test.*" -not -path "*/node_modules/*" | wc -l)
INTEGRATION=$(find . -name "*.integration.test.*" -not -path "*/node_modules/*" | wc -l)
E2E=$(find . -name "*.e2e.test.*" -not -path "*/node_modules/*" | wc -l)
TOTAL=$((UNIT + INTEGRATION + E2E))

echo "Unit:        $UNIT  ($((UNIT * 100 / TOTAL))%)"
echo "Integration: $INTEGRATION  ($((INTEGRATION * 100 / TOTAL))%)"
echo "E2E:         $E2E  ($((E2E * 100 / TOTAL))%)"
echo "Total:       $TOTAL"
```

### Automated Validator Script

```typescript
// scripts/validate-pyramid.ts
import { globSync } from 'glob';

interface PyramidResult {
  unit: number;
  integration: number;
  e2e: number;
  total: number;
  ratios: { unit: number; integration: number; e2e: number };
  pass: boolean;
  violations: string[];
}

function validatePyramid(rootDir: string = '.'): PyramidResult {
  const opts = { ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'] };

  const unit = globSync(`${rootDir}/**/*.unit.test.*`, opts).length;
  const integration = globSync(`${rootDir}/**/*.integration.test.*`, opts).length;
  const e2e = globSync(`${rootDir}/**/*.e2e.test.*`, opts).length;
  const total = unit + integration + e2e;

  if (total === 0) {
    return {
      unit: 0, integration: 0, e2e: 0, total: 0,
      ratios: { unit: 0, integration: 0, e2e: 0 },
      pass: false,
      violations: ['No test files found. Expected *.unit.test.*, *.integration.test.*, *.e2e.test.*'],
    };
  }

  const ratios = {
    unit: (unit / total) * 100,
    integration: (integration / total) * 100,
    e2e: (e2e / total) * 100,
  };

  const violations: string[] = [];
  if (ratios.unit < 60) violations.push(`Unit tests at ${ratios.unit.toFixed(1)}% (need ≥60%)`);
  if (ratios.integration < 20) violations.push(`Integration tests at ${ratios.integration.toFixed(1)}% (need ≥20%)`);
  if (ratios.e2e > 20) violations.push(`E2E tests at ${ratios.e2e.toFixed(1)}% (need ≤20%)`);

  return { unit, integration, e2e, total, ratios, pass: violations.length === 0, violations };
}

const result = validatePyramid(process.argv[2] || '.');
console.log('\n=== Testing Pyramid Report ===');
console.log(`Unit:        ${result.unit} files (${result.ratios.unit.toFixed(1)}%)`);
console.log(`Integration: ${result.integration} files (${result.ratios.integration.toFixed(1)}%)`);
console.log(`E2E:         ${result.e2e} files (${result.ratios.e2e.toFixed(1)}%)`);
console.log(`Total:       ${result.total} files`);
console.log(`Status:      ${result.pass ? 'PASS' : 'FAIL'}`);
if (!result.pass) {
  console.log('\nViolations:');
  result.violations.forEach(v => console.log(`  - ${v}`));
  process.exit(1);
}
```

### CI Integration

```yaml
# Add to .github/workflows/ci.yml
pyramid-check:
  name: Testing Pyramid Validation
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npx tsx scripts/validate-pyramid.ts
```

---

## The Inverted Pyramid Anti-Pattern

An inverted pyramid has more E2E tests than unit tests. It is the most common testing anti-pattern in web applications.

### Symptoms

- **CI takes 20+ minutes** — E2E tests dominate the pipeline
- **Flaky failures** — Playwright/Cypress tests fail intermittently due to timing, network, or rendering issues
- **Developers skip tests locally** — "I'll just let CI catch it" because the suite is too slow
- **Fear of refactoring** — Changing internal code breaks E2E tests that should not care about implementation details
- **Bug localization is slow** — When an E2E test fails, you don't know if it's a UI bug, an API bug, or a database bug

### Root Causes

1. **Testing after the fact.** Features are built without unit tests, then QA writes E2E tests to "cover" them. The unit test gap is never backfilled.
2. **Confusing coverage with confidence.** E2E tests touch many lines of code, so coverage looks high. But they test through the UI, making every assertion slow and fragile.
3. **No test type guidance.** Developers don't know which test type to use, so they default to what's most visible (E2E).
4. **Copy-paste test culture.** The first E2E test becomes the template for every subsequent test, even when a unit test would be faster and more precise.

### Example of the Problem

```
BAD pyramid (inverted):
  Unit:        12 tests (15%)  <-- dangerously low
  Integration:  8 tests (10%)  <-- under threshold
  E2E:         60 tests (75%)  <-- CI takes 25 minutes, 3 flaky failures per run

GOOD pyramid:
  Unit:        60 tests (65%)  <-- fast, precise, stable
  Integration: 22 tests (24%)  <-- API contracts verified
  E2E:         10 tests (11%)  <-- critical user journeys only
```

---

## Remediation Guide

When your pyramid is inverted, follow this order:

### Step 1: Identify Over-Tested E2E Scenarios

List every E2E test. For each one, ask: "Does this test a user journey, or does it test business logic through the UI?"

```
E2E test: "validates that email field rejects invalid format"
→ This is business logic. Move to a unit test on the validator function.

E2E test: "user can complete checkout flow end-to-end"
→ This is a user journey. Keep as E2E.
```

### Step 2: Extract Unit Tests from E2E Tests

For every E2E test that tests logic, write the equivalent unit test first, then delete the E2E test.

```typescript
// BEFORE: E2E test (slow, flaky)
test('rejects order with quantity > stock', async ({ page }) => {
  await page.goto('/products/widget-a');
  await page.fill('[data-testid="quantity"]', '999');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('.error')).toContainText('exceeds available stock');
});

// AFTER: Unit test (fast, reliable)
// products/validators.unit.test.ts
describe('validateOrderQuantity', () => {
  it('rejects quantity exceeding stock', () => {
    const result = validateOrderQuantity({ quantity: 999, stock: 10 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Quantity exceeds available stock');
  });
});
```

### Step 3: Add Integration Tests for API Contracts

For E2E tests that test API behavior through the UI, write integration tests that call the API directly.

```typescript
// BEFORE: E2E test (tests API through browser)
test('search returns filtered results', async ({ page }) => {
  await page.goto('/search');
  await page.fill('[data-testid="search"]', 'widget');
  await expect(page.locator('.result')).toHaveCount(3);
});

// AFTER: Integration test (tests API directly)
// search/api.integration.test.ts
describe('GET /api/search', () => {
  it('returns filtered results for query', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/search?q=widget' });
    expect(res.statusCode).toBe(200);
    expect(res.json().results).toHaveLength(3);
  });
});
```

### Step 4: Keep E2E for Critical Journeys Only

E2E tests should cover the 5-10 most important user journeys. Not every feature needs an E2E test.

Good E2E candidates:
- User registration + email verification + first login
- Complete purchase flow (browse → cart → checkout → confirmation)
- Admin creates a resource that appears in user's dashboard
- Authentication flow (login → access protected page → logout)

Bad E2E candidates:
- Form validation rules (unit test the validator)
- API error handling (integration test the endpoint)
- Component rendering (component test with Testing Library)
- Data transformations (unit test the function)

---

## Exceptions: When More E2E Is Acceptable

| Scenario | Adjusted Target | Rationale |
|----------|----------------|-----------|
| Small app (< 20 test files) | E2E ≤ 35% | Small apps have fewer units to test individually |
| Integration-heavy app (ETL, data pipelines) | Integration ≥ 40%, E2E ≤ 15% | Integration boundaries are the primary risk |
| UI-heavy app (content site, portfolio) | E2E ≤ 30%, Unit ≥ 45% | More visual paths to verify |
| API-only (no frontend) | E2E = 0%, Integration ≥ 50% | No browser-based tests needed |
| Legacy codebase (adding tests retroactively) | E2E ≤ 40% for first 3 months | Start with E2E to cover critical paths, then backfill unit tests |

---

## Project-Specific Pyramid Targets

```markdown
## Testing Pyramid Configuration — {{PROJECT_NAME}}

| Test Type | Target % | Hard Min/Max | Current % | Status |
|-----------|----------|-------------|-----------|--------|
| Unit (*.unit.test.*) | {{UNIT_TARGET}}% | ≥ {{UNIT_HARD_MIN}}% | —% | — |
| Integration (*.integration.test.*) | {{INTEGRATION_TARGET}}% | ≥ {{INTEGRATION_HARD_MIN}}% | —% | — |
| E2E (*.e2e.test.*) | {{E2E_TARGET}}% | ≤ {{E2E_HARD_MAX}}% | —% | — |

### Exceptions
<!-- Document any agreed-upon deviations from the standard pyramid -->
| Exception | Justification | Approved By | Expiry |
|-----------|--------------|-------------|--------|
| {{EXCEPTION_DESCRIPTION}} | {{JUSTIFICATION}} | {{APPROVER}} | {{EXPIRY_DATE}} |

### Validation Cadence
- [ ] Run pyramid validator on every PR (CI gate)
- [ ] Review pyramid ratios at every phase gate
- [ ] Re-evaluate targets at every phase transition
```

---

## Integration with Phase Gates

At every phase gate (see `enforcement/phase-gate.md`), run the pyramid validator. Record the output as a proof artifact:

```bash
npx tsx scripts/validate-pyramid.ts > test-results/phase-{{PHASE_NUMBER}}-pyramid.txt
```

Phase gate fails if the pyramid is inverted (E2E > Unit). The Phase Gate checklist should include:

- [ ] Pyramid validator passes (unit ≥ 60%, integration ≥ 20%, E2E ≤ 20%)
- [ ] Pyramid report saved as proof artifact
- [ ] Any pyramid exceptions documented with justification
