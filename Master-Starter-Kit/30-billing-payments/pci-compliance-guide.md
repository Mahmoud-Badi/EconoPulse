# PCI Compliance Guide

> The #1 rule of PCI compliance: stay out of scope. If raw card numbers never touch your servers, you avoid 90% of PCI requirements. This guide shows you how.

---

## What Is PCI DSS?

PCI DSS (Payment Card Industry Data Security Standard) is a set of security requirements for any organization that processes, stores, or transmits credit card data. Non-compliance can result in:

- Fines of $5,000–$100,000/month from payment processors
- Increased transaction fees
- Loss of ability to accept card payments
- Liability for fraudulent charges in case of a breach

**The goal is not to become PCI compliant. The goal is to stay out of scope entirely.**

---

## What Puts You In Scope

You are in PCI scope if your systems touch cardholder data at any point:

| Activity | In Scope? | Why |
|----------|-----------|-----|
| Customer enters card number on YOUR page | YES | Your server receives the card data |
| Customer enters card number in Stripe Elements/Checkout | NO | Card data goes directly to Stripe, never touches your server |
| You store card numbers in your database | YES — maximum scope | You are now responsible for the full PCI DSS standard |
| You log request bodies that might contain card data | YES | Even accidental storage counts |
| You use an iframe from your payment processor | NO | Card data stays in the iframe (different origin) |
| Your server proxies card data to a payment processor | YES | Data transits through your server |
| You store Stripe tokens/customer IDs | NO | Tokens are not cardholder data |
| You display the last 4 digits of a card | NO | Truncated PANs are not in scope |
| You receive webhook events with card metadata | NO | Webhooks contain tokens and metadata, not full card numbers |

---

## How to Stay OUT of Scope

### The Architecture That Keeps You Safe

```
┌──────────────┐         ┌──────────────────┐         ┌─────────────┐
│  Your        │         │  Stripe.js /     │         │  Stripe     │
│  Frontend    │────────▶│  Stripe Elements │────────▶│  API        │
│  (browser)   │         │  (runs in iframe)│         │  (PCI L1)   │
│              │◀────────│                  │◀────────│             │
└──────────────┘  token  └──────────────────┘  token  └─────────────┘
       │                                                     │
       │ token (not card data)                               │
       ▼                                                     │
┌──────────────┐                                             │
│  Your        │  Stripe Customer ID / Payment Intent ID     │
│  Backend     │─────────────────────────────────────────────▶│
│  (server)    │                                             │
└──────────────┘
```

**Key insight:** Your frontend loads Stripe Elements (an iframe). The card number is entered inside the iframe. Your JavaScript CANNOT access the contents of the iframe (same-origin policy). The card data goes from the iframe directly to Stripe. Your server only ever sees a token.

### Implementation Checklist

- [ ] Use Stripe Elements, Stripe Checkout, or equivalent hosted payment form
- [ ] NEVER create a `<input>` field for card numbers in your own code
- [ ] NEVER send card data to your own API endpoints
- [ ] NEVER log request bodies on payment-related endpoints (even "just for debugging")
- [ ] NEVER store card numbers, CVVs, or full PANs anywhere — not in databases, not in logs, not in emails, not in spreadsheets
- [ ] Store only: Stripe customer ID (`cus_xxx`), payment method ID (`pm_xxx`), last 4 digits, card brand
- [ ] Use HTTPS everywhere (TLS 1.2+)
- [ ] Validate webhook signatures (see section below)

---

## SAQ Types — Which Applies to You

SAQ = Self-Assessment Questionnaire. This is the annual PCI compliance form you fill out.

| SAQ Type | Applies When | # of Requirements | Typical SaaS? |
|----------|-------------|-------------------|---------------|
| SAQ A | All payment processing fully outsourced (Stripe Checkout, Elements) | ~22 | YES — this is your target |
| SAQ A-EP | Your website serves the payment page but doesn't touch card data | ~139 | Sometimes |
| SAQ D | You process, store, or transmit card data yourself | ~300+ | AVOID THIS |

### SAQ A Requirements (What You Must Still Do)

Even with Stripe handling everything, SAQ A requires:

1. **Use HTTPS on all pages** (not just the payment page)
2. **Keep Stripe.js library up to date** (use the CDN version, it auto-updates)
3. **Don't serve payment pages from compromised servers** (basic server security)
4. **Maintain a list of service providers** (Stripe, and any other payment-related vendors)
5. **Have an incident response plan** for payment-related security events
6. **Restrict access** to your Stripe dashboard to authorized personnel only
7. **Use strong, unique passwords** for Stripe dashboard accounts
8. **Enable 2FA** on all Stripe dashboard accounts
9. **Review access quarterly** — remove departed employees from Stripe dashboard

---

## Never-Store Rules

These are absolute rules. There are no exceptions.

| Data Element | Can You Store It? | Notes |
|-------------|-------------------|-------|
| Full card number (PAN) | NEVER | Not even encrypted. Not even hashed. Not even temporarily. |
| CVV / CVC / Security code | NEVER | Not even during the transaction. This is the hardest rule — do not even pass it through your server. |
| Magnetic stripe data | NEVER | Relevant for POS systems, not web apps |
| PIN / PIN block | NEVER | Relevant for debit transactions |
| Card expiration date | YES (if needed) | But only in combination with truncated PAN and only if PCI compliant |
| Last 4 digits of card | YES | Useful for displaying "Visa ending in 4242" |
| Cardholder name | YES | Not considered sensitive by PCI (but treat carefully) |
| Stripe token / customer ID | YES | These are NOT cardholder data — safe to store |
| Stripe payment method ID | YES | Reference to card stored on Stripe's side |

### How People Accidentally Store Card Data

| Mistake | How It Happens | Impact |
|---------|---------------|--------|
| Logging request bodies | Debug logging captures POST body with card fields | You're now storing card data in log files |
| Error tracking (Sentry, etc.) | Exception includes request context with card data | Card data in your error tracking system |
| Browser autofill | Your own input field gets autofilled with card data, submitted to your server | Card data hits your API |
| Copy-paste into support tickets | Customer pastes card number into support chat | Card data in your support system |
| CSV exports | Export includes full card numbers | Card data in spreadsheets on employee laptops |
| Database backups | Backup includes card data table | Card data on backup storage |

**Prevention:**
- Scrub all request logging on payment endpoints
- Configure Sentry/error tracking to redact fields matching card patterns
- Train support staff: NEVER ask for or accept full card numbers
- Never build your own card input fields

---

## Tokenization Flow — Step by Step

### Standard Flow (Stripe Elements)

```
Step 1: Frontend loads Stripe Elements
  Your page includes <script src="https://js.stripe.com/v3/"></script>
  You create a Stripe Elements instance and mount it to a DOM element
  Result: An iframe renders inside your page with a card input

Step 2: Customer enters card data
  Card number is typed INTO the Stripe iframe
  Your JavaScript has NO access to the card data (cross-origin iframe)

Step 3: Frontend calls Stripe to create a token
  stripe.createPaymentMethod({ type: 'card', card: elements.getElement('card') })
  Stripe.js sends card data directly to Stripe's servers
  Result: You receive a payment method ID (pm_xxx) — NOT card data

Step 4: Frontend sends token to YOUR server
  POST /api/payments/create-subscription
  Body: { payment_method_id: "pm_xxx", plan_id: "pro-monthly" }
  Your server receives ONLY the token — never the card number

Step 5: Your server calls Stripe API
  stripe.customers.create({ payment_method: "pm_xxx" })
  stripe.subscriptions.create({ customer: "cus_xxx", items: [{ price: "price_xxx" }] })
  Result: Subscription created

Step 6: Store references (not card data)
  Save to your database:
    stripe_customer_id: "cus_xxx"
    stripe_subscription_id: "sub_xxx"
    card_last4: "4242"
    card_brand: "visa"
  NEVER save: full card number, CVV, expiration
```

### Payment Intents Flow (One-Time Payments)

```
Step 1: Your server creates a Payment Intent
  const intent = await stripe.paymentIntents.create({
    amount: 2000,  // $20.00 in cents
    currency: 'usd',
  });
  Return client_secret to frontend

Step 2: Frontend confirms the Payment Intent
  stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: elements.getElement('card') }
  })

Step 3: Stripe processes payment
  Card data never touches your server
  Result: Payment Intent status → "succeeded"

Step 4: Webhook confirms payment
  Stripe sends webhook to your server
  Event: payment_intent.succeeded
  You fulfill the order
```

---

## Webhook Signature Validation

Webhooks tell your server about events (payment succeeded, subscription cancelled, etc.). You MUST verify that webhooks actually come from Stripe.

### Why This Matters

Without signature validation, an attacker can send fake webhook events to your server:
- Fake "payment succeeded" → you grant access without payment
- Fake "subscription cancelled" → you revoke a paying customer's access
- Fake "dispute created" → you issue unnecessary refunds

### Implementation

```
Step 1: Get your webhook signing secret from Stripe Dashboard
  Settings → Webhooks → Signing secret
  Store as environment variable: STRIPE_WEBHOOK_SECRET

Step 2: Verify signature on every webhook request
  // IMPORTANT: Use the RAW request body, not parsed JSON
  const sig = request.headers['stripe-signature'];
  const rawBody = request.rawBody; // NOT request.body (parsed)

  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // Process event
  } catch (err) {
    // Invalid signature — reject with 400
    return response.status(400).send('Invalid signature');
  }

Step 3: Handle idempotently
  // Stripe may send the same event multiple times
  // Check if you've already processed this event ID
  if (await isEventProcessed(event.id)) {
    return response.status(200).send('Already processed');
  }
```

### Common Webhook Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Using parsed JSON body for signature verification | Signature always fails | Use raw request body (Buffer/string) |
| Not checking event type before processing | Process wrong event type, corrupt data | Switch on `event.type`, ignore unknown types |
| Not handling duplicate events | Double-processing (double refund, double access grant) | Store processed event IDs, check before processing |
| Returning errors for events you don't handle | Stripe marks webhook as failing, disables it | Return 200 for events you intentionally ignore |
| Webhook endpoint not on HTTPS | Stripe won't send to HTTP endpoints | Always use HTTPS |
| Slow webhook processing (>30s) | Stripe times out, retries, you get duplicates | Process async: acknowledge with 200, then process in background |

### Replay Protection

```
1. Store event.id + processed_at in your database
2. Before processing: check if event.id already exists
3. Stripe includes event.created (timestamp) — reject events older than 5 minutes
   (configurable, but don't accept very old events)
4. For critical events (payment succeeded): also verify the current state via API
   const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.id);
   if (paymentIntent.status !== 'succeeded') { /* don't fulfill */ }
```

---

## PCI Compliance Testing Requirements

### For SAQ A (Most SaaS Applications)

| Requirement | Frequency | What to Do |
|-------------|-----------|------------|
| Self-Assessment Questionnaire | Annual | Complete SAQ A form, attest to compliance |
| Vulnerability scan (ASV scan) | Quarterly | Hire an Approved Scanning Vendor to scan your external-facing systems |
| Penetration test | Annual (recommended) | Not strictly required for SAQ A but strongly recommended |
| Review access to Stripe dashboard | Quarterly | Verify only authorized personnel have access |
| Verify Stripe.js is current | Monthly | Should be automatic if using CDN; verify no pinned old versions |

### For SAQ A-EP or SAQ D

Stop. Re-architect your system to qualify for SAQ A instead. The cost of SAQ D compliance ($50K-$200K/year for audits, monitoring, and infrastructure) almost always exceeds the cost of re-architecting to use Stripe Elements.

---

## Annual Assessment Requirements

### What You Need to Do Each Year

1. **Complete the SAQ** — Fill out the Self-Assessment Questionnaire for your SAQ type
2. **Submit Attestation of Compliance (AOC)** — Sign and submit to your payment processor
3. **Review and update documentation:**
   - Network diagram showing where card data flows (or doesn't flow)
   - List of all payment-related service providers
   - Incident response plan for payment data breaches
4. **Conduct security awareness training** for staff who manage Stripe dashboard
5. **Review and rotate Stripe API keys** — at minimum annually, immediately if staff departs
6. **Verify PCI compliance of service providers** — Check that Stripe maintains its PCI Level 1 certification (they do — it's public)

### Who Handles This

| Company Size | Who Does It |
|-------------|-------------|
| Startup (1-10 people) | CTO or lead developer, with help from Stripe's compliance guide |
| Small team (10-50) | Designated security owner + annual ASV scan vendor |
| Growth (50-200) | Security team or compliance officer |
| Enterprise (200+) | Dedicated compliance team, external QSA (Qualified Security Assessor) |

---

## Common Mistakes That Put You in Scope

### Mistake 1: Building Your Own Card Input

**What happened:** Developer creates `<input type="text" name="card_number">` instead of using Stripe Elements. Card data is submitted to your API.

**Impact:** You're now in PCI scope. SAQ D applies. Estimated compliance cost: $50K-$200K/year.

**Fix:** Remove the input. Use Stripe Elements. The migration takes 1-2 days. The compliance cost savings are worth years of development time.

### Mistake 2: Logging Payment Request Bodies

**What happened:** Global request logging middleware captures the body of all POST requests, including ones that might include card data from a misconfigured frontend.

**Fix:** Exclude payment endpoints from request logging entirely. Or better: log only whitelisted fields, never the full body.

```
// BAD
app.use((req, res, next) => {
  console.log('Request:', req.method, req.path, req.body);  // Logs card data!
  next();
});

// GOOD
app.use((req, res, next) => {
  const safePaths = ['/api/payments'];
  if (!safePaths.some(p => req.path.startsWith(p))) {
    console.log('Request:', req.method, req.path, req.body);
  } else {
    console.log('Request:', req.method, req.path, '[body redacted]');
  }
  next();
});
```

### Mistake 3: Accepting Card Numbers in Support Channels

**What happened:** Customer emails their full card number to support. It's now stored in your email system, support ticket system, and possibly backed up to multiple locations.

**Fix:**
- Train support staff: "We never need your full card number. We can look up your payment method by your email address."
- Configure email filters to detect and quarantine messages containing 16-digit sequences
- Support policy: if a customer sends a card number, immediately delete the message and ask them to change their card

### Mistake 4: Storing Card Data "Temporarily"

**What happened:** "We just store it in Redis for 30 seconds while we process the payment, then delete it."

**Impact:** You're in scope. Duration doesn't matter. Even millisecond storage counts. PCI DSS says "store" means any retention, however brief.

**Fix:** Never let card data enter your system at all. Use client-side tokenization.

### Mistake 5: Iframe Busting / Custom Styling Gone Wrong

**What happened:** Developer tries to style Stripe Elements by injecting CSS that breaks the iframe isolation, or uses a method that extracts card data from the iframe.

**Impact:** If you can read the card data from the iframe, you're in scope.

**Fix:** Use Stripe's built-in styling API (`style` parameter in Elements). Never attempt to access iframe contents via JavaScript.

---

## Quick Decision Flowchart

```
Do you need to accept card payments?
  → NO: You're not in PCI scope. Stop here.
  → YES: ↓

Will card numbers ever touch your servers?
  → YES: Re-architect immediately. Use Stripe Elements/Checkout.
  → NO: ↓

Are you using Stripe Elements, Stripe Checkout, or equivalent hosted form?
  → NO: Switch to one of these. It takes 1-2 days.
  → YES: ↓

You qualify for SAQ A. Complete it annually.
  → Annual ASV scan
  → Review access quarterly
  → Keep Stripe.js updated
  → Done.
```
