# NPS & CSAT Automation

> {{PROJECT_NAME}} — Automate the measurement of customer satisfaction and turn scores into action.

---

## Overview

Collecting satisfaction scores is the easy part. The hard part — and the part that actually moves the needle — is what happens after the score is recorded. This template defines the automation layer: the flows that trigger when a score comes in, the follow-up sequences that turn detractors into recovered customers, the reporting that surfaces patterns, and the alerting that ensures nothing falls through the cracks.

**Cross-reference:** For the survey design patterns, trigger logic, and data model, see `feedback-collection-system.template.md`. This document assumes those surveys are already collecting data and focuses on the automation and response layer. For how feedback feeds into product decisions, see `20-post-launch/user-feedback-loops.template.md`.

**Core philosophy:**
- **Every detractor deserves a human response.** Automated acknowledgment is fine as step one, but a real person must follow up.
- **Promoters are an asset — activate them.** A promoter who never gets asked to advocate is a wasted opportunity.
- **Scores without action erode trust.** If you survey customers and nothing changes, they stop responding — and start churning.
- **Statistical discipline matters.** Don't celebrate a 5-point NPS jump on 30 responses. Don't panic over a single bad quarter. Trends are signal; individual data points are noise.

---

## NPS Program Design

### Survey Configuration

**Question wording (standardized — do not modify):**
"How likely are you to recommend {{PROJECT_NAME}} to a friend or colleague?"

Modifying the wording makes your NPS incomparable to benchmarks and historical data. The question has been validated across millions of respondents. Use it exactly as written.

**Scale:** 0-10 (standard Reichheld scale)
- Display: horizontal number selector with 0 on the left, 10 on the right
- Labels: "Not at all likely" (0) and "Extremely likely" (10)
- No neutral label in the middle — let respondents decide for themselves
- Color coding optional: red (0-6), yellow (7-8), green (9-10) — subtle, not garish

**Follow-up question (segment-specific):**
- Detractors (0-6): "What is the primary reason for your score?" — required
- Passives (7-8): "What would we need to do to earn a 10?" — optional
- Promoters (9-10): "What do you value most about {{PROJECT_NAME}}?" — optional

**Frequency:** {{CX_NPS_FREQUENCY}}
- Quarterly is the gold standard for SaaS products
- Semi-annual is acceptable for low-frequency-use products (e.g., tax software)
- Monthly is too frequent for relational NPS (it's not transactional CSAT)
- Stagger sends: don't survey your entire base on the same day — spread over 2 weeks

**Audience criteria:**
- Active in the last 30 days (logged in at least once)
- Tenure > 30 days (new users don't have enough experience to give meaningful NPS)
- Not surveyed in the last 80 days (prevents quarterly overlap)
- No open P0/P1 support tickets (they're already frustrated — surveying them now gets you a detractor score that doesn't represent their steady-state sentiment)
- Not in a trial that ends in < 7 days (they're evaluating, not committed)

**Exclusion overrides:**
- Enterprise accounts on custom contracts: coordinate with their CSM before surveying
- Accounts in active churn negotiation: exclude entirely
- Accounts that have explicitly opted out of surveys: permanent exclusion

### NPS Calculation

**Formula:**
```
NPS = (Number of Promoters / Total Responses × 100) - (Number of Detractors / Total Responses × 100)
```

**Segments:**
- Detractors: score 0-6 (unhappy, at risk of churning, may actively discourage others)
- Passives: score 7-8 (satisfied but unenthusiastic, vulnerable to competitive offers)
- Promoters: score 9-10 (loyal enthusiasts, will refer others and fuel growth)

**Benchmarks:** {{CX_NPS_BENCHMARK}}
- B2B SaaS median: ~30-40
- B2C SaaS median: ~20-30
- Top quartile B2B SaaS: 50+
- World-class: 70+ (rare, usually consumer brands with cult followings)

**Statistical rigor:**
- Minimum sample size: 100 responses for a reportable NPS score
- For segment-level NPS (by plan tier, cohort, etc.): minimum 30 responses per segment
- Report with confidence interval: ±margin of error at 95% confidence
- Formula for margin of error: `1.96 × sqrt(((%P × (1-%P)) + (%D × (1-%D)) + (2 × %P × %D)) / n)` where %P = promoter percentage, %D = detractor percentage, n = sample size
- If your margin of error is > ±10 points, your sample is too small to report confidently

**Segmentation dimensions (calculate NPS for each):**
- Plan tier (free, starter, pro, enterprise)
- Signup cohort (monthly cohorts — are newer users happier?)
- Usage level (power users vs. casual users)
- Feature usage group (users who use feature X vs. those who don't)
- Geography (if applicable)
- Company size (SMB, mid-market, enterprise)
- Time-to-value (users who reached "aha moment" quickly vs. slowly)

---

## NPS Follow-Up Automation

### Detractor Flow (Score 0-6) — CRITICAL PATH

This is the most important automation in the entire CX ops stack. A detractor is a customer telling you they're unhappy. Ignoring this signal is organizational malpractice.

**Step 1: Immediate acknowledgment (within 5 minutes of submission)**

Automated Slack alert to #cx-detractor-alerts channel:
```
🚨 NPS Detractor Alert
Customer: [Name] ([Email])
Account: [Company] — [Plan Tier] — $[ARR]
Score: [X]/10
Comment: "[Their verbatim comment]"
Context: Active for [X] months, [X] support tickets this quarter
Last login: [date]
Health score: [X]/100
→ [Link to customer profile] | [Link to assign follow-up]
```

Simultaneously: send automated email notification to CX team lead with the same details.

**Step 2: Personalized outreach (within 1 hour)**

A real human (CX team member or CSM for enterprise accounts) sends a personalized email. NOT a template that looks like a template — actually personalized.

Template starting point (customize for every customer):
```
Subject: Your feedback matters — let's talk

Hi [First Name],

Thank you for your honest feedback on {{PROJECT_NAME}}. I saw that you
mentioned [specific pain point from their comment], and I want you to
know we take that seriously.

I'd love to understand your experience better and see if there's anything
we can do to help right now. Would you have 15 minutes for a quick call
this week?

[Calendar booking link]

If a call isn't convenient, just reply to this email — I read every response.

Best,
[CX team member name]
[Title]
```

**Personalization requirements:**
- Reference their specific comment — don't send a generic "sorry you had a bad experience"
- If they mentioned a specific feature or issue, acknowledge it by name
- If you already know the fix/workaround, include it in the first email (don't make them wait for a call)
- Send from a real person's email address with a real signature
- For enterprise accounts ($50K+ ARR): the CSM sends this, not a generic CX team member

**Step 3: Follow-up if no response (3 days after Step 2)**

If the customer hasn't responded to the initial outreach:
```
Subject: Re: Your feedback matters — let's talk

Hi [First Name],

I wanted to follow up on my note from [day]. I understand you're busy,
but I did want to let you know that [specific action taken based on their
feedback — e.g., "we've escalated the performance issue you mentioned to
our engineering team" or "we've added the feature you requested to our
Q[X] roadmap"].

If you'd like to discuss, I'm here: [calendar link]

Best,
[Same person as Step 2]
```

**Step 4: Recovery measurement (after resolution)**

If the customer responds and their issue is addressed:
- Wait 7 days after resolution
- Send a brief CSAT survey (NOT another NPS survey — never re-survey NPS outside the regular cadence)
- Question: "How satisfied are you with how we addressed your feedback? (1-5)"
- Track: detractor recovery rate = % of detractors who score 4-5 on the recovery CSAT

**Step 5: Long-term tracking**

- Tag the customer in your CRM: "NPS Detractor Q[X] [Year]"
- Add to "at-risk" watchlist in customer health scoring
- Monitor their next NPS score — did they improve, stay the same, or get worse?
- If they improve to passive/promoter: log as "recovered" — this is a key metric
- If they churn within 90 days of a detractor score: log as "detractor-to-churn" — track this conversion rate

**Team workflow:**
- CX team lead assigns each detractor to a team member within 30 minutes of the alert
- Team member owns the follow-up end-to-end (Steps 2-4)
- Weekly detractor review meeting (15 minutes): review all open detractor follow-ups, identify patterns
- Monthly: review detractor recovery rate and time-to-response metrics

---

### Passive Flow (Score 7-8)

Passives are often overlooked, but they represent a massive opportunity. They're satisfied enough not to leave, but not enthusiastic enough to promote. A small improvement can tip them to promoter; a competitor's compelling offer can tip them to detractor.

**Step 1: Thank you + "What would make you a 10?" (within 24 hours)**

Automated email (this one can be templated — passives don't need the same urgency as detractors):
```
Subject: Thank you for your feedback — one more question

Hi [First Name],

Thank you for sharing your thoughts on {{PROJECT_NAME}}. We noticed you
gave us a [7/8] — we appreciate that, and we want to earn a 10.

If you have a moment, we'd love to know: what's the one thing we could
do better?

Just reply to this email — every response is read by a real person on
our product team.

Thanks,
[CX team member or product team member]
```

**Step 2: If they respond — tag and route**

- Auto-tag their response using the feedback taxonomy (see `feedback-collection-system.template.md`)
- Route to the relevant product team (e.g., if they mention reporting, route to the reporting PM)
- Add to the "passive improvement ideas" backlog — review monthly

**Step 3: Close the loop when you ship their suggestion**

This is the magic move that converts passives to promoters. When you ship a feature or improvement that a passive specifically requested:

```
Subject: You asked, we built it

Hi [First Name],

A few months ago, you told us that [specific thing they asked for] would
make {{PROJECT_NAME}} better. We agreed — and we just shipped it.

[Brief description of what changed + link to the feature]

We'd love to hear what you think. And if you have a moment, it would
mean the world if you shared your experience on [G2/Capterra/App Store].

Thanks for helping us improve,
[Team member name]
```

**Tracking:**
- Passive-to-promoter conversion rate (% of passives who become promoters on next NPS survey)
- Passive response rate (% who answer the "what would make you a 10?" question)
- Loop closure rate (% of passive suggestions that get shipped and communicated back)

---

### Promoter Flow (Score 9-10)

Promoters are your most valuable customers from a growth perspective. They'll refer others, leave reviews, participate in case studies, and defend you on social media. But only if you ask — and only if you don't ask for too much at once.

**Step 1: Genuine thank you (immediately after submission)**

In-app or email (whichever channel they used for the survey):
```
Thank you for the incredible feedback! Knowing that you'd recommend
{{PROJECT_NAME}} means a lot to our team. We're working hard to keep
earning that trust.
```

Keep it short. Don't immediately ask for something — let the gratitude land first.

**Step 2: Activation ask (within 24 hours)**

Pick ONE action to request — not a menu of options. Choose based on what the business needs most right now:

**Option A: Review request**
```
Subject: Would you share your experience?

Hi [First Name],

Thank you again for your kind words about {{PROJECT_NAME}}. Reviews from
customers like you help other [target persona] find us.

If you have 2 minutes, a short review on [G2/Capterra/App Store] would
mean the world:

[Direct link to review page — pre-filled if possible]

No pressure at all — we appreciate you either way.

Best,
[Team member name]
```

**Option B: Referral invitation**
```
Subject: Know someone who'd benefit from {{PROJECT_NAME}}?

Hi [First Name],

You mentioned you'd recommend {{PROJECT_NAME}} to a colleague — we'd love
to make that easy. Here's your personal referral link:

[Referral link]

When someone signs up through your link, [describe the incentive — e.g.,
"you both get a month free" or "they get an extended trial"].

Thanks for spreading the word,
[Team member name]
```

**Option C: Case study invitation**
```
Subject: Would you share your story?

Hi [First Name],

Your feedback about {{PROJECT_NAME}} was incredibly encouraging. We're
putting together customer stories to help others in [their industry] see
what's possible.

Would you be open to a 20-minute conversation about your experience?
We handle all the writing — you just need to share your story.

[Calendar link for case study interview]

Totally optional, but we'd be honored.

Best,
[Team member name]
```

**Option D: Community champion invitation**
```
Subject: Join our customer advisory group

Hi [First Name],

Based on your experience with {{PROJECT_NAME}}, we'd love to invite you
to our Customer Advisory Group — a small group of power users who get
early access to new features and direct input into our roadmap.

Interested? [Link to learn more / sign up]
```

**Selection logic (which option to send):**
- If the business needs social proof: Option A (reviews)
- If the business is in growth mode: Option B (referrals)
- If the customer is enterprise + high-profile: Option C (case study)
- If the customer is a power user with deep product knowledge: Option D (advisory)
- Never send more than one ask — it dilutes the conversion rate

**Step 3: Track promoter activation**

- Promoter activation rate = % of promoters who complete the requested action
- Benchmark: 10-20% activation rate is good, 25%+ is excellent
- Track by action type: review conversion rate, referral conversion rate, case study acceptance rate
- Revenue attribution: if possible, track revenue generated from promoter referrals

---

## CSAT Implementation

### Post-Interaction CSAT

**Trigger events and timing:**

| Interaction | Trigger Event | Delay | Channel |
|---|---|---|---|
| Support ticket resolved | `ticket.resolved` | 1 hour | In-app or email |
| Live chat ended | `chat.ended` | Immediate | In-chat widget |
| Onboarding completed | `onboarding.completed` | 24 hours | In-app or email |
| Feature first used | `feature.first_use` | Immediate | In-app micro-survey |
| Purchase/upgrade | `subscription.upgraded` | 48 hours | Email |
| Renewal | `subscription.renewed` | 7 days | Email |

**Question:** "How satisfied are you with your experience? (1-5 stars)"

**Target:** {{CX_CSAT_TARGET}} average across all interactions
- 4.0 is the minimum acceptable threshold
- 4.5+ is excellent
- Below 3.5 consistently indicates a systemic problem

### CSAT by Touchpoint — Track Separately

Aggregate CSAT is a vanity metric. It masks problems by averaging excellent support CSAT with terrible onboarding CSAT. Always break down CSAT by touchpoint:

**Support ticket resolution CSAT:**
- Measures: was the issue resolved satisfactorily?
- Healthy range: 4.2-4.8
- If below 4.0: investigate agent training, resolution quality, first-contact resolution rate
- Segment by: ticket category, agent, priority level, channel (email vs. chat vs. phone)

**Live chat CSAT:**
- Measures: was the chat interaction helpful and efficient?
- Healthy range: 4.0-4.6
- If below 3.8: investigate wait times, agent knowledge gaps, escalation rate
- Segment by: agent, topic, time of day

**Onboarding CSAT:**
- Measures: was the setup experience smooth and clear?
- Healthy range: 3.8-4.5 (onboarding is inherently harder, so expect slightly lower)
- If below 3.5: investigate specific onboarding steps — which step causes the drop?
- Segment by: plan tier, company size, onboarding path (self-serve vs. guided)

**Feature-specific CSAT (from micro-surveys):**
- Measures: is this specific feature meeting user expectations?
- Healthy range: 3.5-4.5 (varies by feature maturity)
- If below 3.0: feature needs UX overhaul or major bug fixes
- Segment by: user role, usage frequency, plan tier

**Self-service CSAT (KB article helpfulness):**
- Measures: did the help content actually help?
- Format: "Was this article helpful?" (thumbs up/down) — simpler than 1-5 for self-service
- Target: 70%+ thumbs up rate
- If below 50%: article needs rewriting — it's actively unhelpful

### CSAT Response Handling

**Automated actions by score:**

| Score | Action | Timeline | Owner |
|---|---|---|---|
| 1 (Very Dissatisfied) | Create internal flag, alert CX manager, investigate root cause | Within 1 hour | CX manager |
| 2 (Dissatisfied) | Alert CX team lead, review interaction, identify improvement | Within 4 hours | CX team lead |
| 3 (Neutral) | Log for pattern analysis, no immediate action | Batch weekly | CX analyst |
| 4 (Satisfied) | Positive reinforcement for agent, feed into QA scoring | Batch weekly | QA team |
| 5 (Very Satisfied) | Positive reinforcement for agent, consider for promoter activation | Batch weekly | QA team |

**Non-response handling:**
- Don't count non-responses as negative — this biases your CSAT downward
- Do track response rate separately — a declining response rate is its own warning signal
- If response rate drops below 15%: investigate timing, channel, survey fatigue, or deliverability issues

---

## Customer Effort Score (CES)

### When to Use CES Instead of CSAT

CES measures how easy it was to accomplish something. CSAT measures how satisfied someone is with an experience. They sound similar but measure different things:

- **Use CSAT** when you want to know: "Did the customer enjoy this interaction?"
- **Use CES** when you want to know: "Did the customer struggle to accomplish their goal?"

CES is a stronger predictor of customer loyalty than CSAT (per Gartner/CEB research). Customers don't churn because they're unsatisfied — they churn because things are too hard. Reducing effort is more impactful than increasing delight.

**Best use cases for CES:**
- After completing account setup (multi-step process)
- After configuring an integration (technically complex)
- After finding an answer in documentation (self-service success)
- After completing a complex workflow for the first time
- After resolving an issue through self-service (troubleshooter, FAQ)
- After any multi-step process where friction is likely

### CES Survey Design

**Question:** "How easy was it to [specific action]?"

**Scale:** 1-7
- 1 = "Very Difficult"
- 2 = "Difficult"
- 3 = "Somewhat Difficult"
- 4 = "Neither Easy nor Difficult"
- 5 = "Somewhat Easy"
- 6 = "Easy"
- 7 = "Very Easy"

**Follow-up (for scores 1-3):** "What made it difficult?" (free text, required)

**Targets:**
- Average CES ≥ 5.5 across all measured workflows
- Any workflow with CES < 4.0: immediate UX improvement priority (add to next sprint)
- Any workflow with CES between 4.0-5.0: improvement planned within the quarter

### CES-Driven Improvement Process

1. Rank all measured workflows by CES score (lowest first)
2. For the bottom 3 workflows: conduct a UX review session
3. Identify specific friction points using the free-text "What made it difficult?" responses
4. Implement improvements
5. Re-measure CES after improvements ship
6. Target: 0.5+ point improvement in CES within 60 days of shipping UX fixes

---

## Score Aggregation and Trending

### Rolling Averages

**NPS:**
- Primary view: 90-day rolling average (captures one full quarterly cycle)
- Secondary view: quarter-over-quarter comparison
- Don't overreact to week-over-week NPS fluctuations — the variance is too high on small samples

**CSAT:**
- Primary view: 30-day rolling average (high response frequency allows shorter windows)
- Secondary view: week-over-week comparison for operational monitoring
- Track CSAT trend for each touchpoint independently

**CES:**
- Primary view: per-workflow rolling average (updated with each new response)
- Secondary view: before/after comparison when UX changes are shipped
- Window: 60-day rolling (CES changes slowly unless you make deliberate UX improvements)

### Cohort Analysis

**Signup cohort analysis (are newer users happier?):**
- Compare NPS by monthly signup cohort for the last 12 months
- If newer cohorts have lower NPS: your product is getting worse or expectations are rising
- If newer cohorts have higher NPS: your onboarding and product are improving
- Control for: tenure effect (new users are sometimes more optimistic, sometimes more critical)

**Plan tier analysis (do paid users value you more?):**
- Compare NPS, CSAT, and CES by plan tier
- Enterprise NPS is often lower than SMB NPS — enterprise customers have higher expectations and more complex needs
- Free-tier NPS should be viewed separately — these users have different expectations

**User role analysis (who's struggling?):**
- Compare CES by user role (admin vs. member vs. viewer)
- Admins often have lower CES because they handle the complex configuration tasks
- If member CES is low: your core workflows are too hard

**Trend divergence alerts:**
- Alert if any segment's NPS diverges from the overall NPS by more than 15 points
- Alert if any touchpoint's CSAT diverges from the overall CSAT by more than 0.5 points
- Divergence means a specific group is having a materially different experience — investigate why

### Statistical Significance

**NPS changes:**
- Don't report NPS changes unless the delta is > 5 points AND statistically significant (p < 0.05)
- Use a two-proportion z-test to compare the proportion of promoters and detractors between periods
- Always report sample size alongside the score: "NPS: 42 (n=287, ±5.8)"

**CSAT changes:**
- Don't report CSAT changes unless n > 30 responses in each comparison period
- Use a t-test to compare CSAT means between periods
- Report: "Support CSAT: 4.3 → 4.5 (p=0.02, n=145 vs. n=132)"

**CES changes:**
- Same as CSAT: n > 30 per period, t-test for comparison
- CES is particularly sensitive to sample composition — ensure you're comparing the same workflow

**Common statistical mistakes to avoid:**
- Comparing NPS on 20 responses vs. NPS on 200 responses (sample sizes too different)
- Declaring victory after one good quarter (could be regression to the mean)
- Ignoring response rate changes (if response rate drops, remaining respondents are self-selected)
- Segmenting too finely (NPS for "enterprise users in healthcare who use the reporting feature" on 8 responses is meaningless)

---

## Automated Alerting

### Alert Configuration

| Alert Name | Condition | Channel | Recipient | Frequency |
|---|---|---|---|---|
| Detractor alert | NPS score 0-6 submitted | Slack #cx-detractor-alerts + email | CX team lead + assigned CSM | Immediate (every occurrence) |
| CSAT crisis | CSAT score 1 or 2 submitted | Slack #cx-alerts | CX team + CX manager | Immediate (every occurrence) |
| NPS trend drop | 90-day rolling NPS drops > 10 points vs. previous period | Email digest | VP Product + CX lead | Weekly check |
| CSAT touchpoint dip | 30-day CSAT for any touchpoint drops below {{CX_CSAT_TARGET}} | Slack #cx-alerts | CX team lead | Daily check |
| CES high-friction | CES for any workflow drops below 4.0 (30-day average) | Email | Product lead + UX lead | Weekly check |
| Low response rate | Any survey type response rate drops below 10% | Email | CX ops lead | Weekly check |
| Score milestone | NPS crosses {{CX_NPS_BENCHMARK}} (positive direction) | Slack #general | All-hands | On occurrence |
| Detractor cluster | 3+ detractors from same company in one quarter | Slack + email | CSM + CX manager | On occurrence |
| Survey fatigue | Average surveys-per-user-per-month exceeds 2.5 | Email | CX ops lead | Monthly check |

### Alert Fatigue Prevention

**Batching:**
- Batch CSAT crisis alerts hourly (except during known incidents — increase to every 15 minutes)
- Exception: detractor alerts are ALWAYS immediate — never batch these
- If more than 5 CSAT crisis alerts fire in 1 hour: escalate to CX manager with summary instead of individual alerts

**Escalation ladder:**
- CSAT stays below {{CX_CSAT_TARGET}} for 1 week → alert CX team lead
- CSAT stays below {{CX_CSAT_TARGET}} for 2 weeks → escalate to CX manager + VP Product
- CSAT stays below {{CX_CSAT_TARGET}} for 4 weeks → executive escalation with root cause analysis required

**Snooze capability:**
- Allow temporary alert snooze during known incidents (e.g., outage — you know CSAT will dip)
- Maximum snooze duration: 72 hours
- Log all snoozes for audit trail
- Auto-resume after snooze expires

**De-duplication:**
- Same customer, same survey type, within 24 hours: suppress duplicate alerts
- Same alert type firing for same root cause: consolidate into a single thread

---

## Reporting Dashboard Specification

### Executive Summary (Weekly Email + Dashboard View)

This is the "one-page CX health check" that leadership sees every week. It should take < 2 minutes to read and answer the question: "Are our customers happy, and what should we do about it?"

**Contents:**
1. **NPS score:** current 90-day rolling NPS, trend arrow (↑/↓/→), comparison to {{CX_NPS_BENCHMARK}}
2. **CSAT average:** current 30-day average across all touchpoints, trend arrow, comparison to {{CX_CSAT_TARGET}}
3. **Detractor count:** number of detractors this week, top 3 pain points from their comments
4. **Promoter actions:** reviews generated, referrals made, case studies completed this week
5. **Response rates:** survey response rates by type (are customers engaging with surveys?)
6. **One-line recommendation:** single most important action item based on this week's data

**Format:**
- Send as email every Monday at 9 AM (team's timezone)
- Also available as a live dashboard (Metabase, Looker, or custom)
- Include sparkline charts for NPS and CSAT trends (last 12 weeks)

### Detailed Dashboard (Live, Always Available)

**NPS section:**
- Distribution histogram: bar chart showing count of responses for each score (0-10)
- NPS by segment: table showing NPS for each plan tier, cohort, geography
- NPS trend: line chart, 90-day rolling, with {{CX_NPS_BENCHMARK}} reference line
- Detractor-to-promoter ratio: are detractors increasing or decreasing as a proportion?

**CSAT section:**
- CSAT by touchpoint: bar chart showing average CSAT for support, chat, onboarding, features
- CSAT trend by touchpoint: multi-line chart, 30-day rolling
- CSAT distribution: histogram showing score distribution (1-5)
- Lowest-performing touchpoints: sorted list, bottom 5, with sample comments

**CES section:**
- CES by workflow: horizontal bar chart, sorted lowest to highest
- Workflows below 4.0: highlighted in red
- CES improvement tracker: before/after comparison for workflows that received UX improvements

**Free-text analysis section:**
- Top 10 themes: from auto-tagged feedback in last 30 days, sorted by frequency
- Sentiment breakdown per theme: positive / negative / neutral
- Theme trend: are specific themes increasing or decreasing over time?
- Drill-down: click a theme to see all individual responses tagged with that theme

**Operational metrics section:**
- Response rate by survey type and channel
- Average time-to-respond for detractor follow-ups (target: < 1 hour)
- Detractor recovery funnel: detractors → contacted → responded → issue resolved → recovered
- Promoter activation funnel: promoters → asked → completed action (review, referral, etc.)

### Quarterly Business Review (QBR) Report

**Section 1: Score trends**
- NPS: quarter-over-quarter and year-over-year trend
- CSAT: same, broken down by touchpoint
- CES: ranked list of workflows, change since last quarter
- Seasonal patterns: note any recurring patterns (e.g., NPS dips during renewal season)

**Section 2: Customer voice (qualitative)**
- Top 10 customer pain points (from detractor and low-CSAT comments)
- Top 5 customer praises (from promoter and high-CSAT comments)
- Verbatim quotes: 3-5 representative quotes that capture the quarter's sentiment
- Emerging themes: new topics that appeared this quarter that weren't present before

**Section 3: Detractor and promoter outcomes**
- Detractor recovery rate: % of detractors who scored 4-5 on recovery CSAT
- Detractor-to-churn rate: % of detractors who churned within 90 days of their score
- Promoter activation rate: % of promoters who completed the requested action
- Revenue from promoter referrals: dollars attributed to promoter-driven referrals

**Section 4: Impact analysis**
- Correlation between satisfaction scores and retention/churn
- Correlation between satisfaction scores and expansion revenue
- NPS by customer lifetime value tier: are your most valuable customers your happiest?
- Regression analysis: which factors (support quality, product usage, onboarding quality) most predict NPS?

**Section 5: Recommendations**
- Top 3 highest-impact improvements based on feedback data
- For each: problem statement, supporting data, recommended solution, expected impact on scores
- Resource requirements and timeline
- Carry-forward: items recommended last quarter that haven't been addressed yet

---

## Integration with Customer Health Score

Satisfaction scores are a critical input to the customer health scoring model. They provide direct sentiment signal that complements usage data and support data.

**How scores feed into health scoring (see `customer-health-scoring.template.md` for the full model):**

| Score | Health Impact | Weight |
|---|---|---|
| NPS 9-10 (Promoter) | Strong positive signal | +15 health points |
| NPS 7-8 (Passive) | Neutral — no impact | +0 health points |
| NPS 0-6 (Detractor) | Strong negative signal | -20 health points |
| CSAT trend: improving (3+ consecutive interactions above 4.0) | Positive momentum | +5 health points |
| CSAT trend: declining (3+ consecutive interactions below 3.5) | Negative momentum | -10 health points |
| CES < 4.0 on primary workflow | High-friction risk | -10 health points |
| No survey response in 6+ months | Disengagement signal | -5 health points |

**Combined risk signals (trigger immediate CSM review):**
- NPS detractor + declining CSAT trend = "Critical" health status
- NPS detractor + declining CSAT + CES < 4.0 = "Emergency" — CSM calls the customer today
- NPS passive + no survey response in 2 quarters = "Silent risk" — customer may be disengaging

**Health score update frequency:**
- NPS events: update health score within 1 hour of score submission
- CSAT events: update health score daily (batch process overnight)
- CES events: update health score weekly

---

## Implementation Checklist

### Phase 1: NPS Automation (Weeks 1-2)
- [ ] Configure NPS survey with {{CX_NPS_FREQUENCY}} cadence and audience targeting
- [ ] Build detractor alert pipeline (Slack + email, within 5 minutes of submission)
- [ ] Create detractor follow-up email templates (personalized starting points)
- [ ] Set up detractor assignment workflow (CX lead assigns within 30 minutes)
- [ ] Build promoter activation email templates (review, referral, case study, advisory)
- [ ] Implement passive follow-up automation ("What would make you a 10?")
- [ ] Configure loop-closing automation ("You asked, we built it" notifications)

### Phase 2: CSAT Automation (Weeks 3-4)
- [ ] Configure post-interaction CSAT for each touchpoint (support, chat, onboarding)
- [ ] Set up CSAT response handling (score 1-2 alert, score 4-5 positive reinforcement)
- [ ] Build CSAT-by-touchpoint tracking (separate dashboards for each)
- [ ] Implement conditional follow-up based on score (different questions for different scores)
- [ ] Configure response rate monitoring (alert if < 15%)

### Phase 3: CES Implementation (Week 5)
- [ ] Identify top 5 workflows to measure with CES
- [ ] Configure CES surveys with workflow-specific triggers
- [ ] Build CES-by-workflow dashboard (ranked, lowest to highest)
- [ ] Set up CES < 4.0 alert for UX team
- [ ] Create CES improvement tracking (before/after comparison)

### Phase 4: Reporting and Alerting (Weeks 6-7)
- [ ] Build executive summary dashboard (NPS + CSAT + detractor count + promoter actions)
- [ ] Build detailed dashboard (all sections: NPS, CSAT, CES, free-text, operational)
- [ ] Configure all automated alerts (see alert configuration table)
- [ ] Set up weekly executive summary email distribution
- [ ] Create QBR report template and data pipeline
- [ ] Implement alert fatigue prevention (batching, escalation, snooze)

### Phase 5: Integration and Optimization (Week 8+)
- [ ] Connect satisfaction scores to customer health scoring model
- [ ] Implement combined risk signal alerts (detractor + declining CSAT + low CES)
- [ ] Set up correlation analysis between satisfaction and retention/churn
- [ ] Build promoter referral revenue attribution tracking
- [ ] Train CX team on detractor intervention playbook (role-play exercises)
- [ ] Train product team on reading and acting on CES data
- [ ] Establish monthly satisfaction review meeting (CX + Product + Engineering)
- [ ] Document runbooks for each alert type (who does what when it fires)

---

## Appendix: Metrics Reference Card

| Metric | Formula | Target | Frequency | Min Sample |
|---|---|---|---|---|
| NPS | %Promoters - %Detractors | {{CX_NPS_BENCHMARK}} | {{CX_NPS_FREQUENCY}} | 100 |
| CSAT | Average score (1-5) | {{CX_CSAT_TARGET}} | Per interaction | 30 per period |
| CES | Average score (1-7) | ≥ 5.5 | Per workflow | 30 per workflow |
| Detractor recovery rate | Recovered / Total detractors | > 30% | Quarterly | 20 detractors |
| Promoter activation rate | Activated / Total promoters | > 15% | Quarterly | 50 promoters |
| Survey response rate | Responses / Surveys sent | > 15% | Monthly | N/A |
| Time to detractor response | Median hours from alert to outreach | < 1 hour | Weekly | N/A |
| Loop closure rate | Notified / Total passive suggestions shipped | > 50% | Quarterly | N/A |

---

*Cross-references:*
- `feedback-collection-system.template.md` — Survey design, trigger logic, data model, collection channels
- `customer-health-scoring.template.md` — Health scoring model that consumes satisfaction scores
- `20-post-launch/user-feedback-loops.template.md` — Turning feedback into product roadmap decisions
- `PLACEHOLDER-REGISTRY.md` — All placeholder definitions including {{CX_NPS_FREQUENCY}}, {{CX_CSAT_TARGET}}, {{CX_NPS_BENCHMARK}}
