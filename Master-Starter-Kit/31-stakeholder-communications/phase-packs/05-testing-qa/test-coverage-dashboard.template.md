# Test Coverage Dashboard

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}}
> **Sprint / Phase:** {{SPRINT_OR_PHASE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## Coverage Overview

| Area | Coverage | Target | Gap | Status |
|------|----------|--------|-----|--------|
| Unit Tests | {{UNIT_COVERAGE}}% | {{UNIT_TARGET}}% | {{UNIT_GAP}} | {{UNIT_STATUS}} |
| Integration Tests | {{INTEGRATION_COVERAGE}}% | {{INTEGRATION_TARGET}}% | {{INTEGRATION_GAP}} | {{INTEGRATION_STATUS}} |
| End-to-End Tests | {{E2E_COVERAGE}}% | {{E2E_TARGET}}% | {{E2E_GAP}} | {{E2E_STATUS}} |
| Performance Tests | {{PERF_COVERAGE}}% | {{PERF_TARGET}}% | {{PERF_GAP}} | {{PERF_STATUS}} |
| **Overall** | **{{OVERALL_COVERAGE}}%** | **{{OVERALL_TARGET}}%** | **{{OVERALL_GAP}}** | **{{OVERALL_STATUS}}** |

<!-- Status key:
  [GREEN] Coverage meets or exceeds target
  [YELLOW] Coverage within 10% of target
  [RED] Coverage more than 10% below target
-->

---

## Coverage by Feature

| Feature | Tests Written | Tests Passing | Coverage | Status |
|---------|--------------|---------------|----------|--------|
| {{FEATURE_1_NAME}} | {{FEATURE_1_WRITTEN}} | {{FEATURE_1_PASSING}} | {{FEATURE_1_COVERAGE}}% | [{{FEATURE_1_STATUS}}] |
| {{FEATURE_2_NAME}} | {{FEATURE_2_WRITTEN}} | {{FEATURE_2_PASSING}} | {{FEATURE_2_COVERAGE}}% | [{{FEATURE_2_STATUS}}] |
| {{FEATURE_3_NAME}} | {{FEATURE_3_WRITTEN}} | {{FEATURE_3_PASSING}} | {{FEATURE_3_COVERAGE}}% | [{{FEATURE_3_STATUS}}] |
| {{FEATURE_4_NAME}} | {{FEATURE_4_WRITTEN}} | {{FEATURE_4_PASSING}} | {{FEATURE_4_COVERAGE}}% | [{{FEATURE_4_STATUS}}] |
| {{FEATURE_5_NAME}} | {{FEATURE_5_WRITTEN}} | {{FEATURE_5_PASSING}} | {{FEATURE_5_COVERAGE}}% | [{{FEATURE_5_STATUS}}] |
| {{FEATURE_6_NAME}} | {{FEATURE_6_WRITTEN}} | {{FEATURE_6_PASSING}} | {{FEATURE_6_COVERAGE}}% | [{{FEATURE_6_STATUS}}] |
| {{FEATURE_7_NAME}} | {{FEATURE_7_WRITTEN}} | {{FEATURE_7_PASSING}} | {{FEATURE_7_COVERAGE}}% | [{{FEATURE_7_STATUS}}] |
| {{FEATURE_8_NAME}} | {{FEATURE_8_WRITTEN}} | {{FEATURE_8_PASSING}} | {{FEATURE_8_COVERAGE}}% | [{{FEATURE_8_STATUS}}] |

---

## What's NOT Covered

> These features or scenarios have low coverage. Each entry explains why and what we plan to do about it.

| Area | Current Coverage | Reason for Gap | Plan | Target Date |
|------|-----------------|----------------|------|-------------|
| {{GAP_AREA_1}} | {{GAP_COVERAGE_1}}% | {{GAP_REASON_1}} | {{GAP_PLAN_1}} | {{GAP_DATE_1}} |
| {{GAP_AREA_2}} | {{GAP_COVERAGE_2}}% | {{GAP_REASON_2}} | {{GAP_PLAN_2}} | {{GAP_DATE_2}} |
| {{GAP_AREA_3}} | {{GAP_COVERAGE_3}}% | {{GAP_REASON_3}} | {{GAP_PLAN_3}} | {{GAP_DATE_3}} |

### Known Testing Limitations

- {{LIMITATION_1}}
- {{LIMITATION_2}}
- {{LIMITATION_3}}

---

## What This Means

**In plain English:**

**{{OVERALL_COVERAGE}}% coverage** means that {{OVERALL_COVERAGE}}% of the system is automatically verified before each release. Every time a developer makes a change, {{OVERALL_COVERAGE}}% of the functionality is checked within minutes to confirm nothing broke.

Our target is **{{OVERALL_TARGET}}%** because {{COVERAGE_TARGET_RATIONALE}}.

**What's well protected:**
- {{WELL_PROTECTED_1}} — {{WELL_PROTECTED_1_EXPLANATION}}
- {{WELL_PROTECTED_2}} — {{WELL_PROTECTED_2_EXPLANATION}}

**What carries more risk:**
- {{HIGHER_RISK_1}} — {{HIGHER_RISK_1_EXPLANATION}}
- {{HIGHER_RISK_2}} — {{HIGHER_RISK_2_EXPLANATION}}

**Bottom line:** {{COVERAGE_BOTTOM_LINE}}

---

*Next update: {{NEXT_REPORT_DATE}}*
