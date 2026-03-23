# Board Deck Templates

> **Owner:** {{STAKEHOLDER_CEO}} / {{STAKEHOLDER_CFO}}
> **Cadence:** {{BI_BOARD_CADENCE}}
> **Last updated:** {{CURRENT_DATE}}
> **Project:** {{PROJECT_NAME}}

---

## Purpose

This template provides a structured, stage-gated board presentation framework that scales from pre-revenue startups through Series B+ companies. Every slide has a defined purpose, required data sources, visualization guidance, and narrative structure so that board meetings produce decisions, not confusion.

---

## Table of Contents

1. [12-Slide Board Deck Framework](#1-12-slide-board-deck-framework)
2. [Stage-Gated Variants](#2-stage-gated-variants)
3. [Monthly Investor Update Template](#3-monthly-investor-update-template)
4. [Quarterly Deep-Dive Addendum](#4-quarterly-deep-dive-addendum)
5. [Annual Review Structure](#5-annual-review-structure)
6. [Board Meeting Cadence & Logistics](#6-board-meeting-cadence--logistics)
7. [Appendix: Data Source Cross-References](#7-appendix-data-source-cross-references)

---

## 1. 12-Slide Board Deck Framework

### Design Principles

- **Every slide answers one question.** If it answers two, split it.
- **Lead with the insight, not the chart.** The slide title IS the takeaway (e.g., "MRR grew 12% driven by enterprise expansion" not "MRR Dashboard").
- **Red/yellow/green status on every metric.** Board members scan; make it scannable.
- **Appendix is unlimited.** Keep the main deck to 12 slides. Every supplementary table, edge case, or deep-dive goes in the appendix.
- **No surprises.** If something is bad, the board should hear it from you before the meeting.

---

### Slide 1: Executive Summary

**Purpose:** Give the board the entire story in 60 seconds. If they read nothing else, this slide tells them whether the company is on track.

**Required Content:**
| Element | Description | Source |
|---|---|---|
| One-line company status | "On track" / "At risk" / "Course correction needed" with one-sentence rationale | CEO judgment |
| Top 3 highlights | Most material positive developments this period | Cross-deck |
| Top 3 concerns | Most material risks or misses | Cross-deck |
| Key ask(s) | What the board needs to decide or approve this meeting | CEO |
| Cash position summary | Months of runway remaining, burn rate trend direction | Section 25 `runway-burn-rate.template.md` |
| Period-over-period headline metric | The single metric that best captures company trajectory | Varies by stage (see Stage-Gated Variants) |

**Visualization:**
- No charts on this slide. Bullet points and bold numbers only.
- Use a traffic-light icon (green/yellow/red) next to each highlight and concern.
- Cash runway as a single bold number with trend arrow (up/down/flat).

**Narrative Guidance:**
- Write this slide LAST, after all other slides are complete.
- The "one-line status" must be honest. Boards lose trust when this slide says green and slide 9 reveals a crisis.
- Asks should be specific: "Approve $X budget for Y" not "Discuss strategy."

**Common Mistakes:**
- Burying bad news in slide 9 while the summary says "great quarter."
- Including too many highlights (keep to 3 — force prioritization).
- Vague asks: "We'd love your input on hiring" is not actionable.

---

### Slide 2: Product Metrics

**Purpose:** Show whether users find the product valuable and whether that value is growing.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| DAU / WAU / MAU | Active users by period (define "active" explicitly) | Section 20 analytics |
| DAU/MAU ratio | Engagement stickiness indicator | Calculated |
| Activation rate | % of signups completing activation milestone | Section 20 `post-launch-metrics-dashboard.template.md` |
| Feature adoption | Top 3 features by adoption %, any new feature launch metrics | Section 20 |
| Retention curve | D1/D7/D30/D90 retention by cohort | `cohort-analysis.template.md` (this section) |
| NPS / CSAT | Latest score with trend | Section 33 `feedback-collection-system.template.md` |
| Power user ratio | % of users hitting "power user" threshold | Section 20 |

**Visualization:**
- Line chart: DAU/MAU trend over 6 months with target line overlay.
- Small multiples: Retention curves for last 3 monthly cohorts (highlight improvement or degradation).
- Bar chart: Feature adoption rates, sorted descending.

**Narrative Guidance:**
- Always compare to previous period AND to target/plan.
- If retention improved, explain what drove it (feature launch, onboarding change, bug fix).
- If a new feature launched, show early adoption data even if it's preliminary.

**Common Mistakes:**
- Showing vanity metrics (total signups) without activation/retention context.
- Not defining "active" — DAU means nothing if "active" = "loaded the page."
- Presenting retention without cohort segmentation (blended retention hides trends).

---

### Slide 3: Revenue & Growth

**Purpose:** Show the revenue trajectory and whether growth is accelerating, sustaining, or decelerating.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| MRR / ARR | Current monthly and annualized recurring revenue | `mrr-arr-waterfall.template.md` |
| MRR waterfall | New + Expansion + Reactivation - Contraction - Churn | `mrr-arr-waterfall.template.md` |
| Month-over-month growth rate | MRR growth % | Calculated |
| Revenue by plan/tier | Breakdown by pricing tier | Section 30 billing |
| ARPU / ARPA | Average revenue per user/account, trend | `unit-economics-dashboard.template.md` |
| Pipeline value | Weighted pipeline for next 90 days | Section 19 `sales-funnel.template.md` |
| Bookings vs revenue | New bookings this period vs recognized revenue | Section 25 |

**Visualization:**
- Waterfall chart: MRR movements (the centerpiece — see `mrr-arr-waterfall.template.md` for spec).
- Line chart: MoM growth rate trend with 3-month moving average.
- Stacked bar: Revenue by plan tier over time.

**Narrative Guidance:**
- Growth rate trend matters more than absolute growth rate. Is it accelerating?
- Always explain the largest MRR movement category. If expansion drove growth, why? New pricing? Upsell motion?
- If growth decelerated, acknowledge it and present the plan to re-accelerate.

**Common Mistakes:**
- Showing ARR growth without breaking out the waterfall components.
- Ignoring seasonality when comparing months.
- Mixing bookings and revenue (these are different numbers for different audiences).

---

### Slide 4: Unit Economics

**Purpose:** Demonstrate that the business model works at the unit level and is improving over time.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| CAC | Blended and by channel | `unit-economics-dashboard.template.md` |
| LTV | By cohort, by plan, by segment | `unit-economics-dashboard.template.md` |
| LTV:CAC ratio | Target > 3:1 | Calculated |
| CAC payback period | Months to recover CAC | `unit-economics-dashboard.template.md` |
| Gross margin | % and trend | `multi-product-pl.template.md` |
| Net Revenue Retention | Trailing 12-month NRR | `unit-economics-dashboard.template.md` |
| Quick Ratio | (New + Expansion) / (Contraction + Churn) | `unit-economics-dashboard.template.md` |

**Visualization:**
- Dual-axis chart: LTV:CAC ratio (bar) with CAC payback period (line) over time.
- Cohort LTV curves: Actual vs projected for last 4 quarterly cohorts.
- Trend sparklines for each metric showing 6-month direction.

**Narrative Guidance:**
- If LTV:CAC < 3:1, explain the path to improvement (reduce CAC? increase retention? increase ARPU?).
- Show unit economics by segment if they vary significantly (e.g., enterprise LTV:CAC may be excellent while SMB is underwater).
- Connect to strategic decisions: "We're investing in channel X because its CAC is 40% lower."

**Common Mistakes:**
- Using blended CAC when channel-level CAC varies widely.
- Projecting LTV from immature cohorts without flagging the uncertainty.
- Ignoring gross margin — an LTV:CAC of 5:1 with 20% gross margin is actually 1:1 on a contribution basis.

---

### Slide 5: Market & Competition

**Purpose:** Position the company within its market and show competitive awareness without paranoia.

**Required Content:**
| Element | Description | Source |
|---|---|---|
| TAM / SAM / SOM | Updated market sizing with methodology notes | Section 13 `market-research.template.md` |
| Market share estimate | Current penetration of SAM | Calculated |
| Competitive landscape | 2x2 matrix or feature comparison (max 5 competitors) | Section 13 |
| Win/loss analysis | Win rate trend, top reasons for wins and losses | Section 19 sales data |
| Market trends | 2-3 trends affecting the market this quarter | Industry research |
| Regulatory changes | Any regulatory developments affecting the market | `regulatory-reporting.template.md` |

**Visualization:**
- 2x2 positioning matrix (axes relevant to your market, e.g., ease-of-use vs completeness).
- Win/loss waterfall: deals won vs lost by reason category.
- Market share pie chart (only if data is reliable; otherwise skip).

**Narrative Guidance:**
- Be honest about where competitors are ahead. Boards respect self-awareness.
- Focus on the 1-2 competitive dynamics that matter most, not an exhaustive list.
- Connect market trends to your strategy: "Trend X validates our investment in Y."

**Common Mistakes:**
- Claiming a massive TAM without a credible SAM/SOM funnel.
- Dismissing competitors the board knows are strong.
- Spending too much time here — this slide should be informational, not the main event.

---

### Slide 6: Customer Health

**Purpose:** Show that existing customers are healthy, expanding, and advocating.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| Logo churn rate | % of customers lost this period | `mrr-arr-waterfall.template.md` |
| Revenue churn rate | % of MRR lost (net and gross) | `mrr-arr-waterfall.template.md` |
| NPS / CSAT trend | Score and response rate over time | Section 33 |
| Customer health score distribution | % green/yellow/red | Section 20 |
| Top 10 accounts status | Health indicator for largest accounts | Account management |
| Expansion pipeline | Upsell/cross-sell opportunities in flight | Section 19 |
| Case studies / testimonials | New logos willing to be references | Marketing |

**Visualization:**
- Stacked bar: Customer health score distribution over time (should be getting greener).
- Table: Top 10 accounts with health indicator, MRR, contract renewal date, expansion opportunity.
- Trend line: Logo churn and revenue churn side-by-side.

**Narrative Guidance:**
- If you lost a notable customer, explain why proactively.
- Show net revenue retention prominently — this is the single best indicator of customer health.
- Highlight any "saves" — customers who were at risk and were retained.

**Common Mistakes:**
- Hiding churn by only showing net numbers.
- Not tracking health scores and waiting for churn to surface problems.
- Presenting CSAT without response rate (5.0 CSAT from 3 responses is meaningless).

---

### Slide 7: Team & Hiring

**Purpose:** Show that the team is growing according to plan and that organizational health is strong.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| Headcount | Current vs plan, by department | HR / Finance |
| Open roles | Count, time-to-fill average, critical unfilled positions | Recruiting |
| Attrition | Voluntary and involuntary, trailing 12-month | HR |
| Employee engagement | Latest pulse survey score, participation rate | HR |
| Key hires | Notable additions this period | Recruiting |
| Departures | Notable departures and impact mitigation | HR |
| Diversity metrics | Gender, ethnicity breakdown by level (if tracked) | HR |
| Revenue per employee | Efficiency metric, trend | Calculated |
| Burn per employee | Total burn / headcount | Section 25 |

**Visualization:**
- Stacked area: Headcount by department over time with plan overlay.
- Funnel: Recruiting pipeline (applications → screens → interviews → offers → acceptances).
- Single number callouts: Attrition rate, eNPS, revenue per employee.

**Narrative Guidance:**
- If you're behind on hiring, explain the bottleneck (pipeline? compensation? speed?).
- Notable departures should be addressed directly — boards will ask anyway.
- Revenue per employee should be trending up as the company scales.

**Common Mistakes:**
- Not tracking attrition by department (engineering attrition matters more than company-wide averages).
- Ignoring recruiting velocity — 15 open roles means nothing without time-to-fill context.
- Presenting headcount growth without connecting to revenue efficiency.

---

### Slide 8: Engineering & Technical

**Purpose:** Show that the engineering team is shipping effectively and that technical foundations are sound.

**Required Content:**
| Metric | Definition | Source |
|---|---|---|
| Deployment frequency | Deploys per day/week | `departmental-dashboards.template.md` (Engineering) |
| Lead time for changes | Commit to production time | DORA metrics |
| Change failure rate | % of deployments causing incidents | DORA metrics |
| Mean time to recovery | Average incident resolution time | Section 21 `incident-response-runbook.template.md` |
| Uptime / availability | SLA compliance | Section 20 |
| Tech debt index | Quantified technical debt score | Engineering |
| Sprint velocity trend | Story points completed per sprint, 6-sprint trend | Engineering |
| Security posture | Open vulnerabilities by severity, pen test results | Section 08 `SECURITY-AUDIT-CHECKLIST.md` |

**Visualization:**
- DORA metrics quadrant: 4 metrics in a 2x2 grid with trend arrows and industry benchmark comparison.
- Uptime timeline: Monthly uptime with SLA line.
- Tech debt burn-down: Planned vs actual debt reduction.

**Narrative Guidance:**
- Frame DORA metrics in business terms: "We ship 3x per day, meaning customer-reported bugs are fixed within hours, not weeks."
- If there was a major incident, summarize the RCA and preventive measures.
- Tech debt is a strategic choice — explain the tradeoff, don't apologize for it.

**Common Mistakes:**
- Presenting velocity without context (velocity is team-specific, not comparable across teams).
- Ignoring availability — boards care about this more than engineering metrics.
- Not connecting engineering metrics to customer/business outcomes.

---

### Slide 9: Risks & Mitigations

**Purpose:** Demonstrate that leadership is aware of risks and is actively managing them. This slide builds trust.

**Required Content:**
| Element | Description |
|---|---|
| Risk register | Top 5 risks ranked by likelihood x impact |
| For each risk | Description, likelihood (H/M/L), impact (H/M/L), mitigation plan, owner, status |
| New risks | Risks identified this period that weren't on the register before |
| Resolved risks | Risks from previous periods that have been mitigated |
| External risks | Macro/market/regulatory risks outside company control |
| Dependencies | Key vendor, partner, or technology dependencies and their risk profile |

**Visualization:**
- Risk matrix: 3x3 grid (likelihood vs impact) with risks plotted as numbered circles.
- Risk trend: Is the overall risk profile improving or degrading vs last period?
- Table: Risk register with columns for each attribute above.

**Narrative Guidance:**
- Honesty is the ONLY option here. Understating risks destroys board trust.
- For each risk, the mitigation plan must be specific and have an owner.
- Show progress: risks that were high last quarter and are now medium demonstrate effective management.

**Common Mistakes:**
- Listing risks without mitigations (this is just a worry list, not risk management).
- Only listing external risks (boards want to see you're managing internal risks too).
- Being so comprehensive that the slide has 20 risks (top 5, the rest go in the appendix).

---

### Slide 10: Strategic Asks

**Purpose:** Get decisions made. Every board meeting should produce at least one decision.

**Required Content:**
| Element | Description |
|---|---|
| Ask #1-3 | Specific asks, each with: context, options considered, recommendation, financial impact |
| Decision required | Yes/No and by when |
| Supporting data | Cross-reference to relevant slides |
| Downside of inaction | What happens if we don't decide |

**Visualization:**
- No charts. This is a decision slide.
- Use a decision matrix if comparing options (criteria as rows, options as columns, scored 1-5).
- Bold the recommended option.

**Narrative Guidance:**
- Frame asks as choices, not open-ended questions. "Should we enter market X?" is bad. "We recommend entering market X because of A, B, C — we need board approval for $Y investment" is good.
- Limit to 3 asks maximum. If you have more, prioritize.
- Pre-wire: Board members should NOT see these asks for the first time in the meeting. Send them in advance.

**Common Mistakes:**
- Asking for "input" or "guidance" instead of a specific decision.
- Not quantifying the financial impact of each option.
- Bringing more than 3 asks (the board will context-switch and nothing gets decided).

---

### Slide 11: Financial Projections

**Purpose:** Show the forward-looking financial plan and how actuals are tracking against it.

**Required Content:**
| Element | Description | Source |
|---|---|---|
| Revenue forecast | Next 3/6/12 months, actuals vs plan | Section 25 `revenue-projection.template.md` |
| Expense forecast | By category, actuals vs budget | Section 25 `runway-burn-rate.template.md` |
| Cash flow projection | Monthly projected cash position | Section 25 |
| Runway | Months remaining at current burn, months at planned burn | Section 25 `runway-burn-rate.template.md` |
| Key assumptions | Growth rate, hiring plan, major expenditures | Finance |
| Scenario analysis | Base / bull / bear cases with key drivers | Section 25 |
| Fundraising timeline | If applicable: when, how much, at what terms | CEO / CFO |

**Visualization:**
- Area chart: Cash position over next 12 months with scenario bands (bull/base/bear).
- Dual bar chart: Revenue actuals vs plan, expense actuals vs budget.
- Runway countdown: Bold single number with trend arrow.

**Narrative Guidance:**
- Always show plan vs actual variance and explain significant deviations.
- If runway is < 12 months, this should be the loudest item on the slide.
- Scenario analysis should have clearly stated assumptions that differ between cases.

**Common Mistakes:**
- Hockey stick projections without credible drivers.
- Not updating the forecast with latest actuals (showing January's plan in March).
- Hiding burn rate increases behind absolute revenue growth.

---

### Slide 12: Appendix

**Purpose:** Provide supporting detail for any question that might arise during the meeting, without cluttering the main deck.

**Required Content:**
| Element | Description |
|---|---|
| Detailed financial statements | Full P&L, balance sheet summary, cash flow statement |
| Cohort deep-dives | Full retention matrices, LTV curves by segment |
| Competitive detail | Detailed feature comparison, pricing analysis |
| Product roadmap | Next 2 quarters with confidence levels |
| Customer case studies | 2-3 customer stories with metrics |
| Team org chart | Current structure with open positions highlighted |
| Detailed risk register | Full register beyond top 5 |
| Previous action items | Status of asks/decisions from last board meeting |

**Narrative Guidance:**
- Organize the appendix with a table of contents so board members can navigate during Q&A.
- Pre-populate answers to questions you expect. If expansion MRR jumped, include the per-account breakdown.
- Include the previous meeting's action items with status updates — this demonstrates follow-through.

---

## 2. Stage-Gated Variants

### Pre-Revenue Stage (Pre-Seed / Accelerator)

**Headline metric:** Weekly active users or engagement metric (not revenue).

**Slide modifications:**
| Slide | Modification |
|---|---|
| Slide 3: Revenue & Growth | Replace with **Traction & Engagement**: signups, activation rate, engagement frequency, waitlist size, viral coefficient |
| Slide 4: Unit Economics | Replace with **Economics Hypothesis**: projected CAC based on experiments, projected LTV based on engagement data, willingness-to-pay survey results |
| Slide 5: Market & Competition | Emphasize TAM credibility and differentiation thesis over win/loss data |
| Slide 6: Customer Health | Replace with **User Feedback**: qualitative feedback themes, NPS from early users, feature requests ranked by frequency |
| Slide 11: Financial Projections | Emphasize runway and milestones to next fundraise, not revenue forecasting |

**What investors care about at this stage:**
1. Is there a real problem worth solving? (Evidence of pain)
2. Are early users engaged? (Not just signing up — coming back)
3. Can this team execute? (Velocity of shipping, quality of decisions)
4. How long until we need more money? (Runway)

---

### Seed / Series A Stage

**Headline metric:** MRR growth rate (month-over-month).

**Slide modifications:**
| Slide | Modification |
|---|---|
| Slide 3: Revenue & Growth | Full MRR waterfall, but emphasize growth rate over absolute numbers |
| Slide 4: Unit Economics | Show early unit economics even if imprecise; highlight improving trend |
| Slide 7: Team & Hiring | Emphasize key hires that unlock next growth phase |
| Slide 8: Engineering & Technical | Focus on shipping velocity and product-market fit iteration speed |
| Slide 11: Financial Projections | Show path to Series A/B milestones: what metrics at what timeline |

**What investors care about at this stage:**
1. Is there product-market fit? (Retention, NPS, organic growth)
2. Are unit economics directionally positive? (Not perfect, but improving)
3. Can this growth rate be sustained or accelerated? (Channel diversification)
4. What's the next inflection point? (Feature, market, or go-to-market unlock)

---

### Series B+ Stage

**Headline metric:** Net Revenue Retention (NRR) and Rule of 40 score.

**Slide modifications:**
| Slide | Modification |
|---|---|
| Slide 3: Revenue & Growth | Full waterfall with segment-level detail; emphasize efficiency metrics |
| Slide 4: Unit Economics | Full unit economics with segment cuts; LTV:CAC by channel, Burn Multiple |
| Slide 5: Market & Competition | Detailed win/loss with competitive displacement data |
| Slide 7: Team & Hiring | Organizational design, management layer effectiveness, span of control |
| Slide 8: Engineering & Technical | Platform scalability, reliability at scale, DORA benchmarks vs industry |
| Slide 11: Financial Projections | Path to profitability, Rule of 40 trajectory, IPO/exit readiness indicators |

**What investors care about at this stage:**
1. Is growth efficient? (Burn Multiple < 2x, improving)
2. Is the revenue base durable? (NRR > 120%, GRR > 85%)
3. Can the organization scale? (Management depth, process maturity)
4. What's the path to profitability or exit? (Unit economics at scale)

---

## 3. Monthly Investor Update Template

### Format: Email (Not a Deck)

Send monthly investor updates via email. They should take 5 minutes to read. Investors who want detail will follow up.

**Cadence:** Send within 5 business days of month-end close.

---

### Section 1: Highlights (3-5 bullets)

```
## Highlights

- [Biggest win of the month — be specific with numbers]
- [Second biggest win]
- [Third win or notable customer/product milestone]
- [Team win if relevant — key hire, culture milestone]
```

**Guidance:**
- Lead with the most impressive metric or milestone.
- Be specific: "Closed 12 new customers (vs 8 last month, 50% MoM increase)" not "Great month for sales."
- If there genuinely aren't highlights, don't fabricate them. A short list is fine.

---

### Section 2: Key Metrics (Table Format)

```
## Key Metrics

| Metric | This Month | Last Month | MoM Change | Plan |
|---|---|---|---|---|
| MRR | $XXX,XXX | $XXX,XXX | +X% | $XXX,XXX |
| New Customers | XX | XX | +X% | XX |
| Logo Churn | X.X% | X.X% | — | < X% |
| NRR (trailing) | XXX% | XXX% | — | > XXX% |
| Cash | $X.XM | $X.XM | -$XXK | — |
| Runway | XX mo | XX mo | — | — |
| Team Size | XX | XX | +X | XX |
```

**Guidance:**
- Keep the metric list to 7-10 max. Investors scan this in 30 seconds.
- Always include MRR, churn, cash, and runway. Everything else is stage-dependent.
- Show plan/target so investors can see whether you're on track.

---

### Section 3: Challenges (2-3 bullets)

```
## Challenges

- [Honest description of biggest challenge, what you're doing about it]
- [Second challenge with mitigation]
- [Optional: external challenge — market, regulatory, competitive]
```

**Guidance:**
- Be honest. Investors who hear about problems early can help. Investors surprised by problems lose trust.
- Every challenge must have a "what we're doing about it" component.
- Don't list more than 3 — prioritize.

---

### Section 4: Asks (1-3 specific requests)

```
## Asks

- [Specific ask: intro to [person/company], hiring referral for [role], feedback on [strategy]]
- [Second ask if applicable]
```

**Guidance:**
- This is the most underused section. Investors WANT to help — give them specific ways to do so.
- "Intros to enterprise buyers in financial services" is actionable. "Help with sales" is not.
- If you have no asks, still include the section: "No specific asks this month. Will reach out if anything comes up."

---

### Section 5: Next Month Preview

```
## Looking Ahead

- [What you're focused on next month]
- [Key milestone or launch expected]
- [Upcoming decision point]
```

**Guidance:**
- This creates continuity between updates. Investors can follow the narrative month to month.
- Be realistic about what will actually happen. Don't over-promise.

---

## 4. Quarterly Deep-Dive Addendum

Quarterly, supplement the board deck with deeper analysis on a rotating topic. Each quarter, go deep on ONE area.

### Rotating Deep-Dive Schedule

| Quarter | Deep-Dive Topic | Key Content |
|---|---|---|
| Q1 | Annual Strategy & OKRs | Year-in-review, OKR results, next year strategy, updated competitive landscape |
| Q2 | Product & Technology | Product roadmap deep-dive, architecture review, tech debt assessment, build/buy/partner decisions |
| Q3 | Go-to-Market | Channel analysis, sales motion effectiveness, marketing ROI, pricing review, expansion strategy |
| Q4 | Financial & Operational | Full-year financial review, unit economics deep-dive, operational efficiency, budget planning |

### Deep-Dive Template Structure

```markdown
# [Topic] Quarterly Deep-Dive — Q[X] {{CURRENT_YEAR}}

## Executive Summary (1 page)
- Key findings
- Recommendations
- Decisions needed

## Current State Assessment (2-3 pages)
- Data and analysis
- Benchmarks and comparisons
- Trend analysis (YoY, QoQ)

## Strategic Options (1-2 pages)
- Option A: [description, pros, cons, investment required]
- Option B: [description, pros, cons, investment required]
- Option C: [description, pros, cons, investment required]
- Recommendation with rationale

## Implementation Plan (1 page)
- Timeline
- Resource requirements
- Key milestones
- Risk factors

## Appendix
- Supporting data tables
- Methodology notes
- External research references
```

---

## 5. Annual Review Structure

### Annual Board Meeting Agenda (Full Day)

| Time Block | Topic | Duration | Presenter |
|---|---|---|---|
| Morning Session | | | |
| 9:00-9:30 | Year in Review: Key Metrics & Milestones | 30 min | CEO |
| 9:30-10:15 | Financial Review: Full-Year Results & Audit | 45 min | CFO |
| 10:15-10:30 | Break | 15 min | |
| 10:30-11:30 | Strategy Review: Market, Competition, Positioning | 60 min | CEO + CRO |
| 11:30-12:00 | Product & Technology: Roadmap & Architecture | 30 min | CTO/CPO |
| 12:00-1:00 | Lunch (informal board-management interaction) | 60 min | |
| Afternoon Session | | | |
| 1:00-1:45 | Go-to-Market: Sales, Marketing, Customer Success | 45 min | CRO/CMO |
| 1:45-2:30 | Team & Organization: Culture, Hiring, Development | 45 min | CEO/CHRO |
| 2:30-2:45 | Break | 15 min | |
| 2:45-3:45 | Next Year Plan: OKRs, Budget, Fundraising | 60 min | CEO + CFO |
| 3:45-4:30 | Strategic Discussion: Open Forum | 45 min | Board |
| 4:30-5:00 | Closed Session (Board only) | 30 min | Board |

### Annual Deck Additions (Beyond Monthly 12-Slide)

1. **Year-over-year metric comparison:** All key metrics, current year vs prior year.
2. **OKR scorecard:** Every company-level OKR with final score and retrospective.
3. **Competitive landscape evolution:** How the market changed over 12 months.
4. **Organizational chart:** Current org with planned additions for next year.
5. **3-year strategic plan update:** Refresh of long-range plan with latest assumptions.
6. **Board effectiveness self-assessment:** Optional but valuable — what's working, what's not in board governance.

---

## 6. Board Meeting Cadence & Logistics

### Cadence: {{BI_BOARD_CADENCE}}

| Activity | Timing | Owner |
|---|---|---|
| Board deck first draft | T-10 business days before meeting | CEO + department leads |
| CFO financial review | T-7 business days | CFO |
| CEO final review | T-5 business days | CEO |
| Deck sent to board | T-3 business days | CEO / EA |
| Pre-meeting 1:1s (optional) | T-2 to T-1 days | CEO with each board member |
| Board meeting | T | Full board |
| Minutes distributed | T+2 business days | Secretary / EA |
| Action item follow-up | T+5 business days | CEO |
| Monthly investor update | 5 business days after month-end | CEO |

### Pre-Meeting Prep Checklist

- [ ] All slides have current data (no stale numbers from last month's pull)
- [ ] Financial data reconciled with accounting system
- [ ] Slide titles are insights, not labels
- [ ] Asks are specific and pre-wired with at least one board member
- [ ] Appendix includes answers to anticipated questions
- [ ] Previous meeting's action items have status updates
- [ ] Deck sent to board 3 business days in advance
- [ ] CEO has rehearsed the narrative flow (not reading slides)

---

## 7. Appendix: Data Source Cross-References

| Deck Slide | Primary Data Source | Template Cross-Reference |
|---|---|---|
| Slide 1: Executive Summary | Aggregated from all slides | — |
| Slide 2: Product Metrics | Analytics platform | Section 20 analytics templates |
| Slide 3: Revenue & Growth | Billing system, CRM | `mrr-arr-waterfall.template.md`, Section 25 `revenue-projection.template.md` |
| Slide 4: Unit Economics | Multi-source calculation | `unit-economics-dashboard.template.md`, Section 25 `unit-economics-calculator.template.md` |
| Slide 5: Market & Competition | Market research, CRM win/loss | Section 13 `market-research.template.md` |
| Slide 6: Customer Health | CRM, support system, NPS tool | `cohort-analysis.template.md`, Section 33 |
| Slide 7: Team & Hiring | HRIS, ATS | HR systems |
| Slide 8: Engineering & Technical | CI/CD, monitoring, project management | `departmental-dashboards.template.md`, Section 21, Section 34 |
| Slide 9: Risks & Mitigations | Risk register | CEO-maintained document |
| Slide 10: Strategic Asks | CEO judgment | Cross-deck |
| Slide 11: Financial Projections | Financial model | Section 25 financial templates |
| Slide 12: Appendix | All sources | All sections |
