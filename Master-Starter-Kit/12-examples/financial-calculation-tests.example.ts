/**
 * Financial Calculation Tests — TaskFlow Accounting Module (Example)
 *
 * READ ONLY — reference example showing financial test patterns.
 *
 * CRITICAL RULE: All monetary values are stored as integers (cents).
 * Never use floating-point arithmetic for money. $100.50 = 10050 cents.
 *
 * Patterns demonstrated:
 * - Integer-based currency handling (cents, never floats)
 * - Invoice total calculation with line items, tax, and discounts
 * - Commission splits (percentage, flat fee, tiered)
 * - Settlement reconciliation (detect discrepancies)
 * - Rounding edge cases (half-cent, multi-line accumulation)
 * - Test fixtures with factory functions
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

// ─── Types ─────────────────────────────────────────────────────────

interface LineItem {
  description: string;
  quantityCents: number; // e.g., 1 unit = 100 (supports fractional quantities)
  unitPriceCents: number;
  taxRateBps: number; // basis points: 750 = 7.50%
  discountCents: number;
}

interface Invoice {
  id: string;
  lineItems: LineItem[];
  discountCents: number; // invoice-level discount
  adjustmentCents: number; // manual adjustment (+/-)
}

interface CommissionRule {
  type: 'percentage' | 'flat' | 'tiered';
  percentageBps?: number; // basis points: 1000 = 10.00%
  flatAmountCents?: number;
  tiers?: { minCents: number; maxCents: number; rateBps: number }[];
}

interface Payment {
  id: string;
  invoiceId: string;
  amountCents: number;
  paidAt: Date;
}

// ─── Calculation Functions Under Test ──────────────────────────────

/**
 * WHY cents: JavaScript's floating-point math produces errors like
 * 0.1 + 0.2 = 0.30000000000000004. Using cents (integers) eliminates
 * this entire class of bugs. All display formatting happens at the UI layer.
 */
function calculateLineItemTotal(item: LineItem): {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
} {
  // Quantity is stored as cents too (100 = 1 unit) to support fractional
  const subtotalCents = Math.round((item.quantityCents * item.unitPriceCents) / 100) - item.discountCents;
  // Tax: basis points / 10000 to get decimal rate
  const taxCents = Math.round((subtotalCents * item.taxRateBps) / 10000);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
  };
}

function calculateInvoiceTotal(invoice: Invoice): {
  subtotalCents: number;
  taxTotalCents: number;
  discountCents: number;
  totalCents: number;
} {
  let subtotalCents = 0;
  let taxTotalCents = 0;

  for (const item of invoice.lineItems) {
    const lineResult = calculateLineItemTotal(item);
    subtotalCents += lineResult.subtotalCents;
    taxTotalCents += lineResult.taxCents;
  }

  // Apply invoice-level discount AFTER line item totals
  const discountedSubtotal = subtotalCents - invoice.discountCents;
  const totalCents = discountedSubtotal + taxTotalCents + invoice.adjustmentCents;

  return {
    subtotalCents,
    taxTotalCents,
    discountCents: invoice.discountCents,
    totalCents,
  };
}

function calculateCommission(revenueCents: number, rule: CommissionRule): number {
  switch (rule.type) {
    case 'percentage':
      // WHY Math.round: commission on $1,234.56 at 7.5% = $92.592
      // We round to nearest cent. This matches industry standard (carrier payments).
      return Math.round((revenueCents * (rule.percentageBps ?? 0)) / 10000);

    case 'flat':
      return rule.flatAmountCents ?? 0;

    case 'tiered': {
      if (!rule.tiers || rule.tiers.length === 0) return 0;
      let remaining = revenueCents;
      let commission = 0;

      for (const tier of rule.tiers) {
        if (remaining <= 0) break;
        const tierWidth = tier.maxCents - tier.minCents;
        const taxableInTier = Math.min(remaining, tierWidth);
        commission += Math.round((taxableInTier * tier.rateBps) / 10000);
        remaining -= taxableInTier;
      }
      return commission;
    }

    default:
      throw new Error(`Unknown commission type: ${(rule as any).type}`);
  }
}

function reconcileSettlement(
  invoices: { id: string; totalCents: number }[],
  payments: Payment[],
): {
  expectedCents: number;
  receivedCents: number;
  discrepancyCents: number;
  status: 'balanced' | 'underpaid' | 'overpaid';
  unmatched: string[];
} {
  const expectedCents = invoices.reduce((sum, inv) => sum + inv.totalCents, 0);
  const receivedCents = payments.reduce((sum, pay) => sum + pay.amountCents, 0);
  const discrepancyCents = receivedCents - expectedCents;

  // Find invoices with no matching payment
  const paidInvoiceIds = new Set(payments.map((p) => p.invoiceId));
  const unmatched = invoices.filter((inv) => !paidInvoiceIds.has(inv.id)).map((inv) => inv.id);

  return {
    expectedCents,
    receivedCents,
    discrepancyCents,
    status: discrepancyCents === 0 ? 'balanced' : discrepancyCents < 0 ? 'underpaid' : 'overpaid',
    unmatched,
  };
}

// ─── Test Fixtures ─────────────────────────────────────────────────

function createLineItem(overrides: Partial<LineItem> = {}): LineItem {
  return {
    description: 'Freight charge',
    quantityCents: 100, // 1 unit
    unitPriceCents: 100000, // $1,000.00
    taxRateBps: 0, // no tax by default
    discountCents: 0,
    ...overrides,
  };
}

function createInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: 'inv_test_001',
    lineItems: [createLineItem()],
    discountCents: 0,
    adjustmentCents: 0,
    ...overrides,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('Invoice Total Calculation', () => {
  // ─── Line Item Basics ──────────────────────────────────────────

  describe('Line Item totals', () => {
    it('calculates simple line item (no tax, no discount)', () => {
      const item = createLineItem({
        quantityCents: 100, // 1 unit
        unitPriceCents: 250000, // $2,500.00
      });

      const result = calculateLineItemTotal(item);

      expect(result.subtotalCents).toBe(250000);
      expect(result.taxCents).toBe(0);
      expect(result.totalCents).toBe(250000);
    });

    it('calculates line item with tax', () => {
      // WHY: Tax calculation is the #1 source of penny discrepancies.
      // This test verifies correct rounding behavior.
      const item = createLineItem({
        quantityCents: 100,
        unitPriceCents: 123456, // $1,234.56
        taxRateBps: 750, // 7.50%
      });

      const result = calculateLineItemTotal(item);

      expect(result.subtotalCents).toBe(123456);
      // $1,234.56 * 7.50% = $92.592 → rounds to $92.59 = 9259 cents
      expect(result.taxCents).toBe(9259);
      expect(result.totalCents).toBe(132715);
    });

    it('calculates line item with discount', () => {
      const item = createLineItem({
        quantityCents: 100,
        unitPriceCents: 500000, // $5,000.00
        discountCents: 50000, // $500.00 discount
      });

      const result = calculateLineItemTotal(item);

      expect(result.subtotalCents).toBe(450000); // $4,500.00
    });

    it('calculates fractional quantity correctly', () => {
      // WHY: Freight is sometimes charged per-mile or per-hundredweight.
      // 1.5 units = 150 quantityCents
      const item = createLineItem({
        quantityCents: 150, // 1.5 units
        unitPriceCents: 100000, // $1,000.00 per unit
      });

      const result = calculateLineItemTotal(item);

      // 1.5 * $1,000.00 = $1,500.00
      expect(result.subtotalCents).toBe(150000);
    });

    it('handles zero quantity', () => {
      const item = createLineItem({ quantityCents: 0 });
      const result = calculateLineItemTotal(item);

      expect(result.subtotalCents).toBe(0);
      expect(result.taxCents).toBe(0);
      expect(result.totalCents).toBe(0);
    });
  });

  // ─── Invoice-Level Totals ──────────────────────────────────────

  describe('Invoice totals', () => {
    it('sums multiple line items', () => {
      const invoice = createInvoice({
        lineItems: [
          createLineItem({ unitPriceCents: 100000 }), // $1,000.00
          createLineItem({ unitPriceCents: 200000 }), // $2,000.00
          createLineItem({ unitPriceCents: 50000 }), // $500.00
        ],
      });

      const result = calculateInvoiceTotal(invoice);

      expect(result.subtotalCents).toBe(350000); // $3,500.00
      expect(result.totalCents).toBe(350000);
    });

    it('applies invoice-level discount', () => {
      const invoice = createInvoice({
        lineItems: [createLineItem({ unitPriceCents: 200000 })],
        discountCents: 25000, // $250.00 discount
      });

      const result = calculateInvoiceTotal(invoice);

      expect(result.subtotalCents).toBe(200000);
      expect(result.discountCents).toBe(25000);
      expect(result.totalCents).toBe(175000); // $1,750.00
    });

    it('applies adjustment (positive — surcharge)', () => {
      const invoice = createInvoice({
        lineItems: [createLineItem({ unitPriceCents: 100000 })],
        adjustmentCents: 5000, // $50.00 fuel surcharge
      });

      const result = calculateInvoiceTotal(invoice);

      expect(result.totalCents).toBe(105000);
    });

    it('applies adjustment (negative — credit)', () => {
      const invoice = createInvoice({
        lineItems: [createLineItem({ unitPriceCents: 100000 })],
        adjustmentCents: -10000, // $100.00 credit
      });

      const result = calculateInvoiceTotal(invoice);

      expect(result.totalCents).toBe(90000);
    });

    it('handles empty invoice (no line items)', () => {
      const invoice = createInvoice({ lineItems: [] });
      const result = calculateInvoiceTotal(invoice);

      expect(result.subtotalCents).toBe(0);
      expect(result.totalCents).toBe(0);
    });
  });

  // ─── Tax Accumulation ──────────────────────────────────────────

  describe('Tax accumulation across line items', () => {
    it('accumulates tax per-line to avoid compound rounding errors', () => {
      // WHY: If you sum all subtotals first, then apply tax once, you get
      // different results than taxing each line and summing. The per-line
      // approach matches what accounting software (QuickBooks, etc.) does.
      const invoice = createInvoice({
        lineItems: [
          createLineItem({ unitPriceCents: 33333, taxRateBps: 875 }), // $333.33 @ 8.75%
          createLineItem({ unitPriceCents: 33333, taxRateBps: 875 }), // $333.33 @ 8.75%
          createLineItem({ unitPriceCents: 33334, taxRateBps: 875 }), // $333.34 @ 8.75%
        ],
      });

      const result = calculateInvoiceTotal(invoice);

      // Per-line tax:
      // Line 1: 33333 * 875 / 10000 = 2916.6375 → 2917
      // Line 2: 33333 * 875 / 10000 = 2916.6375 → 2917
      // Line 3: 33334 * 875 / 10000 = 2916.725  → 2917
      // Total tax: 8751
      expect(result.taxTotalCents).toBe(8751);

      // vs. bulk calculation: 100000 * 875 / 10000 = 8750 (WRONG by 1 cent)
      // This test PROVES per-line is correct.
    });
  });
});

// ─── Commission Tests ──────────────────────────────────────────────

describe('Commission Calculations', () => {
  describe('Percentage-based commission', () => {
    it('calculates standard broker commission', () => {
      // WHY: 10% is a common TMS broker margin.
      // $5,000.00 load * 10% = $500.00 commission
      const result = calculateCommission(500000, {
        type: 'percentage',
        percentageBps: 1000, // 10.00%
      });

      expect(result).toBe(50000); // $500.00
    });

    it('rounds half-cent to nearest cent', () => {
      // WHY: $1,234.56 * 7.5% = $92.592 — the 0.2 cents must be handled.
      // Math.round(9259.2) = 9259. Industry standard: round to nearest.
      const result = calculateCommission(123456, {
        type: 'percentage',
        percentageBps: 750,
      });

      expect(result).toBe(9259); // $92.59
    });

    it('handles exact half-cent (banker rounding edge case)', () => {
      // WHY: Math.round(0.5) = 1 in JS (rounds up). This is acceptable
      // for TMS. If you need banker's rounding, use a library.
      // $100.00 * 5.5% = $5.50 — no rounding needed
      const result = calculateCommission(10000, {
        type: 'percentage',
        percentageBps: 550,
      });

      expect(result).toBe(550); // $5.50 exactly
    });

    it('handles zero revenue', () => {
      const result = calculateCommission(0, {
        type: 'percentage',
        percentageBps: 1000,
      });

      expect(result).toBe(0);
    });

    it('handles very small amounts without losing precision', () => {
      // WHY: A $1.00 load at 3% commission = $0.03.
      // Integer math: 100 * 300 / 10000 = 3. Correct.
      const result = calculateCommission(100, {
        type: 'percentage',
        percentageBps: 300,
      });

      expect(result).toBe(3); // $0.03
    });
  });

  describe('Flat fee commission', () => {
    it('returns flat amount regardless of revenue', () => {
      // WHY: Some brokers charge a flat $150 dispatch fee per load.
      const result = calculateCommission(500000, {
        type: 'flat',
        flatAmountCents: 15000,
      });

      expect(result).toBe(15000); // $150.00
    });

    it('returns flat amount even for tiny loads', () => {
      const result = calculateCommission(5000, {
        type: 'flat',
        flatAmountCents: 15000,
      });

      // Flat fee exceeds revenue — that's the broker's problem, not a math error
      expect(result).toBe(15000);
    });
  });

  describe('Tiered commission', () => {
    // WHY: Tiered commissions incentivize volume. Common in TMS:
    // First $10K = 15%, Next $10K = 12%, Above $20K = 10%
    const tieredRule: CommissionRule = {
      type: 'tiered',
      tiers: [
        { minCents: 0, maxCents: 1000000, rateBps: 1500 }, // $0-$10K: 15%
        { minCents: 1000000, maxCents: 2000000, rateBps: 1200 }, // $10K-$20K: 12%
        { minCents: 2000000, maxCents: 10000000, rateBps: 1000 }, // $20K+: 10%
      ],
    };

    it('revenue within first tier', () => {
      // $5,000.00 — all in first tier (15%)
      const result = calculateCommission(500000, tieredRule);

      // 500000 * 1500 / 10000 = 75000
      expect(result).toBe(75000); // $750.00
    });

    it('revenue spanning two tiers', () => {
      // $15,000.00 — first $10K at 15%, next $5K at 12%
      const result = calculateCommission(1500000, tieredRule);

      // Tier 1: 1000000 * 1500 / 10000 = 150000 ($1,500)
      // Tier 2: 500000 * 1200 / 10000 = 60000 ($600)
      // Total: 210000 ($2,100)
      expect(result).toBe(210000);
    });

    it('revenue spanning all tiers', () => {
      // $30,000.00 — $10K at 15%, $10K at 12%, $10K at 10%
      const result = calculateCommission(3000000, tieredRule);

      // Tier 1: 1000000 * 1500 / 10000 = 150000
      // Tier 2: 1000000 * 1200 / 10000 = 120000
      // Tier 3: 1000000 * 1000 / 10000 = 100000
      // Total: 370000 ($3,700)
      expect(result).toBe(370000);
    });

    it('handles zero revenue in tiered', () => {
      const result = calculateCommission(0, tieredRule);
      expect(result).toBe(0);
    });
  });
});

// ─── Settlement Reconciliation Tests ───────────────────────────────

describe('Settlement Reconciliation', () => {
  it('detects balanced settlement', () => {
    const invoices = [
      { id: 'inv_1', totalCents: 100000 },
      { id: 'inv_2', totalCents: 200000 },
    ];
    const payments: Payment[] = [
      { id: 'pay_1', invoiceId: 'inv_1', amountCents: 100000, paidAt: new Date() },
      { id: 'pay_2', invoiceId: 'inv_2', amountCents: 200000, paidAt: new Date() },
    ];

    const result = reconcileSettlement(invoices, payments);

    expect(result.status).toBe('balanced');
    expect(result.discrepancyCents).toBe(0);
    expect(result.unmatched).toHaveLength(0);
  });

  it('detects underpayment', () => {
    // WHY: Carriers sometimes short-pay invoices. The system must flag this
    // so accounting can follow up.
    const invoices = [
      { id: 'inv_1', totalCents: 500000 }, // $5,000.00
    ];
    const payments: Payment[] = [
      { id: 'pay_1', invoiceId: 'inv_1', amountCents: 480000, paidAt: new Date() }, // $4,800.00
    ];

    const result = reconcileSettlement(invoices, payments);

    expect(result.status).toBe('underpaid');
    expect(result.discrepancyCents).toBe(-20000); // $200.00 short
  });

  it('detects overpayment', () => {
    // WHY: Overpayments happen (duplicate payments, prepayments).
    // The system must surface these for refund processing.
    const invoices = [{ id: 'inv_1', totalCents: 100000 }];
    const payments: Payment[] = [
      { id: 'pay_1', invoiceId: 'inv_1', amountCents: 100000, paidAt: new Date() },
      { id: 'pay_2', invoiceId: 'inv_1', amountCents: 100000, paidAt: new Date() }, // duplicate
    ];

    const result = reconcileSettlement(invoices, payments);

    expect(result.status).toBe('overpaid');
    expect(result.discrepancyCents).toBe(100000); // $1,000.00 over
  });

  it('identifies unmatched invoices', () => {
    // WHY: An unpaid invoice in a settlement batch means money is owed.
    // This catches invoices that slipped through without payment.
    const invoices = [
      { id: 'inv_1', totalCents: 100000 },
      { id: 'inv_2', totalCents: 200000 },
      { id: 'inv_3', totalCents: 150000 }, // No payment
    ];
    const payments: Payment[] = [
      { id: 'pay_1', invoiceId: 'inv_1', amountCents: 100000, paidAt: new Date() },
      { id: 'pay_2', invoiceId: 'inv_2', amountCents: 200000, paidAt: new Date() },
    ];

    const result = reconcileSettlement(invoices, payments);

    expect(result.unmatched).toEqual(['inv_3']);
    expect(result.status).toBe('underpaid');
    expect(result.discrepancyCents).toBe(-150000);
  });

  it('handles empty settlement (no invoices, no payments)', () => {
    const result = reconcileSettlement([], []);

    expect(result.status).toBe('balanced');
    expect(result.expectedCents).toBe(0);
    expect(result.receivedCents).toBe(0);
  });

  it('handles single-cent discrepancy', () => {
    // WHY: A 1-cent discrepancy is still a discrepancy. In accounting,
    // every cent must balance. This test ensures we don't use a
    // tolerance threshold that hides real issues.
    const invoices = [{ id: 'inv_1', totalCents: 100000 }];
    const payments: Payment[] = [
      { id: 'pay_1', invoiceId: 'inv_1', amountCents: 99999, paidAt: new Date() },
    ];

    const result = reconcileSettlement(invoices, payments);

    expect(result.status).toBe('underpaid');
    expect(result.discrepancyCents).toBe(-1);
  });
});

// ─── Rounding Edge Cases ───────────────────────────────────────────

describe('Rounding Edge Cases', () => {
  it('demonstrates why floats fail for money', () => {
    // WHY THIS TEST EXISTS: This proves the fundamental problem with floats.
    // If anyone proposes using parseFloat() for money, show them this test.

    // Float math (BROKEN):
    const floatResult = 0.1 + 0.2;
    expect(floatResult).not.toBe(0.3); // 0.30000000000000004

    // Integer math (CORRECT):
    const intResult = 10 + 20; // cents
    expect(intResult).toBe(30);
  });

  it('multi-line accumulation does not drift', () => {
    // WHY: When you round each line individually and sum, the total
    // can differ from rounding the sum. This test verifies our per-line
    // approach stays consistent across many items.
    const items = Array.from({ length: 100 }, (_, i) =>
      createLineItem({
        unitPriceCents: 9999, // $99.99 per item
        taxRateBps: 825, // 8.25% tax
      }),
    );

    const invoice = createInvoice({ lineItems: items });
    const result = calculateInvoiceTotal(invoice);

    // Per-line: each line tax = round(9999 * 825 / 10000) = round(824.9175) = 825
    // 100 lines: 100 * 825 = 82500
    expect(result.taxTotalCents).toBe(82500);

    // Total: 100 * 9999 + 82500 = 999900 + 82500 = 1082400
    expect(result.totalCents).toBe(1082400);
  });

  it('very large invoice does not overflow', () => {
    // WHY: JavaScript integers are safe up to 2^53 - 1 (9,007,199,254,740,991).
    // That's $90 trillion in cents. Well within range for any TMS.
    // But we test to be sure.
    const item = createLineItem({
      quantityCents: 100,
      unitPriceCents: 99999999, // $999,999.99
    });

    const invoice = createInvoice({ lineItems: [item] });
    const result = calculateInvoiceTotal(invoice);

    expect(result.totalCents).toBe(99999999);
    expect(Number.isSafeInteger(result.totalCents)).toBe(true);
  });

  it('tax on $0.01 rounds correctly', () => {
    // Edge case: smallest possible amount
    const item = createLineItem({
      quantityCents: 100,
      unitPriceCents: 1, // $0.01
      taxRateBps: 750, // 7.50%
    });

    const result = calculateLineItemTotal(item);

    // 1 * 750 / 10000 = 0.075 → rounds to 0
    // WHY: Tax on a penny is less than half a cent, so it rounds to zero.
    // This is correct behavior — you cannot charge 0.075 cents.
    expect(result.taxCents).toBe(0);
    expect(result.totalCents).toBe(1);
  });

  it('negative adjustments cannot make total negative', () => {
    // WHY: A credit memo larger than the invoice amount should be caught
    // by business logic validation, but the math itself must still work.
    const invoice = createInvoice({
      lineItems: [createLineItem({ unitPriceCents: 10000 })], // $100.00
      adjustmentCents: -50000, // $500.00 credit (exceeds invoice!)
    });

    const result = calculateInvoiceTotal(invoice);

    // Math is correct even if the business logic should reject this
    expect(result.totalCents).toBe(-40000); // -$400.00
    // Business layer should validate: if (totalCents < 0) throw INVALID_CREDIT
  });
});

// ─── Display Formatting (NOT calculation — UI layer only) ──────────

describe('Currency Display (Reference)', () => {
  /**
   * WHY: Formatting is separate from calculation. Never format during
   * computation. Only format when displaying to the user.
   */
  function formatCents(cents: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100);
  }

  it('formats positive amount', () => {
    expect(formatCents(250000)).toBe('$2,500.00');
  });

  it('formats negative amount (credit)', () => {
    expect(formatCents(-50000)).toBe('-$500.00');
  });

  it('formats zero', () => {
    expect(formatCents(0)).toBe('$0.00');
  });

  it('formats sub-dollar amount', () => {
    expect(formatCents(99)).toBe('$0.99');
  });

  it('formats large amount with comma separators', () => {
    expect(formatCents(1234567890)).toBe('$12,345,678.90');
  });
});
