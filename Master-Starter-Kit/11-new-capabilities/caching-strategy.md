# Caching Strategy

## Purpose

Define a layered caching strategy that improves performance and reduces infrastructure costs. This guide covers CDN, browser, API, database, and application-level caching with concrete configuration examples.

## CDN Caching Configuration

### Vercel Edge (Next.js)

```typescript
// app/api/products/route.ts
export async function GET() {
  const products = await db.product.findMany();

  return Response.json(products, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      // s-maxage=60: CDN caches for 60 seconds
      // stale-while-revalidate=300: serve stale for 5 min while refreshing in background
    },
  });
}
```

### Cloudflare Cache Rules

```
# Cloudflare Page Rule examples (configure in dashboard or via API)
# Static assets: cache everything for 1 year
URL: {{BASE_URL}}/assets/*
Cache Level: Cache Everything, Edge TTL: 1 year

# API responses: short cache with revalidation
URL: {{BASE_URL}}/api/public/*
Cache Level: Cache Everything, Edge TTL: 60s

# Authenticated routes: bypass cache
URL: {{BASE_URL}}/api/user/*
Cache Level: Bypass
```

## Browser Cache Headers Strategy

| Resource Type      | Cache-Control Header                                  | Rationale                            |
| ------------------ | ----------------------------------------------------- | ------------------------------------ |
| HTML pages         | `no-cache` or `max-age=0, must-revalidate`            | Always check for fresh content       |
| JS/CSS (hashed)    | `public, max-age=31536000, immutable`                 | Hash in filename = safe to cache forever |
| Images (static)    | `public, max-age=86400`                               | 1 day cache, acceptable staleness    |
| API (public data)  | `public, s-maxage=60, stale-while-revalidate=300`     | CDN caches 60s, stale OK for 5 min  |
| API (user data)    | `private, no-store`                                   | Never cache in shared caches         |
| Fonts              | `public, max-age=31536000, immutable`                 | Fonts rarely change                  |

```typescript
// middleware.ts (Next.js) - Set cache headers based on path
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const response = NextResponse.next();
  const path = new URL(request.url).pathname;

  if (path.startsWith("/api/public/")) {
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  } else if (path.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}
```

## API Response Caching Patterns

### Stale-While-Revalidate Pattern

The most practical pattern for API caching. Users always get a fast response (possibly stale), while the cache refreshes in the background.

```typescript
// lib/cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

const cache = new Map<string, CacheEntry<unknown>>();

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = 60_000
): Promise<T> {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (entry && now - entry.timestamp < ttlMs) {
    return entry.data; // Fresh cache hit
  }

  if (entry && now - entry.timestamp < ttlMs * 5) {
    // Stale but within revalidation window: return stale, refresh in background
    fetcher().then((data) => cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs }));
    return entry.data;
  }

  // Cache miss or too stale: fetch synchronously
  const data = await fetcher();
  cache.set(key, { data, timestamp: now, ttl: ttlMs });
  return data;
}
```

### TTL Guidelines by Endpoint Type

| Endpoint Type         | TTL          | Example                         |
| --------------------- | ------------ | ------------------------------- |
| Public catalog / list | 60s - 5 min  | `/api/products`                 |
| User profile          | No cache     | `/api/user/me`                  |
| Static reference data | 1 hour+      | `/api/countries`, `/api/plans`  |
| Search results        | 30s - 2 min  | `/api/search?q=...`             |
| Dashboard aggregates  | 5 - 15 min   | `/api/analytics/summary`        |

## Database Query Caching with Redis

```typescript
// lib/redis-cache.ts
import { Redis } from "@upstash/redis"; // or ioredis for self-hosted

const redis = new Redis({
  url: "{{UPSTASH_REDIS_URL}}",
  token: "{{UPSTASH_REDIS_TOKEN}}",
});

export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const result = await queryFn();
  await redis.set(key, JSON.stringify(result), { ex: ttlSeconds });
  return result;
}

// Usage
const products = await cachedQuery(
  "products:featured",
  () => db.product.findMany({ where: { featured: true } }),
  300 // 5 minutes
);
```

## Static Asset Caching

Build tools (Vite, Next.js, Webpack) add content hashes to filenames automatically. Leverage this for aggressive caching.

```
# Asset with hash: _next/static/chunks/app-a1b2c3d4.js
# Cache forever because the hash changes when content changes.
Cache-Control: public, max-age=31536000, immutable

# Asset without hash: /favicon.ico
# Cache for a day, revalidate after.
Cache-Control: public, max-age=86400, must-revalidate
```

Ensure your build output uses hashed filenames. In Next.js this is automatic. For custom setups, configure your bundler's `output.filename` with `[contenthash]`.

## Cache Invalidation Patterns

| Pattern       | When to Use                           | Implementation                         |
| ------------- | ------------------------------------- | -------------------------------------- |
| Time-based    | Data changes at predictable intervals | Set TTL on cache entries               |
| Event-based   | Data changes on write operations      | Invalidate cache key on mutation       |
| Manual purge  | Emergency fix, content correction     | Admin endpoint or CLI to clear cache   |
| Tag-based     | Group related cache entries           | Tag entries, purge by tag on mutation  |

```typescript
// Event-based invalidation after a mutation
export async function updateProduct(id: string, data: ProductUpdate) {
  const product = await db.product.update({ where: { id }, data });

  // Invalidate related cache entries
  await redis.del(`product:${id}`);
  await redis.del("products:featured");
  await redis.del("products:all");

  return product;
}
```

## TanStack Query (React Query) Cache Configuration

```typescript
// lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,        // Data is fresh for 60 seconds
      gcTime: 5 * 60_000,       // Keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

// Per-query override for frequently changing data
const { data: notifications } = useQuery({
  queryKey: ["notifications"],
  queryFn: fetchNotifications,
  staleTime: 10_000,           // Refetch every 10 seconds
  refetchInterval: 30_000,     // Poll every 30 seconds
});

// Per-query override for static data
const { data: plans } = useQuery({
  queryKey: ["plans"],
  queryFn: fetchPlans,
  staleTime: Infinity,         // Never refetch automatically
});
```

## Full-Page vs Partial Caching

| Strategy        | Best For                             | Trade-off                         |
| --------------- | ------------------------------------ | --------------------------------- |
| Full-page (SSG) | Marketing pages, blog posts          | Entire page cached; fast but stale|
| ISR             | Product pages, listings              | Revalidates periodically          |
| Partial         | Pages mixing user + public data      | Cache public parts, render user parts dynamically |

For partial caching in Next.js, use React Suspense boundaries to separate cached (static) from dynamic content.

## Cache Warming Strategies

Pre-populate caches after deployment or for high-traffic pages.

```typescript
// scripts/warm-cache.ts
const CRITICAL_URLS = [
  "{{BASE_URL}}/",
  "{{BASE_URL}}/pricing",
  "{{BASE_URL}}/api/products",
];

async function warmCache() {
  for (const url of CRITICAL_URLS) {
    await fetch(url, { headers: { "x-cache-warm": "true" } });
    console.log(`Warmed: ${url}`);
  }
}

warmCache();
```

Add to your deployment pipeline: `node scripts/warm-cache.ts` after deploy completes.

## Common Caching Mistakes

| Mistake                                | Consequence                              | Prevention                               |
| -------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Caching authenticated responses in CDN | User A sees User B's data                | Use `Cache-Control: private, no-store`   |
| No cache invalidation on writes        | Users see stale data after updates       | Invalidate related keys on every mutation|
| Caching error responses                | Errors served to all users for TTL       | Only cache 2xx responses                 |
| Same TTL for all endpoints             | Either too stale or too many cache misses| Set TTL based on data change frequency   |
| Not varying cache by auth state        | Logged-in and logged-out see same page   | Use `Vary: Cookie` or separate cache keys|
| Forgetting cache in local development  | Confusion debugging stale responses      | Disable caching in dev environment       |
