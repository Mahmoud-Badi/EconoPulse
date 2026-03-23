---
generated_date: {{GENERATED_DATE}}
---

# Playwright Screenshot Capture Script

Template for the automated screenshot capture process. The `/capture-screenshots` skill reads this and executes using Playwright MCP tools.

---

## Prerequisites

- Playwright MCP server configured and running
- Dev server running at `http://localhost:{{FRONTEND_PORT}}`
- Seed data loaded in the database
- User session available (for authenticated pages)

---

## Capture Workflow

### Step 1: Setup

```text
1. Verify dev server is running at http://localhost:{{FRONTEND_PORT}}
2. Navigate to login page
3. Authenticate with seed user: {{SEED_USER_EMAIL}} / {{SEED_USER_PASSWORD}}
4. Verify dashboard loads successfully
```

### Step 2: Read Manifest

Read `{{USER_DOCS_PATH}}/screenshot-manifest.md` and filter entries where:
- `status` = "pending"
- `platform` = "web"

### Step 3: Capture Loop

For each pending entry in the manifest:

```text
1. browser_navigate → {entry.url}
2. Execute setup steps (if any): {entry.setup}
3. browser_wait_for → {entry.wait_for} (timeout: 10s)
4. browser_resize → {entry.viewport} (default: 1280x720)
5. browser_take_screenshot → save to {entry.filepath}
6. If responsive capture needed:
   a. browser_resize → 375x812 (mobile viewport)
   b. browser_take_screenshot → save to {entry.filepath_mobile}
   c. browser_resize → 1280x720 (reset)
```

### Step 4: Update Files

For each successful capture:

```text
1. Update screenshot-manifest.md: entry.status = "captured", entry.captured_date = today
2. In the doc file containing the SCREENSHOT_PENDING marker:
   - Remove the <!-- SCREENSHOT_PENDING: ... --> comment
   - Verify the image path in the markdown image tag is correct
```

### Step 5: Report

```text
SCREENSHOT CAPTURE REPORT
=========================
Total pending: {N}
Captured: {X}
Failed: {Y}
  - {failed_entry_1}: {error_reason}
  - {failed_entry_2}: {error_reason}
Skipped: {Z} (non-web platform)

Files updated: {list of doc files where markers were removed}
```

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Page not found (404) | Log warning, mark as "failed" in manifest, continue |
| Selector not found (timeout) | Take screenshot anyway (captures the broken state for debugging), mark as "failed" |
| Auth redirect | Re-authenticate, retry the capture |
| Dev server down | Abort all captures, report "dev server not running" |

---

## Capture Settings

| Setting | Value |
|---------|-------|
| Default viewport (desktop) | 1280x720 |
| Mobile viewport | 375x812 |
| Screenshot format | PNG |
| Full page | No (viewport only, unless specified in manifest) |
| Wait timeout | 10 seconds |
| Animation wait | 500ms after load (let animations complete) |

---

## Authentication

For authenticated pages, the capture script needs an active session. Options:

1. **Cookie injection:** Set the auth cookie before navigating (fastest)
2. **Login flow:** Navigate to `/login`, fill credentials, submit, wait for redirect
3. **API token:** If the app supports token auth, set it in localStorage

The approach depends on `{{AUTH_STRATEGY}}`. The AI should determine the best method based on the project's auth implementation.
