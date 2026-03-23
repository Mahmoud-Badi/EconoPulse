# {{PROJECT_NAME}} STATUS — Source of Truth

> **This is the MOST important file in the project.** Every session starts by reading this file. Every task completion updates this file. If STATUS.md and reality disagree, fix STATUS.md.

**Last Updated:** {{DATE}}
**Current Phase:** Phase {N} — {{PHASE_NAME}} ({X}/{Y} tasks) {{STATUS_EMOJI}}
**Active Task:** {{TASK_DESCRIPTION}}
**Active Files:** {{FILE1}}, {{FILE2}}

---

## Phase Progress

> Mark phases: `[ ]` = not started, `[~]` = in progress, `[x]` = complete

- [ ] Phase 0: Foundation — Project setup, tooling, CI ({0}/{N} tasks)
- [ ] Phase 1: {{PHASE_1_NAME}} ({0}/{N} tasks)
- [ ] Phase 2: {{PHASE_2_NAME}} ({0}/{N} tasks)
- [ ] Phase 3: {{PHASE_3_NAME}} ({0}/{N} tasks)
- [ ] Phase 4: {{PHASE_4_NAME}} ({0}/{N} tasks)
- [ ] Phase 5: {{PHASE_5_NAME}} ({0}/{N} tasks)
- [ ] Phase 6: {{PHASE_6_NAME}} ({0}/{N} tasks)
- [ ] Phase 7: {{PHASE_7_NAME}} ({0}/{N} tasks)
- [ ] Phase 8: {{PHASE_8_NAME}} ({0}/{N} tasks)
- [ ] Phase 9: {{PHASE_9_NAME}} ({0}/{N} tasks)
- [ ] Phase 10: {{PHASE_10_NAME}} ({0}/{N} tasks)

> Add or remove phases as needed. Typical project: 8-18 phases.

---

## Counts

> These are the project's vital signs. Update after every task.

| Metric | Current | Target | Notes |
|--------|---------|--------|-------|
| Pages built | 0 | {{TOTAL_PAGES}} | |
| API procedures | 0 | {{TOTAL_PROCEDURES}} | See per-router breakdown below |
| Tests passing | 0 | — | Target grows with code |
| Test coverage | 0% stmts / 0% funcs | 80%+ | |
| Components | 0 | {{TOTAL_COMPONENTS}} | Shared + page-specific |
| Database tables | 0 | {{TOTAL_TABLES}} | |
| Seed records | 0 | {{TOTAL_SEED_RECORDS}} | |

### Per-Router API Procedure Breakdown

| Router | Procedures | Status |
|--------|-----------|--------|
| {{ROUTER_1}} | 0/{N} | Not started |
| {{ROUTER_2}} | 0/{N} | Not started |
| {{ROUTER_3}} | 0/{N} | Not started |
| {{ROUTER_4}} | 0/{N} | Not started |
| {{ROUTER_5}} | 0/{N} | Not started |

---

## Current Phase Detail

### Phase {N}: {{PHASE_NAME}}

**Goal:** {{ONE_SENTENCE_GOAL}}
**Depends on:** Phase {N-1} complete
**Estimated effort:** {S/M/L/XL}

#### Tasks

- [ ] {N}.1 — {{TASK_1_DESCRIPTION}}
- [ ] {N}.2 — {{TASK_2_DESCRIPTION}}
- [ ] {N}.3 — {{TASK_3_DESCRIPTION}}
- [ ] {N}.4 — {{TASK_4_DESCRIPTION}}
- [ ] {N}.5 — {{TASK_5_DESCRIPTION}}

> Each task should be completable in a single session (1-3 hours).
> Prefix with step number for DEVLOG cross-reference.

---

## Known Issues

> Track bugs, tech debt, and deferred decisions here.
> Format: `[severity] description (discovered {date}, phase {N})`

(none)

---

## Architecture Decisions Log

> Record every significant technical decision with rationale.
> This prevents re-debating settled questions.

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| {{DATE}} | {{DECISION}} | {{WHY}} | {{WHAT_ELSE_WAS_CONSIDERED}} |

---

## Update Instructions

### When to Update This File

| Event | What to Update |
|-------|---------------|
| Start a new session | Read this file first, verify it matches reality |
| Complete a task | Check off task, update counts, update "Active Task" |
| Complete a phase | Mark phase `[x]`, move "Current Phase" to next |
| Discover a bug | Add to Known Issues |
| Make an architecture decision | Add to Architecture Decisions Log |
| End a session | Ensure everything is accurate, update "Last Updated" |

### Rules

1. **Never lie in STATUS.md** — If a task isn't truly done, don't check it off
2. **Counts must be verifiable** — Run `grep -r "export" | wc -l` or equivalent to verify
3. **One active task at a time** — If you're working on two things, something is wrong
4. **Active Files must be real** — List the actual files being modified right now
5. **Known Issues are not optional** — Every bug gets logged, even "minor" ones
