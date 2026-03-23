# Phase 1: Core — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in phase plan for a fictional
# TaskFlow project. Your phase plans will be generated during
# ORCHESTRATOR Step 8 (Task Generation).
# ============================================================

> **Phase:** 1 | **Focus:** Core entity management (Projects, Tasks, Team)
> **Weeks:** 2-3 | **Estimated Hours:** 36-48h | **Status:** COMPLETE

---

## Phase Goal

Build the three core services that every other feature depends on: Projects, Tasks, and Team management. By the end of Phase 1, users can create projects, manage tasks on a Kanban board, and invite team members. This is the minimum viable collaboration tool.

---

## Prerequisites

- [x] Phase 0 complete (auth, multi-tenancy, design system foundation)
- [x] Database schema for projects, tasks, team_members tables migrated
- [x] Seed data populated with test projects and users
- [x] Design tokens applied (brand colors, typography, spacing)

---

## Task Breakdown

| Task ID | Title | Effort | Status | Dependencies |
|---------|-------|--------|--------|-------------|
| PROJ-001 | Projects list page with filtering and pagination | M (3-4h) | Done | Phase 0 |
| PROJ-002 | Project detail page with tabs (overview, tasks, team, time) | L (4-6h) | Done | PROJ-001 |
| PROJ-003 | New project form with validation | M (2-3h) | Done | PROJ-001 |
| TASK-001 | Task board — Kanban view with drag-and-drop | XL (6-8h) | Done | PROJ-002 |
| TASK-002 | Task board — List view with sorting and filtering | M (3-4h) | Done | TASK-001 |
| TASK-003 | Task detail modal with comments and activity log | L (4-6h) | Done | TASK-001 |
| TASK-004 | New task form (inline + full form) | M (2-3h) | Done | TASK-001 |
| TEAM-001 | Team members list page | S (2h) | Done | Phase 0 |
| TEAM-002 | Invite flow (email invite + magic link) | M (3-4h) | Done | TEAM-001 |
| TEAM-003 | Role management (assign/change roles) | S (1-2h) | Done | TEAM-001 |

**Total: 10 tasks, 30-42h estimated, 34h actual**

---

## Acceptance Criteria (Phase Gate)

- [x] All 10 tasks complete
- [x] Projects: CRUD works, status workflow enforced, pagination correct
- [x] Tasks: Kanban drag-and-drop works, list view sorts correctly
- [x] Team: Invite flow sends email, magic link works, roles enforce permissions
- [x] 22 API procedures created and tested
- [x] 28 tests passing
- [x] TypeScript compiles with zero errors
- [x] Lint passes with zero warnings
- [x] Build succeeds

---

## Phase Output

| Metric | Before Phase 1 | After Phase 1 |
|--------|---------------|---------------|
| Pages | 2 (login, dashboard placeholder) | 8 (+6) |
| API procedures | 4 (auth only) | 22 (+18) |
| Tests | 8 | 28 (+20) |
| Coverage (stmt) | 45% | 65% (+20%) |
| Components | 12 (design system base) | 28 (+16) |
| Database tables | 5 (auth + workspace) | 9 (+4: projects, tasks, task_comments, project_members) |

---

## Lessons Learned

- Kanban drag-and-drop (TASK-001) took 8h instead of estimated 6h — @dnd-kit library has a learning curve with sortable containers. Added to gotchas doc.
- Inline task creation (TASK-004) was faster than expected — reused the validation schemas from the full form.
- Team invite magic link required adding a `team_invites` table not in the original schema — schema change was quick but should have been caught in the service spec.
