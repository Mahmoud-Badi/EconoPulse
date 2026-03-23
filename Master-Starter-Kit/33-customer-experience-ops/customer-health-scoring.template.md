# Customer Health Scoring Model

> {{PROJECT_NAME}} — Predict churn before it happens. Score every customer, intervene before they leave.

---

## Overview

A health score is a composite metric (0–100) that predicts customer retention by aggregating signals from usage, support, engagement, and billing. A declining score is an early warning — it gives you days or weeks to intervene before the customer churns.

**Cross-references:**
- For financial impact of churn, see `25-financial-modeling/`
- For NPS/CSAT data that feeds into health scoring, see `nps-csat-automation.template.md`
- For support signal definitions (ticket severity, escalation tiers), see `23-customer-support/support-escalation-workflow.md`

---

## Health Score Model Design

### Signal Categories

The health score is a weighted composite of four signal categories. Default weights are configurable per segment:

```
{{CX_HEALTH_SCORE_WEIGHTS}}
```

| Category | Default Weight | What It Measures |
|----------|---------------|------------------|
| Usage | 40% | Is the customer actively using the product? |
| Support | 20% | Is the customer experiencing pain? |
| Engagement | 20% | Is the customer invested in the relationship? |
| Billing | 20% | Is the customer at financial risk? |

---

## Signal Definitions

### 1. Usage Signals (Weight: Configurable)

| Signal | Healthy (75–100) | Neutral (50–74) | At-Risk (25–49) | Critical (0–24) | Weight |
|--------|-----------------|-----------------|-----------------|-----------------|--------|
| Login frequency | Daily active | 3-4x per week | 1-2x per week | < 1x per week or none in 14 days | 25% |
| Feature adoption breadth | > 60% of core features used | 40-60% | 20-40% | < 20% | 20% |
| Key action completion | All 3-5 "aha moment" actions completed | 2-3 completed | 1 completed | None completed | 20% |
| Time-in-app trend | Increasing or stable (last 30 days) | Stable | Declining 10-30% | Declining > 30% | 15% |
| Data volume growth | Growing or stable | Stable | No new data in 14 days | No new data in 30 days | 10% |
| Integration usage | 2+ integrations connected | 1 integration | Integration disconnected | Never connected | 10% |

**Defining "aha moment" key actions for {{PROJECT_NAME}}:**

List 3-5 actions that correlate with long-term retention. These are product-specific — examples:

```
# Replace these with your product's key actions
key_actions:
  - name: "Created first {{ENTITY_NAME}}"
    event: "entity.created"
    target_days: 3  # should happen within 3 days of signup
  - name: "Invited a team member"
    event: "team.member_invited"
    target_days: 7
  - name: "Connected first integration"
    event: "integration.connected"
    target_days: 14
  - name: "Completed first workflow end-to-end"
    event: "workflow.completed"
    target_days: 7
  - name: "Exported first report"
    event: "report.exported"
    target_days: 30
```

### 2. Support Signals (Weight: Configurable)

| Signal | Healthy (75–100) | Neutral (50–74) | At-Risk (25–49) | Critical (0–24) | Weight |
|--------|-----------------|-----------------|-----------------|-----------------|--------|
| Ticket volume trend (30-day) | 0-1 tickets, stable or declining | 2-3 tickets | 4+ tickets, increasing | 6+ tickets, accelerating | 25% |
| Ticket severity distribution | All P3/P4 | Mix of P2-P4 | Any P1 in last 30 days | Multiple P1s or unresolved P1 | 25% |
| CSAT scores (last 3 interactions) | Average ≥ 4.5 | 3.5-4.4 | 2.5-3.4 | < 2.5 | 20% |
| Escalation frequency (90-day) | 0 escalations to L2/L3 | 1 escalation | 2-3 escalations | 4+ escalations | 15% |
| Unresolved ticket age | No open tickets | Open tickets < 48 hours | Open tickets 48h-7 days | Open tickets > 7 days | 15% |

### 3. Engagement Signals (Weight: Configurable)

| Signal | Healthy (75–100) | Neutral (50–74) | At-Risk (25–49) | Critical (0–24) | Weight |
|--------|-----------------|-----------------|-----------------|-----------------|--------|
| Product email open rate | > 40% | 20-40% | 10-20% | < 10% | 20% |
| In-app notification interaction | > 30% click-through | 15-30% | 5-15% | < 5% or notifications disabled | 20% |
| KB / documentation visits (30-day) | 5+ visits | 2-4 visits | 1 visit | 0 visits | 20% |
| Community participation | Active poster/commenter | Occasional reader | None | N/A (no community) | 15% |
| Webinar / event attendance | Attended in last quarter | Registered but didn't attend | Never registered | N/A | 10% |
| Feature announcement engagement | Clicked on changelog/release notes | Saw but didn't click | Didn't see (not active) | N/A | 15% |

### 4. Billing Signals (Weight: Configurable)

| Signal | Healthy (75–100) | Neutral (50–74) | At-Risk (25–49) | Critical (0–24) | Weight |
|--------|-----------------|-----------------|-----------------|-----------------|--------|
| Payment status | All payments on time | 1 late payment (recovered) | 2+ late payments or failed charge | Payment method expired, no update | 30% |
| Plan changes | Upgraded in last 90 days | Stable | Downgrade inquiry | Downgrade completed or cancellation inquiry | 25% |
| Usage vs. plan limits | 50-80% of plan limits | 30-50% or > 90% | < 30% (overpaying) | < 10% (massively overpaying) | 20% |
| Contract renewal timing | > 90 days to renewal | 30-90 days to renewal | < 30 days AND score < 60 | Renewal overdue or in cancellation | 15% |
| Discount / coupon activity | None | Coupon redeemed at signup (normal) | Asking for discount to renew | Threatening to leave for discount | 10% |

---

## Score Calculation

### Formula

```python
def calculate_health_score(customer, weights=None):
    """
    Calculate composite health score (0-100).

    weights: dict with keys 'usage', 'support', 'engagement', 'billing'
             values are floats that sum to 1.0
    """
    if weights is None:
        weights = parse_weights("{{CX_HEALTH_SCORE_WEIGHTS}}")
        # Default: usage:40,support:20,engagement:20,billing:20

    usage_score = calculate_category_score(customer, 'usage')
    support_score = calculate_category_score(customer, 'support')
    engagement_score = calculate_category_score(customer, 'engagement')
    billing_score = calculate_category_score(customer, 'billing')

    composite = (
        usage_score * weights['usage'] +
        support_score * weights['support'] +
        engagement_score * weights['engagement'] +
        billing_score * weights['billing']
    )

    return clamp(round(composite), 0, 100)


def calculate_category_score(customer, category):
    """
    Weighted average of signal scores within a category.
    Missing signals use category average (don't penalize).
    """
    signals = get_signals(customer, category)
    scored = [(normalize(s.raw_value, s.ranges), s.weight)
              for s in signals if s.raw_value is not None]

    if not scored:
        return 50  # neutral default if no data

    total_weight = sum(w for _, w in scored)
    return sum(score * (w / total_weight) for score, w in scored)


def normalize(raw_value, ranges):
    """
    Map raw metric to 0-100 based on defined ranges.
    """
    if raw_value >= ranges.healthy_min:
        return scale(raw_value, ranges.healthy_min, ranges.healthy_max, 75, 100)
    elif raw_value >= ranges.neutral_min:
        return scale(raw_value, ranges.neutral_min, ranges.neutral_max, 50, 74)
    elif raw_value >= ranges.at_risk_min:
        return scale(raw_value, ranges.at_risk_min, ranges.at_risk_max, 25, 49)
    else:
        return scale(raw_value, ranges.critical_min, ranges.critical_max, 0, 24)
```

### Segment-Specific Weights

Different customer segments need different weight distributions:

| Segment | Usage | Support | Engagement | Billing |
|---------|-------|---------|------------|---------|
| Self-serve (free/starter) | 50% | 20% | 20% | 10% |
| SMB (paid) | 40% | 20% | 15% | 25% |
| Enterprise | 30% | 25% | 20% | 25% |
| Trial (pre-conversion) | 60% | 10% | 20% | 10% |

### New Customer Handling

Customers in their first 30 days use an "onboarding health" model with different signals:

| Signal | Weight | Measures |
|--------|--------|----------|
| Onboarding steps completed | 30% | How far through onboarding |
| Time-to-first-value | 25% | How quickly they hit "aha moment" |
| Return visits (came back after Day 1) | 20% | Did they come back? |
| Support ticket (positive signal during onboarding) | 15% | Engaged enough to ask for help |
| Profile completeness | 10% | Invested effort in setup |

After 30 days, transition to the standard health model.

---

## Health Score Tiers

| Tier | Score | Color | Meaning | Urgency |
|------|-------|-------|---------|---------|
| **Healthy** | 75–100 | Green | Low churn risk. Actively using product. Satisfied. | Monitor. Look for expansion. |
| **Neutral** | 50–74 | Yellow | Moderate engagement. Some warning signs. Stable but not growing. | Proactive check-in within 7 days. |
| **At-Risk** | 25–49 | Orange | Multiple negative signals. Usage declining. Frustration indicators. | CX outreach within 48 hours. |
| **Critical** | 0–24 | Red | High churn probability. Major red flags across categories. | Executive engagement within 24 hours. |

---

## Churn Prediction Early Warning System

### Leading Indicators

These signals precede churn by 30–90 days:

| # | Signal | Lookback | Detection Method |
|---|--------|----------|-----------------|
| 1 | Login frequency drops 50%+ from baseline | 30 days vs. prior 30 | Automated comparison |
| 2 | Key feature usage stops | Feature used weekly, now 14+ days inactive | Usage tracking |
| 3 | Support ticket mentions "cancel", "alternative", "competitor" | Any timeframe | Keyword detection |
| 4 | NPS score 0–4 (strong detractor) | Most recent survey | NPS integration |
| 5 | Payment method expired, no update in 7 days | Real-time | Billing system |
| 6 | Admin user hasn't logged in for 21+ days | Rolling | Usage tracking |
| 7 | Data export requested (bulk) | Any timeframe | Event tracking |
| 8 | Downgrade inquiry to sales/support | Any timeframe | CRM/ticket tagging |
| 9 | Contract renewal < 60 days AND health score < 50 | Rolling | Billing + health score |
| 10 | Competitor mentioned in support ticket or NPS comment | Any timeframe | Text analysis |

### Alert Configuration

| Alert | Condition | Channel | Recipient | SLA |
|-------|-----------|---------|-----------|-----|
| Score drops below {{CX_CHURN_ALERT_THRESHOLD}} | score < threshold | Slack + email | CSM + CX lead | Review within 24h |
| Rapid decline | Score drops 20+ points in 7 days | Urgent Slack | CX lead + VP | Outreach within 4h |
| Sustained critical | Critical tier for 14+ consecutive days | Escalation email | VP + exec sponsor | Same-day call |
| Multi-signal alarm | 3+ churn indicators simultaneously | Emergency Slack | Retention team | Immediate |
| Expansion opportunity | Score > 85 AND usage > 80% of plan limits | Email | Account manager | Review within 7 days |

---

## Intervention Playbooks

### At-Risk Intervention (Score 25–49)

**Timeline: 48 hours to first contact**

1. **CSM reviews context** (15 min): Check which signals are declining. Review recent tickets. Check NPS/CSAT history. Understand the story before reaching out.

2. **Personalized outreach** (email or call based on customer preference):
   ```
   Subject: Checking in on your {{PROJECT_NAME}} experience

   Hi {{CUSTOMER_NAME}},

   I noticed [specific observation — e.g., "you haven't used the reporting feature
   in a couple weeks" or "your team's usage has dropped recently"]. I wanted to
   reach out and see if there's anything we can help with.

   [If there were recent tickets]: I also saw you had some trouble with [topic].
   I want to make sure that was fully resolved.

   Would you have 15 minutes this week for a quick call? I'd love to understand
   how we can make {{PROJECT_NAME}} more valuable for your team.

   [Calendar link]
   ```

3. **If they respond**: schedule call, create action plan, set 14-day follow-up
4. **If no response in 5 days**: send one follow-up, then defer to next scheduled touchpoint
5. **Track**: did health score improve within 30 days of intervention?

### Critical Intervention (Score 0–24)

**Timeline: 24 hours to first contact (phone call, not email)**

1. **CX lead calls customer directly** — not email, not chat. Phone call shows urgency and care.
2. **Open-ended conversation**: "I want to understand what's not working for you. No agenda — just listening."
3. **Document top 3 pain points** from the call
4. **Create custom action plan** within 48 hours:
   - For each pain point: specific action, owner, deadline
   - Share action plan with customer
5. **Retention offer if appropriate** (NOT as first move — understand first):
   - Extended trial period
   - Temporary discount (only if leaving due to price)
   - Feature access upgrade
   - Dedicated support channel
6. **Executive sponsor for high-value accounts** (ARR > $10K):
   - VP or C-level sends personal email
   - Quarterly executive check-in commitment
7. **Follow-up cadence**: daily for first week, then weekly until health improves
8. **Track**: recovery rate = % of critical customers who reach at-risk or above within 60 days

### Healthy Expansion (Score 75–100)

**Timeline: within 7 days of opportunity signal**

1. **Identify expansion signals**:
   - Usage approaching plan limits (> 80%)
   - New use cases emerging (using features outside original scope)
   - Team growing (new user invitations)
   - Positive NPS (9-10) with enthusiastic comments
2. **Account manager outreach**:
   - Acknowledge their success: "Your team has been doing great with {{PROJECT_NAME}}."
   - Present upgrade value: "Based on your usage, you'd benefit from [specific feature in higher plan]."
   - Offer upgrade trial: "Want to try [plan] for 14 days?"
3. **Track**: expansion conversion rate

---

## Automated Intervention Workflows

### At-Risk Automation

```yaml
name: "at_risk_intervention"
trigger:
  condition: "health_score < 50 AND health_score >= 25"
  debounce: "7 days"  # don't re-trigger within 7 days

actions:
  - type: notify
    channel: slack
    recipient: "{{assigned_csm}}"
    message: |
      Customer **{{customer.name}}** health dropped to **{{health_score}}**
      Plan: {{customer.plan}} | ARR: {{customer.arr}}
      Top declining signals: {{top_3_declining_signals}}
      Last support ticket: {{last_ticket_summary}}
      Last NPS: {{last_nps_score}}

  - type: create_task
    assignee: "{{assigned_csm}}"
    title: "At-risk check-in: {{customer.name}} (score: {{health_score}})"
    due: "+2 business days"
    priority: "high"

  - type: conditional_email
    condition: "csm_contacted_in_48h == false"
    template: "at_risk_automated_checkin"
    delay: "48 hours"
```

### Critical Automation

```yaml
name: "critical_intervention"
trigger:
  condition: "health_score < 25"
  debounce: "3 days"

actions:
  - type: notify
    channel: slack_urgent
    recipient: "cx_lead"
    message: |
      :rotating_light: Customer **{{customer.name}}** is CRITICAL (score: {{health_score}})
      Immediate action required. ARR: {{customer.arr}}

  - type: notify
    channel: email
    condition: "customer.arr > 10000"
    recipient: "executive_sponsor"
    template: "critical_executive_alert"

  - type: create_task
    assignee: "cx_lead"
    title: "URGENT: Critical customer - {{customer.name}}"
    due: "today"
    priority: "P1"

  - type: pause_automations
    customer_id: "{{customer.id}}"
    pause: ["marketing_emails", "survey_triggers", "upsell_campaigns"]
    reason: "Critical health score — no automated outreach until resolved"
```

### Expansion Automation

```yaml
name: "expansion_opportunity"
trigger:
  condition: "health_score > 85 AND usage_percent > 80"
  debounce: "30 days"

actions:
  - type: notify
    channel: email
    recipient: "account_manager"
    message: |
      Customer **{{customer.name}}** is healthy (score: {{health_score}})
      and at {{usage_percent}}% of plan limits. Expansion opportunity.

  - type: create_task
    assignee: "account_manager"
    title: "Expansion conversation: {{customer.name}}"
    due: "+7 days"
```

---

## Voice of Customer Program

### Systematic Feedback Capture

Every customer touchpoint generates qualitative data. Capture it:

| Source | What to Tag | Who Tags It | Where It Goes |
|--------|-------------|-------------|--------------|
| Support tickets | Pain point category, feature area, sentiment | Agent (on close) | Feedback database |
| NPS comments | Theme, sentiment, specific feature mentioned | Auto-tag (LLM) + human review | Feedback database |
| CSM call notes | Key concerns, feature requests, competitive mentions | CSM (after call) | CRM + feedback database |
| Community posts | Topic, sentiment, product area | Moderator | Feedback database |
| App store reviews | Star rating, theme, sentiment | Auto-tag | Feedback database |

### Quarterly Theme Analysis

1. Pull all tagged feedback from the quarter
2. Group by theme (auto-clustering + manual review)
3. Rank themes by volume, severity, and customer value affected
4. Compare to previous quarter (new themes? recurring? resolved?)
5. Present top 10 themes to product team with supporting verbatims
6. Track: which themes resulted in product action? Close the loop.

### Customer Advisory Board

- **Size:** 10–15 customers (mix of promoters and constructive critics, mix of segments)
- **Cadence:** quarterly 1-hour calls (virtual)
- **Format:** present roadmap, gather reactions, discuss top pain points
- **Incentives:** early access to features, direct product team access, "Advisory Board" badge
- **Rotation:** cycle 3–5 members annually to keep perspectives fresh
- **Rules:** NDA for early-access features, feedback is advisory (not binding)

---

## Data Model

```sql
-- Current health score (latest calculated)
CREATE TABLE customer_health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  score SMALLINT NOT NULL CHECK (score >= 0 AND score <= 100),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('healthy', 'neutral', 'at_risk', 'critical')),
  usage_score SMALLINT,
  support_score SMALLINT,
  engagement_score SMALLINT,
  billing_score SMALLINT,
  signals JSONB NOT NULL,  -- { "login_frequency": { "raw": 3, "score": 65, "trend": "declining" }, ... }
  churn_risk_signals TEXT[] DEFAULT '{}',  -- array of active churn indicator names
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, calculated_at)
);

-- Historical scores for trending
CREATE INDEX idx_health_customer_time ON customer_health_scores(customer_id, calculated_at DESC);
-- Alert queries
CREATE INDEX idx_health_critical ON customer_health_scores(tier, calculated_at DESC)
  WHERE tier IN ('at_risk', 'critical');
-- Expansion queries
CREATE INDEX idx_health_expansion ON customer_health_scores(score, calculated_at DESC)
  WHERE score > 85;

-- Intervention tracking
CREATE TABLE health_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  trigger_score SMALLINT NOT NULL,
  trigger_tier VARCHAR(20) NOT NULL,
  intervention_type VARCHAR(30) NOT NULL,  -- 'proactive_checkin', 'critical_call', 'expansion', 'executive_escalation'
  assigned_to UUID REFERENCES agents(id),
  status VARCHAR(20) DEFAULT 'open',  -- 'open', 'in_progress', 'completed', 'cancelled'
  outcome VARCHAR(30),  -- 'recovered', 'churned', 'expanded', 'no_change'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### Recalculation Cadence

| Signal Type | Refresh Frequency | Reason |
|-------------|-------------------|--------|
| Billing events | Real-time | Payment failure needs immediate score update |
| Usage signals | Hourly | Login/feature usage is high-frequency |
| Support signals | Every 4 hours | Ticket updates are semi-frequent |
| Engagement signals | Daily | Email opens, community activity batch-processed |
| Full recalculation | Daily (batch) | Consolidate all signals, calculate trends |

### Quarterly Calibration

Every quarter:

1. **Export**: all customers who churned in the quarter + their health scores 90/60/30 days before churn
2. **Analyze**: which signals best predicted churn? Which were noise?
3. **Adjust weights**: increase weight of signals that correlated with churn, decrease weight of non-predictive signals
4. **Backtest**: recalculate historical scores with new weights, compare prediction accuracy
5. **Target**: health score < {{CX_CHURN_ALERT_THRESHOLD}} predicts churn within 90 days with > 70% accuracy
6. **Document**: record weight changes and rationale in decision log

---

## Implementation Checklist

- [ ] Define 3–5 key actions ("aha moments") for your product
- [ ] Set up data pipelines for all 4 signal categories (usage, support, engagement, billing)
- [ ] Implement score calculation engine with configurable weights per segment
- [ ] Define tier thresholds (healthy/neutral/at-risk/critical) — start with defaults above
- [ ] Build individual customer health view (score + signal breakdown + trend chart)
- [ ] Build aggregate health dashboard (distribution pie chart, at-risk list, trend line)
- [ ] Configure automated alerts for score drops (Slack + email)
- [ ] Write intervention playbooks for at-risk and critical tiers
- [ ] Set up automated intervention workflows (task creation, notifications, automation pausing)
- [ ] Configure expansion opportunity detection for healthy customers
- [ ] Connect health scores to NPS/CSAT data (see `nps-csat-automation.template.md`)
- [ ] Connect health scores to CX analytics dashboard (see `cx-analytics-dashboard.template.md`)
- [ ] Train CSMs on intervention playbooks and health score interpretation
- [ ] Set quarterly calibration review calendar
- [ ] Establish Voice of Customer program (feedback tagging + quarterly analysis)
- [ ] Set up Customer Advisory Board (recruit first 10 members)

---

## Placeholder Variables

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{CX_HEALTH_SCORE_WEIGHTS}}` | Signal category weights | `usage:40,support:20,engagement:20,billing:20` |
| `{{CX_CHURN_ALERT_THRESHOLD}}` | Score below which triggers churn alert | `40`, `30`, `25` |
| `{{CX_CSAT_TARGET}}` | CSAT target for support signal scoring | `4.2`, `4.5` |
| `{{CX_NPS_BENCHMARK}}` | NPS benchmark for engagement signal | `30`, `50` |
| `{{ENTITY_NAME}}` | Primary entity in your product | `project`, `workspace`, `campaign` |
