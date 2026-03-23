# Data Warehouse Architecture: {{PROJECT_NAME}}

## Overview

**Project:** {{PROJECT_NAME}}
**Warehouse Platform:** {{BI_WAREHOUSE}}
**Application Database:** {{DATABASE}}
**Data Retention:** {{BI_DATA_RETENTION_MONTHS}} months
**Estimated Data Volume:** {{BI_DATA_VOLUME_TIER}}
**Refresh Cadence:** {{BI_REFRESH_CADENCE}}
**PII Strategy:** {{BI_PII_STRATEGY}}

---

## 1. Warehouse Platform Selection

### Decision Summary

| Criterion | Weight | {{BI_WAREHOUSE}} Score | Notes |
|-----------|--------|----------------------|-------|
| Cost at current volume | 30% | {{BI_WAREHOUSE_COST_SCORE}} | {{BI_WAREHOUSE_COST_NOTES}} |
| Query performance (OLAP) | 25% | {{BI_WAREHOUSE_PERF_SCORE}} | {{BI_WAREHOUSE_PERF_NOTES}} |
| Ecosystem / tool compatibility | 20% | {{BI_WAREHOUSE_COMPAT_SCORE}} | {{BI_WAREHOUSE_COMPAT_NOTES}} |
| Operational complexity | 15% | {{BI_WAREHOUSE_OPS_SCORE}} | {{BI_WAREHOUSE_OPS_NOTES}} |
| Team familiarity | 10% | {{BI_WAREHOUSE_TEAM_SCORE}} | {{BI_WAREHOUSE_TEAM_NOTES}} |

---

<!-- IF {{BI_WAREHOUSE}} == "snowflake" -->

### Snowflake Configuration

**Account:** {{SNOWFLAKE_ACCOUNT}}.snowflakecomputing.com
**Region:** {{SNOWFLAKE_REGION}}
**Edition:** {{SNOWFLAKE_EDITION}} (Standard | Enterprise | Business Critical)

#### Virtual Warehouses

| Warehouse Name | Size | Auto-Suspend | Auto-Resume | Max Clusters | Purpose |
|----------------|------|-------------|-------------|--------------|---------|
| `{{PROJECT_NAME}}_loading` | X-Small | 60s | Yes | 1 | ETL ingestion |
| `{{PROJECT_NAME}}_transforming` | Small | 120s | Yes | 1 | dbt transformations |
| `{{PROJECT_NAME}}_reporting` | Small | 300s | Yes | 3 | Dashboard queries |
| `{{PROJECT_NAME}}_adhoc` | Medium | 60s | Yes | 1 | Analyst ad-hoc queries |

```sql
-- Warehouse creation
CREATE WAREHOUSE {{PROJECT_NAME}}_loading
  WAREHOUSE_SIZE = 'X-SMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  MAX_CLUSTER_COUNT = 1
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'ETL ingestion for {{PROJECT_NAME}}';

CREATE WAREHOUSE {{PROJECT_NAME}}_transforming
  WAREHOUSE_SIZE = 'SMALL'
  AUTO_SUSPEND = 120
  AUTO_RESUME = TRUE
  MAX_CLUSTER_COUNT = 1
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'dbt transformations for {{PROJECT_NAME}}';

CREATE WAREHOUSE {{PROJECT_NAME}}_reporting
  WAREHOUSE_SIZE = 'SMALL'
  AUTO_SUSPEND = 300
  AUTO_RESUME = TRUE
  MAX_CLUSTER_COUNT = 3
  MIN_CLUSTER_COUNT = 1
  SCALING_POLICY = 'STANDARD'
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Dashboard and BI queries for {{PROJECT_NAME}}';
```

#### Resource Monitors

```sql
CREATE RESOURCE MONITOR {{PROJECT_NAME}}_monthly_monitor
  WITH CREDIT_QUOTA = {{SNOWFLAKE_MONTHLY_CREDIT_LIMIT}}
  FREQUENCY = MONTHLY
  START_TIMESTAMP = IMMEDIATELY
  TRIGGERS
    ON 75 PERCENT DO NOTIFY
    ON 90 PERCENT DO NOTIFY
    ON 100 PERCENT DO SUSPEND;

ALTER WAREHOUSE {{PROJECT_NAME}}_loading SET RESOURCE_MONITOR = {{PROJECT_NAME}}_monthly_monitor;
ALTER WAREHOUSE {{PROJECT_NAME}}_transforming SET RESOURCE_MONITOR = {{PROJECT_NAME}}_monthly_monitor;
ALTER WAREHOUSE {{PROJECT_NAME}}_reporting SET RESOURCE_MONITOR = {{PROJECT_NAME}}_monthly_monitor;
```

#### Time Travel and Fail-Safe

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| DATA_RETENTION_TIME_IN_DAYS | 7 (staging), 30 (analytics) | Balance cost vs recovery window |
| MIN_DATA_RETENTION_TIME_IN_DAYS | 1 | For transient/temporary tables |

<!-- ENDIF -->

---

<!-- IF {{BI_WAREHOUSE}} == "bigquery" -->

### BigQuery Configuration

**Project ID:** {{GCP_PROJECT_ID}}
**Default Dataset Location:** {{BIGQUERY_LOCATION}} (US, EU, asia-northeast1, etc.)
**Pricing Model:** {{BIGQUERY_PRICING}} (on-demand | flat-rate | editions)

#### Dataset Setup

```sql
-- Create datasets with appropriate defaults
CREATE SCHEMA `{{GCP_PROJECT_ID}}.raw_{{PROJECT_NAME}}`
  OPTIONS (
    default_table_expiration_days = NULL,
    description = 'Raw ingested data from {{DATABASE}} and third-party sources',
    location = '{{BIGQUERY_LOCATION}}'
  );

CREATE SCHEMA `{{GCP_PROJECT_ID}}.staging_{{PROJECT_NAME}}`
  OPTIONS (
    description = 'Cleaned and deduplicated staging models',
    location = '{{BIGQUERY_LOCATION}}'
  );

CREATE SCHEMA `{{GCP_PROJECT_ID}}.analytics_{{PROJECT_NAME}}`
  OPTIONS (
    description = 'Transformed analytics-ready tables',
    location = '{{BIGQUERY_LOCATION}}'
  );

CREATE SCHEMA `{{GCP_PROJECT_ID}}.reporting_{{PROJECT_NAME}}`
  OPTIONS (
    description = 'Dashboard-facing views and materialized tables',
    location = '{{BIGQUERY_LOCATION}}'
  );
```

#### Slot Reservations (Flat-Rate / Editions)

| Reservation | Slots | Edition | Assignment | Purpose |
|-------------|-------|---------|------------|---------|
| `{{PROJECT_NAME}}_etl` | {{BIGQUERY_ETL_SLOTS}} | {{BIGQUERY_EDITION}} | `raw_*`, `staging_*` | Pipeline ingestion |
| `{{PROJECT_NAME}}_transform` | {{BIGQUERY_TRANSFORM_SLOTS}} | {{BIGQUERY_EDITION}} | `analytics_*` | dbt / Dataform runs |
| `{{PROJECT_NAME}}_bi` | {{BIGQUERY_BI_SLOTS}} | {{BIGQUERY_EDITION}} | `reporting_*` | Dashboard queries |

#### Cost Controls

```sql
-- Set custom cost controls per project
-- Maximum bytes billed per query (prevents runaway queries)
ALTER PROJECT `{{GCP_PROJECT_ID}}`
  SET OPTIONS (
    default_query_job_config.maximum_bytes_billed = {{BIGQUERY_MAX_BYTES_PER_QUERY}}
  );
```

<!-- ENDIF -->

---

<!-- IF {{BI_WAREHOUSE}} == "redshift" -->

### Redshift Configuration

**Cluster Type:** {{REDSHIFT_TYPE}} (provisioned | serverless)
**Region:** {{AWS_REGION}}

#### Provisioned Cluster (if applicable)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Node Type | {{REDSHIFT_NODE_TYPE}} | dc2.large for < 500GB, ra3.xlplus for 500GB+ |
| Number of Nodes | {{REDSHIFT_NODE_COUNT}} | Start with 2 for HA |
| Encryption | AES-256 (KMS) | Mandatory for production |
| Enhanced VPC Routing | Enabled | All COPY/UNLOAD through VPC |
| Maintenance Window | {{REDSHIFT_MAINTENANCE_WINDOW}} | Off-peak hours |

#### Serverless Configuration (if applicable)

```sql
-- Serverless namespace and workgroup
-- Base capacity in RPU (Redshift Processing Units)
-- Min: 8 RPU, scales automatically
CREATE WORKGROUP {{PROJECT_NAME}}_workgroup
  BASE_CAPACITY {{REDSHIFT_BASE_RPU}}
  MAX_CAPACITY {{REDSHIFT_MAX_RPU}}
  CONFIG_PARAMETERS (
    max_query_execution_time = 300,
    enable_result_cache = true
  );
```

#### WLM (Workload Management)

| Queue | Memory % | Concurrency | Timeout (s) | User Groups |
|-------|----------|-------------|-------------|-------------|
| ETL | 30% | 5 | 3600 | `etl_role` |
| Transform | 30% | 5 | 1800 | `transform_role` |
| Dashboard | 30% | 15 | 300 | `bi_role` |
| Default | 10% | 5 | 120 | Everyone else |

<!-- ENDIF -->

---

<!-- IF {{BI_WAREHOUSE}} == "postgres" -->

### PostgreSQL-as-Warehouse Configuration

> **Important:** Using PostgreSQL as both your application database and analytical warehouse works at small scale (< 10GB analytical data, < 5 concurrent dashboard users) but becomes a bottleneck as you grow. This section includes a migration path to a dedicated warehouse (see Section 10 below).

**Host:** {{POSTGRES_WAREHOUSE_HOST}} (should be a read replica, not primary)
**Version:** PostgreSQL {{POSTGRES_VERSION}}
**Max Connections (analytics pool):** {{POSTGRES_ANALYTICS_POOL_SIZE}}

#### Read Replica Setup

```sql
-- On the primary, ensure logical replication is enabled
-- postgresql.conf:
-- wal_level = logical
-- max_replication_slots = 10
-- max_wal_senders = 10

-- Create a dedicated analytics role with read-only access
CREATE ROLE analytics_reader WITH LOGIN PASSWORD '{{POSTGRES_ANALYTICS_PASSWORD}}';
GRANT CONNECT ON DATABASE {{POSTGRES_DATABASE}} TO analytics_reader;
GRANT USAGE ON SCHEMA public TO analytics_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO analytics_reader;
```

#### Separate Schemas on Read Replica

```sql
-- Create analytical schemas on the read replica
CREATE SCHEMA raw_{{PROJECT_NAME}};
CREATE SCHEMA staging_{{PROJECT_NAME}};
CREATE SCHEMA analytics_{{PROJECT_NAME}};
CREATE SCHEMA reporting_{{PROJECT_NAME}};

-- Grant appropriate access
GRANT ALL ON SCHEMA staging_{{PROJECT_NAME}} TO etl_role;
GRANT ALL ON SCHEMA analytics_{{PROJECT_NAME}} TO transform_role;
GRANT USAGE ON SCHEMA reporting_{{PROJECT_NAME}} TO bi_role;
GRANT SELECT ON ALL TABLES IN SCHEMA reporting_{{PROJECT_NAME}} TO bi_role;
```

#### Performance Tuning for Analytical Workloads

```ini
# postgresql.conf overrides for read replica / analytics
shared_buffers = {{POSTGRES_SHARED_BUFFERS}}          # 25% of RAM
effective_cache_size = {{POSTGRES_EFFECTIVE_CACHE}}    # 75% of RAM
work_mem = {{POSTGRES_WORK_MEM}}                      # 256MB+ for analytics
maintenance_work_mem = {{POSTGRES_MAINT_WORK_MEM}}    # 1GB+
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
random_page_cost = 1.1                                # SSD storage assumed
effective_io_concurrency = 200                         # SSD storage
jit = on                                              # JIT compilation for complex queries
```

<!-- ENDIF -->

---

<!-- IF {{BI_WAREHOUSE}} == "clickhouse" -->

### ClickHouse Configuration

**Deployment:** {{CLICKHOUSE_DEPLOYMENT}} (self-hosted | ClickHouse Cloud)
**Cluster Name:** {{CLICKHOUSE_CLUSTER_NAME}}

#### Database and Engine Selection

```sql
CREATE DATABASE raw_{{PROJECT_NAME}} ON CLUSTER '{{CLICKHOUSE_CLUSTER_NAME}}';
CREATE DATABASE staging_{{PROJECT_NAME}} ON CLUSTER '{{CLICKHOUSE_CLUSTER_NAME}}';
CREATE DATABASE analytics_{{PROJECT_NAME}} ON CLUSTER '{{CLICKHOUSE_CLUSTER_NAME}}';
CREATE DATABASE reporting_{{PROJECT_NAME}} ON CLUSTER '{{CLICKHOUSE_CLUSTER_NAME}}';
```

**Engine Selection Guide:**

| Use Case | Recommended Engine | Rationale |
|----------|-------------------|-----------|
| Fact tables (append-only events) | MergeTree | Optimal for time-series analytical data |
| Fact tables (with updates) | ReplacingMergeTree | Deduplicates by sort key on merge |
| Aggregation tables | AggregatingMergeTree | Pre-aggregated rollups for dashboards |
| Dimension tables (small, updateable) | ReplacingMergeTree | Latest version by version column |
| Materialized views | MaterializedView | Real-time aggregation on insert |

#### ClickHouse-Specific Optimizations

```sql
-- Example: events fact table with optimal ClickHouse settings
CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events
(
    event_id UUID,
    event_timestamp DateTime64(3, 'UTC'),
    event_date Date MATERIALIZED toDate(event_timestamp),
    user_id UUID,
    event_name LowCardinality(String),
    event_properties String,  -- JSON stored as String, extracted via JSONExtract
    session_id UUID,
    platform LowCardinality(String),
    country_code LowCardinality(FixedString(2))
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_name, event_date, user_id)
TTL event_date + INTERVAL {{BI_DATA_RETENTION_MONTHS}} MONTH
SETTINGS index_granularity = 8192;
```

<!-- ENDIF -->

---

<!-- IF {{BI_WAREHOUSE}} == "duckdb" -->

### DuckDB Configuration

> **When to use DuckDB as a warehouse:** DuckDB is ideal for single-analyst teams, embedded analytics, local development, and datasets under 100GB. It is not a multi-user server database. For multi-user concurrent access, pair DuckDB with MotherDuck (cloud) or use it as a local development mirror of your production warehouse.

**Storage Mode:** {{DUCKDB_STORAGE_MODE}} (file | MotherDuck)
**File Path:** {{DUCKDB_FILE_PATH}} (e.g., `/data/warehouse/{{PROJECT_NAME}}.duckdb`)

#### Schema Setup

```sql
-- DuckDB schema creation
CREATE SCHEMA raw_{{PROJECT_NAME}};
CREATE SCHEMA staging_{{PROJECT_NAME}};
CREATE SCHEMA analytics_{{PROJECT_NAME}};
CREATE SCHEMA reporting_{{PROJECT_NAME}};

-- DuckDB extensions for source connectivity
INSTALL postgres;
LOAD postgres;
INSTALL httpfs;
LOAD httpfs;

-- Attach source database for direct querying
ATTACH '{{POSTGRES_CONNECTION_STRING}}' AS source_db (TYPE postgres, READ_ONLY);
```

#### Performance Settings

```sql
-- Optimize for analytical workloads
SET memory_limit = '{{DUCKDB_MEMORY_LIMIT}}';    -- e.g., '8GB'
SET threads = {{DUCKDB_THREADS}};                  -- e.g., 4
SET temp_directory = '{{DUCKDB_TEMP_DIR}}';
```

#### MotherDuck Configuration (Cloud)

```sql
-- Connect to MotherDuck for shared access
ATTACH 'md:{{PROJECT_NAME}}_warehouse';

-- Share specific schemas
CREATE SHARE {{PROJECT_NAME}}_reporting FROM reporting_{{PROJECT_NAME}};
```

<!-- ENDIF -->

---

## 2. Schema Architecture

### Schema Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        {{BI_WAREHOUSE}}                            │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ raw_{{PROJECT_  │  │ staging_{{PROJ   │  │ analytics_{{PRO  │  │
│  │ NAME}}          │  │ ECT_NAME}}       │  │ JECT_NAME}}      │  │
│  │                 │  │                  │  │                  │  │
│  │ - Exact copies  │  │ - Cleaned        │  │ - Star schema    │  │
│  │ - No transforms │──│ - Deduplicated   │──│ - Fact tables     │  │
│  │ - Append-only   │  │ - Typed          │  │ - Dim tables     │  │
│  │ - Source schema │  │ - Renamed        │  │ - Business logic │  │
│  └─────────────────┘  └──────────────────┘  └────────┬─────────┘  │
│                                                       │            │
│                                              ┌────────▼─────────┐  │
│                                              │ reporting_{{PRO  │  │
│                                              │ JECT_NAME}}      │  │
│                                              │                  │  │
│                                              │ - Views / mat.   │  │
│                                              │ - Dashboard-     │  │
│                                              │   optimized      │  │
│                                              │ - Aggregated     │  │
│                                              └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Schema Naming Conventions

| Schema | Naming Pattern | Owner Role | Purpose |
|--------|---------------|------------|---------|
| `raw_{{PROJECT_NAME}}` | `raw_{source}_{table}` | `etl_role` | Exact replica of source data, no transformations |
| `staging_{{PROJECT_NAME}}` | `stg_{source}_{entity}` | `transform_role` | Cleaned, typed, deduplicated staging models |
| `analytics_{{PROJECT_NAME}}` | `fact_{entity}`, `dim_{entity}`, `int_{description}` | `transform_role` | Star schema with business logic applied |
| `reporting_{{PROJECT_NAME}}` | `rpt_{domain}_{metric}` | `bi_role` | Views and materialized tables optimized for dashboards |

### Table Naming Rules

- All lowercase, underscore-separated
- Fact tables: `fact_{event_or_measurement}` (e.g., `fact_events`, `fact_transactions`)
- Dimension tables: `dim_{entity}` (e.g., `dim_users`, `dim_plans`)
- Intermediate tables: `int_{description}` (e.g., `int_user_subscription_history`)
- Reporting views: `rpt_{domain}_{metric}` (e.g., `rpt_finance_mrr_waterfall`)
- Snapshots: `snap_{entity}` (e.g., `snap_daily_plan_counts`)

---

## 3. Dimensional Model: Star Schema

### Entity Relationship Diagram

```
                          ┌──────────────┐
                          │  dim_dates   │
                          │──────────────│
                          │ date_key (PK)│
                          │ full_date    │
                          │ year         │
                          │ quarter      │
                          │ month        │
                          │ week         │
                          │ day_of_week  │
                          │ is_weekend   │
                          │ is_holiday   │
                          │ fiscal_year  │
                          │ fiscal_qtr   │
                          └──────┬───────┘
                                 │
    ┌──────────────┐    ┌────────▼───────┐    ┌───────────────┐
    │  dim_users   │    │  fact_events   │    │  dim_features │
    │──────────────│    │────────────────│    │───────────────│
    │ user_key (PK)│◄───│ user_key (FK)  │    │ feature_key   │
    │ user_id      │    │ date_key (FK)  │───►│   (PK)        │
    │ email_hash   │    │ feature_key(FK)│    │ feature_id    │
    │ signup_date  │    │ geo_key (FK)   │    │ feature_name  │
    │ plan_key(FK) │    │ event_id       │    │ feature_area  │
    │ cohort_month │    │ event_name     │    │ release_phase │
    │ user_role    │    │ event_ts       │    │ is_premium    │
    │ company_size │    │ session_id     │    │ owner_team    │
    │ industry     │    │ platform       │    └───────────────┘
    │ acquisition  │    │ event_props    │
    │   _channel   │    │ duration_ms    │    ┌───────────────┐
    │ is_current   │    └────────────────┘    │ dim_geography │
    │ valid_from   │                          │───────────────│
    │ valid_to     │    ┌────────────────┐    │ geo_key (PK)  │
    └──────────────┘    │ fact_transactions   │ country_code  │
                        │────────────────│    │ country_name  │
    ┌──────────────┐    │ user_key (FK)  │    │ region        │
    │  dim_plans   │    │ date_key (FK)  │    │ continent     │
    │──────────────│    │ plan_key (FK)  │    │ timezone      │
    │ plan_key(PK) │◄───│ geo_key (FK)   │    │ currency_code │
    │ plan_id      │    │ txn_id         │    │ gdpr_region   │
    │ plan_name    │    │ amount_cents   │    └───────────────┘
    │ plan_tier    │    │ currency       │
    │ billing_freq │    │ txn_type       │
    │ price_cents  │    │ payment_method │
    │ feature_set  │    │ refund_reason  │
    │ is_active    │    │ processor_fee  │
    │ launched_at  │    └────────────────┘
    │ sunset_at    │
    └──────────────┘    ┌────────────────┐
                        │ fact_sessions  │
                        │────────────────│
                        │ session_key(PK)│
                        │ user_key (FK)  │
                        │ date_key (FK)  │
                        │ geo_key (FK)   │
                        │ session_id     │
                        │ started_at     │
                        │ ended_at       │
                        │ duration_sec   │
                        │ page_count     │
                        │ event_count    │
                        │ platform       │
                        │ entry_page     │
                        │ exit_page      │
                        │ utm_source     │
                        │ utm_medium     │
                        │ utm_campaign   │
                        │ is_bounce      │
                        └────────────────┘

                        ┌──────────────────┐
                        │fact_subscriptions│
                        │──────────────────│
                        │ sub_key (PK)     │
                        │ user_key (FK)    │
                        │ plan_key (FK)    │
                        │ date_key (FK)    │
                        │ subscription_id  │
                        │ status           │
                        │ started_at       │
                        │ ended_at         │
                        │ mrr_cents        │
                        │ arr_cents        │
                        │ billing_interval │
                        │ cancel_reason    │
                        │ trial_start      │
                        │ trial_end        │
                        │ is_trial         │
                        │ discount_pct     │
                        │ movement_type    │
                        └──────────────────┘
```

---

### 3.1 Fact Tables

#### fact_events

Captures every user interaction tracked by {{ANALYTICS_PROVIDER}}.

**Grain:** One row per event occurrence.

| Column | Type | Description |
|--------|------|-------------|
| `event_key` | `BIGINT` (surrogate) | Surrogate primary key |
| `event_id` | `VARCHAR(64)` | Natural key from {{ANALYTICS_PROVIDER}} |
| `user_key` | `BIGINT` | FK to dim_users |
| `date_key` | `INT` | FK to dim_dates (YYYYMMDD format) |
| `feature_key` | `BIGINT` | FK to dim_features (nullable for non-feature events) |
| `geo_key` | `BIGINT` | FK to dim_geography |
| `event_name` | `VARCHAR(128)` | Event taxonomy name (e.g., `feature_used`, `page_viewed`) |
| `event_timestamp` | `TIMESTAMP_TZ` | Exact UTC timestamp |
| `session_id` | `VARCHAR(64)` | Session grouping identifier |
| `platform` | `VARCHAR(20)` | `web`, `ios`, `android`, `api` |
| `event_properties` | `VARIANT` / `JSONB` | Raw event properties payload |
| `duration_ms` | `INT` | Duration for timed events (nullable) |
| `page_url` | `VARCHAR(2048)` | Page URL for page-based events (nullable) |

**Partitioning:** By `date_key` (monthly partitions)
**Clustering:** `event_name`, `user_key`
**Expected Volume:** {{BI_EVENTS_DAILY_VOLUME}} events/day

```sql
-- fact_events DDL
CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events (
    event_key       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id        VARCHAR(64) NOT NULL,
    user_key        BIGINT REFERENCES analytics_{{PROJECT_NAME}}.dim_users(user_key),
    date_key        INT NOT NULL REFERENCES analytics_{{PROJECT_NAME}}.dim_dates(date_key),
    feature_key     BIGINT REFERENCES analytics_{{PROJECT_NAME}}.dim_features(feature_key),
    geo_key         BIGINT REFERENCES analytics_{{PROJECT_NAME}}.dim_geography(geo_key),
    event_name      VARCHAR(128) NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL,
    session_id      VARCHAR(64),
    platform        VARCHAR(20),
    event_properties JSONB,
    duration_ms     INT,
    page_url        VARCHAR(2048)
);

-- Indexes
CREATE INDEX idx_fact_events_date ON analytics_{{PROJECT_NAME}}.fact_events(date_key);
CREATE INDEX idx_fact_events_user ON analytics_{{PROJECT_NAME}}.fact_events(user_key);
CREATE INDEX idx_fact_events_name_date ON analytics_{{PROJECT_NAME}}.fact_events(event_name, date_key);
CREATE INDEX idx_fact_events_session ON analytics_{{PROJECT_NAME}}.fact_events(session_id);
```

#### fact_transactions

Captures every financial transaction from {{BILLING_PROVIDER}}.

**Grain:** One row per charge, refund, or credit event.

| Column | Type | Description |
|--------|------|-------------|
| `txn_key` | `BIGINT` (surrogate) | Surrogate primary key |
| `txn_id` | `VARCHAR(64)` | Natural key from {{BILLING_PROVIDER}} |
| `user_key` | `BIGINT` | FK to dim_users |
| `plan_key` | `BIGINT` | FK to dim_plans |
| `date_key` | `INT` | FK to dim_dates |
| `geo_key` | `BIGINT` | FK to dim_geography |
| `amount_cents` | `BIGINT` | Transaction amount in cents (negative for refunds) |
| `currency` | `CHAR(3)` | ISO 4217 currency code |
| `amount_usd_cents` | `BIGINT` | Normalized to USD using exchange rate at txn time |
| `txn_type` | `VARCHAR(20)` | `charge`, `refund`, `credit`, `dispute` |
| `payment_method` | `VARCHAR(30)` | `card`, `bank_transfer`, `paypal`, etc. |
| `card_brand` | `VARCHAR(20)` | `visa`, `mastercard`, `amex` (nullable) |
| `refund_reason` | `VARCHAR(100)` | Refund categorization (nullable) |
| `processor_fee_cents` | `BIGINT` | Payment processor fees |
| `net_amount_cents` | `BIGINT` | amount_cents - processor_fee_cents |
| `invoice_id` | `VARCHAR(64)` | Associated invoice ID |
| `is_successful` | `BOOLEAN` | Whether the transaction completed |
| `failure_reason` | `VARCHAR(255)` | Failure categorization (nullable) |

**Partitioning:** By `date_key` (monthly)
**Clustering:** `txn_type`, `user_key`

#### fact_sessions

Captures aggregated session-level metrics.

**Grain:** One row per user session.

| Column | Type | Description |
|--------|------|-------------|
| `session_key` | `BIGINT` (surrogate) | Surrogate primary key |
| `session_id` | `VARCHAR(64)` | Natural session identifier |
| `user_key` | `BIGINT` | FK to dim_users |
| `date_key` | `INT` | FK to dim_dates (session start date) |
| `geo_key` | `BIGINT` | FK to dim_geography |
| `started_at` | `TIMESTAMPTZ` | Session start timestamp |
| `ended_at` | `TIMESTAMPTZ` | Session end timestamp |
| `duration_seconds` | `INT` | Total session duration |
| `page_count` | `INT` | Distinct pages viewed |
| `event_count` | `INT` | Total events fired |
| `feature_count` | `INT` | Distinct features used |
| `platform` | `VARCHAR(20)` | `web`, `ios`, `android` |
| `device_type` | `VARCHAR(20)` | `desktop`, `mobile`, `tablet` |
| `browser` | `VARCHAR(50)` | Browser name (web only) |
| `os` | `VARCHAR(50)` | Operating system |
| `entry_page` | `VARCHAR(2048)` | First page of session |
| `exit_page` | `VARCHAR(2048)` | Last page of session |
| `utm_source` | `VARCHAR(255)` | Marketing attribution |
| `utm_medium` | `VARCHAR(255)` | Marketing attribution |
| `utm_campaign` | `VARCHAR(255)` | Marketing attribution |
| `referrer_domain` | `VARCHAR(255)` | Referring domain |
| `is_bounce` | `BOOLEAN` | Single-page session |
| `is_converted` | `BOOLEAN` | Session included a conversion event |
| `conversion_event` | `VARCHAR(128)` | Name of conversion event (nullable) |

**Partitioning:** By `date_key` (monthly)
**Clustering:** `user_key`, `platform`

#### fact_subscriptions

Captures subscription state changes for MRR/ARR analysis.

**Grain:** One row per subscription state change (snapshot or event-based, configurable).

| Column | Type | Description |
|--------|------|-------------|
| `sub_key` | `BIGINT` (surrogate) | Surrogate primary key |
| `subscription_id` | `VARCHAR(64)` | Natural key from {{BILLING_PROVIDER}} |
| `user_key` | `BIGINT` | FK to dim_users |
| `plan_key` | `BIGINT` | FK to dim_plans |
| `date_key` | `INT` | FK to dim_dates (date of state change) |
| `status` | `VARCHAR(20)` | `trialing`, `active`, `past_due`, `canceled`, `unpaid` |
| `previous_status` | `VARCHAR(20)` | Status before this change |
| `started_at` | `TIMESTAMPTZ` | Subscription start date |
| `current_period_start` | `TIMESTAMPTZ` | Current billing period start |
| `current_period_end` | `TIMESTAMPTZ` | Current billing period end |
| `ended_at` | `TIMESTAMPTZ` | Cancellation effective date (nullable) |
| `mrr_cents` | `BIGINT` | Monthly recurring revenue at this state |
| `previous_mrr_cents` | `BIGINT` | MRR before this change |
| `mrr_delta_cents` | `BIGINT` | mrr_cents - previous_mrr_cents |
| `arr_cents` | `BIGINT` | Annualized recurring revenue |
| `billing_interval` | `VARCHAR(10)` | `monthly`, `yearly`, `quarterly` |
| `cancel_reason` | `VARCHAR(255)` | Churn reason (nullable) |
| `cancel_feedback` | `TEXT` | Free-text cancellation feedback (nullable) |
| `trial_start` | `TIMESTAMPTZ` | Trial start date (nullable) |
| `trial_end` | `TIMESTAMPTZ` | Trial end date (nullable) |
| `is_trial` | `BOOLEAN` | Currently in trial |
| `discount_id` | `VARCHAR(64)` | Applied coupon/discount ID (nullable) |
| `discount_percent` | `DECIMAL(5,2)` | Discount percentage (nullable) |
| `movement_type` | `VARCHAR(20)` | `new`, `expansion`, `contraction`, `churn`, `reactivation` |

**Partitioning:** By `date_key` (monthly)
**Clustering:** `movement_type`, `user_key`

---

### 3.2 Dimension Tables

#### dim_users

| Column | Type | SCD Type | Description |
|--------|------|----------|-------------|
| `user_key` | `BIGINT` (surrogate) | N/A | Surrogate key for warehouse joins |
| `user_id` | `VARCHAR(64)` | N/A | Natural key from {{DATABASE}} |
| `email_hash` | `VARCHAR(64)` | Type 1 | SHA-256 hash of email (PII handling) |
| `display_name` | `VARCHAR(255)` | Type 1 | Current display name |
| `signup_date` | `DATE` | Type 1 | Account creation date |
| `signup_date_key` | `INT` | Type 1 | FK to dim_dates for signup |
| `cohort_month` | `VARCHAR(7)` | Type 1 | YYYY-MM cohort assignment |
| `cohort_week` | `VARCHAR(10)` | Type 1 | YYYY-WXX cohort assignment |
| `current_plan_key` | `BIGINT` | Type 1 | FK to dim_plans (current plan) |
| `user_role` | `VARCHAR(50)` | Type 2 | Application role |
| `company_name` | `VARCHAR(255)` | Type 2 | Organization name |
| `company_size` | `VARCHAR(20)` | Type 2 | `solo`, `2-10`, `11-50`, `51-200`, `201-1000`, `1000+` |
| `industry` | `VARCHAR(100)` | Type 2 | Industry vertical |
| `acquisition_channel` | `VARCHAR(100)` | Type 1 | First-touch attribution channel |
| `acquisition_source` | `VARCHAR(255)` | Type 1 | First-touch source detail |
| `lifecycle_stage` | `VARCHAR(30)` | Type 1 | `lead`, `trial`, `active`, `at_risk`, `churned`, `reactivated` |
| `health_score` | `DECIMAL(5,2)` | Type 1 | Latest calculated health score |
| `is_current` | `BOOLEAN` | SCD metadata | Whether this is the current version |
| `valid_from` | `TIMESTAMPTZ` | SCD metadata | Row effective start |
| `valid_to` | `TIMESTAMPTZ` | SCD metadata | Row effective end (9999-12-31 for current) |

#### dim_plans

| Column | Type | SCD Type | Description |
|--------|------|----------|-------------|
| `plan_key` | `BIGINT` (surrogate) | N/A | Surrogate key |
| `plan_id` | `VARCHAR(64)` | N/A | Natural key from {{BILLING_PROVIDER}} |
| `plan_name` | `VARCHAR(100)` | Type 2 | Display name of plan |
| `plan_tier` | `VARCHAR(30)` | Type 2 | `free`, `starter`, `pro`, `enterprise`, `custom` |
| `billing_frequency` | `VARCHAR(10)` | Type 1 | `monthly`, `yearly`, `quarterly` |
| `price_cents` | `BIGINT` | Type 2 | List price per billing period |
| `monthly_price_cents` | `BIGINT` | Type 2 | Normalized to monthly for comparison |
| `currency` | `CHAR(3)` | Type 1 | ISO 4217 |
| `feature_set` | `TEXT` | Type 2 | JSON array of included feature IDs |
| `seat_limit` | `INT` | Type 2 | Max seats (NULL for unlimited) |
| `storage_limit_gb` | `INT` | Type 2 | Max storage (NULL for unlimited) |
| `is_active` | `BOOLEAN` | Type 1 | Whether plan is currently available |
| `launched_at` | `DATE` | Type 1 | Plan launch date |
| `sunset_at` | `DATE` | Type 1 | Plan deprecation date (nullable) |
| `is_current` | `BOOLEAN` | SCD metadata | Current version flag |
| `valid_from` | `TIMESTAMPTZ` | SCD metadata | Row effective start |
| `valid_to` | `TIMESTAMPTZ` | SCD metadata | Row effective end |

#### dim_features

| Column | Type | Description |
|--------|------|-------------|
| `feature_key` | `BIGINT` (surrogate) | Surrogate key |
| `feature_id` | `VARCHAR(64)` | Natural feature identifier |
| `feature_name` | `VARCHAR(255)` | Human-readable feature name |
| `feature_area` | `VARCHAR(100)` | Product area grouping |
| `feature_category` | `VARCHAR(50)` | `core`, `advanced`, `experimental`, `deprecated` |
| `release_phase` | `VARCHAR(20)` | Phase when feature was released |
| `release_date` | `DATE` | GA release date |
| `is_premium` | `BOOLEAN` | Requires paid plan |
| `minimum_plan_tier` | `VARCHAR(30)` | Lowest plan tier that includes this feature |
| `owner_team` | `VARCHAR(100)` | Team responsible for this feature |
| `is_active` | `BOOLEAN` | Whether feature is currently available |

#### dim_dates

Pre-populated calendar dimension covering {{BI_DATA_RETENTION_MONTHS}} months of history plus 24 months forward.

| Column | Type | Description |
|--------|------|-------------|
| `date_key` | `INT` | Primary key in YYYYMMDD format |
| `full_date` | `DATE` | Calendar date |
| `year` | `INT` | Calendar year |
| `quarter` | `INT` | Calendar quarter (1-4) |
| `quarter_name` | `VARCHAR(6)` | `Q1`, `Q2`, `Q3`, `Q4` |
| `month` | `INT` | Calendar month (1-12) |
| `month_name` | `VARCHAR(20)` | Full month name |
| `month_short` | `CHAR(3)` | Three-letter abbreviation |
| `week_of_year` | `INT` | ISO week number |
| `day_of_month` | `INT` | Day within month |
| `day_of_week` | `INT` | 1=Monday, 7=Sunday (ISO) |
| `day_name` | `VARCHAR(10)` | Day name |
| `is_weekend` | `BOOLEAN` | Saturday or Sunday |
| `is_holiday` | `BOOLEAN` | Company-observed holiday |
| `holiday_name` | `VARCHAR(100)` | Holiday name (nullable) |
| `fiscal_year` | `INT` | Fiscal year ({{FISCAL_YEAR_START_MONTH}}) |
| `fiscal_quarter` | `INT` | Fiscal quarter |
| `fiscal_month` | `INT` | Fiscal month |
| `is_current_day` | `BOOLEAN` | Updated daily |
| `is_current_month` | `BOOLEAN` | Updated daily |
| `days_in_month` | `INT` | Number of days in this month |
| `is_month_end` | `BOOLEAN` | Last day of month |
| `is_quarter_end` | `BOOLEAN` | Last day of quarter |

```sql
-- dim_dates generation script (PostgreSQL/Snowflake compatible)
INSERT INTO analytics_{{PROJECT_NAME}}.dim_dates
SELECT
    TO_CHAR(d, 'YYYYMMDD')::INT AS date_key,
    d AS full_date,
    EXTRACT(YEAR FROM d)::INT AS year,
    EXTRACT(QUARTER FROM d)::INT AS quarter,
    'Q' || EXTRACT(QUARTER FROM d)::VARCHAR AS quarter_name,
    EXTRACT(MONTH FROM d)::INT AS month,
    TO_CHAR(d, 'Month') AS month_name,
    TO_CHAR(d, 'Mon') AS month_short,
    EXTRACT(WEEK FROM d)::INT AS week_of_year,
    EXTRACT(DAY FROM d)::INT AS day_of_month,
    EXTRACT(ISODOW FROM d)::INT AS day_of_week,
    TO_CHAR(d, 'Day') AS day_name,
    EXTRACT(ISODOW FROM d) IN (6, 7) AS is_weekend,
    FALSE AS is_holiday,
    NULL AS holiday_name,
    -- Fiscal year logic: adjust if fiscal year starts in month other than January
    CASE WHEN EXTRACT(MONTH FROM d) >= {{FISCAL_YEAR_START_MONTH}}
         THEN EXTRACT(YEAR FROM d)::INT
         ELSE EXTRACT(YEAR FROM d)::INT - 1
    END AS fiscal_year,
    -- Additional fiscal columns derived similarly
    d = DATE_TRUNC('MONTH', d) + INTERVAL '1 MONTH' - INTERVAL '1 DAY' AS is_month_end,
    d = DATE_TRUNC('QUARTER', d) + INTERVAL '3 MONTHS' - INTERVAL '1 DAY' AS is_quarter_end
FROM GENERATE_SERIES(
    CURRENT_DATE - INTERVAL '{{BI_DATA_RETENTION_MONTHS}} months',
    CURRENT_DATE + INTERVAL '24 months',
    INTERVAL '1 day'
) AS d;
```

#### dim_geography

| Column | Type | Description |
|--------|------|-------------|
| `geo_key` | `BIGINT` (surrogate) | Surrogate key |
| `country_code` | `CHAR(2)` | ISO 3166-1 alpha-2 |
| `country_name` | `VARCHAR(100)` | Full country name |
| `region` | `VARCHAR(100)` | Sub-national region / state |
| `city` | `VARCHAR(100)` | City (nullable, depends on data resolution) |
| `continent` | `VARCHAR(20)` | `North America`, `Europe`, `Asia`, etc. |
| `sub_region` | `VARCHAR(50)` | `Western Europe`, `Southeast Asia`, etc. |
| `timezone` | `VARCHAR(50)` | IANA timezone identifier |
| `currency_code` | `CHAR(3)` | Default currency for this geography |
| `gdpr_region` | `BOOLEAN` | Whether GDPR applies |
| `ccpa_region` | `BOOLEAN` | Whether CCPA applies |
| `market_tier` | `VARCHAR(10)` | `tier_1`, `tier_2`, `tier_3` (company-defined) |

---

## 4. Slowly Changing Dimensions (SCD)

### SCD Type 1 — Overwrite

Used for attributes where historical values are not analytically significant.

**Examples in {{PROJECT_NAME}}:**
- `dim_users.display_name` — previous display names have no analytical value
- `dim_users.email_hash` — updated on email change, old email not needed for analysis
- `dim_users.health_score` — always want the latest score
- `dim_plans.is_active` — only current status matters

**Implementation:**

```sql
-- SCD Type 1: simple UPDATE
UPDATE analytics_{{PROJECT_NAME}}.dim_users
SET
    display_name = staging.display_name,
    email_hash = staging.email_hash,
    health_score = staging.health_score,
    lifecycle_stage = staging.lifecycle_stage
FROM staging_{{PROJECT_NAME}}.stg_{{DATABASE}}_users AS staging
WHERE dim_users.user_id = staging.user_id
  AND (
    dim_users.display_name != staging.display_name
    OR dim_users.email_hash != staging.email_hash
    OR dim_users.health_score != staging.health_score
    OR dim_users.lifecycle_stage != staging.lifecycle_stage
  );
```

### SCD Type 2 — Add New Row (Historical Tracking)

Used for attributes where changes represent analytically meaningful state transitions.

**Examples in {{PROJECT_NAME}}:**
- `dim_users.user_role` — role changes affect permission-based analysis
- `dim_users.company_size` — growth affects segmentation
- `dim_plans.price_cents` — price changes affect revenue analysis
- `dim_plans.feature_set` — feature changes affect adoption analysis

**Implementation:**

```sql
-- SCD Type 2: expire old row, insert new row
-- Step 1: Expire changed rows
UPDATE analytics_{{PROJECT_NAME}}.dim_users
SET
    is_current = FALSE,
    valid_to = CURRENT_TIMESTAMP
FROM staging_{{PROJECT_NAME}}.stg_{{DATABASE}}_users AS staging
WHERE dim_users.user_id = staging.user_id
  AND dim_users.is_current = TRUE
  AND (
    dim_users.user_role != staging.user_role
    OR dim_users.company_size != staging.company_size
    OR dim_users.industry != staging.industry
  );

-- Step 2: Insert new current version
INSERT INTO analytics_{{PROJECT_NAME}}.dim_users (
    user_id, email_hash, display_name, signup_date, signup_date_key,
    cohort_month, cohort_week, current_plan_key, user_role, company_name,
    company_size, industry, acquisition_channel, acquisition_source,
    lifecycle_stage, health_score, is_current, valid_from, valid_to
)
SELECT
    staging.user_id,
    staging.email_hash,
    staging.display_name,
    staging.signup_date,
    TO_CHAR(staging.signup_date, 'YYYYMMDD')::INT,
    TO_CHAR(staging.signup_date, 'YYYY-MM'),
    TO_CHAR(staging.signup_date, 'YYYY-"W"IW'),
    staging.current_plan_key,
    staging.user_role,
    staging.company_name,
    staging.company_size,
    staging.industry,
    staging.acquisition_channel,
    staging.acquisition_source,
    staging.lifecycle_stage,
    staging.health_score,
    TRUE,           -- is_current
    CURRENT_TIMESTAMP,  -- valid_from
    '9999-12-31'::TIMESTAMPTZ  -- valid_to
FROM staging_{{PROJECT_NAME}}.stg_{{DATABASE}}_users AS staging
INNER JOIN analytics_{{PROJECT_NAME}}.dim_users AS expired
    ON staging.user_id = expired.user_id
    AND expired.is_current = FALSE
    AND expired.valid_to = CURRENT_TIMESTAMP  -- just expired above
WHERE NOT EXISTS (
    SELECT 1 FROM analytics_{{PROJECT_NAME}}.dim_users AS existing
    WHERE existing.user_id = staging.user_id
    AND existing.is_current = TRUE
);
```

**SCD Type 2 Query Pattern:**

```sql
-- Current state: simple filter
SELECT * FROM analytics_{{PROJECT_NAME}}.dim_users WHERE is_current = TRUE;

-- Point-in-time lookup: what was the user's role on a specific date?
SELECT *
FROM analytics_{{PROJECT_NAME}}.dim_users
WHERE user_id = '{{EXAMPLE_USER_ID}}'
  AND valid_from <= '2025-06-15'::TIMESTAMPTZ
  AND valid_to > '2025-06-15'::TIMESTAMPTZ;

-- Join fact table with dimension at the time of the event
SELECT
    f.event_name,
    f.event_timestamp,
    d.user_role,
    d.company_size
FROM analytics_{{PROJECT_NAME}}.fact_events f
JOIN analytics_{{PROJECT_NAME}}.dim_users d
    ON f.user_key = d.user_key
    AND f.event_timestamp >= d.valid_from
    AND f.event_timestamp < d.valid_to;
```

---

## 5. Partitioning and Clustering Strategies

### By Warehouse Platform

<!-- IF {{BI_WAREHOUSE}} == "snowflake" -->

#### Snowflake: Micro-Partitions and Clustering Keys

Snowflake automatically micro-partitions data. Use clustering keys for large tables (> 1TB) where query patterns are predictable.

| Table | Clustering Key | Rationale |
|-------|---------------|-----------|
| `fact_events` | `(event_timestamp, event_name)` | Most queries filter by date range and event type |
| `fact_transactions` | `(date_key, txn_type)` | Financial queries filter by period and type |
| `fact_sessions` | `(date_key, user_key)` | Session queries filter by period and user |
| `fact_subscriptions` | `(date_key, movement_type)` | MRR analysis filters by period and movement |

```sql
-- Apply clustering keys (only for tables > 1TB or with slow queries)
ALTER TABLE analytics_{{PROJECT_NAME}}.fact_events
  CLUSTER BY (event_timestamp, event_name);

-- Monitor clustering efficiency
SELECT SYSTEM$CLUSTERING_INFORMATION('analytics_{{PROJECT_NAME}}.fact_events');
```

**Cost consideration:** Snowflake charges for automatic reclustering. Only enable clustering when query performance degrades on large tables.

<!-- ENDIF -->

<!-- IF {{BI_WAREHOUSE}} == "bigquery" -->

#### BigQuery: Partitioning and Clustering

| Table | Partition Column | Partition Type | Cluster Columns | Notes |
|-------|-----------------|----------------|-----------------|-------|
| `fact_events` | `event_timestamp` | DAY | `event_name`, `user_key` | Require partition filter in queries |
| `fact_transactions` | `date_key` | RANGE (monthly) | `txn_type`, `user_key` | |
| `fact_sessions` | `started_at` | DAY | `user_key`, `platform` | |
| `fact_subscriptions` | `date_key` | RANGE (monthly) | `movement_type`, `status` | |

```sql
-- BigQuery partitioned + clustered table
CREATE TABLE `{{GCP_PROJECT_ID}}.analytics_{{PROJECT_NAME}}.fact_events`
(
    event_key       INT64 NOT NULL,
    event_id        STRING NOT NULL,
    event_timestamp TIMESTAMP NOT NULL,
    event_name      STRING NOT NULL,
    user_key        INT64,
    -- ... additional columns
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY event_name, user_key
OPTIONS (
    require_partition_filter = TRUE,
    partition_expiration_days = {{BI_DATA_RETENTION_MONTHS}} * 30
);
```

<!-- ENDIF -->

<!-- IF {{BI_WAREHOUSE}} == "redshift" -->

#### Redshift: Distribution and Sort Keys

| Table | Distribution Style | Distribution Key | Sort Key | Sort Type |
|-------|-------------------|------------------|----------|-----------|
| `fact_events` | KEY | `user_key` | `(date_key, event_name)` | COMPOUND |
| `fact_transactions` | KEY | `user_key` | `(date_key, txn_type)` | COMPOUND |
| `fact_sessions` | KEY | `user_key` | `(date_key)` | COMPOUND |
| `fact_subscriptions` | KEY | `user_key` | `(date_key, movement_type)` | COMPOUND |
| `dim_users` | KEY | `user_key` | `(user_key)` | COMPOUND |
| `dim_plans` | ALL | N/A | `(plan_key)` | COMPOUND |
| `dim_dates` | ALL | N/A | `(date_key)` | COMPOUND |
| `dim_features` | ALL | N/A | `(feature_key)` | COMPOUND |
| `dim_geography` | ALL | N/A | `(geo_key)` | COMPOUND |

**Guidelines:**
- **DISTKEY** on the most common join key (usually `user_key` for fact tables)
- **ALL** distribution for small dimension tables (< 1M rows) to co-locate with every node
- **SORTKEY** on most common filter columns (usually date first)

<!-- ENDIF -->

<!-- IF {{BI_WAREHOUSE}} == "postgres" -->

#### PostgreSQL: Table Partitioning

```sql
-- Declarative partitioning for large fact tables
CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events (
    event_key       BIGINT GENERATED ALWAYS AS IDENTITY,
    event_timestamp TIMESTAMPTZ NOT NULL,
    event_name      VARCHAR(128) NOT NULL,
    user_key        BIGINT,
    -- ... additional columns
) PARTITION BY RANGE (event_timestamp);

-- Create monthly partitions
CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events_y2025m01
    PARTITION OF analytics_{{PROJECT_NAME}}.fact_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events_y2025m02
    PARTITION OF analytics_{{PROJECT_NAME}}.fact_events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Automate partition creation with pg_partman
CREATE EXTENSION IF NOT EXISTS pg_partman;

SELECT partman.create_parent(
    p_parent_table := 'analytics_{{PROJECT_NAME}}.fact_events',
    p_control := 'event_timestamp',
    p_type := 'range',
    p_interval := '1 month',
    p_premake := 3
);
```

<!-- ENDIF -->

<!-- IF {{BI_WAREHOUSE}} == "clickhouse" -->

#### ClickHouse: Partitioning and Primary Key

Covered in the ClickHouse Configuration section above. Key principles:

- Partition by month: `PARTITION BY toYYYYMM(event_date)`
- Primary key (ORDER BY) determines data layout on disk — choose columns that match WHERE clause patterns
- Use `TTL` for automatic data expiration
- Avoid over-partitioning (< 1000 parts per table)

<!-- ENDIF -->

---

## 6. Cost Estimation Framework

### By Data Volume Tier

| Tier | Volume | {{BI_WAREHOUSE}} Estimated Monthly Cost | Suitable Platforms | Notes |
|------|--------|----------------------------------------|-------------------|-------|
| **Startup** | < 10 GB | $0–50 | Postgres, DuckDB, BigQuery (free tier) | Use application DB read replica |
| **Growth** | 10–100 GB | $50–500 | BigQuery, Snowflake, ClickHouse | Dedicated warehouse becomes cost-effective |
| **Scale** | 100 GB–1 TB | $500–3,000 | Snowflake, BigQuery, Redshift | Partitioning and clustering become essential |
| **Enterprise** | 1 TB+ | $3,000–20,000+ | Snowflake, BigQuery, Redshift | Reserved capacity, enterprise agreements |

### Cost Breakdown Components

| Component | Startup (< 10GB) | Growth (10-100GB) | Scale (100GB-1TB) | Enterprise (1TB+) |
|-----------|-------------------|--------------------|--------------------|---------------------|
| **Storage** | $0–5/mo | $5–50/mo | $50–500/mo | $500–5,000/mo |
| **Compute (queries)** | $0–20/mo | $20–200/mo | $200–1,500/mo | $1,500–10,000/mo |
| **Compute (ETL)** | $0–10/mo | $10–100/mo | $100–500/mo | $500–3,000/mo |
| **ETL tool** | $0 (custom) | $0–300/mo | $300–1,000/mo | $1,000–5,000/mo |
| **BI platform** | $0 (Metabase OSS) | $0–100/mo | $100–1,000/mo | $1,000–10,000/mo |
| **Total estimated** | **$0–35/mo** | **$35–750/mo** | **$750–4,500/mo** | **$4,500–33,000/mo** |

### Cost Optimization Strategies

1. **Auto-suspend compute** — {{BI_WAREHOUSE}} warehouses / clusters should auto-suspend after 60-300 seconds of inactivity
2. **Partition pruning** — Require partition filters on all large table queries to avoid full scans
3. **Materialized views** — Pre-aggregate common dashboard queries to reduce compute at query time
4. **Query caching** — Enable result caching (automatic in Snowflake/BigQuery, configure in Redshift/Postgres)
5. **Data lifecycle** — Move cold data (> {{BI_DATA_RETENTION_MONTHS}} months) to cheaper storage tiers
6. **Right-size compute** — Start with smallest warehouse size, scale up only when query wait times exceed SLA
7. **Schedule-aware loading** — Run ETL during off-peak hours when possible for lower-priority data
8. **Column pruning** — In columnar warehouses, SELECT only needed columns (never `SELECT *`)

---

## 7. Access Control

### Role-Based Access Control (RBAC)

| Role | Schema Access | Permissions | Assigned To |
|------|--------------|-------------|-------------|
| `etl_role` | `raw_{{PROJECT_NAME}}` | READ, WRITE, CREATE | ETL service account |
| `transform_role` | `staging_{{PROJECT_NAME}}`, `analytics_{{PROJECT_NAME}}` | READ, WRITE, CREATE | dbt service account |
| `bi_role` | `reporting_{{PROJECT_NAME}}` (read), `analytics_{{PROJECT_NAME}}` (read) | SELECT only | BI platform service account |
| `analyst_role` | `analytics_{{PROJECT_NAME}}`, `reporting_{{PROJECT_NAME}}` | SELECT only | Data analysts |
| `admin_role` | All schemas | ALL | Data engineering lead |

```sql
-- Role creation and grants (PostgreSQL / Snowflake syntax)
CREATE ROLE etl_role;
CREATE ROLE transform_role;
CREATE ROLE bi_role;
CREATE ROLE analyst_role;
CREATE ROLE admin_role;

-- ETL role: read/write on raw
GRANT USAGE ON SCHEMA raw_{{PROJECT_NAME}} TO etl_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA raw_{{PROJECT_NAME}} TO etl_role;
GRANT CREATE ON SCHEMA raw_{{PROJECT_NAME}} TO etl_role;

-- Transform role: read raw + staging, write staging + analytics
GRANT USAGE ON SCHEMA raw_{{PROJECT_NAME}} TO transform_role;
GRANT SELECT ON ALL TABLES IN SCHEMA raw_{{PROJECT_NAME}} TO transform_role;
GRANT USAGE ON SCHEMA staging_{{PROJECT_NAME}} TO transform_role;
GRANT ALL ON ALL TABLES IN SCHEMA staging_{{PROJECT_NAME}} TO transform_role;
GRANT USAGE ON SCHEMA analytics_{{PROJECT_NAME}} TO transform_role;
GRANT ALL ON ALL TABLES IN SCHEMA analytics_{{PROJECT_NAME}} TO transform_role;

-- BI role: read-only on analytics + reporting
GRANT USAGE ON SCHEMA analytics_{{PROJECT_NAME}} TO bi_role;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics_{{PROJECT_NAME}} TO bi_role;
GRANT USAGE ON SCHEMA reporting_{{PROJECT_NAME}} TO bi_role;
GRANT SELECT ON ALL TABLES IN SCHEMA reporting_{{PROJECT_NAME}} TO bi_role;

-- Analyst role: same as BI role but can also create temporary tables
GRANT USAGE ON SCHEMA analytics_{{PROJECT_NAME}} TO analyst_role;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics_{{PROJECT_NAME}} TO analyst_role;
GRANT USAGE ON SCHEMA reporting_{{PROJECT_NAME}} TO analyst_role;
GRANT SELECT ON ALL TABLES IN SCHEMA reporting_{{PROJECT_NAME}} TO analyst_role;
GRANT CREATE ON SCHEMA analyst_sandbox TO analyst_role;

-- Future grants (ensure new tables inherit permissions)
ALTER DEFAULT PRIVILEGES IN SCHEMA raw_{{PROJECT_NAME}} GRANT SELECT ON TABLES TO transform_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics_{{PROJECT_NAME}} GRANT SELECT ON TABLES TO bi_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics_{{PROJECT_NAME}} GRANT SELECT ON TABLES TO analyst_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA reporting_{{PROJECT_NAME}} GRANT SELECT ON TABLES TO bi_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA reporting_{{PROJECT_NAME}} GRANT SELECT ON TABLES TO analyst_role;
```

### Row-Level Security (RLS)

For multi-tenant or segmented data access:

```sql
-- PostgreSQL RLS example: restrict analysts to their assigned segments
ALTER TABLE analytics_{{PROJECT_NAME}}.dim_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY analyst_segment_access ON analytics_{{PROJECT_NAME}}.dim_users
    FOR SELECT
    USING (
        industry IN (
            SELECT allowed_industry
            FROM analytics_{{PROJECT_NAME}}.analyst_segment_assignments
            WHERE analyst_username = current_user
        )
    );

-- Snowflake: use secure views or row access policies
CREATE OR REPLACE ROW ACCESS POLICY analytics_{{PROJECT_NAME}}.segment_policy
AS (industry VARCHAR) RETURNS BOOLEAN ->
    CURRENT_ROLE() IN ('admin_role', 'analyst_all_segments')
    OR EXISTS (
        SELECT 1 FROM analytics_{{PROJECT_NAME}}.analyst_segment_assignments
        WHERE analyst_role = CURRENT_ROLE()
        AND allowed_industry = industry
    );

ALTER TABLE analytics_{{PROJECT_NAME}}.dim_users
    ADD ROW ACCESS POLICY analytics_{{PROJECT_NAME}}.segment_policy ON (industry);
```

---

## 8. Backup and Disaster Recovery

### Backup Strategy

| Component | Method | Frequency | Retention | RTO | RPO |
|-----------|--------|-----------|-----------|-----|-----|
| Raw layer | Source system re-extraction | On-demand | N/A (re-extractable) | 4 hours | 0 (re-extract from source) |
| Staging layer | Warehouse snapshots | Daily | 7 days | 1 hour | 24 hours |
| Analytics layer | Warehouse snapshots | Daily | 30 days | 1 hour | 24 hours |
| Reporting layer | Derived from analytics | On-demand | N/A (rebuildable) | 2 hours | 0 (rebuild from analytics) |
| Transformation code | Git repository | Every commit | Unlimited | 15 minutes | 0 (deploy from git) |
| BI platform config | Platform export + Git | Daily | 90 days | 2 hours | 24 hours |

### Platform-Specific Recovery

<!-- IF {{BI_WAREHOUSE}} == "snowflake" -->

**Snowflake Time Travel:**
```sql
-- Recover accidentally dropped table (within retention period)
UNDROP TABLE analytics_{{PROJECT_NAME}}.fact_events;

-- Query historical data (up to 90 days on Enterprise)
SELECT COUNT(*) FROM analytics_{{PROJECT_NAME}}.fact_events
AT(TIMESTAMP => '2025-06-01 00:00:00'::TIMESTAMP);

-- Clone table at point in time
CREATE TABLE analytics_{{PROJECT_NAME}}.fact_events_recovery
CLONE analytics_{{PROJECT_NAME}}.fact_events
AT(TIMESTAMP => '2025-06-01 00:00:00'::TIMESTAMP);
```

<!-- ENDIF -->

<!-- IF {{BI_WAREHOUSE}} == "bigquery" -->

**BigQuery Time Travel:**
```sql
-- Query data at a specific point in time (up to 7 days)
SELECT COUNT(*)
FROM `{{GCP_PROJECT_ID}}.analytics_{{PROJECT_NAME}}.fact_events`
FOR SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 DAY);

-- Recover deleted table (within 7 days)
-- Use bq command line:
-- bq cp {{GCP_PROJECT_ID}}:analytics_{{PROJECT_NAME}}.fact_events@-3600000 {{GCP_PROJECT_ID}}:analytics_{{PROJECT_NAME}}.fact_events_recovered
```

<!-- ENDIF -->

### Disaster Recovery Runbook

1. **Identify scope** — Which schemas/tables are affected? Is it data corruption, deletion, or infrastructure failure?
2. **Assess impact** — Which dashboards and reports are affected? Notify stakeholders via {{BI_ALERT_CHANNEL}}.
3. **Isolate** — If corruption, stop ETL pipelines immediately to prevent propagation.
4. **Recover raw layer** — Re-extract from source systems if needed (raw data is always re-extractable).
5. **Recover analytics layer** — Use time travel / snapshots to restore to last known good state.
6. **Rebuild reporting layer** — Re-run dbt models from analytics layer.
7. **Validate** — Run data quality checks (see `data-quality-governance.template.md`) on recovered data.
8. **Resume pipelines** — Restart ETL with monitoring on high alert.
9. **Post-mortem** — Document root cause, impact, and prevention measures within 48 hours.

---

## 9. Migration Path: PostgreSQL to Dedicated Warehouse

### Migration Triggers

Migrate from Postgres-as-warehouse to a dedicated warehouse when any of these conditions are met:

| Trigger | Threshold | Measurement |
|---------|-----------|-------------|
| Analytical data volume | > 50 GB | `SELECT pg_size_pretty(pg_database_size('{{POSTGRES_DATABASE}}'))` |
| Concurrent dashboard users | > 5 simultaneous | Connection pool monitoring |
| Slowest dashboard query | > 10 seconds | Query log analysis |
| Read replica lag | > 30 seconds sustained | Replication monitoring |
| Query contention with OLTP | Any lock contention | `pg_stat_activity` analysis |
| ETL window exceeds off-peak hours | ETL takes > 4 hours | Pipeline monitoring |

### Migration Plan

#### Phase 1: Parallel Run (2-4 weeks)

1. **Provision {{BI_WAREHOUSE}} instance** with same schema structure
2. **Dual-write ETL** — Pipeline writes to both Postgres and {{BI_WAREHOUSE}}
3. **Run data quality comparisons** — Row counts, aggregation spot checks between both targets
4. **Connect BI platform to {{BI_WAREHOUSE}}** in read-only / testing mode

#### Phase 2: Cutover (1 week)

1. **Switch BI platform connection** from Postgres to {{BI_WAREHOUSE}}
2. **Monitor dashboard performance** — Expected improvement: 3-10x query speed
3. **Keep Postgres pipeline running** as fallback for 1 week
4. **Validate all dashboards** produce identical results

#### Phase 3: Decommission (1 week)

1. **Stop Postgres analytical ETL** pipeline
2. **Drop analytical schemas** from Postgres read replica
3. **Remove analytical indexes** that were only for BI queries
4. **Reclaim Postgres resources** — Reduce read replica size if possible
5. **Update documentation** — All references to Postgres warehouse become {{BI_WAREHOUSE}}

### Schema Translation Reference

| Postgres Type | Snowflake | BigQuery | Redshift | ClickHouse |
|--------------|-----------|----------|----------|------------|
| `BIGINT` | `NUMBER(38,0)` | `INT64` | `BIGINT` | `Int64` |
| `TIMESTAMPTZ` | `TIMESTAMP_TZ` | `TIMESTAMP` | `TIMESTAMPTZ` | `DateTime64(3, 'UTC')` |
| `JSONB` | `VARIANT` | `JSON` / `STRING` | `SUPER` | `String` (with JSONExtract) |
| `VARCHAR(n)` | `VARCHAR(n)` | `STRING` | `VARCHAR(n)` | `String` |
| `BOOLEAN` | `BOOLEAN` | `BOOL` | `BOOLEAN` | `UInt8` |
| `DECIMAL(p,s)` | `NUMBER(p,s)` | `NUMERIC(p,s)` | `DECIMAL(p,s)` | `Decimal(p,s)` |
| `UUID` | `VARCHAR(36)` | `STRING` | `VARCHAR(36)` | `UUID` |
| `DATE` | `DATE` | `DATE` | `DATE` | `Date` |
| `TEXT` | `VARCHAR(16777216)` | `STRING` | `VARCHAR(65535)` | `String` |

---

## 10. Warehouse Health Monitoring

### Key Metrics to Track

| Metric | Target | Alert Threshold | Check Frequency |
|--------|--------|----------------|-----------------|
| Storage growth rate | < {{BI_STORAGE_GROWTH_TARGET}} GB/month | > 2x target | Daily |
| Longest running query | < 60 seconds (dashboards) | > 120 seconds | Continuous |
| Failed queries / hour | 0 | > 5 | Continuous |
| Warehouse credit usage | < {{SNOWFLAKE_MONTHLY_CREDIT_LIMIT}} | > 75% of budget | Daily |
| Stale table (no refresh) | Within SLA | Exceeds freshness SLA | Hourly |
| Schema drift detected | 0 unexpected changes | Any unexpected column | Per ETL run |
| Zombie tables (unused > 90 days) | 0 | Any table with 0 queries in 90 days | Monthly |

### Monitoring Queries

```sql
-- Snowflake: query history analysis
SELECT
    WAREHOUSE_NAME,
    COUNT(*) AS query_count,
    AVG(TOTAL_ELAPSED_TIME) / 1000 AS avg_duration_seconds,
    MAX(TOTAL_ELAPSED_TIME) / 1000 AS max_duration_seconds,
    SUM(CREDITS_USED_CLOUD_SERVICES) AS cloud_credits
FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
WHERE START_TIME > DATEADD('day', -7, CURRENT_TIMESTAMP())
  AND DATABASE_NAME = 'analytics_{{PROJECT_NAME}}'
GROUP BY WAREHOUSE_NAME
ORDER BY avg_duration_seconds DESC;

-- PostgreSQL: slow query identification
SELECT
    query,
    calls,
    mean_exec_time / 1000 AS avg_seconds,
    max_exec_time / 1000 AS max_seconds,
    total_exec_time / 1000 / 60 AS total_minutes
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = '{{POSTGRES_DATABASE}}')
ORDER BY mean_exec_time DESC
LIMIT 20;
```

---

## Checklist

- [ ] Warehouse platform selected and provisioned: {{BI_WAREHOUSE}}
- [ ] All four schemas created: `raw_`, `staging_`, `analytics_`, `reporting_`
- [ ] Fact tables defined: `fact_events`, `fact_transactions`, `fact_sessions`, `fact_subscriptions`
- [ ] Dimension tables defined: `dim_users`, `dim_plans`, `dim_features`, `dim_dates`, `dim_geography`
- [ ] SCD strategy documented for each dimension attribute
- [ ] Partitioning and clustering configured for fact tables
- [ ] Cost estimation completed for current data volume tier
- [ ] RBAC roles created and permissions granted
- [ ] Row-level security configured (if multi-tenant or segmented)
- [ ] Backup and disaster recovery plan documented
- [ ] Migration triggers defined (if using Postgres-as-warehouse)
- [ ] Warehouse health monitoring configured with alerting
- [ ] dim_dates pre-populated with calendar data
- [ ] Schema translation reference saved (for future migration)
