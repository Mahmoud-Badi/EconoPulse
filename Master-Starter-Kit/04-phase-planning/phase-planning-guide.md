# Phase Planning Guide

How to break a project's approved features into executable phases. Each phase is a vertical slice of the application that delivers end-to-end functionality, leaves the app shippable, and has measurable completion criteria.

---

## Phase Taxonomy

Every project follows this phase structure:

### Phase 0 — Foundation (Always First, Always Same Structure)

Phase 0 is identical across all projects. It establishes:

- **Monorepo structure** — Turborepo, pnpm workspaces, package wiring
- **Database** — ORM config, schema from architecture, migrations, seed data
- **Auth system** — Provider, roles, permissions, login/register/forgot-password
- **Base UI** — Component library, design tokens, shell layout, error pages
- **Testing** — Unit + E2E runners configured, first test of each type passing
- **Anti-context-rot files** — CLAUDE.md, STATUS.md, DEVLOG.md, handoff.md, custom commands
- **First deploy** — Staging environment with environment variables, smoke test passing

Phase 0 is not optional. It is not "setup we'll do as we go." It is a complete, deliberate phase with 24-30 tasks, each with a verify step. Use `phase-0-foundation.template.md` directly.

**Why Phase 0 matters:** Every bug in foundation multiplies across every feature phase. A misconfigured auth system means re-doing auth checks in 15 phases. A broken test runner means 0 tests across the entire project. Investing 1 week in Phase 0 saves 3+ weeks of accumulated fixes.

### Phase 1 through N-2 — Feature Phases

Each feature phase groups 3-8 Must Have features that share data models or domain concepts. Features within a phase should be cohesive — they touch the same database tables, use the same API routers, and appear in the same section of the UI.

Examples of good phase groupings:
- **Trip Management**: Create trip, edit trip, trip detail view, trip status transitions, trip search/filter
- **Driver Management**: Driver CRUD, driver availability, driver-vehicle assignment, driver documents
- **Billing**: Invoice generation, payment recording, aging report, statement export

Examples of bad phase groupings:
- **"Backend stuff"**: All schemas + all APIs (no UI, app is unusable)
- **"UI sprint"**: All pages at once (no data layer, everything is mocked)
- **"Misc features"**: Unrelated features lumped together (notifications + reports + settings)

### Phase N-1 — Polish + Launch

The second-to-last phase is always polish and launch preparation:
- Test coverage targets (>80% statements, >88% functions)
- Performance optimization (Lighthouse >90, bundle analysis, query optimization)
- Accessibility audit (axe-core, keyboard nav, screen reader, color contrast)
- Security review (auth flows, input validation, RBAC, CSP, rate limiting)
- Production deployment (env vars, database migration, SSL, monitoring, go-live checklist)

Use `polish-launch-phase.template.md` directly.

### Phase N — Post-Launch

The final phase contains Should Have features from the tribunal verdict. These are real features with real value, but the app ships without them. They are planned but not promised for V1.

---

## Sequencing Rules

Phase order is not arbitrary. These rules prevent the most common sequencing failures:

### Rule 1: Data Model Phases Before UI Phases

If Phase 3 needs trip data and Phase 2 creates the trip schema, Phase 2 must come first. This seems obvious, but it is the most commonly violated rule when teams try to "parallelize" work.

**How to check:** For each phase, list every database table it reads from. Verify that the phase creating those tables has a lower number.

### Rule 2: Auth System Before Any Protected Feature

Every feature phase assumes authentication and authorization work. Phase 0 must deliver:
- Login/logout flow
- Role-based access control
- Protected route middleware/proxy
- Session management

No feature phase should include "add auth to this page" — auth is already done.

### Rule 3: Core Entities Before Referencing Entities

If trips reference drivers, and drivers reference vehicles, the sequence is:
1. Vehicles (no foreign keys to other domain entities)
2. Drivers (references vehicles)
3. Trips (references drivers)

**How to identify core entities:** Look at the schema dependency graph from `ARCHITECTURE/schema/`. Entities with zero foreign keys to other domain entities are core. Entities with the most inbound foreign keys are built last.

### Rule 4: Each Phase Leaves the App Shippable

"Shippable" means:
- `pnpm build` succeeds with zero errors
- `pnpm test` passes with zero failures
- `pnpm typecheck` passes with zero errors
- The deployed app loads, auth works, all completed features function
- No half-wired features (a page exists but shows "TODO" or crashes)

If a phase would break the app mid-way, restructure it so each step maintains a working state.

### Rule 5: Each Phase Completable in 1-3 Weeks (1-2 Developers)

If a phase takes longer than 3 weeks, it is too large. Split it. If a phase takes less than 3 days, merge it with an adjacent phase.

**Phase sizing heuristic:**
- 15-25 tasks = small phase (~1 week)
- 25-35 tasks = medium phase (~2 weeks)
- 35+ tasks = too large, split it

### Rule 6: Time-to-First-Use Ordering

After satisfying data dependency constraints (Rules 1-3), order remaining phases by **which delivers usable value to the end user soonest**. The goal: the user starts performing real workflows in the system as early as possible — not after everything is built.

**"Usable value" means:**
- The user can perform a complete workflow end-to-end (not just view data, but create, edit, and act on it)
- The user can start using THIS part of the system in production or daily work while later phases are still being built
- The phase replaces a manual process, spreadsheet, or external tool the user currently depends on

**How to apply:**
1. After ordering clusters by their dependency graph (Step 5 below), identify clusters with no dependency relationship to each other (independent clusters)
2. Among independent clusters, put the one the user would use first *earliest*
3. Tiebreaker: "Which cluster lets the user stop using their current manual process / spreadsheet / external tool soonest?"

**Example:** A logistics app has three independent clusters after the core entities phase: Driver Management, Billing, and Reporting. The user currently manages drivers in a spreadsheet and billing in QuickBooks. Driver Management goes first — it replaces the spreadsheet the user opens every morning. Billing goes second — it replaces QuickBooks. Reporting goes last — it's valuable but the user survived without it until now.

**Why this matters:** A system that is 30% built but covers the user's most painful daily workflow is more valuable than a system that is 80% built but doesn't cover any complete workflow yet. Users who start using the system early also provide better feedback, catch UX issues sooner, and stay motivated through the remaining build.

---

## Incremental Usability Checklist

Before finalizing phase order, answer these three questions for every feature phase. If a phase fails all three, consider restructuring it.

| # | Question | Good Answer | Red Flag |
|---|----------|-------------|----------|
| 1 | What can the user **DO** after this phase that they couldn't before? | "Create and manage trips end-to-end" | "Database tables exist" (existence is not usability) |
| 2 | Can the user start using this in production while later phases are still being built? | "Yes — trip management works independently of billing" | "No — it depends on 3 other unbuilt phases" |
| 3 | Does this phase replace a manual process, spreadsheet, or external tool? | "Replaces the driver assignment spreadsheet" | "N/A — this is a new capability nobody asked for yet" |

**If a phase doesn't enable at least one new usable workflow**, it should be merged with an adjacent phase or restructured so it does. Every phase the user waits through without being able to use anything new is a phase where motivation and feedback quality decline.

---

## The Counts-After-Each-Step Pattern

This is the most important operational practice in phase planning. After every numbered step (not every task, but every step that groups tasks), you update running totals.

### Why Counts Matter

Without counts:
- "How far along are we?" → "Pretty far, maybe 80%?"
- "When will we finish?" → "A few more weeks?"
- "What's left?" → "Just some stuff"

With counts:
- "How far along are we?" → "14 of 18 pages built, 42 of 48 API procedures, 89 of 112 tests passing"
- "When will we finish?" → "4 pages, 6 procedures, 23 tests remain — ~1.5 weeks at current pace"
- "What's left?" → "Step 7.3 (3 pages) + Step 7.4 (testing)"

### Count Format

After every numbered step in a phase file, add this block:

```
### Counts After Step {N}.{M}
- Pages: {cumulative} (+{delta}: {page1}, {page2})
- API procedures: {cumulative} (+{delta}: {router1} {count}, {router2} {count})
- Tests: {passing}/{total} (+{delta} tests)
- Components: {cumulative} (+{delta}: {Component1}, {Component2})
- DB tables: {cumulative} (+{delta}: {table1})
- Build: pass/fail
```

### Count Rules

1. **Cumulative, not per-phase.** Page count in Phase 5 includes all pages from Phases 0-4.
2. **Delta shows what this step added.** `Pages: 18 (+3: InvoiceList, InvoiceDetail, InvoiceCreate)`.
3. **Tests show passing/total.** `Tests: 89/112 passing (+23 tests)` — if some are failing, that is visible.
4. **Build status is binary.** Either it passes or it does not. No "passes with warnings."
5. **Update counts in STATUS.md** after completing each step (not just in the phase file).

---

## Phase Sizing Guide

### Small Project (10-20 Must Have Features)

```
Phase 0: Foundation                    ~25 tasks, 1 week
Phase 1: Core Entity A + B            ~20 tasks, 1 week
Phase 2: Core Entity C + Relationships ~25 tasks, 1.5 weeks
Phase 3: Workflows + Business Logic    ~25 tasks, 1.5 weeks
Phase 4: Polish + Launch               ~18 tasks, 1 week
Phase 5: Post-Launch (Should Haves)    ~15 tasks, ongoing
─────────────────────────────────────
Total: 6 phases, ~128 tasks, ~6 weeks
```

### Medium Project (20-50 Must Have Features)

```
Phase 0: Foundation                    ~28 tasks, 1 week
Phase 1: Core Entities                 ~25 tasks, 1.5 weeks
Phase 2: Secondary Entities            ~30 tasks, 2 weeks
Phase 3: Relationships + References    ~25 tasks, 1.5 weeks
Phase 4: Workflow A                    ~30 tasks, 2 weeks
Phase 5: Workflow B                    ~25 tasks, 1.5 weeks
Phase 6: Reporting + Analytics         ~20 tasks, 1 week
Phase 7: Integrations                  ~25 tasks, 1.5 weeks
Phase 8: Advanced Features             ~30 tasks, 2 weeks
Phase 9: Polish + Launch               ~18 tasks, 1 week
Phase 10: Post-Launch                  ~20 tasks, ongoing
─────────────────────────────────────
Total: 11 phases, ~276 tasks, ~15 weeks
```

### Large Project (50+ Must Have Features)

```
Phase 0: Foundation                    ~30 tasks, 1 week
Phase 1-4: Core domain (4 phases)      ~110 tasks, 6 weeks
Phase 5-8: Secondary domain (4 phases) ~110 tasks, 6 weeks
Phase 9-12: Workflows (4 phases)       ~100 tasks, 6 weeks
Phase 13-15: Advanced (3 phases)       ~75 tasks, 4 weeks
Phase 16: Polish + Launch              ~20 tasks, 1.5 weeks
Phase 17: Post-Launch                  ~25 tasks, ongoing
─────────────────────────────────────
Total: 18 phases, ~470 tasks, ~25 weeks
```

---

## Feature-to-Phase Mapping Process

### Step 1: List All Must Have Features

Open `TRIBUNAL/VERDICT.md`. Extract every Must Have feature into a flat list:

```
1. User registration + login
2. Trip CRUD
3. Trip status transitions
4. Driver CRUD
5. Driver availability
6. Vehicle CRUD
7. Dispatch board
8. Invoice generation
9. Payment recording
...
```

### Step 2: Identify Data Dependencies

For each feature, list the database tables it needs:

```
Trip CRUD → trips, passengers, facilities
Driver CRUD → drivers, users
Dispatch board → trips, drivers, vehicles (reads from all three)
Invoice generation → invoices, invoice_line_items, trips, facilities
```

### Step 3: Build Dependency Graph

Draw arrows from dependent features to their prerequisites:

```
Dispatch board → Trip CRUD, Driver CRUD, Vehicle CRUD
Invoice generation → Trip CRUD, Facility management
Payment recording → Invoice generation
Trip status transitions → Trip CRUD, Driver CRUD
```

### Step 4: Group Into Clusters

Features that share data models and have no internal dependency conflicts become a phase:

```
Cluster A: Trip CRUD + Trip search/filter (both use trips table)
Cluster B: Driver CRUD + Driver availability + Driver-vehicle assignment
Cluster C: Dispatch board + Trip status transitions (workflow features)
Cluster D: Invoice generation + Payment recording + Aging report
```

### Step 5: Sequence Clusters by Dependencies

Order clusters by their dependency graph first:

```
Phase 1: Cluster B (drivers — no domain dependencies)
Phase 2: Cluster A (trips — may reference drivers)
Phase 3: Cluster C (dispatch — reads trips + drivers)
Phase 4: Cluster D (billing — references trips)
```

### Step 5.5: Re-Order by Time-to-First-Use (Rule 6)

After the dependency-based sequence, identify clusters that are **independent** of each other (no data dependency in either direction). Among independent clusters, re-order so the one the user would use first goes earliest.

**Process:**
1. Look at the dependency graph from Step 5. Find clusters with no arrows between them — these can be swapped freely.
2. For each independent cluster, answer: "If this were the ONLY thing built, could the user start using it in their daily work?"
3. Ask the user: "Which of these capabilities do you need soonest?" Present the independent clusters with a one-line description of what daily workflow each enables.
4. Re-order independent clusters based on the user's answer, while keeping dependency-constrained clusters in their required position.

**Example:** Cluster B (drivers) and Cluster D (billing) are independent — neither references the other's tables. The user currently tracks drivers in a spreadsheet they open every morning. Move drivers before billing even if billing has more features, because the user gets immediate daily value from driver management.

```
BEFORE (pure dependency order):        AFTER (time-to-first-use applied):
Phase 1: Cluster B (drivers)           Phase 1: Cluster B (drivers) ← user uses daily
Phase 2: Cluster A (trips)             Phase 2: Cluster A (trips) ← depends on drivers
Phase 3: Cluster C (dispatch)          Phase 3: Cluster D (billing) ← independent, user needs it next
Phase 4: Cluster D (billing)           Phase 4: Cluster C (dispatch) ← depends on trips + drivers
```

### Step 6: Verify Coverage

Create a checklist:
```
- [x] User registration + login → Phase 0
- [x] Trip CRUD → Phase 2
- [x] Trip status transitions → Phase 3
- [x] Driver CRUD → Phase 1
- [x] Driver availability → Phase 1
- [x] Vehicle CRUD → Phase 1
- [x] Dispatch board → Phase 3
- [x] Invoice generation → Phase 4
- [x] Payment recording → Phase 4
```

**Every Must Have feature must have exactly one checkmark.** Zero means you forgot it. Two means you duplicated it. Both are bugs.

---

## Common Mistakes

### Mistake 1: "We'll figure out the tasks as we go"

Phase files with vague tasks like "Build the dashboard" lead to scope creep, missed features, and unpredictable timelines. Every task must be specific enough that two different developers would build the same thing.

### Mistake 2: Skipping Phase 0

"We already know how to set up a project" is not the point. Phase 0 establishes the anti-context-rot files (CLAUDE.md, STATUS.md, handoff.md) and custom commands that make every subsequent phase 2-3x faster. Skipping Phase 0 means every future AI session starts from scratch.

### Mistake 3: Putting all "easy" features first

Sequencing by difficulty feels productive but creates a "wall of hard features" at the end when morale is lowest. Instead, sequence by data dependency. Hard features naturally distribute across phases.

### Mistake 4: No acceptance criteria on phases

A phase without acceptance criteria is never "done." Every phase needs:
- Specific testable conditions (not "billing works" but "creating an invoice with 3 line items shows correct total")
- Build passes
- Tests pass
- Typecheck passes

### Mistake 5: Features split across phases

"We'll build the invoice form in Phase 4 and add validation in Phase 6" means invoices are broken for two phases. Every feature must be fully functional within its phase.
