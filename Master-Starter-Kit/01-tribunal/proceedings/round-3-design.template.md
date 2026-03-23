# Round 3: Design Direction Debate

> **Date:** [YYYY-MM-DD]
> **Led By:** UI Designer + UX Researcher
> **Contributing:** All 5 expert agents + select persona input
> **Duration:** [Estimated time]

---

## Round 3 Purpose

This round locks down the visual and interaction direction for the product. By the end of Round 3, the team has:

1. A concrete list of anti-patterns to avoid (things that look bad in this domain)
2. Reference products with specific patterns to borrow
3. An approved design language (colors, typography, density, component style)
4. The 3-5 most critical screens identified with clear requirements
5. Design tokens and patterns ready for implementation in Phase 0

**Skip this round in abbreviated mode.** Use the design-brief.template.md defaults and address design inline during development.

**Ground rules:**
- Design decisions are made for the domain and user types, not personal aesthetics
- Every choice must have a rationale tied to user needs (from Round 1) or technical constraints (from Round 2)
- Anti-patterns are documented as concrete rules, not vague preferences
- The output is actionable — a developer should be able to implement the design system from this document

---

## Design Anti-Patterns for This Domain

What does "bad" look like in [DOMAIN] software? These are patterns observed in competitors and adjacent products that actively hurt the user experience. Each anti-pattern includes a concrete rule to prevent it.

### Anti-Pattern 1: [Name]

**What It Looks Like:** [Description with specifics. Example: "A dashboard with 15+ KPI cards, 4 charts, a table, and an activity feed all visible at once. No visual hierarchy — everything is the same size, same weight, same color. The user's eye has nowhere to land."]

**Why It's Bad:** [Impact on user experience. Example: "Dashboard fatigue — when everything is emphasized, nothing is emphasized. Users stop looking at the dashboard entirely and navigate directly to specific pages, defeating the purpose of having a dashboard."]

**Our Rule:** [Concrete, testable rule. Example: "Maximum 6 KPI cards above the fold. Charts limited to 2 per view. Every element must have a clear hierarchy level (primary / secondary / tertiary). The most important metric is visually 2x larger than secondary metrics."]

### Anti-Pattern 2: [Name]

**What It Looks Like:** [Description]
**Why It's Bad:** [Impact]
**Our Rule:** [Rule]

### Anti-Pattern 3: [Name]

**What It Looks Like:** [Description]
**Why It's Bad:** [Impact]
**Our Rule:** [Rule]

### Anti-Pattern 4: [Name]

**What It Looks Like:** [Description]
**Why It's Bad:** [Impact]
**Our Rule:** [Rule]

### Anti-Pattern 5: [Name]

**What It Looks Like:** [Description]
**Why It's Bad:** [Impact]
**Our Rule:** [Rule]

---

## Design References

Products with good UI in relevant areas. For each, identify **specifically** what we're borrowing — not "we like Stripe" but "we're borrowing Stripe's KPI card layout pattern."

### Reference 1: [Product Name]

**What they do well:** [Specific pattern. Example: "Stripe's dashboard uses 4 KPI cards in a horizontal row, each with: metric name (small, muted), value (large, bold), trend arrow with percentage (color-coded: green for positive, red for negative). Below the cards, a single area chart shows the primary metric over time. The hierarchy is clear: number > trend > chart > everything else."]

**What we're borrowing:**
- [Pattern 1: KPI card design — metric name, large value, trend indicator]
- [Pattern 2: Single-chart focus below KPIs — not 4 charts competing for attention]
- [Pattern 3: Color-coded trends — green for good, red for bad, gray for neutral]

**What we're NOT borrowing:**
- [What doesn't fit. Example: "Stripe's minimal navigation (top bar with few items) — our product has too many sections for a top bar. We need a sidebar."]

### Reference 2: [Product Name]

**What they do well:** [Specific pattern]

**What we're borrowing:**
- [Pattern 1]
- [Pattern 2]

**What we're NOT borrowing:**
- [What doesn't fit]

### Reference 3: [Product Name]

**What they do well:** [Specific pattern]

**What we're borrowing:**
- [Pattern 1]
- [Pattern 2]

**What we're NOT borrowing:**
- [What doesn't fit]

### Reference 4: [Product Name]

**What they do well:** [Specific pattern]

**What we're borrowing:**
- [Pattern 1]

### Reference 5: [Product Name]

**What they do well:** [Specific pattern]

**What we're borrowing:**
- [Pattern 1]

---

## Proposed Design Language

The design direction synthesized from research, references, and domain requirements.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | [Hex + swatch description] | [Primary actions, active states, links] |
| `--primary-foreground` | [Hex] | [Text on primary-colored backgrounds] |
| `--success` | [Hex] | [Completed, active, healthy, paid, on-time] |
| `--warning` | [Hex] | [Attention needed, expiring, delayed, partial] |
| `--destructive` | [Hex] | [Failed, overdue, cancelled, critical] |
| `--info` | [Hex] | [In-progress, informational, neutral] |
| `--background` | [Hex] | [Page background] |
| `--card` | [Hex] | [Card/surface background] |
| `--border` | [Hex] | [Borders, dividers] |
| `--foreground` | [Hex] | [Primary text] |
| `--muted-foreground` | [Hex] | [Secondary/muted text] |

**Rationale:** [Why these specific colors. Example: "Indigo primary — professional without being cold (navy) or boring (gray). Distinct from all status colors, so primary actions never conflict with status indicators. Accessible: passes WCAG AA on white backgrounds."]

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | [Font name + fallback stack] | [All UI text] |
| `--font-mono` | [Font name + fallback stack] | [IDs, codes, technical data] |
| `--text-xs` | [11px] | [Overline labels, tiny metadata] |
| `--text-sm` | [12-13px] | [Table cells, badges, helper text] |
| `--text-base` | [14px] | [Default body text, form labels] |
| `--text-lg` | [16px] | [Card headings, emphasized text] |
| `--text-xl` | [20px] | [Section headings] |
| `--text-2xl` | [24px] | [Page headings] |
| `--text-3xl` | [30px] | [Display text (rare)] |

**Rationale:** [Why. Example: "14px base (not 16px) because our power users need data density — 14px allows more rows visible in tables without sacrificing readability. Inter font: excellent at small sizes, wide language support, professional."]

### Density

| Screen Type | Row Height | Card Padding | Section Gap |
|-------------|-----------|-------------|-------------|
| Data tables | [36-40px] | N/A | N/A |
| Kanban cards | N/A | [12px] | [8px between cards] |
| Dashboard KPIs | N/A | [16-20px] | [16px between cards] |
| Forms | [56-64px per field row] | [24px] | [24px between sections] |
| Detail pages | [Varies] | [16-24px] | [24px between sections] |

### Component Aesthetic

| Property | Value | Rationale |
|----------|-------|-----------|
| Border radius | [e.g., 8px cards, 6px inputs, 4px badges] | [Reason] |
| Shadows | [e.g., "sm" for cards, "md" for dropdowns, none for buttons] | [Reason] |
| Border width | [e.g., 1px for cards and inputs] | [Reason] |
| Icon style | [e.g., Lucide, 16px default, 1.5px stroke] | [Reason] |
| Hover states | [e.g., Subtle background color shift, not border/shadow changes] | [Reason] |
| Focus states | [e.g., 2px ring in primary color with 2px offset] | [Required for accessibility] |

---

## Critical UI Screens

The 3-5 most important screens in the application. These screens are where users spend 80% of their time, and getting them right is essential. Each screen has clear requirements for what it must communicate at a glance.

### Screen 1: [Name — e.g., "Dispatch Board"]

**Primary persona:** [Who uses this screen most]
**Time spent here:** [e.g., "6+ hours/day"]

**What it must communicate in 5 seconds:**
- [e.g., "How many trips need attention right now?"]
- [e.g., "Which drivers are available vs. occupied?"]
- [e.g., "Are any trips running late?"]

**Layout requirements:**
- [e.g., "Kanban columns by trip status, left-to-right: Unassigned > Assigned > En Route > At Pickup > In Transit > Completed"]
- [e.g., "Driver availability panel (collapsible) showing each driver's current status and vehicle"]
- [e.g., "Alert banner at top for critical issues (late trips, driver no-shows)"]

**Key interactions:**
- [e.g., "Drag trip card to different column = status change"]
- [e.g., "Click trip card = slide-over detail panel"]
- [e.g., "Click driver = see their assigned trips highlighted"]

**Mobile behavior:**
- [e.g., "Single column view with status tabs; swipe between statuses"]

### Screen 2: [Name — e.g., "Dashboard"]

**Primary persona:** [Who]
**Time spent here:** [Duration]

**What it must communicate in 5 seconds:**
- [Metric 1]
- [Metric 2]
- [Metric 3]

**Layout requirements:**
- [Requirements]

**Key interactions:**
- [Interactions]

### Screen 3: [Name — e.g., "Trip Detail"]

**Primary persona:** [Who]
**Time spent here:** [Duration]

**What it must communicate in 5 seconds:**
- [Info 1]
- [Info 2]

**Layout requirements:**
- [Requirements]

**Key interactions:**
- [Interactions]

### Screen 4: [Name — e.g., "Invoices List"]

**Primary persona:** [Who]
**Time spent here:** [Duration]

**What it must communicate in 5 seconds:**
- [Info 1]
- [Info 2]

**Layout requirements:**
- [Requirements]

### Screen 5: [Name — e.g., "Trip Creation Form"]

**Primary persona:** [Who]
**Time spent here:** [Duration]

**What it must communicate:**
- [What fields are required]
- [What's been validated]
- [What comes next after submission]

**Layout requirements:**
- [Requirements]

---

## Round 3 Synthesis

### Approved Design Direction

| Decision | Choice | Rationale | Status |
|----------|--------|-----------|--------|
| **Brand personality** | [3-5 adjectives] | [Summary] | Approved |
| **Primary color** | [Color + hex] | [Why] | Approved |
| **Typography** | [Font + base size] | [Why] | Approved |
| **Navigation** | [Pattern] | [Why] | Approved |
| **Density strategy** | [Description] | [By screen type] | Approved |
| **Mobile strategy** | [Responsive / Adaptive / etc.] | [Why] | Approved |
| **Icon library** | [Library name] | [Why] | Approved |
| **Component library** | [e.g., shadcn/ui] | [Why] | Approved |

### Tokens to Establish in Phase 0

Design tokens that must be defined before any UI development begins:

| Category | Tokens | Count |
|----------|--------|-------|
| Colors | Primary, secondary, status, neutral scales | [N tokens] |
| Typography | Font families, size scale, weight scale, line heights | [N tokens] |
| Spacing | 4px-48px scale | [N tokens] |
| Border radius | Components, inputs, badges, full round | [N tokens] |
| Shadows | sm, md, lg, none | [N tokens] |
| Breakpoints | Mobile, tablet, desktop, wide | [4 tokens] |

### Anti-Patterns Encoded as Rules

Rules that can be checked during design review (manual or automated):

1. [e.g., "No more than 6 KPI cards above the fold on any screen"]
2. [e.g., "Status colors must use only the 5 defined semantic colors — no ad-hoc color choices"]
3. [e.g., "No text smaller than 11px anywhere in the UI"]
4. [e.g., "Every data table must support column sorting and have a defined empty state"]
5. [e.g., "Modal dialogs are only for destructive action confirmation — never for viewing data"]
6. [e.g., "Primary action button (CTA) limited to 1 per visible section"]
7. [Rule]
8. [Rule]

### Open Design Questions

Questions that couldn't be resolved in Round 3 and need to be addressed during development:

1. [e.g., "Should the dispatch board default to Kanban or Timeline view? Need user testing to decide."]
2. [e.g., "Dark mode scope: full app or only the dispatch board (for dispatchers working night shifts)?"]
3. [Question]

---

*This document feeds into proceedings/round-4-prioritization.template.md and 07-ui-design-system/*
