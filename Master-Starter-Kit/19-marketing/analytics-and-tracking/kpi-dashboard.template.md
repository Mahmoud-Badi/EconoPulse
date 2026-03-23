# KPI Dashboard & Metrics Framework for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Stage:** {{CURRENT_STAGE}}
> **Monetization:** {{MONETIZATION_MODEL}}
> **Date:** {{DATE}}

---

## KPI Framework: Focus on What Matters at Your Stage

The number one analytics mistake founders make is tracking everything. At each stage, you should obsess over 3-5 metrics. Everything else is noise.

**The Rule:** If a metric does not change your next action, stop looking at it.

---

## Pre-Launch KPIs

**Stage:** You are building the product and warming up your audience. You do not have paying customers yet.

**Focus:** Am I building something people want? Can I reach my target audience?

### Key Metrics

| KPI | Definition | Target | How to Track |
|-----|-----------|--------|-------------|
| **Waitlist Signups** | Total number of people who signed up for early access | 500-1,000 before launch | Email tool (ConvertKit, Mailchimp) |
| **Email List Growth Rate** | New subscribers per week ÷ total subscribers | 10-20% weekly growth | Email tool |
| **Website Traffic** | Unique visitors per week to your landing page | 200-500/week | GA4 |
| **Landing Page Conversion Rate** | Visitors who sign up ÷ total visitors | 10-30% (varies by source) | GA4 (signup event ÷ users) |
| **Content Engagement** | Blog views, social shares, comments | Growing week-over-week | GA4 + social analytics |
| **Social Followers** | Total followers across primary channels | Depends on niche — focus on growth rate | Social platform analytics |
| **Referral Rate** | % of signups that came from existing signups sharing | 5-15% | UTM tracking or referral tool |

### Pre-Launch Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRE-LAUNCH DASHBOARD                         │
│                    Week of: __________                          │
├─────────────────────┬──────────┬──────────┬────────────────────┤
│ Metric              │ This Wk  │ Last Wk  │ Change             │
├─────────────────────┼──────────┼──────────┼────────────────────┤
│ Waitlist Total      │ ______   │ ______   │ +____ (___%)       │
│ New Signups (week)  │ ______   │ ______   │ +/- ____           │
│ Website Visitors    │ ______   │ ______   │ +/- ____           │
│ Landing Conv. Rate  │ _____%   │ _____%   │ +/- ____%         │
│ Email Open Rate     │ _____%   │ _____%   │ +/- ____%         │
│ Social Followers    │ ______   │ ______   │ +____ (___%)       │
│ Top Traffic Source   │ ______   │ ______   │                    │
└─────────────────────┴──────────┴──────────┴────────────────────┘
```

---

## Launch Phase KPIs (Month 1-2)

**Stage:** You have shipped. Real people are using the product. Focus shifts from interest to activation and early revenue.

**Focus:** Are people signing up? Are they getting value? Will they pay?

### Key Metrics

| KPI | Definition | Target | How to Track |
|-----|-----------|--------|-------------|
| **Total Signups** | Cumulative users who created an account | 100-500 in month 1 | Product analytics |
| **Daily/Weekly Signups** | New accounts per day/week | Growing week-over-week | Product analytics |
| **Activation Rate** | % of signups who reach the "aha moment" | 20-40% | Product analytics (custom event) |
| **Daily Active Users (DAU)** | Unique users who use the product each day | Growing, DAU/MAU > 20% | Product analytics |
| **Weekly Active Users (WAU)** | Unique users per week | Growing | Product analytics |
| **Trial-to-Paid Conversion** | % of trial users who become paying customers | 5-15% for self-serve, 20-40% for sales-assisted | Stripe + product analytics |
| **Initial Revenue** | Total revenue generated | Any revenue = validation | Stripe dashboard |
| **NPS (first cohort)** | Net Promoter Score from first users | > 30 is good, > 50 is great | Survey tool |

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS-Specific Launch Targets:**
| Metric | Minimum Viable | Good | Great |
|--------|---------------|------|-------|
| Signups (month 1) | 100 | 300 | 1,000+ |
| Activation rate | 15% | 30% | 50%+ |
| Trial → Paid | 3% | 8% | 15%+ |
| MRR (month 1) | $100 | $500 | $2,000+ |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "e-commerce" -->
**E-commerce-Specific Launch Targets:**
| Metric | Minimum Viable | Good | Great |
|--------|---------------|------|-------|
| Orders (month 1) | 20 | 100 | 500+ |
| Average order value | $____ | $____ | $____ |
| Repeat purchase rate (60 days) | 10% | 20% | 35%+ |
| Revenue (month 1) | $500 | $5,000 | $25,000+ |
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "marketplace" -->
**Marketplace-Specific Launch Targets:**
| Metric | Minimum Viable | Good | Great |
|--------|---------------|------|-------|
| Supply-side listings | 50 | 200 | 1,000+ |
| Demand-side users | 100 | 500 | 2,000+ |
| Transactions (month 1) | 10 | 50 | 200+ |
| GMV (month 1) | $1,000 | $10,000 | $50,000+ |
<!-- ENDIF -->

### Launch Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                     LAUNCH DASHBOARD                            │
│                     Week of: __________                         │
├─────────────────────┬──────────┬──────────┬────────────────────┤
│ Metric              │ This Wk  │ Last Wk  │ Target             │
├─────────────────────┼──────────┼──────────┼────────────────────┤
│ New Signups         │ ______   │ ______   │ ______             │
│ Total Users         │ ______   │ ______   │ ______             │
│ Activation Rate     │ _____%   │ _____%   │ _____%            │
│ DAU / WAU           │ __/__    │ __/__    │ __/__              │
│ Trial→Paid Conv.    │ _____%   │ _____%   │ _____%            │
│ Revenue (week)      │ $______  │ $______  │ $______            │
│ Revenue (cumulative)│ $______  │ $______  │ $______            │
│ NPS Score           │ ______   │ ______   │ > 30               │
└─────────────────────┴──────────┴──────────┴────────────────────┘
```

---

## Growth Phase KPIs (Month 3-6)

**Stage:** You have product-market fit signals. Now you are optimizing the engine — acquiring more customers efficiently and retaining them.

**Focus:** Unit economics, channel efficiency, and retention.

### Revenue Metrics

| KPI | Definition | Formula | Target |
|-----|-----------|---------|--------|
| **MRR** | Monthly Recurring Revenue | Sum of all active subscription values | Growing 15-30% month-over-month |
| **ARR** | Annual Recurring Revenue | MRR × 12 | Useful for annual planning and investor conversations |
| **MRR Growth Rate** | Month-over-month MRR change | (MRR this month - MRR last month) ÷ MRR last month | 15-30% early stage |
| **New MRR** | Revenue from new customers this month | Sum of first payments from new customers | Growing |
| **Expansion MRR** | Revenue increase from existing customers | Upgrades + additional seats/usage this month | Growing (ideally > churn MRR) |
| **Contraction MRR** | Revenue decrease from downgrades | Sum of downgrade value this month | Minimize |
| **Churned MRR** | Revenue lost from cancelled customers | Sum of cancelled subscription values | < 5% of total MRR monthly |
| **Net Revenue Retention (NRR)** | Do existing customers spend more or less over time? | (Starting MRR + Expansion - Contraction - Churn) ÷ Starting MRR | > 100% (means growth from existing customers alone) |

### Customer Acquisition Metrics

| KPI | Definition | Formula | Target |
|-----|-----------|---------|--------|
| **CAC** | Customer Acquisition Cost | Total marketing + sales spend ÷ new customers acquired | Depends on LTV (target LTV:CAC > 3:1) |
| **LTV** | Lifetime Value of a customer | ARPU × (1 ÷ monthly churn rate) | > 3× CAC |
| **LTV:CAC Ratio** | Return on customer acquisition investment | LTV ÷ CAC | > 3:1 is healthy, > 5:1 means you can spend more |
| **Payback Period** | Months to recoup CAC | CAC ÷ ARPU | < 12 months (< 6 months is great) |
| **CAC by Channel** | Acquisition cost per marketing channel | Channel spend ÷ customers from that channel | Varies — compare to identify most efficient |

### Retention Metrics

| KPI | Definition | Formula | Target |
|-----|-----------|---------|--------|
| **Monthly Churn Rate** | % of customers who cancel each month | Customers lost ÷ customers at start of month | < 5% monthly (< 2% is great) |
| **Annual Churn Rate** | % of customers lost over a year | 1 - (1 - monthly churn)^12 | < 30% (< 10% is great) |
| **Cohort Retention** | Retention rate by signup cohort over time | % of cohort still active at month 1, 2, 3, etc. | Flattening curve (not continuously dropping) |
| **DAU/MAU Ratio** | Daily engagement intensity | Daily Active Users ÷ Monthly Active Users | > 20% (> 40% for daily-use products) |

### Marketing Metrics

| KPI | Definition | Target |
|-----|-----------|--------|
| **Traffic Growth** | Month-over-month unique visitors increase | 20-50% monthly |
| **Organic Traffic %** | Portion of traffic from SEO | Growing toward 40-60% |
| **Conversion Rate** | Visitors → signups | 2-5% (varies by channel) |
| **Email List Size** | Total subscribers | Growing 10%+ monthly |
| **Email Engagement** | Open rate, click rate | Opens > 25%, Clicks > 3% |
| **Social Engagement Rate** | Likes + comments + shares ÷ followers | > 2% on Twitter/LinkedIn, > 1% on Instagram |

### Growth Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GROWTH DASHBOARD                                 │
│                        Month: __________                                │
├────────────────────────┬──────────┬──────────┬──────────┬──────────────┤
│ REVENUE                │ This Mo  │ Last Mo  │ Change   │ Target       │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ MRR                    │ $______  │ $______  │ +____%   │ $______      │
│ New MRR                │ $______  │ $______  │ +____%   │ $______      │
│ Expansion MRR          │ $______  │ $______  │          │ $______      │
│ Churned MRR            │ $______  │ $______  │          │ < $______    │
│ Net Revenue Retention  │ _____%   │ _____%   │          │ > 100%       │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ ACQUISITION            │          │          │          │              │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ New Customers          │ ______   │ ______   │ +____%   │ ______       │
│ CAC                    │ $______  │ $______  │          │ < $______    │
│ LTV                    │ $______  │ $______  │          │ > $______    │
│ LTV:CAC                │ ____:1   │ ____:1   │          │ > 3:1        │
│ Payback Period         │ ____ mo  │ ____ mo  │          │ < 12 mo      │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ RETENTION              │          │          │          │              │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Monthly Churn Rate     │ _____%   │ _____%   │          │ < 5%         │
│ DAU/MAU                │ _____%   │ _____%   │          │ > 20%        │
│ NPS Score              │ ______   │ ______   │          │ > 40         │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ MARKETING              │          │          │          │              │
├────────────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Website Traffic        │ ______   │ ______   │ +____%   │ ______       │
│ Signup Conversion Rate │ _____%   │ _____%   │          │ > ____%      │
│ Email List Size        │ ______   │ ______   │ +____%   │ ______       │
│ Top Channel by Conv.   │ ______   │ ______   │          │              │
└────────────────────────┴──────────┴──────────┴──────────┴──────────────┘
```

---

## Scale Phase KPIs (Month 6+)

**Stage:** You have a working growth engine. Now optimize unit economics, find leverage, and scale what works.

**Focus:** Efficiency, profitability, and sustainable growth.

### Unit Economics

| KPI | Definition | Formula | Healthy Target |
|-----|-----------|---------|---------------|
| **Fully Loaded CAC** | True cost including salaries, tools, overhead | (All sales + marketing cost) ÷ new customers | Depends on LTV |
| **Gross Margin** | Revenue minus cost of goods sold | (Revenue - COGS) ÷ Revenue | > 70% for SaaS, > 40% for e-commerce |
| **Contribution Margin** | Revenue minus variable costs per customer | (ARPU - variable cost per customer) ÷ ARPU | Positive and growing |
| **Payback Period** | Months to recover CAC from a customer | CAC ÷ (ARPU × Gross Margin) | < 12 months |

### Channel Efficiency

| Channel | Spend | Customers | CAC | LTV | LTV:CAC | ROAS | Action |
|---------|-------|-----------|-----|-----|---------|------|--------|
| Organic Search | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Paid Search | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Social (Organic) | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Social (Paid) | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Email | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Content | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Referral | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |
| Partnerships | $____ | ____ | $____ | $____ | ____:1 | ____x | Scale / Maintain / Cut |

### Advanced Retention

| KPI | Definition | Target |
|-----|-----------|--------|
| **Cohort Retention Curves** | Retention plotted by signup month | Curves should flatten (not continuously decline) |
| **NPS Trend** | NPS score over time | Stable or improving |
| **Feature Adoption Rate** | % of users who use key features | > 60% for core features |
| **Logo Retention** | % of customer accounts retained (ignoring revenue) | > 85% annually |
| **Dollar Retention (NRR)** | Revenue retained from existing customers | > 110% (means net expansion) |

### Revenue at Scale

| KPI | Definition | Target |
|-----|-----------|--------|
| **ARR Growth Rate** | Year-over-year ARR change | > 100% in early stages, > 40% at scale |
| **Average Revenue Per Account (ARPA)** | MRR ÷ total customers | Growing (means upselling works) |
| **MRR Waterfall** | New + Expansion - Contraction - Churn = Net MRR change | Net positive every month |
| **Revenue per Employee** | ARR ÷ full-time employees | > $100K/employee is healthy |

---

## Dashboard Templates

### Executive Summary (5 Numbers)

The CEO dashboard. Five numbers that tell the whole story:

| Metric | Value | Trend | Status |
|--------|-------|-------|--------|
| **MRR** | $_________ | ↑↓→ | On Track / At Risk |
| **MRR Growth Rate** | ________% | ↑↓→ | On Track / At Risk |
| **CAC** | $_________ | ↑↓→ | On Track / At Risk |
| **LTV:CAC** | _____:1 | ↑↓→ | On Track / At Risk |
| **Monthly Churn** | ________% | ↑↓→ | On Track / At Risk |

### Marketing Dashboard

| Metric | This Month | Last Month | Target | Status |
|--------|-----------|------------|--------|--------|
| Website Traffic (unique) | ______ | ______ | ______ | |
| Traffic Growth Rate | _____% | _____% | > 15% | |
| Top Channel | ______ | ______ | | |
| New Signups | ______ | ______ | ______ | |
| Signup Conversion Rate | _____% | _____% | > 3% | |
| CAC (blended) | $______ | $______ | < $______ | |
| CAC (organic) | $______ | $______ | | |
| CAC (paid) | $______ | $______ | | |
| Email List Size | ______ | ______ | ______ | |
| Email Open Rate | _____% | _____% | > 25% | |
| Email Click Rate | _____% | _____% | > 3% | |
| Social Engagement Rate | _____% | _____% | > 2% | |

### Product Dashboard

| Metric | This Month | Last Month | Target | Status |
|--------|-----------|------------|--------|--------|
| Total Users | ______ | ______ | ______ | |
| DAU | ______ | ______ | ______ | |
| WAU | ______ | ______ | ______ | |
| MAU | ______ | ______ | ______ | |
| DAU/MAU | _____% | _____% | > 20% | |
| Activation Rate | _____% | _____% | > 30% | |
| Feature 1 Adoption | _____% | _____% | | |
| Feature 2 Adoption | _____% | _____% | | |
| Feature 3 Adoption | _____% | _____% | | |
| Onboarding Completion | _____% | _____% | > 60% | |
| Time to First Value | ____ min | ____ min | < 10 min | |
| Support Tickets | ______ | ______ | Declining | |

### Revenue Dashboard

**MRR Waterfall:**

| Component | Value |
|-----------|-------|
| Starting MRR (beginning of month) | $_________ |
| + New MRR (new customers) | + $_________ |
| + Expansion MRR (upgrades, seats) | + $_________ |
| - Contraction MRR (downgrades) | - $_________ |
| - Churned MRR (cancellations) | - $_________ |
| **= Ending MRR** | **$_________** |
| **Net Change** | **+/- $_________** |
| **Net MRR Growth Rate** | **+/- _________%** |

**Revenue Forecast:**

| Month | Projected MRR | Confidence | Assumptions |
|-------|-------------|------------|-------------|
| {{MONTH_1}} | $_________ | High / Med / Low | _________________ |
| {{MONTH_2}} | $_________ | High / Med / Low | _________________ |
| {{MONTH_3}} | $_________ | High / Med / Low | _________________ |
| {{MONTH_4}} | $_________ | High / Med / Low | _________________ |
| {{MONTH_5}} | $_________ | High / Med / Low | _________________ |
| {{MONTH_6}} | $_________ | High / Med / Low | _________________ |

---

## Reporting Cadence

| Cadence | What | Who | Format | Time |
|---------|------|-----|--------|------|
| **Daily Glance** | MRR, signups, active users (3 numbers) | Founder/CEO | Automated Slack/email alert | 2 minutes |
| **Weekly Review** | Marketing + product + revenue snapshot | Marketing + Product team | Meeting or async doc | 30 minutes |
| **Monthly Deep-Dive** | Full dashboard review, channel analysis, cohort analysis | All stakeholders | Report document + meeting | 1-2 hours |
| **Quarterly Strategy** | Strategy assessment, goal setting, budget planning | Leadership | Presentation + workshop | Half day |

---

## Dashboard Tools

| Tool | Cost | Best For | Complexity |
|------|------|----------|------------|
| **Google Sheets / Notion** | Free | MVP dashboards, manual tracking, early stage | Low |
| **Google Looker Studio** | Free | Connecting GA4 and Google Sheets to visual dashboards | Medium |
| **Databox** | Free-$72/mo | Pre-built integrations with marketing tools, automated | Low-Medium |
| **Geckoboard** | $39/mo+ | Real-time TV dashboards for the office | Low |
| **Baremetrics** | $50/mo+ | Stripe-connected SaaS metrics (MRR, churn, LTV) | Low |
| **ChartMogul** | Free-$100/mo+ | Subscription analytics, connects to Stripe/payment tools | Medium |
| **Custom (Metabase/Grafana)** | Free (self-hosted) | Full control, connect to your database | High |

**Recommendation for {{PROJECT_NAME}}:**
- Pre-launch: Google Sheets
- Launch: Google Sheets + Baremetrics (if subscription)
- Growth: Looker Studio + Baremetrics + product analytics dashboards
- Scale: Custom data warehouse + BI tool

---

## KPI Dashboard for {{PROJECT_NAME}}

### Your Stage: {{CURRENT_STAGE}}

Based on your stage, focus on these metrics:

**Primary Metrics (check daily):**
1. _________________________
2. _________________________
3. _________________________

**Secondary Metrics (check weekly):**
4. _________________________
5. _________________________
6. _________________________
7. _________________________

**Quarterly Metrics (review monthly):**
8. _________________________
9. _________________________
10. ________________________

### Targets for Next Quarter

| Metric | Current | Target | Gap | Action to Close Gap |
|--------|---------|--------|-----|-------------------|
| _________________ | _______ | _______ | _______ | _________________ |
| _________________ | _______ | _______ | _______ | _________________ |
| _________________ | _______ | _______ | _______ | _________________ |
| _________________ | _______ | _______ | _______ | _________________ |
| _________________ | _______ | _______ | _______ | _________________ |

### Key Formulas

```
MRR = Sum of all active monthly subscription values
ARR = MRR × 12
CAC = (Marketing spend + Sales spend) ÷ New customers acquired
LTV = ARPU × (1 ÷ Monthly churn rate)
LTV:CAC = LTV ÷ CAC
Payback Period = CAC ÷ (ARPU × Gross Margin)
NRR = (Start MRR + Expansion - Contraction - Churn) ÷ Start MRR × 100
Pipeline Velocity = (Deals × Win Rate × Avg Value) ÷ Cycle Length
```

---

---

## Cross-References

- **Unified metrics registry**: `35-business-intelligence/metrics-hub/unified-metrics-registry.template.md` — all marketing KPIs from this file are mapped into the enterprise metrics hierarchy with warehouse tables, dashboard destinations, and alert thresholds
- **Data infrastructure**: `35-business-intelligence/etl-pipeline-design.template.md` — how marketing analytics data flows from source systems to the warehouse
- **Executive reporting**: `35-business-intelligence/executive-reporting/departmental-dashboards.template.md` — marketing departmental dashboard that consumes these KPIs
- **Board deck**: `35-business-intelligence/executive-reporting/board-deck-templates.template.md` — how marketing metrics appear in investor and board reporting

---

*This KPI framework is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*
