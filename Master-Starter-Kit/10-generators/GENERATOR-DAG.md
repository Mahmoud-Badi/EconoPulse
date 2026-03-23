# Generator Dependency Graph (DAG)

> **Purpose:** Explicit dependency map of every generator in `10-generators/`. Defines required inputs, produced outputs, downstream consumers, and pre-flight checks that BLOCK execution when dependencies are missing.
>
> **Rule:** Never run a generator without first passing its pre-flight check. A generator with missing inputs produces garbage that cascades through every downstream consumer.

---

## Generator Inventory

### Tier 0: Foundation Generators (no generator dependencies — run from raw project inputs)

#### AUDIT-GENERATOR
- **File:** `10-generators/AUDIT-GENERATOR.md`
- **Required inputs:**
  - Source code files (backend controllers, frontend components)
  - Existing codebase to audit
- **Outputs produced:** `dev_docs/audit/{area-name}.md` (per-service audit reports with grades, bugs, recommendations)
- **Downstream consumers:** PHASE-GENERATOR, SERVICE-HUB-GENERATOR

#### DATABASE-DOC-GENERATOR
- **File:** `10-generators/DATABASE-DOC-GENERATOR.md`
- **Required inputs:**
  - Schema file (Prisma/TypeORM/Django models/etc.)
  - Migration files
  - Seed files
  - Service specs (optional, for cross-reference)
- **Outputs produced:** `dev_docs/specs/database/schema-documentation.md`
- **Downstream consumers:** CODE-SCAFFOLD-GENERATOR, CROSS-REFERENCE-VALIDATOR

#### COMPONENT-CATALOGER
- **File:** `10-generators/COMPONENT-CATALOGER.md`
- **Required inputs:**
  - Component files (`{{COMPONENT_LIBRARY_PATH}}/**/*.tsx`)
  - App-local component files
- **Outputs produced:** `dev_docs/components/_index.md`
- **Downstream consumers:** SERVICE-HUB-GENERATOR, SCREEN-CATALOG-GENERATOR, CROSS-REFERENCE-VALIDATOR

#### API-CATALOG-GENERATOR
- **File:** `10-generators/API-CATALOG-GENERATOR.md`
- **Required inputs:**
  - Backend controller files (route decorators)
  - DTO / schema files
  - Guard / middleware files
  - Module registration files
  - Service specs (`dev_docs/specs/services/*.md`)
- **Outputs produced:** `dev_docs/api-catalog.md`
- **Downstream consumers:** SCREEN-CATALOG-GENERATOR, SERVICE-HUB-GENERATOR, OPENAPI-GENERATOR, MOCK-SERVER-GENERATOR, CROSS-REFERENCE-VALIDATOR

---

### Tier 1: Spec Generators (depend on tribunal or audit outputs)

#### PHASE-GENERATOR
- **File:** `10-generators/PHASE-GENERATOR.md`
- **Required inputs:**
  - Tribunal executive summary (`{{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md`)
  - Tribunal roadmap (`{{TRIBUNAL_OUTPUT_PATH}}/roadmap.md`)
  - Tribunal implementation specs (`{{TRIBUNAL_OUTPUT_PATH}}/implementation-specs/`)
  - Audit reports (`dev_docs/audit/`)
  - Service hub files (`dev_docs/services/`)
- **Outputs produced:** Task files in `dev_docs/tasks/` + `dev_docs/STATUS.md`
- **Downstream consumers:** DEPENDENCY-GRAPHER, SPRINT-PLAN-GENERATOR, WORKFLOW-COVERAGE-MATRIX, CROSS-REFERENCE-VALIDATOR

#### SERVICE-HUB-GENERATOR
- **File:** `10-generators/SERVICE-HUB-GENERATOR.md`
- **Required inputs:**
  - Service specs (`dev_docs/specs/services/*.md`) — **REQUIRED**
  - Screen catalog (`{{SCREEN_CATALOG_PATH}}`) — optional in greenfield mode
  - API documentation (controllers or Swagger/OpenAPI) — optional in greenfield mode
  - Component catalog (`dev_docs/components/_index.md`) — optional in greenfield mode
  - Audit reports (`dev_docs/audit/{service}-audit.md`) — optional in greenfield mode
- **Outputs produced:** `dev_docs/specs/services/{service}.md` (hub files) + `dev_docs/services/_index.md`
- **Downstream consumers:** SCREEN-CATALOG-GENERATOR, PHASE-GENERATOR, WORKFLOW-E2E-TRACE-GENERATOR

---

### Tier 2: Catalog & Matrix Generators (depend on specs + hubs)

#### SCREEN-CATALOG-GENERATOR
- **File:** `10-generators/SCREEN-CATALOG-GENERATOR.md`
- **Required inputs:**
  - Service hub files (`dev_docs/specs/services/*.md`)
  - Frontend routes (`apps/web/app/` or equivalent)
  - Tribunal research (`01-tribunal/`)
  - Task files (`dev_docs/tasks/`)
- **Outputs produced:** `dev_docs/specs/screen-catalog.md`
- **Downstream consumers:** SERVICE-HUB-GENERATOR (circular update), USER-DOC-GENERATOR, JOURNEY-COVERAGE-MATRIX

#### UI-STATE-MATRIX-GENERATOR
- **File:** `10-generators/UI-STATE-MATRIX-GENERATOR.md`
- **Required inputs:**
  - Screen specs (`dev_docs/specs/screens/*.md`)
- **Outputs produced:** `dev_docs/completeness/ui-state-matrix.md`
- **Downstream consumers:** DEPTH-AUDITOR (as additional quality signal)

#### WORKFLOW-E2E-TRACE-GENERATOR
- **File:** `10-generators/WORKFLOW-E2E-TRACE-GENERATOR.md`
- **Required inputs:**
  - Service specs (`dev_docs/specs/services/*.md`)
  - Screen specs (`dev_docs/specs/screens/*.md`)
  - API catalog (`dev_docs/api-catalog.md`)
- **Outputs produced:** `dev_docs/completeness/workflow-e2e-traces.md`
- **Downstream consumers:** WORKFLOW-COVERAGE-MATRIX

#### WORKFLOW-COVERAGE-MATRIX
- **File:** `10-generators/WORKFLOW-COVERAGE-MATRIX.md`
- **Required inputs:**
  - Workflow E2E traces (`dev_docs/completeness/workflow-e2e-traces.md`)
  - Task files (`dev_docs/tasks/`)
  - Screen catalog (`dev_docs/specs/screen-catalog.md`)
- **Outputs produced:** `dev_docs/completeness/workflow-coverage-matrix.md`
- **Downstream consumers:** POST-COMPLETION-AUDITOR

#### JOURNEY-COVERAGE-MATRIX
- **File:** `10-generators/JOURNEY-COVERAGE-MATRIX.md`
- **Required inputs:**
  - Screen catalog (`dev_docs/specs/screen-catalog.md`)
  - User roles/personas
  - Task files (`dev_docs/tasks/`)
- **Outputs produced:** `dev_docs/completeness/journey-coverage-matrix.md`
- **Downstream consumers:** POST-COMPLETION-AUDITOR

#### DEPENDENCY-GRAPHER
- **File:** `10-generators/DEPENDENCY-GRAPHER.md`
- **Required inputs:**
  - Task files (`dev_docs/tasks/*.md`)
  - STATUS.md (`dev_docs/STATUS.md`)
- **Outputs produced:** Dependency analysis in `dev_docs/STATUS.md` + Mermaid diagram
- **Downstream consumers:** SPRINT-PLAN-GENERATOR

---

### Tier 3: Derivative Generators (depend on catalogs + matrices)

#### OPENAPI-GENERATOR
- **File:** `10-generators/OPENAPI-GENERATOR.md`
- **Required inputs:**
  - API contract files (`dev_docs/specs/api/`)
  - Service specs (`dev_docs/specs/services/`)
  - Auth design (`dev_docs/specs/architecture/`)
- **Outputs produced:** `openapi.yaml`
- **Downstream consumers:** MOCK-SERVER-GENERATOR

#### MOCK-SERVER-GENERATOR
- **File:** `10-generators/MOCK-SERVER-GENERATOR.md`
- **Required inputs:**
  - API catalog (`dev_docs/api-catalog.md`)
  - Seed data plan
  - DTO/response shapes
- **Outputs produced:** `dev_docs/mocks/` directory (server.ts, handlers, fixtures)
- **Downstream consumers:** None (consumed by developers)

#### CODE-SCAFFOLD-GENERATOR
- **File:** `10-generators/CODE-SCAFFOLD-GENERATOR.md`
- **Required inputs:**
  - Service specs (fully scored, >=8/10)
  - API contracts (`dev_docs/specs/api/`)
  - Database docs (`dev_docs/specs/database/`)
  - CONFIG from STATE BLOCK (framework, ORM, DB, test tool)
- **Outputs produced:** ~6N skeleton files (migrations, schemas, controllers, services, tests, types)
- **Downstream consumers:** None (consumed by developers)

#### SPRINT-PLAN-GENERATOR
- **File:** `10-generators/SPRINT-PLAN-GENERATOR.md`
- **Required inputs:**
  - STATUS.md (`{{STATUS_FILE_PATH}}`)
  - Previous sprint (`dev_docs/sprints/sprint-{N-1}.md`)
  - Team config (CONFIG → TEAM_SIZE)
  - Phase index (`dev_docs/phase-index.md`)
- **Outputs produced:** `dev_docs/sprints/sprint-{N}.md`
- **Downstream consumers:** None (consumed by team)

#### USER-DOC-GENERATOR
- **File:** `10-generators/USER-DOC-GENERATOR.md`
- **Required inputs:**
  - Features list (`dev_docs/foundations/features-list.md`)
  - Screen catalog (`dev_docs/specs/screen-catalog.md`)
  - User roles (`dev_docs/foundations/user-roles.md`)
- **Outputs produced:** `user_docs/` directory
- **Downstream consumers:** None (consumed by end users)

---

### Tier V: Validators & Auditors (run AFTER generators, not before)

#### DEPTH-AUDITOR
- **File:** `10-generators/DEPTH-AUDITOR.md`
- **Required inputs:**
  - Depth thresholds (`10-generators/DEPTH-REQUIREMENTS.md`)
  - Service specs (`dev_docs/specs/services/*.md`)
  - Screen specs (`dev_docs/specs/screens/*.md`)
  - Task files (`dev_docs/tasks/**/*.md`)
  - STATUS.md (`dev_docs/STATUS.md`)
- **Outputs produced:** `dev_docs/completeness/depth-audit.md`
- **Downstream consumers:** REGENERATOR

#### MECHANICAL-DEPTH-CHECKER
- **File:** `10-generators/MECHANICAL-DEPTH-CHECKER.md`
- **Required inputs:**
  - Specs and task files to check (same paths as DEPTH-AUDITOR)
  - DEPTH-REQUIREMENTS.md for thresholds
- **Outputs produced:** `dev_docs/completeness/mechanical-depth-report.md`
- **Downstream consumers:** REGENERATOR

#### CROSS-REFERENCE-VALIDATOR
- **File:** `10-generators/CROSS-REFERENCE-VALIDATOR.md`
- **Required inputs:**
  - All service specs, screen specs, task files, catalogs
  - API catalog, screen catalog, component catalog
  - Error catalog, permission catalog, notification catalog
- **Outputs produced:** `dev_docs/completeness/consistency-audit.md`
- **Downstream consumers:** REGENERATOR, POST-COMPLETION-AUDITOR

#### REGENERATOR
- **File:** `10-generators/REGENERATOR.md`
- **Required inputs:**
  - Audit output (from DEPTH-AUDITOR or MECHANICAL-DEPTH-CHECKER)
  - The failing spec file(s)
  - Related specs for domain context
- **Outputs produced:** Regenerated spec sections + `dev_docs/completeness/regeneration-log.md`
- **Downstream consumers:** Re-triggers DEPTH-AUDITOR / MECHANICAL-DEPTH-CHECKER for re-scoring

#### POST-COMPLETION-AUDITOR
- **File:** `10-generators/POST-COMPLETION-AUDITOR.md`
- **Required inputs:**
  - COMPLETED array from STATE BLOCK
  - All files in `dev_docs/`
  - Audit checklist template (`34-hardening/audit-checklist.template.md`)
- **Outputs produced:** `dev_docs/hardening/audit/` (per-round findings + audit summary)
- **Downstream consumers:** ENHANCEMENT-ROUND-GENERATOR

#### STALE-DOC-DETECTOR
- **File:** `10-generators/STALE-DOC-DETECTOR.md`
- **Required inputs:**
  - Planning documents (service specs, schema docs, screen catalogs)
  - Actual source code
- **Outputs produced:** Stale document report
- **Downstream consumers:** None (informational)

---

### Tier H: Hardening Generators (post-completion)

#### ENHANCEMENT-ROUND-GENERATOR
- **File:** `10-generators/ENHANCEMENT-ROUND-GENERATOR.md`
- **Required inputs:**
  - Audit summary (`dev_docs/hardening/audit/audit-summary.md`)
  - Project brief (`dev_docs/project-brief.md`)
  - Features list (`dev_docs/features-list.md`)
  - Enhancement categories (`34-hardening/enhancement-categories.md`)
- **Outputs produced:** `dev_docs/hardening/enhancement/` (per-round improvements)
- **Downstream consumers:** EXPANSION-PLANNER

#### EXPANSION-PLANNER
- **File:** `10-generators/EXPANSION-PLANNER.md`
- **Required inputs:**
  - Nice-to-haves (`dev_docs/hardening/deep-dive/nice-to-haves.md`)
  - Tribunal VERDICT (`dev_docs/tribunal/VERDICT.md`)
  - Project brief, features list, project phases
  - Expansion planning template (`34-hardening/expansion-planning.template.md`)
- **Outputs produced:** `dev_docs/hardening/expansion/` (expansion plan, vertical analysis, growth strategy)
- **Downstream consumers:** None (final planning output)

---

### Supplementary Generators

#### BATTLE-CARD-GENERATOR
- **Inputs:** Tribunal research, competitive analysis
- **Outputs:** Battle cards for competitive positioning

#### FINANCIAL-MODEL-GENERATOR
- **Inputs:** Features list, pricing strategy, market data
- **Outputs:** Financial model and projections

#### APP-STORE-LISTING-GENERATOR
- **Inputs:** Project brief, features list, screen catalog
- **Outputs:** App store listing content

#### MOBILE-SCREEN-GENERATOR / MOBILE-COMPONENT-GENERATOR
- **Inputs:** Screen specs, component catalog
- **Outputs:** Mobile-specific screen and component specs

#### AGENT-POLICY-SCHEMA
- **Inputs:** Project configuration, agent roles
- **Outputs:** Agent policy definitions

---

## ASCII DAG

```
                    ┌─────────────────┐
                    │  RAW PROJECT    │
                    │  INPUTS         │
                    │  (code, specs,  │
                    │   tribunal)     │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────────┐
            │                │                    │
            ▼                ▼                    ▼
   ┌────────────────┐ ┌──────────────┐  ┌─────────────────┐
   │ AUDIT-         │ │ DATABASE-DOC-│  │ COMPONENT-      │
   │ GENERATOR      │ │ GENERATOR    │  │ CATALOGER       │
   └───────┬────────┘ └──────┬───────┘  └────────┬────────┘
           │                 │                   │
           │    ┌────────────┼───────────────────┤
           │    │            │                   │
           ▼    ▼            │                   ▼
   ┌────────────────┐        │          ┌─────────────────┐
   │ PHASE-         │        │          │ API-CATALOG-    │
   │ GENERATOR      │        │          │ GENERATOR       │
   └───────┬────────┘        │          └────────┬────────┘
           │                 │                   │
           │    ┌────────────┤                   │
           │    │            │                   │
           ▼    ▼            ▼                   ▼
   ┌────────────────┐ ┌──────────────┐  ┌─────────────────┐
   │ SERVICE-HUB-   │ │ CODE-        │  │ OPENAPI-        │
   │ GENERATOR      │ │ SCAFFOLD-GEN │  │ GENERATOR       │
   └───────┬────────┘ └──────────────┘  └────────┬────────┘
           │                                     │
           ├──────────────────┐                  ▼
           │                  │          ┌─────────────────┐
           ▼                  ▼          │ MOCK-SERVER-    │
   ┌────────────────┐ ┌──────────────┐  │ GENERATOR       │
   │ SCREEN-CATALOG-│ │ WORKFLOW-E2E-│  └─────────────────┘
   │ GENERATOR      │ │ TRACE-GEN    │
   └───────┬────────┘ └──────┬───────┘
           │                 │
           ├─────────┐       │
           │         │       │
           ▼         ▼       ▼
   ┌────────────┐ ┌──────────────────┐
   │ USER-DOC-  │ │ WORKFLOW-        │
   │ GENERATOR  │ │ COVERAGE-MATRIX  │
   └────────────┘ └──────────────────┘
                         │
                         ▼
           ┌──────────────────────────┐
           │ JOURNEY-COVERAGE-MATRIX  │
           └──────────────────────────┘

   ───── PHASE-GENERATOR branch ─────

   PHASE-GENERATOR
        │
        ├──────────────────┐
        ▼                  ▼
   ┌────────────────┐ ┌──────────────────┐
   │ DEPENDENCY-    │ │ WORKFLOW-        │
   │ GRAPHER        │ │ COVERAGE-MATRIX  │
   └───────┬────────┘ └──────────────────┘
           │
           ▼
   ┌────────────────┐
   │ SPRINT-PLAN-   │
   │ GENERATOR      │
   └────────────────┘

   ───── VALIDATOR CHAIN ─────

   Any Generator Output
        │
        ▼
   ┌────────────────┐     ┌──────────────────┐
   │ DEPTH-AUDITOR  │────▶│ REGENERATOR      │──┐
   └────────────────┘     └──────────────────┘  │
                                                │ (re-audit loop)
   ┌────────────────────┐                       │
   │ MECHANICAL-DEPTH-  │──────────────────────▶│
   │ CHECKER            │                       │
   └────────────────────┘                       │
                                                ▼
   ┌────────────────────┐              Re-run auditors
   │ CROSS-REFERENCE-   │              until PASS or
   │ VALIDATOR          │              ESCALATE
   └────────────────────┘

   ───── HARDENING CHAIN ─────

   POST-COMPLETION-AUDITOR
        │
        ▼
   ENHANCEMENT-ROUND-GENERATOR
        │
        ▼
   EXPANSION-PLANNER
```

---

## Pre-Flight Check Protocol

Before running ANY generator, execute its pre-flight check. If any required input is missing, **BLOCK execution** and report the specific missing dependency.

### Pre-Flight Check Template

```
PRE-FLIGHT CHECK: {{GENERATOR_NAME}}
============================================

Checking required inputs...

{{#EACH REQUIRED_INPUT}}
  [{{PASS|FAIL}}] {{INPUT_DESCRIPTION}}
    Expected: {{EXPECTED_PATH}}
    Found: {{ACTUAL_STATUS}}
{{/EACH}}

============================================
{{#IF ALL_PASS}}
PRE-FLIGHT: PASS — {{GENERATOR_NAME}} is cleared to run.
{{/IF}}
{{#IF ANY_FAIL}}
PRE-FLIGHT: BLOCKED — Cannot run {{GENERATOR_NAME}}.

Missing dependencies:
{{#EACH FAILING_INPUT}}
  ✗ {{INPUT_DESCRIPTION}}
    Expected at: {{EXPECTED_PATH}}
    Required by: {{WHICH_SECTION_NEEDS_IT}}
    How to fix: Run {{UPSTREAM_GENERATOR}} first, or create {{EXPECTED_PATH}} manually.
{{/EACH}}
{{/IF}}
```

### Pre-Flight Checks Per Generator

#### PHASE-GENERATOR Pre-Flight
```
[CHECK] Tribunal executive summary exists at {{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md
[CHECK] Tribunal roadmap exists at {{TRIBUNAL_OUTPUT_PATH}}/roadmap.md
[CHECK] At least 1 implementation spec exists in {{TRIBUNAL_OUTPUT_PATH}}/implementation-specs/
[CHECK] At least 1 audit report exists in dev_docs/audit/

BLOCK MESSAGE: "Cannot run PHASE-GENERATOR: tribunal verdict not found at
{{TRIBUNAL_OUTPUT_PATH}}/executive-summary.md. Run the tribunal process first
(Orchestrator Steps 1-4)."
```

#### SERVICE-HUB-GENERATOR Pre-Flight
```
[CHECK] At least 1 service spec exists in dev_docs/specs/services/
[CHECK] (MODE: existing only) Backend controller directory exists
[CHECK] (MODE: existing only) Component catalog exists at dev_docs/components/_index.md

BLOCK MESSAGE: "Cannot run SERVICE-HUB-GENERATOR: no service specs found at
dev_docs/specs/services/. Run the tribunal process to generate service specs first
(Orchestrator Step 5)."
```

#### SCREEN-CATALOG-GENERATOR Pre-Flight
```
[CHECK] At least 1 service hub file exists in dev_docs/specs/services/
[CHECK] Task files directory exists at dev_docs/tasks/

BLOCK MESSAGE: "Cannot run SCREEN-CATALOG-GENERATOR: no service hub files found
at dev_docs/specs/services/. Run SERVICE-HUB-GENERATOR first."
```

#### CODE-SCAFFOLD-GENERATOR Pre-Flight
```
[CHECK] At least 1 service spec exists with score >=8/10 (check depth audit)
[CHECK] API contracts exist in dev_docs/specs/api/
[CHECK] Database docs exist at dev_docs/specs/database/
[CHECK] CONFIG block contains framework, ORM, database, and test tool settings

BLOCK MESSAGE: "Cannot run CODE-SCAFFOLD-GENERATOR: service specs have not
passed depth audit (>=8/10 required). Run DEPTH-AUDITOR and REGENERATOR first."
```

#### DEPTH-AUDITOR Pre-Flight
```
[CHECK] DEPTH-REQUIREMENTS.md exists at 10-generators/DEPTH-REQUIREMENTS.md
[CHECK] At least 1 spec file exists to audit (services, screens, or tasks)

BLOCK MESSAGE: "Cannot run DEPTH-AUDITOR: no spec files found to audit.
Generate specs first (Orchestrator Steps 5-8)."
```

#### CROSS-REFERENCE-VALIDATOR Pre-Flight
```
[CHECK] At least 1 service spec exists
[CHECK] At least 1 of: API catalog, screen catalog, or component catalog exists

BLOCK MESSAGE: "Cannot run CROSS-REFERENCE-VALIDATOR: no catalogs exist to
cross-reference. Run catalog generators first."
```

#### SPRINT-PLAN-GENERATOR Pre-Flight
```
[CHECK] STATUS.md exists at {{STATUS_FILE_PATH}}
[CHECK] CONFIG contains TEAM_SIZE
[CHECK] At least 1 task file exists in dev_docs/tasks/

BLOCK MESSAGE: "Cannot run SPRINT-PLAN-GENERATOR: STATUS.md not found at
{{STATUS_FILE_PATH}}. Run PHASE-GENERATOR first."
```

#### OPENAPI-GENERATOR Pre-Flight
```
[CHECK] At least 1 API contract file exists in dev_docs/specs/api/
[CHECK] At least 1 service spec exists in dev_docs/specs/services/

BLOCK MESSAGE: "Cannot run OPENAPI-GENERATOR: no API contract files found at
dev_docs/specs/api/. Run API-CATALOG-GENERATOR first."
```

#### WORKFLOW-E2E-TRACE-GENERATOR Pre-Flight
```
[CHECK] At least 1 service spec exists
[CHECK] At least 1 screen spec exists in dev_docs/specs/screens/
[CHECK] API catalog exists at dev_docs/api-catalog.md

BLOCK MESSAGE: "Cannot run WORKFLOW-E2E-TRACE-GENERATOR: no screen specs found
at dev_docs/specs/screens/. Generate screen specs first (Orchestrator Step 6)."
```

#### POST-COMPLETION-AUDITOR Pre-Flight
```
[CHECK] ORCHESTRATOR.md STATE BLOCK has COMPLETED array with >=1 entry
[CHECK] dev_docs/ directory exists with content
[CHECK] Audit checklist template exists at 34-hardening/audit-checklist.template.md

BLOCK MESSAGE: "Cannot run POST-COMPLETION-AUDITOR: no steps marked as
completed in ORCHESTRATOR.md STATE BLOCK. Complete orchestrator steps first."
```

---

## Execution Order for Full Project

When running the complete orchestrator flow, generators execute in this order:

```
1. AUDIT-GENERATOR (if existing codebase)
2. DATABASE-DOC-GENERATOR (if existing codebase)
3. COMPONENT-CATALOGER (if existing codebase)
4. API-CATALOG-GENERATOR (if existing codebase)
5. SERVICE-HUB-GENERATOR
6. SCREEN-CATALOG-GENERATOR
7. UI-STATE-MATRIX-GENERATOR
8. WORKFLOW-E2E-TRACE-GENERATOR
9. PHASE-GENERATOR
10. DEPENDENCY-GRAPHER
11. WORKFLOW-COVERAGE-MATRIX
12. JOURNEY-COVERAGE-MATRIX
── VALIDATION GATE ──
13. DEPTH-AUDITOR
14. MECHANICAL-DEPTH-CHECKER
15. CROSS-REFERENCE-VALIDATOR
16. REGENERATOR (if failures detected)
── REPEAT 13-16 UNTIL PASS ──
17. OPENAPI-GENERATOR
18. MOCK-SERVER-GENERATOR
19. CODE-SCAFFOLD-GENERATOR
20. SPRINT-PLAN-GENERATOR
21. USER-DOC-GENERATOR
── POST-COMPLETION ──
22. POST-COMPLETION-AUDITOR
23. ENHANCEMENT-ROUND-GENERATOR
24. EXPANSION-PLANNER
```

Steps 1-4 are skipped for greenfield projects (no existing code to audit).
