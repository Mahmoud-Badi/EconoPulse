# /capture-screenshots

Capture all pending screenshots for user documentation.

## Instructions

Read and follow the `capture-screenshots` skill at `.claude/skills/capture-screenshots/SKILL.md`.

Run this command **after the design phase is complete** and the UI is in its final state.

## Prerequisites

- Dev server running (`{{DEV_CMD}}`)
- Seed data loaded
- Playwright MCP available (for web screenshots)
<!-- IF {{HAS_MOBILE}} == "true" -->
- iOS Simulator available (for iOS screenshots)
- Android Emulator available (for Android screenshots)
<!-- ENDIF -->

## Quick Reference

1. Read `user_docs/screenshot-manifest.md` for all pending entries
2. Capture web screenshots via Playwright
<!-- IF {{HAS_MOBILE}} == "true" -->
3. Capture iOS screenshots via Simulator
4. Capture Android screenshots via Emulator
5. Capture App Store screenshots at required sizes
<!-- ENDIF -->
6. Update manifest and doc files (remove SCREENSHOT_PENDING markers)
7. Generate capture report
