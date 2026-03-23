---
name: plan-change-detector
description: Detects planning file modifications and automatically updates all tracking files. Fires on Stop event. If planning files were changed but trackers weren't, this hook performs the tracker updates — not just a reminder.
event: Stop
---

# Plan Change Detector Hook

Automatically propagates plan changes to all tracking files. When planning files (task files, specs, phase docs, sprint plans) are modified but tracking files (STATUS.md, master-tracker.md, dependency-map.md) are not, this hook **performs the updates automatically** — it doesn't just remind you.

This is the counterpart to `post-task-protocol.md`. That hook catches missing state updates after *code changes*. This hook catches missing tracker updates after *plan changes*.

## Trigger

Activates on the **Stop** event — after every response where Claude Code finishes work.

## Behavior

### Step 1: Detect if planning files were modified

Check whether any planning files were modified in this turn:

```bash
# Check for modified planning files
git diff --name-only HEAD 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'
# Also check staged planning files
git diff --cached --name-only 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'
# Also check untracked new planning files
git ls-files --others --exclude-standard 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'
```

If no planning files were modified, **skip all checks** — no action needed.

### Step 2: Check if tracking files were already updated

Check whether the tracking files were ALSO modified in this turn:

```bash
git diff --name-only HEAD 2>/dev/null | grep -E '(STATUS\.md|master-tracker\.md|dependency-map\.md|timeline\.md|handoff\.md|DEVLOG\.md)'
git diff --cached --name-only 2>/dev/null | grep -E '(STATUS\.md|master-tracker\.md|dependency-map\.md|timeline\.md|handoff\.md|DEVLOG\.md)'
```

If `STATUS.md` AND `DEVLOG.md` were both already modified, **skip** — the protocol was likely followed.

### Step 3: Perform automatic tracker updates

If planning files were modified but trackers were NOT updated, **do the following automatically** (don't just remind — actually do it):

#### 3a. Identify what changed

Read the modified/new planning files to understand:
- Were new task files created? → Extract task IDs, titles, phase assignments
- Were existing tasks modified? → Determine scope of change
- Were specs created? → Map to affected phases and tasks
- Were tasks removed/deferred? → Note which task IDs

#### 3b. Update STATUS.md

Read `dev_docs/STATUS.md` and:
- Add checkboxes for new tasks under their correct phase section
- Update phase task counts (e.g., `3/8` → `3/10`)
- Update phase completion percentages
- Remove or strikethrough deferred tasks
- Update total counts

#### 3c. Update master-tracker.md (if it exists)

Read `dev_docs/tracker/master-tracker.md` and:
- Add subtask rows (5-15 subtasks per new task)
- For each subtask: ID, description, status (`not-started`), blocked-by, timestamp
- Update header counts
- For deferred tasks: change status to `deferred`

#### 3d. Update dependency-map.md (if it exists)

Read `dev_docs/tracker/dependency-map.md` and:
- Add new task dependency entries
- Map dependencies from task file content (blocked-by, depends-on references)

#### 3e. Update timeline.md (if it exists)

Read `dev_docs/tracker/timeline.md` and:
- Assign new tasks to appropriate weeks based on phase and dependencies

#### 3f. Update handoff.md

Read `dev_docs/handoff.md` and:
- Add plan change note under "Key Decisions"
- Update task counts
- Update "Next Action" if the plan change affects sequencing

#### 3g. Append to DEVLOG.md

Append a plan change entry:

```markdown
### [TIMESTAMP] PLAN CHANGE: {brief description}

**What changed:** {added/removed/modified tasks or features}
**Why:** {reason, if discernible from context}
**Impact:** {phase and count changes}
**Files created/modified:** {list}
```

### Step 4: Report what was done

Output a concise report:

```
===================================================================
PLAN CHANGE AUTO-PROPAGATED

Planning files changed:
  - dev_docs/tasks/phase-3/T-065-sms-gateway.md (NEW)
  - dev_docs/specs/services/sms-service-spec.md (NEW)

Trackers updated:
  - STATUS.md — added 3 tasks to Phase 3 (5 → 8 tasks)
  - master-tracker.md — added 18 subtasks
  - dependency-map.md — added 3 dependency entries
  - handoff.md — noted plan change
  - DEVLOG.md — appended plan change entry

Run `node scripts/propagate-plan-change.js` to verify consistency.
===================================================================
```

## Rules

- **Act, don't just remind** — this hook performs the actual updates, not just a notification
- **Skip read-only turns** — if no files were modified, skip all checks
- **Skip code-only turns** — if only code files (not planning files) were modified, skip (POST-TASK-PROTOCOL handles those)
- **Skip if trackers already updated** — if STATUS.md + DEVLOG.md were both modified this turn, skip
- **Skip pre-bootstrap** — if `dev_docs/STATUS.md` doesn't exist yet (pre-Step 9), skip all checks
- **Skip minor edits** — if only a single existing planning file was modified with < 10 lines of changes, skip (typo fix, not a plan change)
- **Never create files** — only update tracking files that already exist. If master-tracker.md doesn't exist, don't create it
- **Be fast** — this runs on every turn. Read only what's needed, write only what changed
- **Preserve formatting** — match the exact formatting conventions of each tracking file

## Why This Exists

The POST-TASK-PROTOCOL catches missing state updates after code changes. But plan changes produce *planning files* (specs, task files), not code — so POST-TASK-PROTOCOL never fires. This creates a blind spot where new work is planned but never enters the execution pipeline.

This hook closes that gap by automatically propagating plan changes to all tracking files on every Stop event. The user never has to remember to update trackers — it happens automatically.

## Relationship to /plan-changed Command

This hook and the `/plan-changed` command do the same work. The difference:
- **This hook** fires automatically on every Stop event — zero friction
- **`/plan-changed`** can be invoked manually for explicit, deliberate plan changes (e.g., major scope shifts that need careful tracker updates)

Both follow the same protocol: `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`
