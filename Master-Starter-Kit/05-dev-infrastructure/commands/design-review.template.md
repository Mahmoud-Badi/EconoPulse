# /design-review

Deep Playwright visual audit at 3 breakpoints. Requires the dev server running (`pnpm dev`).

## Prerequisites

- Dev server running at `http://localhost:3000`
- Playwright MCP server connected
- Seed data loaded (for realistic screenshots)

## Steps

### Step 1: Read Brand Context

Read design tokens and brand guidelines:
```
{DOCS_PATH}/design/DESIGN-TOKENS.md
{DOCS_PATH}/design/BRAND-GUIDELINES.md
```
Extract: primary color, font family, spacing scale, border radius, shadow levels, brand personality adjectives.

### Step 2: Screenshot at 3 Breakpoints

For the page being reviewed, capture screenshots at:

1. **Desktop (1440px)**: Standard wide desktop view
   ```
   browser_navigate to the target page
   browser_resize to 1440x900
   browser_take_screenshot → save as desktop.png
   ```

2. **Tablet (768px)**: iPad-sized view
   ```
   browser_resize to 768x1024
   browser_take_screenshot → save as tablet.png
   ```

3. **Mobile (375px)**: iPhone-sized view
   ```
   browser_resize to 375x812
   browser_take_screenshot → save as mobile.png
   ```

### Step 3: Accessibility Snapshot

Capture the accessibility tree:
```
browser_snapshot
```
Review:
- Heading hierarchy (h1 > h2 > h3, no skipped levels)
- All interactive elements have accessible names
- Form inputs have associated labels
- Navigation landmarks present (nav, main, aside)

### Step 4: Console Error Check

```
browser_console_messages
```
**FAIL if any console errors exist.** Warnings are acceptable but should be noted.

Exclude known acceptable warnings:
- React DevTools extension messages
- Next.js hot reload messages
- Third-party script warnings

### Step 5: Visual Token Compliance

Review each screenshot against design tokens:

| Element | Expected | Check |
|---------|----------|-------|
| Primary buttons | Brand primary color | Verify in screenshot |
| Page background | bg-background token | Should not be plain white |
| Card shadows | shadow-sm or shadow-md | Visible subtle shadows |
| Border radius | rounded-lg or rounded-xl | Consistent rounding |
| Typography | Font family from tokens | Correct font rendering |
| Spacing | Consistent gaps (gap-4, gap-6) | No cramped or overly spaced areas |
| Color contrast | WCAG AA (4.5:1 for text) | Text readable on backgrounds |

### Step 6: State Verification

Navigate through all states:

1. **Loading state**: Reload the page and verify skeleton/spinner shows briefly
2. **Error state**: Navigate to an invalid route (e.g., `/entities/invalid-uuid`) and verify error display
3. **Empty state**: If possible, filter to show zero results and verify empty state display
4. **Data state**: Already captured in Step 2 screenshots

For each state, take a screenshot.

### Step 7: Interactive State Audit

Test hover, focus, and disabled states:

1. **Hover**: Move cursor over buttons, links, table rows
   ```
   browser_hover over primary button
   browser_take_screenshot
   ```
   Verify: visible hover effect (color change, shadow, underline)

2. **Focus**: Tab through interactive elements
   ```
   browser_press_key Tab (multiple times)
   browser_take_screenshot
   ```
   Verify: visible focus ring on each element

3. **Disabled**: Find any disabled elements
   Verify: reduced opacity, cursor-not-allowed, no hover effect

### Step 8: Responsive Behavior

At each breakpoint, verify:

- [ ] No horizontal scrollbar appears
- [ ] Text doesn't overflow containers
- [ ] Images scale appropriately
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Navigation adapts (sidebar collapses or becomes hamburger menu)
- [ ] Tables become scrollable or cards on mobile
- [ ] Forms stack vertically on mobile
- [ ] Modals/dialogs fit the viewport

### Step 9: Reference Comparison

If a design spec exists for this screen:
```
{DOCS_PATH}/design/specs/{screen-type}-spec.md
```
Compare the screenshot against the spec. Note deviations.

If no spec exists, compare against the general design direction documented in brand guidelines.

### Step 10: Generate Report

```
DESIGN REVIEW REPORT
======================
Page: {page URL}
Date: {today}

Screenshots:
- Desktop (1440px): {attached}
- Tablet (768px): {attached}
- Mobile (375px): {attached}

Results:
┌──────────────────────┬────────┬─────────────────────────────────┐
│ Category             │ Result │ Notes                           │
├──────────────────────┼────────┼─────────────────────────────────┤
│ Token Compliance     │ {P/F}  │ {details}                       │
│ Component States     │ {P/F}  │ {details}                       │
│ Accessibility        │ {P/F}  │ {details}                       │
│ Console Errors       │ {P/F}  │ {count} errors                  │
│ Hover/Focus States   │ {P/F}  │ {details}                       │
│ Responsive (1440px)  │ {P/F}  │ {details}                       │
│ Responsive (768px)   │ {P/F}  │ {details}                       │
│ Responsive (375px)   │ {P/F}  │ {details}                       │
│ Design Spec Match    │ {P/F}  │ {deviations}                    │
└──────────────────────┴────────┴─────────────────────────────────┘

Overall: {PASS/FAIL}

Critical Issues (must fix before shipping):
1. {issue with screenshot reference}
2. ...

Minor Issues (fix when possible):
1. {issue}
2. ...

Recommendations:
1. {suggestion for improvement}
2. ...
```

## Critical Fail Criteria

The following always cause a FAIL:
- Any console error (Step 4)
- Missing loading, error, or empty state (Step 6)
- Hardcoded colors visible in components (Step 5)
- Touch targets under 44px on mobile (Step 8)
- Horizontal scrollbar on any breakpoint (Step 8)
- No visible focus indicator when tabbing (Step 7)
- Broken layout at any breakpoint (Step 8)

## Notes

- This command takes 2-5 minutes to run due to browser automation.
- Requires the Playwright MCP server to be connected.
- Start the dev server (`pnpm dev`) before running this command.
- Screenshots are transient -- they're for the current review session. For permanent records, save them to the project.
- Run `/design-verify` (fast code check) first to catch obvious issues before the slower visual review.
