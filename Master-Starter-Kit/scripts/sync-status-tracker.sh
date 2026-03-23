#!/usr/bin/env bash

# sync-status-tracker.sh — Quick STATUS.md ↔ master-tracker.md sync check
#
# Usage: bash scripts/sync-status-tracker.sh [dev_docs_path]
#   dev_docs_path: Path to dev_docs/ directory (default: ./dev_docs)
#
# Exit codes:
#   0 = PASS
#   1 = FAIL (discrepancies found)
#   2 = ERROR (files not found)

DEV_DOCS="${1:-./dev_docs}"
STATUS_FILE="$DEV_DOCS/STATUS.md"
TRACKER_FILE="$DEV_DOCS/tracker/master-tracker.md"

echo "=== STATUS.md ↔ Master Tracker Sync Check ==="
echo ""

# Check files exist
if [ ! -f "$STATUS_FILE" ]; then
  echo "ERROR: STATUS.md not found at $STATUS_FILE"
  exit 2
fi

if [ ! -f "$TRACKER_FILE" ]; then
  echo "WARN: master-tracker.md not found at $TRACKER_FILE"
  echo "  → Master tracker may not be enabled"
  echo ""
  echo "RESULT: SKIP"
  exit 0
fi

FAIL=0

# Check 1: Checkbox counts
STATUS_CHECKED=$(grep -c '\- \[x\]' "$STATUS_FILE" 2>/dev/null || echo 0)
STATUS_UNCHECKED=$(grep -c '\- \[ \]' "$STATUS_FILE" 2>/dev/null || echo 0)
STATUS_TOTAL=$((STATUS_CHECKED + STATUS_UNCHECKED))

TRACKER_CHECKED=$(grep -c '\- \[x\]' "$TRACKER_FILE" 2>/dev/null || echo 0)
TRACKER_UNCHECKED=$(grep -c '\- \[ \]' "$TRACKER_FILE" 2>/dev/null || echo 0)
TRACKER_TOTAL=$((TRACKER_CHECKED + TRACKER_UNCHECKED))

echo "Checkbox Counts:"
echo "  STATUS.md:       $STATUS_TOTAL total ($STATUS_CHECKED done, $STATUS_UNCHECKED remaining)"
echo "  master-tracker:  $TRACKER_TOTAL total ($TRACKER_CHECKED done, $TRACKER_UNCHECKED remaining)"

if [ "$STATUS_TOTAL" -ne "$TRACKER_TOTAL" ]; then
  DIFF=$((STATUS_TOTAL - TRACKER_TOTAL))
  echo "  ✗ FAIL: Count mismatch (diff: $DIFF)"
  FAIL=1
else
  echo "  ✓ PASS: Counts match"
fi

echo ""

# Check 2: Completion percentage alignment
if [ "$STATUS_TOTAL" -gt 0 ] && [ "$TRACKER_TOTAL" -gt 0 ]; then
  STATUS_PCT=$((STATUS_CHECKED * 100 / STATUS_TOTAL))
  TRACKER_PCT=$((TRACKER_CHECKED * 100 / TRACKER_TOTAL))
  PCT_DIFF=$((STATUS_PCT - TRACKER_PCT))
  if [ "$PCT_DIFF" -lt 0 ]; then PCT_DIFF=$((-PCT_DIFF)); fi

  echo "Completion Alignment:"
  echo "  STATUS.md:      ${STATUS_PCT}%"
  echo "  master-tracker: ${TRACKER_PCT}%"

  if [ "$PCT_DIFF" -gt 10 ]; then
    echo "  ⚠ WARN: ${PCT_DIFF}% divergence (threshold: 10%)"
  else
    echo "  ✓ PASS: Within 10% tolerance"
  fi
  echo ""
fi

# Check 3: Header count vs actual (STATUS.md)
HEADER_COUNT=$(grep -oiP '(?:total\s*tasks?\s*[:=]\s*)(\d+)' "$STATUS_FILE" 2>/dev/null | grep -oP '\d+' | head -1)
if [ -n "$HEADER_COUNT" ]; then
  echo "Header Verification (STATUS.md):"
  echo "  Header claims: $HEADER_COUNT tasks"
  echo "  Actual count:  $STATUS_TOTAL checkboxes"
  if [ "$HEADER_COUNT" -ne "$STATUS_TOTAL" ]; then
    echo "  ✗ FAIL: Header count does not match actual checkboxes"
    FAIL=1
  else
    echo "  ✓ PASS: Header matches actual"
  fi
  echo ""
fi

# Summary
echo "---"
if [ "$FAIL" -gt 0 ]; then
  echo "RESULT: FAIL — Fix discrepancies before proceeding."
  exit 1
else
  echo "RESULT: PASS — STATUS.md and master-tracker are in sync."
  exit 0
fi
