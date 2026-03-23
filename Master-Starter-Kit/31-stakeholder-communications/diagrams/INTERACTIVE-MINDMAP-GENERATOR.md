# Interactive Mind Map HTML Generator

**Purpose:** After generating Mermaid/Miro mind maps, produce a single self-contained HTML file that renders ALL project mind maps as interactive, zoomable, collapsible Markmap trees. This is the client-facing deliverable — shareable via email, static hosting, or Vercel.

**Trigger:** Called automatically at every COMMS TRIGGER (Steps 5, 7.5, 9, 16) after Step 6 (Mermaid diagram generation) completes. Also available on-demand via `/mindmap` command.

**Output:** `dev_docs/comms/diagrams/interactive-mindmap.html`

---

## Why Markmap Instead of Mermaid

Mermaid's `mindmap` renderer produces static, ugly rectangles. Markmap produces interactive trees with:
- Smooth curved branches with colored nodes (looks like Miro)
- Click-to-expand/collapse any branch
- Scroll-to-zoom, drag-to-pan
- Handles 1,800+ nodes across multiple tabs
- Single HTML file, zero dependencies (loads from CDN)

---

## Generation Instructions

### Step 1 — Gather All Mind Map Data

Read these sources and extract the full project hierarchy:

| Source | What to extract |
|--------|----------------|
| `dev_docs/specs/services/*.md` | Service names, features, sub-features, capabilities |
| `dev_docs/services/*.md` | Service hub files — endpoints, tables, business rules |
| `dev_docs/services/modules/*.md` | Module-level breakdowns (if they exist) |
| `dev_docs/specs/project-phases.md` | Phase names, timelines, milestones |
| `dev_docs/completeness/service-matrix.md` | Service-to-feature mapping |
| `dev_docs/specs/system-architecture.md` | Architecture layers, integrations |
| `dev_docs/comms/diagrams/feature-mind-map*.md` | Already-generated Mermaid mind maps |
| `dev_docs/comms/diagrams/*.md` | Already-generated Mermaid diagrams |
| `dev_docs/tasks/*.md` | Task structure, workflow coverage |

### Step 2 — Structure the Markdown Content

Create markdown strings for each tab using this hierarchy:

```
# {{PROJECT_NAME}}                          <- Root (h1)
## {{SERVICE_NAME}}                         <- Service (h2)
### Features / Workflows / State Machines   <- Category (h3)
#### {{Feature Group}}                      <- Feature (h4)
- {{Detail}}                                <- Detail (list)
  - {{Sub-detail}}                          <- Sub-detail (nested list)
```

**Required tabs (minimum):**

| Tab ID | Label | Content |
|--------|-------|---------|
| `fullsystem` | Full System | ALL services + features + workflows + state machines + data flows + integrations + cross-cutting + roadmap in ONE tree. This is the hero view. |
| `overview` | System Overview | Services with 2-3 levels of features only (no workflows/state machines). Quick orientation. |
| One per service | `SVC-XX {{Name}}` | That service's full features + workflows + state machines combined. |
| `dataflows` | Data Flows | Service-to-service data flow, real-time paths, offline sync (if mobile). |
| `integrations` | Integrations | All external integrations grouped by phase. |
| `crosscutting` | Cross-Cutting | Multi-tenant, auth, security, HIPAA/compliance, design system, CI/CD. |
| `roadmap` | Roadmap | Phased roadmap with milestones + scale metrics. |

### Step 3 — Generate the HTML File

Generate a single self-contained HTML file at `dev_docs/comms/diagrams/interactive-mindmap.html` using the specifications below.

**Technology:**
- Markmap via ESM CDN: `https://cdn.jsdelivr.net/npm/markmap-lib@0.18/+esm` and `https://cdn.jsdelivr.net/npm/markmap-view@0.18/+esm`
- Google Fonts Inter
- No other dependencies

**Design requirements (SaaS light mode):**

```
LAYOUT
+-- Header (56px, white, border-bottom)
|   +-- Left: Logo square (brand color, 2-letter abbrev) + Project name
|   +-- Right: Stat pills (services, workflows, endpoints, tables) + node count badge
+-- Tab bar (white, border-bottom, horizontal scroll)
|   +-- "Full System" tab (first, default active, brand color dot)
|   +-- "System Overview" tab
|   +-- One tab per service (color-coded dot)
|   +-- Data Flows, Integrations, Cross-Cutting, Roadmap tabs
+-- Map container (flex:1, white card with border + shadow, 12px radius, 0.75rem margin)
|   +-- Section label (top-left, title + description)
|   +-- Action buttons (top-right: "Expand All", "Collapse All", "Fit to Screen")
|   +-- SVG#markmap-svg (fills container)
|   +-- Zoom toolbar (bottom-right, vertical, +/-/fit/expand/collapse with SVG icons)
|   +-- Node count (bottom-left, "X nodes")
|   +-- Keyboard hint (bottom-center, fades on hover)
+-- No footer
```

**Color palette:**

```css
--bg: #ffffff;
--bg-secondary: #f8f9fb;
--surface: #ffffff;
--surface-hover: #f3f4f6;
--border: #e5e7eb;
--text: #111827;
--text-muted: #6b7280;
--text-faint: #9ca3af;
--brand: {{BRAND_COLOR or #dc2626}};
```

**Per-service tab dot colors (assign in order):**

```javascript
const COLORS = [
  '#dc2626', // Service 1 (red)
  '#2563eb', // Service 2 (blue)
  '#059669', // Service 3 (green)
  '#d97706', // Service 4 (amber)
  '#7c3aed', // Service 5 (violet)
  '#0d9488', // Service 6 (teal)
  '#db2777', // Service 7 (pink)
  '#ca8a04', // Service 8 (yellow)
  '#0891b2', // Service 9 (cyan)
  '#65a30d', // Service 10 (lime)
  // Additional services cycle through these
];
// Non-service tabs:
// fullsystem: brand color
// overview: #111827
// dataflows: #4f46e5
// integrations: #e11d48
// crosscutting: #7c3aed
// roadmap: #c026d3
```

**Markmap configuration:**

```javascript
// Full System tab (large tree)
{
  colorFreezeLevel: 2,
  initialExpandLevel: 2,    // Collapsed - user expands
  maxWidth: 280,
  spacingHorizontal: 80,
  spacingVertical: 4,
}

// Individual service tabs (focused trees)
{
  colorFreezeLevel: 2,
  initialExpandLevel: 3,    // More expanded - smaller tree
  maxWidth: 300,
  spacingHorizontal: 80,
  spacingVertical: 4,
}
```

**Expand/Collapse implementation:**

The Expand All and Collapse All buttons must **destroy and re-create** the markmap instance with different `initialExpandLevel` values. Do NOT try to manipulate `payload.fold` — it doesn't work reliably across markmap versions.

```javascript
window.expandAll = () => {
  // Destroy current, re-create with initialExpandLevel: -1 (all expanded)
};

window.collapseAll = () => {
  // Destroy current, re-create with initialExpandLevel: 1 (top level only)
};
```

**Critical CSS rule — scope the SVG sizing:**

```css
/* ONLY target the markmap SVG, not button icon SVGs */
.map-wrap > svg#markmap-svg {
  width: 100%;
  height: 100%;
}
```

If you use `.map-wrap svg { width: 100%; height: 100%; }` it will blow up all SVG icons in buttons to full-screen size.

**Safari compatibility:**

Always include both:
```css
-webkit-backdrop-filter: blur(20px);
backdrop-filter: blur(20px);
```

### Step 4 — Depth Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Total nodes (Full System tab) | 200 | 500+ |
| Services represented | All from CONFIG.MVP_SERVICES | All |
| Feature depth | 3 levels (service -> feature -> capability) | 4+ levels |
| Workflow coverage | At least 1 workflow per service | All workflows |
| State machine coverage | At least 1 per service (if applicable) | All state machines |
| Tabs | 8 minimum (full + overview + services + extras) | 12-16 |
| File size | -- | Under 500KB for fast load |

### Step 5 — Verify

After generation, verify:

1. [ ] HTML file opens in browser without errors (check console)
2. [ ] All tabs render a markmap (not blank)
3. [ ] Full System tab shows the complete project hierarchy
4. [ ] Expand All button works (destroys + re-creates with `initialExpandLevel: -1`)
5. [ ] Collapse All button works (destroys + re-creates with `initialExpandLevel: 1`)
6. [ ] Fit to Screen button works (`currentMM.fit()`)
7. [ ] Zoom toolbar +/- works
8. [ ] Node count updates when switching tabs
9. [ ] Section title color matches the active tab's dot color
10. [ ] No giant SVG icons in buttons (CSS scoping check)
11. [ ] Mobile responsive (tabs scroll, buttons stack, toolbar repositions)

---

## Parameters (inherited from COMMS-GENERATOR)

| Parameter | Source | Usage |
|-----------|--------|-------|
| `{{PROJECT_NAME}}` | STATE BLOCK | Root node label, HTML title, header |
| `{{BRAND_COLOR}}` | CONFIG or design tokens | Logo background, primary button, Full System tab |
| `{{BRAND_ABBREVIATION}}` | First letters of project name | Logo text (e.g., "CR" for Code Red) |
| `{{MVP_SERVICES}}` | CONFIG | Which services to include |
| `{{INCLUDE_DIAGRAMS}}` | COMMS-GENERATOR params | Gate -- skip if false |

---

## Example Output Summary

```
INTERACTIVE MIND MAP GENERATED
================================
File: dev_docs/comms/diagrams/interactive-mindmap.html
Tabs: 16 (Full System + Overview + 10 services + Data Flows + Integrations + Cross-Cutting + Roadmap)
Total nodes: 1,847
File size: 127KB
Technology: Markmap v0.18 (ESM CDN)

Share: Open in any browser, email the file, or deploy to static hosting.
```

---

## Lessons Learned (from Code Red build)

1. **Mermaid mindmaps are ugly** — Markmap is the only viable option for client-facing mind maps.
2. **One giant map works** — 1,800+ nodes in a single Markmap is fine when `initialExpandLevel: 2`. Users click to explore.
3. **`payload.fold` manipulation doesn't work** — Always destroy and re-create the markmap instance for expand/collapse.
4. **CSS `svg` selector is dangerous** — Must scope to `svg#markmap-svg` or button icons will fill the entire viewport.
5. **Safari needs `-webkit-backdrop-filter`** — Always double-declare.
6. **Tab switching = destroy + create** — Don't try to cache markmap instances. Destroy the old one, create a new one on tab switch.
7. **Light mode looks more professional** — Clients expect white backgrounds. Dark mode is for internal tools.
8. **Stat pills in the header** — Instantly communicate project scale without reading anything.
9. **Action buttons top-right, zoom toolbar bottom-right** — Users find expand/collapse faster when they're prominent buttons, not tiny toolbar icons.
