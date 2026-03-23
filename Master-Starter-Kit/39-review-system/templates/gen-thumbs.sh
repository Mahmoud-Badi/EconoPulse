#!/usr/bin/env bash

# gen-thumbs.sh — Generate design thumbnails using Playwright CLI
#
# Alternative to generate-thumbnails.mjs for environments where
# you prefer a shell script over Node.js.
#
# Prerequisites:
#   npm install -g playwright
#   npx playwright install chromium
#
# Usage:
#   ./gen-thumbs.sh [designs_path] [thumbs_path]
#
# Defaults:
#   designs_path = designs/lookfeels/
#   thumbs_path  = design-review/thumbs/

set -euo pipefail

DESIGNS_PATH="${1:-designs/lookfeels/}"
THUMBS_PATH="${2:-design-review/thumbs/}"
WIDTH=1280
HEIGHT=720

echo ""
echo "Design Review — Thumbnail Generator (shell)"
echo "═══════════════════════════════════════════"
echo "Designs path: $DESIGNS_PATH"
echo "Output path:  $THUMBS_PATH"
echo "Viewport:     ${WIDTH}x${HEIGHT}"
echo ""

# Check prerequisites
if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Install Node.js first."
  exit 1
fi

# Create thumbs directory
mkdir -p "$THUMBS_PATH"

GENERATED=0
SKIPPED=0
FAILED=0

# Find all style directories
for style_dir in "$DESIGNS_PATH"/style-*/; do
  [ -d "$style_dir" ] || continue

  style_key=$(basename "$style_dir")
  style_label=$(echo "$style_key" | sed 's/style-0*/Style /')

  # Find all HTML files in this style directory
  for html_file in "$style_dir"*.html; do
    [ -f "$html_file" ] || continue

    screen_key=$(basename "$html_file" .html)
    thumb_file="${THUMBS_PATH}/${style_key}_${screen_key}.png"
    label="${style_label} / ${screen_key}"

    # Convert to absolute file:// URL
    abs_path=$(cd "$(dirname "$html_file")" && pwd)/$(basename "$html_file")
    file_url="file://${abs_path}"

    # Use Playwright CLI to screenshot
    if npx playwright screenshot \
      --browser chromium \
      --viewport-size "${WIDTH},${HEIGHT}" \
      --wait-for-timeout 500 \
      "$file_url" \
      "$thumb_file" 2>/dev/null; then
      echo "  OK    $label → $(basename "$thumb_file")"
      GENERATED=$((GENERATED + 1))
    else
      echo "  FAIL  $label"
      FAILED=$((FAILED + 1))
    fi
  done
done

echo ""
echo "───────────────────────────────────"
echo "Generated: $GENERATED  Skipped: $SKIPPED  Failed: $FAILED"
echo "Thumbnails saved to: $THUMBS_PATH"
echo ""

[ "$FAILED" -eq 0 ] || exit 1
