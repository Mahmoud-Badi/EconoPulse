# Upsell & Cross-Sell Playbook for {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Current ARPA:** ${{CURRENT_ARPA}} / month
> **Current NRR:** {{CURRENT_NRR}}%
> **Target NRR:** {{TARGET_NRR}}%
> **Number of Paying Customers:** {{PAYING_CUSTOMERS}}

---

## Table of Contents

1. [Upsell vs Cross-Sell: Definitions and Strategy](#1-upsell-vs-cross-sell-definitions-and-strategy)
2. [Expansion Revenue Strategies](#2-expansion-revenue-strategies)
3. [Timing Upsell Offers](#3-timing-upsell-offers)
4. [Upsell Messaging Templates](#4-upsell-messaging-templates)
5. [Annual Billing Conversion](#5-annual-billing-conversion)
6. [Add-On Strategy](#6-add-on-strategy)
7. [Net Revenue Retention (NRR) Optimization](#7-net-revenue-retention-nrr-optimization)
8. [Customer Success-Driven Expansion](#8-customer-success-driven-expansion)
9. [Pricing Page Design for Upsells](#9-pricing-page-design-for-upsells)
10. [Anti-Patterns: What to Avoid](#10-anti-patterns-what-to-avoid)
11. [Metrics and Tracking](#11-metrics-and-tracking)

---

## 1. Upsell vs Cross-Sell: Definitions and Strategy

### 1.1 Definitions

**Upsell:** Encouraging a customer to purchase a higher-tier plan, more seats, or higher usage limits of the same product they already use. The customer is upgrading their existing purchase.

Examples:
- Basic plan → Pro plan (tier upgrade)
- 5 seats → 20 seats (seat expansion)
- 10,000 API calls → 50,000 API calls (usage upgrade)
- Monthly billing → Annual billing (commitment upgrade)

**Cross-sell:** Encouraging a customer to purchase a related but different product or add-on that complements their existing purchase. The customer is adding a new product.

Examples:
- Core platform + Analytics add-on
- Email marketing tool + SMS marketing tool
- Design tool + Stock photo subscription
- Project management tool + Time tracking add-on

### 1.2 When to Use Each

| Strategy | Best When | Expected Revenue Impact | Complexity |
|----------|-----------|------------------------|------------|
| **Tier upsell** | Customer is hitting limits or using features available in a higher tier | 50-200% ARPA increase | Low — already built into your pricing |
| **Seat expansion** | Customer's team is growing; more people need access | 20-100% ARPA increase per expansion | Low — automatic with per-seat pricing |
| **Usage upgrade** | Customer's consumption is growing organically | 10-50% ARPA increase | Low — automatic with usage-based pricing |
| **Annual conversion** | Customer has been on monthly for 3+ months (proven commitment) | 10-20% lower monthly rate but higher total commitment | Low — billing change only |
| **Feature add-on** | Customer needs specific functionality not in their plan | $10-100/mo additional | Medium — requires add-on development |
| **Cross-sell** | Customer has needs adjacent to your core product | Varies widely | High — requires additional products |

### 1.3 Expansion Revenue Priority Matrix

Prioritize expansion strategies based on ease and impact:

```
                        HIGH IMPACT
                           |
    Tier Upsells           |     Seat Expansion
    (for customers at      |     (for growing teams)
     plan limits)          |
                           |
    LOW EFFORT ____________|____________ HIGH EFFORT
                           |
    Annual Conversion      |     Cross-Sell /
    (for monthly users)    |     New Products
                           |
                        LOW IMPACT
```

**Priority for {{PROJECT_NAME}}:**
1. {{EXPANSION_PRIORITY_1}}
2. {{EXPANSION_PRIORITY_2}}
3. {{EXPANSION_PRIORITY_3}}
4. {{EXPANSION_PRIORITY_4}}

---

## 2. Expansion Revenue Strategies

### 2.1 Seat Expansion

**How it works:** As the customer's team grows, they add more users to their account, each costing an additional per-seat fee.

**Triggers for seat expansion:**
- New team member joins the customer's company
- Customer shares access credentials (sign of unmet seat demand)
- Customer's company posts job listings (team is growing)
- Customer admin views the "invite users" page

**Tactics:**
- Make inviting new users frictionless (one-click invite via email)
- Offer bulk seat discounts: "Add 5+ seats and save {{BULK_DISCOUNT}}% per seat"
- Auto-suggest invitations: "It looks like {{COLLEAGUE_NAME}} has been mentioned in your projects. Invite them?"
- Provide team admin tools that become more valuable with more seats
- Send quarterly "team growth check-in" emails to admins

**Revenue formula:**
```
Seat Expansion Revenue = New seats added × Per-seat price
Monthly Seat Expansion Rate = New seats this month / Total seats last month
```

### 2.2 Usage-Based Upgrades

**How it works:** As customers use more of your product (API calls, storage, records, etc.), they either hit a limit and must upgrade, or they automatically move to a higher usage tier.

**Triggers for usage upgrades:**
- Customer reaches 80% of their plan's usage limit
- Customer's usage has grown 50%+ month-over-month
- Customer receives an overage charge (opportunity to offer a higher plan with included usage)

**Tactics:**
- Send proactive notifications at 50%, 80%, and 100% of usage limits
- Offer a cost-effective upgrade: "Your overages this month cost ${{OVERAGE_COST}}. Upgrade to {{NEXT_TIER}} for ${{UPGRADE_COST}} and save ${{SAVINGS}}/month"
- Show a usage trends graph that projects when they will exceed limits
- Offer committed-use discounts: "Commit to {{USAGE_AMOUNT}} {{USAGE_UNIT}}/month and save {{COMMITTED_DISCOUNT}}%"

### 2.3 Feature Add-Ons

**How it works:** Offer individual features or feature bundles as paid additions to any plan, rather than requiring a full tier upgrade.

**Designing effective add-ons:**

| Add-On | Target Segment | Price | Justification |
|--------|---------------|-------|---------------|
| {{ADDON_1_NAME}} | {{ADDON_1_SEGMENT}} | ${{ADDON_1_PRICE}}/mo | {{ADDON_1_JUSTIFICATION}} |
| {{ADDON_2_NAME}} | {{ADDON_2_SEGMENT}} | ${{ADDON_2_PRICE}}/mo | {{ADDON_2_JUSTIFICATION}} |
| {{ADDON_3_NAME}} | {{ADDON_3_SEGMENT}} | ${{ADDON_3_PRICE}}/mo | {{ADDON_3_JUSTIFICATION}} |
| {{ADDON_4_NAME}} | {{ADDON_4_SEGMENT}} | ${{ADDON_4_PRICE}}/mo | {{ADDON_4_JUSTIFICATION}} |

**Add-on pricing principle:** An add-on should cost less than the price difference between the customer's current tier and the next tier. This way, customers who need only one extra feature buy the add-on, while customers who need multiple extras upgrade tiers.

### 2.4 Tier Upgrades

**How it works:** Move customers from a lower tier to a higher tier with more features, higher limits, and better support.

**Tier upgrade triggers:**
- Customer uses a feature only available on a higher tier (sees lock/paywall)
- Customer contacts support about a limitation that the higher tier resolves
- Customer's usage has grown to the point where the higher tier is more cost-effective
- Customer has been on the current tier for 6+ months and is actively engaged

**Tier upgrade playbook:**

| Current Tier | Target Tier | Key Motivator | Messaging Angle |
|-------------|------------|---------------|-----------------|
| {{TIER_1_NAME}} | {{TIER_2_NAME}} | {{T1_T2_MOTIVATOR}} | "{{T1_T2_MESSAGE}}" |
| {{TIER_2_NAME}} | {{TIER_3_NAME}} | {{T2_T3_MOTIVATOR}} | "{{T2_T3_MESSAGE}}" |
| {{TIER_3_NAME}} | {{TIER_4_NAME}} | {{T3_T4_MOTIVATOR}} | "{{T3_T4_MESSAGE}}" |

---

## 3. Timing Upsell Offers

### 3.1 The Golden Rule of Timing

**Upsell after value delivery, never before.** The customer must feel they are getting value from their current plan before you ask them to spend more. An upsell offer should feel like a natural next step, not a cash grab.

### 3.2 Optimal Upsell Timing Windows

| Timing Window | Why It Works | Upsell Type | Example |
|--------------|-------------|-------------|---------|
| **After a success moment** | Customer just achieved something meaningful; positive emotions | Tier upgrade, feature add-on | "You just completed your {{MILESTONE}}! Unlock {{FEATURE}} to do even more." |
| **At a usage threshold** | Customer is hitting limits organically; they need more | Usage upgrade, tier upgrade | "You've used 90% of your {{LIMIT}}. Upgrade to keep going." |
| **At renewal time** | Customer is already thinking about the product's value | Annual conversion, tier upgrade | "Before you renew: save {{PERCENT}}% by switching to annual billing." |
| **After a positive support interaction** | Customer just got help; satisfaction is high | Tier upgrade (for better support) | "Glad we could help! With {{TIER}}, you get priority support." |
| **After a product update** | New features available on higher tiers | Tier upgrade, add-on | "We just launched {{NEW_FEATURE}} — available on {{TIER}}." |
| **When team grows** | New team member added; value of product just increased | Seat expansion, team tier | "Welcome {{NEW_MEMBER}}! Your team might benefit from {{TEAM_FEATURES}}." |
| **Quarterly business review** | Natural check-in; discuss value and growth | Any expansion type | "In Q{{QUARTER}}, you {{ACCOMPLISHMENT}}. Here's how we can help you do more." |
| **At contract anniversary** | Celebrating loyalty; relationship is established | Annual conversion, tier upgrade | "Happy 1 year with {{PROJECT_NAME}}! Celebrate with {{OFFER}}." |

### 3.3 Timing Anti-Patterns

| Bad Timing | Why It Fails | What Happens |
|-----------|-------------|-------------|
| Immediately after signup | No value received yet | Annoyance; distrust; may cancel |
| During a product outage | Customer is frustrated | Rage; feels tone-deaf; damages relationship |
| When customer has open support ticket | Customer has an unresolved problem | Perceived as "pay more to get help"; very damaging |
| Multiple upsell attempts in same week | Oversaturation | Customer feels harassed; considers downgrading |
| During a price increase | Already asking for more money | Double hit; customer feels squeezed |

### 3.4 Upsell Cooldown Rules

Implement these rules to prevent over-solicitation:

- [ ] **No more than 1 upsell prompt per session** (in-app)
- [ ] **No more than 1 upsell email per month** (unless triggered by behavior)
- [ ] **14-day cooldown after a declined upsell** before showing another
- [ ] **30-day cooldown after a downgrade** before attempting re-upsell
- [ ] **No upsell prompts for accounts with open support tickets rated "urgent"**
- [ ] **No upsell prompts within 48 hours of a product incident**

---

## 4. Upsell Messaging Templates

### 4.1 Email Templates

**Template: Usage Limit Approaching**
```
Subject: You're growing fast — here's how to keep the momentum
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

Your team has been crushing it with {{PROJECT_NAME}} this month:

- {{USAGE_STAT_1}}
- {{USAGE_STAT_2}}
- {{USAGE_STAT_3}}

You're currently at {{CURRENT_USAGE}}% of your {{CURRENT_TIER}}
plan's {{LIMIT_TYPE}} limit.

Upgrade to {{NEXT_TIER}} to get:
- {{UPGRADE_BENEFIT_1}}
- {{UPGRADE_BENEFIT_2}}
- {{UPGRADE_BENEFIT_3}}

The upgrade is just ${{PRICE_DIFFERENCE}} more per month —
that's ${{DAILY_DIFFERENCE}}/day.

[Upgrade to {{NEXT_TIER}} →]

Have questions? Reply to this email — I'm happy to help you
find the right plan.

{{SENDER_NAME}}
{{SENDER_TITLE}}, {{PROJECT_NAME}}
```

**Template: Feature-Based Upsell**
```
Subject: Unlock {{FEATURE_NAME}} for your team
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

I noticed your team has been {{BEHAVIOR_THAT_SIGNALS_NEED}}.
Did you know {{PROJECT_NAME}} {{NEXT_TIER}} includes
{{FEATURE_NAME}}?

**What {{FEATURE_NAME}} does:**
{{FEATURE_DESCRIPTION}}

**How teams like yours use it:**
"{{TESTIMONIAL_QUOTE}}"
— {{TESTIMONIAL_AUTHOR}}, {{TESTIMONIAL_COMPANY}}

**What it costs:**
Just ${{PRICE_DIFFERENCE}}/month more than your current plan.

[See {{NEXT_TIER}} Features →]

{{SENDER_NAME}}
```

**Template: Annual Billing Conversion**
```
Subject: Save ${{ANNUAL_SAVINGS}} per year on {{PROJECT_NAME}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

You've been with {{PROJECT_NAME}} for {{MONTHS_AS_CUSTOMER}} months
now — great to have you!

Quick question: did you know you could save ${{ANNUAL_SAVINGS}}
per year by switching to annual billing?

Here's the math:
- Monthly billing: ${{MONTHLY_PRICE}}/mo × 12 = ${{MONTHLY_ANNUAL_TOTAL}}/year
- Annual billing: ${{ANNUAL_PRICE}}/year (${{ANNUAL_MONTHLY_EQUIV}}/mo)
- **You save: ${{ANNUAL_SAVINGS}}/year ({{SAVINGS_PERCENT}}% off)**

It takes 30 seconds to switch:

[Switch to Annual Billing →]

Your next billing cycle will be adjusted automatically.
You can switch back to monthly at any time.

{{SENDER_NAME}}
```

**Template: Post-Milestone Celebration Upsell**
```
Subject: Congrats on {{MILESTONE}} — want to do even more?
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

Your team just hit a milestone: {{MILESTONE_DESCRIPTION}}.

That puts you in the top {{PERCENTILE}}% of {{PROJECT_NAME}} users.

Teams at your level typically get the most value from {{NEXT_TIER}},
which includes:

- {{BENEFIT_1}} (saves {{TIME_SAVED_1}} per week)
- {{BENEFIT_2}} (used by {{PERCENT_OF_TEAMS}}% of teams your size)
- {{BENEFIT_3}} (exclusive to {{NEXT_TIER}})

[Explore {{NEXT_TIER}} →]

No pressure — just wanted to make sure you know what's available.

{{SENDER_NAME}}
```

### 4.2 In-App Upsell Templates

**In-app banner (non-blocking):**
```
[Banner at top of relevant feature page]
Want {{FEATURE_BENEFIT}}? Available on {{NEXT_TIER}}.
[Learn More]  [Dismiss]
```

**In-app modal (contextual — shown when user tries gated feature):**
```
[Modal]
{{FEATURE_NAME}} is available on {{NEXT_TIER}}

{{1_SENTENCE_FEATURE_DESCRIPTION}}

Upgrade for just ${{PRICE_DIFFERENCE}} more per month.

[Upgrade Now]  [See All Plans]  [Not Now]
```

**In-app tooltip (subtle — shown near relevant UI elements):**
```
[Tooltip next to locked feature icon]
Pro tip: {{NEXT_TIER}} users get {{FEATURE_BENEFIT}}.
[Upgrade →]
```

### 4.3 Sales Call Script (For High-Value Accounts)

```
"Hi {{CUSTOMER_NAME}}, this is {{REP_NAME}} from {{PROJECT_NAME}}.
I'm your customer success manager. Do you have a few minutes?

I've been looking at your account and I noticed some impressive
things:
- Your team has {{ACCOMPLISHMENT_1}}
- You're using {{FEATURE}} more than {{PERCENTILE}}% of our customers
- Your {{METRIC}} has improved by {{IMPROVEMENT}}%

I wanted to check in and see if there are any ways we can help
you get even more value from {{PROJECT_NAME}}.

[LISTEN to their response]

Actually, based on what you've shared, I think our {{NEXT_TIER}}
plan might be a really good fit. It includes {{RELEVANT_FEATURE}}
which would help with exactly what you described.

Would it be helpful if I walked you through how {{NEXT_TIER}}
compares to your current plan?"
```

---

## 5. Annual Billing Conversion

### 5.1 Why Annual Billing Matters

Annual billing is one of the highest-impact, lowest-effort expansion strategies:

| Benefit | Impact |
|---------|--------|
| **Reduced churn** | Annual customers churn 3-5x less than monthly |
| **Improved cash flow** | 12 months of revenue upfront |
| **Higher LTV** | Even with discount, annual LTV typically 15-30% higher |
| **Lower payment failure** | One charge per year vs. 12 chances for card failure |
| **Budget lock-in** | Once budgeted annually, less likely to be cut |

### 5.2 Annual Conversion Tactics

| Tactic | Implementation | Expected Impact |
|--------|---------------|-----------------|
| **Show savings prominently** | "Save ${{SAVINGS}} per year" next to annual toggle | 5-10% of page visitors switch |
| **Default to annual** | Pre-select annual billing on pricing page | 20-40% increase in annual selection |
| **Show monthly equivalent** | "${{MONTHLY_EQUIV}}/mo billed annually" | Reduces sticker shock of annual price |
| **Frame as "X months free"** | "Get 2 months free with annual billing" | More compelling than percentage savings |
| **Offer at 3-month mark** | Email monthly customers at 3 months | 10-20% conversion rate |
| **Offer at renewal** | Show savings at monthly renewal | 5-15% conversion rate |
| **Sweeten with bonus** | "Switch to annual and get {{BONUS}}" | 15-25% conversion rate |

### 5.3 Annual Conversion Email Sequence

**Email 1: Month 3 (First Offer)**
```
Subject: You've been with us for 3 months — here's a thank you
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

You've been a {{PROJECT_NAME}} customer for 3 months! To say
thanks, I wanted to share a way to save on your subscription:

Switch to annual billing and save ${{ANNUAL_SAVINGS}} per year.

That's like getting {{FREE_MONTHS}} months free.

Your monthly rate drops from ${{MONTHLY_PRICE}}/mo to
${{ANNUAL_MONTHLY_EQUIV}}/mo.

[Switch to Annual — Save ${{ANNUAL_SAVINGS}} →]

You can switch back to monthly anytime. No risk.

{{SENDER_NAME}}
```

**Email 2: Month 6 (Second Offer — If Still Monthly)**
```
Subject: You've spent ${{TOTAL_SPENT}} on {{PROJECT_NAME}} — you could have saved ${{WOULD_HAVE_SAVED}}
From: {{SENDER_NAME}} at {{PROJECT_NAME}}

Hi {{CUSTOMER_NAME}},

Over the past 6 months, you've invested ${{TOTAL_SPENT}} in
{{PROJECT_NAME}}. If you'd been on annual billing, you would
have saved ${{WOULD_HAVE_SAVED}}.

Don't miss out on savings going forward. Switch to annual today:

Monthly: ${{MONTHLY_PRICE}}/mo (${{MONTHLY_ANNUAL_TOTAL}}/year)
Annual:  ${{ANNUAL_PRICE}}/year (${{ANNUAL_MONTHLY_EQUIV}}/mo)
You save: ${{ANNUAL_SAVINGS}}/year

[Switch to Annual Billing →]

{{SENDER_NAME}}
```

### 5.4 Annual Conversion Benchmarks

| Metric | Benchmark | {{PROJECT_NAME}} Actual |
|--------|-----------|------------------------|
| % of customers on annual billing | 30-50% | {{CURRENT_ANNUAL_PCT}}% |
| Monthly → Annual conversion rate (when offered) | 10-20% | {{M2A_CONVERSION}}% |
| Annual churn rate (vs monthly) | 2-5x lower | {{ANNUAL_CHURN}}% vs {{MONTHLY_CHURN}}% |
| LTV of annual vs monthly | 15-30% higher | ${{ANNUAL_LTV}} vs ${{MONTHLY_LTV}} |

---

## 6. Add-On Strategy

### 6.1 Designing Profitable Add-Ons

An effective add-on must meet these criteria:

| Criterion | Question | Pass/Fail |
|-----------|----------|-----------|
| **Distinct value** | Does the add-on deliver value independent of the core product? | {{ADDON_DISTINCT_VALUE}} |
| **Clear audience** | Is there a specific segment that needs this? | {{ADDON_CLEAR_AUDIENCE}} |
| **Not core** | Would removing it from the core product feel reasonable? | {{ADDON_NOT_CORE}} |
| **Enhances core** | Does it make the core product more valuable? | {{ADDON_ENHANCES}} |
| **Simple pricing** | Can it be priced as a flat monthly fee or clear per-unit charge? | {{ADDON_SIMPLE_PRICING}} |
| **Low support burden** | Is it self-serve and low-maintenance? | {{ADDON_LOW_SUPPORT}} |

### 6.2 Add-On Categories

| Category | Examples | Pricing Model | Revenue Potential |
|----------|---------|---------------|-------------------|
| **Advanced analytics** | Custom dashboards, export reports, data connectors | Flat monthly fee ($20-100/mo) | High |
| **Premium integrations** | CRM sync, Zapier premium, custom webhooks | Per-integration or bundle ($10-50/mo) | Medium |
| **Priority support** | Faster response times, phone support, dedicated rep | Flat monthly fee ($50-500/mo) | High |
| **Security/compliance** | SSO, audit logs, 2FA enforcement | Flat monthly fee ($50-200/mo) | Medium-High |
| **White-label/branding** | Remove your branding, custom domain | Flat monthly fee ($20-100/mo) | Medium |
| **Additional storage/capacity** | Extra GB, additional projects, more seats | Per-unit ($5-20 per unit/mo) | Medium |
| **AI/automation features** | AI-assisted workflows, auto-categorization | Credits or flat monthly ($20-100/mo) | High |
| **Training/onboarding** | Self-serve courses, certification, webinars | One-time or subscription ($50-500) | Low-Medium |

### 6.3 Add-On Promotion Strategy

**In-app promotion:**
- Show add-on suggestions contextually when a user would benefit (e.g., show analytics add-on when user views basic reports)
- Include add-on options on the billing/plan page
- Highlight popular add-ons with "Most Popular" badges

**Email promotion:**
- Feature individual add-ons in monthly product update emails
- Send targeted add-on suggestions based on usage patterns
- Include add-on savings in annual billing conversion offers ("Bundle and save")

**Checkout/upgrade promotion:**
- Cross-sell add-ons during tier upgrades: "Customers upgrading to {{TIER}} often add {{ADDON}}"
- Offer add-on bundles at a discount: "Save 20% when you bundle {{ADDON_1}} + {{ADDON_2}}"

---

## 7. Net Revenue Retention (NRR) Optimization

### 7.1 Understanding NRR

**Net Revenue Retention (NRR)** measures how much revenue you retain and expand from existing customers over time, excluding new customer revenue.

```
NRR = (Starting MRR + Expansion MRR - Churned MRR - Contraction MRR) / Starting MRR × 100
```

| NRR Level | What It Means | Company Growth Potential |
|-----------|--------------|------------------------|
| **< 80%** | Losing significant revenue; churn is critical | Cannot grow without massive new customer acquisition |
| **80-90%** | Revenue declining from existing base | Growth requires more new revenue than lost |
| **90-100%** | Revenue roughly stable from existing base | Growth comes entirely from new customers |
| **100-110%** | Revenue growing even without new customers | Strong position; growth is multiplied |
| **110-130%** | Excellent; existing customers spend significantly more | Outstanding; this is the target for top SaaS |
| **> 130%** | Exceptional; rare (Snowflake, Datadog territory) | Category-defining companies |

### 7.2 NRR Improvement Strategies

| Strategy | Impact on NRR Component | Effort | Priority |
|----------|------------------------|--------|----------|
| **Reduce churn** (customer success) | Reduces churned MRR | Medium | Highest — fixing churn is 5-7x cheaper than acquiring new |
| **Prevent downgrades** (contraction) | Reduces contraction MRR | Medium | High — understand why customers downgrade |
| **Seat expansion** | Increases expansion MRR | Low | High — organic growth with growing teams |
| **Usage growth** | Increases expansion MRR | Low | High — natural if product delivers value |
| **Tier upgrades** | Increases expansion MRR | Medium | Medium — requires active selling |
| **Add-on sales** | Increases expansion MRR | Medium | Medium — requires add-on product development |
| **Annual conversion** | Reduces churned MRR (indirectly) | Low | Medium — reduces churn, increases commitment |
| **Price increases** | Increases expansion MRR | Low effort, high risk | Low priority — use sparingly |

### 7.3 NRR Dashboard

| Metric | This Month | Last Month | 3-Month Trend | Target |
|--------|-----------|-----------|--------------|--------|
| Starting MRR | ${{START_MRR}} | ${{LAST_START_MRR}} | {{MRR_TREND}} | — |
| New MRR (not counted in NRR) | ${{NEW_MRR}} | ${{LAST_NEW_MRR}} | {{NEW_TREND}} | — |
| Expansion MRR | ${{EXPANSION_MRR}} | ${{LAST_EXPANSION_MRR}} | {{EXP_TREND}} | ${{TARGET_EXPANSION}} |
| Churned MRR | ${{CHURNED_MRR}} | ${{LAST_CHURNED_MRR}} | {{CHURN_TREND}} | < ${{TARGET_CHURN_MAX}} |
| Contraction MRR | ${{CONTRACTION_MRR}} | ${{LAST_CONTRACTION_MRR}} | {{CONTRACT_TREND}} | < ${{TARGET_CONTRACT_MAX}} |
| **NRR** | **{{CURRENT_NRR}}%** | **{{LAST_NRR}}%** | **{{NRR_TREND}}** | **{{TARGET_NRR}}%** |

### 7.4 NRR Improvement Action Plan

| Action | NRR Component Affected | Expected Impact | Timeline |
|--------|----------------------|-----------------|----------|
| {{NRR_ACTION_1}} | {{NRR_COMPONENT_1}} | +{{NRR_IMPACT_1}}% | {{NRR_TIMELINE_1}} |
| {{NRR_ACTION_2}} | {{NRR_COMPONENT_2}} | +{{NRR_IMPACT_2}}% | {{NRR_TIMELINE_2}} |
| {{NRR_ACTION_3}} | {{NRR_COMPONENT_3}} | +{{NRR_IMPACT_3}}% | {{NRR_TIMELINE_3}} |
| {{NRR_ACTION_4}} | {{NRR_COMPONENT_4}} | +{{NRR_IMPACT_4}}% | {{NRR_TIMELINE_4}} |

---

## 8. Customer Success-Driven Expansion

### 8.1 The CS-Led Expansion Philosophy

The most effective and sustainable expansion revenue comes from helping customers succeed, not from selling harder. When customers achieve their goals with your product, they naturally want more.

```
Customer Success → Product Adoption → Usage Growth → Natural Expansion
```

### 8.2 Customer Health Score

Create a health score that predicts expansion readiness:

| Factor | Weight | Scoring | Data Source |
|--------|--------|---------|-------------|
| **Product usage** (DAU/MAU ratio) | {{USAGE_WEIGHT}}% | 0-100 based on engagement level | Product analytics |
| **Feature adoption** (% of features used) | {{ADOPTION_WEIGHT}}% | 0-100 based on breadth of usage | Product analytics |
| **Support sentiment** (CSAT/NPS) | {{SENTIMENT_WEIGHT}}% | 0-100 based on satisfaction scores | Support system |
| **Account growth** (seats, usage trend) | {{GROWTH_WEIGHT}}% | 0-100 based on growth rate | Billing system |
| **Champion engagement** (login frequency of key contact) | {{CHAMPION_WEIGHT}}% | 0-100 based on activity | Product analytics |

**Health score thresholds:**

| Score | Status | Expansion Action |
|-------|--------|-----------------|
| 80-100 | Excellent | Actively pursue expansion; high receptivity |
| 60-79 | Good | Gentle expansion suggestions; focus on continued success |
| 40-59 | At risk | Focus on engagement and value delivery; do NOT upsell |
| 0-39 | Critical | Full retention mode; CSM intervention; no expansion attempts |

### 8.3 Quarterly Business Reviews (QBRs)

QBRs are the most effective CS-driven expansion tool. Structure them to naturally lead to expansion conversations.

**QBR Template:**

```
1. REVIEW (10 minutes)
   - Recap goals from last quarter
   - Show metrics and achievements
   - Highlight ROI delivered ("You saved {{SAVINGS}} this quarter")

2. CURRENT STATE (10 minutes)
   - Usage trends and adoption metrics
   - What's working well
   - Areas for improvement
   - Any open issues or concerns

3. LOOKING AHEAD (10 minutes)
   - Customer's goals for next quarter
   - How {{PROJECT_NAME}} can support those goals
   - New features/products that align with goals
   → THIS IS WHERE EXPANSION NATURALLY EMERGES

4. RECOMMENDATIONS (10 minutes)
   - Specific recommendations based on goals
   - If relevant: "Based on your goals, {{EXPANSION_RECOMMENDATION}}
     would help you {{BENEFIT}}"
   - Next steps and timeline
```

### 8.4 Success-to-Expansion Signals

| Customer Success Signal | Expansion Opportunity | How to Approach |
|------------------------|----------------------|-----------------|
| Team is growing (new hires) | Seat expansion | "Welcome your new team members to {{PROJECT_NAME}}" |
| Hitting usage limits regularly | Usage/tier upgrade | "Your growth is great — let's make sure your plan keeps up" |
| Asking about advanced features | Tier upgrade or add-on | "Great question — that's available on {{TIER}}, let me show you" |
| High NPS score (9-10) | Annual conversion or tier upgrade | "Glad you love us! Here's how to get even more value" |
| Using product for new use case | Add-on or cross-sell | "Interesting use case — have you tried {{RELATED_FEATURE}}?" |
| Sharing product with other departments | Enterprise or multi-team plan | "Sounds like more teams could benefit — let's discuss a company plan" |
| Posting positive review | Annual conversion (loyalty reward) | "Thank you for the review! Here's a special offer for loyal customers" |

---

## 9. Pricing Page Design for Upsells

### 9.1 Feature Comparison Table Design

Design your pricing page feature comparison to drive upgrades from within the product.

**Key design elements:**

| Element | Purpose | Implementation |
|---------|---------|---------------|
| **Highlight recommended plan** | Drive selection toward most profitable tier | "Most Popular" or "Best Value" badge; visually prominent column |
| **Show current plan** | Help customer orient; understand where they are | "Your Current Plan" label; different background color |
| **Feature checkmarks vs X marks** | Show what current plan lacks | Use gray X for missing features; green check for included |
| **Hover tooltips on features** | Explain value of each feature | Brief description + "Why this matters" on hover |
| **Toggle annual/monthly** | Promote annual billing | Default to annual; show savings prominently |
| **Clear upgrade CTA per tier** | Reduce friction | "Upgrade" button on each tier column (not just at the bottom) |

### 9.2 "Most Popular" Badge Placement

Place the "Most Popular" badge on the plan you want customers to choose. This should be:
- The plan with the best revenue-to-value ratio for your business
- Typically the middle tier (center stage effect)
- The plan where most successful customers land after upgrading

### 9.3 In-Product Pricing/Upgrade Page

Create a dedicated upgrade page within the product (not just on your marketing site):

```
[In-Product Upgrade Page Layout]

YOUR CURRENT PLAN: {{CURRENT_TIER}} — ${{CURRENT_PRICE}}/mo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPGRADE OPTIONS:

┌─────────────────────┐  ┌─────────────────────┐
│  {{NEXT_TIER}}       │  │  {{TOP_TIER}}        │
│  ${{NEXT_PRICE}}/mo  │  │  ${{TOP_PRICE}}/mo   │
│                     │  │                     │
│  Everything you     │  │  Everything in       │
│  have now, PLUS:    │  │  {{NEXT_TIER}}, PLUS: │
│                     │  │                     │
│  ✓ {{NEW_FEAT_1}}  │  │  ✓ {{NEW_FEAT_4}}   │
│  ✓ {{NEW_FEAT_2}}  │  │  ✓ {{NEW_FEAT_5}}   │
│  ✓ {{NEW_FEAT_3}}  │  │  ✓ {{NEW_FEAT_6}}   │
│                     │  │                     │
│  [Upgrade →]        │  │  [Upgrade →]         │
└─────────────────────┘  └─────────────────────┘

AVAILABLE ADD-ONS:
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ {{ADDON_1}}    │ │ {{ADDON_2}}    │ │ {{ADDON_3}}    │
│ ${{A1_PRICE}}  │ │ ${{A2_PRICE}}  │ │ ${{A3_PRICE}}  │
│ [Add →]       │ │ [Add →]       │ │ [Add →]       │
└───────────────┘ └───────────────┘ └───────────────┘

💬 Need help choosing? Chat with us or reply to your
   account manager at {{CSM_EMAIL}}.
```

### 9.4 Pricing Page A/B Tests for Upsells

| Test | Hypothesis | Expected Impact |
|------|-----------|-----------------|
| "Most Popular" badge position | Moving badge to higher tier increases upgrades | +5-15% selection of highlighted tier |
| Default to annual billing toggle | Pre-selecting annual increases annual signups | +20-40% annual billing selection |
| Show per-feature pricing | "Just $5/mo more for {{FEATURE}}" | +10-20% add-on adoption |
| Tiered upgrade vs add-on emphasis | Promoting add-ons vs tier upgrades | Varies — depends on product |
| Social proof on pricing page | Testimonials next to each tier | +5-10% overall conversion |

---

## 10. Anti-Patterns: What to Avoid

### 10.1 Aggressive Upselling That Causes Churn

The biggest risk of expansion revenue efforts is pushing too hard and losing the customer entirely. A lost customer generates zero expansion revenue forever.

| Anti-Pattern | What It Looks Like | Why Customers Leave | Better Approach |
|-------------|-------------------|-------------------|----------------|
| **Constant upsell prompts** | Pop-ups on every login; weekly upgrade emails | Feels like the company cares about money, not the customer | Trigger-based prompts only; respect cooldown periods |
| **Forced upgrades** | Removing features from current plan to force upgrade | Feels like a betrayal of trust; bait-and-switch perception | Grandfather existing features; add new features to higher tiers |
| **Feature ransom** | "Your data is locked unless you upgrade" | Hostile; customers feel trapped | Always allow data export and access to existing work |
| **Stealth upgrades** | Auto-upgrading plans without clear consent | Anger; chargebacks; regulatory issues | Always require explicit opt-in for plan changes |
| **Fake urgency** | "This offer expires in 24 hours!" (but it never actually expires) | Destroys trust when customers realize it's fake | Use real urgency (genuine time-limited offers) or no urgency |
| **Guilt-tripping** | "Are you SURE you don't want better features for your team?" | Patronizing; disrespectful of customer's decision | Accept "no" gracefully; try again later with new context |
| **Support-gating** | Providing poor support to free/basic users to force upgrades | Negative word-of-mouth; review damage; brand erosion | Provide good support at every tier; premium = faster, not better |

### 10.2 Common Expansion Revenue Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| **No expansion strategy at all** | Leaving revenue on the table; NRR below 100% | Implement this playbook systematically |
| **Only relying on organic expansion** | Missing proactive opportunities | Combine organic triggers with proactive outreach |
| **Sales team not aligned with CS** | Conflicting messages to customers | Create shared playbooks; align incentives |
| **No tracking of expansion metrics** | Cannot optimize what you do not measure | Implement the metrics in Section 11 |
| **One-size-fits-all approach** | Messages miss the mark for different segments | Segment customers; personalize expansion offers |
| **Ignoring contraction** | Customers downgrading unchecked | Analyze downgrade reasons; intervene early |

---

## 11. Metrics and Tracking

### 11.1 Expansion Revenue Metrics Dashboard

| Metric | Definition | Current | Target |
|--------|-----------|---------|--------|
| **NRR (Net Revenue Retention)** | (Starting MRR + Expansion - Churn - Contraction) / Starting MRR | {{CURRENT_NRR}}% | {{TARGET_NRR}}% |
| **Expansion MRR** | Additional MRR from existing customers this month | ${{CURRENT_EXPANSION_MRR}} | ${{TARGET_EXPANSION_MRR}} |
| **Expansion as % of new MRR** | Expansion MRR / (New MRR + Expansion MRR) | {{EXPANSION_PCT}}% | > 30% |
| **Upsell conversion rate** | Customers who upgraded / Customers shown upsell | {{UPSELL_CONV}}% | {{TARGET_UPSELL}}% |
| **ARPA (Average Revenue Per Account)** | Total MRR / Paying customers | ${{CURRENT_ARPA}} | ${{TARGET_ARPA}} |
| **ARPA growth rate** | Month-over-month ARPA change | {{ARPA_GROWTH}}% | {{TARGET_ARPA_GROWTH}}% |
| **Annual billing %** | Annual customers / Total paying customers | {{ANNUAL_PCT}}% | {{TARGET_ANNUAL_PCT}}% |
| **Add-on attachment rate** | Customers with 1+ add-on / Total customers | {{ADDON_RATE}}% | {{TARGET_ADDON}}% |
| **Seat expansion rate** | New seats this month / Total seats last month | {{SEAT_EXPANSION}}% | {{TARGET_SEAT_EXPANSION}}% |
| **Contraction MRR** | MRR lost from existing customers downgrading | ${{CONTRACTION_MRR}} | < ${{TARGET_CONTRACT_MAX}} |
| **Churn rate (for context)** | Customers lost / Total customers | {{CHURN_RATE}}% | < {{TARGET_CHURN}}% |

### 11.2 Expansion Revenue by Source

Track where your expansion revenue comes from to prioritize efforts:

| Source | Monthly Expansion MRR | % of Total Expansion | YoY Growth |
|--------|---------------------|---------------------|-----------|
| Tier upgrades | ${{TIER_UPGRADE_MRR}} | {{TIER_UPGRADE_PCT}}% | {{TIER_UPGRADE_YOY}}% |
| Seat expansion | ${{SEAT_EXP_MRR}} | {{SEAT_EXP_PCT}}% | {{SEAT_EXP_YOY}}% |
| Usage growth | ${{USAGE_GROWTH_MRR}} | {{USAGE_GROWTH_PCT}}% | {{USAGE_GROWTH_YOY}}% |
| Add-on sales | ${{ADDON_MRR}} | {{ADDON_MRR_PCT}}% | {{ADDON_YOY}}% |
| Annual conversion | ${{ANNUAL_CONV_MRR}} | {{ANNUAL_CONV_PCT}}% | {{ANNUAL_CONV_YOY}}% |
| Price increases | ${{PRICE_INC_MRR}} | {{PRICE_INC_PCT}}% | {{PRICE_INC_YOY}}% |
| **Total expansion** | **${{TOTAL_EXPANSION}}** | **100%** | **{{TOTAL_EXP_YOY}}%** |

### 11.3 Expansion Funnel Metrics

| Funnel Stage | Volume | Conversion Rate | Revenue Impact |
|-------------|--------|----------------|---------------|
| Customers eligible for upsell | {{ELIGIBLE}} | — | — |
| Customers shown upsell offer | {{SHOWN_OFFER}} | {{SHOWN_PCT}}% of eligible | — |
| Customers who engaged with offer | {{ENGAGED_OFFER}} | {{ENGAGED_PCT}}% of shown | — |
| Customers who started upgrade flow | {{STARTED_UPGRADE}} | {{STARTED_PCT}}% of engaged | — |
| Customers who completed upgrade | {{COMPLETED}} | {{COMPLETED_PCT}}% of started | ${{COMPLETED_MRR}} MRR |
| **Overall: Eligible → Upgraded** | — | **{{OVERALL_UPSELL_PCT}}%** | **${{COMPLETED_MRR}} MRR** |

### 11.4 Reporting Cadence

| Report | Frequency | Audience | Key Metrics |
|--------|-----------|----------|-------------|
| Expansion revenue summary | Weekly | Growth team, CS leads | Expansion MRR, upsell count, notable wins |
| NRR report | Monthly | Leadership, board | NRR, expansion breakdown, churn, contraction |
| Upsell campaign performance | Monthly | Marketing, growth | Conversion rates, revenue per campaign |
| Customer health and expansion readiness | Quarterly | CS team, sales | Health scores, expansion pipeline, QBR outcomes |
| Annual expansion review | Annually | Leadership, board, investors | YoY NRR trend, ARPA growth, expansion revenue contribution |

---

## Expansion Revenue Action Plan

| Priority | Action | Revenue Impact | Effort | Owner | Timeline |
|----------|--------|---------------|--------|-------|----------|
| 1 | {{EXP_ACTION_1}} | ${{EXP_IMPACT_1}}/mo | {{EXP_EFFORT_1}} | {{EXP_OWNER_1}} | {{EXP_TIMELINE_1}} |
| 2 | {{EXP_ACTION_2}} | ${{EXP_IMPACT_2}}/mo | {{EXP_EFFORT_2}} | {{EXP_OWNER_2}} | {{EXP_TIMELINE_2}} |
| 3 | {{EXP_ACTION_3}} | ${{EXP_IMPACT_3}}/mo | {{EXP_EFFORT_3}} | {{EXP_OWNER_3}} | {{EXP_TIMELINE_3}} |
| 4 | {{EXP_ACTION_4}} | ${{EXP_IMPACT_4}}/mo | {{EXP_EFFORT_4}} | {{EXP_OWNER_4}} | {{EXP_TIMELINE_4}} |
| 5 | {{EXP_ACTION_5}} | ${{EXP_IMPACT_5}}/mo | {{EXP_EFFORT_5}} | {{EXP_OWNER_5}} | {{EXP_TIMELINE_5}} |

---

## Next Steps

1. [ ] Calculate current NRR using the formula in Section 7
2. [ ] Identify top 20 accounts most likely to expand (use health score in Section 8)
3. [ ] Implement usage-based upsell triggers (Section 3)
4. [ ] Create email templates in your email tool (Section 4)
5. [ ] Launch annual billing conversion campaign (Section 5)
6. [ ] Design and price add-ons (Section 6)
7. [ ] Train CS team on expansion conversations (Section 8)
8. [ ] Set up expansion metrics dashboard (Section 11)
9. [ ] Review pricing page for upsell optimization (Section 9)
10. [ ] Schedule first QBR with top 10 accounts (Section 8.3)

---

*Template from the Master Starter Kit — Pricing & Monetization section*
