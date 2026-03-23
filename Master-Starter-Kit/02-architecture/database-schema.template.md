# Database Schema: {{DOMAIN_NAME}}

## Overview

**Domain:** {{DOMAIN_NAME}}
**Description:** {{BRIEF_DESCRIPTION_OF_DOMAIN}}
**Primary Table:** `{{TABLE_NAME}}`
**Related Tables:** {{LIST_OF_RELATED_TABLES}}
**Estimated Record Volume:** {{ESTIMATED_ROWS}} (Year 1)

---

## Table: `{{TABLE_NAME}}`

### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `createdAt` | `timestamp(tz)` | NO | `now()` | Record creation time |
| `updatedAt` | `timestamp(tz)` | NO | `now()` | Last modification time |
| `deletedAt` | `timestamp(tz)` | YES | `null` | Soft delete marker |
| `organizationId` | `uuid` | NO | — | FK to organizations |
| `createdBy` | `uuid` | NO | — | FK to users |
| `{{COLUMN_NAME}}` | `{{TYPE}}` | `{YES/NO}` | `{{DEFAULT}}` | {{DESCRIPTION}} |
| `{{COLUMN_NAME}}` | `{{TYPE}}` | `{YES/NO}` | `{{DEFAULT}}` | {{DESCRIPTION}} |
| `status` | `{{DOMAIN}}_status` | NO | `{{DEFAULT_STATUS}}` | Current lifecycle state |

### Status Enum: `{{DOMAIN}}_status`

| Value | Description | Transitions To |
|-------|-------------|---------------|
| `{{STATUS_1}}` | {{DESCRIPTION}} | `{{STATUS_2}}`, `{{STATUS_CANCELLED}}` |
| `{{STATUS_2}}` | {{DESCRIPTION}} | `{{STATUS_3}}`, `{{STATUS_CANCELLED}}` |
| `{{STATUS_3}}` | {{DESCRIPTION}} | `{{STATUS_4}}` |
| `{{STATUS_CANCELLED}}` | {{DESCRIPTION}} | (terminal) |

### Relationships

| Relationship | Type | Foreign Table | FK Column | On Delete | Description |
|-------------|------|--------------|-----------|-----------|-------------|
| Organization | Many-to-One | `organizations` | `organizationId` | RESTRICT | Tenant isolation |
| Created By | Many-to-One | `users` | `createdBy` | RESTRICT | Audit trail |
| `{{RELATIONSHIP}}` | `{{TYPE}}` | `{{TABLE}}` | `{{FK_COLUMN}}` | `{{ACTION}}` | {{DESCRIPTION}} |

### Indexes

| Index Name | Columns | Type | Purpose |
|-----------|---------|------|---------|
| `{{TABLE}}_pkey` | `id` | PRIMARY | Primary key |
| `{{TABLE}}_org_id_idx` | `organizationId` | BTREE | Tenant filtering |
| `{{TABLE}}_created_by_idx` | `createdBy` | BTREE | Audit lookups |
| `{{TABLE}}_org_status_idx` | `organizationId, status` | BTREE (composite) | Status filtering within tenant |
| `{{TABLE}}_{{FK}}_idx` | `{{FK_COLUMN}}` | BTREE | FK join performance |
| `{{INDEX_NAME}}` | `{{COLUMNS}}` | `{{TYPE}}` | {{PURPOSE}} |

### Business Rules

1. {{RULE_1}} — e.g., "Status can only transition forward (no going back to 'scheduled' from 'completed')"
2. {{RULE_2}} — e.g., "organizationId is immutable after creation"
3. {{RULE_3}} — e.g., "deletedAt records are excluded from all default queries"
4. {{RULE_4}} — e.g., "Must have at least one {{RELATED_ENTITY}} before status can advance to {{STATUS}}"

---

## Drizzle Schema

```typescript
import { pgTable, uuid, varchar, timestamp, integer, text, index, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { {SCHEMA_REF} } from "./schema-ref"; // e.g., v3Schema
import { {DOMAIN}StatusEnum } from "./enums";
import { organizations } from "./organizations";
import { users } from "./users";

export const {TABLE_NAME} = {SCHEMA_REF}.table("{TABLE_NAME}", {
  // Base columns
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),

  // Tenant + audit
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdBy: uuid("created_by").notNull().references(() => users.id),

  // Domain columns
  // {COLUMN}: {TYPE}("{COLUMN_NAME}").{CONSTRAINTS},

  // Status
  status: {DOMAIN}StatusEnum("status").notNull().default("{DEFAULT_STATUS}"),
}, (table) => [
  index("{TABLE_NAME}_org_id_idx").on(table.organizationId),
  index("{TABLE_NAME}_created_by_idx").on(table.createdBy),
  index("{TABLE_NAME}_org_status_idx").on(table.organizationId, table.status),
  // Additional indexes
]);

// Relations
export const {TABLE_NAME}Relations = relations({TABLE_NAME}, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [{TABLE_NAME}.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [{TABLE_NAME}.createdBy],
    references: [users.id],
  }),
  // Domain relations
  // {RELATION}: {one/many}({RELATED_TABLE}, { ... }),
}));
```

---

## Prisma Schema

```prisma
enum {DOMAIN}Status {
  {STATUS_1}
  {STATUS_2}
  {STATUS_3}
  {STATUS_CANCELLED}
}

model {MODEL_NAME} {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  organizationId String    @db.Uuid @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])

  createdById    String    @db.Uuid @map("created_by")
  createdByUser  User      @relation(fields: [createdById], references: [id])

  // Domain columns
  // {COLUMN}  {TYPE}  @map("{COLUMN_NAME}")

  status         {DOMAIN}Status @default({DEFAULT_STATUS})

  // Relations
  // {RELATION}  {MODEL}[]

  @@map("{TABLE_NAME}")
  @@index([organizationId])
  @@index([createdById])
  @@index([organizationId, status])
}
```

---

## Additional Tables in This Domain

Repeat the schema pattern above for each additional table in this domain.

### Table: `{{SECONDARY_TABLE_NAME}}`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `{{PARENT_TABLE}}Id` | `uuid` | NO | — | FK to parent table |
| `{{COLUMN}}` | `{{TYPE}}` | `{YES/NO}` | `{{DEFAULT}}` | {{DESCRIPTION}} |

---

## Migration Notes

- **Initial migration:** Creates table, enum, indexes, and foreign keys
- **Data considerations:** {{ANY_SPECIAL_MIGRATION_NOTES}}
- **Rollback plan:** {{HOW_TO_REVERT_THIS_MIGRATION}}

---

## Filled Example: Trips Domain

Below is a completed example for reference:

### Table: `trips`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `createdAt` | `timestamp(tz)` | NO | `now()` | Record creation time |
| `updatedAt` | `timestamp(tz)` | NO | `now()` | Last modification time |
| `deletedAt` | `timestamp(tz)` | YES | `null` | Soft delete marker |
| `organizationId` | `uuid` | NO | — | FK to organizations |
| `createdBy` | `uuid` | NO | — | FK to users |
| `passengerId` | `uuid` | NO | — | FK to passengers |
| `driverId` | `uuid` | YES | `null` | FK to drivers (null until assigned) |
| `vehicleId` | `uuid` | YES | `null` | FK to vehicles (null until assigned) |
| `pickupAddress` | `text` | NO | — | Full pickup address string |
| `dropoffAddress` | `text` | NO | — | Full dropoff address string |
| `scheduledAt` | `timestamp(tz)` | NO | — | When the trip is scheduled |
| `completedAt` | `timestamp(tz)` | YES | `null` | When the trip was completed |
| `fareInCents` | `integer` | NO | `0` | Trip fare in cents |
| `notes` | `text` | YES | `null` | Driver/dispatcher notes |
| `status` | `trip_status` | NO | `scheduled` | Current lifecycle state |

### Status Enum: `trip_status`

| Value | Description | Transitions To |
|-------|-------------|---------------|
| `scheduled` | Trip is booked, awaiting assignment | `assigned`, `cancelled` |
| `assigned` | Driver assigned, not yet started | `in_progress`, `cancelled` |
| `in_progress` | Driver en route or with passenger | `completed`, `no_show` |
| `completed` | Trip successfully finished | (terminal) |
| `cancelled` | Trip was cancelled | (terminal) |
| `no_show` | Passenger did not show up | (terminal) |

### Business Rules

1. `driverId` must be non-null before status can advance to `assigned`
2. `vehicleId` must be non-null before status can advance to `in_progress`
3. `completedAt` is auto-set when status transitions to `completed`
4. `fareInCents` cannot be negative
5. `scheduledAt` must be in the future at creation time
6. Only `scheduled` and `assigned` trips can be `cancelled`
