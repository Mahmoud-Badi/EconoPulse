# Session Handoff — {{PROJECT_NAME}}

> **Purpose:** Ensure zero context loss between development sessions. An AI agent or developer reading this file should know exactly what to do next without reading anything else first.

---

## Current State

{One paragraph summarizing the full project state. Include: what's built, what works, all key counts (pages, procedures, tests, coverage), build status (passing/failing), production URL if deployed, and any blockers.}

**Example:**
> V3 has 30 pages, 87 API procedures, and 142 tests passing (81% coverage). Build is green. Production deployed at https://app.example.com. Phase 8 (Billing) is 3/5 tasks complete. The invoice list page and detail page are done. Invoice creation form is next. No blockers.

---

## Completed Milestones

> High-level milestones that are fully done. One line each.

- [x] {{MILESTONE_1}} (Phase {N}, {{DATE}})
- [x] {{MILESTONE_2}} (Phase {N}, {{DATE}})
- [x] {{MILESTONE_3}} (Phase {N}, {{DATE}})
- [x] {{MILESTONE_4}} (Phase {N}, {{DATE}})

---

## Phase {N} Progress

> Detailed checklist for the current phase. Copy from STATUS.md and keep in sync.

### Phase {N}: {{PHASE_NAME}}

- [x] {N}.1 — {{COMPLETED_TASK_1}}
- [x] {N}.2 — {{COMPLETED_TASK_2}}
- [x] {N}.3 — {{COMPLETED_TASK_3}}
- [ ] {N}.4 — {{NEXT_TASK}} <-- **NEXT**
- [ ] {N}.5 — {{FUTURE_TASK}}

---

## What Was Done (Step {X.Y.Z})

> Implementation details from the most recent session. Enables continuity.

### Files Created/Modified
- `{{FILE_PATH_1}}` — {what was done, line count}
- `{{FILE_PATH_2}}` — {what was done, line count}
- `{{FILE_PATH_3}}` — {what was done, line count}

### Key Implementation Details
- {Technical detail that the next session needs to know}
- {Any workaround or non-obvious approach used}
- {Dependency or prerequisite for the next task}

### Tests Added
- `{{TEST_FILE}}` — {N} tests ({describe what they cover})

### Commit
- `{{HASH}}` {commit message}

---

## Next Exact Action

> **This is the most important section.** Be as specific as possible. The next session should be able to start working immediately.

**Phase {N}: {{PHASE_NAME}}**
**Task:** {N}.{M} — {{TASK_DESCRIPTION}}

**Next:**
1. Open `{{SPECIFIC_FILE_PATH}}`
2. Run `{{SPECIFIC_COMMAND}}` to verify current state
3. Implement {{SPECIFIC_THING}} following the spec in `{{SPEC_FILE_PATH}}`
4. Test with `{{TEST_COMMAND}}`
5. Update STATUS.md counts

**Context needed:**
- Read `{{RELEVANT_DOC}}` for the full specification
- The {{ENTITY}} schema is in `{{SCHEMA_FILE}}`
- The {{RELATED_FEATURE}} was implemented in session #{N} — see DEVLOG

**Potential gotchas:**
- {Known issue or complexity to watch out for}
- {Dependency that must be verified first}

---

## Update Instructions

### When to Write This File

Update `handoff.md` at the **end of every development session**, after updating STATUS.md and DEVLOG.md.

### Checklist Before Closing a Session

- [ ] STATUS.md updated (counts, active task, phase progress)
- [ ] DEVLOG.md entry written (what was done, counts, technical notes, commit)
- [ ] handoff.md updated (current state, progress, next action)
- [ ] All changes committed and pushed
- [ ] Build is passing (`pnpm build && pnpm typecheck`)

### Quality Test

Read the "Next Exact Action" section aloud. If a developer with zero prior context couldn't start working within 2 minutes of reading it, the handoff is too vague. Add more specifics.
