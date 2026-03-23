---
description: Show GSD sprint execution status for the current project
argument-hint: Optional project path (defaults to current directory)
allowed-tools: ["Read", "Bash"]
---

Read the GSD state file for this project and show current sprint progress.

**Project path:** $ARGUMENTS (use current working directory if empty)

Steps:
1. Determine project path from $ARGUMENTS or current directory
2. Read `[project-path]/.gsd/state.json`
3. If not found: output "No active GSD sprint. Run `/gsd` to start."
4. If found, read the sprint definition from `.gsd/sprints/[sprint_id].json` for the sprint name
5. Compute eligible tasks: pending tasks whose dependencies are all completed
6. Output:

```
Sprint: [sprint_id] — [sprint name from definition]
Status: [in_progress | paused | completed | partial | aborted]
Progress: [completed]/[total] tasks ([pct]%)

Completed ([N]):
[list each completed task: task-id — title]

In Progress:
[current_task or "none"]

Blocked ([N]):
[list each blocked task: task-id — title]
  Reason: [blocked_reason]

Skipped by Cascade ([N]):
[list each skipped task: task-id — title]
  Blocked by: [cascade_blocked_by]

Eligible — Ready to Run ([N]):
[list each eligible task: task-id — title]

Pending — Waiting on Deps ([N]):
[list each pending-but-not-eligible task: task-id — title (deps: [unmet dep IDs])]

Last protocol update: after task [last_protocol_update_at_count]
Patterns version: [patterns_version]
Session: [session_count]
Reviews: [count of .md files in .gsd/reviews/]
```

7. If status is "completed", "partial", or "aborted": also show path to the final report file in `.gsd/reports/`.
8. If status is "paused": show the paused task ID, error summary, and available options (fix/skip/abort).
