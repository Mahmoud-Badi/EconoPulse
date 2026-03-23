# tRPC Gotchas

tRPC provides end-to-end type safety between your API and client. These gotchas mostly involve configuration and error handling patterns.

---

## Error Codes: Use the Right One

tRPC has specific error codes that map to HTTP status codes. Using the wrong one confuses error handling on the client.

```typescript
import { TRPCError } from "@trpc/server";

// Record not found
throw new TRPCError({
  code: "NOT_FOUND",           // 404
  message: "Trip not found",
});

// User not logged in
throw new TRPCError({
  code: "UNAUTHORIZED",        // 401
  message: "You must be logged in",
});

// User logged in but lacks permission
throw new TRPCError({
  code: "FORBIDDEN",           // 403
  message: "Dispatchers cannot access billing",
});

// Invalid input (use sparingly — Zod handles most of this)
throw new TRPCError({
  code: "BAD_REQUEST",         // 400
  message: "Date range cannot exceed 90 days",
});

// Server-side failure
throw new TRPCError({
  code: "INTERNAL_SERVER_ERROR",  // 500
  message: "Failed to process request",
});
```

**Never expose raw database errors.** Wrap them:

```typescript
// WRONG
throw new TRPCError({
  code: "INTERNAL_SERVER_ERROR",
  message: error.message,  // Leaks DB schema info: "column 'v3.users.role' does not exist"
});

// CORRECT
throw new TRPCError({
  code: "INTERNAL_SERVER_ERROR",
  message: "Failed to create trip",
  cause: error,  // Logged server-side but not sent to client
});
```

---

## Context Creation: Extract Session from Headers

The tRPC context is where you establish the current user's session. It runs for every request.

```typescript
// packages/api/src/trpc.ts
import { auth } from "@{project}/auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    session,
    db,  // Database instance
  };
};
```

**Gotcha:** The session check runs on EVERY request, including public routes. Make sure it does not throw when there is no session — it should return `null`.

---

## Procedure Tiers: public, protected, role-based

```typescript
// Public: no auth required
export const publicProcedure = t.procedure;

// Protected: requires valid session
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,  // Now guaranteed non-null
    },
  });
});

// Role-based: requires specific role
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});
```

**Gotcha:** Always chain role-based procedures from `protectedProcedure`, not from `publicProcedure`. Otherwise you check the role before checking if the user is even logged in.

---

## Zod Error Formatting

Attach Zod validation errors to the tRPC error shape so the client can display field-level errors:

```typescript
// packages/api/src/trpc.ts
export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});
```

**Client-side usage:**
```typescript
const mutation = api.trip.create.useMutation({
  onError: (error) => {
    if (error.data?.zodError) {
      // Field-level errors: { fieldErrors: { name: ["Required"], status: ["Invalid"] } }
      setFieldErrors(error.data.zodError.fieldErrors);
    }
  },
});
```

---

## superjson Transformer: Required for Complex Types

Without superjson, tRPC serializes everything as plain JSON. This breaks Date objects, BigInt values, Maps, Sets, and other complex types.

```typescript
import superjson from "superjson";

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,  // REQUIRED for Date, BigInt, Map, Set
});
```

**Symptom without superjson:** Dates arrive as strings on the client. `createdAt` is `"2026-01-15T10:30:00.000Z"` (string) instead of a Date object.
**Fix:** Configure superjson as the transformer on both server and client.

**Client side must match:**
```typescript
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const api = createTRPCClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,  // Must match server
    }),
  ],
});
```

---

## httpBatchLink: Default Batching Behavior

By default, tRPC batches multiple queries made in the same render cycle into a single HTTP request.

```typescript
// These two queries are batched into ONE HTTP request:
const trips = api.trip.list.useQuery({ page: 1 });
const stats = api.dashboard.stats.useQuery();
// Result: POST /api/trpc/trip.list,dashboard.stats
```

**When batching causes problems:**
- One slow query blocks all batched queries from resolving
- Error in one query affects the entire batch response

**Fix for specific slow queries:**
```typescript
// Use separate links for queries that should not be batched
const slowQuery = api.report.generate.useQuery(
  { range: "yearly" },
  { trpc: { abortOnUnmount: true } }
);
```

---

## Input Validation: Always Use Shared Validators

```typescript
// WRONG — inline Zod schema, duplicated between API and UI
export const createTrip = protectedProcedure
  .input(z.object({ pickup: z.string(), dropoff: z.string() }))  // Not shared
  .mutation(/* ... */);

// CORRECT — shared validator from @{project}/validators
import { createTripSchema } from "@{project}/validators";

export const createTrip = protectedProcedure
  .input(createTripSchema)  // Same schema used by the form
  .mutation(/* ... */);
```

**Why shared validators matter:**
- Single source of truth for validation rules
- Client-side form validation matches server-side exactly
- Changing a rule updates both API and UI simultaneously

---

## Infinite Query Pattern

```typescript
// Router
export const list = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(20),
    cursor: z.string().optional(),
  }))
  .query(async ({ input }) => {
    const items = await db.query.trips.findMany({
      limit: input.limit + 1,  // Fetch one extra to check if there are more
      cursor: input.cursor ? { id: input.cursor } : undefined,
    });

    let nextCursor: string | undefined;
    if (items.length > input.limit) {
      const nextItem = items.pop();  // Remove the extra item
      nextCursor = nextItem!.id;
    }

    return { items, nextCursor };
  });

// Client
const { data, fetchNextPage, hasNextPage } = api.trip.list.useInfiniteQuery(
  { limit: 20 },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
);
```

**Gotcha:** The `limit + 1` pattern is the standard way to detect "has more pages" without a separate count query.

---

## Optimistic Updates

```typescript
const utils = api.useUtils();

const mutation = api.trip.updateStatus.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await utils.trip.getById.cancel({ id: newData.id });

    // Snapshot previous value
    const previousTrip = utils.trip.getById.getData({ id: newData.id });

    // Optimistically update
    utils.trip.getById.setData({ id: newData.id }, (old) => ({
      ...old!,
      status: newData.status,
    }));

    return { previousTrip };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.trip.getById.setData(
      { id: newData.id },
      context!.previousTrip
    );
  },
  onSettled: () => {
    // Refetch after mutation (success or error)
    utils.trip.getById.invalidate();
  },
});
```

**Gotcha:** Always implement `onError` rollback. Without it, failed mutations leave the UI in an incorrect state.
