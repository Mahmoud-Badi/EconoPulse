# Marketing Automation Workflows for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Stage:** {{CURRENT_STAGE}}
> **Date:** {{DATE}}

---

## What Is Marketing Automation?

Marketing automation is a system of pre-defined actions that are triggered automatically by user behavior, time-based conditions, or data changes. Instead of manually sending follow-up emails, checking who signed up for a trial, or remembering to reach out to inactive users, automation handles these tasks 24/7 with perfect consistency.

**Why it matters for {{PROJECT_NAME}}:**
- You cannot personally follow up with every lead. Automation scales your effort.
- Consistent timing beats sporadic outreach. Automation never forgets.
- Behavior-triggered messages convert 3-5x better than batch emails.
- It frees you to focus on product and strategy rather than repetitive tasks.

**When to start automating:**
- Start with 2-3 essential workflows before launch.
- Add complexity only after you see data from the basics.
- Do not over-automate early — you need to learn what resonates first.

---

## Essential Automation Workflows

### Workflow 1: New Lead Welcome Sequence

**Trigger:** Contact submits any form (signup, newsletter, lead magnet download)

```
[Form Submitted]
      │
      ▼
[Tag contact: "New Lead"]
[Set lifecycle: "Lead"]
[Set lead source: {{form_source}}]
      │
      ▼
[Send Welcome Email]
  Subject: "Welcome to {{PROJECT_NAME}} — here's what to expect"
  Content: Thank them, set expectations, deliver promised resource
      │
      ▼
[Wait 2 days]
      │
      ▼
[Send Nurture Email #1]
  Subject: "The #1 problem {{PROJECT_NAME}} solves"
  Content: Problem-focused, show you understand their pain
      │
      ▼
[Wait 2 days]
      │
      ▼
[Check: Did they visit pricing page?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Tag: "High Intent"]    [Send Nurture Email #2]
[Notify sales rep]       Subject: "How [customer] achieved [result] with {{PROJECT_NAME}}"
[Send targeted offer]    Content: Social proof, case study, soft CTA
```

**Email Templates:**

**Welcome Email:**
- Warm, personal tone (from founder if possible)
- Deliver what they signed up for (link to resource, confirmation of signup)
- Set expectations: "Over the next week, I'll share..."
- One clear CTA: "Start here" or "Read this first"

**Nurture Email #1 (Day 3):**
- Focus on the core problem your audience faces
- Share a specific insight or data point
- Position {{PROJECT_NAME}} as the solution (soft mention, not hard sell)
- CTA: Read a blog post, watch a video, or explore a feature

**Nurture Email #2 (Day 5):**
- Social proof: customer story, testimonial, or case study
- Show specific results achieved
- CTA: Start a trial, book a demo, or see pricing

---

### Workflow 2: Lead Nurture (MQL Sequence)

**Trigger:** Contact reaches MQL status (lead score >= 30 or manual qualification)

```
[Contact becomes MQL]
      │
      ▼
[Enroll in 5-email nurture sequence]
[Set cadence: every 3-4 days over 3 weeks]
      │
      ▼
[Email 1: Deep-dive into core value proposition]
  Content: How {{PROJECT_NAME}} works, key differentiator
      │
      ▼
[Wait 3 days]
      │
      ▼
[Email 2: Use case specific to their segment]
  IF industry == "tech" → tech use case
  IF industry == "marketing" → marketing use case
  DEFAULT → general use case
      │
      ▼
[Wait 4 days]
      │
      ▼
[Email 3: Objection handling]
  Content: Address top 3 objections (price, time, complexity)
  Include FAQ section and comparison content
      │
      ▼
[Wait 3 days]
      │
      ▼
[Email 4: Social proof + urgency]
  Content: Customer testimonials, results data, limited-time offer
      │
      ▼
[Wait 4 days]
      │
      ▼
[Email 5: Direct CTA]
  Content: "Ready to get started?" — clear, single CTA
  IF no engagement with any email → move to re-engagement workflow
  IF clicked CTA → update lead score, notify sales
      │
      ▼
[Update lead score based on engagement]
[IF score >= 60: Move to SQL status, notify sales]
[IF score < 30: Move to cold nurture (monthly newsletter)]
```

---

### Workflow 3: Trial Activation Sequence

<!-- IF {{PRODUCT_TYPE}} == "saas" -->

**Trigger:** User starts free trial or creates account

```
[Trial Started / Account Created]
      │
      ▼
[Tag: "Trial User"]
[Set trial_start_date: today]
[Set trial_end_date: today + {{TRIAL_LENGTH}} days]
      │
      ▼
[Immediate: Send onboarding email]
  Subject: "Your {{PROJECT_NAME}} account is ready — start here"
  Content: Login link, 3 quick-start steps, link to getting started guide
      │
      ▼
[Wait 1 day]
      │
      ▼
[Check: Completed setup?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Send "Great    [Send "Need help
progress!"      getting started?"
email with      email with video
next steps]     walkthrough + offer
                for live help]
      │              │
      ▼              ▼
[Wait 3 days]   [Wait 2 days]
      │              │
      ▼              ▼
[Check: Used key feature?]   [Check: Logged in?]
      │                            │
  ┌───┴───┐                   ┌───┴───┐
  YES     NO                  YES     NO
  │       │                   │       │
  ▼       ▼                   ▼       ▼
[Send     [Send feature      [Return  [Send "We miss you"
"Power    highlight email     to main  email with incentive
user"     with tutorial]      flow]    or personal note]
tips]
      │
      ▼
[Day 7: Mid-trial check-in]
  Subject: "How's your first week with {{PROJECT_NAME}}?"
  Content: Survey link, feature they haven't tried, offer help
      │
      ▼
[Day {{TRIAL_LENGTH}} - 3: Trial ending warning]
  Subject: "Your trial ends in 3 days"
  Content: Summary of what they've done, upgrade CTA, what they'll lose
      │
      ▼
[Day {{TRIAL_LENGTH}} - 1: Final reminder]
  Subject: "Last day of your trial"
  Content: Strong upgrade CTA, special offer if applicable
      │
      ▼
[Day {{TRIAL_LENGTH}} + 1: Trial expired]
  IF converted → move to Customer Onboarding workflow
  IF not converted → move to Win-Back workflow
```

<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "e-commerce" -->

**Trigger:** User creates an account or makes first purchase

```
[Account Created / First Purchase]
      │
      ▼
[Immediate: Welcome email with account details]
[Wait 1 day → Product recommendations based on browse history]
[Wait 3 days → Educational content about product category]
[Wait 7 days → Special offer for second purchase]
```

<!-- ENDIF -->

---

### Workflow 4: Re-Engagement Sequence

**Trigger:** User inactive for 14+ days (no login, no email opens, no website visits)

```
[Inactive 14 days]
      │
      ▼
[Send Re-engagement Email #1]
  Subject: "We haven't seen you in a while, {{FIRST_NAME}}"
  Content: What's new since they left, single compelling CTA
      │
      ▼
[Wait 5 days]
      │
      ▼
[Check: Re-engaged?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Exit:    [Send Re-engagement Email #2]
Welcome   Subject: "Is {{PROJECT_NAME}} still right for you?"
back!     Content: Quick survey — what held you back? + incentive
Reset
score]
      │
      ▼
[Wait 7 days]
      │
      ▼
[Check: Re-engaged?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Exit]   [Inactive 30+ days: Enter Win-Back sequence]
         │
         ▼
         [Send Win-Back Email]
         Subject: "Special offer to come back to {{PROJECT_NAME}}"
         Content: Discount, extended trial, personal demo offer
         │
         ▼
         [Wait 14 days]
         │
         ▼
         [Check: Re-engaged?]
           │
       ┌───┴───┐
       YES     NO
       │       │
       ▼       ▼
     [Exit]  [Reduce send frequency to monthly]
             [Tag: "Churned-at-risk"]
             [Subtract 20 points from lead score]
```

---

### Workflow 5: Customer Onboarding Sequence

**Trigger:** Payment received or plan activated

```
[Payment Confirmed]
      │
      ▼
[Update lifecycle: "Customer"]
[Tag: "{{PLAN_NAME}} Customer"]
[Create success task for CS team]
      │
      ▼
[Immediate: Welcome + receipt email]
  Subject: "Welcome to {{PROJECT_NAME}} — you're all set!"
  Content: Receipt, login details, what to do first, support contacts
      │
      ▼
[Wait 1 day]
      │
      ▼
[Send Setup Guide Email]
  Subject: "Get the most out of {{PROJECT_NAME}} in 10 minutes"
  Content: Step-by-step setup guide, video walkthrough, template library
      │
      ▼
[Wait 3 days]
      │
      ▼
[Send Check-in Email]
  Subject: "How's everything going, {{FIRST_NAME}}?"
  Content: Ask about experience, link to support/FAQ, invite to community
      │
      ▼
[Wait 7 days]
      │
      ▼
[Send Power Feature Email]
  Subject: "Most {{PROJECT_NAME}} users don't know about this feature"
  Content: Highlight an underused feature that increases stickiness
      │
      ▼
[Wait 14 days]
      │
      ▼
[Send NPS Survey]
  Subject: "Quick question about {{PROJECT_NAME}}"
  Content: "How likely are you to recommend us?" (0-10 scale)
  IF NPS >= 8 → Trigger Review Request workflow
  IF NPS <= 6 → Alert CS team for intervention
```

---

### Workflow 6: Upsell Trigger Sequence

**Trigger:** Usage threshold reached (e.g., 80% of plan limit, frequent use of gated feature)

```
[Usage Threshold Reached]
      │
      ▼
[Tag: "Upsell Candidate"]
[Notify account manager]
      │
      ▼
[Send Feature Highlight Email]
  Subject: "You're getting a lot of value from {{PROJECT_NAME}}!"
  Content: Show their usage stats, preview what the next tier unlocks
      │
      ▼
[Wait 3 days]
      │
      ▼
[Check: Viewed upgrade page?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Send    [Send use case email showing
upgrade   ROI of upgrading with
offer     customer example]
with
incentive]
      │
      ▼
[Wait 5 days]
      │
      ▼
[IF not upgraded: Personal email from CS/founder]
[IF upgraded: Send thank you + new feature guide]
```

---

### Workflow 7: Review Request Sequence

**Trigger:** 30+ days active AND NPS score 8+

```
[NPS >= 8 AND Active 30+ days]
      │
      ▼
[Wait 2 days (don't ask immediately after survey)]
      │
      ▼
[Send Review Request Email]
  Subject: "Would you share your experience with {{PROJECT_NAME}}?"
  Content: Direct links to review platforms (G2, Capterra, Product Hunt, Google)
  Make it easy: pre-written review template they can customize
      │
      ▼
[Wait 7 days]
      │
      ▼
[Check: Left review?]
      │
  ┌───┴───┐
  YES     NO
  │       │
  ▼       ▼
[Send    [Send gentle reminder]
thank    Subject: "Quick reminder — your review means a lot"
you +    Content: Shorter ask, one specific platform
reward]
      │
      ▼
[Tag: "Left Review" or "Review Requested — No Action"]
[Do NOT ask again for 6 months]
```

---

### Workflow 8: Event Follow-Up Sequence

**Trigger:** Attended webinar, conference, or live event

```
[Event Attended]
      │
      ▼
[Tag: "Attended: {{event_name}}"]
[Update lead score: +10]
      │
      ▼
[Within 2 hours: Send thank you email]
  Subject: "Thanks for joining {{event_name}}!"
  Content: Recording link, slide deck, key takeaways summary
      │
      ▼
[Wait 2 days]
      │
      ▼
[Send Related Content Email]
  Subject: "More on [event topic]"
  Content: Blog post, guide, or resource related to the event topic
      │
      ▼
[Wait 3 days]
      │
      ▼
[Send CTA Email]
  Subject: "Ready to put [topic] into practice?"
  Content: How {{PROJECT_NAME}} helps with what they learned, trial/demo CTA
      │
      ▼
[IF engaged: Move to appropriate nurture sequence]
[IF not engaged: Return to general newsletter]
```

---

## Multi-Channel Automation Coordination

Automation is not just email. Coordinate across channels for maximum impact:

| Channel | Best For | Timing |
|---------|----------|--------|
| **Email** | Long-form content, nurture sequences, announcements | Primary channel, 2-4 touches per week max |
| **In-App Messages** | Feature announcements, onboarding tips, upgrade prompts | When user is active in product |
| **Push Notifications** | Time-sensitive alerts, re-engagement, activity updates | Sparingly — 2-3 per week max |
| **SMS** | Urgent notifications, appointment reminders, flash offers | Very sparingly — only with explicit consent |
| **Retargeting Ads** | Stay top-of-mind for website visitors who didn't convert | Continuous for 30-60 days after visit |

**Coordination Rules:**
- Never send email AND push AND SMS about the same thing on the same day.
- If a user engages on one channel, suppress the same message on other channels.
- Respect frequency caps: no more than 1 touch per channel per day.
- Always provide channel preference settings (let users choose how to hear from you).

---

## Timing and Delays

### Optimal Wait Times Between Touches

| Sequence Type | Between Emails | Total Duration |
|--------------|---------------|----------------|
| Welcome series | 2-3 days | 7-10 days |
| Lead nurture | 3-4 days | 2-3 weeks |
| Trial onboarding | 1-3 days | Trial length |
| Re-engagement | 5-7 days | 3-4 weeks |
| Customer onboarding | 3-7 days | 4-6 weeks |

### Time-Zone Awareness
- Store contact timezone in CRM (auto-detect from IP or ask in form).
- Send emails at optimal times in THEIR timezone (Tuesday-Thursday, 9-11am local).
- Schedule push notifications for business hours only.
- For global audiences, use "smart send" features that optimize per recipient.

---

## Personalization in Automation

### Dynamic Content Blocks
Insert different content based on contact properties:

```
{% if contact.plan == "free" %}
  Upgrade to Pro and unlock [feature]. Start your free trial today.
{% elif contact.plan == "pro" %}
  You're on Pro — did you know you can also use [advanced feature]?
{% elif contact.plan == "enterprise" %}
  Your dedicated success manager {{CSM_NAME}} is here to help.
{% endif %}
```

### Conditional Paths Based on Behavior
- **Opened email but didn't click:** Send simplified version with stronger CTA.
- **Clicked but didn't convert:** Send testimonial/social proof follow-up.
- **Visited pricing page:** Trigger high-intent sequence with comparison content.
- **Downloaded specific resource:** Tailor next email to that topic.

---

## Testing Automations

1. **Create a test contact** with a personal email you can monitor.
2. **Trigger each workflow manually** and verify every step fires correctly.
3. **Check timing:** Are delays working? Are emails sending at the right times?
4. **Verify personalization:** Do merge tags populate correctly? Do conditional blocks show the right content?
5. **Test edge cases:** What happens if a contact enters two workflows simultaneously?
6. **Start with a small segment** (10-50 contacts) before rolling out to full list.
7. **Monitor for 1 week** before assuming everything works perfectly.

---

## Automation Tools

| Tool | Price | Best For |
|------|-------|----------|
| **HubSpot Workflows** | Free (basic) / $50+ (advanced) | All-in-one CRM + automation, best for inbound |
| **ActiveCampaign** | $29/mo+ | Advanced automation, great visual workflow builder |
| **Mailchimp** | Free (basic) / $20+ (automation) | Simple automations, e-commerce integrations |
| **ConvertKit** | $29/mo+ | Creator-focused, simple but effective sequences |
| **n8n** | Free (self-hosted) | Developer-friendly, custom integrations, open-source |
| **Make (Integromat)** | Free (basic) / $9+ | Visual workflow builder, connects 1000+ apps |
| **Customer.io** | $150/mo+ | Behavior-driven messaging, powerful segmentation |

---

## Measuring Automation Performance

| Metric | Good | Great | Action if Low |
|--------|------|-------|---------------|
| Email open rate | 20-30% | 30-50% | Improve subject lines, test send times |
| Email click rate | 2-5% | 5-10% | Improve CTA, content relevance, design |
| Workflow completion rate | 60-70% | 80%+ | Reduce emails, improve content, check timing |
| Unsubscribe rate | <0.5% | <0.2% | Reduce frequency, improve targeting |
| Conversion rate (workflow → goal) | 5-10% | 15%+ | Improve offer, add personalization |
| Revenue attributed to automation | Track | Grow | Connect CRM to revenue tracking |

---

## Core Workflows for {{PROJECT_NAME}}

### Workflow 1: {{PROJECT_NAME}} Welcome + Activation

**Goal:** Get new signups to their first "aha moment" within 48 hours.

| Step | Trigger | Action | Timing |
|------|---------|--------|--------|
| 1 | Form/signup | Tag, welcome email, set lifecycle | Immediate |
| 2 | Welcome email sent | Send getting-started guide | +1 day |
| 3 | Guide sent | Check if activated | +2 days |
| 4a | Activated | Send congratulations + next steps | Immediate |
| 4b | Not activated | Send help offer + simplified tutorial | Immediate |
| 5 | Day 5 | Check engagement, branch accordingly | +5 days |

### Workflow 2: {{PROJECT_NAME}} Lead Nurture

**Goal:** Convert interested contacts into trial users or demo requests.

| Step | Trigger | Action | Timing |
|------|---------|--------|--------|
| 1 | MQL status | Enroll in nurture, send problem-focused email | Immediate |
| 2 | Email 1 sent | Send solution-focused email | +3 days |
| 3 | Email 2 sent | Send social proof email | +4 days |
| 4 | Email 3 sent | Send comparison/objection email | +3 days |
| 5 | Email 4 sent | Send direct CTA email | +4 days |
| 6 | Sequence complete | Score check → SQL or cold nurture | Immediate |

### Workflow 3: {{PROJECT_NAME}} Customer Retention

**Goal:** Keep paying customers engaged and reduce churn.

| Step | Trigger | Action | Timing |
|------|---------|--------|--------|
| 1 | Payment confirmed | Welcome, receipt, setup guide | Immediate |
| 2 | Onboarded | Feature education series (3 emails) | +3, +7, +14 days |
| 3 | Day 30 | NPS survey | +30 days |
| 4a | NPS >= 8 | Review request + referral program invite | +2 days |
| 4b | NPS <= 6 | Alert CS, personal outreach | Immediate |
| 5 | Quarterly | Check-in email, new feature highlights | Every 90 days |
| 6 | Renewal approaching | Renewal reminder + value summary | -14 days |

---

*This workflow guide is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*
