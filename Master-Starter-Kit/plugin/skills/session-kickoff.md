---
name: session-kickoff
description: Start a development session by reading project state, finding the next task, and presenting a ready-to-code briefing. Use at the beginning of every session.
---

# Session Kickoff

You are starting a new development session. Follow this protocol exactly.

## Step 1: Read State Files (Max 4 Reads)

Read these files in order. Stop if any file doesn't exist.

1. **STATUS.md** — Find the project's STATUS.md and read it for current phase, sprint, and progress
2. **handoff.md** — Read for what to do this session (specific task + context from last session)
3. **CLAUDE.md** — Read the project's CLAUDE.md for architecture, conventions, and golden rules
4. **MEMORY.md** — Read the AI memory hub for persistent knowledge

## Step 2: Present Briefing

Display a concise briefing:

```
SESSION BRIEFING
================
Phase: {phase name} | Sprint: {sprint id}
Progress: {done}/{total} tasks ({percent}%)
Last session: {summary from handoff.md}

NEXT TASK
=========
{task id}: {task title}
Type: {feature/bugfix/refactor}
Priority: {P0/P1/P2}

FILES TO READ (before coding)
==============================
1. {task file path}
2. {service hub path}
3. {primary code file}
4. {secondary code file}

BLOCKERS / WARNINGS
===================
{any failing tests, known bugs, or notes from handoff}
```

## Step 3: Start Coding Immediately

Do NOT ask "Ready to proceed?" — present the briefing and immediately begin working on the next task.

Read the task file and up to 2 additional code files (staying within the max-6-files rule), then start implementing.

## Rules

- **Max 6 files before coding:** STATUS.md, handoff.md, task file, service hub, + 2 code files
- **Never ask for permission to start** — the user invoked this skill because they want to work
- **If no handoff.md exists**, check STATUS.md for the next pending task
- **If no STATUS.md exists**, ask the user what to work on
- **If tests are failing from last session**, fix those first before starting new work
