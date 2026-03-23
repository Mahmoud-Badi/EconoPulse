# Activation Flow Design for {{PROJECT_NAME}}

> First-run experience and "aha moment" strategy to convert signups into active, retained users.

---

## What Is Activation?

Activation is the moment a new user first experiences your product's **core value**. It is not simply creating an account or completing onboarding -- it is the specific action (or sequence of actions) after which a user thinks, "Yes, this is exactly what I needed."

Activation is the single most important metric for early-stage products because it sits at the hinge between acquisition and retention. Users who activate retain at 2-5x the rate of those who do not. Every improvement to activation rate compounds across your entire user base.

**Key principle:** Activation is not about your product -- it is about your user achieving their goal. Frame everything around user success, not feature discovery.

---

## Identifying the "Aha Moment" for {{PROJECT_NAME}}

The "aha moment" is the specific action or experience that causes a user to realize the value of your product. It is discovered through data, not intuition.

### Famous Aha Moments

| Product | Aha Moment | Why It Works |
|---------|-----------|--------------|
| Slack | Sent first message in a channel | Experiences real-time team communication |
| Dropbox | Saved first file to synced folder | Sees the magic of files appearing everywhere |
| Zoom | Completed first video call | Experiences frictionless video conferencing |
| Twitter/X | Followed 30 users | Feed becomes interesting and personalized |
| Facebook | Connected with 7 friends in 10 days | Social graph reaches critical mass |
| Figma | Created first collaborative design | Experiences real-time multiplayer design |
| Notion | Created first structured page | Sees the flexibility of blocks |

### How to Find Your Aha Moment

**Step 1: Identify retained users**
Pull a cohort of users who signed up 60-90 days ago. Segment them into "retained" (still active) and "churned" (inactive or cancelled).

**Step 2: Compare early behavior**
Analyze what retained users did in their first 1, 3, and 7 days that churned users did not. Look for:
- Specific features used
- Actions completed
- Content created or consumed
- Connections made (invites, follows, shares)
- Frequency and depth of engagement

**Step 3: Find the correlation**
Look for the action with the highest correlation to retention. This is your candidate aha moment.

**Step 4: Validate causation**
Run an experiment: guide a cohort of new users toward that action and measure if retention improves. If it does, you have found your aha moment.

### Aha Moment Hypothesis for {{PROJECT_NAME}}

Based on the product type and target personas ({{PERSONAS}}):

```
Our aha moment hypothesis:
When a user [SPECIFIC ACTION] within [TIMEFRAME],
they are [X]x more likely to retain at 30 days.

Action: ________________________________________________
Timeframe: _____________________________________________
Expected retention lift: ________________________________
How we will measure: ____________________________________
```

---

## Activation Metric Definition Framework

Pick 3-5 key actions that correlate with long-term retention. These become your "activation criteria."

### Defining Activation Criteria

| Priority | Action | Timeframe | Measurement | Weight |
|----------|--------|-----------|-------------|--------|
| Critical | {{ACTIVATION_ACTION_1}} | Within first session | Event tracking | 40% |
| High | {{ACTIVATION_ACTION_2}} | Within first 24 hours | Event tracking | 25% |
| High | {{ACTIVATION_ACTION_3}} | Within first 3 days | Event tracking | 20% |
| Medium | {{ACTIVATION_ACTION_4}} | Within first 7 days | Event tracking | 10% |
| Medium | {{ACTIVATION_ACTION_5}} | Within first 7 days | Event tracking | 5% |

**Activation definition:** A user is "activated" when they complete at least the Critical action plus one High-priority action within their first 7 days.

### Activation Rate Calculation

```
Activation Rate = (Users who meet activation criteria / Total new signups) x 100

Current: ____%
Target (30 days): ____%
Target (90 days): ____%
```

---

## First-Run Experience Design

The first-run experience (FRE) is the single most impactful design surface in your product. Get it right and users activate. Get it wrong and they leave forever.

### Progressive Disclosure

**Principle:** Do not show users everything at once. Reveal complexity as they demonstrate readiness.

```
Layer 1 (First session):   Core action only — one thing to do right now
Layer 2 (Day 1-3):         Supporting features — 2-3 related capabilities
Layer 3 (Day 4-7):         Power features — advanced options for engaged users
Layer 4 (Day 8+):          Full product — everything unlocked and discoverable
```

**Anti-pattern to avoid:** The "feature tour" that walks users through every feature before they can do anything. This teaches navigation, not value.

### Guided Setup Wizard vs Self-Serve Exploration

| Factor | Guided Wizard | Self-Serve Exploration |
|--------|--------------|----------------------|
| Best for | Complex products, non-technical users | Simple products, technical users |
| Structure | Step-by-step linear flow | Open canvas with contextual hints |
| Risk | Users skip/rush through | Users get lost, miss key features |
| When to use | B2B SaaS, enterprise tools | Consumer apps, developer tools |
| Completion rate | 60-80% typical | N/A (no defined end) |

**Recommendation for {{PROJECT_NAME}}:** Use a hybrid approach. Offer a guided quick-start (3-5 steps to first value) with the option to skip and explore freely.

### Empty State Design

Empty states are the most overlooked design opportunity. When a user first sees a dashboard, list, or workspace with no data, they need direction.

**Empty State Checklist:**
- [ ] Explain what this area is for (one sentence)
- [ ] Show what it will look like with data (illustration or example)
- [ ] Provide one clear action to populate it ("Create your first {{ITEM}}")
- [ ] Include a link to help documentation for context
- [ ] Optional: offer sample/demo data to explore

**Template:**
```
[Illustration of feature in use]

"No {{ITEMS}} yet"

{{ITEMS}} help you [benefit]. Create your first one to [specific outcome].

[Primary CTA: Create {{ITEM}}]   [Secondary: Import from CSV]   [Tertiary: View example]
```

### Sample Data and Templates

Pre-fill the product with meaningful sample data so users can see value immediately before creating their own content.

- **Project management:** Pre-built project template with sample tasks
- **Analytics:** Demo dashboard with sample data
- **Design tool:** Starter templates for common use cases
- **CRM:** Sample contacts and pipeline stages
- **Communication:** Pre-configured channel with welcome message

For {{PROJECT_NAME}}: Provide {{SAMPLE_DATA_DESCRIPTION}} so users immediately see the product in a "working" state.

---

## Time-to-Value Optimization

**Time-to-value (TTV)** is the elapsed time from signup to the user experiencing the product's core value. Shorter TTV = higher activation rate.

### Measuring TTV

```
TTV = Timestamp of aha moment action - Timestamp of account creation

Current median TTV: ______ minutes/hours/days
Target TTV: ______ minutes/hours/days
```

### TTV Reduction Strategies

| Strategy | Impact | Effort | Priority |
|----------|--------|--------|----------|
| Reduce signup fields (to name + email only) | High | Low | 1 |
| Add social login (Google, GitHub) | High | Medium | 2 |
| Pre-fill settings based on signup answers | Medium | Medium | 3 |
| Provide templates for first action | High | Medium | 4 |
| Skip email verification until later | Medium | Low | 5 |
| Add inline onboarding (tooltips vs separate tour) | Medium | Medium | 6 |
| Offer a sandbox/playground pre-signup | High | High | 7 |

---

## Activation Funnel Mapping

Map every step from first visit to activated user. Measure conversion at each step.

```
Visitor lands on site/store
        |
        v  (____% conversion)
Clicks "Sign Up" / "Get Started"
        |
        v  (____% conversion)
Completes signup form
        |
        v  (____% conversion)
Verifies email (if required)
        |
        v  (____% conversion)
Completes welcome survey / personalization
        |
        v  (____% conversion)
Performs FIRST ACTION ({{ACTIVATION_ACTION_1}})
        |
        v  (____% conversion)
Performs KEY ACTION ({{ACTIVATION_ACTION_2}})
        |
        v  (____% conversion)
Reaches AHA MOMENT
        |
        v  (____% conversion)
Returns for second session (Day 1-3)
        |
        v  (____% conversion)
Establishes habit (3+ sessions in first week)
```

**Benchmark:** Best-in-class products achieve 40-60% signup-to-activation. Most products are at 15-30%. Below 15% indicates a serious onboarding problem.

---

## Friction Audit

Walk through your signup and onboarding flow as a brand-new user. Document every point of friction.

### Friction Audit Template

| Step | Action Required | Friction Type | Severity | Fix |
|------|----------------|---------------|----------|-----|
| 1 | | Cognitive / Technical / Emotional | High/Med/Low | |
| 2 | | Cognitive / Technical / Emotional | High/Med/Low | |
| 3 | | Cognitive / Technical / Emotional | High/Med/Low | |

**Friction Types:**
- **Cognitive:** User has to think too hard, unclear what to do next
- **Technical:** Page load, errors, compatibility issues, confusing UI
- **Emotional:** Anxiety about commitment, privacy concerns, fear of making mistakes

**Rule of thumb:** Every unnecessary step in onboarding loses 20-50% of users. Ruthlessly remove steps that do not directly contribute to activation.

---

## Onboarding Patterns

Choose the patterns that best fit your product and user expectations.

### Checklist Pattern
Best for: Products with multiple setup steps. Users see a visible list of 4-7 items and check them off. Progress bar drives completion.

```
Setup Progress: ████████░░ 80% complete

[x] Create your account
[x] Set up your profile
[x] Connect your first integration
[x] Create your first {{ITEM}}
[ ] Invite a team member
```

### Tooltip / Spotlight Pattern
Best for: Products with complex UIs. Highlight specific UI elements with contextual explanations. Show one at a time, triggered by user action.

### Walkthrough / Product Tour Pattern
Best for: First-time users of complex products. Step-by-step guided tour of key features. Keep to 3-5 steps maximum.

### Coach Marks Pattern
Best for: Mobile apps. Subtle visual indicators (pulsing dots, badges) that draw attention to undiscovered features without interrupting flow.

### Video Guide Pattern
Best for: Products where seeing is better than reading. Short (30-90 second) contextual videos embedded at point of need.

### Interactive Tutorial Pattern
Best for: Technical products. Sandbox environment where users complete real tasks with guided instructions. Most effective but highest implementation cost.

---

## Personalized Activation Paths

Branch the onboarding experience based on user role, goal, or use case collected during signup.

### Signup Survey Design

Ask 1-3 questions during signup to personalize the experience:

```
Question 1: "What is your primary role?"
  → Developer / Designer / Marketer / Manager / Founder / Other

Question 2: "What do you want to accomplish first?"
  → [Goal A] / [Goal B] / [Goal C] / [Goal D]

Question 3: "How large is your team?"
  → Just me / 2-5 / 6-20 / 21-100 / 100+
```

### Persona-Based Activation Paths for {{PROJECT_NAME}}

| Persona | Goal | Activation Path | Aha Moment |
|---------|------|-----------------|------------|
| {{PERSONA_1}} | {{GOAL_1}} | {{PATH_1}} | {{AHA_1}} |
| {{PERSONA_2}} | {{GOAL_2}} | {{PATH_2}} | {{AHA_2}} |
| {{PERSONA_3}} | {{GOAL_3}} | {{PATH_3}} | {{AHA_3}} |

---

## Measuring Activation

### Key Metrics Dashboard

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Overall activation rate | ____% | ____% | Weekly cohort |
| Time-to-activate (median) | ____ | ____ | Event timestamp delta |
| Signup → first action | ____% | ____% | Funnel step |
| First action → aha moment | ____% | ____% | Funnel step |
| Activation → Day 7 retention | ____% | ____% | Cohort analysis |
| Activation by persona | ____% | ____% | Segmented cohort |
| Activation by channel | ____% | ____% | Segmented cohort |

### Activation by Cohort (Weekly)

```
Week of    | Signups | Activated | Rate   | Trend
-----------+---------+-----------+--------+------
{{WEEK_1}} |         |           |   %    |
{{WEEK_2}} |         |           |   %    |
{{WEEK_3}} |         |           |   %    |
{{WEEK_4}} |         |           |   %    |
```

---

## Product-Type-Specific Activation

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS Activation

**Critical path:** Signup → Connect data source / integration → See first result → Share with team

- Integration-first onboarding: connect to existing tools (Slack, Jira, Salesforce) to show value with existing data
- Workspace setup: guide through team/project structure
- First report or output: generate a visible result within the first session
- Team invitation: multi-user products activate better when colleagues join
- Trial-specific: show trial countdown and link value to paid features

**SaaS activation benchmarks:**
- Free trial to activation: 40-60%
- Freemium to activation: 20-40%
- Activation to paid conversion: 15-30% (trial), 3-8% (freemium)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile" -->
### Mobile App Activation

**Critical path:** Download → Open app → Complete core action → Enable notifications → Return Day 1

- Minimize permissions upfront: only ask for what is needed now (delay notifications prompt until value is shown)
- Deep link from install ads directly to relevant in-app content
- Leverage device capabilities: camera, contacts, location (with clear value explanation)
- App store screenshots should set expectations for the first-run experience
- Push notification opt-in: ask after first value moment, explain what they will receive

**Mobile activation benchmarks:**
- Install to open: 70-85%
- Open to activation: 20-40%
- Day 1 retention (post-activation): 40-60%
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace Activation

**Critical path (buyer):** Visit → Search/browse → Find relevant listing → Complete first transaction
**Critical path (seller):** Visit → Create listing → Get first view/inquiry → Complete first sale

- Two-sided activation: track supply-side and demand-side separately
- Buyer activation: show relevant inventory immediately, personalize based on stated need
- Seller activation: make listing creation as fast as possible (photo upload, AI-generated description)
- Trust signals: reviews, verification badges, guarantees — critical for first transaction
- Liquidity: ensure enough supply before investing in demand acquisition

**Marketplace activation benchmarks:**
- Visitor to first search: 50-70%
- Search to first transaction: 5-15%
- Seller listing to first sale: varies wildly by category
<!-- ENDIF -->

---

## Activation Flow Template for {{PROJECT_NAME}}

### Summary

```
Product: {{PROJECT_NAME}}
Target personas: {{PERSONAS}}
Core value proposition: {{VALUE_PROPOSITION}}
Aha moment hypothesis: {{AHA_MOMENT_HYPOTHESIS}}
Target activation rate: ____%
Target time-to-activate: ____
```

### Activation Funnel (Customize)

1. **Signup** (target: minimize to <60 seconds)
   - Fields: email + password (or social login)
   - Personalization question: role / goal

2. **Welcome** (target: set expectations in <30 seconds)
   - Personalized welcome based on survey answer
   - One clear CTA: "Let's {{FIRST_ACTION_VERB}}"

3. **First Action** (target: complete in <3 minutes)
   - Guided flow to {{ACTIVATION_ACTION_1}}
   - Pre-filled template or sample data if applicable
   - Inline help and contextual tooltips

4. **First Value** (target: experience within first session)
   - User sees the result of their first action
   - Celebration moment: "You just {{VALUE_STATEMENT}}!"
   - Prompt for next step

5. **Habit Trigger** (target: return within 24 hours)
   - Email or notification with result of first action
   - Reason to come back: new data, team activity, scheduled event

### Implementation Checklist

- [ ] Define activation criteria (3-5 key actions)
- [ ] Instrument all activation events in analytics
- [ ] Build activation funnel dashboard
- [ ] Design first-run experience flow
- [ ] Create empty states for all key screens
- [ ] Build or source sample data / templates
- [ ] Implement signup personalization survey
- [ ] Design persona-specific onboarding branches
- [ ] Set up activation rate monitoring (weekly cohort)
- [ ] Plan first activation experiment (A/B test)
- [ ] Conduct friction audit with 5 real users
- [ ] Establish activation rate baseline and targets

---

*This activation flow is part of the {{PROJECT_NAME}} marketing system. Review and update quarterly based on cohort data.*
