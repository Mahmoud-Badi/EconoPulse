# Market Fit Analyzer

**Purpose:** Analyze how the source application maps to the target vertical's market, buyers, compliance landscape, and competitive environment. Produces a market fit assessment that informs the Vertical Differentiation Plan.

**Output:** `dev_docs/repurpose/market-fit-analysis.md`

**Path:** Repurpose only

**Prerequisites:**
- `dev_docs/intake/repurpose-intake.md` — source app and target vertical context
- `dev_docs/repurpose/feature-inheritance-map.md` — what features carry over vs. change

---

## When to Run

Run this as Step R3 after the Feature Inheritance Map is complete. Market fit analysis is not just competitive research — it surfaces the buyer psychology, workflow, and compliance requirements that the product must address to succeed in the new vertical.

---

## Think-Then-Generate Protocol

Before generating the market fit analysis, answer these questions in the conversation:

1. What are the top 3 reasons a buyer in the new vertical would choose this product over a vertical-native competitor?
2. What are the top 3 reasons they might NOT choose it (the legitimate objections a skeptical buyer would raise)?
3. What is the single biggest assumption the source app makes that is wrong for this new vertical?
4. Is there a dominant incumbent in this vertical? What do they do well that this product must match?
5. What's the minimum viable feature set that would make a buyer in this vertical say "yes" on a 30-day trial?

---

## Analysis Module 1 — Buyer Persona Delta

Compare the source app's buyer persona against the target vertical's buyer:

### Source App Buyer Profile
From the intake, characterize the source buyer:
- **Job title / role:**
- **Company size:**
- **Budget authority:**
- **Primary pain point your app solves:**
- **How they discovered the source app:**
- **What convinced them to buy:**
- **What made them stay:**

### Target Vertical Buyer Profile
Research and characterize the new vertical's buyer:
- **Job title / role:**
- **Company size:**
- **Budget authority:**
- **Primary pain point they face (that the app could solve):**
- **How they currently discover software (referrals, trade publications, conferences, Google, etc.):**
- **What buying criteria matter most to them:**
  - Price sensitivity
  - Compliance certifications required
  - Integration requirements (what systems must this connect to?)
  - Support expectations (self-serve vs. white-glove)
  - Contract term expectations (month-to-month vs. annual)

### Delta Analysis
For each buyer profile dimension, what's different? What stays the same?

| Dimension | Source Buyer | Target Vertical Buyer | Delta |
|-----------|-------------|----------------------|-------|
| Budget authority | {role} | {role} | {same / different} |
| Average contract value | {range} | {estimate} | {same / different} |
| Sales cycle length | {duration} | {estimate} | {same / different} |
| Compliance requirements | {what they need} | {what they need} | {same / more / less} |
| Integration requirements | {what they need} | {what they need} | {same / different} |

---

## Analysis Module 2 — Terminology Map

Build a complete terminology translation between the source app's language and the new vertical's language.

### Systematic Terminology Translation

For every domain-specific term in the source app, determine the correct term in the new vertical:

| Source App Term | New Vertical Term | Translation Type |
|----------------|------------------|----------------|
| {term} | {term} | Direct rename / Conceptual reframe / New concept |

**Translation types:**
- **Direct rename**: Same concept, different word. (Client → Patient)
- **Conceptual reframe**: Similar concept but with meaningful differences in scope or meaning. (Project → Case — similar but a legal "case" has specific legal connotations)
- **New concept**: The new vertical has concepts that don't exist in the source app and need new terms. (e.g., "Billing Code" in healthcare vs. no equivalent in a design agency tool)

### UI Copy Implications
Which screens need the most copy changes based on this terminology map? List top 5 screens with the highest terminology change density.

---

## Analysis Module 3 — Compliance Deep Dive

For each compliance requirement identified in the intake, assess the implementation implications:

### Compliance Matrix

| Requirement | Applies? | Source App Status | Gap | Implementation Effort |
|-------------|---------|-----------------|-----|---------------------|
| HIPAA (US healthcare) | Yes / No | {None / Partial / Compliant} | {specific gap} | {XS-XL} |
| GDPR (EU personal data) | Yes / No | {None / Partial / Compliant} | {specific gap} | {XS-XL} |
| SOC 2 | Yes / No | {None / Partial / Compliant} | {specific gap} | {XS-XL} |
| PCI DSS | Yes / No | {None / Partial / Compliant} | {specific gap} | {XS-XL} |
| {Other vertical-specific} | Yes / No | {status} | {gap} | {XS-XL} |

### Compliance Gap Detail

For each applicable compliance requirement, document:

#### {Compliance Standard}
- **Why it applies:** {specific reason based on what the app will do in this vertical}
- **What it requires technically:**
  - Data encryption at rest: {required / already implemented / gap}
  - Data encryption in transit: {required / already implemented / gap}
  - Audit logging of PHI/PII access: {required / already implemented / gap}
  - Business Associate Agreement (BAA) capability: {required / gap / N/A}
  - Data residency requirements: {required / gap / N/A}
  - Right to erasure implementation: {required / already implemented / gap}
  - Access control & minimum necessary: {required / already implemented / gap}
  - {other requirement}: {status}
- **Estimated compliance implementation effort:** {XS/S/M/L/XL}
- **External resources needed:** {legal counsel / compliance consultant / certification body / N/A}

---

## Analysis Module 4 — Competitive Landscape

Research the competitive landscape in the target vertical:

### Incumbent Analysis

For each of the top 3 competitors in the target vertical, document:

| Competitor | Market Position | Strengths | Weaknesses | Pricing |
|-----------|----------------|-----------|------------|---------|
| {name} | Leader / Challenger / Niche | {2-3 strengths} | {2-3 weaknesses} | {price range} |

### Competitive Differentiation

**Why would a buyer in {target vertical} choose this product over each incumbent?**

For each competitor:
- **{Competitor 1}:** {specific differentiation — not just "better" but specifically what}
- **{Competitor 2}:** {specific differentiation}
- **{Competitor 3}:** {specific differentiation}

**What incumbents do well that this product MUST match:**
- {table-stakes feature or capability 1}
- {table-stakes feature or capability 2}
- {table-stakes feature or capability 3}

These are not differentiators — they're minimum requirements to be considered. Buyers will not evaluate a product that lacks these.

---

## Analysis Module 5 — Pricing & Distribution Delta

### Pricing Model Fit

| Dimension | Source App | Target Vertical Expectation | Adjustment Needed |
|-----------|-----------|----------------------------|-----------------|
| Pricing model | {per-seat / flat / usage-based / etc.} | {what this vertical expects} | {none / change model / add tier} |
| Price point | {source price} | {typical spend in this vertical} | {same / higher / lower} |
| Contract term | {month-to-month / annual / etc.} | {what's typical} | {same / different} |
| Trial model | {free trial / demo / freemium} | {what this vertical expects} | {same / different} |

### Distribution Delta

How do buyers in this vertical find and buy software?

| Channel | Source App Priority | New Vertical Priority | Adjustment |
|---------|--------------------|-----------------------|-----------|
| Direct outbound sales | {High/Med/Low} | {High/Med/Low} | {action} |
| SEO / content | {High/Med/Low} | {High/Med/Low} | {action} |
| Referral / word of mouth | {High/Med/Low} | {High/Med/Low} | {action} |
| Industry conferences | {High/Med/Low} | {High/Med/Low} | {action} |
| Trade publications / directories | {High/Med/Low} | {High/Med/Low} | {action} |
| Partner / reseller channel | {High/Med/Low} | {High/Med/Low} | {action} |

---

## Output Format

Write to `dev_docs/repurpose/market-fit-analysis.md`:

```markdown
# Market Fit Analysis — {Source App} → {Target Vertical}

> **Date:** {date}
> **Pivot depth:** {Shallow / Medium / Deep}

---

## Executive Summary

{3-5 sentences: Is this a strong fit, moderate fit, or weak fit for the target vertical? What's the single biggest advantage? What's the single biggest challenge? What's the minimum viable change needed to compete?}

---

## Buyer Persona Delta
{Full Module 1 output}

---

## Terminology Map
{Full Module 2 output}

---

## Compliance Requirements
{Full Module 3 output}

---

## Competitive Landscape
{Full Module 4 output}

---

## Pricing & Distribution Delta
{Full Module 5 output}

---

## Market Fit Score

| Dimension | Fit | Notes |
|-----------|-----|-------|
| Buyer persona alignment | Strong / Moderate / Weak | {note} |
| Feature fit (from inheritance map) | Strong / Moderate / Weak | {note} |
| Compliance readiness | Strong / Moderate / Weak | {note} |
| Competitive differentiation | Strong / Moderate / Weak | {note} |
| Pricing model fit | Strong / Moderate / Weak | {note} |
| Distribution fit | Strong / Moderate / Weak | {note} |

**Overall:** {Strong Fit / Moderate Fit / Challenging Fit}

---

## Go / No-Go Input

This analysis is input for the strategic decision — not a recommendation. It surfaces:

**Reasons to proceed:**
1. {specific reason}
2. {specific reason}

**Risks to plan for:**
1. {specific risk with mitigation}
2. {specific risk with mitigation}

**Blockers (if any) that must be resolved before proceeding:**
1. {blocker — e.g., compliance certification required before first enterprise customer}

---

## Next Step

Proceed to **Step R4: Vertical Differentiation Plan** — `38-repurpose/VERTICAL-DIFFERENTIATION-PLAN.md`
```

---

## Quality Rules

1. **Use real competitors.** Don't use placeholder names. Research actual products that compete in the target vertical.
2. **Terminology map must be exhaustive.** Every source app term that appears in the UI or data model needs a translation. Missing a term leads to confusing UX in the new vertical.
3. **Compliance gaps must be technically specific.** "HIPAA compliance needed" is not enough. "HIPAA requires encrypted PHI at rest (AES-256), audit logs of all PHI access, and BAA capability before first healthcare customer" is actionable.
4. **Table-stakes features are not optional.** If incumbents in the vertical all have feature X and the product doesn't — that's not a nice-to-have. It's a blocker to adoption.
5. **The executive summary must be honest.** If this is a weak fit, say so clearly. A product that launches into the wrong vertical wastes more time than an honest "not ready yet."
