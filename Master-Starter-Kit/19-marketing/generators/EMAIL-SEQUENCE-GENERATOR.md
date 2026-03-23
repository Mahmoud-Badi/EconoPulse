# Email Sequence Generator

**Purpose:** Generate complete, ready-to-send email sequences with full copy for onboarding,
sales nurture, win-back, and product launch campaigns. Each email includes subject line
variants for A/B testing, preview text, structured body copy, and CTA. Adapts tone and
content to product type, brand voice, and buyer journey length.

**Output:** `marketing/email-sequences/` (one file per sequence)

---

## When to Run

Run this generator after completing:
1. Marketing Intake (Step 19) -- MARKETING_CONFIG is populated
2. Brand & Messaging (Step 21) -- brand voice and messaging framework exist
3. Landing Page Copy Generator -- CTA and value proposition copy are finalized

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| MARKETING_CONFIG | Orchestrator STATE BLOCK | Product type, pricing model, audience, UVP |
| Brand Voice Guide | `marketing/brand-messaging/brand-voice-guide.md` | Tone, personality, vocabulary |
| Value Proposition Canvas | `marketing/brand-messaging/value-proposition-canvas.md` | Pains, gains, jobs-to-be-done |
| Messaging Framework | `marketing/brand-messaging/messaging-framework.md` | Key messages, proof points |
| Product Features | Project brief or tribunal specs | Feature list with user benefits |
| User Personas | `dev_docs/user-personas.md` | Target users, their language, goals |
| Pricing Details | `marketing/pricing-monetization/pricing-strategy.md` | Tiers, pricing, free vs paid features |
| Onboarding Flow | `marketing/onboarding-retention/activation-flow.md` | Key activation milestones |

---

## Generation Algorithm

1. **Read MARKETING_CONFIG.** Extract:
   - `{{PRODUCT_TYPE}}` -- determines sequence structure and content focus
   - `{{PRICING_MODEL}}` -- determines upgrade messaging and trial references
   - `{{BUYER_JOURNEY_LENGTH}}` -- determines sequence pacing
   - `{{UNIQUE_VALUE_PROP}}` -- core message for every email
   - `{{PLAIN_ENGLISH_DESCRIPTION}}` -- used in welcome email
   - `{{CUSTOMER_LANGUAGE}}` -- pain-point phrasing for subject lines

2. **Read the onboarding/activation flow.** Extract:
   - Key activation milestones (what actions lead to "aha moment")
   - Typical time to first value
   - Common drop-off points

3. **Read the brand voice guide.** Apply:
   - Email tone (casual first-name basis vs professional)
   - Vocabulary preferences
   - Sign-off style (founder name vs team name)

4. **Generate all four sequences** per the format below.

5. **Apply personalization variables** throughout:
   - `{{FIRST_NAME}}` -- subscriber first name
   - `{{COMPANY_NAME}}` -- subscriber company (B2B)
   - `{{PLAN_NAME}}` -- current plan tier
   - `{{PRODUCT_NAME}}` -- resolves to `{{PROJECT_NAME}}`
   - `{{SIGNUP_DATE}}` -- date they registered
   - `{{LAST_ACTIVE_DATE}}` -- last login/usage date (for win-back)

6. **Validate** against quality gates.

---

## Email Copy Guidelines

### Subject Line Rules
- 40 characters or fewer (mobile truncation)
- No ALL CAPS, no excessive punctuation (!!!), no spam trigger words
- Use curiosity, specificity, or personalization
- Each email gets 3 A/B variant subject lines
- Include emoji ONLY if brand voice guide permits (max 1 per subject)

### Preview Text Rules
- 40-90 characters
- Complements (not repeats) the subject line
- Acts as a "second subject line" in the inbox

### Body Copy Rules
- Opening line: do NOT start with "I hope this finds you well" or any cliche greeting
- Maximum 200 words per email (shorter is better)
- One clear CTA per email (not three different CTAs)
- Use short paragraphs (1-3 sentences max)
- Use the reader's pain language, not marketing language
- Sign off from a real person (founder name), not "The {{PROJECT_NAME}} Team"

### CTA Rules
- One primary CTA button per email
- Button text is an action verb + outcome (not "Click Here")
- Optional: one text link CTA as secondary
- CTA should be visible without scrolling on mobile

---

## Output Format

### Sequence 1: Welcome/Onboarding (7 emails, Days 0-14)

Write to `marketing/email-sequences/welcome-onboarding-sequence.md`:

```markdown
# Welcome/Onboarding Email Sequence -- {{PROJECT_NAME}}

> **Trigger:** User signs up / creates account
> **Goal:** Guide user to first value (activation), build relationship, establish habit
> **Sequence length:** 7 emails over 14 days
> **Sender:** {{FOUNDER_NAME}} <{{FOUNDER_EMAIL}}>
> **From name:** {{FOUNDER_NAME}} from {{PROJECT_NAME}}

---

## Email 1: Welcome (Day 0, send immediately)

**Goal:** Confirm sign-up, set expectations, guide to first action.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Welcome to {{PRODUCT_NAME}}, {{FIRST_NAME}}" | "Here's your first step" |
| B | "You're in! Here's what to do first" | "Takes less than 2 minutes" |
| C | "{Specific benefit} starts now" | "One quick setup and you're ready" |

### Body

Hi {{FIRST_NAME}},

{1-2 sentences: genuine welcome. Express excitement. Mention what they signed up for
and validate their decision.}

{1-2 sentences: set expectations for this email sequence. "Over the next two weeks,
I'll share everything you need to get the most out of {{PRODUCT_NAME}}."}

**Your first step:**

{1-2 sentences pointing to the single most important first action. This should be
the first activation milestone from the onboarding flow. Be extremely specific:
"Click the button below to [exact action] -- it takes about [time]."}

[CTA Button: "{Action verb} your first {object}"]

{1 sentence: what happens after they complete this step.}

Best,
{{FOUNDER_NAME}}
Founder, {{PROJECT_NAME}}

P.S. {Short P.S. line -- reply-to engagement hook. "Hit reply if you have any questions --
I read every email." P.S. lines get 79% readership.}

---

## Email 2: Quick Win (Day 1)

**Goal:** Help user achieve their first "aha moment" with the product.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Did you try this yet, {{FIRST_NAME}}?" | "{Outcome} in under {time}" |
| B | "The fastest way to {outcome}" | "Most users do this first" |
| C | "{Outcome} in {X} minutes -- here's how" | "Step-by-step inside" |

### Body

{Conditional: if user completed Email 1 CTA, acknowledge it. If not, gently re-prompt.}

Hi {{FIRST_NAME}},

{1-2 sentences: introduce the quick win. Frame it as "here's something most users find
valuable in their first day."}

**Here's how:**
1. {Step 1 -- specific, with exact navigation instructions}
2. {Step 2}
3. {Step 3}

{1 sentence: what the outcome looks like when they complete this.}

[CTA Button: "{Action verb} now"]

{{FOUNDER_NAME}}

---

## Email 3: Core Feature Spotlight (Day 3)

**Goal:** Introduce the product's most differentiated feature.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "You haven't tried the best part yet" | "This is what makes us different" |
| B | "How {{FIRST_NAME}} can {specific outcome}" | "Using {feature name}" |
| C | "The feature our users love most" | "And it only takes {time}" |

### Body

Hi {{FIRST_NAME}},

{1-2 sentences: introduce the differentiating feature. Tie it to a specific pain point
from the value proposition canvas.}

{2-3 sentences: explain what the feature does in terms of USER OUTCOME, not technical
capability. Include a specific example or use case.}

{Optional: include a short GIF or screenshot link showing the feature in action.}

[CTA Button: "Try {feature name}"]

{{FOUNDER_NAME}}

---

## Email 4: Social Proof (Day 5)

**Goal:** Build trust through other users' success stories.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "How {Company/Person} {achieved outcome}" | "Using {{PRODUCT_NAME}}" |
| B | "{{FIRST_NAME}}, you're in good company" | "{N} {user type} and counting" |
| C | "{Specific result} -- a customer story" | "And how you can do the same" |

### Body

Hi {{FIRST_NAME}},

{1-2 sentences: transition into the story. "I wanted to share how one of our users
is getting results with {{PRODUCT_NAME}}."}

{Testimonial or case study snippet: 3-4 sentences with SPECIFIC outcomes. Numbers,
timeframes, before/after comparisons.}

{1-2 sentences: bridge to reader. "You can get similar results by {specific action}."}

[CTA Button: "{Action that leads to similar outcome}"]

{{FOUNDER_NAME}}

---

## Email 5: Overcome Objections (Day 7)

**Goal:** Address the #1 reason users stall or churn after signup.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Stuck? Here's help" | "Common questions answered" |
| B | "{{FIRST_NAME}}, quick question" | "Are you running into this?" |
| C | "The #1 thing new users ask" | "And the answer" |

### Body

Hi {{FIRST_NAME}},

{1-2 sentences: acknowledge that getting started with any new tool takes effort. Be
empathetic, not pushy.}

{Address the #1 objection or confusion point. Pull from the objection handling section
of the messaging framework. Be direct and helpful.}

**Common questions:**

**Q: {Question 1}**
A: {1-2 sentence answer.}

**Q: {Question 2}**
A: {1-2 sentence answer.}

{1 sentence: offer to help directly. "Reply to this email and I'll personally help you
get set up."}

[CTA Button: "Get help" or "Talk to us"]

{{FOUNDER_NAME}}

---

## Email 6: Advanced Feature / Power Tip (Day 10)

**Goal:** Deepen engagement by revealing more product value.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Power tip: {specific shortcut/feature}" | "Save {time/effort} with this" |
| B | "{{FIRST_NAME}}, most people miss this" | "But it saves {X} hours/week" |
| C | "Level up your {workflow}" | "Advanced tip inside" |

### Body

{Introduce a secondary feature, advanced use case, or workflow optimization. Frame it
as an insider tip, not a feature announcement. Make the reader feel like they are
getting special knowledge.}

[CTA Button: "Try this now"]

---

## Email 7: Feedback + Next Steps (Day 14)

**Goal:** Collect feedback, re-engage inactive users, prompt upgrade (if freemium).

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Quick question, {{FIRST_NAME}}" | "Takes 30 seconds" |
| B | "How's it going with {{PRODUCT_NAME}}?" | "I'd love your feedback" |
| C | "2 weeks in -- what do you think?" | "Reply with one word" |

### Body

Hi {{FIRST_NAME}},

{1-2 sentences: note that it's been two weeks since they joined.}

{Ask for feedback: "I'd love to know: what's the ONE thing you wish {{PRODUCT_NAME}}
did better? Just hit reply -- I read every response."}

{If PRICING_MODEL == "freemium": include a soft upgrade mention. "By the way, if
you're finding {{PRODUCT_NAME}} useful, our Pro plan unlocks {key pro feature}.
But no pressure -- the free plan is yours forever."}

{If PRICING_MODEL == "free_trial": include trial status. "Your free trial has {X} days
remaining. When you're ready, here's how to continue without interruption."}

[CTA Button: "Share feedback" or "Upgrade to Pro"]

{{FOUNDER_NAME}}
```

---

### Sequence 2: Sales Nurture (5 emails, Days 0-21)

Write to `marketing/email-sequences/sales-nurture-sequence.md`:

```markdown
# Sales Nurture Email Sequence -- {{PROJECT_NAME}}

> **Trigger:** User downloads lead magnet, attends webinar, or requests info (warm lead, not signed up)
> **Goal:** Build trust, educate, and convert to trial/purchase
> **Sequence length:** 5 emails over 21 days
> **Tone:** Helpful expert, not pushy salesperson

---

## Email 1: Deliver Value (Day 0)
**Goal:** Deliver the promised resource and establish credibility.
{Deliver the lead magnet/resource. Add 2-3 sentences of unique insight not in the resource.
Soft mention of the product.}

## Email 2: Problem Deep-Dive (Day 3)
**Goal:** Deepen the reader's awareness of the problem.
{Use PAS formula. Agitate the core pain point. Share a relevant stat or story.
Position {{PROJECT_NAME}} as aware of the problem (but do not pitch yet).}

## Email 3: Solution Education (Day 7)
**Goal:** Educate on the solution approach (not just your product).
{Teach something valuable about solving the problem. Be genuinely helpful. Mention how
{{PROJECT_NAME}} approaches it, but keep the focus on education.}

## Email 4: Case Study / Proof (Day 14)
**Goal:** Provide evidence that your approach works.
{Share a detailed case study or before/after story. Include specific metrics. Bridge to
"you could achieve similar results."}

## Email 5: Direct Offer (Day 21)
**Goal:** Make a clear, compelling offer.
{Direct pitch with specific offer. Include: what they get, what it costs, what the risk is
(money-back guarantee, free trial, etc.). Clear single CTA.}

{For each email: follow the same format as the welcome sequence -- 3 subject line
variants, preview text, full body copy, single CTA.}
```

---

### Sequence 3: Win-Back (3 emails)

Write to `marketing/email-sequences/win-back-sequence.md`:

```markdown
# Win-Back Email Sequence -- {{PROJECT_NAME}}

> **Trigger:** User inactive for 14+ days (no login, no product usage)
> **Goal:** Re-engage churned or inactive users
> **Sequence length:** 3 emails over 14 days

---

## Email 1: Gentle Check-In (Day 14 of inactivity)
**Goal:** Re-establish contact without pressure.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "We miss you, {{FIRST_NAME}}" | "Anything we can help with?" |
| B | "Is everything okay?" | "Haven't seen you in a while" |
| C | "{{FIRST_NAME}}, quick update" | "Some things changed since you left" |

{Body: empathetic tone. Acknowledge they've been away. Ask if they hit a roadblock.
Offer help. Include a "what's new" bullet list if features were shipped since they left.}

## Email 2: Value Reminder + Incentive (Day 21 of inactivity)
**Goal:** Remind them why they signed up, offer a reason to return.

{Body: remind them of the original problem they came to solve. Show what they're missing.
If applicable, offer an incentive: extended trial, discount, 1-on-1 onboarding call.}

## Email 3: Final Attempt / Feedback (Day 28 of inactivity)
**Goal:** Last chance to re-engage; if not, collect feedback for improvement.

{Body: honest "last email" framing. "If {{PRODUCT_NAME}} isn't right for you, that's
completely okay. But I'd love to know what we could do better." Include a 1-question
survey or reply prompt. Mention they can always come back.}
```

---

### Sequence 4: Product Launch Announcement (3 emails)

Write to `marketing/email-sequences/product-launch-sequence.md`:

```markdown
# Product Launch Email Sequence -- {{PROJECT_NAME}}

> **Trigger:** Product launch date (manual send)
> **Audience:** Email list, waitlist, beta users
> **Goal:** Drive sign-ups/purchases on launch day and week
> **Sequence length:** 3 emails (pre-launch, launch day, follow-up)

---

## Email 1: Pre-Launch Teaser (3-5 days before launch)
**Goal:** Build anticipation, prime the audience.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "Something big is coming, {{FIRST_NAME}}" | "And you get early access" |
| B | "{{PRODUCT_NAME}} launches in {X} days" | "Here's what to expect" |
| C | "You asked for this. We built it." | "Launching {date}" |

{Body: reveal what's launching. Build excitement. Offer early access or a launch-day
bonus to email subscribers. Include a specific date and time. Ask them to mark their
calendar.}

## Email 2: Launch Day (Day of launch)
**Goal:** Drive immediate sign-ups/purchases.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "It's here. {{PRODUCT_NAME}} is live." | "Get started now" |
| B | "{{FIRST_NAME}}, {{PRODUCT_NAME}} just launched" | "Be one of the first" |
| C | "We just launched! Here's your link" | "Special offer inside" |

{Body: announce the launch. Keep it short and energetic. Link directly to the
product/landing page. Include launch-day offer if applicable (discount, bonus, extended
trial). Add social proof: "X people signed up in the first hour." Ask them to share.}

## Email 3: Follow-Up (2-3 days after launch)
**Goal:** Catch people who missed launch day, share early results.

### Subject Line Variants
| Variant | Subject | Preview Text |
|---------|---------|-------------|
| A | "In case you missed it" | "{{PRODUCT_NAME}} launched and here's what happened" |
| B | "{X} people signed up in {Y} hours" | "You can still join" |
| C | "The response has been incredible" | "Thank you -- and here's your link" |

{Body: share launch results (sign-ups, feedback, coverage). For those who haven't
signed up: remind them of the value prop and any remaining offers. Social proof
from early adopters if available.}
```

---

## Send Timing Recommendations

| Sequence | Send Day | Send Time | Rationale |
|----------|----------|-----------|-----------|
| Welcome Email 1 | Immediately | On sign-up | Strike while interest is hot |
| Welcome Emails 2-7 | Tue/Wed/Thu | 10:00 AM local | Highest open rates mid-week, mid-morning |
| Sales Nurture | Tue/Thu | 9:00 AM local | B2B audience checks email early |
| Win-Back | Wed | 2:00 PM local | Afternoon = less inbox competition |
| Launch Day | Tue/Wed | 10:00 AM ET | Peak email engagement time |

**Timezone handling:** Send in recipient's local timezone when possible. If timezone
unknown, use 10:00 AM ET (US) or 10:00 AM GMT (international).

---

## A/B Testing Plan

| Test | What to Test | How to Split | Duration | Success Metric |
|------|-------------|-------------|----------|----------------|
| Subject lines | 3 variants per email | 33/33/34 split | 4 hours, then send winner | Open rate |
| Send time | Morning vs afternoon | 50/50 split | Full sequence cycle | Open rate |
| CTA placement | Top of email vs bottom | 50/50 split | 2 sequence cycles | Click rate |
| Sender name | Founder name vs company name | 50/50 split | 2 weeks | Open rate |
| Email length | Short (100 words) vs long (200 words) | 50/50 split | 2 weeks | Click rate |

---

## Conditional Adjustments by Product Type

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
- Welcome sequence focuses on trial activation and feature adoption
- Include "trial ending" reminder at day 7 and day 12 (if 14-day trial)
- Sales nurture includes ROI calculator or cost savings comparison
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
- Replace "log in" CTAs with deep links to the app
- Welcome sequence focuses on Day 1 and Day 7 retention actions
- Include push notification strategy alongside email
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
- Include code examples and technical tips in onboarding emails
- Link to documentation and API reference
- Sales nurture focuses on technical capabilities and benchmarks
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
- Create separate sequences for each side of the marketplace
- Welcome sequence helps them complete their profile and first transaction
- Include trust and safety information
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "client_site" -->
- Sales nurture focuses on case studies and ROI
- Replace "sign up" CTAs with "schedule a call" or "request a quote"
- Include portfolio highlights and process explanations
<!-- ENDIF -->

---

## Quality Gates

Before finalizing email sequences, verify:

- [ ] Every subject line is under 40 characters
- [ ] Every email has exactly ONE primary CTA
- [ ] No email exceeds 200 words (body copy only)
- [ ] Personalization variables ({{FIRST_NAME}}, etc.) have fallback values
- [ ] Tone matches brand voice guide throughout all sequences
- [ ] No email uses spam trigger words (free, guarantee, act now, limited time)
- [ ] Send timing follows the recommendations table
- [ ] Each sequence has a clear goal progression (educate -> engage -> convert)
- [ ] Win-back sequence is empathetic, not guilt-tripping
- [ ] Launch sequence creates genuine excitement without false urgency
- [ ] All links/CTAs point to real destinations (landing page, app, etc.)
- [ ] Unsubscribe link is mentioned (required by CAN-SPAM / GDPR)

---

## Validation Checklist

After generation, verify:
- [ ] All `{{PLACEHOLDER}}` variables are resolved or documented as dynamic
- [ ] Email count matches spec: Welcome (7), Nurture (5), Win-Back (3), Launch (3) = 18 total
- [ ] Every email has 3 subject line A/B variants
- [ ] Preview text exists for every email
- [ ] Conditional sections match the actual product type
- [ ] Sequence timing makes sense (no emails sent on weekends unless intentional)
- [ ] The sequences can be loaded into any email platform (Mailchimp, ConvertKit, etc.)
