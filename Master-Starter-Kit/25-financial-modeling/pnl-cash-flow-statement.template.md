# P&L and Cash Flow Statement — {{PROJECT_NAME}}

> A traditional 3-statement financial model adapted for startups: monthly P&L for 24 months, cash flow statement, and balance sheet summary. This is the document your investors will scrutinize. Every number here must tie back to your revenue projection (Section 25) and unit economics calculator.

---

## Revenue by Tier and Channel

Revenue is not one number. Break it down by where it comes from and what customers pay for.

### Revenue by Pricing Tier

| Tier | Monthly Price | M1 Customers | M6 Customers | M12 Customers | M18 Customers | M24 Customers |
|------|-------------|-------------|-------------|--------------|--------------|--------------|
| {{TIER_1_NAME}} (Free) | $0 | ___ | ___ | ___ | ___ | ___ |
| {{TIER_2_NAME}} (Starter) | ${{TIER_2_PRICE}} | ___ | ___ | ___ | ___ | ___ |
| {{TIER_3_NAME}} (Pro) | ${{TIER_3_PRICE}} | ___ | ___ | ___ | ___ | ___ |
| {{TIER_4_NAME}} (Enterprise) | ${{TIER_4_PRICE}} | ___ | ___ | ___ | ___ | ___ |
| **Total MRR** | | **${{MONTHLY_REVENUE_M1}}** | **$___** | **$___** | **$___** | **${{MONTHLY_REVENUE_M24}}** |

### Revenue by Channel

| Channel | M1 | M6 | M12 | M18 | M24 |
|---------|----|----|-----|-----|-----|
| Direct (website) | $___ | $___ | $___ | $___ | $___ |
| App marketplace | $___ | $___ | $___ | $___ | $___ |
| Partner/reseller | $___ | $___ | $___ | $___ | $___ |
| Outbound sales | $___ | $___ | $___ | $___ | $___ |
| **Total** | **${{MONTHLY_REVENUE_M1}}** | **$___** | **$___** | **$___** | **${{MONTHLY_REVENUE_M24}}** |

---

## Cost of Goods Sold (COGS)

COGS are the costs that scale directly with revenue. For software companies, these are typically 15-30% of revenue.

| COGS Category | Monthly Cost | % of Revenue | Notes |
|---------------|-------------|-------------|-------|
| Hosting / infrastructure | ${{COGS_HOSTING}} | ___% | See infrastructure-cost-model.template.md |
| Third-party API costs | ${{COGS_API}} | ___% | AI/LLM, maps, data providers |
| Customer support (direct) | ${{COGS_SUPPORT}} | ___% | Support staff + tooling allocated to COGS |
| Payment processing | Revenue x 2.9% + $0.30 | ~3% | Stripe/processor fees |
| Data/content licensing | $___ | ___% | Any licensed data feeds |
| **Total COGS** | **$___** | **___% of revenue** | Target: <30% for SaaS |

### Gross Profit

```
Gross Profit = Revenue - COGS
Gross Margin % = Gross Profit / Revenue x 100
```

| Month | Revenue | COGS | Gross Profit | Gross Margin % |
|-------|---------|------|-------------|----------------|
| M1 | ${{MONTHLY_REVENUE_M1}} | $___ | $___ | ___% |
| M3 | $___ | $___ | $___ | ___% |
| M6 | $___ | $___ | $___ | ___% |
| M9 | $___ | $___ | $___ | ___% |
| M12 | $___ | $___ | $___ | ___% |
| M18 | $___ | $___ | $___ | ___% |
| M24 | ${{MONTHLY_REVENUE_M24}} | $___ | $___ | ___% |

**Benchmark:** SaaS gross margins should be 70-85%. Below 60% signals you are reselling infrastructure, not software.

---

## Operating Expenses (OpEx)

OpEx does not scale linearly with revenue. It scales with headcount and growth ambitions.

| OpEx Category | M1 | M6 | M12 | M18 | M24 |
|---------------|----|----|-----|-----|-----|
| Salaries & wages | ${{OPEX_SALARIES}} | $___ | $___ | $___ | $___ |
| Benefits & payroll tax (25-35% of salaries) | $___ | $___ | $___ | $___ | $___ |
| Marketing & advertising | ${{OPEX_MARKETING}} | $___ | $___ | $___ | $___ |
| Tools & software subscriptions | ${{OPEX_TOOLS}} | $___ | $___ | $___ | $___ |
| Office / co-working | $___ | $___ | $___ | $___ | $___ |
| Legal & accounting | $___ | $___ | $___ | $___ | $___ |
| Insurance | $___ | $___ | $___ | $___ | $___ |
| Travel & conferences | $___ | $___ | $___ | $___ | $___ |
| Miscellaneous (5% buffer) | $___ | $___ | $___ | $___ | $___ |
| **Total OpEx** | **$___** | **$___** | **$___** | **$___** | **$___** |

---

## Monthly P&L Summary (24 Months)

| Line Item | M1 | M3 | M6 | M9 | M12 | M15 | M18 | M21 | M24 |
|-----------|----|----|----|----|-----|-----|-----|-----|-----|
| **Revenue** | ${{MONTHLY_REVENUE_M1}} | $___ | $___ | $___ | $___ | $___ | $___ | $___ | ${{MONTHLY_REVENUE_M24}} |
| COGS | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| **Gross Profit** | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Total OpEx | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| **EBITDA** | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Depreciation & amortization | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Interest expense | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| **Pre-tax income** | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| Tax provision | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |
| **Net Income** | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ | $___ |

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->
### SaaS-Specific P&L Metrics

| Metric | M6 | M12 | M18 | M24 |
|--------|----|-----|-----|-----|
| MRR | $___ | $___ | $___ | $___ |
| ARR | $___ | $___ | $___ | $___ |
| Net Revenue Retention | ___% | ___% | ___% | ___% |
| Gross Revenue Retention | ___% | ___% | ___% | ___% |
| Rule of 40 (Growth % + Margin %) | ___ | ___ | ___ | ___ |
<!-- ENDIF -->

---

## Cash Flow Statement

Cash flow differs from P&L because of timing. Revenue is recognized when earned; cash arrives when collected.

### Operating Activities

| Item | M1 | M6 | M12 | M18 | M24 |
|------|----|----|-----|-----|-----|
| Net income | $___ | $___ | $___ | $___ | $___ |
| Add back: depreciation | $___ | $___ | $___ | $___ | $___ |
| Change in accounts receivable | $___ | $___ | $___ | $___ | $___ |
| Change in accounts payable | $___ | $___ | $___ | $___ | $___ |
| Change in deferred revenue | $___ | $___ | $___ | $___ | $___ |
| **Net cash from operations** | **$___** | **$___** | **$___** | **$___** | **$___** |

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->
**Annual prepay note:** If you offer annual billing at a discount, you collect 12 months of cash upfront but recognize revenue monthly. This creates positive deferred revenue — cash in hand that is not yet "earned." This is powerful for cash flow but misleading if you confuse cash with revenue.
<!-- ENDIF -->

### Investing Activities

| Item | M1 | M6 | M12 | M18 | M24 |
|------|----|----|-----|-----|-----|
| Equipment purchases | $___ | $___ | $___ | $___ | $___ |
| Capitalized development costs | $___ | $___ | $___ | $___ | $___ |
| **Net cash from investing** | **$___** | **$___** | **$___** | **$___** | **$___** |

### Financing Activities

| Item | M1 | M6 | M12 | M18 | M24 |
|------|----|----|-----|-----|-----|
| Equity raised | $___ | $___ | $___ | $___ | $___ |
| Debt proceeds | $___ | $___ | $___ | $___ | $___ |
| Debt repayments | $___ | $___ | $___ | $___ | $___ |
| **Net cash from financing** | **$___** | **$___** | **$___** | **$___** | **$___** |

### Cash Position

| Month | Beginning Cash | Net Operating | Net Investing | Net Financing | **Ending Cash** |
|-------|---------------|---------------|---------------|---------------|-----------------|
| M1 | ${{CASH_IN_BANK}} | $___ | $___ | $___ | **$___** |
| M6 | $___ | $___ | $___ | $___ | **$___** |
| M12 | $___ | $___ | $___ | $___ | **$___** |
| M18 | $___ | $___ | $___ | $___ | **$___** |
| M24 | $___ | $___ | $___ | $___ | **$___** |

---

## Balance Sheet Summary

| Item | M1 | M12 | M24 |
|------|----|----|------|
| **Assets** | | | |
| Cash & equivalents | ${{CASH_IN_BANK}} | $___ | $___ |
| Accounts receivable | $___ | $___ | $___ |
| Prepaid expenses | $___ | $___ | $___ |
| Equipment (net of depreciation) | $___ | $___ | $___ |
| **Total Assets** | **$___** | **$___** | **$___** |
| **Liabilities** | | | |
| Accounts payable | $___ | $___ | $___ |
| Deferred revenue | $___ | $___ | $___ |
| Debt | $___ | $___ | $___ |
| **Total Liabilities** | **$___** | **$___** | **$___** |
| **Equity** | | | |
| Paid-in capital | $___ | $___ | $___ |
| Retained earnings | $___ | $___ | $___ |
| **Total Equity** | **$___** | **$___** | **$___** |

---

## Investor Deck Financial Slide Inputs

These are the numbers your pitch deck needs. Pull them from the tables above.

| Slide Metric | Value | Source Row |
|-------------|-------|-----------|
| Current MRR | ${{MONTHLY_REVENUE_M1}} | Revenue M1 |
| Projected ARR (Year 2) | $___ | Revenue M24 x 12 |
| Gross margin | ___% | Gross Profit / Revenue |
| Monthly burn rate | $___ | Net cash from operations (negative months) |
| Runway (months) | ___ | Cash / monthly burn |
| Months to profitability | ___ | First month Net Income > 0 |
| CAC payback period | ___ months | From unit-economics-calculator |
| LTV:CAC ratio | ___:1 | From unit-economics-calculator |

---

## Gotchas: Common P&L Mistakes Startups Make

1. **Counting annual prepayments as monthly revenue.** If a customer pays $1,200 upfront for an annual plan, your M1 revenue is $100, not $1,200. The rest is deferred revenue (a liability).

2. **Ignoring payment processor fees in COGS.** Stripe takes 2.9% + $0.30. On a $29/mo plan, that is $1.14/mo per customer — nearly 4%. At scale this is your third-largest COGS line.

3. **Treating all salaries as one line.** Investors want to see headcount allocation: how much goes to R&D (building product) vs. S&M (acquiring customers) vs. G&A (keeping the lights on). The ratio tells them where you invest.

4. **Forgetting payroll taxes and benefits.** A $120K salary costs $150K-$170K fully loaded (employer taxes, health insurance, 401k match, equipment). Use a 1.3x-1.4x multiplier.

5. **No cash flow statement.** A profitable P&L with negative cash flow kills companies. Enterprise customers pay Net 30-60, so your revenue is recognized months before cash arrives.

6. **Showing only the optimistic scenario.** Always model Base, Bear, and Bull cases. Investors will stress-test your Bear case. If it shows death in 6 months, you have a problem.

7. **Missing the COGS / OpEx boundary.** Customer support that handles billing issues is COGS. The VP of Customer Success's salary is OpEx. Getting this wrong distorts your gross margin, which is the metric investors use to value SaaS companies.

---

*Cross-references: revenue-projection.template.md (revenue inputs), unit-economics-calculator.template.md (CAC/LTV), runway-burn-rate.template.md (runway calculation), team-cost-projection.template.md (salary detail), infrastructure-cost-model.template.md (COGS hosting detail)*
