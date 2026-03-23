# Change Request Process

> **Purpose:** Formal process for scope changes after planning is complete in {{PROJECT_NAME}}.
> Once the planning phase ends (ORCHESTRATOR Step 16+), any addition, removal, or modification of scope must follow this process.
> This prevents scope creep from silently derailing the project.

---

## When This Process Applies

| Situation | Process Required? |
|-----------|-------------------|
| Bug fix for existing planned feature | No — tracked in bug tracker |
| Clarification of existing requirement (no new work) | No — update the spec directly |
| New feature not in original scope | **Yes** |
| Significant redesign of a planned feature | **Yes** |
| Removing a planned feature from MVP | **Yes** |
| Adding a new integration or third-party dependency | **Yes** |
| Changing data model in a way that affects multiple services | **Yes** |
| Changing a deadline or milestone | **Yes** |

---

## Change Request Template

Copy this template for each change request. File at: `dev_docs/change-requests/CR-{NUMBER}.md`

```markdown
# CR-{{CR_NUMBER}}: {{CR_TITLE}}

**Requested by:** {{CR_REQUESTOR}}
**Date:** {{CR_DATE}}
**Status:** Proposed | Approved | Rejected | Deferred

## What

Describe the change in 2-5 sentences. Be specific about what is being added, modified, or removed.

## Why

Business justification. Why is this change necessary NOW vs. post-launch?
- What problem does it solve?
- What happens if we don't do this?
- Is there a simpler alternative?

## Impact Assessment

### Affected Documents
| Document | Change Required |
|----------|----------------|
| Service spec: {{SERVICE}} | {{CHANGE_DESCRIPTION}} |
| Screen spec: {{SCREEN}} | {{CHANGE_DESCRIPTION}} |
| Task files | {{NEW_TASKS_NEEDED}} |
| Database schema | {{SCHEMA_CHANGES}} |
| API contracts | {{CONTRACT_CHANGES}} |

### Effort Estimate
| Item | Estimate |
|------|----------|
| Planning updates | {{HOURS}} hours |
| Implementation | {{HOURS}} hours |
| Testing | {{HOURS}} hours |
| **Total** | **{{TOTAL_HOURS}} hours** |

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| {{RISK_DESCRIPTION}} | {{LOW_MED_HIGH}} | {{LOW_MED_HIGH}} | {{MITIGATION}} |

### Dependencies
- Blocks: {{BLOCKED_TASKS}}
- Blocked by: {{BLOCKING_TASKS}}
- Affects timeline: {{YES_NO}}

## Decision
**Decision:** Approved / Rejected / Deferred
**Decided by:** {{DECIDER}}
**Date:** {{DECISION_DATE}}
**Rationale:** {{DECISION_RATIONALE}}
```

---

## Impact Categories

| Category | Criteria | Approval Required | Timeline |
|----------|----------|-------------------|----------|
| **No Impact** | Clarification only, no new work. Total effort < 1 hour. | None — proceed immediately | Same day |
| **Minor** | < {{MINOR_THRESHOLD_HOURS}} hours total effort. Affects 1-2 documents. No new dependencies. | Team lead approval | 1 business day |
| **Major** | > {{MAJOR_THRESHOLD_HOURS}} hours total effort, OR affects 3+ documents, OR adds new dependency, OR changes data model across services | Mini-tribunal required (see below) | 2-3 business days |
| **Critical** | Changes project timeline, OR removes a committed feature, OR requires new infrastructure | Full stakeholder review | 1 week |

### Mini-Tribunal Process (Major Changes)

1. **Requestor** submits CR with full impact assessment
2. **Tech lead** reviews technical feasibility and effort estimate (adjusts if needed)
3. **Product owner** reviews business justification and priority vs. existing roadmap
4. **Meeting** (30 min max): Requestor presents, tech lead presents impact, product owner decides
5. **Decision** recorded in the CR file with rationale
6. If approved: tasks created, sprint plan updated, STATUS.md updated

---

## Change Log

Track all approved changes here for audit trail and retrospective.

| CR # | Title | Category | Effort | Sprint Impact | Status |
|------|-------|----------|--------|---------------|--------|
| CR-001 | {{CR_TITLE}} | {{CATEGORY}} | {{HOURS}}h | {{SPRINT_IMPACT}} | {{STATUS}} |
| CR-002 | {{CR_TITLE}} | {{CATEGORY}} | {{HOURS}}h | {{SPRINT_IMPACT}} | {{STATUS}} |
<!-- Append new rows as CRs are processed. -->

### Change Velocity Tracking

| Sprint | Planned Capacity (hours) | Unplanned Work (hours) | Unplanned % | Status |
|--------|--------------------------|----------------------|-------------|--------|
| {{SPRINT_NUMBER}} | {{PLANNED_HOURS}} | {{UNPLANNED_HOURS}} | {{PERCENTAGE}}% | {{OK_OR_REVIEW}} |

---

## Scope Creep Detection

### Automatic Trigger

**Rule:** If >{{SCOPE_CREEP_THRESHOLD_PCT}}% of sprint capacity goes to unplanned work (approved CRs + unplanned bug fixes), trigger a scope review.

Default threshold: **10%** of sprint capacity.

### Scope Review Process

When the threshold is breached:

1. **Pause** new change requests (except P0 bugs)
2. **Calculate** total unplanned work in the current sprint
3. **Categorize** unplanned work:
   - Was it truly unforeseeable? → Planning gap — improve estimation
   - Was it a "small request" that grew? → Process gap — enforce CR process
   - Was it poorly scoped originally? → Spec gap — improve spec depth
4. **Decide:**
   - Absorb into current sprint (if buffer exists)
   - Defer lowest-priority planned work to next sprint
   - Extend sprint (last resort, requires stakeholder communication)
5. **Document** the outcome and lessons in the change log

### Warning Signs of Scope Creep

| Signal | What It Means | Action |
|--------|--------------|--------|
| Multiple "quick" CRs per sprint | Death by a thousand cuts | Batch CRs, evaluate cumulative impact |
| CRs that grow after approval | Poor initial impact assessment | Require more detailed assessments |
| Same requestor submitting 3+ CRs | Feature not well-defined originally | Revisit the original spec with the requestor |
| CRs that affect >3 services | Architectural-level change disguised as a feature | Escalate to Critical category |

---

## Integration with Project Tools

| Tool | Integration |
|------|------------|
| STATUS.md | Approved CRs create new tasks, added to the appropriate phase |
| Sprint plan | Approved Minor/Major CRs added to current or next sprint |
| Traceability matrix | New tasks from CRs linked to the originating CR |
| Stakeholder reports | Major/Critical CRs reported in next stakeholder update |

---

## Completeness Checklist

- [ ] All team members know the CR process exists and when to use it
- [ ] CR template is accessible and filled out completely for each request
- [ ] Change log is maintained and reviewed in sprint retrospectives
- [ ] Scope creep threshold is configured and monitored
- [ ] Approved CRs result in updated specs, tasks, and sprint plans
