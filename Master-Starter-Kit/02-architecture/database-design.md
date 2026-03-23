# Database Design Guide

## Purpose

This document defines the schema conventions and patterns that every table in the project must follow. These rules are non-negotiable — they prevent the most common database design mistakes that surface weeks or months into development.

---

## Rule 1: Every Table Gets the Base Columns

Every table in the project MUST have these columns:

| Column | Type | Default | Nullable | Purpose |
|--------|------|---------|----------|---------|
| `id` | `uuid` | `gen_random_uuid()` | NO | Primary key. Never auto-increment integers. |
| `createdAt` | `timestamp` | `now()` | NO | Record creation time. Never modified. |
| `updatedAt` | `timestamp` | `now()` | NO | Last modification time. Updated on every write. |

### Why UUID over Auto-Increment

- UUIDs prevent ID enumeration attacks (user can't guess `/api/trips/42`)
- UUIDs allow client-side ID generation (offline-first patterns)
- UUIDs work across distributed systems without coordination
- UUIDs prevent information leakage (competitor can't estimate your user count from `/users/50000`)

### Drizzle Implementation

```typescript
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

// Base column helper — use in every table
const baseColumns = {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

// Usage
export const users = pgTable("users", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
});
```

### Prisma Implementation

```prisma
// Base model pattern (Prisma doesn't support mixins, so copy these columns)
model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  email     String   @unique @db.VarChar(255)
  name      String   @db.VarChar(255)

  @@map("users")
}
```

---

## Rule 2: Status Fields Are Enums

**Never use `varchar` for status fields.** Always define a PostgreSQL enum type.

### Why Enums

- Database enforces valid values (no typos like `"actve"` instead of `"active"`)
- Self-documenting — schema shows all possible states
- Smaller storage than varchar
- Can be referenced in application code as a TypeScript type

### Drizzle Implementation

```typescript
import { pgEnum } from "drizzle-orm/pg-core";

// Define the enum
export const tripStatusEnum = pgEnum("trip_status", [
  "scheduled",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

// Use in table
export const trips = pgTable("trips", {
  ...baseColumns,
  status: tripStatusEnum("status").notNull().default("scheduled"),
});
```

### Prisma Implementation

```prisma
enum TripStatus {
  SCHEDULED
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

model Trip {
  // ...base columns...
  status TripStatus @default(SCHEDULED)
}
```

### Enum Naming Convention

- Enum type name: `{domain}_{field}` (e.g., `trip_status`, `invoice_status`, `driver_status`)
- Enum values: `snake_case` for PostgreSQL, `UPPER_SNAKE` for Prisma
- In TypeScript/application code: derive types from the ORM (never re-declare manually)

### Gotcha: Drizzle Enum Array Inserts

When inserting enum values from an array in Drizzle, TypeScript may widen the string literal type. Fix with `as const`:

```typescript
// BAD - TS2769 error
const statuses = ["scheduled", "assigned"];
db.insert(trips).values({ status: statuses[0] }); // Error: string not assignable to enum

// GOOD - as const preserves literal types
const statuses = ["scheduled", "assigned"] as const;
db.insert(trips).values({ status: statuses[0] }); // Works
```

---

## Rule 3: Soft Deletes

**Never hard-delete user-visible records.** Add a `deletedAt` timestamp column to every table that users interact with.

| Column | Type | Default | Nullable | Purpose |
|--------|------|---------|----------|---------|
| `deletedAt` | `timestamp` | `null` | YES | When non-null, record is "deleted" |

### Drizzle Implementation

```typescript
const softDeleteColumn = {
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const trips = pgTable("trips", {
  ...baseColumns,
  ...softDeleteColumn,
  // ... other columns
});
```

### Query Pattern

```typescript
// Always filter out soft-deleted records in default queries
const activeTrips = await db.query.trips.findMany({
  where: isNull(trips.deletedAt),
});

// Soft delete operation
await db.update(trips)
  .set({ deletedAt: new Date() })
  .where(eq(trips.id, tripId));

// Admin: include deleted records
const allTrips = await db.query.trips.findMany(); // No deletedAt filter
```

### When to Skip Soft Delete

- System tables (migrations, configs) — use hard delete
- High-volume ephemeral data (logs, events) — use TTL/partitioning instead
- GDPR/privacy compliance may require actual deletion — handle via a separate purge process

---

## Rule 4: Multi-Tenant Isolation

Every user-owned table MUST have an `organizationId` foreign key. This enables multi-tenant data isolation.

```typescript
const tenantColumn = {
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
};

export const trips = pgTable("trips", {
  ...baseColumns,
  ...tenantColumn,
  // ... other columns
});
```

### Query Pattern

```typescript
// ALWAYS include organizationId in queries
const trips = await db.query.trips.findMany({
  where: and(
    eq(trips.organizationId, ctx.session.organizationId),
    isNull(trips.deletedAt),
  ),
});
```

### When to Skip organizationId

- The `organizations` table itself
- The `users` table (users belong to orgs via a join table or direct FK)
- System-wide lookup tables (states, zip codes, vehicle types)
- Single-tenant applications (but consider adding it anyway for future-proofing)

---

## Rule 5: Audit Trail

Every mutable table should have a `createdBy` foreign key. For tables where knowing who modified a record matters, add `updatedBy` as well.

```typescript
const auditColumns = {
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: uuid("updated_by")
    .references(() => users.id),
};

export const trips = pgTable("trips", {
  ...baseColumns,
  ...auditColumns,
  // ... other columns
});
```

### When Full Audit Logging is Needed

For regulatory or compliance requirements (healthcare, finance), consider a separate `audit_log` table:

```typescript
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: uuid("record_id").notNull(),
  action: pgEnum("audit_action", ["create", "update", "delete"])("action").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  changes: jsonb("changes"), // { before: {...}, after: {...} }
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});
```

---

## Rule 6: Index Strategy

### Mandatory Indexes

| What | Why | Example |
|------|-----|---------|
| Every foreign key | JOIN performance | `organizationId`, `createdBy`, `driverId` |
| Every unique constraint | Already an index, but document it | `email`, `licensePlate` |
| Status + organizationId (composite) | Most common filter combination | `(organizationId, status)` |
| Date range + organizationId (composite) | Dashboard/reporting queries | `(organizationId, createdAt)` |

### Drizzle Index Pattern

```typescript
import { pgTable, index, uniqueIndex } from "drizzle-orm/pg-core";

export const trips = pgTable("trips", {
  ...baseColumns,
  organizationId: uuid("organization_id").notNull(),
  status: tripStatusEnum("status").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  driverId: uuid("driver_id"),
}, (table) => [
  // FK indexes
  index("trips_organization_id_idx").on(table.organizationId),
  index("trips_driver_id_idx").on(table.driverId),

  // Composite indexes for common queries
  index("trips_org_status_idx").on(table.organizationId, table.status),
  index("trips_org_date_idx").on(table.organizationId, table.scheduledDate),
]);
```

### Prisma Index Pattern

```prisma
model Trip {
  // ... columns ...

  @@index([organizationId])
  @@index([driverId])
  @@index([organizationId, status])
  @@index([organizationId, scheduledDate])
}
```

### Index Naming Convention

- Single column: `{table}_{column}_idx`
- Composite: `{table}_{col1}_{col2}_idx`
- Unique: `{table}_{column}_unique`

### When to Skip an Index

- Columns that are only used in INSERT (never queried)
- Boolean columns with low cardinality (use partial indexes instead)
- Tables with fewer than 1,000 rows (full scan is faster than index lookup)

---

## Rule 7: Money in Integer Cents

**Never use `float`, `double`, or `decimal` for money.** Store monetary values as integer cents.

```typescript
// BAD
price: doublePrecision("price"), // 19.99 might become 19.990000000000002

// GOOD
priceInCents: integer("price_in_cents").notNull(), // 1999 = $19.99
```

### Conversion Pattern

```typescript
// Application layer conversion
const displayPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

const toCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};
```

### Why Integer Cents

- No floating point precision errors (`0.1 + 0.2 !== 0.3` in JavaScript)
- Simple arithmetic (add, subtract, multiply — never divide cents by cents)
- Database SUM/AVG operations are exact
- Industry standard (Stripe, every payment processor uses cents)

---

## Rule 8: pgSchema for Database Isolation

When sharing a database instance across multiple projects or versions, use PostgreSQL schemas to isolate data.

### Drizzle Implementation

```typescript
import { pgSchema } from "drizzle-orm/pg-core";

// All V3 tables live in the "v3" schema
export const v3Schema = pgSchema("v3");

export const users = v3Schema.table("users", {
  ...baseColumns,
  email: varchar("email", { length: 255 }).notNull().unique(),
});
```

### Benefits

- V1, V2, V3 can coexist in one database (Supabase free tier = 1 DB)
- No table name collisions
- Can query across schemas when needed (migration scripts)
- Easy cleanup: `DROP SCHEMA v3 CASCADE` removes everything

### Gotcha

> `drizzle-kit push` has enum qualification bugs with `pgSchema`. Enums get generated as `"v3"."status_enum"` which fails. **Always use `drizzle-kit generate` + `drizzle-kit migrate`** for production schemas with `pgSchema`.

---

## Schema Design Checklist

For every new table, verify:

- [ ] Has `id` (uuid), `createdAt`, `updatedAt` base columns
- [ ] Status fields use enums (not varchar)
- [ ] Has `deletedAt` if user-visible (soft delete)
- [ ] Has `organizationId` if user-owned (multi-tenant)
- [ ] Has `createdBy` if mutable (audit trail)
- [ ] Money stored as integer cents
- [ ] Every FK has an index
- [ ] Common filter combos have composite indexes
- [ ] Column types are correct (varchar length, timestamp with timezone)
- [ ] Relationships documented in relations file
- [ ] Enum values are complete for the domain

---

## Common Patterns

### Polymorphic References (Avoid When Possible)

```typescript
// AVOID: type + id pattern
noteableType: varchar("noteable_type"), // "trip" | "driver" | "vehicle"
noteableId: uuid("noteable_id"),

// PREFER: separate FK columns (nullable)
tripId: uuid("trip_id").references(() => trips.id),
driverId: uuid("driver_id").references(() => drivers.id),
vehicleId: uuid("vehicle_id").references(() => vehicles.id),
```

Separate FKs are queryable, indexable, and type-safe. Polymorphic references lose all three.

### Lookup / Reference Tables

```typescript
// For static data that rarely changes
export const vehicleTypes = pgTable("vehicle_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});
```

### Junction Tables (Many-to-Many)

```typescript
export const userOrganizations = pgTable("user_organizations", {
  userId: uuid("user_id").notNull().references(() => users.id),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  role: userRoleEnum("role").notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  // Composite primary key
  primaryKey({ columns: [table.userId, table.organizationId] }),
  index("user_orgs_org_idx").on(table.organizationId),
]);
```

### JSONB for Flexible Data

```typescript
// Use JSONB for data that varies per record but doesn't need relational queries
export const integrationConfigs = pgTable("integration_configs", {
  ...baseColumns,
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  config: jsonb("config").notNull(), // { apiKey, webhookUrl, settings: {...} }
});
```

**Rule:** If you need to filter or join on a field, it should be a column, not inside JSONB.
