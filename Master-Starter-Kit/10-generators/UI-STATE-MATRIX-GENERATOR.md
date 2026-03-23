# UI State Matrix Generator

> **Purpose:** Produce a cross-screen matrix showing which UI state pattern each screen uses for each possible state. Eliminates inconsistent state handling — the #2 source of AI slop after error handling.
>
> **Output:** `dev_docs/completeness/ui-state-matrix.md`
> **Run after:** Step 6 (Screen Specs) completes, as part of Step 8.45

---

## When to Run

| Trigger | Scope |
|---------|-------|
| After Step 6 (Screen Specs) | All screens |
| After Step 31 (Depth Verification) | Re-verify after spec expansion |
| After adding new screens | Incremental update |

---

## Input Required

- All screen specs from `dev_docs/specs/screens/`
- Component catalog from `dev_docs/components/`
- Design system tokens from `dev_docs/foundations/`

---

## Generator Instructions

### Step 1: Define Standard State Patterns

Before building the matrix, establish the project's pattern catalog. Each pattern is a reusable implementation approach.

**Loading Patterns:**
| Pattern | Implementation | Use When |
|---------|---------------|----------|
| `skeleton` | Pulsing placeholder matching layout structure | Default for data tables, lists, cards |
| `spinner` | Centered spinner with optional message | Simple content areas, modals |
| `progressive` | Content appears as each section loads | Dashboard with independent widgets |
| `inline` | Small spinner next to the triggering element | Button actions, inline edits |
| `optimistic` | Show expected result immediately, revert on failure | Status changes, toggles, likes |

**Error Patterns:**
| Pattern | Implementation | Use When |
|---------|---------------|----------|
| `full-page` | Illustration + message + retry button | Entire page failed to load |
| `inline-banner` | Dismissible banner at top of content area | Partial failure, rest of page works |
| `toast` | Temporary notification (5s auto-dismiss) | Non-critical failures, background operations |
| `field-level` | Red text below specific form field | Validation errors |
| `connection-lost` | Persistent banner "You're offline" | Network disconnection |

**Empty Patterns:**
| Pattern | Implementation | Use When |
|---------|---------------|----------|
| `illustration-cta` | Icon/illustration + explanatory text + primary action button | First-time user, no data created yet |
| `simple-text` | "No results found" + suggestion text | Filtered/searched to zero results |
| `guided-onboarding` | Step-by-step cards guiding first actions | Complex features needing setup |

### Step 2: Build the Screen Matrix

For EVERY screen in the screen specs, fill in this matrix:

```markdown
## Screen State Matrix

| Screen | Route | Loading | Error | Empty (First Use) | Empty (Filtered) | Populated | Editing | Saving | Offline |
|--------|-------|---------|-------|--------------------|-------------------|-----------|---------|--------|---------|
| {{SCREEN_NAME}} | {{ROUTE}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} | {{PATTERN}} |
```

**Rules for filling the matrix:**
1. Every screen MUST have entries for: Loading, Error, Empty (First Use), Populated — these 4 are non-negotiable
2. Screens with forms MUST also have: Editing, Saving, Validation Error
3. Screens with real-time data MUST also have: Stale Data, Reconnecting
4. Screens with filters/search MUST also have: Empty (Filtered), Searching
5. Screens with destructive actions MUST also have: Confirming Delete
6. Mobile screens MUST also have: Offline
7. Each cell contains the pattern name from Step 1 (e.g., `skeleton`, `toast`, `illustration-cta`)
8. If a state is not applicable, write `N/A` with brief reason

### Step 3: Flag Gaps

After building the matrix, produce a gap report:

```markdown
## Gap Report

### Missing Fundamental States
| Screen | Missing States | Action Required |
|--------|---------------|-----------------|
<!-- List any screen missing loading, error, empty, or populated -->

### Inconsistent Patterns
| Pattern Type | Screens Using Pattern A | Screens Using Pattern B | Recommendation |
|-------------|------------------------|------------------------|----------------|
<!-- Flag where similar screens use different patterns without justification -->

### Screens Below 6 States
| Screen | Current State Count | States Present | States to Add |
|--------|-------------------|----------------|---------------|
<!-- Flag any screen with fewer than 6 states defined -->
```

### Step 4: Generate Reusable Pattern Components

For each pattern used in the matrix, include a TSX implementation reference:

```markdown
## Pattern Implementations

### Skeleton Pattern
- Component: `{{COMPONENT_PREFIX}}Skeleton` or use shadcn `<Skeleton />`
- Row count: match default page limit (e.g., 20 rows for tables)
- Column layout: match actual table columns

### Error Banner Pattern
- Component: `{{COMPONENT_PREFIX}}ErrorBanner`
- Props: `message: string`, `onRetry?: () => void`, `dismissible?: boolean`
- Auto-dismiss: never (user must acknowledge or retry)

### Empty State Pattern
- Component: `{{COMPONENT_PREFIX}}EmptyState`
- Props: `icon: ReactNode`, `title: string`, `description: string`, `action?: { label: string, onClick: () => void }`
- Variants: `first-time` (with CTA), `filtered` (with "Clear filters" link), `search` (with suggestions)
```

### Step 5: Mandatory Rules

Include these non-negotiable rules in the output:

```markdown
## Mandatory Rules for AI Agents

1. **EVERY component that calls `useQuery`, `useSWR`, or fetches data MUST handle all 4 fundamental states** (loading, error, empty, populated). No exceptions.
2. **Skeleton row count MUST match the default page limit.** If the API returns 20 items per page, the skeleton shows 20 rows.
3. **Error states MUST include a retry mechanism.** Never show an error without a way to recover.
4. **Empty states for first-time users MUST include a call-to-action.** Never show "No data" without guidance.
5. **Loading states MUST match the layout of the populated state.** A spinner where a table will appear causes layout shift.
6. **Toast errors are ONLY for non-critical, recoverable failures.** API failures that block the user flow use inline-banner or full-page error.
7. **Filtered-empty is a different state from first-use-empty.** "No results match your filters" ≠ "Create your first item."
8. **Optimistic updates require rollback on failure.** If the server rejects the action, the UI must revert and show an error.
9. **Offline states must preserve user input.** Never clear a form when the network drops.
10. **Every state pattern must be from the project's pattern catalog.** No ad-hoc implementations.
```

---

## Depth Requirements

- Must cover EVERY screen from the screen specs (no "and similar screens")
- Every screen must have at least 4 states (loading, error, empty, populated)
- Complex screens (forms, real-time, filters) must have 6+ states
- Pattern implementations must include component names and key props
- Gap report must be empty (all gaps resolved) before proceeding

---

## Gate Criteria

**Pass:** Every screen in the screen catalog has all 4 fundamental states specified AND complex screens have 6+ states AND no inconsistent patterns without justification.

**Fail:** Any screen missing a fundamental state, or total state count < 6 for interactive screens.

**Action on fail:** Expand the screen spec to cover missing states, then regenerate this matrix.
