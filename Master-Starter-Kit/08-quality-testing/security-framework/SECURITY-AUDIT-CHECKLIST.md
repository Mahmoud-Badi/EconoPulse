# Security Audit Checklist

Run this checklist at every phase gate and before every release. Each section maps to OWASP Top 10 and common web application vulnerabilities.

---

## 1. Authentication

- [ ] All auth endpoints use HTTPS
- [ ] Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] JWT tokens stored in HttpOnly cookies (not localStorage)
- [ ] Token expiration set (access: 15-30min, refresh: 7-30 days)
- [ ] Token refresh mechanism works correctly
- [ ] Login rate limiting active (max 5 attempts per 15 minutes)
- [ ] Password reset flow doesn't leak user existence
- [ ] MFA available for admin/sensitive accounts
- [ ] Session invalidation on password change
- [ ] Logout clears all tokens and sessions

**Grep checks:**
```bash
# Check for localStorage token storage (BAD)
grep -r "localStorage.*token\|sessionStorage.*token" --include="*.ts" --include="*.tsx"
# Check for password hashing
grep -r "bcrypt\|argon2\|scrypt" --include="*.ts"
```

---

## 2. Authorization

- [ ] Every API endpoint has an auth guard
- [ ] Role-based access control (RBAC) implemented
- [ ] Admin endpoints restricted to admin roles
- [ ] Sensitive operations require elevated permissions
- [ ] No horizontal privilege escalation (user A can't access user B's data)
- [ ] No vertical privilege escalation (regular user can't access admin functions)
- [ ] API keys have scoped permissions (not god-mode)

**Grep checks:**
```bash
# Find endpoints without auth guards
grep -r "@Public\|@SkipAuth\|@NoAuth" --include="*.ts"
# Find all controller methods and check for guard decorators
grep -rn "@Get\|@Post\|@Put\|@Delete\|@Patch" --include="*.controller.ts"
```

---

## 3. Input Validation

- [ ] All user input validated on server side (DTOs with decorators)
- [ ] Client-side validation present (but NOT relied upon)
- [ ] File uploads validated (type, size, content)
- [ ] SQL injection prevented (parameterized queries / ORM)
- [ ] NoSQL injection prevented (input sanitization)
- [ ] Path traversal prevented (no user input in file paths)
- [ ] Command injection prevented (no user input in shell commands)

**Grep checks:**
```bash
# Check for raw SQL queries (potential injection)
grep -r "raw\|rawQuery\|execute.*sql\|\$queryRaw" --include="*.ts"
# Check for unvalidated file operations
grep -r "readFile\|writeFile\|unlink" --include="*.ts" | grep -v "node_modules"
```

---

## 4. Multi-Tenant Isolation

- [ ] Every database query filters by tenant ID
- [ ] Tenant ID comes from authenticated session (not request params)
- [ ] Cross-tenant joins prevented
- [ ] Tenant isolation tested (create data as tenant A, query as tenant B)
- [ ] Shared resources (cache, queues) are tenant-scoped
- [ ] Tenant ID cannot be spoofed via API parameters

**Grep checks:**
```bash
# Find queries that might be missing tenant filter
grep -r "findMany\|findFirst\|findUnique" --include="*.ts" | grep -v "tenantId" | grep -v "node_modules"
```

---

## 5. XSS Prevention

- [ ] User-generated content is escaped before rendering
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Content Security Policy (CSP) headers set
- [ ] URL parameters not reflected in HTML without encoding

**Grep checks:**
```bash
# Check for dangerous HTML rendering
grep -r "dangerouslySetInnerHTML\|innerHTML" --include="*.tsx" --include="*.ts"
# Check for unescaped user input in templates
grep -r "v-html\|{{{" --include="*.vue" --include="*.hbs" 2>/dev/null
```

---

## 6. CSRF Protection

- [ ] State-changing operations require CSRF token
- [ ] SameSite cookie attribute set (Lax or Strict)
- [ ] Origin/Referer header validated on sensitive endpoints
- [ ] GET requests are idempotent (no state changes via GET)

---

## 7. Data Protection

- [ ] Sensitive data encrypted at rest (PII, financial data)
- [ ] Sensitive data encrypted in transit (TLS/HTTPS)
- [ ] API responses don't expose internal IDs unnecessarily
- [ ] Error messages don't expose stack traces or internal paths
- [ ] Logs don't contain sensitive data (passwords, tokens, PII)
- [ ] Database backups are encrypted

**Grep checks:**
```bash
# Check for sensitive data in logs
grep -r "console.log\|logger" --include="*.ts" | grep -i "password\|token\|secret\|key"
```

---

## 8. Soft-Delete & Data Lifecycle

- [ ] Deleted records filtered from all queries (`deletedAt IS NULL`)
- [ ] Soft-delete applied to relation/join queries
- [ ] Hard delete only for compliance requirements (with audit trail)
- [ ] Data retention policy defined and enforced

**Grep checks:**
```bash
# Find queries that might return deleted records
grep -r "findMany\|findFirst" --include="*.ts" | grep -v "deletedAt" | grep -v "node_modules"
```

---

## 9. Rate Limiting

- [ ] Authentication endpoints rate limited
- [ ] API endpoints rate limited (per user or per IP)
- [ ] Rate limit headers returned (X-RateLimit-Limit, X-RateLimit-Remaining)
- [ ] Rate limiting cannot be bypassed by changing IP headers

---

## 10. Dependencies

- [ ] No known critical CVEs in dependencies (`npm audit` / `pnpm audit`)
- [ ] Dependencies pinned to specific versions (not ranges)
- [ ] No unnecessary dependencies (review package.json)
- [ ] Supply chain security considered (lockfile integrity)

```bash
# Run dependency audit
pnpm audit
# Check for outdated packages
pnpm outdated
```

---

## Audit Sign-Off

| Auditor | Date | Sections Checked | Findings | Severity |
|---------|------|-----------------|----------|----------|
| | | All 10 | | |
