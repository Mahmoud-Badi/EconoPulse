# Discovery Delta Log: {{PROJECT_NAME}}

> **Purpose:** Capture new user insights that surface AFTER discovery is complete — during development, user testing, support, or production use. These insights feed back into the plan so it evolves with reality instead of staying frozen at the original (possibly wrong) assumptions.
> **Owner:** {{PRODUCT_LEAD_NAME}}
> **Created:** {{DATE}}
> **Last Updated:** {{DATE}}

---

## How This Works

```
Insight Discovered → Document Delta → Assess Impact → Decision (Accept/Reject/Defer) → Update Plan
```

1. **Discover:** Someone on the team notices something that contradicts or extends original discovery
2. **Document:** Fill in a delta entry below with evidence
3. **Assess:** Determine what changes in the plan if this insight is true
4. **Decide:** Accept (update plan), Reject (document why), or Defer (revisit at specific date)
5. **Update:** If accepted, modify the affected specs, tasks, and phase plans. List every changed document.

---

## Integration Points — When to Check for Deltas

| Trigger | Who Checks | What to Look For |
|---------|-----------|-----------------|
| **Sprint review / demo** | PM + Dev Lead | Features that users react unexpectedly to. "Oh, I thought it would work like..." = delta. |
| **User testing session** | UX Researcher | Any workflow where 2+ users struggle or take an unexpected path. |
| **Support ticket patterns** | Support Lead | Recurring questions about the same feature = mismatch between design and user expectation. |
| **Analytics anomaly** | PM | Feature with high abandonment, unexpected usage patterns, or zero adoption. |
| **Developer implementation** | Developer | "This doesn't make sense" moments during coding — technical reality contradicts spec. |
| **Competitor launch** | Product Lead | Competitor ships something that changes the competitive landscape. |
| **Sales/demo feedback** | Sales | Prospect says "I need X" and X isn't in the plan. |

---

## Backflow Rules — How Insights Flow Back

When a delta is **accepted**, update these documents in order:

1. **Assumption Registry** (`00-discovery/assumption-registry.md`) — Mark the invalidated assumption. Add the new validated insight.
2. **Project Brief** (`dev_docs/specs/PROJECT-BRIEF.md`) — If the delta changes user types, core loop, or business model.
3. **Feature List / Verdict** (`dev_docs/specs/verdict.md`) — If the delta adds, removes, or reprioritizes features.
4. **Service Specs** (`dev_docs/specs/{{SERVICE}}.md`) — If the delta changes how a specific service works.
5. **Screen Specs** (`dev_docs/specs/screens/{{SCREEN}}.md`) — If the delta changes UI behavior.
6. **Phase Plan** (`dev_docs/tasks/`) — If the delta adds or removes tasks.
7. **Master Tracker** (`dev_docs/tracker/master-tracker.md`) — If tasks changed.
8. **Conflict Log** (`dev_docs/decisions/conflict-log.md`) — If the delta reopens a resolved conflict.

---

## Delta Entries

---

### DELTA-001: {{SHORT_TITLE}}

**Date Discovered:** {{DATE}}
**Discovered By:** {{NAME_AND_ROLE}}
**Phase/Task Where Discovered:** {{PHASE_NUMBER — TASK_ID_OR_ACTIVITY}}

**Original Assumption:**
{{WHAT_WE_BELIEVED_BEFORE — REFERENCE_THE_DOCUMENT_AND_SECTION}}

**New Insight:**
{{WHAT_WE_NOW_KNOW_TO_BE_TRUE_OR_LIKELY_TRUE}}

**Evidence:**
- {{EVIDENCE_TYPE}}: "{{DIRECT_QUOTE_OR_DATA_POINT}}"
- {{EVIDENCE_TYPE}}: "{{DIRECT_QUOTE_OR_DATA_POINT}}"
- {{EVIDENCE_TYPE}}: {{OBSERVATION_OR_METRIC}}

**Impact Assessment:**
- **Scope change:** {{WHAT_FEATURES_OR_TASKS_ARE_AFFECTED}}
- **Timeline impact:** {{ADDS_N_DAYS | NO_IMPACT | REMOVES_N_DAYS}}
- **Architecture impact:** {{REQUIRES_SCHEMA_CHANGE | API_CHANGE | NONE}}
- **Risk level:** {{HIGH — BLOCKS_CURRENT_PHASE | MEDIUM — AFFECTS_FUTURE_PHASE | LOW — NICE_TO_KNOW}}

**Decision:** {{ACCEPT | REJECT | DEFER}}

**Decision Rationale:**
{{WHY_THIS_DECISION_WAS_MADE}}

**Updated Documents:**
- [ ] {{DOCUMENT_PATH}} — {{WHAT_CHANGED}}
- [ ] {{DOCUMENT_PATH}} — {{WHAT_CHANGED}}

**Review Date (if deferred):** {{DATE}}

---

## Example: Filled-In Delta

---

### DELTA-001: Dispatchers Need Batch Assignment, Not One-at-a-Time

**Date Discovered:** 2025-02-20
**Discovered By:** Sarah (UX Researcher) during user testing session
**Phase/Task Where Discovered:** Phase 2 — Task 2.4 (Dispatch Screen Implementation)

**Original Assumption:**
Per PROJECT-BRIEF.md Section 4 and dispatch-service.md Section 3.2: "Dispatchers assign trips one at a time by dragging a trip card onto a driver." This was based on the intake interview where the owner described the workflow.

**New Insight:**
Dispatchers assign trips in batches. Morning shift starts with 40-60 unassigned trips. Dispatchers sort by region, select 8-12 trips, and assign them to a single driver in one action. One-at-a-time assignment would take 3x longer than their current spreadsheet process.

**Evidence:**
- User testing: "I would never drag 60 trips one at a time. That's insane." — Maria, Head Dispatcher
- User testing: 3/3 dispatchers attempted to multi-select trips before being told the feature didn't exist
- Observation: Current spreadsheet workflow shows dispatchers copying 8-12 rows at once, pasting into a driver's column

**Impact Assessment:**
- **Scope change:** Dispatch screen needs multi-select, bulk assignment modal, region-based grouping, and batch undo
- **Timeline impact:** Adds 3-4 days to Phase 2 (dispatch screen was estimated at 8 days, now 11-12)
- **Architecture impact:** API change — `POST /trips/:id/assign` becomes `POST /trips/bulk-assign` with array payload. Trip assignment service needs batch transaction support.
- **Risk level:** HIGH — blocks current phase. The dispatch screen is unusable without this.

**Decision:** ACCEPT

**Decision Rationale:**
3/3 test users independently identified this as a dealbreaker. The original design would make the product slower than the spreadsheet it replaces. This is a "ship it wrong and nobody uses it" scenario.

**Updated Documents:**
- [x] `dev_docs/specs/dispatch-service.md` — Added Section 3.2.1 (Batch Assignment) with multi-select flow, bulk API endpoint, and batch undo behavior
- [x] `dev_docs/specs/screens/dispatch-board.md` — Added multi-select interaction, bulk assignment modal, keyboard shortcuts (Shift+click for range, Ctrl+click for individual)
- [x] `dev_docs/tasks/phase-2/task-2.4-dispatch-screen.md` — Added subtasks for multi-select UI, bulk API, and batch undo. Updated estimate from 8 to 12 days.
- [x] `dev_docs/tracker/master-tracker.md` — Updated Phase 2 timeline (+4 days)
- [x] `00-discovery/assumption-registry.md` — Marked ASSUME-012 as INVALIDATED. Added ASSUME-012a (batch assignment is primary workflow).

---

### DELTA-002: {{SHORT_TITLE}}

**Date Discovered:** {{DATE}}
**Discovered By:** {{NAME_AND_ROLE}}
**Phase/Task Where Discovered:** {{PHASE_NUMBER — TASK_ID_OR_ACTIVITY}}

**Original Assumption:**
{{WHAT_WE_BELIEVED_BEFORE}}

**New Insight:**
{{WHAT_WE_NOW_KNOW}}

**Evidence:**
- {{EVIDENCE_TYPE}}: "{{DIRECT_QUOTE_OR_DATA_POINT}}"

**Impact Assessment:**
- **Scope change:** {{DESCRIPTION}}
- **Timeline impact:** {{DESCRIPTION}}
- **Architecture impact:** {{DESCRIPTION}}
- **Risk level:** {{HIGH | MEDIUM | LOW}}

**Decision:** {{ACCEPT | REJECT | DEFER}}

**Decision Rationale:**
{{WHY}}

**Updated Documents:**
- [ ] {{DOCUMENT_PATH}} — {{WHAT_CHANGED}}

**Review Date (if deferred):** {{DATE}}
