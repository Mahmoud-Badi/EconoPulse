# Workflow End-to-End Trace Generator

> **Purpose:** Traces every major workflow in the system from start to finish: step → screen → user action → API call → data change → next step.
> **Output:** `dev_docs/completeness/workflow-e2e-traces.md`
> **Step:** 6.8
> **Minimum:** 15 workflows, each with ≥5 steps, each step mapped to screen + API + error branch

---

## Pre-Generation Reasoning (Mandatory)

Before generating traces, answer:

1. **What are ALL the workflows in this system?** List every user journey that starts with an intent and ends with an outcome. Include happy paths AND error/abort paths.
2. **Which workflows cross service boundaries?** These are the highest-risk workflows — they're where integration bugs live.
3. **Which workflows have regulatory/compliance implications?** These need extra detail on audit trails and data handling.
4. **Which workflows are time-critical?** (e.g., dispatch, payment processing, emergency alerts) These need latency annotations.

---

## Output Format

### Per Workflow

```markdown
## Workflow: {{WORKFLOW_NAME}}

**Trigger:** {{what starts this workflow — user action, system event, scheduled job}}
**Personas involved:** {{which roles participate}}
**Services touched:** {{list of services crossed}}
**Estimated frequency:** {{per day/week — helps prioritize testing}}
**Criticality:** {{Critical / High / Medium / Low}}

### Happy Path

| Step | User Action | Screen | API Call | Data Change | Next Step | Notes |
|------|------------|--------|---------|-------------|-----------|-------|
| 1 | {{what user does}} | {{screen name}} | {{POST /api/...}} | {{what changes in DB}} | → Step 2 | |
| 2 | {{what user does}} | {{screen name}} | {{GET /api/...}} | {{what changes}} | → Step 3 | |
| ... | | | | | | |
| N | {{final action}} | {{screen name}} | {{PUT /api/...}} | {{final state}} | ✓ Complete | |

### Error Branches

| At Step | Error Condition | User Sees | Recovery Path | Data Rollback? |
|---------|----------------|-----------|---------------|----------------|
| 2 | {{what goes wrong}} | {{error message/screen}} | {{how to recover}} | {{yes/no — what rolls back}} |
| 4 | {{what goes wrong}} | {{error message/screen}} | {{how to recover}} | {{yes/no}} |

### Abandonment Behavior

| At Step | If User Abandons | Data State | Can Resume? | Resume Point |
|---------|-----------------|------------|-------------|--------------|
| 2 | {{what happens to partial data}} | {{draft/discarded/orphaned}} | {{yes/no}} | {{where they pick up}} |
| 4 | {{what happens}} | {{state}} | {{yes/no}} | {{where}} |

### Gaps Found

- [ ] Step {{N}} has no screen spec
- [ ] Step {{N}} has no API endpoint defined
- [ ] Step {{N}} has no error handling specified
- [ ] Cross-service handoff at Step {{N}} has no contract
```

---

## Workflow Categories to Cover

### Core Business Workflows (Required — typically 8-12)
These are the primary workflows that define what the product does.

Examples by domain:
- **SaaS:** User signup → onboarding → first value → ongoing use → billing
- **EMS:** 911 call → dispatch → response → patient care → transport → handoff → billing
- **E-commerce:** Browse → search → add to cart → checkout → payment → fulfillment → return
- **Logistics:** Order received → route planning → dispatch → pickup → transport → delivery → POD

### Administrative Workflows (Required — typically 3-5)
- User/role management
- Configuration/settings
- Reporting/analytics
- Audit/compliance review

### Edge Case Workflows (Required — typically 3-5)
- Error recovery
- Data correction/undo
- Bulk operations
- Offline → online sync
- Permission escalation

---

## Cross-Reference Verification

After generating all traces:

1. **Every screen referenced** must exist in the screen catalog (Step 6). Flag missing screens.
2. **Every API call referenced** must exist in the API contract registry (Step 10). Flag missing endpoints.
3. **Every data change referenced** must map to a database entity (Step 5 schema). Flag phantom tables.
4. **Every error branch** must have a user-visible error state. Flag silent failures.
5. **Every service boundary crossing** must have matching endpoints on both sides. Flag broken chains.

---

## Depth Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Total workflows traced | 15 | 20-30 |
| Steps per workflow (avg) | 5 | 7-10 |
| Error branches per workflow | 2 | 3-5 |
| Cross-service workflows | 5 | 8-12 |
| Gaps found and flagged | Document all | Resolve before Step 8 |
