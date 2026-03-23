# Definition of Ready

> **Purpose:** Checklist for determining if a task is ready to start development in {{PROJECT_NAME}}.
> A task that does not meet Definition of Ready should not be picked up in a sprint. Pulling unready tasks is the #1 cause of mid-sprint churn.

---

## Why This Exists

Without a Definition of Ready, developers start tasks that are vaguely defined, lack context, or depend on unfinished work. This causes:

- Context-switching to ask clarifying questions
- Rework when assumptions turn out to be wrong
- Blocked work when dependencies surface mid-sprint
- Scope creep when "the task" expands because it was never properly bounded

**Rule:** A task enters a sprint ONLY when ALL applicable checklist items are satisfied.

---

## Universal Checklist (All Tasks)

Every task, regardless of type, must satisfy these items before it is considered "ready."

| # | Criterion | Verification | Required? |
|---|-----------|-------------|-----------|
| 1 | **Context files listed** | Task file header lists specific file paths the developer must read before starting (not generic "read the spec" — exact paths and section numbers) | Yes |
| 2 | **Acceptance criteria defined** | ≥5 independently testable criteria. Each uses the format: "When [action], then [observable result]" | Yes |
| 3 | **File plan exists** | Every file to be created or modified is listed with its exact path. No "create the component" — must be `{{FRONTEND_SRC}}/components/LoadCard.tsx` | Yes |
| 4 | **Subtasks defined** | ≥4 discrete implementation steps, each completable in 1-2 hours | Yes |
| 5 | **Test plan exists** | Specifies which test types apply (unit, integration, E2E) and what scenarios to cover | Yes |
| 6 | **Dependencies resolved** | All blocking task IDs are marked DONE in STATUS.md. No "should be done soon" — must be verified complete | Yes |
| 7 | **Effort estimated** | Size assigned: S (1-2h), M (2-4h), L (4-8h), XL (8-16h). If XL, consider splitting | Yes |
| 8 | **No open questions** | All ambiguities resolved. If a question was asked in the task file, the answer is recorded there | Yes |

---

## Frontend Task Checklist (Additional)

These items apply in addition to the universal checklist for any task that involves UI work.

| # | Criterion | Verification | Required? |
|---|-----------|-------------|-----------|
| F1 | **Design exists** | Figma/design link provided, OR screen spec describes layout in sufficient detail to implement without guessing | Yes |
| F2 | **API contract exists** | Every API call the screen makes is documented with request/response shapes. Backend endpoint exists or is being built in a parallel/prior task | Yes |
| F3 | **Component inventory** | Screen spec lists which existing components to reuse and which new ones to create | Yes |
| F4 | **States documented** | All UI states defined: loading, error, empty, populated, plus context-specific states | Yes |
| F5 | **Responsive requirements** | Breakpoints and layout changes specified for mobile/tablet/desktop | Yes |
| F6 | **Test data available** | Seed data or mock data exists to render all states. Developer can see the screen in every state locally | Yes |

---

## Backend Task Checklist (Additional)

These items apply in addition to the universal checklist for any task that involves API/service work.

| # | Criterion | Verification | Required? |
|---|-----------|-------------|-----------|
| B1 | **API contract defined** | Method, path, auth, request DTO, response shape, error codes all specified | Yes |
| B2 | **Data model finalized** | Entity fields, types, relations, and constraints defined in service spec or database docs | Yes |
| B3 | **Business rules listed** | Every rule the code must enforce is documented with specific constraints (not "validate appropriately") | Yes |
| B4 | **Error codes assigned** | Each error scenario has a code from the error catalog with user message and recovery action | Yes |
| B5 | **Permission keys assigned** | Each endpoint has its permission key from the permission catalog | Yes |
| B6 | **Test data available** | Seed data or fixtures exist for the entities this task operates on | Yes |

---

## Infrastructure / DevOps Task Checklist (Additional)

| # | Criterion | Verification | Required? |
|---|-----------|-------------|-----------|
| I1 | **Environment specified** | Which environment(s) this change targets (dev, staging, production) | Yes |
| I2 | **Rollback plan defined** | How to revert the change if something goes wrong | Yes |
| I3 | **Impact radius documented** | Which services/features are affected by this infrastructure change | Yes |
| I4 | **Monitoring configured** | What to watch after the change is deployed (metrics, alerts, logs) | Yes |

---

## Readiness Gate Process

### Who Checks Readiness

| Role | Responsibility |
|------|---------------|
| **Task author** (usually the planner/AI agent) | Fills in all checklist items during task creation |
| **Sprint planner** (tech lead or scrum master) | Verifies readiness during sprint planning. Rejects tasks that fail the checklist |
| **Developer** (assignee) | Final check before starting. Raises blockers immediately if something is missing |

### What Happens When a Task Fails Readiness

| Failure | Action | Who |
|---------|--------|-----|
| Missing context files | Add specific file paths to the task header | Task author |
| Missing acceptance criteria | Write testable criteria before the task enters the sprint | Task author + product owner |
| Missing file plan | Specify exact paths for all files to create/modify | Task author |
| Missing design (frontend) | Create design or detailed screen spec before pulling the task | Designer / planner |
| Missing API contract (frontend) | Backend task must be completed or contract documented first | Backend developer / planner |
| Unresolved dependencies | Wait for blocking tasks to complete, or re-sequence the sprint | Sprint planner |
| Open questions | Answer the questions and record answers in the task file | Product owner / tech lead |

### Readiness Score

For sprint planning, score each task:

| Score | Meaning | Action |
|-------|---------|--------|
| **Ready** (all items pass) | Can be pulled into the sprint | Assign and begin |
| **Almost Ready** (1-2 minor items missing) | Can enter sprint if items are resolved within 24 hours | Assign with condition |
| **Not Ready** (3+ items missing or any critical item missing) | Cannot enter sprint | Return to backlog, fix before next planning |

---

## Anti-Patterns

| Anti-Pattern | Why It's Harmful | Fix |
|-------------|-----------------|-----|
| "We'll figure it out during implementation" | Leads to rework, blocked work, scope creep | Resolve before sprint start |
| Task says "Read the spec" without specific sections | Developer reads entire spec, misses the relevant part | Link to exact sections: "Read service-spec.md sections 4-6" |
| Acceptance criteria: "It works correctly" | Not testable, not verifiable | Write: "Submitting with empty name shows 'Name is required' error" |
| File plan: "Create the necessary files" | Developer guesses wrong file structure | List every file with its full path |
| Effort estimate missing | Sprint capacity planning is impossible | Estimate before pulling into sprint |
| "Design will be provided" | Developer starts, waits for design, context-switches | Design must exist BEFORE the task is ready |

---

## Completeness Checklist

- [ ] All team members understand the Definition of Ready
- [ ] Sprint planning includes a readiness review for every task
- [ ] Tasks rejected for readiness are fixed and re-reviewed, not just pulled in anyway
- [ ] Readiness failures are tracked to improve planning quality over time
- [ ] Checklist items are enforced, not aspirational
