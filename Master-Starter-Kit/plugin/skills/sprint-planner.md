---
name: sprint-planner
description: Plan a sprint using the 5-layer breakdown methodology (Verify→Secure→Build→Wire→Test). Creates structured task lists with effort estimates and dependencies.
---

# Sprint Planner

Plan a sprint using the 5-layer service breakdown methodology.

## Protocol

### 1. Gather Context

Read:
- STATUS.md for current phase and progress
- The master project plan (if exists) for sprint roadmap
- Service hub files for modules in scope

### 2. Determine Sprint Scope

Identify which services/modules to include based on:
- Phase roadmap priorities
- Carry-over tasks from previous sprint
- Blocker resolution needs
- User input on priorities

### 3. Apply 5-Layer Breakdown

For each service in the sprint, generate tasks across all 5 layers:

| Layer | Prefix | Focus | Typical Tasks |
|-------|--------|-------|---------------|
| Verify | VER | Confirm existing state | Hub verification, endpoint testing, gap analysis |
| Secure | SEC | Security hardening | Auth guards, input validation, tenant isolation |
| Build | BLD | Core functionality | CRUD, business logic, data models, UI |
| Wire | WIR | Integration | API calls, WebSocket, cross-service, state management |
| Test | TST | Quality assurance | Unit, integration, E2E tests |

### 4. Estimate and Sequence

For each task:
- **Effort:** S (< 1h), M (1-4h), L (4-8h), XL (8h+)
- **Priority:** P0 (must-do), P1 (should-do), P2 (nice-to-have)
- **Dependencies:** Which tasks must complete first
- **Layer order:** VER → SEC → BLD → WIR → TST (but can overlap)

### 5. Calculate Sprint Capacity

```
Available days × Hours per day × Team size = Total capacity
Total capacity - Buffer (20%) = Usable capacity
Sum of task estimates ≤ Usable capacity
```

If over capacity, move P2 tasks to backlog and flag P1 tasks at risk.

### 6. Write Sprint Plan

Output format:

```markdown
# Sprint {ID}: {Name}
Duration: {start_date} → {end_date}
Capacity: {usable_hours}h | Estimated: {total_hours}h

## Services in Scope
| Service | Hub Score | Target | Key Deliverable |
|---------|----------|--------|-----------------|

## Task Breakdown
| # | Layer | Service | Task | Effort | Priority | Deps | Assignee |
|---|-------|---------|------|--------|----------|------|----------|

## Exit Criteria
- [ ] All P0 tasks complete
- [ ] Tests passing: `{test_command}`
- [ ] Build succeeds: `{build_command}`
- [ ] Hub files updated for all modified services
- [ ] No STOP-SHIP security findings open
- [ ] handoff.md updated for next sprint

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|

## Backlog (Deferred)
| Task | Reason | Target Sprint |
|------|--------|---------------|
```

## Rules

- **Verify before Build** — always confirm what exists before building new
- **Secure before Wire** — lock down endpoints before connecting them to frontend
- **Test after each layer** — don't batch all testing to the end
- **20% buffer** — sprints always take longer than estimated
- **P0 tasks only in first sprint** — establish momentum before expanding scope
