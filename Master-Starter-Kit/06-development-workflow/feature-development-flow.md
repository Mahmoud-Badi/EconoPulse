# Feature Development Flow

## The Complete Feature Lifecycle

Every feature follows these 17 steps in this exact order. Skipping steps causes rework. The order exists because each step depends on the output of previous steps.

---

## Phase 1: Think Before You Build

### Step 1: Brainstorm

```
/brainstorm
```

Or use `superpowers:brainstorming` for structured exploration.

**What happens:** Explore requirements before committing to an approach. Ask questions like:
- What are the user stories?
- What edge cases exist?
- What existing patterns in the codebase should we follow?
- What are the data requirements?

**Why this step exists:** Building without brainstorming leads to mid-implementation pivots. A 10-minute brainstorm prevents a 2-hour rewrite.

**Output:** Clear requirements and acceptance criteria.

### Step 2: Plan

```
/feature-dev
```

This runs a 7-phase guided analysis:
1. Codebase scan (what exists that's relevant)
2. Dependency analysis (what this feature touches)
3. Architecture design (where each piece lives)
4. Data model design (schema changes needed)
5. API design (endpoints, inputs, outputs)
6. UI design (pages, components, states)
7. Test plan (what to test, what edge cases)

**Why this step exists:** Without a plan, you build bottom-up and discover integration problems late. The plan surfaces problems when they're cheap to fix (in a document) rather than expensive (in code).

**Output:** Implementation plan with specific files, schemas, and component trees.

### Step 3: Design

```
/design-generate {screen-type} {description}
```

This triggers the multi-AI design pipeline (see `07-ui-design-system/design-pipeline.md`):
- Research best-in-class examples
- Generate UI concept
- Review for quality
- Map to components
- Create implementation spec

**Why this step exists:** Code-first UI always looks like a template. Design-first UI looks like a product. The difference between a 2/10 and an 8/10 demo rating is whether you designed before coding.

**Output:** Visual concept + implementation spec with component tree, data flow, and responsive breakpoints.

---

## Phase 2: Build the Data Layer

### Step 4: Schema

```
/scaffold-schema {domain}
```

**What this generates:**
- Drizzle schema with proper types, relations, and indexes
- TypeScript types inferred from schema
- Barrel exports

**Why schema first:** Everything depends on the data shape. Router procedures need it for input/output types. Forms need it for validation schemas. Components need it for prop types. Get the schema wrong and everything built on top is wrong.

**Key decisions at this step:**
- Field types and nullability
- Relations (one-to-many, many-to-many)
- Indexes for query performance
- Enum values (use `as const` for TypeScript)

### Step 5: Seed

```
/scaffold-seed {domain}
```

**What this generates:**
- Seed file with realistic-looking data
- Covers normal cases, edge cases, and empty states
- Deterministic (same seed = same data)

**Why seed before UI:** You cannot test UI with empty databases. You cannot test edge cases without edge case data. Seeding early means every subsequent step has real data to work with.

**Target:** 10-50 records per entity, covering:
- Normal cases (the happy path)
- Edge cases (max-length names, special characters, null optional fields)
- Status variety (if entity has statuses, seed all of them)

### Step 6: Router

```
/scaffold-router {name}
```

**What this generates:**
- tRPC router with CRUD procedures
- Auth middleware (protected routes)
- Input validation with Zod schemas
- Proper error handling

**Why router before UI:** Components need data. If you build the UI first, you hardcode mock data that never gets replaced. If you build the router first, the UI uses real API hooks from the start.

**Key decisions at this step:**
- Which procedures need auth? (Almost all of them)
- Which procedures need role-based access? (Admin-only operations)
- What are the input shapes? (Reuse Zod schemas from validators)
- What are the output shapes? (Include relations? Computed fields?)

### Step 7: Validators

Validators are typically generated alongside the router, but review them separately:

**Check for:**
- All required fields validated
- String length limits (prevent abuse)
- Enum values constrained
- Email/phone/URL format validation
- Cross-field validation (end date after start date)

**Share validators between server and client:**
```typescript
// packages/validators/src/trip.ts
export const createTripSchema = z.object({ ... });

// Used in router:
.input(createTripSchema)

// Used in form:
zodResolver(createTripSchema)
```

---

## Phase 3: Build the UI Layer

### Step 8: Form (If Applicable)

```
/scaffold-form {entity} {mode}
```

Where `mode` is `create` or `edit`.

**What this generates:**
- React Hook Form setup with zodResolver
- All fields with proper input types
- Error display per field
- Submit handler calling tRPC mutation
- Loading and success states

**Why forms use shared validators:** One schema, two consumers. The server rejects invalid data. The client prevents sending it. No duplication.

### Step 9: Component

```
/scaffold-component {name}
```

**What this generates:**
- React component with TypeScript props
- Loading, error, empty, and data states
- Proper accessibility attributes
- Responsive layout

**Key principle:** Components receive data via props. They do NOT fetch data. Pages fetch data and pass it down. This keeps components testable and reusable.

### Step 10: Page

```
/scaffold-page {portal} {path}
```

**What this generates:**
- Next.js page with data fetching
- All 4 states: loading (skeleton), error (message + retry), empty (illustration + CTA), data (content)
- Breadcrumbs and page header
- Integration of components with API hooks

**The 4-state rule:** Every page MUST handle loading, error, empty, and data states. No exceptions. Users see loading spinners, not blank screens. Users see helpful errors, not raw stack traces. Users see "No trips yet, create one" not an empty table.

---

## Phase 4: Test and Verify

### Step 11: E2E Test

```
/scaffold-e2e {scenario}
```

**What this generates:**
- Playwright test for the happy path (create, read, update, delete)
- Playwright test for error cases (invalid input, unauthorized access)
- Page object model for reusable selectors

**Why E2E last:** E2E tests exercise the full stack. You need the schema, router, components, and pages to all exist before E2E tests can run.

### Step 12: SSE (If Real-Time)

```
/wire-sse {feature}
```

Only if the feature needs real-time updates (dispatch board, live tracking, notifications).

**What this generates:**
- SSE endpoint
- Client subscription hook
- Reconnection logic

---

## Phase 5: Quality Gates

### Step 13: Feature Checklist

```
/feature-checklist {feature}
```

Verifies all layers exist:
- [ ] Schema defined and migrated
- [ ] Seed data created
- [ ] Router procedures implemented
- [ ] Validators shared between server and client
- [ ] Form (if applicable) with validation
- [ ] Components with all 4 states
- [ ] Page integrated and working
- [ ] E2E test passing

### Step 14: Design Verify

```
/design-verify
```

Fast code-inspection design checklist. Checks for:
- Anti-slop violations (see `07-ui-design-system/anti-slop-rulebook.md`)
- Token compliance (using design tokens, not hardcoded values)
- Responsive issues (missing breakpoints)
- Accessibility gaps (missing labels, contrast issues)

### Step 15: Design Review

```
/design-review {route}
```

Deep Playwright visual audit. Actually navigates to the page and takes screenshots at multiple breakpoints. More thorough than `/design-verify` but slower.

**Use for:** Major new screens, redesigns, anything user-facing.

### Step 16: Verify

```
/verify
```

The 8-step quality gate:
1. TypeScript strict mode passes
2. All unit tests pass
3. All E2E tests pass
4. Build succeeds
5. No console errors in browser
6. Auth works (login, logout, protected routes)
7. Feature works end-to-end with real data
8. No regressions in existing features

### Step 17: Commit

```
/commit
```

Staged commit with a descriptive message following conventional commits:

```
feat(trips): add trip creation form with validation
fix(auth): correct session cookie path for production
refactor(billing): extract invoice calculation to shared util
```

---

## Shortcut: When You Can Skip Steps

| Scenario | Skip |
|----------|------|
| Bug fix (no new UI) | Steps 3, 8-10 |
| Schema-only change | Steps 3, 8-10 |
| Style/design change | Steps 4-7 |
| Adding a field to existing form | Steps 1-3, 9-10 |
| Documentation only | Steps 3-12 |

**Never skip:** Steps 13-17 (quality gates). Every change, no matter how small, goes through verify and commit.

---

## Common Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| Skip brainstorm | Mid-build pivots | Spend 10 min on Step 1 |
| Build UI before router | Hardcoded mock data | Follow the sequence |
| Skip seed data | Can't test real flows | Seed early, seed realistically |
| Skip design step | Template-looking UI | Always design before code |
| Batch quality gates | Ship bugs to production | Run gates after each feature |
| Skip E2E | "Works locally" failures | E2E catches integration issues |
