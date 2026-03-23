# Billing Domain Model — {{PROJECT_NAME}}

> Database schema design for billing entities. Adapt based on your billing model and payment provider.

---

## Core Principle

**Your payment provider (Stripe, Paddle, etc.) is the source of truth for payment state.** Your database stores a synchronized copy for:
- Fast lookups (don't call the Stripe API on every page load)
- Business logic (feature gating, usage checks)
- Reporting (MRR, churn, revenue analytics)
- Audit trail (who changed what plan and when)

---

## Entity Relationship Overview

```
┌─────────────┐     1:1      ┌─────────────────┐
│    users     │─────────────►│   customers     │
│              │              │ (Stripe mirror) │
└─────────────┘              └────────┬────────┘
                                      │ 1:N
                              ┌───────┴────────┐
                              │  subscriptions  │
                              │ (Stripe mirror) │
                              └───────┬────────┘
                                      │ 1:N
                              ┌───────┴────────┐
                              │    invoices     │
                              │ (Stripe mirror) │
                              └───────┬────────┘
                                      │ 1:N
                              ┌───────┴────────┐
                              │ invoice_items   │
                              └────────────────┘

┌─────────────┐
│    plans     │  (your product tiers — Free, Pro, Business)
└──────┬──────┘
       │ 1:N
┌──────┴──────┐
│   prices    │  (monthly/annual variants of each plan)
└─────────────┘

<!-- IF USAGE_BASED -->
┌─────────────────┐
│  usage_events   │  (raw consumption events)
└───────┬─────────┘
        │ aggregated into
┌───────┴─────────┐
│  usage_records  │  (billing-period summaries)
└─────────────────┘
<!-- ENDIF -->

<!-- IF HAS_COUPONS -->
┌─────────────────┐
│    coupons      │
└───────┬─────────┘
        │ applied to
┌───────┴─────────┐
│  coupon_usage   │
└─────────────────┘
<!-- ENDIF -->
```

---

## Schema Definitions

### Plans Table

Your product's pricing tiers. Managed by you, not synced from Stripe.

```sql
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,              -- 'Free', 'Pro', 'Business', 'Enterprise'
  slug            TEXT NOT NULL UNIQUE,       -- 'free', 'pro', 'business', 'enterprise'
  description     TEXT,
  features        JSONB NOT NULL DEFAULT '[]', -- ['Unlimited projects', '10GB storage', ...]
  limits          JSONB NOT NULL DEFAULT '{}', -- { "projects": 5, "storage_gb": 1, "seats": 1 }
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Prices Table

Pricing variants for each plan (monthly, annual, per-seat). Maps to Stripe Price objects.

```sql
CREATE TABLE prices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         UUID NOT NULL REFERENCES plans(id),
  stripe_price_id TEXT NOT NULL UNIQUE,       -- 'price_1234...'
  interval        TEXT NOT NULL,              -- 'month', 'year'
  interval_count  INTEGER NOT NULL DEFAULT 1, -- 1 for monthly, 1 for annual
  amount          INTEGER NOT NULL,           -- Price in cents (e.g., 1999 = $19.99)
  currency        TEXT NOT NULL DEFAULT 'usd',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IMPORTANT: Store amounts as integers (cents), NEVER as floats.
-- $19.99 = 1999 cents. This prevents floating-point rounding errors.
```

### Customers Table

Mirror of Stripe Customer objects. Links your users to their Stripe identity.

```sql
CREATE TABLE customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES users(id),
  stripe_customer_id  TEXT NOT NULL UNIQUE,    -- 'cus_1234...'
  email               TEXT NOT NULL,
  name                TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Subscriptions Table

Mirror of Stripe Subscription objects. This is your access control source.

```sql
CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id             UUID NOT NULL REFERENCES customers(id),
  plan_id                 UUID NOT NULL REFERENCES plans(id),
  price_id                UUID NOT NULL REFERENCES prices(id),
  stripe_subscription_id  TEXT NOT NULL UNIQUE,    -- 'sub_1234...'
  status                  TEXT NOT NULL,            -- See status enum below
  current_period_start    TIMESTAMPTZ NOT NULL,
  current_period_end      TIMESTAMPTZ NOT NULL,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
  canceled_at             TIMESTAMPTZ,
  ended_at                TIMESTAMPTZ,
  trial_start             TIMESTAMPTZ,
  trial_end               TIMESTAMPTZ,
  metadata                JSONB DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscription status enum:
-- 'trialing'       → In free trial period
-- 'active'         → Paying and active
-- 'past_due'       → Payment failed, in grace period (dunning)
-- 'canceled'       → Canceled but access continues until period end
-- 'unpaid'         → All payment retries exhausted
-- 'incomplete'     → Initial payment failed
-- 'paused'         → Manually paused (if your product supports this)
```

### Invoices Table

```sql
CREATE TABLE invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         UUID NOT NULL REFERENCES customers(id),
  subscription_id     UUID REFERENCES subscriptions(id),
  stripe_invoice_id   TEXT NOT NULL UNIQUE,
  status              TEXT NOT NULL,           -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  amount_due          INTEGER NOT NULL,        -- Cents
  amount_paid         INTEGER NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'usd',
  invoice_url         TEXT,                    -- Stripe-hosted invoice URL
  invoice_pdf         TEXT,                    -- PDF download URL
  period_start        TIMESTAMPTZ,
  period_end          TIMESTAMPTZ,
  due_date            TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

<!-- IF USAGE_BASED -->
### Usage Events Table

Raw consumption events. High-write, append-only.

```sql
CREATE TABLE usage_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  metric          TEXT NOT NULL,              -- 'api_calls', 'storage_gb', 'messages_sent'
  quantity        NUMERIC NOT NULL DEFAULT 1,
  timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  idempotency_key TEXT UNIQUE,               -- Prevent double-counting
  metadata        JSONB DEFAULT '{}'
);

-- Index for billing aggregation
CREATE INDEX idx_usage_events_billing
  ON usage_events (customer_id, metric, timestamp);

-- IMPORTANT: Use an idempotency key to prevent duplicate events.
-- If the event reporter retries, the same key prevents double-billing.
```

### Usage Records Table

Aggregated usage per billing period. Used for invoicing.

```sql
CREATE TABLE usage_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  metric          TEXT NOT NULL,
  quantity        NUMERIC NOT NULL,
  period_start    TIMESTAMPTZ NOT NULL,
  period_end      TIMESTAMPTZ NOT NULL,
  reported_to_stripe BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(customer_id, metric, period_start)
);
```
<!-- ENDIF -->

<!-- IF HAS_CREDITS -->
### Credits / Credit Balance

For products that offer account credits (referral bonuses, compensation, etc.).

```sql
CREATE TABLE credit_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id),
  amount          INTEGER NOT NULL,          -- Positive = credit added, negative = credit used
  balance_after   INTEGER NOT NULL,          -- Running balance after this transaction
  reason          TEXT NOT NULL,             -- 'referral_bonus', 'compensation', 'usage_deduction'
  reference_id    TEXT,                      -- Links to invoice, referral, support ticket, etc.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
<!-- ENDIF -->

---

## Access Control Pattern

How to check if a user has access to a feature:

```typescript
// Check subscription status + plan limits
async function hasAccess(userId: string, feature: string): Promise<boolean> {
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
    with: { plan: true },
  });

  // No subscription = free tier
  if (!subscription) {
    return FREE_TIER_FEATURES.includes(feature);
  }

  // Check subscription is active
  const activeStatuses = ['active', 'trialing', 'past_due'];
  if (!activeStatuses.includes(subscription.status)) {
    return false;
  }

  // Check plan includes feature
  return subscription.plan.features.includes(feature);
}

// Check usage limits
async function checkLimit(userId: string, metric: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
}> {
  const subscription = await getSubscription(userId);
  const limit = subscription?.plan?.limits?.[metric] ?? FREE_TIER_LIMITS[metric];
  const used = await getCurrentPeriodUsage(userId, metric);

  return { allowed: used < limit, used, limit };
}
```

---

## Webhook Event Mapping

Map Stripe webhook events to database operations:

| Stripe Event | Database Action |
|-------------|-----------------|
| `customer.created` | Insert into `customers` |
| `customer.subscription.created` | Insert into `subscriptions` |
| `customer.subscription.updated` | Update `subscriptions` (status, period, plan) |
| `customer.subscription.deleted` | Update `subscriptions` (status = 'canceled', ended_at) |
| `invoice.created` | Insert into `invoices` |
| `invoice.paid` | Update `invoices` (status = 'paid'), extend subscription |
| `invoice.payment_failed` | Update `invoices`, trigger dunning flow |
| `invoice.finalized` | Update `invoices` with PDF/URL |
| `checkout.session.completed` | Create customer + subscription records |

---

## Migration Checklist

- [ ] Plans and prices seeded in database
- [ ] Stripe products and prices created (matching database records)
- [ ] Webhook endpoint registered in Stripe dashboard
- [ ] Webhook signature secret stored in environment variables
- [ ] All webhook events from table above are handled
- [ ] Idempotency implemented for all webhook handlers
- [ ] Access control function tested with each plan tier
- [ ] Free tier limits verified
- [ ] Plan upgrade/downgrade flow tested
- [ ] Subscription cancellation flow tested

---

*Adapt this schema to your specific billing model. Not all tables are needed for every product.*
