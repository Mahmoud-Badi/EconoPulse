# Phase Generator

**Purpose:** Read tribunal deliverables and audit reports, then generate a phased
task breakdown with task files and a STATUS.md dashboard.

**Output:** Task files in `dev_docs/tasks/` + `dev_docs/STATUS.md`

---

## When to Run

Run this generator after completing:
1. The Tribunal process (executive summary, roadmap, implementation specs)
2. Codebase audits (per-service audit reports with bug inventories)

---

## Inputs Required

Before running this prompt, gather these files:

| Input | Location | What it provides |
|-------|----------|-----------------|
| Tribunal Executive Summary | `{{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md` | Project vision, scope, MVP definition |
| Tribunal Roadmap | `{{TRIBUNAL_OUTPUT_PATH}}/roadmap.md` | Feature priorities (MoSCoW), milestones |
| Tribunal Implementation Specs | `{{TRIBUNAL_OUTPUT_PATH}}/implementation-specs/` | Detailed specs per feature |
| Audit Reports | `dev_docs/audit/` | Bug inventories, quality grades, recommendations |
| Service Hub Files | `dev_docs/services/` | Current implementation status per service |

---

## Phase Definitions

### Phase 0: Foundation & Bug Fixes
- **All P0 (Critical) bugs** from audit reports -- these block other work
- **All P1 (High) bugs** from audit reports -- these degrade quality
- Infrastructure tasks: CI/CD, testing setup, design tokens, shared utilities
- **No new features** -- only fixes and foundations

### Phase 1: Core MVP (MoSCoW "Must Have")
- Features rated "Must Have" in the tribunal roadmap
- Core screens and workflows that define the MVP
- API integrations for must-have features
- **Ship when Phase 1 is complete** -- this is your MVP

### Phase 2: Enhanced Features (MoSCoW "Should Have")
- Features rated "Should Have" in the tribunal roadmap
- Quality-of-life improvements
- Advanced screens (dashboards, analytics, bulk operations)
- Performance optimizations

---

## Task File Format

Generate each task as a separate markdown file in `dev_docs/tasks/`:

```markdown
# {TASK-ID}: {Task Title}

## Metadata
- **Phase:** {0 | 1 | 2}
- **Priority:** {P0 | P1 | P2 | P3}
- **Effort:** {S | M | L | XL}
  - S = < 2 hours
  - M = 2-4 hours
  - L = 4-8 hours
  - XL = 8-16 hours
- **Service:** {service-name}
- **Assignee:** {unassigned | claude-code | codex | gemini}
- **Status:** {planned | in-progress | done | blocked}
- **Dependencies:** {TASK-ID, TASK-ID, ...} or "none"

## Context Header
Before starting, read (max 6 files):
1. CLAUDE.md (or project AI config)
2. {service hub file path}
3. {design spec or other relevant file}

## Description
Brief explanation of what this task accomplishes and why it matters.

## File Plan
| Action | Path | What |
|--------|------|------|
| CREATE/MODIFY | {file path} | {what changes} |

## Acceptance Criteria
- [ ] Criterion 1 -- specific, testable
- [ ] Criterion 2 -- specific, testable
- [ ] Criterion 3 -- specific, testable
- [ ] TypeScript compiles, lint passes
- [ ] No console.log, no `any` types

## Technical Notes
- Key files to modify: ...
- API endpoints involved: ...
- Edge cases to handle: ...

## Dependencies
- Blocked by: {TASK-ID or "None"}
- Blocks: {TASK-ID or "None"}

## Audit References
- Bug ID (if fixing a bug): ...
- Audit report: ...
```

### Task ID Convention

```
{SERVICE_PREFIX}-{SEQUENCE}

Prefixes:
  AUTH-XXX     Auth & admin service
  LOAD-XXX     Load management service
  CARR-XXX     Carrier management service
  CRM-XXX      CRM / customer service
  ACC-XXX      Accounting service
  DISP-XXX     Dispatch service
  SAFE-XXX     Safety & compliance service
  COMP-XXX     Shared component tasks
  INFRA-XXX    Infrastructure tasks
  BUG-XXX      Cross-cutting bug fixes
  TEST-XXX     Testing milestones
  DOC-XXX      Documentation

Numbering:
  000-099      Phase 0 tasks
  100-199      Phase 1 tasks
  200-299      Phase 2 tasks
```

---

## Effort Estimation Guide

| Size | Hours | Examples |
|------|-------|---------|
| S | < 2h | Bug fix with known location, config change, small component tweak |
| M | 2-4h | New API endpoint + tests, simple form/list screen, refactor |
| L | 4-8h | Complex screen (list + detail + form), multi-file feature |
| XL | 8-16h | Multi-step workflow, real-time feature, complex dashboard |

---

## STATUS.md Format

Generate a STATUS.md dashboard at `dev_docs/STATUS.md`:

```markdown
# Project Status Dashboard

> Last updated: {DATE}

## Summary
| Metric | Value |
|--------|-------|
| Total tasks | {N} |
| Phase 0 | {N} tasks ({N} done) |
| Phase 1 | {N} tasks ({N} done) |
| Phase 2 | {N} tasks ({N} done) |
| Estimated hours | {N}h |
| Completion | {N}% |

## Phase 0: Foundation & Bug Fixes
| ID | Title | Effort | Status | Assignee | Deps |
|----|-------|--------|--------|----------|------|
| ... | ... | ... | ... | ... | ... |

## Phase 1: Core MVP
| ID | Title | Effort | Status | Assignee | Deps |
|----|-------|--------|--------|----------|------|
| ... | ... | ... | ... | ... | ... |

## Phase 2: Enhanced Features
| ID | Title | Effort | Status | Assignee | Deps |
|----|-------|--------|--------|----------|------|
| ... | ... | ... | ... | ... | ... |

## Blocked Tasks
| ID | Title | Blocked by | Reason |
|----|-------|------------|--------|
| ... | ... | ... | ... |
```

---

## Generation Algorithm

1. **Collect all P0/P1 bugs** from audit reports. Create one task per bug (or group
   closely related bugs into a single task). Assign to Phase 0.

2. **Identify infrastructure tasks** (testing setup, CI, design system, shared
   utilities). Assign to Phase 0.

3. **Read the tribunal roadmap.** For each "Must Have" feature:
   - Break into implementation tasks (usually: DB/API/FE/Test layers)
   - Create task files with dependencies
   - Assign to Phase 1

4. **Read the tribunal roadmap.** For each "Should Have" feature:
   - Same breakdown pattern
   - Assign to Phase 2

5. **Build dependency graph:**
   - Phase 0 tasks have no cross-phase dependencies
   - Phase 1 tasks may depend on Phase 0 tasks
   - Phase 2 tasks may depend on Phase 0 or Phase 1 tasks
   - Within a phase: DB before API, API before FE, FE before Test

6. **Estimate effort** for each task using the guide above.

7. **Write STATUS.md** with all tasks sorted by phase and priority.

---

## Quality Rules

1. **One task = one deliverable.** Don't combine "build list page AND detail page" -- split them.
2. **Max 6 context files per task.** If a task needs more, it's too big -- split it.
3. **Acceptance criteria must be testable.** Not "looks good" but "renders loading skeleton when data is loading."
4. **Dependencies must be explicit.** If task B needs task A's output, say so.
5. **Bug tasks reference exact file:line.** Don't say "fix the bug" -- say "fix `carriers/page.tsx:45`."

---

## Validation Checklist

After generation, verify:
- [ ] Every P0/P1 bug from audits has a corresponding task
- [ ] Every "Must Have" feature has implementation tasks in Phase 1
- [ ] Every task has at least 2 acceptance criteria
- [ ] No circular dependencies exist
- [ ] Effort estimates sum to a realistic total (check against team capacity)
- [ ] Task IDs are unique and follow the naming convention
- [ ] STATUS.md totals match the actual task count
