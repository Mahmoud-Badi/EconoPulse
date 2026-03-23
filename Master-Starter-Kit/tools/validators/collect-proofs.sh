#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# collect-proofs.sh — Proof Artifact Collector
#
# Collects proof artifacts for a completed gate step:
#   - Creates dev_docs/proofs/{step}-{date}/ directory
#   - Copies test reports, screenshots, build output to proofs dir
#   - Generates proof-manifest.json linking each gate to its artifacts
#
# Usage: collect-proofs.sh <step_number> <proof_type> [source_path...]
#   step_number  Orchestrator step number (e.g., 5, 8.5)
#   proof_type   Type: test-report | screenshot | build-output | coverage | manual
#   source_path  One or more files/dirs to collect as proof
#
# Exit codes:
#   0 — Proofs collected successfully
#   1 — Error during collection
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

if [[ $# -lt 2 ]]; then
  echo "${BOLD}Usage:${RESET} collect-proofs.sh <step_number> <proof_type> [source_path...]"
  echo ""
  echo "Collects proof artifacts for a completed gate step."
  echo ""
  echo "Arguments:"
  echo "  step_number  Orchestrator step number (e.g., 5, 8.5, 16.5)"
  echo "  proof_type   One of: test-report, screenshot, build-output, coverage, manual"
  echo "  source_path  Files or directories to collect (at least one required)"
  echo ""
  echo "Examples:"
  echo "  collect-proofs.sh 5 test-report ./test-results/report.html"
  echo "  collect-proofs.sh 8.5 screenshot ./screenshots/*.png"
  echo "  collect-proofs.sh 16.5 coverage ./coverage/lcov-report/"
  exit 1
fi

STEP="$1"
PROOF_TYPE="$2"
shift 2
SOURCES=("$@")

# Validate proof type
VALID_TYPES=("test-report" "screenshot" "build-output" "coverage" "manual")
type_valid=false
for t in "${VALID_TYPES[@]}"; do
  if [[ "$PROOF_TYPE" == "$t" ]]; then
    type_valid=true
    break
  fi
done

if [[ "$type_valid" == false ]]; then
  echo "${RED}Error: Invalid proof type '${PROOF_TYPE}'${RESET}"
  echo "Valid types: ${VALID_TYPES[*]}"
  exit 1
fi

# --- Setup proof directory ---
DATE_STAMP=$(date +%Y-%m-%d)
PROOFS_DIR="dev_docs/proofs/step-${STEP}-${DATE_STAMP}"
MANIFEST_FILE="${PROOFS_DIR}/proof-manifest.json"

echo "${BOLD}${CYAN}=== Proof Collector ===${RESET}"
echo "Step: ${STEP}"
echo "Type: ${PROOF_TYPE}"
echo "Date: ${DATE_STAMP}"
echo "Output: ${PROOFS_DIR}/"
echo ""

mkdir -p "$PROOFS_DIR"

COLLECTED=0
ARTIFACTS=()

if [[ ${#SOURCES[@]} -eq 0 ]]; then
  echo "${YELLOW}No source paths provided — creating empty proof directory${RESET}"
  echo "Add proof files manually to: ${PROOFS_DIR}/"
else
  for source in "${SOURCES[@]}"; do
    if [[ -e "$source" ]]; then
      if [[ -d "$source" ]]; then
        # Copy directory contents
        cp -r "$source" "${PROOFS_DIR}/"
        dir_name=$(basename "$source")
        echo "  ${GREEN}COPIED${RESET} ${source}/ → ${PROOFS_DIR}/${dir_name}/"
        ARTIFACTS+=("${dir_name}/")
        COLLECTED=$((COLLECTED + 1))
      else
        # Copy single file
        cp "$source" "${PROOFS_DIR}/"
        file_name=$(basename "$source")
        echo "  ${GREEN}COPIED${RESET} ${source} → ${PROOFS_DIR}/${file_name}"
        ARTIFACTS+=("${file_name}")
        COLLECTED=$((COLLECTED + 1))
      fi
    else
      echo "  ${RED}NOT FOUND${RESET} ${source} — skipped"
    fi
  done
fi

# --- Generate manifest ---
echo ""
echo "${BOLD}Generating proof manifest...${RESET}"

# Build artifacts JSON array
ARTIFACTS_JSON="["
first=true
for art in "${ARTIFACTS[@]:-}"; do
  if [[ "$first" == true ]]; then
    first=false
  else
    ARTIFACTS_JSON+=","
  fi
  ARTIFACTS_JSON+="\"${art}\""
done
ARTIFACTS_JSON+="]"

# Read existing manifest or create new
if [[ -f "$MANIFEST_FILE" ]] && command -v python3 &>/dev/null; then
  # Append to existing manifest
  python3 -c "
import json
with open('${MANIFEST_FILE}') as f:
    manifest = json.load(f)
entry = {
    'type': '${PROOF_TYPE}',
    'collected_at': '$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date +%Y-%m-%dT%H:%M:%S)',
    'artifacts': ${ARTIFACTS_JSON}
}
manifest.setdefault('entries', []).append(entry)
with open('${MANIFEST_FILE}', 'w') as f:
    json.dump(manifest, f, indent=2)
"
else
  # Create new manifest
  cat > "$MANIFEST_FILE" <<MANIFEST
{
  "step": "${STEP}",
  "gate": "Step ${STEP}",
  "date": "${DATE_STAMP}",
  "entries": [
    {
      "type": "${PROOF_TYPE}",
      "collected_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date +%Y-%m-%dT%H:%M:%S)",
      "artifacts": ${ARTIFACTS_JSON}
    }
  ]
}
MANIFEST
fi

echo "  ${GREEN}CREATED${RESET} ${MANIFEST_FILE}"

# --- Summary ---
echo ""
echo "${BOLD}=== Summary ===${RESET}"
echo "Artifacts collected: ${COLLECTED}"
echo "Proof directory: ${PROOFS_DIR}/"
echo "Manifest: ${MANIFEST_FILE}"
echo ""
echo "${GREEN}${BOLD}Proof collection complete.${RESET}"
echo "Run ${CYAN}gate-checker.sh ${STEP}${RESET} to validate this gate."
