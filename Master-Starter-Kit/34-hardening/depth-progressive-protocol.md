# Depth Progressive Protocol — 5-Round Verification

> **Used by:** Step 31 (Depth & Completeness Verification)
> **Purpose:** Defines the progressive deepening rules for each of the 5 verification rounds.

---

## Overview

Each round focuses on a different dimension of depth. Rounds are cumulative — later rounds build on findings from earlier rounds.

```
Round 1: Phase Sequencing        → Are phases ordered correctly?
Round 2: Sub-Task Sufficiency    → Are tasks granular enough?
Round 3: Milestone Criteria      → Are milestones testable?
Round 4: Service Spec Deep Scan  → Do specs meet elevated thresholds?
Round 5: Cross-Reference Check   → Do all documents reference each other correctly?
```

---

## Round 1: Phase Sequencing Verification

**Focus:** Verify all phases have correct dependencies and sequencing.

**Checks:**
1. Read `dev_docs/project-phases.md` and extract all phases with their dependencies
2. Build a dependency graph — verify no circular dependencies exist
3. Verify the critical path is explicitly identified
4. Check that infrastructure/foundation phases come before feature phases
5. Verify parallel-safe phases are marked as parallelizable
6. Check that each phase has a clear entry condition and exit condition
7. Verify phase duration estimates sum to a reasonable total

**Thresholds:**
- Zero circular dependencies (CRITICAL if found)
- Every phase must have explicit entry/exit conditions
- Critical path must be documented

**Output:** `dev_docs/hardening/depth-verification/round-1-phases.md`

---

## Round 2: Sub-Task Sufficiency

**Focus:** Verify every task has enough granularity for implementation.

**Checks:**
1. Read all task files in `dev_docs/tasks/`
2. For each task, verify:
   - Has ≥3 sub-tasks (unless genuinely atomic)
   - No single sub-task exceeds 4 hours of estimated effort
   - Each sub-task has a clear deliverable (file, function, test, etc.)
   - Sub-tasks follow a logical implementation order
3. Flag "mega-tasks" — any task with >8 hour estimate and <3 sub-tasks
4. Flag "vague tasks" — any task whose description doesn't specify concrete files or components
5. Split flagged tasks into properly granular sub-tasks

**Thresholds:**
- Zero mega-tasks remaining after round
- Every task file specifies concrete output files
- Average sub-task count per task ≥ 3

**Output:** `dev_docs/hardening/depth-verification/round-2-subtasks.md`

---

## Round 3: Milestone Acceptance Criteria

**Focus:** Verify every milestone has testable, specific acceptance criteria.

**Checks:**
1. Extract all milestones from phase plans and task files
2. For each milestone, verify acceptance criteria are:
   - **Specific** — names exact features, screens, or behaviors (not "feature works")
   - **Testable** — can be verified by running a command, clicking through a flow, or checking a metric
   - **Complete** — covers all services/features included in the milestone
3. Flag vague criteria: "works correctly", "is functional", "users can use", "feature complete"
4. Rewrite flagged criteria with specific, testable language
5. Verify each milestone has a definition of done checklist

**Thresholds:**
- Zero vague acceptance criteria remaining
- Every milestone has ≥3 specific acceptance criteria
- Every criterion includes a verification method (manual test, automated test, metric check)

**Output:** `dev_docs/hardening/depth-verification/round-3-milestones.md`

---

## Round 4: Service Spec Deep Scan

**Focus:** Re-score all specs with elevated thresholds.

**Elevated thresholds (vs. standard):**

| Document Type | Standard Threshold | Elevated Threshold |
|---------------|-------------------|-------------------|
| Service specs | ≥8/10 | ≥9/10 |
| Screen specs | ≥7/10 | ≥8/10 |
| Task files | ≥6/8 layers | ≥7/8 layers |

**Scoring criteria (per `10-generators/DEPTH-REQUIREMENTS.md`):**

Service specs — to reach 9/10:
- ≥1000 words (was 800)
- ≥7 business rules (was 5)
- ≥6 API endpoints (was 4)
- ≥4 entities (was 3)
- ≥5 edge cases documented
- State machines for all stateful entities
- Error taxonomy with codes and messages
- Performance requirements specified

Screen specs — to reach 8/10:
- ≥500 words (was 400)
- ≥5 interaction states (was 4)
- ≥4 user interactions (was 3)
- Responsive breakpoints specified
- Accessibility requirements documented
- Loading/error/empty/data states all specified

**Process:**
1. Run depth scorer on all service specs, screen specs, and task files
2. Flag any scoring below elevated thresholds
3. For each flagged document, identify which sections are pulling the score down
4. Re-generate or expand those specific sections
5. Re-score to confirm threshold is met

**Output:** `dev_docs/hardening/depth-verification/round-4-service-depth.md`

---

## Round 5: Cross-Reference Integrity

**Focus:** Verify bidirectional references between all documents.

**Checks:**
1. **Service ↔ Screen:** Every service referenced in a screen spec must reference that screen back. Every screen that uses a service must be listed in that service's hub.
2. **Service ↔ Task:** Every service must have corresponding task files. Every task file must reference the service it implements.
3. **Screen ↔ Task:** Every screen spec must have task files covering its implementation. Task files must reference the screens they build.
4. **API ↔ Service:** Every API endpoint in the API registry must map to a service. Every service hub must list its API endpoints.
5. **Entity ↔ Service:** Every entity in the domain model must be owned by at least one service. Every service must list which entities it owns.
6. **Feature ↔ Task:** Every feature in the features list must map to ≥1 task. No orphaned features.
7. **Orphan detection:** Find files in `dev_docs/` that are not referenced by any other file.

**Thresholds:**
- Zero broken references (reference to non-existent file)
- Zero orphaned features (features without tasks)
- ≤5% orphaned files (files not referenced anywhere)

**Output:** `dev_docs/hardening/depth-verification/round-5-cross-ref.md`

---

## Early Exit Condition

Early exit is allowed ONLY when ALL THREE conditions are met:

1. **Current round found ≤3 findings** (not zero — minor findings don't justify continuing)
2. **All findings from previous rounds are resolved** (no open items carried forward)
3. **Current round is Round 4 or 5** (Rounds 1, 2, and 3 are always mandatory)

**Rounds 1, 2, and 3 are NEVER skippable** — they cover phase sequencing (structural correctness), sub-task sufficiency (implementation readiness), and milestone criteria (testable definitions of done). These are foundational and must always run regardless of findings.

**Log format:**

- If early exit: `"Round {N}: {count} findings (all resolved). Rounds {N+1}–5 skipped — plan meets depth thresholds."`
- If continuing: `"Round {N}: {count} findings ({resolved} resolved, {open} open). Proceeding to Round {N+1}."`

---

## Feedback Loop: Hardening → Regeneration

When hardening rounds find failing specs, the fix process is:

1. **Identify** — List all specs scoring below elevated thresholds with specific failing sections
2. **Regenerate** — Use `10-generators/REGENERATOR.md` to expand ONLY the failing sections (not full rewrite)
3. **Re-score** — Run depth scorer again on regenerated specs
4. **Verify** — If score now meets threshold, mark resolved. If not, escalate to human.
5. **Continue** — Only proceed to next hardening round after all findings from current round are resolved

This creates a closed loop: hardening finds problems → generators fix them → hardening verifies the fix. No findings are deferred or ignored.
