# User Onboarding Sequence for {{PROJECT_NAME}}

> Step-by-step onboarding plan with milestones, email sequences, and in-app guidance to take users from signup to engaged power user.

---

## Onboarding Philosophy

Three principles that guide every onboarding decision:

1. **Guide, don't lecture.** Users learn by doing, not by watching tours or reading documentation. Every onboarding step should involve the user taking an action, not passively consuming information.

2. **Show, don't tell.** Instead of explaining what a feature does, put the user in a situation where they experience it. A 10-second interaction beats a 60-second explanation every time.

3. **Celebrate progress.** Every completed step deserves acknowledgment. Celebration builds momentum, and momentum drives activation. Small wins compound into habit formation.

**The onboarding goal:** Get the user to {{AHA_MOMENT_ACTION}} within {{TARGET_TIMEFRAME}} of signup.

---

## Day 0: Signup Experience

The signup moment sets the tone for the entire user relationship. Every second of friction here costs you users.

### Signup Form Design

**Minimum viable signup:**
```
[Email address          ]
[Password               ]
[Sign Up]

--- or ---

[Continue with Google]
[Continue with GitHub]
[Continue with SSO]
```

**Rules for signup forms:**
- Maximum 2-3 fields (email + password, or just email with magic link)
- Offer social login for consumer products (Google, Apple)
- Offer SSO/SAML for enterprise products
- Never require: phone number, company name, address (at signup)
- Delay email verification until after first value (allow immediate access)
- Show password requirements inline as user types (not after submit failure)

### Welcome Screen (Personalization)

Immediately after signup, present 1-3 quick questions to personalize the onboarding path.

```
Welcome to {{PROJECT_NAME}}!

Let's personalize your experience.

1. What best describes your role?
   [ ] {{ROLE_OPTION_1}}
   [ ] {{ROLE_OPTION_2}}
   [ ] {{ROLE_OPTION_3}}
   [ ] {{ROLE_OPTION_4}}
   [ ] Other

2. What do you want to accomplish first?
   [ ] {{GOAL_OPTION_1}}
   [ ] {{GOAL_OPTION_2}}
   [ ] {{GOAL_OPTION_3}}

3. How large is your team?
   [ ] Just me
   [ ] 2-10 people
   [ ] 11-50 people
   [ ] 50+ people

[Get Started ->]              [Skip for now]
```

**Design notes:**
- Make skip clearly available (never trap users in a survey)
- Use visual options (icons + text) for faster selection
- Store answers for personalization and segmentation
- Total time: under 30 seconds

### First-Action Prompt

After the welcome screen, present one single, clear call to action.

```
Great! Let's get you started.

[Icon/Illustration]

{{FIRST_ACTION_PROMPT}}

[{{FIRST_ACTION_CTA_BUTTON}}]
```

**Examples by product type:**
- Project tool: "Create your first project"
- Analytics: "Connect your data source"
- Design: "Start from a template"
- Communication: "Invite your first teammate"
- CRM: "Add your first contact"

For {{PROJECT_NAME}}: "{{FIRST_ACTION_PROMPT}}"

---

## Day 1: First Value

The goal for Day 1 is simple: the user completes one meaningful task and sees a result they care about.

### Guided Workflow

Walk the user through completing {{ACTIVATION_ACTION_1}} with inline guidance.

**Step-by-step flow:**
```
Step 1 of {{TOTAL_STEPS}}: {{STEP_1_TITLE}}
[Clear instruction for what to do]
[Interactive element — the user does the thing]
[Inline validation — "Great, that worked!"]

Step 2 of {{TOTAL_STEPS}}: {{STEP_2_TITLE}}
[Clear instruction]
[Interactive element]
[Inline validation]

... continue through all steps ...
```

**Guidelines:**
- Keep to 3-5 steps maximum for first workflow
- Each step should take under 60 seconds
- Provide contextual help (? icon) but do not force it
- Allow going back to previous steps
- Save progress so users can resume if they leave

### Checklist Pattern

Display a visible onboarding checklist that persists across sessions.

```
Your {{PROJECT_NAME}} Setup    ████████░░░░ 4/7 complete

[x] Create your account
[x] Set up your profile
[x] {{CHECKLIST_ITEM_3}}
[x] {{CHECKLIST_ITEM_4}}
[ ] {{CHECKLIST_ITEM_5}}
[ ] {{CHECKLIST_ITEM_6}}
[ ] {{CHECKLIST_ITEM_7}}

Estimated time remaining: 5 minutes
```

**Checklist best practices:**
- Pre-check items that are already done (account creation) for momentum
- Keep to 5-8 items (more feels overwhelming)
- Show estimated time for remaining items
- Make each item clickable to navigate to that action
- Persist the checklist in a sidebar or banner until complete
- Offer a reward for 100% completion (badge, extended trial, premium feature unlock)

### Celebration Moments

When the user completes a key milestone, celebrate visibly.

**Celebration tiers:**
- **Small win** (completed a step): Checkmark animation, brief "Nice!" message
- **Medium win** (completed first workflow): Success screen with summary of what they accomplished
- **Big win** (reached aha moment): Confetti animation, personalized success message, prompt for next level

```
--- CELEBRATION SCREEN ---

[Confetti animation]

You just {{VALUE_STATEMENT}}!

Here is what you accomplished:
- {{ACCOMPLISHMENT_1}}
- {{ACCOMPLISHMENT_2}}
- {{ACCOMPLISHMENT_3}}

Ready for more? Here is what to try next:
[Next Action CTA]
```

---

## Day 2-3: Feature Discovery

Users who activated on Day 1 are now ready to explore beyond the core feature.

### Feature Highlight Strategy

Pick 2-3 features that align with the user's stated goal (from the welcome survey).

| User Goal | Feature to Highlight | Why | How |
|-----------|---------------------|-----|-----|
| {{GOAL_OPTION_1}} | {{FEATURE_A}} | Directly supports goal | Tooltip on first visit to relevant screen |
| {{GOAL_OPTION_2}} | {{FEATURE_B}} | Extends core value | In-app notification after first action |
| {{GOAL_OPTION_3}} | {{FEATURE_C}} | Deepens engagement | Email highlight with use case example |

### Tooltip / Spotlight Implementation

```
[Spotlight overlay dims the rest of the UI]

         ┌──────────────────────────────────┐
         │  Did you know?                    │
         │                                   │
         │  {{FEATURE_NAME}} lets you        │
         │  {{BENEFIT_DESCRIPTION}}.         │
         │                                   │
         │  [Try it now]     [Maybe later]   │
         └──────────────────────────────────┘
                     ▼
         [Highlighted UI element]
```

**Rules:**
- Maximum 1 tooltip per session (do not overwhelm)
- Only show after the user has completed at least one core action
- Always offer "dismiss" / "maybe later" option
- Track which tips have been shown and do not repeat
- Trigger based on user behavior, not arbitrary timing

### Day 2-3 Email: Feature Discovery

```
Subject: Here is something you might not have tried yet
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

Great start with {{PROJECT_NAME}}! You have already {{ACCOMPLISHMENT_SUMMARY}}.

One feature I think you will love: {{FEATURE_NAME}}

{{FEATURE_DESCRIPTION_2_SENTENCES}}

[Screenshot or GIF of feature in action]

Here is how to try it:
1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}

[Try {{FEATURE_NAME}} ->]

— {{SENDER_NAME}}
```

---

## Day 4-7: Habit Formation

The critical window for turning one-time users into regular users.

### Trigger Strategies

| Trigger Type | Implementation | Example |
|-------------|---------------|---------|
| Time-based | Scheduled email or push notification | "Your weekly summary is ready" |
| Event-based | Notification when something happens | "{{TEAMMATE}} commented on your {{ITEM}}" |
| Content-based | New relevant content available | "New template added: {{TEMPLATE_NAME}}" |
| Progress-based | Show results from their actions | "Your {{METRIC}} improved 15% this week" |
| Social-based | Activity from team or network | "3 team members joined this week" |

### Show Progress and Results

Users need to see that their early actions produced value.

```
Your first week with {{PROJECT_NAME}}:

[Progress visualization]

- {{METRIC_1}}: {{VALUE_1}} ({{TREND_1}})
- {{METRIC_2}}: {{VALUE_2}} ({{TREND_2}})
- {{METRIC_3}}: {{VALUE_3}} ({{TREND_3}})

Keep it up! Here is your next milestone:
{{NEXT_MILESTONE_DESCRIPTION}}
[Continue ->]
```

### Team and Social Features

For multi-user products, team adoption is the strongest retention lever.

```
Day 4-5 prompt:
"{{PROJECT_NAME}} is better with your team."

Invite teammates to collaborate:
[Email addresses field]
[Send invites]

Or share this link: {{INVITE_LINK}}
```

**Team invitation timing:** Day 4-5 is optimal. The user has enough experience to explain the product to teammates but is still in the "excited new user" window.

---

## Day 8-14: Deepening Engagement

Users who make it to week 2 are showing strong signals. Now introduce advanced capabilities.

### Advanced Feature Introduction

```
Week 2 Unlock: Advanced Features

You have mastered the basics. Here are power features to take
{{PROJECT_NAME}} to the next level:

1. {{ADVANCED_FEATURE_1}}
   {{DESCRIPTION}} — {{USE_CASE}}
   [Learn more]

2. {{ADVANCED_FEATURE_2}}
   {{DESCRIPTION}} — {{USE_CASE}}
   [Learn more]

3. {{ADVANCED_FEATURE_3}}
   {{DESCRIPTION}} — {{USE_CASE}}
   [Learn more]
```

### Personalized Recommendations

Based on the user's actual usage in weeks 1-2, recommend features and workflows they have not tried.

```
Based on how you use {{PROJECT_NAME}}, you might like:

[Recommendation 1] — "Users like you find this saves 2 hours/week"
[Recommendation 2] — "This pairs well with {{FEATURE_THEY_USE}}"
[Recommendation 3] — "Unlock this with {{ACTION}}"
```

### Community Invitation

```
Day 10-12 prompt:

Join the {{PROJECT_NAME}} community!

Connect with {{COMMUNITY_SIZE}} other users:
- Get tips and best practices
- Share your use cases
- Vote on upcoming features
- Get help from power users

[Join the community ->]

Platform: {{COMMUNITY_PLATFORM}} (Slack / Discord / Forum)
```

---

## Milestone System

Milestones give users a sense of progression and accomplishment.

### Milestone Framework for {{PROJECT_NAME}}

| Milestone | Criteria | Reward | Badge |
|-----------|----------|--------|-------|
| Getting Started | Complete signup + profile | Welcome message | Newcomer |
| First Win | Complete {{ACTIVATION_ACTION_1}} | Celebration screen | Starter |
| Explorer | Try 3 different features | Feature tip unlock | Explorer |
| Power User | {{POWER_USER_CRITERIA}} | Advanced feature access | Power User |
| Collaborator | Invite first teammate | Team feature unlock | Team Player |
| Champion | Reach {{CHAMPION_CRITERIA}} | Public recognition | Champion |
| Expert | {{EXPERT_CRITERIA}} | Beta access, influence roadmap | Expert |

### Progress Bar Implementation

```
Your {{PROJECT_NAME}} Journey

[Newcomer] ──── [Starter] ──── [Explorer] ──── [Power User] ──── [Champion]
    ✓              ✓              ●
                                 You are here!

Next milestone: Power User
To get there: {{REQUIREMENT_DESCRIPTION}}
Progress: 2/4 actions complete
```

---

## Onboarding Email Sequence

Parallel to in-app onboarding, send a structured email sequence.

### Email Sequence Timeline

| Day | Email | Subject Line | Goal | CTA |
|-----|-------|-------------|------|-----|
| 0 | Welcome | Welcome to {{PROJECT_NAME}} — let's get started | Drive first login | Complete setup |
| 1 | First value | Quick tip: {{TIP_FOR_FIRST_VALUE}} | Drive first action | Try the tip |
| 3 | Feature spotlight | Did you know {{PROJECT_NAME}} can {{FEATURE}}? | Feature discovery | Try the feature |
| 5 | Social proof | How {{CUSTOMER_NAME}} uses {{PROJECT_NAME}} to {{OUTCOME}} | Build confidence | Read the story |
| 7 | Progress check | Your first week with {{PROJECT_NAME}} | Show progress | View dashboard |
| 10 | Advanced tip | Level up: {{ADVANCED_FEATURE}} | Deepen engagement | Try advanced feature |
| 14 | Milestone | You have been with us 2 weeks! Here is your journey | Celebrate and retain | Share feedback |

### Email Templates

**Day 0: Welcome Email**
```
Subject: Welcome to {{PROJECT_NAME}} — here is your first step
From: {{FOUNDER_NAME}}, Founder of {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

Welcome to {{PROJECT_NAME}}! I am {{FOUNDER_NAME}}, and I built this
because {{ORIGIN_STORY_ONE_SENTENCE}}.

Here is the one thing I recommend you do right now:

{{FIRST_ACTION_DESCRIPTION}}

It takes about {{TIME_ESTIMATE}} and you will immediately see
{{VALUE_DESCRIPTION}}.

[{{FIRST_ACTION_CTA}}]

If you have any questions, just reply to this email. I read every one.

— {{FOUNDER_NAME}}

P.S. Here is a 2-minute video walkthrough if you prefer:
[Watch the video]
```

**Day 1: First Value Email**
```
Subject: Quick win: {{QUICK_WIN_DESCRIPTION}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{FIRST_NAME}},

Here is something most new users love about {{PROJECT_NAME}}:

{{TIP_DESCRIPTION}}

To try it:
1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}

[Try it now ->]

Takes about 2 minutes. Totally worth it.

— {{SENDER_NAME}}
```

**Day 7: Progress Email**
```
Subject: Your first week with {{PROJECT_NAME}}
From: {{PROJECT_NAME}} Team

Hi {{FIRST_NAME}},

You have been using {{PROJECT_NAME}} for a week! Here is your recap:

- {{METRIC_1}}: {{VALUE_1}}
- {{METRIC_2}}: {{VALUE_2}}
- {{METRIC_3}}: {{VALUE_3}}

{{PERSONALIZED_INSIGHT}}

Next week, try: {{NEXT_WEEK_RECOMMENDATION}}

[Continue your journey ->]

— The {{PROJECT_NAME}} Team
```

---

## Measuring Onboarding Effectiveness

### Completion Metrics

| Metric | How to Measure | Target | Current |
|--------|---------------|--------|---------|
| Signup completion rate | Signups / signup page visitors | >60% | ____% |
| Welcome survey completion | Surveys completed / signups | >70% | ____% |
| Checklist step 1 completion | Step 1 done / signups | >80% | ____% |
| Checklist step 2 completion | Step 2 done / step 1 done | >70% | ____% |
| Checklist step 3 completion | Step 3 done / step 2 done | >65% | ____% |
| Full checklist completion | All steps done / signups | >40% | ____% |
| Activation rate | Activated / signups | >30% | ____% |
| Day 1 email open rate | Opens / delivered | >50% | ____% |
| Day 1 email click rate | Clicks / opens | >15% | ____% |

### Drop-Off Analysis

For each step in the onboarding flow, measure:
1. How many users reach this step
2. How many complete this step
3. Median time to complete
4. Where users who drop off go instead (if trackable)

```
Onboarding Funnel Drop-off Report — Week of {{DATE}}

Step                    | Reached | Completed | Rate  | Median Time | Drop-off Action
------------------------+---------+-----------+-------+-------------+----------------
Signup page             | 1000    |           |       |             |
Account created         |         |           |   %   |             |
Welcome survey          |         |           |   %   |             |
First action started    |         |           |   %   |             |
First action completed  |         |           |   %   |             |
Second action           |         |           |   %   |             |
Activated               |         |           |   %   |             |
```

### Onboarding Experiments

Run continuous A/B tests on onboarding to improve conversion at each step.

| Experiment | Hypothesis | Metric | Duration | Status |
|------------|-----------|--------|----------|--------|
| Shorter signup form | Fewer fields = higher completion | Signup rate | 2 weeks | |
| Video vs text walkthrough | Video = higher first action rate | Step 1 completion | 2 weeks | |
| Checklist vs no checklist | Checklist = higher activation | Activation rate | 3 weeks | |
| Personalized vs generic welcome | Personalized = higher engagement | Day 7 retention | 3 weeks | |

---

## Onboarding Milestones Template for {{PROJECT_NAME}}

```
Product: {{PROJECT_NAME}}
Target persona: {{PRIMARY_PERSONA}}
Aha moment: {{AHA_MOMENT_ACTION}}
Target activation timeframe: {{TARGET_TIMEFRAME}}

Day 0 Goals:
- Signup in under 60 seconds
- Complete personalization survey
- Start first guided workflow

Day 1 Goals:
- Complete first meaningful task: {{DAY_1_TASK}}
- See first result/output
- Receive Day 1 email and engage

Day 2-3 Goals:
- Discover {{FEATURE_FOR_DISCOVERY}}
- Complete second workflow
- Open Day 3 email

Day 4-7 Goals:
- Return for 3+ sessions
- Invite first teammate (if applicable)
- Complete onboarding checklist

Day 8-14 Goals:
- Try advanced feature: {{ADVANCED_FEATURE}}
- Join community
- Establish regular usage pattern ({{USAGE_PATTERN}})

Success Criteria:
- Activation rate: >____%
- Day 7 retention: >____%
- Day 14 retention: >____%
- Checklist completion: >____%
- Time-to-activate (median): <____
```

---

*This onboarding sequence is part of the {{PROJECT_NAME}} marketing system. Review monthly and optimize based on funnel data.*
