# Unit Economics Dashboard

> **Owner:** {{STAKEHOLDER_CFO}} / Revenue Operations
> **Refresh cadence:** Monthly (full recalculation), Weekly (leading indicators)
> **Project:** {{PROJECT_NAME}}
> **Data warehouse:** {{BI_WAREHOUSE}}

---

## Purpose

Unit economics answer the fundamental question: "Does each customer generate more value than they cost to acquire and serve?" This dashboard consolidates every unit-economic metric into a single reference, with calculation methodology, segmentation, benchmarks, and SQL templates. A business with bad unit economics is a business that loses more money the faster it grows.

---

## Table of Contents

1. [Customer Acquisition Cost (CAC)](#1-customer-acquisition-cost-cac)
2. [Lifetime Value (LTV)](#2-lifetime-value-ltv)
3. [LTV:CAC Ratio](#3-ltvcac-ratio)
4. [Net Revenue Retention (NRR)](#4-net-revenue-retention-nrr)
5. [Gross Revenue Retention (GRR)](#5-gross-revenue-retention-grr)
6. [Expansion Revenue Metrics](#6-expansion-revenue-metrics)
7. [Gross Margin](#7-gross-margin)
8. [Quick Ratio](#8-quick-ratio)
9. [Rule of 40](#9-rule-of-40)
10. [Magic Number](#10-magic-number)
11. [Burn Multiple](#11-burn-multiple)
12. [SQL Templates](#12-sql-templates)
13. [Cross-References](#13-cross-references)

---

## 1. Customer Acquisition Cost (CAC)

### Definition

CAC is the total cost to acquire one new paying customer. It includes all sales and marketing spend divided by the number of new customers acquired in the same period.

### Formulas

**Blended CAC:**
```
Blended CAC = Total Sales & Marketing Spend (period) / New Customers Acquired (period)
```

**Paid CAC (excludes organic):**
```
Paid CAC = Paid Marketing Spend / New Customers from Paid Channels
```

**Fully Loaded CAC (includes overhead):**
```
Fully Loaded CAC = (Sales & Marketing Spend + Allocated Overhead) / New Customers
```

### What to Include in S&M Spend

| Include | Exclude |
|---|---|
| Marketing salaries and benefits | Product development costs |
| Sales salaries, commissions, bonuses | Customer success / support (post-sale) |
| Advertising spend (all channels) | General & administrative overhead |
| Marketing tools and software | One-time event costs (unless recurring) |
| Content creation costs | Brand campaigns with no acquisition intent |
| Events, sponsorships, conferences | |
| Sales tools (CRM, enablement) | |
| Agency fees | |

### CAC by Channel

| Channel | Spend | New Customers | CAC | % of Total Spend | % of New Customers |
|---|---|---|---|---|---|
| Organic / Direct | ${{BI_CAC_ORGANIC_SPEND}} | — | — | — | — |
| Paid Search | $— | — | $— | — | — |
| Paid Social | $— | — | $— | — | — |
| Content / SEO | $— | — | $— | — | — |
| Outbound Sales | $— | — | $— | — | — |
| Partner / Referral | $— | — | $— | — | — |
| Product-Led (viral) | $— | — | $— | — | — |
| **Total / Blended** | **$—** | **—** | **$—** | **100%** | **100%** |

### CAC Payback Period

```
CAC Payback (months) = CAC / (ARPA × Gross Margin %)
```

| Segment | CAC | ARPA | Gross Margin | Payback Period |
|---|---|---|---|---|
| SMB | $— | $— | —% | — months |
| Mid-Market | $— | $— | —% | — months |
| Enterprise | $— | $— | —% | — months |
| **Blended** | **$—** | **$—** | **—%** | **— months** |

**Benchmark targets:**
| Stage | Acceptable Payback |
|---|---|
| Pre-Series A | < 18 months |
| Series A-B | < 12 months |
| Series C+ / Public | < 8 months |

### CAC Trend

Track monthly CAC over time. Rising CAC without proportional LTV increase is a warning sign.

| Month | Blended CAC | Paid CAC | Best Channel CAC | Worst Channel CAC |
|---|---|---|---|---|
| {{REPORT_MONTH}} - 5 | $— | $— | $— (channel) | $— (channel) |
| {{REPORT_MONTH}} - 4 | $— | $— | $— (channel) | $— (channel) |
| {{REPORT_MONTH}} - 3 | $— | $— | $— (channel) | $— (channel) |
| {{REPORT_MONTH}} - 2 | $— | $— | $— (channel) | $— (channel) |
| {{REPORT_MONTH}} - 1 | $— | $— | $— (channel) | $— (channel) |
| {{REPORT_MONTH}} | $— | $— | $— (channel) | $— (channel) |

---

## 2. Lifetime Value (LTV)

### Definition

LTV is the total revenue (or gross profit) expected from a customer over their entire relationship with the company.

### Calculation Methods

**Method 1: Formula-Based (Simple)**
```
LTV = ARPA / Monthly Churn Rate
```
*Use for quick estimates. Assumes constant churn rate and no expansion.*

**Method 2: Gross-Margin-Adjusted**
```
LTV = (ARPA × Gross Margin %) / Monthly Churn Rate
```
*More accurate — reflects actual profit, not just revenue.*

**Method 3: Cohort-Based (Recommended)**
```
LTV = Sum of actual monthly revenue per cohort member, averaged across cohort
```
*Most accurate for businesses with expansion revenue. See `cohort-analysis.template.md`.*

**Method 4: Discounted Cash Flow**
```
LTV = Sum over t=1 to T of [ (Revenue_t - Cost_t) / (1 + discount_rate)^t × Survival_probability_t ]
```
*Most rigorous. Requires survival curves and cost allocation. Use when data maturity allows.*

### LTV by Segment

| Segment | ARPA | Gross Margin | Monthly Churn | Formula LTV | Cohort LTV (12-mo) | Projected LTV (24-mo) |
|---|---|---|---|---|---|---|
| SMB | $— | —% | —% | $— | $— | $— |
| Mid-Market | $— | —% | —% | $— | $— | $— |
| Enterprise | $— | —% | —% | $— | $— | $— |

### LTV by Plan

| Plan | ARPA | Gross Margin | Monthly Churn | Formula LTV | Cohort LTV (12-mo) |
|---|---|---|---|---|---|
| Starter | $— | —% | —% | $— | $— |
| Professional | $— | —% | —% | $— | $— |
| Enterprise | $— | —% | —% | $— | $— |

---

## 3. LTV:CAC Ratio

### Formula

```
LTV:CAC = LTV / CAC
```

### Interpretation

| LTV:CAC | Interpretation | Action |
|---|---|---|
| < 1:1 | Losing money on every customer | CRITICAL: Fix unit economics or stop acquiring |
| 1:1 - 2:1 | Barely break-even | Improve retention, reduce CAC, or increase ARPU |
| 3:1 | Healthy — the standard target | Maintain; consider investing more in growth |
| 4:1 - 5:1 | Very healthy, possibly under-investing | Could spend more on acquisition to accelerate growth |
| > 5:1 | May be under-investing in growth | Analyze: are you leaving growth on the table? |

### LTV:CAC by Segment and Channel

| | SMB | Mid-Market | Enterprise |
|---|---|---|---|
| Organic | —:1 | —:1 | —:1 |
| Paid Search | —:1 | —:1 | —:1 |
| Paid Social | —:1 | —:1 | —:1 |
| Outbound Sales | —:1 | —:1 | —:1 |
| Partner | —:1 | —:1 | —:1 |

*This matrix reveals which segment+channel combinations are most efficient. Shift budget toward high-LTV:CAC cells.*

---

## 4. Net Revenue Retention (NRR)

### Definition

NRR measures the revenue retained from existing customers, including expansion. It is the single best indicator of product-market fit and revenue durability.

### Formula

```
NRR = (Beginning MRR - Contraction - Churn + Expansion) / Beginning MRR × 100%
```

> NRR excludes new customer MRR. It answers: "If we stopped acquiring customers today, would our existing revenue base grow or shrink?"

### Monthly NRR

| Month | Beginning MRR | Expansion | Contraction | Churn | Ending (existing) | NRR |
|---|---|---|---|---|---|---|
| — | $— | $— | $— | $— | $— | —% |
| — | $— | $— | $— | $— | $— | —% |
| — | $— | $— | $— | $— | $— | —% |

### Trailing 12-Month NRR

```
T12M NRR = Ending MRR from customers who were active 12 months ago / Their MRR 12 months ago × 100%
```

**Current T12M NRR:** —%

### NRR by Segment

| Segment | T12M NRR | Monthly NRR (avg) | Trend |
|---|---|---|---|
| SMB | —% | —% | — |
| Mid-Market | —% | —% | — |
| Enterprise | —% | —% | — |

### Benchmarks

| NRR | Rating | Typical Company Profile |
|---|---|---|
| < 90% | Poor | Revenue base is shrinking; churn exceeds expansion |
| 90-100% | Adequate | Expansion roughly offsets losses; common in SMB |
| 100-110% | Good | Existing customers are growing; solid product-market fit |
| 110-130% | Excellent | Strong expansion motion; typical of best-in-class SaaS |
| > 130% | Exceptional | Usage-based or platform businesses with strong network effects |

---

## 5. Gross Revenue Retention (GRR)

### Definition

GRR measures revenue retained from existing customers EXCLUDING expansion. It shows the "leaky bucket" — how much revenue you lose before any upsell efforts.

### Formula

```
GRR = (Beginning MRR - Contraction - Churn) / Beginning MRR × 100%
```

> GRR can never exceed 100%. If your GRR is > 100%, your calculation is wrong.

### Monthly GRR

| Month | Beginning MRR | Contraction | Churn | GRR |
|---|---|---|---|---|
| — | $— | $— | $— | —% |
| — | $— | $— | $— | —% |
| — | $— | $— | $— | —% |

### Trailing 12-Month GRR

**Current T12M GRR:** —%

### Benchmarks

| GRR | Rating | Implication |
|---|---|---|
| < 80% | Poor | Losing > 20% of existing revenue annually; churn is a crisis |
| 80-85% | Below average | Churn is high; product or support issues likely |
| 85-90% | Average | Acceptable for SMB SaaS; enterprise should be higher |
| 90-95% | Good | Strong retention; typical of mid-market/enterprise SaaS |
| > 95% | Excellent | Very sticky product; typical of mission-critical enterprise software |

### GRR vs NRR — Why Both Matter

- **GRR** tells you how durable your revenue base is. High GRR means low risk.
- **NRR** tells you how much growth comes from existing customers. High NRR means efficient growth.
- A company with 85% GRR and 120% NRR is healthy but reliant on expansion to mask churn.
- A company with 95% GRR and 105% NRR has a stickier product but less expansion motion.

---

## 6. Expansion Revenue Metrics

### Upgrade Rate

```
Upgrade Rate = Accounts that upgraded plan / Total accounts at start of period
```

### Seat Expansion Rate

```
Seat Expansion Rate = Net new seats added / Total seats at start of period
```

### Add-On Attach Rate

```
Attach Rate = Accounts with ≥ 1 add-on / Total paid accounts
```

### Expansion Revenue Breakdown

| Source | MRR Added | % of Total Expansion | Accounts |
|---|---|---|---|
| Plan upgrades | $— | —% | — |
| Seat additions | $— | —% | — |
| Add-on purchases | $— | —% | — |
| Usage overage | $— | —% | — |
| **Total Expansion** | **$—** | **100%** | **—** |

### Expansion Efficiency

```
Expansion Revenue per CSM = Total Expansion MRR / Number of CSMs
```

Track monthly to measure CSM productivity.

---

## 7. Gross Margin

### Formula

```
Gross Margin = (Revenue - COGS) / Revenue × 100%
```

### Cost of Goods Sold (COGS) for SaaS

| Cost Category | Include in COGS? | Examples |
|---|---|---|
| Hosting / infrastructure | Yes | AWS/GCP/Azure compute, storage, bandwidth |
| Third-party API costs | Yes | Payment processing, email delivery, AI/ML APIs |
| Customer support (direct) | Yes | Support team salaries, support tooling |
| DevOps / SRE (production) | Yes | On-call engineers, incident response |
| Professional services (delivery) | Yes | Implementation, onboarding, training delivery |
| Software licenses (production) | Yes | Monitoring, CDN, security tools for production |
| Engineering (development) | No | This is R&D, not COGS |
| Sales & Marketing | No | Below gross margin line |
| General & Administrative | No | Below gross margin line |

### Gross Margin by Segment

| Segment | Revenue | COGS | Gross Margin | Gross Margin % |
|---|---|---|---|---|
| SMB | $— | $— | $— | —% |
| Mid-Market | $— | $— | $— | —% |
| Enterprise | $— | $— | $— | —% |
| **Total** | **$—** | **$—** | **$—** | **—%** |

### Gross Margin by Product Line

| Product | Revenue | COGS | Gross Margin % |
|---|---|---|---|
| Core Platform | $— | $— | —% |
| Add-On Module A | $— | $— | —% |
| Professional Services | $— | $— | —% |
| **Total** | **$—** | **$—** | **—%** |

### Benchmarks

| Gross Margin | Rating | Typical Profile |
|---|---|---|
| < 60% | Below average | Heavy services component or high infrastructure costs |
| 60-70% | Average | Typical early-stage SaaS or usage-heavy product |
| 70-80% | Good | Standard SaaS with reasonable infrastructure efficiency |
| > 80% | Excellent | Highly efficient SaaS; target for mature companies |

---

## 8. Quick Ratio

### Formula

```
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churn MRR)
```

### Interpretation

| Quick Ratio | Interpretation |
|---|---|
| < 1.0 | Revenue is shrinking — losses exceed gains |
| 1.0-2.0 | Growing, but fragile — high churn offsets growth |
| 2.0-4.0 | Healthy growth with manageable churn |
| > 4.0 | Very efficient growth — minimal churn relative to new revenue |

### Monthly Quick Ratio Trend

| Month | New MRR | Expansion MRR | Contraction MRR | Churn MRR | Quick Ratio |
|---|---|---|---|---|---|
| — | $— | $— | $— | $— | — |
| — | $— | $— | $— | $— | — |
| — | $— | $— | $— | $— | — |
| — | $— | $— | $— | $— | — |
| — | $— | $— | $— | $— | — |
| — | $— | $— | $— | $— | — |

**Caution:** Quick Ratio can be misleading for very early-stage companies where churn is low simply because there aren't many customers yet. It becomes meaningful after ~50+ paying accounts.

---

## 9. Rule of 40

### Formula

```
Rule of 40 = Revenue Growth Rate (%) + Profit Margin (%)
```

Where:
- **Revenue Growth Rate** = YoY ARR growth percentage.
- **Profit Margin** = EBITDA margin OR free cash flow margin (specify which you use and be consistent).

### Interpretation

| Score | Interpretation |
|---|---|
| < 20 | Underperforming — neither growing fast enough nor profitable enough |
| 20-30 | Below average — needs improvement in growth or efficiency |
| 30-40 | Approaching healthy — on the right track |
| 40+ | Healthy — the standard benchmark for well-run SaaS |
| 60+ | Exceptional — rare, typically public market leaders |

### Current Calculation

| Component | Value |
|---|---|
| YoY ARR Growth Rate | —% |
| EBITDA Margin (or FCF Margin) | —% |
| **Rule of 40 Score** | **—** |

### Quarterly Trend

| Quarter | Growth Rate | Profit Margin | Rule of 40 |
|---|---|---|---|
| — | —% | —% | — |
| — | —% | —% | — |
| — | —% | —% | — |
| — | —% | —% | — |

**Strategic insight:** The Rule of 40 makes the growth-vs-profitability tradeoff explicit. A company growing at 80% with -40% margin scores 40 (healthy). A company growing at 20% with 20% margin also scores 40. The board should discuss WHERE on the growth-profitability spectrum the company should aim.

---

## 10. Magic Number

### Formula

```
Magic Number = Net New ARR (this quarter) / Sales & Marketing Spend (previous quarter)
```

*Uses previous quarter's S&M spend because there is typically a one-quarter lag between spend and revenue impact.*

### Interpretation

| Magic Number | Interpretation | Action |
|---|---|---|
| < 0.5 | Inefficient — spending too much for too little growth | Reduce S&M spend or improve conversion |
| 0.5-0.75 | Moderate — room for improvement | Optimize channels, improve sales efficiency |
| 0.75-1.0 | Efficient — S&M investment is productive | Maintain or cautiously increase spend |
| > 1.0 | Very efficient — should be investing more aggressively | Increase S&M budget; you're leaving growth on the table |

### Quarterly Calculation

| Quarter | Net New ARR | Prev Quarter S&M Spend | Magic Number |
|---|---|---|---|
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |

---

## 11. Burn Multiple

### Formula

```
Burn Multiple = Net Burn / Net New ARR
```

Where:
- **Net Burn** = Total cash outflow minus total cash inflow for the period (a positive number when burning cash).
- **Net New ARR** = New ARR + Expansion ARR - Contraction ARR - Churn ARR.

### Interpretation

| Burn Multiple | Rating | Meaning |
|---|---|---|
| < 1x | Amazing | Generating more ARR than you're burning cash |
| 1x-1.5x | Great | Very efficient growth |
| 1.5x-2x | Good | Acceptable for growth-stage companies |
| 2x-3x | Concerning | Spending too much relative to growth |
| > 3x | Bad | Burning cash without proportional growth |

### Monthly Trend

| Month | Net Burn | Net New ARR | Burn Multiple |
|---|---|---|---|
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |
| — | $— | $— | — |

**Context:** Burn Multiple is the most investor-scrutinized efficiency metric in the current funding environment. It directly measures how much cash a company must burn to generate each incremental dollar of ARR.

---

## 12. SQL Templates

### Query 1: Blended CAC Calculation

```sql
-- Monthly blended CAC
-- Requires: marketing_spend table and new_customers table

WITH monthly_spend AS (
    SELECT
        DATE_TRUNC('month', spend_date) AS period,
        SUM(amount) AS total_sm_spend
    FROM marketing_spend
    WHERE category IN ('marketing', 'sales')
    GROUP BY 1
),

monthly_new_customers AS (
    SELECT
        DATE_TRUNC('month', first_payment_date) AS period,
        COUNT(DISTINCT account_id) AS new_customers
    FROM accounts
    WHERE first_payment_date IS NOT NULL
    GROUP BY 1
)

SELECT
    s.period,
    s.total_sm_spend,
    c.new_customers,
    CASE
        WHEN c.new_customers > 0
        THEN s.total_sm_spend / c.new_customers
        ELSE NULL
    END AS blended_cac
FROM monthly_spend s
JOIN monthly_new_customers c ON s.period = c.period
ORDER BY s.period;
```

### Query 2: NRR Calculation (Trailing 12-Month)

```sql
-- Trailing 12-month Net Revenue Retention

WITH twelve_months_ago AS (
    SELECT
        account_id,
        SUM(mrr_amount) AS mrr_t12
    FROM subscriptions
    WHERE DATE_TRUNC('month', billing_period_start) =
          DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
      AND status IN ('active', 'past_due')
    GROUP BY account_id
),

current_month AS (
    SELECT
        account_id,
        SUM(mrr_amount) AS mrr_current
    FROM subscriptions
    WHERE DATE_TRUNC('month', billing_period_start) =
          DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND status IN ('active', 'past_due')
    GROUP BY account_id
)

SELECT
    SUM(t.mrr_t12) AS beginning_mrr_12mo_ago,
    SUM(COALESCE(c.mrr_current, 0)) AS current_mrr_from_same_accounts,
    SUM(COALESCE(c.mrr_current, 0))::FLOAT / SUM(t.mrr_t12) * 100 AS nrr_pct
FROM twelve_months_ago t
LEFT JOIN current_month c ON t.account_id = c.account_id;
```

### Query 3: Quick Ratio

```sql
-- Monthly Quick Ratio from MRR waterfall data

SELECT
    period,
    new_mrr,
    expansion_mrr,
    contraction_mrr,
    churn_mrr,
    CASE
        WHEN (contraction_mrr + churn_mrr) > 0
        THEN (new_mrr + expansion_mrr)::FLOAT / (contraction_mrr + churn_mrr)
        ELSE NULL
    END AS quick_ratio
FROM mrr_waterfall  -- Pre-calculated table from mrr-arr-waterfall queries
ORDER BY period;
```

### Query 4: LTV by Segment (Cohort-Based)

```sql
-- 12-month cohort LTV by customer segment

WITH first_payment AS (
    SELECT
        a.account_id,
        a.segment,
        DATE_TRUNC('month', MIN(p.payment_date)) AS first_payment_month
    FROM accounts a
    JOIN payments p ON a.account_id = p.account_id
    WHERE p.amount > 0
    GROUP BY a.account_id, a.segment
),

twelve_month_revenue AS (
    SELECT
        fp.account_id,
        fp.segment,
        fp.first_payment_month,
        SUM(p.amount) AS total_revenue_12mo
    FROM first_payment fp
    JOIN payments p ON fp.account_id = p.account_id
        AND p.payment_date >= fp.first_payment_month
        AND p.payment_date < fp.first_payment_month + INTERVAL '12 months'
    WHERE p.amount > 0
    GROUP BY fp.account_id, fp.segment, fp.first_payment_month
)

SELECT
    segment,
    COUNT(DISTINCT account_id) AS customers,
    AVG(total_revenue_12mo) AS avg_12mo_ltv,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_revenue_12mo) AS median_12mo_ltv
FROM twelve_month_revenue
WHERE first_payment_month <= CURRENT_DATE - INTERVAL '12 months'  -- Only fully matured cohorts
GROUP BY segment;
```

---

## 13. Cross-References

| Reference | Location | Relationship |
|---|---|---|
| Unit economics calculator | Section 25 `unit-economics-calculator.template.md` | Complementary — that file has the planning model, this file has the actuals dashboard |
| MRR waterfall | `mrr-arr-waterfall.template.md` (this section) | Waterfall components feed Quick Ratio, NRR, GRR |
| Cohort analysis | `cohort-analysis.template.md` (this section) | LTV cohorts provide cohort-based LTV for this dashboard |
| Board deck | `board-deck-templates.template.md` (this section) | Slide 4 (Unit Economics) is sourced from this dashboard |
| Revenue projections | Section 25 `revenue-projection.template.md` | LTV and NRR inform revenue forecast assumptions |
| Investor metrics | Section 25 `investor-metrics-dashboard.template.md` | Multiple metrics overlap — ensure consistent definitions |
| Financial modeling | Section 25 `financial-modeling-decision-tree.md` | Unit economics feed financial model parameters |
| Multi-product P&L | `multi-product-pl.template.md` (this section) | Gross margin by product feeds into this dashboard |
