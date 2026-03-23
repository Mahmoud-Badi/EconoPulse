# Refund and Chargeback Flows

> Refunds and chargebacks are inevitable. The difference between a well-run billing system and chaos is whether you have documented flows before the first dispute arrives.

---

## Refund Types

| Type | What Happens | Money Movement | When to Use |
|------|-------------|----------------|-------------|
| Full refund | Customer receives the entire charge amount back | Full amount returned to customer's card/bank | Wrong product, failed service, cancellation within refund window |
| Partial refund | Customer receives a portion of the charge back | Partial amount returned | Partial service, prorated cancellation, price adjustment |
| Credit | Balance added to customer's account in your system | No money leaves your system | Goodwill gesture, future purchase discount, service interruption compensation |
| Void | Charge is cancelled before it settles | No money was captured yet | Transaction cancelled before end of day (before settlement) |

### Key Differences

- **Refund vs Credit:** Refund = real money back to customer's card. Credit = store balance in your system. Credits are cheaper (no transaction fees) but less satisfying to the customer.
- **Refund vs Void:** Void cancels a charge that hasn't settled (same day). Refund reverses a charge that has settled. Voids are instant and free. Refunds take 5-10 business days and may incur fees.
- **Stripe fee note:** Stripe does NOT return processing fees on refunds. If you charged $100 (Stripe took $3.20), you refund $100 but Stripe keeps the $3.20. This matters at scale.

---

## Refund Flow

### Standard Refund Process

```
Step 1: REFUND REQUESTED
  Source: customer request, admin action, or automated rule
  Capture: who requested, reason code, amount, original transaction

Step 2: VALIDATION
  - Is the transaction eligible for refund? (check refund window)
  - Has it already been refunded? (prevent double refund)
  - Is the amount valid? (partial refund ≤ remaining refundable amount)
  - Does the requester have permission? (role-based access)

Step 3: APPROVAL
  Route: auto-approve or manual approval based on rules (see below)

Step 4: PROCESS
  - Call payment processor API (Stripe: stripe.refunds.create)
  - Record refund in your database
  - Update subscription/invoice status if applicable

Step 5: NOTIFY
  - Email customer: refund confirmation with amount and timeline
  - Internal notification: finance team for reconciliation
  - Webhook/event: publish refund.completed for other systems

Step 6: RECONCILE
  - Update revenue reporting (reduce recognized revenue)
  - Update tax calculations (reduce taxable amount)
  - Update customer lifetime value
  - Update MRR/ARR metrics
```

### Auto-Approve vs Manual Review Rules

| Condition | Action | Rationale |
|-----------|--------|-----------|
| Refund amount ≤ $25 | Auto-approve | Not worth human time to review |
| Refund amount $25–$500 | Auto-approve if within 7 days of charge | Standard refund window |
| Refund amount $25–$500, > 7 days | Manual review | Unusual timing, investigate |
| Refund amount > $500 | Manual review (finance team) | High value, needs verification |
| More than 2 refunds for same customer in 30 days | Manual review | Possible abuse pattern |
| Subscription refund (prorated cancellation) | Auto-approve | Standard cancellation flow |
| Annual plan refund | Manual review | Large amount, may need partial calculation |

### Refund Reason Codes

Track why refunds happen. This data drives product improvements.

```
REASON_DUPLICATE_CHARGE       — Customer charged twice for same thing
REASON_PRODUCT_NOT_AS_DESCRIBED — Product didn't match expectations
REASON_SERVICE_ISSUE          — Service was down or degraded
REASON_CANCELLATION           — Customer cancelled and is owed a prorated refund
REASON_BILLING_ERROR          — Wrong amount charged, wrong plan, etc.
REASON_GOODWILL               — Customer unhappy, refund to retain relationship
REASON_FRAUD                  — Unauthorized transaction
REASON_OTHER                  — Doesn't fit other categories (require free-text note)
```

### Refund Data Model

```
Refund
  - id: UUID
  - transaction_id: UUID (FK → original charge)
  - stripe_refund_id: string ("re_xxx")
  - amount_cents: integer
  - currency: string (e.g., "usd")
  - type: ENUM('full', 'partial', 'credit', 'void')
  - reason: ENUM (reason codes above)
  - reason_note: text (free-text explanation)
  - status: ENUM('pending', 'approved', 'processing', 'completed', 'failed', 'rejected')
  - requested_by: UUID (FK → users, who initiated)
  - approved_by: UUID (FK → users, nullable, who approved)
  - requested_at: timestamp
  - processed_at: timestamp (nullable)
  - completed_at: timestamp (nullable)
  - metadata: jsonb (additional context)
```

---

## Chargeback / Dispute Lifecycle

### What Is a Chargeback?

A chargeback happens when a customer contacts their BANK (not you) to dispute a charge. The bank reverses the charge and notifies Stripe, who notifies you. You then have a window to submit evidence that the charge was legitimate.

**Key fact:** Chargebacks bypass your refund process entirely. The bank decides, not you.

### Chargeback Timeline

```
Day 0: Customer disputes charge with their bank
  → Bank issues provisional credit to customer
  → Stripe notifies you via webhook: charge.dispute.created

Day 0-5: You receive notification
  → You have 7-21 days to respond (varies by card network)
  → Stripe dashboard shows dispute with deadline

Day 1-14: You gather and submit evidence
  → Upload evidence via Stripe dashboard or API
  → Evidence package must be comprehensive (see below)

Day 14-21: Evidence submission deadline
  → If no evidence submitted: you automatically lose
  → If evidence submitted: bank reviews

Day 21-75: Bank review period
  → Bank examines evidence from both parties
  → Stripe notifies you of outcome: charge.dispute.closed

Day 75+: Outcome
  → Won: money returned to you. Stripe fee ($15) still charged.
  → Lost: money stays with customer. You lose the charge amount + $15 Stripe fee.
  → You can appeal once if you have new evidence (rare to succeed).
```

### Dispute Response Template

When you receive a dispute, gather this evidence immediately:

```markdown
## Evidence Package for Dispute {{DISPUTE_ID}}

### Transaction Details
- Charge ID: {{CHARGE_ID}}
- Amount: {{AMOUNT}}
- Date: {{CHARGE_DATE}}
- Customer email: {{CUSTOMER_EMAIL}}

### Evidence Gathered

1. **Proof of service delivery / product delivery**
   - [ ] Server logs showing customer accessed the service after payment
   - [ ] Login timestamps from customer's account
   - [ ] Feature usage logs (if applicable)
   - [ ] Delivery confirmation / tracking number (if physical product)

2. **Customer communication**
   - [ ] Welcome email sent and opened (email provider receipts)
   - [ ] Any support tickets from the customer
   - [ ] Any email exchanges about the product/service
   - [ ] Pre-purchase communication

3. **Terms of Service acceptance**
   - [ ] Timestamp of ToS acceptance
   - [ ] IP address at time of acceptance
   - [ ] Copy of ToS/refund policy that was in effect at time of purchase
   - [ ] Screenshot of checkout page showing ToS checkbox

4. **Account activity**
   - [ ] Account creation date
   - [ ] Login history (IP addresses, timestamps)
   - [ ] Actions taken in the product after purchase
   - [ ] Screenshot of customer's dashboard/account showing active use

5. **Billing descriptor match**
   - [ ] Screenshot showing your billing descriptor matches what appears on statement
   - [ ] Confirmation that descriptor clearly identifies your company

6. **Refund policy**
   - [ ] Copy of refund policy visible at time of purchase
   - [ ] Evidence that customer did not request a refund before filing dispute
```

---

## Chargeback Prevention

Prevention is far cheaper than winning disputes. Each chargeback costs you time, fees, and risks your merchant account.

### Strategy 1: Clear Billing Descriptors

```
BAD:  "STRIPE* ACME" — customer sees this on statement, doesn't recognize it
GOOD: "YOURAPP.COM PRO PLAN" — customer immediately knows what this is

Set in Stripe Dashboard → Settings → Public Details → Statement Descriptor
  Static descriptor: max 22 characters
  Dynamic descriptor: set per charge, max 22 characters
```

### Strategy 2: Confirmation Emails

Send a confirmation email immediately after every charge:

```
Subject: Receipt for your {{PRODUCT_NAME}} payment — ${{AMOUNT}}

Hi {{CUSTOMER_NAME}},

We charged ${{AMOUNT}} to your {{CARD_BRAND}} ending in {{CARD_LAST4}} for:
  {{PRODUCT_DESCRIPTION}}

Billing period: {{START_DATE}} to {{END_DATE}}

If you didn't make this purchase, contact us at {{SUPPORT_EMAIL}}
and we'll resolve it immediately — no need to contact your bank.

[View Receipt] [Contact Support]
```

**The last line is critical.** It gives the customer an alternative to filing a chargeback.

### Strategy 3: Make Refunds Easy

The best chargeback prevention is a frictionless refund process:

- Self-service cancellation with instant prorated refund
- Support team empowered to issue refunds without escalation (under $X threshold)
- Refund processed within 24 hours of request
- Clear refund policy linked in every receipt email

**Counterintuitive truth:** Making refunds easy REDUCES total refund volume. Customers who feel trapped escalate to chargebacks (which are worse than refunds because you also lose the Stripe fee and risk your merchant account).

### Strategy 4: Pre-Dunning Outreach

Before charging a card that might fail or surprise the customer:

```
3 days before renewal:
  Subject: Your {{PRODUCT_NAME}} subscription renews in 3 days
  "Your {{PLAN_NAME}} (${{AMOUNT}}/{{PERIOD}}) will renew on {{DATE}}.
   [Update Payment Method] [Cancel Subscription] [Contact Support]"

This alone can prevent 30-50% of "I didn't authorize this" chargebacks.
```

### Strategy 5: Fraud Prevention

- Use Stripe Radar for automated fraud detection
- Require 3D Secure (SCA) for transactions over $100 or from high-risk regions
- Flag and review transactions from mismatched billing/shipping countries
- Watch for velocity patterns: multiple charges from the same card in short succession

---

## Financial Reconciliation

### Refund Impact on Revenue Reporting

```
Original charge: $100
  Revenue recognized: $100
  Stripe fee: $3.20 (2.9% + $0.30)
  Net revenue: $96.80

After full refund:
  Revenue adjustment: -$100
  Stripe fee refund: $0.00 (Stripe keeps the fee!)
  Actual cost of refund: $100 + $3.20 = $103.20

Lesson: Every refund costs you MORE than the original charge amount.
  At $100 with Stripe pricing: refund costs you $103.20
  At $10 with Stripe pricing: refund costs you $10.59 (5.9% effective loss)
  Small refunds are proportionally more expensive due to the $0.30 fixed fee.
```

### Tax Implications

- Refunds reduce your taxable revenue for the period
- If the original charge was in a different tax period, you may need an adjustment
- For partial refunds: tax is typically adjusted proportionally
- Consult your accountant — tax treatment varies by jurisdiction

### Monthly Reconciliation Checklist

```markdown
## Monthly Billing Reconciliation — {{MONTH}} {{YEAR}}

Charges:
  - Total charges processed: ${{TOTAL_CHARGES}}
  - Successful charges: {{SUCCESS_COUNT}} (${{SUCCESS_AMOUNT}})
  - Failed charges: {{FAILED_COUNT}} (${{FAILED_AMOUNT}})

Refunds:
  - Total refunds: {{REFUND_COUNT}} (${{REFUND_AMOUNT}})
  - Refund rate: {{REFUND_RATE}}% (target: < 2%)
  - Refund reasons breakdown: {{REASON_BREAKDOWN}}

Chargebacks:
  - Total disputes: {{DISPUTE_COUNT}} (${{DISPUTE_AMOUNT}})
  - Chargeback rate: {{CHARGEBACK_RATE}}% (CRITICAL if > 1%)
  - Disputes won: {{WON_COUNT}}
  - Disputes lost: {{LOST_COUNT}}
  - Pending: {{PENDING_COUNT}}

Fees:
  - Processing fees: ${{PROCESSING_FEES}}
  - Dispute fees: ${{DISPUTE_FEES}} ($15 × {{DISPUTE_COUNT}})
  - Refund fee loss: ${{REFUND_FEE_LOSS}} (fees not returned on refunds)

Net Revenue:
  - Gross charges: ${{TOTAL_CHARGES}}
  - Less refunds: -${{REFUND_AMOUNT}}
  - Less fees: -${{TOTAL_FEES}}
  - Net revenue: ${{NET_REVENUE}}
```

---

## Automated vs Manual Refund Rules

### Decision Matrix

```
                         Amount
                  Low (<$25)     Medium ($25-500)     High (>$500)
              ┌──────────────┬───────────────────┬──────────────────┐
  Within      │              │                   │                  │
  refund      │  Auto-refund │   Auto-refund     │  Manual review   │
  window      │              │                   │  (finance team)  │
              ├──────────────┼───────────────────┼──────────────────┤
  Outside     │              │                   │                  │
  refund      │  Auto-refund │   Manual review   │  Manual review   │
  window      │  (goodwill)  │   (support lead)  │  (finance team)  │
              ├──────────────┼───────────────────┼──────────────────┤
  Repeat      │              │                   │                  │
  refunder    │  Manual      │   Manual review   │  Manual review   │
  (3+ in 90d) │  review      │   (support lead)  │  (finance + CX)  │
              └──────────────┴───────────────────┴──────────────────┘
```

### Automation Configuration Template

```markdown
## Refund Automation Rules for {{PROJECT_NAME}}

Auto-Approve Rules:
  - Amount ≤ ${{AUTO_APPROVE_MAX}} AND within {{REFUND_WINDOW_DAYS}} days of charge
  - Subscription cancellation with prorated refund (any amount)
  - Duplicate charge detected (system-initiated)
  - Failed delivery confirmed by system monitoring

Manual Review Required:
  - Amount > ${{MANUAL_REVIEW_THRESHOLD}}
  - Outside {{REFUND_WINDOW_DAYS}}-day refund window
  - Customer has {{REPEAT_REFUND_COUNT}}+ refunds in {{REPEAT_REFUND_WINDOW}} days
  - Annual plan refund (prorated calculation required)
  - Refund requested by non-account-holder

Escalation:
  - Refund > ${{ESCALATION_THRESHOLD}}: requires finance team approval
  - Suspected fraud: freeze account, escalate to fraud team
  - Chargeback received: dispute response team (see chargeback section)
```

---

## Rate Monitoring

### Critical Threshold: Chargeback Rate > 1%

Card networks (Visa, Mastercard) monitor your chargeback rate. If it exceeds their threshold, consequences escalate rapidly:

| Chargeback Rate | Status | Consequence |
|-----------------|--------|-------------|
| < 0.5% | Normal | No action |
| 0.5% – 0.9% | Warning | Stripe may flag your account, request remediation plan |
| 0.9% – 1.0% | Critical | You're on the edge. Immediate action required. |
| > 1.0% | Excessive | Card network monitoring program. Fines start ($25K-$100K). You may lose ability to process cards. |
| > 1.8% | Emergency | Near-certain account termination |

### Chargeback Rate Calculation

```
Chargeback Rate = (Number of chargebacks in month) / (Number of transactions in month) × 100

Example:
  10,000 transactions in January
  85 chargebacks in January
  Rate: 85 / 10,000 = 0.85% — WARNING zone

Note: The rate is calculated by TRANSACTION COUNT, not dollar amount.
  One $5 chargeback counts the same as one $5,000 chargeback.
```

### Monitoring Dashboard Template

```
## Billing Health Dashboard

Real-time Metrics:
  Chargeback rate (rolling 30 days): {{RATE}}% [🟢 < 0.5% | 🟡 0.5-0.9% | 🔴 > 0.9%]
  Refund rate (rolling 30 days): {{RATE}}% [🟢 < 2% | 🟡 2-5% | 🔴 > 5%]
  Failed payment rate: {{RATE}}% [🟢 < 5% | 🟡 5-10% | 🔴 > 10%]

Alerts:
  - Chargeback rate > 0.5%: email to billing team
  - Chargeback rate > 0.9%: page on-call + email to CEO
  - Single chargeback > $1,000: immediate notification to finance
  - 3+ chargebacks from same customer: fraud team notification
  - Refund rate > 5%: product team notification (quality issue signal)
```

---

## Common Gotchas

### 1. Refunding After Subscription Cancellation

When a customer cancels mid-billing-period, you need to decide:
- **No refund:** Customer keeps access until period ends (most common for monthly)
- **Prorated refund:** Refund unused portion of the period
- **Full refund:** Refund the entire last charge

Document your policy clearly and implement it consistently. Inconsistency generates chargebacks.

### 2. Partial Refund Rounding

```
Original charge: $99.99 for annual plan
Customer cancels after 7 months (213 days of 365)
Prorated refund: $99.99 × (152 / 365) = $41.64

ALWAYS round in the customer's favor. $41.64 not $41.63.
Document the calculation in the refund record.
```

### 3. Currency Conversion on International Refunds

If a customer paid in EUR and you refund in USD, the exchange rate may have changed. Stripe handles this, but the customer may receive a slightly different amount than expected. Communicate this proactively.

### 4. Refund Timing Expectations

Set customer expectations clearly:
- **Card refund:** 5-10 business days (bank processing time, not yours)
- **Debit card refund:** 2-5 business days
- **Credit applied:** Instant (appears in your app immediately)

Include the timeline in every refund confirmation email. "Your refund has been processed. It may take 5-10 business days to appear on your statement."
