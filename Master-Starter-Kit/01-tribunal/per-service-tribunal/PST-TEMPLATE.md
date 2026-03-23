# Per-Service Tribunal: {{SERVICE_NAME}}

> **Service:** {{SERVICE_NAME}} | **Tier:** {{PRIORITY_TIER}} | **Audit Depth:** Full 5-Phase + 5-Round Tribunal
> **Auditor:** {{AUDITOR_NAME}} | **Date:** {{AUDIT_DATE}} | **Session:** {{SESSION_NUMBER}}

---

## Phase 1: Hub File Verification

Compare every section of the service hub file against the actual codebase. The hub is only useful if it reflects reality.

### 1A. Status Box Accuracy

| Field | Hub Claims | Verified | Match? |
|-------|-----------|----------|--------|
| Health Score | | | |
| Backend Status | | | |
| Frontend Status | | | |
| Test Status | | | |
| Active Blockers | | | |
| Last Verified | | | |

### 1B. Implementation Status

| Layer | Hub Claims | Verified | Delta |
|-------|-----------|----------|-------|
| Design Specs | | | |
| Backend Models | | | |
| Backend Endpoints | | | |
| Frontend Pages | | | |
| Frontend Components | | | |
| Hooks | | | |
| Tests | | | |
| Security | | | |

### 1C. Screen Verification

| Route | Hub Status | Actual Status | Quality Claimed | Quality Verified | Notes |
|-------|-----------|---------------|-----------------|-----------------|-------|
| | | | | | |

**Verification method:** Navigate to each route, check for real implementation vs stub/placeholder.

### 1D. Endpoint Verification

| Method | Path | Hub Status | Actual Status | Notes |
|--------|------|-----------|---------------|-------|
| | | | | |

**Verification method:** `grep -r "controller\|@Get\|@Post\|@Put\|@Delete\|@Patch"` in the service module.

### 1E. Component & Hook Verification

- **Components claimed in hub:** _count_
- **Components found in code:** _count_
- **Hooks claimed in hub:** _count_
- **Hooks found in code:** _count_
- **Missing from hub:** _list_
- **In hub but not in code (phantom):** _list_

### 1F. Data Model Verification

| Model | Hub Claims | Schema Actual | Errors |
|-------|-----------|---------------|--------|
| | | | |

**Common errors:** Phantom fields, missing relations, wrong types, missing enums, junction tables not documented.

---

## Phase 2: Code Quality Assessment

### 2A. Security Audit

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard on all endpoints | | |
| Role-based access control | | |
| Input validation (DTOs) | | |
| Tenant isolation (multi-tenant) | | |
| Soft-delete filtering | | |
| SQL injection prevention | | |
| XSS prevention | | |
| CSRF protection | | |
| Credential encryption | | |
| Rate limiting | | |

**Security Score:** _/10_

### 2B. Code Health Metrics

| Metric | Value |
|--------|-------|
| Total LOC (backend) | |
| Total LOC (frontend) | |
| Largest file (path + LOC) | |
| Cyclomatic complexity (worst) | |
| Duplicate code instances | |
| TODO/FIXME/HACK count | |

### 2C. API Contract Compliance

- **Response envelope format:** Does it match `{ data: T }` / `{ data: T[], pagination }` pattern?
- **Error format:** Does it match standard error envelope?
- **HTTP status codes:** Correct usage (201 for create, 204 for delete, etc.)?

### 2D. Hook Quality (Frontend)

| Hook | Unwraps envelope? | Error handling? | Loading state? | Notes |
|------|-------------------|-----------------|----------------|-------|
| | | | | |

### 2E. Test Assessment

| Test Type | Count | Quality | Coverage |
|-----------|-------|---------|----------|
| Unit (backend) | | | |
| Unit (frontend) | | | |
| Integration | | | |
| E2E | | | |

**Test Quality Tier:** Empty Shell / Basic Assertions / Comprehensive

---

## Phase 3: Business Logic Verification

### 3A. Business Rules vs Code

| Rule | Documented? | Implemented? | Tested? | Notes |
|------|------------|--------------|---------|-------|
| | | | | |

### 3B. Validation Rules vs DTOs

| Field | Documented Rule | DTO Validation | Match? |
|-------|----------------|----------------|--------|
| | | | |

### 3C. Status State Machine

| From State | To State | Guard/Condition | Implemented? |
|-----------|----------|-----------------|--------------|
| | | | |

### 3D. Dependencies Verification

| Dependency | Expected | Actual | Status |
|-----------|----------|--------|--------|
| | | | |

---

## Phase 4: 5-Round Adversarial Tribunal

### Round 1: Charge & Opening Arguments

**PROSECUTION** (argue the service is NOT production-ready):

1. _[Argument with evidence]_
2. _[Argument with evidence]_
3. _[Argument with evidence]_
4. _[Argument with evidence]_
5. _[Argument with evidence]_

**DEFENSE** (argue the service IS production-ready or on track):

1. _[Counter-argument with evidence]_
2. _[Counter-argument with evidence]_
3. _[Counter-argument with evidence]_
4. _[Counter-argument with evidence]_
5. _[Counter-argument with evidence]_

### Round 2: Rebuttal

**PROSECUTION REBUTTAL:**

1. _[Rebuttal to defense point]_
2. _[Rebuttal to defense point]_
3. _[Rebuttal to defense point]_

**DEFENSE REBUTTAL:**

1. _[Rebuttal to prosecution point]_
2. _[Rebuttal to prosecution point]_
3. _[Rebuttal to prosecution point]_

### Round 3: Cross-Examination

| Question | Finding | Severity |
|----------|---------|----------|
| 1. | | |
| 2. | | |
| 3. | | |
| 4. | | |
| 5. | | |

### Round 4: Evidence Exhibits & Closing Statements

**KEY EXHIBITS:**

| # | Exhibit | File Path | Finding |
|---|---------|-----------|---------|
| E1 | | | |
| E2 | | | |
| E3 | | | |

**PROSECUTION CLOSING:** _[Summary of why verdict should be MODIFY or REVERSE]_

**DEFENSE CLOSING:** _[Summary of why verdict should be AFFIRM or MODIFY with limited scope]_

### Round 5: Binding Verdict

**VERDICT:** _AFFIRM / MODIFY / REVERSE / DEFER_

**Hub Score (before audit):** _/10_
**Verified Score (after audit):** _/10_
**Delta:** _+/-_

**Rationale:** _[Why this verdict was reached]_

---

## Phase 5: Outputs & Corrections

### 5A. Hub File Corrections Required

| # | Section | Current (Wrong) | Corrected | Reason |
|---|---------|----------------|-----------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### 5B. Action Items

| Priority | Action | Effort | Sprint |
|----------|--------|--------|--------|
| P0 (STOP-SHIP) | | | |
| P0 | | | |
| P1 | | | |
| P2 | | | |

### 5C. New Tasks Generated

| Task ID | Description | Effort | Depends On |
|---------|-------------|--------|-----------|
| | | | |

### 5D. ADR Candidates

| Topic | Recommendation | Rationale |
|-------|---------------|-----------|
| | | |

### 5E. Cross-Service Findings

_Findings that affect 3+ services get promoted to Cross-Cutting Findings (CCF). Document here first, then promote._

| Finding | Affected Services | Severity | CCF Candidate? |
|---------|------------------|----------|---------------|
| | | | |

### 5F. Updated Dependency Map

```mermaid
graph TD
    {{SERVICE_NAME}} --> DEP1[Dependency 1]
    {{SERVICE_NAME}} --> DEP2[Dependency 2]
```
