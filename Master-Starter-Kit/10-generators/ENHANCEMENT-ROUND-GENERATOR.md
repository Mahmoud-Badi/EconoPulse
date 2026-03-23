# Enhancement Round Generator — Prompt

> **Used by:** Step 30 (Enhancement Rounds)
> **Input:** All `dev_docs/` content, audit summary from Step 29, project domain/type
> **Output:** Per-round improvement files + enhancement log in `dev_docs/hardening/enhancement/`

---

## Generator Instructions

You are performing 3 rounds of enhancement on the project plan. Your job is to find what was missed, improve what exists, and identify cross-cutting patterns. This goes beyond auditing (Step 29) — you are actively improving the plan's quality and coverage.

### Before Starting

1. Read `dev_docs/hardening/audit/audit-summary.md` — understand what was already fixed
2. Read `dev_docs/project-brief.md` — understand the product domain
3. Read `dev_docs/features-list.md` — understand the feature scope
4. Read `34-hardening/enhancement-categories.md` — this is your category reference
5. Create the output directory: `dev_docs/hardening/enhancement/`

---

### Round 1: "What Did We Miss?"

**Objective:** Find missing services, screens, edge cases, business rules, and integrations.

**Process:**

1. **Industry comparison:** Based on the project type (from `CONFIG.PROJECT_TYPE` and the project brief), identify features that similar products in this industry typically have. Compare against the features list. Flag gaps.

2. **Service gap analysis:**
   - For each service, check: does it imply other services that don't exist?
   - Example: A "booking" service implies calendar, availability, notification services
   - Example: A "payment" service implies invoice, receipt, refund, dispute services
   - Flag any implied services not in the service list

3. **Screen gap analysis:**
   - For each service, verify CRUD screens exist (list, detail, create, edit)
   - Check for admin counterpart screens
   - Check for: settings screens, profile screens, search/filter screens, bulk action screens
   - Check for: error pages (404, 500, 403), maintenance page, offline page

4. **Edge case scan:**
   - For each P0 service, verify ≥5 edge cases are documented
   - Common edge cases often missed:
     - First-time user (empty state)
     - Last item deletion (return to empty state)
     - Concurrent editing (conflict resolution)
     - Session expiry mid-action
     - Network failure during write operations
     - Timezone edge cases (user in different TZ than server)
     - Unicode/emoji in text fields
     - File upload size limits and type restrictions

5. **Business rule scan:**
   - For each entity with a status field, verify state machine exists
   - For each form, verify validation rules are explicit (not "validate input")
   - For each calculation, verify formula is documented with examples

**After Round 1:**
- Generate `dev_docs/hardening/enhancement/round-1-improvements.md`
- Add missing services, screens, edge cases, business rules directly to the relevant spec files
- Count: `{N} improvements applied`

---

### Round 2: "What Can We Do Better?"

**Objective:** Deepen existing specs, improve task granularity, strengthen API contracts.

**Process:**

1. **Spec depth improvement:**
   - Read every service spec. For each section scoring <100 words, expand it.
   - Focus areas: Business Rules, Edge Cases, Error Handling, Performance Requirements
   - Target: every section should have substantive content, not just headers

2. **Task granularity:**
   - Scan all task files for mega-tasks (>8 hours, <3 sub-tasks)
   - Split into smaller, implementable sub-tasks
   - Ensure each sub-task specifies concrete output files

3. **API contract strengthening:**
   - For each endpoint: verify error response schemas exist (400, 401, 403, 404, 409, 422, 500)
   - Add pagination parameters to all list endpoints (page, limit, sort, filter)
   - Add rate limiting documentation
   - Add authentication requirements per endpoint

4. **Screen spec improvement:**
   - Verify all 4 states documented: loading, error, empty, data
   - Add responsive breakpoint specifications if missing
   - Add accessibility requirements if missing
   - Add form validation rules if forms are present

5. **Phase plan improvement:**
   - Add missing effort estimates
   - Add risk factors per phase
   - Add rollback plans for risky phases

**After Round 2:**
- Generate `dev_docs/hardening/enhancement/round-2-improvements.md`
- Apply all improvements directly to the relevant files
- Count: `{N} improvements applied`

---

### Round 3: "What Patterns Emerged?"

**Objective:** Find cross-cutting patterns and create standards.

**Process:**

1. **Aggregate findings:** Collect all findings from Rounds 1-2. Group by category.

2. **Cross-cutting standard detection:**
   - If ≥3 services had the same gap → create a cross-cutting standard
   - Examples:
     - Weak error handling across services → create `dev_docs/foundations/error-handling-standard.md`
     - Missing empty states across screens → add empty state pattern to design system
     - Inconsistent validation → create `dev_docs/foundations/validation-patterns.md`

3. **Naming consistency:**
   - Extract all entity names, endpoint paths, and key terms from all specs
   - Flag inconsistencies (camelCase vs snake_case, plural vs singular, abbreviations)
   - Standardize and apply corrections

4. **Architecture consistency:**
   - Verify all services follow the same architectural pattern
   - Flag services that deviate without documented justification
   - Ensure API versioning is consistent

5. **Documentation completeness:**
   - Check decision log — verify each major choice has a rationale
   - Check for migration path documentation
   - Check for dependency risk documentation

**After Round 3:**
- Generate `dev_docs/hardening/enhancement/round-3-improvements.md`
- Create any cross-cutting standard files
- Generate `dev_docs/hardening/enhancement/enhancement-log.md` consolidating all rounds

---

### Final Output

Generate `dev_docs/hardening/enhancement/enhancement-log.md`:

```markdown
# Enhancement Log

## Overview
- Rounds executed: {ROUNDS}
- Total improvements: {TOTAL}
  - Missing items added: {ADDED}
  - Existing items improved: {IMPROVED}
  - Cross-cutting standards created: {STANDARDS}
  - Consistency fixes: {CONSISTENCY}

## Round-by-Round
| Round | Focus | Improvements |
|-------|-------|-------------|
| 1 | What we missed | {R1_COUNT} |
| 2 | What we improved | {R2_COUNT} |
| 3 | Patterns & standards | {R3_COUNT} |

## New Files Created
[List all new files created during enhancement]

## Files Modified
[List all files that were expanded or corrected]

## Cross-Cutting Standards Created
[List any new standard/pattern documents created in Round 3]
```

### Early Exit

If Round 2 finds ≤2 improvements, Round 3 may be simplified to a consistency check only (skip cross-cutting standard creation).
