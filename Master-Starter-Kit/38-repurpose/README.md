# Section 38: Repurpose Path

> **Purpose:** Pivot or fork an existing application into a new industry vertical, reusing core functionality while adapting for a different customer segment. Replaces standard greenfield intake with a dual-context intake (source app + target vertical) and a 4-step pivot analysis pipeline.
> **Orchestrator steps:** R1-R4, then Steps 5-16 (scope varies by pivot depth), then hardening (Steps 29-33).
> **Path:** Repurpose only -- triggered when the user wants to adapt a working application for a new market.

## What This Section Does

The Repurpose path takes a working application and systematically evaluates how to adapt it for a different vertical. It classifies the pivot depth (Shallow, Medium, or Deep), maps which features carry over and which need replacement, analyzes market fit for the target vertical, and produces a differentiation plan. The pivot depth classification is a hard gate that determines the rest of the workflow.

| Step | File | Focus |
|------|------|-------|
| Intake | `REPURPOSE-INTAKE.md` | Auto-scan source app, gather target vertical context, capture both sides of the pivot |
| R1 | `PIVOT-DEPTH-DETECTOR.md` | Score the pivot across 5 dimensions (0-10), classify as Shallow/Medium/Deep |
| R2 | `FEATURE-INHERITANCE-MAP.md` | For every source feature: carry over, adapt, replace, deprecate, or create new |
| R3 | `MARKET-FIT-ANALYZER.md` | Buyer psychology, compliance landscape, competitive environment for the target vertical |
| R4 | `VERTICAL-DIFFERENTIATION-PLAN.md` | Concrete adaptation plan scoped to the pivot depth classification |
| R4-FORK | `FORK-ARCHITECTURE.md` | Monorepo structure and code sharing boundaries (Deep pivots only, score 7-10) |

After R4 completes, the workflow branches by pivot depth:

- **Shallow (0-3):** Proceed directly to hardening (Steps 29-33)
- **Medium (4-6):** Run Steps 5-6 and 8 adapted for the vertical, then hardening
- **Deep (7-10):** Run Fork Architecture, then Steps 5-16 for the new vertical, then hardening

---

## Files in This Section

| File | Type | Purpose |
|------|------|---------|
| `REPURPOSE-INTAKE.md` | Generator | Entry point -- auto-scans source app, gathers target vertical context and pivot rationale |
| `PIVOT-DEPTH-DETECTOR.md` | Generator | 5-dimension scoring (workflow, data model, UI, compliance, integration) to classify pivot depth |
| `FEATURE-INHERITANCE-MAP.md` | Generator | Feature-by-feature disposition map defining the shared core boundary |
| `MARKET-FIT-ANALYZER.md` | Generator | Market analysis for the target vertical: buyers, competitors, compliance, workflows |
| `VERTICAL-DIFFERENTIATION-PLAN.md` | Generator | Adaptation plan with scope determined by pivot depth tier |
| `FORK-ARCHITECTURE.md` | Generator | Monorepo structure and shared-core boundaries for Deep pivots (score 7-10 only) |

---

## Reading Order

1. **`REPURPOSE-INTAKE.md`** -- start here. Understand how the dual-context intake captures both the source application and the target vertical.
2. **`PIVOT-DEPTH-DETECTOR.md`** -- the 5 scoring dimensions and the Shallow/Medium/Deep classification that gates all downstream decisions.
3. **`FEATURE-INHERITANCE-MAP.md`** -- how each source feature is classified (carry over, adapt, replace, deprecate, or new).
4. **`MARKET-FIT-ANALYZER.md`** -- buyer psychology, compliance requirements, and competitive positioning for the new vertical.
5. **`VERTICAL-DIFFERENTIATION-PLAN.md`** -- the concrete plan, scoped by pivot depth, that drives implementation.
6. **`FORK-ARCHITECTURE.md`** -- read only for Deep pivots. Defines the monorepo structure that lets both verticals evolve independently without maintenance chaos.

---

## Key Concepts

**Pivot depth is a hard gate.** The 5-dimension score (0-10) determines how much planning work the Repurpose path produces. A Shallow pivot (re-skinning for a new industry with the same workflows) skips most planning. A Deep pivot (fundamentally different data model, compliance, and user workflows) triggers the full planning suite including fork architecture.

**Features inherit, they do not restart.** The Feature Inheritance Map prevents the common mistake of treating a pivot as a greenfield project. Every source feature gets an explicit disposition -- even "deprecate" is a deliberate decision that carries forward institutional knowledge about why the feature existed in the first place.

**Fork architecture is optional and earned.** Only Deep pivots (score 7-10) produce a fork architecture. Shallow and Medium pivots modify the existing codebase in place. Over-engineering the separation for a Shallow pivot wastes effort; under-engineering it for a Deep pivot creates maintenance nightmares.
