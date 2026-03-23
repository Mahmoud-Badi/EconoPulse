# Perspective Checks

<!--
  GENERATOR INSTRUCTIONS:
  This block forces the AI to consider multiple stakeholder viewpoints before
  shipping any user-facing change. It's the cheapest form of QA — asking
  "would this person be okay with what I just built?" before they ever see it.

  Generate 2-4 perspective checks from the project's actual personas (from
  CONFIG.PERSONAS in the intake). Each perspective represents a real person
  with real constraints, real frustrations, and real goals that may conflict
  with each other.

  The power of this block comes from TENSION between perspectives. If all
  perspectives want the same thing, you haven't identified the real trade-offs.
  The CEO wants speed. The user wants simplicity. The security auditor wants
  lockdown. The developer wants maintainability. These goals conflict — and
  navigating those conflicts well is what makes good product decisions.

  Source personas from: CONFIG.PERSONAS, TARGET_USERS, STAKEHOLDER entries,
  and the archetype's default perspective structure.
-->

> **Before finalizing ANY user-facing change, answer ALL of the following questions.** If you cannot answer one with confidence, you have not thought the change through. Stop and reconsider.

---

<!--
  Fill each perspective check using these placeholders. Repeat the block
  structure for each persona (2-4 total).

  {{PERSONA_N_NAME}}: A specific name (makes it feel real, not abstract)
  {{PERSONA_N_ROLE}}: Their actual role or relationship to the product
  {{PERSONA_N_CHECK_QUESTION}}: The ONE question they would ask about any change.
    This should be a question that, if answered honestly, would catch real problems.
    Not "is it good?" but "can I figure this out in under 10 seconds while my
    phone is buzzing and my kid is crying?"
  {{PERSONA_N_FAILURE_EXAMPLES}}: 2-3 concrete examples of real failures this
    check would have caught. These should be specific enough that the AI can
    pattern-match against them in the future.
-->

## Check 1: {{PERSONA_1_NAME}} — The {{PERSONA_1_ROLE}}

**Their question:** "{{PERSONA_1_CHECK_QUESTION}}"

<!--
  The question should reflect this persona's core constraint. A time-pressured
  user asks about speed. A non-technical user asks about clarity. A power user
  asks about control. An administrator asks about auditability.
-->

**Context:** <!-- 1-2 sentences about this persona's environment, constraints, and what they care about most. -->

**Failures this check would have caught:**

{{PERSONA_1_FAILURE_EXAMPLES}}

<!--
  Format failures as:
  - **[Brief failure title]:** [What happened, what the user experienced, and why
    this perspective check would have flagged it before shipping]

  Example:
  - **Confirmation dialog on mobile:** A "Delete Account" button was added with a
    simple browser confirm() dialog. On mobile Safari, the dialog is easy to
    accidentally tap "OK" on. A mobile-first perspective check would have flagged
    that destructive actions need a custom confirmation with deliberate input (type
    "DELETE" to confirm), not a native dialog.
-->

---

## Check 2: {{PERSONA_2_NAME}} — The {{PERSONA_2_ROLE}}

**Their question:** "{{PERSONA_2_CHECK_QUESTION}}"

**Context:** <!-- 1-2 sentences about this persona's environment, constraints, and what they care about most. -->

**Failures this check would have caught:**

{{PERSONA_2_FAILURE_EXAMPLES}}

---

## Check 3: {{PERSONA_3_NAME}} — The {{PERSONA_3_ROLE}}

**Their question:** "{{PERSONA_3_CHECK_QUESTION}}"

**Context:** <!-- 1-2 sentences about this persona's environment, constraints, and what they care about most. -->

**Failures this check would have caught:**

{{PERSONA_3_FAILURE_EXAMPLES}}

---

## Check 4: {{PERSONA_4_NAME}} — The {{PERSONA_4_ROLE}}

**Their question:** "{{PERSONA_4_CHECK_QUESTION}}"

**Context:** <!-- 1-2 sentences about this persona's environment, constraints, and what they care about most. -->

**Failures this check would have caught:**

{{PERSONA_4_FAILURE_EXAMPLES}}

<!--
  Delete Check 3 and/or Check 4 if the project only has 2-3 meaningful personas.
  Two perspective checks that create real tension are better than four that
  all agree with each other.
-->

---

## How To Use These Checks

1. **Before every PR or user-facing change:** Mentally (or literally) answer each persona's question.
2. **If any answer is "no" or "I'm not sure":** That's a design problem, not an edge case to ignore. Address it before shipping.
3. **If two personas' needs conflict:** That's the interesting design problem. Document the trade-off you're making and why. The worst outcome is accidentally serving one persona while silently breaking the experience for another.
4. **When adding a new feature:** Ask which persona requested it. If the answer is "none of them," question whether it should exist.

<!--
  QUALITY CHECK before finalizing this block:
  1. Do at least two personas have genuinely conflicting priorities?
     (Speed vs. safety, simplicity vs. power, cost vs. quality)
     If all perspectives align, the checks aren't adding value.
  2. Are the failure examples specific enough that the AI could pattern-match
     against them? "Bad UX" is not specific. "The 3-step wizard was reduced
     to 1 step, which removed the confirmation screen, and users accidentally
     submitted incomplete applications" is specific.
  3. Would a product manager read these checks and say "yes, those are the
     real tensions in this product"? If not, the personas are too surface-level.
-->
