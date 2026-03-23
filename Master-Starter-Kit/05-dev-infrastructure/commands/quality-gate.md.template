# /quality-gate — Run All Quality Checks

Run the full quality gate pipeline and produce a pass/fail report.
All steps run sequentially so failures in early stages are caught before later ones.

## Configuration
- **Lint command:** `{{LINT_CMD}}`
- **Type check command:** `{{TYPE_CHECK_CMD}}`
- **Backend test command:** `{{BACKEND_TEST_CMD}}`
- **Frontend test command:** `{{FRONTEND_TEST_CMD}}`
- **Build command:** `{{BUILD_CMD}}`
- **Project root:** `{{PROJECT_ROOT}}`

## Steps

### Step 1 — Lint
Run `{{LINT_CMD}}` from `{{PROJECT_ROOT}}`.
Capture stdout and stderr. Record exit code.
If exit code != 0, mark LINT as FAIL and capture error summary.

### Step 2 — Type Check
<!-- IF {{FRONTEND_FRAMEWORK}} != "none" -->
Run `{{TYPE_CHECK_CMD}}` from `{{PROJECT_ROOT}}`.
Capture stdout and stderr. Record exit code.
If exit code != 0, mark TYPE_CHECK as FAIL and capture error count.
<!-- ENDIF -->
<!-- IF {{FRONTEND_FRAMEWORK}} == "none" -->
Skip type checking (no frontend framework configured). Mark as SKIP.
<!-- ENDIF -->

### Step 3 — Backend Tests
Run `{{BACKEND_TEST_CMD}}` from `{{PROJECT_ROOT}}`.
Capture test count, pass count, fail count, and coverage percentage if available.
If exit code != 0, mark BACKEND_TESTS as FAIL.

### Step 4 — Frontend Tests
<!-- IF {{FRONTEND_FRAMEWORK}} != "none" -->
Run `{{FRONTEND_TEST_CMD}}` from `{{PROJECT_ROOT}}`.
Capture test count, pass count, fail count, and coverage percentage if available.
If exit code != 0, mark FRONTEND_TESTS as FAIL.
<!-- ENDIF -->
<!-- IF {{FRONTEND_FRAMEWORK}} == "none" -->
Skip frontend tests (no frontend framework configured). Mark as SKIP.
<!-- ENDIF -->

### Step 5 — Build
Run `{{BUILD_CMD}}` from `{{PROJECT_ROOT}}`.
Capture stdout and stderr. Record exit code and build duration.
If exit code != 0, mark BUILD as FAIL and capture error output.

### Step 6 — Generate Report
Produce a markdown table summarizing all gates:

```
| Gate            | Status | Details                |
|-----------------|--------|------------------------|
| Lint            | PASS/FAIL | N warnings, M errors |
| Type Check      | PASS/FAIL/SKIP | N errors      |
| Backend Tests   | PASS/FAIL | N/M passed, X% cov  |
| Frontend Tests  | PASS/FAIL/SKIP | N/M passed    |
| Build           | PASS/FAIL | duration              |
| **Overall**     | **PASS/FAIL** |                 |
```

### Step 7 — Auto-Fix Offer
If any gate FAILED, list each failure with:
- The specific error or failing test
- A proposed fix (lint auto-fix command, type annotation, test fix)
- Ask: "Should I auto-fix these issues? (all / pick / skip)"

If `all` — apply every fix sequentially, then re-run the full gate.
If `pick` — present numbered list, apply selected fixes, re-run.
If `skip` — end with the failure report.

## Output Format
Print the report table to the conversation.
If all gates pass: "All quality gates passed. Safe to commit."
If any gate fails: "N gate(s) failed. See details above."

## Notes
- Always run gates in order: lint -> types -> backend tests -> frontend tests -> build
- Never skip a gate silently — always report SKIP with reason
- If `{{BUILD_CMD}}` includes both frontend and backend (e.g., turborepo), that is fine
- Record wall-clock time for the entire pipeline at the end
