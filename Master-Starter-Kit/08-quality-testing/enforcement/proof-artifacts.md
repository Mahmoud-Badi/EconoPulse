# Proof Artifacts — What Counts as Evidence

Every test type on the Test Requirements Card must produce a proof artifact before the feature can pass the Feature Gate. This file defines exactly what counts as proof, what does not, and where to store it.

**The rule:** "I ran the tests" is not proof. The console output showing pass/fail counts IS proof. "The UI looks good" is not proof. Screenshots at all breakpoints IS proof.

---

## Artifact Requirements by Test Type

### Tier 1 — Foundation

| Test Type | Acceptable Proof | Unacceptable Proof | Storage Location | Example |
|-----------|-----------------|-------------------|-----------------|---------|
| **Unit Tests** | Console output showing test names, pass/fail counts, and duration. JSON report from `vitest run --reporter=json`. | "All tests pass" with no output. A screenshot of a green checkmark with no detail. | `test-results/unit/` or CI artifact | `42 passed, 0 failed, 0 skipped (1.2s)` with test suite breakdown |
| **Type Checking** | Full `tsc --noEmit` or `pnpm typecheck` output showing `0 errors`. | "TypeScript compiles fine." A partial output showing only the last line. | `test-results/typecheck/` or CI log | `Found 0 errors. Checking X files.` |
| **Linting** | Full `eslint` output showing `0 errors` (warnings acceptable if acknowledged). | "Lint passes." A screenshot of VS Code with no red squiggles. | `test-results/lint/` or CI log | `✓ 142 files checked. 0 errors, 3 warnings.` |
| **Snapshot Tests** | Test output showing snapshot count and pass/fail. Updated snapshots committed with the PR. | "Snapshots are fine." Snapshots updated but not committed. | `test-results/snapshots/` or CI artifact | `Snapshots: 12 passed, 0 updated, 0 failed` |

### Tier 2 — Integration

| Test Type | Acceptable Proof | Unacceptable Proof | Storage Location | Example |
|-----------|-----------------|-------------------|-----------------|---------|
| **Integration Tests** | Test output showing pass/fail per test case. Must show which modules/services were tested together. | "Integration tests pass." Test output that only shows a count with no test names. | `test-results/integration/` | `auth-service + database: 8 passed. trip-router + trip-service: 12 passed.` |
| **API Contract Tests** | Schema comparison output showing 0 breaking changes. Or Zod/JSON Schema validation results. | "API contracts match." A verbal assertion that schemas are aligned. | `test-results/api-contracts/` | `GET /api/trips: response schema matches contract. 0 breaking changes, 0 additions.` |
| **Database Tests** | Migration test output (up and down). Query test results. Constraint violation test results. | "Migrations work." Running `drizzle-kit push` without showing output. | `test-results/database/` | `Migration 0042 UP: success. DOWN: success. Constraint tests: 6 passed.` |
| **Component Integration** | Test output showing multi-component test results. Must test parent-child relationships. | "Components work together." A single component unit test relabeled as "integration." | `test-results/component-integration/` | `TripList + TripCard + TripFilters: 9 passed. Form + Validation + Toast: 7 passed.` |
| **Regression Tests** | Test output showing all regression test cases pass. Must reference the original bug/change. | "No regressions found" without running a regression suite. | `test-results/regression/` | `Regression suite for invoice-editing (ref: BUG-142): 5 passed, 0 failed.` |

### Tier 3 — System

| Test Type | Acceptable Proof | Unacceptable Proof | Storage Location | Example |
|-----------|-----------------|-------------------|-----------------|---------|
| **E2E Tests** | Playwright/Cypress HTML report or console output showing test names and pass/fail. Video recordings for failed tests. | "E2E passes." A single screenshot of one page. | `test-results/e2e/` | Playwright HTML report: `15 passed, 0 failed across 3 browsers` with trace files |
| **Visual Regression** | Screenshot comparison report showing baseline vs. current with diff highlights. New baselines committed. | "It looks the same." A single screenshot without comparison to baseline. | `test-results/visual-regression/` | Percy/Playwright screenshot diff report: `24 comparisons, 0 diffs above threshold` |
| **Accessibility Tests** | axe-core scan results showing violation count per severity. Manual keyboard navigation test results (checklist format). | "Accessible." "I used semantic HTML." Lighthouse accessibility score alone (it misses too much). | `test-results/accessibility/` | `axe-core: 0 critical, 0 serious, 2 moderate (documented), 1 minor. Keyboard nav: all 8 flows verified.` |
| **Cross-Browser Tests** | Test results per browser (minimum: Chromium, Firefox, WebKit). Must show same test suite run across all browsers. | "Works on Chrome." Testing on one browser and claiming cross-browser. | `test-results/cross-browser/` | `Chromium: 15 passed. Firefox: 15 passed. WebKit: 14 passed, 1 skipped (known Safari limitation, documented).` |
| **Responsive Tests** | Screenshots at 375px (mobile), 768px (tablet), 1440px (desktop) for every page. Or Playwright viewport test results. | "Looks good on mobile." One screenshot at one breakpoint. | `test-results/responsive/` | Screenshot set: `trip-list-375.png`, `trip-list-768.png`, `trip-list-1440.png` for each page |
| **Compatibility Tests** | Test matrix showing pass/fail per device/OS/browser combination. | "Works on my machine." | `test-results/compatibility/` | Matrix: `Chrome/Win: PASS, Safari/Mac: PASS, Chrome/Android: PASS, Safari/iOS: PASS` |
| **UAT Tests** | Signed UAT checklist from stakeholder with specific scenario pass/fail. | "The client approved it" without documentation. | `test-results/uat/` | UAT form signed by stakeholder: `8 scenarios tested, 8 passed, sign-off date: YYYY-MM-DD` |

### Tier 4 — Specialized

| Test Type | Acceptable Proof | Unacceptable Proof | Storage Location | Example |
|-----------|-----------------|-------------------|-----------------|---------|
| **Load/Performance** | k6 or Artillery report showing response times at p50/p95/p99, throughput, error rate under load. Lighthouse performance report for frontend. | "It's fast." A single response time measurement. | `test-results/performance/` | `k6: 500 VUs, p95=180ms, p99=340ms, error rate=0.1%. Lighthouse: Performance 94.` |
| **Security Tests** | `npm audit` output (0 critical/high). OWASP checklist with per-item pass/fail. SQL injection test results. XSS test results. | "It's secure." "I followed best practices." | `test-results/security/` | `npm audit: 0 critical, 0 high, 2 moderate (documented). OWASP Top 10: 10/10 pass.` |
| **Chaos Tests** | Test results showing system behavior when dependencies fail. Must show graceful degradation, not crashes. | "The system handles failures." | `test-results/chaos/` | `Database down: API returns 503 with retry-after header (PASS). Redis down: fallback to direct DB queries, 200ms slower (PASS).` |
| **Smoke Tests** | Test output showing critical paths verified post-deploy. Must run against the deployed environment. | "Deployment looks good." Smoke tests run locally against dev. | `test-results/smoke/` | `Staging smoke: login PASS, create-trip PASS, view-invoice PASS, navigation PASS. 4/4 critical paths verified.` |
| **Sanity Tests** | Quick test output showing core functionality intact after a specific change. | "Nothing seems broken." | `test-results/sanity/` | `Post-hotfix sanity: affected module passes all 12 tests. Adjacent modules: 24 tests, 0 regressions.` |
| **Mutation Tests** | Stryker or equivalent report showing mutation score. Must show >80% of mutations killed. | "Tests are thorough." Code coverage percentage alone (coverage does not prove test quality). | `test-results/mutation/` | `Stryker: 412 mutants tested, 348 killed, 64 survived. Score: 84.5%. Survived mutants reviewed.` |
| **Contract Tests (Pact)** | Pact broker verification results showing all consumer contracts satisfied. | "APIs are compatible." | `test-results/contract/` | `Pact: 3 consumers verified. 18 interactions, 18 passed, 0 failed.` |
| **Data Migration Tests** | Before/after record counts. Data integrity check results. Rollback test results. | "Migration ran successfully." | `test-results/migration/` | `Pre-migration: 14,302 records. Post-migration: 14,302 records. Integrity: all FK constraints valid. Rollback: clean reversal, 0 data loss.` |
| **i18n Tests** | Rendering test results per locale. RTL layout screenshots. Date/number format verification per locale. | "Translations are in." | `test-results/i18n/` | `en-US: 42 strings rendered. es-MX: 42 strings rendered. ar-SA: RTL layout verified (screenshots). Date formats: locale-correct in all 3.` |
| **State Recovery Tests** | Test results showing recovery from crash, refresh, reconnect, session expiry. Must show data is not lost. | "The app recovers." | `test-results/state-recovery/` | `Mid-form refresh: draft restored from localStorage (PASS). Session expiry: redirect to login, return to previous page after re-auth (PASS).` |
| **Rate Limit Tests** | Test results showing rate limits enforced at configured thresholds. 429 response body verified. Retry-after header present. | "Rate limiting works." | `test-results/rate-limit/` | `100 requests in 10s: first 60 return 200, remaining 40 return 429 with retry-after: 30. Client shows "too many requests" message (PASS).` |

---

## General Rules

1. **Timestamps matter.** Every proof artifact must have a date/time that corresponds to the current version of the code. A test report from last week against an old commit is not valid proof for the current feature.

2. **CI artifacts are preferred.** Proof from an automated CI pipeline is stronger than proof from a local machine run, because CI runs in a clean environment with no local state.

3. **Failed-then-fixed is valid.** If a test run shows failures and the next run (after fixes) shows all passing, both runs together constitute valid proof. It shows the tests actually catch things.

4. **Screenshots need context.** A screenshot without a URL bar, viewport size indicator, or identifying information is ambiguous. Always capture the full browser window or include metadata.

5. **Store artifacts in the repository or CI.** Proof that exists only on a developer's local machine is proof that can disappear. Commit artifacts to the repo (in `test-results/`) or link to CI build artifacts.

6. **One artifact per test type per feature.** Do not bundle all proof into a single "test report." Each test type on the Test Requirements Card needs its own artifact link.

---

## Quick Reference: Minimum Proof Per Complexity

| Complexity | Characteristics | Test Types Required | Proof Artifacts Required |
|-----------|----------------|-------------------|------------------------|
| Simple (1-3) | Basic logic + UI | 4-8 | Unit output, typecheck log, lint log, E2E report |
| Medium (4-7) | CRUD + auth + API | 8-15 | All of above + integration output, API contract, security scan, accessibility scan |
| Complex (8-11) | Multi-service + perf + security | 15-22 | All of above + load test report, chaos test results, cross-browser matrix |
| Critical (12+) | Money + external + distributed | 22+ | Nearly all test types, each with individual proof artifact |
