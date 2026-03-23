# Gap Matrix: Table Stakes vs. Differentiators

> **Date:** [YYYY-MM-DD]
> **Features Analyzed:** [N]
> **Competitors Referenced:** [N]
> **Feature Areas Covered:** [N clusters]

---

## Purpose

The Gap Matrix answers three critical questions:

1. **What's table stakes?** Features every competitor has that we must match to be taken seriously.
2. **What's our differentiation?** Features we can do better than anyone — or features no one does at all.
3. **Where's the innovation opportunity?** Gaps where NO competitor has a feature that users actually want (per Tribunal votes).

This matrix is the strategic backbone of the feature list. It prevents two failure modes:
- Building features nobody needs (over-engineering)
- Missing features everyone expects (under-delivering)

---

## Table Stakes Features

Features that **every or nearly every competitor** implements. These are not differentiators — they're the cost of entry. Users expect these to exist and will disqualify your product if they're missing.

| Feature | Comp A | Comp B | Comp C | Comp D | Comp E | Table Stakes? | Our Approach | Effort |
|---------|--------|--------|--------|--------|--------|--------------|-------------|--------|
| [Feature 1] | Y | Y | Y | Y | Y | **Yes** (5/5) | [How we'll implement it — can be MVP] | [S/M/L] |
| [Feature 2] | Y | Y | Y | P | Y | **Yes** (4.5/5) | [Approach] | [Effort] |
| [Feature 3] | Y | Y | Y | Y | P | **Yes** (4.5/5) | [Approach] | [Effort] |
| [Feature 4] | Y | P | Y | Y | Y | **Yes** (4.5/5) | [Approach] | [Effort] |
| [Feature 5] | Y | Y | Y | Y | Y | **Yes** (5/5) | [Approach] | [Effort] |

**Total table stakes effort:** [Sum of effort estimates — this is your minimum viable product scope]

**Key insight:** Table stakes features should be implemented to **adequate** quality (3/5). Don't over-invest in features where competitors already meet user expectations. Invest differentiation effort elsewhere.

---

## Differentiation Opportunities

Features where **fewer than 50% of competitors** have a good implementation. These are opportunities to win on quality.

| Feature | Comp A | Comp B | Comp C | Comp D | Comp E | Best Current | Our Advantage | Persona Votes | Effort |
|---------|--------|--------|--------|--------|--------|-------------|--------------|---------------|--------|
| [Feature 1] | P | N | P | N | N | [Comp A — partial, clunky] | [Our approach is better because...] | [N votes] | [Effort] |
| [Feature 2] | N | Y | N | N | N | [Comp B — decent but limited] | [Our advantage] | [N votes] | [Effort] |
| [Feature 3] | P | P | N | P | N | [All partial — nobody does this well] | [Our advantage] | [N votes] | [Effort] |
| [Feature 4] | N | N | P | N | N | [Comp C — basic] | [Our advantage] | [N votes] | [Effort] |

**Differentiation strategy:** Focus effort on the 2-3 features where:
1. User votes are high (personas actually want this)
2. Competitor implementations are weak (room to be clearly better)
3. Our technical approach is sound (we can actually deliver quality)

---

## Innovation Gaps

Features that **NO competitor** implements but that **personas voted for**. These are the highest-value opportunities — features where we can own the narrative and become the reference product.

| Feature | Any Competitor? | Persona Votes | Why Nobody Does This | Our Approach | Innovation Value | Effort |
|---------|----------------|---------------|---------------------|-------------|-----------------|--------|
| [Feature 1] | **None** | [N votes] | [Why: too hard? too niche? nobody thought of it?] | [How we'd build it] | [High/Medium/Low — based on votes + market impact] | [Effort] |
| [Feature 2] | **None** | [N votes] | [Reason] | [Approach] | [Value] | [Effort] |
| [Feature 3] | **None** | [N votes] | [Reason] | [Approach] | [Value] | [Effort] |

**Innovation filter:** Only pursue innovation gaps where:
- Persona votes > 0 (at least one user type actually wants this)
- Effort is proportionate to value (an XL effort for a Low-value innovation is a bad trade)
- The reason nobody does it isn't "it's technically impossible" but "nobody prioritized it"

---

## Feature-by-Feature Decision Matrix

Complete grid combining all analyses. This is the master reference for Round 4 (Prioritization).

| # | Feature | Area | Comp Coverage | Persona Votes | Category | Our Priority | Effort | Phase |
|---|---------|------|--------------|---------------|----------|-------------|--------|-------|
| 1 | [Feature] | [Cluster] | [5/5] | [8] | Table Stakes | Must-Have | [M] | [1] |
| 2 | [Feature] | [Cluster] | [3/5] | [6] | Differentiator | Must-Have | [L] | [2] |
| 3 | [Feature] | [Cluster] | [0/5] | [5] | Innovation | Should-Have | [XL] | [3] |
| 4 | [Feature] | [Cluster] | [5/5] | [4] | Table Stakes | Must-Have | [S] | [1] |
| 5 | [Feature] | [Cluster] | [2/5] | [3] | Differentiator | Should-Have | [M] | [2] |
| 6 | [Feature] | [Cluster] | [4/5] | [2] | Table Stakes | Should-Have | [S] | [2] |
| 7 | [Feature] | [Cluster] | [1/5] | [2] | Differentiator | Could-Have | [L] | [4+] |
| 8 | [Feature] | [Cluster] | [0/5] | [1] | Innovation | Could-Have | [XL] | [4+] |
| 9 | [Feature] | [Cluster] | [3/5] | [0] | Common | Won't-Have V1 | [M] | [V2] |
| 10 | [Feature] | [Cluster] | [0/5] | [0] | Niche | Won't-Have | [L] | [V2+] |

**Category definitions:**
- **Table Stakes:** 80%+ competitors have it
- **Common:** 50-79% competitors have it
- **Differentiator:** < 50% competitors have it well, and personas want it
- **Innovation:** No competitor has it, and personas want it
- **Niche:** Few competitors have it, and personas don't vote for it

---

## Strategic Summary

### Our V1 Positioning

[2-3 sentences describing where our product fits in the market based on this analysis. Example: "We match table stakes on core dispatch and fleet management, differentiate on address validation and mobile driver experience, and innovate on real-time timeline visualization. Our V1 targets mid-size NEMT providers who are frustrated with Competitor A's billing workflow and Competitor B's mobile experience."]

### Build Order Logic

[Explain the phasing logic derived from this matrix.]

1. **Phase 1:** [Table stakes features that unblock everything else — auth, core data model, basic CRUD]
2. **Phase 2:** [Core workflow table stakes — the primary user flow end-to-end]
3. **Phase 3:** [Differentiation features — what makes us better]
4. **Phase 4:** [Secondary workflows and remaining Should-Have features]
5. **Phase 5+:** [Could-Have features and innovation experiments]

### Risk Register (from gap analysis)

| Risk | Source | Probability | Impact | Mitigation |
|------|--------|------------|--------|-----------|
| [e.g., "We launch without Feature X that 4/5 competitors have"] | Table stakes gap | [High/Med/Low] | [High/Med/Low] | [Build in Phase 1 or accept the risk with justification] |
| [e.g., "Innovation Feature Y turns out to be technically infeasible"] | Innovation gap | [Probability] | [Impact] | [Prototype in Phase 2 before committing to full build] |
| [Risk] | [Source] | [Probability] | [Impact] | [Mitigation] |

---

*This matrix feeds into proceedings/round-4-prioritization.template.md and 04-phase-planning/*
