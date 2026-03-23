// k6 Load Test Template — {{PROJECT_NAME}}
//
// Usage:
//   k6 run k6-load-test.js                    # Default: 10 VUs, 30s
//   k6 run --vus 50 --duration 5m k6-load-test.js  # Custom load
//
// Install: https://k6.io/docs/getting-started/installation/

import http from "k6/http";
import { check, sleep } from "k6";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const BASE_URL = __ENV.BASE_URL || "http://localhost:{{BACKEND_PORT}}";
const API_PREFIX = "{{API_PREFIX}}";

export const options = {
  // Default scenario: ramp up to 10 users over 30 seconds
  stages: [
    { duration: "10s", target: 5 },   // Ramp up
    { duration: "20s", target: 10 },   // Hold
    { duration: "10s", target: 0 },    // Ramp down
  ],

  // Performance thresholds — test fails if these are not met
  thresholds: {
    http_req_duration: ["p(95)<500"],  // 95th percentile under 500ms
    http_req_failed: ["rate<0.01"],    // Less than 1% failure rate
  },
};

// ---------------------------------------------------------------------------
// Test Scenarios
// ---------------------------------------------------------------------------

export default function () {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    "health: status 200": (r) => r.status === 200,
    "health: response time < 200ms": (r) => r.timings.duration < 200,
  });

  // API endpoint — list (paginated)
  // Replace with your actual list endpoint
  const listRes = http.get(`${BASE_URL}${API_PREFIX}/projects?page=1&limit=20`);
  check(listRes, {
    "list: status 200": (r) => r.status === 200,
    "list: response time < 500ms": (r) => r.timings.duration < 500,
    "list: returns array": (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body.data);
    },
  });

  // API endpoint — single resource
  // Replace with your actual detail endpoint
  // const detailRes = http.get(`${BASE_URL}${API_PREFIX}/projects/KNOWN_ID`);
  // check(detailRes, {
  //   "detail: status 200": (r) => r.status === 200,
  //   "detail: response time < 300ms": (r) => r.timings.duration < 300,
  // });

  // Simulate user think time between requests
  sleep(1);
}

// ---------------------------------------------------------------------------
// Authenticated Requests (uncomment if needed)
// ---------------------------------------------------------------------------

// export function setup() {
//   // Login and get auth token
//   const loginRes = http.post(`${BASE_URL}${API_PREFIX}/auth/login`, JSON.stringify({
//     email: "test@example.com",
//     password: "test-password",
//   }), { headers: { "Content-Type": "application/json" } });
//
//   return { token: JSON.parse(loginRes.body).token };
// }
//
// export default function (data) {
//   const headers = {
//     Authorization: `Bearer ${data.token}`,
//     "Content-Type": "application/json",
//   };
//   // Use headers in your requests
// }
