# Cross-Reference Checks

## What It Is

A traceability verification that ensures every planning artifact connects to every other planning artifact with no orphans and no ghosts. An orphan is a spec with no tasks generated for it — it was planned but will never get built. A ghost is a task that references a spec that does not exist — it will be built with no spec to guide it. Cross-reference checks enforce a closed loop: every feature in the project overview maps to service specs, every service spec maps to screen specs, every screen spec maps to tasks, and nothing falls through the cracks.

---

## What It Catches

- **Orphaned service specs** — A service spec was written but no screen specs reference it and no tasks were generated for it. It will sit in the planning folder forever, unbuildable.
- **Orphaned screen specs** — A screen spec exists but no task in any phase references it. The screen was designed but never assigned to a development phase.
- **Ghost tasks** — A task references "invoice-detail-screen" but no screen spec by that name exists. The developer will have to invent the screen from scratch or halt work.
- **Ghost service references** — A screen spec calls an API endpoint from a service that was never specced. The frontend developer builds a UI that calls a backend that nobody planned.
- **Feature gaps** — The project overview lists 8 features, but only 6 have service specs. Two features were described at the overview level but never decomposed.
- **Phase gaps** — Phase 3 has 40 tasks, Phase 4 has 2 tasks. The workload distribution is wildly uneven, suggesting incomplete planning for Phase 4.
- **Duplicate coverage** — Two different screen specs describe the same screen with conflicting requirements. One says the list is paginated, the other says it uses infinite scroll.

---

## When It's Required

Cross-reference checks run at three orchestrator checkpoints:

| Checkpoint | Orchestrator Step | What Gets Checked |
|------------|-------------------|-------------------|
| **Service → Feature** | Step 4.5 | Every feature in the project overview has ≥1 service spec. Every service spec maps to a feature. |
| **Screen → Service** | Step 6.5 | Every service spec has ≥1 screen spec. Every screen spec references valid service(s). |
| **Task → Screen → Service** | Step 8.5 | Every screen spec has tasks. Every task references a valid screen or service. No orphans, no ghosts. |

These are blocking checkpoints. If any cross-reference check fails, the current step's output must be corrected before proceeding.

---

## How To Run

### Step 1: Build the traceability matrix

Create a matrix that maps every artifact to its upstream and downstream connections:

```markdown
## Traceability Matrix

| Feature (Overview) | Service Spec(s) | Screen Spec(s) | Task Count | Phase(s) |
|--------------------|-----------------|----------------|------------|----------|
| User Authentication | auth-service | login-screen, register-screen, forgot-password-screen | 18 | Phase 1 |
| Trip Management | trip-service | trip-list, trip-detail, trip-create, trip-edit | 32 | Phase 2 |
| Invoicing | invoice-service | invoice-list, invoice-detail, invoice-create | 24 | Phase 3 |
| Driver Management | driver-service | — | 0 | — |
| Reporting | — | — | — | — |
```

### Step 2: Scan for orphans (specs with no downstream)

Check each column for entries with no downstream connection:

- **Feature with no service spec** → Feature gap. The feature was described but never decomposed.
- **Service spec with no screen specs** → Either this is a backend-only service (valid if documented) or screens were never created (planning gap).
- **Screen spec with no tasks** → The screen was designed but never assigned to a development phase.

Flag every orphan:

```markdown
## Orphan Report
| Artifact | Type | Issue | Resolution |
|----------|------|-------|------------|
| driver-service | Service Spec | No screen specs reference this service | Create screen specs OR document as backend-only |
| Reporting | Feature | No service spec exists | Write service spec OR remove from project overview |
```

### Step 3: Scan for ghosts (references to non-existent artifacts)

Search every task list and screen spec for references to artifacts that do not exist:

- **Task references non-existent screen spec** → Ghost reference. The task cannot be built.
- **Screen spec references non-existent service/API** → Ghost dependency. The frontend has no backend.
- **Task references non-existent service** → Ghost dependency.

```markdown
## Ghost Report
| Referencing Artifact | Ghost Reference | Type | Resolution |
|---------------------|-----------------|------|------------|
| task-P2-014 | payment-screen | Screen spec does not exist | Create payment-screen spec OR reassign task |
| billing-list-screen | billing-service.getInvoices | Service endpoint not specced | Add endpoint to billing-service spec |
```

### Step 4: Check phase distribution

Verify that tasks are reasonably distributed across phases:

```markdown
## Phase Distribution
| Phase | Task Count | Services Covered | Screens Covered | % of Total |
|-------|-----------|------------------|-----------------|------------|
| Phase 1 | 18 | 1 | 3 | 19% |
| Phase 2 | 32 | 1 | 4 | 34% |
| Phase 3 | 24 | 1 | 3 | 26% |
| Phase 4 | 2 | 1 | 0 | 2% |
| Unassigned | 18 | 2 | 2 | 19% |
```

Red flags:
- Any phase with <10% of total tasks (suspiciously light — likely incomplete)
- "Unassigned" category has any entries (tasks exist but aren't in a phase)
- A phase covers 0 screens (all backend? Or missing screen-level tasks?)

### Step 5: Check for duplicates

Scan for screen specs or service specs that describe overlapping functionality:

- Two screen specs for the same URL route
- Two service specs managing the same entity
- Tasks in different phases that describe the same work

### Step 6: Generate the cross-reference report

```markdown
## Cross-Reference Check Report
**Date:** YYYY-MM-DD
**Checkpoint:** [Step 4.5 / Step 6.5 / Step 8.5]

### Summary
- Features in overview: X
- Service specs: X (expected: X)
- Screen specs: X (expected: X)
- Tasks: X across Y phases
- **Orphans found:** X
- **Ghosts found:** X
- **Duplicates found:** X

### Status: PASS / FAIL
[If FAIL, list every issue with required resolution]
```

---

## Checklist

### Step 4.5 (Feature → Service)
- [ ] Every feature in the project overview has ≥1 service spec
- [ ] Every service spec maps back to a feature in the overview
- [ ] No duplicate service specs for the same domain
- [ ] Backend-only services (no UI) are explicitly documented as such
- [ ] All service-to-service dependencies reference existing service specs

### Step 6.5 (Service → Screen)
- [ ] Every service spec has ≥1 screen spec (unless documented as backend-only)
- [ ] Every screen spec references at least one service's API endpoints
- [ ] All API endpoints referenced in screen specs exist in the corresponding service spec
- [ ] No duplicate screen specs for the same route/page
- [ ] Screen specs cover all CRUD operations that the service supports

### Step 8.5 (Full Chain: Feature → Service → Screen → Task)
- [ ] Every screen spec has ≥1 task generated for it
- [ ] Every task references a valid screen spec or service spec
- [ ] All tasks are assigned to a development phase
- [ ] Phase distribution has no suspiciously empty or light phases
- [ ] Task count per feature follows the 6-8 layer depth rule (DB, API, UI, tests, quality, docs)
- [ ] No ghost references in any task
- [ ] Zero orphans remaining (all were resolved or documented as intentional)

---

## Common Failures

### 1. The "We'll Get to It" Orphan
A service spec for "Reporting" was written in Step 4, but by Step 8, no screen specs or tasks exist for it. It was mentally filed under "Phase 5" — but Phase 5 was never defined. The service will never get built unless someone notices it is missing from all phase plans. The cross-reference check catches this the moment it happens.

### 2. The Renamed Ghost
A screen spec was originally called `driver-list-screen`. During a reorganization, it was renamed to `drivers-list-screen` (plural). Three tasks still reference `driver-list-screen` (singular). They are now ghost references pointing at nothing. This is especially common when AI agents rename files — they update the file but not all references to it.

### 3. The Missing API Layer
The screen spec for `invoice-create` describes a form that calls `POST /api/invoices` with a specific schema. But the `invoice-service` spec only defines `GET /api/invoices` (list) and `GET /api/invoices/:id` (detail). The create endpoint was never specced. The frontend developer will discover this gap during implementation, not during planning.

### 4. The Phantom Phase
Phase 4 has 2 tasks: "Final polish" and "Deploy." This is not a real phase — it is a placeholder. The cross-reference check flags it because: no screens are covered, no services are covered, and the task count is far below the project average per phase.

### 5. The Duplicate Spec
Two developers (or two AI sessions) independently specced a "notifications" service. One is called `notification-service`, the other `alerts-service`. They describe overlapping functionality with conflicting field names and API shapes. Tasks reference both, creating inconsistent implementation guidance.

---

## Proof Artifact

| Artifact | What It Proves |
|----------|---------------|
| **Completed traceability matrix** | Every artifact was mapped to its upstream and downstream connections |
| **Orphan report (zero orphans or all resolved)** | No specs were left disconnected from the task chain |
| **Ghost report (zero ghosts)** | No tasks or specs reference non-existent artifacts |
| **Phase distribution table** | Tasks are reasonably spread across phases |
| **Cross-reference report with PASS status** | The full chain Feature → Service → Screen → Task is intact |

A passing cross-reference check means the traceability matrix is complete with zero orphans and zero ghosts. Every artifact has a clear path from feature description through to development tasks.
