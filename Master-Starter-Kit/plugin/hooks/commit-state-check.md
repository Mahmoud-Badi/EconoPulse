---
name: commit-state-check
description: Before committing, verify state files are current. Blocks commit if STATUS.md hasn't been updated to reflect completed work.
event: PreToolUse
tool: Bash
---

# Commit State Check Hook

A pre-commit gate that prevents committing code changes without updating state files. Stronger than the existing `pre-commit-quality` hook — this one blocks the commit rather than just warning.

## Trigger

Activates when the **Bash** tool is called with a command containing `git commit`. Does not trigger on other git commands (`git add`, `git push`, `git status`, etc.).

## Detection

Check if the Bash command matches a commit pattern:

```
git commit
git commit -m
git commit -am
git commit --amend
```

If the command does not contain `git commit`, **skip all checks** and allow the command to proceed.

## Behavior

### Step 1: Identify what's being committed

```bash
# List all files staged for commit
git diff --cached --name-only
```

### Step 2: Classify staged files

Separate into:
- **Code/content files**: files NOT in `dev_docs/`
- **State files**: `dev_docs/STATUS.md`, `dev_docs/handoff.md`, `dev_docs/DEVLOG.md`, `dev_docs/tracker/master-tracker.md`

### Step 3: Check for state file staleness

If code/content files are staged BUT none of the required state files are staged:

```
===================================================================
COMMIT BLOCKED: State files are stale.

You modified code but didn't update tracking files.
Staged code files:
  - src/components/Header.tsx
  - src/lib/api.ts

Missing from staging:
  - [ ] dev_docs/STATUS.md — not staged (mark completed tasks)
  - [ ] dev_docs/handoff.md — not staged (update last completed / next action)
  - [ ] dev_docs/DEVLOG.md — not staged (append work entry)

Update these files, stage them, then commit.
===================================================================
```

**Result: Block the commit.** Output the message and do not execute the git commit command.

### Step 4: Partial state file updates

If SOME but not all required state files are staged, warn but allow:

```
WARNING: Partial state file update detected.
Missing from staging:
  - [ ] dev_docs/DEVLOG.md — not staged

Proceeding with commit. Update the missing file in a follow-up commit.
```

### Step 5: All state files current

If all required state files are staged alongside code files, proceed silently.

### Step 6: State-only or docs-only commits

If the commit contains ONLY state files or ONLY documentation (no code changes), proceed silently. State file updates don't require additional state file updates.

## Rules

- **Block when no state files are staged** — this is a hard gate, not advisory
- **Warn when partial** — some state files staged but not all
- **Pass silently when complete** — don't add noise to clean commits
- **Skip when no code files** — state-only commits don't need this check
- **Skip if `dev_docs/STATUS.md` doesn't exist** — project hasn't set up state files yet
- **Only check staged files** — unstaged changes are irrelevant to the commit
- **Fast** — must complete in under 2 seconds

## Relationship to pre-commit-quality

This hook complements `pre-commit-quality.md`:
- `pre-commit-quality` checks code quality (any types, console.log, TODOs) — warns only
- `commit-state-check` checks process compliance (state files updated) — blocks

Both should run on `git commit`. This hook should run first (process gate before quality gate).
