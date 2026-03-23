# NPS Surveys and Feedback Loop System for {{PROJECT_NAME}}

> Systematically collect, analyze, and act on customer feedback to drive product improvement and customer advocacy.

---

## Net Promoter Score (NPS) Basics

NPS is the industry-standard measure of customer loyalty and satisfaction. It answers one question:

> "On a scale of 0-10, how likely are you to recommend {{PROJECT_NAME}} to a friend or colleague?"

### NPS Categories

| Score | Category | Meaning | Typical Response |
|-------|----------|---------|-----------------|
| 9-10 | **Promoter** | Loyal enthusiasts who will keep buying and refer others | "I love this product" |
| 7-8 | **Passive** | Satisfied but unenthusiastic — vulnerable to competition | "It is fine" |
| 0-6 | **Detractor** | Unhappy customers who can damage your brand through word-of-mouth | "I have complaints" |

### NPS Calculation

```
NPS = (% of Promoters) - (% of Detractors)

Example:
100 responses:
  40 Promoters (9-10)  = 40%
  35 Passives (7-8)    = 35% (not used in calculation)
  25 Detractors (0-6)  = 25%

NPS = 40% - 25% = +15

Range: -100 (all detractors) to +100 (all promoters)
```

### NPS Benchmarks

| NPS Range | Rating | Context |
|-----------|--------|---------|
| +70 to +100 | World-class | Apple, Tesla, USAA — exceptional loyalty |
| +50 to +69 | Excellent | Strong advocacy, word-of-mouth growth engine |
| +30 to +49 | Good | Solid base, room for improvement |
| +0 to +29 | Acceptable | More work needed, but not in trouble |
| -1 to -30 | Concerning | Detractors outnumber promoters — fix urgently |
| Below -30 | Critical | Serious product or experience problems |

### Industry Benchmarks (SaaS)

| Category | Median NPS | Top Quartile |
|----------|-----------|-------------|
| B2B SaaS overall | +30 to +40 | +50+ |
| Developer tools | +40 to +50 | +60+ |
| Marketing tools | +25 to +35 | +45+ |
| HR/People tools | +30 to +40 | +50+ |
| CRM/Sales tools | +20 to +30 | +40+ |

---

## Survey Timing

When you ask matters as much as what you ask. Wrong timing produces biased or irrelevant data.

### Trigger-Based Survey Schedule

| Trigger | When to Send | Why | Expected Response Rate |
|---------|-------------|-----|----------------------|
| Post-onboarding | 14-21 days after signup | Captures first impression after real usage | 20-30% |
| Quarterly pulse | Every 90 days (for active users) | Tracks sentiment over time | 15-25% |
| After major feature use | First time using a key feature | Feature-specific satisfaction | 10-20% |
| After support interaction | 24 hours after ticket resolution | Service quality measurement | 25-35% |
| Pre-renewal (annual plans) | 60 days before renewal | Catch issues before they cause churn | 20-30% |
| Post-upgrade/expansion | 30 days after plan change | Validate upgrade satisfaction | 15-25% |
| After milestone achievement | When user hits a success milestone | Capture positive sentiment | 25-35% |

### Timing Rules

- **Never survey during onboarding** (Day 0-7) — too early for meaningful feedback
- **Never survey after a negative experience** immediately — let emotions cool for 24 hours
- **Maximum survey frequency:** Once per quarter per user (avoid survey fatigue)
- **Best days:** Tuesday through Thursday
- **Best times:** 10am-2pm in user's local timezone
- **Avoid:** Mondays, Fridays, weekends, holidays

---

## Survey Implementation

### In-App NPS Survey

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  How likely are you to recommend {{PROJECT_NAME}}       │
│  to a friend or colleague?                              │
│                                                         │
│  0   1   2   3   4   5   6   7   8   9   10            │
│  [0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]         │
│                                                         │
│  Not at all likely              Extremely likely         │
│                                                         │
│                              [Maybe later]  [Dismiss]    │
└─────────────────────────────────────────────────────────┘
```

**Implementation details:**
- Slide-in from bottom-right corner (non-blocking)
- Show after user completes a meaningful action (not on page load)
- Allow "maybe later" (re-ask in 7 days) and "dismiss" (do not re-ask for 90 days)
- Auto-dismiss after 30 seconds if no interaction
- Store response with user ID, timestamp, and context (page, feature last used)

### Email NPS Survey

```
Subject: Quick question about {{PROJECT_NAME}} (takes 5 seconds)
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

How likely are you to recommend {{PROJECT_NAME}} to a
friend or colleague?

[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
Not likely                              Very likely

Just click a number — it takes one second.

— {{SENDER_NAME}}
```

**Key design:** Make the numbers clickable directly in the email (1-click rating). The click should link to a landing page that records the score and shows the follow-up question.

### Tool Options

| Tool | Type | Starting Price | Best For |
|------|------|---------------|----------|
| **Delighted** | Dedicated NPS | $224/mo | Full NPS platform, multi-channel |
| **Wootric** (InMoment) | Dedicated NPS | $89/mo | In-app NPS with segmentation |
| **AskNicely** | Dedicated NPS | Custom pricing | Enterprise NPS with workflows |
| **Typeform** | General survey | $25/mo | Beautiful surveys, custom flows |
| **Hotjar** | Feedback + NPS | $32/mo | NPS + heatmaps + recordings |
| **Custom build** | In-house | Dev time | Full control, no recurring cost |
| **PostHog** | Product analytics + surveys | Free tier | Integrated with product analytics |

**Recommendation:** Start with a simple custom implementation or Typeform. Move to a dedicated NPS tool (Delighted or Wootric) once you have product-market fit and want deeper analytics.

---

## Follow-Up Questions

The number alone is useful; the follow-up text is where the real insights live.

### For Promoters (9-10)

```
[After selecting 9 or 10]

Thank you! We are glad you are enjoying {{PROJECT_NAME}}.

What do you love most about it?
[Open text field                                    ]

[Submit]

Would you be willing to:
[ ] Leave a review on {{REVIEW_PLATFORM}}
[ ] Be featured in a case study
[ ] Refer a friend (and get {{REFERRAL_INCENTIVE}})
```

**Actions on promoter feedback:**
1. Thank them personally (automated email within 24 hours)
2. Extract quotes for marketing (with permission)
3. Ask for public review on G2, Capterra, Product Hunt, or relevant platform
4. Invite to referral program
5. Consider for case study, testimonial, or advisory board
6. Tag in CRM as "advocate"

### For Passives (7-8)

```
[After selecting 7 or 8]

Thanks for the feedback!

What would make {{PROJECT_NAME}} a 10 for you?
[Open text field                                    ]

[Submit]
```

**Actions on passive feedback:**
1. Analyze themes — passives often have specific, actionable requests
2. Share with product team for roadmap input
3. Follow up personally if they mention something in progress
4. Send targeted email when the requested improvement ships
5. Re-survey in 60 days to check for movement

### For Detractors (0-6)

```
[After selecting 0-6]

We are sorry to hear that. Your feedback is important to us.

What is your biggest frustration with {{PROJECT_NAME}}?
[Open text field                                    ]

[Submit]

Would you like someone from our team to reach out
to help resolve this?
[ ] Yes, please contact me
[ ] No, just noting the feedback
```

**Actions on detractor feedback:**
1. **Alert immediately:** Notify CS team or founder within 1 hour
2. **Respond within 24-48 hours:** Personal email acknowledging their frustration
3. **Investigate:** Understand the root cause of their dissatisfaction
4. **Resolve:** Fix the issue if possible, or explain when it will be fixed
5. **Follow up:** Re-check satisfaction after resolution
6. **Track:** Monitor health score for churn risk

---

## Closing the Feedback Loop

Collecting feedback without acting on it is worse than not collecting it at all. Users who give feedback and see no response become cynical.

### The Feedback Action Framework

```
Feedback received
      |
      v
Categorize: Bug / Feature request / UX issue / Pricing / Support / Other
      |
      v
Route to owner: Product / Engineering / CS / Founder
      |
      v
Acknowledge to user (within 24-48 hours)
      |
      v
Investigate and prioritize
      |
      v
Act: Fix / Build / Explain / Decline
      |
      v
Close the loop: Tell the user what you did
```

### Response Templates

**Acknowledging a Detractor:**
```
Hi {{FIRST_NAME}},

Thank you for your honest feedback about {{PROJECT_NAME}}.
I read your response personally and I am sorry about your experience.

You mentioned {{PARAPHRASE_THEIR_CONCERN}}. That is a fair criticism.

Here is what we are doing about it:
{{ACTION_BEING_TAKEN}}

I will follow up with you in {{TIMEFRAME}} with an update.

If you would like to discuss this further, reply to this email
or book a time with me: [Calendar link]

— {{FOUNDER_OR_CS_NAME}}
```

**Updating a user when their feedback is addressed:**
```
Hi {{FIRST_NAME}},

Remember when you told us {{PARAPHRASE_FEEDBACK}}?

We listened. Here is what we built:
{{FEATURE_OR_FIX_DESCRIPTION}}

[Check it out ->]

Your feedback directly shaped this improvement.
Thank you for helping us make {{PROJECT_NAME}} better.

— {{SENDER_NAME}}
```

### Feeding Feedback into Product Roadmap

```
Monthly Feedback Review Process:

1. Aggregate all NPS verbatims from the past 30 days
2. Categorize by theme (feature request, bug, UX, pricing, etc.)
3. Count frequency of each theme
4. Cross-reference with health scores and churn data
5. Identify top 3-5 themes for product team review
6. Discuss in monthly product planning meeting
7. Add accepted items to public roadmap (if applicable)
8. Notify affected users when items ship
```

---

## User Interview Script

NPS gives you quantitative data. Interviews give you the "why" behind the numbers.

### Interview Logistics

- **Duration:** 20-30 minutes
- **Format:** Video call (Zoom, Google Meet) — record with permission
- **Incentive:** $25-50 gift card (Amazon, Visa) or account credit
- **Sample size:** 5-10 interviews per segment per quarter
- **Target:** Mix of promoters, passives, and detractors

### Recruitment Email

```
Subject: Can I pick your brain for 20 minutes? (${{INCENTIVE_AMOUNT}} gift card)
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

I am {{SENDER_NAME}}, and I lead product at {{PROJECT_NAME}}.

I am trying to understand how people like you use our product
and how we can make it better. Would you be up for a quick
20-minute video chat?

It is casual — no preparation needed. Just your honest thoughts.

As a thank-you, I will send you a ${{INCENTIVE_AMOUNT}}
{{INCENTIVE_TYPE}} gift card.

[Book a time that works for you ->]

If chat is not your thing, I also have a 5-minute survey:
[Take the survey instead]

— {{SENDER_NAME}}
```

### Interview Questions (10 Core Questions)

**Opening (goals and context):**
1. "Tell me about your role and what you do day-to-day."
2. "What were you trying to accomplish when you first started using {{PROJECT_NAME}}?"

**Current workflow:**
3. "Walk me through how you typically use {{PROJECT_NAME}} in a given week."
4. "What is the most valuable thing {{PROJECT_NAME}} does for you?"

**Pain points:**
5. "What is the most frustrating thing about using {{PROJECT_NAME}}?"
6. "If you could change one thing about the product, what would it be?"

**Alternatives and competition:**
7. "Before {{PROJECT_NAME}}, how did you handle this? What tools or processes did you use?"
8. "Have you looked at or tried any alternatives? What made you stay with us (or consider leaving)?"

**Value perception:**
9. "If {{PROJECT_NAME}} disappeared tomorrow, how would you feel and what would you do?"
10. "Is there anything I did not ask about that you think I should know?"

### Interview Tips

- **Listen more than talk:** Aim for 80% them, 20% you
- **Ask "why" and "tell me more":** Dig deeper on interesting responses
- **Avoid leading questions:** "Do you like feature X?" → "How do you feel about feature X?"
- **Take notes on emotions:** Note when they get excited, frustrated, or confused
- **Record everything:** Transcribe and share key quotes with the team

---

## Feedback Board (Public Roadmap)

Give users a voice in what gets built next. Transparency builds trust and reduces churn.

### Platform Options

| Tool | Starting Price | Best For |
|------|---------------|----------|
| **Canny** | $79/mo | Feature voting, roadmap, changelog |
| **UserVoice** | $799/mo | Enterprise feedback management |
| **Productboard** | $20/user/mo | Product management + feedback |
| **Nolt** | $25/mo | Simple, clean feature voting |
| **GitHub Discussions** | Free | Developer-focused products |
| **Fider** | Free (self-hosted) | Open-source feedback board |
| **Notion (public page)** | Free | Lightweight public roadmap |

### Feedback Board Structure

```
{{PROJECT_NAME}} Product Roadmap

UNDER CONSIDERATION
  [142 votes] {{FEATURE_REQUEST_1}} — {{DESCRIPTION}}
  [98 votes]  {{FEATURE_REQUEST_2}} — {{DESCRIPTION}}
  [76 votes]  {{FEATURE_REQUEST_3}} — {{DESCRIPTION}}

PLANNED
  {{FEATURE_4}} — Expected {{QUARTER}}
  {{FEATURE_5}} — Expected {{QUARTER}}

IN PROGRESS
  {{FEATURE_6}} — Started {{DATE}}, target {{DATE}}

RECENTLY SHIPPED
  {{FEATURE_7}} — Launched {{DATE}} [View changelog]
  {{FEATURE_8}} — Launched {{DATE}} [View changelog]
```

### Running a Feedback Board Well

- **Respond to every submission** within 1 week (even if the answer is "not now")
- **Merge duplicates** to keep voting accurate
- **Update statuses** regularly — nothing kills trust like a stale roadmap
- **Explain "no"** when declining popular requests (users respect honesty)
- **Celebrate launches** — notify voters when their requested feature ships
- **Do not let votes dictate roadmap** entirely — votes are one input, not the only input

---

## NPS Analysis and Reporting

### Monthly NPS Report Template

```
{{PROJECT_NAME}} NPS Report — {{MONTH}} {{YEAR}}

OVERALL NPS: ____
Previous month: ____  |  Change: +/- ____  |  Trend: ↑/↓/→

RESPONSE BREAKDOWN:
Promoters (9-10):  ____  (____%)  ████████████████████
Passives (7-8):    ____  (____%)  ████████████
Detractors (0-6):  ____  (____%)  ██████

RESPONSE RATE: ____% (surveys sent: ____, responded: ____)

NPS BY SEGMENT:
  Free users:      ____
  Paid users:      ____
  Enterprise:      ____
  New (<90 days):  ____
  Veteran (>1yr):  ____

TOP THEMES FROM VERBATIMS:
  Positive:
  1. {{POSITIVE_THEME_1}} — mentioned ____ times
  2. {{POSITIVE_THEME_2}} — mentioned ____ times
  3. {{POSITIVE_THEME_3}} — mentioned ____ times

  Negative:
  1. {{NEGATIVE_THEME_1}} — mentioned ____ times
  2. {{NEGATIVE_THEME_2}} — mentioned ____ times
  3. {{NEGATIVE_THEME_3}} — mentioned ____ times

ACTIONS TAKEN:
  - Detractors contacted: ____/____
  - Promoters asked for reviews: ____
  - Feedback items added to roadmap: ____
  - Issues resolved this month: ____

QUARTER-OVER-QUARTER TREND:
  Q1: ____
  Q2: ____
  Q3: ____
  Q4: ____
```

---

## NPS Survey Implementation Plan for {{PROJECT_NAME}}

```
Product: {{PROJECT_NAME}}
Starting NPS: ____  (if known)
Target NPS: ____  (12-month goal)
Survey tool: {{NPS_TOOL}}

PHASE 1: SETUP (Week 1-2)
- [ ] Choose NPS tool or build custom implementation
- [ ] Design in-app survey widget (slide-in modal)
- [ ] Design email survey template (1-click rating)
- [ ] Define survey triggers and timing rules
- [ ] Set up response storage and analytics
- [ ] Create follow-up question flows (promoter/passive/detractor)
- [ ] Build automated response workflows

PHASE 2: LAUNCH (Week 3-4)
- [ ] Deploy in-app NPS to 10% of eligible users (test)
- [ ] Send first email NPS survey to small batch (100 users)
- [ ] Verify data collection and routing works
- [ ] Test follow-up email workflows
- [ ] Fix any issues and expand to full rollout

PHASE 3: OPERATIONALIZE (Month 2+)
- [ ] Set up automated quarterly NPS surveys
- [ ] Create detractor response SLA (24-48 hours)
- [ ] Build monthly NPS report template
- [ ] Schedule monthly feedback review with product team
- [ ] Set up promoter-to-advocate pipeline (reviews, referrals)
- [ ] Implement feedback board for public roadmap
- [ ] Plan first round of user interviews (5-10 users)

ONGOING CADENCE:
- Weekly: Review detractor responses and ensure SLA is met
- Monthly: Generate NPS report, review themes with product team
- Quarterly: Full NPS survey cycle, user interviews, roadmap update
- Annually: Benchmark against industry, set new NPS targets
```

---

*This NPS and feedback system is part of the {{PROJECT_NAME}} marketing system. NPS is a long-term metric -- focus on trend direction rather than any single score.*
