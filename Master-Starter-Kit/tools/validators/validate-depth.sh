#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# validate-depth.sh — Depth Validator for Service & Screen Specs
#
# Validates that specification files meet minimum depth requirements:
#   - Service specs: min 1500 words, required sections, no red-flag phrases
#   - Screen specs: min 800 words, required sections, no red-flag phrases
#
# Usage: validate-depth.sh [dev_docs_dir]
#   dev_docs_dir  Path to dev_docs directory (default: ./dev_docs)
#
# Exit codes:
#   0 — All files pass
#   1 — One or more files fail validation
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
FILES_CHECKED=0

# --- Required sections ---
SERVICE_SECTIONS=("Overview" "Data Model" "API Endpoints" "Business Rules" "Error Handling" "Edge Cases")
SCREEN_SECTIONS=("Purpose" "Layout" "States" "Interactions" "Accessibility" "Mobile")

# --- Red-flag phrases (case-insensitive) ---
RED_FLAGS=("TBD" "TODO" "will be defined later" "as needed" "etc\." "and more" "various")

count_words() {
  wc -w < "$1" | tr -d '[:space:]'
}

check_sections() {
  local file="$1"
  shift
  local missing=()
  for section in "$@"; do
    if ! grep -qiE "^#{1,4}[[:space:]]+.*${section}" "$file"; then
      missing+=("$section")
    fi
  done
  if [[ ${#missing[@]} -gt 0 ]]; then
    printf '%s\n' "${missing[@]}"
    return 1
  fi
  return 0
}

check_red_flags() {
  local file="$1"
  local found=()
  for phrase in "${RED_FLAGS[@]}"; do
    local matches
    matches=$(grep -niE "(^|[^a-zA-Z])${phrase}([^a-zA-Z]|$)" "$file" 2>/dev/null || true)
    if [[ -n "$matches" ]]; then
      while IFS= read -r line; do
        found+=("$line")
      done <<< "$matches"
    fi
  done
  if [[ ${#found[@]} -gt 0 ]]; then
    printf '%s\n' "${found[@]}"
    return 1
  fi
  return 0
}

validate_file() {
  local file="$1"
  local type="$2"        # service | screen
  local min_words="$3"
  shift 3
  local sections=("$@")

  local basename
  basename=$(basename "$file")
  local passed=true

  # Word count
  local wc
  wc=$(count_words "$file")
  if [[ "$wc" -lt "$min_words" ]]; then
    echo "  ${RED}FAIL${RESET} Word count: ${wc} (minimum: ${min_words})"
    passed=false
  else
    echo "  ${GREEN}PASS${RESET} Word count: ${wc} (minimum: ${min_words})"
  fi

  # Required sections
  local missing
  if missing=$(check_sections "$file" "${sections[@]}"); then
    echo "  ${GREEN}PASS${RESET} All required sections present"
  else
    echo "  ${RED}FAIL${RESET} Missing sections:"
    while IFS= read -r s; do
      echo "        - $s"
    done <<< "$missing"
    passed=false
  fi

  # Red-flag phrases
  local flags
  if flags=$(check_red_flags "$file"); then
    echo "  ${GREEN}PASS${RESET} No red-flag phrases found"
  else
    echo "  ${YELLOW}WARN${RESET} Red-flag phrases detected:"
    while IFS= read -r f; do
      echo "        ${f}"
    done <<< "$flags"
    passed=false
  fi

  if [[ "$passed" == false ]]; then
    return 1
  fi
  return 0
}

echo "${BOLD}${CYAN}=== Depth Validator ===${RESET}"
echo "Scanning: ${DEV_DOCS}"
echo ""

# --- Validate service specs ---
SERVICE_DIR="${DEV_DOCS}/specs/services"
if [[ -d "$SERVICE_DIR" ]]; then
  echo "${BOLD}Service Specs${RESET} (${SERVICE_DIR})"
  echo "  Min words: 1500 | Required sections: ${SERVICE_SECTIONS[*]}"
  echo ""
  for file in "$SERVICE_DIR"/*.md; do
    [[ -f "$file" ]] || continue
    FILES_CHECKED=$((FILES_CHECKED + 1))
    echo "${CYAN}$(basename "$file")${RESET}"
    if ! validate_file "$file" "service" 1500 "${SERVICE_SECTIONS[@]}"; then
      FAILURES=$((FAILURES + 1))
    fi
    echo ""
  done
else
  echo "${YELLOW}No service specs directory found at ${SERVICE_DIR}${RESET}"
fi

# --- Validate screen specs ---
SCREEN_DIR="${DEV_DOCS}/specs/screens"
if [[ -d "$SCREEN_DIR" ]]; then
  echo "${BOLD}Screen Specs${RESET} (${SCREEN_DIR})"
  echo "  Min words: 800 | Required sections: ${SCREEN_SECTIONS[*]}"
  echo ""
  for file in "$SCREEN_DIR"/*.md; do
    [[ -f "$file" ]] || continue
    FILES_CHECKED=$((FILES_CHECKED + 1))
    echo "${CYAN}$(basename "$file")${RESET}"
    if ! validate_file "$file" "screen" 800 "${SCREEN_SECTIONS[@]}"; then
      FAILURES=$((FAILURES + 1))
    fi
    echo ""
  done
else
  echo "${YELLOW}No screen specs directory found at ${SCREEN_DIR}${RESET}"
fi

# --- Summary ---
echo "${BOLD}=== Summary ===${RESET}"
echo "Files checked: ${FILES_CHECKED}"
if [[ "$FAILURES" -gt 0 ]]; then
  echo "${RED}${BOLD}FAILED: ${FAILURES} file(s) did not meet depth requirements${RESET}"
  exit 1
else
  echo "${GREEN}${BOLD}PASSED: All files meet depth requirements${RESET}"
  exit 0
fi
