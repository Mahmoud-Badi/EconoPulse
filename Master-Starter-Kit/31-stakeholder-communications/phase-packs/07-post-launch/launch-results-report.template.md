# Launch Results Report

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## Launch Details

| Detail | Value |
|--------|-------|
| **Launch Date** | {{LAUNCH_DATE}} |
| **Launch Time** | {{LAUNCH_TIME}} ({{TIMEZONE}}) |
| **Deployment Duration** | {{DEPLOYMENT_DURATION}} |
| **Deployed By** | {{DEPLOYED_BY}} |
| **Environment** | {{PRODUCTION_URL}} |

---

## Launch Status

### **[{{LAUNCH_STATUS_COLOR}}] {{LAUNCH_STATUS_LABEL}}**

<!-- Use one of:
  [GREEN] SUCCESSFUL — deployed without issues, all systems operational
  [YELLOW] SUCCESSFUL WITH ISSUES — deployed with minor issues, mitigations in place
  [RED] ROLLED BACK — critical issues detected, reverted to previous version
-->

{{LAUNCH_STATUS_SUMMARY}}

---

## Key Metrics

### First 24 Hours

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Users Registered | {{24H_USERS_REGISTERED}} | {{24H_USERS_TARGET}} | {{24H_USERS_STATUS}} |
| Active Users | {{24H_ACTIVE_USERS}} | {{24H_ACTIVE_TARGET}} | {{24H_ACTIVE_STATUS}} |
| Total Errors | {{24H_ERRORS}} | {{24H_ERRORS_TARGET}} | {{24H_ERRORS_STATUS}} |
| Avg Response Time | {{24H_RESPONSE_TIME}}ms | {{24H_RESPONSE_TARGET}}ms | {{24H_RESPONSE_STATUS}} |
| Uptime | {{24H_UPTIME}}% | {{24H_UPTIME_TARGET}}% | {{24H_UPTIME_STATUS}} |
| Page Load Time | {{24H_PAGE_LOAD}}s | {{24H_PAGE_LOAD_TARGET}}s | {{24H_PAGE_LOAD_STATUS}} |
| {{24H_CUSTOM_METRIC_1}} | {{24H_CUSTOM_VALUE_1}} | {{24H_CUSTOM_TARGET_1}} | {{24H_CUSTOM_STATUS_1}} |

### First Week

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Users Registered | {{1W_USERS_REGISTERED}} | {{1W_USERS_TARGET}} | {{1W_USERS_STATUS}} |
| Daily Active Users (avg) | {{1W_DAU}} | {{1W_DAU_TARGET}} | {{1W_DAU_STATUS}} |
| Total Errors | {{1W_ERRORS}} | {{1W_ERRORS_TARGET}} | {{1W_ERRORS_STATUS}} |
| Avg Response Time | {{1W_RESPONSE_TIME}}ms | {{1W_RESPONSE_TARGET}}ms | {{1W_RESPONSE_STATUS}} |
| Uptime | {{1W_UPTIME}}% | {{1W_UPTIME_TARGET}}% | {{1W_UPTIME_STATUS}} |
| {{1W_CUSTOM_METRIC_1}} | {{1W_CUSTOM_VALUE_1}} | {{1W_CUSTOM_TARGET_1}} | {{1W_CUSTOM_STATUS_1}} |

---

## Issues Encountered

| # | Issue | Impact | Resolution | Time to Fix |
|---|-------|--------|------------|-------------|
| 1 | {{ISSUE_1_DESCRIPTION}} | {{ISSUE_1_IMPACT}} | {{ISSUE_1_RESOLUTION}} | {{ISSUE_1_TTF}} |
| 2 | {{ISSUE_2_DESCRIPTION}} | {{ISSUE_2_IMPACT}} | {{ISSUE_2_RESOLUTION}} | {{ISSUE_2_TTF}} |
| 3 | {{ISSUE_3_DESCRIPTION}} | {{ISSUE_3_IMPACT}} | {{ISSUE_3_RESOLUTION}} | {{ISSUE_3_TTF}} |
| 4 | {{ISSUE_4_DESCRIPTION}} | {{ISSUE_4_IMPACT}} | {{ISSUE_4_RESOLUTION}} | {{ISSUE_4_TTF}} |
| 5 | {{ISSUE_5_DESCRIPTION}} | {{ISSUE_5_IMPACT}} | {{ISSUE_5_RESOLUTION}} | {{ISSUE_5_TTF}} |

> **If no issues:** No issues were encountered during or after deployment. All systems performed as expected.

---

## User Feedback Summary

### Positive Highlights
- {{POSITIVE_FEEDBACK_1}}
- {{POSITIVE_FEEDBACK_2}}
- {{POSITIVE_FEEDBACK_3}}

### Concerns Raised
- {{CONCERN_1}} — **Action:** {{CONCERN_1_ACTION}}
- {{CONCERN_2}} — **Action:** {{CONCERN_2_ACTION}}
- {{CONCERN_3}} — **Action:** {{CONCERN_3_ACTION}}

### Feedback Sources
| Source | Volume | Sentiment |
|--------|--------|-----------|
| {{FEEDBACK_SOURCE_1}} | {{FEEDBACK_VOLUME_1}} | {{FEEDBACK_SENTIMENT_1}} |
| {{FEEDBACK_SOURCE_2}} | {{FEEDBACK_VOLUME_2}} | {{FEEDBACK_SENTIMENT_2}} |
| {{FEEDBACK_SOURCE_3}} | {{FEEDBACK_VOLUME_3}} | {{FEEDBACK_SENTIMENT_3}} |

---

## Celebration

Key achievements worth highlighting:

- {{WIN_1}}
- {{WIN_2}}
- {{WIN_3}}
- {{WIN_4}}
- {{WIN_5}}

**Thank you to:** {{ACKNOWLEDGMENTS}}

---

*Next metrics review: {{NEXT_REVIEW_DATE}}*
