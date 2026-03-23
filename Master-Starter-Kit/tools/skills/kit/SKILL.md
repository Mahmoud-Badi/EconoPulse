---
name: kit
description: Start the Master Starter Kit autopilot engine. Use when the user says "Run Master", "run master", "Start Master", "start master", "Launch Master", "Run the Master Kit", or types /kit. This skill launches the full 90+ step project planning automation framework that produces complete specs, architecture, tasks, and documentation before writing code.
---

# Master Starter Kit — Autopilot

## Kit Home
```
{{KIT_HOME}}
```

## What This Does
Runs the Master Starter Kit ORCHESTRATOR against the **current working directory** (the target project). Produces complete documentation — specs, architecture, task breakdown, operations, marketing — before any code is written.

## How to Start

### Step 1 — Read the kit entry point
Read the ORCHESTRATOR:
```
{{KIT_HOME}}/ORCHESTRATOR.md
```

### Step 2 — Read the kit rules
Read the kit-level instructions:
```
{{KIT_HOME}}/CLAUDE.md
```

### Step 3 — Confirm the target project
The **target project** is the current working directory — NOT the kit directory.
All output files go into `{cwd}/dev_docs/`.
Never write files into the kit's own directory.

### Step 4 — Execute
Follow the ORCHESTRATOR from Step 0. Obey every GATE checkpoint, TTG protocol, and session boundary exactly as written.

Step 0 installs the ecosystem. **Step 0.5 automatically detects the project's maturity level** (using `00-discovery/PROJECT-MATURITY-DETECTOR.md`) and routes to the correct path:
- **Greenfield** → standard Step 1 intake (47 questions)
- **Existing code without kit artifacts** → Enhance path (`37-enhance/ENHANCE-INTAKE.md` → E1-E4 audit → Steps 5-16 with overlay)
- **Existing kit project** → redirects to `/kit-upgrade`

You do not need to manually select a path from PATHS.md — Step 0.5 handles routing automatically.

### Autopilot Mode (`resume --autopilot`)

If the argument `resume --autopilot` was passed (typically by `kit-autopilot.sh`):

1. Set `GATE_MODE` to `"autopilot"` in the STATE BLOCK
2. Read `dev_docs/session-context.md` → `dev_docs/handoff.md` → STATE BLOCK to find the resume point
3. Auto-pass all gate checkpoints — log a summary to `dev_docs/completeness/gate-log.md` instead of pausing
4. Use abbreviated TTG (questions 1,4,5,8 for services; 1,3,4 for screens; 1,4,5 for tasks)
5. Do NOT use `AskUserQuestion` — auto-resolve all decisions from CONFIG and sensible defaults
6. At every session boundary (SB-2 through SB-6):
   - Persist state fully (session-context.md, handoff.md, STATE BLOCK, `.kit/state.json`)
   - Output `KIT_SESSION_BOUNDARY` on its own line
   - **STOP** — do not proceed to the next step. The bash script will restart you.
7. When Step 33 completes:
   - Write `dev_docs/.kit-complete` with timestamp and summary
   - Update `.kit/state.json` with `status: "completed"`
   - Output `KIT_COMPLETE` on its own line
   - **STOP**
8. If context usage is running high (~80% estimated):
   - Persist state early and output `KIT_SESSION_BOUNDARY` even if not at a formal boundary
9. Update `.kit/state.json` after every step completion with current step, step name, completed list, and timestamp

**What does NOT change in autopilot mode:**
- All depth requirements from `DEPTH-REQUIREMENTS.md` (service >=9/10, screen >=8/10, 8/8 task layers)
- All hardening rounds (Steps 29-33, multi-round protocol, no shortcuts)
- All 16 enforcement gates from `ENFORCEMENT-GATES.md`
- All validators from `tools/validators/`
- TTG protocol (abbreviated but still mandatory)
- Completeness matrices and cross-reference validation
- On validation failure: retry up to 3 times with `REGENERATOR.md`, then log to `.kit/failures.json` and continue

## Critical Rules
- Target project = `cwd` (wherever the user has Claude Code open)
- Kit home = read-only reference source
- NEVER skip GATE checkpoints (in autopilot mode, gates auto-pass with logged summary — they are not skipped)
- NEVER treat the kit directory as the project being planned
- If the user's `cwd` already has a `dev_docs/` folder, read `dev_docs/session-context.md` first to check for an in-progress session before starting fresh
