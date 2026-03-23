---
generated_date: {{GENERATED_DATE}}
last_capture_run: null
total_pending: 0
total_captured: 0
total_failed: 0
---

# Screenshot Manifest

Index of all screenshots needed for {{PROJECT_NAME}} user documentation. Updated by `/document-feature` (adds entries) and `/capture-screenshots` (captures and marks complete).

---

## Web Screenshots

| # | Feature | Filename | URL | Wait For | Viewport | Setup | Status | Captured Date |
|---|---------|----------|-----|----------|----------|-------|--------|---------------|
| 1 | {{FEATURE_SLUG}} | {{FILENAME}}.png | {{URL}} | {{SELECTOR}} | 1280x720 | {{SETUP_INSTRUCTIONS}} | pending | — |

---

<!-- IF {{HAS_MOBILE}} == "true" -->

## iOS Screenshots

| # | Feature | Filename | Screen | Device | Orientation | Setup | Status | Captured Date |
|---|---------|----------|--------|--------|-------------|-------|--------|---------------|
| 1 | {{FEATURE_SLUG}} | {{FILENAME}}.png | {{SCREEN_NAME}} | iPhone 15 (390x844) | portrait | {{SETUP_INSTRUCTIONS}} | pending | — |

---

## Android Screenshots

| # | Feature | Filename | Screen | Device | Orientation | Setup | Status | Captured Date |
|---|---------|----------|--------|--------|-------------|-------|--------|---------------|
| 1 | {{FEATURE_SLUG}} | {{FILENAME}}.png | {{SCREEN_NAME}} | Pixel 7 (412x915) | portrait | {{SETUP_INSTRUCTIONS}} | pending | — |

---

## App Store Screenshots

| # | Screen | Description | Key Message | iOS Size | Android Size | Status |
|---|--------|-------------|-------------|----------|-------------|--------|
| 1 | {{STORE_SCREENSHOT_SCREEN}} | {{DESCRIPTION}} | {{KEY_MESSAGE}} | 1290x2796 | 1080x1920 | pending |

<!-- ENDIF -->

---

## Status Values

- `pending` — Screenshot placeholder exists, not yet captured
- `captured` — Screenshot successfully taken and saved
- `failed` — Capture attempted but failed (see error log)
- `skipped` — Intentionally skipped (e.g., feature not yet built, UI not ready)
- `outdated` — UI has changed since capture, needs recapture

---

## Summary

```text
Web:     {{WEB_CAPTURED}}/{{WEB_TOTAL}} captured
iOS:     {{IOS_CAPTURED}}/{{IOS_TOTAL}} captured
Android: {{ANDROID_CAPTURED}}/{{ANDROID_TOTAL}} captured
Store:   {{STORE_CAPTURED}}/{{STORE_TOTAL}} captured
─────────────────────────────────────
Total:   {{TOTAL_CAPTURED}}/{{TOTAL}} captured ({{COVERAGE_PERCENT}}%)
```

---

<!-- Template notes for the AI builder:

When adding entries:
1. Use /document-feature — it auto-adds to this manifest
2. One row per screenshot (not per feature)
3. Include specific setup instructions (what filters, what state)
4. Use descriptive filenames (see screenshot-guide.md naming convention)

When capturing:
1. Run /capture-screenshots to process all "pending" entries
2. Failed entries stay as "failed" — fix the issue and re-run
3. "outdated" entries need recapture after UI changes
-->
