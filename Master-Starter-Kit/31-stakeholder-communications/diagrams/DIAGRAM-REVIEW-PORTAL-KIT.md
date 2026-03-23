# Diagram Review Portal — Master Kit Module

> **Purpose:** Generate a production-quality, interactive diagram review portal from a project's Mermaid markdown files. The portal serves as a client feedback tool where stakeholders can view diagrams, leave comments, set review statuses, and export structured feedback.
>
> **Trigger:** Called at COMMS TRIGGER points (Steps 5, 7.5, 9, 16) after diagram generation completes. Also available on-demand.
> **Output:** `dev_docs/comms/diagrams/review-portal.html`

---

## 1. What This Module Produces

A single `review-portal.html` file that:
- Renders 60-100+ diagrams across 8+ Mermaid types with professional SaaS-quality visuals
- Uses best-of-breed rendering per diagram type (not one-size-fits-all)
- Provides a client feedback system with status tracking, comments, and export
- Works by double-clicking the HTML file — no server, no build step, no npm
- Is fully interactive: zoom, pan, collapse, expand, keyboard navigation

---

## 2. Generation Methods

### Method 1: AI Direct Generation (Recommended)

1. Read `review-portal-generator.template.html`
2. Read all `.md` diagram files from `dev_docs/comms/diagrams/`
3. Read `_index.md` (or `_diagram-index.md`) for category structure
4. Fill the 6 placeholders (see Placeholder Registry below)
5. Write the populated file as `review-portal.html`

### Method 2: Build Script

```bash
node build-review-portal.js \
  --dir ./dev_docs/comms/diagrams \
  --name "{{PROJECT_NAME}}" \
  --output ./dev_docs/comms/diagrams/review-portal.html
```

Options:
- `--dir <path>` — directory containing `.md` diagram files (required)
- `--output <path>` — output HTML file path (default: `<dir>/review-portal.html`)
- `--name <string>` — project name (default: derived from parent directory)
- `--abbr <string>` — brand abbreviation for logo (default: first letter of name)
- `--color <hex>` — brand accent color (default: `#818cf8`)
- `--template <path>` — path to template HTML (default: looks in kit directory)

---

## 3. Placeholder Registry

| Placeholder | Source | Description |
|---|---|---|
| `{{PROJECT_NAME}}` | STATE BLOCK / CLI `--name` | Project display name (e.g., "Mill TMS") |
| `{{BRAND_ABBREVIATION}}` | CONFIG / CLI `--abbr` | 1-2 letter logo text (e.g., "M", "DT") |
| `{{BRAND_COLOR}}` | CONFIG / CLI `--color` | CSS accent color hex (default: `#818cf8`) |
| `{{PROJECT_SLUG}}` | Derived from name | Kebab-case slug for localStorage key (e.g., "mill-tms") |
| `{{CATEGORIES_JSON}}` | Generated from `_index.md` | JSON array of category objects (see format below) |
| `{{DIAGRAM_DATA_JSON}}` | Generated from `.md` files | JSON object mapping filenames to full markdown content |

---

## 4. CATEGORIES JSON Format

```json
[
  {
    "id": "overview",
    "label": "Overview",
    "diagrams": [
      { "file": "overview-service-map.md", "label": "Service Map" },
      { "file": "system-architecture-flowchart.md", "label": "System Architecture" }
    ]
  },
  {
    "id": "services",
    "label": "Services (N)",
    "diagrams": [
      { "file": "svc-01-auth-admin-features.md", "label": "01 Auth & Admin" }
    ]
  }
]
```

### Auto-Categorization by Filename Prefix

When no `_index.md` exists, the build script groups files by prefix:

| Prefix | Category ID | Label |
|---|---|---|
| `overview-`, `system-`, `feature-`, `dependency-`, `MASTER-` | `overview` | Overview |
| `svc-` | `services` | Services (N) |
| `wf-` | `workflows` | Workflows |
| `sm-` | `states` | State Machines |
| `data-flow`, `df-` | `dataflows` | Data Flows |
| `int-` | `integrations` | Integrations |
| `xc-` | `crosscutting` | Cross-Cutting |
| `infra-` | `infra` | Infrastructure |
| `database-` | `database` | Database |
| `timeline-`, `milestone-`, `roadmap-` | `timelines` | Timelines |
| `auth-`, `mobile-` | `authmobile` | Auth & Mobile |
| `stakeholder-` | `stakeholder` | Stakeholder |

---

## 5. Rendering Stack (Critical — Do Not Use One Library For Everything)

Each Mermaid diagram type maps to the BEST renderer for that type:

| Mermaid Type | Renderer | Why |
|---|---|---|
| `mindmap` | **Markmap** (via CDN ESM) | Native markdown mind maps — zoom, pan, collapse built-in. Far superior to Mermaid's mindmap renderer |
| `sequenceDiagram` | **D3.js Journey Map** (custom) | Traditional sequence diagrams are dense and hard to read. Journey Map uses horizontal card-based flow with foreignObject HTML for real text wrapping |
| `flowchart` / `graph` | **Mermaid** (themed) + D3 zoom wrapper | Parsing flowchart syntax into D3 nodes is too complex. Mermaid handles the layout, we theme it and add zoom/pan |
| `stateDiagram-v2` | **Mermaid** (themed) + D3 zoom wrapper | Same as flowchart |
| `erDiagram` | **Mermaid** (themed) + D3 zoom wrapper | Same as flowchart |
| `gantt` | **Mermaid** (themed) + D3 zoom wrapper | Same as flowchart |
| `timeline` | **Mermaid** (themed) + D3 zoom wrapper | Same as flowchart |
| `gitGraph` | **Mermaid** (themed) + D3 zoom wrapper | Same as flowchart |

### CDN Dependencies

```html
<!-- dagre for layout (loaded before module script) -->
<script src="https://cdn.jsdelivr.net/npm/dagre@0.8.5/dist/dagre.min.js"></script>

<!-- In the module script -->
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { Transformer } from 'https://cdn.jsdelivr.net/npm/markmap-lib@0.18/+esm';
import { Markmap } from 'https://cdn.jsdelivr.net/npm/markmap-view@0.18/+esm';
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
```

---

## 6. Mermaid Theme Configuration

Initialize Mermaid with `theme: 'base'` and these exact themeVariables:

```js
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  suppressErrorRendering: true,
  themeVariables: {
    primaryColor: '#eef2ff',
    primaryBorderColor: '#c7d2fe',
    primaryTextColor: '#1e1b4b',
    secondaryColor: '#f0fdf4',
    secondaryBorderColor: '#bbf7d0',
    secondaryTextColor: '#14532d',
    tertiaryColor: '#fefce8',
    tertiaryBorderColor: '#fde68a',
    tertiaryTextColor: '#713f12',
    lineColor: '#94a3b8',
    textColor: '#1e293b',
    nodeBorder: '#c7d2fe',
    mainBkg: '#eef2ff',
    clusterBkg: '#f8fafc',
    clusterBorder: '#e2e8f0',
    edgeLabelBackground: '#ffffff',
    actorBkg: '#eef2ff',
    actorBorder: '#c7d2fe',
    actorTextColor: '#1e293b',
    signalColor: '#475569',
    signalTextColor: '#475569',
    noteBkgColor: '#fefce8',
    noteBorderColor: '#fde68a',
    noteTextColor: '#713f12',
    activationBkgColor: '#e0e7ff',
    activationBorderColor: '#a5b4fc',
  },
  flowchart: { curve: 'basis', htmlLabels: true, padding: 20, nodeSpacing: 50, rankSpacing: 60 },
  sequence: { actorMargin: 80, messageMargin: 35, mirrorActors: true, fontSize: 13, showSequenceNumbers: true },
  stateDiagram: { fontSize: 13 },
  er: { fontSize: 12 },
  gantt: { fontSize: 12, barHeight: 28, barGap: 5 },
});
```

---

## 7. Markmap Renderer (for `mindmap` type)

### Conversion: Mermaid Mindmap → Markdown

```
root((Title))           → # Title
  Branch 1              → ## Branch 1
    Sub Branch          → ### Sub Branch
      Leaf Item         → - Leaf Item
        Deep Leaf       →   - Deep Leaf
```

### Markmap Config

```js
Markmap.create(svgElement, {
  colorFreezeLevel: 2,
  duration: 300,
  maxWidth: 280,
  paddingX: 20,
  autoFit: true,
}, root);
```

---

## 8. Journey Map Renderer (for `sequenceDiagram` type)

### Why Not Traditional Sequence Diagrams

Traditional sequence diagrams are dense and hard for non-technical stakeholders to follow. The Journey Map converts the same data into a horizontal card-based flow that's immediately readable.

### Parsing: Mermaid Sequence → Journey Data

- `participant X as Label` → Actor definition (assign color from palette)
- `Note over X,Y: Phase Title` → Phase separator (new horizontal group)
- `X->>Y: message` → Message card (from actor → to actor)
- `X->>X: message` → Self-call (internal action)
- `X-->>Y: message` → Dotted arrow variant (same rendering)

### Visual Layout

Cards are 280x175px with foreignObject HTML for text wrapping, actor pills, and status badges. Phases are separated by diamond markers on a colored track line with curved arrows between them. An actor legend appears at the bottom.

---

## 9. UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER (56px, sticky top)                                     │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │  VIEWPORT (flex: 1)                                 │
│ (260px)  │                                                     │
│ collapse │  ┌─ Label (top-left) ─────┐  ┌─ Review btn ─┐     │
│  -able   │  │ Title + Desc + Badge   │  │ (top-right)  │     │
│          │  └────────────────────────┘  └──────────────┘     │
│ Category │                                                     │
│   ○ Item │           DIAGRAM AREA                              │
│   ✓ Item │         (full remaining)                            │
│   ⚡ Item │                                                     │
│          │                                        ┌──────────┐│
│          │  ┌─ Hint (bottom-center) ──┐          │ Toolbar  ││
│          │  │ Scroll · Drag · Click   │          │ +  −  ⊡  ││
│          │  └─────────────────────────┘          └──────────┘│
├──────────┴─────────────────────────────┬───────────────────────┤
│                                        │  FEEDBACK PANEL       │
│                                        │  (320px slide-out)    │
│                                        │  Status · Priority    │
│                                        │  Comments · Export    │
└────────────────────────────────────────┴───────────────────────┘
```

### Sidebar Status Dots
- Grey circle (○) = Not reviewed
- Green check (✓) = Approved
- Amber bolt (⚡) = Needs Changes
- Blue question (?) = Question

### Keyboard Shortcuts
- `Escape` — Close feedback panel
- `Ctrl+E` — Export feedback
- `Ctrl+Enter` — Submit comment (when focused)

---

## 10. Feedback System

### Storage

All feedback in `localStorage` under key `{PROJECT_SLUG}-diagram-feedback`:

```json
{
  "svc-01-auth-features.md": {
    "status": "approved",
    "priority": "normal",
    "comments": [
      { "text": "Looks good", "timestamp": "2026-03-19T10:30:00Z" }
    ]
  }
}
```

### Export Format

Generates a markdown file grouped by status (Needs Changes → Questions → Approved → Not Reviewed) with summary counts, priority labels, and timestamped comments. Downloaded as `{PROJECT_SLUG}-feedback-{date}.md`.

---

## 11. Design Tokens

```css
:root {
  --bg: #f8f9fb;
  --surface: #ffffff;
  --surface-hover: #f3f4f6;
  --surface-active: #eef0f4;
  --border: #e5e7eb;
  --border-light: #f0f1f3;
  --text: #111827;
  --text-sec: #374151;
  --text-muted: #6b7280;
  --text-faint: #9ca3af;
  --accent: {{BRAND_COLOR}};  /* default: #818cf8 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
}
```

Font: `Inter` via Google Fonts CDN. Weights 300-800.

### Status Colors
- Not reviewed: `#9ca3af`
- Approved: `#10b981`
- Needs Changes: `#f59e0b`
- Question: `#3b82f6`
- Blocker: `#ef4444`

---

## 12. Multi-Block File Handling

15+ files may have multiple mermaid code blocks. Each renders independently:
- Stacked vertically in a scrollable container
- Each in its own bordered section with description header
- Each with independent zoom/pan
- Per-block error handling (one bad block doesn't crash the rest)

---

## 13. Known Mermaid v11 Issues (Must Handle)

### Parentheses in Pipe Labels

`-->|HTTPS (scoped)|` crashes the parser. Auto-fix:

```js
cleanCode = cleanCode.replace(/\|([^|]*)\(([^)]*)\)([^|]*)\|/g, '|$1$2$3|');
```

### Error DOM Cleanup

Mermaid v11 injects error elements into the DOM on parse failure. Clean up:

```js
document.querySelectorAll(`[id*="${id}"]`).forEach(el => el.remove());
document.querySelectorAll('.mermaid-error, .error-icon').forEach(el => el.remove());
```

---

## 14. Data Inlining (Zero-Server Requirement)

The HTML file must work by opening directly in a browser — no `fetch()` from `file://`.

The `DIAGRAM_DATA` object is inlined in a regular `<script>` tag (not module) before the module script:

```html
<script>const DIAGRAM_DATA = {"file1.md": "# Title\n...", ...};</script>
```

The loading function checks inline data first, falls back to fetch:

```js
let content;
if (typeof DIAGRAM_DATA !== 'undefined' && DIAGRAM_DATA[filename]) {
  content = DIAGRAM_DATA[filename];
} else {
  const response = await fetch(filename);
  content = await response.text();
}
```

---

## 15. What NOT To Do

- **Do NOT use dark theme** — light theme only, premium SaaS look
- **Do NOT use Mermaid for mindmaps** — Markmap is far superior
- **Do NOT use traditional sequence diagrams** — Journey Map cards are more readable
- **Do NOT use SVG `<text>` for long content** — it truncates. Use `foreignObject` with HTML
- **Do NOT use card-based collapsible UI for navigation** — use sidebar + full-viewport per diagram
- **Do NOT render all diagrams on page load** — lazy render on click for performance
- **Do NOT ignore multi-block files** — parse and render each block independently

---

## 16. Quality Checklist

Before delivering the portal:

- [ ] All mindmap files render via Markmap (zoom, pan, collapse work)
- [ ] All sequence files render as Journey Maps (cards, actor pills, status badges)
- [ ] All flowchart/state/ER/gantt files render via themed Mermaid + D3 zoom
- [ ] Multi-block files render all blocks stacked with section headers
- [ ] Sidebar shows correct status dots from localStorage
- [ ] Feedback panel: status, priority, comments all persist and reload
- [ ] Export generates clean markdown grouped by status
- [ ] Progress pill updates live
- [ ] Sidebar collapses/expands
- [ ] Keyboard: Escape closes feedback, Ctrl+E exports
- [ ] "Next unreviewed" button works
- [ ] No console errors on any diagram
- [ ] File opens directly in browser (no server needed)
- [ ] Font loads (Inter from Google Fonts CDN)
- [ ] Responsive: works at 1024px+ width
