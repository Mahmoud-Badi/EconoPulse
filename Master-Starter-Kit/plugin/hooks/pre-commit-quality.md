---
name: pre-commit-quality
description: Anti-pattern prevention check that runs before commits to catch common issues
event: PreToolUse
tool: Bash
---

# Pre-Commit Quality Hook

This hook intercepts `git commit` commands and runs a quick anti-pattern check before allowing the commit.

## Trigger

Activates when the Bash tool is called with a command containing `git commit`.

## Behavior

Before allowing the commit, check recently staged files for critical anti-patterns:

1. **Check for `any` types in TypeScript files:**
   ```bash
   git diff --cached --name-only -- '*.ts' '*.tsx' | xargs grep -n ': any\b' 2>/dev/null
   ```

2. **Check for console.log in production code:**
   ```bash
   git diff --cached --name-only -- '*.ts' '*.tsx' | grep -v 'test\|spec\|story' | xargs grep -n 'console\.log' 2>/dev/null
   ```

3. **Check for TODO/FIXME in new code:**
   ```bash
   git diff --cached -U0 -- '*.ts' '*.tsx' | grep '^\+.*TODO\|^\+.*FIXME' 2>/dev/null
   ```

## Response

If violations are found, warn the user but allow the commit (don't block):

```
WARNING: Found potential issues in staged files:
- {file}:{line}: {issue description}

Proceeding with commit. Consider fixing these in a follow-up.
```

If no violations: proceed silently with the commit.

## Rules

- **Warn, don't block** — this is advisory, not a gate
- **Only check staged files** — not the entire codebase
- **Skip test files** — anti-patterns in tests are usually intentional
- **Fast** — must complete in under 5 seconds
