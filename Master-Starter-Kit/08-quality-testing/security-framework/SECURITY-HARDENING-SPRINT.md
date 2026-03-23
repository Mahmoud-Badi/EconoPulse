# Security Hardening Sprint Template

## Purpose

A dedicated sprint focused exclusively on fixing security findings, hardening the application, and establishing security baselines. Run this after initial MVP development, after a security audit, or before any production deployment.

---

## Sprint Setup

| Field | Value |
|-------|-------|
| **Sprint Name** | Security Hardening |
| **Duration** | 1-2 weeks |
| **Trigger** | Post-audit / Pre-release / Major security finding |
| **Goal** | Zero STOP-SHIP findings, all P0 fixed, P1 addressed |

---

## Task Categories

### Category 1: STOP-SHIP Fixes (Day 1-2)

_Fix these before anything else. No feature work until these are resolved._

| Task ID | Finding | Severity | Effort | Status |
|---------|---------|----------|--------|--------|
| SEC-H-001 | | SEV-1 | | PENDING |

### Category 2: Authentication Hardening (Day 2-3)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-010 | Migrate tokens from localStorage to HttpOnly cookies | M | PENDING |
| SEC-H-011 | Implement token refresh mechanism | M | PENDING |
| SEC-H-012 | Add login rate limiting | S | PENDING |
| SEC-H-013 | Add password policy enforcement | S | PENDING |
| SEC-H-014 | Implement session invalidation on password change | S | PENDING |

### Category 3: Authorization Gaps (Day 3-4)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-020 | Audit all endpoints for auth guard coverage | L | PENDING |
| SEC-H-021 | Add role guards to unprotected admin endpoints | M | PENDING |
| SEC-H-022 | Fix horizontal privilege escalation gaps | M | PENDING |

### Category 4: Tenant Isolation (Day 4-5)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-030 | Audit all queries for tenant filter | L | PENDING |
| SEC-H-031 | Add tenant middleware/interceptor | M | PENDING |
| SEC-H-032 | Write tenant isolation tests | M | PENDING |

### Category 5: Input Validation (Day 5-6)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-040 | Audit all DTOs for validation decorators | L | PENDING |
| SEC-H-041 | Add validation to missing endpoints | M | PENDING |
| SEC-H-042 | Sanitize all user-generated content rendering | M | PENDING |

### Category 6: Infrastructure Hardening (Day 6-7)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-050 | Add security headers (HSTS, CSP, X-Frame-Options) | S | PENDING |
| SEC-H-051 | Configure CORS properly (not wildcard) | S | PENDING |
| SEC-H-052 | Enable rate limiting on all API endpoints | M | PENDING |
| SEC-H-053 | Run `pnpm audit` and fix critical CVEs | M | PENDING |
| SEC-H-054 | Remove all console.log with sensitive data | S | PENDING |

### Category 7: Security Tests (Day 7-8)

| Task ID | Task | Effort | Status |
|---------|------|--------|--------|
| SEC-H-060 | Write auth flow integration tests | L | PENDING |
| SEC-H-061 | Write tenant isolation tests | M | PENDING |
| SEC-H-062 | Write RBAC permission tests | M | PENDING |
| SEC-H-063 | Add security regression test suite | L | PENDING |

---

## Exit Criteria

- [ ] Zero STOP-SHIP (SEV-1) findings open
- [ ] Zero P0 (SEV-2) findings open
- [ ] All P1 (SEV-3) findings addressed or explicitly deferred with rationale
- [ ] Security audit checklist passes (all 10 sections)
- [ ] Security regression test suite exists and passes
- [ ] `pnpm audit` shows zero critical/high CVEs
- [ ] SECURITY-FINDINGS-TEMPLATE.md updated with all resolved findings

---

## Effort Estimates

| Size | Hours | Example |
|------|-------|---------|
| S | 0.5-1h | Add security header, fix console.log |
| M | 2-4h | Add rate limiting, fix auth gap |
| L | 4-8h | Full endpoint audit, write test suite |
| XL | 12-16h | Migrate auth system, implement tenant isolation |
