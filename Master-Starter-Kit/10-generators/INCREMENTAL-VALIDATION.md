# Incremental Validation Hooks

> **Purpose:** Validation checkpoints that run IMMEDIATELY after each generation step, catching problems at the point of origin instead of letting them cascade 20+ steps before discovery. Every checkpoint defines: what to check, which validator to run, pass/fail criteria, and what to do on failure.
>
> **Core principle:** A defect caught at Step 5 costs 1 regeneration. The same defect caught at Step 16 costs re-running Steps 5-16. Validate early, validate often, validate mechanically.

---

## Checkpoint Architecture

Each checkpoint follows this structure:

```
CHECKPOINT {{STEP_NUMBER}}.V: {{CHECKPOINT_NAME}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Trigger:     Runs immediately after Step {{STEP_NUMBER}} completes
Scope:       {{WHAT_FILES_TO_CHECK}}
Validator:   {{WHICH_TOOL_OR_GENERATOR_TO_RUN}}
Pass criteria: {{SPECIFIC_PASS_CONDITIONS}}
On failure:  {{SPECIFIC_FAILURE_ACTION}}
Blocks:      Step {{NEXT_STEP}} cannot begin until this checkpoint passes
```

---

## Checkpoint 3.V: Tribunal Verdict Completeness

**Trigger:** Immediately after Step 3 (Tribunal Process) completes

**Scope:** `{{TRIBUNAL_OUTPUT_PATH}}/` — all tribunal deliverables

**What to check:**

| Check | How | Pass Condition |
|-------|-----|----------------|
| Executive summary exists | File exists at `{{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md` | File exists AND word count >= 500 |
| Roadmap exists | File exists at `{{TRIBUNAL_OUTPUT_PATH}}/roadmap.md` | File exists AND contains MoSCoW priorities |
| Implementation specs exist | Glob `{{TRIBUNAL_OUTPUT_PATH}}/implementation-specs/*.md` | At least 1 file exists per "Must Have" feature |
| Verdict exists | File exists at `{{TRIBUNAL_OUTPUT_PATH}}/verdict.md` or `VERDICT.md` | File exists AND contains final recommendation |
| Features enumerated | Roadmap contains feature list | At least 5 features identified with priority levels |
| Services identified | Implementation specs name specific services | At least 2 distinct services named |
| Tech stack decided | Executive summary or verdict names specific technologies | Framework, database, and auth approach specified |

**Validator to run:** Manual file-existence check + word count verification (no generator needed — these are structural checks).

**On failure:**

| Failure Type | Action |
|--------------|--------|
| Missing file | **BLOCK.** Report: "Tribunal incomplete — missing {{FILE}}. Cannot proceed to service spec generation." |
| File exists but too short (<500 words for summary, <200 words for specs) | **WARN.** Report: "{{FILE}} exists but appears to be a stub ({{ACTUAL}} words, minimum {{REQUIRED}}). Tribunal may need to expand this before specs can be generated from it." |
| No MoSCoW priorities in roadmap | **BLOCK.** Report: "Roadmap does not contain MoSCoW priority assignments. PHASE-GENERATOR needs Must/Should/Could/Won't to assign phases." |
| No services identified | **BLOCK.** Report: "No distinct services identified in tribunal output. SERVICE-HUB-GENERATOR cannot run without service boundaries." |

**Blocks:** Step 5 (Service Spec Generation)

---

## Checkpoint 5.V: Service Spec Depth

**Trigger:** Immediately after Step 5 (Service Specs) completes — run on EACH spec as it's generated, not after all specs are done

**Scope:** Each `dev_docs/specs/services/*.md` file, individually

**What to check:**

| Check | Validator | Pass Condition |
|-------|-----------|----------------|
| Word count | MECHANICAL-DEPTH-CHECKER (Check 1) | >= 1500 words per service spec |
| Required sections present | MECHANICAL-DEPTH-CHECKER (Check 2) | 8/8 required sections: Business Rules, Data Model, API Endpoints, Validation, Error Scenarios, Edge Cases, Auth Matrix, Dependencies |
| No shallow indicators | MECHANICAL-DEPTH-CHECKER (Check 3) | <= 3 red-flag phrases per file |
| Error codes present | MECHANICAL-DEPTH-CHECKER (Check 4) | >= 10 error codes per service spec |
| Endpoint count | MECHANICAL-DEPTH-CHECKER (Check 5) | >= 7 endpoints per service spec |
| Business rule specificity | MECHANICAL-DEPTH-CHECKER (Check 8) | >= 80% of business rules contain specific values |
| Quantitative score | DEPTH-AUDITOR scoring | >= 8/10 |

**Validator to run:** MECHANICAL-DEPTH-CHECKER on the individual spec file. This is a subset of the full depth audit — only the checks relevant to service specs.

**On failure:**

| Failure Type | Action |
|--------------|--------|
| Score < 6/10 | **BLOCK + REGENERATE.** Run REGENERATOR targeting all failing sections. This spec is too shallow to build on. |
| Score 6-7/10 | **WARN + REGENERATE.** Run REGENERATOR targeting failing sections. Proceed to next spec generation while regeneration runs. |
| Score >= 8/10 | **PASS.** Proceed. |
| Any red-flag phrases found | **REGENERATE** those specific sections regardless of overall score. Red flags indicate lazy output that will cascade. |

**Per-spec execution:** Do NOT batch all service specs and then validate. Validate spec #1 before generating spec #2. This prevents the same shallow pattern from being repeated across all specs.

**Blocks:** Step 6 (Screen Specs) — all service specs must pass before screen specs begin

---

## Checkpoint 6.V: Screen Spec Consistency

**Trigger:** Immediately after Step 6 (Screen Specs) completes — run on EACH screen spec individually

**Scope:** Each `dev_docs/specs/screens/*.md` file

**What to check:**

| Check | How | Pass Condition |
|-------|-----|----------------|
| Word count | MECHANICAL-DEPTH-CHECKER (Check 1) | >= 800 words per screen spec |
| Required sections present | MECHANICAL-DEPTH-CHECKER (Check 2) | 7/7: States, Interactions, Edge Cases, Accessibility, Component Tree, Responsive, Data Requirements |
| All 4 basic states present | Pattern match in States section | Loading, Error, Empty, Populated all present |
| State count | MECHANICAL-DEPTH-CHECKER (Check 6) | >= 6 states per screen |
| Referenced service exists | Cross-reference against `dev_docs/specs/services/` | Every service mentioned in the screen spec has a corresponding service spec |
| Referenced endpoints exist | Cross-reference Data Requirements section against service spec endpoints | Every API endpoint the screen calls is listed in the parent service's endpoint table |
| Referenced components use PascalCase | Pattern match | All component names match `[A-Z][a-zA-Z]+` pattern |

**Validator to run:** MECHANICAL-DEPTH-CHECKER (screen-specific checks) + custom cross-reference checks.

**Cross-reference validation procedure:**

1. Read the screen spec's "Data Requirements" or "API" section
2. Extract every endpoint reference (METHOD + PATH pattern)
3. Look up each endpoint in the parent service spec's API Endpoints table
4. If an endpoint is referenced but does not exist in the service spec:
   - Report: "Screen spec {{SCREEN}} references {{METHOD}} {{PATH}} but this endpoint is not defined in {{SERVICE_SPEC}}. Either the screen spec is wrong or the service spec is missing an endpoint."

**On failure:**

| Failure Type | Action |
|--------------|--------|
| Missing service reference | **BLOCK.** The screen references a service that doesn't have a spec. Either the tribunal missed a service or the screen is mis-categorized. |
| Missing endpoint reference | **WARN.** Log the gap. The endpoint may need to be added to the service spec — run REGENERATOR on the service spec's API section. |
| Shallow screen spec (< 6/10) | **REGENERATE.** Target failing sections via REGENERATOR. |
| Missing basic states | **REGENERATE.** Specifically target the States section — all 4 basics (Loading, Error, Empty, Populated) must be present. |

**Blocks:** Step 8 (Task Generation)

---

## Checkpoint 8.V: Task File Cross-Reference

**Trigger:** Immediately after Step 8 (Task Generation) completes

**Scope:** All task files in `dev_docs/tasks/**/*.md` + `dev_docs/STATUS.md`

**What to check:**

| Check | How | Pass Condition |
|-------|-----|----------------|
| Task ID uniqueness | Parse all task files, extract IDs | Zero duplicate task IDs across all files |
| Task ID in STATUS.md | Cross-reference each task file's ID against STATUS.md | Every task file has a corresponding entry in STATUS.md |
| STATUS.md tasks have files | Cross-reference each STATUS.md entry against task files on disk | Every STATUS.md entry has a corresponding task file |
| Referenced specs exist | Parse each task's "Context Header" file paths | Every file path listed in the context header actually exists on disk |
| Referenced task dependencies exist | Parse each task's "Dependencies" field | Every task ID listed as a dependency has a corresponding task file |
| No circular dependencies | Build dependency graph, check for cycles | Zero cycles detected |
| Acceptance criteria count | Count `- [ ]` items in Acceptance Criteria section | >= 2 acceptance criteria per task |
| Word count | Count words per task file | >= 350 words per task |
| Effort estimation present | Check for S/M/L/XL in metadata | Every task has an effort estimate |
| Phase assignment valid | Check Phase field | Every task assigned to Phase 0, 1, or 2 |

**Validator to run:** CROSS-REFERENCE-VALIDATOR (Check 4: Task IDs → Task Files) + custom structural checks.

**Cross-reference validation procedure:**

1. Glob all task files: `dev_docs/tasks/**/*.md`
2. Parse each file — extract Task ID, Dependencies, Context Header paths
3. Build a set of all task IDs
4. For each dependency reference, verify the target ID exists in the set
5. Build a directed graph from dependencies, run topological sort to detect cycles
6. Parse STATUS.md, extract all task IDs, compare against file set

**On failure:**

| Failure Type | Action |
|--------------|--------|
| Duplicate task ID | **BLOCK.** Report both files. One must be renamed. |
| Orphan task file (not in STATUS.md) | **WARN.** Add the missing entry to STATUS.md. |
| Phantom STATUS.md entry (no file) | **WARN.** Either create the task file or remove the STATUS.md entry. |
| Missing dependency target | **BLOCK.** Report: "Task {{TASK_ID}} depends on {{MISSING_ID}} which does not exist. Either create {{MISSING_ID}} or remove the dependency." |
| Circular dependency | **BLOCK.** Report the cycle: "Circular dependency detected: {{TASK_A}} → {{TASK_B}} → {{TASK_C}} → {{TASK_A}}. Break the cycle by removing one dependency." |
| Context file path does not exist | **WARN.** Report: "Task {{TASK_ID}} references {{PATH}} in its context header, but this file does not exist. The developer will not be able to read the required context." |
| Insufficient acceptance criteria | **REGENERATE.** Task specs with < 2 criteria are too vague to implement. |

**Blocks:** Step 10 (Service Hubs) — task files must be structurally valid before hub generation

---

## Checkpoint 10.V: Service Hub Coverage

**Trigger:** Immediately after Step 10 (Service Hub Generation) completes

**Scope:** `dev_docs/specs/services/` (hub files) + `dev_docs/services/_index.md`

**What to check:**

| Check | How | Pass Condition |
|-------|-----|----------------|
| Every service has a hub | Compare service specs against hub files | For every `dev_docs/specs/services/{service}.md` spec, a hub section exists |
| Hub index exists | File exists at `dev_docs/services/_index.md` | File exists AND lists all services |
| Hub index count matches | Count entries in index vs hub files | Index entry count = hub file count |
| Every hub has required sections | Parse each hub file for section headers | Overview, Business Rules, Data Model, API Endpoints, Screens, Implementation Status all present |
| Screen entries in hub match screen catalog | Cross-reference hub Screens table against `dev_docs/specs/screen-catalog.md` | Every screen in the hub is also in the screen catalog, and vice versa for that service |
| Task IDs in hub reference real tasks | Cross-reference task IDs in hub against task files | Every task ID mentioned in the hub has a corresponding file in `dev_docs/tasks/` |

**Validator to run:** Custom structural checks + CROSS-REFERENCE-VALIDATOR (partial — checks 1, 2, 4).

**On failure:**

| Failure Type | Action |
|--------------|--------|
| Service without hub | **BLOCK.** Run SERVICE-HUB-GENERATOR for the missing service. |
| Hub missing required sections | **REGENERATE.** Run REGENERATOR targeting the hub file's missing sections. |
| Hub-catalog screen mismatch | **WARN.** Report discrepancy. Either update the hub or update the screen catalog. |
| Orphan task ID in hub | **WARN.** Report: "Hub for {{SERVICE}} references task {{TASK_ID}} which does not exist. Remove the reference or create the task." |

**Blocks:** Step 11+ (downstream generators that consume hub files)

---

## Checkpoint Summary Table

| Checkpoint | After Step | Validators Used | Blocks Step | Critical Checks |
|------------|-----------|-----------------|-------------|-----------------|
| 3.V | 3 (Tribunal) | File existence + word count | 5 | Missing files, no MoSCoW, no services |
| 5.V | 5 (Service Specs) | MECHANICAL-DEPTH-CHECKER, DEPTH-AUDITOR | 6 | Word count, sections, red flags, score < 8 |
| 6.V | 6 (Screen Specs) | MECHANICAL-DEPTH-CHECKER + cross-ref | 8 | Missing states, orphan endpoints, score < 7 |
| 8.V | 8 (Task Files) | CROSS-REFERENCE-VALIDATOR + structural | 10 | Duplicate IDs, circular deps, missing refs |
| 10.V | 10 (Service Hubs) | Custom + CROSS-REFERENCE-VALIDATOR | 11+ | Missing hubs, section gaps, catalog mismatches |

---

## Validation Execution Protocol

### Step-by-step procedure for running a checkpoint:

1. **Announce the checkpoint:** Log `"CHECKPOINT {{STEP}}.V: Starting {{NAME}} validation..."`
2. **Run all checks:** Execute each check in the table sequentially
3. **Collect results:** Build a results table with PASS/WARN/FAIL per check
4. **Determine gate verdict:**
   - All PASS → **GATE OPEN** — proceed to next step
   - Any WARN, zero FAIL → **GATE OPEN WITH WARNINGS** — proceed but log warnings for later review
   - Any FAIL → **GATE BLOCKED** — execute failure action (regenerate, block, or report)
5. **On BLOCKED:** Run the specified failure action. After remediation, re-run the checkpoint.
6. **Max checkpoint re-runs:** 3 per step. After 3 failures, escalate to human with full failure report.
7. **Log the result:** Append to `dev_docs/completeness/validation-checkpoints.log`:

```
{{TIMESTAMP}} | CHECKPOINT {{STEP}}.V | {{PASS|WARN|BLOCKED}} | {{SUMMARY}}
  Checks: {{PASS_COUNT}} pass, {{WARN_COUNT}} warn, {{FAIL_COUNT}} fail
  {{#IF BLOCKED}}Failure: {{SPECIFIC_FAILURE}}{{/IF}}
  {{#IF REMEDIATION}}Remediation: {{ACTION_TAKEN}}{{/IF}}
```

---

## Anti-Cascade Guarantee

The checkpoints above are designed to catch the following cascade scenarios:

| Without Validation | With Validation |
|-------------------|-----------------|
| Tribunal misses a service → no spec for it → no screens → no tasks → discovered at Step 16 as a gap → re-do Steps 3-16 | Checkpoint 3.V catches missing service → tribunal re-runs for that service only → 1 step re-done |
| Service spec has 4 endpoints instead of 12 → screen specs reference missing endpoints → tasks reference missing screens → cascade of broken references | Checkpoint 5.V catches low endpoint count → REGENERATOR expands the spec → downstream generators work from complete input |
| Screen spec missing Error state → task file doesn't include error handling task → no error UI in production → user sees blank screen on API failure | Checkpoint 6.V catches missing basic states → screen spec regenerated → task generation includes error handling |
| Task file references nonexistent dependency → developer blocked with no explanation → wastes a sprint investigating | Checkpoint 8.V catches missing dependency → fixed before any developer sees the task |
| Service hub missing for one service → no central reference → developers implement from scattered sources → inconsistencies | Checkpoint 10.V catches missing hub → generated before development begins |

---

## Integration with REGENERATOR

When a checkpoint triggers a REGENERATE action:

1. The checkpoint passes the specific failure data to REGENERATOR (see REGENERATOR.md Step 1)
2. REGENERATOR targets ONLY the failing sections
3. After regeneration, the checkpoint re-runs (not the full step — just the validation)
4. If the checkpoint passes, proceed
5. If the checkpoint fails again, REGENERATOR attempts again (max 3 total)
6. After 3 failures, escalate to human — the checkpoint remains BLOCKED

This tight loop ensures problems are fixed at their source, not papered over downstream.
