# Review System Configuration

## CONFIG Fields

Add to the project CONFIG in STATE BLOCK during Step 13.1 (Design Review Setup):

```
REVIEW_SYSTEM: {
  enabled: {{REVIEW_ENABLED}},
  designsPath: "{{DESIGNS_PATH}}",
  outputPath: "{{REVIEW_OUTPUT_PATH}}",
  screens: {{SCREENS_ARRAY}},
  styles: "{{STYLES_MODE}}",
  elementsPerScreen: {{ELEMENTS_MAP}}
}
```

## Field Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether to scaffold the review system |
| `designsPath` | string | `"designs/lookfeels/"` | Where HTML design variations live, relative to project root |
| `outputPath` | string | `"design-review/"` | Where review portal files are placed |
| `screens` | array | `[]` | Screen definitions (populated from screen specs) |
| `styles` | `"auto"` or array | `"auto"` | `"auto"` detects from folder structure; array for manual definition |
| `elementsPerScreen` | object | `{}` | Per-screen element tags for granular feedback |

## Screen Definition

```json
{
  "key": "dashboard",
  "label": "Dashboard",
  "file": "dashboard.html",
  "color": "#6366f1"
}
```

- `key`: Machine-friendly identifier (used in localStorage keys and thumbnail filenames)
- `label`: Human-readable name shown in the gallery and reviewer
- `file`: HTML filename within each style directory
- `color`: Accent color for this screen type in the UI (any hex value)

## Style Definition (when not using "auto")

```json
{
  "key": "style-01",
  "label": "Style 01"
}
```

When `styles` is set to `"auto"`, styles are detected by scanning `designsPath` for directories matching the pattern `style-NN/` (e.g., `style-01/`, `style-02/`, `style-03/`).

## Elements Per Screen

Defines which UI elements can be individually tagged as liked/disliked during review:

```json
{
  "dashboard": ["header", "kpi-cards", "chart", "sidebar", "activity-feed", "quick-actions"],
  "list": ["table", "filters", "search", "pagination", "bulk-actions", "column-headers"],
  "detail": ["breadcrumb", "info-panel", "tabs", "actions-bar", "timeline", "related-items"],
  "form": ["field-layout", "validation", "submit-area", "help-text", "field-groups"],
  "settings": ["nav-sidebar", "section-cards", "toggles", "save-bar"]
}
```

Elements are derived from screen specs (Step 6-7). During `/review:init`, Claude reads screen specs and proposes element lists.

## review-config.json (Runtime File)

The `/review:init` command generates a `review-config.json` file in the `outputPath` directory with the runtime configuration. This file is consumed by:
- `index.html` and `review.html` (embedded as CONFIG object)
- `generate-thumbnails.mjs` (reads for paths and screen definitions)

```json
{
  "projectName": "{{PROJECT_NAME}}",
  "projectSlug": "{{PROJECT_SLUG}}",
  "designsPath": "../designs/lookfeels/",
  "thumbsPath": "thumbs/",
  "width": 1280,
  "height": 720,
  "screens": [
    { "key": "dashboard", "label": "Dashboard", "file": "dashboard.html", "color": "#6366f1" }
  ],
  "styles": [
    { "key": "style-01", "label": "Style 01" }
  ],
  "elementsPerScreen": {
    "dashboard": ["header", "kpi-cards", "chart", "sidebar"]
  }
}
```
