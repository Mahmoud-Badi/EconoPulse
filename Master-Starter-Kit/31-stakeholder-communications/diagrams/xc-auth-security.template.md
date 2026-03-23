# Auth & Security Architecture — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

```mermaid
flowchart TB
    subgraph RoleHierarchy["Role Hierarchy — Inheritance Model"]
        SUPER["{{ROLE_1}}<br/>Super Admin"]
        ADMIN["{{ROLE_2}}<br/>Admin"]
        MANAGER["{{ROLE_3}}<br/>Manager"]
        USER_ROLE["{{ROLE_4}}<br/>User"]
        GUEST["{{ROLE_N}}<br/>Guest / Public"]

        SUPER -->|"inherits all"| ADMIN
        ADMIN -->|"inherits"| MANAGER
        MANAGER -->|"inherits"| USER_ROLE
        USER_ROLE -->|"inherits"| GUEST
    end

    subgraph AuthFlows["Auth Flows — {{AUTH_PROVIDER}}"]
        direction LR
        LOGIN["Login Request<br/>email + password / OAuth"]
        VALIDATE["Credential Validation<br/>bcrypt compare / OAuth verify"]
        TOKEN_ISSUE["Token Issuance<br/>Access: {{ACCESS_TOKEN_TTL}}<br/>Refresh: {{REFRESH_TOKEN_TTL}}"]
        TOKEN_STORE["Token Storage<br/>httpOnly cookie / secure storage"]
        REFRESH["Token Refresh<br/>Validate refresh token<br/>Issue new access token"]
        REVOKE["Token Revocation<br/>Blocklist + DB flag"]

        LOGIN --> VALIDATE
        VALIDATE -->|"success"| TOKEN_ISSUE
        VALIDATE -->|"failure"| LOCKOUT["Account Lockout<br/>after {{MAX_LOGIN_ATTEMPTS}} attempts"]
        TOKEN_ISSUE --> TOKEN_STORE
        TOKEN_STORE -->|"access expired"| REFRESH
        REFRESH -->|"refresh valid"| TOKEN_ISSUE
        REFRESH -->|"refresh expired"| LOGIN
        TOKEN_STORE -->|"user logout"| REVOKE
    end

    subgraph APISecurity["API Security Controls"]
        RATE_LIMIT["Rate Limiting<br/>{{RATE_LIMIT_REQUESTS}}/{{RATE_LIMIT_WINDOW}}<br/>per IP + per user"]
        INPUT_VAL["Input Validation<br/>Schema validation (Zod/Joi)<br/>SQL injection prevention<br/>XSS sanitization"]
        CORS_CFG["CORS Configuration<br/>Origins: {{ALLOWED_ORIGINS}}<br/>Methods: GET, POST, PUT, DELETE<br/>Credentials: true"]
        CSRF["CSRF Protection<br/>Token-based / SameSite cookies"]

        RATE_LIMIT --> INPUT_VAL
        INPUT_VAL --> CORS_CFG
        CORS_CFG --> CSRF
    end

    subgraph SessionMgmt["Session Management"]
        SESS_CREATE["Session Creation<br/>On successful auth"]
        SESS_VALIDATE["Session Validation<br/>Every request via middleware"]
        SESS_EXTEND["Session Extension<br/>Sliding window: {{SESSION_TTL}}"]
        SESS_EXPIRE["Session Expiration<br/>Absolute timeout: {{SESSION_ABSOLUTE_TTL}}"]
        SESS_DESTROY["Session Destruction<br/>Logout / forced revocation"]

        SESS_CREATE --> SESS_VALIDATE
        SESS_VALIDATE -->|"valid"| SESS_EXTEND
        SESS_VALIDATE -->|"expired"| SESS_EXPIRE
        SESS_EXTEND --> SESS_VALIDATE
        SESS_EXPIRE --> SESS_DESTROY
    end

    %% Connections between subgraphs
    TOKEN_STORE --> SESS_CREATE
    REVOKE --> SESS_DESTROY
    SESS_VALIDATE --> RATE_LIMIT

    %% OWASP annotations
    RATE_LIMIT -.-|"OWASP A04:2021<br/>Insecure Design"| OW1["Brute force mitigation"]
    INPUT_VAL -.-|"OWASP A03:2021<br/>Injection"| OW2["Input sanitization"]
    CORS_CFG -.-|"OWASP A05:2021<br/>Security Misconfiguration"| OW3["Origin restriction"]
    TOKEN_ISSUE -.-|"OWASP A07:2021<br/>Auth Failures"| OW4["Secure token handling"]
    LOCKOUT -.-|"OWASP A07:2021<br/>Auth Failures"| OW5["Credential stuffing defense"]

    style OW1 fill:#FFF3E0,stroke:#FF9800
    style OW2 fill:#FFF3E0,stroke:#FF9800
    style OW3 fill:#FFF3E0,stroke:#FF9800
    style OW4 fill:#FFF3E0,stroke:#FF9800
    style OW5 fill:#FFF3E0,stroke:#FF9800
```

---

## Role Permission Summary

| Role | {{PERMISSION_1}} | {{PERMISSION_2}} | {{PERMISSION_3}} | {{PERMISSION_4}} | Admin Panel | User Mgmt |
|---|---|---|---|---|---|---|
| {{ROLE_1}} (Super Admin) | Full | Full | Full | Full | Full | Full |
| {{ROLE_2}} (Admin) | Full | Full | Full | Full | Read/Write | Create/Edit |
| {{ROLE_3}} (Manager) | Full | Full | Read/Write | Read | Read | None |
| {{ROLE_4}} (User) | Own | Own | Read | None | None | None |
| {{ROLE_N}} (Guest) | None | None | Read (public) | None | None | None |

**Permission levels:** Full = CRUD + admin operations, Read/Write = create + read + update, Read = read only, Own = CRUD own resources only, None = no access

## Auth Flow Summary

| Flow | Trigger | Steps | Token Output | Error Handling |
|---|---|---|---|---|
| Email/Password Login | User submits credentials | Validate email → compare hash → issue tokens | Access + Refresh | Lockout after {{MAX_LOGIN_ATTEMPTS}} attempts |
| OAuth Login | User clicks "Sign in with {{AUTH_PROVIDER}}" | Redirect → consent → callback → issue tokens | Access + Refresh | Fallback to email login |
| Token Refresh | Access token expired | Validate refresh token → issue new access token | New Access token | Force re-login if refresh expired |
| Logout | User clicks logout | Revoke tokens → destroy session → clear cookies | None | Best-effort revocation |
| Password Reset | User requests reset | Send email → validate link → update password → revoke all sessions | None (re-login required) | Rate-limited to prevent abuse |

## OWASP Top 10 Control Checklist

| OWASP ID | Category | Control | Implementation | Status |
|---|---|---|---|---|
| A01:2021 | Broken Access Control | Role-based access enforcement | Middleware checks on every route | {{STATUS_A01}} |
| A02:2021 | Cryptographic Failures | TLS everywhere + encryption at rest | {{ENCRYPTION_ALGORITHM}} + forced HTTPS | {{STATUS_A02}} |
| A03:2021 | Injection | Parameterized queries + input validation | ORM + Zod/Joi schemas | {{STATUS_A03}} |
| A04:2021 | Insecure Design | Rate limiting + account lockout | {{RATE_LIMIT_REQUESTS}}/{{RATE_LIMIT_WINDOW}} | {{STATUS_A04}} |
| A05:2021 | Security Misconfiguration | CORS + CSP + security headers | Helmet.js / equivalent middleware | {{STATUS_A05}} |
| A06:2021 | Vulnerable Components | Dependency scanning | npm audit / Snyk in CI pipeline | {{STATUS_A06}} |
| A07:2021 | Auth Failures | Secure token handling + MFA option | httpOnly cookies + bcrypt + optional TOTP | {{STATUS_A07}} |
| A08:2021 | Software & Data Integrity | Signed deployments + SRI | CI/CD integrity checks | {{STATUS_A08}} |
| A09:2021 | Logging & Monitoring | Structured security event logging | {{MONITORING_PROVIDER}} integration | {{STATUS_A09}} |
| A10:2021 | SSRF | URL validation + allowlisting | Outbound request filtering | {{STATUS_A10}} |

---

## Cross-References

- **Multi-Tenant Isolation:** `xc-multi-tenant.template.md`
- **Security Zones:** `infra-security-zones.template.md`
- **Secrets Management:** `infra-secrets-management.template.md`
- **API Topology:** `infra-api-topology.template.md`
- **System Architecture:** `system-architecture-flowchart.template.md`
