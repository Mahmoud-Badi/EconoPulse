# Session Handoff — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in handoff from a fictional
# TaskFlow session. Your handoff.md will be updated at the end
# of every development session via /session-end.
# ============================================================

---

## Current State

TaskFlow has 12 pages, 34 API procedures, and 48 tests passing (72% coverage). Build is green. Production not yet deployed (targeting Week 9). Phase 2 (Productivity) is 4/6 tasks complete. Time tracking CRUD and the timer component are done. The dashboard KPI cards are next. No blockers.

---

## Completed Milestones

- [x] Auth + multi-tenancy foundation (Phase 0, 2026-03-05)
- [x] Projects CRUD with status workflow (Phase 1, 2026-03-12)
- [x] Task board with Kanban + list views (Phase 1, 2026-03-15)
- [x] Team management + role assignment (Phase 1, 2026-03-17)
- [x] Time tracking start/stop + manual entry (Phase 2, 2026-03-24)
- [x] Time tracking reports by project/user (Phase 2, 2026-03-26)

---

## Phase 2 Progress

### Phase 2: Productivity

- [x] 2.1 — Time tracking CRUD (start/stop timer, manual entry, edit, delete)
- [x] 2.2 — Timer component with optimistic updates
- [x] 2.3 — Time reports by project and team member
- [x] 2.4 — Email notifications (task assigned, due soon, overdue)
- [ ] 2.5 — Dashboard with project KPIs <-- **NEXT**
- [ ] 2.6 — Dashboard with team utilization chart

---

## What Was Done (Step 2.4)

### Files Created/Modified
- `apps/web/app/(dashboard)/notifications/page.tsx` — Notification preferences page (142 lines)
- `packages/api/src/routers/notification.ts` — Notification router with 4 procedures (89 lines)
- `packages/api/src/services/email.service.ts` — Email service with Resend integration (156 lines)
- `packages/api/src/jobs/notification-scheduler.ts` — Cron job for due-soon and overdue checks (94 lines)

### Key Implementation Details
- Used Resend for email delivery (free tier: 100 emails/day, sufficient for MVP)
- Notification preferences stored per-user in `notification_preferences` table
- Due-soon check runs every hour via `node-cron`, checks tasks due within 24 hours
- Overdue check runs daily at 9 AM workspace timezone

### Tests Added
- `packages/api/src/__tests__/notification.test.ts` — 6 tests (preference CRUD, email trigger logic, deduplication)

### Commit
- `e7b3a1f` feat(notifications): add email notifications for task assignment and due dates — 7 files changed, +481/-23

---

## Next Exact Action

**Phase 2: Productivity**
**Task:** 2.5 — Dashboard with project KPIs

**Next:**
1. Read `dev_docs/screens/dashboard.md` for the full dashboard spec
2. Run `pnpm dev` and navigate to `/dashboard` — currently shows placeholder
3. Implement 4 KPI cards: Active Projects, Tasks Due This Week, Hours Logged (7d), Team Utilization %
4. Each KPI card needs: current value, trend (vs last period), sparkline chart
5. Use TanStack Query for data fetching — create `dashboard.getKPIs` procedure
6. Test with `pnpm test -- --grep dashboard`
7. Update STATUS.md counts

**Context needed:**
- Read `dev_docs/screens/dashboard.md` for layout and data requirements
- The time tracking data is in `time_entries` table — schema in `packages/db/src/schema/time-entries.ts`
- KPI calculation logic should go in `packages/api/src/services/analytics.service.ts` (create new)

**Potential gotchas:**
- Team utilization % requires knowing each member's expected hours/week (stored in `team_members.hoursPerWeek`)
- Sparkline data needs 7 daily data points — use `date_trunc('day', ...)` grouping in SQL
- Dashboard must respect workspace timezone for "this week" calculations

---

## Branch State

```
$ git log --oneline -5
e7b3a1f feat(notifications): add email notifications for task assignment and due dates
c4d9e2a feat(time): add time tracking reports with CSV export
b8f2c11 fix(time): correct timezone offset in weekly aggregation
a1e9d34 feat(time): add timer component with optimistic updates
9c7f0e2 feat(time): add time entry CRUD with start/stop
```

- **Current branch:** `feature/phase-2-productivity`
- **Base branch:** `main`
- **Uncommitted changes:**
  - `M apps/web/app/(dashboard)/dashboard/page.tsx` — started placeholder swap for KPI cards
  - `? apps/web/components/dashboard/kpi-card.tsx` — new file, skeleton only
  - `? packages/api/src/services/analytics.service.ts` — new file, empty module

---

## Failing Tests

```
FAIL packages/api/src/__tests__/notification.test.ts
  ● Notification Scheduler › should not send duplicate due-soon notification within 24h
    Expected: 0
    Received: 1

    Deduplication window uses UTC midnight instead of workspace timezone.
    The hourly cron fires at 23:00 UTC and again at 00:00 UTC — both fall within
    the "24h before due" window for US/Eastern workspaces.

    at packages/api/src/__tests__/notification.test.ts:87:25

FAIL apps/web/src/__tests__/timer.test.tsx
  ● Timer Component › should show elapsed time after page refresh
    Expected: "01:23:45"
    Received: "00:00:00"

    Timer reads startedAt from server but localStorage cache is stale after
    a hard refresh. Need to invalidate cache on mount.

    at apps/web/src/__tests__/timer.test.tsx:134:18

Tests: 2 failed, 46 passed, 48 total
```

---

## Console Errors

The following browser console warnings/errors were observed during development and should be investigated:

1. **`Warning: Each child in a list should have a unique "key" prop.`** — Appears on `/team` page when rendering invite rows. The `team_invites` map uses array index instead of `invite.id` as key.

2. **`Error: TanStack Query — mutation observer result is not serializable`** — Appears intermittently on the time tracking page when the optimistic update fires. Likely caused by passing the full Prisma Date object instead of an ISO string to the mutation cache.

3. **`[Deprecation] SharedArrayBuffer usage without cross-origin isolation`** — Chrome warning appearing on every page load. Caused by a dependency (likely `date-fns` or a polyfill). Non-blocking but should be resolved before production to avoid future breakage.

---

## Sentry Incidents

| Issue | Event Count | First Seen | Link |
|-------|------------|------------|------|
| `TypeError: Cannot read properties of undefined (reading 'hoursPerWeek')` — Thrown in `time-reports` when a deactivated team member has no `workspace_members` record but still has `time_entries`. | 12 events | 2026-03-25 | [TASKFLOW-42](https://taskflow.sentry.io/issues/TASKFLOW-42) |
| `TimeoutError: Request to Resend API timed out after 10000ms` — Email service throws unhandled timeout when Resend is slow. The scheduler crashes and skips remaining notifications in the batch. | 3 events | 2026-03-26 | [TASKFLOW-43](https://taskflow.sentry.io/issues/TASKFLOW-43) |
