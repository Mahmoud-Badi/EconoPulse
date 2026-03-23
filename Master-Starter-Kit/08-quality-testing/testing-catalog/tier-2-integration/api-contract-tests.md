# API Contract Tests

## What It Is

API contract testing verifies that the data shapes exchanged between frontend and backend — request bodies, response payloads, error formats, pagination structures, headers — remain consistent as both sides evolve independently. The "contract" is the agreed-upon schema: field names, types, required vs. optional, enums, and structural patterns. When the backend renames a field from `userName` to `user_name`, or changes a response from a flat object to a nested structure, or adds a required header, contract tests fail immediately — before the frontend team spends two days debugging why the dashboard is showing "undefined" everywhere. In a tRPC or GraphQL codebase, the type system provides some of this for free. In REST APIs, you need to build it explicitly.

## What It Catches

- **Response shape drift** — Backend adds a `metadata` wrapper around the response body (`{ data: {...}, metadata: {...} }`) but the frontend still reads `response.data.users` as if it were top-level, getting `undefined`
- **Field renaming without frontend update** — Backend renames `createdAt` to `created_at` for database consistency; frontend components that render dates show nothing
- **Type narrowing violations** — A `status` field is documented as `"active" | "inactive"` but the backend starts returning `"suspended"`, and the frontend switch statement falls through to default (empty render)
- **Pagination contract changes** — Backend changes from offset pagination (`{ page, pageSize }`) to cursor pagination (`{ cursor, limit }`), breaking the frontend's infinite scroll implementation
- **Error format inconsistency** — Some endpoints return `{ error: "message" }`, others return `{ errors: [{ field, message }] }`, and the frontend error handler only supports one format
- **Null vs. undefined vs. missing** — Backend returns `{ avatar: null }` for users without an avatar, but the frontend checks `if (user.avatar)` which is falsy for both `null` and `undefined`, while a different endpoint omits the field entirely for the same condition
- **Header contract violations** — Backend stops sending `X-Total-Count` header that the frontend uses for pagination totals
- **Breaking enum additions** — Adding a new value to `role: "admin" | "member"` → `role: "admin" | "member" | "viewer"` — existing frontend code may not handle the new variant

## When It's Required

Contract tests are required whenever:

| Condition | Why |
|-----------|-----|
| Frontend and backend are in separate repos or packages | They deploy independently, so a backend change can break the frontend without anyone noticing until production |
| Multiple consumers call the same API | A mobile app and a web app both depend on the same API; changes must not break either consumer |
| You use REST (not tRPC/GraphQL with codegen) | There is no compile-time guarantee that the response shape matches what the consumer expects |
| External third-party APIs are consumed | The third party can change their response shape without notifying you; contract tests catch this early |
| API versioning is in play | v1 and v2 responses must both conform to their documented schemas; contract tests prevent accidental cross-contamination |

**Reduced scope when using tRPC:** tRPC provides compile-time type safety between client and server in the same monorepo. You still need contract tests for: external API boundaries, webhook payloads, and anywhere data crosses a process boundary.

## Setup Guide

### Option 1: Zod schemas as shared contracts

The most practical approach for a TypeScript monorepo is to define Zod schemas in a shared package and validate against them on both sides.

```bash
pnpm add zod
```

```
packages/
  shared/
    src/
      contracts/
        user.ts        # Zod schemas defining the contract
        pagination.ts
        errors.ts
  api/
    src/
      routes/
        users.ts       # API validates output against shared schemas
  web/
    src/
      api/
        users.ts       # Frontend validates input against shared schemas
```

### Option 2: OpenAPI spec validation

For REST APIs with an OpenAPI/Swagger spec:

```bash
pnpm add -D openapi-typescript openapi-fetch
```

Generate types from the spec, then validate responses match at runtime during tests.

### Option 3: tRPC (built-in contract safety)

With tRPC, the router definition IS the contract. Input and output schemas are defined once and type-checked across the boundary:

```ts
// The router IS the contract — any shape change is a compile error on the client
export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(UserResponseSchema)  // explicitly validate output shape
    .query(async ({ input }) => { /* ... */ }),
});
```

### Package.json scripts

```json
{
  "scripts": {
    "test:contracts": "vitest run --config vitest.contracts.config.ts",
    "contracts:validate": "tsx scripts/validate-contracts.ts"
  }
}
```

## Template

### Shared contract definition

```ts
// packages/shared/src/contracts/user.ts
import { z } from 'zod';

// ---- Request Contracts ----

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'member', 'viewer']),
});

export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

export const ListUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['admin', 'member', 'viewer']).optional(),
  search: z.string().optional(),
});

// ---- Response Contracts ----

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'member', 'viewer']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      totalItems: z.number(),
      totalPages: z.number(),
    }),
  });

export const ListUsersResponseSchema = PaginatedResponseSchema(UserResponseSchema);

// ---- Error Contract ----

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export const ValidationErrorSchema = ApiErrorSchema.extend({
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
    code: z.string(),
  })),
});

// Export types for TypeScript consumers
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;
```

### Backend contract enforcement test

```ts
// packages/api/src/routes/users.contract.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import supertest from 'supertest';
import {
  UserResponseSchema,
  ListUsersResponseSchema,
  ApiErrorSchema,
  ValidationErrorSchema,
} from '@myapp/shared/contracts/user';
import { createApp } from '../app';
import { createTestUser, createAdminToken, cleanupTestData } from '../../test/helpers';

const app = createApp();
const request = supertest(app);

describe('User API contract compliance', () => {
  let adminToken: string;

  beforeEach(async () => {
    await cleanupTestData();
    adminToken = await createAdminToken();
  });

  describe('GET /api/users/:id', () => {
    it('response matches UserResponseSchema', async () => {
      const user = await createTestUser({ email: 'test@example.com', name: 'Test', role: 'member' });

      const response = await request
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // This is the contract test — if any field is missing, renamed, or wrong type, this fails
      const result = UserResponseSchema.safeParse(response.body);
      expect(result.success).toBe(true);

      if (!result.success) {
        // Print the exact contract violations for debugging
        console.error('Contract violations:', result.error.issues);
      }
    });

    it('404 response matches ApiErrorSchema', async () => {
      const response = await request
        .get('/api/users/nonexistent-uuid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      const result = ApiErrorSchema.safeParse(response.body);
      expect(result.success).toBe(true);
    });
  });

  describe('GET /api/users', () => {
    it('response matches ListUsersResponseSchema', async () => {
      await createTestUser({ email: 'a@test.com', name: 'A', role: 'member' });
      await createTestUser({ email: 'b@test.com', name: 'B', role: 'admin' });

      const response = await request
        .get('/api/users?page=1&pageSize=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const result = ListUsersResponseSchema.safeParse(response.body);
      expect(result.success).toBe(true);

      // Also verify the pagination math is correct
      if (result.success) {
        expect(result.data.pagination.totalItems).toBeGreaterThanOrEqual(2);
        expect(result.data.pagination.totalPages).toBeGreaterThanOrEqual(1);
        expect(result.data.items.length).toBeLessThanOrEqual(result.data.pagination.pageSize);
      }
    });
  });

  describe('POST /api/users', () => {
    it('422 response matches ValidationErrorSchema', async () => {
      const response = await request
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'invalid', name: '', role: 'unknown' })
        .expect(422);

      const result = ValidationErrorSchema.safeParse(response.body);
      expect(result.success).toBe(true);

      if (result.success) {
        // Verify each invalid field produced an error
        const errorFields = result.data.errors.map(e => e.field);
        expect(errorFields).toContain('email');
        expect(errorFields).toContain('name');
        expect(errorFields).toContain('role');
      }
    });
  });
});
```

### Frontend contract validation helper

```ts
// packages/web/src/api/users.ts
import { UserResponseSchema, ListUsersResponseSchema, type UserResponse } from '@myapp/shared/contracts/user';

export async function fetchUser(id: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new ApiError(response);

  const data: unknown = await response.json();
  // Validate the contract at runtime — if the backend changes shape, this throws
  return UserResponseSchema.parse(data);
}

// In development/staging, you can log warnings instead of throwing:
function validateContract<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV === 'production') {
      // Log to monitoring but don't crash
      reportContractViolation(schema, result.error);
      return data as T;
    }
    throw new ContractViolationError(result.error);
  }
  return result.data;
}
```

## Common Pitfalls

### 1. Defining the contract in two places

If the backend has its own response type and the frontend has its own response type, and they are not derived from a single source, they will drift. The entire point of contract testing is a shared source of truth. Use a shared package, an OpenAPI spec, or tRPC — but there must be one canonical definition.

### 2. Not testing error response contracts

Happy-path contracts are easy. But the frontend also depends on the error response shape to display validation messages, show "not found" pages, and handle rate limiting. If the error format changes, the frontend error handling breaks. Test every error status code's response shape.

### 3. Ignoring optional vs. required field semantics

A field that is optional in the contract but treated as required in the frontend will crash when the backend omits it. Define optionality explicitly in the Zod schema (`.optional()` or `.nullable()`), and write tests that exercise the case where optional fields are actually missing.

### 4. Testing only in one direction

Contract tests should validate in both directions: the backend response matches the schema, AND the frontend correctly handles data that matches the schema (including edge cases like empty arrays, null values, maximum-length strings). If you only validate the backend output, you miss frontend assumptions.

### 5. Not versioning the contract

When the API adds a v2 endpoint, the v1 contract must remain stable. Contract tests for v1 must continue to pass. Without explicit versioning, a "fix" to the shared schema can accidentally break the v1 contract that existing mobile apps depend on.

### 6. Overly loose schemas that validate anything

A schema like `z.object({ data: z.any() })` will never fail — it is not a contract. Every field should have its precise type, and enums should list exact allowed values. The contract should be as strict as possible while still allowing for backward-compatible additions.

## Proof Artifact

The enforcement system accepts the following as evidence that contract tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Contract test results** | `vitest run --config vitest.contracts.config.ts --reporter=json > contract-results.json` | All contract validations passed |
| **Schema validation output** | Zod `safeParse` results logged in test output | Every response matches the expected schema |
| **CI status check** | GitHub Actions contract test job | Green checkmark = contracts are aligned |

**Minimum passing criteria:**

- All contract tests pass (0 failures)
- Every API endpoint has at least one contract test for its success response and one for each error response
- Shared schemas are the single source of truth (no duplicate type definitions)
- Contract tests run on every PR that modifies API routes, response shapes, or shared schemas
- No `z.any()` or `z.unknown()` in contract schemas (except at the validation boundary where unknown data enters)
