# Cross-Reference Validator

> **Purpose:** Automated consistency audit that cross-references all planning documents in {{PROJECT_NAME}}.
> Ensures every reference in every document points to something that actually exists, and every entity is tracked across all catalogs.
>
> **Output:** `dev_docs/completeness/consistency-audit.md`
> **Run by:** A separate "auditor" agent (NOT the agent that generated the specs). See Adversarial Verification below.

---

## When to Run

| Trigger | Scope |
|---------|-------|
| After Step 5 (Service Specs) | Checks 1-5 |
| After Step 6 (Screen Specs) | Checks 1-7 |
| After Step 8 (Task Generation) | Checks 4-5 |
| After Step 14.9 (Integrations) | Check 10 |
| After Step 16 (Handoff) | All 12 checks — full audit |
| After Step 16.5 (Quality Gates) | All 12 checks — full audit before SB-4 |
| Before each release | All 12 checks — regression audit |

---

## Validation Checks

### Check 1: API Endpoints → API Contract Registry

**Source:** Every endpoint listed in `dev_docs/specs/services/*.md` (Section 5: API Endpoints)
**Target:** `dev_docs/specs/contracts/api-catalog.md`

**Validation rule:** For each endpoint (METHOD + PATH) in a service spec, a matching entry must exist in the API contract registry.

**How to check:**
1. Parse all service spec files, extract every row from Section 5 tables
2. Parse the API catalog, extract every registered endpoint
3. Compare: every service spec endpoint must appear in the catalog
4. Also check reverse: every catalog entry should trace back to a service spec

**Failure output:**
```
CHECK 1: API Endpoints → API Catalog
Status: FAIL (3 mismatches)
  MISSING IN CATALOG:
    - POST /api/loads/bulk-assign (from load-management.md)
    - GET /api/reports/daily-summary (from reporting.md)
  ORPHAN IN CATALOG (no service spec):
    - DELETE /api/temp-files/:id (in catalog but no service spec references it)
```

---

### Check 2: Screens → Screen Catalog

**Source:** Every screen referenced in `dev_docs/specs/services/*.md` (any section mentioning screen names/routes)
**Target:** `dev_docs/specs/screens/screen-catalog.md`

**Validation rule:** Every screen name or route mentioned in a service spec must have a matching entry in the screen catalog.

**How to check:**
1. Parse service specs for screen references (look for route patterns like `/dashboard`, `/loads/:id`, or screen names like "Load Detail Screen")
2. Parse the screen catalog for registered screens
3. Compare: every referenced screen must exist in the catalog
4. Check reverse: every catalog screen should be referenced by at least one service spec

---

### Check 3: Database Tables → Database Schema Docs

**Source:** Every entity/table in `dev_docs/specs/services/*.md` (Section 4: Data Model)
**Target:** `dev_docs/specs/database/` schema documentation files

**Validation rule:** Every entity defined in a service spec's data model must have a corresponding table/model documented in the database schema docs.

**How to check:**
1. Parse service specs, extract entity names from Section 4 headers and table names
2. Parse database schema docs for documented tables/models
3. Compare: every service spec entity must appear in schema docs
4. Check reverse: every schema doc table should trace to a service spec

---

### Check 4: Task IDs → Task Files on Disk

**Source:** Every task ID in `dev_docs/STATUS.md` (master tracker)
**Target:** Task files at `dev_docs/tasks/{{PHASE_PREFIX}}/{{TASK_ID}}.md`

**Validation rule:** Every task ID listed in STATUS.md must have a corresponding task file on disk.

**How to check:**
1. Parse STATUS.md, extract all task IDs (format: `{{TASK_ID_FORMAT}}`)
2. Glob for all task files on disk
3. Compare: every STATUS.md task ID must have a file; every file must appear in STATUS.md

**Failure output:**
```
CHECK 4: Task IDs → Task Files
Status: FAIL (2 mismatches)
  MISSING FILE:
    - TASK-042 (listed in STATUS.md Phase 2, no file at dev_docs/tasks/phase-2/TASK-042.md)
  ORPHAN FILE:
    - dev_docs/tasks/phase-1/TASK-099.md (file exists but not listed in STATUS.md)
```

---

### Check 5: Gap IDs → Task Mapping

**Source:** Every gap ID in `dev_docs/completeness/traceability-matrix.md`
**Target:** Task files that address each gap

**Validation rule:** Every gap identified in the traceability matrix must map to at least one task that addresses it.

**How to check:**
1. Parse traceability matrix for gap IDs and their status
2. For each gap marked as "addressed," verify the linked task ID exists
3. For each gap marked as "open," flag as an outstanding issue

---

### Check 6: Components → Component Catalog

**Source:** Every component referenced in `dev_docs/specs/screens/*.md` (Component Tree sections)
**Target:** `dev_docs/specs/components/component-catalog.md`

**Validation rule:** Every component name referenced in a screen spec must exist in the component catalog.

**How to check:**
1. Parse screen specs, extract component names from Component Tree sections
2. Parse component catalog for registered components
3. Compare: every referenced component must exist in the catalog
4. Flag components referenced in 3+ screens but not in the shared library (extraction candidates)

---

### Check 7: Permissions → Permission Catalog

**Source:** Every permission in auth matrices within `dev_docs/specs/services/*.md`
**Target:** `dev_docs/specs/catalogs/permission-catalog.md`

**Validation rule:** Every permission key or role-operation pair in a service spec's auth matrix must have a matching entry in the permission catalog.

**How to check:**
1. Parse service specs, extract permission entries from auth matrix sections
2. Parse permission catalog for registered permission keys
3. Compare: every service spec permission must appear in the catalog
4. Check reverse: every catalog permission should trace to a service spec

---

### Check 8: Notification Triggers → Notification Catalog

**Source:** Every notification trigger in `dev_docs/specs/services/*.md` (anywhere "notify," "email," "alert," "push notification" is mentioned)
**Target:** `dev_docs/specs/catalogs/notification-catalog.md`

**Validation rule:** Every notification described or triggered in a service spec must have a matching entry in the notification catalog.

**How to check:**
1. Parse service specs for notification references (keyword search: "notify", "notification", "email", "SMS", "push", "alert the user")
2. Parse notification catalog for registered notifications
3. Compare: every trigger must map to a catalog entry

---

### Check 9: Error Codes → Error Catalog

**Source:** Every error code in `dev_docs/specs/services/*.md` (Section 10: Error Scenarios, validation tables)
**Target:** `dev_docs/specs/catalogs/error-catalog.md`

**Validation rule:** Every error code or error scenario in a service spec must have a matching code in the error catalog.

**How to check:**
1. Parse service specs for error codes (look for `SERVICE_ERROR_TYPE` format) and error scenario descriptions
2. Parse error catalog for registered error codes
3. Compare: every service spec error must appear in the catalog
4. Check reverse: every catalog error should trace to a service spec

---

### Check 10: Integrations → Integration Health Catalog

**Source:** Every external service/API referenced in `dev_docs/specs/services/*.md` and `dev_docs/specs/tech-stack.md`
**Target:** `dev_docs/specs/catalogs/integration-health-catalog.md`

**Validation rule:** Every third-party service, external API, or infrastructure dependency must have a monitoring entry in the integration health catalog.

**How to check:**
1. Parse service specs and tech stack docs for external service references
2. Parse integration health catalog for registered integrations
3. Compare: every external dependency must have a health check and fallback strategy

---

### Check 11: Integration Failure Specs → Error Catalog

**Source:** Every error code in `dev_docs/specs/integrations/failure-specs/*.md` (Per-Error-Code Handling tables)
**Target:** `dev_docs/specs/catalogs/error-catalog.md`

**Validation rule:** Every error code referenced in an integration failure spec must have a matching entry in the error catalog.

**How to check:**
1. Parse all integration failure spec files, extract error codes from Per-Error-Code Handling tables (column "Our Error Code")
2. Parse the error catalog for registered error codes
3. Compare: every failure spec error code must appear in the catalog
4. Check reverse: integration-related codes in the catalog (those with `_INTEGRATION_` in the name) should trace to a failure spec

**Failure output:**
```
CHECK 11: Integration Failure Specs → Error Catalog
Status: FAIL (2 mismatches)
  MISSING IN CATALOG:
    - MAPS_INTEGRATION_GEOCODE_TIMEOUT (from google-maps-failure-spec.md)
  ORPHAN IN CATALOG (no failure spec):
    - PAY_INTEGRATION_STRIPE_WEBHOOK_INVALID (in catalog but no failure spec references it)
```

---

### Check 12: Component Contracts → Component Catalog

**Source:** Every component in `dev_docs/components/contracts/*.md`
**Target:** `dev_docs/components/component-catalog.md`

**Validation rule:** Every component with a contract must exist in the component catalog. Every complex component in the catalog (3+ screens, 8+ props, or internal state) should have a contract.

**How to check:**
1. Parse component contract files, extract component names
2. Parse the component catalog for registered components
3. Compare: every contracted component must appear in the catalog
4. Identify complex components in the catalog that LACK contracts (these are gaps)

**Failure output:**
```
CHECK 12: Component Contracts → Component Catalog
Status: FAIL (1 mismatch, 2 gaps)
  MISSING IN CATALOG:
    - ScheduleGrid (has contract but not in catalog)
  MISSING CONTRACTS (complex components without contracts):
    - DispatchConsole (appears in 4 screens, no contract)
    - VitalsEntry (8+ props, internal state, no contract)
```

---

## Output Format

Generate the audit report at `dev_docs/completeness/consistency-audit.md`:

```markdown
# Consistency Audit Report

**Generated:** {{AUDIT_DATE}}
**Auditor:** {{AUDITOR_AGENT_ID}} (NOT the generator agent)
**Scope:** Full audit (Checks 1-10)

## Summary

| Check | Description | Status | Mismatches |
|-------|-------------|--------|------------|
| 1 | API Endpoints → API Catalog | PASS/FAIL | {{COUNT}} |
| 2 | Screens → Screen Catalog | PASS/FAIL | {{COUNT}} |
| 3 | Tables → Database Schema | PASS/FAIL | {{COUNT}} |
| 4 | Task IDs → Task Files | PASS/FAIL | {{COUNT}} |
| 5 | Gap IDs → Task Mapping | PASS/FAIL | {{COUNT}} |
| 6 | Components → Component Catalog | PASS/FAIL | {{COUNT}} |
| 7 | Permissions → Permission Catalog | PASS/FAIL | {{COUNT}} |
| 8 | Notifications → Notification Catalog | PASS/FAIL | {{COUNT}} |
| 9 | Error Codes → Error Catalog | PASS/FAIL | {{COUNT}} |
| 10 | Integrations → Integration Health Catalog | PASS/FAIL | {{COUNT}} |
| 11 | Integration Failure Specs → Error Catalog | PASS/FAIL | {{COUNT}} |
| 12 | Component Contracts → Component Catalog | PASS/FAIL | {{COUNT}} |

**Overall Score:** {{PASS_COUNT}}/12 checks passed
**Total Mismatches:** {{TOTAL_MISMATCHES}}

## Detailed Findings

### Check 1: API Endpoints → API Catalog
[Detailed mismatch list per the failure output format above]

### Check 2: Screens → Screen Catalog
[...]

[...repeat for all 10 checks...]

## Remediation Priority

| Priority | Finding | Fix |
|----------|---------|-----|
| P0 | {{CRITICAL_FINDING}} | {{FIX_ACTION}} |
| P1 | {{HIGH_FINDING}} | {{FIX_ACTION}} |
| P2 | {{MEDIUM_FINDING}} | {{FIX_ACTION}} |
```

---

## Adversarial Verification Protocol

### Why a Separate Agent

The agent that generated the specs has blind spots — it knows what it *intended* to write, which biases its ability to find what it *actually* wrote. A separate auditor agent:

- Has no memory of generation decisions, so it reads what's on disk objectively
- Has no ego investment in passing the audit
- Will flag "technically present but actually shallow" entries that the generator would rationalize

### How to Run as a Separate Agent

1. **Start a new agent session** — do NOT continue the generation session
2. **Provide the agent with this file** (CROSS-REFERENCE-VALIDATOR.md) as its instruction set
3. **Point it at the project's `dev_docs/` directory** — it reads all files fresh
4. **Do not provide context** about what was generated or why — the auditor should discover the state of the docs independently
5. **Agent output:** The consistency audit report at `dev_docs/completeness/consistency-audit.md`

### Agent Prompt Template

```
You are a consistency auditor for {{PROJECT_NAME}}. Your job is adversarial:
find every inconsistency, missing reference, and orphaned entity across all
planning documents. Read CROSS-REFERENCE-VALIDATOR.md for your validation
checks, then audit the entire dev_docs/ directory. Produce the consistency
audit report. Be thorough — the generator agent's reputation depends on
your findings.
```

---

## Completeness Checklist

- [ ] All 12 validation checks implemented and documented
- [ ] Audit report generated with pass/fail per check
- [ ] Specific mismatches listed (not just counts)
- [ ] Remediation priorities assigned
- [ ] Audit run by a separate agent (not the generator)
- [ ] Findings resolved before proceeding to next orchestrator step
