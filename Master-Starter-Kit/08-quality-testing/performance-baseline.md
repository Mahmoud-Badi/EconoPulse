# Performance Baseline Registry

Capture performance baselines for every feature. Measure before and after every change. Fail the build if performance regresses beyond the threshold. No guessing — numbers only.

---

## Baseline Metrics

Every feature that has a measurable performance surface must have baselines for the relevant metrics below.

### API Endpoints

| Metric | What It Measures | Tool | Threshold |
|--------|-----------------|------|-----------|
| p50 response time | Median response under normal load | k6, autocannon | ≤ 200ms |
| p95 response time | 95th percentile (catches tail latency) | k6, autocannon | ≤ 500ms |
| p99 response time | 99th percentile (worst-case non-outlier) | k6, autocannon | ≤ 1000ms |
| Throughput (rps) | Requests per second at target concurrency | k6, autocannon | Project-specific |
| Error rate | % of requests returning 5xx | k6 | ≤ 0.1% |

### Frontend Pages

| Metric | What It Measures | Tool | Threshold |
|--------|-----------------|------|-----------|
| LCP (Largest Contentful Paint) | Perceived load speed | Lighthouse | ≤ 2500ms |
| FID / INP (Interaction to Next Paint) | Input responsiveness | Lighthouse | ≤ 200ms |
| CLS (Cumulative Layout Shift) | Visual stability | Lighthouse | ≤ 0.1 |
| TTI (Time to Interactive) | Page becomes usable | Lighthouse | ≤ 3500ms |
| Total bundle size | JS sent to browser | webpack-bundle-analyzer, next-bundle-analyzer | Project-specific |
| Per-route bundle size | JS for a specific route | next-bundle-analyzer | ≤ 200KB gzipped |

### System-Level

| Metric | What It Measures | Tool | Threshold |
|--------|-----------------|------|-----------|
| Memory usage (RSS) | Process memory under load | k6 + process monitoring | ≤ 512MB (configurable) |
| CPU usage | Sustained CPU during load test | k6 + system monitoring | ≤ 80% |
| Database query time (p95) | Slowest common queries | pg_stat_statements, Prisma metrics | ≤ 100ms |
| Cold start time | Serverless function cold start | Vercel analytics, custom timing | ≤ 1000ms |

---

## How to Capture Baselines

### API Baselines with k6

```javascript
// k6/baseline-api.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // ramp up
    { duration: '1m', target: 10 },   // sustain
    { duration: '10s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<200', 'p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/trips`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  responseTime.add(res.timings.duration);
  sleep(1);
}
```

```bash
# Run and save baseline
k6 run --out json=baselines/api-trips-list.json k6/baseline-api.js

# Extract summary
k6 run --summary-export=baselines/api-trips-list-summary.json k6/baseline-api.js
```

### API Baselines with autocannon

```bash
# Quick baseline capture
npx autocannon -c 10 -d 60 -p 1 --json http://localhost:3000/api/trips \
  > baselines/api-trips-list-autocannon.json

# Output includes p50, p95, p99, throughput, latency distribution
```

### Frontend Baselines with Lighthouse CI

```bash
# Install
npm install -g @lhci/cli

# Capture baseline
lhci collect --url=http://localhost:3000/dashboard \
  --numberOfRuns=3

# Save results
lhci upload --target=filesystem \
  --outputDir=baselines/lighthouse/dashboard
```

```json
// lighthouserc.json — CI configuration
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/dashboard",
        "http://localhost:3000/trips"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### Bundle Size Baselines

```bash
# Next.js bundle analysis
ANALYZE=true npx next build

# Webpack bundle analyzer
npx webpack-bundle-analyzer stats.json -m static -r baselines/bundle-report.html

# Size-limit for per-component tracking
npx size-limit --json > baselines/bundle-sizes.json
```

```json
// .size-limit.js — Track specific bundles
module.exports = [
  { path: '.next/static/chunks/pages/dashboard-*.js', limit: '150 KB', gzip: true },
  { path: '.next/static/chunks/pages/trips-*.js', limit: '120 KB', gzip: true },
  { path: '.next/static/chunks/commons-*.js', limit: '200 KB', gzip: true },
];
```

---

## Baseline Storage Format

Store baselines as JSON in `dev_docs/quality/baselines/`. One file per feature/endpoint.

### Directory Structure

```
dev_docs/quality/baselines/
  api/
    trips-list.baseline.json
    trips-detail.baseline.json
    invoices-create.baseline.json
  pages/
    dashboard.baseline.json
    trips-list.baseline.json
    login.baseline.json
  bundles/
    bundle-sizes.baseline.json
  system/
    memory-under-load.baseline.json
```

### Baseline Entry Format

```json
{
  "feature": "trips-list",
  "type": "api",
  "endpoint": "GET /api/trips",
  "capturedAt": "2026-03-20T14:30:00Z",
  "capturedBy": "developer-name",
  "environment": {
    "node": "22.x",
    "database": "PostgreSQL 16",
    "machineType": "GitHub Actions ubuntu-latest / 2-core"
  },
  "metrics": {
    "p50ResponseMs": 45,
    "p95ResponseMs": 120,
    "p99ResponseMs": 280,
    "throughputRps": 450,
    "errorRatePercent": 0
  },
  "thresholds": {
    "p50ResponseMs": 200,
    "p95ResponseMs": 500,
    "p99ResponseMs": 1000,
    "errorRatePercent": 0.1
  },
  "notes": "Baseline captured with 10 concurrent users, 1000 seed records in trips table"
}
```

---

## Regression Detection

### Compare Script

```typescript
// scripts/check-performance-regression.ts
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface Baseline {
  feature: string;
  type: string;
  metrics: Record<string, number>;
  thresholds: Record<string, number>;
}

const REGRESSION_THRESHOLD = 0.10; // 10% regression triggers failure

function checkRegression(baselineDir: string, currentDir: string): void {
  const baselineFiles = readdirSync(baselineDir, { recursive: true })
    .filter(f => String(f).endsWith('.baseline.json'));

  let failures = 0;

  for (const file of baselineFiles) {
    const baselinePath = join(baselineDir, String(file));
    const currentPath = join(currentDir, String(file));

    const baseline: Baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));

    let current: Baseline;
    try {
      current = JSON.parse(readFileSync(currentPath, 'utf-8'));
    } catch {
      console.warn(`SKIP: No current data for ${file}`);
      continue;
    }

    for (const [metric, baselineValue] of Object.entries(baseline.metrics)) {
      const currentValue = current.metrics[metric];
      if (currentValue === undefined) continue;

      // For response times and sizes: higher is worse
      // For throughput: lower is worse
      const isHigherWorse = !metric.toLowerCase().includes('throughput');
      const regressed = isHigherWorse
        ? currentValue > baselineValue * (1 + REGRESSION_THRESHOLD)
        : currentValue < baselineValue * (1 - REGRESSION_THRESHOLD);

      if (regressed) {
        const change = ((currentValue - baselineValue) / baselineValue * 100).toFixed(1);
        console.error(
          `REGRESSION: ${baseline.feature} — ${metric}: ` +
          `${baselineValue} → ${currentValue} (${change}% change, threshold: ${REGRESSION_THRESHOLD * 100}%)`
        );
        failures++;
      }
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} performance regression(s) detected.`);
    process.exit(1);
  } else {
    console.log('No performance regressions detected.');
  }
}

checkRegression(
  process.argv[2] || 'dev_docs/quality/baselines',
  process.argv[3] || 'dev_docs/quality/current'
);
```

### CI Integration

```yaml
# .github/workflows/performance.yml
name: Performance Regression Check

on:
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: pnpm install

      - name: Start application
        run: pnpm dev &
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 30000

      - name: Run API performance tests
        run: |
          npx autocannon -c 10 -d 30 --json http://localhost:3000/api/trips \
            > dev_docs/quality/current/api/trips-list.baseline.json

      - name: Run Lighthouse
        run: |
          lhci collect --url=http://localhost:3000/dashboard --numberOfRuns=3
          lhci upload --target=filesystem --outputDir=dev_docs/quality/current/pages

      - name: Check for regressions
        run: npx tsx scripts/check-performance-regression.ts

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: performance-results
          path: dev_docs/quality/current/
```

---

## Baseline Update Protocol

Baselines are NOT auto-updated. They are intentional snapshots.

### When to Update a Baseline

| Scenario | Action |
|----------|--------|
| Bug fix improves performance | Update baseline to new (better) value |
| Feature adds necessary complexity | Update baseline with justification |
| Infrastructure upgrade (faster DB, bigger instance) | Update baseline to reflect new environment |
| Random fluctuation | Do NOT update — investigate first |

### Update Process

1. **Justify** — Document why the baseline is changing in the commit message
2. **Review** — Baseline updates require PR review (they weaken the safety net if wrong)
3. **Archive** — Copy old baseline to `baselines/archive/` with timestamp before overwriting
4. **Update** — Write new baseline file with updated `capturedAt` and `notes`
5. **Verify** — Run regression check against new baseline to confirm it passes

```bash
# Archive old baseline
cp baselines/api/trips-list.baseline.json \
   baselines/archive/api/trips-list.baseline.2026-03-20.json

# Capture new baseline
npx autocannon -c 10 -d 60 --json http://localhost:3000/api/trips \
  > baselines/api/trips-list.baseline.json
```

---

## Baseline Entry Template

```json
{
  "feature": "{{FEATURE_NAME}}",
  "type": "{{BASELINE_TYPE}}",
  "endpoint": "{{HTTP_METHOD}} {{API_PATH}}",
  "capturedAt": "{{CAPTURE_TIMESTAMP}}",
  "capturedBy": "{{DEVELOPER_NAME}}",
  "environment": {
    "node": "{{NODE_VERSION}}",
    "database": "{{DATABASE_TYPE}} {{DATABASE_VERSION}}",
    "machineType": "{{MACHINE_DESCRIPTION}}"
  },
  "metrics": {
    "p50ResponseMs": 0,
    "p95ResponseMs": 0,
    "p99ResponseMs": 0,
    "throughputRps": 0,
    "errorRatePercent": 0
  },
  "thresholds": {
    "p50ResponseMs": {{P50_THRESHOLD}},
    "p95ResponseMs": {{P95_THRESHOLD}},
    "p99ResponseMs": {{P99_THRESHOLD}},
    "errorRatePercent": {{ERROR_RATE_THRESHOLD}}
  },
  "notes": "{{BASELINE_NOTES}}"
}
```

---

## Integration with Phase Gates

At each phase gate:

- [ ] Performance baselines exist for all new API endpoints in this phase
- [ ] Performance baselines exist for all new pages in this phase
- [ ] Bundle size baselines are updated if new routes were added
- [ ] No performance regressions detected against existing baselines
- [ ] Any baseline updates have documented justification
