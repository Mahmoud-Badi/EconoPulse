---
name: plan-changed
description: Propagate plan modifications to all tracking files. Use after adding features, phases, tasks, or changing scope. Detects what changed, updates STATUS.md, master-tracker, dependency-map, timeline, handoff, and DEVLOG automatically.
args: change_description
allowed_tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

# /plan-changed — Propagate Plan Changes to All Trackers

Systematically updates all tracking files after a plan modification. This command does the same work as the `plan-change-detector` hook but can be invoked manually for deliberate, large-scope plan changes.

## Usage

```
/plan-changed Added SMS notification feature to Phase 3
/plan-changed Deferred analytics dashboard to Phase 6
/plan-changed
```

If no description is provided, the command will auto-detect changes from git.

## Protocol

### Step 1: Detect What Changed

If `{{args}}` is provided, use it as context. Additionally, scan for recent planning file changes:

```bash
# Modified planning files (unstaged)
git diff --name-only HEAD 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'

# Modified planning files (staged)
git diff --cached --name-only 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'

# New untracked planning files
git ls-files --others --exclude-standard 2>/dev/null | grep -E '(dev_docs/tasks/|dev_docs/specs/|dev_docs/sprints/|dev_docs/completeness/|dev_docs/phases/)'
```

If nothing detected and no description provided, ask the user what changed.

### Step 2: Classify the Change

Read the changed planning files and classify:

| Pattern | Classification |
|---|---|
| New task files in `dev_docs/tasks/` | **add task** |
| New spec files in `dev_docs/specs/` + new task files | **add feature** |
| New `dev_docs/tasks/phase-N/` directory | **add phase** |
| Task files deleted or marked "DEFERRED" | **defer** |
| Task files deleted or marked "REMOVED" | **remove** |
| Existing task files with substantial edits | **scope change** |
| Sprint file modifications | **sprint reassignment** |

### Step 3: Read Current State

Read all tracking files that exist:

1. `dev_docs/STATUS.md` (required — abort if missing)
2. `dev_docs/tracker/master-tracker.md` (if exists)
3. `dev_docs/tracker/dependency-map.md` (if exists)
4. `dev_docs/tracker/timeline.md` (if exists)
5. `dev_docs/tracker/milestones.md` (if exists)
6. `dev_docs/handoff.md` (required)
7. `dev_docs/DEVLOG.md` (required)

Also read the changed planning files to extract:
- Task IDs and titles
- Phase assignments
- Dependencies (blocked-by, depends-on)
- Effort estimates

### Step 4: Apply Updates

Follow the PLAN-CHANGE-PROTOCOL.md checklist. Use the Change Type Quick Reference table to determine which files need updating:

| Change Type | STATUS | tracker | deps | timeline | milestones | handoff | DEVLOG |
|---|---|---|---|---|---|---|---|
| Add feature | YES | YES | YES | YES | maybe | YES | YES |
| Add phase | YES | YES | YES | YES | YES | YES | YES |
| Add task | YES | YES | maybe | YES | no | YES | YES |
| Modify scope | no | YES | maybe | maybe | no | YES | YES |
| Defer | YES | YES | YES | YES | maybe | YES | YES |
| Remove | YES | YES | YES | YES | maybe | YES | YES |
| Sprint reassignment | YES | YES | no | YES | no | YES | YES |

For each file, match the existing formatting conventions exactly:
- STATUS.md: match checkbox style, phase header format, count format
- master-tracker.md: match table format, subtask ID convention, status values
- dependency-map.md: match dependency notation
- DEVLOG.md: use `### [TIMESTAMP] PLAN CHANGE:` format

### Step 5: Validate

Run the consistency check:

```bash
node scripts/propagate-plan-change.js [dev_docs_path]
```

If any FAIL results, fix the discrepancies before reporting.

### Step 6: Report

Output a structured report:

```
PLAN CHANGE PROPAGATED
======================
Change: {description}
Type: {add feature | add phase | add task | defer | remove | scope change | sprint reassignment}

Planning files ({count}):
  - {path} (NEW | MODIFIED | DELETED)
  ...

Trackers updated:
  - STATUS.md — {what changed} (before → after counts)
  - master-tracker.md — {what changed}
  - dependency-map.md — {what changed}
  - timeline.md — {what changed}
  - handoff.md — noted plan change
  - DEVLOG.md — appended plan change entry

Validation: {PASS | PASS WITH WARNINGS}
======================
```

## Rules

- **Read before writing** — always read the current state of each tracking file before modifying it
- **Preserve formatting** — match existing conventions in each file exactly
- **Never create tracking files** — only update files that already exist. If master-tracker.md doesn't exist yet, skip it
- **Abort if STATUS.md missing** — if `dev_docs/STATUS.md` doesn't exist, abort with a message to run Step 9 first
- **Validate after updating** — always run `propagate-plan-change.js` to verify consistency
- **Log everything** — the DEVLOG.md entry should list every file created and every file updated
- **Ask if ambiguous** — if the change classification is unclear, ask the user before proceeding
