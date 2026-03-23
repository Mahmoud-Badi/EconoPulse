# Post-Task Protocol

> **Mandatory after every task or subtask completion. No exceptions.**

This protocol defines exactly what happens after completing any task or subtask from STATUS.md or master-tracker.md. It is not optional overhead — it IS part of the task. A task is not complete until all state files are updated.

---

## Trigger

Any of the following:
- A task checkbox in STATUS.md can be toggled from `[ ]` to `[x]`
- A subtask in master-tracker.md changes to `complete`
- A feature, component, or service is finished and verified
- A bug fix or refactor is done

## Duration

**2-4 minutes maximum.** Six updates, each under 30 seconds. This is faster than re-discovering what was done in the next session.

---

## Step 1: STATUS.md (30 seconds)

Update `dev_docs/STATUS.md`:

- [ ] Toggle the completed task's checkbox: `[ ]` to `[x]`
- [ ] Update the phase completion count (e.g., `3/8 complete` to `4/8 complete`)
- [ ] Update the phase completion percentage
- [ ] Update "Active Task" to the next task in sequence
- [ ] If crossing a sprint boundary: update sprint velocity metrics

**Example diff:**
```markdown
# Before
## Phase 2: Core Services (3/8 complete — 37%)
Active Task: T-042 — Implement user authentication service

- [x] T-039 — Database schema migration
- [x] T-040 — Base service scaffolding
- [x] T-041 — Error handling middleware
- [ ] T-042 — User authentication service    ← was working on this
- [ ] T-043 — Session management

# After
## Phase 2: Core Services (4/8 complete — 50%)
Active Task: T-043 — Session management

- [x] T-039 — Database schema migration
- [x] T-040 — Base service scaffolding
- [x] T-041 — Error handling middleware
- [x] T-042 — User authentication service    ← now complete
- [ ] T-043 — Session management             ← now active
```

## Step 2: handoff.md (30 seconds)

Update `dev_docs/handoff.md`:

- [ ] Update **"Last Completed"**: task name + one-line outcome
- [ ] Update **"Next Action"**: exact next task with relevant file paths
- [ ] Update **"Blockers"**: any new blockers discovered during the task
- [ ] Update **"Session Progress"**: increment completed count
- [ ] Update **"Key Decisions"**: if any architectural or design decisions were made

**Example:**
```markdown
## Last Completed
T-042 — User authentication service. JWT-based auth with refresh tokens,
bcrypt password hashing, rate limiting on login endpoint. All 14 tests passing.

## Next Action
T-043 — Session management. Start with `src/services/session/`.
Reference: dev_docs/specs/session-service.md (spec complete).
Dependencies: T-042 (auth service) — now satisfied.

## Blockers
- Redis not yet configured for session storage (need env var REDIS_URL)

## Session Progress
Phase 2: 4/8 complete (was 3/8 at session start)
```

## Step 3: DEVLOG.md (30 seconds)

Append to `dev_docs/DEVLOG.md`:

- [ ] Add entry with format: `### [{{TIMESTAMP}}] Task {{TASK_ID}}: {{TASK_NAME}}`
- [ ] What was done (1-2 sentences)
- [ ] Files created or modified (bulleted list)
- [ ] Decisions made (if any)
- [ ] Issues encountered (if any)

**Example:**
```markdown
### [2026-03-14 14:30] Task T-042: User Authentication Service

Implemented JWT-based authentication with refresh token rotation. Used bcrypt
for password hashing with cost factor 12. Added rate limiting (5 attempts per
15 minutes) on the login endpoint.

**Files:**
- Created: `src/services/auth/auth.service.ts`
- Created: `src/services/auth/auth.controller.ts`
- Created: `src/services/auth/auth.test.ts` (14 tests)
- Modified: `src/routes/index.ts` (added auth routes)
- Modified: `dev_docs/services/auth-service.hub.md` (updated status)

**Decisions:**
- Chose refresh token rotation over sliding expiry for better security posture
- Set JWT expiry to 15 minutes based on OWASP recommendations

**Issues:**
- None
```

## Step 4: master-tracker.md (30 seconds, if tracker exists)

Update `dev_docs/tracker/master-tracker.md`:

- [ ] Change subtask status: `not-started` or `in-progress` to `complete`
- [ ] Update `blocked-by` if dependencies changed
- [ ] Check: did completing this subtask unblock other subtasks? If so, update their `blocked-by` fields
- [ ] Update the subtask's `completed` timestamp
- [ ] Run sync check: `bash scripts/sync-status-tracker.sh` or `node scripts/check-tracker.js` to verify STATUS.md and master-tracker.md are consistent. If discrepancies are found, fix them before proceeding.

**Example diff:**
```markdown
# Before
| T-042.1 | Auth service scaffold    | in-progress | T-040      |           |
| T-042.2 | JWT token generation     | not-started | T-042.1    |           |
| T-042.3 | Login endpoint           | not-started | T-042.2    |           |

# After
| T-042.1 | Auth service scaffold    | complete    | T-040      | 2026-03-14 |
| T-042.2 | JWT token generation     | complete    | T-042.1    | 2026-03-14 |
| T-042.3 | Login endpoint           | complete    | T-042.2    | 2026-03-14 |
```

## Step 5: CONTEXT-RECOVERY.md (15 seconds, if it exists)

Update `dev_docs/CONTEXT-RECOVERY.md`:

- [ ] Update "Current State" with the new active task
- [ ] Update "Recent Changes" with the task just completed
- [ ] Update file list if new files were created

## Step 6: CLIENT-LOG (30 seconds)

Update `dev_docs/client-log/week-{{CURRENT_WEEK}}.md`:

- [ ] If no file exists for this week, create one from `03-documentation/state-files/CLIENT-LOG.template.md`
- [ ] Translate the DEVLOG entry (Step 3) into client-friendly language — strip file paths, internal jargon, and technical implementation details. Focus on what was delivered and what the user/client can now do.
- [ ] Add developer name (from `git config user.name`, session context, or explicit override)
- [ ] Map the task to its milestone (from STATUS.md phase → milestones.md)
- [ ] Add evidence line (test count, build status, accessible URL if applicable)
- [ ] Update the week header: increment task count, update developer breakdown, update schedule status

**Example:**
```markdown
### ✅ T-042: User Authentication System
- **Developer:** Alice Chen
- **Date:** 2026-03-14
- **Phase:** Phase 2 — Core Services
- **Milestone:** MVP Core
- **What was delivered:** Users can now sign up, log in, and reset their
  passwords. Login is protected against brute force with rate limiting.
  Sessions stay active for 15 minutes of inactivity before requiring
  re-authentication.
- **Evidence:** 14 tests passing, build green, accessible at /login
- **Commit:** `e7b3a1f`
```

---

## Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Behavior |
|---|---|---|
| "I'll update state files at the end" | You'll forget. Context compaction will erase your memory of what was done. | Update immediately after each task. |
| "I'll batch 3 tasks then update" | STATUS.md becomes stale. If the session crashes, 3 tasks of progress are lost. | One task, one update cycle. |
| "The code speaks for itself" | The next session has no idea what was done or what's next. handoff.md IS the memory. | Always update handoff.md. |
| "I'll just update STATUS.md" | handoff.md and DEVLOG.md serve different purposes. STATUS = what's done. Handoff = what's next. DEVLOG = what happened. | Update all three. Every time. |
| "I'm almost done, one more task first" | The most dangerous pattern. "One more task" becomes three, then context compacts, and all progress tracking is lost. | Stop. Update state files. Then proceed. |
| "State files are boilerplate busywork" | State files are the ONLY thing that survives between sessions. Code changes without state updates are invisible to the next session. | Treat state updates as the most important part of task completion. |
| "The client doesn't need to know about this task" | Every completed task is proof of work. Gaps in the client log look like gaps in productivity. | Log every task. The client decides what matters, not you. |

---

## When to Skip (almost never)

| State File | Can Skip? | When |
|---|---|---|
| `STATUS.md` | Never | — |
| `handoff.md` | Never | — |
| `DEVLOG.md` | Never | — |
| `master-tracker.md` | Yes | If it doesn't exist yet (pre-Step 9.5 of ORCHESTRATOR) |
| `CONTEXT-RECOVERY.md` | Yes | If it doesn't exist yet (pre-Step 16 of ORCHESTRATOR) |
| `CLIENT-LOG` | Yes | If no client engagement on this project (internal/solo projects) |

---

## Enforcement

This protocol is enforced by three mechanisms:

1. **`post-task-protocol` hook** (Stop event) — reminds after every turn where code was modified without state updates
2. **`commit-state-check` hook** (PreToolUse on Bash) — blocks commits when state files aren't staged
3. **`context-anchor` hook** (PreCompact event) — injects protocol reminders before context compaction

All three hooks are defined in `plugin/hooks/` and registered via the project's `.claude/settings.json`.

---

## Quick Reference Card

```
Task complete? Run this checklist:
  STATUS.md    → checkbox [x], update count, update active task
  handoff.md   → last completed, next action, blockers
  DEVLOG.md    → timestamped entry, files, decisions, issues
  tracker      → subtask status (if exists)
  recovery     → current state (if exists)
  CLIENT-LOG   → client-facing entry with developer name (if client project)
Done? NOW you can move to the next task.
```
