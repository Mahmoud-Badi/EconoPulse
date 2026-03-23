# Downstream Compatibility Check

> **Purpose:** After each generator runs, verify that its output format matches the expected input schema of the NEXT generator in the DAG. Catches format mismatches (wrong headers, missing sections, incompatible placeholder syntax, malformed tables) before they cause silent failures in downstream generators.
>
> **Key insight:** A generator can produce a "valid" file that passes depth audit but still breaks the next generator because the output structure doesn't match what the downstream generator parses. This checker validates the CONTRACT between generators, not just the content quality.

---

## When to Run

Run this check AFTER each generator completes and BEFORE the next generator in the DAG starts. Refer to `GENERATOR-DAG.md` for the execution order.

| After This Generator | Check Compatibility With |
|---------------------|------------------------|
| AUDIT-GENERATOR | PHASE-GENERATOR, SERVICE-HUB-GENERATOR |
| DATABASE-DOC-GENERATOR | CODE-SCAFFOLD-GENERATOR, CROSS-REFERENCE-VALIDATOR |
| API-CATALOG-GENERATOR | SCREEN-CATALOG-GENERATOR, OPENAPI-GENERATOR, MOCK-SERVER-GENERATOR |
| SERVICE-HUB-GENERATOR | SCREEN-CATALOG-GENERATOR, PHASE-GENERATOR, WORKFLOW-E2E-TRACE-GENERATOR |
| SCREEN-CATALOG-GENERATOR | USER-DOC-GENERATOR, JOURNEY-COVERAGE-MATRIX |
| PHASE-GENERATOR | DEPENDENCY-GRAPHER, SPRINT-PLAN-GENERATOR, WORKFLOW-COVERAGE-MATRIX |
| DEPTH-AUDITOR | REGENERATOR |
| MECHANICAL-DEPTH-CHECKER | REGENERATOR |

---

## Compatibility Check Protocol

For each generator pair (producer → consumer), verify:

### 1. Header Structure Compatibility

The downstream generator parses specific markdown headers to extract data. Verify the upstream output contains exactly the headers the downstream expects.

**Check procedure:**
1. Read the downstream generator's "Inputs Required" section
2. Identify which headers/sections it parses (e.g., "Extract rows from Section 5: API Endpoints")
3. Read the upstream generator's actual output file
4. Verify each expected header exists with the correct level (`##` vs `###`)

**Common mismatches:**

| Mismatch | Example | Fix |
|----------|---------|-----|
| Header level wrong | Downstream expects `## API Endpoints`, output has `### API Endpoints` | Adjust header level to match downstream parser |
| Header text differs | Downstream expects `## Business Rules`, output has `## Business Logic` | Use the exact header text. Both are valid English but only one matches the parser |
| Header missing entirely | Downstream expects `## Dependencies`, output has no such section | Add the missing section (even if empty with "None identified") |
| Extra numbering in headers | Downstream expects `## Data Model`, output has `## 4. Data Model` | Strip section numbers from headers OR update downstream parser to handle both |

**Validation output:**
```
COMPAT CHECK: SERVICE-HUB-GENERATOR → SCREEN-CATALOG-GENERATOR
  [PASS] Header "## Screens" found (level 2) — matches expected
  [PASS] Header "## API Endpoints" found (level 2) — matches expected
  [FAIL] Header "## Overview" found as "## Service Overview" — downstream
         parser expects exact text "## Overview"
  Action: Rename "## Service Overview" to "## Overview" in hub output
```

---

### 2. Table Format Compatibility

Many generators extract data from markdown tables. Verify column names, column count, and cell format match expectations.

**Check procedure:**
1. Identify which tables the downstream generator parses
2. Read the upstream output's table
3. Verify: column count matches, column header names match, cell format is parseable

**Common mismatches:**

| Mismatch | Example | Fix |
|----------|---------|-----|
| Column count differs | Downstream expects 5 columns, output has 7 | Either add missing columns or remove extras to match |
| Column name differs | Downstream expects `Status`, output has `Build Status` | Use exact column name |
| Missing header row separator | Table has no `|---|---|` row | Add the separator — some parsers require it |
| Cell contains pipe character | Cell value `GET \| POST` breaks table parsing | Escape pipes in cell values: `GET \| POST` or split into separate rows |
| Multi-line cell content | Cell contains newline which breaks row parsing | Flatten to single line or use `<br>` for visual break |

**Validation output:**
```
COMPAT CHECK: PHASE-GENERATOR → DEPENDENCY-GRAPHER
  Table: STATUS.md task table
  [PASS] Column count: 6 (expected 6)
  [PASS] Column "ID" present at position 1
  [PASS] Column "Effort" present at position 3
  [FAIL] Column "Deps" expected at position 6, found "Dependencies"
  Action: Rename column "Dependencies" to "Deps" in STATUS.md output
```

---

### 3. Placeholder Syntax Compatibility

All templates in the kit use `{{PLACEHOLDER}}` syntax. Verify that:
- Output files have resolved their placeholders (no raw `{{...}}` remaining unless intentional)
- Output files use the placeholder format that downstream generators expect

**Check procedure:**
1. Scan the output file for `{{...}}` patterns
2. For each match, determine if it's intentional (in a template section) or unresolved
3. Cross-reference against downstream generator's expected input — does the downstream expect resolved values or template syntax?

**Common mismatches:**

| Mismatch | Example | Fix |
|----------|---------|-----|
| Unresolved placeholder | Output contains `{{SERVICE_NAME}}` literally | Resolve to actual service name before writing |
| Wrong placeholder name | Output uses `{{SPEC_PATH}}`, downstream expects `{{SERVICE_SPEC_PATH}}` | Standardize placeholder names across generators |
| Placeholder in wrong format | Output uses `{service}`, downstream regex expects `{{SERVICE}}` | Use double-brace `{{...}}` consistently |

**Validation output:**
```
COMPAT CHECK: Placeholder Resolution
  File: dev_docs/specs/services/auth-service.md
  [PASS] 0 unresolved {{...}} placeholders found
  [WARN] 2 single-brace {placeholders} found at lines 45, 78 — may be
         intentional template syntax or may be unresolved
```

---

### 4. File Path Reference Compatibility

Generators reference other files by path. Verify that path references in the output point to files that actually exist or will exist after the next generator runs.

**Check procedure:**
1. Extract all file path references from the output (patterns: backtick-wrapped paths, `dev_docs/...`, relative paths)
2. For each path, check if the file exists on disk
3. If the file doesn't exist, check if it's an output of a not-yet-run generator (acceptable)
4. If the file doesn't exist and no generator produces it, flag as broken reference

**Validation output:**
```
COMPAT CHECK: File Path References
  File: dev_docs/specs/services/auth-service.md
  [PASS] dev_docs/audit/auth-audit.md — exists
  [PASS] dev_docs/tasks/phase-0/AUTH-001.md — exists
  [FAIL] dev_docs/specs/screens/login-screen.md — does not exist
         AND no generator in the DAG produces this file
  Action: Either create the screen spec or remove the reference
```

---

### 5. ID Format Compatibility

Task IDs, service IDs, and error codes follow specific formats. Verify that IDs produced by the upstream generator match the format the downstream generator expects to parse.

**Check procedure:**
1. Identify ID formats used in the output (task IDs, error codes, service numbers)
2. Verify they match the regex pattern the downstream generator uses to extract them

**Expected ID formats:**

| ID Type | Format | Regex | Used By |
|---------|--------|-------|---------|
| Task ID | `{PREFIX}-{NNN}` | `[A-Z]{2,5}-\d{3}` | DEPENDENCY-GRAPHER, SPRINT-PLAN-GENERATOR |
| Error code | `{SVC}_{CATEGORY}_{TYPE}` | `[A-Z]{2,5}_[A-Z_]+` | CROSS-REFERENCE-VALIDATOR, MECHANICAL-DEPTH-CHECKER |
| Service number | `NN` | `\d{2}` | SERVICE-HUB-GENERATOR, service index |

**Validation output:**
```
COMPAT CHECK: ID Format
  File: dev_docs/STATUS.md
  [PASS] Task IDs match [A-Z]{2,5}-\d{3} pattern: AUTH-001, LOAD-101, ...
  [FAIL] Task ID "bugfix-23" does not match expected format
  Action: Rename to BUG-023 per task ID convention
```

---

## Per-Generator Compatibility Specs

### SERVICE-HUB-GENERATOR Output → Downstream Consumers

**SCREEN-CATALOG-GENERATOR expects:**
- `## Screens` section with a markdown table
- Table columns: `Screen | Route | Type | Status | Task ID`
- Route values as URL paths starting with `/`
- Status values from set: `Done | WIP | Stub | Not Built | Protected`

**PHASE-GENERATOR expects:**
- `## Implementation Status` section
- `## Known Issues` section with severity column
- Service name in the `# Service {NN}: {Name}` header
- Phase references in `## Tasks` sub-sections

**WORKFLOW-E2E-TRACE-GENERATOR expects:**
- `## API Endpoints` section with METHOD + PATH table
- `## Business Rules` section with numbered rules
- `## Screens` section for mapping workflows to screens

### PHASE-GENERATOR Output → Downstream Consumers

**DEPENDENCY-GRAPHER expects:**
- Task files with `## Dependencies` section containing task ID references
- Task metadata with `Effort:` field containing S/M/L/XL
- `dev_docs/STATUS.md` with task table containing `ID | Title | Effort | Status | Assignee | Deps` columns

**SPRINT-PLAN-GENERATOR expects:**
- `dev_docs/STATUS.md` with task table (same columns as above)
- Task effort values as exactly `S`, `M`, `L`, or `XL` (not full words, not mixed case)
- Task status values from set: `planned | in-progress | done | blocked`

**WORKFLOW-COVERAGE-MATRIX expects:**
- Task files on disk at `dev_docs/tasks/**/*.md`
- Each task file has `## Acceptance Criteria` section
- Each task file has `Service:` field in metadata mapping to a service name

### DEPTH-AUDITOR / MECHANICAL-DEPTH-CHECKER Output → REGENERATOR

**REGENERATOR expects:**
- Audit output with per-file results
- Each result tagged as `[PASS]`, `[FAIL]`, or `[WARN]`
- Failure entries include specific counts (actual vs threshold)
- File paths in results match actual file paths on disk
- Line numbers for red-flag phrase locations

---

## Report Format

After running all compatibility checks for a generator pair, produce:

```markdown
# Downstream Compatibility Report

**Producer:** {{UPSTREAM_GENERATOR}}
**Output file:** {{OUTPUT_FILE_PATH}}
**Consumers checked:** {{LIST_OF_DOWNSTREAM_GENERATORS}}
**Generated:** {{TIMESTAMP}}

## Results

| Consumer | Headers | Tables | Placeholders | Paths | IDs | Overall |
|----------|---------|--------|--------------|-------|-----|---------|
| {{CONSUMER_1}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} |
| {{CONSUMER_2}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} | {{PASS/FAIL}} |

## Failures

{{#EACH FAILURE}}
### {{CONSUMER}} — {{CHECK_TYPE}}

**Expected:** {{EXPECTED}}
**Actual:** {{ACTUAL}}
**Location:** {{FILE_PATH}} line {{LINE_NUMBER}}
**Fix:** {{SPECIFIC_FIX_INSTRUCTION}}
**Severity:** {{BLOCKING|WARNING}} — {{#IF BLOCKING}}downstream generator will fail{{/IF}}{{#IF WARNING}}downstream generator may produce degraded output{{/IF}}
{{/EACH}}

## Recommendations

{{#EACH RECOMMENDATION}}
- {{ACTION}} — {{REASON}}
{{/EACH}}
```

---

## Common Format Mismatches and Fixes

### 1. Task Status Casing
**Problem:** PHASE-GENERATOR outputs `Planned` but SPRINT-PLAN-GENERATOR expects `planned` (lowercase).
**Fix:** Normalize all status values to lowercase in PHASE-GENERATOR output.

### 2. Effort Values
**Problem:** Task file says `Effort: Small` but DEPENDENCY-GRAPHER expects `Effort: S`.
**Fix:** Use single-letter codes only: S, M, L, XL.

### 3. Hub File Service Numbering
**Problem:** Hub file title is `# Auth & Admin Service` but SERVICE-INDEX expects `# Service 01: Auth & Admin`.
**Fix:** Always use the numbered format: `# Service {NN}: {Name}`.

### 4. API Endpoint Format in Specs
**Problem:** Service spec lists endpoints as prose ("The GET endpoint returns...") but API-CATALOG-GENERATOR expects table rows with `| Method | Path | Controller | Auth | Status |`.
**Fix:** Always use table format for endpoints. Prose descriptions go in subsections below the table.

### 5. Screen Route Format
**Problem:** Screen catalog uses `loads/[id]` but hub files use `/loads/:id`.
**Fix:** Standardize on Next.js bracket syntax: `/loads/[id]`. If using a different framework, document the convention in the project's CLAUDE.md and apply consistently.

### 6. Date Formats
**Problem:** One generator outputs `2024-01-15` and another outputs `January 15, 2024`.
**Fix:** Use ISO 8601 format `YYYY-MM-DD` everywhere. If human-readable is needed, add it in parentheses.

### 7. Markdown Table Alignment
**Problem:** Generator outputs tables with no padding, causing downstream regex to fail on column extraction.
**Fix:** Always include at least one space of padding inside pipe delimiters: `| value |` not `|value|`.

---

## Integration with Generator DAG

This check runs as a post-hook after each generator in the execution order defined in GENERATOR-DAG.md:

```
Run Generator N
  ↓
Run DOWNSTREAM-COMPAT-CHECK (Generator N output → Generator N+1 expected input)
  ↓ PASS → proceed to Generator N+1
  ↓ FAIL → fix output format → re-run compat check → then proceed
```

The compatibility check adds ~30 seconds per generator but prevents hours of debugging when a downstream generator silently produces garbage from malformed input.
