# Monitoring Setup Template

A production application without monitoring is a house without smoke detectors. You will not know something is broken until a user tells you — and by then, many users have already been affected.

---

## Error Tracking: Sentry

**Why Sentry:** Best-in-class error tracking with source maps, breadcrumbs, and context. Free tier: 5,000 events/month.

### Setup

```bash
pnpm add @sentry/nextjs -w
npx @sentry/wizard@latest -i nextjs
```

This creates:
- `sentry.client.config.ts` — client-side error tracking
- `sentry.server.config.ts` — server-side error tracking
- `sentry.edge.config.ts` — edge runtime error tracking
- `next.config.ts` is updated with Sentry webpack plugin

### Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Capture 100% of errors in production
  tracesSampleRate: 1.0,

  // Replay captures user sessions for error reproduction
  replaysSessionSampleRate: 0.1,     // 10% of sessions
  replaysOnErrorSampleRate: 1.0,     // 100% of error sessions

  integrations: [
    Sentry.replayIntegration(),
  ],

  // Ignore common non-actionable errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Network request failed",
    "Load failed",
  ],
});
```

### Environment Variables

| Variable | Where | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client + Server | The Sentry project DSN |
| `SENTRY_AUTH_TOKEN` | Build time only | For source map upload |
| `SENTRY_ORG` | Build time only | Your Sentry org slug |
| `SENTRY_PROJECT` | Build time only | Your Sentry project slug |

### What Gets Captured

- Unhandled JavaScript exceptions (client and server)
- API route errors (tRPC errors with status 500)
- React component errors (Error Boundary integration)
- Console errors (optional, configurable)
- Performance traces (page loads, API calls, database queries)
- Session replays (for reproducing errors)

### Custom Error Context

```typescript
// Add user context after login
Sentry.setUser({
  id: user.id,
  email: user.email,
  role: user.role,
});

// Add breadcrumbs for debugging
Sentry.addBreadcrumb({
  category: "trip",
  message: `Trip ${tripId} status changed to ${newStatus}`,
  level: "info",
});

// Capture custom errors with context
Sentry.captureException(error, {
  tags: { feature: "billing", action: "invoice-create" },
  extra: { invoiceData: sanitizedData },
});
```

---

## Analytics: Vercel Analytics or PostHog

### Option A: Vercel Analytics (Simplest)

Built into Vercel, zero configuration needed.

```bash
pnpm add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Tracks:** Page views, Web Vitals (LCP, FID, CLS), top pages, referrers.

### Option B: PostHog (Self-Hostable, Feature-Rich)

More control, event tracking, feature flags, funnels, user identification.

```bash
pnpm add posthog-js
```

```typescript
// lib/posthog.ts
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "https://app.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
  });
}

export { posthog };
```

**Custom events:**
```typescript
posthog.capture("trip_created", {
  tripType: "one-way",
  fareAmount: 150,
});

posthog.capture("invoice_paid", {
  amount: 500,
  paymentMethod: "check",
});
```

---

## Uptime Monitoring

### Option A: BetterStack (Recommended)

Free tier: 5 monitors, 3-minute intervals, email/SMS alerts.

1. Sign up at [betterstack.com](https://betterstack.com)
2. Add monitors:
   - **Production URL:** `https://app.yourdomain.com` (HTTP check)
   - **API Health:** `https://app.yourdomain.com/api/health` (HTTP check, expect 200)
   - **Auth Endpoint:** `https://app.yourdomain.com/api/auth/session` (HTTP check, expect 200 or 401)

### Option B: UptimeRobot

Free tier: 50 monitors, 5-minute intervals.

### Health Endpoint

Create a simple health check that verifies the app can reach its dependencies:

```typescript
// app/api/health/route.ts
import { db } from "@{project}/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connectivity
    await db.execute("SELECT 1");

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "connected",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: "disconnected",
        },
      },
      { status: 503 }
    );
  }
}
```

---

## Logging

### Structured Logging Pattern

Use structured JSON logs for easy filtering and searching:

```typescript
// lib/logger.ts
type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

function log(level: LogLevel, event: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (event: string, data?: Record<string, unknown>) => log("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => log("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => log("error", event, data),
};
```

### Usage

```typescript
// In a tRPC router
logger.info("trip.created", { tripId, userId, fareAmount: 15000 });
logger.error("trip.create.failed", { userId, error: error.message, input: sanitizedInput });

// In auth
logger.info("auth.login", { userId, email });
logger.warn("auth.login.failed", { email, reason: "invalid_password" });

// In billing
logger.info("invoice.paid", { invoiceId, amount: 50000, paymentMethod: "check" });
```

### Vercel Log Drains (Optional)

Forward Vercel logs to external services for long-term storage and analysis:
- Datadog
- Axiom (free tier available)
- Logtail (via BetterStack)

Configure in Vercel Dashboard > Settings > Log Drains.

---

## Web Vitals Monitoring

### What to Track

| Metric | Good | Needs Improvement | Poor |
|--------|------|--------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | < 200ms | 200ms - 500ms | > 500ms |
| TTFB (Time to First Byte) | < 800ms | 800ms - 1.8s | > 1.8s |

### Built-in Next.js Reporting

```typescript
// app/layout.tsx
export function reportWebVitals(metric) {
  // Send to your analytics
  posthog.capture("web_vital", {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
}
```

---

## Monitoring Checklist

- [ ] Sentry configured with DSN and source maps
- [ ] Error alerts sent to team (email, Slack, or Discord)
- [ ] Analytics tracking page views and key user actions
- [ ] Uptime monitor checking production URL every 3-5 minutes
- [ ] Health endpoint verifying database connectivity
- [ ] Structured logging in API routes and critical paths
- [ ] Web Vitals reporting enabled
- [ ] Alert thresholds set (e.g., error rate > 5%, response time > 3s)
