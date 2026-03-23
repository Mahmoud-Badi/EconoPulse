# Client Work Log — Week {{WEEK_NUMBER}} ({{WEEK_START}} – {{WEEK_END}}, {{YEAR}})

## Project: {{PROJECT_NAME}}

> **What this is:** A weekly record of completed work, who did it, and how it advances your project milestones. Updated after every task completion.

---

## Milestone Progress

| Milestone | Target Date | Progress | Status |
|-----------|------------|----------|--------|
| {{MILESTONE_1}} | {{TARGET_DATE_1}} | {{PROGRESS_1}}% | {{SCHEDULE_STATUS_1}} |
| {{MILESTONE_2}} | {{TARGET_DATE_2}} | {{PROGRESS_2}}% | {{SCHEDULE_STATUS_2}} |

**Status key:** ✅ On Track | ⚠️ At Risk | 🔴 Behind Schedule

## Week Summary

- **Tasks completed this week:** {{TASK_COUNT}}
- **By developer:** {{DEV_1}} ({{COUNT_1}}), {{DEV_2}} ({{COUNT_2}})
- **Current phase:** Phase {{PHASE_NUMBER}} — {{PHASE_NAME}} ({{PHASE_PROGRESS}})
- **Overall schedule status:** {{SCHEDULE_STATUS}}

---

## Work Entries

<!-- Newest entries at top. One entry per completed task. -->
<!-- Auto-generated from Post-Task Protocol Step 6. -->

### ✅ {{TASK_ID}}: {{TASK_NAME}}
- **Developer:** {{DEVELOPER_NAME}}
- **Date:** {{DATE}}
- **Phase:** Phase {{PHASE_NUMBER}} — {{PHASE_NAME}}
- **Milestone:** {{MILESTONE_NAME}}
- **What was delivered:** {{CLIENT_FRIENDLY_DESCRIPTION}}
- **Evidence:** {{TEST_COUNT}} tests passing, build green{{ACCESSIBLE_URL}}
- **Commit:** `{{COMMIT_HASH}}`

---

## How to Write Client Log Entries

### Entry Rules

1. **One entry per completed task** — created automatically by Post-Task Protocol Step 6
2. **Client-friendly language** — no file paths, no internal jargon, no technical implementation details
3. **Focus on deliverables** — what was built and what the user/client can now do that they couldn't before
4. **Developer attribution is mandatory** — every entry must name the developer who did the work
5. **Evidence is mandatory** — test count, build status, and accessible URL (if applicable)
6. **Milestone mapping** — every entry links to the milestone it advances

### Translating DEVLOG → Client Log

| DEVLOG (internal) | Client Log (external) |
|---|---|
| "Created notification router in `packages/api/src/routers/notification.ts` (89 lines, 4 procedures)" | "Built the notification system that sends alerts when tasks are assigned or approaching deadlines" |
| "Implemented `trip.getById` procedure with lateral joins" | "Built the trip detail view showing all trip information including passenger, driver, and vehicle details" |
| "Added `notification_preferences` table migration" | "Added user notification preferences so each team member can control which alerts they receive" |
| "Fixed N+1 query in time report aggregation" | "Improved report loading performance for time tracking reports" |

### Developer Attribution Sources

Developer name is determined from (in priority order):
1. `git config user.name` — primary source, always available
2. Session context `developer:` field — if set at session start
3. Explicit override — manual entry when needed

### Week Header Updates

After each entry, update the Week Summary section:
- Increment task count
- Update developer breakdown (add developer if new, increment count if existing)
- Update phase progress from STATUS.md
- Update schedule status by comparing actual progress to timeline.md/milestones.md

### Creating a New Weekly File

When the first task of a new week is completed:
1. Create `dev_docs/client-log/week-{{NN}}_{{YYYY-MM-DD}}.md` from this template
2. Fill in the milestone dashboard from current milestones.md
3. Set task count to 0
4. Add the first entry

### File Naming Convention

```
week-01_2026-03-17.md    ← Week 1, starting March 17
week-02_2026-03-24.md    ← Week 2, starting March 24
week-12_2026-06-01.md    ← Week 12, starting June 1
```

Week numbers are project-relative (Week 1 = first week of development), not calendar weeks.
