---
name: anti-pattern-check
description: Quick check of recent code changes against the project's anti-pattern registry. Use before committing or marking a task complete.
---

# Anti-Pattern Check

Run a quick check of recently modified code against the project's anti-pattern registry.

## Protocol

### 1. Identify Changed Files

Check what files were modified in this session:
```bash
git diff --name-only HEAD
git diff --name-only --staged
```

If no git changes, ask the user which files to check.

### 2. Run Quick Checks

For each modified file, check for these common anti-patterns:

**API Layer:**
- [ ] API responses properly unwrapped (`response.data.data` not `response.data`)
- [ ] Correct HTTP methods (GET for reads, POST for creates, PATCH for updates)
- [ ] No doubled URL prefixes (`/api/api/`)
- [ ] Endpoints verified to exist in backend

**UI Layer:**
- [ ] No stub buttons (every `onClick` has a real handler or is disabled)
- [ ] All 4 UI states handled (loading, empty, error, populated)
- [ ] No `window.location.reload()` — use router/state management
- [ ] No mock/hardcoded data outside test files

**Data Layer:**
- [ ] Queries include tenant/context filter (if multi-tenant)
- [ ] Queries include `deletedAt: null` (if using soft delete)
- [ ] Pagination params passed explicitly (not relying on defaults)

**Code Quality:**
- [ ] No `any` types — use `unknown` + type guards
- [ ] No `console.log` left in production code
- [ ] Imports use project path alias (`@/` not `../../`)

### 3. Report Results

For each violation found:
```
ANTI-PATTERN FOUND: AP-{NNN} — {Pattern Name}
File: {path}:{line}
Code: {offending line}
Fix: {what to do instead}
```

If no violations: "All clear — no anti-patterns detected in changed files."

## When to Use

- Before committing code
- Before marking a task as complete
- After a code review identifies potential issues
- During session end ritual

## Rules

- **Only check modified files** — don't scan the entire codebase (use `/security-scan` for that)
- **No false positives** — `any` in a test file is fine, `any` in a component prop is not
- **Be actionable** — every finding includes a specific fix
- **Fast** — this should take under 30 seconds for typical changes
