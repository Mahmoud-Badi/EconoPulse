# Auto-Regeneration Engine

> **Purpose:** When a spec fails a depth audit or mechanical depth check, this engine identifies the specific failures, generates a targeted regeneration prompt for ONLY the failing sections, re-scores after regeneration, and tracks the full regeneration history. Max 3 attempts before escalating to a human.
>
> **Trigger:** Any spec scoring below pass threshold in DEPTH-AUDITOR or MECHANICAL-DEPTH-CHECKER output
> **Output:** Regenerated spec sections + `dev_docs/completeness/regeneration-log.md`

---

## When to Run

| Trigger | Scope |
|---------|-------|
| DEPTH-AUDITOR reports a spec below threshold | The specific failing spec |
| MECHANICAL-DEPTH-CHECKER finds FAIL results | Each file with FAIL status |
| CROSS-REFERENCE-VALIDATOR finds missing content | The spec with the gap |
| Manual request (`/regenerate {file}`) | Specified file |

---

## Step 1: Parse Audit Failures

Read the audit output (from DEPTH-AUDITOR or MECHANICAL-DEPTH-CHECKER) and extract structured failure data for the target file.

### Failure Extraction Template

For each failing file, produce this structured analysis:

```markdown
## Failure Analysis: {{FAILING_FILE_PATH}}

**Original Score:** {{ORIGINAL_QUANT_SCORE}}/10 quantitative, {{ORIGINAL_QUAL_SCORE}}/2 qualitative
**Pass Threshold:** {{PASS_THRESHOLD}}
**Gap:** {{POINTS_BELOW_THRESHOLD}} points below passing

### Word Count
- **Actual:** {{ACTUAL_WORD_COUNT}} words
- **Required:** {{REQUIRED_WORD_COUNT}} words
- **Deficit:** {{WORD_DEFICIT}} words
- **Status:** {{PASS|WARN|FAIL}}

### Missing Sections
{{#EACH MISSING_SECTION}}
- [ ] `{{SECTION_HEADER}}` — completely absent, must be added
{{/EACH}}

### Shallow Sections (present but below threshold)
{{#EACH SHALLOW_SECTION}}
- [ ] `{{SECTION_HEADER}}` — {{ACTUAL_COUNT}} items found, {{REQUIRED_COUNT}} required ({{DEFICIT}} short)
  - Specific deficiency: {{WHAT_IS_MISSING}}
{{/EACH}}

### Red-Flag Phrases Found
{{#EACH RED_FLAG}}
- Line {{LINE_NUMBER}}: `{{PHRASE}}` — {{WHY_ITS_SHALLOW}}
  - Fix: Replace with {{SPECIFIC_REPLACEMENT_GUIDANCE}}
{{/EACH}}

### Yellow-Flag Phrases Found
{{#EACH YELLOW_FLAG}}
- Line {{LINE_NUMBER}}: `{{PHRASE}}` — {{WHY_ITS_WEAK}}
{{/EACH}}

### Quality Check Failures
{{#EACH QUALITY_FAILURE}}
- {{CHECK_NAME}}: {{FAILURE_DESCRIPTION}}
  - Example of bad content: `{{BAD_EXAMPLE}}`
  - What good looks like: `{{GOOD_EXAMPLE}}`
{{/EACH}}
```

---

## Step 2: Generate Targeted Regeneration Prompt

Do NOT regenerate the entire spec. Build a prompt that targets ONLY the failing sections while preserving everything that passed.

### Regeneration Prompt Template

```
You are regenerating specific sections of {{FAILING_FILE_PATH}} that failed depth audit.

## CRITICAL RULES
1. Do NOT modify sections that passed audit — preserve them exactly as-is
2. Only rewrite/expand the sections listed below
3. Every regenerated section must meet or exceed the specific threshold listed
4. Zero red-flag phrases allowed in regenerated content
5. Every business rule must contain at least one specific value (number, field name, time unit, entity name)
6. Every error scenario must include a specific error code in {{ERROR_CODE_FORMAT}} format

## FILE CONTEXT
- **File:** {{FAILING_FILE_PATH}}
- **File type:** {{FILE_TYPE}} (service spec | screen spec | task file)
- **Service/feature:** {{SERVICE_OR_FEATURE_NAME}}
- **Related specs to reference:** {{RELATED_SPEC_PATHS}}

## SECTIONS TO PRESERVE (do not touch)
{{#EACH PASSING_SECTION}}
- `{{SECTION_HEADER}}` — scored {{SCORE}}, passes threshold
{{/EACH}}

## SECTIONS TO REGENERATE

{{#EACH FAILING_SECTION}}
### {{SECTION_NUMBER}}: {{SECTION_HEADER}}

**Current state:** {{CURRENT_STATE_DESCRIPTION}}
**Required minimum:** {{SPECIFIC_THRESHOLD}}
**Current count:** {{ACTUAL_COUNT}}
**Deficit:** {{DEFICIT}}

**What's wrong:**
{{SPECIFIC_PROBLEMS}}

**What good output looks like for this section:**
{{EXAMPLE_OF_GOOD_OUTPUT}}

**Domain context to inform your rewrite:**
{{DOMAIN_CONTEXT_FROM_TRIBUNAL_OR_SPECS}}

---
{{/EACH}}

## SECTIONS TO ADD (completely missing)

{{#EACH MISSING_SECTION}}
### NEW: {{SECTION_HEADER}}

**Required by:** {{WHICH_AUDIT_CHECK}}
**Minimum content:** {{MINIMUM_REQUIREMENTS}}
**Template to follow:**
{{SECTION_TEMPLATE}}

---
{{/EACH}}

## RED FLAGS TO ELIMINATE

Replace every instance of these phrases with specific, actionable content:
{{#EACH RED_FLAG}}
- Line {{LINE_NUMBER}}: `{{PHRASE}}` → replace with specific {{WHAT_TO_SPECIFY}}
{{/EACH}}

## OUTPUT FORMAT

Return ONLY the regenerated/new sections, each prefixed with the markdown header exactly as it should appear in the file. I will splice them into the existing file, replacing the old versions.
```

---

## Step 3: Splice Regenerated Content

After the regeneration prompt produces new sections:

1. **Read the original file** from disk
2. **For each regenerated section:**
   - Find the matching `##` or `###` header in the original
   - Replace everything from that header to the next same-level-or-higher header
   - If the section is new (was missing), insert it at the correct position per the file type template
3. **Write the updated file** back to disk
4. **Do NOT change** any section that was not in the regeneration output

### Section Insertion Order

When adding missing sections, insert them in the canonical order for the file type:

**Service specs:** Overview → Business Rules → Data Model → API Endpoints → Validation → Error Scenarios → Edge Cases → Auth Matrix → Dependencies

**Screen specs:** States → Interactions → Edge Cases → Accessibility → Component Tree → Responsive → Data Requirements

**Task files:** Context → Objective → File Plan → Acceptance Criteria → Sub-tasks → Dependencies

---

## Step 4: Re-Score After Regeneration

After splicing, immediately run the same audit checks that originally flagged the file.

### Re-Scoring Protocol

1. **Run MECHANICAL-DEPTH-CHECKER** on the updated file only (not full project)
2. **Run DEPTH-AUDITOR** counting rules on the updated file only
3. **Compare new scores against thresholds:**

| Result | Action |
|--------|--------|
| All checks PASS | Mark as resolved in regeneration log |
| Some checks improved but still FAIL | Increment attempt counter, return to Step 2 |
| No improvement or regression | Increment attempt counter, add diagnostic note, return to Step 2 with stronger prompt |

### Score Comparison Template

```markdown
## Re-Score: {{FAILING_FILE_PATH}} — Attempt {{ATTEMPT_NUMBER}}

| Check | Before | After | Threshold | Status |
|-------|--------|-------|-----------|--------|
| Word count | {{BEFORE}} | {{AFTER}} | {{THRESHOLD}} | {{PASS|FAIL}} |
| Required sections | {{BEFORE}}/{{TOTAL}} | {{AFTER}}/{{TOTAL}} | {{TOTAL}} | {{PASS|FAIL}} |
| Red flags | {{BEFORE}} | {{AFTER}} | 0 | {{PASS|FAIL}} |
| Error codes | {{BEFORE}} | {{AFTER}} | {{THRESHOLD}} | {{PASS|FAIL}} |
| Endpoint count | {{BEFORE}} | {{AFTER}} | {{THRESHOLD}} | {{PASS|FAIL}} |
| Business rule specificity | {{BEFORE}}% | {{AFTER}}% | 80% | {{PASS|FAIL}} |

**Overall:** {{PASS|FAIL}} — {{SUMMARY}}
```

---

## Step 5: Escalation Protocol

### Attempt Limits

| Attempt | Action |
|---------|--------|
| 1 | Standard regeneration with targeted prompt |
| 2 | Regeneration with expanded domain context — pull additional details from tribunal research, related service specs, and competitive analysis |
| 3 | Final attempt — regeneration with explicit examples from passing specs in the same project as reference |
| 4+ | **STOP. Escalate to human.** |

### Escalation Report Template

```markdown
## ESCALATION: {{FAILING_FILE_PATH}} — Failed After {{MAX_ATTEMPTS}} Regeneration Attempts

**Original score:** {{ORIGINAL_SCORE}}
**Best score achieved:** {{BEST_SCORE}} (attempt {{BEST_ATTEMPT}})
**Pass threshold:** {{THRESHOLD}}

### Persistent Failures (could not fix automatically)

{{#EACH PERSISTENT_FAILURE}}
- **{{CHECK_NAME}}:** {{FAILURE_DESCRIPTION}}
  - Attempt 1 result: {{ATTEMPT_1_RESULT}}
  - Attempt 2 result: {{ATTEMPT_2_RESULT}}
  - Attempt 3 result: {{ATTEMPT_3_RESULT}}
  - **Likely cause:** {{ROOT_CAUSE_HYPOTHESIS}}
{{/EACH}}

### Recommended Human Actions

{{#EACH RECOMMENDATION}}
1. {{ACTION}} — {{WHY}}
{{/EACH}}

### What the AI Could Not Determine

{{WHAT_REQUIRES_HUMAN_JUDGMENT}}
```

---

## Regeneration Log Format

Maintain a running log at `dev_docs/completeness/regeneration-log.md`:

```markdown
# Regeneration Log — {{PROJECT_NAME}}

> **Last updated:** {{TIMESTAMP}}
> **Total regenerations:** {{TOTAL_COUNT}}
> **Success rate:** {{SUCCESS_COUNT}}/{{TOTAL_COUNT}} ({{PCT}}%)
> **Escalations:** {{ESCALATION_COUNT}}

## Regeneration History

| # | File | Original Score | Attempts | Final Score | Status | Date |
|---|------|---------------|----------|-------------|--------|------|
| 1 | {{FILE_PATH}} | {{ORIGINAL}}/10 | {{ATTEMPTS}} | {{FINAL}}/10 | {{RESOLVED|ESCALATED}} | {{DATE}} |
| 2 | {{FILE_PATH}} | {{ORIGINAL}}/10 | {{ATTEMPTS}} | {{FINAL}}/10 | {{RESOLVED|ESCALATED}} | {{DATE}} |

## Detailed Attempt History

### {{FILE_PATH}}

| Attempt | Sections Targeted | Checks Before | Checks After | Delta |
|---------|-------------------|---------------|--------------|-------|
| 1 | {{SECTION_LIST}} | {{FAIL_COUNT}} FAIL | {{FAIL_COUNT}} FAIL | {{DELTA}} |
| 2 | {{SECTION_LIST}} | {{FAIL_COUNT}} FAIL | {{FAIL_COUNT}} FAIL | {{DELTA}} |

### Common Failure Patterns

Track which failure types are hardest to fix automatically:

| Failure Type | Occurrences | Auto-Fix Rate | Notes |
|--------------|-------------|---------------|-------|
| Missing sections | {{N}} | {{PCT}}% | Usually fixed on attempt 1 |
| Word count deficit | {{N}} | {{PCT}}% | Requires domain context to expand meaningfully |
| Red-flag phrases | {{N}} | {{PCT}}% | High fix rate — mechanical replacement |
| Business rule specificity | {{N}} | {{PCT}}% | Hardest to fix — often needs human domain knowledge |
| Error code coverage | {{N}} | {{PCT}}% | Requires understanding of failure modes |
```

---

## Integration with Orchestrator

The REGENERATOR integrates into the orchestrator flow at these points:

| Orchestrator Step | Integration |
|-------------------|-------------|
| Step 5 (Service Specs) | After DEPTH-AUDITOR runs, auto-regenerate any failing specs before proceeding to Step 6 |
| Step 6 (Screen Specs) | After DEPTH-AUDITOR runs, auto-regenerate failing screen specs before proceeding |
| Step 8 (Task Files) | After DEPTH-AUDITOR runs, auto-regenerate failing task files before proceeding |
| Step 16.5 (Quality Gates) | Final regeneration pass — any remaining failures must pass or escalate |
| Step 31 (Depth Verification) | Post-enhancement regeneration for specs that slipped below threshold |

### Orchestrator Gate Rule

**No step proceeds until all specs produced by that step either PASS audit or are ESCALATED to human.** The regenerator is not optional — it runs automatically when failures are detected.

---

## Quality Rules

1. **Never regenerate passing sections.** Targeted regeneration only.
2. **Never exceed 3 automatic attempts.** Diminishing returns after 3 — escalate.
3. **Always re-score immediately after regeneration.** No "trust me, it's better now."
4. **Log every attempt.** The regeneration log is an audit trail.
5. **Use domain context from the project.** Pull from tribunal research, related specs, and competitive analysis — do not invent generic filler.
6. **Preserve file structure.** The regenerated file must have the same overall structure as the original — same header hierarchy, same section order.
