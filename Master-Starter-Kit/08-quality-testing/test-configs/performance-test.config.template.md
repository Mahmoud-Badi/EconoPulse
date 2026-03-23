# Performance Testing Configuration — {{PROJECT_NAME}}

> **Purpose:** Define performance budgets, configure automated performance testing, and set up load testing for APIs. Performance is a feature — treat it like one.

---

## 1. Performance Budgets

### Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < {{LCP_TARGET}} | Time to render the largest visible element |
| **FID** (First Input Delay) | < 100ms | Time from user interaction to browser response |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability score |
| **TTFB** (Time to First Byte) | < 600ms | Server response time |
| **FCP** (First Contentful Paint) | < 1.8s | Time to first meaningful render |

### Bundle Size Budgets

| Asset | Budget | Measured By |
|-------|--------|-------------|
| JavaScript (initial) | < {{PERFORMANCE_BUDGET_JS}} | Gzipped size of entry bundle |
| CSS (initial) | < {{PERFORMANCE_BUDGET_CSS}} | Gzipped size of CSS bundle |
| Total page weight | < 500KB | All assets for initial load |
| Individual route chunk | < 50KB | Per-route code-split bundle |
| Images (per image) | < 200KB | After optimization + responsive sizing |

### Lighthouse Score Targets

| Category | Minimum Score |
|----------|--------------|
| Performance | {{LIGHTHOUSE_MIN_SCORE}} |
| Accessibility | 95 |
| Best Practices | 95 |
| SEO | 90 |

---

## 2. Lighthouse CI Configuration

Use the `lighthouse-ci.config.template.json` in this directory. Copy it to your project root as `lighthouserc.json` and resolve placeholders.

### Running Lighthouse CI

```bash
# Install
npm install -g @lhci/cli

# Run locally
lhci autorun

# Run in CI (add to GitHub Actions)
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

### CI Integration (GitHub Actions)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g @lhci/cli
      - run: npm ci && npm run build
      - run: lhci autorun
```

---

## 3. Bundle Size Monitoring

<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
### Next.js Bundle Analysis

```bash
# Install
{{PKG_MANAGER}} add -D @next/bundle-analyzer

# Add to next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  // your existing config
});

export default config;

# Run analysis
ANALYZE=true {{BUILD_CMD}}
```
<!-- ENDIF -->

### Size Limit (Framework-Agnostic)

```bash
# Install
{{PKG_MANAGER}} add -D size-limit @size-limit/preset-app

# Add to package.json
"size-limit": [
  {
    "path": "dist/**/*.js",
    "limit": "{{PERFORMANCE_BUDGET_JS}}"
  }
],
"scripts": {
  "size": "size-limit",
  "size:check": "size-limit --check"
}
```

Add `size:check` to your CI pipeline to fail builds that exceed budgets.

---

## 4. API Load Testing (k6)

Use the `k6-load-test.template.js` in this directory. It provides a ready-to-run load test template.

### Running k6

```bash
# Install k6 (https://k6.io/docs/getting-started/installation/)
# macOS: brew install k6
# Windows: choco install k6
# Linux: snap install k6

# Run load test
k6 run k6-load-test.js

# Run with custom options
k6 run --vus 50 --duration 5m k6-load-test.js

# Run with HTML report
k6 run --out json=results.json k6-load-test.js
```

### Load Test Scenarios

| Scenario | Virtual Users | Duration | Purpose |
|----------|--------------|----------|---------|
| Smoke test | 1-2 | 1 min | Verify endpoints work under load |
| Average load | 10-20 | 5 min | Simulate normal traffic |
| Stress test | 50-100 | 10 min | Find breaking point |
| Spike test | 1→100→1 | 3 min | Test auto-scaling response |
| Soak test | 20 | 30 min | Find memory leaks, connection pool issues |

### Performance Thresholds

```javascript
// In k6 script
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],      // Less than 1% failure rate
    http_reqs: ['rate>100'],             // At least 100 requests/second
  },
};
```

---

## 5. Database Query Performance

### Slow Query Detection

```sql
-- PostgreSQL: Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 100; -- Log queries > 100ms
SELECT pg_reload_conf();

-- Find slowest queries
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

### N+1 Query Detection

<!-- IF {{ORM}} == "prisma" -->
```bash
# Enable Prisma query logging
# In your Prisma client initialization:
const prisma = new PrismaClient({
  log: ['query', 'warn', 'error'],
});

# Watch for repeated similar queries in the log output
```
<!-- ENDIF -->

<!-- IF {{ORM}} == "drizzle" -->
```typescript
// Enable Drizzle query logging
const db = drizzle(client, { logger: true });

// Watch for N+1 patterns: a query inside a loop
```
<!-- ENDIF -->

### Query Performance Targets

| Query Type | Target | Action If Exceeded |
|-----------|--------|-------------------|
| Simple lookup (by ID) | < 5ms | Check index exists |
| List with pagination | < 50ms | Add composite index |
| Complex join (3+ tables) | < 100ms | Consider denormalization |
| Full-text search | < 200ms | Use dedicated search engine |
| Aggregate/report | < 500ms | Cache results, run async |

---

## 6. CI Pipeline Integration

Add performance checks to your CI pipeline so regressions are caught before merge:

```yaml
# Add to your existing CI workflow
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: {{PKG_MANAGER}} install
      - run: {{BUILD_CMD}}

      # Bundle size check
      - run: {{PKG_MANAGER}} run size:check

      # Lighthouse CI
      - run: npm install -g @lhci/cli && lhci autorun

      # API smoke test (optional, needs running server)
      # - run: k6 run --vus 2 --duration 30s test/performance/smoke.js
```

**Rule:** Performance checks should **warn** on PRs but only **fail** for severe regressions (> 20% budget overrun). Minor fluctuations are normal.

---

*Generated by the Master Starter Kit. Update targets as the project matures — early projects can have looser budgets.*
