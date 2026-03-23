#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# validate-cross-refs.sh — Cross-Reference Validator
#
# Validates consistency across dev_docs artifacts:
#   - Every API endpoint in service specs has a corresponding task file
#   - Every screen in screen specs has a corresponding task file
#   - Service hub files reference valid service specs
#   - Reports orphan endpoints, missing catalog entries, phantom tables
#
# Usage: validate-cross-refs.sh [dev_docs_dir]
#   dev_docs_dir  Path to dev_docs directory (default: ./dev_docs)
#
# Exit codes:
#   0 — No critical mismatches
#   1 — Critical cross-reference mismatches found
# =============================================================================

# --- Color support ---
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1); GREEN=$(tput setaf 2); YELLOW=$(tput setaf 3)
  CYAN=$(tput setaf 6); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" CYAN="" BOLD="" RESET=""
fi

DEV_DOCS="${1:-./dev_docs}"
CRITICAL_FAILURES=0
WARNINGS=0

echo "${BOLD}${CYAN}=== Cross-Reference Validator ===${RESET}"
echo "Scanning: ${DEV_DOCS}"
echo ""

if [[ ! -d "$DEV_DOCS" ]]; then
  echo "${RED}Error: dev_docs directory not found at ${DEV_DOCS}${RESET}"
  exit 1
fi

# -------------------------------------------------------------------------
# 1. Check API endpoints in service specs have corresponding task files
# -------------------------------------------------------------------------
echo "${BOLD}1. API Endpoints → Task Files${RESET}"

SERVICE_DIR="${DEV_DOCS}/specs/services"
TASKS_DIR="${DEV_DOCS}/tasks"

if [[ -d "$SERVICE_DIR" ]] && [[ -d "$TASKS_DIR" ]]; then
  endpoint_count=0
  orphan_count=0

  for spec in "$SERVICE_DIR"/*.md; do
    [[ -f "$spec" ]] || continue
    spec_name=$(basename "$spec" .md)

    # Extract endpoints: lines matching HTTP methods (GET, POST, PUT, DELETE, PATCH)
    while IFS= read -r endpoint_line; do
      [[ -z "$endpoint_line" ]] && continue
      endpoint_count=$((endpoint_count + 1))

      # Extract the endpoint path
      endpoint=$(echo "$endpoint_line" | grep -oE '(GET|POST|PUT|DELETE|PATCH)\s+/[^ ]*' | head -1 || true)
      [[ -z "$endpoint" ]] && continue

      # Check if any task file references this endpoint
      if ! grep -rlq "$endpoint" "$TASKS_DIR"/ 2>/dev/null; then
        if [[ "$orphan_count" -eq 0 ]]; then
          echo ""
        fi
        echo "  ${YELLOW}ORPHAN${RESET} ${spec_name}: ${endpoint}"
        echo "         No task file references this endpoint"
        orphan_count=$((orphan_count + 1))
        WARNINGS=$((WARNINGS + 1))
      fi
    done < <(grep -nE '(GET|POST|PUT|DELETE|PATCH)\s+/' "$spec" 2>/dev/null || true)
  done

  if [[ "$orphan_count" -eq 0 ]]; then
    echo "  ${GREEN}PASS${RESET} All endpoints have corresponding tasks (${endpoint_count} checked)"
  else
    echo "  ${YELLOW}${orphan_count} orphan endpoint(s) found${RESET}"
  fi
else
  echo "  ${YELLOW}SKIP${RESET} Service specs or tasks directory not found"
fi

echo ""

# -------------------------------------------------------------------------
# 2. Check screens in screen specs have corresponding task files
# -------------------------------------------------------------------------
echo "${BOLD}2. Screen Specs → Task Files${RESET}"

SCREEN_DIR="${DEV_DOCS}/specs/screens"

if [[ -d "$SCREEN_DIR" ]] && [[ -d "$TASKS_DIR" ]]; then
  screen_count=0
  missing_count=0

  for spec in "$SCREEN_DIR"/*.md; do
    [[ -f "$spec" ]] || continue
    screen_count=$((screen_count + 1))
    screen_name=$(basename "$spec" .md)

    # Check if any task file references this screen
    if ! grep -rlq "$screen_name" "$TASKS_DIR"/ 2>/dev/null; then
      echo "  ${RED}MISSING${RESET} Screen '${screen_name}' has no corresponding task"
      missing_count=$((missing_count + 1))
      CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
    fi
  done

  if [[ "$missing_count" -eq 0 ]]; then
    echo "  ${GREEN}PASS${RESET} All screens have corresponding tasks (${screen_count} checked)"
  fi
else
  echo "  ${YELLOW}SKIP${RESET} Screen specs or tasks directory not found"
fi

echo ""

# -------------------------------------------------------------------------
# 3. Service hub references valid service specs
# -------------------------------------------------------------------------
echo "${BOLD}3. Service Hub → Service Specs${RESET}"

HUB_DIR="${DEV_DOCS}/hub"
if [[ ! -d "$HUB_DIR" ]]; then
  HUB_DIR="${DEV_DOCS}/hubs"
fi

if [[ -d "$HUB_DIR" ]] && [[ -d "$SERVICE_DIR" ]]; then
  hub_ref_count=0
  phantom_count=0

  for hub in "$HUB_DIR"/*.md; do
    [[ -f "$hub" ]] || continue
    hub_name=$(basename "$hub")

    # Extract references to service spec files
    while IFS= read -r ref; do
      [[ -z "$ref" ]] && continue
      hub_ref_count=$((hub_ref_count + 1))

      # Extract referenced filename
      ref_file=$(echo "$ref" | grep -oE '[a-zA-Z0-9_-]+\.md' | head -1 || true)
      [[ -z "$ref_file" ]] && continue

      # Check if the referenced spec exists
      if [[ ! -f "${SERVICE_DIR}/${ref_file}" ]]; then
        echo "  ${RED}PHANTOM${RESET} ${hub_name} references '${ref_file}' — file not found"
        phantom_count=$((phantom_count + 1))
        CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
      fi
    done < <(grep -oE '\[[^]]*\]\([^)]*services/[^)]+\)' "$hub" 2>/dev/null || true)
  done

  if [[ "$phantom_count" -eq 0 ]]; then
    echo "  ${GREEN}PASS${RESET} All hub references valid (${hub_ref_count} checked)"
  fi
else
  echo "  ${YELLOW}SKIP${RESET} Hub or service specs directory not found"
fi

echo ""

# -------------------------------------------------------------------------
# 4. Check for phantom table references in data models
# -------------------------------------------------------------------------
echo "${BOLD}4. Phantom Table Detection${RESET}"

if [[ -d "$SERVICE_DIR" ]]; then
  # Collect all table names defined across specs
  declared_tables=()
  while IFS= read -r table; do
    [[ -n "$table" ]] && declared_tables+=("$table")
  done < <(grep -hE '^\|\s*`?[a-z_]+`?\s*\|' "$SERVICE_DIR"/*.md 2>/dev/null | \
    grep -oE '`[a-z_]+`' | tr -d '`' | sort -u || true)

  # Look for table references not in the declared list
  phantom_tables=0
  while IFS= read -r ref_table; do
    [[ -z "$ref_table" ]] && continue
    found=false
    for declared in "${declared_tables[@]:-}"; do
      if [[ "$ref_table" == "$declared" ]]; then
        found=true
        break
      fi
    done
    if [[ "$found" == false ]]; then
      # Check it's not a common word
      if [[ ${#ref_table} -gt 3 ]] && [[ "$ref_table" =~ _ ]]; then
        echo "  ${YELLOW}PHANTOM?${RESET} Table '${ref_table}' referenced but not clearly defined"
        phantom_tables=$((phantom_tables + 1))
      fi
    fi
  done < <(grep -hroE '(FROM|JOIN|INTO|UPDATE|TABLE)\s+`?[a-z_]+`?' "$SERVICE_DIR"/*.md 2>/dev/null | \
    grep -oE '[a-z_]+$' | sort -u || true)

  if [[ "$phantom_tables" -eq 0 ]]; then
    echo "  ${GREEN}PASS${RESET} No phantom table references detected"
  else
    WARNINGS=$((WARNINGS + phantom_tables))
  fi
else
  echo "  ${YELLOW}SKIP${RESET} Service specs directory not found"
fi

echo ""

# --- Summary ---
echo "${BOLD}=== Summary ===${RESET}"
echo "Critical failures: ${CRITICAL_FAILURES}"
echo "Warnings: ${WARNINGS}"

if [[ "$CRITICAL_FAILURES" -gt 0 ]]; then
  echo ""
  echo "${RED}${BOLD}FAILED: ${CRITICAL_FAILURES} critical cross-reference mismatch(es)${RESET}"
  exit 1
else
  if [[ "$WARNINGS" -gt 0 ]]; then
    echo ""
    echo "${YELLOW}${BOLD}PASSED with ${WARNINGS} warning(s)${RESET}"
  else
    echo ""
    echo "${GREEN}${BOLD}PASSED: All cross-references valid${RESET}"
  fi
  exit 0
fi
