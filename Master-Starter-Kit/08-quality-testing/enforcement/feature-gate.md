# Feature-Level Verification Gate

The checkpoint that must be passed before ANY feature can be marked "done." No exceptions, no partial passes. If a single item on this checklist fails, the feature remains open.

---

## When This Gate Applies

Every feature, every time. There are no "small features" or "quick fixes" that skip the gate. The gate scales with feature complexity — a simple feature has fewer required test types on its card — but the gate process itself is always the same.

---

## Prerequisites

Before running the Feature Gate, ensure:
- [ ] The feature has a completed [Test Requirements Card](./test-requirements-card.template.md)
- [ ] Development work for the feature is complete (all code written, no pending TODOs in code)
- [ ] The developer believes the feature is ready (this is not a mid-development checkpoint)

---

## Feature Gate Checklist

### Section 1: Test Requirements Card

- [ ] **Test Requirements Card exists** for this feature
- [ ] **All characteristics (C1-C15)** reviewed and accurately checked
- [ ] **All required test types** identified based on the selection matrix
- [ ] **Every required test type** has status **"Passing"** or **"Skipped with justification"**
- [ ] **No required test type** has status "Not Started" or "In Progress"

### Section 2: Proof Artifacts

- [ ] **Every test type with status "Passing"** has a proof artifact link on the card
- [ ] **Every proof artifact** meets the acceptance criteria defined in [proof-artifacts.md](./proof-artifacts.md)
- [ ] **No proof artifact** is older than the latest code commit for this feature
- [ ] **Proof artifacts are stored** in the repository or CI (not only on a local machine)

### Section 3: Skipped Test Justification

- [ ] **Every test type with status "Skipped"** has a documented justification on the card
- [ ] **No non-skippable test type is skipped** (Type Checking and Linting are never skippable; Security is never skippable for C6/C7 features; E2E is never skippable for C14 features)
- [ ] **Every skip justification** has been approved by a reviewer (not self-approved)

### Section 4: Quality Gates (8-Step /verify Sequence)

The [quality gates](../quality-gates.md) must all pass. This is the existing 8-step verification — the Feature Gate requires proof that each step was actually run.

- [ ] **Gate 1: Pre-flight** — `/feature-checklist` passes (all 5 layers exist)
- [ ] **Gate 2: TypeScript** — `pnpm typecheck` output shows 0 errors
- [ ] **Gate 3: Unit Tests** — `pnpm test` output shows 0 failures, 0 skipped
- [ ] **Gate 4: Lint** — `pnpm lint` output shows 0 errors
- [ ] **Gate 5: Build** — `pnpm build` completes without errors
- [ ] **Gate 6: Design Compliance** — `/design-verify` shows 0 violations
- [ ] **Gate 7: Visual Verification** — Screenshots at desktop and mobile for every page
- [ ] **Gate 8: State Verification** — All 4 states verified (loading, error, empty, data)

### Section 5: Code Quality

- [ ] **No `.todo` markers** in committed test files without documented justification
- [ ] **No `.skip` markers** in committed test files without documented justification
- [ ] **No `@ts-ignore`** or `@ts-expect-error` without inline comment explaining why
- [ ] **No `eslint-disable`** without inline comment explaining why
- [ ] **No `any` type usage** without inline comment explaining why
- [ ] **No `console.log`** statements in production code (use proper logging)

### Section 6: Hub File Update

- [ ] **Hub file updated** with current quality score
- [ ] **Endpoint count** accurate
- [ ] **Component count** accurate
- [ ] **Screen status** updated to "Complete"
- [ ] **Test count** reflects actual tests written

---

## Gate Result

### PASS

All sections checked. The feature is **DONE**. Update the feature status to "Complete" in STATUS.md.

```markdown
## Feature Gate: {{FEATURE_NAME}}
**Date:** YYYY-MM-DD
**Result:** PASS
**Test Requirements Card:** [link]
**Quality Gates:** 8/8 passed
**Proof Artifacts:** X/X collected
**Reviewer:** {{REVIEWER_NAME}}
```

### FAIL

One or more items unchecked. The feature remains **OPEN**. Document what failed and what is needed to pass.

```markdown
## Feature Gate: {{FEATURE_NAME}}
**Date:** YYYY-MM-DD
**Result:** FAIL
**Failed Items:**
- Section 2: Proof artifact for E2E tests is from commit abc123, but latest commit is def456
- Section 4: Gate 7 screenshots missing for mobile viewport
- Section 5: 2 `.skip` markers in test files without justification
**Required Actions:**
1. Re-run E2E tests on latest commit, capture new proof artifact
2. Capture mobile screenshots for trip-list and trip-detail pages
3. Either remove .skip markers and implement tests, or add justification comments
**Re-Gate Date:** YYYY-MM-DD
```

---

## Integration with Feature Completion Checklist

The Feature Gate adds a **Testing Enforcement** layer to the existing [Feature Completion Checklist](../feature-completion-checklist.md). Specifically:

| Existing Layer | What It Already Checks | What the Feature Gate Adds |
|----------------|----------------------|---------------------------|
| Layer 1: Database | Schema, seed, migration exist | — (no change) |
| Layer 2: API | Router, validators, unit tests exist | Proof artifact for unit test output |
| Layer 3: UI | Pages, components, all 4 states | Screenshots as proof of state verification |
| Layer 4: Testing | E2E and unit test files exist | Proof artifacts for every required test type, not just existence of test files |
| Layer 5: Quality | Typecheck, lint, build pass | Console output captured as proof |
| **NEW: Layer 4.5: Enforcement** | — | Test Requirements Card complete, all proof artifacts collected, no unapproved skips |

The Feature Completion Checklist verifies that quality infrastructure **exists**. The Feature Gate verifies that it **was actually run and produced evidence**.

---

## Common Gate Failures and Fixes

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| "Proof artifact outdated" | Code changed after tests were run | Re-run tests on the final commit, capture fresh artifacts |
| "Missing proof for required test type" | Test was written but output was not captured | Re-run with output capture (`--reporter=json`, `> output.log`) |
| "Skipped test without justification" | Developer marked test as skipped to save time | Either implement the test or write a genuine justification with reviewer approval |
| "Gate 7 screenshots incomplete" | Only captured desktop, forgot mobile | Capture at 375px and 1440px for every page in the feature |
| ".skip markers in test files" | Tests were skipped during development and never re-enabled | Remove `.skip`, implement the test, verify it passes |
| "Hub file not updated" | Forgot to update after completing the feature | Update hub file with accurate counts and quality score |
