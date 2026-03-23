# Coverage Matrix Validation

## What It Is

A structural verification that every planned feature has complete task breakdown across all required layers, every development phase has adequate task coverage, and no gaps exist between what was specced and what was scheduled. Coverage matrix validation answers one question: if a developer followed the task list exactly, would every specced feature get fully built? If the answer is anything other than an unqualified "yes," the matrix has gaps.

---

## What It Catches

- **Phase gaps** — Phase 2 has 40 tasks, Phase 4 has 3. Something was planned incompletely.
- **Layer gaps** — A feature has API tasks and UI tasks but zero test tasks and zero database tasks. Two entire layers are missing.
- **Missing task depth** — A feature has 3 tasks total when the 6-8 layer standard requires 12-16 tasks minimum. The breakdown is too shallow to guide implementation.
- **Orphaned tasks** — Tasks that exist in the task list but are not assigned to any phase. They will never be scheduled.
- **Unassigned screens** — Screen specs exist but no tasks reference them. The screens will not be built.
- **Lopsided phase loading** — One phase has 60% of all tasks. The project timeline assumes even distribution, but the workload is front-loaded or back-loaded.
- **Missing cross-cutting tasks** — No tasks exist for authentication integration, error handling setup, CI/CD configuration, or other infrastructure that spans features.

---

## When It's Required

Coverage matrix validation runs after task generation is complete (Step 8) and again after any task reorganization or phase restructuring.

| Checkpoint | When | What Gets Validated |
|------------|------|-------------------|
| Post-task generation | Step 8.5 | Full coverage matrix built and validated for the first time |
| Post-phase restructuring | Any time phases are modified | Matrix re-validated to ensure changes did not create gaps |
| Pre-development kickoff | Before Phase 1 begins | Final validation that the plan is implementation-ready |

---

## How To Run

### Step 1: Build the coverage matrix

Create a matrix with features/services as rows and task layers as columns:

```markdown
## Coverage Matrix

| Feature / Service | DB Tasks | API Tasks | UI Tasks | Test Tasks | Quality Tasks | Doc Tasks | Total | Status |
|-------------------|----------|-----------|----------|------------|---------------|-----------|-------|--------|
| User Auth | 3 | 4 | 5 | 4 | 2 | 1 | 19 | OK |
| Trip Management | 4 | 6 | 8 | 5 | 2 | 1 | 26 | OK |
| Invoicing | 2 | 3 | 4 | 0 | 0 | 0 | 9 | GAP — no test/quality/doc tasks |
| Driver Management | 0 | 0 | 0 | 0 | 0 | 0 | 0 | GAP — no tasks at all |
| Reporting | 1 | 2 | 3 | 1 | 1 | 0 | 8 | WARN — below minimum depth |
```

### Step 2: Validate layer depth per feature

Every feature should have tasks across all 6 layers. The minimum depth rule: **6-8 tasks per feature at minimum**, distributed across layers:

| Layer | Minimum Tasks | What These Tasks Cover |
|-------|--------------|----------------------|
| Database | 1-2 | Schema creation, seed data, migrations |
| API | 2-4 | CRUD endpoints, business logic, validation |
| UI | 3-6 | Pages, components, forms, states |
| Testing | 2-4 | Unit tests, E2E tests, integration tests |
| Quality | 1-2 | Type checking, lint fixes, design compliance |
| Documentation | 1 | User docs, API docs, changelog |

**Red flags per feature:**
- Any layer with 0 tasks → **GAP** — layer completely missing
- Total tasks < 6 → **SHALLOW** — insufficient breakdown for reliable implementation
- Test tasks < 2 → **RISK** — testing will be ad-hoc or skipped
- Quality tasks = 0 → **RISK** — no explicit quality verification step

### Step 3: Validate phase distribution

Map all tasks to their assigned phases and check distribution:

```markdown
## Phase Distribution

| Phase | Task Count | % of Total | Features Covered | Screens Covered | Est. Duration |
|-------|-----------|------------|------------------|-----------------|---------------|
| Phase 1: Foundation | 22 | 25% | Auth, Setup | 4 | 2 weeks |
| Phase 2: Core | 38 | 43% | Trips, Drivers | 8 | 3 weeks |
| Phase 3: Revenue | 24 | 27% | Invoicing, Billing | 5 | 2 weeks |
| Phase 4: Polish | 4 | 5% | Reporting | 1 | 1 week |
| Unassigned | 0 | 0% | — | — | — |
| **Total** | **88** | **100%** | **6 features** | **18 screens** | **8 weeks** |
```

**Distribution rules:**
- No phase should have < 10% of total tasks (unless it is genuinely a small wrap-up phase with documented justification)
- No phase should have > 50% of total tasks (split it into sub-phases)
- "Unassigned" must be 0 — every task belongs to a phase
- Every phase must cover at least 1 complete feature (not half of feature A and half of feature B spread across phases with no phase completing anything)

### Step 4: Validate screen coverage

Every screen spec must have corresponding tasks:

```markdown
## Screen Coverage

| Screen Spec | Has DB Tasks | Has API Tasks | Has UI Tasks | Has Test Tasks | Total Tasks | Status |
|-------------|-------------|---------------|-------------|----------------|-------------|--------|
| login-screen | N/A | ✓ (2) | ✓ (3) | ✓ (2) | 7 | OK |
| trip-list-screen | ✓ (1) | ✓ (2) | ✓ (3) | ✓ (2) | 8 | OK |
| trip-detail-screen | ✓ (1) | ✓ (1) | ✓ (2) | ✓ (1) | 5 | WARN — light |
| invoice-create-screen | ✓ (1) | ✓ (2) | ✓ (2) | ✗ (0) | 5 | GAP — no test tasks |
| driver-profile-screen | ✗ (0) | ✗ (0) | ✗ (0) | ✗ (0) | 0 | GAP — zero tasks |
```

### Step 5: Check for missing cross-cutting tasks

Features have their own tasks, but some work spans all features. Verify these exist:

- [ ] Project scaffolding / monorepo setup tasks
- [ ] Authentication/authorization integration (applied across all protected routes)
- [ ] Error handling infrastructure (error boundary, toast system, error logging)
- [ ] CI/CD pipeline setup (build, test, deploy)
- [ ] Design system setup (tokens, base components)
- [ ] Database migration strategy (how migrations are applied)
- [ ] Monitoring/logging setup
- [ ] Environment configuration (dev, staging, production)

### Step 6: Generate the completeness dashboard

```markdown
## Coverage Matrix Validation Report
**Date:** YYYY-MM-DD
**Total features:** X | **Total screens:** X | **Total tasks:** X

### Feature Coverage
- Features with full layer coverage: X / Y
- Features with gaps: X (list them)
- Features with zero tasks: X (critical — list them)

### Phase Coverage
- Phases with adequate distribution: X / Y
- Unassigned tasks: X (must be 0)
- Lopsided phases: X (list them with % skew)

### Screen Coverage
- Screens with full task coverage: X / Y
- Screens with gaps: X (list them)
- Screens with zero tasks: X (critical — list them)

### Cross-Cutting Coverage
- Cross-cutting task categories present: X / 8
- Missing categories: (list them)

### Overall Status: PASS / FAIL
[If FAIL, enumerate every gap with required action]
```

---

## Checklist

### Feature-Level Coverage
- [ ] Every specced feature has tasks in all 6 layers (DB, API, UI, Test, Quality, Doc)
- [ ] Every feature has ≥ 6 total tasks (minimum depth)
- [ ] No feature has 0 tasks (orphaned feature)
- [ ] Test layer has ≥ 2 tasks per feature
- [ ] Quality layer has ≥ 1 task per feature

### Phase-Level Coverage
- [ ] All tasks are assigned to a phase (zero unassigned)
- [ ] No phase has < 10% of total tasks without documented justification
- [ ] No phase has > 50% of total tasks
- [ ] Each phase completes at least one feature end-to-end
- [ ] Phase ordering respects dependencies (auth before features that need auth)

### Screen-Level Coverage
- [ ] Every screen spec has corresponding tasks
- [ ] Every screen with forms has API tasks for the submission endpoint
- [ ] Every screen has at least 1 test task
- [ ] No screen spec is orphaned (zero tasks)

### Cross-Cutting Coverage
- [ ] Project setup / scaffolding tasks exist
- [ ] Auth integration tasks exist (if applicable)
- [ ] Error handling infrastructure tasks exist
- [ ] CI/CD tasks exist
- [ ] Design system setup tasks exist

---

## Common Failures

### 1. The "Testing Is Phase 5" Anti-Pattern
All test tasks are pushed to the final phase. Phases 1-4 have zero test tasks. This means testing happens weeks after the code was written, bugs compound across features, and the "testing phase" invariably gets cut when the deadline approaches. Fix: every feature's test tasks must be in the same phase as the feature's implementation tasks.

### 2. The Forgot-About-Infrastructure Gap
The matrix has beautiful coverage for all 6 features: database tasks, API tasks, UI tasks, tests. But there are no tasks for project setup, CI/CD, error handling infrastructure, or design system configuration. The first developer to start Phase 1 discovers that there is no monorepo structure, no test configuration, and no deployment pipeline. Fix: add a "Phase 0: Infrastructure" or include infra tasks in Phase 1.

### 3. The 3-Task Feature
A complex feature (e.g., "Trip Management" with 4 screens, 6 API endpoints, and 8 business rules) has only 3 tasks: "Create trip service," "Build trip screens," "Test trips." These are epics, not tasks. A developer cannot estimate, track, or verify work at this granularity. Fix: decompose until each task is a single implementable unit (one endpoint, one screen, one test suite).

### 4. The Orphaned Screen After Reorganization
During task reorganization, the `driver-profile-screen` was accidentally dropped from Phase 3. The screen spec still exists, but no task references it. Without the coverage matrix check, this would only be discovered when someone asks "where is the driver profile?" during Phase 3 development.

### 5. The Documentation Desert
Every feature has DB, API, UI, and test tasks. Zero features have documentation tasks. User docs, API docs, and changelog entries will either be skipped entirely or written in a rush at the end. Fix: add at least 1 documentation task per feature.

---

## Proof Artifact

| Artifact | What It Proves |
|----------|---------------|
| **Completed coverage matrix** (feature × layer) | Every feature was checked for layer completeness |
| **Phase distribution table** | Task load was evaluated across all phases |
| **Screen coverage table** | Every screen spec was checked for corresponding tasks |
| **Cross-cutting checklist** | Infrastructure and shared concerns were not forgotten |
| **Completeness dashboard with PASS status** | All gaps were identified and resolved |

The coverage matrix itself is the primary proof artifact. It must show every feature, every layer, and every phase — with zero gaps and zero orphans in the final version. If the first version had gaps (it usually does), the proof includes both the initial matrix (showing gaps found) and the final matrix (showing gaps resolved).
