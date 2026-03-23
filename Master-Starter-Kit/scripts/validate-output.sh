#!/usr/bin/env bash
# ===========================================================================
# validate-output.sh — Validate the output of an ORCHESTRATOR run
# Run from the project root (where dev_docs/ lives):
#   bash path/to/Master-Starter-Kit/scripts/validate-output.sh
# ===========================================================================

set -euo pipefail

PASS=0
FAIL=0
WARN=0
PROJECT_ROOT="${1:-.}"

pass() { PASS=$((PASS + 1)); printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  \033[31mFAIL\033[0m  %s\n" "$1"; }
warn() { WARN=$((WARN + 1)); printf "  \033[33mWARN\033[0m  %s\n" "$1"; }
header() { printf "\n\033[1m=== %s ===\033[0m\n" "$1"; }

cd "$PROJECT_ROOT"

# -------------------------------------------------------------------
header "1. dev_docs/ Structure"
# -------------------------------------------------------------------

if [ -d "dev_docs" ]; then
  pass "dev_docs/ directory exists"
else
  fail "dev_docs/ directory missing — ORCHESTRATOR may not have run"
  printf "\n\033[31m✗ Cannot validate: dev_docs/ not found.\033[0m\n"
  exit 1
fi

for dir in specs services tasks foundations completeness; do
  if [ -d "dev_docs/$dir" ]; then
    pass "dev_docs/$dir/ exists"
  else
    warn "dev_docs/$dir/ missing"
  fi
done

# -------------------------------------------------------------------
header "2. State Files"
# -------------------------------------------------------------------

for f in STATUS.md CHANGELOG.md; do
  if [ -f "dev_docs/$f" ]; then
    pass "dev_docs/$f exists"
  else
    fail "dev_docs/$f missing"
  fi
done

# -------------------------------------------------------------------
header "3. Unresolved Placeholders"
# -------------------------------------------------------------------

placeholder_count=$(grep -r '{{[A-Z_]*}}' dev_docs/ 2>/dev/null | grep -v '.example' | wc -l | tr -d ' ')

if [ "$placeholder_count" -eq 0 ]; then
  pass "No unresolved {{PLACEHOLDER}} variables found"
elif [ "$placeholder_count" -le 5 ]; then
  warn "Found $placeholder_count unresolved placeholders (may be intentional)"
  grep -r '{{[A-Z_]*}}' dev_docs/ 2>/dev/null | grep -v '.example' | head -5 | while read -r line; do
    printf "       %s\n" "$line"
  done
else
  fail "Found $placeholder_count unresolved placeholders"
  grep -r '{{[A-Z_]*}}' dev_docs/ 2>/dev/null | grep -v '.example' | head -10 | while read -r line; do
    printf "       %s\n" "$line"
  done
  printf "       ... and %d more\n" "$((placeholder_count - 10))"
fi

# -------------------------------------------------------------------
header "4. Service Completeness"
# -------------------------------------------------------------------

if [ -d "dev_docs/services" ]; then
  hub_count=$(find dev_docs/services -name "*.hub.md" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$hub_count" -ge 1 ]; then
    pass "Service hubs found: $hub_count"
  else
    fail "No service hub files found in dev_docs/services/"
  fi
else
  warn "dev_docs/services/ directory missing"
  hub_count=0
fi

if [ -d "dev_docs/specs/services" ] || [ -d "dev_docs/specs" ]; then
  spec_count=$(find dev_docs/specs -name "*-spec.md" -o -name "*-spec.md" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$spec_count" -ge 1 ]; then
    pass "Service specs found: $spec_count"
  else
    warn "No service spec files found"
  fi
else
  warn "No specs directory found"
  spec_count=0
fi

# Cross-reference: every hub should have a spec
if [ "$hub_count" -gt 0 ] && [ "$spec_count" -gt 0 ]; then
  if [ "$hub_count" -le "$spec_count" ]; then
    pass "Hub-to-spec ratio: $hub_count hubs / $spec_count specs"
  else
    warn "More hubs ($hub_count) than specs ($spec_count) — some services may lack specs"
  fi
fi

# -------------------------------------------------------------------
header "5. Task File Coverage"
# -------------------------------------------------------------------

if [ -d "dev_docs/tasks" ]; then
  task_count=$(find dev_docs/tasks -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$task_count" -ge 10 ]; then
    pass "Task files found: $task_count"
  elif [ "$task_count" -ge 1 ]; then
    warn "Task files found: $task_count (expected 10+ for a typical project)"
  else
    fail "No task files found in dev_docs/tasks/"
  fi
else
  fail "dev_docs/tasks/ directory missing"
fi

# -------------------------------------------------------------------
header "6. Completeness Artifacts"
# -------------------------------------------------------------------

if [ -d "dev_docs/completeness" ]; then
  for artifact in service-matrix.md screen-matrix.md; do
    if [ -f "dev_docs/completeness/$artifact" ]; then
      pass "dev_docs/completeness/$artifact exists"
    else
      warn "dev_docs/completeness/$artifact missing"
    fi
  done
else
  warn "dev_docs/completeness/ directory missing"
fi

# -------------------------------------------------------------------
header "7. Design System"
# -------------------------------------------------------------------

design_found=0
for pattern in "design-tokens" "DESIGN-TOKENS" "tokens"; do
  if find dev_docs -name "*${pattern}*" 2>/dev/null | grep -q .; then
    design_found=1
    break
  fi
done

if [ "$design_found" -eq 1 ]; then
  pass "Design tokens file found"
else
  warn "No design tokens file found (expected for projects with UI)"
fi

# -------------------------------------------------------------------
header "8. Cross-Reference Integrity"
# -------------------------------------------------------------------

broken_refs=0

# Check that files referenced in STATUS.md actually exist
if [ -f "dev_docs/STATUS.md" ]; then
  # Extract markdown links and check if referenced files exist
  grep -oP '\[.*?\]\((.*?)\)' dev_docs/STATUS.md 2>/dev/null | grep -oP '\((.*?)\)' | tr -d '()' | while read -r ref; do
    # Skip URLs and anchors
    if echo "$ref" | grep -qE '^(http|#)'; then
      continue
    fi
    # Check relative to dev_docs/
    if [ ! -f "dev_docs/$ref" ] && [ ! -f "$ref" ]; then
      broken_refs=$((broken_refs + 1))
      if [ "$broken_refs" -le 5 ]; then
        printf "       Broken ref in STATUS.md: %s\n" "$ref"
      fi
    fi
  done
fi

if [ "$broken_refs" -eq 0 ]; then
  pass "No broken references detected in STATUS.md"
else
  warn "Found $broken_refs broken reference(s) in STATUS.md"
fi

# -------------------------------------------------------------------
header "9. Environment Configuration"
# -------------------------------------------------------------------

env_found=0
for f in .env.example .env.template env.example; do
  if [ -f "$f" ]; then
    env_found=1
    pass "Environment template found: $f"
    break
  fi
done

if [ "$env_found" -eq 0 ]; then
  warn "No .env.example or environment template found"
fi

# -------------------------------------------------------------------
header "10. Hardening Artifacts"
# -------------------------------------------------------------------

if [ -d "dev_docs/hardening" ]; then
  pass "dev_docs/hardening/ directory exists"

  for subdir in audit enhancement depth-verification deep-dive expansion; do
    if [ -d "dev_docs/hardening/$subdir" ]; then
      pass "dev_docs/hardening/$subdir/ exists"
    else
      warn "dev_docs/hardening/$subdir/ missing"
    fi
  done

  # Check for key summary files
  for summary in audit/audit-summary.md enhancement/enhancement-log.md depth-verification/depth-summary.md deep-dive/deep-dive-summary.md expansion/expansion-plan.md; do
    if [ -f "dev_docs/hardening/$summary" ]; then
      pass "dev_docs/hardening/$summary exists"
    else
      warn "dev_docs/hardening/$summary missing"
    fi
  done
else
  warn "dev_docs/hardening/ directory missing — hardening steps (29-33) may not have run"
fi

# Check for readiness checklist (generated by Step 33)
if [ -f "dev_docs/READY-TO-CODE.md" ]; then
  pass "dev_docs/READY-TO-CODE.md exists"
else
  warn "dev_docs/READY-TO-CODE.md missing — Step 33 may not have completed"
fi

# -------------------------------------------------------------------
header "11. CX Operations Artifacts (Conditional)"
# -------------------------------------------------------------------

if [ -d "dev_docs/cx-operations" ]; then
  pass "dev_docs/cx-operations/ directory exists"
  file_count=$(find dev_docs/cx-operations -name "*.md" | wc -l)
  if [ "$file_count" -ge 3 ]; then
    pass "dev_docs/cx-operations/ has $file_count files"
  else
    warn "dev_docs/cx-operations/ has only $file_count files (expected ≥3)"
  fi
else
  warn "dev_docs/cx-operations/ missing — Step 18.7.5 may have been skipped (conditional)"
fi

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

printf "\n\033[1m============================================\033[0m\n"
printf "\033[1m  OUTPUT VALIDATION SUMMARY\033[0m\n"
printf "\033[1m============================================\033[0m\n"
printf "  \033[32mPASS: %d\033[0m\n" "$PASS"
printf "  \033[31mFAIL: %d\033[0m\n" "$FAIL"
printf "  \033[33mWARN: %d\033[0m\n" "$WARN"
printf "\033[1m============================================\033[0m\n"

if [ "$FAIL" -eq 0 ] && [ "$WARN" -eq 0 ]; then
  printf "\n  \033[32m✓ Output validation passed! Project docs look complete.\033[0m\n\n"
  exit 0
elif [ "$FAIL" -eq 0 ]; then
  printf "\n  \033[33m⚠ Output validation passed with %d warning(s). Review above.\033[0m\n\n" "$WARN"
  exit 0
else
  printf "\n  \033[31m✗ Output validation found %d failure(s). Fix before coding.\033[0m\n\n" "$FAIL"
  exit 1
fi
