# Project Health Dashboard

> **Generated:** {{DATE}}
> **Project:** {{PROJECT_NAME}}
> **Current Phase:** {{CURRENT_PHASE}} (Step {{CURRENT_STEP}})
> **Path:** {{PATH_TYPE}} (Express / Lite / Standard / Full / Enhance / Repurpose)

---

## Overall Health

| Dimension | Score | Status | Details |
|-----------|-------|--------|---------|
| Phase Progress | {{PHASE_PROGRESS_PCT}}% | {{PHASE_STATUS}} | {{COMPLETED_PHASES}}/{{TOTAL_PHASES}} phases complete |
| Spec Depth | {{AVG_DEPTH_SCORE}}/10 | {{DEPTH_STATUS}} | {{SPECS_PASSING}}/{{SPECS_TOTAL}} specs meet threshold |
| Enforcement Gates | {{GATES_PASSED}}/{{GATES_TOTAL}} | {{GATE_STATUS}} | Last gate: {{LAST_GATE_NAME}} |
| Test Coverage | {{COVERAGE_PCT}}% | {{COVERAGE_STATUS}} | Baseline: {{COVERAGE_BASELINE}}% |
| State File Freshness | {{STATE_FRESHNESS}} | {{STATE_STATUS}} | Last updated: {{STATE_LAST_UPDATED}} |
| Cross-Reference Integrity | {{XREF_SCORE}}% | {{XREF_STATUS}} | {{ORPHAN_COUNT}} orphaned refs |

**Status Legend:** HEALTHY = on track | AT_RISK = minor issues | CRITICAL = blocking issues | UNKNOWN = not yet measured

---

## Phase Progress

| Phase | Status | Tasks Done | Tasks Total | Depth Score | Gate |
|-------|--------|------------|-------------|-------------|------|
{{#EACH_PHASE}}
| {{PHASE_NAME}} | {{PHASE_STATUS}} | {{TASKS_DONE}} | {{TASKS_TOTAL}} | {{PHASE_DEPTH}} | {{GATE_RESULT}} |
{{/EACH_PHASE}}

**Blocked Tasks:** {{BLOCKED_TASK_COUNT}}
**Deferred Tasks:** {{DEFERRED_TASK_COUNT}}

---

## Spec Depth Scores

### Service Specs

| Service | Word Count | Sections | Business Rules | Edge Cases | Score | Threshold | Pass? |
|---------|-----------|----------|----------------|------------|-------|-----------|-------|
{{#EACH_SERVICE_SPEC}}
| {{SERVICE_NAME}} | {{WORD_COUNT}} | {{SECTION_COUNT}}/{{REQUIRED_SECTIONS}} | {{BUSINESS_RULE_COUNT}} | {{EDGE_CASE_COUNT}} | {{DEPTH_SCORE}}/10 | {{THRESHOLD}} | {{PASS_FAIL}} |
{{/EACH_SERVICE_SPEC}}

### Screen Specs

| Screen | Word Count | States | Interactions | Mobile? | A11y? | Score | Pass? |
|--------|-----------|--------|-------------|---------|-------|-------|-------|
{{#EACH_SCREEN_SPEC}}
| {{SCREEN_NAME}} | {{WORD_COUNT}} | {{STATE_COUNT}} | {{INTERACTION_COUNT}} | {{HAS_MOBILE}} | {{HAS_A11Y}} | {{DEPTH_SCORE}}/10 | {{PASS_FAIL}} |
{{/EACH_SCREEN_SPEC}}

---

## Enforcement Gate Status

| Gate | Step | Validators Run | Result | Proof Artifacts | Date |
|------|------|---------------|--------|-----------------|------|
{{#EACH_GATE}}
| {{GATE_NAME}} | {{STEP_NUMBER}} | {{VALIDATORS}} | {{RESULT}} | {{PROOF_PATH}} | {{DATE}} |
{{/EACH_GATE}}

---

## Performance Baselines

| Metric | Baseline | Current | Delta | Status |
|--------|----------|---------|-------|--------|
| API Response (p95) | {{API_BASELINE_P95}} | {{API_CURRENT_P95}} | {{API_DELTA}} | {{API_STATUS}} |
| Page Load (LCP) | {{LCP_BASELINE}} | {{LCP_CURRENT}} | {{LCP_DELTA}} | {{LCP_STATUS}} |
| Bundle Size (gzip) | {{BUNDLE_BASELINE}} | {{BUNDLE_CURRENT}} | {{BUNDLE_DELTA}} | {{BUNDLE_STATUS}} |
| Test Coverage | {{COV_BASELINE}} | {{COV_CURRENT}} | {{COV_DELTA}} | {{COV_STATUS}} |

---

## Risk Register

| Risk | Severity | Likelihood | Impact | Mitigation | Owner |
|------|----------|-----------|--------|-----------|-------|
{{#EACH_RISK}}
| {{RISK_DESCRIPTION}} | {{SEVERITY}} | {{LIKELIHOOD}} | {{IMPACT}} | {{MITIGATION}} | {{OWNER}} |
{{/EACH_RISK}}

---

## State File Audit

| File | Exists | Last Modified | Entries | Fresh? |
|------|--------|--------------|---------|--------|
| STATUS.md | {{STATUS_EXISTS}} | {{STATUS_MODIFIED}} | — | {{STATUS_FRESH}} |
| handoff.md | {{HANDOFF_EXISTS}} | {{HANDOFF_MODIFIED}} | — | {{HANDOFF_FRESH}} |
| DEVLOG.md | {{DEVLOG_EXISTS}} | {{DEVLOG_MODIFIED}} | {{DEVLOG_ENTRIES}} | {{DEVLOG_FRESH}} |
| ARCH-ANCHOR.md | {{ARCH_EXISTS}} | {{ARCH_MODIFIED}} | — | {{ARCH_FRESH}} |
| session-context.md | {{SESSION_EXISTS}} | {{SESSION_MODIFIED}} | — | {{SESSION_FRESH}} |

---

## Path-Specific Metrics

<!-- IF PATH:enhance -->
### Enhance Path — Composite Audit Score

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Code Quality | {{ENHANCE_CODE_QUALITY}}/10 | 20% | {{ENHANCE_CQ_WEIGHTED}} |
| Architecture | {{ENHANCE_ARCHITECTURE}}/10 | 25% | {{ENHANCE_ARCH_WEIGHTED}} |
| Test Coverage | {{ENHANCE_TESTING}}/10 | 20% | {{ENHANCE_TEST_WEIGHTED}} |
| Documentation | {{ENHANCE_DOCS}}/10 | 15% | {{ENHANCE_DOCS_WEIGHTED}} |
| DevOps | {{ENHANCE_DEVOPS}}/10 | 10% | {{ENHANCE_DEVOPS_WEIGHTED}} |
| Security | {{ENHANCE_SECURITY}}/10 | 10% | {{ENHANCE_SEC_WEIGHTED}} |
| **Composite** | | | **{{ENHANCE_COMPOSITE}}/10** |
<!-- /IF -->

<!-- IF PATH:repurpose -->
### Repurpose Path — Pivot Depth

| Dimension | Status | Notes |
|-----------|--------|-------|
| Feature Inheritance Map | {{REPURPOSE_FIM}} | {{REPURPOSE_FIM_NOTES}} |
| Vertical Differentiation | {{REPURPOSE_VD}} | {{REPURPOSE_VD_NOTES}} |
| Market Fit Analysis | {{REPURPOSE_MFA}} | {{REPURPOSE_MFA_NOTES}} |
| Fork Architecture | {{REPURPOSE_FORK}} | {{REPURPOSE_FORK_NOTES}} |
<!-- /IF -->

---

## How to Generate This Dashboard

Run the following to auto-populate this dashboard from project state:

```bash
# From project root:
tools/validators/gate-checker.sh --dashboard > dev_docs/health-dashboard.md
```

Or manually: read STATUS.md + proof artifacts + depth audit outputs and fill in the template above.

**Update cadence:** Regenerate at every phase gate and at session boundaries.
