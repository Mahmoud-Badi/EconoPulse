# API Middleware & Auth Tiers — {{PROJECT_NAME}}

> **Every API call passes through middleware.** This document defines auth tiers, rate limiting, error formatting, and context creation.

---

## Auth Tier Definitions

### Tier Hierarchy

```
publicProcedure          — No authentication required
    ↓
protectedProcedure       — Any authenticated user
    ↓
{role_1}Procedure        — Users with {ROLE_1} role or higher
    ↓
{role_2}Procedure        — Users with {ROLE_2} role or higher
    ↓
adminProcedure           — Admin role only
    ↓
superAdminProcedure      — Super admin / system owner only
```

### Tier Details

| Tier | Middleware | Check | Allowed Roles | Use Cases |
|------|-----------|-------|--------------|-----------|
| `publicProcedure` | None | No session required | Anyone | Login, register, forgot password, health check |
| `protectedProcedure` | `isAuthenticated` | Valid session exists | All authenticated | Dashboard, profile, most CRUD reads |
| `{role_1}Procedure` | `hasRole("{role_1}")` | Session + role check | {{ROLE_1}}, admin | {{USE_CASES}} |
| `{role_2}Procedure` | `hasRole("{role_2}")` | Session + role check | {{ROLE_2}}, {{ROLE_1}}, admin | {{USE_CASES}} |
| `adminProcedure` | `hasRole("admin")` | Session + admin role | admin only | User management, company settings |
| `companyScoped` | `isAuthenticated` + company filter | Session + auto-filter by companyId | All authenticated | All data queries (multi-tenant) |

---

## Implementation

### tRPC Initialization

```typescript
// packages/api/src/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "@{PROJECT}/auth";
import { db } from "@{PROJECT}/db";

// Context type — available in every procedure
interface CreateContextOptions {
  session: Session | null;
}

export const createTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Never expose internal error details to client
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
```

### Authentication Middleware

```typescript
// packages/api/src/trpc.ts (continued)

// Middleware: Verify session exists
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return next({
    ctx: {
      session: ctx.session, // Now guaranteed non-null
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
```

### Role-Based Middleware

```typescript
// packages/api/src/trpc.ts (continued)

// Role hierarchy — higher index = more permissions
const ROLE_HIERARCHY: Record<string, number> = {
  "{ROLE_LOWEST}": 0,
  "{ROLE_MID_1}": 1,
  "{ROLE_MID_2}": 2,
  "{ROLE_HIGH}": 3,
  "admin": 4,
  "super_admin": 5,
};

// Middleware factory: Check role level
const hasRole = (requiredRole: string) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    }

    const userLevel = ROLE_HIERARCHY[ctx.session.user.role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 999;

    if (userLevel < requiredLevel) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires ${requiredRole} role or higher`,
      });
    }

    return next({ ctx: { session: ctx.session } });
  });

// Export role-specific procedures
export const {role1}Procedure = t.procedure.use(hasRole("{ROLE_1}"));
export const {role2}Procedure = t.procedure.use(hasRole("{ROLE_2}"));
export const adminProcedure = t.procedure.use(hasRole("admin"));
```

### Company-Scoped Middleware

```typescript
// Automatically filter all queries by the user's company
const companyScoped = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.companyId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User must belong to a company",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      companyId: ctx.session.user.companyId, // Guaranteed string
    },
  });
});

export const companyScopedProcedure = t.procedure
  .use(isAuthenticated)
  .use(companyScoped);
```

---

## Rate Limiting

| Endpoint Type | Limit | Window | Strategy |
|--------------|-------|--------|----------|
| Public (login, register) | {N} requests | {{WINDOW}} | IP-based |
| Protected (general) | {N} requests | {{WINDOW}} | User-based |
| Mutations (create, update) | {N} requests | {{WINDOW}} | User-based |
| Search/autocomplete | {N} requests | {{WINDOW}} | User-based |
| File upload | {N} requests | {{WINDOW}} | User-based |
| Admin operations | {N} requests | {{WINDOW}} | User-based |

### Implementation

```typescript
// packages/api/src/middleware/rate-limit.ts
import { TRPCError } from "@trpc/server";

// In-memory rate limiter (for single-server deployments)
// For multi-server: use Redis-based rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): void {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    });
  }

  entry.count++;
}
```

---

## Zod Error Formatter

When Zod validation fails, format errors for the client:

```typescript
// In the tRPC error formatter (shown above)
errorFormatter({ shape, error }) {
  return {
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError
          ? error.cause.flatten()
          // Returns: { fieldErrors: { name: ["Required"], email: ["Invalid"] } }
          : null,
    },
  };
}
```

### Client-Side Error Display

```typescript
// apps/web/lib/trpc-errors.ts
export function getFieldErrors(error: TRPCClientError) {
  return error.data?.zodError?.fieldErrors ?? {};
  // Returns: { name: ["Required"], email: ["Invalid email"] }
}
```

---

## Context Creation Pattern

### Next.js API Route

```typescript
// apps/web/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@{PROJECT}/api";
import { createTRPCContext } from "@{PROJECT}/api/trpc";
import { auth } from "~/lib/auth";

const handler = async (req: Request) => {
  const session = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ session }),
  });
};

export { handler as GET, handler as POST };
```

---

## Middleware Chain Order

Every request passes through middleware in this order:

```
1. Next.js routing → /api/trpc/[procedure]
2. tRPC handler → Parse procedure name and input
3. Zod validation → Validate input against schema
4. Auth middleware → Check session (publicProcedure skips this)
5. Role middleware → Check role level (role-specific procedures only)
6. Company scoping → Extract companyId (company-scoped procedures)
7. Rate limiting → Check request count
8. Procedure logic → Business logic + DB queries
9. Error formatting → Format any errors for client
10. Response → JSON response to client
```

---

## Security Checklist

- [ ] All non-public procedures use `protectedProcedure` or higher
- [ ] Admin-only operations use `adminProcedure`
- [ ] All data queries filter by `companyId` (multi-tenant isolation)
- [ ] Zod validates all inputs (no raw user data reaches DB)
- [ ] Error messages never expose internal details
- [ ] Rate limiting on auth endpoints (prevent brute force)
- [ ] Session expiry configured ({{SESSION_DURATION}})
- [ ] CSRF protection enabled
- [ ] SQL injection impossible (Drizzle parameterizes all queries)
