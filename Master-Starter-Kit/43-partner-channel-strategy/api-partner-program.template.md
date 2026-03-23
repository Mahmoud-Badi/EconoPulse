# API Partner Program

> API partnerships turn {{PROJECT_NAME}} into a platform that other products integrate with. This template defines the access tiers, rate limits, authentication, partner-specific endpoints, usage monitoring, and SLA commitments that make your API a reliable foundation for partner businesses.

---

## 1. Access Tiers

### 1.1 Tier Definitions

| Tier | Monthly Cost | Target Partner | Access Level | Support |
|------|-------------|----------------|-------------|---------|
| Explorer | Free | Developers evaluating integration | Sandbox only, no production | Community forum |
| Basic | $0 (revenue share) | Small integrations, side projects | Production, limited endpoints | Email (48h SLA) |
| Standard | $0 (revenue share) | Active integrations, growing partners | Full API, standard limits | Email + chat (24h SLA) |
| Premium | $0 (revenue share) | High-volume integrations | Full API, elevated limits | Email + chat + phone (8h SLA) |
| Enterprise | Custom | Strategic technology partners | Full API + beta endpoints | Dedicated support engineer (4h SLA) |

**Current configuration:** `{{PARTNER_API_TIER}}`

### 1.2 Tier Progression

```
Explorer → Basic → Standard → Premium → Enterprise
  │          │         │          │          │
  │          │         │          │          └─ By invitation, custom agreement
  │          │         │          └─ >10K API calls/day, >$50K influenced revenue
  │          │         └─ >1K API calls/day, >$10K influenced revenue
  │          └─ Approved application, integration live in production
  └─ Self-service signup, sandbox access only
```

---

## 2. Rate Limits

### 2.1 Rate Limit Configuration

| Tier | Requests/Minute | Requests/Hour | Requests/Day | Burst (10s window) | Concurrent |
|------|-----------------|---------------|--------------|--------------------|-----------:|
| Explorer | 10 | 100 | 500 | 5 | 2 |
| Basic | 60 | 1,000 | 10,000 | 20 | 5 |
| Standard | 300 | 10,000 | 100,000 | 100 | 20 |
| Premium | 1,000 | 50,000 | 500,000 | 300 | 50 |
| Enterprise | Custom | Custom | Custom | Custom | Custom |

### 2.2 Rate Limit Headers

Every API response includes rate limit information:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1679012345
X-RateLimit-Tier: standard
Retry-After: 12          // Only present when rate limited
```

### 2.3 Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. You have made 301 requests in the current minute. Your limit is 300 requests/minute on the Standard tier.",
    "tier": "standard",
    "limit": 300,
    "window": "1m",
    "retryAfter": 12,
    "upgradeUrl": "https://partners.{{PROJECT_NAME}}.com/api/upgrade"
  }
}
```

### 2.4 Rate Limit Implementation

```typescript
// middleware/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const tierLimits: Record<string, { requests: number; window: string }> = {
  explorer:   { requests: 10,   window: '1m' },
  basic:      { requests: 60,   window: '1m' },
  standard:   { requests: 300,  window: '1m' },
  premium:    { requests: 1000, window: '1m' },
  enterprise: { requests: 5000, window: '1m' }, // Default, overridden per partner
};

export function createPartnerRateLimiter(tier: string) {
  const config = tierLimits[tier] || tierLimits.basic;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window as any),
    prefix: `partner-api:${tier}`,
    analytics: true,
  });
}

export async function checkRateLimit(
  partnerId: string,
  tier: string
): Promise<RateLimitResult> {
  const limiter = createPartnerRateLimiter(tier);
  const result = await limiter.limit(partnerId);

  return {
    allowed: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    retryAfter: result.success ? 0 : Math.ceil((result.reset - Date.now()) / 1000),
  };
}
```

---

## 3. Partner Keys & Authentication

### 3.1 Key Types

| Key Type | Format | Purpose | Rotation Policy |
|----------|--------|---------|----------------|
| API Key | `pk_live_` + 32 hex chars | Server-to-server authentication | Annual rotation recommended |
| API Secret | `sk_live_` + 48 hex chars | Signing requests (HMAC) | Annual rotation, on compromise |
| Sandbox Key | `pk_test_` + 32 hex chars | Sandbox/development access | No rotation required |
| Webhook Secret | `whsec_` + 32 hex chars | Verifying webhook payloads | On compromise only |
| OAuth Client ID | UUID | OAuth 2.0 flow | On compromise |
| OAuth Client Secret | 64 hex chars | OAuth 2.0 flow | Annual rotation |

### 3.2 Authentication Methods

| Method | Use Case | Security Level |
|--------|----------|---------------|
| API Key in header | Simple server-to-server calls | Medium |
| HMAC signature | High-security operations, webhooks | High |
| OAuth 2.0 (Authorization Code) | User-facing integrations | High |
| OAuth 2.0 (Client Credentials) | Machine-to-machine | High |

### 3.3 API Key Authentication

```typescript
// middleware/partner-auth.ts
export async function authenticatePartner(
  request: Request
): Promise<PartnerAuthResult> {
  const apiKey = request.headers.get('X-API-Key')
    || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return { authenticated: false, error: 'Missing API key' };
  }

  // Hash the key for lookup (keys are stored hashed)
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  const partnerKey = await db.partnerApiKeys.findUnique({
    where: { keyHash },
    include: { partner: { include: { tier: true } } },
  });

  if (!partnerKey) {
    return { authenticated: false, error: 'Invalid API key' };
  }

  if (partnerKey.revokedAt) {
    return { authenticated: false, error: 'API key has been revoked' };
  }

  if (partnerKey.expiresAt && partnerKey.expiresAt < new Date()) {
    return { authenticated: false, error: 'API key has expired' };
  }

  // Log usage
  await db.partnerApiKeyUsage.create({
    data: {
      keyId: partnerKey.id,
      partnerId: partnerKey.partnerId,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    },
  });

  return {
    authenticated: true,
    partner: partnerKey.partner,
    tier: partnerKey.partner.tier.slug,
    keyId: partnerKey.id,
  };
}
```

---

## 4. Partner-Specific Endpoints

### 4.1 Endpoint Categories

| Category | Endpoints | Minimum Tier | Description |
|----------|-----------|-------------|-------------|
| Account | `/v1/partner/account` | Basic | Partner account info, usage stats |
| Customers | `/v1/partner/customers/*` | Basic | Manage partner-referred customers |
| Deals | `/v1/partner/deals/*` | Standard | Deal registration and pipeline |
| Provisioning | `/v1/partner/provision/*` | Standard | Sub-account provisioning |
| Commissions | `/v1/partner/commissions/*` | Basic | Commission data and statements |
| Analytics | `/v1/partner/analytics/*` | Standard | Customer usage and health metrics |
| Webhooks | `/v1/partner/webhooks/*` | Basic | Webhook registration and management |
| White-label | `/v1/partner/whitelabel/*` | Premium | Theme and branding configuration |
| Beta | `/v1/beta/partner/*` | Enterprise | Early access to new endpoints |

### 4.2 Core Endpoint Reference

```
GET    /v1/partner/account                    → Partner account details
GET    /v1/partner/account/usage              → API usage statistics

GET    /v1/partner/customers                  → List partner's customers
GET    /v1/partner/customers/:id              → Customer details
GET    /v1/partner/customers/:id/usage        → Customer usage metrics
POST   /v1/partner/customers/:id/expand       → Expand customer subscription

POST   /v1/partner/deals                      → Register a new deal
GET    /v1/partner/deals                      → List deal registrations
GET    /v1/partner/deals/:id                  → Deal details
POST   /v1/partner/deals/:id/extend           → Request deal extension
DELETE /v1/partner/deals/:id                  → Withdraw deal registration

POST   /v1/partner/provision                  → Provision new customer account
GET    /v1/partner/provision/:id/status       → Provisioning status

GET    /v1/partner/commissions                → List commissions
GET    /v1/partner/commissions/summary        → Commission summary by period
GET    /v1/partner/commissions/statement/:id  → Download commission statement

POST   /v1/partner/webhooks                   → Register a webhook
GET    /v1/partner/webhooks                   → List registered webhooks
DELETE /v1/partner/webhooks/:id               → Remove a webhook
POST   /v1/partner/webhooks/:id/test          → Send a test webhook event
```

---

## 5. Usage Monitoring

### 5.1 Monitoring Dashboard

| Metric | Visualization | Alert Threshold |
|--------|--------------|----------------|
| Requests per minute | Real-time line chart | >80% of tier limit |
| Error rate (4xx + 5xx) | Stacked bar chart | >5% error rate |
| Latency (p50, p95, p99) | Latency histogram | p99 > 500ms |
| Top endpoints | Table (sorted by call count) | — |
| Daily unique customers | Counter | — |
| Quota consumption | Progress bar (% of daily limit) | >90% daily limit |
| Webhook delivery rate | Percentage | <95% success rate |

### 5.2 Usage Alerts

| Alert | Trigger | Notification Channel | Action |
|-------|---------|---------------------|--------|
| Rate limit approaching | >80% of limit in current window | Email + webhook | Consider upgrade |
| Rate limit exceeded | 429 response returned | Email + webhook | Back off, retry with exponential backoff |
| Daily quota approaching | >90% of daily limit | Email | Plan for next day or upgrade |
| Error spike | >10% error rate (5-minute window) | Email + Slack | Investigate — may indicate breaking change |
| Key compromise suspected | Usage from >5 IPs in 1 minute | Email + SMS | Rotate key immediately |
| Unusual traffic pattern | >3x normal volume | Email | Verify partner activity is legitimate |

---

## 6. Upgrade Path

### 6.1 Tier Advancement Criteria

| From → To | Revenue Requirement | Usage Requirement | Additional |
|-----------|-------------------|-------------------|------------|
| Explorer → Basic | Application approved | — | Production integration ready |
| Basic → Standard | $10K influenced ARR | >1K calls/day average | 3 months as Basic |
| Standard → Premium | $50K influenced ARR | >10K calls/day average | 6 months as Standard |
| Premium → Enterprise | $200K+ influenced ARR | >50K calls/day average | Strategic alignment review |

### 6.2 Upgrade Request Process

1. Partner requests upgrade via portal or API
2. System validates against advancement criteria
3. If criteria met: auto-upgrade with confirmation email
4. If criteria not met: notification with gap analysis and next steps
5. Enterprise upgrades always require human approval from partnership team

---

## 7. Developer Documentation

### 7.1 Documentation Requirements

| Section | Content | Priority |
|---------|---------|----------|
| Getting Started | Account setup, key generation, first API call | Critical |
| Authentication | All auth methods with examples | Critical |
| API Reference | Every endpoint with request/response examples | Critical |
| Rate Limits | Tier limits, headers, handling 429 responses | Critical |
| Webhooks | Available events, payload format, verification | High |
| SDKs | JavaScript, Python, PHP, Ruby, Go | High |
| Changelog | Breaking changes, new endpoints, deprecations | High |
| Migration guides | Version upgrade instructions | High |
| Error codes | All error codes with descriptions and resolution | Medium |
| Best practices | Caching, pagination, idempotency | Medium |
| Sandbox | How to use sandbox environment for testing | Medium |

### 7.2 SDK Support Matrix

| Language | Package | Minimum Version | Maintained By |
|----------|---------|----------------|--------------|
| JavaScript/TypeScript | `@{{PROJECT_NAME}}/partner-sdk` | Node 18+ | Internal |
| Python | `{{PROJECT_NAME}}-partner` | Python 3.9+ | Internal |
| PHP | `{{PROJECT_NAME}}/partner-php` | PHP 8.1+ | Community + internal review |
| Ruby | `{{PROJECT_NAME}}_partner` | Ruby 3.0+ | Community + internal review |
| Go | `github.com/{{PROJECT_NAME}}/partner-go` | Go 1.21+ | Internal |

---

## 8. SLA Commitments

### 8.1 Availability SLA

| Tier | Uptime SLA | Measurement | Credits |
|------|-----------|-------------|---------|
| Explorer | Best effort | — | None |
| Basic | 99.5% | Monthly | — |
| Standard | 99.9% | Monthly | 10% credit for breach |
| Premium | 99.95% | Monthly | 25% credit for breach |
| Enterprise | 99.99% | Monthly | Custom credit schedule |

### 8.2 Latency SLA

| Tier | p50 Target | p95 Target | p99 Target |
|------|-----------|-----------|-----------|
| Explorer | — | — | — |
| Basic | 200ms | 500ms | 1,000ms |
| Standard | 100ms | 300ms | 500ms |
| Premium | 50ms | 200ms | 400ms |
| Enterprise | 50ms | 150ms | 300ms |

### 8.3 Support Response SLA

| Tier | Critical (P1) | High (P2) | Medium (P3) | Low (P4) |
|------|--------------|-----------|-------------|----------|
| Explorer | Community forum | Community forum | Community forum | Community forum |
| Basic | 48 hours | 72 hours | 5 business days | 10 business days |
| Standard | 24 hours | 48 hours | 3 business days | 5 business days |
| Premium | 8 hours | 24 hours | 2 business days | 3 business days |
| Enterprise | 4 hours | 8 hours | 1 business day | 2 business days |

---

## 9. API Partner Program Checklist

- [ ] Access tiers defined with clear progression criteria
- [ ] Rate limits configured per tier (requests/min, /hour, /day)
- [ ] Rate limit headers included in all API responses
- [ ] API key generation and management in partner portal
- [ ] HMAC signature verification implemented for webhooks
- [ ] OAuth 2.0 flows implemented (if applicable)
- [ ] Partner-specific endpoints deployed and documented
- [ ] Usage monitoring dashboard live
- [ ] Usage alerts configured and tested
- [ ] Upgrade path criteria defined and auto-evaluation working
- [ ] Developer documentation published (getting started, reference, SDKs)
- [ ] SDKs published for primary languages
- [ ] Sandbox environment provisioned and accessible
- [ ] SLA commitments documented in partner agreement
- [ ] SLA monitoring and credit calculation automated
- [ ] API versioning strategy defined (URL path or header)
- [ ] Deprecation policy communicated (minimum 6-month notice)
