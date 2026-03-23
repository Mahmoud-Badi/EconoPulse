# Bug Triage Summary

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}}
> **Report Period:** {{PERIOD_START}} to {{PERIOD_END}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## Bug Summary

| Severity | Open | Target | Status |
|----------|------|--------|--------|
| **Critical** | {{BUGS_CRITICAL}} | 0 | {{BUGS_CRITICAL_STATUS}} |
| **High** | {{BUGS_HIGH}} | {{BUGS_HIGH_TARGET}} | {{BUGS_HIGH_STATUS}} |
| **Medium** | {{BUGS_MEDIUM}} | {{BUGS_MEDIUM_TARGET}} | {{BUGS_MEDIUM_STATUS}} |
| **Low** | {{BUGS_LOW}} | {{BUGS_LOW_TARGET}} | {{BUGS_LOW_STATUS}} |
| **Total Open** | **{{BUGS_TOTAL_OPEN}}** | **{{BUGS_TOTAL_TARGET}}** | **{{BUGS_TOTAL_STATUS}}** |

---

## Changes Since Last Report

### New Bugs Opened: {{NEW_BUGS_COUNT}}

| # | Bug | Severity | Found In | Assigned To |
|---|-----|----------|----------|-------------|
| {{NEW_BUG_1_ID}} | {{NEW_BUG_1_TITLE}} | {{NEW_BUG_1_SEVERITY}} | {{NEW_BUG_1_AREA}} | {{NEW_BUG_1_OWNER}} |
| {{NEW_BUG_2_ID}} | {{NEW_BUG_2_TITLE}} | {{NEW_BUG_2_SEVERITY}} | {{NEW_BUG_2_AREA}} | {{NEW_BUG_2_OWNER}} |
| {{NEW_BUG_3_ID}} | {{NEW_BUG_3_TITLE}} | {{NEW_BUG_3_SEVERITY}} | {{NEW_BUG_3_AREA}} | {{NEW_BUG_3_OWNER}} |

### Resolved Since Last Report: {{RESOLVED_BUGS_COUNT}}

| # | Bug | Severity | Resolution | Resolved By |
|---|-----|----------|------------|-------------|
| {{RESOLVED_BUG_1_ID}} | {{RESOLVED_BUG_1_TITLE}} | {{RESOLVED_BUG_1_SEVERITY}} | {{RESOLVED_BUG_1_RESOLUTION}} | {{RESOLVED_BUG_1_OWNER}} |
| {{RESOLVED_BUG_2_ID}} | {{RESOLVED_BUG_2_TITLE}} | {{RESOLVED_BUG_2_SEVERITY}} | {{RESOLVED_BUG_2_RESOLUTION}} | {{RESOLVED_BUG_2_OWNER}} |
| {{RESOLVED_BUG_3_ID}} | {{RESOLVED_BUG_3_TITLE}} | {{RESOLVED_BUG_3_SEVERITY}} | {{RESOLVED_BUG_3_RESOLUTION}} | {{RESOLVED_BUG_3_OWNER}} |

**Net change:** {{NET_BUG_CHANGE}} ({{NET_BUG_DIRECTION}})

---

## Critical Bugs Detail

| # | Bug | What Users Experience | Root Cause (Plain English) | Fix ETA | Status |
|---|-----|----------------------|---------------------------|---------|--------|
| {{CRIT_1_ID}} | {{CRIT_1_TITLE}} | {{CRIT_1_USER_EXPERIENCE}} | {{CRIT_1_ROOT_CAUSE}} | {{CRIT_1_ETA}} | {{CRIT_1_STATUS}} |
| {{CRIT_2_ID}} | {{CRIT_2_TITLE}} | {{CRIT_2_USER_EXPERIENCE}} | {{CRIT_2_ROOT_CAUSE}} | {{CRIT_2_ETA}} | {{CRIT_2_STATUS}} |
| {{CRIT_3_ID}} | {{CRIT_3_TITLE}} | {{CRIT_3_USER_EXPERIENCE}} | {{CRIT_3_ROOT_CAUSE}} | {{CRIT_3_ETA}} | {{CRIT_3_STATUS}} |

> **If no critical bugs:** No critical bugs are currently open. The system is stable and functioning as expected for all core user flows.

---

## Bug Trend

Bug count is **[{{BUG_TREND}}]**. This is **{{BUG_TREND_ASSESSMENT}}** because {{BUG_TREND_RATIONALE}}.

<!-- Use one of:
  INCREASING — more bugs being found than fixed
  STABLE — bugs found and fixed at roughly equal rates
  DECREASING — more bugs being resolved than discovered
-->

| Period | Opened | Closed | Net | Total Open |
|--------|--------|--------|-----|------------|
| {{TREND_PERIOD_1}} | {{TREND_OPENED_1}} | {{TREND_CLOSED_1}} | {{TREND_NET_1}} | {{TREND_TOTAL_1}} |
| {{TREND_PERIOD_2}} | {{TREND_OPENED_2}} | {{TREND_CLOSED_2}} | {{TREND_NET_2}} | {{TREND_TOTAL_2}} |
| {{TREND_PERIOD_3}} | {{TREND_OPENED_3}} | {{TREND_CLOSED_3}} | {{TREND_NET_3}} | {{TREND_TOTAL_3}} |
| **Current** | **{{TREND_OPENED_CURRENT}}** | **{{TREND_CLOSED_CURRENT}}** | **{{TREND_NET_CURRENT}}** | **{{TREND_TOTAL_CURRENT}}** |

---

## Impact Assessment

### Features Affected by Open Bugs

| Feature | Bug Count | Highest Severity | User Impact | Workaround Available? |
|---------|-----------|-----------------|-------------|----------------------|
| {{AFFECTED_FEATURE_1}} | {{AFFECTED_COUNT_1}} | {{AFFECTED_SEVERITY_1}} | {{AFFECTED_IMPACT_1}} | {{AFFECTED_WORKAROUND_1}} |
| {{AFFECTED_FEATURE_2}} | {{AFFECTED_COUNT_2}} | {{AFFECTED_SEVERITY_2}} | {{AFFECTED_IMPACT_2}} | {{AFFECTED_WORKAROUND_2}} |
| {{AFFECTED_FEATURE_3}} | {{AFFECTED_COUNT_3}} | {{AFFECTED_SEVERITY_3}} | {{AFFECTED_IMPACT_3}} | {{AFFECTED_WORKAROUND_3}} |

### What Users CAN Do
- {{CAN_DO_1}}
- {{CAN_DO_2}}
- {{CAN_DO_3}}

### What Users CAN'T Do (Due to Bugs)
- {{CANNOT_DO_1}} — Expected fix: {{CANNOT_DO_1_ETA}}
- {{CANNOT_DO_2}} — Expected fix: {{CANNOT_DO_2_ETA}}
- {{CANNOT_DO_3}} — Expected fix: {{CANNOT_DO_3_ETA}}

---

## Resolution Timeline

| Milestone | Target Date | Status |
|-----------|------------|--------|
| All Critical bugs resolved | {{CRITICAL_RESOLVE_DATE}} | {{CRITICAL_RESOLVE_STATUS}} |
| All High bugs resolved | {{HIGH_RESOLVE_DATE}} | {{HIGH_RESOLVE_STATUS}} |
| All Medium bugs resolved (or deferred) | {{MEDIUM_RESOLVE_DATE}} | {{MEDIUM_RESOLVE_STATUS}} |
| Bug-free release candidate | {{RC_DATE}} | {{RC_STATUS}} |

**Confidence level:** {{RESOLUTION_CONFIDENCE}} — {{RESOLUTION_CONFIDENCE_RATIONALE}}

---

*Next triage report: {{NEXT_REPORT_DATE}}*
