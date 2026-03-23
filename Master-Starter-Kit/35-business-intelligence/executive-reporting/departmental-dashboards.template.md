# Departmental Dashboards

> **Owner:** Business Intelligence / Revenue Operations
> **Refresh cadence:** Varies by department (see individual dashboards)
> **Project:** {{PROJECT_NAME}}
> **Dashboard platform:** {{BI_DEPARTMENT_DASHBOARDS}}

---

## Purpose

This template defines six department-level dashboards, each purpose-built for its audience. Every dashboard has a defined purpose, primary and secondary metrics, visualization layout, refresh cadence, and access control. These dashboards sit between the executive-level board deck and the team-level operational tools.

---

## Table of Contents

1. [Product Dashboard](#1-product-dashboard)
2. [Engineering Dashboard](#2-engineering-dashboard)
3. [Sales Dashboard](#3-sales-dashboard)
4. [Marketing Dashboard](#4-marketing-dashboard)
5. [Support Dashboard](#5-support-dashboard)
6. [Finance Dashboard](#6-finance-dashboard)
7. [Dashboard Lifecycle Management](#7-dashboard-lifecycle-management)

---

## 1. Product Dashboard

### Purpose

Enable the product team to understand user behavior, measure feature impact, and identify opportunities for activation and retention improvement. This dashboard is the product team's daily companion — it should answer "how are users experiencing the product?" without requiring ad-hoc queries.

### Access Control

| Role | Access Level |
|---|---|
| VP Product, Product Managers | Full access, edit |
| Engineering leads | View access |
| CEO, CRO | View access |
| All other departments | No access (prevents misinterpretation of product metrics without context) |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| Real-time metrics (DAU, active sessions) | Every 15 minutes |
| Daily metrics (retention, activation) | Daily at 06:00 UTC |
| Weekly metrics (cohort analysis, feature adoption) | Weekly on Monday |

### Primary Metrics

#### 1.1 DAU / WAU / MAU

| Metric | Definition | Visualization |
|---|---|---|
| DAU | Unique users performing {{BI_CORE_ACTION_EVENT}} in a calendar day | Line chart, 30-day trend with 7-day moving average |
| WAU | Unique users performing core action in trailing 7 days | Line chart, 12-week trend |
| MAU | Unique users performing core action in trailing 30 days | Line chart, 12-month trend |
| DAU/MAU Ratio | DAU / MAU | Single number with trend arrow; benchmark: 20-25% (average), 40%+ (excellent) |

**Segmentation:** By plan tier, geography, acquisition channel, platform (web/mobile/API).

#### 1.2 Activation Funnel

| Step | Metric | Target |
|---|---|---|
| Signup | Unique signups | — |
| Account Setup | % completing profile/onboarding | > 80% |
| First Core Action | % performing core action within 48h | > 60% |
| Integration | % connecting at least one integration | > 40% |
| Habit Formation | % active on 3+ days in first 14 days | > 25% |

**Visualization:** Horizontal funnel with conversion rates between each step. Comparison overlay showing current week vs 4-week average.

**Cross-reference:** Section 20 `post-launch-metrics-dashboard.template.md`

#### 1.3 Feature Adoption

| Feature | Adoption Rate | Weekly Trend | Power User % | Correlation to Retention |
|---|---|---|---|---|
| Feature A | XX% | ↑/↓/→ | XX% | High/Medium/Low |
| Feature B | XX% | ↑/↓/→ | XX% | High/Medium/Low |
| Feature C | XX% | ↑/↓/→ | XX% | High/Medium/Low |

**Definition:** Adoption rate = % of MAU who used the feature at least once in the past 30 days.
**Power user %** = % of feature users who used it 10+ times in the past 30 days.

**Visualization:** Horizontal bar chart sorted by adoption rate. Color-code by correlation to retention.

#### 1.4 Feature Usage Heatmap

**Visualization:** Matrix heatmap with features on the Y-axis and time (day of week or hour of day) on the X-axis. Cell color = usage intensity. Reveals when users engage with which features — useful for scheduling maintenance windows and release timing.

### Secondary Metrics

#### 1.5 Power User Analysis

| Metric | Definition |
|---|---|
| Power user threshold | Users in the top 10% by action frequency |
| Power user count | Number of users above threshold |
| Power user retention | D90 retention for power users vs all users |
| Power user revenue | ARPU of power users vs average |
| Feature overlap | What features do power users use that others don't? |

#### 1.6 Session Analytics

| Metric | Value | Trend |
|---|---|---|
| Avg sessions per DAU | — | — |
| Avg session duration | — | — |
| Avg actions per session | — | — |
| Bounce rate (single-page sessions) | — | — |

---

## 2. Engineering Dashboard

### Purpose

Give engineering leadership visibility into delivery velocity, system reliability, and technical health. This dashboard answers: "Are we shipping effectively and keeping the lights on?"

### Access Control

| Role | Access Level |
|---|---|
| CTO, VP Engineering, Engineering Managers | Full access, edit |
| VP Product | View access |
| CEO | View access (summary section only) |
| SRE / DevOps | Full access |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| System health (uptime, error rates) | Real-time |
| DORA metrics | Daily |
| Sprint metrics | End of sprint |
| Tech debt index | Monthly |

### Primary Metrics: DORA Framework

#### 2.1 Deployment Frequency

| Period | Deploys | Per Day Average | Trend |
|---|---|---|---|
| This week | — | — | — |
| Last week | — | — | — |
| This month | — | — | — |
| Last month | — | — | — |

**Benchmarks:**
| Category | Frequency |
|---|---|
| Elite | Multiple per day |
| High | Weekly to monthly |
| Medium | Monthly to semi-annually |
| Low | Less than semi-annually |

**Visualization:** Bar chart, weekly deployment count over 12 weeks.

#### 2.2 Lead Time for Changes

**Definition:** Time from first commit to production deployment.

| Period | Median Lead Time | P90 Lead Time | Trend |
|---|---|---|---|
| This month | — | — | — |
| Last month | — | — | — |

**Benchmarks:**
| Category | Lead Time |
|---|---|
| Elite | < 1 hour |
| High | 1 day to 1 week |
| Medium | 1 week to 1 month |
| Low | > 1 month |

#### 2.3 Change Failure Rate

**Definition:** % of deployments that cause a production incident (P1 or P2).

| Period | Total Deploys | Failed Deploys | Failure Rate | Trend |
|---|---|---|---|---|
| This month | — | — | —% | — |
| Last month | — | — | —% | — |

**Benchmarks:**
| Category | Failure Rate |
|---|---|
| Elite | 0-5% |
| High | 5-10% |
| Medium | 10-15% |
| Low | > 15% |

#### 2.4 Mean Time to Recovery (MTTR)

**Definition:** Average time from incident detection to production resolution.

| Severity | This Month MTTR | Last Month MTTR | Target | Trend |
|---|---|---|---|---|
| P1 (Critical) | — | — | < 1 hour | — |
| P2 (Major) | — | — | < 4 hours | — |
| P3 (Minor) | — | — | < 24 hours | — |

**Benchmarks:**
| Category | MTTR |
|---|---|
| Elite | < 1 hour |
| High | < 1 day |
| Medium | 1 day to 1 week |
| Low | > 1 week |

**Visualization:** DORA metrics as a 2x2 quadrant: top-left = deployment frequency, top-right = lead time, bottom-left = change failure rate, bottom-right = MTTR. Each cell shows the metric value, benchmark category, and trend arrow.

### Secondary Metrics

#### 2.5 Tech Debt Index

| Category | Count | Severity | Estimated Effort | Priority |
|---|---|---|---|---|
| Code quality issues | — | — | — | — |
| Infrastructure debt | — | — | — | — |
| Dependency updates | — | — | — | — |
| Documentation gaps | — | — | — | — |
| Test coverage gaps | — | — | — | — |
| **Total** | **—** | — | **—** | — |

**Visualization:** Stacked bar chart showing tech debt by category over time. Should trend downward (or at least not grow faster than the codebase).

#### 2.6 Sprint Velocity

| Sprint | Committed | Completed | Completion Rate | Velocity (points) |
|---|---|---|---|---|
| Sprint N | — | — | —% | — |
| Sprint N-1 | — | — | —% | — |
| Sprint N-2 | — | — | —% | — |
| Sprint N-3 | — | — | —% | — |
| Sprint N-4 | — | — | —% | — |
| Sprint N-5 | — | — | —% | — |

**6-sprint average velocity:** —
**Trend:** — (only compare a team's velocity to its own history, never to other teams)

#### 2.7 Bug Resolution Time

| Severity | Open Bugs | Avg Age | Avg Resolution Time | Target Resolution |
|---|---|---|---|---|
| P1 (Critical) | — | — | — | < 4 hours |
| P2 (Major) | — | — | — | < 24 hours |
| P3 (Minor) | — | — | — | < 1 week |
| P4 (Low) | — | — | — | < 1 month |

**Cross-reference:** Section 21 `incident-response-runbook.template.md`

---

## 3. Sales Dashboard

### Purpose

Enable sales leadership to manage pipeline, forecast revenue, and optimize the sales motion. This dashboard answers: "Will we hit our number, and if not, what needs to change?"

### Access Control

| Role | Access Level |
|---|---|
| CRO, VP Sales, Sales Managers | Full access, edit |
| Sales reps | View access (own metrics only) |
| CEO, CFO | View access |
| Marketing (demand gen) | View access (pipeline source metrics only) |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| Pipeline and deal data | Real-time (synced from CRM) |
| Conversion rates | Daily |
| Forecast | Weekly |
| Quota attainment | Monthly |

### Primary Metrics

#### 3.1 Pipeline Value

| Stage | Deals | Total Value | Weighted Value | Avg Deal Size | Avg Age |
|---|---|---|---|---|---|
| Qualification | — | $— | $— | $— | — days |
| Discovery | — | $— | $— | $— | — days |
| Proposal | — | $— | $— | $— | — days |
| Negotiation | — | $— | $— | $— | — days |
| Closed Won | — | $— | — | $— | — days |
| Closed Lost | — | $— | — | $— | — days |
| **Total Active** | **—** | **$—** | **$—** | **$—** | **—** |

**Visualization:** Horizontal funnel with deal counts and dollar values at each stage.

#### 3.2 Conversion Rates by Stage

| Transition | This Month | Last Month | Quarterly Avg | Trend |
|---|---|---|---|---|
| Lead → Qualification | —% | —% | —% | — |
| Qualification → Discovery | —% | —% | —% | — |
| Discovery → Proposal | —% | —% | —% | — |
| Proposal → Negotiation | —% | —% | —% | — |
| Negotiation → Closed Won | —% | —% | —% | — |
| **Overall (Lead → Won)** | **—%** | **—%** | **—%** | **—** |

#### 3.3 Sales Cycle Length

| Segment | This Month | Last Month | Target | Trend |
|---|---|---|---|---|
| SMB | — days | — days | — days | — |
| Mid-Market | — days | — days | — days | — |
| Enterprise | — days | — days | — days | — |

#### 3.4 Quota Attainment

| Rep / Team | Quota | Closed | Attainment | Pipeline Coverage |
|---|---|---|---|---|
| [Rep/Team 1] | $— | $— | —% | —x |
| [Rep/Team 2] | $— | $— | —% | —x |
| [Rep/Team 3] | $— | $— | —% | —x |
| **Total** | **$—** | **$—** | **—%** | **—x** |

**Pipeline coverage** = Weighted pipeline / Remaining quota. Target: 3x coverage.

#### 3.5 Forecast Accuracy

| Month | Forecast (BOM) | Actual | Variance | Accuracy |
|---|---|---|---|---|
| — | $— | $— | $— | —% |
| — | $— | $— | $— | —% |
| — | $— | $— | $— | —% |

**Target accuracy:** Within +/- 10% of beginning-of-month forecast.

**Cross-reference:** Section 19 `sales-funnel.template.md`

---

## 4. Marketing Dashboard

### Purpose

Enable marketing leadership to optimize demand generation, measure campaign effectiveness, and track brand health. This dashboard answers: "Are we generating enough qualified demand at acceptable cost?"

### Access Control

| Role | Access Level |
|---|---|
| CMO, VP Marketing, Marketing Managers | Full access, edit |
| Sales leadership | View access (lead/pipeline metrics) |
| CEO, CFO | View access |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| Traffic and engagement | Daily |
| Lead metrics | Daily |
| Campaign ROI | Weekly |
| Brand metrics | Monthly |

### Primary Metrics

#### 4.1 Traffic by Channel

| Channel | Sessions | % of Total | MoM Change | Conversion Rate |
|---|---|---|---|---|
| Organic Search | — | —% | —% | —% |
| Direct | — | —% | —% | —% |
| Paid Search | — | —% | —% | —% |
| Paid Social | — | —% | —% | —% |
| Referral | — | —% | —% | —% |
| Email | — | —% | —% | —% |
| Social Organic | — | —% | —% | —% |
| **Total** | **—** | **100%** | **—%** | **—%** |

**Visualization:** Stacked area chart showing traffic by channel over 6 months.

#### 4.2 MQL / SQL Conversion Funnel

| Stage | Count | Conversion Rate | Avg Time to Next Stage |
|---|---|---|---|
| Visitors | — | — | — |
| Leads (form fills) | — | —% | — days |
| MQLs (marketing qualified) | — | —% | — days |
| SQLs (sales qualified) | — | —% | — days |
| Opportunities | — | —% | — days |
| Customers | — | —% | — days |

**Visualization:** Funnel chart with conversion rates between each stage.

#### 4.3 CAC by Channel

| Channel | Spend | New Customers | CAC | LTV:CAC | Trend |
|---|---|---|---|---|---|
| Organic | $— | — | $— | —:1 | — |
| Paid Search | $— | — | $— | —:1 | — |
| Paid Social | $— | — | $— | —:1 | — |
| Content | $— | — | $— | —:1 | — |
| Events | $— | — | $— | —:1 | — |
| **Blended** | **$—** | **—** | **$—** | **—:1** | **—** |

#### 4.4 Content Engagement

| Content Piece / Campaign | Views | Engagement Rate | Leads Generated | Cost per Lead |
|---|---|---|---|---|
| [Content 1] | — | —% | — | $— |
| [Content 2] | — | —% | — | $— |
| [Content 3] | — | —% | — | $— |

#### 4.5 Email Metrics

| Campaign Type | Sent | Open Rate | Click Rate | Unsubscribe Rate | Leads |
|---|---|---|---|---|---|
| Newsletter | — | —% | —% | —% | — |
| Nurture sequence | — | —% | —% | —% | — |
| Product updates | — | —% | —% | —% | — |
| Event invitations | — | —% | —% | —% | — |

### Secondary Metrics

#### 4.6 Social Media Reach

| Platform | Followers | Engagement Rate | Impressions | Top Post Performance |
|---|---|---|---|---|
| LinkedIn | — | —% | — | — |
| Twitter/X | — | —% | — | — |
| Other | — | —% | — | — |

---

## 5. Support Dashboard

### Purpose

Enable support leadership to manage team capacity, measure service quality, and identify product issues surfacing through support channels. This dashboard answers: "Are we serving customers well, and what is support telling us about the product?"

### Access Control

| Role | Access Level |
|---|---|
| VP Support, Support Managers | Full access, edit |
| Support agents | View access (own metrics) |
| VP Product | View access (issue trending data) |
| CEO | View access (summary) |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| Ticket volume and SLA | Real-time |
| Agent metrics | Daily |
| CSAT | Per-ticket (after resolution) |
| Trend analysis | Weekly |

### Primary Metrics

#### 5.1 Ticket Volume

| Period | New Tickets | Resolved | Net Change | Backlog |
|---|---|---|---|---|
| Today | — | — | — | — |
| This week | — | — | — | — |
| This month | — | — | — | — |
| Last month | — | — | — | — |

**Visualization:** Dual-line chart: new tickets vs resolved tickets over time. Area between lines = backlog growth/reduction.

**Segmentation:** By channel (email, chat, phone, self-serve), by priority, by category (bug, how-to, feature request, billing).

#### 5.2 First Response Time

| Priority | Target | Median | P90 | % Meeting SLA |
|---|---|---|---|---|
| P1 (Critical) | < 15 min | — | — | —% |
| P2 (High) | < 1 hour | — | — | —% |
| P3 (Normal) | < 4 hours | — | — | —% |
| P4 (Low) | < 24 hours | — | — | —% |

#### 5.3 Resolution Time

| Priority | Target | Median | P90 | % Meeting SLA |
|---|---|---|---|---|
| P1 (Critical) | < 4 hours | — | — | —% |
| P2 (High) | < 24 hours | — | — | —% |
| P3 (Normal) | < 3 days | — | — | —% |
| P4 (Low) | < 7 days | — | — | —% |

#### 5.4 Customer Satisfaction (CSAT)

| Period | Responses | CSAT Score | Response Rate | Trend |
|---|---|---|---|---|
| This week | — | — / 5.0 | —% | — |
| This month | — | — / 5.0 | —% | — |
| Last month | — | — / 5.0 | —% | — |

**Distribution:** Show % of 1-star, 2-star, 3-star, 4-star, 5-star ratings. Averages hide bimodal distributions.

#### 5.5 Deflection Rate

**Definition:** % of support inquiries resolved without human agent involvement (self-serve docs, chatbot, automated responses).

| Channel | Inquiries | Deflected | Deflection Rate | Trend |
|---|---|---|---|---|
| Help center search | — | — | —% | — |
| Chatbot | — | — | —% | — |
| Email auto-response | — | — | —% | — |
| **Total** | **—** | **—** | **—%** | **—** |

### Secondary Metrics

#### 5.6 Backlog Age Distribution

| Age Bucket | Tickets | % of Backlog |
|---|---|---|
| < 1 day | — | —% |
| 1-3 days | — | —% |
| 3-7 days | — | —% |
| 7-14 days | — | —% |
| 14-30 days | — | —% |
| > 30 days | — | —% |

**Visualization:** Horizontal stacked bar. Tickets > 14 days old should be highlighted in red.

#### 5.7 Agent Utilization

| Agent / Team | Tickets Handled | Avg Handle Time | Utilization % | CSAT |
|---|---|---|---|---|
| [Agent/Team 1] | — | — | —% | — |
| [Agent/Team 2] | — | — | —% | — |
| [Agent/Team 3] | — | — | —% | — |

**Cross-reference:** Section 33 `feedback-collection-system.template.md`

---

## 6. Finance Dashboard

### Purpose

Give the finance team and executive leadership real-time visibility into financial health. This dashboard answers: "How much money do we have, how fast are we spending it, and when do we need more?"

### Access Control

| Role | Access Level |
|---|---|
| CFO, Finance team | Full access, edit |
| CEO | Full view access |
| Board members | View access (summary section via board portal) |
| Department heads | View access (own department budget vs actual) |

### Refresh Cadence

| Metric Type | Refresh |
|---|---|
| MRR / ARR | Daily |
| Cash position | Daily |
| Budget vs actual | Monthly (after close) |
| Runway | Monthly |

### Primary Metrics

#### 6.1 MRR / ARR

| Metric | Current | Previous Month | MoM Change | Plan | Variance |
|---|---|---|---|---|---|
| MRR | $— | $— | —% | $— | —% |
| ARR | $— | $— | —% | $— | —% |

**Visualization:** Line chart showing MRR over 12 months with plan overlay. Shaded area between actual and plan.

**Cross-reference:** `mrr-arr-waterfall.template.md`

#### 6.2 Cash Position & Runway

| Metric | Value |
|---|---|
| Cash on hand | $— |
| Monthly burn rate (trailing 3-month avg) | $— |
| Runway at current burn | — months |
| Runway at planned burn | — months |

**Visualization:** Area chart projecting cash position over next 18 months with burn-rate scenarios (current, planned, best case, worst case).

**Cross-reference:** Section 25 `runway-burn-rate.template.md`

#### 6.3 Burn Rate Trend

| Month | Revenue | Expenses | Net Burn | Gross Burn |
|---|---|---|---|---|
| — | $— | $— | $— | $— |
| — | $— | $— | $— | $— |
| — | $— | $— | $— | $— |
| — | $— | $— | $— | $— |
| — | $— | $— | $— | $— |
| — | $— | $— | $— | $— |

**Definitions:**
- **Gross burn** = total monthly expenses (ignoring revenue).
- **Net burn** = total expenses minus total revenue.

#### 6.4 Revenue per Employee

| Period | Revenue (ARR) | Headcount | Rev/Employee | Benchmark |
|---|---|---|---|---|
| Current | $— | — | $— | $— |
| 6 months ago | $— | — | $— | — |
| 12 months ago | $— | — | $— | — |

**Benchmark targets:**
| Stage | Revenue per Employee |
|---|---|
| Series A | $50K - $100K |
| Series B | $100K - $200K |
| Series C+ | $150K - $300K |
| Public SaaS | $200K - $400K |

#### 6.5 Accounts Receivable Aging

| Age Bucket | Amount | % of Total | Count |
|---|---|---|---|
| Current (0-30 days) | $— | —% | — |
| 31-60 days | $— | —% | — |
| 61-90 days | $— | —% | — |
| > 90 days | $— | —% | — |
| **Total** | **$—** | **100%** | **—** |

#### 6.6 Budget vs Actual

| Department | Budget (MTD) | Actual (MTD) | Variance | Variance % |
|---|---|---|---|---|
| Engineering | $— | $— | $— | —% |
| Sales | $— | $— | $— | —% |
| Marketing | $— | $— | $— | —% |
| Support | $— | $— | $— | —% |
| G&A | $— | $— | $— | —% |
| **Total** | **$—** | **$—** | **$—** | **—%** |

**Cross-reference:** Section 25 financial templates

---

## 7. Dashboard Lifecycle Management

### Creation Process

| Step | Activity | Owner | Deliverable |
|---|---|---|---|
| 1 | Define dashboard purpose and audience | Department head | Purpose statement, access list |
| 2 | Identify metrics (primary and secondary) | Department head + BI | Metric list with definitions |
| 3 | Validate data availability | BI / Data Engineering | Data source audit |
| 4 | Design layout and visualizations | BI | Wireframe |
| 5 | Build and test | BI / Data Engineering | Working dashboard |
| 6 | User acceptance testing | Department head | Sign-off |
| 7 | Launch and train | BI | Documentation, training session |
| 8 | Post-launch review (30 days) | BI + Department head | Adoption metrics, feedback |

### Review Cadence

| Activity | Frequency | Owner |
|---|---|---|
| Data quality audit | Monthly | BI team |
| Metric relevance review | Quarterly | Department head + BI |
| Dashboard performance (load time, usage) | Monthly | BI team |
| Access control review | Quarterly | BI team + Security |
| Full dashboard audit | Annually | BI team |

### Deprecation Criteria

A dashboard should be deprecated when any of the following are true:

| Criterion | Check |
|---|---|
| No one has viewed it in 30+ days | Dashboard platform analytics |
| The metrics are available in another dashboard | Cross-reference audit |
| The business question it answers is no longer relevant | Department head confirmation |
| The data source is unreliable or deprecated | Data engineering confirmation |
| Maintenance cost exceeds value | BI team assessment |

### Deprecation Process

1. **Flag for deprecation:** BI team identifies candidate and notifies stakeholders.
2. **30-day notice:** Dashboard is marked "Scheduled for deprecation" with a banner.
3. **Usage monitoring:** Track whether anyone accesses it during the notice period.
4. **Archive or delete:** If no objections after 30 days, archive the dashboard (keep queries and config). Delete from active dashboard platform.
5. **Document:** Note the deprecation in the dashboard registry with reason and date.

### Cross-References to Source Sections

| Dashboard | Primary Data Sources | Template Cross-References |
|---|---|---|
| Product | Analytics platform, event tracking | Section 20 analytics templates |
| Engineering | CI/CD, monitoring, project management | Section 21 `incident-response-runbook.template.md`, Section 34 |
| Sales | CRM, billing system | Section 19 `sales-funnel.template.md` |
| Marketing | Analytics, marketing automation, ad platforms | Section 33 `feedback-collection-system.template.md` |
| Support | Helpdesk, CRM, knowledge base | Section 33 |
| Finance | Accounting system, billing, HR | Section 25 financial templates |
