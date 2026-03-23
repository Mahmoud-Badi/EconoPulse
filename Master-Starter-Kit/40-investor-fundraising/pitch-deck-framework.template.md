# Pitch Deck Framework

> A 12-slide pitch deck structure for {{PROJECT_NAME}} with per-slide guidance, common mistakes, and speaker notes. Designed for {{FUNDRAISING_STAGE}} fundraising targeting {{INVESTOR_TYPE}} investors.

---

## 1. Title Slide

### Content

| Element | Value |
|---|---|
| Company Name | {{PROJECT_NAME}} |
| Tagline | One sentence that captures what you do and why it matters |
| Logo | High-resolution, clean background |
| Founder Name(s) | |
| Contact Email | |
| Round | {{FUNDRAISING_STAGE}} — {{SAFE_OR_PRICED}} |

### Guidance

The title slide sets the tone. Your tagline should pass the "would a stranger understand what we do?" test. Avoid jargon, buzzwords, or multi-clause sentences. If you cannot describe your company in under 10 words, you do not understand it well enough.

**Format:** Clean, minimal design. No more than 6 elements on the slide. Logo should be recognizable at thumbnail size.

### Common Mistakes

- [ ] Tagline is a feature description, not a value proposition
- [ ] Too much text — the title slide is not a summary slide
- [ ] Low-resolution logo or inconsistent branding
- [ ] Missing contact information

---

## 2. Problem

### Content

- **The Problem Statement:** What specific pain exists in the world that {{PROJECT_NAME}} addresses?
- **Who Feels This Pain:** Define the person or organization experiencing this problem (be specific — not "businesses" but "mid-market e-commerce teams with 10-50 SKUs")
- **Current Workarounds:** How do people solve this problem today? Why are those solutions inadequate?
- **Quantified Impact:** What does this problem cost in dollars, time, or opportunity?

### Structure Template

```
[Customer Persona] struggles with [Specific Problem].

Today, they solve it by [Current Workaround], which costs them
[Quantified Impact: $/time/opportunity].

This problem affects [Market Size] potential customers and is
getting worse because [Trend/Driver].
```

### Guidance

The problem slide earns you the right to talk about your solution. If the investor does not feel the pain, nothing else matters. Use real customer quotes if you have them. A single compelling anecdote is more powerful than a paragraph of abstraction.

**The "so what?" test:** After presenting the problem, ask yourself "so what?" If the answer is not obviously compelling, the problem is not big enough or not articulated well enough.

### Common Mistakes

- [ ] Problem is too vague or too broad ("communication is hard")
- [ ] Problem is a solution in disguise ("people need a better CRM")
- [ ] No evidence that the problem is real (no customer quotes, no data)
- [ ] Problem is real but too small to build a venture-scale business around
- [ ] Presenting multiple problems instead of one core problem

---

## 3. Solution

### Content

- **What {{PROJECT_NAME}} Does:** One-paragraph description in plain language
- **How It Works:** 3-step or 3-pillar framework that makes the solution easy to grasp
- **Key Differentiator:** The single thing that makes this solution fundamentally different from alternatives
- **Demo / Screenshot:** Visual proof that the product exists and works

### Structure Template

```
{{PROJECT_NAME}} [does X] for [Customer Persona] by [How It Works].

Unlike [Alternatives], we [Key Differentiator] which means
customers get [Quantified Benefit].
```

### Three-Step Framework

| Step | Action | Outcome |
|---|---|---|
| 1 | [User Action] | [Immediate Result] |
| 2 | [Product Action] | [Value Delivered] |
| 3 | [Outcome] | [Business Impact] |

### Guidance

Resist the urge to list every feature. The solution slide should make the investor think "that's clever" or "why doesn't this exist already?" Focus on the insight — the non-obvious reason your approach works.

**Show, don't tell:** A screenshot or product demo is worth 100 words. If your product is visual, show it. If it is not visual, show the output or the user experience.

### Common Mistakes

- [ ] Feature dump instead of solution narrative
- [ ] No visual proof the product exists
- [ ] Solution does not clearly address the problem from Slide 2
- [ ] Technical jargon that obscures the value
- [ ] Overcomplicating the explanation — if it takes 3 minutes to explain, simplify

---

## 4. Market Size (TAM / SAM / SOM)

### Content

| Market Layer | Definition | {{PROJECT_NAME}} Value | Source |
|---|---|---|---|
| **TAM** (Total Addressable Market) | Total revenue opportunity if 100% market share | $ | |
| **SAM** (Serviceable Addressable Market) | Segment you can realistically reach with current product/GTM | $ | |
| **SOM** (Serviceable Obtainable Market) | Market share you can capture in 3-5 years | $ | |

### Bottom-Up Calculation (Preferred)

```
Number of target customers: ___
x Average contract value: $___
x Addressable percentage: ___%
= SAM: $___
```

### Top-Down Calculation (Supporting)

```
Total market size (from analyst report): $___
x Relevant segment percentage: ___%
= TAM: $___
```

### Guidance

Investors want to see a bottom-up calculation, not just a top-down number pulled from a Gartner report. The bottom-up approach shows you understand your customer and can do basic math. Top-down is supporting evidence, not the primary case.

**The "so what?" filter:** A $50B TAM means nothing if your SAM is $50M and your SOM is $5M. Be honest about what you can realistically capture. A believable $500M SAM is better than an inflated $10B TAM.

### Common Mistakes

- [ ] Only showing TAM without SAM/SOM breakdown
- [ ] Using top-down numbers without bottom-up validation
- [ ] TAM that is obviously too large ("the global healthcare market is $8T")
- [ ] No sources cited for market data
- [ ] Confusing adjacent markets with your actual market

---

## 5. Business Model

### Content

- **Revenue Model:** How you make money (subscription, transaction fee, marketplace take rate, etc.)
- **Pricing Structure:** Tier structure and price points
- **Unit Economics:** Key metrics that prove the business model works

### Unit Economics Table

| Metric | Current Value | Target (12 months) | Benchmark |
|---|---|---|---|
| Average Contract Value (ACV) | $ | $ | |
| Customer Acquisition Cost (CAC) | $ | $ | |
| Lifetime Value (LTV) | $ | $ | |
| LTV:CAC Ratio | | | >3:1 |
| Gross Margin | % | % | >70% (SaaS) |
| Payback Period | months | months | <18 months |
| Net Revenue Retention | % | % | >100% |

### Guidance

The business model slide answers "how does this become a real business?" Show that you have thought deeply about pricing, unit economics, and scalability. If you are pre-revenue, show your pricing hypothesis and the assumptions behind it.

<!-- IF {{FUNDRAISING_STAGE}} == "pre-seed" -->
**Pre-Seed Note:** Unit economics may be theoretical at this stage. That is acceptable, but show your assumptions clearly and explain how you will validate them.
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "seed" -->
**Seed Note:** Early unit economics should be visible even if imperfect. Show directional data — even from 10-20 customers — to prove the model can work.
<!-- ENDIF -->

### Common Mistakes

- [ ] No clear revenue model — "we will figure out monetization later"
- [ ] Unrealistic unit economics (LTV:CAC of 20:1 with no data)
- [ ] Missing key metrics (no CAC, no churn, no gross margin)
- [ ] Pricing that does not match the customer segment

---

## 6. Traction

### Content

Present the strongest evidence that {{PROJECT_NAME}} is working. Choose metrics that are relevant to your stage and model.

### Metrics by Stage

<!-- IF {{FUNDRAISING_STAGE}} == "pre-seed" -->
| Metric | Value | Trend |
|---|---|---|
| Waitlist / Sign-ups | | |
| LOIs / Pre-orders | | |
| Pilot Customers | | |
| Customer Discovery Interviews | | |
| Prototype Usage Data | | |
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "seed" -->
| Metric | Value | Trend |
|---|---|---|
| MRR / ARR | $ | |
| Active Customers | | |
| MoM Revenue Growth | % | |
| Retention Rate (cohort) | % | |
| NPS / CSAT | | |
| Pipeline Value | $ | |
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "series-a" -->
| Metric | Value | Trend |
|---|---|---|
| ARR | $ | |
| Net Revenue Retention | % | |
| Gross Margin | % | |
| CAC Payback Period | months | |
| Logo Retention | % | |
| Revenue Growth Rate (YoY) | % | |
<!-- ENDIF -->

### Traction Chart

Include a chart showing growth over time. The best traction slides have a single chart that goes "up and to the right" with a clear inflection point you can narrate.

### Customer Logos

If you have recognizable customers, show 4-8 logos. If your customers are not recognizable, use anonymized case studies with quantified outcomes.

### Guidance

This is the "proof" slide. Everything before it was narrative; this is evidence. If you do not have strong traction, be honest and frame what you have as validation signals rather than growth metrics.

### Common Mistakes

- [ ] Vanity metrics (registered users, page views) instead of business metrics
- [ ] No time dimension — showing a number without trend
- [ ] Cherry-picking the best cohort while hiding overall averages
- [ ] Cumulative charts that hide flattening growth
- [ ] No context for the numbers (is 200 customers good or bad for your market?)

---

## 7. Product

### Content

- **Product Screenshots / Demo:** 2-3 screens that show the core experience
- **Technology Differentiation:** What is technically hard about what you have built?
- **Product Roadmap:** High-level 3-6 month roadmap showing next major capabilities
- **Moat / Defensibility:** Network effects, data advantages, switching costs, IP

### Product Roadmap

| Quarter | Theme | Key Deliverables | Impact |
|---|---|---|---|
| Current | | | |
| Next | | | |
| Q+2 | | | |

### Guidance

Show the product, do not describe it. If possible, do a live demo instead of screenshots. The product slide should make the investor want to use it.

The defensibility discussion matters more at later stages. At pre-seed, it is acceptable to say "our moat will come from [data/network effects/brand] as we scale."

### Common Mistakes

- [ ] No product visuals — just text describing features
- [ ] Roadmap is a laundry list instead of strategic themes
- [ ] No defensibility story — "we will outexecute" is not a moat
- [ ] Over-promising on the roadmap without acknowledging what's speculative

---

## 8. Team

### Content

| Team Member | Role | Relevant Background | Why This Team |
|---|---|---|---|
| Founder 1 | CEO | | |
| Founder 2 | CTO | | |
| Key Hire 1 | | | |
| Key Hire 2 | | | |
| Advisor 1 | | | |

### Team Narrative

Answer the fundamental investor question: **Why is this the team to solve this problem?**

- **Founder-Market Fit:** What about the founders' experience makes them uniquely qualified?
- **Completeness:** Does the team cover product, technology, and go-to-market?
- **Gaps & Plan:** What key hires will you make with this capital?

### Key Hires Plan

| Role | Why Critical | Timeline | Budget Impact |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

### Guidance

Investors back teams, not ideas. The team slide is often the most important slide for pre-seed and seed investors. Show domain expertise, execution track record, and complementary skills.

### Common Mistakes

- [ ] Listing impressive titles without explaining relevance
- [ ] No founder-market fit narrative
- [ ] Ignoring obvious team gaps (no technical co-founder, no sales experience)
- [ ] Too many advisors, not enough operators

---

## 9. Go-to-Market Strategy

### Content

- **Primary Acquisition Channel:** The one channel you are betting on first
- **Sales Motion:** Self-serve, inside sales, field sales, or hybrid
- **Customer Segments:** Priority ordering of segments to attack
- **Partnership Strategy:** Key distribution partnerships, if applicable

### GTM Phases

| Phase | Timeline | Channel | Target | Goal |
|---|---|---|---|---|
| 1 — Prove | Months 1-6 | | | Validate conversion rate and CAC |
| 2 — Scale | Months 7-12 | | | Predictable acquisition at target CAC |
| 3 — Expand | Months 13-18 | | | Multi-channel acquisition |

### Guidance

The GTM slide separates founders who think about distribution from those who think "build it and they will come." Show that you have a specific, testable plan — not a wish list of every possible channel.

### Common Mistakes

- [ ] Listing every possible channel instead of prioritizing
- [ ] No customer acquisition cost estimate
- [ ] "Viral growth" as the primary channel without evidence
- [ ] No sales motion clarity — is this self-serve or enterprise sales?

---

## 10. Competition

### Content

Present a competitive landscape that shows you understand the market and have a defensible position.

### Competitive Matrix

| Feature / Capability | {{PROJECT_NAME}} | Competitor A | Competitor B | Competitor C | Status Quo |
|---|---|---|---|---|---|
| [Dimension 1] | | | | | |
| [Dimension 2] | | | | | |
| [Dimension 3] | | | | | |
| [Dimension 4] | | | | | |
| Pricing | | | | | |
| Target Segment | | | | | |

### Positioning Statement

```
For [Target Customer] who [Need/Pain],
{{PROJECT_NAME}} is a [Category] that [Key Benefit].
Unlike [Primary Alternative], we [Key Differentiator].
```

### Guidance

Never say "we have no competitors." The status quo (doing nothing, using spreadsheets, manual processes) is always a competitor. Show that you understand the landscape deeply and have a differentiated position that is not just "we do everything better."

**The 2x2 matrix trap:** Avoid the classic 2x2 where you conveniently land in the upper-right quadrant. Investors have seen it thousands of times and it signals shallow competitive analysis.

### Common Mistakes

- [ ] "We have no competitors" (immediately disqualifying)
- [ ] 2x2 matrix with convenient positioning
- [ ] Dismissing competitors instead of acknowledging their strengths
- [ ] No mention of the status quo as a competitor
- [ ] Feature comparison without strategic positioning

---

## 11. Financials

### Content

| Metric | Year 1 | Year 2 | Year 3 | Assumptions |
|---|---|---|---|---|
| Revenue | $ | $ | $ | |
| Cost of Revenue | $ | $ | $ | |
| Gross Profit | $ | $ | $ | |
| Gross Margin | % | % | % | |
| Operating Expenses | $ | $ | $ | |
| Net Income / (Loss) | $ | $ | $ | |
| Cash Burn (Monthly) | $ | $ | $ | |
| Headcount | | | | |

### Key Assumptions

| Assumption | Value | Basis |
|---|---|---|
| Customer growth rate | | |
| Average deal size | $ | |
| Churn rate | % | |
| Sales cycle length | days | |
| Gross margin | % | |

### Guidance

Financial projections in a pitch deck are a communication tool, not a forecast. They show how you think about the business, what your assumptions are, and whether the opportunity can reach venture scale.

Show 3-year projections. Be prepared to defend every assumption. The numbers matter less than the logic behind them.

### Common Mistakes

- [ ] Hockey-stick projections with no basis
- [ ] Missing key assumptions — numbers without logic
- [ ] Projections that do not connect to the business model slide
- [ ] Ignoring the path to profitability entirely
- [ ] Over-precision — projecting to the dollar in Year 3 is a red flag

---

## 12. The Ask

### Content

| Element | Value |
|---|---|
| Raising | {{TARGET_RAISE_AMOUNT}} |
| Instrument | {{SAFE_OR_PRICED}} |
| Valuation | {{PRE_MONEY_VALUATION}} (pre-money) |
| Runway | {{CURRENT_RUNWAY_MONTHS}} months at projected burn |
| Round Status | [% committed, lead investor status] |

### Use of Funds

| Category | Allocation | Purpose |
|---|---|---|
| Engineering / Product | % | |
| Sales / Marketing | % | |
| Operations / G&A | % | |
| Buffer / Contingency | 10-15% | Unexpected costs and timeline slippage |

### Milestones This Capital Will Fund

| Milestone | Timeline | Metric |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Guidance

The Ask slide should be specific and confident. State what you are raising, at what terms, and what you will accomplish with the capital. Tie the milestones directly to what will make the company fundable for the next round.

**Round status matters:** If you have a lead investor or commitments, mention it. Social proof accelerates decision-making.

### Common Mistakes

- [ ] Vague ask — "we are raising $1-3M" (pick a number)
- [ ] No use of funds breakdown
- [ ] Milestones that are outputs (hire 5 engineers) instead of outcomes (reach $100K MRR)
- [ ] No connection between capital deployed and milestones achieved

---

## 13. Appendix

### Content (Include as Backup Slides)

- [ ] Detailed financial model (link to spreadsheet)
- [ ] Customer case studies with quantified outcomes
- [ ] Detailed competitive analysis
- [ ] Technical architecture overview
- [ ] Founder bios (extended)
- [ ] Market research sources and methodology
- [ ] Cohort analysis charts
- [ ] Sales pipeline detail
- [ ] Product roadmap detail
- [ ] Cap table summary (current)
- [ ] Key risks and mitigations

### Guidance

The appendix is not presented — it exists for Q&A. When an investor asks a deep question, you pull up the relevant appendix slide. Having a thorough appendix signals preparedness and depth of thinking.

---

## Deck Design Guidelines

| Principle | Guideline |
|---|---|
| **Slide Count** | 12-15 slides (excluding appendix). Under 20 minutes presentation time. |
| **Text Density** | Maximum 30 words per slide. Use visuals and charts instead of paragraphs. |
| **Font Size** | Minimum 24pt for body text, 36pt for headers. If you cannot read it from 10 feet away, it is too small. |
| **Color Palette** | Maximum 3 colors plus black/white. Consistent with brand. |
| **Data Visualization** | Every data point should be in a chart, not a bullet. Label axes. |
| **Consistency** | Same layout grid, font hierarchy, and color usage throughout. |
| **File Format** | PDF for sending, Google Slides / PowerPoint / Keynote for presenting. |

---

## Pre-Send Checklist

- [ ] Every slide passes the "so what?" test
- [ ] No slide has more than 30 words of body text
- [ ] All charts are labeled with units and time periods
- [ ] Spell-check and grammar review completed
- [ ] Company name and logo are consistent throughout
- [ ] Contact information is on the title and final slide
- [ ] PDF version is under 10MB
- [ ] Tested on both projector and laptop screen
- [ ] Three people outside the company have reviewed it for clarity
- [ ] All financial numbers are consistent across slides
