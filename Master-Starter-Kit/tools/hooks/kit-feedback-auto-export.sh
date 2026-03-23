#!/usr/bin/env bash
# Kit Feedback Auto-Export Hook (Stop event)
#
# Runs automatically when a session ends. Checks for pending feedback
# candidates in dev_docs/kit-feedback/pending/, bundles them into
# .kit-feedback.json, and auto-commits to the project's git repo.
#
# This hook ensures feedback reaches the kit without ANY manual steps.
# Contributors never need to run /kit-feedback export or send files.

set -euo pipefail

PENDING_DIR="dev_docs/kit-feedback/pending"
EXPORTED_DIR="dev_docs/kit-feedback/exported"
FEEDBACK_FILE=".kit-feedback.json"
CONFIG_FILE=".kit-feedback-config.json"

# Only run if we're in a project with kit-feedback set up
if [ ! -d "$PENDING_DIR" ]; then
  exit 0
fi

# Count pending candidates
PENDING_COUNT=$(find "$PENDING_DIR" -name "KF-*.md" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$PENDING_COUNT" -eq 0 ]; then
  exit 0
fi

# Read config
KIT_VERSION="unknown"
CONTRIBUTOR="anonymous"
if [ -f "$CONFIG_FILE" ]; then
  KIT_VERSION=$(grep -o '"kit_version"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" 2>/dev/null | head -1 | sed 's/.*"kit_version"[[:space:]]*:[[:space:]]*"//' | sed 's/"//' || echo "unknown")
  CONTRIBUTOR=$(grep -o '"contributor_alias"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" 2>/dev/null | head -1 | sed 's/.*"contributor_alias"[[:space:]]*:[[:space:]]*"//' | sed 's/"//' || echo "anonymous")
fi

# Also try .kit-meta.json for version
if [ "$KIT_VERSION" = "unknown" ] && [ -f ".kit-meta.json" ]; then
  KIT_VERSION=$(grep -o '"kit_version"[[:space:]]*:[[:space:]]*"[^"]*"' ".kit-meta.json" 2>/dev/null | head -1 | sed 's/.*"kit_version"[[:space:]]*:[[:space:]]*"//' | sed 's/"//' || echo "unknown")
fi

TODAY=$(date +%Y-%m-%d)

# Build JSON candidates array
CANDIDATES="["
FIRST=true
for f in "$PENDING_DIR"/KF-*.md; do
  [ -f "$f" ] || continue

  # Extract frontmatter fields
  ID=$(sed -n 's/^id:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')
  CATEGORY=$(sed -n 's/^category:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')
  SEVERITY=$(sed -n 's/^severity:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')
  TECH=$(sed -n 's/^tech_stack:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')
  KIT_TARGET=$(sed -n 's/^kit_target:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')
  DATE=$(sed -n 's/^date:[[:space:]]*//p' "$f" | head -1 | tr -d '\r')

  # Extract markdown sections
  SUMMARY=$(sed -n '/^## Summary/,/^## /{/^## Summary/d;/^## /d;p;}' "$f" | sed '/^$/d' | head -3 | tr -d '\r' | tr '\n' ' ' | sed 's/["\]/\\&/g' | sed 's/<!--.*-->//g' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
  CONTEXT=$(sed -n '/^## Context/,/^## /{/^## Context/d;/^## /d;p;}' "$f" | sed '/^$/d' | head -5 | tr -d '\r' | tr '\n' ' ' | sed 's/["\]/\\&/g' | sed 's/<!--.*-->//g' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
  IMPROVEMENT=$(sed -n '/^## Improvement/,/^## /{/^## Improvement/d;/^## /d;p;}' "$f" | sed '/^$/d' | tr -d '\r' | tr '\n' ' ' | sed 's/["\]/\\&/g' | sed 's/<!--.*-->//g' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

  # Skip if summary is empty (unfilled template)
  if [ -z "$SUMMARY" ]; then
    continue
  fi

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    CANDIDATES="$CANDIDATES,"
  fi

  CANDIDATES="$CANDIDATES{\"id\":\"$ID\",\"category\":\"$CATEGORY\",\"severity\":\"$SEVERITY\",\"tech_stack\":$TECH,\"summary\":\"$SUMMARY\",\"context\":\"$CONTEXT\",\"improvement\":\"$IMPROVEMENT\",\"kit_target\":\"$KIT_TARGET\",\"date\":\"$DATE\"}"
done
CANDIDATES="$CANDIDATES]"

# Count actual candidates (with content)
ACTUAL_COUNT=$(echo "$CANDIDATES" | grep -o '"id"' | wc -l | tr -d ' ')

if [ "$ACTUAL_COUNT" -eq 0 ]; then
  exit 0
fi

# Write .kit-feedback.json
cat > "$FEEDBACK_FILE" << ENDJSON
{
  "kit_version": "$KIT_VERSION",
  "export_date": "$TODAY",
  "contributor_alias": "$CONTRIBUTOR",
  "candidate_count": $ACTUAL_COUNT,
  "candidates": $CANDIDATES
}
ENDJSON

# Move pending to exported
mkdir -p "$EXPORTED_DIR"
for f in "$PENDING_DIR"/KF-*.md; do
  [ -f "$f" ] || continue
  # Update status in the file
  sed -i 's/^status: pending/status: exported/' "$f" 2>/dev/null || true
  mv "$f" "$EXPORTED_DIR/" 2>/dev/null || true
done

# Auto-commit to git if we're in a git repo
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  git add "$FEEDBACK_FILE" "$EXPORTED_DIR/" 2>/dev/null || true
  git commit -m "chore: auto-export kit feedback ($ACTUAL_COUNT candidates)" --no-verify 2>/dev/null || true
fi

echo "Auto-exported $ACTUAL_COUNT kit feedback candidates to $FEEDBACK_FILE"
