# Freemium & Trial Conversion Modeling — {{PROJECT_NAME}}

> Models the financial impact of your free tier or trial period — from visitor to signup to activation to paid conversion to retention. Free users are not free to serve. This template quantifies the cost of your free base, the expected conversion revenue, and the levers that move both.

---

## Conversion Funnel Model

### Full Funnel: Visitor to Retained Paying Customer

| Stage | Metric | Rate | Monthly Volume | Cumulative Conversion |
|-------|--------|------|---------------|----------------------|
| **Visitors** | Unique monthly visitors | — | ___ | — |
| **Visitors -> Sign Up** | Signup rate | {{SIGNUP_RATE}}% | ___ | {{SIGNUP_RATE}}% |
| **Sign Up -> Activated** | Activation rate | {{ACTIVATION_RATE}}% | ___ | ___% |
| **Activated -> Paid** | Conversion rate | {{CONVERSION_RATE}}% | ___ | ___% |
| **Paid -> Retained (Month 2)** | Month 1 retention | {{RETENTION_RATE}}% | ___ | ___% |
| **Paid -> Retained (Month 6)** | Month 6 retention | ___% | ___ | ___% |
| **Paid -> Retained (Month 12)** | Month 12 retention | ___% | ___ | ___% |

### Funnel Math Example

```
10,000 visitors/month
  x 3% signup rate       = 300 signups
  x 40% activation rate  = 120 activated users
  x 5% conversion rate   = 6 paying customers
  x $49 ARPU             = $294 new MRR from this month's visitors

Effective visitor-to-revenue conversion: 0.06%
Effective cost per paying customer from organic traffic: $0 (if organic)
```

### Your Funnel Calculation

```
___ visitors/month
  x {{SIGNUP_RATE}}% signup rate       = ___ signups
  x {{ACTIVATION_RATE}}% activation    = ___ activated users
  x {{CONVERSION_RATE}}% conversion    = ___ paying customers
  x ${{AVERAGE_REVENUE_PER_USER}} ARPU = $___ new MRR

Effective visitor-to-revenue conversion: ___%
```

---

## Activation Definition

Activation is the most important conversion event. It is the moment a user experiences enough value to consider paying. Define yours precisely:

| Component | Your Definition |
|-----------|----------------|
| **Activation event** | What specific action = activated? |
| **Time window** | Must happen within ___ days of signup |
| **Example** | e.g., "Created first project AND invited 1 team member within 7 days" |
| **Current activation rate** | {{ACTIVATION_RATE}}% |
| **Benchmark for your category** | ___% |

### Activation Rate by Signup Source

Different traffic sources produce users with different intent and activation rates:

| Source | Signups/Month | Activation Rate | Activated Users | Quality Score |
|--------|--------------|----------------|----------------|--------------|
| Organic search | ___ | ___% | ___ | |
| Direct / word-of-mouth | ___ | ___% | ___ | |
| Product Hunt / launches | ___ | ___% | ___ | |
| Paid ads (Google) | ___ | ___% | ___ | |
| Paid ads (Meta) | ___ | ___% | ___ | |
| Content / blog | ___ | ___% | ___ | |
| Referral program | ___ | ___% | ___ | |
| **Blended** | **___** | **{{ACTIVATION_RATE}}%** | **___** | |

---

## Trial Conversion Modeling

### 14-Day Trial vs 30-Day Trial Comparison

| Metric | 14-Day Trial | 30-Day Trial | Notes |
|--------|-------------|-------------|-------|
| Trial starts per month | ___ | ___ | Same if signup flow is identical |
| Trial-to-paid conversion rate | ___% | ___% | 14-day often converts higher — creates urgency |
| Average time to convert | ___ days | ___ days | |
| Revenue per trial start | $___ | $___ | Conversion rate x ARPU |
| Cost to serve per trial user | $___ | $___ | 30-day trials cost 2x to serve |
| Total trial serving cost/month | $___ | $___ | |
| Net revenue per trial start | $___ | $___ | Revenue minus serving cost |
| **Recommended trial length** | | | **Choose based on net revenue per trial start** |

### Trial Conversion Benchmarks

| Factor | Impact on Conversion | Benchmark |
|--------|---------------------|-----------|
| Trial length: 7 days | Highest urgency, lowest exploration | 8-15% conversion |
| Trial length: 14 days | Good balance of urgency and exploration | 10-20% conversion |
| Trial length: 30 days | Maximum exploration, lower urgency | 5-15% conversion |
| Credit card required upfront | Higher conversion, fewer trial starts | 40-60% conversion (of those who start) |
| No credit card required | More trial starts, lower conversion | 5-15% conversion |
| Reverse trial (start paid, downgrade to free) | Highest conversion of all models | 50-70% conversion |

### Time-to-Conversion Distribution

Most conversions do not happen on day 1 or the last day. Understanding the distribution helps you time nudges correctly.

| Day of Trial | % of Total Conversions | Cumulative % | Optimal Nudge Timing |
|-------------|----------------------|-------------|---------------------|
| Day 1-2 | ___% | ___% | Welcome email, onboarding flow |
| Day 3-5 | ___% | ___% | Feature discovery prompts |
| Day 6-7 | ___% | ___% | Value reinforcement |
| Day 8-10 | ___% | ___% | Social proof, case studies |
| Day 11-13 | ___% | ___% | Urgency messaging (trial ending) |
| Day 14 (last day) | ___% | ___% | Final conversion push |
| After trial expiry | ___% | 100% | Win-back email sequence |

---

## Freemium Conversion Benchmarks

### By Product Type

| Product Type | Typical Free-to-Paid | Good | Excellent | World-Class |
|-------------|---------------------|------|-----------|------------|
| SaaS (B2B) | 2-5% | 7% | 10%+ | 15%+ |
| Developer Tools | 1-3% | 5% | 8%+ | 12%+ |
| Consumer Apps | 0.5-2% | 3% | 5%+ | 8%+ |
| Mobile Apps | 0.5-2% | 2% | 4%+ | 7%+ |
| Productivity Tools | 2-4% | 5% | 8%+ | 12%+ |
| Collaboration Tools | 3-7% | 10% | 15%+ | 20%+ |

### By Conversion Trigger

| Trigger | Typical Conversion Rate | Example |
|---------|------------------------|---------|
| Usage limit hit | 8-15% | "You have used 90% of your free storage" |
| Feature gate hit | 5-10% | "This feature is available on Pro" |
| Team size limit | 10-20% | "Invite more than 3 team members on Pro" |
| Time limit (trial) | 10-25% (with CC) / 3-8% (without CC) | "Your trial ends in 3 days" |
| Value realization | 3-8% | Gradual — user sees enough value to pay |
| Support quality difference | 2-5% | Free gets community, paid gets priority |

---

## Conversion Revenue Impact Calculator

What is the financial impact of improving conversion at each funnel stage?

### Improving Signup Rate

| Current Signup Rate | Improved To | Additional Signups/Month | Additional Paid (at {{CONVERSION_RATE}}% conversion of activated) | Additional MRR |
|--------------------|-----------|--------------------------|-----------------------------------------------------------------|---------------|
| {{SIGNUP_RATE}}% | +1% point | ___ | ___ | $___ |
| {{SIGNUP_RATE}}% | +2% points | ___ | ___ | $___ |
| {{SIGNUP_RATE}}% | +5% points | ___ | ___ | $___ |

### Improving Activation Rate

| Current Activation Rate | Improved To | Additional Activated/Month | Additional Paid | Additional MRR |
|------------------------|-----------|-----------------------------|----------------|---------------|
| {{ACTIVATION_RATE}}% | +5% points | ___ | ___ | $___ |
| {{ACTIVATION_RATE}}% | +10% points | ___ | ___ | $___ |
| {{ACTIVATION_RATE}}% | +20% points | ___ | ___ | $___ |

### Improving Conversion Rate

| Current Conversion Rate | Improved To | Additional Paid/Month | Additional MRR | Additional ARR |
|------------------------|-----------|-----------------------|---------------|---------------|
| {{CONVERSION_RATE}}% | +1% point | ___ | $___ | $___ |
| {{CONVERSION_RATE}}% | +2% points | ___ | $___ | $___ |
| {{CONVERSION_RATE}}% | +5% points | ___ | $___ | $___ |

### Highest-ROI Improvement

| Stage | Current Rate | Effort to Improve | Revenue Impact per 1% Improvement | Priority |
|-------|-------------|-------------------|----------------------------------|----------|
| Signup | {{SIGNUP_RATE}}% | ___ | $___ MRR | |
| Activation | {{ACTIVATION_RATE}}% | ___ | $___ MRR | |
| Conversion | {{CONVERSION_RATE}}% | ___ | $___ MRR | |
| Retention | {{RETENTION_RATE}}% | ___ | $___ MRR | |

*Typically: Activation improvements have the highest ROI because they improve both conversion and retention simultaneously.*

---

## Free Tier Cost Modeling

Free users are not free to serve. Every free user consumes infrastructure, support time, and platform resources. Model this cost to ensure your free tier is sustainable.

### Per-Free-User Cost

| Cost Component | Per Free User/Month | Notes |
|----------------|-------------------|-------|
| Compute / hosting | $___ | CPU, memory allocation per user |
| Database storage | $___ | Data stored per free user |
| Bandwidth / CDN | $___ | Data transfer per free user |
| Email (transactional) | $___ | Welcome, notifications, etc. |
| Support (self-serve + community) | $___ | Time spent on free user issues |
| AI/API costs (if applicable) | $___ | Per-user AI consumption |
| Monitoring / logging overhead | $___ | Per-user observability cost |
| **Total per free user** | **$___** | |

### Free Tier Financial Impact

| Metric | Value |
|--------|-------|
| Total free users | ___ |
| Cost per free user per month | $___ |
| **Total monthly cost of free tier** | **$___** |
| Revenue from paid users | $___ |
| **Free tier cost as % of revenue** | **___**% |
| **Acceptable threshold** | **<15-20% of revenue** |

### Free Tier Sustainability Scenarios

| Free Users | Monthly Cost | Paid Users Needed to Cover (at current CM) | Conversion Rate Required |
|-----------|-------------|---------------------------------------------|-------------------------|
| 1,000 | $___ | ___ | ___% |
| 5,000 | $___ | ___ | ___% |
| 10,000 | $___ | ___ | ___% |
| 50,000 | $___ | ___ | ___% |
| 100,000 | $___ | ___ | ___% |

### Free Tier Cost Reduction Strategies

| Strategy | Current Cost Impact | Reduced Cost | Savings |
|----------|-------------------|-------------|---------|
| Reduce free tier storage limits | $___ | $___ | $___ |
| Throttle API calls for free users | $___ | $___ | $___ |
| Limit compute-heavy features | $___ | $___ | $___ |
| Move free tier to cheaper infrastructure | $___ | $___ | $___ |
| Implement aggressive data archival | $___ | $___ | $___ |

---

## Expansion Revenue from Free Base

The free user base is not just a cost center — it is a pipeline for expansion revenue.

### Free-to-Paid Expansion Paths

| Path | Monthly Volume | Conversion Rate | ARPU | Monthly Revenue |
|------|---------------|----------------|------|----------------|
| Self-serve upgrade (hit limit) | ___ | ___% | $___ | $___ |
| Sales-assisted upgrade (enterprise) | ___ | ___% | $___ | $___ |
| Team growth (seat expansion) | ___ | ___% | $___ | $___ |
| Feature-triggered upgrade | ___ | ___% | $___ | $___ |
| **Total expansion from free** | | | | **$___** |

### Free User Viral Contribution

Free users often drive viral growth that does not show up in direct conversion metrics:

| Viral Metric | Value |
|-------------|-------|
| Free users who invite others | ___% |
| Average invites per active free user | ___ |
| Invite acceptance rate | ___% |
| New signups from free user invites/month | ___ |
| % of those who eventually convert to paid | ___% |
| **Viral revenue attribution per month** | **$___** |

---

## 12-Month Freemium Funnel Projection

| Month | Visitors | Signups | Free Users (cumulative) | Activated | Paid Conversions | Paying Customers (cumulative) | Free Tier Cost | Paid Revenue | Net from Funnel |
|-------|---------|---------|------------------------|-----------|-----------------|------------------------------|---------------|-------------|----------------|
| 1 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 2 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 3 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 4 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 5 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 6 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 7 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 8 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 9 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 10 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 11 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |
| 12 | ___ | ___ | ___ | ___ | ___ | ___ | $___ | $___ | $___ |

---

## Freemium vs Trial Decision Framework

Not sure whether to offer freemium or a time-limited trial? Use this framework:

| Factor | Favors Freemium | Favors Trial |
|--------|----------------|-------------|
| Product complexity | Simple, self-serve | Complex, needs time to evaluate |
| Viral coefficient | High (users invite others) | Low (single-player product) |
| Infrastructure cost per user | Low (<$0.50/user/month) | High (>$2/user/month) |
| Time to value | Long (users need weeks) | Short (value in days) |
| Network effects | Strong (more users = better) | Weak |
| Market category | New (need to educate market) | Established (users know what to expect) |
| Sales motion | Self-serve / PLG | Sales-assisted |
| Monetization model | Usage-based or seat-based (natural expansion) | Feature-based (clear free/paid line) |

---

## Cross-References

- **Freemium optimization tactics**: `19-marketing/pricing-monetization/freemium-optimization.md`
- **Pricing strategy**: `19-marketing/pricing-monetization/pricing-strategy.template.md`
- **Revenue projection**: `25-financial-modeling/revenue-projection.template.md`
- **Unit economics**: `25-financial-modeling/unit-economics-calculator.template.md`
- **Onboarding & activation**: `19-marketing/onboarding-retention/`
