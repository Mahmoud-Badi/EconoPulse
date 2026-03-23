# Design Quality Checklist

> **Purpose:** Prevent the "default Tailwind with gray borders" problem. Every UI component and page must pass this checklist before it ships.
> **When to use:** After generating any component, page, or screen. Before design review (Step 39). During hardening (Steps 29-33).
> **Why this exists:** AI-generated UI consistently produces generic, algorithmically flat output. Tools like Lovable produce more visually polished results because they have stronger design constraints. This checklist enforces those constraints.

---

## The Core Question

Before shipping any UI, answer: **"Would a designer at a funded startup be embarrassed to show this to their CEO?"**

If yes → it's not done. If you're not sure → it's not done.

---

## Visual Quality Gates

### 1. Hierarchy & Composition

- [ ] **Clear visual hierarchy** — Can you tell what's most important on this page in 2 seconds?
- [ ] **Intentional spacing** — No default margins. Spacing follows a consistent scale (4px, 8px, 16px, 24px, 32px, 48px, 64px).
- [ ] **Section breathing room** — Major sections have at least 48px separation. Content doesn't feel cramped.
- [ ] **Alignment grid** — All elements align to an invisible grid. Nothing feels randomly placed.
- [ ] **Max content width** — Prose doesn't stretch beyond ~65ch. Tables and dashboards can be wider.

### 2. Typography

- [ ] **Font hierarchy** — At least 3 distinct text sizes with clear purpose (heading, body, caption/label).
- [ ] **Font weight variation** — Bold for headings, regular for body, medium for labels. Not everything the same weight.
- [ ] **Line height** — Body text at 1.5-1.6 line height. Headings at 1.1-1.3. Never 1.0.
- [ ] **Text color contrast** — Primary text ≥ 7:1 contrast ratio (WCAG AAA). Secondary text ≥ 4.5:1 (WCAG AA).
- [ ] **No orphaned headings** — Every heading has content below it. No heading immediately followed by another heading.

### 3. Color & Theming

- [ ] **Max 3 colors** — One primary accent, one secondary, one for states (error/success/warning). Plus neutrals.
- [ ] **Intentional neutral palette** — Not random grays. Use zinc/slate/neutral scale consistently.
- [ ] **State colors are semantic** — Green = success, amber = warning, red = error. Never decorative.
- [ ] **Hover/focus states** — Every interactive element has a visible hover AND focus state. Not just opacity change.
- [ ] **Dark mode consistency** — If dark mode: backgrounds are truly dark (zinc-900/950), not medium gray.

### 4. Components & Patterns

- [ ] **No naked buttons** — Every button has proper padding (px-4 py-2 minimum), border radius, and visual weight.
- [ ] **Card depth** — Cards use subtle borders OR shadows, not both. Shadow direction is consistent (always from top).
- [ ] **Form field consistency** — All inputs same height, same border radius, same border color, same focus ring.
- [ ] **Empty states** — Every data component has an empty state with illustration or icon + helpful message + CTA.
- [ ] **Loading states** — Skeleton loaders or shimmer effects, not just spinner. Match the content layout.
- [ ] **Error states** — Inline errors near the source, not just toast notifications. Red border + message below field.

### 5. Layout & Responsiveness

- [ ] **Mobile-first** — Layout works on 375px width. Not just "doesn't break" but "actually looks designed for mobile."
- [ ] **Consistent padding** — Page padding is consistent (16px mobile, 24px tablet, 32px+ desktop). Not random.
- [ ] **Navigation clarity** — User always knows where they are (active nav state, breadcrumbs, or page title).
- [ ] **No horizontal scroll** — Nothing causes horizontal scroll on any screen size. Check tables, code blocks, images.

### 6. Micro-Interactions

- [ ] **Button feedback** — Buttons show press state (scale or darken on click).
- [ ] **Transition smoothness** — State changes (tabs, accordions, modals) have 150-200ms transitions. Not instant, not slow.
- [ ] **Scroll behavior** — If using sticky headers, they don't jump. Content below flows naturally.

---

## Anti-Patterns (Things That Scream "AI Generated")

| Pattern | Problem | Fix |
|---|---|---|
| Gray borders everywhere | Looks like wireframe, not designed product | Use subtle shadows or colored borders selectively |
| Default Tailwind blue | `blue-500` as primary accent = generic | Choose a brand-appropriate hue from the design tokens |
| Equal spacing everywhere | No visual rhythm | Use larger gaps between sections, smaller within |
| Centered everything | Boring, lacks dynamism | Left-align most content. Center only hero sections |
| Grid of identical cards | Screams template | Vary card sizes, add featured/highlighted cards |
| No whitespace | Content is wall-to-wall | Add 30-40% more spacing than your first instinct |
| Rainbow colors | Every section different color | Pick ONE accent color + neutrals. Color is for emphasis |
| Stock icon soup | Random Lucide icons scattered everywhere | Use icons only where they clarify meaning. Less is more |

---

## Design Review Trigger

This checklist must be reviewed:
1. **After generating any new page or component** — quick self-check
2. **At Step 13 (Design System)** — full checklist for token decisions
3. **At Step 39 (Design Review Portal)** — comprehensive visual review
4. **During Step 29+ (Hardening)** — final pass before code generation

If 3+ items fail → the component is not ready for code. Fix design first.
