#!/usr/bin/env bash
# ===========================================================================
# depth-scorer.sh — Score generated specs against depth requirements
# Run from the project root:
#   bash path/to/Master-Starter-Kit/scripts/depth-scorer.sh [dev_docs_path]
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

score_file() {
  local file="$1"
  local min_score="$2"
  local label="$3"
  local score=0

  if [ ! -f "$file" ]; then
    return 0
  fi

  local word_count heading_count bullet_count code_block_count table_count

  word_count=$(wc -w < "$file" | tr -d ' ')
  heading_count=$(grep -c '^##' "$file" 2>/dev/null || echo "0")
  bullet_count=$(grep -c '^[[:space:]]*[-*]' "$file" 2>/dev/null || echo "0")
  code_block_count=$(grep -c '```' "$file" 2>/dev/null || echo "0")
  code_block_count=$((code_block_count / 2))
  table_count=$(grep -c '^|' "$file" 2>/dev/null || echo "0")

  # Scoring rubric (out of 10):
  # Words: 0-99=1, 100-299=2, 300-499=3, 500-999=4, 1000+=5
  # Structure (headings+bullets+tables): 0-4=1, 5-9=2, 10-19=3, 20-39=4, 40+=5
  local content_score=0
  if [ "$word_count" -ge 1000 ]; then content_score=5
  elif [ "$word_count" -ge 500 ]; then content_score=4
  elif [ "$word_count" -ge 300 ]; then content_score=3
  elif [ "$word_count" -ge 100 ]; then content_score=2
  else content_score=1; fi

  local structure=$((heading_count + bullet_count + table_count))
  local structure_score=0
  if [ "$structure" -ge 40 ]; then structure_score=5
  elif [ "$structure" -ge 20 ]; then structure_score=4
  elif [ "$structure" -ge 10 ]; then structure_score=3
  elif [ "$structure" -ge 5 ]; then structure_score=2
  else structure_score=1; fi

  score=$((content_score + structure_score))

  local filename
  filename=$(basename "$file")
  if [ "$score" -ge "$min_score" ]; then
    pass "$label: $filename — $score/10 (words:$word_count, headings:$heading_count, bullets:$bullet_count, code:$code_block_count)"
  elif [ "$score" -ge $((min_score - 1)) ]; then
    warn "$label: $filename — $score/10 (close to threshold $min_score/10)"
  else
    fail "$label: $filename — $score/10 (below threshold $min_score/10)"
  fi
}

# -------------------------------------------------------------------
header "Service Specs (threshold: 8/10)"
# -------------------------------------------------------------------

service_spec_count=0
if [ -d "$DOCS_ROOT/specs/services" ]; then
  for spec in "$DOCS_ROOT"/specs/services/*-spec.md; do
    [ -f "$spec" ] || continue
    score_file "$spec" 8 "Service spec"
    service_spec_count=$((service_spec_count + 1))
  done
fi

# Also check specs/ root and services/ for different naming conventions
if [ -d "$DOCS_ROOT/specs" ]; then
  for spec in "$DOCS_ROOT"/specs/*-spec.md; do
    [ -f "$spec" ] || continue
    score_file "$spec" 8 "Service spec"
    service_spec_count=$((service_spec_count + 1))
  done
fi

if [ "$service_spec_count" -eq 0 ]; then
  warn "No service spec files found to score"
fi

# -------------------------------------------------------------------
header "Screen Specs (threshold: 7/10)"
# -------------------------------------------------------------------

screen_spec_count=0
for dir in "$DOCS_ROOT/specs/screens" "$DOCS_ROOT/specs/ui"; do
  if [ -d "$dir" ]; then
    for spec in "$dir"/*.md; do
      [ -f "$spec" ] || continue
      score_file "$spec" 7 "Screen spec"
      screen_spec_count=$((screen_spec_count + 1))
    done
  fi
done

if [ "$screen_spec_count" -eq 0 ]; then
  warn "No screen spec files found to score"
fi

# -------------------------------------------------------------------
header "Service Hubs (threshold: 6/10)"
# -------------------------------------------------------------------

hub_count=0
if [ -d "$DOCS_ROOT/services" ]; then
  for hub in "$DOCS_ROOT"/services/*.hub.md; do
    [ -f "$hub" ] || continue
    score_file "$hub" 6 "Service hub"
    hub_count=$((hub_count + 1))
  done
fi

if [ "$hub_count" -eq 0 ]; then
  warn "No service hub files found to score"
fi

# -------------------------------------------------------------------
header "Task Files (threshold: 4/10)"
# -------------------------------------------------------------------

task_count=0
if [ -d "$DOCS_ROOT/tasks" ]; then
  for task in $(find "$DOCS_ROOT/tasks" -name "*.md" 2>/dev/null | head -20); do
    [ -f "$task" ] || continue
    score_file "$task" 4 "Task file"
    task_count=$((task_count + 1))
  done
fi

if [ "$task_count" -eq 0 ]; then
  warn "No task files found to score"
fi

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------

total=$((service_spec_count + screen_spec_count + hub_count + task_count))
printf "\n\033[1m============================================\033[0m\n"
printf "\033[1m  DEPTH SCORING SUMMARY\033[0m\n"
printf "\033[1m============================================\033[0m\n"
printf "  Files scored: %d\n" "$total"
printf "  \033[32mPASS: %d\033[0m\n" "$PASS"
printf "  \033[31mFAIL: %d\033[0m\n" "$FAIL"
printf "  \033[33mWARN: %d\033[0m\n" "$WARN"
printf "\033[1m============================================\033[0m\n"

if [ "$FAIL" -eq 0 ]; then
  printf "\n  \033[32m✓ All specs meet depth requirements.\033[0m\n\n"
  exit 0
else
  printf "\n  \033[31m✗ %d spec(s) below depth threshold. Regenerate or expand.\033[0m\n\n" "$FAIL"
  exit 1
fi
