# Workflow Coverage Matrix Generator

> **Output file:** `dev_docs/completeness/workflow-coverage-matrix.md`
> **Trigger:** Run at Step 8.5 (task generation complete), verify at Step 8.6 (phase sign-off)
> **Enforcement:** Gate 6 — Workflow Completeness

---

## Purpose

This generator produces a matrix proving that every persona's every workflow is fully covered by tasks and E2E tests. It answers the question: "For every thing a user might want to do, is there a task implementing it and a test verifying it?"

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| Personas | `{{PROJECT_CONFIG_FILE}}` → `personas` section | Yes |
| Workflows | `{{SERVICE_SPECS_DIR}}/{{SERVICE_NAME}}.md` → `workflows` section per service | Yes |
| Task files | `{{TASKS_DIR}}/` → all task `.md` files | Yes |
| E2E test specs | `{{E2E_TESTS_DIR}}/` → all E2E test files | Yes |

---

## Output Format

Generate the following table for EACH persona:

### `{{PERSONA_NAME}}` — Workflow Coverage

| Workflow Name | Step # | Step Description | Task ID | E2E Test ID | Happy Path | Error Path | Alt Path | Status |
|---------------|--------|------------------|---------|-------------|------------|------------|----------|--------|
| {{WORKFLOW_1}} | 1 | {{STEP_DESC}} | {{TASK_ID}} | {{E2E_ID}} | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{COVERED_OR_GAP}} |
| {{WORKFLOW_1}} | 2 | {{STEP_DESC}} | {{TASK_ID}} | {{E2E_ID}} | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{COVERED_OR_GAP}} |
| {{WORKFLOW_1}} | 3 | {{STEP_DESC}} | {{TASK_ID}} | {{E2E_ID}} | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{COVERED_OR_GAP}} |
| {{WORKFLOW_1}} | 4 | {{STEP_DESC}} | {{TASK_ID}} | {{E2E_ID}} | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{COVERED_OR_GAP}} |
| {{WORKFLOW_2}} | 1 | {{STEP_DESC}} | {{TASK_ID}} | {{E2E_ID}} | {{YES_NO}} | {{YES_NO}} | {{YES_NO}} | {{COVERED_OR_GAP}} |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## Generation Rules

### Minimum Thresholds

| Requirement | Minimum | Enforcement |
|-------------|---------|-------------|
| Workflows per persona | ≥3 | If a persona has <3 workflows, the service spec is incomplete — return to Step 4 |
| Steps per workflow | ≥4 | If a workflow has <4 steps, it is under-specified — break it down further |
| Task mapping per step | 1:1 | Every step must map to exactly one task ID. No step without a task. |
| E2E test per workflow | ≥1 | Every workflow must have at least one E2E test covering the happy path |

### Path Coverage Requirements

| Path Type | Definition | Required For |
|-----------|------------|-------------|
| Happy Path | User completes workflow successfully | ALL workflows |
| Error Path | User encounters an error mid-workflow (validation, server error, permission denied) | ALL workflows |
| Alternative Path | User takes a non-default route (e.g., bulk action instead of single, CSV import instead of manual entry) | Workflows with >1 possible approach |

### Status Determination

- **Covered:** Task ID exists AND is implemented AND E2E test passes
- **Gap:** Task ID missing OR E2E test missing OR any required path not covered

---

## Gap Detection

After generating the matrix, produce a gap summary:

### Gap Summary

| Gap # | Persona | Workflow | Step | Missing | Severity | Action Required |
|-------|---------|----------|------|---------|----------|----------------|
| 1 | {{PERSONA}} | {{WORKFLOW}} | {{STEP}} | Task ID | Critical | Generate task |
| 2 | {{PERSONA}} | {{WORKFLOW}} | — | E2E test | Critical | Write E2E spec |
| 3 | {{PERSONA}} | {{WORKFLOW}} | {{STEP}} | Error path | Major | Add error path to E2E |

**Severity rules:**
- **Critical:** Missing task or missing E2E test — blocks phase sign-off
- **Major:** Missing error/alternative path coverage — must resolve before launch
- **Minor:** Coverage exists but test is shallow — improve before launch

---

## Verification Checklist

Run this at Step 8.6 to verify the matrix is complete:

- [ ] Every persona from `{{PROJECT_CONFIG_FILE}}` appears in the matrix
- [ ] Every persona has ≥3 workflows
- [ ] Every workflow has ≥4 steps
- [ ] Every step has a Task ID (no empty cells)
- [ ] Every workflow has ≥1 E2E Test ID
- [ ] Every workflow has Happy Path = Yes
- [ ] Every workflow has Error Path = Yes
- [ ] Gap summary has zero Critical items
- [ ] All Major items have assigned resolution tasks

---

## Cross-References

- **Gate 6** in `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` — this matrix is the primary proof artifact
- **Task generation** in `10-generators/SPRINT-PLAN-GENERATOR.md` — tasks referenced here originate from sprint planning
- **E2E test templates** in `08-quality-testing/e2e-test-templates.md` — E2E tests referenced here follow these templates
- **Journey Coverage Matrix** in `10-generators/JOURNEY-COVERAGE-MATRIX.md` — workflows feed into journey stages

---

## Example

### "Restaurant Owner" — Workflow Coverage

| Workflow Name | Step # | Step Description | Task ID | E2E Test ID | Happy Path | Error Path | Alt Path | Status |
|---------------|--------|------------------|---------|-------------|------------|------------|----------|--------|
| Create Menu | 1 | Navigate to menu editor | TASK-042 | E2E-011 | Yes | Yes | — | Covered |
| Create Menu | 2 | Add menu category | TASK-043 | E2E-011 | Yes | Yes | — | Covered |
| Create Menu | 3 | Add menu items with pricing | TASK-044 | E2E-011 | Yes | Yes | Yes | Covered |
| Create Menu | 4 | Preview and publish menu | TASK-045 | E2E-011 | Yes | Yes | — | Covered |
| Create Menu | 5 | Verify menu visible to diners | TASK-046 | E2E-012 | Yes | No | — | **Gap** |

This example shows Step 5 as a Gap because the error path (what if publishing fails?) is not covered by an E2E test.
