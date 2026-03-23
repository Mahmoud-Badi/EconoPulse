# Feature Completion Checklist

Run this checklist before marking ANY feature done. A feature is not complete until all 5 layers are verified. This is the /feature-checklist command in structured form.

---

## How to Use

1. Copy the relevant sections below for your feature
2. Replace `{domain}` with the feature domain (e.g., `trips`, `drivers`, `invoices`)
3. Check every box
4. If any box cannot be checked, the feature is NOT complete

---

## Layer 1: Database

- [ ] Schema file exists at `packages/db/src/schema/{domain}.ts`
- [ ] Schema is exported in `packages/db/src/schema/index.ts`
- [ ] All columns have correct types (varchar, integer, timestamp, enum, etc.)
- [ ] All foreign keys reference the correct parent table
- [ ] Foreign key columns are indexed (performance)
- [ ] `createdAt` column exists with `defaultNow()`
- [ ] `updatedAt` column exists with `$onUpdate(() => new Date())`
- [ ] Enum types are defined with all valid values
- [ ] Seed data exists at `packages/db/src/seed/{domain}.ts`
- [ ] Seed file is imported and called in `seed/index.ts` orchestrator
- [ ] Seed data covers all enum values (each status, each role, etc.)
- [ ] Migration generated via `drizzle-kit generate` (if new tables/columns)
- [ ] Migration applied to development database
- [ ] Migration applied to production database (or queued for deploy)

**Quick check:**
```bash
# Verify schema compiles
pnpm --filter @{project}/db typecheck

# Verify seed runs without error
cd packages/db && npx tsx src/seed/index.ts
```

---

## Layer 2: API (tRPC Router)

- [ ] Router file exists at `packages/api/src/routers/{domain}.ts`
- [ ] Router is registered in root router (`packages/api/src/root.ts`)
- [ ] All CRUD procedures implemented per spec:
  - [ ] `list` — paginated, filterable, sortable
  - [ ] `getById` — single record with relations
  - [ ] `create` — validates input, returns created record
  - [ ] `update` — validates input, checks existence, returns updated record
  - [ ] `delete` — soft delete or hard delete per domain rules
- [ ] Additional procedures implemented per spec (e.g., `updateStatus`, `assign`, `search`)
- [ ] All procedures use the correct protection level:
  - [ ] Public: only for unauthenticated endpoints (login, register)
  - [ ] Protected: requires valid session
  - [ ] Role-based: requires specific role(s)
- [ ] Error handling uses proper tRPC error codes:
  - [ ] `NOT_FOUND` for missing records
  - [ ] `FORBIDDEN` for insufficient permissions
  - [ ] `BAD_REQUEST` for invalid input
  - [ ] `UNAUTHORIZED` for missing session
- [ ] Validators exist at `packages/validators/src/{domain}.ts`
- [ ] Validators are shared between API and UI (single source of truth)
- [ ] Unit tests exist at `packages/api/src/routers/__tests__/{domain}.test.ts`
- [ ] All unit tests pass

**Quick check:**
```bash
# Verify API compiles
pnpm --filter @{project}/api typecheck

# Run router tests
pnpm --filter @{project}/api test
```

---

## Layer 3: UI (Pages + Components)

- [ ] List page exists at `apps/web/app/(dashboard)/{domain}/page.tsx`
- [ ] Detail page exists at `apps/web/app/(dashboard)/{domain}/[id]/page.tsx`
- [ ] Create form exists (modal or page)
- [ ] Edit form exists (modal or page)
- [ ] `loading.tsx` exists in each route segment (shows skeleton)
- [ ] `error.tsx` exists in each route segment (shows error alert with retry)
- [ ] All components use design tokens (no hardcoded colors, spacing, font sizes)
- [ ] Forms use react-hook-form + zodResolver with shared validators
- [ ] Form submission shows loading state (button disabled + spinner)
- [ ] Form success shows toast notification
- [ ] Form error shows inline validation errors
- [ ] All buttons and links have working click handlers
- [ ] All interactive elements have hover, focus, and active states
- [ ] Responsive layout works at 375px (mobile) and 1440px (desktop)

**State coverage (every data-driven component):**

| State | Required | Implementation |
|-------|----------|----------------|
| Loading | Yes | Skeleton placeholders matching final layout shape |
| Error | Yes | Alert with error message + "Try Again" button |
| Empty | Yes | Illustration + descriptive text + CTA button |
| Data | Yes | Real content rendered from seed data |

**Quick check:**
```bash
# Start dev server and manually navigate
pnpm dev
# Check: list page, detail page, create form, edit form
# Check: loading (throttle network), error (disconnect API), empty (no data)
```

---

## Layer 4: Testing

- [ ] E2E test file exists at `apps/web/e2e/{domain}.spec.ts`
- [ ] E2E test covers the happy path (create, list, view, edit, delete)
- [ ] E2E test covers error paths (validation errors, not found)
- [ ] E2E test passes on Chromium
- [ ] E2E test passes on mobile viewport (375px)
- [ ] Validator unit tests exist and pass (5+ per schema)
- [ ] Router unit tests exist and pass (5+ per procedure)
- [ ] Component tests exist for complex components (if applicable)

**Quick check:**
```bash
# Run all tests
pnpm test

# Run E2E for this feature
npx playwright test e2e/{domain}.spec.ts
```

---

## Layer 5: Quality

- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm build` succeeds
- [ ] `/design-verify` passes (no hardcoded values, all states present)
- [ ] Tested with seed data (not empty database)
- [ ] No console errors in browser DevTools
- [ ] No TypeScript `any` types (unless explicitly justified with comment)
- [ ] No `eslint-disable` comments (unless explicitly justified)
- [ ] No `@ts-ignore` or `@ts-expect-error` (unless explicitly justified)

**Quick check:**
```bash
pnpm typecheck && pnpm lint && pnpm build && echo "ALL CLEAR"
```

---

## Layer 5.5: Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements are keyboard-accessible (Tab, Enter, Space, Escape)
- [ ] Focus order follows visual/logical order
- [ ] Focus is visible on all interactive elements (no `outline: none` without replacement)
- [ ] All images have `alt` text (descriptive or `alt=""` for decorative)
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text/UI components)
- [ ] Information is NOT conveyed by color alone
- [ ] Dynamic content updates use `aria-live` regions
- [ ] Modals trap focus and return focus on close
- [ ] axe-core automated scan shows zero critical/serious violations

**Quick check:**
```bash
# Run axe-core accessibility audit (if configured in Playwright)
npx playwright test e2e/{domain}.spec.ts --grep "accessibility"

# Or manually in Chrome DevTools: Lighthouse > Accessibility
```

---

## Layer 6: User Documentation

- [ ] Feature guide exists at `user_docs/guides/{domain}.md`
- [ ] Guide has all required sections (description, prerequisites, steps, expected results, tips, FAQ, troubleshooting)
- [ ] Screenshot placeholders inserted for all key screens/actions
- [ ] FAQ entries exist (minimum 3 per feature)
- [ ] Troubleshooting entries exist for error states
- [ ] Changelog entry appended to `user_docs/changelog.md`
- [ ] In-app help JSON updated for affected screens (`user_docs/in-app/{screen}.json`)
- [ ] `user_docs/DOC-INDEX.md` updated with new coverage

<!-- IF {{HAS_MOBILE}} == "true" -->
- [ ] Cross-platform features have "On Mobile" section in their guide
- [ ] Mobile-only features have guide at `user_docs/guides/mobile/{domain}.md`
- [ ] Mobile screenshot placeholders include platform tags (ios/android)
- [ ] Permission flows documented (if feature requires device permissions)
<!-- ENDIF -->

**Quick check:**

```bash
# Read DOC-INDEX.md — feature should show 100% section coverage
cat user_docs/DOC-INDEX.md | grep "{domain}"
```

---

## Summary Card

Copy this into your feature tracking (STATUS.md, issue, or PR):

```markdown
## Feature: {Domain Name}

### Completion Status
- [x] Layer 1: Database (schema + seed + migration)
- [x] Layer 2: API (router + validators + unit tests)
- [x] Layer 3: UI (pages + components + all 4 states)
- [x] Layer 4: Testing (E2E + unit tests passing)
- [x] Layer 5: Quality (typecheck + lint + build + design-verify)
- [x] Layer 6: User Documentation (guide + FAQ + troubleshooting + changelog + in-app)

### Evidence
- typecheck: PASS (0 errors)
- test: PASS (X passed, 0 failed)
- lint: PASS (0 errors)
- build: PASS
- design-verify: PASS
- E2E: PASS (X tests on Chromium)
- user-docs: guide ✓ | FAQ 3+ ✓ | troubleshoot ✓ | changelog ✓ | in-app ✓
```
