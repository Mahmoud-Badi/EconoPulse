# Term Sheet Analysis

> Economic terms, control terms, founder protections, red flags checklist, negotiation playbook, and side letter framework for {{PROJECT_NAME}}. A term sheet is not just a valuation — every clause shapes your company's governance, economics, and founder experience for years to come.

---

## 1. Economic Terms

### Valuation

| Term | Description | {{PROJECT_NAME}} Value | Market Standard |
|---|---|---|---|
| **Pre-Money Valuation** | Company value before new investment | {{PRE_MONEY_VALUATION}} | Stage-dependent |
| **Post-Money Valuation** | Pre-money + investment amount | | Pre + Raise |
| **Price Per Share** | Post-money / fully diluted shares | $ | Calculated |
| **Fully Diluted Shares** | All shares including options, warrants, SAFEs | | |

### Liquidation Preference

| Term | Description | Founder Impact | Market Standard |
|---|---|---|---|
| **1x Non-Participating** | Investor gets 1x their money back OR converts to common (whichever is higher) | Best for founders — investor chooses | Standard and acceptable |
| **1x Participating** | Investor gets 1x back AND participates pro-rata in remaining proceeds | Worse for founders — "double dip" | Push back; common in seed, less acceptable at A |
| **2x+ Non-Participating** | Investor gets 2x+ money back before common shares receive anything | Bad — high hurdle before founders see anything | Red flag — negotiate down to 1x |
| **2x+ Participating** | 2x+ back AND pro-rata participation | Very bad — heavily favors investor | Strong red flag — reject |

### Liquidation Preference Payout Scenarios

**Scenario: $10M investment at $40M post-money (25% ownership), 1x liquidation preference**

| Exit Value | 1x Non-Participating (Investor Gets) | 1x Participating (Investor Gets) | Common Stock Gets |
|---|---|---|---|
| $5M | $5M (1x preference, capped at exit) | $5M (all proceeds) | $0 |
| $10M | $10M (1x preference) | $10M (1x pref) + $0 remaining | $0 |
| $20M | $10M (1x pref, but converts for $5M — takes pref) | $10M + $2.5M (25% of $10M remaining) | $7.5M / $10M |
| $40M | $10M (converts to 25% = $10M, same either way) | $10M + $7.5M (25% of $30M remaining) | $22.5M / $30M |
| $100M | $25M (converts to 25%) | $10M + $22.5M (25% of $90M) | $67.5M / $75M |
| $200M | $50M (converts to 25%) | $10M + $47.5M (25% of $190M) | $142.5M / $150M |

**Key insight:** Participating preferred creates a "double dip" that significantly reduces common shareholder payout at moderate exit values. The difference narrows at very high exit values but is painful in the most likely exit scenarios.

### Dividends

| Type | Description | Market Standard |
|---|---|---|
| **Non-Cumulative** | Dividends paid only when declared by board | Standard — acceptable |
| **Cumulative** | Dividends accrue whether or not declared, paid at exit/conversion | Uncommon at early stage — push back |

**Recommendation:** Accept non-cumulative dividends (standard). Reject cumulative dividends unless there are exceptional circumstances.

### Pay-to-Play

| Description | Founder Impact | Market Standard |
|---|---|---|
| Investors who do not participate pro-rata in future rounds lose preferred status (convert to common) | Protects founders from investors who invest once but do not support future rounds | Increasingly common; founder-friendly |

---

## 2. Control Terms

### Board Composition

| Structure | Description | Founder Control? |
|---|---|---|
| **2 Founders + 1 Investor** | 3-member board with founder majority | Yes — founders control board |
| **2 Founders + 1 Investor + 1 Independent** | 4-member board (tied votes possible) | Partial — independent breaks ties |
| **2 Founders + 2 Investors + 1 Independent** | 5-member board — common post-Series A | No — investors can outvote founders with independent |
| **1 Founder + 1 Investor + 1 Independent** | 3-member board — minimum viable | Partial — depends on independent alignment |

**{{PROJECT_NAME}} Board Configuration:**

| Seat | Holder | Appointed By |
|---|---|---|
| Seat 1 | | Founders |
| Seat 2 | | Founders |
| Seat 3 | | Lead Investor |
<!-- IF {{BOARD_SIZE}} == "5" -->
| Seat 4 | | Investor(s) |
| Seat 5 | | Mutual agreement (independent) |
<!-- ENDIF -->

**Board Size:** {{BOARD_SIZE}}
**Meeting Cadence:** {{BOARD_MEETING_CADENCE}}

### Protective Provisions

Protective provisions give investors veto power over specific company actions. These are standard but the list should be reasonable.

| Provision | Standard? | Notes |
|---|---|---|
| Change the rights of preferred stock | Yes | Reasonable — protects their investment terms |
| Authorize new class of stock senior to preferred | Yes | Reasonable — prevents dilution of priority |
| Increase/decrease authorized shares | Yes | Reasonable |
| Declare dividends on common stock | Yes | Reasonable |
| Sell the company (M&A) | Yes | Standard but negotiate threshold |
| Take on debt above $[threshold] | Yes | Negotiate threshold to be reasonable for operations |
| Change the size of the board | Yes | Reasonable |
| Liquidate or dissolve the company | Yes | Reasonable |
| Change CEO compensation | Depends | Can be onerous — negotiate carefully |
| Annual budget approval | Depends | Can be operationally restrictive — push back |
| Hire/fire key executives | Depends | Negotiate which roles require board approval |
| Enter new line of business | No | Overly restrictive — push back |
| Make any expenditure over $[low threshold] | No | Micromanagement — reject |

### Voting Rights

| Term | Description | Standard |
|---|---|---|
| **Preferred votes on as-converted basis** | Preferred shares vote as if converted to common | Yes — standard |
| **Class vote on key matters** | Preferred class can block specific actions | Yes — via protective provisions |
| **Drag-along rights** | Majority can force minority to approve a sale | Standard at later stages |
| **Supermajority requirements** | Certain actions require 66-75% approval | Depends — negotiate thresholds |

---

## 3. Founder Protection Terms

### Vesting Acceleration

| Type | Trigger | Standard Treatment | Founder Preference |
|---|---|---|---|
| **Single Trigger** | Company is acquired | 25-50% of unvested shares accelerate | Good — provides partial protection |
| **Double Trigger** | Company is acquired AND founder is terminated/demoted within 12 months | 50-100% of unvested shares accelerate | Best — full protection on involuntary termination post-acquisition |
| **No Acceleration** | Neither event triggers acceleration | 0% acceleration | Bad — founder can be terminated post-acquisition and lose unvested shares |

**Recommendation:** Negotiate for double-trigger acceleration (100% on acquisition + termination within 12 months). This is fair to both sides — founders are protected only if they are pushed out, not if they leave voluntarily.

### Anti-Dilution Protection

| Type | Founder Impact | Standard |
|---|---|---|
| **Broad-Based Weighted Average** | Moderate dilution in down round | Yes — standard and fair |
| **Narrow-Based Weighted Average** | More dilution than broad-based | Push back — request broad-based |
| **Full Ratchet** | Severe dilution in down round | Reject — this is punitive |

(See `cap-table-planning.template.md` Section 6 for detailed anti-dilution math.)

### Founder Departure Terms

| Scenario | Negotiation Point |
|---|---|
| Voluntary departure | Standard — unvested shares returned, vested shares retained |
| Involuntary termination (without cause) | Negotiate: acceleration of 6-12 months additional vesting |
| Termination for cause | Standard — unvested shares returned, vested shares retained |
| Departure + repurchase right | Negotiate: company right to repurchase vested shares at FMV (not cost basis) |
| Exercise window post-departure | Negotiate: 90 days is standard but 5-10 years is founder-friendly |

### Information Rights

| Right | Investor Request | Founder Consideration |
|---|---|---|
| Monthly financials | Standard — provide | Low burden if you have good financial processes |
| Quarterly board deck | Standard — provide | Plan for preparation time (see `board-deck.template.md`) |
| Annual audited financials | Depends on stage | Audit cost is $10K-$50K — negotiate who pays |
| Inspection rights | Standard | Reasonable with advance notice requirement |
| Budget approval | Push back | Can slow operations — negotiate approval threshold |

---

## 4. Red Flags Checklist

Review every term sheet against this checklist before proceeding:

### Critical Red Flags (Walk Away If Not Fixed)

- [ ] **Full ratchet anti-dilution** — punitive; demand broad-based weighted average
- [ ] **Participating preferred with >1x liquidation** — excessive "double dip"
- [ ] **Cumulative dividends >8%** — compounds against founders over time
- [ ] **Board control for investors at seed stage** — premature; founders should control the board
- [ ] **Vesting reset on existing founder shares** — investors should not re-vest shares you have already earned
- [ ] **Unlimited protective provisions** — every major decision requires investor approval
- [ ] **Redemption rights** — investors can force the company to buy back their shares (creates existential cash risk)

### High Red Flags (Negotiate Aggressively)

- [ ] **Option pool increase entirely pre-money** — negotiate post-money or reduce pool size
- [ ] **No founder acceleration on change of control** — demand at least double-trigger
- [ ] **90-day exercise window** — push for longer (10 years is ideal for early employees)
- [ ] **Narrow-based weighted average anti-dilution** — request broad-based
- [ ] **Annual budget approval by board** — operationally restrictive
- [ ] **CEO termination by investor board members alone** — require full board or supermajority
- [ ] **Exclusivity period >45 days** — standard is 30 days; longer limits your leverage

### Medium Red Flags (Understand and Consider)

- [ ] **Pro-rata rights for all investors** (not just lead) — creates complexity in future rounds
- [ ] **Right of first refusal on secondary sales** — limits founder liquidity options
- [ ] **Pay-to-play provisions** — actually founder-friendly but understand implications
- [ ] **Drag-along provisions** — standard at later stages but understand thresholds
- [ ] **Most Favored Nation clause** — ensures this investor gets the best terms offered to anyone

---

## 5. Negotiation Playbook

### Pre-Negotiation Preparation

| Step | Action |
|---|---|
| 1 | Identify your must-haves vs. nice-to-haves |
| 2 | Research the investor's typical terms (ask their portfolio founders) |
| 3 | Know your BATNA — what happens if this deal falls through? |
| 4 | Engage experienced legal counsel who has negotiated term sheets (not just reviewed them) |
| 5 | Align with co-founders on priorities before any negotiation meeting |

### Negotiation Framework

| Term Category | Your Priority (1-5) | Standard Market | Your Position | Walk-Away Point |
|---|---|---|---|---|
| Pre-Money Valuation | | | $ | $ |
| Liquidation Preference | | 1x non-participating | | |
| Board Composition | | Founder majority (seed) | | |
| Option Pool Size | | 10-15% | % | % |
| Anti-Dilution | | Broad-based WA | | |
| Founder Acceleration | | Double trigger | | |
| Protective Provisions | | Standard set | | |
| Pro-Rata Rights | | For lead investor | | |

### Common Negotiation Trades

When you cannot get everything you want, trade lower-priority terms for higher-priority ones:

| If They Want | You Could Offer | In Exchange For |
|---|---|---|
| Lower valuation | Accept lower valuation | Smaller option pool (net effect is similar) |
| Board seat | Accept observer seat (non-voting) | No board seat until Series A |
| Participating preferred | Accept participation | Cap on participation (e.g., 3x cap) |
| Larger option pool | Accept larger pool | Higher pre-money valuation to offset dilution |
| Protective provisions | Accept standard set | Remove operational provisions (budget approval, hiring approval) |
| Right of first refusal | Accept ROFR | Include founder liquidity carve-out |

---

## 6. Side Letters

Side letters are separate agreements between the company and specific investors that modify or supplement the main investment documents.

### Common Side Letter Provisions

| Provision | Description | When Appropriate |
|---|---|---|
| **Pro-Rata Rights** | Right to invest in future rounds to maintain ownership % | Standard for lead investors |
| **Information Rights** | Enhanced reporting beyond standard investor rights | For major investors |
| **Board Observer** | Right to attend board meetings without voting | Alternative to full board seat |
| **Advisor Designation** | Investor or designee serves as formal advisor | When specific expertise is valuable |
| **Co-Investment Rights** | Right to invest in affiliated entities or SPVs | For strategic investors |
| **Most Favored Nation** | Ensures investor gets best terms offered to any investor | Common in SAFE rounds |
| **Strategic Partnership** | Preferred commercial terms with investor's company | For corporate/strategic investors |

### Side Letter Cautions

- [ ] Side letters can create different classes of investors with different rights — manage complexity
- [ ] Ensure side letters do not conflict with the main investment documents
- [ ] All side letters should be reviewed by legal counsel
- [ ] Disclose existence of side letters to all investors (some investment agreements require this)
- [ ] Keep a register of all side letters and their provisions

---

## Term Sheet Comparison Matrix

When evaluating multiple term sheets, use this matrix:

| Term | Investor A | Investor B | Investor C | Your Preference |
|---|---|---|---|---|
| Pre-Money Valuation | $ | $ | $ | |
| Investment Amount | $ | $ | $ | |
| Post-Money Valuation | $ | $ | $ | |
| Dilution | % | % | % | |
| Liquidation Preference | | | | |
| Participation | | | | |
| Board Seats (Investor) | | | | |
| Board Seats (Founder) | | | | |
| Anti-Dilution | | | | |
| Option Pool | % | % | % | |
| Protective Provisions | | | | |
| Founder Vesting Changes | | | | |
| Exclusivity Period | days | days | days | |
| Pro-Rata Rights | | | | |
| Drag-Along | | | | |
| Investor Value-Add (subjective) | /10 | /10 | /10 | |
| Portfolio Founder Refs (subjective) | /10 | /10 | /10 | |
| **Overall Assessment** | | | | |

---

## Term Sheet Review Workflow

1. **Receive term sheet** — acknowledge receipt within 24 hours; state your review timeline (typically 5-7 business days)
2. **Initial read** — founders read independently, note questions and concerns
3. **Legal review** — send to counsel within 24 hours; schedule review call within 48 hours
4. **Founder alignment** — founders discuss priorities and negotiation strategy
5. **Reference calls** — speak with 3+ founders in the investor's portfolio
6. **Respond** — send counter-proposal or accept, based on negotiation framework
7. **Negotiate** — typically 1-3 rounds of revisions
8. **Sign** — once terms are agreed, sign the term sheet (which is usually non-binding except for exclusivity and confidentiality)
9. **Definitive documents** — move to drafting final legal documents (4-6 weeks typically)
