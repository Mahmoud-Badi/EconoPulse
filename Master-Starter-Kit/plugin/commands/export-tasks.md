---
name: export-tasks
description: Export generated task files to GitHub Issues, CSV, or JSON for import into project management tools (Jira, Linear, Notion).
allowed_tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

# /export-tasks — Export Tasks to PM Tools

Parse all generated task files from `dev_docs/tasks/` and export them in a format compatible with project management tools.

## Protocol

### 1. Scan Task Files

```
Glob: dev_docs/tasks/**/*.md
```

For each task file, extract:
- **Title** (from `# heading` or `task_id` field)
- **Phase** (from directory path)
- **Priority** (P0/P1/P2)
- **Type** (feature/bugfix/refactor/infrastructure)
- **Estimated effort** (if present)
- **Dependencies** (other task IDs)
- **Service** (which service this task belongs to)
- **Description** (first paragraph or summary section)
- **Acceptance criteria** (if present)

### 2. Ask Export Format

Ask the user:

> Export format?
> 1. **GitHub Issues** — creates issues directly via `gh issue create` (requires `gh` CLI)
> 2. **CSV** — universal import file for Jira, Linear, Notion, Asana
> 3. **JSON** — structured data for API imports or custom tooling
> 4. **All three** — generate all formats

### 3. Generate Export

#### GitHub Issues

For each task, run:
```bash
gh issue create \
  --title "{task title}" \
  --body "{description + acceptance criteria}" \
  --label "{priority},{type},{phase}" \
  --milestone "{phase name}"
```

- Create labels if they don't exist (P0, P1, P2, feature, bugfix, etc.)
- Create milestones for each phase if they don't exist
- Rate-limit to avoid API throttling (1 per second)
- Report: "{N} issues created, {M} labels created, {K} milestones created"

#### CSV

Generate `dev_docs/exports/tasks.csv` with columns:
```
ID,Title,Phase,Priority,Type,Service,Effort,Dependencies,Description,Acceptance Criteria
```

#### JSON

Generate `dev_docs/exports/tasks.json`:
```json
{
  "exported_at": "ISO timestamp",
  "project": "{PROJECT_NAME}",
  "task_count": N,
  "tasks": [
    {
      "id": "task-001",
      "title": "...",
      "phase": "...",
      "priority": "P0",
      "type": "feature",
      "service": "...",
      "effort": "...",
      "dependencies": [],
      "description": "...",
      "acceptance_criteria": []
    }
  ]
}
```

### 4. Report

```
TASK EXPORT COMPLETE
====================
Tasks exported: {count}
Format: {format(s)}
Output: {file path(s) or "GitHub Issues created"}

By phase:
  Phase 0 (Foundation): {count} tasks
  Phase 1 ({name}): {count} tasks
  Phase 2 ({name}): {count} tasks
  ...

By priority:
  P0: {count} | P1: {count} | P2: {count}
```

## Rules

- **GitHub Issues mode requires `gh` CLI** — check with `gh auth status` before proceeding
- **Do not create duplicate issues** — check existing issues first with `gh issue list`
- **Preserve task dependencies** — include "Depends on: #X" in issue body
- **CSV uses RFC 4180 format** — properly escape quotes and commas
