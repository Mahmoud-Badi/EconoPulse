# Claude Code PostToolUse Hooks Guide

## Overview

PostToolUse hooks run shell commands automatically after Claude uses specific tools. They provide instant feedback loops: edit a TypeScript file and type errors appear immediately; edit a test file and test results show up right away; write any TS file and Biome auto-formats it.

Hooks are configured per-project in `{project}/.claude/settings.json`.

## How Hooks Work

1. Claude uses a tool (Edit, Write, Read, Bash, etc.)
2. Claude Code checks if the tool + file path matches any hook's `matcher` pattern
3. If matched, the hook's command runs automatically
4. The command output is shown to Claude, who can act on errors

### Matcher Syntax

```
ToolName:glob_pattern
```

- `Edit:*.ts` -- Matches when the Edit tool modifies any `.ts` file
- `Write:*.tsx` -- Matches when the Write tool creates/overwrites any `.tsx` file
- `Edit:*.test.*` -- Matches test files with any extension
- Multiple matchers are separated by `|`: `Edit:*.ts|Write:*.ts`

### Available Variables

- `{PROJECT_ROOT}` -- Absolute path to the project root
- `$FILE` -- The file path that triggered the hook (for Write/Edit hooks)

## Proven Hook Configuration

**{project}/.claude/settings.json:**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit:*.ts|Edit:*.tsx|Write:*.ts|Write:*.tsx",
        "hooks": [
          {
            "type": "command",
            "command": "cd {PROJECT_ROOT} && npx tsc --noEmit 2>&1 | head -20",
            "timeout": 60000
          }
        ]
      },
      {
        "matcher": "Edit:*.test.*|Write:*.test.*",
        "hooks": [
          {
            "type": "command",
            "command": "cd {PROJECT_ROOT} && npx vitest run --reporter=verbose 2>&1 | tail -30",
            "timeout": 120000
          }
        ]
      },
      {
        "matcher": "Write:*.ts|Write:*.tsx",
        "hooks": [
          {
            "type": "command",
            "command": "cd {PROJECT_ROOT} && npx biome check --write $FILE 2>&1 | tail -10",
            "timeout": 30000
          }
        ]
      }
    ]
  }
}
```

## Hook Details

### Hook 1: Auto-Typecheck

```json
{
  "matcher": "Edit:*.ts|Edit:*.tsx|Write:*.ts|Write:*.tsx",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT} && npx tsc --noEmit 2>&1 | head -20",
      "timeout": 60000
    }
  ]
}
```

**What it does**: Runs TypeScript type checking after any `.ts` or `.tsx` file is edited or written. Shows the first 20 lines of output (enough to see errors without overwhelming Claude).

**Why `head -20`**: Full typecheck output on a large project can be hundreds of lines. The first 20 lines always contain the most relevant errors. Claude can run the full check manually if needed.

**Timeout**: 60 seconds. TypeScript checking in a monorepo can take 10-30 seconds.

**Triggers on**: Edit tool and Write tool for `.ts` and `.tsx` files.

### Hook 2: Auto-Test

```json
{
  "matcher": "Edit:*.test.*|Write:*.test.*",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT} && npx vitest run --reporter=verbose 2>&1 | tail -30",
      "timeout": 120000
    }
  ]
}
```

**What it does**: Runs the full test suite after any test file is modified. Shows the last 30 lines (which contain the test summary and any failures).

**Why `tail -30`**: Test output starts with passing tests and ends with failures and summary. The last 30 lines capture what matters.

**Timeout**: 120 seconds. Test suites with database operations or complex fixtures can take over a minute.

**Triggers on**: Edit tool and Write tool for files matching `*.test.*` (covers `.test.ts`, `.test.tsx`, `.test.js`).

### Hook 3: Auto-Lint+Fix

```json
{
  "matcher": "Write:*.ts|Write:*.tsx",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT} && npx biome check --write $FILE 2>&1 | tail -10",
      "timeout": 30000
    }
  ]
}
```

**What it does**: Runs Biome lint and format on the specific file after it's written. The `--write` flag auto-fixes issues (formatting, import organization, simple lint fixes).

**Why Write only (not Edit)**: The Edit tool makes surgical changes that should preserve formatting. The Write tool creates or overwrites entire files, which benefit from a formatting pass.

**Why `$FILE`**: Linting a single file is faster than linting the entire project. `$FILE` expands to the path of the file that triggered the hook.

**Timeout**: 30 seconds. Single-file Biome checks complete in under 1 second; the timeout is generous for safety.

## Additional Hook Ideas

### Auto-Build Check (for CI-critical projects)

```json
{
  "matcher": "Write:next.config.*|Edit:next.config.*",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT} && pnpm build 2>&1 | tail -20",
      "timeout": 180000
    }
  ]
}
```

Runs a full build after config changes. Catches build-breaking config errors early.

### Schema Validation (for Drizzle projects)

```json
{
  "matcher": "Edit:**/schema/*.ts|Write:**/schema/*.ts",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT}/packages/db && npx drizzle-kit generate 2>&1 | tail -10",
      "timeout": 30000
    }
  ]
}
```

Generates Drizzle migrations after schema changes. Catches invalid schema definitions immediately.

### E2E Smoke Test (for UI-critical changes)

```json
{
  "matcher": "Write:**/app/**/page.tsx|Edit:**/app/**/page.tsx",
  "hooks": [
    {
      "type": "command",
      "command": "cd {PROJECT_ROOT}/apps/web && npx playwright test --project=chromium --grep='smoke' 2>&1 | tail -20",
      "timeout": 120000
    }
  ]
}
```

Runs smoke tests after page files change. Only practical if you have fast, tagged smoke tests.

## Performance Considerations

- **Keep hooks fast**: Each hook runs synchronously after the tool use. A 60-second typecheck adds 60 seconds of wait time.
- **Use `head` and `tail`**: Limit output to relevant lines. Sending 500 lines of output to Claude wastes context and token budget.
- **Limit scope**: Use `$FILE` for single-file operations (lint, format). Use project-wide commands only for cross-file checks (typecheck, test).
- **Reasonable timeouts**: Set timeouts based on observed run times plus a safety margin. A hook that times out produces no useful feedback.

## Troubleshooting

### Hook Not Running

1. Check the `matcher` pattern matches the tool and file extension
2. Tool names are case-sensitive: `Edit`, `Write`, `Read`, `Bash`
3. Glob patterns use `*` for single-level and `**` for recursive matching

### Hook Fails Silently

1. The `2>&1` redirect captures stderr. Without it, error output may be lost.
2. Check that the command works when run manually in the project directory.
3. Verify `{PROJECT_ROOT}` resolves correctly (it should be the git repository root).

### Hooks Are Too Slow

1. Replace project-wide typechecks with per-package: `cd {PROJECT_ROOT}/packages/api && npx tsc --noEmit`
2. Use `--filter` for package-specific tests: `pnpm test --filter @{project}/api`
3. Consider removing the test hook if your test suite is slow (>30 seconds) and running tests manually.
