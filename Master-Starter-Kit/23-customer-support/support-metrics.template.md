# Support Metrics & KPI Dashboard — {{PROJECT_NAME}}

> You cannot improve what you do not measure. This dashboard tracks every metric that matters for support quality, cost, and effectiveness.

---

## Overview

This document defines the key performance indicators (KPIs) for {{PROJECT_NAME}} customer support, along with templates for weekly, monthly, and quarterly reviews. These metrics are not vanity numbers — every metric here drives a specific decision. If a metric does not change how you act, remove it.

**Platform:** {{SUPPORT_PLATFORM}}
**Reporting Owner:** [Support Lead / Head of Support]
**Dashboard Location:** [Link to live dashboard in {{SUPPORT_PLATFORM}} or analytics tool]

---

## Primary KPI Dashboard

| Metric | Target | Current | Trend (4 weeks) | Status |
|--------|--------|---------|------------------|--------|
| **First Response Time** | <{{FREE_TIER_SLA}} (Free), <4h (Paid) | | | |
| **Average Resolution Time** | <24 hours | | | |
| **CSAT Score** | >90% | | | |
| **Ticket Volume (weekly)** | Trending down | | | |
| **Self-Serve Resolution Rate** | >70% | | | |
| **Bot Resolution Rate** | >40% | | | |
| **Escalation Rate (L1 to L2)** | <30% | | | |
| **Escalation Rate (L2 to L3)** | <10% | | | |
| **KB Article Coverage** | >90% of common queries | | | |
| **Support Cost Per User** | <$2/user/month | | | |

**Status Legend:**
- On Target: Meeting or exceeding target
- At Risk: Within 10% of missing target
- Off Target: Missing target
- No Data: Not yet being tracked

---

## Detailed Metric Definitions

### First Response Time (FRT)

**Definition:** The elapsed time between when a user submits a ticket and when a human agent sends the first substantive reply. Automated acknowledgments do not count.

**Why it matters:** FRT is the user's first impression of your support quality. A fast first response (even if the issue is not yet resolved) tells the user they are not being ignored.

**How to measure:** {{SUPPORT_PLATFORM}} calculates this automatically. Ensure business hours are configured correctly for SLA-based calculations.

**Segmentation:**
| Segment | Target |
|---------|--------|
| Free tier | <{{FREE_TIER_SLA}} |
| Pro tier | <24 hours |
| Business tier | <4 hours |
| Enterprise tier | <1 hour |
| All tiers (blended) | <12 hours |

### Average Resolution Time (ART)

**Definition:** The elapsed time between when a user submits a ticket and when the issue is confirmed resolved. Paused time (awaiting customer reply) is excluded.

**Why it matters:** Resolution time is what users actually care about. A fast first response means nothing if the issue takes 2 weeks to resolve.

**Segmentation:**
| Segment | Target |
|---------|--------|
| All tickets (blended) | <24 hours |
| P0 bugs | <6 hours |
| P1 bugs | <5 days |
| How-to questions | <4 hours |
| Billing inquiries | <8 hours |
| Account issues | <12 hours |

### Customer Satisfaction Score (CSAT)

**Definition:** The percentage of users who rate their support experience as "Good" or "Great" (on a 2-point or 5-point scale) when surveyed after ticket resolution.

**Why it matters:** CSAT is the direct measure of support quality from the user's perspective. All other metrics are proxies; CSAT is the signal.

**How to measure:**
- Send a CSAT survey after every resolved ticket
- Use a simple 2-option survey: "Was this helpful?" (Yes / No) or a 5-star rating
- Target response rate: >30% of resolved tickets (if lower, your survey is too long or poorly timed)

**Target:** >90% positive (on a binary Good/Bad scale)

**Investigation triggers:**
- CSAT drops below 85% for any week: immediate investigation
- CSAT for a specific agent drops below 80%: coaching conversation
- CSAT for a specific ticket category drops below 80%: process review

### Ticket Volume

**Definition:** The total number of new support tickets created per week.

**Why it matters:** Ticket volume is the inverse measure of product quality and self-serve effectiveness. In a healthy product, ticket volume should grow slower than user growth. If tickets grow proportionally with users, your support does not scale.

**Key ratios:**
| Ratio | Target | Formula |
|-------|--------|---------|
| Tickets per 100 users (weekly) | <5 | (Weekly tickets / Active users) x 100 |
| Tickets per 100 new users (weekly) | <10 | (New user tickets / New users this week) x 100 |
| Ticket growth rate vs. user growth rate | Ticket growth < User growth | Month-over-month comparison |

### Self-Serve Resolution Rate

**Definition:** The percentage of support queries resolved without human intervention — through KB articles, bot responses, in-app help, or community answers.

**Why it matters:** This is the single best predictor of support scalability. Every 1% increase in self-serve rate reduces human ticket volume proportionally.

**How to measure:**
- KB: Track article views that do not result in a support ticket within 24 hours
- Bot: Track conversations resolved by the bot (user confirms or does not escalate)
- In-app help: Track tooltip/guide views vs. support tickets on that topic

**Target:** >70%

### Bot Resolution Rate

**Definition:** The percentage of chatbot conversations that are resolved without human handoff.

**Target:** >40%

**Breakdown:**
| Bot Outcome | Target % |
|-------------|----------|
| Resolved (user confirmed helpful) | >40% |
| Handed off to human | <50% |
| Abandoned (user left without resolution or escalation) | <10% |

### Escalation Rates

**L1 to L2:** Percentage of total incoming queries that require a human agent. Target: <30%.

**L2 to L3:** Percentage of human-handled tickets that require engineering involvement. Target: <10%.

**Why it matters:** High escalation rates mean either self-serve content is insufficient (L1 to L2) or product quality is poor (L2 to L3).

### KB Article Coverage

**Definition:** The percentage of common support queries that have a corresponding, up-to-date KB article.

**How to measure:**
1. List the top 50 ticket categories from the last quarter
2. For each category, check if an accurate, current KB article exists
3. Coverage = (categories with articles / total categories) x 100

**Target:** >90%

### Support Cost Per User

**Definition:** Total monthly support costs divided by total active users.

**Formula:**
```
Support Cost Per User = (Agent salaries + Platform costs + Tool costs + AI/bot costs) / Monthly Active Users
```

**Target:** <$2/user/month (for SaaS products). Adjust based on your pricing and margins.

**Benchmark by stage:**
| Stage | Typical Cost/User/Month |
|-------|------------------------|
| Early stage (<1K users) | $5-15 (high, acceptable) |
| Growth (1K-10K users) | $2-5 (optimize actively) |
| Scale (10K-100K users) | $0.50-2 (target range) |
| Enterprise (100K+ users) | $0.10-0.50 (highly optimized) |

---

## Weekly Support Review Template

Run this review every Monday morning. Takes 30 minutes. Involves the support lead and all active agents.

```markdown
# {{PROJECT_NAME}} Support — Weekly Review
**Week of:** [Date Range]
**Attendees:** [Names]

## Dashboard Snapshot
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| New tickets | | | |
| Resolved tickets | | | |
| Open tickets (backlog) | | | |
| First response time (avg) | | | |
| Resolution time (avg) | | | |
| CSAT score | | | |
| SLA compliance % | | | |
| Self-serve resolution rate | | | |
| Bot resolution rate | | | |
| L1→L2 escalation rate | | | |
| L2→L3 escalation rate | | | |

## Top 5 Ticket Categories This Week
| Rank | Category | Count | % of Total | KB Article Exists? |
|------|----------|-------|------------|-------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

## SLA Breaches
| Ticket # | Tier | SLA Target | Actual | Root Cause |
|----------|------|------------|--------|------------|
| | | | | |

## Notable Tickets
- [Ticket #X]: [Brief description — what made this notable (difficult, recurring, insightful)]
- [Ticket #Y]: [Brief description]

## Action Items
- [ ] [Action from this week's review]
- [ ] [Action carried over from last week]

## KB Updates Needed
- [ ] [Article to write or update based on this week's tickets]
- [ ] [Search query with no results that needs an article]

## Agent Highlights
- [Shout out an agent who handled a tough ticket well]
```

---

## Monthly Trend Analysis Template

Run on the first Monday of each month. Takes 1 hour. Involves support lead and product manager.

```markdown
# {{PROJECT_NAME}} Support — Monthly Trend Analysis
**Month:** [Month Year]
**Prepared by:** [Name]

## Monthly Summary
| Metric | This Month | Last Month | MoM Change | Target | Status |
|--------|-----------|-----------|------------|--------|--------|
| Total tickets | | | | | |
| Tickets / 100 users | | | | <5 | |
| Avg first response time | | | | | |
| Avg resolution time | | | | <24h | |
| CSAT score | | | | >90% | |
| SLA compliance | | | | >95% | |
| Self-serve rate | | | | >70% | |
| Bot resolution rate | | | | >40% | |
| Support cost / user | | | | <$2 | |

## Ticket Volume Trend (12-Month View)
| Month | Tickets | Active Users | Tickets/100 Users | Trend |
|-------|---------|-------------|-------------------|-------|
| [M-12] | | | | |
| [M-11] | | | | |
| ... | | | | |
| [Current] | | | | |

## Top Ticket Categories (Monthly Comparison)
| Category | This Month | Last Month | Change | Action |
|----------|-----------|-----------|--------|--------|
| | | | | |
| | | | | |
| | | | | |

## Recurring Issues (Tickets on the Same Problem, 3+ Times)
| Issue | Occurrences | Root Cause | Fix Status | Owner |
|-------|-------------|------------|------------|-------|
| | | | | |

## KB Effectiveness
- Articles published this month: [N]
- Articles updated this month: [N]
- Top searched terms with no results: [List]
- Estimated tickets prevented by KB: [N] (based on self-serve rate)

## Agent Performance
| Agent | Tickets Handled | Avg Resolution Time | CSAT | Notes |
|-------|----------------|--------------------|----|-------|
| | | | | |
| | | | | |

## Support-Driven Product Insights
- [Insight 1: What are users struggling with that could be fixed in the product?]
- [Insight 2: What feature requests keep coming up?]
- [Insight 3: What onboarding step causes the most confusion?]

## Next Month Priorities
1. [Priority based on data]
2. [Priority based on data]
3. [Priority based on data]
```

---

## Quarterly Strategy Review Template

Run at the end of each quarter. Takes 2 hours. Involves support lead, product manager, engineering lead, and head of customer success.

```markdown
# {{PROJECT_NAME}} Support — Quarterly Strategy Review
**Quarter:** [Q1/Q2/Q3/Q4 Year]
**Prepared by:** [Name]
**Attendees:** [Names]

## Quarterly Performance Summary
| KPI | Q Target | Q Actual | Status | Commentary |
|-----|----------|----------|--------|------------|
| CSAT | >90% | | | |
| SLA Compliance | >95% | | | |
| Self-Serve Rate | >70% | | | |
| Support Cost/User | <$2 | | | |
| Ticket Volume Trend | Declining ratio | | | |

## Top 10 Ticket Categories (Quarter)
| Rank | Category | Total Tickets | % of All | Avg Resolution | Trend vs Last Q |
|------|----------|--------------|----------|---------------|----------------|
| 1 | | | | | |
| 2 | | | | | |
| ... | | | | | |
| 10 | | | | | |

## Product Improvement Opportunities
Based on support data, these product changes would most reduce ticket volume:

| Opportunity | Estimated Ticket Reduction | Effort | Priority |
|-------------|---------------------------|--------|----------|
| [UX fix that would eliminate confusion] | [N tickets/month] | [S/M/L] | |
| [Missing feature causing workaround requests] | [N tickets/month] | [S/M/L] | |
| [Better error message that would prevent tickets] | [N tickets/month] | [S/M/L] | |

## Staffing Analysis
- Current team size: [N agents]
- Tickets per agent per day: [N]
- Projected volume next quarter: [N tickets/week]
- Staffing recommendation: [Hire / Maintain / Reduce]
- Optimal agent count: [N]

## Tool & Platform Review
- Current platform: {{SUPPORT_PLATFORM}}
- Platform satisfaction (team): [1-5]
- Missing capabilities: [List]
- Recommendation: [Stay / Evaluate alternatives / Migrate]

## Budget Review
| Cost Category | This Quarter | Last Quarter | Change |
|--------------|-------------|-------------|--------|
| Agent salaries | | | |
| Platform subscription | | | |
| AI/bot costs | | | |
| Tools (logging, session replay) | | | |
| Training | | | |
| **Total** | | | |

## Next Quarter Goals
1. [Specific, measurable goal based on data]
2. [Specific, measurable goal based on data]
3. [Specific, measurable goal based on data]
```

---

## Support-Driven Product Improvements Log

Track every product improvement that originated from support data. This log proves the ROI of treating support as product research.

| Date | Improvement | Source | Tickets Affected | Result |
|------|-------------|--------|-----------------|--------|
| | [What changed in the product] | [Ticket category / user feedback] | [How many tickets were about this] | [Did ticket volume for this category decrease?] |
| | | | | |
| | | | | |

**Review cadence:** Update weekly during the support review. Present to the product team monthly.

---

## Alert Thresholds

Configure these alerts in {{SUPPORT_PLATFORM}} or your monitoring tool:

| Alert | Trigger | Action | Notify |
|-------|---------|--------|--------|
| Ticket volume spike | >150% of weekly average | Investigate cause (incident? feature launch? broken flow?) | Support Lead |
| CSAT drop | <85% for any day | Review recent tickets for quality issues | Support Lead |
| SLA breach | Any tier | Immediate re-assignment | Support Lead |
| Unassigned ticket | >1 hour in queue | Auto-assign or alert | All agents |
| Agent overload | >30 tickets/day for any agent | Redistribute workload | Support Lead |
| Bot failure rate spike | Bot resolution <20% for any day | Check KB content, bot configuration | Support Lead + Engineering |
| Escalation spike (L2→L3) | >20% of L2 tickets escalated | Product quality investigation | Support Lead + Engineering Lead |

---

## Benchmarks by Company Stage

Use these benchmarks to calibrate your targets. Adjust based on your specific product, market, and user base.

| Metric | Seed Stage | Series A | Series B+ | Enterprise |
|--------|-----------|---------|----------|------------|
| CSAT | >80% | >85% | >90% | >95% |
| First Response Time | <24h | <12h | <4h | <1h |
| Self-Serve Rate | >40% | >55% | >70% | >80% |
| Tickets/100 Users | <15 | <10 | <5 | <2 |
| Support Cost/User | <$10 | <$5 | <$2 | <$1 |
| Agent Utilization | N/A (founder does support) | 70-80% | 75-85% | 80-90% |
