# Budget Burn Report

> **Project:** {{PROJECT_NAME}}
> **Report Date:** {{REPORT_DATE}} | **Sprint:** #{{SPRINT_NUMBER}}
> **Report Period:** {{PERIOD_START_DATE}} → {{PERIOD_END_DATE}}
> **Prepared by:** {{AUTHOR_NAME}}

---

## What Changed Since Last Update

- {{BUDGET_CHANGE_1}}
- {{BUDGET_CHANGE_2}}
- {{BUDGET_CHANGE_3}}

---

## Budget Summary

| Category | Budget | Spent to Date | Remaining | Burn Rate / {{PERIOD_UNIT}} | Projected at Completion |
|----------|--------|--------------|-----------|---------------------------|------------------------|
| Development | {{DEV_BUDGET}} | {{DEV_SPENT}} | {{DEV_REMAINING}} | {{DEV_BURN_RATE}} | {{DEV_PROJECTED}} |
| Design | {{DESIGN_BUDGET}} | {{DESIGN_SPENT}} | {{DESIGN_REMAINING}} | {{DESIGN_BURN_RATE}} | {{DESIGN_PROJECTED}} |
| Infrastructure | {{INFRA_BUDGET}} | {{INFRA_SPENT}} | {{INFRA_REMAINING}} | {{INFRA_BURN_RATE}} | {{INFRA_PROJECTED}} |
| Third-party services | {{THIRDPARTY_BUDGET}} | {{THIRDPARTY_SPENT}} | {{THIRDPARTY_REMAINING}} | {{THIRDPARTY_BURN_RATE}} | {{THIRDPARTY_PROJECTED}} |
| Contingency | {{CONTINGENCY_BUDGET}} | {{CONTINGENCY_SPENT}} | {{CONTINGENCY_REMAINING}} | — | — |
| **Total** | **{{TOTAL_BUDGET}}** | **{{TOTAL_SPENT}}** | **{{TOTAL_REMAINING}}** | **{{TOTAL_BURN_RATE}}** | **{{TOTAL_PROJECTED}}** |

---

## Overall Budget Health

| Metric | Value | Status |
|--------|-------|--------|
| Total budget | {{TOTAL_BUDGET}} | — |
| Total spent | {{TOTAL_SPENT}} | — |
| Percentage used | {{PERCENT_USED}}% | {{GREEN_YELLOW_RED}} |
| Projected overage / underage | {{PROJECTED_VARIANCE}} | {{GREEN_YELLOW_RED}} |
| Project completion | {{PERCENT_COMPLETE}}% through scope | — |

**Status key:**
- `[GREEN] On track` — spending is proportional to progress
- `[YELLOW] At risk` — spending is outpacing progress, or a category is over budget
- `[RED] Blocked` — projected to exceed budget without intervention

---

## Burn Rate Analysis

**At the current rate of {{TOTAL_BURN_RATE}} per {{PERIOD_UNIT}}, the budget will last until {{BUDGET_EXHAUSTION_DATE}}.**

**The project end date is {{PROJECT_END_DATE}}.**

{{BURN_RATE_ASSESSMENT_PLAIN_ENGLISH}}

| Scenario | Monthly Burn | Budget Lasts Until | vs. Project End |
|----------|-------------|-------------------|-----------------|
| Current rate | {{CURRENT_BURN}} | {{CURRENT_EXHAUSTION}} | {{AHEAD_BEHIND_ON_TRACK}} |
| Best case | {{BEST_BURN}} | {{BEST_EXHAUSTION}} | {{AHEAD_BEHIND_ON_TRACK}} |
| Worst case | {{WORST_BURN}} | {{WORST_EXHAUSTION}} | {{AHEAD_BEHIND_ON_TRACK}} |

---

## Variance Explanation

Where we are over or under budget, and why:

| Category | Variance | Over / Under | Explanation |
|----------|----------|-------------|-------------|
| {{VARIANCE_CATEGORY_1}} | {{VARIANCE_1_AMOUNT}} | {{OVER_UNDER}} | {{VARIANCE_1_EXPLANATION_PLAIN_ENGLISH}} |
| {{VARIANCE_CATEGORY_2}} | {{VARIANCE_2_AMOUNT}} | {{OVER_UNDER}} | {{VARIANCE_2_EXPLANATION_PLAIN_ENGLISH}} |
| {{VARIANCE_CATEGORY_3}} | {{VARIANCE_3_AMOUNT}} | {{OVER_UNDER}} | {{VARIANCE_3_EXPLANATION_PLAIN_ENGLISH}} |

---

## Cost Decisions Needed

These upcoming costs require stakeholder approval:

| Item | Estimated Cost | Needed By | Why | Approved? |
|------|---------------|-----------|-----|-----------|
| {{COST_DECISION_1}} | {{COST_1_AMOUNT}} | {{COST_1_DEADLINE}} | {{COST_1_RATIONALE_PLAIN_ENGLISH}} | {{YES_NO_PENDING}} |
| {{COST_DECISION_2}} | {{COST_2_AMOUNT}} | {{COST_2_DEADLINE}} | {{COST_2_RATIONALE_PLAIN_ENGLISH}} | {{YES_NO_PENDING}} |

---

## Projection: Final Cost vs. Original Budget

| | Original Budget | Current Projection | Difference |
|---|----------------|-------------------|------------|
| Total | {{ORIGINAL_TOTAL_BUDGET}} | {{PROJECTED_FINAL_COST}} | {{PROJECTION_DIFFERENCE}} |

**Confidence level:** {{HIGH_MEDIUM_LOW}} — {{CONFIDENCE_EXPLANATION}}

> **What this means:** {{PROJECTION_PLAIN_ENGLISH_SUMMARY}}

---

_Next update: {{NEXT_UPDATE_DATE}} | Budget review cadence: {{BUDGET_REVIEW_CADENCE}}_
