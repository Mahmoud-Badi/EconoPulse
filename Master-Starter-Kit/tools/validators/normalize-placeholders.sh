#!/usr/bin/env bash
set -euo pipefail

# normalize-placeholders.sh
# Finds inconsistent placeholder syntax across all kit templates.
# Standard syntax: {{DOUBLE_BRACES}}
# Reports: {SINGLE_BRACES}, [BRACKETS], and other variants.

# Color support
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  GREEN='\033[0;32m'
  CYAN='\033[0;36m'
  NC='\033[0m'
else
  RED='' YELLOW='' GREEN='' CYAN='' NC=''
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${CYAN}Placeholder Syntax Checker${NC}"
echo "Kit root: $KIT_ROOT"
echo "Standard syntax: {{DOUBLE_BRACES}}"
echo "---"

ISSUES=0
CORRECT=0

# Find non-standard placeholder patterns in template files
# Excludes: node_modules, .git, examples (which may have intentional variants)
while IFS= read -r file; do
  rel_path="${file#$KIT_ROOT/}"

  # Skip non-template files (only check .md and .template.* files)
  case "$file" in
    *.md|*.template.*) ;;
    *) continue ;;
  esac

  # Skip example files (they may show variant syntax intentionally)
  case "$rel_path" in
    12-examples/*) continue ;;
    */node_modules/*) continue ;;
    .git/*) continue ;;
  esac

  file_issues=0

  # Check for {SINGLE_BRACE} patterns (not inside {{ }})
  # Match {UPPERCASE_WITH_UNDERSCORES} that isn't preceded or followed by another brace
  while IFS=: read -r line_num content; do
    # Skip lines that are code blocks or JSON
    case "$content" in
      *'```'*|*'"{'*|*'{'*'"'*) continue ;;
    esac

    echo -e "${YELLOW}WARN${NC} $rel_path:$line_num — Single-brace placeholder: $content"
    ((file_issues++)) || true
  done < <(grep -n '[^{]{[A-Z][A-Z_]*}[^}]' "$file" 2>/dev/null || true)

  # Check for [BRACKET_PLACEHOLDERS] that look like template variables
  while IFS=: read -r line_num content; do
    # Skip markdown link syntax [text](url) and checkbox [ ]
    case "$content" in
      *'](http'*|*'](/'*|*'](.'*|*'[ ]'*|*'[x]'*|*'[X]'*) continue ;;
    esac

    echo -e "${YELLOW}WARN${NC} $rel_path:$line_num — Bracket placeholder: $content"
    ((file_issues++)) || true
  done < <(grep -n '\[[A-Z][A-Z_]*\]' "$file" 2>/dev/null || true)

  if [[ $file_issues -gt 0 ]]; then
    ((ISSUES += file_issues)) || true
  fi

  # Count correct {{PLACEHOLDER}} usage
  file_correct=$(grep -c '{{[A-Z][A-Z_]*}}' "$file" 2>/dev/null || echo "0")
  ((CORRECT += file_correct)) || true

done < <(find "$KIT_ROOT" -type f \( -name "*.md" -o -name "*.template.*" \) -not -path "*/.git/*" -not -path "*/node_modules/*" 2>/dev/null)

echo "---"
echo -e "Correct {{PLACEHOLDER}} usage: ${GREEN}${CORRECT}${NC}"
echo -e "Non-standard variants found: ${YELLOW}${ISSUES}${NC}"

if [[ $ISSUES -gt 0 ]]; then
  echo ""
  echo -e "${YELLOW}To fix:${NC} Replace single-brace {VAR} and bracket [VAR] with {{VAR}}"
  echo "Check PLACEHOLDER-REGISTRY.md for the canonical list of placeholder names."
  exit 1
else
  echo -e "${GREEN}All placeholders use standard {{DOUBLE_BRACE}} syntax.${NC}"
  exit 0
fi
