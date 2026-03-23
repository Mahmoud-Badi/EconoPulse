# Data Quality & Governance: {{PROJECT_NAME}}

## Overview

**Project:** {{PROJECT_NAME}}
**Warehouse:** {{BI_WAREHOUSE}}
**PII Strategy:** {{BI_PII_STRATEGY}}
**Data Retention:** {{BI_DATA_RETENTION_MONTHS}} months
**Metric Owner Default:** {{BI_METRIC_OWNER_DEFAULT}}
**Refresh Cadence:** {{BI_REFRESH_CADENCE}}

---

## 1. Data Quality Dimensions

### Framework

Every data quality rule maps to one of six dimensions. This ensures comprehensive coverage and prevents blind spots where a dataset "looks fine" on one dimension but is failing on another.

| Dimension | Definition | Example Failure | Business Impact |
|-----------|-----------|-----------------|-----------------|
| **Accuracy** | Data correctly represents the real-world entity it models | MRR calculated as $12,000 when actual revenue is $10,000 | Incorrect board deck, wrong financial decisions |
| **Completeness** | All expected data is present; no missing records or fields | 30% of users missing `signup_date` | Cohort analysis is wrong, retention curves are inflated |
| **Consistency** | Same data element has the same value across all systems | User count is 1,200 in the app DB but 1,150 in the warehouse | Erodes trust — "which number is right?" |
| **Timeliness** | Data is available within its defined freshness SLA | Dashboard shows yesterday's MRR because pipeline failed overnight | Executives make decisions on stale data |
| **Validity** | Data conforms to its defined format, range, and business rules | `billing_interval` contains "bi-annual" (not in accepted values) | Aggregation queries silently exclude invalid rows |
| **Uniqueness** | No duplicate records for the same entity | Same subscription appears twice with different MRR values | Revenue is double-counted in reports |

---

## 2. Quality Rules by Dimension

### 2.1 Accuracy Rules

| Rule ID | Rule | Table | Column(s) | Check Query | Severity |
|---------|------|-------|-----------|-------------|----------|
| ACC-001 | MRR sum matches {{BILLING_PROVIDER}} dashboard | `mrr_movements` | `mrr_cents` | Compare `SUM(mrr_cents)` with {{BILLING_PROVIDER}} API `/v1/subscriptions` total | Critical |
| ACC-002 | Transaction amounts match source | `fact_transactions` | `amount_cents` | Compare daily transaction totals with {{BILLING_PROVIDER}} balance report | Critical |
| ACC-003 | User count matches application DB | `dim_users` | `user_id` | `SELECT COUNT(DISTINCT user_id) FROM dim_users WHERE is_current = TRUE` vs app DB | High |
| ACC-004 | DAU matches {{ANALYTICS_PROVIDER}} | `daily_active_users` | `dau` | Compare with {{ANALYTICS_PROVIDER}} dashboard for same date | High |
| ACC-005 | Cohort sizes are stable after 7 days | `cohort_retention` | `cohort_size` | Cohort size for months older than 7 days should not change between runs | Medium |
| ACC-006 | Currency conversion rates within market bounds | `fact_transactions` | `amount_usd_cents` | Exchange rates should be within 20% of spot rate | Medium |

```sql
-- ACC-001: MRR reconciliation check
-- Run monthly, compare warehouse MRR with billing provider
WITH warehouse_mrr AS (
    SELECT SUM(effective_mrr_cents) AS warehouse_total_mrr_cents
    FROM analytics_{{PROJECT_NAME}}.int_user_subscription_history
    WHERE subscription_status = 'active'
      AND is_currently_trialing = FALSE
),
-- {{BILLING_PROVIDER}} MRR should be loaded into a reconciliation table
-- or fetched via API at check time
billing_mrr AS (
    SELECT total_mrr_cents AS billing_total_mrr_cents
    FROM raw_{{PROJECT_NAME}}.raw_billing_mrr_snapshot
    WHERE snapshot_date = CURRENT_DATE
)
SELECT
    w.warehouse_total_mrr_cents,
    b.billing_total_mrr_cents,
    ABS(w.warehouse_total_mrr_cents - b.billing_total_mrr_cents) AS discrepancy_cents,
    ROUND(ABS(w.warehouse_total_mrr_cents - b.billing_total_mrr_cents)::NUMERIC /
          NULLIF(b.billing_total_mrr_cents, 0) * 100, 2) AS discrepancy_pct
FROM warehouse_mrr w
CROSS JOIN billing_mrr b
WHERE ABS(w.warehouse_total_mrr_cents - b.billing_total_mrr_cents) >
      b.billing_total_mrr_cents * 0.01;  -- Alert if > 1% discrepancy
```

### 2.2 Completeness Rules

| Rule ID | Rule | Table | Column(s) | Check Query | Severity |
|---------|------|-------|-----------|-------------|----------|
| CMP-001 | All users have signup_date | `dim_users` | `signup_date` | `WHERE signup_date IS NULL AND is_current = TRUE` | Critical |
| CMP-002 | All active subscriptions have plan_id | `fact_subscriptions` | `plan_key` | `WHERE plan_key IS NULL AND status = 'active'` | Critical |
| CMP-003 | All events have user_id | `fact_events` | `user_key` | `WHERE user_key IS NULL` — track percentage, not zero tolerance | High |
| CMP-004 | No gaps in daily data | `daily_active_users` | `date_key` | Check for missing dates in the date spine | High |
| CMP-005 | All transactions have currency | `fact_transactions` | `currency` | `WHERE currency IS NULL` | Critical |
| CMP-006 | Feature events have feature_id | `fact_events` | `feature_key` | `WHERE event_name LIKE 'feature_%' AND feature_key IS NULL` | Medium |
| CMP-007 | Geography populated for > 95% of sessions | `fact_sessions` | `geo_key` | Count NULL geo_key / total rows | Low |

```sql
-- CMP-004: Date gap detection
WITH date_range AS (
    SELECT
        MIN(metric_date) AS first_date,
        MAX(metric_date) AS last_date
    FROM analytics_{{PROJECT_NAME}}.daily_active_users
),
expected_dates AS (
    SELECT d::DATE AS expected_date
    FROM GENERATE_SERIES(
        (SELECT first_date FROM date_range),
        (SELECT last_date FROM date_range),
        INTERVAL '1 day'
    ) AS d
),
actual_dates AS (
    SELECT DISTINCT metric_date
    FROM analytics_{{PROJECT_NAME}}.daily_active_users
)
SELECT expected_date AS missing_date
FROM expected_dates e
LEFT JOIN actual_dates a ON e.expected_date = a.metric_date
WHERE a.metric_date IS NULL;
```

### 2.3 Consistency Rules

| Rule ID | Rule | Table(s) | Check | Severity |
|---------|------|----------|-------|----------|
| CON-001 | User count consistent across fact and dim tables | `dim_users`, `fact_events` | Users in facts should exist in dimensions | Critical |
| CON-002 | MRR movements sum equals ending MRR | `mrr_movements` | `SUM(mrr_change_cents) = current ending MRR` | Critical |
| CON-003 | Plan names match between sources | `dim_plans`, `stg_billing_plans` | No plan_id in facts without matching dimension | High |
| CON-004 | Date keys align across all fact tables | All fact tables | All `date_key` values exist in `dim_dates` | Critical |
| CON-005 | Subscription status transitions are valid | `fact_subscriptions` | No `active` -> `trialing` transitions | Medium |
| CON-006 | Event counts match between staging and mart | `stg_events`, `fact_events` | Row counts within 0.1% tolerance after dedup | High |

```sql
-- CON-001: Referential integrity check
-- Every user_key in fact tables must exist in dim_users
SELECT
    'fact_events' AS fact_table,
    COUNT(*) AS orphan_count
FROM analytics_{{PROJECT_NAME}}.fact_events f
LEFT JOIN analytics_{{PROJECT_NAME}}.dim_users d
    ON f.user_key = d.user_key
WHERE d.user_key IS NULL
  AND f.user_key IS NOT NULL

UNION ALL

SELECT
    'fact_transactions',
    COUNT(*)
FROM analytics_{{PROJECT_NAME}}.fact_transactions f
LEFT JOIN analytics_{{PROJECT_NAME}}.dim_users d
    ON f.user_key = d.user_key
WHERE d.user_key IS NULL
  AND f.user_key IS NOT NULL

UNION ALL

SELECT
    'fact_subscriptions',
    COUNT(*)
FROM analytics_{{PROJECT_NAME}}.fact_subscriptions f
LEFT JOIN analytics_{{PROJECT_NAME}}.dim_users d
    ON f.user_key = d.user_key
WHERE d.user_key IS NULL
  AND f.user_key IS NOT NULL;
```

### 2.4 Timeliness Rules

See Section 3 (Freshness SLAs) below for the complete timeliness framework.

### 2.5 Validity Rules

| Rule ID | Rule | Table | Column | Valid Values / Range | Severity |
|---------|------|-------|--------|---------------------|----------|
| VAL-001 | Subscription status is valid | `fact_subscriptions` | `status` | `trialing`, `active`, `past_due`, `canceled`, `unpaid`, `incomplete`, `incomplete_expired` | Critical |
| VAL-002 | Movement type is valid | `mrr_movements` | `movement_type` | `new`, `expansion`, `contraction`, `churn`, `reactivation` | Critical |
| VAL-003 | MRR is non-negative | `mrr_movements` | `mrr_cents` | >= 0 | Critical |
| VAL-004 | Currency is ISO 4217 | `fact_transactions` | `currency` | 3-letter codes: `USD`, `EUR`, `GBP`, etc. | High |
| VAL-005 | Country code is ISO 3166 | `dim_geography` | `country_code` | 2-letter codes | Medium |
| VAL-006 | Retention rate is between 0 and 1 | `cohort_retention` | `retention_rate` | 0.0 to 1.0 | High |
| VAL-007 | Health score is between 0 and 100 | `customer_health` | `health_score` | 0 to 100 | High |
| VAL-008 | Email hash length is consistent | `dim_users` | `email_hash` | Exactly 64 characters (SHA-256 hex) | Medium |
| VAL-009 | Billing interval is valid | `fact_subscriptions` | `billing_interval` | `monthly`, `yearly`, `quarterly` | High |
| VAL-010 | Platform is valid | `fact_events` | `platform` | `web`, `ios`, `android`, `api` | Medium |
| VAL-011 | Dates are not in the future | All fact tables | `date_key` | `<= CURRENT_DATE` | High |
| VAL-012 | Transaction amounts are reasonable | `fact_transactions` | `amount_cents` | > -10000000 (max $100K refund) AND < 100000000 (max $1M charge) | High |

```sql
-- VAL-012: Transaction amount sanity check
SELECT
    txn_id,
    amount_cents,
    txn_type,
    _etl_extracted_at
FROM analytics_{{PROJECT_NAME}}.fact_transactions
WHERE amount_cents < -10000000  -- Refund > $100K
   OR amount_cents > 100000000  -- Charge > $1M
   OR (txn_type = 'charge' AND amount_cents < 0)  -- Negative charge
   OR (txn_type = 'refund' AND amount_cents > 0);  -- Positive refund
```

### 2.6 Uniqueness Rules

| Rule ID | Rule | Table | Column(s) | Severity |
|---------|------|-------|-----------|----------|
| UNQ-001 | User ID is unique in dim (current version) | `dim_users` | `user_id` WHERE `is_current = TRUE` | Critical |
| UNQ-002 | Event ID is unique | `fact_events` | `event_id` | Critical |
| UNQ-003 | Transaction ID is unique | `fact_transactions` | `txn_id` | Critical |
| UNQ-004 | Subscription ID + month is unique in MRR | `mrr_movements` | `subscription_id`, `month_start` | Critical |
| UNQ-005 | Date key is unique in daily metrics | `daily_active_users` | `date_key` | Critical |
| UNQ-006 | Session ID is unique | `fact_sessions` | `session_id` | High |
| UNQ-007 | Plan ID is unique in dim (current version) | `dim_plans` | `plan_id` WHERE `is_current = TRUE` | Critical |

```sql
-- UNQ-001: Check for duplicate current users
SELECT user_id, COUNT(*) AS duplicate_count
FROM analytics_{{PROJECT_NAME}}.dim_users
WHERE is_current = TRUE
GROUP BY user_id
HAVING COUNT(*) > 1;
```

---

## 3. Freshness SLAs

### By Data Domain

| Domain | Tables | Max Staleness | Check Frequency | Alert Channel | Escalation |
|--------|--------|---------------|-----------------|---------------|------------|
| **Financial** | `fact_transactions`, `fact_subscriptions`, `mrr_movements` | 1 hour | Every 15 min | {{BI_ALERT_CHANNEL}} + PagerDuty | Finance lead after 2 hours |
| **Product Usage** | `fact_events`, `fact_sessions`, `daily_active_users` | 4 hours | Every 30 min | {{BI_ALERT_CHANNEL}} | Product lead after 8 hours |
| **User Dimensions** | `dim_users`, `dim_plans` | 4 hours | Every 30 min | {{BI_ALERT_CHANNEL}} | Data team after 8 hours |
| **CX / Support** | `customer_health`, `support_metrics` | 8 hours | Every hour | {{BI_ALERT_CHANNEL}} | CX lead after 16 hours |
| **Marketing** | Marketing-sourced tables | 24 hours | Every 4 hours | {{BI_INFO_CHANNEL}} | Marketing lead after 48 hours |
| **Reference Data** | `dim_dates`, `dim_geography`, `dim_features` | 7 days | Daily | {{BI_INFO_CHANNEL}} | Data team after 14 days |

### Freshness Monitoring Implementation

```sql
-- Master freshness check query
-- Returns all tables that have breached their SLA
CREATE OR REPLACE VIEW reporting_{{PROJECT_NAME}}.rpt_data_freshness AS
WITH freshness_slas AS (
    -- Define SLAs as a reference table
    SELECT * FROM (VALUES
        ('fact_transactions',    INTERVAL '1 hour',   'financial',     'critical'),
        ('fact_subscriptions',   INTERVAL '1 hour',   'financial',     'critical'),
        ('mrr_movements',        INTERVAL '2 hours',  'financial',     'critical'),
        ('fact_events',          INTERVAL '4 hours',  'product_usage', 'high'),
        ('fact_sessions',        INTERVAL '4 hours',  'product_usage', 'high'),
        ('daily_active_users',   INTERVAL '4 hours',  'product_usage', 'high'),
        ('dim_users',            INTERVAL '4 hours',  'dimensions',    'high'),
        ('dim_plans',            INTERVAL '4 hours',  'dimensions',    'medium'),
        ('cohort_retention',     INTERVAL '24 hours', 'analytics',     'medium'),
        ('funnel_conversion',    INTERVAL '24 hours', 'analytics',     'medium'),
        ('customer_health',      INTERVAL '8 hours',  'cx',            'medium'),
        ('unit_economics',       INTERVAL '24 hours', 'finance',       'medium')
    ) AS t(table_name, max_staleness, domain, severity)
),

actual_freshness AS (
    SELECT 'fact_transactions' AS table_name,
           MAX(_etl_extracted_at) AS last_loaded,
           CURRENT_TIMESTAMP - MAX(_etl_extracted_at) AS staleness
    FROM analytics_{{PROJECT_NAME}}.fact_transactions
    UNION ALL
    SELECT 'fact_events',
           MAX(_etl_extracted_at),
           CURRENT_TIMESTAMP - MAX(_etl_extracted_at)
    FROM analytics_{{PROJECT_NAME}}.fact_events
    UNION ALL
    SELECT 'dim_users',
           MAX(_etl_extracted_at),
           CURRENT_TIMESTAMP - MAX(_etl_extracted_at)
    FROM analytics_{{PROJECT_NAME}}.dim_users
    -- ... repeat for each monitored table
)

SELECT
    sla.table_name,
    sla.domain,
    sla.severity,
    sla.max_staleness,
    af.last_loaded,
    af.staleness,
    CASE
        WHEN af.staleness > sla.max_staleness THEN 'BREACHED'
        WHEN af.staleness > sla.max_staleness * 0.75 THEN 'WARNING'
        ELSE 'OK'
    END AS freshness_status,
    CASE
        WHEN af.staleness > sla.max_staleness
        THEN EXTRACT(EPOCH FROM (af.staleness - sla.max_staleness)) / 60
        ELSE 0
    END AS minutes_overdue
FROM freshness_slas sla
LEFT JOIN actual_freshness af ON sla.table_name = af.table_name
ORDER BY
    CASE sla.severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    af.staleness DESC;
```

---

## 4. PII Handling

### Strategy: {{BI_PII_STRATEGY}}

<!-- IF {{BI_PII_STRATEGY}} == "mask" -->

### Masking Strategy

PII fields are masked in the staging layer so that downstream models never see raw PII. Masked data retains partial utility for debugging while preventing identification.

| PII Field | Source Table | Masking Rule | Masked Example |
|-----------|-------------|-------------|----------------|
| `email` | `raw_app_users` | First 2 chars + `***@` + domain | `jo***@gmail.com` |
| `name` | `raw_app_users` | First char + `***` + last char | `J*** e` |
| `phone` | `raw_app_users` | Last 4 digits only | `***-***-4567` |
| `ip_address` | `raw_analytics_events` | First 2 octets + `.0.0` | `192.168.0.0` |
| `address` | `raw_billing_customers` | City + country only | `San Francisco, US` |

**Implementation in staging models:**

```sql
-- Masking macros (in macros/pii_masking.sql)
{% macro mask_email(column) %}
    CONCAT(LEFT({{ column }}, 2), '***@', SPLIT_PART({{ column }}, '@', 2))
{% endmacro %}

{% macro mask_name(column) %}
    CONCAT(LEFT({{ column }}, 1), '***', RIGHT({{ column }}, 1))
{% endmacro %}

{% macro mask_phone(column) %}
    CONCAT('***-***-', RIGHT(REGEXP_REPLACE({{ column }}, '[^0-9]', ''), 4))
{% endmacro %}

{% macro mask_ip(column) %}
    CONCAT(
        SPLIT_PART({{ column }}, '.', 1), '.',
        SPLIT_PART({{ column }}, '.', 2), '.0.0'
    )
{% endmacro %}
```

**Access control:** Raw schema (`raw_{{PROJECT_NAME}}`) access is restricted to `etl_role` and `admin_role` only. All downstream consumers (analysts, BI tools) only access `analytics_` and `reporting_` schemas where masking is already applied.

<!-- ENDIF -->

---

<!-- IF {{BI_PII_STRATEGY}} == "hash" -->

### Hashing Strategy

PII fields are replaced with irreversible cryptographic hashes in the staging layer. Hashed values enable join operations and deduplication without exposing PII.

| PII Field | Source Table | Hash Method | Notes |
|-----------|-------------|-------------|-------|
| `email` | `raw_app_users` | SHA-256 of `LOWER(TRIM(email))` | Normalize before hashing for consistency |
| `name` | `raw_app_users` | Excluded (not hashed, dropped entirely) | Names provide no analytical value when hashed |
| `phone` | `raw_app_users` | SHA-256 of normalized phone | Normalize: remove spaces, dashes, country code |
| `ip_address` | `raw_analytics_events` | SHA-256 | Used for session stitching only |

**Implementation:**

```sql
-- In staging model
SELECT
    id AS user_id,
    {{ hash_pii('email') }} AS email_hash,  -- SHA-256
    -- name is dropped entirely (not included in staging model)
    -- phone is dropped or hashed based on need
    created_at AS signup_date,
    role AS user_role
FROM {{ source('app_raw', 'raw_app_users') }}
```

**Important considerations:**
- SHA-256 is one-way but NOT immune to rainbow table attacks for common emails
- For higher security, use HMAC-SHA256 with a secret key: `HMAC(email, '{{PII_HASH_SECRET}}')`
- The hash secret must be stored in a secrets manager, not in code or dbt vars
- If you need to reverse-lookup (e.g., find a specific user's data for deletion), maintain a separate PII lookup table in a restricted schema

```sql
-- PII lookup table (restricted access, admin_role only)
CREATE TABLE restricted_{{PROJECT_NAME}}.pii_lookup (
    email_hash  VARCHAR(64) PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    user_id     VARCHAR(64) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Grant access ONLY to admin role
GRANT SELECT ON restricted_{{PROJECT_NAME}}.pii_lookup TO admin_role;
REVOKE ALL ON restricted_{{PROJECT_NAME}}.pii_lookup FROM PUBLIC;
```

<!-- ENDIF -->

---

<!-- IF {{BI_PII_STRATEGY}} == "exclude" -->

### Exclusion Strategy

PII fields are completely excluded from the warehouse. No PII enters any schema beyond `raw_`. This is the most conservative approach, suitable for highly regulated industries or when the data team has no need for PII in analytics.

| PII Field | Source Table | Action | Consequence |
|-----------|-------------|--------|-------------|
| `email` | `raw_app_users` | Excluded from staging model | Cannot identify specific users from warehouse |
| `name` | `raw_app_users` | Excluded | |
| `phone` | `raw_app_users` | Excluded | |
| `address` | `raw_billing_customers` | Excluded | Geographic analysis uses country/region from IP |
| `ip_address` | `raw_analytics_events` | Excluded | Session stitching uses analytics_user_id instead |
| `credit_card_last4` | `raw_billing_charges` | Excluded | |

**Implementation:**

```sql
-- Staging model: explicitly list only non-PII columns
SELECT
    id AS user_id,
    -- email is NOT selected
    -- name is NOT selected
    created_at AS signup_date,
    role AS user_role,
    organization_id,
    -- Generate a deterministic non-reversible identifier for cross-system joins
    MD5(id || '{{PII_SALT}}') AS pseudonymized_id
FROM {{ source('app_raw', 'raw_app_users') }}
```

**Raw layer protection:** Even though raw data contains PII, access is locked to `etl_role` only. Raw data is retained for {{BI_DATA_RETENTION_MONTHS}} months, then purged. The raw schema is excluded from all BI platform connections.

```sql
-- Automated raw PII purge (run monthly)
DELETE FROM raw_{{PROJECT_NAME}}.raw_app_users
WHERE _etl_extracted_at < CURRENT_DATE - INTERVAL '{{BI_DATA_RETENTION_MONTHS}} months';
```

<!-- ENDIF -->

---

<!-- IF {{BI_PII_STRATEGY}} == "vault" -->

### Vault (Tokenization) Strategy

PII fields are replaced with opaque tokens. The mapping between tokens and real PII is stored in a separate, heavily secured vault. This enables re-identification when legally required (e.g., GDPR data subject access requests) while keeping the analytical warehouse PII-free.

| PII Field | Source Table | Vault Table | Token Format |
|-----------|-------------|-------------|-------------|
| `email` | `raw_app_users` | `vault.email_tokens` | `tok_email_<uuid>` |
| `name` | `raw_app_users` | `vault.name_tokens` | `tok_name_<uuid>` |
| `phone` | `raw_app_users` | `vault.phone_tokens` | `tok_phone_<uuid>` |
| `ip_address` | `raw_analytics_events` | `vault.ip_tokens` | `tok_ip_<uuid>` |

**Vault architecture:**

```
┌──────────────────────────┐     ┌────────────────────────────┐
│  Analytics Warehouse     │     │  PII Vault (separate DB)   │
│                          │     │                            │
│  dim_users               │     │  vault.email_tokens        │
│  ├─ user_id              │     │  ├─ token (PK)             │
│  ├─ email_token ─────────│────►│  ├─ email (encrypted)      │
│  ├─ signup_date          │     │  ├─ user_id                │
│  └─ user_role            │     │  └─ created_at             │
│                          │     │                            │
│  Access: analyst_role    │     │  Access: admin_role ONLY   │
│          bi_role         │     │  Audit: every query logged │
└──────────────────────────┘     └────────────────────────────┘
```

**Implementation:**

```sql
-- Tokenization during staging (ETL step, not dbt)
-- Step 1: Generate token for new PII values
INSERT INTO vault.email_tokens (token, email_encrypted, user_id, created_at)
SELECT
    'tok_email_' || gen_random_uuid() AS token,
    pgp_sym_encrypt(email, '{{VAULT_ENCRYPTION_KEY}}') AS email_encrypted,
    id AS user_id,
    CURRENT_TIMESTAMP
FROM raw_{{PROJECT_NAME}}.raw_app_users src
WHERE NOT EXISTS (
    SELECT 1 FROM vault.email_tokens v WHERE v.user_id = src.id
);

-- Step 2: Use token in staging model
SELECT
    u.id AS user_id,
    v.token AS email_token,  -- Opaque token, not PII
    u.created_at AS signup_date,
    u.role AS user_role
FROM raw_{{PROJECT_NAME}}.raw_app_users u
LEFT JOIN vault.email_tokens v ON u.id = v.user_id;
```

**Vault access policy:**
- Vault database is on a separate instance from the warehouse
- Only `admin_role` and `privacy_officer_role` can access the vault
- Every vault query is logged with the querying user, timestamp, and reason
- Vault access requires MFA and a justification ticket

<!-- ENDIF -->

---

### PII Inventory

Regardless of strategy, maintain an inventory of all PII fields entering the pipeline.

| Field | Source | Classification | Handling | Retention | Deletion Method |
|-------|--------|---------------|----------|-----------|-----------------|
| `email` | {{DATABASE}}.users | Personal identifier | {{BI_PII_STRATEGY}} | {{BI_DATA_RETENTION_MONTHS}} months | Cascade from source deletion |
| `name` / `display_name` | {{DATABASE}}.users | Personal identifier | {{BI_PII_STRATEGY}} | {{BI_DATA_RETENTION_MONTHS}} months | Cascade |
| `phone` | {{DATABASE}}.users | Personal identifier | {{BI_PII_STRATEGY}} | {{BI_DATA_RETENTION_MONTHS}} months | Cascade |
| `ip_address` | {{ANALYTICS_PROVIDER}} events | Indirect identifier | {{BI_PII_STRATEGY}} | 90 days (then purge) | Time-based purge |
| `browser_fingerprint` | {{ANALYTICS_PROVIDER}} events | Indirect identifier | Exclude | 90 days | Time-based purge |
| `billing_address` | {{BILLING_PROVIDER}} customers | Personal data | {{BI_PII_STRATEGY}} | {{BI_DATA_RETENTION_MONTHS}} months | Cascade |
| `credit_card_last4` | {{BILLING_PROVIDER}} charges | Financial PII | Exclude always | N/A | Never enters warehouse |
| `user_agent` | {{ANALYTICS_PROVIDER}} events | Indirect identifier | Exclude | N/A | Never enters warehouse |

---

## 5. Data Lineage

### Documentation Requirements

Every metric displayed on a dashboard must have documented lineage from source to visualization.

#### Lineage Record Template

```yaml
# Lineage record for a single metric
metric_name: "Monthly Recurring Revenue (MRR)"
metric_id: "FIN-001"
owner: "{{BI_METRIC_OWNER_DEFAULT}}"

source_systems:
  - system: "{{BILLING_PROVIDER}}"
    table: "subscriptions"
    key_fields: ["id", "status", "items.data[0].price.unit_amount", "items.data[0].price.recurring.interval"]
    extraction: "{{BI_ETL_TOOL}} connector, hourly sync"

pipeline_stages:
  - stage: "raw"
    table: "raw_{{PROJECT_NAME}}.raw_billing_subscriptions"
    transformation: "None (exact copy from source)"

  - stage: "staging"
    table: "staging_{{PROJECT_NAME}}.stg_{{BILLING_PROVIDER}}__subscriptions"
    transformation: |
      - Deduplicate by subscription_id (keep latest _etl_extracted_at)
      - Convert Unix timestamps to TIMESTAMPTZ
      - Normalize amount to monthly (annual / 12, quarterly / 3)
      - Apply discount percentage
      - Filter out incomplete/expired subscriptions

  - stage: "intermediate"
    table: "analytics_{{PROJECT_NAME}}.int_user_subscription_history"
    transformation: |
      - Join with users via billing_customers table
      - Calculate effective_mrr_cents after discount
      - Determine is_currently_trialing flag

  - stage: "mart"
    table: "analytics_{{PROJECT_NAME}}.mrr_movements"
    transformation: |
      - Generate date spine (monthly)
      - Classify each subscription-month as new/expansion/contraction/churn/reactivation
      - Calculate mrr_change_cents per movement

  - stage: "reporting"
    table: "reporting_{{PROJECT_NAME}}.rpt_mrr_waterfall"
    transformation: "Aggregate movements by month and type"

consuming_dashboards:
  - dashboard: "Board Deck — MRR Waterfall"
    platform: "{{BI_PLATFORM}}"
    visualization: "Stacked bar chart (movements) + line (ending MRR)"
  - dashboard: "Finance Dashboard"
    platform: "{{BI_PLATFORM}}"
    visualization: "MRR trend line, MRR by plan tier"
  - dashboard: "Unit Economics"
    platform: "{{BI_PLATFORM}}"
    visualization: "Input to NRR, quick ratio, LTV calculations"

known_caveats:
  - "Trial subscriptions are excluded from MRR (MRR = $0 during trial)"
  - "Annual subscriptions normalized to monthly may create rounding discrepancies of up to $0.01/mo"
  - "Grace period of {{CHURN_GRACE_PERIOD_DAYS}} days: past_due subscriptions are still counted as active MRR"
  - "Discounted subscriptions use the discounted rate, not list price"
```

### Automated Lineage (dbt)

```bash
# dbt generates lineage automatically via the DAG
# View in dbt docs:
dbt docs generate
dbt docs serve

# Or use dbt Cloud's lineage visualization
# Lineage is derived from ref() and source() calls in SQL models
```

---

## 6. Audit Trail

### Query Audit Logging

Track who queries what data, when, and from which tool.

#### Warehouse-Native Audit

```sql
-- Snowflake: Query history
SELECT
    USER_NAME,
    ROLE_NAME,
    QUERY_TEXT,
    DATABASE_NAME,
    SCHEMA_NAME,
    START_TIME,
    TOTAL_ELAPSED_TIME / 1000 AS duration_seconds,
    ROWS_PRODUCED,
    BYTES_SCANNED
FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE DATABASE_NAME LIKE '%{{PROJECT_NAME}}%'
  AND START_TIME > DATEADD('day', -30, CURRENT_TIMESTAMP())
ORDER BY START_TIME DESC;

-- BigQuery: Audit logs via Cloud Logging
-- Filter: protoPayload.serviceName="bigquery.googleapis.com"
-- AND protoPayload.methodName="jobservice.jobcompleted"
-- AND protoPayload.serviceData.jobCompletedEvent.job.jobConfiguration.query.query LIKE '%{{PROJECT_NAME}}%'

-- PostgreSQL: enable query logging
-- postgresql.conf:
-- log_statement = 'all'  (or 'mod' for modifications only)
-- log_duration = on
-- Or use pgAudit extension for fine-grained audit
```

#### Dashboard Access Audit

| Event | Data Captured | Storage | Retention |
|-------|--------------|---------|-----------|
| Dashboard viewed | User, dashboard ID, timestamp, duration | BI platform logs | 90 days |
| Query executed | User, SQL text, tables accessed, rows returned | Warehouse query history | 365 days |
| Data exported | User, export format, row count, timestamp | BI platform + custom logging | 365 days |
| Dashboard shared | User, recipient, permissions granted | BI platform logs | 365 days |
| Alert triggered | Alert rule, triggering value, recipients | Alerting system | 365 days |

### Audit Review Cadence

| Review | Frequency | Reviewer | Purpose |
|--------|-----------|----------|---------|
| Sensitive table access | Weekly | Data team lead | Ensure no unauthorized access to financial data |
| PII-adjacent queries | Weekly | Privacy officer (if applicable) | Detect queries that could reconstruct PII |
| Export activity | Monthly | Data team lead | Detect bulk data exports that may indicate data loss |
| Role assignments | Quarterly | Engineering manager | Verify role assignments are still appropriate |
| Service account usage | Monthly | Data team lead | Ensure service accounts are not used for ad-hoc queries |

---

## 7. Data Contracts

### Producer-Consumer Agreements

A data contract formalizes the agreement between the team that produces data (e.g., application engineering) and the team that consumes it (e.g., data/analytics team).

#### Contract Template

```yaml
# Data Contract: {{DATABASE}}.users → analytics warehouse
contract_id: "DC-{{PROJECT_NAME}}-USERS-001"
version: "1.0"
status: "active"  # active | deprecated | draft

producer:
  team: "{{PRODUCER_TEAM}}"
  owner: "{{PRODUCER_OWNER}}"
  system: "{{DATABASE}}"
  table: "users"

consumer:
  team: "{{BI_METRIC_OWNER_DEFAULT}}"
  owner: "{{DATA_TEAM_LEAD}}"
  system: "{{BI_WAREHOUSE}}"
  table: "dim_users"

schema_guarantees:
  # Producer guarantees these columns will exist and maintain their types
  guaranteed_columns:
    - name: "id"
      type: "uuid"
      nullable: false
      description: "Primary key, immutable after creation"
    - name: "email"
      type: "varchar(255)"
      nullable: false
      description: "User email, unique"
    - name: "created_at"
      type: "timestamptz"
      nullable: false
      description: "Account creation timestamp, immutable"
    - name: "updated_at"
      type: "timestamptz"
      nullable: false
      description: "Last update timestamp, auto-updated"
    - name: "role"
      type: "varchar(50)"
      nullable: false
      description: "User role enum"
    - name: "organization_id"
      type: "uuid"
      nullable: false
      description: "FK to organizations"

  # Columns may be added but these columns will NOT be removed or renamed
  # without 30 days notice to the consumer team
  change_policy:
    additions: "Allowed without notice (consumer pipeline handles gracefully)"
    removals: "30-day notice required via {{DATA_CONTRACT_NOTIFICATION_CHANNEL}}"
    type_changes: "30-day notice + migration plan required"
    renames: "Treated as removal + addition"

quality_guarantees:
  freshness: "Data updated within 5 minutes of application write"
  availability: "99.9% uptime (matches application SLA)"
  uniqueness: "id column is globally unique"
  completeness: "created_at and email are never null"
  volume: "Insertions: 50-500 new users/day. Sudden drops > 50% indicate an issue."

breach_handling:
  detection: "Consumer runs automated schema and quality checks per ETL run"
  notification: "Alert to {{DATA_CONTRACT_NOTIFICATION_CHANNEL}} within 15 minutes"
  resolution_sla: "Critical breaches: 4 hours. Non-critical: 5 business days."
  escalation: "If unresolved after SLA, escalate to {{ESCALATION_CONTACT}}"

review_cadence: "Quarterly review between producer and consumer teams"
last_reviewed: "{{LAST_CONTRACT_REVIEW_DATE}}"
next_review: "{{NEXT_CONTRACT_REVIEW_DATE}}"
```

### Active Contracts Registry

| Contract ID | Source | Target | Producer Team | Consumer Team | Status | Last Reviewed |
|-------------|--------|--------|---------------|---------------|--------|---------------|
| DC-001 | {{DATABASE}}.users | dim_users | Engineering | Data | Active | {{LAST_CONTRACT_REVIEW_DATE}} |
| DC-002 | {{DATABASE}}.organizations | dim_organizations | Engineering | Data | Active | {{LAST_CONTRACT_REVIEW_DATE}} |
| DC-003 | {{BILLING_PROVIDER}}.subscriptions | fact_subscriptions | {{BILLING_PROVIDER}} (external) | Data | Active | {{LAST_CONTRACT_REVIEW_DATE}} |
| DC-004 | {{ANALYTICS_PROVIDER}}.events | fact_events | Product | Data | Active | {{LAST_CONTRACT_REVIEW_DATE}} |
| DC-005 | {{SUPPORT_TOOL}}.tickets | support_metrics | CX | Data | Active | {{LAST_CONTRACT_REVIEW_DATE}} |

---

## 8. Quality Monitoring Dashboard

### Dashboard Specification

**Dashboard name:** {{PROJECT_NAME}} Data Quality Monitor
**Platform:** {{BI_PLATFORM}}
**Refresh:** Every 15 minutes
**Owner:** {{BI_METRIC_OWNER_DEFAULT}}

#### Panel 1: Freshness Overview

| Visual Type | Data Source | Metrics |
|-------------|-----------|---------|
| Status grid (heatmap) | `rpt_data_freshness` | Green/yellow/red per table based on SLA status |
| Time series | `rpt_data_freshness` (historical) | Staleness trend over last 7 days |

#### Panel 2: Quality Scores by Dimension

| Visual Type | Data Source | Metrics |
|-------------|-----------|---------|
| Scorecard | Quality check results | Pass rate per dimension (accuracy, completeness, etc.) |
| Trend line | Historical check results | Quality score trend over last 30 days |

#### Panel 3: Test Results

| Visual Type | Data Source | Metrics |
|-------------|-----------|---------|
| Table | dbt test results | Latest test run: test name, status, failure count, last passed |
| Bar chart | dbt test history | Tests passed vs failed per run over last 7 days |

#### Panel 4: Pipeline Health

| Visual Type | Data Source | Metrics |
|-------------|-----------|---------|
| Status indicator | Pipeline monitoring | Current pipeline status (running / succeeded / failed) |
| Duration chart | Pipeline history | ETL duration trend (detect degradation) |
| Row count chart | Row count tracking | Daily rows ingested per source (anomaly detection) |

#### Panel 5: Alerts

| Visual Type | Data Source | Metrics |
|-------------|-----------|---------|
| Alert feed | Alert history table | Most recent alerts: severity, message, status, resolution time |
| Pie chart | Alert history | Alert distribution by severity and domain |

### Alerting Rules

```yaml
# Quality alert configuration
alerts:
  - name: "Freshness SLA breach"
    query: "SELECT * FROM rpt_data_freshness WHERE freshness_status = 'BREACHED'"
    schedule: "every 15 minutes"
    severity_map:
      financial: critical
      product_usage: high
      cx: medium
      marketing: low
    channels:
      critical: [slack_{{BI_ALERT_CHANNEL}}, pagerduty]
      high: [slack_{{BI_ALERT_CHANNEL}}]
      medium: [slack_{{BI_INFO_CHANNEL}}]
      low: [email_weekly_digest]

  - name: "dbt test failure"
    query: "SELECT * FROM dbt_test_results WHERE status = 'fail' AND run_started_at > NOW() - INTERVAL '1 hour'"
    schedule: "after each dbt run"
    severity: high
    channels: [slack_{{BI_ALERT_CHANNEL}}]

  - name: "Row count anomaly"
    query: "SELECT * FROM row_count_anomalies WHERE z_score > 3 OR z_score < -3"
    schedule: "daily at 6 AM UTC"
    severity: warning
    channels: [slack_{{BI_ALERT_CHANNEL}}]

  - name: "MRR reconciliation discrepancy"
    query: "ACC-001 check query (see Section 2.1)"
    schedule: "daily at 7 AM UTC"
    severity: critical
    channels: [slack_{{BI_ALERT_CHANNEL}}, email_finance_lead]

  - name: "Duplicate records detected"
    query: "UNQ checks returning rows"
    schedule: "after each dbt run"
    severity: critical
    channels: [slack_{{BI_ALERT_CHANNEL}}]
```

---

## 9. Incident Response

### Severity Classification

| Severity | Definition | Examples | Response Time | Resolution Target |
|----------|-----------|----------|---------------|-------------------|
| **SEV-1 (Critical)** | Financial data is incorrect or PII is exposed | MRR miscalculated, PII in reporting schema, all dashboards down | 15 minutes | 4 hours |
| **SEV-2 (High)** | Key dashboards show stale or incorrect non-financial data | DAU dashboard 12 hours stale, cohort retention numbers wrong | 1 hour | 8 hours |
| **SEV-3 (Medium)** | Non-critical data quality issue | Marketing metrics delayed, minor completeness gaps | 4 hours | 2 business days |
| **SEV-4 (Low)** | Cosmetic or minor issues | A seed table is outdated, a non-critical test is failing | 1 business day | 5 business days |

### Incident Response Playbook

#### Stale Data

```
TRIGGER: Freshness SLA breach detected
WHO: On-call data engineer

1. CHECK pipeline status
   - Is the ETL pipeline running? (Check {{BI_ORCHESTRATOR}} dashboard)
   - Did the latest run fail? (Check logs)
   - Is the source system accessible? (Check connectivity)

2. IDENTIFY root cause
   □ Pipeline failure → Check error logs, retry pipeline
   □ Source system down → Contact source team, update stakeholders
   □ Schema drift → Check schema drift alerts, update staging models
   □ Infrastructure issue → Check warehouse status, scaling limits

3. MITIGATE
   - If dashboard-facing: add "Data as of [timestamp]" banner
   - If financial: notify Finance lead immediately
   - If > 4 hours stale: send stakeholder notification

4. RESOLVE
   - Fix root cause
   - Backfill missing data if needed
   - Verify freshness returns to SLA

5. POST-MORTEM (within 48 hours for SEV-1/2)
   - Root cause analysis
   - Timeline of events
   - What went well / what failed
   - Action items to prevent recurrence
```

#### Incorrect Calculations

```
TRIGGER: Accuracy check failure or user report of wrong numbers
WHO: Data engineer + metric owner

1. CONFIRM the issue
   - Reproduce the incorrect value
   - Compare with source system / manual calculation
   - Determine scope: one metric, one table, or systemic

2. ASSESS impact
   - Which dashboards are affected?
   - Were any decisions made based on incorrect data?
   - Is this a current issue or historical (was it ever correct)?

3. ISOLATE
   - If actively serving wrong data: take affected dashboard offline or add warning banner
   - If the issue is in transformation logic: identify the specific model

4. FIX
   - Update the transformation SQL
   - Run targeted dbt build with --full-refresh if needed
   - Validate fix against source data

5. BACKFILL
   - If historical data is affected: determine how far back
   - Run backfill with corrected logic
   - Validate historical numbers

6. COMMUNICATE
   - Notify all stakeholders who consumed incorrect data
   - Provide corrected numbers
   - Document the error period and magnitude
```

#### PII Exposure

```
TRIGGER: PII detected in reporting or analytics schema
WHO: Data engineer + privacy officer + security team
SEVERITY: Always SEV-1

1. CONTAIN IMMEDIATELY
   - Revoke BI platform access to affected table/view
   - If data was queried: identify all users who accessed it
   - If data was exported: initiate data breach response protocol

2. REMOVE PII
   - Drop or truncate the affected table
   - Identify the staging model that leaked PII
   - Fix the model to apply {{BI_PII_STRATEGY}} correctly
   - Rebuild affected tables

3. VERIFY
   - Scan all reporting/analytics tables for PII patterns
   - Automated PII detection scan (email regex, phone patterns, etc.)

4. REPORT
   - If GDPR-applicable: assess if this constitutes a data breach
   - If breach: notify DPO within 24 hours, supervisory authority within 72 hours
   - Document: what PII, how long exposed, who accessed it

5. PREVENT
   - Add PII detection tests to dbt test suite
   - Add pre-commit hook to scan for raw PII columns in analytics/reporting models
   - Review and strengthen PII handling macros
```

---

## 10. Quarterly Data Governance Review

### Checklist

Run this review every quarter. Schedule a 2-hour meeting with the data team, metric owners from each department, and the engineering lead.

#### Data Quality Health

- [ ] **Freshness SLAs:** Are all tables meeting their freshness SLAs consistently? Review the last 90 days of freshness monitoring data. Identify any recurring breaches and root causes.
- [ ] **Test pass rate:** What is the overall dbt test pass rate? Target: > 99%. Review any tests that were disabled or have `severity: warn` — should they be upgraded to `error`?
- [ ] **Accuracy reconciliation:** Run MRR reconciliation (ACC-001) and user count reconciliation (ACC-003). Document any discrepancies and resolution.
- [ ] **Completeness audit:** Review NULL rates for critical columns. Has completeness degraded since last quarter?
- [ ] **Uniqueness audit:** Run all UNQ checks. Any new duplicate issues?
- [ ] **DLQ review:** How many records are in the dead letter queue? What are the common failure patterns? Are there systemic issues?

#### Data Contracts

- [ ] **Contract review:** Review each active data contract. Have any source schemas changed that require contract updates?
- [ ] **New sources:** Were any new data sources added this quarter? Do they have contracts?
- [ ] **Breach history:** Were there any contract breaches? How were they resolved? Are preventive measures in place?

#### PII and Compliance

- [ ] **PII scan:** Run automated PII detection on all analytics and reporting schemas. Verify no raw PII has leaked through.
- [ ] **Access review:** Review warehouse role assignments. Remove access for departed employees. Verify no over-permissioned roles.
- [ ] **Deletion requests:** Were any GDPR/CCPA deletion requests received? Were they executed in the warehouse within the required timeframe?
- [ ] **Retention policy:** Is data older than {{BI_DATA_RETENTION_MONTHS}} months being purged per policy? Verify with storage metrics.

#### Pipeline Health

- [ ] **Pipeline reliability:** What is the pipeline success rate? Target: > 99%. Review failure patterns.
- [ ] **Pipeline duration:** Has ETL duration increased? Identify slow extractors or transforms.
- [ ] **Cost review:** Compare warehouse + ETL costs against budget. Identify optimization opportunities.
- [ ] **Schema drift:** Were there any schema drift incidents? How were they detected and resolved?

#### Metric Governance

- [ ] **Metric registry audit:** Are all dashboard metrics documented in the unified metrics registry? Are there any "rogue" metrics not in the registry?
- [ ] **Metric ownership:** Does every metric have a current owner? Have any owners changed roles?
- [ ] **Definition alignment:** Survey 3-5 stakeholders: "What does [metric] mean to you?" Compare with the canonical definition. Identify and resolve any metric drift.
- [ ] **Dashboard inventory:** List all active dashboards. Are any unused (0 views in 60 days)? Flag for deprecation.
- [ ] **Dashboard accuracy:** Spot-check 3-5 dashboard values against warehouse queries. Do they match?

#### Action Items

- [ ] Document all findings in the governance log
- [ ] Create tickets for issues identified
- [ ] Update data contracts as needed
- [ ] Schedule next quarterly review

---

## 11. GDPR / CCPA Compliance for Analytics Data

### Right to Deletion (GDPR Article 17 / CCPA Right to Delete)

When a user requests data deletion, their data must be removed from the warehouse within {{DELETION_SLA_DAYS}} days.

#### Deletion Process

```
1. RECEIVE deletion request (from support team or automated system)
2. IDENTIFY all warehouse tables containing user's data
3. EXECUTE deletion across all schemas
4. VERIFY deletion is complete
5. LOG the deletion for audit trail
6. CONFIRM to requestor
```

#### Deletion Script

```sql
-- User deletion from {{PROJECT_NAME}} data warehouse
-- Triggered by: GDPR/CCPA deletion request
-- User ID: {{DELETION_USER_ID}}

-- WARNING: This is destructive and irreversible. Verify user_id before executing.

BEGIN;

-- 1. Log the deletion request (before deleting anything)
INSERT INTO governance_{{PROJECT_NAME}}.deletion_log (
    request_id, user_id, requested_at, requested_by, status
) VALUES (
    '{{DELETION_REQUEST_ID}}',
    '{{DELETION_USER_ID}}',
    CURRENT_TIMESTAMP,
    '{{DELETION_REQUESTED_BY}}',
    'in_progress'
);

-- 2. Delete from fact tables
DELETE FROM analytics_{{PROJECT_NAME}}.fact_events
WHERE user_key IN (
    SELECT user_key FROM analytics_{{PROJECT_NAME}}.dim_users
    WHERE user_id = '{{DELETION_USER_ID}}'
);

DELETE FROM analytics_{{PROJECT_NAME}}.fact_transactions
WHERE user_key IN (
    SELECT user_key FROM analytics_{{PROJECT_NAME}}.dim_users
    WHERE user_id = '{{DELETION_USER_ID}}'
);

DELETE FROM analytics_{{PROJECT_NAME}}.fact_sessions
WHERE user_key IN (
    SELECT user_key FROM analytics_{{PROJECT_NAME}}.dim_users
    WHERE user_id = '{{DELETION_USER_ID}}'
);

DELETE FROM analytics_{{PROJECT_NAME}}.fact_subscriptions
WHERE user_key IN (
    SELECT user_key FROM analytics_{{PROJECT_NAME}}.dim_users
    WHERE user_id = '{{DELETION_USER_ID}}'
);

-- 3. Delete from dimension tables (all SCD versions)
DELETE FROM analytics_{{PROJECT_NAME}}.dim_users
WHERE user_id = '{{DELETION_USER_ID}}';

-- 4. Delete from staging tables
DELETE FROM staging_{{PROJECT_NAME}}.stg_app_users
WHERE user_id = '{{DELETION_USER_ID}}';

-- 5. Delete from raw tables
DELETE FROM raw_{{PROJECT_NAME}}.raw_app_users
WHERE id = '{{DELETION_USER_ID}}';

-- 6. Delete from PII vault (if using vault strategy)
{% if var('bi_pii_strategy') == 'vault' %}
DELETE FROM vault.email_tokens WHERE user_id = '{{DELETION_USER_ID}}';
DELETE FROM vault.name_tokens WHERE user_id = '{{DELETION_USER_ID}}';
DELETE FROM vault.phone_tokens WHERE user_id = '{{DELETION_USER_ID}}';
{% endif %}

-- 7. Delete from PII lookup (if using hash strategy)
{% if var('bi_pii_strategy') == 'hash' %}
DELETE FROM restricted_{{PROJECT_NAME}}.pii_lookup
WHERE user_id = '{{DELETION_USER_ID}}';
{% endif %}

-- 8. Update deletion log
UPDATE governance_{{PROJECT_NAME}}.deletion_log
SET status = 'completed', completed_at = CURRENT_TIMESTAMP
WHERE request_id = '{{DELETION_REQUEST_ID}}';

COMMIT;
```

### Data Minimization

Only collect and store what is needed for analytics. Review quarterly.

| Data Category | Justification | Retention | Minimization Applied |
|---------------|--------------|-----------|---------------------|
| User identity (email, name) | Required for user-level analysis and support | {{BI_PII_STRATEGY}} applied; raw retained {{BI_DATA_RETENTION_MONTHS}} months | PII never enters analytics/reporting schemas |
| Usage events | Product improvement, feature adoption | {{BI_DATA_RETENTION_MONTHS}} months | Event properties stripped of PII |
| Financial transactions | Revenue reporting, compliance | {{BI_DATA_RETENTION_MONTHS}} months (minimum based on tax requirements) | Credit card details excluded |
| IP addresses | Geolocation only | 90 days (then purge or aggregate to country level) | Not used for user identification |
| Device/browser info | Platform support prioritization | {{BI_DATA_RETENTION_MONTHS}} months | Aggregated, not tied to user identity |

### Consent Management Integration

If {{PROJECT_NAME}} collects analytics data based on user consent (required in EU/GDPR regions):

```sql
-- Only include consented users in analytics
-- Consent status should flow from application DB to warehouse
SELECT
    e.*
FROM analytics_{{PROJECT_NAME}}.fact_events e
INNER JOIN analytics_{{PROJECT_NAME}}.dim_users u
    ON e.user_key = u.user_key
WHERE u.analytics_consent = TRUE  -- Only include users who consented
   OR u.gdpr_region = FALSE;      -- Non-GDPR users (check local laws)
```

### Compliance Documentation

| Document | Location | Update Frequency | Owner |
|----------|----------|-----------------|-------|
| Data processing inventory (ROPA) | `governance/ropa.md` | Quarterly | Privacy officer |
| PII inventory | Section 4 of this document | Quarterly | Data team |
| Deletion log | `governance_{{PROJECT_NAME}}.deletion_log` | Per request | Automated + privacy officer |
| Data breach log | `governance/breach_log.md` | Per incident | Security team |
| Consent records | Application DB | Real-time | Engineering |
| Data retention schedule | Section 11 of this document | Annually | Data team + legal |

---

## Checklist

- [ ] Quality rules defined for all six dimensions
- [ ] Accuracy reconciliation queries created (MRR, user counts)
- [ ] Completeness checks implemented for critical columns
- [ ] Consistency checks implemented (referential integrity)
- [ ] Freshness SLAs defined per data domain
- [ ] Freshness monitoring view created and automated
- [ ] Validity checks implemented (accepted values, ranges)
- [ ] Uniqueness checks implemented for all primary keys
- [ ] PII handling implemented per {{BI_PII_STRATEGY}}
- [ ] PII inventory documented and reviewed
- [ ] Data lineage documented for all critical metrics
- [ ] Audit trail configured (query logging, access logging)
- [ ] Data contracts established with all data producers
- [ ] Quality monitoring dashboard created in {{BI_PLATFORM}}
- [ ] Alerting configured for freshness breaches, test failures, and anomalies
- [ ] Incident response playbooks documented (stale data, incorrect calculations, PII exposure)
- [ ] Quarterly governance review scheduled
- [ ] GDPR/CCPA deletion script created and tested
- [ ] Data minimization review completed
- [ ] Consent management integrated (if applicable)
- [ ] Compliance documentation up to date
