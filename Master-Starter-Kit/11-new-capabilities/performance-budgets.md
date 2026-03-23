# Performance Budgets

## Purpose

This guide defines measurable performance targets for {{PROJECT_NAME}} and the tooling to enforce them. Performance budgets are not aspirational -- they are enforced in CI. A build that exceeds the budget is a failing build, just like a broken test.

---

## Web Vitals Targets

These are the thresholds for a "good" user experience, measured at the 75th percentile.

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | How fast the main content loads |
| **INP** (Interaction to Next Paint) | < 200ms | How responsive the page is to user input |
| **CLS** (Cumulative Layout Shift) | < 0.1 | How much the layout shifts while loading |
| **FCP** (First Contentful Paint) | < 1.8s | Time to first meaningful pixel |
| **TTFB** (Time to First Byte) | < 800ms | Server response time |

---

## Bundle Size Budgets

Define per-route maximums. Enforce in CI.

| Asset Type | Budget | Notes |
|-----------|--------|-------|
| Initial JS bundle (per route) | < 150 KB gzipped | Code split by route |
| Total JS (first load) | < 300 KB gzipped | Framework + app code + vendor |
| CSS (per route) | < 50 KB gzipped | Tailwind purges unused |
| Single image | < 200 KB | WebP/AVIF, responsive sizes |
| Total images per page | < 500 KB | Above-the-fold budget |
| Fonts | < 100 KB | 1-2 font families, subset |
| Third-party scripts | < 100 KB total | Analytics, chat widgets, etc. |

---

## Bundle Analysis Tooling

### Next.js Bundle Analyzer

```bash
pnpm add -D @next/bundle-analyzer --filter @{{PROJECT_NAME}}/web
```

```typescript
// apps/web/next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  // ... other config
});
```

```bash
# Run analysis
ANALYZE=true pnpm build --filter @{{PROJECT_NAME}}/web
```

### source-map-explorer (framework-agnostic)

```bash
pnpm add -D source-map-explorer --filter @{{PROJECT_NAME}}/web

# Analyze a specific bundle
npx source-map-explorer dist/assets/index-*.js
```

### Size Limit (CI enforcement)

```bash
pnpm add -D size-limit @size-limit/preset-app --filter @{{PROJECT_NAME}}/web
```

```json
// apps/web/package.json
{
  "size-limit": [
    {
      "path": ".next/static/chunks/pages/index-*.js",
      "limit": "150 kB",
      "gzip": true
    },
    {
      "path": ".next/static/chunks/pages/dashboard-*.js",
      "limit": "200 kB",
      "gzip": true
    },
    {
      "path": ".next/static/css/**/*.css",
      "limit": "50 kB",
      "gzip": true
    }
  ],
  "scripts": {
    "size-check": "size-limit",
    "size-report": "size-limit --json"
  }
}
```

---

## Performance Monitoring: Web Vitals Reporting

### Client-Side Reporting

```typescript
// apps/web/src/lib/web-vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,       // "good", "needs-improvement", "poor"
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.pathname,
  };

  // Use sendBeacon for reliability (fires even during page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/vitals", JSON.stringify(body));
  } else {
    fetch("/api/vitals", { method: "POST", body: JSON.stringify(body), keepalive: true });
  }
}

// Register all metrics
export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

```tsx
// apps/web/src/app/layout.tsx
import { reportWebVitals } from "@/lib/web-vitals";

// Next.js App Router -- call in a client component
"use client";
import { useEffect } from "react";

export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);
  return null;
}
```

---

## Performance Regression Detection in CI

### Lighthouse CI

```bash
pnpm add -D @lhci/cli --filter @{{PROJECT_NAME}}/web
```

```javascript
// apps/web/lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --filter @{{PROJECT_NAME}}/web",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/login",
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "temporary-public-storage", // or self-hosted LHCI server
    },
  },
};
```

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm build --filter @{{PROJECT_NAME}}/web
      - run: pnpm dlx @lhci/cli autorun --config=apps/web/lighthouserc.js
```

---

## Image Optimization Pipeline

### Next.js Image Component

```tsx
import Image from "next/image";

// Always use next/image -- it auto-optimizes, lazy loads, and serves WebP/AVIF
<Image
  src="/hero.jpg"
  alt="Hero image description"
  width={1200}
  height={630}
  priority              // Only for above-the-fold images (disables lazy load)
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={80}          // Default is 75, rarely need higher than 85
/>
```

### Sharp for Server-Side Processing

```bash
pnpm add sharp --filter @{{PROJECT_NAME}}/api
```

```typescript
// packages/api/src/lib/image-processing.ts
import sharp from "sharp";

export async function optimizeUpload(buffer: Buffer, options?: { maxWidth?: number }) {
  const { maxWidth = 1920 } = options || {};

  return sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

// For thumbnails:
export async function createThumbnail(buffer: Buffer) {
  return sharp(buffer)
    .resize(300, 300, { fit: "cover" })
    .webp({ quality: 70 })
    .toBuffer();
}
```

---

## Code Splitting Strategy

### Route-Based Splitting (automatic in Next.js)

Each page in `app/` or `pages/` is automatically a separate chunk. No configuration needed.

### Component-Based Splitting (for heavy components)

```tsx
import dynamic from "next/dynamic";

// Heavy chart library -- only load when component is visible
const AnalyticsChart = dynamic(() => import("@/components/analytics-chart"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded" />,
  ssr: false, // Skip server rendering for client-only components
});

// Conditional loading -- only load if user has the feature
const AdminPanel = dynamic(() => import("@/components/admin-panel"));

export function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      <AnalyticsChart />
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Vendor Splitting

```typescript
// next.config.ts
export default {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
      "lodash-es",
    ],
  },
};
```

---

## Font Loading Optimization

```tsx
// apps/web/src/app/layout.tsx
import { Inter } from "next/font/google";

// next/font automatically:
// - Self-hosts the font (no external requests)
// - Subsets to only needed characters
// - Uses font-display: swap
// - Preloads the optimal font files
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

For self-hosted fonts:

```css
@font-face {
  font-family: "CustomFont";
  src: url("/fonts/custom-font.woff2") format("woff2");
  font-display: swap;
  font-weight: 400;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* Latin subset */
}
```

---

## Database Query Performance

### Slow Query Logging

```typescript
// packages/api/src/lib/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "./logger";

const SLOW_QUERY_THRESHOLD_MS = 500;

const sql = postgres(process.env.DATABASE_URL!, {
  debug: (connection, query, params, types) => {
    // Log all queries in development
    if (process.env.NODE_ENV === "development") {
      logger.debug({ query, params }, "SQL query");
    }
  },
});

// Middleware to detect slow queries
export async function withQueryTiming<T>(
  name: string,
  queryFn: () => Promise<T>,
): Promise<T> {
  const start = performance.now();
  const result = await queryFn();
  const duration = performance.now() - start;

  if (duration > SLOW_QUERY_THRESHOLD_MS) {
    logger.warn({ query: name, durationMs: Math.round(duration) }, "Slow query detected");
  }

  return result;
}

// Usage:
// const users = await withQueryTiming("listUsers", () =>
//   db.select().from(users).where(eq(users.active, true))
// );
```

### N+1 Query Detection

```typescript
// Detect N+1 patterns: if the same query runs more than N times in a single request
// packages/api/src/middleware/query-counter.ts

const queryCountMap = new Map<string, number>();

export function trackQuery(queryName: string) {
  const count = (queryCountMap.get(queryName) || 0) + 1;
  queryCountMap.set(queryName, count);

  if (count > 5) {
    logger.warn(
      { query: queryName, count },
      "Possible N+1 query detected -- consider using a join or batch loader",
    );
  }
}

export function resetQueryCounter() {
  queryCountMap.clear();
}

// Call resetQueryCounter() at the start of each request in middleware
// Call trackQuery("getUser") before each query execution
```

The proper fix for N+1 queries:

```typescript
// WRONG: N+1 -- fetches user for each order individually
const orders = await db.select().from(ordersTable);
for (const order of orders) {
  order.user = await db.select().from(usersTable).where(eq(usersTable.id, order.userId));
}

// CORRECT: join
const ordersWithUsers = await db
  .select()
  .from(ordersTable)
  .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id));

// CORRECT: batch load
const userIds = [...new Set(orders.map((o) => o.userId))];
const users = await db.select().from(usersTable).where(inArray(usersTable.id, userIds));
const userMap = new Map(users.map((u) => [u.id, u]));
orders.forEach((order) => { order.user = userMap.get(order.userId); });
```

---

## Lazy Loading Strategy

| Asset Type | Strategy | Implementation |
|-----------|----------|----------------|
| Images below fold | Native lazy loading | `loading="lazy"` or `next/image` (auto) |
| Heavy components | Dynamic import | `next/dynamic` or `React.lazy` |
| Routes | Code splitting | Automatic in Next.js App Router |
| Third-party scripts | `afterInteractive` | Next.js `<Script strategy="afterInteractive">` |
| Data | Pagination / infinite scroll | Fetch on demand, not all at once |

---

## Third-Party Script Impact Assessment

Before adding any third-party script, measure its cost:

```typescript
// Check bundle impact before installing
// Visit: https://bundlephobia.com/package/{{PACKAGE_NAME}}

// For scripts loaded via <script> tag, test with WebPageTest or Chrome DevTools:
// 1. Measure page load without the script
// 2. Add the script
// 3. Compare LCP, TBT, and total transfer size
// 4. Document the cost in the PR description
```

### Loading Third-Party Scripts Responsibly

```tsx
// apps/web/src/app/layout.tsx
import Script from "next/script";

// Analytics: load after page is interactive
<Script
  src="https://www.googletagmanager.com/gtag/js?id={{GA_ID}}"
  strategy="afterInteractive"
/>

// Chat widget: load only when idle (lowest priority)
<Script
  src="https://widget.intercom.io/widget/{{INTERCOM_ID}}"
  strategy="lazyOnload"
/>

// NEVER use strategy="beforeInteractive" unless absolutely necessary (e.g., polyfills)
```

---

## Checklist

- [ ] Web Vitals targets defined and documented (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Bundle size budgets set per route (enforced with size-limit in CI)
- [ ] Bundle analyzer configured and runnable locally
- [ ] Web Vitals reported to analytics endpoint
- [ ] Lighthouse CI runs on every pull request with score thresholds
- [ ] All images served as WebP/AVIF via `next/image` or sharp pipeline
- [ ] Heavy components code-split with dynamic imports
- [ ] Fonts self-hosted with `font-display: swap` and subsetting
- [ ] Slow query detection enabled (> 500ms threshold)
- [ ] N+1 query patterns identified and using joins or batch loaders
- [ ] Lazy loading applied to below-fold images, heavy components, and data
- [ ] Third-party scripts assessed for performance impact before inclusion
