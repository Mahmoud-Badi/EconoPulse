#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# gate-checker.sh — Master Gate Checker
#
# Orchestrates gate validation for a given orchestrator step. Reads gate
# requirements from gate-definitions.json and runs the appropriate validators.
#
# Usage: gate-checker.sh <step_number> [dev_docs_dir]
#   step_number   Orchestrator step number (e.g., 2, 5, 8.5, 16.5)
#   dev_docs_dir  Path to dev_docs directory (default: ./dev_docs)
#
# Exit codes:
#   0 — Gate passes, step can advance
#   1 — Gate fails, step advancement blocked
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

if [[ $# -lt 1 ]]; then
  echo "${BOLD}Usage:${RESET} gate-checker.sh <step_number> [dev_docs_dir]"
  echo ""
  echo "Runs gate validation for the specified orchestrator step."
  echo ""
  echo "Available gates (from gate-definitions.json):"
  echo "  2     — Discovery Complete"
  echo "  5     — Architecture Complete"
  echo "  8.5   — Planning Complete"
  echo "  16.5  — Quality Phase Complete"
  echo "  28.5  — Extension Complete"
  echo "  33    — Hardening Complete"
  exit 1
fi

STEP="$1"
DEV_DOCS="${2:-./dev_docs}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_DEFS="${SCRIPT_DIR}/gate-definitions.json"

echo "${BOLD}${CYAN}╔══════════════════════════════════════════╗${RESET}"
echo "${BOLD}${CYAN}║       MASTER GATE CHECKER — Step ${STEP}      ║${RESET}"
echo "${BOLD}${CYAN}╚══════════════════════════════════════════╝${RESET}"
echo ""

# --- Check dependencies ---
if ! command -v python3 &>/dev/null && ! command -v python &>/dev/null; then
  # Fallback: try to parse JSON with grep/sed (basic)
  PYTHON=""
else
  PYTHON=$(command -v python3 || command -v python)
fi

if [[ ! -f "$GATE_DEFS" ]]; then
  echo "${RED}Error: Gate definitions not found at ${GATE_DEFS}${RESET}"
  exit 1
fi

# --- Parse gate definition ---
# Use python for reliable JSON parsing, fall back to grep
parse_gate() {
  local step="$1"
  local field="$2"

  if [[ -n "${PYTHON:-}" ]]; then
    "$PYTHON" -c "
import json, sys
with open('${GATE_DEFS}') as f:
    data = json.load(f)
gate = data.get('gates', {}).get('${step}')
if gate is None:
    sys.exit(1)
val = gate.get('${field}', '')
if isinstance(val, list):
    print('\n'.join(val))
elif isinstance(val, (int, float)):
    print(val)
else:
    print(val)
" 2>/dev/null
  else
    echo ""
  fi
}

# Check if gate exists for this step
GATE_NAME=$(parse_gate "$STEP" "name" || true)

if [[ -z "$GATE_NAME" ]]; then
  echo "${YELLOW}No gate defined for step ${STEP}${RESET}"
  echo "No validation required — step may advance."
  exit 0
fi

echo "${BOLD}Gate: ${GATE_NAME}${RESET}"
echo ""

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# --- Check required artifacts ---
echo "${BOLD}Required Artifacts${RESET}"
echo "─────────────────────────────────"

ARTIFACTS=$(parse_gate "$STEP" "required_artifacts" || true)
if [[ -n "$ARTIFACTS" ]]; then
  while IFS= read -r artifact; do
    [[ -z "$artifact" ]] && continue
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    # Handle glob patterns
    if [[ "$artifact" == *"*"* ]]; then
      matches=$(find . -path "./$artifact" -type f 2>/dev/null | head -20 || true)
      if [[ -n "$matches" ]]; then
        count=$(echo "$matches" | wc -l | tr -d '[:space:]')
        echo "  ${GREEN}FOUND${RESET} ${artifact} (${count} file(s))"

        # Check min count if specified
        min_specs=$(parse_gate "$STEP" "min_service_specs" || true)
        if [[ -n "$min_specs" ]] && [[ "$count" -lt "$min_specs" ]]; then
          echo "        ${RED}Only ${count} found, minimum ${min_specs} required${RESET}"
          FAILED_CHECKS=$((FAILED_CHECKS + 1))
        else
          PASSED_CHECKS=$((PASSED_CHECKS + 1))
        fi
      else
        echo "  ${RED}MISSING${RESET} ${artifact} — no matching files"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
      fi
    else
      if [[ -f "$artifact" ]]; then
        echo "  ${GREEN}FOUND${RESET} ${artifact}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
      else
        echo "  ${RED}MISSING${RESET} ${artifact}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
      fi
    fi
  done <<< "$ARTIFACTS"
else
  echo "  (none specified)"
fi

echo ""

# --- Run validators ---
echo "${BOLD}Validators${RESET}"
echo "─────────────────────────────────"

VALIDATORS=$(parse_gate "$STEP" "validators" || true)
if [[ -n "$VALIDATORS" ]]; then
  while IFS= read -r validator; do
    [[ -z "$validator" ]] && continue
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    validator_path="${SCRIPT_DIR}/${validator}"
    if [[ ! -f "$validator_path" ]]; then
      echo "  ${RED}ERROR${RESET} Validator not found: ${validator}"
      FAILED_CHECKS=$((FAILED_CHECKS + 1))
      continue
    fi

    echo ""
    echo "  ${CYAN}Running: ${validator}${RESET}"
    echo "  ─────────────────────────────────"

    # Run validator and capture exit code
    set +e
    bash "$validator_path" "$DEV_DOCS" 2>&1 | sed 's/^/    /'
    validator_exit=${PIPESTATUS[0]}
    set -e

    if [[ "$validator_exit" -eq 0 ]]; then
      echo "  ${GREEN}✓ ${validator} PASSED${RESET}"
      PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
      echo "  ${RED}✗ ${validator} FAILED${RESET}"
      FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
  done <<< "$VALIDATORS"
else
  echo "  (none specified)"
fi

echo ""

# --- Overall result ---
echo "${BOLD}╔══════════════════════════════════════════╗${RESET}"
if [[ "$FAILED_CHECKS" -gt 0 ]]; then
  echo "${RED}${BOLD}║  GATE BLOCKED — ${FAILED_CHECKS}/${TOTAL_CHECKS} check(s) failed       ║${RESET}"
  echo "${BOLD}╚══════════════════════════════════════════╝${RESET}"
  echo ""
  echo "${RED}${BOLD}Step ${STEP} cannot advance until all gate checks pass.${RESET}"
  echo "Fix the issues above and re-run: gate-checker.sh ${STEP}"
  exit 1
else
  echo "${GREEN}${BOLD}║  GATE PASSED — ${PASSED_CHECKS}/${TOTAL_CHECKS} check(s) passed       ║${RESET}"
  echo "${BOLD}╚══════════════════════════════════════════╝${RESET}"
  echo ""
  echo "${GREEN}${BOLD}Step ${STEP} may advance.${RESET}"
  exit 0
fi
