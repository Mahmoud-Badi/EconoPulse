# Sensitivity Analysis Guide

> Stop presenting one set of projections as "the plan." Every financial model is a guess. Sensitivity analysis shows which guesses matter most — and at what point your strategy needs to change.

---

## What Is Sensitivity Analysis?

Sensitivity analysis answers: **"If this input changes, how much does the outcome change?"**

It reveals:
- Which variables have the biggest impact on your business outcome
- Where you should focus optimization efforts
- At what point your current strategy breaks
- How much uncertainty exists in your projections

---

## Tornado Diagram Methodology

A tornado diagram shows the relative impact of each variable on your outcome metric (e.g., 12-month revenue, runway, or profitability).

### How to Build One

```
Step 1: Identify your key outcome metric
  Example: "Net revenue at month 12"
  Base case value: $500,000

Step 2: List input variables
  - Monthly churn rate (base: 5%)
  - Customer acquisition cost (base: $200)
  - Conversion rate (base: 3%)
  - Average revenue per user / ARPU (base: $50/mo)
  - Monthly growth rate (base: 10%)
  - Gross margin (base: 75%)

Step 3: Vary each input by ±20%, holding all others constant
  Churn: 4% (-20%) and 6% (+20%)
  CAC: $160 (-20%) and $240 (+20%)
  Conversion: 2.4% (-20%) and 3.6% (+20%)
  ARPU: $40 (-20%) and $60 (+20%)
  Growth: 8% (-20%) and 12% (+20%)
  Margin: 60% (-20%) and 90% (+20%)

Step 4: Calculate outcome for each variation
  Churn at 4%: $580,000 (+$80K from base)
  Churn at 6%: $410,000 (-$90K from base)
  CAC at $160: $540,000 (+$40K)
  CAC at $240: $460,000 (-$40K)
  ... etc.

Step 5: Sort by impact range (largest range at top)
```

### Reading the Tornado Diagram

```
                    $300K  $400K  $500K  $600K  $700K
                      |      |      |      |      |
  Churn rate          |======|======[BASE]==========|     ← Biggest impact
  ARPU                |=====|======[BASE]========|        ← Second biggest
  Growth rate         |=====|======[BASE]=======|
  Conversion rate       |===|======[BASE]======|
  Gross margin           |==|======[BASE]=====|
  CAC                     |=|======[BASE]====|            ← Smallest impact
                      |      |      |      |      |
                    $300K  $400K  $500K  $600K  $700K

The wider the bar, the more sensitive your outcome is to that variable.
```

**Interpretation:** In this example, churn rate has the most impact on 12-month revenue. A 20% improvement in churn (5% → 4%) is worth more than a 20% improvement in any other variable. This is where you should focus.

---

## Key Variables to Test

### For SaaS / Subscription Businesses

| Variable | Base Case Example | Test Range | Why It Matters |
|----------|------------------|------------|---------------|
| Monthly churn rate | {{CHURN_RATE}}% | ±2 percentage points | Compounds monthly — small changes have huge long-term impact |
| Customer acquisition cost (CAC) | ${{CAC}} | ±30% | Directly affects burn rate and payback period |
| Trial-to-paid conversion rate | {{CONVERSION_RATE}}% | ±5 percentage points | Determines how efficiently you monetize traffic |
| Average revenue per user (ARPU) | ${{ARPU}}/mo | ±25% | Driven by pricing, upsells, plan mix |
| Monthly customer growth rate | {{GROWTH_RATE}}% | ±50% | High variance, especially early stage |
| Gross margin | {{GROSS_MARGIN}}% | ±10 percentage points | Infrastructure costs, support costs |
| Sales cycle length | {{SALES_CYCLE}} days | ±50% | Cash flow timing, especially for enterprise |
| Net revenue retention (NRR) | {{NRR}}% | ±10 percentage points | Expansion revenue vs contraction |

### For Marketplace / Transaction Businesses

| Variable | Base Case Example | Test Range |
|----------|------------------|------------|
| Take rate | {{TAKE_RATE}}% | ±2 percentage points |
| Gross merchandise value (GMV) growth | {{GMV_GROWTH}}%/mo | ±30% |
| Buyer repeat rate | {{REPEAT_RATE}}% | ±15 percentage points |
| Seller churn | {{SELLER_CHURN}}%/mo | ±2 percentage points |
| Average order value | ${{AOV}} | ±25% |

---

## Scenario Modeling

### Three-Scenario Framework

| Scenario | Adjustment | When It Happens |
|----------|-----------|-----------------|
| **Base Case** | Your best estimate based on current data | This is what you plan around |
| **Optimistic (+30%)** | Key metrics improve by 30% | Things go right: product-market fit strengthens, marketing clicks, retention improves |
| **Pessimistic (-30%)** | Key metrics decline by 30% | Things go wrong: market downturn, competitor launch, feature doesn't land |

### Building Scenarios

Don't just apply +30%/-30% uniformly. Think about which variables move together:

```
Pessimistic scenario ("market headwinds"):
  - Growth rate: -40% (harder to acquire customers)
  - Churn: +30% (customers more price-sensitive)
  - CAC: +25% (advertising costs increase)
  - ARPU: -10% (pressure to discount)
  - Conversion rate: -20% (harder to close)

Base case ("steady execution"):
  - All variables at current observed rates
  - Modest improvements from planned initiatives

Optimistic scenario ("breakout"):
  - Growth rate: +40% (viral loop kicks in)
  - Churn: -25% (retention features ship)
  - CAC: -15% (word-of-mouth reduces paid acquisition need)
  - ARPU: +20% (new premium tier adopted)
  - Conversion rate: +15% (onboarding improvements)
```

### Scenario Output Template

```markdown
## Scenario Analysis — {{PROJECT_NAME}} — {{DATE}}

|                          | Pessimistic | Base Case | Optimistic |
|--------------------------|-------------|-----------|------------|
| **12-month revenue**     | ${{PESS_REV}} | ${{BASE_REV}} | ${{OPT_REV}} |
| **12-month customers**   | {{PESS_CUST}} | {{BASE_CUST}} | {{OPT_CUST}} |
| **Monthly burn rate**    | ${{PESS_BURN}}/mo | ${{BASE_BURN}}/mo | ${{OPT_BURN}}/mo |
| **Runway remaining**     | {{PESS_RUNWAY}} months | {{BASE_RUNWAY}} months | {{OPT_RUNWAY}} months |
| **Break-even month**     | Month {{PESS_BE}} | Month {{BASE_BE}} | Month {{OPT_BE}} |
| **CAC payback period**   | {{PESS_PAYBACK}} months | {{BASE_PAYBACK}} months | {{OPT_PAYBACK}} months |
| **LTV:CAC ratio**        | {{PESS_LTV_CAC}}:1 | {{BASE_LTV_CAC}}:1 | {{OPT_LTV_CAC}}:1 |

### Key Takeaways
- In the pessimistic case, runway shortens to {{PESS_RUNWAY}} months —
  if this happens, we must {{PESS_ACTION}} by month {{PESS_DEADLINE}}
- Break-even ranges from month {{PESS_BE}} to month {{OPT_BE}} —
  a {{RANGE}} month spread
- The biggest driver of difference between scenarios is {{BIGGEST_DRIVER}}
```

---

## Break-Even Sensitivity

### Which Variable Change Breaks Even First?

Break-even sensitivity answers: "Starting from our current trajectory, how much would each variable need to change for us to run out of money?"

```
Current runway: 18 months
Current monthly burn: $80,000
Current monthly revenue: $40,000
Monthly revenue growth: 12%

Question: What change to each variable makes runway = 0
(i.e., we never reach profitability)?

  Churn increase from 5% to 8.2%: never reach break-even
    → 3.2 percentage point change (sensitivity: HIGH)

  Growth decrease from 12% to 5%: never reach break-even
    → 7 percentage point change (sensitivity: MEDIUM)

  CAC increase from $200 to $380: never reach break-even
    → 90% increase (sensitivity: LOW)

  ARPU decrease from $50 to $35: never reach break-even
    → 30% decrease (sensitivity: MEDIUM)
```

**Interpretation:** Churn is the most sensitive variable. A relatively small change (3.2 percentage points) is enough to kill the business. Growth rate is next. CAC has the lowest sensitivity — even a large increase doesn't prevent break-even.

### Break-Even Sensitivity Template

```markdown
## Break-Even Sensitivity — {{PROJECT_NAME}}

Current state:
  Monthly revenue: ${{CURRENT_REVENUE}}
  Monthly burn: ${{CURRENT_BURN}}
  Runway: {{CURRENT_RUNWAY}} months
  Projected break-even: Month {{BREAK_EVEN_MONTH}}

Variable break-even thresholds:
  | Variable | Current | Break-even threshold | Change needed | Sensitivity |
  |----------|---------|---------------------|---------------|-------------|
  | Churn    | {{CHURN}}% | {{CHURN_THRESHOLD}}% | +{{CHURN_DELTA}}pp | {{SENSITIVITY}} |
  | Growth   | {{GROWTH}}% | {{GROWTH_THRESHOLD}}% | -{{GROWTH_DELTA}}pp | {{SENSITIVITY}} |
  | ARPU     | ${{ARPU}} | ${{ARPU_THRESHOLD}} | -{{ARPU_DELTA}}% | {{SENSITIVITY}} |
  | CAC      | ${{CAC}} | ${{CAC_THRESHOLD}} | +{{CAC_DELTA}}% | {{SENSITIVITY}} |
  | Margin   | {{MARGIN}}% | {{MARGIN_THRESHOLD}}% | -{{MARGIN_DELTA}}pp | {{SENSITIVITY}} |

Most dangerous variable: {{MOST_DANGEROUS}}
  Because: a {{SMALL/MODERATE}} change is enough to prevent break-even
  Mitigation: {{MITIGATION_PLAN}}
```

---

## Monte Carlo Simulation

### When to Use Monte Carlo

Use Monte Carlo when:
- You have more than 3-4 correlated variables
- You want a probability distribution of outcomes (not just 3 scenarios)
- You're making a high-stakes decision (fundraising amount, major pivot)
- You want to communicate uncertainty to stakeholders

Don't use Monte Carlo when:
- A simple three-scenario analysis is sufficient
- You don't have enough data to estimate probability distributions
- The audience won't understand the output

### How It Works (Conceptual)

```
Step 1: Define probability distributions for each input variable
  Churn: normal distribution, mean 5%, std dev 1.5%
  Growth: normal distribution, mean 12%, std dev 4%
  ARPU: normal distribution, mean $50, std dev $10

Step 2: Run 10,000 simulations
  Each simulation:
    - Draw a random value for each variable from its distribution
    - Calculate the outcome (12-month revenue, runway, etc.)
    - Record the result

Step 3: Analyze the distribution of outcomes
  - Median outcome: $480K (50th percentile)
  - 10th percentile: $280K (90% chance of beating this)
  - 90th percentile: $720K (10% chance of beating this)
  - Probability of reaching break-even: 72%
  - Probability of running out of money: 18%

Step 4: Communicate as confidence intervals
  "We project $480K revenue with 80% confidence it falls between $280K and $720K"
  "There is a 72% probability we reach break-even within 18 months"
  "There is an 18% probability we need additional funding"
```

### Simple Implementation

For a quick Monte Carlo analysis, use a spreadsheet or simple script:

```
For each simulation (1 to 10,000):
  churn = random_normal(mean=0.05, std=0.015)
  growth = random_normal(mean=0.12, std=0.04)
  arpu = random_normal(mean=50, std=10)

  // Clamp to reasonable bounds
  churn = max(0.01, min(0.15, churn))
  growth = max(-0.05, min(0.30, growth))
  arpu = max(20, min(100, arpu))

  // Run 12-month projection with these inputs
  revenue_12m = project_revenue(churn, growth, arpu, months=12)

  results.push(revenue_12m)

// Analyze results
sort(results)
p10 = results[1000]   // 10th percentile
p50 = results[5000]   // median
p90 = results[9000]   // 90th percentile
```

---

## Decision Triggers

### What Metric Threshold Changes Your Strategy?

Define these BEFORE you need them. When emotions are running high is not the time to decide pivoting criteria.

```markdown
## Decision Triggers — {{PROJECT_NAME}}

### Growth Triggers
  If monthly growth rate < {{MIN_GROWTH}}% for 3 consecutive months:
    → ACTION: Reassess product-market fit. Customer interviews sprint.

  If monthly growth rate > {{HIGH_GROWTH}}% for 3 consecutive months:
    → ACTION: Accelerate hiring plan. Increase marketing budget by {{INCREASE}}%.

### Churn Triggers
  If monthly churn > {{CHURN_WARNING}}% for 2 consecutive months:
    → ACTION: All hands on retention. Pause new feature development.
    → Customer exit interviews mandatory.

  If monthly churn < {{CHURN_EXCELLENT}}%:
    → ACTION: Shift focus from retention to acquisition. Increase growth spend.

### Runway Triggers
  If runway drops below 12 months:
    → ACTION: Begin fundraising process (takes 3-6 months).

  If runway drops below 6 months:
    → ACTION: Cut non-essential expenses. Reduce team to core.
    → Explore bridge financing.

  If runway drops below 3 months:
    → ACTION: Emergency mode. Revenue-generating activities only.
    → Consider acqui-hire or wind-down options.

### Unit Economics Triggers
  If LTV:CAC ratio < 1.5:1:
    → ACTION: Reduce CAC (cut expensive channels) or increase LTV
    → (improve retention, increase ARPU through upsells).

  If CAC payback > {{MAX_PAYBACK}} months:
    → ACTION: Re-evaluate pricing. Consider annual plans with discount
    → to improve upfront cash collection.

### Revenue Triggers
  If MRR reaches ${{MRR_MILESTONE}}:
    → ACTION: Trigger scale transition plan (see scale-transitions.md)
    → Hire {{ROLE}} and invest in {{INFRASTRUCTURE}}.
```

---

## Sensitivity Analysis Table Template

```markdown
## Sensitivity Analysis — {{PROJECT_NAME}} — {{DATE}}

**Base Case Outcome:** {{OUTCOME_METRIC}} = {{BASE_VALUE}}

| Variable | Base | -30% | -20% | -10% | +10% | +20% | +30% | Impact Rank |
|----------|------|------|------|------|------|------|------|-------------|
| Churn rate | {{BASE}}% | | | | | | | #{{RANK}} |
| Growth rate | {{BASE}}% | | | | | | | #{{RANK}} |
| ARPU | ${{BASE}} | | | | | | | #{{RANK}} |
| CAC | ${{BASE}} | | | | | | | #{{RANK}} |
| Conversion | {{BASE}}% | | | | | | | #{{RANK}} |
| Gross margin | {{BASE}}% | | | | | | | #{{RANK}} |

**Most sensitive variable:** {{VARIABLE}} — a {{X}}% change in {{VARIABLE}}
causes a {{Y}}% change in {{OUTCOME_METRIC}}.

**Least sensitive variable:** {{VARIABLE}} — changes have minimal impact
on {{OUTCOME_METRIC}}.

**Key insight:** {{INSIGHT}}
```

---

## Worked Example

### Scenario: Early-Stage SaaS

```
Inputs (base case):
  Starting customers: 200
  Monthly growth rate: 10% (20 new customers/month initially)
  Monthly churn rate: 5%
  ARPU: $50/month
  CAC: $200
  Monthly fixed costs: $30,000
  Current cash: $500,000

Base case 12-month projection:
  Month 12 customers: ~485
  Month 12 MRR: $24,250
  Total 12-month revenue: ~$175,000
  Total 12-month costs: ~$456,000
  Remaining cash: ~$219,000
  Runway remaining: ~7 months beyond month 12

What if churn increases from 5% to 7%?
  Month 12 customers: ~370
  Month 12 MRR: $18,500
  Total 12-month revenue: ~$145,000
  Remaining cash: ~$189,000
  Runway remaining: ~5.5 months beyond month 12

  Impact: Churn increase of 2pp → runway decrease of 1.5 months

  "If churn increases from 5% to 7%, runway decreases from
  19 months to 17.5 months — and monthly revenue at month 12
  is $5,750 lower. Over 12 months, this costs $30,000 in
  lost revenue."

What if ARPU increases from $50 to $65 (new pricing tier)?
  Total 12-month revenue: ~$227,000 (+$52K)
  Remaining cash: ~$271,000
  Runway remaining: ~9.5 months beyond month 12

  Impact: ARPU increase of $15 (30%) → runway increase of 2.5 months

  "Increasing ARPU by $15/month (a 30% increase) adds $52K
  in revenue over 12 months and extends runway by 2.5 months.
  This has more impact than reducing churn by 2 percentage points."
```

---

## Common Mistakes

### 1. Testing Variables in Isolation

**Problem:** You vary churn by +20% but don't consider that higher churn often correlates with lower growth (unhappy customers don't refer others).

**Fix:** In scenario modeling, move correlated variables together. If churn goes up, growth likely goes down.

### 2. Using Symmetric Ranges

**Problem:** Testing ±20% when the real risk is asymmetric. Churn is unlikely to drop below 2% but could easily hit 10%.

**Fix:** Use realistic ranges based on industry data and your historical variance, not arbitrary symmetric percentages.

### 3. Presenting Only the Base Case

**Problem:** Showing investors/stakeholders a single projection implies false precision.

**Fix:** Always show at minimum three scenarios. Better: show the tornado diagram so stakeholders understand which assumptions drive the most uncertainty.

### 4. Not Defining Decision Triggers

**Problem:** You do the analysis but don't define what action you'll take at each threshold.

**Fix:** Every sensitivity analysis should end with: "If X drops below Y, we will do Z." Without action triggers, the analysis is academic.

### 5. Stale Analysis

**Problem:** You run sensitivity analysis once during fundraising and never update it.

**Fix:** Re-run quarterly with actual data. Your observed churn rate at month 6 is a much better input than your month-0 guess. Update the model, re-run the scenarios, check decision triggers.
