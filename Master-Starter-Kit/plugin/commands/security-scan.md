---
name: security-scan
description: Run the security audit checklist against the codebase
args: scope
allowed_tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
  - TodoWrite
---

# /security-scan — Security Audit

Run the security audit checklist against the codebase and generate a findings report.

## Usage

```
/security-scan              # Scan entire project
/security-scan auth         # Scan auth module only
/security-scan <module>     # Scan specific module
```

## Steps

### Step 1: Load Checklist

Read the security audit checklist from `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/security-framework/SECURITY-AUDIT-CHECKLIST.md`.

### Step 2: Run Each Check

Execute the 10 security check categories:

**1. Authentication**
- All API endpoints have auth guards
- Token storage is secure (no localStorage for JWTs)
- Session/token expiry is configured
- Password hashing uses bcrypt/argon2

**2. Authorization**
- Role-based access control on sensitive endpoints
- No privilege escalation paths
- Admin-only routes properly guarded

**3. Input Validation**
- All endpoints validate input (DTOs, Zod schemas, etc.)
- No raw user input in database queries
- File upload validation (type, size)

**4. Multi-Tenant Isolation**
- Every database query filters by tenant context
- No cross-tenant data access possible
- Tenant context derived from auth, not user input

**5. XSS Prevention**
- No `dangerouslySetInnerHTML` without sanitization
- User-generated content escaped
- CSP headers configured

**6. CSRF Protection**
- State-changing operations use POST/PUT/DELETE
- CSRF tokens on forms (if using sessions)

**7. Data Protection**
- Sensitive fields not exposed in API responses
- Passwords never returned in responses
- PII masked in logs

**8. Soft-Delete & Data Lifecycle**
- Queries filter by `deletedAt: null`
- No hard deletes without explicit reason
- Data retention policies implemented

**9. Rate Limiting**
- Auth endpoints rate limited
- API endpoints have rate limits
- File upload rate limited

**10. Dependencies**
- No known vulnerable packages
- Dependencies pinned (no `*` versions)

### Step 3: Classify Findings

Use the severity framework from `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/security-framework/SEVERITY-LEVELS.md`:

- **SEV-1 (CRITICAL):** Auth bypass, data leak, injection — STOP-SHIP
- **SEV-2 (HIGH):** Missing auth on endpoint, privilege escalation path
- **SEV-3 (MEDIUM):** Missing input validation, no rate limiting
- **SEV-4 (LOW):** Missing CSP header, verbose error messages

### Step 4: Generate Report

Write findings using the template from `${CLAUDE_PLUGIN_ROOT}/../08-quality-testing/security-framework/SECURITY-FINDINGS-TEMPLATE.md`.

Display summary to user with STOP-SHIP items highlighted.
