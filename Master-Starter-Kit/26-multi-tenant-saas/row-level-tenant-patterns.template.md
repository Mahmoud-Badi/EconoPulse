# Row-Level Tenant Isolation Patterns

> Implementation patterns for row-level multi-tenancy in {{PROJECT_NAME}}. Covers the `tenant_id` column pattern, PostgreSQL Row-Level Security, ORM-specific filters, composite indexes, migration strategies, and testing patterns. Every tenant-scoped table MUST include `{{TENANT_ID_FIELD}}` — no exceptions.

---

## Prerequisites

- Database: {{DATABASE}}
- ORM: {{ORM}}
- Isolation strategy: {{TENANT_STRATEGY}}
- Tenant ID field name: `{{TENANT_ID_FIELD}}`

---

## 1. Tenants Table (Foundation)

Every multi-tenant system starts with the `tenants` table. This is the source of truth for all tenant metadata.

```sql
-- Core tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  -- active | trial | suspended | churned | deleted
  owner_user_id UUID, -- first admin user, set after user creation
  settings JSONB NOT NULL DEFAULT '{}',
  branding JSONB NOT NULL DEFAULT '{}',
  -- { "logo": "url", "primaryColor": "#000", "faviconUrl": "url" }
  custom_domain VARCHAR(255),
  trial_ends_at TIMESTAMP,
  suspended_at TIMESTAMP,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;
```

---

## 2. Adding `{{TENANT_ID_FIELD}}` to Every Tenant-Scoped Table

### The Rule

Every table that contains tenant-specific data MUST have a `{{TENANT_ID_FIELD}}` column. There are no exceptions. If you are unsure whether a table is tenant-scoped, it probably is.

### Tables That Are NOT Tenant-Scoped (Shared Reference Data)

| Table | Why it's shared |
|-------|----------------|
| `tenants` | It IS the tenant table |
| `plans` / `plan_definitions` | Global pricing tiers |
| `permissions` / `roles_definitions` | System-wide role templates |
| `countries` / `currencies` | Reference data |
| `feature_flags_definitions` | Global flag definitions (overrides ARE tenant-scoped) |
| `system_settings` | Platform-wide configuration |

### SQL Pattern

```sql
-- Every tenant-scoped table follows this pattern
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  {{TENANT_ID_FIELD}} UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CRITICAL: Composite index with tenant_id FIRST
CREATE INDEX idx_projects_tenant ON projects({{TENANT_ID_FIELD}}, id);
CREATE INDEX idx_projects_tenant_name ON projects({{TENANT_ID_FIELD}}, name);
CREATE INDEX idx_projects_tenant_created ON projects({{TENANT_ID_FIELD}}, created_at DESC);
```

<!-- IF {{ORM}} == "drizzle" -->
### Drizzle ORM: Tenant Columns Helper

```typescript
// src/db/tenant-columns.ts
import { uuid, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./schema/tenants";

/**
 * Add these columns to every tenant-scoped table.
 * Extends the baseColumns pattern from 02-architecture.
 */
export const tenantColumns = {
  tenantId: uuid("{{TENANT_ID_FIELD}}")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
};

/**
 * Full base columns for tenant-scoped tables.
 * Combines the standard baseColumns with tenant scoping.
 */
export const tenantBaseColumns = {
  id: uuid("id").primaryKey().defaultRandom(),
  ...tenantColumns,
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};
```

```typescript
// src/db/schema/projects.ts
import { pgTable, varchar, text, uuid } from "drizzle-orm/pg-core";
import { tenantBaseColumns } from "../tenant-columns";

export const projects = pgTable("projects", {
  ...tenantBaseColumns,
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by").notNull(),
});
```
<!-- ENDIF -->

<!-- IF {{ORM}} == "prisma" -->
### Prisma: Tenant Model Pattern

```prisma
// prisma/schema.prisma

model Tenant {
  id            String   @id @default(uuid())
  name          String
  slug          String   @unique
  plan          String   @default("free")
  status        String   @default("active")
  settings      Json     @default("{}")
  branding      Json     @default("{}")
  customDomain  String?  @map("custom_domain")
  trialEndsAt   DateTime? @map("trial_ends_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  users         User[]
  projects      Project[]

  @@map("tenants")
}

model Project {
  id          String   @id @default(uuid())
  tenantId    String   @map("{{TENANT_ID_FIELD}}")
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  description String?
  createdBy   String   @map("created_by")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([tenantId])
  @@index([tenantId, name])
  @@map("projects")
}
```
<!-- ENDIF -->

---

## 3. PostgreSQL Row-Level Security (RLS)

RLS is your safety net. Even if application code has a bug that omits the tenant filter, the database itself will reject cross-tenant access.

### Enable RLS on Every Tenant-Scoped Table

```sql
-- Enable RLS (does nothing until policies are created)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- Repeat for EVERY tenant-scoped table

-- IMPORTANT: Force RLS even for table owners (superusers bypass RLS by default)
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE projects FORCE ROW LEVEL SECURITY;
-- Repeat for every table
```

### Create Isolation Policies

```sql
-- Policy: rows are visible only when tenant_id matches the session variable
CREATE POLICY tenant_isolation_select ON users
  FOR SELECT
  USING ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_insert ON users
  FOR INSERT
  WITH CHECK ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_update ON users
  FOR UPDATE
  USING ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid)
  WITH CHECK ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY tenant_isolation_delete ON users
  FOR DELETE
  USING ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid);

-- Shorthand: single policy for all operations
CREATE POLICY tenant_isolation ON projects
  USING ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid)
  WITH CHECK ({{TENANT_ID_FIELD}} = current_setting('app.current_tenant_id')::uuid);
```

### Set Tenant Context Per Request

```sql
-- At the start of every request/transaction, set the tenant context
SET LOCAL app.current_tenant_id = 'tenant-uuid-here';
-- LOCAL ensures it only applies to the current transaction

-- Now all queries are automatically filtered
SELECT * FROM projects; -- Only returns projects for 'tenant-uuid-here'
INSERT INTO projects (id, {{TENANT_ID_FIELD}}, name)
  VALUES (gen_random_uuid(), 'wrong-tenant-id', 'test');
-- ERROR: new row violates row-level security policy
```

### Super Admin Bypass

```sql
-- Create a role for super admin operations (cross-tenant access)
CREATE ROLE super_admin;

-- Policies with BYPASSRLS privilege
ALTER ROLE super_admin BYPASSRLS;

-- OR: create explicit policies for the admin role
CREATE POLICY super_admin_access ON users
  FOR ALL
  USING (current_setting('app.is_super_admin', true)::boolean = true);
```

### RLS Helper Script (Apply to All Tables)

```sql
-- Function to apply RLS to all tenant-scoped tables
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = '{{TENANT_ID_FIELD}}'
      AND table_schema = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl.table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl.table_name);
    EXECUTE format(
      'CREATE POLICY IF NOT EXISTS tenant_isolation ON %I
       USING (%s = current_setting(''app.current_tenant_id'')::uuid)
       WITH CHECK (%s = current_setting(''app.current_tenant_id'')::uuid)',
      tbl.table_name, '{{TENANT_ID_FIELD}}', '{{TENANT_ID_FIELD}}'
    );
    RAISE NOTICE 'RLS enabled on %', tbl.table_name;
  END LOOP;
END $$;
```

---

## 4. ORM Integration Patterns

<!-- IF {{ORM}} == "drizzle" -->
### Drizzle ORM: Tenant-Scoped Queries

```typescript
// src/db/tenant-context.ts
import { eq, and, SQL } from "drizzle-orm";
import { AsyncLocalStorage } from "node:async_hooks";

// Store tenant context per request using AsyncLocalStorage
const tenantStorage = new AsyncLocalStorage<{ tenantId: string }>();

export function getCurrentTenantId(): string {
  const store = tenantStorage.getStore();
  if (!store?.tenantId) {
    throw new Error("Tenant context not set. This is a bug — every request must have tenant context.");
  }
  return store.tenantId;
}

export function runWithTenant<T>(tenantId: string, fn: () => T): T {
  return tenantStorage.run({ tenantId }, fn);
}

// Middleware (Express/Hono/Fastify)
export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const tenantId = extractTenantIdFromJWT(req);
  if (!tenantId) {
    return res.status(401).json({ error: "Missing tenant context" });
  }

  runWithTenant(tenantId, () => {
    next();
  });
}
```

```typescript
// src/db/tenant-queries.ts
import { db } from "./client";
import { projects } from "./schema/projects";
import { eq, and } from "drizzle-orm";
import { getCurrentTenantId } from "./tenant-context";

// PATTERN: Always include tenant filter
export async function getProjects() {
  const tenantId = getCurrentTenantId();
  return db
    .select()
    .from(projects)
    .where(eq(projects.tenantId, tenantId));
}

export async function getProjectById(projectId: string) {
  const tenantId = getCurrentTenantId();
  return db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.tenantId, tenantId),
        eq(projects.id, projectId)
      )
    )
    .then((rows) => rows[0] ?? null);
}

export async function createProject(data: { name: string; description?: string }) {
  const tenantId = getCurrentTenantId();
  return db.insert(projects).values({
    tenantId,
    name: data.name,
    description: data.description,
    createdBy: getCurrentUserId(), // from auth context
  }).returning();
}

export async function updateProject(projectId: string, data: Partial<{ name: string; description: string }>) {
  const tenantId = getCurrentTenantId();
  return db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(projects.tenantId, tenantId),
        eq(projects.id, projectId)
      )
    )
    .returning();
}

export async function deleteProject(projectId: string) {
  const tenantId = getCurrentTenantId();
  return db
    .delete(projects)
    .where(
      and(
        eq(projects.tenantId, tenantId),
        eq(projects.id, projectId)
      )
    );
}
```

```typescript
// src/db/rls-context.ts — Set RLS context at the database level
import { sql } from "drizzle-orm";
import { db } from "./client";

export async function setTenantRLSContext(tenantId: string) {
  await db.execute(sql`SET LOCAL app.current_tenant_id = ${tenantId}`);
}

// Use in transaction
export async function withTenantTransaction<T>(
  tenantId: string,
  fn: (tx: Transaction) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.current_tenant_id = ${tenantId}`);
    return fn(tx);
  });
}
```
<!-- ENDIF -->

<!-- IF {{ORM}} == "prisma" -->
### Prisma: Tenant Middleware

```typescript
// src/db/prisma-tenant.ts
import { PrismaClient } from "@prisma/client";
import { AsyncLocalStorage } from "node:async_hooks";

const tenantStorage = new AsyncLocalStorage<{ tenantId: string }>();

export function getCurrentTenantId(): string {
  const store = tenantStorage.getStore();
  if (!store?.tenantId) {
    throw new Error("Tenant context not set.");
  }
  return store.tenantId;
}

export function runWithTenant<T>(tenantId: string, fn: () => T): T {
  return tenantStorage.run({ tenantId }, fn);
}

// Prisma client with automatic tenant filtering
const prisma = new PrismaClient();

// Middleware: auto-inject tenantId on queries
prisma.$use(async (params, next) => {
  // Tables that are NOT tenant-scoped
  const globalModels = ["Tenant", "Plan", "Permission", "Country", "Currency"];
  if (globalModels.includes(params.model ?? "")) {
    return next(params);
  }

  const tenantId = getCurrentTenantId();

  // Inject tenant filter on reads
  if (["findUnique", "findFirst", "findMany", "count", "aggregate"].includes(params.action)) {
    params.args = params.args ?? {};
    params.args.where = {
      ...params.args.where,
      tenantId,
    };
  }

  // Inject tenant_id on creates
  if (["create", "createMany"].includes(params.action)) {
    if (params.action === "create") {
      params.args.data = { ...params.args.data, tenantId };
    }
    if (params.action === "createMany") {
      params.args.data = params.args.data.map((d: any) => ({ ...d, tenantId }));
    }
  }

  // Inject tenant filter on updates/deletes
  if (["update", "updateMany", "delete", "deleteMany"].includes(params.action)) {
    params.args.where = {
      ...params.args.where,
      tenantId,
    };
  }

  return next(params);
});

export { prisma };
```

```typescript
// Usage — tenant filter is automatic via middleware
import { prisma } from "./prisma-tenant";
import { runWithTenant } from "./prisma-tenant";

// In your route handler (after auth middleware sets tenant context):
app.get("/api/projects", async (req, res) => {
  const tenantId = req.auth.tenantId;

  const projects = await runWithTenant(tenantId, () =>
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })
  );
  // tenantId filter was injected automatically by middleware

  res.json(projects);
});
```
<!-- ENDIF -->

---

## 5. Composite Index Strategy

Indexes on tenant-scoped tables MUST include `{{TENANT_ID_FIELD}}` as the first column. Without this, the database performs a full table scan filtered by tenant — which gets slower as total row count grows across all tenants.

```sql
-- BAD: Index without tenant_id — useless for tenant-scoped queries
CREATE INDEX idx_projects_name ON projects(name);

-- GOOD: Composite index with tenant_id first
CREATE INDEX idx_projects_tenant_name ON projects({{TENANT_ID_FIELD}}, name);

-- Common composite indexes for tenant-scoped tables
CREATE INDEX idx_projects_tenant_created ON projects({{TENANT_ID_FIELD}}, created_at DESC);
CREATE INDEX idx_projects_tenant_status ON projects({{TENANT_ID_FIELD}}, status);
CREATE INDEX idx_users_tenant_email ON users({{TENANT_ID_FIELD}}, email);
CREATE INDEX idx_documents_tenant_project ON documents({{TENANT_ID_FIELD}}, project_id);

-- Unique constraints must include tenant_id
-- BAD: email unique globally (prevents same email in different tenants)
-- ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- GOOD: email unique per tenant
ALTER TABLE users ADD CONSTRAINT unique_email_per_tenant UNIQUE ({{TENANT_ID_FIELD}}, email);
```

### Index Sizing Guidance

| Table Size (all tenants) | Index Type | Recommendation |
|--------------------------|-----------|----------------|
| < 100K rows | B-tree composite | Standard approach |
| 100K - 10M rows | B-tree composite + partial | Add partial indexes for hot queries |
| 10M+ rows | Partitioned by tenant_id | Consider table partitioning |

---

## 6. Migration Patterns: Single-Tenant to Multi-Tenant

### Phase 1: Add Infrastructure (No Breaking Changes)

```sql
-- 1. Create tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert default tenant
INSERT INTO tenants (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', '{{PROJECT_NAME}} Default', 'default');
```

### Phase 2: Add tenant_id Columns (Nullable First)

```sql
-- 3. Add nullable tenant_id to all tables
ALTER TABLE users ADD COLUMN {{TENANT_ID_FIELD}} UUID REFERENCES tenants(id);
ALTER TABLE projects ADD COLUMN {{TENANT_ID_FIELD}} UUID REFERENCES tenants(id);
ALTER TABLE documents ADD COLUMN {{TENANT_ID_FIELD}} UUID REFERENCES tenants(id);

-- 4. Backfill with default tenant
UPDATE users SET {{TENANT_ID_FIELD}} = '00000000-0000-0000-0000-000000000001' WHERE {{TENANT_ID_FIELD}} IS NULL;
UPDATE projects SET {{TENANT_ID_FIELD}} = '00000000-0000-0000-0000-000000000001' WHERE {{TENANT_ID_FIELD}} IS NULL;
UPDATE documents SET {{TENANT_ID_FIELD}} = '00000000-0000-0000-0000-000000000001' WHERE {{TENANT_ID_FIELD}} IS NULL;
```

### Phase 3: Enforce Constraints

```sql
-- 5. Make tenant_id NOT NULL
ALTER TABLE users ALTER COLUMN {{TENANT_ID_FIELD}} SET NOT NULL;
ALTER TABLE projects ALTER COLUMN {{TENANT_ID_FIELD}} SET NOT NULL;
ALTER TABLE documents ALTER COLUMN {{TENANT_ID_FIELD}} SET NOT NULL;

-- 6. Add composite indexes
CREATE INDEX idx_users_tenant ON users({{TENANT_ID_FIELD}}, id);
CREATE INDEX idx_projects_tenant ON projects({{TENANT_ID_FIELD}}, id);

-- 7. Update unique constraints to be per-tenant
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users ADD CONSTRAINT users_email_tenant_unique UNIQUE ({{TENANT_ID_FIELD}}, email);
```

### Phase 4: Enable RLS and Deploy Middleware

```sql
-- 8. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ... all tables

-- 9. Create policies (see Section 3 above)
```

---

## 7. Testing Patterns

### Test Setup: Two-Tenant Isolation

```typescript
// test/helpers/tenant-setup.ts
import { db } from "../../src/db/client";
import { tenants, users, projects } from "../../src/db/schema";

export async function createTestTenants() {
  const [tenantA] = await db.insert(tenants).values({
    name: "Tenant A (Test)",
    slug: "tenant-a-test",
    plan: "pro",
  }).returning();

  const [tenantB] = await db.insert(tenants).values({
    name: "Tenant B (Test)",
    slug: "tenant-b-test",
    plan: "pro",
  }).returning();

  // Create users in each tenant
  const [userA] = await db.insert(users).values({
    tenantId: tenantA.id,
    email: "admin@tenant-a.test",
    name: "Admin A",
    role: "admin",
  }).returning();

  const [userB] = await db.insert(users).values({
    tenantId: tenantB.id,
    email: "admin@tenant-b.test",
    name: "Admin B",
    role: "admin",
  }).returning();

  // Create data in each tenant
  const [projectA] = await db.insert(projects).values({
    tenantId: tenantA.id,
    name: "Project Alpha",
    createdBy: userA.id,
  }).returning();

  const [projectB] = await db.insert(projects).values({
    tenantId: tenantB.id,
    name: "Project Beta",
    createdBy: userB.id,
  }).returning();

  return { tenantA, tenantB, userA, userB, projectA, projectB };
}
```

### Test: Cross-Tenant Isolation

```typescript
// test/isolation/cross-tenant.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createTestTenants } from "../helpers/tenant-setup";
import { runWithTenant } from "../../src/db/tenant-context";
import { getProjects, getProjectById } from "../../src/db/tenant-queries";

describe("Cross-Tenant Isolation", () => {
  let fixtures: Awaited<ReturnType<typeof createTestTenants>>;

  beforeAll(async () => {
    fixtures = await createTestTenants();
  });

  it("Tenant A cannot see Tenant B projects", async () => {
    const projects = await runWithTenant(fixtures.tenantA.id, () =>
      getProjects()
    );

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe("Project Alpha");
    expect(projects.find((p) => p.name === "Project Beta")).toBeUndefined();
  });

  it("Tenant B cannot see Tenant A projects", async () => {
    const projects = await runWithTenant(fixtures.tenantB.id, () =>
      getProjects()
    );

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe("Project Beta");
  });

  it("Tenant A cannot access Tenant B project by ID", async () => {
    const project = await runWithTenant(fixtures.tenantA.id, () =>
      getProjectById(fixtures.projectB.id)
    );

    expect(project).toBeNull(); // Must not return cross-tenant data
  });

  it("Tenant A cannot update Tenant B project", async () => {
    const result = await runWithTenant(fixtures.tenantA.id, () =>
      updateProject(fixtures.projectB.id, { name: "Hacked" })
    );

    expect(result).toHaveLength(0); // No rows updated

    // Verify Tenant B's project is unchanged
    const project = await runWithTenant(fixtures.tenantB.id, () =>
      getProjectById(fixtures.projectB.id)
    );
    expect(project?.name).toBe("Project Beta");
  });

  it("Tenant A cannot delete Tenant B project", async () => {
    await runWithTenant(fixtures.tenantA.id, () =>
      deleteProject(fixtures.projectB.id)
    );

    // Verify Tenant B's project still exists
    const project = await runWithTenant(fixtures.tenantB.id, () =>
      getProjectById(fixtures.projectB.id)
    );
    expect(project).not.toBeNull();
  });
});
```

### Test: RLS Policy Verification

```typescript
// test/isolation/rls-verification.test.ts
import { describe, it, expect } from "vitest";
import { db } from "../../src/db/client";
import { sql } from "drizzle-orm";

describe("RLS Policy Verification", () => {
  it("query without tenant context returns no rows", async () => {
    // Do NOT set app.current_tenant_id
    const result = await db.execute(sql`SELECT * FROM projects`);
    expect(result.rows).toHaveLength(0); // RLS blocks all rows
  });

  it("query with tenant context returns only that tenant's rows", async () => {
    await db.execute(sql`SET LOCAL app.current_tenant_id = ${fixtures.tenantA.id}`);
    const result = await db.execute(sql`SELECT * FROM projects`);

    for (const row of result.rows) {
      expect(row.tenant_id).toBe(fixtures.tenantA.id);
    }
  });

  it("insert with wrong tenant_id is rejected by RLS", async () => {
    await db.execute(sql`SET LOCAL app.current_tenant_id = ${fixtures.tenantA.id}`);

    await expect(
      db.execute(sql`
        INSERT INTO projects (id, {{TENANT_ID_FIELD}}, name, created_by)
        VALUES (gen_random_uuid(), ${fixtures.tenantB.id}, 'Malicious', ${fixtures.userA.id})
      `)
    ).rejects.toThrow(); // RLS policy violation
  });
});
```

---

## 8. Request Lifecycle

```
1. HTTP Request arrives
        │
2. Auth middleware extracts JWT
        │
3. JWT contains tenant_id claim
        │
4. Tenant middleware:
   ├── Validates tenant exists and is active
   ├── Sets AsyncLocalStorage context (tenantId)
   └── Sets PostgreSQL RLS context (SET LOCAL app.current_tenant_id)
        │
5. Route handler executes
   ├── ORM queries auto-filtered by tenant (middleware or RLS)
   ├── File uploads scoped to tenant path
   └── Cache keys prefixed with tenant
        │
6. Response returned
        │
7. AsyncLocalStorage context automatically cleaned up
```

```typescript
// Full middleware example
import { AsyncLocalStorage } from "node:async_hooks";

const tenantStorage = new AsyncLocalStorage<{ tenantId: string; isSuperAdmin: boolean }>();

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Extract tenant from JWT
    const decoded = verifyJWT(req.headers.authorization);
    const tenantId = decoded.tenantId;
    const isSuperAdmin = decoded.role === "super_admin";

    // 2. Validate tenant is active (cache this — hit DB rarely)
    if (!isSuperAdmin) {
      const tenant = await getCachedTenant(tenantId);
      if (!tenant || tenant.status !== "active") {
        return res.status(403).json({
          error: "Tenant is not active",
          code: "TENANT_INACTIVE",
        });
      }
    }

    // 3. Set context for the request
    tenantStorage.run({ tenantId, isSuperAdmin }, async () => {
      // 4. Set PostgreSQL RLS context
      await db.execute(sql`SET LOCAL app.current_tenant_id = ${tenantId}`);

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication" });
  }
}
```

---

## 9. Checklist

- [ ] `tenants` table created with all required fields
- [ ] `{{TENANT_ID_FIELD}}` added to every tenant-scoped table
- [ ] PostgreSQL RLS enabled on every tenant-scoped table
- [ ] RLS policies created for SELECT, INSERT, UPDATE, DELETE
- [ ] ORM middleware or query helpers inject tenant filter
- [ ] Composite indexes include `{{TENANT_ID_FIELD}}` as first column
- [ ] Unique constraints are per-tenant (e.g., `UNIQUE(tenant_id, email)`)
- [ ] AsyncLocalStorage (or equivalent) stores tenant context per request
- [ ] JWT includes `tenant_id` claim
- [ ] Middleware validates tenant is active before processing request
- [ ] Two-tenant integration tests verify complete isolation
- [ ] RLS bypass configured for super admin operations
- [ ] Migration path documented for adding tenant_id to existing tables
