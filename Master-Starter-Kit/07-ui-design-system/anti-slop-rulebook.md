# Anti-Slop Rulebook

## What Is Slop?

"Slop" is the collection of small design decisions that make AI-generated UI instantly recognizable as AI-generated. No single violation is catastrophic. But they accumulate. 10 small violations = a template-looking product. Zero violations = a professional product.

This rulebook is exhaustive. Run `/design-verify` after EVERY UI change to check for violations. Treat violations as bugs, not suggestions.

---

## Layout Slop

### Rule L1: Never make all stat cards the same size

**Bad:**
```
[  Revenue  ] [   Trips   ] [  Drivers  ] [  Vehicles  ]
    $9,541        80            8             6
```
All four cards are identical width and height. This looks like a tutorial.

**Good:**
```
[     Revenue: $9,541     ] [  Trips  ] [  Drivers  ]
[  24 completed today     ] [   80    ] [    8      ]
                             [Vehicles ]
                             [    6    ]
```
The most important metric (revenue) gets more space. Secondary metrics are smaller.

**Rule:** Vary card sizes by importance. The primary KPI gets 2x the space. Secondary KPIs can be grouped.

### Rule L2: Never use equal-width columns for unequal content

**Bad:**
```
[    Name: John Smith    ] [    Phone: 555-0123    ]
```
Name might be 5 characters or 30. Phone is always ~12. Equal widths waste space or cause overflow.

**Good:**
```
[       Name: John Smith       ] [ Phone: 555-0123 ]
```
Name column gets more space because names vary in length.

### Rule L3: Never center-align body text

**Bad:**
```
            This is a paragraph of text that describes
          something important about the trip. When center
           aligned, each line starts at a different x
                position, making it hard to scan.
```

**Good:**
```
This is a paragraph of text that describes something
important about the trip. Left-aligned text is easier
to scan because each line starts at the same position.
```

**Exception:** Center-align is fine for: page titles, empty state messages, single-line labels under icons.

### Rule L4: Never use more than 3 levels of nesting

**Bad:**
```
Card
  Section
    Subsection
      Group
        Item
          Detail    <-- Too deep
```

**Good:**
```
Card
  Section
    Item (with inline details)
```

Deeply nested layouts feel claustrophobic and confuse the visual hierarchy.

---

## Color Slop

### Rule C1: Never use gradient backgrounds on sections or headers

**Bad:**
```css
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
```

This is the number one "AI generated" signal. Real products use flat colors or very subtle gradients (nearly imperceptible).

**Good:**
```css
.header { background-color: var(--color-primary-600); }
/* OR for subtle depth: */
.header { background-color: var(--color-neutral-50); }
```

### Rule C2: Never use blue-purple gradient as your color scheme

The blue-to-purple gradient is the unofficial color of "AI made this." It appears in every AI-generated mockup, landing page, and template. Avoid it entirely.

### Rule C3: Never use neon accent colors

**Bad:** `#00ff88`, `#ff00ff`, `#00ffff`

**Good:** Use colors from your defined token palette. If you need an accent, use your primary at a different shade.

### Rule C4: Never use more than 3 colors + neutrals

Your palette should be:
- 1 primary color (with shade scale)
- 1-2 semantic colors as accents (success green, error red)
- 1 neutral system (gray/slate/zinc)

That's it. More colors = visual chaos.

### Rule C5: Never use color as the SOLE status indicator

**Bad:**
```
[green dot] [red dot] [yellow dot]
```
Colorblind users cannot distinguish these.

**Good:**
```
[green checkmark] Completed  [red X] Failed  [yellow clock] Pending
```
Color + icon + text. Triple redundancy. Everyone can understand the status.

---

## Component Slop

### Rule K1: Never use default shadcn without customization

Default shadcn/ui is excellent as a starting point. But every project that uses it without customization looks identical to every other project that uses it.

**Minimum customizations (see `component-customization.md`):**
1. Button: custom shadow, transition, loading state
2. Card: hover shadow, custom padding, border treatment
3. Input: hover border, focus ring with primary color

### Rule K2: Never use generic placeholder text in demos

**Bad:**
```
[Card Title]
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[Action Button]
```

**Good:**
```
[Trip #1247 - Downtown Route]
Pickup: 123 Main St at 9:00 AM | Passenger: Maria Johnson
[View Details]
```

Use domain-specific seed data that tells a story. Lorem ipsum screams "not real."

### Rule K3: Never make all buttons the same variant

**Bad:**
```
[Save] [Cancel] [Delete] [Export]   <-- All primary blue
```

**Good:**
```
[Save (primary)] [Cancel (ghost)] [Delete (destructive)] [Export (outline)]
```

Button hierarchy guides the user's attention. One primary action, secondary options use outline/ghost, destructive actions use red.

### Rule K4: Never skip hover, focus, and disabled states

Every interactive element needs all four states:
- **Default**: how it looks normally
- **Hover**: subtle feedback on mouse over (shadow, border color, slight color shift)
- **Focus**: visible focus ring for keyboard navigation (primary color ring)
- **Disabled**: reduced opacity, cursor not-allowed, no hover effect

**Missing states make the UI feel flat and unresponsive.**

---

## Typography Slop

### Rule T1: Never use more than 2 font weights on a page

**Bad:**
```
font-light (300) for labels
font-normal (400) for body
font-medium (500) for emphasis
font-semibold (600) for headings
font-bold (700) for page titles
font-extrabold (800) for hero text
```

**Good:**
```
font-normal (400) for body text, labels, descriptions
font-semibold (600) for headings, emphasis, button text
```

Two weights create a clear hierarchy without visual noise.

### Rule T2: Never use font-bold for headings

`font-bold` (700) is too heavy for most UI contexts. It creates thick, dominating text that competes with content.

**Use `font-semibold` (600) instead.** It's authoritative without being aggressive.

**Exception:** Marketing hero text on landing pages can use bold.

### Rule T3: Never use custom font sizes

**Bad:**
```css
font-size: 15px;
font-size: 13px;
font-size: 17px;
```

**Good:**
```css
/* Use the Tailwind scale */
text-xs   /* 12px */
text-sm   /* 14px */
text-base /* 16px */
text-lg   /* 18px */
text-xl   /* 20px */
text-2xl  /* 24px */
```

Custom sizes break the rhythm. The Tailwind scale is designed for visual harmony.

---

## Mobile Slop

### Rule M1: Never rely on hover-only interactions

Hover doesn't exist on touch devices. If information or actions are only accessible via hover, mobile users can't reach them.

**Bad:** Table row actions only visible on hover
**Good:** Table row actions in a dropdown menu, always accessible

### Rule M2: Never make touch targets smaller than 44x44px

Apple's Human Interface Guidelines and WCAG specify 44x44px minimum for touch targets. This includes buttons, links, form controls, and any clickable element.

```css
/* Ensure minimum touch target */
.action-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Rule M3: Never cause horizontal scroll

If the page scrolls horizontally on any device, something is wrong. Common causes:
- Fixed-width tables wider than the viewport
- Images without `max-width: 100%`
- `width` values exceeding viewport
- Long unbreakable strings (URLs, IDs)

**Fix for tables:** Wrap in a horizontally scrollable container:
```html
<div class="overflow-x-auto">
  <table>...</table>
</div>
```

**Fix for long strings:**
```css
.text-break {
  overflow-wrap: break-word;
  word-break: break-word;
}
```

---

## Spacing Slop

### Rule S1: Never mix spacing values inconsistently

**Bad:**
```
Card A: padding 16px
Card B: padding 20px
Card C: padding 24px
```

**Good:**
```
All cards: padding var(--space-card) /* 24px */
```

If all cards should have the same padding, use a token. If they intentionally differ, the difference should be meaningful (e.g., compact cards in a sidebar vs full cards on a page).

### Rule S2: Never use spacing smaller than 4px between elements

Spacing below 4px is imperceptible and creates visual tension. If elements need to be closer together, they should probably be a single element.

---

## Animation Slop

### Rule A1: Never add animations for decoration

**Bad:** Cards that bounce in on page load. Spinning icons. Pulsing buttons.

**Good:** Animations that communicate state changes:
- Skeleton shimmer while loading
- Smooth height transitions when content appears
- Subtle hover transitions (shadow, border color)
- Toast notifications sliding in/out

**Rule:** Every animation should answer: "What state change is this communicating?" If the answer is "none, it just looks cool," remove it.

### Rule A2: Never exceed 200ms for micro-interactions

Hover effects, focus rings, button presses: keep transition duration at 150-200ms. Longer feels sluggish. Shorter feels jarring.

```css
transition: all 0.15s ease;     /* hover effects */
transition: all 0.2s ease;      /* state changes */
transition: all 0.3s ease-out;  /* larger movements (modals, drawers) */
```

---

## Enforcement

### After Every UI Change

```
/design-verify
```

This runs a fast code-inspection against these rules. It checks the actual code for violations.

### Before Marking UI Done

```
/design-review {route}
```

This takes real screenshots at multiple breakpoints and reviews for visual violations that code inspection misses.

### In CLAUDE.md

Add the most frequently violated rules to your project's CLAUDE.md:

```markdown
## Anti-Slop Rules (Always Enforce)
- No gradient backgrounds
- No equal-size stat cards
- No default shadcn without customization
- No hover-only interactions
- No more than 2 font weights
- Color is never the sole status indicator
```

This ensures Claude checks these rules even without running `/design-verify`.
