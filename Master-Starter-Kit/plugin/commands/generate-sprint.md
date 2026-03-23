---
name: generate-sprint
description: Generate a sprint plan with 5-layer breakdown (Verify→Secure→Build→Wire→Test)
allowed_tools:
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
  - TodoWrite
---

# /generate-sprint — Sprint Plan Generator

Create a structured sprint plan using the 5-layer service breakdown methodology.

## Usage

```
/generate-sprint
```

The command will ask which services/features to include in the sprint.

## Steps

### Step 1: Gather Sprint Context

Ask the user:
1. Sprint number/name
2. Sprint duration (default: 2 weeks)
3. Which services/modules to include
4. Any carry-over tasks from previous sprint

### Step 2: Read Current State

For each service in the sprint:
- Read the service hub file for current status
- Read any existing PST reports for known issues
- Check STATUS.md for in-progress or blocked tasks

### Step 3: Generate 5-Layer Breakdown

For each service, create tasks across all 5 layers:

**Layer 1 — Verify (VER):**
- Confirm what exists vs what's planned
- Run `/verify-hub` if hub accuracy is uncertain
- Identify gaps between hub and code

**Layer 2 — Secure (SEC):**
- Auth guard on all endpoints
- Input validation DTOs/schemas
- Tenant isolation in queries
- Rate limiting configuration

**Layer 3 — Build (BLD):**
- Core CRUD operations
- Business logic implementation
- Data model migrations
- UI components and pages

**Layer 4 — Wire (WIR):**
- API integration (frontend ↔ backend)
- Cross-service calls
- Real-time connections (WebSocket/SSE)
- State management hooks

**Layer 5 — Test (TST):**
- Unit tests for services/utils
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test data/fixtures

### Step 4: Estimate and Prioritize

For each task:
- Assign effort estimate (S/M/L/XL)
- Set priority (P0/P1/P2)
- Identify dependencies between tasks
- Flag any blocked tasks

### Step 5: Write Sprint Plan

Use the template from `${CLAUDE_PLUGIN_ROOT}/../04-phase-planning/5-LAYER-BREAKDOWN.md` to generate:

```markdown
# Sprint {number}: {name}
Duration: {start} → {end}

## Services in Scope
| Service | Current Score | Target Score | Tasks |
|---------|--------------|-------------|-------|

## Task Breakdown by Layer
### Service: {name}
| # | Layer | Task | Effort | Priority | Deps |
|---|-------|------|--------|----------|------|
| 1 | VER   | ... | S      | P0       | —    |
| 2 | SEC   | ... | M      | P0       | 1    |

## Exit Criteria
- [ ] All P0 tasks complete
- [ ] Tests passing
- [ ] Build succeeds
- [ ] Hub files updated
```

Write to the project's sprint planning directory.

### Step 6: Propagate to Trackers

After writing the sprint plan, update all tracking files per the Plan Change Protocol:

1. **STATUS.md** — Update sprint assignments for tasks included in this sprint
2. **master-tracker.md** (if exists) — Update sprint column for affected subtasks
3. **timeline.md** (if exists) — Assign sprint tasks to their scheduled weeks
4. **handoff.md** — Note the sprint plan under "Key Decisions"
5. **DEVLOG.md** — Append plan change entry: `### [TIMESTAMP] PLAN CHANGE: Generated Sprint {number}`

Reference: `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`
