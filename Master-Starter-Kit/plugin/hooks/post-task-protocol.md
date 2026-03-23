---
name: post-task-protocol
description: Enforces state file updates after every task or subtask completion. Fires on Stop event to check if work was done without updating tracking files.
event: Stop
---

# Post-Task Protocol Hook

Prevents progressive discipline decay by verifying that state files are updated whenever code or documentation work is performed. This is the primary enforcement mechanism against "silent progress" — completing tasks without updating tracking infrastructure.

## Trigger

Activates on the **Stop** event — after every response where Claude Code finishes work. This means every turn is checked, not just commits.

## Behavior

### Step 1: Detect if work was performed

Check whether any substantive work happened in this turn:

```bash
# Check for file modifications in the working tree
git diff --name-only HEAD 2>/dev/null
# Also check staged files
git diff --cached --name-only 2>/dev/null
```

If no files were modified (pure read-only, Q&A, or planning turn), **skip all checks** — no reminder needed.

### Step 2: Classify modified files

Separate modified files into two categories:

- **Code/content files**: anything NOT in `dev_docs/` — these represent "real work"
- **State files**: files inside `dev_docs/` that track progress

### Step 3: Check state file freshness

If code/content files were modified, verify that these state files were ALSO modified (in this turn or in staged changes):

| State File | What to Check | Required |
|---|---|---|
| `dev_docs/STATUS.md` | Checkbox toggled or status text changed | Always |
| `dev_docs/handoff.md` | "Last Completed" and "Next Action" updated | Always |
| `dev_docs/DEVLOG.md` | New work entry appended | Always |
| `dev_docs/tracker/master-tracker.md` | Subtask status updated | Only if file exists |
| `dev_docs/CONTEXT-RECOVERY.md` | Current state updated | Only if file exists |
| `dev_docs/ARCH-ANCHOR.md` | Architecture snapshot updated | Only if architecture-affecting files were modified |

### Step 4: Output reminder if state files are stale

If any required state file was NOT updated, output this reminder:

```
===================================================================
POST-TASK PROTOCOL: You completed work but didn't update tracking files.

Missing updates:
- [ ] STATUS.md — mark completed task(s), update phase percentage
- [ ] handoff.md — update "Last Completed" and "Next Action"
- [ ] DEVLOG.md — append work entry with timestamp
- [ ] master-tracker.md — update subtask status

Update these files NOW before proceeding to the next task.

Reference: 03-documentation/state-files/POST-TASK-PROTOCOL.md
===================================================================
```

Only list the state files that are actually missing updates — omit files that were already updated. If master-tracker.md or CONTEXT-RECOVERY.md don't exist, omit them from the list entirely.

### Step 5: If all state files are current

Output nothing. Silent success — don't clutter the conversation when discipline is being followed.

### Step 6: Conditional ARCH-ANCHOR reminder

If the modified files include any that affect system architecture (schema, migration, auth config,
router definitions, API contracts, middleware, database config), AND `dev_docs/ARCH-ANCHOR.md` exists
but was NOT modified this turn, append to the reminder:

```
- [ ] ARCH-ANCHOR.md — update if services, data model, API contracts, auth, or constraints changed
```

This is advisory, not blocking — not every code change needs an ARCH-ANCHOR update.

## Rules

- **Remind, don't block** — this hook cannot prevent Claude Code from proceeding, but the reminder should be prominent enough to trigger immediate action
- **Skip read-only turns** — if no files were modified, skip all checks
- **Skip state-only turns** — if the ONLY files modified are state files (e.g., updating STATUS.md itself), skip the check
- **Skip initial setup** — if `dev_docs/STATUS.md` doesn't exist yet (pre-Step 5), skip all checks
- **Fast** — this runs on every turn, so it must be near-instant
- **No false positives** — only fire when code/content files were genuinely modified

## Installation

This hook must be registered in the project's `.claude/settings.json` or `.claude/settings.local.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "cat '{{PROJECT_ROOT}}/Master-Starter-Kit/plugin/hooks/post-task-protocol.md'"
      }
    ]
  }
}
```

Alternatively, if using the Master Starter Kit's plugin system, the hook is automatically registered via `plugin/plugin.json`.

## Why This Exists

Claude Code follows strict processes during planning phases but gradually forgets to update state files during development. This "progressive discipline decay" happens because:

1. **Context compaction** drops process reminders while keeping code context
2. **Task momentum** causes Claude to rush to the next task without updating tracking
3. **No enforcement mechanism** — state file updates are mentioned in docs but never checked

This hook closes the enforcement gap by checking after every turn.
