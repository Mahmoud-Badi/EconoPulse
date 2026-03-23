# {{PROJECT_NAME}} — Multi-Provider Fallback Configuration

> **Owner:** {{LEAD_DEVELOPER}}
> **Fallback Enabled:** {{FALLBACK_ENABLED}}
> **Error Threshold for Failover:** {{FALLBACK_ERROR_THRESHOLD}}
> **Cooldown Before Recovery:** {{FALLBACK_COOLDOWN_MINUTES}} minutes
> **Last Updated:** {{DATE}}

---

## 1. When to Use Multi-Provider Fallback

Multi-provider fallback adds complexity and cost. Use it only for integrations where:
- Downtime directly costs revenue (payments, email delivery for transactional messages)
- Downtime blocks core user flows (authentication, file storage for upload-dependent apps)
- SLA requirements mandate 99.9%+ availability for features that depend on the integration
- The fallback provider offers a compatible API or can be abstracted behind a shared interface

**Do not use fallback for:** analytics, monitoring, logging, non-critical notifications, or any P2/P3 integration. The operational overhead of maintaining two provider integrations outweighs the benefit for non-critical services.

---

## 2. Fallback Provider Registry

| Category | Primary Provider | Fallback Provider | Interface | Failover Tested |
|----------|-----------------|-------------------|-----------|-----------------|
| Email Delivery | {{EMAIL_PRIMARY}} | {{EMAIL_FALLBACK}} | `EmailProvider` | {{EMAIL_TESTED}} |
| SMS | {{SMS_PRIMARY}} | {{SMS_FALLBACK}} | `SMSProvider` | {{SMS_TESTED}} |
| File Storage | {{STORAGE_PRIMARY}} | {{STORAGE_FALLBACK}} | `StorageProvider` | {{STORAGE_TESTED}} |
| Authentication | {{AUTH_PRIMARY}} | {{AUTH_FALLBACK}} | `AuthProvider` | {{AUTH_TESTED}} |
| Payment Processing | {{PAYMENT_PRIMARY}} | {{PAYMENT_FALLBACK}} | `PaymentProvider` | {{PAYMENT_TESTED}} |
| AI/LLM | {{LLM_PRIMARY}} | {{LLM_FALLBACK}} | `LLMProvider` | {{LLM_TESTED}} |

### Common Fallback Pairs

| Category | Primary | Fallback | Notes |
|----------|---------|----------|-------|
| Email | SendGrid | AWS SES | SES requires domain verification in both accounts |
| Email | Resend | Postmark | Both have similar APIs, easy to abstract |
| SMS | Twilio | Vonage (Nexmo) | Number porting not automatic — maintain separate numbers |
| Storage | AWS S3 | Cloudflare R2 | R2 is S3-compatible — same SDK, different endpoint |
| Auth | Auth0 | Supabase Auth | Token formats differ — normalization needed |
| LLM | OpenAI | Anthropic | Prompt format differs — adapter pattern required |
| Search | Algolia | Typesense | Query syntax differs — abstraction required |
| CDN | Cloudflare | CloudFront | DNS-level failover possible |

---

## 3. Provider Abstraction Pattern

### Interface Design

Each fallback-eligible integration needs a provider-agnostic interface. Both the primary and fallback providers implement this interface.

```
Interface: EmailProvider
  Methods:
    - send(to, subject, body, options) → { id, status }
    - sendBatch(messages[]) → { results[] }
    - getStatus(messageId) → { delivered, bounced, pending }

Implementations:
  - SendGridEmailProvider implements EmailProvider
  - SESEmailProvider implements EmailProvider

Usage:
  - Application code only references EmailProvider interface
  - Factory function returns appropriate implementation based on config + health
```

### Data Format Normalization

Providers return different response formats. The abstraction layer must normalize:

| Concern | What to Normalize | Example |
|---------|-------------------|---------|
| IDs | Provider-specific IDs → unified format | `{ providerId: "sg_xxx", internalId: "msg_123" }` |
| Status | Provider-specific statuses → enum | `delivered`, `bounced`, `pending`, `failed` |
| Errors | Provider error codes → standard errors | `ProviderError { code, retryable, message }` |
| Timestamps | Provider formats → ISO 8601 | `2024-01-15T10:30:00Z` |

---

## 4. Failover Logic

### Failover Trigger Conditions

| Trigger | Threshold | Window | Action |
|---------|-----------|--------|--------|
| Error rate | {{FALLBACK_ERROR_THRESHOLD}} | 5 minutes | Switch to fallback |
| Latency spike | 3x normal P95 | 5 minutes | Switch to fallback |
| Circuit breaker open | — | — | Switch to fallback |
| Health check failure | 3 consecutive | 90 seconds | Switch to fallback |
| Manual override | — | — | Admin switches via config |

### Failover State Machine

```
NORMAL (using primary)
  │
  ├─ Trigger condition met → FAILING_OVER
  │                              │
  │                              ├─ Failover succeeds → FALLBACK (using fallback)
  │                              │                          │
  │                              │                     Cooldown expires
  │                              │                          │
  │                              │                     RECOVERING (testing primary)
  │                              │                          │
  │                              │                     Primary healthy → NORMAL
  │                              │                     Primary still down → FALLBACK
  │                              │
  │                              └─ Failover fails → DEGRADED (both down)
  │                                                       │
  │                                                  Incident response activated
  │                                                       │
  │                                                  Either provider recovers → retry
  │
  └─ Manual override → FORCED_PRIMARY or FORCED_FALLBACK
```

### Recovery Protocol

1. Primary provider's circuit breaker enters half-open state after {{FALLBACK_COOLDOWN_MINUTES}} minutes
2. Send test traffic ({{RECOVERY_TEST_PERCENTAGE}}% of requests) to primary
3. If test traffic succeeds for {{RECOVERY_SUCCESS_WINDOW}} minutes, shift all traffic back
4. If test traffic fails, remain on fallback, reset cooldown timer
5. Log every failover and recovery event for post-incident analysis

---

## 5. Failover Notifications

| Event | Severity | Notification Channel | Auto-Resolve |
|-------|----------|---------------------|-------------|
| Failover activated | Warning | {{HEALTH_ALERT_CHANNEL}} | Yes, when recovered |
| Recovery started | Info | {{HEALTH_ALERT_CHANNEL}} | — |
| Recovery complete | Info | {{HEALTH_ALERT_CHANNEL}} | — |
| Both providers down | Critical | PagerDuty + {{HEALTH_ALERT_CHANNEL}} | No — manual ack required |
| Fallback active > 1 hour | Warning | {{HEALTH_ALERT_CHANNEL}} + email | — |

---

## 6. Cost Implications

### Ongoing Costs

| Provider Pair | Primary Monthly | Fallback Monthly (standby) | Fallback Monthly (active) |
|--------------|----------------|---------------------------|--------------------------|
| {{PAIR_1}} | {{PRIMARY_COST_1}} | {{STANDBY_COST_1}} | {{ACTIVE_COST_1}} |

### Cost Optimization

- **Standby mode:** Keep fallback account active with minimal usage (monthly ping test) to avoid cold start issues
- **Shared free tiers:** Many providers have generous free tiers — fallback may cost $0 in standby
- **Reserved capacity:** If fallback activates frequently, consider reserved pricing
- **Billing alerts:** Set up alerts on fallback provider to detect unexpected active usage

---

## 7. Testing Fallback

### Monthly Failover Drill

Schedule a monthly failover test in staging:

1. Simulate primary provider failure (block outbound requests or mock errors)
2. Verify failover activates within expected timeframe
3. Verify all operations succeed on fallback provider
4. Verify notifications fire correctly
5. Restore primary → verify recovery protocol works
6. Document any issues found

### Chaos Testing

- [ ] Block primary provider DNS → verify failover
- [ ] Inject 100% error rate on primary → verify threshold detection
- [ ] Inject high latency on primary → verify latency-based failover
- [ ] Block both providers → verify degraded mode behavior
- [ ] Kill failover state store → verify default behavior (should use primary)

### Data Consistency

After failover, verify:
- [ ] No duplicate operations (emails sent twice, payments charged twice)
- [ ] No lost operations (operations that were in-flight during switch)
- [ ] State is consistent across providers (if using provider-specific features)
- [ ] Webhook endpoints updated if provider sends callbacks to different URLs

---

## 8. Per-Category Implementation Notes

### Email Failover

- Both providers must have domain verification (SPF, DKIM, DMARC) configured
- Template IDs differ between providers — use content-based sending, not template IDs
- Dedicated IP reputation doesn't transfer — fallback may have lower deliverability initially
- Suppression lists don't sync — maintain your own bounce/unsubscribe list

### Payment Failover

- **Caution:** Payment failover is high-risk. Customer payment methods are stored per-provider.
- Stored payment methods (cards, bank accounts) cannot be shared between providers
- Consider: fallback only for new payments, not recurring billing
- PCI compliance applies to both providers — ensure both are in scope

### Storage Failover

- S3-compatible providers (R2, MinIO, Backblaze B2) make this easiest
- Cross-region replication must be pre-configured — you can't replicate after failover
- Signed URL formats differ between providers — abstraction layer must generate provider-specific URLs
- Consider CDN as the failover layer (cached content served from CDN while storage is down)

### Auth Failover

- Token formats and signing keys differ between providers
- Session tokens issued by primary won't validate against fallback
- Consider: allow existing sessions to continue (validate cached tokens), only failover new auth flows
- User database sync between providers must be near-real-time
