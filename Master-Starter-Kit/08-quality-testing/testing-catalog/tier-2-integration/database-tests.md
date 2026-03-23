# Database Tests

## What It Is

Database tests verify that your schema migrations, constraints, queries, and data transformations work correctly against a real database engine — not an in-memory approximation, not a mock. They answer the questions that no amount of application-level testing can answer: Does the migration run without errors on a database that already has data? Do the foreign key constraints actually prevent orphaned records? Does the unique index catch duplicates at the database level, or only at the application level? Does the query return correct results when there are 0 rows, 1 row, and 10,000 rows? Database tests are your safety net for the layer of your application that is hardest to roll back when something goes wrong in production.

## What It Catches

- **Broken migrations** — A migration adds a `NOT NULL` column without a default value to a table that already has rows, causing the migration to fail on any non-empty database
- **Missing down migrations** — The `up` migration creates a table with a unique index, but the `down` migration forgets to drop the index, causing a "relation already exists" error on the next `up` after a rollback
- **Constraint violations at the DB level** — Application code relies on unique email validation in the service layer, but two concurrent requests bypass the application check and both insert, causing a 500 error instead of a graceful 409 because the unique constraint was never added to the schema
- **Foreign key cascade surprises** — Deleting a user cascades to delete their orders, invoices, and payment records, which was not the intended behavior (should have been `SET NULL` or `RESTRICT`)
- **Query correctness with edge data** — A `WHERE created_at > $1` query that works with timestamps but fails with date-only values because the comparison semantics differ
- **Index effectiveness** — A query that does a sequential scan on 500K rows because the index is on `(user_id, created_at)` but the query filters on `(created_at, user_id)` in the wrong order
- **Data type mismatches** — Storing a UUID as `VARCHAR(36)` instead of the native `UUID` type, losing index performance and validation
- **Seed data inconsistencies** — The seed script creates a user with role `"Admin"` but the check constraint only allows `"admin"` (lowercase), so the seed fails on a fresh database
- **Timezone handling** — Storing `TIMESTAMP` (without timezone) and reading it back in a different timezone context, getting times shifted by hours

## When It's Required

Database tests are required for:

| Trigger | What to Test |
|---------|-------------|
| Every new migration | `up` runs cleanly on empty DB, `up` runs on DB with existing data, `down` reverses cleanly, `up` again after `down` produces same schema |
| New constraints (unique, check, FK) | Constraint rejects invalid data, constraint allows valid data, error message is usable |
| Complex queries (joins, subqueries, CTEs) | Correct results with 0 rows, 1 row, boundary data, null values, and large-ish datasets (1K+ rows) |
| Seed/fixture data changes | Seeds run on a fresh DB, seeds are idempotent (running twice does not duplicate data) |
| Prisma schema changes | Generated client matches the actual DB schema, relations resolve correctly |
| Any raw SQL (bypassing the ORM) | Parameterized queries prevent injection, results match expected types |

## Setup Guide

### Test database via Docker

```yaml
# docker-compose.test.yml
services:
  db-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: testdb
    ports:
      - '5433:5432'
    tmpfs:
      - /var/lib/postgresql/data  # in-memory for speed
    command: >
      postgres
        -c fsync=off
        -c synchronous_commit=off
        -c full_page_writes=off
```

The `fsync=off` and related flags disable durability guarantees — this makes the test database much faster because it does not need to write to disk. Never use these settings in production.

### Alternative: SQLite for lightweight projects

For projects using SQLite (via Drizzle or Prisma):

```ts
// test/db-setup.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export function createTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite);
  migrate(db, { migrationsFolder: './drizzle' });
  return db;
}
```

In-memory SQLite is fast and disposable, but it does not support Postgres-specific features (JSONB, arrays, CTEs with recursive, etc.). Use it for simple schemas; use Docker Postgres for anything non-trivial.

### Prisma-specific setup

```bash
# Generate test client pointing at test DB
DATABASE_URL="postgresql://test:test@localhost:5433/testdb" pnpm prisma generate

# Run migrations
DATABASE_URL="postgresql://test:test@localhost:5433/testdb" pnpm prisma migrate deploy

# Reset (drop + migrate + seed) — useful between test suites
DATABASE_URL="postgresql://test:test@localhost:5433/testdb" pnpm prisma migrate reset --force
```

### Package.json scripts

```json
{
  "scripts": {
    "test:db": "vitest run --config vitest.db.config.ts",
    "test:db:setup": "docker compose -f docker-compose.test.yml up -d && sleep 2 && DATABASE_URL=$TEST_DATABASE_URL pnpm prisma migrate deploy",
    "test:db:teardown": "docker compose -f docker-compose.test.yml down -v"
  }
}
```

## Template

### Migration test

```ts
// src/db/migrations.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { Client } from 'pg';

const TEST_DB_URL = process.env.TEST_DATABASE_URL
  || 'postgresql://test:test@localhost:5433/testdb';

describe('database migrations', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: TEST_DB_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it('migrates up from empty database', () => {
    // Reset to empty state
    execSync(`DATABASE_URL="${TEST_DB_URL}" pnpm prisma migrate reset --force --skip-seed`, {
      stdio: 'pipe',
    });

    // Run all migrations
    const result = execSync(`DATABASE_URL="${TEST_DB_URL}" pnpm prisma migrate deploy`, {
      encoding: 'utf-8',
    });

    expect(result).toContain('All migrations have been successfully applied');
  });

  it('migrates down and back up cleanly', () => {
    // This test verifies that rollback + re-apply produces a consistent schema.
    // With Prisma, "down" migrations are manual — use prisma migrate diff to verify.
    // With Drizzle or raw SQL migrations, test the actual down migration:

    execSync(`DATABASE_URL="${TEST_DB_URL}" pnpm prisma migrate reset --force --skip-seed`, {
      stdio: 'pipe',
    });

    // Verify schema matches expected state
    const tables = execSync(
      `DATABASE_URL="${TEST_DB_URL}" psql -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public'" -t`,
      { encoding: 'utf-8' }
    );

    expect(tables).toContain('users');
    expect(tables).toContain('teams');
    expect(tables).toContain('_prisma_migrations');
  });

  it('preserves existing data through migration', async () => {
    // Reset and apply all migrations except the last one
    execSync(`DATABASE_URL="${TEST_DB_URL}" pnpm prisma migrate reset --force --skip-seed`, {
      stdio: 'pipe',
    });

    // Insert test data
    await client.query(`
      INSERT INTO users (id, email, name, role, created_at)
      VALUES ('test-uuid', 'existing@example.com', 'Existing User', 'member', NOW())
    `);

    // Apply remaining migrations (should not lose the test data)
    execSync(`DATABASE_URL="${TEST_DB_URL}" pnpm prisma migrate deploy`, { stdio: 'pipe' });

    // Verify data survived
    const result = await client.query('SELECT * FROM users WHERE id = $1', ['test-uuid']);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toBe('existing@example.com');
  });
});
```

### Constraint test

```ts
// src/db/constraints.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './client';
import { users, teams, teamMembers } from './schema';

describe('database constraints', () => {
  beforeEach(async () => {
    await db.delete(teamMembers);
    await db.delete(users);
    await db.delete(teams);
  });

  it('enforces unique email constraint', async () => {
    await db.insert(users).values({
      id: 'user-1',
      email: 'unique@example.com',
      name: 'First',
      role: 'member',
    });

    await expect(
      db.insert(users).values({
        id: 'user-2',
        email: 'unique@example.com',  // duplicate
        name: 'Second',
        role: 'member',
      })
    ).rejects.toThrow(/unique constraint/i);
  });

  it('enforces role check constraint', async () => {
    await expect(
      db.insert(users).values({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'superadmin',  // not in allowed values
      })
    ).rejects.toThrow(/check constraint|invalid input/i);
  });

  it('enforces foreign key on team_members → users', async () => {
    const team = await db.insert(teams).values({ id: 'team-1', name: 'Test Team' }).returning();

    await expect(
      db.insert(teamMembers).values({
        teamId: team[0].id,
        userId: 'nonexistent-user',  // no such user
        role: 'member',
      })
    ).rejects.toThrow(/foreign key constraint/i);
  });

  it('cascades user deletion to team_members', async () => {
    // Setup: user in a team
    await db.insert(users).values({ id: 'user-1', email: 'test@example.com', name: 'Test', role: 'member' });
    await db.insert(teams).values({ id: 'team-1', name: 'Team' });
    await db.insert(teamMembers).values({ teamId: 'team-1', userId: 'user-1', role: 'member' });

    // Delete user
    await db.delete(users).where(eq(users.id, 'user-1'));

    // Verify team_member was also deleted (CASCADE)
    const members = await db.select().from(teamMembers).where(eq(teamMembers.userId, 'user-1'));
    expect(members).toHaveLength(0);
  });
});
```

### Query correctness test

```ts
// src/db/queries.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './client';
import { users } from './schema';
import { findUsersByRole, searchUsers } from './queries';

describe('findUsersByRole', () => {
  beforeEach(async () => {
    await db.delete(users);
    await db.insert(users).values([
      { id: '1', email: 'admin1@test.com', name: 'Admin One', role: 'admin' },
      { id: '2', email: 'admin2@test.com', name: 'Admin Two', role: 'admin' },
      { id: '3', email: 'member@test.com', name: 'Member', role: 'member' },
    ]);
  });

  it('returns only users with the specified role', async () => {
    const admins = await findUsersByRole('admin');
    expect(admins).toHaveLength(2);
    expect(admins.every(u => u.role === 'admin')).toBe(true);
  });

  it('returns empty array when no users match', async () => {
    const viewers = await findUsersByRole('viewer');
    expect(viewers).toEqual([]);
  });
});

describe('searchUsers', () => {
  beforeEach(async () => {
    await db.delete(users);
    await db.insert(users).values([
      { id: '1', email: 'alice@test.com', name: 'Alice Johnson', role: 'member' },
      { id: '2', email: 'bob@test.com', name: 'Bob Smith', role: 'member' },
      { id: '3', email: 'alice.smith@test.com', name: 'Alice Smith', role: 'admin' },
    ]);
  });

  it('searches by name (case-insensitive)', async () => {
    const results = await searchUsers('alice');
    expect(results).toHaveLength(2);
  });

  it('searches by email', async () => {
    const results = await searchUsers('bob@');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Bob Smith');
  });

  it('returns empty for no matches', async () => {
    const results = await searchUsers('charlie');
    expect(results).toEqual([]);
  });

  it('handles special characters in search (SQL injection prevention)', async () => {
    // This should not throw or return all rows
    const results = await searchUsers("'; DROP TABLE users; --");
    expect(results).toEqual([]);
  });
});
```

### Seed idempotency test

```ts
// src/db/seed.test.ts
import { describe, it, expect } from 'vitest';
import { seed } from './seed';
import { db } from './client';
import { users } from './schema';

describe('database seed', () => {
  it('runs successfully on an empty database', async () => {
    await db.delete(users);
    await expect(seed()).resolves.not.toThrow();

    const userCount = await db.select().from(users);
    expect(userCount.length).toBeGreaterThan(0);
  });

  it('is idempotent — running twice does not duplicate data', async () => {
    await db.delete(users);

    await seed();
    const countAfterFirst = (await db.select().from(users)).length;

    await seed();
    const countAfterSecond = (await db.select().from(users)).length;

    expect(countAfterSecond).toBe(countAfterFirst);
  });
});
```

## Common Pitfalls

### 1. Testing against a different database engine than production

If production runs Postgres 16 but tests use SQLite, you miss Postgres-specific behavior: JSONB operators, array columns, `ON CONFLICT` syntax differences, sequence behavior, and timezone handling. Always test against the same engine and major version as production. Docker makes this easy.

### 2. Not testing migrations on a database with existing data

A migration that works on an empty database can fail catastrophically on a database with 500K rows. The classic case: adding a `NOT NULL` column without a default. On an empty table, this succeeds. On a table with data, it fails. Always test migrations against a database seeded with realistic data.

### 3. Forgetting to test the down migration

If you ever need to rollback (and you will), the down migration must cleanly reverse the up migration. If the up migration creates a table with indexes and the down only drops the table, the indexes become orphaned. Test the full cycle: up → verify → down → verify → up again → verify.

### 4. Shared test database state between test files

If `users.test.ts` and `orders.test.ts` both assume certain users exist, they will interfere with each other. Each test file must set up its own data and clean up after itself. Consider using schemas (`CREATE SCHEMA test_xyz`) or separate databases per test file for full isolation.

### 5. Not testing constraint error messages

Your application needs to catch database constraint violations and return user-friendly errors. If the unique constraint on `email` throws `ERROR: duplicate key value violates unique constraint "users_email_key"`, your application must parse this and return "Email already exists." Test that the error handling works, not just that the constraint exists.

### 6. Testing with unrealistic data volumes

A query that performs well with 10 rows may time out with 100K rows. Include at least one test per complex query that inserts a non-trivial amount of data (1K-10K rows) and verifies the query completes within an acceptable time. This is not a load test — it is a basic sanity check that the query plan is reasonable.

## Proof Artifact

The enforcement system accepts the following as evidence that database tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Test results (JSON)** | `vitest run --config vitest.db.config.ts --reporter=json > db-test-results.json` | All database tests passed |
| **Migration log** | `pnpm prisma migrate deploy 2>&1` | All migrations applied cleanly |
| **Docker logs** | `docker compose -f docker-compose.test.yml logs db-test` | Real Postgres was used, not a mock |

**Minimum passing criteria:**

- All database tests pass (0 failures)
- Tests ran against a real database engine matching production (Postgres version, not SQLite)
- Migration up/down/up cycle completes without errors
- Constraint tests verify both rejection of invalid data and acceptance of valid data
- Seed is idempotent (runs twice without error or duplication)
- At least one query test includes parameterized-input safety (SQL injection prevention)
