---
description: Run the Master Starter Kit autopilot. Use /kit to start fresh, /kit resume to continue, /kit audit to harden, /kit status to check progress.
argument-hint: [start|resume|audit|status]
---

# /kit — Master Starter Kit

## Kit Home
```
{{KIT_HOME}}
```

The **target project** is always the current working directory. All output files go to `{cwd}/dev_docs/`. Never write into the kit directory.

---

## Route by argument

### `/kit` or `/kit start` — Fresh bootstrap
1. Read `{{KIT_HOME}}/ORCHESTRATOR.md`
2. Read `{{KIT_HOME}}/CLAUDE.md`
3. Check if `{cwd}/dev_docs/session-context.md` exists — if yes, warn the user that an in-progress session was found and ask whether to resume or start fresh
4. Execute ORCHESTRATOR from Step 0 (intake)

### `/kit resume` — Resume in-progress session
1. Read `{{KIT_HOME}}/ORCHESTRATOR.md`
2. Read `{{KIT_HOME}}/CLAUDE.md`
3. Read `{cwd}/dev_docs/session-context.md` — find last completed step and state
4. Read `{cwd}/dev_docs/handoff.md` if it exists
5. Resume ORCHESTRATOR from the last completed step, present a session briefing first

### `/kit audit` — Quality hardening
1. Read `{{KIT_HOME}}/ORCHESTRATOR.md` (Steps 29–33 only)
2. Read `{{KIT_HOME}}/CLAUDE.md`
3. Execute the hardening sequence: audit → enhance → deepen → expand specs

### `/kit status` — Project dashboard
1. Read `{cwd}/dev_docs/session-context.md`
2. Read `{cwd}/dev_docs/STATUS.md` if it exists
3. Print a status dashboard:
   - Current ORCHESTRATOR step
   - Sections completed vs remaining
   - Files generated so far (count)
   - Next action

---

If `$ARGUMENTS` is empty, treat as `/kit start`.
