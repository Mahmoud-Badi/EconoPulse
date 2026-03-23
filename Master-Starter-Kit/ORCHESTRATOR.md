# Project Orchestrator — Autopilot Setup Engine

> **How to use:** Tell Claude Code: "Read ORCHESTRATOR.md and set up this project"
> Claude will run through all 90+ steps across 7 phases (setup & intake, research, architecture & design, core planning, quality & infrastructure, operations & marketing, hardening), pausing only at gate checkpoints for your approval. Step 1.5 enforces live version verification — AI never guesses versions from training data. Stakeholder communications are generated at every major gate checkpoint.
> **Origin:** Merged from Delta TMS V3 and Ultra TMS starter kits. Read LESSONS-LEARNED.md first.

> **New here?** Read [QUICK-START.md](QUICK-START.md) first. Pick your path in [PATHS.md](PATHS.md). Look up any unfamiliar terms in [GLOSSARY.md](GLOSSARY.md).

---

## The Big Picture

```
 YOU DESCRIBE          CLAUDE RESEARCHES        CLAUDE DESIGNS          CLAUDE PLANS           YOU BUILD
 YOUR IDEA             YOUR MARKET              YOUR SYSTEM             YOUR WORK              YOUR PRODUCT

 ┌──────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────┐   ┌─────────────┐   ┌─────────────┐   ┌───────────┐
 │  SETUP   │──▶│ MATURITY │──▶│  INTAKE      │──▶│  SPECS &     │──▶│  TASKS &    │──▶│  HARDENING  │──▶│  START    │
 │          │   │ DETECT   │   │              │   │  ARCHITECTURE│   │  DASHBOARD  │   │             │   │  CODING   │
 │ Step 0   │   │ Step 0.5 │   │ Steps 1-3    │   │  Steps 4-7   │   │  Steps 8-28 │   │ Steps 29-33 │   │           │
 │ ~30 min  │   │ ~5 min   │   │ ~3-6 hrs     │   │  ~3-6 hrs    │   │  ~6-12 hrs  │   │  ~3-5 hrs   │   │  You're   │
 │          │   │ auto-    │   │ (or Enhance  │   │              │   │             │   │  17 rounds  │   │  ready!   │
 │          │   │ routes   │   │  Intake 1-E) │   │              │   │             │   │             │   │           │
 └──────────┘   └──────────┘   └──────────────┘   └──────────────┘   └─────────────┘   └─────────────┘   └───────────┘
      ▲              ▲                ▲                   ▲                  ▲                  ▲
   GATE 0         GATE 0.5       GATE 1,1.5,3          GATE 5           GATE 9,11,16       GATE 29-33
   (verify)       (approve        (you approve)       (you approve)    (you approve)      (you approve)
                   path)
```

**What each phase produces:**

| Phase | You do | Claude does | Output |
|-------|--------|-------------|--------|
| **Setup** (Steps 0-0.5) | Verify plugins work; approve recommended path | Installs ecosystem (Step 0), scans project maturity and auto-routes to correct path (Step 0.5) | Plugin config, maturity assessment, path selection |
| **Intake** (Steps 1-2) | Answer questions about your idea; review expansion brainstorm | Detects your tech stack, verifies versions live (Step 1.5), brainstorms beyond your initial idea (Step 1.9), sets up tools | Project brief, feature list, expansion backlog, CLAUDE.md |
| **Research** (Step 3) | Review the verdict | Debates competitors, personas, feasibility | 60-100 research files |
| **Design** (Steps 4-7) | Approve service & screen specs | Designs architecture, APIs, screens | Service specs, screen specs, API contracts |
| **Plan** (Steps 8-16) | Approve sprint plan | Generates tasks, sets up infrastructure | Task files, STATUS.md, design tokens, tests |
| **Quality** (Steps 16.1-16.5) | Review baselines | Anti-patterns, security, performance, memory | Quality gates, security findings, SLOs |
| **Extend** (Steps 17-28.8) | Pick what applies | Marketing, legal, financial, BI, SEO, operations | Marketing plan, legal docs, financial models, BI dashboards, SEO strategy |
| **Harden** (Steps 29-33) | Review summaries | Audits, enhances, deepens, expands all docs | Hardening reports, expansion plan |

---

## Autopilot Principles

### Pace Control Rules

1. **Never batch-generate.** Generate one service spec at a time, one screen spec at a time, one task file at a time. Present each to the user before generating the next (in manual/semi-auto mode).
2. **Think before you write.** Before any generation step, complete the Think-Then-Generate protocol in the conversation. If you cannot articulate WHY a business rule exists, you don't understand it well enough to write it.
3. **Reference real entities.** Every example in a spec must use real project entities from intake/tribunal. Never write "Entity A," "the resource," or "the user clicks submit." Write "the dispatcher clicks 'Assign Carrier' on the Load Detail screen."
4. **Imagine the real user.** Before writing any spec or task, simulate the actual user's daily workflow. What do they do at 9 AM? What annoys them? What makes them say "this app gets it"?
5. **Creative expansion mandate.** The user's initial idea is a starting point, not a ceiling. Before finalizing any scope, ask: what would make this category-defining? What adjacent features are strongly implied? What would users love that they didn't think to ask for? Never stop at what was described — always present what *could* be. Expansion ideas that don't fit MVP go into the Expansion Backlog. The goal is to build the richest possible picture of potential, then let feasibility decide what ships.
6. **Depth over speed.** A spec done right the first time saves 3 rounds of revision. Spend 5 minutes reasoning to save 30 minutes fixing. Never optimize for completion speed.
7. **No minimum-hitting.** Meeting the minimum threshold is not the goal — it's the floor below which work is rejected. Aim well above every minimum. A service spec at exactly 1500 words is a red flag, not a pass.
8. **Show Me rule.** When claiming tests pass, features work, or quality gates are met — include the actual proof. Not "all tests pass" but the literal console output, screenshot, or report. If you can't show it, it didn't happen. See `08-quality-testing/enforcement/README.md` for the full enforcement system.
9. **Depth enforcement for Steps 13-28.** Do NOT batch Steps 13-28 into fewer than 6 agent calls. Each call may cover at most 3 adjacent steps. Each step must produce files meeting the depth requirements in `10-generators/DEPTH-REQUIREMENTS.md` Section "Steps 13-28 Depth Requirements." If a step produces fewer files than the minimum or any file has fewer words than the minimum, re-generate before proceeding.
10. **No empty directories.** If a directory is created during setup, a subsequent step MUST populate it with at least one substantive file. An empty directory at completion is a kit failure. Step 16.7 enforces this at the end of the quality phase.
11. **Enforcement gates are mandatory.** Every verification gate defined in `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` must pass before its associated step can be marked complete. Missing proof artifacts = step INCOMPLETE. The 16 gates cover: AI context integrity, design consistency, responsive verification, shell detection, dead UI prevention, workflow completeness, screen user-completeness, user journey verification, DR verification, infrastructure sizing, persona-screen completeness, cross-document consistency, phantom table check, dead UI sweep, regulatory completeness, and client log consistency. See the ENFORCEMENT-GATES.md file for trigger points, proof artifacts, and pass criteria.
12. **Post-Task Protocol is non-negotiable.** After completing ANY task or subtask, you MUST update: STATUS.md (toggle checkbox), handoff.md (what was done + what's next), DEVLOG.md (append work entry), master-tracker.md (subtask status), and CLIENT-LOG (client-facing entry with developer attribution). This takes 2-4 minutes and IS part of the task — not optional overhead. The `post-task-protocol` hook will remind you if you forget, and the `commit-state-check` hook will block commits if state files are stale. See `03-documentation/state-files/POST-TASK-PROTOCOL.md` for the full protocol. Use `/project:update-state {task_id} {outcome}` for a quick one-command update.
13. **Invoke skills and plugins proactively.** Do not wait for the user to tell you to use available tools. At every step, check if a plugin, skill, command, or MCP server would produce better output. Key invocations: `/brainstorming` before creative work, `/frontend-design` before UI, `context7` for library docs, `playwright` for screenshot verification, `/code-review` before commits, `quality-gate` skill at feature completion, `tribunal-runner` skill for architecture decisions. See the Skill Invocation Guide below for per-step recommendations.
14. **Plan Change Protocol is non-negotiable.** After ANY plan modification (adding features, phases, tasks; deferring or removing scope; changing sprint assignments), you MUST update: STATUS.md (add/remove tasks, update phase counts), master-tracker.md (add/remove subtask rows), dependency-map.md (update dependency edges), timeline.md (assign to weeks), handoff.md (note plan change), and DEVLOG.md (append plan change entry). This takes 5-8 minutes and IS part of the plan change. The `plan-change-detector` hook will auto-propagate these updates if you forget, and `/plan-changed` can be invoked manually. See `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`.
15. **Multi-agent orchestration.** When a step benefits from parallel agents (independent research, parallel spec generation, simultaneous review), consult `11-new-capabilities/parallel-subagent-orchestration.md` for 10 production-proven patterns: orchestrator-worker, short-lived agents, evaluator-optimizer loops, shared knowledge graph (MCD), progressive skill disclosure, worker heartbeat, and isolated spawning via PAL. Only parallelize genuinely independent tasks — shared state (same file, same DB table, same spec) requires sequential execution.

### Think-Then-Generate Protocol (TTG)

Before generating ANY service spec, screen spec, or task file, you MUST complete the relevant TTG reasoning block in the conversation. This is not optional. Do not generate until reasoning is done.

The user must be able to see your reasoning and correct it before you write the spec.

**TTG for Service Specs (8 questions — answer all before writing):**
1. WHO uses this service? List every user role and what they specifically need from it.
2. WHAT does a user do with this service on a typical day? Walk through morning to evening.
3. WHY does this service exist? What would break if it merged into another service?
4. WHAT are the 5 things a user would be frustrated about if missing on day 1?
5. WHAT would a competitor's best version of this service include? What's table stakes?
6. WHAT are the 5 most likely things to go wrong in production? (race conditions, bad data, concurrent edits, timezone issues, permission edge cases)
7. WHAT data flows IN and OUT? What other services depend on this one, and how?
8. WHAT would make this service genuinely ambitious? Not just what it does, but what it could become? What feature, if added, would make a user tweet about it? What's the obvious extension that no one asked for but everyone would want?

**TTG for Screen Specs (6 questions — answer all before writing):**
1. A user lands here for the FIRST time — what should their eye go to? What's the primary action?
2. A user visits this screen for the 100TH time — what makes it efficient? What shortcuts do power users need?
3. List EVERY possible state: loading, error, empty, filtered-empty, searching, editing, confirming-delete, bulk-selecting, offline, session-expired, permission-denied, data-stale, saving, loading-more...
4. What would make a user say "this is annoying" about this screen? Too many clicks? No bulk actions? Lost scroll position? Slow search? No keyboard shortcuts? No undo?
5. What does this screen look like on mobile? What's hidden, stacked, or simplified?
6. What accessibility needs does this screen have? Keyboard navigation, screen reader landmarks, focus management on modals/drawers?

**TTG for Task Files (5 questions — answer all before writing):**
1. What is the EXACT user-visible outcome of this task? Not "implement feature X" — what does the user see/do differently?
2. What files need to be created or modified? List specific paths.
3. What existing code/patterns should this follow? Reference specific files.
4. What are the 5 acceptance criteria a QA engineer would check?
5. What could go wrong during implementation? What edge cases need tests?

**In auto gate mode:** Abbreviate TTG to questions 1, 4, 5, and 8 for services; 1, 3, and 4 for screens; 1, 4, and 5 for tasks. Still mandatory — just shorter.

### Session Architecture

This process is designed for multi-session execution. Each phase can (and should) run in a separate Claude Code conversation. Session Boundaries (SB) mark safe stopping points where all critical context is persisted to files.

**6 Session Boundaries:**

| SB# | After Step | Name | What Gets Persisted |
|-----|-----------|------|---------------------|
| SB-1 | Step 2 | Post-Intake | CONFIG, features list, domain rules, personas, competitors, all intake answers |
| SB-2 | Step 5 | Post-Architecture | Service specs, architecture decisions, tribunal summary, feature-to-service map |
| SB-3 | Step 8.6 | Post-Planning | Screen specs, task counts, phase plan, sprint plan, completeness matrices, unified catalogs, consistency audit |
| SB-4 | Step 16.5 | Post-Quality | Quality baselines, completeness dashboard, handoff doc, protection list |
| SB-5 | Step 18.8 | Post-Operations | Operational docs summary, marketing decision |
| SB-6 | Step 28.8 | Post-Marketing | Marketing config, channel strategy, launch plan, BI config, SEO maturity tier |

**At every Session Boundary, Claude MUST:**
1. Update `dev_docs/session-context.md` (the Session Context Manifest)
2. Update STATE BLOCK in ORCHESTRATOR.md
3. Update `dev_docs/handoff.md` with the exact next action
4. Announce: "Session boundary reached. You can safely start a new conversation to continue."

**Session Context Manifest** (`dev_docs/session-context.md`):
This is NOT a status file (that's `STATUS.md`). It is a **decision memory file** that carries forward the REASONING behind decisions, not just the outputs. It captures the user's own words, architectural rationale, rejected alternatives, and quality expectations. See template at `03-documentation/state-files/session-context.template.md`.

### Skill Invocation Guide

At each ORCHESTRATOR step, Claude Code should proactively invoke the most relevant skills and plugins. Do not wait for the user to ask — if a skill improves output quality, invoke it.

| Step Range | Skills & Plugins to Invoke | Why |
|-----------|---------------------------|-----|
| Step 0 | Verify all plugins installed (`/health-check`) | Ensure toolchain is ready |
| Step 1.5 | Context7 MCP for version lookups | Live version verification (never guess from training data) |
| Step 3 | Firecrawl for competitor research, Gemini for deep research | Tribunal needs real market data |
| Step 3.6 | Sequential Thinking MCP for spike risk analysis | Multi-perspective reasoning on unknowns |
| Steps 5-6 | `/brainstorming` (superpowers) before each service/screen spec | Expand beyond obvious features before writing |
| Steps 5-6 | `tribunal-runner` skill for architecture decisions | 5-round adversarial debate catches blind spots |
| Step 8 | `/generate-task` command for task generation | Consistent task format and depth |
| Step 9 | `/generate-sprint` command for sprint planning | 5-layer sprint breakdown |
| Step 10 | `/generate-hub` command for service hub files | 15-section hub structure |
| Step 12.9 | `/review:init`, `/review:thumbs` for design review setup | Structured design feedback before tokens |
| Step 12.9 | `/review:export`, `/review:report` for AI analysis | Design direction from real user feedback |
| Step 13 | `/frontend-design` for design system components | Production-grade design, not AI slop |
| Step 13 | Superdesign MCP for brand assets (if needed) | Logo, icon generation |
| Steps 14-15 | Security Guidance plugin for security hardening | Vulnerability detection |
| Step 16 | `/verify-hub` for all service hubs | Verify hub accuracy before handoff |
| Development | `/feature-dev` for every substantial feature | 7-phase guided feature workflow |
| Development | `/code-review` before every commit | Catch issues before they ship |
| Development | Playwright MCP for UI screenshot verification | Visual proof that UI matches spec |
| Development | `quality-gate` skill at feature completion | 6-dimension scoring (min 6.0/10) |
| Development | `anti-pattern-check` skill before commits | Catch anti-patterns early |
| PR/Merge | `/commit-push-pr` for guided PR creation | Consistent PR format |
| PR/Merge | `/review-pr` for multi-agent PR analysis | Thorough code review |
| Maintenance | `/revise-claude-md` after convention changes | Keep project instructions current |
| Maintenance | `/audit-module` for per-service health checks | Ongoing quality monitoring |

**Rule:** If you're about to generate a spec, task, or UI component and haven't invoked the relevant brainstorming/design/research skill first — STOP and invoke it. The 5 minutes spent brainstorming saves 30 minutes of revision.

### Context Recovery Protocol (All Steps)

When resuming at ANY step (new conversation, context compaction, crash), follow this sequence BEFORE doing any work:

1. Read STATE BLOCK (this file) — check `CURRENT_STEP`, `COMPLETED`, `IN_PROGRESS`, `CONFIG`
2. Read `dev_docs/session-context.md` — the decision memory file
3. Read `dev_docs/handoff.md` — what was done last session and the exact next action
4. Read the step-specific files from the table below

**Step-specific recovery files:**

| Current Step | Additional Files to Read |
|-------------|--------------------------|
| 0-2 | None additional (intake builds CONFIG from scratch) |
| 3 | `dev_docs/PROJECT-BRIEF.md`, `dev_docs/FEATURES-LIST.md`, `dev_docs/DOMAIN-RULES.md` |
| 4-5 | Tribunal executive summary, features list, domain rules, personas |
| 5.5-6.5 | All service specs (at minimum: overview + entities sections), `dev_docs/completeness/service-matrix.md` |
| 7-8.5 | `dev_docs/specs/screen-catalog.md`, service matrix, phase coverage |
| 9-16.5 | `dev_docs/STATUS.md`, completeness dashboard, all hub files in `dev_docs/services/` |
| 17-18.8 | `dev_docs/HANDOFF.md`, all capability summaries |
| 19-28.5 | `MARKETING_CONFIG` from STATE BLOCK, marketing strategy summary |
| 29-33 | See "Context Recovery Protocol" in the Hardening section below |

**Announce on resume:**
> "Resuming from Step {N}. I've read the session context and handoff files.
> Last session completed: {steps}. Next action: {exact action from handoff}."

---

## STATE BLOCK (Resume Point)
<!-- Claude updates this block after each completed step. On context reset, resume from here. -->
```
CURRENT_STEP: 0
COMPLETED: []
PROJECT_NAME: ""
PROJECT_SLUG: ""
STACK_DETECTED: ""
GATE_MODE: "manual"  # Valid: "manual", "semi-auto", "auto", "autopilot"
IN_PROGRESS: {}
MATURITY: { score: 0, classification: "", flags: {}, recommended_path: "", user_approved_path: "" }
CONFIG: {}
MARKETING_CONFIG: {}
```

### Gate Mode Configuration

The `GATE_MODE` controls how gate checkpoints behave. Set during Step 1 intake or change anytime.

| Mode | Behavior | Best For |
|------|----------|----------|
| `manual` | All 27 gates pause for user approval | First-time users, complex projects |
| `semi-auto` | Only 6 structural gates pause (Steps 1, 3, 5, 8, 16, 33). Informational gates auto-pass with a logged summary. | Experienced users who trust the process |
| `auto` | All gates auto-pass. Full completeness dashboard shown at end. | Re-runs, rapid prototyping, overnight execution |
| `autopilot` | Same as `auto` + clean exit at session boundaries + `.kit/state.json` tracking + `KIT_SESSION_BOUNDARY`/`KIT_COMPLETE` exit signals for `kit-autopilot.sh` | Overnight kit runs via `/kit-autopilot` |

**Structural gates** (always pause in `semi-auto`):
- Step 1 GATE — Intake confirmation (project understanding)
- Step 3 GATE — Tribunal verdict (feature priorities)
- Step 5 GATE — Service specs approved (architecture)
- Step 8 GATE — Task coverage approved (sprint plan)
- Step 16 GATE — Pre-handoff verification (quality)
- Step 33 GATE — Expansion plan approved (ready to code)

**At every gate, regardless of mode:**
1. Log the gate result to `dev_docs/.orchestrator-state.json` (if it exists)
2. Update `IN_PROGRESS` in STATE BLOCK
3. In `auto` mode, append a summary line to `dev_docs/completeness/gate-log.md`

### Sub-Step Recovery (IN_PROGRESS)

The `IN_PROGRESS` field tracks partial completion within a step. Format:
```text
IN_PROGRESS: { step: "5", substep: "service-specs", done: ["auth","billing"], remaining: ["inventory","reporting"] }
```

On context reset:
1. Check `IN_PROGRESS` first — if populated, resume mid-step
2. If empty, resume at `CURRENT_STEP`
3. Never re-generate items listed in `done` — skip to `remaining`

---

## Step 0: Ecosystem Setup

**Goal:** Install all Claude Code plugins, MCP servers, commands, skills, and settings before any project work begins.

**Instructions:**

1. Read `LESSONS-LEARNED.md` — internalize all hard-won lessons before starting
2. Read `05-dev-infrastructure/claude-code-setup/SETUP-GUIDE.md` and follow it end-to-end
3. Install all plugins listed in `05-dev-infrastructure/claude-code-setup/plugin-workflow-table.md`
4. Configure MCP servers per `05-dev-infrastructure/claude-code-setup/mcp-servers-guide.md`
5. Copy `05-dev-infrastructure/commands/*.md.template` → `.claude/commands/*.md` (resolve placeholders later in Step 2)
6. Copy `05-dev-infrastructure/skills/` → user's `.claude/skills/`
7. Create `.claude/settings.json` from `05-dev-infrastructure/settings/settings.json.template`
8. Create `.claude/settings.local.json` from `05-dev-infrastructure/settings/settings.local.json.template`
9. Initialize memory directory at user's `.claude/projects/` path
10. Install enforcement hooks from `05-dev-infrastructure/hooks/`: `session-completion-hook.template.sh` and `commit-state-check` hook. These are MANDATORY on every project — they prevent state file decay.

**GATE: Ask user to verify plugins and MCP servers work before proceeding.**

Update STATE BLOCK: `CURRENT_STEP: 0.5`, add "0-ecosystem" to COMPLETED.

---

## Step 0.5: Project Maturity Detection

**Goal:** Determine the project's maturity level and automatically route to the correct kit path. This prevents greenfield planning on existing codebases and ensures every project gets the right treatment.

**Instructions:**

1. Run the **Project Maturity Detector** protocol from `00-discovery/PROJECT-MATURITY-DETECTOR.md`
   - Scan all signal groups (Codebase, Documentation, Activity)
   - Calculate the maturity score (0-100)
   - Classify the project (GREENFIELD, EARLY_BUILD, MID_BUILD, MATURE, MATURE_KIT)
   - Set boolean flags (HAS_KIT_ARTIFACTS, HAS_EXISTING_TESTS, etc.)

2. Present the structured assessment to the user (see format in PROJECT-MATURITY-DETECTOR.md)

3. Store the result in STATE BLOCK:
   ```
   MATURITY: {
     score: [N],
     classification: "[class]",
     flags: {
       HAS_KIT_ARTIFACTS: [bool],
       HAS_EXISTING_TESTS: [bool],
       HAS_EXISTING_SPECS: [bool],
       HAS_TASK_TRACKING: [bool],
       IS_ACTIVE_DEV: [bool],
       NEEDS_ENHANCE_NOT_GREENFIELD: [bool]
     },
     recommended_path: "[path]",
     user_approved_path: "[path]"
   }
   ```

**GATE: User approves the recommended path or overrides it.**

If the user overrides to a conflicting path (e.g., choosing greenfield Standard path for a MATURE project), display the warning from PROJECT-MATURITY-DETECTOR.md and require explicit confirmation.

4. **Route based on approved path:**

   | Approved Path | Next Step | What Happens |
   |---------------|-----------|-------------|
   | Standard ORCHESTRATOR | Step 1 (standard intake) | Normal greenfield flow |
   | ORCHESTRATOR + Step 7 mandatory | Step 1 (standard intake) | Greenfield flow but codebase audit is required |
   | Enhance Path | Step 1-E (`37-enhance/ENHANCE-INTAKE.md`) | Existing app flow: auto-scan intake → E1-E4 audit → Steps 5-16 with overlay |
   | `/kit-upgrade` | Exit ORCHESTRATOR, invoke kit-upgrade | Kit-built project gets quality uplift |
   | Resume | Read `dev_docs/session-context.md` | Continue from where the last session left off |

Update STATE BLOCK: `CURRENT_STEP: 1`, add "0.5-maturity" to COMPLETED.

---

## Step 1: Discovery & Intake

**Goal:** Understand the project through context scanning + structured conversation + auto-detection. Read everything that exists before asking anything.

**Instructions:**

1. **Scan for existing context FIRST** (before asking a single question):

   Glob and read the following in order. Do not skip any that exist.

   **Existing docs and briefs:**
   - `README.md`, `README.mdx`, `readme.md`
   - `BRIEF.md`, `brief.md`, `PROJECT-BRIEF.md`, `project-brief.md`
   - `SPEC.md`, `spec.md`, `SPECS.md`
   - `OVERVIEW.md`, `PRODUCT.md`, `VISION.md`
   - Any `.md` file at the repo root that looks like documentation

   **Existing dev_docs (prior kit output):**
   - `dev_docs/specs/project-overview.md`
   - `dev_docs/specs/project-vision.md`
   - `dev_docs/session-context.md`
   - `dev_docs/handoff.md`
   - `dev_docs/STATUS.md`
   - `dev_docs/PROJECT-BRIEF.md`
   - `dev_docs/FEATURES-LIST.md`
   - `dev_docs/DOMAIN-RULES.md`

   **Any docs folder:**
   - `docs/`, `documentation/`, `design/`, `planning/`, `notes/`
   - Read any `.md` files found inside

   **Claude memory:**
   - `memory/MEMORY.md` and any memory files linked from it

   **After reading everything found**, synthesize what you know:
   ```
   EXISTING CONTEXT FOUND
   ======================
   Files read: [list]

   What I already know:
     Project: [name and description, if found]
     Stack: [tech detected from docs or configs]
     Services/modules: [if mentioned]
     Users/personas: [if mentioned]
     Key entities: [if mentioned]
     Competitors: [if mentioned]
     Timeline/team: [if mentioned]
     Maturity (from Step 0.5): [MATURITY_CLASS] (score: [MATURITY_SCORE]/100)
     Active path: [ACTIVE_PATH]

   Intake questions I can skip (already answered):
     - [question] → [answer from context]
     - ...

   Intake questions I still need to ask:
     - [question] (reason: not found in any file)
     - ...
   ```

   Use this synthesis to **pre-fill as many intake answers as possible**. Only ask the user for information that genuinely isn't in any existing file.

2. **Auto-detect the tech stack** (before asking questions):
   - Read `00-discovery/auto-detect-stack.md` and follow its detection process
   - Glob for: `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Gemfile`, `pubspec.yaml`, `Cargo.toml`
   - Glob for mobile indicators: `app.json`, `expo.json`, `react-native.config.js`, `Podfile`, `android/build.gradle`
   - Read the main config files to identify: frontend framework, backend framework, database, ORM, package manager
   - Detect monorepo structure (turbo.json, nx.json, lerna.json, pnpm-workspace.yaml)

3. **Conduct the 5-phase structured interview** per `00-discovery/intake-questions.md`:
   - ~47 questions across 5 sequential phases, asked conversationally (not as a numbered dump)
   - Each phase builds on the previous: Phase 1 entities feed Phase 2 service mining, Phase 2 services feed Phase 3 screen mapping
   - **18 MANDATORY STOP GATES** — do NOT proceed without answers to these:
     1. What type of application? Web / Mobile / Both (PT1)
     2. What does the product do? (A1)
     3. How many services/modules? (A1-FOLLOW)
     4. Who pays for it? (A2)
     5. What is the ONE thing users do every day? (A3)
     6. Main entities the system manages (A6)
     7. All user types with screen count estimates (B1)
     8. Biggest frustration per user type (B2)
     9. Deployment target (D1)
     10. Number of developers (E1)
     11. MVP target date (E2)
     12. Native mobile app needed? (F1) — auto-answered from PT1
     13. Every service enumerated within 20% of expected count (P2-1)
     14. Post-login landing screen per user type (P3-1)
     15. Complete screen navigation tree per user type (P3-2)
   - Phase 5 runs 5 automated completeness checks before generating the project brief
   - For non-stop-gate questions, use smart defaults if the user says "you decide"

   **Additional intake questions (added to Phase 4 — Technical Decisions):**

   Analytics & Tracking:
   - "Which analytics tools will you use?" → [Google Analytics 4, PostHog, Mixpanel, Amplitude, Plausible, Multiple, Not sure yet, None] → Populates `CONFIG.ANALYTICS_PROVIDERS`
   - If GA4 selected: "What's your GA Measurement ID?" → Free text or "Don't have one yet" → Populates `CONFIG.GA_MEASUREMENT_ID`
   - "Do you need Google Search Console?" → [Yes, No, What's that?] → Populates `CONFIG.GSC_ENABLED`
   - "What are the key conversion events to track?" → Multi-select: [Signup, Purchase, Feature activation, Content engagement, Invite sent, Integration connected, Other] → Populates `CONFIG.CONVERSION_EVENTS`

   AI Agent Persona:
   - "What type of product are you building?" → [SaaS platform, E-commerce/Marketplace, Fintech, Consumer app, Developer tools, Content/Media, Healthcare, Agency project, Other] → Populates `CONFIG.AGENT_ARCHETYPE`

   **QUICK INTAKE MODE** (for Lite Path or small projects):
   Context scan (step 1 above) always runs first. Then cover Phase 1 stop gates + a compressed Phase 2: Claude proposes a service list based on A1/A6/B1 answers, user confirms/corrects. Pre-fill anything already found in existing files. Infer all remaining answers with smart defaults. Announce each default chosen so the user can override. This reduces intake from ~90 minutes to ~20-30 minutes. See `PATHS.md` for path definitions.

4. **Run feasibility math** after intake:
   ```
   {DEVS} x {VELOCITY} x {WEEKS} = {MAX_FEATURES}
   Solo dev at 2-3 features/week x 12 weeks = 24-36 features max
   ```
   If requested features exceed capacity → flag it and recommend scope cuts.

5. **Generate discovery documents** from intake answers:
   - `PROJECT-BRIEF.md` from `00-discovery/project-brief.template.md`
   - `DOMAIN-RULES.md` from `00-discovery/domain-rules.template.md`
   - `FEATURES-LIST.md` from `00-discovery/features-list.template.md`
   - `INTEGRATIONS-MAP.md` from `00-discovery/integrations-map.template.md`
   - `DATA-SENSITIVITY.md` from `00-discovery/data-sensitivity.template.md`

   **Discovery Depth Gate** — verify BEFORE proceeding to Step 2:

   | Document | Min Words | Key Quality Check |
   |----------|-----------|-------------------|
   | PROJECT-BRIEF.md | 800 | 3+ personas with pain points, 3+ competitors named, 5+ KPIs |
   | FEATURES-LIST.md | 400 | 15+ features (Standard/Full) or 8 (Lite/Express), each with priority + effort |
   | DOMAIN-RULES.md | 300 | 10+ rules with specific constraints, all falsifiable |
   | INTEGRATIONS-MAP.md | 200 | Each integration has: purpose, data flow direction, failure impact |
   | DATA-SENSITIVITY.md | 150 | Classification per data type, retention policy, encryption requirement |

   If ANY document fails its minimum: re-generate with depth prompts before proceeding. A shallow foundation produces shallow everything downstream.

6. **Build the internal config** (store in STATE BLOCK):
   ```
   CONFIG: {
     PROJECT_NAME: "...",
     PROJECT_SLUG: "...",
     PROJECT_DESCRIPTION: "...",
     INDUSTRY: "...",
     TARGET_MARKET: "...",
     FRONTEND_FRAMEWORK: "next" | "react" | "vue" | "svelte" | "none",
     BACKEND_FRAMEWORK: "nestjs" | "express" | "fastapi" | "django" | "rails" | "gin" | "none",
     DATABASE: "postgresql" | "mysql" | "mongodb" | "sqlite",
     ORM: "prisma" | "typeorm" | "drizzle" | "sqlalchemy" | "django-orm" | "activerecord" | "gorm",
     PKG_MANAGER: "pnpm" | "npm" | "yarn" | "bun" | "pip" | "poetry" | "bundle" | "go",
     MONOREPO: true | false,
     MONOREPO_TOOL: "turbo" | "nx" | "lerna" | "none",
     LINT_CMD: "...",
     TEST_CMD: "...",
     BUILD_CMD: "...",
     TYPE_CHECK_CMD: "...",
     FRONTEND_PORT: 3000,
     BACKEND_PORT: 3001,
     API_PREFIX: "/api/v1",
     MULTI_TENANT: true | false,
     AUTH_METHOD: "jwt" | "session" | "oauth" | "none",
     MVP_SERVICES: [{ name: "...", entities: [...], roles: [...], screens: 0, priority: "P0" }],
     MVP_SCREENS: 0,
     EXPECTED_SERVICE_COUNT: 0,
     MVP_ENTITIES: ["..."],
     MVP_ENTITY_STATES: { "entity": ["state1", "state2"] },
     MVP_WORKFLOWS: [{ name: "...", role: "...", steps: 0 }],
     NOTIFICATION_EVENTS: [{ trigger: "...", channel: "...", recipient: "..." }],
     PERMISSION_MATRIX: { "role": { "entity": "CRUD scope" } },
     MVP_INTEGRATIONS: [{ service: "...", target: "...", direction: "..." }],
     SCHEDULED_TASKS: [{ name: "...", schedule: "...", priority: "..." }],
     IMPORT_EXPORT: [{ operation: "...", entity: "...", format: "..." }],
     SEARCH_REQUIREMENTS: [{ screen: "...", fields: "...", filters: "..." }],
     AUDIT_REQUIREMENTS: "standard" | "hipaa" | "financial" | "none",
     MVP_SCREENS_PER_ROLE: { "role": 0 },
     DASHBOARDS: [{ role: "...", name: "...", kpis: [...] }],
     TIMELINE_WEEKS: 0,
     TEAM_SIZE: 0,
     PERSONAS: ["..."],
     COMPETITORS: ["..."],
     EXISTING_DOCS: "path" | "none",
    MATURITY_SCORE: 0,
    MATURITY_CLASS: "greenfield" | "early_build" | "mid_build" | "mature" | "mature_kit",
    ACTIVE_PATH: "greenfield" | "enhance" | "kit-upgrade" | "resume",
    HAS_KIT_ARTIFACTS: true | false,
    EXISTING_TEST_COUNT: 0,
    EXISTING_TASK_COUNT: 0,
    EXISTING_TASK_COMPLETION_PCT: 0,
    PROJECT_TYPE: "web" | "mobile" | "web+mobile",
    HAS_WEB: "true" | "false",
    HAS_MOBILE: "true" | "false",
    MOBILE_FRAMEWORK: "react-native" | "flutter" | "native" | "none",
    MOBILE_PLATFORMS: "ios" | "android" | "both",
    EXPO_MANAGED: "true" | "false",
    MOBILE_OFFLINE: "true" | "false",
    MOBILE_NATIVE_APIS: ["push", "camera", "gps", "biometrics"],
    APP_STORE_TIMELINE: "...",
    MOBILE_FULL_PARITY: "true" | "false",
    SEED_DATA: "true" | "false",
    MASTER_TRACKER: "true" | "false",
    COMPETITIVE_BATTLE_CARDS: "true" | "false",
    DOMAIN_SPECS: "true" | "false",
    MODULE_HUBS: "true" | "false",
    MOCK_SERVER: "true" | "false"
   }
   ```

7. **Present a confirmation summary:**
   ```
   CONFIRMED PROJECT SETUP:
     Project: [name] — [description]
     Industry: [detected]
     Project type: [web / mobile / web+mobile]
     Stack: [frontend] + [backend] + [database] + [ORM]
     Package manager: [detected]
     Monorepo: [yes/no] ([tool])
     MVP scope: [X services, Y screens, Z weeks]
     Team: [size] developers
     Personas: [list]
     Competitors: [list or "will research"]
     Mobile: [yes/no] ([framework], [platforms])
     Mobile features: [list of native APIs or "none"]
   ```

**GATE: User confirms the project understanding is correct.**

Update STATE BLOCK with all CONFIG values, set `CURRENT_STEP: 1.5`, add "1-intake" to COMPLETED.

---

## Step 1.5: Version Verification

**Goal:** Verify that all technology versions are current using live web data. Never trust AI training data for version numbers.

**Why this step exists:** AI agents have training data cutoffs. Any version stated from memory is potentially months behind the actual latest stable release. This step catches that before versions propagate through all generated documents.

**Instructions:**

1. **Build the verification list** from CONFIG:
   - Every technology with a version dimension: frontend framework, backend framework, database, ORM, CSS framework, component library, auth library
   - Key peer dependencies (e.g., React if using Next.js)
   - Runtime/tooling: Node.js, package manager version, build tool

2. **Look up each version using MCP tools** (try in order, use first that succeeds):
   - **Context7**: `resolve-library-id` → `query-docs` — best for npm/PyPI packages
   - **Firecrawl**: `firecrawl_search` for "{technology} latest stable version {current year}" — best for databases, runtimes, non-npm tools
   - **WebSearch**: fallback if above fail

   For each technology, record:
   - Current stable version (from live lookup)
   - Source URL
   - Whether it differs from what you would have assumed

3. **Check for breaking changes** between the version you assumed and the live version:
   - If major version differs → search for migration guide, flag to user
   - Cross-reference `LESSONS-LEARNED.md` — flag any lessons that reference an older version

4. **Present verification table to user:**
   ```
   VERSION VERIFICATION
   ====================
   | Technology     | Live Version | Source           | Notes              |
   |----------------|--------------|------------------|--------------------|
   | Next.js        | ?.?.?        | npmjs.com        |                    |
   | React          | ?.?.?        | npmjs.com        |                    |
   | Tailwind CSS   | ?.?.?        | tailwindcss.com  |                    |
   | PostgreSQL     | ?.?          | postgresql.org   |                    |
   | ...            | ...          | ...              | ...                |

   WARNINGS:
   - [any major version jumps or breaking changes found]
   ```

5. **Update CONFIG** with verified versions:
   - `FRONTEND_VERSION`, `BACKEND_VERSION`, `DATABASE_VERSION` (already exist in PLACEHOLDER-REGISTRY)
   - Add as needed: `ORM_VERSION`, `CSS_VERSION`, `AUTH_VERSION`, `REACT_VERSION`

6. **For existing codebases**: read exact versions from `package.json` / lock files. These are authoritative — no web lookup needed for packages already installed.

7. **For greenfield projects**: every version MUST come from a live lookup. Do not fill in version placeholders from training data.

**If MCP tools are unavailable or fail for a specific technology:**
Mark that version as `UNVERIFIED` in the table. The user must manually confirm or provide the version. Do not silently fill in a version from training data.

**GATE: User confirms the version table is correct.**

Update STATE BLOCK: set `CURRENT_STEP: 1.7`, add "1.5-version-verify" to COMPLETED.

---

## Step 1.7: Stakeholder Communication Setup

**Goal:** Establish the stakeholder communication plan, audience matrix, and generate the first kickoff communications. Communication starts NOW — not at Step 18.5.

**Instructions:**

1. **Identify stakeholders** — Ask the user:
   - Who are the key stakeholders? (names, roles)
   - What audience type is each? (`executive`, `investor`, `client`, `team`)
   - How do they prefer to receive updates? (email, Slack, video call, shared doc, Miro board)
   - How often do they need updates? (daily, weekly, bi-weekly, sprint-aligned, monthly, quarterly)
   - What are their primary concerns? (budget, timeline, features, quality, security)

2. **Store stakeholder config** in STATE BLOCK:
   ```
   CONFIG: {
     ...existing values...,
     STAKEHOLDERS: [{ name: "...", role: "...", audience_type: "executive|investor|client|team", channel: "...", cadence: "...", concerns: "..." }],
     COMMS_CADENCE: "weekly" | "biweekly" | "sprint-aligned",
     PRIMARY_AUDIENCE: "executive" | "investor" | "client" | "team"
   }
   ```

3. **Generate communication plan:**
   - Read `31-stakeholder-communications/communication-plan.template.md`
   - Fill in all `{{STAKEHOLDER_*}}` placeholders from user input
   - Write to `dev_docs/comms/communication-plan.md`

4. **Generate audience matrix:**
   - Read `31-stakeholder-communications/audience-matrix.template.md`
   - Customize based on identified stakeholder types
   - Write to `dev_docs/comms/audience-matrix.md`

5. **Create comms directory structure:**
   ```
   dev_docs/comms/
   ├── communication-plan.md
   ├── audience-matrix.md
   ├── 01-kickoff/
   ├── diagrams/
   └── recurring/
   ```

6. **Generate kickoff communications:**
   - Read templates from `31-stakeholder-communications/phase-packs/01-discovery/`
   - Fill with project data from Step 1 (project brief, features list, personas, scope)
   - Generate: project pitch deck, vision summary, initial scope overview, kickoff meeting agenda
   - Write to `dev_docs/comms/01-kickoff/`

7. **Generate initial Mermaid diagrams:**
   - Read `31-stakeholder-communications/diagrams/overview-service-map.template.md`
   - Fill with real project data (services, personas, stakeholders)
   - Write to `dev_docs/comms/diagrams/overview-service-map.md`

8. **Present kickoff package to user:**
   ```
   STAKEHOLDER COMMUNICATIONS SETUP COMPLETE
   ==========================================
   Stakeholders registered: {N}
   Communication cadence: {cadence}
   Primary audience: {type}

   Kickoff package generated:
     dev_docs/comms/communication-plan.md
     dev_docs/comms/audience-matrix.md
     dev_docs/comms/01-kickoff/project-pitch-deck.md
     dev_docs/comms/01-kickoff/vision-and-goals.md
     dev_docs/comms/01-kickoff/initial-scope.md
     dev_docs/comms/01-kickoff/kickoff-meeting-agenda.md
     dev_docs/comms/diagrams/overview-service-map.md

   These files are ready to share with stakeholders.
   Use /stakeholder-report to generate updates at any time.
   ```

Update STATE BLOCK: `CURRENT_STEP: 1.9`, add "1.7-comms-setup" to COMPLETED.

---

## Step 1.9: Creative Expansion Brainstorm

**Goal:** Before scope is locked, think bigger. Surface adjacent ideas, implied features, and market expectations the user may not have named. The user's initial description is a starting point — this step asks what it *should* become.

**Instructions:**

1. **Re-read the Step 1 confirmation summary** (project description, services, personas, features list)

2. **Run the Expansion Thinking Protocol** — answer ALL of these in the conversation before proceeding. Do not skip or abbreviate. The user must see your thinking.

   **Adjacent Need Analysis:**
   > "Given that users want [PROJECT DESCRIPTION], what are 5 adjacent things they almost certainly also want — even if they didn't mention them? These are needs that live right next to the stated need."

   **Market Baseline Check:**
   > "What are the 5 things that EVERY product in this space has? What would users assume exists on day 1, without asking? What's embarrassing to be missing?"

   **Delight vs. Table Stakes:**
   > "What separates a product users tolerate from one they love in this category? What's the 1 feature that would make someone say 'this team really gets it'?"

   **Implied Services Check:**
   > "The user described [N] services. What services are strongly implied but not named? If you build [SERVICE_A], you almost always also need [WHAT]? What's the obvious missing piece?"

   **Power User Lens:**
   > "A power user who uses this product 3+ hours a day — what do they eventually need that casual users don't? Bulk operations? API access? Advanced filtering? Keyboard shortcuts? Export to CSV? Role delegation? Audit logs? Saved views?"

   **10x Thinking:**
   > "What would make this product 10x more valuable than what the user described? What single addition would change the category? What would a category-leader have that a category-follower doesn't?"

3. **Generate an Expansion Backlog** based on your reasoning. For each idea:
   - Assign a label: `Add to MVP` / `Phase 2` / `Strongly Implied (must discuss)` / `Nice-to-Have`
   - Flag any `Strongly Implied` items missing from the current scope — these need a decision before proceeding
   - Be specific: not "add notifications" but "add email + in-app notifications for [specific trigger events]"

4. **Present the Expansion Brainstorm to the user:**

   ```
   EXPANSION BRAINSTORM
   ====================
   Initial scope: [N services, brief description of what was described]

   Things you probably also need (not yet in scope):
     - [item 1] — [why it's implied] — [label: Strongly Implied / Phase 2 / etc.]
     - [item 2] — [why it's implied] — [label]
     - ...

   Market baseline (what competitors always have):
     - [item 1] — [status: already in scope / MISSING]
     - [item 2] — [status]
     - ...

   Delight opportunity:
     - [the one feature that would make users love this, not just use it]

   Power user gap:
     - [what heavy users will eventually demand that isn't planned yet]

   10x idea:
     - [the ambitious addition that could change the scope positively]

   Recommended additions: [list items user should add to MVP now]
   Recommended deferrals: [list items to put in Phase 2 backlog]
   ```

5. **Update CONFIG** if the user approves any additions:
   - Add new services to `CONFIG.MVP_SERVICES` if scope expands
   - Re-run feasibility math from Step 1 if service count changes significantly
   - Write expansion backlog to `dev_docs/expansion-backlog.md` (all deferred ideas preserved)

**GATE: User reviews the Expansion Brainstorm and decides what to add, defer, or skip. At minimum, every `Strongly Implied` item must have an explicit decision.**

Update STATE BLOCK: `CURRENT_STEP: 2`, add "1.9-expansion-brainstorm" to COMPLETED.

---

## Step 2: AI Config & Command Setup

**Goal:** Generate all AI config files, resolve command templates, initialize project memory.

**Instructions:**

1. **Resolve all command templates:**
   - Read each `.md.template` in `.claude/commands/`
   - Replace `{{PLACEHOLDER}}` variables with values from CONFIG
   - Strip conditional sections that don't match the detected stack
   - Write resolved files as `.md` (remove `.template` extension)

2. **Generate AI config files** by resolving templates from `05-dev-infrastructure/ai-config/`:
   - `CLAUDE.md` → project root (resolve from `CLAUDE.md.template`)
   - `AGENTS.md` → project root (resolve from `AGENTS.md.template`)
   - `GEMINI.md` → project root (resolve from `GEMINI.md.template`)
   - `.github/copilot-instructions.md` → `.github/` (resolve from `COPILOT.md.template`)
   - `WORKFLOWS.md` → project root
   - `LEARNINGS.md` → project root (empty, grows over time)

3. **Resolve skill templates:**
   - Update `.claude/skills/kickoff/SKILL.md` with project-specific service-to-hub mapping
   - Update `.claude/skills/log/SKILL.md` with project-specific work log path

4. **Initialize memory:**
   - Create `memory/MEMORY.md` from template with project details filled in
   - Create empty topic files as needed (design-system.md, testing.md, debugging.md)

5. **Create unified dev_docs/ structure:**
   - `dev_docs/STATUS.md` from template (empty task tables, ready to populate)
   - `dev_docs/CHANGELOG.md` from template
   - `dev_docs/foundations/` with session-kickoff.md, quality-gates.md
   - `dev_docs/tasks/` directory structure (phase-0/, phase-1/, phase-2/)
   - `dev_docs/components/`
   - `dev_docs/services/` (for service hub files)
   - `dev_docs/audit/`
   - `dev_docs/references/`
   - `dev_docs/specs/` (for detailed specifications)
   - `dev_docs/specs/services/` (service specs)
   - `dev_docs/specs/screens/` (screen specs)
   - `dev_docs/specs/contracts/` (API contracts)
   - `dev_docs/specs/database/` (schema docs)
   - `dev_docs/specs/standards/` (development standards)
   - `dev_docs/completeness/` (completeness matrices and dashboards)
   - `dev_docs/sprints/`
   - `dev_docs/decisions/`
   - `dev_docs/kit-feedback/pending/` (improvement candidates for `/kit-feedback`)
   - `dev_docs/kit-feedback/exported/` (archive of submitted feedback)
   - Copy `tools/hooks/kit-feedback-auto-export.sh` to project's `tools/hooks/`
   - Create `.kit-feedback-config.json` with project short name and contributor alias
   - Add kit-feedback Stop hook to project's `.claude/settings.json` (merge with existing hooks):
     ```json
     { "hooks": { "Stop": [{ "matcher": "", "hooks": [{ "type": "command", "command": "bash tools/hooks/kit-feedback-auto-export.sh", "timeout": 10000 }] }] } }
     ```

Update STATE BLOCK: `CURRENT_STEP: 2.5`, add "2-ai-config" to COMPLETED.

---

## Step 2.5: Agent Persona Generation

**Goal:** Transform the AI from a generic code assistant into a domain-expert co-founder with project-specific identity, knowledge, behavioral rules, and quality standards.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/intake-profile.md` — maintain curious interviewer mindset.

**Why this matters:** Without a persona, the AI takes the path of least resistance — producing generic, shallow output that misses domain nuance. A well-crafted persona makes the AI think in domain terms, apply multi-stakeholder perspective checks, resist lazy shortcuts, and sound like an expert rather than a template filler.

**Instructions:**

1. **Select archetype** based on project type identified during intake:

   Ask via AskUserQuestion: "What best describes the product you're building?"
   - SaaS platform / B2B tool → `saas-cto.md`
   - E-commerce / Marketplace → `ecommerce-lead.md`
   - Fintech / Payments / Banking → `fintech-engineer.md`
   - Consumer mobile/web app → `consumer-app-lead.md`
   - Developer tools / API / SDK → `devtools-architect.md`
   - Content / Media / Publishing → `content-platform-lead.md`
   - Healthcare / Medical / Biotech → `healthcare-engineer.md`
   - Agency project / Client work → `agency-project-lead.md`
   - Other → Use `persona-generator-protocol.md` to create custom archetype

   If the project type was already clearly stated in intake, auto-select and confirm via AskUserQuestion.

2. **Read the selected archetype** from `48-ai-agent-personas/archetypes/{{AGENT_ARCHETYPE}}.md`

3. **Customize with project-specific context:**
   - Read the project brief and all intake answers
   - Identify 3-5 concrete consequences of AI mistakes (specific to THIS project — dollar amounts, user harm, reputation damage, lost sales)
   - Extract domain-specific terminology, business rules, and edge cases from intake
   - Identify the project's key stakeholder perspectives (from CONFIG.PERSONAS)
   - Determine project-specific anti-patterns based on the domain and risk profile

4. **Generate persona blocks** using templates from `48-ai-agent-personas/templates/`:
   - **Identity Block** → `{{AGENT_IDENTITY_BLOCK}}` — role declaration, project context, real consequences
   - **Domain Knowledge** → `{{AGENT_DOMAIN_KNOWLEDGE}}` — industry terms, business rules, gotchas
   - **Prime Directives** → `{{AGENT_PRIME_DIRECTIVES}}` — 5 universal + 3-5 project-specific behavioral rules
   - **Perspective Checks** → `{{AGENT_PERSPECTIVE_CHECKS}}` — 2-4 stakeholder viewpoint gates with failure examples
   - **Anti-Patterns** → `{{AGENT_ANTI_PATTERNS}}` — universal + domain-specific "never do this" rules

5. **Inject all blocks into CLAUDE.md** at the placeholder positions defined in the template

6. **Apply secondary signals** to amplify the persona:
   - If `COMPLIANCE_REQUIREMENTS` contains HIPAA/SOC2/PCI → amplify security directives
   - If `HAS_MOBILE = true` → add mobile-specific perspective checks
   - If `IS_MULTI_TENANT = true` → add tenant isolation paranoia to anti-patterns
   - If `FUNDRAISING_STAGE` is seed/series-a → add investor-readiness perspective
   - If `HAS_AI = true` → add AI safety, hallucination, and cost-awareness directives

7. **GATE: Present the persona to the user for review.**

   Ask via AskUserQuestion: "Here's your AI agent persona. Does this capture the project's identity and what's at stake?"
   - Options: [Looks good — proceed, Adjust the stakes/consequences, Adjust the role title, Add domain knowledge, Start over with different archetype]

   If the user requests adjustments, iterate on the specific block they want changed.

8. **Record archetype selection** in CONFIG: `CONFIG.AGENT_ARCHETYPE = "{{selected}}"`

Update STATE BLOCK: `CURRENT_STEP: 3`, add "2.5-agent-persona" to COMPLETED.

### SESSION BOUNDARY — SB-1: Post-Intake

This is a safe stopping point. Before proceeding:

1. **Create `dev_docs/session-context.md`** from `03-documentation/state-files/session-context.template.md`:
   - Fill Project Identity with all CONFIG values
   - Fill User's Vision with the user's exact words about their product
   - Fill all 15 Intake Answers with the user's actual responses
   - Fill User's Concerns & Preferences
   - Fill "What Great Looks Like" with user's quality expectations
   - Start Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (intake, AI config, project setup)
   - Next step: Step 3 (Run the Tribunal)
   - Any open questions or decisions needed
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-1 reached. Intake and setup are complete. You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

---

## Step 3: Run the Tribunal

**Goal:** Execute the 10-round deep research process with adversarial debate.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/research-profile.md` — adopt adversarial researcher mindset. Challenge every assumption. Find inconvenient truths.
CONSULTANT PERSONAS: Load `48-ai-agent-personas/consultant-roles/technical-consultant.template.md`, `business-consultant.template.md`, `marketing-consultant.template.md` for tribunal debate agents.

**Instructions:**

1. Read `01-tribunal/TRIBUNAL-PROMPT.md`
- **Skill invocation:** Use Firecrawl MCP to scrape competitor websites and pricing pages. Use Gemini MCP for deep research synthesis. Use Context7 MCP for any library/framework documentation needed. Use Sequential Thinking MCP for multi-perspective analysis of feasibility questions.
2. Fill in all tribunal variables from CONFIG:
   - PROJECT_NAME, INDUSTRY, TARGET_MARKET, TECH_STACK
   - USER_PERSONAS from CONFIG.PERSONAS
   - KNOWN_COMPETITORS from CONFIG.COMPETITORS
   - FEATURE_AREAS (auto-detected from codebase structure)
   - OUTPUT_FOLDER → `dev_docs/tribunal/`
   - EXISTING_DOCS from CONFIG.EXISTING_DOCS
3. **Enforce Delta voting rigor** during debate rounds:
   - Each user persona gets exactly 10 votes across all features (max 5 per feature)
   - Deal-breakers must be specific and testable (not "it needs to be secure")
   - Spawn 5 named expert agents: UX Researcher, UI Designer, Frontend Dev, Backend Dev, Feature Researcher
   - Experts can advise but cannot veto user-identified Must-Have features
   - The final verdict is a **binding contract** — features do not change without a mini-Tribunal
   - After the verdict is finalized, extract a **competitive gap matrix**: for each top-3 competitor, list features they have that this project does NOT plan to build, with a disposition for each (deliberate omission / future phase / must-add). Write to `dev_docs/tribunal/competitive-gap-matrix.md`
4. Execute all 10 rounds in sequence, following the tribunal prompt's rules
5. **Mandate the "Surprise Round"** — In the feature discovery round (typically Round 8 or 9), each expert agent MUST answer this question before the round closes:
   > "What feature or service is NOT in the current plan that this category always rewards? What would users expect and not find? What would a journalist write about as 'surprisingly missing'?"
   - Experts are NOT allowed to answer "none" — every expert must surface at least 1 item
   - These findings are written to `dev_docs/tribunal/expansion-surprises.md`
   - At the gate, present these as a separate block: "Here's what the tribunal found that you didn't ask for"
6. Expected output: 60-100 markdown files in `dev_docs/tribunal/` plus `expansion-surprises.md`

<!-- IF {{PROJECT_TYPE}} == "mobile" -->
**Mobile-only optimization:** For mobile-only projects, an abbreviated tribunal (5 rounds) is acceptable. Focus rounds on: mobile UX patterns, native capability requirements, platform-specific constraints, competitive mobile app analysis, and feature prioritization. Skip web-specific research rounds (responsive layout, SSR strategy, web performance, web deployment).
<!-- ENDIF -->

**GATE: Present the executive summary to the user. Ask if they want to adjust any priorities before proceeding.**

**COMMS TRIGGER:** After gate approval, generate architecture-phase stakeholder communications:

- Read `31-stakeholder-communications/phase-packs/02-architecture/system-overview-presentation.template.md` and `tech-decisions-explained.template.md`
- Fill with tribunal output, tech stack decisions, and service architecture
- Generate Mermaid diagrams: `overview-service-map.md`, `system-architecture-flowchart.md`
- Write to `dev_docs/comms/02-architecture/` and `dev_docs/comms/diagrams/`

Update STATE BLOCK: `CURRENT_STEP: 3.5`, add "3-tribunal" to COMPLETED.

---

## Step 3.5: Mobile Framework Selection (skip if no mobile)

**Goal:** Confirm mobile framework choice based on tribunal output and technical assessment.

**Instructions:**

1. If CONFIG.HAS_MOBILE is "false" → skip to Step 4
2. Read `14-mobile-platform/framework-decision-tree.md`
3. Walk the decision tree using:
   - CONFIG.FRONTEND_FRAMEWORK (React ecosystem → React Native advantage)
   - CONFIG.MOBILE_NATIVE_APIS (complex native needs → Native advantage)
   - Team Dart experience (Flutter advantage)
   - Tribunal output: which mobile features scored highest?
4. Present framework recommendation with rationale:
   ```
   MOBILE FRAMEWORK RECOMMENDATION:
     Framework: [React Native + Expo / Flutter / Native Swift + Kotlin]
     Rationale:
       - [reason 1 based on tech stack alignment]
       - [reason 2 based on feature requirements]
       - [reason 3 based on team expertise or timeline]
     Shared code potential: [X packages shared with web]
     Risk factors: [known challenges for this choice]
     Expo managed workflow: [recommended / not recommended] (React Native only)
   ```

**GATE: User confirms mobile framework choice.**

Update STATE BLOCK: CONFIG.MOBILE_FRAMEWORK = confirmed value, CONFIG.EXPO_MANAGED = confirmed value, set `CURRENT_STEP: 3.6`, add "3.5-mobile-framework" to COMPLETED.

---

## Step 3.6: Technical Spike Planning

**Goal:** Identify high-risk technical unknowns from the tribunal and create spike templates for each.

**Instructions:**

1. Review tribunal output for items marked as "needs POC", "high risk", "unknown feasibility", or similar
2. Read `03-documentation/spec-layer/spike.template.md`
3. For each high-risk item, generate a spike file at `dev_docs/spikes/spike-{topic}.md`:
   - What specific question the spike answers
   - Time box (typically 4-8 hours)
   - Success criteria (what result = confidence to proceed)
   - Approach (3-5 concrete steps)
4. Target: 3-8 spike files depending on project complexity
5. Present spike plan:
   ```
   TECHNICAL SPIKES PLANNED:
     Total spikes: {N}
     Total time budget: {HOURS} hours
     Spikes: [list with names and time boxes]
   ```

Update STATE BLOCK: set `CURRENT_STEP: 4`, add "3.6-spike-planning" to COMPLETED.

---

## Step 4: Foundation Docs

**Goal:** Generate high-level project documents from tribunal output.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/architecture-profile.md` — think as a principal engineer. Systems thinking, trade-offs, 3-year maintenance costs.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/technical-consultant.template.md` for architecture decisions.

**Instructions:**

1. Read tribunal output from `dev_docs/tribunal/10-deliverables/executive-summary.md`

2. **Read relevant gotcha files** from `13-lessons-gotchas/` based on the project stack. These contain production battle scars that should inform architecture decisions:

   | Condition | Read |
   |-----------|------|
   | Always | `13-lessons-gotchas/auth-gotchas.md`, `database-gotchas.md`, `deployment-gotchas.md`, `testing-gotchas.md`, `design-gotchas.md` |
   | CONFIG.FRONTEND_FRAMEWORK == "next" | `13-lessons-gotchas/nextjs-gotchas.md` |
   | CONFIG.BACKEND_FRAMEWORK == "nestjs" | `13-lessons-gotchas/nestjs-backend-gotchas.md` |
   | CONFIG.API_PATTERN == "trpc" | `13-lessons-gotchas/trpc-gotchas.md` |
   | CONFIG.LANGUAGE == "typescript" | `13-lessons-gotchas/typescript-gotchas.md` |
   | CONFIG.HAS_MOBILE == "true" | `13-lessons-gotchas/react-native-gotchas.md`, `mobile-deployment-gotchas.md`, `flutter-gotchas.md` (if Flutter) |
   | CONFIG.MULTI_TENANT == "true" | `13-lessons-gotchas/multi-tenant-saas-gotchas.md` |
   | Using MCP servers | `13-lessons-gotchas/mcp-gotchas.md` |
   | AI-assisted development | `13-lessons-gotchas/ai-workflow-gotchas.md` |
   | Windows development | `13-lessons-gotchas/windows-gotchas.md` |

   Extract key warnings relevant to the project's architecture and note them for Steps 5-6.

3. Generate these files in `dev_docs/specs/` by resolving templates from `03-documentation/spec-layer/`:
   - `project-overview.md` — what the project is, who it's for, current state
   - `project-vision.md` — where it's going, market positioning
   - `project-phases.md` — phase breakdown with scope and timeline
   - `user-personas.md` — all personas with priorities and deal-breakers
   - `system-architecture.md` — architecture diagram, tech stack decisions
   - `tech-stack.md` — every technology choice with rationale

**COMMS TRIGGER:** Generate roadmap and timeline communications:

- Read `31-stakeholder-communications/phase-packs/02-architecture/roadmap-overview.template.md` and `timeline-and-milestones.template.md`
- Fill with phase data from `project-phases.md` and milestone dates
- Generate Mermaid diagrams: `roadmap-gantt.template.md`, `milestone-timeline.template.md`
- Write to `dev_docs/comms/02-architecture/` and `dev_docs/comms/diagrams/`

Update STATE BLOCK: `CURRENT_STEP: 4.5`, add "4-foundation" to COMPLETED.

---

## Step 4.5: Service Completeness Matrix

**Goal:** Verify that every feature identified during intake and tribunal maps to a specific service, and no service is missing. This is the "nothing gets dropped" gate.

**Instructions:**

1. Read the following source documents and extract ALL service/feature mentions:
   - `dev_docs/specs/project-overview.md` (from Step 4)
   - `dev_docs/specs/project-phases.md` (from Step 4)
   - `dev_docs/specs/user-personas.md` (from Step 4) — extract features per persona
   - Tribunal executive summary (from Step 3)
   - Tribunal roadmap (from Step 3)
   - Original features list from Step 1 (`FEATURES-LIST.md`)

2. Build the SERVICE COMPLETENESS MATRIX:

   For every feature or capability mentioned in ANY source document:

   | # | Feature/Capability | Source(s) | Mapped Service | Status |
   |---|---|---|---|---|
   | 1 | User registration | Intake Q-B1, Tribunal R3 | Auth & Admin | Confirmed |
   | 2 | Invoice generation | Tribunal R5, Persona: Admin | Accounting | Confirmed |
   | 3 | GPS tracking | Intake Q-C4, Tribunal R7 | ??? | UNMAPPED |

   Status values:
   - **Confirmed** — Feature maps to a named service in CONFIG.MVP_SERVICES
   - **UNMAPPED** — Feature mentioned in sources but no service covers it
   - **Deferred** — Feature explicitly scoped out of MVP (user approved)
   - **Merged** — Feature absorbed into another service (with explanation)

3. Build the SERVICE COVERAGE TABLE:

   | # | Service | Features Covered | Screen Count (est.) | Source Coverage |
   |---|---|---|---|---|
   | 1 | Auth & Admin | 5 features | ~6 screens | Intake + Tribunal |
   | 2 | CRM | 8 features | ~8 screens | Intake + Tribunal |

4. VALIDATION RULES (fail the gate if any are true):
   - Any feature with Status = "UNMAPPED" (must be resolved)
   - Any service with 0 features mapped (phantom service — remove it)
   - Any persona with 0 features mapped to any service (persona ignored)
   - Total feature count < 80% of features mentioned across all source documents

5. RECONCILIATION: For each UNMAPPED feature:
   a. Create a new service to cover it, OR
   b. Assign it to an existing service (and explain why), OR
   c. Present it to the user as a deferral candidate

6. UPDATE CONFIG.MVP_SERVICES with the reconciled list.

7. Generate `dev_docs/completeness/service-matrix.md` with the full matrix.

8. Present summary:
   ```
   SERVICE COMPLETENESS MATRIX:
     Features identified: {N} across all sources
     Features mapped to services: {M} ({percentage}%)
     Features deferred: {D}
     Features UNMAPPED: {U} — MUST BE ZERO TO PROCEED
     Services: {S} total
     Estimated screens: {SC}
   ```

**GATE: All features must be mapped (UNMAPPED = 0). User confirms the service-to-feature mapping is correct before proceeding.**

Update STATE BLOCK: `CURRENT_STEP: 4.7`, add "4.5-completeness-matrix" to COMPLETED.

---

## Step 4.7: Analytics Architecture

**Goal:** Define the event tracking taxonomy, map conversion events to financial model metrics, and generate an analytics setup spec early in the design phase — not as an afterthought during marketing.

**Why early:** Analytics decisions affect architecture (event tracking layer in code), design (conversion tracking points in UX flows), and financial modeling (measuring the metrics that matter). Deferring analytics to Step 19+ means retrofitting tracking into an existing codebase — more expensive and less reliable.

**Instructions:**

1. Read analytics provider selection from CONFIG (populated during intake):
   - `CONFIG.ANALYTICS_PROVIDERS` — which tools to set up
   - `CONFIG.GA_MEASUREMENT_ID` — if Google Analytics selected
   - `CONFIG.GSC_ENABLED` — if Google Search Console needed
   - `CONFIG.CONVERSION_EVENTS` — key events to track

2. Read `19-marketing/analytics-and-tracking/analytics-setup-guide.template.md` for tool-specific setup patterns

3. Generate `dev_docs/specs/analytics-event-taxonomy.md`:
   - Canonical event list with parameters (event name, category, properties, when it fires)
   - Core events (always tracked): page_view, signup_started, signup_completed, login, error
   - Conversion events (from intake): map each `CONFIG.CONVERSION_EVENTS` to a specific gtag/tracking call
   - Revenue events: purchase, subscription_started, subscription_cancelled, plan_upgraded
   - Engagement events: feature_used, invite_sent, integration_connected
   - For each event: name, category, parameters (page_path, user_id hash, value), implementation location (which component/route fires this)

4. Generate `dev_docs/specs/analytics-setup-spec.md`:
   - Provider-specific setup instructions for the project's stack
   - Next.js App Router integration pattern (if applicable)
   - GTM vs direct integration recommendation
   - Cookie consent / GDPR compliance approach
   - Server-side vs client-side tracking decision

5. Cross-reference conversion events with financial model:
   - Map each conversion event to the corresponding financial metric from Step 17.5
   - Example: `signup_completed` → VISITOR_TO_SIGNUP_RATE measurement
   - Example: `subscription_started` → SIGNUP_TO_PAID_RATE measurement
   - Document in `dev_docs/specs/analytics-to-financial-mapping.md`

Update STATE BLOCK: `CURRENT_STEP: 5`, add "4.7-analytics-architecture" to COMPLETED.

---

## Step 5: Service Specs & Hub Files

**Goal:** Create service specifications and single-source-of-truth hub files.

**Instructions:**

1. Read `10-generators/SERVICE-HUB-GENERATOR.md`
2. Read `10-generators/DEPTH-REQUIREMENTS.md` — internalize the Depth Prompting Protocol and elevated thresholds

3. **Generate service specs ONE AT A TIME.** For each service in CONFIG.MVP_SERVICES:

   a. **TTG Reasoning (mandatory — see Autopilot Principles above):**
      Complete the Think-Then-Generate protocol for this service. Answer all 8 TTG questions in the conversation. The user must see your reasoning before you write the spec.

   b. **Brainstorming (mandatory):** Before writing each service spec, invoke the `/brainstorming` skill (superpowers plugin) or use the `tribunal-runner` skill to debate the service's scope, boundaries, and ambition level. This prevents specs that describe the obvious while missing the innovative.

   c. **Depth Prompting (mandatory):** Before writing the spec, answer these in the conversation:

      **User Day Simulation:**
      > "It's 9 AM. [PRIMARY_ROLE] opens the app to use [SERVICE]. Walk through their entire workflow until they're done. What do they click? What do they see? What frustrates them? What makes them say 'finally, an app that gets this right'?"

      **Failure Mode Analysis:**
      > "List 8 things that can go wrong with [SERVICE] in production. For each: trigger, user impact, recovery path. Think: race conditions, network failures, bad data, concurrent users, timezone issues, permission edge cases, data migration, integration failures."

      **Day-1 Expectations:**
      > "A user uses [SERVICE] for the first time. List 10 things they expect to work immediately. Not nice-to-haves — things they'd file a bug report about if missing."

      **Admin/Ops Perspective:**
      > "You are the admin responsible for [SERVICE]. What do you monitor? What reports do you need? What bulk operations save hours? What would you audit?"

   d. **Generate the service spec** using the 15-section template, informed by your TTG and depth reasoning.
      - Also generate a hub file in `dev_docs/services/` (consolidated status + links)
      - Identify background job needs (email, webhooks, scheduled tasks) — reference `02-architecture/queue-architecture-decision-tree.md`
      - Identify notification triggers (what events notify users) — reference `02-architecture/notification-architecture.template.md`

   e. **Present to user** with a depth score card. Wait for feedback before generating the next service.

   f. **Move to next service** only after user approves or provides corrections.

4. Create `dev_docs/services/_index.md` listing all services

5. **DEPTH VERIFICATION** — For each generated service spec:
   a. Count total words. If < 1500, flag as SHALLOW.
   b. Count business rules. If < 8, flag as SHALLOW.
   c. Count API endpoints. If < 7 (and not a utility service), flag as SHALLOW.
   d. Count data model entities. If < 3, flag as SHALLOW.
   e. Check that EVERY field in the data model has: name, type, constraints, nullable.
   f. Check that error handling section lists specific error codes/messages, not generic text.
   g. Check that auth/permissions section has a role x action matrix, not just prose.
   h. Check that edge cases section has >= 8 specific cases.
   i. Check that validation rules section has >= 8 field-level rules.
   j. Check that error scenarios section has >= 6 scenarios with trigger + code + recovery.
   k. **Qualitative check:** Does the spec use real user scenarios (not abstract)? Does it describe what makes the feature delightful? Does it address power user AND first-time user needs?

   If ANY service spec is flagged SHALLOW:
   - Present the depth score card per service
   - Re-generate the shallow sections with explicit prompting for more detail
   - Do NOT proceed to Step 6 until all service specs score >= 8/10 quantitative AND >= 1/2 qualitative

**GATE: Present the list of services and their hub files to the user. Show depth scores. Confirm the service breakdown is correct before generating screen specs.**

**COMMS TRIGGER:** After gate approval, generate Mermaid diagrams with real service data:

- Generate `dev_docs/comms/diagrams/overview-service-map.md` — populate with actual service names, features, and personas from specs
- Generate `dev_docs/comms/diagrams/system-architecture-flowchart.md` — Mermaid flowchart with real service names
- Generate `dev_docs/comms/diagrams/feature-mind-map.md` — Mermaid mindmap with real feature hierarchy

**CROSS-SERVICE WORKFLOW VALIDATION:** After all service specs are generated and approved, trace every workflow that spans 2+ services:
1. Identify the originating service for each cross-service workflow
2. Identify each service boundary crossing
3. Verify the handoff point is defined in BOTH the source and destination service specs (matching endpoint, event, or queue)
4. Verify data contracts match at each boundary (the output of service A matches the expected input of service B)
5. Generate `dev_docs/completeness/cross-service-workflow-validation.md` with results
6. Flag any broken chains — these MUST be resolved before proceeding

Update STATE BLOCK: `CURRENT_STEP: 5.5`, add "5-services" to COMPLETED.

### Step 5.1 — Generate Architecture Anchor

After all service specs are complete, generate `dev_docs/ARCH-ANCHOR.md` from the template at
`03-documentation/state-files/ARCH-ANCHOR.template.md`.

Fill in:
- **System Shape** from intake answers and tribunal verdict
- **Tech Stack** from CONFIG variables
- **Services** from the service specs just generated
- **Data Model** from database spec
- **Active Constraints** from tribunal deal-breakers and domain rules
- **Rejected Alternatives** from tribunal rejected options
- **API Contract Summary** from service spec API sections
- **Anti-Hallucination Anchors** from CONFIG + architecture decisions

This file becomes the PRIMARY recovery document for all future sessions. It is updated
(overwritten) after every task that changes system architecture. It MUST stay under 3000 words.

Also generate `dev_docs/PHASE-CONTEXT.md` from `03-documentation/state-files/PHASE-CONTEXT.template.md`
configured for the current phase (Architecture, Phase 2). This will be regenerated at each phase transition.

### SESSION BOUNDARY — SB-2: Post-Architecture

This is a safe stopping point. Before proceeding:

1. **Update `dev_docs/session-context.md`:**
   - Fill Service Architecture Summary with all service specs (name, purpose, entities, screens, priority, key constraint)
   - Add Tribunal Verdict Summary (top features, deal-breakers, competitive gaps)
   - Record all architecture decisions in Critical Decisions Log
   - Append this session to Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (tribunal research, service specs, hub files)
   - Next step: Step 5.1 (Module Hub Files) or Step 5.5 (Native Features Audit) or Step 6 (Screen Specs)
   - Any open questions or decisions needed
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-2 reached. Architecture and service specs are complete. You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

**Autopilot mode:** After persisting all state above, update `.kit/state.json`, then output `KIT_SESSION_BOUNDARY` on its own line and **STOP**. Do not proceed to Step 5.1. The `kit-autopilot.sh` script will restart you in a fresh session.

---

## Step 5.1: Module-Level Hub Files (skip if CONFIG.MODULE_HUBS == "false")

**Goal:** Break each umbrella service into 8-15 module-level hub files for implementation-level granularity.

**Instructions:**

1. If CONFIG.MODULE_HUBS is "false" → skip to Step 5.2
2. For each service in CONFIG.MVP_SERVICES:
   a. Identify all discrete modules/sub-domains (e.g., Auth → login, registration, password-reset, session-management, MFA, social-auth, account-linking)
   b. Target: 8-15 modules per service
   c. Generate one module hub file per module at `dev_docs/services/modules/{service-slug}/{module-name}.md`
3. Each module hub includes:
   - Overview (what this module does within the parent service)
   - 5-8 business rules (specific, testable — not "system manages X")
   - Data model entities involved
   - API endpoints specific to this module
   - Screens that interact with this module
   - Task file references (filled in after Step 8)
   - Dependencies on other modules
4. Minimum: 600 words per module hub
5. Present count:
   ```
   MODULE HUB FILES GENERATED:
     Total services: {N}
     Total modules: {TOTAL}
     Modules per service: {MIN}-{MAX} (avg {AVG})
   ```

Update STATE BLOCK: add "5.1-module-hubs" to COMPLETED.

---

## Step 5.2: Domain Specification Files (Repurpose path only, skip if CONFIG.DOMAIN_SPECS == "false")

**Goal:** Create individual spec files for every domain in the Feature Inheritance Map.

**Instructions:**

1. If CONFIG.DOMAIN_SPECS is "false" → skip to Step 5.5
2. Read `dev_docs/repurpose/feature-inheritance-map.md`
3. For each domain, generate a spec file at `dev_docs/specs/domains/{status}-{NN}-{name}.md`:

   **Carry-over domains:** Single consolidated file listing all carry-over domains with: domain name, current behavior, confirmation that no changes needed

   **Adapt domains** (individual file per domain, 800-1500 words):
   - Current state (how it works today)
   - What changes (specific modifications needed)
   - Data model changes (added/modified/removed fields)
   - API changes (new/modified endpoints)
   - UI changes (screen modifications)
   - Business rules (new vertical-specific rules)
   - Effort estimate + gap IDs resolved

   **Replace domains** (individual file per domain, 1200-2000 words):
   - Why replace (not adapt) — justification
   - Old version summary
   - New version full spec (data model, API, screens, business rules)
   - Migration path from old → new
   - Gap IDs resolved

   **New domains** (individual file per domain, 800-1500 words):
   - Purpose and gap references
   - Data model, API, screens, business rules
   - Phase assignment

   **Deprecate domains:** Single consolidated file with removal plan and data migration/archival strategy

4. Present count:
   ```
   DOMAIN SPECS GENERATED:
     Carry-over: {N} domains (1 consolidated file)
     Adapt: {N} individual spec files
     Replace: {N} individual spec files
     New: {N} individual spec files
     Deprecate: {N} domains (1 consolidated file)
     Total files: {TOTAL}
   ```

Update STATE BLOCK: add "5.2-domain-specs" to COMPLETED.

---

## Step 5.5: Native Features Audit (skip if no mobile)

**Goal:** Audit which native APIs, permissions, and offline capabilities the mobile app needs.

**Instructions:**

1. If CONFIG.HAS_MOBILE is "false" → skip to Step 6
2. Read `16-mobile-native-features/native-features-audit.template.md`
3. Read these reference guides from `16-mobile-native-features/`:
   - `offline-first-patterns.md` — offline strategy patterns (online-only, cache-first, offline-first)
   - `deep-linking.md` — deep link route configuration and universal links
   - `permissions-strategy.md` — iOS/Android permission request patterns and justification strings
   - `device-apis.md` — camera, GPS, biometrics, file system API patterns
   - `background-tasks.md` — background sync, fetch, and scheduled task patterns
4. For each service in CONFIG.MVP_SERVICES, determine:
   - Which native APIs does this service need on mobile? (camera, GPS, push, biometrics)
   - What permissions must be requested? (iOS permission strings, Android runtime permissions)
   - What is the offline strategy for this service? (online-only, cache-first, offline-first)
   - Are there push notification triggers?
   - What deep link routes map to this service?
4. Generate the filled audit document at `dev_docs/mobile/native-features-audit.md`
5. Generate `dev_docs/mobile/permissions-matrix.md` — every permission with justification string
6. Present the audit summary:
   ```
   NATIVE FEATURES AUDIT:
     Native APIs required: [list]
     Permissions (iOS): [count] permission strings
     Permissions (Android): [count] runtime permissions
     Offline strategy: [online-only / cache-first / offline-first per service]
     Push notification channels: [list]
     Deep link routes: [count] routes registered
   ```

**GATE: User reviews native features audit. Confirms which native APIs are MVP vs deferred.**

Update STATE BLOCK: set `CURRENT_STEP: 6`, add "5.5-native-audit" to COMPLETED.

---

## Step 5.6: Mobile Architecture Deep Dive (skip if CONFIG.MOBILE_FULL_PARITY == "false")

**Goal:** Generate complete mobile architecture documentation beyond the native features audit.

**Instructions:**

1. If CONFIG.MOBILE_FULL_PARITY is "false" → skip to Step 6
2. Read templates from `14-mobile-platform/`:
   - Project structure template → generate `dev_docs/mobile/architecture/project-structure.md`
   - Shared code architecture → generate `dev_docs/mobile/architecture/shared-code-strategy.md`
   - State management patterns → generate `dev_docs/mobile/architecture/state-management.md`
   - Navigation patterns → generate `dev_docs/mobile/architecture/navigation-architecture.md`
   - Data flow documentation → generate `dev_docs/mobile/architecture/data-flow.md` (request lifecycles for online + offline, per-feature data flows, API contract table)
   - Technology decisions → generate `dev_docs/mobile/architecture/technology-decisions.md` (every choice with alternatives considered and rationale)
3. Minimum: 6 files, 500+ words each. Architecture files should be exhaustive enough for a new mobile developer to understand the entire system.

Update STATE BLOCK: add "5.6-mobile-architecture" to COMPLETED.

---

## Step 5.7: Mobile Offline Architecture (skip if CONFIG.MOBILE_FULL_PARITY == "false" OR CONFIG.MOBILE_OFFLINE == "false")

**Goal:** Design the complete offline-first architecture including local database, sync engine, and conflict resolution.

**Instructions:**

1. If CONFIG.MOBILE_OFFLINE is "false" → skip to Step 5.8
2. Read `16-mobile-native-features/offline-first-patterns.md`
3. Generate:
   - `dev_docs/mobile/offline/offline-architecture.md` (4000+ words) — local database schema (every table), offline strategy per feature, storage budget management, cache invalidation
   - `dev_docs/mobile/offline/sync-engine.md` (3000+ words) — complete sync protocol (push/pull), retry logic, conflict detection, per-data-type sync rules
   - `dev_docs/mobile/offline/conflict-resolution.md` (2000+ words) — conflict resolution strategies per data type, UI for manual resolution, merge algorithms

Update STATE BLOCK: add "5.7-mobile-offline" to COMPLETED.

---

## Step 5.8: Mobile Screen & Component Inventory (skip if CONFIG.MOBILE_FULL_PARITY == "false")

**Goal:** Generate the full mobile screen inventory with parity to web screens, plus component library spec.

**Instructions:**

1. Read templates from `15-mobile-ui-design/`
2. For EVERY service in CONFIG.MVP_SERVICES, identify mobile screens:
   - If web-mobile parity is desired: mirror ALL web screen specs for mobile
   - For each mobile screen: route, components needed, states, interactions, offline behavior, tablet vs phone layout differences
3. Generate:
   - Per-service mobile screen spec files at `dev_docs/mobile/screens/{service}/`
   - `dev_docs/mobile/component-library.md` — every mobile component with: name, props, variants, accessibility requirements, platform differences (iOS/Android)
   - `dev_docs/mobile/navigation-map.md` — complete navigation tree, deep linking routes, tab bar badges, drawer structure
   - `dev_docs/mobile/user-flows.md` — step-by-step flows for every major mobile workflow
4. Apply anti-slop rules from `15-mobile-ui-design/anti-slop-rules.md`

Update STATE BLOCK: add "5.8-mobile-screens" to COMPLETED.

---

## Step 5.9: Mobile Testing, Deployment & Security (skip if CONFIG.MOBILE_FULL_PARITY == "false")

**Goal:** Generate mobile-specific testing, deployment, and security documentation.

**Instructions:**

1. Read templates from `17-mobile-deployment/`
2. Generate:
   - `dev_docs/mobile/testing-strategy.md` — unit + integration + E2E + performance testing strategy, device matrix, CI configuration
   - `dev_docs/mobile/deployment-guide.md` — build profiles (dev/staging/prod), release process, OTA updates, store submission checklists
   - `dev_docs/mobile/security.md` — mobile-specific security (certificate pinning, encrypted storage, auth token handling, biometric gating)
   - `dev_docs/mobile/performance-guide.md` — performance budgets (startup time, memory, bundle size), profiling tools, optimization checklist
   - `dev_docs/mobile/accessibility-guide.md` — VoiceOver/TalkBack support, Dynamic Type, domain-specific accessibility needs
3. If CONFIG.AUDIT_REQUIREMENTS includes HIPAA: add HIPAA mobile compliance section to security doc

Update STATE BLOCK: add "5.9-mobile-testing-deploy" to COMPLETED.

---

## Step 6: Screen Specs & Catalog

**Goal:** Create screen specifications for all screens in the MVP.

**Instructions:**

1. Read `10-generators/SCREEN-CATALOG-GENERATOR.md`
2. Read `10-generators/DEPTH-REQUIREMENTS.md` — internalize screen depth prompts and elevated thresholds
3. For each service, identify all screens needed (from tribunal research + service specs + intake Phase 3 screen inventory)

4. **Generate screen specs ONE AT A TIME.** For each screen:

   a. **TTG Reasoning (mandatory — see Autopilot Principles above):**
      Complete the Think-Then-Generate protocol for this screen. Answer all 6 TTG screen questions in the conversation.

   b. **Depth Prompting (mandatory):** Before writing the spec, answer these in the conversation:

      **UX Narrative:**
      > "A user lands on [SCREEN] for the first time. What's the first thing their eye goes to? What's the primary action? What's the most common SECOND action? Now imagine their 100th visit — what makes this screen efficient for daily use?"

      **State Exhaustion:**
      > "List EVERY state [SCREEN] can be in: loading, error, empty, filtered-empty, searching, editing, confirming-delete, bulk-selecting, offline, session-expired, permission-denied, data-stale, loading-more, saving, validation-error, success-feedback..."

      **Frustration Check:**
      > "What would make a user say 'this is annoying'? Too many clicks to common actions? No keyboard shortcuts? No bulk operations? Lost scroll position after actions? Slow search? No undo? Hidden features? Poor empty states? No inline editing? No drag-and-drop where expected?"

   - **Design skill:** For complex screens (dashboards, multi-panel layouts, data-heavy tables), invoke `/frontend-design` to generate production-grade component designs before writing the spec. This prevents generic AI design patterns.

   c. **Generate the screen spec** using the 15-section template, informed by TTG and depth reasoning.
      - **MANDATORY 4-STATE FLOOR:** Every screen spec MUST explicitly define at minimum: (1) **loading** state (skeleton layout, not spinner), (2) **error** state (error message with retry), (3) **empty** state (helpful CTA, not "No data"), (4) **data-present** state (populated view). These 4 are individually required and non-negotiable. The 6-state minimum threshold remains as the floor for total states.
      - **Primitive Mapping:** Include a "Component Implementation" section mapping each domain component to its UI library primitive(s). Reference `07-ui-design-system/component-primitive-mapping.template.md` for the mapping format.
      - **Accessibility:** Fill in Section 12 for each screen — keyboard navigation, screen reader support, visual requirements, and screen-specific a11y notes. Reference `08-quality-testing/accessible-interaction-patterns.md` for complex widgets (data tables, drag-and-drop, comboboxes, tabs).

   d. **Present to user** with a depth score card. Wait for feedback before generating the next screen.

5. Create master screen catalog at `dev_docs/specs/screen-catalog.md`

6. **DEPTH VERIFICATION** — For each generated screen spec:
   a. Count total words. If < 800, flag as SHALLOW.
   b. Count listed states. If < 6, flag as INCOMPLETE. Additionally, verify that loading, error, empty, and data-present states are each **explicitly described** (not just listed). If any of the 4 mandatory states is missing or only named without description, the screen spec FAILS regardless of total state count.
   c. Count interactions (user action + system response). If < 5, flag as SHALLOW.
   d. Check that every form field has validation rules defined.
   e. Check that accessibility section has keyboard navigation notes.
   f. Check that at least 5 edge cases are listed.
   g. Check that component tree has >= 5 components.
   h. **Qualitative check:** Does the spec address power user efficiency (keyboard shortcuts, bulk ops)? Does it address first-time user onboarding (empty states, tooltips, smart defaults)?

   If ANY screen spec is flagged:
   - Present the depth score card per screen
   - Re-generate shallow sections
   - Do NOT proceed to Step 6.5 until all screen specs score >= 7/10 quantitative AND >= 1/2 qualitative

Update STATE BLOCK: `CURRENT_STEP: 6.5`, add "6-screens" to COMPLETED.

---

## Step 6.5: Screen Completeness Verification

**Goal:** Cross-reference all screen specs against the service completeness matrix to verify no screens are missing.

**Instructions:**

1. Read `dev_docs/completeness/service-matrix.md` (from Step 4.5)
2. Read `dev_docs/specs/screen-catalog.md` (from Step 6)
3. Read all service hub files from `dev_docs/services/`

4. Build the SCREEN COMPLETENESS MATRIX:

   For EVERY feature in the service matrix, verify it has at least one screen:

   | Service | Feature | Required Screens | Screens Generated | Gap |
   |---|---|---|---|---|
   | Auth | User registration | Register form, Email verify | Register form, Email verify | None |
   | Auth | Password reset | Reset request, New password | Reset request | Missing: New password screen |

5. Build the SCREEN-TO-API COVERAGE:

   For every screen, verify it has corresponding API endpoints:

   | Screen | Required APIs | APIs Exist | Gap |
   |---|---|---|---|
   | Load List | GET /loads, GET /loads/stats | Both exist | None |
   | Load Create | POST /loads | Does not exist | Missing: POST /loads |

6. VALIDATION RULES (fail the gate if any are true):
   - Any feature with 0 screens (feature has no UI representation)
   - Any service with 0 screens (service is invisible to users)
   - Screen count < 3 per service on average (likely too shallow)

7. Generate `dev_docs/completeness/screen-matrix.md`

8. Present summary:
   ```
   SCREEN COMPLETENESS:
     Services: {N}
     Total screens: {S}
     Screens per service (avg): {S/N}
     Features with screens: {F}/{TOTAL_F} ({percentage}%)
     API gaps: {A} endpoints needed but not planned
   ```

- **Enforcement Gate 7 (Screen User-Completeness):** For each screen spec, verify the user-completeness checklist from `08-quality-testing/enforcement/screen-user-completeness.template.md`. Every screen must pass: user can accomplish goal, all data shown, undo available, clear CTA, guided empty state, actionable errors, findable via navigation, keyboard accessible. Generate `dev_docs/completeness/screen-user-completeness-audit.md` with per-screen pass/fail.

- **Enforcement Gate 11 (Persona-Screen Completeness):** For each persona, trace their daily workflow from login to logout. Map every step to a screen. Verify the screen exists and passes Gate 7. Complete the persona-screen-completeness template from `08-quality-testing/enforcement/persona-screen-completeness.template.md`. If ANY persona has a gap in their primary workflow, create the missing screen spec before proceeding. Generate `dev_docs/completeness/persona-screen-completeness-audit.md`.

**GATE: Every feature has at least one screen. Every persona can complete their daily workflow without hitting a missing screen. User reviews and confirms.**

Update STATE BLOCK: `CURRENT_STEP: 6.7`, add "6.5-screen-completeness" to COMPLETED.

---

## Step 6.7: Responsive Design Specification

**Goal:** Define how every component and screen behaves across breakpoints — preventing "it works on desktop" problems.

**Instructions:**

1. Read `07-ui-design-system/responsive-design-spec.template.md`
2. Define the project's breakpoint tiers (default: 375px / 768px / 1024px / 1440px)
3. Fill in the Component Behavior Matrix for EVERY component type in the design system
4. For the 5-10 most complex screens, write screen-specific responsive breakdowns
5. If the project has industry-specific responsive considerations (gloved hands, outdoor use, POS, vehicle-mounted), document them
6. Generate the Responsive Testing Matrix covering ALL screens from the screen catalog
7. Output: `dev_docs/foundations/responsive-design-spec.md`
8. Complete the responsive design spec checklist from `08-quality-testing/enforcement/responsive-design-spec-checklist.template.md`

- **Enforcement Gate 3 (Enhanced):** The responsive design spec must exist and be complete before Gate 3 can pass during development. Screenshots alone are not sufficient — the spec showing intentional per-component responsive behavior is required.

**Depth requirement:** ≥2000 words, must cover ALL screen types in the catalog, must include a testing matrix.

Update STATE BLOCK: `CURRENT_STEP: 6.8`, add "6.7-responsive-spec" to COMPLETED.

---

## Step 6.8: Workflow End-to-End Trace

**Goal:** Trace every major workflow end-to-end through the system: step → screen → API endpoint → data change → next step.

**Instructions:**

1. Read `10-generators/WORKFLOW-E2E-TRACE-GENERATOR.md`
2. Identify ALL workflows in the system (typically 15-30):
   - Core business workflows (8-12)
   - Administrative workflows (3-5)
   - Edge case workflows (3-5)
3. Trace each workflow step-by-step using the template from `03-documentation/spec-layer/workflow-e2e-trace.template.md`:
   - For each step: user action → screen → API call → data change → next step
   - Document error branches at every step
   - Document abandonment behavior (what happens to partial data)
4. Cross-reference verification:
   - Every screen referenced must exist in the screen catalog
   - Every API call must exist in the service specs (or will be added to API contracts in Step 10)
   - Every data change must map to a database entity
   - Flag broken chains (service A outputs X, but service B doesn't accept X)
5. Output: `dev_docs/completeness/workflow-e2e-traces.md`

**Depth requirement:** ≥15 workflows traced, each with ≥5 steps, each step mapped to screen + API + error branch.

Update STATE BLOCK: `CURRENT_STEP: 6.9`, add "6.8-workflow-traces" to COMPLETED.

---

## Step 6.9: User Journey Mapping

**Goal:** Map each persona's journey through 5 lifecycle phases — from first-time setup to mastery and error recovery.

**Instructions:**

1. Read `03-documentation/spec-layer/user-journey-map.template.md`
2. For EACH persona defined in the tribunal/intake (minimum 5 personas):
   - **Phase 1: First-Time Setup** — account creation → profile → first login → onboarding tour
   - **Phase 2: Learning (Week 1)** — first real task, first mistake, first success, exploring
   - **Phase 3: Competency (Week 2-4)** — keyboard shortcuts, saved views, bulk operations, customization
   - **Phase 4: Mastery (Month 2+)** — custom dashboards, automation, reporting, teaching others
   - **Phase 5: Error Recovery** — undo, drafts, retry, back navigation, session expiry
3. For each phase: document touchpoints, screens used, emotions, pain points, and opportunities
4. Define onboarding tour content per persona (3-5 key features to highlight on first login)
5. Define empty state strategy for each persona's first view
6. Define "What's New" mechanism for returning users
7. Cross-reference every screen referenced against the screen catalog — flag gaps
8. Output: `dev_docs/completeness/user-journey-maps/` (one file per persona)

**Depth requirement:** ≥5 personas mapped through all 5 phases, each phase with ≥3 specific interaction descriptions.

Update STATE BLOCK: `CURRENT_STEP: 7`, add "6.9-user-journeys" to COMPLETED.

---

## Step 7: Codebase Audit (skip if greenfield)

**Goal:** Audit existing code and generate quality reports.

> **Path note — Enhance:** If running the **Enhance Path**, skip Step 7 entirely. Steps E1-E4 (see below) replace it with a far deeper 6-dimension audit. Proceed to Step E1.
> **Path note — Repurpose:** If running the **Repurpose Path**, skip Step 7 entirely. The Repurpose intake and R1-R4 steps handle source app understanding. Proceed to Step R1.

**Instructions (Standard / Migration / Library/CLI paths only):**

1. If CONFIG says greenfield project → skip to Step 8
2. Read `10-generators/AUDIT-GENERATOR.md`
3. Scan the codebase and generate audit reports in `dev_docs/audit/`:
   - One report per service area (grading, bug inventory, recommendations)
   - Overall code quality report
4. Read `10-generators/COMPONENT-CATALOGER.md`
5. Catalog all existing components → `dev_docs/components/_index.md`
6. Read `10-generators/DATABASE-DOC-GENERATOR.md`
7. Generate database schema documentation → `dev_docs/specs/database/schema-documentation.md`

- **Enforcement Gate 14 (Dead UI Sweep):** For existing codebases (not greenfield), run `bash scripts/dead-ui-sweep.sh` to scan for ghost routes, stub buttons, "Coming Soon" elements, and dead feature domains. Complete the dead UI sweep checklist from `08-quality-testing/enforcement/dead-ui-sweep.template.md`. Store results at `dev_docs/audit/dead-ui-sweep-report.md`. Zero unresolved dead UI items required before proceeding.

Update STATE BLOCK: `CURRENT_STEP: 8`, add "7-audit" to COMPLETED.

---

## Steps E1-E4: Enhance Audit Sequence (Enhance Path Only)

> **When to run:** Only on the Enhance Path. These steps replace Step 7 and must all complete before Step 2 (AI Config) runs. Skip this entire section on all other paths.

### Step E1: Deep App Audit

**Goal:** Perform a comprehensive 6-dimension audit of the existing application.

**Instructions:**

1. Read `37-enhance/DEEP-AUDIT-GENERATOR.md` fully before beginning.
2. Run all 6 audit dimensions sequentially — each produces one output file:
   - **E1-A Architecture & Code Quality** → `dev_docs/audit/enhance-audit-architecture.md`
   - **E1-B UX & Screen Coverage** → `dev_docs/audit/enhance-audit-ux.md`
   - **E1-C Performance & Scalability** → `dev_docs/audit/enhance-audit-performance.md`
   - **E1-D Security & Compliance** → `dev_docs/audit/enhance-audit-security.md`
   - **E1-E Testing Coverage** → `dev_docs/audit/enhance-audit-testing.md`
   - **E1-F Documentation & Ops** → `dev_docs/audit/enhance-audit-docs.md`
3. Each dimension runs 3 rounds (surface scan → deep dive → recommendations). Do not skip rounds.
4. Gate: All 6 dimension reports must exist before proceeding to Step E2.

Update STATE BLOCK: `CURRENT_STEP: E2`, add "E1-deep-audit" to COMPLETED.

---

### Step E2: Quality Scorecard

**Goal:** Aggregate dimension scores into a composite scorecard and identify critical blockers.

**Instructions:**

1. Read `37-enhance/QUALITY-SCORECARD.md` fully.
2. Extract scores from all 6 dimension audit reports.
3. Apply weighted composite formula (Architecture 25%, Security 25%, Testing 20%, UX 15%, Performance 10%, Docs 5%).
4. Identify the top 3 critical blockers (P0/P1 findings from dimensions scoring ≤4).
5. Write → `dev_docs/audit/quality-scorecard.md`

Announce: *"Quality Scorecard complete. Composite score: {X}/10. {N} critical blockers identified."*

Update STATE BLOCK: `CURRENT_STEP: E3`, add "E2-quality-scorecard" to COMPLETED.

---

### Step E3: Gap Analyzer

**Goal:** Identify what is entirely absent from the app vs. kit standards across 6 gap dimensions.

**Instructions:**

1. Read `37-enhance/GAP-ANALYZER.md` fully.
2. Analyze 6 gap dimensions:
   - Services & Backend
   - Screens & User Flows
   - Task & Backlog Coverage
   - Infrastructure & DevOps
   - Testing Gaps
   - Documentation Gaps
3. Rate each gap: Critical / High / Medium.
4. Write → `dev_docs/audit/gap-analysis.md`

Announce: *"{N} total gaps: {N} critical, {N} high, {N} medium."*

Update STATE BLOCK: `CURRENT_STEP: E4`, add "E3-gap-analysis" to COMPLETED.

---

### Step E4: Enhancement Backlog

**Goal:** Convert all audit findings and gaps into a prioritized, tiered enhancement backlog.

**Instructions:**

1. Read `37-enhance/ENHANCEMENT-BACKLOG.md` fully.
2. Complete the TTG protocol before writing.
3. Score each item (Impact + Risk + Effort) and assign to a tier.
4. Write backlog with 3 tiers — Tier 1 (blockers/quick wins), Tier 2 (core enhancements), Tier 3 (depth & polish).
5. Include dependency map and parallel work streams.
6. Write → `dev_docs/enhancement-backlog.md`

Announce: *"Enhancement Backlog complete. {N} items: {N} Tier 1, {N} Tier 2, {N} Tier 3. Estimated effort: {X} weeks."*

After E4 completes → proceed to **Step 2 (AI Config)**, then run Steps 5-16 using `37-enhance/ENHANCE-PLAN-OVERLAY.md` as the guide for each step's existing-codebase adaptations.

Update STATE BLOCK: `CURRENT_STEP: 2`, add "E4-enhancement-backlog" to COMPLETED.

---

## Steps R1-R4: Repurpose Sequence (Repurpose Path Only)

> **When to run:** Only on the Repurpose Path. These steps run immediately after Repurpose Intake (Step 1-R). Skip this entire section on all other paths.

### Step R1: Pivot Depth Detector

**Goal:** Score the pivot across 5 dimensions and classify it as Shallow, Medium, or Deep. This is a hard gate — do not proceed until the classification is written.

**Instructions:**

1. Read `38-repurpose/PIVOT-DEPTH-DETECTOR.md` fully.
2. Score each of the 5 dimensions (0-2 each, max 10):
   - Workflow Similarity
   - Data Model Delta
   - Feature Change Ratio
   - Compliance Requirements
   - UX & Terminology Delta
3. Build the Feature Classification Table (Carry Over / Adapt / Replace / Deprecate / New).
4. Write → `dev_docs/repurpose/pivot-depth-score.md`

Announce: *"Pivot classified as {Shallow/Medium/Deep} ({N}/10). Routing to {Shallow/Medium/Deep} track."*

Update STATE BLOCK: `CURRENT_STEP: R2`, add "R1-pivot-depth" to COMPLETED.

---

### Step R2: Feature Inheritance Map

**Goal:** Classify every source app feature's status in the new vertical and define the shared core boundary.

**Instructions:**

1. Read `38-repurpose/FEATURE-INHERITANCE-MAP.md` fully.
2. Complete TTG protocol before writing.
3. Enumerate all major features from the source app.
4. Classify each: Carry Over / Adapt / Replace / Deprecate / New.
5. Define the shared core boundary (what lives in shared packages vs. vertical-specific packages).
6. Estimate effort for all non-Carry-Over items.
7. Write → `dev_docs/repurpose/feature-inheritance-map.md`

Update STATE BLOCK: `CURRENT_STEP: R3`, add "R2-feature-inheritance-map" to COMPLETED.

---

### Step R3: Market Fit Analyzer

**Goal:** Analyze how the source app maps to the target vertical's market, buyers, compliance, and competitive landscape.

**Instructions:**

1. Read `38-repurpose/MARKET-FIT-ANALYZER.md` fully.
2. Complete TTG protocol before writing.
3. Analyze 5 modules:
   - Buyer Persona Delta
   - Terminology Map
   - Compliance Deep Dive
   - Competitive Landscape
   - Pricing & Distribution Delta
4. Write → `dev_docs/repurpose/market-fit-analysis.md`

Update STATE BLOCK: `CURRENT_STEP: R4`, add "R3-market-fit" to COMPLETED.

---

### Step R4: Vertical Differentiation Plan

**Goal:** Generate the concrete plan for adapting the source app to the target vertical. Scope is determined by pivot depth classification.

**Instructions:**

1. Read `38-repurpose/VERTICAL-DIFFERENTIATION-PLAN.md` fully.
2. Complete TTG protocol before writing.
3. Generate the plan appropriate to the pivot depth:
   - **Shallow**: Config layer architecture + branding checklist + copy update map + implementation checklist
   - **Medium**: All Shallow content + data model extensions + new screens + new integrations + phased implementation order
   - **Deep**: Fork summary + forking strategy + infrastructure decisions + phased plan summary → then route to FORK-ARCHITECTURE
4. Write → `dev_docs/repurpose/vertical-differentiation-plan.md`

**Routing after R4:**

- **Shallow pivot** → Proceed directly to Steps 29-33 (Hardening)
- **Medium pivot** → Proceed to Steps 5 (Services, adapted), 6 (Screens, adapted), 8 (Tasks with inheritance flags), then Steps 29-33
- **Deep pivot** → Proceed to Step R4-FORK below, then Steps 5-16 (full planning for new vertical product), then Steps 29-33

Update STATE BLOCK: `CURRENT_STEP: {next per routing}`, add "R4-differentiation-plan" to COMPLETED.

---

### Step R4-FORK: Fork Architecture (Deep Pivots Only)

**Goal:** Define the monorepo structure, code sharing boundaries, and infrastructure strategy for a Deep pivot.

**Instructions:**

1. Read `38-repurpose/FORK-ARCHITECTURE.md` fully.
2. Make 6 architecture decisions (document each):
   - Repository structure (Option A monorepo / B separate repos / C feature-flagged)
   - Shared core boundary (what is and is not in shared packages)
   - Database strategy (shared / separate schemas / separate databases / hybrid)
   - Shared infrastructure (per-component decision table)
   - Shared interface contracts (TypeScript types/interfaces)
   - Development workflow (branch strategy, PR requirements, deployment separation)
3. Write extraction plan (how to get from current codebase to fork structure).
4. Write → `dev_docs/repurpose/fork-architecture.md`

After R4-FORK → proceed to Steps 5-16 running the **full kit planning sequence for the new vertical product**. Use the Feature Inheritance Map to pre-populate service specs and screen specs with Carry Over / Adapt / Replace / New classifications.

Update STATE BLOCK: `CURRENT_STEP: 5`, add "R4-fork-architecture" to COMPLETED.

---

## Step 7.1: Audit & Component Directory Init

**Goal:** Ensure `dev_docs/audit/` and `dev_docs/components/` are populated even when Step 7 (codebase audit) is skipped.

**Instructions:**

1. If Step 7 ran (existing codebase): verify `dev_docs/audit/` has audit reports. If yes → skip to Step 8.
2. If Step 7 was skipped (greenfield):
   a. Generate `dev_docs/audit/greenfield-baseline.md` — documents that no existing code was audited, links to quality gates (Step 16.1-16.3) that will establish baselines once coding begins
   b. Generate `dev_docs/components/component-catalog-init.md` — placeholder component catalog noting it will be populated from screen specs after Step 6

Update STATE BLOCK: add "7.1-directory-init" to COMPLETED.

---

## Step 8: Task Generation

**Goal:** Create bite-size task files organized by phase.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/planning-profile.md` — think as a project manager. Detail-oriented, dependency-aware, realistic scope.

**Instructions:**

1. Read `10-generators/PHASE-GENERATOR.md`
2. Read `10-generators/DEPTH-REQUIREMENTS.md` — internalize task depth prompts and elevated thresholds
2a. Read `04-phase-planning/pre-task-reading-lists.md` — defines the **universal reading list** (4 global paths every task needs) plus type-specific reading lists (backend / frontend / database / integration / E2E / mobile / domain-specific). **Every task file's Context Header MUST be prepended with the universal paths + the appropriate type-specific paths.** Minimum 8 specific file paths per task context header. This is the #1 mechanism that prevents agents from reinventing existing patterns during implementation.
3. Using tribunal output + audit results + service specs:
   - Define phases (Phase 0: bugs/fixes, Phase 1: core features, Phase 2: advanced)

4. **Generate task files ONE AT A TIME per feature.** For each feature:

   a. **TTG Reasoning (mandatory — see Autopilot Principles above):**
      Complete the Think-Then-Generate protocol for this task. Answer all 5 TTG task questions in the conversation.

   b. **Depth Prompting (mandatory):** Before writing the task file, answer:

      **Outcome Visualization:**
      > "When this task is DONE, what exactly does the user see? Not 'billing module works' — describe the exact screen, the exact interaction, the exact data displayed. If you can't describe it, the task isn't specific enough."

      **Implementation Path:**
      > "What files are created or modified? What existing patterns does this follow? Link to specific reference files. What is the testing strategy — unit, integration, E2E?"

   c. **Generate the task file** in `dev_docs/tasks/{phase}/`
      - Each task file uses the task template (context header, objective, file plan, acceptance criteria, dependencies)
      - **IMPORTANT:** Every service from the service completeness matrix (Step 4.5) must have tasks. Every feature must have task coverage across at least 6 of 8 layers: validator, tests, DB procedure, procedure tests, component, page, E2E, docs

5. Read `10-generators/DEPENDENCY-GRAPHER.md`
6. Build the task dependency graph → identify critical path

**Depth verification (do NOT skip):**

7. For each feature in the service matrix, verify task coverage:
   - Count task layers per feature (target: ≥6 of 8 layers)
   - Verify total words per task (minimum 350)
   - Verify acceptance criteria per task (minimum 5, each must be testable — not "works correctly")
   - Verify each task has a context header with ≥8 specific file paths: universal reading list (4 global paths from `04-phase-planning/pre-task-reading-lists.md`) + type-specific paths (4-6 more). No generic "read the relevant files" — every path must be explicit
   - Verify each task has a file plan with specific paths (not generic)
   - Verify each task has >= 4 sub-tasks
   - **Path verification:** Run `bash scripts/verify-context-paths.sh` to verify every "Context Files" path in task files exists on disk. If paths reference not-yet-created files, add a prerequisite task: "Scaffold codebase structure." If running on a greenfield project, this is expected — ensure scaffold tasks exist.
   - **Qualitative check:** Does each acceptance criterion describe a specific, observable outcome? Would a QA engineer know exactly what to test?
8. If any feature has <6 layers, generate additional task files for missing layers
9. If any task has <5 acceptance criteria or <350 words, expand it before proceeding

Update STATE BLOCK: `CURRENT_STEP: 8.5`, add "8-tasks" to COMPLETED.

---

## Step 8.1: Component Catalog

**Goal:** Populate `dev_docs/components/` with a component catalog derived from all screen specs.

**Instructions:**

1. Read all screen specs from `dev_docs/specs/screens/`
2. Extract every component referenced across all screen specs
3. Generate `dev_docs/components/component-catalog.md`:
   - Component name, source screen(s), status (planned), props summary, variant count
   - Group by category: layout, navigation, forms, data display, feedback, overlays
4. If design system (Step 13) already ran, cross-reference against design system components
5. Generate `dev_docs/components/component-primitive-mapping.md` from `03-documentation/spec-layer/component-mapping.template.md` — map each domain component to its service, screen(s), and planned UI primitive(s)
6. **Component API Contracts:** Identify the 10-15 most complex components (those appearing in 3+ screens, or with 8+ props, or containing internal state). For each, generate a component contract using `03-documentation/spec-layer/contracts/component-contract.template.md`. Save to `dev_docs/components/contracts/`. Each contract must define: TypeScript props interface, callback signatures, internal state, layout diagram, responsive behavior at 3 breakpoints, and accessibility requirements.

Update STATE BLOCK: add "8.1-component-catalog" to COMPLETED.

---

## Step 8.2: Architecture Decision Log

**Goal:** Populate `dev_docs/decisions/` with all architecture decisions made during Steps 1-8.

**Instructions:**

1. Read `dev_docs/session-context.md` for all recorded decisions
2. Generate `dev_docs/decisions/decision-log.md` with one ADR per major decision:
   - Tech stack selection (frontend, backend, database, ORM)
   - Auth strategy
   - Mobile framework (if applicable)
   - Hosting/deployment platform
   - Key architectural patterns (monorepo, microservices, etc.)
   - Any decisions from tribunal deliberation
3. Format: Decision title, date, status (accepted), context, decision, consequences
4. Target: 10-15 ADRs minimum
4. Also generate `dev_docs/decisions/decision-journal.md` from `03-documentation/state-files/decision-journal.template.md`:
   - Pre-populate with all non-architectural decisions made during intake and tribunal
   - Include scope decisions, pricing decisions, timeline decisions, vendor choices
   - This supplements the ADR-format decision-log.md — the journal captures lightweight decisions

Update STATE BLOCK: add "8.2-decisions" to COMPLETED.

---

## Step 8.3: Sprint Plan Init

**Goal:** Populate `dev_docs/sprints/` with initial sprint plans derived from STATUS.md.

**Instructions:**

1. Read `dev_docs/STATUS.md` (populated in Step 9 — if Step 9 hasn't run yet, skip this step and it will be retroactively populated during Step 16.7)
2. For Sprint 1 and Sprint 2, generate `dev_docs/sprints/sprint-{N}.md`:
   - Sprint goal
   - Task list (pulled from STATUS.md Phase 0/Phase 1 tasks)
   - Dependencies between tasks
   - Deliverables and exit criteria
   - Risk flags
3. Remaining sprints get placeholder files noting they will be detailed during sprint planning ceremonies (Step 18.5)

Update STATE BLOCK: add "8.3-sprint-plans" to COMPLETED.

---

## Step 8.4: Catalog Generation

**Goal:** Consolidate cross-cutting concerns from all service specs into unified catalogs — notifications, permissions, events, errors, and integration health.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read all service specs from `dev_docs/specs/services/`
2. Read all service hub files from `dev_docs/services/`
3. Generate the following catalogs in `dev_docs/specs/catalogs/`:

   a. **notification-catalog.md** — Read `03-documentation/spec-layer/catalogs/notification-catalog.template.md`. Extract every notification trigger from all service specs. Consolidate into a single registry. Target: 80-120 notifications.

   b. **permission-catalog.md** — Read `03-documentation/spec-layer/catalogs/permission-catalog.template.md`. Extract every role × operation from all service spec auth matrices. Consolidate into a single permission registry. Target: 50-80 permissions.

   c. **event-catalog.md** — Read `03-documentation/spec-layer/catalogs/event-catalog.template.md`. Enumerate every system event across all services — analytics events, audit log events, HIPAA events. Target: 150-250 events.

   d. **error-catalog.md** — Read `03-documentation/spec-layer/catalogs/error-catalog.template.md`. Extract every error scenario from all service specs. Assign standardized error codes. Target: 100-150 error codes.

   e. **integration-health-catalog.md** — Read `03-documentation/spec-layer/catalogs/integration-health-catalog.template.md`. For each integration in CONFIG.MVP_INTEGRATIONS, define health check, fallback, and alert severity.

   f. **Business Rule Reference Tables** — For each service spec that references domain-specific rule sets (regulatory requirements, industry standards, compliance checklists, classification systems), generate a standalone reference table using `03-documentation/spec-layer/catalogs/business-rule-reference.template.md`. Save to `dev_docs/specs/catalogs/business-rules/`. Each table must enumerate EVERY individual rule (no "etc." or truncation), include database column mappings, TypeScript types, validation logic, and ≥10 test scenarios. Ask: "Could an AI agent implement this rule without consulting external documentation?" If NO, it needs a reference table.

4. Present catalog summary:
   ```
   CATALOGS GENERATED:
     Notifications: {N} entries
     Permissions: {N} entries
     Events: {N} entries
     Error codes: {N} entries
     Integration health checks: {N} entries
   ```

Update STATE BLOCK: add "8.4-catalogs" to COMPLETED.

---

## Step 8.45: UI State Matrix

**Goal:** Produce a cross-screen matrix showing which UI state pattern each screen uses for each possible state. Eliminates inconsistent state handling across screens.

**Instructions:**

1. Run the generator prompt from `10-generators/UI-STATE-MATRIX-GENERATOR.md`
2. Read all screen specs from `dev_docs/specs/screens/`
3. For each screen, extract its defined states and classify each by pattern type (skeleton, spinner, progressive, illustration+CTA, inline-banner, toast, etc.)
4. Generate `dev_docs/completeness/ui-state-matrix.md` containing:
   - Standard pattern catalog with reusable TSX/JSX implementations
   - Screen-by-screen matrix: rows = screens, columns = state patterns (loading, error, empty-first-time, empty-filtered, populated, editing, saving, offline, etc.)
   - Gap report flagging screens missing fundamental states or using inconsistent patterns
   - Mandatory rules for AI agents implementing UI states

**Gate:** Every screen in the screen catalog has all 4 fundamental states (loading, error, empty, populated) specified PLUS ≥2 context-specific states. Any screen below 6 total states must have its screen spec expanded before proceeding.

Update STATE BLOCK: add "8.45-ui-state-matrix" to COMPLETED.

---

## Step 8.5: Phase Coverage Verification

**Goal:** Cross-reference all task files against the service matrix and screen matrix to catch any gaps before building the dashboard.

**Instructions:**

1. Read ALL task files from `dev_docs/tasks/` across all phases
2. Cross-reference against:
   - Service completeness matrix (`dev_docs/completeness/service-matrix.md` from Step 4.5)
   - Screen completeness matrix (`dev_docs/completeness/screen-matrix.md` from Step 6.5)
3. Build **PHASE COVERAGE MATRIX** — one row per service:

   | Service | Features | Screens | Tasks | Phase 0 | Phase 1 | Phase 2 | Coverage % |
   |---------|----------|---------|-------|---------|---------|---------|------------|
   | {{SERVICE}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{PCT}} |

4. Build **TASK DEPTH TABLE** — one row per feature:

   | Feature | Validator | Tests | DB Proc | Proc Tests | Component | Page | E2E | Docs | Complete? |
   |---------|-----------|-------|---------|------------|-----------|------|-----|------|-----------|
   | {{FEATURE}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} |

5. Validation checks:
   - Every service has >0 tasks → if not, generate missing tasks
   - Every feature has at least 6/8 layers → if not, add missing layer tasks
   - Every P0 service has Phase 0 or Phase 1 tasks → if not, flag for assignment
   - No orphan tasks (tasks not linked to any service) → reassign or remove

6. **Gap Traceability Verification (mandatory):**
   a. Collect ALL gaps identified during the planning process:
      - Service gaps from Step 4.5 (service completeness matrix)
      - Screen gaps from Step 6.5 (screen completeness verification)
      - Phase coverage gaps from this step (8.5)
      - Feature gaps from tribunal (Step 3)
   b. For EVERY gap: verify it has been resolved (task created, feature deferred with user approval, or merged into another task)
   c. Generate `dev_docs/completeness/gap-traceability-matrix.md`:
      | Gap ID | Source | Description | Resolution | Task/File | Verified |
      |--------|--------|-------------|------------|-----------|----------|
   d. Coverage MUST be 100% — no gap may remain unresolved
   e. If any gap lacks a task assignment: generate additional task files for uncovered gaps, group related gaps into logical task files, and re-verify

7. **Enforcement Gate 6 (Workflow Completeness):** Generate `dev_docs/completeness/workflow-coverage-matrix.md` following `10-generators/WORKFLOW-COVERAGE-MATRIX.md`. Map every persona → their daily workflows → task coverage per workflow step. Verify happy path + error path + alternative path coverage. Any workflow step without a task = FAIL.

8. Generate `dev_docs/completeness/phase-coverage.md` with both matrices

**GATE: All services have tasks. All features have ≥6/8 layers. Gap traceability matrix shows 100% resolution. User reviews coverage report.**

Update STATE BLOCK: `CURRENT_STEP: 8.55`, add "8.5-phase-coverage" to COMPLETED.

---

## Step 8.55: Time-to-First-Use Ordering

**Goal:** Re-order phases so the user can start using parts of the system as early as possible, while respecting data dependencies.

**Why this step exists:** The default phase sequence (from Step 8) is ordered by data dependencies — technically correct, but it may delay the features the user needs most. This step optimizes for earliest usable value: the user should be able to start performing real workflows in the system while later phases are still being built.

**Instructions:**

1. **List every feature phase** (Phase 1 through N-2) with a one-line description of what daily workflow each phase enables. Use this format:

   ```
   TIME-TO-FIRST-USE ANALYSIS
   ===========================
   Phase 1: {phase name} → User can: {specific daily workflow}
     Replaces: {current manual process / spreadsheet / tool, or "new capability"}
     Depends on: {Phase 0 only / Phase 0 + Phase X}
     Standalone usable: Yes/No

   Phase 2: {phase name} → User can: {specific daily workflow}
     Replaces: {current process}
     Depends on: {phases}
     Standalone usable: Yes/No
   ...
   ```

2. **Identify independent phases** — phases with no data dependency on each other (they can be built in any order).

3. **Among independent phases, re-order by user value:**
   - Which phase replaces the user's most painful current process?
   - Which phase would the user open the app for every morning?
   - Tiebreaker: which phase lets the user stop using an external tool soonest?

4. **Present the Time-to-First-Use Timeline to the user:**

   ```
   TIME-TO-FIRST-USE TIMELINE
   ===========================
   After Phase 0 (~week 1):   Auth + shell → user can log in
   After Phase 1 (~week 2-3): {phase} → user can: {workflow} ← FIRST USABLE MILESTONE
   After Phase 2 (~week 3-5): {phase} → user can: {workflow}
   After Phase 3 (~week 5-7): {phase} → user can: {workflow}
   ...
   ```

5. **Ask the user:** "Which of these capabilities do you need soonest? I can re-order independent phases to get you using the system earlier."

6. **Re-order phases** based on the user's answer. Only move phases that are independent of each other — never break a data dependency. Update the phase index and task files to reflect the new order.

7. **Fill in the Usability Milestone fields** in each feature phase template:
   - `Usability Milestone:` what the user can now do daily
   - `Replaces:` what manual process this eliminates
   - `Standalone Usable:` Yes/No

**GATE: User approves the phase order and time-to-first-use timeline.**

Update STATE BLOCK: `CURRENT_STEP: 8.6`, add "8.55-time-to-first-use" to COMPLETED.

---

## Step 8.6: Cross-Reference Validator

**Goal:** Automatically verify that all planning documents are internally consistent — every reference resolves, every ID maps, every entity exists in all catalogs that reference it.

**Instructions:**

1. Read `10-generators/CROSS-REFERENCE-VALIDATOR.md` for the full validation spec
2. Run all 10 validation checks:
   - Service spec endpoints → API contract registry
   - Service spec screens → screen catalog
   - Service spec tables → database schema docs
   - Master-tracker task IDs → task files on disk
   - Gap traceability matrix → task assignments
   - Screen spec components → component catalog
   - Service spec permissions → permission catalog
   - Service spec notifications → notification catalog
   - Service spec errors → error catalog
   - Integrations → integration health catalog
   - AI context integrity: entity names match CONFIG (no invented services/screens), file paths reference real files, numeric claims are verifiable (Gate 1)
   - Dead UI prevention: every interactive element in screen specs has a corresponding task with acceptance criteria covering that interaction (Gate 5)
   - Phantom table check: every table/entity referenced in service specs, screen specs, task files, or API contracts exists in the database schema documentation (Gate 13). See `08-quality-testing/enforcement/phantom-table-check.template.md`.
3. Generate `dev_docs/completeness/consistency-audit.md`:
   - Pass/fail per check
   - Specific mismatches listed with file paths
   - Summary score: {PASSED}/{TOTAL} checks passed
4. If any check fails: fix the mismatch (add missing entries to the catalog or update the reference) before proceeding

**GATE: All 10 consistency checks pass. User reviews audit report.**

Update STATE BLOCK: `CURRENT_STEP: 9`, add "8.6-consistency-audit" to COMPLETED.

---

### SESSION BOUNDARY — SB-3: Post-Planning

This is a safe stopping point. Before proceeding:

1. **Update `dev_docs/session-context.md`:**
   - Fill/update Screen Architecture Summary with all screen specs
   - Add task counts, phase plan, and sprint structure
   - Record any scope changes from completeness verification
   - Append this session to Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (screen specs, task generation, completeness verification, catalog generation, cross-reference consistency audit)
   - Next step: Step 9 (Dashboard & Sprint Plan)
   - Any open questions or decisions needed
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-3 reached. Core design and planning are complete — including unified catalogs and consistency audit. You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

**Autopilot mode:** After persisting all state above, update `.kit/state.json`, then output `KIT_SESSION_BOUNDARY` on its own line and **STOP**. Do not proceed to Step 9. The `kit-autopilot.sh` script will restart you in a fresh session.

---

## Step 9: Dashboard & Sprint Plan

**Goal:** Populate STATUS.md with all tasks and sprint assignments.

**Instructions:**

1. Update `dev_docs/STATUS.md`:
   - Sprint calendar (weekly sprints for the full timeline)
   - Task tables organized by phase (ID, title, effort, status, assigned, dependencies)
   - Milestone checkpoints
   - Task claiming protocol

**GATE: Present the sprint plan to the user. Review task priorities and assignments.**

**COMMS TRIGGER:** After gate approval, generate sprint-planning stakeholder communications:

- Read `31-stakeholder-communications/phase-packs/03-sprint-planning/` templates
- Fill with real sprint goals, task breakdown, feature priorities, resource allocation
- Generate `dev_docs/comms/diagrams/overview-phased-roadmap.md` — populate with actual features by phase
- Generate `dev_docs/comms/diagrams/dependency-graph.md` — real feature dependencies
- Generate `dev_docs/comms/diagrams/roadmap-gantt.md` — real timeline with task data
- Write phase pack outputs to `dev_docs/comms/03-sprint-planning/`
- Generate interactive HTML mind map by following `31-stakeholder-communications/diagrams/INTERACTIVE-MINDMAP-GENERATOR.md`. Output: `dev_docs/comms/diagrams/interactive-mindmap.html`

Update STATE BLOCK: `CURRENT_STEP: 9.5`, add "9-dashboard" to COMPLETED.

---

## Step 9.5: Master Tracker (skip if CONFIG.MASTER_TRACKER == "false")

**Goal:** Generate the atomic-level project tracker — the single source of truth for all work at the subtask level. This is distinct from STATUS.md (which is a dashboard) — the master tracker is a detailed execution plan.

**Instructions:**

1. If CONFIG.MASTER_TRACKER is "false" → skip to Step 10
2. Read `03-documentation/state-files/master-tracker.template.md`
3. Read `dev_docs/STATUS.md` (Step 9 output) as the source of all tasks
4. Generate these files in `dev_docs/tracker/`:

   a. **master-tracker.md** (5000+ words):
      - For EVERY task in STATUS.md, expand into 5-15 subtasks
      - Each subtask: title, specific description, effort in hours, status (not-started), blocked-by, assigned-to (empty)
      - Target: 500+ subtasks for a typical 10-service project
      - Group by phase, then by service

   b. **dependency-map.md**:
      - Hard dependencies (must complete A before B)
      - Soft dependencies (easier if A is done, but not blocking)
      - Parallel opportunities (which tasks/subtasks can run simultaneously)
      - Critical path identification (longest chain of hard dependencies)

   c. **timeline.md** (5000+ words):
      - Week-by-week schedule for the full project timeline
      - Each week: active work streams, subtasks scheduled, hours allocated, milestones due, external blockers, external actions needed
      - Risk-adjusted dates: optimistic / expected / pessimistic for each milestone
      - Phase gate criteria (what must be true before entering next phase)

   d. **milestones.md**:
      - Every milestone with: name, target date, gate criteria (specific acceptance criteria)
      - Go/no-go decision criteria for each milestone
      - Stakeholder communication triggers

   e. **parallel-execution-guide.md**:
      - Work stream definitions (which services/features form a stream)
      - Conflict prevention rules (which files/schemas are shared)
      - Integration points (when parallel streams must sync)
      - Agent-based parallel execution instructions for Claude Code

   f. **progress-log.md**:
      - Pre-populated weekly log template (week number, dates, planned tasks, completed, blockers, decisions, next week)

5. Cross-reference against STATUS.md — every task in STATUS.md must appear in master-tracker.md. Flag any discrepancies.
6. Run `bash scripts/sync-status-tracker.sh` (or `node scripts/check-tracker.js`) to verify STATUS.md ↔ master-tracker consistency. **Zero discrepancies required.** Fix any mismatches before proceeding.

**GATE: Master tracker exists with 500+ subtasks. Timeline covers full project duration. Dependency map identifies critical path. STATUS.md ↔ master-tracker sync check passes.**

Update STATE BLOCK: add "9.5-master-tracker" to COMPLETED.

---

## Step 9.6: Session Protocol & Enforcement

**Goal:** Establish the mandatory session completion protocol that prevents state file decay across development sessions.

**Instructions:**

1. Read `03-documentation/state-files/session-completion-checklist.template.md` — the 6-step end-of-session checklist
2. Generate the project's Session Completion Checklist at `dev_docs/foundations/session-completion-checklist.md`:
   - Copy the template and fill in project-specific file paths
   - Define the project's **Golden Rule** — a single sentence that captures the project's north star (e.g., "Every EMS crew trusts this system with their patient's life")
   - Store the Golden Rule in `{{GOLDEN_RULE_STATEMENT}}`
3. Add the Session Completion Checklist to `CLAUDE.md` Section 5.5 (or create the section)
4. Generate `dev_docs/HANDOFF.md` from `03-documentation/state-files/handoff.template.md` — this is a living document updated every session
5. Verify `scripts/check-tracker.js` is accessible and runnable. Run it to verify current state file consistency.
6. Add Golden Rule #6 to the project's CLAUDE.md: "Always complete the Session Completion Checklist — every session, no exceptions."

- **Enforcement Gate 12 (Cross-Document Consistency):** Read `08-quality-testing/enforcement/cross-document-consistency.template.md`. Run the 6-point consistency check across all project documents. Entity names, service names, persona names, feature counts, API endpoints, and screen names must be consistent. Zero discrepancies. Generate `dev_docs/completeness/cross-document-consistency-audit.md`.

**GATE: Session protocol is established. Golden Rule is defined. Check-tracker passes. Cross-document consistency audit passes.**

Update STATE BLOCK: `CURRENT_STEP: 10`, add "9.6-session-protocol" to COMPLETED.

---

## Step 10: API Contract Registry

**Goal:** Create the screen-to-API contract registry.

**Instructions:**

1. Read `10-generators/API-CATALOG-GENERATOR.md`
2. For each screen in the catalog:
   - Map to required API endpoints
   - Define request/response contracts
   - Track status: DB, API, FE, INT, VER
3. Generate contract registry at `dev_docs/specs/contracts/screen-api-contract-registry.md`

4. **API CONTRACT COUNT VERIFICATION:**
   a. Count total endpoints in the contract registry programmatically
   b. Verify the header "Total Endpoints: N" matches the actual count
   c. Count endpoints per service section — verify each section header matches
   d. Cross-reference: every endpoint in a service spec must appear in the registry. Flag orphans in both directions (in spec but not registry, in registry but not spec)
   e. If any mismatch: fix immediately before proceeding

Update STATE BLOCK: `CURRENT_STEP: 10.5`, add "10-contracts" to COMPLETED.

---

## Step 10.5: Code Template Generator

**Goal:** Generate stack-specific code templates that developers can copy-paste as starting points for new files.

**Instructions:**

1. Read `03-documentation/spec-layer/code-templates.template.md`
2. Using CONFIG (framework, ORM, testing tools, auth strategy), generate templates at `dev_docs/templates/`:
   - Router/controller template (tRPC router, Express controller, etc.)
   - Database schema/model template (Drizzle, Prisma, etc.)
   - UI component template (React, Vue, etc.)
   - Page/screen template with data fetching
   - Unit test template
   - Integration test template
   - E2E test template
   - Migration template
   - Custom hook template
3. Each template must include:
   - Real import paths from the project structure
   - Multi-tenant isolation (if CONFIG.MULTI_TENANT == "true")
   - Audit logging (if CONFIG.AUDIT_REQUIREMENTS != "none")
   - Error handling following the error catalog patterns
4. Generate `dev_docs/templates/README.md` with usage instructions

Update STATE BLOCK: `CURRENT_STEP: 10.6`, add "10.5-code-templates" to COMPLETED.

---

## Step 10.6: API Mock Server (skip if CONFIG.MOCK_SERVER == "false")

**Goal:** Generate a mock API server from the API contract registry so frontend/mobile can develop in parallel with backend.

**Instructions:**

1. If CONFIG.MOCK_SERVER is "false" → skip to Step 11
2. Read `10-generators/MOCK-SERVER-GENERATOR.md`
3. Read the API contract registry from `dev_docs/specs/contracts/`
4. Read seed data plan from `dev_docs/specs/database/seed-data/` (if it exists)
5. Generate `dev_docs/mocks/`:
   - Mock server entry point (Express/tRPC)
   - Per-service fixture files with realistic response data
   - Error simulation support
   - README with run instructions (`pnpm dev:mock-api`)
6. The mock data should use seed data when available, otherwise generate realistic fake data

Update STATE BLOCK: `CURRENT_STEP: 10.7`, add "10.6-mock-server" to COMPLETED.

---

## Step 10.7: Disaster Recovery Planning

**Goal:** Surface disaster recovery thinking BEFORE infrastructure decisions are finalized. This is a draft — Step 18.6 will expand it into full playbooks.

**Instructions:**

1. Read `09-deployment-operations/dr-playbooks.template.md`
2. Identify the top 7 disaster scenarios for this project's architecture:
   - Database corruption / data loss
   - Hosting provider outage
   - Internet outage at client site (if applicable)
   - Application crash during critical workflow
   - Security breach / unauthorized access
   - Third-party API/vendor outage
   - Data migration failure (for new customer onboarding)
3. For each scenario, draft a 1-paragraph initial response plan at `dev_docs/operations/dr-plan-draft.md`
4. Flag any scenarios that require infrastructure decisions (e.g., multi-region deployment, offline mode) — these must be considered in Step 11 and Step 17

Update STATE BLOCK: `CURRENT_STEP: 11`, add "10.7-dr-planning" to COMPLETED.

---

## Step 11: Infrastructure Setup

**Goal:** Set up project infrastructure configs.

**Instructions:**

1. Resolve universal infrastructure templates from `05-dev-infrastructure/infrastructure-templates/`:
   - `.env.example` (documented env vars)
   - `.gitignore`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/ISSUE_TEMPLATE/` (bug report, feature request)

<!-- IF {{HAS_WEB}} == "true" -->
2. Web infrastructure:
   - `docker-compose.yml` (conditional services based on stack)
   - For JS/TS projects: `turbo.json`, `pnpm-workspace.yaml` (if monorepo), `tsconfig.json` variants, `eslint.config.mjs`, `.prettierrc`, `.lintstagedrc.json`, `.husky/pre-commit`
   - For Python projects: `pyproject.toml`, `requirements.txt`
   - For Ruby projects: `Gemfile`
   - For Go projects: `go.mod`
<!-- ENDIF -->

<!-- IF {{PROJECT_TYPE}} == "mobile" -->
2. Mobile-only infrastructure:
   - Read `05-dev-infrastructure/configs/mobile-configs.md` and configure:
     - `app.json` / `eas.json` (React Native) or `pubspec.yaml` (Flutter) or Xcode/Gradle configs (Native)
   - Mobile build pipeline setup (EAS Build / Codemagic / Fastlane / GitHub Actions)
   - Simulator/emulator environment verification
   - If the mobile app has a custom backend API: set up backend infrastructure as in the web path above
<!-- ENDIF -->

**GATE: Ask user to verify infrastructure works.**
<!-- IF {{HAS_WEB}} == "true" -->
Verify: `docker-compose up` succeeds, build passes.
<!-- ENDIF -->
<!-- IF {{PROJECT_TYPE}} == "mobile" -->
Verify: mobile build command succeeds, simulator/emulator launches.
<!-- ENDIF -->

Update STATE BLOCK: `CURRENT_STEP: 11.5`, add "11-infra" to COMPLETED.

---

## Step 11.5: Mobile Platform Setup (skip if no mobile)

**Goal:** Install mobile framework, verify simulator/emulator, get base app running.

**Instructions:**

1. If CONFIG.HAS_MOBILE is "false" → skip to Step 12
2. Read `14-mobile-platform/{{MOBILE_FRAMEWORK}}-project-structure.template.md`
3. If CONFIG.MONOREPO is "true": Read `14-mobile-platform/monorepo-integration.md` and configure

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
4. Scaffold React Native project:
   - Run `npx create-expo-app apps/mobile --template blank-typescript` (if Expo managed)
   - Configure Metro for monorepo: `metro.config.js` with `watchFolders` pointing to shared packages
   - Configure EAS: create `eas.json` with development, preview, and production build profiles
   - Add `apps/mobile` to `pnpm-workspace.yaml`
   - Add mobile tasks to `turbo.json` (dev:mobile, build:mobile, test:mobile)
   - Install shared packages: `pnpm --filter mobile add @{{PROJECT_SLUG}}/types @{{PROJECT_SLUG}}/validators`
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
4. Scaffold Flutter project:
   - Run `flutter create apps/mobile_flutter --org com.{{PROJECT_SLUG}}`
   - Configure shared API client (generate from OpenAPI spec or manual REST client)
   - Set up `pubspec.yaml` with required dependencies
<!-- ENDIF -->

<!-- IF {{MOBILE_FRAMEWORK}} == "native" -->
4. Scaffold native projects:
   - iOS: Create Xcode project at `apps/ios/` with Swift and SwiftUI
   - Android: Create Android Studio project at `apps/android/` with Kotlin and Jetpack Compose
   - Configure shared API client consumption pattern for both platforms
<!-- ENDIF -->

5. Verify build:
   - Run the framework's dev/build command and confirm no errors
   - Launch on iOS Simulator and/or Android Emulator
   - Confirm the base "hello world" app renders correctly
6. Set up mobile navigation skeleton (read `14-mobile-platform/navigation-patterns.md`)
7. Set up mobile design system foundation:
   - Read `15-mobile-ui-design/mobile-design-tokens.md` and `15-mobile-ui-design/platform-guidelines.md`
   - Read `15-mobile-ui-design/mobile-anti-slop.md` — mobile-specific anti-slop design rules
   - Read `15-mobile-ui-design/mobile-responsive-strategy.md` — adaptive layout patterns for phone/tablet
8. Copy mobile slash commands from `05-dev-infrastructure/commands/` to `.claude/commands/`

**GATE: Base mobile app runs on simulator/emulator. User confirms.**

Update STATE BLOCK: set `CURRENT_STEP: 11.6`, add "11.5-mobile-setup" to COMPLETED.

---

## Step 11.6: CI/CD Pipeline Design

**Goal:** Design the automated build → test → deploy pipeline architecture before writing workflow files.

**Instructions:**

1. Read `22-cicd-pipeline/ci-provider-decision-tree.md` and confirm CI provider (default: GitHub Actions)
2. Read `22-cicd-pipeline/pipeline-architecture.template.md` and resolve with CONFIG values:
   - Define pipeline stages: lint → type-check → unit-test → build → integration-test → e2e-test → deploy
   - Configure parallelization strategy and caching (node_modules, build artifacts)
   - Define triggers (push to main, PR, schedule) and branch-to-environment mapping
3. Read `22-cicd-pipeline/environment-promotion-strategy.md` and generate promotion rules (dev → staging → prod)
4. Read `22-cicd-pipeline/deployment-patterns.md` and select deployment pattern
5. Read `22-cicd-pipeline/pipeline-security.md` and configure secrets management + vulnerability scanning
6. Copy and resolve GitHub Actions templates from `22-cicd-pipeline/github-actions-templates/` → `.github/workflows/`
6.5. Read `05-dev-infrastructure/configs/husky-lint-staged.template.md` and set up pre-commit quality gates (Husky + lint-staged for JS/TS projects, pre-commit framework for Python/Go/Rust). Configure: lint on staged files, type-check on commit, format on save.
7. Read `22-cicd-pipeline/container-strategy-decision-tree.md` — set up Dockerfile if containerization needed
8. Read `22-cicd-pipeline/iac-decision-tree.md` — initialize IaC configuration if applicable

**GATE: Run a test build in CI to verify pipeline works.**

Update STATE BLOCK: set `CURRENT_STEP: 12`, add "11.6-cicd" to COMPLETED.

---

## Step 12: Testing Infrastructure

**Goal:** Set up test configs, utilities, mock patterns, and the project's testing strategy using the Testing Catalog.

**Instructions:**

1. Read the Testing Catalog at `08-quality-testing/testing-catalog/README.md` to understand all available test types
2. Run the **Test Selection Matrix** (`08-quality-testing/testing-catalog/test-selection-matrix.md`):
   - Answer the Feature Characteristics Checklist (C1-C15) for the project as a whole
   - Identify which test types apply to this project's stack and features
   - Document the project-level testing strategy in `dev_docs/foundations/testing-strategy.md`
3. Resolve testing templates from `08-quality-testing/test-configs/`:
   - Jest configs (frontend + backend, separate)
   - `jest-resolver.cjs` (SWC alias fix — copy static file)
   - Test setup files (polyfills, providers)
   - Test utilities (custom render with providers)
   - Mock patterns (hooks, navigation, auth, API handlers)
   - Playwright config (if E2E testing needed)
4. Set up accessibility testing:
   - Read `08-quality-testing/accessibility-testing-strategy.template.md` — integrate axe-core into Playwright E2E tests
   - Add `eslint-plugin-jsx-a11y` to ESLint config
   - Reference `08-quality-testing/accessible-interaction-patterns.md` for component-level patterns
5. Set up the **Enforcement System** (`08-quality-testing/enforcement/README.md`):
   - Configure proof artifact collection for the project
   - Integrate the Test Requirements Card template into the task generation workflow
   - Every feature task generated in Step 8 must include a Test Requirements Card
6. Create test directory structure
7. Verify: run test command to confirm setup works

Update STATE BLOCK: `CURRENT_STEP: 12.9`, add "12-testing" to COMPLETED.

---

## Step 12.9: Design Review Portal (Phase 0)

**Goal:** Set up the design review system, generate design variations, and conduct a structured review to establish the design direction BEFORE building the token foundation. This ensures design tokens are derived from reviewed, approved design work — not guesswork.

**When to run:** After screen specs exist (Steps 6-7) and before design token implementation (Step 13). Skip if the project has no web UI or if the user has already established a design direction.

**Instructions:**

1. **Generate design variations** (if not already done):
   - For each key screen type identified in screen specs, run `/design-generate` to produce HTML mockup variations
   - Create at least 2-3 style directories in `{{DESIGNS_PATH}}` (default: `designs/lookfeels/`)
   - Each style directory should contain HTML files for each screen type
   - Style variations should explore different: color palettes, layout densities, typography scales, component styles

   ```
   {{DESIGNS_PATH}}/
   ├── style-01/     ← e.g., Dark + dense + sharp corners
   │   ├── dashboard.html
   │   ├── list.html
   │   └── detail.html
   ├── style-02/     ← e.g., Light + spacious + rounded
   │   └── ...
   └── style-03/     ← e.g., Mixed + medium density
       └── ...
   ```

2. **Initialize the review system:**
   ```
   /review:init
   ```
   This scaffolds the review portal into `{{REVIEW_OUTPUT_PATH}}` (default: `design-review/`), auto-detecting screens from specs and styles from the folder structure.

3. **Generate thumbnails:**
   ```
   /review:thumbs
   ```
   Runs Playwright to screenshot all design variations. Requires `npm install playwright`.

4. **Instruct the user to review:**
   ```
   DESIGN REVIEW READY
   ════════════════════
   Open in your browser: {{REVIEW_OUTPUT_PATH}}/index.html

   Review each design variation:
   - Rate 1-5 stars
   - Approve or reject
   - Tag individual elements you like/dislike
   - Add notes explaining your preferences

   Keyboard shortcuts: ←→ navigate, 1-5 rate, A approve, R reject

   When done, click "Export JSON" in the gallery.
   Then tell me to continue and I'll analyze your feedback.
   ```

   **GATE: Wait for the user to complete their review and export the JSON.**

5. **Export and analyze review data:**
   ```
   /review:export
   /review:report
   ```
   This generates `dev_docs/foundations/design-direction.md` — the design direction document that feeds into Step 13.

6. **Present the design direction for approval:**
   ```
   DESIGN DIRECTION SUMMARY
   ═════════════════════════
   Top style:           {style} ({rating} avg)
   Composite approach:  {description of mixed elements}
   Token decisions:     {N} concrete values extracted
   Open questions:      {N} items for discussion

   Full report: dev_docs/foundations/design-direction.md

   Approve this direction to proceed to Token Foundation (Step 13)?
   ```

   **GATE: User approves design direction before proceeding.**

7. **Update state files:**
   - Add design direction summary to `dev_docs/session-context.md`
   - Update `dev_docs/handoff.md` with approved design direction
   - Log to DEVLOG

**Files generated:**
- `{{REVIEW_OUTPUT_PATH}}/index.html` — Review gallery
- `{{REVIEW_OUTPUT_PATH}}/review.html` — Full-screen reviewer
- `{{REVIEW_OUTPUT_PATH}}/review-config.json` — Runtime config
- `{{REVIEW_OUTPUT_PATH}}/thumbs/*.png` — Design thumbnails
- `dev_docs/foundations/design-review-summary.md` — Review data summary
- `dev_docs/foundations/design-direction.md` — AI-analyzed design direction (input to Step 13)

**Skip conditions:**
- `REVIEW_SYSTEM.enabled` is `false` in CONFIG → skip entirely
- No web UI in project → skip
- User says "skip review, I know what I want" → skip, but note the design direction must still be documented manually

Update STATE BLOCK: `CURRENT_STEP: 13`, add "12.9-design-review" to COMPLETED.

---

## Step 13: Design System

**Goal:** Set up design tokens, component system, and visual development environment. If Step 12.9 (Design Review) was completed, use `dev_docs/foundations/design-direction.md` as the primary input for token decisions.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/design-profile.md` — think as a design leader. Refuse to ship anything that looks algorithmically generated. Quality over speed.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/ux-consultant.template.md` for design system decisions.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

<!-- IF {{HAS_WEB}} == "true" -->
1. **Read design direction first** (if exists): Check for `dev_docs/foundations/design-direction.md` from Step 12.9. If it exists, use its Token Implementation Plan section as the starting point for all token values below. If it doesn't exist (Step 12.9 was skipped), proceed with the standard token selection process.

2. Resolve web design system templates from `07-ui-design-system/token-templates/`:
   - Brand tokens (Layer 1: CSS custom properties for brand values)
   - Semantic tokens (Layer 2: semantic mapping to brand tokens)
   - Tailwind integration guide (Layer 3: how to use in components)
   - Status color system
   - Component system guide
3. Set up Storybook (if frontend project):
   - `.storybook/main.ts` and `preview.tsx`
   - Story template file
<!-- ENDIF -->

<!-- IF {{HAS_MOBILE}} == "true" -->
1. Set up mobile design system from `15-mobile-ui-design/`:
   - Mobile design tokens (`mobile-design-tokens.md`): safe areas, touch targets, typography scale, spacing, colors (light/dark)
   - Platform guidelines (`platform-guidelines.md`): iOS HIG vs Material Design 3, platform-specific patterns
   - Mobile component library (`mobile-component-library.template.md`): base components with per-framework variants
   - Dark mode support (`dark-mode-mobile.md`): system dark mode detection, token switching
   - Accessibility (`mobile-accessibility.md`): VoiceOver/TalkBack, Dynamic Type, reduced motion
<!-- ENDIF -->

3. Update `dev_docs/foundations/design-system.md` with token docs

- **Design tools:** Invoke `/frontend-design` (frontend-design plugin) for component generation. Use Superdesign MCP for brand asset generation (logos, icons) if needed. Use MagicUI MCP for pre-built animated components. All generated components must pass the anti-slop rulebook.

- **Enforcement Gate 2 (Design Consistency):** Read `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` Gate 2. The design system must establish the anti-slop rulebook compliance checklist from `08-quality-testing/enforcement/design-audit-checklist.template.md`. This checklist will be required per-screen during development. Generate `dev_docs/foundations/design-audit-template.md` — a filled-in version of the design audit checklist with project-specific rules and design token references.

- **Visual Reference Capture (existing codebases only):** If this is NOT a greenfield project, read `07-ui-design-system/visual-reference-capture.template.md` and capture "before" screenshots, generate a design token diff, and create a rebrand checklist at `dev_docs/foundations/visual-reference.md`. Skip for greenfield projects.

- **Component Primitive Mapping:** Read `07-ui-design-system/component-primitive-mapping.template.md` and generate `dev_docs/foundations/component-primitive-mapping.md`. Map every domain component from screen specs to its UI library primitive(s). This is the single source of truth for "what primitive implements this component?"

Update STATE BLOCK: `CURRENT_STEP: 13.5`, add "13-design-system" to COMPLETED.

---

## Step 13.5: Anti-Pattern Detection Automation

**Goal:** Set up automated detection scripts that catch common anti-patterns during development.

**Instructions:**

1. Read `08-quality-testing/anti-pattern-system/AUTOMATED-DETECTION-RULES.md` — internalize all detection patterns
2. Review `scripts/detect-anti-patterns.sh` — understand the detection patterns for this project's stack
3. If source code exists: run `bash scripts/detect-anti-patterns.sh` and document baseline findings in `dev_docs/quality/anti-pattern-scan-baseline.md`
4. If greenfield (no source code yet): create `dev_docs/quality/anti-pattern-scan-config.md` documenting which rules are active for this project's stack

Update STATE BLOCK: `CURRENT_STEP: 14`, add "13.5-anti-pattern-automation" to COMPLETED.

---

## Step 14: Security Hardening

**Goal:** Apply security best practices before any code is written.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/security-profile.md` — think as a security engineer. Assume breach is inevitable. Focus on blast radius limitation.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/security-consultant.template.md` for security architecture decisions.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `11-new-capabilities/security-hardening.md`
2. Based on CONFIG, generate project-specific security configuration:
   - Security headers middleware (CSP, HSTS, X-Frame-Options)
   - CORS configuration (allowlist, not wildcard)
   - Rate limiting setup (per-IP and per-user)
   - CSRF protection (if using sessions)
   - Input sanitization patterns
3. Set up dependency vulnerability scanning:
   - `npm audit` or equivalent in CI pipeline
   - Secret scanning (gitleaks pre-commit hook)
4. Generate OWASP Top 10 checklist customized for the project's stack
5. Read `00-discovery/data-sensitivity.template.md` output and apply compliance requirements:
   - HIPAA → audit logging, encryption at rest, access controls
   - PCI → cardholder data isolation, network segmentation
   - GDPR → deletion handlers, consent tracking, data portability
   - SOC2 → access reviews, change management

- **Enforcement Gate 15 (Regulatory Completeness) — Conditional:** If `CONFIG.COMPLIANCE_REQUIREMENTS` != "none", complete the regulatory requirement matrix from `08-quality-testing/enforcement/regulatory-completeness.template.md`. Every regulatory requirement must map to a task, configuration, process, or vendor. Zero unmapped requirements. Distinguish "legally required at MVP" from "nice to have." Generate `dev_docs/completeness/regulatory-completeness-matrix.md`.

Update STATE BLOCK: `CURRENT_STEP: 14.5`, add "14-security" to COMPLETED.

---

## Step 14.5: Store Submission Readiness (skip if no mobile)

**Goal:** Verify all prerequisites for app store submission are in place.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. If CONFIG.HAS_MOBILE is "false" → skip to Step 15
2. Read `17-mobile-deployment/code-signing.md`
3. Verify developer accounts and app registration:
   - [ ] Apple Developer account active (if CONFIG.MOBILE_PLATFORMS includes iOS)
   - [ ] Google Play Developer account active (if CONFIG.MOBILE_PLATFORMS includes Android)
   - [ ] App ID / Bundle ID registered
   - [ ] Code signing configured (certificates + provisioning profiles for iOS, keystore for Android)
4. Verify build pipeline:
   - [ ] CI/CD pipeline configured (EAS Build / Fastlane / Codemagic / GitHub Actions)
   - [ ] Development build profile tested
   - [ ] Preview/staging build profile tested
   - [ ] Production build profile configured
5. Verify app assets:
   - [ ] App icons generated (all required sizes per platform)
   - [ ] Splash screen configured
   - [ ] App display name set
6. Read `17-mobile-deployment/app-store-submission.md`
7. Run `10-generators/APP-STORE-LISTING-GENERATOR.md` to generate store listing content
8. Read `17-mobile-deployment/beta-testing.md` and configure:
   - TestFlight internal testing group (iOS)
   - Google Play internal testing track (Android)
   - Or Expo internal distribution for development builds
9. Present readiness summary:
   ```
   STORE SUBMISSION READINESS:
     iOS: [ready / not ready] — [details]
     Android: [ready / not ready] — [details]
     CI/CD: [configured / not configured]
     Beta testing: [TestFlight / Play Internal / Expo] configured
     Store listing: [generated / pending]
   ```

**GATE: Build succeeds in CI, internal test build distributed to at least one test device. User confirms.**

Update STATE BLOCK: set `CURRENT_STEP: 14.6`, add "14.5-store-readiness" to COMPLETED.

---

## Step 14.6: AI/ML Feature Architecture (skip if no AI features)

**Goal:** Design the AI feature architecture — model selection, integration patterns, cost management, and safety guardrails.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. If CONFIG.AI_FEATURES is "false" → skip to Step 15
2. Read `24-ai-ml-integration/ai-feature-decision-tree.md` and map each planned AI feature to an architecture pattern
3. Read `24-ai-ml-integration/model-selection-decision-tree.md` and confirm AI provider selection
4. Read `24-ai-ml-integration/llm-integration-patterns.md` and select integration approach (direct API, SDK, framework)

<!-- IF {{AI_FEATURES}} == "true" -->
5. Generate AI architecture documents:
   - Resolve `24-ai-ml-integration/ai-cost-management.template.md` → `dev_docs/ai-cost-management.md`
   - If RAG features needed: resolve `24-ai-ml-integration/rag-architecture.template.md` → `dev_docs/rag-architecture.md`
6. Read `24-ai-ml-integration/ai-safety-guardrails.md` and configure:
   - Prompt injection prevention patterns
   - Content moderation pipeline
   - PII detection/redaction
   - Per-user rate limiting for AI features
7. Read `24-ai-ml-integration/ai-feature-testing.md` and set up AI testing infrastructure:
   - Mock providers for deterministic tests
   - Evaluation dataset structure
   - Prompt regression testing pipeline
8. Read `24-ai-ml-integration/prompt-engineering-templates.md` and set up prompt versioning strategy
<!-- ENDIF -->

Update STATE BLOCK: set `CURRENT_STEP: 14.7`, add "14.6-ai-ml" to COMPLETED.

---

## Step 14.7: Legal Document Generation (skip if pre-launch not needed)

**Goal:** Generate the user-facing legal documents required before launch — Privacy Policy, Terms of Service, and any additional documents based on the project's data sensitivity classification and compliance profile.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `29-legal-documents/legal-document-decision-tree.md` and walk through each decision node using:
   - `dev_docs/data-sensitivity.md` (from Step 14) — determines which regulations apply
   - CONFIG.PAYMENT_PROCESSING — determines if refund/cancellation terms are needed
   - CONFIG.HAS_MOBILE — determines if EULA is needed
   - CONFIG.HAS_UGC — determines if Acceptable Use Policy is needed
   - CONFIG.TARGET_AUDIENCE — determines if DPA is needed (B2B)

2. Generate the required legal documents:

   | Condition | Template | Output |
   | --------- | -------- | ------ |
   | Always | `29-legal-documents/privacy-policy.template.md` | `dev_docs/legal/privacy-policy.md` |
   | Always | `29-legal-documents/terms-of-service.template.md` | `dev_docs/legal/terms-of-service.md` |
   | Uses cookies/analytics | `29-legal-documents/cookie-policy.template.md` | `dev_docs/legal/cookie-policy.md` |
   | Has UGC | `29-legal-documents/acceptable-use-policy.template.md` | `dev_docs/legal/acceptable-use-policy.md` |
   | B2B SaaS with EU customers | `29-legal-documents/dpa.template.md` | `dev_docs/legal/dpa.md` |
   | Mobile app | `29-legal-documents/eula.template.md` | `dev_docs/legal/eula.md` |

3. Cross-reference each document against the data sensitivity classification to ensure legal commitments match technical controls.

4. If CONFIG.AUDIT_REQUIREMENTS includes "hipaa" or CONFIG.DATA_SENSITIVITY is "high":
   Generate `dev_docs/legal/dpia.md` from `29-legal-documents/dpia.template.md` — Data Privacy Impact Assessment covering data flow mapping, risk assessment, necessity/proportionality, and breach response

5. Present summary:
   ```
   LEGAL DOCUMENTS GENERATED:
     Privacy Policy: ✓ (covers: [applicable regulations])
     Terms of Service: ✓ (includes refund policy: [yes/no])
     Cookie Policy: [✓ / not needed]
     Acceptable Use Policy: [✓ / not needed]
     Data Processing Agreement: [✓ / not needed]
     EULA: [✓ / not needed]

   ⚠ IMPORTANT: These documents must be reviewed by a qualified attorney before publication.
   ```

Update STATE BLOCK: set `CURRENT_STEP: 14.75`, add "14.7-legal-docs" to COMPLETED.

---

## Step 14.75: Data Privacy Engineering (always runs)

**Goal:** Implement the technical privacy architecture — data flow mapping, consent management, data subject request workflows, retention policies, and privacy-by-design patterns — that turns the legal commitments from Step 14.7 into enforceable engineering systems.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `42-data-privacy-engineering/privacy-engineering-decision-tree.md` — determine jurisdictional scope, data sensitivity level, consent model, and cross-border transfer requirements. Set `CONFIG.PRIVACY_JURISDICTIONS`, `CONFIG.CONSENT_MODEL`, `CONFIG.DATA_SENSITIVITY_LEVEL`.

2. Generate privacy foundations:
   - Read `42-data-privacy-engineering/data-classification-framework.template.md` → generate `dev_docs/privacy/data-classification.md`
   - Read `42-data-privacy-engineering/data-flow-mapping.template.md` → generate `dev_docs/privacy/data-flow-map.md`
   - Read `42-data-privacy-engineering/records-of-processing.template.md` → generate `dev_docs/privacy/processing-records.md`

3. Generate consent and rights infrastructure:
   - Read `42-data-privacy-engineering/consent-management.template.md` → generate `dev_docs/privacy/consent-architecture.md`
   - Read `42-data-privacy-engineering/dsr-workflow.template.md` → generate `dev_docs/privacy/dsr-workflows.md`
   - Read `42-data-privacy-engineering/cookie-consent-implementation.template.md` → generate `dev_docs/privacy/cookie-consent.md`

4. Generate retention and transfer policies:
   - Read `42-data-privacy-engineering/data-retention-policy.template.md` → generate `dev_docs/privacy/retention-policy.md`
<!-- IF {{CROSS_BORDER_MECHANISM}} != "none" -->
   - Read `42-data-privacy-engineering/cross-border-transfers.template.md` → generate `dev_docs/privacy/cross-border-transfers.md`
<!-- ENDIF -->

5. Read `42-data-privacy-engineering/privacy-by-design-patterns.md` — apply relevant patterns to service specs.

6. Read `42-data-privacy-engineering/privacy-impact-assessment.template.md` → generate DPIA for any high-risk processing activities.

7. Read `42-data-privacy-engineering/privacy-testing-checklist.template.md` → generate `dev_docs/privacy/privacy-tests.md`

8. Read `42-data-privacy-engineering/privacy-engineering-gotchas.md` and flag applicable risks.

**GATE: Data flow map covers all services from Step 5. At least one processing activity documented per service that handles personal data. DSR workflow covers access, erasure, and portability. Consent architecture includes withdrawal mechanism.**

Update STATE BLOCK: set `CURRENT_STEP: 14.8`, add "14.75-privacy-engineering" to COMPLETED.

---

## Step 14.8: Billing & Payment Architecture (skip if no monetization)

**Goal:** Design the billing architecture — payment provider integration, subscription management, tax compliance, and dunning recovery flows.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. If CONFIG.PAYMENT_PROCESSING is "false" → skip to Step 15
2. Read `30-billing-payments/billing-architecture-decision-tree.md` and walk through all nodes:
   - Billing model (subscription / usage-based / hybrid / marketplace / one-time)
   - Payment provider (Stripe / Paddle / LemonSqueezy)
   - Plan structure (tiers, pricing, trials)
   - Integration architecture (webhook-driven)

3. Generate billing documents:

   | Condition | Template | Output |
   | --------- | -------- | ------ |
   | Always (if monetized) | `30-billing-payments/billing-domain-model.template.md` | `dev_docs/billing/domain-model.md` |
   | Always (if monetized) | `30-billing-payments/tax-compliance-patterns.md` | Reference only |
   | Has subscriptions | `30-billing-payments/dunning-recovery-flows.template.md` | `dev_docs/billing/dunning-flows.md` |
   | Usage-based pricing | `30-billing-payments/usage-metering-patterns.md` | `dev_docs/billing/usage-metering.md` |
   | Always (if monetized) | `30-billing-payments/billing-testing-patterns.md` | Reference only |

4. Add billing schema to database design documents (reference `billing-domain-model.template.md`)
5. Add webhook handling to queue architecture (reference `02-architecture/queue-architecture-decision-tree.md`)

6. Present summary:
   ```
   BILLING ARCHITECTURE:
     Model: [subscription / usage-based / hybrid / marketplace]
     Provider: [Stripe / Paddle / LemonSqueezy]
     Plans: [count] tiers ([names])
     Free tier: [yes — freemium / yes — trial / no]
     Tax handling: [Stripe Tax / MoR / manual]
     Dunning: [configured — X-day grace period]
   ```

Update STATE BLOCK: set `CURRENT_STEP: 14.9`, add "14.8-billing" to COMPLETED.

---

## Step 14.9: Integration Strategy & Architecture (skip if no third-party integrations)

**Goal:** Design the cross-cutting integration architecture — webhook handling, resilience patterns, health monitoring, and category-specific integration plans for all identified third-party services.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. If CONFIG.INTEGRATIONS_COUNT is "0" → skip to Step 15
2. Read `32-integrations/integration-maturity-assessment.md` and assess integration maturity level based on integration count and project complexity. Set `INTEGRATION_MATURITY_LEVEL` in CONFIG.
3. Read `32-integrations/README.md` for full scope and reading order.
4. Resolve `32-integrations/integration-strategy.template.md` using the integration inventory from `00-discovery/integrations-map` output. Save to `dev_docs/specs/integrations/integration-strategy.md`.
5. Based on `INTEGRATION_MATURITY_LEVEL`, resolve applicable templates:

   | Maturity Level | Templates to Resolve |
   | -------------- | -------------------- |
   | Basic (1-3 integrations) | `integration-strategy.template.md` only |
   | Standard (4-8 integrations) | + `webhook-architecture.template.md`, `integration-health-monitoring.template.md` |
   | Complex (9-15 integrations) | + `multi-provider-fallback.template.md`, `job-queue-patterns.template.md` |
   | Enterprise (16+) | All templates |

6. For each integration category identified in the project, resolve the relevant subdirectory template:
   - Auth/SSO → `32-integrations/auth-sso/`
   - Communication platforms → `32-integrations/communication-platforms/`
   - E-commerce → `32-integrations/ecommerce/`
   - CRM/CDP → `32-integrations/crm-cdp/`
   - Cloud services → `32-integrations/cloud-services/`
   - Scheduling/geo → `32-integrations/scheduling-geo/`

7. Save all resolved templates to `dev_docs/specs/integrations/`.
8. For each integration requiring vendor selection, generate a vendor evaluation scorecard using `32-integrations/vendor-evaluation.template.md`
   - Output to `dev_docs/specs/integrations/vendor-evaluations/`
9. Generate integration implementation tasks and add to appropriate phase task files.

9. Present summary:
   ```
   INTEGRATION STRATEGY:
     Integration count: [N]
     Maturity level: [basic / standard / complex / enterprise]
     Templates resolved: [count]
     Category plans: [list of categories]
     Webhook-based integrations: [count]
     Fallback-enabled integrations: [count]
     Estimated monthly integration cost: [amount]
   ```

10. **Integration Failure Specs (Standard/Full paths):** For each P0 and P1 integration identified in the integration strategy, resolve `32-integrations/integration-failure-spec.template.md`. Save to `dev_docs/specs/integrations/failure-specs/`. Each failure spec must define: timeout values (specific ms, not "reasonable defaults"), retry policy (count, backoff, jitter), circuit breaker config (threshold, cooldown), fallback behavior (specific to this API), per-error-code handling, and monitoring alert thresholds. Register integration error codes in `dev_docs/specs/catalogs/error-catalog.md`.

**GATE:** Informational. Semi-auto: auto-pass with logged summary.

Update STATE BLOCK: set `CURRENT_STEP: 15`, add "14.9-integrations" to COMPLETED.

---

## Step 15: Observability & Error Handling

**Goal:** Set up logging, monitoring, and error reporting before coding begins.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `11-new-capabilities/error-handling-strategy.md`
2. Set up structured logging:
   - Configure Pino (Node.js) or equivalent for the project's stack
   - Define log levels strategy (what goes to debug/info/warn/error/fatal)
   - Set up correlation IDs for request tracing
3. Read `11-new-capabilities/observability.md`
4. Set up error reporting:
   - Sentry client-side integration (if frontend)
   - Server-side error middleware
   - Error boundary hierarchy (React: app/route/component levels)
5. Create health check endpoint (`/health`, `/ready`)
6. Set up monitoring:
   - Configure monitoring from `09-deployment-operations/monitoring.template.md`
   - Define alerting rules (error rate, latency, disk usage)

Update STATE BLOCK: `CURRENT_STEP: 15.5`, add "15-observability" to COMPLETED.

---

## Step 15.5: User Documentation

**Goal:** Set up user-facing documentation infrastructure and generate initial documentation skeleton (guides, FAQs, tutorials, troubleshooting, in-app help, screenshot manifest).

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Create `user_docs/` directory structure:
   - `user_docs/guides/` — per-feature user guides
   - `user_docs/faq/` — FAQ entries by category
   - `user_docs/getting-started/` — role-based onboarding guides
   - `user_docs/tutorials/` — multi-feature workflow tutorials
   - `user_docs/troubleshooting/` — problem/solution articles
   - `user_docs/changelog.md` — release notes
   - `user_docs/in-app/` — in-app help JSON files (web)
   - `user_docs/screenshots/web/` — web screenshot assets
   - `user_docs/DOC-INDEX.md` — documentation coverage tracker

<!-- IF {{HAS_MOBILE}} == "true" -->
   Additional mobile directories:
   - `user_docs/guides/mobile/` — mobile-only feature guides
   - `user_docs/in-app/mobile/` — mobile in-app help (coach marks, bottom sheets)
   - `user_docs/screenshots/ios/` — iOS screenshot assets
   - `user_docs/screenshots/android/` — Android screenshot assets
   - `user_docs/screenshots/store/ios/` — App Store submission screenshots
   - `user_docs/screenshots/store/android/` — Play Store submission screenshots
   - `user_docs/store-listing/` — App Store / Play Store listing content
<!-- ENDIF -->

2. Read `10-generators/USER-DOC-GENERATOR.md` and run it:
   - Generate skeleton docs for every feature in the features list
   - Generate onboarding guide per user role
   - Generate FAQ categories from feature groups
   - Initialize changelog
   - Initialize screenshot manifest (web)

<!-- IF {{HAS_MOBILE}} == "true" -->
3. Mobile documentation setup:
   - Generate mobile-specific skeleton docs from `18-user-documentation/mobile/` templates
   - Generate App Store listing skeleton from `18-user-documentation/doc-types/app-store-listing.template.md`
   - Generate mobile onboarding guide (permission flows, biometric setup)
   - Initialize mobile screenshot manifest (ios + android device sizes)
   - If `{{MOBILE_OFFLINE}} == "true"`: generate offline mode guide skeleton
   - Generate push notification guide skeleton (if app uses push)
   - Set up in-app help content structure for mobile (coach marks, bottom sheets)
<!-- ENDIF -->

4. If CONFIG.FRONTEND_FRAMEWORK != "none":
   - Set up docs site using `18-user-documentation/site-structure/docs-site-guide.md`
   - Configure sidebar from `18-user-documentation/site-structure/sidebar-structure.template.md`
<!-- IF {{HAS_MOBILE}} == "true" -->
   - Add "Mobile App" section to sidebar with mobile-specific guides
<!-- ENDIF -->

5. Copy documentation skills to `.claude/skills/`:
   - `document-feature/SKILL.md` from `05-dev-infrastructure/skills/document-feature/SKILL.md.template`
   - `capture-screenshots/SKILL.md` from `05-dev-infrastructure/skills/capture-screenshots/SKILL.md.template`

6. Copy documentation commands to `.claude/commands/`:
   - `document-feature.md` from `05-dev-infrastructure/commands/document-feature.template.md`
   - `capture-screenshots.md` from `05-dev-infrastructure/commands/capture-screenshots.template.md`
   - `doc-quality-gate.md` from `05-dev-infrastructure/commands/doc-quality-gate.template.md`

7. Install documentation enforcement hooks (see `05-dev-infrastructure/hooks/doc-enforcement.md`):
   - Copy `hooks/doc-enforcement-dispatcher.template.sh` → `hooks/doc-enforcement-dispatcher.sh`
   - Copy `hooks/session-end-doc-check.template.sh` → `hooks/session-end-doc-check.sh`
   - Copy `hooks/pre-commit-doc-gate.template.sh` → `.git/hooks/pre-commit`
   - Make all scripts executable: `chmod +x hooks/*.sh .git/hooks/pre-commit`
   - Replace `{{USER_DOCS_PATH}}` in scripts with actual docs path
   - Add hooks configuration to `.claude/settings.json`:

     ```jsonc
     "hooks": {
       "PostToolUse": [{ "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "bash hooks/doc-enforcement-dispatcher.sh" }] }],
       "Stop": [{ "hooks": [{ "type": "command", "command": "bash hooks/session-end-doc-check.sh" }] }]
     }
     ```

Update STATE BLOCK: `CURRENT_STEP: 15.7`, add "15.5-user-docs" to COMPLETED.

---

## Step 15.7: Diagram Generation Suite

**Goal:** Generate the complete visual documentation library — infrastructure diagrams, ERDs, timelines, auth matrices, stakeholder materials, and the MASTER mind map. These diagrams make specs, architecture, and project status accessible to every audience (developers, stakeholders, compliance teams, investors). All diagrams use Mermaid syntax for universal rendering.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read the diagram generation guide: `31-stakeholder-communications/diagrams/DIAGRAM-GENERATION-SUITE.md`
2. Read all project data sources needed for diagram population:
   - Service specs (`dev_docs/specs/services/`)
   - Service hubs (`dev_docs/services/`)
   - Screen specs (`dev_docs/specs/screens/`)
   - API contracts (`dev_docs/specs/contracts/`)
   - Database schemas (`dev_docs/specs/database/`)
   - Phase plans and task files (`dev_docs/tasks/`)
   - Master tracker, timeline, milestones (`dev_docs/tracker/`)
   - Infrastructure docs (Step 11 output)
   - Security docs (Step 14 output)
   - Observability docs (Step 15 output)
   - Tribunal output (`dev_docs/tribunal/`)
   - Project overview and phases (`dev_docs/specs/`)

3. Generate diagrams by category following the generation order in `DIAGRAM-GENERATION-SUITE.md`. For each diagram: read the template from `31-stakeholder-communications/diagrams/`, fill all `{{PLACEHOLDER}}` values from project data, write to `dev_docs/comms/diagrams/`. Drop the `.template` suffix in output filenames.

   **Category 1 — System Overviews (3 files, ALWAYS):**
   - `overview-service-map.md` — all services with relationships, priorities, endpoint/table counts
   - `overview-phased-roadmap.md` — phase milestones, critical path, phase gates
   - `MASTER-mind-map.mermaid.md` — follow `MASTER-mind-map-generator.md`. Target: 40-60 sections, 1,500-2,000+ nodes. **Generate this LAST** after all other categories.

   **Category 2 — Service Feature Maps (1 per service, ALWAYS):**
   - For EACH service in the service index: generate `svc-{NN}-{service-name}-features.md`
   - Read template: `svc-feature-map.template.md`. Target: 50-120 nodes per service.

   **Category 3 — Workflow Diagrams (1 per major workflow, ALWAYS):**
   - Identify every end-to-end workflow crossing 2+ services (typically 5-10)
   - For each: generate `wf-{workflow-name}.md`. Read template: `wf-workflow.template.md`. Target: 25-60 nodes.

   **Category 4 — State Machine Diagrams (1 per domain group, ALWAYS):**
   - Group related state machines by domain (typically 3-6 groups)
   - For each: generate `sm-{domain-group}.md`. Read template: `sm-state-machine.template.md`. Target: 40-75 nodes.

   **Category 5 — Data Flow Diagrams (3-5 files):**
   - `data-flow.md` — Mermaid sequence diagrams for top 3-5 flows (ALWAYS)
   - `df-value-chain.md` — primary data transformation chain (ALWAYS)
   - `df-cross-service-dependencies.md` — production/consumption map (ALWAYS)
   <!-- IF {{HAS_REALTIME}} == "true" -->
   - `df-realtime-paths.md` — every WebSocket/SSE path with frequency, subscribers, fallback
   <!-- ENDIF -->
   <!-- IF {{HAS_MOBILE}} == "true" AND {{HAS_OFFLINE}} == "true" -->
   - `df-mobile-offline-sync.md` — offline queue → conflict resolution → sync
   <!-- ENDIF -->

   **Category 6 — Integration Diagrams (2-3 files):**
   - `int-phase1-mvp.md` — MVP integrations with vendor, protocol, auth (ALWAYS)
   - `int-phase2-post-launch.md` — post-launch integrations (ALWAYS)
   <!-- IF {{INTEGRATION_PHASE_COUNT}} >= 3 -->
   - `int-phase3-expansion.md` — future integrations with patterns
   <!-- ENDIF -->

   **Category 7 — Cross-Cutting Concerns (2-3 files):**
   <!-- IF {{IS_MULTI_TENANT}} == "true" -->
   - `xc-multi-tenant.md` — tenant isolation, data classification, compliance overlay
   <!-- ENDIF -->
   - `xc-auth-security.md` — role hierarchy, permission model, auth flows, OWASP controls (ALWAYS)
   - `xc-design-system-cicd.md` — design tokens, component library, CI/CD, quality gates (ALWAYS)

   **Category 8 — Infrastructure & Operations (7 new + 1 existing, ALWAYS):**
   - Verify `system-architecture-flowchart.md` exists (from Step 9 COMMS TRIGGER). If missing, generate from template.
   - `infra-deployment-topology.md` — deployment architecture per environment
     <!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->
     Include compliance annotations: sensitive data layers, encryption points, audit logging
     <!-- ENDIF -->
   - `infra-security-zones.md` — network security zones with trust levels and firewall rules
     <!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->
     Map to compliance framework (HIPAA Security Rule / PCI-DSS / SOC 2)
     <!-- ENDIF -->
   - `infra-cicd-pipeline.md` — full pipeline flowchart with timing estimates and branch strategy
   - `infra-monitoring-observability.md` — error tracking, metrics, dashboards, alerting, log pipeline
   - `infra-disaster-recovery.md` — RTO/RPO targets, backup strategy, 5+ failover scenario flowcharts
   - `infra-secrets-management.md` — secret lifecycle, rotation schedule, access control matrix
   - `infra-api-topology.md` — API router hierarchy, middleware stack, request lifecycle

   **Category 9 — Database ERD (1 file, ALWAYS):**
   - `database-erd-visual.md` — Mermaid erDiagram split by domain, cross-domain relationships at end

   **Category 10 — Timeline & Milestones (2 new + existing, ALWAYS):**
   - Verify `roadmap-gantt.md` exists (from Step 9 COMMS TRIGGER). If missing, generate from template.
   - `timeline-full-project.md` — complete Gantt with ALL phases/sprints/tasks, parallel tracks, critical path
   - `milestone-roadmap.md` — executive-friendly milestone view. NO task IDs. Achievement-focused.

   **Category 11 — Auth & Mobile (1-2 files):**
   - `auth-role-permission-matrix.md` — all roles × permissions, hierarchy, MFA requirements (ALWAYS)
   <!-- IF {{HAS_MOBILE}} == "true" -->
   - `mobile-navigation-map.md` — tab navigator, screen hierarchy, deep links, offline indicators
   <!-- ENDIF -->

   **Category 12 — Stakeholder Materials (2-4 files):**
   - `stakeholder-product-overview.md` — product vision mindmap for investors/sales (ALWAYS)
   - `stakeholder-data-security.md` — data classification, compliance mapping, incident response (ALWAYS)
   <!-- IF {{HAS_COMPETITORS}} == "true" -->
   - `stakeholder-competitive-landscape.md` — market positioning matrix, feature comparison, win themes
   <!-- ENDIF -->
   <!-- IF {{IS_B2B}} == "true" -->
   - `stakeholder-roi-model.md` — ROI model: pain points, improvements, cost savings, payback timeline
   <!-- ENDIF -->

4. Generate diagram index: `dev_docs/comms/diagrams/_index.md` from `31-stakeholder-communications/diagrams/_diagram-index.template.md`
   - Total diagram count and total node count
   - Table per category: file name (linked), description, Mermaid type, node count, status
   - Coverage checks: every service, persona, and workflow represented
   - List skipped diagrams with documented reasons

5. **Diagram Quality Gate** — verify ALL of the following before proceeding:
   - [ ] All required diagram files exist (conditional ones skipped with documented reason in `_index.md`)
   - [ ] Every service in `dev_docs/completeness/service-matrix.md` appears in at least one service feature map
   - [ ] Every persona from project overview appears in at least one diagram
   - [ ] Every major workflow crossing 2+ services has a workflow diagram
   - [ ] Every database domain has an ERD section in `database-erd-visual.md`
   - [ ] MASTER mind map covers all services, workflows, state machines, and integrations
   - [ ] Timeline Gantt matches master-tracker task counts and sprint dates
   - [ ] Milestone roadmap matches STATUS.md milestone definitions
   - [ ] All Mermaid diagrams have valid syntax (no unclosed subgraphs, no duplicate IDs)
   - [ ] Diagram index `_index.md` has accurate file list, descriptions, and counts

**GATE: All diagrams generated. Diagram index complete. Quality checklist passes. Present diagram count and category summary to user.**

Update STATE BLOCK: `CURRENT_STEP: 16`, add "15.7-diagrams" to COMPLETED.

---

## Step 16: Handoff

**Goal:** Generate the entry summary and day-1 checklist.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Create `dev_docs/HANDOFF.md`:
   - Project overview (1 paragraph)
   - What was set up (list all generated docs with counts)
   - Where to find things (folder map)
   - Day-1 checklist:
     - [ ] Read CLAUDE.md
     - [ ] Read STATUS.md — find first task
     - [ ] Run `/kickoff` to start your first coding session
     - [ ] Verify dev environment works (`docker-compose up`, `pnpm dev`)
     - [ ] After each feature: run `/document-feature` to capture user docs
     - [ ] After design phase: run `/capture-screenshots` for visual guides
     - [ ] Before phase transition: run `/doc-quality-gate` to verify docs
   - Team workflow (how to claim tasks, session protocol)
   - Key files to know about

2. Create `03-documentation/state-files/handoff.md` from template with exact "Next Exact Action"

3. Initialize state files:
   - `DEVLOG.md` from template (append-only session history)
   - `PROTECT-LIST.md` from template (empty, ready to populate)
   - `dev_docs/weekly-reports/work-log.md` (empty, ready for first entry)
   - `dev_docs/client-log/` directory (weekly client-facing work logs — auto-populated by Post-Task Protocol Step 6)

4. Update CLAUDE.md with final project stats

5. Generate `dev_docs/SUMMARY-CARD.md` from `03-documentation/state-files/summary-card.template.md`:
   - Fill in all project identity, tech stack, and count placeholders from the STATE BLOCK CONFIG
   - Count actual generated files for service specs, screen specs, tasks, contracts, and tribunal files
   - List all services with one-line descriptions
   - Fill in phase breakdown with actual task counts and effort estimates
   - This is the user's "one-page snapshot" of everything the kit produced

6. Generate `dev_docs/completeness/dashboard.md` — the master completeness dashboard:
   - **Overall coverage:** Services planned vs generated, Features vs tasks, Screens vs specs
   - **Per-service detail table:**

     | Service | Spec | Hub | Screens | Tasks | APIs | Depth Score |
     |---------|------|-----|---------|-------|------|-------------|
     | {{SERVICE}} | {{Y/N}} | {{Y/N}} | {{N}} | {{N}} | {{N}} | {{SCORE}}/10 |

   - **Gaps remaining:** List any services with <8/10 depth, any features with <6/8 task layers
   - Cross-reference against: service matrix (Step 4.5), screen matrix (Step 6.5), phase coverage (Step 8.5)

7. Present the handoff to the user:
   ```
   PROJECT SETUP COMPLETE

   Generated: [X] documents across [Y] directories
   Research: [Z] tribunal files
   Tasks: [N] task files across [P] phases
   Screens: [S] screen specs
   Services: [V] service hubs
   User Docs: [D] guides, [F] FAQ entries, [T] screenshots pending
   Completeness: [C]% service coverage, [D]% screen coverage, [E]% task coverage

   Start coding: Run /kickoff
   ```

8. Generate `dev_docs/CONTEXT-RECOVERY.md` from `03-documentation/state-files/context-recovery.template.md` — fast-load context file for AI agent session recovery
9. Generate `dev_docs/lessons-learned.md` from `03-documentation/state-files/lessons-register.template.md` — pre-populate with tribunal insights
10. Generate `dev_docs/governance/change-request-process.md` from `03-documentation/spec-layer/governance/change-request-process.template.md`
11. Generate `dev_docs/quality/definition-of-ready.md` from `03-documentation/spec-layer/governance/definition-of-ready.template.md`
12. Generate `dev_docs/governance/release-checklist.md` from `03-documentation/spec-layer/governance/release-checklist.template.md`

- **Enforcement Gate 8 (User Journey Verification):** Generate `dev_docs/completeness/journey-coverage-matrix.md` following `10-generators/JOURNEY-COVERAGE-MATRIX.md`. Map every persona → journey stages (awareness → onboarding → daily use → advanced → expansion → advocacy) → screens → tasks → E2E tests. Any journey stage without implementation coverage = FAIL. This is a mandatory gate — do not proceed to Step 16.1 until all journey stages are covered.

- **MANDATORY QUALITY GATE DOCUMENTS:** Every project, regardless of path, must have these three documents before Step 16 gate passes:
  1. `dev_docs/quality/anti-patterns.md` (generated in Step 16.1)
  2. `dev_docs/quality/definition-of-done.md` (generate from `08-quality-testing/enforcement/` governance templates)
  3. `dev_docs/quality/testing-gates.md` (generate from enforcement gate summaries — what must pass at each phase boundary)

- **Verification commands:** Run `/verify-hub` on all service hub files to ensure they match the planned architecture. Run `/health-check` to verify file counts and completeness. Run `anti-pattern-scanner` agent to catch any quality issues before signing off planning.

**GATE: User confirms build planning is complete.**

**COMMS TRIGGER:** Generate the full stakeholder handoff package — compile ALL communications generated so far into a single presentation-ready bundle:

- Create `dev_docs/comms/handoff-package/` directory
- Compile: all kickoff docs, architecture docs, sprint planning docs, diagrams
- Generate a `full-stakeholder-presentation.md` that links all comms in chronological order
- Include complete diagram library from Step 15.7 (see `dev_docs/comms/diagrams/_index.md` for the full manifest)
- Verify Step 15.7 diagram suite is complete before compiling handoff package
- This is the "here's everything we planned" package for stakeholders
- Include link to `/stakeholder-report` command for ongoing updates
- Re-generate the interactive HTML mind map (now with full project data): follow `31-stakeholder-communications/diagrams/INTERACTIVE-MINDMAP-GENERATOR.md`. Output: `dev_docs/comms/diagrams/interactive-mindmap.html`

Update STATE BLOCK: `CURRENT_STEP: 16.1`, add "16-handoff" to COMPLETED.

---

## Step 16.1: Anti-Pattern Baseline

**Goal:** Generate an initial anti-pattern registry based on the project's tech stack.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `08-quality-testing/anti-pattern-system/ANTI-PATTERN-STARTER.md` — the 11 universal anti-patterns
2. Filter to patterns relevant to this project's stack:
   - If no REST API → skip AP-001 (envelope), AP-005 (HTTP methods), AP-006 (doubled prefix)
   - If no multi-tenant → skip AP-011 (tenant isolation)
   - If no React → skip AP-003 (unstable deps), AP-007 (force reload), AP-008 (missing states)
3. Create `dev_docs/quality/anti-patterns.md` with the filtered list
4. Create `dev_docs/quality/prevention-checklist.md` from `08-quality-testing/anti-pattern-system/PREVENTION-CHECKLIST.md` (filtered to relevant items)
5. Add 2-3 stack-specific anti-patterns (e.g., Next.js "use client" mistakes, Prisma N+1 queries)
6. Add anti-pattern reference to CLAUDE.md Section 9 (Golden Rules)
7. Read `08-quality-testing/anti-pattern-system/AUTOMATED-DETECTION-RULES.md` for automated detection patterns
8. If source code exists, run `bash scripts/detect-anti-patterns.sh` to establish the anti-pattern baseline. Store output in `dev_docs/quality/anti-pattern-baseline-report.md`.

Update STATE BLOCK: `CURRENT_STEP: 16.2`, add "16.1-anti-patterns" to COMPLETED.

---

## Step 16.2: Security Baseline

**Goal:** Generate the security severity framework and initial security audit checklist.

**Instructions:**

1. Read `08-quality-testing/security-framework/SEVERITY-LEVELS.md`
2. Create `dev_docs/security/severity-framework.md` — copy the 4-level framework
3. Create `dev_docs/security/findings.md` from `SECURITY-FINDINGS-TEMPLATE.md` (empty tracker)
4. Create `dev_docs/security/audit-checklist.md` from `SECURITY-AUDIT-CHECKLIST.md` — filter sections by stack:
   - If no multi-tenant → simplify Section 4
   - If using managed auth (Clerk) → simplify Section 1
   - If no server-side rendering → adjust Section 5 (XSS)
5. Run a quick initial scan:
   - `grep -r "localStorage.*token" --include="*.ts"` → check for token storage issues
   - `grep -r ": any" --include="*.ts"` → count `any` types
   - `pnpm audit` → check for CVEs
6. Log any immediate findings in the findings tracker

Update STATE BLOCK: `CURRENT_STEP: 16.3`, add "16.2-security" to COMPLETED.

---

## Step 16.3: Performance Budget

**Goal:** Generate performance targets based on the application type.

**Instructions:**

1. Read `08-quality-testing/performance-budget/PERFORMANCE-TARGETS.md`
2. Create `dev_docs/performance/targets.md` — customize based on app type:
   - **SPA/Dashboard:** Focus on API p95, bundle size, INP
   - **Content/Marketing:** Focus on LCP, FCP, CLS
   - **E-commerce:** Focus on LCP, INP, conversion-critical metrics
   - **Mobile app:** Focus on startup time, offline capability
3. Create `dev_docs/performance/slo.md` from `SLO-TEMPLATE.md` with project-specific targets
4. If API exists, create `dev_docs/performance/rate-limiting.md` from `RATE-LIMITING-TIERS.md`
5. Add performance targets to CLAUDE.md (if not already present)

Update STATE BLOCK: `CURRENT_STEP: 16.4`, add "16.3-performance" to COMPLETED.

---

## Step 16.4: Protection List Init

**Goal:** Create an empty protection list with criteria for when to add entries.

**Instructions:**

1. Read `06-development-workflow/PROTECTION-LIST.md`
2. Create `dev_docs/PROTECTION-LIST.md` — empty table, ready to populate
3. Add PROTECT LIST section to CLAUDE.md (if not already present)
4. Add protection list reference to AGENTS.md

Update STATE BLOCK: `CURRENT_STEP: 16.5`, add "16.4-protection" to COMPLETED.

---

## Step 16.5: Memory System Init

**Goal:** Set up the cross-session memory system for AI agents.

**Instructions:**

1. Read `05-dev-infrastructure/ai-config/MEMORY-SYSTEM.md`
2. Create `.claude/projects/{hash}/memory/MEMORY.md` hub file with:
   - Project Overview (from intake answers)
   - Current Phase (Phase 1)
   - Codebase Metrics (from status scan)
   - API Envelope format (from architecture decisions)
   - Known P0 Bugs (empty or from initial scan)
   - PROTECT LIST (empty)
   - User Preferences (from intake)
3. Create empty topic files: `testing.md`, `design-system.md`
4. Add memory directory path to CLAUDE.md

Update STATE BLOCK: `CURRENT_STEP: 17`, add "16.5-memory" to COMPLETED.

---

## Step 16.6: Seed Data Planning (skip if CONFIG.SEED_DATA == "false")

**Goal:** Plan realistic seed data for development, testing, and demos.

**Instructions:**

1. If CONFIG.SEED_DATA is "false" → skip to Step 16.7
2. Read `02-architecture/seed-data-plan.template.md`
3. Read `03-documentation/database-docs/seed-data-spec.template.md`
4. Generate files in `dev_docs/specs/database/seed-data/`:

   a. **seed-data-plan.md** — Master plan:
      - Every database table with: record count, key data points, insertion order (dependency waves respecting foreign keys)
      - Environment tiers: dev (minimal), staging (production-like volume), demo (curated scenarios)

   b. **seed-organizations.md** — Demo organization(s):
      - Full org profiles with locations, contracts, configurations
      - Multi-tenant scenarios if applicable

   c. **seed-personnel.md** — Named users per role:
      - Realistic names, credentials, role assignments
      - Include interesting scenarios: expiring credentials, locked accounts, multi-role users

   d. **seed-domain-data.md** — Domain-specific seed data:
      - Vertical-specific data (clinical encounters for healthcare, transactions for fintech, orders for e-commerce — whatever the project requires)
      - Must include edge cases, not just happy paths

   e. **seed-operations.md** — Operational data showing realistic patterns:
      - Volume distributions (peak hours, seasonal patterns)
      - Status distributions (% in each state)
      - Historical data for dashboards and reports

5. **Key rule:** Seed data must include interesting scenarios — not just happy paths:
   - Expiring/expired items (triggers alert workflows)
   - Failed/denied items (shows error handling)
   - Edge cases (boundary values, null states, timezone edge cases)
   - Conflicting data (shows resolution workflows)

Update STATE BLOCK: add "16.6-seed-data" to COMPLETED.

---

## Step 16.65: Seed Data JSON Generation (skip if Step 16.6 was skipped)

**Goal:** Convert seed data plans from Step 16.6 into actual JSON files that seed scripts can consume directly. Without concrete JSON, each agent session invents different test data, breaking cross-references and demo consistency.

**Instructions:**

1. Read all seed-data-*.md files from `dev_docs/specs/database/seed-data/`
2. For each major entity described in seed-data-plan.md, generate a JSON file at `dev_docs/specs/database/seed-data/json/{entity-name}.seed.json`
3. Each JSON file must contain tiered data:
   - **dev tier:** 5-10 records (fast seeding for local development)
   - **staging tier:** 20-50 records (realistic volume for integration testing)
   - **demo tier:** Curated scenario records (for stakeholder demos — named, realistic, tells a story)
4. Data must match the entity's schema from the service spec data model (correct types, valid enums, proper FK references)
5. Must include edge case records explicitly marked with comments:
   - Expired/about-to-expire items (triggers alert workflows)
   - Boundary values (max length strings, zero amounts, items at limit)
   - Failed/denied items (shows error handling paths)
   - Multi-status spread (records in every possible status)
6. Foreign key relationships must be internally consistent across files (a crew member references a unit ID that exists in the units seed file)
7. Use realistic, diverse data — real-world names, addresses, product names. Not "Test User 1"

**Target:** One JSON file per major entity type, typically 8-15 files.

Update STATE BLOCK: add "16.65-seed-json" to COMPLETED.

---

## Step 16.7: Directory Population Audit

**Goal:** Verify every directory under `dev_docs/` has at least one substantive file. Populate any empty directories.

**Instructions:**

1. List all directories under `dev_docs/` recursively
2. For each empty directory, either populate it or remove it:

   | Directory | Action |
   |-----------|--------|
   | `dev_docs/audit/` | Should have audit reports (Step 7) or greenfield-baseline.md (Step 7.1) |
   | `dev_docs/components/` | Should have component-catalog.md (Step 8.1) |
   | `dev_docs/decisions/` | Should have decision-log.md (Step 8.2) |
   | `dev_docs/sprints/` | Generate sprint-1.md and sprint-2.md from STATUS.md if not yet done |
   | `dev_docs/specs/database/` | Generate schema-overview.md from service spec data models |
   | `dev_docs/specs/standards/` | Generate coding-standards.md from project's linting config + stack conventions |
   | `dev_docs/comms/diagrams/` | Should have 40-60+ diagrams from Step 9 COMMS TRIGGER + Step 15.7 Diagram Suite. Check `_index.md` for expected count. If fewer than 10, investigate skipped diagrams. |
   | `dev_docs/comms/recurring/` | Generate report-templates.md (weekly status, sprint review, monthly summary templates) |
   | `dev_docs/references/` | Generate reference-links.md (links to framework docs, library docs, kit sources used) |
   | `dev_docs/cx-operations/` | Should be populated by Step 18.7.5. If empty (step hasn't run yet), leave — it's downstream |
   | `dev_docs/quality/` | Must contain: `anti-patterns.md` (Step 16.1), `definition-of-done.md`, `testing-gates.md`. If missing, generate from governance templates. These are MANDATORY for every project. |

3. Present audit results:
   ```
   DIRECTORY POPULATION AUDIT:
     Total directories: {N}
     Already populated: {N}
     Populated this step: {N}
     Remaining empty (downstream steps): {N}
     Removed (unnecessary): {N}
   ```

Update STATE BLOCK: add "16.7-directory-audit" to COMPLETED.

---

### Pre-SB-4 Consistency Audit

Before declaring SB-4, re-run the CROSS-REFERENCE-VALIDATOR (`10-generators/CROSS-REFERENCE-VALIDATOR.md`) with all 12 checks. Steps 13-16.5 generate many new documents (catalogs, integration specs, component contracts, failure specs) that may introduce inconsistencies with earlier specs. Resolve any new mismatches before proceeding to SB-4.

### SESSION BOUNDARY — SB-4: Post-Quality

This is a safe stopping point. Before proceeding:

1. **Update `dev_docs/session-context.md`:**
   - Fill/update all sections with current data
   - Add quality baselines (anti-patterns, security, performance, protection list) to decisions log
   - Append this session to Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (quality baselines, seed data planning, directory audit completed)
   - Next step: Step 17 (Advanced Capabilities Setup)
   - Any open questions or decisions needed
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-4 reached. Core planning and quality baselines are complete. You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

**Autopilot mode:** After persisting all state above, update `.kit/state.json`, then output `KIT_SESSION_BOUNDARY` on its own line and **STOP**. Do not proceed to Step 17. The `kit-autopilot.sh` script will restart you in a fresh session.

---

## Step 17: Advanced Capabilities Setup

**Goal:** Wire in advanced project capabilities from the capabilities library based on the project's specific needs.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Review the project CONFIG and determine which capabilities apply:

   | Condition | Action | Source File |
   |-----------|--------|-------------|
   | Always | Initialize technical debt registry | `11-new-capabilities/technical-debt-registry.template.md` |
   | Always | Generate infrastructure cost estimation | `11-new-capabilities/cost-estimation.template.md` |
   | Always | Generate stakeholder dashboard | `11-new-capabilities/stakeholder-dashboard.template.md` |
   | Always | Generate production operations runbook | `09-deployment-operations/production-operations-runbook.template.md` |
   | Always | Design data lifecycle management | `02-architecture/data-lifecycle-management.template.md` |
   | Always | Assess vendor risk for third-party services | `02-architecture/vendor-risk-assessment.template.md` (if file exists) |
   | CONFIG.CACHE != "none" | Set up caching strategy | `11-new-capabilities/caching-strategy.md` |
   | Feature flags needed | Configure feature flag system | `11-new-capabilities/feature-flags.md` |
   | CONFIG.I18N_ENABLED == "true" | Set up internationalization | `11-new-capabilities/i18n-setup.md` |
   | CONFIG.HAS_WEB == "true" | Define performance budgets | `11-new-capabilities/performance-budgets.md` |
   | CONFIG.ANALYTICS_PROVIDER != "none" | Set up product analytics | `11-new-capabilities/analytics-tracking.md` |
   | CONFIG.HAS_WEB == "true" | Set up accessibility standards | `11-new-capabilities/accessibility-guide.md` |
   | API consumers exist (mobile, third-party) | Generate API documentation plan | `11-new-capabilities/api-documentation.md` |
   | Production deployment planned | Set up backup & recovery strategy | `11-new-capabilities/backup-recovery.md` |
   | Existing project (migration) | Review migration & upgrade guide | `11-new-capabilities/migration-upgrade-guide.md` |
   | Search features needed | Design search architecture | `02-architecture/search-architecture.md` |
   | File uploads needed | Design file upload pipeline | `02-architecture/file-upload-architecture.md` |
   | Always | Generate feature flag registry | `11-new-capabilities/feature-flag-registry.template.md` |
   | Always | Generate capacity planning model | `09-deployment-operations/capacity-planning.template.md` |
   | Always | Generate infrastructure sizing guide | `09-deployment-operations/infrastructure-sizing.template.md` |

- **Enforcement Gate 10 (Infrastructure Cost & Sizing):** The infrastructure sizing guide must include: total monthly cost at 4 tiers (10/50/100/500 tenants), specific server recommendations per tier, database sizing, cost per tenant, break-even analysis, and scaling triggers. See `08-quality-testing/enforcement/ENFORCEMENT-GATES.md` Gate 10.

- **Compliance Cost Overlay:** If `CONFIG.COMPLIANCE_REQUIREMENTS` != "none", also resolve `09-deployment-operations/compliance-cost-overlay.template.md` and add compliance overhead to each tier's cost projection. Compliance costs (BAA premiums, audit log storage, pen testing, workforce training) can add $200-$10,000/mo depending on tier — these must be visible, not hidden in "misc."

2. For each applicable capability:
   - Read the capability guide or template
   - Resolve `{{PLACEHOLDER}}` values from CONFIG
   - Generate the project-specific output document in `dev_docs/`
   - Add relevant configurations to the project (env vars, packages, configs)

3. Set up performance testing infrastructure:
   - Read `08-quality-testing/test-configs/performance-test.config.template.md`
   - Copy and resolve `lighthouse-ci.config.template.json` → project root `lighthouserc.json`
   - Copy and resolve `k6-load-test.template.js` → `test/performance/load-test.js`

4. Set up data migration strategy:
   - Read `02-architecture/migration-strategy.template.md`
   - Generate `dev_docs/migration-strategy.md` with stack-specific rollback procedures

5. Present capability summary:
   ```
   CAPABILITIES CONFIGURED:
     Technical debt registry: initialized at dev_docs/technical-debt-registry.md
     Cost estimation: $[X]/mo estimated at MVP scale
     Stakeholder dashboard: generated at dev_docs/stakeholder-dashboard.md
     Caching: [strategy — provider] or [not needed]
     Feature flags: [provider — count initial flags] or [not needed]
     i18n: [enabled — locales] or [disabled]
     Performance budgets: JS [X]KB, CSS [Y]KB, LCP [Z]s
     Analytics: [provider] configured or [deferred]
     Migration strategy: generated for [ORM]
   ```

Update STATE BLOCK: `CURRENT_STEP: 17.5`, add "17-capabilities" to COMPLETED.

---

## Step 17.5: Financial Modeling

**Goal:** Generate revenue projections, unit economics, and financial viability analysis. This step is now **mandatory** — every project needs at minimum the 20-question financial intake to establish baseline economics.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/financial-profile.md` — think as a CFO. Conservative estimates, investor-grade rigor, data-driven.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/financial-consultant.template.md` for financial modeling decisions.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. **Run the Financial Intake Questionnaire** (mandatory for ALL projects):
   - Read `25-financial-modeling/financial-intake-questionnaire.md`
   - Present all 20 core questions across 4 blocks using AskUserQuestion with selectable options
   - Each question includes a brief "why this matters" explainer for non-financial experts
   - Populate all financial placeholders from answers
   - After core questions, offer optional deep-dive branches (geo, conversion funnels, investor metrics, infrastructure costs, P&L, team costs)

2. Read `25-financial-modeling/financial-modeling-decision-tree.md` to determine which additional templates apply based on intake answers

3. Generate baseline financial documents:
   - Generate `dev_docs/financial-model/revenue-projection.md` from template
   - Generate `dev_docs/financial-model/unit-economics.md` from template
   - Generate `dev_docs/financial-model/break-even-analysis.md` from template
   - Generate `dev_docs/financial-model/burn-rate-runway.md` from template

<!-- IF {{MONETIZATION_MODEL}} == "freemium" -->
   - Generate `dev_docs/financial-model/freemium-conversion.md` from `25-financial-modeling/freemium-trial-conversion-modeling.template.md`
<!-- ENDIF -->

4. **Auto-populate infrastructure costs** from tech stack:
   - Read `25-financial-modeling/stack-cost-mapping.md`
   - Cross-reference with `CONFIG.STACK` values (hosting, DB, auth, AI providers)
   - Generate `dev_docs/financial-model/infrastructure-cost-model.md` with baseline costs pre-filled
   - Present to user for confirmation/adjustment

5. Generate deep-dive documents for any branches the user opted into:
   - Geo-specific economics → `dev_docs/financial-model/geo-economics.md`
   - Conversion funnel deep model → `dev_docs/financial-model/conversion-funnel.md`
   - P&L / Cash flow → `dev_docs/financial-model/pnl-cash-flow.md`
   - Team cost projection → `dev_docs/financial-model/team-costs.md`
   - Investor metrics → enhance `dev_docs/financial-model/investor-dashboard.md`

6. Read `25-financial-modeling/financial-gotchas.md` and flag any risks in the financial model

7. **Feed financial data to investor deck** (if `FUNDRAISING_STAGE` is not "bootstrapping"):
   - Cross-populate key metrics into `40-investor-fundraising/` templates
   - Financial slides in pitch deck auto-filled from model outputs

8. Present financial summary to user with key metrics highlighted:
   - Monthly runway remaining
   - Break-even point (months and user count)
   - Required MRR for sustainability
   - LTV:CAC ratio
   - Top 3 financial risks

Update STATE BLOCK: `CURRENT_STEP: 17.7`, add "17.5-financial" to COMPLETED.

---

## Step 17.7: Tech Stack Health Baseline

**Goal:** Run the first tech stack health audit and establish baseline metrics for ongoing monitoring. Feed infrastructure costs into the financial model.

**Instructions:**

1. Read `49-tech-stack-health/stack-health-audit.template.md`
2. For each major dependency in `CONFIG.STACK`:
   - Check current version vs latest stable (use Context7 or web search for live data)
   - Check for known CVEs (npm audit or equivalent)
   - Note community health indicators (maintenance status)
3. Read `49-tech-stack-health/stack-cost-mapping.md` (cross-reference with `25-financial-modeling/stack-cost-mapping.md`)
4. Generate `dev_docs/audits/stack-health-baseline.md` from template:
   - Version currency table
   - Security status
   - Cost baseline at current scale
   - Cost projection at 10x scale
   - Per-dependency recommendation (KEEP / UPGRADE / MONITOR)
5. Cross-reference infrastructure costs with `dev_docs/financial-model/infrastructure-cost-model.md` (from Step 17.5)
6. Read `49-tech-stack-health/audit-triggers.md` and establish the recurring audit schedule
7. Present baseline to user

Update STATE BLOCK: `CURRENT_STEP: 17.8`, add "17.7-stack-health" to COMPLETED.

---

## Step 17.8: Multi-Tenant Architecture (skip if not multi-tenant)

> _Renumbered from Step 17.6 — previously Step 17.6._

**Goal:** Configure multi-tenant architecture patterns — tenant isolation, billing, rate limiting, and admin interfaces.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. If CONFIG.MULTI_TENANT is "false" → skip to Step 18
2. Read `26-multi-tenant-saas/tenant-isolation-decision-tree.md` and confirm tenant isolation strategy (row-level, schema, or database)
3. Read `26-multi-tenant-saas/row-level-tenant-patterns.template.md` (or schema/database variant) and generate:
   - Tenant-aware database patterns for the project's ORM
   - PostgreSQL RLS policies (if using PostgreSQL + row-level)
   - Composite index strategy for tenant-scoped tables
4. Read `26-multi-tenant-saas/billing-subscription-integration.template.md` and configure:
   - Billing provider integration (Stripe/LemonSqueezy/Paddle)
   - Subscription lifecycle webhook handling
   - Dunning (failed payment) flow
5. Read `26-multi-tenant-saas/usage-metering-rate-limiting.template.md` and configure:
   - Per-tenant rate limiting with Redis
   - Rate limit tiers per subscription plan
6. Read `26-multi-tenant-saas/admin-super-admin-patterns.template.md` and generate admin architecture spec
7. Read `26-multi-tenant-saas/saas-security-checklist.md` and add multi-tenant security items to the project's security checklist
8. Read `26-multi-tenant-saas/saas-gotchas.md` and internalize key warnings

Update STATE BLOCK: `CURRENT_STEP: 18`, add "17.6-multi-tenant" to COMPLETED.

---

## Step 18: Developer Onboarding & Team Setup

**Goal:** Generate team onboarding materials so new developers can be productive within one day.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `06-development-workflow/dev-onboarding.template.md`
2. Resolve all placeholders from CONFIG and generate `dev_docs/DEV-ONBOARDING.md`
3. Populate the onboarding guide with:
   - Exact repository clone and setup commands for the project's stack
   - Database setup steps specific to CONFIG.DATABASE and CONFIG.ORM
   - Environment variable list from the generated `.env.example`
   - Key file map (CLAUDE.md, STATUS.md, HANDOFF.md, PROTECT-LIST.md locations)
   - First-task walkthrough (how to claim and complete a task from STATUS.md)
   - AI agent workflow (session start with `/kickoff`, session end with `/session-end`)
   - Code review and PR process

4. If CONFIG.TEAM_SIZE > 1, generate `dev_docs/team-coordination.md`:
   - Task claiming protocol (check STATUS.md, assign yourself, update status)
   - Communication channels and async handoff process
   - Merge conflict resolution strategy
   - Parallel work guidelines (which services can be worked on independently)
   - Shared resource locking (database migrations, shared packages)

5. Generate quick-reference card at `dev_docs/QUICK-REFERENCE.md`:
   - All project commands in one table (dev, build, test, lint, type-check, migrate, seed)
   - Key URLs (frontend, backend, API docs, Storybook, database admin)
   - File naming conventions
   - Import alias reference

6. Read `02-architecture/state-management-decision-tree.md` and add the chosen state management approach to `dev_docs/system-architecture.md` if not already documented

7. Read `09-deployment-operations/environment-management.md` and generate `dev_docs/environment-guide.md` with environment-specific configuration for this project

8. Generate `dev_docs/ai-orchestration/ai-orchestration-guide.md` from `06-development-workflow/ai-orchestration-guide.template.md` — how to split work across multiple AI agents for parallel development

Update STATE BLOCK: set `CURRENT_STEP: 18.5`, add "18-onboarding" to COMPLETED.

> **Development Workflow Reminder (for all development after planning):**
> Every feature implementation should follow this sequence:
> 1. `/brainstorming` — expand the feature idea before writing code
> 2. `/writing-plans` — plan the implementation approach
> 3. `/feature-dev` — execute the 7-phase guided workflow
> 4. Playwright — take screenshots to verify UI matches spec
> 5. `quality-gate` — score the feature (must pass 6.0/10)
> 6. `/code-review` — review before committing
> 7. `/commit` or `/commit-push-pr` — ship it
> Skipping any step degrades quality. The brainstorming step alone prevents 40% of revision cycles.

---

## Step 18.5: Team Ceremonies Setup

**Goal:** Establish team communication infrastructure, sprint cadence, and ceremony templates so the team has a shared rhythm from day one.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

<!-- IF {{TEAM_SIZE}} > 1 -->
**Instructions:**

1. Read `27-team-communication/ceremony-cadence-planner.md` and select the ceremony set appropriate for `{{TEAM_SIZE}}`:
   - Solo (1): Weekly self-review only
   - Small (2): Async standup + weekly planning
   - Standard (3-5): Full ceremonies (standup, planning, retro, demo)
   - Large (6+): Full ceremonies + health checks + 1-on-1s

2. Generate standup configuration from `27-team-communication/standup-templates.md`:
   - Choose sync vs async standup based on team timezone distribution
   - Configure standup channel and schedule
   - Set up daily standup template (Yesterday / Today / Blockers)

3. Read `27-team-communication/sprint-planning.template.md` and generate initial sprint planning document:
   - Set `{{SPRINT_DURATION}}` (default: 2 weeks)
   - Configure WIP limits per team member
   - Run `SPRINT-PLAN-GENERATOR.md` to create Sprint 1 from STATUS.md backlog

4. Read `27-team-communication/retrospective-formats.md` and select initial retrospective format:
   - Recommend Start/Stop/Continue for Sprint 1 (simplest)
   - Document selected format and schedule

5. Generate stakeholder update cadence from `27-team-communication/stakeholder-update-cadence.template.md`:
   - Map stakeholders to update frequency and format
   - Create first update template
   - **Link recurring comms templates:** Copy resolved versions of `31-stakeholder-communications/recurring/` templates to `dev_docs/comms/recurring/` — these are the weekly, monthly, quarterly, and investor update templates established in Step 1.7
   - Schedule first recurring stakeholder update based on `dev_docs/comms/communication-plan.md` cadence

6. Set up product decision log from `27-team-communication/product-decision-log.template.md` in `dev_docs/decisions/`

7. Read `27-team-communication/async-communication-guide.md` and document team communication norms in `dev_docs/team-norms.md`
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == 1 -->
**Instructions (Solo Developer):**

1. Read `27-team-communication/ceremony-cadence-planner.md` — solo developer section
2. Set up weekly self-review template from `27-team-communication/team-health-check.template.md` (solo self-assessment version)
3. Run `SPRINT-PLAN-GENERATOR.md` to create Sprint 1 from STATUS.md backlog with `{{SPRINT_DURATION}}` (default: 1 week for solo)
4. Set up product decision log from `27-team-communication/product-decision-log.template.md`
<!-- ENDIF -->

**GATE: Sprint 1 plan exists in `dev_docs/sprints/sprint-1.md` with committed tasks from STATUS.md.**

Update STATE BLOCK: set `CURRENT_STEP: 18.6`, add "18.5-team-ceremonies" to COMPLETED.

---

## Step 18.6: Incident Response Planning

**Goal:** Establish severity definitions, response runbooks, and communication templates so production incidents are handled with process, not panic.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `21-incident-response/severity-levels.md` and generate project-specific severity definitions:
   - Map SEV1-SEV4 to `{{PROJECT_NAME}}`-specific scenarios
   - Set response time SLAs: `{{SEV1_RESPONSE_TIME}}` (default: 15 minutes for SEV1)
   - Define escalation triggers per severity level

2. Read `21-incident-response/incident-response-runbook.template.md` and generate `dev_docs/incident-runbook.md`:
   - Assign incident response roles (incident commander, comms lead, technical lead)
   - For solo developers: single person fills all roles with checklist
   - Define detect → triage → communicate → mitigate → resolve → postmortem flow

3. Read `21-incident-response/communication-templates.md` and generate incident communication templates:
   - Internal alert templates (Slack/Discord/email)
   - Customer-facing status page updates (investigating → identified → monitoring → resolved)
   - Stakeholder escalation messages

4. Read `21-incident-response/postmortem-template.template.md` and place in `dev_docs/templates/postmortem.md`

5. Read `21-incident-response/status-page-strategy.md` and configure `{{STATUS_PAGE_PROVIDER}}`:
   - Select status page provider (Betteruptime, Instatus, or self-hosted)
   - Define component list matching service architecture
   - Set up maintenance window protocol

6. Generate common runbooks from `21-incident-response/common-runbooks/`:
   - `database-outage.md`, `api-degradation.md`, `auth-failure.md`, `third-party-outage.md`, `deployment-rollback.md`
   - Customize each for `{{PROJECT_NAME}}`'s specific infrastructure

7. Read `21-incident-response/on-call-rotation.template.md` and generate on-call setup:
   - Configure `{{ONCALL_TOOL}}` (PagerDuty, Opsgenie, or phone-based)
<!-- IF {{TEAM_SIZE}} > 1 -->
   - Set rotation schedule
<!-- ENDIF -->

8. Read `dev_docs/operations/dr-plan-draft.md` (from Step 10.7) as the starting point for DR planning. If this file exists, expand its scenarios into full playbooks below. If it doesn't exist (Step 10.7 was skipped), generate from scratch.
9. Generate DR scenario playbooks from `09-deployment-operations/dr-playbooks.template.md` at `dev_docs/operations/dr-playbooks/` — one playbook per disaster scenario (database corruption, hosting outage, ransomware, region loss, key person unavailable, vendor discontinuation, mass data breach)
10. Generate on-call rotation plan from `09-deployment-operations/on-call-rotation.template.md` at `dev_docs/operations/on-call-rotation.md`

- **Enforcement Gate 9 (DR Verification):** Verify all DR artifacts pass the checklist in `08-quality-testing/enforcement/dr-verification.template.md`: 7 playbooks exist, backup restore tested (proof required), RPO/RTO documented and achievable, on-call rotation defined with real roles, runbooks are step-by-step (not strategy paragraphs). Generate `dev_docs/completeness/dr-verification-report.md` with per-check pass/fail.

**GATE: Incident runbook exists with severity definitions and at least 3 common runbooks generated.**

Update STATE BLOCK: set `CURRENT_STEP: 18.7`, add "18.6-incident-response" to COMPLETED.

---

## Step 18.7: Customer Support Planning

**Goal:** Design the support infrastructure so user questions have a clear path from submission to resolution.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `23-customer-support/support-platform-decision-tree.md` and select `{{SUPPORT_PLATFORM}}`:
   - Evaluate: Intercom vs Zendesk vs Crisp vs HelpScout vs self-built
   - Factors: team size, budget, AI capabilities, integration needs

2. Read `23-customer-support/knowledge-base-architecture.template.md` and generate KB structure plan:
   - Define categories based on `{{PROJECT_NAME}}`'s feature areas
   - Create article templates and maintenance cadence
   - Plan integration with `18-user-documentation/` output

3. Read `23-customer-support/sla-definitions.template.md` and generate support SLAs:
   - Define response times by channel and tier: `{{FREE_TIER_SLA}}` (default: 48 hours)
   - Set resolution time targets
   - Configure escalation triggers

4. Read `23-customer-support/bug-report-pipeline.template.md` and generate bug report workflow:
   - Report template (steps to reproduce, expected vs actual, environment, severity)
   - Triage rubric and priority assignment
   - Integration with STATUS.md backlog

5. Read `23-customer-support/support-escalation-workflow.md` and document escalation path:
   - L1 (self-serve/bot) → L2 (support agent) → L3 (engineering)
   - Context preservation requirements at each handoff

6. Read `23-customer-support/canned-responses.template.md` and generate initial response templates:
   - Welcome, bug acknowledged, feature request logged, billing inquiry, account issues

7. Read `23-customer-support/support-chatbot-integration.md` and plan AI support integration if applicable

**GATE: Support SLA document exists and bug report pipeline is defined.**

Update STATE BLOCK: set `CURRENT_STEP: 18.7.5`, add "18.7-customer-support" to COMPLETED.

---

## Step 18.7.5: Customer Experience Operations

**Goal:** Build the operational CX layer on top of Step 18.7's support strategy — AI chatbots, self-service knowledge centers, omnichannel routing, customer health scoring, and team operations.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Prerequisites:** Step 18.7 complete (support strategy finalized, platform decisions locked).

**Conditional:** This step runs for all paths except Express and Lite. If `CX_OPS_LEVEL` is "skip", skip this step entirely.

**Instructions:**

1. Read `33-customer-experience-ops/cx-maturity-assessment.md` — assess the project's CX maturity level based on team size, ticket volume, and product complexity. Set `CX_MATURITY_LEVEL` in CONFIG.

2. Read `33-customer-experience-ops/README.md` — understand the full section scope, reading order, and cross-references to Sections 23, 24, 18, 19, 20, and 25.

3. Based on `CX_MATURITY_LEVEL`, resolve templates in priority order:

   **Level 1 — Reactive** (solo founder or first hire, < 200 tickets/month):
   - `ai-support-chatbot-blueprint.template.md` — design AI chatbot RAG pipeline
   - `self-service-knowledge-center.template.md` — architect help center
   - `feedback-collection-system.template.md` — set up systematic feedback collection

   **Level 2 — Structured** (small team, 200-1000 tickets/month):
   - All Level 1 templates, plus:
   - `omnichannel-decision-tree.md` — decide which channels to support
   - `unified-inbox-architecture.template.md` — configure conversation routing
   - `nps-csat-automation.template.md` — automate satisfaction surveys

   **Level 3 — Proactive** (scaled team, 1000+ tickets/month):
   - All Level 2 templates, plus:
   - `customer-health-scoring.template.md` — build churn prediction model
   - `contextual-in-app-help.template.md` — design in-app guidance
   - `cx-analytics-dashboard.template.md` — unified CX dashboard

   **Level 4 — Predictive** (mature CX org):
   - All Level 3 templates, plus:
   - `chatbot-training-data.template.md` — training data curation and evaluation
   - `community-and-developer-portal.md` — community and developer resources
   - `ticketing-system-decision-tree.md` — build vs. integrate ticketing
   - `support-team-hiring.template.md` — role definitions, interview rubrics
   - `agent-onboarding-playbook.template.md` — 30-day structured onboarding
   - `qa-scoring-and-coaching.template.md` — QA rubrics, coaching programs
   - `cx-ops-gotchas.md` — production lessons (read, don't template)

4. Save all resolved templates to `dev_docs/cx-operations/`

4.5. **CX Playbook Generation (all maturity levels):**
   Regardless of maturity level, generate these foundational CX playbooks in `dev_docs/cx-operations/`:

   a. `onboarding-playbook.md` — Customer onboarding flow:
      - Day-by-day 30-day plan with tasks, owners, success criteria
      - Milestone checkpoints (Day 1, Day 7, Day 14, Day 30)
      - Automated triggers (welcome email, check-in, feature tips)
      - "Aha moment" definition and measurement

   b. `support-runbooks.md` — Top 20 common support scenarios:
      - Symptom → Diagnosis → Resolution steps
      - Escalation criteria per scenario
      - Self-service deflection opportunities

   c. `customer-journey-map.md` — Full lifecycle:
      - Awareness → Consideration → Purchase → Onboarding → Adoption → Expansion → Advocacy
      - CX touchpoints at each stage
      - Metrics per stage

   **For maturity Level 2+:**

   d. `health-scoring-model.md` — Reference `33-customer-experience-ops/customer-health-scoring.template.md`:
      - 10 weighted scoring dimensions
      - Score calculation formula
      - Tier-based intervention playbooks (healthy/at-risk/critical)

   e. `data-migration-playbook.md` — How customers migrate data into the system:
      - Per-competitor migration guide (data export format, field mapping, validation rules)
      - Rollback procedures
      - Support escalation during migration

   Depth requirement: each playbook minimum 400 words with specific scenarios, not generic "handle customer issues."

5. Generate CX implementation tasks and add to the appropriate phase task files

6. Present summary:
```
CX OPERATIONS PLAN COMPLETE

Maturity level: {CX_MATURITY_LEVEL}
Templates resolved: {COUNT}
CX tasks generated: {TASK_COUNT}

Key decisions:
  Chatbot: {CX_CHATBOT_PROVIDER} with {CX_LLM_MODEL}
  Channels: {CX_CHANNELS}
  Health scoring: {YES/NO}
  Self-service target: {CX_SELF_SERVE_TARGET}
```

**GATE: User reviews CX operations plan. Semi-auto: approve or defer individual components.**

Update STATE BLOCK: set `CURRENT_STEP: 18.75`, add "18.7.5-cx-operations" to COMPLETED.

---

## Step 18.75: Customer Migration & Data Import (skip if `CONFIG.MIGRATION_SUPPORT == "false"`)

**Goal:** Design the migration and data import infrastructure — import wizard UX, CSV/API migration tooling, competitor-switch playbooks, data validation, bulk processing architecture, and migration support runbooks — that reduces switching costs for new customers leaving competitors.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `45-customer-migration-import/migration-strategy-decision-tree.md` — determine migration approach, data volume expectations, and competitor import priorities. Set `CONFIG.MIGRATION_STRATEGY`, `CONFIG.IMPORT_FORMATS`, `CONFIG.HISTORICAL_DATA_POLICY`.

2. Generate import infrastructure:
   - Read `45-customer-migration-import/import-wizard-ux.template.md` → generate `dev_docs/migration/import-wizard.md`
   - Read `45-customer-migration-import/csv-import-architecture.template.md` → generate `dev_docs/migration/csv-import.md`
   - Read `45-customer-migration-import/data-mapping-transformation.template.md` → generate `dev_docs/migration/data-mapping.md`
   - Read `45-customer-migration-import/data-cleansing-rules.template.md` → generate `dev_docs/migration/data-cleansing.md`

3. Generate processing & validation:
   - Read `45-customer-migration-import/bulk-import-architecture.template.md` → generate `dev_docs/migration/bulk-import.md`
   - Read `45-customer-migration-import/migration-validation-rollback.template.md` → generate `dev_docs/migration/validation-rollback.md`
   - Read `45-customer-migration-import/migration-progress-tracking.template.md` → generate `dev_docs/migration/progress-tracking.md`

4. Generate competitor-specific tooling:
   - Read `45-customer-migration-import/competitor-switch-playbook.template.md` → generate `dev_docs/migration/competitor-switch-guides.md`
<!-- IF {{MIGRATION_STRATEGY}} != "self-serve" -->
   - Read `45-customer-migration-import/api-migration-tooling.template.md` → generate `dev_docs/migration/api-migration.md`
<!-- ENDIF -->

5. Read `45-customer-migration-import/migration-support-runbook.template.md` → generate `dev_docs/migration/support-runbook.md`

6. Read `45-customer-migration-import/migration-gotchas.md` and flag applicable risks.

**GATE: Import wizard UX covers upload through completion. CSV import handles encoding detection and validation. At least one competitor switch guide generated. Rollback procedure documented.**

Update STATE BLOCK: set `CURRENT_STEP: 18.8`, add "18.75-migration" to COMPLETED.

---

## Step 18.8: Post-Launch Lifecycle Setup

**Goal:** Prepare the operational processes that sustain a product after launch day — monitoring, feedback loops, release cadence, and roadmapping.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `20-post-launch/post-launch-checklist.template.md` and generate `dev_docs/post-launch-checklist.md`:
   - Day 1, Week 1, Month 1, Month 3 checklists customized for `{{PROJECT_NAME}}`
   - Cross-reference monitoring setup from Step 15 (Observability)

2. Read `20-post-launch/user-feedback-loops.template.md` and generate feedback collection plan:
   - Configure `{{FEEDBACK_CHANNEL}}` (in-app, email, Discord, etc.)
   - Set up feedback → backlog pipeline
   - Define tagging taxonomy and review cadence

3. Read `20-post-launch/product-roadmap.template.md` and generate roadmap structure:
   - Now/Next/Later format initialized from STATUS.md backlog
   - Configure `{{PUBLIC_ROADMAP}}` visibility (public or internal)

4. Read `20-post-launch/release-cadence-strategy.md` and set `{{RELEASE_CADENCE}}`:
   - Choose release train vs continuous delivery vs hybrid
   - Document semantic versioning rules for `{{PROJECT_NAME}}`
   - Set up changelog format

5. Read `20-post-launch/feature-request-triage.md` and document triage process:
   - RICE scoring framework configured for project priorities
   - "How to say no" templates

6. Read `20-post-launch/post-launch-metrics-dashboard.template.md` and generate metrics plan:
   - DAU/MAU targets, retention curve definitions, error rate budgets
   - Cross-reference with analytics setup from marketing Step 28 (if completed)

7. Read `20-post-launch/api-versioning-strategy.md` and document API versioning approach (if project has public API)

8. Read `20-post-launch/feature-deprecation-playbook.md` and note deprecation protocol for future reference

9. Generate usability testing plan from `03-documentation/testing-docs/usability-testing-plan.template.md` at `dev_docs/research/usability-testing-plan.md`
10. Generate beta program structure from `03-documentation/testing-docs/beta-program.template.md` at `dev_docs/research/beta-program.md`

**GATE: Ask if the user wants to continue to Marketing Planning (Steps 19-28) or start coding now.**

If user chooses to skip marketing → Update STATE BLOCK: set `CURRENT_STEP: 18.85`, add "18.8-post-launch" to COMPLETED.
If user chooses to continue to marketing → Update STATE BLOCK: set `CURRENT_STEP: 18.85`, add "18.8-post-launch" to COMPLETED.

### SESSION BOUNDARY — SB-5: Post-Operations

This is a safe stopping point. Before proceeding:

1. **Update `dev_docs/session-context.md`:**
   - Fill/update all sections with current data
   - Add operational decisions (incident response, support, CX, post-launch) to decisions log
   - Record user's marketing decision (skip or continue)
   - Append this session to Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (operations planning complete)
   - Next step: Step 18.85 (Team & Hiring Operations) then Step 19 (Marketing) or Step 29 (Hardening) based on user's choice
   - Any open questions or decisions needed
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-5 reached. Operations planning is complete. You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

**Autopilot mode:** After persisting all state above, update `.kit/state.json`. For the marketing decision at Step 18.8, auto-resolve: include marketing steps (19-28) unless CONFIG explicitly disables them. Then output `KIT_SESSION_BOUNDARY` on its own line and **STOP**. Do not proceed to Step 18.85. The `kit-autopilot.sh` script will restart you in a fresh session.

---

## Step 18.85: Team & Hiring Operations (skip if `CONFIG.TEAM_SIZE == 1`)

**Goal:** Design the organizational infrastructure — hiring playbooks, compensation frameworks, org chart, role definitions, performance reviews, and culture documentation — that scales the team from its current size to 10x without organizational debt.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `41-team-hiring-ops/team-scaling-decision-tree.md` — determine hiring approach, compensation model, and work location policy. Set `CONFIG.WORK_LOCATION_POLICY`, `CONFIG.COMPENSATION_MODEL`, `CONFIG.FIRST_HIRE_ROLE`.

2. Generate organizational structure:
   - Read `41-team-hiring-ops/org-chart-planning.template.md` → generate `dev_docs/team-ops/org-chart.md`
   - Read `41-team-hiring-ops/role-definition-framework.template.md` → generate `dev_docs/team-ops/role-definitions.md`
   - Read `41-team-hiring-ops/culture-documentation.template.md` → generate `dev_docs/team-ops/culture.md`

3. Generate hiring infrastructure:
   - Read `41-team-hiring-ops/engineering-hiring-playbook.template.md` → generate `dev_docs/team-ops/hiring-playbook.md`
   - Read `41-team-hiring-ops/interview-process.template.md` → generate `dev_docs/team-ops/interview-process.md`
   - Read `41-team-hiring-ops/compensation-framework.template.md` → generate `dev_docs/team-ops/compensation.md`

4. Generate people operations:
   - Read `41-team-hiring-ops/employee-onboarding.template.md` → generate `dev_docs/team-ops/employee-onboarding.md`
   - Read `41-team-hiring-ops/performance-review.template.md` → generate `dev_docs/team-ops/performance-reviews.md`
   - Read `41-team-hiring-ops/remote-hybrid-policy.template.md` → generate `dev_docs/team-ops/remote-policy.md`
   - Read `41-team-hiring-ops/team-health-assessment.template.md` → generate `dev_docs/team-ops/team-health.md`

<!-- IF {{RECRUITER_MODEL}} == "external-agency" -->
5. Read `41-team-hiring-ops/contractor-vendor-management.template.md` → generate `dev_docs/team-ops/vendor-management.md`
<!-- ENDIF -->

6. Read `41-team-hiring-ops/hiring-ops-gotchas.md` and flag applicable risks.

**GATE: At least 8 team operations artifacts generated. Org chart reflects current team + planned hires. Compensation framework includes at least 3 IC levels with salary bands.**

Update STATE BLOCK: set `CURRENT_STEP: 18.9`, add "18.85-team-ops" to COMPLETED.

---

## Step 18.9: Security Lifecycle Setup

**Goal:** Establish ongoing security monitoring cadence, initialize the security posture dashboard, and set up vulnerability tracking. This extends the one-time security hardening from Step 14 into a living security program.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/security-profile.md` — think as a security engineer. Assume breach is inevitable.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/security-consultant.template.md` for security lifecycle setup.

**Instructions:**

1. Read `50-security-lifecycle/security-posture-dashboard.template.md`
2. Generate `dev_docs/security/security-posture-dashboard.md`:
   - Populate initial security grade from Step 14 findings
   - Fill security headers status from architecture decisions
   - Fill authentication coverage from auth specs
   - Fill compliance status from `CONFIG.COMPLIANCE_REQUIREMENTS`
3. Read `50-security-lifecycle/recurring-audit-protocol.md`
4. Generate `dev_docs/security/recurring-audit-schedule.md`:
   - Map audit cadence to project's sprint/release schedule
   - Identify which checks are automated vs manual
   - Set up CI integration recommendations for automated scans
5. Read `50-security-lifecycle/vulnerability-tracker.template.md`
6. Generate `dev_docs/security/vulnerability-tracker.md`:
   - Initialize with any open findings from Step 14
   - Set SLAs based on project's risk profile
7. Read `50-security-lifecycle/dependency-scan-protocol.md`
8. Generate CI pipeline security scan configuration recommendations
9. Present security lifecycle summary to user

**GATE: Security posture dashboard generated with initial grade. Recurring audit schedule established. Vulnerability tracker initialized.**

Update STATE BLOCK: set `CURRENT_STEP: 19`, add "18.9-security-lifecycle" to COMPLETED.

---

## Step 19: Marketing Discovery & Research

**Goal:** Understand the product from a marketing perspective and research the competitive landscape.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/marketing-profile.md` — think as a growth strategist. Audience-first, credibility-focused. This profile stays active through Step 28.
CONSULTANT PERSONA: Load `48-ai-agent-personas/consultant-roles/marketing-consultant.template.md` for all marketing steps (19-28).

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count (applies to all marketing steps 19-28).

**Instructions:**

1. Read `19-marketing/marketing-intake.md` and conduct marketing-specific interview:
   - Product type (SaaS, mobile app, marketplace, dev tool, client site, etc.)
   - Target audience (who buys, who uses, where they hang out online)
   - Marketing budget range (bootstrap $0, small <$500/mo, medium <$2K/mo, growth >$2K/mo)
   - Launch timeline (when do they want first users)
   - Revenue goals (first $1K, first $10K, first $100K)
   - Competitor list (from Tribunal Step 3 + any additions)

2. Read `19-marketing/channel-decision-tree.md` and determine recommended channels based on product type, audience, and budget

3. Run `19-marketing/generators/COMPETITOR-MARKETING-ANALYZER.md` using Firecrawl/WebSearch:
   - Analyze competitor websites, pricing pages, social media presence
   - Document their marketing channels, messaging, positioning
   - Identify gaps and opportunities

4. Generate from templates:
   - Market sizing from `19-marketing/market-research/market-sizing.template.md`
   - Competitor marketing audit from `19-marketing/market-research/competitor-marketing-audit.template.md`
   - Audience research from `19-marketing/market-research/audience-research.template.md`
   - Positioning strategy from `19-marketing/market-research/positioning-strategy.template.md`
   - Marketing SWOT from `19-marketing/market-research/swot-marketing.template.md`

5. Build MARKETING_CONFIG in STATE BLOCK:
   ```
   MARKETING_CONFIG: {
     PRODUCT_TYPE: "saas" | "mobile_app" | "marketplace" | "dev_tool" | "client_site" | "other",
     TARGET_AUDIENCE: "...",
     MARKETING_BUDGET: "bootstrap" | "small" | "medium" | "growth",
     LAUNCH_TIMELINE: "...",
     REVENUE_GOAL: "...",
     PRIMARY_CHANNELS: ["..."],
     MONETIZATION_MODEL: "subscription" | "freemium" | "one-time" | "marketplace-fee" | "usage-based" | "ad-supported",
     HAS_MOBILE_APP: "true" | "false",
     BRAND_VOICE: "professional" | "casual" | "technical" | "playful"
   }
   ```

6. Present positioning summary:
   ```
   MARKETING RESEARCH COMPLETE:
     Product type: [type]
     Target audience: [audience]
     Market size: [TAM/SAM/SOM]
     Key competitors: [list with marketing strengths/weaknesses]
     Positioning: [one-sentence positioning statement]
     Recommended channels: [top 3-4 with rationale]
   ```

**GATE: User reviews positioning strategy and confirms target audience and competitive positioning.**

Update STATE BLOCK: `CURRENT_STEP: 20`, add "19-marketing-research" to COMPLETED.

---

## Step 20: Brand, Messaging & Pricing

**Goal:** Define brand voice, core messaging, and pricing strategy.

**Instructions:**

1. Generate brand and messaging documents from templates:
   - Brand voice guide from `19-marketing/brand-messaging/brand-voice-guide.template.md`
   - Value proposition canvas from `19-marketing/brand-messaging/value-proposition-canvas.template.md`
   - Messaging framework from `19-marketing/brand-messaging/messaging-framework.template.md`
   - Storytelling framework from `19-marketing/brand-messaging/storytelling-framework.template.md`
   - Objection handling from `19-marketing/brand-messaging/objection-handling.template.md`

2. Generate pricing strategy:
   - Pricing strategy from `19-marketing/pricing-monetization/pricing-strategy.template.md`
   - Revenue model analysis from `19-marketing/pricing-monetization/revenue-model-selection.md`
   - Competitive pricing from `19-marketing/pricing-monetization/competitive-pricing-analysis.template.md`

<!-- IF {{MONETIZATION_MODEL}} == "freemium" -->
   - Freemium optimization from `19-marketing/pricing-monetization/freemium-optimization.md`
<!-- ENDIF -->

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->
   - Trial optimization from `19-marketing/pricing-monetization/trial-optimization.md`
<!-- ENDIF -->

3. Read `19-marketing/marketing-gotchas/pricing-mistakes.md` and flag any risks in the pricing strategy

Update STATE BLOCK: `CURRENT_STEP: 21`, add "20-brand-pricing" to COMPLETED.

---

## Step 21: Marketing Strategy & Channel Plan

**Goal:** Create the master marketing strategy with channel selection, budget allocation, and KPIs.

**Instructions:**

1. Read `19-marketing/channel-decision-tree.md` and apply to MARKETING_CONFIG
2. Read `19-marketing/marketing-budget-framework.md` and allocate budget by channel

3. Run `19-marketing/generators/MARKETING-PLAN-GENERATOR.md` to generate:
   - Master marketing strategy document (channels, timeline, budget, KPIs)
   - Channel-specific strategies with priority ranking
   - 90-day marketing roadmap (month 1: foundation, month 2: launch, month 3: growth)

4. Generate analytics and tracking setup:
   - Analytics setup from `19-marketing/analytics-and-tracking/analytics-setup-guide.template.md`
   - Conversion tracking plan from `19-marketing/analytics-and-tracking/conversion-tracking.template.md`
   - KPI dashboard from `19-marketing/analytics-and-tracking/kpi-dashboard.template.md`

5. Generate CRM and automation plan:
   - CRM setup from `19-marketing/automation-crm/crm-setup-guide.template.md`
   - Marketing automation workflows from `19-marketing/automation-crm/marketing-automation-workflows.template.md`
   - Lead scoring from `19-marketing/automation-crm/lead-scoring.template.md`
   - Tools integration map from `19-marketing/automation-crm/tools-integration-map.md`

6. Generate legal compliance docs:
   - Privacy requirements from `19-marketing/legal-compliance/privacy-policy-guide.md`
   - Email compliance from `19-marketing/legal-compliance/email-compliance.md`
   - Cookie consent from `19-marketing/legal-compliance/cookie-consent-guide.md`

7. Present channel strategy summary:
   ```
   MARKETING STRATEGY OVERVIEW:
     Product type: [type]
     Budget: [range] / month
     Primary channels: [top 3-4 channels with rationale]
     Secondary channels: [2-3 channels for later]
     Launch date target: [date]
     Month 1 focus: [foundation activities]
     Month 2 focus: [launch activities]
     Month 3 focus: [growth activities]
     Key KPIs: [top 5 metrics with targets]
   ```

**GATE: User approves channel strategy, budget allocation, and marketing timeline.**

Update STATE BLOCK: `CURRENT_STEP: 22`, add "21-marketing-strategy" to COMPLETED.

---

## Step 22: Website, Landing Pages & Conversion

**Goal:** Generate landing page blueprints, homepage strategy, and conversion optimization plan.

**Instructions:**

1. Run `19-marketing/generators/LANDING-PAGE-COPY-GENERATOR.md` to generate:
   - Primary landing page copy (hero, features, social proof, CTA sections)
   - Pricing page structure and copy
   - Multiple headline/CTA variants for A/B testing

2. Generate from templates:
   - Landing page blueprint from `19-marketing/website-and-landing-pages/landing-page-blueprint.template.md`
   - Homepage strategy from `19-marketing/website-and-landing-pages/homepage-strategy.template.md`
   - Pricing page from `19-marketing/website-and-landing-pages/pricing-page-strategy.template.md`
   - Conversion optimization checklist from `19-marketing/website-and-landing-pages/conversion-optimization.md`
   - Social proof playbook from `19-marketing/website-and-landing-pages/social-proof-playbook.md`

3. Read `19-marketing/website-and-landing-pages/copywriting-formulas.md` and apply frameworks to all generated copy

4. Generate SEO foundation:
   - Run SEO maturity assessment from `36-seo/seo-maturity-assessment.md` to determine SEO depth tier
   - SEO strategy from `36-seo/strategy/seo-strategy.template.md`
   - Technical SEO checklist from `36-seo/technical/technical-seo-checklist.md`
   - On-page SEO checklist from `36-seo/on-page/on-page-seo-checklist.md`
   - Generate files from `36-seo/` based on the maturity tier (Tier 1: technical + on-page only; Tier 2+: add strategy, content SEO, measurement)

5. Generate interactive walkthrough demo (conversion tool for lead generation):
   - Fill planning templates from `19-marketing/walkthrough-demo/`:
     - Demo strategy from `19-marketing/walkthrough-demo/demo-strategy.template.md`
     - Feature map from `19-marketing/walkthrough-demo/feature-map.template.md`
     - Demo script from `19-marketing/walkthrough-demo/demo-script.template.md`
     - Sandbox config from `19-marketing/walkthrough-demo/sandbox-config.template.md`
     - CTA/lead capture from `19-marketing/walkthrough-demo/cta-lead-capture.template.md`
     - Mobile adaptation from `19-marketing/walkthrough-demo/mobile-adaptation.template.md`
     - Analytics tracking from `19-marketing/walkthrough-demo/analytics-tracking.template.md`
   - Run `19-marketing/walkthrough-demo/WALKTHROUGH-DEMO-GENERATOR.md` to generate:
     - Customized demo engine (guided tour + free explore + hotspots)
     - `demo-config.json` with tour steps, CTAs, and sandbox data
     - Deployment-ready HTML/JS/CSS bundle
   - Inputs required: feature list (Step 4), brand voice (Step 20), user personas (Step 3/Tribunal)

Update STATE BLOCK: `CURRENT_STEP: 23`, add "22-website-conversion" to COMPLETED.

---

## Step 23: Content, Social Media & Video Strategy

**Goal:** Create content calendar, social media strategy, and video marketing plan.

**Instructions:**

1. Generate content strategy:
   - Content calendar from `19-marketing/seo-and-content/content-calendar.template.md`
   - Blog strategy from `19-marketing/seo-and-content/blog-strategy.template.md`
   - Content repurposing plan from `19-marketing/seo-and-content/content-repurposing.md`

2. Generate social media strategy:
   - Platform selection from `19-marketing/social-media/platform-selection.template.md` (based on PRODUCT_TYPE and TARGET_AUDIENCE)
   - Social content calendar from `19-marketing/social-media/social-content-calendar.template.md`
   - Platform-specific playbooks (only for selected platforms — read from `19-marketing/social-media/`)
   - Community building plan from `19-marketing/social-media/community-building.template.md`

3. Run `19-marketing/generators/SOCIAL-CONTENT-GENERATOR.md` to generate first month of content

4. Generate video strategy:
   - Demo video plan from `19-marketing/video-marketing/demo-video-strategy.template.md`
   - Platform-specific video strategy (YouTube, TikTok/Shorts based on selected platforms)

5. Generate webinar/podcast strategy (if applicable for product type):
   - Webinar funnel from `19-marketing/webinars-podcasts-events/webinar-funnel.template.md`
   - Podcast guesting from `19-marketing/webinars-podcasts-events/podcast-guesting-strategy.md`

Update STATE BLOCK: `CURRENT_STEP: 24`, add "23-content-social" to COMPLETED.

---

## Step 24: Email Marketing System

**Goal:** Set up complete email marketing infrastructure with ready-to-use sequences.

**Instructions:**

1. Generate from templates:
   - List building strategy from `19-marketing/email-marketing/list-building-strategy.template.md`
   - Welcome sequence from `19-marketing/email-marketing/welcome-sequence.template.md` (actual email copy)
   - Newsletter strategy from `19-marketing/email-marketing/newsletter-strategy.template.md`
   - Sales sequences from `19-marketing/email-marketing/sales-email-sequences.template.md` (actual copy)
   - Automation workflows from `19-marketing/email-marketing/email-automation-workflows.template.md`

2. Run `19-marketing/generators/EMAIL-SEQUENCE-GENERATOR.md` to generate:
   - 5-7 email welcome/onboarding sequence with subject lines and body copy
   - 3-5 email sales nurture sequence
   - 3 email win-back sequence

3. Read `19-marketing/email-marketing/email-deliverability-checklist.md` and generate project-specific deliverability setup guide

4. Read `19-marketing/legal-compliance/email-compliance.md` and flag requirements for the project's target markets

Update STATE BLOCK: `CURRENT_STEP: 25`, add "24-email-marketing" to COMPLETED.

---

## Step 25: Launch Strategy & Directory Listings

**Goal:** Create complete pre-launch, launch day, and post-launch execution plans.

**Instructions:**

1. Generate launch plan:
   - Pre-launch playbook from `19-marketing/launch-strategy/pre-launch-playbook.template.md`
   - Launch day checklist from `19-marketing/launch-strategy/launch-day-checklist.template.md`
   - Post-launch playbook from `19-marketing/launch-strategy/post-launch-playbook.template.md`
   - Beta program design from `19-marketing/launch-strategy/beta-program.template.md`

2. Generate platform-specific launch guides (conditional on product type):

<!-- IF {{PRODUCT_TYPE}} == "saas" || {{PRODUCT_TYPE}} == "dev_tool" -->
   - Product Hunt guide from `19-marketing/launch-strategy/product-hunt-guide.md`
   - Hacker News guide from `19-marketing/launch-strategy/hacker-news-guide.md`
<!-- ENDIF -->

3. Generate directory listings:
   - Select relevant directories from `19-marketing/directory-and-listings/directory-master-list.md` based on product type
   - Generate listing copy from `19-marketing/directory-and-listings/listing-optimization.template.md`
   - Review generation plan from `19-marketing/directory-and-listings/review-generation-strategy.md`

<!-- IF {{HAS_MOBILE_APP}} == "true" -->
4. Generate app store marketing:
   - ASO strategy from `19-marketing/marketplace-aso/app-store-optimization.template.md`
   - Review management from `19-marketing/marketplace-aso/review-management.md`
<!-- ENDIF -->

5. Read `19-marketing/marketing-gotchas/launch-mistakes.md` and flag risks

6. Present launch timeline:
   ```
   LAUNCH PLAN SUMMARY:
     Pre-launch: [X] days of [activities]
     Launch day: [hour-by-hour plan]
     Post-launch: [30-day plan]
     Directories: [N] listings to submit
     Beta program: [yes/no] — [X] target beta users
     Platform launches: [Product Hunt / HN / App Store / etc.]
   ```

**GATE: User reviews and approves launch strategy and timeline.**

Update STATE BLOCK: `CURRENT_STEP: 26`, add "25-launch-strategy" to COMPLETED.

---

## Step 26: Growth, Outreach & Referral Systems

**Goal:** Set up growth engines — outreach, partnerships, paid acquisition, and referral systems.

**Instructions:**

1. Generate outreach strategy:
   - Cold outreach from `19-marketing/outreach-and-partnerships/cold-outreach-playbook.template.md`
   - Influencer marketing from `19-marketing/outreach-and-partnerships/influencer-marketing.template.md`
   - Partnership strategy from `19-marketing/outreach-and-partnerships/partnership-strategy.template.md`
   - PR/media outreach from `19-marketing/outreach-and-partnerships/pr-media-outreach.template.md`

2. Generate paid advertising plan (conditional on budget):

<!-- IF {{MARKETING_BUDGET}} == "medium" || {{MARKETING_BUDGET}} == "growth" -->
   - Paid ads strategy from `19-marketing/paid-advertising/paid-ads-strategy.template.md`
   - Run `19-marketing/generators/AD-COPY-GENERATOR.md` to generate ad copy variations
   - Retargeting strategy from `19-marketing/paid-advertising/retargeting-strategy.md`
<!-- ENDIF -->

<!-- IF {{MARKETING_BUDGET}} == "bootstrap" || {{MARKETING_BUDGET}} == "small" -->
   - Note: Paid advertising deferred until organic channels established and budget allows. Read `19-marketing/paid-advertising/paid-ads-strategy.template.md` for reference on when to start.
<!-- ENDIF -->

3. Generate referral/viral systems:
   - Referral program from `19-marketing/referral-viral/referral-program.template.md`
   - Viral loop design from `19-marketing/referral-viral/viral-loop-design.md` (by product type)
   - Word-of-mouth engineering from `19-marketing/referral-viral/word-of-mouth-engineering.md`

4. Generate AI marketing setup:
   - AI content generation plan from `19-marketing/ai-marketing/ai-content-generation.md`
   - AI chatbot spec from `19-marketing/ai-marketing/ai-chatbot-lead-capture.template.md`
   - AI tools recommendation from `19-marketing/ai-marketing/ai-marketing-tools-guide.md`

5. Read `19-marketing/marketing-gotchas/growth-mistakes.md` and flag risks

Update STATE BLOCK: `CURRENT_STEP: 27`, add "26-growth-outreach" to COMPLETED.

---

## Step 27: Onboarding & Retention

**Goal:** Design user activation flows and retention systems to keep users engaged.

**Instructions:**

1. Generate onboarding:
   - Activation flow from `19-marketing/onboarding-retention/activation-flow.template.md`
   - Onboarding sequence from `19-marketing/onboarding-retention/user-onboarding-sequence.template.md`

2. Generate retention systems:
   - Churn prevention from `19-marketing/onboarding-retention/churn-prevention.template.md`
   - Re-engagement campaigns from `19-marketing/onboarding-retention/re-engagement-campaigns.template.md`
   - NPS/feedback system from `19-marketing/onboarding-retention/nps-feedback-system.template.md`

3. Read `19-marketing/onboarding-retention/retention-metrics-playbook.md` and define project-specific retention KPIs

4. Generate upsell strategy (conditional on monetization model):

<!-- IF {{MONETIZATION_MODEL}} == "freemium" -->
   - Freemium optimization from `19-marketing/pricing-monetization/freemium-optimization.md`
<!-- ENDIF -->

<!-- IF {{MONETIZATION_MODEL}} == "subscription" -->
   - Trial optimization from `19-marketing/pricing-monetization/trial-optimization.md`
<!-- ENDIF -->

   - Upsell playbook from `19-marketing/pricing-monetization/upsell-cross-sell-playbook.md`

Update STATE BLOCK: `CURRENT_STEP: 27.5`, add "27-onboarding-retention" to COMPLETED.

---

## Step 27.5: Product-Led Growth (skip if `CONFIG.GROWTH_MODEL != "product-led"`)

**Goal:** Design the in-product growth engine — growth loops, PQL scoring, self-serve upgrade flows, activation experiments, viral mechanics, and product analytics instrumentation — that turns your product into its own primary acquisition and expansion channel.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `44-product-led-growth/plg-readiness-decision-tree.md` — confirm PLG fit, determine primary motion, and set monetization trigger. Set `CONFIG.PLG_MOTION`, `CONFIG.ACTIVATION_METRIC`, `CONFIG.PAYWALL_STRATEGY`.

2. Generate growth foundation:
   - Read `44-product-led-growth/growth-loops.template.md` → generate `dev_docs/plg/growth-loops.md`
   - Read `44-product-led-growth/product-analytics-instrumentation.template.md` → generate `dev_docs/plg/analytics-instrumentation.md`

3. Generate activation & conversion:
   - Read `44-product-led-growth/activation-experiments.template.md` → generate `dev_docs/plg/activation-experiments.md`
   - Read `44-product-led-growth/freemium-conversion-funnel.template.md` → generate `dev_docs/plg/conversion-funnel.md`
   - Read `44-product-led-growth/self-serve-upgrade.template.md` → generate `dev_docs/plg/self-serve-upgrade.md`

4. Generate expansion & virality:
   - Read `44-product-led-growth/pql-scoring.template.md` → generate `dev_docs/plg/pql-scoring.md`
   - Read `44-product-led-growth/usage-expansion-triggers.template.md` → generate `dev_docs/plg/expansion-triggers.md`
   - Read `44-product-led-growth/viral-coefficient-model.template.md` → generate `dev_docs/plg/viral-model.md`
   - Read `44-product-led-growth/in-app-upsell-patterns.template.md` → generate `dev_docs/plg/upsell-patterns.md`

5. Generate experiment infrastructure:
   - Read `44-product-led-growth/growth-experiment-backlog.template.md` → generate `dev_docs/plg/experiment-backlog.md`

6. Read `44-product-led-growth/plg-gotchas.md` and flag applicable risks.

**GATE: At least 2 growth loops identified and instrumented. PQL scoring model defines at least 5 signals. Analytics event taxonomy covers signup-to-paid funnel. At least 10 experiments in the backlog.**

Update STATE BLOCK: set `CURRENT_STEP: 28`, add "27.5-plg" to COMPLETED.

---

## Step 28: Marketing Dashboard & Handoff

**Goal:** Consolidate everything into a marketing dashboard and handoff document.

**Instructions:**

1. Generate marketing reporting:
   - Marketing report template from `19-marketing/analytics-and-tracking/marketing-reporting.template.md`
   - A/B testing framework from `19-marketing/analytics-and-tracking/ab-testing-framework.md`

2. Generate sales pipeline (if B2B product):
   - Pipeline management from `19-marketing/automation-crm/pipeline-management.template.md`

3. Read `19-marketing/marketing-gotchas/developer-marketing-mistakes.md` and add top warnings to handoff

4. Create `MARKETING-HANDOFF.md`:
   - Marketing strategy summary (1 page)
   - Channel-by-channel action items with priority and timeline
   - All generated marketing documents with file locations
   - Week 1 marketing checklist:
     - [ ] Set up analytics (GA4 / PostHog / Mixpanel)
     - [ ] Set up email marketing tool (ConvertKit / Mailchimp / Resend)
     - [ ] Create social media accounts on selected platforms
     - [ ] Publish landing page with email capture
     - [ ] Submit to first 5 directories
     - [ ] Start pre-launch content (build in public)
     - [ ] Set up CRM (HubSpot free / Pipedrive)
   - Quick-reference: "What to do when..." common marketing scenarios
   - Marketing commands reference:
     - `/generate-marketing-plan` — regenerate full marketing strategy
     - `/generate-landing-page` — generate landing page copy
     - `/generate-email-sequence` — generate email sequences
     - `/marketing-audit` — audit current marketing efforts
     - `/competitor-marketing` — research competitor marketing

5. Update project `HANDOFF.md` to reference marketing docs

6. Copy marketing commands to `.claude/commands/`:
   - `generate-marketing-plan.md` from `05-dev-infrastructure/commands/generate-marketing-plan.template.md`
   - `generate-landing-page.md` from `05-dev-infrastructure/commands/generate-landing-page.template.md`
   - `generate-email-sequence.md` from `05-dev-infrastructure/commands/generate-email-sequence.template.md`
   - `marketing-audit.md` from `05-dev-infrastructure/commands/marketing-audit.template.md`
   - `competitor-marketing.md` from `05-dev-infrastructure/commands/competitor-marketing.template.md`

7. Present marketing handoff:
   ```
   MARKETING PLAN COMPLETE

   Generated: [X] marketing documents across [Y] categories
   Channels: [N] channels planned with [M] prioritized
   Email sequences: [E] sequences with [F] total emails ready
   Launch plan: [pre-launch] + [launch day] + [post-launch]
   Directory listings: [D] directories identified
   Ad copy: [A] variations generated
   Content calendar: [C] days of content planned

   First action: [specific first step from Week 1 checklist]
   Start coding: Run /kickoff
   ```

**GATE: User reviews marketing handoff and confirms readiness to continue.**

Update STATE BLOCK: set `CURRENT_STEP: 28.5`, add "28-marketing-handoff" to COMPLETED.

---

## Step 28.5: Competitive Intelligence Setup

**Goal:** Turn the one-time competitor research from Step 3 (Tribunal) into an ongoing competitive monitoring discipline with battle cards, feature tracking, and reassessment cadence.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `28-competitive-intelligence/competitive-monitoring-cadence.md` and establish monitoring rhythm:
   - Daily: Automated alerts (Google Alerts, social listening)
   - Weekly: 15-minute competitor scan
   - Monthly: Structured review (1 hour)
   - Quarterly: Full reassessment (2-4 hours)
   - Configure trigger-based monitoring for: funding announcements, major features, pricing changes, new market entrants

2. Read `28-competitive-intelligence/feature-parity-tracking.template.md` and generate initial feature comparison matrix:
   - Pull competitor list from `CONFIG.COMPETITORS`
   - Map features as "table stakes" vs "differentiator"
   - Identify feature gaps and classify by urgency × impact
   - Output to `marketing/competitive-intelligence/feature-parity-tracking.md`

3. Read `28-competitive-intelligence/market-movement-alerts.template.md` and configure alert system:
   - Set up Google Alerts for each competitor name + product name
   - Configure social media monitoring queries
   - Define signal interpretation guide (hiring patterns, press releases, funding)

4. Run `BATTLE-CARD-GENERATOR.md` to create per-competitor battle cards:
   - One battle card per competitor (up to 5)
   - Sources: Tribunal research (Step 3), competitor marketing audit (Step 19)
   - Output to `marketing/competitive-intelligence/battle-cards/`

5. Read `28-competitive-intelligence/competitor-teardown.template.md` and generate teardown template for primary competitor:
   - UX teardown, pricing teardown, feature teardown, tech stack teardown
   - Scoring rubric (1-5 per dimension)

6. Read `28-competitive-intelligence/win-loss-analysis.template.md` and set up tracking:
   - Win/loss tracking table initialized in `marketing/competitive-intelligence/`
   - 5-question churn interview template
   - Reason taxonomy (price/features/UX/performance/support/brand)

6.5. **Battle Card Depth Enforcement (conditional on CONFIG.COMPETITIVE_BATTLE_CARDS == "true"):**
   a. Verify that Step 28.5 instruction 4 generated ONE battle card per competitor (minimum 3, up to top 5 from CONFIG.COMPETITORS)
   b. Each battle card MUST include (minimum 500 words):
      - Company overview and product positioning
      - Their strengths (be honest — know your enemy)
      - Their weaknesses (specific, not generic)
      - Pricing comparison (tier-by-tier if available)
      - How to position against them (messaging angles)
      - Common objections and rebuttals (3+ objections minimum)
      - Landmine questions for prospects (questions that expose competitor weaknesses)
      - When we lose to them and why
   c. Generate `marketing/competitive-intelligence/win-loss-playbook.md`:
      - 3+ win scenarios across all competitors with: scenario description, winning strategy, proof points
      - 3+ loss scenarios with: what happened, what we could have done differently, prevention strategy
      - Positioning by customer segment (enterprise vs SMB vs startup)
   d. If any battle card is under 500 words, expand it before proceeding

7. Read `28-competitive-intelligence/quarterly-reassessment-protocol.md` and schedule first quarterly review:
   - 10-step quarterly review checklist
   - 1-page summary output template
   - Add quarterly review to team calendar/ceremonies

8. Read `28-competitive-intelligence/competitive-intelligence-decision-tree.md` and include in team norms:
   - "A competitor just did X — what do I do?" decision tree
   - Default: note it, review quarterly, stay on your roadmap

8.5. **Competitive Simulation:**
   Generate `marketing/competitive-intelligence/competitive-simulation.md` from `28-competitive-intelligence/competitive-simulation.template.md`:
   - Role-play scenarios for top 3 competitors
   - Feature comparison stress tests
   - Pricing pressure scenarios
   - Demo differentiation playbook

**GATE: Feature parity matrix exists, at least 3 battle cards generated (if CONFIG.COMPETITIVE_BATTLE_CARDS == "true") with ≥500 words each, and win/loss playbook exists.**

Update STATE BLOCK: set `CURRENT_STEP: 28.6`, add "28.5-competitive-intelligence" to COMPLETED. Marketing steps (19-28.5) are skipped if user chose to skip marketing at Step 18.8 gate.

---

## Step 28.6: Marketplace & Plugin Ecosystem (skip if `CONFIG.HAS_MARKETPLACE == "false"`)

**Goal:** Design the plugin/extension architecture, marketplace UX, developer portal, SDK, review workflow, security model, and monetization strategy that transforms your product from a standalone tool into an extensible platform.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `46-marketplace-plugin-ecosystem/marketplace-decision-tree.md` — determine marketplace type, governance model, plugin architecture, and monetization approach. Set `CONFIG.MARKETPLACE_TYPE`, `CONFIG.MARKETPLACE_GOVERNANCE`, `CONFIG.PLUGIN_ARCHITECTURE`, `CONFIG.MARKETPLACE_MONETIZATION`.

2. Generate plugin architecture:
   - Read `46-marketplace-plugin-ecosystem/plugin-architecture.template.md` → generate `dev_docs/marketplace/plugin-architecture.md`
   - Read `46-marketplace-plugin-ecosystem/plugin-security-model.template.md` → generate `dev_docs/marketplace/plugin-security.md`
   - Read `46-marketplace-plugin-ecosystem/plugin-lifecycle.template.md` → generate `dev_docs/marketplace/plugin-lifecycle.md`
   - Read `46-marketplace-plugin-ecosystem/third-party-rate-limiting.template.md` → generate `dev_docs/marketplace/rate-limiting.md`

3. Generate developer experience:
   - Read `46-marketplace-plugin-ecosystem/developer-portal.template.md` → generate `dev_docs/marketplace/developer-portal.md`
   - Read `46-marketplace-plugin-ecosystem/sdk-design.template.md` → generate `dev_docs/marketplace/sdk-design.md`
   - Read `46-marketplace-plugin-ecosystem/sandbox-testing.template.md` → generate `dev_docs/marketplace/sandbox.md`
   - Read `46-marketplace-plugin-ecosystem/developer-docs-generation.template.md` → generate `dev_docs/marketplace/docs-generation.md`

4. Generate marketplace UX:
   - Read `46-marketplace-plugin-ecosystem/app-store-ux.template.md` → generate `dev_docs/marketplace/app-store-ux.md`
   - Read `46-marketplace-plugin-ecosystem/review-approval-workflow.template.md` → generate `dev_docs/marketplace/review-workflow.md`
<!-- IF {{MARKETPLACE_MONETIZATION}} != "free-only" -->
   - Read `46-marketplace-plugin-ecosystem/marketplace-monetization.template.md` → generate `dev_docs/marketplace/monetization.md`
<!-- ENDIF -->
   - Read `46-marketplace-plugin-ecosystem/marketplace-analytics.template.md` → generate `dev_docs/marketplace/analytics.md`

5. Read `46-marketplace-plugin-ecosystem/marketplace-gotchas.md` and flag applicable risks.

**GATE: Plugin architecture defines at least 5 extension points. Security model includes permission scoping and sandboxing. Developer portal has getting-started guide. Review workflow covers submission through publication.**

Update STATE BLOCK: set `CURRENT_STEP: 28.7`, add "28.6-marketplace" to COMPLETED.

---

## Step 28.7: Business Intelligence Setup (skip if `CONFIG.BI_ENABLED == "false"`)

**Goal:** Build the data infrastructure, executive reporting, and unified metrics governance layer that connects scattered metrics from Sections 19, 20, 25, and 33 into a cohesive business intelligence system.

**Prerequisites:** Step 17.5 (financial modeling — revenue metrics defined), Step 18.7.5 (CX operations — CX metrics defined), Step 18.8 (post-launch — operational metrics defined). Marketing steps (19-28.5) are nice-to-have but not blocking.

**Instructions:**

1. Read `35-business-intelligence/bi-maturity-assessment.md` and assess current BI maturity level:
   - Count data sources (application DB, billing, analytics, CRM, support, email, error tracker)
   - Run the context scoring questionnaire
   - Determine maturity level: spreadsheet / tool-native / governed / predictive
   - Set `CONFIG.BI_MATURITY_LEVEL`
   - Use the decision matrix to determine which files to resolve

2. **If maturity is `spreadsheet`:** Generate only the metrics registry as a reference document. Skip to instruction 7. Output to `dev_docs/bi/metrics-registry.md`.

3. Read `35-business-intelligence/bi-platform-decision-tree.md` and select BI platform:
   - Evaluate self-hosting requirements, budget, governance needs, team SQL proficiency
   - Set `CONFIG.BI_PLATFORM`
   - Read `35-business-intelligence/bi-connection-patterns.md` for the selected platform

4. Read and generate data infrastructure (Layer 1):
   - Read `35-business-intelligence/data-warehouse-architecture.template.md` → generate `dev_docs/bi/warehouse-architecture.md`
     - Select warehouse platform, design star schema, define schema naming
   - Read `35-business-intelligence/etl-pipeline-design.template.md` → generate `dev_docs/bi/etl-pipeline.md`
     - Design extraction from `{{DATABASE}}`, staging layer, scheduling, monitoring
   - Read `35-business-intelligence/transformation-layer.template.md` → generate `dev_docs/bi/transformation-layer.md`
     - Design dbt/transformation models for MRR, cohorts, funnels, health scores
   - Read `35-business-intelligence/data-quality-governance.template.md` → generate `dev_docs/bi/data-governance.md`
     - Define freshness SLAs, PII handling, quality rules, data contracts

5. **If maturity is `governed` or `predictive`:** Read and generate executive reporting (Layer 2):
   - Read `35-business-intelligence/executive-reporting/board-deck-templates.template.md` → generate `dev_docs/bi/executive-reporting/board-deck.md`
   - Read `35-business-intelligence/executive-reporting/mrr-arr-waterfall.template.md` → generate `dev_docs/bi/executive-reporting/mrr-waterfall.md`
   - Read `35-business-intelligence/executive-reporting/cohort-analysis.template.md` → generate `dev_docs/bi/executive-reporting/cohort-analysis.md`
   - Read `35-business-intelligence/executive-reporting/unit-economics-dashboard.template.md` → generate `dev_docs/bi/executive-reporting/unit-economics.md`
   - Read `35-business-intelligence/executive-reporting/okr-kpi-tracking.template.md` → generate `dev_docs/bi/executive-reporting/okr-tracking.md`
   - Read `35-business-intelligence/executive-reporting/departmental-dashboards.template.md` → generate `dev_docs/bi/executive-reporting/departmental-dashboards.md`
   - Conditionally resolve based on maturity and needs:
     - `multi-product-pl.template.md` → if multiple product lines
     - `geographic-segment-analysis.template.md` → if international markets
     - `regulatory-reporting.template.md` → if SOC2/GDPR/SOX requirements

6. Read and generate Metrics Hub (Layer 3):
   - Read `35-business-intelligence/metrics-hub/unified-metrics-registry.template.md` → generate `dev_docs/bi/metrics-registry.md`
     - Pull ALL metrics from completed sections (20, 25, 33, and 19 if marketing was completed)
     - Assign warehouse table, dashboard destination, owner, refresh cadence to each metric
     - Minimum 30 metrics mapped
   - Read `35-business-intelligence/metrics-hub/cross-section-metric-map.md` — use as reference to map data lineage for top 20 metrics
   - Read `35-business-intelligence/metrics-hub/data-lineage-catalog.template.md` → generate `dev_docs/bi/data-lineage.md`
   - Read `35-business-intelligence/metrics-hub/alert-threshold-registry.template.md` → generate `dev_docs/bi/alert-thresholds.md`

7. Read `35-business-intelligence/bi-gotchas.md` — review production anti-patterns before finalizing.

8. Generate stakeholder communication for BI setup:
   - Summary of BI maturity assessment, selected tools, and metrics governance approach
   - Output to `dev_docs/comms/step-28.7-bi-setup.md`

**Output structure:**
```
dev_docs/bi/
├── warehouse-architecture.md      (skip if spreadsheet maturity)
├── etl-pipeline.md                (skip if spreadsheet maturity)
├── transformation-layer.md        (skip if spreadsheet maturity)
├── data-governance.md             (skip if spreadsheet maturity)
├── metrics-registry.md            (always generated)
├── data-lineage.md                (skip if spreadsheet maturity)
├── alert-thresholds.md            (skip if spreadsheet maturity)
└── executive-reporting/           (skip if below governed maturity)
    ├── board-deck.md
    ├── mrr-waterfall.md
    ├── cohort-analysis.md
    ├── unit-economics.md
    ├── okr-tracking.md
    ├── departmental-dashboards.md
    ├── multi-product-pl.md        (conditional)
    ├── geographic-analysis.md     (conditional)
    └── regulatory-reporting.md    (conditional)
```

**GATE: Unified metrics registry exists with at least 30 metrics mapped. If maturity ≥ tool-native: warehouse architecture selected and ETL pipeline designed. If maturity ≥ governed: at least one executive reporting artifact generated.**

Update STATE BLOCK: set `CURRENT_STEP: 28.8`, add "28.7-business-intelligence" to COMPLETED.

---

## Step 28.8: SEO Deep Planning (skip if `CONFIG.SEO_ENABLED == "false"`)

**Goal:** Generate comprehensive, project-specific SEO artifacts based on the maturity tier determined in Step 22.

**Instructions:**

1. Read `36-seo/seo-maturity-assessment.md` and confirm the SEO maturity tier from Step 22.

2. **All tiers** — Generate core SEO artifacts:
   - Keyword research from `36-seo/strategy/keyword-research-methodology.md`
   - Keyword-content mapping from `36-seo/content-seo/keyword-content-mapping.template.md`
   - SEO KPI dashboard from `36-seo/measurement/seo-kpi-dashboard.template.md`
   - Monthly audit checklist from `36-seo/audit/monthly-audit-checklist.md`

3. **Tier 2+** — Generate growth-stage artifacts:
   - Competitive SEO analysis from `36-seo/strategy/seo-competitive-intelligence.template.md`
   - Topic cluster architecture from `36-seo/strategy/topic-cluster-architecture.template.md`
   - SEO roadmap from `36-seo/strategy/seo-roadmap.template.md`
   - Content brief template from `36-seo/content-seo/content-brief.template.md`
   - Link building playbook from `36-seo/off-page/link-building-playbook.md`
   - Rank tracking setup from `36-seo/measurement/rank-tracking-setup.md`
   - SEO reporting template from `36-seo/measurement/seo-reporting.template.md`

4. **Tier 3+** — Generate advanced artifacts:
   - SEO A/B testing from `36-seo/testing/seo-ab-testing.md`
   - Content decay refresh plan from `36-seo/content-seo/content-decay-refresh.md`
   - SEO incident response from `36-seo/incident/seo-incident-response.md`
   - AI search optimization from `36-seo/ai-seo/ai-search-optimization.md`

5. **Tier 4 / Conditional** — Generate specialized artifacts:
   - If `CONFIG.LOCAL_SEO_ENABLED == "true"`: Local SEO from `36-seo/specialized/local-seo.template.md`
   - If `CONFIG.HREFLANG_ENABLED == "true"`: International SEO from `36-seo/specialized/international-seo.template.md`
   - If `CONFIG.PRODUCT_TYPE == "ecommerce"`: E-commerce SEO from `36-seo/specialized/ecommerce-seo.template.md`
   - Quarterly deep audit template from `36-seo/audit/quarterly-deep-audit.template.md`
   - Migration checklist from `36-seo/migration/seo-migration-checklist.template.md`
   - Crawl budget log analysis from `36-seo/measurement/crawl-budget-log-analysis.md`

6. Generate stakeholder communication:
   - Summarize SEO strategy, maturity tier, and roadmap
   - Output to `dev_docs/comms/step-28.8-seo-deep-planning.md`

**Output structure:**
```
dev_docs/
  seo/
    seo-strategy.md
    keyword-research.md
    keyword-content-map.md
    seo-roadmap.md
    technical-seo-audit.md
    competitive-seo-analysis.md     (Tier 2+)
    topic-clusters.md               (Tier 2+)
    link-building-plan.md           (Tier 2+)
    seo-kpi-dashboard.md
    seo-reporting.md                (Tier 2+)
    local-seo.md                    (conditional)
    international-seo.md            (conditional)
    ecommerce-seo.md                (conditional)
```

**GATE: SEO strategy exists with keyword research and content mapping completed. KPI dashboard defined with at least 5 tracked metrics. If Tier 2+: competitive analysis and roadmap generated.**

Update STATE BLOCK: set `CURRENT_STEP: 28.85`, add "28.8-seo-deep-planning" to COMPLETED.

---

## Step 28.85: Partner & Channel Strategy (skip if `CONFIG.PARTNER_CHANNEL == "false"`)

**Goal:** Design the indirect go-to-market channels — partner tiers, reseller portals, white-label architecture, revenue sharing models, affiliate programs, and co-marketing playbooks — that extend your reach beyond direct sales.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `43-partner-channel-strategy/partner-strategy-decision-tree.md` — determine partnership model, revenue sharing approach, and tier structure. Set `CONFIG.PARTNER_MODEL`, `CONFIG.PARTNER_REVENUE_SHARE`, `CONFIG.PARTNER_TIER_COUNT`.

2. Generate partner program foundation:
   - Read `43-partner-channel-strategy/partner-tier-definitions.template.md` → generate `dev_docs/partner-channel/partner-tiers.md`
   - Read `43-partner-channel-strategy/partner-onboarding.template.md` → generate `dev_docs/partner-channel/partner-onboarding.md`
   - Read `43-partner-channel-strategy/revenue-sharing-models.template.md` → generate `dev_docs/partner-channel/revenue-sharing.md`

3. Generate channel infrastructure:
   - Read `43-partner-channel-strategy/channel-conflict-resolution.template.md` → generate `dev_docs/partner-channel/channel-conflict.md`
<!-- IF {{PARTNER_MODEL}} == "reseller" -->
   - Read `43-partner-channel-strategy/reseller-portal.template.md` → generate `dev_docs/partner-channel/reseller-portal.md`
<!-- ENDIF -->
<!-- IF {{WHITE_LABEL_ENABLED}} == "true" -->
   - Read `43-partner-channel-strategy/white-label-architecture.template.md` → generate `dev_docs/partner-channel/white-label.md`
<!-- ENDIF -->

4. Generate growth channels:
   - Read `43-partner-channel-strategy/api-partner-program.template.md` → generate `dev_docs/partner-channel/api-partner-program.md`
   - Read `43-partner-channel-strategy/co-marketing-playbook.template.md` → generate `dev_docs/partner-channel/co-marketing.md`
<!-- IF {{AFFILIATE_ENABLED}} == "true" -->
   - Read `43-partner-channel-strategy/affiliate-program.template.md` → generate `dev_docs/partner-channel/affiliate-program.md`
<!-- ENDIF -->
<!-- IF {{MARKETPLACE_LISTING}} == "true" -->
   - Read `43-partner-channel-strategy/integration-marketplace.template.md` → generate `dev_docs/partner-channel/marketplace-listing.md`
<!-- ENDIF -->

5. Read `43-partner-channel-strategy/partner-strategy-gotchas.md` and flag applicable risks.

**GATE: At least 6 partner channel artifacts generated. Revenue sharing model defines payment flow. Partner tiers have clear criteria and benefits.**

Update STATE BLOCK: set `CURRENT_STEP: 28.9`, add "28.85-partner-channel" to COMPLETED.

---

## Step 28.9: Investor & Fundraising Planning (skip if `CONFIG.FUNDRAISING_ENABLED == "false"`)

**Goal:** Build the fundraising toolkit — pitch deck framework, cap table model, investor pipeline, due diligence preparation, and board reporting cadence — grounded in the financial models from Step 17.5 and BI dashboards from Step 28.7.

**Depth check:** See `10-generators/DEPTH-REQUIREMENTS.md` → "Steps 13-28 Depth Requirements" for minimum file count and word count.

**Instructions:**

1. Read `40-investor-fundraising/fundraising-decision-tree.md` — determine fundraising path based on stage, capital needs, and founder preferences. Set `CONFIG.FUNDRAISING_STAGE`, `CONFIG.SAFE_OR_PRICED`.

2. Generate core fundraising artifacts:
   - Read `40-investor-fundraising/pitch-deck-framework.template.md` → generate `dev_docs/fundraising/pitch-deck.md`
   - Read `40-investor-fundraising/cap-table-planning.template.md` → generate `dev_docs/fundraising/cap-table.md`
   - Read `40-investor-fundraising/valuation-modeling.template.md` → generate `dev_docs/fundraising/valuation-model.md`

3. Generate process artifacts:
   - Read `40-investor-fundraising/fundraising-process.template.md` → generate `dev_docs/fundraising/fundraising-process.md`
   - Read `40-investor-fundraising/investor-crm.template.md` → generate `dev_docs/fundraising/investor-crm.md`
   - Read `40-investor-fundraising/fundraising-timeline.template.md` → generate `dev_docs/fundraising/fundraising-timeline.md`

4. Generate governance artifacts:
   - Read `40-investor-fundraising/due-diligence-prep.template.md` → generate `dev_docs/fundraising/data-room-checklist.md`
   - Read `40-investor-fundraising/term-sheet-analysis.template.md` → generate `dev_docs/fundraising/term-sheet-guide.md`
   - Read `40-investor-fundraising/board-deck.template.md` → generate `dev_docs/fundraising/board-deck-template.md`
   - Read `40-investor-fundraising/investor-update-cadence.template.md` → generate `dev_docs/fundraising/investor-updates.md`

5. Read `40-investor-fundraising/fundraising-gotchas.md` and flag applicable risks.

**GATE: At least 8 fundraising artifacts generated. Pitch deck references real financial data from Section 25. Cap table models at least 2 dilution scenarios.**

Update STATE BLOCK: set `CURRENT_STEP: 29`, add "28.9-fundraising" to COMPLETED.


### Steps 13-28 Depth Check Footer

Before crossing the SB-6 session boundary, run a final depth sweep across ALL Steps 13-28 output:

1. For each step in 13-28, verify file count and word count against `10-generators/DEPTH-REQUIREMENTS.md` "Steps 13-28 Depth Table"
2. Any file below the per-step word minimum → re-generate that file only (use `10-generators/REGENERATOR.md`)
3. Any step missing files vs. the minimum file count → generate the missing files
4. Log all re-generations to `dev_docs/hardening/depth-verification-log.md`
5. Final pass: confirm every step meets its quality check column from the Depth Table

**This sweep is mandatory.** Do not cross SB-6 with depth debt. Fix it here or carry compounding quality gaps into hardening.
### SESSION BOUNDARY — SB-6: Post-Marketing

This is a safe stopping point. Before proceeding to hardening:

1. **Update `dev_docs/session-context.md`:**
   - Fill/update all sections with current data
   - Add marketing config, channel strategy, launch timeline, BI config, SEO maturity tier to decisions log
   - Append this session to Session History table
2. **Update STATE BLOCK** in this file
3. **Update `dev_docs/handoff.md`:**
   - What was accomplished (marketing planning complete)
   - Next step: Step 29 (Post-Completion Audit — first of 5 mandatory hardening steps)
   - Note: Hardening is mandatory for ALL paths, 17 rounds total
4. **Update `dev_docs/ARCH-ANCHOR.md`** with any architectural changes from this phase
5. **Regenerate `dev_docs/PHASE-CONTEXT.md`** for the next phase
6. **Tell the user:** "Session boundary SB-6 reached. Marketing planning is complete. Next phase is Hardening (Steps 29-33, mandatory). You can continue here or start a fresh conversation. If starting fresh, tell Claude: 'Read ORCHESTRATOR.md and resume from where we left off.'"

**Autopilot mode:** After persisting all state above, update `.kit/state.json`, then output `KIT_SESSION_BOUNDARY` on its own line and **STOP**. Do not proceed to Step 29. The `kit-autopilot.sh` script will restart you in a fresh session.

---

## Phase 6: Hardening (Steps 29-33) — Mandatory for All Paths

> **Purpose:** Multi-round audit, enhancement, depth verification, deep dive, and expansion planning. These steps ensure the project plan is bulletproof before coding begins.
> **Total rounds across all steps:** 17 (3+3+5+3+1)
> **Estimated time:** 3-4 hours
> **Mandatory:** Yes — all paths (Express, Lite, Standard, Full) must complete hardening.

### Round Protocol

Steps 29-32 execute multiple automated rounds within a single step. Each round:
1. Performs its analysis
2. Generates findings in `dev_docs/hardening/{step-folder}/round-{N}-*.md`
3. Applies fixes for actionable findings
4. Logs a round summary using `34-hardening/round-summary.template.md`
5. Feeds unresolved findings to the next round

**Early exit:** If a round finds 0 new issues AND `round >= 2` AND the step's cumulative score is >= 8/10, remaining rounds are skipped. Score < 8 means all rounds must complete regardless of finding count.

**Round tracking in IN_PROGRESS:**
```json
"IN_PROGRESS": { "step": "29", "round": 1, "total": 3, "findings": { "r1": 0 }, "resolved": { "r1": 0 } }
```

### Context Recovery Protocol

Hardening steps span many rounds and may exceed a single context window. When a new session starts mid-hardening, follow this recovery sequence:

1. **Read the STATE BLOCK** — determine `CURRENT_STEP` and `IN_PROGRESS.round`
2. **Read the step's output folder** — check which `round-{N}-*.md` files already exist in `dev_docs/hardening/{step-folder}/`
3. **Read the latest round file** — the last `round-{N}-*.md` tells you what was found and what was carried forward
4. **Determine resume point:**
   - If `round-{N}-*.md` exists but the step summary (`*-summary.md`) does NOT → resume at round N+1
   - If no round files exist → start at round 1
   - If the step summary exists → step is complete, advance `CURRENT_STEP`
5. **Read carried-forward items** — the "Carried Forward" section of the latest round file contains unresolved findings to feed into the next round
6. **Resume the round** — continue from the determined round number, preserving all prior findings

**Files to read on recovery (in order):**
```
STATE BLOCK (in this file, ORCHESTRATOR.md)
dev_docs/hardening/{step-folder}/          → ls to see which rounds completed
dev_docs/hardening/{step-folder}/round-{latest}-*.md  → last round's findings
dev_docs/handoff.md                        → session notes (if present)
```

**Step folder mapping:**
| Step | Folder |
|------|--------|
| 29 | `audit/` |
| 30 | `enhancement/` |
| 31 | `depth-verification/` |
| 32 | `deep-dive/` |
| 33 | `expansion/` (single pass, no rounds) |

---

## Step 29: Post-Completion Audit

**Goal:** Verify that every expected output from all completed steps exists, is complete, and is internally consistent. Three sequential rounds catch progressively more subtle gaps.

PHASE PROFILE: Load `48-ai-agent-personas/phase-profiles/hardening-profile.md` — think as a QA lead. Nothing ships without proof. This profile stays active through Step 33.

**Prerequisites:** All prior steps in COMPLETED array. This step runs after the user's chosen path is fully complete.

**Output folder:** `dev_docs/hardening/audit/`

**Instructions:**

1. Read `34-hardening/audit-checklist.template.md` — this is the master checklist of every expected output per step
2. Create the output directory: `dev_docs/hardening/audit/`
3. Run the `POST-COMPLETION-AUDITOR.md` generator from `10-generators/`

### Round 1 of 3: Existence Audit

**Focus:** Does every expected file exist?

1. Read the COMPLETED array from STATE BLOCK
2. For each completed step, look up expected output files in the audit checklist
3. Check each expected file:
   - EXISTS and ≥50 words → **PASS**
   - EXISTS but <50 words → **STUB** (WARNING)
   - DOES NOT EXIST → **MISSING** (CRITICAL)
4. For template-driven outputs, verify counts match:
   - Service specs count = `CONFIG.MVP_SERVICES` length
   - Screen specs count = screen catalog entries
   - Task files exist for every phase
5. Generate `dev_docs/hardening/audit/round-1-findings.md` using `34-hardening/round-summary.template.md`
6. Run the Depth Auditor (see `10-generators/DEPTH-AUDITOR.md`) as a SEPARATE verification pass. This mechanically counts words, rules, endpoints, etc. and compares against DEPTH-REQUIREMENTS.md thresholds. Flag any spec that fails.
7. For MISSING files: generate them using the appropriate generator
8. For STUB files: expand them using the appropriate template

**Round 1 Summary:**
```
ROUND 1 — EXISTENCE AUDIT:
  Expected files: {N}
  Found: {M}
  Missing (CRITICAL): {K}
  Empty/stub (WARNING): {E}
```

Update `IN_PROGRESS`: `{ "step": "29", "round": 2, "total": 3, ... }`

### Round 2 of 3: Section Completeness Audit

**Focus:** Do existing files have all required sections?

1. For each service spec: verify all 15 required sections are present (Overview, Entities, Business Rules, API Endpoints, State Machines, Validation Rules, Edge Cases, Error Handling, Performance Requirements, Security, Dependencies, Testing Strategy, Monitoring, Future Considerations, Open Questions)
2. For each screen spec: verify all 11 required sections (Overview, User Stories, Layout, Components, States, Interactions, Responsive, Accessibility, API Calls, Navigation, Permissions)
3. For each task file: verify Context Header, Objective, File Plan, Acceptance Criteria, Dependencies, Effort Estimate
4. Scan all files for placeholder text: "TBD", "TODO", "[FILL IN]", "[INSERT", "PLACEHOLDER", "lorem ipsum" — each is a WARNING
5. Verify fixes from Round 1 are applied
6. Generate `dev_docs/hardening/audit/round-2-findings.md`
7. For missing sections: generate them inline using the template structure
8. For placeholder text: replace with substantive content

Update `IN_PROGRESS`: `{ "step": "29", "round": 3, "total": 3, ... }`

### Round 3 of 3: Cross-Reference Integrity Audit

**Focus:** Do files correctly reference each other?

1. Every service in `dev_docs/completeness/service-matrix.md` must have a matching spec file AND hub file
2. Every screen in `dev_docs/completeness/screen-matrix.md` must have a matching screen spec
3. Every feature in `dev_docs/features-list.md` must have ≥1 task file
4. Every API endpoint in screen specs must appear in the API registry
5. Every file path in task files must be a valid, planned file (not generic placeholders)
6. Find orphaned files in `dev_docs/` not referenced by any other document
7. Verify all Round 1 and Round 2 fixes are confirmed
8. Generate `dev_docs/hardening/audit/round-3-findings.md`
9. Create missing references, fix broken links

**After all 3 rounds:**
- Generate `dev_docs/hardening/audit/audit-summary.md` consolidating all findings
- Present summary:
```
POST-COMPLETION AUDIT COMPLETE

Rounds executed: 3
Total findings: {TOTAL}
  Critical: {CRITICAL}
  Warning: {WARNING}
Resolved during audit: {RESOLVED}
Remaining (need user decision): {REMAINING}
Files generated: {NEW_FILES}
Files modified: {MODIFIED_FILES}
```

**GATE: All CRITICAL findings must be resolved. User reviews `dev_docs/hardening/audit/audit-summary.md`.**

Update STATE BLOCK: set `CURRENT_STEP: 30`, add "29-audit" to COMPLETED.

---

## Step 30: Enhancement Rounds

**Goal:** Improve everything — find what was missed, make what exists better, identify cross-cutting patterns.

**Prerequisites:** Step 29 complete (audit passed).

**Output folder:** `dev_docs/hardening/enhancement/`

**Instructions:**

1. Read `dev_docs/hardening/audit/audit-summary.md` — understand what was already fixed
2. Read `34-hardening/enhancement-categories.md` — category reference for all 12 enhancement types
3. Create the output directory: `dev_docs/hardening/enhancement/`
4. Run the `ENHANCEMENT-ROUND-GENERATOR.md` generator from `10-generators/`

### Round 1 of 3: "What Did We Miss?"

**Focus:** Missing services, screens, edge cases, business rules, integrations.

1. **Industry comparison:** Based on the project type and domain, identify features that similar products typically have. Compare against the features list. Flag gaps.
2. **Service gap analysis:** For each service, check if it implies other services not in the list (e.g., "booking" implies calendar/availability/notification services).
3. **Screen gap analysis:** For each service, verify CRUD screens exist. Check for admin screens, settings, error pages (404, 500, 403), maintenance/offline pages.
4. **Edge case scan:** For each P0 service, verify ≥5 edge cases are documented. Check for: empty state, concurrent editing, session expiry, network failure, timezone edge cases.
5. **Business rule scan:** For each entity with a status field, verify state machine exists. For each form, verify validation rules are explicit. For each calculation, verify formula is documented.
6. **Integration gap scan:** Cross-reference features against integrations map. Flag missing fallback strategies.
7. Generate `dev_docs/hardening/enhancement/round-1-improvements.md`
8. Add missing items directly to the relevant spec files

### Round 2 of 3: "What Can We Do Better?"

**Focus:** Deepen specs, improve task granularity, strengthen API contracts.

1. **Spec depth:** Read every service spec. Expand any section <100 words. Focus on Business Rules, Edge Cases, Error Handling, Performance Requirements.
2. **Task granularity:** Flag mega-tasks (>8 hours, <3 sub-tasks). Split into implementable sub-tasks with concrete output files.
3. **API contracts:** For each endpoint, verify error response schemas (400, 401, 403, 404, 409, 422, 500), pagination on list endpoints, rate limiting docs, auth requirements.
4. **Screen specs:** Verify all 4 states (loading, error, empty, data). Add responsive breakpoints, accessibility requirements, form validation rules where missing.
5. **Phase plans:** Add missing effort estimates, risk factors, rollback plans.
6. Generate `dev_docs/hardening/enhancement/round-2-improvements.md`
7. Apply all improvements directly to the relevant files

### Round 3 of 3: "What Patterns Emerged?"

**Focus:** Cross-cutting standards, consistency, documentation gaps.

1. Aggregate findings from Rounds 1-2. Group by category. Any group with ≥3 items = cross-cutting standard needed.
2. Create cross-cutting standard documents if needed (e.g., `dev_docs/foundations/error-handling-standard.md`, `dev_docs/foundations/validation-patterns.md`).
3. Check naming consistency across all specs — flag camelCase/snake_case conflicts, terminology drift, inconsistent pluralization.
4. Verify architecture consistency — all services follow the same patterns unless deviation is documented.
5. Check decision log completeness — every major architectural choice should have a rationale entry.
6. Generate `dev_docs/hardening/enhancement/round-3-improvements.md`

**After all 3 rounds:**
- Generate `dev_docs/hardening/enhancement/enhancement-log.md` consolidating all rounds
- Present summary:
```
ENHANCEMENT ROUNDS COMPLETE

Rounds executed: {ROUNDS}
Total improvements: {TOTAL}
  Missing items added: {ADDED}
  Existing items improved: {IMPROVED}
  Cross-cutting standards created: {STANDARDS}
  Consistency fixes: {CONSISTENCY}
New files created: {NEW_COUNT}
Files modified: {MODIFIED_COUNT}
```

**GATE: User reviews `dev_docs/hardening/enhancement/enhancement-log.md`.**

Update STATE BLOCK: set `CURRENT_STEP: 31`, add "30-enhancement" to COMPLETED.

---

## Step 31: Depth & Completeness Verification

**Goal:** Ensure every phase, task, sub-task, and milestone has sufficient depth and detail. Five rounds progressively deepen the analysis.

**Prerequisites:** Step 30 complete (enhancements applied).

**Output folder:** `dev_docs/hardening/depth-verification/`

**Instructions:**

1. Read `34-hardening/depth-progressive-protocol.md` — the 5-round progressive deepening rules
2. Read `10-generators/DEPTH-REQUIREMENTS.md` — scoring algorithms and thresholds
3. Create the output directory: `dev_docs/hardening/depth-verification/`

### Round 1 of 5: Phase Sequencing

**Focus:** Verify all phases have correct dependencies and sequencing.

1. Read `dev_docs/project-phases.md` and extract all phases with dependencies
2. Build dependency graph — verify zero circular dependencies (CRITICAL if found)
3. Verify critical path is explicitly identified
4. Check infrastructure/foundation phases come before feature phases
5. Verify parallel-safe phases are marked as parallelizable
6. Check each phase has explicit entry and exit conditions
7. Verify phase duration estimates sum to a reasonable total
8. Generate `dev_docs/hardening/depth-verification/round-1-phases.md`

### Round 2 of 5: Sub-Task Sufficiency

**Focus:** Every task has enough granularity for implementation.

1. Read all task files in `dev_docs/tasks/`
2. Verify each task has ≥3 sub-tasks (unless genuinely atomic)
3. No single sub-task exceeds 4 hours of estimated effort
4. Each sub-task has a clear deliverable (file, function, test)
5. Sub-tasks follow logical implementation order
6. Flag and split "mega-tasks" (>8 hours, <3 sub-tasks)
7. Flag and clarify "vague tasks" (no concrete files/components specified)
8. Generate `dev_docs/hardening/depth-verification/round-2-subtasks.md`

### Round 3 of 5: Milestone Acceptance Criteria

**Focus:** Every milestone has testable, specific acceptance criteria.

1. Extract all milestones from phase plans and task files
2. Verify criteria are **specific** (names exact features/screens/behaviors)
3. Verify criteria are **testable** (verifiable by running a command, clicking through a flow, or checking a metric)
4. Verify criteria are **complete** (cover all services/features in the milestone)
5. Flag vague criteria: "works correctly", "is functional", "users can use", "feature complete"
6. Rewrite flagged criteria with specific, testable language
7. Verify each milestone has ≥3 acceptance criteria with verification methods
8. Generate `dev_docs/hardening/depth-verification/round-3-milestones.md`

### Round 4 of 5: Service Spec Deep Scan

**Focus:** Re-score all specs with elevated thresholds.

Elevated thresholds (stricter than standard):
- Service specs: ≥9/10 (standard: ≥8/10)
- Screen specs: ≥8/10 (standard: ≥7/10)
- Task files: ≥7/8 layers (standard: ≥6/8)

1. **Mechanical depth check first (adversarial):** Before agent-based re-scoring, run the MECHANICAL-DEPTH-CHECKER from `10-generators/MECHANICAL-DEPTH-CHECKER.md`. This produces objective word counts, section presence checks, shallow indicator scans, error code counts, and endpoint counts. Output: `dev_docs/completeness/mechanical-depth-report.md`.
2. Run depth scorer on ALL service specs, screen specs, and task files
3. Flag any scoring below elevated thresholds
4. **Discrepancy detection:** Compare mechanical counts against agent scores. Any file where the mechanical checker found a FAIL but the agent scored it as passing = DISCREPANCY requiring manual review. List all discrepancies in the round-4 report.
5. For each flagged document (from thresholds OR discrepancies), identify which sections pull the score down
6. Re-generate or expand those specific sections to meet threshold
7. Re-score to confirm threshold is met
8. Generate `dev_docs/hardening/depth-verification/round-4-service-depth.md` including the discrepancy report

### Round 5 of 5: Cross-Reference Integrity

**Focus:** Bidirectional references between ALL documents.

1. Service ↔ Screen: every service referenced in a screen spec must reference that screen back
2. Service ↔ Task: every service must have corresponding task files; every task must reference its service
3. Screen ↔ Task: every screen spec must have task files covering its implementation
4. API ↔ Service: every API endpoint must map to a service; every service hub must list its endpoints
5. Entity ↔ Service: every domain entity must be owned by ≥1 service
6. Feature ↔ Task: every feature must map to ≥1 task (zero orphaned features)
7. Detect orphaned files (in `dev_docs/` but not referenced anywhere) — target ≤5%
8. Generate `dev_docs/hardening/depth-verification/round-5-cross-ref.md`

**After all 5 rounds:**
- Generate `dev_docs/hardening/depth-verification/depth-summary.md` consolidating all rounds
- Present summary:
```
DEPTH & COMPLETENESS VERIFICATION COMPLETE

Rounds executed: {ROUNDS} of 5
Phase issues found/fixed: {R1}
Sub-task issues found/fixed: {R2}
Milestone issues found/fixed: {R3}
Depth score improvements: {R4}
Cross-reference fixes: {R5}

Current averages:
  Service spec depth: {AVG_SERVICE}/10 (threshold: 9/10)
  Screen spec depth: {AVG_SCREEN}/10 (threshold: 8/10)
  Task layer coverage: {AVG_TASK}/8 (threshold: 7/8)
```

**GATE: All specs meet elevated thresholds. User reviews `dev_docs/hardening/depth-verification/depth-summary.md`.**

Update STATE BLOCK: set `CURRENT_STEP: 32`, add "31-depth-verification" to COMPLETED.

---

## Step 32: Deep Dive Audit & Enhancement

**Goal:** Go into every single service, phase, and feature — verify what the business actually needs, identify must-haves vs nice-to-haves, and ensure full end-to-end specification.

**Prerequisites:** Step 31 complete (depth verified).

**Output folder:** `dev_docs/hardening/deep-dive/`

**Instructions:**

1. Read `34-hardening/deep-dive-checklist.template.md` — per-entity audit checklist
2. Create the output directory: `dev_docs/hardening/deep-dive/`

### Round 1 of 3: Per-Service Deep Dive

**Focus:** For EVERY service in `CONFIG.MVP_SERVICES`, perform a comprehensive business needs analysis.

For each service:
1. **Feature completeness:** List ALL features (not just what's in the spec). Compare against industry standards. Flag missing features.
2. **Must-have vs Nice-to-have:** Categorize each feature. Must-haves block launch; nice-to-haves are post-MVP.
3. **Edge case verification:** Walk through 3 realistic real-world scenarios. Does the spec handle them?
4. **Business rules verification:** Are state machines complete? Are validation rules specific? Are calculations documented with examples?
5. **Business needs assessment:** What would a business owner expect? What reporting/analytics? What admin capabilities? What notifications?
6. **Nice-to-have identification:** Automation opportunities, intelligence features, integration opportunities.
7. Apply findings: update service specs with missing features and business rules
8. Generate `dev_docs/hardening/deep-dive/round-1-services.md`

### Round 2 of 3: Per-Phase Deep Dive

**Focus:** For EVERY phase, verify development plan integrity.

For each phase:
1. **Breakdown logic:** Does the phase have a single, clear objective? Are all tasks related?
2. **Dependency correctness:** Are all dependencies explicit? Any implicit ones missed? Can tasks run in parallel?
3. **Timeline realism:** Is the estimate realistic for team size? Account for testing, code review, integration complexity? Buffer for unknowns (10-20%)?
4. **Resource allocation:** Required skills available? Bottleneck tasks? External input needed?
5. **Gap identification:** Missing tasks? Missing testing tasks? Missing documentation tasks? Missing deployment/migration tasks?
6. Apply findings: update phase plans with missing tasks and corrected estimates
7. Generate `dev_docs/hardening/deep-dive/round-2-phases.md`

### Round 3 of 3: Per-Feature Deep Dive

**Focus:** For EVERY feature, verify end-to-end specification coverage.

For each feature:
1. **End-to-end check:** Data model defined? API endpoints documented? UI screens specified? Business logic captured? Tests planned? Docs planned?
2. **Business needs not captured:** Reporting needs? Admin overrides? Audit trail? Data export? Notifications? Search/filter?
3. **Nice-to-have enhancements:** UX improvements? Performance optimizations? Accessibility beyond minimum? i18n readiness?
4. Apply findings: update feature specs with missing coverage
5. Generate `dev_docs/hardening/deep-dive/round-3-features.md`

**After all 3 rounds:**
- Generate `dev_docs/hardening/deep-dive/deep-dive-summary.md` consolidating all findings
- Generate `dev_docs/hardening/deep-dive/nice-to-haves.md` — all nice-to-have features organized by service, with effort estimates and priority
- Present summary:
```
DEEP DIVE COMPLETE

Services audited: {SERVICE_COUNT}
Phases audited: {PHASE_COUNT}
Features audited: {FEATURE_COUNT}

Must-have additions: {MUST_HAVE_COUNT} (added to specs)
Nice-to-haves identified: {NICE_TO_HAVE_COUNT} (logged for expansion)
Business rules added: {RULES_COUNT}
Edge cases added: {EDGE_CASES_COUNT}
Phase plan corrections: {PHASE_FIXES}
```

**GATE: User reviews `dev_docs/hardening/deep-dive/deep-dive-summary.md` and `nice-to-haves.md`.**

Update STATE BLOCK: set `CURRENT_STEP: 33`, add "32-deep-dive" to COMPLETED.

---

## Step 33: Expansion Planning

**Goal:** Look beyond MVP — identify post-launch features, new verticals, and growth strategies. This is the final planning step.

**Prerequisites:** Step 32 complete (deep dive done, nice-to-haves identified).

**Output folder:** `dev_docs/hardening/expansion/`

**Instructions:**

1. Read `dev_docs/hardening/deep-dive/nice-to-haves.md` — features deferred from MVP
2. Read `dev_docs/tribunal/VERDICT.md` — competitive landscape and market insights
3. Read `dev_docs/project-brief.md` — core product identity and positioning
4. Read `dev_docs/features-list.md` — current feature scope
5. If marketing docs exist, read `MARKETING-HANDOFF.md` — growth channels planned
6. Read `34-hardening/expansion-planning.template.md` — output template
7. Run the `EXPANSION-PLANNER.md` generator from `10-generators/`
8. Create the output directory: `dev_docs/hardening/expansion/`

### Post-MVP Feature Roadmap

1. Collect all nice-to-have features from deep dive
2. Add features from tribunal research marked as "future" or "post-MVP"
3. For each feature, assess: Impact (1-5), Effort (1-5), Dependencies, Revenue potential
4. Prioritize using Impact/Effort matrix:
   - Quick wins (high impact, low effort) → Quarter 1
   - Strategic bets (high impact, high effort) → Quarter 2-3
   - Easy adds (low impact, low effort) → Quarter 2
   - Moonshots (low impact, high effort) → Quarter 4 or backlog
5. Organize into quarterly roadmap

### Vertical & Market Analysis

1. Identify the primary market/vertical from the project brief
2. Identify 3-5 adjacent verticals (same tech/different industry, same industry/different segment, same problem/different geography)
3. For each: assess market size, fit score (1-10), adaptation needed, go-to-market strategy
4. Rank by Fit Score x Market Size
5. Generate `dev_docs/hardening/expansion/vertical-analysis.md`

### Growth Strategy

1. Analyze organic growth potential: referral loops, content flywheel, network effects, SEO
2. Analyze enterprise/upmarket potential: SSO, SCIM, audit logs, compliance certifications
3. Analyze platform/ecosystem potential: API/SDK, marketplace, white-label
4. Analyze competitive moat: data advantage, integration lock-in, community, brand
5. Generate `dev_docs/hardening/expansion/growth-strategy.md`

### Final Assembly

1. Fill `34-hardening/expansion-planning.template.md` with all findings
2. Save as `dev_docs/hardening/expansion/expansion-plan.md`

### Pre-Coding Readiness Checklist

1. Read `34-hardening/ready-to-code.template.md`
2. Fill in all planning completeness counts (services, screens, tasks, endpoints, entities, state machines)
3. Fill in hardening results from Steps 29-32 summaries
4. Verify all quality gates — check each box or flag unresolved items
5. Verify all state files exist and are populated
6. Save as `dev_docs/READY-TO-CODE.md`

Present final summary:
```
EXPANSION PLAN COMPLETE — HARDENING PHASE DONE

Post-MVP features identified: {N}
  Quarter 1: {Q1} features
  Quarter 2: {Q2} features
  Quarter 3: {Q3} features
  Quarter 4: {Q4} features
New verticals analyzed: {V}
Growth strategies defined: {G}
Recommended first expansion: {FIRST_MOVE}

HARDENING SUMMARY (Steps 29-33):
  Audit findings resolved: {AUDIT_TOTAL}
  Enhancements applied: {ENHANCE_TOTAL}
  Depth improvements: {DEPTH_TOTAL}
  Deep dive additions: {DEEP_TOTAL}
  Expansion items planned: {EXPANSION_TOTAL}

Project is ready to start coding. Run /kickoff
```

**GATE: Final gate. User reviews expansion plan. Confirm readiness to start coding.**

**Autopilot mode:** Write `dev_docs/.kit-complete` with timestamp and step summary. Update `.kit/state.json` with `status: "completed"` and full completed steps list. Then output `KIT_COMPLETE` on its own line and **STOP**. The `kit-autopilot.sh` script will detect this and exit the loop.

Update STATE BLOCK: set `CURRENT_STEP: DONE`, add "33-expansion" to COMPLETED. All steps should now be in COMPLETED: ["0-ecosystem", "1-intake", "1.5-version-verify", "1.7-comms-setup", "1.9-expansion-brainstorm", "2-ai-config", "3-tribunal", "3.5-mobile-framework", "4-foundation", "4.5-completeness-matrix", "5-services", "5.5-native-audit", "6-screens", "6.5-screen-completeness", "7-audit", "8-tasks", "8.5-phase-coverage", "9-dashboard", "10-contracts", "11-infra", "11.5-mobile-setup", "11.6-cicd", "12-testing", "13-design-system", "14-security", "14.5-store-readiness", "14.6-ai-ml", "14.7-legal-docs", "14.75-privacy-engineering", "14.8-billing", "14.9-integrations", "15-observability", "15.5-user-docs", "16-handoff", "16.1-anti-patterns", "16.2-security", "16.3-performance", "16.4-protection", "16.5-memory", "17-capabilities", "17.5-financial", "17.6-multi-tenant", "18-onboarding", "18.5-team-ceremonies", "18.6-incident-response", "18.7-customer-support", "18.7.5-cx-operations", "18.75-migration", "18.8-post-launch", "18.85-team-ops", "19-marketing-research", "20-brand-pricing", "21-marketing-strategy", "22-website-conversion", "23-content-social", "24-email-marketing", "25-launch-strategy", "26-growth-outreach", "27-onboarding-retention", "27.5-plg", "28-marketing-handoff", "28.5-competitive-intelligence", "28.6-marketplace", "28.7-business-intelligence", "28.8-seo-deep-planning", "28.85-partner-channel", "28.9-fundraising", "29-audit", "30-enhancement", "31-depth-verification", "32-deep-dive", "33-expansion"]. Mobile sub-steps (3.5, 5.5, 11.5, 14.5) are only present when HAS_MOBILE is "true". Conditional sub-steps: 11.6-cicd (always), 14.6-ai-ml (AI_FEATURES=true), 14.7-legal-docs (PRE_LAUNCH=true), 14.8-billing (MONETIZATION_MODEL!=none), 14.9-integrations (HAS_INTEGRATIONS=true), 17.5-financial (MONETIZATION_MODEL!=none), 17.6-multi-tenant (MULTI_TENANT=true), 28.7-business-intelligence (BI_ENABLED=true), 28.8-seo-deep-planning (SEO_ENABLED=true), 14.75-privacy-engineering (always), 18.75-migration (MIGRATION_SUPPORT=true), 18.85-team-ops (TEAM_SIZE>1), 27.5-plg (GROWTH_MODEL=product-led), 28.6-marketplace (HAS_MARKETPLACE=true), 28.85-partner-channel (PARTNER_CHANNEL=true), 28.9-fundraising (FUNDRAISING_ENABLED=true). Marketing steps (19-28.5) are skipped if user chose to skip marketing at Step 18.8 gate. Hardening steps (29-33) are mandatory for ALL paths.

---

## Template Resolution Rules

### Placeholder Syntax
All `.template` files use `{{VARIABLE_NAME}}` (double curly braces).

### Conditional Sections
```markdown
<!-- IF {{ORM}} == "prisma" -->
Content only for Prisma projects
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
Content only for Next.js projects
<!-- ENDIF -->

<!-- IF {{MONOREPO}} == true -->
Content only for monorepo projects
<!-- ENDIF -->
```

To resolve: keep matching sections, delete non-matching sections (including the comment markers).

**In non-markdown files** (`.ts`, `.mjs`, `.gitignore`), conditionals are wrapped in language-appropriate comment syntax:
```javascript
// <!-- IF {{HAS_NEXTJS}} == "true" -->
import nextPlugin from '@next/eslint-plugin-next';
// <!-- ENDIF -->
```

```gitignore
# <!-- IF {{STACK}} == "python" -->
__pycache__/
*.py[cod]
# <!-- ENDIF -->
```

Strip the entire line (including the `//` or `#` prefix) when resolving.

**Boolean comparisons** always use string values: `"true"` or `"false"` (not bare `true`/`false`).

### Common Variables
| Variable | Example Values |
|----------|---------------|
| `{{PROJECT_NAME}}` | "My App" |
| `{{PROJECT_SLUG}}` | "my-app" |
| `{{FRONTEND_FRAMEWORK}}` | "next", "react", "vue", "none" |
| `{{BACKEND_FRAMEWORK}}` | "nestjs", "express", "fastapi", "django", "rails", "none" |
| `{{DATABASE}}` | "postgresql", "mysql", "mongodb", "sqlite" |
| `{{ORM}}` | "prisma", "typeorm", "drizzle", "sqlalchemy", "django-orm" |
| `{{PKG_MANAGER}}` | "pnpm", "npm", "yarn", "pip", "bundle" |
| `{{LINT_CMD}}` | "pnpm lint", "npm run lint", "python manage.py check" |
| `{{TEST_CMD}}` | "pnpm test", "pytest", "bundle exec rspec" |
| `{{BUILD_CMD}}` | "pnpm build", "python manage.py collectstatic" |
| `{{API_PREFIX}}` | "/api/v1", "/api", "" |
| `{{FRONTEND_PORT}}` | 3000, 5173, 8080 |
| `{{BACKEND_PORT}}` | 3001, 8000, 3000 |
| `{{PROJECT_TYPE}}` | "web", "mobile", "web+mobile" |
| `{{HAS_WEB}}` | "true", "false" |
| `{{HAS_MOBILE}}` | "true", "false" |
| `{{MOBILE_FRAMEWORK}}` | "react-native", "flutter", "native", "none" |
| `{{MOBILE_PLATFORMS}}` | "ios", "android", "both" |
| `{{EXPO_MANAGED}}` | "true", "false" |
| `{{MOBILE_OFFLINE}}` | "true", "false" |

---

## Recovery / Resume

If context resets mid-process (new conversation, compaction, crash):

1. Read this file — check the STATE BLOCK at the top
2. Read `dev_docs/session-context.md` — the decision memory file (carries forward ALL reasoning and user intent)
3. Read `dev_docs/handoff.md` — what was done last session and the exact next action
4. `CURRENT_STEP` tells you where to resume
5. `COMPLETED` lists what's done — don't redo these
6. `CONFIG` has all project variables — don't re-ask the user
7. `IN_PROGRESS` shows partial step completion — resume mid-step if populated
8. Each step is idempotent — re-running overwrites cleanly

See the **Context Recovery Protocol** in the Autopilot Principles section for the full step-specific recovery file table.

### Announce on Resume

When resuming from a context reset, always tell the user:
> "Resuming from Step {N}. I've read the session context and handoff files.
> Last session completed: {steps}. Next action: {exact action from handoff}."
