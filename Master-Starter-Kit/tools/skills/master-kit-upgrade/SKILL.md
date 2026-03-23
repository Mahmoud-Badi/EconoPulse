---
name: master-kit-upgrade
description: |
  Universal project audit and uplift engine — works on ANY project, not just kit-built ones.
  Automatically detects project maturity and bridges non-kit projects via the Enhance path
  before running audit phases. Deep-scans an existing project's codebase, dev_docs quality,
  feature health, GSD state, session lifecycle compliance, hook installation, CLAUDE.md rules,
  and enforcement gates — then uplifts everything that's broken or missing.

  For projects without dev_docs/: runs the Project Maturity Detector, then the Enhance Bridge
  (compressed audit + scaffolding) to create baseline documentation before proceeding with
  audit phases. No more dead ends for non-kit projects.

  Goes far beyond template diffing: measures execution discipline compliance rates, scores spec depth,
  detects stale features, validates state file sync, and installs missing enforcement hooks.

  Use when:
  - User says "upgrade kit", "run kit-upgrade", "audit my project", "check project health"
  - User says "uplift my project", "fix my session workflow", "install enforcement hooks"
  - User says "what's broken", "why do I keep forgetting to update handoff", "fix my GSD"
  - User says "kit diff", "what's new in the kit", "adopt missing templates"
  - User says "check my state files", "audit my docs quality", "score my specs"
  - User types /master-kit-upgrade or /kit-upgrade

  Modes (passed as argument after the skill name):
  - (no argument) or "scan"              → Full audit, read-only report (Phases 1-8)
  - "uplift"                             → Full audit + execute all fixes (Phases 1-10, including task generation)
  - "uplift [area]"                      → Targeted uplift for specific area (Phases 1-6 audit, then Phase 10 for area)
  - "uplift tasks-only"                  → Full audit + generate task files only, no direct fixes (Phases 1-9, then Phase 10.11)
  - "diff"                               → Template delta only (Phase 2 + Phase 7)
  - "adopt [sections|all-missing]"       → Selective template adoption (Phase 2 + Phase 11)
  - "rollback [upgrade-id]"              → Revert a specific upgrade (Phase 12 only)

  Uplift areas: gsd, session, hooks, claude-md, features, depth, state-files, templates, tasks-only

  Examples:
  - "/kit-upgrade"                                → Full project audit report
  - "/kit-upgrade uplift"                         → Full audit + fix everything
  - "/kit-upgrade uplift session"                 → Fix session lifecycle gaps only
  - "/kit-upgrade uplift hooks"                   → Install missing enforcement hooks only
  - "/kit-upgrade uplift claude-md"               → Add missing CLAUDE.md rules only
  - "/kit-upgrade uplift gsd"                     → Fix GSD state and config only
  - "/kit-upgrade uplift depth"                   → Score specs and flag shallow ones
  - "/kit-upgrade diff"                           → Template delta report
  - "/kit-upgrade adopt 04-phase-planning 32-integrations"
  - "/kit-upgrade uplift tasks-only"                   → Audit + generate /gsd task files (no direct fixes)
  - "/kit-upgrade adopt all-missing"
  - "/kit-upgrade rollback 2026-03-20-001"
---

# Master Kit Upgrade — Full Project Audit & Uplift Engine

## Kit Home (read-only reference)

```
{{KIT_HOME}}
```

Current kit version: **1.2.0** (Post-Code-Red + Audit Engine + 7-Tier Templates + Wave Engine, 2026-03)

---

## What This Does

You are the Master Kit **audit and uplift engine**. You perform two jobs:

**Job 1 — Deep Audit:** Scan an existing project across 9 dimensions (codebase sync, doc quality,
feature health, GSD state, session lifecycle, CLAUDE.md rules, hook enforcement, gate compliance,
template currency) and produce a quantified health report with scores and specific findings.

**Job 2 — Uplift Execution:** Fix what the audit found — install missing hooks, add missing CLAUDE.md
rules, sync state files, rebuild GSD state, flag shallow specs, label stale features, and adopt
new templates. All with rollback snapshots.

You do NOT re-run the kit from scratch. You perform surgical identification of gaps and then
fix them without disturbing active development workflows.

You NEVER overwrite project files without a rollback snapshot first.
You NEVER claim an upgrade is complete without writing an audit entry.
You NEVER invent placeholder values — only use values from `.kit-meta.json` or leave as `{{PLACEHOLDER}}`.
You NEVER auto-rewrite specs — you flag deficiencies and generate uplift prompts for guided rewrites.

---

## DISCOVERY — Interactive Menu

**Before routing to any mode**, if the user invoked `/kit-upgrade` with no arguments, or with `help`,
present this interactive menu. The user just picks a number.

```
Kit Upgrade Engine v1.1.0

What would you like to do?

── DIAGNOSE ──────────────────────────────────────────
  1. Full health audit         Scan all 9 dimensions, get a score
  2. Template diff             See what's new/changed in the kit

── FIX ───────────────────────────────────────────────
  3. Uplift everything         Audit + auto-fix all findings
  4. Uplift one area           Pick a specific area to fix:
       a. GSD state & config
       b. Session lifecycle
       c. Hooks (install missing)
       d. CLAUDE.md rules
       e. Feature health
       f. Spec depth
       g. State files (STATUS/handoff/DEVLOG)
       h. Templates (adopt new ones)
       i. Generate tasks only    Convert findings to /gsd task files

── TEMPLATES ─────────────────────────────────────────
  5. Adopt new templates       Grab templates added since last upgrade
  6. Adopt all missing         Install every template you don't have

── UNDO ──────────────────────────────────────────────
  7. Rollback                  Revert a previous upgrade

Pick a number (or 4a-4i for targeted uplift):
```

**Routing from menu selection:**
- `1` or Enter → **scan** mode (PHASE 1-8)
- `2` → **diff** mode (PHASE 2 + PHASE 7)
- `3` → **uplift** mode (PHASE 1-10)
- `4a` through `4i` → **uplift [area]** mode, mapping: a=gsd, b=session, c=hooks, d=claude-md, e=features, f=depth, g=state-files, h=templates, i=tasks-only
- `4` alone → ask "Which area? (a-i)" and show the sub-list again
- `5` → **adopt [sections]** mode — ask which sections
- `6` → **adopt all-missing** mode
- `7` → **rollback** mode — ask for upgrade ID (list available from `dev_docs/.kit-upgrades/`)

The user can also type the full command (e.g., "uplift hooks") instead of a number. Accept both.

If the user invoked `/kit-upgrade` WITH an argument (e.g., `/kit-upgrade uplift hooks`), skip the menu and route directly.

---

## MODE ROUTING

Parse the argument string before doing anything else:

- No argument or "scan" → **Print DISCOVERY banner above, then Run PHASE 1 through PHASE 8** (full audit, read-only report)
- "uplift" (no area) → **Run PHASE 1 through PHASE 10** (full audit + execute all fixes, including Phase 10.11 task generation)
- "uplift [area]" → **Run PHASE 1 through PHASE 6** (audit), then **PHASE 10 for targeted area only**
  - Valid areas: `gsd`, `session`, `hooks`, `claude-md`, `features`, `depth`, `state-files`, `templates`, `tasks-only`
- "uplift tasks-only" → **Run PHASE 1 through PHASE 9** (audit + classify), then **PHASE 10.11 only** (generate task files, skip direct fixes). In this mode, AUTO-FIX items also become task files since they are not executed directly.
- "diff [optional path]" → **Skip PHASE 1 intake; infer path from cwd; run PHASE 2 + PHASE 7**
- "adopt [sections|all-missing|all-outdated]" → **Run PHASE 2 version detection, then PHASE 11 (Adopt Mode)**
- "rollback [upgrade-id]" → **Run PHASE 12 (Rollback Mode) only**

---

## PHASE 0.5: NON-KIT PROJECT DETECTION

Before routing to any mode, check if the project has kit artifacts:

1. Determine `PROJECT_PATH` — use cwd if no path argument was given.

2. **Check if `PROJECT_PATH/dev_docs/` exists.**

3. **IF `dev_docs/` EXISTS** — this is a kit-built project. Proceed to PHASE 1.

4. **IF `dev_docs/` DOES NOT EXIST:**
   - Run the **Project Maturity Detector** from the kit at `00-discovery/PROJECT-MATURITY-DETECTOR.md`
   - Present the maturity assessment to the user

   **Route based on classification:**

   - **GREENFIELD or EARLY_BUILD (no kit artifacts):**
     Display: "This project scored [N]/100 ([classification]). It doesn't have enough existing code for an upgrade audit. Run `/kit` to start the planning pipeline first."
     Stop execution.

   - **MID_BUILD or MATURE (no kit artifacts):**
     Display:
     ```
     No kit artifacts found, but this is a [classification] project:
       - [N] source files, [N] test files
       - [N] git commits, active development: [yes/no]
       - Existing docs: [locations found]

     Running Enhance Bridge to create baseline documentation...
     ```
     Execute the **Enhance Bridge** sequence from `37-enhance/ENHANCE-BRIDGE.md`.
     After the bridge completes, `dev_docs/` now exists with audit artifacts.
     Proceed to PHASE 1 with the newly created artifacts.

---

## PHASE 1: INPUT COLLECTION

Before doing anything else, ask the user for the following. Do NOT proceed until you have this information.

For **scan** and **uplift** modes:

```
Master Kit Audit & Uplift Engine starting.

I need a few inputs to run the audit:

1. Project path — Path to the project root (the folder containing dev_docs/). Type "this" to use
   the current working directory.

2. Kit path — Path to the Master Starter Kit folder. Default:
   {{KIT_HOME}}/
   Press Enter to use default or provide a different path.

3. Codebase path (optional) — If the source code is in a different directory from dev_docs/
   (e.g., monorepo with code in apps/ but docs at root). Default: same as project path.

4. Audit scope — What to audit:
   (a) Full audit — all 9 dimensions (default)
   (b) Lifecycle only — session compliance, hooks, CLAUDE.md rules, GSD
   (c) Docs only — spec depth, state file quality, template currency
   (d) Codebase only — tech stack, code-to-spec sync, feature health

5. Output format — Should I (a) write to dev_docs/.kit-upgrades/, (b) print to conversation,
   or (c) both? (Default: c)
```

Wait for the user's response, then proceed.

Set `PROJECT_PATH` from the user's answer (or cwd if "this").
Set `KIT_PATH` from the user's answer (or default).
Set `CODEBASE_PATH` from the user's answer (or same as PROJECT_PATH).
Set `AUDIT_SCOPE` from the user's answer (default: "full").
Set `OUTPUT_FORMAT` from the user's answer (default: "c" — both).

For **diff** mode: skip this phase, use cwd as PROJECT_PATH.
For **adopt** mode: skip this phase, use cwd as PROJECT_PATH.

---

## PHASE 2: VERSION DETECTION

Determine what version of the Master Kit the project was built with. This creates the "old kit fingerprint."

Attempt to read `PROJECT_PATH/dev_docs/.kit-meta.json`.

If the file exists, extract: `kit_version`, `path`, `steps_completed`, `stack`, `placeholders`, `upgrades`
and use these as ground truth. Skip the inference steps below.

**If .kit-meta.json does NOT exist — inference sequence (run in order, stop when confident):**

### Step 2.1 — Check CHANGELOG.md
Look for `## [VERSION]` headers in the project's CHANGELOG.md. If found, record the version.

### Step 2.2 — Check ORCHESTRATOR.md step count
- Count the steps in the project's ORCHESTRATOR.md (if it exists in dev_docs/ or a docs folder)
- 30 steps → early kit (pre-1.0)
- 45 steps → v1.0.0

### Step 2.3 — Check key indicator files
Scan the project for presence/absence of these files:

| File | Introduced in | Meaning if absent |
|------|--------------|-------------------|
| `tasks/reading-lists/` in dev_docs/ | Post-1.0 (Code Red) | Project predates Code Red audit |
| `10-generators/UI-STATE-MATRIX-GENERATOR.md` in kit copy | Post-1.0 | Missing UI state enforcement |
| `10-generators/MECHANICAL-DEPTH-CHECKER.md` in kit copy | Post-1.0 | Missing mechanical depth verification |
| `32-integrations/integration-failure-spec.template.md` in kit | Post-1.0 | Missing integration failure specs |
| `03-documentation/spec-layer/catalogs/` in dev_docs/ | Post-1.0 | Missing business rule reference tables |
| `03-documentation/spec-layer/contracts/` in dev_docs/ | Post-1.0 | Missing component contracts |
| `client-log/` in dev_docs/ | Post-1.0 | Missing client-facing work logs |
| `comms/` in dev_docs/ | v1.0.0 (step 31) | Missing stakeholder comms / diagram suite |
| `sprints/` in dev_docs/ | v1.0.0 (step 8.5) | Missing sprint plan output |

### Step 2.4 — Check STATUS.md or handoff.md
Look for any version or kit notes in the project's state files.

### Print version fingerprint

```
Kit Fingerprint
───────────────
Detected base version: [v1.1.0 / v1.0.0 / pre-1.0 / unknown]
Missing post-1.0 additions: [list files/folders absent]
Present post-1.0 additions: [list files/folders found]
Confidence: [high / medium / low]
Past upgrades on record: [N from .kit-meta.json or "none — no .kit-meta.json found"]
```

---

## PHASE 3: DEEP AUDIT — CODEBASE SCAN

**Purpose:** Understand what the project actually IS, not just what its docs say. Detect tech stack,
structure, and sync gaps between code and documentation.

**Skip conditions:** Skip if `AUDIT_SCOPE` is "lifecycle-only" or "docs-only". Skip Steps 3.2-3.3
if no `src/`, `app/`, or `pages/` directory exists (project hasn't been scaffolded yet).

### Step 3.1 — Tech Stack Detection

Read `CODEBASE_PATH/package.json` (or `pyproject.toml`, `Cargo.toml`, `go.mod` for non-JS projects):

- **Framework**: Next.js, NestJS, Express, Fastify, etc. (from dependencies)
- **Language version**: TypeScript version, Node version from `.nvmrc` or `engines`
- **ORM**: Drizzle, Prisma, TypeORM, Sequelize (from dependencies)
- **Auth**: Better Auth, Clerk, NextAuth, custom (from dependencies)
- **UI library**: shadcn/ui, Radix, MUI, Chakra (from dependencies + component dirs)
- **Testing**: Jest, Vitest, Playwright (from devDependencies)
- **Package manager**: pnpm (pnpm-lock.yaml), npm (package-lock.json), yarn (yarn.lock)
- **Monorepo**: Turborepo (turbo.json), Nx (nx.json), or single-app

Cross-reference detected stack against `.kit-meta.json` `stack` field if it exists — flag mismatches.

### Step 3.2 — Project Structure Audit

- Glob for source directories, count `.ts`/`.tsx`/`.js`/`.jsx` files
- Detect directory pattern: `src/` vs `app/` vs flat structure
- Count test files (`.test.ts`, `.spec.ts`, `*.e2e.ts`)
- Count component files vs utility files vs API route files

### Step 3.3 — Codebase-to-Spec Sync Check

For each service spec in `dev_docs/specs/services/` or `dev_docs/specs/*-service*.md`:
- Extract the service name
- Search the codebase for a matching directory, module, or route
- Flag: "Documented but unbuilt" (spec exists, no code) or "Built but undocumented" (code exists, no spec)

For each screen spec in `dev_docs/specs/screens/` or `dev_docs/specs/*-screen*.md`:
- Extract the screen/page name
- Search for a matching page route or component
- Flag the same sync issues

### Step 3.4 — Output

```
CODEBASE SCAN
─────────────
Stack: [framework] + [ORM] + [auth] + [database]
Package manager: [detected]
Source files: [N] (.ts/.tsx)
Test files: [N]
Monorepo: [yes/no — tool if yes]
Services documented: [N] | Services with code: [N] | Gap: [N] unbuilt, [N] undocumented
Screens documented: [N] | Routes present: [N] | Gap: [N] unbuilt, [N] undocumented
Stack vs .kit-meta.json: [match / mismatch — details]
```

Store results in `AUDIT.codebase` for Phase 8.

---

## PHASE 4: DEEP AUDIT — DEV DOCS QUALITY

**Purpose:** Score the quality of every documentation file — not just existence but depth, accuracy,
and freshness. This catches the "shallow specs that pass existence checks but fail in execution" problem.

**Skip conditions:** Skip if `AUDIT_SCOPE` is "codebase-only".

### Step 4.1 — Service Spec Depth Scoring

For each file matching `dev_docs/specs/services/*.md` or `dev_docs/specs/*-service*.md`:

Run the MECHANICAL-DEPTH-CHECKER (from `10-generators/MECHANICAL-DEPTH-CHECKER.md`):

| Check | Threshold | How to measure |
|-------|-----------|---------------|
| Word count | ≥1500 | Count words (exclude frontmatter, code blocks) |
| Business rules | ≥8 numbered rules | Count lines matching pattern `^[0-9]+\.` under Business Rules heading |
| API endpoints | ≥3 | Count endpoint definitions (GET, POST, PUT, DELETE, PATCH patterns) |
| Error scenarios | ≥5 | Count items under Error Handling / Error Scenarios heading |
| Edge cases | ≥8 | Count items under Edge Cases heading |
| Validation rules | ≥8 | Count items under Validation heading |
| Red-flag phrases | 0 occurrences | Search for: "TBD", "TODO", "placeholder", "will be determined", "to be decided", "coming soon" |
| Cross-references | ≥2 | Count links to other specs or files |

**Scoring:** Each check is pass/fail. Score = passed checks / 8. Rating: ≥7/8 = PASS, 5-6/8 = WARN, <5/8 = FAIL.

### Step 4.2 — Screen Spec Depth Scoring

For each file matching `dev_docs/specs/screens/*.md` or `dev_docs/specs/*-screen*.md`:

| Check | Threshold | How to measure |
|-------|-----------|---------------|
| Word count | ≥800 | Count words |
| State matrix | ≥4 states | Check for: loading, error, empty, populated (plus any context-specific) |
| Component list | Present | Section listing component hierarchy |
| Responsive notes | Present | Mentions breakpoints or mobile behavior |
| Accessibility | Present | Mentions ARIA, keyboard nav, or screen reader |
| Red-flag phrases | 0 | Same as service specs |

**Scoring:** Score = passed checks / 6. Rating: ≥5/6 = PASS, 3-4/6 = WARN, <3/6 = FAIL.

### Step 4.3 — STATUS.md Accuracy Audit

Read `dev_docs/STATUS.md`:
- Parse task checkboxes: count `[x]` (done) and `[ ]` (pending)
- Parse phase headers: extract claimed percentages (e.g., "Phase 2 — 4/8 complete — 50%")
- **Accuracy check**: Do checkbox counts match the claimed phase percentages?
- **Staleness check**: Look for "Last Updated" or "Active Task" date. If >7 days old, flag STALE.
- **Orphan check**: List any tasks mentioned in STATUS.md that don't have corresponding task files in `dev_docs/tasks/`

### Step 4.4 — handoff.md Quality Audit

Read `dev_docs/handoff.md`:
- **Exists?** If not, score = 0 (ABSENT)
- **2-minute resumption test**: Score 0-3:
  - 3 (SPECIFIC): Contains file paths, task IDs, AND numbered action steps in "Next Action"
  - 2 (VAGUE): Contains some context but missing file paths or task IDs
  - 1 (TEMPLATE): Still contains `{{...}}` placeholders or generic text
  - 0 (ABSENT): File doesn't exist
- **Freshness**: Check "Last Updated" timestamp. If >3 days old with active development, flag STALE.
- **Blockers section**: Check if "Blockers" or "Open Questions" has unresolved items with no corresponding resolution in DEVLOG.

### Step 4.5 — DEVLOG.md Audit

Read `dev_docs/DEVLOG.md`:
- **Entry count**: Total timestamped entries
- **Date continuity**: Identify gaps >7 days between entries (flag each gap)
- **Freshness**: Date of most recent entry vs today
- **Session correlation**: Compare entry count against STATUS.md completed task count. Large discrepancy = missing entries.

### Step 4.6 — master-tracker Sync Audit

If `dev_docs/tracker/master-tracker.md` exists:
- Parse subtask statuses (complete, in-progress, blocked, not-started)
- Compare against STATUS.md: does the tracker completion count match STATUS.md checkbox count?
- Flag discrepancies with specific task IDs

### Step 4.7 — session-context.md Audit

Check `dev_docs/session-context.md`:
- **Exists?** If not, flag ABSENT
- **Content check**: If it exists, check for real content vs template-only (all `{{...}}` still present)
- **Session history**: Check if the session history table has entries

### Step 4.8 — Output

```
DEV DOCS QUALITY AUDIT
──────────────────────
Service specs: [N] total | [N] PASS | [N] WARN | [N] FAIL
  Failing: [list spec names + specific deficiencies]
Screen specs: [N] total | [N] PASS | [N] WARN | [N] FAIL
  Failing: [list spec names + specific deficiencies]
STATUS.md:     [CURRENT / STALE (N days) / DESYNC (N mismatches) / ABSENT]
handoff.md:    [SPECIFIC (3/3) / VAGUE (2/3) / TEMPLATE (1/3) / ABSENT (0/3)]
DEVLOG.md:     [OK (N entries, last N days ago) / GAPS (N gaps >7 days) / ABSENT]
master-tracker: [SYNCED / DESYNC (N discrepancies) / ABSENT]
session-context: [POPULATED / TEMPLATE-ONLY / ABSENT]
```

Store results in `AUDIT.docs` for Phase 8.

---

## PHASE 5: DEEP AUDIT — FEATURE HEALTH

**Purpose:** Detect stale features, blocked chains, and tracking accuracy. Answers: "Are we actually
making progress, or are features stuck without anyone noticing?"

**Skip conditions:** Skip if `AUDIT_SCOPE` is "lifecycle-only". Skip if STATUS.md doesn't exist.

### Step 5.1 — Feature Completion Mapping

Parse STATUS.md by phase. For each phase:
- Count tasks by status: total, complete `[x]`, pending `[ ]`
- Calculate completion percentage
- Identify the "active task" (currently being worked on)

### Step 5.2 — Stale Feature Detection

For each task marked as in-progress or pending:
- Check DEVLOG.md for the most recent entry mentioning this task ID or name
- If no DEVLOG entry in 2+ sessions (or >7 days), flag as STALE
- Check `git log --oneline --all -- 'dev_docs/tasks/*[task-id]*'` for last modification date

### Step 5.3 — Blocked Chain Analysis

For each task marked as blocked (in STATUS.md, master-tracker, or task file frontmatter):
- Trace the blocker: what task/item is it blocked on?
- Is the blocker itself blocked? (chain detection)
- How long has the blocker been unresolved? (check DEVLOG dates)
- Calculate downstream impact: how many tasks depend on this blocked task?

### Step 5.4 — Dependency Accuracy Check

If `dev_docs/tracker/dependency-map.md` exists:
- Read task files and extract `depends-on` or `blocked-by` frontmatter
- Compare against dependency-map.md entries
- Flag: missing edges (task has dependency not in map) and phantom edges (map has dependency not in task files)

### Step 5.5 — Output

```
FEATURE HEALTH
──────────────
Phase completion:
  Phase 1 ([name]): [N]/[N] complete ([%]) [status emoji]
  Phase 2 ([name]): [N]/[N] complete ([%]) — [N] STALE tasks
  ...

AT-RISK FEATURES (no progress in 2+ sessions):
  [task-id] "[task-name]" — last DEVLOG mention: [date], blocked on: [blocker or "not blocked"]
  ...

BLOCKED CHAINS:
  [task-id] → blocked by [blocker-id] → blocked by [root-cause-id] (chain length: N, N days unresolved)
  Downstream impact: [N] tasks waiting on this chain
  ...

DEPENDENCY ISSUES:
  Missing from dependency map: [list tasks with undocumented dependencies]
  Phantom entries in dependency map: [list edges that don't match task files]
```

Store results in `AUDIT.features` for Phase 8.

---

## PHASE 6: DEEP AUDIT — EXECUTION LIFECYCLE

**Purpose:** This is the critical phase. It detects WHY state files keep going stale, WHY session-end
gets skipped, WHY post-compact recovery doesn't happen. It measures compliance rates and identifies
the specific enforcement gaps causing the user's frustration.

**Skip conditions:** Skip if `AUDIT_SCOPE` is "codebase-only".

### Step 6.1 — GSD Audit

Check `.gsd/` directory at `PROJECT_PATH`:

**If `.gsd/state.json` exists:**
- Parse JSON and validate structure (must have: `version`, `project`, `status`, `summary`, `tasks`)
- Validate counts: `summary.total` must equal actual task count in `tasks` object
- Validate breakdown: `completed + in_progress + blocked + pending` must equal `total`
- Cross-reference task statuses with STATUS.md — flag discrepancies
- Check `session_count` and `last_updated` for freshness
- Check `.gsd/sessions/` for session log completeness

**If `.gsd/` does NOT exist:**
- Check if `dev_docs/tasks/` has task files (GSD should be initialized)
- Flag: "GSD not initialized but task files exist"

**If `.gsd/config.json` exists:**
- Verify `task_dir` points to an existing directory

**Output:** GSD status: `VALID` / `DESYNC (N issues)` / `NOT INITIALIZED` / `CORRUPT`

### Step 6.2 — CLAUDE.md Rule Audit

Read the project-level `CLAUDE.md` (at `PROJECT_PATH/CLAUDE.md` or `PROJECT_PATH/.claude/CLAUDE.md`).

Check for presence of these 8 mandatory rule categories. Use keyword matching — the exact wording
varies per project, but the concepts must be present:

| # | Rule Category | Keywords to grep | Source |
|---|---|---|---|
| 1 | Session management | `/session-start`, `/session-end`, `/kickoff` | Kit Rule 15 |
| 2 | Post-task protocol | "Post-Task Protocol", "STATUS.md" + "update", "after completing" + "task" | Kit Rule 22 |
| 3 | Plan change protocol | "Plan Change", "plan modification", "plan-changed" | Kit Rule 26 |
| 4 | Session completion checklist | "Session Completion", "session boundary", "before ending" | Kit Rule 25 |
| 5 | Depth enforcement | "depth" + "score", "≥8/10", "depth threshold" | Kit Rule 12 |
| 6 | Show-me / proof rule | "proof artifact", "Show Me", "evidence", "screenshot" | Kit Rule 17 |
| 7 | State file update rules | "handoff.md" + "DEVLOG.md" + "update", "state files" | Kit Rule 7 |
| 8 | Compact recovery | "compact", "context recovery", "after compaction", "resume" + "read" | Kit Rule 15 |

**Scoring:** Count present / 8. Rating: 7-8 = PASS, 5-6 = WARN, <5 = CRITICAL.

List which specific rules are MISSING.

### Step 6.3 — Hook Installation Audit

Read `.claude/settings.json` at `PROJECT_PATH`. If it doesn't exist, also check `.claude/settings.local.json`.

Check for presence of these 7 required hooks:

| # | Hook | Event | How to detect |
|---|---|---|---|
| 1 | Post-task protocol | Stop | Prompt text contains "POST-TASK" or "state file" + "update" or "STATUS.md" |
| 2 | Commit state check | PreToolUse | Prompt text contains "git commit" + "state file" or "COMMIT BLOCKED" |
| 3 | Context anchor | PreCompact | Prompt text contains "CONTEXT ANCHOR" or "compaction" + "discipline" |
| 4 | Plan change detector | Stop | Prompt text contains "PLAN CHANGE" or "planning files" + "tracker" |
| 5 | Session completion | Stop | Prompt text contains "SESSION" + ("COMPLETION" or "REMINDER") + "handoff" |
| 6 | GSD Stop guard | Stop | Prompt text contains "gsd" + "state.json" + "in_progress" |
| 7 | GSD PreCompact guard | PreCompact | Prompt text contains "gsd" + "CONTEXT GUARD" or "state.json" + "compaction" |

**Scoring:** Count installed / 7. Rating: 6-7 = PASS, 4-5 = WARN, <4 = CRITICAL.

List which specific hooks are MISSING with their purpose.

### Step 6.4 — Session Lifecycle Compliance

This is detective work using timestamps and file content to measure how consistently the team
follows session discipline. Each metric produces a percentage.

**6.4a — Session-end run rate:**
- Read DEVLOG.md and count distinct sessions (look for session headers, date boundaries, or "/session-end" mentions)
- Read handoff.md and check if "Last Updated" dates correlate with session end dates
- Metric: sessions where handoff was updated / total sessions identified. Express as percentage.

**6.4b — Post-task protocol compliance:**
- Count `[x]` (completed) tasks in STATUS.md
- Count DEVLOG.md entries that reference specific task IDs or task names
- Metric: DEVLOG entries with task references / completed tasks. Express as percentage.
- Large gap = tasks being completed without DEVLOG entries.

**6.4c — Post-compact recovery compliance:**
- Check DEVLOG.md for entries containing "resuming", "context recovery", "after compaction", "reading handoff"
- Check if there are any entries that suggest context was lost and recovered
- Metric: evidence found / estimated compaction events (approximate from session count and DEVLOG gaps)

**6.4d — "Coming back with answer" compliance:**
- Search handoff.md for "Blockers" or "Open Questions" sections
- Check DEVLOG.md for entries that resolve those blockers
- Metric: blockers with resolution entries / total blockers listed

**Output compliance dashboard:**
```
SESSION LIFECYCLE COMPLIANCE
────────────────────────────
Session-end run rate:     [N]/[N] sessions ([%])
Post-task protocol rate:  [N]/[N] tasks ([%])
Post-compact recovery:    [evidence level: strong / weak / none]
Blocker resolution:       [N]/[N] blockers resolved with DEVLOG entries ([%])
Handoff quality trend:    [improving / stable / degrading] (based on last 3 vs first 3 sessions)
```

### Step 6.5 — Enforcement Gates Audit

Read the project's current step from ORCHESTRATOR STATE BLOCK or STATUS.md phase information.

Cross-reference against the 16 gates in `ENFORCEMENT-GATES.md`:

| Gate | Trigger Step | Proof Required |
|------|-------------|----------------|
| 1 AI Context Verification | Session boundaries + Step 8.6 | Context audit log |
| 2 Design Consistency | Step 13 + feature gates | Design audit checklist |
| 3 Responsive Verification | Feature gates | Screenshots at 4 breakpoints |
| 4 No Shells | Feature gates | Shell detector checklist |
| 5 Dead UI Prevention | Step 8.6 + feature gates | Dead UI checklist |
| 6 Workflow Completeness | Step 8.5 + 8.6 | workflow-coverage-matrix.md |
| 7 Screen User-Completeness | Step 6.5 | Screen completeness checklist |
| 8 User Journey Verification | Step 16 | journey-coverage-matrix.md |
| 9 DR Verification | Step 18.6 | 7 DR playbooks |
| 10 Infrastructure Sizing | Step 17 | infrastructure-sizing.md |
| 11 Persona-Screen Completeness | Step 6.5 | Persona workflow trace |
| 12 Cross-Document Consistency | Step 9.6 | 6-point consistency checklist |
| 13 Phantom Table Check | Step 8.6 | Entity reference inventory |
| 14 Dead UI Sweep | Step 7 (existing apps) | Dead UI sweep report |
| 15 Regulatory Completeness | Step 14 (conditional) | Regulatory requirement matrix |
| 16 Client Log Consistency | Session boundaries | Client log vs DEVLOG cross-check |

For each gate whose trigger step has been reached (based on current progress):
- Check if the proof artifact file exists in `dev_docs/`
- Score: gates with proof / gates that should have proof by now

**Output:**
```
ENFORCEMENT GATES
─────────────────
Project progress: Step [N] / Phase [name]
Gates that should be passed: [N]
Gates with proof artifacts: [N]
MISSING PROOF: [list gate names + what proof is needed]
```

### Step 6.6 — Full Execution Lifecycle Output

Combine Steps 6.1-6.5 into a single output block:

```
EXECUTION LIFECYCLE AUDIT
─────────────────────────
GSD:             [VALID / DESYNC / NOT INITIALIZED / CORRUPT] — [details]
CLAUDE.md:       [N]/8 mandatory rules present ([%]) — MISSING: [list]
Hooks:           [N]/7 hooks installed ([%]) — MISSING: [list with purposes]
Session compliance:
  Session-end run rate:     [%]
  Post-task protocol rate:  [%]
  Post-compact recovery:    [evidence level]
  Blocker resolution rate:  [%]
  Handoff quality trend:    [direction]
Enforcement gates: [N]/[N] passed ([%]) — MISSING: [list]
```

Store results in `AUDIT.lifecycle` for Phase 8.

---

## PHASE 7: TEMPLATE COMPARISON

Systematically compare the project against the Master Kit across all template categories.
For each category: check what the project has vs. what the kit provides, flag using the legend below.

### Delta Legend
- `[NEW]` — File/feature exists in the upgraded kit but NOT in the project. Safe to add.
- `[CHANGED]` — File exists in both but the kit version has new sections/rules/thresholds. Requires manual merge.
- `[SAME]` — No meaningful delta. No action needed.
- `[CONFLICT]` — Project has custom content that the kit version would alter. Human review required.
- `[SKIP]` — Kit file is not applicable to this project type.

### Category 1: DISCOVERY (00-discovery/)
Check for: intake questionnaire completeness, feasibility template, stakeholder register.
**New files (7-tier upgrade — Tier 4, Discovery Hardening):**
- `00-discovery/assumption-registry.template.md` [NEW]
  → Track and validate assumptions early — prevents spec drift from unverified premises
- `00-discovery/discovery-delta.template.md` [NEW]
  → Captures delta between intake assumptions and tribunal findings
- `00-discovery/interview-verification-protocol.md` [NEW]
  → Protocol for validating discovery claims against real user interviews
- `00-discovery/stakeholder-alignment.template.md` [NEW]
  → Structured stakeholder alignment document with sign-off gates

### Category 2: TRIBUNAL (01-tribunal/)
Check for: 10-round adversarial research framework, competitor analysis templates.
**New files (7-tier upgrade — Tier 4, Discovery Hardening):**
- `01-tribunal/conflict-resolution.md` [NEW]
  → Protocol for resolving conflicting tribunal findings across rounds
- `01-tribunal/persona-validation.md` [NEW]
  → Framework for validating personas against real user data post-tribunal

### Category 3: ARCHITECTURE (02-architecture/)
Check for: DB design, API decisions, state management patterns, queue architecture templates.
**New files (7-tier upgrade — Tier 3, Architecture Depth):**
- `02-architecture/slo-framework.md` [NEW]
  → SLO/SLI/SLA definitions, error budget policies, burn-rate alerting
- `02-architecture/compliance-matrix.md` [NEW]
  → Regulatory compliance matrix (GDPR, SOC2, HIPAA, PCI) with per-service mapping
- `02-architecture/adr-template.md` [NEW]
  → Architecture Decision Record template (status, context, decision, consequences)
- `02-architecture/security-progression.md` [NEW]
  → Security maturity progression (MVP → Production → Enterprise) with per-phase gates
- `02-architecture/deployment-safety.md` [NEW]
  → Deployment safety nets (canary, blue-green, feature flags, rollback criteria)
- `02-architecture/tenant-isolation-audit.md` [NEW]
  → Multi-tenant isolation audit checklist (data, compute, config, billing boundaries)
- `02-architecture/framework-compatibility-matrix.md` [NEW]
  → Framework/library version compatibility matrix with upgrade impact analysis

### Category 4: DOCUMENTATION (03-documentation/)
**New files (Code Red audit additions):**
- `03-documentation/spec-layer/catalogs/business-rule-reference.template.md` [NEW]
  → Domain reference tables for external standards (regulatory, business rules agents can't hallucinate)
- `03-documentation/spec-layer/contracts/component-contract.template.md` [NEW]
  → TypeScript interfaces + ASCII diagrams + responsive tables for layout prose

**Modified files:**
- `03-documentation/spec-layer/service-spec-template.md` [CHANGED]
  → Check if project version has the latest 15-section structure.

### Category 5: PHASES (04-phase-planning/)
**New files:**
- `04-phase-planning/pre-task-reading-lists.md` [NEW]
  → Mandatory pre-task reading lists. Without this, agents skip specs they don't know exist.

**Modified files:**
- `04-phase-planning/task-decomposition-rules.md` [CHANGED]

### Category 6: INFRASTRUCTURE (05-dev-infrastructure/, 06-development-workflow/)
Kit changes since v1.0.0: None (stable — but check CLAUDE.md for Rules 24-27).

### Category 7: UI DESIGN (07-ui-design-system/)
Kit changes since v1.0.0: None (stable).

### Category 8: QUALITY/TESTING (08-quality-testing/)
Verify 16 enforcement gates if copied.
**New files (7-tier upgrade — Tier 5, Testing Modernization):**
- `08-quality-testing/testing-pyramid-validator.md` [NEW]
  → Automated test pyramid ratio validation (unit/integration/e2e balance)
- `08-quality-testing/regression-test-protocol.md` [NEW]
  → Regression test protocol with blast-radius analysis and selective re-run
- `08-quality-testing/performance-baseline.md` [NEW]
  → Performance baseline template (response times, memory, CPU per endpoint)
- `08-quality-testing/executable-acceptance-criteria.md` [NEW]
  → Transform AC into executable test scripts with pass/fail assertions
- `08-quality-testing/security-automation.md` [NEW]
  → Security test automation (OWASP ZAP, dependency scanning, secret detection)
- `08-quality-testing/migration-testing.md` [NEW]
  → Database migration testing protocol (up/down, data integrity, rollback)
- `08-quality-testing/test-promotion-guide.md` [NEW]
  → Guide for promoting manual tests to automated tests with priority ranking

### Category 9: OPERATIONS (09-deployment-operations/, 21-incident-response/, 22-cicd-pipeline/)
Kit changes since v1.0.0: None (stable).

### Category 10: GENERATORS (10-generators/)
**New generators:**
- `MECHANICAL-DEPTH-CHECKER.md` [NEW] — 7 mechanical verification checks
- `UI-STATE-MATRIX-GENERATOR.md` [NEW] — Consistent state patterns across all screens

**New files (7-tier upgrade — Tier 2, Generator Fixes):**
- `10-generators/GENERATOR-DAG.md` [NEW]
  → Dependency graph for all generators — prevents running generators with missing inputs
- `10-generators/OUTPUT-OWNERSHIP.md` [NEW]
  → Maps every generated file to its owning generator — prevents double-generation
- `10-generators/REGENERATOR.md` [NEW]
  → Targeted section re-generation for files failing depth audit (max 3 attempts)
- `10-generators/INCREMENTAL-VALIDATION.md` [NEW]
  → Post-generation validation protocol — catch problems before hardening
- `10-generators/DOWNSTREAM-COMPAT-CHECK.md` [NEW]
  → Check downstream impact before regenerating a file that other files reference

**Modified generators:**
- `CROSS-REFERENCE-VALIDATOR.md` [CHANGED] — Now has 12 automated consistency checks
- `DEPTH-REQUIREMENTS.md` [CHANGED] — Updated thresholds and scoring
- `SERVICE-HUB-GENERATOR.md` [CHANGED] — Updated with generator DAG awareness

### Category 11: CAPABILITIES (11-new-capabilities/)
Kit changes since v1.0.0: None (stable).

### Category 12: EXAMPLES (12-examples/)
Reference only — no migration needed.
**New files (7-tier upgrade — Tier 6, Content Quality):**
- `12-examples/bad-service-spec.example.md` [NEW] — Anti-pattern: what a shallow service spec looks like
- `12-examples/bad-screen-spec.example.md` [NEW] — Anti-pattern: what a shallow screen spec looks like
- `12-examples/bad-task-file.example.md` [NEW] — Anti-pattern: what a vague task file looks like

### Category 13: USER DOCUMENTATION (18-user-documentation/)
Kit changes since v1.0.0: None (stable).

### Category 14: MARKETING (19-marketing/, 28-competitive-intelligence/, 36-seo/)
Kit changes since v1.0.0: None (stable).

### Category 15: POST-LAUNCH (20-post-launch/, 37-enhance/, 38-repurpose/)
**New files (7-tier upgrade — Tier 7, Structural + Repurpose):**
- `38-repurpose/R3-market-fit-output.template.md` [NEW]
  → Output template for R3 market fit analysis (repurpose path)
- `38-repurpose/parallel-operation-guide.md` [NEW]
  → Guide for running original + pivot in parallel during transition
- `38-repurpose/worked-examples/` [NEW]
  → Directory with worked pivot examples (reference, not templates)

### Category 16: LESSONS-LEARNED (LESSONS-LEARNED.md)
`LESSONS-LEARNED.md` [CHANGED] — +55 lines with Autonomous Build Readiness.

### Category 17: INTEGRATIONS (32-integrations/)
**New files:**
- `32-integrations/integration-failure-spec.template.md` [NEW]
  → Timeout configs, retry strategies, circuit breakers, fallback behaviors.

### Category 18: MOBILE (14-mobile-platform/)
Check for: framework decision tree, project structure templates, navigation patterns.
**New files (7-tier upgrade — Tier 6, Content Quality):**
- `14-mobile-platform/offline-first-architecture.md` [NEW]
  → Offline-first architecture patterns (sync strategies, conflict resolution, queue management)
- `14-mobile-platform/monorepo-mobile-traps.md` [NEW]
  → Common monorepo + mobile integration traps and how to avoid them
- `14-mobile-platform/mobile-performance-budgets.md` [NEW]
  → Mobile-specific performance budgets (bundle size, startup time, memory, battery)

### Category 19: FINANCIAL MODELING (25-financial-modeling/)
Check for: revenue projections, unit economics, runway calculations.
**New files (7-tier upgrade — Tier 6 + financial enhancement):**
- `25-financial-modeling/scale-transitions.md` [CHANGED]
  → Major expansion: infrastructure transition ladder, team/support transitions, Rule of 3x
- `25-financial-modeling/sensitivity-analysis.md` [NEW]
  → Tornado diagram methodology, three-scenario framework, break-even sensitivity, Monte Carlo

### Category 20: BILLING & PAYMENTS (30-billing-payments/)
Check for: billing architecture, dunning flows, tax compliance.
**New files (7-tier upgrade — Tier 6, Content Quality):**
- `30-billing-payments/pci-compliance-guide.md` [NEW]
  → PCI DSS compliance guide for payment processing (SAQ levels, tokenization, audit prep)
- `30-billing-payments/refund-chargeback-flows.md` [NEW]
  → Refund and chargeback flow documentation (dispute lifecycle, evidence collection, prevention)

### Category 21: VALIDATORS & CI (tools/)
Check for: automated validation scripts and CI templates.
**New files (7-tier upgrade — Tier 1, Enforcement Automation):**
- `tools/validators/gate-checker.sh` [NEW] — Gate checkpoint validation runner
- `tools/validators/validate-depth.sh` [NEW] — Spec depth validation script
- `tools/validators/validate-cross-refs.sh` [NEW] — Cross-reference consistency checker
- `tools/validators/validate-state-files.sh` [NEW] — State file freshness validator
- `tools/validators/validate-feature-gate.sh` [NEW] — Feature gate completion checker
- `tools/validators/validate-refs.sh` [NEW] — File reference validator
- `tools/validators/detect-anti-patterns.sh` [NEW] — Anti-pattern detection script
- `tools/validators/collect-proofs.sh` [NEW] — Proof artifact collection for gates
- `tools/validators/normalize-placeholders.sh` [NEW] — Placeholder normalization
- `tools/validators/gate-definitions.json` [NEW] — Gate definitions for all checkpoints
- `tools/ci/github-actions-gates.yml` [NEW] — GitHub Actions CI template for gates
- `tools/ci/pre-merge-check.yml` [NEW] — Pre-merge validation pipeline
- `tools/ci/coverage-regression.yml` [NEW] — Coverage regression detection

### Category 22: STRUCTURAL (root files)
Check for: path guides, scaling documentation.
**New files (7-tier upgrade — Tier 7, Structural):**
- `PATHS.md` [NEW] — Choose-your-path guide (Express, Lite, Standard, Full, Migration, Library)
- `SCALING-GUIDE.md` [NEW] — Scaling guide for large projects, teams, and codebases

Store delta results in `AUDIT.templates` for Phase 8.

---

## PHASE 8: AUDIT REPORT GENERATION

Generate the comprehensive audit report from all previous phases.

### Executive Health Score

Calculate a score for each area (0-100%):

| Area | Calculation | Weight |
|------|-------------|--------|
| Codebase-Spec Sync | (matched services + matched screens) / (total documented) × 100 | 10% |
| Dev Docs Quality | weighted average of spec scores, state file ratings | 15% |
| Feature Health | (non-stale tasks / total tasks) × 100 | 10% |
| GSD State | VALID=100, DESYNC=60, NOT_INIT=30, CORRUPT=0 | 10% |
| Session Lifecycle | average of 4 compliance rates from Step 6.4 | 20% |
| CLAUDE.md Rules | (present rules / 8) × 100 | 10% |
| Hook Enforcement | (installed hooks / 7) × 100 | 10% |
| Enforcement Gates | (passed gates / applicable gates) × 100 | 5% |
| Template Currency | (SAME count / total categories) × 100 | 10% |

**Overall Health** = weighted average of all areas.

Rating: ≥80% = HEALTHY, 60-79% = NEEDS ATTENTION, 40-59% = NEEDS UPLIFT, <40% = CRITICAL

### Report Structure

```markdown
# Project Audit Report
**Generated:** {date}
**Project:** {name} ({PROJECT_PATH})
**Kit Fingerprint:** {version}
**Audit Scope:** {scope}

---

## Executive Health Score: [N]% — [RATING]

| Area | Score | Rating | Critical Issues |
|------|-------|--------|-----------------|
| Codebase-Spec Sync | [%] | [PASS/WARN/FAIL] | [brief] |
| Dev Docs Quality | [%] | [PASS/WARN/FAIL] | [brief] |
| Feature Health | [%] | [PASS/WARN/FAIL] | [brief] |
| GSD State | [%] | [PASS/WARN/FAIL] | [brief] |
| Session Lifecycle | [%] | [PASS/WARN/FAIL] | [brief] |
| CLAUDE.md Rules | [%] | [PASS/WARN/FAIL] | [brief] |
| Hook Enforcement | [%] | [PASS/WARN/FAIL] | [brief] |
| Enforcement Gates | [%] | [PASS/WARN/FAIL] | [brief] |
| Template Currency | [%] | [PASS/WARN/FAIL] | [brief] |

---

## Detailed Findings

### CRITICAL (fix immediately)
[Findings from all phases rated CRITICAL or FAIL, ordered by impact]

### HIGH (fix before next session)
[Findings rated WARN with high impact]

### MEDIUM (fix at next phase transition)
[Lower-impact WARN findings]

### LOW (informational)
[SAME/minor findings for completeness]

---

## Template Delta Summary
[Condensed output from Phase 7 — NEW/CHANGED/CONFLICT counts with file lists]

---

## Recommended Uplift Actions
[Auto-generated from findings — what to fix and how, ordered by impact × effort]

Run: /kit-upgrade uplift     → Fix everything automatically
Run: /kit-upgrade uplift [area] → Fix one area at a time
```

If `OUTPUT_FORMAT` includes file output, write to `PROJECT_PATH/dev_docs/.kit-upgrades/AUDIT-REPORT-{date}.md`.

Print the Executive Health Score table and Critical/High findings to conversation always.

---

## PHASE 9: UPLIFT PLANNING (uplift mode only)

**Purpose:** Classify every finding into action types and sequence them for safe execution.

### Step 9.1 — Classify Actions

For each finding from the audit, assign:

- **AUTO-FIX** — Can be done mechanically with no content judgment:
  - Install missing hook in .claude/settings.json
  - Add missing CLAUDE.md rule (append standard text)
  - Fix GSD state.json count mismatches
  - Reconcile STATUS.md checkbox counts with phase headers
  - Sync master-tracker task statuses with STATUS.md
  - Populate empty session-context.md boilerplate from STATUS.md
  - Copy NEW templates from kit (Phase 11 adopt)

- **GUIDED-FIX** — Needs content generation, but the skill can produce a specific prompt:
  - Rewrite shallow service spec (generate deficiency list + improvement prompts)
  - Update vague handoff.md (generate specific "Next Action" from STATUS.md state)
  - Fill DEVLOG.md gaps (generate entries from git log for missing dates)
  - Generate missing enforcement gate proofs (generate checklist + instructions)

- **MANUAL-REVIEW** — Needs human decision:
  - Resolve template CONFLICT (keep custom or adopt kit version?)
  - Decide on stale feature (defer, unblock, or remove?)
  - Stack mismatch in .kit-meta.json (update metadata or docs?)
  - Built-but-undocumented code (write spec or remove code?)

### Step 9.2 — Sequence Actions

Execute in this order (each step builds on the previous):
1. **Hook installation** — enables enforcement going forward
2. **CLAUDE.md rules** — sets expectations for current session
3. **GSD state repair** — fixes tracking foundation
4. **State file sync** — reconciles STATUS.md ↔ tracker ↔ handoff
5. **Template adoption** — adds new templates
6. **Depth uplift** — flags and prompts for shallow specs
7. **Feature health actions** — labels stale/blocked features

### Step 9.3 — Generate Uplift Plan

Write to `PROJECT_PATH/dev_docs/.kit-upgrades/UPLIFT-PLAN-{date}.md`:

```markdown
# Uplift Plan — {date}
**Project:** {name}
**Overall Health:** {score}% → Target: {target}%

## AUTO-FIX ({count} actions — will execute now)
1. [action] — [what it fixes]
2. ...

## GUIDED-FIX ({count} actions — will generate, user reviews)
1. [action] — [what it addresses] — [specific deficiency]
2. ...

## MANUAL-REVIEW ({count} items — flagged for user decision)
1. [item] — [options: A / B / C]
2. ...

## Estimated Impact
Before uplift: {current score}%
After AUTO-FIX: ~{projected score}%
After all fixes: ~{best case score}%
```

Print the plan summary to conversation. Ask user to confirm before proceeding to Phase 10.

---

## PHASE 10: UPLIFT EXECUTION (uplift mode only)

Execute the uplift plan from Phase 9. If `uplift [area]` was specified, only execute steps
matching that area.

**Area mapping:**
- `hooks` → Step 10.2 only
- `claude-md` → Step 10.3 only
- `gsd` → Step 10.4 only
- `state-files` → Step 10.5 only
- `templates` → Step 10.6 only
- `depth` → Step 10.7 only
- `features` → Step 10.8 only
- `session` → Steps 10.2 + 10.3 + 10.5 (hooks + rules + state sync — full session lifecycle fix)
- `tasks-only` → Step 10.11 only (generate task files from audit findings, no direct fixes)

### Step 10.1 — Rollback Snapshot

Before ANY writes, create a snapshot of every file that will be modified:

```
dev_docs/.kit-upgrades/{UPGRADE_ID}/before/
  .claude/settings.json          (if hooks will be modified)
  CLAUDE.md                      (if rules will be added)
  .gsd/state.json                (if GSD will be repaired)
  dev_docs/STATUS.md             (if state sync will run)
  dev_docs/handoff.md            (if state sync will run)
  dev_docs/tracker/master-tracker.md (if tracker sync will run)
  dev_docs/tracker/dependency-map.md (if task bridge will run)
  dev_docs/tracker/timeline.md       (if task bridge will run)
  dev_docs/DEVLOG.md                 (if state sync or task bridge will run)
  ... (any other files to be modified)
```

Note: Phase 10.11 (Task Bridge) also CREATES new files in `dev_docs/tasks/kit-upgrade/` and
optionally `.gsd/sprints/`. These are tracked in the UPGRADE-LOG as "Files Created" and will
be DELETED on rollback (not restored from snapshot, since they didn't exist before).

Generate `UPGRADE_ID` in format `YYYY-MM-DD-NNN`.

### Step 10.2 — Hook Uplift

Read `PROJECT_PATH/.claude/settings.json` (create if absent with empty `{"hooks": {}}`).
Read `PROJECT_PATH/.claude/settings.local.json` if it exists (hooks may be there instead).

For each of the 7 required hooks from Step 6.3 that is MISSING:
- Read the hook definition from `KIT_PATH/tools/hooks-snippet.json`
- Merge into the project's settings under the appropriate event key (Stop, PreCompact, PreToolUse)
- Preserve ALL existing hooks — only ADD missing ones

Write the updated settings file.

Announce:
```
HOOKS INSTALLED:
  + post-task-protocol (Stop) — reminds to update state files after work
  + commit-state-check (PreToolUse) — blocks commits without state file updates
  + context-anchor (PreCompact) — injects recovery instructions before compaction
  + plan-change-detector (Stop) — auto-propagates plan changes to trackers
  + session-completion (Stop) — reminds to update handoff before ending session
  Already installed: [list]
```

### Step 10.3 — CLAUDE.md Uplift

Read `PROJECT_PATH/CLAUDE.md`.

For each of the 8 mandatory rule categories from Step 6.2 that is MISSING:
- Generate the rule text based on the kit's CLAUDE.md (adapt to project context):

**Rule templates to append (only the missing ones):**

```markdown
## Session Lifecycle Rules [add this section header if it doesn't exist]

### Session Management
At session start: read dev_docs/handoff.md and dev_docs/STATUS.md before any work.
At session end: run /session-end to update STATUS.md, handoff.md, and DEVLOG.md.
Use /session-kickoff at the start of every session and /session-end before finishing.

### Post-Task Protocol
After completing ANY task: update STATUS.md (toggle checkbox), handoff.md (what was done + what's next),
DEVLOG.md (append timestamped entry), and master-tracker.md (subtask status). This takes 2-4 minutes
and IS part of the task. Never skip it.

### Plan Change Protocol
After ANY plan modification (adding features, tasks, deferrals): update STATUS.md, master-tracker.md,
dependency-map.md, timeline.md, handoff.md, and DEVLOG.md. Run /plan-changed for automatic propagation.

### Session Completion Checklist
Before ending any session: (1) Update STATUS.md, (2) Update handoff.md with specific next actions
including file paths, (3) Append to DEVLOG.md, (4) Sync master tracker, (5) Verify handoff passes
the "2-minute resumption test" — could someone resume in under 2 minutes from reading it?

### Depth Enforcement
Service specs must score ≥7/8 on the mechanical depth checker. Screen specs must score ≥5/6.
Do not proceed past a spec that scores below threshold. See 10-generators/DEPTH-REQUIREMENTS.md.

### Show Me Rule
When claiming tests pass, features work, or quality gates are met — include actual proof artifacts.
"All tests pass" without console output is not acceptable.

### State File Discipline
dev_docs/STATUS.md, dev_docs/handoff.md, and dev_docs/DEVLOG.md are the bridge between sessions.
They are the ONLY things that survive between conversations. Keeping them current is non-negotiable.

### Context Recovery
After any context compaction or new session start: read dev_docs/handoff.md → dev_docs/STATUS.md →
dev_docs/DEVLOG.md (last 3 entries) BEFORE doing any work. Announce what you found. If the user
provides an answer to a previous question, first read handoff.md Blockers section, acknowledge the
question, confirm the answer resolves it, then update handoff.md to remove the blocker.
```

Do NOT overwrite existing CLAUDE.md content. Only APPEND missing rules. Place them in a clear
section that won't conflict with existing rules.

Announce what rules were added.

### Step 10.4 — GSD Uplift

Based on GSD audit findings from Step 6.1:

**If `.gsd/state.json` has count mismatches:**
- Read STATUS.md as source of truth
- Recalculate summary counts from actual task statuses
- Write corrected state.json (with atomic write pattern: .tmp → rename)

**If `.gsd/` does not exist but `dev_docs/tasks/` has task files:**
- Create `.gsd/` directory
- Generate `state.json` by globbing `dev_docs/tasks/` and building task list from file contents
- Set `session_count: 1`, `status: "in_progress"`, populate task entries
- Announce: "GSD initialized from existing task files. Run /gsd to start execution."

**If `.gsd/state.json` is corrupt (invalid JSON):**
- Attempt to rebuild from STATUS.md + task files
- If unable, create fresh state.json and flag previous state as unrecoverable

### Step 10.5 — State File Sync

**STATUS.md reconciliation:**
- Recount checkboxes per phase section
- Fix phase header counts and percentages to match actual checkboxes
- Fix total counts

**master-tracker reconciliation (if file exists):**
- For each task in STATUS.md, verify it appears in master-tracker
- For each task in master-tracker, verify it appears in STATUS.md
- Flag and list discrepancies — fix the tracker to match STATUS.md as ground truth

**handoff.md population:**
- If handoff.md is template-only (score 1/3 from Step 4.4):
  - Read STATUS.md to find the active task and current phase
  - Read DEVLOG.md for the most recent entry
  - Populate handoff.md "Last Completed", "Next Action", and "Blockers" from this data
  - Set "Last Updated" to current timestamp

**session-context.md population:**
- If empty/template-only:
  - Populate project identity from .kit-meta.json or package.json
  - Populate current step/phase from STATUS.md
  - Add session history entry for current session

### Step 10.6 — Template Uplift

For each NEW template identified in Phase 7:
- Delegate to Phase 11 (Adopt Mode) logic
- Use additive mode by default (preserve existing content)

For each CHANGED template:
- Apply additive merge: append missing sections from kit version
- Do NOT replace existing content

### Step 10.7 — Depth Uplift

For each spec that scored FAIL or WARN in Phase 4:

Do NOT auto-rewrite the spec. Instead, generate a specific deficiency report:

```markdown
### [spec-name] — Score: [N]/8 ([FAIL/WARN])

**Missing or below threshold:**
- [ ] Word count: [actual] / 1500 minimum (need [N] more words)
- [ ] Business rules: [actual] / 8 minimum (need [N] more rules)
- [ ] Error scenarios: [actual] / 5 minimum (need [N] more scenarios)
- [ ] Red-flag phrases found: "[phrase]" at line [N]

**Uplift prompt (paste this to rewrite the spec):**
> Rewrite [spec-name] to address these deficiencies: [specific list]. The spec currently
> has [N] words, [N] business rules, and [N] error scenarios. It needs at least [thresholds].
> Focus especially on: [top 2-3 deficiencies]. Preserve all existing content and add to it.
```

Write all depth deficiency reports to `dev_docs/.kit-upgrades/DEPTH-UPLIFT-{date}.md`.

### Step 10.8 — Feature Health Actions

For stale tasks (from Step 5.2):
- Add `[STALE]` label next to the task in STATUS.md
- Add warning in handoff.md: "STALE FEATURES: [list] — no progress in [N] sessions"

For blocked chains (from Step 5.3):
- Add `[BLOCKED CHAIN]` annotation in STATUS.md
- Add blocker summary in handoff.md: "BLOCKED CHAINS: [root cause] → affects [N] downstream tasks"

Generate `dev_docs/.kit-upgrades/FEATURE-HEALTH-DASHBOARD-{date}.md`:
```markdown
# Feature Health Dashboard — {date}

## Phase Summary
[Phase-by-phase completion with stale/blocked annotations]

## At-Risk Features
[Details from Step 5.2]

## Blocked Chains
[Details from Step 5.3]

## Recommended Actions
- Unblock: [task-id] by resolving [blocker]
- Defer: [task-id] if [condition]
- Remove: [task-id] if no longer needed
```

### Step 10.9 — Post-Uplift Verification

Re-run the key audit checks on modified files:
- Recount hook installations (should now be 7/7)
- Recount CLAUDE.md rules (should now be 8/8)
- Recheck GSD state (should now be VALID)
- Recheck STATUS.md/tracker sync (should now be SYNCED)

Generate before/after comparison:
```
UPLIFT RESULTS
──────────────
                    Before    After     Delta
Hooks installed:    3/7       7/7       +4
CLAUDE.md rules:    5/8       8/8       +3
GSD state:          DESYNC    VALID     fixed
STATUS.md:          STALE     CURRENT   updated
Tracker sync:       DESYNC    SYNCED    reconciled
Overall health:     53%       78%       +25%
```

### Step 10.10 — Audit Trail

Write `dev_docs/.kit-upgrades/{UPGRADE_ID}/UPGRADE-LOG.md`:

```markdown
# Upgrade Log — {UPGRADE_ID}

Applied: {ISO timestamp}
Kit version: 1.1.0
Mode: uplift {area or "full"}
Applied by: master-kit-upgrade skill v2

## Actions Taken

### AUTO-FIX
[List every automatic action with file paths]

### GUIDED-FIX
[List generated reports and prompts]

### MANUAL-REVIEW
[List items flagged for user decision]

### TASK BRIDGE (Phase 10.11)
[List generated task files: KIT-001 through KIT-NNN with titles]
[Sprint generated: sprint-kit-{UPGRADE_ID} or "none"]
[Trackers updated: STATUS.md, master-tracker.md, dependency-map.md, timeline.md, handoff.md, DEVLOG.md]

## Files Modified
[Complete list of files changed, with before/after summary]

## Files Created
[Task files in dev_docs/tasks/kit-upgrade/ — these are DELETED on rollback]

## Rollback
To revert this uplift:
  /kit-upgrade rollback {UPGRADE_ID}

Snapshot: dev_docs/.kit-upgrades/{UPGRADE_ID}/before/
```

Update `.kit-meta.json` upgrades array with this uplift record.

### Step 10.11 — Audit-to-Task Bridge (Task File Generation)

**Purpose:** Convert all GUIDED-FIX and MANUAL-REVIEW items from Phase 9 into proper task files
that GSD can execute. This bridges the gap between "findings identified" and "work gets done."
Without this step, audit findings are dead ends — reports that never produce results in the final project.

**Skip condition:** Skip if zero GUIDED-FIX and zero MANUAL-REVIEW items exist after Phase 9
classification. Print: `"No remediation tasks needed — all findings were auto-fixed."` and proceed
to Final Announcement.

**Special behavior in `tasks-only` mode:** When the user selected `uplift tasks-only` or menu option
`4i`, Phase 10.1-10.10 were skipped. In this mode, include AUTO-FIX items as task files too (since
they were not executed directly), with effort: S, type: infrastructure.

#### Step 10.11.1 — Collect Actionable Items

Gather from Phase 9 classification:
- All GUIDED-FIX items (from Step 9.1)
- All MANUAL-REVIEW items (from Step 9.1)
- All depth deficiency items from Step 10.7 (if `DEPTH-UPLIFT-{date}.md` was generated)
- In `tasks-only` mode: also include all AUTO-FIX items

For each item, extract:
- `source_phase`: Which audit phase found it (3, 4, 5, 6, 7)
- `category`: The area (depth, hooks, state-files, features, templates, gsd, session, claude-md)
- `severity`: CRITICAL / HIGH / MEDIUM / LOW (from the audit report Phase 8 tier)
- `action_type`: GUIDED-FIX, MANUAL-REVIEW, or AUTO-FIX (tasks-only mode)
- `description`: The specific finding text
- `target_files`: File paths involved in the fix
- `fix_guidance`: The specific prompt, merge suggestion, or decision options from Phase 9/10.7

#### Step 10.11.2 — Generate Task IDs

Use the prefix `KIT-` to distinguish kit-upgrade remediation tasks from project tasks.

Determine the next available KIT-NNN number:
1. Glob `PROJECT_PATH/dev_docs/tasks/` (all subdirectories) for any existing `KIT-*.md` files
2. Find the highest existing number, or start at `KIT-001` if none exist
3. Assign sequential IDs: `KIT-001`, `KIT-002`, etc.

**Priority mapping from severity:**
- CRITICAL → P0
- HIGH → P1
- MEDIUM → P2
- LOW → P2

**Effort mapping:**
- Depth spec rewrite → L (4-8h, involves thoughtful content work)
- Template merge/conflict resolution → M (1-4h)
- State file manual fix → S (< 1h)
- Feature decision (stale/blocked) → S (< 1h, decision + state update)
- Missing enforcement gate proof → M (1-4h, requires running verification)
- AUTO-FIX item (tasks-only mode) → S (< 1h, mechanical fix)

#### Step 10.11.3 — Write Task Files

Create the directory `PROJECT_PATH/dev_docs/tasks/kit-upgrade/` if it does not exist.

For each actionable item, write a task file to `dev_docs/tasks/kit-upgrade/KIT-NNN.md`:

```markdown
# KIT-NNN: {Title}

**Service:** kit-upgrade
**Type:** {refactor | bugfix | infrastructure}
**Priority:** {P0 | P1 | P2}
**Effort:** {S | M | L | XL}
**Sprint:** unassigned
**Source:** kit-upgrade audit {UPGRADE_ID}, Phase {source_phase}
**Action Type:** {GUIDED-FIX | MANUAL-REVIEW | AUTO-FIX}

## Context (read these before starting)
- `dev_docs/.kit-upgrades/AUDIT-REPORT-{date}.md` — full audit findings
- `dev_docs/.kit-upgrades/UPLIFT-PLAN-{date}.md` — action classification
- {3-6 additional file paths specific to this finding: target files, relevant specs, related templates}

## Description
{What the audit found and why it matters — not generic, specific to this finding}

Source finding: {verbatim finding text from the audit report}

## Requirements
1. {Specific requirement derived from the fix guidance}
2. {Second requirement if applicable}
3. Verify the fix does not regress other audit dimensions

## Acceptance Criteria
- [ ] {Criterion 1 — specific, testable, derived from the finding}
- [ ] {Criterion 2}
- [ ] {Criterion 3 if applicable}
- [ ] Re-run `/kit-upgrade scan` — this area scores higher than before
- [ ] State files updated (STATUS.md, handoff.md, DEVLOG.md)

## Fix Guidance
{For GUIDED-FIX: the specific uplift prompt or step-by-step instructions from Phase 10.7 depth reports or Phase 9}
{For MANUAL-REVIEW: the decision options with pros/cons — e.g., "Option A: keep custom content. Option B: adopt kit version. Option C: hybrid merge."}
{For AUTO-FIX (tasks-only mode): the exact mechanical steps to execute}

## Dependencies
- Depends on: {any KIT-NNN that must complete first, or "none"}

## Notes
- Auto-generated by `/kit-upgrade uplift` on {date} (upgrade {UPGRADE_ID})
- Rollback for parent upgrade: `/kit-upgrade rollback {UPGRADE_ID}`
```

**Task title derivation rules** (titles must be descriptive, not generic):
- Depth deficiency: `"Deepen {spec-name} service spec (score {N}/8, need ≥{threshold})"`
- Template conflict: `"Resolve {template-name} template conflict (kit v1.1.0 vs project custom)"`
- Stale feature decision: `"Decide fate of stale task {TASK-ID} ({N} sessions inactive)"`
- Blocked chain resolution: `"Unblock chain: {root-task-id} blocking {N} downstream tasks"`
- Missing gate proof: `"Generate {gate-name} proof artifact for Step {N}"`
- Built-but-undocumented code: `"Write spec for undocumented {service/screen} or remove code"`
- Stack mismatch: `"Resolve stack mismatch: .kit-meta says {X}, codebase uses {Y}"`
- Hook installation (tasks-only): `"Install missing {hook-name} hook in settings.json"`
- CLAUDE.md rule (tasks-only): `"Add missing {rule-name} rule to CLAUDE.md"`

#### Step 10.11.4 — Dependency Resolution Between Generated Tasks

Apply these dependency rules:
1. Depth tasks for the same service are independent (can run in parallel)
2. Template conflict tasks are independent of each other
3. If a MANUAL-REVIEW item blocks a GUIDED-FIX item (e.g., "decide whether to keep code" must
   come before "write spec for kept code"), set the GUIDED-FIX as depending on the MANUAL-REVIEW
4. All depth tasks should depend on any template adoption tasks that affect the same section
   (adopting a new template may change what the spec needs)
5. In tasks-only mode, AUTO-FIX hook/rule tasks should come before depth/feature tasks
   (enforcement infrastructure enables quality work)

#### Step 10.11.5 — Propagate to Trackers

For each generated task file, replicate the same propagation logic as `/generate-task` Step 6.
**A task file without tracker entries is invisible to the execution pipeline.**

1. **STATUS.md** — Add a `## Kit Upgrade Tasks` section header if it does not already exist.
   Under it, add a checkbox per generated task: `- [ ] KIT-NNN: {title}`.
   Update the total task count in the header.

2. **master-tracker.md** (if exists) — Add 3-5 subtask rows per KIT task:
   - For depth rewrites: "Read current spec and depth checker output", "Identify specific gaps",
     "Expand spec content to address gaps", "Re-score with depth checker (must pass)", "Update cross-references"
   - For template conflicts: "Compare kit vs project versions side-by-side", "Decide merge strategy",
     "Apply merge preserving project customizations", "Verify no regressions"
   - For manual decisions: "Review options and context", "Make and document decision",
     "Execute decision", "Update state files"
   - For AUTO-FIX (tasks-only): "Execute mechanical fix", "Verify fix applied", "Update state files"

3. **dependency-map.md** (if exists) — Add dependency entries for any inter-task dependencies
   from Step 10.11.4.

4. **timeline.md** (if exists) — Assign all KIT tasks to "Next sprint" or the current week.

5. **handoff.md** — Add under "Key Decisions":
   `Kit upgrade generated {N} remediation tasks (KIT-001 through KIT-NNN). Run /gsd to execute.`

6. **DEVLOG.md** — Append:
   `### [TIMESTAMP] PLAN CHANGE: Kit upgrade audit generated {N} remediation tasks (KIT-001 through KIT-NNN) from upgrade {UPGRADE_ID}`

#### Step 10.11.6 — Sprint Generation (conditional)

**If `PROJECT_PATH/.gsd/sprints/` exists** (GSD has been used before), generate a sprint definition:

Write to `PROJECT_PATH/.gsd/sprints/sprint-kit-{UPGRADE_ID}.json`:

```json
{
  "sprint_id": "sprint-kit-{UPGRADE_ID}",
  "name": "Kit Upgrade Remediation — {UPGRADE_ID}",
  "tasks": ["KIT-001", "KIT-002", "...ordered list..."],
  "anchor_tasks": ["KIT-001"],
  "protocol_update_interval": 3,
  "protocol_files": [
    "dev_docs/STATUS.md",
    "dev_docs/handoff.md",
    "dev_docs/DEVLOG.md"
  ],
  "verification_commands": null,
  "created_at": "{ISO timestamp}",
  "created_by": "kit-upgrade"
}
```

Task ordering within the sprint: P0 first, then P1, then P2. Within same priority, MANUAL-REVIEW
before GUIDED-FIX (decisions unlock work). Within same type, respect dependency order.

**If `.gsd/sprints/` does not exist**, skip sprint generation — GSD's auto-generation algorithm
will handle it when the user runs `/gsd`.

#### Step 10.11.7 — Summary Output

Print:

```
TASK BRIDGE
───────────
Generated {N} task files from audit findings:

  GUIDED-FIX tasks ({N}):
    KIT-001: {title} [P{n}, {effort}]
    KIT-002: {title} [P{n}, {effort}]
    ...

  MANUAL-REVIEW tasks ({N}):
    KIT-003: {title} [P{n}, {effort}]
    ...

  {If tasks-only mode:}
  AUTO-FIX tasks ({N}):
    KIT-00N: {title} [P{n}, S]
    ...

  Sprint: {sprint-kit-UPGRADE_ID created | "no sprint dir — /gsd will auto-generate on first run"}

  Files written:
    dev_docs/tasks/kit-upgrade/KIT-001.md
    dev_docs/tasks/kit-upgrade/KIT-002.md
    ...
    .gsd/sprints/sprint-kit-{UPGRADE_ID}.json (if applicable)

  Trackers updated: STATUS.md, master-tracker.md, dependency-map.md, timeline.md, handoff.md, DEVLOG.md
```

### Final Announcement

```
Uplift complete.

Upgrade ID: {UPGRADE_ID}
Actions executed: {AUTO-FIX count} automatic, {GUIDED-FIX count} guided, {MANUAL-REVIEW count} flagged
Remediation tasks generated: {task count} (KIT-001 through KIT-NNN)
Health score: {before}% → {after}% (+{delta}%)

Files written:
  - dev_docs/.kit-upgrades/AUDIT-REPORT-{date}.md
  - dev_docs/.kit-upgrades/UPLIFT-PLAN-{date}.md
  - dev_docs/.kit-upgrades/DEPTH-UPLIFT-{date}.md (if depth issues found)
  - dev_docs/.kit-upgrades/FEATURE-HEALTH-DASHBOARD-{date}.md (if health issues found)
  - dev_docs/.kit-upgrades/{UPGRADE_ID}/UPGRADE-LOG.md
  - dev_docs/tasks/kit-upgrade/KIT-001.md through KIT-NNN.md

Next steps:
  1. Run /gsd to execute the {N} generated remediation tasks
  2. Quick start: /gsd sprint-kit-{UPGRADE_ID}
  3. Or review individual tasks in dev_docs/tasks/kit-upgrade/
  4. Run /kit-upgrade scan after completing tasks to verify improvement

Rollback: /kit-upgrade rollback {UPGRADE_ID}
```

---

## PHASE 11: ADOPT MODE

### Mode entry
This phase runs when the argument is "adopt [sections|all-missing|all-outdated]".

### Step 11.0 — Resolve path and run Phase 2 version detection
Use cwd as PROJECT_PATH unless the user passed `--path [path]`.
Run Phase 2 to load META (or build inferred META).

### Step 11.1 — Resolve section list
- "all-missing" → run Phase 7 comparison, expand to all MISSING sections
- "all-outdated" → run Phase 7 comparison, expand to all OUTDATED sections
- Otherwise → parse space-separated section names directly

Check for `--force` in the argument string. If present: `FORCE = true`.

### Step 11.2 — For each section, execute adoption

**Conflict gate:**
- CONFLICT + `FORCE = false`: additive-only (append missing H2 headings; preserve existing content)
- CONFLICT + `FORCE = true`: full template replacement with conflict card printed
- MISSING: create from current kit template

**Rollback snapshot (before any write):**
- If file EXISTS: copy to `dev_docs/.kit-upgrades/[UPGRADE_ID]/before/[relative-path]`
- If NEW: note in log as "created — no pre-existing content"

**Generate upgrade ID:** `YYYY-MM-DD-NNN` (next sequential for today).

**Apply template:**
- Read current kit template from Kit Home
- Fill `{{PLACEHOLDER}}` tokens from META.placeholders where key matches
- Leave remaining `{{PLACEHOLDER}}` tokens unfilled
- Write to appropriate dev_docs/ path(s)

**Write audit entry — `dev_docs/.kit-upgrades/[UPGRADE_ID]/UPGRADE-LOG.md`:**

```markdown
# Upgrade Log — [UPGRADE_ID]

Applied: [ISO timestamp]
Kit version: 1.1.0
Applied by: master-kit-upgrade skill

## Sections Upgraded

### [section-name]
Template: Master-Starter-Kit/[section]/[template-file]
Output: dev_docs/[path]
Mode: [additive | full-replacement | create]
Force flag: [yes | no]
Files created: [list or "none"]
Files modified: [list or "none"]
Placeholders filled: [list]
Placeholders remaining: [list of unfilled {{...}} tokens]

## Rollback
  /kit-upgrade rollback [UPGRADE_ID]
Snapshot: dev_docs/.kit-upgrades/[UPGRADE_ID]/before/
```

**Update .kit-meta.json:**
```json
{
  "id": "[UPGRADE_ID]",
  "applied_at": "[ISO timestamp]",
  "sections": ["[section-name]"],
  "kit_version_at_time": "1.1.0",
  "mode": "additive | full-replacement | create",
  "force": false,
  "status": "applied"
}
```

**Per-section announcement + final summary** (same format as before).

### Step 11.3 — Post-Adopt Hook/Rule Check

After adopting templates, check if the adopted template introduces new requirements:
- Does the template reference hooks that aren't installed? → Suggest: `/kit-upgrade uplift hooks`
- Does the template reference CLAUDE.md rules that are missing? → Suggest: `/kit-upgrade uplift claude-md`

---

## PHASE 12: ROLLBACK MODE

### Step 12.1 — Verify snapshot exists

Check: `PROJECT_PATH/dev_docs/.kit-upgrades/[UPGRADE_ID]/before/`
Read: `PROJECT_PATH/dev_docs/.kit-upgrades/[UPGRADE_ID]/UPGRADE-LOG.md`

If not found, list available upgrades from .kit-meta.json and stop.

### Step 12.2 — Parse UPGRADE-LOG.md manifest
Extract: "Files created" → DELETE on rollback. "Files modified" → RESTORE from snapshot.

### Step 12.3 — Restore
For each "Files created": delete from project.
For each "Files modified": copy from snapshot back to original location.

### Step 12.4 — Update .kit-meta.json
Find upgrade record by `id`. Set `status = "rolled-back"`. Add `rolled_back_at`.

### Step 12.5 — Announce
```
Rollback complete — [UPGRADE_ID]

Sections reverted: [list]
Files deleted (created by upgrade): [count]
Files restored (modified by upgrade): [count]
.kit-meta.json updated: upgrade marked "rolled-back".

Run /kit-upgrade to confirm restored state.
```

---

## .kit-meta.json Schema

Lives at `PROJECT_PATH/dev_docs/.kit-meta.json`. Created on first scan if absent.

```json
{
  "kit_version": "1.1.0",
  "inferred": false,
  "planned_date": "2026-03-20",
  "path": "Standard",
  "steps_completed": ["0", "1", "1.5", "2", "3", "4", "5"],
  "stack": {
    "frontend": "Next.js",
    "backend": "NestJS",
    "database": "PostgreSQL",
    "mobile": false
  },
  "placeholders": {
    "PROJECT_NAME": "MyApp",
    "PKG_MANAGER": "pnpm",
    "FRONTEND_FRAMEWORK": "Next.js"
  },
  "last_upgrade_scan": "2026-03-20T10:00:00Z",
  "upgrades": []
}
```

---

## OUTPUT RULES

Before finalizing any audit report or uplift output, verify these quality gates:

1. **Every finding has a specific score or measurement** — not "docs could be better" but "3 specs below 7/8 threshold"
2. **Every CRITICAL finding has a concrete fix action** — not "improve hooks" but "install post-task-protocol hook in .claude/settings.json"
3. **Every uplift action specifies the exact file and change** — copyable paths, not vague references
4. **Compliance rates use actual counts** — "8/15 sessions (53%)" not "about half"
5. **Depth scores list specific deficiencies** — "word count: 890/1500, business rules: 3/8" not "below threshold"
6. **Template deltas list specific changes** — "Section 4 added business rule table format" not "updated"
7. **Every CONFLICT has a merge suggestion** — don't leave the user hanging
8. **Priority tiers are mutually exclusive** — no finding appears in two tiers
9. **Always list unfilled {{PLACEHOLDER}} tokens** after every adopt
10. **Rollback is always available** — every uplift output includes the rollback command
11. **Before/after scores are shown** for every uplift execution
12. **Health score calculations are transparent** — show the formula, not just the result
13. **Every GUIDED-FIX and MANUAL-REVIEW generates a task file** — findings without task files are dead ends that never produce results in the final project. Phase 10.11 is non-negotiable.
