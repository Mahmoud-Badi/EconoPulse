# Task Decomposition Rules

How to write tasks that are specific, verifiable, and complete. Bad tasks are the #1 cause of scope creep, missed features, and "90% done for 3 months" syndrome. These rules prevent that.

---

## Rule 1: Every Feature Requires These Layers (Each as Explicit Tasks)

A feature is not "done" until all eight layers exist. Each layer is a separate task with its own verify step.

| # | Layer | Task Pattern | Verify Step |
|---|-------|-------------|-------------|
| 1 | **Validator** | Create `create{Domain}Schema` with Zod. Fields: {list}. Constraints: {list}. | `pnpm typecheck` passes; schema exports correctly |
| 2 | **Validator tests** | Write 5+ tests for `create{Domain}Schema`: valid full, valid minimal, missing required, wrong type, constraint violation | `pnpm test:unit` — all validator tests pass |
| 3 | **Database procedure(s)** | Create `{domain}.list` procedure: paginated, filterable by {fields}, sortable by {fields}. Returns `{shape}`. | Procedure callable; returns expected shape with seed data |
| 4 | **Procedure tests** | Write unit tests for `{domain}.list`: happy path returns paginated results, filter by status returns filtered set, invalid page returns error | `pnpm test:unit` — all procedure tests pass |
| 5 | **Components** | Build `{Domain}DataTable` with columns: {list}. States: loading (skeleton), empty (illustration + CTA), error (retry), populated (data rows). | Component renders all 4 states correctly |
| 6 | **Page** | Build `/{domain}` page integrating `{Domain}DataTable` with `api.{domain}.list` hook. Add `loading.tsx` + `error.tsx`. | Page loads with seed data; pagination works; URL is correct |
| 7 | **E2E test** | Write E2E: navigate to `/{domain}`, verify table shows seed data, click first row, verify detail page loads. Error path: attempt create with invalid data, verify error message. | `pnpm test:e2e` — test passes |
| 8 | **User documentation** | Write user-facing guide for `{domain}` using `/document-feature`. Include: description, step-by-step instructions, FAQ entries (3+), troubleshooting, screenshot placeholders. | Feature guide exists at `user_docs/guides/{domain}.md` with all required sections per `18-user-documentation/doc-quality-standards.md` |

**Anti-pattern:** "Build the billing module" — this is 8+ tasks collapsed into one. If any layer fails, the whole "task" is blocked. If progress is measured by tasks, 0/1 complete gives no visibility.

**Correct approach:** 8 separate tasks. If the validator and tests are done but the UI is not started, progress is 4/8 (50%) with clear visibility into what remains.

---

## Rule 2: Task Specificity

Every task must be specific enough that two different developers (or two different AI sessions) would produce functionally identical results.

### Bad Tasks (Vague)

```
- Build the billing module
- Add validation to forms
- Improve the dashboard
- Set up the API
- Fix the bug
- Make it responsive
```

**Why they fail:** "Build the billing module" could mean 5 tasks or 50. The developer must guess scope, which leads to either under-building or over-building.

### Good Tasks (Specific)

```
- Create `createInvoiceSchema` validator with fields: facilityId (uuid, required),
  tripIds (uuid[], min 1), dueDate (date, future), lineItems (array of
  {description: string, quantity: number > 0, unitPrice: number >= 0}).
  Write 8 Zod tests: valid input, empty tripIds, past dueDate, negative quantity,
  negative unitPrice, missing facilityId, empty lineItems, valid with optional notes.

- Build InvoiceDataTable component with columns: Invoice # (sortable),
  Customer (facility name, not UUID), Amount (formatted currency), Status
  (color-coded badge: Draft=gray, Sent=blue, Paid=green, Overdue=red,
  Partial=yellow), Due Date (relative format), Actions (view, edit, delete).
  States: loading (6-row skeleton), empty ("No invoices yet" + Create button),
  error (retry button), populated.

- Create invoice.list procedure: paginated (page, pageSize with defaults 1/20),
  filterable by status (enum), facilityId (uuid), dateRange (start/end),
  sortable by dueDate and amount. Returns { items: Invoice[], total: number,
  page: number, pageSize: number }. Include facility name via join (not UUID).
```

### Specificity Checklist

For every task, verify it specifies:

- [ ] **What** exactly to build (component name, file path, function name)
- [ ] **Fields/columns/parameters** with types and constraints
- [ ] **States** to handle (loading, error, empty, populated — for UI tasks)
- [ ] **Relationships** to other data (joins, foreign keys, nested data)
- [ ] **Verify step** (exact command to run or exact thing to check)

---

## Rule 3: Verify Step is Mandatory

Every task must end with an unambiguous verification step. "It works" is not a verify step.

### Good Verify Steps

```
Verify: `pnpm typecheck` passes with zero errors
Verify: `pnpm test:unit -- --grep "createInvoiceSchema"` — 8/8 tests pass
Verify: `pnpm test:e2e -- --grep "invoice list"` — test passes
Verify: Page at /dashboard/invoices shows 12 rows matching seed data
Verify: Form rejects past date with inline error "Due date must be in the future"
Verify: Lighthouse performance score >90 on /dashboard/invoices
Verify: axe-core reports 0 violations on /dashboard/invoices
Verify: Table paginates at 20 rows; page 2 shows rows 21-40
Verify: Status badge shows correct color: Draft=gray, Sent=blue, Paid=green
Verify: Mobile (375px) — table scrolls horizontally, no content overflow
```

### Bad Verify Steps

```
Verify: The page looks good                    (subjective)
Verify: It works                               (meaningless)
Verify: Tests pass                             (which tests? how many?)
Verify: No errors                              (in console? build? typecheck?)
Verify: The feature is complete                (circular)
Verify: Everything is fine                     (useless)
```

### Verify Step Patterns by Task Type

| Task Type | Verify Pattern |
|-----------|---------------|
| Schema/migration | ORM studio or query shows table with expected columns |
| Validator | `pnpm test:unit` — N/N validator tests pass |
| Router procedure | Procedure returns expected shape; test shows N/N pass |
| Component | Component renders all states (loading, error, empty, populated) |
| Page | Page loads with seed data; specific elements visible |
| E2E test | `pnpm test:e2e` — specific test file passes |
| Performance | Lighthouse score >N on specific page |
| Accessibility | axe-core 0 violations on specific page |
| Security | Specific attack vector rejected (SQL injection, XSS, CSRF) |
| Deploy | URL loads; specific feature works on deployed instance |

---

## Rule 4: Counts-After-Each-Step is Mandatory

After every numbered step in a phase (not every individual task), update running totals. This is how you measure real progress.

### The Count Block

```
### Counts After Step {N}.{M}
- Pages: {cumulative} (+{delta}: {page1}, {page2})
- API procedures: {cumulative} (+{delta}: {router} — {proc1}, {proc2})
- Tests: {passing}/{total} (+{delta} tests)
- Components: {cumulative} (+{delta}: {Component1}, {Component2})
- DB tables: {cumulative} (+{delta}: {table1})
- Build: pass/fail
```

### Count Rules

1. **Cumulative from project start.** Phase 5 page count includes all pages from Phases 0-4.
2. **Delta shows what THIS step added.** `Pages: 24 (+3: InvoiceList, InvoiceDetail, InvoiceCreate)`
3. **Name what you added.** Not just `+3 pages` but `+3: InvoiceList, InvoiceDetail, InvoiceCreate`. This catches "I thought I built 3 but only see 2."
4. **Tests show passing/total.** `Tests: 89/92 (+12 tests)` — if 3 are failing, it is visible immediately.
5. **Build is binary.** Pass or fail. Not "passes with 3 warnings."
6. **Update STATUS.md** with the same counts after each step completes.

### Why Counts Prevent "90% Done for 3 Months"

Without counts, progress reporting is vibes-based:
- "Phase 5 is almost done" (what does "almost" mean?)
- "We just need to finish a few things" (how many? which things?)
- "I'd say we're about 80% done" (based on what?)

With counts, progress is mathematical:
- "Phase 5: 22/28 tasks done, 16/18 pages built, 38/42 API procedures, 67/84 tests passing"
- "Remaining: 2 pages (InvoiceCreate, PaymentRecord), 4 procedures, 17 tests, 6 misc tasks"
- "At current pace: 2 more days"

---

## Rule 5: No Implied Tasks

If a feature needs something, that something is an explicit task. Nothing is "obvious" or "assumed."

### Common Implied Tasks (Make These Explicit)

| Often Implied | Make It Explicit |
|---------------|------------------|
| "The page needs data" | "Create `useInvoices` hook calling `api.invoice.list`" |
| "Obviously it needs validation" | "Create `createInvoiceSchema` with fields: {list}" |
| "We'll need a loading state" | "Build InvoiceList loading skeleton (6 rows, matching column widths)" |
| "It should handle errors" | "Build InvoiceList error state with retry button" |
| "Add it to the sidebar" | "Add 'Invoices' item to sidebar nav under 'Billing' group with FileText icon" |
| "We need env vars for this" | "Add STRIPE_SECRET_KEY to .env.example with comment" |
| "It needs a webhook" | "Create POST /api/webhooks/stripe endpoint with signature verification" |
| "The table needs pagination" | "Add pagination to InvoiceDataTable: page size 20, page/pageSize URL params" |
| "Make it mobile-friendly" | "Verify InvoiceList at 375px: table scrolls horizontally, no content clipping" |
| "Update the docs" | "Update STATUS.md counts; add DEVLOG entry for invoice feature" |
| "Run the tests" | "Run `pnpm test` — all tests pass including new invoice tests" |
| "Deploy it" | "Push to main; verify deployment succeeds; smoke test invoice flow on staging" |

### The Implied Task Test

For every feature, ask these questions. If the answer is "yes," add an explicit task:

1. Does it need new database columns or tables?
2. Does it need new API procedures?
3. Does it need new validators?
4. Does it need new components?
5. Does it need new pages or routes?
6. Does it need loading/error/empty states?
7. Does it need mobile responsiveness?
8. Does it need sidebar/navigation changes?
9. Does it need environment variables?
10. Does it need seed data?
11. Does it need unit tests?
12. Does it need E2E tests?
13. Does it need design token application?
14. Does it need accessibility considerations?
15. Does it need STATUS.md / DEVLOG.md updates?
16. Does it need user-facing documentation (guide, FAQ, troubleshooting)?

---

## Rule 6: Scaffolding Sequence

Tasks within a feature MUST follow this order. Never build a later layer before an earlier one is complete.

```
1. Schema      → Define the data shape in the database
2. Migration   → Apply schema to database
3. Seed        → Populate with realistic test data
4. Validators  → Define input/output shapes with Zod
5. Validator tests → Prove validators work correctly
6. Router      → Create API procedures using validators
7. Router tests → Prove procedures work correctly
8. Components  → Build UI components consuming API data
9. Pages       → Compose components into pages with routing
10. E2E tests  → Prove the full stack works together
```

### Why This Order Matters

**Building UI before API** means you create mocked data, then rebuild when real data has a different shape. This doubles the work.

**Building API before schema** means you guess the data types, then fix them when the schema reveals constraints you missed. This creates subtle bugs.

**Building tests after everything** means you discover bugs in already-"complete" features. This destroys morale and timeline confidence.

**The correct sequence builds confidence incrementally:**
- After step 3: "The data model is solid — I can query seed data."
- After step 5: "The validators are proven — inputs will be clean."
- After step 7: "The API is proven — data flows correctly."
- After step 9: "The UI works with real data — what the user sees is real."
- After step 10: "The full stack works — I have automated proof."

---

## Rule 7: Universal Pre-Task Reading Lists

Every task's Context Header must include the matching reading list from `04-phase-planning/pre-task-reading-lists.md` for its task type. Backend tasks include the backend reading list, frontend tasks include the frontend reading list, etc. These paths are IN ADDITION TO the 3-6 task-specific file paths.

**Why this exists:** Agents skip specs they don't know exist. A backend task that doesn't read the error contract will invent its own error format. A frontend task that doesn't read the state matrix will implement inconsistent loading states.

**How to apply:** During Step 8 (Task Generation), prepend the Universal reading list + the type-specific reading list paths to every task's Context Header. Then add 3-6 task-specific paths after.

**Verify:** Every task file's Context Header contains ≥6 file references (universal list + type list + task-specific).

---

## Quick Reference: Task Template

Use this template when writing individual tasks:

```
- [ ] {ACTION VERB} {SPECIFIC ARTIFACT} with {SPECIFIC DETAILS}
  - {Sub-detail 1: fields, types, constraints}
  - {Sub-detail 2: states, behaviors, edge cases}
  - Verify: {EXACT verification step — command to run or condition to check}
```

### Examples

```
- [ ] Create `trips` schema in `packages/db/src/schema/trips.ts`
  - Columns: id (uuid PK), passengerId (uuid FK->passengers), driverId (uuid FK->drivers, nullable),
    pickupAddress (text), dropoffAddress (text), scheduledDate (date), scheduledTime (time),
    status (enum: scheduled/dispatched/in_progress/completed/cancelled/no_show),
    fareAmount (decimal 10,2), notes (text, nullable), createdAt, updatedAt
  - Indexes: status, scheduledDate, driverId, passengerId
  - Relations: belongsTo passenger, belongsTo driver (optional), hasMany tripStatusHistory
  - Verify: `pnpm typecheck` passes; ORM studio shows trips table with all columns

- [ ] Write 6 unit tests for `createTripSchema` validator
  - Test 1: Valid input with all fields -> passes
  - Test 2: Valid input with only required fields -> passes
  - Test 3: Missing passengerId -> fails with "required" error
  - Test 4: Invalid status value "flying" -> fails with enum error
  - Test 5: Negative fareAmount -> fails with "must be >= 0" error
  - Test 6: Past scheduledDate -> fails with "must be future date" error
  - Verify: `pnpm test:unit -- --grep "createTripSchema"` — 6/6 pass

- [ ] Build TripStatusBadge component
  - Accepts: status (TripStatus enum)
  - Renders: colored badge with label
  - Colors: scheduled=slate, dispatched=blue, in_progress=amber,
    completed=green, cancelled=red, no_show=orange
  - Verify: renders correct color and label for each of 6 status values
```
