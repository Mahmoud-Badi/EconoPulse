# Churn Prevention and Customer Health Scoring for {{PROJECT_NAME}}

> Proactive strategies to identify at-risk customers, intervene before they leave, and reduce churn to grow sustainably.

---

## What Is Churn?

Churn is the rate at which customers stop using your product or cancel their subscription. It is the silent killer of growth -- you can acquire new customers all day, but if they are leaving out the back door just as fast, you will never grow.

### Types of Churn

| Type | Definition | Example | Controllability |
|------|-----------|---------|-----------------|
| **Voluntary churn** | Customer actively cancels | User clicks "cancel subscription" | Partially controllable (product/experience) |
| **Involuntary churn** | Customer loses access due to payment failure | Credit card expired, insufficient funds | Highly controllable (dunning systems) |
| **Revenue churn** | Loss of revenue (includes downgrades) | Customer moves from Pro to Basic plan | Partially controllable (value demonstration) |
| **Logo churn** | Loss of customer accounts | Any account that cancels regardless of plan | Core churn metric |
| **Gross revenue churn** | Total revenue lost from cancellations + downgrades | $10K lost this month | Revenue health metric |
| **Net revenue churn** | Revenue lost minus expansion revenue | $10K lost - $7K expanded = $3K net churn | Growth sustainability metric |

**Key insight:** Net negative revenue churn (expansion exceeds churn) is the holy grail. It means your existing customers are growing faster than others are leaving.

### Churn Math That Matters

```
Monthly churn rate = (Customers lost in month / Customers at start of month) x 100

Annual churn rate ≠ Monthly churn x 12
Annual churn rate = 1 - (1 - monthly churn rate)^12

Example:
5% monthly churn = 1 - (1 - 0.05)^12 = 46% annual churn (not 60%)
2% monthly churn = 1 - (1 - 0.02)^12 = 21.5% annual churn
1% monthly churn = 1 - (1 - 0.01)^12 = 11.4% annual churn

Revenue impact:
If you have $100K MRR and 5% monthly churn:
- Month 1: lose $5K → $95K
- Month 6: $73.5K (without new revenue)
- Month 12: $54K (without new revenue)
You must acquire $46K/year just to stay flat.
```

---

## Customer Health Score Model

A health score aggregates multiple signals into a single indicator of whether a customer is likely to renew or churn.

### Signal Categories

#### Usage Signals (Weight: 40%)

| Signal | Healthy | At Risk | Critical | Measurement |
|--------|---------|---------|----------|-------------|
| Login frequency | {{HEALTHY_LOGIN_FREQ}} | {{ATRISK_LOGIN_FREQ}} | {{CRITICAL_LOGIN_FREQ}} | Weekly average |
| Feature adoption | Using 60%+ of plan features | Using 30-60% | Using <30% | Feature event tracking |
| Data volume | Growing or stable | Declining | Minimal/none | Database metrics |
| Session duration | {{HEALTHY_SESSION_DUR}} | {{ATRISK_SESSION_DUR}} | {{CRITICAL_SESSION_DUR}} | Analytics |
| Key feature usage | Regular use of core features | Sporadic use | Never used core features | Event tracking |
| API calls (if applicable) | Steady or growing | Declining | Minimal | API logs |

#### Engagement Signals (Weight: 30%)

| Signal | Healthy | At Risk | Critical | Measurement |
|--------|---------|---------|----------|-------------|
| Support tickets | Low volume, positive tone | Increasing volume, frustrated tone | Escalations, complaints | Help desk |
| NPS response | Promoter (9-10) | Passive (7-8) | Detractor (0-6) | NPS survey |
| Community activity | Active participant | Lurker | No engagement | Community platform |
| Email engagement | Opens and clicks | Opens only | No opens | Email platform |
| Webinar/event attendance | Attends regularly | Occasional | Never attends | Event tracking |
| Feature request activity | Submits and votes | Occasional votes | No activity | Feedback board |

#### Relationship Signals (Weight: 30%)

| Signal | Healthy | At Risk | Critical | Measurement |
|--------|---------|---------|----------|-------------|
| Contract length | Annual or multi-year | Monthly | Month-to-month + declining usage | Billing system |
| Expansion history | Has upgraded or added seats | Stable | Has downgraded | Billing system |
| Multi-user adoption | Multiple active users | Single admin only | Key user departed | User analytics |
| Payment history | Always on time | Occasional late | Failed payments | Billing system |
| Tenure | 12+ months | 3-12 months | <3 months | Account data |
| Executive sponsor | Active and engaged | Passive | No identified sponsor | CRM |

### Health Score Calculation

```
Health Score = (Usage Score x 0.4) + (Engagement Score x 0.3) + (Relationship Score x 0.3)

Each sub-score: 0-100 scale

Overall Score:
  80-100: Green (Healthy)     → Expand and advocate
  60-79:  Yellow (Monitor)    → Proactive engagement
  40-59:  Orange (At Risk)    → Intervention required
  0-39:   Red (Critical)      → Immediate action needed
```

### Health Score Dashboard Template

```
{{PROJECT_NAME}} Customer Health — {{DATE}}

Total Customers: ____
Green:  ____  (___%)   ████████████████████
Yellow: ____  (___%)   ████████████
Orange: ____  (___%)   ██████
Red:    ____  (___%)   ███

Trend (vs last month):
Green:  +/- ___
Yellow: +/- ___
Orange: +/- ___
Red:    +/- ___

Top 5 At-Risk Accounts (by revenue):
1. {{ACCOUNT}} — ${{MRR}} — Score: __ — Key issue: __________
2. {{ACCOUNT}} — ${{MRR}} — Score: __ — Key issue: __________
3. {{ACCOUNT}} — ${{MRR}} — Score: __ — Key issue: __________
4. {{ACCOUNT}} — ${{MRR}} — Score: __ — Key issue: __________
5. {{ACCOUNT}} — ${{MRR}} — Score: __ — Key issue: __________
```

---

## Early Warning Signals (Red Flags)

These behavioral patterns predict churn 30-90 days before it happens. Monitor them weekly.

### Signal Detection Framework

| Red Flag | Detection Method | Lead Time | Severity |
|----------|-----------------|-----------|----------|
| **Declining usage (WoW)** | 20%+ drop in weekly active usage for 2+ weeks | 30-60 days | High |
| **Support ticket spike** | 3+ tickets in a week or escalation to management | 14-30 days | High |
| **Login frequency drop** | 50%+ reduction in login frequency vs prior 30-day average | 30-60 days | High |
| **Feature adoption stall** | No new feature adoption after 60 days | 60-90 days | Medium |
| **Key user departure** | Primary admin or champion leaves the company | 30-60 days | Critical |
| **Payment issues** | Failed payment, downgrade request, invoice dispute | 14-30 days | Critical |
| **Competitor evaluation** | User visits pricing/comparison pages, mentions competitors in support | 14-30 days | High |
| **Contract approaching renewal** | 60-90 days before renewal date without expansion signals | 60-90 days | Medium |
| **Team shrinkage** | Reduction in active seats or user count | 30-60 days | Medium |
| **Silence** | No login, no support contact, no email engagement for 30+ days | 30-60 days | High |

### Automated Alert System

Set up automated alerts for the following triggers:

```
Alert: "At-Risk Account Detected"
Trigger: Health score drops from Green to Yellow
Action: Add to proactive outreach queue
Owner: Customer Success Manager

Alert: "Critical Account"
Trigger: Health score drops to Red OR key user departure detected
Action: Immediate escalation — personal outreach within 24 hours
Owner: CS Lead or Founder

Alert: "Usage Decline"
Trigger: Weekly active usage drops 30%+ for 2 consecutive weeks
Action: Send "Is everything okay?" check-in email
Owner: Automated + CS review

Alert: "Payment Failure"
Trigger: Payment fails
Action: Initiate dunning sequence immediately
Owner: Automated billing system
```

---

## Intervention Playbooks by Health Score

### Yellow (Score 60-79): Proactive Engagement

**Goal:** Re-engage before the situation worsens.
**Timeline:** Respond within 1 week of detection.

**Playbook:**
1. **Automated email** (Day 1): Personalized check-in with usage tips
   ```
   Subject: Getting the most out of {{PROJECT_NAME}}

   Hi {{FIRST_NAME}},

   I noticed you have not tried {{UNDERUSED_FEATURE}} yet.
   Teams who use it report {{BENEFIT_STAT}}.

   Here is a quick guide to get started:
   [Link to guide]

   Want me to walk you through it? Reply to schedule a quick call.

   — {{CS_NAME}}
   ```

2. **Feature recommendation** (Day 3): In-app message highlighting unused features relevant to their use case

3. **Content offer** (Day 7): Send a relevant case study or best practice guide

4. **Check-in call** (Day 14): If no improvement, personal outreach from CS or founder

### Orange (Score 40-59): Active Intervention

**Goal:** Understand the problem and demonstrate renewed value.
**Timeline:** Respond within 48 hours of detection.

**Playbook:**
1. **Personal email from CS or founder** (Day 1):
   ```
   Subject: Quick check-in from {{FOUNDER_NAME}}

   Hi {{FIRST_NAME}},

   I wanted to personally reach out. I noticed your team's usage
   of {{PROJECT_NAME}} has changed recently, and I want to make
   sure we are delivering value for you.

   Would you have 15 minutes this week for a quick call? I would
   love to hear how things are going and see if there is anything
   we can do better.

   [Book a time that works for you]

   — {{FOUNDER_NAME}}
   ```

2. **Discovery call** (Day 3-5): Understand the root cause
   - Ask: What has changed? New priorities? Missing features? Issues?
   - Listen more than talk
   - Document all feedback

3. **Action plan** (Day 7): Based on call, create specific remediation plan
   - Fix any product issues identified
   - Provide training or onboarding for underused features
   - Connect with relevant resources

4. **Follow-up** (Day 14): Check if interventions are working

### Red (Score 0-39): Critical Save

**Goal:** Prevent imminent churn with high-touch outreach.
**Timeline:** Respond within 24 hours.

**Playbook:**
1. **Executive outreach** (Day 1): Founder or VP-level email and phone call
2. **Emergency offer** (if appropriate):
   - Extended trial or free month
   - Dedicated implementation support
   - Custom feature development (for high-value accounts)
   - Contract flexibility (pause, restructure)
3. **On-site or video meeting** (Day 2-3): For high-value accounts, offer in-person support
4. **Escalation tracking**: Log all interactions and outcomes

---

## Involuntary Churn Prevention

Involuntary churn (failed payments) accounts for 20-40% of all churn in subscription businesses. It is the most preventable form of churn.

### Dunning System (Failed Payment Recovery)

```
Payment Failure Sequence:

Day 0: Payment fails
  → Retry payment immediately (soft decline may succeed)
  → Email: "Payment failed — please update your card"
  → In-app banner: "Payment issue — update now to avoid interruption"

Day 3: Second retry
  → Email: "Action needed: your payment could not be processed"
  → Push notification (mobile)

Day 7: Third retry
  → Email: "Your account will be affected in 7 days"
  → More urgent in-app messaging

Day 10: Fourth retry
  → Email: "Final notice: update payment to keep your account"
  → Offer alternative payment method

Day 14: Account action
  → Downgrade to free plan (if available) or pause account
  → DO NOT delete data — keep account recoverable
  → Final email: "We have paused your account — reactivate anytime"
```

### Pre-Expiration Prevention

```
60 days before card expiry:
  → In-app notification: "Your card ending in {{LAST_4}} expires soon"

30 days before:
  → Email: "Update your payment method to avoid interruption"

14 days before:
  → Email: "Your card expires in 2 weeks"
  → In-app banner (persistent)

7 days before:
  → Email: "Last chance to update before your card expires"

Day of expiry:
  → Try charging the old card (banks sometimes honor it)
  → If it fails, begin dunning sequence
```

### Payment Recovery Tools

- **Stripe Smart Retries**: Automatically retries at optimal times
- **Baremetrics Recover**: Dedicated dunning tool for Stripe
- **Churnkey**: Smart cancellation flows and payment recovery
- **ProfitWell Retain**: AI-powered payment recovery
- **Gravy**: Human-powered payment recovery service

---

## Exit Survey Template

When a user initiates cancellation, collect structured feedback.

### Exit Survey Design

```
We are sorry to see you go.

Before you cancel, would you mind telling us why?
(Select all that apply)

[ ] Too expensive
[ ] Missing features I need
[ ] Too difficult to use
[ ] Found a better alternative
[ ] No longer need this type of product
[ ] Poor customer support experience
[ ] Product is too buggy / unreliable
[ ] My project/company situation changed
[ ] I did not see enough value
[ ] Other: _______________

What is the single biggest reason? (open text)
[                                               ]

Would you consider:
[ ] A discounted plan (${{DISCOUNT_PRICE}}/mo)
[ ] A pause instead of cancellation (up to 3 months)
[ ] A downgrade to our free plan
[ ] A call with our team to resolve your concerns
[ ] No, I want to cancel

[Complete Cancellation]     [Keep My Account]
```

### Cancellation Flow Design

```
Step 1: "Are you sure?" (with value reminder)
  → Show what they will lose: data, history, team access
  → Show what they have accomplished: metrics, milestones

Step 2: Exit survey (above)

Step 3: Save offer (based on survey response)
  → Too expensive → offer discount or downgrade
  → Missing features → show roadmap, offer workaround
  → Too difficult → offer training session
  → No longer needed → offer pause
  → Other → offer call with team

Step 4: If they still want to cancel
  → Process cancellation
  → Confirm data retention policy
  → Thank them and leave door open
  → "You can reactivate anytime. Your data will be saved for 90 days."

Step 5: Post-cancellation email (same day)
  → Thank them for being a customer
  → Confirm cancellation details
  → Remind them how to reactivate
  → No guilt, no pressure
```

---

## Churn Prediction Model

Build a simple predictive model to identify likely churners before they show obvious red flags.

### Simple Scoring Model

```
Churn Prediction Score (0-100):

Input Variables:
- Days since last login: >14 days = +20 points
- Usage trend (30-day): declining = +15 points
- Support tickets (last 30 days): 3+ = +10 points
- NPS score: detractor = +15 points, passive = +5 points
- Payment issues (last 90 days): any = +10 points
- Feature adoption: <30% = +10 points
- Tenure: <3 months = +10 points, 3-6 months = +5 points
- Team size: single user = +5 points
- Contract type: monthly = +5 points

Score Interpretation:
0-25:   Low churn risk
26-50:  Moderate risk — monitor
51-75:  High risk — intervene
76-100: Very high risk — immediate action
```

### Advanced Approach

For teams with data science capability:
1. Export historical data: all customers who churned in the past 12 months
2. Identify their behavioral patterns 30/60/90 days before churn
3. Train a logistic regression or random forest model on these patterns
4. Score current customers weekly against the model
5. Feed predictions into the health score system

Tools: Mixpanel (cohort analysis), Amplitude (behavioral analytics), ProfitWell (financial metrics), custom ML with Python/scikit-learn.

---

## Churn Benchmarks

### By Business Type

| Business Type | Good Monthly Churn | Great Monthly Churn | Annual Equivalent (Good) |
|---------------|-------------------|--------------------|-----------------------|
| B2B SaaS (SMB) | <5% | <3% | <46% |
| B2B SaaS (Mid-market) | <3% | <1.5% | <31% |
| B2B SaaS (Enterprise) | <1% | <0.5% | <11% |
| B2C SaaS | <7% | <5% | <58% |
| Consumer subscription | <10% | <7% | <72% |
| Mobile app (free-to-paid) | Highly variable | Highly variable | — |
| Marketplace | <5% seller churn | <3% seller churn | — |

### Net Revenue Retention Benchmarks

| Performance | NRR | What It Means |
|-------------|-----|---------------|
| Best in class | >130% | Strong expansion, minimal churn |
| Excellent | 110-130% | Healthy growth from existing customers |
| Good | 100-110% | Expansion roughly offsets churn |
| Concerning | 90-100% | Revenue shrinking from existing base |
| Critical | <90% | Significant value delivery problem |

---

## Health Score Model Template for {{PROJECT_NAME}}

```
Product: {{PROJECT_NAME}}
Customer segment: {{PRIMARY_SEGMENT}}
Review cadence: Weekly health score review, monthly deep analysis

USAGE SIGNALS (40% weight):
1. {{USAGE_SIGNAL_1}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
2. {{USAGE_SIGNAL_2}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
3. {{USAGE_SIGNAL_3}}:
   Healthy = __________ | At Risk = __________ | Critical = __________

ENGAGEMENT SIGNALS (30% weight):
1. {{ENGAGEMENT_SIGNAL_1}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
2. {{ENGAGEMENT_SIGNAL_2}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
3. {{ENGAGEMENT_SIGNAL_3}}:
   Healthy = __________ | At Risk = __________ | Critical = __________

RELATIONSHIP SIGNALS (30% weight):
1. {{RELATIONSHIP_SIGNAL_1}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
2. {{RELATIONSHIP_SIGNAL_2}}:
   Healthy = __________ | At Risk = __________ | Critical = __________
3. {{RELATIONSHIP_SIGNAL_3}}:
   Healthy = __________ | At Risk = __________ | Critical = __________

INTERVENTION THRESHOLDS:
- Green (80-100): Quarterly check-in, expansion opportunities
- Yellow (60-79): Monthly check-in, proactive engagement within 1 week
- Orange (40-59): Weekly monitoring, personal outreach within 48 hours
- Red (0-39): Daily monitoring, executive outreach within 24 hours

IMPLEMENTATION:
- [ ] Define all signal thresholds with real data
- [ ] Instrument tracking for all signals
- [ ] Build health score calculation (spreadsheet or tool)
- [ ] Set up automated alerts for score changes
- [ ] Create intervention playbook for each tier
- [ ] Train team on health score review process
- [ ] Schedule weekly health score review meeting
- [ ] Build monthly churn analysis report
```

---

*This churn prevention system is part of the {{PROJECT_NAME}} marketing system. Review health score thresholds quarterly as your understanding of churn patterns deepens.*
