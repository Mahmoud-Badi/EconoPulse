# Pricing Financial Analysis — {{PROJECT_NAME}}

> Translates pricing decisions into financial outcomes. Pricing strategy (Section 19) defines what you charge. This template models what happens to revenue, margin, cash flow, and growth when you change those prices, adjust tier structures, offer discounts, or gate features differently.

---

## Revenue Per Tier Modeling

### Current Tier Mix

| Tier | Monthly Price | Annual Price (monthly equiv.) | Expected % of Customers | Expected Customers (Mo 12) | Monthly Revenue | % of Total Revenue |
|------|-------------|------------------------------|------------------------|---------------------------|----------------|-------------------|
| Free | $0 | $0 | ___% | ___ | $0 | 0% |
| Tier 1: ___ | $___ | $___ | ___% | ___ | $___ | ___% |
| Tier 2: ___ | $___ | $___ | ___% | ___ | $___ | ___% |
| Tier 3: ___ | $___ | $___ | ___% | ___ | $___ | ___% |
| Enterprise / Custom | $___ | $___ | ___% | ___ | $___ | ___% |
| **Total** | | | **100%** | **___** | **$___** | **100%** |

### Blended ARPU

```
Blended ARPU = Sum(Tier Price x Tier Customer %) for all paid tiers
            = ($__ x __%) + ($__ x __%) + ($__ x __%) + ($__ x __%)
            = $___
```

---

## Tier Mix Optimization

What happens to revenue if the customer distribution across tiers shifts?

### Scenario: More Enterprise, Less Self-Serve

| Tier | Current Mix | Shifted Mix | Current Revenue (1000 customers) | Shifted Revenue (1000 customers) | Delta |
|------|-----------|-----------|--------------------------------|--------------------------------|-------|
| Tier 1 | ___% | ___% (-10%) | $___ | $___ | $___ |
| Tier 2 | ___% | ___% (flat) | $___ | $___ | $___ |
| Tier 3 | ___% | ___% (+5%) | $___ | $___ | $___ |
| Enterprise | ___% | ___% (+5%) | $___ | $___ | $___ |
| **Total** | | | **$___** | **$___** | **$___** |
| **Blended ARPU** | **$___** | **$___** | | | |

### Scenario: More Self-Serve, Less Enterprise

| Tier | Current Mix | Shifted Mix | Current Revenue (1000 customers) | Shifted Revenue (1000 customers) | Delta |
|------|-----------|-----------|--------------------------------|--------------------------------|-------|
| Tier 1 | ___% | ___% (+15%) | $___ | $___ | $___ |
| Tier 2 | ___% | ___% (+5%) | $___ | $___ | $___ |
| Tier 3 | ___% | ___% (-10%) | $___ | $___ | $___ |
| Enterprise | ___% | ___% (-10%) | $___ | $___ | $___ |
| **Total** | | | **$___** | **$___** | **$___** |
| **Blended ARPU** | **$___** | **$___** | | | |

### Key Insight

Moving ___ percentage points from Tier 1 to Enterprise changes monthly revenue by $___. This is why sales-assisted enterprise motion, while more expensive per customer, dramatically changes the revenue equation.

---

## Price Elasticity Estimation Framework

Price elasticity measures how sensitive demand is to price changes. Perfect data requires A/B testing at scale; this framework helps estimate before you have that data.

### Elasticity Categories

| Elasticity | Meaning | Typical Product Type |
|-----------|---------|---------------------|
| **Inelastic** (0 to -0.5) | Demand barely changes with price increases | Mission-critical tools, no alternatives, high switching costs |
| **Moderate** (-0.5 to -1.0) | Demand decreases proportionally to price increases | Most B2B SaaS, established categories |
| **Elastic** (-1.0 to -2.0) | Demand drops significantly with price increases | Consumer apps, many alternatives, low switching costs |
| **Highly elastic** (< -2.0) | Small price increases cause large demand drops | Commoditized products, price-comparison shoppers |

### Estimated Impact of Price Changes

| Price Change | Estimated Demand Change | Revenue Impact | Net Effect |
|-------------|------------------------|---------------|-----------|
| -20% (price cut) | +___% more customers | $___ less per customer | Net: +/- $___/month |
| -10% | +___% more customers | $___ less per customer | Net: +/- $___/month |
| No change | Baseline | Baseline | Baseline |
| +10% | -___% fewer customers | $___ more per customer | Net: +/- $___/month |
| +20% | -___% fewer customers | $___ more per customer | Net: +/- $___/month |
| +50% | -___% fewer customers | $___ more per customer | Net: +/- $___/month |

### Price Sensitivity Indicators

Check these signals from your market to estimate where you fall:

| Signal | Your Answer | Suggests |
|--------|------------|---------|
| Do users ask about pricing before signing up? | Yes / No | Elastic if yes |
| Do competitor prices influence signups? | Yes / No | Elastic if yes |
| Has a price increase caused visible churn? | Yes / No | Elastic if yes |
| Do enterprise customers negotiate price? | Yes / No | Moderate — they care but will pay for value |
| Is your product a "must have" or "nice to have"? | ___ | Inelastic if must-have |
| Do users have free alternatives? | Yes / No | More elastic if yes |
| How high are switching costs? | Low / Med / High | Less elastic if switching costs are high |

---

## Discount Impact Modeling

### Annual Billing Discount

Offering a discount for annual commitment affects cash flow, churn, and effective revenue.

**If you offer ___% annual discount:**

| Metric | Monthly Billing | Annual Billing | Impact |
|--------|----------------|---------------|--------|
| Price per month | $___ | $___ (discounted) | -$___/mo effective |
| Cash collected upfront | $___ | $___ (12x discounted monthly) | +$___ upfront |
| Effective monthly revenue | $___ | $___ | -___% |
| Expected churn (monthly) | ___% | ___% (typically 50-70% lower) | Lower churn |
| Expected lifespan | ___ months | ___ months | Longer lifespan |
| LTV (monthly customer) | $___ | N/A | |
| LTV (annual customer) | N/A | $___ | Often higher despite discount |
| **Net LTV impact** | | | **+/- $___** |

### Annual Billing Financial Impact (Portfolio Level)

| Metric | 100% Monthly | 50/50 Split | 100% Annual |
|--------|-------------|-----------|------------|
| Monthly revenue (100 customers) | $___ | $___ | $___ |
| Cash collected in month 1 | $___ | $___ | $___ |
| Annual revenue | $___ | $___ | $___ |
| Expected annual churn | ___% | ___% | ___% |
| Year-end active customers | ___ | ___ | ___ |
| Year-end MRR | $___ | $___ | $___ |

### Volume Discount / Seat Discount

| Seats | Per-Seat Price | Discount from List | Monthly Total | Revenue per Seat |
|-------|-------------|-------------------|-------------|-----------------|
| 1-5 | $___ | 0% | $___ | $___ |
| 6-10 | $___ | ___% | $___ | $___ |
| 11-25 | $___ | ___% | $___ | $___ |
| 26-50 | $___ | ___% | $___ | $___ |
| 51-100 | $___ | ___% | $___ | $___ |
| 100+ | $___ | ___% | $___ | $___ |

---

## Per-Seat vs Flat-Rate Comparison Calculator

### Per-Seat Model

```
Revenue = Number of Seats x Price per Seat
Growth driver: Seat expansion within existing accounts
```

| Account Size (Seats) | Price/Seat | Monthly Revenue | Gross Margin per Account |
|---------------------|-----------|----------------|------------------------|
| 1 (solo) | $___ | $___ | ___% |
| 5 (small team) | $___ | $___ | ___% |
| 10 (department) | $___ | $___ | ___% |
| 50 (organization) | $___ | $___ | ___% |
| 200 (enterprise) | $___ | $___ | ___% |

### Flat-Rate Model

```
Revenue = Number of Accounts x Flat Price
Growth driver: New account acquisition
```

| Flat Rate Tier | Monthly Price | Expected Avg Team Size | Effective Price/Seat | Gross Margin |
|---------------|-------------|----------------------|---------------------|-------------|
| Starter | $___ | ___ seats | $___ | ___% |
| Team | $___ | ___ seats | $___ | ___% |
| Business | $___ | ___ seats | $___ | ___% |

### Side-by-Side Revenue Comparison (1000 total users)

| Model | Scenario | Revenue | Pros | Cons |
|-------|----------|---------|------|------|
| Per-seat @ $___/seat | 1000 seats across 200 accounts | $___ | Scales with usage, natural expansion | Price objection at large teams, Shadow IT risk |
| Flat-rate | 200 accounts at avg $___/mo | $___ | Predictable, simple pricing | No expansion revenue within accounts, subsidizes large teams |

---

## Usage-Based Revenue Projection

For products with consumption-based pricing (API calls, storage, compute, credits).

### Consumption Growth Curves

| Customer Segment | Month 1 Usage | Month 3 Usage | Month 6 Usage | Month 12 Usage (mature) | Revenue at Mature |
|-----------------|--------------|--------------|--------------|------------------------|------------------|
| Small / individual | ___ units | ___ units | ___ units | ___ units | $___ |
| Mid-market | ___ units | ___ units | ___ units | ___ units | $___ |
| Enterprise | ___ units | ___ units | ___ units | ___ units | $___ |

### Usage-Based Revenue Model

| Month | Total Customers | Avg Units/Customer | Total Units | Price/Unit | Revenue | MoM Growth |
|-------|----------------|-------------------|-------------|-----------|---------|-----------|
| 1 | ___ | ___ | ___ | $___ | $___ | — |
| 3 | ___ | ___ | ___ | $___ | $___ | ___% |
| 6 | ___ | ___ | ___ | $___ | $___ | ___% |
| 9 | ___ | ___ | ___ | $___ | $___ | ___% |
| 12 | ___ | ___ | ___ | $___ | $___ | ___% |

### Revenue Predictability Challenge

Usage-based models have inherently variable revenue. Mitigate with:

| Strategy | Impact on Predictability | Impact on Revenue |
|----------|------------------------|------------------|
| Minimum committed spend | High — guaranteed base | May lower total (discounted rate) |
| Pre-purchased credits | High — cash upfront | Moderate — unused credits = pure margin |
| Hybrid (base + usage) | Medium — base is predictable | Higher — captures both floor and upside |
| Usage-based only | Low — fully variable | Highest ceiling but unpredictable |

---

## Feature-Gating Revenue Impact

What happens financially when you move a feature from one tier to another?

### Moving a Feature from Free to Paid

**Feature: ___**

| Metric | Before (feature is free) | After (feature is paid) | Change |
|--------|--------------------------|------------------------|--------|
| Free tier usage of this feature | ___% of free users | 0% | |
| Free user satisfaction/NPS impact | ___ | ___ (estimated drop) | |
| Free-to-paid conversion rate | ___% | ___% (estimated increase) | +___% points |
| Additional paid conversions per month | — | ___ | |
| Additional MRR | — | $___ | |
| Free user churn increase | — | ___% of free users leave | |
| Lost viral/referral value | — | $___ estimated | |
| **Net monthly revenue impact** | | | **$___** |

### Moving a Feature from Pro to Starter

**Feature: ___**

| Metric | Before (Pro only) | After (also in Starter) | Change |
|--------|-------------------|------------------------|--------|
| Pro -> Starter downgrades | — | ___ per month (estimated) | |
| Revenue lost from downgrades | — | $___ | |
| New Starter signups (feature attracts) | — | ___ per month | |
| Revenue gained from new Starter | — | $___ | |
| Starter -> Pro upgrades (later) | — | ___ per month | |
| Revenue gained from later upgrades | — | $___ | |
| **Net monthly revenue impact** | | | **$___** |

### Feature-Gating Decision Matrix

| Feature | Current Tier | Move To | Conversion Impact | Revenue Impact | Churn Impact | Decision |
|---------|-------------|---------|-------------------|---------------|-------------|----------|
| ___ | Free | Starter | +___% | +$___ | +___% free churn | |
| ___ | Starter | Pro | +___% | +$___ | +___% Starter churn | |
| ___ | Pro | Starter | -___% downgrades | -$___ | -___% Starter churn | |
| ___ | All Paid | Free | -___% | -$___ | Improves free acquisition | |

---

## Price Increase Modeling

### Grandfathering Strategy

| Strategy | Description | Revenue Impact | Churn Impact |
|----------|-----------|---------------|-------------|
| **No grandfathering** | All customers get new price immediately | Maximum revenue, maximum churn risk | Expect 5-15% incremental churn |
| **6-month grace period** | Existing customers have 6 months at old price | Delayed revenue, moderate churn | Expect 3-8% incremental churn |
| **12-month grace period** | Existing customers have 12 months | Significantly delayed revenue, low churn | Expect 1-3% incremental churn |
| **Permanent grandfathering** | Existing customers keep old price forever | No impact on existing, only new customers | Zero incremental churn |
| **Partial increase** | Existing customers get 50% of the increase | Moderate revenue, moderate churn | Expect 2-5% incremental churn |

### Price Increase Financial Model

**Proposed change: $___/mo -> $___/mo (___% increase)**

| Metric | Before | After (no grandfathering) | After (with grandfathering) |
|--------|--------|--------------------------|---------------------------|
| ARPU (new customers) | $___ | $___ | $___ |
| ARPU (existing customers) | $___ | $___ | $___ (unchanged) |
| Blended ARPU | $___ | $___ | $___ |
| Expected churn from increase | — | ___% one-time | 0% |
| Customers lost | — | ___ | 0 |
| Revenue lost from churn | — | $___ | $0 |
| Revenue gained from increase | — | $___ | $___ (new only) |
| **Net revenue impact (month 1)** | | **$___** | **$___** |
| **Net revenue impact (month 12)** | | **$___** | **$___** |

---

## Pricing Model Comparison Summary

| Model | Revenue Predictability | Expansion Revenue | Customer Friction | Best For |
|-------|----------------------|------------------|-------------------|----------|
| Flat monthly/annual | High | Low | Low | Simple products, solo users |
| Per-seat | High | High (seat growth) | Medium | Collaboration tools, team products |
| Usage-based | Low | High (usage growth) | Low (pay as you go) | API products, infrastructure |
| Hybrid (base + usage) | Medium | High | Medium | Complex products with variable usage |
| Tiered feature gates | High | Medium (tier upgrades) | Medium | Products with clear feature tiers |
| Credits / tokens | Medium | High | Low | AI products, marketplace credits |

---

## Cross-References

- **Pricing strategy decisions**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Revenue projection**: `25-financial-modeling/revenue-projection.template.md`
- **Break-even analysis**: `25-financial-modeling/break-even-analysis.template.md`
- **Freemium modeling**: `25-financial-modeling/freemium-trial-conversion-modeling.template.md`
- **Unit economics**: `25-financial-modeling/unit-economics-calculator.template.md`
