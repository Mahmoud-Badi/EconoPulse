# Re-Engagement and Win-Back Campaigns for {{PROJECT_NAME}}

> Strategies and templates to re-activate inactive users, win back churned customers, and maximize the lifetime value of every signup.

---

## Defining "Inactive"

Not all inactivity is equal. The right threshold depends on your product's natural usage frequency.

### Usage Frequency Baseline

| Product Type | Normal Usage | Inactive Threshold | Example |
|-------------|-------------|-------------------|---------|
| Daily-use SaaS (Slack, email) | Daily | No login in 3-5 days | Communication tools |
| Regular-use SaaS (project mgmt) | 3-5x/week | No login in 7-10 days | Asana, Jira |
| Periodic-use SaaS (analytics) | Weekly | No login in 14-21 days | Mixpanel, GA |
| Occasional-use tools | Monthly | No login in 30-45 days | Tax software, design tools |
| Mobile apps (social/content) | Daily | No open in 3-7 days | Social media, news |
| Mobile apps (utility) | As needed | No open in 14-30 days | Banking, travel |
| Marketplaces (buyer) | Variable | No visit in 14-30 days | E-commerce |
| Marketplaces (seller) | Regular | No listing update in 14 days | Etsy, eBay |

### For {{PROJECT_NAME}}

```
Expected usage frequency: {{EXPECTED_USAGE_FREQUENCY}}
Inactive threshold: No {{PRIMARY_ACTION}} in {{INACTIVE_THRESHOLD_DAYS}} days
Data source for tracking: {{ANALYTICS_TOOL}}
```

---

## Inactive User Segments

Segment inactive users by recency and status to tailor re-engagement approach.

| Segment | Definition | Urgency | Approach | Expected Reactivation Rate |
|---------|-----------|---------|----------|---------------------------|
| **Recently Inactive** | No activity for {{RECENT_INACTIVE_DAYS}} days | High — still warm | Gentle nudge, value reminder | 15-30% |
| **Lapsed** | No activity for {{LAPSED_DAYS}} days | Medium — cooling off | Stronger value proposition, social proof | 8-15% |
| **Dormant** | No activity for {{DORMANT_DAYS}} days | Low — mostly gone | Product updates, compelling offer | 3-8% |
| **Churned (cancelled)** | Actively cancelled subscription | Low — made a decision | Win-back with improvements/offers | 2-5% |
| **Involuntary Churned** | Lost due to payment failure | Medium — may not realize | Payment update + welcome back | 10-20% |

**Key principle:** The longer someone has been inactive, the harder they are to bring back. Invest most in the "recently inactive" segment where ROI is highest.

---

## Re-Engagement Email Sequences

### Sequence 1: Recently Inactive ({{RECENT_INACTIVE_DAYS}} days without activity)

**Email 1: "We Miss You" (Day {{RECENT_INACTIVE_DAYS}})**
```
Subject line options:
A: "It has been a while, {{FIRST_NAME}}"
B: "Your {{PROJECT_NAME}} workspace is waiting"
C: "Quick question — is everything okay?"

Body:

Hi {{FIRST_NAME}},

I noticed you have not logged into {{PROJECT_NAME}} recently.
No pressure — just wanted to check in.

Since you have been away:
- {{UPDATE_1}}
- {{UPDATE_2}}
- {{UPDATE_3}}

Your workspace is just as you left it, ready when you are.

[Log back in ->]

If something was not working for you, I would love to hear about it.
Just reply to this email.

— {{SENDER_NAME}}

P.S. Need a refresher? Here is a 2-minute guide to pick up where
you left off: [Link]
```
**Timing:** Send at the user's historical peak engagement time (if known), otherwise 10am Tuesday local time.

**Email 2: "Here's What You Missed" (Day {{RECENT_INACTIVE_DAYS + 4}})**
```
Subject line options:
A: "3 things that happened while you were away"
B: "New in {{PROJECT_NAME}}: {{FEATURE_NAME}}"
C: "{{FIRST_NAME}}, you are missing out on {{BENEFIT}}"

Body:

Hi {{FIRST_NAME}},

While you have been away, we have been busy making
{{PROJECT_NAME}} even better:

1. {{NEW_FEATURE_OR_UPDATE_1}}
   {{ONE_LINE_DESCRIPTION}}

2. {{NEW_FEATURE_OR_UPDATE_2}}
   {{ONE_LINE_DESCRIPTION}}

3. {{NEW_FEATURE_OR_UPDATE_3}}
   {{ONE_LINE_DESCRIPTION}}

[See what is new ->]

These updates are based on feedback from users like you.

— {{SENDER_NAME}}
```
**Timing:** 3-5 days after Email 1.

**Email 3: "Need Help?" (Day {{RECENT_INACTIVE_DAYS + 9}})**
```
Subject line options:
A: "Can I help with anything?"
B: "One question for you, {{FIRST_NAME}}"
C: "Is {{PROJECT_NAME}} still right for you?"

Body:

Hi {{FIRST_NAME}},

I wanted to reach out one more time. If {{PROJECT_NAME}} is not
meeting your needs, I genuinely want to understand why.

Would you mind sharing what led you to stop using it?

[ ] I got busy with other priorities
[ ] I could not figure out how to {{KEY_ACTION}}
[ ] It is missing a feature I need: ___________
[ ] I found another solution
[ ] Other: ___________

[Share feedback (takes 30 seconds)]

Your input directly shapes what we build next.

— {{SENDER_NAME}}
```
**Timing:** 4-5 days after Email 2.

---

### Sequence 2: Lapsed Users ({{LAPSED_DAYS}} days without activity)

**Email 1: "What's Been Happening" (Day {{LAPSED_DAYS}})**
```
Subject line options:
A: "A lot has changed at {{PROJECT_NAME}}"
B: "{{FIRST_NAME}}, here is what you have been missing"
C: "We have been working on something you will like"

Body:

Hi {{FIRST_NAME}},

It has been a while! We have been making big improvements to
{{PROJECT_NAME}} since your last visit:

[Key improvement with screenshot/GIF]

{{IMPROVEMENT_DESCRIPTION}}

This is one of the most requested features, and we think
you will love it.

[Check it out ->]

— {{SENDER_NAME}}
```

**Email 2: Value Reminder + Social Proof (Day {{LAPSED_DAYS + 5}})**
```
Subject line options:
A: "How {{CUSTOMER_NAME}} saved {{METRIC}} with {{PROJECT_NAME}}"
B: "{{NUMBER}} teams are using {{PROJECT_NAME}} to {{BENEFIT}}"
C: "The results speak for themselves"

Body:

Hi {{FIRST_NAME}},

Here is what teams like yours are accomplishing with {{PROJECT_NAME}}:

"{{TESTIMONIAL_QUOTE}}"
— {{TESTIMONIAL_AUTHOR}}, {{TESTIMONIAL_COMPANY}}

Key results:
- {{RESULT_1}}
- {{RESULT_2}}
- {{RESULT_3}}

Your account is still active and ready to go.

[Pick up where you left off ->]

— {{SENDER_NAME}}
```

**Email 3: Limited Offer (Day {{LAPSED_DAYS + 10}})**
```
Subject line options:
A: "A special offer for you, {{FIRST_NAME}}"
B: "Come back and get {{OFFER_DESCRIPTION}}"
C: "We would love to have you back (with a bonus)"

Body:

Hi {{FIRST_NAME}},

We want you back, and we are putting our money where our mouth is.

For the next 7 days, you can get:
{{OFFER_DETAILS}}

[Claim your offer ->]

This offer expires {{EXPIRY_DATE}}.

No strings attached. If it is still not right for you after
trying us again, no hard feelings.

— {{SENDER_NAME}}
```

---

### Sequence 3: Churned Users (Cancelled accounts)

**Email 1: "We've Improved" (30 days post-cancellation)**
```
Subject line options:
A: "Things have changed at {{PROJECT_NAME}}"
B: "We listened to your feedback, {{FIRST_NAME}}"
C: "Remember {{PROJECT_NAME}}? We have gotten better"

Body:

Hi {{FIRST_NAME}},

When you left {{PROJECT_NAME}}, we took your feedback seriously.

Here is what we have done since:

{{IMPROVEMENT_BASED_ON_EXIT_FEEDBACK}}

We know we did not meet your expectations before, and we have
worked hard to fix that.

Would you be open to giving us another look?

[See what is new ->]

— {{FOUNDER_NAME}}
```
**Timing:** 30 days post-cancellation. Personalize based on their exit survey response if available.

**Email 2: "Final Win-Back Offer" (60 days post-cancellation)**
```
Subject line options:
A: "One more thing, {{FIRST_NAME}}"
B: "Your exclusive offer from {{PROJECT_NAME}}"
C: "We built {{FEATURE}} — the thing you asked for"

Body:

Hi {{FIRST_NAME}},

Last time I will reach out about this. We have a special
offer for former customers:

{{WIN_BACK_OFFER_DETAILS}}

Your previous data is still saved and ready to restore.

[Reactivate my account ->]

If {{PROJECT_NAME}} is not the right fit, I completely understand.
Wishing you the best either way.

— {{FOUNDER_NAME}}
```
**Timing:** 30 days after Email 1 (60 days post-cancellation).

---

## Push Notification Re-Engagement (Mobile)

<!-- IF {{PRODUCT_TYPE}} == "mobile" -->
### Push Notification Strategy

| Trigger | Copy Template | Timing | Frequency Cap |
|---------|--------------|--------|---------------|
| 3 days inactive | "Your {{ITEM}} is waiting for you" | Morning (9-10am local) | 1/day max |
| 7 days inactive | "{{FRIEND_NAME}} just {{ACTION}} — check it out" | Afternoon (1-2pm local) | 1/day max |
| New content available | "New: {{CONTENT_TITLE}} — just added" | Evening (6-7pm local) | 2-3/week max |
| Personal milestone | "You are 1 step away from {{MILESTONE}}" | Morning | 1/day max |
| Social trigger | "{{NAME}} mentioned you in {{CONTEXT}}" | Real-time | No cap |

### Push Copy Templates

**Curiosity:**
- "Something new is waiting for you in {{PROJECT_NAME}}"
- "You will not believe what changed since your last visit"
- "A surprise is ready in your dashboard"

**Social proof:**
- "{{NUMBER}} people used {{FEATURE}} today — have you tried it?"
- "Your team has been active — see what they have been up to"
- "Trending now: {{TRENDING_ITEM}}"

**Feature update:**
- "New feature alert: {{FEATURE_NAME}} just launched"
- "We built the thing you asked for"
- "{{PROJECT_NAME}} just got faster — come see"

**Personal touch:**
- "We miss you, {{FIRST_NAME}}"
- "Your {{ITEM}} from last time is still here"
- "Pick up right where you left off"

### Frequency Limits

```
Inactive users: Maximum 1 push notification per day
                Maximum 3 per week
                Stop after 2 weeks of no response

Active users:   Maximum 3 per day (including transactional)
                Respect quiet hours (10pm-8am local)

Never send:     Generic promotions to inactive users
                Multiple notifications about the same thing
                Notifications with no clear value to the user
```
<!-- ENDIF -->

---

## In-App Re-Engagement

When a user returns after a period of inactivity, make the re-entry experience welcoming and friction-free.

### "Welcome Back" Experience

```
[Returning user lands on dashboard]

┌─────────────────────────────────────────────┐
│  Welcome back, {{FIRST_NAME}}!              │
│                                             │
│  Here is what happened while you were away: │
│                                             │
│  - {{UPDATE_1}}                             │
│  - {{UPDATE_2}}                             │
│  - {{UPDATE_3}}                             │
│                                             │
│  [Jump right in]    [Take a quick tour]     │
└─────────────────────────────────────────────┘
```

### What's New Since Last Visit

Show a contextual changelog filtered to features relevant to the user's segment.

```
What is new since {{LAST_VISIT_DATE}}:

NEW    {{FEATURE_1}} — {{ONE_LINE_DESCRIPTION}}
       [Try it]

UPDATE {{FEATURE_2}} — {{ONE_LINE_DESCRIPTION}}
       [Learn more]

FIX    {{ISSUE_RESOLVED}} — {{ONE_LINE_DESCRIPTION}}
       [Noted]

[Dismiss]
```

### Progress Reminder

If the user had incomplete work, remind them.

```
Pick up where you left off:

{{INCOMPLETE_ITEM_1}} — started {{DATE}}
[Continue ->]

{{INCOMPLETE_ITEM_2}} — last edited {{DATE}}
[Continue ->]
```

---

## Win-Back Offers

Match the offer to the reason they left.

### Offer Matrix

| Churn Reason | Win-Back Offer | Expected Conversion |
|-------------|---------------|-------------------|
| Too expensive | 25-50% discount for 3 months | 5-10% |
| Missing features | Free access to new features for 30 days | 3-7% |
| Too difficult | Free onboarding session with team member | 4-8% |
| Found alternative | Competitive switch offer (migration help + discount) | 2-5% |
| No longer needed | Pause account (data preserved) + check back in 3 months | 1-3% |
| Bad experience | Personal apology + dedicated support + free month | 5-10% |

### Offer Guidelines

- **Discount offers:** Never exceed 50% off. Time-limit them (3 months max). Make clear it reverts to full price.
- **Free access offers:** 14-30 days of premium features. Require re-entering payment to continue.
- **Service offers:** Free onboarding, training, or migration assistance. High-touch but high conversion.
- **Pause offers:** Allow 1-3 month pause with data preserved. Better than full cancellation.

---

## Re-Engagement Through Content

Not every re-engagement touchpoint should be product-focused. Educational content keeps you top of mind without feeling pushy.

### Content Re-Engagement Calendar

| Week | Content Type | Topic | Goal |
|------|-------------|-------|------|
| 1 | Blog post | "{{INDUSTRY_TOPIC_1}}" | Provide value, no product pitch |
| 2 | Case study | "How {{COMPANY}} achieved {{RESULT}}" | Social proof with light product mention |
| 3 | Guide/Template | "Free {{RESOURCE_TYPE}} for {{USE_CASE}}" | Practical value, product awareness |
| 4 | Product update | "What is new in {{PROJECT_NAME}}" | Direct product engagement |

### Content Email Template (Non-Product)

```
Subject: "{{EDUCATIONAL_TOPIC_TITLE}}"
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

I wrote a quick guide on {{TOPIC}} that I thought you might find useful:

{{SUMMARY_2_SENTENCES}}

Key takeaways:
1. {{TAKEAWAY_1}}
2. {{TAKEAWAY_2}}
3. {{TAKEAWAY_3}}

[Read the full guide ->]

Hope it helps. No strings attached.

— {{SENDER_NAME}}
```

---

## Measuring Re-Engagement

### Key Metrics

| Metric | Definition | Target | Current |
|--------|-----------|--------|---------|
| **Reactivation rate** | % of inactive users who return to active status | >15% (recently inactive) | ____% |
| **Time to reactivate** | Median days from first re-engagement touch to return | <7 days | ____ days |
| **Post-reactivation retention** | % of reactivated users still active after 30 days | >40% | ____% |
| **Win-back rate** | % of churned users who return | >3% | ____% |
| **Email re-engagement rate** | % of inactive users who open a re-engagement email | >25% | ____% |
| **Email click-through rate** | % of openers who click a CTA | >10% | ____% |
| **Offer redemption rate** | % of users who accept a win-back offer | >5% | ____% |
| **Revenue recovered** | MRR recovered from win-back campaigns | $____ | $____ |

### Re-Engagement Funnel

```
Total inactive users:         ________
Contacted via email:          ________ (____%)
Opened at least one email:    ________ (____%)
Clicked at least one CTA:     ________ (____%)
Returned to product:          ________ (____%)
Completed a key action:       ________ (____%)
Retained at 30 days:          ________ (____%)

Cost per reactivation:        $________
Revenue per reactivated user: $________
ROI of re-engagement:         ________x
```

### Cohort Tracking

Track reactivated users as a separate cohort to understand their behavior.

```
Reactivated User Cohort — {{MONTH}} {{YEAR}}

Reactivated: ____
Day 1 retention:  ____%
Day 7 retention:  ____%
Day 30 retention: ____%

Comparison to new user cohort:
- Day 1:  reactivated ____% vs new ____%
- Day 7:  reactivated ____% vs new ____%
- Day 30: reactivated ____% vs new ____%
```

---

## When to Give Up

Not every user can be won back. Continuing to email truly disengaged users damages your sender reputation and wastes resources.

### Sunsetting Rules

```
Remove from re-engagement after:
- 3 email sequences with zero opens (email is likely dead or spam-filtered)
- 180 days of total inactivity with no response to any outreach
- User explicitly requests no more emails (unsubscribe)
- Email bounces (hard bounce = remove immediately)

Move to "archive" segment:
- Stop all outreach emails
- Keep account data per retention policy
- Include in aggregate analysis only
- Re-evaluate annually if major product changes occur

Never remove:
- Users who opened but did not click (still warm, try different approach)
- Users who visited the site but did not log in (still interested)
- Users on pause (they asked for it, respect the timeline)
```

---

## Re-Engagement Campaign Template for {{PROJECT_NAME}}

```
Product: {{PROJECT_NAME}}
Campaign period: {{START_DATE}} to {{END_DATE}}

SEGMENTS:
Recently inactive ({{RECENT_INACTIVE_DAYS}} days): ____ users
Lapsed ({{LAPSED_DAYS}} days): ____ users
Dormant ({{DORMANT_DAYS}} days): ____ users
Churned: ____ users

SEQUENCE PLAN:
Recently Inactive:
  Email 1 (Day 0): "We miss you" — sent ____
  Email 2 (Day 4): "Here's what you missed" — sent ____
  Email 3 (Day 9): "Need help?" — sent ____

Lapsed:
  Email 1 (Day 0): "What's been happening" — sent ____
  Email 2 (Day 5): "Social proof + value reminder" — sent ____
  Email 3 (Day 10): "Limited offer" — sent ____

Churned:
  Email 1 (Day 30 post-cancel): "We've improved" — sent ____
  Email 2 (Day 60 post-cancel): "Final win-back offer" — sent ____

WIN-BACK OFFERS:
- Discount: {{DISCOUNT_DETAILS}}
- Extended trial: {{TRIAL_DETAILS}}
- Service: {{SERVICE_OFFER_DETAILS}}

RESULTS TRACKING:
- Reactivation rate: ____%
- Revenue recovered: $____
- Post-reactivation 30-day retention: ____%
- Campaign ROI: ____x

IMPLEMENTATION CHECKLIST:
- [ ] Define inactive thresholds for {{PROJECT_NAME}}
- [ ] Segment existing inactive users
- [ ] Write and design all email templates
- [ ] Set up email automation sequences
- [ ] Create "welcome back" in-app experience
- [ ] Configure push notification triggers (if mobile)
- [ ] Define win-back offers and approval
- [ ] Set up tracking and attribution
- [ ] Schedule campaign launch
- [ ] Plan weekly performance review
```

---

*This re-engagement system is part of the {{PROJECT_NAME}} marketing system. Run re-engagement campaigns monthly and review performance quarterly.*
