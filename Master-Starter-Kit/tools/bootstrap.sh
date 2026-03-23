#!/usr/bin/env bash
# Quick check: if kit is already installed, exit silently.
# Otherwise run the full installer.
[ -f "$HOME/.claude/skills/kit/SKILL.md" ] && exit 0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/install.sh"
