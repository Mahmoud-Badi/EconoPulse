# Stakeholder Alignment Interview: {{PROJECT_NAME}}

> **Purpose:** Before the tribunal begins, interview every key stakeholder individually with the same 7 questions. Compare answers. Surface divergences BEFORE they become design conflicts. It is vastly cheaper to discover that the CEO and the CTO disagree about the project's #1 goal during a 30-minute interview than during Sprint 4 when half the features are built.
> **When to use:** After intake questions, before tribunal. Every stakeholder who has decision-making authority or veto power gets this interview.
> **Time per interview:** 20-30 minutes
> **Facilitator:** {{FACILITATOR_NAME}}

---

## Who Gets Interviewed

A "key stakeholder" is anyone who can:
- Approve or reject the final product
- Allocate or withdraw budget
- Block a release
- Override a design decision
- Represent a critical user group

**Typical stakeholders:**
- Product owner / founder
- Technical lead / CTO
- Head of operations (if the product replaces an operational workflow)
- Head of sales (if the product is sold to external customers)
- Key customer representative (if available)
- Compliance/legal (if regulatory requirements exist)

**Minimum:** 2 stakeholders. If only 1 person is available, use these questions as a self-assessment and flag single-stakeholder risk.

---

## The 7 Questions

Ask these questions exactly as written. Do not skip any. Do not rephrase in ways that lead the answer.

---

### Q1: What is the single most important goal for this project?

**Why this matters:** If stakeholders disagree on the #1 goal, every feature prioritization decision will be contentious. A project can't optimize for "maximum revenue" and "best possible user experience" simultaneously — tradeoffs are inevitable, and this question reveals which tradeoff wins.

**What to listen for:**
- Vague answers ("make it great") — probe for specifics
- Multiple goals stated as #1 — force a rank: "If you could only achieve one of those, which one?"
- Goals that contradict other stakeholders' goals — this is a divergence

---

### Q2: If you could only have 3 features at launch, what would they be?

**Why this matters:** Forces prioritization. Reveals what each stakeholder thinks the MVP actually is. If the CTO's top 3 and the CEO's top 3 don't overlap, you have a fundamental alignment problem.

**What to listen for:**
- Features that appear on everyone's list — these are true MVP
- Features that only one stakeholder mentions — these are that stakeholder's pet feature (might be important, might not be)
- Infrastructure items disguised as features ("authentication," "admin panel") — these are prerequisites, not features

---

### Q3: What are you most worried could go wrong?

**Why this matters:** Reveals hidden risks and fears that won't surface in feature discussions. The CTO might be worried about scaling. The CEO might be worried about missing a market window. Operations might be worried about user adoption.

**What to listen for:**
- Technical fears vs. business fears vs. people fears — different stakeholders fear different things
- Fears that are actionable ("our data migration might fail") vs. vague ("what if nobody likes it")
- Fears that contradict other stakeholders' confidence ("the CTO is worried about the timeline that the CEO just called 'comfortable'")

---

### Q4: What does personal success look like for you with this project?

**Why this matters:** People optimize for what they're measured on. If the sales lead's bonus depends on landing 10 clients by Q3, they'll push for features that close deals — even if those features hurt the long-term product. Understanding personal stakes reveals hidden motivations.

**What to listen for:**
- Alignment between personal success and project success — ideally they're the same
- Competing success metrics between stakeholders
- Success criteria that the product can't actually deliver ("I want this to make us the market leader" — that's a business outcome, not a product feature)

---

### Q5: What is absolutely non-negotiable?

**Why this matters:** Identifies constraints that override everything else. Non-negotiables are the walls of the playing field — everything else is flexible within those walls.

**What to listen for:**
- Real non-negotiables ("HIPAA compliance — we lose our Medicaid contracts without it") vs. preferences labeled as non-negotiables ("the dashboard must be blue")
- Non-negotiables that conflict with each other across stakeholders
- Non-negotiables that conflict with timeline or budget

---

### Q6: What would make you say "this project failed"?

**Why this matters:** The inverse of Q1. Reveals the floor — the minimum acceptable outcome. Sometimes more useful than asking about success, because people are more specific about failure than success.

**What to listen for:**
- Concrete failure criteria ("if dispatchers go back to spreadsheets within 30 days") — these become acceptance test scenarios
- Vague failure criteria ("if it's not good enough") — probe: "Good enough for whom? By what measure?"
- Failure criteria that are outside the project's control ("if the economy tanks") — acknowledge but deprioritize

---

### Q7: Is there anything the team doesn't know that they should?

**Why this matters:** This is the "open the floor" question. It catches political dynamics, historical context, secret constraints, and interpersonal issues that structured questions miss.

**What to listen for:**
- Political landmines ("the VP of Engineering hates this project")
- Historical context ("we tried this 2 years ago and it failed because...")
- Hidden constraints ("our contract with Vendor X prohibits us from building a competing feature")
- Interpersonal dynamics ("the designer and the lead developer don't get along")
- Regulatory surprises ("we just found out we need SOC 2 certification by Q4")

---

## Interview Recording Template

Fill this out during or immediately after each interview.

```markdown
## Stakeholder Interview: {{STAKEHOLDER_NAME}}

**Role:** {{ROLE_AND_TITLE}}
**Date:** {{DATE}}
**Interviewer:** {{FACILITATOR_NAME}}
**Duration:** {{MINUTES}} minutes

### Q1: Single most important goal
{{ANSWER — DIRECT QUOTES WHERE POSSIBLE}}

### Q2: Top 3 launch features
1. {{FEATURE_1}}
2. {{FEATURE_2}}
3. {{FEATURE_3}}

### Q3: Biggest worry
{{ANSWER}}

### Q4: Personal success definition
{{ANSWER}}

### Q5: Non-negotiables
{{ANSWER}}

### Q6: What would equal failure
{{ANSWER}}

### Q7: What the team doesn't know
{{ANSWER}}

### Interviewer Notes
{{BODY_LANGUAGE, HESITATIONS, TOPICS_THEY_GOT_PASSIONATE_ABOUT, THINGS_THEY_AVOIDED}}
```

---

## Alignment Matrix

After all interviews are complete, build this matrix to compare answers across stakeholders. Highlight divergences in bold.

```markdown
## Alignment Matrix: {{PROJECT_NAME}}

**Date:** {{DATE}}
**Stakeholders Interviewed:** {{COUNT}}

### Q1: Single Most Important Goal

| Stakeholder | Goal | Aligned? |
|-------------|------|----------|
| {{STAKEHOLDER_1}} | {{GOAL}} | — |
| {{STAKEHOLDER_2}} | {{GOAL}} | {{YES | DIVERGENT — SEE NOTES}} |
| {{STAKEHOLDER_3}} | {{GOAL}} | {{YES | DIVERGENT — SEE NOTES}} |

**Divergence notes:** {{DESCRIPTION_OF_DISAGREEMENT_IF_ANY}}

### Q2: Top 3 Features

| Feature | {{STAKEHOLDER_1}} | {{STAKEHOLDER_2}} | {{STAKEHOLDER_3}} | Consensus |
|---------|---|---|---|---|
| {{FEATURE_A}} | #1 | #2 | — | PARTIAL (2/3) |
| {{FEATURE_B}} | #2 | #1 | #1 | STRONG (3/3) |
| {{FEATURE_C}} | #3 | — | #2 | PARTIAL (2/3) |
| {{FEATURE_D}} | — | #3 | — | WEAK (1/3) |
| {{FEATURE_E}} | — | — | #3 | WEAK (1/3) |

**Universal MVP features (on all lists):** {{LIST}}
**Contested features (on some lists):** {{LIST}}
**Pet features (on one list only):** {{LIST}}

### Q3: Biggest Worry

| Stakeholder | Worry | Category |
|-------------|-------|----------|
| {{STAKEHOLDER_1}} | {{WORRY}} | {{TECHNICAL | BUSINESS | PEOPLE | TIMELINE}} |
| {{STAKEHOLDER_2}} | {{WORRY}} | {{TECHNICAL | BUSINESS | PEOPLE | TIMELINE}} |
| {{STAKEHOLDER_3}} | {{WORRY}} | {{TECHNICAL | BUSINESS | PEOPLE | TIMELINE}} |

**Shared worries:** {{WORRIES_MENTIONED_BY_MULTIPLE_STAKEHOLDERS}}
**Unique worries:** {{WORRIES_MENTIONED_BY_ONLY_ONE — MAY_INDICATE_HIDDEN_RISK}}

### Q5: Non-Negotiables

| Stakeholder | Non-Negotiable | Conflicts With |
|-------------|---------------|----------------|
| {{STAKEHOLDER_1}} | {{NON_NEGOTIABLE}} | {{NONE | CONFLICTS_WITH_STAKEHOLDER_X_NON_NEGOTIABLE}} |
| {{STAKEHOLDER_2}} | {{NON_NEGOTIABLE}} | {{NONE | CONFLICTS_WITH_STAKEHOLDER_X_NON_NEGOTIABLE}} |

**Non-negotiable conflicts:** {{DESCRIPTION_OF_ANY_CONFLICTS — THESE_MUST_BE_RESOLVED_BEFORE_TRIBUNAL}}

### Q6: Failure Definition

| Stakeholder | Failure Looks Like | Measurable? |
|-------------|-------------------|-------------|
| {{STAKEHOLDER_1}} | {{FAILURE_DEFINITION}} | {{YES — METRIC | NO — NEEDS_SPECIFICS}} |
| {{STAKEHOLDER_2}} | {{FAILURE_DEFINITION}} | {{YES — METRIC | NO — NEEDS_SPECIFICS}} |

### Overall Alignment Score

| Area | Score | Notes |
|------|-------|-------|
| Goal alignment | {{STRONG | PARTIAL | WEAK}} | {{NOTES}} |
| Feature priority | {{STRONG | PARTIAL | WEAK}} | {{NOTES}} |
| Risk awareness | {{STRONG | PARTIAL | WEAK}} | {{NOTES}} |
| Non-negotiable compatibility | {{COMPATIBLE | CONFLICTING}} | {{NOTES}} |
| Success/failure definition | {{STRONG | PARTIAL | WEAK}} | {{NOTES}} |
```

---

## Divergence Resolution Protocol

If the alignment matrix reveals divergences, resolve them BEFORE the tribunal begins. Unresolved stakeholder misalignment poisons every downstream decision.

### Step 1: Classify the Divergence

| Type | Example | Severity |
|------|---------|----------|
| **Goal divergence** | CEO wants revenue growth; CTO wants technical excellence | CRITICAL — must resolve before any work begins |
| **Priority divergence** | Sales wants Feature A first; Operations wants Feature B first | HIGH — resolve before phase planning |
| **Risk perception gap** | CTO is worried about scaling; CEO says "we'll cross that bridge" | MEDIUM — document both views, plan for CTO's concern |
| **Non-negotiable conflict** | One stakeholder's non-negotiable contradicts another's | CRITICAL — cannot proceed until resolved |
| **Definition divergence** | Stakeholders mean different things by the same word | HIGH — clarify terminology immediately |

### Step 2: Facilitated Resolution Meeting

Bring divergent stakeholders together (15-30 minutes). Present both positions neutrally.

**Format:**

```
I noticed a divergence between your answers:

{{STAKEHOLDER_A}}, you said: "{{EXACT_QUOTE}}"
{{STAKEHOLDER_B}}, you said: "{{EXACT_QUOTE}}"

These point in different directions because {{EXPLANATION}}.

For the project to succeed, we need alignment on this. Three options:
1. {{OPTION_A — FAVOR_STAKEHOLDER_A}}
2. {{OPTION_B — FAVOR_STAKEHOLDER_B}}
3. {{OPTION_C — COMPROMISE}}

Which direction should we go?
```

### Step 3: Document the Resolution

Add the resolution to the alignment summary. Reference it during tribunal if a persona's position aligns with the overruled stakeholder — it may need re-examination.

---

## Consistency Check During Tribunal

During tribunal proceedings, if a stakeholder (who is also playing a persona or providing input) contradicts their alignment interview answers, flag it immediately.

**Pattern:**

```
Consistency check: In your pre-tribunal alignment interview on {{DATE}},
you said your #1 goal was "{{ORIGINAL_QUOTE}}."

Just now, you said "{{CONTRADICTING_QUOTE}}."

Has your thinking changed, or am I misunderstanding? If it changed,
we should update the alignment record.
```

This is not confrontational — people's thinking evolves, and that's fine. But the evolution must be documented so the plan stays coherent.

---

## Alignment Summary Template

Create this document after all interviews and divergence resolution. It becomes an input to the tribunal.

```markdown
# Stakeholder Alignment Summary: {{PROJECT_NAME}}

**Date:** {{DATE}}
**Stakeholders Interviewed:** {{LIST_OF_NAMES_AND_ROLES}}
**Facilitated By:** {{NAME}}

## Consensus Points (All Stakeholders Agree)
- {{CONSENSUS_ITEM_1}}
- {{CONSENSUS_ITEM_2}}
- {{CONSENSUS_ITEM_3}}

## Resolved Divergences
| Divergence | Resolution | Decided By |
|-----------|-----------|------------|
| {{DIVERGENCE_1}} | {{RESOLUTION}} | {{WHO_DECIDED}} |

## Unresolved Items (Flagged for Tribunal)
| Item | Stakeholder A Position | Stakeholder B Position | Impact |
|------|----------------------|----------------------|--------|
| {{ITEM}} | {{POSITION}} | {{POSITION}} | {{IMPACT}} |

## Non-Negotiables (Combined, De-Conflicted)
1. {{NON_NEGOTIABLE_1}} (from {{STAKEHOLDER}})
2. {{NON_NEGOTIABLE_2}} (from {{STAKEHOLDER}})

## Shared Definition of Success
{{SYNTHESIZED_FROM_ALL_Q4_AND_Q6_ANSWERS}}

## Shared Definition of Failure
{{SYNTHESIZED_FROM_ALL_Q6_ANSWERS}}

## Hidden Risks Surfaced (from Q7)
1. {{RISK_1}} — surfaced by {{STAKEHOLDER}}
2. {{RISK_2}} — surfaced by {{STAKEHOLDER}}

## Implications for Tribunal
- Must-win persona should be: {{RECOMMENDATION_BASED_ON_ALIGNMENT}}
- Features that ALL stakeholders want: {{LIST}}
- Features that need tribunal debate: {{LIST}}
- Constraints the tribunal must respect: {{LIST}}
```
