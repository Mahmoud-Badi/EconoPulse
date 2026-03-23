# Error Handling Patterns — {{PROJECT_NAME}}

> **Rule: Users never see raw database errors, stack traces, or technical jargon.** Every error the user sees must be a clear, actionable message.

---

## 1. tRPC Error Code Mapping

Map tRPC error codes to user-facing behavior:

| tRPC Code | HTTP Status | When to Use | User Message Pattern |
|-----------|------------|-------------|---------------------|
| `BAD_REQUEST` | 400 | Invalid input (after Zod validation) | "Please check your input: {field} {issue}" |
| `UNAUTHORIZED` | 401 | Not logged in | Redirect to `/login` |
| `FORBIDDEN` | 403 | Insufficient role/permissions | "You don't have permission to {action}" |
| `NOT_FOUND` | 404 | Entity doesn't exist or soft-deleted | "{Entity} not found" |
| `CONFLICT` | 409 | Duplicate entry, version conflict | "{Entity} already exists" or "This was updated by someone else" |
| `TOO_MANY_REQUESTS` | 429 | Rate limited | "Too many requests. Please wait a moment." |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error (catch-all) | "Something went wrong. Please try again." |

### Server-Side Error Pattern

```typescript
// packages/api/src/routers/{entity}.ts
import { TRPCError } from "@trpc/server";

export const {entity}Router = router({
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.query.{entity}.findFirst({
          where: eq({entity}.id, input.id),
        });

        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "{Entity} not found",
          });
        }

        return result;
      } catch (error) {
        // Re-throw TRPCErrors as-is
        if (error instanceof TRPCError) throw error;

        // Log unexpected errors, return generic message
        console.error(`[{entity}.getById] Unexpected error:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch {entity}. Please try again.",
        });
      }
    }),
});
```

---

## 2. Toast Notification Rules

| Type | Color | Duration | Icon | When to Use |
|------|-------|----------|------|------------|
| Success | Green (`--color-success`) | 3 seconds | CheckCircle | Create, update, delete completed |
| Error | Red (`--color-error`) | 5 seconds (sticky) | AlertCircle | API errors, validation failures |
| Warning | Yellow (`--color-warning`) | 4 seconds | AlertTriangle | Partial success, degraded state |
| Info | Blue (`--color-info`) | 3 seconds | Info | Informational (e.g., "Copied to clipboard") |

### Toast Pattern

```typescript
// Client-side toast after mutation
const createMutation = api.{entity}.create.useMutation({
  onSuccess: () => {
    toast.success("{Entity} created successfully");
    router.push("/{entities}");
  },
  onError: (error) => {
    toast.error(error.message); // tRPC passes the message through
  },
});
```

### Toast Rules

1. **Success toasts auto-dismiss** — Never require user action for success
2. **Error toasts stay longer** — User needs time to read and act
3. **Never stack more than 3 toasts** — Queue excess, show newest
4. **Never toast on page load** — Only toast in response to user actions
5. **Toast messages are sentences** — "Trip created successfully." not "TRIP_CREATED"

---

## 3. Retry Strategies

### When to Retry

| Scenario | Retry? | Strategy |
|----------|--------|----------|
| Network timeout | Yes | Exponential backoff |
| 5xx server error | Yes | Exponential backoff (max 3) |
| 429 rate limited | Yes | Respect `Retry-After` header |
| 4xx client error | No | Show error immediately |
| Auth expired | No | Redirect to login |
| Validation error | No | Show field errors |

### Exponential Backoff

```typescript
// TanStack Query retry config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, max 30s
    },
    mutations: {
      retry: false, // Never auto-retry mutations
    },
  },
});
```

### Rules

1. **Never retry mutations automatically** — User must explicitly retry (button click)
2. **Always retry queries** — Network blips are common, retry transparently
3. **Cap retries at 3** — If it fails 3 times, show an error
4. **Exponential backoff** — 1s, 2s, 4s (never hammer the server)
5. **Show retry UI after exhaustion** — "Failed to load. [Retry]" button

---

## 4. Error Boundary Placement

```
<RootErrorBoundary>           ← Catches catastrophic app-level errors
  <Layout>
    <Sidebar />                ← Never crashes (static content)
    <PageErrorBoundary>        ← Catches page-level errors
      <Page>
        <SectionErrorBoundary> ← Optional: isolate independent sections
          <DataTable />
        </SectionErrorBoundary>
        <SectionErrorBoundary>
          <Chart />            ← Chart error doesn't break the whole page
        </SectionErrorBoundary>
      </Page>
    </PageErrorBoundary>
  </Layout>
</RootErrorBoundary>
```

### Error Boundary Hierarchy

| Level | Scope | Recovery Action |
|-------|-------|----------------|
| Root | Entire app | "Something went wrong. [Reload App]" |
| Page | Single page | "This page encountered an error. [Go Back] [Retry]" |
| Section | Independent widget | "Unable to load {section}. [Retry]" (rest of page works) |

### Implementation Pattern

```typescript
// apps/web/components/error-boundary.tsx
"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@{PROJECT}/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
    // Log to error tracking service
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <p className="text-muted-foreground">Something went wrong.</p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 5. User-Facing Error Messages

### Message Rules

1. **Plain language** — "Trip not found" not "404 NOT_FOUND: trip_id=abc-123"
2. **Actionable** — Tell the user what to do: "Try again", "Go back", "Contact support"
3. **Honest** — "Something went wrong" is better than "Success" when it failed
4. **No blame** — "We couldn't save your changes" not "You submitted invalid data"
5. **No technical jargon** — No error codes, SQL errors, or stack traces

### Standard Messages

| Scenario | Message |
|----------|---------|
| Entity not found | "{Entity} not found. It may have been deleted." |
| Permission denied | "You don't have permission to {action}." |
| Network error | "Unable to connect. Please check your internet connection." |
| Server error | "Something went wrong. Please try again in a moment." |
| Validation (field) | "{Field} is required." / "{Field} must be at least {N} characters." |
| Duplicate | "A {entity} with this {field} already exists." |
| Rate limited | "You're making too many requests. Please wait a moment." |
| Session expired | Redirect to login with "Your session has expired. Please sign in again." |

### Form Validation Messages

```typescript
// packages/validators/src/{entity}.ts
export const create{Entity}Schema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  phone: z.string()
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number")
    .optional(),
  amount: z.number()
    .min(0, "Amount cannot be negative")
    .max(999999, "Amount exceeds maximum"),
});
```

---

## 6. Error Tracking (Production)

| Aspect | Strategy |
|--------|----------|
| Client errors | Error boundary `componentDidCatch` → {{ERROR_SERVICE}} |
| Server errors | tRPC middleware logging → {{LOGGING_SERVICE}} |
| Unhandled rejections | Global handler in `app/layout.tsx` |
| 4xx tracking | tRPC `onError` formatter |
| Alerts | {{ALERT_THRESHOLD}} errors/minute → {{ALERT_CHANNEL}} |
