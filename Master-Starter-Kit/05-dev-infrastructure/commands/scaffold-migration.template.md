# /scaffold-migration $ARGUMENT

Generate a Drizzle SQL migration from schema changes.

## Steps

1. **Detect changed schema files**:
   ```bash
   cd packages/db && git diff --name-only HEAD -- src/schema/
   ```
   If no changes detected, also check unstaged:
   ```bash
   cd packages/db && git diff --name-only -- src/schema/
   ```
   If still no changes, report "No schema changes detected. Modify a schema file first." and stop.

2. **Review the changes**:
   ```bash
   cd packages/db && git diff -- src/schema/
   ```
   Identify what changed: new table, new column, altered column, new index, new enum.

3. **Determine the migration sequence number**:
   ```bash
   ls packages/db/drizzle/ | sort | tail -1
   ```
   Extract the highest 4-digit prefix and increment by 1. If no migrations exist, start at `0001`.

4. **Generate the migration using drizzle-kit**:
   ```bash
   cd packages/db && npx drizzle-kit generate 2>&1
   ```

   **Important**: Use `drizzle-kit generate`, NOT `drizzle-kit push`. The `push` command has bugs with `pgSchema` enum qualification that produce invalid SQL. `generate` creates a SQL file that you can review and edit before applying.

5. **Review the generated SQL**:
   ```bash
   ls packages/db/drizzle/
   ```
   Read the newest migration file. Verify:
   - Tables use `IF NOT EXISTS` (for safety)
   - UUIDs default to `gen_random_uuid()`
   - Timestamps include `DEFAULT now()`
   - Foreign keys reference correct tables
   - Indexes are included
   - Enum types are properly qualified (especially with pgSchema)

6. **Add DOWN migration as comments** at the end of the file:

   ```sql
   -- DOWN MIGRATION (manual rollback)
   -- ================================
   -- DROP TABLE IF EXISTS "{schema}"."{table_name}" CASCADE;
   -- DROP TYPE IF EXISTS "{schema}"."{enum_name}";
   -- ALTER TABLE "{schema}"."{table_name}" DROP COLUMN "{column_name}";
   ```

7. **Apply the migration** (development only):
   ```bash
   cd packages/db && npx drizzle-kit push 2>&1
   ```
   Or for production:
   ```bash
   cd packages/db && npx drizzle-kit migrate 2>&1
   ```

8. **Run typecheck** to ensure generated types are in sync:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

9. **Output report**:
   ```
   MIGRATION GENERATED
   ====================
   File: packages/db/drizzle/{NNNN}_{name}.sql
   Changes:
   - {CREATE TABLE / ALTER TABLE / ADD COLUMN / etc.}
   Tables affected: {list}
   New enums: {list or "none"}
   New indexes: {list or "none"}
   Applied: {yes/no}
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Sequential 4-digit prefix**: Migrations must be numbered sequentially (0001, 0002, 0003...). Never skip numbers.
- **`generate` over `push`**: Always use `drizzle-kit generate` to create migration files. `push` applies changes directly without a reviewable SQL file and has known bugs with pgSchema enum types.
- **`IF NOT EXISTS`**: All `CREATE TABLE` and `CREATE TYPE` statements should include `IF NOT EXISTS` for idempotent migrations.
- **UUID defaults**: Every `uuid` primary key should have `DEFAULT gen_random_uuid()`.
- **Include timestamps**: Every table should have `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()` and `updated_at`.
- **DOWN migration as comments**: Drizzle doesn't support automatic rollbacks. Document the rollback SQL as comments at the end of each migration file.
- **Review before applying**: Always read the generated SQL before running it against any database. Drizzle-kit's SQL generation isn't perfect -- verify foreign key names, index names, and enum qualification.
- **Never auto-apply in production**: Production migrations should go through a review process. Only auto-apply in development.
