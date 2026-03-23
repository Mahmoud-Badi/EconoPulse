---
name: recreate
description: Recreate UI from screenshots or Dribbble images. Detects multiple screens in artistic showcases, runs triple extraction (Gemini + Super Design + Claude Vision), cross-validates, generates code, and verifies visually via Playwright. Use when user says "recreate this", "copy this design", "build this from screenshot", or drops a UI screenshot.
---

# Screenshot-to-Code Recreation

Recreate UI components, pages, dashboards, and data tables from screenshots with near 1:1 accuracy using triple extraction and visual verification.

## Prerequisites

- Gemini MCP server running (model: gemini-2.5-pro-preview or latest)
- Super Design MCP server running
- Playwright MCP available for visual verification
- Working directory: the project root where code will be generated

## Design Lab

All working files go in `design-lab/` at the project root (gitignored):

```
design-lab/
  references/YYYY-MM-DD-{name}/    <- original screenshots
  extractions/YYYY-MM-DD-{name}/   <- extraction results + design brief
  previews/YYYY-MM-DD-{name}/      <- HTML previews + rendered screenshots
```

Create dated subfolders automatically. Naming: `2026-03-08-dispatch-dashboard`, `2026-03-09-analytics-cards`.

## Workflow

### Phase 1: Screen Detection

Dribbble images are often artistic showcases: multiple screens on device mockups, angled perspectives, overlapping compositions, website promos with 3+ screens in one image. You MUST detect individual screens before extracting.

1. **Read the image** (Claude multimodal) and identify:
   - How many distinct UI screens/components are in the image
   - For each: describe content type (dashboard, table, form, sidebar, card, chart, etc.)
   - Note if screens are on device mockups (laptop, phone, tablet)
   - Note artistic elements to IGNORE (shadows, gradients from the showcase, device bezels)

2. **Gemini object detection** for precision:
   ```
   Tool: mcp__gemini__gemini-analyze-image
   imagePath: {saved image path}
   query: "Identify each distinct UI screen or component in this image. For each, describe its boundaries, content type (dashboard, table, sidebar, form, card grid, etc.), and approximate position. Ignore device mockup frames, artistic backgrounds, and decorative elements. Focus only on the actual UI content."
   model: pro
   mediaResolution: high
   detectObjects: true
   thinkingLevel: high
   ```

3. **Save the original** to `design-lab/references/YYYY-MM-DD-{name}/original.png`

4. **AskUserQuestion**: Present what you found. "I detected N screens in this image: [descriptions]. Which do you want recreated?" Let user pick one or multiple.

### Phase 2: Triple Extraction (Run in Parallel)

For EACH target screen, launch 3 extractions simultaneously via parallel tool calls:

**Extractor A: Gemini Pro (pixel-precise values)**
```
Tool: mcp__gemini__gemini-analyze-image
imagePath: {image path}
query: "For the [described screen], extract ALL visual properties as structured JSON:
- colors: every hex color used (background, text, borders, accents, badges, buttons)
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

**Extractor B: Super Design (design system tokens)**
```
Tool: mcp__superdesign__superdesign_extract_system
image_path: {image path}
```

**Extractor C: Claude Vision (semantic understanding)**
Read the image yourself and analyze:
- Grid structure (CSS Grid or Flexbox, columns, rows, gaps)
- Component hierarchy (page > section > card > table > row > cell)
- Data patterns (what kind of data is shown, column types, badge types)
- Interactive elements (buttons, dropdowns, tabs, toggles, search bars)
- State indicators (active tab, selected row, status badges)
- Responsive hints (does it look like it has a sidebar? fixed header?)
- Component mapping to shadcn/ui (Table, Card, Badge, Button, Tabs, etc.)

Save all 3 results to `design-lab/extractions/YYYY-MM-DD-{name}/`:
- `gemini-extraction.json`
- `superdesign-tokens.json`
- `claude-analysis.md`

### Phase 3: Cross-Validation & Design Brief

Compare the 3 extractions and merge into a single Design Brief:

For each property category (colors, typography, spacing, components):

| Confidence | Condition | Action |
|------------|-----------|--------|
| HIGH | All 3 extractors agree (within tolerance: colors +/-5 hex, spacing +/-2px) | Use directly |
| MEDIUM | 2 of 3 agree | Use majority value, note discrepancy |
| LOW | All 3 disagree | Flag for user — present all 3 values, ask which to use |

Write the merged brief to `design-lab/extractions/YYYY-MM-DD-{name}/design-brief.md` with:
- Final color palette (hex values)
- Typography scale (sizes, weights, line-heights)
- Spacing scale (padding, margins, gaps)
- Component list with shadcn/ui mappings
- Layout structure (grid definition)
- Confidence level next to each value

**Present the brief to the user for approval before coding.** Use AskUserQuestion if there are LOW-confidence values.

### Phase 4: Code Generation

**AI Slop Check:** Read `{{SKILL_DIR}}/../../references/ai-slop-detection.md` and run its signal checklist against the design brief. Flag and fix any slop signals before generating code.

Using the approved Design Brief:

1. **Invoke the `frontend-design` skill** — pass the design brief as context
2. **Map to existing components:**
   - Check project's `components/ui/` for shadcn components already installed
   - Check project's `components/tms/` or equivalent for custom components
   - Reuse existing components; only create new ones if nothing matches
3. **Generate TWO outputs:**
   - **Standalone HTML** (`design-lab/previews/YYYY-MM-DD-{name}/preview.html`): Self-contained file with Tailwind CDN, all styles inline, dummy data matching the screenshot. For visual verification only.
   - **React component** code: Production-ready, using the project's actual imports. Present to user but don't write to codebase yet — let them decide where it goes.

### Phase 5: Visual Verification

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
   Rate similarity 1-10. List every visual difference.

4. **Score evaluation:**
   - Score >= 8/10: Present final code to user. Done.
   - Score 6-7/10: Fix identified issues, regenerate HTML, re-verify (max 2 iterations).
   - Score < 6/10: Present comparison to user, ask for guidance.

## Rules

- NEVER skip Phase 1 screen detection
- ALWAYS save intermediate files to design-lab/
- ALWAYS present the Design Brief for approval before coding
- ALWAYS generate the standalone HTML for verification before the React code
- If given a Dribbble URL, use Firecrawl to scrape and save the image first
