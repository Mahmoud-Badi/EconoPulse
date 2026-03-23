# Cap Table Planning

> Ownership structure, option pool sizing, dilution modeling, founder vesting, SAFE conversion scenarios, and anti-dilution provisions for {{PROJECT_NAME}}. Your cap table is the permanent record of who owns what — manage it deliberately from day one.

---

## 1. Current Ownership Structure

### Founder Equity Split

| Founder | Role | Shares | Ownership % | Vesting Status | Notes |
|---|---|---|---|---|---|
| Founder 1 | | | % | | |
| Founder 2 | | | % | | |
<!-- IF {{FOUNDER_COUNT}} == "3" -->
| Founder 3 | | | % | | |
<!-- ENDIF -->
| **Total Founder Shares** | | | **%** | | |

### Current Cap Table Summary

| Shareholder Category | Shares | Ownership % | Notes |
|---|---|---|---|
| Founders | | % | |
| Option Pool (allocated) | | % | |
| Option Pool (unallocated) | | % | |
| Angel Investors | | % | |
| SAFE Holders (unconverted) | | N/A (converts at next priced round) | |
| Advisors | | % | |
| **Total** | | **100%** | |

### Cap Table Tool

- **Tool:** {{CAP_TABLE_TOOL}}
- **Last Updated:** ___
- **Maintained By:** ___

**Critical rule:** Update the cap table within 48 hours of any equity event (grant, exercise, transfer, new investment). Stale cap tables create legal and fundraising risk.

---

## 2. Option Pool

### Pool Sizing

| Parameter | Value | Notes |
|---|---|---|
| Total Pool Size | {{OPTION_POOL_SIZE}} | Percentage of fully diluted shares |
| Shares in Pool | | |
| Allocated | | Grants issued to employees/advisors |
| Unallocated | | Available for future grants |
| Allocation Runway | months | How long until pool is exhausted at current grant pace |

### Sizing Guidelines by Stage

| Stage | Typical Pool Size | Rationale |
|---|---|---|
| Formation | 10-15% | Enough for first 5-10 hires |
| Seed | 10-20% | Investors often require 15-20% pool pre-money |
| Series A | 10-15% (refresh) | Top-up for next 12-18 months of hiring |
| Series B+ | 5-10% (refresh) | Smaller refreshes as hiring slows relative to headcount |

**Investor pool expansion trap:** Investors typically require the option pool to be sized (or expanded) pre-money, meaning founders bear the dilution. A 20% pool requirement on a $10M pre-money effectively reduces your valuation to $8M. Always negotiate pool size as part of valuation negotiation.

### Standard Vesting Terms

| Parameter | Standard | {{PROJECT_NAME}} Value |
|---|---|---|
| Vesting Period | 4 years | |
| Cliff | 1 year | |
| Vesting Schedule | Monthly after cliff | |
| Exercise Window (post-departure) | 90 days (standard) / 10 years (founder-friendly) | |
| Early Exercise | Available / Not Available | |
| Acceleration on Change of Control | Single / Double / None | |

### Grant Guidelines by Role

| Role Level | Equity Range (% of FD) | Typical Shares | Notes |
|---|---|---|---|
| VP / C-Suite (early) | 1.0 - 2.5% | | First exec hires; decreases as company scales |
| VP / C-Suite (post-Series A) | 0.5 - 1.5% | | |
| Director / Senior Lead | 0.25 - 0.75% | | |
| Senior Engineer / IC | 0.1 - 0.4% | | |
| Mid-Level | 0.05 - 0.15% | | |
| Junior | 0.01 - 0.05% | | |
| Advisor (standard) | 0.1 - 0.5% | | 2-year vesting, no cliff or 3-month cliff |
| Advisor (heavy involvement) | 0.5 - 1.0% | | Monthly vesting over 2 years |

---

## 3. Dilution Modeling

### Scenario A — Seed Round Only

| Shareholder | Pre-Seed (Current) | Post-Seed | Change |
|---|---|---|---|
| Founder 1 | % | % | -% |
| Founder 2 | % | % | -% |
| Option Pool | {{OPTION_POOL_SIZE}} | % | |
| Seed Investors | 0% | % | +% |
| **Total** | **100%** | **100%** | |

**Assumptions:**
- Seed raise: {{TARGET_RAISE_AMOUNT}}
- Pre-money valuation: {{PRE_MONEY_VALUATION}}
- Option pool: {{OPTION_POOL_SIZE}} (pre-money)

### Scenario B — Seed + Series A

| Shareholder | Current | Post-Seed | Post-Series A | Cumulative Dilution |
|---|---|---|---|---|
| Founder 1 | % | % | % | -% |
| Founder 2 | % | % | % | -% |
| Option Pool | % | % | % (refreshed) | |
| Seed Investors | 0% | % | % | |
| Series A Investors | 0% | 0% | % | |
| **Total** | **100%** | **100%** | **100%** | |

**Assumptions:**
- Series A raise: $___
- Series A pre-money: $___
- Option pool refresh: ___% (pre-money)

### Scenario C — Seed + Series A + Series B

| Shareholder | Current | Post-Seed | Post-A | Post-B | Cumulative Dilution |
|---|---|---|---|---|---|
| Founder 1 | % | % | % | % | -% |
| Founder 2 | % | % | % | % | -% |
| Option Pool | % | % | % | % | |
| Seed Investors | 0% | % | % | % | |
| Series A Investors | 0% | 0% | % | % | |
| Series B Investors | 0% | 0% | 0% | % | |
| **Total** | **100%** | **100%** | **100%** | **100%** | |

### Dilution Impact Calculator

```
Post-Money Valuation = Pre-Money Valuation + Investment Amount
New Investor Ownership = Investment Amount / Post-Money Valuation
Existing Shareholder Dilution = 1 - (Pre-Money / Post-Money)

Example:
  Pre-Money: $10,000,000
  Investment: $2,500,000
  Post-Money: $12,500,000
  New Investor Ownership: 20%
  Existing Dilution: 20% (each existing holder loses 20% of their stake)
```

---

## 4. Founder Vesting

### Why Founders Should Vest

Even with {{FOUNDER_COUNT}} founders, vesting protects everyone:
- Protects remaining founders if one leaves early
- Required by virtually all institutional investors
- Creates alignment on long-term commitment
- Prevents "dead equity" on the cap table

### Standard Founder Vesting Structure

| Parameter | Recommended | {{PROJECT_NAME}} Value |
|---|---|---|
| Total Vesting Period | 4 years | |
| Cliff | 1 year (or 0 if co-founders have history) | |
| Schedule | Monthly after cliff | |
| Credit for Time Served | Yes — backdate vesting start to company formation | |
| Acceleration (Single Trigger) | 25-50% on change of control | |
| Acceleration (Double Trigger) | 50-100% on CoC + termination | |

### Founder Vesting Scenarios

| Scenario | Outcome | Protection |
|---|---|---|
| Founder leaves at Month 6 (before cliff) | 0% vested, all shares returned | Remaining founders protected |
| Founder leaves at Month 18 | 37.5% vested, 62.5% returned | Fair for departing and remaining |
| Founder stays through Year 4 | 100% vested | Full ownership earned |
| Company acquired at Year 2 (single trigger 50%) | 50% + 50% accelerated = 100% | Founder protected in exit |
| Company acquired at Year 2 + founder terminated (double trigger) | 100% accelerated | Full protection on involuntary termination post-acquisition |

### Co-Founder Equity Split Considerations

| Factor | Weight | Notes |
|---|---|---|
| Idea origination | Low (5-10%) | Ideas are cheap; execution matters |
| Domain expertise | Medium (15-20%) | Relevant industry knowledge and network |
| Time commitment (full-time vs part-time) | High (20-25%) | Full-time commitment is non-negotiable for equal split |
| Capital contribution | Medium (10-15%) | Cash invested should be tracked separately (convertible note or SAFE) |
| Technical execution | High (20-25%) | Who builds the product? |
| Business/GTM execution | High (20-25%) | Who sells and grows the business? |
| Opportunity cost | Low-Medium (5-10%) | What is each founder giving up? |

---

## 5. SAFE Conversion Scenarios

### SAFE Terms Tracker

| SAFE Holder | Amount | Valuation Cap | Discount | MFN | Pro-Rata | Date |
|---|---|---|---|---|---|---|
| Investor A | $ | $ | % | Y/N | Y/N | |
| Investor B | $ | $ | % | Y/N | Y/N | |
| Investor C | $ | $ | % | Y/N | Y/N | |
| **Total SAFE $** | **$** | | | | | |

### Conversion Scenario — At Seed Round

**Scenario: Priced Seed at ${{PRE_MONEY_VALUATION}} pre-money**

| SAFE Holder | Investment | Cap | Discount | Conversion Price | Shares Issued | Ownership % |
|---|---|---|---|---|---|---|
| Investor A (Cap) | $ | $ | — | $ | | % |
| Investor B (Discount) | $ | — | % | $ | | % |
| Investor C (Cap + Discount) | $ | $ | % | $ (lower of cap/discount) | | % |

**Conversion Price Calculation:**

```
Cap-Based Price = Valuation Cap / Pre-Money Shares Outstanding
Discount-Based Price = Round Price x (1 - Discount%)
Conversion Price = Lower of Cap-Based and Discount-Based
Shares Issued = Investment Amount / Conversion Price
```

### Multiple SAFE Stacking Warning

When multiple SAFEs with different caps convert simultaneously, the math gets complex because each SAFE converts at a different price, creating different share prices in the same round. This can result in significantly more dilution than founders expect.

**Example of SAFE Stacking Surprise:**

| Component | Amount | Expectation | Reality |
|---|---|---|---|
| SAFE 1 ($3M cap) | $250K | ~8% dilution | 8.3% |
| SAFE 2 ($5M cap) | $500K | ~10% dilution | 10.0% |
| SAFE 3 ($8M cap) | $250K | ~3% dilution | 3.1% |
| Seed Round ($10M pre) | $2M | ~20% dilution | 16.7% (after SAFE conversion) |
| Option Pool Increase | — | — | 5% additional (pre-money) |
| **Total Founder Dilution** | | **~35% expected** | **~43% actual** |

**Lesson:** Model SAFE conversions in {{CAP_TABLE_TOOL}} before accepting each new SAFE. Understand the cumulative dilution impact.

---

## 6. Anti-Dilution Provisions

### Types of Anti-Dilution Protection

| Type | Mechanism | Impact on Founders | Frequency |
|---|---|---|---|
| **Full Ratchet** | Investor's conversion price drops to new round price | Severe — massive dilution to founders in a down round | Rare (red flag if proposed) |
| **Broad-Based Weighted Average** | Conversion price adjusted by weighted formula | Moderate — proportional adjustment | Standard and acceptable |
| **Narrow-Based Weighted Average** | Same as broad but excludes option pool from calculation | More dilutive than broad-based | Occasionally seen |
| **None** | No anti-dilution protection | No impact | Common in SAFEs and early rounds |

### Weighted Average Anti-Dilution Formula

```
New Conversion Price = Old Price x [(A + B) / (A + C)]

Where:
  A = Shares outstanding before new round
  B = Shares that would have been issued at old price (New Money / Old Price)
  C = Shares actually issued in new round (New Money / New Price)
```

### Down Round Dilution Impact

| Scenario | Founder Ownership Before | After (No Protection) | After (Broad WA) | After (Full Ratchet) |
|---|---|---|---|---|
| Series B at 50% of Series A price | % | % | % | % |
| Series B at 75% of Series A price | % | % | % | % |

### Negotiation Guidance

- **Accept:** Broad-Based Weighted Average — this is market standard and fair
- **Push Back On:** Narrow-Based Weighted Average — request broad-based instead
- **Reject:** Full Ratchet — this is a punitive term that can destroy founder ownership in a down round
- **Negotiate:** Carve-outs for small equity issuances (option grants, advisor shares) that should not trigger anti-dilution adjustments

---

## Cap Table Best Practices

### Do

- [ ] Use a professional cap table tool ({{CAP_TABLE_TOOL}}) from day one — not a spreadsheet
- [ ] Update within 48 hours of any equity event
- [ ] Model every new investment's dilution impact before accepting terms
- [ ] Keep a clean, auditable record of all equity grants and transfers
- [ ] Understand the difference between outstanding shares and fully diluted shares
- [ ] File 83(b) elections within 30 days of receiving restricted stock
- [ ] Issue equity through proper board resolutions and stock purchase agreements

### Do Not

- [ ] Split equity 50/50 without discussing vesting (a common source of co-founder disputes)
- [ ] Promise equity verbally — always use written agreements
- [ ] Ignore SAFE conversion modeling until a priced round forces it
- [ ] Use a spreadsheet for cap table management beyond 5 stakeholders
- [ ] Forget to account for the option pool expansion in pre-money valuation negotiations
- [ ] Skip legal review of any equity-related document

---

## Cap Table Audit Checklist

Run this audit quarterly and before any fundraising event:

- [ ] All equity grants have corresponding board resolutions
- [ ] All stock purchase agreements are signed and filed
- [ ] 83(b) elections are filed for all applicable grants
- [ ] Option pool allocation matches board-approved plan
- [ ] SAFE/convertible note register is current
- [ ] Fully diluted share count is calculated correctly
- [ ] Vesting schedules are tracked accurately
- [ ] Departed employees' unvested shares have been properly returned
- [ ] Exercise windows for departed employees are being tracked
- [ ] Cap table in {{CAP_TABLE_TOOL}} matches legal records
