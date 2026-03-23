# Enhance Plan Overlay

**Purpose:** Instructions for running ORCHESTRATOR.md Steps 5-16 on an existing codebase. Each step has a modified protocol that reads audit findings first, extends what exists, and avoids regenerating what's already good.

**Path:** Enhance only

**Prerequisite:** Enhancement Backlog (`dev_docs/enhancement-backlog.md`) must be complete before starting Steps 5-16.

---

## The Core Rule

> **Extend, don't replace. Score ≥7 means document and protect. Score ≤4 means flag for replacement.**

Before running each standard kit step, check the Quality Scorecard for the relevant dimension:
- If the existing implementation scores **7+**: Document what exists, fill the gaps, do not rebuild.
- If the existing implementation scores **5-6**: Document what exists, plan systematic improvement, rebuild only components that block the enhancement goals.
- If the existing implementation scores **≤4**: Treat as a gap. Plan a replacement approach in the full planning output.

---

## Step 2 — AI Config (CLAUDE.md Generation)

**Standard step purpose:** Generate CLAUDE.md and AI agent configuration.

**Enhance modification:**

When generating the project's CLAUDE.md, include sections that did not exist in the standard template:

1. **Existing codebase rules** — Reference the protect list from `dev_docs/audit/quality-scorecard.md`. Add: "Do not modify files on the protect list without explicit user permission."
2. **Enhancement context** — Summarize the composite score, top 3 blockers, and the tier structure so any AI session knows the app's current state.
3. **Tech stack** — Pre-fill from the confirmed tech stack in `dev_docs/intake/enhance-intake.md`. Do not ask what stack to use.
4. **Existing patterns** — Note the patterns already in use (naming conventions, folder structure, state management approach). AI agents must follow existing patterns, not introduce new ones.

---

## Step 5 — Service Specs

**Standard step purpose:** Write hub files and service specs for all services.

**Enhance modification:**

1. **Inventory first.** Read the Services gap table from `dev_docs/audit/gap-analysis.md`. You have three categories:
   - Services that **exist and score 7+**: Write a hub file that documents the existing implementation. No spec changes — just capture what's there.
   - Services that **exist and score 5-6**: Write a hub file + a spec that includes a "Current State" section and a "Target State" section showing what needs to improve.
   - Services that are **entirely missing (gaps)**: Write full service specs as in the standard kit flow — treat these as greenfield.

2. **Do not invent what already works.** If Auth is solid (7+), the hub file for auth should accurately describe the existing implementation. Do not propose a new auth architecture because it would be cleaner.

3. **Note existing patterns.** Each hub file should include a "Patterns in use" section noting the actual patterns in the codebase (not what the template suggests):
   ```markdown
   ## Patterns in Use (Existing)
   - Error handling: try/catch in route handlers, errors returned as {error: string}
   - Validation: Zod schemas defined in shared/validation/
   - Database: Raw SQL via postgres.js (no ORM)
   ```

---

## Step 6 — Screen Specs

**Standard step purpose:** Write screen specifications for all screens.

**Enhance modification:**

1. **Inventory first.** Read the Screens gap table from `dev_docs/audit/gap-analysis.md`. Three categories:
   - Screens that **exist and score 7+ on UX audit**: Write a screen spec that documents the existing screen's purpose, states, and components. No design changes recommended.
   - Screens that **exist and score 5-6**: Write a spec with "Current Implementation" + "Proposed Improvements" sections.
   - Screens that are **entirely missing**: Write full screen specs per standard kit format.

2. **Respect existing design decisions.** If the app uses a sidebar nav, don't propose a top nav in the new screen specs. New screens inherit the existing navigation model unless the UX audit explicitly flagged it as a problem.

3. **Existing component reuse.** For each new or improved screen, note which existing components should be reused. Reference the component catalog if one exists or create `dev_docs/components/existing-component-catalog.md` first.

---

## Step 7 — Codebase Audit

**Enhance modification:** **Skip Step 7.** Steps E1-E4 replaced Step 7 with a far deeper audit sequence. Do not run Step 7.

---

## Step 8 — Task Generation

**Standard step purpose:** Generate task files by phase.

**Enhance modification:**

Tasks come from two sources in the Enhance path:

**Source 1: Enhancement Backlog tasks.** Convert Tier 1, 2, and 3 backlog items into task files. Each backlog item becomes one or more tasks in the appropriate phase:
- Tier 1 blockers → Phase 0 tasks (must run before feature development)
- Tier 2 improvements → Phase 1 or Phase 2 tasks
- Tier 3 depth items → Phase 3 or Phase 4 tasks

**Source 2: New capability tasks.** For services and screens that are entirely absent (from gap analysis), generate tasks using the standard kit task generation protocol.

**Task type flag:** Add a `type:` field to each task file header:
- `type: fix` — Addresses an audit finding
- `type: gap` — Fills an identified gap
- `type: new` — Adds a new capability that didn't exist before
- `type: document` — Documents what already exists

This allows the team to distinguish improvement work from new development work.

**Phase 0 is mandatory for Enhance path.** Add a Phase 0 called "Enhancement Foundation" that contains all Tier 1 blocker tasks. This phase must complete before Phase 1 begins.

---

## Step 9 — Dashboard & Sprint Plan

**Standard step purpose:** Populate STATUS.md.

**Enhance modification:**

Add an "Enhancement Progress" section to STATUS.md:

```markdown
## Enhancement Progress

| Metric | Value |
|--------|-------|
| Composite score at intake | {X.X}/10 |
| Tier 1 blockers remaining | {N} / {total} |
| Tier 2 items remaining | {N} / {total} |
| Critical gaps remaining | {N} / {total} |
| High gaps remaining | {N} / {total} |
| Target composite score | ≥7.5/10 |

Phase 0 (Enhancement Foundation) must complete before feature development begins.
```

---

## Step 10 — API Contract Registry

**Standard step purpose:** Map screens to APIs.

**Enhance modification:**

1. **Document existing endpoints first.** Read the codebase and document all existing API endpoints before designing new ones.
2. **Flag deprecated endpoints.** Mark any endpoints that the audit identified as needing replacement.
3. **New endpoints only for new features.** Don't redesign existing endpoints unless they were explicitly flagged as Critical in the security or architecture audit.

---

## Step 11 — Infrastructure Setup

**Standard step purpose:** Docker, turbo, eslint, husky, CI/CD templates.

**Enhance modification:**

Check the Infrastructure gap table from `dev_docs/audit/gap-analysis.md`:
- Infrastructure that **exists and is functional**: Document it. Do not replace it.
- Infrastructure that **exists and is broken**: Add to Tier 1 or Tier 2 backlog depending on severity.
- Infrastructure that **is entirely absent**: Generate it per the standard kit templates.

Do not introduce a new build system if the existing one works. Do not replace a working CI/CD pipeline. Add to it.

---

## Step 12 — Testing Infrastructure

**Standard step purpose:** Jest/Playwright configs, test utilities.

**Enhance modification:**

1. **Audit existing tests first.** Read the testing audit (E1-E) report. Don't generate test infrastructure that already exists.
2. **Extend, don't replace.** If Jest is configured and working, extend the existing config rather than replacing it.
3. **Generate missing test utilities only.** If the project is missing test factories, fixtures, or helpers — generate those. Don't touch working test infrastructure.
4. **New tests for new gaps.** For every critical gap or blocker that requires new code, generate corresponding test spec stubs.

---

## Step 13 — Design System

**Standard step purpose:** Design tokens, component system, Storybook.

**Enhance modification:**

1. **Catalog what exists first.** Before generating a design system, catalog existing UI components in `dev_docs/components/existing-component-catalog.md`.
2. **Extract, don't invent.** If the app uses Tailwind with a consistent color palette, extract those token values from the existing usage — don't define a new palette.
3. **Fill the gaps only.** Generate only what's missing: design tokens that aren't defined, components that don't exist, documentation that's absent.
4. **Storybook:** Only add Storybook if it was flagged in the enhancement goals or is absent and the team size justifies it.

---

## Step 14 — Security Hardening

**Standard step purpose:** Auth patterns, RBAC, validation.

**Enhance modification:**

This step is driven almost entirely by the security audit (E1-D). Cross-reference:
1. **P0 security findings** → Generate fix tasks, add to Tier 1 backlog. Include remediation specs in this step's output.
2. **Missing RBAC** → If absent per gap analysis, design and spec the RBAC layer as a new capability.
3. **Input validation gaps** → If validation is inconsistent, create a validation standards document that establishes the pattern for the whole codebase.
4. **Don't redesign working auth.** If JWT auth works and scores 7+, document it and extend it. Don't propose replacing it with a different auth system.

---

## Steps 15-16 — Observability & Handoff

**Standard step purpose:** Error handling, monitoring, handoff document.

**Enhance modification:**

**Step 15:** Cross-reference the documentation audit (E1-F). Generate only what's missing from the observability stack. If Sentry is already configured, document it — don't replace it.

**Step 16 (Handoff):** The Enhance path handoff document gets an additional section:

```markdown
## Enhancement Baseline

| Metric | At Intake | Target |
|--------|-----------|--------|
| Composite score | {X.X}/10 | ≥7.5/10 |
| Tier 1 items | {N} open | 0 open |
| Critical gaps | {N} | 0 |
| High gaps | {N} | ≤2 |

## Enhancement Path: What Was Done

{Summary of what was built, fixed, and documented in the Enhance run}

## Enhancement Path: What Remains

{Summary of Tier 2 and Tier 3 items — these are the next session's starting point}
```

---

## Steps 29-33 — Hardening

**No modification.** Hardening steps run identically to all other paths. They apply equally to enhanced codebases.

---

## General Rules for All Steps

1. **Read before generating.** At the start of every step, read the relevant audit dimension and gap table. Never generate a planning artifact without checking what already exists.
2. **Prefer additive over replacement.** When in doubt, add to what exists rather than replacing it.
3. **Protect-list enforcement.** Every file on the protect list (`dev_docs/audit/quality-scorecard.md`) must be treated as read-only during the planning phase. Planning documents can reference them but cannot prescribe changes.
4. **Track improvements vs. new work.** Use the `type:` flag (fix / gap / new / document) on every task file to keep enhancement work distinguishable from new feature work.
5. **Re-audit after Tier 1 complete.** Before starting Phase 1 feature development, re-run the Quality Scorecard to confirm composite score has improved.
