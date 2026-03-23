# Phase 25: Financial Modeling & Unit Economics

> The financial model that bridges pricing decisions to actual business viability. Answers "given this pricing, this cost structure, and this growth trajectory — when do we break even and is this a real business?"

---

## Why This Exists

The kit already has pricing strategy (Section 19) and infrastructure costs (Section 11), but there is no bridge between them. You know what you want to charge and what your servers cost — but you do not know:

- How many customers you need to cover expenses
- When revenue will exceed burn rate
- Whether your unit economics actually work at scale
- How long your cash lasts at the current trajectory
- What metrics investors will demand before writing a check

This section connects pricing decisions to financial outcomes. It takes your revenue assumptions, cost structure, and growth trajectory and turns them into projections, break-even analysis, and investor-ready dashboards.

Without this section, you are flying blind. You might build a product that gains traction but never generates enough margin to sustain itself. You might raise money without knowing your burn rate. You might set prices that look competitive but lose money on every customer after infrastructure and support costs.

Financial modeling is not about predicting the future with precision. It is about understanding the levers — what happens if churn improves by 1%, if ARPU increases by $10, if CAC drops by 20%. The models in this section give you those levers.

---

## Conditional Activation

This section is activated when `{{MONETIZATION_MODEL}} != "none"`.

If the project is open-source with no commercial component, or a purely internal tool, skip this section entirely. Every other project — SaaS, marketplace, mobile app, consulting productization, one-time purchase — needs financial modeling.

---

## How It Integrates with the Orchestrator

This section connects to **Orchestrator Step 17.5** (Financial Modeling & Unit Economics). It runs after:

- **Step 5** (Service Specs) — you know what you are building
- **Step 11** (Cost Estimation) — you know what infrastructure costs via `cost-estimation.template.md`
- **Step 13** (Design System) — you know the product scope
- **Step 19-20** (Marketing & Pricing) — you know your pricing tiers via `pricing-strategy.template.md`

It feeds into:

- **Step 25** (Launch Strategy) — financial readiness gates for launch
- **Step 26** (Growth Planning) — budget allocation for growth channels
- **Step 28** (Marketing Dashboard) — KPI tracking and reporting

### Data Flow

```
cost-estimation.template.md (Section 11)
         ↓
pricing-strategy.template.md (Section 19)
         ↓
  ┌──────┴──────┐
  │  Section 25  │
  │  Financial   │
  │  Modeling    │
  └──────┬──────┘
         ↓
  Launch / Growth / Investor Readiness
```

---

## Files in This Section

| # | File | Type | Purpose | Orchestrator Step |
|---|------|------|---------|-------------------|
| 1 | `README.md` | Guide | Section overview and reading order | — |
| 2 | `revenue-projection.template.md` | Template | MRR/ARR projection with scenarios | 17.5.1 |
| 3 | `unit-economics-calculator.template.md` | Template | CAC, LTV, payback period, cohort analysis | 17.5.2 |
| 4 | `runway-burn-rate.template.md` | Template | Monthly burn tracking and runway calculation | 17.5.3 |
| 5 | `break-even-analysis.template.md` | Template | Fixed/variable costs and break-even point | 17.5.4 |
| 6 | `investor-metrics-dashboard.template.md` | Template | Investor-ready KPIs and benchmarks | 17.5.5 |
| 7 | `freemium-trial-conversion-modeling.template.md` | Template | Funnel modeling and conversion projections | 17.5.6 |
| 8 | `pricing-financial-analysis.template.md` | Template | Tier mix, elasticity, discount modeling | 17.5.7 |
| 9 | `financial-modeling-decision-tree.md` | Guide | "What model do you need?" decision tree | — |
| 10 | `financial-gotchas.md` | Guide | Production lessons and common mistakes | — |

---

## Reading Order

### If you are new to financial modeling:

1. **`financial-modeling-decision-tree.md`** — Figure out which templates apply to your situation
2. **`financial-gotchas.md`** — Learn the mistakes before you make them
3. **`break-even-analysis.template.md`** — Understand when you become profitable
4. **`revenue-projection.template.md`** — Model your revenue growth
5. **`unit-economics-calculator.template.md`** — Validate your per-customer economics
6. **`runway-burn-rate.template.md`** — Know how long your money lasts
7. **`freemium-trial-conversion-modeling.template.md`** — If applicable, model your funnel
8. **`pricing-financial-analysis.template.md`** — Optimize pricing for financial outcomes
9. **`investor-metrics-dashboard.template.md`** — Package everything for investors

### If you are experienced and need specific models:

1. **`financial-modeling-decision-tree.md`** — Jump to the right template
2. Pick the template(s) that match your stage and needs
3. Cross-reference `financial-gotchas.md` for validation

### If you are preparing for fundraising:

1. **`investor-metrics-dashboard.template.md`** — Start here, work backwards
2. **`unit-economics-calculator.template.md`** — The metrics investors will grill you on
3. **`revenue-projection.template.md`** — The projections they will scrutinize
4. **`runway-burn-rate.template.md`** — The question they will always ask: "How long does this last?"

---

## Key Placeholders Used in This Section

| Placeholder | Source | Example |
|-------------|--------|---------|
| `{{PROJECT_NAME}}` | Discovery (Step 1) | "Acme SaaS" |
| `{{MONETIZATION_MODEL}}` | Pricing (Step 20) | "subscription", "usage-based", "marketplace", "one-time" |
| `{{MONTHLY_GROWTH_RATE}}` | Growth assumptions | "10" (percent) |
| `{{AVERAGE_REVENUE_PER_USER}}` | Pricing strategy | "49" (dollars) |
| `{{MONTHLY_CHURN_RATE}}` | Retention modeling | "3" (percent) |
| `{{GROSS_MARGIN}}` | Cost analysis | "75" (percent) |
| `{{CASH_IN_BANK}}` | Founder input | "250000" (dollars) |
| `{{PERSONNEL_COST}}` | Budget planning | "35000" (dollars/month) |
| `{{SIGNUP_RATE}}` | Funnel data | "3" (percent) |
| `{{ACTIVATION_RATE}}` | Funnel data | "40" (percent) |
| `{{CONVERSION_RATE}}` | Funnel data | "5" (percent) |
| `{{RETENTION_RATE}}` | Funnel data | "85" (percent) |

---

## What Good Looks Like

A completed Section 25 gives you:

- A 24-month revenue projection with conservative, base, and optimistic scenarios
- Clear unit economics: you know exactly what each customer costs to acquire, what they are worth, and when you recoup the acquisition cost
- A burn rate tracker that tells you how many months of runway you have under different scenarios
- A break-even target: the exact number of customers and revenue needed to cover all costs
- An investor-ready dashboard with benchmarks that tell you where you stand relative to fundable companies
- Conversion funnel economics that connect marketing spend to revenue outcomes

This is the difference between "we think this could work" and "here are the numbers that prove it."
