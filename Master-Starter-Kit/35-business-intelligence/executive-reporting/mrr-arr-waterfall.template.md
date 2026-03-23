# MRR / ARR Waterfall Analysis

> **Owner:** {{STAKEHOLDER_CFO}} / Revenue Operations
> **Refresh cadence:** Monthly (within 3 business days of month-end)
> **Project:** {{PROJECT_NAME}}
> **Data warehouse:** {{BI_WAREHOUSE}}

---

## Purpose

This template defines the complete MRR waterfall methodology — how recurring revenue is measured, decomposed, attributed, and reported. The MRR waterfall is the single most important financial report for a subscription business. It answers: "Where did our revenue come from, where did it go, and why?"

---

## Table of Contents

1. [MRR Waterfall Formula](#1-mrr-waterfall-formula)
2. [Component Definitions](#2-component-definitions)
3. [Visualization Specification](#3-visualization-specification)
4. [Drill-Down Dimensions](#4-drill-down-dimensions)
5. [MRR Movement Detail Table](#5-mrr-movement-detail-table)
6. [ARR Calculation & Annualization Rules](#6-arr-calculation--annualization-rules)
7. [Gross vs Net MRR Movements](#7-gross-vs-net-mrr-movements)
8. [SQL Query Templates](#8-sql-query-templates)
9. [Alert Rules](#9-alert-rules)
10. [Cross-References](#10-cross-references)

---

## 1. MRR Waterfall Formula

```
Beginning MRR
  + New MRR
  + Expansion MRR
  + Reactivation MRR
  - Contraction MRR
  - Churn MRR
  ─────────────────
= Ending MRR
```

### Reconciliation Rule

**Ending MRR of month N MUST equal Beginning MRR of month N+1.** If it doesn't, there is a classification error or a timing issue in your billing system. Investigate before publishing.

### Monthly Summary Table

| Component | Amount | % of Beginning MRR | Account Count |
|---|---|---|---|
| Beginning MRR | ${{BI_BEGINNING_MRR}} | 100.0% | {{BI_BEGINNING_ACCOUNTS}} |
| + New MRR | ${{BI_NEW_MRR}} | — | — |
| + Expansion MRR | ${{BI_EXPANSION_MRR}} | — | — |
| + Reactivation MRR | ${{BI_REACTIVATION_MRR}} | — | — |
| - Contraction MRR | ${{BI_CONTRACTION_MRR}} | — | — |
| - Churn MRR | ${{BI_CHURN_MRR}} | — | — |
| **Ending MRR** | **${{BI_ENDING_MRR}}** | — | **{{BI_ENDING_ACCOUNTS}}** |
| **Net New MRR** | **${{BI_NET_NEW_MRR}}** | — | — |

---

## 2. Component Definitions

### New MRR

**Definition:** MRR from accounts that are paying for the FIRST TIME this month. The account had $0 MRR in the previous month AND has never previously been a paying customer.

**Examples:**
- A free-trial user converts to a $50/month paid plan → $50 New MRR.
- A user signs up and immediately selects a paid plan → New MRR.
- A user on a freemium plan upgrades to paid → New MRR (they were $0 MRR before).

**Edge cases:**
- If an account churned 6 months ago and returns, that is **Reactivation**, not New.
- If an account was on a free plan and upgrades to paid, that is New MRR (their first paid subscription).

**Classification rule:** Account MRR in previous month = $0 AND account has no prior payment history.

---

### Expansion MRR

**Definition:** The increase in MRR from existing paying customers who increase their spend. This includes upgrades, seat additions, add-on purchases, and usage overages that increase the recurring amount.

**Examples:**
- Account on $100/month plan upgrades to $200/month plan → $100 Expansion MRR.
- Account adds 5 seats at $10/seat/month → $50 Expansion MRR.
- Account purchases an add-on module at $30/month → $30 Expansion MRR.
- Usage-based account's recurring charge increases from $500 to $700 → $200 Expansion MRR.

**Edge cases:**
- One-time charges (setup fees, professional services) are NOT MRR and should not appear in the waterfall.
- If an account upgrades AND adds seats in the same month, sum all increases into one Expansion MRR entry.
- Annual-to-monthly conversion: if an annual customer switches to monthly at the same effective rate, there is $0 expansion. Only the delta in monthly-equivalent rate counts.

**Classification rule:** Account MRR in current month > Account MRR in previous month, AND previous month MRR > $0.

---

### Reactivation MRR

**Definition:** MRR from accounts that previously churned (had $0 MRR for at least one full month) and have now resumed paying.

**Examples:**
- Account churned in January, re-subscribes in April at $100/month → $100 Reactivation MRR in April.
- Account's payment failed in February (involuntary churn), payment recovered in March → $0 Reactivation (this is a grace-period recovery, not reactivation — see edge cases).

**Edge cases:**
- **Grace period:** If your billing system retries failed payments within a grace window (e.g., 14 days) and recovers, this should NOT be counted as churn + reactivation. Define your grace period explicitly: {{BI_CHURN_GRACE_PERIOD_DAYS}} days.
- **Same-month churn and reactivation:** If an account cancels and re-subscribes within the same calendar month, they should appear as neither churn nor reactivation (net zero). Only count if there was a full month gap.

**Classification rule:** Account MRR in current month > $0 AND Account MRR in previous month = $0 AND account has prior payment history.

---

### Contraction MRR

**Definition:** The decrease in MRR from existing paying customers who reduce their spend but do NOT cancel entirely. This includes downgrades, seat removals, and reduced usage.

**Examples:**
- Account downgrades from $200/month to $100/month → $100 Contraction MRR.
- Account removes 3 seats at $10/seat/month → $30 Contraction MRR.
- Usage-based account's recurring charge drops from $700 to $500 → $200 Contraction MRR.

**Edge cases:**
- If an account downgrades AND removes seats, sum all decreases into one Contraction MRR entry.
- Promotional pricing: if a promotional discount ends and the customer's rate increases, that's neither expansion nor contraction — it's a return to standard pricing. Track promotional impacts separately.
- Credit/refund: a one-time credit is not contraction. Only changes to the ongoing recurring amount count.

**Classification rule:** Account MRR in current month < Account MRR in previous month, AND current month MRR > $0.

---

### Churn MRR

**Definition:** MRR from accounts that cancel entirely and go to $0 MRR. This includes both voluntary cancellation and involuntary churn (failed payments past the grace period).

**Examples:**
- Account on $150/month cancels subscription → $150 Churn MRR.
- Account's payment fails, retries exhausted after {{BI_CHURN_GRACE_PERIOD_DAYS}} days, subscription suspended → Churn MRR at the account's last MRR amount.

**Voluntary vs Involuntary churn breakdown:**
| Type | Definition | Typical % of Total Churn |
|---|---|---|
| Voluntary | Customer explicitly cancels | 60-70% |
| Involuntary | Payment failure past grace period | 30-40% |

Involuntary churn is recoverable with better dunning processes. Track it separately.

**Classification rule:** Account MRR in current month = $0 AND Account MRR in previous month > $0 AND grace period has expired.

---

## 3. Visualization Specification

### Horizontal Waterfall Chart

**Chart type:** Horizontal waterfall (also called bridge chart).

**Layout:**
```
Beginning MRR ████████████████████████████████████  $100,000
+ New MRR      ██████                               + $8,000
+ Expansion    ████                                  + $5,000
+ Reactivation █                                     + $1,500
- Contraction  ███                        (red)      - $3,000
- Churn        █████                      (red)      - $6,000
Ending MRR    █████████████████████████████████████  $105,500
```

**Color coding:**
| Component | Color | Hex |
|---|---|---|
| Beginning / Ending MRR | Steel blue | #4682B4 |
| New MRR | Green | #2ECC71 |
| Expansion MRR | Light green | #82E0AA |
| Reactivation MRR | Teal | #1ABC9C |
| Contraction MRR | Orange | #E67E22 |
| Churn MRR | Red | #E74C3C |

**Labels:** Each bar shows the absolute dollar amount AND the percentage of beginning MRR.

**Annotations:**
- Net New MRR callout box above the chart: "Net New MRR: $5,500 (+5.5%)"
- If any component is anomalous (> 2 standard deviations from trailing 6-month average), mark it with an alert icon.

### Trend Chart (Secondary)

**Chart type:** Stacked area chart showing MRR composition over time (12 months).

**Layout:** X-axis = months, Y-axis = MRR dollars. Areas stacked: New (bottom), Expansion, Reactivation. Separate area below zero line: Contraction, Churn.

---

## 4. Drill-Down Dimensions

Every MRR movement should be attributable along the following dimensions. Configure based on {{BI_DEPARTMENT_DASHBOARDS}} requirements.

### Dimension 1: Plan Tier

| Tier | Description | Expected MRR Range |
|---|---|---|
| Free | $0 MRR (tracked for conversion analysis) | $0 |
| Starter | Entry-level paid plan | $XX - $XX |
| Professional | Mid-tier plan | $XX - $XX |
| Enterprise | High-tier plan | $XX+ |

**Analysis:** Which tiers drive the most expansion? Which have the highest churn? Is there a "dead zone" tier where customers neither expand nor churn?

### Dimension 2: Customer Segment

| Segment | Definition | Criteria |
|---|---|---|
| SMB | Small and medium business | 1-50 employees or < $XX MRR |
| Mid-Market | Medium-sized companies | 51-500 employees or $XX-$XX MRR |
| Enterprise | Large organizations | 500+ employees or > $XX MRR |

**Analysis:** Enterprise accounts typically have lower churn but longer sales cycles. SMB has higher velocity but higher churn. Segment-level waterfalls reveal which segment is driving overall trends.

### Dimension 3: Geography

Segment by regions defined in {{BI_DEPARTMENT_DASHBOARDS}} configuration.

| Region | Countries |
|---|---|
| North America | US, Canada |
| EMEA | EU, UK, Middle East, Africa |
| APAC | Australia, NZ, Japan, Southeast Asia |
| LATAM | Central and South America |

**Analysis:** Geographic waterfalls reveal market maturity. New markets should show high New MRR %. Mature markets should show expansion-dominant growth.

### Dimension 4: Acquisition Channel

| Channel | Description |
|---|---|
| Organic | Direct traffic, word of mouth |
| Paid Search | Google Ads, Bing Ads |
| Paid Social | Facebook, LinkedIn, Twitter ads |
| Content | Blog, SEO, webinars |
| Outbound | Sales-sourced |
| Partner | Channel partner referrals |
| Product-Led | In-app referral, viral loops |

**Analysis:** Which channels produce customers with the best retention and expansion? CAC by channel is one metric; MRR durability by channel is the more important metric.

---

## 5. MRR Movement Detail Table

For every MRR waterfall period, maintain a per-account attribution table. This is the audit trail.

### Table Schema

| Column | Type | Description |
|---|---|---|
| `period` | DATE | Month of the movement (first of month) |
| `account_id` | VARCHAR | Unique account identifier |
| `account_name` | VARCHAR | Display name |
| `movement_type` | ENUM | `new`, `expansion`, `reactivation`, `contraction`, `churn` |
| `previous_mrr` | DECIMAL | MRR at end of previous period |
| `current_mrr` | DECIMAL | MRR at end of current period |
| `mrr_delta` | DECIMAL | `current_mrr - previous_mrr` |
| `plan_previous` | VARCHAR | Plan name in previous period |
| `plan_current` | VARCHAR | Plan name in current period |
| `segment` | VARCHAR | Customer segment |
| `geography` | VARCHAR | Customer geography |
| `channel` | VARCHAR | Original acquisition channel |
| `change_reason` | VARCHAR | Reason for change (upgrade, downgrade, cancel, payment failure, etc.) |
| `notes` | TEXT | Optional notes from account manager |

### Example Detail Table

| Account | Type | Previous MRR | Current MRR | Delta | Reason |
|---|---|---|---|---|---|
| Acme Corp | Expansion | $500 | $800 | +$300 | Added 30 seats |
| Beta Inc | Expansion | $200 | $350 | +$150 | Upgraded to Professional |
| Gamma LLC | New | $0 | $100 | +$100 | First subscription |
| Delta Co | Contraction | $400 | $250 | -$150 | Removed 15 seats |
| Epsilon Ltd | Churn | $300 | $0 | -$300 | Switched to competitor |
| Zeta Corp | Reactivation | $0 | $200 | +$200 | Returned after 3-month gap |

---

## 6. ARR Calculation & Annualization Rules

### Basic ARR Formula

```
ARR = Ending MRR × 12
```

### Annualization Rules

| Scenario | Rule |
|---|---|
| Monthly subscribers | MRR × 12 |
| Annual subscribers | Contract annual value / 12 = MRR, then MRR × 12 = ARR |
| Quarterly subscribers | Quarterly value / 3 = MRR, then MRR × 12 = ARR |
| Multi-year contracts | Annual portion only (do not annualize the full contract) |
| Usage-based pricing | Use trailing 3-month average monthly revenue × 12 |
| One-time fees | EXCLUDE from ARR entirely |
| Professional services | EXCLUDE from ARR (not recurring) |
| Setup fees | EXCLUDE from ARR |

### ARR vs Revenue Reconciliation

ARR is a forward-looking metric. Revenue is a backward-looking (recognized) metric. They will not match.

| Reason for Difference | Explanation |
|---|---|
| Revenue recognition timing | Annual contracts: ARR recognizes immediately, revenue recognizes monthly |
| Usage variability | Usage-based revenue fluctuates; ARR uses averages |
| Free trials | Active trials have $0 ARR but may have deferred revenue |
| Credits / refunds | Reduce recognized revenue but may not affect ARR |

**Rule:** Always report both ARR (forward-looking capacity) and recognized revenue (GAAP/IFRS actual). Never conflate them.

---

## 7. Gross vs Net MRR Movements

### Gross MRR Movements

Gross movements show the total volume of change, regardless of direction.

```
Gross New MRR        = Sum of all new account MRR
Gross Expansion MRR  = Sum of all expansion amounts
Gross Contraction MRR = Sum of all contraction amounts (absolute value)
Gross Churn MRR      = Sum of all churned account MRR (absolute value)
```

**Gross MRR Churn Rate** = Gross Churn MRR / Beginning MRR
**Gross MRR Retention Rate** = 1 - Gross MRR Churn Rate

### Net MRR Movements

Net movements factor in the offsetting effects of expansion against contraction and churn.

```
Net MRR Movement = (New + Expansion + Reactivation) - (Contraction + Churn)
```

**Net MRR Retention Rate (NRR)** = (Beginning MRR - Contraction - Churn + Expansion + Reactivation) / Beginning MRR

> NOTE: NRR excludes New MRR. It measures how much revenue you'd have if you acquired zero new customers.

### Why Both Matter

| Metric | What It Tells You |
|---|---|
| Gross churn rate | How much revenue is at risk each month (the "leaky bucket") |
| Net retention rate | Whether your existing customer base is growing on its own |
| Gross expansion rate | How much upsell velocity you have |
| Net expansion | Whether expansion outpaces contraction + churn |

**Benchmark targets:**

| Metric | Good (SMB) | Good (Mid-Market) | Good (Enterprise) |
|---|---|---|---|
| Gross MRR Churn | < 3% monthly | < 2% monthly | < 1% monthly |
| Net Revenue Retention | > 100% | > 110% | > 120% |
| Logo Churn | < 5% monthly | < 3% monthly | < 1% monthly |

---

## 8. SQL Query Templates

> **Conditional on {{BI_WAREHOUSE}}:** Adjust syntax for your data warehouse platform. Templates below use ANSI SQL with notes for platform-specific variations.

### Query 1: Monthly MRR Snapshot per Account

```sql
-- Calculate current MRR per account for a given month
-- Adjust for your billing system schema

WITH monthly_mrr AS (
    SELECT
        DATE_TRUNC('month', billing_period_start)  AS period,
        account_id,
        SUM(mrr_amount)                             AS mrr
    FROM subscriptions
    WHERE status IN ('active', 'past_due')
      AND billing_period_start < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY 1, 2
)
SELECT * FROM monthly_mrr
ORDER BY period DESC, mrr DESC;
```

**Platform notes:**
- **BigQuery:** Use `DATE_TRUNC(billing_period_start, MONTH)` (argument order reversed).
- **Redshift:** Syntax as written.
- **Snowflake:** Syntax as written.
- **PostgreSQL:** Syntax as written.

---

### Query 2: MRR Waterfall Classification

```sql
-- Classify each account's MRR movement for a given month
-- Requires: monthly_mrr CTE from Query 1

WITH current_month AS (
    SELECT account_id, mrr AS current_mrr
    FROM monthly_mrr
    WHERE period = '{{REPORT_MONTH}}'  -- e.g., '2026-03-01'
),

previous_month AS (
    SELECT account_id, mrr AS previous_mrr
    FROM monthly_mrr
    WHERE period = '{{REPORT_MONTH}}'::DATE - INTERVAL '1 month'
),

-- Identify accounts with ANY prior payment history (for new vs reactivation)
prior_history AS (
    SELECT DISTINCT account_id
    FROM monthly_mrr
    WHERE period < '{{REPORT_MONTH}}'::DATE - INTERVAL '1 month'
      AND mrr > 0
),

movements AS (
    SELECT
        COALESCE(c.account_id, p.account_id)            AS account_id,
        COALESCE(p.previous_mrr, 0)                      AS previous_mrr,
        COALESCE(c.current_mrr, 0)                       AS current_mrr,
        COALESCE(c.current_mrr, 0) - COALESCE(p.previous_mrr, 0) AS mrr_delta,
        CASE
            WHEN COALESCE(p.previous_mrr, 0) = 0
                 AND COALESCE(c.current_mrr, 0) > 0
                 AND h.account_id IS NULL
                THEN 'new'
            WHEN COALESCE(p.previous_mrr, 0) = 0
                 AND COALESCE(c.current_mrr, 0) > 0
                 AND h.account_id IS NOT NULL
                THEN 'reactivation'
            WHEN COALESCE(c.current_mrr, 0) > COALESCE(p.previous_mrr, 0)
                 AND COALESCE(p.previous_mrr, 0) > 0
                THEN 'expansion'
            WHEN COALESCE(c.current_mrr, 0) < COALESCE(p.previous_mrr, 0)
                 AND COALESCE(c.current_mrr, 0) > 0
                THEN 'contraction'
            WHEN COALESCE(c.current_mrr, 0) = 0
                 AND COALESCE(p.previous_mrr, 0) > 0
                THEN 'churn'
            ELSE 'no_change'
        END AS movement_type
    FROM current_month c
    FULL OUTER JOIN previous_month p ON c.account_id = p.account_id
    LEFT JOIN prior_history h ON COALESCE(c.account_id, p.account_id) = h.account_id
)
SELECT
    movement_type,
    COUNT(*)        AS account_count,
    SUM(mrr_delta)  AS total_mrr_movement,
    SUM(current_mrr) AS total_current_mrr
FROM movements
WHERE movement_type != 'no_change'
GROUP BY movement_type
ORDER BY
    CASE movement_type
        WHEN 'new' THEN 1
        WHEN 'expansion' THEN 2
        WHEN 'reactivation' THEN 3
        WHEN 'contraction' THEN 4
        WHEN 'churn' THEN 5
    END;
```

---

### Query 3: MRR Waterfall Trend (12 Months)

```sql
-- Generate waterfall data for the past 12 months
-- Build on Query 2 pattern but iterate across months

WITH RECURSIVE months AS (
    SELECT DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months' AS period
    UNION ALL
    SELECT period + INTERVAL '1 month'
    FROM months
    WHERE period < DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
),

monthly_mrr AS (
    SELECT
        DATE_TRUNC('month', billing_period_start) AS period,
        account_id,
        SUM(mrr_amount) AS mrr
    FROM subscriptions
    WHERE status IN ('active', 'past_due')
    GROUP BY 1, 2
),

waterfall AS (
    SELECT
        m.period,
        COALESCE(SUM(CASE WHEN prev.mrr IS NULL AND curr.mrr > 0 THEN curr.mrr END), 0)
            AS new_mrr,
        COALESCE(SUM(CASE WHEN prev.mrr > 0 AND curr.mrr > prev.mrr THEN curr.mrr - prev.mrr END), 0)
            AS expansion_mrr,
        COALESCE(SUM(CASE WHEN prev.mrr > 0 AND curr.mrr < prev.mrr AND curr.mrr > 0 THEN prev.mrr - curr.mrr END), 0)
            AS contraction_mrr,
        COALESCE(SUM(CASE WHEN prev.mrr > 0 AND (curr.mrr IS NULL OR curr.mrr = 0) THEN prev.mrr END), 0)
            AS churn_mrr
    FROM months m
    LEFT JOIN monthly_mrr curr ON curr.period = m.period
    LEFT JOIN monthly_mrr prev ON prev.account_id = curr.account_id
        AND prev.period = m.period - INTERVAL '1 month'
    GROUP BY m.period
)
SELECT
    period,
    new_mrr,
    expansion_mrr,
    contraction_mrr,
    churn_mrr,
    new_mrr + expansion_mrr - contraction_mrr - churn_mrr AS net_new_mrr
FROM waterfall
ORDER BY period;
```

---

### Query 4: Per-Account Movement Detail

```sql
-- Detailed per-account movements for a specific month
-- Use this for the audit trail / movement detail table

SELECT
    m.account_id,
    a.account_name,
    a.segment,
    a.geography,
    a.acquisition_channel,
    m.movement_type,
    m.previous_mrr,
    m.current_mrr,
    m.mrr_delta,
    sub_prev.plan_name   AS plan_previous,
    sub_curr.plan_name   AS plan_current,
    CASE
        WHEN m.movement_type = 'churn' AND sub_prev.cancel_reason IS NOT NULL
            THEN sub_prev.cancel_reason
        WHEN m.movement_type = 'expansion' AND sub_curr.plan_name != sub_prev.plan_name
            THEN 'Plan upgrade'
        WHEN m.movement_type = 'expansion'
            THEN 'Seat/usage increase'
        WHEN m.movement_type = 'contraction' AND sub_curr.plan_name != sub_prev.plan_name
            THEN 'Plan downgrade'
        WHEN m.movement_type = 'contraction'
            THEN 'Seat/usage decrease'
        ELSE NULL
    END AS change_reason
FROM movements m
JOIN accounts a ON m.account_id = a.account_id
LEFT JOIN subscriptions sub_prev ON m.account_id = sub_prev.account_id
    AND sub_prev.period = '{{REPORT_MONTH}}'::DATE - INTERVAL '1 month'
LEFT JOIN subscriptions sub_curr ON m.account_id = sub_curr.account_id
    AND sub_curr.period = '{{REPORT_MONTH}}'
WHERE m.movement_type != 'no_change'
ORDER BY ABS(m.mrr_delta) DESC;
```

---

## 9. Alert Rules

### Automated Alerts

| Alert | Condition | Severity | Action |
|---|---|---|---|
| MRR Decline | Ending MRR < Beginning MRR (net negative month) | HIGH | CEO + CFO notified, investigation within 24 hours |
| MRR Decline > 5% | (Beginning - Ending) / Beginning > 5% | CRITICAL | Emergency revenue review meeting within 48 hours |
| Churn spike | Monthly churn rate > 2x trailing 6-month average | HIGH | Customer success triage, churn reason analysis |
| Contraction spike | Monthly contraction > 2x trailing 6-month average | MEDIUM | Account review, pricing/packaging analysis |
| Expansion slowdown | Expansion MRR < 50% of trailing 6-month average | MEDIUM | Upsell pipeline review, product adoption analysis |
| Single-account risk | Any single account represents > 10% of total MRR | HIGH | Concentration risk alert, diversification planning |
| Involuntary churn spike | Involuntary churn > 50% of total churn | MEDIUM | Dunning process review, payment method audit |

### Investigation Protocol for MRR Decline > 5%

1. **Pull the movement detail table** (Query 4 above) — identify the largest individual movements.
2. **Segment the decline:** Is it concentrated in one segment, geography, or plan tier?
3. **Check for systemic issues:** Payment processing failure? Billing system error? Pricing change impact?
4. **Interview churned/contracted accounts:** What reason did they give? Is there a pattern?
5. **Timeline correlation:** Did a product change, pricing change, or competitive event coincide?
6. **Document findings** in the monthly revenue review and update the risk register (see `board-deck-templates.template.md`, Slide 9).

---

## 10. Cross-References

| Reference | Location | Relationship |
|---|---|---|
| Revenue projections (forecast) | Section 25 `revenue-projection.template.md` | Forecast vs actuals comparison — this file provides actuals |
| Unit economics | `unit-economics-dashboard.template.md` (this section) | LTV and NRR calculations consume waterfall data |
| Cohort analysis | `cohort-analysis.template.md` (this section) | Revenue cohorts are built from waterfall movements |
| Board deck | `board-deck-templates.template.md` (this section) | Slide 3 (Revenue & Growth) is sourced from this waterfall |
| Billing system | Section 30 `billing-domain-model.template.md` | Raw subscription data source |
| Financial modeling | Section 25 `financial-modeling-decision-tree.md` | Waterfall trends feed into financial model assumptions |
| Investor metrics | Section 25 `investor-metrics-dashboard.template.md` | MRR/ARR metrics reported to investors |
