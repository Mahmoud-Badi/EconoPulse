# Design Pipeline

## Overview

The design pipeline is a multi-AI workflow that produces a design specification BEFORE any code is written. It uses multiple AI tools in sequence, each contributing a different capability:

```
Research --> Concept --> Review --> Components --> Assets --> Spec
(Firecrawl)  (Stitch)   (Gemini)   (Magic)     (Gemini)  (Output)
```

This pipeline is what separates a 2/10 demo from an 8/10 demo. It takes 15-20 minutes per major screen. The alternative -- coding UI without a design spec -- takes the same time but produces significantly worse results.

---

## Phase 1: Research

**Tool:** `/design-research` (uses Firecrawl MCP + Gemini MCP)

**What happens:**
1. Firecrawl scrapes best-in-class products in your domain
2. Gemini performs deep research on current UI trends for your screen type
3. Output: a Design Brief summarizing patterns, examples, and anti-slop notes

**Input:** Screen type and domain context

```
/design-research dashboard NEMT transportation management
```

**Output example:**

```markdown
## Design Brief: Dashboard

### Best Practices Observed
- Primary KPI cards at top with trend indicators
- Activity feed or recent items in right sidebar
- Charts use muted colors, not rainbow palettes
- Quick action buttons near relevant metrics

### Anti-Slop Notes
- Avoid equal-size KPI cards (prioritize by importance)
- No gradient backgrounds on dashboard sections
- Charts should have meaningful labels, not "Series 1"

### Reference Screenshots
- [Samsara Fleet Dashboard] - clean KPI layout, dark sidebar
- [RouteWare Dispatch] - map-centric with status panels
- [TripMaster] - data-dense, tabular layout
```

**When to skip:** If you've already researched this screen type in a previous session, you can reuse the existing Design Brief.

---

## Phase 2: Concept

**Tool:** Stitch MCP (`stitch:generate_screen_from_text`)

**What happens:**
1. Stitch takes the Design Brief + brand constraints
2. Generates a visual concept as HTML/Tailwind
3. Output: rendered concept you can evaluate

**Input:** Design Brief summary + brand tokens

```
Generate a dashboard screen for a {YOUR_DOMAIN} management system.
Brand: {PRIMARY_COLOR} primary, {NEUTRAL} neutrals, softly rounded (8px cards).
Layout: Primary KPI cards (3-4 key metrics) at top, chart below left,
activity feed below right. Sidebar navigation on left.
Dense but readable. Professional, not flashy.
```

**Output:** HTML/Tailwind concept with realistic content and proper visual hierarchy.

**Iteration:** If the concept doesn't match your vision:
```
stitch:generate_variants  -- generate alternative layouts
stitch:edit_screens       -- refine specific sections
```

---

## Phase 3: Review

**Tool:** Gemini MCP (`gemini:gemini-analyze-image` or `gemini:gemini-analyze-code`)

**What happens:**
1. Gemini reviews the concept against anti-slop rules
2. Scores the design 1-10 on slop risk
3. Identifies specific violations and suggestions

**Process:**

```
Score this dashboard design on slop-risk (1=very sloppy, 10=very polished):

Check for:
- Equal-size stat cards
- Gradient backgrounds
- Generic placeholder text
- Missing hover/focus states
- Color-only status indicators
- Center-aligned body text
- More than 2 font weights
```

**Decision:**
- Score >= 6: Proceed to Phase 4
- Score < 6: Return to Phase 2 with specific feedback

**Example feedback loop:**

```
Slop Score: 4/10

Issues:
1. All 4 KPI cards are identical size (Rule L1)
2. Chart section has a gradient header (Rule C1)
3. Status badges use color only, no icons (Rule C5)

Suggestions:
1. Make revenue card 2x width, group secondary KPIs
2. Replace gradient with flat primary-600 or neutral-50
3. Add icons to status badges (checkmark, clock, x-circle)
```

Then re-generate with Stitch using these corrections.

---

## Phase 4: Components

**Tool:** Magic MCP (`magic:21st_magic_component_builder` or `magic:21st_magic_component_inspiration`)

**What happens:**
1. Magic matches the approved concept to pre-built polished components
2. Identifies which components shadcn handles vs what needs custom work
3. Output: component list with implementation notes

**Process:**

```
Based on this dashboard design, identify components:
- Which shadcn/ui components can be used directly?
- Which need customization?
- Which need to be built from scratch?
```

**Example output:**

```markdown
## Component Mapping

### Use shadcn directly:
- Card (with custom shadow token)
- Table (with sorting enhancement)
- Badge (wrapped as StatusBadge)
- DropdownMenu (for actions)

### Customize shadcn:
- Button (add shadow + loading state)
- Input (add hover border + error state)

### Build custom:
- KPICard (metric + trend + sparkline)
- ActivityFeed (timestamped event list)
- QuickActions (contextual action bar)
- DispatchMiniMap (simplified map view)
```

---

## Phase 5: Assets

**Tool:** `/generate-asset` (uses Gemini 3 Pro for image generation)

**What happens:**
1. Generate custom illustrations, icons, or backgrounds
2. Auto-saves to project's public/assets directory

**Common assets to generate:**

| Asset | When Needed |
|-------|------------|
| Empty state illustrations | Every list/table page (trips, drivers, invoices) |
| Logo variants | Light/dark backgrounds, favicon |
| Loading illustrations | Custom loading states beyond skeleton |
| Error illustrations | 404, 500, offline pages |
| Onboarding graphics | Welcome screens, feature tours |

**Example:**

```
/generate-asset empty-state illustration of an empty inbox
in a minimalist line-art style, {PRIMARY_COLOR} accent color, white background,
suitable for a "no items found" empty state
```

**When to skip:** If you're using icon-based empty states (Lucide icons in a circle), you don't need custom illustrations. Custom illustrations are for polish, not for MVP.

---

## Phase 6: Spec

**Output:** Implementation specification document

The final output of the pipeline is a spec that Claude can implement directly:

```markdown
## Implementation Spec: Dashboard

### Component Tree
```
DashboardPage
  PageHeader (title="Dashboard", action=<DateRangePicker />)
  KPIRow
    KPICard (metric="revenue", size="large")
    KPICard (metric="trips", size="small")
    KPICard (metric="drivers", size="small")
    KPICard (metric="vehicles", size="small")
  ContentGrid (2 columns: 60/40)
    ChartSection
      TripVolumeChart (bar chart, 7 days)
      RevenueChart (line chart, 30 days)
    ActivitySection
      ActivityFeed (last 20 events)
      QuickActions (create trip, assign driver)
```

### Data Flow
- KPIs: `api.dashboard.getKPIs.useQuery()`
- Charts: `api.dashboard.getChartData.useQuery({ range })`
- Activity: `api.dashboard.getRecentActivity.useQuery({ limit: 20 })`

### Responsive Breakpoints
- Mobile (375px): Single column, KPIs stack vertically, charts full width
- Tablet (768px): KPIs in 2x2 grid, content single column
- Laptop (1024px): KPIs in row, content 60/40 grid
- Desktop (1440px): Same as laptop, max-width container

### Interaction States
- KPI cards: hover shadow lift
- Chart: tooltip on hover with exact values
- Activity items: hover highlight, click navigates to detail
- Quick actions: primary button + outline secondary

### Anti-Slop Compliance
- Revenue KPI is 2x width (Rule L1)
- No gradient backgrounds (Rule C1)
- Status badges have icon + text (Rule C5)
- Body text left-aligned (Rule L3)
- Two font weights only: 400, 600 (Rule T1)
```

---

## When to Use the Full Pipeline vs Shortcuts

### Full Pipeline (All 6 Phases)

Use for:
- **New screen types** (first dashboard, first detail page, first form)
- **Major redesigns** (overhauling an existing screen)
- **Client-facing demos** (when visual quality is critical)

Time: 15-20 minutes per screen

### Shortened Pipeline (Phases 4-6 Only)

Use for:
- **Variants of existing screens** (second detail page, third list page)
- **You already have a design system and concept**
- **The screen follows an established pattern**

Skip Phases 1-3 and go straight to component mapping and spec.

Time: 5-10 minutes per screen

### Skip Pipeline Entirely

Use for:
- **Small component additions** (add a filter dropdown to an existing table)
- **Bug fixes** (no design change)
- **Backend-only features** (no UI)

Instead: just use `/design-verify` after the change.

Time: 1 minute

---

## Pipeline Checklist

Before starting the pipeline:
- [ ] Brand identity defined (see `brand-identity-worksheet.md`)
- [ ] Design tokens created (see `design-token-guide.md`)
- [ ] Anti-slop rules in CLAUDE.md (see `anti-slop-rulebook.md`)
- [ ] Data requirements known (what API endpoints exist or need to be created)

After the pipeline:
- [ ] Implementation spec saved to docs/
- [ ] Component list identified
- [ ] Responsive breakpoints defined
- [ ] Anti-slop compliance verified
- [ ] Ready for implementation (no ambiguity)
