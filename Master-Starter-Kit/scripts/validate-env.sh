#!/usr/bin/env bash
# ===========================================================================
# validate-env.sh — Check that all env vars used in code are documented
# Run from the project root:
#   bash path/to/Master-Starter-Kit/scripts/validate-env.sh
# ===========================================================================

set -euo pipefail

PASS=0
FAIL=0
WARN=0

pass() { PASS=$((PASS + 1)); printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  \033[31mFAIL\033[0m  %s\n" "$1"; }
warn() { WARN=$((WARN + 1)); printf "  \033[33mWARN\033[0m  %s\n" "$1"; }
header() { printf "\n\033[1m=== %s ===\033[0m\n" "$1"; }

# Find the env example file
ENV_FILE=""
for f in .env.example .env.template env.example .env.sample; do
  if [ -f "$f" ]; then
    ENV_FILE="$f"
    break
  fi
done

if [ -z "$ENV_FILE" ]; then
  printf "\033[33mNo .env.example found. Scanning for env var usage only.\033[0m\n"
fi

# -------------------------------------------------------------------
header "1. Env Vars in Code"
# -------------------------------------------------------------------

# Collect all env var references from source code
code_vars=$(mktemp)

# JavaScript/TypeScript: process.env.VAR_NAME
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" \
  -exec grep -ohP 'process\.env\.([A-Z_][A-Z0-9_]*)' {} \; 2>/dev/null | \
  sed 's/process\.env\.//' | sort -u >> "$code_vars" 2>/dev/null || true

# Python: os.environ["VAR"] or os.getenv("VAR")
find . -type f -name "*.py" -not -path "*/venv/*" -not -path "*/.venv/*" \
  -exec grep -ohP '(?:os\.environ\["|os\.getenv\(")([A-Z_][A-Z0-9_]*)' {} \; 2>/dev/null | \
  sed 's/os\.environ\["//' | sed 's/os\.getenv("//' | sort -u >> "$code_vars" 2>/dev/null || true

# Env() calls (various frameworks)
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) \
  -not -path "*/node_modules/*" -not -path "*/venv/*" \
  -exec grep -ohP '(?:Env|env)\(\s*["\x27]([A-Z_][A-Z0-9_]*)["\x27]' {} \; 2>/dev/null | \
  grep -oP '[A-Z_][A-Z0-9_]*' | sort -u >> "$code_vars" 2>/dev/null || true

code_var_count=$(sort -u "$code_vars" | wc -l | tr -d ' ')
printf "  Found %d unique env vars referenced in code\n" "$code_var_count"

if [ "$code_var_count" -eq 0 ]; then
  pass "No env vars found in code (may be a planning-only project)"
  rm -f "$code_vars"
  exit 0
fi

# -------------------------------------------------------------------
header "2. Env Vars in Documentation"
# -------------------------------------------------------------------

if [ -n "$ENV_FILE" ]; then
  doc_vars=$(mktemp)
  grep -oP '^([A-Z_][A-Z0-9_]*)' "$ENV_FILE" 2>/dev/null | sort -u > "$doc_vars"
  doc_var_count=$(wc -l < "$doc_vars" | tr -d ' ')
  pass "Found $doc_var_count vars documented in $ENV_FILE"
else
  doc_vars=$(mktemp)
  doc_var_count=0
  warn "No env example file found"
fi

# -------------------------------------------------------------------
header "3. Missing from Documentation"
# -------------------------------------------------------------------

missing_count=0
if [ -n "$ENV_FILE" ]; then
  while read -r var; do
    [ -z "$var" ] && continue
    if ! grep -q "^$var" "$doc_vars" 2>/dev/null; then
      missing_count=$((missing_count + 1))
      if [ "$missing_count" -le 15 ]; then
        printf "       MISSING: %s\n" "$var"
      fi
    fi
  done < <(sort -u "$code_vars")

  if [ "$missing_count" -eq 0 ]; then
    pass "All code env vars are documented in $ENV_FILE"
  else
    fail "$missing_count env var(s) used in code but missing from $ENV_FILE"
  fi
fi

# -------------------------------------------------------------------
header "4. Documented but Unused"
# -------------------------------------------------------------------

unused_count=0
if [ -n "$ENV_FILE" ] && [ "$doc_var_count" -gt 0 ]; then
  while read -r var; do
    [ -z "$var" ] && continue
    if ! grep -q "$var" "$code_vars" 2>/dev/null; then
      unused_count=$((unused_count + 1))
      if [ "$unused_count" -le 10 ]; then
        printf "       UNUSED: %s\n" "$var"
      fi
    fi
  done < <(cat "$doc_vars")

  if [ "$unused_count" -eq 0 ]; then
    pass "All documented env vars are used in code"
  else
    warn "$unused_count env var(s) documented but not found in code (may be used at runtime)"
  fi
fi

rm -f "$code_vars" "$doc_vars"

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

printf "\n\033[1m============================================\033[0m\n"
printf "\033[1m  ENV VAR VALIDATION SUMMARY\033[0m\n"
printf "\033[1m============================================\033[0m\n"
printf "  \033[32mPASS: %d\033[0m\n" "$PASS"
printf "  \033[31mFAIL: %d\033[0m\n" "$FAIL"
printf "  \033[33mWARN: %d\033[0m\n" "$WARN"
printf "\033[1m============================================\033[0m\n"

if [ "$FAIL" -eq 0 ]; then
  printf "\n  \033[32m✓ Env var validation passed.\033[0m\n\n"
  exit 0
else
  printf "\n  \033[31m✗ %d issue(s) found. Update %s.\033[0m\n\n" "$FAIL" "${ENV_FILE:-.env.example}"
  exit 1
fi
