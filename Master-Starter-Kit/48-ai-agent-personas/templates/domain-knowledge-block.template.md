# Domain Knowledge

<!--
  GENERATOR INSTRUCTIONS:
  This block gives the AI the domain expertise it cannot get from its training data.
  Generic engineering knowledge is already baked in. What's NOT baked in is:
  - Your industry's specific terminology and what it actually means in practice
  - Business rules that contradict "clean code" instincts
  - Edge cases that only someone who has worked in this domain would know
  - The competitive landscape that shapes product decisions

  This block should read like a briefing document you'd hand to a senior engineer
  on their first day — not the stuff in the onboarding wiki, but the stuff the
  tech lead tells them over coffee. "Here's what the docs don't say."

  Source this from: archetype domain knowledge + project brief + intake answers
  about industry, competitors, compliance, and business model.
-->

## Industry & Terminology

<!--
  Fill {{INDUSTRY_TERMS}} with a structured glossary. Not dictionary definitions —
  operational definitions that explain what the term means IN THIS PROJECT'S CONTEXT
  and why getting it wrong matters.

  Format each term as:
  - **Term**: What it means in this context. Why it matters / common misconception.

  Example:
  - **Encounter**: A single patient visit, NOT a session or appointment. One encounter
    can span multiple providers and locations. The encounter ID is the primary key
    for all clinical data — if you break encounter linking, you break the patient's
    medical record.

  Aim for 8-15 terms. If you can't find 8, the domain research was too shallow.
-->

{{INDUSTRY_TERMS}}

## Business Rules That Override Engineering Instincts

<!--
  Fill {{BUSINESS_RULES}} with rules that a good engineer would get wrong if they
  followed generic best practices. These are the "yes, I know it looks wrong, but
  this is how the domain works" rules.

  Format each as:
  **Rule:** [The rule]
  **Why it feels wrong:** [What an engineer would instinctively do instead]
  **Why it's right:** [The domain reason this rule exists]

  Example:
  **Rule:** Never delete a financial transaction record. Mark it as voided and
  create a reversal entry.
  **Why it feels wrong:** You'd normally just delete the bad record and insert
  a correct one. Cleaner data model.
  **Why it's right:** Audit trail requirements. Every financial regulator on
  earth requires a complete, unmodified history of all transactions. Deletion
  is a compliance violation that can result in fines.

  Aim for 4-8 rules.
-->

{{BUSINESS_RULES}}

## Domain-Specific Gotchas

<!--
  Fill {{DOMAIN_GOTCHAS}} with things that look correct but are wrong in this domain.
  These are the bugs that pass code review because the reviewer doesn't know the
  domain well enough to catch them.

  Format each as:
  **Gotcha:** [What looks right]
  **Reality:** [What's actually happening]
  **Impact:** [What breaks when you get this wrong]

  Example:
  **Gotcha:** Sorting patient names alphabetically by last name.
  **Reality:** Many cultures put family name first. Hispanic names have two
  surnames. Mononymous patients exist. "Sorting by last name" is an assumption
  that breaks for ~30% of a global user base.
  **Impact:** Patients can't find themselves in search results. Clinical staff
  pull up wrong patient records. In healthcare, wrong patient = potential harm.

  Aim for 5-10 gotchas. These are the highest-value entries in this entire block.
-->

{{DOMAIN_GOTCHAS}}

## Data Model Assumptions

<!--
  These are the invariants the AI must never violate when touching the data layer.
  Generated from the project's schema, ERD, or architectural decisions from Steps 4-7.

  If Steps 4-7 haven't run yet, leave this section with a TODO marker:
  <!-- TODO: Populate after architecture phase (Steps 4-7) -->

  Format:
  - **[Entity]**: [Invariant]. Breaking this causes [consequence].
-->

<!-- IF architecture phase has completed -->

| Entity / Concept | Invariant | Violation Consequence |
|---|---|---|
| <!-- e.g., User accounts --> | <!-- e.g., Email must be unique and verified before any paid action --> | <!-- e.g., Duplicate charges, account takeover vectors --> |
| | | |
| | | |

<!-- ENDIF -->

<!-- IF architecture phase has NOT completed -->
> **TODO:** This section will be populated after the architecture phase (Steps 4-7). For now, respect any data constraints documented in the project brief.
<!-- ENDIF -->

## Competitive Context

<!--
  Fill {{COMPETITIVE_CONTEXT}} with what makes this product different from
  alternatives, and what that means for engineering decisions.

  This is NOT a marketing section. It's an engineering-relevant briefing:
  - What do competitors do that we explicitly chose NOT to do? (So the AI doesn't
    "helpfully" add those features)
  - What is our key differentiator? (So the AI protects it in every decision)
  - Where are competitors ahead of us? (So the AI understands urgency priorities)

  Example:
  "Competitors (Zendesk, Intercom) are feature-heavy enterprise tools. Our
  differentiator is setup-in-5-minutes simplicity for SMBs. Every feature
  request must be evaluated against this: does adding it make setup harder?
  If yes, it needs extraordinary justification. We win on simplicity, not
  feature count."
-->

{{COMPETITIVE_CONTEXT}}

<!--
  QUALITY CHECK before finalizing this block:
  1. Would a domain expert read the terminology section and learn nothing new?
     That means you stayed too surface-level. Go deeper.
  2. Are the business rules genuinely counterintuitive? If an engineer would
     naturally do it this way anyway, it's not a useful rule — remove it.
  3. Could a developer read the gotchas section and say "I would have made
     that exact mistake"? If the gotchas are obvious, they're not gotchas.
  4. Does the competitive context actually change how the AI would make
     engineering decisions? If not, it's marketing copy — rewrite or remove.
-->
