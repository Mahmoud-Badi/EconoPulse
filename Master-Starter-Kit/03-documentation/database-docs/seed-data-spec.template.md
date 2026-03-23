# Seed Data Specification — {{PROJECT_NAME}}

> **Seed data is not an afterthought.** Realistic seed data makes development faster, demos more convincing, and testing more reliable. Define the spec before writing a single seed file.

---

## Seed Architecture

### File Structure

```
packages/db/src/seed/
├── index.ts              — Orchestrator (runs all seed files in order)
├── 01-companies.ts       — Companies/tenants (must run first)
├── 02-users.ts           — Users with roles (depends on companies)
├── 03-{entity_1}.ts      — {ENTITY_1} (depends on companies)
├── 04-{entity_2}.ts      — {ENTITY_2} (depends on {entity_1})
├── 05-{entity_3}.ts      — {ENTITY_3} (depends on {entity_1}, {entity_2})
├── 06-{entity_4}.ts      — {ENTITY_4} (depends on {entity_3})
├── 07-{entity_5}.ts      — {ENTITY_5} (depends on {entity_4})
├── 08-{entity_6}.ts      — {ENTITY_6} (standalone or cross-cutting)
└── helpers.ts            — Shared faker utilities, random selectors
```

### Dependency Order

> **Critical:** Seed files MUST run in dependency order. A table with a foreign key must be seeded AFTER its parent table.

```
companies (no deps)
    ↓
users (→ companies)
    ↓
{entity_1} (→ companies)
    ↓
{entity_2} (→ companies, → {entity_1})
    ↓
{entity_3} (→ companies, → {entity_1}, → {entity_2})
    ↓
{entity_4} (→ {entity_3})
    ↓
{entity_5} (→ {entity_4}, → users)
    ↓
{entity_6} (→ companies, → {entity_3})
```

---

## Orchestrator Pattern

```typescript
// packages/db/src/seed/index.ts
import { db } from "../index";
import { sql } from "drizzle-orm";
import { seedCompanies } from "./01-companies";
import { seedUsers } from "./02-users";
import { seed{Entity1} } from "./03-{entity_1}";
// ... import all seed files

async function main() {
  console.log("Seeding database...\n");

  // Clean existing data (reverse dependency order)
  console.log("Cleaning existing data...");
  await db.execute(sql`TRUNCATE TABLE {schema}.{entity_6} CASCADE`);
  await db.execute(sql`TRUNCATE TABLE {schema}.{entity_5} CASCADE`);
  // ... all tables in reverse order
  await db.execute(sql`TRUNCATE TABLE {schema}.users CASCADE`);
  await db.execute(sql`TRUNCATE TABLE {schema}.companies CASCADE`);

  // Seed in dependency order
  const companies = await seedCompanies(db);
  console.log(`  Companies: ${companies.length}`);

  const users = await seedUsers(db, companies);
  console.log(`  Users: ${users.length}`);

  const {entity1}s = await seed{Entity1}(db, companies);
  console.log(`  {Entity1}: ${entity1s.length}`);

  // ... all seed files

  const totalRecords = companies.length + users.length + {entity1}s.length; // + ...
  console.log(`\nSeeding complete. ${totalRecords} total records.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
```

---

## Per-Table Seed Specifications

### Companies

| Field | Strategy | Example |
|-------|----------|---------|
| Count | {N} companies | 1 primary + {N-1} for multi-tenant testing |
| name | faker.company.name() | "Delta Transportation Services" |
| settings | Default JSON | `{ timezone: "America/New_York", currency: "USD" }` |

### Users

| Field | Strategy | Example |
|-------|----------|---------|
| Count | {N} users total | Distributed across companies |
| name | faker.person.fullName() | "Sarah Johnson" |
| email | Pattern: `{role}@{domain}` | admin@{domain}.com |
| password | Same for all dev users | "{{SEED_PASSWORD}}" (bcrypt hashed) |
| role | Distribution below | — |

**Role Distribution:**

| Role | Count | Purpose |
|------|-------|---------|
| {{ROLE_1}} (admin) | {N} | Full access testing |
| {{ROLE_2}} | {N} | Standard user testing |
| {{ROLE_3}} | {N} | Limited access testing |
| {{ROLE_4}} | {N} | Role-specific feature testing |

**Known Login Credentials (for dev/demo):**

| Email | Password | Role | Notes |
|-------|----------|------|-------|
| admin@{domain}.com | {{SEED_PASSWORD}} | Admin | Primary test account |
| {role2}@{domain}.com | {{SEED_PASSWORD}} | {Role2} | Standard user |
| {role3}@{domain}.com | {{SEED_PASSWORD}} | {Role3} | Limited user |

### {{ENTITY_1}} (e.g., Drivers, Vehicles, Facilities)

| Field | Strategy | Example |
|-------|----------|---------|
| Count | {N} records | |
| name | faker.person.fullName() or faker.company.name() | |
| status | Distribution: {X}% active, {Y}% inactive, {Z}% pending | |
| phone | faker.phone.number("(###) ###-####") | "(555) 234-5678" |
| address | faker.location (constrained to {{GEOGRAPHIC_SCOPE}}) | |

**Status Distribution:**

| Status | Percentage | Count | Purpose |
|--------|-----------|-------|---------|
| active | {X}% | {N} | Normal operations |
| inactive | {Y}% | {N} | Filter/archive testing |
| pending | {Z}% | {N} | Workflow testing |

### {{ENTITY_2}} (e.g., Trips, Orders, Tickets)

| Field | Strategy | Example |
|-------|----------|---------|
| Count | {N} records | The "main" entity — more records for realistic lists |
| status | Distribution below | |
| scheduledDate | Range: past 30 days to future 14 days | |
| amount | faker.number.int({ min: 2000, max: 25000 }) | Cents (20.00-250.00) |
| {fk_field}Id | Random from parent table | |

**Status Distribution:**

| Status | Percentage | Count | Purpose |
|--------|-----------|-------|---------|
| {{STATUS_1}} | {X}% | {N} | {{PURPOSE}} |
| {{STATUS_2}} | {Y}% | {N} | {{PURPOSE}} |
| {{STATUS_3}} | {Z}% | {N} | {{PURPOSE}} |
| {{STATUS_4}} | {W}% | {N} | {{PURPOSE}} |

**Date Distribution:**

| Time Range | Percentage | Purpose |
|-----------|-----------|---------|
| Past (completed) | 40% | Historical data, reports |
| Today | 15% | Dashboard, dispatch |
| Tomorrow | 10% | Upcoming work |
| This week | 20% | Near-term planning |
| Next week+ | 15% | Future scheduling |

### {{ENTITY_3}} (e.g., Invoices, Billing)

| Field | Strategy | Example |
|-------|----------|---------|
| Count | {N} records | |
| amount | Sum of related line items | Calculated |
| status | Distribution: {X}% paid, {Y}% sent, {Z}% overdue, {W}% draft | |
| dueDate | Past 30 days to future 30 days | |

---

## Geographic Scope

All address data should be constrained to realistic geography:

| Field | Strategy |
|-------|----------|
| City | faker.helpers.arrayElement(["{{CITY_1}}", "{{CITY_2}}", "{{CITY_3}}"]) |
| State | "{{STATE}}" |
| ZIP | faker.helpers.arrayElement(["{{ZIP_1}}", "{{ZIP_2}}", "{{ZIP_3}}"]) |
| Coordinates | Within bounding box: lat {{MIN_LAT}}-{{MAX_LAT}}, lng {{MIN_LNG}}-{{MAX_LNG}} |

---

## Faker Patterns

### Shared Helpers

```typescript
// packages/db/src/seed/helpers.ts
import { faker } from "@faker-js/faker";

// Set seed for reproducible data (same data every run)
faker.seed(42);

/** Pick a random item from an array */
export function pick<T>(arr: T[]): T {
  return faker.helpers.arrayElement(arr);
}

/** Pick N random items from an array (no duplicates) */
export function pickN<T>(arr: T[], count: number): T[] {
  return faker.helpers.arrayElements(arr, count);
}

/** Generate a weighted random status */
export function weightedStatus<T extends string>(
  distribution: { value: T; weight: number }[]
): T {
  return faker.helpers.weightedArrayElement(distribution);
}

/** Generate a date within a range */
export function dateInRange(daysBack: number, daysForward: number): Date {
  return faker.date.between({
    from: new Date(Date.now() - daysBack * 86400000),
    to: new Date(Date.now() + daysForward * 86400000),
  });
}

/** Generate a phone number in consistent format */
export function phone(): string {
  return faker.phone.number("(###) ###-####");
}

/** Generate an amount in cents */
export function amountCents(min: number, max: number): number {
  return faker.number.int({ min: min * 100, max: max * 100 });
}
```

---

## Summary

| Table | Records | Depends On |
|-------|---------|-----------|
| companies | {N} | — |
| users | {N} | companies |
| {table_1} | {N} | companies |
| {table_2} | {N} | companies, {table_1} |
| {table_3} | {N} | companies, {table_1}, {table_2} |
| {table_4} | {N} | {table_3} |
| {table_5} | {N} | {table_4}, users |
| {table_6} | {N} | companies, {table_3} |
| **Total** | **{{TOTAL}}** | |

### Run Command

```bash
cd {PROJECT_ROOT}/packages/db && npx tsx src/seed/index.ts
```

### Verify After Seeding

```bash
# Check record counts
pnpm db:studio  # Open Drizzle Studio and verify each table

# Or via SQL
psql $DATABASE_URL -c "SELECT '{table}' as t, count(*) FROM {schema}.{table} UNION ALL ..."
```
