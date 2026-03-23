---
name: resume
description: Resume the ORCHESTRATOR from where it left off after a context reset. Reads the STATE BLOCK, reconstructs context, and continues automatically.
allowed_tools:
  - Agent
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - Bash
  - AskUserQuestion
---

# /resume — Resume Orchestrator

Pick up exactly where the ORCHESTRATOR left off after a context reset, session break, or compaction.

## Protocol

### 1. Read State (3 files, parallel)

Read these files simultaneously:

1. **ORCHESTRATOR.md** — Find the `STATE BLOCK` section. Extract:
   - `CURRENT_STEP` — the step to resume from
   - `COMPLETED` — array of finished steps
   - `PROJECT_NAME`, `PROJECT_SLUG`, `STACK_DETECTED`
   - `CONFIG` — all resolved project variables
   - `IN_PROGRESS` — if present, a partially-completed step with sub-step state

2. **dev_docs/STATUS.md** (if it exists) — Extract:
   - Current phase and sprint
   - Task progress counts
   - Any blockers or warnings

3. **dev_docs/.orchestrator-state.json** (if it exists) — Machine-readable state with:
   - Timing data per step
   - Gate decisions
   - Error history

### 2. Detect Resume Point

Determine the exact resume point:

```
IF IN_PROGRESS exists:
  → Resume mid-step at the substep indicated
  → Show what was already generated vs what remains
  → Example: "Step 5 was interrupted. 8/12 service specs generated. Resuming with: inventory, reporting, notifications, analytics."

ELSE IF CURRENT_STEP > 0:
  → Resume at the CURRENT_STEP
  → Example: "Resuming at Step 5 (Service Specs). Steps 0-4 completed."

ELSE:
  → No progress detected. Ask: "No previous progress found. Run /bootstrap to start fresh?"
```

### 3. Present Resume Briefing

Display:

```
ORCHESTRATOR RESUME
===================
Project: {PROJECT_NAME}
Stack: {STACK_DETECTED}
Progress: Step {CURRENT_STEP} of 28 ({percent}%)
Completed: {COMPLETED array, comma-separated}

RESUME POINT
============
Step {N}: {step title}
{If IN_PROGRESS: "Partial — {done_count}/{total_count} items complete"}
{If GATE pending: "Gate approval pending from last session"}

CONFIG SNAPSHOT
===============
Framework: {FRONTEND_FRAMEWORK} + {BACKEND_FRAMEWORK}
Database: {DATABASE}
Auth: {AUTH_STRATEGY}
Services: {SERVICE_COUNT} | Screens: {SCREEN_COUNT}
Gate Mode: {GATE_MODE or "manual"}
```

### 4. Continue Execution

After presenting the briefing, **immediately continue executing the ORCHESTRATOR** from the resume point. Do NOT ask "Ready to proceed?" — the user invoked this command because they want to continue.

Follow the same step-by-step protocol as the ORCHESTRATOR defines, including:
- Gate checkpoints (respect `GATE_MODE` setting)
- State block updates after each step
- Progress counts and completeness checks

### 5. If State is Corrupted

If the STATE BLOCK is inconsistent (e.g., CURRENT_STEP says 5 but COMPLETED includes steps after 5):

1. List the inconsistencies found
2. Scan `dev_docs/` for actually-generated files to determine true progress
3. Propose a corrected state
4. Ask user to confirm before proceeding

## Rules

- **Never re-run completed steps** unless the user explicitly asks to redo one
- **Preserve all existing generated files** — do not overwrite manual edits
- **Update the STATE BLOCK** after resuming successfully
- **If dev_docs/.orchestrator-state.json exists**, prefer it over parsing the markdown STATE BLOCK (it's more reliable)
