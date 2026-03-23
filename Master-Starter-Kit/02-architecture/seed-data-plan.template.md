# Seed Data Plan: {{PROJECT_NAME}}

## Overview

**Total Tables to Seed:** {{COUNT}}
**Total Estimated Records:** {{COUNT}}
**Execution Time Target:** < 30 seconds
**Reproducibility:** `faker.seed(42)` — same data every run
**Default Test Credentials:** `{{DEFAULT_PASSWORD}}` (e.g., `Password123!`)

Seed data serves two purposes:
1. **Development** — Realistic data to build and test UI against
2. **Demo** — Impressive-looking data for presentations and stakeholder reviews

---

## Design Principles

### 1. Reproducible
Every seed run produces identical data. This means:
- `faker.seed(42)` at the top of every seed file
- No `Date.now()` or `Math.random()` — use faker for all randomness
- Deterministic UUIDs via `faker.string.uuid()`

### 2. Realistic
Data should look like production data, not test data:
- Real-looking names (not "Test User 1")
- Real addresses (use faker with locale)
- Realistic status distributions (not 100% "active")
- Dates that make sense (created before updated, scheduled before completed)
- Geographic consistency (addresses in the same metro area)

### 3. Comprehensive
Every feature should have data to display:
- Every status enum value should appear at least once
- Every role should have at least one user
- Every relationship should have connected records
- Edge cases should be represented (empty notes, long names, maximum amounts)

### 4. Ordered
Seed in dependency order — parent records before child records.

---

## Phased Execution Order

### Phase 1: Foundation (No Dependencies)

| Table | Record Count | Dependencies | Notes |
|-------|-------------|-------------|-------|
| `organizations` | {{COUNT}} | None | At least 1 primary org for development |
| `users` | {{COUNT}} | organizations | 1 per role minimum. All share same password. |
| `accounts` | {{COUNT}} | users | 1 per user (email provider) |
| `sessions` | 0 | users | Don't seed — created by auth on login |

### Phase 2: Core Entities (Depend on Phase 1)

| Table | Record Count | Dependencies | Notes |
|-------|-------------|-------------|-------|
| `{{ENTITY_1}}` | {{COUNT}} | organizations, users | {{NOTES}} |
| `{{ENTITY_2}}` | {{COUNT}} | organizations, users | {{NOTES}} |
| `{{ENTITY_3}}` | {{COUNT}} | organizations | {{NOTES}} |
| `{{ENTITY_4}}` | {{COUNT}} | organizations | {{NOTES}} |

### Phase 3: Transactions / Activities (Depend on Phase 2)

| Table | Record Count | Dependencies | Notes |
|-------|-------------|-------------|-------|
| `{{TRANSACTION_1}}` | {{COUNT}} | {{ENTITIES}} | Main business records. Largest table. |
| `{{TRANSACTION_2}}` | {{COUNT}} | {{ENTITIES}}, {{TRANSACTION_1}} | {{NOTES}} |

### Phase 4: Derived / Aggregate Data (Depend on Phase 3)

| Table | Record Count | Dependencies | Notes |
|-------|-------------|-------------|-------|
| `{{DERIVED_1}}` | {{COUNT}} | {{TRANSACTIONS}} | Generated from transaction data |
| `{{DERIVED_2}}` | {{COUNT}} | {{TRANSACTIONS}} | {{NOTES}} |

---

## Per-Table Seed Specifications

### Table: `users`

| Field | Strategy | Example Values |
|-------|----------|---------------|
| `id` | `faker.string.uuid()` | `"a1b2c3d4-..."` |
| `email` | Fixed pattern: `{role}@{project}.com` | `admin@{project}.com`, `manager@{project}.com` |
| `name` | `faker.person.fullName()` | `"Sarah Johnson"`, `"Marcus Williams"` |
| `role` | Explicit distribution | See role distribution below |
| `organizationId` | FK to primary org | Same for all in single-tenant dev |
| `image` | `null` or `faker.image.avatar()` | Optional |

**Role Distribution:**

| Role | Count | Specific Emails |
|------|-------|----------------|
| `super_admin` | 1 | `superadmin@{project}.com` |
| `admin` | 2 | `admin@{project}.com`, `admin2@{project}.com` |
| `{role_3}` | {{COUNT}} | `{{EMAILS}}` |
| `{role_4}` | {{COUNT}} | `{{EMAILS}}` |
| `{role_5}` | {{COUNT}} | `{{EMAILS}}` |
| **Total** | {{TOTAL}} | |

**Password:** All users share `{{DEFAULT_PASSWORD}}` for development. Use the auth provider's hash function:

```typescript
import bcrypt from "bcryptjs";
const hashedPassword = await bcrypt.hash("{DEFAULT_PASSWORD}", 12);
```

### Table: `{{ENTITY_TABLE}}`

| Field | Strategy | Distribution / Pattern |
|-------|----------|----------------------|
| `id` | `faker.string.uuid()` | |
| `status` | Weighted random | See status distribution |
| `{{FIELD}}` | `faker.{category}.{method}()` | {{DETAILS}} |
| `createdAt` | Date range: last 90 days | `faker.date.recent({ days: 90 })` |
| `organizationId` | FK to primary org | |
| `createdBy` | Random from admin/dispatcher users | |

**Status Distribution:**

| Status | Percentage | Count (of {{TOTAL}}) | Purpose |
|--------|-----------|-------------------|---------|
| `{{STATUS_1}}` | {%}% | {N} | Shows active/common state |
| `{{STATUS_2}}` | {%}% | {N} | Shows in-progress work |
| `{{STATUS_3}}` | {%}% | {N} | Shows completed state |
| `{{STATUS_4}}` | {%}% | {N} | Shows edge case state |

### Table: `{{TRANSACTION_TABLE}}`

| Field | Strategy | Distribution / Pattern |
|-------|----------|----------------------|
| `id` | `faker.string.uuid()` | |
| `{{FK_FIELD}}` | Random from parent table | Distribute evenly across parents |
| `amount` | Range: {{MIN}}-{{MAX}} cents | `faker.number.int({ min: {{MIN}}, max: {{MAX}} })` |
| `status` | Weighted per business rules | See lifecycle below |
| `scheduledAt` | Spread over last 90 days | Earlier records more likely to be completed |
| `completedAt` | Set if status is terminal | `scheduledAt + random hours` |

**Lifecycle Consistency Rules:**
- Records `scheduledAt` in the past are more likely to have advanced statuses
- Records `scheduledAt` in the future should be `scheduled` or `assigned`
- `completedAt` must be after `scheduledAt`
- `cancelledAt` must be after `createdAt`
- FK references must be to records that existed at `createdAt` time

---

## Geographic Strategy

### Option A: Single Metro Area (Recommended for Dev)

```typescript
// All addresses in a single metro area for realistic-looking data
const METRO_AREA = {
  city: "{CITY}",
  state: "{STATE}",
  zipCodes: ["{ZIP1}", "{ZIP2}", "{ZIP3}", "{ZIP4}", "{ZIP5}"],
  areaCodes: ["{AC1}", "{AC2}"],
  latRange: [{ MIN_LAT }, { MAX_LAT }],
  lngRange: [{ MIN_LNG }, { MAX_LNG }],
};

function generateAddress() {
  return {
    street: faker.location.streetAddress(),
    city: METRO_AREA.city,
    state: METRO_AREA.state,
    zip: faker.helpers.arrayElement(METRO_AREA.zipCodes),
  };
}

function generatePhone() {
  const areaCode = faker.helpers.arrayElement(METRO_AREA.areaCodes);
  return `+1${areaCode}${faker.string.numeric(7)}`;
}
```

### Option B: Multi-Region (For Multi-Tenant Demo)

```typescript
const REGIONS = [
  { name: "Northeast", cities: ["Boston", "New York"], state: "MA", zips: [...] },
  { name: "Southeast", cities: ["Atlanta", "Miami"], state: "GA", zips: [...] },
  { name: "Midwest", cities: ["Chicago", "Detroit"], state: "IL", zips: [...] },
];
```

---

## Seed Orchestrator

```typescript
// packages/db/src/seed/index.ts
import { db } from "../index";
import { faker } from "@faker-js/faker";

// CRITICAL: Seed for reproducibility
faker.seed(42);

async function main() {
  console.log("Seeding database...\n");

  const startTime = Date.now();

  // Phase 1: Foundation
  console.log("Phase 1: Foundation...");
  const { organizations } = await seedOrganizations(db);
  const { users, userMap } = await seedUsers(db, organizations);
  console.log(`  Organizations: ${organizations.length}`);
  console.log(`  Users: ${users.length}`);

  // Phase 2: Core Entities
  console.log("\nPhase 2: Core Entities...");
  const { {entities1} } = await seed{Entities1}(db, organizations, users);
  const { {entities2} } = await seed{Entities2}(db, organizations);
  console.log(`  {Entities1}: ${{{entities1}}.length}`);
  console.log(`  {Entities2}: ${{{entities2}}.length}`);

  // Phase 3: Transactions
  console.log("\nPhase 3: Transactions...");
  const { {transactions} } = await seed{Transactions}(db, { organizations, users, {entities1}, {entities2} });
  console.log(`  {Transactions}: ${{{transactions}}.length}`);

  // Phase 4: Derived Data
  console.log("\nPhase 4: Derived Data...");
  const { {derived} } = await seed{Derived}(db, { {transactions} });
  console.log(`  {Derived}: ${{{derived}}.length}`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalRecords = organizations.length + users.length + {entities1}.length +
    {entities2}.length + {transactions}.length + {derived}.length;

  console.log(`\nDone! Seeded ${totalRecords} records in ${elapsed}s`);
  console.log("\nLogin credentials:");
  console.log(`  Admin: admin@{project}.com / {DEFAULT_PASSWORD}`);
  console.log(`  User:  user@{project}.com / {DEFAULT_PASSWORD}`);
}

main().catch(console.error).finally(() => process.exit());
```

---

## Per-Phase Seed File Pattern

```typescript
// packages/db/src/seed/02-{entities}.ts
import type { DB } from "../index";
import type { Organization, User } from "../schema";
import { faker } from "@faker-js/faker";
import { {table} } from "../schema/{domain}";

export async function seed{Entities}(
  db: DB,
  organizations: Organization[],
  users: User[],
) {
  const primaryOrg = organizations[0]!;
  const adminUsers = users.filter((u) => u.role === "admin" || u.role === "dispatcher");

  const records = Array.from({ length: {COUNT} }, (_, i) => ({
    id: faker.string.uuid(),
    organizationId: primaryOrg.id,
    createdBy: faker.helpers.arrayElement(adminUsers).id,
    // ... domain-specific fields
    status: weightedStatus(i),
    createdAt: faker.date.recent({ days: 90 }),
  }));

  const inserted = await db.insert({table}).values(records).returning();

  return { {entities}: inserted };
}

// Weighted status distribution helper
function weightedStatus(index: number): string {
  const distribution = [
    { status: "{STATUS_1}", weight: {WEIGHT} },
    { status: "{STATUS_2}", weight: {WEIGHT} },
    { status: "{STATUS_3}", weight: {WEIGHT} },
    { status: "{STATUS_4}", weight: {WEIGHT} },
  ];
  return faker.helpers.weightedArrayElement(
    distribution.map((d) => ({ value: d.status, weight: d.weight }))
  );
}
```

---

## Reset Strategy

```typescript
// packages/db/src/seed/reset.ts
// WARNING: This deletes all data. Only for development.
export async function resetDatabase(db: DB) {
  // Delete in reverse dependency order
  await db.delete({derived});
  await db.delete({transactions});
  await db.delete({entities2});
  await db.delete({entities1});
  await db.delete(accounts);
  await db.delete(sessions);
  await db.delete(users);
  await db.delete(organizations);
}
```

Add to package.json:
```json
{
  "scripts": {
    "seed": "npx tsx src/seed/index.ts",
    "seed:reset": "npx tsx src/seed/reset.ts && npx tsx src/seed/index.ts"
  }
}
```

---

## Seed Data Quality Checklist

- [ ] `faker.seed(42)` is called before any faker usage
- [ ] Every table in the schema has seed data
- [ ] Every enum value appears in at least one record
- [ ] Every role has at least one user with known login credentials
- [ ] Status distributions are documented and realistic
- [ ] Date fields are consistent (created < updated < completed)
- [ ] FK references are valid (no orphans)
- [ ] Geographic data is consistent (same metro area)
- [ ] Phone numbers use correct area codes for the region
- [ ] Money fields are in cents (not dollars)
- [ ] Seed completes in under 30 seconds
- [ ] Login credentials are printed at the end of seeding
- [ ] Running seed twice produces identical data (idempotent with reset)

---

## Filled Example: Transportation Management

### Record Summary

| Phase | Table | Count | Notes |
|-------|-------|-------|-------|
| 1 | organizations | 1 | "Delta Transportation" |
| 1 | users | 20 | 1 super, 2 admin, 4 dispatcher, 5 driver, 8 member |
| 1 | accounts | 20 | 1 per user, email provider |
| 2 | drivers | 8 | Mix of active/inactive/on_leave |
| 2 | vehicles | 6 | Mix of types (sedan, van, wheelchair) |
| 2 | facilities | 6 | Hospitals, clinics, dialysis centers |
| 2 | passengers | 15 | Regular riders with medical needs |
| 3 | trips | 80 | Spread across 90 days, all statuses |
| 3 | trip_assignments | 60 | Trips that have been assigned |
| 4 | invoices | 12 | Paid, Sent, Overdue, Partial, Draft |
| 4 | invoice_line_items | 45 | 3-4 trips per invoice |
| **Total** | | **~1,300+** | |

### Status Distributions

**Trips (80 total):**
- scheduled: 15% (12) — future trips awaiting assignment
- assigned: 10% (8) — driver assigned, not started
- in_progress: 8% (6) — currently in transit
- completed: 50% (40) — finished trips
- cancelled: 12% (10) — cancelled for various reasons
- no_show: 5% (4) — passenger didn't show

**Invoices (12 total):**
- draft: 2
- sent: 3
- paid: 4
- partial: 1
- overdue: 2
