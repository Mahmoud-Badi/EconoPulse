# Phase Context — {{PHASE_NAME}} (Phase {{PHASE_NUMBER}})

**Generated:** {{TIMESTAMP}}
**Project:** {{PROJECT_NAME}}
**Step Range:** {{STEP_START}} – {{STEP_END}}

---

## Context Budget Strategy

Large builds rot when Claude loads everything. This file defines what to load for THIS phase only.
Total context target: ≤25K tokens of persistent files, leaving 175K+ for actual work.

---

## Always Read at Session Start (Tier 1 — every session)

These files are MANDATORY at the beginning of every session in this phase:

1. `dev_docs/ARCH-ANCHOR.md` — System understanding (~3K tokens)
2. `dev_docs/handoff.md` — What was done, what's next (~1K tokens)
3. `dev_docs/STATUS.md` — Progress dashboard (~2K tokens)
4. `CLAUDE.md` — Project rules and conventions (~3K tokens)

**Estimated Tier 1 budget:** ~9K tokens

---

## Read Before Each Task (Tier 2 — per task)

Load these ONLY when starting a new task, then let them compact after the task is done:

<!-- Customize per phase. Examples below for common phases. -->

<!-- IF PHASE = Discovery (0-2) -->
<!-- 5. Intake questionnaire template -->
<!-- 6. Feasibility template -->

<!-- IF PHASE = Architecture (3-5) -->
<!-- 5. Tribunal executive summary -->
<!-- 6. Domain rules document -->
<!-- 7. Current service spec being worked on -->

<!-- IF PHASE = Planning (6-8.5) -->
<!-- 5. Service matrix (dev_docs/completeness/service-matrix.md) -->
<!-- 6. Screen matrix (dev_docs/completeness/screen-matrix.md) -->
<!-- 7. Current phase task decomposition rules -->

<!-- IF PHASE = Implementation (9-16) -->
5. `dev_docs/services/{{CURRENT_SERVICE}}-hub.md` — Current service hub (~2K tokens)
6. `dev_docs/tasks/{{CURRENT_PHASE}}/{{TASK_FILE}}` — Current task file (~1K tokens)
7. Pre-task reading list (universal + type-specific from `04-phase-planning/pre-task-reading-lists.md`)

<!-- IF PHASE = Quality (16.5-18.8) -->
<!-- 5. Enforcement gates checklist -->
<!-- 6. Quality baselines -->
<!-- 7. Completeness dashboard -->

<!-- IF PHASE = Marketing (19-28.5) -->
<!-- 5. Marketing config (from ORCHESTRATOR STATE BLOCK) -->
<!-- 6. Current marketing template being worked on -->

**Estimated Tier 2 budget:** ~5K tokens per task

---

## Read On Demand (Tier 3 — only when referenced)

These files exist but should NOT be loaded at session start. Load only when a task explicitly
references them or when you need to look something up:

- `dev_docs/specs/services/*.md` — Full service specs (load specific one when needed)
- `dev_docs/specs/screens/*.md` — Screen specs (load specific one when needed)
- `dev_docs/specs/standards/*.md` — API standards (load when implementing endpoints)
- `dev_docs/foundations/design-tokens.md` — Load when doing frontend work
- `dev_docs/components/component-catalog.md` — Load before creating new components
- `dev_docs/tracker/dependency-map.md` — Load when task ordering questions arise
- `dev_docs/decisions/decision-journal.md` — Load when debating architecture choices

---

## Do NOT Read (Tier 4 — wastes context budget)

These files are NOT relevant to this phase. Loading them wastes context and accelerates compaction:

<!-- Customize per phase. Examples: -->

<!-- IF PHASE = Implementation -->
- Tribunal research files (decisions already in ARCH-ANCHOR)
- Marketing/SEO templates (not relevant until Phase 5+)
- Post-launch roadmap files
- Examples directory (12-examples/ is reference only)
- Other phase task files (only current phase tasks matter)
- Competitive intelligence files (already distilled into specs)

<!-- IF PHASE = Marketing -->
- Service specs (already built)
- Task files from implementation phases
- Test configuration files
- Database migration files

---

## Execution Window Config

For GSD window mode (`/gsd window`), this phase uses these settings:

- **Window size:** {{WINDOW_SIZE}} tasks (recommended: 12-18)
- **Window checkpoint:** After every {{WINDOW_SIZE}} tasks, update ARCH-ANCHOR.md and handoff.md
- **Parallel safe:** {{YES_NO}} — Can tasks in this phase run in parallel subagents?
- **Compaction risk:** {{LOW_MEDIUM_HIGH}} — How likely is context to compact during this phase?

---

## Phase Transition Checklist

Before moving to the next phase:

- [ ] ARCH-ANCHOR.md updated with any new services, decisions, or constraints from this phase
- [ ] handoff.md updated with phase completion summary
- [ ] STATUS.md phase marked complete with accurate counts
- [ ] DEVLOG.md has entries for all completed tasks
- [ ] session-context.md updated at session boundary
- [ ] PHASE-CONTEXT.md regenerated for next phase (different Tier 2/3/4 files)
- [ ] Enforcement gates for this phase all have proof artifacts

---

## Update Rules

- **Regenerate this file** at every phase transition (different phases need different files)
- **Do not update mid-phase** unless the scope of work changes dramatically
- **Kit-upgrade checks:** `/kit-upgrade` audits whether PHASE-CONTEXT.md exists and matches current phase
