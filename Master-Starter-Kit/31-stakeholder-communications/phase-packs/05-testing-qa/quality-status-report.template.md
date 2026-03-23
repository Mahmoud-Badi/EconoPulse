# Quality Status Report

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}}
> **Sprint / Phase:** {{SPRINT_OR_PHASE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## QA Phase Status

### **[{{QA_STATUS_COLOR}}] {{QA_STATUS_LABEL}}**

<!-- Use one of:
  [GREEN] On track — quality targets being met, no critical blockers
  [YELLOW] At risk — some quality concerns that need attention
  [RED] Blocked — critical quality issues preventing progress
-->

---

## Quality Summary

We are testing **{{FEATURES_UNDER_TEST_COUNT}}** features across **{{TEST_SCENARIOS_COUNT}}** scenarios. Quality is **{{QUALITY_ASSESSMENT}}** because {{QUALITY_RATIONALE}}. {{ADDITIONAL_CONTEXT}}

---

## Quality Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Coverage | {{TEST_COVERAGE_PERCENT}}% | {{TEST_COVERAGE_TARGET}}% | {{TEST_COVERAGE_STATUS}} |
| Passing Tests | {{PASSING_TESTS}} / {{TOTAL_TESTS}} | {{PASSING_TESTS_TARGET}}% pass rate | {{PASSING_TESTS_STATUS}} |
| Open Bugs — Critical | {{BUGS_CRITICAL}} | 0 | {{BUGS_CRITICAL_STATUS}} |
| Open Bugs — High | {{BUGS_HIGH}} | {{BUGS_HIGH_TARGET}} | {{BUGS_HIGH_STATUS}} |
| Open Bugs — Medium | {{BUGS_MEDIUM}} | {{BUGS_MEDIUM_TARGET}} | {{BUGS_MEDIUM_STATUS}} |
| Open Bugs — Low | {{BUGS_LOW}} | {{BUGS_LOW_TARGET}} | {{BUGS_LOW_STATUS}} |
| Performance — Avg Response Time | {{PERF_AVG_RESPONSE}}ms | {{PERF_TARGET_RESPONSE}}ms | {{PERF_RESPONSE_STATUS}} |
| Performance — Page Load | {{PERF_PAGE_LOAD}}s | {{PERF_PAGE_LOAD_TARGET}}s | {{PERF_PAGE_LOAD_STATUS}} |
| Lighthouse Score | {{LIGHTHOUSE_SCORE}} | {{LIGHTHOUSE_TARGET}} | {{LIGHTHOUSE_STATUS}} |

---

## Critical Bugs

| # | Bug | Impact to Users | Fix Status | ETA |
|---|-----|-----------------|------------|-----|
| {{CRITICAL_BUG_1_ID}} | {{CRITICAL_BUG_1_TITLE}} | {{CRITICAL_BUG_1_USER_IMPACT}} | {{CRITICAL_BUG_1_FIX_STATUS}} | {{CRITICAL_BUG_1_ETA}} |
| {{CRITICAL_BUG_2_ID}} | {{CRITICAL_BUG_2_TITLE}} | {{CRITICAL_BUG_2_USER_IMPACT}} | {{CRITICAL_BUG_2_FIX_STATUS}} | {{CRITICAL_BUG_2_ETA}} |
| {{CRITICAL_BUG_3_ID}} | {{CRITICAL_BUG_3_TITLE}} | {{CRITICAL_BUG_3_USER_IMPACT}} | {{CRITICAL_BUG_3_FIX_STATUS}} | {{CRITICAL_BUG_3_ETA}} |

> **If no critical bugs:** No critical bugs are currently open. All critical issues from previous reports have been resolved.

---

## Testing Progress

| Category | Tested | Total | Progress | Status |
|----------|--------|-------|----------|--------|
| Features | {{FEATURES_TESTED}} | {{FEATURES_TOTAL}} | {{FEATURES_PROGRESS}}% | {{FEATURES_STATUS}} |
| Test Scenarios | {{SCENARIOS_COMPLETED}} | {{SCENARIOS_TOTAL}} | {{SCENARIOS_PROGRESS}}% | {{SCENARIOS_STATUS}} |
| Regression Tests | {{REGRESSION_COMPLETED}} | {{REGRESSION_TOTAL}} | {{REGRESSION_PROGRESS}}% | {{REGRESSION_STATUS}} |
| Cross-Browser | {{BROWSER_COMPLETED}} | {{BROWSER_TOTAL}} | {{BROWSER_PROGRESS}}% | {{BROWSER_STATUS}} |
| Mobile / Responsive | {{MOBILE_COMPLETED}} | {{MOBILE_TOTAL}} | {{MOBILE_PROGRESS}}% | {{MOBILE_STATUS}} |

---

## Stakeholder Action Required

### UAT Testing Needed

| Feature | Tester Needed | Available From | Due By |
|---------|---------------|----------------|--------|
| {{UAT_FEATURE_1}} | {{UAT_TESTER_1}} | {{UAT_AVAILABLE_1}} | {{UAT_DUE_1}} |
| {{UAT_FEATURE_2}} | {{UAT_TESTER_2}} | {{UAT_AVAILABLE_2}} | {{UAT_DUE_2}} |

### Sign-off Schedule

| Milestone | Sign-off Owner | Target Date | Status |
|-----------|---------------|-------------|--------|
| Test Completion | {{SIGNOFF_TEST_OWNER}} | {{SIGNOFF_TEST_DATE}} | {{SIGNOFF_TEST_STATUS}} |
| UAT Approval | {{SIGNOFF_UAT_OWNER}} | {{SIGNOFF_UAT_DATE}} | {{SIGNOFF_UAT_STATUS}} |
| Go-Live Approval | {{SIGNOFF_GOLIVE_OWNER}} | {{SIGNOFF_GOLIVE_DATE}} | {{SIGNOFF_GOLIVE_STATUS}} |

---

## What This Means

**In plain English:**

- **Test coverage at {{TEST_COVERAGE_PERCENT}}%** means that {{TEST_COVERAGE_PERCENT}}% of the code is automatically checked every time we make a change. {{TEST_COVERAGE_EXPLANATION}}.
- **{{PASSING_TESTS}} passing tests** means the system correctly handles {{PASSING_TESTS}} different scenarios without errors. {{PASSING_TESTS_EXPLANATION}}.
- **{{BUGS_CRITICAL}} critical bugs** means {{CRITICAL_BUGS_EXPLANATION}}. {{CRITICAL_BUGS_CONTEXT}}.
- **Performance at {{PERF_AVG_RESPONSE}}ms** means {{PERFORMANCE_EXPLANATION}}.

**Bottom line:** {{QUALITY_BOTTOM_LINE}}

---

*Next report: {{NEXT_REPORT_DATE}}*
