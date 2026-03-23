# Performance Audit Report — TaskFlow

> **Date:** 2026-03-10
> **Auditor:** Platform Engineering
> **Environment:** Staging (4 vCPU, 8GB RAM, PostgreSQL 16)
> **Build:** v2.1.0-rc.3 (commit `a3f7c2e`)

---

## 1. Bundle Analysis

### Setup

```bash
# Install and run next/bundle-analyzer
ANALYZE=true pnpm build
# Output: .next/analyze/client.html and .next/analyze/nodejs.html
```

### Findings

| Chunk | Size (gzip) | Threshold | Status | Notes |
| --- | --- | --- | --- | --- |
| `framework-*.js` | 87KB | N/A (React) | OK | React 19 + ReactDOM — irreducible |
| `main-*.js` | 42KB | < 50KB | OK | App shell, router, layout |
| `pages/dashboard-*.js` | 78KB | < 50KB | OVER | Includes chart library (recharts) inline |
| `pages/load-planner-*.js` | 112KB | < 50KB | OVER | Google Maps SDK + AI cargo logic |
| `pages/accounting-*.js` | 63KB | < 50KB | OVER | PDF generation (jspdf) bundled client-side |
| `commons-*.js` | 31KB | < 50KB | OK | Shared utilities |
| `_app-*.js` | 18KB | < 50KB | OK | Providers, global styles |

### Recommendations

1. **Dashboard charts:** Lazy-load recharts with `next/dynamic` — saves ~45KB on initial load.
2. **Load Planner:** Google Maps is already async-loaded. AI cargo module should be code-split into a separate chunk loaded on user interaction.
3. **Accounting PDF:** Move jspdf to a web worker or lazy-load on "Export PDF" click. No user needs PDF generation on page load.

```typescript
// Before (accounting page)
import jsPDF from 'jspdf';

// After (lazy-loaded on click)
const handleExportPDF = async () => {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  // ...
};
```

---

## 2. Prisma Generation Profiling

```bash
$ time npx prisma generate
# Environment: 260 models, 114 enums

real    0m8.432s    # Target: < 10s
user    0m7.891s
sys     0m0.541s

$ time npx prisma db push --accept-data-loss  # Staging only
real    0m12.107s   # Target: < 30s
```

| Metric | Value | Target | Status |
| --- | --- | --- | --- |
| `prisma generate` | 8.4s | < 10s | OK |
| `prisma db push` | 12.1s | < 30s | OK |
| Generated client size | 4.2MB | < 5MB | OK |
| Model count | 260 | < 300 | OK (approaching limit) |

**Risk:** At current growth rate (~15 models/month), generation time will exceed 10s within 4 months. Consider splitting into multiple Prisma schemas if model count exceeds 300.

---

## 3. `use client` Directive Audit

### Detection Script

```bash
#!/bin/bash
# Count 'use client' directives across the frontend
echo "=== use client Directive Audit ==="

TOTAL=$(find apps/web -name "*.tsx" -o -name "*.ts" | wc -l)
CLIENT=$(grep -rl "'use client'" apps/web --include="*.tsx" --include="*.ts" | wc -l)
SERVER=$((TOTAL - CLIENT))

echo "Total components:  $TOTAL"
echo "Client components: $CLIENT"
echo "Server components: $SERVER"
echo "Client ratio:      $(echo "scale=1; $CLIENT * 100 / $TOTAL" | bc)%"

echo ""
echo "=== Potentially Unnecessary 'use client' ==="
# Files with 'use client' but no hooks, event handlers, or browser APIs
grep -rl "'use client'" apps/web --include="*.tsx" | while read f; do
  if ! grep -qE 'useState|useEffect|useRef|useCallback|useMemo|onClick|onChange|onSubmit|window\.|document\.|navigator\.' "$f"; then
    echo "  REVIEW: $f"
  fi
done
```

### Results

| Metric | Count |
| --- | --- |
| Total .tsx/.ts files | 402 |
| `'use client'` directives | 187 |
| Server components | 215 |
| Client ratio | 46.5% |
| Unnecessary `'use client'` (no hooks/handlers) | 12 |

**Files flagged for review:**

| File | Reason Flagged | Verdict |
| --- | --- | --- |
| `components/ui/badge.tsx` | No hooks or handlers | REMOVE — pure presentational |
| `components/ui/card.tsx` | No hooks or handlers | REMOVE — pure presentational |
| `components/ui/separator.tsx` | No hooks or handlers | REMOVE — pure presentational |
| `components/tms/status-dot.tsx` | No hooks or handlers | REMOVE — pure presentational |
| `components/layouts/page-header.tsx` | No hooks or handlers | REMOVE — pure presentational |
| `components/tms/load-card.tsx` | Uses onClick via prop drilling | KEEP — parent passes handler |
| Other 6 files | Various | 4 REMOVE, 2 KEEP |

**Impact:** Removing 8 unnecessary `'use client'` directives reduces client bundle by ~6KB and allows React to server-render those components.

---

## 4. Web Vitals

### Targets

| Metric | Good | Needs Improvement | Poor |
| --- | --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s | 2.5–4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | 100–300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 800ms | 800ms–1.8s | > 1.8s |
| INP (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |

### Measurements (Lighthouse, mobile throttling)

| Page | LCP | FID | CLS | TTFB | INP | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| `/dashboard` | 2.1s | 45ms | 0.02 | 620ms | 180ms | GOOD |
| `/loads` | 2.8s | 62ms | 0.15 | 710ms | 210ms | NEEDS WORK |
| `/load-planner/[id]/edit` | 3.4s | 38ms | 0.08 | 890ms | 150ms | NEEDS WORK |
| `/carriers` | 1.9s | 55ms | 0.03 | 580ms | 190ms | GOOD |
| `/accounting/invoices` | 2.3s | 71ms | 0.22 | 650ms | 240ms | NEEDS WORK |
| `/login` | 1.2s | 22ms | 0.01 | 340ms | 80ms | GOOD |

### Issues Found

1. **`/loads` CLS 0.15:** Table skeleton height does not match loaded content. Fix: set `min-height` on table container.
2. **`/load-planner` LCP 3.4s:** Google Maps iframe is LCP element. Fix: show static map placeholder, lazy-load interactive map.
3. **`/accounting/invoices` CLS 0.22:** Filter bar renders after data loads, pushing content down. Fix: reserve space with fixed-height container.
4. **`/loads` INP 210ms:** Row selection triggers full re-render. Fix: memoize row components with `React.memo`.

---

## 5. API Response Time Profiling

### Targets by Endpoint Category

| Category | p50 | p95 | p99 | Examples |
| --- | --- | --- | --- | --- |
| Auth | < 100ms | < 300ms | < 500ms | `/auth/login`, `/auth/refresh` |
| Read (single) | < 50ms | < 200ms | < 500ms | `/loads/:id`, `/carriers/:id` |
| Read (list) | < 100ms | < 500ms | < 1s | `/loads`, `/carriers`, `/invoices` |
| Write | < 100ms | < 300ms | < 1s | `POST /loads`, `PATCH /carriers/:id` |
| Search | < 200ms | < 500ms | < 1s | `/loads/search`, `/carriers/search` |
| Report | < 500ms | < 2s | < 5s | `/accounting/dashboard`, `/reports/*` |
| Export | < 1s | < 5s | < 10s | `/invoices/export`, `/loads/export` |

### Measurements (k6, 50 concurrent users, 5 min run)

| Endpoint | p50 | p95 | p99 | Status |
| --- | --- | --- | --- | --- |
| `POST /auth/login` | 82ms | 210ms | 380ms | OK |
| `GET /loads` | 95ms | 320ms | 780ms | OK |
| `GET /loads/:id` | 38ms | 120ms | 290ms | OK |
| `GET /carriers` | 110ms | 480ms | 920ms | OK |
| `GET /carriers/:id` | 42ms | 95ms | 210ms | OK |
| `POST /loads` | 78ms | 190ms | 450ms | OK |
| `GET /loads/search` | 180ms | 620ms | 1.4s | OVER p99 |
| `GET /accounting/dashboard` | 420ms | 1.8s | 4.2s | OVER p95, p99 |
| `GET /invoices/export` | 850ms | 3.1s | 7.8s | OK |

---

## 6. Database Query Analysis

### Slow Query Log (queries > 500ms, last 7 days)

| Query Pattern | Avg Time | Count | Table | Issue |
| --- | --- | --- | --- | --- |
| `SELECT * FROM loads WHERE ... ORDER BY created_at` | 820ms | 342 | loads | Missing composite index on `(tenant_id, status, created_at)` |
| `SELECT COUNT(*) FROM invoices WHERE ...` | 1.2s | 89 | invoices | Full table scan — no index on `(tenant_id, status)` |
| `SELECT * FROM audit_logs WHERE entity_id = ...` | 2.1s | 56 | audit_logs | 4.2M rows, no index on `entity_id` |
| `SELECT ... FROM loads JOIN stops JOIN ...` | 1.5s | 28 | loads/stops | 4-table JOIN without covering index |

### Missing Indexes

```sql
-- Recommended indexes based on slow query analysis
CREATE INDEX CONCURRENTLY idx_loads_tenant_status_created
  ON loads (tenant_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY idx_invoices_tenant_status
  ON invoices (tenant_id, status);

CREATE INDEX CONCURRENTLY idx_audit_logs_entity
  ON audit_logs (entity_id, entity_type);

CREATE INDEX CONCURRENTLY idx_stops_load_sequence
  ON stops (load_id, sequence_number);
```

### N+1 Detection

```bash
# Enable Prisma query logging in development
# prisma.$on('query', (e) => console.log(e.query))
# Then look for repeated SELECT patterns
```

| Route | N+1 Pattern | Queries | Fix |
| --- | --- | --- | --- |
| `GET /loads` | Fetches shipper for each load individually | 25+1 | Add `include: { shipper: true }` |
| `GET /carriers/:id` | Fetches each truck type separately | 8+1 | Add `include: { trucks: { include: { truckType: true } } }` |
| `GET /accounting/dashboard` | Fetches invoice counts per status in loop | 6+1 | Use `groupBy` with `_count` |

---

## 7. Memory Profiling

### Heap Snapshot Analysis (Node.js backend, after 1 hour under load)

| Metric | Value | Threshold | Status |
| --- | --- | --- | --- |
| Heap used | 145MB | < 256MB | OK |
| Heap total | 210MB | < 512MB | OK |
| External | 12MB | < 64MB | OK |
| RSS | 280MB | < 512MB | OK |
| GC pause (p99) | 18ms | < 50ms | OK |

### Leak Detection

```bash
# Take heap snapshots at T+0, T+30min, T+60min under constant load
node --inspect apps/api/dist/main.js
# Chrome DevTools > Memory > Heap Snapshot > Compare
```

**Finding:** `EventEmitter` listeners on WebSocket connections not cleaned up on disconnect. 847 detached listeners after 1 hour. Not a critical leak at current scale but will cause issues at >500 concurrent connections.

**Fix:**

```typescript
// Before
socket.on('disconnect', () => {
  // cleanup logic missing
});

// After
socket.on('disconnect', () => {
  socket.removeAllListeners();
  this.activeConnections.delete(socket.id);
});
```

---

## 8. Load Testing Results (k6)

### Test Configuration

```javascript
// k6-config.js
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Sustain
    { duration: '2m', target: 100 },  // Peak
    { duration: '5m', target: 100 },  // Sustain peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### Results Summary

```text
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  /   ________\  |__| \__\ \_____/  v0.47.0

  scenarios: (100.00%) 1 scenario, 100 max VUs, 16m30s max duration

  data_received.........: 245 MB  272 kB/s
  data_sent.............: 18 MB   20 kB/s
  http_req_blocked......: avg=1.2ms   p(95)=3.8ms
  http_req_connecting...: avg=0.8ms   p(95)=2.1ms
  http_req_duration.....: avg=142ms   p(95)=620ms   p(99)=1.4s
  http_req_failed.......: 0.34%   ✓ 112   ✗ 32,488
  http_req_receiving....: avg=2.1ms   p(95)=8.4ms
  http_req_sending......: avg=0.4ms   p(95)=1.2ms
  http_req_waiting......: avg=139ms   p(95)=610ms   p(99)=1.3s
  http_reqs.............: 32,600  36.2/s
  iteration_duration....: avg=1.42s   p(95)=4.8s
  iterations............: 32,600  36.2/s
  vus...................: 1       min=1   max=100
  vus_max...............: 100     min=100 max=100

  ✓ http_req_duration..............: p(95)<1000ms
  ✗ http_req_failed................: 0.34% > 0.01%
```

### Interpretation

| Metric | Result | Target | Status |
| --- | --- | --- | --- |
| Throughput | 36.2 req/s | > 30 req/s | OK |
| p95 latency | 620ms | < 1000ms | OK |
| p99 latency | 1.4s | < 2000ms | OK |
| Error rate | 0.34% | < 1% | OK (but above 0.01% target) |
| Max concurrent users | 100 | 50 (MVP) | OK (2x headroom) |

**Error analysis:** 112 failures occurred during the ramp to 100 VUs. 98 were `503 Service Unavailable` (connection pool exhaustion), 14 were `504 Gateway Timeout` (accounting dashboard under load).

**Fix:** Increase connection pool from 10 to 25 in Prisma datasource. Add connection pooling via PgBouncer for production.

---

## 9. Audit Summary — TaskFlow v2.1.0-rc.3

### Critical Findings (Must Fix Before Beta)

| ID | Finding | Impact | Effort | Priority |
| --- | --- | --- | --- | --- |
| PERF-001 | Dashboard bundle 78KB (recharts inline) | Slow initial load for most-visited page | 2h | P0 |
| PERF-002 | Accounting dashboard p99 = 4.2s | Timeout risk under load | 4h | P0 |
| PERF-003 | N+1 on GET /loads (shipper query) | 26 queries instead of 2 | 1h | P0 |
| PERF-004 | Missing index on loads(tenant_id, status, created_at) | 820ms avg for common query | 0.5h | P0 |

### Important Findings (Fix Before GA)

| ID | Finding | Impact | Effort | Priority |
| --- | --- | --- | --- | --- |
| PERF-005 | WebSocket listener leak on disconnect | Memory growth at scale | 2h | P1 |
| PERF-006 | Connection pool exhaustion at 100 VUs | 503 errors under peak load | 1h | P1 |
| PERF-007 | CLS 0.22 on accounting/invoices | Poor user experience | 2h | P1 |
| PERF-008 | 8 unnecessary `'use client'` directives | 6KB extra client bundle | 1h | P2 |
| PERF-009 | Load Planner LCP 3.4s (Maps iframe) | Slow perceived load | 4h | P2 |
| PERF-010 | audit_logs table missing entity_id index | 2.1s query on 4.2M rows | 0.5h | P1 |

---

## 10. Remediation Priority Matrix

| Priority | Criteria | Timeline | Items |
| --- | --- | --- | --- |
| P0 | Blocks beta launch or causes data issues | This sprint | PERF-001 through PERF-004 |
| P1 | Degrades experience or risks scale issues | Next 2 sprints | PERF-005, 006, 007, 010 |
| P2 | Polish and optimization | Before GA | PERF-008, 009 |

### Estimated Total Remediation Effort

- **P0 items:** 7.5 hours (1 developer, 1 day)
- **P1 items:** 6.5 hours (1 developer, 1 day)
- **P2 items:** 5 hours (1 developer, 0.5 day)
- **Total:** 19 hours (~2.5 developer-days)

---

## Next Audit

- **Scheduled:** Post-remediation (Sprint 13, Week 2)
- **Focus:** Re-validate P0 fixes, load test at 200 VUs, measure Web Vitals on production CDN
