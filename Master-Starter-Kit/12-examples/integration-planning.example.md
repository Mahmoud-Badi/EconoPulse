# Integration Planning: Stripe Billing — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in integration plan for
# Stripe billing in a fictional TaskFlow project. Your integration
# plans will be generated from the template in 02-architecture/.
# ============================================================

> **Service:** Stripe (Billing & Payments)
> **Phase:** 3 (Polish & Launch)
> **Priority:** P1 — Required for launch

---

## 1. Environment Variables

```bash
# .env.example additions
STRIPE_SECRET_KEY=sk_test_...          # Server-side API key
STRIPE_PUBLISHABLE_KEY=pk_test_...     # Client-side key (safe to expose)
STRIPE_WEBHOOK_SECRET=whsec_...        # Webhook signature verification
STRIPE_PRO_PRICE_ID=price_...          # Pro tier monthly price
STRIPE_AGENCY_PRICE_ID=price_...       # Agency tier monthly price
```

## 2. Package Layout

```
packages/
  billing/
    src/
      stripe-client.ts       # Stripe SDK initialization
      checkout.service.ts     # Create checkout sessions
      subscription.service.ts # Manage subscriptions (upgrade, cancel, resume)
      webhook.handler.ts      # Process Stripe webhooks
      types.ts                # Stripe-related type definitions
    __tests__/
      checkout.test.ts
      subscription.test.ts
      webhook.test.ts
```

## 3. Client Setup

```typescript
// packages/billing/src/stripe-client.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});
```

## 4. Webhook Endpoint

```typescript
// apps/api/src/routes/stripe-webhook.ts
// Route: POST /api/webhooks/stripe

import { stripe } from "@taskflow/billing";

export async function handleStripeWebhook(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case "checkout.session.completed":
      // Activate subscription, update workspace plan
      break;
    case "customer.subscription.updated":
      // Handle plan changes (upgrade/downgrade)
      break;
    case "customer.subscription.deleted":
      // Downgrade to free tier
      break;
    case "invoice.payment_failed":
      // Send payment failure notification, set grace period
      break;
  }

  return new Response("ok", { status: 200 });
}
```

## 5. Error Handling

| Error | HTTP Code | Handling |
|-------|----------|---------|
| Card declined | 402 | Show user-friendly message, suggest updating payment method |
| Invalid API key | 500 | Log error, show generic "billing unavailable" message |
| Webhook signature invalid | 400 | Reject silently (likely replay attack), log for investigation |
| Rate limited | 429 | Retry with exponential backoff (max 3 retries) |
| Network timeout | 504 | Retry once after 5 seconds, then show error to user |
| Duplicate subscription | 409 | Check existing subscription before creating, idempotency key |

## 6. Mock Fallback (Development)

When `STRIPE_SECRET_KEY` is not set or starts with `sk_test_`:

```typescript
// packages/billing/src/stripe-client.ts
export const isTestMode = !process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

// In development without Stripe keys:
// - Checkout redirects to a mock success page
// - All workspaces default to "Pro" plan
// - Webhook endpoint returns 200 without processing
```

## 7. Database Changes

```sql
-- Add billing columns to workspaces table
ALTER TABLE workspaces ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE workspaces ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE workspaces ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE workspaces ADD COLUMN plan_expires_at TIMESTAMP;

CREATE INDEX idx_workspaces_stripe_customer ON workspaces(stripe_customer_id);
```

## 8. Testing Strategy

| Test Type | What | How |
|----------|------|-----|
| Unit | Checkout session creation | Mock Stripe SDK, verify params |
| Unit | Subscription status mapping | Test all Stripe status → app status mappings |
| Integration | Webhook processing | Send mock webhook events, verify DB updates |
| Integration | Plan enforcement | Create workspace, verify feature gates by plan |
| E2E | Full upgrade flow | Stripe test mode, real checkout, verify plan change |

## 9. Integration Checklist

- [ ] Stripe account created and verified
- [ ] Products and prices created in Stripe dashboard (Pro + Agency)
- [ ] Webhook endpoint registered in Stripe dashboard
- [ ] All 4 webhook events subscribed (checkout, subscription updated, subscription deleted, payment failed)
- [ ] Test mode checkout flow works end-to-end
- [ ] Plan enforcement gates implemented (project limits, user limits)
- [ ] Grace period logic for failed payments (7 days before downgrade)
- [ ] Customer portal link configured (for self-service billing management)
- [ ] Stripe publishable key exposed to frontend via env var
- [ ] Error handling covers all scenarios in Section 5
