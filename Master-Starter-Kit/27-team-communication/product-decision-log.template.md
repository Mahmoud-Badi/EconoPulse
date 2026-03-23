# Product Decision Log

> Every product decision that is not written down will be relitigated. Every relitigated decision wastes 30-120 minutes of team time and erodes trust. This log captures the what, why, and alternatives for every significant product decision so the team can move forward with confidence and new members can understand history.

---

## Project: {{PROJECT_NAME}}

**Log started:** {{DATE}}
**Log owner:** {{PROJECT_LEAD}}
**Related:** `02-architecture/decisions-log.template.md` (for technical/architecture decisions — ADR format)

---

## When to Log a Product Decision

Log a decision when **any** of the following are true:

- [ ] The decision affects more than one sprint of work
- [ ] The decision was debated (two or more options seriously considered)
- [ ] The decision changes something visible to users or stakeholders
- [ ] The decision changes scope, timeline, or budget
- [ ] The decision overrides a previous decision
- [ ] A new team member would ask "why did we do it this way?"
- [ ] You found yourself explaining the same decision twice

**Do not log:**
- Routine implementation choices (which variable name, which CSS approach)
- Decisions already captured in the Architecture Decision Log (ADR)
- Decisions that are trivially reversible with no cost

---

## Decision Categories

| Category | Scope | Examples |
|----------|-------|---------|
| **Feature** | What to build | Add/remove a feature, feature scope, MVP definition |
| **UX** | How it looks/feels | Navigation structure, onboarding flow, error messaging approach |
| **Pricing** | How we charge | Pricing model, tier structure, free vs paid features |
| **Market** | Who we serve | Target audience, market segment, positioning |
| **Scope** | What is in/out | MVP scope cut, feature deferral, "not now" decisions |
| **Priority** | What order | Feature prioritization, tech debt vs features, bug triage |
| **Process** | How we work | Sprint duration, release cadence, review process |
| **Partnership** | External relationships | Third-party integrations, vendor selection, API partnerships |

---

## Product Decision Record Template

Copy this template for each new decision.

```markdown
### PDR-{NUMBER}: {DECISION_TITLE}

**Date:** YYYY-MM-DD
**Category:** Feature / UX / Pricing / Market / Scope / Priority / Process / Partnership
**Decider:** [Who made the final call — one person, even if the team discussed]
**Participants:** [Who was involved in the discussion]
**Status:** Proposed / Accepted / Revisited / Superseded by PDR-[number]

---

**Decision:**
[What was decided — one clear sentence. Not "we discussed X" but "We will do X."]

**Context:**
[Why this decision came up. What triggered it — user feedback, data, stakeholder request,
technical constraint, market change? 2-4 sentences.]

**Options Considered:**

1. **Option A: [Name]**
   - Description: [What this option entails]
   - Pros: [List]
   - Cons: [List]
   - Effort: [T-shirt size: S/M/L/XL]

2. **Option B: [Name]**
   - Description: [What this option entails]
   - Pros: [List]
   - Cons: [List]
   - Effort: [T-shirt size: S/M/L/XL]

3. **Option C: [Name]** (if applicable)
   - Description:
   - Pros:
   - Cons:
   - Effort:

**Rationale:**
[Why Option [X] was chosen over alternatives. Be specific — "it was cheaper" is weak,
"it saves 3 weeks of development and the UX tradeoff is acceptable because only 5% of
users use that flow" is strong.]

**Impact:**
[What changes as a result. Which tasks are created? Which tasks are removed? Which
stakeholders are affected? What does the user experience change look like?]

**Risks:**
[What could go wrong with this decision? What would trigger a revisit?]

**Review Date:**
[When to revisit this decision — "after MVP launch," "Q3 2026," "never (permanent)," or
"if [condition] changes"]
```

---

## Decision Log

### PDR-001: [First Decision Title]

**Date:** {{DATE}}
**Category:** [Category]
**Decider:** {{PROJECT_LEAD}}
**Participants:** [Team members involved]
**Status:** Accepted

---

**Decision:**
[One clear sentence]

**Context:**
[2-4 sentences on why this came up]

**Options Considered:**

1. **Option A: [Name]**
   - Description:
   - Pros:
   - Cons:
   - Effort:

2. **Option B: [Name]**
   - Description:
   - Pros:
   - Cons:
   - Effort:

**Rationale:**
[Why this option was chosen]

**Impact:**
[What changes]

**Risks:**
[What could go wrong]

**Review Date:** [When to revisit]

---

### PDR-002: [Second Decision Title]

**Date:**
**Category:**
**Decider:**
**Participants:**
**Status:** Proposed

---

**Decision:**

**Context:**

**Options Considered:**

1. **Option A:**
   - Description:
   - Pros:
   - Cons:
   - Effort:

2. **Option B:**
   - Description:
   - Pros:
   - Cons:
   - Effort:

**Rationale:**

**Impact:**

**Risks:**

**Review Date:**

---

## Decision Index

Quick-reference table of all decisions. Keep this updated as you add entries.

| PDR # | Title | Category | Date | Status | Decider |
|-------|-------|----------|------|--------|---------|
| PDR-001 | | | | Accepted | |
| PDR-002 | | | | Proposed | |
| PDR-003 | | | | | |

---

## Example Decisions (For Reference)

These examples show what good decision records look like across different categories.

### Example: Feature Decision

```
### PDR-007: Implement email notifications before SMS

**Date:** 2026-01-15
**Category:** Priority
**Decider:** Sarah (Product Lead)
**Participants:** Dev team, marketing lead
**Status:** Accepted

**Decision:** We will implement email notifications first and defer SMS
notifications to Sprint 8.

**Context:** Users requested both email and SMS notifications. We have capacity
for one this sprint. SMS requires a third-party provider integration (Twilio)
which adds complexity and cost.

**Options Considered:**
1. **Email first, SMS later**
   - Pros: Simpler to implement, no third-party cost, covers 80% of use cases
   - Cons: Power users want SMS, delayed delivery of full notification suite
   - Effort: M (email) + L (SMS later)

2. **SMS first, email later**
   - Pros: Higher engagement rates, differentiator vs competitors
   - Cons: Higher cost, more complex, smaller user reach
   - Effort: L (SMS) + M (email later)

3. **Both simultaneously**
   - Pros: Complete feature, one sprint of notification work
   - Cons: Exceeds sprint capacity, risk of shipping neither well
   - Effort: XL

**Rationale:** Analytics show 95% of users have verified email addresses vs 40%
with phone numbers. Email covers more users with less effort. SMS can be added
in Sprint 8 without architectural changes.

**Impact:** Sprint 6 includes email notification tasks. SMS tasks moved to Sprint
8 backlog. Marketing updates launch announcement to mention "email notifications
now, SMS coming soon."

**Risks:** Power users may churn without SMS. Mitigation: add SMS to Sprint 8
commitment, communicate timeline to requesting users.

**Review Date:** Sprint 8 planning — confirm SMS is still prioritized.
```

### Example: Scope Decision

```
### PDR-012: Cut admin dashboard from MVP

**Date:** 2026-02-01
**Category:** Scope
**Decider:** Alex (Project Lead)
**Participants:** Full team + investor
**Status:** Accepted

**Decision:** Admin dashboard is cut from MVP. Admin operations will be handled
via database queries and scripts until post-launch.

**Context:** MVP deadline is March 15. Admin dashboard was estimated at 3 weeks
of work. Completing it would delay launch by 2 weeks or require cutting user-facing
features.

**Options Considered:**
1. **Cut admin dashboard, use scripts**
   - Pros: Saves 3 weeks, launches on time
   - Cons: Manual admin work, error-prone, does not scale past 100 users
   - Effort: S (write scripts)

2. **Build minimal admin dashboard**
   - Pros: Basic admin capability, looks more professional
   - Cons: Still 1.5 weeks, features are limited anyway
   - Effort: L

3. **Delay launch by 2 weeks**
   - Pros: Full admin dashboard at launch
   - Cons: Delayed revenue, delayed user feedback, team morale impact
   - Effort: XL

**Rationale:** At launch we expect <50 users. Manual admin is acceptable at that
scale. User-facing features drive acquisition; admin dashboard does not. Build it
when admin pain becomes the bottleneck, not before.

**Impact:** 3 admin dashboard tasks removed from Sprint 5-6. 2 script tasks added
(user management script, data export script). Launch date confirmed March 15.

**Risks:** Manual admin errors. Mitigation: scripts include validation and dry-run
mode. Admin dashboard prioritized for Sprint 9-10.

**Review Date:** When active users exceed 100 or admin operations exceed 1 hour/day.
```

### Example: UX Decision

```
### PDR-015: Single-page onboarding instead of multi-step wizard

**Date:** 2026-02-10
**Category:** UX
**Decider:** Jordan (Design Lead)
**Participants:** Design team, frontend dev, product lead
**Status:** Accepted

**Decision:** New user onboarding will be a single scrollable page instead of a
multi-step wizard.

**Context:** User testing showed 40% drop-off at step 3 of the 5-step wizard.
Users reported feeling "trapped" and unsure how many steps remained.

**Options Considered:**
1. **Single page with sections**
   - Pros: Users see full scope upfront, can skip/return, lower drop-off
   - Cons: Page may feel long, harder to track completion
   - Effort: M

2. **Improved wizard with progress bar**
   - Pros: Keeps guided experience, progress bar reduces uncertainty
   - Cons: Still multi-step, may not fix the core "trapped" feeling
   - Effort: S

**Rationale:** Competitor analysis shows top 3 competitors use single-page
onboarding. User testing of a prototype single page showed 15% better completion
rate than the improved wizard.

**Impact:** Redesign onboarding page (TASK-089). Remove wizard components (TASK-090).
Update onboarding analytics events (TASK-091).

**Risks:** Long page on mobile may cause scroll fatigue. Mitigation: progressive
disclosure with expandable sections.

**Review Date:** 30 days post-launch — compare completion rates with wizard baseline.
```

---

## Cross-Reference: Technical vs Product Decisions

| Aspect | Product Decision (PDR) | Architecture Decision (ADR) |
|--------|----------------------|---------------------------|
| **Location** | `27-team-communication/product-decision-log.template.md` | `02-architecture/decisions-log.template.md` |
| **Scope** | Features, UX, pricing, scope, market | Database, frameworks, infrastructure, patterns |
| **Decider** | Product lead or project lead | Tech lead or architect |
| **Audience** | Whole team + stakeholders | Engineering team |
| **Examples** | "Cut feature X from MVP" | "Use PostgreSQL instead of MongoDB" |

If a decision is both product and technical (e.g., "Use a third-party auth service instead of building our own"), create entries in both logs and cross-reference them.

---

## Decision Review Process

### Quarterly Review

Every quarter, review the decision log:

1. **Are any decisions due for review?** Check the Review Date field.
2. **Have any decisions been invalidated?** New data, market changes, or user feedback may require revisiting.
3. **Are any decisions causing ongoing pain?** If the team keeps working around a decision, it may need revisiting.
4. **Mark superseded decisions.** Update the Status field and reference the new PDR.

### Revisiting a Decision

When revisiting a decision:

1. Do NOT edit the original PDR. Create a new PDR that references it.
2. Status of original: change to `Superseded by PDR-[new number]`
3. New PDR Context section should explain what changed since the original decision.
4. This preserves decision history — critical for understanding why the project evolved.

---

## Solo Developer Notes

If you are a solo developer, the product decision log is still valuable:

- **Future you is a different person.** You will forget why you made decisions. Write it down.
- **Onboarding future team members.** When you hire, the decision log is the fastest way to transfer context.
- **Stakeholder communication.** Investors and advisors respect documented decision-making.
- **Reducing decision fatigue.** Once decided and logged, stop second-guessing. Move on.

Simplify the template for solo use: skip Participants, keep Options to 2, and write Rationale in 1-2 sentences.
