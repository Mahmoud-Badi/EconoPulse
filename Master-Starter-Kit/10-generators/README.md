# Section 10: Generators

> **Purpose:** Auto-generation prompts that Claude runs during specific Orchestrator steps. Each generator reads upstream deliverables and produces structured output files in `dev_docs/`.
> **Used by:** Orchestrator Steps 4-33 (generators are invoked automatically; users do not run them manually).

## How Generators Work

Each generator follows the same pattern:

1. **Inputs** -- reads files produced by earlier steps (service specs, audit reports, hub files, etc.)
2. **Prompt** -- contains detailed instructions for what to generate and how to structure it
3. **Output** -- writes one or more files to a specific `dev_docs/` subdirectory
4. **Quality gate** -- output must meet the depth thresholds defined in `DEPTH-REQUIREMENTS.md`

Generators are not templates. Templates define the shape of an output file; generators define the reasoning process that fills templates in.

---

## Files in This Section

| File | Orchestrator Step | Purpose |
|------|-------------------|---------|
| `DEPTH-REQUIREMENTS.md` | Steps 5, 6, 8 | Minimum depth thresholds, pre-generation prompts, and qualitative scoring for all generated documents |
| `POST-COMPLETION-AUDITOR.md` | Step 29 | 3-round audit verifying every expected output exists and is complete |
| `PHASE-GENERATOR.md` | Step 4 | Reads tribunal deliverables and audit reports, generates phased task breakdown and STATUS.md |
| `SPRINT-PLAN-GENERATOR.md` | Step 4 | Generates sprint plans from phase/task files |
| `CODE-SCAFFOLD-GENERATOR.md` | Post-Step 16 | Generates typed code stubs (file skeletons with correct signatures) from completed service specs |
| `SCREEN-CATALOG-GENERATOR.md` | Step 6 | Consolidates all screens from service specs and hub files into a master catalog |
| `SERVICE-HUB-GENERATOR.md` | Step 5 | Creates per-service hub files as single source of truth for each service |
| `API-CATALOG-GENERATOR.md` | Step 10 | Generates a unified API catalog from all service specs and contracts |
| `DATABASE-DOC-GENERATOR.md` | Step 5 | Generates database documentation from schema definitions |
| `COMPONENT-CATALOGER.md` | Step 8 | Catalogs all UI components from screen specs and design system |
| `OPENAPI-GENERATOR.md` | Step 10 | Generates OpenAPI/Swagger specs from API contracts |
| `DEPENDENCY-GRAPHER.md` | Step 5 | Maps service-to-service dependencies into a dependency graph |
| `AUDIT-GENERATOR.md` | Step 7 | Generates per-service codebase audit reports |
| `ENHANCEMENT-ROUND-GENERATOR.md` | Step 30 | Runs 3-round enhancement analysis (what was missed, what can improve, what patterns emerged) |
| `EXPANSION-PLANNER.md` | Step 33 | Generates post-MVP expansion plan (new features, verticals, growth strategies) |
| `MOBILE-SCREEN-GENERATOR.md` | Step 15 | Generates mobile screen specs adapted from web screen catalog |
| `MOBILE-COMPONENT-GENERATOR.md` | Step 15 | Generates mobile component catalog from design system |
| `USER-DOC-GENERATOR.md` | Step 18 | Generates user-facing documentation (help center articles, onboarding flows) |
| `APP-STORE-LISTING-GENERATOR.md` | Step 17 | Generates App Store and Play Store listing copy |
| `FINANCIAL-MODEL-GENERATOR.md` | Step 25 | Generates financial projections and unit economics models |
| `BATTLE-CARD-GENERATOR.md` | Step 28 | Generates competitive battle cards from intelligence research |

---

## Reading Order

1. **`DEPTH-REQUIREMENTS.md`** -- read first. Defines the scoring rubrics and pre-generation thinking prompts that all other generators depend on.
2. **`PHASE-GENERATOR.md`** -- the most commonly used generator; produces the task breakdown that drives the entire build.
3. Any other generator as needed for the Orchestrator step you are currently executing.
4. **`POST-COMPLETION-AUDITOR.md`** -- read during hardening (Step 29) to understand the audit protocol.

---

## Related Sections

- **`34-hardening/`** -- consumes output from `POST-COMPLETION-AUDITOR.md`, `ENHANCEMENT-ROUND-GENERATOR.md`, and `EXPANSION-PLANNER.md`
- **`04-phase-planning/`** -- templates that `PHASE-GENERATOR.md` fills in
- **`03-documentation/`** -- spec templates that several generators target
