# /marketing-audit

Audit current marketing efforts for {{PROJECT_NAME}} against the marketing framework. Identifies gaps, missed opportunities, and priority actions.

## When to Use

- Monthly marketing review
- When growth stalls and you need to identify what's missing
- Before quarterly planning
- When onboarding a new marketing team member

## Steps

### Step 1: Read Marketing Framework

Read the master marketing plan from `{{DOCS_PATH}}/marketing/MARKETING-PLAN.md` (or regenerate with `/generate-marketing-plan` if it doesn't exist).

Read the current MARKETING_CONFIG for planned channels and targets.

### Step 2: Audit Each Marketing Area

For each area below, check current status and score 0-3:
- **0** = Not started
- **1** = Partially done (some effort, not systematic)
- **2** = Implemented (running but not optimized)
- **3** = Optimized (running, measured, and improving)

#### Areas to Audit:

**Foundation:**
- [ ] Brand voice guide defined
- [ ] Value proposition documented
- [ ] Messaging framework created
- [ ] Competitive positioning clear
- [ ] Pricing strategy validated

**Website & Conversion:**
- [ ] Landing page live and optimized
- [ ] Pricing page published
- [ ] SEO technical checklist complete
- [ ] Analytics tracking set up (GA4/PostHog/Mixpanel)
- [ ] Conversion tracking configured

**Content & SEO:**
- [ ] Content calendar active
- [ ] Blog publishing on schedule
- [ ] SEO keyword targets defined
- [ ] Content being repurposed across channels

**Social Media:**
- [ ] Profiles created on selected platforms
- [ ] Posting on schedule
- [ ] Community engagement active
- [ ] Building in public (if applicable)

**Email Marketing:**
- [ ] Email list growing
- [ ] Welcome sequence active
- [ ] Newsletter publishing
- [ ] Automation workflows running
- [ ] Deliverability maintained

**Launch & Distribution:**
- [ ] Directory listings submitted
- [ ] Product Hunt launch planned/completed
- [ ] Beta program active (if pre-launch)
- [ ] App Store listing optimized (if mobile)

**Growth:**
- [ ] Outreach campaigns running
- [ ] Partnerships identified/active
- [ ] Referral program live
- [ ] Paid ads (if budget allows)

**Retention:**
- [ ] User onboarding optimized
- [ ] Churn monitoring active
- [ ] NPS/feedback system running
- [ ] Re-engagement campaigns active

**Tracking:**
- [ ] KPI dashboard maintained
- [ ] Weekly/monthly reports generated
- [ ] A/B tests running
- [ ] Marketing ROI tracked

### Step 3: Gap Analysis

Compare audit results against the planned marketing strategy:
- Which planned channels haven't been started?
- Which active channels are underperforming?
- What quick wins are available (high impact, low effort)?
- What's blocking progress on key initiatives?

### Step 4: Read Gotchas

Cross-reference with:
- `19-marketing/marketing-gotchas/developer-marketing-mistakes.md`
- `19-marketing/marketing-gotchas/growth-mistakes.md`

Flag any anti-patterns detected in the current marketing efforts.

### Step 5: Generate Report and Actions

### Output

```
MARKETING AUDIT REPORT
======================
Project: {{PROJECT_NAME}}
Date: {today}
Overall score: {X}/30 ({percentage}%)

Area Scores:
  Foundation:         {X}/3
  Website/Conversion: {X}/3
  Content/SEO:        {X}/3
  Social Media:       {X}/3
  Email Marketing:    {X}/3
  Launch/Distribution:{X}/3
  Growth:             {X}/3
  Retention:          {X}/3
  Tracking:           {X}/3

Top Gaps (not started or underperforming):
1. {gap 1 — what's missing and why it matters}
2. {gap 2}
3. {gap 3}

Anti-Patterns Detected:
- {anti-pattern from gotchas}

Priority Actions (next 2 weeks):
1. {action 1 — specific, actionable, estimated effort}
2. {action 2}
3. {action 3}
4. {action 4}
5. {action 5}

Quick Wins (high impact, low effort):
- {quick win 1}
- {quick win 2}
- {quick win 3}
```

Save to `{{DOCS_PATH}}/marketing/audits/audit-{date}.md`

## Notes

- Run this audit at least monthly. Set a calendar reminder.
- The scoring is a self-assessment — be honest about what's actually running vs. what you planned to do.
- Priority actions should be added to your task management system immediately.
- Compare audits month-over-month to track marketing maturity growth.
