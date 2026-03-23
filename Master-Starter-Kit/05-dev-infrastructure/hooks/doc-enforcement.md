# Documentation Enforcement Hooks

Automated hooks that enforce documentation at every step — no manual invocation needed. These hooks make `/document-feature`, `/capture-screenshots`, and `/doc-quality-gate` fire automatically at the right moments.

---

## Overview

Three enforcement layers, all automated:

| Hook | Trigger | Action | Type |
|------|---------|--------|------|
| Task completion detector | STATUS.md edited with "DONE" | Injects `/document-feature` instruction to Claude | Claude Code hook |
| Phase transition gate | STATUS.md edited with "CURRENT_STEP" | Injects `/doc-quality-gate` instruction to Claude | Claude Code hook |
| Pre-commit doc check | `git commit` on feature code | Warns if `user_docs/` not updated | Git pre-commit hook |
| Session end reminder | Claude stops a session | Checks for undocumented completed tasks | Claude Code hook |

---

## Hook 1: Task Completion Detector

**When:** Claude edits STATUS.md and the edit contains "DONE"
**What:** Injects a reminder that Claude MUST run `/document-feature` before moving on.

This is the most important hook. It catches the exact moment a task is marked complete and forces documentation to happen while context is fresh.

### Claude Code Configuration

Add to `.claude/settings.json`:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/check-task-done.sh"
          }
        ]
      }
    ]
  }
}
```

### Helper Script: `hooks/check-task-done.sh`

```bash
#!/usr/bin/env bash
# check-task-done.sh — Detects when a task is marked DONE in STATUS.md
# Triggers documentation reminder for Claude Code

# Read the tool input from stdin (Claude Code pipes it)
INPUT=$(cat)

# Check if this edit targets STATUS.md and contains "DONE"
if echo "$INPUT" | grep -q "STATUS.md" && echo "$INPUT" | grep -q "DONE"; then
  # Check if /document-feature was already run in this session
  # by looking for recent changes in user_docs/
  RECENT_DOCS=$(find {{USER_DOCS_PATH}} -name "*.md" -newer dev_docs/STATUS.md 2>/dev/null | head -1)

  if [ -z "$RECENT_DOCS" ]; then
    echo "DOC_ENFORCEMENT: Task marked DONE. You MUST run /document-feature NOW."
    echo "Documentation must be captured while you still have full context."
    echo "Do not commit or start the next task until documentation is complete."
  fi
fi
```

---

## Hook 2: Phase Transition Gate

**When:** Claude edits STATUS.md and the edit contains "CURRENT_STEP"
**What:** Automatically triggers the documentation quality gate check.

### Helper Script: `hooks/check-phase-transition.sh`

```bash
#!/usr/bin/env bash
# check-phase-transition.sh — Detects phase transitions in STATUS.md
# Triggers documentation quality gate

INPUT=$(cat)

# Check if this edit is a phase transition (updating CURRENT_STEP)
if echo "$INPUT" | grep -q "STATUS.md" && echo "$INPUT" | grep -q "CURRENT_STEP"; then
  echo "DOC_ENFORCEMENT: Phase transition detected."
  echo "You MUST run /doc-quality-gate before proceeding to the next phase."
  echo "Documentation coverage must be >= 90% to pass."
fi
```

### Combined PostToolUse Configuration

Both scripts share the same hook entry. Create a combined dispatcher:

```bash
#!/usr/bin/env bash
# doc-enforcement-dispatcher.sh — Routes to the right enforcement check

INPUT=$(cat)

# Pass input to both checks
echo "$INPUT" | bash hooks/check-task-done.sh
echo "$INPUT" | bash hooks/check-phase-transition.sh
```

The `.claude/settings.json` entry simplifies to:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/doc-enforcement-dispatcher.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Hook 3: Pre-Commit Documentation Check

**When:** Developer (or Claude) runs `git commit`
**What:** Checks if feature code was changed without corresponding `user_docs/` changes.

This is a **git hook** (not a Claude Code hook). It runs in the git pre-commit phase.

### Installation

```bash
cp hooks/pre-commit-doc-gate.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Script: `hooks/pre-commit-doc-gate.sh`

See `pre-commit-doc-gate.template.sh` in this directory for the full template.

**Behavior:**
- **Soft mode (default):** Warns but allows the commit. Prints what documentation is missing.
- **Strict mode:** Blocks the commit if feature code is staged without doc updates. Enable by setting `DOC_GATE_STRICT=true` in your environment.

### What It Checks

1. Are any files in `{{APP_DIR}}/` or `{{PACKAGES_DIR}}/` staged for commit?
2. If yes, are any files in `{{USER_DOCS_PATH}}/` also staged?
3. If no docs are staged:
   - **Soft mode:** Print a warning, allow commit
   - **Strict mode:** Print the warning, block the commit

### Exceptions

The hook ignores commits that:
- Only touch configuration files (`.json`, `.yaml`, `.toml`, `.env`)
- Only touch test files (`*.test.*`, `*.spec.*`, `__tests__/`)
- Only touch documentation files (`*.md` outside of app code)
- Include `[skip-doc-check]` in the commit message

---

## Hook 4: Session End Reminder

**When:** Claude's session is about to end (Stop event)
**What:** Checks if any tasks were completed this session without documentation.

### Claude Code Configuration

```jsonc
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/session-end-doc-check.sh"
          }
        ]
      }
    ]
  }
}
```

### Helper Script: `hooks/session-end-doc-check.sh`

```bash
#!/usr/bin/env bash
# session-end-doc-check.sh — Checks for undocumented tasks before session ends

# Find tasks marked DONE today that might lack documentation
TODAY=$(date +%Y-%m-%d)

if [ -f "dev_docs/STATUS.md" ]; then
  # Check for tasks marked done today
  DONE_TODAY=$(grep -c "$TODAY.*DONE\|DONE.*$TODAY" dev_docs/STATUS.md 2>/dev/null || echo "0")

  # Check for doc changes today
  DOC_CHANGES=$(find {{USER_DOCS_PATH}} -name "*.md" -newer dev_docs/STATUS.md 2>/dev/null | wc -l)

  if [ "$DONE_TODAY" -gt "0" ] && [ "$DOC_CHANGES" -eq "0" ]; then
    echo "DOC_ENFORCEMENT: $DONE_TODAY task(s) completed today but no documentation was updated."
    echo "Run /document-feature before ending this session."
  fi
fi
```

---

## Complete Installation

### Full `.claude/settings.json` hooks section

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/doc-enforcement-dispatcher.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/session-end-doc-check.sh"
          }
        ]
      }
    ]
  }
}
```

### File Structure After Installation

```
project-root/
  hooks/
    doc-enforcement-dispatcher.sh    # Routes Edit/Write events
    check-task-done.sh               # Task completion detection
    check-phase-transition.sh        # Phase transition detection
    session-end-doc-check.sh         # Session end check
    pre-commit-doc-gate.sh           # Git pre-commit hook
  .git/hooks/
    pre-commit                       # Symlink or copy of pre-commit-doc-gate.sh
  .claude/settings.json              # Hooks configuration
```

### ORCHESTRATOR Step

These hooks are installed during **ORCHESTRATOR Step 15.5** (User Documentation), sub-step 7.

---

## Customization

### Disabling Hooks

To temporarily disable documentation enforcement:

```bash
# Disable git pre-commit hook
git commit --no-verify -m "emergency fix [skip-doc-check]"

# Disable Claude Code hooks (remove from settings temporarily)
# Or set environment variable:
export DOC_HOOKS_DISABLED=true
```

### Tuning Sensitivity

The `check-task-done.sh` script uses `find ... -newer` to detect if docs were already updated. If this produces false positives (e.g., docs were updated for a different task), you can add task ID tracking:

```bash
# In check-task-done.sh, extract the task ID from the STATUS.md edit
TASK_ID=$(echo "$INPUT" | grep -oP '[A-Z]+-\d+' | head -1)

# Check if this specific task has documentation
if [ -n "$TASK_ID" ] && ! grep -q "$TASK_ID" {{USER_DOCS_PATH}}/DOC-INDEX.md 2>/dev/null; then
  echo "DOC_ENFORCEMENT: Task $TASK_ID marked DONE but not found in DOC-INDEX.md."
fi
```
