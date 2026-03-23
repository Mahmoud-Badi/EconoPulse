# Phase 0: Foundation

> **This phase is universal.** It is the same structure for every project. Replace `{{PLACEHOLDERS}}` with your project-specific values.

**Goal:** Working development environment with auth, database, base UI, testing, anti-context-rot files, and first deploy to staging.

**Estimated Tasks:** 24-30
**Estimated Duration:** 1 week
**Prerequisites:** `ARCHITECTURE/` folder complete (schema, routers, screens, design tokens, dependency graph)

**Acceptance Criteria:**
- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` succeeds with zero errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm test` passes (at least 2 tests: 1 unit, 1 E2E)
- [ ] Register, login, logout flow works end-to-end
- [ ] Role-based redirect works (admin -> dashboard, driver -> driver portal)
- [ ] Seed data visible in database (verified via ORM studio or query)
- [ ] Staging deployment loads, auth works, database connects
- [ ] CLAUDE.md, STATUS.md, DEVLOG.md, handoff.md all exist and are populated
- [ ] At least 10 custom commands exist in `.claude/commands/`

---

## Placeholders

Replace these before starting:

| Placeholder | Example | Your Value |
|-------------|---------|------------|
| `{{PROJECT}}` | delta | |
| `{{PROJECT_DISPLAY}}` | Delta TMS | |
| `{{FRAMEWORK}}` | Next.js 16 | |
| `{{ORM}}` | Drizzle ORM | |
| `{{DATABASE}}` | PostgreSQL (Supabase) | |
| `{{AUTH_PROVIDER}}` | Better Auth | |
| `{{COMPONENT_LIB}}` | shadcn/ui | |
| `{{DEPLOY_TARGET}}` | Vercel | |
| `{{DOMAIN}}` | nemt.example.com | |

---

## Step 0.1: Monorepo Setup (8 tasks)

- [ ] Initialize Turborepo with pnpm workspaces
  - Verify: `pnpm --version` outputs version, `turbo --version` outputs version
- [ ] Configure `pnpm-workspace.yaml` with workspace paths (`apps/*`, `packages/*`, `tooling/*`)
  - Verify: `pnpm ls --depth 0` lists workspace packages
- [ ] Configure `turbo.json` with pipeline (build deps, dev, lint, typecheck, test), caching rules, and `globalEnv`
  - Verify: `pnpm turbo build --dry-run` shows correct task graph
- [ ] Set up shared tooling: Biome config, TypeScript base `tsconfig.json`, Tailwind CSS config
  - Verify: `pnpm biome check .` runs without config errors
- [ ] Create all package directories with `package.json`:
  - `packages/db` — `@{{PROJECT}}/db`
  - `packages/api` — `@{{PROJECT}}/api`
  - `packages/validators` — `@{{PROJECT}}/validators`
  - `packages/auth` — `@{{PROJECT}}/auth`
  - `packages/ui` — `@{{PROJECT}}/ui` (if shared components)
  - Verify: each package has a valid `package.json` with correct `name` field
- [ ] Create `apps/web` with {{FRAMEWORK}}
  - Verify: `cd apps/web && pnpm dev` starts dev server
- [ ] Wire cross-package dependencies (`@{{PROJECT}}/db`, `@{{PROJECT}}/api`, etc.) in `apps/web/package.json`
  - Verify: `import { something } from "@{{PROJECT}}/db"` resolves without errors
- [ ] Full monorepo verification: `pnpm dev` starts, `pnpm typecheck` passes, `pnpm build` succeeds
  - Verify: all three commands exit cleanly

### Counts After Step 0.1
- Pages: 1 (+1: home/index)
- API procedures: 0
- Tests: 0/0
- Components: 0
- DB tables: 0
- Build: pass

---

## Step 0.2: Anti-Context-Rot Files (11 tasks)

These files prevent AI context loss between sessions. They are not documentation — they are operational state files that get updated every session.

- [ ] Create `CLAUDE.md` from `05-dev-infrastructure/CLAUDE-MD.template.md`
  - Fill in: project name, tech stack, folder structure, conventions, key commands
  - Verify: file exists, has >40 lines, no `{{PLACEHOLDER}}` tokens remaining
- [ ] Create `STATUS.md` from `05-dev-infrastructure/STATUS.template.md`
  - Set Phase 0 as active, all counts to 0
  - Verify: file exists, shows Phase 0 as current
- [ ] Create `DEVLOG.md` with first entry: "Session 1: Phase 0 started"
  - Verify: file exists with dated entry
- [ ] Create `.claude/handoff.md` with initial state: "Phase 0 in progress, starting Step 0.1"
  - Verify: file exists, describes current state
- [ ] Create `.claude/commands/session-start.md`
  - Content: Read STATUS.md + handoff.md, run git status, run typecheck, summarize state
  - Verify: file exists in correct directory
- [ ] Create `.claude/commands/session-end.md`
  - Content: Update STATUS.md counts, update handoff.md with next steps, update DEVLOG.md, commit
  - Verify: file exists in correct directory
- [ ] Create `.claude/commands/verify.md`
  - Content: Run build + typecheck + test, check for TODO/FIXME, verify STATUS.md counts match reality
  - Verify: file exists in correct directory
- [ ] Create `.claude/commands/phase-check.md`
  - Content: Cross-reference phase tasks with STATUS.md, report completion percentage
  - Verify: file exists in correct directory
- [ ] Create remaining scaffold commands (8+ commands covering: schema, seed, router, validator, form, component, page, E2E, migration, feature-checklist)
  - Verify: at least 10 total command files exist in `.claude/commands/`
- [ ] Create `.claude/settings.json` with permission rules and any PostToolUse hooks
  - Verify: valid JSON, parseable
- [ ] Create `.env.example` with all required environment variables (no real values)
  - Verify: every env var referenced in code has an entry in `.env.example`

### Counts After Step 0.2
- Pages: 1 (+0)
- API procedures: 0 (+0)
- Tests: 0/0 (+0)
- Components: 0 (+0)
- DB tables: 0 (+0)
- Build: pass

---

## Step 0.3: Database Foundation (5 tasks)

- [ ] Configure {{ORM}} with connection pooling, SSL, and schema isolation (if shared DB)
  - Create `packages/db/src/client.ts` with connection config
  - Verify: `import { db } from "@{{PROJECT}}/db"` resolves; connection test query succeeds
- [ ] Create all schema files from `ARCHITECTURE/schema/`
  - One file per domain: `users.ts`, `trips.ts`, `drivers.ts`, etc.
  - Include all columns, types, constraints, indexes, relations from architecture docs
  - Verify: `pnpm typecheck` passes; all tables defined match architecture schema count
- [ ] Create enum definitions (status enums, role enums, type enums)
  - Verify: enums export correctly; used in schema files without type errors
- [ ] Run database migration and verify tables created
  - Verify: ORM studio or direct query shows all expected tables with correct columns
- [ ] Create modular seed script (`packages/db/src/seed/`) and run it
  - Seed files: one per domain entity, plus an `index.ts` orchestrator
  - Include realistic data (not "test1", "test2" — use real-sounding names, addresses, dates)
  - Verify: query each table; record counts match expected seed data

### Counts After Step 0.3
- Pages: 1 (+0)
- API procedures: 0 (+0)
- Tests: 0/0 (+0)
- Components: 0 (+0)
- DB tables: {{N}} (+{{N}}: {{TABLE_LIST}})
- Build: pass

---

## Step 0.4: Auth System (7 tasks)

- [ ] Configure {{AUTH_PROVIDER}} with database adapter, session strategy, and role support
  - Verify: auth config file exists; no type errors
- [ ] Define roles, permissions, and role hierarchy
  - Example: super_admin > admin > dispatcher > driver > billing_clerk
  - Verify: role enum matches architecture; permission checks compile
- [ ] Create auth middleware/proxy for route protection
  - Protected routes redirect to login; role-based access enforced
  - Verify: unauthenticated request to protected route returns 401 or redirects
- [ ] Build login page (`/login`)
  - Form: email + password, validation, error display, loading state
  - Verify: page renders; form validates; submits to auth endpoint
- [ ] Build register page (`/register`)
  - Form: name + email + password + confirm password, validation
  - Verify: page renders; form validates; new user appears in database
- [ ] Build forgot-password page (`/forgot-password`)
  - Form: email input, success message
  - Verify: page renders; form submits without error
- [ ] Test complete auth flow: register new user, logout, login, verify session, role-based redirect
  - Verify: manual walkthrough of all auth paths succeeds; session persists across page reloads

### Counts After Step 0.4
- Pages: 4 (+3: login, register, forgot-password)
- API procedures: 0 (+0, auth is handled by {{AUTH_PROVIDER}})
- Tests: 0/0 (+0)
- Components: 3 (+3: LoginForm, RegisterForm, ForgotPasswordForm)
- DB tables: {{N}} (+0)
- Build: pass

---

## Step 0.5: Base UI Library (6 tasks)

- [ ] Install {{COMPONENT_LIB}} and configure with project theme
  - Verify: component imports resolve; no version conflicts
- [ ] Apply design tokens from `ARCHITECTURE/design/`
  - Colors (primary, secondary, accent, neutral, semantic)
  - Typography (font family, sizes, weights, line heights)
  - Spacing (consistent scale)
  - Border radius, shadows, z-index scale
  - Verify: CSS variables or Tailwind config matches design token spec exactly
- [ ] Build `DashboardShell` layout with `Sidebar` + `Topbar`
  - Sidebar: navigation items from architecture screen catalog, collapsible
  - Topbar: breadcrumbs, user menu, notifications placeholder
  - Verify: shell renders on `/dashboard`; sidebar items are clickable; responsive collapse works
- [ ] Build error boundary pages: `404.tsx`, `error.tsx`, `loading.tsx`
  - Verify: navigating to `/nonexistent-route` shows 404; loading state renders spinner/skeleton
- [ ] Build `/design` showcase route displaying all design tokens, colors, typography, components
  - This is the visual ground truth — if a component looks wrong, compare it to `/design`
  - Verify: page renders all token categories; visually matches design spec
- [ ] Responsive verification at breakpoints: 375px, 768px, 1024px, 1440px
  - Verify: shell layout, sidebar, forms, and error pages render correctly at all breakpoints

### Counts After Step 0.5
- Pages: 8 (+4: dashboard, 404, error, design-showcase)
- API procedures: 0 (+0)
- Tests: 0/0 (+0)
- Components: 8 (+5: DashboardShell, Sidebar, Topbar, ErrorBoundary, DesignShowcase)
- DB tables: {{N}} (+0)
- Build: pass

---

## Step 0.6: Testing Setup (4 tasks)

- [ ] Configure unit test runner (Vitest or Jest) with path aliases, coverage thresholds
  - Verify: `pnpm test:unit` runs (even with 0 tests, runner starts and exits cleanly)
- [ ] Configure E2E test runner (Playwright or Cypress) with browser config, base URL, auth helpers
  - Verify: `pnpm test:e2e` runs (even with 0 tests, runner starts and exits cleanly)
- [ ] Write first unit test: validate a Zod schema or utility function
  - Example: test a date formatter, a status enum validator, or a currency formatter
  - Verify: `pnpm test:unit` shows 1 passing test
- [ ] Write first E2E test: login flow (navigate to `/login`, fill credentials, submit, verify redirect)
  - Verify: `pnpm test:e2e` shows 1 passing test

### Counts After Step 0.6
- Pages: 8 (+0)
- API procedures: 0 (+0)
- Tests: 2/2 passing (+2: 1 unit, 1 E2E)
- Components: 8 (+0)
- DB tables: {{N}} (+0)
- Build: pass

---

## Step 0.7: First Deploy (4 tasks)

- [ ] Deploy to {{DEPLOY_TARGET}} staging environment
  - Configure build command, output directory, framework preset
  - Verify: deployment completes without errors; URL is accessible
- [ ] Set all environment variables on {{DEPLOY_TARGET}}
  - DATABASE_URL, AUTH_SECRET, AUTH_URL, NEXT_PUBLIC_APP_URL, etc.
  - Verify: `env pull` shows all variables set; no placeholder values
- [ ] Run smoke test on staging URL
  - Load homepage, navigate to login, register a user, login, verify dashboard loads
  - Verify: all steps succeed on the deployed URL (not localhost)
- [ ] Confirm: auth works on production domain, database connects, all pages load without errors
  - Verify: no console errors; no 500s; session persists after page reload

### Counts After Step 0.7 (Phase 0 Complete)
- Pages: 8
- API procedures: 0
- Tests: 2/2 passing
- Components: 8
- DB tables: {{N}}
- Build: pass
- Deploy: staging live at {{URL}}

---

## Phase 0 Completion Checklist

Before starting Phase 1, verify ALL of the following:

- [ ] `pnpm dev` starts without errors
- [ ] `pnpm build` succeeds with zero errors and zero warnings
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm test` shows 2/2 tests passing
- [ ] Register, login, logout, forgot-password all work
- [ ] Role-based redirect works
- [ ] Dashboard shell renders with sidebar, topbar, breadcrumbs
- [ ] 404 page renders for unknown routes
- [ ] Design showcase page at `/design` renders all tokens
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Seed data in database (verified via query)
- [ ] Staging deployment live and functional
- [ ] CLAUDE.md is complete and accurate
- [ ] STATUS.md shows Phase 0 complete, all counts updated
- [ ] DEVLOG.md has at least 1 entry
- [ ] handoff.md describes "Phase 0 complete, start Phase 1"
- [ ] At least 10 custom commands in `.claude/commands/`
- [ ] `.env.example` lists all required environment variables
