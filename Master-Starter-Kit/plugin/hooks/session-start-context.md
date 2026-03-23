---
name: session-start-context
description: Automatically loads relevant project context at the start of every session
event: SessionStart
---

# Session Start Context Hook

Automatically loads project context when a new Claude Code session starts.

## Behavior

At session start, read and present key context files:

1. **Check for STATUS.md** — search for `STATUS.md` in the project root and documentation directories
2. **Check for handoff.md** — search for `handoff.md` in the project root and documentation directories
3. **Check for MEMORY.md** — check the Claude auto-memory directory

## Output

If state files are found, present a brief status:

```
Project Status: {phase} — {sprint} — {done}/{total} tasks ({percent}%)
Last Session: {one-line summary from handoff.md}
Next Task: {task from handoff.md}
```

If no state files found: "No project state files found. Use /bootstrap to set up project infrastructure."

## Rules

- **Quick and quiet** — this runs on every session start, keep it under 2 seconds
- **Read-only** — never modify files during this hook
- **Fail silently** — if files don't exist, don't error, just skip
- **Don't overwhelm** — show 3-4 lines max, not the full STATUS.md
