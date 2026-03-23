# Dependency Map — Plain English

> **Project:** {{PROJECT_NAME}}
> **Version:** {{VERSION_NUMBER}} | **Date:** {{REPORT_DATE}}
> **Prepared by:** {{AUTHOR_NAME}}

---

## What Is a Dependency?

**Some features cannot start until others are finished.** Just like you cannot paint walls before the drywall is up, some parts of the software must be built in a specific order.

---

## Dependency Chain

Here is the build order and why it matters, in plain English:

### Phase {{PHASE_0_NUMBER}}: Foundation

1. **{{FOUNDATION_1_NAME}}** — {{FOUNDATION_1_WHY_FIRST_PLAIN_ENGLISH}}
2. **{{FOUNDATION_2_NAME}}** — {{FOUNDATION_2_WHY_FIRST_PLAIN_ENGLISH}}

> _Nothing else can start until these are done. Think of them as the foundation of a house._

### Phase {{PHASE_1_NUMBER}}: Core Features

3. **{{CORE_FEATURE_1_NAME}}** and **{{CORE_FEATURE_2_NAME}}** can happen **at the same time** because they both build on the foundation but do not depend on each other.
4. **{{CORE_FEATURE_3_NAME}}** depends on **{{CORE_FEATURE_1_NAME}}** being done first, because {{DEPENDENCY_REASON_PLAIN_ENGLISH}}.

### Phase {{PHASE_2_NUMBER}}: Advanced Features

5. **{{ADVANCED_FEATURE_1_NAME}}** depends on both **{{CORE_FEATURE_2_NAME}}** and **{{CORE_FEATURE_3_NAME}}** being complete.
6. **{{ADVANCED_FEATURE_2_NAME}}** can start as soon as **{{CORE_FEATURE_3_NAME}}** is done.

> _The further down this list, the more things must be finished first. That is why these features come later — not because they are less important._

---

## Critical Path

**The critical path is the longest chain of dependent features.** If anything on this path slips, the entire project end date moves.

**Our critical path:**

{{CRITICAL_PATH_FEATURE_1}} → {{CRITICAL_PATH_FEATURE_2}} → {{CRITICAL_PATH_FEATURE_3}} → {{CRITICAL_PATH_FEATURE_4}}

**What this means:** These features MUST stay on schedule, or the whole project shifts. Other features have some flexibility (called "slack") — these do not.

| Critical Path Feature | Target Completion | Status | Slack |
|----------------------|-------------------|--------|-------|
| {{CRITICAL_PATH_FEATURE_1}} | {{CP1_TARGET_DATE}} | {{GREEN_YELLOW_RED}} | None (critical) |
| {{CRITICAL_PATH_FEATURE_2}} | {{CP2_TARGET_DATE}} | {{GREEN_YELLOW_RED}} | None (critical) |
| {{CRITICAL_PATH_FEATURE_3}} | {{CP3_TARGET_DATE}} | {{GREEN_YELLOW_RED}} | None (critical) |
| {{CRITICAL_PATH_FEATURE_4}} | {{CP4_TARGET_DATE}} | {{GREEN_YELLOW_RED}} | None (critical) |

**Status key:**
- `[GREEN] On track` — proceeding as planned
- `[YELLOW] At risk` — behind schedule or facing issues, mitigation in progress
- `[RED] Blocked` — stopped, requires immediate action

---

## External Dependencies

These are things we need from outside our team:

| What | Provider / Team | Status | Expected By | Risk if Delayed |
|------|----------------|--------|-------------|-----------------|
| {{EXTERNAL_DEP_1}} | {{EXTERNAL_DEP_1_PROVIDER}} | {{GREEN_YELLOW_RED}} | {{EXTERNAL_DEP_1_DATE}} | {{EXTERNAL_DEP_1_RISK}} |
| {{EXTERNAL_DEP_2}} | {{EXTERNAL_DEP_2_PROVIDER}} | {{GREEN_YELLOW_RED}} | {{EXTERNAL_DEP_2_DATE}} | {{EXTERNAL_DEP_2_RISK}} |
| {{EXTERNAL_DEP_3}} | {{EXTERNAL_DEP_3_PROVIDER}} | {{GREEN_YELLOW_RED}} | {{EXTERNAL_DEP_3_DATE}} | {{EXTERNAL_DEP_3_RISK}} |

---

## Visual Dependency Diagram

For a visual version of this dependency map, see:

`dev_docs/comms/diagrams/dependency-graph.md`

> The diagram shows the same information as this document but in a flowchart format. Arrows mean "must be done before." Items on the same horizontal level can happen in parallel.

---

_Last updated: {{LAST_UPDATED_DATE}} | Changes to dependencies are communicated within {{DEPENDENCY_CHANGE_SLA}} of discovery._
