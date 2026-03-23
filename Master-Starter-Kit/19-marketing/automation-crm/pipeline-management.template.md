# Sales Pipeline Management for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Monetization Model:** {{MONETIZATION_MODEL}}
> **Date:** {{DATE}}

---

## Pipeline Fundamentals

A sales pipeline is a visual representation of every potential deal, organized by the stage it is in. It answers the most important revenue question at a glance: "How much money is likely to come in, and when?"

**Why you need a pipeline even if you are "not doing sales":**
- Every business has a conversion process, even self-serve products.
- Seeing where people drop off tells you exactly what to fix.
- Revenue forecasting is impossible without pipeline data.
- It forces you to define what "qualified" and "ready to buy" actually mean.

**Pipeline vs. Funnel:**
- A **funnel** describes the marketing journey (awareness → interest → consideration → conversion).
- A **pipeline** describes the sales journey (lead → qualified → demo → proposal → close).
- They overlap but serve different purposes. This document covers the pipeline side.

---

## Pipeline Stage Design

### Standard Sales Pipeline

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐    ┌────────────┐    ┌─────────────┐    ┌─────────────┐
│  New Lead    │ →  │  Qualified   │ →  │ Discovery Call │ →  │  Demo/Trial  │ →  │  Proposal  │ →  │ Negotiation │ →  │ Closed Won  │
│              │    │              │    │                │    │              │    │            │    │             │    │             │
│  Inbound or  │    │ Meets ICP,   │    │ First real     │    │ Product      │    │ Pricing    │    │ Terms,      │    │ Signed,     │
│  outbound    │    │ expressed    │    │ conversation   │    │ shown or     │    │ sent,      │    │ legal,      │    │ paid,       │
│  capture     │    │ interest     │    │ about needs    │    │ trial active │    │ discussing │    │ final       │    │ done!       │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘    └────────────┘    └─────────────┘    └─────────────┘
                                                                                                                      ┌─────────────┐
                                                                                                                      │ Closed Lost │
                                                                                                                      │             │
                                                                                                                      │ Document    │
                                                                                                                      │ reason      │
                                                                                                                      └─────────────┘
```

### Stage 1: New Lead

**Definition:** First contact has been made. The lead has entered your system through any channel — form submission, inbound email, trade show, cold outreach response, referral.

**Entry Criteria:**
- Contact exists in CRM with at least name and email.
- Lead source is identified and tagged.

**Exit Criteria (to advance to Qualified):**
- Initial research completed: company size, industry, role confirmed.
- Lead fits ICP based on available information.
- Lead has responded to or engaged with outreach.

**Key Activities:**
- Auto-tag lead source and campaign.
- Enrich contact data (company info, LinkedIn profile).
- Send initial acknowledgment or welcome message.
- Route to appropriate rep or automation sequence.

**Probability:** 5%
**Target Time in Stage:** 1-3 days

---

### Stage 2: Qualified

**Definition:** The lead has been verified as a potential fit based on ICP criteria, and they have shown some level of interest (not just downloaded a whitepaper — they have engaged meaningfully).

**Entry Criteria:**
- Matches at least 3 of 5 ICP criteria (size, industry, role, geography, budget indicator).
- Has engaged beyond initial contact (replied to email, visited product pages, attended event).
- Lead score >= MQL threshold (30+ in default model).

**Exit Criteria (to advance to Discovery Call):**
- First meeting or call is scheduled.
- OR: lead has started a trial/evaluation (for product-led motion).

**Key Activities:**
- Sales rep reviews lead profile and recent activity.
- Personalized outreach (not a generic template).
- Attempt to schedule a discovery call or product demo.
- If no response after 3 attempts over 10 days, return to nurture.

**Probability:** 15%
**Target Time in Stage:** 3-7 days

---

### Stage 3: Discovery Call

**Definition:** A real conversation has happened (or is scheduled). You know their specific needs, pain points, timeline, and budget situation.

**Entry Criteria:**
- Meeting scheduled or completed.
- Contact is a real person at a real company (not a tire-kicker).

**Exit Criteria (to advance to Demo/Trial):**
- BANT qualified: Budget, Authority, Need, Timeline confirmed.
- Decision-making process understood (who else is involved?).
- Specific use case identified for {{PROJECT_NAME}}.
- Demo or trial is the agreed next step.

**Key Activities:**
- Run discovery framework (BANT, MEDDIC, or SPIN questions).
- Document pain points, current solution, decision criteria in CRM.
- Identify all stakeholders and decision-makers.
- Set clear next steps with specific dates.

**Discovery Call Framework for {{PROJECT_NAME}}:**

| Question Area | Example Questions |
|--------------|-------------------|
| **Situation** | "What are you using today for [problem area]?" |
| **Problem** | "What's the biggest challenge with your current approach?" |
| **Impact** | "What does this cost you in time/money/opportunity?" |
| **Need** | "What would a good solution look like for you?" |
| **Timeline** | "When do you need this solved by?" |
| **Budget** | "Do you have a budget allocated for this?" |
| **Authority** | "Who else would be involved in this decision?" |
| **Process** | "What does your evaluation process typically look like?" |

**Probability:** 30%
**Target Time in Stage:** 5-10 days

---

### Stage 4: Demo/Trial

**Definition:** The prospect has seen the product in action or is actively using a trial/evaluation.

**Entry Criteria:**
- Live demo completed OR trial/pilot started.
- Prospect has confirmed relevance to their use case.

**Exit Criteria (to advance to Proposal):**
- Prospect has expressed interest in purchasing.
- Specific plan/tier identified.
- Pricing discussion is the agreed next step.

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS-Specific Activities:**
- Provide structured demo focused on prospect's stated use case.
- Set up trial environment with sample data relevant to their industry.
- Assign customer success contact for trial support.
- Track trial usage: which features used, how often, how many users.
- Schedule mid-trial check-in at day 3-5.
- Flag trials with no usage after 48 hours for immediate outreach.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "e-commerce" -->
**E-commerce-Specific Activities:**
- Send product samples or provide access to wholesale catalog.
- Share pricing tiers and minimum order quantities.
- Provide references from similar retailers.
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
**Marketplace-Specific Activities:**
- Demo both sides of the platform (supply and demand).
- Show comparable listings/providers in their category.
- Provide data on marketplace volume and growth.
<!-- ENDIF -->

**Probability:** 50%
**Target Time in Stage:** 7-14 days (aligned with trial length)

---

### Stage 5: Proposal

**Definition:** Pricing has been presented. The prospect is evaluating your offer against their budget and alternatives.

**Entry Criteria:**
- Formal pricing or proposal document sent.
- Prospect has reviewed and acknowledged receipt.

**Exit Criteria (to advance to Negotiation):**
- Prospect has responded to the proposal with questions or counter-offer.
- OR: Prospect has accepted the proposal as-is.

**Key Activities:**
- Send clear, professional proposal with pricing, scope, and terms.
- Include ROI calculation specific to their situation.
- Follow up within 48 hours if no response.
- Be ready to handle objections (price, features, timing, competition).

**Probability:** 60%
**Target Time in Stage:** 5-10 days

---

### Stage 6: Negotiation

**Definition:** Active discussion on terms — pricing, contract length, features, SLA, or legal terms.

**Entry Criteria:**
- Prospect has engaged with proposal content (counter-offer, questions, legal review).
- Budget is confirmed; this is about finalizing terms, not validating interest.

**Exit Criteria:**
- Verbal or written agreement on terms.
- Contract sent for signature.
- OR: Deal is lost (document why).

**Key Activities:**
- Maintain urgency without being pushy.
- Have pre-approved discount limits (e.g., max 20% off annual, no discounts on monthly).
- Address legal/security concerns promptly.
- Get verbal commitment before sending contract.
- Set a deadline for the offer if applicable.

**Probability:** 75%
**Target Time in Stage:** 5-15 days

---

### Stage 7: Closed Won / Closed Lost

**Closed Won:**
- Contract signed and payment received (or PO issued).
- Trigger customer onboarding workflow.
- Update CRM: lifecycle to "Customer", deal to "Won".
- Celebrate. Seriously.

**Closed Lost:**
- Document the loss reason in CRM (critical for future improvements).
- Common loss reasons to track:
  - Price / budget
  - Chose competitor (which one?)
  - Timing (not ready now — set follow-up for future)
  - Feature gap (what was missing?)
  - No decision (went dark)
  - Champion left the company
- Enter appropriate nurture sequence for future re-engagement.
- Review: is there a pattern in your losses?

---

## Pipeline Metrics

### Pipeline Velocity

Pipeline velocity measures how fast revenue moves through your pipeline. It is the single most useful pipeline metric.

```
Pipeline Velocity = (Number of Deals × Win Rate × Average Deal Value) ÷ Sales Cycle Length

Example:
  50 deals × 25% win rate × $5,000 avg deal ÷ 30 day cycle
  = $2,083 per day in pipeline velocity
```

**How to improve velocity:**
- Increase number of deals: better lead generation.
- Increase win rate: better qualification, demos, and proposals.
- Increase deal value: upselling, bundling, targeting larger accounts.
- Decrease cycle length: faster follow-up, simpler contracts, urgency.

### Stage Conversion Rates

Track what percentage of deals move from one stage to the next:

| Transition | Your Rate | Benchmark | Action if Low |
|-----------|-----------|-----------|---------------|
| New Lead → Qualified | ___% | 30-50% | Improve lead quality or ICP definition |
| Qualified → Discovery | ___% | 50-70% | Improve outreach or response time |
| Discovery → Demo/Trial | ___% | 60-80% | Improve discovery process or qualification |
| Demo/Trial → Proposal | ___% | 40-60% | Improve demo quality or trial support |
| Proposal → Negotiation | ___% | 50-70% | Improve proposal content or pricing |
| Negotiation → Won | ___% | 60-80% | Improve negotiation skills or terms flexibility |
| **Overall: Lead → Won** | ___% | 2-10% | Optimize weakest stage first |

### Average Deal Value

| Metric | Value | Trend |
|--------|-------|-------|
| Average deal value (all) | $____ | ↑↓→ |
| Average deal value (won) | $____ | ↑↓→ |
| Average deal value (lost) | $____ | ↑↓→ |
| Largest deal this quarter | $____ | |
| Smallest deal this quarter | $____ | |

**Optimization:** If average won deal value is significantly different from lost deal value, it tells you something about pricing or targeting.

### Sales Cycle Length

| Segment | Days | Target |
|---------|------|--------|
| Average (all deals) | ____ | ____ |
| Self-serve (no touch) | ____ | ____ |
| Sales-assisted | ____ | ____ |
| Enterprise | ____ | ____ |

### Pipeline Coverage

Pipeline coverage is the ratio of total pipeline value to your revenue target:

```
Pipeline Coverage = Total Open Pipeline Value ÷ Revenue Target

Example: $400,000 pipeline ÷ $100,000 target = 4x coverage
```

**Target: 3-4x coverage.** If your win rate is 25%, you need 4x pipeline to hit your number.

| Quarter | Revenue Target | Pipeline Value | Coverage | Status |
|---------|---------------|---------------|----------|--------|
| Q1 | $____ | $____ | ____x | Healthy / At Risk / Critical |
| Q2 | $____ | $____ | ____x | Healthy / At Risk / Critical |
| Q3 | $____ | $____ | ____x | Healthy / At Risk / Critical |
| Q4 | $____ | $____ | ____x | Healthy / At Risk / Critical |

---

## Pipeline Hygiene

### Weekly Pipeline Review Checklist

Every week, review the entire pipeline with these questions:

- [ ] **Stale deals:** Any deal inactive for 14+ days? Follow up or move to lost.
- [ ] **Missing data:** Any deal without a close date, value, or next step? Update now.
- [ ] **Stage accuracy:** Are deals in the right stage based on actual progress? Move them.
- [ ] **Zombie deals:** Any deal in the pipeline for more than 2x your average cycle? Validate or kill.
- [ ] **Forecast accuracy:** Does the weighted pipeline match what you actually expect to close?
- [ ] **New deals added:** Is pipeline generation keeping pace with closings?
- [ ] **Blocked deals:** Any deal stuck on a specific issue? Create action plan.

### Pipeline Cleaning Rules

| Rule | Trigger | Action |
|------|---------|--------|
| Stale deal | No activity for 14 days | Send re-engagement email, call. If no response in 7 more days, move to lost. |
| Aged deal | In pipeline for 2x avg cycle | Mandatory review. Is this real? If yes, document why it's slow. If no, close lost. |
| Ghost contact | No email opens in 30 days | Move to "Cold" status, remove from pipeline. |
| Duplicate deal | Same contact, same product | Merge. Keep the one with more activity. |

---

## Forecasting

### Weighted Pipeline Forecast

Multiply each deal's value by its stage probability to get a weighted forecast:

| Deal | Stage | Value | Probability | Weighted Value |
|------|-------|-------|-------------|---------------|
| Acme Corp | Proposal | $10,000 | 60% | $6,000 |
| Beta Inc | Discovery | $5,000 | 30% | $1,500 |
| Gamma LLC | Negotiation | $15,000 | 75% | $11,250 |
| **Total** | | **$30,000** | | **$18,750** |

### Bottleneck Identification

If deals cluster at a specific stage, that stage is your bottleneck:

```
Stage Distribution (example):
  New Lead:      ████████████  (12 deals)
  Qualified:     ██████████    (10 deals)
  Discovery:     █████████████████████  (21 deals) ← BOTTLENECK
  Demo/Trial:    ██████        (6 deals)
  Proposal:      ████          (4 deals)
  Negotiation:   ██            (2 deals)
```

**Diagnosis:** If deals pile up at Discovery, either:
- Reps are not moving deals forward fast enough (process issue).
- Discovery calls are not converting (skills issue).
- Prospects are evaluating but not ready to commit (market issue).

---

## Self-Serve Pipeline (Product-Led Growth)

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

For product-led growth, the pipeline looks different — no sales rep is involved for most of the journey:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Website    │ →  │   Signup     │ →  │  Activation  │ →  │  Engagement  │ →  │  Conversion  │
│   Visitor    │    │  (Free/Trial)│    │ (First Value)│    │ (Regular Use)│    │ (Paid Plan)  │
│              │    │              │    │              │    │              │    │              │
│  Tracking:   │    │  Tracking:   │    │  Tracking:   │    │  Tracking:   │    │  Tracking:   │
│  GA4, UTMs   │    │  CRM event   │    │  Product     │    │  Product     │    │  Stripe,     │
│              │    │              │    │  analytics   │    │  analytics   │    │  CRM update  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘

Conversion Rates (benchmarks):
  Visit → Signup: 2-5%
  Signup → Activated: 20-40%
  Activated → Engaged: 30-60%
  Engaged → Paid: 5-15%
  Overall Visit → Paid: 0.1-1%
```

**Key Differences from Sales-Led:**
- No human involvement until enterprise tier.
- Product IS the sales pitch — onboarding quality is everything.
- Metrics are product metrics: activation rate, feature adoption, usage frequency.
- "Pipeline" is measured in user cohorts, not individual deals.

<!-- ENDIF -->

---

## Hybrid Pipeline (Self-Serve + Sales-Assisted)

Most growing products need both:

| Deal Size | Motion | Pipeline |
|-----------|--------|----------|
| < $100/mo | Self-serve | Product-led, no sales touch |
| $100-500/mo | Light touch | Product-led + email outreach from sales |
| $500-2000/mo | Sales-assisted | Demo-led, dedicated rep |
| $2000+/mo | Enterprise sales | Full sales cycle, custom proposals |

**When to add sales-assist to self-serve:**
- A trial user adds 5+ team members.
- A user hits 80% of their plan limit.
- A user from a company with 200+ employees signs up.
- A user visits the enterprise pricing page.

---

## Reporting

### Weekly Pipeline Review Template

**Date:** ____________________
**Reviewed by:** ____________________

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Total pipeline value | $____ | $____ | +/- $____ |
| Number of open deals | ____ | ____ | +/- ____ |
| Deals added | ____ | ____ | |
| Deals won | ____ ($____) | ____ ($____) | |
| Deals lost | ____ ($____) | ____ ($____) | |
| Pipeline velocity | $____/day | $____/day | |
| Weighted forecast (30 days) | $____ | $____ | |

**Deals Requiring Attention:**
1. _____________________ — Reason: _____________________
2. _____________________ — Reason: _____________________
3. _____________________ — Reason: _____________________

**Action Items:**
- [ ] _____________________
- [ ] _____________________
- [ ] _____________________

### Monthly Sales Report Template

**Month:** ____________________
**Revenue Target:** $____
**Revenue Achieved:** $____ (____% of target)

| Metric | Actual | Target | Status |
|--------|--------|--------|--------|
| New deals created | ____ | ____ | On/Off Track |
| Deals won | ____ | ____ | On/Off Track |
| Revenue closed | $____ | $____ | On/Off Track |
| Win rate | ___% | ___% | On/Off Track |
| Avg deal value | $____ | $____ | On/Off Track |
| Avg cycle length | ____ days | ____ days | On/Off Track |
| Pipeline coverage (next month) | ____x | 3-4x | On/Off Track |

---

## Pipeline Stages for {{PROJECT_NAME}}

Based on {{MONETIZATION_MODEL}}, configure your pipeline as follows:

### Pipeline Configuration

| Stage | Name | Probability | Max Time | Exit Criteria |
|-------|------|-------------|----------|---------------|
| 1 | _________________ | ___% | ___ days | _________________ |
| 2 | _________________ | ___% | ___ days | _________________ |
| 3 | _________________ | ___% | ___ days | _________________ |
| 4 | _________________ | ___% | ___ days | _________________ |
| 5 | _________________ | ___% | ___ days | _________________ |
| 6 | _________________ | ___% | ___ days | _________________ |
| 7 | Closed Won | 100% | N/A | Payment received |
| 8 | Closed Lost | 0% | N/A | Reason documented |

### Implementation Checklist

- [ ] Define pipeline stages based on {{MONETIZATION_MODEL}} and sales motion
- [ ] Set probabilities for each stage (adjust after 90 days of data)
- [ ] Configure pipeline in CRM tool
- [ ] Define entry and exit criteria for each stage
- [ ] Set up stage-change automations (notifications, tasks, emails)
- [ ] Create pipeline dashboard with key metrics
- [ ] Schedule weekly pipeline review (day/time: ____)
- [ ] Train team on pipeline usage and hygiene standards
- [ ] Set initial revenue targets for next 3 months

---

*This pipeline guide is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*
