# /review:init — Scaffold the Design Review System

Scaffolds the design review portal into the current project. Creates the review directory, copies templates, and generates the runtime configuration from project specs.

## Prerequisites

- Project intake complete (Step 1-2)
- Screen specs exist (Step 6-7) — used to populate screen definitions and element lists
- Design variations exist in `{{DESIGNS_PATH}}` (generated via `/design-generate` or manually created)

## Configuration

- **Kit templates:** `Master-Starter-Kit/39-review-system/templates/`
- **Designs path:** `{{DESIGNS_PATH}}` (default: `designs/lookfeels/`)
- **Output path:** `{{REVIEW_OUTPUT_PATH}}` (default: `design-review/`)

## Steps

### Step 1: Check Prerequisites

```bash
ls {{DESIGNS_PATH}} 2>/dev/null
ls dev_docs/specs/screen-*.md 2>/dev/null
```

If no design files exist, warn:
> "No design variations found in {{DESIGNS_PATH}}. Generate them first with `/design-generate`, or create HTML mockups manually in style-01/, style-02/, etc."

If no screen specs exist, warn but continue (screens can be configured manually).

### Step 2: Auto-Detect Screens from Specs

Read all screen spec files in `dev_docs/specs/`:
```
dev_docs/specs/screen-*.md
```

For each screen spec, extract:
- Screen key (from filename: `screen-dashboard.md` → `dashboard`)
- Screen label (from spec title)
- Expected HTML filename (`dashboard.html`)
- Assign a color from the palette: `#6366f1`, `#10b981`, `#f59e0b`, `#ef4444`, `#8b5cf6`, `#06b6d4`, `#ec4899`, `#f97316`

### Step 3: Auto-Detect Styles

Scan `{{DESIGNS_PATH}}` for `style-*` directories:
```bash
ls -d {{DESIGNS_PATH}}/style-*/ 2>/dev/null
```

Generate style definitions from directory names:
- `style-01/` → `{ key: "style-01", label: "Style 01" }`
- `style-02/` → `{ key: "style-02", label: "Style 02" }`

### Step 4: Extract Element Tags from Screen Specs

For each screen, read its spec and identify the main UI regions/elements:
- Look for section headers, component lists, layout descriptions
- Extract 4-8 element tags per screen
- Example: Dashboard → `["header", "kpi-cards", "chart", "sidebar", "activity-feed", "quick-actions"]`

### Step 5: Create Output Directory

```bash
mkdir -p {{REVIEW_OUTPUT_PATH}}
mkdir -p {{REVIEW_OUTPUT_PATH}}/thumbs
```

### Step 6: Generate review-config.json

Create `{{REVIEW_OUTPUT_PATH}}/review-config.json` with the detected configuration:

```json
{
  "projectName": "{{PROJECT_NAME}}",
  "projectSlug": "{{PROJECT_SLUG}}",
  "designsPath": "../{{DESIGNS_PATH}}",
  "thumbsPath": "thumbs/",
  "width": 1280,
  "height": 720,
  "screens": [/* detected screens */],
  "styles": [/* detected styles */],
  "elementsPerScreen": {/* extracted elements */}
}
```

### Step 7: Copy and Populate Templates

1. Copy `index.html` from kit templates to `{{REVIEW_OUTPUT_PATH}}/index.html`
2. Copy `review.html` from kit templates to `{{REVIEW_OUTPUT_PATH}}/review.html`
3. Copy `generate-thumbnails.mjs` to `{{REVIEW_OUTPUT_PATH}}/generate-thumbnails.mjs`
4. Copy `gen-thumbs.sh` to `{{REVIEW_OUTPUT_PATH}}/gen-thumbs.sh`

In both HTML files, replace the `CONFIG` object with the actual configuration from Step 6.

### Step 8: Update STATE BLOCK

Add to CONFIG in STATE BLOCK:
```
REVIEW_SYSTEM: {
  enabled: true,
  designsPath: "{{DESIGNS_PATH}}",
  outputPath: "{{REVIEW_OUTPUT_PATH}}",
  screens: [/* count */],
  styles: [/* count */],
  totalDesigns: {screens * styles}
}
```

### Step 9: Present Summary

```
DESIGN REVIEW SYSTEM INITIALIZED
══════════════════════════════════
Output:     {{REVIEW_OUTPUT_PATH}}/
Screens:    {N} ({list of screen names})
Styles:     {N} ({list of style names})
Total:      {N} design variations to review
Elements:   {N} tags across all screens

Files created:
  {{REVIEW_OUTPUT_PATH}}/index.html           ← Open in browser to start reviewing
  {{REVIEW_OUTPUT_PATH}}/review.html          ← Full-screen reviewer (opened from gallery)
  {{REVIEW_OUTPUT_PATH}}/review-config.json   ← Runtime configuration
  {{REVIEW_OUTPUT_PATH}}/generate-thumbnails.mjs
  {{REVIEW_OUTPUT_PATH}}/gen-thumbs.sh

Next steps:
  1. Run /review:thumbs to generate thumbnail screenshots
  2. Open {{REVIEW_OUTPUT_PATH}}/index.html in your browser
  3. Review all designs, then run /review:export
```

## Notes

- The review system is self-contained — no npm install needed for the HTML pages.
- Thumbnail generation requires Playwright (`npm install playwright` in the project).
- If screens change after init, re-run `/review:init` to update the configuration.
- The review data lives in localStorage, keyed by project slug. Clearing browser data clears reviews.
