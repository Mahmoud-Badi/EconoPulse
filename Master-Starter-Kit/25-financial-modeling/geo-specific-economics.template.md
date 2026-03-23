# Geo-Specific Economics — {{PROJECT_NAME}}

> Per-region unit economics model that accounts for purchasing power, local payment methods, tax regimes, FX risk, and regulatory costs. If you plan to sell outside a single country, this template prevents the two most common mistakes: underpricing in wealthy markets and overpricing in developing ones.

---

## Target Market Definition

| Parameter | Value |
|-----------|-------|
| Primary market | {{TARGET_REGIONS}} |
| Base currency for financial models | {{BASE_CURRENCY}} |
| Pricing strategy | <!-- IF {{PRICING_STRATEGY}} == "uniform" -->Uniform global pricing<!-- ENDIF --><!-- IF {{PRICING_STRATEGY}} == "ppp-adjusted" -->PPP-adjusted regional pricing<!-- ENDIF --><!-- IF {{PRICING_STRATEGY}} == "tiered-by-region" -->Tiered by region<!-- ENDIF --> |
| Number of pricing tiers | {{PRICING_TIERS}} |
| Localization level | Pricing only / Pricing + language / Full localization |

---

## Per-Region TAM Estimation

Addressable market varies dramatically by region. A $99/mo product has a different TAM in the US vs. Brazil vs. India.

| Region | Population of Target Segment | Internet Penetration | SaaS Adoption Rate | Willingness to Pay (relative to US) | Estimated Addressable Users | TAM (Local Currency) | TAM ({{BASE_CURRENCY}}) |
|--------|-------|------|------|------|------|------|------|
| North America (US/CA) | ___ | 92% | High | 100% (baseline) | ___ | $___ | $___ |
| Western Europe (UK/DE/FR) | ___ | 90% | High | 85-95% | ___ | ___ | $___ |
| Northern Europe (Nordics) | ___ | 95% | Very High | 95-105% | ___ | ___ | $___ |
| Latin America (BR/MX/AR) | ___ | 75% | Medium | 30-50% | ___ | ___ | $___ |
| India | ___ | 50% | Medium-Low | 15-25% | ___ | ___ | $___ |
| Southeast Asia (SG/ID/PH) | ___ | 70% | Medium | 20-40% | ___ | ___ | $___ |
| Japan/Korea | ___ | 93% | High | 80-100% | ___ | ___ | $___ |
| ANZ (AU/NZ) | ___ | 90% | High | 90-100% | ___ | ___ | $___ |
| Middle East (UAE/SA) | ___ | 95% | Medium-High | 70-90% | ___ | ___ | $___ |

**Penetration rate assumptions:** Start with 0.1-0.5% of addressable users in Year 1 for new markets. Adjust based on existing traction data.

---

## Purchasing Power Parity (PPP) Adjusted Pricing

PPP Index source: World Bank International Comparison Program (updated annually).

| Region | PPP Index (US = 1.00) | US Price | PPP-Adjusted Price | Recommended Price | Rounded Local Price | Revenue per User ({{BASE_CURRENCY}}) |
|--------|----------------------|----------|-------------------|-------------------|--------------------|----|
| United States | 1.00 | ${{BASE_PRICE}}/mo | ${{BASE_PRICE}} | ${{BASE_PRICE}} | ${{BASE_PRICE}} | ${{BASE_PRICE}} |
| United Kingdom | 0.92 | ${{BASE_PRICE}} | $___ | $___ | GBP ___ | $___ |
| Germany | 0.88 | ${{BASE_PRICE}} | $___ | $___ | EUR ___ | $___ |
| Brazil | 0.38 | ${{BASE_PRICE}} | $___ | $___ | BRL ___ | $___ |
| India | 0.23 | ${{BASE_PRICE}} | $___ | $___ | INR ___ | $___ |
| Japan | 0.82 | ${{BASE_PRICE}} | $___ | $___ | JPY ___ | $___ |
| Australia | 0.95 | ${{BASE_PRICE}} | $___ | $___ | AUD ___ | $___ |
| Mexico | 0.40 | ${{BASE_PRICE}} | $___ | $___ | MXN ___ | $___ |

**Formula:** `Recommended Price = US Price x PPP Index x Regional Adjustment Factor`

The Regional Adjustment Factor (0.8-1.2) accounts for competitive density and willingness-to-pay beyond raw PPP.

---

## Payment Processor Fees by Region

| Region | Processor | Transaction Fee | Cross-Border Fee | FX Fee | Total Effective Fee | Settlement Currency |
|--------|-----------|----------------|-----------------|--------|--------------------|----|
| US | Stripe | 2.9% + $0.30 | N/A | N/A | ~3.2% | USD |
| EU (SEPA) | Stripe | 1.5% + EUR 0.25 | N/A | N/A | ~2.0% | EUR |
| UK | Stripe | 1.5% + GBP 0.20 | N/A | N/A | ~2.0% | GBP |
| India | Razorpay | 2.0% + INR 3 | N/A | N/A | ~2.3% | INR |
| Brazil | Stripe (BR) | 3.99% + BRL 0.39 | N/A | N/A | ~4.5% | BRL |
| Japan | Stripe (JP) | 3.6% | N/A | N/A | ~3.8% | JPY |
| Cross-border (any) | Stripe | 2.9% + $0.30 | +1.5% | +1.0% | ~5.4% | USD |
| LATAM via US Stripe | Stripe | 2.9% + $0.30 | +1.5% | +1.0% | ~5.4% | USD |

**Key insight:** Processing a $10 payment from Brazil through US Stripe costs $0.84 (8.4%). Using a local processor in Brazil costs ~$0.45 (4.5%). At scale, local entities save 3-4% on every transaction.

---

## Tax Implications by Jurisdiction

| Jurisdiction | Tax Type | Rate | Registration Threshold | Filing Frequency | Notes |
|-------------|----------|------|----------------------|-----------------|-------|
| United States | Sales tax | 0-10.25% (varies by state) | Varies by state (economic nexus) | Monthly/quarterly | Must track per-state nexus; use Avalara/TaxJar |
| European Union | VAT | 17-27% (varies by country) | EUR 0 (for digital services) | Quarterly via OSS | VAT MOSS/OSS simplifies to one filing |
| United Kingdom | VAT | 20% | GBP 0 (for non-UK sellers) | Quarterly | Register via HMRC |
| India | GST | 18% (digital services) | INR 2M (~$24K) for local entities | Monthly | Equalization levy for foreign companies |
| Brazil | ISS + PIS/COFINS | ~9-15% combined | Varies | Monthly | Complex; use local fiscal representative |
| Japan | Consumption Tax | 10% | JPY 10M for local entities | Annually | JCT registration required for foreign providers |
| Australia | GST | 10% | AUD 75K | Quarterly | Must register for digital services |
| Canada | GST/HST | 5-15% | CAD 30K | Quarterly | Federal + provincial rates |

<!-- IF {{COMPANY_STAGE}} == "early" -->
**Early-stage note:** Most startups defer international tax registration until revenue from a specific jurisdiction exceeds $10K-$50K/year. Use Stripe Tax or Paddle (merchant of record) to automate compliance without local entity registration.
<!-- ENDIF -->

---

## FX Risk Assessment

| Currency Pair | 1Y Volatility (2024) | Max Drawdown (5Y) | Hedging Recommended | Strategy |
|---------------|---------------------|-------------------|--------------------|----------|
| USD/EUR | ~8% | -18% | Yes, above $50K/mo | Forward contracts or revenue matching |
| USD/GBP | ~10% | -22% | Yes, above $50K/mo | Forward contracts |
| USD/BRL | ~15% | -35% | Consider | Price in USD, accept BRL; reprice quarterly |
| USD/INR | ~5% | -12% | No (low volatility) | Price in USD |
| USD/JPY | ~12% | -25% | Yes, above $25K/mo | Natural hedge if you have JPY costs |
| USD/AUD | ~9% | -20% | Optional | Revenue matching |

**Hedging rules of thumb:**
- Below $100K annual revenue from a region: accept FX risk, price in USD
- $100K-$1M: price in local currency, reprice quarterly based on FX movement
- Above $1M: use forward contracts or a merchant of record that absorbs FX risk

---

## Regional CAC Differences

Customer acquisition costs vary 3-10x across regions due to ad costs, competitive density, and sales cycle differences.

| Region | Avg CPC (Google) | Avg CPC (Meta) | Typical B2B SaaS CAC | Relative to US | Why |
|--------|-----------------|----------------|---------------------|---------------|-----|
| US | $2.50-$8.00 | $1.50-$5.00 | $200-$800 | 1.0x (baseline) | Highest ad competition |
| UK/DE | $1.50-$5.00 | $1.00-$3.00 | $150-$500 | 0.6-0.8x | Slightly less competitive |
| Brazil | $0.30-$1.00 | $0.20-$0.80 | $30-$120 | 0.15-0.25x | Low ad costs, high volume |
| India | $0.10-$0.50 | $0.05-$0.30 | $10-$60 | 0.05-0.15x | Very low CPC, longer sales cycle |
| Japan | $1.00-$4.00 | $0.80-$2.50 | $100-$400 | 0.5-0.7x | Language barrier limits competition |
| ANZ | $1.50-$5.00 | $1.00-$3.50 | $120-$450 | 0.6-0.8x | Small market, moderate competition |

**Warning:** Low CAC does not mean high ROI. A $30 CAC in India with an LTV of $45 is worse than a $500 CAC in the US with an LTV of $3,000.

---

## Regulatory Compliance Costs

| Regulation | Jurisdictions | One-Time Setup Cost | Annual Ongoing Cost | Applies If |
|-----------|---------------|--------------------|--------------------|-----------|
| GDPR | EU/EEA | $5K-$25K | $2K-$10K | You process EU user data |
| CCPA/CPRA | California | $3K-$15K | $1K-$5K | >50K CA consumers or >$25M revenue |
| LGPD | Brazil | $3K-$10K | $1K-$5K | You process Brazilian user data |
| PIPEDA | Canada | $2K-$8K | $1K-$3K | You process Canadian user data |
| PIPA | Japan | $5K-$20K | $2K-$8K | You process Japanese user data |
| SOC 2 Type II | Global (enterprise) | $20K-$80K | $10K-$40K | Enterprise customers require it |

---

## Multi-Currency Pricing Strategy

### Rounding Conventions by Currency

| Currency | Convention | Bad Price | Good Price | Why |
|----------|-----------|-----------|------------|-----|
| USD | .99 endings | $10.00 | $9.99 | Psychological pricing standard |
| EUR | .99 or round | EUR 10.50 | EUR 9.99 | Same as USD convention |
| GBP | .99 endings | GBP 8.37 | GBP 7.99 | Same as USD convention |
| JPY | Round to 100s | JPY 1,437 | JPY 1,500 | No decimals in JPY; round to clean numbers |
| INR | Round to 99s | INR 847 | INR 849 or INR 899 | Round to x49 or x99 |
| BRL | Round to .90 | BRL 52.37 | BRL 49.90 | .90 is the Brazilian .99 |
| AUD | .99 endings | AUD 14.23 | AUD 13.99 | Same as USD convention |

---

## Gotchas: Geo-Pricing Mistakes

1. **Pricing at $9.99 USD doesn't work in Japan.** JPY has no decimal places. Your Stripe charge of JPY 1,498 looks arbitrary. Round to JPY 1,500 or JPY 980.

2. **Forgetting cross-border Stripe fees.** Charging a Brazilian customer through your US Stripe account costs 5.4% in fees. A local Stripe BR account costs 4%. At $100K/year from Brazil, that's $1,400/year in unnecessary fees.

3. **Ignoring VAT in displayed prices.** EU and UK law requires VAT-inclusive pricing for B2C. Your $29/mo plan is actually EUR 34.81 with 20% UK VAT. If your checkout shows EUR 29 and then adds tax, you violate consumer protection law and tank conversion rates.

4. **Using real-time FX conversion.** Your price changes every second. Customers see $29 one day and $31 the next. Lock exchange rates monthly or quarterly and update prices on a schedule.

5. **Assuming one entity is enough.** Past ~$500K revenue from a region, you may need a local entity for tax efficiency. A US entity paying 5.4% Stripe cross-border + 20% VAT remittance is drastically more expensive than an EU entity paying 1.5% local Stripe + simplified VAT OSS filing.

6. **PPP-adjusting to the point of unprofitability.** If your COGS per user is $5/mo, a PPP-adjusted price of $3/mo in India means you lose money on every customer. Set a price floor at COGS + minimum margin.

---

*Cross-references: pricing-financial-analysis.template.md (pricing strategy), unit-economics-calculator.template.md (per-region CAC/LTV), revenue-projection.template.md (revenue by region)*
