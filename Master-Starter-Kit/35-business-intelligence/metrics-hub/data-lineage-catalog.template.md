# Data Lineage Catalog

> Every metric has a story: where it was born, how it traveled, and where it ended up. This catalog documents that story for every metric in the unified-metrics-registry. When a dashboard number looks wrong, you do not start guessing — you open this catalog, trace the lineage, and find exactly where the data broke.

**Project:** {{PROJECT_NAME}}
**Catalog Owner:** {{BI_METRIC_OWNER_DEFAULT}}
**Last Full Lineage Audit:** {{LAST_LINEAGE_AUDIT_DATE}}
**Next Scheduled Audit:** {{NEXT_LINEAGE_AUDIT_DATE}}

---

## Pre-Filled Lineage Examples

### Monthly Recurring Revenue (MRR)

| Field | Value |
|-------|-------|
| **Metric Name** | Monthly Recurring Revenue (MRR) |
| **Category** | Revenue & Growth |
| **Source System** | {{BILLING_PROVIDER}} |
| **Source Table/Event** | `subscriptions` table (fields: `id`, `customer_id`, `plan_id`, `amount`, `currency`, `interval`, `status`, `current_period_start`, `current_period_end`, `canceled_at`) and `plans` table (fields: `id`, `amount`, `interval`, `product_id`) |
| **Extraction Method** | API Pull — {{BI_ETL_TOOL}} syncs the subscriptions and plans endpoints every {{ETL_BILLING_SYNC_INTERVAL}}. Full sync daily at 02:00 UTC; incremental sync via `updated_after` parameter every 15 minutes during business hours. |
| **Staging Model** | `staging.stg_billing__subscriptions` — one row per subscription with normalized fields: `subscription_id`, `customer_id`, `plan_id`, `monthly_amount` (normalized: annual / 12, quarterly / 3, monthly as-is), `status`, `started_at`, `ended_at` |
| **Staging Tests** | `not_null`: subscription_id, customer_id, monthly_amount, status. `unique`: subscription_id. `accepted_values`: status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid'). `freshness`: warn after 2 hours, error after 6 hours. `relationships`: customer_id references stg_billing__customers.customer_id. |
| **Transformation Logic** | `marts/finance/fct_mrr_current.sql` — Filters to status IN ('active', 'trialing', 'past_due'), excludes internal/test accounts via `dim_customers.is_internal = false`, sums `monthly_amount` grouped by snapshot_date. Past_due subscriptions are included because the customer has not formally cancelled — excluding them would undercount MRR and create a sudden drop when dunning resolves. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.finance.fct_mrr_current` — columns: `snapshot_date`, `mrr_amount`, `active_subscription_count`, `paying_customer_count` |
| **Consuming Dashboards** | Executive > Revenue & Growth, MRR Waterfall, Unit Economics, Board Deck Slide 3 |
| **PII Classification** | None — MRR is an aggregate financial metric with no customer-identifiable information at the output level. Upstream staging tables contain customer_id which is a pseudonymous identifier. |
| **Data Quality SLA** | Freshness: production value must reflect data no older than 6 hours. Accuracy: reconciled monthly against {{BILLING_PROVIDER}} dashboard — variance must be < 0.5%. |
| **Last Verified** | {{LAST_MRR_LINEAGE_VERIFICATION_DATE}} |

---

### Net Revenue Retention (NRR)

| Field | Value |
|-------|-------|
| **Metric Name** | Net Revenue Retention (NRR) |
| **Category** | Unit Economics |
| **Source System** | {{BILLING_PROVIDER}} |
| **Source Table/Event** | `subscriptions` (status history), `invoices` (amount_paid, period), `credit_notes` (amount, reason). Requires full billing history per customer to track MRR movements over cohort periods. |
| **Extraction Method** | API Pull — same sync as MRR above. Invoice data synced daily (full) because invoice line items can be retroactively adjusted. Credit notes synced on the same schedule. |
| **Staging Model** | `staging.stg_billing__subscription_events` — one row per subscription state change: `subscription_id`, `customer_id`, `event_type` (new, upgrade, downgrade, cancel, reactivate), `mrr_before`, `mrr_after`, `mrr_change`, `effective_date` |
| **Staging Tests** | `not_null`: subscription_id, event_type, effective_date. `unique`: composite key (subscription_id, effective_date, event_type). `freshness`: warn after 4 hours, error after 12 hours. Custom test: `mrr_change = mrr_after - mrr_before` for all rows. |
| **Transformation Logic** | `marts/finance/fct_nrr_cohorts.sql` — For each monthly cohort (customers who started in month X): captures starting MRR, then tracks expansion (mrr_change > 0), contraction (mrr_change < 0, customer active), and churn (subscription cancelled) through subsequent months. NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR. Computes for 1-month, 3-month, 6-month, and 12-month horizons. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.finance.fct_nrr_cohorts` — columns: `cohort_month`, `horizon_months`, `starting_mrr`, `expansion_mrr`, `contraction_mrr`, `churned_mrr`, `ending_mrr`, `nrr_percentage` |
| **Consuming Dashboards** | Unit Economics, Executive > Revenue & Growth, Board Deck Slide 4, Cohort Analysis |
| **PII Classification** | None — aggregate cohort data. |
| **Data Quality SLA** | Freshness: updated daily by 06:00 UTC. Accuracy: monthly reconciliation against manually computed NRR from billing provider reports — variance must be < 1%. |
| **Last Verified** | {{LAST_NRR_LINEAGE_VERIFICATION_DATE}} |

---

### Daily Active Users (DAU)

| Field | Value |
|-------|-------|
| **Metric Name** | Daily Active Users (DAU) |
| **Category** | Product Health |
| **Source System** | {{ANALYTICS_PROVIDER}} |
| **Source Table/Event** | Event stream: all tracked events with `user_id`, `event_name`, `event_timestamp`, `session_id`, `device_type`, `ip_address`. Qualifying events for DAU: {{DAU_QUALIFYING_EVENT}} (excludes passive page_view events and automated/bot sessions). |
| **Extraction Method** | {{ANALYTICS_EXTRACTION_METHOD}} — options vary by provider. If {{ANALYTICS_PROVIDER}} supports warehouse export (e.g., BigQuery export for GA4, Amplitude's Snowflake sync), use direct export. Otherwise, API Pull via {{BI_ETL_TOOL}} with daily batch. Streaming preferred if latency requirements are < 1 hour. |
| **Staging Model** | `staging.stg_analytics__user_events` — one row per event: `event_id`, `user_id`, `event_name`, `event_timestamp`, `session_id`, `is_bot` (flagged by UA string + IP reputation), `is_internal` (flagged by internal IP/email domain). Bot and internal events filtered out. |
| **Staging Tests** | `not_null`: event_id, user_id, event_name, event_timestamp. `unique`: event_id. `freshness`: warn after 3 hours, error after 8 hours. Custom test: DAU should not drop > 50% day-over-day (likely data pipeline issue, not real user decline). |
| **Transformation Logic** | `marts/product/fct_active_users.sql` — `COUNT(DISTINCT user_id) WHERE event_name IN (qualifying_events) AND is_bot = false AND is_internal = false GROUP BY event_date`. Also computes WAU (7-day rolling) and MAU (28-day rolling) in the same model for consistency. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.product.fct_active_users` — columns: `date`, `dau`, `wau`, `mau`, `dau_mau_ratio` |
| **Consuming Dashboards** | Product Health, Executive > Product, Board Deck Slide 7 |
| **PII Classification** | None at output level (aggregate counts). Staging model contains user_id (pseudonymous) and ip_address (PII — masked after bot detection, not persisted in marts). |
| **Data Quality SLA** | Freshness: DAU for previous day available by 04:00 UTC. Accuracy: cross-validated weekly against {{ANALYTICS_PROVIDER}} native dashboard — variance must be < 3% (small variance expected due to bot filtering differences). |
| **Last Verified** | {{LAST_DAU_LINEAGE_VERIFICATION_DATE}} |

---

### Customer Health Score

| Field | Value |
|-------|-------|
| **Metric Name** | Customer Health Score |
| **Category** | Customer Health |
| **Source System** | Multiple: {{ANALYTICS_PROVIDER}} (usage), {{SUPPORT_PLATFORM}} (tickets), {{BILLING_PROVIDER}} (billing status), {{SURVEY_PROVIDER}} (NPS) |
| **Source Table/Event** | Usage: event stream (see DAU lineage). Support: `tickets` table (ticket_id, account_id, status, sentiment_score, created_at, resolved_at). Billing: `subscriptions` (payment_status, days_past_due). NPS: `survey_responses` (account_id, score, response_date). |
| **Extraction Method** | Mixed — each source uses its own ETL path (see individual metric lineage entries). Health score computation runs after all upstream sources have refreshed. Orchestrated via {{BI_ETL_TOOL}} DAG dependency: health_score_model depends on stg_user_events, stg_support_tickets, stg_subscriptions, stg_nps_responses. |
| **Staging Model** | No dedicated staging model — consumes from existing staging models of each source system. Intermediate model: `intermediate.int_customer_health_inputs` joins the four inputs per account_id into a single wide row. |
| **Staging Tests** | Tests applied on upstream staging models (see individual entries). Intermediate model tests: `not_null`: account_id. `unique`: account_id (one row per account). Custom test: health_score between 0 and 100 for all rows. Custom test: no account should have NULL for all four input signals (indicates broken join). |
| **Transformation Logic** | `marts/cx/fct_customer_health.sql` — Per account: (1) Usage score (0-100): based on DAU frequency and core feature usage relative to account-type benchmarks, weighted 35%. (2) Engagement recency (0-100): days since last login mapped to score (< 1 day = 100, > 30 days = 0), weighted 25%. (3) Support sentiment (0-100): derived from ticket volume trend and sentiment analysis, weighted 20%. (4) Billing health (0-100): on-time = 100, past due 1-15 days = 60, past due 16-30 = 30, past due 30+ = 0, weighted 10%. (5) NPS component (0-100): last NPS response mapped to 0-100 scale, weighted 10%. Final score = weighted sum, rounded to integer. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.cx.fct_customer_health` — columns: `account_id`, `health_score`, `usage_subscore`, `recency_subscore`, `support_subscore`, `billing_subscore`, `nps_subscore`, `risk_tier` (high/medium/low), `score_date`, `score_change_7d` |
| **Consuming Dashboards** | Customer Health, CS > Account Overview, CS > Risk Dashboard, Executive > CX |
| **PII Classification** | Contains PII (masked) — account_id maps to customer organization. No individual user PII in the output. Access restricted to CS and leadership roles. |
| **Data Quality SLA** | Freshness: scores refreshed daily by 08:00 UTC (after all upstream sources complete). Accuracy: validated quarterly against actual churn outcomes — accounts scored 0-40 should churn at > 3x the rate of accounts scored 60-100. If not, model weights need recalibration. |
| **Last Verified** | {{LAST_HEALTH_SCORE_LINEAGE_VERIFICATION_DATE}} |

---

### API Latency (p95)

| Field | Value |
|-------|-------|
| **Metric Name** | API Latency (p95) |
| **Category** | Operational Health |
| **Source System** | {{APM_PROVIDER}} |
| **Source Table/Event** | Request traces: `trace_id`, `endpoint`, `method`, `status_code`, `duration_ms`, `timestamp`, `service_name`. Volume: potentially millions of traces per day — pre-aggregation required. |
| **Extraction Method** | API Pull with pre-aggregation — {{APM_PROVIDER}} metrics API queried for 5-minute bucketed percentiles per endpoint. Raw traces are NOT synced to the warehouse (too much volume). If {{APM_PROVIDER}} supports direct warehouse export of pre-aggregated metrics, use that instead. |
| **Staging Model** | `staging.stg_apm__latency_buckets` — one row per (endpoint, 5-minute bucket): `endpoint`, `bucket_start`, `request_count`, `p50_ms`, `p95_ms`, `p99_ms`, `error_count_4xx`, `error_count_5xx` |
| **Staging Tests** | `not_null`: endpoint, bucket_start, request_count. `freshness`: warn after 30 minutes, error after 2 hours. Custom test: p50 <= p95 <= p99 for all rows (percentile ordering invariant). Custom test: request_count > 0 for all rows. |
| **Transformation Logic** | `marts/ops/fct_latency.sql` — Aggregates 5-minute buckets to hourly and daily granularity. Computes weighted percentiles across endpoints for the "global" p95 (weighted by request_count, not simple average of per-endpoint p95s — a common error). Excludes health check endpoints and internal service-to-service calls. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.ops.fct_latency` — columns: `date`, `hour`, `endpoint` (or 'global'), `request_count`, `p50_ms`, `p95_ms`, `p99_ms` |
| **Consuming Dashboards** | Engineering > Performance, Engineering > Reliability, Executive > Operational |
| **PII Classification** | None — aggregate performance data with no user-identifiable information. |
| **Data Quality SLA** | Freshness: hourly granularity available within 30 minutes of hour end. Daily rollup by 02:00 UTC. Accuracy: spot-check weekly against {{APM_PROVIDER}} native dashboard — variance in p95 should be < 5ms or < 5%, whichever is larger. |
| **Last Verified** | {{LAST_LATENCY_LINEAGE_VERIFICATION_DATE}} |

---

### Conversion Rate (Trial to Paid)

| Field | Value |
|-------|-------|
| **Metric Name** | Conversion Rate (Trial to Paid) |
| **Category** | Marketing Efficiency |
| **Source System** | {{BILLING_PROVIDER}}, application database |
| **Source Table/Event** | {{BILLING_PROVIDER}}: `subscriptions` (trial_start, trial_end, status transitions). Application database: `users` table (signup_date, email, account_id) for join context. |
| **Extraction Method** | API Pull — subscriptions synced per MRR lineage above. Application users synced via {{BI_ETL_TOOL}} CDC from {{DATABASE}} replica (captures new signups within minutes). |
| **Staging Model** | `staging.stg_billing__trials` — one row per trial: `trial_id`, `customer_id`, `trial_start_date`, `trial_end_date`, `converted_to_paid` (boolean), `conversion_date`, `days_to_convert`, `plan_id_converted_to` |
| **Staging Tests** | `not_null`: trial_id, customer_id, trial_start_date. `unique`: trial_id. `accepted_values`: converted_to_paid in (true, false). Custom test: conversion_date IS NULL when converted_to_paid = false. Custom test: trial_end_date >= trial_start_date. |
| **Transformation Logic** | `marts/marketing/fct_conversion_funnel.sql` — For trials that have ended (trial_end_date <= current_date - {{TRIAL_GRACE_PERIOD}}): conversion_rate = COUNT(converted_to_paid = true) / COUNT(*). Grace period allows for late converters who start a subscription within {{TRIAL_GRACE_PERIOD}} days of trial expiration. Segmented by signup channel (from marketing attribution), plan tier, and cohort week. |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.marketing.fct_conversion_funnel` — columns: `cohort_week`, `channel`, `trials_started`, `trials_converted`, `trial_to_paid_rate`, `median_days_to_convert` |
| **Consuming Dashboards** | Marketing > Funnel, Growth > Conversion, Board Deck Slide 8 |
| **PII Classification** | None at output level (aggregate rates). Staging model contains customer_id (pseudonymous). |
| **Data Quality SLA** | Freshness: daily by 06:00 UTC. Accuracy: monthly reconciliation against manual count from {{BILLING_PROVIDER}} dashboard — variance < 1%. Note: grace period means recent cohorts will have artificially low conversion rates until the grace window closes. |
| **Last Verified** | {{LAST_CONVERSION_LINEAGE_VERIFICATION_DATE}} |

---

## Empty Lineage Template

Copy this template for each new metric added to the unified-metrics-registry.

| Field | Value |
|-------|-------|
| **Metric Name** | {{METRIC_NAME}} |
| **Category** | Revenue & Growth / Unit Economics / Product Health / Customer Health / Marketing Efficiency / Operational Health |
| **Source System** | {{METRIC_SOURCE_SYSTEM}} |
| **Source Table/Event** | {{METRIC_SOURCE_TABLE_OR_EVENT}} — list specific tables, events, or API endpoints with key fields |
| **Extraction Method** | CDC / API Pull / Webhook / File Export / Streaming — describe sync frequency and any incremental vs. full-load logic |
| **Staging Model** | {{STAGING_SCHEMA}}.stg_{{SOURCE}}__{{ENTITY}} — describe the row grain and key columns |
| **Staging Tests** | `not_null`: ___. `unique`: ___. `freshness`: warn after ___, error after ___. `accepted_values`: ___. Custom tests: ___ |
| **Transformation Logic** | `marts/{{DOMAIN}}/{{MODEL_NAME}}.sql` — describe the core calculation, filtering logic, and any business rules applied |
| **Warehouse Table** | `analytics_{{PROJECT_NAME}}.{{SCHEMA}}.{{TABLE}}` — list key output columns |
| **Consuming Dashboards** | ___ |
| **PII Classification** | None / Contains PII (masked) / Contains PII (hashed) / Excluded |
| **Data Quality SLA** | Freshness: ___. Accuracy: ___ |
| **Last Verified** | YYYY-MM-DD |

---

## How to Perform a Lineage Audit

Run this audit quarterly, or immediately after any incident where a dashboard showed incorrect data.

### Step 1: Inventory

Pull the full list of metrics from `unified-metrics-registry.template.md`. For each metric, confirm that a lineage entry exists in this catalog. Any metric without a lineage entry is undocumented — either document it or flag it as at-risk.

### Step 2: Source Verification

For each metric, confirm the source system and source table/event still exist and are still producing data:
- [ ] Is the source API endpoint still active? (Check for deprecation notices.)
- [ ] Has the source table schema changed? (New columns, renamed columns, changed data types.)
- [ ] Is the extraction running on schedule? (Check {{BI_ETL_TOOL}} job history for failures or delays.)
- [ ] Is the extraction capturing the full dataset? (Compare row counts between source and staging.)

### Step 3: Staging Validation

For each staging model:
- [ ] Are all staging tests passing? (Run `dbt test --select staging` or equivalent.)
- [ ] Is the freshness SLA being met? (Check `dbt source freshness` results.)
- [ ] Are there unexpected NULLs or anomalous values? (Run a profile query on key columns.)

### Step 4: Transformation Verification

For each mart/transform model:
- [ ] Does the SQL still match the business definition in the registry? (Read the model and compare to the Definition column.)
- [ ] Have any upstream models changed that could affect this calculation? (Check dbt DAG for modified dependencies.)
- [ ] Does a manual spot-check of 5-10 records produce the expected result? (Pick specific accounts/dates and compute by hand.)

### Step 5: Dashboard Reconciliation

For each consuming dashboard:
- [ ] Does the dashboard query point to the correct warehouse table? (Not a copy, not an old table, not a personal schema.)
- [ ] Does the dashboard value match the warehouse value for the same date range? (Query the warehouse directly and compare.)
- [ ] Are dashboard filters and date ranges configured correctly? (A dashboard showing "last 30 days" that actually queries "last 28 days" is a lineage bug.)

### Step 6: Document Findings

Update the `Last Verified` field for each metric that passes. For any metric that fails, open an issue with:
- Which step failed
- What the expected value was vs. what was found
- Severity: cosmetic (< 1% variance), concerning (1-5% variance), or broken (> 5% variance or data missing entirely)

---

## What to Do When Lineage Breaks

Data pipelines break. The question is not whether they will break but how fast you detect and recover.

### Symptoms of Broken Lineage

| Symptom | Likely Cause | Investigation Starting Point |
|---------|-------------|------------------------------|
| Dashboard shows no data for today | ETL job failed or is delayed | Check {{BI_ETL_TOOL}} job status for the source connector |
| Metric value is drastically different from yesterday | Source schema changed, filter logic broke, or upstream bug | Compare staging row counts and value distributions day-over-day |
| Metric shows stale data (same value for multiple days) | Transform model is not running, or source is not updating | Check dbt job history and source freshness tests |
| Dashboard shows different value than direct warehouse query | Dashboard is querying wrong table, has stale cache, or applies extra filters | Compare dashboard SQL (if accessible) against documented warehouse table |
| Two dashboards show different values for the same metric | One dashboard points to an old/unofficial table | Check both dashboard data sources against this catalog |

### Recovery Procedure

1. **Identify the break point.** Walk the lineage from source to dashboard. Where does the data stop being correct?
2. **Fix the immediate issue.** Restart the failed job, update the schema mapping, fix the broken SQL.
3. **Backfill if necessary.** If the break affected historical data, determine the affected date range and reprocess. See backfill guidance below.
4. **Verify end-to-end.** After the fix, trace a specific data point from source to dashboard to confirm the full pipeline is healthy.
5. **Update the lineage catalog.** If the fix involved changing a table name, extraction method, or transformation logic, update this document.
6. **Post-mortem.** For breaks that lasted > 24 hours or affected executive dashboards, write a brief incident summary: what broke, why, how it was detected, how it was fixed, and what will prevent recurrence.

---

## How to Handle Schema Changes in Source Systems

Source systems change their schemas. {{BILLING_PROVIDER}} renames a field. {{ANALYTICS_PROVIDER}} deprecates an event property. {{CRM_PROVIDER}} adds a required field. Every schema change is a potential lineage break.

### Prevention

- **Subscribe to source system changelogs.** Most SaaS providers publish API changelogs and deprecation notices. Assign someone to monitor these for every source system in this catalog.
- **Pin API versions.** Where possible, use a specific API version (e.g., `{{BILLING_PROVIDER}} API v2023-10-01`) rather than the latest version. This gives you time to adapt to changes.
- **Schema drift detection.** Configure {{BI_ETL_TOOL}} to alert when a source table's schema changes (new columns, removed columns, type changes). Most modern ETL tools support this natively.

### Response

When a schema change is detected:

1. **Assess impact.** Which staging models reference the changed field? Which downstream metrics are affected?
2. **Update staging models.** Rename field references, handle new NULLable columns with COALESCE defaults, add new fields to the staging model if they are useful.
3. **Re-run staging tests.** Confirm that `not_null`, `unique`, and other tests still pass with the new schema.
4. **Check transformation logic.** If a field that was previously never-NULL now can be NULL, the downstream math may produce unexpected results.
5. **Update this catalog.** Reflect the new source table schema in the Source Table/Event field.
6. **Backfill if needed.** If the schema change was retroactive (provider backfilled historical data with the new schema), re-extract and reprocess the affected date range.
