# Phase Index

> **Instructions:** Fill this in after generating all phase files. This is the master summary — the single page anyone reads to understand the project plan. Update it as phases complete.

## Phase Summary

| Phase | Name | Goal | Tasks | Weeks | Status | Must-Have Features |
|-------|------|------|-------|-------|--------|--------------------|
| 0 | Foundation | Working dev env with auth, DB, UI, deploy | {N} | 1 | pending | -- |
| 1 | {name} | {one-sentence goal} | {N} | {N} | pending | {feature1}, {feature2} |
| 2 | {name} | {one-sentence goal} | {N} | {N} | pending | {feature1}, {feature2} |
| 3 | {name} | {one-sentence goal} | {N} | {N} | pending | {feature1}, {feature2}, {feature3} |
| ... | ... | ... | ... | ... | ... | ... |
| {N-1} | Polish + Launch | Production-ready, tested, secure | {N} | 1 | pending | -- |
| {N} | Post-Launch | Should Have features from tribunal | {N} | ongoing | pending | {feature1}, {feature2} |

## Totals

| Metric | Count |
|--------|-------|
| Phases | {N} |
| Total tasks | {{TOTAL}} |
| Estimated timeline | {N} weeks |
| Must-Have features covered | {N}/{N} **(MUST be 100%)** |
| Should-Have features (post-launch) | {N} |
| Won't-Have features (not planned) | {N} |

---

## Must-Have Feature Coverage

**Every Must Have feature from VERDICT.md must appear in exactly one phase.** This table is the cross-reference proof.

| # | Feature (from VERDICT.md) | Phase | Status |
|---|---------------------------|-------|--------|
| 1 | {feature name} | Phase {N} | pending |
| 2 | {feature name} | Phase {N} | pending |
| 3 | {feature name} | Phase {N} | pending |
| 4 | {feature name} | Phase {N} | pending |
| 5 | {feature name} | Phase {N} | pending |
| ... | ... | ... | ... |

**Coverage: {N}/{N} (100%)**

If any feature shows "unassigned" or appears in multiple phases, the plan is incomplete. Fix before proceeding.

---

## Milestone Map

Key dates/weeks when meaningful progress becomes visible:

| Milestone | Target | Phase | What's Visible |
|-----------|--------|-------|----------------|
| Dev environment ready | Week 1 | Phase 0 | Auth works, shell renders, DB connected, staging deployed |
| First demo possible | Week {N} | Phase {N} | {First user-facing feature working end-to-end} |
| Core features complete | Week {N} | Phase {N} | {All essential workflows functional} |
| MVP complete | Week {N} | Phase {N} | {All Must Have features functional, ready for testing} |
| Launch ready | Week {N} | Phase {N} | {Polish complete, tested, secure, production deployed} |
| Post-launch features | Week {N}+ | Phase {N} | {Should Have features rolling out} |

---

## Running Counts by Phase

Track cumulative totals as each phase completes. Fill in actual numbers (not estimates) as phases finish.

| Phase | Pages | API Procs | Tests | Components | DB Tables | Build |
|-------|-------|-----------|-------|------------|-----------|-------|
| 0 | {N} | 0 | 2 | {N} | {N} | pass |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| ... | | | | | | |
| {N-1} | | | | | | |
| Final | | | | | | pass |

---

## Dependency Graph

Visual representation of phase dependencies (which phases must complete before others can start):

```
Phase 0: Foundation
  |
  +---> Phase 1: {name}
  |       |
  |       +---> Phase 3: {name} (depends on Phase 1 + 2)
  |
  +---> Phase 2: {name}
          |
          +---> Phase 3: {name}
                  |
                  +---> Phase 4: {name}
                          |
                          +---> Phase {N-1}: Polish + Launch
                                  |
                                  +---> Phase {N}: Post-Launch
```

> Replace with your project's actual dependency graph. Most projects are linear (each phase depends on the previous), but some phases can run in parallel if they touch independent data models.

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation | Phase Affected |
|------|--------|------------|------------|----------------|
| {e.g., Third-party API changes} | High | Low | {Pin API version, create adapter layer} | Phase {N} |
| {e.g., Schema migration on shared DB} | High | Medium | {pgSchema isolation, test migrations on staging first} | Phase 0 |
| {e.g., Auth provider rate limits} | Medium | Low | {Implement retry with backoff, cache sessions} | Phase 0 |

---

## Notes

- Phase status values: `pending` | `in_progress` | `complete`
- Update this file at the start and end of every phase
- If phase scope changes (tasks added or removed), update the task count here
- Keep Must-Have Feature Coverage at 100% — if a new feature is discovered, add it to VERDICT.md AND assign it to a phase here
