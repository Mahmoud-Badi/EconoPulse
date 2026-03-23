#!/usr/bin/env bash
# pre-commit-doc-gate.sh
# Git pre-commit hook that checks if feature code changes include documentation updates.
#
# Installation:
#   cp hooks/pre-commit-doc-gate.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Modes:
#   DOC_GATE_STRICT=true  — blocks commit if docs missing (recommended for CI)
#   DOC_GATE_STRICT=false — warns but allows commit (default for local dev)
#
# Skip:
#   git commit --no-verify  OR  include [skip-doc-check] in commit message

set -euo pipefail

# --- Configuration ---
DOC_GATE_STRICT="${DOC_GATE_STRICT:-false}"
USER_DOCS_PATH="${USER_DOCS_PATH:-user_docs}"
APP_DIRS="apps/ packages/src/ src/"
IGNORE_PATTERNS="\.test\.|\.spec\.|__tests__/|\.json$|\.yaml$|\.toml$|\.env|\.lock$"

# --- Colors ---
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# --- Check if doc hooks are disabled ---
if [ "${DOC_HOOKS_DISABLED:-false}" = "true" ]; then
  exit 0
fi

# --- Check for skip marker in commit message ---
COMMIT_MSG_FILE=".git/COMMIT_EDITMSG"
if [ -f "$COMMIT_MSG_FILE" ] && grep -q "\[skip-doc-check\]" "$COMMIT_MSG_FILE" 2>/dev/null; then
  exit 0
fi

# --- Get staged files ---
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# --- Check if any feature code files are staged ---
FEATURE_FILES=""
for dir in $APP_DIRS; do
  MATCHES=$(echo "$STAGED_FILES" | grep "^$dir" 2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    # Filter out test/config files
    FILTERED=$(echo "$MATCHES" | grep -Ev "$IGNORE_PATTERNS" 2>/dev/null || true)
    if [ -n "$FILTERED" ]; then
      FEATURE_FILES="$FEATURE_FILES
$FILTERED"
    fi
  fi
done

# Trim whitespace
FEATURE_FILES=$(echo "$FEATURE_FILES" | sed '/^$/d')

if [ -z "$FEATURE_FILES" ]; then
  # No feature code changed — skip check
  exit 0
fi

# --- Check if any documentation files are staged ---
DOC_FILES=$(echo "$STAGED_FILES" | grep "^$USER_DOCS_PATH/" 2>/dev/null || true)

if [ -n "$DOC_FILES" ]; then
  # Docs were updated alongside code — all good
  echo -e "${GREEN}Doc check: Feature code + documentation updated together.${NC}"
  exit 0
fi

# --- Feature code changed without docs ---
FILE_COUNT=$(echo "$FEATURE_FILES" | wc -l | tr -d ' ')

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  DOCUMENTATION CHECK${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "  ${RED}$FILE_COUNT feature file(s) changed without documentation updates.${NC}"
echo ""
echo "  Changed feature files:"
echo "$FEATURE_FILES" | while read -r f; do
  echo "    - $f"
done
echo ""
echo "  Expected: At least one file in $USER_DOCS_PATH/ should be updated."
echo ""
echo "  To fix:"
echo "    1. Run /document-feature to generate docs"
echo "    2. Stage the doc files: git add $USER_DOCS_PATH/"
echo "    3. Commit again"
echo ""

if [ "$DOC_GATE_STRICT" = "true" ]; then
  echo -e "  ${RED}BLOCKED: DOC_GATE_STRICT=true. Commit rejected.${NC}"
  echo "  To bypass: git commit --no-verify"
  echo ""
  exit 1
else
  echo -e "  ${YELLOW}WARNING: Proceeding without docs (DOC_GATE_STRICT=false).${NC}"
  echo "  Set DOC_GATE_STRICT=true to enforce documentation on every commit."
  echo ""
  exit 0
fi
