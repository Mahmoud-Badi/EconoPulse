# Mechanical Depth Checker

> **Purpose:** Automated, adversarial depth verification that uses mechanical counting — not subjective judgment. This checker runs INDEPENDENTLY of the agent that wrote the specs, catching self-lenient scoring.
>
> **Why this exists:** The same agent that writes a spec rates it 9/10. This checker uses regex patterns, word counts, and section detection to produce objective measurements. Any discrepancy between mechanical counts and agent scores requires human review.
>
> **Output:** `dev_docs/completeness/mechanical-depth-report.md`
> **Run during:** Step 31 Round 4 (before agent re-scoring), and optionally at any verification gate

---

## When to Run

| Trigger | Scope |
|---------|-------|
| Step 31 Round 4 (Depth Verification) | All specs and task files |
| Before SB-4 (Post-Quality gate) | All specs generated since SB-3 |
| Before any release | Full audit |
| On demand (`/depth-check`) | Specific files or directories |

---

## Check 1: Word Count Verification

**Method:** Count words per file (excluding markdown syntax, code blocks, and table formatting).

**Thresholds:**

| File Type | Path Pattern | Minimum Words | Warning Threshold |
|-----------|-------------|--------------|-------------------|
| Service spec | `dev_docs/specs/services/*.md` | 1500 | 1200 (yellow flag) |
| Screen spec | `dev_docs/specs/screens/*.md` | 800 | 600 (yellow flag) |
| Task file | `dev_docs/tasks/**/*.md` | 350 | 250 (yellow flag) |
| Error contract | `dev_docs/specs/standards/error-responses.md` | 800 | 600 |
| Reference table | `dev_docs/specs/catalogs/business-rules/*.md` | 600 | 400 |
| Failure spec | `dev_docs/specs/integrations/failure-specs/*.md` | 400 | 300 |
| Steps 13-28 output | Various | Per DEPTH-REQUIREMENTS.md table | 80% of minimum |

**Output format:**
```
[PASS] billing-service.md: 2,341 words (threshold: 1,500)
[PASS] dispatch-service.md: 1,887 words (threshold: 1,500)
[FAIL] reporting-service.md: 1,102 words (threshold: 1,500) — 398 words short
[WARN] notifications-service.md: 1,289 words (threshold: 1,500) — below warning threshold
```

---

## Check 2: Required Section Presence

**Method:** Scan for required markdown headers (## or ###) in each file type.

### Service Spec Required Sections

| Section Header Pattern | Required | Notes |
|----------------------|----------|-------|
| `## Business Rules` or `## Business Logic` | Yes | |
| `## Data Model` or `## Entities` | Yes | |
| `## API Endpoints` or `## Endpoints` | Yes | |
| `## Validation` or `## Validation Rules` | Yes | |
| `## Error` | Yes | Error Handling or Error Scenarios |
| `## Edge Cases` | Yes | |
| `## Auth` or `## Permission` or `## Access` | Yes | Auth matrix or permission matrix |
| `## Dependencies` or `## Integration` | Yes | |

### Screen Spec Required Sections

| Section Header Pattern | Required |
|----------------------|----------|
| `## States` or `## UI States` | Yes |
| `## Interactions` or `## User Interactions` | Yes |
| `## Edge Cases` | Yes |
| `## Accessibility` or `## A11y` | Yes |
| `## Components` or `## Component Tree` | Yes |
| `## Responsive` or `## Breakpoints` | Yes |
| `## Data` or `## Data Requirements` | Yes |

### Task File Required Sections

| Section Header Pattern | Required |
|----------------------|----------|
| `## Context` or `Context Files:` | Yes |
| `## Objective` or `## Goal` | Yes |
| `## File Plan` or `## Files` | Yes |
| `## Acceptance Criteria` | Yes |
| `## Sub-tasks` or `## Steps` | Yes |

**Output format:**
```
[PASS] billing-service.md: 8/8 required sections present
[FAIL] reporting-service.md: 6/8 sections — MISSING: "Edge Cases", "Dependencies"
```

---

## Check 3: Shallow Indicator Scan

**Method:** Search for known shallow phrases that indicate generic/lazy output. Each match is a flag.

### Red Flag Phrases (automatic FAIL if >3 per file)

| Pattern | Why It's Shallow |
|---------|-----------------|
| `the system manages` | Restates the feature instead of specifying behavior |
| `handle errors appropriately` | Not actionable — which errors? what handling? |
| `validate all fields` | Not specific — which fields? what rules? |
| `ensure security` | Not actionable — which security measures? |
| `implement proper` | Vague — proper according to what spec? |
| `standard approach` | Which standard? Link to it. |
| `best practices` (without specifics) | Which practices? Name them. |
| `as needed` | Needed by whom? Under what conditions? |
| `and similar` | List them all. No truncation. |
| `etc.` or `and more` | Enumerate. Reference tables never truncate. |
| `see external documentation` | This IS the documentation. |
| `consult the standard` | The reference table IS the standard for this project. |
| `reasonable defaults` | Specify the actual values. |
| `handle gracefully` | Specify the exact fallback behavior. |

### Yellow Flag Phrases (warning if >5 per file)

| Pattern | Why It's Weak |
|---------|-------------|
| `should be` (instead of `must be`) | Ambiguous obligation level |
| `consider` (instead of `implement`) | Suggests optional, not required |
| `may need` | Decide now, not during implementation |
| `TBD` or `TODO` | Should be resolved before development |
| `placeholder` | Should be replaced with actual content |

**Output format:**
```
[PASS] billing-service.md: 0 red flags, 2 yellow flags
[FAIL] reporting-service.md: 5 red flags — "handle errors appropriately" (line 47), "validate all fields" (line 62), "etc." (lines 78, 91, 103)
[WARN] dispatch-service.md: 1 red flag, 4 yellow flags
```

---

## Check 4: Error Code Format Verification

**Method:** Count strings matching the error code pattern `[A-Z]{2,5}_[A-Z_]+` in service specs and the error catalog.

**Thresholds:**
| File | Minimum Count |
|------|--------------|
| Each service spec (Section 12) | 10 error codes |
| Error catalog | 8 × number of services |
| Each integration failure spec | 3 error codes |

**Cross-check:** Every error code in a service spec must also appear in the error catalog. Report orphan codes (in spec but not catalog) and phantom codes (in catalog but no spec references them).

**Output format:**
```
[PASS] billing-service.md: 14 error codes found (threshold: 10)
[FAIL] reporting-service.md: 4 error codes found (threshold: 10) — 6 short
[XREF] Orphan codes: RPT_VALIDATION_DATE_RANGE (in spec, not in catalog)
[XREF] Phantom codes: AUTH_LIMIT_RATE_EXCEEDED (in catalog, not referenced by any spec)
```

---

## Check 5: Endpoint Count Verification

**Method:** Count lines matching `(GET|POST|PUT|PATCH|DELETE)\s+/` in service specs.

**Threshold:** ≥7 endpoints per service spec.

**Output format:**
```
[PASS] billing-service.md: 12 endpoints (threshold: 7)
[FAIL] notifications-service.md: 4 endpoints (threshold: 7) — 3 short
```

---

## Check 6: Screen State Count

**Method:** Count distinct state definitions in each screen spec's States section. Look for bold headers (`**State:**`) or list items under the States section.

**Threshold:** ≥6 states per screen (4 fundamental + 2 context-specific).

**Output format:**
```
[PASS] dashboard.md: 8 states (threshold: 6)
[FAIL] settings.md: 3 states (threshold: 6) — missing: error, empty, at minimum
```

---

## Check 7: Cross-Reference Density

**Method:** Count file path references (`dev_docs/` or relative paths to project files) in task files.

**Threshold:** ≥6 file references per task (universal reading list + task-specific).

**Output format:**
```
[PASS] CR-0401-create-billing-router.md: 9 file references (threshold: 6)
[FAIL] CR-0312-add-notification-ui.md: 2 file references (threshold: 6) — missing reading list
```

---

## Check 8: Business Rule Specificity

**Method:** In the Business Rules section of service specs, count rules that contain specific values (numbers, field names, time durations, entity references) vs generic rules.

**Specific rule indicators:** Contains digits, field names (camelCase or snake_case), time units (hours, minutes, days), entity names, comparison operators (>=, <=, ==).

**Generic rule indicators:** No digits, no field names, reads like a feature description.

**Threshold:** ≥80% of business rules must be specific (contain at least one specificity indicator).

**Output format:**
```
[PASS] billing-service.md: 10/12 rules specific (83%)
[FAIL] reporting-service.md: 3/8 rules specific (37%) — 5 rules are generic descriptions
  Line 45: "The system manages reports" — GENERIC (no specific constraint)
  Line 47: "Users can view their data" — GENERIC (no specific behavior)
```

---

## Discrepancy Detection

After running all checks, compare mechanical results against agent-reported depth scores:

```
## Discrepancy Report

| File | Agent Score | Mechanical Result | Discrepancy? | Action |
|------|-------------|-------------------|-------------|--------|
| billing-service.md | 9/10 | All checks PASS | No | — |
| reporting-service.md | 8/10 | 3 FAILS (word count, sections, error codes) | YES | Manual review required |
```

**Rule:** Any file where:
- Agent scored ≥8/10 BUT mechanical checker found ≥1 FAIL → **DISCREPANCY — requires manual review**
- Agent scored ≥7/10 BUT mechanical checker found ≥2 WARNS → **SOFT DISCREPANCY — review recommended**

---

## Summary Report Format

```markdown
# Mechanical Depth Report — {{PROJECT_NAME}}

**Generated:** {{TIMESTAMP}}
**Files checked:** {{TOTAL_FILES}}
**Pass rate:** {{PASS_COUNT}}/{{TOTAL}} ({{PCT}}%)

## Results by Check
| Check | Pass | Warn | Fail |
|-------|------|------|------|
| Word Count | {{N}} | {{N}} | {{N}} |
| Section Presence | {{N}} | {{N}} | {{N}} |
| Shallow Indicators | {{N}} | {{N}} | {{N}} |
| Error Code Format | {{N}} | {{N}} | {{N}} |
| Endpoint Count | {{N}} | {{N}} | {{N}} |
| Screen State Count | {{N}} | {{N}} | {{N}} |
| Cross-Reference Density | {{N}} | {{N}} | {{N}} |
| Business Rule Specificity | {{N}} | {{N}} | {{N}} |

## Discrepancies (Agent Score vs Mechanical)
{{DISCREPANCY_TABLE}}

## Files Requiring Attention
{{FAIL_LIST_WITH_DETAILS}}
```

---

## Gate Criteria

**Pass:** Zero FAIL results across all checks, AND zero discrepancies with agent scores.

**Conditional Pass:** ≤3 WARN results, zero FAILs, zero discrepancies. Warnings documented but don't block.

**Fail:** Any FAIL result OR any discrepancy between agent score and mechanical count. Failing files must be expanded and re-checked before proceeding.
