# Freemium Conversion Optimization for {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Current Free Users:** {{CURRENT_FREE_USERS}}
> **Current Paying Customers:** {{CURRENT_PAYING_CUSTOMERS}}
> **Current Free-to-Paid Rate:** {{CURRENT_CONVERSION_RATE}}%
> **Target Free-to-Paid Rate:** {{TARGET_CONVERSION_RATE}}%

---

## Table of Contents

1. [Freemium Model Design](#1-freemium-model-design)
2. [Feature Gating Strategies](#2-feature-gating-strategies)
3. [The "Aha Moment"](#3-the-aha-moment)
4. [Free-to-Paid Conversion Benchmarks](#4-free-to-paid-conversion-benchmarks)
5. [Conversion Trigger Design](#5-conversion-trigger-design)
6. [Upgrade Prompt UX Patterns](#6-upgrade-prompt-ux-patterns)
7. [Anti-Patterns to Avoid](#7-anti-patterns-to-avoid)
8. [Onboarding Optimization for Freemium](#8-onboarding-optimization-for-freemium)
9. [Email Sequences for Free Users](#9-email-sequences-for-free-users)
10. [A/B Testing Framework](#10-ab-testing-framework)
11. [Metrics Dashboard](#11-metrics-dashboard)

---

## 1. Freemium Model Design

### 1.1 The Core Freemium Question

The fundamental question of freemium design is: **What should be free, and what should be paid?**

Get this wrong and you will either:
- Give away too much (no one upgrades — the product is good enough for free)
- Give away too little (no one signs up — the free tier does not demonstrate value)

### 1.2 The Freemium Design Spectrum

```
TOO RESTRICTIVE                                          TOO GENEROUS
|------|------|------|------|------|------|------|------|
Demo   Trial  Gated  Sweet  Ample  Most   Nearly  Everything
mode   only   free   spot   free   features free   free
                     (AIM
                     HERE)
```

**The sweet spot:** Free users get enough value to understand why the product is great and become dependent on it, but consistently encounter moments where they need more than the free tier provides.

### 1.3 Freemium Model Types

| Model | How It Works | Best For | Example |
|-------|-------------|----------|---------|
| **Feature-limited** | Core features free, advanced features paid | Products with clear basic/advanced split | Canva (free design tools, paid brand kit & premium assets) |
| **Usage-limited** | All features available, limited quantity | Products where value scales with usage | Mailchimp (free up to 500 contacts) |
| **Capacity-limited** | Limited storage, seats, or projects | Collaboration and storage products | Dropbox (2GB free, 2TB paid) |
| **Time-limited** | Full access for limited time, then reduced | Products needing immediate "wow" factor | Some SaaS tools (30-day full trial, then free tier) |
| **Audience-limited** | Free for individuals, paid for teams | Products with team/collaboration features | Slack (free for small teams with limited history) |
| **Quality-limited** | Free version has lower quality output | Creative and export-focused tools | Many video/image tools (free with watermark or lower resolution) |
| **Support-limited** | Community support only for free | Enterprise and technical products | Many dev tools (community vs. paid support) |

### 1.4 Free vs Paid Feature Allocation for {{PROJECT_NAME}}

**Principle: The free tier should include your product's core differentiator** — the thing that makes users say "this is amazing." If your unique value is behind the paywall, no one will experience why your product is better than alternatives.

| Category | Include in Free | Include in Paid | Rationale |
|----------|----------------|-----------------|-----------|
| **Core value prop** | {{FREE_CORE_FEATURES}} | Enhanced version of same | Free users must experience your core value |
| **Usage limits** | {{FREE_USAGE_LIMIT}} | {{PAID_USAGE_LIMIT}} | Users who need more are getting value and should pay |
| **Team features** | Solo use only | {{PAID_TEAM_FEATURES}} | Team adoption = organizational value = willing to pay |
| **Integrations** | {{FREE_INTEGRATIONS}} | {{PAID_INTEGRATIONS}} | Key integrations drive stickiness and upgrade need |
| **Analytics/Reporting** | Basic stats | {{PAID_ANALYTICS}} | Data-driven users are power users who will pay |
| **Customization** | Default settings | {{PAID_CUSTOMIZATION}} | Customization signals serious usage |
| **Export/API** | {{FREE_EXPORT}} | {{PAID_EXPORT}} | Programmatic access signals business use case |
| **Support** | Community / Docs | {{PAID_SUPPORT}} | Premium support for paying customers |
| **Branding** | {{PROJECT_NAME}} branding shown | Remove branding | Branding removal signals professional/business use |
| **Storage/History** | {{FREE_STORAGE}} | {{PAID_STORAGE}} | Storage-limited users have invested data = high switching cost |

---

## 2. Feature Gating Strategies

### 2.1 Usage Limit Gating

The most common and effective gating strategy. Allow users access to all (or most) features, but limit how much they can use.

**Design parameters:**

| Limit Type | Free Limit | Purpose | Upgrade Trigger |
|-----------|-----------|---------|----------------|
| **Records/items** | {{FREE_RECORD_LIMIT}} | Limits data scale | "You've used X of Y records. Upgrade for unlimited." |
| **Projects/workspaces** | {{FREE_PROJECT_LIMIT}} | Limits scope | "Create unlimited projects with {{PAID_TIER_NAME}}." |
| **Monthly actions** | {{FREE_ACTION_LIMIT}} | Limits activity | "You've used X of Y actions this month. Resets on {{DATE}} or upgrade now." |
| **API calls** | {{FREE_API_LIMIT}} | Limits programmatic use | "API rate limit exceeded. Upgrade for higher limits." |
| **Storage** | {{FREE_STORAGE_LIMIT}} | Limits data volume | "Storage full. Upgrade for {{PAID_STORAGE}}." |
| **Team members** | {{FREE_TEAM_LIMIT}} | Limits collaboration | "Invite more teammates with {{PAID_TIER_NAME}}." |

**How to set the right limit:**
1. Analyze your current user data — what is the usage distribution?
2. Set the free limit so that 60-80% of users stay within it comfortably
3. The remaining 20-40% should naturally hit the limit through legitimate active use
4. Users who hit the limit are your highest-propensity conversion targets
5. Never set limits so low that users cannot experience your core value

### 2.2 Feature Restriction Gating

Lock specific features behind the paywall. Most effective when the gated features serve a distinct user segment (power users, teams, businesses).

**Feature gating principles:**
- Gate features that **power users** need, not features that **all users** need
- Gate features that indicate **commercial/business use** (branding removal, team access, SSO)
- Never gate features that are needed to understand why your product is valuable
- Make gated features visible but locked — users should see what they are missing

**Visibility pattern for gated features:**
```
[Feature Name] [Lock icon] — Available on {{PAID_TIER_NAME}}
Brief description of what this feature does and why it is valuable.
[Upgrade to unlock →]
```

### 2.3 Time-Based Gating

| Variant | Description | Pros | Cons |
|---------|-------------|------|------|
| **Trial + Free tier** | Full access for X days, then reduced to free tier | Users experience full value | Complex to implement, confusion at transition |
| **Gradual reduction** | Features slowly lock over time | Gentle introduction to limits | Confusing, feels manipulative |
| **Feature unlocks** | New features available to paid users first, free users 30-60 days later | Creates urgency, rewards paid users | Free users may feel second-class |
| **Seasonal promotions** | Full access during special periods | Drives spikes in conversion | Can train users to wait for promotions |

### 2.4 Social/Network Gating

| Variant | Description | Example |
|---------|-------------|---------|
| **Invite-gated features** | Unlock features by inviting others | Dropbox: earn extra storage by inviting friends |
| **Team-gated features** | Features only available for 2+ users | Slack: most value in team communication |
| **Public vs private** | Free content is public, paid is private | GitHub (historically): free for public repos |

---

## 3. The "Aha Moment"

### 3.1 What Is the Aha Moment?

The "aha moment" is the specific point when a user first experiences the core value of your product. It is the moment they think: "Oh, THIS is why this product exists. This is genuinely useful."

Every successful freemium product has identified their aha moment and optimizes relentlessly to get free users there as fast as possible.

**Famous aha moments:**
- **Dropbox:** Saving a file in one device and seeing it appear on another
- **Slack:** A team sending 2,000 messages (team is hooked at this point)
- **Facebook:** Adding 7 friends in 10 days
- **Zoom:** Hosting your first video call and seeing the quality
- **Notion:** Creating your first connected workspace with multiple page types

### 3.2 Identifying the Aha Moment for {{PROJECT_NAME}}

**Step 1: Hypothesize potential aha moments**

List the actions or experiences that could be the aha moment for {{PROJECT_NAME}}:

1. {{AHA_HYPOTHESIS_1}} <!-- e.g., "User creates their first project and sees results" -->
2. {{AHA_HYPOTHESIS_2}} <!-- e.g., "User invites a team member and collaborates" -->
3. {{AHA_HYPOTHESIS_3}} <!-- e.g., "User connects an integration and sees data flow" -->
4. {{AHA_HYPOTHESIS_4}} <!-- e.g., "User generates their first report" -->
5. {{AHA_HYPOTHESIS_5}} <!-- e.g., "User saves 30 minutes on a task they used to do manually" -->

**Step 2: Validate with data**

For each hypothesis, analyze:
- Do users who complete this action have a significantly higher conversion rate?
- Do users who complete this action have a significantly higher retention rate?
- Is there a threshold (e.g., "3 projects" not just "1 project") that matters?

| Hypothesis | Conversion Rate (did action) | Conversion Rate (did not) | Lift | Statistically Significant? |
|-----------|-----------------------------|-----------------------------|------|---------------------------|
| {{AHA_HYPOTHESIS_1}} | {{AHA_1_CONV_YES}}% | {{AHA_1_CONV_NO}}% | {{AHA_1_LIFT}}x | Yes / No / Need more data |
| {{AHA_HYPOTHESIS_2}} | {{AHA_2_CONV_YES}}% | {{AHA_2_CONV_NO}}% | {{AHA_2_LIFT}}x | Yes / No / Need more data |
| {{AHA_HYPOTHESIS_3}} | {{AHA_3_CONV_YES}}% | {{AHA_3_CONV_NO}}% | {{AHA_3_LIFT}}x | Yes / No / Need more data |
| {{AHA_HYPOTHESIS_4}} | {{AHA_4_CONV_YES}}% | {{AHA_4_CONV_NO}}% | {{AHA_4_LIFT}}x | Yes / No / Need more data |
| {{AHA_HYPOTHESIS_5}} | {{AHA_5_CONV_YES}}% | {{AHA_5_CONV_NO}}% | {{AHA_5_LIFT}}x | Yes / No / Need more data |

**Step 3: Define the aha moment**

**{{PROJECT_NAME}}'s aha moment:** {{DEFINED_AHA_MOMENT}}

### 3.3 Optimizing for the Aha Moment

Once identified, your entire free user experience should be designed to get users to the aha moment as quickly as possible.

**Time-to-aha optimization:**
- Current median time to aha moment: {{CURRENT_TIME_TO_AHA}}
- Target time to aha moment: {{TARGET_TIME_TO_AHA}}

**Tactics to reduce time-to-aha:**
- [ ] Simplify onboarding to remove unnecessary steps before aha
- [ ] Pre-populate sample data so users can experience value immediately
- [ ] Use tooltips and guided tours to direct users toward aha actions
- [ ] Send email nudges if users have not reached aha within {{NUDGE_THRESHOLD}} days
- [ ] Reduce friction in the critical path (fewer clicks, simpler forms, smart defaults)
- [ ] Offer templates or quickstart options that shortcut to value
- [ ] Show progress indicators ("Complete these 3 steps to get started")

---

## 4. Free-to-Paid Conversion Benchmarks

### 4.1 Industry Benchmarks

| Industry / Product Type | Typical Free-to-Paid Rate | Top Performers |
|------------------------|--------------------------|----------------|
| **B2B SaaS (general)** | 3-5% | 7-10% |
| **B2B SaaS (bottom-up/PLG)** | 5-10% | 15-20% |
| **Consumer SaaS** | 2-4% | 5-8% |
| **Developer tools** | 1-3% | 5-8% |
| **Mobile apps (subscription)** | 1-3% | 5-10% |
| **Mobile apps (IAP)** | 1-5% | 5-15% |
| **Online games** | 1-5% | 5-10% |
| **Productivity tools** | 3-7% | 10-15% |
| **Collaboration tools** | 5-10% | 15-25% |
| **Design tools** | 2-5% | 8-12% |

### 4.2 Conversion Rate by Funnel Stage

| Stage | Benchmark | {{PROJECT_NAME}} Actual | Notes |
|-------|-----------|------------------------|-------|
| Visit → Signup | 2-10% | {{VISIT_TO_SIGNUP}}% | Depends on traffic quality |
| Signup → Activated | 20-50% | {{SIGNUP_TO_ACTIVATED}}% | Critical drop-off point |
| Activated → Engaged (weekly use) | 30-60% | {{ACTIVATED_TO_ENGAGED}}% | Retention indicator |
| Engaged → Hits limit / sees paid feature | 20-40% | {{ENGAGED_TO_LIMIT}}% | Natural upgrade point |
| Hits limit → Starts upgrade flow | 10-30% | {{LIMIT_TO_UPGRADE_START}}% | Upgrade UX quality |
| Starts upgrade → Completes purchase | 40-70% | {{UPGRADE_TO_PURCHASE}}% | Checkout optimization |
| **Overall: Signup → Paid** | **2-5%** | **{{OVERALL_CONVERSION}}%** | |

### 4.3 Time-to-Conversion Benchmarks

| Timeframe | % of Total Conversions | Implication |
|-----------|----------------------|-------------|
| Day 1 (same day) | 10-20% | Immediate power users, already know they need paid |
| Day 2-7 | 20-30% | Quick evaluators, fast aha moment achievers |
| Day 8-30 | 25-35% | Standard evaluation cycle, most conversions happen here |
| Day 31-90 | 10-20% | Slow adopters, may need nurturing |
| Day 91+ | 5-15% | Long-tail, often triggered by team growth or new project |

**{{PROJECT_NAME}} median time to conversion:** {{MEDIAN_TIME_TO_CONVERSION}} days

---

## 5. Conversion Trigger Design

### 5.1 Usage Threshold Triggers

These triggers fire when a user's behavior indicates they are ready for (or need) paid features.

| Trigger | Condition | Action | Priority |
|---------|-----------|--------|----------|
| **Usage limit approaching** | Used {{USAGE_THRESHOLD_PCT}}% of free limit | Show in-app banner: "You've used X of Y. Upgrade for unlimited." | High |
| **Usage limit hit** | Reached 100% of free limit | Show upgrade modal with value proposition and pricing | Critical |
| **Team invite attempt** | User tries to invite someone on free plan | Show team plan upgrade prompt | High |
| **Paid feature click** | User clicks a locked feature | Show feature-specific upgrade prompt with description | High |
| **Export/API attempt** | User tries to export or use API on free plan | Show professional-use upgrade prompt | Medium |
| **Consistent daily use** | User active 5+ days in last 7 | Show "You're a power user" upgrade prompt | Medium |
| **Data threshold** | User stores > {{DATA_THRESHOLD}} | Show storage upgrade prompt | Medium |
| **Milestone achievement** | User completes {{MILESTONE}} | Celebrate + show "Unlock more with paid" prompt | Medium |

### 5.2 Feature Discovery Triggers

These triggers expose users to paid features at the right moment.

| Trigger | Condition | Action |
|---------|-----------|--------|
| **Contextual feature suggestion** | User performs action that has a paid alternative | "Did you know? With {{PAID_TIER}}, you can also {{PAID_FEATURE_BENEFIT}}" |
| **Feature spotlight** | User has been active for 7+ days but hasn't explored paid features | In-app walkthrough showing top 3 paid features |
| **Social proof trigger** | User performs an action | "{{SOCIAL_PROOF_NUMBER}} teams use {{PAID_FEATURE}} to {{BENEFIT}}" |
| **Comparison trigger** | User views results/output | "Paid users get {{BETTER_OUTCOME}}. See the difference →" |

### 5.3 Social Proof Triggers

| Trigger | Message Template |
|---------|-----------------|
| **Usage-based social proof** | "{{NUM_PAID_USERS}} professionals have upgraded this month" |
| **Outcome-based social proof** | "Paid users report {{OUTCOME_STAT}} improvement in {{METRIC}}" |
| **Peer social proof** | "Teams like {{SIMILAR_COMPANY}} use {{PAID_TIER}} to {{BENEFIT}}" |
| **Review-based social proof** | "'{{TESTIMONIAL_QUOTE}}' — {{TESTIMONIAL_NAME}}, {{TESTIMONIAL_COMPANY}}" |

---

## 6. Upgrade Prompt UX Patterns

### 6.1 Where to Show Upgrade Prompts

| Location | When to Use | Effectiveness | Annoyance Risk |
|----------|------------|---------------|---------------|
| **In-line (next to locked feature)** | Always — show lock icon and brief CTA next to gated features | High | Low |
| **Modal dialog** | When user hits a hard limit or clicks a locked feature | Very high | Medium |
| **Banner (top of page)** | When approaching usage limits | Medium | Low-Medium |
| **Sidebar/panel** | During active sessions, non-intrusively | Medium | Low |
| **Settings page** | Always show plan comparison in settings/billing | Medium | Very Low |
| **Email** | After trigger events (usage limit, milestone) | Medium | Low |
| **Tooltip/popover** | On hover over locked features | Medium | Low |
| **Full-screen interstitial** | Only on hard limits or trial expiry | High | High |

### 6.2 Upgrade Prompt Design Principles

**DO:**
- Show the specific value the user would unlock ("Upgrade to get {{SPECIFIC_BENEFIT}}")
- Use the user's data to personalize ("You've created {{USER_PROJECTS}} projects. Unlock unlimited projects.")
- Offer a clear, single CTA button ("Upgrade to {{TIER_NAME}} — ${{PRICE}}/mo")
- Include a "Not now" or dismiss option (forced upgrades feel hostile)
- Show social proof near the CTA
- A/B test prompt copy, design, and timing

**DO NOT:**
- Show upgrade prompts before the user has experienced value (too early)
- Show more than one upgrade prompt at a time
- Block access to user's existing data (this feels like holding data hostage)
- Use guilt-trip copy ("Are you sure you don't want to upgrade?" with a sad face)
- Auto-open upgrade modals on every login
- Make the dismiss button hard to find

### 6.3 Upgrade Prompt Templates

**Template 1: Usage Limit Approaching**
```
[Banner - dismissible]
You've used {{CURRENT_USAGE}} of {{FREE_LIMIT}} {{USAGE_UNIT}} this month.
Upgrade to {{PAID_TIER}} for {{PAID_LIMIT}} {{USAGE_UNIT}}.
[Upgrade Now — ${{PRICE}}/mo]  [Dismiss]
```

**Template 2: Locked Feature Click**
```
[Modal]
[Icon of the feature]
{{FEATURE_NAME}} is available on {{PAID_TIER}}

{{FEATURE_DESCRIPTION_1_SENTENCE}}

{{SOCIAL_PROOF_STAT}} already use {{FEATURE_NAME}} to {{BENEFIT}}.

[Start Free Trial]  [See All Plans]  [Maybe Later]
```

**Template 3: Milestone Celebration**
```
[Modal - celebratory design]
Congratulations! You've {{MILESTONE_DESCRIPTION}}.

You're in the top {{PERCENTILE}}% of {{PROJECT_NAME}} users.
Power users like you get even more with {{PAID_TIER}}:
- {{PAID_BENEFIT_1}}
- {{PAID_BENEFIT_2}}
- {{PAID_BENEFIT_3}}

[Upgrade to {{PAID_TIER}}]  [Keep Using Free]
```

**Template 4: Team-Based Upgrade**
```
[Modal]
Want to bring your team to {{PROJECT_NAME}}?

{{PAID_TIER}} includes:
- Up to {{TEAM_LIMIT}} team members
- {{TEAM_FEATURE_1}}
- {{TEAM_FEATURE_2}}
- {{TEAM_FEATURE_3}}

Starting at ${{TEAM_PRICE}} per user/month.

[Start Team Trial]  [Learn More]  [Not Now]
```

---

## 7. Anti-Patterns to Avoid

### 7.1 Free Tier Design Anti-Patterns

| Anti-Pattern | Why It Fails | What to Do Instead |
|-------------|-------------|-------------------|
| **Free tier too generous** | Users have no reason to upgrade; 0.5% conversion rate | Audit feature usage — gate the features that power users rely on |
| **Free tier too restrictive** | Users cannot reach aha moment; they leave instead of upgrading | Ensure free users can complete their first successful workflow |
| **Free tier is a crippled product** | Users get a bad impression of your product quality | Free should feel complete for basic use, not broken |
| **Gating your core differentiator** | Users never experience why your product is special | Your unique value must be in the free tier |
| **Random feature gating** | No clear logic to what's free vs paid; confusing | Gate based on user segments (solo vs team, basic vs power user) |
| **No usage limits, only feature gates** | Power users get unlimited value for free | Combine feature gates with usage limits |

### 7.2 Conversion Flow Anti-Patterns

| Anti-Pattern | Why It Fails | What to Do Instead |
|-------------|-------------|-------------------|
| **Nag screens on every login** | Users develop "banner blindness" or become annoyed | Trigger-based prompts at relevant moments only |
| **Blocking access to user's own data** | Feels like ransom; causes outrage and churn | Always allow data export; gate new creation, not existing access |
| **Hidden pricing** | Users expect transparency; "Contact Sales" for a $29 plan is off-putting | Show prices for self-serve plans; reserve "Contact Us" for enterprise |
| **Long upgrade forms** | Friction kills conversion; every field you add loses 5-10% of upgraders | Minimize checkout steps; pre-fill what you can; accept one-click upgrade |
| **No trial of paid features** | Users are afraid to commit without trying | Offer 7-14 day free trial of the paid tier |
| **Aggressive countdown timers** | Creates pressure but damages trust | Use natural urgency (approaching limit) instead of artificial urgency |
| **Punishing free users** | Degrading experience over time to force upgrades | Maintain consistent free tier; improve paid tier instead |

### 7.3 Pricing Anti-Patterns

| Anti-Pattern | Why It Fails | What to Do Instead |
|-------------|-------------|-------------------|
| **Giant leap from free to paid** | $0 to $99/mo feels huge | Offer a low-priced entry tier ($9-19/mo) as a stepping stone |
| **Only annual billing** | High commitment for first-time upgraders | Offer monthly billing (even at a premium) to reduce commitment anxiety |
| **Per-seat only for solo tool** | Solo users feel they are paying for unused seats | Offer individual pricing; add per-seat for team plans |
| **Price anchored to free** | Anything above $0 feels expensive when free was the reference | Anchor against the value delivered or against alternatives |

---

## 8. Onboarding Optimization for Freemium

### 8.1 Onboarding Goals for Free Users

The onboarding experience for free users must achieve these goals in order:

1. **Get to aha moment** (top priority — within the first session if possible)
2. **Establish a habit** (bring user back at least 3 times in the first 7 days)
3. **Create switching costs** (user invests data, content, or workflows in your product)
4. **Expose paid features naturally** (not as a sales pitch, but as a "this exists" awareness)
5. **Set up conversion triggers** (ensure usage tracking is in place for limit-based triggers)

### 8.2 Day-by-Day Onboarding Plan

| Day | In-App Experience | Email | Goal |
|-----|------------------|-------|------|
| **Day 0 (Signup)** | Welcome screen → Guided setup → First success | Welcome email with quickstart guide | Reach aha moment |
| **Day 1** | Tooltip tour of 3 key features | "Quick tip" email with one valuable feature | Establish value |
| **Day 2** | Contextual suggestion based on Day 1 activity | No email (avoid fatigue) | Deepen engagement |
| **Day 3** | Progress indicator: "You've completed 2 of 5 steps" | "You're making progress" email with next step | Build momentum |
| **Day 5** | Introduce a paid feature contextually | "Did you know?" email about a paid feature | Awareness |
| **Day 7** | Show usage summary: "Here's what you've accomplished" | Weekly summary + "Upgrade for more" soft CTA | Create switching cost awareness |
| **Day 14** | If active: Celebrate milestone. If inactive: Re-engagement prompt | If active: Feature spotlight. If inactive: "We miss you" re-engagement | Retain or re-engage |
| **Day 21** | Show upgrade prompt based on usage patterns | Case study email: "How {{COMPANY}} uses {{PAID_TIER}}" | Social proof |
| **Day 30** | Monthly usage report with comparison to paid users | "Your month in review" + what paid users get extra | Conversion push |

### 8.3 Onboarding Checklist for Free Users

Present this as an in-app checklist that guides users through initial setup:

- [ ] **Step 1:** {{ONBOARDING_STEP_1}} — {{STEP_1_DESCRIPTION}} (estimated time: {{STEP_1_TIME}})
- [ ] **Step 2:** {{ONBOARDING_STEP_2}} — {{STEP_2_DESCRIPTION}} (estimated time: {{STEP_2_TIME}})
- [ ] **Step 3:** {{ONBOARDING_STEP_3}} — {{STEP_3_DESCRIPTION}} (estimated time: {{STEP_3_TIME}})
- [ ] **Step 4:** {{ONBOARDING_STEP_4}} — {{STEP_4_DESCRIPTION}} (estimated time: {{STEP_4_TIME}})
- [ ] **Step 5:** {{ONBOARDING_STEP_5}} — {{STEP_5_DESCRIPTION}} (estimated time: {{STEP_5_TIME}})

**Completion incentive:** "Complete all steps and unlock {{COMPLETION_REWARD}}" (e.g., bonus credits, extended limits, premium feature trial)

---

## 9. Email Sequences for Free Users

### 9.1 Welcome Sequence (Days 0-7)

**Email 1: Welcome (Sent immediately)**
```
Subject: Welcome to {{PROJECT_NAME}} — here's how to get started
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Welcome to {{PROJECT_NAME}}! You're joining {{TOTAL_USERS}} others who
use {{PROJECT_NAME}} to {{PRIMARY_BENEFIT}}.

Here's how to get the most value in your first 5 minutes:

1. {{QUICKSTART_STEP_1}} [Link]
2. {{QUICKSTART_STEP_2}} [Link]
3. {{QUICKSTART_STEP_3}} [Link]

[Get Started →]

Need help? Reply to this email — I read every message.

{{SENDER_NAME}}
{{SENDER_TITLE}}, {{PROJECT_NAME}}
```

**Email 2: Quick Win (Day 1)**
```
Subject: The fastest way to {{QUICK_WIN_OUTCOME}} with {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Most new users are amazed when they discover they can {{QUICK_WIN_DESCRIPTION}}
in just {{QUICK_WIN_TIME}}.

Here's how:
{{QUICK_WIN_INSTRUCTIONS}}

[Try it now →]

{{SENDER_NAME}}
```

**Email 3: Feature Highlight (Day 3)**
```
Subject: Did you know {{PROJECT_NAME}} can {{FEATURE_BENEFIT}}?
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

One of our most popular features is {{FEATURE_NAME}}.

{{FEATURE_DESCRIPTION}}

Here's a 2-minute guide to getting started:
{{FEATURE_GUIDE_LINK}}

[Try {{FEATURE_NAME}} →]

{{SENDER_NAME}}
```

**Email 4: Social Proof (Day 5)**
```
Subject: How {{CASE_STUDY_COMPANY}} uses {{PROJECT_NAME}} to {{RESULT}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

{{CASE_STUDY_COMPANY}} switched to {{PROJECT_NAME}} and saw:
- {{RESULT_1}}
- {{RESULT_2}}
- {{RESULT_3}}

"{{TESTIMONIAL_QUOTE}}" — {{TESTIMONIAL_NAME}}, {{TESTIMONIAL_TITLE}}

[Read the full story →]

{{SENDER_NAME}}
```

### 9.2 Nurture Sequence (Days 8-30)

**Email 5: Usage Summary (Day 7)**
```
Subject: Your first week with {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Here's what you accomplished in your first week:
- {{USAGE_STAT_1}}
- {{USAGE_STAT_2}}
- {{USAGE_STAT_3}}

{{IF_ACTIVE: "You're off to a great start! Here's what power users do next:"}}
{{IF_INACTIVE: "We noticed you haven't had a chance to try {{KEY_FEATURE}} yet. Here's a quick guide:"}}

[Continue your journey →]

{{SENDER_NAME}}
```

**Email 6: Paid Feature Spotlight (Day 14)**
```
Subject: Unlock {{PAID_FEATURE}} — available on {{PAID_TIER}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

You've been using {{PROJECT_NAME}} for 2 weeks now. Nice!

I wanted to let you know about {{PAID_FEATURE_NAME}}, available on
our {{PAID_TIER}} plan:

{{PAID_FEATURE_DESCRIPTION}}

{{SOCIAL_PROOF_STAT}} use this feature to {{BENEFIT}}.

Want to try it? Start a free {{TRIAL_LENGTH}}-day trial of {{PAID_TIER}}:

[Start Free Trial →]

No credit card required. Cancel anytime.

{{SENDER_NAME}}
```

**Email 7: Value Reinforcement (Day 21)**
```
Subject: You've saved {{TIME_SAVED}} using {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

Based on your usage, we estimate you've saved approximately
{{TIME_SAVED}} by using {{PROJECT_NAME}} instead of {{MANUAL_ALTERNATIVE}}.

With {{PAID_TIER}}, our users save even more:
- {{PAID_BENEFIT_1}} (saves {{TIME_1}} per week)
- {{PAID_BENEFIT_2}} (saves {{TIME_2}} per week)
- {{PAID_BENEFIT_3}} (saves {{TIME_3}} per week)

[See {{PAID_TIER}} plans →]

{{SENDER_NAME}}
```

### 9.3 Re-Engagement Sequence (For Inactive Free Users)

**Trigger:** User has not logged in for {{INACTIVE_THRESHOLD}} days

**Re-engagement Email 1 (Day {{INACTIVE_THRESHOLD}}+3)**
```
Subject: We haven't seen you in a while, {{USER_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

It's been a few days since you last used {{PROJECT_NAME}}.
Your {{USER_DATA_DESCRIPTION}} is still here, waiting for you.

Since your last visit, we've added:
- {{NEW_FEATURE_1}}
- {{NEW_FEATURE_2}}

[Log back in →]

If you're having trouble or need help, just reply to this email.

{{SENDER_NAME}}
```

**Re-engagement Email 2 (Day {{INACTIVE_THRESHOLD}}+10)**
```
Subject: Quick question about {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{USER_NAME}},

I noticed you signed up for {{PROJECT_NAME}} but haven't been
active recently. I'd love to understand why.

Could you reply with the number that best describes your situation?

1 — I got busy and forgot about it
2 — I couldn't figure out how to do what I needed
3 — It's missing a feature I need
4 — I found a different solution
5 — Something else

Your feedback helps us make {{PROJECT_NAME}} better for everyone.

{{SENDER_NAME}}
```

---

## 10. A/B Testing Framework

### 10.1 What to Test

Prioritize tests by expected impact on free-to-paid conversion:

| Test Area | Priority | What to Test | Expected Impact |
|-----------|----------|-------------|-----------------|
| **Free tier limits** | Critical | Different usage limits (e.g., 5 vs 10 vs 25 projects) | High — directly affects conversion triggers |
| **Upgrade prompt timing** | High | When prompts appear (50% of limit vs 80% vs 100%) | High — affects conversion and annoyance |
| **Upgrade prompt copy** | High | Different value propositions and CTAs | Medium-High — affects click-through rate |
| **Pricing page design** | High | Layout, plan order, "Most Popular" badge placement | Medium-High — affects plan selection |
| **Onboarding flow** | High | Steps to aha moment, checklist vs guided tour | Medium — affects activation rate |
| **Email sequence timing** | Medium | Send times, frequency, order of emails | Medium — affects engagement and conversion |
| **Feature gating boundary** | Medium | Which specific features are free vs paid | Medium — affects perceived value |
| **Social proof elements** | Medium | Different testimonials, stats, logos | Low-Medium — affects trust |
| **Checkout flow** | Medium | Number of steps, payment options, annual vs monthly default | Medium — affects purchase completion |
| **Trial length** | Medium | 7 vs 14 vs 30 day trial of paid features | Medium — affects trial conversion |

### 10.2 A/B Test Template

**Test Name:** {{TEST_NAME}}
**Hypothesis:** If we {{CHANGE}}, then {{METRIC}} will {{DIRECTION}} by {{EXPECTED_IMPROVEMENT}}% because {{REASONING}}.
**Primary metric:** {{PRIMARY_METRIC}} (e.g., free-to-paid conversion rate)
**Secondary metrics:** {{SECONDARY_METRICS}} (e.g., upgrade prompt click rate, churn rate)
**Guard-rail metrics:** {{GUARDRAIL_METRICS}} (e.g., free user retention, NPS — should not decrease)
**Sample size needed:** {{SAMPLE_SIZE}} per variant (use a sample size calculator)
**Expected duration:** {{TEST_DURATION}} days
**Variant A (control):** {{CONTROL_DESCRIPTION}}
**Variant B (treatment):** {{TREATMENT_DESCRIPTION}}

### 10.3 A/B Testing Best Practices for Freemium

- **Test one variable at a time** — changing multiple things makes it impossible to attribute results
- **Run tests for at least 2 full billing cycles** — conversion can have long lag times
- **Monitor guard-rail metrics** — a change that increases conversion but increases churn is net negative
- **Account for selection bias** — new users and existing users may respond differently
- **Document everything** — record all tests, results, and learnings for future reference
- **Start with high-traffic touchpoints** — test upgrade prompts before testing email subject lines (more data, faster results)

---

## 11. Metrics Dashboard

### 11.1 Primary Freemium Metrics

Track these metrics weekly:

| Metric | Definition | Current | Target | Status |
|--------|-----------|---------|--------|--------|
| **Free-to-paid conversion rate** | Paying customers / Total free signups (cohort-based) | {{CURRENT_F2P}}% | {{TARGET_F2P}}% | {{F2P_STATUS}} |
| **Activation rate** | Users who reach aha moment / Total signups | {{CURRENT_ACTIVATION}}% | {{TARGET_ACTIVATION}}% | {{ACTIVATION_STATUS}} |
| **Time to conversion** | Median days from signup to first payment | {{CURRENT_TTC}} days | {{TARGET_TTC}} days | {{TTC_STATUS}} |
| **Time to aha** | Median time from signup to aha moment | {{CURRENT_TTA}} | {{TARGET_TTA}} | {{TTA_STATUS}} |
| **Free user retention (Day 7)** | % of free users active 7 days after signup | {{CURRENT_D7}}% | {{TARGET_D7}}% | {{D7_STATUS}} |
| **Free user retention (Day 30)** | % of free users active 30 days after signup | {{CURRENT_D30}}% | {{TARGET_D30}}% | {{D30_STATUS}} |
| **Upgrade prompt CTR** | Clicks on upgrade prompts / Impressions | {{CURRENT_CTR}}% | {{TARGET_CTR}}% | {{CTR_STATUS}} |
| **Paid feature trial start rate** | Users who start paid trial / Users shown trial offer | {{CURRENT_TRIAL_START}}% | {{TARGET_TRIAL_START}}% | {{TRIAL_STATUS}} |
| **MRR from converted free users** | Monthly revenue from users who started as free | ${{CURRENT_FREE_MRR}} | ${{TARGET_FREE_MRR}} | {{FREE_MRR_STATUS}} |

### 11.2 Feature Adoption Metrics

Track which features free users engage with to understand what drives conversion:

| Feature | Free User Adoption | Paid User Adoption | Correlation with Conversion |
|---------|-------------------|--------------------|-----------------------------|
| {{FEATURE_1}} | {{F1_FREE_ADOPTION}}% | {{F1_PAID_ADOPTION}}% | {{F1_CORRELATION}} |
| {{FEATURE_2}} | {{F2_FREE_ADOPTION}}% | {{F2_PAID_ADOPTION}}% | {{F2_CORRELATION}} |
| {{FEATURE_3}} | {{F3_FREE_ADOPTION}}% | {{F3_PAID_ADOPTION}}% | {{F3_CORRELATION}} |
| {{FEATURE_4}} | {{F4_FREE_ADOPTION}}% | {{F4_PAID_ADOPTION}}% | {{F4_CORRELATION}} |
| {{FEATURE_5}} | {{F5_FREE_ADOPTION}}% | {{F5_PAID_ADOPTION}}% | {{F5_CORRELATION}} |

### 11.3 Conversion Funnel Visualization

```
Signups:                {{TOTAL_SIGNUPS}}   (100%)
  │
  ├─ Activated:         {{ACTIVATED}}       ({{ACTIVATED_PCT}}%)
  │   │
  │   ├─ Engaged (7d):  {{ENGAGED_7D}}     ({{ENGAGED_7D_PCT}}%)
  │   │   │
  │   │   ├─ Hit limit: {{HIT_LIMIT}}      ({{HIT_LIMIT_PCT}}%)
  │   │   │   │
  │   │   │   ├─ Saw upgrade prompt: {{SAW_PROMPT}} ({{SAW_PROMPT_PCT}}%)
  │   │   │   │   │
  │   │   │   │   ├─ Clicked upgrade: {{CLICKED}} ({{CLICKED_PCT}}%)
  │   │   │   │   │   │
  │   │   │   │   │   └─ Completed purchase: {{PURCHASED}} ({{PURCHASED_PCT}}%)
  │   │   │   │   │
  │   │   │   │   └─ Dismissed: {{DISMISSED}} ({{DISMISSED_PCT}}%)
  │   │   │   │
  │   │   │   └─ No prompt shown: {{NO_PROMPT}} ({{NO_PROMPT_PCT}}%)
  │   │   │
  │   │   └─ Did not hit limit: {{NO_LIMIT}} ({{NO_LIMIT_PCT}}%)
  │   │
  │   └─ Not engaged: {{NOT_ENGAGED}} ({{NOT_ENGAGED_PCT}}%)
  │
  └─ Not activated: {{NOT_ACTIVATED}} ({{NOT_ACTIVATED_PCT}}%)
```

**Biggest drop-off:** {{BIGGEST_DROPOFF_STAGE}}
**Priority optimization:** {{OPTIMIZATION_PRIORITY}}

---

## Freemium Optimization Action Plan

| Priority | Action | Expected Impact | Effort | Timeline |
|----------|--------|----------------|--------|----------|
| 1 | {{ACTION_1}} | {{IMPACT_1}} | {{EFFORT_1}} | {{TIMELINE_1}} |
| 2 | {{ACTION_2}} | {{IMPACT_2}} | {{EFFORT_2}} | {{TIMELINE_2}} |
| 3 | {{ACTION_3}} | {{IMPACT_3}} | {{EFFORT_3}} | {{TIMELINE_3}} |
| 4 | {{ACTION_4}} | {{IMPACT_4}} | {{EFFORT_4}} | {{TIMELINE_4}} |
| 5 | {{ACTION_5}} | {{IMPACT_5}} | {{EFFORT_5}} | {{TIMELINE_5}} |

---

## Next Steps

1. [ ] Define and validate the aha moment (Section 3)
2. [ ] Set free tier limits based on usage data (Section 2)
3. [ ] Implement upgrade prompts at key trigger points (Section 5 & 6)
4. [ ] Build the free-user email sequence (Section 9)
5. [ ] Set up metrics tracking and dashboards (Section 11)
6. [ ] Design and launch first A/B test on free tier limits or upgrade prompts (Section 10)
7. [ ] Review the [Trial Optimization](./trial-optimization.md) guide for paid feature trials

---

*Template from the Master Starter Kit — Pricing & Monetization section*
