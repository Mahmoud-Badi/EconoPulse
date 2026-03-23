# OKR & KPI Tracking Framework

> **Owner:** {{STAKEHOLDER_CEO}} / Chief of Staff
> **Refresh cadence:** Weekly (KPIs), Monthly (OKR check-ins), Quarterly (OKR setting & retrospective)
> **Project:** {{PROJECT_NAME}}

---

## Purpose

This template provides the complete framework for setting, cascading, tracking, and scoring Objectives and Key Results (OKRs), alongside the standing KPI dashboard that monitors business health independent of quarterly goals. OKRs drive strategic focus. KPIs monitor operational health. Both are required; neither is sufficient alone.

---

## Table of Contents

1. [OKR Framework](#1-okr-framework)
2. [KPI Tree Structure](#2-kpi-tree-structure)
3. [Quarterly OKR Setting Template](#3-quarterly-okr-setting-template)
4. [Weekly KPI Review Dashboard](#4-weekly-kpi-review-dashboard)
5. [Monthly OKR Check-In Template](#5-monthly-okr-check-in-template)
6. [Quarterly OKR Retrospective](#6-quarterly-okr-retrospective)
7. [KPI Ownership Matrix](#7-kpi-ownership-matrix)
8. [Health Indicators & Thresholds](#8-health-indicators--thresholds)
9. [Integration with Unified Metrics Registry](#9-integration-with-unified-metrics-registry)

---

## 1. OKR Framework

### Principles

1. **OKRs are not a task list.** They describe outcomes, not outputs. "Launch feature X" is a task. "Increase activation rate from 30% to 45%" is a key result.
2. **Set ambitious targets.** A 0.7 score (70% achievement) is the target, not 1.0. If everyone scores 1.0, the objectives weren't ambitious enough.
3. **OKRs cascade, not duplicate.** Company OKRs set direction. Department OKRs contribute to company OKRs. Team OKRs contribute to department OKRs. They should NOT be copies of each other.
4. **3-5 objectives per level, 2-4 key results per objective.** More than this creates dilution.
5. **Weekly check-ins, not quarterly surprises.** OKRs that are set in January and reviewed in March are post-mortems, not management tools.

### Scoring Methodology

| Score | Meaning | Color |
|---|---|---|
| 0.0-0.3 | Failed to make meaningful progress | Red |
| 0.4-0.6 | Made progress but fell short of target | Yellow |
| 0.7 | Achieved target — this IS the goal | Green |
| 0.8-1.0 | Exceeded expectations | Blue |

**Scoring rules:**
- Key Results are scored on a 0.0-1.0 scale based on the actual metric vs the target.
- Objective score = average of its Key Result scores.
- Company score = weighted average of Objective scores (weight by strategic importance, not equal-weight).
- A score of 1.0 on every KR means targets were not ambitious. Recalibrate next quarter.
- A score of < 0.3 on a KR requires a written explanation: was it the wrong target, wrong approach, or wrong priority?

### OKR vs KPI — When to Use Which

| | OKR | KPI |
|---|---|---|
| Purpose | Drive strategic change | Monitor operational health |
| Cadence | Quarterly (change each quarter) | Standing (persist until deprecated) |
| Target | Ambitious (0.7 = success) | Threshold-based (green/yellow/red) |
| Scope | 3-5 objectives, focused | 15-30 metrics, comprehensive |
| Example | "Increase D30 retention from 22% to 35%" | "D30 retention" (monitored continuously) |

---

## 2. KPI Tree Structure

A KPI tree decomposes company-level metrics into department-level and team-level leading indicators. This ensures that when a company KPI moves, you can trace it to the team-level driver.

### Company-Level KPIs (Lagging Indicators)

```
Revenue (ARR)
├── New ARR
│   ├── [Marketing] Qualified leads
│   │   ├── [Marketing] Traffic by channel
│   │   ├── [Marketing] Lead conversion rate
│   │   └── [Marketing] Content engagement
│   ├── [Sales] Pipeline conversion
│   │   ├── [Sales] Demo-to-trial rate
│   │   ├── [Sales] Trial-to-paid rate
│   │   └── [Sales] Average deal size
│   └── [Product] Self-serve conversion
│       ├── [Product] Signup rate
│       ├── [Product] Activation rate
│       └── [Product] Free-to-paid rate
├── Expansion ARR
│   ├── [CS] Upsell pipeline
│   ├── [Product] Feature adoption (upgrade triggers)
│   └── [Product] Usage growth (seat/usage expansion)
└── Retained ARR (= ARR - Churn - Contraction)
    ├── [CS] Customer health scores
    ├── [Product] Retention rate (D30/D90)
    ├── [Support] Resolution time
    └── [Engineering] Uptime / reliability

Efficiency
├── CAC Payback
│   ├── [Marketing] CAC by channel
│   └── [Finance] Gross margin
├── Burn Multiple
│   ├── [Finance] Total burn rate
│   └── Revenue growth (above)
└── Revenue per Employee
    ├── [HR] Headcount
    └── Revenue (above)
```

### Reading the KPI Tree

- **Top-level (company):** These are lagging indicators — they tell you what already happened.
- **Mid-level (department):** These are leading indicators for the level above. If marketing qualified leads drop, new ARR will follow.
- **Bottom-level (team):** These are the most actionable, fastest-moving indicators. Teams should monitor these daily/weekly.

### Key Principle: Each Branch Has ONE Owner

Every node in the KPI tree has a single owner (person, not team). That owner is responsible for the metric, its data quality, and its trajectory. Shared ownership means no ownership.

---

## 3. Quarterly OKR Setting Template

### Company-Level OKR Template

```markdown
# Company OKRs — Q[X] {{CURRENT_YEAR}}

## Objective 1: [Outcome-oriented statement]
> Owner: [Name, Title]
> Strategic theme: [Growth / Efficiency / Product / Team]
> Weight: [XX%] of company OKR score

### Key Result 1.1: [Metric from X to Y]
- Current value: [X]
- Target value: [Y]
- Measurement: [How and where the metric is measured]
- Data source: [System/dashboard]
- Update frequency: [Weekly/Bi-weekly]
- Owner: [Name]

### Key Result 1.2: [Metric from X to Y]
- Current value: [X]
- Target value: [Y]
- Measurement: [How and where]
- Data source: [System/dashboard]
- Update frequency: [Weekly/Bi-weekly]
- Owner: [Name]

### Key Result 1.3: [Metric from X to Y]
- Current value: [X]
- Target value: [Y]
- Measurement: [How and where]
- Data source: [System/dashboard]
- Update frequency: [Weekly/Bi-weekly]
- Owner: [Name]

---

## Objective 2: [Outcome-oriented statement]
> Owner: [Name, Title]
> Strategic theme: [Growth / Efficiency / Product / Team]
> Weight: [XX%]

[Key Results follow same pattern]

---

## Objective 3: [Outcome-oriented statement]
[...]
```

### OKR Quality Checklist

Before finalizing OKRs for the quarter, validate each one:

- [ ] **Outcome, not output:** Does the KR describe a result, not an activity?
- [ ] **Measurable:** Is there an unambiguous number that can be pulled from a system?
- [ ] **Ambitious but possible:** Would achieving 70% represent meaningful progress?
- [ ] **Time-bound:** Can this be measured within the quarter?
- [ ] **Within control:** Can the owner influence this metric through their work?
- [ ] **Connected upward:** Does this KR clearly contribute to a company-level objective?
- [ ] **Not duplicated:** Is this KR unique, or is another team already tracking it?
- [ ] **Data available:** Can we actually measure this TODAY, or does instrumentation need to happen first?

### Cascading Template

| Company Objective | Department OKR | Team OKR |
|---|---|---|
| Increase ARR from $1M to $1.5M | [Marketing] Increase qualified leads from 500 to 800/month | [Content] Increase organic traffic from 10K to 18K/month |
| | [Sales] Improve demo-to-close rate from 15% to 22% | [AE team] Increase average deal size from $500 to $700 |
| | [Product] Improve free-to-paid conversion from 3% to 5% | [Growth] Reduce time-to-activation from 48h to 24h |

---

## 4. Weekly KPI Review Dashboard

### Dashboard Layout

The weekly KPI review should fit on a single screen. It is NOT a deep-dive — it is a health check.

```
┌─────────────────────────────────────────────────────────┐
│                    WEEKLY KPI DASHBOARD                  │
│                  Week of {{REPORT_DATE}}                 │
├─────────────────┬───────────────────────────────────────┤
│  REVENUE        │  PRODUCT                              │
│  ● MRR: $XXX    │  ● DAU: X,XXX                        │
│  ● New MRR: $XX │  ● Activation: XX%                   │
│  ● Churn: X.X%  │  ● D7 Retention: XX%                 │
│  ● NRR: XXX%    │  ● NPS: XX                            │
├─────────────────┼───────────────────────────────────────┤
│  SALES          │  ENGINEERING                          │
│  ● Pipeline: $XX│  ● Deploys: XX                        │
│  ● Win rate: XX%│  ● Uptime: XX.XX%                     │
│  ● Deals closed:│  ● MTTR: XXh                          │
│    XX           │  ● Open P1 bugs: X                    │
├─────────────────┼───────────────────────────────────────┤
│  MARKETING      │  FINANCE                              │
│  ● MQLs: XXX    │  ● Cash: $X.XM                        │
│  ● CAC: $XXX    │  ● Runway: XX mo                      │
│  ● Traffic: XXXK│  ● Burn: $XXK/mo                      │
│  ● MQL→SQL: XX% │  ● Headcount: XX                      │
└─────────────────┴───────────────────────────────────────┘

   🟢 On Track    🟡 At Risk    🔴 Off Track
```

### Weekly Review Meeting Agenda (30 minutes)

| Time | Activity | Who |
|---|---|---|
| 0-5 min | Dashboard scan — any red metrics? | All |
| 5-15 min | Deep-dive on 1-2 red/yellow metrics | Metric owners |
| 15-25 min | OKR progress update (quick round-robin) | OKR owners |
| 25-30 min | Action items and blockers | All |

### Rules for Weekly Review

1. **No presentation.** Everyone reads the dashboard in the first 5 minutes silently.
2. **Only discuss exceptions.** Green metrics need zero discussion time.
3. **Root cause, not status.** "Churn is red" is not useful. "Churn is red because Enterprise Account X left due to missing Feature Y" is useful.
4. **Action items must have owners and dates.** "We should look into this" is not an action item.
5. **Maximum 30 minutes.** If a topic needs more time, schedule a separate deep-dive.

---

## 5. Monthly OKR Check-In Template

### Monthly Check-In Format

```markdown
# Monthly OKR Check-In — [Month] {{CURRENT_YEAR}}

## Objective 1: [Statement]

### KR 1.1: [Metric from X to Y]
- **Current value:** [Z]
- **Score (if quarter ended today):** [0.X]
- **Trajectory:** On track / At risk / Off track
- **Commentary:** [What happened this month, what's planned for next month]
- **Blockers:** [Any blockers requiring escalation]

### KR 1.2: [Metric from X to Y]
- **Current value:** [Z]
- **Score:** [0.X]
- **Trajectory:** [...]
- **Commentary:** [...]
- **Blockers:** [...]

---

## Objective 2: [Statement]
[Same format]

---

## Summary Table

| KR | Start | Current | Target | Score | Trajectory |
|---|---|---|---|---|---|
| KR 1.1 | X | Z | Y | 0.X | ● |
| KR 1.2 | X | Z | Y | 0.X | ● |
| KR 2.1 | X | Z | Y | 0.X | ● |
| KR 2.2 | X | Z | Y | 0.X | ● |
| KR 3.1 | X | Z | Y | 0.X | ● |

## Decisions Needed
- [Any decisions that are blocking OKR progress]

## Proposed Adjustments
- [If a KR needs to be modified mid-quarter, propose the change and rationale]
```

### Mid-Quarter Adjustment Rules

- **Can change the approach** (how you achieve the KR) at any time.
- **Can deprioritize a KR** if circumstances change materially (e.g., market shift, key hire leaves). Must be discussed in check-in, not silently dropped.
- **Cannot change the target** to make it easier. If the target was wrong, acknowledge it and score accordingly at end of quarter.
- **Can add a new KR** if a critical opportunity or risk emerges, but only by deprioritizing an existing one (total KR count stays constant).

---

## 6. Quarterly OKR Retrospective

### Retrospective Template

```markdown
# OKR Retrospective — Q[X] {{CURRENT_YEAR}}

## Scoring Summary

| Objective | Weight | Score | Rating |
|---|---|---|---|
| Objective 1: [Statement] | XX% | 0.XX | ● |
| Objective 2: [Statement] | XX% | 0.XX | ● |
| Objective 3: [Statement] | XX% | 0.XX | ● |
| **Company Weighted Average** | **100%** | **0.XX** | **●** |

## Detailed Scoring

### Objective 1: [Statement] — Score: 0.XX

| Key Result | Start | End | Target | Score | Notes |
|---|---|---|---|---|---|
| KR 1.1 | X | Z | Y | 0.XX | [Why this score] |
| KR 1.2 | X | Z | Y | 0.XX | [Why this score] |
| KR 1.3 | X | Z | Y | 0.XX | [Why this score] |

**What worked:**
- [Specific tactic or decision that drove progress]

**What didn't work:**
- [Specific approach that failed or underdelivered]

**What we learned:**
- [Insight that will inform next quarter]

---

[Repeat for each Objective]

---

## Cross-Quarter Trends

| Metric | Q-2 | Q-1 | This Q | Trend |
|---|---|---|---|---|
| Company OKR score | 0.XX | 0.XX | 0.XX | ↑/↓/→ |
| % of KRs scored 0.7+ | XX% | XX% | XX% | ↑/↓/→ |
| % of KRs scored < 0.3 | XX% | XX% | XX% | ↑/↓/→ |

## Calibration Check

- If > 80% of KRs scored 0.7+: **Targets were too easy.** Increase ambition next quarter.
- If > 50% of KRs scored < 0.3: **Targets were unrealistic OR execution failed.** Investigate which.
- If scores cluster around 0.5-0.7: **Healthy.** Ambition and execution are well-calibrated.

## Inputs to Next Quarter

- [OKR themes or specific objectives to carry forward]
- [New strategic priorities to introduce]
- [OKRs to explicitly NOT continue and why]
```

---

## 7. KPI Ownership Matrix

### Matrix Structure

| KPI | Definition | Owner | Reviewer | Source System | Update Frequency | Automated? | Dashboard |
|---|---|---|---|---|---|---|---|
| MRR | Monthly recurring revenue | CFO | CEO | Billing system | Daily | Yes | Revenue |
| ARR | MRR x 12 | CFO | CEO | Calculated | Daily | Yes | Revenue |
| New MRR | MRR from first-time customers | VP Sales | CFO | Billing + CRM | Weekly | Yes | Revenue |
| Logo Churn Rate | % accounts lost / beginning accounts | VP CS | CEO | Billing system | Monthly | Yes | Customer |
| Revenue Churn Rate | % MRR lost / beginning MRR | CFO | CEO | Billing system | Monthly | Yes | Revenue |
| NRR | Net revenue retention (trailing 12m) | CFO | CEO | Calculated | Monthly | Yes | Unit Economics |
| DAU | Daily active users | VP Product | CEO | Analytics | Daily | Yes | Product |
| D30 Retention | % of cohort active at day 30 | VP Product | CEO | Analytics | Weekly | Yes | Product |
| Activation Rate | % signups completing core action | VP Product | VP Marketing | Analytics | Weekly | Yes | Product |
| CAC (Blended) | S&M spend / new customers | VP Marketing | CFO | Finance + CRM | Monthly | Semi | Unit Economics |
| LTV | Cohort-based lifetime value | VP Analytics | CFO | Calculated | Monthly | Semi | Unit Economics |
| Pipeline Value | Weighted pipeline, next 90 days | VP Sales | CRO | CRM | Weekly | Yes | Sales |
| Deployment Frequency | Production deploys per period | VP Eng | CTO | CI/CD | Daily | Yes | Engineering |
| Uptime | System availability % | VP Eng | CTO | Monitoring | Real-time | Yes | Engineering |
| Cash Runway | Months of cash remaining | CFO | CEO | Accounting | Monthly | Semi | Finance |
| Burn Rate | Monthly net cash outflow | CFO | CEO | Accounting | Monthly | Semi | Finance |
| eNPS | Employee net promoter score | VP People | CEO | Survey tool | Quarterly | Semi | People |
| Headcount | Total employees | VP People | CEO | HRIS | Weekly | Yes | People |

### Ownership Rules

1. **One owner per KPI.** The owner is the person who will investigate when the metric moves unexpectedly. Not a team, not a committee — a person.
2. **Reviewer is the owner's manager** or a cross-functional stakeholder who uses the metric for their own decisions.
3. **Automated = Yes** means the metric updates without human intervention. **Semi** means it requires a manual step (e.g., expense categorization). **No** means someone pulls it manually.
4. **If a KPI has no owner, delete it.** Unowned metrics become stale and misleading.
5. **Ownership transfers require explicit handoff.** When someone leaves or changes roles, KPI ownership must be formally reassigned.

---

## 8. Health Indicators & Thresholds

### Traffic Light System

Every KPI has three thresholds defining its health state:

| State | Icon | Meaning | Action Required |
|---|---|---|---|
| On Track | Green | Metric is at or better than target | None — continue monitoring |
| At Risk | Yellow | Metric is within warning range — could degrade to off-track | Owner investigates and reports in weekly review |
| Off Track | Red | Metric has breached the critical threshold | Owner presents root cause and action plan within 48 hours |

### Threshold Configuration

| KPI | Green (On Track) | Yellow (At Risk) | Red (Off Track) |
|---|---|---|---|
| Monthly MRR Growth | > 8% | 5-8% | < 5% |
| Logo Churn Rate | < 3% | 3-5% | > 5% |
| Revenue Churn Rate | < 2% | 2-4% | > 4% |
| NRR (T12M) | > 110% | 100-110% | < 100% |
| D30 Retention | > 30% | 20-30% | < 20% |
| Activation Rate | > 50% | 35-50% | < 35% |
| CAC Payback | < 12 months | 12-18 months | > 18 months |
| Uptime | > 99.9% | 99.5-99.9% | < 99.5% |
| Cash Runway | > 18 months | 12-18 months | < 12 months |
| Burn Multiple | < 2x | 2-3x | > 3x |

> **Customize thresholds for {{PROJECT_NAME}}.** These are starting points based on industry benchmarks. Adjust based on your stage, segment, and strategic priorities.

### Threshold Review Cadence

Review and adjust thresholds quarterly as part of the OKR retrospective. As the company matures, thresholds should tighten (higher expectations). As strategy shifts, thresholds may emphasize different metrics.

### Escalation Protocol

| Severity | Trigger | Response Time | Escalation Path |
|---|---|---|---|
| Yellow (single week) | KPI enters yellow zone | Next weekly review | Owner presents in weekly meeting |
| Yellow (2+ consecutive weeks) | KPI stays yellow for 2+ weeks | Within 48 hours | Owner + reviewer develop action plan |
| Red (single occurrence) | KPI enters red zone | Within 24 hours | Owner notifies CEO, presents root cause |
| Red (2+ consecutive weeks) | KPI stays red for 2+ weeks | Immediate | CEO reviews in dedicated meeting; resource reallocation considered |

---

## 9. Integration with Unified Metrics Registry

### Metrics Registry Alignment

Every KPI in this framework must have a corresponding entry in the unified metrics registry (see `../metrics-hub/`). The registry ensures:

1. **Single definition:** Each metric is defined exactly once. No "my DAU" vs "your DAU."
2. **Single source of truth:** Each metric has one authoritative data source.
3. **Consistent calculation:** The formula is documented and tested.
4. **Version history:** When definitions change, the change is logged.

### Registry Entry Format

For each KPI, the metrics registry should contain:

```yaml
metric_name: "net_revenue_retention"
display_name: "Net Revenue Retention (NRR)"
definition: >
  Revenue retained from existing customers including expansion,
  excluding new customer revenue. Trailing 12-month calculation.
formula: "(Beginning MRR - Contraction - Churn + Expansion) / Beginning MRR x 100"
unit: "percentage"
direction: "higher_is_better"
source_system: "billing_system"
source_table: "mrr_waterfall"
owner: "{{STAKEHOLDER_CFO}}"
update_frequency: "monthly"
granularity: ["company", "segment", "geography"]
thresholds:
  green: "> 110%"
  yellow: "100-110%"
  red: "< 100%"
related_okrs: ["Objective 1: Improve revenue durability"]
dashboard: "unit-economics"
created: "{{CURRENT_DATE}}"
last_modified: "{{CURRENT_DATE}}"
```

### Preventing Metric Drift

| Risk | Prevention |
|---|---|
| Two teams use different DAU definitions | Registry enforces single definition; dashboards pull from same source |
| Metric calculation changes without notice | Registry requires version history; change triggers notification to all stakeholders |
| New metric created that overlaps existing | Registry review required before adding new metrics |
| Metric becomes stale (no one updates it) | Quarterly audit: any metric not updated in 2+ months is flagged for review or deprecation |
