# Lessons Learned

Hard-won lessons from building Delta TMS through three iterations (V1, V2, V3). Every item here cost real time to discover. Scan the category headers to find what is relevant to your stack.

---

## Version Verification

**AI training data versions go stale — always verify live.**
AI agents have training data cutoffs (often months behind). Any version number stated from memory is potentially wrong. The orchestrator enforces live verification in Step 1.5 using MCP tools (Context7, Firecrawl, WebSearch). Never skip this step, even if the agent is "confident" about versions.

**Distinguish stable from pre-release.**
npm `latest` tag or GitHub "latest release" may be an RC, beta, or canary. Always confirm the version is a stable release before locking it into CONFIG. Check the npm dist-tags or the project's official release page.

**Major version jumps need migration review.**
If the live version is a major bump from what you expected, search for the migration guide before proceeding. Breaking changes in frameworks (e.g., Next.js middleware.ts → proxy.ts) can invalidate architectural decisions and render lessons-learned entries obsolete.

---

## Auth Lessons

**Better Auth: required columns are non-negotiable.**
The `users` table must have `name` (text) and `image` (text, nullable) columns. The `accounts` table must have a `password` (text, nullable) column. The `sessions` table must have an `updatedAt` (timestamp) column. Missing any of these causes silent failures or cryptic type errors. Better Auth will not tell you what is missing — it just breaks.

**Better Auth: UUID generation config location.**
Use `advanced.database.generateId: "uuid"` in the auth config. Do NOT use `advanced.generateId` — that is a different setting that does not affect database IDs. If your PostgreSQL columns are UUID type, this is mandatory.

**Better Auth: use bcrypt explicitly.**
The default password hashing is scrypt. If your seed data uses bcrypt (which is more common), configure it explicitly via `emailAndPassword.password.hash` and `emailAndPassword.password.verify`. Mixing algorithms means seeded users cannot log in.

**Better Auth: inferAdditionalFields on client.**
If you add custom fields to the user (role, companyId, etc.), the client-side auth hooks will not know about them unless you use the `inferAdditionalFields` plugin from `better-auth/client/plugins`. Without this, `useSession()` returns a user object missing your custom fields with no type error.

**Better Auth: forgetPassword is not in client types.**
The `forgetPassword` method does not exist on the typed client. Use a direct `fetch` call to `/api/auth/forget-password` instead. This is a known gap in the Better Auth client typings.

**Better Auth: CORS and BETTER_AUTH_URL.**
If `BETTER_AUTH_URL` does not exactly match the domain your frontend is served from, auth requests fail with CORS errors. If your production domain is `app.example.com`, set `BETTER_AUTH_URL=https://app.example.com`. Do not test via the Vercel preview URL if your auth URL points to a custom domain.

**NextAuth / Auth.js alternative.**
If choosing NextAuth instead of Better Auth, the gotchas are different: callback URLs are tricky, the session strategy (JWT vs database) has performance implications, and the adapter pattern can cause silent failures with custom schemas. Document your choice rationale in the Architecture Decision Log so you never relitigate it.

---

## Database Lessons

**Drizzle: use `generate` not `push` with pgSchema.**
`drizzle-kit push` has bugs with pgSchema — it fails to properly qualify enum types in the generated SQL, causing migration failures. Always use `drizzle-kit generate` to produce SQL migration files, review them, and execute manually. This bug has been present for multiple Drizzle versions.

**Drizzle: enum string literals need `as const`.**
When inserting array data with enum values, TypeScript widens string literals to `string`, which breaks Drizzle's enum type checking (TS2769). Add `as const` to the array or to individual string values:
```typescript
// BAD: type widens to string[]
const statuses = ["ACTIVE", "PENDING"];
// GOOD: type stays as literal union
const statuses = ["ACTIVE", "PENDING"] as const;
```

**Supabase: postgres.js needs explicit `ssl: "require"`.**
Even if your connection URL contains `?sslmode=require`, the postgres.js driver ignores the URL parameter. You must pass `ssl: "require"` as an explicit option to the `postgres()` constructor. Without this, connections fail silently or intermittently.

**pgSchema isolates schemas in shared databases.**
If you share a database instance across multiple projects or versions (e.g., Supabase free tier), use `pgSchema("myapp")` to isolate your tables into a dedicated PostgreSQL schema. This prevents table name collisions and lets you iterate without touching other schemas.

**noUncheckedIndexedAccess requires `!` assertions.**
With `noUncheckedIndexedAccess: true` in tsconfig, every object property lookup via bracket notation returns `T | undefined`. This is safer but means you need `!` non-null assertions (or proper undefined checks) on lookups you know are valid. The alternative is turning off the flag, which is less safe.

**Money: always store as integer cents.**
Store monetary values as integers representing cents (e.g., `$15.50` = `1550`). Display as dollars in the UI with formatting. This avoids floating point precision errors that accumulate across invoice line items, tax calculations, and batch operations. Use a `formatCurrency(cents: number)` utility everywhere.

---

## Next.js Lessons

**Next.js 16: proxy.ts replaces middleware.ts.**
Next.js 16 introduced `proxy.ts` with a named `proxy` export instead of `middleware.ts` with a `middleware` export. If you are on Next.js 16+, using the old middleware pattern will silently not execute. Check your version and use the correct file.

**Turbopack: CSS source hint for tw-animate-css.**
When using Turbopack (default in Next.js 16), the `tw-animate-css` package needs a `source("../../node_modules")` hint in your CSS to resolve correctly. Without this hint, animation classes silently fail to apply.

**lucide-react: must be direct dependency in apps/web.**
In a pnpm monorepo with strict isolation, `lucide-react` must be listed as a direct dependency in `apps/web/package.json` even if it is already a dependency of `packages/ui`. Pnpm does not hoist transitive dependencies by default. If icons render as empty boxes or throw "module not found," this is why.

**shadcn monorepo: components.json in two places.**
In a monorepo with `packages/ui` and `apps/web`, you need `components.json` in both locations. The one in `packages/ui` tells the shadcn CLI where to install components. The one in `apps/web` tells it how to resolve imports. Missing either causes the `npx shadcn add` command to fail or install to the wrong location.

---

## tRPC Lessons

**Error codes: use semantic codes, never expose raw DB errors.**
Use `NOT_FOUND`, `FORBIDDEN`, `BAD_REQUEST`, `UNAUTHORIZED`, `CONFLICT`, `INTERNAL_SERVER_ERROR`. Never let a raw database error (constraint violation, connection timeout) propagate to the client. Catch DB errors and map them to tRPC error codes with user-friendly messages.

**Context: create from request headers.**
The tRPC context should be created from the incoming request headers. Extract the auth session in the context factory, not inside individual procedures. This way, `protectedProcedure` and `adminProcedure` middleware can check `ctx.session` without re-fetching it.

**Procedure tiers: public, protected, role-specific.**
Define procedure tiers as middleware:
- `publicProcedure` — no auth required.
- `protectedProcedure` — any authenticated user.
- `dispatcherProcedure`, `adminProcedure`, `superAdminProcedure` — role level >= threshold.
This is cleaner than checking roles inside every procedure body.

**Zod error formatting: flatten to zodError.**
Use a custom error formatter that flattens Zod validation errors and attaches them to `shape.data.zodError`. This gives the frontend a consistent shape to display field-level errors without parsing nested Zod issues.

---

## Deployment Lessons

**Vercel: deploy from repo root, not monorepo subdir.**
The `vercel` CLI should be run from the repository root. Set the Root Directory on the Vercel dashboard (or in `vercel.json`) to point at your monorepo app directory. Running `vercel` from inside the subdir causes path resolution failures.

**Vercel: framework detection needs next as devDep.**
Vercel auto-detects your framework from `package.json`. In a monorepo, if `next` is only a dependency of `apps/web` but not the root `package.json`, Vercel may fail to detect the framework. Add `next` as a `devDependency` in the root `package.json` to fix this.

**Vercel: buildCommand with pnpm --filter.**
In a monorepo, configure the Vercel build command as `pnpm --filter @yourapp/web build` (or whatever your app package name is). This ensures only the relevant package and its dependencies are built, not the entire monorepo.

**Windows: echo adds trailing newlines.**
On Windows, piping values with `echo` adds a trailing `\n` or `\r\n`. This corrupts environment variables. Use `node -e "process.stdout.write('value')"` to pipe clean values to commands like `vercel env add`.

**Vercel env vars: verify with `vercel env pull`.**
After setting environment variables via the Vercel CLI or dashboard, always verify them with `vercel env pull .env.local` and inspect the file. Trailing whitespace or newlines in env vars cause subtle auth failures (e.g., Better Auth secret mismatch).

---

## TypeScript Lessons

**noUncheckedIndexedAccess: safer but more assertions.**
Enabling `noUncheckedIndexedAccess` in tsconfig makes bracket-notation lookups return `T | undefined`, which catches real bugs. The tradeoff is needing `!` non-null assertions on lookups where you know the key exists. Worth it for production code; decide early so the pattern is consistent.

**Enum string literals: `as const` prevents type widening.**
TypeScript widens `["ACTIVE", "PENDING"]` to `string[]`. With Drizzle, Zod, or any library that expects literal union types, this causes TS2769 errors. Always use `as const` on arrays of enum values. This is easy to forget and hard to debug because the error message does not mention type widening.

**moduleResolution: "bundler" for Turbopack.**
Next.js with Turbopack requires `moduleResolution: "bundler"` in tsconfig. The older `"node"` or `"node16"` settings cause module resolution failures for packages that use `exports` field in `package.json`.

**Package resolution: `"main": "./src/index.ts"` for dev.**
In a monorepo, point each package's `main` field at the TypeScript source (`./src/index.ts`), not a built output. This eliminates the need for a build step during development — Turbopack/esbuild compiles everything on the fly. Only add a build step when you need to publish the package externally.

---

## Testing Lessons

**Vitest: per-package config, no root config needed.**
In a monorepo, create `vitest.config.ts` in each package that has tests. A root-level Vitest workspace config (`vitest.workspace.ts`) orchestrates them. Do not try to use a single root config — path resolution breaks for package-local imports.

**Playwright: webServer.cwd must point to monorepo root.**
In a monorepo where Playwright lives in `apps/web/`, the `webServer.cwd` in `playwright.config.ts` must point two levels up to the monorepo root (where `pnpm dev` runs). If the cwd is wrong, Playwright starts the dev server in the wrong directory and all tests fail to load.

**E2E: never use waitForTimeout.**
Using `page.waitForTimeout(1000)` in Playwright tests creates flaky tests. Always wait for a specific condition: `waitForSelector`, `waitForURL`, `waitForResponse`, or `expect(locator).toBeVisible()`. Hard-coded waits pass locally and fail in CI.

**E2E: use accessible selectors.**
Prefer `getByRole`, `getByLabel`, `getByText`, and `getByTestId` over CSS selectors. Accessible selectors make tests more resilient to UI changes and double as accessibility verification. If a button cannot be found by its role, it probably has an accessibility problem.

**Coverage targets: >80% statements, >88% functions.**
These targets are achievable and meaningful. Below 80% usually means critical paths are untested. Above 95% usually means you are testing implementation details. The function coverage target is higher because untested functions are more likely to contain bugs than untested branches within tested functions.

---

## Windows-Specific Lessons

**MCP servers: use "command": "npx" directly.**
On Windows, MCP server configurations should use `"command": "npx"` in the config, not `"command": "cmd"` with `"/c", "npx"` as args. The `cmd /c` wrapper adds unnecessary complexity and sometimes fails to pass arguments correctly.

**MCP config: `~/.claude.json` not `~/.claude/settings.json`.**
MCP server configuration goes in `~/.claude.json` (at the user home root). The file `~/.claude/settings.json` is for permissions and enabled plugins only. Putting MCP servers in the wrong file means they silently do not load.

**settings.json vs .claude.json.**
`~/.claude/settings.json` = permissions (allow/deny lists) + enabled plugins. `~/.claude.json` = MCP server definitions + metadata. Do not mix them. If your MCP servers are not appearing after config, check which file you edited.

**After MCP config edit: restart Claude Code.**
Changes to `~/.claude.json` are not hot-reloaded. You must fully restart Claude Code (close and reopen in VS Code) for new MCP server configurations to take effect.

**Write tool requires Read first.**
Claude Code's Write tool requires you to Read a file before editing it, even if the file content was previously visible in the conversation. If context was compacted (long conversation), the prior Read is lost. Always Read again before editing if there is any doubt.

---

## Design Lessons

**Default shadcn = "template look."**
Using shadcn/ui components without customization makes your app look like every other shadcn app. Before building any page, customize at minimum: Button (shadows, active states, transitions), Card (hover effects, border color), and Input (focus ring, hover state). These three components appear on every page.

**Design BEFORE code.**
Run the design research and generation pipeline before building any screen. If you build first and design second, you end up with a working page that looks generic, and refactoring UI is slower than building it right the first time.

**Design-verify after EVERY UI change.**
Visual drift accumulates silently. A hardcoded color here, a missing hover state there, a button without an aria-label somewhere else. Running a design verification checklist after every UI change catches these before they compound into a "why does this look bad" moment.

**The demo 2/10 story.**
Delta TMS V3 had every feature working perfectly, but the first demo scored 2/10 because: the Maps API was not configured (blank map components), every page used pure default shadcn styling (template look), and half the features were functional but visually unfinished. Lesson: features that work but look bad are perceived as broken. Polish is not optional.

**Anti-slop rules.**
- Never use gradient backgrounds on sections or headers.
- Never make all stat cards the same size — vary by importance.
- Never use blue-purple gradients as a color scheme (AI default).
- Never use default shadcn components without customization.
- Always vary visual weight based on content importance.
- Always prefer curated component libraries over plain defaults when available.
- If something looks like it was generated by AI, it probably needs more work.

---

## AI Workflow Lessons

**Write tool requires Read first (even in compacted context).**
This is worth repeating because it causes the most friction. If a conversation is long enough that Claude's context compacts, previous file reads are lost. The Write tool will refuse to edit a file it has not read in the current context window. Always Read before Edit, even if you "just read it."

**Context compacts: state files prevent rot.**
In long sessions, Claude's context window compacts older messages. Without state files, Claude forgets what was already built, makes contradictory decisions, or re-implements existing features. The four state files (STATUS.md, handoff.md, DEVLOG.md, CLAUDE.md) survive compaction because they are re-read at session start.

**One feature at a time, fully complete.**
Do not start Feature B until Feature A has validators, API, components, pages, and tests all passing. Partial features accumulate into an untestable, unshippable mess. The overhead of finishing one thing before starting the next is zero — the overhead of juggling three half-done features is enormous.

**Parallel agents: only for truly independent tasks.**
Claude Code can dispatch parallel agents for independent work (e.g., writing docs while tests run). But if tasks share state (same files, same database, same component), parallel execution causes merge conflicts and race conditions. When in doubt, sequential is safer.

**/verify before marking done: evidence before assertions.**
Never mark a task as "done" based on what you think the state is. Run the verification command (`/verify`) which executes typecheck + lint + test + build. If any step fails, the task is not done. This catches the "it works on my machine" problem before it becomes "it is broken in production."

**Counts-after-each-step prevents "90% done for 3 months."**
After completing any task, update the counts in STATUS.md: pages built, API procedures, tests passing, components, database tables. If the counts are not going up, work is not actually getting done. If counts go up but test count does not, quality is declining. Numbers do not lie.

**181 docs before code = zero architectural pivots = zero rework.**
This is the central lesson. Writing specifications for every table, every API route, every screen, every feature before writing any code means you discover contradictions, missing requirements, and bad decisions on paper instead of in code. Paper is cheap to change. Code is expensive to change.

---

## Project Management Lessons

**Documentation-first: write ALL specs before any code.**
Not "some docs" or "a rough outline" — all of them. Every database table documented. Every API endpoint specified. Every screen inventoried. Every feature described with acceptance criteria. This feels slow at the start and saves enormous time at the end.

**Phase gates: mandatory review before advancing.**
Do not advance from Phase N to Phase N+1 without verifying that all Phase N tasks are complete, all tests pass, and the build succeeds. Carrying incomplete work forward compounds into a debt spiral where later phases are built on an unstable foundation.

**Seed data: create early, test with real-looking data.**
Write your seed script in Phase 0 and populate the database with realistic data (real names, real addresses, plausible numbers). Testing with "Test User 1" and "123 Test St" hides UI problems that surface with real data (long names overflow, addresses do not fit, numbers are unrealistic).

**The anti-context-rot system.**
Four files, updated every session:
- **STATUS.md** — Machine-readable: current phase, task counts, checkbox progress.
- **handoff.md** — Next action: what was done, what to do next, key decisions.
- **DEVLOG.md** — Append-only history: searchable record of every session.
- **CLAUDE.md** — Compact context: architecture, rules, workflow in under 100 lines.
Together, these mean any new session (or any new AI context) can pick up exactly where the last one left off.

**Architecture Decision Log: prevents relitigating old decisions.**
Record every significant technical decision (tool choice, pattern choice, tradeoff) in a table with date, decision, and rationale. When someone (including your future self, or a new Claude session) asks "why did we use X instead of Y?" — the answer is in the log. Without this, old decisions get revisited and reversed, wasting time.

---

## React Native Lessons

**Expo managed vs bare: know the boundary early.**
Expo managed workflow cannot use native modules outside the Expo SDK. If you need Bluetooth, NFC, or custom camera processing, you need a development build (`npx expo prebuild`) or bare workflow. Decide this in architecture, not during sprint 3.

**Metro monorepo resolution requires explicit config.**
In a pnpm monorepo, Metro does not find packages outside `apps/mobile/`. Configure `watchFolders` and `nodeModulesPaths` in `metro.config.js` pointing to the monorepo root. Without this, all shared package imports fail at build time.

**pnpm hoisting breaks Metro.**
pnpm's content-addressable store with symlinks confuses Metro. Set `node-linker=hoisted` in `.npmrc` for the mobile workspace, or configure Metro's symlink resolution. This is the #1 monorepo setup issue.

**EAS Build: `.easignore` is not optional in monorepos.**
EAS uploads your entire repo by default. Without `.easignore`, builds upload web code, docs, and dev_docs — causing slow uploads or upload failures. Exclude everything except the mobile app and shared packages.

**Expo Router deep links need scheme config.**
Deep links do not work without `scheme` in `app.json`. Also configure the Expo Router `origin` for universal links. Missing either causes links to open the app but navigate to the wrong screen.

**Reanimated worklets cannot access JS closures.**
Animation worklets run on a separate thread. React state, hooks, and closures are not accessible. Use `useSharedValue` for all values read in `useAnimatedStyle`. This is the most common Reanimated bug.

---

## Flutter Lessons

**`late` variables are runtime bombs.**
`late` bypasses compile-time null safety. If accessed before initialization, it crashes at runtime with `LateInitializationError`. Prefer nullable types with explicit checks. Use `late` only for `initState` guarantees.

**Platform channel names must match across 3 files.**
The MethodChannel name string must be identical in Dart, Swift, and Kotlin. There is no compile-time check. Use a shared constant or code generation. Triple-check on every change.

**Widget keys are required for stateful list items.**
Without `ValueKey` on stateful widgets in `ListView`, Flutter reuses state incorrectly when items change. Expanded states, checkboxes, and animations get assigned to wrong items. Always use `ValueKey(item.id)`.

**CocoaPods: nuke and reinstall when stuck.**
iOS pod conflicts are the most common Flutter build issue. `cd ios && rm -rf Pods Podfile.lock && pod install --repo-update` fixes 90% of cases. Set a minimum iOS version that satisfies all plugins.

---

## Mobile Deployment Lessons

**First app store submission takes 1-2 weeks.**
Plan for a 1-week buffer. Apple first review is 24-48 hours (plus potential rejections). Google Play first review is 3-7 days. Both stores allow you to set a future release date, so submit early.

**Apple rejection 4.3 (Spam) hits template-looking apps.**
If your app uses default template UI without customization, Apple may reject it as spam. Customize colors, components, and branding before submission. This parallels the "anti-slop" lesson from web design.

**Android keystore loss is unrecoverable.**
If you lose your Android signing keystore, you cannot update the app. Always enable Play App Signing (keeps the key on Google's servers). Back up the upload key in a password manager.

**TestFlight builds expire after 90 days.**
External testers lose access after 90 days. Automate TestFlight uploads in CI/CD to ensure fresh builds are always available. Internal testers are not affected.

**iOS provisioning profiles have a 100-device limit.**
Ad Hoc profiles only support 100 registered devices. Use TestFlight (10,000 testers, no device limit) for beta distribution. Reserve Ad Hoc device slots for development devices.

---

## Autonomous Build Readiness

Lessons from the "Code Red" EMS/ambulance dispatch project — a production audit that revealed a 2.5x gap between Kit planning output (~270 files) and what is needed for fully autonomous AI execution (~670 files). Each lesson below cost real implementation hours to discover.

**Error consistency requires a contract, not conventions.**
Telling agents to "use consistent error codes" produces 6 different formats across 6 services. The only thing that works is a machine-readable contract: `SERVICE_TYPE_SPECIFIC` format enforced by the CROSS-REFERENCE-VALIDATOR, with the error catalog as ground truth. Without this, every service invents its own error codes, the frontend has no reliable pattern to handle them, and debugging becomes a guessing game. Enforce error code format in Step 12 of every service spec and validate it automatically.

**Business rules that reference external standards need reference tables.**
When a service spec says "follow NEMSIS 3.5.0 for patient data" or "use CMS fee schedules for billing," an AI agent cannot look those up. It halluccinates plausible-sounding values. The fix is a domain reference table: every applicable regulatory field, its valid values, its constraints, and which DB column it maps to. Without these tables, agents produce specs that look correct but fail at integration time. Generate reference tables (using `03-documentation/spec-layer/catalogs/business-rule-reference.template.md`) for every service that touches external standards before writing any code.

**Happy-path specs produce brittle integrations.**
A spec that only documents what happens when everything works is a liability. External APIs time out. Networks partition. Tokens expire. Circuit breakers open. An agent implementing from a happy-path spec will not know what to do when any of these happen — it will either crash, hang, or swallow errors silently. Every integration needs a failure spec: timeouts in milliseconds, retry count with backoff type, circuit breaker threshold, fallback behavior, and the exact user-facing message for each failure mode. Generate these using `32-integrations/integration-failure-spec.template.md` for every P0 and P1 integration.

**"4 UI states" as a rule is not enough — you need the matrix and the pattern code.**
A rule that says "implement loading, error, empty, and populated states" is too abstract. Agents implement each one differently across screens: sometimes a spinner, sometimes a skeleton, sometimes a full-page takeover. The result is an inconsistent UX that feels amateur. The fix is a UI state matrix: every screen listed by row, every standard state by column (including offline, session-expired, bulk-selecting, confirming-delete), and the specific pattern code for each cell (skeleton-6-rows, inline-banner-with-retry, illustration-cta). The matrix also enforces that no screen ships without all 4 fundamental states. Generate it using `10-generators/UI-STATE-MATRIX-GENERATOR.md` before any frontend tasks are written.

**Prose layout descriptions produce random architectures.**
"The dispatch console has a sidebar, a main panel, and a detail view" is useless to an agent. It will implement a sidebar that's 100px wide when it needs to be 280px, a main panel without virtualization when it has 500+ rows, a detail view that's a modal when it should be a slide-out. Component contracts with explicit TypeScript interfaces, ASCII layout diagrams with pixel dimensions, and responsive behavior tables per breakpoint are the minimum needed for reproducible implementation. Generate contracts for the 10-15 most complex components using `03-documentation/spec-layer/contracts/component-contract.template.md`.

**Without seed data, every session creates different test data.**
When agents seed their own test data, the values are random and inconsistent across sessions. Foreign key relationships break. Edge cases are not covered. Status distribution is unrealistic (all records in "active" state, no expired or cancelled records). The fix is tiered JSON seed files committed to the repo: dev (5-10 records, fast to reset), staging (20-50 records, realistic distribution), and demo (curated scenarios, good for demos). Run `10-generators/UI-STATE-MATRIX-GENERATOR.md` seed data generation, then keep the JSON files under version control. Never let agents generate their own test data.

**Agents skip specs they don't know exist.**
A backend agent writing a router will not read the error response spec, the pagination conventions, the soft-delete spec, or the auth patterns — unless the task file explicitly tells it to. This produces routers that paginate differently from the spec, use wrong error formats, forget to filter deleted records, and miss tenant isolation. The fix is a mandatory reading list prepended to every task's Context Header. The universal list (4 docs) + the type-specific list (4-6 more docs) + task-specific paths produces a task file that an agent cannot execute without absorbing the relevant constraints. See `04-phase-planning/pre-task-reading-lists.md`.

**Steps 13-28 become shallow when batched.**
Steps 13-28 cover design systems, security, integrations, observability, user docs, capabilities, and onboarding. These are the areas that differentiate production-grade systems from demo systems. When batched (covering multiple steps in one pass), agents produce thin outputs: design tokens without spacing scales, security sections without threat models, observability without alert thresholds. Rule 20 in CLAUDE.md enforces a maximum of 3 adjacent steps per agent call. Each step type also now has a required section list in `10-generators/DEPTH-REQUIREMENTS.md` so output can be mechanically verified for completeness.

**Self-assessed depth scores are always optimistic.**
An agent that writes a spec will rate it 9/10. The same agent evaluated by a different agent rates the same spec 6/10. The solution is mechanical counting: word count, section presence, red flag phrase count, error code count, endpoint count, state count, cross-reference density, business rule specificity. These are objective and cannot be gamed. The `10-generators/MECHANICAL-DEPTH-CHECKER.md` runs these 8 checks and flags discrepancies between agent self-scores and mechanical measurements. Any file where the agent scored ≥8/10 but mechanical checks find a FAIL requires human review before the step is marked complete.

**Lint errors in forked codebases compound.**
When starting from an existing codebase (enhance or repurpose paths), existing lint errors are inherited. An agent that runs in this context generates new code that triggers the existing errors plus new ones, making triage impossible. The first task in any session on a forked codebase must be: run lint, count errors, fix all of them before touching anything else. Never add to a dirty codebase. The enhance and repurpose paths now enforce a clean lint baseline at Step 37.1 and 38.1 before any work begins.

---

## Quick Reference Index

| If you are using... | Read these sections |
|---------------------|-------------------|
| Better Auth | Auth Lessons (all 6 items) |
| NextAuth / Auth.js | Auth Lessons (last item) |
| Drizzle ORM | Database Lessons (first 2 items) |
| Supabase | Database Lessons (items 3-4) |
| Next.js 16+ | Next.js Lessons (all 4 items) |
| Next.js 15 or earlier | Next.js Lessons (items 2-4, skip proxy.ts) |
| tRPC | tRPC Lessons (all 4 items) |
| Vercel deployment | Deployment Lessons (all 5 items) |
| Windows development | Windows-Specific (all 5 items) |
| shadcn/ui | Design Lessons (first 2 items), Next.js Lessons (item 4) |
| Playwright testing | Testing Lessons (items 2-4) |
| Vitest | Testing Lessons (item 1) |
| React Native / Expo | React Native Lessons (all 6 items) |
| Flutter | Flutter Lessons (all 4 items) |
| Mobile app deployment | Mobile Deployment Lessons (all 5 items) |
| Building for AI execution | Autonomous Build Readiness (all 10 items) |
| Error code consistency | Autonomous Build Readiness (item 1), tRPC Lessons (item 1) |
| External API integrations | Autonomous Build Readiness (items 3, 7) |
| UI state completeness | Autonomous Build Readiness (item 4) |
| Component specifications | Autonomous Build Readiness (item 5) |
| Depth verification | Autonomous Build Readiness (items 8, 9) |
| Any project with Claude Code | AI Workflow Lessons (all 7 items), Project Management (all 5 items) |
