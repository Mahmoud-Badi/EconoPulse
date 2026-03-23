# Rate Limiting Tiers

## Overview

Rate limiting prevents abuse, ensures fair usage, and protects backend resources. Apply different limits based on the sensitivity and cost of each endpoint.

---

## The 7 Rate Limiting Scopes

| Scope | Limit | Window | Purpose |
|-------|-------|--------|---------|
| **1. Authentication** | 5 requests | 15 minutes | Prevent brute-force login |
| **2. Password Reset** | 3 requests | 1 hour | Prevent email flooding |
| **3. API Write (per user)** | 100 requests | 1 minute | Prevent automated spam |
| **4. API Read (per user)** | 300 requests | 1 minute | Allow normal browsing |
| **5. Search / Query** | 30 requests | 1 minute | Prevent expensive query abuse |
| **6. File Upload** | 10 requests | 10 minutes | Prevent storage abuse |
| **7. Global (per IP)** | 1000 requests | 1 minute | DDoS protection fallback |

---

## Implementation Guide

### Response Headers

Every rate-limited endpoint should return:

```
X-RateLimit-Limit: 100        # Max requests allowed in window
X-RateLimit-Remaining: 87     # Requests remaining in current window
X-RateLimit-Reset: 1679529600 # Unix timestamp when window resets
Retry-After: 30               # Seconds until next request allowed (only on 429)
```

### Error Response (429 Too Many Requests)

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 30 seconds.",
  "retryAfter": 30
}
```

---

## Multi-Tenant Considerations

| Factor | Single-Tenant | Multi-Tenant |
|--------|--------------|-------------|
| Rate limit key | IP address or user ID | Tenant ID + user ID |
| Shared limits | Per user | Per tenant (pooled) |
| Admin override | N/A | Tenant admin can adjust within bounds |
| Fair use | Per user | Per tenant (prevent one tenant from starving others) |

---

## Tier Adjustments by Plan (SaaS)

| Plan | API Write | API Read | Search | File Upload |
|------|-----------|----------|--------|-------------|
| **Free** | 30/min | 100/min | 10/min | 3/10min |
| **Starter** | 60/min | 200/min | 20/min | 5/10min |
| **Professional** | 100/min | 300/min | 30/min | 10/10min |
| **Enterprise** | 500/min | 1000/min | 100/min | 50/10min |

---

## Monitoring

Track these metrics:

| Metric | Alert Threshold |
|--------|----------------|
| 429 response rate | > 5% of total requests |
| Rate limit utilization per tenant | > 80% sustained for 10min |
| Burst patterns | > 50 requests in 1 second from single source |
| Authentication failures | > 10 failures in 5 minutes from single IP |
