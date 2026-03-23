# Fundraising Gotchas

> 16 common fundraising mistakes ranked by severity (CRITICAL, HIGH, MEDIUM, LOW) with explanations, real-world consequences, and actionable mitigations. Review this before every major fundraising decision.

---

## How to Use This Document

Read through all 16 gotchas before beginning your fundraising process. Revisit the CRITICAL and HIGH items before signing any term sheet. Share this document with co-founders and advisors so everyone is aware of the common failure modes.

### Severity Legend

| Severity | Meaning | Action |
|---|---|---|
| **CRITICAL** | Can kill the company or cause irreversible founder damage | Must be addressed before fundraising begins |
| **HIGH** | Significant financial or strategic harm; difficult to reverse | Address before signing any term sheet |
| **MEDIUM** | Creates friction, delays, or suboptimal outcomes | Address during fundraising process |
| **LOW** | Minor inefficiency or missed opportunity | Address when time permits |

---

## Gotcha 1 — Raising Too Early

**Severity: CRITICAL**

### The Mistake

Raising capital before you have enough evidence that the business can work. You burn months on fundraising, get rejected repeatedly (or get a bad deal), and return to building with less time, less confidence, and potentially a tainted reputation with investors.

### Real-World Consequence

- Investor rejection becomes your first impression — and investors remember
- You accept worse terms out of desperation (higher dilution, bad terms)
- Fundraising distracts from the product and customer work that would actually make you fundable
- You burn runway on the process itself (legal costs, travel, time)

### How to Avoid

- [ ] Complete the fundraising decision tree (`fundraising-decision-tree.md`) before starting
- [ ] Have concrete evidence of problem-solution fit (customer conversations, pilot data, early revenue)
- [ ] Be honest: would you invest in this company at this stage?
- [ ] Talk to 3-5 founders who recently raised at your stage — ask them what traction they had
- [ ] If in doubt, spend 3 more months building before raising

---

## Gotcha 2 — Raising Too Much

**Severity: HIGH**

### The Mistake

Raising significantly more than you need because "the money was available." Over-raising creates inflated expectations, higher burn rates, and a valuation that may be difficult to justify at the next round.

### Real-World Consequence

- Higher dilution than necessary — you gave away ownership for capital you did not deploy efficiently
- Valuation ratchet: a $30M post-money seed means your Series A must be $50M+ pre-money or you have a down round
- Capital abundance leads to capital inefficiency — "we can solve this by hiring" replaces creative problem-solving
- Board and investor expectations scale with the raise amount

### How to Avoid

- [ ] Size your round based on specific milestones, not "what the market will bear"
- [ ] Calculate 18-24 months of runway at your planned burn rate + 25% buffer
- [ ] Resist the temptation to "take more while it's available" unless you have specific deployment plans
- [ ] Model the dilution impact and next-round valuation requirement before accepting a larger round

---

## Gotcha 3 — SAFE Cap Confusion

**Severity: CRITICAL**

### The Mistake

Issuing multiple SAFEs with different valuation caps without understanding how they interact at conversion. Founders are shocked at the cumulative dilution when all SAFEs convert at the next priced round.

### Real-World Consequence

- Founders who expected 20% dilution from their SAFEs discover it is actually 35-45%
- Each SAFE converts at its own price, and the math is not additive — it compounds
- Stacking SAFEs with MFN clauses and pro-rata rights creates a complex web of obligations
- Some founders discover post-conversion that they own less of their company than early employees

### How to Avoid

- [ ] Model every SAFE's conversion impact in {{CAP_TABLE_TOOL}} before issuing it
- [ ] Keep SAFEs at the same cap whenever possible (reduces complexity)
- [ ] Understand the difference between pre-money and post-money SAFEs (YC post-money SAFEs are standard now)
- [ ] Limit the total SAFE capital to an amount where conversion dilution is acceptable
- [ ] See `cap-table-planning.template.md` Section 5 for SAFE conversion scenario modeling

---

## Gotcha 4 — No Lead Investor

**Severity: HIGH**

### The Mistake

Trying to fill a round with many small checks and no lead investor. Without a lead, there is no one to set terms, no one to do deep diligence, and no one to anchor the round for other investors.

### Real-World Consequence

- Other investors wait for a lead — "who else is in?" becomes an infinite loop
- No one does real diligence, which means no one has conviction
- Terms are set by the least sophisticated participant or default to unfavorable standards
- Round takes 2-3x longer to close
- Post-close, there is no single investor accountable for value-add

### How to Avoid

- [ ] Prioritize finding a lead investor before filling the round
- [ ] A lead typically writes 25-50% of the round
- [ ] If you cannot find a lead, ask yourself why — the signal is important
- [ ] Consider whether a rolling SAFE close (no lead required) is more appropriate for your stage
- [ ] For pre-seed, a lead is less critical — many pre-seed rounds close without one

---

## Gotcha 5 — Simultaneous Fundraise and Build

**Severity: HIGH**

### The Mistake

Underestimating the time fundraising takes and expecting to maintain normal product development velocity. Fundraising is a full-time job for at least one founder for 3-6 months.

### Real-World Consequence

- Product velocity drops, which worsens your pitch ("why is your growth slowing?")
- Founders burn out from trying to do both
- Key customers are neglected during the raise
- Team morale suffers as founders become unavailable

### How to Avoid

- [ ] Designate one founder as the primary fundraising lead
- [ ] Set realistic expectations with the team: "fundraising will take X weeks and here is how we handle it"
- [ ] Batch investor meetings (e.g., Tuesdays and Thursdays) to preserve focus days
- [ ] Have the non-fundraising founder maintain product and customer momentum
- [ ] Build 2-3 months of product roadmap buffer before starting the raise

---

## Gotcha 6 — Messy Cap Table

**Severity: CRITICAL**

### The Mistake

Arriving at fundraising with a disorganized cap table — missing documentation, unsigned agreements, unclear ownership, or unresolved co-founder equity disputes.

### Real-World Consequence

- Investors walk away from deals with cap table issues — it signals operational dysfunction
- Legal cleanup costs $10K-$50K and can delay closing by weeks or months
- Missing 83(b) elections cannot be fixed retroactively and create significant tax liability
- Unresolved co-founder disputes become visible during diligence and kill investor confidence

### How to Avoid

- [ ] Use a professional cap table tool ({{CAP_TABLE_TOOL}}) from day one
- [ ] Ensure all equity grants have board resolutions and signed agreements
- [ ] File 83(b) elections within 30 days of any restricted stock grant (NO EXCEPTIONS)
- [ ] Resolve co-founder equity discussions early and document them formally
- [ ] Run the cap table audit checklist in `cap-table-planning.template.md` before fundraising

---

## Gotcha 7 — Liquidation Preferences Misunderstood

**Severity: HIGH**

### The Mistake

Accepting liquidation preferences without understanding the payout math. Participating preferred, multiple liquidation preferences, and preference stacks across rounds can dramatically reduce common shareholder payout in moderate exits.

### Real-World Consequence

- In a $30M exit on a $10M raise with 2x participating preferred, investors get $20M + their pro-rata share of the remaining $10M — founders and employees split very little
- Preference stacks mean earlier investors get paid before later investors, who get paid before common — the waterfall can leave founders with nothing in anything less than a home run exit
- Most startups exit for moderate amounts ($20M-$100M), not billions — preferences matter most in the most likely scenarios

### How to Avoid

- [ ] Always insist on 1x non-participating preferred (industry standard)
- [ ] Model exit scenarios at $10M, $30M, $50M, $100M, and $200M to see payout waterfalls
- [ ] Understand how preference stacks interact across multiple rounds
- [ ] See `term-sheet-analysis.template.md` Section 1 for payout scenario tables
- [ ] Have your lawyer walk you through the liquidation waterfall for your specific terms

---

## Gotcha 8 — Board Control Loss

**Severity: HIGH**

### The Mistake

Giving up board control too early — typically at seed or Series A — without understanding the long-term implications. Once board control is lost, every major company decision requires investor approval.

### Real-World Consequence

- Investors can block a sale that founders want (or force a sale founders do not want)
- CEO can be replaced by the board against founder wishes
- Strategic pivots require board approval, slowing critical decisions
- Board dynamics shift from advisory to adversarial when interests diverge

### How to Avoid

- [ ] Maintain founder-majority board through Series A at minimum
- [ ] Standard seed board: 2 founders + 1 investor (or no formal board)
- [ ] Standard Series A board: 2 founders + 1 investor + 1 independent (or 2+1)
- [ ] Negotiate protective provisions carefully — they are the real control mechanism
- [ ] Choose board members who are collaborative, not controlling
- [ ] See `term-sheet-analysis.template.md` Section 2 for board composition options

---

## Gotcha 9 — Vanity Valuation

**Severity: MEDIUM**

### The Mistake

Optimizing for the highest possible valuation headline rather than the best overall deal. A sky-high valuation feels good but creates a dangerous bar for the next round.

### Real-World Consequence

- If you raise seed at $25M pre-money, your Series A needs to be $40M+ or you face a down round
- Down rounds trigger anti-dilution provisions, further diluting founders
- Down rounds damage team morale and make hiring harder
- Some investors deliberately offer inflated valuations to win deals, knowing the company may not grow into the valuation

### How to Avoid

- [ ] Set valuation based on comparable data, not ego (see `valuation-modeling.template.md`)
- [ ] Ask yourself: "Can we 2-3x this valuation in 18-24 months?"
- [ ] Evaluate the full term sheet — a lower valuation with better terms may be a better deal
- [ ] Talk to founders who experienced down rounds about the consequences

---

## Gotcha 10 — Data Room Disorganization

**Severity: MEDIUM**

### The Mistake

Not having a data room prepared when investors ask for due diligence materials. Scrambling to assemble documents signals poor operational discipline and slows the process.

### Real-World Consequence

- Delays of 2-4 weeks while you assemble documents (investor interest cools)
- Missing documents raise red flags (is the company hiding something?)
- Inconsistent financial data across documents destroys credibility
- Investor associates who cannot find what they need give negative internal recommendations

### How to Avoid

- [ ] Build your data room before starting outreach (see `due-diligence-prep.template.md`)
- [ ] Use a structured folder hierarchy with consistent naming conventions
- [ ] Test the data room with a friendly advisor — can they find what they need in 5 minutes?
- [ ] Keep documents current — update monthly during an active raise
- [ ] Grant tiered access (basic → full) based on pipeline stage

---

## Gotcha 11 — Investor Update Neglect

**Severity: MEDIUM**

### The Mistake

Raising capital, then going silent. Investors hear nothing for months and assume the worst. When you need help — or need to raise again — you have no relationship capital to draw on.

### Real-World Consequence

- Investors who are not updated will not help with intros, hiring, or advice
- Your next fundraise starts cold instead of warm
- If things go wrong, investors find out late and feel blindsided — trust is destroyed
- Other portfolio companies who do send updates get more of the investor's time and attention

### How to Avoid

- [ ] Set up investor update cadence immediately after closing (see `investor-update-cadence.template.md`)
- [ ] Send monthly updates without exception — even bad months
- [ ] Schedule the update on your calendar as a recurring task
- [ ] Keep updates under 5 minutes to read
- [ ] Include specific asks — give investors a way to help

---

## Gotcha 12 — Term Sheet FOMO

**Severity: MEDIUM**

### The Mistake

Accepting the first term sheet out of fear that no others will come, without evaluating terms, checking references, or creating competition. Fear of Missing Out leads to suboptimal deals.

### Real-World Consequence

- You accept bad terms that compound over the life of the company
- You miss the opportunity to negotiate from a position of strength
- You partner with an investor who is not the best fit
- Exclusivity provisions lock you in, preventing comparison

### How to Avoid

- [ ] Never accept a term sheet on the spot — take 5-7 business days to evaluate
- [ ] Always check investor references (3+ portfolio founders) before accepting
- [ ] If you have other investors in deep dive, communicate your timeline
- [ ] Have legal counsel review before responding
- [ ] Use the term sheet evaluation scorecard in `fundraising-process.template.md`
- [ ] Remember: a signed term sheet is just the beginning, not the end

---

## Gotcha 13 — Not Checking Investor References

**Severity: HIGH**

### The Mistake

Accepting an investor without speaking to founders in their portfolio — especially founders whose companies did not succeed. Investor behavior in good times is different from investor behavior in hard times.

### Real-World Consequence

- You discover post-close that the investor is difficult, controlling, or absent
- Board meetings become adversarial instead of productive
- The investor blocks decisions or pushes the company in directions that serve their portfolio strategy, not your company
- Removing a bad investor is nearly impossible

### How to Avoid

- [ ] Speak with at least 3 founders in the investor's portfolio
- [ ] Include at least 1 founder whose company did NOT succeed — how did the investor behave?
- [ ] Ask specific questions: "How did they react when things got hard?" "Did they follow through on promises?" "Would you take their money again?"
- [ ] Ask about board behavior: "Are they prepared? Do they add value? Do they micromanage?"
- [ ] Check the investor's reputation on anonymous forums (though weight these carefully)

---

## Gotcha 14 — Runway Miscalculation

**Severity: CRITICAL**

### The Mistake

Calculating runway based on current burn rate without accounting for planned hiring, infrastructure scaling, marketing spend, or the natural tendency for costs to increase faster than planned.

### Real-World Consequence

- You discover at month 8 that you have 4 months of runway, not the 12 you expected
- Emergency fundraising from a position of weakness — investors smell desperation
- Forced layoffs or drastic cost-cutting that damages morale and product velocity
- Bridge rounds at unfavorable terms

### How to Avoid

- [ ] Calculate runway on projected burn (not current burn) after hiring plan is factored in
- [ ] Add a 25% buffer to your burn estimate — things always cost more than planned
- [ ] Track actual vs. projected burn weekly during the first 6 months post-raise
- [ ] Set a "yellow alert" at 6 months runway and a "red alert" at 4 months
- [ ] Have a "Plan B" for what you cut if revenue does not materialize as projected
- [ ] See `cap-table-planning.template.md` for runway-based raise sizing

---

## Gotcha 15 — Co-Founder Equity Disputes

**Severity: CRITICAL**

### The Mistake

Not formalizing the co-founder equity split early, or splitting equity without discussing vesting, contribution expectations, or what happens if someone leaves. These conversations are uncomfortable but infinitely more painful when deferred.

### Real-World Consequence

- Investors refuse to fund companies with unresolved co-founder disputes
- A departing co-founder who owns 50% of the company with no vesting creates dead equity
- Lawsuits between co-founders are expensive, time-consuming, and company-killing
- Resentment builds when contributions diverge from the equity split

### How to Avoid

- [ ] Have the equity conversation before writing a single line of code
- [ ] Document the split in a formal founder agreement (not a handshake)
- [ ] Always implement vesting — 4 years with 1-year cliff is standard
- [ ] Discuss what happens if a co-founder leaves, reduces commitment, or pivots away from the business
- [ ] Include a buyback clause for unvested shares at a defined price
- [ ] Revisit the arrangement annually — is the split still fair given actual contributions?
- [ ] See `cap-table-planning.template.md` Section 4 for founder vesting structures

---

## Gotcha 16 — Anti-Dilution Surprises

**Severity: HIGH**

### The Mistake

Not understanding how anti-dilution provisions work until a down round occurs and founders discover their ownership has been dramatically reduced by automatic price adjustments that benefit investors at the expense of common shareholders.

### Real-World Consequence

- In a down round with full ratchet anti-dilution, investors' conversion price drops to the new round price — effectively giving them free shares at founder expense
- Even broad-based weighted average anti-dilution (the standard) reduces founder ownership more than expected
- Anti-dilution compounds across multiple rounds — each round's investors may have different provisions
- Founders can end up with single-digit ownership after a down round with aggressive anti-dilution

### How to Avoid

- [ ] Understand anti-dilution mechanics before signing any term sheet (see `cap-table-planning.template.md` Section 6)
- [ ] Always insist on broad-based weighted average — reject full ratchet
- [ ] Model a down round scenario at 50% and 75% of current valuation to see the impact
- [ ] Negotiate carve-outs for small equity issuances (option grants should not trigger anti-dilution)
- [ ] Ask your lawyer to explain the specific anti-dilution formula in your term sheet
- [ ] Remember: the best anti-dilution protection is building a company that never has a down round

---

## Gotcha Quick Reference

| # | Gotcha | Severity | Key Mitigation |
|---|---|---|---|
| 1 | Raising too early | CRITICAL | Validate with decision tree first |
| 2 | Raising too much | HIGH | Size to milestones, not market appetite |
| 3 | SAFE cap confusion | CRITICAL | Model every SAFE conversion before issuing |
| 4 | No lead investor | HIGH | Prioritize lead before filling the round |
| 5 | Simultaneous fundraise and build | HIGH | Designate one founder as fundraising lead |
| 6 | Messy cap table | CRITICAL | Professional cap table tool from day one |
| 7 | Liquidation preferences misunderstood | HIGH | Model payout at multiple exit values |
| 8 | Board control loss | HIGH | Maintain founder majority through Series A |
| 9 | Vanity valuation | MEDIUM | Set valuation from comparable data |
| 10 | Data room disorganization | MEDIUM | Build data room before outreach |
| 11 | Investor update neglect | MEDIUM | Monthly updates without exception |
| 12 | Term sheet FOMO | MEDIUM | Take 5-7 days; check references |
| 13 | Not checking investor refs | HIGH | 3+ portfolio founder calls including failures |
| 14 | Runway miscalculation | CRITICAL | 25% buffer on projected (not current) burn |
| 15 | Co-founder equity disputes | CRITICAL | Formal agreement with vesting before fundraising |
| 16 | Anti-dilution surprises | HIGH | Model down round scenarios; reject full ratchet |

---

## Pre-Fundraising Gotcha Audit

Before beginning fundraising, confirm:

- [ ] All CRITICAL gotchas have been addressed or mitigated
- [ ] All HIGH gotchas have been reviewed and a plan is in place
- [ ] Co-founders have read this document together
- [ ] Legal counsel has been engaged to review corporate housekeeping
- [ ] Cap table is clean and current
- [ ] Runway calculation uses projected burn with 25% buffer
- [ ] All founders agree on valuation range and walk-away terms
