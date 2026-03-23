# Performance Targets

## API Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Response Time (p50)** | < 200ms | Median API response time |
| **Response Time (p95)** | < 500ms | 95th percentile response time |
| **Response Time (p99)** | < 1000ms | 99th percentile response time |
| **Error Rate** | < 1% | Percentage of 5xx responses |
| **Availability** | 99.5% | Uptime over 30-day rolling window |

### Per-Endpoint Targets

| Endpoint Type | p95 Target | Notes |
|--------------|-----------|-------|
| List/Search (paginated) | < 300ms | With proper indexing |
| Single record GET | < 100ms | Primary key lookup |
| Create (POST) | < 500ms | Including validation |
| Update (PUT/PATCH) | < 500ms | Including validation |
| Delete (soft) | < 200ms | Just setting deletedAt |
| Bulk operations | < 2000ms | Max 100 records per batch |
| Report generation | < 5000ms | Complex aggregations |
| File upload | < 10000ms | Depends on file size |

---

## Frontend Performance (Web Vitals)

| Metric | Good | Needs Work | Poor |
|--------|------|-----------|------|
| **FCP** (First Contentful Paint) | < 1.8s | 1.8-3.0s | > 3.0s |
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4.0s | > 4.0s |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| **TBT** (Total Blocking Time) | < 200ms | 200-600ms | > 600ms |
| **TTFB** (Time to First Byte) | < 800ms | 800-1800ms | > 1800ms |

**Target:** All Core Web Vitals in "Good" range for 75th percentile of page loads.

---

## Bundle Size Budget

| Asset | Budget | Notes |
|-------|--------|-------|
| **Total JS (initial load)** | < 200KB gzipped | First-load JavaScript |
| **Total CSS** | < 50KB gzipped | All stylesheets |
| **Largest JS chunk** | < 100KB gzipped | Code-split appropriately |
| **Images (per page)** | < 500KB total | Use next/image, WebP/AVIF |
| **Fonts** | < 100KB total | Subset, woff2 format |
| **Third-party scripts** | < 50KB gzipped | Analytics, chat widgets, etc. |

### Per-Route Budget

| Route Type | JS Budget | Total Budget |
|-----------|-----------|-------------|
| Landing/Marketing | < 100KB | < 300KB |
| Dashboard | < 150KB | < 500KB |
| Data table page | < 120KB | < 400KB |
| Form page | < 100KB | < 350KB |
| Settings page | < 80KB | < 250KB |

---

## Database Performance

| Metric | Target |
|--------|--------|
| **Query time (simple)** | < 10ms |
| **Query time (join)** | < 50ms |
| **Query time (aggregation)** | < 200ms |
| **Connection pool size** | 10-20 per instance |
| **Connection wait time** | < 50ms |
| **Index coverage** | All frequently-queried columns indexed |
| **N+1 query count** | 0 (use includes/joins) |

---

## How to Measure

### API Performance
```bash
# Use your API testing tool with load:
# k6, artillery, autocannon, or similar
# Example: autocannon
npx autocannon -c 10 -d 30 http://localhost:3001/api/items
```

### Web Vitals
```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --output=json
# Or use web-vitals library in production
```

### Bundle Size
```bash
# Next.js build analysis
ANALYZE=true pnpm build
# Or use bundlephobia for individual packages
```

---

## Performance Review Cadence

| When | What to Check |
|------|--------------|
| Every PR | Bundle size delta (warn if > 10KB increase) |
| Every sprint | API p95 latency, Core Web Vitals |
| Every phase gate | Full performance audit (all metrics) |
| Before release | Load test at 2x expected traffic |
