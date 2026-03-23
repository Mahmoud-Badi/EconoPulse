#!/bin/bash
# ============================================================
# GSD AUTOPILOT v2 — Multi-Account Unattended Sprint Execution
# ============================================================
# Part of Master Starter Kit — works in any project.
#
# Features:
#   - Auto-restarts fresh sessions (no context rot)
#   - Rotates between up to 3 Claude Max accounts on rate limit
#   - Safe pause/resume via stop file
#   - Full logging
#   - Project-agnostic (runs in current directory)
#
# Setup (one-time):
#   bash gsd-setup-accounts.sh
#
# Usage:
#   bash gsd-autopilot.sh                  # Auto-detect sprint
#   bash gsd-autopilot.sh sprint-001       # Specific sprint
#   bash gsd-autopilot.sh --max-runs 20    # Limit runs
#
# To stop safely:
#   touch .gsd/STOP_AUTOPILOT
#
# ============================================================

set -euo pipefail

# ── RESOLVE PROJECT DIR ──
# If called from outside, use current dir. If called via symlink, follow it.
PROJECT_DIR="$(pwd)"
LOG_FILE="$PROJECT_DIR/gsd-overnight.log"
STOP_FILE="$PROJECT_DIR/.gsd/STOP_AUTOPILOT"

# ── PARSE ARGS ──
SPRINT=""
MAX_RUNS=100

while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-runs) MAX_RUNS="$2"; shift 2 ;;
    sprint-*) SPRINT="$1"; shift ;;
    *) shift ;;
  esac
done

# ── TIMING CONFIG ──
RATE_LIMIT_WAIT=300           # 5 min wait when ALL accounts rate-limited
BETWEEN_RUNS_WAIT=15          # 15 sec between normal runs
RUN_COUNT=0

# ── ACCOUNT PROFILES ──
# Profiles are stored globally at ~/.claude-acct{1,2,3}
# Created by gsd-setup-accounts.sh (one-time setup)
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

# ── FIND CLAUDE CLI ──
CLAUDE_BIN=""
if command -v claude &>/dev/null; then
  CLAUDE_BIN="claude"
elif [ -f "$HOME/.local/bin/claude.exe" ]; then
  CLAUDE_BIN="$HOME/.local/bin/claude.exe"
elif [ -f "$HOME/.local/bin/claude" ]; then
  CLAUDE_BIN="$HOME/.local/bin/claude"
elif [ -f "/c/Users/$USER/.local/bin/claude.exe" ]; then
  CLAUDE_BIN="/c/Users/$USER/.local/bin/claude.exe"
fi

if [ -z "$CLAUDE_BIN" ]; then
  echo "ERROR: claude CLI not found. Install it or add to PATH."
  exit 1
fi

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

run_claude() {
  local profile="${PROFILES[$CURRENT_PROFILE_IDX]}"
  local profile_name=$(get_profile_name "$profile")
  local tmp_output=$(mktemp)

  local gsd_cmd="Run /gsd"
  [ -n "$SPRINT" ] && gsd_cmd="Run /gsd $SPRINT"

  log "Session starting on [$profile_name]..."

  local prompt="$gsd_cmd. Execute tasks autonomously. Do NOT ask for confirmation — make reasonable decisions and document them. If a task fails after 2 attempts, mark it blocked with a reason and move to the next task. Complete as many tasks as possible. When the sprint is fully complete, say SPRINT_COMPLETE."

  # Run with or without custom config dir
  if [ -n "$profile" ]; then
    CLAUDE_CONFIG_DIR="$profile" "$CLAUDE_BIN" -p "$prompt" \
      --dangerously-skip-permissions \
      2>&1 | tee -a "$LOG_FILE" > "$tmp_output"
  else
    "$CLAUDE_BIN" -p "$prompt" \
      --dangerously-skip-permissions \
      2>&1 | tee -a "$LOG_FILE" > "$tmp_output"
  fi

  # Detect outcome
  if grep -qi "rate.limit\|too.many.requests\|capacity\|overloaded\|429\|usage limit\|limit reached" "$tmp_output" 2>/dev/null; then
    log "RATE LIMIT on [$profile_name]"
    rm -f "$tmp_output"; return 2
  fi

  if grep -q "SPRINT_COMPLETE" "$tmp_output" 2>/dev/null; then
    rm -f "$tmp_output"; return 3
  fi

  if grep -qi "auth\|unauthorized\|401\|login required\|not authenticated" "$tmp_output" 2>/dev/null; then
    log "AUTH ERROR on [$profile_name]"
    rm -f "$tmp_output"; return 4
  fi

  local exit_code=$?
  rm -f "$tmp_output"
  return $exit_code
}

# ── INIT ──
mkdir -p "$PROJECT_DIR/.gsd"
rm -f "$STOP_FILE"

echo "" >> "$LOG_FILE"
log "============================================"
log "GSD AUTOPILOT v2"
log "Project: $PROJECT_DIR"
log "Sprint: ${SPRINT:-auto-detect}"
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
    3) # Sprint done
      log "SPRINT COMPLETE!"
      break
      ;;
    4) # Auth error
      log "Auth error — skipping profile"
      rotate_account
      sleep 5
      ;;
    *) # Normal (context full, etc)
      CONSECUTIVE_RATE_LIMITS=0
      log "Session ended (exit: $result). Next in ${BETWEEN_RUNS_WAIT}s..."
      sleep "$BETWEEN_RUNS_WAIT"
      ;;
  esac
done

log "============================================"
log "AUTOPILOT finished. Total runs: $RUN_COUNT"
log "============================================"
