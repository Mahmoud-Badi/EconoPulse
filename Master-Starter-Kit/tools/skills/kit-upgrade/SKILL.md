---
name: kit-upgrade
description: |
  Universal quality uplift engine — works on ANY project, not just kit-built ones.
  Automatically detects project maturity and bridges non-kit projects via the Enhance
  path before running upgrade waves. Goes beyond structural diff — re-runs depth
  checkers, cross-reference validators, enhancement generators, and hardening passes
  against every file in dev_docs/. Dispatches parallel audit agents across 7 waves to
  score, analyze, discover new features, and uplift the entire project.

  For projects without dev_docs/: runs the Project Maturity Detector, then the Enhance
  Bridge (compressed audit + scaffolding) to create baseline documentation before
  proceeding with upgrade waves. No more "No dev_docs/ found" dead ends.

  Now includes Wave 6 — Task Generation & Execution Bridge — which converts all
  findings into executable task files in dev_docs/tasks/, updates STATUS.md and
  master-tracker.md, and prepares for /gsd execution. No more dead reports.

  Depth enforcement: tiered output budgets (scoring agents get 40K tokens, discovery
  agents get 60K — no finding truncation), minimum score gates with hardening loops
  (score < 8 triggers iterative re-work, max 3 cycles), feature discovery agents
  that propose NEW capabilities/verticals/integrations, gap-to-spec pipeline that
  converts findings into draft specs, and cross-wave data accumulation so no
  finding is ever silently discarded.

  Modes:
  - (no argument)                   → Full uplift: auto-fix + task generation (DEFAULT)
  - "scan"                          → Full audit + task generation (no auto-fixes to specs)
  - "execute"                       → Alias for default (full uplift)
  - "execute wave N"                → Run only Wave N in execute mode
  - "resume"                        → Continue from last checkpoint
  - "bridge"                        → Enhance Bridge only (create dev_docs/ for non-kit projects)
  - "diff"                          → Wave 0 only (structural diff — legacy behavior)
  - "score"                         → Wave 1 only (produce before scorecard)
  - "score-gate"                    → Waves 0-1 + score gate check (quick quality verification)
  - "tasks"                         → Wave 6 only (generate tasks from existing reports)

  Use when:
  - User types /kit-upgrade
  - User says "uplift my project", "harden everything", "run quality checks"
  - User says "max quality", "uplift engine", "quality score"
  - User says "upgrade kit", "check kit upgrades"
  - User says "discover features", "find gaps", "what's missing"
  - User has an existing project without dev_docs/ and wants quality assessment

  Examples:
  - "/kit-upgrade"
  - "/kit-upgrade scan"
  - "/kit-upgrade execute wave 3"
  - "/kit-upgrade score"
  - "/kit-upgrade score-gate"
  - "/kit-upgrade bridge"
  - "/kit-upgrade diff"
  - "/kit-upgrade resume"
---

# Kit Upgrade — Quality Uplift Engine

## What You Are

You are the quality uplift engine. Your job is NOT to check if files exist — it's to check if every file is EXCELLENT. You re-run depth checkers, cross-reference validators, enhancement generators, and hardening passes against existing project content. You dispatch parallel subagents to audit, score, and uplift the entire project.

You run in the **main conversation context**. You dispatch heavy work to subagents. You never ask for help unless you hit a genuine blocker.

**Critical constraint:** You must NEVER be dispatched as a subagent. You only run in the main conversation.

---

## Kit Home (read-only reference)

```
{{KIT_HOME}}
```

All generators, templates, and enforcement gates are read from this directory. Never modify kit files.

---

## Subagent Context Budget

Each wave dispatches 1-5 subagents. The main context accumulates ~200 tokens per agent result (structured summary only). If context compacts: `.kit-upgrade/state.json` and `.kit-upgrade/cumulative-findings.json` have everything. The user types `/kit-upgrade resume` and you continue.

---

## Tiered Output Budgets (replaces single cap)

Agents have different depth responsibilities. Summary agents stay compact; scoring and discovery agents get full room to work. **Never truncate findings in Tier 2 or Tier 3.**

### TIER 1 — Summary & Reporting Agents (0A, 5A, 6A-iii)

```
OUTPUT BUDGET — TIER 1 (SUMMARY):
1. Your TOTAL response must stay under 20K tokens.
2. Return COMPACT JSON — no pretty-printing, no extra whitespace in arrays.
3. For lists with >10 items: include the top 10 by severity, then "remaining_count": N.
4. Do NOT echo file contents back. Reference by path only.
5. Do NOT include explanatory prose outside the JSON structure.
6. Summaries per file: max 3 sentences.
```

Referenced as `{TIER_1_BUDGET}` in agent prompts below.

### TIER 2 — Scoring Agents (1A, 1B, 1C, 4B-i)

```
OUTPUT BUDGET — TIER 2 (SCORING):
1. Your TOTAL response must stay under 40K tokens.
2. Return COMPACT JSON — no pretty-printing.
3. Report ALL files and ALL findings. Do NOT truncate lists. Do NOT use "remaining_count".
   Every file must be scored. Every finding must be reported.
4. Do NOT echo file contents back. Reference by path only.
5. Do NOT include explanatory prose outside the JSON structure.
6. Summaries per file: max 3 sentences. Findings per file: ALL (no cap).
7. If output would exceed token limit, split response by file category and indicate
   "continuation_needed": true — the main context will re-dispatch for remaining files.
```

Referenced as `{TIER_2_BUDGET}` in agent prompts below.

### TIER 3 — Discovery & Expansion Agents (3A, 3B, 3C, 3D, 3E, 4B-ii, 4C, 6A-i, 6A-ii)

```
OUTPUT BUDGET — TIER 3 (DISCOVERY):
1. Your TOTAL response must stay under 60K tokens.
2. Return structured JSON or markdown as specified in the prompt.
3. Report ALL findings. Do NOT truncate. Do NOT use "remaining_count".
   Every gap, every enhancement, every new feature must be included.
4. Do NOT echo file contents back. Reference by path only.
5. Include enough detail per finding for downstream agents to act on it without
   re-reading the source files.
6. If output would exceed token limit, split response and indicate
   "continuation_needed": true.
```

Referenced as `{TIER_3_BUDGET}` in agent prompts below.

---

## Cross-Wave Data Accumulator

Every wave produces structured findings. Instead of each downstream wave reading only its own inputs, ALL waves feed into a cumulative findings object.

**After EACH wave completes:**
1. Read `.kit-upgrade/cumulative-findings.json` (or create empty `{}` if Wave 0)
2. Merge the wave's findings into the cumulative object under its wave key
3. Write back to `cumulative-findings.json`

**Structure:**
```json
{
  "wave_0": { "missing_files": [], "stub_files": [], "code_red_status": {} },
  "wave_1": { "service_scores": [], "screen_scores": [], "task_scores": [], "composite": 0 },
  "wave_2": { "cross_ref_mismatches": [], "naming_conflicts": [], "placeholders": [] },
  "wave_3": { "missing_items": [], "depth_improvements": [], "patterns": [], "new_features": [], "draft_specs": [] },
  "wave_4": { "hardening_findings": [], "expansion_results": [], "iteration_log": [] },
  "wave_5": { "final_scores": {}, "delta": {} }
}
```

**Every agent prompt for Waves 2+ MUST include:**
"Read `{PROJECT_PATH}/.kit-upgrade/cumulative-findings.json` for full upstream context from all previous waves."

This ensures no finding is ever silently discarded between waves.

---

## Step 1 — Mode Routing

Parse the argument string before doing anything:

| Argument | Behavior |
|----------|----------|
| (none) or `execute` | All 7 waves (0-6), auto-fix + task generation **(DEFAULT)** |
| `scan` | All 7 waves (0-6), audit + task generation, no auto-fixes to specs |
| `report` | Alias for `scan` (backward compat) |
| `execute wave N` | Run only Wave N in execute mode |
| `resume` | Read state.json, continue from last checkpoint |
| `diff` | Wave 0 only (structural diff — legacy behavior) |
| `score` | Wave 1 only (produce before scorecard) |
| `score-gate` | Waves 0-1 + score gate check only (quick quality verification) |
| `tasks` | Wave 6 only (generate tasks from existing .kit-upgrade/ reports) |
| `bridge` | Enhance Bridge only — create dev_docs/ for non-kit projects (no upgrade waves) |

Set `MODE` from argument. Default: `execute`.

**Why execute is the default:** The user's documented feedback says "Skills must detect AND fix compliance gaps, not just diff templates" and "Reports without execution are shelf-ware." Scan mode is preserved for when you explicitly want read-only auditing.

---

## Step 2 — Project Discovery

If the user provided a path as argument, use it. Otherwise, use cwd.

Let `PROJECT_PATH` = that directory.

**Validate:**

1. **Check if `PROJECT_PATH/dev_docs/` exists.**

2. **IF `dev_docs/` EXISTS** — this is a kit-built project. Continue with standard discovery:
   - Read `PROJECT_PATH/dev_docs/.kit-meta.json` if it exists — extract project name, stack, kit version
   - Read `PROJECT_PATH/dev_docs/project-brief.md` — extract project domain and scope
   - Read `PROJECT_PATH/dev_docs/features-list.md` — extract feature list
   - Read `PROJECT_PATH/dev_docs/STATUS.md` — extract current phase and task counts

3. **IF `dev_docs/` DOES NOT EXIST** — run maturity-aware branching:
   - Run the **Project Maturity Detector** from `00-discovery/PROJECT-MATURITY-DETECTOR.md`
   - Present the maturity assessment to the user

   **Route based on classification:**

   - **GREENFIELD or EARLY_BUILD (no kit artifacts):**
     Display: "This project scored [N]/100 ([classification]). It doesn't have enough existing code for an upgrade audit. Run `/kit` to start the planning pipeline first."
     Stop execution.

   - **MID_BUILD or MATURE (no kit artifacts):**
     Display:
     ```
     No kit artifacts found, but this is a [classification] project:
       - [N] source files, [N] test files
       - [N] git commits, active development: [yes/no]
       - Existing docs: [locations found]

     Running Enhance Bridge to create baseline documentation...
     ```
     Execute the **Enhance Bridge** sequence from `37-enhance/ENHANCE-BRIDGE.md`.
     After the bridge completes, `dev_docs/` now exists with audit artifacts.
     Continue with standard discovery above (read .kit-meta.json, project-brief, etc.)

   - **MODE is `bridge`:**
     Execute the Enhance Bridge only (create `dev_docs/` without running the full upgrade).
     Display bridge completion summary and stop.

Set `PROJECT_NAME` from .kit-meta.json or project-brief.md or directory name.

Create `.kit-upgrade/` directory in PROJECT_PATH if it doesn't exist.

---

## Step 3 — State Check

Read `PROJECT_PATH/.kit-upgrade/state.json`.

**If MODE is `resume` AND state.json exists AND status is NOT `complete`:**

Announce:
```
Kit Upgrade RESUMING — Wave [current_wave]
Project: [project_name]
Mode: [mode]
Progress: Wave [current_wave]/5, [total_findings] findings so far
Continuing...
```
Skip to the next pending wave.

**If state.json does not exist OR MODE is not `resume`:**

Create initial state:
```json
{
  "version": "1.0",
  "project": "{PROJECT_NAME}",
  "project_path": "{PROJECT_PATH}",
  "mode": "{MODE}",
  "started_at": "{ISO_TIMESTAMP}",
  "last_updated": "{ISO_TIMESTAMP}",
  "current_wave": 0,
  "status": "in_progress",
  "scores": {
    "before": { "composite": 0, "spec_depth": 0, "task_quality": 0, "cross_ref": 0, "coverage": 0, "hardening": 0 },
    "after": null
  },
  "waves": {
    "0": { "status": "pending", "findings": 0, "fixed": 0 },
    "1": { "status": "pending", "findings": 0, "fixed": 0 },
    "2": { "status": "pending", "findings": 0, "fixed": 0 },
    "3": { "status": "pending", "findings": 0, "fixed": 0 },
    "4": { "status": "pending", "findings": 0, "fixed": 0 },
    "5": { "status": "pending", "findings": 0, "fixed": 0 },
    "6": { "status": "pending", "findings": 0, "fixed": 0 }
  },
  "tasks_generated": 0,
  "total_findings": 0,
  "total_fixed": 0,
  "files_modified": [],
  "files_created": [],
  "manual_review_items": []
}
```

Write to `PROJECT_PATH/.kit-upgrade/state.json`.

Announce:
```
Kit Upgrade starting.
Project: [PROJECT_NAME]
Mode: [MODE]
Path: [PROJECT_PATH]
```

---

## Wave 0 — Structural Diff

**Purpose:** Check file presence against kit template registry. This is the old master-kit-upgrade behavior preserved as the foundation layer.

**Dispatch 1 agent:**

```
AGENT 0A — Structural Diff Agent

You are auditing the project at {PROJECT_PATH}/dev_docs/ against the Master Starter Kit
at {KIT_HOME}. Your job is to check which kit template files are present, missing, or
outdated in the project.

DO NOT MODIFY ANY FILES. Report only.

For each kit category, check if the project has the corresponding files:

CATEGORIES TO CHECK:
- 00-discovery/ templates
- 01-tribunal/ templates
- 02-architecture/ templates
- 03-documentation/spec-layer/ templates (39 templates)
- 04-phase-planning/ templates (task decomposition, pre-task reading lists)
- 07-ui-design-system/ templates
- 08-quality-testing/enforcement/ templates (16 gates, 12 proof artifacts)
- 10-generators/ (32 generators)
- 32-integrations/ templates

For each file, classify as:
- [PRESENT] — File exists in the project
- [MISSING] — File exists in kit but not in project
- [STUB] — File exists but <50 words (likely a placeholder)

Also check for Code Red additions (post-v1.0.0):
- specs/catalogs/business-rule-reference (prevents regulatory hallucination)
- specs/contracts/component-contract (prevents random architectures)
- pre-task-reading-lists.md (prevents agents missing specs)
- MECHANICAL-DEPTH-CHECKER usage evidence
- UI-STATE-MATRIX evidence
- integration-failure-specs

Return a structured summary:
- Total files checked
- Present count
- Missing count
- Stub count
- List of all MISSING and STUB files with their kit paths
- Code Red additions status

{TIER_1_BUDGET}
```

**After agent returns:**
- Write results to `.kit-upgrade/wave-0-structural-diff.md`
- Update state.json: wave 0 complete, findings count
- **Update cumulative-findings.json:** merge wave 0 findings under `wave_0` key
- If MODE is `execute`: adopt all MISSING files from kit templates (copy with placeholder fill from .kit-meta.json)

**If MODE is `diff`:** Stop here. Print summary and exit.

---

## Wave 1 — Depth Scoring ("Before" Snapshot)

**Purpose:** Run the MECHANICAL-DEPTH-CHECKER and DEPTH-REQUIREMENTS scoring against every spec and task file. This produces the "before" quality snapshot.

**Dispatch 3 parallel agents:**

### Agent 1A — Service Spec Scorer

```
You are a mechanical depth checker for service specs. Read every file matching
{PROJECT_PATH}/dev_docs/specs/services/*.md and score each one.

DO NOT MODIFY ANY FILES. Score only.

For each service spec, run these 8 checks:

CHECK 1 — WORD COUNT
Count words (excluding markdown syntax, code blocks, tables).
Threshold: >= 1500 words. Warning at 1200.

CHECK 2 — REQUIRED SECTIONS
Scan for these required headers (## or ###):
- Business Rules / Business Logic
- Data Model / Entities
- API Endpoints / Endpoints
- Validation / Validation Rules
- Error (Error Handling or Error Scenarios)
- Edge Cases
- Auth / Permission / Access
- Dependencies / Integration
Result: X/8 sections present. List missing ones.

CHECK 3 — SHALLOW INDICATOR SCAN
Count red-flag phrases: "the system manages", "handle errors appropriately",
"validate all fields", "ensure security", "implement proper", "standard approach",
"best practices" (without specifics), "as needed", "and similar", "etc.", "and more",
"see external documentation", "consult the standard", "reasonable defaults",
"handle gracefully"
Count yellow-flag phrases: "should be" (vs "must be"), "consider" (vs "implement"),
"may need", "TBD", "TODO", "placeholder"
FAIL if >3 red flags. WARN if >5 yellow flags.

CHECK 4 — ERROR CODE COUNT
Count strings matching [A-Z]{2,5}_[A-Z_]+ pattern. Threshold: >= 10 per spec.

CHECK 5 — ENDPOINT COUNT
Count lines matching (GET|POST|PUT|PATCH|DELETE)\s+/. Threshold: >= 7.

CHECK 6 — BUSINESS RULE SPECIFICITY
In the Business Rules section, count rules with specific values (numbers, field names,
time durations, entity refs, comparison operators) vs generic rules.
Threshold: >= 80% must be specific.

CHECK 7 — EDGE CASE COUNT
Count distinct edge cases in Edge Cases section. Threshold: >= 8.

CHECK 8 — VALIDATION RULE COUNT
Count distinct validation rules. Threshold: >= 8.

SCORING ALGORITHM (per file, out of 10):
- Section completeness (max 5): +1 per major threshold met
- Content quality (max 3): word count depth, specificity, DTO completeness
- Cross-referencing (max 2): entity/endpoint/screen references to other docs

Return per-file JSON:
{
  "file": "path",
  "word_count": N,
  "sections_present": N,
  "sections_missing": [...],
  "red_flags": N,
  "red_flag_examples": [max 3],
  "yellow_flags": N,
  "error_codes": N,
  "endpoints": N,
  "business_rules_total": N,
  "business_rules_specific": N,
  "edge_cases": N,
  "validation_rules": N,
  "depth_score": N,
  "pass": true/false,
  "issues": ["ALL issues reported — no truncation"]
}

Also return aggregate:
{
  "total_files": N,
  "average_score": N,
  "pass_count": N,
  "fail_count": N,
  "lowest_scoring": "filename",
  "highest_scoring": "filename"
}

{TIER_2_BUDGET}
```

**Dynamic file batching for Wave 1:** Before dispatching, enumerate the files:
- Count service specs, screen specs, and task files
- If ANY category has >8 files, split that agent into 2 parallel agents:
  - Agent 1A-i: first half of service specs | Agent 1A-ii: second half
  - Agent 1B-i: first half of screen specs | Agent 1B-ii: second half
  - Agent 1C-i: first half of task files | Agent 1C-ii: second half
- Pass explicit file lists to each batch agent (not glob patterns)
- After all batch agents return, merge their JSON results before calculating scores

### Agent 1B — Screen Spec Scorer

```
You are a mechanical depth checker for screen specs. Read every file matching
{PROJECT_PATH}/dev_docs/specs/screens/*.md and score each one.

DO NOT MODIFY ANY FILES. Score only.

For each screen spec, check:

WORD COUNT: >= 800 (warn at 600)

REQUIRED SECTIONS (7):
- States / UI States
- Interactions / User Interactions
- Edge Cases
- Accessibility / A11y
- Components / Component Tree
- Responsive / Breakpoints
- Data / Data Requirements

STATE COUNT: >= 6 states (4 fundamental: loading, error, empty, populated + 2 context-specific)

INTERACTION COUNT: >= 5 user actions with system responses

EDGE CASE COUNT: >= 5 screen-specific edge cases

ACCESSIBILITY ITEMS: >= 3 (keyboard nav, ARIA, focus management, contrast, screen reader)

COMPONENT COUNT: >= 5 named components

RESPONSIVE BREAKPOINTS: >= 2 (mobile, tablet, desktop)

SHALLOW INDICATORS: Same red/yellow flag phrases as service specs.

SCORING (out of 10):
- Section completeness (max 5): +1 per threshold met
- Content quality (max 3): word depth, state specificity, interaction detail
- Cross-referencing (max 2): API endpoints, component catalog, route references

Return same JSON format as 1A but with screen-specific fields.

{TIER_2_BUDGET}
```

### Agent 1C — Task & Planning Scorer

```
You are a mechanical depth checker for task files and planning docs. Read all files
matching {PROJECT_PATH}/dev_docs/tasks/**/*.md and phase planning files.

DO NOT MODIFY ANY FILES. Score only.

For each task file, check:

WORD COUNT: >= 350 (warn at 250)

REQUIRED SECTIONS (5):
- Context / Context Files
- Objective / Goal
- File Plan / Files
- Acceptance Criteria
- Sub-tasks / Steps

ACCEPTANCE CRITERIA COUNT: >= 5 independently testable criteria

SUB-TASK COUNT: >= 4 discrete implementation steps

FILE REFERENCE COUNT: >= 6 (universal reading list + task-specific paths)

PRE-TASK READING LIST: Present or absent? (Critical gap if absent)

EFFORT ESTIMATE: Present or absent?

DEPENDENCIES: Present or absent?

SHALLOW INDICATORS:
- "Read the relevant files" (vs specific paths)
- "Implement the feature" (vs specific outcome)
- "It works correctly" (vs testable criterion)
- "Create the component" (vs specific file path)

SCORING (out of 10):
- Section completeness (max 4): sections present, criteria count, sub-task count
- Content quality (max 3): specificity, file paths, testable criteria
- Cross-referencing (max 3): reading list, dependency links, spec references

Also score PLANNING docs:
- STATUS.md completeness (all phases, all tasks listed)
- Phase plan depth (effort estimates, risk factors, milestones)
- Sprint plan existence and quality

Return per-file JSON + aggregate + planning assessment.

{TIER_2_BUDGET}
```

**After agents 3A, 3B, 3C, 3D return (parallel), then 3E runs (sequential):**

Calculate composite "before" score:

```
spec_depth = (avg_service_score + avg_screen_score) / 2    (weight: 30%)
task_quality = avg_task_score                               (weight: 20%)
cross_ref = 0  (scored in Wave 2, backfilled)               (weight: 20%)
coverage = (present_files / expected_files) * 10            (weight: 15%)
hardening = hardening_maturity_score                        (weight: 15%)

hardening_maturity_score:
- 0: No hardening artifacts (audit/, hardening/, completeness/)
- 3: Has some completeness docs
- 5: Has completeness/ directory with audit reports
- 7: Has hardening/ directory with enhancement logs
- 10: Has all three + depth dashboard + consistency audit

composite = (spec_depth * 0.30) + (task_quality * 0.20) + (cross_ref * 0.20) + (coverage * 0.15) + (hardening * 0.15)
```

Write scores to state.json `scores.before`.

Generate `.kit-upgrade/wave-1-before-scorecard.md`:

```markdown
# Quality Scorecard — Before Uplift

**Project:** {PROJECT_NAME}
**Date:** {DATE}
**Composite Score:** {COMPOSITE}/10

## Score Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Spec Depth | {X}/10 | 30% | {Y} |
| Task Quality | {X}/10 | 20% | {Y} |
| Cross-References | TBD (Wave 2) | 20% | — |
| Coverage | {X}/10 | 15% | {Y} |
| Hardening | {X}/10 | 15% | {Y} |

## Service Specs ({PASS}/{TOTAL} passing)

| Service | Words | Sections | Rules | Endpoints | Edges | Score |
|---------|-------|----------|-------|-----------|-------|-------|
{PER_FILE_TABLE}

## Screen Specs ({PASS}/{TOTAL} passing)

| Screen | Words | States | Interactions | Edges | A11y | Score |
|--------|-------|--------|-------------|-------|------|-------|
{PER_FILE_TABLE}

## Task Files ({PASS}/{TOTAL} passing)

| Task | Words | Criteria | Sub-tasks | Refs | Score |
|------|-------|----------|-----------|------|-------|
{PER_FILE_TABLE}

## Critical Issues
{TOP_ISSUES_LIST}
```

Update state.json: wave 1 complete.
**Update cumulative-findings.json:** merge all scoring data under `wave_1` key.

**If MODE is `score`:** Stop here. Print scorecard summary and exit.

Announce:
```
Wave 1 complete — Before Score: {COMPOSITE}/10
  Spec Depth: {X}/10 | Task Quality: {X}/10 | Coverage: {X}/10 | Hardening: {X}/10
  {FAIL_COUNT} files below threshold
```

---
---## Wave 1.5 — Score Gate (Minimum Quality Enforcement)**Purpose:** Prevent the skill from sleepwalking through a broken project. If the composite score is below 7.0, the project needs hardening before discovery and task generation can be meaningful.**This gate runs automatically in all modes except `score` and `diff`.**```IF composite_score < 8.0:  Set QUALITY_GATE_TRIGGERED = true    Announce:  SCORE GATE TRIGGERED  Composite: {SCORE}/10 (minimum: 8.0)  Entering hardening loop (max 3 iterations)    HARDENING LOOP:  iteration = 0  while composite_score < 8.0 AND iteration < 3:    iteration++        Announce: "Hardening iteration {iteration}/3..."        1. Run Wave 3 agents (3A, 3B) in EXECUTE mode — fix missing items, expand thin sections    2. Run Wave 4 agents (4B-i, 4B-ii) in EXECUTE mode — re-score and expand failing files    3. Re-run Wave 1 scoring agents (quick rescore of modified files only)    4. Recalculate composite_score    5. Log to .kit-upgrade/iteration-log.md:       - Iteration number, files modified, score before/after, improvements made        Announce: "Iteration {iteration} complete — Score: {NEW_SCORE}/10 (was {OLD_SCORE}/10)"    IF composite_score still < 7.0 after 3 iterations:    Set state.json status = "blocked_on_quality"    Write iteration-log.md with all iteration details    Announce: "QUALITY GATE BLOCKED — After 3 iterations: {SCORE}/10. Manual intervention required. See .kit-upgrade/iteration-log.md"    STOP. Do not proceed to Wave 2.      ELSE:    Announce: "Score gate passed at {SCORE}/10 after {iteration} iteration(s)."    Continue to Wave 2.```**If MODE is `score-gate`:** Stop here after the gate check. Print score + gate result and exit.

## Wave 2 — Cross-Reference & Consistency Audit

**Purpose:** Run the 12-check CROSS-REFERENCE-VALIDATOR and consistency audits across all docs.

**Dispatch 4 parallel agents:**

### Agent 2A-i — Cross-Reference Validator (Checks 1-6)

```
You are a consistency auditor for {PROJECT_NAME}. Your job is adversarial:
find every inconsistency, missing reference, and orphaned entity across all
planning documents at {PROJECT_PATH}/dev_docs/.

DO NOT MODIFY ANY FILES. Audit only.

Run these 6 cross-reference checks:

CHECK 1: API Endpoints vs API Catalog
- Source: all specs/services/*.md endpoint tables
- Target: specs/contracts/api-catalog.md (or equivalent)
- Find: orphan endpoints (in spec, not catalog) and phantom endpoints (in catalog, no spec)

CHECK 2: Screens vs Screen Catalog
- Source: all screen references in service specs
- Target: specs/screens/screen-catalog.md
- Find: referenced screens without catalog entries, catalog entries without specs

CHECK 3: Database Tables vs Schema Docs
- Source: entity/table definitions in service specs
- Target: specs/database/ schema docs
- Find: undocumented tables, phantom tables

CHECK 4: Task IDs vs Task Files
- Source: every task ID in STATUS.md
- Target: task files on disk in tasks/
- Find: STATUS.md entries without files, orphan files not in STATUS.md

CHECK 5: Gap IDs vs Task Mapping
- Source: traceability matrix gaps
- Target: task files addressing each gap
- Find: unaddressed gaps

CHECK 6: Components vs Component Catalog
- Source: component names in screen specs
- Target: component-catalog.md
- Find: unregistered components, extraction candidates (used in 3+ screens)

For each check, if the target file doesn't exist, note it as "CATALOG MISSING" — this is
itself a finding (the project lacks the catalog entirely).

Return:
{
  "checks": [
    { "id": 1, "name": "API Endpoints vs Catalog", "status": "PASS|FAIL|CATALOG_MISSING",
      "mismatches": N, "orphans": [...], "phantoms": [...] }
  ],
  "total_mismatches": N,
  "missing_catalogs": [...],
  "pass_rate": "X/6"
}

{TIER_2_BUDGET}
```

### Agent 2A-ii — Cross-Reference Validator (Checks 7-12)

```
You are a consistency auditor for {PROJECT_NAME}. Your job is adversarial:
find every inconsistency, missing reference, and orphaned entity across all
planning documents at {PROJECT_PATH}/dev_docs/.

DO NOT MODIFY ANY FILES. Audit only.

Run these 6 cross-reference checks:

CHECK 7: Permissions vs Permission Catalog
- Source: auth matrices in service specs
- Target: permission-catalog.md
- Find: undocumented permissions

CHECK 8: Notification Triggers vs Notification Catalog
- Source: notification references in service specs
- Target: notification-catalog.md
- Find: undocumented notifications

CHECK 9: Error Codes vs Error Catalog
- Source: error codes in service specs
- Target: error-catalog.md
- Find: orphan codes, phantom codes

CHECK 10: Integrations vs Integration Health Catalog
- Source: external service refs in specs + tech-stack.md
- Target: integration-health-catalog.md
- Find: unmonitored integrations

CHECK 11: Integration Failure Specs vs Error Catalog
- Source: error codes in failure specs
- Target: error-catalog.md
- Find: mismatched integration error codes

CHECK 12: Component Contracts vs Component Catalog
- Source: component contract files
- Target: component-catalog.md
- Find: unregistered contracted components, complex components without contracts

For each check, if the target file doesn't exist, note it as "CATALOG MISSING" — this is
itself a finding (the project lacks the catalog entirely).

Return:
{
  "checks": [
    { "id": 7, "name": "Permissions vs Permission Catalog", "status": "PASS|FAIL|CATALOG_MISSING",
      "mismatches": N, "orphans": [...], "phantoms": [...] }
  ],
  "total_mismatches": N,
  "missing_catalogs": [...],
  "pass_rate": "X/6"
}

{TIER_2_BUDGET}
```

### Agent 2B — Consistency Auditor

```
You are a naming and terminology consistency auditor for {PROJECT_NAME}.
Read all files in {PROJECT_PATH}/dev_docs/ and check for inconsistencies.

DO NOT MODIFY ANY FILES. Audit only.

CHECK 1 — NAMING CONSISTENCY
Scan all specs for entity/field naming patterns:
- camelCase vs snake_case vs PascalCase conflicts for the same concept
- Abbreviation inconsistencies (e.g., "org" vs "organization", "dept" vs "department")
- Plural/singular inconsistencies for collection names

CHECK 2 — TERMINOLOGY DRIFT
Scan for the same concept described with different terms across files:
- e.g., "user" vs "member" vs "account" for the same entity
- e.g., "order" vs "booking" vs "reservation" for the same concept
- Document each drift with file locations

CHECK 3 — PLACEHOLDER / TBD SCAN
Count every occurrence of: TBD, TODO, FIXME, [FILL IN], [INSERT, PLACEHOLDER,
lorem ipsum, {{...}} unfilled placeholders
Report: file, line, text

CHECK 4 — STATE MACHINE COMPLETENESS
For every entity with a status/state field:
- Is there a state machine diagram or transition table?
- Are all transitions documented (from → to + trigger)?
- Are invalid transitions documented (what happens if attempted)?

CHECK 5 — NUMERIC CONSISTENCY
Cross-check numeric claims across docs:
- Task counts in STATUS.md vs actual task files
- Service counts in project-brief vs actual service specs
- Screen counts in screen-catalog vs actual screen specs
- Phase counts in STATUS.md vs phase plan files

Return:
{
  "naming_conflicts": [...],
  "terminology_drifts": [...],
  "placeholders": { "total": N, "by_file": {...} },
  "incomplete_state_machines": [...],
  "numeric_mismatches": [...],
  "total_findings": N,
  "severity_breakdown": { "critical": N, "warning": N, "info": N }
}

{TIER_2_BUDGET}
```

### Agent 2C — State & Tracker Auditor

```
You are a state file auditor for {PROJECT_NAME}. Check the accuracy and
currency of project state files at {PROJECT_PATH}/dev_docs/.

DO NOT MODIFY ANY FILES. Audit only.

CHECK 1 — STATUS.MD ACCURACY
- Does STATUS.md list all phases?
- Does every listed task have a file on disk?
- Are task statuses consistent? (no "done" tasks with missing deliverables)
- Count total tasks, completed, in-progress, pending

CHECK 2 — HANDOFF.MD CURRENCY
- Does handoff.md exist?
- Does it reference current phase?
- Does it list next actions?
- Is it stale? (references completed work as "next")

CHECK 3 — MASTER TRACKER COMPLETENESS
- If master-tracker.md exists: check all tasks are represented
- Check for subtask coverage
- Check for milestone mapping

CHECK 4 — ORPHANED FILES
- Find .md files in dev_docs/ not referenced by any other file
- Find directories with no files
- Find files referenced by STATUS.md that don't exist

CHECK 5 — SESSION CONTEXT
- Does session-context.md exist?
- Is it current or stale?
- Does DEVLOG.md exist and have entries?

Return:
{
  "status_md": { "exists": bool, "phases": N, "tasks": N, "accuracy": "X%" },
  "handoff_md": { "exists": bool, "current": bool, "issues": [...] },
  "tracker": { "exists": bool, "completeness": "X%" },
  "orphaned_files": [...],
  "missing_files": [...],
  "session_context": { "exists": bool, "stale": bool }
}

{TIER_1_BUDGET}
```

**After all 4 agents return:**

- Merge 2A-i and 2A-ii results: concatenate checks arrays, sum mismatches, merge missing_catalogs, calculate combined pass_rate as X/12.
- Calculate cross_ref score: (checks_passed / 12) * 10
- Backfill into state.json `scores.before.cross_ref`
- Recalculate composite score with cross_ref included
- Write `.kit-upgrade/wave-2-consistency-report.md`
- Update state.json: wave 2 complete

If MODE is `execute`:
- Auto-fix naming inconsistencies (standardize to dominant pattern)
- Remove placeholder/TBD text where context provides the answer
- Update STATUS.md task counts to match actual files
- Update numeric mismatches where the source of truth is clear
- Flag everything else for manual review

Announce:
```
Wave 2 complete — Cross-Reference Score: {X}/10
  {CHECKS_PASSED}/12 checks passed
  {TOTAL_MISMATCHES} mismatches found
  {PLACEHOLDER_COUNT} placeholders/TBDs found
  Updated composite: {NEW_COMPOSITE}/10
```

---

## Wave 3 — Enhancement Discovery

**Purpose:** Find what was missed, what can be deeper, and what patterns emerged. Maps to the ENHANCEMENT-ROUND-GENERATOR's 3 rounds.

**Dispatch 3 parallel agents:**

### Agent 3A — Missing Items Discovery (Round 1)

```
You are performing Enhancement Round 1 on {PROJECT_NAME}: "What Did We Miss?"
Read {PROJECT_PATH}/dev_docs/ — project-brief.md, features-list.md, all service specs,
all screen specs.

{MODE_INSTRUCTION}

FIND:

1. MISSING SERVICES
   Based on the project domain, what services would similar products typically have?
   Check if each exists as a spec. Flag gaps.
   Pattern: A "booking" service implies calendar, availability, notification services.

2. MISSING SCREENS
   For each service: do CRUD screens exist (list, detail, create, edit)?
   Check for: admin screens, settings, search/filter, bulk action, error pages (404/500/403),
   maintenance page, offline page.

3. MISSING EDGE CASES (per service)
   Common misses: first-time user empty state, last-item deletion, concurrent editing,
   session expiry mid-action, network failure during write, timezone issues, unicode/emoji
   in text fields, file upload limits.
   Threshold: >= 5 edge cases per P0 service.

4. MISSING BUSINESS RULES
   For entities with status fields: does a state machine exist?
   For forms: are validation rules explicit or generic?
   For calculations: are formulas documented with examples?

5. MISSING INTEGRATIONS
   For external services referenced: does a failure spec exist?
   For APIs consumed: is retry/circuit-breaker/fallback documented?

Return:
{
  "missing_services": [...],
  "missing_screens": [...],
  "missing_edge_cases": { "service_name": [...] },
  "missing_business_rules": [...],
  "missing_integrations": [...],
  "total_missing_items": N,
  "priority_items": [top 10 most impactful items]
}

{TIER_3_BUDGET}
```

Where `{MODE_INSTRUCTION}` is:
- scan mode: "DO NOT MODIFY ANY FILES. Report only."
- execute mode: "After identifying gaps, ADD missing edge cases and business rules directly to the relevant spec files. For missing services/screens, generate stub specs. List all files you created or modified."

### Agent 3B — Depth Improvement (Round 2)

```
You are performing Enhancement Round 2 on {PROJECT_NAME}: "What Can Be Better?"
Read {PROJECT_PATH}/dev_docs/ — all service specs, screen specs, and task files.

{MODE_INSTRUCTION}

FIND:

1. THIN SPEC SECTIONS
   For each service spec section scoring <100 words: flag for expansion.
   Focus: Business Rules, Edge Cases, Error Handling, Performance Requirements.

2. MEGA-TASKS
   Task files with >8 hours effort or <3 sub-tasks. These need splitting.
   Each sub-task should be 1-2 hours.

3. WEAK API CONTRACTS
   Endpoints missing: error response schemas (400/401/403/404/409/422/500),
   pagination params (page/limit/sort/filter) on list endpoints,
   rate limiting docs, auth requirements.

4. INCOMPLETE SCREEN STATES
   Screen specs with <6 states. Missing states from the 4 fundamentals
   (loading, error, empty, populated) or lacking context-specific states
   (searching, editing, confirming-delete, bulk-selecting, offline, saving).

5. MISSING FORM FIELD SPECS
   Screens with forms but no field specifications (label, type, validation,
   placeholder, help text, error messages).

6. WEAK PHASE PLANS
   Missing effort estimates, risk factors, rollback plans, milestones.

Return:
{
  "thin_sections": [{ "file": "...", "section": "...", "word_count": N }],
  "mega_tasks": [{ "file": "...", "hours": N, "sub_tasks": N }],
  "weak_endpoints": [{ "file": "...", "endpoint": "...", "missing": [...] }],
  "incomplete_states": [{ "file": "...", "states": N, "missing": [...] }],
  "missing_field_specs": [...],
  "weak_phases": [...],
  "total_improvements": N
}

{TIER_3_BUDGET}
```

### Agent 3C — Pattern Emergence (Round 3)

```
You are performing Enhancement Round 3 on {PROJECT_NAME}: "What Patterns Emerged?"
Read {PROJECT_PATH}/dev_docs/ — all specs, standards, and catalogs.

DO NOT MODIFY ANY FILES. Report only. (This round is always report-only.)

FIND:

1. CROSS-CUTTING STANDARDS NEEDED
   Are there repeated patterns across services that should be standardized?
   e.g., pagination format, error response shape, audit logging, soft-delete behavior

2. ARCHITECTURE CONSISTENCY
   Do all services follow the same patterns? (naming, folder structure, API conventions)
   Flag deviations.

3. DECISION LOG COMPLETENESS
   For major decisions (tech stack, database, auth, deployment): is the "why" documented?
   Missing decision rationale = future confusion.

4. MISSING CATALOGS
   Does the project have: error catalog, permission catalog, notification catalog,
   component catalog, integration health catalog, event catalog?
   Each missing catalog is a gap.

5. SEED DATA GAPS
   Does seed data exist? Is it tiered (dev/staging/demo)?
   Are seed files referenced by task reading lists?

Return:
{
  "standards_needed": [...],
  "architecture_inconsistencies": [...],
  "missing_decisions": [...],
  "missing_catalogs": [...],
  "seed_data_status": "present|partial|missing",
  "total_patterns": N
}

{TIER_3_BUDGET}
```

**After agents 3A, 3B, 3C, 3D return (parallel), then 3E runs (sequential):**

### Agent 3D — Feature Discovery & Vertical Expansion

```
You are a feature discovery agent for {PROJECT_NAME}. Your job is NOT to find
what's missing from existing specs — it's to identify NEW features the project
SHOULD have but doesn't.

Read these files for context:
- {PROJECT_PATH}/dev_docs/project-brief.md (domain, target market, personas)
- {PROJECT_PATH}/dev_docs/features-list.md (what exists)
- {PROJECT_PATH}/dev_docs/specs/services/*.md (current services — scan all)
- {PROJECT_PATH}/.kit-upgrade/cumulative-findings.json (upstream findings)
- {KIT_HOME}/12-examples/service-spec.example.md (reference for depth)

DISCOVERY METHODS — run ALL five:

1. COMPETITIVE TABLE-STAKES: What features do ALL competitors have? Cross-check
   against features-list.md. Be specific: name competitors, name features.

2. VERTICAL EXPANSION (per service): For EACH existing service, what deeper
   capabilities would a power user expect? (e.g., billing → dunning, proration,
   usage metering, tax calc, invoice PDF, payment retry)

3. USER JOURNEY GAPS: Walk the complete lifecycle (Awareness → Signup → Onboarding
   → Daily Use → Advanced Use → Admin → Churn Risk → Win-back → Account Closure).
   Which stages have NO service coverage?

4. ADMIN/OPS GAPS: What tools would an ops team need? (bulk ops, audit logs, user
   management, feature flags, content management, analytics dashboard, support tools)

5. INTEGRATION OPPORTUNITIES: What third-party integrations add significant value?
   (Slack, email, SMS, webhooks, calendar sync, SSO, payment processors, export formats)

For each discovered feature: name, 2-sentence description, which service it extends
or new service needed, effort (S/M/L/XL), priority (must-have/should-have/nice-to-have),
competitive justification.

Return JSON with: table_stakes_missing, vertical_expansions, journey_gaps,
admin_ops_gaps, integration_opportunities, total_new_features, must_have_count.

{TIER_3_BUDGET}
```

### Agent 3E — Gap-to-Spec Pipeline

This agent takes output from 3A (missing items) and 3D (new features) and produces
executable draft specs. **Runs AFTER 3A and 3D return (sequential, not parallel).**

```
You are a spec generator for {PROJECT_NAME}. You receive gap analysis from Agents
3A and 3D and must produce DRAFT specs for the highest-priority items.

Read: 3A/3D results (passed by main context), kit templates at {KIT_HOME}/03-documentation/,
kit examples at {KIT_HOME}/12-examples/, project-brief.md, features-list.md,
cumulative-findings.json.

GENERATION RULES:

For each P0 (must-have) gap:
- Missing SERVICE: Generate draft (min 800 words) with overview, 5+ entity fields,
  8+ business rules with specific values, 7+ endpoints, 5+ edge cases, error codes,
  dependencies. Write to: {PROJECT_PATH}/dev_docs/specs/drafts/service-DRAFT-{name}.md

- Missing SCREEN: Generate draft (min 500 words) with overview, primary user story,
  6+ states, 5+ interactions, 5+ components, responsive behavior, accessibility.
  Write to: {PROJECT_PATH}/dev_docs/specs/drafts/screen-DRAFT-{name}.md

- VERTICAL EXPANSION: Generate expansion section (min 300 words) with new endpoints,
  business rules, edge cases, entity fields.
  Write to: {PROJECT_PATH}/dev_docs/specs/drafts/expansion-DRAFT-{service}-{feature}.md

Mark every file: "> **Status:** DRAFT — requires review before adoption"
For P1 gaps: generate stub outlines (100-200 words) with headers but "Expand during review."
Skip P2/P3 — handled by Wave 6 task generation.

Return: service_drafts_generated, screen_drafts_generated, expansion_drafts_generated,
p1_stubs_generated, total_draft_words, files_created.

{TIER_3_BUDGET}
```


- Aggregate findings into `.kit-upgrade/wave-3-enhancement-discovery.md`
- **Update cumulative-findings.json:** merge all enhancement data, new features, and draft specs under `wave_3` key
- Update state.json: wave 3 complete, findings count
- If MODE is `execute`: report files created/modified by agents 3A, 3B, and 3E. Update features-list.md with newly discovered must-have features (marked "Discovered by kit-upgrade")

Announce:
```
Wave 3 complete — Enhancement Discovery
  Missing items: {N} (services: {N}, screens: {N}, edge cases: {N})
  Depth improvements: {N} (thin sections: {N}, mega-tasks: {N}, weak endpoints: {N})
  Patterns: {N} (standards needed: {N}, missing catalogs: {N})
```

---

## Wave 4 — Hardening Pass

**Purpose:** Run the hardening steps (Orchestrator Steps 29-32) against the project. This is the heavy quality lift.

**Dispatch 3-4 parallel agents (4B-ii only in execute mode):**

### Agent 4A — Post-Completion Auditor (Step 29)

```
You are performing a post-completion audit on {PROJECT_NAME}.
Read {PROJECT_PATH}/dev_docs/ and verify completeness.

{MODE_INSTRUCTION}

ROUND 1 — EXISTENCE AUDIT
For each expected output type, check if files exist:
- Service specs: count vs features list
- Screen specs: count vs screen catalog
- Task files: exist for every phase
- Standards docs: error-responses, api-standards, database-standards, etc.
- Catalogs: error, permission, notification, component, integration-health

For files that exist: check word count (>=50 words = present, <50 = STUB)
For missing files: flag as CRITICAL

ROUND 2 — SECTION COMPLETENESS
For files that passed Round 1:

Service specs must have 15 sections:
Overview, Entities, Business Rules, API Endpoints, State Machines,
Validation Rules, Edge Cases, Error Handling, Performance Requirements,
Security, Dependencies, Testing Strategy, Monitoring, Future, Open Questions

Screen specs must have 11 sections:
Overview, User Stories, Layout, Components, States, Interactions,
Responsive, Accessibility, API Calls, Navigation, Permissions

Task files must have 6 sections:
Context Header, Objective, File Plan, Acceptance Criteria, Dependencies, Effort

Also scan ALL files for: TBD, TODO, FIXME, [FILL IN], PLACEHOLDER

ROUND 3 — COUNT VERIFICATION
- Service spec count matches CONFIG.MVP_SERVICES / features list
- Screen spec count matches screen catalog entries
- Task file count is reasonable for scope (at least 3x service count)

Return:
{
  "round_1": { "present": N, "missing": N, "stubs": N, "missing_files": [...] },
  "round_2": { "complete": N, "incomplete": N, "missing_sections": {...}, "placeholders": N },
  "round_3": { "service_match": bool, "screen_match": bool, "task_ratio": N },
  "critical_findings": [...],
  "total_findings": N
}

{TIER_2_BUDGET}
```

### Agent 4B-i — Depth Re-Scorer (Step 31a)

```
You are the MECHANICAL DEPTH RE-SCORER for {PROJECT_NAME}. You run the same 8 checks
as Wave 1's Agent 1A but with ELEVATED thresholds and a focus on files that scored
poorly in Wave 1.

DO NOT MODIFY ANY FILES. Score only.

Read the Wave 1 scorecard at {PROJECT_PATH}/.kit-upgrade/wave-1-before-scorecard.md
to identify files that scored below threshold.

For EVERY file that scored < 9/10 (service) or < 8/10 (screen) or < 7/10 (task):

Run the full 8-check mechanical depth checker with these ELEVATED thresholds:
- Service spec words: >= 2500 (elevated from 1500)
- Business rules: >= 12 specific (elevated from 8)
- Endpoints: >= 11 (elevated from 7)
- Edge cases: >= 12 (elevated from 8)
- Error codes: >= 15 (elevated from 10)
- Screen states: >= 10 (elevated from 6)
- Task acceptance criteria: >= 9 (elevated from 5)

Return:
{
  "files_checked": N,
  "failing_files": [{"file": "path", "score": N, "threshold": N, "failing_checks": [...]}],
  "before_scores": {...},
  "total_failing": N
}

{TIER_2_BUDGET}
```

### Agent 4B-ii — Depth Expander (Step 31b) — EXECUTE MODE ONLY

This agent ONLY runs if MODE is `execute`. It receives the failing_files list from 4B-i and produces expansion plans + directly expands failing sections.

```
You are the depth expander for {PROJECT_NAME}. You receive a list of files that
failed depth checks and must expand each one. Read the Wave 1 scorecard at
{PROJECT_PATH}/.kit-upgrade/wave-1-before-scorecard.md and the 4B-i re-score results.

DOMAIN CONTEXT — read these BEFORE expanding any file:
- {KIT_HOME}/12-examples/service-spec.example.md — THIS is what deep looks like
- {KIT_HOME}/10-generators/DEPTH-REQUIREMENTS.md — the scoring criteria you must meet
- {PROJECT_PATH}/dev_docs/project-brief.md — the project domain and goals
- {PROJECT_PATH}/dev_docs/features-list.md — feature context for cross-references
- {PROJECT_PATH}/.kit-upgrade/cumulative-findings.json — ALL upstream findings

EXPANSION PROTOCOL (mandatory for EVERY section you expand):
1. Run "User Day Simulation" mentally: imagine a real user using this feature
2. Run "Failure Mode Analysis": what are the 5 most likely production breaks?
3. Replace EVERY red-flag phrase with specific content

HARD RULE: Every added sentence must reference a specific entity, screen, user role,
field name, or scenario from the project domain. Generic padding is worse than nothing.

For EVERY failing file: expand sections with substantive, project-specific content.
Use project context (project-brief.md, features-list.md, other specs) — not generic filler.

For each file, produce a detailed expansion plan:
- Which sections need more content
- Specific content suggestions based on project domain
- Red-flag phrases to replace with specific content
- Missing items to add

Then directly expand each failing section with substantive content.

Return:
{
  "files_expanded": N,
  "sections_deepened": N,
  "red_flags_removed": N,
  "after_scores": {...}
}

{TIER_3_BUDGET}
```

### Agent 4C — Advanced Hardening (Step 32)

```
You are the advanced hardening agent for {PROJECT_NAME}. You deepen the project
beyond passing thresholds — you push toward Code Red quality levels.

{MODE_INSTRUCTION}

Read {PROJECT_PATH}/dev_docs/ — project-brief.md, all service specs, all screen specs,
features-list.md, and any existing hardening/ artifacts.

HARDENING AREAS:

1. PER-SERVICE BUSINESS NEEDS ANALYSIS
   For each service, ask: "What would a subject matter expert say is missing?"
   Add industry-specific rules, regulatory requirements, competitive parity features.

2. UI STATE MATRIX COMPLETENESS
   Does a UI state matrix exist (dev_docs/specs/ui/state-matrix.md)?
   If yes: does it cover ALL screens with ALL states?
   If no: flag as HIGH PRIORITY gap.

3. INTEGRATION FAILURE SPEC COVERAGE
   For each external integration: does a failure spec exist with:
   timeout configs, retry strategies, circuit breakers, fallback behaviors, error codes?
   Flag integrations without failure specs.

4. PER-PHASE PLAN INTEGRITY
   Does each phase have: clear entry criteria, exit criteria, risk factors,
   rollback plan, milestone dates?

5. SEED DATA ASSESSMENT
   Does tiered seed data exist (dev/staging/demo)?
   Are seed files referenced in task reading lists?

6. COMMS & STAKEHOLDER
   Does comms/ directory exist with stakeholder updates?
   Does client-log/ exist for non-technical stakeholders?
   Does a summary card / stakeholder dashboard exist?

Return:
{
  "business_needs_gaps": [...],
  "state_matrix_status": "complete|partial|missing",
  "integration_failure_coverage": "X/Y integrations covered",
  "phase_plan_gaps": [...],
  "seed_data_status": "present|partial|missing",
  "comms_status": "present|partial|missing",
  "hardening_score": N,
  "total_findings": N
}

{TIER_3_BUDGET}
```

**After all agents return:**

- Aggregate into `.kit-upgrade/wave-4-hardening-report.md`
- Update state.json: wave 4 complete
- Update hardening score in `scores.before.hardening`
- **Update cumulative-findings.json:** merge all hardening findings under `wave_4` key

### Wave 4 Iterative Deepening Loop

After initial Wave 4 agents return, check quality:

IF wave_4_composite < 8.0 AND MODE is `execute`:
  iteration = 0
  while wave_4_composite < 8.0 AND iteration < 2:
    iteration++
    Re-dispatch 4B-ii targeting ONLY files still failing elevated thresholds
    Re-dispatch 4C targeting ONLY uncovered hardening areas
    Re-score modified files with 4B-i
    Recalculate wave_4_composite
    Append iteration details to .kit-upgrade/iteration-log.md
  IF still < 8.0: Flag ALL remaining failing items as P0-CRITICAL in cumulative-findings.json
  (they become P0 tasks in Wave 6 instead of being silently passed)

Announce:
```
Wave 4 complete — Hardening
  Completeness: {PRESENT}/{EXPECTED} files ({PCT}%)
  Depth: {EXPANDED}/{CHECKED} files deepened
  Hardening score: {X}/10
  Critical findings: {N}
```

---

## Wave 5 — Final Scoring & Report

**Purpose:** Re-score everything (in execute mode) or compile the final report (in scan mode).

**Dispatch 1 agent:**

### Agent 5A — Final Scorer & Report Generator

```
You are generating the final uplift report for {PROJECT_NAME}.

MODE: {MODE}

IF MODE IS EXECUTE:
Re-score all files that were modified during Waves 0-4 using the same scoring
algorithm from Wave 1. Read the modified files at {PROJECT_PATH}/dev_docs/ and
produce "after" scores.

IF MODE IS SCAN:
The "after" scores are the same as "before" (nothing was modified).
Instead, produce an explicit GAP-TO-IMPROVEMENT MAPPING:
For each dimension (spec_depth, task_quality, cross_ref, coverage, hardening):
  List the top 5 findings that, if fixed, would have the largest score impact.
  Format: "Fixing [{finding_id}] would raise {dimension} from {current} to ~{projected}"
This makes the relationship between findings and scores actionable.

COMPILE THE FINAL REPORT at {PROJECT_PATH}/.kit-upgrade/UPLIFT-REPORT.md:

# Kit Upgrade Report — {PROJECT_NAME}

**Date:** {DATE}
**Mode:** {MODE}
**Waves completed:** 6/6

## Quality Score

| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Spec Depth | {X}/10 | {Y}/10 | {+/-Z} |
| Task Quality | {X}/10 | {Y}/10 | {+/-Z} |
| Cross-References | {X}/10 | {Y}/10 | {+/-Z} |
| Coverage | {X}/10 | {Y}/10 | {+/-Z} |
| Hardening | {X}/10 | {Y}/10 | {+/-Z} |
| **COMPOSITE** | **{X}/10** | **{Y}/10** | **{+/-Z}** |

## Wave Summaries

### Wave 0 — Structural Diff
{SUMMARY}

### Wave 1 — Depth Scoring
{SUMMARY}

### Wave 2 — Cross-Reference Audit
{SUMMARY}

### Wave 3 — Enhancement Discovery
{SUMMARY}

### Wave 4 — Hardening Pass
{SUMMARY}

## Files Modified (execute mode)
{LIST_WITH_DESCRIPTIONS}

## Files Created (execute mode)
{LIST_WITH_DESCRIPTIONS}

## Manual Review Items
Items requiring human judgment — cannot be auto-fixed:
{MANUAL_ITEMS}

## Recommendations
1. {TOP_RECOMMENDATION}
2. {SECOND_RECOMMENDATION}
3. {THIRD_RECOMMENDATION}

## Next Steps
- Re-run: /kit-upgrade score (check current quality)
- Re-run: /kit-upgrade execute (apply more fixes)
- Address manual items above

{TIER_1_BUDGET}
```

**After agent returns:**

- Write UPLIFT-REPORT.md
- Update state.json: wave 5 complete, status = "complete", after scores
- Write final state.json
- **Update cumulative-findings.json:** merge final scores and delta under `wave_5` key

---

## Wave 6 — Task Generation & Execution Bridge

**Purpose:** Convert all findings from Waves 0-5 into executable task files, update the master tracker and STATUS.md, and prepare for `/gsd` execution. This is the bridge between "audit complete" and "actual code changes happen."

**This wave runs in BOTH scan and execute modes.** Audit without actionable tasks is shelf-ware.

**Dispatch 3 sequential agents (each depends on the previous):**

### Agent 6A-i — Finding Extractor & Prioritizer

```
You are the finding extractor and prioritizer for {PROJECT_NAME}. Your job is to read
all wave reports and extract/prioritize findings.

Read these input files (cumulative findings is your PRIMARY source):
0. {PROJECT_PATH}/.kit-upgrade/cumulative-findings.json — COMPLETE findings from ALL waves (PRIMARY)
1. {PROJECT_PATH}/.kit-upgrade/UPLIFT-REPORT.md — final findings and recommendations
2. {PROJECT_PATH}/.kit-upgrade/wave-1-before-scorecard.md — files below threshold
3. {PROJECT_PATH}/.kit-upgrade/wave-2-consistency-report.md — cross-reference gaps
4. {PROJECT_PATH}/.kit-upgrade/wave-3-enhancement-discovery.md — missing items
5. {PROJECT_PATH}/.kit-upgrade/wave-4-hardening-report.md — hardening gaps
6. {PROJECT_PATH}/.kit-upgrade/state.json — scores and finding counts
7. {PROJECT_PATH}/dev_docs/STATUS.md — current project status (if exists)
8. {PROJECT_PATH}/dev_docs/tracker/master-tracker.md — current tracker (if exists)
9. {PROJECT_PATH}/dev_docs/project-brief.md — project context for task generation
10. {PROJECT_PATH}/dev_docs/features-list.md — feature context

DO NOT GENERATE TASK FILES. Extract and prioritize only.

STEP 1 — FINDING EXTRACTION & PRIORITIZATION

Extract all findings from Waves 0-5 and classify each by priority:

| Priority | Criteria | Task Urgency |
|----------|----------|-------------|
| P0-CRITICAL | Missing service specs, broken cross-references, score < 3/10 | Generate immediately |
| P1-HIGH | Specs below depth threshold (< 7/10), missing required sections, stale counts | Generate immediately |
| P2-MEDIUM | Enhancement opportunities, missing edge cases, shallow phrases | Generate as batch |
| P3-LOW | Polish items, naming inconsistencies, minor gaps | Generate as single batch task |

Include ALL findings — no upper limit. Group P3 items as batch entries by category.

Return:
{
  "findings": [{"id": "W1-001", "wave": 1, "priority": "P0", "type": "service_spec_depth", "file": "path", "description": "max 1 sentence", "target_score": N}],
  "priority_breakdown": {"P0": N, "P1": N, "P2": N, "P3": N},
  "total_findings": N
}

{TIER_3_BUDGET}
```

### Agent 6A-ii — Task File Writer

Receives the findings JSON from 6A-i. Does STEPS 2-3 only (Task File Generation + ID Assignment). Writes actual task files to disk.

```
You are the task file writer for {PROJECT_NAME}. You receive a prioritized findings
list from 6A-i and must generate task files for each finding.

Read the task template at:
{KIT_HOME}/03-documentation/execution-layer/task-template.md

STEP 2 — TASK FILE GENERATION

For each P0 and P1 finding, generate a task file at:
{PROJECT_PATH}/dev_docs/tasks/TASK-UPG-{NNN}-{slug}.md

Task file format (follow the template exactly):

```markdown
# TASK-UPG-{NNN} -- {Title}

> **Status:** Ready
> **Assigned:** --
> **Effort:** {S|M|L|XL}
> **Sprint:** --
> **Updated:** {TODAY_DATE}
> **Source:** kit-upgrade wave {N}, finding: {finding_id}

---

## Context Header

Load these files before starting work (max 6 total):

| # | File | Why |
|---|------|-----|
| 1 | {relevant_spec_or_source} | Primary file to modify |
| 2 | {related_reference} | Context for the change |
| 3 | .kit-upgrade/UPLIFT-REPORT.md | Audit findings driving this task |

---

## Objective

{1-2 sentences: what this task accomplishes and WHY it matters for project quality.
Reference the specific audit finding that generated this task.}

---

## File Plan

| Action | File | Notes |
|--------|------|-------|
| Edit | `{specific_file_path}` | {What specifically needs to change} |

---

## Acceptance Criteria

- [ ] {Specific, testable criterion tied to the audit finding}
- [ ] {Measurable quality gate — e.g., "word count >= 1500", "score >= 7/10"}
- [ ] {Cross-reference check passes}
- [ ] Re-run `/kit-upgrade score` shows improvement on this file

---

## Dependencies

| Depends On | Why | Status |
|------------|-----|--------|
| {TASK-UPG-YYY or "none"} | {reason or "independent"} | {status} |

---

## Effort Estimate

| Component | Hours |
|-----------|-------|
| Implementation | {X} |
| Verification | 0.5 |
| **Total** | **{X}** |

---

## Notes

- Generated by /kit-upgrade Wave 6 on {DATE}
- Source finding: Wave {N} — {finding_description}
- Quality target: {specific_score_target}
```

GROUPING RULES:
- One task per failing service spec (depth uplift)
- One task per failing screen spec (depth uplift)
- One task per broken cross-reference chain
- One batch task for all P2 enhancement items (with checklist inside)
- One batch task for all P3 polish items (with checklist inside)
- One task file per P0 finding (critical — individual attention required)
- One task file per P1 finding (high — individual attention required)
- Batch P2 items by category (max 10 items per batch task, with checklist inside)
- All P3 items in a single polish task (with checklist inside)
- No upper limit on total task files — generate as many as findings warrant

STEP 3 — TASK ID ASSIGNMENT

- Use prefix TASK-UPG- to distinguish upgrade tasks from project tasks
- Number sequentially: TASK-UPG-001, TASK-UPG-002, etc.
- If existing task files exist in dev_docs/tasks/, start numbering after the highest existing UPG number

Return:
{
  "tasks_generated": N,
  "task_files": ["TASK-UPG-001-slug.md", ...],
  "priority_breakdown": {"P0": N, "P1": N, "P2": N, "P3": N},
  "total_effort_hours": N,
  "files_created": [...]
}

{TIER_3_BUDGET}
```

### Agent 6A-iii — Tracker Integrator

Receives the task list from 6A-ii. Does STEPS 4-7 only (STATUS.md, master-tracker, handoff, GSD config).

```
You are the tracker integrator for {PROJECT_NAME}. You receive the task file list
from 6A-ii and must update all project tracking files.

STEP 4 — STATUS.md INTEGRATION

If {PROJECT_PATH}/dev_docs/STATUS.md exists:
- Find or create a section: `## Kit Upgrade Tasks`
- Add a task table with all generated tasks:

```markdown
## Kit Upgrade Tasks

Generated by `/kit-upgrade` on {DATE} | Composite score: {BEFORE}/10

| Task | Title | Priority | Effort | Status |
|------|-------|----------|--------|--------|
| TASK-UPG-001 | {title} | P0 | M | Ready |
| TASK-UPG-002 | {title} | P1 | L | Ready |
```

- Update the task count totals at the top of STATUS.md

If STATUS.md does NOT exist:
- Create a minimal STATUS.md with the upgrade tasks section

STEP 5 — MASTER TRACKER INTEGRATION

If {PROJECT_PATH}/dev_docs/tracker/master-tracker.md exists:
- Append a new phase section: `## Phase: Kit Upgrade (Auto-Generated)`
- Add subtask rows for each generated task with dependencies

If the tracker does NOT exist:
- Create dev_docs/tracker/ directory
- Create a minimal master-tracker.md with the upgrade tasks as the initial content

STEP 6 — HANDOFF.md UPDATE

If {PROJECT_PATH}/dev_docs/handoff.md exists:
- Update "Last Completed" to: "Kit upgrade audit complete — {TOTAL_FINDINGS} findings, {TASK_COUNT} tasks generated"
- Update "Next Action" to: "Run /gsd to execute upgrade tasks, starting with P0-CRITICAL items"

If handoff.md does NOT exist:
- Create a minimal handoff.md with this content

STEP 7 — GSD CONFIG BRIDGE

If {PROJECT_PATH}/.gsd/ directory exists:
- Read .gsd/config.json (if exists) and verify task_dir points to dev_docs/tasks/
- If config.json doesn't exist, create it:
```json
{
  "task_dir": "dev_docs/tasks",
  "auto_discovered": true,
  "source": "kit-upgrade-wave-6"
}
```

If .gsd/ doesn't exist:
- Create .gsd/config.json with the above content

Return:
{
  "status_md_updated": true/false,
  "tracker_updated": true/false,
  "handoff_updated": true/false,
  "gsd_config_created": true/false,
  "files_modified": [...]
}

{TIER_1_BUDGET}
```

**After agents 3A, 3B, 3C, 3D return (parallel), then 3E runs (sequential):**

- Update state.json: wave 6 complete, tasks_generated count
- Add all created/modified files to state.json `files_created` and `files_modified` arrays
- Write task manifest to `.kit-upgrade/wave-6-task-manifest.md`:

```markdown
# Wave 6 — Task Manifest

Generated: {DATE}
Tasks: {N} total ({P0} critical, {P1} high, {P2} medium, {P3} low)
Effort: ~{HOURS} hours estimated

## Task List

| # | Task ID | Title | Priority | Effort | File |
|---|---------|-------|----------|--------|------|
| 1 | TASK-UPG-001 | {title} | P0 | M | dev_docs/tasks/TASK-UPG-001-{slug}.md |

## Execution Order

1. {P0 tasks first, in dependency order}
2. {P1 tasks next}
3. {P2 batch task}
4. {P3 batch task}

## Next Step

Run `/gsd` to begin executing these tasks.
```

Announce:
```
Wave 6 complete — Task Generation
  Tasks generated: {N} ({P0} critical, {P1} high, {P2} medium, {P3} low)
  Estimated effort: ~{HOURS} hours
  Files created: {N} task files + manifest
  STATUS.md: {updated/created}
  Master tracker: {updated/created}
  Handoff: {updated/created}
  GSD config: {ready}
```

---

## Closing Announcement

After Wave 6 completes:

```
KIT UPGRADE COMPLETE

Mode: {MODE}
Waves: 7/7 (0-6)

QUALITY SCORE
─────────────
Before:  {BEFORE}/10
After:   {AFTER}/10
Delta:   +{DELTA}

Breakdown:
  Spec Depth:       {B} → {A}
  Task Quality:     {B} → {A}
  Cross-References: {B} → {A}
  Coverage:         {B} → {A}
  Hardening:        {B} → {A}

Findings: {TOTAL}
  Auto-fixed:     {FIXED} {(execute mode only)}
  Manual review:  {MANUAL}

EXECUTION BRIDGE
────────────────
Tasks generated:  {N} ({P0} critical, {P1} high, {P2} medium, {P3} low)
Estimated effort: ~{HOURS} hours
Task files:       dev_docs/tasks/TASK-UPG-*.md
STATUS.md:        {updated/created}
Master tracker:   {updated/created}
GSD config:       ready

Report:    .kit-upgrade/UPLIFT-REPORT.md
Tasks:     .kit-upgrade/wave-6-task-manifest.md
Resume:    /kit-upgrade resume
Re-score:  /kit-upgrade score
Execute:   /gsd ← run this to start implementing the upgrade tasks
```

---

## Auto-Fix Rules (Execute Mode Only)

These modifications are safe to auto-apply:

| Finding Type | Auto-Fix Action |
|-------------|-----------------|
| Missing kit template files | Copy from kit, fill placeholders from .kit-meta.json |
| Word count below threshold | Re-expand sections using depth prompts + project context |
| Missing required sections | Generate section from template + project context |
| Placeholder/TBD text | Replace with substantive content from project context |
| Catalog mismatches | Add missing entries to relevant catalogs |
| Missing UI states (< 6) | Add loading/error/empty/populated + 2 context-specific |
| Stale STATUS.md counts | Update to match actual file counts |
| Missing acceptance criteria | Generate from service/screen spec context |
| Naming inconsistencies | Standardize to dominant pattern across project |
| Mega-tasks (> 3 days) | Split into smaller tasks with proper sub-tasks |
| Missing pre-task reading lists | Add universal + type-specific reading list to task |
| Red-flag shallow phrases | Replace with specific, actionable content |

## Manual Review Required (Flagged, Never Auto-Fixed)

| Finding Type | Why Manual |
|-------------|-----------|
| New services needed | Requires domain understanding |
| New screens needed | Requires UX decisions |
| Business rule additions | Requires product owner input |
| Architecture changes | Requires technical decisions |
| Integration additions | Requires vendor decisions |
| Phase resequencing | Requires timeline impact analysis |
| Conflicting customizations | Project diverged from kit template intentionally |
| Regulatory requirements | Requires legal review |

---

## Quality Score Thresholds

| Score | Label | Meaning |
|-------|-------|---------|
| 9-10 | Production Ready | Code Red quality level — every file is deep, consistent, cross-referenced |
| 7-8 | Solid | Good enough for development, minor gaps remain |
| 5-6 | Needs Work | Significant uplift opportunity — common for standard-path projects |
| 3-4 | Shallow | Specs exist but lack depth — many files below threshold |
| 1-2 | Skeleton | Files are stubs or mostly placeholders |

---

## Output Artifacts

All outputs go to `PROJECT_PATH/.kit-upgrade/`:

| File | Created By | Purpose |
|------|-----------|---------|
| `state.json` | All waves | Resume state, scores, progress |
| `wave-0-structural-diff.md` | Wave 0 | Kit template delta |
| `wave-1-before-scorecard.md` | Wave 1 | Before quality scores per file |
| `wave-2-consistency-report.md` | Wave 2 | Cross-reference & consistency findings |
| `wave-3-enhancement-discovery.md` | Wave 3 | Missing items & improvement opportunities |
| `wave-4-hardening-report.md` | Wave 4 | Hardening pass results |
| `UPLIFT-REPORT.md` | Wave 5 | Final before/after comparison report |
| `wave-6-task-manifest.md` | Wave 6 | Generated task list with execution order |
| `cumulative-findings.json` | All waves | Complete findings from all waves — cross-wave data accumulator |
| `iteration-log.md` | Score gate / Wave 4 | Per-iteration scores, files modified, improvements made |
