# Security Hardening

## Purpose

This guide provides actionable security configurations for {{PROJECT_NAME}}. These are not theoretical checklists -- each section contains copy-paste configuration that an AI coding assistant can apply directly. Security is not a feature phase; these should be integrated during Phase 0 (foundation).

---

## Security Headers

Apply all headers via middleware or hosting config. Every response from {{PROJECT_NAME}} should include these.

```typescript
// packages/api/src/middleware/security-headers.ts
import helmet from "helmet";

// helmet sets most of these automatically
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'strict-dynamic'"],
      styleSrc: ["'self'", "'unsafe-inline'"],  // required for most CSS-in-JS
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "{{API_DOMAIN}}", "https://*.sentry.io"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // enable if not loading cross-origin resources
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});
```

```bash
pnpm add helmet --filter @{{PROJECT_NAME}}/api
```

### Headers Checklist

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leaking |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unused browser APIs |
| `Content-Security-Policy` | See above | Control resource loading |

For Next.js, set these in `next.config.ts`:

```typescript
// apps/web/next.config.ts
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## CORS Configuration

Never use `origin: "*"` in production. Allowlist specific origins.

```typescript
// packages/api/src/middleware/cors.ts
import cors from "cors";

const ALLOWED_ORIGINS = [
  "https://{{PRODUCTION_DOMAIN}}",
  "https://staging.{{PRODUCTION_DOMAIN}}",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  maxAge: 86400, // Cache preflight for 24 hours
});
```

---

## Rate Limiting

### Per-IP Rate Limiting (Express)

```bash
pnpm add rate-limiter-flexible ioredis --filter @{{PROJECT_NAME}}/api
```

```typescript
// packages/api/src/middleware/rate-limiter.ts
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

// General API: 100 requests per minute per IP
export const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:api",
  points: 100,
  duration: 60,
  blockDuration: 60, // Block for 60s if exceeded
});

// Auth endpoints: 5 attempts per 15 minutes per IP
export const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:auth",
  points: 5,
  duration: 900,
  blockDuration: 900,
});

// Express middleware wrapper
export function rateLimitMiddleware(limiter: RateLimiterRedis) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch {
      res.status(429).json({
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests. Try again later." },
      });
    }
  };
}
```

---

## CSRF Protection

For cookie-based sessions, CSRF tokens are mandatory. Token-based auth (JWT in headers) is inherently CSRF-resistant.

```bash
pnpm add csrf-csrf --filter @{{PROJECT_NAME}}/api
```

```typescript
// packages/api/src/middleware/csrf.ts
import { doubleCsrf } from "csrf-csrf";

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: "__csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});

export { doubleCsrfProtection, generateToken };
```

---

## Input Sanitization

Validation (Zod) checks structure and types. Sanitization removes dangerous content from valid input.

### HTML Content Sanitization

```bash
pnpm add isomorphic-dompurify --filter @{{PROJECT_NAME}}/shared
```

```typescript
// packages/shared/src/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

// For rich text fields (comments, descriptions)
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

// For plain text fields (names, titles) -- strip ALL HTML
export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}
```

### Parameterized Queries

Never interpolate user input into SQL. Always use parameterized queries.

```typescript
// WRONG -- SQL injection vulnerability
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// CORRECT -- parameterized (Drizzle ORM)
const user = await db.select().from(users).where(eq(users.email, email));

// CORRECT -- parameterized (raw SQL with Postgres.js)
const user = await sql`SELECT * FROM users WHERE email = ${email}`;
```

---

## Dependency Vulnerability Scanning

### npm audit in CI

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: "0 8 * * 1"  # Weekly Monday 8am

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm audit --audit-level=high
        continue-on-error: false

  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

---

## Secret Scanning

Prevent accidental commits of API keys, tokens, and passwords.

### gitleaks Setup

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or download from https://github.com/gitleaks/gitleaks/releases
```

```yaml
# .gitleaks.toml (project root)
title = "{{PROJECT_NAME}} Gitleaks Config"

[extend]
useDefault = true

[[rules]]
id = "custom-api-key"
description = "Custom API key pattern for {{PROJECT_NAME}}"
regex = '''{{PROJECT_PREFIX}}_[a-zA-Z0-9]{32,}'''
tags = ["key", "custom"]

[allowlist]
paths = [
  '''\.env\.example''',
  '''\.gitleaks\.toml''',
]
```

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

---

## Environment Variable Security

```typescript
// Rules for environment variables:
// 1. NEVER log environment variables (even partially)
logger.info({ dbUrl: process.env.DATABASE_URL }); // NEVER DO THIS

// 2. Validate at startup -- fail fast if missing
// packages/api/src/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

// 3. Use .env.example as documentation (no real values)
// 4. Rotate secrets quarterly -- document rotation dates
// 5. Use different secrets per environment (dev/staging/prod)
```

---

## OWASP Top 10 Checklist for {{PROJECT_NAME}}

| # | Vulnerability | Mitigation in This Project |
|---|--------------|---------------------------|
| A01 | Broken Access Control | Role-based middleware on every route; row-level security in DB |
| A02 | Cryptographic Failures | TLS everywhere; bcrypt for passwords; AES-256 for PII at rest |
| A03 | Injection | Parameterized queries (Drizzle ORM); input sanitization |
| A04 | Insecure Design | Threat modeling in architecture phase; abuse case testing |
| A05 | Security Misconfiguration | Helmet headers; CSP; no default credentials; env validation |
| A06 | Vulnerable Components | Weekly `pnpm audit`; Snyk CI; Dependabot alerts |
| A07 | Auth Failures | Rate-limited login; MFA option; secure session config |
| A08 | Data Integrity Failures | Signed JWTs; subresource integrity; verified deployments |
| A09 | Logging Failures | Structured Pino logging; Sentry alerts; audit trail |
| A10 | SSRF | Allowlisted external URLs; no user-controlled fetch targets |

---

## Checklist

- [ ] Helmet (or equivalent) applied to all server responses
- [ ] CSP configured with specific directives, not `unsafe-eval`
- [ ] CORS allowlists production domains only
- [ ] Rate limiting on API and authentication endpoints
- [ ] CSRF protection enabled for cookie-based auth
- [ ] All user input sanitized beyond schema validation
- [ ] SQL queries parameterized (no string interpolation)
- [ ] `pnpm audit` runs in CI and blocks on high-severity
- [ ] gitleaks or git-secrets pre-commit hook installed
- [ ] Environment variables validated at startup, never logged
- [ ] Secrets differ across environments and rotate quarterly
- [ ] OWASP Top 10 reviewed with project-specific mitigations
