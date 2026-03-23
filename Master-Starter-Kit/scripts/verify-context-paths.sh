#!/usr/bin/env bash

# verify-context-paths.sh — Task File Context Path Verifier
#
# Extracts file paths from task file "Context Files" sections and verifies
# each path exists on disk. Outputs a report of missing paths.
#
# Usage: bash scripts/verify-context-paths.sh [tasks_dir] [project_root]
#   tasks_dir:    Path to task files directory (default: ./dev_docs/tasks)
#   project_root: Path to project root for path verification (default: .)
#
# Exit codes:
#   0 = PASS (all paths exist or marked as scaffold-needed)
#   1 = FAIL (missing paths found with no scaffold plan)
#   2 = ERROR (task directory not found)

TASKS_DIR="${1:-./dev_docs/tasks}"
PROJECT_ROOT="${2:-.}"

echo "=== Task File Context Path Verification ==="
echo ""

if [ ! -d "$TASKS_DIR" ]; then
  echo "ERROR: Tasks directory not found at $TASKS_DIR"
  echo "  → Generate task files first (Step 8)"
  exit 2
fi

TASK_COUNT=0
PATH_COUNT=0
MISSING_COUNT=0
SCAFFOLD_COUNT=0
MISSING_PATHS=()

# Process each task file
for task_file in "$TASKS_DIR"/*.md; do
  [ -f "$task_file" ] || continue
  TASK_COUNT=$((TASK_COUNT + 1))

  # Extract paths from "Context Files", "File Plan", "Files to Create/Modify" sections
  # Look for lines that look like file paths (contain / and a file extension, or end with /)
  in_context_section=false
  while IFS= read -r line; do
    # Detect context/file sections
    if echo "$line" | grep -qiP '(context files|file plan|files to (create|modify)|referenced files)'; then
      in_context_section=true
      continue
    fi

    # Exit section on next heading or empty line after content
    if $in_context_section && echo "$line" | grep -qP '^#{1,4}\s'; then
      in_context_section=false
      continue
    fi

    if $in_context_section; then
      # Extract file paths — match patterns like `path/to/file.ext` or backtick-wrapped paths
      paths=$(echo "$line" | grep -oP '`([^`]+\.[a-zA-Z]{1,10})`' | tr -d '`')
      if [ -z "$paths" ]; then
        paths=$(echo "$line" | grep -oP '(?:^|\s)([a-zA-Z0-9_./-]+\.[a-zA-Z]{1,10})(?:\s|$)' | tr -d ' ')
      fi

      for filepath in $paths; do
        [ -z "$filepath" ] && continue
        PATH_COUNT=$((PATH_COUNT + 1))

        # Check if path exists relative to project root
        full_path="$PROJECT_ROOT/$filepath"
        if [ ! -e "$full_path" ]; then
          # Check if it's a path that would be created by a later step
          # (contains patterns like src/, packages/, apps/ suggesting scaffold)
          if echo "$filepath" | grep -qP '^(src|packages|apps|lib|components|services)/'; then
            SCAFFOLD_COUNT=$((SCAFFOLD_COUNT + 1))
            MISSING_PATHS+=("SCAFFOLD: $filepath (in $(basename "$task_file"))")
          else
            MISSING_COUNT=$((MISSING_COUNT + 1))
            MISSING_PATHS+=("MISSING:  $filepath (in $(basename "$task_file"))")
          fi
        fi
      done
    fi
  done < "$task_file"
done

# Output
echo "Scanned: $TASK_COUNT task files"
echo "Paths found: $PATH_COUNT"
echo "Paths verified: $((PATH_COUNT - MISSING_COUNT - SCAFFOLD_COUNT))"
echo "Scaffold needed: $SCAFFOLD_COUNT"
echo "Missing (no plan): $MISSING_COUNT"
echo ""

if [ ${#MISSING_PATHS[@]} -gt 0 ]; then
  echo "Details:"
  echo ""
  for entry in "${MISSING_PATHS[@]}"; do
    echo "  $entry"
  done
  echo ""
fi

# Recommendations
if [ "$SCAFFOLD_COUNT" -gt 0 ]; then
  echo "RECOMMENDATION: Add a prerequisite task 'Scaffold codebase structure' that creates:"
  for entry in "${MISSING_PATHS[@]}"; do
    if echo "$entry" | grep -q '^SCAFFOLD:'; then
      filepath=$(echo "$entry" | sed 's/SCAFFOLD: \(.*\) (in .*/\1/')
      dir=$(dirname "$filepath")
      echo "  - $dir/"
    fi
  done | sort -u
  echo ""
fi

# Result
echo "---"
if [ "$MISSING_COUNT" -gt 0 ]; then
  echo "RESULT: FAIL — $MISSING_COUNT path(s) missing with no scaffold plan."
  echo "  → Fix: Either create the missing files/directories or add scaffold tasks."
  exit 1
elif [ "$SCAFFOLD_COUNT" -gt 0 ]; then
  echo "RESULT: PASS WITH SCAFFOLDING — $SCAFFOLD_COUNT path(s) need a scaffold task."
  echo "  → Ensure a 'Scaffold codebase structure' task exists before dependent tasks."
  exit 0
else
  echo "RESULT: PASS — All $PATH_COUNT context paths verified."
  exit 0
fi
