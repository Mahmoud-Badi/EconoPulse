# Design Benchmarks — What "Good" Looks Like

> **Purpose:** Concrete examples of what each component type should look like when done well vs when done poorly. The AI must reference these benchmarks when generating UI.
> **Why:** "Make it look good" is not actionable. "Match this level of polish" is.

---

## Dashboard / Data Display

### Good
- Cards with 1 metric each, large number, small label, trend indicator (arrow + percentage)
- Consistent card height across a row, subtle background differentiation
- Chart with clear legend, appropriate chart type (line for trends, bar for comparison)
- Data table with alternating row shading, sortable headers, action column right-aligned
- Filter bar above the data, visually connected to the content it filters

### Bad
- Giant table with every metric crammed into one view
- Charts with no legend or with legends that cover the chart
- Cards with different heights because content varies
- No visual connection between filters and the data they filter
- Identical styling for labels, values, and metadata — can't tell what's what

---

## Forms

### Good
- Labels above inputs (not placeholder text as labels — it disappears on focus)
- Logical grouping with section headings and spacing between groups
- Inline validation on blur, not on every keystroke
- Clear primary action button (filled), secondary action (outlined or text)
- Required field indicator (*) with "(required)" text for accessibility
- Error messages below the field, red border on the field, descriptive message

### Bad
- Long single-column form with no visual grouping
- Placeholder text as the only label (accessibility failure)
- Submit button that looks the same as cancel button
- Validation errors in a toast at the top of the page (user can't see which field failed)
- Required fields not marked until after submission fails

---

## Navigation

### Good
- Active state clearly different from default (not just bold — color, background, or border indicator)
- Mobile: bottom nav for primary actions (max 5 items), hamburger for secondary
- Desktop sidebar: collapsible with icons-only mode, sections with headings
- Breadcrumbs for hierarchical content (settings > team > members)
- Consistent placement — user never has to search for the nav

### Bad
- No active state indicator (user doesn't know where they are)
- Hamburger menu on desktop (hides primary navigation for no reason)
- More than 7 top-level nav items (cognitive overload)
- Nav items with icons but no labels (mystery meat navigation)
- Mobile nav that's just a shrunk desktop nav

---

## Empty States

### Good
- Illustration or icon that relates to the content type (not a generic "no data" icon)
- Clear headline: "No projects yet" not "No data found"
- Helpful subtext: "Create your first project to get started"
- Primary CTA button: "Create Project" — clear, actionable, prominent
- If content requires steps first: explain the prerequisite ("Connect your account to see data here")

### Bad
- Blank white/dark space with no message
- Generic "No data" text with no guidance
- Error-looking empty state (red icons, warning language)
- CTA that doesn't match the context ("Go to Settings" when the user needs to create content)

---

## Modals & Dialogs

### Good
- Clear title that states the action: "Delete this project?" not "Confirm"
- Descriptive body text explaining consequences
- Destructive actions use red button, positioned right (or left in RTL)
- Cancel is always available and always looks secondary
- Escape key and backdrop click close non-destructive modals
- Focus trapped inside the modal (keyboard users can't tab behind it)

### Bad
- "Are you sure?" with "OK" and "Cancel" (uninformative)
- Modal inside a modal (inception)
- No way to close except the X button
- Destructive action button looks the same as safe action
- Content that extends beyond the viewport with no scroll

---

## Loading States

### Good
- Skeleton loaders that match the content layout (same shape as cards, lists, text blocks)
- Subtle shimmer animation (left to right, 1.5s duration, ease-in-out)
- Progress indicators for operations that take > 3 seconds with percentage or step count
- Partial content: show what's loaded, skeleton what's still loading

### Bad
- Centered spinner with no context (user doesn't know what's loading or how long)
- "Loading..." text
- Full-page loader for a single component's data
- No loading state at all — content just pops in after a delay (layout shift)

---

## Tables

### Good
- Sticky header when scrolling
- Sortable columns with clear sort indicator (arrow showing direction)
- Row hover state (subtle background change)
- Action column right-aligned with icon buttons or dropdown menu
- Responsive: on mobile, transform to card layout or horizontally scrollable with fixed first column
- Pagination or infinite scroll with count ("Showing 1-20 of 156")

### Bad
- Table that overflows the container horizontally without scroll
- No header styling (headers look like data rows)
- Actions mixed into data columns
- No way to sort, filter, or search in tables with > 20 rows
- Tiny text crammed into narrow columns

---

## Design Quality Spectrum

| Level | Description | Acceptable For |
|---|---|---|
| **1 - Wireframe** | Gray boxes, no styling, placeholder text | Never — not even prototypes |
| **2 - Default Tailwind** | Using framework defaults, gray borders, blue-500 accent | Never — this is the "AI slop" level |
| **3 - Customized** | Brand colors applied, consistent spacing, proper typography | Internal tools, MVPs with investor demos |
| **4 - Polished** | Micro-interactions, loading states, empty states, responsive | Production SaaS, consumer products |
| **5 - Delightful** | Personality, animation, Easter eggs, beyond-expectations UX | Consumer products, design-forward brands |

**The kit targets Level 4 minimum.** Level 3 is acceptable only for admin dashboards and internal tools. Level 2 is never acceptable.
