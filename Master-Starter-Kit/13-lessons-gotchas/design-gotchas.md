# Design Gotchas

Design bugs are real bugs. They affect user trust, perceived quality, and willingness to pay. Every gotcha here cost real time and real credibility.

---

## The Default shadcn Trap

Default shadcn/ui components look "fine" in isolation but "template-y" in production. Every other Next.js app uses the same defaults. Your app will look like a tutorial project.

**What to customize FIRST (highest visual impact):**

| Component | Default Look | What to Customize |
|-----------|-------------|-------------------|
| Button | Gray, flat | Brand colors, shadows, hover animations |
| Card | Simple border | Custom shadows, rounded corners, subtle gradients |
| Input | Basic outline | Focus ring color, height, padding |
| Badge | Muted colors | Brand-aligned status colors with icons |
| Table | Bare minimum | Row hover, striped rows, sticky headers |

**Rule:** Customize the top 5 most-used components before building any feature UI. The rest inherit the "feel" from these.

---

## Design BEFORE Code

```
WRONG workflow:
  1. Build feature (with default shadcn)
  2. "I'll make it pretty later"
  3. Never make it pretty
  4. Ship default-looking app

CORRECT workflow:
  1. /design-research (find reference designs)
  2. /design-generate (create component concepts)
  3. Build feature (using generated design specs)
  4. /design-verify (check compliance)
```

**Why this matters:** Designing after coding means retrofitting. Retrofitting means touching every component, re-testing every state, and fighting with layouts that were built for different visual specs. It takes 3x longer than designing first.

---

## /design-verify After EVERY UI Change

```
WRONG:
  Build 5 pages → /design-verify at the end → 47 violations

CORRECT:
  Build 1 page → /design-verify → 3 violations → fix → PASS → next page
```

**Visual drift accumulates silently.** One `bg-blue-500` instead of `bg-primary` in one component becomes a pattern. Other components copy it. By the time you run /design-verify, the violations are everywhere.

**Rule:** Run /design-verify after EVERY UI change, not just at phase boundaries.

---

## The Demo 2/10 Story

A real project demo scored 2/10 because:
1. **Maps API not configured** — the map component showed a gray box with "API key required"
2. **Pure default shadcn** — every component looked like the shadcn docs
3. **Half-baked features** — three features at 60% instead of one feature at 100%
4. **No seed data** — dashboard showed all zeros, tables were empty

The client expected a polished product. They saw a prototype. Trust was damaged. The timeline extended by weeks.

**Lessons:**
- Configure ALL external APIs before the demo (Maps, payments, email, etc.)
- Customize components before showing anyone
- One complete feature beats three incomplete features
- ALWAYS demo with seed data — never with an empty database

---

## Anti-Slop Accumulation

"Slop" is the accumulated residue of small design violations. Each one is minor. Together, they kill quality.

**Examples of slop:**
- One button uses `bg-blue-600`, another uses `bg-primary` — same intent, different values
- Gradient header in the sidebar but flat headers everywhere else — inconsistent visual language
- Default shadcn Badge used for trip statuses — no semantic meaning, all look the same
- `p-4` on one card, `p-6` on its neighbor — inconsistent spacing

**How slop accumulates:**
1. Developer A uses `bg-blue-600` because it "looks right"
2. Developer B copies Developer A's component, inherits the violation
3. Developer C sees two components using `bg-blue-600`, assumes it is the standard
4. Now 20 components use `bg-blue-600` instead of `bg-primary`
5. Changing the brand color requires finding and updating 20 components instead of 1 CSS variable

**Prevention:**
- Design tokens for EVERYTHING (colors, spacing, typography, shadows, border-radius)
- /design-verify catches violations before they compound
- Code review explicitly checks for design token usage

---

## Color-Only Indicators: Accessibility Failure

```typescript
// WRONG — color alone conveys status (fails WCAG 1.4.1)
<span className="h-3 w-3 rounded-full bg-red-500" />  // What does this mean?

// CORRECT — color + icon + text
<Badge variant="destructive">
  <AlertCircle className="h-3 w-3 mr-1" />
  Overdue
</Badge>
```

**Who this affects:**
- 8% of men and 0.5% of women have color vision deficiency
- Users on low-contrast screens or in bright sunlight
- Screen reader users (color has no semantic meaning)

**Rule:** Never use color as the ONLY indicator of state. Always pair with an icon, text, or pattern.

---

## Touch Targets: 44x44px Minimum

```typescript
// WRONG — 24px icon button, impossible to tap on mobile
<button className="p-1">
  <Trash2 className="h-4 w-4" />    // 24px total target
</button>

// CORRECT — 44px minimum touch target
<button className="p-2.5">
  <Trash2 className="h-5 w-5" />    // 44px total target
</button>

// ALSO CORRECT — visual size small, touch target large
<button className="relative p-2.5 -m-2.5">
  <Trash2 className="h-4 w-4" />    // Looks 16px, touch target 44px
</button>
```

**Who this affects:** Everyone on mobile (which is 50-70% of web users). Small buttons cause mis-taps, frustration, and increased task completion time.

---

## Empty States: Not Optional

Every list, table, and data-driven component MUST show an empty state when there is no data.

```typescript
// WRONG — empty table with headers and zero rows (looks broken)
{data.length === 0 && <Table headers={columns} rows={[]} />}

// CORRECT — illustrated empty state with CTA
{data.length === 0 && (
  <EmptyState
    icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
    title="No trips yet"
    description="Create your first trip to get started."
    action={
      <Button onClick={onCreateTrip}>
        <Plus className="h-4 w-4 mr-2" />
        Create Trip
      </Button>
    }
  />
)}
```

**What a good empty state includes:**
1. Illustration or icon (establishes visual context)
2. Title (what is missing)
3. Description (why it is empty, what to do)
4. CTA button (the next action)

**When users see empty states:** First-time users (no data yet), after filtering returns no results, after deleting the last item.

---

## Loading States: Skeletons, Not Spinners

```typescript
// WRONG — generic spinner (gives no layout preview)
{isLoading && <Spinner />}

// CORRECT — skeleton matching the final layout shape
{isLoading && (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />          {/* Title */}
    <div className="grid grid-cols-4 gap-4">
      <Skeleton className="h-24 rounded-lg" />  {/* KPI card */}
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
    </div>
    <Skeleton className="h-64 rounded-lg" />    {/* Chart */}
  </div>
)}
```

**Why skeletons over spinners:**
- Skeletons preview the layout, reducing perceived load time
- Skeletons prevent content layout shift (CLS) when data arrives
- Spinners communicate "something is happening" but give no structural preview

---

## Responsive: Mobile First, Not Mobile Last

```css
/* WRONG — desktop first, then override for mobile */
.card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 768px) {
  .card {
    grid-template-columns: 1fr;
  }
}

/* CORRECT — mobile first, enhance for desktop */
.card {
  display: grid;
  grid-template-columns: 1fr;               /* Mobile default */
}
@media (min-width: 768px) {
  .card {
    grid-template-columns: repeat(4, 1fr);   /* Desktop enhancement */
  }
}
```

**In Tailwind:**
```html
<!-- Mobile first: stack on mobile, grid on desktop -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
```

**Why mobile first:** Mobile is the constrained case. If it works on mobile, it almost always works on desktop. The reverse is rarely true.

---

## Dark Mode: All or Nothing

If you support dark mode, EVERY component must support it. A single component with hardcoded light-mode colors will look broken.

```typescript
// WRONG — hardcoded light-mode color
<div className="bg-white text-black">

// CORRECT — uses semantic tokens that adapt to theme
<div className="bg-background text-foreground">
```

**Rule:** Either fully support dark mode (every component, every page) or do not support it at all. Partial dark mode looks worse than no dark mode.
