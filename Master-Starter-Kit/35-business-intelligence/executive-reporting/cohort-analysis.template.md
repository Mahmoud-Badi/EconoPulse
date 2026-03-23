# Cohort Analysis Templates

> **Owner:** Product Analytics / Revenue Operations
> **Refresh cadence:** Monthly (retention and revenue cohorts), Weekly (behavioral cohorts)
> **Project:** {{PROJECT_NAME}}
> **Data warehouse:** {{BI_WAREHOUSE}}

---

## Purpose

Cohort analysis groups users by a shared characteristic (typically signup date) and tracks their behavior over time. It is the most honest way to measure retention, revenue durability, and product-market fit because it eliminates the survivorship bias that plagues aggregate metrics. This template provides four complete cohort frameworks with SQL, visualization guidance, and interpretation benchmarks.

---

## Table of Contents

1. [User Retention Cohorts](#1-user-retention-cohorts)
2. [Revenue Cohorts](#2-revenue-cohorts)
3. [Behavioral Cohorts](#3-behavioral-cohorts)
4. [LTV Cohorts](#4-ltv-cohorts)
5. [SQL Templates](#5-sql-templates)
6. [Visualization Guidance](#6-visualization-guidance)
7. [Interpretation Guide](#7-interpretation-guide)
8. [Cross-References](#8-cross-references)

---

## 1. User Retention Cohorts

### Definition

A user retention cohort groups users by their signup month and tracks whether they return (are "active") at specific intervals after signup.

### "Active" Definition

> CRITICAL: Define "active" precisely before building retention cohorts. An undefined or overly loose definition produces meaningless results.

| Activity Level | Definition | When to Use |
|---|---|---|
| Core action | User performed the primary value-delivering action (e.g., sent a message, created a document, completed a transaction) | Default — use this for primary retention |
| Login | User logged into the product | Only for products where login itself delivers value (e.g., social networks) |
| Any event | User generated any server-side event | Overly broad — avoid for primary reporting |
| Paid active | User had an active paid subscription | Use for revenue retention specifically |

**Selected definition for {{PROJECT_NAME}}:** {{BI_ACTIVE_USER_DEFINITION}}

### Retention Intervals

| Interval | Label | What It Measures |
|---|---|---|
| Day 1 | D1 | Did the user come back the day after signup? (immediate value) |
| Day 7 | D7 | Did the user form a weekly habit? |
| Day 14 | D14 | Did the habit sustain through a second week? |
| Day 30 | D30 | Monthly retention — the most commonly reported metric |
| Day 60 | D60 | Medium-term retention |
| Day 90 | D90 | Quarterly retention — strong indicator of long-term value |
| Day 180 | D180 | Semi-annual retention |
| Day 365 | D365 | Annual retention — gold standard for durability |

### Triangular Retention Matrix

The core output is a triangular matrix where each row is a signup cohort and each column is a retention interval.

| Signup Month | Cohort Size | D1 | D7 | D14 | D30 | D60 | D90 | D180 | D365 |
|---|---|---|---|---|---|---|---|---|---|
| 2026-01 | 1,200 | 45% | 32% | 28% | 22% | 18% | 15% | 12% | — |
| 2026-02 | 1,450 | 48% | 35% | 30% | 25% | 20% | 17% | — | — |
| 2026-03 | 1,100 | 50% | 38% | 33% | 27% | — | — | — | — |
| 2026-04 | 1,600 | 52% | 40% | — | — | — | — | — | — |
| 2026-05 | 1,300 | 55% | — | — | — | — | — | — | — |

*Values are illustrative. Replace with actuals.*

**Reading the matrix:**
- **Down a column:** Shows whether retention is improving over time (newer cohorts should retain better if the product is improving).
- **Across a row:** Shows the retention curve shape for a single cohort (how quickly it flattens).
- **Diagonal:** Not typically meaningful — each cell is a different cohort at a different age.

### Unbounded vs Bounded Retention

| Type | Definition | When to Use |
|---|---|---|
| Unbounded (N-day) | User was active on day N OR any day after day N | Smoother curves, good for reporting |
| Bounded (exact day) | User was active specifically on day N | More precise, good for product analysis |
| Bracket | User was active during the bracket period (e.g., week 2 = days 8-14) | Best for weekly/monthly products |

**Recommendation:** Use **bracket retention** for weekly products, **unbounded retention** for daily-use products, and always document which method you use.

---

## 2. Revenue Cohorts

### Definition

Revenue cohorts group customers by their first payment month and track their MRR contribution over time. This shows whether customers are expanding, contracting, or churning their revenue.

### Revenue Retention Matrix

| Signup Month | Starting MRR | Month 1 | Month 3 | Month 6 | Month 9 | Month 12 |
|---|---|---|---|---|---|---|
| 2025-07 | $45,000 | 100% | 95% | 110% | 108% | 115% |
| 2025-10 | $52,000 | 100% | 92% | 105% | 102% | — |
| 2026-01 | $60,000 | 100% | 88% | 98% | — | — |
| 2026-04 | $48,000 | 100% | 90% | — | — | — |

*Values > 100% indicate net expansion (expansion revenue exceeds contraction + churn).*

### Revenue Cohort Components

For each cohort at each time period, decompose into:

| Component | Definition |
|---|---|
| Retained MRR | MRR from accounts still paying at the same or lower level |
| Expanded MRR | Additional MRR from accounts that increased spend |
| Contracted MRR | Lost MRR from accounts that decreased spend (but didn't churn) |
| Churned MRR | MRR from accounts that fully cancelled |
| Net Revenue Retention | (Retained + Expanded - Contracted) / Starting MRR |

### Stacked Revenue Cohort Table

| Signup Month | Period | Retained | Expanded | Contracted | Churned | Net Retention |
|---|---|---|---|---|---|---|
| 2026-01 | Month 0 | $60,000 | $0 | $0 | $0 | 100% |
| 2026-01 | Month 1 | $55,000 | $2,000 | $1,500 | $5,000 | 92.5% |
| 2026-01 | Month 2 | $52,000 | $4,500 | $2,000 | $3,000 | 90.8% |
| 2026-01 | Month 3 | $50,000 | $8,000 | $2,500 | $2,500 | 92.5% |

*Shows how expansion can recover initial churn losses over time.*

---

## 3. Behavioral Cohorts

### Definition

Behavioral cohorts group users by the actions they took (or didn't take) during a defined window — typically their first 7 or 14 days — and track how those behaviors correlate with long-term retention and revenue.

### Activation Milestone Tracking

Define the key activation milestones for {{PROJECT_NAME}}:

| Milestone | Definition | Target Completion Rate | Target Time-to-Complete |
|---|---|---|---|
| Milestone 1: Account Setup | User completes profile and initial configuration | > 80% within D1 | < 10 minutes |
| Milestone 2: Core Action | User performs the primary value action for the first time | > 60% within D3 | < 30 minutes from setup |
| Milestone 3: Integration | User connects at least one integration or data source | > 40% within D7 | < 1 hour |
| Milestone 4: Collaboration | User invites at least one team member | > 30% within D14 | — |
| Milestone 5: Habit | User performs core action on 3+ separate days within D14 | > 25% within D14 | — |

### Behavioral Cohort Matrix

Group users by which milestones they completed in their first 14 days, then track D30/D90 retention:

| Behavioral Cohort | Users | D30 Retention | D90 Retention | Conversion to Paid | Avg MRR |
|---|---|---|---|---|---|
| Completed all 5 milestones | 450 | 78% | 62% | 45% | $120 |
| Completed 3-4 milestones | 800 | 55% | 38% | 28% | $85 |
| Completed 1-2 milestones | 1,200 | 30% | 15% | 8% | $50 |
| Completed 0 milestones | 600 | 8% | 2% | 1% | $30 |

**Insight pattern:** This analysis reveals which activation milestones are most correlated with retention. Use this to prioritize onboarding investments.

### Feature Adoption by Signup Week

Track which features new users adopt during their first 4 weeks:

| Feature | Week 1 | Week 2 | Week 3 | Week 4 | Correlation with D90 Retention |
|---|---|---|---|---|---|
| Feature A (core) | 72% | 8% | 3% | 2% | 0.65 |
| Feature B (collaboration) | 15% | 25% | 12% | 8% | 0.78 |
| Feature C (advanced) | 3% | 8% | 12% | 15% | 0.82 |
| Feature D (integration) | 8% | 18% | 10% | 5% | 0.71 |

**Reading this table:**
- Features adopted early (Week 1) with high correlation to retention are **core value drivers** — optimize onboarding to ensure everyone reaches them.
- Features adopted later with high correlation are **depth features** — nurture campaigns should guide users to discover them.
- Features with low correlation to retention may be nice-to-haves or may need better implementation.

---

## 4. LTV Cohorts

### Definition

LTV cohorts track cumulative revenue generated by each quarterly signup cohort, comparing projected LTV (from models) to actual LTV (observed revenue). This is the definitive test of whether your LTV models are accurate.

### Cumulative LTV Curves

| Signup Quarter | Accounts | Month 3 LTV | Month 6 LTV | Month 9 LTV | Month 12 LTV | Month 18 LTV | Month 24 LTV |
|---|---|---|---|---|---|---|---|
| Q1 2025 | 320 | $180 | $420 | $650 | $880 | $1,250 | $1,550 |
| Q2 2025 | 380 | $195 | $460 | $710 | $950 | $1,320 | — |
| Q3 2025 | 410 | $210 | $500 | $770 | $1,020 | — | — |
| Q4 2025 | 450 | $225 | $540 | $820 | — | — | — |
| Q1 2026 | 500 | $240 | $580 | — | — | — | — |

### Projected vs Actual LTV Comparison

For each cohort, compare the model's LTV projection (made at signup time) with the actual observed LTV:

| Signup Quarter | Projected 12-Month LTV | Actual 12-Month LTV | Variance | Variance % |
|---|---|---|---|---|
| Q1 2025 | $900 | $880 | -$20 | -2.2% |
| Q2 2025 | $950 | $950 | $0 | 0.0% |
| Q3 2025 | $1,000 | $1,020 | +$20 | +2.0% |

**Model accuracy target:** Projections should be within +/- 15% of actuals by the 12-month mark. If variance is consistently > 15%, recalibrate the LTV model.

### LTV by Segment

| Segment | Avg 12-Month LTV | Avg CAC | LTV:CAC | Payback (months) |
|---|---|---|---|---|
| SMB | $600 | $150 | 4.0:1 | 3.0 |
| Mid-Market | $2,400 | $800 | 3.0:1 | 4.0 |
| Enterprise | $18,000 | $5,000 | 3.6:1 | 3.3 |

### LTV Calculation Methods

| Method | Formula | Best For |
|---|---|---|
| Historical (simple) | Average revenue per customer over their lifetime | Mature businesses with long history |
| Predictive (cohort) | Curve-fit to observed cohort LTV data, project forward | Growing businesses with 12+ months of cohort data |
| Formula-based | ARPU / Monthly Churn Rate × Gross Margin | Quick estimates, directional planning |
| Probabilistic | Discounted sum of expected future payments, weighted by survival probability | Most accurate, requires data science |

**Recommended approach for {{PROJECT_NAME}}:** Use cohort-based LTV as the primary method. Validate with formula-based LTV as a sanity check. Only move to probabilistic once you have 24+ months of cohort data.

---

## 5. SQL Templates

> **Conditional on {{BI_WAREHOUSE}}:** Templates use ANSI SQL. See platform notes after each query.

### Query 1: User Retention Cohort Matrix

```sql
-- User retention cohort matrix
-- Produces a row per signup cohort with retention at each interval

WITH signups AS (
    SELECT
        user_id,
        DATE_TRUNC('month', created_at) AS signup_month
    FROM users
    WHERE created_at >= '{{COHORT_START_DATE}}'
),

activity AS (
    SELECT
        user_id,
        DATE(event_timestamp) AS activity_date
    FROM events
    WHERE event_name = '{{BI_CORE_ACTION_EVENT}}'  -- Your defined "active" event
),

cohort_activity AS (
    SELECT
        s.signup_month,
        s.user_id,
        DATEDIFF('day', s.signup_month, a.activity_date) AS days_since_signup
    FROM signups s
    JOIN activity a ON s.user_id = a.user_id
)

SELECT
    signup_month,
    COUNT(DISTINCT user_id) AS cohort_size,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 1 AND 1 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d1_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 5 AND 9 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d7_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 12 AND 16 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d14_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 28 AND 32 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d30_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 58 AND 62 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d60_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 88 AND 92 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d90_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 178 AND 182 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d180_retention,
    COUNT(DISTINCT CASE WHEN days_since_signup BETWEEN 363 AND 367 THEN user_id END)::FLOAT
        / COUNT(DISTINCT user_id) AS d365_retention
FROM cohort_activity
GROUP BY signup_month
ORDER BY signup_month;
```

**Notes:**
- Uses bracket retention (e.g., D7 = days 5-9) to smooth daily variance.
- BigQuery: Replace `DATEDIFF('day', ...)` with `DATE_DIFF(activity_date, signup_month, DAY)`.
- BigQuery: Replace `::FLOAT` with `/ COUNT(DISTINCT user_id)` (implicit division).

---

### Query 2: Revenue Cohort Matrix

```sql
-- Revenue retention by signup month
-- Shows MRR retention % relative to first-month MRR

WITH first_payment AS (
    SELECT
        account_id,
        DATE_TRUNC('month', MIN(payment_date)) AS signup_month
    FROM payments
    WHERE amount > 0
    GROUP BY account_id
),

monthly_revenue AS (
    SELECT
        account_id,
        DATE_TRUNC('month', payment_date) AS revenue_month,
        SUM(mrr_amount) AS mrr
    FROM subscriptions
    WHERE status IN ('active', 'past_due')
    GROUP BY 1, 2
),

cohort_revenue AS (
    SELECT
        fp.signup_month,
        mr.revenue_month,
        DATEDIFF('month', fp.signup_month, mr.revenue_month) AS months_since_signup,
        mr.account_id,
        mr.mrr
    FROM first_payment fp
    JOIN monthly_revenue mr ON fp.account_id = mr.account_id
),

starting_mrr AS (
    SELECT
        signup_month,
        SUM(mrr) AS starting_mrr
    FROM cohort_revenue
    WHERE months_since_signup = 0
    GROUP BY signup_month
)

SELECT
    cr.signup_month,
    sm.starting_mrr,
    cr.months_since_signup,
    SUM(cr.mrr) AS cohort_mrr,
    SUM(cr.mrr)::FLOAT / sm.starting_mrr AS revenue_retention_pct
FROM cohort_revenue cr
JOIN starting_mrr sm ON cr.signup_month = sm.signup_month
GROUP BY cr.signup_month, sm.starting_mrr, cr.months_since_signup
ORDER BY cr.signup_month, cr.months_since_signup;
```

---

### Query 3: Behavioral Cohort — Activation Milestone Correlation

```sql
-- Correlate activation milestones with D30 retention

WITH signups AS (
    SELECT user_id, created_at AS signup_date
    FROM users
    WHERE created_at >= '{{COHORT_START_DATE}}'
),

milestones AS (
    SELECT
        s.user_id,
        -- Milestone 1: Account setup within D1
        MAX(CASE WHEN e.event_name = 'profile_completed'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) <= 1
            THEN 1 ELSE 0 END) AS m1_setup,
        -- Milestone 2: Core action within D3
        MAX(CASE WHEN e.event_name = '{{BI_CORE_ACTION_EVENT}}'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) <= 3
            THEN 1 ELSE 0 END) AS m2_core_action,
        -- Milestone 3: Integration within D7
        MAX(CASE WHEN e.event_name = 'integration_connected'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) <= 7
            THEN 1 ELSE 0 END) AS m3_integration,
        -- Milestone 4: Collaboration within D14
        MAX(CASE WHEN e.event_name = 'team_member_invited'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) <= 14
            THEN 1 ELSE 0 END) AS m4_collaboration,
        -- Total milestones completed
        (m1_setup + m2_core_action + m3_integration + m4_collaboration) AS milestones_completed
    FROM signups s
    LEFT JOIN events e ON s.user_id = e.user_id
    GROUP BY s.user_id
),

retention AS (
    SELECT
        s.user_id,
        MAX(CASE WHEN e.event_name = '{{BI_CORE_ACTION_EVENT}}'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) BETWEEN 28 AND 32
            THEN 1 ELSE 0 END) AS retained_d30,
        MAX(CASE WHEN e.event_name = '{{BI_CORE_ACTION_EVENT}}'
            AND DATEDIFF('day', s.signup_date, e.event_timestamp) BETWEEN 88 AND 92
            THEN 1 ELSE 0 END) AS retained_d90
    FROM signups s
    LEFT JOIN events e ON s.user_id = e.user_id
    GROUP BY s.user_id
)

SELECT
    CASE
        WHEN m.milestones_completed >= 4 THEN '4+ milestones'
        WHEN m.milestones_completed = 3 THEN '3 milestones'
        WHEN m.milestones_completed BETWEEN 1 AND 2 THEN '1-2 milestones'
        ELSE '0 milestones'
    END AS behavioral_cohort,
    COUNT(*) AS users,
    AVG(r.retained_d30)::FLOAT AS d30_retention,
    AVG(r.retained_d90)::FLOAT AS d90_retention
FROM milestones m
JOIN retention r ON m.user_id = r.user_id
GROUP BY 1
ORDER BY d30_retention DESC;
```

---

### Query 4: Cumulative LTV by Signup Quarter

```sql
-- Cumulative LTV per signup quarter at various time horizons

WITH first_payment AS (
    SELECT
        account_id,
        DATE_TRUNC('quarter', MIN(payment_date)) AS signup_quarter
    FROM payments
    WHERE amount > 0
    GROUP BY account_id
),

cumulative_revenue AS (
    SELECT
        fp.account_id,
        fp.signup_quarter,
        SUM(p.amount) AS total_revenue,
        DATEDIFF('month', fp.signup_quarter, DATE_TRUNC('month', p.payment_date)) AS months_since_signup
    FROM first_payment fp
    JOIN payments p ON fp.account_id = p.account_id AND p.amount > 0
    GROUP BY fp.account_id, fp.signup_quarter,
        DATEDIFF('month', fp.signup_quarter, DATE_TRUNC('month', p.payment_date))
)

SELECT
    signup_quarter,
    COUNT(DISTINCT account_id) AS accounts,
    SUM(CASE WHEN months_since_signup <= 3 THEN total_revenue ELSE 0 END)
        / COUNT(DISTINCT account_id) AS avg_ltv_3mo,
    SUM(CASE WHEN months_since_signup <= 6 THEN total_revenue ELSE 0 END)
        / COUNT(DISTINCT account_id) AS avg_ltv_6mo,
    SUM(CASE WHEN months_since_signup <= 12 THEN total_revenue ELSE 0 END)
        / COUNT(DISTINCT account_id) AS avg_ltv_12mo,
    SUM(CASE WHEN months_since_signup <= 18 THEN total_revenue ELSE 0 END)
        / COUNT(DISTINCT account_id) AS avg_ltv_18mo,
    SUM(CASE WHEN months_since_signup <= 24 THEN total_revenue ELSE 0 END)
        / COUNT(DISTINCT account_id) AS avg_ltv_24mo
FROM cumulative_revenue
GROUP BY signup_quarter
ORDER BY signup_quarter;
```

---

## 6. Visualization Guidance

### Retention Cohort Heat Map

**Chart type:** Heat map (matrix with color-coded cells).

**Layout:**
- Rows: Signup months (newest at bottom).
- Columns: Retention intervals (D1, D7, D14, D30, D60, D90, D180, D365).
- Cell value: Retention percentage.
- Cell color: Green (high retention) → Yellow (medium) → Red (low).

**Color scale:**
| Retention % | Color | Hex |
|---|---|---|
| > 50% | Dark green | #27AE60 |
| 30-50% | Light green | #82E0AA |
| 20-30% | Yellow | #F4D03F |
| 10-20% | Orange | #E67E22 |
| < 10% | Red | #E74C3C |

**Annotations:**
- Highlight cells that improved vs the previous cohort with an upward arrow.
- Highlight cells that degraded vs the previous cohort with a downward arrow.
- Add a row at the bottom showing the all-time average for each interval as a benchmark.

### LTV Curve Chart

**Chart type:** Multi-line chart.

**Layout:**
- X-axis: Months since signup (0-24).
- Y-axis: Cumulative LTV (dollars).
- One line per quarterly cohort, color-coded.
- Dashed line: Projected LTV (from model) for the most recent cohort.
- Solid lines: Actual observed LTV.

**Annotations:**
- Vertical dashed line at the CAC amount — the point where a line crosses this is the payback period.
- Horizontal dashed line at the target 12-month LTV.
- Confidence band (shaded area) around the projected line showing +/- 15% variance.

### Revenue Cohort Stacked Bar

**Chart type:** Stacked bar chart.

**Layout:**
- X-axis: Months since signup.
- Y-axis: MRR dollars.
- Stacked components: Retained (blue), Expanded (green), Contracted (orange, negative), Churned (red, negative).
- One chart per cohort, or a faceted grid showing 4-6 cohorts side by side.

---

## 7. Interpretation Guide

### What Good Looks Like

| Metric | Consumer SaaS | SMB SaaS | Enterprise SaaS |
|---|---|---|---|
| D1 Retention | 40-60% | 50-70% | 70-90% |
| D7 Retention | 25-40% | 35-50% | 55-75% |
| D30 Retention | 15-25% | 25-40% | 45-65% |
| D90 Retention | 10-20% | 20-35% | 40-60% |
| D365 Retention | 5-15% | 15-25% | 35-55% |
| 12-Month Revenue Retention | 60-80% | 80-100% | 100-130% |
| LTV:CAC | > 3:1 | > 3:1 | > 3:1 |
| CAC Payback | < 12 months | < 18 months | < 24 months |

### Red Flags

| Signal | What It Means | Investigation Steps |
|---|---|---|
| Retention curves not flattening | Product hasn't found its core retained audience | Segment by activation milestones — which users are retained? |
| D1 retention declining across cohorts | Onboarding is degrading or acquisition quality is dropping | Check channel mix — are you acquiring from lower-quality channels? |
| Revenue retention < 100% and declining | Expansion is not keeping up with contraction + churn | Analyze expansion drivers — are upgrade paths clear? |
| Newer cohorts have worse LTV curves | Product or market is degrading | Segment by channel, plan, and feature usage |
| Large variance between projected and actual LTV | LTV model is unreliable | Recalibrate model with latest cohort data |
| Behavioral cohorts show no differentiation | Milestones are not meaningful or not well-defined | Redesign milestones based on correlation analysis |

### Healthy Cohort Patterns

1. **Retention curves flatten.** After initial drop-off, a stable base remains. The flattening point is your "retained core."
2. **Newer cohorts retain better.** Product improvements should show up as improving cohort retention.
3. **Revenue cohorts exceed 100%.** Expansion from existing customers outpaces contraction + churn.
4. **LTV curves are convex.** Cumulative LTV accelerates over time (expansion-driven), not decelerates (churn-driven).
5. **Behavioral cohorts show clear separation.** Users who complete activation milestones retain at 3-5x the rate of those who don't.

---

## 8. Cross-References

| Reference | Location | Relationship |
|---|---|---|
| Retention curves | Section 20 retention analytics | Raw retention data feeds into cohort matrices here |
| Activation funnel | Section 20 `post-launch-metrics-dashboard.template.md` | Activation milestones define behavioral cohorts |
| MRR waterfall | `mrr-arr-waterfall.template.md` (this section) | Revenue cohort movements align with waterfall categories |
| Unit economics | `unit-economics-dashboard.template.md` (this section) | LTV cohorts feed LTV calculations in unit economics |
| Board deck | `board-deck-templates.template.md` (this section) | Slide 2 (Product Metrics) and Slide 6 (Customer Health) pull from retention cohorts |
| Revenue projections | Section 25 `revenue-projection.template.md` | Cohort LTV curves inform revenue forecasting models |
