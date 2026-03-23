---
name: session-end
description: End a development session by running checks, updating state files, and preparing handoff for the next session.
---

# Session End

You are ending a development session. Follow this protocol exactly.

## Step 1: Run All Checks

Run these commands and report results:

```bash
{test_command}       # Run all tests
{type_check_command}  # TypeScript / type checking
{build_command}       # Full production build
```

**All three must pass.** If any fail, fix them before proceeding. Do NOT end a session with a broken build.

## Step 2: Three-Way Verification

For each task completed this session:
1. **Check code** — does the implementation match task requirements?
2. **Check hub** — is the service hub updated with any new endpoints/components/routes?
3. **Check tests** — do tests pass and cover the new functionality?

If any are out of sync, fix them now.

## Step 3: Update STATUS.md

Update the project's STATUS.md with:
- Mark completed tasks as done
- Update task counts and completion percentage
- Note any new blockers discovered

## Step 4: Update handoff.md

Write a handoff for the next session:

```markdown
# Session Handoff
Updated: {date}

## Completed This Session
- {task id}: {what was done}

## Next Task
{task id}: {specific description of what to do next}

## Context for Next Session
- {any gotchas discovered}
- {files that were modified}
- {decisions made and why}

## Blockers
- {any unresolved issues}

## Modified Files (not yet tested)
- {list any files changed but not yet fully verified}
```

## Step 5: Append to DEVLOG.md

Add a session entry:

```markdown
## Session {date}

### Completed
- {task}: {description}

### Key Decisions
- {any architectural or implementation decisions}

### Discoveries
- {gotchas, patterns, or lessons learned}

### Next
- {what the next session should do}
```

## Step 6: Update Memory (If Needed)

If you discovered new patterns, gotchas, or lessons:
- Update the appropriate memory topic file (testing.md, debugging.md, etc.)
- Keep MEMORY.md hub under 200 lines

## Rules

- **Never skip the checks** — a broken build costs the next session 20+ minutes
- **Be specific in handoff** — "continue auth work" is bad; "implement JWT refresh token rotation in auth.service.ts, tests exist but refresh endpoint returns 401" is good
- **Include file paths** — the next session may be a fresh context with zero knowledge
- **Note what you tried** — if something didn't work, say what you attempted so it's not repeated
