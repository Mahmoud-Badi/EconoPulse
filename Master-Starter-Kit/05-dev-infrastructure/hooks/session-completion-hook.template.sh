#!/usr/bin/env bash

# session-completion-hook.template.sh — Session Completion Enforcement Hook
#
# Purpose: Verifies that all state files have been updated before ending a session.
# Install: Copy to project root and configure as a Claude Code Stop hook.
#
# This hook checks:
# 1. handoff.md was modified today (or within the last hour)
# 2. STATUS.md was modified today
# 3. DEVLOG.md was modified today
# 4. session-context.md was modified today (if it exists)
#
# Exit codes:
#   0 = All state files are fresh
#   1 = Stale state files detected (hook will warn)

DEV_DOCS="${1:-./dev_docs}"
STALE_FILES=()
NOW=$(date +%s)
# "Today" = within the last 24 hours
THRESHOLD=$((NOW - 86400))

check_freshness() {
  local file="$1"
  local label="$2"

  if [ ! -f "$file" ]; then
    # File doesn't exist — may not be generated yet
    return 0
  fi

  local mod_time
  mod_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null)

  if [ -z "$mod_time" ]; then
    return 0  # Can't determine — skip
  fi

  if [ "$mod_time" -lt "$THRESHOLD" ]; then
    STALE_FILES+=("$label ($file)")
  fi
}

# Check each state file
check_freshness "$DEV_DOCS/handoff.md" "handoff.md"
check_freshness "$DEV_DOCS/STATUS.md" "STATUS.md"
check_freshness "$DEV_DOCS/DEVLOG.md" "DEVLOG.md"
check_freshness "$DEV_DOCS/session-context.md" "session-context.md"

if [ ${#STALE_FILES[@]} -gt 0 ]; then
  echo ""
  echo "⚠ SESSION COMPLETION CHECK: Stale state files detected!"
  echo ""
  echo "The following files have not been updated today:"
  for file in "${STALE_FILES[@]}"; do
    echo "  - $file"
  done
  echo ""
  echo "Before ending this session, complete the Session Completion Checklist:"
  echo "  1. Update STATUS.md (toggle completed task checkboxes)"
  echo "  2. Update handoff.md (what was done + what's next)"
  echo "  3. Append to DEVLOG.md (work entry for this session)"
  echo "  4. Update session-context.md (decisions + reasoning)"
  echo ""
  echo "Template: 03-documentation/state-files/session-completion-checklist.template.md"
  echo ""
  exit 1
fi

exit 0
