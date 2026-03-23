#!/usr/bin/env bash
# ===========================================================================
# dashboard.sh — Terminal dashboard for ORCHESTRATOR progress
# Run from the project root:
#   bash path/to/Master-Starter-Kit/scripts/dashboard.sh
# ===========================================================================

set -euo pipefail

DOCS_ROOT="${1:-dev_docs}"

# Colors
BOLD='\033[1m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
CYAN='\033[36m'
RESET='\033[0m'

printf "${BOLD}╔══════════════════════════════════════════╗${RESET}\n"
printf "${BOLD}║       ORCHESTRATOR DASHBOARD             ║${RESET}\n"
printf "${BOLD}╚══════════════════════════════════════════╝${RESET}\n\n"

# -------------------------------------------------------------------
# Project info from STATE BLOCK
# -------------------------------------------------------------------

if [ -f "ORCHESTRATOR.md" ]; then
  # Try to extract state from ORCHESTRATOR
  current_step=$(grep -oP 'CURRENT_STEP:\s*\K\d+' ORCHESTRATOR.md 2>/dev/null | head -1 || echo "?")
  project_name=$(grep -oP 'PROJECT_NAME:\s*"\K[^"]*' ORCHESTRATOR.md 2>/dev/null | head -1 || echo "Unknown")
  gate_mode=$(grep -oP 'GATE_MODE:\s*"\K[^"]*' ORCHESTRATOR.md 2>/dev/null | head -1 || echo "manual")
elif [ -f "Master-Starter-Kit/ORCHESTRATOR.md" ]; then
  current_step=$(grep -oP 'CURRENT_STEP:\s*\K\d+' Master-Starter-Kit/ORCHESTRATOR.md 2>/dev/null | head -1 || echo "?")
  project_name=$(grep -oP 'PROJECT_NAME:\s*"\K[^"]*' Master-Starter-Kit/ORCHESTRATOR.md 2>/dev/null | head -1 || echo "Unknown")
  gate_mode=$(grep -oP 'GATE_MODE:\s*"\K[^"]*' Master-Starter-Kit/ORCHESTRATOR.md 2>/dev/null | head -1 || echo "manual")
else
  current_step="?"
  project_name="Unknown"
  gate_mode="manual"
fi

printf "${CYAN}Project:${RESET}    %s\n" "$project_name"
printf "${CYAN}Step:${RESET}       %s / 28\n" "$current_step"
printf "${CYAN}Gate Mode:${RESET}  %s\n" "$gate_mode"
printf "\n"

# -------------------------------------------------------------------
# File counts
# -------------------------------------------------------------------

printf "${BOLD}── File Counts ──${RESET}\n"

count_files() {
  local pattern="$1"
  local label="$2"
  local count
  count=$(find "$DOCS_ROOT" -name "$pattern" 2>/dev/null | wc -l | tr -d ' ')
  printf "  %-25s %s\n" "$label:" "$count"
}

if [ -d "$DOCS_ROOT" ]; then
  total_docs=$(find "$DOCS_ROOT" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  printf "  %-25s ${BOLD}%s${RESET}\n" "Total docs:" "$total_docs"
  count_files "*.hub.md" "Service hubs"
  count_files "*-spec.md" "Specs"

  task_count=$(find "$DOCS_ROOT/tasks" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  printf "  %-25s %s\n" "Task files:" "$task_count"

  screen_count=$(find "$DOCS_ROOT/specs/screens" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  printf "  %-25s %s\n" "Screen specs:" "$screen_count"
else
  printf "  ${YELLOW}dev_docs/ not found — ORCHESTRATOR may not have run yet${RESET}\n"
fi

printf "\n"

# -------------------------------------------------------------------
# Completeness check
# -------------------------------------------------------------------

printf "${BOLD}── Completeness ──${RESET}\n"

check_exists() {
  local path="$1"
  local label="$2"
  if [ -f "$path" ] || [ -d "$path" ]; then
    printf "  ${GREEN}✓${RESET} %s\n" "$label"
  else
    printf "  ${RED}✗${RESET} %s\n" "$label"
  fi
}

check_exists "$DOCS_ROOT/STATUS.md" "STATUS.md"
check_exists "$DOCS_ROOT/completeness/service-matrix.md" "Service matrix"
check_exists "$DOCS_ROOT/completeness/screen-matrix.md" "Screen matrix"
check_exists "$DOCS_ROOT/foundations" "Foundations (design system, quality)"
check_exists "$DOCS_ROOT/services" "Service hubs"
check_exists "$DOCS_ROOT/tasks" "Task files"
check_exists "$DOCS_ROOT/sprints" "Sprint plans"
check_exists "$DOCS_ROOT/decisions" "Decision log"

printf "\n"

# -------------------------------------------------------------------
# Placeholder check
# -------------------------------------------------------------------

printf "${BOLD}── Placeholder Status ──${RESET}\n"

if [ -d "$DOCS_ROOT" ]; then
  placeholder_count=$(grep -r '{{[A-Z_]*}}' "$DOCS_ROOT" 2>/dev/null | grep -v '.example' | wc -l | tr -d ' ')
  if [ "$placeholder_count" -eq 0 ]; then
    printf "  ${GREEN}✓${RESET} No unresolved placeholders\n"
  else
    printf "  ${YELLOW}⚠${RESET} %d unresolved placeholder(s)\n" "$placeholder_count"
  fi
fi

printf "\n"

# -------------------------------------------------------------------
# Quick actions
# -------------------------------------------------------------------

printf "${BOLD}── Quick Actions ──${RESET}\n"
printf "  /resume          Resume ORCHESTRATOR from last step\n"
printf "  /health-check    Verify tools and MCP servers\n"
printf "  /add-service     Add a new service mid-project\n"
printf "  /export-tasks    Export tasks to GitHub/CSV/JSON\n"
printf "  validate-output  bash scripts/validate-output.sh\n"
printf "  depth-scorer     bash scripts/depth-scorer.sh\n"
printf "  lint-docs        bash scripts/lint-docs.sh\n"
printf "\n"
