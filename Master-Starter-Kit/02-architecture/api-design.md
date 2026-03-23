# API Design Guide

## Purpose

This document defines the patterns and conventions for the API layer. Whether using tRPC or REST, every router/handler follows these rules consistently.

---

## Core Principle: Router-Per-Domain

Each business domain gets its own router file. A "domain" is a top-level entity from the VERDICT (e.g., trips, drivers, vehicles, billing).

```
packages/api/src/routers/
  users.ts          # User management
  trips.ts          # Trip lifecycle
  drivers.ts        # Driver management
  vehicles.ts       # Vehicle fleet
  facilities.ts     # Locations
  billing.ts        # Invoices + payments
  dashboard.ts      # Aggregations + KPIs
  dispatch.ts       # Real-time board state
```

**Rule:** Never put procedures from two different domains in one router. If a procedure touches two domains, put it in the domain that "owns" the action (e.g., "assign driver to trip" lives in `trips.ts`, not `drivers.ts`).

---

## Procedure Naming Convention

### Standard CRUD Procedures

Every domain router starts with these base procedures:

| Procedure | Type | Purpose |
|-----------|------|---------|
| `list` | query | Paginated list with filters |
| `getById` | query | Single record by ID |
| `create` | mutation | Create new record |
| `update` | mutation | Update existing record |
| `delete` | mutation | Soft delete record |

### Domain Action Procedures

Beyond CRUD, domains have action procedures that represent business operations:

| Example | Type | Domain | Purpose |
|---------|------|--------|---------|
| `assign` | mutation | trips | Assign driver to trip |
| `dispatch` | mutation | trips | Mark trip as in-progress |
| `complete` | mutation | trips | Mark trip as completed |
| `cancelTrip` | mutation | trips | Cancel with reason |
| `updateAvailability` | mutation | drivers | Toggle driver available/unavailable |
| `generateInvoice` | mutation | billing | Create invoice from trips |
| `recordPayment` | mutation | billing | Record payment against invoice |
| `getTodaySnapshot` | query | dashboard | Today's KPIs |
| `getRevenueChart` | query | dashboard | Revenue over time |
| `getBoardState` | query | dispatch | Current board for all drivers |

### Naming Rules

- Use camelCase: `getById`, not `get_by_id`
- Prefix reads with `get` or `list`: `getById`, `listByStatus`, `getSnapshot`
- Use verbs for actions: `assign`, `dispatch`, `complete`, `cancel`
- Never use generic names: `getData`, `doAction`, `process`
- Avoid abbreviations: `getByOrganization`, not `getByOrg`

---

## Procedure Count Guidance

| Domain Complexity | Procedure Count | Example |
|-------------------|----------------|---------|
| Simple (lookup table) | 4-6 | Vehicle types: list, getById, create, update, delete |
| Standard (core entity) | 8-12 | Drivers: list, getById, create, update, delete, updateAvailability, getSchedule, getStats |
| Complex (lifecycle entity) | 12-20 | Trips: list, getById, create, update, delete, assign, dispatch, complete, cancel, noShow, getByDate, getByDriver, getByPassenger, getHistory |

---

## Auth Middleware Tiers

Every procedure must declare its auth tier. No procedure is "accidentally public."

### Tier Definitions

| Tier | Name | Description | Example |
|------|------|-------------|---------|
| 0 | `public` | No auth required | Health check, login, register |
| 1 | `protected` | Any authenticated user | Dashboard, profile |
| 2 | `roleSpecific` | Specific role required | Admin settings (admin only) |
| 3 | `ownerOrAdmin` | Record owner or admin | Edit own profile, admin edit any |

### tRPC Implementation

```typescript
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.context<Context>().create();

// Tier 0: Public
export const publicProcedure = t.procedure;

// Tier 1: Protected (any authenticated user)
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: { ...ctx, user: ctx.session.user },
  });
});

// Tier 2: Role-specific
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "super_admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Tier 3: Owner or Admin
export const ownerOrAdminProcedure = protectedProcedure.use(async ({ ctx, input, next }) => {
  // Implemented per-procedure since "owner" varies by domain
  return next({ ctx });
});
```

### REST Implementation

```typescript
// Next.js Route Handler middleware pattern
import { getSession } from "@/lib/auth";

// Tier 0: Public
export async function GET(req: Request) {
  // No auth check
  return Response.json({ status: "ok" });
}

// Tier 1: Protected
async function requireAuth(req: Request) {
  const session = await getSession(req);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

// Tier 2: Role-specific
async function requireAdmin(req: Request) {
  const session = await requireAuth(req);
  if (session instanceof Response) return session; // Error response
  if (session.user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin(req);
  if (session instanceof Response) return session;

  const body = await req.json();
  // ... handle request
}
```

---

## Input Validation with Zod

**Every procedure input MUST be validated with Zod.** No raw `req.body` access.

### Shared Schema Pattern

Validation schemas live in `packages/validators` and are shared between the API (server-side validation) and forms (client-side validation).

```typescript
// packages/validators/src/trips.ts
import { z } from "zod";

export const createTripSchema = z.object({
  passengerId: z.string().uuid(),
  pickupAddress: z.string().min(5).max(500),
  dropoffAddress: z.string().min(5).max(500),
  scheduledAt: z.string().datetime(),
  fareInCents: z.number().int().nonneg(),
  notes: z.string().max(1000).optional(),
});

export const updateTripSchema = createTripSchema.partial().extend({
  id: z.string().uuid(),
});

export const listTripsSchema = z.object({
  status: z.enum(["scheduled", "assigned", "in_progress", "completed", "cancelled"]).optional(),
  driverId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  ...paginationSchema.shape,
});

// Shared pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type ListTripsInput = z.infer<typeof listTripsSchema>;
```

### Usage in tRPC

```typescript
// packages/api/src/routers/trips.ts
import { createTripSchema, listTripsSchema } from "@project/validators";

export const tripsRouter = router({
  list: protectedProcedure
    .input(listTripsSchema)
    .query(async ({ ctx, input }) => {
      // input is fully typed and validated
    }),

  create: protectedProcedure
    .input(createTripSchema)
    .mutation(async ({ ctx, input }) => {
      // input is fully typed and validated
    }),
});
```

### Usage in REST

```typescript
// apps/web/src/app/api/trips/route.ts
import { createTripSchema } from "@project/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createTripSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // parsed.data is fully typed and validated
}
```

---

## Error Handling

### Rule: Never Expose Raw Database Errors

Database errors often contain table names, column names, constraint names, and SQL fragments that leak your schema to attackers.

```typescript
// BAD — leaks schema
try {
  await db.insert(trips).values(data);
} catch (error) {
  throw error; // "duplicate key value violates unique constraint \"trips_pkey\""
}

// GOOD — generic message with logged details
try {
  await db.insert(trips).values(data);
} catch (error) {
  console.error("Trip creation failed:", error); // Log full error server-side
  if (error.code === "23505") { // Unique violation
    throw new TRPCError({
      code: "CONFLICT",
      message: "A trip with these details already exists",
    });
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to create trip. Please try again.",
  });
}
```

### Standard Error Codes

| Code | HTTP Status | When to Use |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid input (after Zod catches most) |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `NOT_FOUND` | 404 | Record doesn't exist or soft-deleted |
| `CONFLICT` | 409 | Duplicate or state conflict |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error (always log details) |

### Error Response Shape

```typescript
// Consistent error shape for all API responses
type ApiError = {
  code: string;
  message: string;           // User-safe message
  details?: Record<string, string[]>; // Validation errors per field
};
```

---

## Pagination Strategy

### Offset-Based Pagination (Recommended for Most Cases)

```typescript
// Input
const input = { page: 1, pageSize: 20 };

// Query
const offset = (input.page - 1) * input.pageSize;
const [items, countResult] = await Promise.all([
  db.query.trips.findMany({
    where: filters,
    limit: input.pageSize,
    offset,
    orderBy: [desc(trips.createdAt)],
  }),
  db.select({ count: sql`count(*)::int` }).from(trips).where(filters),
]);

// Response
return {
  items,
  pagination: {
    page: input.page,
    pageSize: input.pageSize,
    totalItems: countResult[0]?.count ?? 0,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / input.pageSize),
  },
};
```

### Cursor-Based Pagination (For Infinite Scroll / Large Datasets)

```typescript
// Input
const input = { cursor: "uuid-of-last-item", limit: 20 };

// Query
const items = await db.query.trips.findMany({
  where: input.cursor
    ? and(filters, lt(trips.createdAt, subquery))  // Items after cursor
    : filters,
  limit: input.limit + 1, // Fetch one extra to determine hasMore
  orderBy: [desc(trips.createdAt)],
});

const hasMore = items.length > input.limit;
if (hasMore) items.pop(); // Remove the extra

return {
  items,
  nextCursor: hasMore ? items[items.length - 1]!.id : null,
};
```

### When to Use Which

| Pattern | Use When |
|---------|----------|
| Offset | Admin tables with page numbers, "Page 3 of 15" UI, reporting |
| Cursor | Infinite scroll, real-time feeds, datasets over 100K rows |

---

## tRPC Router Template

```typescript
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import {
  create{Domain}Schema,
  update{Domain}Schema,
  list{Domain}Schema,
} from "@project/validators";

export const {domain}Router = router({
  // --- QUERIES ---

  list: protectedProcedure
    .input(list{Domain}Schema)
    .query(async ({ ctx, input }) => {
      // Paginated list with tenant isolation
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Single record with tenant check
    }),

  // --- MUTATIONS ---

  create: protectedProcedure
    .input(create{Domain}Schema)
    .mutation(async ({ ctx, input }) => {
      // Create with tenant + audit columns
    }),

  update: protectedProcedure
    .input(update{Domain}Schema)
    .mutation(async ({ ctx, input }) => {
      // Update with tenant check + updatedAt
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Soft delete with tenant check
    }),

  // --- DOMAIN ACTIONS ---
  // Add domain-specific procedures below
});
```

## REST Route Handler Template

```typescript
// app/api/{domain}/route.ts
import { getSession } from "@/lib/auth";
import { create{Domain}Schema, list{Domain}Schema } from "@project/validators";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = list{Domain}Schema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return Response.json({ error: "Invalid parameters", details: parsed.error.flatten() }, { status: 400 });
  }

  // Query with tenant isolation
  const items = await db.query.{domain}.findMany({
    where: eq({domain}.organizationId, session.user.organizationId),
  });

  return Response.json({ items });
}

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = create{Domain}Schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  // Create with tenant + audit
  const record = await db.insert({domain}).values({
    ...parsed.data,
    organizationId: session.user.organizationId,
    createdBy: session.user.id,
  }).returning();

  return Response.json(record[0], { status: 201 });
}
```

---

## API Design for Mobile Clients

<!-- IF {{HAS_MOBILE}} == "true" -->

Mobile clients have different constraints than web clients. APIs serving mobile apps must account for unreliable networks, limited bandwidth, battery consumption, and offline scenarios.

### Payload Optimization

Mobile networks are slower and less reliable. Minimize payload size.

```typescript
// BAD — returns entire entity with nested relations
tripsRouter.list → { trips: [{ ...fullTrip, driver: { ...fullDriver }, vehicle: { ...fullVehicle } }] }

// GOOD — return only fields needed for the list view, with IDs for relations
tripsRouter.listMobile → { trips: [{ id, status, pickupAddress, scheduledAt, driverName, vehicleLabel }] }
```

**Rules:**
- Create separate mobile-optimized procedures when the web version returns significantly more data
- Use `select` to return only the fields needed for the specific mobile screen
- Flatten nested objects — mobile list views rarely need full nested entities
- Return display-ready strings (`driverName: "John D."`) instead of IDs that require additional lookups

### Cursor Pagination for Mobile

Mobile apps use infinite scroll, not page numbers. Always use cursor-based pagination for mobile list endpoints.

```typescript
// Mobile list input
const mobileListSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(20),
  status: z.enum(["active", "completed", "cancelled"]).optional(),
});

// Mobile list response
return {
  items,
  nextCursor: hasMore ? items[items.length - 1]!.id : null,
  hasMore,
};
```

### Offline-Sync Endpoints

If the mobile app supports offline mode, provide sync-friendly endpoints.

```typescript
// Sync endpoint — returns changes since last sync
tripsRouter.sync = protectedProcedure
  .input(z.object({
    lastSyncedAt: z.string().datetime(),
  }))
  .query(async ({ ctx, input }) => {
    const changes = await db.query.trips.findMany({
      where: and(
        eq(trips.organizationId, ctx.user.organizationId),
        gt(trips.updatedAt, new Date(input.lastSyncedAt)),
      ),
    });

    return {
      changes,
      syncedAt: new Date().toISOString(),
      hasMore: changes.length === SYNC_BATCH_SIZE,
    };
  });
```

**Sync rules:**
- Use `updatedAt` timestamps for change detection
- Include soft-deleted records in sync (so mobile can remove them locally)
- Return a `syncedAt` timestamp for the client to use in the next sync request
- Batch responses — do not send 10,000 records in one response

### Mobile Error Responses

Mobile error responses must include enough information for the app to show a meaningful UI.

```typescript
// Mobile-friendly error response
{
  code: "NETWORK_ERROR",
  message: "Could not load trips. Check your connection and try again.",
  retryable: true,
  retryAfterMs: 5000,
}
```

<!-- ENDIF -->

---

## API Design Checklist

For every router, verify:

- [ ] Every procedure has an explicit auth tier
- [ ] Every procedure input is Zod-validated
- [ ] Every query filters by `organizationId` (tenant isolation)
- [ ] Every query excludes soft-deleted records by default
- [ ] No raw database errors reach the client
- [ ] List procedures support pagination
- [ ] Mutation responses return the created/updated record
- [ ] Domain actions validate state transitions (can't complete a cancelled trip)
- [ ] Error messages are user-safe (no SQL, no schema details)

---

<!-- IF {{API_STYLE}} == "graphql" -->

## GraphQL API Design

> This section applies when `{{API_STYLE}}` is set to `graphql`. It supplements the core patterns above with GraphQL-specific conventions.

### Schema Organization

Follow the same router-per-domain principle. Each domain gets its own `.graphql` schema file:

```
packages/api/src/schema/
  common.graphql         # Shared types (DateTime, Pagination, ErrorUnion)
  users.graphql          # User types, queries, mutations
  trips.graphql          # Trip types, queries, mutations
  drivers.graphql        # Driver types, queries, mutations
  billing.graphql        # Invoice types, queries, mutations
```

Resolvers mirror the schema files:

```
packages/api/src/resolvers/
  users.resolver.ts
  trips.resolver.ts
  drivers.resolver.ts
  billing.resolver.ts
```

### Naming Conventions

| Operation | Pattern | Example |
|-----------|---------|---------|
| Query (single) | `{entity}` | `trip(id: ID!): Trip` |
| Query (list) | `{entities}` | `trips(filter: TripFilter): TripConnection` |
| Mutation (create) | `create{Entity}` | `createTrip(input: CreateTripInput!): CreateTripPayload` |
| Mutation (update) | `update{Entity}` | `updateTrip(id: ID!, input: UpdateTripInput!): UpdateTripPayload` |
| Mutation (delete) | `delete{Entity}` | `deleteTrip(id: ID!): DeleteTripPayload` |
| Mutation (action) | `{verb}{Entity}` | `dispatchTrip(id: ID!): DispatchTripPayload` |
| Subscription | `on{Entity}{Event}` | `onTripStatusChanged(tripId: ID!): Trip` |

### Pagination

Use Relay-style cursor pagination for all list queries:

```graphql
type TripConnection {
  edges: [TripEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type TripEdge {
  cursor: String!
  node: Trip!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Error Handling

Use union types for expected errors. Throw for unexpected errors.

```graphql
union CreateTripPayload = Trip | ValidationError | AuthorizationError

type ValidationError {
  field: String!
  message: String!
}

type AuthorizationError {
  message: String!
}
```

Clients check `__typename` to handle each case:

```typescript
const result = await client.createTrip({ input });
if (result.__typename === 'Trip') {
  // success
} else if (result.__typename === 'ValidationError') {
  // show field error
}
```

### Input Types

Every mutation uses a dedicated input type. Never pass raw scalars.

```graphql
input CreateTripInput {
  pickupAddress: String!
  dropoffAddress: String!
  scheduledAt: DateTime!
  passengerId: ID!
  notes: String
}
```

### N+1 Prevention

Use DataLoader for all relation fields. One DataLoader per relation per request:

```typescript
// Context factory
const context = {
  loaders: {
    driverById: new DataLoader(ids => batchLoadDrivers(ids)),
    tripsByDriverId: new DataLoader(ids => batchLoadTrips(ids)),
  }
};
```

### GraphQL Checklist

- [ ] Every list query uses Relay cursor pagination
- [ ] Every mutation returns a union type (success | error variants)
- [ ] Every mutation uses a named input type
- [ ] Every relation field uses a DataLoader
- [ ] Schema files are split by domain (not one giant file)
- [ ] All custom scalars (DateTime, JSON) are defined in `common.graphql`
- [ ] Subscriptions use filtered topics (not broadcasting everything)
- [ ] Query depth limiting is configured (max depth 10)
- [ ] Query complexity analysis is enabled

<!-- ENDIF -->
