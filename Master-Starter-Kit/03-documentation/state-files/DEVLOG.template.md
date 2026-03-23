# {{PROJECT_NAME}} Development Log

> **Reverse-chronological session history.** Newest entries at top. Every development session gets an entry. This log is the project's memory — when you need to know "when did we add X?" or "why did we do Y?", search here.

---

## How to Write a DEVLOG Entry

Every session entry follows this exact format. Copy/paste this template:

```markdown
## Session {YYYY-MM-DD} ({SESSION_NUMBER})
**Phase:** {N} — {PHASE_NAME} | **Focus:** {ONE_LINE_DESCRIPTION}

### What Was Done
- {ACTION_VERB} {what} in `{file/path}` ({detail: line counts, procedure names, component names})
- {ACTION_VERB} {what} in `{file/path}` ({detail})
- {ACTION_VERB} {what} in `{file/path}` ({detail})

### Counts After Step {X.Y}
- {N} pages (+{delta}: {page1}, {page2})
- {N} API procedures (+{delta} this session: {proc1}, {proc2})
- {N} tests passing (+{delta} tests)
- {N}% stmt coverage / {N}% func coverage

### Technical Notes
- {Gotcha, workaround, or decision made during this session}
- {Approach rationale if non-obvious}
- {Performance observation or dependency note}

### Commit
- `{HASH}` {commit message} — {N} files changed, +{additions}/-{deletions}
```

---

## Entry Rules

1. **Every session gets an entry** — Even if you only fixed a typo
2. **Action verbs are mandatory** — "Created", "Implemented", "Fixed", "Refactored", "Added", "Removed", "Updated", "Migrated"
3. **File paths are mandatory** — Always include the actual file path for each change
4. **Counts must match STATUS.md** — Cross-check counts between DEVLOG and STATUS after every entry
5. **Technical Notes capture knowledge** — If you learned something, fought a bug, or made a non-obvious decision, write it down
6. **Commit hashes link to git history** — Always include the commit hash for traceability

---

## Example Entry (from Delta TMS V3)

```markdown
## Session 2026-01-24 (#14)
**Phase:** 5 — Trips | **Focus:** Trip detail page with timeline

### What Was Done
- Created trip detail page in `apps/web/app/(app)/trips/[id]/page.tsx` (287 lines)
- Implemented `trip.getById` procedure in `packages/api/src/routers/trip.ts` (joins: passenger, driver, vehicle, facility)
- Added StatusTimeline component in `packages/ui/src/components/status-timeline.tsx` (94 lines)
- Created TripActions component with cancel/reassign/complete actions (156 lines)
- Added 4 unit tests for trip status transitions in `packages/api/src/__tests__/trip.test.ts`

### Counts After Step 5.3
- 12 pages (+1: trip detail)
- 34 API procedures (+1: trip.getById)
- 28 tests passing (+4 tests)
- 67% stmt / 72% func coverage

### Technical Notes
- Trip detail fetches 4 joined tables — used single query with lateral joins instead of N+1
- StatusTimeline renders chronological status changes — each status change stored in trip_status_history table
- Cancel action requires `cancellation_reason` field (business rule from domain-rules doc)
- Date display: all dates stored UTC, displayed in company timezone via date-fns-tz

### Commit
- `a3f7c2e` feat(trips): add trip detail page with status timeline — 8 files changed, +537/-12
```

---

## Session Log

<!-- New entries go here, above older entries -->

## Session {{DATE}} (#1)
**Phase:** 0 — Foundation | **Focus:** {{DESCRIPTION}}

### What Was Done
- {First actions of the project}

### Counts After Step 0.1
- 0 pages
- 0 API procedures
- 0 tests passing

### Technical Notes
- {Initial setup decisions}

### Commit
- `{{HASH}}` {message}
