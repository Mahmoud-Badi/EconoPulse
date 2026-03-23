# Database Migration Testing

Every migration must be tested before it touches production data. A bad migration is the one bug you cannot hotfix — rollback may lose data, and re-running may corrupt it. Test migrations like you test code: systematically, with assertions, on realistic data.

---

## What Must Be Tested

| Test | Purpose | Required? |
|------|---------|-----------|
| UP on empty DB | Migration applies cleanly to a fresh database | Always |
| UP on DB with data | Migration handles existing rows correctly | Always |
| DOWN (rollback) | Rollback restores previous state without data loss | Always |
| Idempotency | Running migration twice doesn't break anything | Always |
| Data integrity | No orphaned FKs, no truncation, no type coercion | When modifying columns or relationships |
| Performance | Migration completes within acceptable time | When touching large tables |
| Rollback safety | Assessment of whether rollback is safe or requires coordination | Always |

---

## UP Path Verification

### Test 1: Apply on Empty Database

```typescript
// migrations/__tests__/001-add-trips-table.migration.test.ts
import { createTestDatabase, applyMigration, destroyTestDatabase } from './migration-test-utils';

describe('Migration 001: Add trips table', () => {
  let db: TestDatabase;

  beforeEach(async () => {
    db = await createTestDatabase(); // Fresh, empty DB
  });

  afterEach(async () => {
    await destroyTestDatabase(db);
  });

  it('applies cleanly on empty database', async () => {
    await applyMigration(db, '001-add-trips-table');

    // Verify table exists with correct columns
    const columns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'trips'
      ORDER BY ordinal_position
    `);

    expect(columns.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ column_name: 'id', data_type: 'uuid', is_nullable: 'NO' }),
        expect.objectContaining({ column_name: 'name', data_type: 'character varying', is_nullable: 'NO' }),
        expect.objectContaining({ column_name: 'status', data_type: 'character varying', column_default: "'draft'" }),
        expect.objectContaining({ column_name: 'created_at', data_type: 'timestamp with time zone' }),
      ])
    );

    // Verify indexes exist
    const indexes = await db.query(`
      SELECT indexname FROM pg_indexes WHERE tablename = 'trips'
    `);
    expect(indexes.rows.map((r: any) => r.indexname)).toContain('trips_status_idx');
  });
});
```

### Test 2: Apply on Database with Existing Data

```typescript
it('applies correctly with existing data in related tables', async () => {
  // Apply all prior migrations first
  await applyMigrationsUpTo(db, '000-initial');

  // Seed realistic data
  await db.query(`
    INSERT INTO users (id, email, name)
    VALUES ('user-1', 'alice@example.com', 'Alice'),
           ('user-2', 'bob@example.com', 'Bob')
  `);

  // Apply the migration under test
  await applyMigration(db, '001-add-trips-table');

  // Verify existing data is untouched
  const users = await db.query('SELECT count(*) FROM users');
  expect(users.rows[0].count).toBe('2');

  // Verify new table accepts inserts that reference existing data
  await db.query(`
    INSERT INTO trips (id, name, status, created_by)
    VALUES ('trip-1', 'Test Trip', 'draft', 'user-1')
  `);

  const trip = await db.query("SELECT * FROM trips WHERE id = 'trip-1'");
  expect(trip.rows[0].created_by).toBe('user-1');
});
```

---

## DOWN Path Verification

### Rollback Without Data Loss

```typescript
it('rolls back cleanly without losing data', async () => {
  // Apply migration
  await applyMigration(db, '001-add-trips-table');

  // Insert data into the new table
  await db.query(`
    INSERT INTO trips (id, name, status) VALUES ('trip-1', 'Test', 'draft')
  `);

  // Rollback
  await rollbackMigration(db, '001-add-trips-table');

  // Verify table no longer exists
  const tables = await db.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'trips'
  `);
  expect(tables.rows).toHaveLength(0);

  // Verify other tables are still intact
  const users = await db.query('SELECT count(*) FROM users');
  expect(parseInt(users.rows[0].count)).toBeGreaterThan(0);
});
```

### Testing Column Modifications (the Hard Case)

```typescript
// Migration: Rename column "name" to "title" on trips table
describe('Migration 005: Rename trips.name to trips.title', () => {
  it('preserves data during column rename', async () => {
    await applyMigrationsUpTo(db, '004');

    // Insert data with old column name
    await db.query(`
      INSERT INTO trips (id, name, status)
      VALUES ('trip-1', 'Paris Vacation', 'draft'),
             ('trip-2', 'Tokyo Business', 'active')
    `);

    // Apply rename migration
    await applyMigration(db, '005-rename-name-to-title');

    // Verify data survived the rename
    const trips = await db.query('SELECT id, title FROM trips ORDER BY id');
    expect(trips.rows).toEqual([
      { id: 'trip-1', title: 'Paris Vacation' },
      { id: 'trip-2', title: 'Tokyo Business' },
    ]);

    // Verify old column no longer exists
    const columns = await db.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'trips' AND column_name = 'name'
    `);
    expect(columns.rows).toHaveLength(0);
  });

  it('rolls back rename without data loss', async () => {
    await applyMigrationsUpTo(db, '004');
    await db.query("INSERT INTO trips (id, name) VALUES ('trip-1', 'Test')");

    // Apply and rollback
    await applyMigration(db, '005-rename-name-to-title');
    await rollbackMigration(db, '005-rename-name-to-title');

    // Data should be back in the original column
    const trips = await db.query('SELECT name FROM trips');
    expect(trips.rows[0].name).toBe('Test');
  });
});
```

---

## Data Integrity Checks

```typescript
describe('Data integrity after migration', () => {
  it('no orphaned foreign keys', async () => {
    await applyMigration(db, '003-add-bookings');

    // Check for bookings referencing non-existent trips
    const orphans = await db.query(`
      SELECT b.id FROM bookings b
      LEFT JOIN trips t ON b.trip_id = t.id
      WHERE t.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });

  it('no data truncation on type change', async () => {
    await applyMigrationsUpTo(db, '006');

    // Insert max-length data in the old type
    const longName = 'A'.repeat(255); // VARCHAR(255) → VARCHAR(100)
    await db.query(`INSERT INTO categories (id, name) VALUES ('cat-1', $1)`, [longName]);

    // Apply migration that reduces column size
    // This SHOULD fail if the migration doesn't handle existing long data
    await expect(
      applyMigration(db, '007-reduce-category-name-length')
    ).rejects.toThrow(); // Or: verify data is truncated with warning
  });

  it('no unintended type coercion', async () => {
    await applyMigrationsUpTo(db, '009');

    // Insert numeric string data
    await db.query("INSERT INTO settings (key, value) VALUES ('port', '3000')");

    // Apply migration that changes value column from VARCHAR to JSONB
    await applyMigration(db, '010-settings-value-to-jsonb');

    const result = await db.query("SELECT value FROM settings WHERE key = 'port'");
    // Should be stored as JSON string "3000", not number 3000
    expect(typeof result.rows[0].value).toBe('string');
  });
});
```

---

## Idempotency Test

```typescript
it('running migration twice does not break', async () => {
  await applyMigration(db, '001-add-trips-table');

  // Insert data
  await db.query("INSERT INTO trips (id, name) VALUES ('trip-1', 'Test')");

  // Apply same migration again — should be a no-op or graceful skip
  // (Most migration tools handle this via migration_lock table)
  await expect(
    applyMigration(db, '001-add-trips-table')
  ).resolves.not.toThrow();

  // Verify data is intact
  const trips = await db.query('SELECT count(*) FROM trips');
  expect(trips.rows[0].count).toBe('1');
});
```

---

## Performance Test

```typescript
describe('Migration performance on production-sized data', () => {
  it('completes within 60 seconds on 1M rows', async () => {
    await applyMigrationsUpTo(db, '011');

    // Seed production-scale data
    await seedLargeDataset(db, 'trips', 1_000_000);

    const start = Date.now();
    await applyMigration(db, '012-add-trips-search-index');
    const duration = Date.now() - start;

    console.log(`Migration completed in ${duration}ms`);
    expect(duration).toBeLessThan(60_000); // 60 second limit

    // Verify index was created
    const indexes = await db.query(`
      SELECT indexname FROM pg_indexes
      WHERE tablename = 'trips' AND indexname = 'trips_search_idx'
    `);
    expect(indexes.rows).toHaveLength(1);
  }, 120_000); // Test timeout: 2 minutes
});
```

---

## Rollback Safety Assessment

Every migration must declare its rollback safety level.

| Level | Meaning | Example | Action Required |
|-------|---------|---------|-----------------|
| **SAFE** | Rollback has zero data loss risk | Adding a new table, adding a nullable column | Can rollback anytime |
| **CAUTION** | Rollback loses data added since migration | Adding a column with new data, creating a new table with data | Coordinate timing |
| **UNSAFE** | Rollback causes data loss or corruption | Dropping a column, changing column type destructively | Requires backup + coordination window |
| **IRREVERSIBLE** | Cannot be rolled back automatically | Data transformation (encrypting PII, merging rows) | Must write forward-only migration |

### Declare in Migration File

```typescript
// migrations/012-add-search-index.ts
export const meta = {
  id: '012',
  name: 'add-trips-search-index',
  rollbackSafety: 'SAFE', // Adding an index — no data change
  estimatedDuration: '< 5s on 100K rows, < 60s on 1M rows',
  notes: 'Creates GIN index on trips.name for full-text search',
};

export async function up(db: Knex) {
  await db.raw('CREATE INDEX CONCURRENTLY trips_search_idx ON trips USING gin(to_tsvector(\'english\', name))');
}

export async function down(db: Knex) {
  await db.raw('DROP INDEX IF EXISTS trips_search_idx');
}
```

---

## Common Migration Pitfalls

### 1. Renaming a Column (Don't)

```sql
-- BAD: Breaks all application code instantly
ALTER TABLE trips RENAME COLUMN name TO title;

-- GOOD: Three-phase migration (safe, zero downtime)
-- Phase 1: Add new column, copy data, write to both
ALTER TABLE trips ADD COLUMN title VARCHAR(255);
UPDATE trips SET title = name;
-- Deploy code that writes to BOTH columns

-- Phase 2: Switch reads to new column
-- Deploy code that reads from "title" only

-- Phase 3: Drop old column (separate migration, after phase 2 is stable)
ALTER TABLE trips DROP COLUMN name;
```

### 2. Adding a NOT NULL Column Without Default

```sql
-- BAD: Fails if table has existing rows
ALTER TABLE trips ADD COLUMN category VARCHAR(50) NOT NULL;

-- GOOD: Add with default, then optionally remove default later
ALTER TABLE trips ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'uncategorized';
```

### 3. Changing Column Type

```sql
-- BAD: Silent data truncation
ALTER TABLE trips ALTER COLUMN name TYPE VARCHAR(50); -- Was VARCHAR(255)

-- GOOD: Check data first, then alter
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM trips WHERE LENGTH(name) > 50) THEN
    RAISE EXCEPTION 'Data would be truncated: % rows exceed 50 chars',
      (SELECT count(*) FROM trips WHERE LENGTH(name) > 50);
  END IF;
END $$;
ALTER TABLE trips ALTER COLUMN name TYPE VARCHAR(50);
```

### 4. Adding an Index on a Large Table

```sql
-- BAD: Locks the table for the duration (blocks all reads/writes)
CREATE INDEX trips_status_idx ON trips(status);

-- GOOD: Non-blocking index creation
CREATE INDEX CONCURRENTLY trips_status_idx ON trips(status);
-- Note: CONCURRENTLY cannot run inside a transaction
```

### 5. Dropping a Table with Foreign Keys

```sql
-- BAD: Fails if other tables reference it
DROP TABLE trips;

-- GOOD: Drop constraints first, or cascade
DROP TABLE trips CASCADE;
-- But verify what CASCADE will drop!
```

---

## Migration Test File Template

```typescript
// migrations/__tests__/{{MIGRATION_ID}}-{{MIGRATION_NAME}}.migration.test.ts

import {
  createTestDatabase,
  destroyTestDatabase,
  applyMigrationsUpTo,
  applyMigration,
  rollbackMigration,
  type TestDatabase,
} from './migration-test-utils';

/**
 * Migration: {{MIGRATION_ID}} — {{MIGRATION_DESCRIPTION}}
 * Rollback Safety: {{ROLLBACK_SAFETY_LEVEL}}
 * Estimated Duration: {{ESTIMATED_DURATION}}
 */
describe('Migration {{MIGRATION_ID}}: {{MIGRATION_NAME}}', () => {
  let db: TestDatabase;

  beforeEach(async () => {
    db = await createTestDatabase();
    await applyMigrationsUpTo(db, '{{PREVIOUS_MIGRATION_ID}}');
  });

  afterEach(async () => {
    await destroyTestDatabase(db);
  });

  // --- UP PATH ---

  it('applies cleanly on empty database', async () => {
    const freshDb = await createTestDatabase();
    await applyMigration(freshDb, '{{MIGRATION_ID}}');
    // Verify expected schema changes
    await destroyTestDatabase(freshDb);
  });

  it('applies correctly with existing data', async () => {
    // Seed realistic data
    // Apply migration
    // Verify existing data is intact
    // Verify new schema is correct
  });

  // --- DOWN PATH ---

  it('rolls back without data loss', async () => {
    await applyMigration(db, '{{MIGRATION_ID}}');
    await rollbackMigration(db, '{{MIGRATION_ID}}');
    // Verify previous schema is restored
    // Verify existing data is intact
  });

  // --- DATA INTEGRITY ---

  it('no orphaned foreign keys after migration', async () => {
    await applyMigration(db, '{{MIGRATION_ID}}');
    // Check for orphaned references
  });

  // --- IDEMPOTENCY ---

  it('is idempotent (safe to run twice)', async () => {
    await applyMigration(db, '{{MIGRATION_ID}}');
    await expect(applyMigration(db, '{{MIGRATION_ID}}')).resolves.not.toThrow();
  });

  // --- PERFORMANCE (if touching large tables) ---
  // it('completes within {{MAX_DURATION}} on {{ROW_COUNT}} rows', async () => { ... });
});
```

---

## Migration Test Utilities

```typescript
// migrations/__tests__/migration-test-utils.ts
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

export interface TestDatabase {
  pool: Pool;
  name: string;
  query: (sql: string, params?: any[]) => Promise<any>;
}

export async function createTestDatabase(): Promise<TestDatabase> {
  const adminPool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const dbName = `test_migration_${randomUUID().slice(0, 8)}`;

  await adminPool.query(`CREATE DATABASE "${dbName}"`);
  await adminPool.end();

  const pool = new Pool({
    connectionString: process.env.TEST_DATABASE_URL?.replace(/\/[^/]+$/, `/${dbName}`),
  });

  return {
    pool,
    name: dbName,
    query: (sql, params) => pool.query(sql, params),
  };
}

export async function destroyTestDatabase(db: TestDatabase): Promise<void> {
  await db.pool.end();
  const adminPool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await adminPool.query(`DROP DATABASE IF EXISTS "${db.name}"`);
  await adminPool.end();
}

export async function applyMigration(db: TestDatabase, migrationId: string): Promise<void> {
  const migration = await import(`../../${migrationId}`);
  await migration.up(db);
}

export async function rollbackMigration(db: TestDatabase, migrationId: string): Promise<void> {
  const migration = await import(`../../${migrationId}`);
  await migration.down(db);
}

export async function applyMigrationsUpTo(db: TestDatabase, upToId: string): Promise<void> {
  // Load all migrations in order, apply each one up to and including upToId
  const migrations = getMigrationList(); // Implement based on your migration tool
  for (const m of migrations) {
    await applyMigration(db, m.id);
    if (m.id === upToId) break;
  }
}
```
