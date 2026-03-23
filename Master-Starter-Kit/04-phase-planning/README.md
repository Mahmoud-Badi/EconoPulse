# 04 - Phase Planning

Turn approved features and architecture into an executable sequence of phases, each with explicit tasks and measurable completion criteria.

## Purpose

Phase planning is the bridge between "what we're building" (architecture) and "what we do today" (development). Every phase leaves the app in a shippable state. Every task has a verification step. Every Must Have feature appears in exactly one phase.

## Inputs

| Input | Source | What You Need From It |
|-------|--------|-----------------------|
| `TRIBUNAL/VERDICT.md` | 01-research | The prioritized feature list (Must Have, Should Have, Won't Have) |
| `ARCHITECTURE/` folder | 02-architecture | Schema, routers, screens, design tokens, dependency graph |
| `docs/` folder | 03-documentation | Domain rules, glossary, data flows |

## Output

```
PROJECT_ROOT/
  PHASES/
    phase-0-foundation.md
    phase-1-{name}.md
    phase-2-{name}.md
    ...
    phase-{N-1}-polish-launch.md
    phase-{N}-post-launch.md
  PHASE-INDEX.md
```

## Critical Rules

1. **Every Must Have feature from the tribunal MUST appear in exactly one phase.** No feature is implied — it must be an explicit task. After generating all phases, cross-reference VERDICT.md and confirm 100% coverage.

2. **Every phase must leave the app in a shippable state.** No phase ends with broken builds, failing tests, or half-wired features.

3. **Phase 0 is always Foundation.** It is the same structure for every project. Use `phase-0-foundation.template.md` directly.

4. **The last feature phase is always followed by Polish + Launch.** Use `polish-launch-phase.template.md`.

5. **Counts-after-each-step is mandatory.** After every numbered step, update running totals of pages, API procedures, tests, components, and DB tables. This is how you prevent the "90% done for 3 months" problem.

## Workflow

```
1. Open VERDICT.md — list all Must Have features
2. Open ARCHITECTURE/ — identify data model dependencies
3. Group features into cohesive phases (shared data models)
4. Sequence phases (data before UI, auth before protected features)
5. Generate phase-0-foundation.md from template
6. Generate phase-1 through phase-{N-2} from feature-phase.template.md
7. Generate phase-{N-1}-polish-launch.md from template
8. Generate phase-{N}-post-launch.md (Should Have features)
9. Build PHASE-INDEX.md — summary table with feature coverage
10. Cross-check: every Must Have feature in VERDICT.md appears in exactly one phase
```

## Files in This Folder

| File | Purpose |
|------|---------|
| `phase-planning-guide.md` | Comprehensive guide: phase taxonomy, sequencing rules, sizing |
| `phase-0-foundation.template.md` | Universal Phase 0 template (same for every project) |
| `feature-phase.template.md` | Template for any feature phase (Phase 1 through N-2) |
| `polish-launch-phase.template.md` | Pre-built launch readiness phase |
| `phase-index.template.md` | Master summary table template |
| `task-decomposition-rules.md` | How to write good tasks with verification steps |

## Quick Start

1. Read `phase-planning-guide.md` for the full methodology
2. Read `task-decomposition-rules.md` for task quality standards
3. Copy `phase-0-foundation.template.md` and fill in placeholders
4. Use `feature-phase.template.md` for each feature cluster
5. Copy `polish-launch-phase.template.md` for the final pre-launch phase
6. Fill in `phase-index.template.md` to create your master summary

## Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|--------------|-------------|-----|
| "Build all schemas, then all APIs, then all UI" | App is unshippable for weeks; no feedback loop | Vertical slices: each phase delivers end-to-end features |
| "Phase 3: Build the billing module" | No one knows what "build billing" means | Decompose into 15-30 explicit tasks with verify steps |
| "We'll add tests later" | Tests never get written; bugs compound | Every phase includes tests for that phase's features |
| Skipping counts-after-each-step | "90% done" for 3 months straight | Mandatory running totals after every step |
| Features spread across phases | Feature is "half done" in multiple phases | Each feature lives in exactly one phase, fully complete |
