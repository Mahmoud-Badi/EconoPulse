#!/bin/bash
# ============================================================
# KIT AUTOPILOT v1 — Multi-Account Unattended Kit Planning
# ============================================================
# Part of Master Starter Kit — runs /kit steps 3-33 unattended
# after the initial interactive intake (Steps 0-2.5).
#
# Features:
#   - Auto-restarts fresh sessions (no context rot)
#   - Rotates between up to 3 Claude Max accounts on rate limit
#   - Safe pause/resume via stop file
#   - Full logging
#   - Session boundary detection (clean exit + restart)
#   - Completion detection via KIT_COMPLETE signal
#   - Pre-run check for already-complete kit
#
# Prerequisites:
#   - Interactive intake (Steps 0-2.5) must be completed first
#   - dev_docs/session-context.md must exist
#
# Setup (one-time, shared with GSD autopilot):
#   bash gsd-setup-accounts.sh
#
# Usage:
#   bash kit-autopilot.sh                  # Start/resume
#   bash kit-autopilot.sh --max-runs 30    # Limit sessions
#
# To stop safely:
#   touch .kit/STOP_AUTOPILOT
#
# ============================================================

set -euo pipefail

# ── RESOLVE PROJECT DIR ──
PROJECT_DIR="$(pwd)"
LOG_FILE="$PROJECT_DIR/kit-overnight.log"
STOP_FILE="$PROJECT_DIR/.kit/STOP_AUTOPILOT"
COMPLETE_FILE="$PROJECT_DIR/dev_docs/.kit-complete"

# ── PARSE ARGS ──
MAX_RUNS=50

while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-runs) MAX_RUNS="$2"; shift 2 ;;
    *) shift ;;
  esac
done

# ── TIMING CONFIG ──
RATE_LIMIT_WAIT=300           # 5 min wait when ALL accounts rate-limited
BETWEEN_RUNS_WAIT=15          # 15 sec between normal runs
RUN_COUNT=0

# ── ACCOUNT PROFILES ──
# Profiles are stored globally at ~/.claude-acct{1,2,3}
# Created by gsd-setup-accounts.sh (one-time setup, shared)
PROFILES=()
for dir in "$HOME/.claude-acct1" "$HOME/.claude-acct2" "$HOME/.claude-acct3"; do
  if [ -d "$dir" ]; then
    PROFILES+=("$dir")
  fi
done

# If no named profiles, use default (~/.claude)
if [ ${#PROFILES[@]} -eq 0 ]; then
  PROFILES=("")
fi

CURRENT_PROFILE_IDX=0
CONSECUTIVE_RATE_LIMITS=0

# ── FUNCTIONS ──
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

get_profile_name() {
  if [ -z "$1" ]; then echo "default"; else basename "$1"; fi
}

rotate_account() {
  CURRENT_PROFILE_IDX=$(( (CURRENT_PROFILE_IDX + 1) % ${#PROFILES[@]} ))
  log "ACCOUNT ROTATION: Switched to [$(get_profile_name "${PROFILES[$CURRENT_PROFILE_IDX]}")]"
}

check_prerequisites() {
  if [ ! -f "$PROJECT_DIR/dev_docs/session-context.md" ]; then
    log "ERROR: dev_docs/session-context.md not found."
    log "Run /kit interactively first to complete intake (Steps 0-2.5)."
    log "The kit autopilot runs Steps 3-33 after intake is done."
    exit 1
  fi
}

check_already_complete() {
  if [ -f "$COMPLETE_FILE" ]; then
    log "KIT ALREADY COMPLETE — dev_docs/.kit-complete exists. Nothing to do."
    return 0
  fi
  return 1
}

run_claude() {
  local profile="${PROFILES[$CURRENT_PROFILE_IDX]}"
  local profile_name
  profile_name=$(get_profile_name "$profile")
  local tmp_output
  tmp_output=$(mktemp)

  log "Session starting on [$profile_name]..."

  local prompt="Run /kit resume --autopilot. Read dev_docs/session-context.md and dev_docs/handoff.md first. Resume from the current STATE BLOCK. Execute all steps autonomously with GATE_MODE=autopilot. Do NOT ask for user input — auto-resolve all decisions from CONFIG and sensible defaults. At session boundaries, persist state and output KIT_SESSION_BOUNDARY. When Step 33 completes, output KIT_COMPLETE."

  # Run with or without custom config dir
  if [ -n "$profile" ]; then
    CLAUDE_CONFIG_DIR="$profile" claude -p "$prompt" \
      --dangerously-skip-permissions \
      2>&1 | tee -a "$LOG_FILE" > "$tmp_output"
  else
    claude -p "$prompt" \
      --dangerously-skip-permissions \
      2>&1 | tee -a "$LOG_FILE" > "$tmp_output"
  fi

  local exit_code=$?

  # Detect outcome (order matters — check specific signals first)
  if grep -q "KIT_COMPLETE" "$tmp_output" 2>/dev/null; then
    rm -f "$tmp_output"
    return 3
  fi

  if grep -q "KIT_SESSION_BOUNDARY" "$tmp_output" 2>/dev/null; then
    rm -f "$tmp_output"
    return 5
  fi

  if grep -qi "rate.limit\|too.many.requests\|capacity\|overloaded\|429\|usage limit\|limit reached" "$tmp_output" 2>/dev/null; then
    log "RATE LIMIT on [$profile_name]"
    rm -f "$tmp_output"
    return 2
  fi

  if grep -qi "auth\|unauthorized\|401\|login required\|not authenticated" "$tmp_output" 2>/dev/null; then
    log "AUTH ERROR on [$profile_name]"
    rm -f "$tmp_output"
    return 4
  fi

  rm -f "$tmp_output"
  return $exit_code
}

# ── PREFLIGHT CHECKS ──
check_prerequisites

if check_already_complete; then
  exit 0
fi

# ── INIT ──
mkdir -p "$PROJECT_DIR/.kit"
rm -f "$STOP_FILE"

echo "" >> "$LOG_FILE"
log "============================================"
log "KIT AUTOPILOT v1"
log "Project: $PROJECT_DIR"
log "Accounts: ${#PROFILES[@]} profiles"
for i in "${!PROFILES[@]}"; do
  log "  [$((i+1))] $(get_profile_name "${PROFILES[$i]}")"
done
log "Max runs: $MAX_RUNS"
log "Pause: touch $STOP_FILE"
log "============================================"

# ── MAIN LOOP ──
while [ "$RUN_COUNT" -lt "$MAX_RUNS" ]; do

  # Check pause signal
  if [ -f "$STOP_FILE" ]; then
    log "PAUSE signal detected. Stopping gracefully."
    rm -f "$STOP_FILE"
    break
  fi

  # Check if already complete (another session may have finished)
  if check_already_complete; then
    break
  fi

  RUN_COUNT=$((RUN_COUNT + 1))
  log "── RUN $RUN_COUNT/$MAX_RUNS | Account: $(get_profile_name "${PROFILES[$CURRENT_PROFILE_IDX]}") ──"

  run_claude
  result=$?

  case $result in
    2) # Rate limit
      CONSECUTIVE_RATE_LIMITS=$((CONSECUTIVE_RATE_LIMITS + 1))
      if [ "$CONSECUTIVE_RATE_LIMITS" -ge "${#PROFILES[@]}" ]; then
        log "ALL accounts rate-limited. Cooling down ${RATE_LIMIT_WAIT}s..."
        CONSECUTIVE_RATE_LIMITS=0
        sleep "$RATE_LIMIT_WAIT"
      fi
      rotate_account
      sleep 10
      ;;
    3) # Kit complete
      log "KIT COMPLETE! All steps (3-33) finished."
      break
      ;;
    4) # Auth error
      log "Auth error — skipping profile"
      rotate_account
      sleep 5
      ;;
    5) # Session boundary (clean exit, restart needed)
      CONSECUTIVE_RATE_LIMITS=0
      log "SESSION BOUNDARY reached. State persisted. Restarting in ${BETWEEN_RUNS_WAIT}s..."
      sleep "$BETWEEN_RUNS_WAIT"
      ;;
    *) # Normal exit (context full, etc)
      CONSECUTIVE_RATE_LIMITS=0
      log "Session ended (exit: $result). Restarting in ${BETWEEN_RUNS_WAIT}s..."
      sleep "$BETWEEN_RUNS_WAIT"
      ;;
  esac
done

log "============================================"
log "KIT AUTOPILOT finished. Total runs: $RUN_COUNT"
if [ -f "$COMPLETE_FILE" ]; then
  log "STATUS: COMPLETE — all kit steps done"
else
  log "STATUS: INCOMPLETE — stopped before finishing (check .kit/state.json)"
fi
log "============================================"
