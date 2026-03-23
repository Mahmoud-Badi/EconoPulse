# Release-Level Verification Gate

The final checkpoint before deploying to production. The Release Gate is the most comprehensive and the least negotiable. Everything that reaches production has passed this gate. If it has not, it does not ship.

---

## When This Gate Applies

Before every production deployment. This includes:
- Major releases (v1.0, v2.0)
- Minor releases (v1.1, v1.2)
- Hotfixes that modify more than a single line of configuration

The only exception: a single-line config change (e.g., environment variable update) may bypass the full gate but must still pass sections 1, 4, and 7.

---

## Prerequisites

Before running the Release Gate:
- [ ] All development phases have passed their [Phase Gates](./phase-gate.md)
- [ ] The release candidate is deployed to a staging environment
- [ ] Staging environment mirrors production (same infrastructure, same data volume, same configuration)
- [ ] The release candidate has been on staging for at least 24 hours (soak time)

---

## Release Gate Checklist

### Section 1: Full E2E Suite on Staging

The complete E2E suite must run against the staging environment — not localhost, not a dev server.

- [ ] **Full E2E suite passes** on the staging environment
- [ ] **E2E tests run against staging URL** (not localhost)
- [ ] **All critical user journeys verified:**
  - [ ] User registration / login / logout
  - [ ] Core CRUD operations for every primary entity
  - [ ] Payment flow (if applicable)
  - [ ] Permission-restricted actions (admin vs. user)
  - [ ] Navigation across all major sections
- [ ] **E2E results captured** as proof artifact (HTML report or JSON)

```bash
# Run E2E against staging
PLAYWRIGHT_BASE_URL=https://staging.example.com npx playwright test
```

### Section 2: Performance Budget Verification

Performance must be verified against the staging environment under realistic conditions.

- [ ] **Lighthouse audit** on key pages meets thresholds:

| Page | Performance | Accessibility | Best Practices | SEO |
|------|------------|---------------|---------------|-----|
| Landing / Home | ≥ 90 | ≥ 95 | ≥ 95 | ≥ 90 |
| Dashboard (authenticated) | ≥ 85 | ≥ 95 | ≥ 95 | N/A |
| List page (50+ records) | ≥ 85 | ≥ 95 | ≥ 95 | N/A |
| Detail page | ≥ 90 | ≥ 95 | ≥ 95 | N/A |
| Form page | ≥ 90 | ≥ 95 | ≥ 95 | N/A |

- [ ] **Load test results** (k6, Artillery, or equivalent) meet thresholds:

| Metric | Threshold | Actual | Status |
|--------|-----------|--------|--------|
| Concurrent users | {{TARGET}} | | |
| Throughput (req/s) | ≥ {{TARGET}} | | |
| Response time p50 | ≤ 100ms | | |
| Response time p95 | ≤ 300ms | | |
| Response time p99 | ≤ 1000ms | | |
| Error rate | < 0.1% | | |
| Memory usage | No leaks over 30min | | |

- [ ] **Core Web Vitals** meet thresholds:

| Metric | Threshold | Actual | Status |
|--------|-----------|--------|--------|
| Largest Contentful Paint (LCP) | ≤ 2.5s | | |
| First Input Delay (FID) | ≤ 100ms | | |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | | |
| First Contentful Paint (FCP) | ≤ 1.8s | | |
| Time to Interactive (TTI) | ≤ 3.5s | | |

- [ ] **Load test report** and **Lighthouse reports** captured as proof artifacts

### Section 3: Security Verification

- [ ] **`npm audit --production`** shows 0 critical and 0 high vulnerabilities
- [ ] **Dependency review** complete for all packages added since last release
- [ ] **OWASP Top 10** checklist verified:
  - [ ] A01: Broken Access Control — role-based access enforced on all endpoints
  - [ ] A02: Cryptographic Failures — sensitive data encrypted at rest and in transit
  - [ ] A03: Injection — all user input parameterized, no string concatenation in queries
  - [ ] A04: Insecure Design — business logic does not allow privilege escalation
  - [ ] A05: Security Misconfiguration — headers set (CORS, CSP, HSTS, X-Frame-Options)
  - [ ] A06: Vulnerable Components — no known vulnerabilities in dependencies
  - [ ] A07: Authentication Failures — rate limiting on login, secure session handling
  - [ ] A08: Data Integrity Failures — no unsigned/unverified deserialization
  - [ ] A09: Logging Failures — security events logged (login attempts, permission denials)
  - [ ] A10: SSRF — no user-controlled URLs passed to server-side fetch without validation
- [ ] **Secrets scan** confirms no API keys, passwords, or credentials in the repository
- [ ] **Security scan output** captured as proof artifact

### Section 4: Smoke Test Suite

A minimal set of tests that verify the most critical paths immediately after deployment. These are defined before release and run on production within minutes of deployment.

- [ ] **Smoke test suite defined** with specific scenarios:

| # | Scenario | Steps | Expected Result |
|---|----------|-------|-----------------|
| 1 | Home page loads | Navigate to / | 200 response, page renders within 3s |
| 2 | Login flow | Enter credentials, submit | Redirect to dashboard, session cookie set |
| 3 | Core entity CRUD | Create, read, update, delete | All operations succeed, data persists |
| 4 | Navigation | Visit all primary nav items | All pages load, no console errors |
| 5 | API health | Call /api/health | 200 response with service status |

- [ ] **Smoke tests pass** on staging
- [ ] **Smoke test script** ready to run on production immediately after deployment
- [ ] **Smoke test output** captured as proof artifact

### Section 5: User Acceptance Testing (UAT)

- [ ] **UAT scenarios defined** covering all user-facing features in this release
- [ ] **UAT conducted** by a stakeholder (not the developer who built the features)
- [ ] **UAT results documented** per scenario:

| # | Scenario | Tester | Result | Notes |
|---|----------|--------|--------|-------|
| 1 | {{SCENARIO}} | {{TESTER}} | PASS / FAIL | |

- [ ] **All UAT scenarios pass** or failures are documented with accepted risk
- [ ] **UAT sign-off** received from stakeholder with date

### Section 6: Compatibility Matrix

- [ ] **Browser testing** completed across required matrix:

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | Latest | ☐ | ☐ | |
| Firefox | Latest | ☐ | N/A | |
| Safari | Latest | ☐ | ☐ (iOS) | |
| Edge | Latest | ☐ | N/A | |

- [ ] **Device testing** completed (if applicable):

| Device | OS | Browser | Status |
|--------|------|---------|--------|
| iPhone 13+ | iOS 16+ | Safari | |
| Samsung Galaxy S21+ | Android 12+ | Chrome | |
| iPad | iPadOS 16+ | Safari | |

- [ ] **Compatibility test results** captured as proof artifact

### Section 7: Visual Regression Baseline

- [ ] **Visual regression baseline updated** for this release
- [ ] **All pages screenshotted** at desktop (1440px) and mobile (375px)
- [ ] **Baseline committed** to the repository
- [ ] **No unexpected visual diffs** from the previous release baseline

### Section 8: Rollback Plan

- [ ] **Rollback procedure documented:**
  - [ ] Step-by-step instructions to revert to the previous release
  - [ ] Database rollback procedure (if migrations were applied)
  - [ ] Cache invalidation steps (if applicable)
  - [ ] DNS/CDN revert steps (if applicable)
- [ ] **Rollback tested** — the previous version was deployed to staging and verified working
- [ ] **Rollback time estimate:** {{MINUTES}} minutes from decision to rollback to previous version live
- [ ] **Rollback trigger criteria defined:** what metrics or failures trigger an automatic rollback

### Section 9: Monitoring and Alerting

- [ ] **Error monitoring** configured for new features (Sentry, LogRocket, or equivalent)
- [ ] **Performance monitoring** configured (response time tracking, error rate tracking)
- [ ] **Alert thresholds** set:
  - [ ] Error rate > 1% → page on-call
  - [ ] p95 response time > 500ms → alert
  - [ ] 5xx error count > 10/min → page on-call
  - [ ] Health check failure → page on-call immediately
- [ ] **Dashboard** shows key metrics for the new features
- [ ] **On-call person identified** for the first 24 hours post-deployment

---

## Release Quality Report

```markdown
## Release Quality Report: v{{VERSION}}
**Date:** YYYY-MM-DD
**Release Manager:** {{NAME}}

### Release Contents
- Features: {{LIST}}
- Bug fixes: {{LIST}}
- Infrastructure changes: {{LIST}}

### Gate Results

| Section | Status | Notes |
|---------|--------|-------|
| 1. E2E on Staging | PASS / FAIL | {{DETAILS}} |
| 2. Performance Budget | PASS / FAIL | {{DETAILS}} |
| 3. Security Verification | PASS / FAIL | {{DETAILS}} |
| 4. Smoke Tests | PASS / FAIL | {{DETAILS}} |
| 5. UAT Sign-Off | PASS / FAIL | {{DETAILS}} |
| 6. Compatibility Matrix | PASS / FAIL | {{DETAILS}} |
| 7. Visual Regression | PASS / FAIL | {{DETAILS}} |
| 8. Rollback Plan | PASS / FAIL | {{DETAILS}} |
| 9. Monitoring/Alerting | PASS / FAIL | {{DETAILS}} |

### Test Summary
- Total tests (all types): {{COUNT}}
- Passing: {{COUNT}}
- Failing: 0
- Coverage: {{PCT}}%

### Performance Summary
- Lighthouse Performance (avg): {{SCORE}}
- Load test: {{VUS}} concurrent users, p95={{MS}}ms, error rate={{PCT}}%
- Core Web Vitals: LCP={{S}}s, FID={{MS}}ms, CLS={{SCORE}}

### Security Summary
- npm audit: 0 critical, 0 high
- OWASP Top 10: 10/10 verified
- Secrets scan: clean

### Deployment Plan
- Deploy date/time: YYYY-MM-DD HH:MM UTC
- Deploy method: {{METHOD}}
- Rollback time estimate: {{MINUTES}} min
- On-call: {{NAME}} ({{CONTACT}})
- Smoke test ETA: {{MINUTES}} min post-deploy

### Release Gate Result: PASS / FAIL
**Approved by:** {{NAME}}
**Date:** YYYY-MM-DD
```

---

## Gate Result

### PASS
All 9 sections pass. The release is approved for production deployment. Execute the deployment plan and run the smoke test suite on production within 15 minutes of deploy.

### FAIL
Document every failing section. The release is **NOT approved**. Options:
1. **Fix and re-gate** — resolve failures, re-run affected sections
2. **Partial release** — if failures are isolated to specific features, consider releasing without those features (requires removing them from the release branch, not just ignoring failures)
3. **Delay** — postpone the release until all sections pass

**Never ship a release that has not passed the gate.** The cost of a production incident always exceeds the cost of a delayed release.

---

## Post-Deployment Verification

After the release reaches production, within the first 60 minutes:

- [ ] **Smoke tests pass** on production
- [ ] **Error monitoring** shows no spike in errors
- [ ] **Performance monitoring** shows no degradation
- [ ] **Key user flows verified** manually by on-call person
- [ ] **If any post-deploy check fails:** execute the rollback plan immediately, investigate before re-attempting

---

## Common Release Gate Failures

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| E2E fails on staging but passes locally | Environment differences (env vars, data, network) | Debug against staging, not localhost. Check env var configuration. |
| Performance regression on staging | Feature works fast with small data, slow with production-volume data | Load test with realistic data volumes. Optimize queries, add indexes, implement pagination. |
| UAT scenarios fail | Feature works as specced but not as the stakeholder expected | Gap between spec and stakeholder expectations. Revise spec, rework feature, re-test. |
| Rollback plan not tested | "We'll figure it out if we need to" | Test the rollback on staging before approving the release. An untested rollback plan is not a plan. |
| Monitoring not configured | "We'll add monitoring after launch" | Monitoring must be configured before launch. Post-launch is too late — you cannot detect issues you are not monitoring. |
