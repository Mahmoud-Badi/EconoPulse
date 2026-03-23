---
name: gsd-autopilot
description: |
  Launch GSD in autonomous overnight mode with multi-account rotation.
  Starts a self-restarting loop that runs /gsd repeatedly, rotating between
  Claude Max accounts on rate limit, with safe pause/resume.

  Use when:
  - User says "autopilot", "run overnight", "gsd autopilot", "run while I sleep"
  - User says "/gsd-autopilot", "start autopilot", "autonomous mode"
  - User says "pause autopilot", "stop autopilot"
  - User says "autopilot status", "is it running"
  - User says "setup accounts", "configure accounts" (for multi-account setup)

  Examples:
  - "/gsd-autopilot" — start the overnight runner
  - "/gsd-autopilot sprint-001" — target specific sprint
  - "/gsd-autopilot pause" — safe stop after current task
  - "/gsd-autopilot status" — check if running
  - "/gsd-autopilot setup" — configure multi-account rotation
---

# GSD Autopilot — Unattended Sprint Execution

Launches GSD in a self-restarting loop that survives context window limits.
Each session runs fresh, picks up from `.gsd/state.json`, and completes tasks
until the sprint is done or a pause signal is received.

## Locate the Script

The autopilot script lives at `${CLAUDE_PLUGIN_ROOT}/tools/scripts/gsd-autopilot.sh`.
Use this path when running it.

If the script doesn't exist at that path, check for it in the project root
(`gsd-autopilot.sh`) or create it from the Master Kit template.

---

## Handle: PAUSE / STOP

If the user says "pause", "stop", or "pause autopilot":

```bash
mkdir -p .gsd && touch .gsd/STOP_AUTOPILOT
```

Tell them: "Pause signal sent. The autopilot will finish its current task and stop cleanly. To resume, run `/gsd-autopilot` again."

---

## Handle: STATUS

If the user asks about status:

```bash
if [ -f .gsd/STOP_AUTOPILOT ]; then
  echo "STATUS: PAUSED (stop signal present)"
elif pgrep -f "gsd-autopilot.sh" > /dev/null 2>&1; then
  echo "STATUS: RUNNING (PID: $(pgrep -f gsd-autopilot.sh))"
else
  echo "STATUS: NOT RUNNING"
fi
echo "---"
echo "Last 5 log entries:"
tail -5 gsd-overnight.log 2>/dev/null || echo "No log file yet."
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
configured accounts.

If they only have 1 account, that's fine — it works with 1 account too
(just waits on rate limit instead of rotating).

---

## Handle: START

**Do NOT ask for confirmation. Start immediately.**

1. Detect the autopilot script path:

```bash
SCRIPT=""
if [ -f "${CLAUDE_PLUGIN_ROOT}/tools/scripts/gsd-autopilot.sh" ]; then
  SCRIPT="${CLAUDE_PLUGIN_ROOT}/tools/scripts/gsd-autopilot.sh"
elif [ -f "gsd-autopilot.sh" ]; then
  SCRIPT="gsd-autopilot.sh"
fi
```

2. If not found, tell user to copy it from the Master Kit.

3. If found, run it in background:

```bash
nohup bash "$SCRIPT" ${SPRINT_ARG} >> gsd-overnight.log 2>&1 &
echo "Autopilot PID: $!"
```

Where `${SPRINT_ARG}` is the sprint ID if the user provided one (e.g., `sprint-001`).

4. Tell the user:
   - "Autopilot is running in the background (PID: XXXX)"
   - "You can close this chat — it keeps going"
   - "To pause safely: `/gsd-autopilot pause`"
   - "To check progress: `/gsd-autopilot status` or open `gsd-overnight.log`"
   - "It stops automatically when the sprint is complete"
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

---

## Files Created by Autopilot

| File | Purpose |
|------|---------|
| `gsd-overnight.log` | Full execution log (append-only) |
| `.gsd/STOP_AUTOPILOT` | Pause signal (created by pause, deleted on next start) |
| `.gsd/state.json` | GSD sprint state (used for resume) |
| `dev_docs/handoff.md` | What was done + what's next |
