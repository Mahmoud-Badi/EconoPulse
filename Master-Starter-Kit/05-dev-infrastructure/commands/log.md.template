# /log — Log Work Session

Record the current work session to the project work log with git data and session summary.

## Configuration
- **Project root:** `{{PROJECT_ROOT}}`
- **Work log path:** `{{WORK_LOG_PATH}}`
- **Date format:** `{{DATE_FORMAT}}`
- **Git remote:** `{{GIT_REMOTE}}`

## Steps

### Step 1 — Gather Git Data
Run the following commands from `{{PROJECT_ROOT}}`:

```bash
git log --oneline --since="today"
```

If no commits today, try:
```bash
git log --oneline -10
```

Also run:
```bash
git diff --stat HEAD~5
```

Capture:
- Commit hashes and messages from today
- Files changed count, insertions, deletions
- Branch name from `git branch --show-current`

### Step 2 — Read Existing Work Log
Read the work log file at `{{WORK_LOG_PATH}}`.
Parse existing entries to understand the format and find the insertion point.
If the file does not exist, create it with a header section.

### Step 3 — Summarize Session
Based on git data and the conversation history, generate:
- **Summary:** 1-3 sentence description of what was accomplished
- **Deliverables:** Bullet list of concrete outputs (files created, features built, bugs fixed)
- **Files changed:** Grouped by area (backend, frontend, config, docs, tests)
- **Metrics:** Lines added/removed, test count delta, new files count

### Step 4 — Compose Entry
Create a new work log entry using this format:

```markdown
## {{DATE_FORMAT}} — [Session Title]

**Branch:** `branch-name`
**Commits:** N commits
**Duration:** ~Xh (estimated from commit spread)

### Summary
[1-3 sentence description]

### Deliverables
- [Concrete output 1]
- [Concrete output 2]

### Files Changed
| Area      | Files | +Lines | -Lines |
|-----------|-------|--------|--------|
| Backend   | N     | +X     | -Y     |
| Frontend  | N     | +X     | -Y     |
| Tests     | N     | +X     | -Y     |
| Docs      | N     | +X     | -Y     |
| Config    | N     | +X     | -Y     |
| **Total** | **N** | **+X** | **-Y** |

### Commits
- `abc1234` — commit message 1
- `def5678` — commit message 2

### Notes
[Any blockers, decisions, or follow-up items]
```

### Step 5 — Write Entry
Insert the new entry at the top of the work log (below the header).
Preserve all existing entries unchanged.
Confirm the entry was written successfully.

### Step 6 — Report
Print a brief confirmation:
```
Work log updated: {{WORK_LOG_PATH}}
Session: [title] | Commits: N | Files: N | +X/-Y lines
```

## Notes
- Always insert new entries at the top (most recent first)
- If no git commits exist for today, still log the session with a note about uncommitted work
- Estimate duration from first-to-last commit timestamp spread, or note "single session"
- Group file changes by project area, not by individual file
- Include the branch name to help correlate with PR/task tracking
