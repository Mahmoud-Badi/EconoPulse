# Security Testing Automation

Automate security testing at every layer: static analysis, dynamic scanning, dependency auditing, access control verification, and secret detection. Security bugs found in production cost 30x more than those caught in CI.

---

## Security Test Priority Categories

| Priority | Category | Examples | When to Test |
|----------|----------|----------|-------------|
| **P0** | Authentication / Authorization Bypass | Accessing admin routes without auth, escalating roles, bypassing MFA | Every PR, every deploy |
| **P1** | Data Exposure | Leaking user data across tenants, PII in logs, unmasked sensitive fields | Every PR, every deploy |
| **P2** | Injection / XSS | SQL injection, stored XSS, command injection, template injection | Every PR (SAST), weekly (DAST) |
| **P3** | Information Disclosure | Stack traces in responses, version headers, debug endpoints in production | Pre-release, monthly scan |

---

## 1. Static Application Security Testing (SAST)

### Semgrep Integration

Semgrep catches security issues by pattern-matching source code. It runs in seconds and produces minimal false positives.

```yaml
# .semgrep.yml — Project-level rules
rules:
  # Prevent SQL injection via string concatenation
  - id: no-raw-sql-concat
    patterns:
      - pattern: |
          $QUERY = `... ${$VAR} ...`
      - pattern-not: |
          $QUERY = `... ${sanitize($VAR)} ...`
    message: "Raw variable interpolation in SQL query. Use parameterized queries."
    languages: [typescript, javascript]
    severity: ERROR

  # Prevent logging sensitive data
  - id: no-log-sensitive-fields
    pattern: |
      console.$METHOD(..., $OBJ.password, ...)
    message: "Do not log password or sensitive fields"
    languages: [typescript, javascript]
    severity: ERROR

  # Prevent hardcoded secrets
  - id: no-hardcoded-secrets
    patterns:
      - pattern-regex: "(password|secret|api_key|token)\s*[:=]\s*['\"][^'\"]{8,}['\"]"
    message: "Possible hardcoded secret. Use environment variables."
    languages: [typescript, javascript]
    severity: ERROR

  # Prevent eval usage
  - id: no-eval
    pattern: eval(...)
    message: "eval() is a code injection risk. Use safe alternatives."
    languages: [typescript, javascript]
    severity: ERROR

  # Detect missing auth middleware
  - id: unprotected-api-route
    patterns:
      - pattern: |
          router.$METHOD($PATH, $HANDLER)
      - pattern-not: |
          router.$METHOD($PATH, authMiddleware, ...)
      - metavariable-regex:
          metavariable: $PATH
          regex: ".*admin.*"
    message: "Admin route without auth middleware"
    languages: [typescript, javascript]
    severity: ERROR
```

```yaml
# CI integration
semgrep-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run Semgrep
      uses: returntocorp/semgrep-action@v1
      with:
        config: .semgrep.yml
        generateSarif: true
    - name: Upload SARIF
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: semgrep.sarif
```

### Custom Rules for Project Patterns

```yaml
# .semgrep/project-rules.yml — Rules specific to your stack

rules:
  # Prisma: prevent findMany without pagination (data exfiltration risk)
  - id: prisma-unbounded-query
    pattern: |
      prisma.$MODEL.findMany({ where: ... })
    pattern-not: |
      prisma.$MODEL.findMany({ where: ..., take: ..., ... })
    message: "findMany without `take` limit — risk of returning entire table"
    severity: WARNING
    languages: [typescript]

  # Next.js: prevent exposing server-only data in client components
  - id: no-server-secret-in-client
    pattern: |
      "use client"
      ...
      process.env.$VAR
    message: "Accessing process.env in client component may expose server secrets"
    severity: ERROR
    languages: [typescript]
```

---

## 2. Dynamic Application Security Testing (DAST)

### OWASP ZAP Integration

ZAP scans the running application for vulnerabilities that SAST cannot detect (misconfigured headers, CORS issues, exposed endpoints).

```yaml
# .github/workflows/dast.yml
name: DAST — OWASP ZAP

on:
  schedule:
    - cron: '0 3 * * 1' # Weekly on Monday at 3 AM
  workflow_dispatch:

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to staging
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        id: deploy

      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: ${{ steps.deploy.outputs.url }}
          rules_file_name: .zap/rules.tsv
          cmd_options: '-a'

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v4
        with:
          name: zap-report
          path: report_html.html
```

```tsv
# .zap/rules.tsv — Customize which rules fail the build
# Rule ID    Action    Description
10038	FAIL	Content Security Policy Header Not Set
10021	FAIL	X-Content-Type-Options Missing
10036	WARN	Server Leaks Version Information
10020	FAIL	X-Frame-Options Header Not Set
40012	FAIL	Cross Site Scripting (Reflected)
40014	FAIL	Cross Site Scripting (Persistent)
90033	FAIL	Loosely Scoped Cookie
```

### Baseline Scan vs Full Scan

| Scan Type | Duration | When to Use | Finds |
|-----------|----------|-------------|-------|
| **Baseline** | 2-5 min | Every PR, weekly | Missing headers, basic misconfigs, information disclosure |
| **Full Scan** | 30-60 min | Pre-release, monthly | SQL injection, XSS, CSRF, auth bypass, parameter tampering |

---

## 3. Dependency Scanning

### npm audit + Snyk

```yaml
# CI integration
dependency-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: npm audit (built-in)
      run: |
        npm audit --audit-level=high --json > audit-report.json || true
        # Fail on high/critical only
        HIGH_COUNT=$(cat audit-report.json | jq '.metadata.vulnerabilities.high // 0')
        CRIT_COUNT=$(cat audit-report.json | jq '.metadata.vulnerabilities.critical // 0')
        if [ "$((HIGH_COUNT + CRIT_COUNT))" -gt 0 ]; then
          echo "FAIL: $HIGH_COUNT high, $CRIT_COUNT critical vulnerabilities"
          exit 1
        fi

    - name: Snyk test
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
```

### License Compliance

```bash
# Check for copyleft or problematic licenses
npx license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-1.0;AGPL-3.0;SSPL-1.0" --json > license-report.json
```

```yaml
# CI step
- name: License compliance
  run: npx license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-1.0;AGPL-3.0" --production
```

---

## 4. Broken Access Control Tests

The most critical security tests. Every multi-tenant or multi-role application must have these.

### Template: Cross-User Data Access (Must Fail)

```typescript
// security/access-control.integration.test.ts

describe('Broken Access Control — Cross-User Data Isolation', () => {
  let userAToken: string;
  let userBToken: string;
  let userATrip: { id: string };

  beforeAll(async () => {
    // Create two separate users
    userAToken = await createUserAndGetToken('user-a@example.com');
    userBToken = await createUserAndGetToken('user-b@example.com');

    // User A creates a trip
    const res = await app.inject({
      method: 'POST',
      url: '/api/trips',
      headers: { authorization: `Bearer ${userAToken}` },
      payload: { name: 'User A Private Trip', destination: 'Paris' },
    });
    userATrip = res.json();
  });

  it('User B cannot read User A trip', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/trips/${userATrip.id}`,
      headers: { authorization: `Bearer ${userBToken}` },
    });

    expect(res.statusCode).toBe(404); // 404, not 403 (don't reveal existence)
  });

  it('User B cannot update User A trip', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/trips/${userATrip.id}`,
      headers: { authorization: `Bearer ${userBToken}` },
      payload: { name: 'Hijacked!' },
    });

    expect(res.statusCode).toBe(404);

    // Verify data was NOT modified
    const verify = await app.inject({
      method: 'GET',
      url: `/api/trips/${userATrip.id}`,
      headers: { authorization: `Bearer ${userAToken}` },
    });
    expect(verify.json().name).toBe('User A Private Trip');
  });

  it('User B cannot delete User A trip', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/trips/${userATrip.id}`,
      headers: { authorization: `Bearer ${userBToken}` },
    });

    expect(res.statusCode).toBe(404);

    // Verify trip still exists
    const verify = await app.inject({
      method: 'GET',
      url: `/api/trips/${userATrip.id}`,
      headers: { authorization: `Bearer ${userAToken}` },
    });
    expect(verify.statusCode).toBe(200);
  });

  it('User B list does not include User A trips', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/trips',
      headers: { authorization: `Bearer ${userBToken}` },
    });

    const tripIds = res.json().data.map((t: any) => t.id);
    expect(tripIds).not.toContain(userATrip.id);
  });
});

describe('Broken Access Control — Role Escalation', () => {
  let regularUserToken: string;

  beforeAll(async () => {
    regularUserToken = await createUserAndGetToken('regular@example.com', 'user');
  });

  it('regular user cannot promote themselves to admin', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/me',
      headers: { authorization: `Bearer ${regularUserToken}` },
      payload: { role: 'admin' },
    });

    // Should either ignore the role field or return 403
    if (res.statusCode === 200) {
      expect(res.json().role).toBe('user'); // Role field ignored
    } else {
      expect(res.statusCode).toBe(403);
    }
  });

  it('regular user cannot access admin API', async () => {
    const adminRoutes = [
      { method: 'GET', url: '/api/admin/users' },
      { method: 'POST', url: '/api/admin/settings' },
      { method: 'DELETE', url: '/api/admin/users/some-id' },
      { method: 'GET', url: '/api/admin/audit-log' },
    ];

    for (const route of adminRoutes) {
      const res = await app.inject({
        method: route.method as any,
        url: route.url,
        headers: { authorization: `Bearer ${regularUserToken}` },
      });

      expect(res.statusCode).toBeOneOf([401, 403]);
    }
  });
});
```

---

## 5. API Security Tests

### Authentication Bypass Attempts

```typescript
// security/auth-bypass.integration.test.ts
describe('Authentication Bypass', () => {
  const protectedRoutes = [
    { method: 'GET', url: '/api/trips' },
    { method: 'POST', url: '/api/trips' },
    { method: 'GET', url: '/api/users/me' },
    { method: 'PATCH', url: '/api/users/me' },
  ];

  for (const route of protectedRoutes) {
    it(`${route.method} ${route.url} returns 401 without token`, async () => {
      const res = await app.inject({ method: route.method as any, url: route.url });
      expect(res.statusCode).toBe(401);
    });

    it(`${route.method} ${route.url} returns 401 with invalid token`, async () => {
      const res = await app.inject({
        method: route.method as any,
        url: route.url,
        headers: { authorization: 'Bearer invalid.jwt.token' },
      });
      expect(res.statusCode).toBe(401);
    });

    it(`${route.method} ${route.url} returns 401 with expired token`, async () => {
      const expiredToken = createExpiredToken('test@example.com');
      const res = await app.inject({
        method: route.method as any,
        url: route.url,
        headers: { authorization: `Bearer ${expiredToken}` },
      });
      expect(res.statusCode).toBe(401);
    });
  }
});
```

### Rate Limit Verification

```typescript
// security/rate-limiting.integration.test.ts
describe('Rate Limiting', () => {
  it('blocks requests after rate limit exceeded', async () => {
    const results: number[] = [];

    // Send 110 requests (assuming limit is 100/minute)
    for (let i = 0; i < 110; i++) {
      const res = await app.inject({
        method: 'GET',
        url: '/api/trips',
        headers: { authorization: `Bearer ${userToken}` },
      });
      results.push(res.statusCode);
    }

    // First 100 should succeed
    const successes = results.filter(s => s === 200).length;
    const rateLimited = results.filter(s => s === 429).length;

    expect(successes).toBeGreaterThanOrEqual(90); // Allow some flex
    expect(rateLimited).toBeGreaterThan(0);
  });

  it('login endpoint has stricter rate limit', async () => {
    const results: number[] = [];

    // Attempt 15 logins (assuming limit is 10/minute for login)
    for (let i = 0; i < 15; i++) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'test@example.com', password: `wrong-${i}` },
      });
      results.push(res.statusCode);
    }

    const rateLimited = results.filter(s => s === 429).length;
    expect(rateLimited).toBeGreaterThan(0);
  });
});
```

### Input Validation Fuzzing

```typescript
// security/input-fuzzing.integration.test.ts
describe('Input Validation — Malicious Payloads', () => {
  const maliciousPayloads = [
    { name: 'SQL injection', value: "'; DROP TABLE users; --" },
    { name: 'XSS script tag', value: '<script>alert("xss")</script>' },
    { name: 'XSS event handler', value: '<img onerror="alert(1)" src=x>' },
    { name: 'NoSQL injection', value: '{"$gt": ""}' },
    { name: 'Path traversal', value: '../../../etc/passwd' },
    { name: 'Command injection', value: '; rm -rf /' },
    { name: 'SSRF attempt', value: 'http://169.254.169.254/latest/meta-data/' },
    { name: 'Null byte', value: 'test\x00admin' },
    { name: 'Unicode tricks', value: 'admin\u200B' }, // zero-width space
    { name: 'Oversized input', value: 'A'.repeat(1_000_000) },
  ];

  for (const payload of maliciousPayloads) {
    it(`handles ${payload.name} safely`, async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/trips',
        headers: { authorization: `Bearer ${userToken}` },
        payload: { name: payload.value, destination: 'Test' },
      });

      // Should either reject (400/413/422) or sanitize — never execute
      expect(res.statusCode).not.toBe(500); // No server crash
      if (res.statusCode === 200 || res.statusCode === 201) {
        // If accepted, verify it was sanitized
        const body = res.json();
        expect(body.name).not.toContain('<script>');
        expect(body.name).not.toContain('DROP TABLE');
      }
    });
  }
});
```

---

## 6. Secret Scanning

### Pre-Commit Hook with gitleaks

```yaml
# .gitleaks.toml
title = "gitleaks config"

[allowlist]
  description = "Allow test fixtures and examples"
  paths = [
    '''\.test\.ts$''',
    '''\.example$''',
    '''\.template''',
  ]

[[rules]]
  id = "generic-api-key"
  description = "Generic API Key"
  regex = '''(?i)(api[_-]?key|apikey)\s*[:=]\s*['\"][0-9a-zA-Z]{20,}['\"]'''
  severity = "high"

[[rules]]
  id = "jwt-token"
  description = "JWT Token"
  regex = '''eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+'''
  severity = "high"
```

```bash
# Install gitleaks pre-commit hook
# .husky/pre-commit
gitleaks protect --staged --config .gitleaks.toml --verbose
```

```yaml
# CI integration
secret-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 7. CI Pipeline Integration Summary

```yaml
# .github/workflows/security.yml
name: Security Pipeline

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 3 * * 1' # Weekly full scan

jobs:
  # Runs on every PR (fast — under 2 minutes)
  sast:
    name: SAST (Semgrep)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: .semgrep.yml

  secrets:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  dependencies:
    name: Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: npx license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-1.0;AGPL-3.0" --production

  access-control:
    name: Access Control Tests
    runs-on: ubuntu-latest
    needs: [sast] # Only run if SAST passes
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm test -- --grep "access control|auth bypass|rate limit"

  # Runs weekly (slow — 30-60 minutes)
  dast:
    name: DAST (ZAP Full Scan)
    if: github.event_name == 'schedule'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy staging
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
        id: deploy
      - uses: zaproxy/action-full-scan@v0.10.0
        with:
          target: ${{ steps.deploy.outputs.url }}
```

---

## 8. Security Test Plan Template

```markdown
# Security Test Plan — {{PROJECT_NAME}}

## Scope
- Application: {{PROJECT_NAME}} ({{PROJECT_DESCRIPTION}})
- Environment: {{TEST_ENVIRONMENT}}
- Date: {{TEST_DATE}}
- Tester: {{TESTER_NAME}}

## Test Categories

### P0: Authentication & Authorization (Every PR)
| Test | Status | Tool | Notes |
|------|--------|------|-------|
| All protected routes return 401 without auth | {{STATUS}} | Integration tests | |
| Invalid/expired tokens rejected | {{STATUS}} | Integration tests | |
| Cross-user data isolation verified | {{STATUS}} | Integration tests | |
| Role escalation blocked | {{STATUS}} | Integration tests | |
| Admin routes blocked for non-admins | {{STATUS}} | Integration tests | |

### P1: Data Exposure (Every PR)
| Test | Status | Tool | Notes |
|------|--------|------|-------|
| No PII in server logs | {{STATUS}} | Semgrep | |
| Sensitive fields excluded from API responses | {{STATUS}} | Integration tests | |
| Error responses don't leak stack traces | {{STATUS}} | Integration tests | |
| No hardcoded secrets in source | {{STATUS}} | gitleaks | |

### P2: Injection & XSS (Every PR + Weekly DAST)
| Test | Status | Tool | Notes |
|------|--------|------|-------|
| SQL injection payloads rejected | {{STATUS}} | SAST + Integration | |
| XSS payloads sanitized or rejected | {{STATUS}} | SAST + DAST | |
| Input length limits enforced | {{STATUS}} | Integration tests | |
| Content-Security-Policy header set | {{STATUS}} | DAST | |

### P3: Information Disclosure (Pre-Release)
| Test | Status | Tool | Notes |
|------|--------|------|-------|
| Server version headers removed | {{STATUS}} | DAST | |
| Debug endpoints disabled in production | {{STATUS}} | Manual + DAST | |
| Source maps not served in production | {{STATUS}} | Manual check | |
| robots.txt doesn't reveal sensitive paths | {{STATUS}} | Manual check | |

### Dependencies
| Test | Status | Tool | Notes |
|------|--------|------|-------|
| No high/critical vulnerabilities | {{STATUS}} | npm audit / Snyk | |
| License compliance passing | {{STATUS}} | license-checker | |
| Dependencies up to date | {{STATUS}} | npm outdated | |

## Results Summary
- Total tests: {{TOTAL_TESTS}}
- Passing: {{PASSING_COUNT}}
- Failing: {{FAILING_COUNT}}
- Blocked: {{BLOCKED_COUNT}}

## Sign-Off
- [ ] All P0 tests passing
- [ ] All P1 tests passing
- [ ] All P2 tests passing or mitigated
- [ ] P3 tests reviewed (failures accepted with documentation)
- [ ] Dependency audit clean
- [ ] Security test plan archived in `dev_docs/quality/security/`
```
