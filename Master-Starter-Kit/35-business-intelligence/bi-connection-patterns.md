# BI Connection Patterns

> The connection between your data warehouse and your BI platform is the last mile of your data infrastructure. Get it wrong and dashboards time out, credentials leak, or your production database buckles under analytical query load. This guide covers connection architecture, per-platform setup, warehouse compatibility, performance tuning, and the security configurations that compliance auditors actually check.

---

## Connection Architecture Overview

There are three fundamental patterns for connecting a BI platform to your data. Each has distinct trade-offs for latency, cost, performance, and governance.

### Pattern 1: Direct Query

The BI platform sends SQL queries directly to the warehouse and renders results in real time. No data is stored in the BI platform.

**How it works:** User opens dashboard → BI platform generates SQL → SQL executes on warehouse → results stream back → BI platform renders visualization.

**Advantages:**
- Data is always current (no stale cache)
- No data duplication (single source of truth remains the warehouse)
- Simpler architecture (no ETL into the BI tool)

**Disadvantages:**
- Dashboard load times depend on warehouse query performance
- Concurrent dashboard viewers generate concurrent warehouse queries (cost and performance implications)
- BI platform must have network access to the warehouse at all times

**Best for:** Teams at Governed maturity or above with well-optimized warehouse tables and predictable query patterns.

**Used by:** Metabase, Looker, Preset, Redash (all default to direct query). Tableau (via Live Connection mode). PowerBI (via DirectQuery mode).

---

### Pattern 2: Extract / Import

The BI platform periodically extracts data from the warehouse and stores a snapshot locally. Queries run against the local snapshot, not the warehouse.

**How it works:** Scheduled job runs → BI platform queries warehouse → results cached/imported into BI platform's storage → user queries hit local cache.

**Advantages:**
- Dashboard load times are fast and consistent (queries hit optimized local storage)
- Warehouse is not loaded by dashboard viewers (cost savings on compute)
- Dashboards remain functional even if the warehouse is temporarily unavailable

**Disadvantages:**
- Data is stale between refresh intervals (minutes to hours depending on schedule)
- Data duplication (BI platform stores a copy of the data)
- Storage limits in the BI platform can constrain dataset size

**Best for:** High-traffic dashboards viewed by many concurrent users, or scenarios where warehouse compute costs need to be controlled.

**Used by:** Tableau (via Extracts, the default mode). PowerBI (via Import mode, the default). Metabase (via cached questions with configurable TTL).

---

### Pattern 3: Semantic Layer

A modeling layer sits between the warehouse and the BI platform, defining metrics, dimensions, relationships, and access controls. The BI platform queries the semantic layer, which translates requests into optimized warehouse SQL.

**How it works:** User explores data in BI tool → BI tool sends request to semantic layer → semantic layer generates optimized SQL based on metric definitions → SQL executes on warehouse → results return through semantic layer → BI tool renders.

**Advantages:**
- Metric definitions are centralized and governed (one definition of "MRR" used everywhere)
- The semantic layer can optimize query generation (aggregate awareness, caching, join pruning)
- Row-level security and data access policies enforced at the semantic layer, not per-dashboard

**Disadvantages:**
- Adds architectural complexity (another system to maintain and monitor)
- Semantic layer must support your warehouse and BI tool combination
- Learning curve for the modeling language (LookML, MetricFlow, etc.)

**Best for:** Teams at Governed or Predictive maturity who need consistent metric definitions across multiple consumers (dashboards, APIs, notebooks, embedded analytics).

**Used by:** Looker (LookML is the semantic layer). dbt Semantic Layer (MetricFlow, pairs with any BI tool). Preset (partial, via Superset's semantic layer).

---

## Choosing Your Pattern

```
Are you at Spreadsheet or Tool-Native maturity?
→ Use Direct Query. Keep it simple. Add caching at the BI layer if dashboards are slow.

Are you at Governed maturity?
→ Use Direct Query + dbt as your transformation layer.
   dbt handles the modeling; the BI tool queries dbt's output tables directly.
   Add BI-layer caching for high-traffic dashboards.

Are you at Predictive maturity?
→ Evaluate Semantic Layer (Looker LookML or dbt Semantic Layer).
   Use Extract/Import for dashboards with real-time latency requirements
   that cannot tolerate warehouse query times.
```

---

## Per-Platform Connection Setup

### Metabase

<!-- IF {{BI_PLATFORM}} == "metabase" -->

#### Connection Method

Metabase connects to warehouses via JDBC drivers. Configuration is done through the Admin Panel under **Settings → Databases → Add a database**.

#### Setup Steps

1. **Select database type** from the dropdown (PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, etc.)
2. **Enter connection details:**
   - Host: your warehouse hostname or IP
   - Port: warehouse port (e.g., 5432 for PostgreSQL, 5439 for Redshift)
   - Database name: the specific database/schema to connect to
   - Username: a dedicated read-only service account (never use your application's write credentials)
   - Password: the service account password (stored encrypted in Metabase's application database)
3. **Configure SSH tunnel** (if warehouse is behind a firewall):
   - SSH host: your bastion/jump server hostname
   - SSH port: 22 (default)
   - SSH username: the bastion user
   - SSH auth: key pair (recommended) or password
4. **Set sync schedule:** Metabase periodically scans the warehouse schema to discover new tables and columns. Default is hourly. Set to daily for large warehouses to reduce load.
5. **Test the connection** using the built-in test button before saving.

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| PostgreSQL | Native, full support | Recommended for teams starting out |
| Snowflake | Native, full support | Use key pair auth for production |
| BigQuery | Native, full support | Uses service account JSON key |
| Redshift | Native, full support | Use IAM authentication if on AWS |
| MySQL | Native, full support | Ensure `read_only` user permissions |
| ClickHouse | Community driver | Install the ClickHouse driver JAR manually |
| DuckDB | Community driver | Experimental; works for small datasets |
| Trino/Presto | Community driver | Requires Trino JDBC driver |

#### Performance Considerations

- **Caching:** Enable per-question caching in Admin → Settings → Caching. Set TTL based on data freshness requirements (e.g., 1 hour for daily-refresh data, 5 minutes for near-real-time).
- **Connection pooling:** Metabase manages its own connection pool. Default max connections is 15 per database. Increase for high-concurrency environments via the `MB_JDBC_DATA_WAREHOUSE_MAX_CONNECTION_POOL_SIZE` environment variable.
- **Query timeout:** Default is 120 seconds. Increase via `MB_QUERY_TIMEOUT` for complex analytical queries, but investigate slow queries first — a 120-second dashboard query usually indicates a missing index or a bad join.
- **Read replica:** Always connect Metabase to a read replica or dedicated analytical database, never to your production OLTP primary. A single slow dashboard query can block application writes.

#### Security

- **Credentials:** Use a dedicated read-only database user. Grant `SELECT` only on warehouse schemas. Never grant `CREATE`, `INSERT`, `UPDATE`, or `DELETE`.
- **Row-level security:** Metabase Pro/Enterprise supports "sandboxing" — filtering query results based on the Metabase user's attributes. Configure in Admin → Permissions → Sandboxed access.
- **SSO:** Metabase Pro/Enterprise supports SAML and JWT-based SSO. Configure in Admin → Settings → Authentication.
- **API keys:** Metabase Cloud and self-hosted support API keys for programmatic access. Rotate keys quarterly and scope them to specific permissions.

<!-- ENDIF -->

---

### Looker

<!-- IF {{BI_PLATFORM}} == "looker" -->

#### Connection Method

Looker connects to warehouses via its own connection management layer. Configuration is done in **Admin → Database → Connections**.

#### Setup Steps

1. **Select dialect** (BigQuery, Snowflake, Redshift, PostgreSQL, MySQL, etc.)
2. **Enter connection details:**
   - Host: warehouse hostname
   - Port: warehouse port
   - Database: target database/schema
   - Username: dedicated read-only service account
   - Password or key: credential for authentication
3. **Configure PDTs (Persistent Derived Tables):**
   - Specify a temporary schema where Looker can create materialized tables (e.g., `looker_scratch`)
   - Grant the Looker service account `CREATE TABLE` and `DROP TABLE` on this schema only
   - Set PDT rebuild schedule (default: on query if stale)
4. **Set max connections:** Limit concurrent queries Looker sends to the warehouse (default 25, reduce for cost-sensitive environments)
5. **Enable SQL Runner access** for authorized users to test raw queries against the connection
6. **Test the connection** and verify PDT schema access

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| BigQuery | Native, optimized | Looker is a Google product; BigQuery integration is best-in-class |
| Snowflake | Native, full support | Use key pair authentication for production |
| Redshift | Native, full support | Use IAM roles for credential management |
| PostgreSQL | Native, full support | Ensure sufficient `max_connections` for Looker + application |
| MySQL | Native, full support | InnoDB only; MyISAM not recommended |
| Databricks | Native, full support | Uses Databricks SQL endpoints |
| SQL Server | Native, full support | Requires TCP/IP enabled on SQL Server instance |

#### Performance Considerations

- **PDTs:** Use Persistent Derived Tables for complex joins and aggregations that would be too slow as live queries. PDTs are materialized tables rebuilt on schedule or on demand. They are Looker's equivalent of materialized views.
- **Aggregate awareness:** LookML supports aggregate-aware queries — if a pre-aggregated table exists that can answer a query, Looker uses it automatically instead of scanning the full fact table.
- **Query caching:** Looker caches query results for a configurable duration (default 1 hour). Adjust in the model file with `persist_for` or `datagroup` triggers.
- **Connection pooling:** Looker manages connection pools internally. Monitor via Admin → Queries to identify connection bottlenecks.

#### Security

- **Credentials:** Create a dedicated database user for Looker with `SELECT` on analytical schemas and `CREATE`/`DROP` on the PDT scratch schema. No other permissions.
- **Row-level security:** Implement via `access_filter` in LookML, which appends `WHERE` clauses based on the Looker user's attributes. This is enforced at the query level — users cannot bypass it via SQL Runner if SQL Runner access is restricted.
- **SSO:** Looker supports SAML, OpenID Connect, and Google OAuth. Configure in Admin → Authentication.
- **Content access:** Looker's folder-based permission model controls which dashboards and Looks users can see, independent of data access.

<!-- ENDIF -->

---

### Tableau

<!-- IF {{BI_PLATFORM}} == "tableau" -->

#### Connection Method

Tableau connects via native connectors (optimized for each warehouse) or generic ODBC/JDBC. Tableau Desktop creates the initial connection; Tableau Cloud/Server hosts the published data sources.

#### Setup Steps

1. **In Tableau Desktop:** Connect → select your warehouse type from the left panel
2. **Enter connection details:**
   - Server: warehouse hostname
   - Port: warehouse port (if non-default)
   - Database: target database
   - Authentication: username/password, OAuth, or integrated (Windows auth for SQL Server)
3. **Choose connection mode:**
   - **Live:** queries hit the warehouse in real time (current data, slower dashboards)
   - **Extract:** Tableau creates a local .hyper file snapshot (fast dashboards, stale data)
4. **Publish to Tableau Cloud/Server:**
   - Publish data source with embedded credentials or prompt users to authenticate
   - Set extract refresh schedule (if using Extract mode): hourly, daily, weekly
   - Configure Tableau Bridge if connecting to on-premises data from Tableau Cloud
5. **Verify:** Open the published dashboard in Tableau Cloud and confirm data is flowing

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| Snowflake | Native, optimized | OAuth support for SSO-based authentication |
| BigQuery | Native, optimized | Uses Google service account or OAuth |
| Redshift | Native, optimized | Supports IAM-based authentication |
| PostgreSQL | Native, full support | Use SSL mode `require` for production |
| MySQL | Native, full support | Ensure `max_allowed_packet` is adequate for large result sets |
| SQL Server | Native, optimized | Windows integrated auth or SQL auth |
| Databricks | Native, full support | Uses Databricks SQL endpoints or clusters |

#### Performance Considerations

- **Extracts vs Live:** Default to Extracts for dashboards with more than 5 concurrent viewers. Live connections are appropriate for data that must be current-to-the-minute and has a small enough result set to return quickly.
- **Extract refresh scheduling:** Schedule extracts during off-peak warehouse hours to avoid competing with ETL jobs and other analytical queries.
- **Custom SQL:** Avoid using Custom SQL as your data source unless necessary — Tableau's query optimizer works best with native table/join definitions in the Data Model.
- **Dashboard performance:** Use Tableau's Performance Recorder (Help → Settings and Performance → Start Performance Recording) to identify slow sheets and optimize them.

#### Security

- **Credentials:** Use a dedicated read-only warehouse user. When publishing, embed credentials for scheduled refreshes but scope the user to analytical schemas only.
- **Row-level security:** Implement via user filters in Tableau (calculated fields that reference `USERNAME()` or `FULLNAME()`) or via database-level row policies that the warehouse enforces based on the connecting user.
- **SSO:** Tableau Cloud supports SAML, OpenID Connect, and Google Auth. Tableau Server supports SAML, Kerberos, and trusted ticket authentication.
- **Data governance:** Tableau Catalog (Data Management Add-on) provides data lineage, quality warnings, and certification for published data sources.

<!-- ENDIF -->

---

### Preset (Apache Superset)

<!-- IF {{BI_PLATFORM}} == "preset" -->

#### Connection Method

Preset/Superset connects via SQLAlchemy, which means any database with a SQLAlchemy dialect is supported. Configuration is done in **Settings → Database Connections → + Database**.

#### Setup Steps

1. **Select database type** from the supported list or enter a custom SQLAlchemy URI
2. **Enter SQLAlchemy URI:**
   - PostgreSQL: `postgresql+psycopg2://user:password@host:5432/database`
   - Snowflake: `snowflake://user:password@account/database/schema?warehouse=compute_wh`
   - BigQuery: `bigquery://project` (uses service account JSON key uploaded separately)
   - Redshift: `redshift+psycopg2://user:password@host:5439/database`
   - ClickHouse: `clickhousedb://user:password@host:8123/database`
3. **Configure advanced settings:**
   - **Async query execution:** Enable for long-running queries (uses Celery workers)
   - **Query timeout:** Set per-database (default 300 seconds)
   - **Schema access:** Restrict which schemas are visible to users
   - **Catalog access:** Restrict which catalogs are visible (for multi-catalog warehouses)
4. **Test the connection** using the built-in test button
5. **Set metadata refresh:** Configure how often Superset scans for schema changes

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| PostgreSQL | Native, full support | Most battle-tested connection |
| Snowflake | Native, full support | Use key pair auth for production |
| BigQuery | Native, full support | Requires `google-cloud-bigquery` Python package |
| Redshift | Native, full support | Use `psycopg2` driver |
| ClickHouse | Native, full support | One of the best-supported ClickHouse BI tools |
| Trino/Presto | Native, full support | Distributed query engine support |
| MySQL | Native, full support | Use `mysqlclient` driver |
| DuckDB | Community support | Via `duckdb-engine` SQLAlchemy dialect |

#### Performance Considerations

- **Caching:** Superset uses Redis for query result caching. Configure cache TTL per-chart or globally via `CACHE_CONFIG` in `superset_config.py` (self-hosted) or via Preset's dashboard settings (cloud).
- **Async queries:** Enable Celery-based async execution for queries expected to run longer than 10 seconds. This prevents HTTP timeouts and improves the user experience for complex analytical queries.
- **SQL Lab vs dashboards:** SQL Lab queries bypass the cache by default. Dashboard queries use the cache. This is intentional — SQL Lab is for exploration (current data matters), dashboards are for monitoring (consistency matters).
- **Jinja templating:** Superset supports Jinja in SQL queries, enabling dynamic filters like `WHERE date >= '{{ from_dttm }}'`. Use this for parameterized dashboards instead of fetching full datasets and filtering in the browser.

#### Security

- **Credentials:** Use a dedicated read-only database user. SQLAlchemy URIs containing passwords are stored encrypted in Superset's metadata database.
- **Row-level security:** Superset supports row-level security policies via Admin → Security → Row Level Security. Policies are SQL WHERE clauses applied per-role per-table.
- **SSO:** Preset Cloud supports SAML and OpenID Connect. Self-hosted Superset supports Flask-AppBuilder's authentication backends (OAuth, LDAP, SAML via plugins).
- **Schema-level access:** Restrict database connections to specific schemas, preventing users from querying raw staging tables or PII-containing schemas.

<!-- ENDIF -->

---

### PowerBI

<!-- IF {{BI_PLATFORM}} == "powerbi" -->

#### Connection Method

PowerBI connects via native connectors (optimized for Microsoft data sources) or generic ODBC. Connection setup differs between PowerBI Desktop (authoring) and PowerBI Service (publishing/viewing).

#### Setup Steps

1. **In PowerBI Desktop:** Home → Get Data → select your warehouse type
2. **Enter connection details:**
   - Server: warehouse hostname or Azure resource name
   - Database: target database
   - Data connectivity mode: Import (default, recommended for most cases) or DirectQuery
   - Authentication: Windows, Database, Microsoft Account, or Service Principal
3. **Transform data (optional):** Power Query Editor opens for column selection, filtering, and type conversion before loading
4. **Load data:** Imports data into PowerBI's in-memory VertiPaq engine (Import mode) or establishes a live connection (DirectQuery mode)
5. **Publish to PowerBI Service:**
   - Publish from Desktop to your PowerBI workspace
   - Configure scheduled refresh in the dataset settings (requires Gateway for on-prem sources)
   - Configure data source credentials in PowerBI Service under Dataset → Settings → Data source credentials

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| Azure SQL | Native, optimized | Best-in-class integration within Microsoft ecosystem |
| Azure Synapse | Native, optimized | DirectQuery recommended for large Synapse pools |
| SQL Server | Native, optimized | Windows integrated auth or SQL auth |
| PostgreSQL | Native, full support | Requires PostgreSQL ODBC driver |
| Snowflake | Native, full support | OAuth or username/password authentication |
| BigQuery | Native, full support | Requires Google BigQuery connector |
| Redshift | Native, full support | Uses ODBC connection |
| MySQL | Native, full support | Requires MySQL ODBC driver |

#### Performance Considerations

- **Import vs DirectQuery:** Import mode loads data into PowerBI's VertiPaq column store, which is extremely fast for aggregations. DirectQuery sends queries to the warehouse in real time. Default to Import for datasets under 1GB; use DirectQuery only when data freshness requirements demand it or the dataset exceeds Import size limits.
- **Dataset size limits:** Pro license: 1GB per dataset. Premium Per User: 10GB. Premium Per Capacity: 10GB (configurable up to 400GB via admin settings). Plan your data model to stay within these limits.
- **Incremental refresh:** For large datasets, configure incremental refresh to avoid full data reloads on each scheduled refresh. This requires partitioning by a date column and setting the refresh window.
- **Gateway performance:** The On-premises Data Gateway is a single point of failure for on-prem data source connections. Deploy in cluster mode for high availability. Monitor gateway performance via the Gateway Management portal.

#### Security

- **Credentials:** Use a dedicated read-only database user or service principal. Configure in PowerBI Service under Dataset → Settings → Data source credentials. Credentials are encrypted and stored in Azure.
- **Row-level security (RLS):** Define RLS roles in PowerBI Desktop using DAX filter expressions (e.g., `[Region] = USERPRINCIPALNAME()`). Assign Azure AD users/groups to roles in PowerBI Service.
- **SSO:** PowerBI uses Azure Active Directory for authentication. SSO to the warehouse is supported for Azure SQL, Synapse, and Snowflake (via AAD pass-through or OAuth).
- **Sensitivity labels:** PowerBI supports Microsoft Information Protection sensitivity labels for classifying and protecting datasets, reports, and dashboards.

<!-- ENDIF -->

---

### Redash

<!-- IF {{BI_PLATFORM}} == "redash" -->

#### Connection Method

Redash connects to databases via Python database drivers. Configuration is done in **Settings → Data Sources → New Data Source**.

#### Setup Steps

1. **Select data source type** from the dropdown (PostgreSQL, MySQL, BigQuery, Snowflake, Redshift, etc.)
2. **Enter connection details:**
   - Host: warehouse hostname
   - Port: warehouse port
   - Database: target database
   - User: dedicated read-only service account
   - Password: service account password
3. **Configure additional settings:**
   - SSL: enable for production connections
   - SSH tunnel: configure if the warehouse is behind a firewall (requires Redash to have SSH key access to a bastion host)
4. **Test the connection** using the built-in test button
5. **Set query result TTL:** Configure how long query results are cached (default varies by data source type)

#### Warehouse Compatibility

| Warehouse | Support Level | Notes |
|-----------|--------------|-------|
| PostgreSQL | Native, full support | Most common Redash deployment target |
| MySQL | Native, full support | Standard Python MySQL driver |
| BigQuery | Native, full support | Uses service account JSON key |
| Snowflake | Native, full support | Uses Snowflake Python connector |
| Redshift | Native, full support | Uses psycopg2 driver |
| ClickHouse | Native, full support | Well-supported community data source |
| Presto/Trino | Native, full support | Uses PyHive driver |
| MongoDB | Native, full support | Uses PyMongo with JSON query syntax |

#### Performance Considerations

- **Query caching:** Redash caches query results for a configurable duration. Adjust TTL per-query in the query settings. Default is to cache until the next scheduled execution.
- **Scheduled queries:** Configure queries to run on a schedule (e.g., every hour, every day). Scheduled results are cached and served to dashboard viewers without re-executing the query.
- **No connection pooling:** Redash creates a new database connection per query execution. For high-concurrency environments, ensure your warehouse has sufficient `max_connections`.
- **Worker scaling:** Redash uses Celery workers for query execution. Scale the number of workers based on concurrent query load. Default single-worker setup is insufficient for more than a handful of concurrent users.

#### Security

- **Credentials:** Use a dedicated read-only database user. Credentials are stored in Redash's metadata database (encrypted at rest if configured).
- **Row-level security:** Not natively supported. Implement via database-level row policies or by creating separate data sources with different credentials scoped to different schemas.
- **SSO:** Self-hosted Redash supports SAML (via `python3-saml`) and Google OAuth. Requires manual configuration in Redash's environment variables.
- **API keys:** Each Redash user has an API key for programmatic access to queries and dashboards. Rotate keys periodically and restrict API access to trusted IP ranges via firewall rules.

<!-- ENDIF -->

---

## Common Connection Gotchas

These are the problems that surface in production, not in the setup wizard. Every one of these has caused a real outage or data incident in a real organization.

### SSL Certificate Issues

**Symptom:** Connection works locally but fails in production, or works in one environment but not another. Error messages reference "SSL certificate verify failed" or "unable to get local issuer certificate."

**Root cause:** The BI platform's runtime environment does not trust the certificate authority (CA) that signed the warehouse's SSL certificate. This is common with self-signed certificates, internal CAs, or warehouse providers that use intermediate certificates not bundled in the default CA store.

**Fix:**
- For managed BI platforms (Looker, Preset Cloud, Tableau Cloud): contact the BI vendor — they need to add your CA to their trust store, or you need to switch to a publicly trusted certificate.
- For self-hosted BI platforms (Metabase, Superset, Redash): add the CA certificate to the container's trust store. For Docker deployments, mount the CA cert and run `update-ca-certificates` in the entrypoint.
- For cloud warehouses (Snowflake, BigQuery, Redshift): SSL is handled automatically. If you see SSL errors, check that your BI platform's runtime has internet access to download the CA bundle.

### Firewall and Network Access

**Symptom:** "Connection timed out" or "Connection refused" errors despite correct credentials.

**Root cause:** The BI platform cannot reach the warehouse because of firewall rules, security groups, VPC configuration, or IP allowlists.

**Fix:**
- **Cloud warehouse + cloud BI:** Allowlist the BI platform's egress IP addresses in the warehouse's firewall rules. Metabase Cloud, Preset Cloud, and Tableau Cloud publish their IP ranges in their documentation.
- **Cloud warehouse + self-hosted BI:** Ensure the BI container/VM has network access to the warehouse endpoint. For AWS: check security groups and NACLs. For GCP: check firewall rules. For Azure: check NSGs.
- **On-premises warehouse + cloud BI:** Use SSH tunneling (Metabase), Tableau Bridge (Tableau), On-premises Data Gateway (PowerBI), or a reverse tunnel/VPN.
- **Private VPC warehouse:** Some BI platforms support VPC peering or PrivateLink. Check your BI platform's documentation for private connectivity options.

### Connection Pooling Exhaustion

**Symptom:** Dashboards intermittently fail with "too many connections" or "connection pool exhausted" errors, especially during peak usage hours.

**Root cause:** The BI platform opens more concurrent database connections than the warehouse allows. Each dashboard viewer can generate multiple concurrent queries (one per chart on the dashboard), and the connection pool fills up.

**Fix:**
- Increase `max_connections` on the warehouse (PostgreSQL: `postgresql.conf`, Snowflake: warehouse size, Redshift: cluster node count).
- Decrease max connections per database in the BI platform settings (Metabase: `MB_JDBC_DATA_WAREHOUSE_MAX_CONNECTION_POOL_SIZE`, Looker: Admin → Connections → Max Connections).
- Enable query result caching so repeated dashboard views serve cached results instead of generating new queries.
- Use a connection pooler like PgBouncer between the BI platform and a PostgreSQL warehouse.

### Query Timeouts

**Symptom:** Complex dashboards show "query timeout" errors for some charts but not others. The same query works fine in a SQL client.

**Root cause:** The BI platform has a shorter query timeout than your SQL client. Default timeouts vary: Metabase (120s), Superset (300s), Redash (300s), PowerBI (varies), Looker (model-specific).

**Fix:**
- Increase the BI platform's query timeout as a short-term fix.
- Optimize the slow query as the long-term fix. Common causes: missing indexes on filter columns, full table scans on fact tables without date range filters, unoptimized joins on non-indexed columns.
- For queries that legitimately take minutes (large cohort analyses, full-table aggregations): pre-compute the results via dbt models, materialized views, or the BI platform's caching mechanism (Looker PDTs, Tableau Extracts, PowerBI Import mode).

### Credential Rotation Failures

**Symptom:** Dashboards suddenly stop loading. Error: "authentication failed" or "password expired."

**Root cause:** Someone rotated the database password or API key without updating the BI platform's stored credentials. This happens during security reviews, compliance audits, or automated credential rotation policies.

**Fix:**
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager) to store warehouse credentials and configure the BI platform to read from the secrets manager.
- If the BI platform does not support secrets manager integration (most do not natively): document the credential rotation procedure, including which BI platform settings need to be updated, and test the procedure before it is needed.
- Set calendar reminders for credential rotation. Common intervals: 90 days (SOC 2 default), 365 days (most organizations).
- Use OAuth or key pair authentication (Snowflake, BigQuery) instead of username/password to avoid password rotation entirely.

### Schema Drift

**Symptom:** A dashboard chart that was working yesterday now shows "column not found" or "relation does not exist" errors.

**Root cause:** Someone modified the warehouse schema — renamed a column, dropped a table, or changed a data type — without updating the BI platform's queries, models, or data source configuration.

**Fix:**
- Trigger a metadata sync in the BI platform (Metabase: Admin → Databases → Sync now; Looker: Development Mode → Validate LookML; Superset: Sources → Databases → schema refresh).
- Update broken queries, calculated fields, or LookML definitions to reference the new schema.
- Prevent recurrence: use dbt's `dbt test` and `dbt source freshness` to detect schema changes before they break dashboards. Add a CI check that validates BI platform queries against the warehouse schema after each dbt deployment.

### Timezone Mismatches

**Symptom:** Dashboard numbers do not match raw database queries. Daily metrics are off by one day for some users. Revenue numbers disagree between the BI dashboard and the Stripe dashboard.

**Root cause:** The BI platform, the warehouse, the application database, and the user's browser are all in different timezones. A `created_at` timestamp stored as UTC in the database gets displayed as local time in the BI tool, shifting events across day boundaries.

**Fix:**
- Store all timestamps in UTC in your application database and warehouse. No exceptions.
- Configure the BI platform's timezone to UTC as the system default.
- Apply timezone conversion at the display layer only — use the BI platform's timezone conversion functions to display times in the viewer's local timezone.
- Document the timezone convention in your `metrics-hub/unified-metrics-registry.template.md` for every time-based metric.
