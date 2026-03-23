# Billing & Subscription Integration

> Billing integration for {{PROJECT_NAME}} using {{BILLING_PROVIDER}}. Covers provider setup, customer-tenant mapping, subscription lifecycle, webhook handling, dunning (failed payment recovery), proration, and the database schema that ties it all together. Revenue is the product — treat billing code with the same rigor as auth code.

---

## Prerequisites

- Billing provider: {{BILLING_PROVIDER}}
- Project: {{PROJECT_NAME}}
- Tenants table exists (from `row-level-tenant-patterns.template.md`)

---

## 1. Provider Comparison

Choose based on your business model, tax needs, and engineering capacity.

| Feature | Stripe | LemonSqueezy | Paddle |
|---------|--------|--------------|--------|
| **Pricing** | 2.9% + $0.30 | 5% + $0.50 | 5% + $0.50 |
| **Tax handling** | You manage (Stripe Tax add-on available) | They handle (MoR) | They handle (MoR) |
| **Merchant of record** | No (you are the MoR) | Yes | Yes |
| **Sales tax/VAT compliance** | Your responsibility | Included | Included |
| **API complexity** | High (most flexible) | Medium | Medium |
| **Customization** | Maximum | Limited | Limited |
| **Metered billing** | Native support | Limited | Limited |
| **Customer portal** | Built-in (hosted) | Built-in | Built-in |
| **Multi-currency** | 135+ currencies | Limited | 20+ currencies |
| **Dunning (retry logic)** | Smart Retries | Basic | Basic |
| **Webhook reliability** | Excellent | Good | Good |
| **SaaS-specific features** | Trials, prorations, usage-based | Trials, basic prorations | Trials, basic |
| **Best for** | Complex billing, US-centric, custom flows | Solo/small team, global tax burden | EU-centric, global tax burden |

### When to Use Which

- **Stripe**: You want maximum control, can handle tax compliance, have engineering capacity for complex integration. Most SaaS companies choose Stripe.
- **LemonSqueezy**: You want billing done in a weekend, need global tax compliance handled, accept higher fees for simplicity.
- **Paddle**: Similar to LemonSqueezy, stronger in EU markets, slightly more mature.

---

## 2. Database Schema

These tables exist alongside your `tenants` table and track all billing state locally. Never rely solely on the provider's dashboard — your database is the source of truth for access control.

```sql
-- Subscription plans (your pricing tiers)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,          -- 'Free', 'Pro', 'Business', 'Enterprise'
  slug VARCHAR(50) UNIQUE NOT NULL,    -- 'free', 'pro', 'business', 'enterprise'
  description TEXT,
  price_monthly_cents INTEGER NOT NULL, -- 0, 2900, 9900, custom
  price_yearly_cents INTEGER NOT NULL,  -- 0, 29000, 99000, custom
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  -- { "api_requests_per_hour": 1000, "storage_gb": 10, "seats": 5 }
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tenant subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  provider VARCHAR(20) NOT NULL,          -- 'stripe', 'lemonsqueezy', 'paddle'
  provider_subscription_id VARCHAR(255),  -- Stripe sub_xxx, LS sub_xxx
  provider_customer_id VARCHAR(255),      -- Stripe cus_xxx, LS cust_xxx
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  -- active | trialing | past_due | canceled | unpaid | paused
  billing_interval VARCHAR(10) NOT NULL,  -- 'monthly' | 'yearly'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_provider_id ON subscriptions(provider_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payment history
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  provider_invoice_id VARCHAR(255),
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'usd',
  status VARCHAR(20) NOT NULL,  -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  invoice_url VARCHAR(500),     -- hosted invoice URL from provider
  pdf_url VARCHAR(500),
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);

-- Payment methods (for display only — tokens stored at provider)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider_payment_method_id VARCHAR(255),
  type VARCHAR(20) NOT NULL,   -- 'card', 'bank_account', 'paypal'
  brand VARCHAR(20),           -- 'visa', 'mastercard', 'amex'
  last4 VARCHAR(4),
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_tenant ON payment_methods(tenant_id);
```

---

## 3. Provider Integration

<!-- IF {{BILLING_PROVIDER}} == "stripe" -->
### Stripe Integration

#### Setup

```typescript
// src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});
```

#### Customer Creation (On Tenant Signup)

```typescript
// src/billing/create-customer.ts
import { stripe } from "../lib/stripe";
import { db } from "../db/client";
import { tenants } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createStripeCustomer(tenantId: string) {
  const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).then(r => r[0]);

  const customer = await stripe.customers.create({
    name: tenant.name,
    email: tenant.ownerEmail,
    metadata: {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
    },
  });

  // Store Stripe customer ID on tenant
  await db.update(tenants)
    .set({ stripeCustomerId: customer.id })
    .where(eq(tenants.id, tenantId));

  return customer;
}
```

#### Checkout Session (Plan Upgrade)

```typescript
// src/billing/create-checkout.ts
export async function createCheckoutSession(
  tenantId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const tenant = await getTenantWithStripeId(tenantId);

  const session = await stripe.checkout.sessions.create({
    customer: tenant.stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: { tenantId },
      trial_period_days: 14,
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
  });

  return { url: session.url };
}
```

#### Customer Portal (Self-Serve Billing)

```typescript
// src/billing/customer-portal.ts
export async function createPortalSession(tenantId: string, returnUrl: string) {
  const tenant = await getTenantWithStripeId(tenantId);

  const session = await stripe.billingPortal.sessions.create({
    customer: tenant.stripeCustomerId,
    return_url: returnUrl,
  });

  return { url: session.url };
}
```

#### Webhook Handler

```typescript
// src/billing/stripe-webhook.ts
import { stripe } from "../lib/stripe";
import { db } from "../db/client";
import { subscriptions, invoices } from "../db/schema";
import { eq } from "drizzle-orm";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function handleStripeWebhook(req: Request) {
  // 1. Verify signature
  const sig = req.headers["stripe-signature"]!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // 2. Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }

    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleTrialEnding(subscription);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response("OK", { status: 200 });
}

async function syncSubscription(sub: Stripe.Subscription) {
  const tenantId = sub.metadata.tenantId;
  if (!tenantId) {
    console.error("Subscription missing tenantId metadata:", sub.id);
    return;
  }

  const planId = await resolvePlanFromPrice(sub.items.data[0].price.id);

  await db.insert(subscriptions)
    .values({
      tenantId,
      planId,
      provider: "stripe",
      providerSubscriptionId: sub.id,
      providerCustomerId: sub.customer as string,
      status: sub.status,
      billingInterval: sub.items.data[0].price.recurring?.interval === "year" ? "yearly" : "monthly",
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      trialStart: sub.trial_start ? new Date(sub.trial_start * 1000) : null,
      trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.providerSubscriptionId,
      set: {
        status: sub.status,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      },
    });

  // Update tenant plan
  await db.update(tenants)
    .set({ plan: planId })
    .where(eq(tenants.id, tenantId));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const tenantId = await getTenantIdFromCustomer(invoice.customer as string);

  // Record the failed invoice
  await db.insert(invoices).values({
    tenantId,
    providerInvoiceId: invoice.id,
    amountCents: invoice.amount_due,
    currency: invoice.currency,
    status: "open",
    invoiceUrl: invoice.hosted_invoice_url ?? undefined,
  });

  // Send notification to tenant admin
  await sendEmail({
    to: await getTenantAdminEmail(tenantId),
    template: "payment-failed",
    data: {
      amount: formatCents(invoice.amount_due, invoice.currency),
      retryDate: getNextRetryDate(),
      updatePaymentUrl: getPortalUrl(tenantId),
    },
  });
}

async function handleTrialEnding(sub: Stripe.Subscription) {
  const tenantId = sub.metadata.tenantId;
  // Send trial-ending email 3 days before expiry
  await sendEmail({
    to: await getTenantAdminEmail(tenantId),
    template: "trial-ending",
    data: {
      trialEndsAt: new Date(sub.trial_end! * 1000),
      upgradeUrl: getBillingUrl(tenantId),
    },
  });
}
```

#### Metered Billing (Usage-Based)

```typescript
// src/billing/report-usage.ts
export async function reportUsageToStripe(
  tenantId: string,
  quantity: number,
  timestamp?: number
) {
  const subscription = await getActiveSubscription(tenantId);
  const meteredItem = subscription.items.find(
    (item) => item.price.recurring?.usage_type === "metered"
  );

  if (!meteredItem) return;

  await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
    quantity,
    timestamp: timestamp ?? Math.floor(Date.now() / 1000),
    action: "increment",
  });
}
```
<!-- ENDIF -->

<!-- IF {{BILLING_PROVIDER}} == "lemonsqueezy" -->
### LemonSqueezy Integration

#### Setup

```typescript
// src/lib/lemonsqueezy.ts
const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY!;
const LS_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;

async function lsFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.lemonsqueezy.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${LS_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(`LemonSqueezy API error: ${res.status}`);
  return res.json();
}
```

#### Checkout URL Generation

```typescript
// src/billing/create-ls-checkout.ts
export async function createLSCheckout(
  tenantId: string,
  variantId: string,
  redirectUrl: string
) {
  const tenant = await getTenant(tenantId);

  const response = await lsFetch("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: { tenant_id: tenantId },
            email: tenant.ownerEmail,
            name: tenant.name,
          },
          product_options: {
            redirect_url: redirectUrl,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: LS_STORE_ID } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  return { url: response.data.attributes.url };
}
```

#### Webhook Handler

```typescript
// src/billing/ls-webhook.ts
import crypto from "node:crypto";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

export async function handleLSWebhook(req: Request) {
  // 1. Verify signature
  const body = await req.text();
  const signature = req.headers["x-signature"]!;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");

  if (signature !== hmac) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName = event.meta.event_name;
  const tenantId = event.meta.custom_data?.tenant_id;

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
      await syncLSSubscription(event.data, tenantId);
      break;

    case "subscription_cancelled":
      await handleLSCancellation(event.data, tenantId);
      break;

    case "subscription_payment_success":
      await handleLSPaymentSuccess(event.data, tenantId);
      break;

    case "subscription_payment_failed":
      await handleLSPaymentFailed(event.data, tenantId);
      break;
  }

  return new Response("OK", { status: 200 });
}
```
<!-- ENDIF -->

---

## 4. Dunning: Failed Payment Recovery

Dunning is the process of recovering failed payments. Without it, involuntary churn (customers who want to pay but cannot) eats revenue silently.

### Retry Schedule

| Attempt | Timing | Action |
|---------|--------|--------|
| 1 | Day 0 (payment fails) | Email: "Payment failed, please update card" |
| 2 | Day 3 | Auto-retry + email if still failing |
| 3 | Day 7 | Auto-retry + email with urgency |
| 4 | Day 14 | Final retry + warning: "Service will be restricted" |
| 5 | Day 21 | Mark subscription `past_due`, restrict features |
| 6 | Day 30 | Mark subscription `unpaid`, downgrade to free tier |
| 7 | Day 60 | Cancel subscription, notify tenant |

### Grace Period Implementation

```typescript
// src/billing/dunning.ts
export async function checkSubscriptionGracePeriod(tenantId: string) {
  const subscription = await getActiveSubscription(tenantId);

  if (subscription.status === "active" || subscription.status === "trialing") {
    return { access: "full" };
  }

  if (subscription.status === "past_due") {
    const daysSinceDue = daysBetween(subscription.currentPeriodEnd, new Date());

    if (daysSinceDue <= 7) {
      // Grace period: full access, show banner
      return { access: "full", warning: "payment_past_due" };
    }

    if (daysSinceDue <= 21) {
      // Restricted: read-only access, prominent banner
      return { access: "read_only", warning: "payment_past_due_restricted" };
    }

    // Beyond grace period: downgrade
    return { access: "free_tier", warning: "payment_failed_downgraded" };
  }

  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    return { access: "free_tier", warning: "subscription_inactive" };
  }

  return { access: "free_tier" };
}
```

### Access Control Middleware

```typescript
// src/middleware/subscription-gate.ts
export async function subscriptionGate(req: Request, res: Response, next: NextFunction) {
  const tenantId = getCurrentTenantId();
  const { access, warning } = await checkSubscriptionGracePeriod(tenantId);

  // Attach to request for downstream use
  req.subscriptionAccess = access;

  // Add warning header for frontend to display banners
  if (warning) {
    res.setHeader("X-Subscription-Warning", warning);
  }

  // Block writes for read-only access
  if (access === "read_only" && ["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return res.status(402).json({
      error: "Payment required",
      message: "Your payment is past due. Please update your payment method to continue.",
      updatePaymentUrl: "/settings/billing",
    });
  }

  next();
}
```

---

## 5. Proration on Plan Changes

When a tenant upgrades or downgrades mid-billing-cycle, proration calculates the fair amount.

<!-- IF {{BILLING_PROVIDER}} == "stripe" -->
### Stripe Proration

```typescript
// src/billing/change-plan.ts
export async function changePlan(
  tenantId: string,
  newPriceId: string,
  proration: "create_prorations" | "none" | "always_invoice" = "create_prorations"
) {
  const subscription = await getActiveStripeSubscription(tenantId);

  const updated = await stripe.subscriptions.update(subscription.id, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: proration,
    // Upgrade: charge immediately. Downgrade: credit on next invoice.
  });

  // Sync to local DB
  await syncSubscription(updated);

  return updated;
}

// Preview proration before confirming
export async function previewProration(tenantId: string, newPriceId: string) {
  const subscription = await getActiveStripeSubscription(tenantId);

  const invoice = await stripe.invoices.createPreview({
    customer: subscription.customer as string,
    subscription: subscription.id,
    subscription_items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    subscription_proration_behavior: "create_prorations",
  });

  return {
    amountDue: invoice.amount_due,
    currency: invoice.currency,
    lineItems: invoice.lines.data.map((line) => ({
      description: line.description,
      amount: line.amount,
    })),
  };
}
```
<!-- ENDIF -->

---

## 6. Plan Feature Gating

```typescript
// src/billing/feature-gate.ts
import { getCurrentTenantId } from "../db/tenant-context";

interface PlanLimits {
  apiRequestsPerHour: number;
  storageBytes: number;
  seats: number;
  aiRequestsPerDay: number;
  customDomain: boolean;
  ssoEnabled: boolean;
  auditLog: boolean;
  prioritySupport: boolean;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    apiRequestsPerHour: 100,
    storageBytes: 1_073_741_824,   // 1 GB
    seats: 1,
    aiRequestsPerDay: 10,
    customDomain: false,
    ssoEnabled: false,
    auditLog: false,
    prioritySupport: false,
  },
  pro: {
    apiRequestsPerHour: 1_000,
    storageBytes: 10_737_418_240,  // 10 GB
    seats: 5,
    aiRequestsPerDay: 100,
    customDomain: false,
    ssoEnabled: false,
    auditLog: true,
    prioritySupport: false,
  },
  business: {
    apiRequestsPerHour: 10_000,
    storageBytes: 107_374_182_400, // 100 GB
    seats: 25,
    aiRequestsPerDay: 1_000,
    customDomain: true,
    ssoEnabled: true,
    auditLog: true,
    prioritySupport: true,
  },
  enterprise: {
    apiRequestsPerHour: Infinity,
    storageBytes: Infinity,
    seats: Infinity,
    aiRequestsPerDay: Infinity,
    customDomain: true,
    ssoEnabled: true,
    auditLog: true,
    prioritySupport: true,
  },
};

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export async function checkFeatureAccess(feature: keyof PlanLimits): Promise<boolean> {
  const tenantId = getCurrentTenantId();
  const tenant = await getCachedTenant(tenantId);
  const limits = getPlanLimits(tenant.plan);
  return !!limits[feature];
}

export async function requireFeature(feature: keyof PlanLimits) {
  const hasAccess = await checkFeatureAccess(feature);
  if (!hasAccess) {
    throw new FeatureNotAvailableError(
      `This feature requires a higher plan. Please upgrade at /settings/billing.`
    );
  }
}
```

---

## 7. Webhook Security

**Never trust an unverified webhook.** Every provider signs webhook payloads. Always verify.

```typescript
// src/billing/webhook-security.ts

// Stripe signature verification
function verifyStripeWebhook(body: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
}

// LemonSqueezy HMAC verification
function verifyLSWebhook(body: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", LS_WEBHOOK_SECRET).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hmac));
}

// Paddle signature verification
function verifyPaddleWebhook(body: string, signature: string): boolean {
  const ts = signature.split(";")[0].split("=")[1];
  const h1 = signature.split(";")[1].split("=")[1];
  const payload = `${ts}:${body}`;
  const computed = crypto.createHmac("sha256", PADDLE_WEBHOOK_SECRET).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(computed));
}
```

---

## 8. Checklist

- [ ] Provider account created and API keys stored in env vars
- [ ] Customer created in provider on tenant signup
- [ ] Checkout flow creates subscription with `tenantId` in metadata
- [ ] Webhook endpoint deployed and signature verification active
- [ ] `subscriptions` table synced from webhook events
- [ ] `invoices` table populated from `invoice.paid` events
- [ ] Dunning flow handles `invoice.payment_failed` events
- [ ] Grace period logic restricts access on past-due payments
- [ ] Plan change proration tested (upgrade and downgrade)
- [ ] Customer portal link available in tenant settings
- [ ] Trial-ending notification emails configured
- [ ] Feature gating enforced based on plan limits
- [ ] Webhook events logged for debugging
- [ ] Idempotency: webhook handler handles duplicate events gracefully
