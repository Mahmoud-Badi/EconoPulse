# Tax Compliance Patterns

> Tax compliance for digital products. Determines how sales tax, VAT, and GST are collected, calculated, and remitted.

> **IMPORTANT:** Tax law is complex and jurisdiction-specific. This guide covers common patterns. Consult a tax professional for your specific situation.

---

## Decision Tree: Who Handles Tax?

```
Are you using a Merchant of Record (Paddle, LemonSqueezy)?
  ├── YES → THEY handle all tax collection, calculation, and remittance.
  │         You receive net revenue after tax. Skip this document.
  │
  └── NO (using Stripe, direct billing) →
      │
      Do you sell to customers in the EU?
        ├── YES → You must collect and remit VAT
        │         (or use Stripe Tax / TaxJar to automate)
        │
        └── NO →
            Do you sell to customers in multiple US states?
              ├── YES → You may have sales tax nexus obligations
              │         (economic nexus thresholds vary by state)
              │
              └── NO → You likely have sales tax obligations
                        only in your home state (if applicable)
```

---

## Tax Types for Digital Products

### US Sales Tax

**How it works:** Sales tax is a state-level tax in the US. Each state has different rules for digital products.

| Concept | Detail |
|---------|--------|
| **Nexus** | Physical or economic presence that creates tax obligation in a state |
| **Economic nexus thresholds** | Typically $100K revenue OR 200 transactions per state per year |
| **Tax rates** | Vary by state, county, and city (7,000+ jurisdictions) |
| **Digital product taxability** | Not all states tax digital products — varies by state |

**Practical approach:**
1. Start with your home state (you always have nexus there)
2. Track revenue by state to monitor economic nexus thresholds
3. Register for sales tax permits as you cross thresholds
4. Use an automated solution (Stripe Tax, TaxJar, Avalara) when you hit 3+ states

### EU VAT (Value Added Tax)

**How it works:** VAT is charged at the rate of the customer's country, not yours.

| Concept | Detail |
|---------|--------|
| **Rate** | Country-specific (17-27%, most EU countries 20-25%) |
| **Threshold** | EUR 10,000 in cross-border B2C digital sales (then must register for VAT or use OSS) |
| **OSS (One-Stop Shop)** | Single VAT registration covering all EU countries |
| **B2B reverse charge** | For B2B sales, the customer handles VAT (you must verify VAT ID) |
| **Invoicing** | Invoices must include VAT amount, rate, and your VAT number |

**Practical approach:**
1. Under EUR 10K cross-border: Charge your home country's VAT rate
2. Over EUR 10K: Register for OSS or use Stripe Tax / Paddle
3. For B2B: Verify VAT IDs via VIES, apply reverse charge (0% VAT)

### UK VAT

Post-Brexit, UK has its own VAT regime:
- Standard rate: 20%
- No threshold for non-UK businesses selling digital services to UK consumers
- Register for UK VAT or use a marketplace / intermediary

### Canadian GST/HST

- Federal GST (5%) + Provincial Sales Tax (varies by province)
- Foreign digital service providers must register if revenue exceeds CAD 30,000 in 12 months

### Australian GST

- 10% GST on digital supplies to Australian consumers
- No revenue threshold for foreign businesses

---

## Implementation Patterns

### Pattern 1: Stripe Tax (RECOMMENDED for Stripe users)

```typescript
// Enable Stripe Tax on checkout sessions
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  automatic_tax: { enabled: true },  // Stripe calculates tax
  customer_update: {
    address: 'auto',   // Collect address for tax calculation
  },
  mode: 'subscription',
  success_url: `${baseUrl}/success`,
  cancel_url: `${baseUrl}/cancel`,
});

// Stripe handles:
// - Tax rate determination based on customer location
// - Tax collection
// - Tax reporting
// You handle: remittance (paying the tax to authorities)
```

**Cost:** +0.5% per transaction on top of Stripe's standard fees.

### Pattern 2: Merchant of Record (Zero Tax Burden)

Use Paddle or LemonSqueezy. They are the legal seller, so they handle:
- Tax calculation
- Tax collection
- Tax remittance
- Invoicing with correct tax details

**Cost:** Higher per-transaction fees (Paddle ~5%, LemonSqueezy ~5%), but zero tax compliance work.

### Pattern 3: Manual (Not Recommended Past MVP)

Calculate and collect tax yourself using a tax API:

```typescript
// Using TaxJar API (or similar)
const taxRate = await taxjar.taxForOrder({
  to_country: customer.country,
  to_state: customer.state,
  to_zip: customer.zip,
  amount: subtotalInDollars,
  shipping: 0,
  line_items: [{ product_tax_code: '31000', /* Digital goods */ }],
});

// Apply tax to the order
const totalWithTax = subtotal + taxRate.amount_to_collect;
```

---

## Invoice Requirements by Jurisdiction

### EU VAT Invoice Requirements

Every invoice to an EU customer must include:

| Field | Required |
|-------|----------|
| Sequential invoice number | Yes |
| Invoice date | Yes |
| Your business name and address | Yes |
| Your VAT number | Yes |
| Customer name and address | Yes |
| Customer VAT number (B2B) | Yes (if reverse charge) |
| Description of goods/services | Yes |
| Unit price (excluding VAT) | Yes |
| VAT rate applied | Yes |
| VAT amount | Yes |
| Total amount (including VAT) | Yes |
| "Reverse charge" notation (B2B) | Yes (if applicable) |

### Stripe Invoicing

Stripe generates invoices automatically for subscriptions. Ensure your Stripe settings include:
- Your business name, address, and tax ID
- Tax settings configured for applicable jurisdictions
- Invoice numbering configured (sequential)

---

## VAT ID Validation (B2B)

For B2B sales within the EU, validate the customer's VAT ID to apply reverse charge:

```typescript
// Validate EU VAT ID via VIES API
import { checkVAT, countries } from 'jsvat';

function validateVatId(vatId: string): { valid: boolean; country: string } {
  const result = checkVAT(vatId, countries);
  return {
    valid: result.isValid,
    country: result.country?.isoCode?.short ?? 'unknown',
  };
}

// In your checkout flow:
if (customer.vatId && validateVatId(customer.vatId).valid) {
  // Apply reverse charge: 0% VAT, customer reports VAT themselves
  applyReverseCharge(invoice);
} else {
  // Charge VAT at customer's country rate
  applyVAT(invoice, customer.country);
}
```

---

## Tax Compliance Checklist

- [ ] Determined which jurisdictions require tax collection
- [ ] Chosen tax handling approach (Stripe Tax / MoR / Manual)
- [ ] Registered for tax permits in applicable jurisdictions
- [ ] Tax calculation integrated into checkout flow
- [ ] Invoices include all required fields per jurisdiction
- [ ] VAT ID validation implemented (if B2B with EU customers)
- [ ] Tax reporting schedule established (monthly/quarterly per jurisdiction)
- [ ] Consulted with tax professional for specific obligations

---

*Tax law changes frequently. Review your tax obligations at least quarterly and whenever entering new markets.*
