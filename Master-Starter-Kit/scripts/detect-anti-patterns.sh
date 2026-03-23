#!/usr/bin/env bash

# detect-anti-patterns.sh — Automated Anti-Pattern Detection
#
# Scans the codebase for common anti-patterns using grep/regex.
# Stack-aware: detects project type and applies relevant patterns.
#
# Usage: bash scripts/detect-anti-patterns.sh [project_root]
#   project_root: Path to project root (default: .)
#
# Exit codes:
#   0 = PASS (no anti-patterns found)
#   1 = FAIL (anti-patterns detected)

PROJECT_ROOT="${1:-.}"
FINDINGS=0
WARNINGS=0

echo "=== Anti-Pattern Detection Scan ==="
echo "Project root: $PROJECT_ROOT"
echo ""

# --- Stack Detection ---
HAS_TYPESCRIPT=false
HAS_REACT=false
HAS_NEXTJS=false
HAS_TAILWIND=false

[ -f "$PROJECT_ROOT/tsconfig.json" ] && HAS_TYPESCRIPT=true
[ -f "$PROJECT_ROOT/package.json" ] && grep -q '"react"' "$PROJECT_ROOT/package.json" 2>/dev/null && HAS_REACT=true
[ -f "$PROJECT_ROOT/next.config.js" ] || [ -f "$PROJECT_ROOT/next.config.ts" ] || [ -f "$PROJECT_ROOT/next.config.mjs" ] && HAS_NEXTJS=true
[ -f "$PROJECT_ROOT/tailwind.config.js" ] || [ -f "$PROJECT_ROOT/tailwind.config.ts" ] && HAS_TAILWIND=true

echo "Stack detected: TS=$HAS_TYPESCRIPT React=$HAS_REACT Next=$HAS_NEXTJS Tailwind=$HAS_TAILWIND"
echo ""

# --- Helper ---
check_pattern() {
  local label="$1"
  local pattern="$2"
  local include="$3"
  local severity="$4"  # FAIL or WARN
  local description="$5"

  local count
  count=$(grep -r --include="$include" -l "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | wc -l)

  if [ "$count" -gt 0 ]; then
    if [ "$severity" = "FAIL" ]; then
      echo "  ✗ [$severity] $label ($count files)"
      FINDINGS=$((FINDINGS + count))
    else
      echo "  ⚠ [$severity] $label ($count files)"
      WARNINGS=$((WARNINGS + count))
    fi
    echo "    $description"
    grep -r --include="$include" -l "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | head -5
    [ "$count" -gt 5 ] && echo "    ... and $((count - 5)) more files"
    echo ""
  fi
}

# --- Universal Patterns (all projects) ---
echo "--- Universal Anti-Patterns ---"
echo ""

check_pattern \
  "Console.log in production code" \
  "console\.log(" \
  "*.ts" \
  "WARN" \
  "Console.log statements should be removed or replaced with a proper logger."

check_pattern \
  "TODO/FIXME in shipped code" \
  "TODO\|FIXME\|HACK\|XXX" \
  "*.ts" \
  "WARN" \
  "Unresolved TODO/FIXME comments indicate incomplete work."

check_pattern \
  "Hardcoded secrets" \
  'password\s*=\s*"[^"]\+"\|api_key\s*=\s*"[^"]\+"\|secret\s*=\s*"[^"]\+"\|token\s*=\s*"[^"]\+' \
  "*.ts" \
  "FAIL" \
  "Hardcoded secrets must use environment variables."

check_pattern \
  "Empty catch blocks" \
  'catch\s*([^)]*)\s*{\s*}' \
  "*.ts" \
  "FAIL" \
  "Empty catch blocks silently swallow errors. At minimum, log the error."

# --- TypeScript Patterns ---
if $HAS_TYPESCRIPT; then
  echo "--- TypeScript Anti-Patterns ---"
  echo ""

  check_pattern \
    "Usage of 'any' type" \
    ": any\b\|as any\b\|<any>" \
    "*.ts" \
    "WARN" \
    "The 'any' type bypasses type checking. Use 'unknown' or specific types."

  check_pattern \
    "Non-null assertion operator (!)  " \
    '!\.' \
    "*.ts" \
    "WARN" \
    "Non-null assertions bypass null checks. Use optional chaining or proper null guards."

  check_pattern \
    "@ts-ignore without explanation" \
    '@ts-ignore$\|@ts-expect-error$' \
    "*.ts" \
    "WARN" \
    "Type suppression should include a comment explaining why."
fi

# --- React Patterns ---
if $HAS_REACT; then
  echo "--- React Anti-Patterns ---"
  echo ""

  check_pattern \
    "Empty click handlers" \
    'onClick={() => {}}' \
    "*.tsx" \
    "FAIL" \
    "Empty click handlers create non-functional UI. Either implement or remove."

  check_pattern \
    "Inline styles (not using design system)" \
    'style={{' \
    "*.tsx" \
    "WARN" \
    "Inline styles bypass the design system. Use className or styled components."

  check_pattern \
    "Missing key prop in lists" \
    '\.map(\|\.forEach(' \
    "*.tsx" \
    "WARN" \
    "Lists rendered with .map() need unique key props. Verify manually."
fi

# --- Next.js Patterns ---
if $HAS_NEXTJS; then
  echo "--- Next.js Anti-Patterns ---"
  echo ""

  # Check for missing error.tsx and loading.tsx in route directories
  ROUTE_DIRS=$(find "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" -name "page.tsx" -exec dirname {} \; 2>/dev/null)
  MISSING_ERROR=0
  MISSING_LOADING=0

  for dir in $ROUTE_DIRS; do
    [ ! -f "$dir/error.tsx" ] && MISSING_ERROR=$((MISSING_ERROR + 1))
    [ ! -f "$dir/loading.tsx" ] && MISSING_LOADING=$((MISSING_LOADING + 1))
  done

  if [ "$MISSING_ERROR" -gt 0 ]; then
    echo "  ✗ [FAIL] Missing error.tsx boundaries ($MISSING_ERROR routes)"
    echo "    Every route should have an error.tsx for graceful error handling."
    FINDINGS=$((FINDINGS + MISSING_ERROR))
    echo ""
  fi

  if [ "$MISSING_LOADING" -gt 0 ]; then
    echo "  ⚠ [WARN] Missing loading.tsx ($MISSING_LOADING routes)"
    echo "    Routes without loading.tsx show no loading indicator."
    WARNINGS=$((WARNINGS + MISSING_LOADING))
    echo ""
  fi
fi

# --- Tailwind / Design Token Patterns ---
if $HAS_TAILWIND; then
  echo "--- Design System Anti-Patterns ---"
  echo ""

  check_pattern \
    "Hardcoded hex colors (not using design tokens)" \
    '#[0-9a-fA-F]\{6\}\|#[0-9a-fA-F]\{3\}\b' \
    "*.tsx" \
    "WARN" \
    "Hardcoded colors bypass the design token system. Use Tailwind classes or CSS variables."

  check_pattern \
    "Hardcoded pixel values in className" \
    'w-\[.*px\]\|h-\[.*px\]\|p-\[.*px\]\|m-\[.*px\]' \
    "*.tsx" \
    "WARN" \
    "Arbitrary pixel values bypass the spacing scale. Use Tailwind's built-in scale."
fi

# --- Multi-tenant Patterns ---
echo "--- Multi-Tenant Anti-Patterns ---"
echo ""

check_pattern \
  "Missing tenant isolation in queries" \
  'findMany\|findFirst\|findUnique\|\.where(' \
  "*.ts" \
  "WARN" \
  "Database queries may be missing organizationId filter. Verify tenant isolation manually."

check_pattern \
  "Missing soft delete filter" \
  'findMany\|findFirst' \
  "*.ts" \
  "WARN" \
  "Queries may be missing deletedAt IS NULL filter. Verify soft delete handling manually."

# --- Summary ---
echo "=== Scan Complete ==="
echo ""
echo "FAIL findings: $FINDINGS"
echo "WARN findings: $WARNINGS"
echo ""

if [ "$FINDINGS" -gt 0 ]; then
  echo "RESULT: FAIL — $FINDINGS anti-pattern(s) require immediate attention."
  exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo "RESULT: PASS WITH WARNINGS — $WARNINGS item(s) should be reviewed."
  exit 0
else
  echo "RESULT: PASS — No anti-patterns detected."
  exit 0
fi
