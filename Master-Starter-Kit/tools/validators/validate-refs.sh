#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# validate-refs.sh — Internal Reference Validator
#
# Scans all markdown files in dev_docs/ for internal links to other dev_docs/
# files, then verifies each referenced file actually exists.
#
# Usage: validate-refs.sh [dev_docs_dir]
#   dev_docs_dir  Path to dev_docs directory (default: ./dev_docs)
#
# Exit codes:
#   0 — All references resolve
#   1 — Broken references found
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

DEV_DOCS="${1:-./dev_docs}"
BROKEN_COUNT=0
TOTAL_REFS=0
FILES_SCANNED=0

echo "${BOLD}${CYAN}=== Reference Validator ===${RESET}"
echo "Scanning: ${DEV_DOCS}"
echo ""

if [[ ! -d "$DEV_DOCS" ]]; then
  echo "${RED}Error: dev_docs directory not found at ${DEV_DOCS}${RESET}"
  exit 1
fi

# Find all markdown files
while IFS= read -r -d '' file; do
  FILES_SCANNED=$((FILES_SCANNED + 1))
  file_dir=$(dirname "$file")
  file_has_broken=false

  # Extract markdown links: [text](path) — filter to relative .md links
  while IFS= read -r match; do
    [[ -z "$match" ]] && continue

    # Extract the path from the markdown link
    link_path=$(echo "$match" | sed -E 's/.*\]\(([^)#]+).*/\1/')

    # Skip external URLs, anchors-only, images, and non-relative paths
    [[ "$link_path" =~ ^https?:// ]] && continue
    [[ "$link_path" =~ ^mailto: ]] && continue
    [[ "$link_path" =~ ^# ]] && continue
    [[ -z "$link_path" ]] && continue

    TOTAL_REFS=$((TOTAL_REFS + 1))

    # Resolve relative path from the file's directory
    resolved="${file_dir}/${link_path}"

    if [[ ! -e "$resolved" ]]; then
      if [[ "$file_has_broken" == false ]]; then
        echo "${CYAN}$(basename "$file")${RESET} (${file})"
        file_has_broken=true
      fi
      echo "  ${RED}BROKEN${RESET} → ${link_path}"
      BROKEN_COUNT=$((BROKEN_COUNT + 1))
    fi
  done < <(grep -oE '\[[^]]*\]\([^)]+\)' "$file" 2>/dev/null || true)

done < <(find "$DEV_DOCS" -name '*.md' -type f -print0 2>/dev/null)

# --- Summary ---
echo ""
echo "${BOLD}=== Summary ===${RESET}"
echo "Files scanned: ${FILES_SCANNED}"
echo "References checked: ${TOTAL_REFS}"

if [[ "$BROKEN_COUNT" -gt 0 ]]; then
  echo "${RED}${BOLD}FAILED: ${BROKEN_COUNT} broken reference(s) found${RESET}"
  exit 1
else
  echo "${GREEN}${BOLD}PASSED: All references resolve correctly${RESET}"
  exit 0
fi
