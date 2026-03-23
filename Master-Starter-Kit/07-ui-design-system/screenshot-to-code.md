# Screenshot-to-Code Recreation

## Overview

Recreate UI components, pages, dashboards, and data tables from screenshots or Dribbble images with near 1:1 accuracy. Uses triple extraction (Gemini + Super Design + Claude Vision) with cross-validation and visual verification via Playwright.

```
Detect Screens --> Triple Extract --> Cross-Validate --> Code --> Verify
(Claude+Gemini)   (3 tools parallel)  (merge + brief)   (HTML+React)  (Playwright)
```

This is the reverse of the [design pipeline](./design-pipeline.md). Instead of designing from scratch, you're reverse-engineering an existing design into code.

**When to use this instead of the design pipeline:**
- You have a screenshot, mockup, or Dribbble image you want to match
- A client sent a design comp and you need to implement it
- You found a UI you admire and want to recreate the layout/style
- You're migrating an existing application and need to match the current look

**Invoke:** `/recreate` — provide the image path or Dribbble URL.

---

## Working Directory

All working files go in `design-lab/` at the project root (gitignored):

```
design-lab/
  references/YYYY-MM-DD-{name}/    <- original screenshots
  extractions/YYYY-MM-DD-{name}/   <- extraction results + design brief
  previews/YYYY-MM-DD-{name}/      <- HTML previews + rendered screenshots
```

Dated subfolders are created automatically (e.g. `2026-03-08-dispatch-dashboard`).

---

## Phase 1: Screen Detection

Dribbble images and design showcases often contain multiple screens in one image — device mockups, angled perspectives, overlapping compositions. Always detect individual screens before extracting.

1. **Read the image** (Claude multimodal) and identify:
   - How many distinct UI screens/components are in the image
   - Content type of each (dashboard, table, form, sidebar, card, chart, etc.)
   - Whether screens are on device mockups (laptop, phone, tablet)
   - Artistic elements to IGNORE (shadows, gradients from the showcase, device bezels)

2. **Gemini object detection** for precision:
   ```
   Tool: mcp__gemini__gemini-analyze-image
   imagePath: {saved image path}
   query: "Identify each distinct UI screen or component in this image.
           For each, describe its boundaries, content type, and approximate
           position. Ignore device mockup frames, artistic backgrounds,
           and decorative elements. Focus only on the actual UI content."
   model: pro
   mediaResolution: high
   detectObjects: true
   thinkingLevel: high
   ```

3. **Save the original** to `design-lab/references/YYYY-MM-DD-{name}/original.png`

4. **Ask the user**: "I detected N screens in this image: [descriptions]. Which do you want recreated?"

---

## Phase 2: Triple Extraction (Parallel)

For EACH target screen, launch 3 extractions simultaneously:

### Extractor A: Gemini Pro (pixel-precise values)

```
Tool: mcp__gemini__gemini-analyze-image
imagePath: {image path}
query: "For the [described screen], extract ALL visual properties as structured JSON:
- colors: every hex color (background, text, borders, accents, badges, buttons)
- typography: font family guess, sizes in px for each text level (h1-h6, body, caption, label)
- spacing: padding and margin values in px for cards, sections, rows, cells
- borders: radius in px, width, style, color
- shadows: box-shadow values (offset, blur, spread, color)
- gradients: any gradient definitions
- opacity: any semi-transparent elements
- layout: column count, gap sizes, sidebar width if present
Return as a single JSON object."
model: pro
mediaResolution: high
thinkingLevel: high
```

### Extractor B: Super Design (design system tokens)

```
Tool: mcp__superdesign__superdesign_extract_system
image_path: {image path}
```

### Extractor C: Claude Vision (semantic understanding)

Read the image yourself and analyze:
- Grid structure (CSS Grid or Flexbox, columns, rows, gaps)
- Component hierarchy (page > section > card > table > row > cell)
- Data patterns (column types, badge types)
- Interactive elements (buttons, dropdowns, tabs, toggles, search bars)
- State indicators (active tab, selected row, status badges)
- Responsive hints (sidebar? fixed header?)
- Component mapping to shadcn/ui (Table, Card, Badge, Button, Tabs, etc.)

Save all 3 results to `design-lab/extractions/YYYY-MM-DD-{name}/`:
- `gemini-extraction.json`
- `superdesign-tokens.json`
- `claude-analysis.md`

---

## Phase 3: Cross-Validation & Design Brief

Compare the 3 extractions and merge into a single Design Brief.

For each property category (colors, typography, spacing, components):

| Confidence | Condition | Action |
|------------|-----------|--------|
| **HIGH** | All 3 extractors agree (colors +/-5 hex, spacing +/-2px) | Use directly |
| **MEDIUM** | 2 of 3 agree | Use majority value, note discrepancy |
| **LOW** | All 3 disagree | Flag for user — present all 3 values, ask which to use |

Write the merged brief to `design-lab/extractions/YYYY-MM-DD-{name}/design-brief.md` with:
- Final color palette (hex values)
- Typography scale (sizes, weights, line-heights)
- Spacing scale (padding, margins, gaps)
- Component list with shadcn/ui mappings
- Layout structure (grid definition)
- Confidence level next to each value

**Present the brief to the user for approval before coding.**

---

## Phase 4: Code Generation

Using the approved Design Brief:

1. **Use the `frontend-design` skill** — pass the design brief as context
2. **Map to existing components:**
   - Check project's `components/ui/` for shadcn components already installed
   - Check project's `components/tms/` for custom components
   - Reuse existing components; only create new ones if nothing matches
3. **Generate TWO outputs:**

   **Standalone HTML** (`design-lab/previews/YYYY-MM-DD-{name}/preview.html`):
   Self-contained file with Tailwind CDN (`<script src="https://cdn.tailwindcss.com"></script>`), all styles inline, dummy data matching the screenshot. For visual verification only.

   **React component** code:
   Production-ready, using the project's actual imports (shadcn/ui, Tailwind classes, project conventions). Present to the user but don't write to the codebase yet — let them decide where it goes.

---

## Phase 5: Visual Verification

1. **Open the HTML preview in Playwright:**
   ```
   Tool: mcp__plugin_playwright_playwright__browser_navigate
   url: file:///{absolute path to preview.html}
   ```

2. **Take a screenshot:**
   ```
   Tool: mcp__plugin_playwright_playwright__browser_take_screenshot
   ```
   Save to `design-lab/previews/YYYY-MM-DD-{name}/rendered.png`

3. **Compare with Gemini:**
   ```
   Tool: mcp__gemini__gemini-analyze-image
   imagePath: {rendered screenshot path}
   query: "Compare this rendered UI with the original design. Rate similarity
           1-10. List EVERY visual difference: wrong colors, misaligned elements,
           incorrect spacing, missing components, wrong typography, missing
           shadows or borders. Be extremely detailed and critical."
   model: pro
   mediaResolution: high
   thinkingLevel: high
   ```

4. **Also visually compare yourself** by reading both images.

5. **Score evaluation:**

| Score | Action |
|-------|--------|
| >= 8/10 | Present final code to user. Done. |
| 6-7/10 | Fix identified issues, regenerate HTML, re-verify (max 2 iterations) |
| < 6/10 | Something fundamental is wrong. Present comparison to user, ask for guidance. |

---

## Multi-Screen Handling

When recreating multiple screens from the same image:
- Extract design tokens ONCE from the first screen (they likely share a design system)
- Apply shared tokens to all screens
- Run Phases 2-5 independently for each screen's layout/components
- Present all screens together at the end

---

## Relation to Other Files in This Folder

| File | Relationship |
|------|-------------|
| [design-pipeline.md](./design-pipeline.md) | Forward direction (concept to code). This file is the reverse (screenshot to code). |
| [anti-slop-rulebook.md](./anti-slop-rulebook.md) | Generated code is checked against anti-slop rules during Phase 4. |
| [component-customization.md](./component-customization.md) | Extracted components are customized following these patterns. |
| [design-token-guide.md](./design-token-guide.md) | Extracted tokens feed into the project's design token system. |
| [brand-identity-worksheet.md](./brand-identity-worksheet.md) | If the screenshot's brand differs from the project's, reconcile here. |
| [dashboard-admin-ui-kit.template.md](./dashboard-admin-ui-kit.template.md) | Dashboard recreations reference this component catalog. |

---

## Prerequisites

These MCP servers must be running:

| Server | Purpose |
|--------|---------|
| Gemini MCP | Image analysis, cross-validation, comparison (model: gemini-3.1-pro-preview) |
| Super Design MCP | Design system token extraction |
| Playwright MCP | Visual verification (screenshot comparison) |
| Firecrawl MCP | Scraping Dribbble URLs (if URL provided instead of image file) |

---

## Rules

1. **NEVER skip Phase 1 screen detection** — even "simple" screenshots may have multiple panels
2. **ALWAYS save intermediate files to `design-lab/`** — user may want to reference them later
3. **ALWAYS present the Design Brief for approval before coding**
4. **ALWAYS generate the standalone HTML for verification before presenting the React code**
5. If the user provides a Dribbble URL instead of a file, use Firecrawl to scrape the page and save the image first
6. Use the project's existing design system tokens (check `globals.css`) as a foundation — adapt the screenshot's design to fit the project's conventions when requested
7. Dummy data in previews should match the THEME of the screenshot (trucking data for TMS, financial data for dashboards, etc.)
8. Follow [anti-slop-rulebook.md](./anti-slop-rulebook.md) in generated code
