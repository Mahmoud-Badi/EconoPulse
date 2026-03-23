# Interview Verification Protocol

> **Purpose:** Add rigor to the discovery intake process by catching contradictions, probing vague answers, tracking confidence, and ensuring the product owner actually means what they said.
> **When to use:** During every intake interview (Steps 0-1 of the ORCHESTRATOR). This protocol wraps around `intake-questions.md` — it does not replace it.
> **Time overhead:** Adds ~15-30 minutes to a full intake session. Saves days of rework from misunderstood requirements.

---

## 1. Restate-and-Confirm Pattern

After every stop gate answer, restate the answer in your own words and ask for explicit confirmation. This catches misunderstandings before they compound.

**Pattern:**

```
So to confirm: {{RESTATEMENT_OF_ANSWER}}. Correct?
```

**Rules:**
- Rephrase, don't parrot. If the user said "it's a marketplace," say "So to confirm: this is a two-sided marketplace where {{SELLER_TYPE}} list {{PRODUCT_TYPE}} and {{BUYER_TYPE}} browse and purchase. Correct?"
- Include the implications. If they said "B2B SaaS," restate as "So to confirm: this is a B2B SaaS product, which means we're designing for organizational buyers, likely need multi-user accounts, and revenue comes from subscriptions. Correct?"
- If the user corrects you, restate the correction and confirm again. Do not proceed until you get an explicit "yes."

**Example — Good Restatement:**

| User says | Bad restatement | Good restatement |
|-----------|----------------|------------------|
| "It's like Uber for dog walking" | "So it's like Uber for dog walking. Correct?" | "So to confirm: this is a marketplace where dog owners can request on-demand dog walkers, walkers see nearby requests and accept them, and pricing is per-walk with a platform fee. The core loop is: owner requests → walker accepts → walk happens → payment processes. Correct?" |
| "We need about 5 user types" | "So there are 5 user types. Correct?" | "So to confirm: there are 5 distinct user types, each with meaningfully different daily workflows — not 5 permission levels on the same workflow. We'll define each one with their specific screens and actions. Correct?" |
| "Revenue is subscription" | "So it's subscription. Correct?" | "So to confirm: revenue is recurring subscription billing, which means we need plan tiers, billing cycles, upgrade/downgrade flows, dunning for failed payments, and likely a free trial. Correct?" |

---

## 2. Contradiction Detector

Track all stop gate answers in a running log. After every answer, scan the log for contradictions with previous answers. If found, surface immediately.

**Detection Pattern:**

```
I noticed a potential contradiction:
— In question {{QUESTION_ID_A}} you said: "{{EXACT_QUOTE_A}}"
— In question {{QUESTION_ID_B}} you said: "{{EXACT_QUOTE_B}}"

These seem to conflict because {{EXPLANATION_OF_CONFLICT}}.

Which one is accurate? Or is there a nuance I'm missing?
```

**Common Contradiction Patterns:**

| Earlier answer | Later answer | Likely conflict |
|---------------|-------------|-----------------|
| "This is an MVP — we need to launch fast" | "We need full HIPAA compliance with audit logging" | HIPAA compliance adds 3-6 weeks minimum. Is compliance actually required for MVP, or can it be Phase 2? |
| "Two user types: admin and user" | "The dispatcher needs different screens than the driver, and billing has their own view" | That's at least 4 user types (admin, dispatcher, driver, billing), not 2. |
| "No existing system — greenfield" | "We need to import 3 years of historical data" | If there's historical data, there IS an existing system. What is it? |
| "Small team, just me and one dev" | "We need microservices architecture" | Microservices with 2 developers creates operational overhead that will slow you down. Monolith-first is almost certainly better here. |
| "Budget is tight" | "We want AI-powered recommendations, real-time collaboration, and offline sync" | These are expensive features. Which ones are actually MVP vs. nice-to-have? |

**Logging Format:**

Maintain an internal contradiction log during the interview:

```markdown
## Contradiction Log

| # | Q-A | Q-B | Quote A | Quote B | Conflict | Resolved? | Resolution |
|---|-----|-----|---------|---------|----------|-----------|------------|
| 1 | A1 | B1 | "Simple app, 3 screens" | "Each user type needs 8-10 screens" | Scope mismatch — 3 screens ≠ 8-10 per role | YES | User meant 3 *categories* of screens, not 3 total |
| 2 | A2 | D1 | "B2C marketplace" | "Deploy on client's private servers" | B2C marketplaces are SaaS, not on-prem | NO | Needs follow-up |
```

---

## 3. Vague Answer Probe Protocol

When an answer is vague, generic, or uses analogies without specifics, fire 3 targeted follow-ups before accepting it.

**Vague Answer Indicators:**
- Analogy-only answers: "It's like Uber" / "Think of it as Airbnb for X"
- One-word answers: "Yes" / "No" / "Maybe" to complex questions
- Deferred answers: "We'll figure that out later" / "Whatever you think"
- Jargon without substance: "We need a robust, scalable solution"
- Scope inflation: "It does everything" / "Full-featured"

**Probe Protocol:**

When a vague answer is detected, ask exactly 3 follow-ups:

```
That answer is a good starting point, but I need more specifics to build the right thing.

1. {{SPECIFICITY_QUESTION}} — narrows the analogy to concrete behavior
2. {{DIFFERENCE_QUESTION}} — asks how this differs from the analogy
3. {{EDGE_CASE_QUESTION}} — asks about a scenario the analogy doesn't cover
```

**Example — "It's like Uber for dog walking":**

```
That's a helpful analogy. Three follow-ups to make it concrete:

1. When a dog owner opens the app, do they see available walkers nearby (Uber model)
   or do they post a walk request and walkers apply (TaskRabbit model)?
   This determines the entire matching architecture.

2. What's different from Uber? Uber is real-time, one-time rides. Dog walking might
   involve recurring schedules, trusted walker relationships, or overnight stays.
   Which of those apply?

3. What happens if no walker is available? Does the owner get queued, see an
   estimated wait time, get matched to a walker farther away, or get nothing?
```

**Example — "We need about 5 user types" (with no detail):**

```
Got it — 5 user types. Let me make sure we capture them accurately:

1. Can you name each of the 5 roles? Not job titles — what they actually DO
   in the system daily. Example: "Fleet dispatcher who assigns 40+ trips per shift."

2. Do any of these roles overlap? For instance, could one person be both a
   dispatcher and a billing clerk? If so, that changes how we handle permissions.

3. Are there any external users (customers, vendors, partners) who need
   system access, or are all 5 internal team members?
```

---

## 4. Confidence Level Tracking

Track a confidence level for every stop gate answer. This tells the team which parts of the plan rest on solid ground and which are assumptions.

**Confidence Levels:**

| Level | Criteria | Visual | Action |
|-------|----------|--------|--------|
| **HIGH** | User answered with specifics, numbers, or real-world experience. They've done this before or have data. | 🟢 | Proceed. Lock into plan. |
| **MEDIUM** | User has a clear opinion but it's based on assumption or analogy, not data. Could change. | 🟡 | Proceed, but flag for validation in tribunal. Add to assumption registry. |
| **LOW** | User guessed, deferred, said "I don't know," or gave a vague analogy. The answer may be wrong. | 🔴 | Proceed with documented assumption. Schedule explicit validation. Flag as risk. |

**Assessment Criteria:**

Mark as **HIGH** when:
- User cites specific numbers from their business ("We process 200 invoices/month")
- User references existing workflows they've actually done
- User has competitive research to back their claim
- User answers without hesitation and with specific details

Mark as **MEDIUM** when:
- User says "I think..." or "probably..."
- User answers by analogy ("like Uber but for...")
- User gives round numbers ("about 1000 users")
- User changes their answer once during discussion

Mark as **LOW** when:
- User says "I don't know" or "you decide"
- User gives a single-word answer to a complex question
- User contradicts themselves (caught by contradiction detector)
- User answers with "whatever is standard" or "best practice"
- User defers: "we'll figure that out later"

**Tracking Format:**

Add a confidence column to the restatement log:

```markdown
## Answer Confidence Log

| Question | Answer Summary | Confidence | Rationale |
|----------|---------------|------------|-----------|
| PT1* | Web application | HIGH | User is certain — they have an existing web app being rebuilt |
| A1* | Fleet management for NEMT | HIGH | User operates this business daily for 8 years |
| A2* | B2B SaaS, per-vehicle pricing | MEDIUM | User wants SaaS but hasn't validated pricing with customers |
| A6* | Trips, Vehicles, Drivers, Clients, Invoices | HIGH | User named these immediately from daily operations |
| B1* | 4 user types | MEDIUM | User named 3 confidently, 4th was "maybe a client portal" |
| D1* | AWS deployment | LOW | User said "whatever is best" — no strong opinion |
| E2* | MVP in 3 months | LOW | User guessed — no prior software project experience |
```

---

## 5. Stop Gate Summary Verification

At the end of each stop gate cluster (after completing each Phase of intake), present ALL accumulated answers for bulk review.

**Pattern:**

```
Before we move to Phase {{NEXT_PHASE}}, here's everything you've confirmed so far.
Please review and correct anything that's wrong:

## Phase {{CURRENT_PHASE}} Summary

| # | Question | Your Answer | Confidence |
|---|----------|-------------|------------|
| {{QUESTION_ID}} | {{QUESTION_TEXT}} | {{ANSWER_SUMMARY}} | {{CONFIDENCE}} |
| ... | ... | ... | ... |

**Low-confidence items that need attention:**
{{LIST_OF_LOW_CONFIDENCE_ITEMS_WITH_SPECIFIC_FOLLOW_UP_QUESTIONS}}

**Contradictions detected (if any):**
{{LIST_OF_UNRESOLVED_CONTRADICTIONS}}

Does this accurately represent your project? Any corrections before we proceed?
```

**When to present summaries:**
- After Phase 1 (Core Identity) — ~12 answers
- After Phase 2 (Service Mining) — ~15 answers
- After Phase 3 (Technical Architecture) — ~10 answers
- After Phase 4 (Operational Context) — ~8 answers
- After Phase 5 (Deep Discovery) — varies
- Final comprehensive summary before generating PROJECT-BRIEF

**Final Summary must include:**
- All stop gate answers with confidence levels
- All contradictions (resolved and unresolved)
- All assumptions generated from "you decide" answers
- All vague answers that were probed and the final specific version
- Explicit list of what the user DIDN'T answer (smart defaults being used)

---

## 6. Red Flag Detection

These patterns indicate the user hasn't fully thought through an aspect of their product. When detected, do not silently accept — surface the red flag and probe.

**Red Flag Patterns:**

| Pattern | Example | What to do |
|---------|---------|------------|
| **Single-word answers to complex questions** | Q: "Describe the billing flow" A: "Stripe" | "Stripe is the payment processor, but I need the billing flow: Who creates invoices? Are they auto-generated or manual? What triggers an invoice? Net-30 or due-on-receipt? What happens on failed payment?" |
| **"I don't know" to core questions** | Q: "Who is the primary user?" A: "I don't know" | "This is a stop gate — we can't design screens without knowing who uses them. Let's approach it differently: who will use this system the MOST hours per day? What do they do in their current workflow?" |
| **Feature soup with no priority** | "We need scheduling, GPS tracking, billing, messaging, analytics, AI routing, compliance reporting, a mobile app, and integrations with 12 systems" | "That's a lot of features. If you could only launch with 3 of those and nothing else, which 3 would let your business operate? Everything else is Phase 2+." |
| **Copying a competitor wholesale** | "Just make it like Competitor X" | "Competitor X has had 8 years and a $50M budget. Which specific parts of Competitor X are essential for YOUR users? What does Competitor X get WRONG that you want to fix?" |
| **No differentiation** | Q: "What makes this different?" A: "Better UX" | "'Better UX' is not a differentiator — every product claims that. What specific workflow will your product handle in 2 clicks that competitors take 10 clicks for? What pain point do competitors ignore?" |
| **Unrealistic timeline + scope** | "Full-featured platform in 6 weeks with 1 developer" | "Let's reality-check: the scope you described is 6-12 months of work for a team of 3. We have three options: (1) cut scope to true MVP, (2) extend timeline, (3) add developers. Which do you prefer?" |
| **No revenue model** | Q: "How does this make money?" A: "We'll figure it out" | "Revenue model affects architecture: subscription needs billing cycles, marketplace needs escrow, freemium needs plan gating. We'll assume subscription SaaS for now, but flag this as a HIGH-RISK assumption." |

---

## 7. Graceful Default Protocol

When the user says "you decide," "whatever you think," "best practice," or otherwise defers a decision, do NOT silently pick a default. Document the assumption explicitly.

**Pattern:**

```
You've deferred this decision, so I'll make a recommendation and document it as an assumption:

**Decision:** {{QUESTION_TOPIC}}
**Your input:** "{{EXACT_USER_QUOTE}}" (deferred)
**My recommendation:** {{RECOMMENDED_ANSWER}}
**Rationale:** {{WHY_THIS_IS_THE_BEST_DEFAULT}}
**Risk if wrong:** {{WHAT_HAPPENS_IF_THIS_ASSUMPTION_IS_INCORRECT}}
**When to revisit:** {{SPECIFIC_TRIGGER_OR_DATE_TO_RECONSIDER}}

I'll proceed with this assumption. If you change your mind later, we'll update the plan.
Confidence level: LOW (user-deferred)
```

**Example — User defers deployment decision:**

```
You've deferred this decision, so I'll make a recommendation and document it as an assumption:

**Decision:** Deployment platform
**Your input:** "Whatever is best" (deferred)
**My recommendation:** Vercel for frontend, Railway for backend, Neon for database
**Rationale:** Lowest ops overhead for a small team. Vercel has excellent Next.js support,
  Railway handles Node.js with zero Docker config, Neon provides serverless Postgres.
  Total cost: ~$25-50/month at launch scale.
**Risk if wrong:** If the product needs to run on the client's own servers (on-prem),
  this entire infrastructure choice changes. If the product processes healthcare data,
  these providers may not meet HIPAA BAA requirements.
**When to revisit:** Before Phase 3 (architecture decisions) or immediately if compliance
  requirements surface.

I'll proceed with this assumption. If you change your mind later, we'll update the plan.
Confidence level: LOW (user-deferred)
```

**All deferred decisions must be:**
1. Logged in the Answer Confidence Log with LOW confidence
2. Added to `00-discovery/assumption-registry.md` (see assumption registry template)
3. Flagged in the Phase Summary Verification
4. Reviewed during tribunal (personas may have opinions the product owner didn't)

---

## Integration with Intake Flow

This protocol integrates with `intake-questions.md` as follows:

1. **Before starting:** Initialize the Answer Confidence Log and Contradiction Log
2. **After each stop gate:** Apply Restate-and-Confirm pattern
3. **After each answer:** Scan for contradictions, assess confidence, check for red flags
4. **When answer is vague:** Trigger Probe Protocol (3 follow-ups)
5. **When answer is deferred:** Trigger Graceful Default Protocol
6. **After each Phase:** Present Stop Gate Summary Verification
7. **After all Phases:** Present Final Comprehensive Summary
8. **Before generating PROJECT-BRIEF:** All LOW confidence items and unresolved contradictions must be explicitly listed in the brief

---

## Artifact Outputs

By the end of a verified intake, you will have produced:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Answer Confidence Log | Embedded in `PROJECT-BRIEF.md` appendix | Shows which answers are solid vs. assumptions |
| Contradiction Log | Embedded in `PROJECT-BRIEF.md` appendix | Shows conflicts that were (or weren't) resolved |
| Deferred Decisions List | Feeds into `assumption-registry.md` | Tracks what the user punted on |
| Red Flags Surfaced | Embedded in `PROJECT-BRIEF.md` appendix | Shows where the user needs to think more |
| Probe Resolutions | Inline in answers | Shows how vague answers became specific |
