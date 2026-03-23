# Customer Feedback Collection System

> {{PROJECT_NAME}} — Systematically collect, aggregate, and act on customer feedback across every touchpoint.

---

## Overview

Customer feedback is the raw material of product improvement. Without a structured collection system, feedback arrives haphazardly — biased toward the loudest voices, the angriest customers, and the channels your team happens to check. This template defines the infrastructure for collecting feedback across every meaningful touchpoint, storing it in a unified model, and surfacing it in ways that drive decisions.

**Cross-reference:** For the process of turning feedback into product roadmap items, see `20-post-launch/user-feedback-loops.template.md`. This document covers the technical system design — how to collect, store, and analyze feedback. For automated follow-up flows triggered by scores, see `nps-csat-automation.template.md`.

**Guiding principles:**

- **Ask less, learn more.** One well-timed question beats a 20-question survey every time.
- **Respect attention.** Every survey shown is a withdrawal from the user's patience bank. Overdraw and they stop answering forever.
- **Close the loop.** If you ask for feedback and never act on it, you've trained customers that feedback is pointless.
- **Separate signal from noise.** Volume is not signal. Five enterprise customers saying the same thing outweighs 500 free-tier users with a different request.

---

## Feedback Collection Channels

### 1. In-App Micro-Surveys (1-2 Questions, Contextual)

**When to use:** Immediately after a user completes a specific action, encounters friction, or reaches a milestone. This is the highest-signal channel because you catch the user in context — they remember exactly what happened.

**Setup approach:**
- Build a lightweight survey component into your app (see In-App Survey Component Architecture below)
- Alternatively, integrate a tool like Refiner, Survicate, or Hotjar Surveys
- Trigger based on behavioral events from your analytics pipeline (Segment, Rudderstack, or custom)

**Signal quality:** High. Users are responding about a specific, recent experience. Free-text responses from micro-surveys are disproportionately actionable because they reference concrete interactions.

**Volume expectation:** 5-15% response rate on well-targeted micro-surveys. Expect 200-2,000 responses/month at scale depending on MAU. Higher response rates correlate with simpler response formats (emoji > stars > text).

**Processing method:**
- Quantitative scores: aggregate in real-time, display on dashboards
- Free-text: batch process daily through auto-tagging pipeline (LLM-based categorization)
- Alert on negative scores immediately (score ≤ 2 out of 5)

**Implementation notes:**
- Never show a micro-survey during a user's first session — let them orient first
- Don't interrupt multi-step workflows — show the survey after the workflow completes
- Cap at 1 micro-survey per user per day, regardless of how many triggers fire
- A/B test survey placement (bottom-right slide-in vs. inline vs. post-action confirmation page)

---

### 2. Post-Interaction Surveys (After Support, Onboarding, Purchase)

**When to use:** After a defined interaction concludes — support ticket resolved, onboarding flow completed, first purchase made, subscription renewed. These measure the quality of specific experiences rather than general satisfaction.

**Setup approach:**
- Integrate with your helpdesk (Zendesk, Intercom, Freshdesk) for post-support surveys — most tools have built-in CSAT surveys
- For onboarding and purchase, trigger via your event pipeline with a 1-hour delay
- Use in-app delivery if the user is active; fall back to email if inactive

**Signal quality:** Medium-high. The interaction is recent but the user has had time to cool down. Negative responses are especially valuable — they identify broken processes. Beware: users who had middling experiences often don't respond, creating a bimodal distribution.

**Volume expectation:** 20-40% response rate for support CSAT (users feel obligated to close the loop). 10-20% for onboarding surveys. 5-10% for post-purchase.

**Processing method:**
- Route low scores (1-2) to the team lead within 1 hour
- Aggregate scores by agent, team, and time period for QA
- Cross-reference with ticket metadata (resolution time, number of touches, topic)

---

### 3. Periodic Email Surveys (NPS Quarterly, Satisfaction Annually)

**When to use:** To measure broad sentiment across your user base at regular intervals. NPS is the standard quarterly pulse. Annual satisfaction surveys go deeper but demand more from users.

**Setup approach:**
- Use your email platform (Customer.io, Loops, Braze, or even Mailchimp) to send survey emails
- Embed the first question directly in the email (clickable NPS scale or star rating) — don't make them click through to a separate page
- After they click, redirect to a landing page with the follow-up question
- Alternatively, use Delighted, Wootric, or AskNicely for dedicated NPS infrastructure

**Signal quality:** Medium. Self-selection bias is real — very happy and very unhappy users over-respond. Mitigate by segmenting results and tracking response rates by segment. The follow-up open-ended question is where the real value lives.

**Volume expectation:** 15-30% response rate for NPS emails (highly dependent on customer relationship quality and email deliverability). 5-15% for longer annual surveys.

**Processing method:**
- NPS calculation: %Promoters (9-10) minus %Detractors (0-6)
- Segment by plan tier, tenure, usage level, geography
- Trend over quarters — single-quarter NPS is noisy, trends are signal
- See `nps-csat-automation.template.md` for full NPS automation flows

---

### 4. App Store Reviews (iOS/Android)

**When to use:** Continuously monitor. App store reviews are public, permanent, and directly impact your acquisition funnel. A drop from 4.5 to 4.0 stars measurably reduces download conversion.

**Setup approach:**
- Monitoring: AppFollow, AppBot, Appfigures, or manual daily check
- Set up Slack alerts for new reviews (especially 1-2 star)
- In-app review prompting: use the native SKStoreReviewController (iOS) / In-App Review API (Android)

**Signal quality:** Medium-low for individual reviews (often emotional, lack context). High in aggregate — review theme trends are a reliable signal of user pain points. Watch for review bombing after unpopular changes.

**Volume expectation:** Varies enormously. Expect 0.1-0.5% of MAU to leave reviews organically. In-app prompting can increase this 3-5x but be careful not to annoy users.

**Processing method:**
- Respond to ALL reviews ≤ 3 stars within 48 hours (see App Store Review Management below)
- Tag reviews by category (bug, UX, feature request, pricing, praise)
- Track weekly rating average and review volume as leading indicators
- Feed recurring themes into product backlog

---

### 5. Social Listening (Twitter/X, Reddit, HN, Product Hunt)

**When to use:** Always-on monitoring. Social feedback is unsolicited — users didn't choose to fill out your survey, they chose to talk about you publicly. This makes it both more honest and more visible.

**Setup approach:**
- Mention monitoring: Mention, Brand24, or Twitter/X search API for brand mentions
- Reddit: monitor relevant subreddits (your product's sub, industry subs) via custom RSS or tools like F5Bot
- Hacker News: monitor for brand mentions via HN Search API or Algolia
- Product Hunt: monitor your product page and related launches
- Set up a #social-mentions Slack channel for real-time feed

**Signal quality:** Variable. Social feedback is unstructured and often lacks context. But it captures sentiment you'd never get from surveys — users complaining to peers, not to you. Pay attention to the specific words users use — they reveal mental models.

**Volume expectation:** Depends on brand awareness. Early-stage: a few mentions per week. Growth-stage: dozens per day. The ratio of positive to negative mentions is more important than volume.

**Processing method:**
- Triage: is this a support issue (route to support), a product issue (tag for product), or general sentiment (log it)?
- Don't engage in every thread — sometimes the best response is to listen and fix the underlying issue
- Screenshot and share particularly insightful feedback in team channels

---

### 6. Sales/CS Call Notes (Structured Capture from Conversations)

**When to use:** Every sales call, customer success check-in, and support call contains feedback. The problem is that it lives in the rep's head, in scattered notes, or in call recordings nobody watches.

**Setup approach:**
- Call recording + transcription: Gong, Chorus, Fireflies.ai, or Otter.ai
- Structured capture form: after every call, rep fills out a 3-field form:
  1. Top pain point mentioned (dropdown from taxonomy)
  2. Feature request or improvement mentioned (free text)
  3. Competitive mention (dropdown: competitor name or "none")
- CRM integration: attach structured notes to the account record (Salesforce, HubSpot)

**Signal quality:** High for qualitative depth. A 30-minute conversation reveals nuance that no survey captures. But it's filtered through the rep's interpretation — train reps on what to capture and how to capture it without editorializing.

**Volume expectation:** Depends on team size and call volume. Expect 10-50 structured feedback entries per week from a team of 5-10 reps. Each one is worth 100 survey responses in terms of depth.

**Processing method:**
- Weekly review: product team reviews all call notes from the past week (30-minute meeting)
- Quarterly synthesis: aggregate call note themes into a "Voice of Customer" report
- Cross-reference with quantitative data — if surveys say "feature X is fine" but every call mentions friction with feature X, trust the calls

---

### 7. Feature Request Boards (Canny, Productboard, UserVoice, Custom)

**When to use:** When you want to give customers a structured, public channel to request features and vote on others' requests. Best for products with an engaged user base that wants to influence the roadmap.

**Setup approach:**
- Tool selection: Canny (simple, affordable), Productboard (powerful, integrates with PM workflow), UserVoice (enterprise-grade), or custom-built
- Categories: align with your product areas (e.g., "Reporting," "Integrations," "Mobile," "API")
- Voting: allow upvotes, but weight votes by customer segment (enterprise vote ≠ free-tier vote)
- Status updates: mark requests as "Under Review," "Planned," "In Progress," "Shipped," "Not Planned"

**Signal quality:** Medium. Voting creates popularity bias — the loudest requests get the most votes, not necessarily the most valuable ones. Use request boards as one input, not the sole input. Pay attention to requests from high-value segments even if vote counts are low.

**Volume expectation:** 5-20 new requests per week for a product with 1,000+ active users. Voting activity will be 5-10x that. Most boards follow a power law — a few requests get most votes.

**Processing method:**
- Weekly triage: review new requests, merge duplicates, assign categories
- Monthly prioritization: cross-reference with roadmap, business value, and effort
- Close the loop: when you ship a requested feature, notify voters and update the status — this drives ongoing engagement with the board

---

## Survey Design Patterns

### Micro-Surveys (In-App, 1-2 Questions)

**Trigger criteria:**
- User completed a specific workflow (exported a report, set up an integration, invited a team member)
- User used a feature for the 3rd time (they've formed an opinion but it's still fresh)
- User encountered an error and recovered (completed the action after a failure)
- User returned after 14+ days of inactivity (what brought them back?)

**Format options:**
- Single emoji scale: 😡 😕 😐 🙂 😊 — lowest cognitive load, highest response rate
- 1-5 star rating — familiar, works well for quality assessment
- Binary thumbs up/down — simplest, best for "was this helpful?" questions
- All formats: include an optional free-text field ("Anything else you'd like to share?")

**Display behavior:**
- Slide-in from bottom-right corner (desktop) or bottom sheet (mobile)
- NOT a modal — never block the user's workflow for a survey
- Animate in gently (300ms ease-in-out), auto-dismiss after 30 seconds if not interacted with
- Show a subtle dot indicator before expanding (user clicks to open)
- Persist across page navigation until answered or dismissed

**Dismissal rules:**
- X button to close immediately
- If dismissed without answering: don't show the same survey type for this trigger for 30 days
- If answered: show a brief "Thank you!" message (2 seconds), then fade out
- Never re-ask the same question about the same action

**Example micro-surveys:**
- After report export: "How easy was it to create this report?" (1-5) + "Any improvements you'd suggest?" (optional text)
- After integration setup: "How was the setup experience?" (emoji scale) + "What could be smoother?" (optional text)
- After 3rd use of a feature: "How useful is [feature name] to your workflow?" (1-5)
- After error recovery: "We noticed something went wrong. Were you able to complete your task?" (Yes/No) + "What happened?" (optional text)

---

### Post-Interaction Surveys

**Trigger timing:**
- Support ticket resolved: 1 hour after resolution (not immediately — let the fix take effect)
- Live chat ended: immediately after chat closes (while context is fresh)
- Onboarding completed: 24 hours after completing the last onboarding step
- Purchase/upgrade: 48 hours after purchase (let them experience the upgrade)
- Subscription renewal: 7 days after renewal (they've recommitted, capture why)

**Format — Conditional Follow-Up Based on Score:**

```
Score 1-2 (Unhappy):
  → "We're sorry to hear that. What went wrong?" (free text, REQUIRED)
  → Route to CX team for immediate follow-up

Score 3 (Neutral):
  → "What could we improve?" (free text, optional)
  → Log for pattern analysis

Score 4-5 (Happy):
  → "What did we do well?" (free text, optional)
  → "Would you recommend us to a colleague?" (Yes/No)
  → If Yes: show referral link or review request
```

**Channel selection logic:**
- If user is currently active in the app → show in-app survey
- If user was active in the last 4 hours → send push notification linking to in-app survey
- If user is inactive → send email with embedded first question
- Never send SMS surveys unless the user has explicitly opted into SMS communication
- Phone surveys (IVR): only for phone support interactions, offered at end of call

**Response rate optimization:**
- Keep it to 1 question + 1 optional follow-up (never more for post-interaction)
- Pre-fill context: "How was your experience with [agent name] regarding [ticket subject]?"
- Send from a real person's email address, not noreply@
- Subject line: "Quick question about your [support/onboarding] experience" (not "Survey")

---

### NPS Survey Flow

**Core question (do not modify wording):**
"How likely are you to recommend {{PROJECT_NAME}} to a friend or colleague? (0-10)"

**Scale display:**
- Horizontal row of numbers 0-10
- Color-coded: 0-6 red gradient, 7-8 yellow, 9-10 green
- Labels: "Not at all likely" under 0, "Extremely likely" under 10
- In email: each number is a clickable link that records the score and redirects to follow-up page

**Segment-specific follow-up questions:**

```
Detractors (0-6):
  → "What is the primary reason for your score?" (REQUIRED, free text)
  → Display: empathetic tone, "We appreciate your honesty and want to do better"
  → Action: triggers detractor follow-up flow (see nps-csat-automation.template.md)

Passives (7-8):
  → "What would we need to do to earn a 10 from you?" (optional, free text)
  → Display: curious tone, "You're almost a fan — help us get there"
  → Action: tag feedback for product team review

Promoters (9-10):
  → "What do you value most about {{PROJECT_NAME}}?" (optional, free text)
  → "Would you be willing to share your experience?" (optional)
     → If yes: show options — leave a review (G2/Capterra link), join case study, refer a friend
  → Action: triggers promoter activation flow
```

**Frequency and audience:**
- Cadence: {{CX_NPS_FREQUENCY}} (quarterly is the gold standard for most products)
- Eligible audience: active users who logged in at least once in the last 30 days AND have tenure > 30 days
- Exclusions: users who received an NPS survey in the last 80 days, users with open P0/P1 support tickets, users in the first 3 days of a trial
- Randomization: if eligible audience is very large, sample 25% per quarter (rotate so everyone is surveyed once per year)

**Cross-reference:** For the complete NPS automation and follow-up playbook, see `nps-csat-automation.template.md`.

---

### Customer Effort Score (CES)

**Core question:**
"How easy was it to [specific task]? (1-7)"

**Scale anchors:**
- 1 = "Very Difficult"
- 4 = "Neither Easy nor Difficult"
- 7 = "Very Easy"

**When CES is better than CSAT:**
- Measuring friction in specific workflows (CSAT measures satisfaction broadly, CES measures effort specifically)
- After self-service interactions (KB article, troubleshooting wizard, API setup)
- Predicting churn: CES is a stronger predictor of disloyalty than CSAT (customers don't leave because they're unsatisfied — they leave because things are too hard)

**Trigger examples:**
- After completing account setup (multi-step)
- After configuring an integration
- After finding an answer in documentation
- After completing a complex workflow for the first time
- After resolving an issue through self-service

**Target:** Average CES ≥ 5.5 across all measured workflows. Any workflow with average CES < 4.0 goes on the UX improvement shortlist.

---

### Long-Form Quarterly Surveys (Use Sparingly)

**When justified:** Once per quarter or twice per year, you may want deeper feedback than micro-surveys provide. These are appropriate for strategic questions: competitive positioning, feature prioritization, pricing perception.

**Design rules:**
- Maximum 10-15 questions (completion rate drops 5-10% per additional question beyond 10)
- Mix question types: 4-5 rating scales, 2-3 multiple choice, 2-3 free text, 1 ranking/prioritization
- Start with easy questions (satisfaction ratings), end with harder ones (open-ended)
- Include a progress bar (increases completion by 10-15%)
- Allow saving and resuming (if > 10 questions)
- Mobile-optimized layout (50%+ will respond on mobile)

**Incentive strategy:**
- Offer value, not cash: early access to a feature, extended trial, small account credit, exclusive content
- Don't offer cash or gift cards — they attract survey farmers and bias responses
- Mention the incentive in the invitation but don't make it the headline — "Help shape our roadmap (+ get early access to [feature])" not "Take our survey for a $10 gift card"

**Response rate benchmarks:**
- No incentive: 5-10%
- Value incentive: 15-25%
- Anything above 25% is excellent
- Below 5% means your survey is too long, your email deliverability is poor, or your customers don't feel connected enough to bother

**Distribution:**
- Email invitation with clear time estimate ("takes ~4 minutes")
- Reminder email 5 days after initial send (to non-responders only)
- Optional: in-app banner for high-value segments you want to ensure participate
- Close the survey after 2 weeks — don't leave it open indefinitely

---

## Trigger Logic Engine

### Event-Based Trigger Configuration

```yaml
triggers:
  - name: "post_ticket_csat"
    event: "ticket.resolved"
    delay: "1 hour"
    survey: "csat_post_interaction"
    conditions:
      - "ticket.channel != 'phone'"           # phone gets voice survey at end of call
      - "customer.last_surveyed_at < 14 days ago" # frequency cap
      - "ticket.resolution_type != 'spam'"     # don't survey spam tickets
      - "ticket.interactions >= 1"             # don't survey auto-resolved tickets
    fallback_channel: "email"                  # if user not in-app, send email

  - name: "onboarding_complete_csat"
    event: "onboarding.completed"
    delay: "24 hours"
    survey: "csat_onboarding"
    conditions:
      - "customer.onboarding_steps_completed >= 3" # they actually did the onboarding
      - "customer.last_surveyed_at < 7 days ago"
    fallback_channel: "email"

  - name: "feature_micro_survey"
    event: "feature.used_3x"
    delay: "immediate"
    survey: "micro_feature_feedback"
    conditions:
      - "feature.first_used_at > 7 days ago"   # let them learn first
      - "customer.surveys_shown_today < 1"      # daily cap
      - "customer.tenure_days >= 3"             # not during first 3 days
    fallback_channel: null                      # in-app only, no fallback

  - name: "error_recovery_survey"
    event: "error.recovered"
    delay: "immediate"
    survey: "micro_error_feedback"
    conditions:
      - "error.severity >= 'medium'"            # don't survey for trivial errors
      - "customer.error_surveys_this_month < 1" # max 1 error survey per month
    fallback_channel: null

  - name: "nps_quarterly"
    event: "schedule.quarterly"
    survey: "nps_full"
    conditions:
      - "customer.active_last_30_days == true"
      - "customer.tenure_days >= 30"
      - "customer.last_nps_survey_at < 80 days ago"
      - "customer.open_critical_tickets == 0"
    fallback_channel: "email"

  - name: "post_purchase_csat"
    event: "subscription.created OR subscription.upgraded"
    delay: "48 hours"
    survey: "csat_post_purchase"
    conditions:
      - "customer.last_surveyed_at < 7 days ago"
    fallback_channel: "email"

  - name: "churn_exit_survey"
    event: "subscription.cancelled"
    delay: "immediate"
    survey: "exit_survey"
    conditions: []                              # always show, no caps
    fallback_channel: "email"
```

### Frequency Capping and Fatigue Prevention

**Hard limits (non-negotiable):**
- Maximum 1 survey shown per user per day (across ALL survey types)
- Maximum 3 surveys per user per month (across ALL survey types)
- Maximum 1 NPS survey per quarter
- Maximum 1 CES survey per workflow per quarter

**Soft limits (configurable per {{PROJECT_NAME}}):**
- If user dismisses a survey without answering: don't show the same survey type for 30 days
- If user completes a survey: don't show ANY survey for 7 days (let the goodwill settle)
- If user has given negative feedback (score ≤ 2) in the last 14 days: pause all surveys except detractor follow-up

**Priority stack (when multiple triggers fire on the same day):**
1. Exit survey (cancellation) — always takes priority
2. CSAT (post-interaction) — time-sensitive, measures specific experience
3. CES (post-workflow) — time-sensitive, measures specific effort
4. Micro-survey (feature feedback) — contextual but can wait
5. NPS (quarterly) — not time-sensitive, can defer to next eligible day

**Excluded segments (never survey):**
- Users in their first 3 days (let them onboard in peace)
- Users with open P0/P1 support tickets (they're already frustrated)
- Users who have opted out of surveys (respect the opt-out permanently)
- Users flagged as "do not contact" in CRM
- Internal/test accounts

---

## Survey Data Model

### Core Schema

```sql
-- Survey definitions
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(30) NOT NULL CHECK (type IN ('nps', 'csat', 'ces', 'micro', 'exit', 'custom')),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,          -- array of question definitions
  trigger_config JSONB NOT NULL,     -- trigger rules (event, delay, conditions)
  frequency_cap JSONB,               -- per-user frequency limits for this survey
  active BOOLEAN DEFAULT true,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual survey responses
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES surveys(id) NOT NULL,
  customer_id UUID NOT NULL,
  scores JSONB NOT NULL,             -- { "nps": 9, "comment": "Great product", "follow_up": "..." }
  context JSONB,                     -- { "page": "/dashboard", "feature": "reports", "trigger": "feature.used_3x" }
  channel VARCHAR(30) NOT NULL,      -- 'in_app', 'email', 'sms', 'phone', 'exit_page'
  started_at TIMESTAMPTZ,            -- when the survey was displayed
  completed_at TIMESTAMPTZ,          -- null if abandoned
  dismissed_at TIMESTAMPTZ,          -- null if not dismissed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Survey display tracking (for frequency capping)
CREATE TABLE survey_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  survey_id UUID REFERENCES surveys(id),
  survey_type VARCHAR(30) NOT NULL,
  shown_at TIMESTAMPTZ DEFAULT NOW(),
  responded BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false
);

-- Auto-tagged feedback categories
CREATE TABLE feedback_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID REFERENCES survey_responses(id) NOT NULL,
  category VARCHAR(50) NOT NULL,     -- 'ux', 'performance', 'feature_request', 'bug', etc.
  sentiment VARCHAR(20),             -- 'positive', 'negative', 'neutral'
  key_themes TEXT[],                 -- ['slow loading', 'confusing navigation']
  confidence FLOAT,                  -- auto-tagger confidence score (0-1)
  tagged_by VARCHAR(30),             -- 'auto_llm', 'auto_keyword', 'manual'
  reviewed BOOLEAN DEFAULT false,    -- has a human reviewed this tag?
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_responses_customer ON survey_responses(customer_id);
CREATE INDEX idx_responses_survey ON survey_responses(survey_id);
CREATE INDEX idx_responses_completed ON survey_responses(completed_at);
CREATE INDEX idx_impressions_customer ON survey_impressions(customer_id, shown_at);
CREATE INDEX idx_tags_category ON feedback_tags(category);
```

### Question Definition Format (JSONB)

```json
{
  "questions": [
    {
      "id": "q1_nps",
      "type": "scale",
      "scale_min": 0,
      "scale_max": 10,
      "label": "How likely are you to recommend {{PROJECT_NAME}} to a colleague?",
      "min_label": "Not at all likely",
      "max_label": "Extremely likely",
      "required": true
    },
    {
      "id": "q2_followup",
      "type": "free_text",
      "label": "What is the primary reason for your score?",
      "required_condition": "q1_nps <= 6",
      "optional_condition": "q1_nps >= 7",
      "max_length": 1000,
      "placeholder": "Tell us more..."
    }
  ]
}
```

---

## In-App Survey Component Architecture

### Component Hierarchy

```
<SurveyProvider>                  ← Context provider, wraps the app
  <SurveyTrigger />               ← Invisible, listens for trigger events
  <SurveyQueue />                 ← Manages which survey to show next
  <MicroSurveyWidget />           ← Slide-in card for 1-2 question surveys
  <FullSurveyModal />             ← Modal for NPS and longer surveys
  <SurveyThankYou />              ← Brief confirmation after submission
</SurveyProvider>
```

### Component Responsibilities

**SurveyProvider:**
- Maintains survey queue state (which surveys are pending, which is active)
- Tracks impression history for frequency capping (backed by API call to check limits)
- Exposes `showSurvey(surveyId)` and `dismissSurvey(surveyId)` to children
- On mount: fetch eligible surveys for the current user from the API
- Handles submission: POST response to API, update local state, show thank-you

**SurveyTrigger:**
- Subscribes to the event bus (analytics events, feature flags, lifecycle events)
- When an event matches a trigger rule: check frequency caps → add to queue
- Invisible — renders nothing to the DOM
- Debounces: if multiple events fire within 1 second, only process the first matching trigger

**MicroSurveyWidget:**
- Renders as a small card (max 320px wide) sliding in from the bottom-right corner
- Contains: question text, response input (emoji/stars/thumbs), optional free-text, submit button, X to dismiss
- Animation: slide up 300ms ease-in-out, fade out 200ms on dismiss
- Auto-dismiss after 30 seconds if no interaction (logs as "ignored," different from "dismissed")
- Mobile: renders as a bottom sheet instead of a corner card

**FullSurveyModal:**
- Used for NPS surveys and any survey with 3+ questions
- Centers on screen with backdrop overlay
- Includes progress indicator for multi-question surveys
- Escape key or backdrop click to dismiss (with "Are you sure?" if partially completed)
- Fully keyboard-accessible (tab through options, enter to submit)

**SurveyThankYou:**
- Brief confirmation message displayed after survey submission
- Content varies by survey type and score:
  - Positive score: "Thanks for the feedback! We're glad things are going well."
  - Negative score: "Thank you for your honesty. Our team will follow up shortly."
  - Neutral: "Thanks! Your feedback helps us improve."
- Auto-dismiss after 3 seconds
- No additional CTAs — don't ask for more after they just gave you something

**Styling guidelines:**
- Match your product's design system exactly (typography, colors, spacing, border radius)
- Do NOT use a third-party widget's default styling — it should look native to your product
- Subtle entrance animation, not jarring
- Respect dark mode if your product supports it
- Ensure contrast ratios meet WCAG AA standards

---

## Feedback Aggregation and Reporting

### Aggregation Pipeline

```
Raw Responses
  → Cleaning (remove spam, blank free-text, test accounts)
  → Auto-Tagging (categorize free-text using LLM or keyword matching)
  → Enrichment (attach customer metadata: plan, tenure, usage tier)
  → Aggregation (scores by segment, time period, feature area, channel)
  → Storage (materialized views for dashboard queries)
  → Alerting (trigger alerts for threshold breaches)
```

**Cleaning rules:**
- Remove responses from internal/test accounts
- Remove responses where free-text is gibberish or single-character
- Flag but don't remove responses that seem like copy-paste spam (human review)
- Deduplicate: if same customer submits same survey twice (race condition), keep the first

### Tagging Taxonomy for Free-Text Feedback

**Primary categories:**

| Category | Description | Example feedback |
|---|---|---|
| UX/Usability | Interface confusion, workflow friction | "I couldn't find the export button" |
| Performance | Speed, reliability, uptime | "Pages take forever to load" |
| Feature Request | New functionality desired | "I wish I could schedule reports" |
| Bug Report | Something is broken | "The chart shows wrong numbers" |
| Pricing | Cost concerns, value perception | "Too expensive for what I get" |
| Documentation | Help content, guides, API docs | "Your docs don't cover webhooks" |
| Support Quality | Agent interactions, resolution quality | "Support was incredibly helpful" |
| Onboarding | Initial setup, learning curve | "Setup was confusing" |
| Integration | Third-party connections, API | "Your Salesforce integration keeps breaking" |
| Mobile | Mobile app experience | "The mobile app is missing features" |

**Auto-tagging implementation:**
- Primary method: LLM-based classification (GPT-4o-mini or Claude Haiku for cost efficiency)
- Prompt: provide the taxonomy, the feedback text, and ask for structured output:

```json
{
  "category": "ux_usability",
  "sentiment": "negative",
  "key_themes": ["navigation", "discoverability"],
  "confidence": 0.92
}
```

- Fallback: keyword matching for when LLM is unavailable or for real-time needs
- Human review: spot-check 10% of auto-tagged responses weekly; measure and track accuracy
- Retrain: if accuracy drops below 85%, update the prompt or add examples

### Reporting Dashboard

**NPS Trend (Primary KPI):**
- Trailing 90-day NPS score, plotted weekly
- Segment breakdown: by plan tier, by user cohort, by geography
- Target line: {{CX_NPS_BENCHMARK}}
- Alert indicators when trend crosses threshold

**CSAT by Touchpoint:**
- Average CSAT score per touchpoint: support, chat, onboarding, feature areas
- Trend over 30-day rolling window
- Highlight touchpoints below {{CX_CSAT_TARGET}}

**CES by Workflow:**
- Average CES per measured workflow, sorted lowest to highest
- Highlight workflows below 4.0 (high-friction)
- Show change since last period

**Free-Text Theme Cloud:**
- Top 10 themes from auto-tagged free-text in last 30 days
- Sized by frequency, colored by sentiment (green = positive, red = negative)
- Clickable: drill into individual responses for each theme

**Response Rate Tracker:**
- Response rate by survey type and channel
- Trend over time (are response rates declining? survey fatigue warning)
- Benchmark: in-app micro-surveys > 10%, NPS email > 15%, post-interaction > 20%

**Detractor Alert Feed:**
- Real-time scrolling feed of negative feedback (NPS 0-6, CSAT 1-2, CES 1-3)
- Each entry: customer name, score, comment, context (what they were doing), account value
- One-click: "Assign to me" to claim follow-up, "View account" to see full customer profile

---

## App Store Review Management

### Response Protocol

**Response time SLA:**
- 1-2 star reviews: respond within 24 hours
- 3 star reviews: respond within 48 hours
- 4-5 star reviews: respond within 1 week (optional but appreciated)

**Response template structure (customize for each review):**

```
1-2 stars:
"Hi [name if visible], thank you for taking the time to share your experience.
We're sorry that [acknowledge specific issue they mentioned].
[Explain what you're doing about it OR provide a workaround].
We'd love to help resolve this — please reach out to [support email] and
reference this review so our team can prioritize your case."

3 stars:
"Thank you for the feedback, [name]. We appreciate the honest assessment.
We're working on improving [area they mentioned] and your input helps us
prioritize. If you have specific suggestions, we'd love to hear them at
[feedback channel]."

4-5 stars:
"Thank you so much, [name]! We're glad you're enjoying [specific thing
they praised]. Your support means a lot to the team."
```

**Rules:**
- Never be defensive or dismissive
- Never promise specific timelines for fixes in public responses
- Never ask them to change their rating (it backfires)
- Do reference specific things they mentioned (shows you actually read it)
- Keep responses under 100 words (nobody reads long app store responses)

### Proactive Review Solicitation

**When to ask for reviews:**
- After a user gives a positive CSAT score (4-5) or NPS score (9-10)
- After a user completes a milestone (100th use, 1-year anniversary)
- After a major positive product update that users responded well to

**How to ask:**
- Use the native in-app review API (SKStoreReviewController / In-App Review API)
- Apple limits display to 3 times per year — use them wisely
- Don't show a custom pre-prompt ("Do you enjoy our app?") before the native prompt — Apple may reject this pattern
- On Android: more flexibility, but still limit to meaningful moments

---

## Implementation Checklist

### Phase 1: Foundation (Weeks 1-2)
- [ ] Choose survey tooling: in-app component (custom build or Refiner/Survicate/Hotjar) + email surveys (Customer.io/Loops)
- [ ] Design and implement the MicroSurveyWidget component
- [ ] Design and implement the FullSurveyModal component
- [ ] Set up the SurveyProvider context and SurveyTrigger event listener
- [ ] Create the survey and survey_responses database tables
- [ ] Build the survey display and submission API endpoints

### Phase 2: Core Surveys (Weeks 3-4)
- [ ] Configure and launch: post-support-ticket CSAT survey
- [ ] Configure and launch: post-onboarding CSAT survey
- [ ] Configure and launch: feature micro-survey (pick top 3 features to start)
- [ ] Configure and launch: NPS quarterly survey with follow-up flows
- [ ] Implement frequency capping logic (1/day, 3/month hard limits)
- [ ] Set up survey impression tracking for cap enforcement

### Phase 3: Aggregation and Reporting (Weeks 5-6)
- [ ] Build the auto-tagging pipeline for free-text responses (LLM-based)
- [ ] Create materialized views for dashboard queries (NPS trend, CSAT by touchpoint)
- [ ] Build the reporting dashboard (start with NPS trend + CSAT by touchpoint)
- [ ] Configure detractor alert (Slack notification for NPS 0-6 or CSAT 1-2)
- [ ] Set up weekly feedback review cadence (30-min meeting, product + CX)

### Phase 4: Extended Channels (Weeks 7-8)
- [ ] Set up app store review monitoring and alerting (if mobile app exists)
- [ ] Configure social listening for brand mentions
- [ ] Implement structured call note capture for Sales/CS teams
- [ ] Set up feature request board (Canny or equivalent)
- [ ] Connect feedback data to customer health scoring (see `customer-health-scoring.template.md`)

### Phase 5: Optimization (Ongoing)
- [ ] Review auto-tagging accuracy weekly, adjust prompts as needed
- [ ] Monitor response rates monthly — investigate any decline
- [ ] A/B test survey placement and timing for response rate optimization
- [ ] Quarterly: audit frequency caps — are users being over-surveyed?
- [ ] Quarterly: review feedback themes → update product roadmap priorities
- [ ] Train new team members on the feedback review process and detractor follow-up protocol

---

## Appendix: Tool Comparison Matrix

| Capability | Refiner | Survicate | Hotjar Surveys | Delighted | Custom Build |
|---|---|---|---|---|---|
| In-app micro-surveys | Yes | Yes | Yes | Limited | Full control |
| NPS automation | Basic | Basic | No | Excellent | Build yourself |
| Email surveys | No | Yes | No | Yes | Integrate w/ email platform |
| Auto-tagging | No | No | No | Basic | LLM-powered |
| Frequency capping | Basic | Basic | No | Yes | Full control |
| Design customization | Moderate | Moderate | Low | Low | Full control |
| Pricing | $$ | $$ | $ | $$$ | Engineering time |
| Best for | Product teams | Marketing + Product | Quick insights | NPS-focused programs | Teams needing full control |

**Recommendation for {{PROJECT_NAME}}:** If you're early-stage (< 10K MAU), start with Refiner or Survicate for speed. If you're scaling (> 50K MAU) or need deep customization, build the in-app component custom and use Delighted or a custom NPS pipeline for email surveys. The auto-tagging pipeline should always be custom (LLM-based) regardless of survey tool choice.

---

*Cross-references:*
- `nps-csat-automation.template.md` — Automated follow-up flows for NPS/CSAT scores
- `customer-health-scoring.template.md` — How satisfaction scores feed into health scoring
- `20-post-launch/user-feedback-loops.template.md` — Turning feedback into roadmap items
- `PLACEHOLDER-REGISTRY.md` — All placeholder definitions including {{CX_NPS_FREQUENCY}}, {{CX_CSAT_TARGET}}, {{CX_NPS_BENCHMARK}}
