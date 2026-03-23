# SaaS Database Patterns

> The database is where multi-tenancy either works or fails catastrophically. This guide covers the `tenant_id everywhere` rule, shared reference tables, PostgreSQL RLS deep dive, tenant-aware migrations, data archival, cross-tenant reporting, audit logging, and connection pooling. If you only read one file in this section, read this one.

---

## The "tenant_id Everywhere" Rule

**Every tenant-scoped table MUST have a `tenant_id` column. No exceptions. No shortcuts.**

This is the single most important rule in multi-tenant database design. If a table stores data that belongs to a tenant, it gets `tenant_id`. If you are unsure whether a table is tenant-scoped, it probably is.

### How to Enforce It

#### 1. Database-Level Enforcement (Recommended)

Create a trigger that rejects inserts/updates on tenant-scoped tables where `tenant_id` is NULL:

```sql
-- Function that rejects NULL tenant_id
CREATE OR REPLACE FUNCTION enforce_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    RAISE EXCEPTION 'tenant_id cannot be NULL on table %', TG_TABLE_NAME;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to every tenant-scoped table
CREATE TRIGGER enforce_tenant_id_users
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION enforce_tenant_id();

CREATE TRIGGER enforce_tenant_id_projects
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION enforce_tenant_id();

-- Repeat for all tenant-scoped tables
```

#### 2. ORM-Level Enforcement

```typescript
// Drizzle: custom build-time check
// In your schema validation script (runs in CI):
import * as schema from "./schema";

const TENANT_SCOPED_TABLES = [
  "users", "projects", "documents", "comments", "tasks",
  "invoices", "audit_logs", "files", "notifications",
];

const GLOBAL_TABLES = [
  "tenants", "plans", "permissions", "countries", "currencies",
  "feature_flags", "super_admins", "system_settings",
];

for (const tableName of TENANT_SCOPED_TABLES) {
  const table = schema[tableName];
  if (!table.tenantId) {
    throw new Error(`CRITICAL: Table '${tableName}' is missing tenant_id column!`);
  }
}
```

#### 3. Migration Lint Check

```typescript
// scripts/check-tenant-id.ts
// Runs as a pre-commit hook or CI step
import { Client } from "pg";

async function checkTenantColumns() {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  // Get all tables that SHOULD have tenant_id
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT IN ('tenants', 'plans', 'permissions', 'countries',
                             'currencies', 'feature_flags', 'super_admins',
                             'system_settings', 'schema_migrations')
  `);

  const violations: string[] = [];

  for (const row of result.rows) {
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = $1 AND column_name = 'tenant_id'
    `, [row.table_name]);

    if (colCheck.rows.length === 0) {
      violations.push(row.table_name);
    }
  }

  if (violations.length > 0) {
    console.error("TENANT_ID MISSING on tables:", violations.join(", "));
    process.exit(1);
  }

  console.log("All tenant-scoped tables have tenant_id.");
  await client.end();
}

checkTenantColumns();
```

---

## Shared Reference Tables

Not all tables are tenant-scoped. These global tables are shared across all tenants:

| Table | Purpose | Why It's Shared |
|-------|---------|-----------------|
| `tenants` | Tenant records | It IS the tenant table |
| `plans` / `plan_definitions` | Subscription tiers | Same plans for everyone |
| `permissions` / `system_roles` | Permission definitions | Role templates are global |
| `countries` | Country list | Reference data |
| `currencies` | Currency codes | Reference data |
| `feature_flags` | Global flag definitions | Per-tenant overrides are separate |
| `super_admins` | Your operations team | Not tenant-scoped |
| `system_settings` | Platform configuration | Global |
| `schema_migrations` | Migration history | Infrastructure |

### Per-Tenant Overrides on Global Data

Some global data needs per-tenant overrides. Use a separate table:

```sql
-- Global feature flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Per-tenant overrides
CREATE TABLE tenant_feature_overrides (
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL,
  PRIMARY KEY (tenant_id, feature_flag_id)
);

-- Query: Is feature X enabled for tenant Y?
SELECT COALESCE(
  (SELECT enabled FROM tenant_feature_overrides
   WHERE tenant_id = $1 AND feature_flag_id = ff.id),
  ff.enabled
) as is_enabled
FROM feature_flags ff
WHERE ff.name = $2;
```

---

## PostgreSQL RLS Deep Dive

### Policy Creation Patterns

```sql
-- PATTERN 1: Simple policy for all operations
CREATE POLICY tenant_isolation ON projects
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- PATTERN 2: Separate policies per operation (more granular control)
CREATE POLICY select_own_tenant ON projects
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY insert_own_tenant ON projects
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY update_own_tenant ON projects
  FOR UPDATE
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY delete_own_tenant ON projects
  FOR DELETE
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- PATTERN 3: Super admin bypass policy
CREATE POLICY super_admin_bypass ON projects
  USING (
    current_setting('app.current_tenant_id', true)::uuid = tenant_id
    OR current_setting('app.is_super_admin', true)::boolean = true
  );
```

### Session Variable Setup

```sql
-- Set at connection start or transaction start
-- LOCAL: applies only to current transaction (RECOMMENDED)
SET LOCAL app.current_tenant_id = 'uuid-here';

-- SESSION: applies to entire connection (risky with connection pooling)
SET app.current_tenant_id = 'uuid-here';

-- Read current value
SELECT current_setting('app.current_tenant_id');

-- Check if set (returns NULL instead of error if not set)
SELECT current_setting('app.current_tenant_id', true);
```

### Testing RLS Policies

```sql
-- Test 1: Verify RLS blocks cross-tenant access
BEGIN;
SET LOCAL app.current_tenant_id = 'tenant-a-uuid';
SELECT COUNT(*) FROM projects; -- Should only return Tenant A's projects
COMMIT;

-- Test 2: Verify RLS blocks INSERT with wrong tenant_id
BEGIN;
SET LOCAL app.current_tenant_id = 'tenant-a-uuid';
INSERT INTO projects (tenant_id, name, created_by)
  VALUES ('tenant-b-uuid', 'Evil Project', 'attacker-uuid');
-- Should FAIL with policy violation
COMMIT;

-- Test 3: Verify no data returned without context
BEGIN;
-- Do NOT set app.current_tenant_id
SELECT COUNT(*) FROM projects; -- Should return 0
COMMIT;
```

### Common RLS Bugs

| Bug | Symptom | Fix |
|-----|---------|-----|
| Forgot `ENABLE ROW LEVEL SECURITY` | All rows visible to everyone | Run `ALTER TABLE x ENABLE ROW LEVEL SECURITY` |
| Forgot `FORCE ROW LEVEL SECURITY` | Table owner bypasses RLS | Run `ALTER TABLE x FORCE ROW LEVEL SECURITY` |
| Policy uses `SESSION` instead of `LOCAL` | Connection pool returns previous tenant's data | Always use `SET LOCAL` within transactions |
| Missing policy on one table | That table leaks all tenant data | Audit all tables with RLS enforcement script |
| Multiple policies with OR logic | Unintended cross-tenant access | Review all policies; they combine with OR by default |
| RLS not applied to superuser role | Admin connections bypass all isolation | Use a non-superuser role for application connections |
| `current_setting` without `true` second arg | Error when variable not set (crashes app) | Always use `current_setting('var', true)` for nullable |

### RLS Audit Script

```sql
-- Find all tenant-scoped tables WITHOUT RLS enabled
SELECT t.tablename
FROM pg_tables t
JOIN information_schema.columns c
  ON c.table_name = t.tablename
WHERE c.column_name = 'tenant_id'
  AND t.schemaname = 'public'
  AND NOT EXISTS (
    SELECT 1 FROM pg_class pc
    JOIN pg_namespace pn ON pn.oid = pc.relnamespace
    WHERE pc.relname = t.tablename
      AND pn.nspname = 'public'
      AND pc.relrowsecurity = true
  );
-- This query should return ZERO rows
```

---

## Tenant-Aware Migrations

### Safe Migration Strategy for Shared Databases

When all tenants share one database, migrations affect everyone simultaneously. Every migration must be backward-compatible.

```
RULE 1: Never DROP a column in the same release that removes its usage
  → Release 1: Stop writing to the column, stop reading from it
  → Release 2: DROP the column (after verifying no code references it)

RULE 2: Never rename a column
  → Instead: add new column, migrate data, update code, drop old column

RULE 3: Always add columns as NULLABLE first
  → ALTER TABLE projects ADD COLUMN priority VARCHAR(20);  -- nullable
  → Backfill: UPDATE projects SET priority = 'medium' WHERE priority IS NULL;
  → Then: ALTER TABLE projects ALTER COLUMN priority SET NOT NULL;

RULE 4: Add indexes CONCURRENTLY
  → CREATE INDEX CONCURRENTLY idx_projects_priority ON projects(tenant_id, priority);
  → Non-blocking, no downtime

RULE 5: Test migrations against production-size data
  → A migration that takes 100ms on dev can take 30 minutes on production
```

### Migration Checklist

```
Before running ANY migration on a shared multi-tenant database:
- [ ] Migration is backward-compatible (old code works with new schema)
- [ ] No DROP COLUMN in same release as code change
- [ ] New columns are NULLABLE or have DEFAULT values
- [ ] Indexes created with CONCURRENTLY
- [ ] Migration tested against production-size dataset
- [ ] Rollback migration prepared and tested
- [ ] Maintenance window scheduled (if locking migration)
- [ ] Tenant notification sent (if downtime expected)
```

---

## Data Archival Per Tenant (GDPR Right to Deletion)

When a tenant churns or requests deletion, you must handle their data properly.

### Three-Phase Deletion Process

```
Phase 1: Export (Day 0)
  → Generate full data export (JSON/CSV)
  → Send download link to tenant admin
  → Retain export for 30 days

Phase 2: Soft Delete (Day 0)
  → Set tenant status to 'pending_deletion'
  → Disable login for all tenant users
  → Stop billing
  → Schedule hard delete for Day 30

Phase 3: Hard Delete (Day 30)
  → Delete all tenant data from all tables
  → Delete all files from storage
  → Delete search indexes
  → Anonymize audit logs (keep for compliance, remove PII)
  → Delete tenant record
  → Confirm deletion to ex-admin via email
```

```sql
-- Hard delete: cascade from tenants table
-- All tenant-scoped tables should have ON DELETE CASCADE
DELETE FROM tenants WHERE id = 'tenant-uuid';
-- This cascades to: users, projects, documents, tasks, invoices, etc.

-- If ON DELETE CASCADE is not set, delete explicitly in order:
DELETE FROM audit_logs WHERE tenant_id = 'tenant-uuid';
DELETE FROM usage_records WHERE tenant_id = 'tenant-uuid';
DELETE FROM files WHERE tenant_id = 'tenant-uuid';
DELETE FROM comments WHERE tenant_id = 'tenant-uuid';
DELETE FROM tasks WHERE tenant_id = 'tenant-uuid';
DELETE FROM projects WHERE tenant_id = 'tenant-uuid';
DELETE FROM subscriptions WHERE tenant_id = 'tenant-uuid';
DELETE FROM users WHERE tenant_id = 'tenant-uuid';
DELETE FROM tenants WHERE id = 'tenant-uuid';
```

```typescript
// src/admin/tenant-deletion.ts
export async function hardDeleteTenant(tenantId: string) {
  // 1. Delete files from S3/R2
  await deleteAllTenantFiles(tenantId);

  // 2. Delete search indexes
  await deleteSearchIndex(`tenant_${tenantId}`);

  // 3. Delete from database (cascade handles most tables)
  await db.delete(tenants).where(eq(tenants.id, tenantId));

  // 4. Invalidate all caches
  await invalidateAllTenantCaches(tenantId);

  // 5. Log deletion (system audit, not tenant audit)
  await systemAuditLog("tenant.hard_deleted", { tenantId });
}
```

---

## Cross-Tenant Reporting (Admin Analytics)

Super admin dashboards need to aggregate data across tenants. This must be done safely without exposing individual tenant data.

```sql
-- System-wide metrics (super admin only)
-- Active tenants by plan
SELECT plan, COUNT(*) as tenant_count
FROM tenants
WHERE status = 'active'
GROUP BY plan;

-- Usage across all tenants (aggregated, not per-tenant detail)
SELECT
  metric_type,
  SUM(quantity) as total_usage,
  AVG(quantity) as avg_per_tenant,
  MAX(quantity) as max_usage,
  COUNT(DISTINCT tenant_id) as tenants_reporting
FROM usage_records
WHERE period_start > NOW() - INTERVAL '30 days'
GROUP BY metric_type;

-- Top tenants by usage (for noisy neighbor detection)
SELECT
  t.name,
  t.plan,
  SUM(ur.quantity) as total_api_calls
FROM usage_records ur
JOIN tenants t ON t.id = ur.tenant_id
WHERE ur.metric_type = 'api_calls'
  AND ur.period_start > NOW() - INTERVAL '24 hours'
GROUP BY t.id, t.name, t.plan
ORDER BY total_api_calls DESC
LIMIT 20;

-- Revenue metrics
SELECT
  DATE_TRUNC('month', s.created_at) as month,
  SUM(CASE WHEN s.billing_interval = 'monthly' THEN p.price_monthly_cents
           ELSE p.price_yearly_cents / 12 END) as mrr
FROM subscriptions s
JOIN plans p ON p.id = s.plan_id
WHERE s.status = 'active'
GROUP BY month
ORDER BY month;
```

### Safety Rules for Cross-Tenant Queries

1. **Never expose individual tenant data to other tenants** — cross-tenant queries are super-admin only
2. **Aggregate, do not enumerate** — show "average usage is 500 API calls" not "Tenant X used 5,000"
3. **Run on read replicas** — heavy analytics queries should not impact production
4. **Cache results** — dashboard metrics do not need real-time accuracy; cache for 5-15 minutes

---

## Audit Logging Per Tenant

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,          -- user who performed the action
  actor_email VARCHAR(255),
  action VARCHAR(100) NOT NULL,     -- 'project.created', 'user.invited', 'document.deleted'
  resource_type VARCHAR(50),        -- 'project', 'user', 'document'
  resource_id UUID,
  changes JSONB,                    -- { "before": {...}, "after": {...} }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant_time ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_tenant_action ON audit_logs(tenant_id, action);
CREATE INDEX idx_audit_tenant_actor ON audit_logs(tenant_id, actor_id);
CREATE INDEX idx_audit_tenant_resource ON audit_logs(tenant_id, resource_type, resource_id);

-- Partition by month for efficient archival
-- (for high-volume SaaS, partition audit_logs by created_at)
```

```typescript
// src/audit/logger.ts
export async function auditLog(params: {
  tenantId: string;
  actorId: string;
  actorEmail?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  changes?: { before?: unknown; after?: unknown };
  ipAddress?: string;
  userAgent?: string;
}) {
  // Fire-and-forget: audit logging should never block the request
  db.insert(auditLogs).values({
    tenantId: params.tenantId,
    actorId: params.actorId,
    actorEmail: params.actorEmail,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    changes: params.changes ? JSON.stringify(params.changes) : null,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  }).catch((err) => {
    console.error("Audit log write failed:", err);
    // Send to error tracking — audit failures are serious
  });
}
```

---

## Connection Pooling

### Single Pool with Context (Recommended)

```
Application
    │
    ▼
Connection Pool (PgBouncer or built-in)
    │  SET LOCAL app.current_tenant_id = 'xxx'
    ▼
PostgreSQL (shared database)
```

Almost always use a single connection pool. Set the tenant context per transaction using `SET LOCAL`.

```typescript
// Pool configuration
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,          // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Per-request: get connection, set tenant, execute, release
export async function withTenantConnection<T>(
  tenantId: string,
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL app.current_tenant_id = $1", [tenantId]);
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release(); // Returns to pool — LOCAL vars are cleared
  }
}
```

### Per-Tenant Pools (Rarely Needed)

Only use per-tenant pools when:
- Tenants have dedicated databases (database-level isolation)
- Regulatory requirement mandates separate connections
- Specific tenants need different connection parameters

```typescript
// Per-tenant pool manager (for database-level isolation)
const tenantPools = new Map<string, Pool>();

function getTenantPool(tenantId: string): Pool {
  if (!tenantPools.has(tenantId)) {
    const config = getTenantDatabaseConfig(tenantId);
    tenantPools.set(tenantId, new Pool({
      connectionString: config.databaseUrl,
      max: 5, // Lower per-tenant limit
    }));
  }
  return tenantPools.get(tenantId)!;
}
```

### PgBouncer Configuration

```ini
; pgbouncer.ini
[databases]
myapp = host=localhost dbname=myapp

[pgbouncer]
listen_port = 6432
pool_mode = transaction   ; MUST be transaction mode for SET LOCAL to work
max_client_conn = 1000
default_pool_size = 20
reserve_pool_size = 5
```

**Critical:** When using PgBouncer, use `transaction` pool mode, not `session` mode. `SET LOCAL` works per-transaction. `SET` (without LOCAL) works per-session — which in `transaction` mode means it is lost after the transaction ends (which is what you want).

---

## Checklist

- [ ] Every tenant-scoped table has `tenant_id` NOT NULL with foreign key to `tenants`
- [ ] Shared reference tables identified and documented
- [ ] `tenant_id` enforcement: DB trigger, ORM check, or CI lint
- [ ] PostgreSQL RLS enabled and forced on all tenant-scoped tables
- [ ] RLS policies tested: cross-tenant SELECT, INSERT, UPDATE, DELETE all blocked
- [ ] RLS audit script runs in CI
- [ ] Migration strategy documented: backward-compatible, no column drops in same release
- [ ] CONCURRENTLY used for index creation in production
- [ ] Data export tool for tenant offboarding
- [ ] Hard delete process with 30-day grace period
- [ ] Cross-tenant queries restricted to super admin only
- [ ] Audit logs on all tenant-scoped tables with retention policy
- [ ] Connection pooling configured with `SET LOCAL` per transaction
- [ ] PgBouncer in `transaction` mode (if used)
