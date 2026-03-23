# Revenue Model Selection Guide for {{PROJECT_NAME}}

> **Product Type:** {{PRODUCT_TYPE}}
> **Target Market:** {{TARGET_MARKET}}
> **Stage:** {{STAGE}}
> **Primary Revenue Goal:** {{REVENUE_GOAL}} <!-- e.g., maximize recurring revenue, rapid user growth, cash-flow positive quickly -->

---

## Table of Contents

1. [Revenue Model Breakdown](#1-revenue-model-breakdown)
2. [Decision Matrix](#2-decision-matrix)
3. [Revenue Projection Templates](#3-revenue-projection-templates)
4. [Metrics to Track Per Model](#4-metrics-to-track-per-model)
5. [When to Pivot Revenue Models](#5-when-to-pivot-revenue-models)
6. [Common Mistakes Per Model](#6-common-mistakes-per-model)
7. [Hybrid Model Design](#7-hybrid-model-design)

---

## 1. Revenue Model Breakdown

### 1.1 SaaS Subscription

**How it works:** Customers pay a recurring fee (monthly or annually) for ongoing access to your software. If they stop paying, they lose access.

**Pros:**
- Predictable, recurring revenue (high visibility into future cash flow)
- Compounds over time — each new customer adds to your revenue base
- Easier to finance and value the business (investors love recurring revenue)
- Natural relationship with customer (ongoing engagement, not transactional)
- Supports continuous product improvement funded by recurring revenue

**Cons:**
- Slower initial revenue compared to one-time purchases
- Must continuously deliver value to prevent churn
- Requires significant investment in customer success and retention
- Monthly billing introduces payment failure risk (involuntary churn)
- Customers may experience "subscription fatigue" in crowded markets

**Key Metrics:**

| Metric | Definition | Healthy Benchmark |
|--------|-----------|-------------------|
| MRR (Monthly Recurring Revenue) | Total monthly subscription revenue | Growing month-over-month |
| ARR (Annual Recurring Revenue) | MRR × 12 | Standard valuation metric |
| Monthly churn rate | % of customers who cancel per month | < 3% for SMB, < 1% for enterprise |
| LTV (Customer Lifetime Value) | Average revenue per customer over their lifetime | > 3× CAC |
| CAC (Customer Acquisition Cost) | Total sales + marketing cost ÷ new customers | LTV/CAC > 3:1 |
| ARPA (Average Revenue Per Account) | MRR ÷ number of customers | Growing over time |
| Net Revenue Retention (NRR) | Revenue from existing customers including expansion ÷ revenue from same cohort prior period | > 100% (ideally 110-130%) |
| Months to recover CAC | CAC ÷ (ARPA × gross margin) | < 12 months |

**Best for:**
- Software tools used regularly (daily/weekly)
- Products where value accrues over time (data, content, workflows)
- B2B products with clear ROI
- Products with low marginal cost per user

**Revenue Formula:**
```
MRR = Number of paying customers × ARPA
ARR = MRR × 12
Monthly Revenue Growth = New MRR + Expansion MRR - Churned MRR - Contraction MRR
```

---

### 1.2 Freemium

**How it works:** A free tier is offered with limited functionality. Users can upgrade to a paid tier for additional features, higher limits, or premium support. The free tier serves as a top-of-funnel acquisition tool.

**Pros:**
- Massive top-of-funnel — removes friction from trying your product
- Enables viral/word-of-mouth growth (free users tell others)
- Free users can become evangelists and community contributors
- Lower customer acquisition cost (organic growth)
- Self-serve sales motion reduces need for sales team

**Cons:**
- Most free users never convert (typically 2-5% conversion rate)
- Free users still cost money to serve (infrastructure, support)
- Can be difficult to determine the right free/paid boundary
- Risk of giving away too much (no incentive to upgrade) or too little (users leave)
- Investors may scrutinize unit economics if free user costs are high

**Conversion Benchmarks:**

| Product Category | Typical Free-to-Paid Rate |
|-----------------|--------------------------|
| Consumer SaaS (Spotify, Dropbox model) | 2-5% |
| B2B SaaS (Slack, Notion model) | 5-10% |
| Developer tools | 1-5% |
| Mobile apps | 1-3% |
| Online games | 1-5% (for IAP) |

**Feature Gating Strategies:**

| Strategy | How It Works | Example |
|----------|-------------|---------|
| **Feature restriction** | Key features only in paid plans | Canva: brand kit, resize, background remover |
| **Usage limits** | Free tier has caps on usage | Mailchimp: 500 contacts free |
| **Team size limits** | Free for solo, paid for teams | Slack: 90-day message history on free |
| **Storage limits** | Free tier has storage caps | Dropbox: 2GB free, 2TB paid |
| **Branding/watermark** | Free includes your branding | Many design tools add watermarks |
| **Time-delayed features** | New features available to paid first | Some apps gate new features behind paid for 30 days |
| **Support tiers** | Community only for free, email/chat for paid | Very common across all SaaS |

**Upgrade Triggers (signals a free user is ready to pay):**
- Hits a usage limit and attempts to exceed it
- Tries to access a paid feature
- Invites team members (team plan trigger)
- Uses product consistently for 2+ weeks
- Stores significant data or content in the product (switching cost created)
- Engages with onboarding emails about paid features

**Best for:**
- Products with strong network effects (value increases with more users)
- Products where individual use leads to team adoption (bottom-up SaaS)
- Products with near-zero marginal cost per free user
- Markets where competitors offer free alternatives

---

### 1.3 One-Time Purchase

**How it works:** Customer pays once and receives the product permanently. May include time-limited support or updates.

**Pros:**
- Simple to understand and communicate
- No ongoing billing relationship to manage
- Customers prefer owning vs renting (no subscription fatigue)
- Higher upfront payment can mean faster payback on acquisition cost
- Works well for products with a clear "finished state"

**Cons:**
- No recurring revenue (must continually find new customers)
- Revenue is lumpy and unpredictable month-to-month
- Must decide: free updates forever or paid version upgrades?
- Customer relationship ends after purchase (harder to upsell)
- Lower total revenue per customer compared to subscription over time

**Key Metrics:**

| Metric | Definition | Healthy Benchmark |
|--------|-----------|-------------------|
| Units sold | Number of purchases per period | Growing or stable |
| Average selling price (ASP) | Average revenue per sale | Stable or increasing |
| Refund rate | % of purchases refunded | < 5% |
| Repeat purchase rate | % of customers who buy again (upgrades, new products) | > 20% |
| Revenue per customer (lifetime) | Total revenue from a customer across all purchases | > 1.5× first purchase |

**Version Upgrade Strategies:**
- **Free updates within major version:** v1.0 to v1.x free; v2.0 is a new purchase
- **Paid upgrade pricing:** Offer 40-60% discount for existing customers upgrading to new version
- **Annual update subscription:** Pay once for app + annual fee for updates (hybrid)

**Best for:**
- Templates, themes, design assets
- Courses and educational content
- Desktop software and utilities
- WordPress plugins and themes (though many are shifting to subscription)
- Books, ebooks, digital downloads

---

### 1.4 Usage-Based Pricing

**How it works:** Customers pay based on how much they consume. Common units: API calls, compute hours, messages sent, records processed, storage used, active users.

**Pros:**
- Aligns cost with value — customers only pay for what they use
- Low barrier to entry (start small, scale up)
- Revenue scales naturally with customer success (as they grow, you grow)
- Fair perception — customers feel they are not overpaying
- Handles variable workloads well

**Cons:**
- Unpredictable revenue (both for you and the customer)
- "Bill shock" risk — customers may get unexpectedly large bills
- Harder for customers to budget (CFOs dislike unpredictable costs)
- Requires metering infrastructure and real-time usage tracking
- Customers may throttle usage to save money (reduces engagement)

**Metering Strategies:**

| Strategy | Description | Example |
|----------|-------------|---------|
| **Pay-as-you-go** | Pure consumption billing, no commitment | AWS Lambda per invocation |
| **Committed use + overage** | Buy a block of usage; overage at higher rate | Twilio: volume pricing + per-message overage |
| **Tiered usage** | Different unit price at different volume thresholds | API pricing: first 1K calls at $0.01, next 10K at $0.005 |
| **Credit-based** | Buy credits that map to multiple usage types | Vercel, many AI platforms |
| **Hybrid (base + usage)** | Monthly base fee + usage charges | Intercom: base platform fee + per-contact fee |

**Predictable Billing Add-Ons:**
- Usage caps and alerts: Notify customers when approaching limits
- Budget limits: Allow customers to set maximum monthly spend
- Usage estimates: Show projected monthly cost based on current usage
- Prepaid blocks: Sell usage blocks at a discount for budget predictability

**Key Metrics:**

| Metric | Definition |
|--------|-----------|
| Revenue per unit | Revenue divided by units consumed |
| Usage growth rate | Month-over-month increase in consumption |
| Customer usage percentile | How much each customer uses relative to others |
| Net dollar retention | Revenue from existing customers including usage growth |
| Revenue concentration | % of revenue from top 10% of customers (risk metric) |

**Best for:**
- APIs and developer platforms
- Cloud infrastructure and compute
- Communication tools (email, SMS, messaging)
- AI/ML services (per-prediction, per-token)
- Data processing and analytics platforms

---

### 1.5 Marketplace Commission

**How it works:** You connect buyers and sellers (or service providers and consumers) and take a percentage of each transaction as commission (also called "take rate").

**Pros:**
- Revenue scales with transaction volume (no ceiling)
- Aligned incentives: you make money when your users make money
- Network effects create defensibility (more sellers → more buyers → more sellers)
- No inventory risk (you facilitate, not sell)
- Can be very high margin at scale

**Cons:**
- Chicken-and-egg problem: need both supply and demand to start
- Disintermediation risk (buyers and sellers cut you out after connecting)
- Trust and safety responsibility (reviews, disputes, fraud)
- Payment processing complexity (holding funds, payouts, tax reporting)
- Typically takes years to reach profitability

**Take Rate Benchmarks:**

| Marketplace Category | Typical Take Rate | Examples |
|---------------------|-------------------|---------|
| Physical goods (general) | 10-15% | eBay (12.9%), Etsy (6.5% + fees) |
| Handmade/artisan goods | 15-20% | Custom marketplaces |
| Digital services/freelance | 10-20% | Upwork (10%), Fiverr (20%) |
| Ride-sharing/delivery | 20-30% | Uber (25%), DoorDash (15-30%) |
| App stores | 15-30% | Apple (15-30%), Google Play (15-30%) |
| Real estate | 2-6% | Zillow, Redfin |
| Travel/hospitality | 15-25% | Airbnb (14-20%), Booking.com (15-25%) |
| Professional services | 5-15% | Toptal (premium pricing model) |

**Marketplace Monetization Beyond Commission:**
- Listing fees (charge to post)
- Featured/promoted listings (advertising)
- Seller subscription plans (monthly fee for enhanced tools)
- Buyer premium (fee added to buyer's total)
- Payment processing markup (charge above Stripe/PayPal cost)
- Data and analytics tools for sellers (premium insights)
- Insurance and protection plans

**Best for:**
- Platforms connecting two distinct user groups
- Products/services where trust is a key barrier
- Categories with fragmented supply (many small sellers)
- Markets where discovery is a core problem

---

### 1.6 Ad-Supported

**How it works:** Users access the product for free. Revenue comes from selling advertising space (display ads, native ads, sponsored content, etc.).

**Pros:**
- Product is free, maximizing user base
- Users have no payment friction
- Can generate substantial revenue at massive scale
- Well-understood model with established ad networks
- Can be combined with a premium ad-free tier

**Cons:**
- Requires enormous scale (millions of users) to generate meaningful revenue
- Degrades user experience (ads are annoying)
- Revenue per user is very low ($1-10/year for most products)
- Ad-blockers reduce revenue
- Revenue fluctuates with advertising market conditions
- Misaligned incentives (optimize for engagement/attention, not user outcomes)

**Revenue Benchmarks:**

| Metric | Consumer Web | Mobile App | Newsletter/Email |
|--------|-------------|------------|-----------------|
| CPM (cost per 1K impressions) | $1-10 | $2-15 | $10-50 |
| Revenue per user per month | $0.10-$1.00 | $0.05-$0.50 | $0.01-$0.10 per subscriber |
| Revenue per user per year | $1-$12 | $0.60-$6 | $0.12-$1.20 per subscriber |
| Users needed for $10K MRR | 120K-1.2M monthly active | 240K-2.4M monthly active | 200K-10M subscribers |

**Ad Format Options:**
- Display ads (banner, sidebar, interstitial)
- Native ads (integrated into content feed)
- Sponsored content (branded articles, posts)
- Video ads (pre-roll, mid-roll, rewarded)
- Newsletter sponsorships (embedded in email)
- Affiliate marketing (commission on referrals)

**Best for:**
- Content platforms (news, social media, media)
- Free utility apps with very high daily usage
- Products where the audience itself is the product (attention economy)
- Newsletters and content creators (sponsorship model)

**NOT recommended for:**
- B2B products (businesses expect ad-free experiences)
- Products with fewer than 100K monthly users
- Products where trust and professionalism are critical
- Tools where ads would interfere with core functionality

---

### 1.7 Hybrid Models

**How it works:** Combine two or more revenue streams to maximize total revenue and serve different customer segments.

**Common Hybrid Combinations:**

| Combination | How It Works | Examples |
|------------|-------------|---------|
| **Freemium + Subscription** | Free tier + multiple paid tiers | Spotify, Slack, Notion |
| **Subscription + Usage** | Base subscription fee + usage charges | Twilio, AWS, Intercom |
| **Subscription + Marketplace** | Platform fee + transaction commission | Shopify (subscription + payment processing %) |
| **Free (Ad-Supported) + Subscription** | Free with ads, paid removes ads + adds features | YouTube, Spotify, Hulu |
| **One-Time + Subscription** | Buy the product, subscribe for updates/support | JetBrains (annual license), some WordPress plugins |
| **Marketplace + SaaS** | Commission on transactions + seller subscription tools | Etsy (listing fees + Etsy Plus subscription) |
| **Freemium + Usage + Enterprise** | Free tier, usage billing, enterprise contracts | Many developer platforms |

**Hybrid Model Design Principles:**
1. Each revenue stream should serve a different customer segment or need
2. Revenue streams should not conflict (e.g., ad revenue vs premium ad-free tier is OK because they serve different segments)
3. Keep pricing simple even if the model is hybrid — customers should easily understand what they pay and why
4. Start with one model, add the second once the first is established

---

## 2. Decision Matrix

### Quick Decision Framework

Answer these questions to find your recommended revenue model:

**Question 1: How often will customers use your product?**
- Daily/weekly → Subscription or Freemium
- Occasionally → Usage-based or One-time
- Once → One-time purchase

**Question 2: What is your marginal cost per customer?**
- Near zero → Freemium is viable
- Low but meaningful → Subscription or Usage-based
- High per transaction → Marketplace commission or Usage-based

**Question 3: What does your target customer prefer?**
- B2B / business budgets → Subscription (annual preferred)
- Consumers → Freemium, One-time, or Ad-supported
- Developers → Freemium with generous free tier, Usage-based

**Question 4: How large is your potential user base?**
- Millions → Ad-supported is viable, Freemium works well
- Hundreds of thousands → Subscription or Freemium
- Thousands → Subscription (higher ARPA) or One-time (premium pricing)
- Hundreds → Enterprise subscription (high-touch, custom pricing)

### Product Type x Audience Decision Matrix

| Product Type | Consumer (B2C) | Small Business (SMB) | Mid-Market (B2B) | Enterprise |
|-------------|---------------|---------------------|-------------------|------------|
| **SaaS Tool** | Freemium + Sub | Sub (monthly) | Sub (annual) | Custom contract |
| **Mobile App** | Freemium / IAP | Sub (monthly) | N/A | N/A |
| **API / Dev Tool** | Free tier + Usage | Free + Usage | Usage + Sub | Enterprise contract |
| **Marketplace** | Commission | Commission + Sub | Commission + Sub | Custom |
| **Content Platform** | Ad-supported / Sub | Sub | Sub | Sub |
| **Templates/Assets** | One-time | One-time / Sub | Sub (library) | Site license |
| **Course/Education** | One-time / Sub | Sub | Per-seat license | Enterprise license |

### Recommended Model for {{PROJECT_NAME}}

Based on the analysis above:

**Primary Revenue Model:** {{PRIMARY_REVENUE_MODEL}}
**Secondary Revenue Model (if applicable):** {{SECONDARY_REVENUE_MODEL}}
**Rationale:** {{MODEL_SELECTION_RATIONALE}}

---

## 3. Revenue Projection Templates

### 3.1 SaaS Subscription Projection

```
Month 1:
  New customers:        {{M1_NEW_CUSTOMERS}}
  Churned customers:    {{M1_CHURNED}} ({{MONTHLY_CHURN_RATE}}% churn)
  Total customers:      {{M1_TOTAL_CUSTOMERS}}
  ARPA:                 ${{ARPA}}
  MRR:                  ${{M1_MRR}}

Month 6:
  New customers/month:  {{M6_NEW_CUSTOMERS}}
  Churned customers:    {{M6_CHURNED}}
  Total customers:      {{M6_TOTAL_CUSTOMERS}}
  ARPA:                 ${{ARPA}} (+ expansion)
  MRR:                  ${{M6_MRR}}

Month 12:
  New customers/month:  {{M12_NEW_CUSTOMERS}}
  Churned customers:    {{M12_CHURNED}}
  Total customers:      {{M12_TOTAL_CUSTOMERS}}
  ARPA:                 ${{M12_ARPA}}
  MRR:                  ${{M12_MRR}}
  ARR:                  ${{M12_ARR}}
```

**SaaS Revenue Formulas:**
```
MRR = Total active subscribers × ARPA
Net New MRR = New MRR + Expansion MRR - Churned MRR - Contraction MRR
ARR = MRR × 12
LTV = ARPA / Monthly Churn Rate
CAC Payback (months) = CAC / (ARPA × Gross Margin %)
```

### 3.2 Freemium Projection

```
Month 1:
  New free signups:          {{M1_FREE_SIGNUPS}}
  Free-to-paid rate:         {{FREE_TO_PAID_RATE}}%
  New paying customers:      {{M1_PAID_CONVERSIONS}}
  Paying ARPA:               ${{PAID_ARPA}}
  MRR:                       ${{M1_FREEMIUM_MRR}}
  Cost to serve free users:  ${{M1_FREE_USER_COST}}
  Net revenue:               ${{M1_NET_REVENUE}}

Month 12:
  Total free users:          {{M12_FREE_USERS}}
  Total paying customers:    {{M12_PAYING_CUSTOMERS}}
  MRR:                       ${{M12_FREEMIUM_MRR}}
  Cost to serve free users:  ${{M12_FREE_USER_COST}}
  Net revenue:               ${{M12_NET_REVENUE}}
```

**Freemium Revenue Formulas:**
```
MRR = Total paying customers × Paid ARPA
Effective ARPA (all users) = MRR / Total users (free + paid)
Cost of free users = Free users × Cost per free user per month
Net margin = (MRR - Free user costs - Other costs) / MRR
Break-even free user ratio = Paid ARPA / Cost per free user
```

### 3.3 Usage-Based Projection

```
Month 1:
  Active customers:          {{M1_ACTIVE_CUSTOMERS}}
  Average usage per customer: {{M1_AVG_USAGE}} {{USAGE_UNIT}}
  Price per {{USAGE_UNIT}}:  ${{PRICE_PER_UNIT}}
  Revenue:                   ${{M1_USAGE_REVENUE}}

Month 6:
  Active customers:          {{M6_ACTIVE_CUSTOMERS}}
  Average usage per customer: {{M6_AVG_USAGE}} {{USAGE_UNIT}}
  Revenue:                   ${{M6_USAGE_REVENUE}}

Month 12:
  Active customers:          {{M12_ACTIVE_CUSTOMERS}}
  Average usage per customer: {{M12_AVG_USAGE}} {{USAGE_UNIT}}
  Revenue:                   ${{M12_USAGE_REVENUE}}
```

**Usage-Based Revenue Formulas:**
```
Monthly Revenue = Sum of (Each customer's usage × Price per unit)
Revenue per customer = Average usage × Price per unit
Revenue growth = Customer growth + Usage growth per customer
Dollar-based retention = This period revenue from last period's customers / Last period revenue
```

### 3.4 Marketplace Projection

```
Month 1:
  GMV (Gross Merchandise Value): ${{M1_GMV}}
  Take rate:                     {{TAKE_RATE}}%
  Net revenue:                   ${{M1_MARKETPLACE_REVENUE}}
  Number of transactions:        {{M1_TRANSACTIONS}}
  Average order value:           ${{M1_AOV}}
  Active sellers:                {{M1_SELLERS}}
  Active buyers:                 {{M1_BUYERS}}

Month 12:
  GMV:                          ${{M12_GMV}}
  Net revenue:                  ${{M12_MARKETPLACE_REVENUE}}
  Active sellers:               {{M12_SELLERS}}
  Active buyers:                {{M12_BUYERS}}
  Liquidity rate:               {{M12_LIQUIDITY}}% (% of listings that result in transaction)
```

**Marketplace Revenue Formulas:**
```
Revenue = GMV × Take Rate
GMV = Number of Transactions × Average Order Value
Liquidity = Transactions / Listings
Seller economics = Average seller revenue - Commission - Payment processing
```

### 3.5 One-Time Purchase Projection

```
Month 1:
  Units sold:                {{M1_UNITS}}
  Average selling price:     ${{ASP}}
  Revenue:                   ${{M1_OTP_REVENUE}}
  Refund rate:               {{REFUND_RATE}}%
  Net revenue:               ${{M1_NET_OTP_REVENUE}}

Month 12:
  Monthly units sold:        {{M12_UNITS}}
  Total units sold (cumulative): {{M12_CUMULATIVE_UNITS}}
  Revenue (month):           ${{M12_OTP_REVENUE}}
  Revenue (cumulative):      ${{M12_CUMULATIVE_REVENUE}}
  Repeat purchase rate:      {{REPEAT_RATE}}%
```

---

## 4. Metrics to Track Per Model

### Essential Metrics by Revenue Model

| Metric | Subscription | Freemium | One-Time | Usage-Based | Marketplace | Ad-Supported |
|--------|-------------|----------|----------|-------------|-------------|-------------|
| MRR/ARR | Primary | Primary | N/A | Helpful | Helpful | Helpful |
| Monthly churn | Critical | Critical | N/A | Important | Important | N/A |
| LTV | Critical | Critical | Important | Critical | Important | Important |
| CAC | Critical | Critical | Critical | Critical | Critical | Critical |
| ARPA | Critical | Critical | N/A | Critical | Important | Important |
| Conversion rate | Trial→Paid | Free→Paid | Visit→Buy | Sign-up→Active | Sign-up→Transact | Visit→Impression |
| NRR | Critical | Important | N/A | Critical | Important | N/A |
| DAU/MAU | Important | Critical | Low priority | Important | Critical | Critical |
| GMV | N/A | N/A | N/A | N/A | Primary | N/A |
| RPU (Revenue/User) | Important | Critical | N/A | Important | Important | Primary |
| Engagement depth | Important | Critical | Low priority | Critical | Critical | Critical |

### Model-Specific KPI Dashboards

**Subscription KPI Dashboard:**
- [ ] MRR and MRR growth rate
- [ ] Churn rate (customer and revenue)
- [ ] LTV and LTV:CAC ratio
- [ ] ARPA and ARPA trend
- [ ] NRR (net revenue retention)
- [ ] Trial-to-paid conversion rate
- [ ] Annual billing percentage

**Freemium KPI Dashboard:**
- [ ] Total users (free + paid)
- [ ] Free-to-paid conversion rate
- [ ] Time to conversion (days from signup to paid)
- [ ] Feature adoption rates (free vs paid features)
- [ ] Cost per free user
- [ ] Viral coefficient (invites per user)
- [ ] Activation rate (% of signups who reach "aha moment")

**Usage-Based KPI Dashboard:**
- [ ] Total usage volume and growth
- [ ] Revenue per unit consumed
- [ ] Average usage per customer
- [ ] Usage distribution (how concentrated is usage?)
- [ ] Dollar-based net retention
- [ ] Overage frequency and revenue
- [ ] Customer usage growth rate

---

## 5. When to Pivot Revenue Models

### Signals That Your Current Model Is Not Working

| Current Model | Warning Signal | Consider Pivoting To |
|--------------|----------------|---------------------|
| **Subscription** | Churn > 5%/month, customers say "I don't use it enough" | Usage-based or lower-commitment model |
| **Subscription** | Most users on lowest tier, no upgrades | Better tier design or freemium + higher-value paid |
| **Freemium** | < 1% conversion rate after 6+ months | Reduce free tier, add trial, or go paid-only |
| **Freemium** | Free user costs eating all margin | Reduce free tier, add usage limits, add ads to free tier |
| **One-time** | Revenue declining, no repeat purchases | Subscription (content updates) or add-on model |
| **One-time** | Customers asking for ongoing features | Subscription or one-time + annual update subscription |
| **Usage-based** | Customers complaining about unpredictable bills | Add subscription tiers with included usage |
| **Usage-based** | Revenue too volatile to plan/hire | Add base subscription fee (hybrid) |
| **Marketplace** | Sellers/buyers transacting off-platform | Add more value (trust, payment, tools) or adjust take rate |
| **Ad-supported** | Revenue per user too low, can't cover costs | Add premium tier, reduce reliance on ads |

### How to Pivot Gracefully

1. **Grandfather existing customers:** Keep current pricing for existing users for 6-12 months
2. **Test with new customers first:** Apply the new model only to new signups
3. **Communicate the "why":** Explain how the new model better aligns with value delivered
4. **Offer transition incentives:** Discounts for early adoption of new pricing
5. **Monitor closely:** Track churn, NPS, and support tickets during transition
6. **Have a rollback plan:** Be prepared to revert if customer backlash is severe

---

## 6. Common Mistakes Per Model

### Subscription Mistakes

| Mistake | Why It Happens | How to Avoid |
|---------|---------------|-------------|
| Pricing too low | Fear of losing customers | Use value-based pricing; low price signals low value |
| Too many tiers | Trying to serve everyone | Start with 3 tiers; add a 4th only when enterprise demand exists |
| Annual-only billing | Want predictable revenue | Always offer monthly; use incentives for annual |
| No free trial | Fear of freeloaders | 14-day trial is standard; conversion > friction reduction |
| Ignoring involuntary churn | Don't realize cards expire | Implement dunning emails, card update reminders, retry logic |
| Same price for 2+ years | "If it ain't broke..." | Review pricing every 6-12 months; your product has improved |

### Freemium Mistakes

| Mistake | Why It Happens | How to Avoid |
|---------|---------------|-------------|
| Free tier too generous | Want to attract users | Free tier should create desire for more, not satisfy all needs |
| Free tier too restrictive | Want to force upgrades | Users will leave, not upgrade. Free must deliver real value |
| No clear upgrade path | Features randomly assigned to tiers | Map paid features to moments when users naturally need more |
| Ignoring free user costs | Focus on paying customers only | Track and manage cost per free user; set budget limits |
| No onboarding for free users | Assume users will figure it out | Free users need more onboarding, not less — guide them to "aha moment" |

### One-Time Purchase Mistakes

| Mistake | Why It Happens | How to Avoid |
|---------|---------------|-------------|
| No upsell path | "They already bought it" | Offer complementary products, premium versions, annual updates |
| Free updates forever | Customer expectation | Set clear update policy upfront (e.g., "1 year of updates included") |
| No refund policy | Fear of lost revenue | 30-day refund policy increases trust and conversions |
| Price anchored to cost | "It only took me X hours" | Price based on value to customer, not your time investment |

### Usage-Based Mistakes

| Mistake | Why It Happens | How to Avoid |
|---------|---------------|-------------|
| No spending controls | Prioritizing revenue | Offer budgets, alerts, and spending caps — builds trust |
| Confusing pricing tiers | Too many variables | Charge on one primary metric; keep the pricing calculator simple |
| No minimum / base fee | Want low barrier to entry | Small base fee ($5-20/mo) ensures revenue even from low-usage customers |
| Bill shock | Usage spikes are unpredictable | Send alerts at 50%, 80%, 100% of typical usage; offer caps |

### Marketplace Mistakes

| Mistake | Why It Happens | How to Avoid |
|---------|---------------|-------------|
| Take rate too high early | Maximizing revenue | Start low (5-10%) to attract supply; increase as value increases |
| Ignoring payment complexity | Underestimate effort | Use Stripe Connect, PayPal for Marketplaces, or similar from day one |
| Not preventing disintermediation | Trust users | Add ongoing value (payment protection, dispute resolution, reviews) |
| Launching both sides simultaneously | Marketplace theory | Seed one side first (usually supply); use manual/concierge to start |

---

## 7. Hybrid Model Design

### When to Add a Second Revenue Stream

Add a second revenue stream when:
- [ ] Your primary model is established and stable (12+ months)
- [ ] You have identified a segment willing to pay differently
- [ ] Adding a stream does not cannibalize your primary revenue
- [ ] You have operational capacity to manage billing complexity
- [ ] The new stream addresses a specific limitation of your current model

### Hybrid Model Design Template for {{PROJECT_NAME}}

**Primary Revenue Stream:**
- Model: {{PRIMARY_REVENUE_MODEL}}
- Target segment: {{PRIMARY_SEGMENT}}
- Estimated % of total revenue: {{PRIMARY_REVENUE_PCT}}%

**Secondary Revenue Stream:**
- Model: {{SECONDARY_REVENUE_MODEL}}
- Target segment: {{SECONDARY_SEGMENT}}
- Estimated % of total revenue: {{SECONDARY_REVENUE_PCT}}%

**How they interact:**
- {{INTERACTION_DESCRIPTION}} <!-- e.g., "Free users see ads; paid subscribers have ad-free experience" -->

**Potential conflicts to manage:**
- {{CONFLICT_1}} <!-- e.g., "Usage-based billing may discourage exploration that leads to upgrades" -->
- {{CONFLICT_2}}

### Revenue Model Evolution Path for {{PROJECT_NAME}}

```
Stage 1 (0-6 months): {{STAGE_1_MODEL}}
  → Focus on: Acquiring initial users, validating product-market fit
  → Revenue target: ${{STAGE_1_TARGET}} MRR

Stage 2 (6-18 months): {{STAGE_2_MODEL}}
  → Focus on: Optimizing conversion, adding paid tiers
  → Revenue target: ${{STAGE_2_TARGET}} MRR

Stage 3 (18-36 months): {{STAGE_3_MODEL}}
  → Focus on: Expansion revenue, enterprise, international
  → Revenue target: ${{STAGE_3_TARGET}} MRR

Stage 4 (36+ months): {{STAGE_4_MODEL}}
  → Focus on: Market leadership, platform ecosystem, M&A readiness
  → Revenue target: ${{STAGE_4_TARGET}} MRR
```

---

## Revenue Model Selection Summary

| Decision | Choice |
|----------|--------|
| **Primary revenue model** | {{PRIMARY_REVENUE_MODEL}} |
| **Secondary revenue model** | {{SECONDARY_REVENUE_MODEL}} |
| **Target ARPA** | ${{TARGET_ARPA}} |
| **12-month MRR target** | ${{TARGET_MRR}} |
| **Key metric to optimize** | {{KEY_METRIC}} |
| **Biggest risk** | {{BIGGEST_RISK}} |
| **Model review date** | {{MODEL_REVIEW_DATE}} |

---

## Next Steps

1. [ ] Complete the [Pricing Strategy](./pricing-strategy.template.md) template with specific prices
2. [ ] If using freemium, complete the [Freemium Optimization](./freemium-optimization.md) guide
3. [ ] If using trials, complete the [Trial Optimization](./trial-optimization.md) guide
4. [ ] Build revenue projections in a spreadsheet using the formulas above
5. [ ] Set up billing infrastructure (Stripe, Paddle, LemonSqueezy, or equivalent)
6. [ ] Define and instrument your key metrics dashboard
7. [ ] Schedule first revenue model review for {{MODEL_REVIEW_DATE}}

---

*Template from the Master Starter Kit — Pricing & Monetization section*
