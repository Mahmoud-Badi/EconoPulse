# Phase-Level Verification Gate

The checkpoint that must be passed before moving to the next development phase. While the Feature Gate verifies individual features, the Phase Gate verifies that all features in the phase work together and that accumulated quality debt is zero.

---

## When This Gate Applies

At the end of every development phase, before the first task of the next phase begins. No work on Phase N+1 starts until the Phase N gate passes. This prevents the "move on and fix it later" pattern that turns quality debt into quality bankruptcy.

---

## Prerequisites

Before running the Phase Gate:
- [ ] All features scheduled for this phase have been completed
- [ ] Every feature in this phase has passed its [Feature Gate](./feature-gate.md)
- [ ] No in-progress work remains from this phase (everything is either "done" or "deferred with justification")

---

## Phase Gate Checklist

### Section 1: Feature Gate Rollup

- [ ] **All features in this phase** have passed their Feature Gates
- [ ] **Feature Gate pass dates** are documented for each feature
- [ ] **No feature** was marked "done" without passing the Feature Gate
- [ ] **Deferred features** (if any) have documented justification and are tracked in the backlog

```markdown
| Feature | Feature Gate Status | Gate Date | Notes |
|---------|-------------------|-----------|-------|
| {{FEATURE_1}} | PASS | YYYY-MM-DD | |
| {{FEATURE_2}} | PASS | YYYY-MM-DD | |
| {{FEATURE_3}} | DEFERRED | YYYY-MM-DD | Moved to Phase N+1, justification: [link] |
```

### Section 2: Regression Testing

Individual features passed their own tests. Now verify they did not break each other.

- [ ] **Full regression suite** runs clean across ALL features in this phase (not just the latest feature)
- [ ] **Regression suite includes features from previous phases** (Phase 1 features must still pass after Phase 2 work)
- [ ] **Zero test failures** in the regression run (failures introduced by cross-feature interaction)
- [ ] **Regression test output** captured as proof artifact

```bash
# Run the full test suite, not just tests for the current phase
pnpm test
# Capture output
pnpm test --reporter=json > test-results/phase-{{N}}-regression.json
```

### Section 3: Coverage Report

- [ ] **Statement coverage** meets project threshold (default: ≥ 80%)
- [ ] **Function coverage** meets project threshold (default: ≥ 88%)
- [ ] **Branch coverage** meets project threshold (default: ≥ 75%)
- [ ] **Line coverage** meets project threshold (default: ≥ 80%)
- [ ] **No individual feature** has coverage significantly below the project average (> 10% gap)
- [ ] **Coverage report** captured as proof artifact

```bash
pnpm test:coverage
# Coverage summary at: coverage/coverage-summary.json
```

```markdown
| Metric | Threshold | Actual | Status |
|--------|-----------|--------|--------|
| Statements | ≥ 80% | {{ACTUAL}}% | PASS / FAIL |
| Functions | ≥ 88% | {{ACTUAL}}% | PASS / FAIL |
| Branches | ≥ 75% | {{ACTUAL}}% | PASS / FAIL |
| Lines | ≥ 80% | {{ACTUAL}}% | PASS / FAIL |
```

### Section 4: Test Debt Resolution

- [ ] **No `.skip` tests** in the codebase without documented justification and active resolution tickets
- [ ] **No `.todo` tests** without active tickets for implementation
- [ ] **All test debt** from this phase is either resolved or tracked with an owner and deadline
- [ ] **Test debt report** generated

```markdown
| Test File | Debt Type | Reason | Ticket | Owner | Deadline |
|-----------|-----------|--------|--------|-------|----------|
| trips.test.ts:42 | .skip | Flaky due to timing, needs mock refactor | BUG-234 | Dev A | Phase N+1 Sprint 1 |
```

If the "Test Debt" table has more than 5 entries, it is a signal that the phase was under-tested and should not pass without a remediation plan.

### Section 5: Performance Budget

- [ ] **Performance budget** still met after all features in this phase
- [ ] **No feature** introduced a Lighthouse Performance regression > 5 points
- [ ] **Bundle size** did not increase beyond the budget (if defined)
- [ ] **API response times** still within thresholds at p95
- [ ] **Performance report** captured as proof artifact

```markdown
| Metric | Budget | Before Phase | After Phase | Status |
|--------|--------|-------------|-------------|--------|
| Lighthouse Performance | ≥ 90 | 94 | {{ACTUAL}} | PASS / FAIL |
| JS Bundle (gzipped) | ≤ 250KB | 180KB | {{ACTUAL}} | PASS / FAIL |
| API p95 (list endpoints) | ≤ 200ms | 120ms | {{ACTUAL}} | PASS / FAIL |
| First Contentful Paint | ≤ 1.5s | 0.9s | {{ACTUAL}} | PASS / FAIL |
```

### Section 6: Security Scan

- [ ] **`npm audit`** shows 0 critical and 0 high vulnerabilities
- [ ] **New dependencies** added during this phase have been reviewed for security
- [ ] **No secrets** committed to the repository (`.env`, API keys, credentials)
- [ ] **Security scan output** captured as proof artifact

```bash
npm audit --production
# Expected: 0 critical, 0 high
```

### Section 7: Cross-Feature Integration

- [ ] **Navigation between features** works correctly (links from Feature A to Feature B resolve)
- [ ] **Shared state** is consistent (data updated in Feature A reflects in Feature B's views)
- [ ] **Shared components** render correctly in all contexts they appear
- [ ] **Authentication/authorization** works across all features (session persists, permissions enforced)
- [ ] **Cross-feature integration test output** captured as proof artifact

---

## Sprint/Phase Quality Report

Generate this report at the end of every phase:

```markdown
## Phase {{N}} Quality Report
**Date:** YYYY-MM-DD
**Phase Duration:** YYYY-MM-DD to YYYY-MM-DD

### Feature Summary
- Features planned: {{COUNT}}
- Features completed (gate passed): {{COUNT}}
- Features deferred: {{COUNT}}

### Test Summary
- Total tests: {{COUNT}}
- Passing: {{COUNT}}
- Failing: 0 (required for gate pass)
- Skipped: {{COUNT}} (each justified)

### Coverage Summary
- Statements: {{PCT}}% (threshold: 80%)
- Functions: {{PCT}}% (threshold: 88%)
- Branches: {{PCT}}% (threshold: 75%)
- Lines: {{PCT}}% (threshold: 80%)

### Test Debt
- Open .skip tests: {{COUNT}}
- Open .todo tests: {{COUNT}}
- Debt tickets created: {{COUNT}}

### Performance
- Lighthouse Performance: {{SCORE}} (budget: ≥ 90)
- Bundle Size: {{SIZE}} (budget: ≤ 250KB)
- API p95: {{MS}}ms (budget: ≤ 200ms)

### Security
- npm audit critical: 0
- npm audit high: 0
- Secrets scan: clean

### Cross-Feature Integration
- Navigation: PASS / FAIL
- Shared state: PASS / FAIL
- Auth persistence: PASS / FAIL

### Phase Gate Result: PASS / FAIL
**Reviewer:** {{REVIEWER_NAME}}
**Date:** YYYY-MM-DD
```

---

## Gate Result

### PASS
All sections checked. Phase {{N}} is complete. Phase {{N+1}} may begin.

### FAIL
Document every failing item. The phase remains open until all failures are resolved.

**Escalation path for stubborn failures:**
1. First attempt: fix the issue directly
2. If fix requires more than 1 day: create a ticket, assign an owner, set a deadline within the first sprint of the next phase
3. If more than 3 items fail: do not proceed. The phase has systemic quality issues that must be resolved before adding more features on top

---

## Common Phase Gate Failures

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| Regression test failures after feature integration | Features share state or API endpoints that conflict | Write cross-feature integration tests, fix the conflict before proceeding |
| Coverage dropped below threshold | New feature code has lower coverage than existing code | Add tests for the under-covered feature, do not lower the threshold |
| Performance budget exceeded | New feature added a heavy dependency or unoptimized query | Profile, optimize, or split the feature. Lazy-load heavy components. |
| npm audit high vulnerabilities | New dependency introduced a known vulnerability | Update the dependency, find an alternative, or document accepted risk with mitigation |
| Test debt > 5 items | Tests were skipped during time pressure | Allocate first sprint of next phase to debt resolution. Do not add new features until debt is cleared. |
