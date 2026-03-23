#!/usr/bin/env bash
# doc-enforcement-dispatcher.sh
# Claude Code PostToolUse hook — routes Edit/Write events to doc enforcement checks.
# Installed during ORCHESTRATOR Step 15.5.

if [ "${DOC_HOOKS_DISABLED:-false}" = "true" ]; then
  exit 0
fi

INPUT=$(cat)

# --- Check 1: Task marked DONE ---
if echo "$INPUT" | grep -q "STATUS.md" && echo "$INPUT" | grep -qi "DONE"; then
  # Was documentation recently updated?
  USER_DOCS_PATH="${USER_DOCS_PATH:-user_docs}"
  STATUS_FILE="dev_docs/STATUS.md"

  if [ -f "$STATUS_FILE" ]; then
    RECENT_DOCS=$(find "$USER_DOCS_PATH" -name "*.md" -newer "$STATUS_FILE" 2>/dev/null | head -1)

    if [ -z "$RECENT_DOCS" ]; then
      echo ""
      echo "DOC_ENFORCEMENT: Task marked DONE in STATUS.md."
      echo "ACTION REQUIRED: Run /document-feature NOW before committing or starting the next task."
      echo "Documentation must be captured while you still have full context of what was built."
      echo ""
    fi
  fi
fi

# --- Check 2: Phase transition ---
if echo "$INPUT" | grep -q "STATUS.md" && echo "$INPUT" | grep -q "CURRENT_STEP"; then
  echo ""
  echo "DOC_ENFORCEMENT: Phase transition detected in STATUS.md."
  echo "ACTION REQUIRED: Run /doc-quality-gate before proceeding to the next phase."
  echo "Coverage must be >= 90% to pass the gate."
  echo ""
fi
