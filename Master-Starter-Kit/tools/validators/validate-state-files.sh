#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# validate-state-files.sh — State File Freshness Validator
#
# Checks that critical state files exist and are current:
#   - STATUS.md exists and was modified in the last commit
#   - handoff.md exists and was modified in the last commit
#   - DEVLOG.md exists and has entries
#   - ARCH-ANCHOR.md exists (if architecture phase complete)
#
# Usage: validate-state-files.sh [dev_docs_dir]
#   dev_docs_dir  Path to dev_docs directory (default: ./dev_docs)
#
# Exit codes:
#   0 — All state files are current
#   1 — State files are stale or missing
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

DEV_DOCS="${1:-./dev_docs}"
FAILURES=0
WARNINGS=0

echo "${BOLD}${CYAN}=== State File Freshness Validator ===${RESET}"
echo "Checking: ${DEV_DOCS}"
echo ""

# Get list of files modified in the last commit (if in a git repo)
LAST_COMMIT_FILES=""
IN_GIT_REPO=false
if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  IN_GIT_REPO=true
  LAST_COMMIT_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD 2>/dev/null || true)
fi

check_exists() {
  local file="$1"
  local label="$2"
  local required="$3"  # required | optional

  if [[ -f "$file" ]]; then
    echo "  ${GREEN}EXISTS${RESET} ${label} (${file})"
    return 0
  else
    if [[ "$required" == "required" ]]; then
      echo "  ${RED}MISSING${RESET} ${label} (${file})"
      FAILURES=$((FAILURES + 1))
    else
      echo "  ${YELLOW}MISSING${RESET} ${label} (${file}) — optional"
      WARNINGS=$((WARNINGS + 1))
    fi
    return 1
  fi
}

check_freshness() {
  local file="$1"
  local label="$2"

  if [[ "$IN_GIT_REPO" == false ]]; then
    echo "  ${YELLOW}SKIP${RESET} Cannot check freshness — not in a git repository"
    return 0
  fi

  # Normalize the file path for comparison
  local rel_path
  rel_path=$(git ls-files --full-name "$file" 2>/dev/null || true)

  if [[ -z "$rel_path" ]]; then
    # File exists but isn't tracked by git
    echo "  ${YELLOW}UNTRACKED${RESET} ${label} is not tracked by git"
    WARNINGS=$((WARNINGS + 1))
    return 0
  fi

  if echo "$LAST_COMMIT_FILES" | grep -qF "$rel_path"; then
    echo "  ${GREEN}FRESH${RESET} ${label} was updated in the last commit"
    return 0
  else
    echo "  ${RED}STALE${RESET} ${label} was NOT updated in the last commit"
    FAILURES=$((FAILURES + 1))
    return 1
  fi
}

check_has_entries() {
  local file="$1"
  local label="$2"

  local line_count
  line_count=$(wc -l < "$file" | tr -d '[:space:]')

  # Check for at least some meaningful content (more than just a header)
  if [[ "$line_count" -lt 5 ]]; then
    echo "  ${RED}EMPTY${RESET} ${label} has only ${line_count} lines — appears to have no entries"
    FAILURES=$((FAILURES + 1))
    return 1
  fi

  # Check for entry markers (dates, headers, bullet points)
  local entry_count
  entry_count=$(grep -cE '(^#{1,4}\s|^[-*]\s|^[0-9]{4}-[0-9]{2}-[0-9]{2}|^>\s)' "$file" 2>/dev/null || echo 0)

  if [[ "$entry_count" -lt 1 ]]; then
    echo "  ${YELLOW}WARN${RESET} ${label} has content but no clear log entries detected"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "  ${GREEN}ENTRIES${RESET} ${label} has ${entry_count} entry marker(s)"
  fi
  return 0
}

# -------------------------------------------------------------------------
# 1. STATUS.md
# -------------------------------------------------------------------------
echo "${BOLD}1. STATUS.md${RESET}"
# Search common locations
STATUS_FILE=""
for candidate in "${DEV_DOCS}/STATUS.md" "${DEV_DOCS}/status.md" "./STATUS.md"; do
  if [[ -f "$candidate" ]]; then
    STATUS_FILE="$candidate"
    break
  fi
done

if [[ -n "$STATUS_FILE" ]]; then
  check_exists "$STATUS_FILE" "STATUS.md" "required"
  check_freshness "$STATUS_FILE" "STATUS.md"
else
  echo "  ${RED}MISSING${RESET} STATUS.md not found in ${DEV_DOCS}/ or project root"
  FAILURES=$((FAILURES + 1))
fi
echo ""

# -------------------------------------------------------------------------
# 2. handoff.md
# -------------------------------------------------------------------------
echo "${BOLD}2. handoff.md${RESET}"
HANDOFF_FILE=""
for candidate in "${DEV_DOCS}/handoff.md" "${DEV_DOCS}/HANDOFF.md" "./handoff.md" "./HANDOFF.md"; do
  if [[ -f "$candidate" ]]; then
    HANDOFF_FILE="$candidate"
    break
  fi
done

if [[ -n "$HANDOFF_FILE" ]]; then
  check_exists "$HANDOFF_FILE" "handoff.md" "required"
  check_freshness "$HANDOFF_FILE" "handoff.md"
else
  echo "  ${RED}MISSING${RESET} handoff.md not found in ${DEV_DOCS}/ or project root"
  FAILURES=$((FAILURES + 1))
fi
echo ""

# -------------------------------------------------------------------------
# 3. DEVLOG.md
# -------------------------------------------------------------------------
echo "${BOLD}3. DEVLOG.md${RESET}"
DEVLOG_FILE=""
for candidate in "${DEV_DOCS}/DEVLOG.md" "${DEV_DOCS}/devlog.md" "./DEVLOG.md"; do
  if [[ -f "$candidate" ]]; then
    DEVLOG_FILE="$candidate"
    break
  fi
done

if [[ -n "$DEVLOG_FILE" ]]; then
  check_exists "$DEVLOG_FILE" "DEVLOG.md" "required"
  check_has_entries "$DEVLOG_FILE" "DEVLOG.md"
else
  echo "  ${RED}MISSING${RESET} DEVLOG.md not found in ${DEV_DOCS}/ or project root"
  FAILURES=$((FAILURES + 1))
fi
echo ""

# -------------------------------------------------------------------------
# 4. ARCH-ANCHOR.md (optional — only required after architecture phase)
# -------------------------------------------------------------------------
echo "${BOLD}4. ARCH-ANCHOR.md${RESET}"
ARCH_FILE=""
for candidate in "${DEV_DOCS}/ARCH-ANCHOR.md" "${DEV_DOCS}/arch-anchor.md" "./ARCH-ANCHOR.md"; do
  if [[ -f "$candidate" ]]; then
    ARCH_FILE="$candidate"
    break
  fi
done

if [[ -n "$ARCH_FILE" ]]; then
  check_exists "$ARCH_FILE" "ARCH-ANCHOR.md" "optional"
else
  # Check if architecture phase appears complete (service specs exist)
  if [[ -d "${DEV_DOCS}/specs/services" ]] && ls "${DEV_DOCS}/specs/services"/*.md &>/dev/null 2>&1; then
    echo "  ${YELLOW}WARN${RESET} Architecture specs exist but ARCH-ANCHOR.md is missing"
    echo "        Create ARCH-ANCHOR.md to lock architecture decisions"
    WARNINGS=$((WARNINGS + 1))
  else
    echo "  ${YELLOW}SKIP${RESET} ARCH-ANCHOR.md not required (architecture phase not detected)"
  fi
fi
echo ""

# --- Summary ---
echo "${BOLD}=== Summary ===${RESET}"
echo "Failures: ${FAILURES}"
echo "Warnings: ${WARNINGS}"

if [[ "$FAILURES" -gt 0 ]]; then
  echo ""
  echo "${RED}${BOLD}FAILED: ${FAILURES} state file issue(s) found${RESET}"
  echo "Update state files before proceeding to the next step."
  exit 1
else
  if [[ "$WARNINGS" -gt 0 ]]; then
    echo ""
    echo "${YELLOW}${BOLD}PASSED with ${WARNINGS} warning(s)${RESET}"
  else
    echo ""
    echo "${GREEN}${BOLD}PASSED: All state files are current${RESET}"
  fi
  exit 0
fi
