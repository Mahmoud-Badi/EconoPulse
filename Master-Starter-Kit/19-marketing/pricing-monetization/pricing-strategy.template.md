# Pricing Strategy for {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Target Market:** {{TARGET_MARKET}}
> **Primary Competitor:** {{PRIMARY_COMPETITOR}}
> **Launch Date:** {{LAUNCH_DATE}}
> **Current Stage:** {{STAGE}} <!-- e.g., pre-launch, beta, growth, mature -->

---

## Table of Contents

1. [Pricing Model Selection Framework](#1-pricing-model-selection-framework)
2. [Value-Based Pricing Calculation](#2-value-based-pricing-calculation)
3. [Pricing Psychology Principles](#3-pricing-psychology-principles)
4. [Tier Design (Good / Better / Best)](#4-tier-design-good--better--best)
5. [Competitive Pricing Analysis](#5-competitive-pricing-analysis)
6. [Price Point Testing Methods](#6-price-point-testing-methods)
7. [Annual vs Monthly Pricing](#7-annual-vs-monthly-pricing)
8. [Enterprise Pricing](#8-enterprise-pricing)
9. [Launch Pricing Strategy](#9-launch-pricing-strategy)
10. [Price Increase Strategy](#10-price-increase-strategy)
11. [Geographic Pricing](#11-geographic-pricing)
12. [Product-Type-Specific Guidance](#12-product-type-specific-guidance)

---

## 1. Pricing Model Selection Framework

### Available Pricing Models

Use the decision matrix below to identify which model(s) fit {{PROJECT_NAME}}.

| Model | How It Works | Best For | Risk Level | Revenue Predictability |
|-------|-------------|----------|------------|----------------------|
| **Monthly Subscription** | Recurring monthly charge for access | SaaS, content platforms, tools | Low | High |
| **Annual Subscription** | Yearly charge (usually discounted) | SaaS, B2B tools, platforms | Low | Very High |
| **Freemium** | Free tier + paid upgrades | Products needing network effects, viral growth | Medium | Medium |
| **One-Time Purchase** | Single payment for perpetual access | Desktop software, templates, courses | Medium | Low (lumpy) |
| **Usage-Based** | Pay per unit of consumption | APIs, cloud services, communication tools | Medium | Medium |
| **Per-Seat** | Price multiplied by number of users | Team collaboration tools, B2B SaaS | Low | High |
| **Tiered** | Multiple plans at different price points | Most SaaS products | Low | High |
| **Hybrid** | Combines 2+ models above | Complex platforms, enterprise products | High | Varies |

### Model Selection Questionnaire

Answer these questions to narrow down the best model for {{PROJECT_NAME}}:

1. **Does usage vary significantly between customers?**
   - Yes → Consider usage-based or tiered
   - No → Consider flat-rate subscription

2. **Is team/multi-user access a core feature?**
   - Yes → Consider per-seat pricing
   - No → Consider flat-rate or tiered

3. **Do you need a large free user base for network effects or virality?**
   - Yes → Consider freemium
   - No → Consider trial-based or paid-only

4. **Is your product consumed once or ongoing?**
   - Once (course, template, ebook) → One-time purchase
   - Ongoing (tool, platform, service) → Subscription

5. **Do your costs scale linearly with customer usage?**
   - Yes → Usage-based component is critical
   - No → Flat-rate is more profitable at scale

6. **What is your target customer's budget cycle?**
   - Monthly budgets (SMB, consumers) → Monthly subscription
   - Annual budgets (enterprise, B2B) → Annual subscription

### Selected Model for {{PROJECT_NAME}}

**Primary Model:** {{PRICING_MODEL}}
**Secondary Model (if hybrid):** {{SECONDARY_PRICING_MODEL}}
**Rationale:** {{MODEL_RATIONALE}}

---

## 2. Value-Based Pricing Calculation

Value-based pricing sets prices based on the perceived value to the customer, not your costs. This is the most profitable approach for most software products.

### Step 1: Identify the Value Drivers

What does {{PROJECT_NAME}} help customers accomplish? List each value driver and estimate the economic impact.

| Value Driver | Description | Economic Value to Customer | Confidence |
|-------------|-------------|---------------------------|------------|
| {{VALUE_DRIVER_1}} | {{DESCRIPTION}} | ${{ANNUAL_VALUE}} / year | High / Med / Low |
| {{VALUE_DRIVER_2}} | {{DESCRIPTION}} | ${{ANNUAL_VALUE}} / year | High / Med / Low |
| {{VALUE_DRIVER_3}} | {{DESCRIPTION}} | ${{ANNUAL_VALUE}} / year | High / Med / Low |
| {{VALUE_DRIVER_4}} | {{DESCRIPTION}} | ${{ANNUAL_VALUE}} / year | High / Med / Low |

### Step 2: Calculate Total Value Delivered

```
Total Annual Value to Customer = Sum of all value drivers
                                = ${{TOTAL_ANNUAL_VALUE}}
```

### Step 3: Apply the Value Capture Ratio

Industry benchmarks for value capture (what percentage of value delivered you can charge):

- **B2B SaaS:** 10-20% of value delivered
- **B2C SaaS:** 5-10% of value delivered
- **Developer Tools:** 5-15% of value delivered
- **Enterprise Software:** 15-25% of value delivered

```
Recommended Price = Total Annual Value × Value Capture Ratio
                  = ${{TOTAL_ANNUAL_VALUE}} × {{CAPTURE_RATIO}}%
                  = ${{RECOMMENDED_ANNUAL_PRICE}} / year
                  = ${{RECOMMENDED_MONTHLY_PRICE}} / month
```

### Step 4: Validate Against Willingness-to-Pay

Before finalizing, validate with these sanity checks:

- [ ] **Cost comparison:** Is the price less than 10% of a full-time employee's cost to do the same task manually?
- [ ] **Alternative comparison:** Is the price competitive with or below alternative solutions?
- [ ] **Budget fit:** Does the price fit within the customer's typical discretionary budget?
- [ ] **ROI clarity:** Can you demonstrate 3-10x ROI at this price point?

### Value-Based Price Range for {{PROJECT_NAME}}

| Metric | Amount |
|--------|--------|
| Total annual value delivered | ${{TOTAL_ANNUAL_VALUE}} |
| Value capture ratio | {{CAPTURE_RATIO}}% |
| **Calculated price (annual)** | **${{RECOMMENDED_ANNUAL_PRICE}}** |
| **Calculated price (monthly)** | **${{RECOMMENDED_MONTHLY_PRICE}}** |

---

## 3. Pricing Psychology Principles

Apply these well-researched psychological principles to optimize how prices are perceived.

### 3.1 Anchoring

**Principle:** The first price a customer sees sets a mental reference point. All subsequent prices are judged against it.

**How to use for {{PROJECT_NAME}}:**
- Show the most expensive plan first (left to right on pricing page) OR prominently display the "value" option
- If you have enterprise pricing, display it to anchor the perception that your standard plans are affordable
- On sales calls, share the full value delivered (${{TOTAL_ANNUAL_VALUE}}) before revealing price
- When comparing to competitors, anchor against the most expensive alternative

**Specific Tactic:**
```
"Companies typically spend ${{EXPENSIVE_ALTERNATIVE}} per year on {{PROBLEM_SOLVED}}.
{{PROJECT_NAME}} delivers the same result for just ${{YOUR_PRICE}}/month."
```

### 3.2 Charm Pricing

**Principle:** Prices ending in 9 or 7 are perceived as significantly lower than round numbers. $49 feels much cheaper than $50.

**When to use:**
- B2C products: Always use charm pricing ($9.99, $29, $49)
- B2B mid-market: Use charm pricing ($99, $199, $499)
- Enterprise: Use round numbers ($500, $1,000) — signals quality and seriousness

**Recommended price points for {{PROJECT_NAME}}:**
- Free tier: $0
- Starter: ${{STARTER_PRICE}} (consider $9, $19, $29, $39, $49)
- Professional: ${{PRO_PRICE}} (consider $49, $79, $99, $149, $199)
- Business/Team: ${{BUSINESS_PRICE}} (consider $199, $299, $399, $499)

### 3.3 The Decoy Effect

**Principle:** Adding a third option that is clearly worse than one of the other two makes the better option look like a much stronger deal. The decoy is not meant to be purchased.

**How to structure for {{PROJECT_NAME}}:**

| Feature | Basic ($X) | Pro ($Y) — DECOY | Business ($Z) |
|---------|-----------|-------------------|---------------|
| Core features | Yes | Yes | Yes |
| Key differentiator | No | No | Yes |
| Usage limits | Low | Medium | High |
| Support | Email | Email | Priority |

In this structure, Pro acts as a decoy — it costs significantly more than Basic but lacks the key feature that Business has, making Business look like the clear winner.

### 3.4 Price-Value Framing

**Principle:** How you frame the price dramatically affects perception. Frame in the smallest sensible unit.

**Framing options for {{PROJECT_NAME}}:**
- Per month: "${{MONTHLY_PRICE}}/month" (most common for SaaS)
- Per day: "${{DAILY_PRICE}}/day" (if monthly seems high — "less than a cup of coffee")
- Per user/month: "${{PER_USER_PRICE}}/user/month" (for per-seat pricing)
- Per year with savings: "${{ANNUAL_PRICE}}/year (save {{SAVINGS_PERCENT}}%)"
- Versus alternative: "Replace your ${{ALTERNATIVE_COST}} tool with {{PROJECT_NAME}} for ${{YOUR_PRICE}}"

### 3.5 The Center Stage Effect

**Principle:** When presented with 3 options, people disproportionately choose the middle one. Make your target plan the middle option.

**Application:** Place your most profitable plan (the one you want most customers to choose) in the center of your pricing page. Visually highlight it with a "Most Popular" or "Recommended" badge.

### 3.6 Loss Aversion in Pricing

**Principle:** People feel losses more strongly than gains. Frame pricing around what they lose by not buying, not just what they gain.

**Messaging template:**
```
"Every month without {{PROJECT_NAME}}, you're losing approximately
${{MONTHLY_LOSS}} in {{LOST_VALUE_TYPE}}. Start your free trial today."
```

---

## 4. Tier Design (Good / Better / Best)

### 4.1 Tier Naming

Choose names that resonate with {{TARGET_MARKET}}:

| Style | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Best For |
|-------|--------|--------|--------|--------|----------|
| **Standard** | Free | Pro | Business | Enterprise | SaaS, general |
| **Growth-oriented** | Starter | Growth | Scale | Enterprise | Startups, B2B |
| **Size-based** | Solo | Team | Company | Enterprise | Per-seat products |
| **Capability** | Basic | Professional | Advanced | Enterprise | Dev tools, technical |
| **Persona** | Hobby | Freelancer | Agency | Enterprise | Creative tools |
| **Usage** | Light | Standard | Heavy | Unlimited | Usage-based products |

**Selected naming for {{PROJECT_NAME}}:**
- Tier 1: {{TIER_1_NAME}} — ${{TIER_1_PRICE}}
- Tier 2: {{TIER_2_NAME}} — ${{TIER_2_PRICE}}
- Tier 3: {{TIER_3_NAME}} — ${{TIER_3_PRICE}}
- Tier 4 (optional): {{TIER_4_NAME}} — ${{TIER_4_PRICE}} or "Contact Us"

### 4.2 Feature Allocation Framework

Deciding what goes in each tier is the most important pricing decision you will make. Use these principles:

**Tier 1 (Free or Starter) — Goal: Acquire users, demonstrate value**
- Include: Core features that demonstrate your unique value proposition
- Include: Enough functionality that users experience the "aha moment"
- Limit: Usage caps (e.g., 100 records, 3 projects, 1 user)
- Exclude: Team features, advanced analytics, integrations, priority support

**Tier 2 (Professional) — Goal: Convert serious individual users**
- Include: Everything in Tier 1 with higher limits
- Include: Features power users need daily
- Include: Key integrations (Slack, email, etc.)
- Limit: Team size (e.g., up to 5 users)
- Exclude: Admin controls, SSO, audit logs, custom branding

**Tier 3 (Business/Team) — Goal: Capture team and organizational value**
- Include: Everything in Tier 2 with higher limits
- Include: Team management, roles, permissions
- Include: Advanced analytics and reporting
- Include: Priority support
- Limit: Enterprise features (SSO, SAML, custom contracts)
- Exclude: Dedicated support, SLA guarantees, custom development

**Tier 4 (Enterprise) — Goal: Capture maximum value from large organizations**
- Include: Everything in Tier 3 with no limits
- Include: SSO/SAML, audit logs, compliance features
- Include: Dedicated account manager
- Include: Custom SLAs, uptime guarantees
- Include: Custom integrations, API access
- Price: Custom (typically 3-10x the Business tier)

### 4.3 Feature Allocation Matrix for {{PROJECT_NAME}}

| Feature | {{TIER_1_NAME}} | {{TIER_2_NAME}} | {{TIER_3_NAME}} | {{TIER_4_NAME}} |
|---------|-----------------|-----------------|-----------------|-----------------|
| {{FEATURE_1}} | {{T1_F1}} | {{T2_F1}} | {{T3_F1}} | {{T4_F1}} |
| {{FEATURE_2}} | {{T1_F2}} | {{T2_F2}} | {{T3_F2}} | {{T4_F2}} |
| {{FEATURE_3}} | {{T1_F3}} | {{T2_F3}} | {{T3_F3}} | {{T4_F3}} |
| {{FEATURE_4}} | {{T1_F4}} | {{T2_F4}} | {{T3_F4}} | {{T4_F4}} |
| {{FEATURE_5}} | {{T1_F5}} | {{T2_F5}} | {{T3_F5}} | {{T4_F5}} |
| Usage Limit | {{T1_LIMIT}} | {{T2_LIMIT}} | {{T3_LIMIT}} | Unlimited |
| Support | Community | Email | Priority | Dedicated |

### 4.4 Pricing Ratios Between Tiers

Maintain consistent pricing ratios for perceived fairness:

- **Tier 1 → Tier 2:** 2-3x price jump (e.g., $0→$29, or $9→$29)
- **Tier 2 → Tier 3:** 2-4x price jump (e.g., $29→$99, or $49→$199)
- **Tier 3 → Tier 4:** 3-10x price jump (e.g., $99→$499, or $199→custom)

The value delivered should increase more than the price at each tier to make upgrades feel like good deals.

---

## 5. Competitive Pricing Analysis

### Methodology

1. **Identify 5-10 direct competitors** to {{PROJECT_NAME}}
2. **Map their pricing tiers** (use the competitive analysis template in this directory)
3. **Calculate the price-per-feature** for key features
4. **Plot on a price-value map** to find positioning gaps
5. **Determine your positioning:** premium, mid-market, or budget

### Quick Competitive Price Mapping

| Competitor | Lowest Paid Plan | Mid-Tier | Top Tier | Pricing Model |
|-----------|-----------------|----------|----------|---------------|
| {{COMPETITOR_1}} | ${{C1_LOW}} | ${{C1_MID}} | ${{C1_HIGH}} | {{C1_MODEL}} |
| {{COMPETITOR_2}} | ${{C2_LOW}} | ${{C2_MID}} | ${{C2_HIGH}} | {{C2_MODEL}} |
| {{COMPETITOR_3}} | ${{C3_LOW}} | ${{C3_MID}} | ${{C3_HIGH}} | {{C3_MODEL}} |
| {{COMPETITOR_4}} | ${{C4_LOW}} | ${{C4_MID}} | ${{C4_HIGH}} | {{C4_MODEL}} |
| {{COMPETITOR_5}} | ${{C5_LOW}} | ${{C5_MID}} | ${{C5_HIGH}} | {{C5_MODEL}} |

### Price Positioning Decision

**Market average (mid-tier):** ${{MARKET_AVG}}
**Your target position:** {{POSITION}} (premium / mid-market / budget)

| Position | Price vs Market | When to Use |
|----------|----------------|-------------|
| **Premium** (20-50% above market) | Requires clear differentiation, superior UX, strong brand | If you have a clear competitive advantage |
| **Mid-Market** (within 10% of market) | Safest positioning, compete on features and experience | If you are entering an established market |
| **Budget** (20-40% below market) | Must have lower cost structure or be willing to sacrifice margin | If you are disrupting with simplicity or efficiency |

---

## 6. Price Point Testing Methods

### 6.1 Van Westendorp Price Sensitivity Meter

Survey your target customers with these four questions:

1. "At what price would {{PROJECT_NAME}} be so cheap that you'd question its quality?" → **Too cheap**
2. "At what price would {{PROJECT_NAME}} be a bargain — a great buy for the money?" → **Cheap / Good value**
3. "At what price would {{PROJECT_NAME}} start to seem expensive, but you'd still consider it?" → **Expensive but acceptable**
4. "At what price would {{PROJECT_NAME}} be so expensive that you'd never consider buying it?" → **Too expensive**

**How to analyze results:**
- Plot cumulative frequency distributions for each question
- The intersection of "too cheap" and "expensive" = **Point of Marginal Cheapness**
- The intersection of "cheap" and "too expensive" = **Point of Marginal Expensiveness**
- The range between these two points = **Acceptable price range**
- The intersection of "too cheap" and "too expensive" = **Optimal Price Point (OPP)**

**Sample size needed:** Minimum 50 responses, ideally 200+ from your target market.

### 6.2 Gabor-Granger Price Testing

A simpler method: show customers a price and ask if they would buy at that price. Start high and decrease (or randomize) to find the demand curve.

**Steps:**
1. Start at ${{HIGH_TEST_PRICE}} — "Would you purchase {{PROJECT_NAME}} at this price?"
2. If no, reduce by 20-30% and ask again
3. Continue until they say yes
4. Plot acceptance rates vs price points to find the revenue-maximizing price

**Key output:** Revenue = Price × Conversion Rate at that Price. The maximum of this curve is your optimal price.

### 6.3 A/B Testing Prices (Use With Caution)

**Important:** A/B testing live prices can cause customer backlash if users discover different people pay different amounts.

**Safer alternatives:**
- Test different pricing PAGE DESIGNS (not actual prices)
- Test different framing ("$99/mo" vs "$1,188/yr billed annually")
- Test on different marketing channels (not the same audience)
- Test landing page price displays before product launch (gauge interest)

---

## 7. Annual vs Monthly Pricing

### Discount Strategy

| Annual Discount | Effect on LTV | Best For |
|----------------|---------------|----------|
| **0% (no discount)** | Maximum LTV per customer | Products with very low churn (<2%/mo) |
| **10-15%** | Minor LTV reduction, small incentive | Default recommendation for most products |
| **16-20%** (most common: "2 months free") | Moderate LTV reduction, strong incentive | Growth-stage products needing cash flow |
| **25-30%** | Significant LTV reduction, very strong incentive | Pre-launch, high-churn products |
| **40%+** | Major LTV hit, but locks in customers | Lifetime deals, desperation (avoid) |

### Recommended for {{PROJECT_NAME}}

```
Monthly price:  ${{MONTHLY_PRICE}}
Annual price:   ${{ANNUAL_PRICE}} / year (${{ANNUAL_MONTHLY_EQUIVALENT}} / month)
Discount:       {{ANNUAL_DISCOUNT_PERCENT}}% off ({{ANNUAL_DISCOUNT_MONTHS}} months free)
```

### Annual Billing Presentation Tactics

- **Frame as savings:** "Save ${{ANNUAL_SAVINGS}} per year with annual billing"
- **Frame as free months:** "Get {{ANNUAL_DISCOUNT_MONTHS}} months free with annual billing"
- **Default selection:** Pre-select the annual toggle on your pricing page
- **Visual emphasis:** Use a different color, badge, or callout for the annual option
- **Show monthly cost:** Always show the per-month cost of annual plans (${{ANNUAL_MONTHLY_EQUIVALENT}}/mo billed annually)

### Impact on Key Metrics

```
Monthly subscriber LTV (at {{MONTHLY_CHURN}}% monthly churn): ${{MONTHLY_LTV}}
Annual subscriber LTV (at {{ANNUAL_CHURN}}% annual churn):    ${{ANNUAL_LTV}}
LTV improvement with annual billing:                          {{LTV_IMPROVEMENT}}%
```

---

## 8. Enterprise Pricing

### When to Offer Enterprise Pricing

Introduce an enterprise tier when:
- [ ] You receive inbound requests from companies with 50+ employees
- [ ] Customers ask about SSO, SAML, audit logs, or compliance
- [ ] Multiple users from the same company sign up individually
- [ ] Potential customers ask for invoicing instead of credit card billing
- [ ] You receive RFP (Request for Proposal) inquiries

### Enterprise Pricing Structure

| Component | Details |
|-----------|---------|
| Base platform fee | ${{ENTERPRISE_BASE}} / year |
| Per-seat cost | ${{ENTERPRISE_PER_SEAT}} / user / year |
| Minimum commitment | {{ENTERPRISE_MIN_SEATS}} seats |
| Contract length | 1-3 years (annual billing) |
| Volume discounts | 5% off at 50 seats, 10% at 100, 15% at 250+ |
| Implementation fee | ${{IMPLEMENTATION_FEE}} one-time |

### Enterprise Features Checklist

- [ ] Single Sign-On (SSO) via SAML 2.0 / OIDC
- [ ] SCIM provisioning for user management
- [ ] Audit logs and activity tracking
- [ ] Role-based access control (RBAC)
- [ ] Custom data retention policies
- [ ] SLA with uptime guarantee (99.9%+)
- [ ] Dedicated customer success manager
- [ ] Priority support with guaranteed response times
- [ ] Custom integrations and API access
- [ ] Security questionnaire / SOC 2 compliance
- [ ] Custom contract and invoicing (NET 30/60/90)
- [ ] Data residency options (EU, US, etc.)

### "Contact Us" vs Transparent Enterprise Pricing

| Approach | Pros | Cons |
|----------|------|------|
| **"Contact Us"** | Maximize deal size, qualify leads, customize | Friction, loses self-serve buyers |
| **Transparent pricing** | Self-serve, lower friction, builds trust | Leaves money on table for large deals |
| **Hybrid (starting at $X)** | Some transparency + room to negotiate | Can seem vague |

**Recommendation for {{PROJECT_NAME}}:** {{ENTERPRISE_PRICING_APPROACH}}

---

## 9. Launch Pricing Strategy

### Pre-Launch Pricing Options

| Strategy | Discount | Duration | Purpose |
|----------|----------|----------|---------|
| **Early bird pricing** | 20-40% off | Until launch day | Reward early supporters, validate demand |
| **Founding member pricing** | 30-50% off, locked forever | First 100-500 customers | Build initial user base, create urgency |
| **Beta pricing** | 50-100% off | During beta period | Get feedback, build case studies |
| **Lifetime deal** | Pay once for lifetime access | Limited quantity | Quick cash injection (use with extreme caution) |

### Recommended Launch Strategy for {{PROJECT_NAME}}

**Phase 1: Beta ({{BETA_START}} to {{BETA_END}})**
- Price: {{BETA_PRICE}} ({{BETA_DISCOUNT}}% off final price)
- Goal: {{BETA_CUSTOMER_TARGET}} customers
- Requirement: Feedback commitment, testimonial agreement

**Phase 2: Early Access ({{EA_START}} to {{EA_END}})**
- Price: {{EA_PRICE}} ({{EA_DISCOUNT}}% off final price)
- Goal: {{EA_CUSTOMER_TARGET}} customers
- Marketing: "Founding member" positioning, locked-in rate

**Phase 3: Public Launch ({{LAUNCH_DATE}})**
- Price: Full pricing at ${{FULL_PRICE}}
- Marketing: "Launch pricing ends {{LAUNCH_PROMO_END}}" (create urgency even at launch)

### Launch Pricing Urgency Tactics

- Limited quantity: "Only {{REMAINING_SPOTS}} founding member spots remaining"
- Time-limited: "Early bird pricing ends {{DEADLINE}}"
- Price progression: "Price increases to ${{NEXT_PRICE}} on {{PRICE_INCREASE_DATE}}"
- Grandfathering: "Lock in this price forever — it won't increase for founding members"

### Lifetime Deal Considerations

**Proceed with extreme caution.** Lifetime deals can generate quick cash but create long-term liabilities.

| Factor | Assessment |
|--------|-----------|
| Break-even point | Customer must generate value for {{LTD_BREAKEVEN}} months equivalent |
| Support burden | Lifetime customers require support forever at zero additional revenue |
| When it works | Pre-launch cash needs, products with near-zero marginal cost |
| When it fails | High-support products, products with significant per-user costs |
| Maximum recommended LTD quantity | 200-500 (cap it strictly) |
| Recommended LTD price | 2-3x annual price |

---

## 10. Price Increase Strategy

### When to Raise Prices

Raise prices when you observe these signals:
- [ ] You have not raised prices in 12+ months
- [ ] Your conversion rate is above 5-8% (price may be too low)
- [ ] You have added significant new features since last pricing change
- [ ] Customer feedback rarely mentions price as an objection
- [ ] Your value-based pricing analysis shows a gap between value and price
- [ ] Competitors have raised their prices
- [ ] Your costs have increased (infrastructure, team, etc.)
- [ ] You have strong social proof and case studies

### How to Raise Prices

**Step 1: Decide the scope**
- New customers only (easiest, lowest risk)
- New customers + existing customers at renewal (moderate risk)
- All customers immediately (highest risk — avoid unless necessary)

**Step 2: Communicate well in advance**
- Give 30-60 days notice minimum
- Explain the value additions that justify the increase
- Offer annual billing lock-in at current rate
- For loyal customers, consider a smaller increase or delayed implementation

**Step 3: Price increase communication template**

```
Subject: Updates to {{PROJECT_NAME}} pricing

Hi {{CUSTOMER_NAME}},

Over the past {{TIME_PERIOD}}, we've added {{NEW_FEATURES_SUMMARY}} to
{{PROJECT_NAME}}. These improvements have helped customers like you
{{VALUE_STATEMENT}}.

Starting {{EFFECTIVE_DATE}}, our pricing will be updated to reflect the
increased value {{PROJECT_NAME}} delivers:

- {{TIER_NAME}}: ${{OLD_PRICE}} → ${{NEW_PRICE}} / month

As a valued existing customer, your current pricing is locked in until
{{GRANDFATHERED_UNTIL}}.

[Optional: Lock in your current rate for another year by switching to
annual billing before {{DEADLINE}}.]

Thank you for being part of the {{PROJECT_NAME}} community.

Best,
{{SENDER_NAME}}
```

### Price Increase Benchmarks

- **Typical annual increase:** 5-15%
- **Increase with major new features:** 15-30%
- **Repositioning increase:** 50-100% (rare, requires rebranding/relaunch)
- **Maximum without customer backlash:** 20% for existing customers

---

## 11. Geographic Pricing

### Purchasing Power Parity (PPP)

Adjust prices based on the economic conditions of different countries to expand your addressable market.

| Region | PPP Discount | Example ($99 base) | Rationale |
|--------|-------------|-------------------|-----------|
| **US, UK, Canada, Australia, Western Europe** | 0% (base price) | $99 | Reference market |
| **Eastern Europe, Southern Europe** | 20-30% off | $69-79 | Lower purchasing power |
| **Latin America** | 30-50% off | $49-69 | Emerging market |
| **India, Southeast Asia** | 40-60% off | $39-59 | High potential, low purchasing power |
| **Africa** | 50-70% off | $29-49 | Maximize accessibility |

### Implementation Options

1. **Automatic PPP detection:** Use IP geolocation to detect country and show adjusted prices (tools: ParityDeals, Stripe geographic pricing)
2. **PPP coupon codes:** Offer discount codes for specific regions (manually managed)
3. **Regional pricing pages:** Separate pricing pages per region
4. **Honor system:** "Are you from a lower-income country? Use code PPP40 for 40% off"

### Preventing PPP Abuse

- Require payment method from the same country as the discount
- Use IP verification at checkout
- Clearly state in terms of service that PPP pricing is for residents only
- Accept some level of abuse as a cost of expanding global access

---

## 12. Product-Type-Specific Guidance

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### SaaS-Specific Pricing

**Key SaaS pricing metrics to track:**
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Average Revenue Per Account (ARPA)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio (target 3:1 or higher)
- Monthly revenue churn (target <2%)
- Net Revenue Retention (target >100%)

**SaaS pricing best practices:**
1. Start with 3 tiers (expand to 4 once you have enterprise demand)
2. Default to annual + monthly billing options
3. Price based on your primary value metric (users, projects, storage, API calls)
4. Include a free trial or freemium tier for self-serve acquisition
5. Reserve SSO and audit logs for the enterprise tier (SSO tax — controversial but standard)
6. Publish prices for all tiers except enterprise
7. Offer monthly billing at list price and annual billing at 15-20% discount
8. Re-evaluate pricing every 6-12 months as you add features

**Common SaaS pricing mistakes:**
- Pricing too low to appear "affordable" (signals low value)
- Too many tiers (decision paralysis — 3-4 is optimal)
- No free trial or freemium (high friction acquisition)
- Charging per seat when usage is the real value metric
- Not having an enterprise tier (leaving large deals on the table)
- Underpricing annual plans (more than 25% discount erodes LTV)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Mobile App-Specific Pricing

**App store pricing constraints:**
- Apple App Store and Google Play take a 15-30% commission on all transactions
- Price tiers are fixed by the app store (you cannot set arbitrary prices)
- Subscription auto-renewal is managed by the platform
- Free trials are supported natively (3-day, 7-day, 1-month)

**Mobile app pricing models:**
1. **Free with ads:** Best for utility apps with high daily usage. Expect $1-5 eCPM.
2. **Freemium with in-app purchases:** Best for productivity, health, and creativity apps.
3. **Subscription:** Best for content, fitness, news, and ongoing-value apps. Typical: $4.99-$14.99/month.
4. **Paid upfront:** Declining model. Use only for premium, niche apps. Typical: $2.99-$9.99.
5. **Consumable purchases:** Best for games (virtual currency, power-ups).

**Mobile app pricing optimization:**
- Test introductory offers (Apple/Google both support discounted first periods)
- Use annual subscriptions with 40-50% discount vs monthly (app stores promote annual)
- Show subscription price as weekly for lower perceived cost ("just $1.99/week")
- Implement a paywall after the user experiences core value (not before)
- Use soft paywalls (limited uses per day) rather than hard paywalls (total lockout)
- Offer a "restore purchases" option to maintain trust
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
### Marketplace-Specific Pricing

**Marketplace revenue models:**
1. **Transaction commission:** Take a percentage of each transaction (most common)
2. **Listing fees:** Charge sellers to list items
3. **Featured listings:** Charge for premium placement
4. **Subscription for sellers:** Monthly fee for seller accounts
5. **Buyer premium:** Additional fee charged to buyers
6. **Lead generation:** Charge for connections (no transaction required)

**Commission rate benchmarks by category:**
| Category | Typical Take Rate |
|----------|------------------|
| Physical goods (e-commerce) | 10-20% |
| Digital goods/services | 15-30% |
| Freelance/services | 10-20% |
| Rentals/bookings | 10-20% |
| Food delivery | 15-30% |
| Professional services | 10-15% |

**Marketplace pricing strategy:**
- Start with lower commissions to attract initial supply (sellers/providers)
- Increase commissions gradually as network effects strengthen
- Offer volume discounts for high-volume sellers
- Consider "seller plus" subscriptions with lower commissions + premium features
- Always be transparent about fees — hidden fees destroy marketplace trust
- Decide early: who pays the payment processing fee? (Usually split or seller absorbs)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Developer Tool-Specific Pricing

**Developer tool pricing principles:**
1. **Generous free tier is mandatory:** Developers expect to try before buying. Stingy free tiers kill adoption.
2. **Usage-based pricing works well:** Developers understand and accept pay-per-use (API calls, builds, etc.).
3. **Avoid per-seat pricing for small teams:** Developers hate per-seat pricing for tools under 10 users. Consider per-team or flat-rate for small teams.
4. **Open-source + paid cloud is powerful:** Offer an open-source self-hosted version + paid managed cloud (e.g., GitLab, Supabase model).
5. **Credit-based systems:** Offer monthly credits that reset; overage charged at a per-unit rate.

**Developer tool pricing tiers (typical):**
| Tier | Price | Target |
|------|-------|--------|
| Free | $0 | Individual developers, hobbyists, evaluation |
| Pro | $20-49/mo | Professional developers, freelancers |
| Team | $20-49/user/mo | Small-to-medium engineering teams |
| Enterprise | Custom | Large organizations with compliance needs |

**Developer tool pricing mistakes:**
- Requiring credit card for free tier (developers will leave)
- Rate-limiting the free tier too aggressively (causes frustration during evaluation)
- Not offering a CLI / API-first experience (developers do not want dashboards only)
- Charging for features that are free in open-source alternatives
- Complex pricing calculators that make costs unpredictable
<!-- ENDIF -->

---

## Pricing Decision Summary for {{PROJECT_NAME}}

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Pricing model** | {{PRICING_MODEL}} | {{MODEL_RATIONALE}} |
| **Number of tiers** | {{NUM_TIERS}} | {{TIER_RATIONALE}} |
| **Entry price** | ${{ENTRY_PRICE}}/mo | {{ENTRY_RATIONALE}} |
| **Target tier price** | ${{TARGET_PRICE}}/mo | {{TARGET_RATIONALE}} |
| **Top tier price** | ${{TOP_PRICE}}/mo | {{TOP_RATIONALE}} |
| **Annual discount** | {{ANNUAL_DISCOUNT_PERCENT}}% | {{DISCOUNT_RATIONALE}} |
| **Launch strategy** | {{LAUNCH_STRATEGY}} | {{LAUNCH_RATIONALE}} |
| **Enterprise tier** | Yes / No / Later | {{ENTERPRISE_RATIONALE}} |
| **Geographic pricing** | Yes / No | {{GEO_RATIONALE}} |

---

## Next Steps

1. [ ] Complete the [Competitive Pricing Analysis](./competitive-pricing-analysis.template.md)
2. [ ] Run Van Westendorp or Gabor-Granger price testing with {{SAMPLE_SIZE}} target customers
3. [ ] Design the pricing page (see [Website & Landing Pages](../website-and-landing-pages/) templates)
4. [ ] Implement billing infrastructure (Stripe, Paddle, or LemonSqueezy recommended)
5. [ ] Set up pricing analytics to track conversion rates per tier
6. [ ] Plan first price review for {{FIRST_PRICE_REVIEW_DATE}} (6 months post-launch)

---

*Template from the Master Starter Kit — Pricing & Monetization section*
