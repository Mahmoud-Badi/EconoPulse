---
name: generate-task
description: Create a full task file with context header and acceptance criteria
args: description
allowed_tools:
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

# /generate-task — Task File Generator

Create a structured task file with context header, requirements, and acceptance criteria.

## Usage

```
/generate-task <brief description>
```

## Steps

### Step 1: Parse the Description

From the user's description, determine:
- Which service/module this task belongs to
- Task type: feature, bugfix, refactor, test, security, infrastructure
- Estimated complexity: S (< 1h), M (1-4h), L (4-8h), XL (8h+)

### Step 2: Generate Context Header

List 5-8 files the developer should read before starting:

```markdown
## Context (read these before starting)
- `STATUS.md` — current phase and sprint
- `{service_hub_path}` — service documentation
- `{primary_code_file}` — main file to modify
- `{related_code_file}` — related code for context
- `{test_file}` — existing tests to extend
```

### Step 3: Write Task File

```markdown
# {TASK-ID}: {Title}

**Service:** {service_name}
**Type:** {feature | bugfix | refactor | test | security}
**Priority:** {P0 | P1 | P2}
**Effort:** {S | M | L | XL}
**Sprint:** {sprint_id}

## Context (read these before starting)
- {5-8 file paths}

## Description
{Clear description of what needs to be done and why}

## Requirements
1. {Specific requirement 1}
2. {Specific requirement 2}
3. {Specific requirement 3}

## Acceptance Criteria
- [ ] {Criterion 1 — testable and specific}
- [ ] {Criterion 2}
- [ ] {Criterion 3}
- [ ] Tests pass (`{test_command}`)
- [ ] Build succeeds (`{build_command}`)
- [ ] Hub file updated if endpoints/components changed

## Anti-Patterns to Avoid
- {Relevant anti-patterns for this type of task}

## Notes
- {Any gotchas, edge cases, or related issues}
```

### Step 4: Determine Task ID

Follow the project's task numbering convention:
- Check existing task files for the latest ID
- Increment appropriately
- Use the project's prefix convention (e.g., `QS-`, `CC-`, `MP-`)

### Step 5: Write and Confirm

Write the task file to the project's task directory. Display the task summary to the user.

### Step 6: Propagate to Trackers

After writing the task file, update all tracking files per the Plan Change Protocol:

1. **STATUS.md** — Add task checkbox under the correct phase section, increment phase task count, update completion percentage
2. **master-tracker.md** (if exists) — Add 5-15 subtask rows for the new task with `not-started` status
3. **dependency-map.md** (if exists) — Add dependency entries based on the task's dependencies
4. **timeline.md** (if exists) — Assign the task to the appropriate week
5. **handoff.md** — Note the new task under "Key Decisions"
6. **DEVLOG.md** — Append plan change entry: `### [TIMESTAMP] PLAN CHANGE: Added task {TASK_ID}`

This step is mandatory. A task file without a STATUS.md entry is invisible to the execution pipeline.

Reference: `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`
