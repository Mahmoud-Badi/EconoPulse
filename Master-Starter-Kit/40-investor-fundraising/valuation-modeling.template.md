# Valuation Modeling

> Comparable analysis, precedent transactions, DCF framework, revenue multiple benchmarks by vertical, negotiation range calculator, stage expectations, and common valuation mistakes for {{PROJECT_NAME}}. Valuation is part art, part science — this template provides the science; your negotiation skills provide the art.

---

## 1. Comparable Company Analysis

### Methodology

Identify 5-10 companies that are similar to {{PROJECT_NAME}} in stage, sector, business model, and growth rate. Compare their valuations (at the same stage you are at now) to derive a reasonable range.

### Comparable Selection Criteria

| Criterion | Weight | Notes |
|---|---|---|
| Same business model (SaaS, marketplace, etc.) | High | Revenue model comparability is essential |
| Same stage (similar revenue/traction) | High | A Series A comp is not relevant for a seed raise |
| Same vertical / sector | Medium | Vertical-specific multiples vary significantly |
| Similar growth rate | Medium | High-growth companies command premium multiples |
| Recent (within 18 months) | High | Market conditions change — stale comps are misleading |
| Similar geography | Low | Less relevant for software but matters for some sectors |

### Comparable Company Table

| Company | Stage When Raised | Revenue at Round | Growth Rate | Round Size | Pre-Money | Revenue Multiple | Date | Source |
|---|---|---|---|---|---|---|---|---|
| Comp 1 | | $ | % YoY | $ | $ | x | | |
| Comp 2 | | $ | % YoY | $ | $ | x | | |
| Comp 3 | | $ | % YoY | $ | $ | x | | |
| Comp 4 | | $ | % YoY | $ | $ | x | | |
| Comp 5 | | $ | % YoY | $ | $ | x | | |
| **Median** | | | | | | **x** | | |
| **Mean** | | | | | | **x** | | |

### Data Sources for Comparables

| Source | What You Get | Cost |
|---|---|---|
| Crunchbase | Round sizes, dates, investors | Free tier + paid |
| PitchBook | Detailed round data, multiples | $$$ (institutional) |
| CB Insights | Market maps, funding data | $$ |
| AngelList Data | Early-stage round data | Free |
| Public filings (SEC) | S-1, 10-K for public comps | Free |
| Industry newsletters | Reported round sizes and terms | Free-$ |
| Founder networks | Direct conversations with founders | Free (relationships) |

### Applying Comparables to {{PROJECT_NAME}}

```
Median Revenue Multiple from Comps: ___x
{{PROJECT_NAME}} Current ARR: $___
Implied Valuation: $___

Adjustment Factors:
  Growth Rate Premium/Discount: +/- ___%
  Market Position Premium/Discount: +/- ___%
  Team Premium/Discount: +/- ___%
  Retention/Churn Adjustment: +/- ___%

Adjusted Implied Valuation: $___
```

---

## 2. Precedent Transactions

### Methodology

Analyze recent funding rounds in your sector at your stage to understand what investors are currently paying. Focus on rounds closed within the last 12-18 months to capture current market sentiment.

### Precedent Transaction Table

| Company | Round | Date | Round Size | Valuation (Pre) | Revenue Multiple | Growth Rate | Lead Investor | Notes |
|---|---|---|---|---|---|---|---|---|
| | | | $ | $ | x | % | | |
| | | | $ | $ | x | % | | |
| | | | $ | $ | x | % | | |
| | | | $ | $ | x | % | | |
| | | | $ | $ | x | % | | |

### Market Sentiment Adjustment

| Factor | Current State | Impact on Multiples |
|---|---|---|
| Interest rates | Rising / Stable / Declining | Higher rates = lower multiples |
| VC deployment pace | Aggressive / Normal / Conservative | Aggressive = higher multiples |
| Sector heat | Hot / Warm / Cool | Hot sectors command 2-3x premium |
| Public market comps | Up / Flat / Down | Public market sentiment flows to private |
| Recent notable exits | Strong / Mixed / Weak | Strong exits raise sector enthusiasm |

---

## 3. DCF Framework

### When to Use DCF

DCF (Discounted Cash Flow) analysis is most useful for later-stage companies with predictable cash flows. For pre-seed and seed companies, DCF is generally not the primary valuation method, but understanding it helps you speak the language of sophisticated investors.

### DCF Calculation

| Year | Revenue | Growth Rate | Operating Margin | Free Cash Flow | Discount Factor | Present Value |
|---|---|---|---|---|---|---|
| Year 1 | $ | % | % | $ | | $ |
| Year 2 | $ | % | % | $ | | $ |
| Year 3 | $ | % | % | $ | | $ |
| Year 4 | $ | % | % | $ | | $ |
| Year 5 | $ | % | % | $ | | $ |
| **Terminal Value** | | | | | | **$** |
| **Enterprise Value** | | | | | | **$** |

### Key DCF Assumptions

| Assumption | Value | Basis |
|---|---|---|
| Revenue Growth Rate (Year 1-3) | % | Historical trend + market analysis |
| Revenue Growth Rate (Year 4-5) | % | Normalized growth assumption |
| Long-Term Operating Margin | % | Comparable mature companies |
| Discount Rate (WACC) | % | Stage-appropriate risk rate |
| Terminal Growth Rate | % | Typically 2-4% (GDP-like) |
| Terminal Multiple | x Revenue | Alternative to perpetuity growth |

### Discount Rate by Stage

| Stage | Typical Discount Rate | Rationale |
|---|---|---|
| Pre-Seed | 50-70% | Extreme uncertainty; product/market risk |
| Seed | 40-60% | High uncertainty; early product/market fit |
| Series A | 30-50% | Moderate uncertainty; proven model, scaling risk |
| Series B | 25-40% | Lower uncertainty; execution and competition risk |
| Growth / Pre-IPO | 15-25% | Approaching public market risk premiums |

---

## 4. Revenue Multiple Benchmarks by Vertical

### SaaS / Software

| Growth Rate | Seed Multiple | Series A Multiple | Series B Multiple | Notes |
|---|---|---|---|---|
| 3x+ YoY (>200% growth) | 80-150x ARR | 40-80x ARR | 25-50x ARR | Top-decile growth |
| 2-3x YoY (100-200% growth) | 40-80x ARR | 20-40x ARR | 15-25x ARR | Strong growth |
| 1.5-2x YoY (50-100% growth) | 20-40x ARR | 10-20x ARR | 8-15x ARR | Solid growth |
| <1.5x YoY (<50% growth) | 10-20x ARR | 5-10x ARR | 5-8x ARR | Moderate growth |

### Marketplace / Transactions

| Growth Rate | Seed Multiple | Series A Multiple | Notes |
|---|---|---|---|
| >200% GMV growth | 15-30x Revenue | 10-20x Revenue | Revenue = take rate x GMV |
| 100-200% GMV growth | 8-15x Revenue | 5-10x Revenue | |
| 50-100% GMV growth | 5-8x Revenue | 3-5x Revenue | |

### Fintech

| Growth Rate | Seed Multiple | Series A Multiple | Notes |
|---|---|---|---|
| >200% revenue growth | 40-80x Revenue | 20-40x Revenue | Premium for regulatory moats |
| 100-200% revenue growth | 20-40x Revenue | 10-20x Revenue | |
| 50-100% revenue growth | 10-20x Revenue | 5-10x Revenue | |

### Healthcare / Biotech

| Growth Rate | Seed Multiple | Series A Multiple | Notes |
|---|---|---|---|
| >200% growth | 30-60x Revenue | 15-30x Revenue | Regulatory approval = major premium |
| 100-200% growth | 15-30x Revenue | 8-15x Revenue | |
| Pre-Revenue | N/A — milestone-based | N/A | Valued on IP, clinical stage, TAM |

### Consumer / D2C

| Growth Rate | Seed Multiple | Series A Multiple | Notes |
|---|---|---|---|
| >200% revenue growth | 10-20x Revenue | 5-10x Revenue | Lower than SaaS due to margins |
| 100-200% revenue growth | 5-10x Revenue | 3-5x Revenue | |
| 50-100% revenue growth | 3-5x Revenue | 2-3x Revenue | Gross margin matters significantly |

### AI / ML

| Growth Rate | Seed Multiple | Series A Multiple | Notes |
|---|---|---|---|
| >200% growth | 100-200x ARR | 50-100x ARR | Premium for AI-native products (2024-2025) |
| 100-200% growth | 50-100x ARR | 25-50x ARR | Sector-specific premium fluctuates with hype cycle |
| 50-100% growth | 25-50x ARR | 10-25x ARR | |

**Important:** These multiples are approximate ranges based on 2023-2025 market conditions. They fluctuate with market sentiment, interest rates, and sector-specific dynamics. Always validate with current comparable data.

---

## 5. Negotiation Range Calculator

### Step 1 — Establish Your Range

| Input | Value | Source |
|---|---|---|
| {{PROJECT_NAME}} Current ARR/Revenue | $ | Actual financials |
| Growth Rate (MoM / YoY) | % | Actual financials |
| Vertical | | |
| Stage | {{FUNDRAISING_STAGE}} | |
| Applicable Multiple Range (from benchmarks above) | x - x | Section 4 |

### Step 2 — Calculate Range

```
Floor Valuation = Revenue x Low Multiple = $___
Midpoint Valuation = Revenue x Median Multiple = $___
Ceiling Valuation = Revenue x High Multiple = $___
```

### Step 3 — Apply Adjustments

| Factor | Your Assessment | Adjustment |
|---|---|---|
| Growth rate vs. benchmark | Above / At / Below | +20% / 0% / -20% |
| Retention / churn vs. benchmark | Above / At / Below | +15% / 0% / -15% |
| Team strength / founder-market fit | Exceptional / Strong / Average | +15% / 0% / -10% |
| Competitive position | Leading / Competitive / Trailing | +10% / 0% / -15% |
| Market timing / tailwinds | Strong / Neutral / Headwinds | +10% / 0% / -10% |
| Gross margin vs. benchmark | Above / At / Below | +10% / 0% / -10% |

### Step 4 — Final Negotiation Range

| Bound | Calculation | Value |
|---|---|---|
| **Walk-Away Floor** | Adjusted Floor - 10% | $ |
| **Target Low** | Adjusted Midpoint - 10% | $ |
| **Target (Anchor)** | Adjusted Midpoint | $ |
| **Target High** | Adjusted Midpoint + 15% | $ |
| **Aspirational Ceiling** | Adjusted Ceiling | $ |

**Your opening ask** should be at or slightly above your Target. Your walk-away is your Walk-Away Floor. Never anchor below your Target Low — you can always come down, but you cannot go up.

---

## 6. Stage Expectations

### What Investors Expect at Each Stage

| Stage | Revenue | Growth | Team | Product | Typical Valuation |
|---|---|---|---|---|---|
| **Pre-Seed** | $0 - $10K MRR | N/A or early signals | 1-3 founders | MVP or prototype | $2M - $6M pre-money |
| **Seed** | $0 - $50K MRR | 15-30% MoM | 3-10 people | Working product, early customers | $6M - $20M pre-money |
| **Series A** | $50K - $300K MRR | 10-20% MoM or 2-3x YoY | 10-30 people | PMF demonstrated, repeatable GTM | $20M - $80M pre-money |
| **Series B** | $300K - $1M+ MRR | 8-15% MoM or 2x+ YoY | 30-100 people | Scaling proven model | $80M - $300M pre-money |
| **Growth** | $1M+ MRR | 50-100% YoY | 100+ people | Market leader position | $300M+ pre-money |

### Pre-Revenue Valuation Factors

When there is no revenue to apply a multiple to, valuation is driven by:

| Factor | Weight | How to Demonstrate |
|---|---|---|
| Team credibility | 30% | Prior exits, domain expertise, technical depth |
| Market opportunity | 25% | TAM analysis, timing evidence, trend data |
| Technology / IP | 20% | Patent filings, technical differentiation, prototype |
| Traction signals | 15% | Waitlists, LOIs, pilot agreements, customer discovery |
| Competitive landscape | 10% | White space, barriers to entry, first-mover advantage |

---

## 7. Common Valuation Mistakes

### Mistake 1 — Anchoring on Public Market Multiples

| Error | Reality |
|---|---|
| "Snowflake trades at 30x revenue, so we should be 30x too" | Public company multiples reflect liquidity premium, scale, and profitability that private companies do not have. Apply a 50-70% discount to public market multiples for private companies. |

### Mistake 2 — Using Revenue That Does Not Exist Yet

| Error | Reality |
|---|---|
| "Our projected Year 2 revenue is $5M, so at 20x we're worth $100M" | Investors value current or near-term revenue, not projections. Forward multiples are discounted heavily — typically 30-50% of current-year multiples. |

### Mistake 3 — Ignoring Dilution Impact

| Error | Reality |
|---|---|
| "We want a $50M valuation" without considering round size | A $50M pre-money with a $10M raise means 16.7% dilution. A $50M pre-money with a $5M raise means 9.1% dilution. The valuation number matters less than the ownership percentage. |

### Mistake 4 — Vanity Valuation (Optimizing for Headline)

| Error | Reality |
|---|---|
| Accepting a very high valuation to feel good | A high valuation creates a high bar for the next round. If you raise at $50M and struggle to demonstrate $50M+ in value at the next round, you face a down round — which triggers anti-dilution provisions, damages morale, and makes future fundraising harder. |

### Mistake 5 — Not Accounting for Option Pool Dilution

| Error | Reality |
|---|---|
| Agreeing to $10M pre-money without noticing the 20% option pool | A $10M pre-money with a 20% option pool effectively values the company at $8M for existing shareholders. The option pool expansion comes out of founder equity, not investor equity. |

### Mistake 6 — Comparing Across Markets and Time Periods

| Error | Reality |
|---|---|
| "Company X raised at 100x revenue in 2021" | Market conditions in 2021 (zero interest rates, abundant capital) produced valuations that are not replicable in tighter markets. Use comps from the last 12-18 months only. |

### Mistake 7 — Ignoring Gross Margin Differences

| Error | Reality |
|---|---|
| Applying SaaS multiples to a services or hardware business | A SaaS company with 80% gross margins deserves a higher revenue multiple than a marketplace with 20% take rate or a D2C brand with 50% gross margins. Normalize for margin when comparing. |

### Mistake 8 — Letting Valuation Kill the Deal

| Error | Reality |
|---|---|
| Walking away from a great investor over a 10% valuation difference | The difference between a $10M and $12M pre-money on a $2M raise is 1.4% dilution. The difference between a great investor and a mediocre one is immeasurable. Optimize for partner quality, not valuation maximization. |

---

## Valuation Negotiation Checklist

- [ ] Comparable analysis completed with 5+ recent, relevant comparables
- [ ] Revenue multiple range identified for your vertical and growth rate
- [ ] Negotiation range calculated (floor, target, ceiling)
- [ ] Option pool impact modeled in valuation math
- [ ] Dilution scenario modeled at target valuation (see `cap-table-planning.template.md`)
- [ ] Walk-away point agreed upon by all founders
- [ ] Arguments prepared for why {{PROJECT_NAME}} deserves a premium (if applicable)
- [ ] Counter-arguments prepared for common investor pushbacks on valuation
- [ ] Legal counsel briefed on valuation expectations
- [ ] Emotional readiness: prepared to hear "your valuation is too high" without reacting defensively
