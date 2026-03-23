# Test Requirements Card

> Fill out this card per-feature BEFORE coding starts. This is the contract that defines which tests must be written and proven for this feature to pass the Feature Gate.

---

## Feature Information

| Field | Value |
|-------|-------|
| **Feature Name** | {{FEATURE_NAME}} |
| **Description** | {{FEATURE_DESCRIPTION}} |
| **Service Spec** | {{SERVICE_SPEC_REFERENCE}} |
| **Screen Spec(s)** | {{SCREEN_SPEC_REFERENCES}} |
| **Phase** | {{PHASE_NUMBER}} |
| **Author** | {{AUTHOR_NAME}} |
| **Date Created** | {{DATE_CREATED}} |

---

## Step 1: Feature Characteristics Checklist

Check all that apply to this feature. Each checked characteristic triggers required test types in Step 2.

| # | Characteristic | Check |
|---|---------------|-------|
| C1 | Has business logic (calculations, validations, rules) | ☐ |
| C2 | Has a database (schema, queries, migrations) | ☐ |
| C3 | Has an API endpoint (REST, tRPC, GraphQL) | ☐ |
| C4 | Has a user interface (pages, forms, components) | ☐ |
| C5 | Has user input (forms, search, file uploads) | ☐ |
| C6 | Has authentication or authorization | ☐ |
| C7 | Handles money, billing, or financial data | ☐ |
| C8 | Integrates with third-party services | ☐ |
| C9 | Modifies an existing feature or flow | ☐ |
| C10 | Will serve >100 concurrent users | ☐ |
| C11 | Has multi-language or RTL support | ☐ |
| C12 | Runs as a distributed system or microservice | ☐ |
| C13 | Involves data migration or schema changes on existing data | ☐ |
| C14 | Is user-facing (not internal/admin only) | ☐ |
| C15 | Has offline or poor-connectivity scenarios | ☐ |

**Characteristics checked:** {{COUNT}} / 15
**Expected complexity:** {{COMPLEXITY_LEVEL}} (Simple: 1-3 | Medium: 4-7 | Complex: 8-11 | Critical: 12+)

---

## Step 2: Required Test Types

Based on the checked characteristics, these test types are required. Refer to the [Test Selection Matrix](../testing-catalog/test-selection-matrix.md) to populate this table.

### Tier 1 — Foundation
| Test Type | Required | Triggered By | Status | Proof Artifact Link | Notes |
|-----------|----------|-------------|--------|-------------------|-------|
| Unit Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Type Checking | ☐ | Always | Not Started | | |
| Linting | ☐ | Always | Not Started | | |
| Snapshot Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |

### Tier 2 — Integration
| Test Type | Required | Triggered By | Status | Proof Artifact Link | Notes |
|-----------|----------|-------------|--------|-------------------|-------|
| Integration Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| API Contract Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Database Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Component Integration | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Regression Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |

### Tier 3 — System
| Test Type | Required | Triggered By | Status | Proof Artifact Link | Notes |
|-----------|----------|-------------|--------|-------------------|-------|
| E2E Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Visual Regression | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Accessibility Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Cross-Browser Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Responsive Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Compatibility Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| UAT Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |

### Tier 4 — Specialized
| Test Type | Required | Triggered By | Status | Proof Artifact Link | Notes |
|-----------|----------|-------------|--------|-------------------|-------|
| Load/Performance | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Security Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Chaos Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Smoke Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Sanity Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Mutation Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Contract Tests (Pact) | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Data Migration Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| i18n Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| State Recovery Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |
| Rate Limit Tests | ☐ | {{TRIGGERING_CHARACTERISTICS}} | Not Started | | |

**Required test types:** {{REQUIRED_COUNT}} / 27
**Status key:** Not Started | In Progress | Passing | Skipped (with justification)

---

## Step 3: Skipped Test Justification

If any required test type is marked "Skipped," document the justification here. Skipping a required test type requires explicit approval.

| Test Type | Reason for Skipping | Risk Accepted | Approved By | Date |
|-----------|-------------------|---------------|-------------|------|
| {{TEST_TYPE}} | {{JUSTIFICATION}} | {{RISK_DESCRIPTION}} | {{APPROVER}} | {{DATE}} |

**Rules for skipping:**
- Type Checking and Linting can NEVER be skipped
- Security Tests can NEVER be skipped for features with C6 or C7
- E2E Tests can NEVER be skipped for features with C14 (user-facing)
- All other skips require documented justification and explicit approval
- "We don't have time" is not a valid justification — reschedule instead

---

## Step 4: Sign-Off

This card is complete when all required test types have status "Passing" (with proof artifact links) or "Skipped" (with approved justification).

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **Developer** | {{DEVELOPER_NAME}} | {{DATE}} | ☐ All required tests passing or justified |
| **Reviewer** | {{REVIEWER_NAME}} | {{DATE}} | ☐ Proof artifacts verified, justifications accepted |

---

## Card Status

| Milestone | Date | Notes |
|-----------|------|-------|
| Card created | {{DATE_CREATED}} | |
| Development started | {{DATE_DEV_START}} | |
| All tests passing | {{DATE_TESTS_PASS}} | |
| Review complete | {{DATE_REVIEW}} | |
| Feature Gate passed | {{DATE_GATE_PASS}} | |
