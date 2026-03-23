# Investor Metrics Dashboard — {{PROJECT_NAME}}

> The single-page view of every metric an investor will ask about. Contains definitions, current values, targets, and stage-appropriate benchmarks. If you are raising money — or even thinking about it — this dashboard should be updated monthly and ready to share at any time.

---

## Core SaaS / Subscription Metrics

| Metric | Definition | Current | Target | Benchmark (Seed) | Benchmark (Series A) |
|--------|-----------|---------|--------|-----------------|---------------------|
| **MRR** | Monthly Recurring Revenue | $___ | $___ | $10K-50K | $50K-200K |
| **ARR** | MRR x 12 | $___ | $___ | $120K-600K | $600K-2.4M |
| **MRR Growth (MoM)** | (This month MRR - Last month MRR) / Last month MRR | ___% | ___% | 15-25% | 10-15% |
| **Revenue Growth (YoY)** | (This year ARR - Last year ARR) / Last year ARR | ___% | ___% | N/A (too early) | 2-3x |
| **Gross Margin** | (Revenue - COGS) / Revenue | ___% | ___% | >60% | >70% |
| **Net Revenue Retention (NRR)** | (Start MRR + Expansion - Contraction - Churn) / Start MRR | ___% | ___% | >90% | >100% |
| **Gross Revenue Retention (GRR)** | (Start MRR - Contraction - Churn) / Start MRR | ___% | ___% | >80% | >85% |
| **Logo Churn (monthly)** | Customers lost / Starting customers | ___% | ___% | <5% | <3% |
| **Revenue Churn (monthly)** | MRR lost / Starting MRR | ___% | ___% | <7% | <5% |
| **CAC** | Total S&M spend / New customers acquired | $___ | $___ | Varies | <1/3 LTV |
| **LTV** | (ARPU x Gross Margin) / Monthly churn rate | $___ | $___ | >3x CAC | >3x CAC |
| **LTV:CAC Ratio** | LTV / CAC | ___:1 | ___:1 | >3:1 | >3:1 |
| **CAC Payback Period** | CAC / (ARPU x Gross Margin) | ___ mo | ___ mo | <18 months | <12 months |
| **Burn Rate (net)** | Monthly expenses - Monthly revenue | $___ | $___ | Varies | Varies |
| **Runway** | Cash / Net monthly burn | ___ mo | ___ mo | >12 months | >18 months |
| **DAU/MAU Ratio** | Daily active users / Monthly active users | ___% | ___% | >20% | >30% |
| **Activation Rate** | Users who reach "aha moment" / Total signups | ___% | ___% | >30% | >40% |

---

## Rule of 40

The Rule of 40 is the gold standard for balancing growth and profitability. It states that a healthy SaaS company's revenue growth rate plus profit margin should exceed 40%.

```
Rule of 40 Score = Revenue Growth Rate (%) + Profit Margin (%)
```

| Component | Your Value |
|-----------|-----------|
| Annual revenue growth rate | ___% |
| Operating profit margin (or EBITDA margin) | ___% |
| **Rule of 40 Score** | **___** |

### Interpretation

| Score | Assessment | Typical Company Profile |
|-------|-----------|----------------------|
| > 60 | **Elite** | Top decile of public SaaS; high growth + profitable |
| 40 - 60 | **Excellent** | Strong business; attractive to investors at any stage |
| 25 - 40 | **Good** | Solid fundamentals; typical for growth-stage companies |
| 10 - 25 | **Needs work** | Either grow faster or become more efficient |
| < 10 | **Concerning** | Neither growing fast nor profitable — re-evaluate strategy |

### Stage-Appropriate Application

- **Pre-revenue / Seed**: Rule of 40 does not apply. Focus on growth rate alone.
- **Post-revenue / Series A**: Growth rate dominates. A company growing 100% YoY with -60% margin still scores 40.
- **Series B+**: Balance matters. Growth deceleration must be offset by margin improvement.
- **Late stage / IPO**: Market expects a clear path to profitability. Score <40 is a red flag.

---

## Quick Ratio (SaaS)

Measures the efficiency of MRR growth by comparing additions to losses.

```
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)
```

| Component | Value |
|-----------|-------|
| New MRR (this month) | $___ |
| Expansion MRR (this month) | $___ |
| **Total MRR Additions** | **$___** |
| Contraction MRR (this month) | $___ |
| Churned MRR (this month) | $___ |
| **Total MRR Losses** | **$___** |
| **Quick Ratio** | **___** |

### Quick Ratio Benchmarks

| Quick Ratio | Assessment | What It Signals |
|------------|-----------|----------------|
| > 4.0 | **Excellent** | Very efficient growth; low churn relative to acquisition |
| 2.0 - 4.0 | **Good** | Healthy growth engine; sustainable trajectory |
| 1.0 - 2.0 | **Concerning** | Churning almost as much as you add; a leaky bucket |
| < 1.0 | **Danger** | Losing more MRR than you gain; business is shrinking |

### Monthly Quick Ratio Trend

| Month | New MRR | Expansion MRR | Contraction MRR | Churned MRR | Quick Ratio |
|-------|---------|--------------|----------------|-------------|-------------|
| 1 | $___ | $___ | $___ | $___ | ___ |
| 2 | $___ | $___ | $___ | $___ | ___ |
| 3 | $___ | $___ | $___ | $___ | ___ |
| 4 | $___ | $___ | $___ | $___ | ___ |
| 5 | $___ | $___ | $___ | $___ | ___ |
| 6 | $___ | $___ | $___ | $___ | ___ |

---

## Net Revenue Retention (NRR) Deep Dive

NRR is arguably the single most important metric for SaaS businesses. It answers: "If we acquired zero new customers, would revenue still grow?"

```
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR x 100
```

| Quarter | Starting MRR | + Expansion | - Contraction | - Churn | Ending MRR | NRR |
|---------|-------------|------------|--------------|---------|-----------|-----|
| Q1 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q2 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q3 | $___ | $___ | $___ | $___ | $___ | ___% |
| Q4 | $___ | $___ | $___ | $___ | $___ | ___% |
| **Annual** | | | | | | **___**% |

### NRR Benchmarks by Category

| Category | NRR Range | Examples |
|----------|----------|---------|
| **Best-in-class** | >130% | Snowflake (158%), Twilio (131%), Datadog (130%) |
| **Excellent** | 120-130% | Most top-tier SaaS at scale |
| **Good** | 100-120% | Healthy expansion offsetting churn |
| **Acceptable (early stage)** | 90-100% | Some churn, limited expansion motion |
| **Concerning** | <90% | Revenue shrinking from existing customers |

### Improving NRR Levers

| Lever | Current | Target | Action |
|-------|---------|--------|--------|
| Reduce logo churn | ___% | ___% | Better onboarding, customer success |
| Reduce revenue churn (downgrades) | ___% | ___% | Value delivery at each tier |
| Increase expansion (upsells) | ___% | ___% | Usage-based pricing, seat expansion |
| Increase expansion (cross-sells) | ___% | ___% | Additional product lines |

---

## Monthly Investor Update Template

Send this to investors (and your board, if applicable) monthly. Consistency builds trust.

### Format: 5 Key Bullets + Metrics Table + Asks

```markdown
Subject: {{PROJECT_NAME}} — [Month Year] Investor Update

Hi [Name],

Here is the [Month] update for {{PROJECT_NAME}}:

**TL;DR: [One sentence summary — honest about both wins and challenges]**

1. **Revenue**: MRR is $[X], [up/down] [X]% from last month. [Brief context.]
2. **Growth**: Added [X] new customers this month. [Main acquisition channel and why.]
3. **Product**: [Biggest product milestone — feature launch, major release, technical achievement.]
4. **Challenge**: [Be honest about the biggest challenge or risk. Investors respect transparency.]
5. **Next Month**: [Top 1-2 priorities for the next 30 days.]

### Key Metrics

| Metric | Last Month | This Month | Change | Target |
|--------|-----------|-----------|--------|--------|
| MRR | $[X] | $[X] | [X]% | $[X] |
| Customers | [X] | [X] | [X]% | [X] |
| MoM Growth | [X]% | [X]% | | [X]% |
| Churn (logo) | [X]% | [X]% | | <[X]% |
| CAC | $[X] | $[X] | | $[X] |
| Runway | [X] mo | [X] mo | | >[X] mo |
| Cash Balance | $[X] | $[X] | | |

### Asks

- [Specific ask 1: intro to a potential customer, advisor, hire, etc.]
- [Specific ask 2: feedback on a decision, pricing change, etc.]

Best,
[Founder Name]
```

### Investor Update Best Practices

- Send on the same day each month (e.g., first Monday)
- Keep it under 500 words — investors read dozens of these
- Be honest about bad news — they will find out eventually
- Include specific asks — investors want to help but need direction
- Track who opens the email and who responds (tools: Cabal, Visible, DocSend)

---

## Pitch Deck Financial Slide Guide

What VCs look for on your financial slide(s):

### Slide 1: Traction & Metrics (if post-revenue)

**Must include:**
- MRR or ARR with growth trend (graph showing last 6-12 months)
- MoM or YoY growth rate
- Customer count and growth
- One engagement metric (DAU/MAU, NRR, or activation rate)

**Common mistakes:**
- Showing cumulative revenue instead of MRR (hides churn)
- Showing total signups instead of active paying customers
- Using a compressed Y-axis to exaggerate growth
- Not labeling axes or time periods

### Slide 2: Unit Economics

**Must include:**
- LTV:CAC ratio with actual numbers
- Payback period
- Gross margin
- CAC trend (showing it is stable or declining)

**What VCs will ask:**
- "How did you calculate LTV?" (Have Method 1, 2, or 3 ready)
- "What is CAC by channel?" (Know your best and worst channels)
- "How does LTV change by cohort?" (Have cohort data ready)

### Slide 3: Financial Projections (if asked)

**Must include:**
- 3-year revenue projection (conservative and base case)
- Path to profitability or next fundraise
- Key assumptions clearly stated
- Use of funds breakdown (how this raise gets spent)

**What VCs will challenge:**
- "Why do you assume X% growth?" (Back it up with channel capacity or comparable companies)
- "When do you become profitable?" (Know your break-even analysis)
- "What happens if growth is 50% of plan?" (Have your conservative scenario ready)

---

## Metrics by Company Stage

Use this to prioritize which metrics to track based on your current stage:

### Pre-Product (Idea / MVP)

| Priority | Metric | Why |
|----------|--------|-----|
| 1 | Waitlist signups | Demand validation |
| 2 | User interviews completed | Problem validation |
| 3 | Burn rate | How long you can search for PMF |

### Pre-Revenue (Product Launched, No Paying Customers)

| Priority | Metric | Why |
|----------|--------|-----|
| 1 | Active users (DAU/WAU) | Engagement signal |
| 2 | Activation rate | Product delivering value |
| 3 | User growth rate | Organic demand |
| 4 | Burn rate & runway | Survival |

### Early Revenue ($0-$10K MRR)

| Priority | Metric | Why |
|----------|--------|-----|
| 1 | MRR and MRR growth | Revenue traction |
| 2 | Churn rate | Retention signal |
| 3 | Activation → Paid conversion | Funnel efficiency |
| 4 | Burn rate & runway | Time to find PMF |

### Growth Stage ($10K-$100K MRR)

| Priority | Metric | Why |
|----------|--------|-----|
| 1 | MRR growth rate | Trajectory |
| 2 | NRR | Expansion + retention health |
| 3 | LTV:CAC | Unit economics |
| 4 | CAC payback period | Cash efficiency |
| 5 | Quick Ratio | Growth quality |
| 6 | Gross margin | Business viability |

### Scale Stage ($100K+ MRR)

| Priority | Metric | Why |
|----------|--------|-----|
| 1 | ARR and growth rate | Scale |
| 2 | Rule of 40 | Growth + efficiency balance |
| 3 | NRR | Best-in-class indicator |
| 4 | Gross margin | Approaching IPO-readiness |
| 5 | Magic Number | Sales efficiency |
| 6 | Burn multiple | Capital efficiency |

---

## Burn Multiple

A newer metric gaining adoption among growth investors. Measures how much cash you burn to generate each dollar of net new ARR.

```
Burn Multiple = Net Burn / Net New ARR
```

| Quarter | Net Burn | Net New ARR | Burn Multiple |
|---------|----------|------------|--------------|
| Q1 | $___ | $___ | ___ |
| Q2 | $___ | $___ | ___ |
| Q3 | $___ | $___ | ___ |
| Q4 | $___ | $___ | ___ |

### Burn Multiple Benchmarks

| Burn Multiple | Assessment |
|--------------|-----------|
| < 1.0x | **Amazing** — generating more ARR than you burn |
| 1.0 - 1.5x | **Great** — very capital efficient |
| 1.5 - 2.0x | **Good** — typical for well-run startups |
| 2.0 - 3.0x | **Concerning** — high burn relative to growth |
| > 3.0x | **Bad** — inefficient; investors will push back |

---

## Cross-References

- **Unit economics detail**: `25-financial-modeling/unit-economics-calculator.template.md`
- **Revenue projections**: `25-financial-modeling/revenue-projection.template.md`
- **Burn rate tracking**: `25-financial-modeling/runway-burn-rate.template.md`
- **Break-even analysis**: `25-financial-modeling/break-even-analysis.template.md`
- **Pricing strategy**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Board deck templates**: `35-business-intelligence/executive-reporting/board-deck-templates.template.md` — stage-gated board deck framework and investor update cadence
- **MRR waterfall actuals**: `35-business-intelligence/executive-reporting/mrr-arr-waterfall.template.md` — tracks actual MRR movements (new, expansion, contraction, churn) against projections
- **Cohort analysis**: `35-business-intelligence/executive-reporting/cohort-analysis.template.md` — validates LTV projections with actual cohort retention and revenue data
- **Data infrastructure**: `35-business-intelligence/data-warehouse-architecture.template.md` — how financial data flows from billing system to warehouse to dashboards
- **Unified metrics registry**: `35-business-intelligence/metrics-hub/unified-metrics-registry.template.md` — all financial metrics mapped with canonical definitions
