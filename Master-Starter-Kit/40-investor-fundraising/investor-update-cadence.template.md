# Investor Update Cadence

> Monthly and quarterly investor update templates, metrics tables, ask framework, distribution list management, and frequency rules by stage for {{PROJECT_NAME}}. Consistent, transparent investor updates are the single highest-ROI activity for investor relations — they build trust, unlock help, and set you up for future rounds.

---

## 1. Monthly Email Template

### Template: Standard Monthly Update

```
Subject: {{PROJECT_NAME}} — [Month Year] Update

Hi [First Name / Team],

Here is our [Month Year] update for {{PROJECT_NAME}}.

---

HIGHLIGHTS (Top 3 Wins)

1. [Win #1 — specific, quantified: "Closed 12 new customers,
   bringing MRR to $85K (+18% MoM)"]
2. [Win #2 — "Launched [feature], adopted by 40% of users
   in first two weeks"]
3. [Win #3 — "Hired VP Engineering from [Company], starts [Date]"]

---

LOWLIGHTS (Top 2-3 Challenges)

1. [Challenge #1 — be specific and honest: "Churn spiked to 5%
   this month due to [reason]. We are addressing this by [action]."]
2. [Challenge #2 — "Sales cycle lengthened from 21 to 35 days.
   Investigating root cause — hypothesis is [X]."]
3. [Challenge #3 — if applicable]

---

KEY METRICS

[See Metrics Table below — copy the filled-in table here]

---

ASKS (How You Can Help)

1. [Specific Ask #1 — "Intro to [Person] at [Company] for
   partnership discussion"]
2. [Specific Ask #2 — "Referrals for VP Marketing candidates
   with B2B SaaS experience"]
3. [Specific Ask #3 — "Feedback on our pricing page redesign:
   [link]"]

---

WHAT'S NEXT (30-Day Focus)

1. [Priority #1 for next month]
2. [Priority #2]
3. [Priority #3]

---

Thanks for your continued support. Happy to jump on a call
if anything here prompts questions.

Best,
[Your Name]
CEO, {{PROJECT_NAME}}
```

### Template Structure Rules

| Section | Purpose | Length | Required? |
|---|---|---|---|
| **Highlights** | Build confidence; show momentum | 3 items, 1-2 lines each | Yes |
| **Lowlights** | Build trust; show self-awareness | 2-3 items, 1-2 lines each | Yes |
| **Key Metrics** | Provide data for pattern recognition | Table format | Yes |
| **Asks** | Activate investor networks and expertise | 2-3 specific, actionable asks | Yes |
| **What's Next** | Set expectations for next update | 2-3 priorities | Yes |
| **Team Update** | Note key hires, departures | 1-3 items if applicable | Optional |
| **Product Update** | Major releases or pivots | 2-3 items if applicable | Optional |
| **Fundraising Update** | If actively raising or planning to | Brief status | Conditional |

---

## 2. Metrics Table

### Monthly Metrics Table

| Metric | 3 Mo Ago | 2 Mo Ago | Last Mo | This Mo | MoM Change | vs. Plan |
|---|---|---|---|---|---|---|
| **Revenue** | | | | | | |
| MRR | $ | $ | $ | $ | % | |
| ARR (Annualized) | $ | $ | $ | $ | % | |
| New MRR | $ | $ | $ | $ | | |
| Churned MRR | $ | $ | $ | $ | | |
| Net New MRR | $ | $ | $ | $ | | |
| **Customers** | | | | | | |
| Total Customers | | | | | | |
| New Customers | | | | | | |
| Churned Customers | | | | | | |
| Logo Churn Rate | % | % | % | % | | |
| **Engagement** | | | | | | |
| Active Users (DAU/WAU/MAU) | | | | | | |
| Key Feature Adoption | % | % | % | % | | |
| NPS / CSAT | | | | | | |
| **Financial Health** | | | | | | |
| Cash Balance | $ | $ | $ | $ | | |
| Monthly Burn | $ | $ | $ | $ | | |
| Runway | mo | mo | mo | mo | | |
| **Team** | | | | | | |
| Headcount | | | | | | |
| Hires This Month | | | | | | |
| Open Roles | | | | | | |

### Metrics Selection by Stage

<!-- IF {{FUNDRAISING_STAGE}} == "pre-seed" -->
**Pre-Seed Focus Metrics:**
- Waitlist / sign-up growth
- Pilot customer count and feedback
- Product development milestones
- Customer discovery interviews conducted
- Cash balance and runway
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "seed" -->
**Seed Focus Metrics:**
- MRR and MoM growth rate
- Customer count and acquisition rate
- Churn rate (logo and revenue)
- CAC and early LTV estimates
- Cash balance, burn, and runway
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "series-a" -->
**Series A Focus Metrics:**
- ARR and growth rate (MoM and YoY)
- Net Revenue Retention
- Gross Margin
- CAC, LTV, LTV:CAC, payback period
- Headcount and efficiency metrics (ARR per employee)
<!-- ENDIF -->

---

## 3. Ask Framework

### How to Make Effective Asks

| Principle | Example |
|---|---|
| **Be specific** | "Intro to Jane Smith, VP Product at Stripe" not "Intros to fintech companies" |
| **Provide context** | "We are exploring [partnership type] because [reason]" |
| **Make it easy** | "Here is a forwardable blurb you can send to Jane" |
| **Limit to 2-3** | More than 3 asks dilutes all of them |
| **Rotate asks** | Do not ask the same investor for the same type of help repeatedly |
| **Close the loop** | In the next update, report on outcomes from previous asks |

### Ask Categories

| Category | Examples | Best Investors to Ask |
|---|---|---|
| **Customer Intros** | Intro to specific companies or people | Investors with relevant portfolio/network |
| **Hiring** | Candidate referrals for specific roles | Investors with operating backgrounds |
| **Strategic Advice** | Input on pricing, GTM, product direction | Investors with domain expertise |
| **Investor Intros** | Intros to potential future-round investors | Lead investor, well-connected angels |
| **Partner Intros** | Intros to technology or distribution partners | Strategic investors |
| **Feedback** | Review of materials, strategy documents | Investors who offer to be hands-on |
| **Signal Boost** | Retweets, blog mentions, conference intros | Investors with public platforms |

### Forwardable Blurb Template

Include this below your ask so the investor can forward directly:

```
Hi [Target Person],

I wanted to introduce you to [Your Name], CEO of {{PROJECT_NAME}}.
They're building [one sentence description] and are currently at
[key traction metric].

I thought you two should connect because [specific reason].

I'll let [Your Name] follow up directly. [Your Name], meet
[Target Person] — [one line about why they're relevant].
```

---

## 4. Distribution List

### Investor Communication Tiers

| Tier | Who | Receives | Cadence | Channel |
|---|---|---|---|---|
| **Tier 1 — Board** | Board members, lead investors | Board deck + monthly update + ad hoc calls | {{BOARD_MEETING_CADENCE}} (board) + {{INVESTOR_UPDATE_CADENCE}} (updates) | Email + board portal |
| **Tier 2 — Active Investors** | Major non-board investors, active angels | Monthly update | {{INVESTOR_UPDATE_CADENCE}} | Email |
| **Tier 3 — Passive Investors** | Small check writers, syndicate participants | Quarterly summary | Quarterly | Email |
| **Tier 4 — Prospective** | Investors you are building relationships with (not yet invested) | Quarterly highlights (abbreviated) | Quarterly | Email (BCC) |

### Distribution List

| Name | Fund | Tier | Email | Added Date | Notes |
|---|---|---|---|---|---|
| | | Tier 1 | | | Board member |
| | | Tier 1 | | | Lead investor |
| | | Tier 2 | | | |
| | | Tier 2 | | | |
| | | Tier 3 | | | |
| | | Tier 4 | | | Prospective — met at [event] |

### List Management Rules

- [ ] Update distribution list within 7 days of closing new investment
- [ ] Move investors between tiers as engagement level changes
- [ ] Remove investors who request removal (immediately, no questions)
- [ ] Add prospective investors strategically — future fundraising pipeline
- [ ] Use BCC for Tier 3 and Tier 4 to protect email privacy
- [ ] Maintain separate lists for different communication tiers

---

## 5. Frequency Rules by Stage

### Recommended Cadence

| Stage | Investor Updates | Board Meetings | Ad Hoc Calls (with lead) |
|---|---|---|---|
| **Pre-Seed** | Monthly (brief) | None or informal quarterly | As needed |
| **Seed** | Monthly | Quarterly (informal or formal) | Monthly or bi-weekly |
| **Series A** | Monthly | Quarterly (formal) | Bi-weekly or monthly |
| **Series B+** | Monthly or Bi-Monthly | Quarterly (formal) | Weekly or bi-weekly |

### Cadence Rules

| Rule | Implementation |
|---|---|
| **Never skip an update** | Even if the month was bad — especially if the month was bad |
| **Send on a consistent date** | Pick a day (e.g., 5th business day of the month) and stick to it |
| **Keep it under 5 minutes to read** | Investors receive many updates — respect their time |
| **Include metrics every time** | Consistency in metrics allows pattern recognition |
| **Lead with lowlights when things are tough** | Investors respect honesty; they lose trust when bad news is buried |
| **Send even when not fundraising** | The best time to build investor relationships is when you do not need money |

### When to Send Unscheduled Updates

| Trigger | Action | Timing |
|---|---|---|
| Major win (large customer, key hire, press) | Send brief "good news" update | Within 48 hours |
| Major challenge (key departure, lost customer, cash crunch) | Call lead investor first, then send written update | Within 24 hours |
| Fundraising launch | Notify all existing investors before public outreach | 1-2 weeks before outreach |
| Term sheet received | Notify board members and lead investor | Within 24 hours |
| Round closed | Send closing announcement to all tiers | Within 48 hours |
| Pivot or major strategic change | Call board members individually, then send written update | Before executing the change |

---

## 6. Annual Update

### Annual Update Template (Sent in January or at Fiscal Year End)

```
Subject: {{PROJECT_NAME}} — [Year] Year in Review

Hi [First Name / Team],

As we close out [Year], I want to share a comprehensive look
at where {{PROJECT_NAME}} stands and where we are headed.

---

YEAR IN REVIEW — BY THE NUMBERS

| Metric | Start of Year | End of Year | Growth |
|---|---|---|---|
| ARR/MRR | $ | $ | % |
| Customers | | | % |
| Team Size | | | % |
| Cash Balance | $ | $ | |
| [Key Metric] | | | |

---

TOP 5 ACHIEVEMENTS

1. [Achievement with quantified impact]
2. [Achievement]
3. [Achievement]
4. [Achievement]
5. [Achievement]

---

TOP 3 LESSONS LEARNED

1. [What you learned and how it changed your approach]
2. [Lesson]
3. [Lesson]

---

YEAR AHEAD — PRIORITIES

1. [Priority #1 with target outcome]
2. [Priority #2]
3. [Priority #3]

---

FUNDRAISING STATUS

[Current runway, any plans to raise, timeline if applicable]

---

THANK YOU

[Personal note to investors — specific ways they helped this year,
acknowledgment of their support]

Best,
[Your Name]
CEO, {{PROJECT_NAME}}
```

---

## Investor Update Best Practices

### Do

- [ ] Send every month without exception — consistency builds trust
- [ ] Be honest about challenges — investors have seen it all and can help if they know
- [ ] Make specific, actionable asks — investors want to help but need direction
- [ ] Close the loop on previous asks — "Last month I asked for X, here is what happened"
- [ ] Keep it concise — under 500 words for the main body
- [ ] Include the same metrics every month for longitudinal tracking
- [ ] Send to prospective investors — they are your future fundraising pipeline
- [ ] Track who responds and engages — this signals who will be helpful long-term
- [ ] Include a personal touch — one line about the team, a customer story, or a lesson learned

### Do Not

- [ ] Skip months — the months you want to skip are the most important to send
- [ ] Write a novel — long updates get skimmed or skipped
- [ ] Hide bad news — it destroys trust and limits the board's ability to help
- [ ] Send only when you need something — build the relationship consistently
- [ ] Use jargon or internal acronyms — some investors are not in your domain
- [ ] Forget to update the distribution list — stale lists mean missed communication
- [ ] Send without proofreading — sloppy updates signal sloppy operations
- [ ] Include confidential information in Tier 3/4 updates — use appropriate detail levels by tier
