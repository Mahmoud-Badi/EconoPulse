# Free Trial Optimization for {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Trial Type:** {{TRIAL_TYPE}} <!-- opt-in (no CC) / opt-out (CC required) -->
> **Trial Length:** {{TRIAL_LENGTH}} days
> **Current Trial-to-Paid Rate:** {{CURRENT_TRIAL_CONVERSION}}%
> **Target Trial-to-Paid Rate:** {{TARGET_TRIAL_CONVERSION}}%

---

## Table of Contents

1. [Trial Length Selection](#1-trial-length-selection)
2. [Trial Type: Opt-In vs Opt-Out](#2-trial-type-opt-in-vs-opt-out)
3. [Activation Milestones](#3-activation-milestones)
4. [Trial Onboarding Sequence](#4-trial-onboarding-sequence)
5. [Trial Email Sequence](#5-trial-email-sequence)
6. [In-App Trial Experience](#6-in-app-trial-experience)
7. [Trial Extension Strategy](#7-trial-extension-strategy)
8. [Trial-to-Paid Conversion Optimization](#8-trial-to-paid-conversion-optimization)
9. [Post-Trial Follow-Up](#9-post-trial-follow-up)
10. [Trial Metrics](#10-trial-metrics)
11. [Common Trial Mistakes](#11-common-trial-mistakes)

---

## 1. Trial Length Selection

### 1.1 Trial Length Options

| Length | Pros | Cons | Best For |
|--------|------|------|----------|
| **7 days** | Creates urgency; forces quick evaluation; faster feedback loop | Not enough time for complex products; stressful for busy users | Simple tools, low learning curve, individual users, products with immediate value |
| **14 days** | Good balance of urgency and exploration time; most common default | May not be enough for enterprise or complex products | Most B2B SaaS, productivity tools, moderate complexity products |
| **30 days** | Ample time to evaluate; covers a full business cycle; less stressful | Lower urgency; users procrastinate; lower conversion rate due to forgetfulness | Complex products, enterprise software, products requiring team onboarding, products tied to monthly cycles (accounting, reporting) |
| **60-90 days** | Very thorough evaluation; covers quarterly business cycles | Very low urgency; high cost to serve; many users forget | Enterprise only; regulated industries; complex implementations |

### 1.2 Data-Driven Trial Length Decision

**Analyze your existing data (or competitor data if pre-launch) to determine optimal trial length:**

| Data Point | Your Value | Implication |
|-----------|-----------|-------------|
| Average time to aha moment | {{TIME_TO_AHA}} | Trial must be at least 2x this long |
| Average time to first "real" use (not just setup) | {{TIME_TO_REAL_USE}} | Trial should accommodate setup + meaningful use |
| Median days to conversion (current) | {{MEDIAN_CONVERSION_DAYS}} | Trial should extend slightly beyond this |
| % of conversions within 7 days | {{PCT_CONV_7D}}% | If > 60%, 7-day trial may work |
| % of conversions within 14 days | {{PCT_CONV_14D}}% | If > 80%, 14-day trial is sufficient |
| Product complexity (1-10) | {{COMPLEXITY_SCORE}} | Higher complexity = longer trial needed |
| Team involvement required | Yes / No | Team = longer trial (coordination time) |
| Integration setup required | Yes / No | Integrations = longer trial (technical setup) |

### 1.3 Trial Length Decision Framework

```
IF time_to_aha < 1 day AND complexity < 4:
    → 7-day trial

IF time_to_aha < 3 days AND complexity < 7:
    → 14-day trial (RECOMMENDED DEFAULT)

IF time_to_aha > 3 days OR complexity > 7 OR team_required:
    → 30-day trial

IF enterprise_only OR requires_implementation:
    → Custom (30-90 days with dedicated support)
```

**Selected trial length for {{PROJECT_NAME}}: {{SELECTED_TRIAL_LENGTH}} days**
**Rationale:** {{TRIAL_LENGTH_RATIONALE}}

---

## 2. Trial Type: Opt-In vs Opt-Out

### 2.1 Opt-In Trial (No Credit Card Required)

**How it works:** User signs up with email only. Full access for trial period. At trial end, they must actively enter payment information to continue.

| Metric | Typical Performance |
|--------|-------------------|
| Trial start rate (from pricing page) | 8-15% |
| Trial-to-paid conversion rate | 15-25% |
| Effective conversion (start rate × trial conversion) | 1.2-3.8% |
| User quality during trial | Mixed (includes casual browsers) |
| Support load during trial | Higher (more low-intent users) |

**Pros:**
- Highest number of trial starts (low barrier)
- Users feel no risk (no card = no accidental charges)
- Better for products that need to demonstrate value before asking for commitment
- More top-of-funnel data for marketing

**Cons:**
- Lower conversion rate (many unqualified signups)
- Higher cost to serve trial users who never intended to pay
- Users may sign up for multiple trials with different emails

**Best for:** Products where the aha moment takes time, when you need volume for network effects, early-stage products that need user feedback.

### 2.2 Opt-Out Trial (Credit Card Required)

**How it works:** User provides credit card at signup. Full access for trial period. At trial end, they are automatically charged unless they cancel.

| Metric | Typical Performance |
|--------|-------------------|
| Trial start rate (from pricing page) | 2-5% |
| Trial-to-paid conversion rate | 40-60% |
| Effective conversion (start rate × trial conversion) | 0.8-3.0% |
| User quality during trial | Higher (more intent to purchase) |
| Support load during trial | Lower (fewer, more serious users) |

**Pros:**
- Much higher conversion rate (inertia works in your favor)
- Users are more serious and engaged during trial
- Lower support costs per trial user
- More predictable revenue forecasting

**Cons:**
- Significantly fewer trial starts (credit card is a major friction point)
- Risk of negative reviews from users who forgot to cancel ("scammy")
- Higher chargeback and refund rates
- May not work in markets where credit cards are less common

**Best for:** Products with clear, immediate value; established brands with trust; B2B products where decision-makers are ready to evaluate seriously.

### 2.3 Hybrid Approaches

| Approach | How It Works | When to Use |
|----------|-------------|-------------|
| **Opt-in trial → Opt-out upsell** | Free trial without CC, then offer extended trial with CC | Get volume, then qualify intent |
| **Freemium + opt-out trial of premium** | Free tier always available; CC required to try premium features | Best of both worlds, but complex |
| **Reverse trial** | Start with full features (no CC), then downgrade to free tier | Users experience full value, then feel the loss |
| **Progressive trial** | No CC initially, require CC to unlock advanced trial features | Capture leads first, qualify later |

### 2.4 Selected Trial Type for {{PROJECT_NAME}}

**Trial type:** {{SELECTED_TRIAL_TYPE}}
**Rationale:** {{TRIAL_TYPE_RATIONALE}}

---

## 3. Activation Milestones

### 3.1 What Is Activation?

Activation is the set of actions a trial user must complete to fully experience your product's value. An "activated" trial user is significantly more likely to convert to paid than an unactivated one.

**Activation is NOT the same as signup.** Signup is creating an account. Activation is using the product in a meaningful way.

### 3.2 Define Activation Milestones for {{PROJECT_NAME}}

Define 3-5 specific, measurable actions that, when completed, indicate a user has truly experienced the value of {{PROJECT_NAME}}.

| Milestone # | Action | Why It Matters | Tracking Event |
|-------------|--------|---------------|----------------|
| 1 | {{MILESTONE_1}} | {{M1_WHY}} | `{{M1_EVENT}}` |
| 2 | {{MILESTONE_2}} | {{M2_WHY}} | `{{M2_EVENT}}` |
| 3 | {{MILESTONE_3}} | {{M3_WHY}} | `{{M3_EVENT}}` |
| 4 | {{MILESTONE_4}} | {{M4_WHY}} | `{{M4_EVENT}}` |
| 5 | {{MILESTONE_5}} | {{M5_WHY}} | `{{M5_EVENT}}` |

### 3.3 Activation Score

Create a composite activation score that predicts conversion likelihood:

```
Activation Score = (Milestone 1 completed × {{M1_WEIGHT}}) +
                   (Milestone 2 completed × {{M2_WEIGHT}}) +
                   (Milestone 3 completed × {{M3_WEIGHT}}) +
                   (Milestone 4 completed × {{M4_WEIGHT}}) +
                   (Milestone 5 completed × {{M5_WEIGHT}})

Maximum score: 100
```

| Activation Score | Conversion Likelihood | Action |
|-----------------|----------------------|--------|
| 0-20 | Very Low (< 5%) | Send re-engagement nudge; offer help |
| 21-40 | Low (5-15%) | Guide to next milestone; offer onboarding call |
| 41-60 | Medium (15-30%) | Highlight paid features they would benefit from |
| 61-80 | High (30-50%) | Show upgrade prompt; offer annual discount |
| 81-100 | Very High (50-70%) | Priority conversion target; personalized outreach |

### 3.4 Activation Benchmarks

| Metric | Benchmark | {{PROJECT_NAME}} Actual |
|--------|-----------|------------------------|
| % of trial users who complete milestone 1 | 60-80% | {{M1_COMPLETION}}% |
| % of trial users who complete milestone 2 | 40-60% | {{M2_COMPLETION}}% |
| % of trial users who complete milestone 3 | 25-45% | {{M3_COMPLETION}}% |
| % of trial users who complete all milestones | 15-30% | {{ALL_MILESTONES}}% |
| Conversion rate for fully activated users | 40-70% | {{ACTIVATED_CONVERSION}}% |
| Conversion rate for non-activated users | 2-10% | {{NON_ACTIVATED_CONVERSION}}% |

---

## 4. Trial Onboarding Sequence

### 4.1 Day-by-Day Engagement Plan

#### 7-Day Trial Plan

| Day | In-App Focus | Email (see Section 5) | Goal | Success Metric |
|-----|-------------|----------------------|------|---------------|
| **Day 0** | Welcome wizard → First milestone → Quick win | Welcome email | Complete Milestone 1 | Milestone 1 completion rate |
| **Day 1** | Guided feature discovery → Second milestone | Quick win email | Complete Milestone 2 | Milestone 2 completion rate |
| **Day 2** | Contextual tips → Third milestone | Feature deep-dive | Complete Milestone 3 | Milestone 3 completion rate |
| **Day 3** | Usage summary → Show what else is possible | Social proof email | Deepen engagement | Session duration, features explored |
| **Day 4** | Highlight premium value → Address potential objections | Objection handling email | Build purchase intent | Pricing page views |
| **Day 5** | Show ROI/value delivered → Soft urgency | Urgency email (2 days left) | Start purchase consideration | Checkout page views |
| **Day 6** | Countdown + clear CTA → Final push | Last chance email | Convert | Conversion rate |
| **Day 7 (Expiry)** | Trial ended message → Downgrade or pay | Trial expired email | Convert or retain as free | Conversion or free tier retention |

#### 14-Day Trial Plan

| Day | In-App Focus | Email | Goal |
|-----|-------------|-------|------|
| **Day 0** | Welcome wizard → First milestone | Welcome email | Complete Milestone 1 |
| **Day 1** | Guided feature discovery | Quick win email | Explore core features |
| **Day 2** | Second milestone guidance | No email | Complete Milestone 2 |
| **Day 3** | Contextual tips based on behavior | Feature spotlight email | Deepen engagement |
| **Day 5** | Third milestone guidance | Social proof email | Complete Milestone 3 |
| **Day 7** | Mid-trial check-in → Usage summary | "Your first week" summary email | Assess activation level |
| **Day 8** | Advanced feature introduction | Advanced feature email | Discover premium value |
| **Day 9** | Integration/team features | No email | Expand usage |
| **Day 10** | ROI calculator / Value delivered | ROI/value email | Build purchase intent |
| **Day 11** | Upgrade prompt with comparison | Urgency email (3 days left) | Start purchase consideration |
| **Day 12** | Countdown begins prominently | Countdown email (2 days left) | Urgency |
| **Day 13** | Final day messaging | Last chance email | Convert |
| **Day 14 (Expiry)** | Trial ended | Trial expired email | Convert or retain |

#### 30-Day Trial Plan

| Week | Focus Area | Emails | Goal |
|------|-----------|--------|------|
| **Week 1 (Days 0-7)** | Activation: Get user to aha moment | Welcome, Quick Win, Feature Spotlight | Complete all milestones |
| **Week 2 (Days 8-14)** | Depth: Advanced features, integrations, team | Social Proof, Advanced Feature, Mid-Trial Check-In | Deepen engagement and create switching costs |
| **Week 3 (Days 15-21)** | Value: ROI demonstration, case studies | ROI Email, Case Study, "Tips from Power Users" | Build purchase intent |
| **Week 4 (Days 22-30)** | Conversion: Urgency, upgrade prompts, final push | 7 Days Left, 3 Days Left, Last Chance, Expired | Convert to paid |

---

## 5. Trial Email Sequence

### Email 1: Welcome (Day 0 — Sent Immediately)

```
Subject: Your {{TRIAL_LENGTH}}-day trial of {{PROJECT_NAME}} starts now
From: {{SENDER_NAME}}, {{SENDER_TITLE}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Welcome to your free trial of {{PROJECT_NAME}} {{PAID_TIER}}!

You have {{TRIAL_LENGTH}} days of full access. Here's how to make the most of it:

**Your 3-step quickstart:**
1. {{QUICKSTART_STEP_1}} ({{STEP_1_TIME}}) [Link]
2. {{QUICKSTART_STEP_2}} ({{STEP_2_TIME}}) [Link]
3. {{QUICKSTART_STEP_3}} ({{STEP_3_TIME}}) [Link]

[Start Your First {{PRIMARY_ACTION}} →]

Need help getting set up? Reply to this email or book a 15-minute
onboarding call: [Book Call Link]

Your trial includes:
- {{TRIAL_FEATURE_1}}
- {{TRIAL_FEATURE_2}}
- {{TRIAL_FEATURE_3}}
- {{TRIAL_FEATURE_4}}

Let's make these {{TRIAL_LENGTH}} days count!

{{SENDER_NAME}}
{{SENDER_TITLE}}, {{PROJECT_NAME}}

P.S. {{PS_LINE}} <!-- e.g., "Over 5,000 teams started their trial this month." -->
```

### Email 2: Quick Win (Day 1)

```
Subject: Get your first win with {{PROJECT_NAME}} in under 5 minutes
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Day 1 of your trial — let's get you a quick win.

The fastest way to see value from {{PROJECT_NAME}} is to
{{QUICK_WIN_DESCRIPTION}}.

**Here's exactly how (takes {{QUICK_WIN_TIME}}):**

Step 1: {{QW_STEP_1}}
Step 2: {{QW_STEP_2}}
Step 3: {{QW_STEP_3}}

[{{QUICK_WIN_CTA}} →]

{{IF_COMPLETED_MILESTONE_1}}
Great news — we can see you've already {{MILESTONE_1_DESCRIPTION}}.
You're ahead of 70% of trial users! Next up: {{NEXT_MILESTONE}}.
{{ENDIF}}

{{SENDER_NAME}}
```

### Email 3: Feature Spotlight (Day 3)

```
Subject: {{FEATURE_NAME}}: the feature our users love most
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

I wanted to highlight {{FEATURE_NAME}} — it's the feature our
customers tell us they can't live without.

**What it does:**
{{FEATURE_DESCRIPTION}}

**Why it matters:**
{{FEATURE_BENEFIT_STATEMENT}}

**How {{CASE_STUDY_NAME}} uses it:**
"{{FEATURE_TESTIMONIAL}}"
— {{TESTIMONIAL_AUTHOR}}, {{TESTIMONIAL_TITLE}} at {{TESTIMONIAL_COMPANY}}

[Try {{FEATURE_NAME}} Now →]

Your trial: {{DAYS_REMAINING}} days remaining

{{SENDER_NAME}}
```

### Email 4: Social Proof (Day 5)

```
Subject: Why {{SOCIAL_PROOF_NUMBER}} teams chose {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

You're nearly a week into your trial. Here's what teams who
stuck with {{PROJECT_NAME}} have to say:

"{{TESTIMONIAL_1}}"
— {{AUTHOR_1}}, {{COMPANY_1}}

"{{TESTIMONIAL_2}}"
— {{AUTHOR_2}}, {{COMPANY_2}}

**By the numbers:**
- {{STAT_1}} <!-- e.g., "92% of trial users who complete onboarding become paying customers" -->
- {{STAT_2}} <!-- e.g., "Average time saved: 5 hours per week" -->
- {{STAT_3}} <!-- e.g., "4.8/5 average rating on G2" -->

[Continue Your Trial →]

{{DAYS_REMAINING}} days remaining in your trial.

{{SENDER_NAME}}
```

### Email 5: Urgency — Trial Ending Soon (Day {{TRIAL_LENGTH minus 2}})

```
Subject: Your {{PROJECT_NAME}} trial ends in 2 days
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Your free trial of {{PROJECT_NAME}} {{PAID_TIER}} ends in 2 days.

**Here's what you'll lose access to:**
- {{LOSING_FEATURE_1}}
- {{LOSING_FEATURE_2}}
- {{LOSING_FEATURE_3}}
- {{LOSING_FEATURE_4}}

**Here's what you've accomplished during your trial:**
- {{USER_ACCOMPLISHMENT_1}}
- {{USER_ACCOMPLISHMENT_2}}
- {{USER_ACCOMPLISHMENT_3}}

Don't lose your progress. Upgrade now and keep everything:

[Upgrade to {{PAID_TIER}} — ${{PRICE}}/mo →]

{{IF_SPECIAL_OFFER}}
**Special offer:** Upgrade before your trial ends and get
{{SPECIAL_OFFER_DESCRIPTION}}.
{{ENDIF}}

{{SENDER_NAME}}
```

### Email 6: Last Chance (Day {{TRIAL_LENGTH minus 1}})

```
Subject: Last day: Your {{PROJECT_NAME}} trial expires tomorrow
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

This is your last full day with {{PROJECT_NAME}} {{PAID_TIER}}.

Tomorrow, your account will {{EXPIRY_ACTION}} <!-- e.g., "be downgraded to the free plan" or "be deactivated" -->.

{{IF_ACTIVE_USER}}
You've been actively using {{PROJECT_NAME}} — don't let your
work and setup go to waste.
{{ENDIF}}

{{IF_INACTIVE_USER}}
We noticed you haven't had much time to explore. Would a trial
extension help? Reply to this email and I'll extend your trial
by {{EXTENSION_DAYS}} days.
{{ENDIF}}

[Upgrade Now →]  |  [Compare Plans]

Questions about pricing? Reply to this email — happy to help
find the right plan for you.

{{SENDER_NAME}}
```

### Email 7: Trial Expired (Day {{TRIAL_LENGTH}})

```
Subject: Your {{PROJECT_NAME}} trial has ended — but you can still upgrade
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Your free trial of {{PROJECT_NAME}} {{PAID_TIER}} has ended.

Your account has been {{EXPIRY_ACTION_PAST_TENSE}}.

**Your options:**

1. **Upgrade now** and restore full access immediately
   [Upgrade to {{PAID_TIER}} — ${{PRICE}}/mo →]

2. **Continue with the free plan** (with limited features)
   [Switch to Free Plan →]

3. **Need more time?** Reply to this email and tell me what's
   holding you back. I'm here to help.

{{IF_DATA_PRESERVED}}
Good news: All your data and settings are preserved. When you
upgrade, everything will be exactly as you left it.
{{ENDIF}}

{{SENDER_NAME}}
```

---

## 6. In-App Trial Experience

### 6.1 Trial Status Indicators

Show the user their trial status at all times without being intrusive.

**Persistent elements:**
- Trial days remaining badge in the top navigation or sidebar
- "Trial" or "Pro Trial" label next to the user's plan indicator
- Subtle countdown that becomes more prominent in the last 3 days

**Design progression:**

| Days Remaining | Indicator Style | Color | Urgency Level |
|---------------|----------------|-------|---------------|
| 7+ days | Small badge: "{{DAYS}} days left in trial" | Neutral (gray/blue) | Low |
| 4-6 days | Badge: "{{DAYS}} days left" | Amber/yellow | Medium |
| 2-3 days | Prominent banner: "Your trial ends in {{DAYS}} days" | Orange | High |
| 1 day | Banner + modal on login: "Last day of your trial" | Red/urgent | Very High |
| Expired | Full-screen overlay: "Your trial has ended" | Red | Critical |

### 6.2 Feature Discovery During Trial

Help trial users discover and use premium features they would lose at trial end.

**Feature tagging strategy:**
- Tag premium features with a subtle "Premium" or "{{PAID_TIER}}" badge throughout the UI
- When a user uses a premium feature for the first time, show a brief tooltip: "This is a {{PAID_TIER}} feature. You're trying it as part of your free trial."
- Track which premium features each trial user has used — this data is critical for personalized conversion messaging

**Premium feature usage tracking:**

| Premium Feature | % of Trial Users Who Try It | Correlation with Conversion |
|----------------|----------------------------|----------------------------|
| {{PREMIUM_FEATURE_1}} | {{PF1_USAGE}}% | {{PF1_CORRELATION}} |
| {{PREMIUM_FEATURE_2}} | {{PF2_USAGE}}% | {{PF2_CORRELATION}} |
| {{PREMIUM_FEATURE_3}} | {{PF3_USAGE}}% | {{PF3_CORRELATION}} |
| {{PREMIUM_FEATURE_4}} | {{PF4_USAGE}}% | {{PF4_CORRELATION}} |
| {{PREMIUM_FEATURE_5}} | {{PF5_USAGE}}% | {{PF5_CORRELATION}} |

### 6.3 Progress and Value Indicators

Show trial users the value they have received to build a case for upgrading.

**Value dashboard (visible in settings or account page):**
```
Your Trial Progress
─────────────────────────────
Trial day: {{CURRENT_DAY}} of {{TRIAL_LENGTH}}
[████████████░░░] {{PROGRESS_PCT}}%

What you've accomplished:
✓ {{ACCOMPLISHMENT_1}}
✓ {{ACCOMPLISHMENT_2}}
✓ {{ACCOMPLISHMENT_3}}
○ {{SUGGESTED_NEXT_ACTION}}

Premium features you've used:
✓ {{USED_PREMIUM_1}}
✓ {{USED_PREMIUM_2}}
○ Try: {{UNUSED_PREMIUM_1}} →

[Upgrade to Keep All This →]
```

### 6.4 Upgrade CTAs During Trial

| Location | CTA Style | When to Show |
|----------|-----------|-------------|
| Main navigation | "Upgrade" button (always visible) | Entire trial |
| After using premium feature | Inline tooltip: "Love this? Keep it with {{PAID_TIER}}" | After each premium feature use |
| Settings/billing page | Full plan comparison with current trial highlighted | Always |
| Dashboard/home | "{{DAYS}} days left — Upgrade to keep your progress" | Last 5 days |
| Feature pages | "Premium feature" badges with upgrade link | Entire trial |

---

## 7. Trial Extension Strategy

### 7.1 When to Offer Extensions

Not every trial user should get an extension. Target extensions strategically:

| Scenario | Offer Extension? | Extension Length | Rationale |
|----------|-----------------|-----------------|-----------|
| User activated but didn't convert | Yes | 7 days | They saw value but need more time to decide |
| User barely used the product | Maybe (with conditions) | 7-14 days | Only if they commit to a specific action |
| User hit a technical blocker | Yes | 7-14 days | Fix the issue and give them fair evaluation time |
| User is in an active purchase decision | Yes | 3-7 days | Don't lose the sale over timing |
| User has already been extended once | No | — | Diminishing returns; they are likely not going to convert |
| User never logged in after signup | No | — | Not interested; don't waste resources |

### 7.2 Extension Request Handling

**Proactive extension (you offer):**
```
Subject: Need more time? Your {{PROJECT_NAME}} trial extension

Hi {{USER_NAME}},

We noticed you've been actively using {{PROJECT_NAME}} but your
trial ends soon. We don't want you to feel rushed.

Here's a {{EXTENSION_DAYS}}-day extension — no strings attached.

[Activate Extension →]

Use this time to {{SUGGESTED_ACTION}}.

{{SENDER_NAME}}
```

**Reactive extension (user requests):**
- Grant immediately if user is active and engaged
- Ask for brief feedback if user has been inactive: "To make sure the extension is valuable, could you tell us what you'd like to explore?"
- Limit to one extension per user (maximum)
- Use the extension as an opportunity to offer a live demo or onboarding call

### 7.3 Conditional Extension (Engagement-Gated)

A powerful tactic: offer an extension contingent on the user completing a specific action.

```
"Want 7 more days? Complete these 2 steps and your trial
is automatically extended:

□ {{EXTENSION_CONDITION_1}} (e.g., "Invite a team member")
□ {{EXTENSION_CONDITION_2}} (e.g., "Connect an integration")

[Extend My Trial →]"
```

This drives activation while giving the user more time — a win-win.

---

## 8. Trial-to-Paid Conversion Optimization

### 8.1 Conversion Optimization Checklist

Systematically optimize each element of the trial-to-paid funnel:

**Onboarding (impacts activation → conversion):**
- [ ] Time to first value is under {{TARGET_TIME_TO_VALUE}}
- [ ] Welcome email sends within 5 minutes of signup
- [ ] In-app onboarding guides users to aha moment
- [ ] Setup steps are minimized (remove anything not essential for aha)
- [ ] Sample data or templates are available for immediate exploration
- [ ] Progress indicators show completion status

**Feature discovery (impacts engagement → conversion):**
- [ ] Premium features are visible and labeled (not hidden)
- [ ] Users are guided to try premium features during trial
- [ ] Feature usage is tracked and used to personalize messaging
- [ ] At least 3 premium features are used by trial users (on average)

**Urgency and timing (impacts decision → conversion):**
- [ ] Trial countdown is visible (non-intrusively) throughout the experience
- [ ] Email sequence aligns with trial timeline (urgency increases near end)
- [ ] Upgrade prompts become more prominent in last 3 days
- [ ] Special offer or discount available for same-day upgrade

**Checkout optimization (impacts intent → payment):**
- [ ] Upgrade flow requires fewer than 3 clicks from any page
- [ ] Multiple payment methods accepted (credit card, PayPal, etc.)
- [ ] Annual and monthly options shown with annual savings highlighted
- [ ] Pricing is transparent — no surprise fees at checkout
- [ ] Trust signals on checkout page (security badges, testimonials, guarantee)
- [ ] Checkout page loads in under 2 seconds

**Friction reduction:**
- [ ] No unnecessary form fields during upgrade
- [ ] No mandatory sales call for self-serve plans
- [ ] Card details pre-filled if opt-out trial (already have card)
- [ ] Clear money-back guarantee or cancellation policy displayed

### 8.2 Conversion Rate Optimization by Segment

| User Segment | Current Conv Rate | Target | Strategy |
|-------------|-------------------|--------|----------|
| **Fully activated** (all milestones) | {{CONV_ACTIVATED}}% | {{TARGET_ACTIVATED}}% | Direct upgrade prompt; emphasize what they'll lose |
| **Partially activated** (some milestones) | {{CONV_PARTIAL}}% | {{TARGET_PARTIAL}}% | Guide to remaining milestones; extend trial if needed |
| **Barely activated** (1 milestone or less) | {{CONV_BARELY}}% | {{TARGET_BARELY}}% | Re-engagement; offer onboarding call; address blockers |
| **Heavy feature users** | {{CONV_HEAVY}}% | {{TARGET_HEAVY}}% | Show value summary; personalized upgrade based on used features |
| **Team inviter** (invited others) | {{CONV_TEAM}}% | {{TARGET_TEAM}}% | Team plan offer; per-seat pricing; social proof from similar teams |
| **Enterprise signals** | {{CONV_ENTERPRISE}}% | {{TARGET_ENTERPRISE}}% | Sales outreach; custom demo; enterprise plan |

### 8.3 Objection Handling During Trial

Anticipate and address common objections before they prevent conversion.

| Objection | How to Address | Where |
|-----------|---------------|-------|
| "It's too expensive" | Show ROI calculator; compare to manual alternative cost; offer annual discount | Email, pricing page, checkout |
| "I need to get approval" | Provide ROI one-pager they can share; offer team trial; PDF case study | Email, in-app resource center |
| "I haven't had time to evaluate" | Offer trial extension; provide quickstart guide; offer live walkthrough | Email, in-app banner |
| "I'm not sure it does what I need" | Feature comparison vs competitors; offer custom demo; point to specific features | Email, in-app, support chat |
| "I found a free alternative" | Highlight your differentiators; show total cost of "free" (time, limitations) | Email, comparison page |
| "I need feature X first" | Add to roadmap and communicate timeline; offer workaround | Email, support conversation |
| "My team isn't ready" | Offer team onboarding call; provide training materials; extend trial for team | Email, sales outreach |

---

## 9. Post-Trial Follow-Up

### 9.1 For Users Who Did NOT Convert

Not all trial users convert immediately. Many need continued nurturing.

**Day 1 after expiry:**
```
Subject: Your data is safe — here's what's next
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Your trial ended yesterday, but don't worry — {{DATA_PRESERVATION_STATEMENT}}.

You have 3 options:

1. **Upgrade to {{PAID_TIER}}** — Restore full access immediately
   [Upgrade Now — ${{PRICE}}/mo →]

2. **Use the free plan** — Continue with {{FREE_PLAN_FEATURES}}
   Your account has been moved to the free plan automatically.

3. **Tell us what went wrong** — We'd love your honest feedback
   [Quick 2-minute survey →]

{{SENDER_NAME}}
```

**Day 7 after expiry (if no response):**
```
Subject: We'd love your feedback on {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

A week ago, your {{PROJECT_NAME}} trial ended. We want to learn
from your experience.

What was the main reason you didn't upgrade?

1 — Price too high
2 — Missing features I need
3 — Too complex / hard to use
4 — Found a different solution
5 — Not the right time
6 — Something else

[Reply with your number, or click here for a 1-minute survey →]

Your feedback directly shapes our product roadmap.

{{SENDER_NAME}}
```

**Day 30 after expiry:**
```
Subject: A lot has changed at {{PROJECT_NAME}} since your trial
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

It's been a month since your trial. We've been busy:

- New: {{NEW_FEATURE_1}}
- Improved: {{IMPROVEMENT_1}}
- Fixed: {{FIX_1}}

{{IF_MENTIONED_MISSING_FEATURE}}
Remember when you mentioned needing {{REQUESTED_FEATURE}}?
We've built it. [See it in action →]
{{ENDIF}}

Want to give {{PROJECT_NAME}} another try? Here's a special
{{WINBACK_OFFER}} for returning users:

[Restart Trial — {{WINBACK_TRIAL_LENGTH}} Days Free →]

{{SENDER_NAME}}
```

### 9.2 Win-Back Campaigns

| Timing | Offer | Channel | Expected Conv Rate |
|--------|-------|---------|-------------------|
| Day 7 post-trial | None (feedback request) | Email | 1-3% |
| Day 14 post-trial | {{DISCOUNT_PERCENT}}% off first {{DISCOUNT_PERIOD}} | Email | 3-5% |
| Day 30 post-trial | Extended re-trial ({{WINBACK_TRIAL_LENGTH}} days) | Email | 2-4% |
| Day 60 post-trial | New features announcement + re-trial | Email | 1-3% |
| Day 90 post-trial | Special promotion (annual deal, lifetime offer) | Email | 1-2% |
| Ongoing (6-12 months) | Product updates and re-engagement | Newsletter | 0.5-1% |

---

## 10. Trial Metrics

### 10.1 Core Trial Metrics Dashboard

| Metric | Definition | Benchmark | {{PROJECT_NAME}} Actual | Target |
|--------|-----------|-----------|------------------------|--------|
| **Trial start rate** | Trial starts / Pricing page visits | 5-15% | {{TRIAL_START_RATE}}% | {{TARGET_START_RATE}}% |
| **Trial activation rate** | Activated trials / Total trials started | 30-60% | {{TRIAL_ACTIVATION}}% | {{TARGET_ACTIVATION}}% |
| **Trial-to-paid rate** | Conversions / Trials started | 15-50% (varies by type) | {{TRIAL_TO_PAID}}% | {{TARGET_TRIAL_PAID}}% |
| **Time to activation** | Median days from trial start to activation | 1-3 days | {{TIME_TO_ACTIVATION}} days | {{TARGET_TTA}} days |
| **Time to conversion** | Median days from trial start to payment | 5-10 days (14-day trial) | {{TIME_TO_CONVERSION}} days | {{TARGET_TTC}} days |
| **Trial extension rate** | Extensions granted / Trials expiring | 5-15% | {{EXTENSION_RATE}}% | {{TARGET_EXTENSION}}% |
| **Extended trial conversion** | Conversions from extended trials / Extensions | 20-40% | {{EXTENDED_CONV}}% | {{TARGET_EXTENDED}}% |
| **Post-trial win-back rate** | Win-backs / Expired non-converted trials | 5-10% | {{WINBACK_RATE}}% | {{TARGET_WINBACK}}% |

### 10.2 Trial Cohort Analysis Template

Track conversion rates by signup cohort (week or month) to measure the impact of changes over time.

| Cohort | Trial Starts | Activated | Conv Day 7 | Conv Day 14 | Conv Day 30 | Final Conv Rate |
|--------|-------------|-----------|-----------|------------|------------|----------------|
| {{COHORT_1}} | {{C1_STARTS}} | {{C1_ACTIVATED}} | {{C1_D7}}% | {{C1_D14}}% | {{C1_D30}}% | {{C1_FINAL}}% |
| {{COHORT_2}} | {{C2_STARTS}} | {{C2_ACTIVATED}} | {{C2_D7}}% | {{C2_D14}}% | {{C2_D30}}% | {{C2_FINAL}}% |
| {{COHORT_3}} | {{C3_STARTS}} | {{C3_ACTIVATED}} | {{C3_D7}}% | {{C3_D14}}% | {{C3_D30}}% | {{C3_FINAL}}% |
| {{COHORT_4}} | {{C4_STARTS}} | {{C4_ACTIVATED}} | {{C4_D7}}% | {{C4_D14}}% | {{C4_D30}}% | {{C4_FINAL}}% |

### 10.3 Revenue Impact of Trial Optimization

```
Monthly trial starts:                     {{MONTHLY_TRIALS}}
Current conversion rate:                  {{CURRENT_CONV}}%
Current monthly conversions:              {{CURRENT_CONVERSIONS}}
Current MRR from trial conversions:       ${{CURRENT_TRIAL_MRR}}

Target conversion rate:                   {{TARGET_CONV}}%
Target monthly conversions:               {{TARGET_CONVERSIONS}}
Target MRR from trial conversions:        ${{TARGET_TRIAL_MRR}}

MRR improvement:                          ${{MRR_IMPROVEMENT}} (+{{MRR_PCT_IMPROVEMENT}}%)
Annual revenue impact:                    ${{ANNUAL_IMPACT}}
```

---

## 11. Common Trial Mistakes

### 11.1 Trial Design Mistakes

| Mistake | Why It Happens | Impact | Fix |
|---------|---------------|--------|-----|
| **Trial too short for product complexity** | Copying competitors without considering own product | Users can't reach aha moment; low conversion | Analyze time-to-activation data; extend trial |
| **Trial too long** | Fear of seeming restrictive | Users procrastinate; lose urgency; forget about product | Shorten trial; add engagement milestones |
| **No onboarding during trial** | Assume users will figure it out | Users don't activate; experience is confusing | Implement guided onboarding (Section 4) |
| **Opt-out trial without clear cancellation** | Maximizing conversion at expense of trust | Chargebacks, negative reviews, brand damage | Make cancellation easy and obvious; send reminders before charges |
| **Same trial for all segments** | One-size-fits-all approach | Enterprise needs more time; individuals need less | Segment trial length and experience by user type |
| **No tracking of trial behavior** | Engineering oversight | Cannot optimize what you do not measure | Instrument activation milestones and feature usage |

### 11.2 Conversion Mistakes

| Mistake | Why It Happens | Impact | Fix |
|---------|---------------|--------|-----|
| **Upgrade CTA only on pricing page** | Minimal effort implementation | Users never see upgrade option | Add contextual CTAs throughout the product (Section 6) |
| **No emails during trial** | Fear of annoying users | Users disengage; no relationship built | Implement the email sequence (Section 5) |
| **Too many emails during trial** | Over-eagerness to convert | Users unsubscribe; brand fatigue | 5-7 emails for a 14-day trial is the sweet spot |
| **Generic upgrade messaging** | Not personalizing based on behavior | Messages feel irrelevant; lower click rates | Use feature usage data to personalize upgrade prompts |
| **No urgency in final days** | Not wanting to seem "salesy" | Users let trial expire without deciding | Increase communication frequency and urgency in last 3 days |
| **No value summary** | Not tracking user accomplishments | Users don't realize how much value they received | Show "your trial in review" summary with concrete accomplishments |

### 11.3 Post-Trial Mistakes

| Mistake | Why It Happens | Impact | Fix |
|---------|---------------|--------|-----|
| **Deleting user data after trial** | Data storage costs; punitive approach | User loses everything; no reason to come back | Preserve data for at least 90 days; it's your best win-back tool |
| **No follow-up after expiry** | Considered "lost" immediately | Missing 10-20% of potential late conversions | Implement post-trial email sequence (Section 9) |
| **No feedback collection** | Not wanting to hear criticism | Cannot fix what you do not know is broken | Send feedback survey 7 days after expiry |
| **No win-back campaign** | Focus only on new trials | Ignoring warm audience that already knows your product | Run win-back campaigns at 14, 30, 60, 90 days |
| **No free tier fallback** | All-or-nothing approach | Users disappear completely after trial | Offer a free tier that maintains a relationship |

---

## Trial Optimization Action Plan

| Priority | Action | Expected Impact on Conversion | Effort | Timeline |
|----------|--------|------------------------------|--------|----------|
| 1 | {{ACTION_1}} | +{{IMPACT_1_PCT}}% | {{EFFORT_1}} | {{TIMELINE_1}} |
| 2 | {{ACTION_2}} | +{{IMPACT_2_PCT}}% | {{EFFORT_2}} | {{TIMELINE_2}} |
| 3 | {{ACTION_3}} | +{{IMPACT_3_PCT}}% | {{EFFORT_3}} | {{TIMELINE_3}} |
| 4 | {{ACTION_4}} | +{{IMPACT_4_PCT}}% | {{EFFORT_4}} | {{TIMELINE_4}} |
| 5 | {{ACTION_5}} | +{{IMPACT_5_PCT}}% | {{EFFORT_5}} | {{TIMELINE_5}} |

---

## Next Steps

1. [ ] Decide trial length and type (Sections 1 and 2)
2. [ ] Define and instrument activation milestones (Section 3)
3. [ ] Build the onboarding sequence (Section 4)
4. [ ] Create and schedule the email sequence (Section 5)
5. [ ] Implement in-app trial indicators and CTAs (Section 6)
6. [ ] Set up trial metrics tracking (Section 10)
7. [ ] Plan first optimization experiment
8. [ ] Review [Freemium Optimization](./freemium-optimization.md) if offering a free tier after trial

---

*Template from the Master Starter Kit — Pricing & Monetization section*
