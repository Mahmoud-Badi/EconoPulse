# Database Gotchas

Database issues are the hardest to debug because they often manifest as "the data is just wrong" with no clear error message.

---

## Drizzle ORM

### drizzle-kit generate vs drizzle-kit push

```bash
# USE THIS — generates SQL migration files you can review and version control
drizzle-kit generate

# AVOID THIS for pgSchema — has bugs with enum qualification
drizzle-kit push
```

**What goes wrong with push + pgSchema:** When using `pgSchema("v3")`, the `push` command generates SQL that references enums without the schema prefix. For example, it creates `status_enum` instead of `v3.status_enum`, causing PostgreSQL errors.

**Fix:** Always use `generate` to create migration files, then `migrate` to apply them. Review the generated SQL before applying.

---

### Enum String Literals Need `as const`

```typescript
// WRONG — TypeScript widens ["ACTIVE", "INACTIVE"] to string[]
await db.insert(trips).values([
  { status: "ACTIVE" },    // Error: TS2769
  { status: "INACTIVE" },
]);

// CORRECT — as const preserves literal types
const values = [
  { status: "ACTIVE" as const },
  { status: "INACTIVE" as const },
];
await db.insert(trips).values(values);

// ALSO CORRECT — inline without variable
await db.insert(trips).values({
  status: "ACTIVE",  // Works for single insert (literal inferred)
});
```

**Symptom:** TypeScript error TS2769: "No overload matches this call" when inserting arrays with enum columns.
**Root cause:** TypeScript widens string literals in arrays to `string`, which does not match the enum type.
**Fix:** Add `as const` to enum values, or type the array explicitly.

---

### pgSchema Isolation

```typescript
import { pgSchema } from "drizzle-orm/pg-core";

// All tables created under the "v3" PostgreSQL schema
export const schema = pgSchema("v3");

// Creates table as v3.users, not public.users
export const users = schema.table("users", { /* ... */ });
```

**When to use:** When sharing a Supabase (or any PostgreSQL) database between multiple applications or versions. V1 tables live in `public`, V3 tables live in `v3` — no conflicts.

**Gotcha:** You must create the schema before running migrations:
```sql
CREATE SCHEMA IF NOT EXISTS v3;
```

---

### $onUpdate for updatedAt

```typescript
export const users = schema.table("users", {
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),  // Auto-updates on every update query
});
```

**Gotcha:** `$onUpdate` is a Drizzle-level hook, not a database trigger. It only works when you update through Drizzle. Direct SQL updates will not trigger it.

---

### noUncheckedIndexedAccess and Object Lookups

With `noUncheckedIndexedAccess: true` in tsconfig, object property access via bracket notation returns `T | undefined`:

```typescript
const statusMap: Record<string, string> = { ACTIVE: "Active", INACTIVE: "Inactive" };

// TypeScript says: string | undefined
const label = statusMap[status];

// If you KNOW the key exists, assert with !
const label = statusMap[status]!;

// Or use a type guard
const label = statusMap[status] ?? "Unknown";
```

**Symptom:** TypeScript errors like "Object is possibly undefined" on lookups you know are safe.
**Fix:** Use `!` (non-null assertion) when you are certain the key exists, or `??` (nullish coalescing) for a fallback.

---

## Supabase

### postgres.js Requires Explicit SSL

```typescript
// WRONG — URL sslmode parameter is IGNORED by postgres.js
const client = postgres("postgresql://...?sslmode=require");

// CORRECT — explicit ssl option
const client = postgres("postgresql://...", {
  ssl: "require",
});
```

**Symptom:** Connection hangs or times out. No error message — just silence.
**Root cause:** postgres.js does not parse the `sslmode` query parameter from the connection URL. It silently attempts an unencrypted connection, which Supabase rejects.
**Fix:** Always set `ssl: "require"` in the postgres.js options object.

---

### Pooler vs Session Connection

| Connection Type | Port | Use For | `DATABASE_URL` |
|----------------|------|---------|----------------|
| Pooler (Transaction) | 6543 | Application queries | Yes |
| Session (Direct) | 5432 | Migrations, schema changes | `DIRECT_URL` |

**Gotcha:** Using the session connection (port 5432) for application queries will hit the connection limit quickly (25 for free tier). Always use the pooler connection for your app.

**Gotcha:** Using the pooler connection for migrations can cause "prepared statement already exists" errors. Always use the session connection for `drizzle-kit` commands.

---

### Connection Limits

| Plan | Connection Limit |
|------|-----------------|
| Free | 25 concurrent |
| Pro | 100 concurrent |

**Symptom:** Random "too many connections" errors under load.
**Fix:** Configure `max` in postgres.js options:
```typescript
const client = postgres(url, {
  ssl: "require",
  max: 10,              // Stay well under the limit
  idle_timeout: 20,     // Release idle connections
});
```

---

## Prisma

### Generate After Every Schema Change

```bash
# After editing schema.prisma:
npx prisma generate    # Regenerates the client
npx prisma db push     # Applies to database (dev only)
# OR
npx prisma migrate dev # Creates migration + applies (dev)
```

**Symptom:** Your code references a new column but TypeScript says it does not exist. Or: queries return old column names.
**Root cause:** Prisma client is generated code. After changing the schema file, the client is stale until regenerated.
**Fix:** Run `npx prisma generate` after every schema change.

---

### db push vs migrate

| Command | Use Case | Creates Migration File? |
|---------|----------|------------------------|
| `prisma db push` | Prototyping, rapid iteration | No |
| `prisma migrate dev` | Production-path development | Yes |

**Rule:** Use `db push` only during initial prototyping. Switch to `migrate` before your first real deployment. Schema drift (database state diverging from migration history) is a nightmare to fix.

---

## General Database Gotchas

### Always Store Money as Integer Cents

```typescript
// WRONG — floating point rounding errors
fareAmount: real("fare_amount"),  // 19.99 might become 19.989999999

// CORRECT — store as cents, format for display
fareAmountCents: integer("fare_amount_cents"),  // 1999 = $19.99

// Display utility
function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
```

**Symptom:** Invoice totals are off by a penny. `$19.99 + $10.01 = $29.999999999`.
**Fix:** Store all monetary values as integer cents. Format for display only at the UI layer.

---

### Always Add Timestamps to Every Table

```typescript
export const entities = schema.table("entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ... domain columns ...
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  deletedAt: timestamp("deleted_at"),  // Soft delete support
});
```

**Why:** You will always need to know when a record was created, when it was last changed, and whether it has been "deleted" without actually removing the data. Adding these retroactively requires a migration on every table.

---

### Always Use UUID Primary Keys

```typescript
// WRONG for distributed systems
id: serial("id").primaryKey(),

// CORRECT
id: uuid("id").primaryKey().defaultRandom(),
```

**Why:** Auto-increment IDs leak information (user count, record creation rate), cause conflicts in distributed systems, and make ID guessing attacks trivial. UUIDs solve all three.

---

### Index Every Foreign Key Column

```typescript
export const trips = schema.table("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  driverId: uuid("driver_id").references(() => drivers.id),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  // ...
}, (table) => ({
  driverIdx: index("trips_driver_id_idx").on(table.driverId),
  vehicleIdx: index("trips_vehicle_id_idx").on(table.vehicleId),
}));
```

**Symptom:** Queries that join or filter by foreign key are slow (full table scan).
**Fix:** PostgreSQL does NOT auto-index foreign key columns (unlike some other databases). Add indexes explicitly.

---

### SQL Date vs JavaScript Date

```sql
-- SQL: returns date as string "2026-01-15"
SELECT created_at::date FROM trips;

-- JavaScript: new Date() includes time component
new Date("2026-01-15")  // Could be Jan 14 or 15 depending on timezone
```

**Symptom:** Dashboard shows data for "today" but the chart shows yesterday's data. Or: date filters are off by one day.
**Root cause:** SQL `::date` casts strip time and timezone. JavaScript `new Date()` uses the local timezone, which may shift the date.
**Fix:** Use consistent date handling. Either always work in UTC, or always convert at the display layer.
