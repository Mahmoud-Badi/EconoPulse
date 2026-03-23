# Quality Gates — The 8-Step /verify Sequence

Every feature must pass all 8 gates before it can be marked complete. No exceptions. No partial passes. If gate 3 fails, you do not proceed to gate 4 — you fix gate 3 first.

---

## Gate 1: Pre-flight (/feature-checklist)

**Command:** `/feature-checklist`
**What it checks:** All 5 layers exist for the feature (Database, API, UI, Tests, Quality)
**Pass criteria:** Every layer has its required files

**Why this matters:**
It is easy to build a beautiful UI that calls an API that does not exist, or to write an API with no tests. The pre-flight catches structural gaps before you waste time testing incomplete code.

**What to look for:**
- Schema file exists and is exported
- Router file exists and is registered in root router
- Validators exist in the validators package
- Page files exist (page.tsx, loading.tsx, error.tsx)
- Test files exist (unit + E2E)

**Common failures:**
- Forgot to export schema in index.ts barrel file
- Router exists but not registered in root router (API returns 404)
- E2E test file created but empty (no actual test cases)

---

## Gate 2: TypeScript (pnpm typecheck)

**Command:** `pnpm typecheck`
**What it checks:** Zero TypeScript errors across the entire monorepo
**Pass criteria:** Exit code 0, zero errors

**Why this matters:**
Type errors are compile-time bugs. Every type error you ignore becomes a potential runtime crash. TypeScript's entire value proposition is catching these before users do.

**Common failures:**
- Mismatched types between API response and UI props
- Missing null checks (noUncheckedIndexedAccess)
- Enum string literals widened to `string` (needs `as const`)
- Importing from wrong package (circular dependency)

**Fix strategy:**
```bash
# Run typecheck with full error output
pnpm typecheck 2>&1 | head -50

# Fix the FIRST error — later errors often cascade from the first
```

---

## Gate 3: Unit Tests (pnpm test)

**Command:** `pnpm test`
**What it checks:** All Vitest tests pass across all packages
**Pass criteria:** Zero failures, zero skipped tests (unless explicitly marked with reason)

**Why this matters:**
Unit tests catch logic bugs in isolation. A validator that accepts invalid input, a router that returns the wrong status code, a utility function that miscalculates — these are caught here, not in production.

**Minimum test counts per feature:**
- Validator: 5+ tests (valid input, missing required, invalid type, invalid enum, edge case)
- Router: 5+ tests per procedure (authorized, unauthorized, filtered, empty result, error case)
- Component: 4+ tests (renders data, loading state, error state, user interaction)

**Common failures:**
- Test written against old schema (schema changed, test not updated)
- Mock data missing required fields
- Async test not awaiting the assertion

---

## Gate 4: Lint (pnpm lint)

**Command:** `pnpm lint`
**What it checks:** Code style consistency, common mistake detection
**Pass criteria:** Zero errors (warnings acceptable if acknowledged)

**Why this matters:**
Lint rules prevent entire categories of bugs: unused variables that indicate dead code, missing dependency arrays in useEffect, inconsistent imports that cause bundle bloat.

**Common failures:**
- Unused imports (forgot to clean up after refactoring)
- Missing React hook dependencies
- Console.log statements left in production code
- Inconsistent naming conventions

**Fix strategy:**
```bash
# Auto-fix what can be auto-fixed
pnpm lint --fix

# Then manually fix remaining issues
```

---

## Gate 5: Build (pnpm build)

**Command:** `pnpm build`
**What it checks:** Production build succeeds
**Pass criteria:** Build completes without errors

**Why this matters:**
Development mode (Next.js dev server) is forgiving. It lazy-compiles, ignores some errors, and uses different code paths than production. A successful dev server does NOT guarantee a successful production build.

**What the build catches that dev mode misses:**
- Dynamic imports that reference non-existent modules
- Server/client boundary violations ("use client" missing)
- Environment variables not prefixed with NEXT_PUBLIC_ used in client code
- CSS modules with invalid class names
- Tree-shaking errors from circular dependencies

**Common failures:**
- "use client" directive missing on component that uses hooks
- Server Component importing a client-only library
- Dynamic route parameter mismatch

---

## Gate 6: Design Compliance (/design-verify)

**Command:** `/design-verify`
**What it checks:** Code-level design compliance via static analysis
**Pass criteria:** Zero violations

**Why this matters:**
Design drift is invisible until it is catastrophic. One hardcoded `#3b82f6` becomes ten. One `p-4` that should be `p-6` becomes a pattern. /design-verify catches these before they compound.

**What it checks:**
- No hardcoded color values (must use design tokens/CSS variables)
- No hardcoded spacing values outside the design system scale
- No hardcoded font sizes (must use text-* classes)
- All interactive elements have hover/focus/active states
- All data components have loading, error, empty, and data states
- Consistent border radius usage (design system scale)
- Accessible color contrast ratios

**Common failures:**
- `bg-blue-500` instead of `bg-primary`
- `className="p-4"` in a component that should use a spacing token
- Button without hover state
- Table without empty state

---

## Gate 7: Visual Verification (Playwright)

**Command:** Playwright navigation + screenshot suite
**What it checks:** Every page renders correctly at desktop and mobile breakpoints
**Pass criteria:** All pages load, no console errors, all interactions work

**Why this matters:**
Static analysis (gates 1-6) cannot catch visual bugs. A z-index conflict, an overflow hidden cutting off content, a responsive breakpoint that stacks elements incorrectly — these require actually rendering the page.

**Verification sequence:**
1. Navigate to every page in the feature
2. Screenshot at 1440px (desktop) and 375px (mobile)
3. Click every interactive element (buttons, links, tabs, dropdowns)
4. Submit every form (with valid and invalid data)
5. Check browser console for errors/warnings
6. Verify navigation (breadcrumbs, back buttons, links)

**Common failures:**
- Mobile layout overflow (content extends beyond viewport)
- Dropdown menu rendered behind another element (z-index)
- Form submission does not show success/error feedback
- Console error from missing API endpoint

---

## Gate 8: State Verification

**Command:** Manual/automated check of all 4 UI states
**What it checks:** Every data-driven component handles all possible states
**Pass criteria:** All 4 states render correctly

**The 4 states every component must handle:**

| State | What user sees | How to test |
|-------|---------------|-------------|
| **Loading** | Skeleton/spinner | Throttle network in DevTools, navigate to page |
| **Error** | Alert with message + retry action | Disconnect API or return 500 |
| **Empty** | Illustration + descriptive text + CTA button | Use account with no data |
| **Data** | Actual content with real seed data | Use seeded account |

**Why this matters:**
Users hit all 4 states in production. A blank page where a loading skeleton should be looks broken. A missing empty state when a new user signs up makes them think the app failed. An unhandled error crashes the entire page instead of showing a recoverable message.

**Common failures:**
- Loading state shows nothing (white flash before data appears)
- Error state shows raw error message ("TypeError: Cannot read properties of undefined")
- Empty state shows an empty table with headers and no rows (looks broken)
- Data state only tested with 1-2 records (pagination not verified)

---

## The Complete Sequence

```bash
# Run all 8 gates in order
# Stop at the first failure — do not skip ahead

# Gate 1: Pre-flight
/feature-checklist

# Gate 2: Types
pnpm typecheck

# Gate 3: Tests
pnpm test

# Gate 4: Lint
pnpm lint

# Gate 5: Build
pnpm build

# Gate 6: Design compliance
/design-verify

# Gate 7: Visual verification
# (Playwright navigation suite)

# Gate 8: State verification
# (Check loading, error, empty, data states)
```

**All 8 pass? The feature is done.**
**Any gate fails? Fix it, then re-run FROM THAT GATE (not from gate 1).**

---

## Screen Scoring Rubric (6-Dimension Weighted)

Use this rubric to objectively score any page/screen. Battle-tested on 39 services in Ultra TMS.

| Dimension | Weight | 10/10 | 7/10 | 4/10 | 1/10 |
|-----------|--------|-------|------|------|------|
| **Functionality** | 30% | All CRUD + business rules implemented, edge cases handled | Core CRUD works, 1-2 rules missing | Basic create/read only, most rules missing | Stubs/placeholders, no real logic |
| **Data Integrity** | 20% | All validations, constraints, relations, DTOs correct | Most validations present, minor gaps | Basic DTOs only, missing constraints | No validation, raw data pass-through |
| **UI/UX** | 20% | All 4 states, responsive, accessible, polished | 3/4 states, mostly responsive | 1-2 states only, desktop only | No state handling, broken layout |
| **State Management** | 15% | Proper cache invalidation, optimistic updates, error recovery | Basic query/state, some cache issues | Manual state, no cache strategy | No state management, prop drilling chaos |
| **Accessibility** | 10% | ARIA labels, keyboard nav, screen reader support, focus management | Some ARIA, basic keyboard | Minimal a11y, some semantic HTML | No a11y, div soup |
| **Code Quality** | 5% | Strict TypeScript, zero lint errors, clean patterns, DRY | Minor type issues, consistent patterns | Some `any`, inconsistent | No types, spaghetti |

**Calculating the score:**

```
Score = (Functionality × 0.30) + (Data × 0.20) + (UI × 0.20)
      + (State × 0.15) + (A11y × 0.10) + (Code × 0.05)
```

**Score thresholds:**
- **MVP Release:** ≥ 6.0 (all P0 screens must meet this)
- **Production Release:** ≥ 8.0 (all screens must meet this)
- **Protection List:** ≥ 8.0 (screen gets added to protection list, modifications require review)

---

## Definition of Done (10-Point Checklist)

A feature/screen is DONE when ALL 10 items are checked:

- [ ] 1. **All 8 quality gates pass** (typecheck, test, lint, build, design, visual, states)
- [ ] 2. **All 4 UI states implemented** (loading, error, empty, data)
- [ ] 3. **Responsive** at desktop (1440px), tablet (768px), and mobile (375px)
- [ ] 4. **Accessible** — keyboard navigable, ARIA labels on interactive elements
- [ ] 5. **Tests exist** — Unit tests for logic, E2E test for critical path
- [ ] 6. **API integration verified** — All endpoints called correctly, envelope unwrapped
- [ ] 7. **Error handling complete** — Network errors, validation errors, 404s, 500s
- [ ] 8. **Hub file updated** — Endpoint count, component count, screen status, quality score
- [ ] 9. **No anti-patterns** — Checked against PREVENTION-CHECKLIST.md
- [ ] 10. **Task file closed** — Status updated in STATUS.md, session logged

---

## Multi-Tier Quality Gates (Progressive)

### Gate Tier 1: Component Quality
- TypeScript strict mode passes
- Lint passes
- Component has all variants (Storybook if applicable)
- Accessibility basics (semantic HTML, ARIA)

### Gate Tier 2: Page/Screen Quality
- All 4 states (loading, empty, error, populated)
- Forms validate on client AND server
- Mutations invalidate cache correctly
- Responsive at 3 breakpoints
- Playwright navigation test passes

### Gate Tier 3: Service/Module Quality
- Full CRUD flow works end-to-end
- Cross-page consistency (list → detail → edit → back)
- All endpoints have auth guards
- All queries filter by tenant (multi-tenant)
- Test coverage ≥ {{COVERAGE_TARGET}}%

### Gate Tier 4: Cross-Module Quality
- Visual consistency across all modules
- Performance budget met (see performance-budget/)
- Security audit checklist passed (see security-framework/)
- No cross-module regressions
