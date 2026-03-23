# Retention Metrics and Analysis Playbook

> A comprehensive guide to measuring, analyzing, and improving user retention -- the metric that separates products that grow from products that churn themselves to death.

---

## Why Retention Is the Only Metric That Matters

Retention is the foundation of sustainable growth. You can acquire millions of users, but if they do not stick around, you are filling a leaky bucket. Every dollar spent on acquisition is wasted if users leave.

**The retention equation:**
- Good retention + good acquisition = exponential growth
- Good retention + bad acquisition = slow but sustainable growth
- Bad retention + good acquisition = expensive treadmill (you will burn out)
- Bad retention + bad acquisition = death

Retention also compounds. A 5% improvement in monthly retention can double lifetime value over 12 months.

---

## Core Retention Metrics

### Day N Retention

The percentage of users who return to your product N days after their first use.

```
Day N Retention = (Users active on Day N / Users who signed up on Day 0) x 100

Common intervals:
- Day 1 retention:  "Did they come back the next day?"
- Day 7 retention:  "Did they come back after a week?"
- Day 14 retention: "Are they forming a habit?"
- Day 30 retention: "Are they a retained user?"
- Day 60 retention: "Are they a loyal user?"
- Day 90 retention: "Are they a long-term user?"
```

**Benchmarks by product type:**

| Product Type | Day 1 | Day 7 | Day 30 | Day 90 |
|-------------|-------|-------|--------|--------|
| B2B SaaS | 40-60% | 30-50% | 20-35% | 15-25% |
| B2C SaaS | 25-40% | 15-25% | 8-15% | 5-10% |
| Mobile (social) | 30-50% | 15-30% | 8-15% | 5-10% |
| Mobile (utility) | 25-40% | 10-20% | 5-12% | 3-8% |
| Mobile (gaming) | 30-45% | 10-20% | 3-8% | 1-5% |
| E-commerce | 15-25% | 5-15% | 3-8% | 2-5% |
| Marketplace | 20-35% | 10-20% | 5-12% | 3-8% |

### Weekly and Monthly Retention

For products with less frequent usage patterns, daily metrics can be misleading.

```
Weekly retention = (Users active in Week N / Users who signed up in Week 0) x 100

Monthly retention = (Users active in Month N / Users who signed up in Month 0) x 100

"Active" definition for your product:
- Minimum: Logged in
- Better: Performed a meaningful action
- Best: Completed a core workflow
```

**Define "active" carefully.** A login alone is weak. Define active as performing a meaningful action that demonstrates the user is getting value.

### Revenue Retention

For subscription businesses, revenue retention matters more than user count retention.

**Gross Revenue Retention (GRR):**
```
GRR = (Starting MRR - Churn MRR - Contraction MRR) / Starting MRR x 100

GRR excludes expansion revenue. It measures how well you keep existing revenue.
GRR can never exceed 100%.

Benchmarks:
- Best in class: >95%
- Good: 85-95%
- Concerning: 75-85%
- Critical: <75%
```

**Net Revenue Retention (NRR):**
```
NRR = (Starting MRR - Churn MRR - Contraction MRR + Expansion MRR) / Starting MRR x 100

NRR includes expansion (upgrades, add-ons, seat additions).
NRR can exceed 100% (net negative churn).

Benchmarks:
- Best in class: >130% (Snowflake, Twilio, Datadog)
- Excellent: 110-130%
- Good: 100-110%
- Concerning: 90-100%
- Critical: <90%
```

**Key insight:** NRR > 100% means your existing customers are growing faster than they are churning. This is the hallmark of a world-class SaaS business.

---

## Cohort Analysis

Cohort analysis is the most important retention analysis technique. It groups users by when they signed up and tracks their behavior over time.

### Building a Cohort Retention Table

```
         Month 0  Month 1  Month 2  Month 3  Month 4  Month 5  Month 6
Jan '25   1000     450      380      340      310      290      275
          100%     45%      38%      34%      31%      29%      27.5%

Feb '25   1200     540      460      410      375      350
          100%     45%      38.3%    34.2%    31.3%    29.2%

Mar '25   1100     550      480      430      400
          100%     50%      43.6%    39.1%    36.4%

Apr '25   1300     715      620      565
          100%     55%      47.7%    43.5%

May '25   1400     770      680
          100%     55%      48.6%

Jun '25   1500     825
          100%     55%
```

### Interpreting Cohort Curves

**What to look for:**

1. **Flattening curve:** The retention curve levels off and stops declining. This indicates product-market fit -- you have found a stable base of users who stick around indefinitely. This is the most important signal in cohort analysis.

2. **Improving cohorts:** Newer cohorts retain better than older ones at the same age. This means your product or onboarding is getting better over time. This is what you want to see.

3. **Declining cohorts:** Newer cohorts are worse than older ones. Your product is getting worse or you are attracting lower-quality users. Investigate immediately.

4. **Steep early drop, then flat:** You lose a lot of users quickly but the survivors stay forever. Focus on improving early retention (onboarding, activation).

5. **Gradual decline with no flattening:** Users are leaving at a steady rate and never stabilize. You may not have product-market fit yet.

### Cohort Comparison

Compare cohorts to understand what is working.

```
Cohort A (pre-onboarding change):  Day 30 retention = 22%
Cohort B (post-onboarding change): Day 30 retention = 31%

Lift: +9 percentage points (41% relative improvement)

Statistical significance: Yes (p < 0.05 with sample sizes >500)
```

### Segmented Cohort Analysis

Break cohorts down by meaningful segments to find patterns.

| Segment | Day 1 | Day 7 | Day 30 | Insight |
|---------|-------|-------|--------|---------|
| Organic traffic | 50% | 38% | 28% | Best quality users |
| Paid ads (Google) | 40% | 28% | 18% | Decent quality |
| Paid ads (Social) | 35% | 20% | 10% | Lower intent traffic |
| Referral | 55% | 42% | 32% | Highest quality |
| Product Hunt launch | 30% | 15% | 5% | Tourists, not target users |

---

## Customer Lifetime Value (LTV / CLV)

### Simple LTV Calculation

```
LTV = ARPU x Average Customer Lifespan

Where:
  ARPU = Average Revenue Per User (monthly)
  Average Customer Lifespan = 1 / Monthly Churn Rate

Example:
  ARPU = $50/month
  Monthly churn = 5%
  Average lifespan = 1 / 0.05 = 20 months
  LTV = $50 x 20 = $1,000
```

### Advanced LTV Calculation

Include gross margin and expansion revenue for a more accurate picture.

```
LTV = (ARPU x Gross Margin %) x (1 / Monthly Churn Rate)

With expansion:
LTV = ((ARPU x Gross Margin %) x (1 / Monthly Churn Rate)) x NRR/100

Example:
  ARPU = $50/month
  Gross margin = 80%
  Monthly churn = 5%
  NRR = 110%
  LTV = ($50 x 0.80) x (1 / 0.05) x 1.10
  LTV = $40 x 20 x 1.10
  LTV = $880

Compare to the simple calculation of $1,000 — the gross margin and expansion
offset each other in this example. Adjust for your actual numbers.
```

### LTV:CAC Ratio

```
LTV:CAC = Customer Lifetime Value / Customer Acquisition Cost

Benchmarks:
- <1:1   — Losing money on every customer (unsustainable)
- 1:1    — Breaking even (still unsustainable due to operating costs)
- 2:1    — Marginal (need to improve retention or reduce CAC)
- 3:1    — Healthy (industry standard target)
- 5:1+   — Excellent (consider investing more in acquisition)

Also measure:
CAC Payback Period = CAC / (ARPU x Gross Margin)
Target: <12 months for SMB, <18 months for mid-market, <24 months for enterprise
```

---

## Engagement Metrics

### DAU/MAU Ratio (Stickiness)

```
Stickiness = DAU / MAU x 100

Where:
  DAU = Daily Active Users (unique users on a given day)
  MAU = Monthly Active Users (unique users in a 28-day period)

Interpretation:
  50%+:  Exceptional — users engage almost daily (messaging, social)
  25-50%: Good — regular engagement (productivity, project management)
  15-25%: Okay — periodic engagement (analytics, reporting)
  <15%:  Low — infrequent engagement (seasonal, utility)

Note: Stickiness is not inherently good or bad — it depends on your
product's natural usage cadence. A tax tool used once a year can be
wildly successful with 5% stickiness.
```

### Feature Adoption Rate

```
Feature Adoption Rate = (Users who used Feature X / Total active users) x 100

Track for all major features:

Feature              | Adoption Rate | Usage Frequency | Impact on Retention
---------------------+---------------+-----------------+--------------------
{{FEATURE_1}}        |          %    | Daily/Weekly    | High/Medium/Low
{{FEATURE_2}}        |          %    | Daily/Weekly    | High/Medium/Low
{{FEATURE_3}}        |          %    | Daily/Weekly    | High/Medium/Low
{{FEATURE_4}}        |          %    | Daily/Weekly    | High/Medium/Low
{{FEATURE_5}}        |          %    | Daily/Weekly    | High/Medium/Low

Look for features with high impact on retention but low adoption —
these are your biggest improvement opportunities.
```

### Session Frequency and Duration

```
Session Frequency:
  Average sessions per user per week: ____
  Median sessions per user per week: ____
  Distribution:
    1 session/week:   ____% of users
    2-3 sessions/week: ____% of users
    4-5 sessions/week: ____% of users
    Daily:            ____% of users

Session Duration:
  Average session duration: ____ minutes
  Median session duration:  ____ minutes
  Distribution:
    <1 minute:   ____% (bounced or quick check)
    1-5 minutes: ____% (light engagement)
    5-15 minutes: ____% (moderate engagement)
    15-30 minutes: ____% (deep engagement)
    30+ minutes: ____% (power users)
```

### Power User Identification

```
Power users = Top 10% of users by activity volume

Identify power users by:
  - Session frequency (top decile)
  - Feature breadth (uses 80%+ of features)
  - Content/data volume (creates the most)
  - Team engagement (invites and collaborates most)

Power user characteristics:
  Average sessions/week: ____
  Average features used: ____
  Average session duration: ____ minutes
  Typical workflow: ____________________________
  Common job title/role: ______________________

Why this matters:
  - Power users show you what great engagement looks like
  - Their workflows inform onboarding design for new users
  - They are your best candidates for testimonials and referrals
  - Losing a power user is a strong churn signal for their team
```

---

## Retention Improvement Levers

### Lever 1: Onboarding Optimization (Biggest Impact for Early Retention)

| Tactic | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Reduce time-to-value | Day 1 retention +10-30% | Medium | Highest |
| Add setup checklist | Activation +15-25% | Low | High |
| Personalize by user role | Day 7 retention +10-20% | Medium | High |
| Provide sample data/templates | First action rate +20-40% | Low | High |
| Add email onboarding sequence | Day 7 retention +5-15% | Low | Medium |

### Lever 2: Feature Adoption Campaigns (Increase Stickiness)

| Tactic | Impact | Effort | Priority |
|--------|--------|--------|----------|
| In-app feature announcements | Feature adoption +10-20% | Low | High |
| Contextual feature tips (tooltips) | Feature discovery +15-30% | Medium | High |
| Feature-specific email campaigns | Adoption +5-10% | Low | Medium |
| Power user webinars/tutorials | Engagement depth +10% | Medium | Medium |
| Gamification (badges, streaks) | DAU/MAU +5-15% | Medium | Medium |

### Lever 3: Community Building (Social Retention)

| Tactic | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Community space (Slack/Discord) | Day 90 retention +10-20% | Medium | High |
| User-generated content features | Engagement +15-25% | High | Medium |
| Public showcase/gallery | Motivation and inspiration | Low | Medium |
| Community events (webinars, AMAs) | NPS +5-10 points | Medium | Medium |
| User champions program | Advocacy + retention | Medium | Low (later stage) |

### Lever 4: Communication Cadence (Stay Top of Mind)

| Tactic | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Weekly summary email | Re-engagement +10-15% | Low | High |
| Personalized recommendations | CTR +20-30% | Medium | High |
| Product update changelog | User awareness +15% | Low | Medium |
| Educational content series | Brand affinity +10% | Medium | Medium |
| Seasonal/holiday campaigns | Short-term engagement spike | Low | Low |

### Lever 5: Product Improvements from Feedback

| Tactic | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Fix top 3 detractor complaints | NPS +10-20 points | Varies | Highest |
| Build top 3 requested features | Passive → Promoter conversion | High | High |
| Performance improvements | Session duration +10-20% | Medium | High |
| Mobile experience improvements | Mobile DAU +15-30% | High | Medium |
| Reliability and uptime | Trust and retention | Ongoing | Always |

---

## Retention Benchmarks by Product Type

### SaaS B2B

```
Month 1:  80-90% (logo), 90-95% (revenue)
Month 3:  70-80% (logo), 85-90% (revenue)
Month 6:  60-70% (logo), 80-85% (revenue)
Month 12: 50-65% (logo), 75-85% (revenue)

Best-in-class annual NRR: 120-140%
Typical annual NRR: 100-115%
```

### SaaS B2C

```
Month 1:  60-75%
Month 3:  40-55%
Month 6:  30-45%
Month 12: 20-35%

Higher churn is normal for B2C — lower switching costs and
price sensitivity. Focus on habit formation and value delivery.
```

### Mobile App

```
Day 1:   25-40%
Day 7:   12-25%
Day 30:  5-15%
Day 90:  2-8%

Mobile retention is naturally lower due to app overload.
Top apps (social, messaging) perform 2-3x above these benchmarks.
```

### Marketplace

```
Buyer retention (monthly): 20-40%
Seller retention (monthly): 60-80%

Marketplace retention depends heavily on:
- Supply quality and liquidity
- Transaction frequency (daily vs monthly vs yearly)
- Network effects strength
- Switching costs
```

---

## Monthly Retention Dashboard

### Reporting Template

```
{{PROJECT_NAME}} Retention Report — {{MONTH}} {{YEAR}}

EXECUTIVE SUMMARY:
Overall retention trend: Improving / Stable / Declining
Key wins this month: ________________________________
Key concerns: ______________________________________
Top priority for next month: ________________________

CORE METRICS:
                    This Month   Last Month   3-Month Avg   Target
Day 1 Retention:    ____%        ____%        ____%         ____%
Day 7 Retention:    ____%        ____%        ____%         ____%
Day 30 Retention:   ____%        ____%        ____%         ____%
Monthly Churn Rate: ____%        ____%        ____%         ____%
NRR:                ____%        ____%        ____%         ____%
GRR:                ____%        ____%        ____%         ____%
DAU/MAU:            ____%        ____%        ____%         ____%

COHORT PERFORMANCE:
[Insert cohort table from this month]

LTV METRICS:
ARPU:                $____
Average lifespan:    ____ months
Simple LTV:          $____
LTV:CAC ratio:       ____:1
CAC payback period:  ____ months

FEATURE ADOPTION:
[Top 5 features by adoption rate]
[Bottom 5 features by adoption rate]
[Features most correlated with retention]

ENGAGEMENT:
Avg sessions/user/week: ____
Avg session duration:   ____ min
Power users (top 10%):  ____ users

CHURN ANALYSIS:
Users churned this month: ____
Revenue churned: $____
Top churn reasons (from exit surveys):
1. ____________________ (____%)
2. ____________________ (____%)
3. ____________________ (____%)

ACTIONS TAKEN:
- ____________________________________________
- ____________________________________________
- ____________________________________________

PLAN FOR NEXT MONTH:
- ____________________________________________
- ____________________________________________
- ____________________________________________
```

---

## Tool Recommendations

### Retention Analytics Platforms

| Tool | Best For | Starting Price | Key Feature |
|------|----------|---------------|-------------|
| **Mixpanel** | Event-based analytics, funnels, retention | Free tier (up to 20M events) | Retention and funnel reports |
| **Amplitude** | Product analytics, cohort analysis | Free tier (up to 10M events) | Behavioral cohorts, pathfinding |
| **PostHog** | Open-source product analytics | Free (self-hosted), cloud free tier | Session recording + analytics |
| **Google Analytics 4** | Website + basic app analytics | Free | Cohort analysis, predictions |
| **Heap** | Auto-capture event analytics | Custom pricing | Retroactive analytics |
| **Pendo** | Product analytics + in-app guides | Custom pricing | Analytics + onboarding tools |
| **ChartMogul** | Subscription revenue analytics | $100/mo | MRR, churn, LTV, cohorts |
| **ProfitWell** | Free subscription metrics | Free | MRR, churn, benchmarks |
| **Baremetrics** | Subscription analytics dashboard | $108/mo | Revenue metrics, forecasting |

### Recommendation by Stage

```
Pre-PMF (0-100 users):
  → Google Analytics 4 (free) + manual cohort analysis in spreadsheet
  → Add PostHog or Mixpanel free tier for event tracking

Post-PMF (100-1000 users):
  → Mixpanel or Amplitude free tier for product analytics
  → ChartMogul or ProfitWell for revenue metrics
  → Start building retention dashboards

Growth (1000+ users):
  → Paid Mixpanel/Amplitude for advanced cohort analysis
  → ChartMogul + ProfitWell for revenue metrics
  → Custom dashboards in Looker/Metabase for executive reporting

Scale (10,000+ users):
  → Full analytics stack: Segment (data layer) + Amplitude/Mixpanel (product)
    + ChartMogul (revenue) + custom warehouse (BigQuery/Snowflake)
```

---

*Retention is not a one-time fix -- it is a continuous practice. Review this playbook monthly, update your benchmarks quarterly, and invest consistently in the levers that drive long-term engagement.*
