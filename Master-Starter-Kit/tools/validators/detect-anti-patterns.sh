#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# detect-anti-patterns.sh — Code Anti-Pattern Detector
#
# Scans staged or committed code files for common anti-patterns:
#   - Empty catch blocks
#   - Hardcoded secrets (API keys, passwords, tokens)
#   - Console.log in production code
#   - Empty event handlers
#   - TODO/FIXME without ticket reference
#   - Disabled tests (test.skip, xit, xdescribe)
#   - Magic numbers without constants
#
# Usage: detect-anti-patterns.sh [directory]
#   directory  Path to scan (default: current directory)
#
# Exit codes:
#   0 — No FAIL-level findings
#   1 — FAIL-level findings detected
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

SCAN_DIR="${1:-.}"
FAIL_COUNT=0
WARN_COUNT=0

# File extensions to scan
CODE_EXTENSIONS="ts,tsx,js,jsx,py,rb,go,java,cs,php,rs,swift,kt"

echo "${BOLD}${CYAN}=== Anti-Pattern Detector ===${RESET}"
echo "Scanning: ${SCAN_DIR}"
echo ""

# Build find expression for code files
build_find_args() {
  local dir="$1"
  local first=true
  local args=()
  args+=("$dir" "-type" "f" "(")
  IFS=',' read -ra exts <<< "$CODE_EXTENSIONS"
  for ext in "${exts[@]}"; do
    if [[ "$first" == true ]]; then
      first=false
    else
      args+=("-o")
    fi
    args+=("-name" "*.${ext}")
  done
  args+=(")")
  # Exclude common non-production directories
  args+=("-not" "-path" "*/node_modules/*")
  args+=("-not" "-path" "*/.git/*")
  args+=("-not" "-path" "*/vendor/*")
  args+=("-not" "-path" "*/dist/*")
  args+=("-not" "-path" "*/build/*")
  args+=("-not" "-path" "*/__pycache__/*")
  printf '%s\0' "${args[@]}"
}

scan_pattern() {
  local label="$1"
  local severity="$2"  # FAIL | WARN
  local pattern="$3"
  local description="$4"
  local found=false

  local sev_color
  if [[ "$severity" == "FAIL" ]]; then
    sev_color="${RED}"
  else
    sev_color="${YELLOW}"
  fi

  local results
  results=$(find "$SCAN_DIR" -type f \( \
    -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \
    -o -name '*.py' -o -name '*.rb' -o -name '*.go' -o -name '*.java' \
    -o -name '*.cs' -o -name '*.php' -o -name '*.rs' -o -name '*.swift' \
    -o -name '*.kt' \
    \) \
    -not -path '*/node_modules/*' \
    -not -path '*/.git/*' \
    -not -path '*/vendor/*' \
    -not -path '*/dist/*' \
    -not -path '*/build/*' \
    -not -path '*/__pycache__/*' \
    -exec grep -nHE "$pattern" {} \; 2>/dev/null || true)

  if [[ -n "$results" ]]; then
    found=true
    local count
    count=$(echo "$results" | wc -l | tr -d '[:space:]')
    echo "${sev_color}${BOLD}[${severity}]${RESET} ${BOLD}${label}${RESET} — ${description} (${count} finding(s))"
    echo "$results" | while IFS= read -r line; do
      echo "  ${line}"
    done
    echo ""

    if [[ "$severity" == "FAIL" ]]; then
      FAIL_COUNT=$((FAIL_COUNT + count))
    else
      WARN_COUNT=$((WARN_COUNT + count))
    fi
  fi
}

# --- FAIL-level patterns ---
echo "${BOLD}Checking for FAIL-level anti-patterns...${RESET}"
echo ""

scan_pattern \
  "Empty Catch Blocks" \
  "FAIL" \
  'catch\s*\([^)]*\)\s*\{\s*\}' \
  "Exceptions silently swallowed"

scan_pattern \
  "Hardcoded Secrets" \
  "FAIL" \
  '(api[_-]?key|api[_-]?secret|password|passwd|secret[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["\x27][^"\x27]{8,}' \
  "Potential hardcoded credentials in source"

scan_pattern \
  "Private Keys" \
  "FAIL" \
  'BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY' \
  "Private key material in source"

scan_pattern \
  "Disabled Tests" \
  "FAIL" \
  '(test\.skip|it\.skip|describe\.skip|xit\(|xdescribe\(|xtest\(|@pytest\.mark\.skip|@unittest\.skip)' \
  "Tests disabled — may mask regressions"

# --- WARN-level patterns ---
echo "${BOLD}Checking for WARN-level anti-patterns...${RESET}"
echo ""

scan_pattern \
  "Console.log Statements" \
  "WARN" \
  'console\.(log|debug|info)\(' \
  "Debug logging left in production code"

scan_pattern \
  "TODO/FIXME Without Ticket" \
  "WARN" \
  '(TODO|FIXME|HACK|XXX)(?!\s*\([A-Z]+-[0-9]+\))(?!\s*[A-Z]+-[0-9]+)' \
  "Untracked technical debt — add ticket reference"

scan_pattern \
  "Empty Event Handlers" \
  "WARN" \
  'on[A-Z][a-zA-Z]*\s*=\s*\{?\s*\(\)\s*=>\s*\{\s*\}\s*\}?' \
  "No-op event handlers — likely placeholder"

scan_pattern \
  "Magic Numbers" \
  "WARN" \
  '(===?\s+[0-9]{2,}|[0-9]{4,}\s*[;,)]|setTimeout\([^,]+,\s*[0-9]{4,}\))' \
  "Magic numbers should be named constants"

# --- Summary ---
echo "${BOLD}=== Summary ===${RESET}"
echo "FAIL-level findings: ${FAIL_COUNT}"
echo "WARN-level findings: ${WARN_COUNT}"

if [[ "$FAIL_COUNT" -gt 0 ]]; then
  echo ""
  echo "${RED}${BOLD}FAILED: ${FAIL_COUNT} FAIL-level anti-pattern(s) detected${RESET}"
  echo "Fix FAIL-level issues before proceeding."
  exit 1
else
  if [[ "$WARN_COUNT" -gt 0 ]]; then
    echo ""
    echo "${YELLOW}${BOLD}PASSED with warnings: ${WARN_COUNT} WARN-level finding(s)${RESET}"
    echo "Consider addressing warnings before merge."
  else
    echo ""
    echo "${GREEN}${BOLD}PASSED: No anti-patterns detected${RESET}"
  fi
  exit 0
fi
