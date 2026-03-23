# Plan Change Protocol

> **Mandatory after every plan modification. No exceptions.**

This protocol defines exactly what happens after modifying the project plan — adding features, creating phases, writing tasks, deferring scope, or reassigning sprints. It is not optional overhead — it IS part of the plan change. A plan change is not complete until all tracking files reflect the new plan.

This is the counterpart to POST-TASK-PROTOCOL.md. POST-TASK fires after *completing work*. This protocol fires after *changing what work needs to be done*.

---

## Trigger

Any of the following:

- A new feature is added to the project scope
- A new phase is created
- New task files are written (`dev_docs/tasks/`)
- Existing task files are substantially modified (scope change, not typo fixes)
- A feature or task is deferred, removed, or deprioritized
- Sprint assignments change (tasks move between sprints)
- New service specs or screen specs are created (`dev_docs/specs/`)

## Duration

**5-8 minutes maximum.** Seven updates, each under 60 seconds. This is faster than discovering a month later that planned work was never tracked.

---

## Step 1: STATUS.md (60 seconds)

Update `dev_docs/STATUS.md`:

- [ ] Add new task checkboxes under the correct phase
- [ ] Remove checkboxes for deferred/removed tasks (or mark with `~~strikethrough~~`)
- [ ] Update phase task counts (e.g., `3/8 complete` becomes `3/10 complete` if 2 tasks added)
- [ ] Update phase completion percentages
- [ ] If new phase: add phase section with task list
- [ ] Update total task counts in the Counts section

**Example diff (adding tasks):**
```markdown
# Before
## Phase 3: Notifications (0/5 complete — 0%)

- [ ] T-060 — Email service setup
- [ ] T-061 — Email templates
- [ ] T-062 — Notification preferences
- [ ] T-063 — In-app notification center
- [ ] T-064 — Push notification service

# After
## Phase 3: Notifications (0/8 complete — 0%)

- [ ] T-060 — Email service setup
- [ ] T-061 — Email templates
- [ ] T-062 — Notification preferences
- [ ] T-063 — In-app notification center
- [ ] T-064 — Push notification service
- [ ] T-065 — SMS notification gateway          ← NEW
- [ ] T-066 — Notification batching/digest      ← NEW
- [ ] T-067 — Notification analytics dashboard  ← NEW
```

**Example diff (deferring):**
```markdown
# Before
## Phase 4: Analytics (0/6 complete — 0%)
- [ ] T-070 — Event tracking service
- [ ] T-071 — Dashboard charts
- [ ] T-072 — Export to CSV

# After
## Phase 4: Analytics (0/4 complete — 0%)
- [ ] T-070 — Event tracking service
- [ ] T-071 — Dashboard charts
- ~~T-072 — Export to CSV~~ (DEFERRED — moved to Phase 6)
```

## Step 2: master-tracker.md (90 seconds)

Update `dev_docs/tracker/master-tracker.md`:

- [ ] Add subtask rows for each new task (5-15 subtasks per task)
- [ ] For deferred tasks: change status to `deferred` (don't delete rows — preserve history)
- [ ] Update `blocked-by` chains if new tasks create new dependencies
- [ ] Update header counts (Total tasks, Total subtasks)

**Example (adding subtasks for new task T-065):**
```markdown
| T-065.1 | SMS provider integration (Twilio) | not-started | T-060 |  |
| T-065.2 | SMS template engine               | not-started | T-065.1 |  |
| T-065.3 | Phone number validation            | not-started | — |  |
| T-065.4 | SMS rate limiting                  | not-started | T-065.1 |  |
| T-065.5 | SMS delivery tracking              | not-started | T-065.4 |  |
| T-065.6 | SMS notification tests             | not-started | T-065.2, T-065.5 |  |
```

## Step 3: dependency-map.md (60 seconds)

Update `dev_docs/tracker/dependency-map.md`:

- [ ] Add new task to Hard/Soft dependency tables
- [ ] Update Parallel Execution Matrix if new tasks can be parallelized
- [ ] Recalculate critical path if new tasks are on it
- [ ] Add dependency edges for new tasks
- [ ] For deferred tasks: remove from critical path calculations

## Step 4: timeline.md (60 seconds)

Update `dev_docs/tracker/timeline.md`:

- [ ] Assign new tasks to specific weeks
- [ ] Adjust week allocations if scope increased
- [ ] Update timeline summary and milestones if affected
- [ ] For deferred tasks: move to deferred section or later phase weeks

## Step 5: milestones.md (30 seconds)

Update `dev_docs/tracker/milestones.md`:

- [ ] Update gate criteria if new tasks are prerequisites for existing milestones
- [ ] Add new milestone if a new phase was created
- [ ] Update go/no-go decision point criteria if scope changed
- [ ] For deferred tasks: remove from milestone prerequisites

## Step 6: handoff.md (30 seconds)

Update `dev_docs/handoff.md`:

- [ ] Note the plan change under **"Key Decisions"**
- [ ] Update **"Next Action"** if the plan change affects what's next
- [ ] Update **"Blockers"** if new dependencies were introduced

**Example:**
```markdown
## Key Decisions
- Added SMS notifications (T-065, T-066, T-067) to Phase 3.
  Reason: Client requirement from 2026-03-15 call.
  Impact: Phase 3 grows from 5 to 8 tasks, estimated +1 week.
```

## Step 7: DEVLOG.md (30 seconds)

Append to `dev_docs/DEVLOG.md`:

- [ ] Add plan change entry with format: `### [{{TIMESTAMP}}] PLAN CHANGE: {{description}}`
- [ ] What changed (added/removed/modified features/tasks/phases)
- [ ] Why (reason for the change)
- [ ] Impact (which phases/sprints affected, count changes)
- [ ] Files created or updated

**Example:**
```markdown
### [2026-03-15 10:30] PLAN CHANGE: Added SMS notifications to Phase 3

**What changed:** Added 3 new tasks (T-065 SMS gateway, T-066 notification batching,
T-067 notification analytics) to Phase 3.

**Why:** Client requirement from stakeholder call — SMS is a launch blocker for
their field operations team who don't have reliable internet.

**Impact:**
- Phase 3: 5 → 8 tasks
- Total project tasks: 72 → 75
- Estimated timeline impact: +1 week to Phase 3

**Files created:**
- dev_docs/tasks/phase-3/T-065-sms-gateway.md
- dev_docs/tasks/phase-3/T-066-notification-batching.md
- dev_docs/tasks/phase-3/T-067-notification-analytics.md
- dev_docs/specs/services/sms-service-spec.md

**Files updated:**
- dev_docs/STATUS.md (added tasks, updated counts)
- dev_docs/tracker/master-tracker.md (added 18 subtasks)
- dev_docs/tracker/dependency-map.md (added SMS dependencies)
- dev_docs/tracker/timeline.md (assigned to weeks 6-7)
- dev_docs/handoff.md (noted plan change)
```

---

## Change Type Quick Reference

| Change Type | STATUS | tracker | deps | timeline | milestones | handoff | DEVLOG |
|---|---|---|---|---|---|---|---|
| Add feature (new service + tasks) | YES | YES | YES | YES | maybe | YES | YES |
| Add phase | YES | YES | YES | YES | YES | YES | YES |
| Add task to existing phase | YES | YES | maybe | YES | no | YES | YES |
| Modify task scope | no | YES | maybe | maybe | no | YES | YES |
| Defer feature | YES | YES | YES | YES | maybe | YES | YES |
| Remove feature | YES | YES | YES | YES | maybe | YES | YES |
| Change sprint assignment | YES | YES | no | YES | no | YES | YES |

**"maybe"** = only if the change affects that file's content (e.g., deferring a non-milestone task doesn't require milestones.md update).

---

## Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Behavior |
|---|---|---|
| "I'll update trackers after I finish planning" | You'll forget. Plans spawn more plans. The trackers will never catch up. | Update trackers as part of each plan change. |
| "I'll batch all the plan changes then update once" | The more changes pile up, the harder it is to reconcile. One missed task = invisible work. | One plan change, one update cycle. |
| "The task files speak for themselves" | Task files without STATUS.md entries are invisible to the execution pipeline. GSD, sprints, and session-kickoff all read STATUS.md, not task directories. | Always update STATUS.md. It IS the execution radar. |
| "I'll just update STATUS.md" | master-tracker, deps, and timeline serve different purposes. STATUS = what exists. Tracker = how to execute it. Timeline = when. | Update all affected files per the Quick Reference table. |
| "This is a small change, I'll skip the protocol" | Small changes compound. Three "small" changes later, STATUS.md is 9 tasks behind reality. | Every plan change gets tracked. There is no threshold below which tracking is optional. |
| "We'll sort out the trackers in the next planning session" | The next session reads handoff.md and STATUS.md to know what to do. If they're wrong, the session starts with wrong context. | Trackers must be current at all times. |

---

## When to Skip (almost never)

| State File | Can Skip? | When |
|---|---|---|
| `STATUS.md` | Never | — |
| `master-tracker.md` | Yes | If it doesn't exist yet (pre-Step 9.5 of ORCHESTRATOR) |
| `dependency-map.md` | Yes | If it doesn't exist, or for minor task scope edits |
| `timeline.md` | Yes | If it doesn't exist, or for minor task scope edits |
| `milestones.md` | Yes | If it doesn't exist, or change doesn't affect milestones |
| `handoff.md` | Never | — |
| `DEVLOG.md` | Never | — |

---

## Enforcement

This protocol is enforced by three mechanisms:

1. **`plan-change-detector` hook** (Stop event) — detects when planning files were modified without corresponding tracker updates
2. **`propagate-plan-change.js` script** — validation script that catches drift between task files and tracking files (run manually or via `/plan-changed`)
3. **`context-anchor` hook** (PreCompact event) — injects plan-change protocol reminders before context compaction

Use `/plan-changed` for a guided walkthrough that handles all updates automatically.

---

## Quick Reference Card

```
Plan changed? Run this checklist:
  STATUS.md     → add/remove tasks, update phase counts
  tracker       → add/remove subtask rows (if exists)
  deps          → update dependency edges (if exists)
  timeline      → assign to weeks (if exists)
  milestones    → update gate criteria (if affected)
  handoff.md    → note plan change, update next action
  DEVLOG.md     → timestamped plan change entry
Done? NOW the plan change is real.
```
