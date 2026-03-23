# Contract Tests (Pact)

## What It Is

Contract testing verifies that two services that communicate over an API agree on the shape and behavior of that communication — without requiring both services to be running at the same time. Using the Pact framework, the consumer (the service making requests) writes tests that define its expectations: "I will send this request and I expect this response shape." These expectations become a contract. The provider (the service responding) then verifies independently that it can fulfill every contract. This catches the "works in isolation, breaks in integration" problem that plagues microservices and third-party API integrations, and it catches it in CI before anyone deploys anything.

---

## What It Catches

- **Frontend/backend schema drift** — Frontend expects `{ user: { firstName: "..." } }`, backend team renames it to `{ user: { first_name: "..." } }` in a refactor. Both teams' unit tests pass. Integration breaks in production.
- **Removed or renamed API fields** — Backend removes a deprecated `legacyId` field. Two consumers still depend on it. Neither team knows the other exists.
- **Changed response status codes** — Backend changes a "not found" response from 404 to 204. Frontend's error handling doesn't trigger on 204, so the user sees stale data instead of a "not found" message.
- **New required request fields** — Backend adds a required `organizationId` field to an endpoint. Consumers that don't send it get 400 errors with no clear explanation.
- **Type changes** — Backend changes `price` from a number (`19.99`) to a string (`"19.99"`). Frontend math operations silently concatenate instead of adding.
- **Pagination contract violations** — Backend changes from offset-based (`page=2&limit=20`) to cursor-based (`cursor=abc123`) pagination. Frontend pagination logic breaks completely.
- **Error response shape changes** — Backend changes error format from `{ error: "message" }` to `{ errors: [{ code: "...", detail: "..." }] }`. Frontend error display code crashes on undefined.
- **Authentication token format changes** — Auth service changes JWT claims structure. All downstream services that validate tokens fail to extract the user ID.
- **Webhook payload changes** — Your service sends webhooks to customers. A payload restructure breaks every customer's webhook handler simultaneously.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Frontend and backend are in separate repos/teams | Schema drift happens when teams work independently |
| You have 2+ microservices communicating via HTTP/messaging | Every service boundary is a contract |
| You consume third-party APIs (Stripe, Twilio, etc.) | You can't control when they change; contracts detect it |
| You provide a public API to customers | Breaking changes affect people you can't coordinate with |
| You send webhooks to external systems | Webhook consumers are invisible to you |
| Integration tests are slow, flaky, or expensive | Contract tests are fast, isolated, and deterministic |
| You've had a production incident from API schema mismatch | Contract tests prevent this entire category of bugs |

**Skip when:** Monolith with a single frontend and backend in the same repo (use TypeScript types and tRPC instead), internal tool with one consumer you control directly, prototype with no external integrations.

### Pact vs Alternatives

| Approach | Best For | Tradeoff |
|----------|----------|----------|
| **Pact (consumer-driven contracts)** | Multi-consumer APIs, microservices | Requires both sides to adopt tooling |
| **OpenAPI/Swagger validation** | Single-consumer APIs, documentation-first teams | Validates schema, not behavior |
| **tRPC** | TypeScript monorepos | Compile-time type safety, no runtime contract |
| **GraphQL schema validation** | GraphQL APIs | Schema changes are breaking by definition |
| **Bi-directional contracts** | When you already have OpenAPI specs | Pact Bi-Directional combines Pact + OpenAPI |

---

## Setup Guide

### Consumer Side (Frontend / API Client)

```bash
npm install -D @pact-foundation/pact
```

### Provider Side (Backend / API Server)

```bash
npm install -D @pact-foundation/pact
```

### Pact Broker (Contract Sharing)

The Pact Broker stores contracts and verification results, enabling cross-repo contract testing.

```bash
# Option 1: PactFlow (hosted, free tier available)
# Sign up at https://pactflow.io

# Option 2: Self-hosted Docker
docker run -d --name pact-broker \
  -e PACT_BROKER_DATABASE_URL=sqlite:////tmp/pact_broker.sqlite \
  -p 9292:9292 \
  pactfoundation/pact-broker
```

### Project Structure

```
# Consumer repo (frontend)
tests/
  contract/
    consumer/
      user-api.consumer.pact.test.ts      # What the frontend expects
      items-api.consumer.pact.test.ts
    pact/                                   # Generated contract files
      frontend-user-api.json

# Provider repo (backend)
tests/
  contract/
    provider/
      user-api.provider.pact.test.ts      # Verify backend fulfills contracts
      items-api.provider.pact.test.ts
```

---

## Template

### Consumer Test (Frontend Expects This)

```ts
// tests/contract/consumer/user-api.consumer.pact.test.ts
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import { UserApiClient } from '../../../src/api/user-api-client';

const { like, eachLike, string, integer, boolean, timestamp } = MatchersV3;

const provider = new PactV3({
  consumer: 'WebFrontend',
  provider: 'UserService',
  dir: path.resolve(process.cwd(), 'tests/contract/pact'),
  logLevel: 'warn',
});

describe('User API Contract', () => {

  // ─── GET /api/users/:id ──────────────────────────────────────

  test('get user by ID — returns user profile', async () => {
    await provider
      .given('user with ID 123 exists')
      .uponReceiving('a request to get user 123')
      .withRequest({
        method: 'GET',
        path: '/api/users/123',
        headers: {
          Authorization: like('Bearer eyJhbGciOiJIUzI1NiJ9.test'),
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          id: string('123'),
          email: string('user@example.com'),
          firstName: string('Jane'),
          lastName: string('Doe'),
          role: string('member'),
          createdAt: timestamp("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", '2024-01-15T10:30:00.000Z'),
          preferences: {
            theme: string('dark'),
            notifications: boolean(true),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UserApiClient(mockServer.url);
      const user = await client.getUserById('123', 'fake-token');

      expect(user.id).toBe('123');
      expect(user.email).toBe('user@example.com');
      expect(user.firstName).toBe('Jane');
      expect(user.preferences.theme).toBe('dark');
    });
  });

  // ─── GET /api/users/:id — not found ─────────────────────────

  test('get user by ID — returns 404 when user does not exist', async () => {
    await provider
      .given('user with ID 999 does not exist')
      .uponReceiving('a request to get non-existent user 999')
      .withRequest({
        method: 'GET',
        path: '/api/users/999',
        headers: {
          Authorization: like('Bearer eyJhbGciOiJIUzI1NiJ9.test'),
        },
      })
      .willRespondWith({
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: {
            code: string('USER_NOT_FOUND'),
            message: string('User with ID 999 was not found'),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UserApiClient(mockServer.url);
      await expect(client.getUserById('999', 'fake-token'))
        .rejects.toThrow(/not found/i);
    });
  });

  // ─── GET /api/users — list with pagination ──────────────────

  test('list users — returns paginated results', async () => {
    await provider
      .given('multiple users exist')
      .uponReceiving('a request to list users page 1')
      .withRequest({
        method: 'GET',
        path: '/api/users',
        query: { page: '1', limit: '20' },
        headers: {
          Authorization: like('Bearer eyJhbGciOiJIUzI1NiJ9.test'),
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          data: eachLike({
            id: string('1'),
            email: string('user@example.com'),
            firstName: string('Jane'),
            lastName: string('Doe'),
            role: string('member'),
          }),
          pagination: {
            page: integer(1),
            limit: integer(20),
            total: integer(150),
            totalPages: integer(8),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UserApiClient(mockServer.url);
      const result = await client.listUsers({ page: 1, limit: 20 }, 'fake-token');

      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBeGreaterThan(0);
    });
  });

  // ─── POST /api/users — create user ──────────────────────────

  test('create user — returns created user', async () => {
    await provider
      .given('email new@example.com is not taken')
      .uponReceiving('a request to create a new user')
      .withRequest({
        method: 'POST',
        path: '/api/users',
        headers: {
          'Content-Type': 'application/json',
          Authorization: like('Bearer eyJhbGciOiJIUzI1NiJ9.test'),
        },
        body: {
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'member',
        },
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: string('456'),
          email: string('new@example.com'),
          firstName: string('New'),
          lastName: string('User'),
          role: string('member'),
          createdAt: timestamp("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", '2024-01-15T10:30:00.000Z'),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const client = new UserApiClient(mockServer.url);
      const user = await client.createUser({
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'member',
      }, 'fake-token');

      expect(user.id).toBeDefined();
      expect(user.email).toBe('new@example.com');
    });
  });
});
```

### Provider Verification Test (Backend Proves It)

```ts
// tests/contract/provider/user-api.provider.pact.test.ts
import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { app } from '../../../src/app';
import { db } from '../../../src/db';

let server: any;

beforeAll(async () => {
  // Start the real server
  server = app.listen(0);  // Random port
  // Seed test data
  await db.migrate.latest();
});

afterAll(async () => {
  server.close();
  await db.destroy();
});

describe('User Service Provider Verification', () => {
  test('fulfills all consumer contracts', async () => {
    const port = server.address().port;

    const verifier = new Verifier({
      providerBaseUrl: `http://localhost:${port}`,

      // Option 1: Load contracts from local files (for same-repo testing)
      // pactUrls: [path.resolve(__dirname, '../../contract/pact/WebFrontend-UserService.json')],

      // Option 2: Load contracts from Pact Broker (for cross-repo testing)
      pactBrokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:9292',
      provider: 'UserService',
      providerVersion: process.env.GIT_SHA || '1.0.0',
      publishVerificationResult: process.env.CI === 'true',

      // State handlers: set up the provider state before each interaction
      stateHandlers: {
        'user with ID 123 exists': async () => {
          await db('users').insert({
            id: '123',
            email: 'user@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            role: 'member',
            created_at: '2024-01-15T10:30:00.000Z',
          });
        },

        'user with ID 999 does not exist': async () => {
          await db('users').where({ id: '999' }).delete();
        },

        'multiple users exist': async () => {
          await db('users').insert([
            { id: '1', email: 'user1@example.com', first_name: 'Jane', last_name: 'Doe', role: 'member' },
            { id: '2', email: 'user2@example.com', first_name: 'John', last_name: 'Smith', role: 'admin' },
          ]);
        },

        'email new@example.com is not taken': async () => {
          await db('users').where({ email: 'new@example.com' }).delete();
        },
      },

      // Request filters: add auth headers that the mock doesn't need
      // but the real server requires
      requestFilter: (req, res, next) => {
        req.headers['authorization'] = 'Bearer valid-test-token';
        next();
      },
    });

    await verifier.verifyProvider();
  });
});
```

### CI Pipeline

```yaml
# .github/workflows/contract-tests.yml
name: Contract Tests

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  # Consumer side: generate contracts
  consumer-contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Run consumer contract tests
        run: npx jest tests/contract/consumer/ --forceExit
      - name: Publish contracts to Pact Broker
        if: github.ref == 'refs/heads/main'
        run: |
          npx pact-broker publish tests/contract/pact/ \
            --broker-base-url=${{ secrets.PACT_BROKER_URL }} \
            --consumer-app-version=${{ github.sha }} \
            --branch=${{ github.ref_name }} \
            --tag-with-git-branch
        env:
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}

  # Provider side: verify contracts
  provider-contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Run provider verification
        run: npx jest tests/contract/provider/ --forceExit
        env:
          PACT_BROKER_URL: ${{ secrets.PACT_BROKER_URL }}
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
          GIT_SHA: ${{ github.sha }}
          CI: true

  # Can-i-deploy check: are all contracts verified?
  can-i-deploy:
    needs: [consumer-contract-tests, provider-contract-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Check if safe to deploy
        run: |
          npx pact-broker can-i-deploy \
            --pacticipant=WebFrontend \
            --version=${{ github.sha }} \
            --to-environment=production \
            --broker-base-url=${{ secrets.PACT_BROKER_URL }}
        env:
          PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
```

### Versioning Strategy

```ts
// When publishing contracts, use semantic versioning tied to git
// This enables the "can I deploy?" check

// Consumer publishes:
//   Contract version: git SHA
//   Tagged with: branch name + "main" for main branch

// Provider verifies against:
//   Latest contracts from "main" branch (production)
//   Latest contracts from the PR branch (pre-merge check)

// Deploy check:
//   "Can I deploy WebFrontend v1.2.3 to production?"
//   → Checks if UserService has verified the contracts from that version
//   → If not verified, blocks the deploy
```

### package.json Scripts

```json
{
  "scripts": {
    "test:contract:consumer": "jest tests/contract/consumer/ --forceExit",
    "test:contract:provider": "jest tests/contract/provider/ --forceExit",
    "test:contract": "npm run test:contract:consumer && npm run test:contract:provider",
    "pact:publish": "pact-broker publish tests/contract/pact/ --broker-base-url=$PACT_BROKER_URL --consumer-app-version=$(git rev-parse HEAD)",
    "pact:can-deploy": "pact-broker can-i-deploy --pacticipant=WebFrontend --version=$(git rev-parse HEAD) --to-environment=production --broker-base-url=$PACT_BROKER_URL"
  }
}
```

---

## Common Pitfalls

### 1. Provider state handlers that don't match consumer expectations
**Problem:** Consumer test says `given('user with ID 123 exists')` but the provider state handler seeds a user with different data than what the consumer expects. The contract verification fails with confusing mismatches.
**Fix:** State handler names are the contract between the two sides. Agree on them explicitly. Document what each state means in a shared wiki or in the Pact Broker's provider state documentation.

### 2. Over-specifying the contract
**Problem:** Consumer contract specifies `{ id: "123", email: "user@example.com", firstName: "Jane", ... }` with exact values. Any change to test data breaks the contract.
**Fix:** Use Pact matchers (`like()`, `string()`, `integer()`) instead of exact values. The contract should specify the shape and types, not specific data values.

### 3. Not running provider verification on the provider side
**Problem:** Consumer publishes contracts. Nobody on the provider team knows they exist or runs verification. Contracts are write-only documentation.
**Fix:** Provider verification must be in the provider's CI pipeline. The Pact Broker's "can I deploy?" check blocks deployments when contracts aren't verified.

### 4. Testing too many implementation details
**Problem:** Consumer contract tests the exact error message text, specific header values that aren't part of the API specification, or internal field ordering.
**Fix:** Contract tests should verify the interface contract (status codes, response shape, field types), not implementation details. If the error message text changes but the error code is the same, the contract shouldn't break.

### 5. Skipping the "can I deploy?" step
**Problem:** Both consumer and provider contract tests pass independently, but the provider hasn't verified against the consumer's latest contract version. They deploy and discover incompatibility in production.
**Fix:** The `can-i-deploy` check is the critical step that ties it all together. Make it a required CI gate before any deployment.

### 6. Not versioning contracts
**Problem:** Consumer updates a contract, provider verifies against the old version. Both sides think they're compatible. They're not.
**Fix:** Tag contract versions with git SHAs and branch names. The Pact Broker handles version management — use it. Always verify against the consumer version that's about to be deployed.

---

## Proof Artifact

A contract test pass produces these artifacts:

### Consumer test output
```
PASS  tests/contract/consumer/user-api.consumer.pact.test.ts
  User API Contract
    ✓ get user by ID — returns user profile (234ms)
    ✓ get user by ID — returns 404 when user does not exist (89ms)
    ✓ list users — returns paginated results (112ms)
    ✓ create user — returns created user (145ms)

Pact files written to: tests/contract/pact/
  - WebFrontend-UserService.json (4 interactions)
```

### Provider verification output
```
Verifying a pact between WebFrontend and UserService

  Given user with ID 123 exists
    a request to get user 123
      returns a response which
        ✓ has status code 200
        ✓ has a matching body
        ✓ includes headers

  Given user with ID 999 does not exist
    a request to get non-existent user 999
      returns a response which
        ✓ has status code 404
        ✓ has a matching body

  ... (all interactions verified)

4 interactions, 0 failures
```

### Can-I-Deploy output
```
Computer says yes \o/

CONSUMER        | C.VERSION | PROVIDER    | P.VERSION | SUCCESS?
WebFrontend     | abc123    | UserService | def456    | true

All required verification results are published and successful
```

### What constitutes a pass:
1. **Consumer contract tests** generate contract files with all interactions defined
2. **Provider verification** passes all interactions (correct status codes, matching body shapes)
3. **Contracts published** to Pact Broker with version tags
4. **`can-i-deploy`** returns `true` for the deploying service version
5. **CI pipeline** shows contract test jobs passing on both consumer and provider sides
