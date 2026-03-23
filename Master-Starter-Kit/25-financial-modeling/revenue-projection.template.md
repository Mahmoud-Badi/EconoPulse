# Revenue Projection Model — {{PROJECT_NAME}}

> A comprehensive MRR/ARR projection that models revenue growth under multiple scenarios, accounting for new customer acquisition, expansion, contraction, and churn. This is the central revenue forecast that feeds into every other financial model in this section.

---

## Growth Assumption Framework

Before projecting revenue, define the assumptions that drive the model. Every number in the projection tables below flows from these inputs.

### Core Assumptions

| Assumption | Value | Source | Confidence |
|------------|-------|--------|------------|
| Monthly user growth rate | {{MONTHLY_GROWTH_RATE}}% | Market analysis / historical data | Low / Medium / High |
| Average Revenue Per User (ARPU) | ${{AVERAGE_REVENUE_PER_USER}}/mo | Pricing strategy (Section 19) | |
| Monthly churn rate | {{MONTHLY_CHURN_RATE}}% | Industry benchmark / historical | |
| Free-to-paid conversion rate | {{CONVERSION_RATE}}% | Funnel modeling | |
| Expansion revenue rate | ___% of existing MRR/mo | Upsell/cross-sell estimates | |
| Contraction rate | ___% of existing MRR/mo | Downgrade estimates | |
| Starting customer count | ___ | Current state | |
| Starting MRR | $___ | Current state | |

### Growth Rate Justification

Do not pick growth rates out of thin air. Document why you believe your assumed rate is achievable:

| Growth Rate Basis | Evidence |
|-------------------|----------|
| Comparable company growth at similar stage | ___ |
| Current month-over-month trend (if post-launch) | ___ |
| Channel capacity analysis (how many leads can you generate) | ___ |
| Sales capacity (if applicable) | ___ |
| Viral coefficient (if applicable) | ___ |

---

## Revenue Waterfall Model

Revenue does not grow in a straight line. Every month, four forces act on your MRR:

```
Net New MRR = New MRR + Expansion MRR - Contraction MRR - Churned MRR
```

| Component | Definition | Formula |
|-----------|-----------|---------|
| **New MRR** | Revenue from first-time paying customers | New customers x ARPU |
| **Expansion MRR** | Revenue increase from existing customers (upgrades, add-ons, seats) | Existing MRR x expansion rate |
| **Contraction MRR** | Revenue decrease from existing customers (downgrades) | Existing MRR x contraction rate |
| **Churned MRR** | Revenue lost from customers who cancelled | Existing MRR x churn rate |
| **Net New MRR** | Total change in MRR this month | Sum of above |

---

## 12-Month Revenue Projection — Base Case

**Assumptions for Base Case:**
- Monthly customer growth: {{MONTHLY_GROWTH_RATE}}%
- ARPU: ${{AVERAGE_REVENUE_PER_USER}}
- Monthly churn: {{MONTHLY_CHURN_RATE}}%
- Expansion rate: ___% of existing MRR
- Contraction rate: ___% of existing MRR

| Month | New Customers | Total Customers | Churned Customers | Net Customers | ARPU | MRR | MRR Growth % | Net New MRR |
|-------|--------------|----------------|------------------|---------------|------|-----|-------------|-------------|
| 1 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | — | $___ |
| 2 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 3 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 4 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 5 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 6 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 7 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 8 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 9 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 10 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 11 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| 12 | ___ | ___ | ___ | ___ | ${{AVERAGE_REVENUE_PER_USER}} | $___ | ___% | $___ |
| **Year 1 Total** | | | | | | **ARR: $___** | | |

### MRR Waterfall Detail (Monthly)

| Month | Starting MRR | + New MRR | + Expansion MRR | - Contraction MRR | - Churned MRR | = Ending MRR |
|-------|-------------|-----------|----------------|-------------------|--------------|-------------|
| 1 | $___ | $___ | $___ | $___ | $___ | $___ |
| 2 | $___ | $___ | $___ | $___ | $___ | $___ |
| 3 | $___ | $___ | $___ | $___ | $___ | $___ |
| 4 | $___ | $___ | $___ | $___ | $___ | $___ |
| 5 | $___ | $___ | $___ | $___ | $___ | $___ |
| 6 | $___ | $___ | $___ | $___ | $___ | $___ |
| 7 | $___ | $___ | $___ | $___ | $___ | $___ |
| 8 | $___ | $___ | $___ | $___ | $___ | $___ |
| 9 | $___ | $___ | $___ | $___ | $___ | $___ |
| 10 | $___ | $___ | $___ | $___ | $___ | $___ |
| 11 | $___ | $___ | $___ | $___ | $___ | $___ |
| 12 | $___ | $___ | $___ | $___ | $___ | $___ |

---

## 24-Month Revenue Projection Extension

| Month | Net Customers | MRR | ARR (MRR x 12) | MRR Growth % | Cumulative Revenue |
|-------|--------------|-----|-----------------|-------------|-------------------|
| 13 | ___ | $___ | $___ | ___% | $___ |
| 14 | ___ | $___ | $___ | ___% | $___ |
| 15 | ___ | $___ | $___ | ___% | $___ |
| 16 | ___ | $___ | $___ | ___% | $___ |
| 17 | ___ | $___ | $___ | ___% | $___ |
| 18 | ___ | $___ | $___ | ___% | $___ |
| 19 | ___ | $___ | $___ | ___% | $___ |
| 20 | ___ | $___ | $___ | ___% | $___ |
| 21 | ___ | $___ | $___ | ___% | $___ |
| 22 | ___ | $___ | $___ | ___% | $___ |
| 23 | ___ | $___ | $___ | ___% | $___ |
| 24 | ___ | $___ | $___ | ___% | $___ |
| **Year 2 Total** | | | **ARR: $___** | | **$___** |

---

## Scenario Modeling

Never present a single projection. Model three scenarios to bracket the range of outcomes.

### Conservative Scenario Assumptions

| Assumption | Conservative Value | Rationale |
|------------|--------------------|-----------|
| Monthly customer growth | 5% | Organic-only, no paid acquisition |
| Monthly churn rate | 5% | Higher churn — product-market fit still being refined |
| ARPU | $29 | Lower tier dominates early adoption |
| Expansion rate | 0% | No upsell motion yet |
| Conversion rate (free to paid) | 2% | Below-average conversion |

**Conservative 12-Month Summary:**

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| Customers | ___ | ___ | ___ |
| MRR | $___ | $___ | $___ |
| ARR | $___ | $___ | $___ |
| Cumulative Revenue | $___ | $___ | $___ |

### Base Scenario Assumptions

| Assumption | Base Value | Rationale |
|------------|-----------|-----------|
| Monthly customer growth | {{MONTHLY_GROWTH_RATE}}% | Blended organic + paid acquisition |
| Monthly churn rate | {{MONTHLY_CHURN_RATE}}% | Industry-average retention |
| ARPU | ${{AVERAGE_REVENUE_PER_USER}} | Pricing strategy mid-tier |
| Expansion rate | 2% of MRR/mo | Moderate upsell from feature adoption |
| Conversion rate (free to paid) | {{CONVERSION_RATE}}% | Target conversion rate |

**Base 12-Month Summary:**

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| Customers | ___ | ___ | ___ |
| MRR | $___ | $___ | $___ |
| ARR | $___ | $___ | $___ |
| Cumulative Revenue | $___ | $___ | $___ |

### Optimistic Scenario Assumptions

| Assumption | Optimistic Value | Rationale |
|------------|-----------------|-----------|
| Monthly customer growth | 20% | Strong product-market fit + paid channels firing |
| Monthly churn rate | 1% | Exceptional retention, sticky product |
| ARPU | $79 | Higher tier adoption, enterprise customers |
| Expansion rate | 5% of MRR/mo | Active upsell + seat expansion |
| Conversion rate (free to paid) | 10% | Strong activation and conversion flow |

**Optimistic 12-Month Summary:**

| Metric | Month 6 | Month 12 | Month 24 |
|--------|---------|----------|----------|
| Customers | ___ | ___ | ___ |
| MRR | $___ | $___ | $___ |
| ARR | $___ | $___ | $___ |
| Cumulative Revenue | $___ | $___ | $___ |

### Scenario Comparison at Key Milestones

| Milestone | Conservative | Base | Optimistic |
|-----------|-------------|------|-----------|
| Time to $1K MRR | ___ months | ___ months | ___ months |
| Time to $10K MRR | ___ months | ___ months | ___ months |
| Time to $50K MRR | ___ months | ___ months | ___ months |
| Time to $100K MRR | ___ months | ___ months | ___ months |
| 12-month ARR | $___ | $___ | $___ |
| 24-month ARR | $___ | $___ | $___ |
| Total customers at month 12 | ___ | ___ | ___ |
| Total customers at month 24 | ___ | ___ | ___ |

---

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->

## Subscription Model: MRR/ARR Focus

### Revenue by Tier

| Tier | Monthly Price | Expected Customer Mix | Customers (Mo 12) | MRR Contribution |
|------|-------------|----------------------|-------------------|-----------------|
| Free | $0 | ___% | ___ | $0 |
| Starter | $___ | ___% | ___ | $___ |
| Pro | $___ | ___% | ___ | $___ |
| Enterprise | $___ | ___% | ___ | $___ |
| **Total** | | **100%** | **___** | **$___** |

### Blended ARPU Calculation

```
Blended ARPU = (Starter% x Starter Price) + (Pro% x Pro Price) + (Enterprise% x Enterprise Price)
Blended ARPU = (___% x $___) + (___% x $___) + (___% x $___) = $___
```

### Annual vs Monthly Billing Mix

| Billing Cycle | % of Customers | Discount | Effective Monthly Rate | Impact on Cash Flow |
|--------------|---------------|----------|----------------------|-------------------|
| Monthly | ___% | 0% | $___ | Standard |
| Annual | ___% | ___% | $___ | +$___ upfront per customer |

### Net Revenue Retention Projection

| Quarter | Starting MRR | + Expansion | - Contraction | - Churn | Ending MRR | NRR |
|---------|-------------|------------|--------------|---------|-----------|-----|
| Q1 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q2 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q3 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q4 | $___ | $___ | $___ | $___ | $___ | ___% |

<!-- ENDIF -->

<!-- IF {{MONETIZATION_MODEL}} == "usage-based" -->

## Usage-Based Model: Consumption Projection

### Usage Tier Pricing

| Usage Tier | Price per Unit | Expected Avg Usage/Customer | Revenue per Customer |
|-----------|---------------|---------------------------|---------------------|
| 0-1,000 units | $___ | ___ | $___ |
| 1,001-10,000 units | $___ | ___ | $___ |
| 10,001-100,000 units | $___ | ___ | $___ |
| 100,000+ units | $___ | ___ | $___ |

### Usage Growth Curve

Most usage-based products see an S-curve: slow initial adoption, rapid growth as customers integrate deeper, then stabilization.

| Month After Signup | Avg Usage (% of Mature) | Avg Revenue/Customer |
|-------------------|------------------------|---------------------|
| 1 | 10% | $___ |
| 2 | 20% | $___ |
| 3 | 35% | $___ |
| 6 | 60% | $___ |
| 9 | 80% | $___ |
| 12 | 95% | $___ |
| 12+ (mature) | 100% | $___ |

### Consumption Revenue Projection

| Month | Total Customers | Avg Usage/Customer | Total Units | Revenue per Unit | Total Revenue |
|-------|----------------|-------------------|-------------|-----------------|--------------|
| 1 | ___ | ___ | ___ | $___ | $___ |
| 3 | ___ | ___ | ___ | $___ | $___ |
| 6 | ___ | ___ | ___ | $___ | $___ |
| 9 | ___ | ___ | ___ | $___ | $___ |
| 12 | ___ | ___ | ___ | $___ | $___ |

### Revenue Predictability

Usage-based models have inherent revenue variability. Model the coefficient of variation:

| Metric | Value |
|--------|-------|
| Average monthly revenue per customer | $___ |
| Standard deviation | $___ |
| Coefficient of variation | ___% |
| Minimum committed usage (if any) | $___ |
| % of revenue from committed minimums | ___% |

<!-- ENDIF -->

<!-- IF {{MONETIZATION_MODEL}} == "marketplace" -->

## Marketplace Model: GMV & Take-Rate Projection

### Key Marketplace Metrics

| Metric | Definition | Value |
|--------|-----------|-------|
| **GMV** | Total value of transactions on the platform | $___ |
| **Take Rate** | % of GMV captured as revenue | ___% |
| **Net Revenue** | GMV x Take Rate | $___ |
| **Average Order Value (AOV)** | Average transaction size | $___ |
| **Transactions per Buyer/Month** | Purchase frequency | ___ |
| **Transactions per Seller/Month** | Sell frequency | ___ |

### Two-Sided Growth Model

| Month | Sellers | Buyers | Buyer:Seller Ratio | Transactions | AOV | GMV | Take Rate | Net Revenue |
|-------|---------|--------|-------------------|-------------|-----|-----|-----------|-------------|
| 1 | ___ | ___ | ___:1 | ___ | $___ | $___ | ___% | $___ |
| 3 | ___ | ___ | ___:1 | ___ | $___ | $___ | ___% | $___ |
| 6 | ___ | ___ | ___:1 | ___ | $___ | $___ | ___% | $___ |
| 9 | ___ | ___ | ___:1 | ___ | $___ | $___ | ___% | $___ |
| 12 | ___ | ___ | ___:1 | ___ | $___ | $___ | ___% | $___ |

### Liquidity Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Seller success rate (% with at least 1 sale/month) | >50% | ___% |
| Buyer repeat rate (% who purchase again within 30 days) | >30% | ___% |
| Time to first transaction (new seller) | <7 days | ___ days |
| Supply utilization rate | >60% | ___% |

<!-- ENDIF -->

<!-- IF {{MONETIZATION_MODEL}} == "one-time" -->

## One-Time Purchase Model: Unit Sales Forecast

### Sales Projection

| Month | New Unit Sales | Price | Revenue | Repeat Purchases | Repeat Revenue | Total Revenue |
|-------|---------------|-------|---------|-----------------|---------------|--------------|
| 1 | ___ | $___ | $___ | ___ | $___ | $___ |
| 3 | ___ | $___ | $___ | ___ | $___ | $___ |
| 6 | ___ | $___ | $___ | ___ | $___ | $___ |
| 9 | ___ | $___ | $___ | ___ | $___ | $___ |
| 12 | ___ | $___ | $___ | ___ | $___ | $___ |

### Repeat Purchase Rate

| Metric | Value |
|--------|-------|
| Repeat purchase rate (within 12 months) | ___% |
| Average time between purchases | ___ months |
| Average lifetime purchases per customer | ___ |
| Effective LTV (total purchases over lifetime) | $___ |

### Seasonal Adjustment

One-time purchases are often more seasonal than subscriptions. Apply multipliers:

| Month | Seasonal Multiplier | Rationale |
|-------|--------------------|-----------|
| January | ___ | Post-holiday slump |
| February | ___ | |
| March | ___ | |
| April | ___ | |
| May | ___ | |
| June | ___ | |
| July | ___ | |
| August | ___ | |
| September | ___ | Back-to-school / Q4 ramp |
| October | ___ | |
| November | ___ | Black Friday / holiday |
| December | ___ | Holiday peak |

<!-- ENDIF -->

---

## Monthly Cohort Revenue Analysis

Track how much revenue each monthly signup cohort generates over time. This reveals whether newer cohorts perform better or worse than earlier ones.

| Cohort (Sign-up Month) | Mo 1 Rev | Mo 2 Rev | Mo 3 Rev | Mo 6 Rev | Mo 9 Rev | Mo 12 Rev | Cumulative LTV |
|------------------------|---------|---------|---------|---------|---------|----------|----------------|
| Month 1 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Month 2 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Month 3 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Month 4 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Month 5 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Month 6 cohort | $___ | $___ | $___ | $___ | $___ | $___ | $___ |

### What to Look For in Cohort Data

- **Improving cohorts**: Newer cohorts generate more revenue and retain longer — product and onboarding are improving
- **Declining cohorts**: Newer cohorts underperform — you may be exhausting your best market segment
- **Flat cohorts**: Consistent performance — stable product, predictable economics
- **Delayed monetization**: Some cohorts show low early revenue but strong later revenue — long sales cycle or usage ramp

---

## Seasonal Adjustment Factors

If your product has seasonal patterns, apply multipliers to the base projection:

| Month | Adjustment Factor | Rationale |
|-------|------------------|-----------|
| January | ___ | New year budget cycles, New Year resolutions |
| February | ___ | |
| March | ___ | End of Q1, budget flush |
| April | ___ | |
| May | ___ | |
| June | ___ | End of Q2, mid-year reviews |
| July | ___ | Summer slowdown (B2B) |
| August | ___ | Summer slowdown (B2B) |
| September | ___ | Back to work, Q4 planning |
| October | ___ | Budget planning season |
| November | ___ | Pre-holiday, Black Friday (B2C) |
| December | ___ | Holiday season, year-end budget flush |

**Seasonal impact formula:**
```
Adjusted MRR = Base MRR x Seasonal Factor x (1 + growth rate for that month)
```

---

## Revenue Sanity Checks

Before finalizing your projection, validate against these reality checks:

| Check | Formula | Your Result | Pass? |
|-------|---------|------------|-------|
| TAM capture at 12 months | Projected customers / Total addressable market | ___% | <1% for most startups |
| Revenue per employee | Year 1 ARR / team size | $___ | Seed: $50-150K, Series A: $100-250K |
| Growth rate sustainability | Month 12 growth rate | ___% | Expect deceleration from month 1 |
| Churn-adjusted growth | Growth rate - churn rate | ___% | Must be positive |
| ARPU trend | Month 12 ARPU vs Month 1 ARPU | $___ vs $___ | Flat or increasing = good |

---

## Cross-References

- **Cost structure**: `11-new-capabilities/cost-estimation.template.md`
- **Pricing tiers**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Unit economics**: `25-financial-modeling/unit-economics-calculator.template.md`
- **Break-even**: `25-financial-modeling/break-even-analysis.template.md`
- **Burn rate**: `25-financial-modeling/runway-burn-rate.template.md`
