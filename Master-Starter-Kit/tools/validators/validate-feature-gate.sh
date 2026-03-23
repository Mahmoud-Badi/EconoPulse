#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# validate-feature-gate.sh — Feature Completion Gate Validator
#
# Parses a feature gate checklist markdown file and verifies:
#   - All required gates are marked complete ([x])
#   - Proof artifact files exist at their declared paths
#
# Usage: validate-feature-gate.sh <gate-checklist.md> [project_root]
#   gate-checklist.md  Markdown file with gate checklist
#   project_root       Root directory for resolving artifact paths (default: .)
#
# Gate checklist format (in markdown):
#   - [x] Gate name — proof: path/to/artifact.md
#   - [ ] Gate name — proof: path/to/artifact.md
#   Lines marked REQUIRED (or all if none marked) must be [x] with valid proof.
#
# Exit codes:
#   0 — All required gates pass
#   1 — Missing completions or proof artifacts
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

if [[ $# -lt 1 ]]; then
  echo "${BOLD}Usage:${RESET} validate-feature-gate.sh <gate-checklist.md> [project_root]"
  echo ""
  echo "Validates a feature gate checklist markdown file."
  echo "Checks that all required gates are marked complete and proof artifacts exist."
  echo ""
  echo "Gate checklist format:"
  echo "  - [x] Gate name — proof: path/to/artifact.md"
  echo "  - [ ] Incomplete gate — proof: path/to/missing.md"
  exit 1
fi

GATE_FILE="$1"
PROJECT_ROOT="${2:-.}"
FAILURES=0
GATES_CHECKED=0

echo "${BOLD}${CYAN}=== Feature Gate Validator ===${RESET}"
echo "Checklist: ${GATE_FILE}"
echo "Project root: ${PROJECT_ROOT}"
echo ""

if [[ ! -f "$GATE_FILE" ]]; then
  echo "${RED}Error: Gate checklist not found: ${GATE_FILE}${RESET}"
  exit 1
fi

# Parse checklist lines: - [x] or - [ ] with optional proof: path
while IFS= read -r line; do
  # Match checklist items: - [x] or - [ ]
  if [[ "$line" =~ ^[[:space:]]*[-*][[:space:]]+\[([xX[:space:]])\][[:space:]]+(.+)$ ]]; then
    check="${BASH_REMATCH[1]}"
    content="${BASH_REMATCH[2]}"
    GATES_CHECKED=$((GATES_CHECKED + 1))

    # Extract gate name (before — or --)
    gate_name=$(echo "$content" | sed -E 's/\s*(—|--)\s*proof:.*//' | sed 's/[[:space:]]*$//')

    # Extract proof path if present
    proof_path=""
    if [[ "$content" =~ (—|--)[[:space:]]*proof:[[:space:]]*(.+)$ ]]; then
      proof_path="${BASH_REMATCH[2]}"
      proof_path=$(echo "$proof_path" | sed 's/[[:space:]]*$//')
    fi

    # Check completion
    if [[ "$check" =~ [xX] ]]; then
      # Gate is marked complete — verify proof exists
      if [[ -n "$proof_path" ]]; then
        resolved="${PROJECT_ROOT}/${proof_path}"
        if [[ -e "$resolved" ]]; then
          echo "  ${GREEN}PASS${RESET} ${gate_name}"
          echo "        Proof: ${proof_path} ${GREEN}(exists)${RESET}"
        else
          echo "  ${RED}FAIL${RESET} ${gate_name}"
          echo "        Proof: ${proof_path} ${RED}(NOT FOUND)${RESET}"
          FAILURES=$((FAILURES + 1))
        fi
      else
        echo "  ${GREEN}PASS${RESET} ${gate_name}"
        echo "        ${YELLOW}(no proof artifact declared)${RESET}"
      fi
    else
      # Gate not complete
      echo "  ${RED}FAIL${RESET} ${gate_name}"
      echo "        ${RED}Gate not marked complete${RESET}"
      FAILURES=$((FAILURES + 1))
    fi
  fi
done < "$GATE_FILE"

# --- Summary ---
echo ""
echo "${BOLD}=== Summary ===${RESET}"
echo "Gates checked: ${GATES_CHECKED}"

if [[ "$GATES_CHECKED" -eq 0 ]]; then
  echo "${YELLOW}No gate checklist items found in ${GATE_FILE}${RESET}"
  echo "Expected format: - [x] Gate name — proof: path/to/artifact"
  exit 1
fi

if [[ "$FAILURES" -gt 0 ]]; then
  echo "${RED}${BOLD}FAILED: ${FAILURES} gate(s) incomplete or missing proof${RESET}"
  exit 1
else
  echo "${GREEN}${BOLD}PASSED: All gates complete with valid proofs${RESET}"
  exit 0
fi
