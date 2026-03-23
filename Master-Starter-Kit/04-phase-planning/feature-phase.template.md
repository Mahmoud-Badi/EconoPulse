# Phase {N}: {{PHASE_NAME}}

> **Instructions:** Copy this template for each feature phase (Phase 1 through N-2). Replace all `{{PLACEHOLDERS}}`. Derive tasks from the `ARCHITECTURE/` files — do not invent tasks from memory.

**Goal:** {One sentence describing what the user can do after this phase that they could not do before.}

**Estimated Tasks:** {N}
**Estimated Duration:** {N} weeks
**Prerequisites:** Phase {N-1} complete, {specific artifacts — e.g., "trips schema exists", "driver router registered"}

**Must Have Features Delivered:**
- {Feature 1 from VERDICT.md}
- {Feature 2 from VERDICT.md}
- {Feature 3 from VERDICT.md}

**Acceptance Criteria:**
- [ ] {Testable condition for Feature 1 — e.g., "Creating a trip with valid data saves to DB and appears in trip list"}
- [ ] {Testable condition for Feature 2}
- [ ] {Testable condition for Feature 3}
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm test` passes with zero failures
- [ ] `pnpm typecheck` passes with zero errors
- [ ] All new pages render correctly at 375px, 768px, 1024px, 1440px

**Usability Milestone:** After this phase, the user can: {specific workflow they can now perform in their daily work — e.g., "create, assign, and track trips end-to-end without any external tools"}
**Replaces:** {what manual process, spreadsheet, or external tool this phase eliminates — e.g., "the driver assignment spreadsheet" or "N/A — new capability"}
**Standalone Usable:** {Yes/No} — Can the user start using this phase's features in production while later phases are still in development?

---

## How to Derive Tasks

**Do not write tasks from memory.** Open these architecture files and translate each artifact into tasks:

1. **Schema files** (`ARCHITECTURE/schema/{domain}.ts`) — Each table becomes:
   - Create/update schema task
   - Create validator (Zod) task
   - Write validator tests task (5+ tests per schema)
   - Create seed data task
   - Run migration task

2. **Router specs** (`ARCHITECTURE/routers/{domain}.router.ts`) — Each procedure becomes:
   - Create procedure task (with input/output types)
   - Write procedure unit test task (happy path + error cases)
   - Register in root router task

3. **Screen catalog** (`ARCHITECTURE/screens/`) — Each screen becomes:
   - Build component task(s) (with all states: loading, error, empty, populated)
   - Build page task (integrates components with data hooks, includes `loading.tsx` + `error.tsx`)
   - Write E2E test task (happy path + one error path)

4. **Design specs** (`ARCHITECTURE/design/`) — Each page needs:
   - Design token application task
   - Responsive verification task

---

## Step {N}.1: Data Layer ({M} tasks)

- [ ] Create/update schema for `{{DOMAIN}}` table(s)
  - Fields: {list all columns from architecture schema}
  - Relations: {list all foreign keys and their targets}
  - Indexes: {list all indexes}
  - Verify: `pnpm typecheck` passes; schema matches architecture exactly
- [ ] Create Zod validators for `{{DOMAIN}}`
  - `create{Domain}Schema`: {list required fields}
  - `update{Domain}Schema`: {list updatable fields, all optional}
  - `{domain}FilterSchema`: {list filter fields — status, date range, search, etc.}
  - Verify: validators export correctly; `pnpm typecheck` passes
- [ ] Write validator tests (minimum 5 per schema)
  - Test valid input (all fields)
  - Test valid input (only required fields)
  - Test invalid: missing required field
  - Test invalid: wrong type (string where number expected)
  - Test invalid: constraint violation (negative amount, past date, etc.)
  - Verify: `pnpm test:unit` — all validator tests pass
- [ ] Create seed data for `{{DOMAIN}}` (add to `packages/db/src/seed/{domain}.ts`)
  - Minimum {N} realistic records
  - Cover all enum values (e.g., if status has 5 values, seed at least one of each)
  - Verify: `npx tsx src/seed/index.ts` runs; query shows expected record count
- [ ] Run migration (if schema changed)
  - Verify: ORM studio or direct query shows new/updated columns

### Counts After Step {N}.1
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+{delta}: {domain} validators)
- Components: {cumulative} (+0)
- DB tables: {cumulative} (+{delta}: {table1}, {table2})
- Build: pass

---

## Step {N}.2: API Layer ({M} tasks)

- [ ] Create `{{DOMAIN}}` router with procedures:
  - `list` — paginated, filterable, sortable (input: `{domain}FilterSchema`)
  - `getById` — single record with relations (input: `{ id: string }`)
  - `create` — validated input (input: `create{Domain}Schema`)
  - `update` — partial update (input: `update{Domain}Schema` + `{ id: string }`)
  - `delete` — soft or hard delete (input: `{ id: string }`)
  - {Additional domain-specific procedures from router spec}
  - Verify: each procedure callable from client; returns expected shape
- [ ] Write router unit tests
  - Test each procedure: happy path + at least one error case
  - Test authorization: wrong role gets 403
  - Test validation: invalid input gets 400
  - Verify: `pnpm test:unit` — all router tests pass
- [ ] Register `{{DOMAIN}}` router in root app router
  - Verify: `pnpm typecheck` passes; router appears in client type inference

### Counts After Step {N}.2
- Pages: {cumulative} (+0)
- API procedures: {cumulative} (+{delta}: {domain} router — list, getById, create, update, delete, ...)
- Tests: {cumulative} (+{delta}: {domain} router tests)
- Components: {cumulative} (+0)
- DB tables: {cumulative} (+0)
- Build: pass

---

## Step {N}.3: UI Layer ({M} tasks)

- [ ] Build `{Domain}DataTable` component
  - Columns: {list columns from screen catalog}
  - Features: sorting, filtering, pagination, row actions
  - States: loading (skeleton), empty (illustration + CTA), error (retry button), populated
  - Verify: component renders all 4 states correctly; storybook or dev route shows all states
- [ ] Build `{Domain}Form` component
  - Fields: {list fields from create schema}
  - Validation: connected to Zod schema, inline error messages
  - States: idle, submitting (disabled + spinner), success (toast), error (inline messages)
  - Verify: form validates on blur; submits valid data; shows errors for invalid data
- [ ] Build `{Domain}Detail` component (if applicable)
  - Sections: {list sections — overview, related records, activity log, actions}
  - Verify: renders all sections with seed data
- [ ] Build `{DomainList}` page (`/dashboard/{domain}`)
  - Integrates `{Domain}DataTable` with data hook
  - Includes `loading.tsx` (skeleton matching table layout)
  - Includes `error.tsx` (error message + retry)
  - Verify: page loads with seed data; pagination works; filters work
- [ ] Build `{DomainDetail}` page (`/dashboard/{domain}/[id]`)
  - Integrates `{Domain}Detail` with data hook
  - Includes `loading.tsx` + `error.tsx`
  - Verify: page loads with seed data; all sections populated
- [ ] Build `{DomainCreate}` page (`/dashboard/{domain}/new`) or modal
  - Integrates `{Domain}Form` with mutation hook
  - Verify: form submits; new record appears in list; toast confirms success
- [ ] Build `{DomainEdit}` page (`/dashboard/{domain}/[id]/edit`) or modal
  - Integrates `{Domain}Form` (pre-populated) with mutation hook
  - Verify: form pre-fills existing data; save updates record; toast confirms success

### Counts After Step {N}.3
- Pages: {cumulative} (+{delta}: {page1}, {page2}, {page3}, {page4})
- API procedures: {cumulative} (+0)
- Tests: {cumulative} (+0)
- Components: {cumulative} (+{delta}: {Component1}, {Component2}, {Component3})
- DB tables: {cumulative} (+0)
- Build: pass

---

## Step {N}.4: Testing & Polish ({M} tasks)

- [ ] Write E2E test for `{Feature1}` happy path
  - Steps: navigate to list, click create, fill form, submit, verify in list
  - Verify: `pnpm test:e2e` — test passes
- [ ] Write E2E test for `{Feature1}` error path
  - Steps: submit invalid form, verify error messages, fix and resubmit
  - Verify: `pnpm test:e2e` — test passes
- [ ] Write E2E test for `{Feature2}` (if multiple features in this phase)
  - Verify: `pnpm test:e2e` — test passes
- [ ] Run `/design-verify` — fix any design inconsistencies
  - Verify: all items in design checklist pass
- [ ] Run `/feature-checklist` — confirm all layers complete
  - Verify: no missing layers (validator, tests, components, pages, E2E)
- [ ] Run `/verify` — full verification
  - Verify: build passes, typecheck passes, all tests pass, no TODOs remaining
- [ ] Update STATUS.md with final phase counts
  - Verify: counts in STATUS.md match actual file counts

### Counts After Step {N}.4 (Phase {N} Complete)
- Pages: {cumulative} (+{delta from E2E/polish if any})
- API procedures: {cumulative}
- Tests: {cumulative} (+{delta}: {N} E2E tests)
- Components: {cumulative}
- DB tables: {cumulative}
- Build: pass

---

## Phase {N} Completion Checklist

Before starting Phase {N+1}, verify ALL of the following:

- [ ] Every Must Have feature listed above is fully functional
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm test` passes with zero failures
- [ ] `pnpm typecheck` passes with zero errors
- [ ] All new pages responsive at 375px, 768px, 1024px, 1440px
- [ ] Seed data renders correctly on all new pages
- [ ] No TODO/FIXME comments in this phase's code
- [ ] STATUS.md updated with accurate counts
- [ ] DEVLOG.md updated with phase summary
- [ ] handoff.md updated: "Phase {N} complete, start Phase {N+1}"

---

## Notes for AI Assistants

When generating a phase file from this template:

1. **Open the architecture files first.** Do not write tasks from memory. The schema file tells you exactly which columns to create. The router spec tells you exactly which procedures to build. The screen catalog tells you exactly which components and pages to build.

2. **Count everything.** After filling in the template, count: How many tasks total? How many validator tests? How many E2E tests? How many pages? These numbers go into the phase header and into PHASE-INDEX.md.

3. **No implied tasks.** If the feature needs a webhook, "Create webhook endpoint" is an explicit task. If it needs new environment variables, "Add {{VAR}} to .env.example" is an explicit task. If it needs a new sidebar navigation item, "Add {Domain} to sidebar navigation" is an explicit task.

4. **One feature, one phase.** Every task for a feature lives in the same phase. A feature is never "started" in one phase and "finished" in another.
