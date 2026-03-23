#!/usr/bin/env bash
# ===========================================================================
# lint-docs.sh — Check generated docs for broken links and consistency
# Run from the project root:
#   bash path/to/Master-Starter-Kit/scripts/lint-docs.sh [dev_docs_path]
# ===========================================================================

set -euo pipefail

DOCS_ROOT="${1:-dev_docs}"
PASS=0
FAIL=0
WARN=0

pass() { PASS=$((PASS + 1)); printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { FAIL=$((FAIL + 1)); printf "  \033[31mFAIL\033[0m  %s\n" "$1"; }
warn() { WARN=$((WARN + 1)); printf "  \033[33mWARN\033[0m  %s\n" "$1"; }
header() { printf "\n\033[1m=== %s ===\033[0m\n" "$1"; }

if [ ! -d "$DOCS_ROOT" ]; then
  printf "\033[31mError: %s not found.\033[0m\n" "$DOCS_ROOT"
  exit 1
fi

# -------------------------------------------------------------------
header "1. Broken Internal Links"
# -------------------------------------------------------------------

broken_count=0
checked_count=0

while IFS= read -r file; do
  dir=$(dirname "$file")
  # Extract relative markdown links (not URLs, not anchors)
  grep -oP '\[.*?\]\((?!http|#|mailto)(.*?)\)' "$file" 2>/dev/null | grep -oP '\(([^)]+)\)' | tr -d '()' | while read -r ref; do
    checked_count=$((checked_count + 1))
    # Remove anchor from ref
    ref_path=$(echo "$ref" | sed 's/#.*//')
    [ -z "$ref_path" ] && continue
    # Check relative to the file's directory and to project root
    if [ ! -f "$dir/$ref_path" ] && [ ! -f "$ref_path" ] && [ ! -d "$dir/$ref_path" ] && [ ! -d "$ref_path" ]; then
      broken_count=$((broken_count + 1))
      if [ "$broken_count" -le 10 ]; then
        printf "       %s → %s\n" "$(basename "$file")" "$ref_path"
      fi
    fi
  done
done < <(find "$DOCS_ROOT" -name "*.md" 2>/dev/null)

if [ "$broken_count" -eq 0 ]; then
  pass "No broken internal links found"
else
  fail "Found $broken_count broken internal link(s)"
fi

# -------------------------------------------------------------------
header "2. Empty Files"
# -------------------------------------------------------------------

empty_count=0
while IFS= read -r file; do
  word_count=$(wc -w < "$file" | tr -d ' ')
  if [ "$word_count" -lt 5 ]; then
    empty_count=$((empty_count + 1))
    if [ "$empty_count" -le 5 ]; then
      printf "       %s (%d words)\n" "$file" "$word_count"
    fi
  fi
done < <(find "$DOCS_ROOT" -name "*.md" 2>/dev/null)

if [ "$empty_count" -eq 0 ]; then
  pass "No empty or near-empty files"
else
  warn "Found $empty_count file(s) with fewer than 5 words"
fi

# -------------------------------------------------------------------
header "3. Duplicate Headings Within Files"
# -------------------------------------------------------------------

dup_heading_files=0
while IFS= read -r file; do
  dup_count=$(grep '^## ' "$file" 2>/dev/null | sort | uniq -d | wc -l | tr -d ' ')
  if [ "$dup_count" -gt 0 ]; then
    dup_heading_files=$((dup_heading_files + 1))
    if [ "$dup_heading_files" -le 5 ]; then
      printf "       %s has %d duplicate heading(s)\n" "$(basename "$file")" "$dup_count"
    fi
  fi
done < <(find "$DOCS_ROOT" -name "*.md" 2>/dev/null)

if [ "$dup_heading_files" -eq 0 ]; then
  pass "No duplicate headings found"
else
  warn "Found $dup_heading_files file(s) with duplicate headings"
fi

# -------------------------------------------------------------------
header "4. Orphaned Files (not referenced by any index)"
# -------------------------------------------------------------------

# Build list of all files referenced from STATUS.md, service-matrix, screen-matrix
referenced_files=$(mktemp)
for index_file in "$DOCS_ROOT/STATUS.md" "$DOCS_ROOT/completeness/service-matrix.md" "$DOCS_ROOT/completeness/screen-matrix.md"; do
  if [ -f "$index_file" ]; then
    grep -oP '\[.*?\]\((.*?)\)' "$index_file" 2>/dev/null | grep -oP '\(([^)]+)\)' | tr -d '()' >> "$referenced_files"
  fi
done

orphan_count=0
total_files=$(find "$DOCS_ROOT" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

# Only check if we have index files to compare against
if [ -s "$referenced_files" ]; then
  pass "Index files found for orphan checking ($total_files total docs)"
else
  warn "No index files found — cannot check for orphaned files"
fi

rm -f "$referenced_files"

# -------------------------------------------------------------------
header "5. Heading Hierarchy"
# -------------------------------------------------------------------

bad_hierarchy=0
while IFS= read -r file; do
  # Check if file starts with # (H1) — every doc should have exactly one H1
  h1_count=$(grep -c '^# ' "$file" 2>/dev/null || echo "0")
  if [ "$h1_count" -eq 0 ]; then
    bad_hierarchy=$((bad_hierarchy + 1))
    if [ "$bad_hierarchy" -le 5 ]; then
      printf "       %s — missing H1 heading\n" "$(basename "$file")"
    fi
  elif [ "$h1_count" -gt 1 ]; then
    bad_hierarchy=$((bad_hierarchy + 1))
    if [ "$bad_hierarchy" -le 5 ]; then
      printf "       %s — multiple H1 headings (%d)\n" "$(basename "$file")" "$h1_count"
    fi
  fi
done < <(find "$DOCS_ROOT" -name "*.md" 2>/dev/null)

if [ "$bad_hierarchy" -eq 0 ]; then
  pass "All files have proper heading hierarchy"
else
  warn "Found $bad_hierarchy file(s) with heading issues"
fi

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

printf "\n\033[1m============================================\033[0m\n"
printf "\033[1m  DOCUMENTATION LINT SUMMARY\033[0m\n"
printf "\033[1m============================================\033[0m\n"
printf "  Files scanned: %d\n" "$total_files"
printf "  \033[32mPASS: %d\033[0m\n" "$PASS"
printf "  \033[31mFAIL: %d\033[0m\n" "$FAIL"
printf "  \033[33mWARN: %d\033[0m\n" "$WARN"
printf "\033[1m============================================\033[0m\n"

if [ "$FAIL" -eq 0 ]; then
  printf "\n  \033[32m✓ Documentation lint passed.\033[0m\n\n"
  exit 0
else
  printf "\n  \033[31m✗ Found %d issue(s) to fix.\033[0m\n\n" "$FAIL"
  exit 1
fi
