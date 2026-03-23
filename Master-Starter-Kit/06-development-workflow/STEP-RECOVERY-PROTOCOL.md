# Step Recovery Protocol

## When You Need This

Context resets happen. Claude Code's context window compacts, the session times out, or you close the terminal. This protocol ensures you lose zero work when resuming.

## How Recovery Works

### 1. Check IN_PROGRESS First

The ORCHESTRATOR STATE BLOCK has an `IN_PROGRESS` field:

```text
IN_PROGRESS: { step: "5", substep: "service-specs", done: ["auth","billing","crm"], remaining: ["inventory","reporting"] }
```

If `IN_PROGRESS` is populated:
- **Do NOT restart the step from scratch**
- Skip all items in `done` — they're already generated
- Resume with the first item in `remaining`
- After completing all remaining items, clear `IN_PROGRESS` and update `COMPLETED`

### 2. Check CURRENT_STEP

If `IN_PROGRESS` is empty, resume at `CURRENT_STEP`. This is the step that was about to start (or was in progress but didn't track sub-items).

### 3. Verify Existing Files

Before resuming, scan `dev_docs/` to detect what was actually generated:

```
Glob: dev_docs/services/*.hub.md    → count service hubs
Glob: dev_docs/specs/**/*-spec.md   → count service specs
Glob: dev_docs/tasks/**/*.md        → count task files
Glob: dev_docs/specs/screens/*.md   → count screen specs
```

Compare these counts against the CONFIG (SERVICE_COUNT, SCREEN_COUNT, etc.). If the file count matches the expected count for a step, mark that step as complete even if the STATE BLOCK doesn't reflect it.

### 4. Resolve Conflicts

If the STATE BLOCK says Step 5 is current but `dev_docs/services/` already has all expected hubs:
1. Log the discrepancy
2. Assume the step completed but the STATE BLOCK wasn't updated
3. Advance CURRENT_STEP to the next step
4. Ask user to confirm before proceeding

## What Each Step Generates (Quick Reference)

| Step | Generates | Location | Count Source |
|------|-----------|----------|-------------|
| 0 | Plugin configs, settings | `.claude/` | Fixed set |
| 1 | Project brief, feature list | `dev_docs/specs/` | 1 brief + 1 feature list |
| 2 | CLAUDE.md, AGENTS.md | Project root | Fixed set |
| 3 | Tribunal research | `dev_docs/specs/research/` | 60-100 files |
| 4 | Foundation docs | `dev_docs/foundations/` | ~10 files |
| 5 | Service specs + hubs | `dev_docs/services/`, `dev_docs/specs/services/` | CONFIG.SERVICE_COUNT |
| 6 | Screen specs | `dev_docs/specs/screens/` | CONFIG.SCREEN_COUNT |
| 7 | API contracts | `dev_docs/specs/api/` | Per service |
| 8 | Task files | `dev_docs/tasks/` | 6-8 per service |
| 9 | STATUS.md, sprint plan | `dev_docs/` | 1 each |
| 10-16 | Infrastructure, testing, design | Various | Step-dependent |

## Updating IN_PROGRESS

Claude must update `IN_PROGRESS` in the STATE BLOCK:

- **Before starting a multi-item substep:** Set `remaining` to the full list
- **After completing each item:** Move it from `remaining` to `done`
- **After completing all items:** Set `IN_PROGRESS: {}`

Example flow for Step 5 with 4 services:

```
Before: IN_PROGRESS: { step: "5", substep: "service-specs", done: [], remaining: ["auth","billing","inventory","reporting"] }
After auth: IN_PROGRESS: { step: "5", substep: "service-specs", done: ["auth"], remaining: ["billing","inventory","reporting"] }
After billing: IN_PROGRESS: { step: "5", substep: "service-specs", done: ["auth","billing"], remaining: ["inventory","reporting"] }
...
After all: IN_PROGRESS: {}
```

## The /resume Command

Use `/resume` to automate this entire protocol. It:
1. Reads the STATE BLOCK
2. Checks IN_PROGRESS
3. Scans dev_docs/ for actual file counts
4. Presents a resume briefing
5. Continues execution automatically

## Manual Recovery

If `/resume` isn't available or the state is badly corrupted:

1. Open `ORCHESTRATOR.md` and find the STATE BLOCK
2. Read `dev_docs/STATUS.md` for the latest progress counts
3. Tell Claude: "The STATE BLOCK shows Step {N}. I have {X} service hubs and {Y} task files. Resume from Step {N}."
4. Claude will reconcile the state and continue
