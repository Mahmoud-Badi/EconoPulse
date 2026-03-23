# Break-Even Analysis — {{PROJECT_NAME}}

> Determines the exact point where revenue covers all costs — the number of customers, the revenue threshold, and the timeline to get there. Until you reach break-even, you are spending someone's money (yours, your investors', your savings). This template tells you when that stops.

---

## Fixed Cost Inventory

Fixed costs do not change with the number of customers (within a reasonable range). These are your baseline expenses — what you pay even with zero customers.

| Fixed Cost Category | Monthly Amount | Annual Amount | Notes |
|--------------------|---------------|--------------|-------|
| Founder salaries / draws | $___ | $___ | |
| Full-time employee salaries | $___ | $___ | |
| Benefits & payroll taxes | $___ | $___ | ~20-30% of salaries |
| Base infrastructure (hosting minimum) | $___ | $___ | Minimum tier before any users |
| SaaS tools (team tools) | $___ | $___ | GitHub, Slack, etc. |
| Office / co-working | $___ | $___ | |
| Insurance | $___ | $___ | |
| Legal / accounting (amortized) | $___ | $___ | |
| Domain, SSL, basic services | $___ | $___ | |
| Miscellaneous overhead | $___ | $___ | Budget 5-10% buffer |
| **Total Fixed Costs** | **$___** | **$___** | |

### Fixed Cost Reality Check

| Check | Value | Assessment |
|-------|-------|-----------|
| Fixed costs as % of total costs | ___% | High fixed costs = high break-even point but better margins at scale |
| Fixed costs per team member | $___ | Benchmark: $8-15K/mo per person (fully loaded) in US; varies by location |
| Can fixed costs be reduced by 30%+ if needed? | Yes / No | Important for survival scenarios |

---

## Variable Cost per Customer

Variable costs scale with each additional customer. These determine your contribution margin — the profit per customer after covering the incremental cost of serving them.

| Variable Cost Component | Per Customer/Month | Calculation Method | Notes |
|------------------------|-------------------|-------------------|-------|
| Hosting / compute increment | $___ | Total hosting / customers, or per-request cost | Each user consumes compute, bandwidth, storage |
| Database storage increment | $___ | Per-GB cost x avg GB per user | |
| CDN / bandwidth | $___ | Per-GB transfer cost x avg usage | |
| Support cost | $___ | (Support team cost / tickets) x avg tickets per customer | Estimate: 0.5-2 hrs/customer/month at support wage |
| Payment processing | $___ | 2.9% + $0.30 per transaction | On $49 plan: $1.72/mo. On $10 plan: $0.59/mo |
| Email / notifications | $___ | Per-email cost x emails/customer/month | SendGrid: ~$0.001/email |
| AI/ML API usage | $___ | Per-request cost x avg requests per user | GPT-4 calls, embeddings, etc. |
| Third-party API calls | $___ | Per-call cost x avg calls per user | Maps, SMS, verification, etc. |
| Data egress | $___ | Per-GB cost x avg data served per user | |
| Compliance / security per-user | $___ | Per-seat licensing for security tools | |
| **Total Variable Cost per Customer** | **$___** | | |

### Variable Cost at Scale

Variable costs per customer often decrease at scale (volume discounts, infrastructure efficiency). Model both current and at-scale costs:

| Scale | Variable Cost/Customer | Reason |
|-------|----------------------|--------|
| 1-100 customers | $___ | No volume discounts, inefficient infrastructure |
| 100-1,000 customers | $___ | Some optimization, better hosting tiers |
| 1,000-10,000 customers | $___ | Volume discounts, dedicated infrastructure |
| 10,000+ customers | $___ | Maximum optimization, enterprise hosting agreements |

---

## Contribution Margin

The profit earned per customer after variable costs. This is the money available to cover fixed costs and generate profit.

```
Contribution Margin = Revenue per Customer - Variable Cost per Customer
Contribution Margin % = Contribution Margin / Revenue per Customer x 100
```

| Metric | Value |
|--------|-------|
| Revenue per customer (ARPU) | ${{AVERAGE_REVENUE_PER_USER}}/mo |
| Variable cost per customer | $___/mo |
| **Contribution Margin** | **$___/mo** |
| **Contribution Margin %** | **___**% |

### Contribution Margin by Tier

| Tier | Price | Variable Cost | Contribution Margin | CM % |
|------|-------|--------------|--------------------|----|
| Starter | $___ | $___ | $___ | ___% |
| Pro | $___ | $___ | $___ | ___% |
| Enterprise | $___ | $___ | $___ | ___% |
| **Blended Average** | **$___** | **$___** | **$___** | **___**% |

---

## Break-Even Calculations

### Break-Even Customer Count

```
Break-Even Customers = Total Monthly Fixed Costs / Monthly Contribution Margin per Customer
```

| Variable | Value |
|----------|-------|
| Total monthly fixed costs | $___ |
| Contribution margin per customer | $___ |
| **Break-even customers** | **___** |

Example:
```
$25,000 fixed costs / $44 contribution margin = 569 customers
```

### Break-Even Revenue

```
Break-Even Revenue = Total Fixed Costs / (1 - Variable Cost Ratio)

Variable Cost Ratio = Total Variable Costs / Total Revenue
```

| Variable | Value |
|----------|-------|
| Total monthly fixed costs | $___ |
| Variable cost ratio (variable cost / revenue per customer) | ___% |
| **Break-even monthly revenue** | **$___** |
| **Break-even annual revenue** | **$___** |

Example:
```
Variable Cost Ratio = $5 / $49 = 10.2%
Break-Even Revenue = $25,000 / (1 - 0.102) = $25,000 / 0.898 = $27,839/month
```

---

## Break-Even Timeline Estimation

How long until you reach break-even, given your growth trajectory?

### Based on Base-Case Growth

| Month | Projected Customers | Projected Revenue | Total Costs (Fixed + Variable) | Profit/Loss | Cumulative Loss |
|-------|--------------------|--------------------|-------------------------------|------------|----------------|
| 1 | ___ | $___ | $___ | -$___ | -$___ |
| 2 | ___ | $___ | $___ | -$___ | -$___ |
| 3 | ___ | $___ | $___ | -$___ | -$___ |
| 4 | ___ | $___ | $___ | -$___ | -$___ |
| 5 | ___ | $___ | $___ | -$___ | -$___ |
| 6 | ___ | $___ | $___ | -$___ | -$___ |
| 7 | ___ | $___ | $___ | -$___ | -$___ |
| 8 | ___ | $___ | $___ | -$___ | -$___ |
| 9 | ___ | $___ | $___ | -$___ | -$___ |
| 10 | ___ | $___ | $___ | -$___ | -$___ |
| 11 | ___ | $___ | $___ | $___ | -$___ |
| 12 | ___ | $___ | $___ | $___ | -$___ |

**Estimated break-even month**: Month ___

**Total cash required to reach break-even**: $___

This is the minimum funding you need. Add a 30-50% buffer for unexpected costs and slower-than-expected growth.

### Break-Even Under Each Scenario

| Scenario | Growth Rate | Break-Even Month | Cash Required to Break-Even |
|----------|-----------|-----------------|---------------------------|
| Conservative | 5%/mo | Month ___ | $___ |
| Base | {{MONTHLY_GROWTH_RATE}}%/mo | Month ___ | $___ |
| Optimistic | 20%/mo | Month ___ | $___ |

---

## Sensitivity Analysis

How does break-even change when you adjust key variables?

### Price Point Sensitivity

| Price Point | Variable Cost | Contribution Margin | Break-Even Customers | Break-Even Revenue |
|------------|--------------|--------------------|--------------------|-------------------|
| $9/mo | $2 | $7 | ___ / $7 = ___ | $___ |
| $19/mo | $3 | $16 | ___ / $16 = ___ | $___ |
| $29/mo | $4 | $25 | ___ / $25 = ___ | $___ |
| $49/mo | $5 | $44 | ___ / $44 = ___ | $___ |
| $79/mo | $7 | $72 | ___ / $72 = ___ | $___ |
| $99/mo | $8 | $91 | ___ / $91 = ___ | $___ |
| $199/mo | $12 | $187 | ___ / $187 = ___ | $___ |

### Fixed Cost Sensitivity

| Fixed Cost Level | Break-Even Customers (at current CM) | Break-Even Revenue |
|-----------------|-------------------------------------|-------------------|
| $10,000/mo (solo founder) | ___ | $___ |
| $25,000/mo (small team: 2-3) | ___ | $___ |
| $50,000/mo (team: 5-7) | ___ | $___ |
| $100,000/mo (team: 10-15) | ___ | $___ |
| $200,000/mo (team: 20-30) | ___ | $___ |

### Churn Impact on Break-Even

Higher churn means you need more new customers each month just to maintain your base, which delays break-even.

| Monthly Churn | Net Growth Rate* | Months to Break-Even | Additional Customers Needed |
|--------------|-----------------|---------------------|-----------------------------|
| 1% | ___% | ___ | ___ |
| 3% | ___% | ___ | ___ |
| 5% | ___% | ___ | ___ |
| 7% | ___% | ___ | ___ |
| 10% | ___% | ___ | ___ |

*Net growth rate = gross growth rate - churn rate. If growth is 10% and churn is 5%, net growth is 5%.

---

## Break-Even Visualizaton Guide

Plot these on a graph to visualize your break-even point:

```
Revenue & Cost vs. Customers

$  |
   |                    /  Revenue (price x customers)
   |                  /
   |                /
   |              /
   |            / ---- Break-even point (lines cross)
   |          /  /
   |        /  /  Total Cost (fixed + variable x customers)
   |      /  /
   |    /  /
   |--/--/------------- Fixed Costs (horizontal line)
   | / /
   |//___________________ Customers
   0
```

Key insight: The steeper the revenue line relative to the total cost line, the fewer customers you need. This is why higher prices reduce break-even dramatically — the revenue line is steeper.

---

## Post-Break-Even: Margin Expansion

Once you cross break-even, each additional customer adds contribution margin almost entirely to profit (fixed costs are already covered).

| Customers Above Break-Even | Additional Monthly Profit | Annual Profit (above break-even) |
|---------------------------|--------------------------|--------------------------------|
| +10 | $___ | $___ |
| +50 | $___ | $___ |
| +100 | $___ | $___ |
| +500 | $___ | $___ |
| +1,000 | $___ | $___ |

**Margin at scale:**
```
At 2x break-even customers: ___% operating margin
At 3x break-even customers: ___% operating margin
At 5x break-even customers: ___% operating margin
```

---

## Action Items Based on Break-Even Analysis

| If Break-Even Is... | Then... |
|---------------------|---------|
| < 6 months away | Focus on growth; break-even is achievable with current trajectory |
| 6-12 months away | Validate assumptions monthly; have cost-cutting plan ready |
| 12-18 months away | Ensure sufficient runway; consider pricing adjustments |
| 18-24 months away | Re-evaluate pricing, costs, or business model; this is a long time |
| > 24 months away | Serious concern — consider pivoting pricing, reducing scope, or raising more capital |

---

## Cross-References

- **Cost structure details**: `11-new-capabilities/cost-estimation.template.md`
- **Revenue projections**: `25-financial-modeling/revenue-projection.template.md`
- **Burn rate**: `25-financial-modeling/runway-burn-rate.template.md`
- **Pricing tiers**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Unit economics**: `25-financial-modeling/unit-economics-calculator.template.md`
