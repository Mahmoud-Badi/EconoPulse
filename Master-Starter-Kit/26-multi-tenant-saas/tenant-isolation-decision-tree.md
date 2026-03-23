# Tenant Isolation Decision Tree

> Choosing the wrong isolation strategy is a one-way door — migrating from row-level to database-level (or vice versa) after launch is a multi-month project. This guide helps you choose correctly the first time by comparing row-level, schema-level, and database-level isolation across every dimension that matters.

---

## The Three Isolation Strategies

### 1. Row-Level Isolation (tenant_id Column)

**How it works:** Every tenant-scoped table gets a `tenant_id` column. All queries include a `WHERE tenant_id = ?` filter. All tenants share the same tables, same schema, same database.

```sql
-- Every tenant-scoped table looks like this
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Every query filters by tenant
SELECT * FROM projects WHERE tenant_id = 'abc-123' AND name LIKE '%demo%';
```

**Best for:**
- 100+ tenants (consumer SaaS, SMB SaaS)
- Cost-sensitive deployments (single database instance)
- Products that need cross-tenant analytics (admin dashboards)
- Teams that want simple operations (one schema to migrate)

**Risks:**
- Missing a `WHERE tenant_id = ?` filter on any query = data leak
- No query-level isolation — a heavy tenant query affects all tenants
- Indexes must include `tenant_id` for performance

**Mitigation:**
- PostgreSQL Row-Level Security (RLS) makes the filter automatic
- ORM middleware that injects `tenant_id` on every query
- Integration tests with 2+ tenants that verify isolation

---

### 2. Schema-Level Isolation (PostgreSQL Schemas)

**How it works:** Each tenant gets their own PostgreSQL schema. Table structures are identical across schemas, but data is physically separated. A shared `public` schema holds global data.

```sql
-- Create schema per tenant
CREATE SCHEMA tenant_abc123;

-- Each schema has identical table structures
CREATE TABLE tenant_abc123.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Query within tenant schema
SET search_path TO tenant_abc123, public;
SELECT * FROM projects WHERE name LIKE '%demo%';
```

**Best for:**
- 10-1,000 tenants (mid-market SaaS, B2B)
- Regulated industries requiring logical separation (HIPAA, SOC2)
- Products where per-tenant backup/restore is needed
- Teams comfortable with moderate operational complexity

**Risks:**
- Schema migrations must run across all tenant schemas
- Connection pooling is more complex (schema switching per request)
- Provisioning is slower than row-level (must create schema + tables)
- PostgreSQL-specific — limits database portability

**Mitigation:**
- Migration tooling that iterates over all schemas
- Connection middleware that sets `search_path` per request
- Automated provisioning scripts tested in CI

---

### 3. Database-Level Isolation (Separate Databases)

**How it works:** Each tenant gets their own database instance (or at minimum, their own logical database). Complete physical isolation.

```
tenant-abc123.database.example.com  → Tenant ABC's database
tenant-def456.database.example.com  → Tenant DEF's database
shared.database.example.com         → Global data (plans, features, etc.)
```

**Best for:**
- <100 tenants (enterprise SaaS, high-value contracts)
- Highest compliance requirements (PCI DSS, FedRAMP, ITAR)
- Customers who contractually require dedicated infrastructure
- Products where per-tenant performance SLAs are critical

**Risks:**
- Expensive — each tenant = separate database instance cost
- Operationally complex — monitoring, backups, migrations across N databases
- Cross-tenant queries require federation or ETL pipelines
- Connection management requires a routing layer

**Mitigation:**
- Infrastructure-as-code for consistent provisioning
- Centralized migration tooling (run against all databases)
- Tenant routing middleware that resolves database connection per request
- Centralized monitoring dashboard aggregating all instances

---

## Comparison Matrix

| Factor | Row-Level | Schema-Level | Database-Level |
|--------|-----------|--------------|----------------|
| **Isolation strength** | Medium | High | Highest |
| **Cost efficiency** | Best | Good | Expensive |
| **Max practical tenants** | Unlimited (100K+) | ~1,000 | ~100 |
| **Migration complexity** | Low (1 schema) | Medium (N schemas) | High (N databases) |
| **Cross-tenant queries** | Easy (same tables) | Possible (schema unions) | Difficult (federation) |
| **Noisy neighbor risk** | Higher | Lower | None |
| **Compliance suitability** | General / SOC2 | HIPAA / SOC2 | PCI / FedRAMP / ITAR |
| **Operational overhead** | Low | Medium | High |
| **Backup per tenant** | Difficult (row export) | Possible (schema dump) | Easy (database dump) |
| **Restore per tenant** | Difficult | Moderate | Easy |
| **Time to provision** | Instant (<100ms) | Seconds (1-5s) | Minutes (1-10m) |
| **Connection pooling** | Simple (single pool) | Moderate (schema switching) | Complex (pool per DB) |
| **Data leak risk** | Higher (missing filter) | Lower (schema boundary) | Lowest (DB boundary) |
| **Monitoring complexity** | Low | Medium | High |
| **Cost per 100 tenants** | ~$50/mo (shared RDS) | ~$50-100/mo (shared RDS) | ~$5,000+/mo (100 instances) |
| **Cost per 1000 tenants** | ~$100/mo (shared RDS) | ~$200-500/mo (shared RDS) | Not practical |

---

## Decision Flowchart

```
START: How many tenants will you have in 12 months?
│
├── >1000 tenants
│   └── ROW-LEVEL (no other strategy scales cost-effectively)
│       └── ADD: PostgreSQL RLS + ORM middleware + 2-tenant integration tests
│
├── 100-1000 tenants
│   ├── Do you have compliance requirements (HIPAA, SOC2 Type II)?
│   │   ├── Yes → SCHEMA-LEVEL
│   │   └── No → ROW-LEVEL (simpler, cheaper)
│   │
│   └── Do enterprise customers contractually require isolation?
│       ├── Yes → SCHEMA-LEVEL (standard) + DATABASE-LEVEL (enterprise tier add-on)
│       └── No → ROW-LEVEL
│
├── 10-100 tenants
│   ├── High-value contracts (>$10K/mo each)?
│   │   ├── Yes → DATABASE-LEVEL or SCHEMA-LEVEL
│   │   └── No → ROW-LEVEL or SCHEMA-LEVEL
│   │
│   └── PCI / FedRAMP / ITAR compliance?
│       ├── Yes → DATABASE-LEVEL
│       └── No → SCHEMA-LEVEL
│
└── <10 tenants
    ├── Each paying >$50K/mo?
    │   └── Yes → DATABASE-LEVEL (they expect dedicated infrastructure)
    │
    └── No → ROW-LEVEL (simplest option, always works)
```

---

## Hybrid Strategies

The most successful SaaS companies use hybrid approaches:

### Row-Level Default + Database-Level for Enterprise

Most tenants share a single database with row-level isolation. Enterprise tenants (paying 10x+ the standard price) get a dedicated database instance. This is the most common pattern at scale.

```typescript
// Tenant routing middleware
function getTenantConnection(tenantId: string): DatabaseConnection {
  const tenant = await getTenantConfig(tenantId);

  if (tenant.dedicatedDatabase) {
    // Enterprise tenant — dedicated database
    return getDedicatedPool(tenant.databaseUrl);
  }

  // Standard tenant — shared database with RLS
  const conn = getSharedPool();
  await conn.query(`SET app.current_tenant_id = '${tenantId}'`);
  return conn;
}
```

### Schema-Level Default + Shared for Analytics

Tenant data lives in per-tenant schemas. A separate analytics database receives aggregated, anonymized data via ETL for cross-tenant reporting.

---

## Anti-Patterns

### 1. Database-per-Tenant for Consumer SaaS

**Why it fails:** If you are building a product with thousands of potential customers (Slack, Notion, Trello), database-per-tenant makes infrastructure costs grow linearly with customers. A 10,000-customer SaaS would need 10,000 database instances. The operational burden alone will kill the team.

**Do instead:** Row-level isolation with RLS.

### 2. Row-Level Without RLS or Middleware

**Why it fails:** Relying on developers to remember `WHERE tenant_id = ?` on every query is guaranteed to fail. One missed filter, one forgotten join condition, one raw query without the tenant clause — and you have a data leak.

**Do instead:** Use PostgreSQL RLS (database enforces isolation) or ORM middleware (code enforces isolation). Ideally both.

### 3. Hardcoded Tenant Context

```typescript
// ANTI-PATTERN: tenant_id stored in a global variable
let currentTenantId: string; // Race conditions in concurrent requests

// CORRECT: tenant context per request
function getTenantId(req: Request): string {
  return req.headers['x-tenant-id'] || extractFromJWT(req);
}
```

**Why it fails:** Global variables are shared across concurrent requests in Node.js. Request A sets tenant to "abc", request B sets it to "def", request A reads "def" — data leak.

**Do instead:** Use AsyncLocalStorage (Node.js), request context, or middleware that passes tenant ID per-request.

### 4. Tenant ID in URL Path for Security

```
// ANTI-PATTERN: trusting the URL
GET /api/tenants/abc-123/projects  ← What if user changes "abc-123" to "def-456"?

// CORRECT: tenant from auth token
GET /api/projects  ← tenant derived from JWT, not URL
```

**Why it fails:** URL parameters are user-controllable. If the tenant ID comes from the URL, any authenticated user can access any tenant's data by changing the URL.

**Do instead:** Derive tenant ID from the authentication token (JWT `tenant_id` claim or session lookup). Never trust client-supplied tenant identifiers for authorization.

### 5. No Tenant Isolation in Search

**Why it fails:** Full-text search (Elasticsearch, Typesense, Meilisearch) requires tenant-scoped indexes or filtered queries. A search endpoint that does not filter by tenant returns results from all tenants.

**Do instead:** Either prefix search indexes (`tenant_abc_products`) or include `tenant_id` as a filter on every search query.

---

## Migration Path: Single-Tenant to Multi-Tenant

If you are converting an existing single-tenant application:

### Step 1: Create the `tenants` table

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, churned
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Add `tenant_id` to all tenant-scoped tables

```sql
-- For each table
ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- Backfill: assign all existing rows to the first tenant
UPDATE users SET tenant_id = (SELECT id FROM tenants LIMIT 1);
-- Make it NOT NULL after backfill
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
-- Add composite index
CREATE INDEX idx_users_tenant ON users(tenant_id, id);
```

### Step 3: Enable RLS on every tenant-scoped table

### Step 4: Add tenant context middleware to every API route

### Step 5: Update all queries to include tenant filter

### Step 6: Test with 2 tenants — verify complete isolation

---

## Checklist Before Choosing

- [ ] Estimated tenant count in 12 months documented
- [ ] Compliance requirements identified (HIPAA, SOC2, PCI, FedRAMP)
- [ ] Average revenue per tenant estimated
- [ ] Enterprise customer isolation requirements gathered
- [ ] Database technology chosen (PostgreSQL recommended for RLS)
- [ ] Team operational capacity assessed (can you manage N databases?)
- [ ] Cross-tenant analytics requirements documented
- [ ] Backup and restore requirements per tenant documented
- [ ] Strategy documented in architecture decision record (ADR)
