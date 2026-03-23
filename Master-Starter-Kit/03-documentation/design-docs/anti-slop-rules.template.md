# Anti-Slop Design Rules — {{PROJECT_NAME}}

> **"Slop" is the visual equivalent of spaghetti code.** It's the default, unthinking design choices that make an app look generic, amateurish, or AI-generated. This document catalogs every anti-pattern and its correction.

**Enforcement:** Run `/design-verify` after every UI change. Visual bugs are bugs. Treat slop with the same urgency as a failing test.

---

## 1. Layout Slop

### DON'T: Make all cards the same size

**The problem:** When a dashboard has 4 KPI cards, all exactly the same width, it looks templated and boring. Real data has hierarchy.

**The fix:** Size cards by importance. The primary metric gets a larger card. Secondary metrics are smaller. Use a grid with unequal columns where it makes sense.

```
BAD:  [====] [====] [====] [====]    (all same width, no hierarchy)
GOOD: [========] [====] [====] [==]  (primary metric larger, descending)
```

### DON'T: Use equal-width columns for unequal content

**The problem:** A 2-column layout where the left column has 3 form fields and the right has 30 lines of text. Equal columns = wasted space on the left, cramped on the right.

**The fix:** Use proportional widths. `grid-cols-[1fr_2fr]` for sidebar+content. `grid-cols-[2fr_1fr]` for content+sidebar.

### DON'T: Center everything

**The problem:** Center-aligned text in data-heavy UIs is hard to scan. Numbers should right-align. Names should left-align.

**The fix:**
- Text: left-align (default)
- Numbers/money: right-align
- Status badges: center in their column
- Actions: right-align
- Page titles: left-align (never center a page title in a dashboard)

### DON'T: Ignore content density

**The problem:** Huge padding, tiny data. A table with 5 rows fills the entire viewport because each row is 80px tall.

**The fix:** Match density to context. Data tables should be compact (36-44px rows). Forms can breathe more (56-64px field height). Dashboards are medium density.

---

## 2. Color Slop

### DON'T: Add gradients on section backgrounds

**The problem:** Background gradients scream "2015 template" or "AI-generated." They add visual noise without meaning.

**The fix:** Solid backgrounds only. Use color to distinguish hierarchy: `--color-bg` for page, `--color-bg-card` for cards, `--color-bg-muted` for subtle sections.

### DON'T: Use blue-purple "AI aesthetic"

**The problem:** The generic blue-to-purple gradient + glowing effects that every AI-generated landing page uses. It signals "we used a template."

**The fix:** Choose a distinctive primary color from the brand guidelines. Use it sparingly. Let the UI be about the content, not the chrome.

### DON'T: Use neon accents

**The problem:** Bright neon green, electric blue, or hot pink accents on a white background. High contrast without purpose.

**The fix:** Use the primary color shade scale. 500 for default, 600 for hover, 700 for active. All from the same hue. Accents should be semantic (success=green, error=red, warning=amber).

### DON'T: Use too many colors

**The problem:** More than 3-4 colors competing for attention on a single screen.

**The fix:** Primary + neutral + semantic. That's it. If you need more colors (charts), use a curated palette with the same saturation/lightness.

### DON'T: Ignore contrast ratios

**The problem:** Light gray text on white background. Looks "clean" but is unreadable.

**The fix:** WCAG AA minimum: 4.5:1 for body text, 3:1 for large text (18px+) and icons. Test every color combination.

---

## 3. Component Slop

### DON'T: Use default shadcn without customization

**The problem:** Uncustomized shadcn/ui looks like every other app that used shadcn/ui. Your app should have its own identity.

**The fix:** Customize every component:
- Buttons: Brand primary color, specific border radius, custom hover effect
- Cards: Custom shadow, specific padding, border color from tokens
- Tables: Custom row hover color, branded header background
- Inputs: Specific focus ring color, custom placeholder text color
- Badges: Custom color mapping per status

### DON'T: Skip hover/focus states

**The problem:** Clickable elements with no visual feedback. User doesn't know what's interactive.

**The fix:** Every interactive element needs:
- **Hover:** Background color change, shadow change, or opacity change
- **Focus:** Visible focus ring (3px, primary color, 50% opacity)
- **Active:** Slightly darker than hover
- **Disabled:** Reduced opacity (50%) + `cursor-not-allowed`

### DON'T: Use generic icons

**The problem:** A gear icon for settings, a house for home, a bell for notifications. It's correct but bland.

**The fix:** Choose icons that match your domain. For a transportation app, use vehicle/route icons. For a finance app, use dollar/chart icons. Keep them from the same icon family (never mix Lucide with FontAwesome).

### DON'T: Make all buttons the same

**The problem:** Primary and secondary actions look identical. User can't distinguish "Save" from "Cancel."

**The fix:**
- **Primary action:** Solid fill, brand color, prominent
- **Secondary action:** Outline or ghost variant
- **Destructive action:** Red variant (solid or outline)
- **Tertiary action:** Link-style or ghost

---

## 4. Copy Slop

### DON'T: Use "Welcome back, {name}!"

**The problem:** Generic personalization that adds nothing. Every SaaS app does this. It wastes the most valuable real estate on the page (top-left of dashboard).

**The fix:** Use that space for actionable information: "3 trips need attention today" or just the page title "Dashboard."

### DON'T: Use Lorem Ipsum or placeholder text

**The problem:** Placeholder text in demos, seed data, or screenshots looks unprofessional and makes it impossible to evaluate real layout issues.

**The fix:** Use realistic data. Names: "Sarah Johnson" not "Test User." Addresses: "123 Oak Street, Springfield, IL 62701" not "123 Test St." Phone: "(555) 234-5678" not "1234567890."

### DON'T: Write verbose empty states

**The problem:** "It looks like you haven't created any trips yet! Don't worry, getting started is easy. Just click the button below to create your first trip and begin your journey with {{PROJECT_NAME}}!"

**The fix:** "No trips yet." + [Create Trip] button. One sentence. One action.

### DON'T: Use title case for everything

**The problem:** "Create A New Trip For Your Passenger" — every word capitalized, awkward to read.

**The fix:** Sentence case for headings and buttons: "Create a new trip." Title case only for proper nouns and product names.

---

## 5. Interaction Slop

### DON'T: Show confirmation dialogs for non-destructive actions

**The problem:** "Are you sure you want to save?" — Yes, that's why I clicked Save.

**The fix:** Only confirm for destructive and irreversible actions (delete, cancel with data loss). For everything else, just do it and show a success toast.

### DON'T: Add unnecessary loading spinners

**The problem:** A spinner for an action that takes 50ms. It adds perceived latency.

**The fix:** Use optimistic updates for fast operations (toggle status, mark as read). Only show loading UI for operations that genuinely take >300ms. Use skeleton loading for initial page loads, not spinners.

### DON'T: Use full-page loading states

**The problem:** User navigates to a page and sees a centered spinner with nothing else. Context is lost.

**The fix:** Show the page structure immediately (skeleton). Load data into the skeleton. Sidebar and header should never disappear during loading.

### DON'T: Block interaction during non-critical loads

**The problem:** A background data refresh blocks the entire UI.

**The fix:** Background refreshes should be invisible. Only block UI when the user's current action depends on the result.

---

## 6. Mobile Slop

### DON'T: Allow horizontal scroll

**The problem:** Content wider than viewport on mobile. User has to scroll sideways to see data.

**The fix:** Test every page at 375px width. Tables become card layouts. Side-by-side elements stack vertically. Hide non-essential columns.

### DON'T: Use touch targets smaller than 44px

**The problem:** Tiny buttons, close-spaced links, small checkboxes on mobile.

**The fix:** Minimum 44x44px touch target for every interactive element. Add padding if the visual element is smaller.

### DON'T: Rely on hover-only interactions

**The problem:** Information shown only on hover (tooltips, action menus) is invisible on touch devices.

**The fix:** Every hover interaction must have a touch equivalent. Tooltips → long-press or info icon. Hover menus → visible action buttons or tap to expand.

### DON'T: Use desktop-width modals on mobile

**The problem:** A 600px-wide modal on a 375px screen, with content overflowing.

**The fix:** Modals on mobile should be full-width bottom sheets or full-screen. Never a floating centered dialog.

---

## 7. Table/Data Slop

### DON'T: Show empty tables with just headers

**The problem:** A table header row with no data rows. Looks broken.

**The fix:** Show a clear empty state inside the table area: icon + message + CTA. "No invoices found. [Create Invoice]"

### DON'T: Truncate without indication

**The problem:** Long text silently cut off at the column edge with no indication there's more.

**The fix:** Use `text-ellipsis` with `overflow-hidden` AND either a tooltip on hover or an expandable cell.

### DON'T: Use pagination for small datasets

**The problem:** "Showing 1-5 of 5 results. Page 1 of 1." Pagination adds complexity for no benefit.

**The fix:** Only show pagination controls when there are more than {{PAGE_SIZE}} items. Below that, show all items with no pagination.

---

## Enforcement Checklist

Run after every UI change. `/design-verify` automates most of these.

- [ ] No hardcoded colors (all from tokens)
- [ ] No gradients on section backgrounds
- [ ] No "Welcome back" text
- [ ] All interactive elements have hover + focus states
- [ ] No default shadcn without customization
- [ ] No confirmation dialogs for non-destructive actions
- [ ] Empty states are helpful (icon + message + CTA)
- [ ] Loading states use skeletons (not spinners)
- [ ] Mobile: no horizontal scroll at 375px
- [ ] Mobile: all touch targets >= 44px
- [ ] Text: proper contrast ratios (4.5:1 minimum)
- [ ] Tables: right-align numbers, left-align text
- [ ] No generic placeholder text
- [ ] Buttons have clear visual hierarchy (primary vs secondary)
