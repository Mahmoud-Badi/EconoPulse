# {{PROJECT_NAME}} — Webhook Architecture

> **Owner:** {{LEAD_DEVELOPER}}
> **Queue Provider:** {{WEBHOOK_QUEUE_PROVIDER}}
> **Signature Algorithm:** {{WEBHOOK_SIGNATURE_ALGORITHM}}
> **DLQ Retention:** {{WEBHOOK_DLQ_RETENTION_DAYS}} days
> **Last Updated:** {{DATE}}

---

## 1. Webhook Design Philosophy

Webhooks are the backbone of modern API integrations. Every payment confirmation, every Slack interaction, every Shopify order update arrives as an inbound webhook. The difference between a reliable system and a data-loss machine is how you handle them.

**Core principles:**
1. **Respond fast, process async.** Return 200/202 within 3 seconds. Process the payload in a background job.
2. **Verify every signature.** Never trust inbound data without cryptographic verification.
3. **Assume duplicate delivery.** Webhooks are "at least once" — build idempotency into every handler.
4. **Assume out-of-order delivery.** Event A may arrive after Event B, even if A happened first.
5. **Never lose events.** Use a dead letter queue for failed processing. Provide replay capability.

---

## 2. Inbound Webhook Architecture

### Request Flow

```
Provider → [Your Webhook Endpoint]
              │
              ├─ 1. Parse raw body (preserve for signature verification)
              ├─ 2. Verify signature (HMAC-SHA256 / Ed25519)
              ├─ 3. Check idempotency (event ID dedup)
              ├─ 4. Enqueue to {{WEBHOOK_QUEUE_PROVIDER}}
              ├─ 5. Return 202 Accepted
              │
         [Queue Worker]
              │
              ├─ 6. Route to handler by event type
              ├─ 7. Process business logic
              ├─ 8. Mark as processed (idempotency store)
              │
         [On Failure]
              │
              ├─ 9. Retry with exponential backoff
              └─ 10. Move to DLQ after max retries
```

### Endpoint Configuration

| Provider | Endpoint Path | Signature Header | Signature Algorithm | Events Subscribed |
|----------|--------------|------------------|--------------------|--------------------|
| {{PROVIDER_1}} | `/api/webhooks/{{PROVIDER_1_SLUG}}` | {{SIG_HEADER_1}} | {{SIG_ALG_1}} | {{EVENTS_1}} |
| {{PROVIDER_2}} | `/api/webhooks/{{PROVIDER_2_SLUG}}` | {{SIG_HEADER_2}} | {{SIG_ALG_2}} | {{EVENTS_2}} |

### Common Signature Headers by Provider

| Provider | Header | Algorithm | Verification Library |
|----------|--------|-----------|---------------------|
| Stripe | `stripe-signature` | HMAC-SHA256 (with timestamp) | `stripe` SDK built-in |
| GitHub | `x-hub-signature-256` | HMAC-SHA256 | Manual or `@octokit/webhooks` |
| Shopify | `x-shopify-hmac-sha256` | HMAC-SHA256 (Base64) | Manual |
| Slack | `x-slack-signature` | HMAC-SHA256 (with timestamp) | `@slack/events-api` |
| Twilio | `x-twilio-signature` | HMAC-SHA1 | `twilio` SDK built-in |
| SendGrid | `x-twilio-email-event-webhook-signature` | ECDSA | `@sendgrid/eventwebhook` |

---

## 3. Signature Verification

### Implementation Pattern

```
IMPORTANT: You MUST access the raw request body for signature verification.
Framework body parsers (JSON.parse, express.json()) modify the body and
break signature checks.

Pattern:
1. Configure your framework to provide raw body access for webhook routes
2. Compute HMAC of raw body using your webhook secret
3. Compare computed signature with the signature header (timing-safe comparison)
4. Reject requests with invalid or missing signatures (return 401)
5. Only then parse the body as JSON for processing
```

### Per-Provider Verification

| Provider | Secret Storage Key | Verification Notes |
|----------|-------------------|-------------------|
| {{PROVIDER_1}} | `{{PROVIDER_1}}_WEBHOOK_SECRET` | {{VERIFICATION_NOTES_1}} |
| {{PROVIDER_2}} | `{{PROVIDER_2}}_WEBHOOK_SECRET` | {{VERIFICATION_NOTES_2}} |

### Timestamp Validation

Some providers include a timestamp in the signature to prevent replay attacks. Reject events older than 5 minutes:

- **Stripe:** `t=` prefix in signature header. Compare against current time. Reject if delta > 300 seconds.
- **Slack:** `X-Slack-Request-Timestamp` header. Reject if delta > 300 seconds.
- **Custom:** Include `timestamp` field in payload. Reject if delta > {{WEBHOOK_REPLAY_WINDOW_SECONDS}} seconds.

---

## 4. Idempotency Strategy

### Event ID Deduplication

Every webhook event should have a unique identifier. Store processed event IDs and skip duplicates.

| Provider | Event ID Field | Example |
|----------|---------------|---------|
| Stripe | `id` | `evt_1NB4qf2eZvKYlo2CqXEOmW3e` |
| GitHub | `X-GitHub-Delivery` header | `72d3162e-cc78-11e3-81ab-4c9367dc0958` |
| Shopify | `X-Shopify-Webhook-Id` header | `b54557e4-bdd9-4b37-8a5f-bf82a57e39c8` |
| Slack | `event_id` in payload | `Ev0PV52K21` |

### Dedup Storage

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| Redis SET with TTL | Fast, auto-expires | Requires Redis | High-volume webhooks |
| Database table | Persistent, queryable | Slower lookups | Low-volume, audit needs |
| In-memory Set | Zero dependencies | Lost on restart, no sharing | Development only |

**Selected approach:** {{IDEMPOTENCY_STORAGE}}
**TTL / retention:** {{IDEMPOTENCY_TTL}}

---

## 5. Queue-Based Processing

### Queue Configuration

```
Queue Provider: {{WEBHOOK_QUEUE_PROVIDER}}
Queue Name: webhooks-inbound
Concurrency: {{WEBHOOK_QUEUE_CONCURRENCY}}
Max Retries: {{WEBHOOK_MAX_RETRIES}}
Backoff Strategy: Exponential (base: 30s, max: 1h)
```

### Retry Policy

| Attempt | Delay | Total Elapsed |
|---------|-------|---------------|
| 1 | Immediate | 0s |
| 2 | 30s | 30s |
| 3 | 2m | 2m 30s |
| 4 | 8m | 10m 30s |
| 5 | 30m | 40m 30s |
| 6 (final) | 1h | 1h 40m 30s |

After max retries, the event moves to the dead letter queue.

### Event Routing

| Event Type Pattern | Handler | Priority | Timeout |
|-------------------|---------|----------|---------|
| `{{PROVIDER_1}}:payment.*` | `handlePaymentEvent` | High | 30s |
| `{{PROVIDER_1}}:customer.*` | `handleCustomerEvent` | Medium | 30s |
| `{{PROVIDER_2}}:*` | `handleProvider2Event` | Low | 60s |

---

## 6. Dead Letter Queue (DLQ)

### DLQ Configuration

```
DLQ Name: webhooks-dead-letter
Retention: {{WEBHOOK_DLQ_RETENTION_DAYS}} days
Alert Threshold: {{WEBHOOK_DLQ_ALERT_THRESHOLD}} events in 1 hour
Alert Channel: {{HEALTH_ALERT_CHANNEL}}
```

### DLQ Event Schema

Each DLQ entry should store:
- Original event payload (raw body)
- Provider and event type
- Event ID
- All attempts with timestamps and error messages
- Signature verification result
- HTTP headers from original request

### Replay Mechanism

Requirements for replay capability:
1. Admin endpoint or CLI command to replay specific events by ID
2. Bulk replay by provider, event type, or time range
3. Replay counter to distinguish replayed events from originals
4. Replay should go through the full processing pipeline (including idempotency check — clear the event ID first)

### DLQ Monitoring

- [ ] Dashboard showing DLQ depth over time
- [ ] Alert when DLQ depth exceeds threshold
- [ ] Daily digest of DLQ events by provider and error type
- [ ] Weekly review of DLQ patterns (recurring failures indicate integration bugs)

---

## 7. Outbound Webhooks (If Your App Sends Events)

> Skip this section if your application does not send webhook events to consumers.

### Outbound Event Catalog

| Event | Payload Schema | Trigger | Consumers |
|-------|---------------|---------|-----------|
| `{{EVENT_1}}` | `{{SCHEMA_1}}` | {{TRIGGER_1}} | {{CONSUMERS_1}} |

### Delivery Guarantees

- **Signing:** All outbound webhooks signed with HMAC-SHA256 using per-consumer secret
- **Delivery:** At-least-once with exponential backoff retry
- **Retry policy:** 5 attempts over 24 hours (30s, 5m, 30m, 2h, 12h)
- **Timeout:** 10 second response timeout per delivery attempt
- **Failure handling:** After max retries, mark endpoint as inactive. Notify consumer via email.

### Consumer Management

| Consumer | Endpoint URL | Secret Key | Events Subscribed | Status |
|----------|-------------|------------|-------------------|--------|
| {{CONSUMER_1}} | {{ENDPOINT_1}} | Stored in {{SECRETS_MANAGER}} | {{EVENTS}} | Active / Inactive |

---

## 8. Development & Testing

### Local Development

| Tool | Purpose | Configuration |
|------|---------|---------------|
| ngrok / Cloudflare Tunnel | Expose local server to receive webhooks | `ngrok http {{LOCAL_PORT}}` |
| Stripe CLI | Forward Stripe events locally | `stripe listen --forward-to localhost:{{LOCAL_PORT}}/api/webhooks/stripe` |
| Provider CLI tools | Provider-specific webhook forwarding | {{PROVIDER_CLI_CONFIG}} |

### Test Fixtures

Store webhook payload fixtures for each event type:
```
tests/
  fixtures/
    webhooks/
      {{PROVIDER_1}}/
        {{EVENT_TYPE_1}}.json
        {{EVENT_TYPE_2}}.json
      {{PROVIDER_2}}/
        {{EVENT_TYPE_3}}.json
```

### Webhook Testing Checklist

- [ ] Signature verification rejects tampered payloads
- [ ] Signature verification rejects missing signatures
- [ ] Duplicate events are idempotently ignored
- [ ] Out-of-order events are handled correctly
- [ ] Failed processing moves events to DLQ
- [ ] DLQ replay reprocesses events successfully
- [ ] Queue worker handles concurrent events without race conditions
- [ ] Timeout handling works (slow handler doesn't block queue)
- [ ] Provider test/ping events return 200 without processing
