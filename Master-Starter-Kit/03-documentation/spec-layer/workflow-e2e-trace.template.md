# Workflow End-to-End Traces — {{PROJECT_NAME}}

> **Generated at:** Step 6.8
> **Source:** `10-generators/WORKFLOW-E2E-TRACE-GENERATOR.md`
> **Cross-references:** Screen catalog (Step 6), API contracts (Step 10), database schema (Step 5)

---

## Workflow Index

| # | Workflow Name | Personas | Services Crossed | Steps | Criticality | Status |
|---|-------------|----------|------------------|-------|-------------|--------|
| 1 | {{workflow_name}} | {{roles}} | {{N}} | {{N}} | {{Critical/High/Medium/Low}} | ☐ Traced |
| 2 | {{workflow_name}} | {{roles}} | {{N}} | {{N}} | {{level}} | ☐ Traced |

---

## Core Business Workflows

### Workflow 1: {{WORKFLOW_NAME}}

**Trigger:** {{what starts this workflow}}
**Personas involved:** {{roles}}
**Services touched:** {{service list}}
**Estimated frequency:** {{per day/week}}
**Criticality:** {{level}}

#### Happy Path

| Step | User Action | Screen | API Call | Data Change | Next Step | Notes |
|------|------------|--------|---------|-------------|-----------|-------|
| 1 | | | | | → Step 2 | |
| 2 | | | | | → Step 3 | |
| 3 | | | | | → Step 4 | |
| 4 | | | | | → Step 5 | |
| 5 | | | | | ✓ Complete | |

#### Error Branches

| At Step | Error Condition | User Sees | Recovery Path | Data Rollback? |
|---------|----------------|-----------|---------------|----------------|
| | | | | |

#### Abandonment Behavior

| At Step | If User Abandons | Data State | Can Resume? | Resume Point |
|---------|-----------------|------------|-------------|--------------|
| | | | | |

#### Gaps Found
- [ ] None

---

> Repeat for all 15+ workflows.

---

## Cross-Reference Verification Results

### Missing Screens (referenced in workflows but no screen spec exists)
- [ ] None found
- {{list missing screens}}

### Missing API Endpoints (referenced in workflows but no contract exists)
- [ ] None found
- {{list missing endpoints}}

### Phantom Data Changes (referenced entities not in schema)
- [ ] None found
- {{list phantom entities}}

### Broken Service Chains (handoff point missing on one side)
- [ ] None found
- {{list broken chains}}

### Silent Failures (error branches with no user-visible state)
- [ ] None found
- {{list silent failures}}

---

## Summary

| Metric | Count | Target | Status |
|--------|-------|--------|--------|
| Workflows traced | {{N}} | ≥15 | ☐ Pass / ☐ Fail |
| Avg steps per workflow | {{N}} | ≥5 | ☐ Pass / ☐ Fail |
| Cross-service workflows | {{N}} | ≥5 | ☐ Pass / ☐ Fail |
| Missing screens found | {{N}} | 0 | ☐ Pass / ☐ Fail |
| Missing endpoints found | {{N}} | 0 | ☐ Pass / ☐ Fail |
| Broken chains found | {{N}} | 0 | ☐ Pass / ☐ Fail |
