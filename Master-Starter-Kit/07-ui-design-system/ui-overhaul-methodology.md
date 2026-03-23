# UI Overhaul Methodology

## The Problem: CSS Drift

Over time, every application accumulates hardcoded values. A developer uses `#3b82f6` instead of the primary token. Another uses `p-5` where the standard is `p-6`. Someone adds `text-[15px]` because 14px felt too small and 16px felt too big. A gradient sneaks into a header. A shadow gets hardcoded instead of using the token.

Individually, each deviation is invisible. Collectively, they make the app look inconsistent, feel unpolished, and resist theming. This is CSS drift, and it's the reason most AI-built UIs score 2/10 instead of 8/10.

The solution is a systematic token migration -- not a redesign, not a rewrite, but a methodical pass through every file, replacing hardcoded values with tokens.

---

## The Solution: Phased Token Migration

### Step 1: Audit

Grep for all hardcoded values across the codebase:

```bash
# Hardcoded hex colors
rg '#[0-9a-fA-F]{3,8}' --type tsx --type css

# Hardcoded RGB values
rg 'rgb\(' --type tsx --type css

# Arbitrary Tailwind values (square bracket notation)
rg '\[.*px\]' --type tsx  # p-[13px], m-[7px], text-[15px]
rg 'style=\{' --type tsx  # inline styles

# Hardcoded shadows
rg 'shadow-\[' --type tsx

# Hardcoded border radius
rg 'rounded-\[' --type tsx
```

**Output:** A list of every hardcoded value and the file it's in. This is your migration scope.

### Step 2: Map

Create a token mapping document:

```markdown
## Token Mapping

### Colors
| Old Value | Token | Tailwind Class |
|-----------|-------|---------------|
| #4f46e5 | --color-primary-600 | bg-primary-600, text-primary-600 |
| #3b82f6 | --color-primary-600 | bg-primary-600 (was incorrect blue) |
| #ef4444 | --color-error | text-error |
| #10b981 | --color-success | text-success |
| #64748b | --color-neutral-500 | text-neutral-500 |

### Spacing
| Old Value | Token | Tailwind Class |
|-----------|-------|---------------|
| p-5 | --space-card (24px) | p-6 |
| p-[13px] | (no token, use scale) | p-3 (12px) |
| gap-[18px] | --space-stack (16px) | gap-4 |

### Typography
| Old Value | Token | Tailwind Class |
|-----------|-------|---------------|
| text-[15px] | (use scale) | text-sm (14px) or text-base (16px) |
| font-bold | (use semibold) | font-semibold |
| text-[#333] | --color-neutral-800 | text-neutral-800 |

### Shadows
| Old Value | Token | Tailwind Class |
|-----------|-------|---------------|
| shadow-[0_2px_8px_rgba(0,0,0,0.1)] | --shadow-card | shadow-card |
| shadow-md | (keep if matches token) | shadow-card |
```

### Step 3: Define "DO NOT CHANGE" List

Some hardcoded values are intentional. Semantic colors for status indicators should NOT be changed to generic tokens:

```markdown
## DO NOT CHANGE
- Status "error" red (#ef4444 / red-500) → keep as-is (semantic meaning)
- Status "success" green (#10b981 / green-500) → keep as-is
- Status "warning" amber (#f59e0b / amber-500) → keep as-is
- Status "info" blue (#3b82f6 / blue-500) → keep as-is
- Chart colors (each series needs a distinct color)
- Third-party component styles (don't fight libraries)
```

### Step 4: Migrate by Section (Not by File Type)

**Wrong approach:** Fix all colors first, then all spacing, then all typography.
This creates intermediate states where some aspects are migrated and others aren't. It's hard to verify and easy to introduce regressions.

**Right approach:** Migrate one section completely, then move to the next.

A "section" is a logical group of related pages:
- Admin dashboard section (dashboard, analytics, settings)
- Trip management section (trip list, trip detail, trip form)
- Billing section (invoices, payments, reports)
- Auth section (login, register, forgot password)

### Step 5: Commit Per Sub-Phase

Never batch multiple sections in one commit. Each sub-phase gets its own commit:

```
style(tokens): migrate shared components to design tokens
style(tokens): migrate admin dashboard to design tokens
style(tokens): migrate trip pages to design tokens
style(tokens): migrate billing pages to design tokens
style(tokens): migrate auth pages to design tokens
style(tokens): migrate loading/error states to design tokens
```

**Why:** If a migration introduces a visual regression, you can pinpoint exactly which commit caused it and revert just that section.

### Step 6: Build After Every File

```bash
pnpm build
```

After every file you modify, run the build. This catches:
- Broken Tailwind class names
- Missing CSS variables
- TypeScript errors from changed className props

Don't wait until you've changed 20 files to build. By then, you won't know which file introduced the error.

---

## Phase Ordering

The order matters because earlier phases cascade to later phases:

### Phase A: Shared Components

Migrate shared components FIRST because every page uses them:
- Button, Card, Input, Badge, Table
- PageHeader, EmptyState, LoadingState
- StatusBadge, DatePicker, SearchInput

**Impact:** Migrating shared components automatically improves every page that uses them.

### Phase B: Layout Shell

Migrate the app shell next:
- Sidebar navigation
- Top navigation bar
- Breadcrumbs
- Footer

**Impact:** The structural elements that are visible on every single page.

### Phase C: Admin/Main Pages

Migrate the most-used pages:
- Dashboard
- List pages (trips, drivers, vehicles)
- Detail pages
- Forms

**Order within this phase:** Most-visited pages first. Dashboard before settings.

### Phase D: Auth Pages

Migrate authentication pages:
- Login
- Register
- Forgot password
- Reset password
- Verify email

**Why later:** Auth pages are seen less frequently and have simpler layouts.

### Phase E: Edge Case States

Migrate loading, error, and empty states:
- Loading skeletons
- Error boundaries
- 404 page
- 500 page
- Offline state
- Empty states for every list

**Why last:** These are seen least frequently, but they complete the polish.

---

## Rules During Migration

### Rule 1: No Functionality Changes

Token migration is a visual change ONLY. Do not:
- Fix bugs you discover along the way (note them, fix later)
- Refactor component structure
- Change data flow or state management
- Add new features

**Why:** Mixing functional changes with visual changes makes regressions impossible to attribute.

### Rule 2: Preserve Semantic Colors

If a status badge is red because the status is "error," keep it red. Don't change it to your primary color for "consistency."

Semantic colors communicate meaning. Consistency of meaning trumps consistency of palette.

### Rule 3: Run /design-verify After Every File

```
/design-verify
```

This catches anti-slop violations introduced during migration. Common trap: replacing one hardcoded value with a different hardcoded value instead of a token.

### Rule 4: Compare Before and After

For each page, take a screenshot before and after migration. The design should look the SAME or BETTER, never worse. If the migration changes the visual appearance negatively, you chose the wrong token mapping.

### Rule 5: Test Responsiveness

After migrating a page, check it at all 4 breakpoints (375px, 768px, 1024px, 1440px). Token changes can affect spacing calculations that break responsive layouts.

---

## Tracking Progress

Create a migration tracker:

```markdown
## Token Migration Progress

### Phase A: Shared Components
- [x] Button (12 instances updated)
- [x] Card (8 instances updated)
- [x] Input (15 instances updated)
- [x] Badge → StatusBadge (6 instances updated)
- [x] Table (4 instances updated)
- [x] PageHeader (created, applied to all pages)
- [x] EmptyState (created, applied to list pages)

### Phase B: Layout Shell
- [x] Sidebar (1 file)
- [x] TopNav (1 file)
- [x] Breadcrumbs (1 file)

### Phase C: Main Pages
- [x] Dashboard (3 files)
- [x] Trip list (2 files)
- [x] Trip detail (1 file)
- [ ] Trip form (2 files) <-- current
- [ ] Driver list (2 files)
- [ ] ...

### Phase D: Auth Pages
- [ ] Login
- [ ] Register
- [ ] Forgot password

### Phase E: Edge States
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] 404/500 pages
```

---

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| Migrating everything at once | Phase by section, commit per sub-phase |
| Changing functionality during migration | Strict visual-only rule |
| Not testing responsiveness | Check 4 breakpoints after every page |
| Wrong token mapping | Compare before/after screenshots |
| Missing the DO NOT CHANGE list | Define semantic colors upfront |
| Skipping /design-verify | Run after every file, no exceptions |
| Forgetting edge states | Phase E exists specifically for these |
| Not tracking progress | Use the migration tracker |

---

## When You're Done

After all phases complete:

1. Run full build: `pnpm build`
2. Run all tests: `pnpm test`
3. Run design verify on every major route: `/design-verify`
4. Run design review on key pages: `/design-review /dashboard`, `/design-review /trips`
5. Check responsive at all breakpoints
6. Commit: `style(tokens): complete design token migration`
7. Deploy and verify production

The result: every color, shadow, radius, and spacing value in your app comes from tokens. Future changes to the design system require updating tokens in ONE file, and the entire app updates consistently.
