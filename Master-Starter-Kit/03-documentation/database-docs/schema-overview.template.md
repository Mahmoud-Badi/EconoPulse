# Database Schema Overview — {{PROJECT_NAME}}

> **Schema is the foundation.** Every API procedure, form, and page derives from the database schema. Get this right, and everything else follows.

---

## Database Configuration

| Aspect | Value |
|--------|-------|
| Database | PostgreSQL {{VERSION}} |
| ORM | Drizzle ORM {{VERSION}} |
| Host | {{DB_HOST}} ({{REGION}}) |
| Schema namespace | `{{SCHEMA_NAME}}` (e.g., pgSchema("v3")) |
| Connection | Pooled via {{POOLER}} |
| Migrations | `drizzle-kit generate` → `drizzle-kit push` |

---

## Domain Areas

Group tables by business domain. Each domain is a cohesive set of related tables.

| # | Domain | Tables | Description |
|---|--------|--------|-------------|
| 1 | {{DOMAIN_1}} | {{TABLE_COUNT}} | {{DESCRIPTION}} |
| 2 | {{DOMAIN_2}} | {{TABLE_COUNT}} | {{DESCRIPTION}} |
| 3 | {{DOMAIN_3}} | {{TABLE_COUNT}} | {{DESCRIPTION}} |
| 4 | {{DOMAIN_4}} | {{TABLE_COUNT}} | {{DESCRIPTION}} |
| 5 | {{DOMAIN_5}} | {{TABLE_COUNT}} | {{DESCRIPTION}} |
| 6 | System | {{TABLE_COUNT}} | Auth, settings, audit logs |

**Total tables:** {{TOTAL_TABLE_COUNT}}

---

## Tables by Domain

### Domain 1: {{DOMAIN_1_NAME}}

| Table | Purpose | Key Columns | Row Estimate |
|-------|---------|-------------|-------------|
| `{table_1}` | {{PURPOSE}} | id, name, status, companyId | {N} |
| `{table_2}` | {{PURPOSE}} | id, {table_1}Id, type | {N} |
| `{table_3}` | {{PURPOSE}} | id, {table_1}Id, {table_2}Id | {N} |

### Domain 2: {{DOMAIN_2_NAME}}

| Table | Purpose | Key Columns | Row Estimate |
|-------|---------|-------------|-------------|
| `{table_4}` | {{PURPOSE}} | id, name, email, role | {N} |
| `{table_5}` | {{PURPOSE}} | id, {table_4}Id, status | {N} |

### Domain 3: {{DOMAIN_3_NAME}}

| Table | Purpose | Key Columns | Row Estimate |
|-------|---------|-------------|-------------|
| `{table_6}` | {{PURPOSE}} | id, amount, status | {N} |
| `{table_7}` | {{PURPOSE}} | id, {table_6}Id, lineItem | {N} |

### System Tables

| Table | Purpose | Key Columns | Managed By |
|-------|---------|-------------|-----------|
| `users` | User accounts | id, name, email, role | Auth library |
| `sessions` | Active sessions | id, userId, token, expiresAt | Auth library |
| `accounts` | Auth providers | id, userId, provider, password | Auth library |
| `companies` | Multi-tenant orgs | id, name, settings | Manual |
| `audit_logs` | Change tracking | id, userId, action, entityType, entityId | Triggers |

---

## Relationships

### Has-Many (One-to-Many)

```
{parent_table} ──1:N──→ {child_table}     (via {child_table}.{parent}Id)
{parent_table} ──1:N──→ {child_table_2}   (via {child_table_2}.{parent}Id)
company        ──1:N──→ users              (via users.companyId)
company        ──1:N──→ {entity}           (via {entity}.companyId)
```

### Belongs-To (Many-to-One)

```
{child_table} ──N:1──→ {parent_table}     ({child_table}.{parent}Id → {parent}.id)
```

### Many-to-Many (Junction Tables)

```
{table_a} ──N:M──→ {table_b}  (via {junction_table}: {a}Id + {b}Id)
```

### Relationship Diagram

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│ {TABLE_1} │────→│ {TABLE_2}  │←────│ {TABLE_3} │
└──────────┘     └───────────┘     └──────────┘
      │                │
      │                ↓
      │          ┌───────────┐
      └─────────→│ {TABLE_4}  │
                 └───────────┘
```

> Create a more detailed diagram using your actual tables. ASCII art is fine — it lives in version control.

---

## Enum Definitions

Group enums by domain. These become `pgEnum` definitions in Drizzle schema.

### {{DOMAIN_1}} Enums

```typescript
// packages/db/src/schema/enums.ts

export const {entity}StatusEnum = pgEnum("{schema_name}_{entity}_status", [
  "{STATUS_1}",   // {description}
  "{STATUS_2}",   // {description}
  "{STATUS_3}",   // {description}
  "{STATUS_4}",   // {description}
]);

export const {entity}TypeEnum = pgEnum("{schema_name}_{entity}_type", [
  "{TYPE_1}",     // {description}
  "{TYPE_2}",     // {description}
]);
```

### {{DOMAIN_2}} Enums

```typescript
export const userRoleEnum = pgEnum("{schema_name}_user_role", [
  "{ROLE_1}",     // {description + permissions summary}
  "{ROLE_2}",     // {description + permissions summary}
  "{ROLE_3}",     // {description + permissions summary}
  "{ROLE_4}",     // {description + permissions summary}
]);
```

### System Enums

```typescript
export const auditActionEnum = pgEnum("{schema_name}_audit_action", [
  "create",
  "update",
  "delete",
  "status_change",
  "login",
  "logout",
]);
```

---

## Index Strategy

### Primary Keys
- Every table: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`

### Foreign Keys
- Every FK column gets an index (Drizzle does NOT auto-index FKs)
- Naming: `idx_{table}_{column}`

### Common Query Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| `{table}` | `idx_{table}_company` | `companyId` | Multi-tenant filtering |
| `{table}` | `idx_{table}_status` | `status` | Status filtering |
| `{table}` | `idx_{table}_created` | `createdAt DESC` | Chronological listing |
| `{table}` | `idx_{table}_search` | `name` (or GIN trigram) | Text search |

### Composite Indexes

```typescript
// For queries that filter by company AND status (very common)
index("idx_{table}_company_status").on({table}.companyId, {table}.status),

// For unique constraints
uniqueIndex("unq_{table}_{field}").on({table}.companyId, {table}.{field}),
```

### Index Rules

1. **Every FK gets an index** — Drizzle doesn't auto-create them
2. **Every `companyId` gets an index** — Multi-tenant queries always filter by company
3. **Composite indexes for common query patterns** — company+status, company+date
4. **Don't over-index** — Each index slows writes. Only index columns used in WHERE/ORDER BY
5. **GIN indexes for text search** — When LIKE queries aren't fast enough

---

## Common Column Patterns

Every table in the project uses these standard columns:

```typescript
// packages/db/src/schema/_shared.ts
import { uuid, timestamp } from "drizzle-orm/pg-core";

export const standardColumns = {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// Soft delete (optional — use when data must be recoverable)
export const softDeleteColumns = {
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedBy: uuid("deleted_by").references(() => users.id),
};
```

---

## Migration Strategy

1. **Edit schema** → Modify Drizzle schema files in `packages/db/src/schema/`
2. **Generate migration** → `pnpm db:generate` (creates SQL in `migrations/`)
3. **Review SQL** → Always review generated SQL before applying
4. **Apply migration** → `pnpm db:push` (applies to database)
5. **Update seed** → If schema changed, update seed data to match
6. **Test** → Run seed, verify data, test affected API procedures

> **Rule:** Use `drizzle-kit generate` (not `push` alone) for production. `push` is for dev iteration. `generate` creates versioned, reviewable SQL files.
