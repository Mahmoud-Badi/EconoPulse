# Dunning & Recovery Flows — {{PROJECT_NAME}}

> Dunning is the process of recovering failed subscription payments. Done well, it recovers 5-15% of revenue that would otherwise be lost to involuntary churn.

---

## Why Dunning Matters

Most subscription churn is **involuntary** — the customer wants to keep paying, but their card expired, hit a limit, or was blocked. Dunning recovers this revenue through:
- Smart payment retry timing
- Customer communication (email, in-app)
- Graceful account degradation (instead of hard cutoff)

---

## Payment Failure Reasons

| Reason | % of Failures | Recovery Rate | Action |
|--------|---------------|---------------|--------|
| Expired card | ~30% | High (70%+) | Email customer to update card |
| Insufficient funds | ~25% | Medium (40-60%) | Retry in 3-5 days |
| Card declined (generic) | ~20% | Medium (30-50%) | Retry + email |
| Bank block (fraud) | ~10% | Low (10-20%) | Email customer to contact bank |
| Invalid card number | ~5% | Very low | Email customer to update card |
| Processing error | ~10% | High (80%+) | Automatic retry resolves it |

---

## Retry Schedule

### Recommended Retry Pattern

```
Day 0  — Initial payment attempt fails
Day 1  — Email #1: "Payment failed" notification
Day 3  — Retry #1 (automatic)
Day 5  — Email #2: "Action needed — update your payment method"
Day 7  — Retry #2 (automatic)
Day 10 — Email #3: "Your account will be restricted in 4 days"
Day 12 — Retry #3 (automatic)
Day 14 — Account restricted (downgrade to free tier, not deletion)
Day 21 — Final retry (automatic)
Day 28 — Email #4: "Final notice — your subscription has been canceled"
Day 30 — Subscription canceled
```

### Stripe Smart Retries

If using Stripe, enable **Smart Retries** (Stripe Billing settings):
- Stripe uses ML to pick the optimal retry time based on issuer patterns
- Recovers ~11% more revenue than fixed retry schedules
- Enable in: Stripe Dashboard → Settings → Billing → Subscriptions → Smart Retries

### Manual Retry Configuration (if not using Smart Retries)

```
Retry timing best practices:
- Retry #1: 3 days after failure (gives time for insufficient funds to clear)
- Retry #2: 7 days after failure (covers weekly pay cycle)
- Retry #3: 12 days after failure (catches bi-weekly pay)
- Final retry: 21 days after failure (catches monthly pay)
```

---

## Dunning Email Templates

### Email #1 — Payment Failed (Day 1)

```
Subject: Your {{PROJECT_NAME}} payment didn't go through

Hi {{CUSTOMER_NAME}},

We tried to process your {{PLAN_NAME}} subscription payment of {{AMOUNT}},
but it didn't go through.

This usually happens because of an expired card or a temporary bank issue.
No action is needed right now — we'll retry automatically in a few days.

If you'd like to update your payment method:
[Update Payment Method →] {{UPDATE_PAYMENT_URL}}

Thanks,
The {{PROJECT_NAME}} Team
```

### Email #2 — Action Needed (Day 5)

```
Subject: Action needed: Update your payment method

Hi {{CUSTOMER_NAME}},

Your {{PLAN_NAME}} subscription payment of {{AMOUNT}} has failed.
We've retried once, but it still didn't go through.

To keep your account active, please update your payment method:
[Update Payment Method →] {{UPDATE_PAYMENT_URL}}

If we can't process your payment by {{RESTRICTION_DATE}},
your account will be downgraded to the free plan.

Thanks,
The {{PROJECT_NAME}} Team
```

### Email #3 — Restriction Warning (Day 10)

```
Subject: Your {{PROJECT_NAME}} account will be restricted in 4 days

Hi {{CUSTOMER_NAME}},

We've been unable to process your subscription payment after multiple attempts.

Your account will be restricted to the free plan on {{RESTRICTION_DATE}}
unless you update your payment method:
[Update Payment Method →] {{UPDATE_PAYMENT_URL}}

What changes with the free plan:
- {FEATURE_RESTRICTION_1}
- {FEATURE_RESTRICTION_2}
- Your data will NOT be deleted

Questions? Reply to this email or contact {{SUPPORT_EMAIL}}.

Thanks,
The {{PROJECT_NAME}} Team
```

### Email #4 — Final Notice (Day 28)

```
Subject: Final notice: Your {{PROJECT_NAME}} subscription has been canceled

Hi {{CUSTOMER_NAME}},

Since we couldn't process your payment after multiple attempts,
your {{PLAN_NAME}} subscription has been canceled.

Your account has been downgraded to the free plan.
Your data is safe — nothing has been deleted.

Want to reactivate? You can resubscribe anytime:
[Resubscribe →] {{RESUBSCRIBE_URL}}

We'd love to have you back.

Thanks,
The {{PROJECT_NAME}} Team
```

---

## Account Restriction Strategy

**Never hard-delete on payment failure.** Degrade gracefully:

### Restriction Tiers

| Status | Access Level | Data |
|--------|-------------|------|
| `active` | Full plan access | All data accessible |
| `past_due` (grace period) | Full plan access | All data accessible |
| `past_due` (post-grace) | Read-only access | All data accessible, no new creates |
| `unpaid` / `canceled` | Free tier only | All data accessible, paid features locked |
| 90 days after cancellation | Free tier only | Data export available, scheduled for deletion |

### Implementation

```typescript
function getAccessLevel(subscription: Subscription | null): AccessLevel {
  if (!subscription) return 'free';

  switch (subscription.status) {
    case 'active':
    case 'trialing':
      return 'full';

    case 'past_due':
      const daysPastDue = daysSince(subscription.currentPeriodEnd);
      if (daysPastDue <= 14) return 'full';      // Grace period
      if (daysPastDue <= 30) return 'read_only';  // Restricted
      return 'free';                               // Downgraded

    case 'canceled':
      // If cancel_at_period_end, they still have access until period end
      if (subscription.cancelAtPeriodEnd && isBeforeNow(subscription.currentPeriodEnd)) {
        return 'full';
      }
      return 'free';

    case 'unpaid':
    case 'incomplete':
      return 'free';

    default:
      return 'free';
  }
}
```

---

## In-App Dunning Banner

Show a persistent banner during dunning to complement email outreach:

```
┌────────────────────────────────────────────────────────┐
│ ⚠ Your payment failed. Update your payment method     │
│ to avoid losing access to Pro features.               │
│                          [Update Payment Method]       │
└────────────────────────────────────────────────────────┘
```

Display conditions:
- Show when `subscription.status === 'past_due'`
- Make it dismissible but re-show each day
- Include countdown: "X days until your account is restricted"
- Link directly to the Stripe Customer Portal or your payment update page

---

## Win-Back Flow (Post-Cancellation)

After involuntary cancellation, trigger a win-back email sequence:

| Day | Email | Content |
|-----|-------|---------|
| Day 0 (cancellation) | Final notice | "Your subscription has been canceled" |
| Day 7 | Miss-you email | "Here's what you're missing on {{PLAN_NAME}}" |
| Day 30 | Discount offer | "Come back and get {{DISCOUNT}}% off your first month" |
| Day 60 | Final reach-out | "We'd love to have you back — reply if there's anything we can help with" |

---

## Metrics to Track

| Metric | Formula | Target |
|--------|---------|--------|
| Dunning recovery rate | Recovered / Total failed payments | >50% |
| Involuntary churn rate | Involuntary cancellations / Total subscribers | <2% monthly |
| Average recovery time | Mean days from failure to recovery | <7 days |
| Email click-through rate | Clicks / Emails sent | >15% |
| Update payment method rate | Card updates / Failed payment notifications | >30% |

---

## Configuration Checklist

- [ ] Stripe Smart Retries enabled (or manual retry schedule configured)
- [ ] Dunning email templates created and tested
- [ ] In-app dunning banner implemented
- [ ] Account degradation logic implemented (not hard deletion)
- [ ] Payment update page / Stripe Customer Portal configured
- [ ] Win-back email sequence created
- [ ] Dunning metrics dashboard set up
- [ ] Grace period duration decided: {{GRACE_PERIOD_DAYS}} days
- [ ] Final cancellation timing decided: {{CANCELLATION_DAYS}} days after failure
