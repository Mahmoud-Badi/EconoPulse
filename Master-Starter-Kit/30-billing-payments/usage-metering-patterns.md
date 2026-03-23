# Usage Metering Patterns

> For products with usage-based or hybrid billing: how to track, aggregate, and bill for consumption.

> **When to use:** Your pricing includes pay-per-use components (API calls, storage, messages, seats, compute time).

---

## Architecture Overview

```
User Action                Metering Service              Billing System
    │                           │                              │
    ├── API call ──────────────►│                              │
    │                           ├── Record usage event         │
    │                           │   (write to usage_events)    │
    │                           │                              │
    │                    End of billing period                  │
    │                           │                              │
    │                           ├── Aggregate usage ──────────►│
    │                           │   (sum events per metric)    ├── Calculate charges
    │                           │                              ├── Generate invoice
    │                           │                              ├── Charge customer
    │                           │                              │
```

---

## Metering Approaches

### Approach 1: Event-Based (RECOMMENDED)

Record every usage event as it happens. Aggregate at billing time.

```typescript
// Record usage event
async function recordUsage(params: {
  customerId: string;
  metric: string;       // 'api_calls', 'storage_bytes', 'messages_sent'
  quantity: number;
  idempotencyKey: string;  // CRITICAL: prevents double-counting
}) {
  await db.insert(usageEvents).values({
    customerId: params.customerId,
    metric: params.metric,
    quantity: params.quantity,
    idempotencyKey: params.idempotencyKey,
    timestamp: new Date(),
  }).onConflictDoNothing(); // Idempotency: skip if key already exists
}

// Usage: in your API middleware
recordUsage({
  customerId: ctx.user.customerId,
  metric: 'api_calls',
  quantity: 1,
  idempotencyKey: `${ctx.requestId}`,  // Use request ID as idempotency key
});
```

**Pros:** Accurate, auditable, supports any aggregation pattern.
**Cons:** High write volume for high-traffic products.

### Approach 2: Counter-Based

Maintain running counters per metric per period. Increment atomically.

```typescript
// Increment counter
async function incrementUsage(customerId: string, metric: string, quantity: number = 1) {
  await db
    .insert(usageCounters)
    .values({
      customerId,
      metric,
      period: getCurrentBillingPeriod(),
      quantity,
    })
    .onConflict(['customerId', 'metric', 'period'])
    .doUpdate({ quantity: sql`usage_counters.quantity + ${quantity}` });
}
```

**Pros:** Simpler schema, lower write volume, fast reads.
**Cons:** Less auditable, can't retroactively analyze patterns.

### Approach 3: Stripe Usage Records

Report usage directly to Stripe. Stripe handles aggregation and invoicing.

```typescript
// Report usage to Stripe metered billing
const usageRecord = await stripe.subscriptionItems.createUsageRecord(
  subscriptionItemId,
  {
    quantity: totalUsageForPeriod,
    timestamp: Math.floor(Date.now() / 1000),
    action: 'set', // 'set' replaces, 'increment' adds
  }
);
```

**Pros:** No local aggregation needed, Stripe handles invoicing.
**Cons:** Need to report regularly, limited retroactive correction.

---

## Limit Enforcement

### Pre-Enforcement (Check Before Action)

```typescript
// Middleware: check usage limit before processing request
async function checkUsageLimit(customerId: string, metric: string): Promise<void> {
  const { used, limit, allowed } = await getUsageStatus(customerId, metric);

  if (!allowed) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Usage limit reached. You've used ${used}/${limit} ${metric} this period. Upgrade your plan for more.`,
    });
  }
}

async function getUsageStatus(customerId: string, metric: string) {
  const subscription = await getActiveSubscription(customerId);
  const plan = subscription?.plan ?? FREE_PLAN;
  const limit = plan.limits[metric] ?? 0;

  const used = await db
    .select({ total: sql<number>`SUM(quantity)` })
    .from(usageEvents)
    .where(and(
      eq(usageEvents.customerId, customerId),
      eq(usageEvents.metric, metric),
      gte(usageEvents.timestamp, subscription?.currentPeriodStart ?? startOfMonth()),
    ))
    .then(rows => rows[0]?.total ?? 0);

  return { used, limit, allowed: used < limit, remaining: limit - used };
}
```

### Soft Limits (Allow Overage, Bill Later)

```typescript
// Allow the action but flag for billing
async function recordWithOverageCheck(customerId: string, metric: string) {
  const status = await getUsageStatus(customerId, metric);

  // Always allow, but flag if over limit
  await recordUsage({ customerId, metric, quantity: 1, idempotencyKey: generateId() });

  if (!status.allowed) {
    // Overage: will be billed at overage rate
    await notifyOverage(customerId, metric, status);
  }
}
```

---

## Usage Dashboard (User-Facing)

Show customers their current usage:

```
┌─ Usage This Period (Feb 1 - Feb 28) ─────────────────┐
│                                                       │
│  API Calls          ████████████░░░░  7,500 / 10,000  │
│  Storage            ██████░░░░░░░░░░  3.2 GB / 10 GB  │
│  Team Members       ██░░░░░░░░░░░░░░  2 / 10          │
│                                                       │
│  Resets in: 8 days                                    │
│                                [Upgrade Plan]         │
└───────────────────────────────────────────────────────┘
```

### API Endpoint for Usage

```typescript
// GET /api/usage/current
router.get('/usage/current', async (ctx) => {
  const metrics = await Promise.all(
    TRACKED_METRICS.map(async (metric) => ({
      metric: metric.name,
      label: metric.label,
      used: await getCurrentUsage(ctx.user.customerId, metric.name),
      limit: await getLimit(ctx.user.customerId, metric.name),
      unit: metric.unit,
    }))
  );

  return {
    periodStart: subscription.currentPeriodStart,
    periodEnd: subscription.currentPeriodEnd,
    metrics,
  };
});
```

---

## Aggregation and Billing

### End-of-Period Aggregation Job

```typescript
// Scheduled job: aggregate usage at end of billing period
async function aggregateUsageForBilling(customerId: string, periodEnd: Date) {
  const periodStart = subscription.currentPeriodStart;

  for (const metric of BILLABLE_METRICS) {
    const total = await db
      .select({ total: sql<number>`SUM(quantity)` })
      .from(usageEvents)
      .where(and(
        eq(usageEvents.customerId, customerId),
        eq(usageEvents.metric, metric),
        gte(usageEvents.timestamp, periodStart),
        lt(usageEvents.timestamp, periodEnd),
      ))
      .then(rows => rows[0]?.total ?? 0);

    // Store aggregated record
    await db.insert(usageRecords).values({
      customerId,
      subscriptionId: subscription.id,
      metric,
      quantity: total,
      periodStart,
      periodEnd,
    });

    // Report to Stripe for invoicing
    await stripe.subscriptionItems.createUsageRecord(
      subscription.stripeMeteredItemId,
      { quantity: total, action: 'set' }
    );
  }
}
```

---

## Metering Checklist

- [ ] Usage metrics defined (what to track and how to count)
- [ ] Metering approach chosen (event-based / counter-based / Stripe)
- [ ] Idempotency implemented to prevent double-counting
- [ ] Limit enforcement implemented (hard limit or soft limit with overage)
- [ ] Usage dashboard built for customers
- [ ] Aggregation job scheduled for billing periods
- [ ] Stripe metered billing configured (if using Stripe for invoicing)
- [ ] Usage alerts configured (80%, 90%, 100% of limit)
- [ ] Overage pricing defined (if soft limits)
- [ ] Historical usage data retention policy defined
