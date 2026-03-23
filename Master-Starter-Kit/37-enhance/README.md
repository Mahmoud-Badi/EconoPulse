# Section 37: Enhance Path

> **Purpose:** Audit, score, and systematically improve an existing application using the full Master Starter Kit framework. Replaces the standard greenfield intake (Step 1) with a codebase-aware intake and 4-step audit sequence.
> **Orchestrator steps:** E1-E4, then Steps 5-16 via plan overlay, then hardening (Steps 29-33).
> **Path:** Enhance only -- triggered when the user has a working application they want to improve, not build from scratch.

## What This Section Does

The Enhance path is for existing applications that need the kit treatment applied retroactively. Instead of starting with a blank project brief, it auto-scans the codebase, asks targeted questions about what is broken or missing, then runs a 4-step audit-to-backlog pipeline:

| Step | File | Focus |
|------|------|-------|
| Intake | `ENHANCE-INTAKE.md` | Auto-scan codebase, pre-fill tech stack, ask targeted enhancement questions |
| E1 | `DEEP-AUDIT-GENERATOR.md` | 6-dimension audit (architecture, UX, performance, testing, security, DevOps) with 3 rounds each |
| E2 | `QUALITY-SCORECARD.md` | Aggregate all 6 dimension scores into a composite scorecard with triage priorities |
| E3 | `GAP-ANALYZER.md` | Compare the app against kit standards to find what is entirely absent (not just poor) |
| E4 | `ENHANCEMENT-BACKLOG.md` | Convert audit findings and gaps into a prioritized, time-horizon-organized backlog |
| Overlay | `ENHANCE-PLAN-OVERLAY.md` | Modified instructions for running Steps 5-16 on an existing codebase (extend, do not replace) |

After E4 completes, the workflow continues with standard Orchestrator Steps 5-16 using the plan overlay, then proceeds to hardening (Steps 29-33).

---

## Files in This Section

| File | Type | Purpose |
|------|------|---------|
| `ENHANCE-INTAKE.md` | Generator | Entry point -- auto-scans codebase, pre-fills known answers, asks targeted enhancement questions |
| `DEEP-AUDIT-GENERATOR.md` | Generator | 6-dimension, 3-round-per-dimension deep audit of the existing application |
| `QUALITY-SCORECARD.md` | Generator | Aggregates dimension scores into composite score, identifies critical blockers |
| `GAP-ANALYZER.md` | Generator | Compares existing app against kit standards across 6 dimensions to find systematic absences |
| `ENHANCEMENT-BACKLOG.md` | Generator | Converts audit findings and gap analysis into prioritized backlog with 3 time horizons |
| `ENHANCE-PLAN-OVERLAY.md` | Guide | Step-by-step instructions for running Orchestrator Steps 5-16 on an existing codebase |

---

## Reading Order

1. **`ENHANCE-INTAKE.md`** -- start here. Understand how the auto-scan works and what questions get asked after the scan completes.
2. **`DEEP-AUDIT-GENERATOR.md`** -- the 6 audit dimensions and 3-round protocol that produce the raw findings.
3. **`QUALITY-SCORECARD.md`** -- how dimension scores aggregate into a composite score and triage priority.
4. **`GAP-ANALYZER.md`** -- the difference between "exists but poor" (audit) and "entirely missing" (gap analysis).
5. **`ENHANCEMENT-BACKLOG.md`** -- the final deliverable that drives all subsequent work.
6. **`ENHANCE-PLAN-OVERLAY.md`** -- read when starting Steps 5-16 to understand how each step is modified for existing codebases.

---

## The Core Rule

> **Extend, do not replace.** Score 7+ means document and protect. Score 5-6 means plan systematic improvement. Score 4 or below means flag for replacement.

The Enhance path respects what already works. It does not tear down a functioning application to rebuild it in the kit's image -- it identifies what is strong, what is weak, and what is missing, then produces a plan that improves the weak and fills the missing while protecting the strong.
