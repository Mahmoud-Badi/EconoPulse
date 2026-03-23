# Release Checklist

> **Purpose:** Pre-release verification checklist for {{PROJECT_NAME}}.
> Every item must be verified before a release goes to production. No exceptions, no "we'll fix it after release."
> This checklist is the final gate between staging and production.

---

## How to Use This Checklist

1. **Before release:** Copy this template to `dev_docs/releases/release-{{VERSION}}.md`
2. **Fill in:** Check each item, record who verified it and when
3. **Gate rule:** ALL Critical and High items must pass. Medium items must be acknowledged (pass or documented exception).
4. **Sign-off:** Tech lead and product owner both sign off before deployment begins.

---

## Release Metadata

| Field | Value |
|-------|-------|
| **Release version** | {{VERSION}} |
| **Release date** | {{RELEASE_DATE}} |
| **Release type** | Major / Minor / Patch / Hotfix |
| **Release manager** | {{RELEASE_MANAGER}} |
| **Tech lead sign-off** | {{TECH_LEAD}} — [ ] Approved |
| **Product owner sign-off** | {{PRODUCT_OWNER}} — [ ] Approved |

---

## 1. Tests

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| T1 | All unit tests pass (`{{UNIT_TEST_COMMAND}}`) | Critical | [ ] | | |
| T2 | All integration tests pass (`{{INTEGRATION_TEST_COMMAND}}`) | Critical | [ ] | | |
| T3 | All E2E tests pass (`{{E2E_TEST_COMMAND}}`) | Critical | [ ] | | |
| T4 | Code coverage meets threshold (≥{{COVERAGE_THRESHOLD}}%) | High | [ ] | | |
| T5 | No flaky tests in the last {{FLAKY_TEST_WINDOW}} runs | Medium | [ ] | | |
| T6 | New features have test coverage for all acceptance criteria | High | [ ] | | |
| T7 | Regression test suite passes (critical user flows) | Critical | [ ] | | |

---

## 2. Bugs

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| B1 | No open P0 (critical) bugs | Critical | [ ] | | |
| B2 | No open P1 (high) bugs | Critical | [ ] | | |
| B3 | All P2 (medium) bugs reviewed — accepted or deferred with justification | High | [ ] | | |
| B4 | Known issues documented in release notes | Medium | [ ] | | |
| B5 | Bug fix PRs all merged and deployed to staging | Critical | [ ] | | |

---

## 3. Performance

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| P1 | API response times meet targets (p50 < {{P50_TARGET_MS}}ms, p95 < {{P95_TARGET_MS}}ms, p99 < {{P99_TARGET_MS}}ms) | Critical | [ ] | | |
| P2 | Page load time (LCP) < {{LCP_TARGET_MS}}ms on {{TEST_CONNECTION}} | High | [ ] | | |
| P3 | Database query performance — no queries > {{SLOW_QUERY_THRESHOLD_MS}}ms | High | [ ] | | |
| P4 | Load test passed — {{CONCURRENT_USERS}} concurrent users, {{RPS_TARGET}} req/sec sustained for {{LOAD_TEST_DURATION_MINUTES}} min | High | [ ] | | |
| P5 | Memory usage stable under load (no leaks observed over {{LEAK_TEST_DURATION_MINUTES}} min) | High | [ ] | | |
| P6 | Bundle size within budget (JS: < {{JS_BUNDLE_SIZE_KB}}KB gzipped) | Medium | [ ] | | |
| P7 | Core Web Vitals pass (CLS < 0.1, FID < 100ms, LCP < 2.5s) | Medium | [ ] | | |

---

## 4. Security

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| S1 | Dependency vulnerability scan clean — no critical/high CVEs (`{{SECURITY_SCAN_COMMAND}}`) | Critical | [ ] | | |
| S2 | OWASP Top 10 checklist reviewed for new features | High | [ ] | | |
| S3 | Authentication flows tested (login, logout, session expiry, token refresh) | Critical | [ ] | | |
| S4 | Authorization tested — permission matrix verified for new endpoints | Critical | [ ] | | |
| S5 | No secrets in codebase (scanned with `{{SECRET_SCAN_TOOL}}`) | Critical | [ ] | | |
| S6 | CORS configuration verified for production domain | High | [ ] | | |
| S7 | Rate limiting configured and tested for public endpoints | High | [ ] | | |
| S8 | CSP headers configured and tested | Medium | [ ] | | |
| S9 | SSL/TLS certificate valid and not expiring within 30 days | High | [ ] | | |

---

## 5. Compliance

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| C1 | Audit logging verified — all auditable events captured per event catalog | High | [ ] | | |
| C2 | PII/PHI handling verified per data classification in event catalog | High | [ ] | | |
| C3 | Data retention policies enforced (no data stored beyond retention period) | Medium | [ ] | | |
| C4 | Privacy policy updated if data collection changed | Medium | [ ] | | |
| C5 | Terms of service updated if features changed | Medium | [ ] | | |
| C6 | Accessibility audit passed (WCAG {{WCAG_LEVEL}} compliance) | High | [ ] | | |
<!-- IF {{COMPLIANCE_FRAMEWORK}} == "HIPAA" -->
| C7 | HIPAA BAA in place for all third-party services handling PHI | Critical | [ ] | | |
| C8 | PHI encryption at rest and in transit verified | Critical | [ ] | | |
<!-- ENDIF -->
<!-- IF {{COMPLIANCE_FRAMEWORK}} == "SOC2" -->
| C7 | SOC 2 control evidence collected for this release | High | [ ] | | |
<!-- ENDIF -->

---

## 6. Feature Flags

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| F1 | New features behind feature flags (if applicable) | High | [ ] | | |
| F2 | Feature flag default states configured for production | High | [ ] | | |
| F3 | Feature flag rollout plan documented (% rollout schedule) | Medium | [ ] | | |
| F4 | Kill switch tested — turning off a flag disables the feature cleanly | High | [ ] | | |
| F5 | Old feature flags cleaned up — flags from releases older than {{FLAG_CLEANUP_RELEASES}} removed | Medium | [ ] | | |

---

## 7. Rollback Plan

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| R1 | Rollback procedure documented (step-by-step) | Critical | [ ] | | |
| R2 | Database migration is reversible (down migration tested) | Critical | [ ] | | |
| R3 | Previous version image/artifact available and deployable | Critical | [ ] | | |
| R4 | Rollback tested in staging | High | [ ] | | |
| R5 | Rollback decision criteria defined (what triggers a rollback) | High | [ ] | | |
| R6 | Rollback communication plan ready (who to notify, how) | Medium | [ ] | | |

### Rollback Decision Criteria

| Trigger | Action |
|---------|--------|
| Error rate > {{ERROR_RATE_ROLLBACK_PCT}}% (baseline: {{ERROR_RATE_BASELINE_PCT}}%) | Automatic rollback |
| P99 latency > {{LATENCY_ROLLBACK_MS}}ms for > 5 minutes | Investigate, manual rollback if not resolving |
| Any P0 bug discovered in production | Immediate rollback + hotfix |
| Feature flag kill switch needed within {{KILLSWITCH_HOURS}} hours | Disable flag first, rollback if insufficient |

---

## 8. Release Notes

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| N1 | Release notes written with user-facing changes | High | [ ] | | |
| N2 | Internal changelog with technical changes | Medium | [ ] | | |
| N3 | API changelog if any endpoints changed (breaking changes flagged) | High | [ ] | | |
| N4 | Known issues section included | Medium | [ ] | | |

---

## 9. Customer Communications

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| CC1 | Breaking changes communicated to affected users ({{COMMUNICATION_LEAD_DAYS}} days in advance) | Critical (if breaking) | [ ] | | |
| CC2 | Migration guide written for breaking API changes | Critical (if breaking) | [ ] | | |
| CC3 | In-app announcement configured for new features | Medium | [ ] | | |
| CC4 | Support team briefed on new features and known issues | High | [ ] | | |
| CC5 | Help docs / user guides updated | Medium | [ ] | | |

---

## 10. Monitoring

| # | Item | Priority | Status | Verified By | Date |
|---|------|----------|--------|-------------|------|
| M1 | Alerts configured for new endpoints/services | High | [ ] | | |
| M2 | Dashboard updated to include new feature metrics | Medium | [ ] | | |
| M3 | Error tracking ({{ERROR_TRACKING_TOOL}}) configured for new code paths | High | [ ] | | |
| M4 | Log levels appropriate (no debug logging in production) | High | [ ] | | |
| M5 | Health check endpoints updated if new services added | High | [ ] | | |
| M6 | Post-deploy smoke test plan ready (manual or automated) | Critical | [ ] | | |

### Post-Deploy Monitoring Window

| Time After Deploy | Check | Who |
|-------------------|-------|-----|
| 0-15 min | Smoke tests pass, error rate normal, no alerts | Release manager |
| 15-60 min | P95 latency normal, no user reports | On-call engineer |
| 1-4 hours | Feature adoption metrics appearing, no anomalies | Product owner |
| 24 hours | Full day metrics reviewed, no regressions | Tech lead |

---

## Final Sign-Off

| Role | Name | Approved | Date | Notes |
|------|------|----------|------|-------|
| Tech Lead | {{TECH_LEAD}} | [ ] | | |
| Product Owner | {{PRODUCT_OWNER}} | [ ] | | |
| QA Lead | {{QA_LEAD}} | [ ] | | |
| Release Manager | {{RELEASE_MANAGER}} | [ ] | | |
