# Security Severity Framework

## The 4 Severity Levels

Every security finding is classified into one of 4 severity levels. Each level has a response SLA and escalation path.

---

## SEV-1: Critical

**Response SLA:** 4 hours | **Classification:** STOP-SHIP

**Definition:** Exploitable vulnerability that can be used to compromise user data, gain unauthorized access, or cause system-wide failure.

**Examples:**

- SQL injection allowing data exfiltration
- Authentication bypass (access without credentials)
- Remote code execution
- Credential exposure in client-side code (API keys, secrets in localStorage)
- Cross-tenant data access (one tenant can read/modify another's data)
- Unencrypted sensitive data transmission
- Admin endpoints accessible without authentication

**Response:**

1. Stop all feature development immediately
2. Assign senior developer to fix
3. Fix must be deployed within 4 hours of discovery
4. Post-incident review within 24 hours
5. Add regression test and anti-pattern entry

---

## SEV-2: High (P0)

**Response SLA:** 24 hours | **Classification:** Fix in current sprint

**Definition:** Vulnerability that could be exploited with moderate effort or affects a significant portion of users.

**Examples:**

- Missing role-based access control on sensitive endpoints
- CSRF vulnerabilities on state-changing operations
- XSS vulnerabilities (stored or reflected)
- Missing rate limiting on authentication endpoints
- Weak password policy enforcement
- Session fixation vulnerabilities
- Missing input validation on user-facing forms

**Response:**

1. Prioritize above all P1/P2 feature work
2. Fix within current sprint
3. Deploy fix before next release
4. Add to security regression test suite

---

## SEV-3: Medium (P1)

**Response SLA:** Next sprint | **Classification:** Fix in next sprint

**Definition:** Vulnerability that requires specific conditions to exploit or has limited impact.

**Examples:**

- Missing CORS restrictions (too permissive)
- Verbose error messages exposing internal details
- Missing security headers (HSTS, X-Frame-Options, CSP)
- Insecure direct object references (IDOR) on non-sensitive data
- Missing audit logging on sensitive operations
- Weak session configuration (too-long expiry, missing secure flag)
- Dependencies with known CVEs (non-critical)

**Response:**

1. Add to next sprint backlog
2. Fix before next phase gate
3. Monitor for exploitation attempts

---

## SEV-4: Low (P2)

**Response SLA:** Backlog | **Classification:** Fix when convenient

**Definition:** Minor security improvement that follows defense-in-depth principles but poses no immediate risk.

**Examples:**

- Missing `rel="noopener"` on external links
- Console.log statements exposing non-sensitive debug info
- Suboptimal password hashing algorithm (still secure, just not best-in-class)
- Missing `autocomplete="off"` on sensitive form fields
- Non-critical dependencies slightly outdated
- Minor information disclosure in HTTP headers

**Response:**

1. Add to backlog
2. Fix opportunistically during related work
3. No dedicated sprint time required

---

## Classification Matrix

| Factor | SEV-1 | SEV-2 | SEV-3 | SEV-4 |
|--------|-------|-------|-------|-------|
| **Exploitability** | Trivial | Moderate | Difficult | Theoretical |
| **Impact** | System-wide / All users | Many users / Sensitive data | Some users / Limited data | Minimal |
| **Authentication Required** | No | Sometimes | Yes | Yes |
| **User Interaction** | None | Minimal | Required | Complex |
| **Data at Risk** | PII / Financial / Auth | User data | Metadata | Non-sensitive |

---

## STOP-SHIP Classification

A finding is STOP-SHIP when:

- It is SEV-1 (any SEV-1 is automatically STOP-SHIP)
- It is SEV-2 AND affects authentication or payment flows
- Multiple SEV-2 findings compound into a systemic issue
- A regulatory/compliance requirement is violated

**STOP-SHIP means:** No deployment, no release, no demo until fixed and verified.

---

## Escalation Path

```
Developer finds issue
    ↓
Classify severity (SEV-1 to SEV-4)
    ↓
SEV-1? → Immediate escalation → Stop feature work → Fix within 4h
SEV-2? → Add to current sprint → Fix before release
SEV-3? → Add to next sprint → Fix before phase gate
SEV-4? → Add to backlog → Fix opportunistically
```
