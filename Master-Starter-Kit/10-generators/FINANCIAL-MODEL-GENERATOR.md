# Financial Model Generator

**Purpose:** Generate revenue projections, unit economics, and financial analysis documents from project intake data and pricing strategy.

**Output:** Financial model documents in `dev_docs/financial-model/`

---

## When to Run

Run this generator during Orchestrator Step 17.5 (Financial Modeling), after:

1. Pricing strategy exists (from Step 20 / marketing pricing templates)
2. Infrastructure cost estimation exists (from Step 17 / `cost-estimation.template.md`)
3. MARKETING_CONFIG is populated with `MONETIZATION_MODEL`, `TARGET_AUDIENCE`, and pricing details

---

## Inputs Required

| Input | Location | What It Provides |
|-------|----------|-----------------|
| Pricing Strategy | `marketing/pricing-strategy.md` | Tier pricing, monetization model |
| Cost Estimation | `dev_docs/cost-estimation.md` | Monthly infrastructure costs |
| Project Brief | `dev_docs/project-brief.md` | Target market, team size, timeline |
| Marketing Config | ORCHESTRATOR STATE BLOCK → MARKETING_CONFIG | MONETIZATION_MODEL, TARGET_AUDIENCE |
| Project Config | ORCHESTRATOR STATE BLOCK → CONFIG | TEAM_SIZE, MVP_TIMELINE |

---

## Generation Instructions

### Step 1: Determine Applicable Models

Based on `{{MONETIZATION_MODEL}}`, select which financial templates to generate:

| Monetization Model | Templates to Generate |
|--------------------|-----------------------|
| `subscription` | Revenue projection (MRR/ARR), unit economics, break-even, investor metrics |
| `freemium` | All of the above + freemium conversion modeling |
| `usage-based` | Revenue projection (consumption), unit economics, break-even |
| `marketplace-fee` | Revenue projection (GMV + take rate), unit economics for both sides |
| `one-time` | Revenue projection (unit sales), break-even |
| `none` | Skip financial modeling entirely |

### Step 2: Gather Financial Assumptions

Ask the user (or derive from existing docs) for these values:

```
FINANCIAL ASSUMPTIONS:
  Monthly growth rate: {{MONTHLY_GROWTH_RATE}} (default: 10%)
  Average revenue per user: {{AVERAGE_REVENUE_PER_USER}} (from pricing strategy)
  Monthly churn rate: {{MONTHLY_CHURN_RATE}} (default: 3% for SaaS)
  Gross margin: {{GROSS_MARGIN}} (default: 80% for software)
  Cash in bank: {{CASH_IN_BANK}} (ask user)
  Monthly sales & marketing spend: (ask user or default to 20% of revenue target)
  Personnel costs: (ask user — founder salaries, contractors)
```

### Step 3: Generate Revenue Projection

Resolve `25-financial-modeling/revenue-projection.template.md`:

1. Fill in the 12-month projection table using growth rate and ARPU
2. Calculate revenue waterfall (new + expansion - contraction - churn)
3. Generate 3 scenarios (conservative at 50% of base assumptions, base, optimistic at 200%)
4. Include conditional sections matching `{{MONETIZATION_MODEL}}`

### Step 4: Generate Unit Economics

Resolve `25-financial-modeling/unit-economics-calculator.template.md`:

1. Calculate CAC from marketing spend / expected new customers
2. Calculate LTV using ARPU, gross margin, and churn rate
3. Compute LTV:CAC ratio and payback period
4. Flag any unhealthy ratios (LTV:CAC < 3:1, payback > 18 months)

### Step 5: Generate Break-Even Analysis

Resolve `25-financial-modeling/break-even-analysis.template.md`:

1. Pull fixed costs from cost-estimation.md + personnel costs
2. Calculate variable cost per customer (hosting increment, support, payment processing)
3. Compute contribution margin and break-even customer count
4. Run sensitivity analysis at 3 price points

### Step 6: Generate Investor Metrics (if seeking funding)

Resolve `25-financial-modeling/investor-metrics-dashboard.template.md`:

1. Pre-fill all calculable metrics from the revenue projection
2. Include stage-appropriate benchmarks
3. Calculate Rule of 40, Quick Ratio, NRR
4. Leave current values blank for the user to fill once operational

### Step 7: Generate Runway Analysis

Resolve `25-financial-modeling/runway-burn-rate.template.md`:

1. Sum all expense categories
2. Calculate gross burn, net burn, and runway
3. Generate 12-month cash flow projection
4. Flag danger zone if runway < 6 months

---

## Output Files

Generate these files in `dev_docs/financial-model/`:

| File | Content |
|------|---------|
| `revenue-projection.md` | 12-month and 24-month revenue model |
| `unit-economics.md` | CAC, LTV, LTV:CAC, payback period |
| `break-even-analysis.md` | Fixed costs, variable costs, break-even point |
| `burn-rate-runway.md` | Monthly burn, runway, cash flow projection |
| `investor-metrics.md` | *(only if seeking funding)* KPI dashboard |
| `freemium-conversion.md` | *(only if freemium)* Funnel modeling |

---

## Presentation

After generation, present a summary:

```
FINANCIAL MODEL GENERATED:
  Revenue model: {{MONETIZATION_MODEL}}
  Month 1 MRR: $[X]
  Month 12 MRR: $[Y] (base case)
  Break-even: [Z] customers at $[ARPU]/mo
  LTV:CAC ratio: [ratio] — [assessment]
  Monthly burn: $[burn]
  Runway: [months] months at current burn

  Files: [N] financial documents in dev_docs/financial-model/
```

---

## Anti-Patterns

- Do NOT generate hockey-stick projections without justification
- Do NOT assume zero churn
- Do NOT ignore payment processor fees (2.9% + $0.30 is real)
- Do NOT confuse GMV with revenue for marketplace models
- Do NOT project beyond 24 months (too speculative to be useful)
- Always include a worst-case scenario (no growth, higher churn)
