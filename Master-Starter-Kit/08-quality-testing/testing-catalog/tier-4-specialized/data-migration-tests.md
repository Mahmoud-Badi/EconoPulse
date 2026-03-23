# Data Migration Tests

## What It Is

Data migration testing verifies that when you change your database schema — adding columns, renaming tables, changing data types, splitting or merging tables — all existing data survives the migration intact and the migration can be safely rolled back. This means testing migration UP (apply the change) and migration DOWN (revert it) with realistic data volumes, edge-case values, and constraint relationships. The critical insight is that migrations tested against an empty database or 10 rows tell you almost nothing. Real databases have null values in unexpected places, decade-old records with formats that no longer match current validation, and millions of rows where a "simple" migration can lock a table for 20 minutes.

---

## What It Catches

- **Data loss during column removal** — Dropping a column that was deprecated in the API but still has data consumers need for reporting. Migration succeeds, data is gone forever.
- **Type conversion failures** — Changing `VARCHAR` to `INTEGER` fails on row 847,293 where someone entered "N/A" in a phone number field 3 years ago
- **Null constraint violations** — Adding `NOT NULL` to a column that has 12,000 null values in existing rows. Migration fails halfway, leaving the database in an inconsistent state.
- **Foreign key violations** — Adding a foreign key constraint to a column that has orphaned references because the cleanup job never ran properly
- **Default value mistakes** — Adding a column with `DEFAULT now()` to a table with 2 million rows. Every row gets the exact same timestamp instead of preserving the original creation dates.
- **Index creation locking** — Adding an index to a 50-million-row table. On PostgreSQL without `CONCURRENTLY`, this locks the table for writes for 15+ minutes during the migration.
- **Rollback failures** — Migration UP works, but DOWN fails because the reverse operation loses data (you can't un-merge columns) or the DOWN migration was never written/tested.
- **Character encoding issues** — Migration changes column encoding. Existing emoji, CJK characters, or accented names get corrupted or truncated.
- **Sequence/auto-increment gaps** — After a migration that inserts seed data, the auto-increment sequence is behind the maximum ID, causing duplicate key errors on the next insert.
- **Trigger and function breakage** — Migration renames a column that a database trigger references. The trigger silently fails on every row update until someone notices.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Any schema change to a database with existing data | The migration will run against real data, not an empty database |
| Renaming or removing columns/tables | Data loss is permanent and non-obvious |
| Changing column types or constraints | Existing data may not conform to the new constraint |
| Adding foreign key constraints | Orphaned references will cause the migration to fail |
| Splitting or merging tables | Complex data transformations have many edge cases |
| Migration involves data transformation (not just DDL) | Transforming millions of rows is where the real bugs hide |
| Production database exceeds 100K rows in affected tables | Performance characteristics change dramatically at scale |
| You've had a production migration failure before | Prevent the same category of failure |

**Skip when:** Brand new database with zero data, adding a column with `NULL` default and no constraint changes, development/prototype with disposable data.

---

## Setup Guide

### Approach: Test Migrations Against Realistic Data

The key is to run migrations against a database that's seeded with production-like data — realistic volumes, edge-case values, and the kind of messy data that accumulates over time.

### Tools

```bash
# Database migration frameworks
npm install knex          # SQL query builder + migrations (PostgreSQL, MySQL, SQLite)
# OR
npm install prisma        # Prisma ORM + migrations
# OR
npm install drizzle-orm   # Drizzle ORM + migrations

# Test database containers
npm install -D testcontainers   # Spin up real PostgreSQL/MySQL in Docker for tests

# Faker for realistic test data generation
npm install -D @faker-js/faker
```

### Project Structure

```
tests/
  migrations/
    migration-up-down.test.ts       # Test UP and DOWN for each migration
    data-integrity.test.ts          # Verify data survives the migration
    performance.test.ts             # Test migration speed with realistic volumes
    helpers/
      seed-production-like.ts       # Generate realistic test data
      snapshot-data.ts              # Capture data state before/after migration
  seeds/
    production-like/
      users.json                    # Edge-case user data (nulls, unicode, long strings)
      orders.json                   # Orders with all possible status combinations
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **Knex migrations** | SQL-first, multi-database support | Most flexible, manual SQL control |
| **Prisma Migrate** | TypeScript-first, schema-driven | Auto-generates migrations from schema changes |
| **Drizzle Kit** | Lightweight, SQL-like TypeScript | Newer, growing ecosystem |
| **Flyway** | JVM projects, enterprise | Version-controlled SQL migrations |
| **Testcontainers** | Real database in CI | Docker-based, disposable test databases |
| **pg_dump / mysqldump** | Snapshot production data (anonymized) | Seed test DB with real data shapes |

---

## Template

### Migration UP/DOWN Test

```ts
// tests/migrations/migration-up-down.test.ts
import Knex from 'knex';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

describe('Migration: add_organization_id_to_users', () => {
  let container: StartedTestContainer;
  let db: Knex.Knex;

  beforeAll(async () => {
    // Spin up a real PostgreSQL instance
    container = await new GenericContainer('postgres:15')
      .withEnvironment({
        POSTGRES_DB: 'migration_test',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
      })
      .withExposedPorts(5432)
      .start();

    db = Knex({
      client: 'pg',
      connection: {
        host: container.getHost(),
        port: container.getMappedPort(5432),
        database: 'migration_test',
        user: 'test',
        password: 'test',
      },
    });

    // Run all migrations up to the one BEFORE the migration under test
    await db.migrate.up({
      directory: './migrations',
      // Stop before the target migration
    });
  }, 60000);

  afterAll(async () => {
    await db.destroy();
    await container.stop();
  });

  test('migration UP adds organization_id column', async () => {
    // Seed data BEFORE migration
    await db('users').insert([
      { id: 1, email: 'existing@test.com', name: 'Existing User' },
      { id: 2, email: 'another@test.com', name: 'Another User' },
    ]);

    // Run the migration
    await db.migrate.up({ directory: './migrations' });

    // Verify schema change
    const columns = await db('users').columnInfo();
    expect(columns).toHaveProperty('organization_id');

    // Verify existing data survived
    const users = await db('users').select('*');
    expect(users).toHaveLength(2);
    expect(users[0].email).toBe('existing@test.com');
    expect(users[0].name).toBe('Existing User');

    // Verify default value was applied
    expect(users[0].organization_id).toBeNull(); // Or whatever the default is
  });

  test('migration DOWN removes organization_id column', async () => {
    // Run the DOWN migration
    await db.migrate.down({ directory: './migrations' });

    // Verify column is removed
    const columns = await db('users').columnInfo();
    expect(columns).not.toHaveProperty('organization_id');

    // Verify existing data still intact
    const users = await db('users').select('*');
    expect(users).toHaveLength(2);
    expect(users[0].email).toBe('existing@test.com');
  });

  test('migration is idempotent — running UP twice does not error', async () => {
    await db.migrate.up({ directory: './migrations' });
    // Running again should be a no-op, not a crash
    await expect(db.migrate.up({ directory: './migrations' })).resolves.not.toThrow();
  });
});
```

### Data Integrity Test with Edge Cases

```ts
// tests/migrations/data-integrity.test.ts
import Knex from 'knex';
import { faker } from '@faker-js/faker';

describe('Data integrity through migration', () => {
  let db: Knex.Knex;

  // ... (container setup same as above)

  test('edge-case data survives migration', async () => {
    // Seed with problematic data that exists in real databases
    const edgeCaseUsers = [
      // Null values
      { id: 1, email: 'null-name@test.com', name: null, bio: null },

      // Unicode and emoji
      { id: 2, email: 'unicode@test.com', name: '日本語テスト', bio: 'Has emoji 🎉🔥' },

      // Very long strings
      { id: 3, email: 'long@test.com', name: 'A'.repeat(255), bio: 'B'.repeat(10000) },

      // Special characters
      { id: 4, email: "o'malley@test.com", name: "O'Malley-Smith", bio: 'Has "quotes" and \\backslashes' },

      // Empty strings (different from null)
      { id: 5, email: 'empty@test.com', name: '', bio: '' },

      // Minimum and maximum dates
      { id: 6, email: 'old@test.com', name: 'Ancient User', bio: null },

      // HTML/script injection (data that was stored before sanitization was added)
      { id: 7, email: 'xss@test.com', name: '<script>alert("xss")</script>', bio: '<img src=x onerror=alert(1)>' },
    ];

    await db('users').insert(edgeCaseUsers);

    // Capture state before migration
    const beforeMigration = await db('users').select('*').orderBy('id');

    // Run migration
    await db.migrate.latest({ directory: './migrations' });

    // Capture state after migration
    const afterMigration = await db('users').select('*').orderBy('id');

    // Verify every row survived
    expect(afterMigration).toHaveLength(edgeCaseUsers.length);

    // Verify specific edge cases
    for (let i = 0; i < edgeCaseUsers.length; i++) {
      expect(afterMigration[i].email).toBe(beforeMigration[i].email);
      expect(afterMigration[i].name).toBe(beforeMigration[i].name);
      expect(afterMigration[i].bio).toBe(beforeMigration[i].bio);
    }

    // Verify null values stayed null (not converted to empty string or "null")
    const nullUser = afterMigration.find(u => u.id === 1);
    expect(nullUser?.name).toBeNull();
    expect(nullUser?.bio).toBeNull();

    // Verify empty strings stayed empty (not converted to null)
    const emptyUser = afterMigration.find(u => u.id === 5);
    expect(emptyUser?.name).toBe('');
    expect(emptyUser?.bio).toBe('');

    // Verify unicode survived
    const unicodeUser = afterMigration.find(u => u.id === 2);
    expect(unicodeUser?.name).toBe('日本語テスト');
    expect(unicodeUser?.bio).toContain('🎉');
  });

  test('foreign key relationships survive migration', async () => {
    // Seed parent table
    await db('organizations').insert([
      { id: 1, name: 'Org A' },
      { id: 2, name: 'Org B' },
    ]);

    // Seed child table with relationships
    await db('users').insert([
      { id: 1, email: 'a@test.com', name: 'User A', organization_id: 1 },
      { id: 2, email: 'b@test.com', name: 'User B', organization_id: 2 },
      { id: 3, email: 'c@test.com', name: 'User C', organization_id: 1 },
    ]);

    // Run migration
    await db.migrate.latest({ directory: './migrations' });

    // Verify relationships are intact
    const usersWithOrgs = await db('users')
      .join('organizations', 'users.organization_id', 'organizations.id')
      .select('users.email', 'organizations.name as org_name');

    expect(usersWithOrgs).toHaveLength(3);
    expect(usersWithOrgs.find(u => u.email === 'a@test.com')?.org_name).toBe('Org A');
    expect(usersWithOrgs.find(u => u.email === 'b@test.com')?.org_name).toBe('Org B');
  });
});
```

### Performance Test with Realistic Volume

```ts
// tests/migrations/performance.test.ts
import Knex from 'knex';
import { faker } from '@faker-js/faker';

describe('Migration performance', () => {
  let db: Knex.Knex;

  // ... (container setup)

  test('migration completes within acceptable time for 500K rows', async () => {
    // Seed with realistic volume
    const BATCH_SIZE = 1000;
    const TOTAL_ROWS = 500_000;

    console.log(`Seeding ${TOTAL_ROWS} rows...`);
    for (let i = 0; i < TOTAL_ROWS; i += BATCH_SIZE) {
      const batch = Array.from({ length: BATCH_SIZE }, (_, j) => ({
        email: `user-${i + j}@test.com`,
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        created_at: faker.date.past({ years: 5 }),
      }));
      await db('users').insert(batch);
    }

    // Run migration and measure time
    const start = Date.now();
    await db.migrate.latest({ directory: './migrations' });
    const duration = Date.now() - start;

    console.log(`Migration completed in ${duration}ms for ${TOTAL_ROWS} rows`);

    // Assertion: migration should complete in reasonable time
    // Adjust threshold based on your infrastructure
    expect(duration).toBeLessThan(120_000); // 2 minutes max

    // Verify row count is unchanged
    const count = await db('users').count('* as count').first();
    expect(Number(count?.count)).toBe(TOTAL_ROWS);
  }, 300_000); // 5 minute test timeout

  test('table is not locked for writes during migration', async () => {
    // This tests that the migration uses non-blocking techniques
    // (e.g., CREATE INDEX CONCURRENTLY on PostgreSQL)

    // Start migration in background
    const migrationPromise = db.migrate.latest({ directory: './migrations' });

    // Attempt a write during migration
    const writePromise = db('users').insert({
      email: 'during-migration@test.com',
      name: 'Written During Migration',
    });

    // Both should complete without deadlock
    await Promise.all([migrationPromise, writePromise]);

    // Verify the write succeeded
    const user = await db('users').where({ email: 'during-migration@test.com' }).first();
    expect(user).toBeDefined();
  });
});
```

### Rollback Safety Test

```ts
// tests/migrations/rollback.test.ts
describe('Migration rollback safety', () => {
  let db: Knex.Knex;

  test('full migration cycle: UP → verify → DOWN → verify', async () => {
    // Seed initial data
    await db('users').insert([
      { id: 1, email: 'test@test.com', name: 'Test User' },
    ]);

    // Snapshot before
    const before = await db('users').select('*');

    // Migrate UP
    await db.migrate.latest({ directory: './migrations' });
    const afterUp = await db('users').select('*');
    expect(afterUp).toHaveLength(1);
    expect(afterUp[0].email).toBe('test@test.com');

    // Migrate DOWN (rollback)
    await db.migrate.rollback({ directory: './migrations' }, true);
    const afterDown = await db('users').select('*');

    // Data should be back to original state
    expect(afterDown).toHaveLength(before.length);
    expect(afterDown[0].email).toBe(before[0].email);

    // Schema should be back to original state
    const columns = await db('users').columnInfo();
    const originalColumns = Object.keys(columns);
    // New columns from migration should be gone
    expect(originalColumns).not.toContain('organization_id');
  });

  test('rollback handles data that was added after migration', async () => {
    // Migrate UP
    await db.migrate.latest({ directory: './migrations' });

    // Add data using the new schema
    await db('users').insert({
      email: 'new@test.com',
      name: 'New User',
      organization_id: 1,  // New column from migration
    });

    // Rollback — what happens to data in the new column?
    await db.migrate.rollback({ directory: './migrations' }, true);

    // User should still exist (row not deleted)
    const user = await db('users').where({ email: 'new@test.com' }).first();
    expect(user).toBeDefined();
    expect(user.name).toBe('New User');
    // organization_id column is gone, which is expected
  });
});
```

### package.json Scripts

```json
{
  "scripts": {
    "test:migration": "jest tests/migrations/ --forceExit --runInBand",
    "test:migration:perf": "jest tests/migrations/performance.test.ts --forceExit --runInBand",
    "db:migrate": "knex migrate:latest",
    "db:rollback": "knex migrate:rollback",
    "db:seed:test": "ts-node tests/migrations/helpers/seed-production-like.ts"
  }
}
```

---

## Common Pitfalls

### 1. Testing migrations against an empty database
**Problem:** Migration adds `NOT NULL` constraint — works fine on empty table. In production, 12,000 rows have null values, migration fails, table is locked, site is down.
**Fix:** Always seed your test database with production-like data before running the migration. Include null values, edge cases, and realistic volumes.

### 2. Not testing DOWN migrations
**Problem:** Migration UP works. Two days later you discover a bug and need to roll back. The DOWN migration was auto-generated and deletes the wrong column, or it was never written.
**Fix:** Every migration test includes the full UP → DOWN cycle. Verify data integrity after the rollback, not just that the command didn't error.

### 3. Running migrations with `runInBand` but not in CI
**Problem:** Migrations that work locally fail in CI because Jest runs tests in parallel, and two tests try to migrate the same database simultaneously.
**Fix:** Always run migration tests with `--runInBand` (sequential). Each test should use its own database instance (Testcontainers makes this easy).

### 4. Not handling partial migration failures
**Problem:** Migration creates a new table, copies data, then drops the old table. Step 2 fails. Now you have both tables, the new one with partial data.
**Fix:** Wrap multi-step migrations in transactions where possible. For DDL that can't be transactional (MySQL), add idempotency checks (`IF NOT EXISTS`, `IF EXISTS`).

### 5. Testing only the latest migration
**Problem:** You test the migration you just wrote. You don't test that running all migrations from scratch (on a fresh database) still works.
**Fix:** Include a test that runs `migrate.latest()` from a completely empty database. This catches interactions between migrations.

### 6. Ignoring migration performance
**Problem:** Migration adds an index on a table with 10 million rows. In test, the table has 100 rows and migration takes 50ms. In production, it locks the table for 25 minutes.
**Fix:** Performance-test migrations with realistic data volumes. Use `CREATE INDEX CONCURRENTLY` (PostgreSQL) or online DDL techniques for large tables.

---

## Proof Artifact

A data migration test pass produces these artifacts:

### Test output
```
PASS  tests/migrations/migration-up-down.test.ts (15.2s)
  Migration: add_organization_id_to_users
    ✓ migration UP adds organization_id column (2.1s)
    ✓ migration DOWN removes organization_id column (1.8s)
    ✓ migration is idempotent (0.9s)

PASS  tests/migrations/data-integrity.test.ts (8.4s)
  Data integrity through migration
    ✓ edge-case data survives migration (3.2s)
    ✓ foreign key relationships survive migration (2.1s)

PASS  tests/migrations/performance.test.ts (95.3s)
  Migration performance
    ✓ migration completes within acceptable time for 500K rows (89.1s)
      → Migration completed in 34,200ms for 500,000 rows
    ✓ table is not locked for writes during migration (4.2s)

PASS  tests/migrations/rollback.test.ts (6.1s)
  Migration rollback safety
    ✓ full migration cycle: UP → verify → DOWN → verify (3.4s)
    ✓ rollback handles data that was added after migration (2.3s)

Test Suites: 4 passed, 4 total
Tests:       9 passed, 9 total
```

### What constitutes a pass:
1. **Migration UP** succeeds with edge-case data (nulls, unicode, long strings, special characters)
2. **Migration DOWN** succeeds and restores the original schema and data
3. **Data integrity verified** — row counts match, values are unchanged, relationships are intact
4. **Performance acceptable** — migration completes within the threshold for production-like volumes
5. **No table locking** — writes are not blocked during the migration (where applicable)
6. **CI pipeline** completes the migration test job with exit code 0
