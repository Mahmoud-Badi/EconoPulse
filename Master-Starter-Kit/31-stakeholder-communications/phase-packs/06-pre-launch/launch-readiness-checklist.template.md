# Launch Readiness Checklist

> **Project:** {{PROJECT_NAME}}
> **Target Launch Date:** {{LAUNCH_DATE}}
> **Date:** {{REPORT_DATE}}
> **Prepared By:** {{AUTHOR_NAME}}
> **Distribution:** {{DISTRIBUTION_LIST}}

---

## Launch Readiness Score

### **{{READINESS_COMPLETE}} / {{READINESS_TOTAL}} items complete**

**Overall Status: [{{READINESS_STATUS_COLOR}}] {{READINESS_STATUS_LABEL}}**

<!-- Status:
  [GREEN] On track — all critical items complete or on schedule
  [YELLOW] At risk — some items behind schedule, mitigation in progress
  [RED] Blocked — critical items incomplete, launch date at risk
-->

---

## Checklist

### Features

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 1 | {{FEAT_1_ITEM}} | {{FEAT_1_STATUS}} | {{FEAT_1_OWNER}} | {{FEAT_1_NOTES}} |
| 2 | {{FEAT_2_ITEM}} | {{FEAT_2_STATUS}} | {{FEAT_2_OWNER}} | {{FEAT_2_NOTES}} |
| 3 | {{FEAT_3_ITEM}} | {{FEAT_3_STATUS}} | {{FEAT_3_OWNER}} | {{FEAT_3_NOTES}} |
| 4 | {{FEAT_4_ITEM}} | {{FEAT_4_STATUS}} | {{FEAT_4_OWNER}} | {{FEAT_4_NOTES}} |

### Testing

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 5 | Unit test coverage meets target | {{TEST_1_STATUS}} | {{TEST_1_OWNER}} | {{TEST_1_NOTES}} |
| 6 | Integration tests passing | {{TEST_2_STATUS}} | {{TEST_2_OWNER}} | {{TEST_2_NOTES}} |
| 7 | E2E tests passing | {{TEST_3_STATUS}} | {{TEST_3_OWNER}} | {{TEST_3_NOTES}} |
| 8 | UAT complete and signed off | {{TEST_4_STATUS}} | {{TEST_4_OWNER}} | {{TEST_4_NOTES}} |
| 9 | Regression tests passing | {{TEST_5_STATUS}} | {{TEST_5_OWNER}} | {{TEST_5_NOTES}} |

### Security

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 10 | Security audit complete | {{SEC_1_STATUS}} | {{SEC_1_OWNER}} | {{SEC_1_NOTES}} |
| 11 | Penetration testing complete | {{SEC_2_STATUS}} | {{SEC_2_OWNER}} | {{SEC_2_NOTES}} |
| 12 | SSL/TLS certificates configured | {{SEC_3_STATUS}} | {{SEC_3_OWNER}} | {{SEC_3_NOTES}} |
| 13 | Authentication & authorization verified | {{SEC_4_STATUS}} | {{SEC_4_OWNER}} | {{SEC_4_NOTES}} |
| 14 | Data encryption at rest and in transit | {{SEC_5_STATUS}} | {{SEC_5_OWNER}} | {{SEC_5_NOTES}} |

### Performance

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 15 | Load testing complete | {{PERF_1_STATUS}} | {{PERF_1_OWNER}} | {{PERF_1_NOTES}} |
| 16 | Performance targets met | {{PERF_2_STATUS}} | {{PERF_2_OWNER}} | {{PERF_2_NOTES}} |
| 17 | CDN configured | {{PERF_3_STATUS}} | {{PERF_3_OWNER}} | {{PERF_3_NOTES}} |
| 18 | Database optimized | {{PERF_4_STATUS}} | {{PERF_4_OWNER}} | {{PERF_4_NOTES}} |

### Infrastructure

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 19 | Production environment provisioned | {{INFRA_1_STATUS}} | {{INFRA_1_OWNER}} | {{INFRA_1_NOTES}} |
| 20 | DNS configured | {{INFRA_2_STATUS}} | {{INFRA_2_OWNER}} | {{INFRA_2_NOTES}} |
| 21 | Monitoring & alerting set up | {{INFRA_3_STATUS}} | {{INFRA_3_OWNER}} | {{INFRA_3_NOTES}} |
| 22 | Backup & recovery tested | {{INFRA_4_STATUS}} | {{INFRA_4_OWNER}} | {{INFRA_4_NOTES}} |
| 23 | CI/CD pipeline to production ready | {{INFRA_5_STATUS}} | {{INFRA_5_OWNER}} | {{INFRA_5_NOTES}} |

### Documentation

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 24 | User documentation / help content | {{DOC_1_STATUS}} | {{DOC_1_OWNER}} | {{DOC_1_NOTES}} |
| 25 | API documentation (if applicable) | {{DOC_2_STATUS}} | {{DOC_2_OWNER}} | {{DOC_2_NOTES}} |
| 26 | Runbook / operations guide | {{DOC_3_STATUS}} | {{DOC_3_OWNER}} | {{DOC_3_NOTES}} |

### Legal

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 27 | Privacy policy published | {{LEGAL_1_STATUS}} | {{LEGAL_1_OWNER}} | {{LEGAL_1_NOTES}} |
| 28 | Terms of service published | {{LEGAL_2_STATUS}} | {{LEGAL_2_OWNER}} | {{LEGAL_2_NOTES}} |
| 29 | GDPR / compliance requirements met | {{LEGAL_3_STATUS}} | {{LEGAL_3_OWNER}} | {{LEGAL_3_NOTES}} |
| 30 | Cookie consent implemented | {{LEGAL_4_STATUS}} | {{LEGAL_4_OWNER}} | {{LEGAL_4_NOTES}} |

### Marketing

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 31 | Launch announcement prepared | {{MKTG_1_STATUS}} | {{MKTG_1_OWNER}} | {{MKTG_1_NOTES}} |
| 32 | Social media content scheduled | {{MKTG_2_STATUS}} | {{MKTG_2_OWNER}} | {{MKTG_2_NOTES}} |
| 33 | Email notifications configured | {{MKTG_3_STATUS}} | {{MKTG_3_OWNER}} | {{MKTG_3_NOTES}} |

### Support

| # | Item | Status | Owner | Notes |
|---|------|--------|-------|-------|
| 34 | Support team trained | {{SUPPORT_1_STATUS}} | {{SUPPORT_1_OWNER}} | {{SUPPORT_1_NOTES}} |
| 35 | Support channels configured | {{SUPPORT_2_STATUS}} | {{SUPPORT_2_OWNER}} | {{SUPPORT_2_NOTES}} |
| 36 | Escalation process documented | {{SUPPORT_3_STATUS}} | {{SUPPORT_3_OWNER}} | {{SUPPORT_3_NOTES}} |
| 37 | FAQ / known issues page ready | {{SUPPORT_4_STATUS}} | {{SUPPORT_4_OWNER}} | {{SUPPORT_4_NOTES}} |

<!-- Status values: [DONE] / [IN PROGRESS] / [NOT STARTED] / [N/A] -->

---

## Blocking Issues

| # | Issue | Category | Impact | Owner | ETA | Status |
|---|-------|----------|--------|-------|-----|--------|
| {{BLOCKER_1_ID}} | {{BLOCKER_1_DESCRIPTION}} | {{BLOCKER_1_CATEGORY}} | {{BLOCKER_1_IMPACT}} | {{BLOCKER_1_OWNER}} | {{BLOCKER_1_ETA}} | {{BLOCKER_1_STATUS}} |
| {{BLOCKER_2_ID}} | {{BLOCKER_2_DESCRIPTION}} | {{BLOCKER_2_CATEGORY}} | {{BLOCKER_2_IMPACT}} | {{BLOCKER_2_OWNER}} | {{BLOCKER_2_ETA}} | {{BLOCKER_2_STATUS}} |
| {{BLOCKER_3_ID}} | {{BLOCKER_3_DESCRIPTION}} | {{BLOCKER_3_CATEGORY}} | {{BLOCKER_3_IMPACT}} | {{BLOCKER_3_OWNER}} | {{BLOCKER_3_ETA}} | {{BLOCKER_3_STATUS}} |

> **If no blockers:** No blocking issues identified. All critical-path items are on track.

---

## Launch Timeline

| When | Action | Owner | Status |
|------|--------|-------|--------|
| **T-7 days** | Final regression test pass | {{T7_OWNER}} | {{T7_STATUS}} |
| **T-7 days** | Freeze feature development | {{T7_FREEZE_OWNER}} | {{T7_FREEZE_STATUS}} |
| **T-3 days** | Production environment smoke test | {{T3_OWNER}} | {{T3_STATUS}} |
| **T-3 days** | Stakeholder go/no-go decision | {{T3_DECISION_OWNER}} | {{T3_DECISION_STATUS}} |
| **T-1 day** | Final data migration / prep | {{T1_OWNER}} | {{T1_STATUS}} |
| **T-1 day** | War room / on-call schedule confirmed | {{T1_ONCALL_OWNER}} | {{T1_ONCALL_STATUS}} |
| **Launch day** | Deploy to production | {{L_DEPLOY_OWNER}} | {{L_DEPLOY_STATUS}} |
| **Launch day** | Smoke test production | {{L_SMOKE_OWNER}} | {{L_SMOKE_STATUS}} |
| **Launch day** | DNS cutover / go live | {{L_GOLIVE_OWNER}} | {{L_GOLIVE_STATUS}} |
| **Launch day** | Send launch communications | {{L_COMMS_OWNER}} | {{L_COMMS_STATUS}} |
| **T+1 day** | Monitor metrics and errors | {{T1P_MONITOR_OWNER}} | {{T1P_MONITOR_STATUS}} |
| **T+1 day** | Gather initial user feedback | {{T1P_FEEDBACK_OWNER}} | {{T1P_FEEDBACK_STATUS}} |
| **T+1 day** | Publish launch results report | {{T1P_REPORT_OWNER}} | {{T1P_REPORT_STATUS}} |

---

## Rollback Plan Summary

**In plain English:** If something goes wrong after launch, here is what we do.

1. **Detection:** {{ROLLBACK_DETECTION}} — how we know something is wrong.
2. **Decision:** {{ROLLBACK_DECISION_MAKER}} decides to roll back if {{ROLLBACK_CRITERIA}}.
3. **Execution:** {{ROLLBACK_METHOD}} — estimated time: {{ROLLBACK_DURATION}}.
4. **Communication:** {{ROLLBACK_COMMS}} — who gets notified and how.
5. **Recovery:** {{ROLLBACK_RECOVERY}} — what happens next after rollback.

> **Detailed rollback plan:** {{ROLLBACK_PLAN_LINK}}

---

*Last updated: {{REPORT_DATE}}*
