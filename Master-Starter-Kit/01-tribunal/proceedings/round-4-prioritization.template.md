# Round 4: Final MoSCoW Prioritization

> **Date:** [YYYY-MM-DD]
> **Participants:** All persona agents ([N]) + all expert agents (5)
> **Total Voters:** [N+5]
> **Features Voted On:** [N]
> **Duration:** [Estimated time]

---

## Round 4 Purpose

This is the binding vote. Every agent — personas and experts — votes on the final feature classification. The output is the approved product scope, phase allocation, and timeline that will govern development.

**Ground rules:**
- Every agent gets one vote per feature: **Yes** (approve classification), **Yes-with-Reservations** (approve but flag a concern), or **No** (reject classification)
- A feature needs **majority Yes + Yes-with-Reservations** to be approved at its classification level
- If a Must-Have feature gets majority No, it drops to Should-Have
- If a Should-Have gets majority Yes, it can be promoted to Must-Have
- Reservations must be documented — what's the concern and how should it be addressed?
- This vote is final. Changes after this require a mini-Tribunal (documented justification + re-vote)

---

## Must Have (Launch Blockers)

Without these features, the product cannot launch. These are the absolute minimum for a viable product.

**Classification criteria:**
- The must-win persona cannot do their core workflow without this feature
- It's a deal-breaker for at least one persona
- It's table stakes (80%+ of competitors have it)
- OR: it's the product's core differentiator (the reason users would switch to us)

| # | Feature | Justification | Effort (days) | Phase | Dependency |
|---|---------|---------------|--------------|-------|-----------|
| 1 | [Feature] | [Why this is a launch blocker. Example: "Dispatchers can't assign trips without it — core workflow is impossible."] | [N] | [1] | [None / "Requires Phase 0 auth"] |
| 2 | [Feature] | [Justification] | [N] | [1] | [Dependencies] |
| 3 | [Feature] | [Justification] | [N] | [1] | [Dependencies] |
| 4 | [Feature] | [Justification] | [N] | [2] | [Dependencies] |
| 5 | [Feature] | [Justification] | [N] | [2] | [Dependencies] |
| 6 | [Feature] | [Justification] | [N] | [2] | [Dependencies] |
| 7 | [Feature] | [Justification] | [N] | [3] | [Dependencies] |
| 8 | [Feature] | [Justification] | [N] | [3] | [Dependencies] |

**Total Must-Have effort:** [N developer-days]

---

## Should Have (Important but Deferrable)

These features are important and expected by users, but the product is minimally usable without them. Target for V1 but can slip to a post-launch update if timeline is tight.

**Classification criteria:**
- Multiple personas voted for it (but it's not a deal-breaker for any)
- 50-79% of competitors have it
- It improves the experience significantly but doesn't block the core workflow
- Effort is proportionate to value

| # | Feature | Justification | Effort (days) | Target Phase | Risk if Deferred |
|---|---------|---------------|--------------|-------------|-----------------|
| 1 | [Feature] | [Why important but not a blocker. Example: "Bulk trip import saves dispatchers 30min/day but they can still enter trips one at a time."] | [N] | [4] | [Low/Med/High — what happens if users don't get this in V1] |
| 2 | [Feature] | [Justification] | [N] | [Phase] | [Risk] |
| 3 | [Feature] | [Justification] | [N] | [Phase] | [Risk] |
| 4 | [Feature] | [Justification] | [N] | [Phase] | [Risk] |
| 5 | [Feature] | [Justification] | [N] | [Phase] | [Risk] |

**Total Should-Have effort:** [N developer-days]

---

## Could Have (Nice to Have)

These features would enhance the product but are not expected by users at launch. Include only if time permits after Must-Have and Should-Have are complete.

**Classification criteria:**
- Low persona vote count (1-2 votes total)
- Fewer than 50% of competitors have it
- It's an enhancement to an existing feature, not a new workflow
- OR: it's an innovation feature with uncertain user demand

| # | Feature | Justification | Effort (days) | Phase | Value / Effort Ratio |
|---|---------|---------------|--------------|-------|---------------------|
| 1 | [Feature] | [Why nice-to-have. Example: "Keyboard shortcuts for power users — improves speed for 10% of users who would discover and use them."] | [N] | [5+] | [High/Med/Low] |
| 2 | [Feature] | [Justification] | [N] | [Phase] | [Ratio] |
| 3 | [Feature] | [Justification] | [N] | [Phase] | [Ratio] |
| 4 | [Feature] | [Justification] | [N] | [Phase] | [Ratio] |

**Total Could-Have effort:** [N developer-days]

---

## Won't Have (V2+ Only)

Features explicitly deferred. This is NOT a "maybe later" pile — each feature has a documented reason for deferral and a clear signal for when to revisit.

**Classification criteria:**
- Zero persona votes AND not table stakes
- Effort is disproportionate to current value (XL effort for Low-value)
- Requires infrastructure that doesn't exist yet and isn't justified by Must-Have features
- External dependency isn't mature or reliable enough
- Regulatory/compliance scope is too large for V1 timeline

| # | Feature | Reason Deferred | Revisit When | Effort (if built) |
|---|---------|----------------|-------------|-------------------|
| 1 | [Feature] | [Specific reason. Example: "Full auto-assignment algorithm requires ML model trained on historical trip data. We don't have enough data yet. Build manual assignment with suggestions in V1; revisit auto-assignment after 6 months of trip data."] | [Trigger for revisit. Example: "After 10,000+ completed trips in the system."] | [N days] |
| 2 | [Feature] | [Reason] | [Revisit trigger] | [N days] |
| 3 | [Feature] | [Reason] | [Revisit trigger] | [N days] |
| 4 | [Feature] | [Reason] | [Revisit trigger] | [N days] |
| 5 | [Feature] | [Reason] | [Revisit trigger] | [N days] |

**Total deferred effort:** [N developer-days] (this is effort we're NOT spending in V1)

---

## Vote Record

How each agent voted on each Must-Have feature. Must-Have features require majority approval to keep their classification.

### Must-Have Feature Votes

| Feature | [PA] | [PB] | [PC] | [PD] | [PE] | [UX] | [UI] | [FE] | [BE] | [FR] | Yes | YwR | No | Result |
|---------|------|------|------|------|------|------|------|------|------|------|-----|-----|-----|--------|
| [Feature 1] | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | [10] | [0] | [0] | **APPROVED** |
| [Feature 2] | Y | Y | YwR | Y | N | Y | YwR | Y | Y | Y | [7] | [2] | [1] | **APPROVED** |
| [Feature 3] | Y | N | Y | Y | Y | YwR | Y | N | Y | Y | [7] | [1] | [2] | **APPROVED** |
| [Feature 4] | Y | Y | Y | N | N | Y | Y | Y | N | YwR | [6] | [1] | [3] | **APPROVED** |
| [Feature 5] | N | Y | N | Y | N | N | Y | N | Y | N | [4] | [0] | [6] | **REJECTED — Move to Should-Have** |

**Legend:**
- Y = Yes (approve)
- YwR = Yes with Reservations (approve but flagged concern)
- N = No (reject this classification)
- PA-PE = Persona agents A through E
- UX/UI/FE/BE/FR = Expert agents

### Reservations Noted

| Feature | Agent | Reservation |
|---------|-------|------------|
| [Feature 2] | [Persona C] | [e.g., "Approve but concerned about the simplified V1 version not meeting billing clerk's need for itemized line items. Must revisit in Phase 4."] |
| [Feature 2] | [UI Designer] | [e.g., "Approve but the invoice template needs to handle variable-length line items without breaking layout. Needs design spike."] |
| [Feature 3] | [UX Researcher] | [Reservation] |
| [Feature] | [Agent] | [Reservation] |

### Promotion Candidates

Should-Have features that received enough Yes votes to be considered for Must-Have:

| Feature | Yes | YwR | No | Promote? | Decision |
|---------|-----|-----|-----|----------|----------|
| [Feature] | [8] | [1] | [1] | [Yes] | [Promoted to Must-Have Phase 3 — high consensus, moderate effort] |
| [Feature] | [6] | [2] | [2] | [No] | [Keep as Should-Have — effort too high for remaining timeline] |

---

## Phase Allocation (Approved)

The binding phase plan approved by the Tribunal.

### Phase 0: Foundation

**Goal:** [e.g., "Project infrastructure, authentication, database schema, design system tokens"]
**Duration:** [N weeks]
**Features:**

| Feature | Effort | Owner |
|---------|--------|-------|
| [e.g., Auth + RBAC] | [5 days] | [Backend] |
| [e.g., DB schema + migrations] | [3 days] | [Backend] |
| [e.g., Design system tokens + base components] | [5 days] | [Frontend] |
| [e.g., Project structure + CI/CD] | [2 days] | [DevOps] |

**Exit criteria:** [e.g., "User can register, login, and see an empty dashboard. Design tokens are defined and base components (button, input, card, table) are built."]

### Phase 1: [Name — e.g., "Core Dispatch Workflow"]

**Goal:** [e.g., "Dispatchers can create, assign, and track trips end-to-end"]
**Duration:** [N weeks]
**Features:**

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| [Feature] | [N days] | [Phase 0] |
| [Feature] | [N days] | [Feature above] |
| [Feature] | [N days] | [None] |

**Exit criteria:** [e.g., "Dispatcher can create a trip, assign it to a driver, track status changes, and see the trip on the dispatch board. All CRUD operations work with proper validation."]

### Phase 2: [Name]

**Goal:** [Goal]
**Duration:** [N weeks]
**Features:**

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| [Feature] | [N days] | [Dependencies] |
| [Feature] | [N days] | [Dependencies] |

**Exit criteria:** [Criteria]

### Phase 3: [Name]

**Goal:** [Goal]
**Duration:** [N weeks]
**Features:**

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| [Feature] | [N days] | [Dependencies] |
| [Feature] | [N days] | [Dependencies] |

**Exit criteria:** [Criteria]

### Phase 4+: [Name — e.g., "Should-Have Features + Polish"]

**Goal:** [Goal]
**Duration:** [N weeks]
**Features:**

| Feature | Effort | Dependencies |
|---------|--------|-------------|
| [Feature] | [N days] | [Dependencies] |
| [Feature] | [N days] | [Dependencies] |

**Exit criteria:** [Criteria]

---

## Timeline Summary

| Phase | Name | Weeks | Cumulative |
|-------|------|-------|-----------|
| Phase 0 | Foundation | [N] | [N] weeks |
| Phase 1 | [Name] | [N] | [N] weeks |
| Phase 2 | [Name] | [N] | [N] weeks |
| Phase 3 | [Name] | [N] | [N] weeks |
| Phase 4+ | [Name] | [N] | [N] weeks |
| **Total** | | | **[N] weeks** |

**Buffer:** [Add 20-30% buffer to the total for unknowns, tech debt, and scope adjustments]
**Total with buffer:** [N] weeks

---

## Final Notes

### Scope Lock Commitment

This feature list is locked. Changes require:

1. Written justification for the change (what changed and why)
2. Impact analysis (what does this affect — timeline, other features, dependencies?)
3. Mini-Tribunal vote (majority approval from relevant agents)
4. Updated verdict document

### Risk Acknowledgments

Risks accepted by the Tribunal with eyes open:

| Risk | Probability | Impact | Accepted Because |
|------|-----------|--------|-----------------|
| [e.g., "GPS tracking might cause driver pushback"] | [Medium] | [High] | [Core to dispatch workflow; privacy controls mitigate the risk] |
| [e.g., "Timeline might slip by 2-3 weeks"] | [High] | [Medium] | [Buffer is built in; Should-Have features can slip without blocking launch] |
| [Risk] | [Probability] | [Impact] | [Reason accepted] |

---

*This document feeds into proceedings/verdict.template.md and 04-phase-planning/*
