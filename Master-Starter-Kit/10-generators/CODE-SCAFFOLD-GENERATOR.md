# Code Scaffold Generator

## Purpose

Bridge the gap between "perfect spec" and "first line of code." Given a completed service spec, generate typed code stubs — file skeletons with correct signatures, types, and structure that match the spec exactly. No business logic, just the scaffolding.

## When to Use

Run this AFTER the ORCHESTRATOR completes (post-Step 16) and BEFORE starting actual development. This gives developers a codebase where every file already exists with the right exports, types, and test structure.

## Input Requirements

1. **Service spec** — the fully-scored service spec (≥ 8/10)
2. **API contracts** — endpoint definitions with request/response shapes
3. **Database docs** — table schemas with column types
4. **CONFIG** from STATE BLOCK — framework, ORM, database, test tool

## What Gets Generated

For each service, generate these skeleton files:

### 1. Database Migration

```
src/db/migrations/YYYYMMDD_create_{table_name}.ts
```

Generate a migration file with:
- Table creation with all columns from the database doc
- Column types mapped to the ORM's type system
- Indexes, unique constraints, foreign keys
- `up()` and `down()` functions
- NO seed data (that's a separate concern)

### 2. Database Schema / Model

```
src/db/schema/{service-name}.ts   (Drizzle)
src/models/{service-name}.ts      (Prisma/TypeORM)
```

Generate:
- Table/model definition with all columns
- TypeScript types exported for each entity
- Relations to other tables
- Enum definitions if applicable

### 3. API Route / Controller

```
src/api/{service-name}/router.ts     (tRPC)
src/api/{service-name}/controller.ts (REST)
src/routes/{service-name}.ts         (Express)
```

Generate:
- One handler per endpoint from the API contract
- Input validation schema (Zod) matching the contract
- Return type matching the contract
- Auth middleware applied per the contract's auth requirements
- Body: `// TODO: implement` comment only

```typescript
// Example (tRPC style):
export const {serviceName}Router = router({
  list: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      pageSize: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      // TODO: implement
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: implement
      throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
    }),
});
```

### 4. Service Layer

```
src/services/{service-name}.service.ts
```

Generate:
- Class or module with one method per business operation from the spec
- Method signatures with typed parameters and return types
- JSDoc comments describing the business rule from the spec
- Body: `throw new Error('Not implemented');`

### 5. Test File

```
src/__tests__/{service-name}.test.ts
tests/{service-name}/
```

Generate:
- `describe` block per endpoint/operation
- `it` stubs for each test case mentioned in the spec
- Test setup (beforeEach/afterEach) with database cleanup pattern
- Body: `// TODO: implement test`

```typescript
describe('{ServiceName} Service', () => {
  describe('list', () => {
    it('should return paginated results', async () => {
      // TODO: implement test
    });

    it('should filter by status', async () => {
      // TODO: implement test
    });

    it('should require authentication', async () => {
      // TODO: implement test
    });
  });
});
```

### 6. Type Definitions

```
src/types/{service-name}.types.ts
```

Generate:
- Request/response types from API contracts
- Entity types from database schema
- Enum types
- Input validation types (inferred from Zod schemas)

## Framework Adaptation

The generator adapts to the detected stack:

| Stack Component | Adaptation |
|----------------|------------|
| **Next.js App Router** | Route handlers in `app/api/` |
| **Next.js Pages Router** | API routes in `pages/api/` |
| **Express** | Router files with middleware |
| **NestJS** | Controllers + Services + Modules |
| **tRPC** | Router procedures |
| **FastAPI** | Router files with Pydantic models |
| **Django** | Views + Serializers + URLs |
| **Drizzle** | Schema + migration files |
| **Prisma** | Schema additions + migration |
| **TypeORM** | Entity + migration files |

## Output Summary

For a project with N services, generates approximately:
- N migration files
- N schema/model files
- N route/controller files
- N service layer files
- N test files
- N type definition files
- **Total: ~6N files** (e.g., 8 services = ~48 skeleton files)

## Rules

- **Never write business logic** — only signatures, types, and `// TODO` stubs
- **Always match the spec exactly** — field names, types, and endpoint paths must be identical
- **Include all imports** — files should be syntactically valid (just functionally incomplete)
- **Follow project conventions** — naming, folder structure, and export style from CLAUDE.md
- **Mark as scaffolded** — add a comment at the top: `// Scaffolded from: {spec-file-path}`
