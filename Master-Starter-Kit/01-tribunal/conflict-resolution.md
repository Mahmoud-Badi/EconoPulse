# Tribunal Conflict Resolution Protocol

> **Purpose:** Structured protocol for resolving disagreements between tribunal personas. When the Fleet Operations Manager wants one thing and the End User wants the opposite, this document decides who wins, how compromises work, and how to track every conflict for future reference.
> **When to use:** During tribunal proceedings (Step 2 of the ORCHESTRATOR) whenever two or more personas disagree on a feature, priority, UX approach, or technical decision.
> **Output:** All conflicts logged in `dev_docs/decisions/conflict-log.md`

---

## 1. Priority Resolution Order

When personas disagree, resolve in this order. Stop at the first rule that applies:

### Priority 1: Deal-Breakers Always Win

If any persona identifies something as a **deal-breaker** (they will NOT use the product without it), that position wins regardless of what other personas want.

- A deal-breaker is defined as: "If this is not in the product, I will use a competitor or continue with my current manual process."
- If TWO personas have opposing deal-breakers, escalate to arbitration (Section 4).
- Deal-breakers must be validated — ask: "Is this truly a walk-away issue, or a strong preference?"

### Priority 2: Must-Win Persona Breaks Ties

Every project has a **must-win persona** — the single user type whose adoption determines whether the product succeeds or fails. When non-deal-breaker conflicts arise, this persona's position wins.

- The must-win persona is identified during discovery (question A3* — "Who is the core user?")
- Document the must-win persona at the top of the conflict log
- Example: In a fleet management app, the Dispatcher is the must-win persona because if dispatchers reject the tool, drivers never get assigned trips and the entire system is useless

### Priority 3: Compromise If Possible

If no deal-breaker and no must-win tiebreak, look for a compromise that partially satisfies both positions. Use the resolution patterns in Section 5.

### Priority 4: Defer to Later Phase

If compromise is impossible and the decision doesn't block current phase work, defer the conflict to a later phase. Assign it a specific phase and add a review trigger.

- ONLY defer if the feature in question is not in the current phase
- Set an explicit review date or phase gate
- Document what happens if neither position is chosen (the "do nothing" cost)

---

## 2. Conflict Categories

Every conflict falls into one of these categories. The category determines which resolution patterns apply.

| Category | Description | Example | Typical Resolution |
|----------|-------------|---------|-------------------|
| **Feature Scope** | Whether a feature should exist at all, or how broad it should be | Persona A wants full reporting dashboard; Persona B says it's bloat | Phase-gate it: basic version now, full version later |
| **UX Priority** | How a shared feature should work from different personas' perspectives | Admin wants data density; End User wants simplicity | Split by persona segment: different views per role |
| **Technical Approach** | Architecture or implementation disagreement with UX implications | Real-time sync vs. batch processing; Online-first vs. offline-first | A/B test if possible; otherwise favor the must-win persona's workflow |
| **Timeline** | When a feature should ship — now vs. later | Sales wants Feature X for a demo next month; Engineering says 3 months | MVP compromise: stripped version now, full version later |
| **Resource Allocation** | Where limited dev time should be spent | Persona A's top feature vs. Persona B's top feature when both can't be built | Must-win persona's feature first; other persona's feature next sprint |

---

## 3. Resolution Ticket Template

Every conflict gets a resolution ticket. No exceptions — even "obvious" resolutions get documented because they become architecture decision records.

```markdown
### CONFLICT-{{NNN}}: {{SHORT_TITLE}}

**Date:** {{DATE}}
**Phase:** {{TRIBUNAL_ROUND_OR_PHASE}}
**Category:** {{FEATURE_SCOPE | UX_PRIORITY | TECHNICAL_APPROACH | TIMELINE | RESOURCE_ALLOCATION}}

**Personas Involved:**
- {{PERSONA_A_NAME}} ({{PERSONA_A_ROLE}})
- {{PERSONA_B_NAME}} ({{PERSONA_B_ROLE}})

**Position A — {{PERSONA_A_NAME}}:**
{{WHAT_PERSONA_A_WANTS_AND_WHY}}

**Position B — {{PERSONA_B_NAME}}:**
{{WHAT_PERSONA_B_WANTS_AND_WHY}}

**Is either position a deal-breaker?** {{YES_FOR_PERSONA_X | NO}}

**Resolution:** {{CHOSEN_RESOLUTION}}

**Decided-By:** {{DEAL_BREAKER_RULE | MUST_WIN_PERSONA | COMPROMISE | DEFERRED_TO_PHASE_N | ARBITRATION}}

**Rationale:**
{{WHY_THIS_RESOLUTION_WAS_CHOSEN — SPECIFIC_REASONING}}

**Consequence:**
- For {{PERSONA_A_NAME}}: {{IMPACT_ON_PERSONA_A}}
- For {{PERSONA_B_NAME}}: {{IMPACT_ON_PERSONA_B}}
- For product: {{IMPACT_ON_PRODUCT_SCOPE_TIMELINE_OR_ARCHITECTURE}}

**Phase Assignment:** {{WHICH_PHASE_THIS_GETS_BUILT_IN}}

**Review Trigger:** {{WHEN_TO_REVISIT_THIS_DECISION — SPECIFIC_DATE_OR_CONDITION}}
```

---

## 4. Arbitration Escalation

When a conflict is unresolvable through the priority order (e.g., two deal-breakers oppose each other, or the must-win persona's position creates unacceptable risk), escalate to arbitration.

**Escalation Criteria:**
- Two or more deal-breakers directly conflict
- Must-win persona's position violates a compliance or legal requirement
- Resolution requires budget or timeline changes beyond current scope
- Team cannot reach consensus after 15 minutes of discussion

**Escalation Format:**

```markdown
## ARBITRATION REQUEST: CONFLICT-{{NNN}}

**Escalated by:** {{TRIBUNAL_FACILITATOR_OR_PERSONA}}
**Escalation reason:** {{WHY_NORMAL_RESOLUTION_FAILED}}

**Option A:** {{POSITION_A_DESCRIPTION}}
- Pros: {{PROS}}
- Cons: {{CONS}}
- Cost: {{ESTIMATED_EFFORT_AND_TIMELINE}}
- Risk: {{WHAT_COULD_GO_WRONG}}

**Option B:** {{POSITION_B_DESCRIPTION}}
- Pros: {{PROS}}
- Cons: {{CONS}}
- Cost: {{ESTIMATED_EFFORT_AND_TIMELINE}}
- Risk: {{WHAT_COULD_GO_WRONG}}

**Option C (Compromise):** {{HYBRID_APPROACH_IF_EXISTS}}
- Pros: {{PROS}}
- Cons: {{CONS}}
- Cost: {{ESTIMATED_EFFORT_AND_TIMELINE}}
- Risk: {{WHAT_COULD_GO_WRONG}}

**Recommendation:** {{FACILITATOR_RECOMMENDATION_WITH_REASONING}}

**Decision needed by:** {{DATE — BLOCKING_WHAT_DOWNSTREAM_WORK}}
```

**Who arbitrates:**
1. Product lead / product owner (first escalation point)
2. If product lead is a tribunal persona (conflict of interest), escalate to project sponsor
3. If no human is available, the facilitator decides and documents it as a "facilitator override" with explicit rationale and a mandatory review date within 2 weeks

---

## 5. Resolution Patterns

Reusable patterns for common conflict types. Reference these by name in resolution tickets.

### Pattern: Split by Persona Segment

**When:** Two personas want different UX for the same feature.
**How:** Build role-specific views. Each persona sees a version optimized for their workflow.
**Example:** Admin Dashboard shows data tables with filters and bulk actions. Driver App shows a simple card list with swipe actions. Same underlying data, different presentation.
**Cost:** ~1.5x the effort of a single view (shared data layer, different UI).

### Pattern: Phase-Gate the Conflict

**When:** Both positions are valid but one is simpler.
**How:** Build the simpler version in the current phase. Schedule the complex version for a later phase.
**Example:** Persona A wants AI-powered route optimization. Persona B just wants manual drag-and-drop scheduling. Build drag-and-drop in Phase 1, AI optimization in Phase 3.
**Cost:** No additional cost — just sequencing. Risk: Phase 3 never happens.

### Pattern: A/B Test

**When:** Both positions are plausible and you have access to real users.
**How:** Build both, ship to different user segments, measure which performs better.
**Example:** Persona A says users want a wizard flow for onboarding. Persona B says users want to jump straight to the dashboard. Build both, split traffic, measure activation rate at day 7.
**Cost:** ~2x the effort for the specific feature. Only worth it for high-impact UX decisions.

### Pattern: MVP Compromise

**When:** One persona wants a full-featured version, another wants nothing.
**How:** Build a minimal version that satisfies the "something" camp without the cost of the "everything" camp.
**Example:** Persona A wants a full analytics dashboard with 15 charts. Persona B says analytics is waste. Compromise: 3 key metrics on the main dashboard, no dedicated analytics page. Revisit based on user demand.
**Cost:** ~0.3x the effort of the full version. Satisfies neither persona perfectly but unblocks progress.

### Pattern: Configuration Toggle

**When:** Personas disagree on a behavior that could go either way.
**How:** Make it a user or admin setting. Let each user/org choose their preference.
**Example:** Persona A wants email notifications for every update. Persona B says that's spam. Resolution: notification preferences with per-event toggles, sensible defaults.
**Cost:** ~1.2x effort (settings UI + logic branching). Risk: "death by settings" if overused.

---

## 6. Conflict Log Template

All conflicts are tracked in `dev_docs/decisions/conflict-log.md`. Create this file at the start of tribunal proceedings.

```markdown
# Conflict Log

> Auto-populated during tribunal proceedings.
> All conflicts between personas are logged here with resolution and rationale.
> This document is an architecture decision record (ADR) for product decisions.

**Project:** {{PROJECT_NAME}}
**Must-Win Persona:** {{MUST_WIN_PERSONA_NAME}} ({{MUST_WIN_PERSONA_ROLE}})
**Tribunal Date:** {{TRIBUNAL_START_DATE}}
**Last Updated:** {{DATE}}

---

## Summary

| Total Conflicts | Resolved | Deferred | Escalated | Open |
|----------------|----------|----------|-----------|------|
| {{COUNT}} | {{COUNT}} | {{COUNT}} | {{COUNT}} | {{COUNT}} |

---

## Conflicts

### CONFLICT-001: Trip Assignment — Automated vs. Manual

**Date:** 2025-01-15
**Phase:** Tribunal Round 3 — Feature Scoring
**Category:** UX Priority

**Personas Involved:**
- Maria (Fleet Operations Manager)
- James (Dispatcher)

**Position A — Maria:**
Wants fully automated trip assignment based on proximity, driver availability, and vehicle type. "Dispatchers spend 2 hours per day manually assigning trips. Automation saves 10+ hours per week across the team."

**Position B — James:**
Wants manual assignment with drag-and-drop. "Automated systems don't know that Driver X and Client Y have a history of problems. I need to override assignments 30% of the time. If the system auto-assigns wrong, I spend MORE time fixing it."

**Is either position a deal-breaker?** No — both will use the product either way, but strongly prefer their approach.

**Resolution:** Build manual drag-and-drop assignment in Phase 1 with a "suggest assignment" button that proposes auto-assignments for the dispatcher to accept/reject/modify. Full auto-assignment with override capability in Phase 3.

**Decided-By:** Compromise (MVP Compromise + Phase-Gate patterns)

**Rationale:**
James is the must-win persona (dispatchers use the system 8 hours/day). Starting with manual assignment respects his expertise while the "suggest" button introduces automation gently. Data from Phase 1 usage (how often dispatchers accept suggestions) validates whether full automation is warranted.

**Consequence:**
- For Maria: Doesn't get full automation immediately, but gets data to justify it. Suggestion feature still saves ~30% of manual assignment time.
- For James: Gets his manual control. Suggestion button is opt-in, not forced.
- For product: Phase 1 scope reduced by ~2 weeks (no ML model needed). Phase 3 has real usage data to build better automation.

**Phase Assignment:** Manual + Suggestions in Phase 1. Full auto-assignment in Phase 3.

**Review Trigger:** After 30 days of Phase 1 usage — review suggestion acceptance rate.

---

### CONFLICT-002: Mobile App — Native vs. Progressive Web App

**Date:** 2025-01-15
**Phase:** Tribunal Round 5 — Technical Feasibility
**Category:** Technical Approach

**Personas Involved:**
- James (Dispatcher)
- Carlos (Driver)

**Position A — James:**
Web app is fine. Dispatchers work at a desk with a laptop. No need for native mobile.

**Position B — Carlos:**
Needs native mobile. Drivers are in vehicles all day. Need GPS tracking, push notifications, offline capability in dead zones, and camera access for photo documentation.

**Is either position a deal-breaker?** YES for Carlos — drivers cannot use a desktop app while driving.

**Resolution:** Carlos's position wins. Build a native mobile app for drivers. Dispatcher remains web-only.

**Decided-By:** Deal-breaker rule — Carlos cannot perform his job without mobile.

**Rationale:**
Deal-breaker resolution is automatic. A driver without a mobile app cannot receive trip assignments, navigate to pickups, or document completions. The product is non-functional for this persona without native mobile.

**Consequence:**
- For James: No impact — still gets his web app.
- For Carlos: Gets native mobile with GPS, push notifications, offline queue, and camera.
- For product: Adds ~4 weeks to Phase 1 for React Native setup, but this is non-negotiable scope.

**Phase Assignment:** Phase 1 (core mobile) + Phase 2 (offline sync, advanced camera features)

**Review Trigger:** N/A — deal-breaker decisions are final unless the persona is removed from scope.
```

---

## 7. Process Integration

### During Tribunal Proceedings

1. **Round 1-2 (Persona creation):** No conflicts yet — personas are being defined
2. **Round 3-6 (Feature scoring, UX review):** Primary conflict zone — log every disagreement
3. **Round 7-8 (Technical feasibility):** Technical conflicts surface — architecture vs. UX tradeoffs
4. **Round 9-10 (Final verdict):** All conflicts must be resolved or explicitly deferred with phase assignment

### After Tribunal

1. Copy the conflict log to `dev_docs/decisions/conflict-log.md`
2. Extract all deferred conflicts and add them to the relevant phase task list
3. Add review triggers to the project calendar or sprint milestones
4. Reference conflict IDs in feature specs when a design decision traces back to a conflict resolution

### During Development

- If a developer encounters a situation where a resolved conflict might need revisiting (new information, implementation impossibility), they file a new conflict ticket referencing the original
- Deferred conflicts are reviewed at each phase gate — they don't silently disappear
- If a resolved conflict's review trigger fires, the PM re-evaluates with updated data
