# Cross-Document Consistency Check — Gate 12 Proof Artifact

> **Purpose:** Verifies that entity names, service names, persona names, counts, and references are consistent across ALL project documents.
> **Gate:** 12 (Cross-Document Consistency)
> **Trigger:** After Step 9 (Dashboard complete)

---

## Instructions

For each check below, compare the specified documents and flag any discrepancies. ALL 6 checks must pass.

---

## Check 1: Entity Names Match CONFIG

**Source of truth:** `dev_docs/session-context.md` (CONFIG section) or project intake

**Compare against:** All service specs, screen specs, task files, database schema docs

| Entity Name (CONFIG) | Found in Service Specs? | Found in Screen Specs? | Found in Task Files? | Found in DB Schema? | Consistent? |
|----------------------|------------------------|----------------------|---------------------|--------------------|----|
| {{entity_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |
| {{entity_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |

**Common failure:** Entity renamed in one doc but not others (e.g., "Patient" vs "Client" vs "Customer").

- [ ] **PASS:** All entity names are identical across all documents

---

## Check 2: Service Names Consistent

**Source of truth:** Service specs in `dev_docs/services/`

| Service Name | In STATUS.md? | In Master Tracker? | In API Contracts? | In Task Files? | Consistent? |
|-------------|--------------|--------------------|--------------------|---------------|-----|
| {{service_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |
| {{service_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |

**Common failure:** Service spec says "Auth Service" but tasks say "Authentication" and tracker says "auth-service".

- [ ] **PASS:** All service names are identical across all documents

---

## Check 3: Persona Names Match

**Source of truth:** Tribunal personas in `dev_docs/` or intake

| Persona Name | In Screen Specs? | In Journey Maps? | In Task Files? | In Workflow Matrix? | Consistent? |
|-------------|-----------------|-----------------|----------------|--------------------|----|
| {{persona_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |
| {{persona_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |

- [ ] **PASS:** All persona names are identical across all documents

---

## Check 4: Feature Counts Match

| Count Type | FEATURES-LIST.md | STATUS.md | Master Tracker | Service Matrix | Match? |
|-----------|------------------|-----------|----------------|----------------|--------|
| Total features | {{N}} | {{N}} | {{N}} | {{N}} | ☐ |
| Total tasks | — | {{N}} | {{N}} | — | ☐ |
| Total subtasks | — | {{N}} | {{N}} | — | ☐ |
| Total services | — | {{N}} | {{N}} | {{N}} | ☐ |
| Total screens | — | {{N}} | — | {{N}} | ☐ |

**Common failure:** STATUS.md says 90 tasks, master tracker says 102, service matrix implies 95.

- [ ] **PASS:** All counts match (or discrepancies have documented justification)

---

## Check 5: API Endpoint Names Match

**Source of truth:** `dev_docs/specs/api-contracts.md` (API Contract Registry)

| Endpoint | In Service Spec? | In Task File? | Router Prefix Matches? | Consistent? |
|----------|-----------------|---------------|------------------------|-----|
| {{endpoint_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |
| {{endpoint_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |

> Spot-check at least 20% of endpoints (or 10, whichever is greater).

- [ ] **PASS:** Sampled endpoints are consistent across service specs, contracts, and task files

---

## Check 6: Screen Names Match

**Source of truth:** Screen catalog or screen spec index

| Screen Name | In Screen Spec? | In Task File? | In Navigation Spec? | In Workflow Matrix? | Consistent? |
|-------------|----------------|---------------|---------------------|--------------------|----|
| {{screen_1}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |
| {{screen_2}} | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ Yes / ☐ No | ☐ |

- [ ] **PASS:** All screen names are identical across all documents

---

## Summary

| Check | Result | Discrepancies Found |
|-------|--------|---------------------|
| 1. Entity Names | ☐ PASS / ☐ FAIL | {{count}} |
| 2. Service Names | ☐ PASS / ☐ FAIL | {{count}} |
| 3. Persona Names | ☐ PASS / ☐ FAIL | {{count}} |
| 4. Feature Counts | ☐ PASS / ☐ FAIL | {{count}} |
| 5. API Endpoints | ☐ PASS / ☐ FAIL | {{count}} |
| 6. Screen Names | ☐ PASS / ☐ FAIL | {{count}} |

## Pass Criteria

- [ ] All 6 checks pass
- [ ] Zero unresolved discrepancies
- [ ] Any justified exceptions are documented with reasoning

**If any check fails:** Fix the discrepancies immediately. Do not proceed past Step 9.
