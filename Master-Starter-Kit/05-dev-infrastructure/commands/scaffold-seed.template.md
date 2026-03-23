# /scaffold-seed $ARGUMENT

Generate reproducible seed data for the given table from the SEED-DATA spec.

## Steps

1. **Read the seed spec**:
   ```
   {DOCS_PATH}/database/SEED-DATA.md
   ```
   Find the section for `$ARGUMENT`. Extract:
   - Record count
   - Status distribution (e.g., 60% active, 30% inactive, 10% suspended)
   - Required foreign key dependencies (which tables must be seeded first)
   - Any specific test accounts or named records

2. **Read the schema file** to get column types and constraints:
   ```
   packages/db/src/schema/$ARGUMENT.ts
   ```

3. **Read existing seed files** for conventions:
   ```bash
   ls packages/db/src/seed/
   ```
   Read one existing seed file for reference patterns.

4. **Generate the seed file** at `packages/db/src/seed/$ARGUMENT.ts`:

   Template:
   ```typescript
   import { faker } from "@faker-js/faker";
   import { db } from "../client";
   import { {tableName} } from "../schema";

   // Set seed for reproducible data
   faker.seed(42);

   export async function seed{TableName}(deps: {
     {dependencyTable}Ids: string[];
     // ... other FK dependencies
   }) {
     console.log("Seeding {table_name}...");

     const records: (typeof {tableName}.$inferInsert)[] = [];

     // Named/specific records (test accounts, known fixtures)
     records.push({
       // ... specific record from spec ...
     });

     // Generated records
     const count = {RECORD_COUNT_FROM_SPEC};
     const statuses = [
       // ... status distribution from spec ...
     ] as const;

     for (let i = 0; i < count; i++) {
       const status = statuses[i % statuses.length]!;
       const {depTable}Id = deps.{depTable}Ids[
         i % deps.{depTable}Ids.length
       ]!;

       records.push({
         // id: omit to let defaultRandom() generate
         {depTable}Id,
         status,
         // ... faker-generated fields matching column types ...
         // string: faker.person.firstName(), faker.location.streetAddress(), etc.
         // date: faker.date.recent({ days: 30 }),
         // integer (money cents): faker.number.int({ min: 1000, max: 50000 }),
         // enum: pick from enum values based on distribution
         createdAt: faker.date.recent({ days: 90 }),
         updatedAt: new Date(),
       });
     }

     const inserted = await db
       .insert({tableName})
       .values(records)
       .returning({ id: {tableName}.id });

     const ids = inserted.map((r) => r.id);
     console.log(`  Seeded ${ids.length} {table_name} records`);
     return ids;
   }
   ```

5. **Update the seed orchestrator** at `packages/db/src/seed/index.ts`:
   - Import the new seed function
   - Add it to the execution sequence in dependency order
   - Pass required FK IDs from earlier seed results

   ```typescript
   // In the main seed function, add:
   const {table}Ids = await seed{TableName}({
     {dep}Ids: {dep}Ids,
   });
   ```

6. **Run typecheck**:
   ```bash
   cd packages/db && pnpm typecheck 2>&1 | tail -20
   ```

7. **Output report**:
   ```
   SEED GENERATED
   ===============
   Table: {table_name}
   File: packages/db/src/seed/$ARGUMENT.ts
   Records: {count} ({named} named + {generated} generated)
   Dependencies: {list of tables that must seed first}
   Status Distribution: {e.g., "60% active, 30% inactive, 10% suspended"}
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **Always `faker.seed(42)`**: Makes data reproducible. Same seed = same data every run.
- **Dependency order matters**: The seed orchestrator must seed parent tables before child tables. Users before trips, facilities before invoices, etc.
- **Use `as const`** on enum arrays to prevent TypeScript type widening.
- **Omit `id` field**: Let `defaultRandom()` generate UUIDs. Don't hardcode IDs unless the spec requires known test IDs.
- **Named records**: Include specific test accounts (e.g., admin@company.com / Password123!) at the start of the records array.
- **Money in cents**: If the spec says "$150.00", seed with `15000` (integer cents).
