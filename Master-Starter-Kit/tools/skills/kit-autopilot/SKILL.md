---
name: kit-autopilot
description: |
  Launch /kit in autonomous overnight mode with multi-account rotation.
  Runs Steps 3-33 unattended after interactive intake (Steps 0-2.5) is complete.
  Starts a self-restarting loop that survives context window limits, rotating
  between Claude Max accounts on rate limit, with safe pause/resume.

  Use when:
  - User says "kit autopilot", "run kit overnight", "plan while I sleep"
  - User says "/kit-autopilot", "start kit autopilot", "autonomous planning"
  - User says "pause kit", "stop kit autopilot"
  - User says "kit autopilot status", "is kit running"
  - User says "setup accounts" (for multi-account setup, shared with GSD)

  Examples:
  - "/kit-autopilot" — start the overnight planning runner
  - "/kit-autopilot pause" — safe stop after current step
  - "/kit-autopilot status" — check if running and current step
  - "/kit-autopilot setup" — configure multi-account rotation
---

# Kit Autopilot — Unattended Kit Planning (Steps 3-33)

Launches /kit in a self-restarting loop that survives context window limits.
Each session runs fresh, reads session-context.md and the STATE BLOCK, and
continues from where the last session left off. All depth enforcement, hardening
rounds, enforcement gates, and validators run at full strength — only user
interaction is removed.

**Prerequisite:** Interactive intake (Steps 0-2.5) must be completed first via `/kit`.

## Locate the Script

Find the autopilot script. Check these paths in order:
1. `Master-Starter-Kit/tools/scripts/kit-autopilot.sh` (in the project)
2. `kit-autopilot.sh` (project root)

---

## Handle: PAUSE / STOP

If the user says "pause", "stop", or "pause kit":

```bash
mkdir -p .kit && touch .kit/STOP_AUTOPILOT
```

Tell them: "Pause signal sent. The kit autopilot will finish its current step and stop cleanly. To resume, run `/kit-autopilot` again."

---

## Handle: STATUS

If the user asks about status:

```bash
if [ -f .kit/STOP_AUTOPILOT ]; then
  echo "STATUS: PAUSED (stop signal present)"
elif [ -f dev_docs/.kit-complete ]; then
  echo "STATUS: COMPLETE (all steps done)"
elif pgrep -f "kit-autopilot.sh" > /dev/null 2>&1; then
  echo "STATUS: RUNNING (PID: $(pgrep -f kit-autopilot.sh))"
else
  echo "STATUS: NOT RUNNING"
fi
echo "---"
if [ -f .kit/state.json ]; then
  echo "Current step:"
  cat .kit/state.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"  Step {d.get('current_step','?')}: {d.get('current_step_name','?')}\")" 2>/dev/null || echo "  (unable to parse state)"
  echo "Completed steps: $(cat .kit/state.json | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('completed_steps',[])))" 2>/dev/null || echo '?')"
fi
echo "---"
echo "Last 5 log entries:"
tail -5 kit-overnight.log 2>/dev/null || echo "No log file yet."
```

---

## Handle: SETUP (multi-account configuration)

If the user says "setup", "setup accounts", or "configure accounts":

Tell them they need to run these 3 commands in a terminal (one time only).
Each one opens a browser to authorize:

```
Account 1:  CLAUDE_CONFIG_DIR=~/.claude-acct1 claude auth login
Account 2:  CLAUDE_CONFIG_DIR=~/.claude-acct2 claude auth login
Account 3:  CLAUDE_CONFIG_DIR=~/.claude-acct3 claude auth login
```

Or they can double-click `gsd-setup-accounts.bat` if it exists in the project.

After setup, the autopilot automatically detects and rotates between all
configured accounts. These profiles are shared with the GSD autopilot.

If they only have 1 account, that's fine — it works with 1 account too
(just waits on rate limit instead of rotating).

---

## Handle: START

**Do NOT ask for confirmation. Start immediately.**

1. Check prerequisites:

```bash
if [ ! -f dev_docs/session-context.md ]; then
  echo "ERROR: Intake not completed. Run /kit first to complete Steps 0-2.5."
  echo "The kit autopilot handles Steps 3-33 after intake is done."
  exit 1
fi

if [ -f dev_docs/.kit-complete ]; then
  echo "Kit is already complete! All steps have been executed."
  echo "Run /gsd to start building, or /kit-upgrade to review quality."
  exit 0
fi
```

2. Detect the autopilot script path:

```bash
SCRIPT=""
if [ -f "Master-Starter-Kit/tools/scripts/kit-autopilot.sh" ]; then
  SCRIPT="Master-Starter-Kit/tools/scripts/kit-autopilot.sh"
elif [ -f "kit-autopilot.sh" ]; then
  SCRIPT="kit-autopilot.sh"
fi
```

3. If not found, tell user to copy it from the Master Kit.

4. If found, run it in background:

```bash
nohup bash "$SCRIPT" >> kit-overnight.log 2>&1 &
echo "Kit Autopilot PID: $!"
```

5. Tell the user:
   - "Kit autopilot is running in the background (PID: XXXX)"
   - "It will execute Steps 3-33 with full depth enforcement — no steps skipped"
   - "You can close this chat — it keeps going"
   - "To pause safely: `/kit-autopilot pause`"
   - "To check progress: `/kit-autopilot status` or open `kit-overnight.log`"
   - "It stops automatically when Step 33 (Expansion Planning) is complete"
   - "When done, run `/gsd` to start the build execution phase"
   - "If laptop sleeps, it pauses and resumes when it wakes"

---

## Multi-Account Rotation Logic

The autopilot checks for pre-authenticated profiles at:
- `~/.claude-acct1`
- `~/.claude-acct2`
- `~/.claude-acct3`

When a rate limit is hit:
1. Switch to the next profile
2. If ALL profiles are rate-limited, wait 5 minutes
3. Resume with the next profile

This means with 3 accounts you get near-continuous execution.
With 1 account, you get automatic retry after cooldown.

These profiles are shared with the GSD autopilot — set up once, use for both.

---

## Files Created by Kit Autopilot

| File | Purpose |
|------|---------|
| `kit-overnight.log` | Full execution log (append-only) |
| `.kit/STOP_AUTOPILOT` | Pause signal (created by pause, deleted on next start) |
| `.kit/state.json` | Kit progress tracking (step, status, timestamps) |
| `dev_docs/.kit-complete` | Completion signal (written when Step 33 finishes) |
| `dev_docs/session-context.md` | Session state (updated at every boundary) |
| `dev_docs/handoff.md` | What was done + what's next (updated at every boundary) |

---

## Quality Guarantees

The kit autopilot does NOT reduce quality. Everything runs at full strength:

- **Depth enforcement:** Service specs >=9/10, screen specs >=8/10, 8/8 task layers
- **Hardening:** All 17 rounds across Steps 29-33 (audit, enhance, verify, deep dive, expansion)
- **Enforcement gates:** All 16 gates with proof artifacts
- **Validators:** gate-checker.sh runs at every gate checkpoint
- **TTG protocol:** Abbreviated (4 questions instead of 8 for services) but mandatory
- **Cross-reference validation:** Full consistency checks at Steps 4.5, 6.5, 8.6
- **Completeness matrices:** Service matrix, screen matrix, phase coverage all verified

The only thing removed is human interaction — gates auto-pass with logged summaries,
decisions auto-resolve from CONFIG, and session boundaries trigger clean restarts.
