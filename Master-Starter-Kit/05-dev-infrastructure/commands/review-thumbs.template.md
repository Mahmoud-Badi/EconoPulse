# /review:thumbs — Generate Design Thumbnails

Runs Playwright to screenshot all HTML design variations and save them as thumbnails for the review gallery.

## Prerequisites

- Review system initialized (`/review:init` completed)
- Playwright installed (`npm install playwright` or `npx playwright install chromium`)
- Design HTML files exist in `{{DESIGNS_PATH}}`

## Configuration

- **Review path:** `{{REVIEW_OUTPUT_PATH}}` (default: `design-review/`)
- **Config file:** `{{REVIEW_OUTPUT_PATH}}/review-config.json`

## Steps

### Step 1: Verify Playwright

```bash
npx playwright --version 2>/dev/null || echo "Playwright not installed"
```

If not installed:
```bash
npm install --save-dev playwright
npx playwright install chromium
```

### Step 2: Run Thumbnail Generator

**Option A — Node.js script (recommended):**
```bash
node {{REVIEW_OUTPUT_PATH}}/generate-thumbnails.mjs --config {{REVIEW_OUTPUT_PATH}}/review-config.json
```

**Option B — Shell script:**
```bash
chmod +x {{REVIEW_OUTPUT_PATH}}/gen-thumbs.sh
bash {{REVIEW_OUTPUT_PATH}}/gen-thumbs.sh {{DESIGNS_PATH}} {{REVIEW_OUTPUT_PATH}}/thumbs
```

### Step 3: Verify Output

```bash
ls {{REVIEW_OUTPUT_PATH}}/thumbs/*.png | wc -l
```

Expected: `{screens} x {styles}` thumbnail files.

### Step 4: Report

```
THUMBNAILS GENERATED
════════════════════
Generated: {N} thumbnails
Skipped:   {N} (missing HTML files)
Failed:    {N} (errors)

Output: {{REVIEW_OUTPUT_PATH}}/thumbs/

{If any skipped or failed, list them with reasons}

Next: Open {{REVIEW_OUTPUT_PATH}}/index.html in your browser to start reviewing.
```

## Notes

- Thumbnails are captured at 1280x720 viewport by default (configurable in review-config.json).
- Re-run this command any time design files are updated.
- Each thumbnail is ~100-300KB. Total disk usage is typically under 10MB for 20-30 designs.
- The generator waits 500ms after page load for fonts/images. Increase this in `generate-thumbnails.mjs` if designs have slow-loading assets.
- On Windows, the file:// URLs use forward slashes automatically.
