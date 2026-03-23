# /scaffold-schema $ARGUMENT

Generate a Drizzle ORM schema file from the documentation spec for the given table.

## Steps

1. **Read the table spec**:
   ```
   {DOCS_PATH}/database/tables/$ARGUMENT.md
   ```
   If the file doesn't exist, report the error and list available table specs:
   ```bash
   ls {DOCS_PATH}/database/tables/
   ```

2. **Read the enums file** (if the table uses enum columns):
   ```
   {DOCS_PATH}/database/enums.md
   ```

3. **Read existing schema files** to understand conventions:
   ```bash
   ls packages/db/src/schema/
   ```
   Read one existing schema file for reference patterns.

4. **Generate the schema file** at `packages/db/src/schema/$ARGUMENT.ts`:

   Follow these rules exactly:
   - **Column naming**: `snake_case` in SQL, `camelCase` property names in TypeScript
   - **Primary key**: `uuid` type with `defaultRandom()`, named `id`
   - **Timestamps**: Include `createdAt`, `updatedAt`, `deletedAt` (nullable) on every table
   - **Money columns**: `integer` type storing cents (not dollars), never `decimal` or `real`
   - **Foreign keys**: Named `{referenced_table}_id` in SQL, `{referencedTable}Id` in TypeScript
   - **Enums**: Use `pgEnum` defined in a shared enums file or inline if table-specific
   - **Indexes**: Create an index on every foreign key column AND every column commonly used in filters (status, date, etc.)

   Template:
   ```typescript
   import { relations } from "drizzle-orm";
   import {
     index,
     integer,
     pgTable,
     text,
     timestamp,
     uuid,
     varchar,
   } from "drizzle-orm/pg-core";
   // Import enums and related tables as needed

   export const {tableName} = pgTable(
     "{table_name_snake}",
     {
       id: uuid("id").primaryKey().defaultRandom(),
       // ... columns from spec ...
       createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
       updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
       deletedAt: timestamp("deleted_at", { withTimezone: true }),
     },
     (table) => [
       index("{table_name}_{fk_column}_idx").on(table.{fkColumn}),
       index("{table_name}_status_idx").on(table.status),
       // ... indexes for FKs and filter columns ...
     ],
   );

   export const {tableName}Relations = relations({tableName}, ({ one, many }) => ({
     // ... relations from spec ...
   }));
   ```

5. **Update the barrel export** at `packages/db/src/schema/index.ts`:
   Add `export * from "./$ARGUMENT";` in alphabetical order.

6. **Run typecheck**:
   ```bash
   cd packages/db && pnpm typecheck 2>&1 | tail -20
   ```

7. **Output report**:
   ```
   SCHEMA GENERATED
   =================
   Table: {table_name}
   File: packages/db/src/schema/$ARGUMENT.ts
   Columns: {count}
   Relations: {count} ({list: e.g., "belongs to users, has many trips"})
   Indexes: {count}
   Enums used: {list or "none"}
   TypeScript: {PASS/FAIL}
   ```

## Notes

- If using `pgSchema` for schema isolation (e.g., `pgSchema("v3")`), use `schema.table()` instead of `pgTable()` and import the schema object.
- Never use `decimal` or `real` for money. Always `integer` in cents.
- Enum string literals in array inserts need `as const` to prevent TypeScript type widening (TS2769).
- If the table spec references related tables, import them from their schema files. Don't define them inline.
