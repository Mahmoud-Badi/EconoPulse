# Integrations Map

> Every third-party service the app connects to: what it does, how it authenticates, how to develop without it, and when to integrate it.
> Core principle: **Every integration must have a mock fallback.** No developer should be blocked because an API key isn't configured.

---

## The Graceful Degradation Pattern

Every external integration in this project follows the same pattern:

```typescript
// integration-client.ts
export function getPaymentClient() {
  if (env.STRIPE_SECRET_KEY) {
    return new StripeClient(env.STRIPE_SECRET_KEY);
  }

  console.warn("[MOCK] Stripe not configured — using mock payment client");
  return new MockPaymentClient();
}
```

**Rules:**
1. **Never crash if an API key is missing.** Log a warning and use the mock.
2. **Mock clients return realistic fake data.** Not empty responses — believable data that exercises the UI.
3. **Mock clients simulate latency.** Add 200-500ms delays so the UI handles loading states correctly.
4. **Mock clients simulate errors.** 5% of mock calls should randomly fail so error handling gets tested.
5. **Integration clients are injected, not imported.** Use a factory function so tests can swap in mocks.

---

## Integration Inventory

### Active Integrations (This Project)

| # | Service | Purpose | API Type | Auth Method | Mock Strategy | Env Vars | Phase | Status |
|---|---------|---------|----------|-------------|---------------|----------|-------|--------|
| 1 | {{SERVICE_NAME}} | {{PURPOSE}} | {REST/SDK/Webhook/GraphQL} | {API Key/OAuth/JWT/HMAC} | {{MOCK_APPROACH}} | {{VAR_1}}, {{VAR_2}} | {{PHASE}} | {Not Started/In Progress/Done} |
| 2 | {{SERVICE_NAME}} | {{PURPOSE}} | {REST/SDK/Webhook/GraphQL} | {API Key/OAuth/JWT/HMAC} | {{MOCK_APPROACH}} | {{VAR_1}}, {{VAR_2}} | {{PHASE}} | {Not Started/In Progress/Done} |
| 3 | {{SERVICE_NAME}} | {{PURPOSE}} | {REST/SDK/Webhook/GraphQL} | {API Key/OAuth/JWT/HMAC} | {{MOCK_APPROACH}} | {{VAR_1}}, {{VAR_2}} | {{PHASE}} | {Not Started/In Progress/Done} |
| 4 | {{SERVICE_NAME}} | {{PURPOSE}} | {REST/SDK/Webhook/GraphQL} | {API Key/OAuth/JWT/HMAC} | {{MOCK_APPROACH}} | {{VAR_1}}, {{VAR_2}} | {{PHASE}} | {Not Started/In Progress/Done} |
| 5 | {{SERVICE_NAME}} | {{PURPOSE}} | {REST/SDK/Webhook/GraphQL} | {API Key/OAuth/JWT/HMAC} | {{MOCK_APPROACH}} | {{VAR_1}}, {{VAR_2}} | {{PHASE}} | {Not Started/In Progress/Done} |

---

## Common Integrations Reference

Pre-filled entries for the most common third-party services. Copy the ones you need into the Active Integrations table above.

---

### Stripe (Payments)

| Field | Value |
|-------|-------|
| **Service** | Stripe |
| **Purpose** | Payment processing — subscriptions, one-time payments, invoicing, payouts |
| **API Type** | SDK (`stripe` npm package) + Webhooks for async events |
| **Auth Method** | API Key (secret key server-side, publishable key client-side) |
| **Env Vars** | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Phase** | Typically Phase 5+ (after core features work) |

**Mock Strategy:**
- Use Stripe's built-in **test mode** (test API keys return fake data, no real charges)
- For fully offline development: mock client that returns fake `PaymentIntent`, `Subscription`, and `Invoice` objects
- Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) for testing webhooks locally

**Key Webhook Events to Handle:**
- `checkout.session.completed` — Payment succeeded
- `invoice.payment_failed` — Subscription payment failed
- `customer.subscription.updated` — Plan changed
- `customer.subscription.deleted` — Subscription cancelled

**Gotchas:**
- Always verify webhook signatures server-side (prevent spoofed events)
- Store Stripe customer IDs in your database (map internal users to Stripe customers)
- Use idempotency keys for all write operations (prevent duplicate charges)
- Stripe amounts are in cents (multiply by 100 before sending, divide by 100 for display)

---

### Twilio (SMS & Voice)

| Field | Value |
|-------|-------|
| **Service** | Twilio |
| **Purpose** | SMS notifications, voice calls, phone number verification |
| **API Type** | REST API + SDK (`twilio` npm package) |
| **Auth Method** | Account SID + Auth Token |
| **Env Vars** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| **Phase** | Typically Phase 4+ (after core notification system exists) |

**Mock Strategy:**
- Mock client that logs messages to console instead of sending SMS
- Store "sent" messages in a local `mock_messages` table for verification
- Return fake message SIDs so the app flow continues normally
- For testing webhooks: Twilio provides a test credentials mode

**Gotchas:**
- Phone numbers must be in E.164 format (`+15551234567`)
- SMS has a 160-character limit (longer messages are split and cost more)
- Twilio rate limits: 1 message/second per phone number by default
- Voice calls require TwiML (XML-based call flow language)
- Cost: ~$0.0079/SMS in the US — can add up quickly at scale

---

### SendGrid / Resend (Email)

| Field | Value |
|-------|-------|
| **Service** | SendGrid or Resend |
| **Purpose** | Transactional emails — verification, password reset, notifications, reports |
| **API Type** | REST API + SDK |
| **Auth Method** | API Key |
| **Env Vars** | `SENDGRID_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` (or `RESEND_API_KEY` for Resend) |
| **Phase** | Phase 1 (needed for auth — email verification, password reset) |

**Mock Strategy:**
- In development: use `console.log` to print email HTML to terminal
- Alternative: use [Ethereal](https://ethereal.email/) — free fake SMTP that captures emails for inspection
- Alternative: use Resend's test mode (free tier: 100 emails/day)
- Store email payloads in a local `mock_emails` table for E2E test verification

**Gotchas:**
- Domain verification required for production (SPF, DKIM, DMARC records)
- SendGrid free tier: 100 emails/day. Resend free tier: 100 emails/day, 3,000/month
- Always use templates (not inline HTML) for maintainability
- Include unsubscribe links in marketing emails (CAN-SPAM compliance)
- Email delivery is async — don't block the user's action on email success

---

### Google Maps Platform (Geocoding, Routing, Distance)

| Field | Value |
|-------|-------|
| **Service** | Google Maps Platform |
| **Purpose** | Address geocoding, route calculation, distance/duration estimation, place autocomplete |
| **API Type** | REST API + JavaScript SDK (Maps JS API for frontend) |
| **Auth Method** | API Key (restricted by HTTP referrer for frontend, IP for backend) |
| **Env Vars** | `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **Phase** | Phase 2-3 (when location-based features are built) |

**Mock Strategy:**
- Mock geocoder returns hardcoded lat/lng for known test addresses
- Mock distance matrix returns calculated straight-line distance x 1.3 (approximation)
- Mock place autocomplete returns a static list of 5 test addresses
- For frontend maps: use Leaflet + OpenStreetMap (free) as a development fallback

**APIs You'll Likely Use:**
- **Geocoding API** — Address string to lat/lng coordinates
- **Distance Matrix API** — Travel time/distance between origins and destinations
- **Directions API** — Turn-by-turn route polylines
- **Places API (Autocomplete)** — Address typeahead in search/forms
- **Maps JavaScript API** — Interactive maps in the frontend

**Gotchas:**
- Google Maps is expensive at scale ($5-7 per 1,000 geocode requests)
- Always cache geocoding results (address rarely change)
- Use `sessiontoken` for Places Autocomplete to reduce costs (groups keystrokes into one billable session)
- Set billing alerts in Google Cloud Console
- Restrict API keys by HTTP referrer (frontend) and IP (backend)

---

### Vercel Blob (File Storage)

| Field | Value |
|-------|-------|
| **Service** | Vercel Blob |
| **Purpose** | File uploads — profile images, documents, CSV imports, report exports |
| **API Type** | SDK (`@vercel/blob`) |
| **Auth Method** | Vercel project token (auto-configured in Vercel deployments) |
| **Env Vars** | `BLOB_READ_WRITE_TOKEN` |
| **Phase** | Phase 2+ (when file upload features are built) |

**Mock Strategy:**
- In development: save files to `./uploads/` local directory
- Return fake blob URLs (`http://localhost:3000/uploads/filename.ext`)
- Serve local files via a Next.js API route during development
- For tests: use in-memory storage (Map of filename to Buffer)

**Alternatives:**
- **AWS S3** — More flexible, more complex. Use `@aws-sdk/client-s3`.
- **Cloudflare R2** — S3-compatible, cheaper egress. Good for high-bandwidth.
- **Supabase Storage** — Built into Supabase. Good if already using Supabase.

**Gotchas:**
- Vercel Blob has a 500MB max file size (Hobby) / 5GB (Pro)
- Files are publicly readable by default — use signed URLs for private files
- Always validate file types server-side (don't trust `Content-Type` headers)
- Generate unique filenames (UUID + original extension) to prevent collisions
- Set max file size limits in your upload form AND server-side validation

---

## Integration Architecture

### Folder Structure

```
packages/integrations/
  src/
    stripe/
      client.ts          -- Stripe client factory (real + mock)
      types.ts           -- Stripe-related types
      webhooks.ts        -- Webhook handler
      mock.ts            -- Mock client for development
    twilio/
      client.ts
      types.ts
      mock.ts
    email/
      client.ts
      templates/         -- Email templates (React Email or HTML)
      mock.ts
    maps/
      client.ts
      types.ts
      mock.ts
    storage/
      client.ts
      types.ts
      mock.ts
    index.ts             -- Re-exports all clients
```

### Environment Variable Checklist

| Variable | Required For | Where to Set | Secret? |
|----------|-------------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe payments | Vercel env vars | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe frontend | Vercel env vars (NEXT_PUBLIC_) | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks | Vercel env vars | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio SMS/Voice | Vercel env vars | Yes |
| `TWILIO_AUTH_TOKEN` | Twilio SMS/Voice | Vercel env vars | Yes |
| `TWILIO_PHONE_NUMBER` | Twilio sender | Vercel env vars | No |
| `SENDGRID_API_KEY` | Email delivery | Vercel env vars | Yes |
| `EMAIL_FROM_ADDRESS` | Email sender | Vercel env vars | No |
| `GOOGLE_MAPS_API_KEY` | Maps backend | Vercel env vars | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps frontend | Vercel env vars | No |
| `BLOB_READ_WRITE_TOKEN` | File storage | Vercel (auto) | Yes |

---

## Webhook Security Checklist

For every integration that sends webhooks to your app:

- [ ] Verify webhook signatures (Stripe, Twilio, etc. all sign their payloads)
- [ ] Use raw body parsing for signature verification (not JSON-parsed body)
- [ ] Return 200 quickly, process asynchronously (webhooks have timeout limits)
- [ ] Implement idempotency (webhooks can be sent more than once)
- [ ] Log all webhook events for debugging (but redact sensitive data)
- [ ] Set up webhook endpoint monitoring (alert if webhook processing fails)

---

## Integration Testing Strategy

| Level | What to Test | How |
|-------|-------------|-----|
| **Unit tests** | Mock client returns expected data | Vitest with mock clients |
| **Integration tests** | Real API calls with test credentials | Vitest with real test keys (CI only) |
| **E2E tests** | Full user flow with mock clients | Playwright with mock clients |
| **Smoke tests** | Production integration health check | Cron job hitting `/api/health/integrations` |

---

## Adding a New Integration

When you need to add a new third-party service:

1. Add a row to the Active Integrations table above
2. Create the folder structure under `packages/integrations/src/{service}/`
3. Implement the client factory (real + mock)
4. Add environment variables to `.env.example` and Vercel
5. Write unit tests for the mock client
6. Write integration tests for the real client (test credentials)
7. Document webhook events if applicable
8. Update the health check endpoint
