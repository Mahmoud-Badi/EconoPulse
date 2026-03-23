# Billing Testing Patterns

> How to test payment flows without processing real charges. Covers test mode, webhook simulation, and edge case testing.

---

## Stripe Test Mode

### Test API Keys

Every Stripe account has test mode keys (`pk_test_...`, `sk_test_...`). Test mode:
- Processes no real charges
- Uses test card numbers
- Generates test webhook events
- Has its own isolated data (customers, subscriptions, invoices)

**Environment setup:**

```env
# .env.development / .env.test
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### Test Card Numbers

| Scenario | Card Number | CVC | Expiry |
|----------|-------------|-----|--------|
| Successful payment | `4242 4242 4242 4242` | Any 3 digits | Any future date |
| Requires authentication (3D Secure) | `4000 0027 6000 3184` | Any | Any future |
| Declined (generic) | `4000 0000 0000 0002` | Any | Any future |
| Declined (insufficient funds) | `4000 0000 0000 9995` | Any | Any future |
| Declined (expired card) | `4000 0000 0000 0069` | Any | Any future |
| Declined (incorrect CVC) | `4000 0000 0000 0127` | Any | Any future |
| Successful with delayed charge | `4000 0000 0000 0077` | Any | Any future |

**Full list:** [Stripe Testing Documentation](https://docs.stripe.com/testing)

---

## Webhook Testing

### Local Webhook Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or: scoop install stripe              # Windows

# Login to your Stripe account
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger specific events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

### Automated Webhook Tests

```typescript
import { describe, it, expect } from 'vitest';
import { createMockStripeEvent } from '@/test/helpers/stripe';

describe('Stripe Webhook Handler', () => {
  it('handles checkout.session.completed', async () => {
    const event = createMockStripeEvent('checkout.session.completed', {
      customer: 'cus_test_123',
      subscription: 'sub_test_456',
      metadata: { userId: testUser.id },
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/webhooks/stripe',
      headers: { 'stripe-signature': generateTestSignature(event) },
      payload: event,
    });

    expect(response.statusCode).toBe(200);

    // Verify database was updated
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, 'sub_test_456'),
    });
    expect(subscription).toBeDefined();
    expect(subscription!.status).toBe('active');
  });

  it('handles invoice.payment_failed', async () => {
    // Set up: create an active subscription
    await createTestSubscription({ status: 'active' });

    const event = createMockStripeEvent('invoice.payment_failed', {
      subscription: 'sub_test_456',
      attempt_count: 1,
    });

    await handleWebhook(event);

    const subscription = await getSubscription('sub_test_456');
    expect(subscription.status).toBe('past_due');
  });

  it('is idempotent — handles duplicate events', async () => {
    const event = createMockStripeEvent('checkout.session.completed', {
      customer: 'cus_test_123',
    });

    // Process same event twice
    await handleWebhook(event);
    await handleWebhook(event);

    // Should only create one customer record
    const customers = await db.query.customers.findMany({
      where: eq(customers.stripeCustomerId, 'cus_test_123'),
    });
    expect(customers).toHaveLength(1);
  });
});
```

### Mock Stripe Event Helper

```typescript
// test/helpers/stripe.ts
import Stripe from 'stripe';

export function createMockStripeEvent(
  type: string,
  data: Record<string, unknown>,
  id?: string,
): Stripe.Event {
  return {
    id: id ?? `evt_test_${Date.now()}`,
    type,
    data: { object: data },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    api_version: '2024-12-18.acacia',
    object: 'event',
    request: null,
    pending_webhooks: 0,
  } as unknown as Stripe.Event;
}

export function generateTestSignature(payload: unknown): string {
  const crypto = require('crypto');
  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}
```

---

## Subscription Lifecycle Tests

Test every state transition in the subscription lifecycle:

```
                    ┌── checkout ──► active ──► canceled
                    │                  │
           incomplete ◄────────────────┤
                    │                  │
                    │              past_due ──► unpaid ──► canceled
                    │                  │
                    │              trialing ──► active
                    │
                    └── (failed) ──► incomplete_expired
```

### Critical Test Scenarios

| # | Scenario | How to Test | Verify |
|---|----------|-------------|--------|
| 1 | New subscription (success) | Use `4242...` card | DB record created, access granted |
| 2 | New subscription (3D Secure) | Use `4000 0027 6000 3184` card | Redirect to 3DS, then success |
| 3 | New subscription (declined) | Use `4000 0000 0000 0002` card | Error shown, no DB record |
| 4 | Trial starts | Create subscription with `trial_period_days` | Status = `trialing`, full access |
| 5 | Trial ends → paid | Wait for trial end (or fast-forward in test) | Status transitions to `active` |
| 6 | Trial ends → no card | Create trial without payment method | Status = `past_due`, dunning starts |
| 7 | Payment fails (renewal) | `stripe trigger invoice.payment_failed` | Status = `past_due`, dunning email sent |
| 8 | Payment recovered | After failure, trigger `invoice.paid` | Status back to `active` |
| 9 | All retries exhausted | Multiple `invoice.payment_failed` events | Status = `unpaid`, access restricted |
| 10 | Customer cancels | Cancel via UI or API | `cancel_at_period_end = true`, access until period end |
| 11 | Immediate cancellation | Cancel with `prorate: true` | Access revoked, prorated refund |
| 12 | Plan upgrade | Change from Pro to Business | Prorated charge, new plan access immediately |
| 13 | Plan downgrade | Change from Business to Pro | New plan at next period, no immediate change |
| 14 | Resubscribe after cancel | Customer resubscribes during cancelation period | Cancelation reversed, access continues |

---

## Billing Integration Smoke Test

Run before every deploy that touches billing code:

```typescript
describe('Billing Smoke Test', () => {
  it('creates a checkout session', async () => {
    const session = await createCheckoutSession(testUser, 'pro_monthly');
    expect(session.url).toBeTruthy();
  });

  it('retrieves subscription status', async () => {
    const status = await getSubscriptionStatus(testUser.id);
    expect(['active', 'trialing', 'free']).toContain(status);
  });

  it('generates customer portal link', async () => {
    const portal = await createCustomerPortalSession(testUser);
    expect(portal.url).toContain('billing.stripe.com');
  });

  it('handles webhook signature verification', async () => {
    const validEvent = createMockStripeEvent('ping', {});
    const validSig = generateTestSignature(validEvent);
    expect(() => verifyWebhookSignature(validEvent, validSig)).not.toThrow();

    const invalidSig = 't=123,v1=invalid';
    expect(() => verifyWebhookSignature(validEvent, invalidSig)).toThrow();
  });
});
```

---

## Common Billing Bugs to Test For

| Bug | Test |
|-----|------|
| Double charges | Process same checkout session twice — should only create one subscription |
| Access after cancellation | Cancel subscription, verify access continues until period end |
| Stale cache | Update plan, verify features reflect new plan immediately (not cached old plan) |
| Timezone issues | Create subscription near midnight UTC — verify period boundaries are correct |
| Currency mismatch | Verify amounts display correctly in customer's currency |
| Webhook ordering | Send `subscription.deleted` before `subscription.created` — should handle gracefully |
| Missing customer | Webhook references a Stripe customer ID not in your database — should create or skip gracefully |
| Free tier regression | Create paid subscription, cancel it, verify free tier limits apply (not paid limits cached) |

---

## Testing Checklist

- [ ] All test card numbers from table above have been verified
- [ ] Stripe CLI configured for local webhook forwarding
- [ ] Webhook handler tests cover all event types from webhook mapping
- [ ] Idempotency tested (duplicate events produce same result)
- [ ] All 14 subscription lifecycle scenarios tested
- [ ] Billing smoke test runs in CI pipeline
- [ ] Common billing bugs tested for
- [ ] Test and live Stripe API keys are properly separated per environment
- [ ] No test mode artifacts exist in production Stripe account
