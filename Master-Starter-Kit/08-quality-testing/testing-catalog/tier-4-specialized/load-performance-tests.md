# Load & Performance Tests

## What It Is

Load and performance testing measures how your application behaves under realistic and extreme traffic conditions — not just whether it works, but whether it works *fast enough* when hundreds or thousands of users hit it simultaneously. This covers response time under concurrent load, throughput ceilings, memory behavior during sustained traffic, database query degradation as data volumes grow, and frontend rendering performance against Core Web Vitals budgets. The goal is to find the exact point where your system degrades, understand why, and fix it before users experience it in production.

---

## What It Catches

- **Response time degradation under concurrency** — API that responds in 50ms for 1 user takes 3 seconds when 200 users hit it simultaneously because of database connection pool exhaustion
- **Memory leaks during sustained traffic** — Node.js process grows from 150MB to 2GB over 4 hours of steady load because event listeners are registered but never cleaned up
- **Database query performance cliff** — Query runs in 5ms with 1,000 rows but takes 12 seconds with 500,000 rows because of a missing index on a JOIN column
- **Frontend rendering bottlenecks** — LCP at 4.8 seconds because a 2MB hero image loads before any above-the-fold content, or CLS of 0.35 because a web font swap shifts the entire page layout
- **Third-party service bottlenecks** — Stripe webhook processing blocks the main thread, causing all other API routes to queue behind it
- **Connection pool starvation** — 20 database connections shared across 500 concurrent requests, with long-running report queries holding connections for 30+ seconds
- **CDN cache miss storms** — After a deployment invalidates all caches, the origin server gets hammered by thousands of simultaneous requests for static assets
- **Throughput ceiling discovery** — The system handles 800 requests/second but falls off a cliff at 850, returning 502s because the reverse proxy queue overflows
- **Garbage collection pauses** — Under sustained load, V8 GC stop-the-world pauses cause periodic 200ms+ response time spikes every 30 seconds
- **Hot path inefficiencies** — A middleware that runs on every request does a synchronous JSON.parse of a 50KB config file, adding 15ms to every single response

---

## When It's Required

Run load/performance tests when **any** of these apply:

| Condition | Why |
|-----------|-----|
| Your app will serve more than ~50 concurrent users | Single-user performance tells you nothing about concurrent behavior |
| You have real-time features (WebSockets, SSE, polling) | Connection-based features scale differently than stateless HTTP |
| You're launching publicly or running a marketing campaign | Traffic spikes are unpredictable and unforgiving |
| Database tables will exceed 100K rows within 6 months | Query plans change dramatically at different data volumes |
| You have SLAs or performance guarantees in contracts | You need proof you can meet them, not hope |
| You're deploying to serverless/auto-scaling infrastructure | Cold starts, scaling lag, and concurrency limits create unique failure modes |
| You process financial transactions or real-time data | Latency directly impacts revenue or data accuracy |
| You've never run load tests before (legacy project) | You don't know your baseline — that's the most dangerous state |

**Skip when:** Internal tool with <10 users, prototype/MVP that won't face real traffic for months, static sites with no dynamic backend.

---

## Setup Guide

### Backend Load Testing with k6

k6 is a modern load testing tool written in Go that uses JavaScript for test scripts. It's fast, scriptable, and produces excellent metrics.

**Install:**

```bash
# macOS
brew install k6

# Windows
choco install k6

# Docker (CI-friendly)
docker run --rm -i grafana/k6 run - <script.js

# npm wrapper (for package.json scripts)
npm install -D @grafana/k6
```

**Project structure:**

```
tests/
  load/
    scripts/
      smoke.js           # Quick 1-minute baseline
      average-load.js     # Typical traffic pattern
      stress.js           # Find the breaking point
      spike.js            # Sudden traffic surge
      soak.js             # Sustained load over hours
    data/
      users.json          # Test user credentials
      payloads.json       # Realistic request bodies
    thresholds.json       # Pass/fail criteria
    k6.config.js          # Shared configuration
```

### Frontend Performance with Lighthouse CI

```bash
npm install -D @lhci/cli

# Add to package.json
# "scripts": {
#   "lhci": "lhci autorun"
# }
```

Create `lighthouserc.js` at project root:

```js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/settings',
      ],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // or your own LHCI server
    },
  },
};
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **k6** | Backend load testing, CI integration | JavaScript scripts, Go engine, excellent metrics |
| **Artillery** | Node.js-native load testing | YAML config, good for quick setup |
| **Gatling** | JVM-based enterprise load testing | Scala DSL, excellent reporting |
| **Apache JMeter** | Complex protocol testing (SOAP, JMS, LDAP) | GUI-heavy, harder to version control |
| **Lighthouse CI** | Frontend Core Web Vitals | Google's own tool, integrates with CI |
| **WebPageTest** | Deep frontend analysis | Waterfall charts, filmstrip views |
| **autocannon** | Quick Node.js HTTP benchmarking | npm install, instant results |

---

## Template

### k6 — Average Load Test

```js
// tests/load/scripts/average-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users over 2 min
    { duration: '5m', target: 50 },   // Hold at 50 users for 5 min
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Hold at 100 users for 5 min
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],

  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],  // 95th < 500ms, 99th < 1.5s
    http_req_failed: ['rate<0.01'],                    // <1% error rate
    errors: ['rate<0.05'],                              // Custom error metric
    login_duration: ['p(95)<800'],                      // Login specifically < 800ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Simulated user data
const credentials = JSON.parse(open('../data/users.json'));

export default function () {
  // 1. Login
  const loginStart = Date.now();
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: credentials[Math.floor(Math.random() * credentials.length)].email,
    password: 'test-password-123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  loginDuration.add(Date.now() - loginStart);

  const loginSuccess = check(loginRes, {
    'login returns 200': (r) => r.status === 200,
    'login returns token': (r) => JSON.parse(r.body).token !== undefined,
  });

  errorRate.add(!loginSuccess);
  if (!loginSuccess) return;

  const token = JSON.parse(loginRes.body).token;
  const authHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  sleep(1); // Think time between actions

  // 2. Fetch dashboard (most common page)
  const dashRes = http.get(`${BASE_URL}/api/dashboard`, authHeaders);
  check(dashRes, {
    'dashboard returns 200': (r) => r.status === 200,
    'dashboard has data': (r) => JSON.parse(r.body).widgets !== undefined,
  });

  sleep(2);

  // 3. Search (common action, hits database hard)
  const searchRes = http.get(
    `${BASE_URL}/api/search?q=test&page=1&limit=20`,
    authHeaders
  );
  check(searchRes, {
    'search returns 200': (r) => r.status === 200,
    'search returns results': (r) => JSON.parse(r.body).results.length >= 0,
  });

  sleep(1);

  // 4. Create an item (write operation)
  const createRes = http.post(`${BASE_URL}/api/items`, JSON.stringify({
    name: `Load test item ${Date.now()}`,
    description: 'Created during load test',
  }), authHeaders);

  check(createRes, {
    'create returns 201': (r) => r.status === 201,
  });

  sleep(Math.random() * 3 + 1); // Random think time 1-4 seconds
}
```

### k6 — Spike Test

```js
// tests/load/scripts/spike.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },    // Normal load
    { duration: '30s', target: 500 },   // Sudden spike to 500 users
    { duration: '2m', target: 500 },    // Hold the spike
    { duration: '30s', target: 10 },    // Spike drops off
    { duration: '2m', target: 10 },     // Recovery period
    { duration: '1m', target: 0 },      // Ramp down
  ],

  thresholds: {
    http_req_duration: ['p(95)<3000'],   // Relaxed during spike
    http_req_failed: ['rate<0.10'],       // Allow up to 10% errors during spike
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  const dashRes = http.get(`${BASE_URL}/api/dashboard`);
  check(dashRes, {
    'dashboard loads': (r) => r.status === 200 || r.status === 429,
  });

  sleep(1);
}
```

### k6 — Soak Test

```js
// tests/load/scripts/soak.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 50 },     // Ramp up
    { duration: '4h', target: 50 },      // Sustain for 4 hours
    { duration: '5m', target: 0 },       // Ramp down
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'],     // Must stay fast the whole time
    http_req_failed: ['rate<0.01'],       // <1% failure over entire duration
  },
};

// Purpose: Find memory leaks, connection leaks, log file growth,
// database connection pool exhaustion, and gradual degradation.
// Compare response times at hour 1 vs hour 4.

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/dashboard`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(2);
}
```

### Lighthouse CI — Performance Budget

```js
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/login',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/items/1',  // Dynamic route with data
      ],
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'ready on',
      numberOfRuns: 5,  // 5 runs per URL for statistical significance
      settings: {
        preset: 'desktop',  // Also test with 'mobile' throttling
      },
    },
    assert: {
      assertions: {
        // Core Web Vitals (hard fail)
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Additional metrics (warnings)
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],

        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],   // 300KB JS max
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }],     // 500KB images max
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 10 }],  // Max 10 third-party requests
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### package.json Scripts

```json
{
  "scripts": {
    "test:load:smoke": "k6 run tests/load/scripts/smoke.js",
    "test:load:average": "k6 run tests/load/scripts/average-load.js",
    "test:load:stress": "k6 run tests/load/scripts/stress.js",
    "test:load:spike": "k6 run tests/load/scripts/spike.js",
    "test:load:soak": "k6 run tests/load/scripts/soak.js",
    "test:perf": "lhci autorun",
    "test:perf:mobile": "lhci autorun --collect.settings.preset=mobile"
  }
}
```

---

## Common Pitfalls

### 1. Testing from the same machine as the server
**Problem:** Your load test and your app compete for CPU, memory, and network bandwidth. Results are meaningless.
**Fix:** Run k6 from a separate machine, or at minimum a separate container. In CI, use a dedicated load-testing step that targets a deployed staging environment, not localhost.

### 2. Unrealistic test data
**Problem:** Testing with 3 users and 10 database rows. Everything is fast because the entire dataset fits in a single database page cache.
**Fix:** Seed your test database with production-like volumes. If production has 500K users and 2M orders, your load test database should have similar scale. Use k6's `SharedArray` or a data generation script.

### 3. Ignoring think time
**Problem:** k6 fires requests as fast as possible with no `sleep()`. This simulates a DDoS attack, not real users. You'll hit unrealistic throughput numbers that tell you nothing about actual user experience.
**Fix:** Add `sleep()` between requests to simulate real user behavior (reading a page, filling a form). Use `sleep(Math.random() * 3 + 1)` for randomized think times.

### 4. Only testing happy paths
**Problem:** Load test hits the same cached endpoint over and over. Real traffic includes search queries, filtered lists, paginated results, and error flows — all with different performance characteristics.
**Fix:** Create scenarios that mix read-heavy and write-heavy operations. Include search with varying query complexity, pagination at different offsets, and operations that trigger background jobs.

### 5. Running Lighthouse once and calling it done
**Problem:** Frontend performance varies run-to-run. A single Lighthouse score is statistically meaningless.
**Fix:** Run at least 3-5 times per URL and look at the median. LHCI does this automatically with `numberOfRuns`.

### 6. Performance budgets set after the fact
**Problem:** You run Lighthouse, see LCP at 3.2 seconds, and set the budget to 3.5 seconds. This isn't a budget — it's a rubber stamp.
**Fix:** Set budgets based on user experience goals before you measure. Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1, FID < 100ms) are evidence-based starting points.

### 7. Not comparing soak test metrics over time
**Problem:** You run a 4-hour soak test and see that the average response time is 200ms. But you don't notice that it was 100ms in hour 1 and 400ms in hour 4.
**Fix:** Graph response times over the duration of the soak test. Look for upward trends. Export k6 results to Grafana or use k6 Cloud for time-series visualization.

### 8. Load testing against production
**Problem:** Your load test creates thousands of fake users, orders, and transactions in the production database.
**Fix:** Always use a staging environment that mirrors production infrastructure but has isolated data. If you must test against production (for CDN cache behavior, etc.), use read-only endpoints and clean up after.

---

## Proof Artifact

A load/performance test pass produces these artifacts:

### k6 Output (terminal summary)
```
     ✓ login returns 200
     ✓ login returns token
     ✓ dashboard returns 200
     ✓ search returns 200

     checks.........................: 100.00% ✓ 12840  ✗ 0
     data_received..................: 45 MB   150 kB/s
     data_sent......................: 3.2 MB  11 kB/s
     errors.........................: 0.00%   ✓ 0      ✗ 3210
     http_req_duration..............: avg=124ms  min=23ms  med=98ms  max=890ms  p(90)=245ms  p(95)=378ms  p(99)=654ms
   ✓ { p(95)<500 }
   ✓ { p(99)<1500 }
     http_req_failed................: 0.00%   ✓ 0      ✗ 12840
     login_duration.................: avg=210ms  min=89ms  med=178ms max=780ms  p(95)=445ms
     iterations.....................: 3210    10.7/s
     vus............................: 100     min=0    max=100
     vus_max........................: 100     min=100  max=100
```

### Lighthouse CI Output
```
✅  http://localhost:3000/ : performance=94, accessibility=98, best-practices=100, seo=92
✅  http://localhost:3000/dashboard : performance=91, accessibility=96, best-practices=100, seo=89
⚠️  http://localhost:3000/items/1 : performance=87 [warning: FCP 1950ms > 1800ms budget]

Assertion results:
✅  largest-contentful-paint: 2180ms < 2500ms
✅  cumulative-layout-shift: 0.04 < 0.1
✅  total-blocking-time: 180ms < 300ms
⚠️  first-contentful-paint: 1950ms > 1800ms [warning]
✅  resource-summary:script:size: 245KB < 300KB
```

### What constitutes a pass:
1. **k6 summary** shows all thresholds passing (green checkmarks on `http_req_duration`, `http_req_failed`, and custom metrics)
2. **Lighthouse CI** shows all `error`-level assertions passing (warnings are acceptable but should be tracked)
3. **Soak test** shows no upward trend in response time or memory usage over the test duration
4. **k6 JSON/CSV export** saved as `tests/load/results/[test-name]-[date].json` for historical comparison
5. **CI pipeline** shows load test step passing with exit code 0
