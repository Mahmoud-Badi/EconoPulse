# TaskFlow Development Log
# ============================================================
# EXAMPLE FILE — This shows 3 filled-in DEVLOG entries for a
# fictional TaskFlow project. Your DEVLOG.md grows over time
# with one entry per development session.
# ============================================================

> **Reverse-chronological session history.** Newest entries at top.

---

## Session 2026-03-26 (#8)
**Phase:** 2 — Productivity | **Focus:** Email notifications for task events

### What Was Done
- Created notification router in `packages/api/src/routers/notification.ts` (89 lines, 4 procedures: getPreferences, updatePreferences, sendTestEmail, getHistory)
- Implemented email service in `packages/api/src/services/email.service.ts` (156 lines, Resend integration with HTML templates)
- Created notification scheduler in `packages/api/src/jobs/notification-scheduler.ts` (94 lines, hourly due-soon + daily overdue checks)
- Created notification preferences page in `apps/web/app/(dashboard)/notifications/page.tsx` (142 lines)
- Added `notification_preferences` table migration (columns: userId, taskAssigned, dueSoon, overdue, weeklyDigest)

### Counts After Step 2.4
- 12 pages (+1: notification preferences)
- 34 API procedures (+4: notification CRUD)
- 48 tests passing (+6 tests)
- 72% stmt / 78% func coverage

### Technical Notes
- Resend free tier allows 100 emails/day — sufficient for MVP, upgrade path is clear
- Due-soon notifications use workspace timezone, not UTC — `date-fns-tz` for conversion
- Deduplication: notification_log table prevents sending the same notification twice within 24h
- node-cron handles scheduling; would move to proper job queue (BullMQ) for production scale

### Commit
- `e7b3a1f` feat(notifications): add email notifications for task assignment and due dates — 7 files changed, +481/-23

---

## Session 2026-03-24 (#7)
**Phase:** 2 — Productivity | **Focus:** Time tracking reports

### What Was Done
- Created time reports page in `apps/web/app/(dashboard)/time/reports/page.tsx` (198 lines, filterable by project/user/date range)
- Implemented `timeEntry.getReport` procedure in `packages/api/src/routers/time-entry.ts` (complex aggregation with project + user grouping)
- Added ReportTable component in `apps/web/components/time/report-table.tsx` (134 lines, sortable columns, CSV export)
- Added DateRangePicker component in `packages/ui/src/components/date-range-picker.tsx` (87 lines, using date-fns)

### Counts After Step 2.3
- 11 pages (+1: time reports)
- 30 API procedures (+1: timeEntry.getReport)
- 42 tests passing (+3 tests)
- 70% stmt / 76% func coverage

### Technical Notes
- Time report aggregation uses a single SQL query with `GROUP BY` on project + user — avoids N+1
- CSV export happens client-side using Blob URL — no server endpoint needed
- DateRangePicker defaults to "This Week" (Mon-Sun) — uses workspace start-of-week setting
- Report query takes 12ms on 10K time entries — acceptable, will revisit if performance degrades

### Commit
- `c4d9e2a` feat(time): add time tracking reports with CSV export — 6 files changed, +419/-8

---

## Session 2026-03-17 (#5)
**Phase:** 1 — Core | **Focus:** Team management and role assignment

### What Was Done
- Created team members list page in `apps/web/app/(dashboard)/team/page.tsx` (167 lines, grid layout with role badges)
- Created invite flow in `apps/web/app/(dashboard)/team/invite/page.tsx` (124 lines, email invite form with role selector)
- Implemented team router in `packages/api/src/routers/team.ts` (6 procedures: list, getById, invite, updateRole, deactivate, resendInvite)
- Added `team_invites` table migration (columns: email, role, invitedBy, status, expiresAt)
- Updated auth middleware to inject `workspaceRole` into context from `workspace_members` table

### Counts After Step 1.3
- 8 pages (+2: team list, invite)
- 22 API procedures (+6: team CRUD + invite)
- 28 tests passing (+5 tests)
- 65% stmt / 71% func coverage

### Technical Notes
- Invite flow: creates a row in team_invites, sends email with magic link, on accept creates workspace_member record
- Role hierarchy: Admin > Project Manager > Team Member — enforced in middleware, not UI
- Deactivate (not delete) team members — preserves time entries and task assignment history
- Magic link expires after 7 days — configurable via `INVITE_EXPIRY_HOURS` env var

### Gotchas
- **Resend free tier limits to 100 emails/day** — fine for MVP development and testing, but production will need the Pro tier ($20/mo for 5,000 emails). Added `RESEND_TIER` env var to switch templates between free-tier-safe (plain text) and pro-tier (HTML with images).
- **`node-cron` doesn't survive process restart** — if the API server crashes or restarts (e.g., during deployment), all scheduled cron jobs are lost. Need to migrate to BullMQ with Redis-backed persistence before production. Added to Phase 3 backlog.
- **Prisma `generate` takes 12s on 260-model schema** — this runs on every `pnpm install` and slows CI cold starts. Workaround: cache `node_modules/.prisma/client` in CI artifacts. Reduced CI time from 3m40s to 2m10s.

### P0 Bugs Discovered
- **P0-BUG-011:** Invite magic link tokens are stored unhashed in `team_invites.token` column — if the database is compromised, an attacker could accept any pending invite. **Fix:** Hash tokens with SHA-256 before storage, compare hashes on acceptance. **Severity:** P0 (security). **Ticket:** [TASKFLOW-58](https://linear.app/taskflow/issue/TASKFLOW-58)
- **P0-BUG-012:** Deactivated team members can still log time entries — the `time_entries` create procedure checks `workspace_members.role` but not `workspace_members.status`. A deactivated user with a valid JWT can POST to `/api/v1/time-entries`. **Fix:** Add `status = 'ACTIVE'` check to the time entry authorization middleware. **Severity:** P0 (data integrity). **Ticket:** [TASKFLOW-59](https://linear.app/taskflow/issue/TASKFLOW-59)

### Commit
- `8f1a3b7` feat(team): add team management with invite flow and role assignment — 9 files changed, +612/-34
