# Unit Economics Calculator — {{PROJECT_NAME}}

> The per-customer profitability model that determines whether your business can scale. If your unit economics do not work at 100 customers, they will not magically fix themselves at 10,000. This calculator gives you CAC, LTV, payback period, and the ratios that determine business viability.

---

## Customer Acquisition Cost (CAC)

### Blended CAC Calculation

```
CAC = Total Sales & Marketing Spend / New Customers Acquired
```

| Period | Total S&M Spend | New Customers | Blended CAC |
|--------|----------------|---------------|-------------|
| Month 1 | $___ | ___ | $___ |
| Month 2 | $___ | ___ | $___ |
| Month 3 | $___ | ___ | $___ |
| Month 4 | $___ | ___ | $___ |
| Month 5 | $___ | ___ | $___ |
| Month 6 | $___ | ___ | $___ |
| **Q1 Average** | **$___** | **___** | **$___** |
| **Q2 Average** | **$___** | **___** | **$___** |

### CAC by Channel

Different channels have vastly different acquisition economics. Track each independently:

| Channel | Monthly Spend | Customers Acquired | CAC | % of Total Customers | Trend |
|---------|-------------|-------------------|-----|---------------------|-------|
| **Organic (SEO/Direct)** | $0 (content cost amortized) | ___ | $0* | ___% | |
| **Google Ads (Search)** | $___ | ___ | $___ | ___% | |
| **Google Ads (Display)** | $___ | ___ | $___ | ___% | |
| **Meta Ads (FB/IG)** | $___ | ___ | $___ | ___% | |
| **LinkedIn Ads** | $___ | ___ | $___ | ___% | |
| **Content Marketing** | $___ | ___ | $___ | ___% | |
| **Referral Program** | $___ | ___ | $___ | ___% | |
| **Outbound Sales** | $___ | ___ | $___ | ___% | |
| **Partnerships** | $___ | ___ | $___ | ___% | |
| **Product Hunt / Launch** | $___ | ___ | $___ | ___% | |
| **Total / Blended** | **$___** | **___** | **$___** | **100%** | |

*Organic CAC note: Organic customers cost $0 in direct spend but have amortized content creation and SEO costs. For a true CAC, allocate a portion of content team costs to organic acquisition.*

### Fully Loaded CAC

Blended CAC only counts direct marketing spend. Fully loaded CAC includes:

| Component | Monthly Cost | Allocation to Acquisition |
|-----------|-------------|--------------------------|
| Marketing team salaries | $___ | ___% = $___ |
| Sales team salaries | $___ | ___% = $___ |
| Marketing tools (CRM, analytics, etc.) | $___ | ___% = $___ |
| Ad spend | $___ | 100% = $___ |
| Content creation | $___ | ___% = $___ |
| Event / sponsorship costs | $___ | ___% = $___ |
| **Total Fully Loaded S&M** | | **$___** |
| **New Customers (this month)** | | **___** |
| **Fully Loaded CAC** | | **$___** |

### CAC Trend Tracking

Track CAC monthly to catch upward trends early:

| Month | Blended CAC | Fully Loaded CAC | Change MoM | Channel Driving Change |
|-------|-----------|-----------------|-----------|----------------------|
| 1 | $___ | $___ | — | — |
| 2 | $___ | $___ | ___% | ___ |
| 3 | $___ | $___ | ___% | ___ |
| 4 | $___ | $___ | ___% | ___ |
| 5 | $___ | $___ | ___% | ___ |
| 6 | $___ | $___ | ___% | ___ |

**Warning signs**: CAC increasing >10% MoM for 3+ consecutive months means your acquisition channels are saturating or becoming more competitive.

---

## Customer Lifetime Value (LTV)

### Method 1: Formula-Based LTV

Best for: early-stage companies with limited historical data.

```
LTV = (ARPU x Gross Margin) / Monthly Churn Rate
```

| Variable | Value | Source |
|----------|-------|--------|
| ARPU | ${{AVERAGE_REVENUE_PER_USER}} | Pricing strategy |
| Gross Margin | {{GROSS_MARGIN}}% | Cost analysis |
| Monthly Churn Rate | {{MONTHLY_CHURN_RATE}}% | Retention data |
| **LTV** | **$___** | **({{AVERAGE_REVENUE_PER_USER}} x {{GROSS_MARGIN}}%) / {{MONTHLY_CHURN_RATE}}%** |

Example calculation:
```
LTV = ($49 x 0.75) / 0.03 = $36.75 / 0.03 = $1,225
```

### Method 2: Lifespan-Based LTV

Best for: when you know average customer lifespan.

```
Average Customer Lifespan = 1 / Monthly Churn Rate
LTV = ARPU x Gross Margin x Average Lifespan (months)
```

| Variable | Value |
|----------|-------|
| Monthly Churn Rate | {{MONTHLY_CHURN_RATE}}% |
| Average Lifespan | 1 / {{MONTHLY_CHURN_RATE}}% = ___ months |
| ARPU | ${{AVERAGE_REVENUE_PER_USER}} |
| Gross Margin | {{GROSS_MARGIN}}% |
| **LTV** | **$___** |

Example:
```
Lifespan = 1 / 0.03 = 33.3 months
LTV = $49 x 0.75 x 33.3 = $1,224
```

### Method 3: Cohort-Based LTV (Most Accurate)

Best for: post-revenue companies with 6+ months of data. Track actual revenue from each cohort over time.

| Months Since Signup | Cohort 1 (n=___) | Cohort 2 (n=___) | Cohort 3 (n=___) | Cohort 4 (n=___) | Average |
|--------------------|-------------------|-------------------|-------------------|-------------------|---------|
| Month 1 | $___ | $___ | $___ | $___ | $___ |
| Month 2 | $___ | $___ | $___ | $___ | $___ |
| Month 3 | $___ | $___ | $___ | $___ | $___ |
| Month 4 | $___ | $___ | $___ | $___ | $___ |
| Month 5 | $___ | $___ | $___ | $___ | $___ |
| Month 6 | $___ | $___ | $___ | $___ | $___ |
| Month 9 | $___ | $___ | $___ | — | $___ |
| Month 12 | $___ | $___ | — | — | $___ |
| Month 18 | $___ | — | — | — | $___ |
| Month 24 | $___ | — | — | — | $___ |
| **Cumulative LTV** | **$___** | **$___** | **$___** | **$___** | **$___** |

### LTV by Pricing Tier

Different tiers have different retention characteristics and LTV:

| Tier | ARPU | Churn Rate | Avg Lifespan | Gross Margin | LTV | % of Customers |
|------|------|-----------|-------------|-------------|-----|---------------|
| Starter | $___ | ___% | ___ mo | ___% | $___ | ___% |
| Pro | $___ | ___% | ___ mo | ___% | $___ | ___% |
| Enterprise | $___ | ___% | ___ mo | ___% | $___ | ___% |
| **Blended** | **$___** | **___**% | **___** mo | **___**% | **$___** | **100%** |

*Note: Enterprise customers typically have lower churn (2-5x longer lifespan) and higher ARPU, making their LTV significantly higher. This is why many SaaS companies move upmarket over time.*

---

## LTV:CAC Ratio Analysis

The single most important metric for determining whether your growth engine is working.

```
LTV:CAC Ratio = LTV / CAC
```

| Your Values | |
|-------------|---|
| LTV | $___ |
| CAC | $___ |
| **LTV:CAC Ratio** | **___:1** |

### Interpretation Guide

| Ratio | Assessment | What It Means | Action |
|-------|-----------|--------------|--------|
| < 1.0:1 | **Losing money on every customer** | You spend more to acquire a customer than they will ever be worth | Immediately reduce CAC or increase pricing. This is not sustainable at any scale. |
| 1.0 - 2.0:1 | **Unsustainable** | Barely breaking even on acquisition; no margin for overhead or error | Optimize both CAC (cheaper channels, better conversion) and LTV (reduce churn, increase ARPU) |
| 2.0 - 3.0:1 | **Needs improvement** | Functional but thin margins; one bad quarter breaks the model | Focus on retention and expansion revenue to push LTV higher |
| 3.0 - 5.0:1 | **Healthy** | Strong unit economics; sustainable growth | Maintain current trajectory; optimize incrementally |
| > 5.0:1 | **Under-investing in growth** | You could spend more on acquisition and still maintain healthy economics | Increase marketing spend; test new channels; the market is willing to pay more than you are spending to reach them |

### LTV:CAC by Channel

| Channel | CAC | LTV of Customers from Channel | LTV:CAC | Assessment |
|---------|-----|------------------------------|---------|-----------|
| Organic | $___ | $___ | ___:1 | |
| Google Ads | $___ | $___ | ___:1 | |
| Meta Ads | $___ | $___ | ___:1 | |
| LinkedIn Ads | $___ | $___ | ___:1 | |
| Content | $___ | $___ | ___:1 | |
| Referral | $___ | $___ | ___:1 | |
| Outbound | $___ | $___ | ___:1 | |
| Partnerships | $___ | $___ | ___:1 | |

---

## CAC Payback Period

How many months until you recoup the cost of acquiring a customer.

```
Payback Period = CAC / (ARPU x Gross Margin)
```

| Variable | Value |
|----------|-------|
| CAC | $___ |
| ARPU | ${{AVERAGE_REVENUE_PER_USER}} |
| Gross Margin | {{GROSS_MARGIN}}% |
| Monthly Contribution per Customer | ${{AVERAGE_REVENUE_PER_USER}} x {{GROSS_MARGIN}}% = $___ |
| **Payback Period** | **___ months** |

Example:
```
Payback = $150 / ($49 x 0.75) = $150 / $36.75 = 4.1 months
```

### Payback Period Benchmarks

| Company Stage | Target Payback | Your Payback | Status |
|--------------|---------------|-------------|--------|
| Pre-seed / Bootstrapped | < 24 months | ___ months | |
| Seed | < 18 months | ___ months | |
| Series A | < 12 months | ___ months | |
| Series B+ / Growth | < 8 months | ___ months | |
| Enterprise SaaS | < 18 months (higher CAC tolerable) | ___ months | |

### Cash Flow Impact of Payback Period

A 12-month payback means you need to fund 12 months of acquisition costs before those customers become profitable. At scale:

| Monthly New Customers | CAC | Monthly Acquisition Investment | Months to Payback | Cash Tied Up |
|----------------------|-----|-------------------------------|-------------------|-------------|
| 10 | $___ | $___ | ___ | $___ |
| 50 | $___ | $___ | ___ | $___ |
| 100 | $___ | $___ | ___ | $___ |
| 500 | $___ | $___ | ___ | $___ |

---

## Magic Number

Measures sales efficiency: how much net new ARR does each dollar of sales and marketing spend generate?

```
Magic Number = Net New ARR (this quarter) / S&M Spend (last quarter)
```

| Quarter | S&M Spend | Net New ARR (next quarter) | Magic Number |
|---------|-----------|--------------------------|-------------|
| Q1 | $___ | $___ | ___ |
| Q2 | $___ | $___ | ___ |
| Q3 | $___ | $___ | ___ |
| Q4 | $___ | $___ | ___ |

### Magic Number Interpretation

| Magic Number | Meaning | Action |
|-------------|---------|--------|
| < 0.5 | Inefficient — burning cash for minimal growth | Pause paid acquisition, fix funnel or product |
| 0.5 - 0.75 | Below average — room for improvement | Optimize channels, improve conversion rates |
| 0.75 - 1.0 | Good — efficient growth engine | Maintain and scale carefully |
| > 1.0 | Excellent — accelerate investment | Increase S&M spend aggressively; every $1 generates >$1 in ARR |

---

## Cohort Retention & Revenue Analysis

Track month-over-month retention and revenue by cohort. This is the most honest view of your business health.

### Customer Retention Waterfall

| Cohort | Mo 1 | Mo 2 | Mo 3 | Mo 4 | Mo 5 | Mo 6 | Mo 9 | Mo 12 | Mo 18 | Mo 24 |
|--------|------|------|------|------|------|------|------|-------|-------|-------|
| Jan (n=___) | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Feb (n=___) | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | |
| Mar (n=___) | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% | | |
| Apr (n=___) | 100% | ___% | ___% | ___% | ___% | ___% | ___% | | | |
| May (n=___) | 100% | ___% | ___% | ___% | ___% | ___% | | | | |
| Jun (n=___) | 100% | ___% | ___% | ___% | ___% | | | | | |

### Revenue Retention Waterfall (Net Dollar Retention)

Includes expansion revenue — a cohort's total revenue can exceed 100% if upsells outpace churn.

| Cohort | Mo 1 | Mo 2 | Mo 3 | Mo 4 | Mo 5 | Mo 6 | Mo 9 | Mo 12 |
|--------|------|------|------|------|------|------|------|-------|
| Jan | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Feb | 100% | ___% | ___% | ___% | ___% | ___% | ___% | ___% |
| Mar | 100% | ___% | ___% | ___% | ___% | ___% | ___% | |
| Apr | 100% | ___% | ___% | ___% | ___% | ___% | | |
| May | 100% | ___% | ___% | ___% | ___% | | | |
| Jun | 100% | ___% | ___% | ___% | | | | |

**Key insight**: If net dollar retention exceeds 100%, your existing customers are generating more revenue over time. This means your business can grow even with zero new customer acquisition.

---

## Unit Economics Health Dashboard

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Blended CAC | $___ | $___ | |
| LTV (Method 1) | $___ | $___ | |
| LTV:CAC Ratio | ___:1 | >3:1 | |
| Payback Period | ___ months | <12 months | |
| Magic Number | ___ | >0.75 | |
| Gross Margin | ___% | >70% | |
| Net Revenue Retention | ___% | >100% | |
| Month 6 Logo Retention | ___% | >80% | |
| Month 12 Logo Retention | ___% | >70% | |

---

## Cross-References

- **Revenue projections**: `25-financial-modeling/revenue-projection.template.md`
- **Break-even analysis**: `25-financial-modeling/break-even-analysis.template.md`
- **Investor metrics**: `25-financial-modeling/investor-metrics-dashboard.template.md`
- **Pricing strategy**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Cost estimation**: `11-new-capabilities/cost-estimation.template.md`
