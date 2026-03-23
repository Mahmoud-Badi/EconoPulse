# Security Hardening Progression — {{PROJECT_NAME}}

> **Purpose:** Security is not a checkbox — it's a progression. This framework maps security requirements to project phases so you invest the right effort at the right time. Over-securing an MVP wastes weeks. Under-securing a production app with paying customers loses trust.

**Current Phase:** {{CURRENT_PHASE}}
**Last Security Review:** {{LAST_REVIEW_DATE}}
**Security Owner:** {{SECURITY_OWNER}}

---

## Phase 0: Project Setup (Day 1)

These are non-negotiable from the first commit. They cost almost nothing to implement and are painful to retrofit.

### Requirements

| # | Requirement | Implementation | Verification |
|---|------------|----------------|--------------|
| 0.1 | **httpOnly cookies for sessions** | Set `httpOnly: true, secure: true, sameSite: 'lax'` on all auth cookies. Never store tokens in localStorage. | Open DevTools → Application → Cookies. Confirm `HttpOnly` flag is set. Confirm cookie is not readable via `document.cookie`. |
| 0.2 | **CSRF protection** | Use `sameSite: 'lax'` cookies (protects GET). For state-changing requests, use CSRF tokens (double-submit cookie or synchronizer token pattern). | Attempt a cross-origin POST request from a different domain. It should fail. |
| 0.3 | **CORS configuration** | Whitelist only your domains. Never use `Access-Control-Allow-Origin: *` in production. | `curl -H "Origin: https://evil.com" -I https://yourapi.com/endpoint` — should NOT return the evil origin in CORS headers. |
| 0.4 | **Input sanitization** | Validate and sanitize all user input on the server side. Use Zod/Yup schemas for validation. Sanitize HTML input with DOMPurify or similar. | Submit `<script>alert('xss')</script>` in every text field. It should be escaped or stripped. |
| 0.5 | **Dependency audit** | Run `npm audit` or `pnpm audit`. Fix critical and high vulnerabilities. Add to CI pipeline. | `npm audit --audit-level=high` returns 0 vulnerabilities. |
| 0.6 | **Environment variables** | Never commit secrets to git. Use `.env.local` for local dev, environment variables in production. Add `.env*` to `.gitignore`. | `git log --all -p -- .env` returns nothing. No secrets in commit history. |
| 0.7 | **HTTPS everywhere** | TLS on all environments including staging. HSTS header in production. | `curl -I http://yourdomain.com` — should redirect to HTTPS (301). |
| 0.8 | **Error handling** | Never expose stack traces, database errors, or internal paths to clients. Return generic error messages. | Trigger a server error. Response should say "Internal Server Error" not show a stack trace with file paths. |

### Phase 0 Verification Checklist

```markdown
- [ ] Auth cookies: httpOnly=true, secure=true, sameSite=lax
- [ ] CORS: Only allows requests from {{ALLOWED_ORIGINS}}
- [ ] CSRF: State-changing endpoints reject cross-origin requests without valid token
- [ ] Input validation: Zod schemas on all API endpoints
- [ ] npm audit: Zero critical/high vulnerabilities
- [ ] .env files: In .gitignore, not in git history
- [ ] HTTPS: Forced on all environments
- [ ] Error responses: No stack traces, no internal paths, no SQL in error messages
```

> **Common mistake:** "I'll add CSRF protection later." CSRF is trivial to implement with `sameSite` cookies. Retrofitting it later means auditing every endpoint. Do it on day 1.

---

## Phase 1-3: Core Feature Development

Once you have users creating accounts and storing data, these become critical.

### Requirements

| # | Requirement | Implementation | Verification |
|---|------------|----------------|--------------|
| 1.1 | **Rate limiting** | Apply rate limits on: login (5/min per IP), signup (3/min per IP), API (100/min per user), password reset (3/hour per email). Use sliding window algorithm. | Exceed the rate limit with a script. Confirm 429 response after threshold. Confirm the limit resets correctly. |
| 1.2 | **Email verification** | Require email verification before granting full access. Verification tokens: single-use, expire in 24 hours, cryptographically random (≥32 bytes). | Sign up → check that unverified users have restricted access → verify email → confirm full access. Attempt to reuse a verification link. |
| 1.3 | **Session management** | Session expiry: 7-30 days idle timeout. Absolute timeout: 90 days. Session invalidation on password change. Show active sessions to users. | Log in → wait for idle timeout → confirm session expired. Change password → confirm other sessions are invalidated. |
| 1.4 | **Password policies** | Minimum 8 characters. Check against breached password lists (Have I Been Pwned API or local k-anonymity check). No composition rules (they don't help). | Try "password" — should be rejected (breached). Try "a" — should be rejected (too short). Try "correct-horse-battery-staple" — should be accepted. |
| 1.5 | **SQL injection prevention** | Use parameterized queries exclusively. Never interpolate user input into SQL strings. ORM queries are generally safe, but audit raw SQL. | Submit `'; DROP TABLE users; --` in input fields. Query should treat it as a literal string, not execute it. |
| 1.6 | **XSS prevention** | Use framework auto-escaping (React does this by default). Sanitize any `dangerouslySetInnerHTML` content. Implement CSP header (report-only mode first). | Submit `<img src=x onerror=alert(1)>` in every user-generated content field. It should render as text or be stripped, never execute. |
| 1.7 | **Secure password reset** | Token: single-use, expires in 1 hour, cryptographically random. Don't reveal whether email exists ("If this email is registered..."). Invalidate token after use. | Request reset → use token → confirm it works. Try reusing the same token — should fail. Try with non-existent email — should show same success message. |
| 1.8 | **File upload security** | Validate file type by magic bytes (not just extension). Limit file size. Store outside web root or in cloud storage. Scan for malware if accepting documents. | Upload a `.js` file renamed to `.png`. Should be rejected based on magic byte validation. Upload a 500MB file. Should be rejected by size limit. |

### Phase 1-3 Verification Checklist

```markdown
- [ ] Rate limiting: Login, signup, password reset, and API endpoints are rate-limited
- [ ] Email verification: Users must verify email for full access
- [ ] Sessions: Idle timeout configured, absolute timeout set, password change invalidates sessions
- [ ] Passwords: Minimum length enforced, breached password check active
- [ ] SQL injection: All queries use parameterized statements (audit raw SQL)
- [ ] XSS: Framework escaping enabled, CSP in report-only mode, dangerouslySetInnerHTML audited
- [ ] Password reset: Tokens are single-use, time-limited, don't reveal email existence
- [ ] File uploads: Type validated by content, size limited, stored securely
```

> **Common mistake:** Rate limiting only on login but not on API endpoints. An attacker can abuse your search endpoint to scrape data or your export endpoint to generate load.

---

## Phase 4-6: Growth and Hardening

You have paying customers. A security incident now means real damage — reputational and financial.

### Requirements

| # | Requirement | Implementation | Verification |
|---|------------|----------------|--------------|
| 4.1 | **Two-factor authentication (2FA)** | TOTP-based (Google Authenticator, Authy). Store backup codes (hashed). Require 2FA for admin accounts. Offer but don't mandate for regular users initially. | Enable 2FA → log out → log in with TOTP code → confirm access. Try logging in without TOTP → should be denied. Use backup code → confirm it works once. |
| 4.2 | **Anomaly detection** | Detect: login from new country/IP, >3 failed login attempts, password changed + immediately accessed sensitive data, bulk data export. Alert user via email. | Log in from a VPN in a different country. User should receive "New login from [Country]" email. |
| 4.3 | **Content Security Policy (CSP)** | Migrate from report-only to enforced. Whitelist only necessary script sources. Use nonces for inline scripts. Block `eval()`. Report violations to a CSP reporting endpoint. | Check CSP header is present and enforced (not report-only). Attempt to inject an inline script — browser should block it. |
| 4.4 | **Security headers audit** | Implement all recommended security headers (see table below). | Run `npx is-website-vulnerable https://yourdomain.com` or check headers at securityheaders.com. |
| 4.5 | **SAST integration** | Add static analysis to CI: `semgrep` or `CodeQL` for security patterns. Block merges with critical findings. | Push code with a known vulnerability pattern (e.g., `eval(userInput)`). CI should flag and block the PR. |
| 4.6 | **Dependency monitoring** | Automated alerts for new CVEs in your dependencies. Use Dependabot, Snyk, or Socket.dev. Auto-merge patch updates. Require review for major updates. | Check that dependency update PRs are being created automatically. Confirm critical CVEs trigger alerts within 24 hours. |
| 4.7 | **API authentication for all endpoints** | Audit for unauthenticated endpoints. Every endpoint should either require auth or be explicitly marked as public with a justification. | Review API routes. Run `grep -r "publicProcedure" src/` — each result should be justified. |

### Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.{{DOMAIN}}; frame-ancestors 'none'` | Prevent XSS, clickjacking, data injection |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking (redundant with CSP frame-ancestors but for older browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer information leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Disable unnecessary browser APIs |
| `X-DNS-Prefetch-Control` | `off` | Prevent DNS prefetch information leakage |

### Phase 4-6 Verification Checklist

```markdown
- [ ] 2FA: Available for all users, mandatory for admins
- [ ] Anomaly detection: New device/location triggers user notification
- [ ] CSP: Enforced (not report-only), violation reports collected
- [ ] Security headers: All headers from the table above are present
- [ ] SAST: Running in CI, blocking on critical findings
- [ ] Dependency monitoring: Automated CVE alerts active
- [ ] API audit: All endpoints require auth or are explicitly public
```

> **Common mistake:** Implementing 2FA but not requiring it for admin accounts. An admin account without 2FA is a single password away from full system compromise.

---

## Phase 7+: Scale and Enterprise Readiness

Your system handles significant traffic and sensitive data. Security is now a business requirement, not just good engineering.

### Requirements

| # | Requirement | Implementation | Verification |
|---|------------|----------------|--------------|
| 7.1 | **WAF (Web Application Firewall)** | Deploy Cloudflare WAF or AWS WAF. Enable OWASP Core Rule Set. Custom rules for your application's specific attack surface. | Run an automated vulnerability scanner (OWASP ZAP) against your domain. WAF should block common attacks. |
| 7.2 | **DDoS protection** | Use Cloudflare, AWS Shield, or similar. Configure rate limiting at the edge. Geographic blocking if your users are region-specific. | Load test with realistic traffic patterns. Confirm the system handles 10x normal load. Test that obvious DDoS patterns (single IP, 10K req/s) are blocked at the edge. |
| 7.3 | **Penetration testing** | Annual third-party pen test (minimum). Quarterly for high-security applications. Remediate critical findings within 30 days, high within 90 days. | Pen test report exists. All critical/high findings have remediation evidence. |
| 7.4 | **Bug bounty program** | Start with a private program (HackerOne, Bugcrowd) with invited researchers. Expand to public when mature. Define scope, exclusions, and reward tiers clearly. | Program is live. Response time to submissions: <5 business days for initial triage. |
| 7.5 | **SOC 2 preparation** | Implement controls from SOC 2 Trust Service Criteria. Automate evidence collection. See `compliance-matrix.md` for details. | SOC 2 Type I report obtained. Working toward Type II. |
| 7.6 | **Secrets management** | Migrate from environment variables to a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler). Rotate secrets automatically. Audit secret access. | No secrets in environment files on servers. All secrets fetched at runtime from secrets manager. Secret rotation tested. |
| 7.7 | **Zero-trust networking** | No implicit trust based on network location. Every service-to-service call is authenticated. Mutual TLS (mTLS) between internal services. | Internal services cannot communicate without valid certificates. Network segmentation prevents lateral movement. |
| 7.8 | **Security incident response plan** | Documented plan covering: detection, containment, eradication, recovery, post-mortem. Roles assigned. Contact list maintained. Plan tested via tabletop exercise annually. | Tabletop exercise completed within the last 12 months. Plan document is current (not stale). |

### Phase 7+ Verification Checklist

```markdown
- [ ] WAF: Deployed and blocking OWASP Top 10 attacks
- [ ] DDoS protection: Edge-level protection active
- [ ] Pen test: Completed within last 12 months, critical findings remediated
- [ ] Bug bounty: Program active, triage SLA <5 business days
- [ ] SOC 2: Type I obtained or in progress
- [ ] Secrets management: All secrets in a secrets manager, no env files on servers
- [ ] Zero trust: Service-to-service calls authenticated
- [ ] Incident response: Plan documented, tested, and current
```

> **Common mistake:** Running a bug bounty program without the bandwidth to respond. If you can't triage reports within a week, researchers will stop submitting. Worse, they'll disclose publicly.

---

## Security Testing Requirements by Phase

| Phase | Test Type | Frequency | Tools | Who |
|-------|-----------|-----------|-------|-----|
| **0** | Dependency audit | Every CI run | `npm audit`, Snyk | Automated (CI) |
| **0** | Secret scanning | Every commit | `gitleaks`, `trufflehog` | Automated (pre-commit hook) |
| **1-3** | OWASP Top 10 check | Monthly | OWASP ZAP (automated scan) | Dev team |
| **1-3** | Auth flow testing | Every sprint | Manual + automated tests | Dev team |
| **4-6** | SAST (Static Analysis) | Every PR | Semgrep, CodeQL | Automated (CI) |
| **4-6** | DAST (Dynamic Analysis) | Weekly | OWASP ZAP, Burp Suite | Dev team or contractor |
| **4-6** | Security headers audit | Monthly | securityheaders.com, Mozilla Observatory | Dev team |
| **7+** | Penetration testing | Annually | Third-party firm | External vendor |
| **7+** | Red team exercise | Annually | Internal or contracted | Security team |
| **7+** | Compliance audit | Annually | SOC 2 auditor | External auditor |

---

## Quick Reference: OWASP Top 10 (2021) Mapped to Phases

| # | OWASP Category | Phase to Address | Primary Defense |
|---|---------------|-----------------|-----------------|
| A01 | Broken Access Control | Phase 1 | RBAC middleware, tenant isolation checks, deny by default |
| A02 | Cryptographic Failures | Phase 0 | TLS everywhere, AES-256 at rest, bcrypt/argon2 for passwords |
| A03 | Injection | Phase 0-1 | Parameterized queries, input validation, output encoding |
| A04 | Insecure Design | Phase 0 | Threat modeling, abuse cases in user stories, security requirements |
| A05 | Security Misconfiguration | Phase 0 | Security headers, disable debug mode, remove defaults |
| A06 | Vulnerable Components | Phase 0 | Dependency auditing, automated updates, SCA tools |
| A07 | Auth Failures | Phase 1 | Rate limiting, MFA, session management, breached password checks |
| A08 | Data Integrity Failures | Phase 4 | Signed updates, CI/CD pipeline security, dependency verification |
| A09 | Logging & Monitoring Failures | Phase 1 | Centralized logging, security event alerting, audit trails |
| A10 | SSRF | Phase 1 | URL validation, allowlists for outbound requests, network segmentation |

---

## Project-Specific Security Requirements

| Requirement | Phase | Status | Owner | Notes |
|------------|-------|--------|-------|-------|
| {{REQUIREMENT_1}} | {{PHASE}} | {{STATUS}} | {{OWNER}} | {{NOTES}} |
| {{REQUIREMENT_2}} | {{PHASE}} | {{STATUS}} | {{OWNER}} | {{NOTES}} |
| {{REQUIREMENT_3}} | {{PHASE}} | {{STATUS}} | {{OWNER}} | {{NOTES}} |
| {{REQUIREMENT_4}} | {{PHASE}} | {{STATUS}} | {{OWNER}} | {{NOTES}} |
| {{REQUIREMENT_5}} | {{PHASE}} | {{STATUS}} | {{OWNER}} | {{NOTES}} |
