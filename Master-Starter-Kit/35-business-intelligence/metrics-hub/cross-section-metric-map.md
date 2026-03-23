# Cross-Section Metric Map

> The Rosetta Stone of {{PROJECT_NAME}}'s metrics. This document traces every key metric from its original definition through the data pipeline to its final destination on a dashboard or board deck. When you need to answer "where does this number come from?" — start here.

---

## How to Read This Map

Each metric lineage follows the same structure:

```
Metric Name
  Defined in:     The kit section and file where this metric's business definition lives
  Raw data from:  The source system and specific data (tables, events, API endpoints)
  ETL pipeline:   The extraction and loading path into the warehouse
  Transform:      The transformation model that computes the final metric
  Warehouse:      The analytics table and column where the production value lives
  Dashboard:      The dashboard(s) that display this metric to end users
  Board deck:     The board deck slide that features this metric (if applicable)
  Alert:          The threshold that triggers notification (links to alert-threshold-registry)
  Owner:          The person/team accountable for data quality
```

---

## Cross-Section Dependency Diagram

```
Section 11 (Analytics Tracking)
  │  Event taxonomy, tracking plan, raw application events
  │
  ├──→ Section 19 (Marketing)
  │      Marketing KPIs, channel attribution, funnel metrics
  │      │
  ├──→ Section 20 (Post-Launch)
  │      DAU/MAU, feature adoption, uptime, latency, error rates
  │      │
  ├──→ Section 25 (Financial Modeling)
  │      MRR, ARR, unit economics, cohort LTV, projections
  │      │
  ├──→ Section 33 (CX Operations)
  │      NPS, CSAT, health scores, support metrics
  │      │
  └──→ Section 32 (Integrations)
         Integration health, API success rates, sync status
         │
         ▼
  ┌─────────────────────────────────────────────────────┐
  │  Section 35: Business Intelligence                   │
  │                                                     │
  │  ETL Pipeline → Warehouse → Transformation Layer    │
  │       │                          │                  │
  │       ▼                          ▼                  │
  │  Unified Metrics Registry ← dbt Models              │
  │       │                                             │
  │       ├──→ Departmental Dashboards                  │
  │       ├──→ Executive Dashboards                     │
  │       ├──→ Board Deck                               │
  │       └──→ Alert Threshold Registry                 │
  └─────────────────────────────────────────────────────┘
```

---

## Revenue & Growth Lineage

### Monthly Recurring Revenue (MRR)

```
MRR
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  {{BILLING_PROVIDER}} (subscriptions table: plan_id, status, amount, interval, start_date, end_date)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.billing_subscriptions → staging.stg_subscriptions
  Transform:      dbt model: marts/finance/fct_mrr_current.sql (normalizes annual/quarterly to monthly, filters active only)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_mrr_current.mrr_amount
  Dashboard:      Executive > Revenue & Growth (departmental-dashboards.template.md)
  Board deck:     Slide 3: Revenue Overview (board-deck-templates.template.md)
  Alert:          < {{MRR_FLOOR}} triggers #finance-alerts (alert-threshold-registry.template.md)
  Owner:          {{BI_METRIC_OWNER_DEFAULT}} / Finance
```

### Net New MRR & MRR Waterfall Components

```
Net New MRR (New + Expansion - Contraction - Churn + Reactivation)
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  {{BILLING_PROVIDER}} (subscription change events: upgrades, downgrades, cancellations, reactivations)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.billing_subscription_events → staging.stg_subscription_events
  Transform:      dbt model: marts/finance/fct_mrr_movements.sql (classifies each subscription change into movement type)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_mrr_movements (movement_type, mrr_change, effective_date)
  Dashboard:      Executive > Revenue & Growth, MRR Waterfall (mrr-arr-waterfall.template.md)
  Board deck:     Slide 3: MRR Bridge Chart (board-deck-templates.template.md)
  Alert:          Negative Net New MRR for 2 consecutive months triggers #executive-alerts
  Owner:          {{BI_METRIC_OWNER_DEFAULT}} / Finance
```

### Net Revenue Retention (NRR)

```
NRR
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  {{BILLING_PROVIDER}} (subscriptions, invoices, credits — full billing history per account)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.billing_subscriptions + raw.billing_invoices → staging.stg_subscriptions
  Transform:      dbt model: marts/finance/fct_nrr_cohorts.sql (cohort-based: takes starting MRR per cohort, tracks through expansion/contraction/churn)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_nrr_cohorts.nrr_percentage
  Dashboard:      Executive > Revenue & Growth, Unit Economics (unit-economics-dashboard.template.md)
  Board deck:     Slide 4: Retention & Expansion (board-deck-templates.template.md)
  Alert:          < 90% triggers #finance-alerts (alert-threshold-registry.template.md)
  Owner:          {{BI_METRIC_OWNER_DEFAULT}} / Finance
```

### Quick Ratio

```
Quick Ratio
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  Derived entirely from MRR movement components (no additional source)
  ETL pipeline:   N/A — computed from fct_mrr_movements
  Transform:      dbt model: marts/finance/fct_mrr_summary.sql (aggregates movements by type, computes ratio)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_mrr_summary.quick_ratio
  Dashboard:      Executive > Revenue & Growth
  Board deck:     Slide 3: Growth Efficiency indicator
  Alert:          < 2.0 triggers #finance-alerts
  Owner:          Finance
```

---

## Unit Economics Lineage

### Customer Acquisition Cost (CAC)

```
CAC
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md, 19-marketing/kpi-dashboard.template.md
  Raw data from:  {{ACCOUNTING_PROVIDER}} (sales & marketing GL accounts), {{AD_PLATFORMS}} (ad spend by channel), payroll system (S&M headcount costs)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.accounting_transactions + raw.ad_platform_spend → staging.stg_acquisition_costs
  Transform:      dbt model: marts/finance/fct_unit_economics.sql (aggregates all S&M costs, divides by new customer count from fct_mrr_movements)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_unit_economics.cac_blended
  Dashboard:      Unit Economics (unit-economics-dashboard.template.md), Marketing > Channel Performance
  Board deck:     Slide 5: Unit Economics (board-deck-templates.template.md)
  Alert:          > {{CAC_CEILING}} triggers #finance-alerts
  Owner:          Marketing / Finance (joint — Marketing owns spend inputs, Finance owns the calculation)
```

### Lifetime Value (LTV) & LTV:CAC Ratio

```
LTV
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  {{BILLING_PROVIDER}} (ARPU from subscriptions), cost allocation (gross margin), churn rate (from fct_churn_analysis)
  ETL pipeline:   N/A — derived from other warehouse tables
  Transform:      dbt model: marts/finance/fct_unit_economics.sql (ARPU * gross_margin_pct * (1 / monthly_churn_rate))
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_unit_economics.ltv_estimated
  Dashboard:      Unit Economics, Board Deck Slide 5
  Board deck:     Slide 5: LTV:CAC chart (board-deck-templates.template.md)
  Alert:          LTV:CAC < 3:1 triggers #finance-alerts
  Owner:          Finance
```

### CAC Payback Period

```
CAC Payback Period
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md
  Raw data from:  Derived from CAC, ARPU, and Gross Margin (no additional source)
  ETL pipeline:   N/A — computed in fct_unit_economics
  Transform:      dbt model: marts/finance/fct_unit_economics.sql (CAC / (ARPU * gross_margin_pct))
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_unit_economics.cac_payback_months
  Dashboard:      Unit Economics (unit-economics-dashboard.template.md)
  Board deck:     Slide 5: Payback indicator
  Alert:          > 18 months triggers #finance-alerts
  Owner:          Finance
```

---

## Product Health Lineage

### DAU / WAU / MAU

```
DAU / WAU / MAU
  Defined in:     20-post-launch/health-metrics.template.md
  Raw data from:  {{ANALYTICS_PROVIDER}} (page_view, feature_used, and other qualifying events with user_id and timestamp)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.analytics_events → staging.stg_user_events (deduplicated, bot-filtered)
  Transform:      dbt model: marts/product/fct_active_users.sql (COUNT DISTINCT user_id over 1-day, 7-day, 28-day rolling windows)
  Warehouse:      analytics_{{PROJECT_NAME}}.product.fct_active_users.dau / .wau / .mau
  Dashboard:      Product Health (departmental-dashboards.template.md), Executive > Product
  Board deck:     Slide 7: Product & Engagement (board-deck-templates.template.md)
  Alert:          DAU decline > 15% WoW triggers #product-alerts
  Owner:          Product
```

### Activation Rate & Time to Value

```
Activation Rate
  Defined in:     20-post-launch/health-metrics.template.md
  Raw data from:  Application events (signup_completed, {{ACTIVATION_MILESTONE}} events with user_id and timestamps)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.app_events → staging.stg_user_events
  Transform:      dbt model: marts/product/fct_activation_funnel.sql (joins signup events with activation events, calculates time delta and conversion)
  Warehouse:      analytics_{{PROJECT_NAME}}.product.fct_activation_funnel.activation_rate / .median_time_to_value
  Dashboard:      Product Health, Growth > Activation funnel
  Board deck:     Slide 7: Activation rate trend
  Alert:          Activation rate < 25% triggers #product-alerts
  Owner:          Product / Growth
```

### Feature Adoption Rate

```
Feature Adoption Rate
  Defined in:     20-post-launch/health-metrics.template.md
  Raw data from:  {{ANALYTICS_PROVIDER}} (feature_used events with feature_name, user_id)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.analytics_events → staging.stg_feature_events
  Transform:      dbt model: marts/product/fct_feature_adoption.sql (per-feature user count / MAU)
  Warehouse:      analytics_{{PROJECT_NAME}}.product.fct_feature_adoption.adoption_rate_28d
  Dashboard:      Product Health > Feature Drilldown
  Board deck:     N/A (too granular for board)
  Alert:          Core feature adoption < 40% triggers #product-alerts
  Owner:          Product
```

---

## Customer Health Lineage

### Net Promoter Score (NPS)

```
NPS
  Defined in:     33-customer-experience-ops/health-score-methodology.template.md
  Raw data from:  {{SURVEY_PROVIDER}} (survey responses: user_id, score 0-10, verbatim comment, survey_date)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.survey_responses → staging.stg_nps_responses
  Transform:      dbt model: marts/cx/fct_nps_responses.sql (classifies 0-6 as detractor, 7-8 passive, 9-10 promoter; computes NPS score)
  Warehouse:      analytics_{{PROJECT_NAME}}.cx.fct_nps_responses.nps_score
  Dashboard:      Customer Health (departmental-dashboards.template.md), Executive > CX
  Board deck:     Slide 9: Customer Health (board-deck-templates.template.md)
  Alert:          NPS < 20 triggers #cx-alerts
  Owner:          CX / Product
```

### Customer Health Score

```
Customer Health Score
  Defined in:     33-customer-experience-ops/health-score-methodology.template.md
  Raw data from:  Multiple systems — {{ANALYTICS_PROVIDER}} (usage), {{SUPPORT_PLATFORM}} (tickets/sentiment), {{BILLING_PROVIDER}} (billing health), {{SURVEY_PROVIDER}} (NPS)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw tables from each source → staging models per source
  Transform:      dbt model: marts/cx/fct_customer_health.sql (joins product usage, support sentiment, billing status, NPS; applies weighted scoring: usage 35%, engagement recency 25%, support 20%, billing 10%, NPS 10%)
  Warehouse:      analytics_{{PROJECT_NAME}}.cx.fct_customer_health.health_score
  Dashboard:      Customer Health, CS > Account Overview, CS > Risk Dashboard
  Board deck:     Slide 9: Health score distribution chart
  Alert:          Any enterprise account health_score < 40 triggers #cs-alerts with account detail
  Owner:          CS
```

### Churn Rate (Logo & Revenue)

```
Churn Rate (Logo) / Churn Rate (Revenue)
  Defined in:     25-financial-modeling/investor-metrics-dashboard.template.md, 33-customer-experience-ops/retention-playbooks.template.md
  Raw data from:  {{BILLING_PROVIDER}} (subscription status changes, cancellation events, cancellation reason codes)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.billing_subscriptions + raw.billing_cancellation_events → staging.stg_subscription_status
  Transform:      dbt model: marts/finance/fct_churn_analysis.sql (computes logo churn = cancelled_customers / starting_customers; revenue churn = churned_mrr / starting_mrr; segments voluntary vs involuntary)
  Warehouse:      analytics_{{PROJECT_NAME}}.finance.fct_churn_analysis.logo_churn_rate / .revenue_churn_rate
  Dashboard:      Customer Health, Executive > Revenue & Growth, Churn Breakdown
  Board deck:     Slide 4: Retention metrics (board-deck-templates.template.md)
  Alert:          Revenue churn > 5% monthly triggers #executive-alerts
  Owner:          CS / Finance (CS owns retention, Finance owns the calculation)

  ⚠️ METRIC DUPLICATION NOTE: "Churn" is defined in both Section 25 (financial perspective)
  and Section 33 (customer success perspective). This registry resolves the duplication:
  - "Churn Rate (Logo)" = customer count-based, used by CS for workload and coverage planning
  - "Churn Rate (Revenue)" = MRR-weighted, used by Finance for financial forecasting
  Both are valid. Both are tracked. They must never be called simply "churn rate" without the qualifier.
```

---

## Marketing Efficiency Lineage

### Conversion Funnel (Visitor → Signup → Activation → Paid)

```
Full Funnel Conversion
  Defined in:     19-marketing/kpi-dashboard.template.md (top of funnel), 20-post-launch/health-metrics.template.md (activation)
  Raw data from:  {{ANALYTICS_PROVIDER}} (page views, signup events), application database (user creation), {{BILLING_PROVIDER}} (trial-to-paid conversion)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.analytics_events + raw.app_users + raw.billing_subscriptions → staging models
  Transform:      dbt model: marts/marketing/fct_conversion_funnel.sql (joins visitor sessions → signup events → activation events → billing conversion, computes rates at each stage)
  Warehouse:      analytics_{{PROJECT_NAME}}.marketing.fct_conversion_funnel.visitor_to_signup_rate / .signup_to_activation_rate / .trial_to_paid_rate
  Dashboard:      Marketing > Funnel (departmental-dashboards.template.md), Growth > Acquisition
  Board deck:     Slide 8: Growth & Funnel (board-deck-templates.template.md)
  Alert:          Trial-to-paid < 5% triggers #growth-alerts
  Owner:          Marketing (top of funnel) / Product (middle) / Growth (full funnel)
```

### MQL → SQL Pipeline

```
MQL / SQL / MQL-to-SQL Conversion
  Defined in:     19-marketing/kpi-dashboard.template.md
  Raw data from:  {{CRM_PROVIDER}} (lead records, lead scores, status changes), {{MARKETING_AUTOMATION_PROVIDER}} (behavioral scoring events)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.crm_leads + raw.marketing_automation_events → staging.stg_leads
  Transform:      dbt model: marts/marketing/fct_lead_pipeline.sql (applies MQL threshold from scoring model, tracks status progression, computes conversion rates)
  Warehouse:      analytics_{{PROJECT_NAME}}.marketing.fct_lead_pipeline.mql_count / .sql_count / .mql_to_sql_rate
  Dashboard:      Marketing > Pipeline, Sales > Pipeline
  Board deck:     N/A (too operational for board unless sales-led motion)
  Alert:          MQL volume < 50% of target triggers #marketing-alerts
  Owner:          Marketing (MQL definition) / Sales (SQL acceptance criteria)
```

---

## Operational Health Lineage

### DORA Metrics (Deployment Frequency, Lead Time, MTTR, Change Failure Rate)

```
DORA Metrics
  Defined in:     20-post-launch/health-metrics.template.md, 22-cicd-pipeline/pipeline-metrics.template.md
  Raw data from:  {{CI_CD_PROVIDER}} (deployment events, pipeline runs), {{SCM_PROVIDER}} (commit timestamps), {{INCIDENT_MANAGEMENT_PROVIDER}} (incident records)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.cicd_deployments + raw.scm_commits + raw.incidents → staging models
  Transform:      dbt model: marts/ops/fct_dora_metrics.sql (joins deployments with commits for lead time, correlates deployments with subsequent incidents for change failure rate, computes MTTR from incident timestamps)
  Warehouse:      analytics_{{PROJECT_NAME}}.ops.fct_dora_metrics.deploy_frequency / .lead_time_hours / .mttr_hours / .change_failure_rate
  Dashboard:      Engineering > DORA (departmental-dashboards.template.md), Executive > Engineering
  Board deck:     Slide 10: Engineering Velocity (board-deck-templates.template.md)
  Alert:          MTTR > 4 hours triggers #engineering-alerts; Change failure rate > 30% triggers #engineering-alerts
  Owner:          Engineering / SRE
```

### API Latency (p50, p95, p99) & Error Rates

```
Latency & Error Rates
  Defined in:     20-post-launch/health-metrics.template.md, 09-deployment/monitoring.template.md
  Raw data from:  {{APM_PROVIDER}} (request traces with endpoint, status_code, duration_ms, timestamp)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.apm_request_traces → staging.stg_request_metrics (pre-aggregated to 5-minute buckets to manage volume)
  Transform:      dbt models: marts/ops/fct_latency.sql (percentile calculations per endpoint per time bucket), marts/ops/fct_error_rates.sql (4xx/5xx counts / total per bucket)
  Warehouse:      analytics_{{PROJECT_NAME}}.ops.fct_latency.p50_ms / .p95_ms / .p99_ms; analytics_{{PROJECT_NAME}}.ops.fct_error_rates.error_rate_4xx / .error_rate_5xx
  Dashboard:      Engineering > Performance, Engineering > Reliability, Executive > Operational
  Board deck:     Slide 10: Reliability summary (99.x% uptime + p95 trend)
  Alert:          p95 > 500ms triggers #engineering-alerts; 5xx rate > 1% triggers #incident-response (integrates with Section 21)
  Owner:          Engineering / SRE

  ⚠️ CROSS-SECTION NOTE: Section 09 already defines operational alerting for latency and errors
  at the infrastructure level (real-time, sub-minute). Section 35 provides the analytical layer —
  trends over time, correlation with business metrics, warehouse-based historical analysis. These
  are complementary, not duplicative:
  - Section 09: "The server is slow RIGHT NOW — page the on-call engineer"
  - Section 35: "Latency has been trending up 5% per week for the past month — investigate capacity planning"
```

### Uptime & Infrastructure Cost

```
Uptime Percentage / Infrastructure Cost per User
  Defined in:     20-post-launch/health-metrics.template.md (uptime), 25-financial-modeling/cost-structure.template.md (infra cost)
  Raw data from:  {{MONITORING_PROVIDER}} (uptime checks, status page incidents), {{CLOUD_PROVIDER}} billing API (line-item infrastructure costs with resource tags)
  ETL pipeline:   {{BI_ETL_TOOL}} → raw.monitoring_uptime_checks + raw.cloud_billing_line_items → staging models
  Transform:      dbt models: marts/ops/fct_uptime.sql (calculates uptime from incident windows), marts/ops/fct_infra_costs.sql (aggregates costs, divides by MAU from fct_active_users)
  Warehouse:      analytics_{{PROJECT_NAME}}.ops.fct_uptime.uptime_percentage; analytics_{{PROJECT_NAME}}.ops.fct_infra_costs.cost_per_user
  Dashboard:      Engineering > Reliability, Engineering > Cost, Executive > Operational
  Board deck:     Slide 10: Uptime badge; Slide 6: Burn/efficiency (infra cost trend)
  Alert:          Uptime < 99% triggers #executive-alerts; Cost per user increase > 20% MoM triggers #finance-alerts
  Owner:          Engineering / SRE (uptime), Engineering / Finance (infra cost)
```

---

## Common Cross-Domain Analyses

The power of a unified warehouse is not in any single metric — it is in the ability to join data across domains that previously lived in separate tools. These analyses are impossible with siloed dashboards.

### Latency Impact on Churn
**Join:** `fct_latency` + `fct_churn_analysis` on time window
**Question:** Do latency spikes correlate with increased churn 30-60 days later?
**Insight pattern:** Customers who experienced > 3 p95 latency breaches in a month churn at 2.5x the base rate. This justifies performance investment in business terms, not just engineering pride.

### Feature Adoption Driving NRR
**Join:** `fct_feature_adoption` + `fct_nrr_cohorts` on account_id
**Question:** Which features correlate most strongly with expansion revenue?
**Insight pattern:** Accounts that adopt Feature X within 30 days expand at 3x the rate of non-adopters. This drives product roadmap prioritization and CS playbooks for driving adoption.

### Support Volume Predicting Churn
**Join:** `fct_support_tickets` + `fct_customer_health` + `fct_churn_analysis` on account_id
**Question:** At what support ticket threshold does churn probability spike?
**Insight pattern:** Accounts that file > 5 tickets in 30 days have a 40% chance of churning within 90 days. This triggers proactive CS outreach before the customer gives up.

### CAC Efficiency by Content Path
**Join:** `fct_cac_by_channel` + `fct_content_performance` + `fct_conversion_funnel` on session attribution
**Question:** Which content pieces generate the lowest-CAC customers?
**Insight pattern:** Blog posts on topic cluster Y generate customers with 60% lower CAC and 20% higher LTV than paid search. This reshapes content strategy and budget allocation.

### Health Score Validation Against Actuals
**Join:** `fct_customer_health` (historical snapshots) + `fct_churn_analysis` on account_id
**Question:** Does the health score actually predict churn?
**Insight pattern:** If accounts scored 0-40 churn at the same rate as accounts scored 40-60, the health score model needs recalibration. Run this analysis quarterly.

### Deployment Velocity Impact on Feature Adoption
**Join:** `fct_dora_metrics` + `fct_feature_adoption` on time window
**Question:** Does faster shipping correlate with higher feature adoption?
**Insight pattern:** Weeks with > 5 deployments see 15% higher new-feature adoption than weeks with < 2 deployments, validating the investment in CI/CD infrastructure (Section 22).

---

## Warning: Metric Duplication Across Sections

The Master Starter Kit defines metrics in multiple sections because each section serves a different audience and context. This is intentional and unavoidable — you cannot talk about marketing strategy without mentioning conversion rates, nor financial modeling without mentioning churn.

**The problem** arises when Section 19's "conversion rate" and Section 35's "conversion rate" diverge in their definitions without anyone noticing. One counts all visitors, the other excludes bot traffic. One uses a 7-day attribution window, the other uses 30. Both are called "conversion rate" and both appear on dashboards.

**The resolution** is this registry and this map. The unified-metrics-registry.template.md holds the canonical definition. This cross-section map shows where each metric flows. When in doubt:

1. Check the registry for the authoritative definition
2. Check this map for the authoritative data lineage
3. If a section's local metric definition conflicts with the registry, the registry wins
4. If a dashboard shows a number that does not match the registry's warehouse table, the dashboard is wrong

Duplication across sections is tolerable. Inconsistency is not.
