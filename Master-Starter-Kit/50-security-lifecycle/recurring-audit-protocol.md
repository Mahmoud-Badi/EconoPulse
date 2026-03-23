# Recurring Security Audit Protocol

> Every check has a cadence. Miss the cadence, and findings pile up until one becomes an incident.

---

## Per-Sprint (Automated — Every 1-2 Weeks)

These run in CI/CD or as scheduled tasks. Developers review results at sprint planning.

### Dependency Vulnerability Scan

```bash
# npm projects
npm audit --production
npx audit-ci --config audit-ci.json

# Snyk (if configured)
snyk test --severity-threshold=high

# Socket.dev (supply chain attacks)
npx socket:check
```

**Action:** New critical/high findings create tickets automatically. Medium/low go to triage backlog.

### Secrets Scan

```bash
# Scan for accidentally committed secrets
git secrets --scan
trufflehog git file://. --since-commit HEAD~50 --only-verified

# Check for secrets in environment files tracked by git
git ls-files | grep -iE '\.env|secret|credential|token|apikey' | head -20
```

**Action:** Any verified secret found in git history triggers immediate rotation (see dependency-scan-protocol.md emergency response).

### License Compliance Check

```bash
# Check for copyleft or unknown licenses in production dependencies
npx license-checker --production --failOn "GPL-2.0;GPL-3.0;AGPL-3.0;UNLICENSED"

# Detailed report
npx license-checker --production --csv --out license-report.csv
```

**Action:** Copyleft license in production dependency = block merge. Unknown license = manual review before next release.

### Static Analysis Security Testing (SAST)

```bash
# ESLint security rules
npx eslint --rule '{"no-eval": "error", "no-implied-eval": "error"}' src/

# Semgrep (language-agnostic)
semgrep --config=p/security-audit --config=p/owasp-top-ten src/
```

**Action:** New findings added to vulnerability tracker. False positives documented to prevent re-triage.

---

## Per-Phase (Manual Review — Every 4-8 Weeks)

These require human judgment. Schedule 2-4 hours per phase gate.

### Security Finding Review and Triage

1. Pull all open findings from the vulnerability tracker.
2. Re-assess severity based on current attack surface (did new features increase exposure?).
3. Verify SLA compliance — escalate any findings approaching deadline.
4. Close findings that are no longer relevant (removed feature, deprecated endpoint).
5. Update the security posture dashboard with current counts.

### New Endpoint Authorization Review

For every API endpoint or page route added since last review:

1. Verify authentication is required (or intentionally public with documented justification).
2. Verify authorization checks match the intended access level (role, scope, ownership).
3. Test with expired token, wrong role, and no token. Confirm correct 401/403 responses.
4. Verify rate limiting is applied to public and authenticated endpoints.
5. Check that error responses do not leak internal details (stack traces, SQL queries, internal IPs).

### Data Flow Audit for New Features

1. Map data inputs: where does user data enter the system? (forms, API calls, file uploads, webhooks)
2. Map data processing: what transformations happen? (validation, sanitization, serialization)
3. Map data storage: where is it persisted? (database, cache, file system, third-party)
4. Map data outputs: where is it displayed or transmitted? (UI, API response, email, logs)
5. Verify: input validation at entry, output encoding at exit, encryption at rest, no PII in logs.

---

## Pre-Release (Manual — Before Every Production Deploy)

Block the release if any item fails. Budget 4-8 hours.

### OWASP Top 10 Walkthrough

| # | Category | Check | Command / Method |
|---|----------|-------|-----------------|
| 1 | Broken Access Control | Test every role against every endpoint | Manual + automated auth matrix test |
| 2 | Cryptographic Failures | Verify TLS, encryption at rest, no plaintext secrets | `curl -I https://your-domain.com`, DB config review |
| 3 | Injection | Test SQL, NoSQL, OS command, LDAP injection on all inputs | `sqlmap`, manual testing, parameterized query audit |
| 4 | Insecure Design | Review architecture for trust boundary violations | Architecture diagram review |
| 5 | Security Misconfiguration | Check headers, error pages, default credentials, directory listing | `securityheaders.com`, `curl -I`, config review |
| 6 | Vulnerable Components | Run dependency scan, check EOL components | `npm audit`, `snyk test` |
| 7 | Auth Failures | Test brute force protection, session management, MFA | Manual testing, rate limit verification |
| 8 | Data Integrity Failures | Verify CI/CD pipeline integrity, dependency pinning | `package-lock.json` audit, pipeline review |
| 9 | Logging Failures | Verify security events are logged, no sensitive data in logs | Log review, grep for PII patterns |
| 10 | SSRF | Test all URL inputs for internal network access | Manual testing with internal IP ranges |

### Security Headers Verification

```bash
curl -sI https://{{PROJECT_DOMAIN}} | grep -iE 'content-security|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy'
```

### Rate Limiting Verification

```bash
# Test unauthenticated rate limit (adjust endpoint and threshold)
for i in $(seq 1 120); do curl -s -o /dev/null -w "%{http_code}\n" https://{{PROJECT_DOMAIN}}/api/health; done | sort | uniq -c
```

**Expected:** 429 responses after threshold is reached.

### Error Handling Review

```bash
# Verify no stack traces in production error responses
curl -s https://{{PROJECT_DOMAIN}}/api/nonexistent-endpoint | grep -iE 'stack|trace|node_modules|at Object|TypeError|Error:'
```

**Expected:** Generic error message, no internal details.

---

## Quarterly (Deep Audit — Every 3 Months)

Budget 1-3 days depending on team size.

1. **Deep security audit** — Review all changes since last quarterly audit with security lens.
2. **Penetration test planning** — Scope, schedule, and brief external pen-testers (or run internal pen-test).
3. **Incident response drill** — Run a tabletop exercise using Section 21 runbooks. Time the response.
4. **Access review** — Enumerate all human and service accounts. Remove unused access. Verify least privilege.
5. **Secret rotation check** — Verify all secrets are within rotation policy (typically 90 days). Rotate any overdue.
6. **Third-party integration audit** — Review OAuth scopes, API key permissions, webhook signatures for all external integrations.

---

## Annual (Full Review — Every 12 Months)

Budget 1-2 weeks. Typically involves external parties.

1. **Full compliance review** — Audit against all applicable frameworks (GDPR, SOC2, HIPAA, PCI-DSS).
2. **Third-party security assessment** — Engage external auditor or pen-test firm.
3. **Security policy update** — Review and update security policies, acceptable use, data handling.
4. **Data retention audit** — Verify data is deleted per retention policy. Check backups, logs, analytics.
5. **Architecture security review** — Re-evaluate trust boundaries, network segmentation, encryption strategy.
6. **Vendor security review** — Request SOC2 reports or security questionnaires from critical vendors.
