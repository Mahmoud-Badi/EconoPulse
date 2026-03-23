# CX Analytics Dashboard

> {{PROJECT_NAME}} — One dashboard to see the health of your entire customer experience. From first touch to renewal.

---

## Overview

Most teams have support metrics scattered across their ticketing platform, survey tool, product analytics, and spreadsheets. This document designs a unified CX dashboard that puts everything in one place — real-time operations, self-service effectiveness, support performance, customer health, feedback pulse, and team metrics.

**Cross-references:**
- For support-specific KPIs, see `23-customer-support/support-metrics.template.md` — this dashboard extends those metrics
- For customer health scoring, see `customer-health-scoring.template.md`
- For NPS/CSAT data, see `nps-csat-automation.template.md`
- For chatbot performance, see `ai-support-chatbot-blueprint.template.md`

---

## Dashboard Architecture

### Data Sources

| Source | Data | Integration |
|--------|------|-------------|
| {{SUPPORT_PLATFORM}} | Tickets, conversations, agent activity | API / webhook |
| Product analytics | Usage events, login frequency, feature adoption | Event stream / warehouse |
| Billing system | Payment status, plan changes, revenue | API / warehouse |
| NPS/CSAT tool | Survey responses, scores | API / webhook |
| Health scoring engine | Customer scores, signals | Internal DB |
| KB analytics | Search queries, article views, helpfulness | API / warehouse |
| Chatbot engine | Conversations, resolution rate, confidence | Internal DB |

### Aggregation Layer

```
Data Sources → ETL Pipeline → Data Warehouse → Dashboard Views

Option A: Direct DB views (< 10K customers, simple queries)
Option B: Data warehouse — BigQuery / Snowflake / Redshift (complex analytics)
Option C: Postgres read replica with materialized views (mid-scale)
```

### Visualization Tool Decision

| Tool | Best For | Cost | Learning Curve |
|------|----------|------|---------------|
| Metabase | Self-hosted, SQL-first, quick setup | Free (OSS) | Low |
| Looker | Enterprise, governed metrics, complex models | $$$$ | High |
| Grafana | Real-time operational dashboards, alerting | Free (OSS) | Medium |
| Retool | Internal dashboards with actions | $10-50/user/mo | Low |
| Custom (Next.js + Recharts) | Embedded, full brand control | Engineering time | High |

**Recommendation:** Start with Metabase. Migrate when you need governed metrics or embedded dashboards.

### Refresh Cadence

| Section | Refresh | Why |
|---------|---------|-----|
| Real-Time Operations | Every 5 min | Agents need current queue state |
| Self-Service | Hourly | Content gaps are semi-urgent |
| Support Operations | Hourly | SLA tracking needs near-real-time |
| Customer Health | Daily | Scores calculated daily |
| Feedback Pulse | Daily | Detractor alerts urgent, trends daily |
| Team Performance | Daily | Reviews are periodic |
| Executive Summary | Weekly (auto) | Leadership cadence |

---

## Section 1: Real-Time Operations

**Purpose:** Operational awareness for support managers and on-duty agents.

| Metric | Visualization | Alert Threshold |
|--------|---------------|----------------|
| Open conversations (by channel) | Stacked bar chart | > 50 unassigned |
| Queue depth (unassigned) | Single number + trend | > 20 |
| Average wait time (current) | Single number | > 5 minutes |
| Agent availability | Status grid (online/offline/away) | < 2 agents online |
| Active chatbot conversations | Single number | > 100 concurrent |
| SLA compliance (rolling 24h) | Gauge (%) | < 90% |
| Active incidents | Banner | Any active incident |

**Layout:**
```
┌───────────┬───────────┬───────────┬───────────┬───────────┐
│  Queue:12 │ Wait: 2m  │ SLA: 94%  │ Agents: 5 │ Bot: 23   │
│   ↑ +3    │   ↓ -1m   │   ↑ +2%   │  online   │  active   │
├───────────┴───────────┴───────────┴───────────┴───────────┤
│  [Stacked bar: open conversations by channel over 24h]     │
├───────────────────────────────────────────────────────────-─┤
│  Agent Status Grid                                          │
│  🟢 Alice (4 open)  🟢 Bob (6 open)  🟡 Carol (away)      │
│  🟢 Dave (3 open)   🔴 Eve (offline)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 2: Self-Service Effectiveness

**Purpose:** Measure whether self-service deflects tickets.

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| KB search volume (daily) | Trend tracking | N/A — context metric |
| Zero-result search rate | < 5% | Add missing content |
| Top zero-result queries | Review weekly | Create articles for top queries |
| KB article helpfulness | > 70% helpful | Rewrite low-rated articles |
| Chatbot resolution rate | > 40% | Improve training data/prompts |
| Chatbot confidence distribution | Histogram | Address low-confidence areas |
| Troubleshooter completion rate | > 60% | Improve troubleshooter flows |
| Ticket deflection rate | > 70% | Invest in self-service content |

### Deflection Funnel

```
Users with questions: 1000
    ↓
Searched KB: 700 (70%)
    ↓
Found article: 630 (90% of searchers)
    ↓
Article helpful: 504 (80% of finders)
    ↓
Created ticket anyway: 196 (19.6% of total)
    ↓
Deflection rate: 80.4%
```

**Key insight:** Zero-result queries + ticket topics without KB articles = your content gap list. Review weekly.

---

## Section 3: Support Operations

**Purpose:** Track team performance against SLA targets.

| Metric | Target | Visualization |
|--------|--------|---------------|
| Tickets created vs. resolved (30d) | Resolved ≥ Created | Dual line chart |
| Avg first response time (by channel) | Within SLA | Table + trend arrows |
| Avg resolution time (by priority) | P1:4h P2:8h P3:24h P4:72h | Table |
| First contact resolution rate | > 60% | Percentage + trend |
| Escalation rate (L1→L2, L2→L3) | L1→L2: <20%, L2→L3: <5% | Funnel chart |
| Cost per resolution (by channel) | Trend tracking | Bar chart |
| Ticket volume by category | Trend tracking | Pie chart + trend |
| SLA breach count (7-day) | 0 | Number (red if > 0) |
| Agent utilization rate | 60-80% | Per-agent bar chart |
| Reopen rate | < 10% | Percentage + trend |

**Cross-ref:** `23-customer-support/support-metrics.template.md` defines these KPIs in detail.

---

## Section 4: Customer Health Overview

**Purpose:** Proactive churn risk management.

| Metric | Visualization |
|--------|---------------|
| Health distribution | Pie (healthy/neutral/at-risk/critical) |
| Customer count by tier | 4 cards (green/yellow/orange/red) |
| At-risk list | Table: name, score, top signal, CSM, days in tier |
| Critical list | Table: same, sorted by urgency |
| Health score 30-day trend | Line chart (avg score) |
| Churn forecast | 3 numbers: predicted churns 30/60/90 days |
| Recovery rate | % at-risk→neutral/healthy in last 30 days |
| Expansion pipeline | Table: healthy customers near plan limits |

**Action panel:** Auto-generated list of "customers needing attention today."

---

## Section 5: Feedback Pulse

**Purpose:** Customer sentiment tracking.

| Metric | Visualization |
|--------|---------------|
| NPS (current) | Number + trend + vs. {{CX_NPS_BENCHMARK}} |
| NPS distribution | Horizontal bar (0-10) |
| NPS by segment | Table: segment, score, respondents, trend |
| CSAT by touchpoint | Table + sparklines: support, chat, onboarding |
| CES by workflow | Horizontal bar (ranked, lowest first) |
| Top 5 feedback themes (30d) | Ranked list with volume |
| Detractor count (7d) | Number + uncontacted list |
| Detractor recovery funnel | Funnel: contacted→responded→recovered |
| Promoter activation rate | % who took action (review/referral) |
| Survey response rates | Table by type |

---

## Section 6: Team Performance

**Purpose:** People management and capacity planning.

| Metric | Visualization |
|--------|---------------|
| Agent leaderboard | Table: handled, CSAT, QA, FCR |
| Team CSAT trend (30d) | Line chart |
| QA score distribution | Histogram (all agents) |
| Onboarding progress | Table: new agents, week, scores |
| Capacity utilization | Bar: tickets/agent vs. target |
| Schedule adherence | %: actual vs. planned hours |

---

## Section 7: Executive Summary

**Purpose:** Single-page monthly CX health for leadership.

```
┌──────────────────────────────────────────────────────────────┐
│               CX Executive Summary — {{month}}                │
├─────────┬──────────┬──────────┬──────────┬───────────────────┤
│   NPS   │   CSAT   │  Health  │  Churn   │ Cost/Contact      │
│   +42   │   4.3    │ 72% hlth │  2.1%    │   $4.50           │
│  (↑ +5) │ (↑ 0.2) │  (↑ 4%) │  (↓ 0.3) │   (↓ $0.50)      │
├─────────┴──────────┴──────────┴──────────┴───────────────────┤
│ Top 3 Wins                      │ Top 3 Risks                │
│ 1. Chatbot resolution +12%     │ 1. Enterprise CSAT down    │
│ 2. KB deflection hit 75%       │ 2. Agent turnover risk (2) │
│ 3. Detractor recovery 45%      │ 3. Checkout CES low        │
├─────────────────────────────────┴────────────────────────────┤
│ Recommendation: Invest in checkout flow UX — lowest CES,     │
│ highest ticket volume. Est. ticket reduction: 15%.           │
└──────────────────────────────────────────────────────────────┘
```

**Automated delivery:**
- Weekly → Slack #cx-metrics + email to CX team
- Monthly executive summary → email to VP Product, COO, CEO

---

## CX Funnel Metrics

| Stage | Key Metrics | Source |
|-------|-------------|--------|
| Trial → Activation | Time-to-value, onboarding completion, key actions | Product analytics |
| Activation → Support | Days to first contact, self-service ratio | {{SUPPORT_PLATFORM}} + KB |
| Support → Resolution | Resolution time, CSAT, effort score | {{SUPPORT_PLATFORM}} + surveys |
| Resolution → Retention | Health score, renewal rate, churn rate | Health scoring + billing |
| Retention → Expansion | Upsell rate, referrals, promoter actions | Billing + NPS |

Visualize as a funnel with conversion rates at each stage and week-over-week trends.

---

## Alert Configuration

### Real-Time (Slack)

| Condition | Recipient |
|-----------|-----------|
| Queue > 20 unassigned | On-duty team lead |
| Wait time > 5 min | On-duty team lead |
| SLA breach occurs | Team lead + agent |
| Chatbot resolution < 30% | CX lead |
| System outage detected | All agents |

### Daily (Email)

| Condition | Recipient |
|-----------|-----------|
| CSAT below {{CX_CSAT_TARGET}} (30d rolling) | CX lead |
| Customer enters critical tier | CX lead + assigned CSM |
| Chatbot avg confidence < 0.6 | CX engineering |
| Zero-result rate > 5% | KB manager |

### Weekly (Email)

| Condition | Recipient |
|-----------|-----------|
| NPS 90d trend drops 10+ points | VP Product + CX lead |
| Team QA avg below {{CX_QA_PASS_SCORE}} | CX manager |
| Agent utilization > 85% for 3+ agents | CX manager |
| Feedback theme with 20+ untagged mentions | Product team |

---

## Data Model for Reporting

### Key Materialized Views

```sql
-- Daily CX snapshot
CREATE MATERIALIZED VIEW daily_cx_metrics AS
SELECT
  date_trunc('day', NOW()) AS metric_date,
  (SELECT COUNT(*) FROM conversations
   WHERE DATE(created_at) = CURRENT_DATE) AS tickets_created,
  (SELECT COUNT(*) FROM conversations
   WHERE DATE(resolved_at) = CURRENT_DATE) AS tickets_resolved,
  (SELECT AVG(EXTRACT(EPOCH FROM first_response_at - created_at) / 60)
   FROM conversations
   WHERE DATE(created_at) = CURRENT_DATE
   AND first_response_at IS NOT NULL) AS avg_first_response_min,
  (SELECT AVG(score) FROM survey_responses
   WHERE type = 'csat'
   AND DATE(created_at) = CURRENT_DATE) AS daily_csat,
  (SELECT COUNT(*) FILTER (WHERE results_count = 0)::FLOAT /
   NULLIF(COUNT(*), 0)
   FROM kb_searches
   WHERE DATE(created_at) = CURRENT_DATE) AS zero_result_rate,
  (SELECT COUNT(*) FROM customer_health_scores
   WHERE tier = 'critical'
   AND calculated_at = (SELECT MAX(calculated_at)
                        FROM customer_health_scores)) AS critical_customers;

-- Per-agent daily performance
CREATE MATERIALIZED VIEW agent_daily_performance AS
SELECT
  agent_id,
  DATE(resolved_at) AS metric_date,
  COUNT(*) AS tickets_handled,
  AVG(EXTRACT(EPOCH FROM resolved_at - created_at) / 3600) AS avg_resolution_hours,
  AVG(csat_score) AS avg_csat,
  COUNT(*) FILTER (WHERE reopened_count > 0)::FLOAT /
    NULLIF(COUNT(*), 0) AS reopen_rate,
  COUNT(*) FILTER (WHERE escalation_count = 0)::FLOAT /
    NULLIF(COUNT(*), 0) AS first_contact_resolution_rate
FROM conversations
WHERE resolved_at IS NOT NULL
GROUP BY agent_id, DATE(resolved_at);
```

---

## Implementation Checklist

- [ ] Set up data pipelines from all sources ({{SUPPORT_PLATFORM}}, analytics, billing, surveys, health)
- [ ] Choose dashboard tool ({{CX_DASHBOARD_TOOL}})
- [ ] Create materialized views for reporting
- [ ] Build Section 1: Real-Time Operations (highest immediate value)
- [ ] Build Section 3: Support Operations (core metrics)
- [ ] Build Section 2: Self-Service Effectiveness
- [ ] Build Section 4: Customer Health
- [ ] Build Section 5: Feedback Pulse
- [ ] Build Section 6: Team Performance
- [ ] Build Section 7: Executive Summary
- [ ] Configure alerting (Slack real-time, email daily/weekly)
- [ ] Set up automated weekly report to CX team
- [ ] Set up automated monthly executive summary
- [ ] Train team on dashboard and metric definitions
- [ ] Quarterly review: refine metrics, remove unused, add new

---

## Cross-References

- **Unified metrics registry**: `35-business-intelligence/metrics-hub/unified-metrics-registry.template.md` — all CX metrics from this file are mapped into the enterprise metrics hierarchy with warehouse tables and alert thresholds
- **Data warehouse**: `35-business-intelligence/data-warehouse-architecture.template.md` — complete data warehouse and ETL pipeline design for connecting CX data to the enterprise BI layer
- **Executive reporting**: `35-business-intelligence/executive-reporting/departmental-dashboards.template.md` — support departmental dashboard that consumes CX metrics alongside product and financial data
- **Cross-domain analysis**: The unified warehouse in Section 35 enables analyses not possible with siloed CX data — for example, correlating customer health scores with revenue retention, or linking support ticket volume to feature adoption patterns
