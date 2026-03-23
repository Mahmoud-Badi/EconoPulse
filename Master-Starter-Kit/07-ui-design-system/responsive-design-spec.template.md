# Responsive Design Specification — {{PROJECT_NAME}}

> **Purpose:** Defines how every component and screen behaves across breakpoints. Prevents the "it works on desktop" problem.
> **Generated at:** Step 6.7
> **Cross-references:** Screen specs (Step 6), design tokens (Step 13), responsive testing template

---

## 1. Breakpoint Definitions

| Tier | Name | Min Width | Max Width | Target Devices | Orientation |
|------|------|-----------|-----------|----------------|-------------|
| T1 | Phone | 320px | 767px | iPhone SE → iPhone 16 Pro Max, Pixel, Galaxy | Portrait primary |
| T2 | Tablet | 768px | 1023px | iPad Mini, iPad Air, Galaxy Tab, Surface Go | Both orientations |
| T3 | Desktop | 1024px | 1439px | Laptops, standard monitors | Landscape |
| T4 | Ultrawide | 1440px | ∞ | Large monitors, ultrawide displays | Landscape |

### Breakpoint CSS Variables

```css
:root {
  --breakpoint-phone: 767px;
  --breakpoint-tablet: 1023px;
  --breakpoint-desktop: 1439px;
}
```

<!-- IF {{FRONTEND_FRAMEWORK}} == "nextjs" OR {{FRONTEND_FRAMEWORK}} == "react" -->
### Tailwind Configuration

```js
screens: {
  'sm': '640px',   // Large phones (landscape)
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1440px', // Ultrawide
}
```
<!-- ENDIF -->

---

## 2. Component Responsive Patterns

Every UI component must declare its responsive behavior using one of these patterns:

| Pattern | Description | When to Use | Example |
|---------|-------------|-------------|---------|
| **Stack** | Horizontal → vertical layout | Side-by-side elements on phone | Form fields, card grids |
| **Hide** | Element hidden below breakpoint | Non-essential info on mobile | Secondary stats, sidebar |
| **Collapse** | Content behind toggle/accordion | Long content on small screens | Filter panels, detail sections |
| **Overflow** | Horizontal scroll container | Wide tables, timelines | Data tables, kanban boards |
| **Reflow** | Complete layout restructure | Complex layouts that can't stack | Dashboard panels, split views |
| **Simplify** | Reduced version of component | Complex interactions on touch | Multi-select → single select |
| **Sheet** | Modal → bottom sheet | Overlays on mobile | Modals, popovers, dropdowns |
| **Tabs** | Sections → tabbed interface | Multiple panels on mobile | Settings, profile sections |

### Component Behavior Matrix

> Fill in for EVERY component type in your design system.

| Component | Phone (T1) | Tablet (T2) | Desktop (T3) | Ultrawide (T4) |
|-----------|-----------|-------------|--------------|-----------------|
| Navigation | Sheet (hamburger) | Tabs (bottom) | Sidebar (collapsed) | Sidebar (expanded) |
| Data Table | Overflow OR Card list | Overflow | Full table | Full table + side panel |
| Form | Stack (full-width) | Stack (2-col) | Inline (3-col) | Inline (3-col, max-width) |
| Modal/Dialog | Sheet (full-screen) | Sheet (bottom) | Dialog (centered) | Dialog (centered, max-width) |
| Card Grid | 1 column | 2 columns | 3 columns | 4 columns |
| Dashboard | Stack (priority order) | 2-col grid | 3-col grid | 4-col grid |
| Sidebar | Hidden (sheet) | Overlay | Collapsed (icons) | Expanded (icons + labels) |
| Tabs | Scrollable | Scrollable | Fixed | Fixed |
| Dropdown | Sheet (full-width) | Dropdown | Dropdown | Dropdown |
| Date Picker | Native input | Native input | Custom picker | Custom picker |
| Charts/Graphs | Simplified | Full (touch) | Full (hover) | Full (hover + legend) |
| Filters | Sheet (filter panel) | Collapse (top bar) | Inline (sidebar) | Inline (sidebar) |

---

## 3. Screen-Specific Responsive Breakdowns

> For each of the 5-10 most complex screens, document exact responsive behavior.

### Template per Screen

```markdown
#### {{SCREEN_NAME}}

**Primary action at each breakpoint:**
- T1 (Phone): {{what's the primary CTA and how is it accessed?}}
- T2 (Tablet): {{same or different?}}
- T3 (Desktop): {{same or different?}}
- T4 (Ultrawide): {{what extra info is visible?}}

**Layout changes:**
- T1 → T2: {{what changes?}}
- T2 → T3: {{what changes?}}
- T3 → T4: {{what changes?}}

**Hidden at T1 (Phone):**
- {{element 1 — why it's hidden, where to find it}}
- {{element 2}}

**Touch-specific interactions (T1/T2):**
- {{swipe, long press, pull-to-refresh, etc.}}

**Keyboard shortcuts (T3/T4 only):**
- {{shortcuts that only apply on desktop}}
```

---

## 4. Industry-Specific Responsive Considerations

<!-- IF {{DOMAIN}} == "healthcare" OR {{DOMAIN}} == "ems" -->
### Healthcare / EMS
- **Gloved hands:** All touch targets ≥48px (not the default 44px)
- **Bright sunlight:** High contrast mode for outdoor use
- **Moving vehicle:** Large text, minimal scrolling, sticky headers
- **Quick glance:** Critical info visible without scrolling at T1
<!-- ENDIF -->

<!-- IF {{DOMAIN}} == "pos" OR {{DOMAIN}} == "retail" -->
### Point of Sale / Retail
- **Standing use:** Bottom-heavy UI, thumb-reachable actions
- **Quick transactions:** Minimal steps, large buttons
- **Receipt-width displays:** Support narrow screen widths (≤320px)
<!-- ENDIF -->

<!-- IF {{DOMAIN}} == "logistics" OR {{DOMAIN}} == "transportation" -->
### Logistics / Transportation
- **Map-centric:** Maps take priority at all breakpoints
- **One-hand use (drivers):** Critical actions in thumb zone
- **Offline indicators:** Prominent sync status at all breakpoints
<!-- ENDIF -->

### General Considerations (All Projects)
- Touch targets: minimum 44px × 44px (48px for critical actions)
- Font size: minimum 16px on mobile (prevents iOS zoom)
- Spacing: increase padding by 25% on touch devices
- Scrolling: prefer vertical scroll, avoid horizontal scroll (except data tables)
- Focus indicators: visible at all breakpoints for accessibility

---

## 5. Responsive Testing Matrix

> Every screen must be tested at all 4 breakpoints. Mark P (pass), F (fail), or N/A.

| Screen | T1 Phone (375px) | T1 Phone (390px) | T2 Tablet (768px) | T2 Tablet (1024px portrait) | T3 Desktop (1280px) | T4 Ultra (1440px) | T4 Ultra (1920px) |
|--------|-------------------|-------------------|--------------------|-----------------------------|---------------------|-------------------|-------------------|
| {{screen_1}} | | | | | | | |
| {{screen_2}} | | | | | | | |
| {{screen_3}} | | | | | | | |

### Testing Checklist Per Screen Per Breakpoint

- [ ] Primary action is visible and accessible
- [ ] All text is readable (no truncation that hides meaning)
- [ ] Touch targets meet minimum size requirements
- [ ] No horizontal overflow (except intentional scroll containers)
- [ ] Loading/error/empty states display correctly
- [ ] Navigation is accessible
- [ ] Modals/dialogs display correctly
- [ ] Forms are usable (labels visible, inputs reachable)
- [ ] Data tables are readable or have an alternative view
- [ ] Images/media scale appropriately

---

## 6. Responsive Utilities

### Breakpoint-Aware Components

```
ResponsiveContainer — wraps content, provides current breakpoint context
MobileOnly / DesktopOnly — show/hide by breakpoint
StackOnMobile — horizontal on desktop, vertical on phone
ScrollableTable — horizontal scroll wrapper for tables on mobile
BottomSheet — modal replacement on mobile
```

### Media Query Helpers

```css
/* Phone only */
@media (max-width: 767px) { }

/* Tablet and up */
@media (min-width: 768px) { }

/* Desktop and up */
@media (min-width: 1024px) { }

/* Ultrawide */
@media (min-width: 1440px) { }

/* Touch devices */
@media (hover: none) and (pointer: coarse) { }

/* Precise pointer (mouse) */
@media (hover: hover) and (pointer: fine) { }
```
