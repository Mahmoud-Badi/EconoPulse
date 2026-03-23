#!/usr/bin/env bash
# session-end-doc-check.sh
# Claude Code Stop hook — checks for undocumented completed tasks before session ends.
# Installed during ORCHESTRATOR Step 15.5.

if [ "${DOC_HOOKS_DISABLED:-false}" = "true" ]; then
  exit 0
fi

USER_DOCS_PATH="${USER_DOCS_PATH:-user_docs}"
STATUS_FILE="dev_docs/STATUS.md"
TODAY=$(date +%Y-%m-%d)

if [ ! -f "$STATUS_FILE" ]; then
  exit 0
fi

# Count tasks marked DONE today
DONE_TODAY=$(grep -c "$TODAY.*DONE\|DONE.*$TODAY" "$STATUS_FILE" 2>/dev/null || echo "0")

if [ "$DONE_TODAY" -eq "0" ]; then
  exit 0
fi

# Check if docs were modified today
DOC_INDEX="$USER_DOCS_PATH/DOC-INDEX.md"
if [ -f "$DOC_INDEX" ]; then
  DOC_MODIFIED=$(find "$USER_DOCS_PATH" -name "*.md" -newermt "$TODAY" 2>/dev/null | wc -l | tr -d ' ')
else
  DOC_MODIFIED=0
fi

if [ "$DOC_MODIFIED" -eq "0" ]; then
  echo ""
  echo "DOC_ENFORCEMENT: Session ending with $DONE_TODAY task(s) completed today but no documentation updated."
  echo "Consider running /document-feature before ending this session."
  echo "Context about what was built will be lost after this session."
  echo ""
fi
