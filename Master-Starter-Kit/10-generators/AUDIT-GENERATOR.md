# Audit Generator

**Purpose:** Audit an existing codebase module or service and produce a quality report
with grades, bug inventory, recommendations, and protect-list candidates.

**Output:** Audit reports in `dev_docs/audit/{area-name}.md`

---

## When to Run

Run this generator:

- At project kickoff (audit everything to establish baselines)
- Before starting work on a service (audit just that service)
- After a major refactor (re-audit to verify quality improved)

---

## Inputs Required

> **Note:** Paths below are examples for a Next.js + NestJS monorepo. Adapt to your stack:
> - **Django/FastAPI:** `apps/{app}/views.py`, `apps/{app}/models.py`, `templates/{app}/`
> - **Rails:** `app/controllers/{resource}_controller.rb`, `app/views/{resource}/`
> - **Go:** `internal/{module}/handler.go`, `internal/{module}/service.go`

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Source files | `{{BACKEND_SRC}}/modules/{module}/` (backend) | Code to audit |
| Source files | `{{FRONTEND_SRC}}/{route}/` (frontend) | Code to audit |
| Source files | `{{COMPONENT_LIBRARY_PATH}}/` (components) | Code to audit |
| Service spec | `dev_docs/specs/services/{service}.md` | Expected functionality to measure completeness against |
| Test files | `**/*.test.ts`, `**/*.spec.ts`, `**/test_*.py`, `**/*_test.go` | Test coverage data |

---

## Audit Scope Definition

Break the codebase into auditable areas (typically matching service boundaries):

| Area | Backend Path | Frontend Path |
| ---- | ------------ | ------------- |
| Auth & Admin | `{{BACKEND_SRC}}/auth/`, `{{BACKEND_SRC}}/admin/` | `{{FRONTEND_SRC}}/(auth)/`, `{{FRONTEND_SRC}}/admin/` |
| {Service 2} | `{{BACKEND_SRC}}/{module}/` | `{{FRONTEND_SRC}}/{route}/` |
| Shared Components | -- | `{{COMPONENT_LIBRARY_PATH}}/ui/`, `{{COMPONENT_LIBRARY_PATH}}/shared/` |
| Backend Infrastructure | `{{BACKEND_SRC}}/shared/`, middleware, guards | -- |

---

## Scoring Dimensions

For each area, score on these 4 dimensions:

| Category | Weight | What to Check |
| -------- | ------ | ------------- |
| Code Quality | 25% | Naming conventions, file structure, DRY, single responsibility, no monolithic files (>500 LOC), clean imports |
| Completeness | 30% | Features implemented vs. spec, missing CRUD operations, missing UI states (loading/error/empty), missing form validation |
| Standards Compliance | 25% | TypeScript strict (no `any`), lint passes, design token usage, API envelope unwrap, tenant isolation, no console.log |
| Test Coverage | 20% | Tests exist, tests pass, edge cases covered, mocking patterns correct, integration tests for critical paths |

### Scoring Scale

| Grade | Score | Meaning |
| ----- | ----- | ------- |
| A | 9-10 | Production-ready, exemplary code |
| B+ | 8-8.9 | Good quality, minor improvements needed |
| B- | 7-7.9 | Functional, several issues to address |
| C+ | 6-6.9 | Works but needs significant work |
| C- | 5-5.9 | Partially functional, major gaps |
| D+ | 4-4.9 | Largely incomplete, fundamental issues |
| D | 3-3.9 | Barely functional |
| F | 0-2.9 | Non-functional or missing |

---

## Bug Severity Classification

For each bug found, classify:

| Severity | Meaning | Examples |
| -------- | ------- | ------- |
| **P0 -- Critical** | Blocks core functionality, data loss risk | 404 errors on core routes, auth bypass, data corruption, infinite loops, crash on load |
| **P1 -- High** | Incorrect behavior, bad UX | Wrong data displayed, broken form validation, stale cache, missing error handling |
| **P2 -- Medium** | Polish issues, DX problems | Missing loading states, hardcoded strings, console.log left in, `any` types, missing a11y |
| **P3 -- Low** | Nice to have, cosmetic | Code style, minor UX tweaks, naming improvements, unused imports |

---

## Audit Report Format

Write each report to `dev_docs/audit/{area-name}.md`:

```markdown
# Audit: {Area Name}

> **Scope:** {what directories/files were audited}
> **Date:** {audit date}
> **Auditor:** {who ran this audit}

---

## Grade: {Letter} ({score}/10)

---

## Scoring Breakdown

| Category | Weight | Score | Notes |
| -------- | ------ | ----- | ----- |
| Code Quality | 25% | {X}/10 | {1-line summary} |
| Completeness | 30% | {X}/10 | {1-line summary} |
| Standards Compliance | 25% | {X}/10 | {1-line summary} |
| Test Coverage | 20% | {X}/10 | {1-line summary} |
| **Weighted Total** | 100% | **{X}/10** | |

---

## Bug Inventory

### P0 -- Critical ({count})

| # | File:Line | Description | Impact |
| - | --------- | ----------- | ------ |
| 1 | `{path}:{line}` | {description} | {what breaks} |

### P1 -- High ({count})

| # | File:Line | Description | Impact |
| - | --------- | ----------- | ------ |
| 1 | `{path}:{line}` | {description} | {what breaks} |

### P2 -- Medium ({count})

| # | File:Line | Description | Impact |
| - | --------- | ----------- | ------ |
| 1 | `{path}:{line}` | {description} | {what breaks} |

### P3 -- Low ({count})

| # | Description | File(s) |
| - | ----------- | ------- |
| 1 | {description} | `{path}` |

---

## Recommendations

Ordered by priority (do these first):

1. **[P0 Fix]** {action} -- `{file}:{line}` -- {why this matters}
2. **[P1 Fix]** {action} -- `{file}` -- {why this matters}
3. **[Refactor]** {action} -- `{files}` -- {why this matters}
4. **[Enhancement]** {action} -- {why this matters}

---

## Protect List

Files that should NOT be modified (high-quality, tested, stable):

| File | Quality | Reason |
| ---- | ------- | ------ |
| `{path}` | {8+}/10 | {why it should be protected} |

---

## Files Reviewed

| File | LOC | Quality | Notes |
| ---- | --- | ------- | ----- |
| `{path}` | {N} | Good / Needs Work / Stub | {brief note} |

---

## Summary

{2-3 sentence executive summary: overall state, top priority actions, timeline estimate
for bringing this area to production quality.}
```

---

## Generation Algorithm

1. **Define scope** -- identify all files belonging to this audit area.

2. **Read every file** in scope. For each file, note:
   - Line count
   - TypeScript strictness (any `any` types? missing type annotations?)
   - Import hygiene (unused imports? circular deps?)
   - Component structure (proper separation of concerns?)
   - Error handling (try/catch? error boundaries? loading states?)

3. **Compare against spec** -- read the service specification and check:
   - Which CRUD operations exist vs. which are needed?
   - Which screens exist vs. which are specified?
   - Which business rules are enforced vs. which are missing?

4. **Check tests:**
   - Do test files exist for the audited code?
   - Do tests actually run and pass?
   - Are edge cases covered (empty state, error state, boundary values)?

5. **Classify bugs** by severity using the table above.

6. **Score each dimension** and calculate the weighted total.

7. **Identify protect-list candidates:**
   - Files scoring 8+/10 on quality
   - Files that are working, tested, and relied upon by other modules
   - Files where changes would risk regression

8. **Write the report** in the format above.

---

## Quality Rules

1. **Be specific.** "Fix the error handling" is bad. "`carriers/page.tsx:45` -- missing catch block in useEffect that causes unhandled promise rejection" is good.
2. **Grade honestly.** A C+ is not an insult -- it's a roadmap. Inflated grades hide real problems.
3. **Prioritize recommendations.** P0s first, P3s last. Not everything needs fixing now.
4. **Test before scoring.** Run the actual code -- don't just read it. Check if pages render, if forms submit, if APIs respond.
5. **Check for security issues.** JWT in console.log, tokens in localStorage without HttpOnly, XSS vectors, SQL injection, missing auth guards.
6. **Note what works well.** Audits are not just about problems. Call out good patterns worth replicating.
