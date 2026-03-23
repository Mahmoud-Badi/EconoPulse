# Go / No-Go Decision

> **Project:** {{PROJECT_NAME}}
> **Date:** {{REPORT_DATE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## Decision

### **[{{DECISION}}]**

<!-- Use one of:
  [GREEN] GO — all criteria met, proceed with launch
  [YELLOW] CONDITIONAL GO — proceed with launch subject to conditions below
  [RED] NO-GO — launch postponed, critical criteria not met
-->

| Detail | Value |
|--------|-------|
| **Decision Date** | {{DECISION_DATE}} |
| **Decision Makers** | {{DECISION_MAKERS}} |
| **Target Launch Date** | {{LAUNCH_DATE}} |
| **Next Review (if No-Go)** | {{NEXT_REVIEW_DATE}} |

---

## Readiness Assessment

| Area | Ready? | Confidence | Blockers | Owner |
|------|--------|------------|----------|-------|
| Core Features | {{READY_FEATURES}} | {{CONFIDENCE_FEATURES}} | {{BLOCKERS_FEATURES}} | {{OWNER_FEATURES}} |
| Performance | {{READY_PERFORMANCE}} | {{CONFIDENCE_PERFORMANCE}} | {{BLOCKERS_PERFORMANCE}} | {{OWNER_PERFORMANCE}} |
| Security | {{READY_SECURITY}} | {{CONFIDENCE_SECURITY}} | {{BLOCKERS_SECURITY}} | {{OWNER_SECURITY}} |
| Testing | {{READY_TESTING}} | {{CONFIDENCE_TESTING}} | {{BLOCKERS_TESTING}} | {{OWNER_TESTING}} |
| Infrastructure | {{READY_INFRASTRUCTURE}} | {{CONFIDENCE_INFRASTRUCTURE}} | {{BLOCKERS_INFRASTRUCTURE}} | {{OWNER_INFRASTRUCTURE}} |
| Documentation | {{READY_DOCUMENTATION}} | {{CONFIDENCE_DOCUMENTATION}} | {{BLOCKERS_DOCUMENTATION}} | {{OWNER_DOCUMENTATION}} |
| Support | {{READY_SUPPORT}} | {{CONFIDENCE_SUPPORT}} | {{BLOCKERS_SUPPORT}} | {{OWNER_SUPPORT}} |
| Legal | {{READY_LEGAL}} | {{CONFIDENCE_LEGAL}} | {{BLOCKERS_LEGAL}} | {{OWNER_LEGAL}} |

<!-- Ready: Yes / No / Partial -->
<!-- Confidence: High / Medium / Low -->

---

## Go Criteria

| Criterion | Required | Actual | Pass? |
|-----------|----------|--------|-------|
| All critical bugs resolved | 0 critical bugs | {{ACTUAL_CRITICAL_BUGS}} | {{PASS_CRITICAL_BUGS}} |
| Test coverage | {{REQUIRED_COVERAGE}}% | {{ACTUAL_COVERAGE}}% | {{PASS_COVERAGE}} |
| UAT signed off | All features accepted | {{ACTUAL_UAT}} | {{PASS_UAT}} |
| Performance targets met | {{REQUIRED_PERF}} | {{ACTUAL_PERF}} | {{PASS_PERF}} |
| Security audit passed | No critical findings | {{ACTUAL_SECURITY}} | {{PASS_SECURITY}} |
| Rollback plan tested | Verified | {{ACTUAL_ROLLBACK}} | {{PASS_ROLLBACK}} |
| Monitoring in place | All dashboards active | {{ACTUAL_MONITORING}} | {{PASS_MONITORING}} |
| Support team ready | Trained and staffed | {{ACTUAL_SUPPORT}} | {{PASS_SUPPORT}} |
| {{CUSTOM_CRITERION_1}} | {{CUSTOM_REQUIRED_1}} | {{CUSTOM_ACTUAL_1}} | {{CUSTOM_PASS_1}} |
| {{CUSTOM_CRITERION_2}} | {{CUSTOM_REQUIRED_2}} | {{CUSTOM_ACTUAL_2}} | {{CUSTOM_PASS_2}} |

**Pass rate:** {{CRITERIA_PASSED}} / {{CRITERIA_TOTAL}} criteria met

---

## Risk Acceptance

> These risks have been evaluated and accepted for launch.

| Risk | Impact | Likelihood | Mitigation | Accepted By |
|------|--------|------------|------------|-------------|
| {{RISK_1_DESCRIPTION}} | {{RISK_1_IMPACT}} | {{RISK_1_LIKELIHOOD}} | {{RISK_1_MITIGATION}} | {{RISK_1_ACCEPTED_BY}} |
| {{RISK_2_DESCRIPTION}} | {{RISK_2_IMPACT}} | {{RISK_2_LIKELIHOOD}} | {{RISK_2_MITIGATION}} | {{RISK_2_ACCEPTED_BY}} |
| {{RISK_3_DESCRIPTION}} | {{RISK_3_IMPACT}} | {{RISK_3_LIKELIHOOD}} | {{RISK_3_MITIGATION}} | {{RISK_3_ACCEPTED_BY}} |
| {{RISK_4_DESCRIPTION}} | {{RISK_4_IMPACT}} | {{RISK_4_LIKELIHOOD}} | {{RISK_4_MITIGATION}} | {{RISK_4_ACCEPTED_BY}} |
| {{RISK_5_DESCRIPTION}} | {{RISK_5_IMPACT}} | {{RISK_5_LIKELIHOOD}} | {{RISK_5_MITIGATION}} | {{RISK_5_ACCEPTED_BY}} |

---

## Conditions (if Conditional Go)

> These conditions must be met before or immediately after launch.

### Before Launch

| # | Condition | Owner | Deadline | Status |
|---|-----------|-------|----------|--------|
| 1 | {{PRE_CONDITION_1}} | {{PRE_CONDITION_1_OWNER}} | {{PRE_CONDITION_1_DEADLINE}} | {{PRE_CONDITION_1_STATUS}} |
| 2 | {{PRE_CONDITION_2}} | {{PRE_CONDITION_2_OWNER}} | {{PRE_CONDITION_2_DEADLINE}} | {{PRE_CONDITION_2_STATUS}} |
| 3 | {{PRE_CONDITION_3}} | {{PRE_CONDITION_3_OWNER}} | {{PRE_CONDITION_3_DEADLINE}} | {{PRE_CONDITION_3_STATUS}} |

### Immediately After Launch (within {{POST_LAUNCH_WINDOW}})

| # | Condition | Owner | Deadline | Status |
|---|-----------|-------|----------|--------|
| 1 | {{POST_CONDITION_1}} | {{POST_CONDITION_1_OWNER}} | {{POST_CONDITION_1_DEADLINE}} | {{POST_CONDITION_1_STATUS}} |
| 2 | {{POST_CONDITION_2}} | {{POST_CONDITION_2_OWNER}} | {{POST_CONDITION_2_DEADLINE}} | {{POST_CONDITION_2_STATUS}} |
| 3 | {{POST_CONDITION_3}} | {{POST_CONDITION_3_OWNER}} | {{POST_CONDITION_3_DEADLINE}} | {{POST_CONDITION_3_STATUS}} |

---

## Sign-off

| Name | Role | Decision | Date | Signature |
|------|------|----------|------|-----------|
| {{SIGNOFF_1_NAME}} | {{SIGNOFF_1_ROLE}} | {{SIGNOFF_1_DECISION}} | {{SIGNOFF_1_DATE}} | _________________ |
| {{SIGNOFF_2_NAME}} | {{SIGNOFF_2_ROLE}} | {{SIGNOFF_2_DECISION}} | {{SIGNOFF_2_DATE}} | _________________ |
| {{SIGNOFF_3_NAME}} | {{SIGNOFF_3_ROLE}} | {{SIGNOFF_3_DECISION}} | {{SIGNOFF_3_DATE}} | _________________ |
| {{SIGNOFF_4_NAME}} | {{SIGNOFF_4_ROLE}} | {{SIGNOFF_4_DECISION}} | {{SIGNOFF_4_DATE}} | _________________ |
| {{SIGNOFF_5_NAME}} | {{SIGNOFF_5_ROLE}} | {{SIGNOFF_5_DECISION}} | {{SIGNOFF_5_DATE}} | _________________ |

<!-- Decision values: GO / NO-GO / CONDITIONAL GO / ABSTAIN -->

---

*Document finalized: {{DECISION_DATE}}*
