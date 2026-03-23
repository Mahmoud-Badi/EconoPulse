# Phase Handoff — {{PHASE_NUMBER}}: {{PHASE_NAME}}

**Written by:** {{PHASE_NAME}} orchestrator
**Timestamp:** {{ISO_TIMESTAMP}}
**Next phase:** {{NEXT_PHASE_NAME}}

---

## What Was Decided

> Key decisions made during this phase that all subsequent phases must respect.
> Be specific — "use Inter for body text" not "chose a font".

| Decision | Rationale | Constraint for next phases |
|----------|-----------|---------------------------|
| {{decision}} | {{why}} | {{what_this_means_downstream}} |

---

## Artifacts Produced

| File | Purpose | Used by |
|------|---------|---------|
| `{{path}}` | {{what_it_contains}} | Phase {{N}} |

---

## Assumptions Made

> Things that were inferred from the brief that the user did not explicitly specify.
> Raise these if the user wants to review them.

- {{assumption}}: {{basis_for_assumption}}

---

## Constraints for Next Phase

> Hard constraints the next subagent(s) MUST NOT violate.

1. {{constraint}}
2. {{constraint}}

---

## Open Questions

> Items that need user input or were left ambiguous. The orchestrator should surface these.

- [ ] {{question}} — impacts: {{what_it_affects}}

---

## Phase Summary

{{2-3 sentence plain-English summary of what this phase produced and what the next phase needs to know.}}

---

## Handoff Checklist

Before the next phase begins, verify:
- [ ] All artifact files listed above exist and are non-empty
- [ ] Open questions have been surfaced to the user (or documented as deferred)
- [ ] state.json has been updated with this phase's status = "complete"
- [ ] No conflicts exist between this phase's outputs and prior phase outputs
