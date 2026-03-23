# Table Documentation: `{{TABLE_NAME}}`

> **Domain:** {{DOMAIN_NAME}}
> **Schema file:** `packages/db/src/schema/{schema_file}.ts`
> **Created:** Phase {N}

---

## Purpose

{2-3 sentences explaining what this table stores, why it exists, and what business concept it represents.}

---

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `gen_random_uuid()` | Primary key |
| `companyId` | `uuid` | No | — | FK → companies.id (multi-tenant) |
| `{column_1}` | `{type}` | {Yes/No} | {default} | {description} |
| `{column_2}` | `{type}` | {Yes/No} | {default} | {description} |
| `{column_3}` | `{type}` | {Yes/No} | {default} | {description} |
| `{column_4}` | `{type}` | {Yes/No} | {default} | {description} |
| `{column_5}` | `{type}` | {Yes/No} | {default} | {description} |
| `status` | `{enum_name}` | No | `"{{DEFAULT}}"` | Current status |
| `notes` | `text` | Yes | — | Free-form notes |
| `createdAt` | `timestamptz` | No | `now()` | Record creation time |
| `updatedAt` | `timestamptz` | No | `now()` | Last modification time |
| `deletedAt` | `timestamptz` | Yes | — | Soft delete timestamp (null = active) |

### Column Notes

- **`{column_1}`**: {Additional detail — validation rules, business meaning, why this type was chosen}
- **`{column_3}`**: {Monetary values stored in cents (integer). Display as dollars in UI.}
- **`status`**: {See state machine below for valid transitions}

---

## Drizzle Schema Definition

```typescript
// packages/db/src/schema/{schema_file}.ts
import { pgTable, uuid, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";
import { {schema} } from "./_schema";
import { {statusEnum} } from "./enums";
import { companies } from "./companies";
import { {relatedTable} } from "./{related_table}";

export const {tableName} = {schema}.table("{table_name}", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  {column1}: varchar("{column_1}", { length: 100 }).notNull(),
  {column2}: uuid("{column_2}_id")
    .notNull()
    .references(() => {relatedTable}.id),
  {column3}: integer("{column_3}").notNull().default(0),
  status: {statusEnum}("status").notNull().default("{DEFAULT_STATUS}"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
```

---

## Relationships

### This Table References (Foreign Keys)

| Column | References | Relationship | On Delete |
|--------|-----------|-------------|-----------|
| `companyId` | `companies.id` | Belongs to Company | CASCADE |
| `{column_fk}Id` | `{related_table}.id` | Belongs to {RelatedEntity} | {CASCADE/SET NULL/RESTRICT} |

### Other Tables Reference This

| Table | Column | Relationship | On Delete |
|-------|--------|-------------|-----------|
| `{child_table}` | `{this_table}Id` | {ChildEntity} has many | {CASCADE/SET NULL} |
| `{child_table_2}` | `{this_table}Id` | {ChildEntity2} has many | {CASCADE/SET NULL} |

### Drizzle Relations

```typescript
// packages/db/src/schema/relations.ts
import { relations } from "drizzle-orm";

export const {tableName}Relations = relations({tableName}, ({ one, many }) => ({
  company: one(companies, {
    fields: [{tableName}.companyId],
    references: [companies.id],
  }),
  {relatedEntity}: one({relatedTable}, {
    fields: [{tableName}.{relatedColumn}Id],
    references: [{relatedTable}.id],
  }),
  {children}: many({childTable}),
}));
```

---

## Indexes

| Index Name | Columns | Type | Purpose |
|-----------|---------|------|---------|
| `{table}_pkey` | `id` | Primary | Default PK |
| `idx_{table}_company` | `companyId` | B-tree | Multi-tenant queries |
| `idx_{table}_{fk}` | `{fk}Id` | B-tree | FK lookups |
| `idx_{table}_status` | `status` | B-tree | Status filtering |
| `idx_{table}_company_status` | `companyId, status` | B-tree (composite) | Combined filter |
| `idx_{table}_created` | `createdAt DESC` | B-tree | Chronological sort |

---

## Business Rules

> These rules are enforced at the API layer (tRPC procedures), NOT at the database level (unless specified as a DB constraint).

1. **{{RULE_1}}** — {Description. Example: "A {entity} cannot be deleted if it has active {children}."}
2. **{{RULE_2}}** — {Description. Example: "Status can only transition forward, never backward (see state machine)."}
3. **{{RULE_3}}** — {Description. Example: "{column_3} (amount) must be recalculated when line items change."}
4. **{{RULE_4}}** — {Description. Example: "Only users with role '{{ROLE}}' can update the status to '{{STATUS}}'."}
5. **{{RULE_5}}** — {Description. Example: "Soft-deleted records must be excluded from all list queries."}

---

## State Machine (if applicable)

> Only include this section if the table has a `status` column with constrained transitions.

```
                  ┌─────────┐
                  │ {STATE_1}│ (initial)
                  └────┬────┘
                       │ {ACTION_1}
                       ↓
                  ┌─────────┐
          ┌───── │ {STATE_2}│ ─────┐
          │      └─────────┘      │
    {ACTION_2}              {ACTION_3}
          ↓                       ↓
    ┌─────────┐            ┌─────────┐
    │ {STATE_3}│            │ {STATE_4}│
    └─────────┘            └─────────┘
          │                       │
    {ACTION_4}              {ACTION_5}
          ↓                       ↓
    ┌─────────┐            ┌─────────┐
    │ {STATE_5}│            │ {STATE_6}│ (terminal)
    └─────────┘            └─────────┘
```

### Transition Table

| From | To | Trigger | Required Role | Side Effects |
|------|----|---------|--------------|-------------|
| {{STATE_1}} | {{STATE_2}} | {{ACTION}} | {{ROLE}} | {side effects} |
| {{STATE_2}} | {{STATE_3}} | {{ACTION}} | {{ROLE}} | {side effects} |
| {{STATE_2}} | {{STATE_4}} | {{ACTION}} | {{ROLE}} | {side effects} |

---

## Audit Requirements

| Event | What to Log | Where |
|-------|------------|-------|
| Create | Full record | `audit_logs` table |
| Update | Changed fields (old → new values) | `audit_logs` table |
| Delete (soft) | Who deleted, when | `deletedAt` + `deletedBy` columns |
| Status change | Old status → new status, who, when | `{table}_status_history` table |

---

## Seed Data

- **Record count:** {N}
- **Status distribution:** {X}% {{STATUS_1}}, {Y}% {{STATUS_2}}, {Z}% {{STATUS_3}}
- **Seed file:** `packages/db/src/seed/{{NN}}-{table}.ts`
- **See:** `seed-data-spec.md` for full details

---

## Related Documentation

- **Router spec:** `../api-docs/{router-name}.md`
- **Domain rules:** `../feature-docs/{entity}-domain-rules.md`
- **Implementation spec:** `../feature-docs/{feature}-spec.md`
- **Seed spec:** `seed-data-spec.md`
