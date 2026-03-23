# Financial Modeling Decision Tree

> "What financial model do you need?" Not every project needs every template. This guide helps you pick the right starting point based on your stage, funding model, monetization type, and immediate needs. Start here, then go deep in the templates that matter most.

---

## Quick Decision: Where Do You Start?

Answer the questions below and follow the path:

### Path 1: Are you seeking investment?

**If YES** — You need investor-ready metrics and projections.

1. **Start with**: `investor-metrics-dashboard.template.md` — understand what investors expect
2. **Then**: `unit-economics-calculator.template.md` — calculate the metrics they will grill you on
3. **Then**: `revenue-projection.template.md` — build the projections they will scrutinize
4. **Then**: `runway-burn-rate.template.md` — answer "how long does this raise last?"
5. **Finally**: `break-even-analysis.template.md` — show you know when the business sustains itself

**Key investor questions you must answer:**
- What is your LTV:CAC ratio? (Unit economics calculator)
- What is your MRR and growth rate? (Revenue projection)
- How long does this money last? (Runway tracker)
- When do you become profitable? (Break-even analysis)
- What is your net revenue retention? (Investor dashboard)

---

### Path 2: Are you bootstrapped / self-funded?

**If YES** — You need to know exactly when the business sustains itself.

1. **Start with**: `runway-burn-rate.template.md` — know how long your savings last
2. **Then**: `break-even-analysis.template.md` — the most critical template for you
3. **Then**: `revenue-projection.template.md` — use the conservative scenario primarily
4. **Then**: `unit-economics-calculator.template.md` — ensure per-customer economics work
5. **Optional**: `pricing-financial-analysis.template.md` — optimize pricing for cash flow

**Key questions for bootstrapped founders:**
- How many months of runway do I have? (Burn rate tracker)
- How many customers until break-even? (Break-even analysis)
- What is the minimum viable price that covers costs? (Break-even + pricing analysis)
- What is my worst-case scenario? (Revenue projection, conservative)

---

### Path 3: Do you have a freemium model?

**If YES** — You need to model conversion economics and free-tier costs.

1. **Start with**: `freemium-trial-conversion-modeling.template.md` — your core model
2. **Then**: `unit-economics-calculator.template.md` — CAC is tricky with freemium
3. **Then**: `pricing-financial-analysis.template.md` — feature-gating revenue impact
4. **Then**: `revenue-projection.template.md` — factor in conversion funnel
5. **Then**: `break-even-analysis.template.md` — include free-tier costs in fixed costs

**Key questions for freemium businesses:**
- What does each free user cost me? (Freemium modeling)
- What conversion rate do I need to sustain the free tier? (Freemium modeling)
- Which features should be free vs paid? (Pricing financial analysis)
- What is the highest-ROI funnel improvement? (Freemium modeling)

---

### Path 4: Are you pre-revenue?

**If YES** — You are modeling hypotheticals. Be conservative and focus on viability.

1. **Start with**: `break-even-analysis.template.md` — understand what it takes to sustain the business
2. **Then**: `revenue-projection.template.md` — use the conservative scenario. Ignore optimistic until you have data.
3. **Then**: `runway-burn-rate.template.md` — know your timeline
4. **Defer**: Unit economics and investor dashboard until you have paying customers

**Key questions for pre-revenue:**
- How many customers do I need at this price to cover costs? (Break-even)
- What does conservative revenue look like? (Revenue projection)
- How long do I have to figure this out? (Burn rate)
- What needs to be true for this to work? (Break-even sensitivity analysis)

---

### Path 5: Are you post-revenue?

**If YES** — You have data. Use it to validate and optimize.

1. **Start with**: `unit-economics-calculator.template.md` — calculate real CAC, LTV, and payback
2. **Then**: `revenue-projection.template.md` — model all three scenarios using actual data
3. **Then**: `investor-metrics-dashboard.template.md` — even if not raising, these are the health metrics
4. **Then**: `pricing-financial-analysis.template.md` — optimize pricing based on actual behavior
5. **Then**: `break-even-analysis.template.md` — update with real variable costs

**Key questions for post-revenue:**
- Are my unit economics healthy? (Unit economics calculator)
- What is my actual growth trajectory? (Revenue projection)
- Where should I invest to improve? (Investor dashboard + pricing analysis)
- What happens if I raise prices? (Pricing financial analysis)

---

### Path 6: Are you a marketplace?

**If YES** — You have a two-sided model with unique economics.

1. **Start with**: `revenue-projection.template.md` — use the marketplace section (GMV and take-rate)
2. **Then**: `unit-economics-calculator.template.md` — model economics for BOTH sides (buyers and sellers)
3. **Then**: `break-even-analysis.template.md` — marketplace fixed costs are often higher (two-sided support, trust & safety)
4. **Then**: `runway-burn-rate.template.md` — marketplaces typically need longer runways
5. **Optional**: `pricing-financial-analysis.template.md` — take-rate optimization

**Key questions for marketplaces:**
- What is my take rate and how does it compare to benchmarks? (Revenue projection)
- What does unit economics look like per buyer AND per seller? (Unit economics)
- What GMV do I need to break even? (Break-even analysis)
- How do I balance growth investment across both sides? (Burn rate)

---

## Quick Reference: Which Templates at Each Stage

| Company Stage | Must Use | Should Use | Optional |
|--------------|----------|-----------|----------|
| **Idea / Pre-MVP** | Break-even | Revenue projection (conservative) | — |
| **MVP / Pre-launch** | Break-even, Burn rate | Revenue projection | Freemium modeling |
| **Launched, Pre-revenue** | Burn rate, Break-even | Revenue projection, Freemium modeling | Unit economics |
| **Early Revenue ($0-$5K MRR)** | Unit economics, Burn rate | Revenue projection, Break-even | Pricing analysis |
| **Growing ($5K-$50K MRR)** | Unit economics, Revenue projection | Investor dashboard, Pricing analysis | Freemium modeling |
| **Scaling ($50K+ MRR)** | All templates | All templates | All templates |
| **Pre-fundraise** | Investor dashboard, Unit economics | Revenue projection, Burn rate | Break-even |

---

## Financial Modeling Anti-Patterns

Mistakes that will mislead you or embarrass you in front of investors. Avoid these.

### 1. Vanity Metrics Instead of Real Metrics

| Vanity Metric | Why It Is Misleading | What to Use Instead |
|--------------|---------------------|-------------------|
| Total signups | Includes everyone who ever signed up, including churned | Monthly Active Users (MAU) or paying customers |
| Gross revenue | Does not account for refunds, chargebacks, fees | Net revenue |
| Total page views | Inflated by bots and bounces | Unique visitors, or better: activation rate |
| Downloads | Does not mean usage | DAU/MAU ratio |
| "Users" (undefined) | Could mean anything | Define precisely: registered, active, paying |

### 2. Hockey-Stick Projections Without Basis

**The problem**: Showing a graph that goes from $10K MRR to $1M MRR in 12 months with no justification.

**The fix**: Every growth rate assumption must be backed by at least one of:
- Historical data from your own company
- Comparable company growth at the same stage
- Bottom-up channel capacity analysis (X leads x Y conversion = Z customers)
- Contractual pipeline (for enterprise / sales-led)

### 3. Ignoring Churn in LTV Calculations

**The problem**: Calculating LTV as `ARPU x 36 months` without accounting for churn.

**The fix**: Always use `LTV = (ARPU x Gross Margin) / Monthly Churn Rate`. At 5% monthly churn, average lifespan is 20 months, not 36.

### 4. Confusing Gross and Net Revenue

**The problem**: Reporting marketplace GMV as revenue, or reporting revenue before payment processing fees and refunds.

**The fix**: Always report net revenue. For marketplaces, revenue = GMV x take rate. For all businesses, deduct refunds, chargebacks, and payment processing fees.

### 5. Assuming Linear Growth

**The problem**: "We got 100 customers in month 1, so we will get 1,200 by month 12."

**The fix**: Growth compounds (good news) but also decelerates as you saturate early-adopter segments (reality check). Model S-curve growth, not linear.

### 6. Not Modeling Worst-Case Scenarios

**The problem**: Only showing the base case or (worse) only showing the optimistic case.

**The fix**: Always model conservative, base, and optimistic. Know your worst-case runway. Know what happens if growth is 50% of plan. Investors respect founders who have done this analysis.

### 7. Forgetting Variable Costs Scale

**The problem**: Projecting revenue growth without projecting the associated cost increase (more customers = more infrastructure, more support, more payment processing fees).

**The fix**: Model variable costs explicitly. As customers grow, total costs grow too — just at a slower rate than revenue if your unit economics are healthy.

### 8. Treating All Customers as Equal

**The problem**: Using a single ARPU and churn rate for all customers.

**The fix**: Segment by tier, acquisition channel, and cohort. Enterprise customers have different economics than self-serve. Organic customers retain differently than paid-ad customers.

### 9. Ignoring Seasonality

**The problem**: Projecting flat month-over-month growth without accounting for seasonal patterns.

**The fix**: Apply seasonal adjustment factors. B2B SaaS often sees Q1 budget flush, Q3 summer slowdown, Q4 year-end push. B2C sees holiday spikes.

### 10. Building Models Nobody Updates

**The problem**: Creating a detailed financial model once and never updating it with actuals.

**The fix**: Schedule a monthly review (first of every month). Compare projections to actuals. Adjust assumptions. A model is only useful if it reflects reality.

---

## Recommended Reading Order for Complete Coverage

If you want to build a comprehensive financial model covering all aspects:

1. **This file** (decision tree) — you are here
2. **`financial-gotchas.md`** — learn the mistakes before building models
3. **`break-even-analysis.template.md`** — establish the foundation: what does sustainability look like?
4. **`revenue-projection.template.md`** — project the top line with multiple scenarios
5. **`unit-economics-calculator.template.md`** — validate per-customer profitability
6. **`runway-burn-rate.template.md`** — understand the clock you are on
7. **`freemium-trial-conversion-modeling.template.md`** — if applicable, model the funnel
8. **`pricing-financial-analysis.template.md`** — optimize pricing for financial outcomes
9. **`investor-metrics-dashboard.template.md`** — package everything into an investor-ready view

Total time estimate: 4-8 hours for first pass, 1-2 hours monthly for updates.

---

## Cross-References

- **All Section 25 templates**: Listed above with recommended order
- **Cost estimation**: `11-new-capabilities/cost-estimation.template.md`
- **Pricing strategy**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Section overview**: `25-financial-modeling/README.md`
