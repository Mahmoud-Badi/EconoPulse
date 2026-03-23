# Billing Architecture Decision Tree

## How to Use This Document

Walk through each decision node sequentially. Your billing model determines which payment provider, database schema, and operational flows you need. Record your decisions and use them to populate the remaining templates in this section.

---

## Node 1 — Billing Model

**Question:** How does your product make money?

### Option A: Subscription (Flat-Rate) — MOST COMMON

**Description:** Users pay a fixed recurring fee (monthly/annual) for access to a plan tier.

```
Examples: Netflix, Slack, Linear, Notion
Variants:
  ├── Per-seat pricing (Slack, GitHub Teams)
  ├── Flat-rate per tier (Netflix Basic/Standard/Premium)
  └── Feature-gated (free tier + paid features)
```

| Pros | Cons |
|------|------|
| Predictable recurring revenue | Requires ongoing value delivery |
| Simple to understand and implement | Plan changes need proration logic |
| Easy to forecast MRR/ARR | Annual plans need refund policies |
| Well-supported by all payment processors | Churn directly impacts revenue |

### Option B: Usage-Based (Pay-As-You-Go)

**Description:** Users pay based on consumption (API calls, storage, compute, messages sent).

```
Examples: AWS, Twilio, OpenAI API, Vercel
Variants:
  ├── Pure usage (pay per unit)
  ├── Tiered usage (first 1000 free, then $0.01/unit)
  └── Committed usage (reserve capacity at discount)
```

| Pros | Cons |
|------|------|
| Revenue scales with customer success | Revenue is unpredictable |
| Low barrier to entry (start free) | Requires metering infrastructure |
| Natural expansion revenue | Billing surprises can cause churn |
| Aligns cost with value delivered | Complex to explain pricing |

### Option C: Hybrid (Subscription + Usage)

**Description:** Base subscription fee plus usage-based overages.

```
Examples: Vercel (Pro plan + bandwidth overages), GitHub (Team plan + Actions minutes)
```

| Pros | Cons |
|------|------|
| Predictable base + growth upside | Most complex to implement |
| Captures both steady and variable revenue | Harder for customers to predict costs |
| Flexible for different customer sizes | Requires both subscription AND metering |

### Option D: Marketplace / Platform Fees

**Description:** Take a percentage or flat fee from transactions between buyers and sellers.

```
Examples: Stripe, Airbnb, Uber, Etsy
Variants:
  ├── Percentage fee (Stripe: 2.9% + $0.30)
  ├── Flat fee per transaction
  └── Subscription + transaction fee hybrid
```

| Pros | Cons |
|------|------|
| Revenue scales with GMV | Need both buyer AND seller onboarding |
| Network effects drive growth | Payment splitting is complex (Stripe Connect) |
| No inventory risk | Regulatory complexity (money transmission) |
| High platform stickiness | Refund/dispute handling involves multiple parties |

### Option E: One-Time Purchase

**Description:** Single payment for lifetime access or a one-time deliverable.

```
Examples: Tailwind UI, app purchases, digital downloads
```

| Pros | Cons |
|------|------|
| Simple to implement | No recurring revenue |
| Customer-friendly (no ongoing cost) | Need continuous acquisition |
| Works for digital goods and templates | Hard to fund ongoing development |

### Recommendation

For most SaaS products, start with **Subscription (flat-rate, feature-gated tiers)**. It's the simplest to implement, easiest to forecast, and well-supported by every payment processor. Add usage-based components only when you have a clear metric that correlates with customer value.

---

## Node 2 — Payment Provider

**Question:** Which payment processor handles your transactions?

### Option A: Stripe — RECOMMENDED

| Pros | Cons |
|------|------|
| Best developer experience (by far) | Processing fees: 2.9% + $0.30 |
| Comprehensive: subscriptions, invoicing, tax, Connect | Complex pricing for marketplace features |
| Excellent documentation and SDKs | Support can be slow for smaller accounts |
| Built-in fraud detection (Radar) | Account holds/freezes with limited recourse |
| Stripe Tax handles sales tax/VAT | |

**Best for:** Most products. Stripe is the default choice unless you have a specific reason not to use it.

### Option B: Paddle

| Pros | Cons |
|------|------|
| Merchant of Record (handles tax for you) | Higher fees (~5% + $0.50) |
| No sales tax/VAT compliance burden | Less developer control |
| Handles invoicing globally | Fewer payment methods than Stripe |
| SaaS-focused features | Limited marketplace support |

**Best for:** Small teams who want zero tax compliance burden. Paddle handles everything as the "seller."

### Option C: LemonSqueezy

| Pros | Cons |
|------|------|
| Merchant of Record (like Paddle) | Newer, smaller ecosystem |
| Simple pricing, good DX | Fewer advanced features |
| Built for digital products | Limited enterprise features |
| Lower fees than Paddle | Less customizable |

**Best for:** Digital products, indie makers, one-person teams.

### Option D: Stripe Connect (for Marketplaces)

| Pros | Cons |
|------|------|
| Split payments between platform and sellers | Complex onboarding flow for sellers |
| KYC/identity verification built-in | Higher per-transaction fees |
| Global payout support | Significant development effort |
| Handles 1099 reporting (US) | |

**Best for:** Any product where money flows between multiple parties.

### Recommendation

**Use Stripe** unless you want a Merchant of Record (Paddle/LemonSqueezy) to avoid tax compliance entirely. For marketplaces, Stripe Connect is the industry standard.

---

## Node 3 — Subscription Plan Structure

**Question:** How are your pricing tiers organized?

<!-- IF SUBSCRIPTION_MODEL -->

### Pattern A: Good / Better / Best — RECOMMENDED

```
Free    → Limited features, no credit card required
Pro     → Core features, most customers
Business→ Advanced features, team management, priority support
Enterprise → Custom pricing, dedicated support, SLAs
```

| # of Tiers | Guidance |
|-------------|----------|
| 1 tier | Only if your product is simple and serves one persona |
| 2-3 tiers | Ideal for most products |
| 4+ tiers | Usually too complex — confuses customers |

### Pattern B: Per-Seat Pricing

```
$X per user per month
Often with minimum seat count or volume discounts
```

**Use when:** Value scales directly with number of users (collaboration tools, team platforms).

### Pattern C: Feature-Gated

```
Free  → Feature set A
Paid  → Feature set A + B + C
```

**Use when:** Clear feature boundaries exist between tiers.

### Key Decisions to Record

```markdown
## Billing Configuration

| Decision | Choice |
|----------|--------|
| Billing model | {subscription/usage/hybrid/marketplace/one-time} |
| Payment provider | {Stripe/Paddle/LemonSqueezy/Stripe Connect} |
| Number of tiers | {1/2/3/4+} |
| Tier structure | {Good-Better-Best / Per-Seat / Feature-Gated} |
| Free tier? | {Yes — freemium / Yes — trial / No} |
| Trial duration | {N/A / 7 days / 14 days / 30 days} |
| Billing cycles | {Monthly only / Annual only / Both} |
| Annual discount | {N/A / X% off} |
| Currency | {USD / EUR / multi-currency} |
```

<!-- ENDIF -->

---

## Node 4 — Billing Integration Architecture

**Question:** How does the billing system integrate with your application?

### Pattern: Webhook-Driven (RECOMMENDED)

```
Your App                          Payment Provider
   │                                    │
   ├── Create checkout session ────────►│
   │                                    │
   │◄──── Webhook: checkout.completed ──┤
   │   (grant access)                   │
   │                                    │
   │◄──── Webhook: invoice.paid ────────┤
   │   (extend subscription)            │
   │                                    │
   │◄──── Webhook: invoice.payment_failed ──┤
   │   (trigger dunning)                │
   │                                    │
   │◄──── Webhook: customer.subscription.deleted ──┤
   │   (revoke access)                  │
```

### Critical Rules

1. **Webhooks are the source of truth** — Never rely on client-side redirect to confirm payment. The redirect can fail; the webhook won't.
2. **Idempotency** — Process each webhook event exactly once. Use the event ID to deduplicate.
3. **Signature verification** — Always verify webhook signatures to prevent spoofing.
4. **Retry handling** — Payment providers retry failed webhooks. Your handler must be idempotent.
5. **Event ordering** — Events may arrive out of order. Handle gracefully (e.g., don't revoke access if a `subscription.deleted` event arrives before `invoice.paid`).

---

## Decision Summary

```markdown
## Billing Architecture Summary for {{PROJECT_NAME}}

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Billing model | {choice} | {why} |
| Payment provider | {choice} | {why} |
| Plan structure | {choice} | {why} |
| Free tier strategy | {choice} | {why} |
| Tax handling | {choice} | {why} |
| Integration pattern | Webhook-driven | Industry standard, reliable |
```

Transfer this to `02-architecture/decisions-log.template.md`.
