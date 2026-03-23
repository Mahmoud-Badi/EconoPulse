# User Feedback Loops

> **A structured system for collecting, categorizing, prioritizing, and acting on user feedback for {{PROJECT_NAME}}.** Feedback without a pipeline is just noise. This template turns noise into signal.

---

## Why Feedback Loops Matter

You built what you thought users wanted. Now you find out what they actually want. The gap between those two things is where product improvements live. A feedback loop is not a suggestion box — it is an operational pipeline that transforms raw user input into prioritized, actionable backlog items on a predictable cadence.

Without this system, feedback collects in five different places (email, Slack, support tickets, Twitter, hallway conversations), nobody synthesizes it, patterns go unnoticed, and users stop giving feedback because nothing ever changes. That silence is the sound of users leaving.

---

## Feedback Collection Channels

### Channel Matrix

| Channel | Type | Best For | Volume | Signal Quality | Setup Effort |
|---------|------|----------|--------|----------------|-------------|
| In-app feedback widget | Proactive | Contextual feedback at the moment of frustration | High | High (includes context) | Medium |
| {{FEEDBACK_CHANNEL}} | Proactive | Feature requests and general suggestions | Medium | Medium | Low |
| {{SUPPORT_PLATFORM}} tickets | Reactive | Bug reports and issues | High | High (includes reproduction steps) | Already set up |
| Email surveys (NPS/CSAT) | Proactive | Satisfaction benchmarking | Medium | Medium (quantitative) | Low |
| User interviews | Proactive | Deep understanding of workflows and pain points | Low | Very High | High |
| Analytics / behavior data | Passive | What users do (not what they say) | Very High | High (unbiased) | Medium |
| Social media / forums | Reactive | Public sentiment and brand perception | Variable | Low-Medium (noisy) | Low |
| App store reviews | Reactive | Mobile user satisfaction | Medium | Low-Medium (biased toward extremes) | Already set up |
| Sales call notes | Reactive | Prospect objections and missing features | Low | Medium (biased toward deal-closing features) | Low |

### Channel Configuration for {{PROJECT_NAME}}

#### In-App Feedback Widget

```
Location: Persistent in bottom-right corner (or accessible via ? icon)
Trigger points:
  - After completing a core workflow (success state)
  - After encountering an error (failure state)
  - After first 7 days of use (initial impression)
  - On feature pages with < 30 day age (new feature feedback)

Widget fields:
  - Type: Bug / Feature Request / General Feedback (required)
  - Description: Free text (required, min 20 characters)
  - Screenshot: Optional auto-capture
  - Email: Pre-filled from session (optional override)
  - Page URL: Auto-captured
  - Session ID: Auto-captured (for replay lookup)
```

#### NPS Survey

```
Frequency: Quarterly (do not survey more often — survey fatigue kills response rates)
Question: "On a scale of 0-10, how likely are you to recommend {{PROJECT_NAME}} to a colleague?"
Follow-up: "What is the primary reason for your score?" (free text)
Audience: Users with > 14 days of activity (exclude brand-new users)
Delivery: In-app modal OR email (not both)
Target response rate: 20-30%
```

#### CSAT Survey

```
Trigger: After resolution of a support ticket
Question: "How satisfied are you with the support you received?"
Scale: 1-5 stars
Follow-up: "How could we improve?" (free text, optional)
Target: 90%+ satisfaction (4-5 stars)
```

#### CES (Customer Effort Score)

```
Trigger: After completing a key workflow for the first time
Question: "How easy was it to [complete action]?"
Scale: 1 (Very Difficult) to 7 (Very Easy)
Target: Average score > 5.5
Use: Identify UX friction points in specific flows
```

---

## Feedback Tagging Taxonomy

Every piece of feedback gets exactly one primary tag and zero or more secondary tags.

### Primary Tags

| Tag | Definition | Example |
|-----|-----------|---------|
| `bug` | Something is broken or not working as documented | "The export button does nothing when I click it" |
| `feature-request` | A net-new capability that does not exist today | "I want to filter reports by date range" |
| `ux-improvement` | An existing feature works but is confusing or painful | "I cannot find where to change my password" |
| `performance` | Something is too slow | "The dashboard takes 8 seconds to load" |
| `content` | Documentation, copy, or messaging issue | "The error message says 'Error 500' with no explanation" |
| `billing` | Pricing, invoicing, or payment issue | "I was charged twice this month" |
| `integration` | Request for third-party integration | "Can you integrate with Zapier?" |
| `mobile` | Mobile-specific issue or request | "The sidebar menu does not close on iPhone" |

### Secondary Tags

| Tag | Purpose |
|-----|---------|
| `critical` | Blocking user from core functionality |
| `recurring` | Multiple users have reported this |
| `new-user` | Affects onboarding or first-time experience |
| `power-user` | Affects advanced workflows |
| `enterprise` | Specific to enterprise/team features |
| `accessibility` | Accessibility or inclusivity issue |
| `security` | Security concern or vulnerability report |

### Auto-Tagging Rules

Where possible, automate tagging based on context:

```
IF source == "support_ticket" AND contains("error", "broken", "crash", "not working")
  → auto-tag: bug

IF source == "in_app_widget" AND user.account_age < 14 days
  → auto-tag: new-user

IF source == "app_store_review" AND rating <= 2
  → auto-tag: critical

IF contains("slow", "loading", "timeout", "takes forever")
  → auto-tag: performance
```

---

## Feedback Pipeline: From Raw Input to Backlog Item

### Stage 1: Capture (Automated)

All channels feed into a single feedback inbox. Whether the feedback arrives via widget, email, support ticket, or social media, it ends up in one place.

**Tools:** {{FEEDBACK_CHANNEL}} as primary. If using multiple tools, set up integrations to centralize.

**SLA:** All feedback is captured within 24 hours of receipt. No feedback should sit in a channel unprocessed for more than one business day.

### Stage 2: Acknowledge (Within 48 Hours)

Every piece of feedback receives a human acknowledgment. Not a canned auto-reply — a real response that proves a person read it.

**Templates:**

For bug reports:
> Thanks for reporting this. I have confirmed the issue and our team is investigating. I will follow up when we have a fix or workaround. Reference: [ticket-id]

For feature requests:
> Thanks for the suggestion. I have added this to our feature request tracker. We review all requests during our biweekly triage. I cannot promise a timeline, but your input directly influences our roadmap decisions.

For general feedback:
> Thanks for taking the time to share this. Feedback like yours helps us understand what is working and what is not. I have logged this for our product team's review.

### Stage 3: Categorize and Tag (Daily)

During daily triage (15 minutes), the product owner or designated triager:

1. Reads all new feedback from the past 24 hours
2. Applies primary and secondary tags
3. Links related feedback items (deduplication)
4. Flags anything `critical` for immediate attention

### Stage 4: Synthesize (Weekly)

During the weekly feedback synthesis (30 minutes):

1. Group tagged feedback by theme
2. Count occurrences per theme
3. Identify new themes that were not present last week
4. Update the "Top 10 User Pain Points" list
5. Move any theme with 5+ occurrences to the feature request triage pipeline

### Stage 5: Prioritize (Biweekly)

During biweekly triage (see `feature-request-triage.md`):

1. Score synthesized themes using RICE framework
2. Apply MoSCoW categorization for the current quarter
3. Move accepted items to the product backlog with clear user stories
4. Decline or defer items that do not meet the threshold
5. Communicate decisions back to original requesters

### Stage 6: Close the Loop (On Ship)

When a feedback-driven feature ships:

1. Notify everyone who requested it: "You asked for X. We built it. Here is how to use it."
2. Update the feedback item status to "Shipped"
3. Monitor adoption of the new feature (did the people who asked for it actually use it?)
4. Collect follow-up feedback: "You requested this feature. Now that you have used it, does it solve your problem?"

**This last step is the most important and the most frequently skipped.** If you never close the loop, users learn that giving feedback has no effect, and they stop.

---

## Review Cadence

| Activity | Frequency | Owner | Duration | Output |
|----------|-----------|-------|----------|--------|
| Daily triage | Every business day | Product owner | 15 min | Tagged and acknowledged feedback |
| Weekly synthesis | Every Monday | Product owner | 30 min | Updated pain point list, theme counts |
| Biweekly triage | Every other Wednesday | Product + Eng + Design | 60 min | Accepted/declined/deferred decisions |
| Monthly theme review | First Friday of month | Product team | 90 min | Strategic themes, trend analysis |
| Quarterly strategy | First week of quarter | All stakeholders | Half day | Roadmap input, satisfaction benchmarks |

---

## Feedback Prioritization Matrix

Plot each feedback theme on this 2x2 matrix:

```
                    HIGH FREQUENCY
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │   IMPORTANT   │   CRITICAL    │
         │   BUT QUIET   │   AND LOUD    │
         │               │               │
  LOW ───┼───────────────┼───────────────┼─── HIGH
 IMPACT  │               │               │  IMPACT
         │   IGNORE      │   MONITOR     │
         │   (noise)     │   (vocal few) │
         │               │               │
         └───────────────┼───────────────┘
                         │
                    LOW FREQUENCY
```

| Quadrant | Action |
|----------|--------|
| **Critical and Loud** (High Impact + High Frequency) | Build immediately. This is product-market fit signal. |
| **Important but Quiet** (High Impact + Low Frequency) | Investigate. Users may not know to ask for this. Proactive research. |
| **Monitor** (Low Impact + High Frequency) | Track but do not prioritize. Often UX friction, not missing features. |
| **Ignore** (Low Impact + Low Frequency) | Log and move on. Revisit only if frequency increases. |

---

## NPS Scoring and Action Framework

### NPS Calculation

```
NPS = (% Promoters) - (% Detractors)

Promoters:  Score 9-10
Passives:   Score 7-8
Detractors: Score 0-6
```

### NPS Action Thresholds for {{PROJECT_NAME}}

| NPS Range | Interpretation | Action |
|-----------|---------------|--------|
| 50+ | Excellent. Users love the product. | Focus on growth. Ask promoters for referrals and reviews. |
| 30-49 | Good. Solid foundation with room for improvement. | Analyze detractor feedback. Target specific pain points. |
| 0-29 | Concerning. More detractors than acceptable. | Urgent: interview detractors. Identify top 3 issues. Fix them this quarter. |
| Below 0 | Critical. More detractors than promoters. | Emergency: stop new feature development. Fix core experience issues. |

### Follow-Up by Segment

**Promoters (9-10):** Ask: "What do you love most?" and "Would you be willing to leave a review?" These users are your marketing engine.

**Passives (7-8):** Ask: "What would make this a 9 or 10?" These users are one improvement away from becoming promoters.

**Detractors (0-6):** Ask: "What is your biggest frustration?" and schedule a call. These users will churn unless you act. Their feedback is the most valuable.

---

## Metrics to Track

| Metric | Target | Review Frequency |
|--------|--------|-----------------|
| Feedback volume per week | Trending up (healthy products generate more feedback) | Weekly |
| Average time to acknowledge | < 48 hours | Weekly |
| Average time to resolve (bugs) | < 7 days for critical, < 30 days for normal | Weekly |
| Feedback-to-backlog conversion rate | 10-20% | Monthly |
| Closed-loop rate (shipped + notified requester) | > 80% of shipped items | Monthly |
| NPS score | > 30 (Year 1), > 50 (Year 2) | Quarterly |
| CSAT score | > 85% (4-5 stars) | Monthly |
| CES score | > 5.5 / 7 | Monthly |
| Survey response rate | > 20% | Quarterly |
