# Design Brief: [PROJECT NAME]

> **Date:** [YYYY-MM-DD]
> **Prepared By:** [UI Designer agent / human]
> **Reference Products Analyzed:** [N]
> **Target User Types:** [List primary user types]

---

## Brand Personality

Define the product's personality with **3-5 adjectives** and a brief justification for each. These adjectives guide every design decision — from color choice to microcopy tone.

| Adjective | What It Means for Our Product | What It Doesn't Mean |
|-----------|------------------------------|---------------------|
| **[e.g., Professional]** | [Clean layouts, clear hierarchy, no playful illustrations or emojis in UI chrome. Users trust this product with their business.] | [Not "corporate" — we're not boring or stiff. We're professional like Stripe, not professional like Oracle.] |
| **[e.g., Efficient]** | [Dense information display, fast interactions, keyboard shortcuts for power users. Every click must earn its place.] | [Not "minimal" — we don't hide information to look clean. We show it clearly.] |
| **[e.g., Reliable]** | [Consistent behavior, predictable navigation, clear status indicators. The user never wonders "did that action work?"] | [Not "safe" — we're not afraid of color or boldness. We're reliable in behavior, not timid in appearance.] |
| **[e.g., Warm]** | [Rounded corners, approachable colors, friendly empty states. The product feels human despite being data-dense.] | [Not "playful" — we don't use confetti animations or cartoon mascots. We're warm like a competent colleague.] |
| **[e.g., Focused]** | [Clear visual hierarchy, prominent primary actions, muted secondary elements. The most important thing on each screen is obvious.] | [Not "simple" — the underlying workflows are complex. We present complexity clearly, we don't eliminate it.] |

**One-sentence brand statement:** [Example: "This product feels like having a highly competent operations coordinator who presents complex information clearly and never makes you wait."]

---

## Color Direction

### Primary Palette

| Role | Color | Hex | Usage | Rationale |
|------|-------|-----|-------|-----------|
| **Primary** | [e.g., Indigo] | [#4f46e5] | Buttons, active states, primary actions, links | [Why: Professional but not cold. Distinct from status colors. Accessible.] |
| **Primary Hover** | [e.g., Dark Indigo] | [#4338ca] | Button hover, active link hover | [Darker shade for clear interaction feedback] |
| **Primary Muted** | [e.g., Light Indigo] | [#e0e7ff] | Selected row backgrounds, badges, subtle highlights | [Low-contrast for backgrounds without competing with text] |

### Semantic / Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| **Success** | [Green] | [#22c55e] | Completed, active, healthy, paid, on-time |
| **Warning** | [Amber] | [#f59e0b] | Attention needed, expiring soon, partial, delayed |
| **Error/Danger** | [Red] | [#ef4444] | Failed, overdue, cancelled, critical alert |
| **Info** | [Blue] | [#3b82f6] | In-progress, informational, neutral notification |

### Neutral Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Background** | [#ffffff] | Page background (light mode) |
| **Surface** | [#f9fafb] | Card backgrounds, table row alternation |
| **Border** | [#e5e7eb] | Card borders, dividers, table borders |
| **Text Primary** | [#111827] | Headings, important text |
| **Text Secondary** | [#6b7280] | Labels, descriptions, secondary info |
| **Text Muted** | [#9ca3af] | Placeholders, disabled text, timestamps |

### Dark Mode (if applicable)

| Role | Light | Dark |
|------|-------|------|
| Background | #ffffff | [#0f172a] |
| Surface | #f9fafb | [#1e293b] |
| Border | #e5e7eb | [#334155] |
| Text Primary | #111827 | [#f1f5f9] |
| Text Secondary | #6b7280 | [#94a3b8] |

**Dark mode priority:** [Essential (user works at night) / Nice-to-have (defer to V2) / Not needed (office-only product)]

---

## Typography

### Font Choice

| Element | Font | Fallback Stack | Rationale |
|---------|------|---------------|-----------|
| **Headings** | [e.g., Inter] | [-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif] | [Why: Clean, professional, excellent at all sizes, wide language support] |
| **Body Text** | [e.g., Inter] | [Same fallback stack] | [Consistency with headings; high readability at small sizes] |
| **Monospace** | [e.g., JetBrains Mono] | ["Fira Code", "Cascadia Code", monospace] | [For IDs, codes, technical data — needs to be clearly distinct from body text] |

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Display** | 30px / 1.875rem | 700 (Bold) | 1.2 | Page titles (rare — only on landing/marketing pages) |
| **H1** | 24px / 1.5rem | 600 (Semibold) | 1.3 | Page headings ("Trips", "Dashboard", "Invoice #1234") |
| **H2** | 20px / 1.25rem | 600 (Semibold) | 1.35 | Section headings within a page |
| **H3** | 16px / 1rem | 600 (Semibold) | 1.4 | Card headings, panel titles |
| **Body** | 14px / 0.875rem | 400 (Regular) | 1.5 | Default body text, table cells, form labels |
| **Small** | 12px / 0.75rem | 400 (Regular) | 1.5 | Captions, timestamps, badge text, helper text |
| **Tiny** | 11px / 0.6875rem | 500 (Medium) | 1.4 | Uppercase labels, overline text (use sparingly) |

**Important:** Never go below 11px for any text. Accessibility requires minimum 12px for body content.

---

## Navigation Pattern

**Chosen pattern:** [e.g., "Collapsible left sidebar with breadcrumbs"]

**Rationale:** [Why this pattern fits our product. Example: "Our product has 8+ top-level sections (Dashboard, Trips, Dispatch, Drivers, Vehicles, Billing, Reports, Settings) which is too many for a top navigation bar. A left sidebar provides clear grouping with room to grow. It collapses to icon-only on smaller screens to preserve content space for data-dense views like the dispatch board."]

### Navigation Structure

```
[Icon] [Product Name / Logo]
─────────────────────────
[Icon] Dashboard
[Icon] Trips
  └ All Trips
  └ Recurring
  └ Create Trip
[Icon] Dispatch
  └ Board View
  └ Timeline View
[Icon] Fleet
  └ Drivers
  └ Vehicles
  └ Maintenance
[Icon] Billing
  └ Invoices
  └ Payments
  └ Rate Tables
[Icon] Reports
  └ Operations
  └ Financial
  └ Compliance
─────────────────────────
[Icon] Settings
[Icon] User Profile
```

### Navigation Behavior

| Behavior | Decision | Rationale |
|----------|----------|-----------|
| **Collapse** | [Icon-only on < 1024px, hidden on < 768px with hamburger] | [Preserve content space for data tables and maps] |
| **Active state** | [Highlighted background + left border accent] | [Clear indication of current location] |
| **Nested items** | [Expandable/collapsible with chevron] | [Keep sidebar scannable — don't show all sub-items at once] |
| **Breadcrumbs** | [Show on all pages below top-level] | [Help with deep navigation: Dashboard > Trips > Trip #1234 > Edit] |
| **Keyboard navigation** | [Command palette (Cmd+K) for quick jump] | [Power users skip the sidebar entirely] |

---

## Data Density

**Overall approach:** [e.g., "Dense for operational screens (dispatch, trips list), comfortable for management screens (dashboard, reports), sparse for settings and forms."]

| Screen Type | Density | Justification |
|-------------|---------|---------------|
| Dashboard | Medium | KPIs need breathing room; charts need space; but still show 6-8 metrics above fold |
| Data tables (trips, invoices) | High | Power users scan these all day; maximize rows visible; compact row height |
| Detail pages (trip detail, driver profile) | Medium | Mixed content — structured fields + activity log + related items |
| Forms (create/edit) | Comfortable | Users need to focus on input; don't crowd fields; clear labels |
| Dispatch board (Kanban/timeline) | High | Operational — dispatcher needs to see as many trips and drivers as possible |
| Settings | Sparse | Changed infrequently; clarity > density; group related settings |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline spacing, icon padding |
| `space-2` | 8px | Compact element spacing, table cell padding |
| `space-3` | 12px | Default element spacing, card padding (compact) |
| `space-4` | 16px | Standard card padding, form field spacing |
| `space-6` | 24px | Section spacing, card gaps |
| `space-8` | 32px | Page section margins |
| `space-12` | 48px | Major section separators |

---

## Reference Products

Products we're borrowing specific patterns from:

| Product | What We're Borrowing | Specific Pattern | Screenshot Reference |
|---------|---------------------|-----------------|---------------------|
| [e.g., Stripe Dashboard] | [KPI card layout, status color hierarchy] | [4 KPI cards at top, full-width chart below, recent activity list] | [Link or filename] |
| [e.g., Linear] | [Keyboard-first navigation, command palette] | [Cmd+K opens palette, shortcuts for every action, minimal mouse dependency] | [Link or filename] |
| [e.g., Vercel Dashboard] | [Deployment status timeline, clean detail pages] | [Timeline with status dots, expandable detail sections, breadcrumb navigation] | [Link or filename] |
| [e.g., Notion] | [Flexible table views, clean data presentation] | [Toggle between table/board/calendar views, inline editing, clean filters] | [Link or filename] |
| [e.g., Uber Fleet] | [Map + list split view for dispatch] | [Map occupies 60% of screen, list occupies 40%, clicking list item focuses map] | [Link or filename] |

---

## Anti-Patterns to Avoid

Specific things that look bad or work poorly in this domain. Each anti-pattern should be concrete enough to check against during design review.

| Anti-Pattern | Why It's Bad | How to Avoid It |
|-------------|-------------|-----------------|
| **[e.g., Rainbow status colors]** | [Using 8+ different colors for statuses makes it impossible to learn what each means. Users develop "color blindness" to the status system.] | [Limit to 5 semantic colors (green/amber/red/blue/gray). Every additional color needs strong justification.] |
| **[e.g., Modal overload]** | [Opening a modal for every action (edit, delete, confirm, view detail) creates a frustrating experience. Modals interrupt flow.] | [Use inline editing for quick changes, slide-over panels for details, and modals only for destructive confirmations.] |
| **[e.g., Fake real-time]** | [Showing "last updated 5 min ago" on a dispatch board where minutes matter. Stale data in time-sensitive contexts erodes trust.] | [Use real-time updates (SSE/WebSocket) for operational screens. Show "Live" indicator when data is real-time.] |
| **[e.g., Hidden actions]** | [Making users hunt for the "Edit" or "Delete" button behind a "..." menu for common actions they perform 50+ times/day.] | [Common actions (edit, assign, status change) should be visible, not behind overflow menus. Rare actions (delete, archive) can be behind "...".] |
| **[e.g., Desktop-only tables]** | [Data tables that require 1920px to be usable. On 1366px laptops (common in fleet offices), columns are cut off or require horizontal scrolling.] | [Design tables for 1366px minimum. Use column priority (hide low-priority columns first). Test at common breakpoints.] |
| **[e.g., Generic empty states]** | [Showing "No data found" with no guidance. Users don't know if they need to create something, change filters, or if it's a bug.] | [Empty states should have: illustration (optional), message, and a clear CTA ("Create your first trip" with a button).] |

---

## Mobile Strategy

**Chosen strategy:** [Responsive / Adaptive / Mobile-first / Separate app / Desktop only]

**Rationale:** [Why this strategy fits our users. Example: "Dispatchers and billing clerks are always at desks — they need desktop optimization. Drivers need a mobile experience for trip details and status updates, but a separate native app is out of scope for V1. We'll build responsive with a 'driver mode' that simplifies the interface on mobile screens."]

| User Type | Primary Device | Mobile Needs | Our Approach |
|-----------|---------------|-------------|--------------|
| [Dispatcher] | Desktop (1366-1920px) | Rare — emergency check only | Responsive but optimized for desktop |
| [Driver] | Mobile (375-428px) | Core workflow — view trips, update status, navigate | Responsive with simplified mobile layout |
| [Manager] | Desktop + Tablet | Occasional — review dashboards on iPad | Responsive, works well at 768px+ |
| [Billing Clerk] | Desktop (1366-1920px) | Never | Desktop-optimized |

### Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Mobile | < 640px | Single column, bottom nav, cards instead of tables |
| Tablet | 640-1023px | Two-column where needed, sidebar collapses to icons |
| Desktop | 1024-1279px | Full layout, sidebar expanded, standard table widths |
| Wide | 1280px+ | Extra space for maps, wide tables, split-pane views |

---

## Component Style Direction

High-level guidance for the design system's component aesthetic:

| Property | Direction | Example |
|----------|-----------|---------|
| **Border Radius** | [e.g., Medium (8px default, 12px for cards, 6px for inputs)] | [Not sharp (2px) — feels dated. Not fully rounded (16px) — feels too casual for business software.] |
| **Shadows** | [e.g., Subtle (0 1px 3px rgba(0,0,0,0.1)) for cards, none for buttons] | [Minimal shadow usage. Borders preferred over shadows for separation. Shadow only for elevated elements (dropdowns, modals).] |
| **Borders** | [e.g., 1px solid with muted color (#e5e7eb)] | [Light borders for structure. Not heavy borders — avoid the "boxed in" feel.] |
| **Icons** | [e.g., Lucide (outline style, 1.5px stroke)] | [Consistent icon library. Outline style matches our professional-but-warm personality.] |
| **Buttons** | [e.g., Solid primary, outline secondary, ghost tertiary] | [Primary: filled with primary color. Secondary: outline with subtle background on hover. Destructive: red variant for delete/cancel actions.] |
| **Inputs** | [e.g., Bordered with focus ring, not underlined] | [Full border (not material design underline). Focus state: ring with primary color. Error state: red border + helper text.] |
| **Animations** | [e.g., Subtle and fast (150-200ms transitions)] | [Page transitions: none (SPA navigation is instant). Micro-interactions: 150ms ease for hover/focus. Loading: skeleton screens, not spinners.] |

---

*This design brief feeds into proceedings/round-3-design.template.md and 07-ui-design-system/*
