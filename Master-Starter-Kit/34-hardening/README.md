# Section 34: Hardening Phase

> **Purpose:** Post-completion audit, enhancement, depth verification, deep dive, and expansion planning.
> **Orchestrator steps:** 29-33
> **Mandatory:** Yes — all paths must complete hardening before coding begins.

## What This Section Does

After all planning steps are complete — including stakeholder communications (Step 1.7), integrations (Step 14.9), and CX operations (Step 18.7.5) — the hardening phase runs 5 sequential steps with a total of 17 automated rounds to ensure the project plan is bulletproof:

| Step | Rounds | Focus |
|------|--------|-------|
| 29: Post-Completion Audit | 3 | Nothing was skipped, all files exist, all sections complete |
| 30: Enhancement Rounds | 3 | What did we miss? What can we do better? What patterns emerged? |
| 31: Depth & Completeness Verification | 5 | Phase sequencing, sub-task sufficiency, milestones, depth scoring, cross-references |
| 32: Deep Dive Audit & Enhancement | 3 | Per-service, per-phase, per-feature deep analysis |
| 33: Expansion Planning | 1 | Post-MVP features, new verticals, growth strategies |

## Round Protocol

Each multi-round step follows the same pattern:

1. Execute the round's analysis
2. Generate findings in `dev_docs/hardening/{step}/round-{N}-*.md`
3. Apply fixes for actionable findings
4. Log a round summary
5. Feed unresolved findings to the next round
6. **Early exit:** If a round finds 0 new issues AND `round >= 2`, skip remaining rounds

Round state is tracked in the orchestrator's `IN_PROGRESS` field for mid-step recovery.

## Output Structure

All hardening output goes to `dev_docs/hardening/`:

```
dev_docs/hardening/
  audit/               → Step 29 output
  enhancement/         → Step 30 output
  depth-verification/  → Step 31 output
  deep-dive/           → Step 32 output
  expansion/           → Step 33 output
```

## Templates in This Section

| File | Used By | Purpose |
|------|---------|---------|
| `audit-checklist.template.md` | Step 29 | Expected output files per step |
| `enhancement-categories.md` | Step 30 | Enhancement category reference |
| `depth-progressive-protocol.md` | Step 31 | 5-round progressive deepening rules |
| `deep-dive-checklist.template.md` | Step 32 | Per-entity audit checklist |
| `expansion-planning.template.md` | Step 33 | Expansion plan output template |
| `round-summary.template.md` | Steps 29-32 | Standard per-round summary format |

## Related Generators

- `10-generators/POST-COMPLETION-AUDITOR.md`
- `10-generators/ENHANCEMENT-ROUND-GENERATOR.md`
- `10-generators/EXPANSION-PLANNER.md`
