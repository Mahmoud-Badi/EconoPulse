# Depth Auditor

> **Purpose:** Adversarial depth scoring for all generated specs in {{PROJECT_NAME}}.
> This auditor mechanically counts depth indicators in service specs, screen specs, and task files,
> then scores them against the thresholds defined in DEPTH-REQUIREMENTS.md.
>
> **CRITICAL:** This MUST be run by a different agent than the one that generated the specs.
> The generator cannot objectively score its own work. See Adversarial Protocol below.
>
> **Output:** `dev_docs/completeness/depth-audit.md`

---

## When to Run

| Trigger | What to Audit |
|---------|---------------|
| After Step 5 completes | All service specs |
| After Step 6 completes | All screen specs |
| After Step 8 completes | All task files + layer coverage |
| After Step 16 (Handoff) | Full audit — all specs and tasks |
| After any re-generation | Only the re-generated files |

---

## Inputs Required

| Input | Location | Purpose |
|-------|----------|---------|
| Depth thresholds | `Master-Starter-Kit/10-generators/DEPTH-REQUIREMENTS.md` | Defines minimums and scoring algorithms |
| Service specs | `dev_docs/specs/services/*.md` | Documents to audit |
| Screen specs | `dev_docs/specs/screens/*.md` | Documents to audit |
| Task files | `dev_docs/tasks/**/*.md` | Documents to audit |
| STATUS.md | `dev_docs/STATUS.md` | Task-to-feature mapping |

---

## Service Spec Mechanical Counting

For each service spec file, count the following. These are objective, countable metrics — no subjective judgment.

### Counting Rules

| Metric | How to Count | What Counts | What Does NOT Count |
|--------|-------------|-------------|---------------------|
| **Total words** | Word count of entire file | All words including headers and table content | Front-matter, template instructions |
| **Business rules** | Count numbered items in Section 6 (Business Rules) | Each rule that specifies a constraint, condition, or invariant | Rules that restate the feature description (e.g., "The system manages users") |
| **Data model entities** | Count entity headers in Section 4 (Data Model) | Each entity with ≥4 fields defined | Entities with only an ID field or no fields |
| **API endpoints** | Count rows in Section 5 (API Endpoints) table | Each row with METHOD + PATH + description | Header row, empty rows |
| **Validation rules** | Count rows in Section 7 (Validation Rules) table | Each row with FIELD + RULE + ERROR MESSAGE | Generic rules like "fields must be valid" |
| **Error scenarios** | Count items in Section 10 (Error Scenarios) | Each scenario with TRIGGER + ERROR CODE + RECOVERY | Generic "handle errors appropriately" |
| **Edge cases** | Count items in Section 11 (Edge Cases) | Each scenario describing a specific deviation from happy path | Vague items like "consider edge cases" |
| **Auth matrix exists** | Boolean — does Section 12 exist with ≥1 role x operation entry | A table with roles and operations | A sentence saying "roles will be defined" |
| **Dependencies listed** | Boolean — does Section 13 exist with ≥1 named dependency | Named services or external APIs | "Various services" without naming them |

### Quality Checks (Beyond Counting)

These go beyond raw counts to verify quality. Each is a Yes/No determination.

| Quality Check | Pass Condition | Fail Condition |
|---------------|----------------|----------------|
| Business rules are specific | Each rule contains a concrete constraint (number, condition, entity name) | Rules use vague language: "appropriately," "properly," "as needed" |
| Business rules are testable | Each rule can be verified with a specific test case | Rules require subjective judgment to verify |
| Endpoints have full DTOs | Each endpoint specifies request body fields AND response shape | Endpoints only list METHOD + PATH with no payload details |
| Entities have real fields | Each entity has domain-specific fields (not just id/createdAt/updatedAt) | Entities only have boilerplate fields |
| Edge cases reference real entities | Edge cases name specific entities, roles, or states from this spec | Edge cases are generic and could apply to any service |
| Error scenarios have codes | Each error references a specific error code (from the error catalog) | Errors described in prose without codes |

---

## Screen Spec Mechanical Counting

### Counting Rules

| Metric | How to Count | What Counts | What Does NOT Count |
|--------|-------------|-------------|---------------------|
| **Total words** | Word count of entire file | All words including headers and table content | Front-matter, template instructions |
| **States** | Count state items in States section | Each named state with a description of what the user sees | Generic "loading" without describing the skeleton/spinner/shimmer |
| **Interactions** | Count interaction items | Each user action → system response pair | "Clicking buttons performs actions" (too vague) |
| **Edge cases** | Count edge case items | Specific screen-level scenarios | Generic "handle errors" |
| **Accessibility items** | Count a11y items | Specific requirements: keyboard nav, ARIA, focus management | Generic "should be accessible" |
| **Component tree items** | Count named components | Named components (PascalCase) composing the screen | Generic "various components" |
| **Responsive breakpoints** | Count breakpoint definitions | Specific viewport widths with layout description | "Should be responsive" without specifics |
| **Data requirements exist** | Boolean | Section exists with API endpoints and loading strategy | Missing or "fetches data from API" without specifics |
| **Field specs exist (forms)** | Boolean (forms only) | Every form field listed with label, type, validation, error messages | Missing or only listing field names |

### Quality Checks

| Quality Check | Pass Condition | Fail Condition |
|---------------|----------------|----------------|
| States include all 4 basics | Loading, Error, Empty, Populated all present | Any of the 4 missing |
| Interactions describe system response | Each interaction says what happens AFTER the user acts | Only describes user action, not system response |
| Components reference real names | Components use PascalCase names that could be real React/Vue components | Generic descriptions like "a table" or "a form" |
| Empty states have CTAs | Empty states include a call-to-action, not just "No data found" | Empty state is just a text message |

---

## Task File Mechanical Counting

### Counting Rules

| Metric | How to Count | What Counts | What Does NOT Count |
|--------|-------------|-------------|---------------------|
| **Total words** | Word count of entire file | All words | Front-matter |
| **Context file paths** | Count file paths in context header | Specific paths (e.g., `dev_docs/specs/services/auth.md`) | Generic "read the spec" |
| **Acceptance criteria** | Count criteria items | Each independently testable criterion | "It works correctly" |
| **Subtasks** | Count subtask items | Each discrete implementation step | "Implement the feature" |
| **File plan paths** | Count paths in file plan | Each specific file path to create/modify | "Create the necessary files" |
| **Dependencies listed** | Boolean | Task IDs or "None" explicitly stated | Missing entirely |
| **Effort estimated** | Boolean | S/M/L/XL present | Missing or "TBD" |

### Layer Coverage Audit

For each feature/service, check task coverage across the 8 layers:

| Layer | Detection Rule |
|-------|---------------|
| 1. Validator | Task file mentions DTO, validation, input schema |
| 2. Tests | Task file mentions unit test, test suite |
| 3. DB Procedure | Task file mentions model, migration, schema, seed |
| 4. Procedure Tests | Task file mentions integration test for DB operations |
| 5. Component | Task file mentions UI component creation |
| 6. Page | Task file mentions page/screen assembly |
| 7. E2E | Task file mentions end-to-end test, E2E |
| 8. Docs | Task file mentions documentation, user guide |

**Threshold:** ≥6/8 layers per feature.

---

## Scoring

Apply the exact scoring algorithms from DEPTH-REQUIREMENTS.md. Do not invent new scoring — use the formulas as written.

### Service Spec Scoring Summary

- Quantitative: /10 (section completeness + content quality + cross-referencing)
- Qualitative: /2 (real scenarios, delight, power users, first-time users)
- **Pass threshold:** ≥8/10 quantitative AND ≥1/2 qualitative

### Screen Spec Scoring Summary

- Quantitative: /10 (section completeness + content quality + cross-referencing)
- Qualitative: /2 (power user efficiency, first-time experience, delight, daily use)
- **Pass threshold:** ≥7/10 quantitative AND ≥1/2 qualitative

### Task File Scoring Summary

- Pass if: ≥350 words, ≥3 context paths, ≥5 acceptance criteria, ≥4 subtasks, file plan present, dependencies listed, effort estimated
- Layer coverage: ≥6/8 per feature

---

## Output Format

Generate the depth audit report at `dev_docs/completeness/depth-audit.md`:

```markdown
# Depth Audit Report

**Generated:** {{AUDIT_DATE}}
**Auditor:** {{AUDITOR_AGENT_ID}} (NOT the generator agent)

## Service Spec Depth Scores

| Service | Words | Rules | Endpoints | Entities | Validations | Errors | Edge Cases | Auth? | Deps? | Quant Score | Qual Score | Pass? |
|---------|-------|-------|-----------|----------|-------------|--------|------------|-------|-------|-------------|------------|-------|
| {{SERVICE}} | {{ACTUAL}}/1500 | {{ACTUAL}}/8 | {{ACTUAL}}/7 | {{ACTUAL}}/3 | {{ACTUAL}}/8 | {{ACTUAL}}/6 | {{ACTUAL}}/8 | Y/N | Y/N | {{SCORE}}/10 | {{SCORE}}/2 | PASS/FAIL |

**Average quantitative:** {{AVG}}/10
**Average qualitative:** {{AVG}}/2
**Pass rate:** {{N}}/{{TOTAL}} ({{PCT}}%)

### Failing Service Specs — Specific Deficiencies

For each failing spec, list:
- Which sections are below threshold (with actual count vs required minimum)
- Which quality checks failed (with specific examples of shallow content)
- Recommended remediation (which sections to expand, with concrete guidance)

## Screen Spec Depth Scores

| Screen | Words | States | Interactions | Edge Cases | A11y | Components | Responsive | Data? | Fields? | Quant Score | Qual Score | Pass? |
|--------|-------|--------|-------------|------------|------|------------|-----------|-------|---------|-------------|------------|-------|
| {{SCREEN}} | {{ACTUAL}}/800 | {{ACTUAL}}/6 | {{ACTUAL}}/5 | {{ACTUAL}}/5 | {{ACTUAL}}/3 | {{ACTUAL}}/5 | {{ACTUAL}}/2 | Y/N | Y/N | {{SCORE}}/10 | {{SCORE}}/2 | PASS/FAIL |

**Average quantitative:** {{AVG}}/10
**Pass rate:** {{N}}/{{TOTAL}} ({{PCT}}%)

### Failing Screen Specs — Specific Deficiencies
[Same format as service specs]

## Task File Depth Scores

| Task ID | Words | Context Paths | Acceptance Criteria | Subtasks | File Plan? | Deps? | Effort? | Pass? |
|---------|-------|---------------|--------------------|---------|-----------| ------|---------|-------|
| {{TASK_ID}} | {{ACTUAL}}/350 | {{ACTUAL}}/3 | {{ACTUAL}}/5 | {{ACTUAL}}/4 | Y/N | Y/N | Y/N | PASS/FAIL |

**Pass rate:** {{N}}/{{TOTAL}} ({{PCT}}%)

## Layer Coverage

| Feature | Validator | Tests | DB | DB Tests | Component | Page | E2E | Docs | Layers | Pass? |
|---------|-----------|-------|----|----------|-----------|------|-----|------|--------|-------|
| {{FEATURE}} | Y/N | Y/N | Y/N | Y/N | Y/N | Y/N | Y/N | Y/N | {{N}}/8 | PASS/FAIL |

**Average layers:** {{AVG}}/8
**Pass rate (≥6):** {{N}}/{{TOTAL}} ({{PCT}}%)

## Overall Verdict

- Service specs: {{PASS_COUNT}}/{{TOTAL}} pass ({{PCT}}%)
- Screen specs: {{PASS_COUNT}}/{{TOTAL}} pass ({{PCT}}%)
- Task files: {{PASS_COUNT}}/{{TOTAL}} pass ({{PCT}}%)
- Layer coverage: {{PASS_COUNT}}/{{TOTAL}} features pass ({{PCT}}%)
- **Overall: PASS / FAIL** (all categories must be ≥90% pass rate)
```

---

## Adversarial Protocol

### Why This Matters

The generator agent has systematic biases:
1. **Optimism bias:** It remembers intending to write deep specs, so it reads them as deeper than they are
2. **Pattern blindness:** It used the same template for all specs, so it doesn't notice when template language wasn't replaced with real content
3. **Confirmation bias:** It looks for evidence that specs pass, not evidence that they fail

### How to Run

1. **Start a fresh agent session** — completely separate from the generation session
2. **Do not provide generation context** — the auditor should not know what the generator "intended"
3. **Provide only:**
   - This file (DEPTH-AUDITOR.md)
   - DEPTH-REQUIREMENTS.md (for thresholds)
   - The path to `dev_docs/` (for the specs to audit)
4. **Auditor reads every spec file from disk** — no summaries, no "here's what we generated"
5. **Auditor applies counting rules mechanically** — counts actual items, not what "should be there"

### Agent Prompt Template

```
You are a depth auditor for {{PROJECT_NAME}}. Your job is adversarial:
mechanically count every depth indicator in every spec file and score
them against the thresholds in DEPTH-REQUIREMENTS.md. Read DEPTH-AUDITOR.md
for counting rules, then audit every file in dev_docs/specs/ and
dev_docs/tasks/. Be harsh — the generator agent's work is only valuable
if it survives your audit. Produce the depth audit report.
```

### Post-Audit Workflow

1. Auditor produces the depth audit report
2. Generator agent (original session or new) reads the audit findings
3. Generator re-generates ONLY the failing sections (not entire files)
4. Auditor re-audits ONLY the re-generated files
5. Repeat until all specs pass both quantitative and qualitative thresholds
6. Only then does the orchestrator proceed to the next step

---

## Completeness Checklist

- [ ] All service specs audited with mechanical counts
- [ ] All screen specs audited with mechanical counts
- [ ] All task files audited with mechanical counts
- [ ] Layer coverage checked for every feature
- [ ] Quality checks applied (beyond raw counts)
- [ ] Failing specs have specific deficiency descriptions
- [ ] Remediation guidance provided for each failure
- [ ] Audit run by a separate agent (NOT the generator)
- [ ] Overall verdict rendered with pass rates
