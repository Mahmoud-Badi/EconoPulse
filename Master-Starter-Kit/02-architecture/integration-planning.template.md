# Integration Plan: {{SERVICE_NAME}}

## Overview

**Service:** {{SERVICE_NAME}}
**Purpose:** {{WHY_THIS_INTEGRATION_EXISTS}}
**Package Location:** `packages/services/src/{service-name}/`
**Phase:** {{WHICH_DEVELOPMENT_PHASE}}
**Priority:** {Critical / Important / Nice-to-have}
**Estimated Effort:** {X hours/days}

---

## Configuration

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `{{SERVICE}}_API_KEY` | {{DESCRIPTION}} | Yes | `sk_test_...` |
| `{{SERVICE}}_SECRET` | {{DESCRIPTION}} | Yes | `whsec_...` |
| `{{SERVICE}}_WEBHOOK_SECRET` | {{DESCRIPTION}} | If using webhooks | `whsec_...` |
| `{{SERVICE}}_PUBLIC_KEY` | {{DESCRIPTION}} | If client-side needed | `pk_test_...` |

### .env.example Entry

```
# {SERVICE_NAME}
{SERVICE}_API_KEY=
{SERVICE}_SECRET=
{SERVICE}_WEBHOOK_SECRET=
```

---

## Package Structure

```
packages/services/src/{service-name}/
  client.ts       # Initialized API client
  types.ts        # Service-specific types
  mock.ts         # Mock implementation for development
  index.ts        # Public API exports
```

### Client Setup

```typescript
// packages/services/src/{service-name}/client.ts
import { {ServiceClient} } from "{service-sdk}";

const client = new {ServiceClient}(process.env.{SERVICE}_API_KEY!);

export const {serviceName} = {
  // Method wrappers that handle errors and type conversion
  async {method1}(params: {Input1}): Promise<{Output1}> {
    try {
      const result = await client.{method1}(params);
      return mapToAppType(result);
    } catch (error) {
      throw new IntegrationError("{SERVICE_NAME}", "{method1}", error);
    }
  },

  async {method2}(params: {Input2}): Promise<{Output2}> {
    // ...
  },
};
```

### Mock Fallback

```typescript
// packages/services/src/{service-name}/mock.ts
export const {serviceName}Mock = {
  async {method1}(params: {Input1}): Promise<{Output1}> {
    // Return realistic mock data for development
    return {
      id: "mock_" + crypto.randomUUID(),
      // ... mock fields
    };
  },

  async {method2}(params: {Input2}): Promise<{Output2}> {
    return { /* mock */ };
  },
};
```

### Smart Client Export (Auto-Mock in Development)

```typescript
// packages/services/src/{service-name}/index.ts
import { {serviceName} as real } from "./client";
import { {serviceName}Mock as mock } from "./mock";

// Use real client when API key is configured, mock otherwise
export const {serviceName} = process.env.{SERVICE}_API_KEY ? real : mock;
```

---

## Webhook Endpoint

**Route:** `apps/web/src/app/api/webhooks/{service-name}/route.ts`
**Method:** POST
**Auth:** Signature verification (not session-based)

```typescript
// apps/web/src/app/api/webhooks/{service-name}/route.ts
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("{signature-header}");

  // Step 1: Verify webhook signature
  const isValid = verify{Service}Signature(body, signature, process.env.{SERVICE}_WEBHOOK_SECRET!);
  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Step 2: Parse event
  const event = JSON.parse(body) as {ServiceWebhookEvent};

  // Step 3: Handle event types
  switch (event.type) {
    case "{event_type_1}":
      await handle{EventType1}(event.data);
      break;
    case "{event_type_2}":
      await handle{EventType2}(event.data);
      break;
    default:
      console.log(`Unhandled webhook event: ${event.type}`);
  }

  // Step 4: Return 200 quickly (process async if needed)
  return new Response("OK", { status: 200 });
}
```

---

## Error Handling

| Error Type | Handling Strategy |
|-----------|------------------|
| API key invalid/expired | Throw `IntegrationError`, alert admin |
| Rate limited (429) | Retry with exponential backoff (max 3 retries) |
| Service down (5xx) | Retry once, then queue for later processing |
| Invalid input (4xx) | Log and surface user-friendly message |
| Webhook signature invalid | Return 401, log attempt |
| Network timeout | Retry once with longer timeout |

### Integration Error Class

```typescript
// packages/services/src/error.ts
export class IntegrationError extends Error {
  constructor(
    public service: string,
    public method: string,
    public originalError: unknown,
  ) {
    super(`${service}.${method} failed: ${String(originalError)}`);
    this.name = "IntegrationError";
  }
}
```

---

## Gotchas

1. {{GOTCHA_1}} — e.g., "Stripe webhook events can arrive out of order. Always check event timestamp."
2. {{GOTCHA_2}} — e.g., "Twilio trial accounts can only send to verified phone numbers."
3. {{GOTCHA_3}} — e.g., "Google Maps geocoding has a 2,500/day free limit. Cache results aggressively."

---

## Testing Strategy

| Test Type | What to Test | How |
|-----------|-------------|-----|
| Unit | Mock client methods return correct types | Vitest with mock client |
| Integration | Real API calls with test credentials | Vitest with `.env.test` |
| Webhook | Event handling with sample payloads | Mock POST to webhook endpoint |
| E2E | Full flow from UI action to external service | Playwright with mock server |

---

# Pre-filled Integration Examples

Below are common integrations with their specific configurations pre-filled as reference.

---

## Example: Stripe (Payments)

**Service:** Stripe
**Purpose:** Payment processing, subscription management, invoice generation
**Package:** `packages/services/src/stripe/`
**Phase:** After billing domain is built

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Server-side API key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Client-side key (for Stripe Elements) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification | Yes |

### Key Methods

```typescript
export const stripe = {
  async createCustomer(params: { email: string; name: string; orgId: string }) { },
  async createPaymentIntent(params: { amountInCents: number; customerId: string }) { },
  async createInvoice(params: { customerId: string; items: LineItem[] }) { },
  async handleWebhook(event: Stripe.Event) { },
};
```

### Gotchas
1. Always use `amountInCents` (Stripe expects cents, not dollars)
2. Webhook events can arrive out of order and may be duplicated — use idempotency keys
3. Test mode keys start with `sk_test_` and `pk_test_`; production with `sk_live_` and `pk_live_`
4. Stripe.js must load from `js.stripe.com` (not npm) for PCI compliance

---

## Example: Twilio (SMS / Voice)

**Service:** Twilio
**Purpose:** SMS notifications, voice calls, two-factor authentication
**Package:** `packages/services/src/twilio/`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Account identifier | Yes |
| `TWILIO_AUTH_TOKEN` | API authentication | Yes |
| `TWILIO_PHONE_NUMBER` | Sending phone number | Yes |

### Key Methods

```typescript
export const twilio = {
  async sendSMS(params: { to: string; body: string }) { },
  async makeCall(params: { to: string; twiml: string }) { },
  async sendVerificationCode(params: { to: string }) { },
  async verifyCode(params: { to: string; code: string }) { },
};
```

### Gotchas
1. Trial accounts can only send to verified numbers
2. Phone numbers must be in E.164 format (`+1234567890`)
3. SMS body limit is 1,600 characters (splits into multiple segments at 160)
4. Twilio charges per segment, not per message

---

## Example: SendGrid (Email)

**Service:** SendGrid
**Purpose:** Transactional emails (password reset, invoices, notifications)
**Package:** `packages/services/src/sendgrid/`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SENDGRID_API_KEY` | API key | Yes |
| `SENDGRID_FROM_EMAIL` | Verified sender email | Yes |
| `SENDGRID_FROM_NAME` | Sender display name | Yes |

### Key Methods

```typescript
export const email = {
  async sendTransactional(params: { to: string; templateId: string; data: Record<string, unknown> }) { },
  async sendPasswordReset(params: { to: string; resetUrl: string }) { },
  async sendInvoice(params: { to: string; invoiceId: string; pdfUrl: string }) { },
  async sendWelcome(params: { to: string; userName: string }) { },
};
```

### Gotchas
1. Sender email must be verified in SendGrid dashboard (SPF/DKIM records)
2. Dynamic template IDs are different between sandbox and production
3. Rate limit is 600 emails/day on free tier
4. Always use templates — never construct HTML in code

---

## Example: Google Maps (Geocoding / Routing)

**Service:** Google Maps Platform
**Purpose:** Address geocoding, route calculation, distance/duration estimates
**Package:** `packages/services/src/maps/`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_MAPS_API_KEY` | Server-side API key | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Client-side maps rendering | If using maps UI |

### Key Methods

```typescript
export const maps = {
  async geocode(address: string): Promise<{ lat: number; lng: number }> { },
  async reverseGeocode(lat: number, lng: number): Promise<string> { },
  async getRoute(origin: string, destination: string): Promise<{ distanceMeters: number; durationSeconds: number }> { },
  async getDistanceMatrix(origins: string[], destinations: string[]): Promise<DistanceMatrix> { },
};
```

### Gotchas
1. Geocoding API: 2,500 free requests/day, then $5/1,000 requests
2. ALWAYS cache geocoding results — addresses don't change, and API is expensive
3. Distance Matrix API charges per element (origins x destinations)
4. Restrict API key by HTTP referrer (client) and IP address (server)

---

## Example: S3 / Vercel Blob (File Storage)

**Service:** Vercel Blob (or AWS S3)
**Purpose:** File uploads (documents, images, PDFs)
**Package:** `packages/services/src/storage/`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Yes (Vercel) |
| `AWS_S3_BUCKET` | S3 bucket name | Yes (S3) |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes (S3) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes (S3) |

### Key Methods

```typescript
export const storage = {
  async upload(file: File, path: string): Promise<{ url: string; size: number }> { },
  async delete(url: string): Promise<void> { },
  async getSignedUrl(path: string, expiresIn: number): Promise<string> { },
  async listFiles(prefix: string): Promise<FileInfo[]> { },
};
```

### Gotchas
1. Vercel Blob is simpler but Vercel-only; S3 is portable but more setup
2. Always validate file type and size server-side (not just client-side)
3. Set max file size in API route: `export const config = { api: { bodyParser: { sizeLimit: "10mb" } } }`
4. Store file references in DB (URL + metadata), not the files themselves

---

## Integration Planning Checklist

- [ ] All required integrations identified from VERDICT
- [ ] Each integration has a planning document
- [ ] Environment variables documented in `.env.example`
- [ ] Mock fallbacks designed for development
- [ ] Webhook endpoints planned with signature verification
- [ ] Error handling strategy defined per integration
- [ ] Rate limits and quotas documented
- [ ] Cost implications calculated (free tier limits)
- [ ] Testing strategy includes integration tests with test credentials
