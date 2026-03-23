# Risk & Blockers Update

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}} | **Sprint:** #{{SPRINT_NUMBER}}
> **Prepared by:** {{AUTHOR_NAME}}

---

## What Changed Since Last Update

- {{RISK_CHANGE_1}}
- {{RISK_CHANGE_2}}
- {{RISK_CHANGE_3}}

---

## Active Blockers

Blockers are stopping work right now. These need immediate attention.

| # | Blocker | Blocking What | Since | Owner | Escalation Needed? |
|---|---------|--------------|-------|-------|-------------------|
| B-{{BLOCKER_1_ID}} | {{BLOCKER_1_DESCRIPTION}} | {{BLOCKER_1_BLOCKING}} | {{BLOCKER_1_SINCE_DATE}} | {{BLOCKER_1_OWNER}} | {{YES_NO}} |
| B-{{BLOCKER_2_ID}} | {{BLOCKER_2_DESCRIPTION}} | {{BLOCKER_2_BLOCKING}} | {{BLOCKER_2_SINCE_DATE}} | {{BLOCKER_2_OWNER}} | {{YES_NO}} |
| B-{{BLOCKER_3_ID}} | {{BLOCKER_3_DESCRIPTION}} | {{BLOCKER_3_BLOCKING}} | {{BLOCKER_3_SINCE_DATE}} | {{BLOCKER_3_OWNER}} | {{YES_NO}} |

> **What "blocker" means:** A blocker is something that has completely stopped progress on a feature. Unlike a risk (which might happen), a blocker is happening right now.

---

## Active Risks

Risks are things that could go wrong. We track them so we can act early.

| # | Risk | Likelihood | Impact | Mitigation | Owner | Status |
|---|------|-----------|--------|-----------|-------|--------|
| R-{{RISK_1_ID}} | {{RISK_1_DESCRIPTION}} | {{HIGH_MEDIUM_LOW}} | {{HIGH_MEDIUM_LOW}} | {{RISK_1_MITIGATION}} | {{RISK_1_OWNER}} | `[{{GREEN_YELLOW_RED}}]` |
| R-{{RISK_2_ID}} | {{RISK_2_DESCRIPTION}} | {{HIGH_MEDIUM_LOW}} | {{HIGH_MEDIUM_LOW}} | {{RISK_2_MITIGATION}} | {{RISK_2_OWNER}} | `[{{GREEN_YELLOW_RED}}]` |
| R-{{RISK_3_ID}} | {{RISK_3_DESCRIPTION}} | {{HIGH_MEDIUM_LOW}} | {{HIGH_MEDIUM_LOW}} | {{RISK_3_MITIGATION}} | {{RISK_3_OWNER}} | `[{{GREEN_YELLOW_RED}}]` |
| R-{{RISK_4_ID}} | {{RISK_4_DESCRIPTION}} | {{HIGH_MEDIUM_LOW}} | {{HIGH_MEDIUM_LOW}} | {{RISK_4_MITIGATION}} | {{RISK_4_OWNER}} | `[{{GREEN_YELLOW_RED}}]` |

**Status key:**
- `[GREEN] On track` — risk is identified, mitigation is working
- `[YELLOW] At risk` — likelihood increasing or mitigation is not yet effective
- `[RED] Blocked` — risk has materialized or is imminent, urgent action needed

**Risk matrix (quick view):**

|  | Low Impact | Medium Impact | High Impact |
|---|-----------|---------------|-------------|
| **High Likelihood** | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} |
| **Medium Likelihood** | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} |
| **Low Likelihood** | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} | {{RISKS_IN_CELL}} |

---

## Resolved Since Last Update

| # | What | Resolution | Date Resolved |
|---|------|-----------|---------------|
| {{RESOLVED_1_ID}} | {{RESOLVED_1_DESCRIPTION}} | {{RESOLVED_1_HOW}} | {{RESOLVED_1_DATE}} |
| {{RESOLVED_2_ID}} | {{RESOLVED_2_DESCRIPTION}} | {{RESOLVED_2_HOW}} | {{RESOLVED_2_DATE}} |

---

## Stakeholder Actions Needed

These items require action from stakeholders to keep the project on track:

| What We Need | From Whom | By When | Impact if Delayed |
|-------------|-----------|---------|-------------------|
| {{ACTION_1}} | {{ACTION_1_FROM}} | {{ACTION_1_DEADLINE}} | {{ACTION_1_DELAY_IMPACT}} |
| {{ACTION_2}} | {{ACTION_2_FROM}} | {{ACTION_2_DEADLINE}} | {{ACTION_2_DELAY_IMPACT}} |
| {{ACTION_3}} | {{ACTION_3_FROM}} | {{ACTION_3_DEADLINE}} | {{ACTION_3_DELAY_IMPACT}} |

---

## Risk Trend

**Overall risk is {{INCREASING_STABLE_DECREASING}} because:**

{{RISK_TREND_EXPLANATION_PLAIN_ENGLISH}}

| Period | Active Blockers | Active Risks (High) | Active Risks (Total) | Trend |
|--------|----------------|--------------------|--------------------|-------|
| This update | {{CURRENT_BLOCKERS}} | {{CURRENT_HIGH_RISKS}} | {{CURRENT_TOTAL_RISKS}} | — |
| Last update | {{LAST_BLOCKERS}} | {{LAST_HIGH_RISKS}} | {{LAST_TOTAL_RISKS}} | {{TREND_DIRECTION}} |
| Two updates ago | {{PREV_BLOCKERS}} | {{PREV_HIGH_RISKS}} | {{PREV_TOTAL_RISKS}} | {{TREND_DIRECTION}} |

---

_Next update: {{NEXT_UPDATE_DATE}} | Escalation path: {{ESCALATION_PATH}}_
