#!/usr/bin/env bash

# dead-ui-sweep.sh — Dead UI Indicator Scanner
#
# Scans codebase for common dead UI indicators: Coming Soon text,
# empty handlers, ghost routes, commented-out features.
#
# Usage: bash scripts/dead-ui-sweep.sh [project_root]
#
# Exit codes:
#   0 = PASS (no dead UI found)
#   1 = FAIL (dead UI indicators detected)

PROJECT_ROOT="${1:-.}"
FINDINGS=0

echo "=== Dead UI Sweep ==="
echo "Scanning: $PROJECT_ROOT"
echo ""

# --- Category 1: Placeholder Text ---
echo "--- Category 1: Placeholder Text ---"
echo ""

PLACEHOLDER_PATTERNS=(
  "Coming Soon"
  "Under Construction"
  "Not yet available"
  "not yet implemented"
  "Placeholder"
  "Lorem ipsum"
  "TODO: implement"
  "FIXME: implement"
)

for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
  count=$(grep -ri --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.html" \
    "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  ✗ Found '$pattern' ($count occurrences)"
    grep -ri --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.html" \
      -l "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | head -3
    echo ""
    FINDINGS=$((FINDINGS + count))
  fi
done

# --- Category 2: Empty Click Handlers ---
echo "--- Category 2: Empty/Stub Handlers ---"
echo ""

HANDLER_PATTERNS=(
  'onClick={() => {}}'
  'onClick={() => null}'
  'onClick={() => undefined}'
  'onSubmit={() => {}}'
  'onChange={() => {}}'
  "onClick={() => console.log"
  "onClick={() => alert("
)

for pattern in "${HANDLER_PATTERNS[@]}"; do
  count=$(grep -r --include="*.tsx" --include="*.jsx" \
    "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  ✗ Found stub handler: $pattern ($count occurrences)"
    FINDINGS=$((FINDINGS + count))
  fi
done

echo ""

# --- Category 3: Ghost Routes (Next.js) ---
if [ -d "$PROJECT_ROOT/src/app" ] || [ -d "$PROJECT_ROOT/apps" ]; then
  echo "--- Category 3: Ghost Routes ---"
  echo ""

  # Find route directories that exist but have empty or minimal page.tsx
  EMPTY_ROUTES=0
  while IFS= read -r page_file; do
    [ -z "$page_file" ] && continue
    line_count=$(wc -l < "$page_file" 2>/dev/null)
    if [ "$line_count" -lt 5 ]; then
      echo "  ✗ Minimal page file ($line_count lines): $page_file"
      EMPTY_ROUTES=$((EMPTY_ROUTES + 1))
    fi
  done < <(find "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" -name "page.tsx" 2>/dev/null)

  # Find route directories with no page.tsx at all
  while IFS= read -r dir; do
    [ -z "$dir" ] && continue
    if [ ! -f "$dir/page.tsx" ] && [ ! -f "$dir/page.ts" ] && [ ! -f "$dir/page.jsx" ]; then
      # Check if it's a route group or layout-only directory
      if [ -f "$dir/layout.tsx" ] && ls "$dir"/*/page.tsx >/dev/null 2>&1; then
        continue  # Layout directory with child routes — not a ghost
      fi
      echo "  ⚠ Route directory with no page: $dir"
      EMPTY_ROUTES=$((EMPTY_ROUTES + 1))
    fi
  done < <(find "$PROJECT_ROOT/src/app" "$PROJECT_ROOT/apps" -type d 2>/dev/null | grep -v node_modules | grep -v '\.')

  if [ "$EMPTY_ROUTES" -gt 0 ]; then
    FINDINGS=$((FINDINGS + EMPTY_ROUTES))
  else
    echo "  ✓ No ghost routes found"
  fi
  echo ""
fi

# --- Category 4: Disabled UI Elements ---
echo "--- Category 4: Disabled/Hidden Feature Indicators ---"
echo ""

DISABLED_PATTERNS=(
  'disabled={true}'
  'aria-disabled="true"'
  'className=".*disabled.*"'
  'style={{ display: .none. }}'
  'hidden={true}'
)

for pattern in "${DISABLED_PATTERNS[@]}"; do
  count=$(grep -r --include="*.tsx" --include="*.jsx" \
    "$pattern" "$PROJECT_ROOT/src" "$PROJECT_ROOT/apps" "$PROJECT_ROOT/packages" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  ⚠ Found '$pattern' ($count occurrences) — verify these are intentional"
  fi
done

echo ""

# --- Summary ---
echo "=== Sweep Complete ==="
echo ""
echo "Dead UI indicators found: $FINDINGS"
echo ""

if [ "$FINDINGS" -gt 0 ]; then
  echo "RESULT: FAIL — $FINDINGS dead UI indicator(s) found."
  echo "  → Review each finding and either remove the dead UI or implement the feature."
  exit 1
else
  echo "RESULT: PASS — No dead UI detected."
  exit 0
fi
