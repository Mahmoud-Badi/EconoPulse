#!/usr/bin/env bash
# Kit Harvest Auto-Scan Hook (SessionStart event)
#
# Runs automatically when a session starts in the Master Kit directory.
# Scans all registered local and remote projects for pending feedback,
# and reports a summary so the maintainer knows there's feedback to harvest.
#
# This is a NOTIFICATION hook — it tells you what's available but doesn't
# auto-apply. Run /kit-harvest to process and apply improvements.

set -euo pipefail

REGISTRY="feedback-inbox/project-registry.json"
INBOX="feedback-inbox"

# Only run if we're in the kit directory (feedback-inbox/ exists)
if [ ! -d "$INBOX" ]; then
  exit 0
fi

INBOX_COUNT=0
LOCAL_COUNT=0
REMOTE_COUNT=0

# Count existing inbox files (exclude examples and processed)
INBOX_COUNT=$(find "$INBOX" -maxdepth 1 -name "*.kit-feedback.json" -type f 2>/dev/null | wc -l | tr -d ' ')

# Check local projects
if [ -f "$REGISTRY" ] && command -v python3 &> /dev/null; then
  LOCAL_PATHS=$(python3 -c "
import json
try:
    with open('$REGISTRY') as f:
        data = json.load(f)
    for p in data.get('local_projects', []):
        if p.get('_example'):
            continue
        path = p.get('path', '')
        if path:
            print(path)
except:
    pass
" 2>/dev/null || echo "")

  while IFS= read -r PROJECT_PATH; do
    [ -z "$PROJECT_PATH" ] && continue
    if [ -f "$PROJECT_PATH/.kit-feedback.json" ]; then
      LOCAL_COUNT=$((LOCAL_COUNT + 1))
    elif [ -d "$PROJECT_PATH/dev_docs/kit-feedback/pending" ]; then
      PENDING=$(find "$PROJECT_PATH/dev_docs/kit-feedback/pending" -name "KF-*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
      if [ "$PENDING" -gt 0 ]; then
        LOCAL_COUNT=$((LOCAL_COUNT + 1))
      fi
    fi
  done <<< "$LOCAL_PATHS"

  # Count registered remote repos (just count, don't fetch yet)
  REMOTE_COUNT=$(python3 -c "
import json
try:
    with open('$REGISTRY') as f:
        data = json.load(f)
    count = sum(1 for r in data.get('remote_repos', []) if not r.get('_example') and r.get('url'))
    print(count)
except:
    print(0)
" 2>/dev/null || echo "0")
fi

TOTAL=$((INBOX_COUNT + LOCAL_COUNT))

if [ "$TOTAL" -gt 0 ] || [ "$REMOTE_COUNT" -gt 0 ]; then
  echo ""
  echo "=== Kit Feedback Available ==="
  if [ "$INBOX_COUNT" -gt 0 ]; then
    echo "  Inbox:   $INBOX_COUNT submissions ready to harvest"
  fi
  if [ "$LOCAL_COUNT" -gt 0 ]; then
    echo "  Local:   $LOCAL_COUNT projects with pending feedback"
  fi
  if [ "$REMOTE_COUNT" -gt 0 ]; then
    echo "  Remote:  $REMOTE_COUNT repos registered (run /kit-harvest to fetch)"
  fi
  echo ""
  echo "Run /kit-harvest to process all feedback."
  echo "==============================="
  echo ""
fi
