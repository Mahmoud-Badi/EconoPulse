---
name: update-state
description: Quick-update all state files after completing a task. Updates STATUS.md, handoff.md, DEVLOG.md, and master-tracker.md in one pass.
arguments:
  - name: task_id
    description: "The task ID that was just completed (e.g., 'T-042')"
    required: true
  - name: outcome
    description: "Brief description of what was accomplished"
    required: true
---

# /project:update-state Command

One-shot command to update all state files after completing a task. Eliminates the friction of updating each file individually — which is the primary reason state updates get skipped.

## Usage

```
/project:update-state T-042 "Implemented JWT auth with refresh token rotation, 14 tests passing"
```

## Arguments

| Argument | Required | Description | Example |
|---|---|---|---|
| `task_id` | Yes | Task or subtask ID from STATUS.md | `T-042`, `T-042.3` |
| `outcome` | Yes | What was accomplished (1-2 sentences) | `"Built auth service with bcrypt + rate limiting"` |

## Behavior

### 1. Update STATUS.md

Read `dev_docs/STATUS.md` and:

- Find the task matching `{{task_id}}`
- Toggle its checkbox: `[ ]` to `[x]`
- Recalculate the phase completion count and percentage
- Find the next uncompleted task in the same phase and set it as "Active Task"
- If all tasks in the phase are complete, mark the phase as complete

```markdown
# Example: Before
## Phase 2: Core Services (3/8 complete — 37%)
Active Task: {{task_id}} — {{TASK_NAME}}
- [ ] {{task_id}} — {{TASK_NAME}}

# Example: After
## Phase 2: Core Services (4/8 complete — 50%)
Active Task: {{NEXT_TASK_ID}} — {{NEXT_TASK_NAME}}
- [x] {{task_id}} — {{TASK_NAME}}
```

### 2. Update handoff.md

Read `dev_docs/handoff.md` and:

- Set **"Last Completed"** to: `{{task_id}} — {{outcome}}`
- Set **"Next Action"** to: the next uncompleted task (same one set as Active in STATUS.md), including its file path if a spec exists
- Update **"Blockers"** only if the outcome mentions blockers; otherwise leave unchanged
- Increment **"Session Progress"** completed count

```markdown
## Last Completed
{{task_id}} — {{outcome}}

## Next Action
{{NEXT_TASK_ID}} — {{NEXT_TASK_NAME}}
Spec: dev_docs/specs/{{NEXT_TASK_SPEC}} (if exists)
Dependencies: {{DEPENDENCIES}} (if any)
```

### 3. Append to DEVLOG.md

Append a new entry to `dev_docs/DEVLOG.md`:

```markdown
### [{{TIMESTAMP}}] Task {{task_id}}: {{TASK_NAME}}

{{outcome}}

**Files modified:**
{{FILES_MODIFIED_LIST}}

**Decisions:** {{DECISIONS_OR_NONE}}
**Issues:** {{ISSUES_OR_NONE}}
```

To populate `{{FILES_MODIFIED_LIST}}`, run:

```bash
git diff --name-only HEAD~1 2>/dev/null || git diff --name-only
```

Use the actual file list from git, not a placeholder.

`{{TIMESTAMP}}` should use ISO 8601 format: `YYYY-MM-DD HH:MM` in the project's local timezone.

### 4. Update master-tracker.md (if exists)

If `dev_docs/tracker/master-tracker.md` exists:

- Find all subtasks under `{{task_id}}`
- Set their status to `complete`
- Set their `completed` date to today
- Check if completing these subtasks unblocks other tasks — if so, update their `blocked-by` fields

If the file does not exist, skip this step silently.

### 5. Update CONTEXT-RECOVERY.md (if exists)

If `dev_docs/CONTEXT-RECOVERY.md` exists:

- Update "Current State" with the new active task
- Add `{{task_id}}` to "Recent Changes"

If the file does not exist, skip this step silently.

### 6. Print Summary

After all updates, print a confirmation:

```
State files updated for {{task_id}}:
  STATUS.md        ✓  ({{PHASE_NAME}}: {{DONE}}/{{TOTAL}} — {{PERCENT}}%)
  handoff.md       ✓  (Next: {{NEXT_TASK_ID}} — {{NEXT_TASK_NAME}})
  DEVLOG.md        ✓  (Entry appended at {{TIMESTAMP}})
  master-tracker   ✓  ({{SUBTASK_COUNT}} subtasks marked complete)  [or "skipped — file not found"]
  context-recovery ✓  (Current state updated)                      [or "skipped — file not found"]
```

## Error Handling

| Scenario | Behavior |
|---|---|
| `{{task_id}}` not found in STATUS.md | Warn: "Task {{task_id}} not found in STATUS.md. Update manually." Still update handoff.md and DEVLOG.md. |
| STATUS.md doesn't exist | Error: "dev_docs/STATUS.md not found. Run /project:bootstrap first." |
| handoff.md doesn't exist | Error: "dev_docs/handoff.md not found. Run /project:bootstrap first." |
| DEVLOG.md doesn't exist | Create it with a header, then append the entry. |
| Task already marked complete | Warn: "Task {{task_id}} is already marked complete. Skipping STATUS.md update." Still update other files. |

## When to Use

- After completing any task from STATUS.md
- After completing a subtask from master-tracker.md
- After finishing a bug fix or hotfix
- After any work session, even if the task isn't fully complete (use outcome to note partial progress)

## When NOT to Use

- During planning phases (Steps 0-5 of ORCHESTRATOR) — state files may not exist yet
- For read-only operations (code review, spec reading) — no task was completed
- When updating state files manually — this command IS the update

## Relationship to Post-Task Protocol

This command implements the Post-Task Protocol defined in `03-documentation/state-files/POST-TASK-PROTOCOL.md`. The protocol defines WHAT must be updated; this command is the tool for HOW to update it efficiently.

The `post-task-protocol` hook (Stop event) checks whether state files were updated. If you use this command after every task, the hook will never fire a reminder — because the files will always be current.
