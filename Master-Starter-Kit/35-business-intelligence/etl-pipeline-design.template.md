# ETL Pipeline Design: {{PROJECT_NAME}}

## Overview

**Project:** {{PROJECT_NAME}}
**Source Database:** {{DATABASE}}
**ETL Tool:** {{BI_ETL_TOOL}}
**Warehouse:** {{BI_WAREHOUSE}}
**BI Platform:** {{BI_PLATFORM}}
**Refresh Cadence:** {{BI_REFRESH_CADENCE}}
**Transform Tool:** {{BI_TRANSFORM_TOOL}}

---

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        {{PROJECT_NAME}} Data Pipeline                          │
│                                                                                 │
│  SOURCES                EXTRACT / CDC        STAGING         TRANSFORM    SERVE │
│  ───────                ─────────────        ───────         ─────────    ───── │
│                                                                                 │
│  ┌──────────┐     ┌─────────────────┐    ┌───────────┐                         │
│  │{{DATABASE│────►│ CDC / Logical   │───►│ raw_{{PRO │                         │
│  │}}        │     │ Replication     │    │ JECT_NAME}│                         │
│  │ (OLTP)   │     │                 │    │           │                         │
│  └──────────┘     │ {{BI_ETL_TOOL}} │    │ Landing   │    ┌──────────┐         │
│                    │                 │    │ Zone      │    │ staging_ │         │
│  ┌──────────┐     │ Connectors:     │    │           │    │ {{PROJ   │         │
│  │{{BILLING │────►│ - DB replication│───►│ Dedup     │───►│ ECT_     │         │
│  │_PROVIDER}│     │ - API polling   │    │ Schema    │    │ NAME}}   │         │
│  │}         │     │ - Webhook ingest│    │ evolution │    │          │    ┌────┐│
│  └──────────┘     │ - File ingest   │    │ handling  │    │ Cleaned  │    │{{BI││
│                    └─────────────────┘    └───────────┘    │ Typed    │    │_PLA││
│  ┌──────────┐                                             │ Renamed  │    │TFO ││
│  │{{ANALYTI │     ┌─────────────────┐    ┌───────────┐    └────┬─────┘    │RM}}││
│  │CS_PROVID │────►│ API Extraction  │───►│ raw_{{PRO │         │          │    ││
│  │ER}}      │     │ (batch/stream)  │    │ JECT_NAME}│         ▼          │    ││
│  └──────────┘     └─────────────────┘    └───────────┘    ┌──────────┐    │    ││
│                                                           │analytics_│    │    ││
│  ┌──────────┐     ┌─────────────────┐    ┌───────────┐    │{{PROJECT │───►│    ││
│  │ CRM /    │────►│ API Extraction  │───►│ raw_{{PRO │───►│_NAME}}   │    │    ││
│  │ Support  │     │ (scheduled)     │    │ JECT_NAME}│    │          │    │    ││
│  │ Tools    │     └─────────────────┘    └───────────┘    │ Star     │    │    ││
│  └──────────┘                                             │ Schema   │    │    ││
│                                                           │ Fact +   │    │    ││
│  ┌──────────┐     ┌─────────────────┐    ┌───────────┐    │ Dim      │    │    ││
│  │ Google   │────►│ File / API      │───►│ raw_{{PRO │───►│ Tables   │    │    ││
│  │ Sheets / │     │ Extraction      │    │ JECT_NAME}│    └──────────┘    └────┘│
│  │ CSV      │     └─────────────────┘    └───────────┘                         │
│  └──────────┘                                                                   │
│                                                                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  ORCHESTRATION: {{BI_ORCHESTRATOR}}                                             │
│  MONITORING:    Freshness checks, row count anomalies, schema drift alerts      │
│  ALERTING:      {{BI_ALERT_CHANNEL}}                                            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Source Inventory

| Source | Type | Extraction Method | Frequency | Priority | Volume Estimate | Owner |
|--------|------|-------------------|-----------|----------|-----------------|-------|
| {{DATABASE}} (application DB) | Database | CDC / Logical Replication | Real-time / {{BI_REFRESH_CADENCE}} | P0 | {{BI_APP_DB_VOLUME}} | {{BI_METRIC_OWNER_DEFAULT}} |
| {{BILLING_PROVIDER}} | SaaS API | API polling + Webhooks | Real-time (webhooks) + hourly (reconciliation) | P0 | ~10K events/day | Finance |
| {{ANALYTICS_PROVIDER}} | SaaS API | Batch export / API | Hourly | P0 | {{BI_EVENTS_DAILY_VOLUME}} events/day | Product |
| CRM ({{CRM_TOOL}}) | SaaS API | API polling | Daily | P1 | ~1K records/day | Sales |
| Support ({{SUPPORT_TOOL}}) | SaaS API | API polling | Every 4 hours | P1 | ~500 tickets/day | CX |
| Email ({{EMAIL_PROVIDER}}) | SaaS API | Webhook + daily reconciliation | Daily | P2 | ~5K events/day | Marketing |
| Google Analytics / Ads | SaaS API | API polling | Daily | P2 | Aggregated metrics | Marketing |
| Manual data (Google Sheets) | File | Sheets API / CSV upload | On-demand | P3 | Small datasets | Various |

---

## 3. ETL Tool Configuration

<!-- IF {{BI_ETL_TOOL}} == "fivetran" -->

### Fivetran Configuration

**Plan:** {{FIVETRAN_PLAN}} (Free | Starter | Standard | Enterprise)
**Destination:** {{BI_WAREHOUSE}}

#### Connector Setup

| Connector | Source | Sync Frequency | Sync Mode | Schema Prefix | Est. MAR |
|-----------|--------|---------------|-----------|---------------|----------|
| {{DATABASE}} | {{DATABASE}} connector | {{BI_REFRESH_CADENCE}} | Incremental (CDC) | `raw_{{PROJECT_NAME}}_app` | {{FIVETRAN_APP_MAR}} |
| {{BILLING_PROVIDER}} | {{BILLING_PROVIDER}} connector | 1 hour | Incremental | `raw_{{PROJECT_NAME}}_billing` | {{FIVETRAN_BILLING_MAR}} |
| {{ANALYTICS_PROVIDER}} | {{ANALYTICS_PROVIDER}} connector | 6 hours | Incremental | `raw_{{PROJECT_NAME}}_analytics` | {{FIVETRAN_ANALYTICS_MAR}} |
| {{CRM_TOOL}} | CRM connector | 24 hours | Incremental | `raw_{{PROJECT_NAME}}_crm` | {{FIVETRAN_CRM_MAR}} |
| {{SUPPORT_TOOL}} | Support connector | 4 hours | Incremental | `raw_{{PROJECT_NAME}}_support` | {{FIVETRAN_SUPPORT_MAR}} |

#### Fivetran Cost Management

**Pricing model:** Monthly Active Rows (MAR) — each row synced at least once per month counts.

| Tier | MAR Included | Cost per Additional 1M MAR | Notes |
|------|-------------|---------------------------|-------|
| Free | 500K | N/A | 1 user, limited connectors |
| Starter | 1M | ~$1.00/1K MAR | Most SaaS connectors |
| Standard | 5M | ~$0.50/1K MAR | All connectors, transformations |
| Enterprise | Custom | Negotiated | SLA, dedicated support |

**Estimated monthly MAR for {{PROJECT_NAME}}:** {{FIVETRAN_TOTAL_MAR}}
**Estimated monthly cost:** ${{FIVETRAN_MONTHLY_COST}}

#### MAR Optimization Strategies

1. **Exclude static tables** — Reference tables that never change should sync weekly, not continuously
2. **Filter columns** — Exclude columns you do not need (reduces sync volume and downstream storage)
3. **Use incremental mode** — Never use full-table sync unless the source lacks updated_at timestamps
4. **Consolidate connectors** — If using multiple Stripe accounts, consider syncing to a single schema with account identifiers

#### Fivetran Transformation Triggers

```yaml
# fivetran.yml — trigger dbt after sync completion
connectors:
  - connector_id: {{FIVETRAN_APP_CONNECTOR_ID}}
    schedule_type: interval
    sync_frequency: 60  # minutes
    transformations:
      - type: dbt
        trigger_on_sync: true
        project_id: {{FIVETRAN_DBT_PROJECT_ID}}
```

<!-- ENDIF -->

---

<!-- IF {{BI_ETL_TOOL}} == "airbyte" -->

### Airbyte Configuration

**Deployment:** {{AIRBYTE_DEPLOYMENT}} (Cloud | Self-Hosted | Docker)
**Version:** {{AIRBYTE_VERSION}}

#### Connection Setup

| Connection | Source | Destination | Sync Mode | Frequency | Namespace |
|------------|--------|-------------|-----------|-----------|-----------|
| App DB | {{DATABASE}} (CDC) | {{BI_WAREHOUSE}} | Incremental - Deduped | {{BI_REFRESH_CADENCE}} | `raw_{{PROJECT_NAME}}_app` |
| Billing | {{BILLING_PROVIDER}} | {{BI_WAREHOUSE}} | Incremental - Append | 1 hour | `raw_{{PROJECT_NAME}}_billing` |
| Analytics | {{ANALYTICS_PROVIDER}} | {{BI_WAREHOUSE}} | Incremental - Append | 6 hours | `raw_{{PROJECT_NAME}}_analytics` |
| CRM | {{CRM_TOOL}} | {{BI_WAREHOUSE}} | Incremental - Deduped | 24 hours | `raw_{{PROJECT_NAME}}_crm` |
| Support | {{SUPPORT_TOOL}} | {{BI_WAREHOUSE}} | Incremental - Append | 4 hours | `raw_{{PROJECT_NAME}}_support` |

#### Airbyte Sync Modes

| Mode | Use Case | Behavior |
|------|----------|----------|
| **Full Refresh - Overwrite** | Small reference tables (< 10K rows) | Drops and recreates table each sync |
| **Full Refresh - Append** | Never use in production | Duplicates data every sync |
| **Incremental - Append** | Event/log tables (immutable) | Adds new rows only, uses cursor field |
| **Incremental - Deduped** | Entity tables (mutable rows) | Upserts based on primary key + cursor |
| **CDC** | Large mutable tables with DB support | Uses WAL/binlog for real-time capture |

#### Airbyte Self-Hosted Resource Requirements

| Component | CPU | Memory | Storage | Notes |
|-----------|-----|--------|---------|-------|
| Server (webapp + API) | 2 cores | 4 GB | 30 GB | Kubernetes recommended for production |
| Worker | 2 cores | 4 GB | 50 GB | Scale workers for parallel syncs |
| Database (metadata) | 1 core | 2 GB | 20 GB | PostgreSQL for Airbyte internal state |
| Temporal (orchestration) | 1 core | 2 GB | 10 GB | Manages sync scheduling |

#### Airbyte Cost (Cloud)

| Tier | Credits Included | Cost per Credit | Notes |
|------|-----------------|-----------------|-------|
| Free | 10K/month | N/A | Limited connectors |
| Growth | Pay-as-you-go | $3.00/credit | 1 credit ≈ 10K rows synced |
| Enterprise | Custom | Negotiated | SLA, SSO, RBAC |

**Estimated monthly credits for {{PROJECT_NAME}}:** {{AIRBYTE_MONTHLY_CREDITS}}
**Estimated monthly cost:** ${{AIRBYTE_MONTHLY_COST}}

<!-- ENDIF -->

---

<!-- IF {{BI_ETL_TOOL}} == "custom" -->

### Custom ETL Pipeline

**Language:** {{ETL_LANGUAGE}} (Python, TypeScript, Go)
**Framework:** {{ETL_FRAMEWORK}} (none, Singer, Meltano, custom scripts)
**Deployment:** {{ETL_DEPLOYMENT}} (cron, Kubernetes CronJob, Lambda/Cloud Function, Docker)

#### Pipeline Architecture

```
┌─────────────┐    ┌─────────────────────┐    ┌──────────────┐
│   Extract    │    │     Transform       │    │     Load     │
│              │    │                     │    │              │
│ - DB queries │───►│ - Deduplication     │───►│ - Bulk COPY  │
│ - API calls  │    │ - Type casting      │    │ - MERGE/     │
│ - File reads │    │ - Schema mapping    │    │   UPSERT     │
│ - CDC stream │    │ - PII handling      │    │ - Staging +  │
│              │    │ - Validation        │    │   swap       │
└─────────────┘    └─────────────────────┘    └──────────────┘
```

#### Extractor Template (Python)

```python
"""
Extractor for {{DATABASE}} → {{BI_WAREHOUSE}}
Source: {{DATABASE}} (application database)
Target: raw_{{PROJECT_NAME}}.{table_name}
Schedule: {{BI_REFRESH_CADENCE}}
"""

import logging
from datetime import datetime, timedelta
from typing import Iterator, Dict, Any

logger = logging.getLogger("etl.extract.{{DATABASE}}")

class {{DATABASE | capitalize}}Extractor:
    """Incremental extractor for {{DATABASE}} tables."""

    def __init__(self, source_config: dict, state_store):
        self.source_url = source_config["connection_string"]
        self.state_store = state_store  # Tracks last extracted timestamp per table

    def extract_table(
        self,
        table_name: str,
        cursor_column: str = "updated_at",
        batch_size: int = 10_000,
    ) -> Iterator[list[Dict[str, Any]]]:
        """
        Incremental extraction using cursor-based pagination.

        Args:
            table_name: Source table name
            cursor_column: Column to track incremental position
            batch_size: Rows per batch

        Yields:
            Batches of rows as list of dicts
        """
        last_cursor = self.state_store.get_cursor(table_name)
        if last_cursor is None:
            # First run: full extraction with reasonable lookback
            last_cursor = datetime.utcnow() - timedelta(days={{BI_INITIAL_LOOKBACK_DAYS}})
            logger.info(f"First extraction for {table_name}, starting from {last_cursor}")

        query = f"""
            SELECT *
            FROM {table_name}
            WHERE {cursor_column} > %(last_cursor)s
            ORDER BY {cursor_column} ASC
            LIMIT %(batch_size)s
        """

        while True:
            rows = self._execute_query(query, {
                "last_cursor": last_cursor,
                "batch_size": batch_size
            })

            if not rows:
                break

            yield rows

            last_cursor = rows[-1][cursor_column]
            self.state_store.set_cursor(table_name, last_cursor)
            logger.info(f"Extracted {len(rows)} rows from {table_name}, cursor at {last_cursor}")

            if len(rows) < batch_size:
                break  # Last batch

    def extract_cdc(self, slot_name: str = "{{PROJECT_NAME}}_etl"):
        """
        CDC extraction using logical replication slot.
        Only applicable when {{DATABASE}} == 'postgresql'.
        """
        # See CDC Patterns section below
        pass


class APIExtractor:
    """Generic API extractor for SaaS data sources."""

    def __init__(self, api_config: dict, state_store):
        self.base_url = api_config["base_url"]
        self.api_key = api_config["api_key"]
        self.rate_limit = api_config.get("rate_limit_per_second", 10)
        self.state_store = state_store

    def extract_paginated(
        self,
        endpoint: str,
        params: dict = None,
        cursor_field: str = "created_at",
    ) -> Iterator[list[Dict[str, Any]]]:
        """
        Paginated API extraction with rate limiting and retry logic.
        Handles cursor-based and offset-based pagination.
        """
        last_cursor = self.state_store.get_cursor(endpoint)
        has_more = True

        while has_more:
            response = self._make_request(endpoint, {
                **(params or {}),
                "starting_after": last_cursor,
                "limit": 100,
            })

            records = response.get("data", [])
            has_more = response.get("has_more", False)

            if records:
                yield records
                last_cursor = records[-1]["id"]
                self.state_store.set_cursor(endpoint, last_cursor)
```

#### Loader Template (Python)

```python
"""
Loader for {{BI_WAREHOUSE}}
Handles bulk loading with staging table pattern.
"""

class WarehouseLoader:
    """Loads extracted data into {{BI_WAREHOUSE}}."""

    def load_batch(
        self,
        schema: str,
        table: str,
        rows: list[dict],
        mode: str = "upsert",  # "append", "upsert", "replace"
        primary_key: str = "id",
    ):
        """
        Load a batch of rows into the warehouse.

        For 'upsert' mode, uses staging table + MERGE pattern:
        1. Write rows to staging table
        2. MERGE staging into target (update existing, insert new)
        3. Drop staging table
        """
        staging_table = f"_staging_{table}_{int(datetime.utcnow().timestamp())}"

        try:
            # Step 1: Create staging table matching target schema
            self._create_staging_table(schema, staging_table, table)

            # Step 2: Bulk load into staging
            self._bulk_insert(schema, staging_table, rows)

            # Step 3: Merge into target
            if mode == "upsert":
                self._merge(schema, staging_table, table, primary_key)
            elif mode == "append":
                self._append(schema, staging_table, table)
            elif mode == "replace":
                self._replace(schema, staging_table, table)

        finally:
            # Step 4: Clean up staging
            self._drop_table(schema, staging_table)

    def _merge(self, schema, staging, target, primary_key):
        """MERGE/UPSERT pattern compatible with {{BI_WAREHOUSE}}."""
        merge_sql = f"""
            MERGE INTO {schema}.{target} AS t
            USING {schema}.{staging} AS s
            ON t.{primary_key} = s.{primary_key}
            WHEN MATCHED THEN UPDATE SET
                {{MERGE_UPDATE_COLUMNS}}
            WHEN NOT MATCHED THEN INSERT
                ({{MERGE_INSERT_COLUMNS}})
            VALUES
                ({{MERGE_INSERT_VALUES}});
        """
        self._execute(merge_sql)
```

#### Custom Pipeline Cost Considerations

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Compute (extraction) | ${{ETL_COMPUTE_COST}} | Lambda/Cloud Function/VM time |
| Compute (loading) | Included in warehouse cost | Uses warehouse compute |
| State store | $0–10 | S3/GCS for state files, or small DB |
| Monitoring | $0–50 | CloudWatch/Datadog/self-hosted |
| Developer time | {{ETL_DEVELOPER_HOURS}} hrs/month | Maintenance and incident response |
| **Total** | **${{ETL_TOTAL_COST}}/month + labor** | |

<!-- ENDIF -->

---

<!-- IF {{BI_ETL_TOOL}} == "stitch" -->

### Stitch Data Configuration

**Plan:** {{STITCH_PLAN}} (Standard | Advanced | Premium)

#### Integration Setup

| Integration | Source | Replication Method | Frequency | Row Estimate |
|-------------|--------|-------------------|-----------|--------------|
| {{DATABASE}} | {{DATABASE}} connector | Key-based Incremental | {{BI_REFRESH_CADENCE}} | {{STITCH_APP_ROWS}}/mo |
| {{BILLING_PROVIDER}} | SaaS connector | Key-based Incremental | 1 hour | {{STITCH_BILLING_ROWS}}/mo |
| {{ANALYTICS_PROVIDER}} | SaaS connector | Append-Only | 6 hours | {{STITCH_ANALYTICS_ROWS}}/mo |

#### Stitch Cost Model

Stitch charges by rows replicated per month.

| Tier | Rows Included | Additional Rows | Notes |
|------|--------------|-----------------|-------|
| Standard | 5M | $0.01/1K rows | Basic connectors |
| Advanced | 20M | $0.005/1K rows | CDC, advanced scheduling |
| Premium | 100M+ | Negotiated | Enterprise support |

**Estimated monthly rows for {{PROJECT_NAME}}:** {{STITCH_TOTAL_ROWS}}
**Estimated monthly cost:** ${{STITCH_MONTHLY_COST}}

<!-- ENDIF -->

---

## 4. CDC Patterns by Database

### Change Data Capture Strategy Selection

| {{DATABASE}} | Recommended CDC Method | Latency | Complexity | Prerequisites |
|--------------|----------------------|---------|------------|---------------|
| `postgresql` | Logical Replication (pgoutput / wal2json) | Near real-time (seconds) | Medium | `wal_level = logical` |
| `mysql` | Binary Log (binlog) replication | Near real-time (seconds) | Medium | `binlog_format = ROW` |
| `mongodb` | Change Streams | Near real-time (seconds) | Low | Replica set or sharded cluster |

---

<!-- IF {{DATABASE}} == "postgresql" -->

### PostgreSQL: Logical Replication

#### Prerequisites

```sql
-- Verify WAL level is set to logical
SHOW wal_level;  -- Must return 'logical'

-- If not, update postgresql.conf:
-- wal_level = logical
-- max_replication_slots = 10  (at least 1 per consumer)
-- max_wal_senders = 10

-- Create replication slot for ETL
SELECT pg_create_logical_replication_slot('{{PROJECT_NAME}}_etl', 'pgoutput');

-- Create publication for tables to replicate
CREATE PUBLICATION {{PROJECT_NAME}}_etl_pub
    FOR TABLE
        users,
        organizations,
        subscriptions,
        invoices,
        events,
        features,
        {{ADDITIONAL_CDC_TABLES}};

-- Verify publication
SELECT * FROM pg_publication_tables WHERE pubname = '{{PROJECT_NAME}}_etl_pub';
```

#### Replication Slot Monitoring

```sql
-- Monitor replication slot lag (CRITICAL: unmonitored slots can fill disk)
SELECT
    slot_name,
    slot_type,
    active,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)
    ) AS replication_lag,
    pg_size_pretty(
        pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn)
    ) AS confirmed_lag
FROM pg_replication_slots
WHERE slot_name = '{{PROJECT_NAME}}_etl';
```

**CRITICAL WARNING:** An inactive replication slot prevents WAL recycling. If your ETL consumer goes down and the slot stays active, WAL files will accumulate and can fill your disk within hours. Always monitor slot lag and set up alerting for:
- Slot inactive for > 15 minutes
- Replication lag > 1 GB
- WAL disk usage > 80%

#### pgoutput Consumption (for custom ETL)

```python
"""
PostgreSQL CDC consumer using psycopg2 logical replication.
Consumes changes from the {{PROJECT_NAME}}_etl slot.
"""
import psycopg2
from psycopg2.extras import LogicalReplicationConnection

def consume_changes(connection_string: str, slot_name: str = "{{PROJECT_NAME}}_etl"):
    conn = psycopg2.connect(
        connection_string,
        connection_factory=LogicalReplicationConnection
    )
    cursor = conn.cursor()
    cursor.start_replication(
        slot_name=slot_name,
        decode=True,
        options={"proto_version": "1", "publication_names": "{{PROJECT_NAME}}_etl_pub"}
    )

    def process_message(msg):
        """Process a single WAL message."""
        payload = msg.payload
        # Parse the pgoutput protocol message
        # Types: Begin (B), Relation (R), Insert (I), Update (U), Delete (D), Commit (C)

        # Route to appropriate handler
        if payload.startswith("I"):
            handle_insert(payload)
        elif payload.startswith("U"):
            handle_update(payload)
        elif payload.startswith("D"):
            handle_delete(payload)

        # Acknowledge the message to advance the replication slot
        msg.cursor.send_feedback(flush_lsn=msg.data_start)

    cursor.consume_stream(process_message)
```

<!-- ENDIF -->

---

<!-- IF {{DATABASE}} == "mysql" -->

### MySQL: Binary Log Replication

#### Prerequisites

```sql
-- Verify binlog is enabled and in ROW format
SHOW VARIABLES LIKE 'log_bin';              -- Must be ON
SHOW VARIABLES LIKE 'binlog_format';        -- Must be ROW
SHOW VARIABLES LIKE 'binlog_row_image';     -- Should be FULL

-- If not, update my.cnf:
-- [mysqld]
-- server-id = 1
-- log_bin = mysql-bin
-- binlog_format = ROW
-- binlog_row_image = FULL
-- expire_logs_days = 7
-- gtid_mode = ON
-- enforce_gtid_consistency = ON

-- Create replication user for ETL
CREATE USER '{{PROJECT_NAME}}_etl'@'%' IDENTIFIED BY '{{MYSQL_ETL_PASSWORD}}';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO '{{PROJECT_NAME}}_etl'@'%';
GRANT SELECT ON {{MYSQL_DATABASE}}.* TO '{{PROJECT_NAME}}_etl'@'%';
FLUSH PRIVILEGES;
```

#### Binlog Position Tracking

```sql
-- Get current binlog position (for initial sync starting point)
SHOW MASTER STATUS;

-- Monitor binlog lag
SHOW SLAVE STATUS\G
-- Key fields: Seconds_Behind_Master, Relay_Log_Space
```

#### Debezium Configuration (Kafka-based CDC)

```json
{
  "name": "{{PROJECT_NAME}}-mysql-cdc",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "{{MYSQL_HOST}}",
    "database.port": "3306",
    "database.user": "{{PROJECT_NAME}}_etl",
    "database.password": "{{MYSQL_ETL_PASSWORD}}",
    "database.server.id": "{{DEBEZIUM_SERVER_ID}}",
    "database.server.name": "{{PROJECT_NAME}}",
    "database.include.list": "{{MYSQL_DATABASE}}",
    "table.include.list": "{{MYSQL_DATABASE}}.users,{{MYSQL_DATABASE}}.subscriptions,{{MYSQL_DATABASE}}.events",
    "database.history.kafka.bootstrap.servers": "{{KAFKA_BOOTSTRAP_SERVERS}}",
    "database.history.kafka.topic": "{{PROJECT_NAME}}.schema-changes",
    "include.schema.changes": "true",
    "transforms": "route",
    "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.route.regex": "([^.]+)\\.([^.]+)\\.([^.]+)",
    "transforms.route.replacement": "raw_{{PROJECT_NAME}}.$3"
  }
}
```

<!-- ENDIF -->

---

<!-- IF {{DATABASE}} == "mongodb" -->

### MongoDB: Change Streams

#### Prerequisites

- MongoDB 3.6+ with replica set or sharded cluster
- `readAnyDatabase` role for the ETL user

```javascript
// Create ETL user with appropriate permissions
db.createUser({
  user: "{{PROJECT_NAME}}_etl",
  pwd: "{{MONGO_ETL_PASSWORD}}",
  roles: [
    { role: "read", db: "{{MONGO_DATABASE}}" },
    { role: "readAnyDatabase", db: "admin" }  // Required for change streams
  ]
});
```

#### Change Stream Consumer

```javascript
/**
 * MongoDB Change Stream consumer for {{PROJECT_NAME}}
 * Watches specified collections and forwards changes to the staging layer.
 */
const { MongoClient } = require('mongodb');

async function watchChanges() {
  const client = new MongoClient('{{MONGO_CONNECTION_STRING}}');
  await client.connect();

  const db = client.db('{{MONGO_DATABASE}}');

  // Watch specific collections
  const collections = ['users', 'subscriptions', 'events', 'organizations'];

  for (const collName of collections) {
    const collection = db.collection(collName);
    const changeStream = collection.watch(
      [
        // Filter for relevant operation types
        { $match: { operationType: { $in: ['insert', 'update', 'replace', 'delete'] } } }
      ],
      {
        fullDocument: 'updateLookup',  // Include full document on updates
        resumeAfter: getResumeToken(collName),  // Resume from last position
      }
    );

    changeStream.on('change', async (change) => {
      await processChange(collName, change);
      await saveResumeToken(collName, change._id);
    });

    changeStream.on('error', (error) => {
      logger.error(`Change stream error for ${collName}:`, error);
      // Implement exponential backoff retry
    });
  }
}
```

#### MongoDB-Specific Considerations

| Consideration | Impact | Mitigation |
|---------------|--------|------------|
| Schema-less documents | Fields can vary between documents | Define expected schema, handle missing fields with defaults |
| Nested documents | Requires flattening for warehouse | Flatten during staging transformation |
| ObjectId as primary key | Not compatible with warehouse surrogate keys | Map ObjectId to VARCHAR, generate surrogate keys |
| Arrays | Cannot directly map to columnar storage | Explode arrays into separate rows in staging |
| Change stream resume tokens | Must persist to survive restarts | Store in durable state (S3, database) |

<!-- ENDIF -->

---

## 5. Staging Layer Design

### Raw Landing Zone

The raw layer stores exact copies of source data with minimal transformation. Every row includes extraction metadata.

```sql
-- Raw table template (one per source table)
CREATE TABLE raw_{{PROJECT_NAME}}.raw_{source}_{table} (
    -- Extraction metadata (added by ETL)
    _etl_extracted_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    _etl_source         VARCHAR(50) NOT NULL,   -- 'app_db', 'stripe', 'posthog'
    _etl_batch_id       VARCHAR(64) NOT NULL,   -- Unique batch identifier
    _etl_operation       VARCHAR(10),            -- 'insert', 'update', 'delete' (CDC only)
    _etl_sequence        BIGINT,                 -- Ordering within batch

    -- Source data columns (preserved exactly as extracted)
    -- These mirror the source schema 1:1
    {{RAW_TABLE_COLUMNS}}
);

-- Index on extraction timestamp for freshness monitoring
CREATE INDEX idx_raw_{source}_{table}_extracted
    ON raw_{{PROJECT_NAME}}.raw_{source}_{table}(_etl_extracted_at);
```

### Deduplication

CDC and incremental extraction can produce duplicates. The staging layer resolves them.

```sql
-- Deduplication pattern: keep latest version of each record
-- Used in staging models (dbt or manual SQL)
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY id
            ORDER BY _etl_extracted_at DESC, _etl_sequence DESC
        ) AS _row_rank
    FROM raw_{{PROJECT_NAME}}.raw_{source}_{table}
    WHERE _etl_extracted_at > '{{LAST_FULL_REFRESH_DATE}}'
)
SELECT * EXCEPT (_row_rank)
FROM ranked
WHERE _row_rank = 1;
```

### Schema Evolution Handling

Source schemas change over time. The pipeline must handle this gracefully.

| Change Type | Detection | Handling Strategy | Example |
|-------------|-----------|-------------------|---------|
| New column added | Schema comparison on each run | Auto-add column with NULL default | Source adds `phone_number` to users |
| Column removed | Schema comparison | Keep column, stop populating (NULL fill) | Source drops `legacy_id` |
| Column type changed | Type mismatch on load | Alert, manual review required | `age` changed from INT to VARCHAR |
| Column renamed | Detected as drop + add | Alert, manual mapping update required | `name` renamed to `display_name` |
| New table added | Schema comparison | Auto-create raw table, alert for staging model | New `audit_logs` table |
| Table removed | Source returns empty/error | Alert, stop syncing, retain historical data | `legacy_features` dropped |

```python
# Schema evolution detector
class SchemaEvolutionHandler:
    """Detects and handles schema changes between extraction runs."""

    def detect_changes(self, source_schema: dict, warehouse_schema: dict) -> list:
        changes = []

        source_cols = set(source_schema.keys())
        warehouse_cols = set(warehouse_schema.keys())

        # New columns
        for col in source_cols - warehouse_cols:
            changes.append({
                "type": "column_added",
                "column": col,
                "source_type": source_schema[col],
                "action": "auto_add",
                "severity": "info",
            })

        # Removed columns
        for col in warehouse_cols - source_cols:
            if not col.startswith("_etl_"):  # Skip ETL metadata columns
                changes.append({
                    "type": "column_removed",
                    "column": col,
                    "action": "null_fill",
                    "severity": "warning",
                })

        # Type changes
        for col in source_cols & warehouse_cols:
            if source_schema[col] != warehouse_schema[col]:
                changes.append({
                    "type": "type_changed",
                    "column": col,
                    "from_type": warehouse_schema[col],
                    "to_type": source_schema[col],
                    "action": "alert_manual_review",
                    "severity": "critical",
                })

        return changes
```

---

## 6. Extraction Scheduling

### Frequency by Data Source Type

| Data Domain | Source Examples | Extraction Frequency | Rationale | SLA (max staleness) |
|-------------|---------------|---------------------|-----------|---------------------|
| **Billing events** | {{BILLING_PROVIDER}} webhooks | Real-time (webhook) + hourly (reconciliation) | Revenue accuracy is mission-critical | 1 hour |
| **Application events** | {{ANALYTICS_PROVIDER}}, custom events | Hourly or real-time (CDC) | Product metrics need timely data | 4 hours |
| **User/account data** | {{DATABASE}} users, organizations | {{BI_REFRESH_CADENCE}} | Dashboard segmentation needs current data | 4 hours |
| **Subscription state** | {{BILLING_PROVIDER}} subscriptions | Real-time (webhook) + hourly | MRR calculations need up-to-date state | 1 hour |
| **Support tickets** | {{SUPPORT_TOOL}} | Every 4 hours | CX metrics tolerate some delay | 8 hours |
| **CRM data** | {{CRM_TOOL}} | Daily | Sales pipeline metrics are reviewed daily | 24 hours |
| **Marketing data** | Google Analytics, email platforms | Daily | Marketing metrics reviewed in morning standups | 24 hours |
| **Financial reconciliation** | Bank feeds, payment processors | Daily | Accounting requires daily reconciliation | 24 hours |
| **Manual/reference data** | Google Sheets, CSV uploads | On-demand / weekly | Changes infrequently | 7 days |

### Schedule Configuration

```yaml
# Pipeline schedule configuration
schedules:
  realtime:
    sources:
      - name: "{{DATABASE}}_cdc"
        type: cdc
        method: logical_replication
        slot: "{{PROJECT_NAME}}_etl"
        tables: [users, organizations, subscriptions, features]

  hourly:
    cron: "0 * * * *"  # Every hour at :00
    sources:
      - name: "{{BILLING_PROVIDER}}_reconciliation"
        type: api
        endpoint: "/v1/charges"
        lookback_hours: 2  # Overlap for late-arriving data
      - name: "{{ANALYTICS_PROVIDER}}_events"
        type: api
        endpoint: "/batch/events"
        lookback_hours: 2

  every_4_hours:
    cron: "0 */4 * * *"
    sources:
      - name: "{{SUPPORT_TOOL}}_tickets"
        type: api
        endpoint: "/api/v2/tickets"
        lookback_hours: 5

  daily:
    cron: "0 3 * * *"  # 3 AM UTC (off-peak)
    sources:
      - name: "{{CRM_TOOL}}_full"
        type: api
        endpoint: "/api/v1/contacts"
        mode: full_refresh  # CRM data is small enough
      - name: "google_analytics"
        type: api
        endpoint: "/v4/reports:batchGet"
        lookback_days: 3  # GA data can be revised for 72 hours
      - name: "{{EMAIL_PROVIDER}}_campaigns"
        type: api
        endpoint: "/campaigns"
        lookback_days: 2
```

---

## 7. Monitoring

### Freshness Monitoring

Every source table has a freshness SLA. If the latest row is older than the threshold, an alert fires.

| Table | Source | Expected Freshness | Alert Threshold | Check Query |
|-------|--------|-------------------|-----------------|-------------|
| `raw_app_users` | {{DATABASE}} | {{BI_REFRESH_CADENCE}} | 2x cadence | `SELECT MAX(_etl_extracted_at) FROM raw_{{PROJECT_NAME}}.raw_app_users` |
| `raw_billing_charges` | {{BILLING_PROVIDER}} | 1 hour | 2 hours | `SELECT MAX(_etl_extracted_at) FROM raw_{{PROJECT_NAME}}.raw_billing_charges` |
| `raw_analytics_events` | {{ANALYTICS_PROVIDER}} | 1 hour | 4 hours | `SELECT MAX(_etl_extracted_at) FROM raw_{{PROJECT_NAME}}.raw_analytics_events` |
| `raw_crm_contacts` | {{CRM_TOOL}} | 24 hours | 36 hours | `SELECT MAX(_etl_extracted_at) FROM raw_{{PROJECT_NAME}}.raw_crm_contacts` |

```sql
-- Freshness check query (run on schedule, alert if threshold exceeded)
WITH freshness AS (
    SELECT
        'raw_app_users' AS table_name,
        MAX(_etl_extracted_at) AS last_loaded,
        CURRENT_TIMESTAMP - MAX(_etl_extracted_at) AS staleness,
        INTERVAL '{{BI_REFRESH_CADENCE_INTERVAL}}' * 2 AS alert_threshold
    FROM raw_{{PROJECT_NAME}}.raw_app_users

    UNION ALL

    SELECT
        'raw_billing_charges',
        MAX(_etl_extracted_at),
        CURRENT_TIMESTAMP - MAX(_etl_extracted_at),
        INTERVAL '2 hours'
    FROM raw_{{PROJECT_NAME}}.raw_billing_charges

    -- ... additional tables
)
SELECT *
FROM freshness
WHERE staleness > alert_threshold;
```

### Row Count Anomaly Detection

```sql
-- Daily row count tracking for anomaly detection
-- Alert if today's count deviates > 50% from the 7-day average
WITH daily_counts AS (
    SELECT
        DATE(_etl_extracted_at) AS load_date,
        COUNT(*) AS row_count
    FROM raw_{{PROJECT_NAME}}.raw_app_events
    WHERE _etl_extracted_at > CURRENT_DATE - INTERVAL '14 days'
    GROUP BY DATE(_etl_extracted_at)
),
stats AS (
    SELECT
        load_date,
        row_count,
        AVG(row_count) OVER (
            ORDER BY load_date
            ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
        ) AS avg_7d,
        STDDEV(row_count) OVER (
            ORDER BY load_date
            ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
        ) AS stddev_7d
    FROM daily_counts
)
SELECT
    load_date,
    row_count,
    avg_7d,
    ROUND((row_count - avg_7d) / NULLIF(stddev_7d, 0), 2) AS z_score,
    CASE
        WHEN row_count < avg_7d * 0.5 THEN 'CRITICAL: Row count dropped > 50%'
        WHEN row_count > avg_7d * 2.0 THEN 'WARNING: Row count spiked > 200%'
        WHEN row_count = 0 THEN 'CRITICAL: Zero rows loaded'
        ELSE 'OK'
    END AS alert_status
FROM stats
WHERE load_date = CURRENT_DATE;
```

### Schema Drift Alerts

```sql
-- Detect columns that exist in source but not in warehouse (or vice versa)
-- Run after each extraction, before loading
-- Implementation depends on {{BI_WAREHOUSE}} metadata tables

-- Snowflake example:
SELECT
    c.TABLE_NAME,
    c.COLUMN_NAME,
    c.DATA_TYPE,
    'column_in_warehouse_not_in_source' AS drift_type
FROM INFORMATION_SCHEMA.COLUMNS c
WHERE c.TABLE_SCHEMA = 'RAW_{{PROJECT_NAME}}'
  AND c.COLUMN_NAME NOT LIKE '_etl_%'
  AND c.COLUMN_NAME NOT IN (
      SELECT column_name FROM source_schema_snapshot
      WHERE table_name = c.TABLE_NAME
  );
```

---

## 8. Error Handling

### Dead Letter Queue (DLQ)

Records that fail extraction, transformation, or loading are routed to a dead letter queue for investigation.

```sql
-- Dead letter queue table
CREATE TABLE raw_{{PROJECT_NAME}}._dead_letter_queue (
    dlq_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source          VARCHAR(100) NOT NULL,     -- 'app_db.users', 'stripe.charges'
    pipeline_stage  VARCHAR(20) NOT NULL,      -- 'extract', 'load', 'transform'
    batch_id        VARCHAR(64) NOT NULL,
    error_type      VARCHAR(100) NOT NULL,     -- 'type_mismatch', 'null_violation', 'timeout'
    error_message   TEXT NOT NULL,
    record_payload  JSONB,                     -- The offending record (if available)
    retry_count     INT NOT NULL DEFAULT 0,
    max_retries     INT NOT NULL DEFAULT 3,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'retried', 'resolved', 'abandoned'
    resolved_at     TIMESTAMPTZ,
    resolved_by     VARCHAR(100)
);
```

### Retry Strategy

| Error Type | Retry Strategy | Max Retries | Backoff | Escalation |
|------------|---------------|-------------|---------|------------|
| Connection timeout | Exponential backoff | 5 | 30s, 60s, 120s, 240s, 480s | Alert after all retries exhausted |
| Rate limit (429) | Respect Retry-After header | 10 | Per Retry-After header | Alert if sustained > 30 min |
| Authentication failure (401/403) | No retry (credential issue) | 0 | N/A | Immediate alert to {{BI_ALERT_CHANNEL}} |
| Schema mismatch | No auto-retry | 0 | N/A | Alert, route to DLQ, continue pipeline |
| Partial batch failure | Retry failed records only | 3 | 60s between retries | DLQ for persistent failures |
| Warehouse unavailable | Exponential backoff | 10 | 60s, 120s, 240s... | Alert after 5 min downtime |

### Alerting Configuration

```yaml
# Alert routing configuration
alerts:
  channels:
    critical:
      - type: slack
        channel: "{{BI_ALERT_CHANNEL}}"
      - type: pagerduty
        service: "{{PAGERDUTY_SERVICE_ID}}"
    warning:
      - type: slack
        channel: "{{BI_ALERT_CHANNEL}}"
    info:
      - type: slack
        channel: "{{BI_INFO_CHANNEL}}"

  rules:
    - name: "Pipeline complete failure"
      condition: "pipeline_status == 'failed' AND retry_count >= max_retries"
      severity: critical
      message: "ETL pipeline for {{PROJECT_NAME}} has failed after all retries. Source: {source}, Error: {error_message}"

    - name: "Data freshness SLA breach"
      condition: "staleness > alert_threshold"
      severity: critical
      message: "Data freshness SLA breached for {table_name}. Staleness: {staleness}, Threshold: {alert_threshold}"

    - name: "Row count anomaly"
      condition: "z_score > 3 OR z_score < -3"
      severity: warning
      message: "Row count anomaly detected for {table_name}. Today: {row_count}, 7-day avg: {avg_7d}, Z-score: {z_score}"

    - name: "Schema drift detected"
      condition: "drift_type IS NOT NULL"
      severity: warning
      message: "Schema drift detected in {table_name}: {drift_type} for column {column_name}"

    - name: "DLQ records accumulating"
      condition: "pending_dlq_count > 100"
      severity: warning
      message: "Dead letter queue has {pending_dlq_count} pending records. Oldest: {oldest_dlq_age}"
```

---

## 9. Orchestration

<!-- IF {{BI_ORCHESTRATOR}} == "airflow" -->

### Apache Airflow

**Deployment:** {{AIRFLOW_DEPLOYMENT}} (Managed: MWAA / Cloud Composer / Astronomer | Self-hosted)

#### DAG Template

```python
"""
{{PROJECT_NAME}} ETL Pipeline DAG
Orchestrates extraction from all sources, loading into {{BI_WAREHOUSE}},
and triggers {{BI_TRANSFORM_TOOL}} transformations.

Schedule: {{BI_REFRESH_CADENCE}}
Owner: {{BI_METRIC_OWNER_DEFAULT}}
"""
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
from airflow.utils.task_group import TaskGroup

default_args = {
    "owner": "{{BI_METRIC_OWNER_DEFAULT}}",
    "depends_on_past": False,
    "email": ["{{BI_ALERT_EMAIL}}"],
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "max_retry_delay": timedelta(minutes=30),
    "execution_timeout": timedelta(hours=2),
}

with DAG(
    dag_id="{{PROJECT_NAME}}_etl_pipeline",
    default_args=default_args,
    description="Full ETL pipeline for {{PROJECT_NAME}} data warehouse",
    schedule_interval="{{AIRFLOW_SCHEDULE_INTERVAL}}",  # e.g., "@hourly", "0 */4 * * *"
    start_date=datetime(2025, 1, 1),
    catchup=False,
    max_active_runs=1,
    tags=["etl", "{{PROJECT_NAME}}", "production"],
) as dag:

    # ─── EXTRACT ────────────────────────────────────────
    with TaskGroup("extract") as extract_group:
        extract_app_db = PythonOperator(
            task_id="extract_app_db",
            python_callable=extract_from_database,
            op_kwargs={
                "source": "{{DATABASE}}",
                "tables": {{ETL_APP_TABLES}},
                "mode": "incremental",
            },
        )

        extract_billing = PythonOperator(
            task_id="extract_billing",
            python_callable=extract_from_api,
            op_kwargs={
                "source": "{{BILLING_PROVIDER}}",
                "endpoints": ["charges", "subscriptions", "invoices", "customers"],
            },
        )

        extract_analytics = PythonOperator(
            task_id="extract_analytics",
            python_callable=extract_from_api,
            op_kwargs={
                "source": "{{ANALYTICS_PROVIDER}}",
                "endpoints": ["events", "persons"],
            },
        )

        # All extractions run in parallel
        [extract_app_db, extract_billing, extract_analytics]

    # ─── STAGE ──────────────────────────────────────────
    with TaskGroup("stage") as stage_group:
        deduplicate = PythonOperator(
            task_id="deduplicate_raw",
            python_callable=run_deduplication,
            op_kwargs={"schema": "raw_{{PROJECT_NAME}}"},
        )

        schema_check = PythonOperator(
            task_id="schema_drift_check",
            python_callable=check_schema_drift,
            op_kwargs={"schema": "raw_{{PROJECT_NAME}}"},
        )

        deduplicate >> schema_check

    # ─── TRANSFORM ──────────────────────────────────────
    transform = BashOperator(
        task_id="dbt_run",
        bash_command=(
            "cd /opt/dbt/{{PROJECT_NAME}} && "
            "dbt run --profiles-dir /opt/dbt/profiles --target prod"
        ),
    )

    # ─── TEST ───────────────────────────────────────────
    test = BashOperator(
        task_id="dbt_test",
        bash_command=(
            "cd /opt/dbt/{{PROJECT_NAME}} && "
            "dbt test --profiles-dir /opt/dbt/profiles --target prod"
        ),
    )

    # ─── FRESHNESS CHECK ────────────────────────────────
    freshness_check = PythonOperator(
        task_id="freshness_check",
        python_callable=check_freshness_slas,
    )

    # ─── NOTIFY ─────────────────────────────────────────
    notify_success = SlackWebhookOperator(
        task_id="notify_success",
        slack_webhook_conn_id="slack_bi",
        message=":white_check_mark: {{PROJECT_NAME}} ETL pipeline completed successfully. Duration: {{ task_instance.duration }}s",
        trigger_rule="all_success",
    )

    notify_failure = SlackWebhookOperator(
        task_id="notify_failure",
        slack_webhook_conn_id="slack_bi",
        message=":rotating_light: {{PROJECT_NAME}} ETL pipeline FAILED. Check Airflow logs.",
        trigger_rule="one_failed",
    )

    # ─── DEPENDENCIES ───────────────────────────────────
    extract_group >> stage_group >> transform >> test >> freshness_check
    freshness_check >> [notify_success, notify_failure]
```

<!-- ENDIF -->

---

<!-- IF {{BI_ORCHESTRATOR}} == "dagster" -->

### Dagster

**Deployment:** {{DAGSTER_DEPLOYMENT}} (Dagster Cloud | Self-hosted)

#### Asset-Based Pipeline

```python
"""
{{PROJECT_NAME}} ETL Pipeline — Dagster Assets
Uses Dagster's asset-based approach for lineage-aware orchestration.
"""
from dagster import (
    asset, AssetIn, DailyPartitionsDefinition, FreshnessPolicy,
    AutoMaterializePolicy, Definitions, ScheduleDefinition,
)

daily_partitions = DailyPartitionsDefinition(start_date="2025-01-01")

@asset(
    group_name="raw",
    partitions_def=daily_partitions,
    freshness_policy=FreshnessPolicy(maximum_lag_minutes={{BI_FRESHNESS_LAG_MINUTES}}),
    auto_materialize_policy=AutoMaterializePolicy.eager(),
)
def raw_app_users(context):
    """Extract users table from {{DATABASE}}."""
    partition_date = context.asset_partition_key_for_output()
    return extract_table("users", since=partition_date)

@asset(
    group_name="raw",
    partitions_def=daily_partitions,
    freshness_policy=FreshnessPolicy(maximum_lag_minutes=60),
)
def raw_billing_charges(context):
    """Extract charges from {{BILLING_PROVIDER}}."""
    partition_date = context.asset_partition_key_for_output()
    return extract_api("{{BILLING_PROVIDER}}", "charges", since=partition_date)

@asset(
    group_name="staging",
    ins={"raw_users": AssetIn("raw_app_users")},
    partitions_def=daily_partitions,
)
def stg_app_users(context, raw_users):
    """Clean, deduplicate, and type-cast users."""
    return transform_staging(raw_users, dedup_key="id", cursor="updated_at")

@asset(
    group_name="analytics",
    ins={
        "users": AssetIn("stg_app_users"),
        "subscriptions": AssetIn("stg_billing_subscriptions"),
    },
    partitions_def=daily_partitions,
)
def dim_users(context, users, subscriptions):
    """Build user dimension with SCD Type 2."""
    return build_dimension(users, subscriptions, scd_type=2)

@asset(
    group_name="reporting",
    ins={"subscriptions": AssetIn("fact_subscriptions")},
    freshness_policy=FreshnessPolicy(maximum_lag_minutes=120),
)
def rpt_mrr_waterfall(context, subscriptions):
    """MRR waterfall for {{BI_PLATFORM}} dashboards."""
    return build_mrr_waterfall(subscriptions)

# Schedule
etl_schedule = ScheduleDefinition(
    name="{{PROJECT_NAME}}_etl_schedule",
    cron_schedule="{{DAGSTER_CRON_SCHEDULE}}",
    target="*",  # All assets
)
```

<!-- ENDIF -->

---

<!-- IF {{BI_ORCHESTRATOR}} == "prefect" -->

### Prefect

**Deployment:** {{PREFECT_DEPLOYMENT}} (Prefect Cloud | Self-hosted)

#### Flow Definition

```python
"""
{{PROJECT_NAME}} ETL Pipeline — Prefect Flow
"""
from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(
    retries=3,
    retry_delay_seconds=[60, 120, 300],
    cache_key_fn=task_input_hash,
    cache_expiration=timedelta(hours=1),
    tags=["extract", "{{DATABASE}}"],
)
def extract_app_db(tables: list[str], mode: str = "incremental"):
    """Extract tables from {{DATABASE}}."""
    results = {}
    for table in tables:
        results[table] = run_extraction(table, mode=mode)
    return results

@task(retries=3, retry_delay_seconds=60, tags=["extract", "api"])
def extract_billing():
    """Extract data from {{BILLING_PROVIDER}}."""
    return run_api_extraction("{{BILLING_PROVIDER}}")

@task(retries=3, retry_delay_seconds=60, tags=["extract", "api"])
def extract_analytics():
    """Extract data from {{ANALYTICS_PROVIDER}}."""
    return run_api_extraction("{{ANALYTICS_PROVIDER}}")

@task(tags=["transform"])
def run_dbt():
    """Run dbt transformations."""
    import subprocess
    result = subprocess.run(
        ["dbt", "run", "--profiles-dir", "/opt/dbt/profiles", "--target", "prod"],
        cwd="/opt/dbt/{{PROJECT_NAME}}",
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise Exception(f"dbt run failed: {result.stderr}")
    return result.stdout

@task(tags=["test"])
def run_dbt_tests():
    """Run dbt tests."""
    import subprocess
    result = subprocess.run(
        ["dbt", "test", "--profiles-dir", "/opt/dbt/profiles", "--target", "prod"],
        cwd="/opt/dbt/{{PROJECT_NAME}}",
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise Exception(f"dbt test failed: {result.stderr}")
    return result.stdout

@flow(
    name="{{PROJECT_NAME}}_etl",
    description="Full ETL pipeline for {{PROJECT_NAME}}",
    retries=1,
    retry_delay_seconds=300,
)
def etl_pipeline():
    # Extraction (parallel)
    app_data = extract_app_db(tables={{ETL_APP_TABLES}})
    billing_data = extract_billing()
    analytics_data = extract_analytics()

    # Wait for all extractions, then transform
    dbt_result = run_dbt(wait_for=[app_data, billing_data, analytics_data])

    # Test after transform
    test_result = run_dbt_tests(wait_for=[dbt_result])

    return test_result

if __name__ == "__main__":
    etl_pipeline()
```

<!-- ENDIF -->

---

<!-- IF {{BI_ORCHESTRATOR}} == "cron" -->

### Cron-Based Orchestration

> **When cron is appropriate:** For teams with < 5 data sources, no complex dependencies, and data engineers who prefer simplicity over features. Migrate to Airflow/Dagster/Prefect when you need retries, dependency graphs, backfills, or monitoring beyond log files.

#### Crontab Configuration

```bash
# {{PROJECT_NAME}} ETL Pipeline
# Managed by: {{BI_METRIC_OWNER_DEFAULT}}
# Last updated: {{LAST_UPDATED_DATE}}

# ─── Hourly extractions ────────────────────────────────
0 * * * *   {{ETL_USER}}   /opt/etl/{{PROJECT_NAME}}/extract.sh --source app_db --mode incremental >> /var/log/etl/extract_app.log 2>&1
5 * * * *   {{ETL_USER}}   /opt/etl/{{PROJECT_NAME}}/extract.sh --source {{BILLING_PROVIDER}} >> /var/log/etl/extract_billing.log 2>&1
10 * * * *  {{ETL_USER}}   /opt/etl/{{PROJECT_NAME}}/extract.sh --source {{ANALYTICS_PROVIDER}} >> /var/log/etl/extract_analytics.log 2>&1

# ─── Transformations (after extraction) ─────────────────
30 * * * *  {{ETL_USER}}   cd /opt/dbt/{{PROJECT_NAME}} && dbt run --target prod >> /var/log/etl/dbt_run.log 2>&1
45 * * * *  {{ETL_USER}}   cd /opt/dbt/{{PROJECT_NAME}} && dbt test --target prod >> /var/log/etl/dbt_test.log 2>&1

# ─── Daily extractions (3 AM UTC) ──────────────────────
0 3 * * *   {{ETL_USER}}   /opt/etl/{{PROJECT_NAME}}/extract.sh --source crm --mode full >> /var/log/etl/extract_crm.log 2>&1
0 3 * * *   {{ETL_USER}}   /opt/etl/{{PROJECT_NAME}}/extract.sh --source google_analytics >> /var/log/etl/extract_ga.log 2>&1

# ─── Freshness check (every 30 minutes) ─────────────────
*/30 * * * * {{ETL_USER}}  /opt/etl/{{PROJECT_NAME}}/check_freshness.sh >> /var/log/etl/freshness.log 2>&1

# ─── Log rotation (daily at midnight) ───────────────────
0 0 * * *   root           /usr/sbin/logrotate /etc/logrotate.d/etl
```

#### Wrapper Script with Error Handling

```bash
#!/bin/bash
# /opt/etl/{{PROJECT_NAME}}/extract.sh
# Generic extraction wrapper with error handling and alerting

set -euo pipefail

SOURCE="${1:?'Source required (--source app_db)'}"
MODE="${2:-incremental}"
LOCK_FILE="/tmp/etl_${SOURCE}.lock"
LOG_DIR="/var/log/etl"
ALERT_WEBHOOK="{{SLACK_WEBHOOK_URL}}"

# Prevent concurrent runs
if [ -f "$LOCK_FILE" ]; then
    LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$LOCK_FILE") ))
    if [ $LOCK_AGE -gt 7200 ]; then  # Stale lock (> 2 hours)
        echo "WARNING: Removing stale lock file (age: ${LOCK_AGE}s)"
        rm -f "$LOCK_FILE"
    else
        echo "ERROR: Pipeline already running for $SOURCE (lock age: ${LOCK_AGE}s)"
        exit 1
    fi
fi

trap 'rm -f "$LOCK_FILE"' EXIT
touch "$LOCK_FILE"

# Run extraction
START_TIME=$(date +%s)
if python3 /opt/etl/{{PROJECT_NAME}}/run_extract.py --source "$SOURCE" --mode "$MODE"; then
    DURATION=$(( $(date +%s) - START_TIME ))
    echo "SUCCESS: $SOURCE extraction completed in ${DURATION}s"
else
    DURATION=$(( $(date +%s) - START_TIME ))
    echo "FAILED: $SOURCE extraction failed after ${DURATION}s"
    # Alert via Slack
    curl -s -X POST "$ALERT_WEBHOOK" \
        -H 'Content-type: application/json' \
        -d "{\"text\":\"ETL FAILURE: $SOURCE extraction failed after ${DURATION}s. Check logs at $LOG_DIR\"}"
    exit 1
fi
```

<!-- ENDIF -->

---

## 10. Cost Management

### Per-Tool Pricing Comparison

| Tool | Pricing Model | Startup (< 10GB) | Growth (10-100GB) | Scale (100GB-1TB) | Enterprise (1TB+) |
|------|--------------|-------------------|--------------------|--------------------|---------------------|
| **Fivetran** | MAR (Monthly Active Rows) | Free–$60/mo | $60–600/mo | $600–3,000/mo | $3,000+/mo |
| **Airbyte Cloud** | Credits (rows synced) | Free–$30/mo | $30–300/mo | $300–1,500/mo | $1,500+/mo |
| **Airbyte Self-Hosted** | Infrastructure only | $50/mo (VM) | $100/mo (VM) | $300/mo (K8s) | $500+/mo (K8s) |
| **Stitch** | Rows replicated | $100/mo base | $100–500/mo | $500–2,000/mo | Custom |
| **Custom** | Infrastructure + labor | $0–20/mo | $20–100/mo + labor | $100–300/mo + labor | $300+/mo + labor |

### Optimization Strategies

1. **Sync only what you need** — Exclude tables and columns that are not used in any dashboard or metric
2. **Use incremental syncs** — Full refresh only for small reference tables
3. **Reduce sync frequency for non-critical sources** — Marketing data does not need real-time sync
4. **Consolidate sources** — If multiple environments sync the same schema, sync production only
5. **Monitor MAR/credit usage** — Set up billing alerts at 50%, 75%, 90% of budget
6. **Evaluate self-hosting** — At > $1,000/mo in managed ETL costs, self-hosted Airbyte may be cheaper
7. **Archive historical data** — Move data older than {{BI_DATA_RETENTION_MONTHS}} months to cold storage

---

## 11. Disaster Recovery

### Pipeline Replay

When data is missing or incorrect, replay the pipeline from a known-good state.

#### Backfill Strategy

| Scenario | Strategy | Duration Estimate | Risk |
|----------|----------|-------------------|------|
| Missing single batch | Re-run extraction for specific time window | Minutes | Low |
| Corrupted staging data | Drop staging table, re-run from raw | 30 min – 2 hours | Low |
| Corrupted raw data | Re-extract from source (within source retention) | 1 – 4 hours | Medium |
| Source data retroactively changed | Full re-extraction + re-transformation | 2 – 8 hours | Medium |
| Complete warehouse rebuild | Full extraction from all sources + full dbt run | 4 – 24 hours | High |

#### Backfill Commands

```bash
# Backfill a specific date range for a single source
# Custom ETL:
python3 /opt/etl/{{PROJECT_NAME}}/run_extract.py \
    --source {{DATABASE}} \
    --mode backfill \
    --start-date 2025-06-01 \
    --end-date 2025-06-15

# Airbyte: trigger manual sync with reset
# airbyte API call to reset connection state and re-sync

# Fivetran: historical sync
# Fivetran dashboard > Connector > History > Re-sync from date

# dbt: backfill specific models
cd /opt/dbt/{{PROJECT_NAME}}
dbt run --select fact_events --vars '{"backfill_start": "2025-06-01", "backfill_end": "2025-06-15"}'

# dbt: full refresh (rebuild from scratch, ignoring incremental logic)
dbt run --full-refresh --select staging_{{PROJECT_NAME}}+ --target prod
```

### Recovery Time Objectives

| Component | RTO | RPO | Recovery Method |
|-----------|-----|-----|-----------------|
| ETL pipeline (code) | 15 min | 0 | Redeploy from Git |
| ETL pipeline (state) | 30 min | Last checkpoint | Restore state from backup, re-extract overlap |
| Raw layer | 2 hours | Source retention window | Re-extract from source systems |
| Staging layer | 1 hour | Last raw load | Re-run staging transforms |
| Analytics layer | 2 hours | Last staging load | Re-run dbt models |
| Reporting layer | 30 min | Last analytics build | Re-run reporting views |
| BI platform (dashboards) | 1 hour | Last export | Restore from dashboard backup / Git |

---

## Checklist

- [ ] Data source inventory completed with extraction methods and frequencies
- [ ] ETL tool selected and configured: {{BI_ETL_TOOL}}
- [ ] CDC configured for {{DATABASE}} (if applicable)
- [ ] Raw landing zone created with ETL metadata columns
- [ ] Deduplication logic implemented in staging layer
- [ ] Schema evolution detection and handling configured
- [ ] Extraction schedule defined for all sources
- [ ] Freshness monitoring configured with SLA thresholds
- [ ] Row count anomaly detection active
- [ ] Schema drift alerting configured
- [ ] Dead letter queue created for failed records
- [ ] Retry strategies defined per error type
- [ ] Alerting configured and routed to {{BI_ALERT_CHANNEL}}
- [ ] Orchestration tool configured: {{BI_ORCHESTRATOR}}
- [ ] DAG / flow / schedule deployed and tested
- [ ] Cost baseline established and budget alerts configured
- [ ] Backfill procedure documented and tested
- [ ] Disaster recovery runbook reviewed by team
