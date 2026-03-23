#!/usr/bin/env bash
# ===========================================================================
# validate-kit.sh — Master Starter Kit self-validation script
# Run from the Master-Starter-Kit/ directory:
#   bash scripts/validate-kit.sh
# ===========================================================================

set -euo pipefail

PASS=0
FAIL=0
WARN=0
KIT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

pass() { PASS=$((PASS + 1)); printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  \033[31mFAIL\033[0m  %s\n" "$1"; }
warn() { WARN=$((WARN + 1)); printf "  \033[33mWARN\033[0m  %s\n" "$1"; }
header() { printf "\n\033[1m=== %s ===\033[0m\n" "$1"; }

cd "$KIT_ROOT"

# -------------------------------------------------------------------
header "1. Core Files"
# -------------------------------------------------------------------

for f in ORCHESTRATOR.md README.md PLACEHOLDER-REGISTRY.md LESSONS-LEARNED.md \
         VERSION CHANGELOG.md CLAUDE.md .gitignore; do
  if [ -f "$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done

# Parent CLAUDE.md
if [ -f "../CLAUDE.md" ]; then
  pass "../CLAUDE.md (Master-Kit root) exists"
else
  warn "../CLAUDE.md (Master-Kit root) missing — optional but recommended"
fi

# -------------------------------------------------------------------
header "2. Section Directories (00-19)"
# -------------------------------------------------------------------

EXPECTED_SECTIONS=(
  "00-discovery"
  "01-tribunal"
  "02-architecture"
  "03-documentation"
  "04-phase-planning"
  "05-dev-infrastructure"
  "06-development-workflow"
  "07-ui-design-system"
  "08-quality-testing"
  "09-deployment-operations"
  "10-generators"
  "11-new-capabilities"
  "12-examples"
  "13-lessons-gotchas"
  "14-mobile-platform"
  "15-mobile-ui-design"
  "16-mobile-native-features"
  "17-mobile-deployment"
  "18-user-documentation"
  "19-marketing"
  "20-post-launch"
  "21-incident-response"
  "22-cicd-pipeline"
  "23-customer-support"
  "24-ai-ml-integration"
  "25-financial-modeling"
  "26-multi-tenant-saas"
  "27-team-communication"
  "28-competitive-intelligence"
  "29-legal-documents"
  "30-billing-payments"
  "31-stakeholder-communications"
  "32-integrations"
  "33-customer-experience-ops"
  "34-hardening"
)

section_count=0
for section in "${EXPECTED_SECTIONS[@]}"; do
  if [ -d "$section" ]; then
    section_count=$((section_count + 1))
  else
    fail "Section directory missing: $section/"
  fi
done

if [ "$section_count" -eq 35 ]; then
  pass "All 35 section directories present"
else
  fail "Only $section_count/35 section directories found"
fi

# -------------------------------------------------------------------
header "3. Template Count"
# -------------------------------------------------------------------

template_count=$(find . -name "*.template.md" -o -name "*.template.json" -o -name "*.template.js" -o -name "*.template.sh" | wc -l | tr -d ' ')

if [ "$template_count" -ge 150 ]; then
  pass "Template count: $template_count (expected 150+)"
else
  warn "Template count: $template_count (expected 150+, may indicate missing files)"
fi

# -------------------------------------------------------------------
header "4. Example Files"
# -------------------------------------------------------------------

example_count=$(find 12-examples/ -maxdepth 1 -type f -name "*.example*" -o -name "*.example.md" | wc -l | tr -d ' ')

if [ "$example_count" -ge 20 ]; then
  pass "Example count: $example_count (expected 20+)"
elif [ "$example_count" -ge 15 ]; then
  warn "Example count: $example_count (expected 20+)"
else
  fail "Example count: $example_count (expected 20+)"
fi

# -------------------------------------------------------------------
header "5. ORCHESTRATOR Integrity"
# -------------------------------------------------------------------

# Check step continuity (core steps 0-16, 17, 18, 19-28)
for step in 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28; do
  if grep -q "Step $step" ORCHESTRATOR.md 2>/dev/null; then
    : # found
  else
    fail "ORCHESTRATOR.md missing Step $step"
  fi
done
pass "ORCHESTRATOR step continuity (0-28) verified"

# Check for GATE keywords
gate_count=$(grep -c "^\\*\\*GATE:" ORCHESTRATOR.md 2>/dev/null || echo "0")
if [ "$gate_count" -ge 10 ]; then
  pass "Gate checkpoints found: $gate_count"
else
  warn "Gate checkpoints found: $gate_count (expected 10+)"
fi

# Check STATE BLOCK exists
if grep -q "STATE BLOCK" ORCHESTRATOR.md 2>/dev/null; then
  pass "STATE BLOCK reference found in ORCHESTRATOR"
else
  fail "STATE BLOCK reference missing from ORCHESTRATOR"
fi

# Check COMPLETED array has steps 17 and 18
if grep -q "17-capabilities" ORCHESTRATOR.md 2>/dev/null; then
  pass "Step 17 (capabilities) in COMPLETED array"
else
  fail "Step 17 (capabilities) missing from COMPLETED array"
fi

if grep -q "18-onboarding" ORCHESTRATOR.md 2>/dev/null; then
  pass "Step 18 (onboarding) in COMPLETED array"
else
  fail "Step 18 (onboarding) missing from COMPLETED array"
fi

# -------------------------------------------------------------------
header "6. Key Template Files"
# -------------------------------------------------------------------

KEY_TEMPLATES=(
  "00-discovery/project-brief.template.md"
  "02-architecture/database-design.md"
  "02-architecture/migration-strategy.template.md"
  "02-architecture/state-management-decision-tree.md"
  "03-documentation/spec-layer/screen-spec-template.md"
  "03-documentation/spec-layer/service-spec-template.md"
  "03-documentation/state-files/handoff.template.md"
  "03-documentation/state-files/DEVLOG.template.md"
  "03-documentation/state-files/PROTECT-LIST.template.md"
  "04-phase-planning/feature-phase.template.md"
  "06-development-workflow/dev-onboarding.template.md"
  "06-development-workflow/session-ritual.md"
  "08-quality-testing/test-configs/performance-test.config.template.md"
  "09-deployment-operations/environment-management.md"
)

key_found=0
for t in "${KEY_TEMPLATES[@]}"; do
  if [ -f "$t" ]; then
    key_found=$((key_found + 1))
  else
    fail "Key file missing: $t"
  fi
done
pass "Key template files: $key_found/${#KEY_TEMPLATES[@]} found"

# -------------------------------------------------------------------
header "7. Capabilities Wiring (11-new-capabilities/)"
# -------------------------------------------------------------------

CAPABILITIES=(
  "11-new-capabilities/caching-strategy.md"
  "11-new-capabilities/feature-flags.md"
  "11-new-capabilities/i18n-setup.md"
  "11-new-capabilities/analytics-tracking.md"
  "11-new-capabilities/performance-budgets.md"
)

cap_found=0
for cap in "${CAPABILITIES[@]}"; do
  if [ -f "$cap" ]; then
    cap_found=$((cap_found + 1))
  else
    warn "Capability file missing: $cap"
  fi
done

if [ "$cap_found" -ge 4 ]; then
  pass "Capability files: $cap_found/${#CAPABILITIES[@]} found"
else
  warn "Capability files: $cap_found/${#CAPABILITIES[@]} found (some may be optional)"
fi

# -------------------------------------------------------------------
header "8. PLACEHOLDER-REGISTRY Spot Check"
# -------------------------------------------------------------------

# Check that commonly-used placeholders are documented
for placeholder in "PROJECT_NAME" "FRAMEWORK" "DATABASE" "AUTH_STRATEGY" "HOSTING_PROVIDER"; do
  if grep -q "$placeholder" PLACEHOLDER-REGISTRY.md 2>/dev/null; then
    : # found
  else
    fail "PLACEHOLDER-REGISTRY.md missing: $placeholder"
  fi
done
pass "Core placeholders documented in registry"

# -------------------------------------------------------------------
header "9. Version File"
# -------------------------------------------------------------------

if [ -f "VERSION" ]; then
  version=$(cat VERSION | tr -d '[:space:]')
  if echo "$version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
    pass "VERSION file contains valid semver: $version"
  else
    warn "VERSION file content not semver: $version"
  fi
fi

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

printf "\n\033[1m============================================\033[0m\n"
printf "\033[1m  VALIDATION SUMMARY\033[0m\n"
printf "\033[1m============================================\033[0m\n"
printf "  \033[32mPASS: %d\033[0m\n" "$PASS"
printf "  \033[31mFAIL: %d\033[0m\n" "$FAIL"
printf "  \033[33mWARN: %d\033[0m\n" "$WARN"
printf "\033[1m============================================\033[0m\n"

if [ "$FAIL" -eq 0 ]; then
  printf "\n  \033[32m✓ Kit validation passed!\033[0m\n\n"
  exit 0
else
  printf "\n  \033[31m✗ Kit validation found %d failure(s).\033[0m\n\n" "$FAIL"
  exit 1
fi
