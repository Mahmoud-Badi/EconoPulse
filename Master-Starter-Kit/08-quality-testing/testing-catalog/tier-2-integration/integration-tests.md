# Integration Tests

## What It Is

Integration tests verify that two or more modules work correctly together through their real interfaces — not mocked boundaries. Where a unit test isolates a function and mocks everything it depends on, an integration test lets the real dependencies run and checks that the contract between them holds. Does the API route correctly call the service layer, which correctly queries the database, which correctly returns the shaped response? An integration test proves the wiring is correct. It is slower than a unit test (typically 100ms-2s per test) because it involves real I/O — database queries, HTTP calls, middleware chains — but it catches an entire class of bugs that unit tests structurally cannot: the bugs that live in the seams between modules.

## What It Catches

- **Incorrect query construction** — The service layer passes `{ where: { userId: id } }` to Prisma, but the column is actually `user_id` (snake_case). Unit tests with a mocked DB would never catch this because the mock returns whatever you tell it to
- **Middleware ordering bugs** — Auth middleware runs after the rate limiter instead of before it, so unauthenticated requests consume rate limit quota for legitimate users
- **Transaction isolation failures** — Two concurrent requests both read the same inventory count, both decrement it, and the final count is wrong because the queries are not wrapped in a transaction
- **Serialization/deserialization mismatches** — The API serializes dates as ISO strings, but the consuming service tries to parse them as Unix timestamps, getting `NaN`
- **Missing database indexes causing timeouts** — A query that works fine with 100 rows in tests takes 8 seconds with 100K rows in staging because there is no index on the filter column
- **Incorrect error propagation** — The repository throws a `NotFoundError`, the service catches it but re-throws a generic `Error`, and the API route's error handler cannot distinguish between "not found" (404) and "server error" (500)
- **Environment variable misconfiguration** — The database URL is correct in `.env.local` but missing in `.env.test`, so the test silently connects to the development database
- **CORS / header issues** — The API sets `Content-Type: application/json` but the middleware overwrites it to `text/html` for a specific route pattern, breaking the frontend's `response.json()` call

## When It's Required

Integration tests are required whenever two or more modules interact through a boundary that could break independently of either module's internal correctness:

| Boundary | Examples | Why Integration Tests Matter |
|----------|----------|------------------------------|
| API route → Service → Database | CRUD operations, search, filtering | The query, the transformation, and the response shape must all align |
| Auth middleware → Protected routes | Login, session validation, role checks | Middleware must actually block unauthorized access, not just exist |
| External API client → Your service | Payment processing, email sending, OAuth | The client must handle real response shapes, errors, rate limits |
| Message queue → Consumer | Background jobs, event processing | Messages must deserialize correctly and trigger the right handler |
| File upload → Storage → Database | Image upload, document processing | The file must actually persist, the URL must be valid, the DB record must reference it |

**Skip integration tests for:** Pure utility libraries with no I/O, UI-only components (use component integration tests instead), configuration files.

## Setup Guide

### Database: real instance via Docker

Integration tests run against a real database — not an in-memory substitute, not a mock. Use Docker Compose to spin up a Postgres instance for tests:

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
      - '5433:5432'  # different port to avoid conflicts with dev DB
    tmpfs:
      - /var/lib/postgresql/data  # RAM disk for speed
```

```bash
# Start test DB
docker compose -f docker-compose.test.yml up -d

# Run migrations against test DB
DATABASE_URL="postgresql://test:test@localhost:5433/testdb" pnpm prisma migrate deploy

# Run tests
DATABASE_URL="postgresql://test:test@localhost:5433/testdb" pnpm test:integration
```

### HTTP: Supertest for API route testing

```bash
pnpm add -D supertest @types/supertest
```

Supertest creates an HTTP client that calls your Express/Fastify/Next.js API handler directly (no network layer), giving you real request/response cycles without starting a server.

### Test isolation: reset between tests

Every integration test must start with a known database state. Options:

1. **Transaction rollback (fastest):** Wrap each test in a transaction and roll back after. Works for single-connection tests.
2. **Truncate tables (reliable):** `TRUNCATE table1, table2 CASCADE` before each test. Works for multi-connection tests.
3. **Seed per test (safest):** Insert exactly the data the test needs, delete it after. Most explicit but most verbose.

### Package.json scripts

```json
{
  "scripts": {
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:integration:watch": "vitest --config vitest.integration.config.ts",
    "pretest:integration": "docker compose -f docker-compose.test.yml up -d && pnpm prisma migrate deploy"
  }
}
```

### Separate Vitest config for integration tests

```ts
// vitest.integration.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['./test/integration-setup.ts'],
    testTimeout: 10000,  // integration tests are slower
    hookTimeout: 30000,  // DB setup can take time
    pool: 'forks',       // isolate tests in separate processes
    poolOptions: {
      forks: { singleFork: true },  // sequential execution for DB tests
    },
  },
});
```

## Template

### API route integration test (Express/Fastify)

```ts
// src/routes/users.integration.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../app';
import { db } from '../db';
import { createTestUser, cleanupTestData } from '../../test/helpers';

const app = createApp();
const request = supertest(app);

describe('GET /api/users/:id', () => {
  let testUser: { id: string; email: string };

  beforeAll(async () => {
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser({
      email: 'test@example.com',
      name: 'Test User',
      role: 'member',
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await db.destroy();
  });

  it('returns the user when authenticated and authorized', async () => {
    const token = await createAuthToken(testUser.id);

    const response = await request
      .get(`/api/users/${testUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: testUser.id,
      email: 'test@example.com',
      name: 'Test User',
      role: 'member',
      // Note: password hash is NOT in the response — this proves the serializer works
    });
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('returns 401 when no auth token is provided', async () => {
    const response = await request
      .get(`/api/users/${testUser.id}`)
      .expect(401);

    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  });

  it('returns 404 when user does not exist', async () => {
    const token = await createAuthToken(testUser.id);

    await request
      .get('/api/users/nonexistent-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('returns 403 when requesting another user without admin role', async () => {
    const otherUser = await createTestUser({
      email: 'other@example.com',
      name: 'Other User',
      role: 'member',
    });
    const token = await createAuthToken(testUser.id); // not admin

    await request
      .get(`/api/users/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});

describe('POST /api/users', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  it('creates a user and returns the created resource', async () => {
    const adminToken = await createAdminToken();

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'newuser@example.com',
        name: 'New User',
        role: 'member',
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe('newuser@example.com');

    // Verify it actually persisted to the database
    const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, response.body.id),
    });
    expect(dbUser).toBeDefined();
    expect(dbUser!.email).toBe('newuser@example.com');
  });

  it('returns 409 when email already exists', async () => {
    await createTestUser({ email: 'existing@example.com', name: 'Existing', role: 'member' });
    const adminToken = await createAdminToken();

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'existing@example.com',
        name: 'Duplicate',
        role: 'member',
      })
      .expect(409);

    expect(response.body.error).toBe('Conflict');
    expect(response.body.message).toContain('email already exists');
  });

  it('returns 422 with validation errors for invalid input', async () => {
    const adminToken = await createAdminToken();

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'not-an-email',
        name: '',
        role: 'superadmin',  // invalid role
      })
      .expect(422);

    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: expect.any(String) }),
        expect.objectContaining({ field: 'name', message: expect.any(String) }),
        expect.objectContaining({ field: 'role', message: expect.any(String) }),
      ])
    );
  });
});
```

### Test helpers

```ts
// test/helpers.ts
import { db } from '../src/db';
import { users } from '../src/db/schema';
import { sign } from 'jsonwebtoken';

export async function createTestUser(data: {
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
}) {
  const [user] = await db.insert(users).values({
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    role: data.role,
    passwordHash: 'hashed_test_password',
    createdAt: new Date(),
  }).returning();
  return user;
}

export async function createAuthToken(userId: string): Promise<string> {
  return sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function createAdminToken(): Promise<string> {
  const admin = await createTestUser({
    email: `admin-${Date.now()}@test.com`,
    name: 'Admin',
    role: 'admin',
  });
  return createAuthToken(admin.id);
}

export async function cleanupTestData() {
  await db.delete(users);
}
```

## Common Pitfalls

### 1. Using mocks where you need integration tests (and vice versa)

If your "integration test" mocks the database, it is a unit test with extra steps. The entire point of integration testing is that real modules interact through real interfaces. Conversely, do not use a real database for testing a pure function — that is slow for no benefit. The rule: mock at the boundary you are not testing, use real implementations at the boundary you are.

### 2. Test pollution from shared database state

Test A creates a user with email `test@example.com`. Test B also tries to create `test@example.com` and fails with a unique constraint violation — but only when tests run in a specific order. Fix: clean up the database before each test (not after), use unique identifiers (timestamps, UUIDs) in test data, and run integration tests sequentially (not in parallel) unless you have proper isolation.

### 3. Forgetting to test error responses

Most integration test suites cover the happy path thoroughly and then stop. But the error paths are where the real bugs hide — does the API return a proper 422 with field-level errors, or does it return a 500 with a stack trace? Does the error response match the format the frontend expects? Test every error status code your API documents.

### 4. Hardcoded ports and connection strings

`localhost:5432` works on your machine but fails in CI because the test database is on a different port or hostname. Always use environment variables for connection strings, and provide a `.env.test` template with the CI values documented.

### 5. Not testing the full middleware chain

Testing the route handler directly (without middleware) misses auth enforcement, rate limiting, CORS headers, request logging, and error formatting. Use Supertest against the fully assembled app to test the complete request lifecycle.

### 6. Tests that depend on execution order

If Test A creates data that Test B reads, the suite is fragile. Any change to test ordering, parallelization, or file splitting will break it. Each test must set up its own preconditions and not depend on artifacts from other tests.

## Proof Artifact

The enforcement system accepts the following as evidence that integration tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Test results (JSON)** | `vitest run --config vitest.integration.config.ts --reporter=json > integration-results.json` | Pass/fail count, test names, duration |
| **Docker logs** | `docker compose -f docker-compose.test.yml logs` | Test database was running during the test |
| **CI status check** | GitHub Actions integration test job | Green checkmark = all passed in clean environment |

**Minimum passing criteria:**

- All integration tests pass (0 failures)
- Tests ran against a real database (not mocked)
- Both happy-path and error-path scenarios are covered for each API endpoint
- Test isolation is verified — running tests in any order produces the same results
- No tests are skipped (`.skip` is not allowed in committed code)
