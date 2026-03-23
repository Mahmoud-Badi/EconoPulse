# Transformation Layer: {{PROJECT_NAME}}

## Overview

**Project:** {{PROJECT_NAME}}
**Transform Tool:** {{BI_TRANSFORM_TOOL}}
**Warehouse:** {{BI_WAREHOUSE}}
**Source Database:** {{DATABASE}}
**Billing Provider:** {{BILLING_PROVIDER}}
**Analytics Provider:** {{ANALYTICS_PROVIDER}}

---

## 1. Transform Tool Configuration

<!-- IF {{BI_TRANSFORM_TOOL}} == "dbt" -->

### dbt Project Setup

**dbt Version:** {{DBT_VERSION}}
**Adapter:** dbt-{{BI_WAREHOUSE}} (e.g., `dbt-snowflake`, `dbt-bigquery`, `dbt-postgres`, `dbt-redshift`, `dbt-clickhouse`, `dbt-duckdb`)

#### Project Initialization

```bash
# Initialize dbt project
dbt init {{PROJECT_NAME}}_analytics
cd {{PROJECT_NAME}}_analytics

# Install dependencies
pip install dbt-{{BI_WAREHOUSE}}=={{DBT_ADAPTER_VERSION}}

# Verify connection
dbt debug --profiles-dir ./profiles
```

#### dbt_project.yml

```yaml
name: '{{PROJECT_NAME}}_analytics'
version: '1.0.0'
config-version: 2

profile: '{{PROJECT_NAME}}'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]

target-path: "target"
clean-targets:
  - "target"
  - "dbt_packages"

vars:
  # Project-wide variables
  project_name: '{{PROJECT_NAME}}'
  default_currency: '{{DEFAULT_CURRENCY}}'
  fiscal_year_start_month: {{FISCAL_YEAR_START_MONTH}}
  trial_length_days: {{TRIAL_LENGTH_DAYS}}
  churn_grace_period_days: {{CHURN_GRACE_PERIOD_DAYS}}
  activation_events: {{ACTIVATION_EVENTS}}  # e.g., ['created_first_project', 'invited_team_member']

models:
  {{PROJECT_NAME}}_analytics:
    staging:
      +materialized: view
      +schema: staging_{{PROJECT_NAME}}
      +tags: ['staging']
    intermediate:
      +materialized: ephemeral
      +tags: ['intermediate']
    marts:
      +materialized: table
      +schema: analytics_{{PROJECT_NAME}}
      +tags: ['marts']
      finance:
        +schema: analytics_{{PROJECT_NAME}}
        +tags: ['finance']
      product:
        +schema: analytics_{{PROJECT_NAME}}
        +tags: ['product']
      cx:
        +schema: analytics_{{PROJECT_NAME}}
        +tags: ['cx']

seeds:
  {{PROJECT_NAME}}_analytics:
    +schema: seeds_{{PROJECT_NAME}}

snapshots:
  {{PROJECT_NAME}}_analytics:
    +schema: snapshots_{{PROJECT_NAME}}
    +strategy: timestamp
    +updated_at: updated_at
```

#### profiles.yml

```yaml
{{PROJECT_NAME}}:
  target: dev
  outputs:
    dev:
      type: {{BI_WAREHOUSE}}
      account: '{{WAREHOUSE_ACCOUNT}}'       # Snowflake
      # project: '{{GCP_PROJECT_ID}}'        # BigQuery
      # host: '{{WAREHOUSE_HOST}}'           # Postgres / Redshift
      user: '{{DBT_USER}}'
      password: '{{ env_var("DBT_PASSWORD") }}'
      database: '{{WAREHOUSE_DATABASE}}'
      schema: 'dbt_dev_{{ env_var("USER") }}'
      threads: 4
      # warehouse: '{{PROJECT_NAME}}_transforming'  # Snowflake
      # role: 'transform_role'                       # Snowflake

    prod:
      type: {{BI_WAREHOUSE}}
      account: '{{WAREHOUSE_ACCOUNT}}'
      user: '{{DBT_PROD_USER}}'
      password: '{{ env_var("DBT_PROD_PASSWORD") }}'
      database: '{{WAREHOUSE_DATABASE}}'
      schema: 'analytics_{{PROJECT_NAME}}'
      threads: 8
      # warehouse: '{{PROJECT_NAME}}_transforming'  # Snowflake
      # role: 'transform_role'                       # Snowflake
```

#### packages.yml

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.0.0", "<2.0.0"]
  - package: dbt-labs/codegen
    version: [">=0.12.0", "<1.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<1.0.0"]
  - package: dbt-labs/metrics
    version: [">=0.4.0", "<1.0.0"]
  # Uncomment based on sources:
  # - package: fivetran/fivetran_utils
  #   version: [">=0.4.0", "<1.0.0"]
  # - package: fivetran/stripe
  #   version: [">=0.12.0", "<1.0.0"]
```

<!-- ENDIF -->

---

<!-- IF {{BI_TRANSFORM_TOOL}} == "dataform" -->

### Google Dataform Configuration

**Repository:** {{DATAFORM_REPO}}
**Default Schema:** `analytics_{{PROJECT_NAME}}`
**Assertion Schema:** `dataform_assertions_{{PROJECT_NAME}}`

#### dataform.json

```json
{
  "defaultSchema": "analytics_{{PROJECT_NAME}}",
  "assertionSchema": "dataform_assertions_{{PROJECT_NAME}}",
  "warehouse": "bigquery",
  "defaultDatabase": "{{GCP_PROJECT_ID}}",
  "defaultLocation": "{{BIGQUERY_LOCATION}}",
  "vars": {
    "project_name": "{{PROJECT_NAME}}",
    "default_currency": "{{DEFAULT_CURRENCY}}",
    "fiscal_year_start_month": "{{FISCAL_YEAR_START_MONTH}}"
  }
}
```

#### Dataform Project Structure

```
definitions/
  sources/           # Source declarations
    app_db.sqlx
    stripe.sqlx
    posthog.sqlx
  staging/           # Cleaned staging models
    stg_app_users.sqlx
    stg_stripe_subscriptions.sqlx
    stg_posthog_events.sqlx
  intermediate/      # Business logic joins
    int_user_subscription_history.sqlx
    int_daily_active_users.sqlx
  marts/
    finance/
      mrr_movements.sqlx
      unit_economics.sqlx
    product/
      daily_active_users.sqlx
      cohort_retention.sqlx
      funnel_conversion.sqlx
    cx/
      customer_health.sqlx
includes/            # Reusable JavaScript functions
  constants.js
  date_utils.js
```

#### Dataform Model Template

```sql
-- definitions/staging/stg_app_users.sqlx
config {
  type: "view",
  schema: "staging_{{PROJECT_NAME}}",
  description: "Cleaned and typed users from {{DATABASE}}",
  assertions: {
    uniqueKey: ["user_id"],
    nonNull: ["user_id", "email_hash", "created_at"]
  }
}

SELECT
  id AS user_id,
  {{BI_PII_STRATEGY}}_email(email) AS email_hash,
  display_name,
  created_at,
  updated_at,
  role AS user_role,
  organization_id
FROM ${ref("raw_app_users")}
WHERE _etl_operation != 'delete'
QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY _etl_extracted_at DESC) = 1
```

<!-- ENDIF -->

---

<!-- IF {{BI_TRANSFORM_TOOL}} == "custom-sql" -->

### Custom SQL Transformation Layer

**Execution Method:** {{CUSTOM_SQL_EXECUTION}} (stored procedures | scheduled scripts | orchestrator-managed)
**Script Location:** {{CUSTOM_SQL_REPO}} (Git repository)

#### Directory Structure

```
sql/
  staging/
    001_stg_app_users.sql
    002_stg_stripe_subscriptions.sql
    003_stg_posthog_events.sql
  intermediate/
    010_int_user_subscription_history.sql
    011_int_daily_active_users.sql
  marts/
    finance/
      020_mrr_movements.sql
      021_unit_economics.sql
    product/
      030_daily_active_users.sql
      031_cohort_retention.sql
      032_funnel_conversion.sql
    cx/
      040_customer_health.sql
  tests/
    test_stg_users_unique.sql
    test_mrr_balance.sql
scripts/
  run_all.sh
  run_staging.sh
  run_marts.sh
  run_tests.sh
```

#### Execution Script

```bash
#!/bin/bash
# scripts/run_all.sh — Execute transformation pipeline in dependency order
set -euo pipefail

WAREHOUSE_HOST="{{WAREHOUSE_HOST}}"
WAREHOUSE_DB="{{WAREHOUSE_DATABASE}}"
WAREHOUSE_USER="{{DBT_PROD_USER}}"

echo "=== Staging Layer ==="
for f in sql/staging/*.sql; do
    echo "Running: $f"
    psql -h "$WAREHOUSE_HOST" -d "$WAREHOUSE_DB" -U "$WAREHOUSE_USER" -f "$f"
done

echo "=== Intermediate Layer ==="
for f in sql/intermediate/*.sql; do
    echo "Running: $f"
    psql -h "$WAREHOUSE_HOST" -d "$WAREHOUSE_DB" -U "$WAREHOUSE_USER" -f "$f"
done

echo "=== Mart Layer ==="
for f in sql/marts/**/*.sql; do
    echo "Running: $f"
    psql -h "$WAREHOUSE_HOST" -d "$WAREHOUSE_DB" -U "$WAREHOUSE_USER" -f "$f"
done

echo "=== Tests ==="
FAILURES=0
for f in sql/tests/*.sql; do
    echo "Testing: $f"
    RESULT=$(psql -h "$WAREHOUSE_HOST" -d "$WAREHOUSE_DB" -U "$WAREHOUSE_USER" -f "$f" -t -A)
    if [ "$RESULT" != "0" ]; then
        echo "FAILED: $f returned $RESULT rows"
        FAILURES=$((FAILURES + 1))
    fi
done

if [ $FAILURES -gt 0 ]; then
    echo "ERROR: $FAILURES test(s) failed"
    exit 1
fi

echo "=== All transformations completed successfully ==="
```

<!-- ENDIF -->

---

## 2. Project Structure

```
{{PROJECT_NAME}}_analytics/
├── dbt_project.yml
├── packages.yml
├── profiles.yml               # Local only, not committed
│
├── models/
│   ├── staging/               # 1:1 with source tables, minimal logic
│   │   ├── {{DATABASE}}/
│   │   │   ├── _{{DATABASE}}__models.yml
│   │   │   ├── _{{DATABASE}}__sources.yml
│   │   │   ├── stg_{{DATABASE}}__users.sql
│   │   │   ├── stg_{{DATABASE}}__organizations.sql
│   │   │   ├── stg_{{DATABASE}}__features.sql
│   │   │   └── stg_{{DATABASE}}__sessions.sql
│   │   │
│   │   ├── {{BILLING_PROVIDER}}/
│   │   │   ├── _{{BILLING_PROVIDER}}__models.yml
│   │   │   ├── _{{BILLING_PROVIDER}}__sources.yml
│   │   │   ├── stg_{{BILLING_PROVIDER}}__subscriptions.sql
│   │   │   ├── stg_{{BILLING_PROVIDER}}__charges.sql
│   │   │   ├── stg_{{BILLING_PROVIDER}}__invoices.sql
│   │   │   ├── stg_{{BILLING_PROVIDER}}__customers.sql
│   │   │   └── stg_{{BILLING_PROVIDER}}__plans.sql
│   │   │
│   │   └── {{ANALYTICS_PROVIDER}}/
│   │       ├── _{{ANALYTICS_PROVIDER}}__models.yml
│   │       ├── _{{ANALYTICS_PROVIDER}}__sources.yml
│   │       ├── stg_{{ANALYTICS_PROVIDER}}__events.sql
│   │       ├── stg_{{ANALYTICS_PROVIDER}}__persons.sql
│   │       └── stg_{{ANALYTICS_PROVIDER}}__sessions.sql
│   │
│   ├── intermediate/          # Business logic joins, no new grain
│   │   ├── int_user_subscription_history.sql
│   │   ├── int_daily_active_users.sql
│   │   ├── int_funnel_stages.sql
│   │   ├── int_trial_conversions.sql
│   │   └── int_mrr_by_subscription.sql
│   │
│   └── marts/                 # Business-facing tables
│       ├── finance/
│       │   ├── _finance__models.yml
│       │   ├── mrr_movements.sql
│       │   ├── unit_economics.sql
│       │   ├── revenue_by_plan.sql
│       │   └── invoice_aging.sql
│       │
│       ├── product/
│       │   ├── _product__models.yml
│       │   ├── daily_active_users.sql
│       │   ├── cohort_retention.sql
│       │   ├── funnel_conversion.sql
│       │   ├── feature_adoption.sql
│       │   └── activation_rate.sql
│       │
│       └── cx/
│           ├── _cx__models.yml
│           ├── customer_health.sql
│           ├── nps_scores.sql
│           └── support_metrics.sql
│
├── seeds/
│   ├── plan_tier_mapping.csv
│   ├── country_mapping.csv
│   └── holiday_calendar.csv
│
├── snapshots/
│   ├── snap_subscriptions.sql
│   └── snap_plan_prices.sql
│
├── macros/
│   ├── generate_schema_name.sql
│   ├── cents_to_dollars.sql
│   ├── date_spine.sql
│   ├── safe_divide.sql
│   └── pii_handling.sql
│
├── tests/
│   ├── generic/
│   │   ├── test_positive_value.sql
│   │   └── test_valid_currency.sql
│   └── singular/
│       ├── assert_mrr_balance.sql
│       └── assert_no_orphan_subscriptions.sql
│
└── analyses/
    ├── ad_hoc_churn_investigation.sql
    └── monthly_board_prep.sql
```

---

## 3. Source Declarations

### _{{DATABASE}}__sources.yml

```yaml
version: 2

sources:
  - name: {{DATABASE}}_raw
    description: "Raw data extracted from {{PROJECT_NAME}} application database ({{DATABASE}})"
    database: "{{WAREHOUSE_DATABASE}}"
    schema: "raw_{{PROJECT_NAME}}"
    loader: "{{BI_ETL_TOOL}}"
    loaded_at_field: "_etl_extracted_at"

    freshness:
      warn_after: {count: {{BI_FRESHNESS_WARN_HOURS}}, period: hour}
      error_after: {count: {{BI_FRESHNESS_ERROR_HOURS}}, period: hour}

    tables:
      - name: raw_app_users
        identifier: "raw_app_users"
        description: "Application users table"
        columns:
          - name: id
            description: "User UUID primary key"
            tests:
              - unique
              - not_null
          - name: email
            description: "User email (PII - handled in staging)"
          - name: created_at
            description: "Account creation timestamp"
            tests:
              - not_null
          - name: updated_at
            description: "Last update timestamp"
          - name: role
            description: "User role in the application"
          - name: organization_id
            description: "FK to organizations"

      - name: raw_app_organizations
        identifier: "raw_app_organizations"
        description: "Customer organizations / accounts"
        columns:
          - name: id
            tests:
              - unique
              - not_null

      - name: raw_app_events
        identifier: "raw_app_events"
        description: "Application event log"
        loaded_at_field: "created_at"
        freshness:
          warn_after: {count: 2, period: hour}
          error_after: {count: 6, period: hour}

  - name: {{BILLING_PROVIDER}}_raw
    description: "Raw billing data from {{BILLING_PROVIDER}}"
    database: "{{WAREHOUSE_DATABASE}}"
    schema: "raw_{{PROJECT_NAME}}"
    loader: "{{BI_ETL_TOOL}}"
    loaded_at_field: "_etl_extracted_at"

    freshness:
      warn_after: {count: 2, period: hour}
      error_after: {count: 4, period: hour}

    tables:
      - name: raw_billing_subscriptions
        description: "Subscription records from {{BILLING_PROVIDER}}"
      - name: raw_billing_charges
        description: "Charge/payment records from {{BILLING_PROVIDER}}"
      - name: raw_billing_invoices
        description: "Invoice records from {{BILLING_PROVIDER}}"
      - name: raw_billing_customers
        description: "Customer records from {{BILLING_PROVIDER}}"
      - name: raw_billing_plans
        description: "Plan/price records from {{BILLING_PROVIDER}}"

  - name: {{ANALYTICS_PROVIDER}}_raw
    description: "Raw product analytics data from {{ANALYTICS_PROVIDER}}"
    database: "{{WAREHOUSE_DATABASE}}"
    schema: "raw_{{PROJECT_NAME}}"
    loader: "{{BI_ETL_TOOL}}"
    loaded_at_field: "_etl_extracted_at"

    freshness:
      warn_after: {count: 4, period: hour}
      error_after: {count: 8, period: hour}

    tables:
      - name: raw_analytics_events
        description: "Product usage events from {{ANALYTICS_PROVIDER}}"
      - name: raw_analytics_persons
        description: "Person/user profiles from {{ANALYTICS_PROVIDER}}"
      - name: raw_analytics_sessions
        description: "Session records from {{ANALYTICS_PROVIDER}}"
```

---

## 4. Staging Models

### stg_{{DATABASE}}__users.sql

```sql
-- models/staging/{{DATABASE}}/stg_{{DATABASE}}__users.sql
-- Staging model: one row per user, deduplicated and cleaned

WITH source AS (
    SELECT * FROM {{ source('{{DATABASE}}_raw', 'raw_app_users') }}
),

deduplicated AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY id
            ORDER BY _etl_extracted_at DESC
        ) AS _row_rank
    FROM source
),

cleaned AS (
    SELECT
        -- Primary key
        id AS user_id,

        -- Attributes
        {% if var('bi_pii_strategy') == 'hash' %}
        {{ dbt_utils.generate_surrogate_key(['email']) }} AS email_hash,
        {% elif var('bi_pii_strategy') == 'mask' %}
        CONCAT(LEFT(email, 2), '***@', SPLIT_PART(email, '@', 2)) AS email_masked,
        {% elif var('bi_pii_strategy') == 'exclude' %}
        NULL AS email_redacted,
        {% else %}
        email,
        {% endif %}

        COALESCE(display_name, 'Unknown') AS display_name,
        role AS user_role,
        organization_id,

        -- Dates
        created_at AS signup_timestamp,
        DATE(created_at) AS signup_date,
        {{ dbt_utils.date_trunc('month', 'created_at') }} AS cohort_month,
        updated_at,

        -- ETL metadata
        _etl_extracted_at,
        _etl_source

    FROM deduplicated
    WHERE _row_rank = 1
      AND _etl_operation != 'delete'  -- Exclude soft-deleted records from CDC
)

SELECT * FROM cleaned
```

### stg_{{BILLING_PROVIDER}}__subscriptions.sql

```sql
-- models/staging/{{BILLING_PROVIDER}}/stg_{{BILLING_PROVIDER}}__subscriptions.sql
-- Staging model: one row per subscription, current state

WITH source AS (
    SELECT * FROM {{ source('{{BILLING_PROVIDER}}_raw', 'raw_billing_subscriptions') }}
),

deduplicated AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY id
            ORDER BY _etl_extracted_at DESC
        ) AS _row_rank
    FROM source
),

cleaned AS (
    SELECT
        -- Primary key
        id AS subscription_id,

        -- Foreign keys
        customer AS customer_id,

        -- Subscription details
        status,
        CASE
            WHEN items_data_0_price_id IS NOT NULL THEN items_data_0_price_id
            WHEN plan_id IS NOT NULL THEN plan_id
            ELSE 'unknown'
        END AS plan_id,

        -- Timestamps ({{BILLING_PROVIDER}} uses Unix timestamps)
        TIMESTAMP 'epoch' + current_period_start * INTERVAL '1 second' AS current_period_start,
        TIMESTAMP 'epoch' + current_period_end * INTERVAL '1 second' AS current_period_end,
        TIMESTAMP 'epoch' + created * INTERVAL '1 second' AS created_at,
        CASE WHEN canceled_at IS NOT NULL
            THEN TIMESTAMP 'epoch' + canceled_at * INTERVAL '1 second'
            ELSE NULL
        END AS canceled_at,
        CASE WHEN trial_start IS NOT NULL
            THEN TIMESTAMP 'epoch' + trial_start * INTERVAL '1 second'
            ELSE NULL
        END AS trial_start,
        CASE WHEN trial_end IS NOT NULL
            THEN TIMESTAMP 'epoch' + trial_end * INTERVAL '1 second'
            ELSE NULL
        END AS trial_end,

        -- Financial
        COALESCE(items_data_0_quantity, 1) AS quantity,
        items_data_0_price_unit_amount AS unit_amount_cents,
        items_data_0_price_unit_amount * COALESCE(items_data_0_quantity, 1) AS total_amount_cents,
        UPPER(COALESCE(currency, '{{DEFAULT_CURRENCY}}')) AS currency,
        items_data_0_price_recurring_interval AS billing_interval,

        -- Cancellation
        cancellation_details_reason AS cancel_reason,
        cancellation_details_feedback AS cancel_feedback,

        -- Discount
        discount_coupon_id AS discount_id,
        discount_coupon_percent_off AS discount_percent,

        -- Metadata
        _etl_extracted_at

    FROM deduplicated
    WHERE _row_rank = 1
)

SELECT * FROM cleaned
```

### stg_{{ANALYTICS_PROVIDER}}__events.sql

```sql
-- models/staging/{{ANALYTICS_PROVIDER}}/stg_{{ANALYTICS_PROVIDER}}__events.sql
-- Staging model: one row per event, cleaned and normalized

WITH source AS (
    SELECT * FROM {{ source('{{ANALYTICS_PROVIDER}}_raw', 'raw_analytics_events') }}
),

deduplicated AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY uuid  -- {{ANALYTICS_PROVIDER}} event UUID
            ORDER BY _etl_extracted_at DESC
        ) AS _row_rank
    FROM source
),

cleaned AS (
    SELECT
        -- Primary key
        uuid AS event_id,

        -- User identification
        distinct_id AS analytics_user_id,

        -- Event details
        event AS event_name,
        timestamp AS event_timestamp,
        DATE(timestamp) AS event_date,

        -- Session
        properties_session_id AS session_id,

        -- Platform and device
        COALESCE(
            properties_platform,
            CASE
                WHEN properties_os = 'iOS' THEN 'ios'
                WHEN properties_os = 'Android' THEN 'android'
                ELSE 'web'
            END
        ) AS platform,
        properties_device_type AS device_type,
        properties_browser AS browser,
        properties_os AS os,

        -- Page / screen
        properties_current_url AS page_url,
        properties_pathname AS page_path,
        properties_referrer AS referrer,

        -- UTM
        properties_utm_source AS utm_source,
        properties_utm_medium AS utm_medium,
        properties_utm_campaign AS utm_campaign,
        properties_utm_term AS utm_term,
        properties_utm_content AS utm_content,

        -- Geography
        properties_geoip_country_code AS country_code,
        properties_geoip_region_name AS region,
        properties_geoip_city_name AS city,

        -- Feature mapping
        properties_feature_id AS feature_id,
        properties_feature_name AS feature_name,

        -- Duration (for timed events)
        properties_duration_ms AS duration_ms,

        -- Raw properties (for ad-hoc analysis)
        properties AS event_properties_raw,

        -- ETL metadata
        _etl_extracted_at

    FROM deduplicated
    WHERE _row_rank = 1
)

SELECT * FROM cleaned
```

---

## 5. Intermediate Models

### int_user_subscription_history.sql

```sql
-- models/intermediate/int_user_subscription_history.sql
-- Joins users with their full subscription history and calculates MRR per subscription

WITH users AS (
    SELECT * FROM {{ ref('stg_' ~ var('database') ~ '__users') }}
),

subscriptions AS (
    SELECT * FROM {{ ref('stg_' ~ var('billing_provider') ~ '__subscriptions') }}
),

billing_customers AS (
    SELECT * FROM {{ ref('stg_' ~ var('billing_provider') ~ '__customers') }}
),

user_subscriptions AS (
    SELECT
        u.user_id,
        u.signup_date,
        u.cohort_month,
        u.user_role,
        u.organization_id,
        s.subscription_id,
        s.plan_id,
        s.status AS subscription_status,
        s.created_at AS subscription_created_at,
        s.canceled_at AS subscription_canceled_at,
        s.current_period_start,
        s.current_period_end,
        s.trial_start,
        s.trial_end,
        s.billing_interval,
        s.total_amount_cents,
        s.cancel_reason,
        s.discount_percent,

        -- Normalize to monthly recurring revenue
        CASE s.billing_interval
            WHEN 'month' THEN s.total_amount_cents
            WHEN 'year' THEN ROUND(s.total_amount_cents / 12.0)
            WHEN 'quarter' THEN ROUND(s.total_amount_cents / 3.0)
            ELSE s.total_amount_cents  -- Default to monthly
        END AS mrr_cents,

        -- Apply discount
        CASE
            WHEN s.discount_percent IS NOT NULL THEN
                ROUND(
                    CASE s.billing_interval
                        WHEN 'month' THEN s.total_amount_cents
                        WHEN 'year' THEN s.total_amount_cents / 12.0
                        WHEN 'quarter' THEN s.total_amount_cents / 3.0
                        ELSE s.total_amount_cents
                    END * (1 - s.discount_percent / 100.0)
                )
            ELSE
                CASE s.billing_interval
                    WHEN 'month' THEN s.total_amount_cents
                    WHEN 'year' THEN ROUND(s.total_amount_cents / 12.0)
                    WHEN 'quarter' THEN ROUND(s.total_amount_cents / 3.0)
                    ELSE s.total_amount_cents
                END
        END AS effective_mrr_cents,

        -- Trial status
        CASE
            WHEN s.trial_end IS NOT NULL AND s.trial_end > CURRENT_TIMESTAMP THEN TRUE
            ELSE FALSE
        END AS is_currently_trialing

    FROM users u
    INNER JOIN billing_customers bc
        ON u.user_id = bc.metadata_user_id  -- Assumes user_id stored in {{BILLING_PROVIDER}} metadata
    INNER JOIN subscriptions s
        ON bc.customer_id = s.customer_id
)

SELECT * FROM user_subscriptions
```

### int_daily_active_users.sql

```sql
-- models/intermediate/int_daily_active_users.sql
-- Calculates daily active users with 7-day and 28-day rolling windows

WITH events AS (
    SELECT * FROM {{ ref('stg_' ~ var('analytics_provider') ~ '__events') }}
),

daily_users AS (
    SELECT
        event_date,
        analytics_user_id,
        COUNT(*) AS event_count,
        COUNT(DISTINCT event_name) AS distinct_events,
        MIN(event_timestamp) AS first_event_at,
        MAX(event_timestamp) AS last_event_at,
        COUNT(DISTINCT session_id) AS session_count,
        MAX(platform) AS primary_platform  -- Most recent platform
    FROM events
    WHERE event_name NOT IN ('$pageview', '$pageleave', '$autocapture')  -- Exclude passive events
      AND analytics_user_id IS NOT NULL
    GROUP BY event_date, analytics_user_id
),

with_rolling_windows AS (
    SELECT
        event_date,
        analytics_user_id,
        event_count,
        distinct_events,
        session_count,
        primary_platform,

        -- Was this user active in the last 7 days? (for WAU calculation)
        CASE WHEN event_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END AS is_wau,

        -- Was this user active in the last 28 days? (for MAU calculation)
        CASE WHEN event_date >= CURRENT_DATE - INTERVAL '28 days' THEN 1 ELSE 0 END AS is_mau

    FROM daily_users
)

SELECT * FROM with_rolling_windows
```

### int_funnel_stages.sql

```sql
-- models/intermediate/int_funnel_stages.sql
-- Maps users to funnel stages based on event progression

WITH users AS (
    SELECT * FROM {{ ref('stg_' ~ var('database') ~ '__users') }}
),

events AS (
    SELECT * FROM {{ ref('stg_' ~ var('analytics_provider') ~ '__events') }}
),

subscriptions AS (
    SELECT * FROM {{ ref('int_user_subscription_history') }}
),

-- Define funnel stages based on {{PROJECT_NAME}} activation events
funnel_events AS (
    SELECT
        analytics_user_id,
        MIN(CASE WHEN event_name = 'signed_up' THEN event_timestamp END) AS signed_up_at,
        MIN(CASE WHEN event_name = '{{ACTIVATION_EVENT_1}}' THEN event_timestamp END) AS activation_step_1_at,
        MIN(CASE WHEN event_name = '{{ACTIVATION_EVENT_2}}' THEN event_timestamp END) AS activation_step_2_at,
        MIN(CASE WHEN event_name = '{{ACTIVATION_EVENT_3}}' THEN event_timestamp END) AS activation_step_3_at,
        MIN(CASE WHEN event_name = 'started_trial' THEN event_timestamp END) AS started_trial_at,
        MIN(CASE WHEN event_name = 'subscribed' THEN event_timestamp END) AS subscribed_at,
        COUNT(DISTINCT event_date) AS active_days,
        COUNT(DISTINCT session_id) AS total_sessions
    FROM events
    GROUP BY analytics_user_id
),

funnel_stages AS (
    SELECT
        u.user_id,
        u.signup_date,
        u.cohort_month,
        fe.signed_up_at,
        fe.activation_step_1_at,
        fe.activation_step_2_at,
        fe.activation_step_3_at,
        fe.started_trial_at,
        fe.subscribed_at,
        fe.active_days,
        fe.total_sessions,

        -- Current funnel stage
        CASE
            WHEN fe.subscribed_at IS NOT NULL THEN 'converted'
            WHEN fe.started_trial_at IS NOT NULL THEN 'trial'
            WHEN fe.activation_step_3_at IS NOT NULL THEN 'activated'
            WHEN fe.activation_step_2_at IS NOT NULL THEN 'engaged'
            WHEN fe.activation_step_1_at IS NOT NULL THEN 'onboarding'
            WHEN fe.signed_up_at IS NOT NULL THEN 'signed_up'
            ELSE 'visitor'
        END AS current_funnel_stage,

        -- Time between stages (for funnel velocity analysis)
        {{ dbt_utils.datediff('fe.signed_up_at', 'fe.activation_step_1_at', 'hour') }} AS hours_to_step_1,
        {{ dbt_utils.datediff('fe.activation_step_1_at', 'fe.activation_step_2_at', 'hour') }} AS hours_step_1_to_2,
        {{ dbt_utils.datediff('fe.activation_step_2_at', 'fe.activation_step_3_at', 'hour') }} AS hours_step_2_to_3,
        {{ dbt_utils.datediff('fe.signed_up_at', 'fe.subscribed_at', 'day') }} AS days_to_conversion,
        {{ dbt_utils.datediff('fe.started_trial_at', 'fe.subscribed_at', 'day') }} AS days_trial_to_paid

    FROM users u
    LEFT JOIN funnel_events fe
        ON u.user_id = fe.analytics_user_id
)

SELECT * FROM funnel_stages
```

---

## 6. Mart Models

### marts/finance/mrr_movements.sql

```sql
-- models/marts/finance/mrr_movements.sql
-- MRR waterfall: decomposes monthly MRR changes into new, expansion, contraction, churn, reactivation
-- Grain: one row per subscription per month

{{
    config(
        materialized='incremental',
        unique_key='mrr_movement_id',
        incremental_strategy='merge',
        on_schema_change='sync_all_columns'
    )
}}

WITH date_spine AS (
    -- Generate one row per month for the analysis window
    {{ dbt_utils.date_spine(
        datepart="month",
        start_date="cast('2024-01-01' as date)",
        end_date="cast(current_date as date)"
    ) }}
),

months AS (
    SELECT
        date_month AS month_start,
        {{ dbt_utils.last_day('date_month', 'month') }} AS month_end
    FROM date_spine
),

subscription_months AS (
    -- For each subscription, determine its MRR in each month it was active
    SELECT
        s.subscription_id,
        s.user_id,
        s.plan_id,
        m.month_start,
        m.month_end,
        s.effective_mrr_cents AS mrr_cents,
        s.subscription_status,
        s.subscription_created_at,
        s.subscription_canceled_at,
        s.is_currently_trialing
    FROM {{ ref('int_user_subscription_history') }} s
    CROSS JOIN months m
    WHERE s.subscription_created_at <= m.month_end
      AND (s.subscription_canceled_at IS NULL OR s.subscription_canceled_at >= m.month_start)
      AND s.subscription_status NOT IN ('incomplete', 'incomplete_expired')
      AND s.is_currently_trialing = FALSE  -- Exclude trial subscriptions from MRR
),

with_previous_month AS (
    SELECT
        *,
        LAG(mrr_cents) OVER (
            PARTITION BY subscription_id
            ORDER BY month_start
        ) AS previous_mrr_cents,
        LAG(month_start) OVER (
            PARTITION BY subscription_id
            ORDER BY month_start
        ) AS previous_month
    FROM subscription_months
),

movements AS (
    SELECT
        {{ dbt_utils.generate_surrogate_key(['subscription_id', 'month_start']) }} AS mrr_movement_id,
        subscription_id,
        user_id,
        plan_id,
        month_start,
        month_end,
        mrr_cents,
        previous_mrr_cents,

        CASE
            -- New: first month of subscription
            WHEN previous_month IS NULL
                THEN 'new'
            -- Reactivation: gap of 1+ months between activity
            WHEN previous_month < month_start - INTERVAL '35 days'
                THEN 'reactivation'
            -- Expansion: MRR increased
            WHEN mrr_cents > COALESCE(previous_mrr_cents, 0)
                THEN 'expansion'
            -- Contraction: MRR decreased but still active
            WHEN mrr_cents < previous_mrr_cents AND mrr_cents > 0
                THEN 'contraction'
            -- No change
            WHEN mrr_cents = previous_mrr_cents
                THEN 'unchanged'
            ELSE 'unchanged'
        END AS movement_type,

        -- Movement amount
        CASE
            WHEN previous_month IS NULL
                THEN mrr_cents  -- New: full MRR
            WHEN previous_month < month_start - INTERVAL '35 days'
                THEN mrr_cents  -- Reactivation: full MRR
            ELSE mrr_cents - COALESCE(previous_mrr_cents, 0)  -- Delta
        END AS mrr_change_cents

    FROM with_previous_month
),

-- Add churn events: subscriptions that were active last month but not this month
churn_events AS (
    SELECT
        {{ dbt_utils.generate_surrogate_key(['sm.subscription_id', 'next_month.month_start']) }} AS mrr_movement_id,
        sm.subscription_id,
        sm.user_id,
        sm.plan_id,
        next_month.month_start,
        next_month.month_end,
        0 AS mrr_cents,
        sm.mrr_cents AS previous_mrr_cents,
        'churn' AS movement_type,
        -1 * sm.mrr_cents AS mrr_change_cents
    FROM subscription_months sm
    -- Find the next month after each subscription month
    INNER JOIN months next_month
        ON next_month.month_start = sm.month_start + INTERVAL '1 month'
    -- This subscription was NOT active in the next month
    LEFT JOIN subscription_months sm_next
        ON sm.subscription_id = sm_next.subscription_id
        AND sm_next.month_start = next_month.month_start
    WHERE sm_next.subscription_id IS NULL
      AND sm.subscription_canceled_at IS NOT NULL
      AND sm.subscription_canceled_at < next_month.month_end
)

SELECT * FROM movements
WHERE movement_type != 'unchanged'

UNION ALL

SELECT * FROM churn_events
```

### marts/product/daily_active_users.sql

```sql
-- models/marts/product/daily_active_users.sql
-- DAU/WAU/MAU metrics with rolling windows
-- Grain: one row per date

{{
    config(
        materialized='incremental',
        unique_key='date_key',
        incremental_strategy='merge'
    )
}}

WITH daily_users AS (
    SELECT * FROM {{ ref('int_daily_active_users') }}
),

date_spine AS (
    {{ dbt_utils.date_spine(
        datepart="day",
        start_date="cast('2024-01-01' as date)",
        end_date="cast(current_date as date)"
    ) }}
),

daily_metrics AS (
    SELECT
        ds.date_day AS metric_date,
        CAST(TO_CHAR(ds.date_day, 'YYYYMMDD') AS INT) AS date_key,

        -- DAU: unique users active on this specific day
        COUNT(DISTINCT CASE WHEN du.event_date = ds.date_day THEN du.analytics_user_id END) AS dau,

        -- WAU: unique users active in the 7 days ending on this day
        COUNT(DISTINCT CASE
            WHEN du.event_date BETWEEN ds.date_day - INTERVAL '6 days' AND ds.date_day
            THEN du.analytics_user_id
        END) AS wau,

        -- MAU: unique users active in the 28 days ending on this day
        COUNT(DISTINCT CASE
            WHEN du.event_date BETWEEN ds.date_day - INTERVAL '27 days' AND ds.date_day
            THEN du.analytics_user_id
        END) AS mau,

        -- Engagement ratio (DAU/MAU, "stickiness")
        {{ safe_divide(
            'COUNT(DISTINCT CASE WHEN du.event_date = ds.date_day THEN du.analytics_user_id END)',
            'NULLIF(COUNT(DISTINCT CASE WHEN du.event_date BETWEEN ds.date_day - INTERVAL \'27 days\' AND ds.date_day THEN du.analytics_user_id END), 0)'
        ) }} AS dau_mau_ratio,

        -- Platform breakdown
        COUNT(DISTINCT CASE WHEN du.event_date = ds.date_day AND du.primary_platform = 'web' THEN du.analytics_user_id END) AS dau_web,
        COUNT(DISTINCT CASE WHEN du.event_date = ds.date_day AND du.primary_platform = 'ios' THEN du.analytics_user_id END) AS dau_ios,
        COUNT(DISTINCT CASE WHEN du.event_date = ds.date_day AND du.primary_platform = 'android' THEN du.analytics_user_id END) AS dau_android,

        -- Session metrics
        AVG(CASE WHEN du.event_date = ds.date_day THEN du.session_count END) AS avg_sessions_per_user,
        AVG(CASE WHEN du.event_date = ds.date_day THEN du.event_count END) AS avg_events_per_user

    FROM date_spine ds
    LEFT JOIN daily_users du
        ON du.event_date BETWEEN ds.date_day - INTERVAL '27 days' AND ds.date_day
    GROUP BY ds.date_day

    {% if is_incremental() %}
    HAVING ds.date_day > (SELECT MAX(metric_date) - INTERVAL '28 days' FROM {{ this }})
    {% endif %}
)

SELECT * FROM daily_metrics
```

### marts/product/cohort_retention.sql

```sql
-- models/marts/product/cohort_retention.sql
-- Cohort-based retention analysis
-- Grain: one row per cohort per period (week or month)

{{
    config(
        materialized='table'
    )
}}

WITH users AS (
    SELECT * FROM {{ ref('stg_' ~ var('database') ~ '__users') }}
),

events AS (
    SELECT * FROM {{ ref('stg_' ~ var('analytics_provider') ~ '__events') }}
    WHERE event_name NOT IN ('$pageview', '$pageleave')
      AND analytics_user_id IS NOT NULL
),

-- Assign users to monthly cohorts
cohorts AS (
    SELECT
        user_id,
        {{ dbt_utils.date_trunc('month', 'signup_date') }} AS cohort_month,
        signup_date
    FROM users
),

-- Calculate activity per user per month
user_monthly_activity AS (
    SELECT
        e.analytics_user_id AS user_id,
        {{ dbt_utils.date_trunc('month', 'e.event_date') }} AS activity_month,
        COUNT(*) AS event_count,
        COUNT(DISTINCT e.event_date) AS active_days
    FROM events e
    GROUP BY e.analytics_user_id, {{ dbt_utils.date_trunc('month', 'e.event_date') }}
),

-- Join cohort assignment with activity
cohort_activity AS (
    SELECT
        c.cohort_month,
        c.user_id,
        a.activity_month,
        {{ dbt_utils.datediff('c.cohort_month', 'a.activity_month', 'month') }} AS months_since_signup,
        a.event_count,
        a.active_days
    FROM cohorts c
    INNER JOIN user_monthly_activity a
        ON c.user_id = a.user_id
    WHERE a.activity_month >= c.cohort_month  -- Only count activity after signup
),

-- Calculate retention rates
retention AS (
    SELECT
        cohort_month,
        months_since_signup,

        -- Cohort size (users who signed up in this month)
        COUNT(DISTINCT CASE WHEN months_since_signup = 0 THEN user_id END)
            OVER (PARTITION BY cohort_month) AS cohort_size,

        -- Users retained at this period
        COUNT(DISTINCT user_id) AS users_retained,

        -- Retention rate
        {{ safe_divide(
            'COUNT(DISTINCT user_id)',
            'COUNT(DISTINCT CASE WHEN months_since_signup = 0 THEN user_id END) OVER (PARTITION BY cohort_month)'
        ) }} AS retention_rate,

        -- Average engagement of retained users
        AVG(active_days) AS avg_active_days,
        AVG(event_count) AS avg_events

    FROM cohort_activity
    GROUP BY cohort_month, months_since_signup
)

SELECT
    cohort_month,
    months_since_signup,
    cohort_size,
    users_retained,
    ROUND(retention_rate, 4) AS retention_rate,
    ROUND(avg_active_days, 1) AS avg_active_days_retained,
    ROUND(avg_events, 1) AS avg_events_retained,

    -- Rolling retention (users active in this period OR any subsequent period)
    -- Useful for distinguishing "dormant" from "churned"
    SUM(users_retained) OVER (
        PARTITION BY cohort_month
        ORDER BY months_since_signup DESC
        ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
    ) AS cumulative_ever_returned

FROM retention
WHERE months_since_signup <= 12  -- Limit to 12-month retention window
ORDER BY cohort_month DESC, months_since_signup ASC
```

### marts/product/funnel_conversion.sql

```sql
-- models/marts/product/funnel_conversion.sql
-- Funnel stage progression and conversion rates
-- Grain: one row per cohort per funnel stage

{{
    config(
        materialized='table'
    )
}}

WITH funnel AS (
    SELECT * FROM {{ ref('int_funnel_stages') }}
),

-- Aggregate by cohort
cohort_funnels AS (
    SELECT
        cohort_month,

        -- Stage counts
        COUNT(DISTINCT user_id) AS total_users,
        COUNT(DISTINCT CASE WHEN current_funnel_stage IN ('signed_up', 'onboarding', 'engaged', 'activated', 'trial', 'converted') THEN user_id END) AS signed_up,
        COUNT(DISTINCT CASE WHEN current_funnel_stage IN ('onboarding', 'engaged', 'activated', 'trial', 'converted') THEN user_id END) AS completed_onboarding,
        COUNT(DISTINCT CASE WHEN current_funnel_stage IN ('engaged', 'activated', 'trial', 'converted') THEN user_id END) AS engaged,
        COUNT(DISTINCT CASE WHEN current_funnel_stage IN ('activated', 'trial', 'converted') THEN user_id END) AS activated,
        COUNT(DISTINCT CASE WHEN current_funnel_stage IN ('trial', 'converted') THEN user_id END) AS started_trial,
        COUNT(DISTINCT CASE WHEN current_funnel_stage = 'converted' THEN user_id END) AS converted,

        -- Conversion rates (stage-to-stage)
        {{ safe_divide(
            'COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'onboarding\', \'engaged\', \'activated\', \'trial\', \'converted\') THEN user_id END)',
            'NULLIF(COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'signed_up\', \'onboarding\', \'engaged\', \'activated\', \'trial\', \'converted\') THEN user_id END), 0)'
        ) }} AS signup_to_onboarding_rate,

        {{ safe_divide(
            'COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'activated\', \'trial\', \'converted\') THEN user_id END)',
            'NULLIF(COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'signed_up\', \'onboarding\', \'engaged\', \'activated\', \'trial\', \'converted\') THEN user_id END), 0)'
        ) }} AS signup_to_activation_rate,

        {{ safe_divide(
            'COUNT(DISTINCT CASE WHEN current_funnel_stage = \'converted\' THEN user_id END)',
            'NULLIF(COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'trial\', \'converted\') THEN user_id END), 0)'
        ) }} AS trial_to_paid_rate,

        {{ safe_divide(
            'COUNT(DISTINCT CASE WHEN current_funnel_stage = \'converted\' THEN user_id END)',
            'NULLIF(COUNT(DISTINCT CASE WHEN current_funnel_stage IN (\'signed_up\', \'onboarding\', \'engaged\', \'activated\', \'trial\', \'converted\') THEN user_id END), 0)'
        ) }} AS overall_conversion_rate,

        -- Velocity (median time between stages)
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY hours_to_step_1) AS median_hours_to_step_1,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_conversion) AS median_days_to_conversion,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_trial_to_paid) AS median_days_trial_to_paid

    FROM funnel
    GROUP BY cohort_month
)

SELECT * FROM cohort_funnels
ORDER BY cohort_month DESC
```

### marts/finance/unit_economics.sql

```sql
-- models/marts/finance/unit_economics.sql
-- CAC, LTV, payback period, and unit economics
-- Grain: one row per month

{{
    config(
        materialized='table'
    )
}}

WITH monthly_mrr AS (
    SELECT
        month_start,
        SUM(CASE WHEN movement_type = 'new' THEN mrr_change_cents ELSE 0 END) AS new_mrr_cents,
        SUM(CASE WHEN movement_type = 'expansion' THEN mrr_change_cents ELSE 0 END) AS expansion_mrr_cents,
        SUM(CASE WHEN movement_type = 'contraction' THEN mrr_change_cents ELSE 0 END) AS contraction_mrr_cents,
        SUM(CASE WHEN movement_type = 'churn' THEN mrr_change_cents ELSE 0 END) AS churn_mrr_cents,
        SUM(CASE WHEN movement_type = 'reactivation' THEN mrr_change_cents ELSE 0 END) AS reactivation_mrr_cents,
        SUM(mrr_change_cents) AS net_mrr_change_cents,
        COUNT(DISTINCT CASE WHEN movement_type = 'new' THEN user_id END) AS new_customers,
        COUNT(DISTINCT CASE WHEN movement_type = 'churn' THEN user_id END) AS churned_customers,
        COUNT(DISTINCT user_id) AS total_active_customers
    FROM {{ ref('mrr_movements') }}
    GROUP BY month_start
),

cumulative_mrr AS (
    SELECT
        month_start,
        *,
        SUM(net_mrr_change_cents) OVER (ORDER BY month_start) AS ending_mrr_cents
    FROM monthly_mrr
),

-- Marketing spend (seed or source data)
marketing_spend AS (
    SELECT
        month_start,
        total_spend_cents,
        paid_spend_cents,
        organic_signups,
        paid_signups
    FROM {{ ref('seed_marketing_spend') }}  -- Or source from marketing platform
),

unit_economics AS (
    SELECT
        m.month_start,

        -- MRR metrics
        m.ending_mrr_cents,
        m.ending_mrr_cents / 100.0 AS ending_mrr_dollars,
        m.ending_mrr_cents * 12 / 100.0 AS ending_arr_dollars,
        m.new_mrr_cents / 100.0 AS new_mrr_dollars,
        m.expansion_mrr_cents / 100.0 AS expansion_mrr_dollars,
        m.contraction_mrr_cents / 100.0 AS contraction_mrr_dollars,
        m.churn_mrr_cents / 100.0 AS churn_mrr_dollars,

        -- Customer counts
        m.new_customers,
        m.churned_customers,
        m.total_active_customers,

        -- Churn rates
        {{ safe_divide('m.churned_customers', 'LAG(m.total_active_customers) OVER (ORDER BY m.month_start)') }} AS customer_churn_rate,
        {{ safe_divide('ABS(m.churn_mrr_cents)', 'LAG(m.ending_mrr_cents) OVER (ORDER BY m.month_start)') }} AS revenue_churn_rate,

        -- Net Revenue Retention (NRR)
        {{ safe_divide(
            'LAG(m.ending_mrr_cents) OVER (ORDER BY m.month_start) + m.expansion_mrr_cents + m.contraction_mrr_cents + m.churn_mrr_cents',
            'LAG(m.ending_mrr_cents) OVER (ORDER BY m.month_start)'
        ) }} AS net_revenue_retention,

        -- ARPU (Average Revenue Per User)
        {{ safe_divide('m.ending_mrr_cents', 'm.total_active_customers') }} / 100.0 AS arpu_dollars,

        -- CAC (Customer Acquisition Cost)
        {{ safe_divide('ms.total_spend_cents', 'm.new_customers') }} / 100.0 AS blended_cac_dollars,
        {{ safe_divide('ms.paid_spend_cents', 'ms.paid_signups') }} / 100.0 AS paid_cac_dollars,

        -- LTV (simplified: ARPU / monthly churn rate)
        -- More accurate LTV requires cohort-level analysis
        CASE
            WHEN {{ safe_divide('m.churned_customers', 'LAG(m.total_active_customers) OVER (ORDER BY m.month_start)') }} > 0
            THEN ({{ safe_divide('m.ending_mrr_cents', 'm.total_active_customers') }} / 100.0) /
                 {{ safe_divide('m.churned_customers', 'LAG(m.total_active_customers) OVER (ORDER BY m.month_start)') }}
            ELSE NULL
        END AS estimated_ltv_dollars,

        -- LTV:CAC Ratio
        -- Target: > 3:1
        CASE
            WHEN ms.total_spend_cents > 0 AND m.new_customers > 0
                AND {{ safe_divide('m.churned_customers', 'LAG(m.total_active_customers) OVER (ORDER BY m.month_start)') }} > 0
            THEN (
                ({{ safe_divide('m.ending_mrr_cents', 'm.total_active_customers') }} / 100.0) /
                {{ safe_divide('m.churned_customers', 'LAG(m.total_active_customers) OVER (ORDER BY m.month_start)') }}
            ) / ({{ safe_divide('ms.total_spend_cents', 'm.new_customers') }} / 100.0)
            ELSE NULL
        END AS ltv_cac_ratio,

        -- CAC Payback Period (months)
        -- How many months until a new customer's revenue covers their acquisition cost
        CASE
            WHEN {{ safe_divide('m.ending_mrr_cents', 'm.total_active_customers') }} > 0
                AND ms.total_spend_cents > 0 AND m.new_customers > 0
            THEN ({{ safe_divide('ms.total_spend_cents', 'm.new_customers') }}) /
                 ({{ safe_divide('m.ending_mrr_cents', 'm.total_active_customers') }})
            ELSE NULL
        END AS cac_payback_months,

        -- Gross margin (if COGS data is available)
        -- {{GROSS_MARGIN_CALCULATION}}

        -- Quick Ratio (new + expansion + reactivation) / (contraction + churn)
        {{ safe_divide(
            'm.new_mrr_cents + m.expansion_mrr_cents + m.reactivation_mrr_cents',
            'NULLIF(ABS(m.contraction_mrr_cents) + ABS(m.churn_mrr_cents), 0)'
        ) }} AS quick_ratio

    FROM cumulative_mrr m
    LEFT JOIN marketing_spend ms
        ON m.month_start = ms.month_start
)

SELECT * FROM unit_economics
ORDER BY month_start DESC
```

### marts/cx/customer_health.sql

```sql
-- models/marts/cx/customer_health.sql
-- Customer health score aggregation
-- Grain: one row per user (current snapshot)

{{
    config(
        materialized='table'
    )
}}

WITH users AS (
    SELECT * FROM {{ ref('stg_' ~ var('database') ~ '__users') }}
),

-- Product engagement (last 30 days)
engagement AS (
    SELECT
        analytics_user_id AS user_id,
        COUNT(DISTINCT event_date) AS active_days_30d,
        COUNT(*) AS total_events_30d,
        COUNT(DISTINCT session_id) AS sessions_30d,
        COUNT(DISTINCT feature_id) AS features_used_30d,
        MAX(event_date) AS last_active_date,
        {{ dbt_utils.datediff('MAX(event_date)', 'CURRENT_DATE', 'day') }} AS days_since_last_active
    FROM {{ ref('stg_' ~ var('analytics_provider') ~ '__events') }}
    WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
      AND analytics_user_id IS NOT NULL
    GROUP BY analytics_user_id
),

-- Subscription health
subscription_health AS (
    SELECT
        user_id,
        subscription_status,
        effective_mrr_cents,
        plan_id,
        billing_interval,
        subscription_created_at,
        {{ dbt_utils.datediff('subscription_created_at', 'CURRENT_DATE', 'month') }} AS months_as_customer,
        is_currently_trialing
    FROM {{ ref('int_user_subscription_history') }}
    WHERE subscription_status IN ('active', 'trialing', 'past_due')
),

-- Support interactions (last 90 days)
support_health AS (
    SELECT
        user_id,
        COUNT(*) AS tickets_90d,
        COUNT(DISTINCT CASE WHEN priority = 'high' OR priority = 'urgent' THEN ticket_id END) AS critical_tickets_90d,
        AVG(satisfaction_score) AS avg_csat_90d,
        MAX(created_at) AS last_ticket_date
    FROM {{ ref('stg_support_tickets') }}
    WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY user_id
),

-- NPS (most recent score)
nps AS (
    SELECT
        user_id,
        score AS nps_score,
        CASE
            WHEN score >= 9 THEN 'promoter'
            WHEN score >= 7 THEN 'passive'
            ELSE 'detractor'
        END AS nps_category,
        submitted_at AS nps_date
    FROM {{ ref('stg_nps_responses') }}
    QUALIFY ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY submitted_at DESC) = 1
),

-- Compute health score components
health_components AS (
    SELECT
        u.user_id,
        u.signup_date,
        u.cohort_month,

        -- Engagement score (0-100)
        LEAST(100, GREATEST(0,
            CASE
                WHEN e.days_since_last_active IS NULL THEN 0
                WHEN e.days_since_last_active <= 1 THEN 100
                WHEN e.days_since_last_active <= 3 THEN 85
                WHEN e.days_since_last_active <= 7 THEN 70
                WHEN e.days_since_last_active <= 14 THEN 50
                WHEN e.days_since_last_active <= 30 THEN 25
                ELSE 0
            END
        )) AS engagement_score,

        -- Feature breadth score (0-100)
        LEAST(100, GREATEST(0,
            COALESCE(e.features_used_30d, 0) * {{HEALTH_SCORE_FEATURE_MULTIPLIER}}
        )) AS feature_breadth_score,

        -- Subscription tenure score (0-100)
        LEAST(100, GREATEST(0,
            CASE
                WHEN sh.months_as_customer >= 24 THEN 100
                WHEN sh.months_as_customer >= 12 THEN 85
                WHEN sh.months_as_customer >= 6 THEN 70
                WHEN sh.months_as_customer >= 3 THEN 50
                ELSE 30
            END
        )) AS tenure_score,

        -- Support score (0-100, inverse — fewer tickets is better)
        LEAST(100, GREATEST(0,
            CASE
                WHEN COALESCE(sup.critical_tickets_90d, 0) > 3 THEN 10
                WHEN COALESCE(sup.critical_tickets_90d, 0) > 1 THEN 30
                WHEN COALESCE(sup.tickets_90d, 0) > 10 THEN 40
                WHEN COALESCE(sup.tickets_90d, 0) > 5 THEN 60
                WHEN COALESCE(sup.tickets_90d, 0) > 0 THEN 80
                ELSE 90  -- No tickets is good (assuming active user)
            END
        )) AS support_score,

        -- NPS score component (0-100)
        CASE
            WHEN n.nps_category = 'promoter' THEN 100
            WHEN n.nps_category = 'passive' THEN 60
            WHEN n.nps_category = 'detractor' THEN 20
            ELSE 50  -- No response, neutral
        END AS nps_score_component,

        -- Raw data for drill-down
        e.active_days_30d,
        e.total_events_30d,
        e.sessions_30d,
        e.features_used_30d,
        e.days_since_last_active,
        sh.effective_mrr_cents,
        sh.subscription_status,
        sh.months_as_customer,
        sup.tickets_90d,
        sup.critical_tickets_90d,
        sup.avg_csat_90d,
        n.nps_score,
        n.nps_category

    FROM users u
    LEFT JOIN engagement e ON u.user_id = e.user_id
    LEFT JOIN subscription_health sh ON u.user_id = sh.user_id
    LEFT JOIN support_health sup ON u.user_id = sup.user_id
    LEFT JOIN nps n ON u.user_id = n.user_id
),

-- Weighted composite health score
final AS (
    SELECT
        *,

        -- Weighted health score
        -- Weights: engagement {{HEALTH_WEIGHT_ENGAGEMENT}}%, feature breadth {{HEALTH_WEIGHT_FEATURES}}%,
        --          tenure {{HEALTH_WEIGHT_TENURE}}%, support {{HEALTH_WEIGHT_SUPPORT}}%, NPS {{HEALTH_WEIGHT_NPS}}%
        ROUND(
            engagement_score * {{HEALTH_WEIGHT_ENGAGEMENT}} / 100.0 +
            feature_breadth_score * {{HEALTH_WEIGHT_FEATURES}} / 100.0 +
            tenure_score * {{HEALTH_WEIGHT_TENURE}} / 100.0 +
            support_score * {{HEALTH_WEIGHT_SUPPORT}} / 100.0 +
            nps_score_component * {{HEALTH_WEIGHT_NPS}} / 100.0
        , 1) AS health_score,

        -- Health category
        CASE
            WHEN (
                engagement_score * {{HEALTH_WEIGHT_ENGAGEMENT}} / 100.0 +
                feature_breadth_score * {{HEALTH_WEIGHT_FEATURES}} / 100.0 +
                tenure_score * {{HEALTH_WEIGHT_TENURE}} / 100.0 +
                support_score * {{HEALTH_WEIGHT_SUPPORT}} / 100.0 +
                nps_score_component * {{HEALTH_WEIGHT_NPS}} / 100.0
            ) >= 75 THEN 'healthy'
            WHEN (
                engagement_score * {{HEALTH_WEIGHT_ENGAGEMENT}} / 100.0 +
                feature_breadth_score * {{HEALTH_WEIGHT_FEATURES}} / 100.0 +
                tenure_score * {{HEALTH_WEIGHT_TENURE}} / 100.0 +
                support_score * {{HEALTH_WEIGHT_SUPPORT}} / 100.0 +
                nps_score_component * {{HEALTH_WEIGHT_NPS}} / 100.0
            ) >= 50 THEN 'neutral'
            WHEN (
                engagement_score * {{HEALTH_WEIGHT_ENGAGEMENT}} / 100.0 +
                feature_breadth_score * {{HEALTH_WEIGHT_FEATURES}} / 100.0 +
                tenure_score * {{HEALTH_WEIGHT_TENURE}} / 100.0 +
                support_score * {{HEALTH_WEIGHT_SUPPORT}} / 100.0 +
                nps_score_component * {{HEALTH_WEIGHT_NPS}} / 100.0
            ) >= 25 THEN 'at_risk'
            ELSE 'critical'
        END AS health_category,

        CURRENT_TIMESTAMP AS calculated_at

    FROM health_components
)

SELECT * FROM final
```

---

## 7. Reusable Macros

### macros/safe_divide.sql

```sql
{% macro safe_divide(numerator, denominator) %}
    CASE
        WHEN {{ denominator }} IS NULL OR {{ denominator }} = 0 THEN NULL
        ELSE CAST({{ numerator }} AS DOUBLE PRECISION) / CAST({{ denominator }} AS DOUBLE PRECISION)
    END
{% endmacro %}
```

### macros/cents_to_dollars.sql

```sql
{% macro cents_to_dollars(column_name, precision=2) %}
    ROUND(CAST({{ column_name }} AS DOUBLE PRECISION) / 100.0, {{ precision }})
{% endmacro %}
```

### macros/pii_handling.sql

```sql
{% macro hash_pii(column_name) %}
    {# SHA-256 hash for PII columns — one-way, non-reversible #}
    {% if target.type == 'snowflake' %}
        SHA2(LOWER(TRIM({{ column_name }})), 256)
    {% elif target.type == 'bigquery' %}
        TO_HEX(SHA256(LOWER(TRIM({{ column_name }}))))
    {% elif target.type == 'postgres' or target.type == 'redshift' %}
        ENCODE(SHA256(LOWER(TRIM({{ column_name }}))::bytea), 'hex')
    {% else %}
        SHA2(LOWER(TRIM({{ column_name }})))
    {% endif %}
{% endmacro %}

{% macro mask_email(column_name) %}
    {# Masks email: jo***@example.com #}
    CONCAT(
        LEFT({{ column_name }}, 2),
        '***@',
        SPLIT_PART({{ column_name }}, '@', 2)
    )
{% endmacro %}
```

### macros/generate_schema_name.sql

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {# Override default schema generation to use exact schema names in production #}
    {%- if target.name == 'prod' and custom_schema_name is not none -%}
        {{ custom_schema_name | trim }}
    {%- elif custom_schema_name is not none -%}
        {{ target.schema }}_{{ custom_schema_name | trim }}
    {%- else -%}
        {{ target.schema }}
    {%- endif -%}
{%- endmacro %}
```

---

## 8. Testing

### Schema Tests (in _models.yml files)

```yaml
# models/marts/finance/_finance__models.yml
version: 2

models:
  - name: mrr_movements
    description: "MRR waterfall decomposing revenue changes into new, expansion, contraction, churn, reactivation"
    columns:
      - name: mrr_movement_id
        description: "Surrogate key (subscription_id + month_start)"
        tests:
          - unique
          - not_null

      - name: movement_type
        description: "Type of MRR movement"
        tests:
          - not_null
          - accepted_values:
              values: ['new', 'expansion', 'contraction', 'churn', 'reactivation']

      - name: mrr_cents
        description: "MRR in cents at this point"
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 100000000  # $1M max MRR per subscription (sanity check)

      - name: subscription_id
        description: "FK to subscription"
        tests:
          - not_null
          - relationships:
              to: ref('stg_{{BILLING_PROVIDER}}__subscriptions')
              field: subscription_id

  - name: unit_economics
    description: "Monthly unit economics: CAC, LTV, payback, NRR"
    columns:
      - name: month_start
        tests:
          - unique
          - not_null

      - name: net_revenue_retention
        description: "NRR should typically be between 0.5 and 2.0"
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0.3
              max_value: 3.0
              row_condition: "total_active_customers > 10"  # Only test when sample is meaningful

      - name: customer_churn_rate
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 1.0

  - name: daily_active_users
    description: "Daily DAU/WAU/MAU metrics"
    columns:
      - name: date_key
        tests:
          - unique
          - not_null

      - name: dau
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0

      - name: dau_mau_ratio
        description: "DAU/MAU stickiness ratio, should be between 0 and 1"
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 1.0

  - name: cohort_retention
    description: "Monthly cohort retention matrix"
    columns:
      - name: retention_rate
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 1.0

      - name: months_since_signup
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 12

  - name: customer_health
    description: "Customer health scores"
    columns:
      - name: user_id
        tests:
          - unique
          - not_null

      - name: health_score
        tests:
          - not_null
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 100

      - name: health_category
        tests:
          - accepted_values:
              values: ['healthy', 'neutral', 'at_risk', 'critical']
```

### Singular Tests

```sql
-- tests/singular/assert_mrr_balance.sql
-- Validates that the sum of all MRR movements equals the current ending MRR
-- Returns rows if the assertion fails (0 rows = pass)

WITH movement_total AS (
    SELECT SUM(mrr_change_cents) AS total_from_movements
    FROM {{ ref('mrr_movements') }}
),

current_mrr AS (
    SELECT SUM(effective_mrr_cents) AS total_from_subscriptions
    FROM {{ ref('int_user_subscription_history') }}
    WHERE subscription_status = 'active'
      AND is_currently_trialing = FALSE
)

SELECT
    m.total_from_movements,
    c.total_from_subscriptions,
    ABS(m.total_from_movements - c.total_from_subscriptions) AS discrepancy_cents
FROM movement_total m
CROSS JOIN current_mrr c
WHERE ABS(m.total_from_movements - c.total_from_subscriptions) > 100  -- Allow $1 rounding tolerance
```

```sql
-- tests/singular/assert_no_orphan_subscriptions.sql
-- Every subscription should have a corresponding user
-- Returns rows if the assertion fails

SELECT
    s.subscription_id,
    s.customer_id
FROM {{ ref('stg_{{BILLING_PROVIDER}}__subscriptions') }} s
LEFT JOIN {{ ref('stg_{{DATABASE}}__users') }} u
    ON s.customer_id = u.billing_customer_id
WHERE u.user_id IS NULL
  AND s.status NOT IN ('incomplete', 'incomplete_expired')
```

### Freshness Tests

```yaml
# In sources.yml, freshness is configured per source table
# Run with: dbt source freshness
```

```bash
# Run all tests
dbt test --target prod

# Run tests for specific models
dbt test --select mrr_movements unit_economics

# Run only schema tests
dbt test --select test_type:schema

# Run only singular tests
dbt test --select test_type:singular

# Run source freshness checks
dbt source freshness --target prod
```

---

## 9. Documentation

### Schema Documentation

```yaml
# models/marts/finance/_finance__models.yml (expanded with documentation)
version: 2

models:
  - name: mrr_movements
    description: |
      ## MRR Waterfall

      Decomposes monthly MRR changes into five movement types:
      - **New**: First month of a new subscription
      - **Expansion**: MRR increased (upgrade, add seats)
      - **Contraction**: MRR decreased but subscription still active (downgrade)
      - **Churn**: Subscription canceled, MRR went to zero
      - **Reactivation**: Subscription resumed after a gap

      ### Grain
      One row per subscription per month where a movement occurred.
      Months with no change (`unchanged`) are excluded.

      ### Business Rules
      - Trial subscriptions are excluded (MRR = 0 during trial)
      - Annual subscriptions are normalized to monthly (ARR / 12)
      - Discounts are applied to MRR calculation
      - Churn grace period: {{CHURN_GRACE_PERIOD_DAYS}} days past due before counting as churned

      ### Dependencies
      - `int_user_subscription_history` (subscription + user join)
      - `stg_{{BILLING_PROVIDER}}__subscriptions` (raw subscription data)

      ### Owner
      {{BI_METRIC_OWNER_DEFAULT}} — Finance team

      ### Dashboard
      Used in: Board Deck MRR Waterfall, Finance Dashboard, Unit Economics Dashboard
```

### Generating Documentation

```bash
# Generate dbt docs
dbt docs generate --target prod

# Serve locally for review
dbt docs serve --port 8080

# In production: upload to S3/GCS and serve via static hosting
# or use dbt Cloud's hosted documentation
```

---

## 10. CI/CD

### PR-Based dbt Runs (Slim CI)

```yaml
# .github/workflows/dbt-ci.yml
name: dbt CI

on:
  pull_request:
    paths:
      - 'models/**'
      - 'macros/**'
      - 'tests/**'
      - 'snapshots/**'
      - 'dbt_project.yml'
      - 'packages.yml'

jobs:
  dbt-ci:
    runs-on: ubuntu-latest
    env:
      DBT_PROFILES_DIR: ./profiles
      DBT_PASSWORD: ${{ secrets.DBT_CI_PASSWORD }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dbt
        run: pip install dbt-{{BI_WAREHOUSE}}=={{DBT_ADAPTER_VERSION}}

      - name: Install packages
        run: dbt deps

      - name: Download production manifest (for state comparison)
        run: |
          # Download the latest production manifest.json
          # This enables slim CI — only run models that changed
          aws s3 cp s3://{{DBT_ARTIFACTS_BUCKET}}/prod/manifest.json ./target/manifest.json || true

      - name: dbt build (changed models only)
        run: |
          dbt build \
            --select state:modified+ \
            --defer \
            --state ./target \
            --target ci \
            --fail-fast

      - name: dbt source freshness
        run: dbt source freshness --target ci
        continue-on-error: true  # Don't fail CI on freshness (CI env may have stale data)

      - name: Upload CI artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: dbt-ci-artifacts
          path: target/
```

### Production Deployment

```yaml
# .github/workflows/dbt-deploy.yml
name: dbt Production Deploy

on:
  push:
    branches: [main]
    paths:
      - 'models/**'
      - 'macros/**'
      - 'tests/**'
      - 'snapshots/**'
      - 'dbt_project.yml'
      - 'packages.yml'

jobs:
  dbt-deploy:
    runs-on: ubuntu-latest
    environment: production
    env:
      DBT_PROFILES_DIR: ./profiles
      DBT_PASSWORD: ${{ secrets.DBT_PROD_PASSWORD }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dbt
        run: pip install dbt-{{BI_WAREHOUSE}}=={{DBT_ADAPTER_VERSION}}

      - name: Install packages
        run: dbt deps

      - name: dbt run (production)
        run: dbt run --target prod --full-refresh-threshold 0

      - name: dbt test (production)
        run: dbt test --target prod

      - name: dbt source freshness
        run: dbt source freshness --target prod

      - name: Upload production manifest
        run: |
          aws s3 cp target/manifest.json s3://{{DBT_ARTIFACTS_BUCKET}}/prod/manifest.json

      - name: Generate docs
        run: |
          dbt docs generate --target prod
          aws s3 sync target/ s3://{{DBT_DOCS_BUCKET}}/ --exclude "*.json" --include "catalog.json" --include "manifest.json" --include "index.html" --include "graph.gpickle"

      - name: Notify success
        if: success()
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
            -H 'Content-type: application/json' \
            -d '{"text":"dbt production deploy succeeded for {{PROJECT_NAME}}."}'

      - name: Notify failure
        if: failure()
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
            -H 'Content-type: application/json' \
            -d '{"text":"dbt production deploy FAILED for {{PROJECT_NAME}}. Check GitHub Actions."}'
```

---

## Checklist

- [ ] Transform tool configured: {{BI_TRANSFORM_TOOL}}
- [ ] Project structure created with staging / intermediate / marts layers
- [ ] Sources declared with freshness SLAs
- [ ] Staging models created for: {{DATABASE}}, {{BILLING_PROVIDER}}, {{ANALYTICS_PROVIDER}}
- [ ] PII handling implemented per {{BI_PII_STRATEGY}} in staging models
- [ ] Intermediate models built: user_subscription_history, daily_active_users, funnel_stages
- [ ] Mart models built: mrr_movements, daily_active_users, cohort_retention, funnel_conversion, unit_economics, customer_health
- [ ] Reusable macros created: safe_divide, cents_to_dollars, pii_handling
- [ ] Schema tests added for all mart models (unique, not_null, accepted_values, ranges)
- [ ] Singular tests added: MRR balance assertion, orphan subscription check
- [ ] Freshness tests configured for all source tables
- [ ] Schema documentation written for all mart models
- [ ] dbt docs generated and accessible
- [ ] CI pipeline configured for PR-based slim builds
- [ ] Production deployment pipeline configured with artifact upload
- [ ] All tests passing in production target
