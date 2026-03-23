# Error Handling Strategy

## Purpose

This guide defines a unified error handling approach across the full stack. Every error should be categorized, logged with context, surfaced to users appropriately, and reported for debugging. Follow these patterns to keep error handling consistent across {{PROJECT_NAME}}.

---

## Error Categorization

Every error falls into one of these categories. Tag all errors so logs and dashboards can filter by type.

| Category | Code Range | Description | Example |
|----------|-----------|-------------|---------|
| `VALIDATION` | 400 | Bad input from the client | Missing required field, invalid email format |
| `AUTH` | 401/403 | Authentication or authorization failure | Expired token, insufficient permissions |
| `NOT_FOUND` | 404 | Requested resource does not exist | User ID not in database |
| `CONFLICT` | 409 | State conflict | Duplicate email registration |
| `USER_ERROR` | 422 | Valid format but business rule violation | Booking a past date, overdrawing balance |
| `INTEGRATION` | 502/503 | External service failure | Stripe API timeout, S3 upload failure |
| `SYSTEM` | 500 | Unexpected internal error | Null pointer, OOM, unhandled promise |

---

## Error Response Envelope

All API errors return this consistent shape. Never leak stack traces to clients in production.

```typescript
// packages/shared/src/errors.ts
interface ApiError {
  success: false;
  error: {
    code: string;           // Machine-readable: "VALIDATION_ERROR", "NOT_FOUND"
    message: string;        // Human-readable: "Email is already registered"
    category: ErrorCategory;
    details?: Record<string, unknown>; // Field-level errors, metadata
    requestId: string;      // Correlation ID for tracing
  };
}

// Example response:
// {
//   "success": false,
//   "error": {
//     "code": "VALIDATION_ERROR",
//     "message": "Invalid input",
//     "category": "VALIDATION",
//     "details": { "fields": { "email": "Must be a valid email" } },
//     "requestId": "req_abc123xyz"
//   }
// }
```

---

## Structured Logging with Pino

### Installation

```bash
pnpm add pino pino-pretty --filter @{{PROJECT_NAME}}/api
```

### Logger Configuration

```typescript
// packages/api/src/lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } }
      : undefined, // JSON output in production for log aggregators
  base: {
    service: "{{SERVICE_NAME}}",
    env: process.env.NODE_ENV,
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  redact: ["req.headers.authorization", "req.headers.cookie", "body.password"],
});
```

### Log Level Strategy

| Level | When to Use | Example |
|-------|------------|---------|
| `fatal` | App cannot continue running | Database connection permanently lost |
| `error` | Operation failed, needs attention | Payment processing failed, unhandled exception |
| `warn` | Degraded but functional, or suspicious | Rate limit approaching, deprecated API called |
| `info` | Normal significant events | User registered, order placed, deployment started |
| `debug` | Diagnostic detail for development | SQL query, cache hit/miss, request payload |
| `trace` | Extremely verbose, rarely used | Function entry/exit, variable snapshots |

```typescript
// Usage examples
logger.info({ userId, action: "register" }, "User registered successfully");
logger.warn({ ip, count: 95, limit: 100 }, "Rate limit threshold approaching");
logger.error({ err, orderId, provider: "stripe" }, "Payment processing failed");
```

---

## Correlation IDs for Request Tracing

Attach a unique ID to every request. Pass it through all downstream calls and log entries.

```typescript
// packages/api/src/middleware/correlation-id.ts
import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export function correlationId(req: Request, _res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string) || randomUUID();
  req.requestId = id;
  // Attach to async context so logger picks it up automatically
  req.log = logger.child({ requestId: id });
  next();
}
```

For tRPC, attach in the context builder:

```typescript
// packages/api/src/trpc.ts
export const createTRPCContext = async (opts: { req: Request }) => {
  const requestId = opts.req.requestId || randomUUID();
  return {
    requestId,
    log: logger.child({ requestId }),
    db,
    session: opts.req.session,
  };
};
```

---

## React Error Boundary Hierarchy

### Three-tier strategy: App > Route > Component

```tsx
// App-level: catches catastrophic failures, shows full-page fallback
// apps/web/src/app/error.tsx (Next.js App Router)
"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/error-reporting";

export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "global" });
  }, [error]);

  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <p>We have been notified and are looking into it.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```tsx
// Route-level: catches page-specific errors, preserves layout/nav
// apps/web/src/app/dashboard/error.tsx
"use client";

export default function DashboardError({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div role="alert" className="p-8">
      <h2>Dashboard failed to load</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Reload dashboard</button>
    </div>
  );
}
```

```tsx
// Component-level: isolate non-critical widgets (charts, feeds)
// apps/web/src/components/error-boundary.tsx
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
  onError?: (error: Error) => void;
}

interface State { hasError: boolean; }

export class ComponentErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

---

## Client-Side Error Reporting (Sentry)

```bash
pnpm add @sentry/nextjs --filter @{{PROJECT_NAME}}/web
```

```typescript
// apps/web/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "{{SENTRY_DSN}}",
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request?.cookies) delete event.request.cookies;
    return event;
  },
});
```

---

## Server-Side Error Middleware

```typescript
// packages/api/src/middleware/error-handler.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.requestId || "unknown";

  if (err instanceof AppError) {
    req.log.warn({ err, category: err.category }, err.message);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        category: err.category,
        details: err.details,
        requestId,
      },
    });
  }

  // Unexpected errors: log full stack, send generic message
  req.log.error({ err }, "Unhandled error");
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      category: "SYSTEM",
      requestId,
    },
  });
}
```

---

## Retry with Exponential Backoff

Use for transient failures against external services (payment APIs, email services, etc.).

```typescript
// packages/shared/src/retry.ts
interface RetryOptions {
  maxAttempts: number;     // Default: 3
  baseDelayMs: number;     // Default: 1000
  maxDelayMs: number;      // Default: 30000
  jitter: boolean;         // Default: true (prevents thundering herd)
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 1000, maxDelayMs = 30000, jitter = true } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      const exponentialDelay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const delay = jitter
        ? exponentialDelay * (0.5 + Math.random() * 0.5)
        : exponentialDelay;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
}

// Usage:
// const result = await withRetry(() => stripe.charges.create(params), { maxAttempts: 3 });
```

---

## Circuit Breaker for External Services

Prevent cascading failures when a dependency is down. After repeated failures, stop calling the service for a cooldown period.

```typescript
// packages/shared/src/circuit-breaker.ts
type State = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: State = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private readonly threshold: number = 5,       // failures before opening
    private readonly cooldownMs: number = 30000,   // wait before half-open
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN -- service unavailable");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
    }
  }
}

// Usage:
// const stripeBreaker = new CircuitBreaker(5, 60000);
// const charge = await stripeBreaker.call(() => stripe.charges.create(params));
```

---

## Checklist

- [ ] All API errors use the standard error envelope format
- [ ] Pino logger configured with redaction of sensitive fields
- [ ] Correlation IDs attached to every request and passed through logs
- [ ] React Error Boundaries at app, route, and component levels
- [ ] Sentry (or equivalent) configured for client and server
- [ ] Error middleware catches all unhandled errors and returns consistent format
- [ ] Retry logic used for all external service calls
- [ ] Circuit breaker wrapping unreliable dependencies
- [ ] No stack traces leaked to clients in production
- [ ] Log levels used correctly (not everything is `error`)
