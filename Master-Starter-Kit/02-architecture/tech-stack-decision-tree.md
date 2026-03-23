# Tech Stack Decision Tree

> **VERSION NOTICE:** Version numbers in this document reflect the Delta TMS V3 production build (2025) and are NOT guaranteed current. All versions are verified against live data during **Step 1.5: Version Verification** in the orchestrator before being locked into the project CONFIG. Do not use the version numbers below without completing Step 1.5.

## How to Use This Document

Walk through each decision node sequentially. For each node:
1. Read the **Question** — it frames what you're deciding
2. Review the **Options** with their pros/cons
3. Check the **Recommendation** and its rationale
4. Read **When to Deviate** — if none of those conditions apply, go with the recommendation
5. Record your choice in `decisions-log.template.md`

Every recommendation is tagged with its production validation status. Options marked **"Proven in Delta TMS V3"** have been battle-tested in a production application with real data (1,300+ records, 80+ trips, 20+ users, 18 development phases).

---

## Node 1 — Project Structure

**Question:** How should the codebase be organized?

### Option A: Monorepo (Turborepo + pnpm) -- RECOMMENDED

**Description:** Single repository with multiple packages managed by Turborepo for build orchestration and pnpm for workspace dependency management.

```
my-project/
  apps/web/           # Next.js frontend
  packages/db/        # Database schema + migrations
  packages/api/       # Business logic + routers
  packages/auth/      # Authentication config
  packages/ui/        # Shared component library
  packages/validators/# Shared Zod schemas
  packages/types/     # Shared TypeScript types
  packages/services/  # External integrations
  tooling/            # Shared configs (biome, tsconfig, tailwind)
```

| Pros | Cons |
|------|------|
| Shared types across all packages — zero drift | Higher initial setup complexity (~30 min) |
| Single `pnpm install`, single lock file | Turborepo learning curve |
| Atomic commits across packages | CI builds entire repo (cacheable but still) |
| Each package has clear responsibility | Need to manage internal dependency versions |
| Easy to extract packages later | |

**Proven in Delta TMS V3** — 7 packages + 1 app, zero type drift across 320+ tasks.

### Option B: Monolith (Next.js Only)

**Description:** Single Next.js application with collocated concerns. All code lives under one `src/` directory.

```
my-project/
  src/
    app/          # Next.js routes
    components/   # All components
    lib/          # Utils, DB, auth
    server/       # API routes, actions
```

| Pros | Cons |
|------|------|
| Simplest setup — `npx create-next-app` | Everything coupled — hard to refactor later |
| No workspace configuration needed | Shared types require manual organization |
| Fastest time to first commit | Grows unwieldy past ~50 files |
| Great for learning projects | Can't extract packages for reuse |

### Option C: Microservices

**Description:** Multiple independently deployable services, each with its own repository and deployment pipeline.

| Pros | Cons |
|------|------|
| Independent scaling per service | Massive operational overhead |
| Team autonomy (each team owns a service) | Network latency between services |
| Technology diversity possible | Distributed transactions are hard |
| Failure isolation | Need service discovery, API gateway |

### Recommendation: **Monorepo (Turborepo + pnpm)**

For any project with 2+ user roles, multiple domains, or plans to scale, the monorepo pays for itself within the first week. The 30-minute setup cost prevents months of type drift and import chaos.

### When to Deviate
- **Choose Monolith** if: Solo developer, single-concern MVP, timeline under 3 months, learning project
- **Choose Microservices** if: 5+ engineering teams, services need independent scaling, regulatory requirement for isolation (e.g., PCI DSS)
- **Never start with microservices** for a greenfield startup project. You can always extract services from a monorepo later.

### Lesson Learned
> In Delta TMS, V1 was a monolith and V2 tried to be a better monolith. Both failed because shared concerns (types, validators, auth) couldn't be cleanly separated. V3's monorepo structure meant a schema change in `packages/db` automatically propagated types to `packages/api` and `apps/web` — zero manual syncing.

---

## Node 2 — Frontend Framework

**Question:** What framework handles the web frontend?

### Option A: Next.js (App Router) -- RECOMMENDED

**Description:** React meta-framework with file-based routing, server components, SSR/SSG, API routes, and first-class Vercel deployment.

| Pros | Cons |
|------|------|
| Server Components reduce client JS | App Router paradigm shift from Pages Router |
| Built-in API routes (Route Handlers) | Caching behavior can be surprising |
| File-based routing with layouts | Bundle size can grow without attention |
| Massive ecosystem and community | React Server Components have edge cases |
| Vercel deploys in seconds | |

**Proven in Delta TMS V3** — Next.js 16 + React 19.2, 30+ pages, SSR with tRPC.

### Option B: Remix

**Description:** Full-stack React framework focused on web standards, with progressive enhancement and nested routing.

| Pros | Cons |
|------|------|
| Excellent data loading (loaders/actions) | Smaller ecosystem than Next.js |
| Progressive enhancement by default | Less server component support |
| Deploy anywhere (not Vercel-locked) | Fewer component libraries integrated |
| Better error handling patterns | Documentation gaps for advanced patterns |

### Option C: SvelteKit

**Description:** Full-stack Svelte framework with file-based routing, SSR/SSG, and compile-time optimizations.

| Pros | Cons |
|------|------|
| Smaller bundle sizes (compiled) | Smaller ecosystem, fewer components |
| Simpler reactivity model | Fewer developers available for hiring |
| Less boilerplate than React | TypeScript support improving but not as mature |
| Fast compile times | Library compatibility can be an issue |

### Option D: Astro

**Description:** Content-focused framework with island architecture — ship zero JS by default, hydrate interactively where needed.

| Pros | Cons |
|------|------|
| Near-zero JS for content pages | Not designed for highly interactive apps |
| Use any UI framework per island | State sharing between islands is hard |
| Excellent content collections | Limited server interaction patterns |
| Best for blogs, docs, marketing | Not a fit for dashboards or data-heavy apps |

### Recommendation: **Next.js (App Router)**

The ecosystem advantage is overwhelming: shadcn/ui, tRPC adapters, Better Auth integration, Vercel deployment, and 95% of tutorials assume Next.js. Unless you have a specific reason not to, Next.js is the safe bet.

### When to Deviate
- **Choose Remix** if: You need deploy-anywhere flexibility, your team prefers web standards patterns, or you want progressive enhancement
- **Choose SvelteKit** if: Your team knows Svelte, you're building a performance-critical consumer app, or you want simpler code
- **Choose Astro** if: Content-heavy site (blog, docs, marketing), minimal interactivity needed

### Lesson Learned
> Next.js 16 changed from `middleware.ts` to `proxy.ts` with a named `proxy` export (not `middleware`). Always check the version-specific migration guide when upgrading. API behavior can change between major versions in ways that break auth flows silently.

---

## Node 3 — API Layer

**Question:** How does the frontend communicate with the backend?

### Option A: tRPC -- RECOMMENDED

**Description:** End-to-end typesafe API layer. Define procedures on the server, call them on the client with full TypeScript autocompletion.

| Pros | Cons |
|------|------|
| Zero API schema duplication | TypeScript-only (no other clients) |
| Full autocompletion on client | Not suitable for public APIs |
| Automatic input validation with Zod | Tightly couples client + server |
| Subscriptions for real-time | Learning curve for middleware patterns |
| v11 has excellent DX | |

**Proven in Delta TMS V3** — tRPC v11, 15+ routers, 100+ procedures, zero type bugs.

### Option B: REST (Next.js Route Handlers)

**Description:** Standard REST endpoints using Next.js Route Handlers (`app/api/*/route.ts`).

| Pros | Cons |
|------|------|
| Universal — any client can consume | Manual type duplication (request/response) |
| Well-understood patterns | No automatic validation |
| Easy to document (OpenAPI/Swagger) | More boilerplate per endpoint |
| Works with mobile apps, external clients | Easy to forget input sanitization |

### Option C: GraphQL (Apollo / Pothos)

**Description:** Query language for APIs with a strongly-typed schema, allowing clients to request exactly the data they need.

| Pros | Cons |
|------|------|
| Flexible queries (no over/under-fetching) | Significant complexity overhead |
| Strong schema typing | N+1 query problem requires DataLoader |
| Great for multiple client types | Caching is harder than REST |
| Introspection and tooling | Over-engineering for most projects |

### Recommendation: **tRPC**

If your entire stack is TypeScript and you don't need a public API, tRPC eliminates an entire class of bugs (API contract mismatches) and reduces boilerplate by ~60% compared to REST.

### When to Deviate
- **Choose REST** if: You need a public API, mobile clients in non-TS languages, or third-party integrations consume your API
- **Choose GraphQL** if: Multiple client types with very different data needs, complex data relationships with deep nesting
- **Hybrid approach** is valid: tRPC for internal app, REST route handlers for webhooks and public endpoints

### Lesson Learned
> In Delta TMS V3, tRPC procedures share Zod schemas from `packages/validators`. This means a form's validation schema is the same object as the API's input validation — change it once, both sides update. This eliminated every "form submits but API rejects" bug.

---

## Node 4 — ORM / Database Access

**Question:** How does the application interact with the database?

### Option A: Drizzle ORM -- RECOMMENDED

**Description:** Lightweight TypeScript ORM with SQL-like query builder, excellent type inference, and split schema file support.

| Pros | Cons |
|------|------|
| Thin abstraction — you see the SQL | Younger ecosystem than Prisma |
| Excellent TypeScript inference | Fewer guides/tutorials available |
| Split schema files per domain | Migration tooling less polished |
| No heavy runtime (unlike Prisma Client) | Less "magic" — more manual setup |
| Supports pgSchema for DB isolation | |

**Proven in Delta TMS V3** — Drizzle ORM with pgSchema("v3"), 15+ tables, split schema files, seeded with 1,300+ records.

### Option B: Prisma

**Description:** Mature ORM with its own schema language (`.prisma`), generated client, and comprehensive migration system.

| Pros | Cons |
|------|------|
| Excellent schema DSL (readable) | Heavy generated client (~15MB) |
| Mature migration system | Schema file is a single file (gets huge) |
| Great documentation | Runtime overhead vs Drizzle |
| Prisma Studio for data browsing | Can't split schema across domains easily |
| Large community | Version upgrades can break migrations |

### Option C: Kysely

**Description:** Type-safe SQL query builder with zero runtime overhead. You write SQL, Kysely types it.

| Pros | Cons |
|------|------|
| Zero abstraction — it IS SQL | No migration system built-in |
| Perfect type inference | Need to manage schema types manually |
| Tiny bundle size | More verbose for simple CRUD |
| Great for complex queries | Less ecosystem tooling |

### Option D: Raw SQL + pg

**Description:** Direct SQL queries using the `pg` or `postgres.js` driver. Maximum control, zero abstraction.

| Pros | Cons |
|------|------|
| Maximum performance | Zero type safety |
| No dependency on ORM updates | Manual everything (migrations, types) |
| Full SQL power | SQL injection risk without parameterization |
| Great for performance-critical paths | Massive boilerplate for CRUD |

### Recommendation: **Drizzle ORM**

Drizzle hits the sweet spot: type-safe enough to prevent bugs, thin enough that you understand the SQL, and flexible enough to split schemas per domain. The pgSchema feature is invaluable for shared databases.

### When to Deviate
- **Choose Prisma** if: Team already knows Prisma, you want the best migration system, or you need Prisma Studio for non-technical data browsing
- **Choose Kysely** if: Performance-critical app where ORM overhead matters, or your team is very comfortable writing SQL
- **Choose Raw SQL** if: Extremely performance-sensitive microservice, or you're wrapping an existing legacy database

### Lesson Learned
> Drizzle's `drizzle-kit generate` is more reliable than `drizzle-kit push` when using `pgSchema`. The push command has enum qualification bugs where it generates `"v3"."status_enum"` incorrectly. Always use generate + migrate for production. Also: `postgres.js` on Supabase pooler requires explicit `ssl: "require"` — the URL's `sslmode` parameter alone is insufficient.

---

## Node 5 — Database

**Question:** Which database and hosting provider?

### Option A: PostgreSQL (Supabase) -- RECOMMENDED

**Description:** PostgreSQL hosted on Supabase with connection pooling, row-level security, and a generous free tier.

| Pros | Cons |
|------|------|
| Full PostgreSQL feature set | Free tier pauses after 1 week inactivity |
| JSONB for flexible data | Pooler connection management can be tricky |
| Generous free tier (500MB) | Supabase-specific features can create lock-in |
| Built-in auth (optional) | SSL configuration gotchas |
| Real-time subscriptions available | |

**Proven in Delta TMS V3** — Supabase PostgreSQL, pgSchema isolation for V1/V2/V3 coexistence, 1,300+ records.

### Option B: PostgreSQL (Neon)

| Pros | Cons |
|------|------|
| True serverless (scales to zero) | Newer, less battle-tested |
| Database branching for dev/staging | Cold start latency |
| Generous free tier | Smaller community than Supabase |
| Auto-scaling | |

### Option C: MySQL (PlanetScale)

| Pros | Cons |
|------|------|
| Horizontal scaling (Vitess) | No foreign keys (by default) |
| Database branching | Less powerful than PostgreSQL |
| Non-blocking schema changes | MySQL-specific SQL dialect |
| Great for read-heavy workloads | Drizzle/Prisma support is good but PG-first |

### Option D: SQLite (Turso)

| Pros | Cons |
|------|------|
| Edge-first, ultra-low latency | Limited concurrent writes |
| Embedded database (no server) | Not suitable for high-write applications |
| LibSQL extends SQLite | Smaller ecosystem for production use |
| Free tier is generous | No JSONB, limited data types |

### Recommendation: **PostgreSQL (Supabase)**

PostgreSQL is the most capable relational database, and Supabase provides the best free-tier developer experience. The combination of JSONB, full-text search, window functions, and CTEs handles any query pattern you'll encounter.

### When to Deviate
- **Choose Neon** if: You need serverless scaling (pay-per-query), or database branching is critical for your workflow
- **Choose PlanetScale** if: You need horizontal read scaling, your data model doesn't need foreign keys
- **Choose Turso** if: Edge-first app, read-heavy with minimal writes, or you want embedded database simplicity

### Lesson Learned
> When connecting to Supabase's connection pooler from `postgres.js`, you MUST explicitly set `ssl: "require"` in the connection options. The `?sslmode=require` parameter in the connection URL is not sufficient — the driver ignores it. This caused silent connection failures in Delta TMS V3 until it was caught.

---

## Node 6 — Authentication

**Question:** How are users authenticated and sessions managed?

### Option A: Better Auth -- RECOMMENDED

**Description:** Self-hosted, flexible authentication library with email/password, OAuth, magic links, and session management.

| Pros | Cons |
|------|------|
| Self-hosted (full control) | Younger library, smaller community |
| Simple API, clean DX | Documentation has gaps |
| Flexible — any DB, any framework | Some features need manual implementation |
| No vendor lock-in | Fewer OAuth provider presets |
| Session-based (not JWT by default) | |

**Proven in Delta TMS V3** — Better Auth with email/password, role-based access, bcrypt hashing, session management.

### Option B: NextAuth (Auth.js)

| Pros | Cons |
|------|------|
| Most popular for Next.js | v5 migration was painful |
| Many OAuth providers built-in | Session handling has edge cases |
| Large community, many guides | TypeScript types can be incomplete |
| Database adapters available | Configuration can be confusing |

### Option C: Clerk

| Pros | Cons |
|------|------|
| Fully managed — zero auth code | Monthly cost at scale ($25+/mo) |
| Beautiful pre-built UI components | Vendor lock-in |
| User management dashboard | Can't customize auth flow deeply |
| Multi-factor auth built-in | Data lives on their servers |

### Option D: Lucia

| Pros | Cons |
|------|------|
| Lightweight, minimal abstraction | Being deprecated (author recommends Better Auth) |
| Great for learning auth internals | No future updates |
| Small bundle size | Migration to Better Auth needed eventually |

### Option E: Custom

| Pros | Cons |
|------|------|
| Full control over everything | Security expertise required |
| No dependencies | Easy to introduce vulnerabilities |
| Exactly what you need | Session management is hard to get right |

### Recommendation: **Better Auth**

Better Auth provides the right balance of control and convenience. You own your data, can customize every flow, and don't pay per-user fees. The gotchas are well-documented (see Lesson Learned).

### When to Deviate
- **Choose NextAuth** if: You need many OAuth providers quickly, or your team is already experienced with it
- **Choose Clerk** if: You want zero auth code, budget allows $25+/mo, and you don't need custom auth flows
- **Choose Custom** only if: Regulatory requirements demand it, or you're building auth as the product itself

### Lesson Learned
> Better Auth has several non-obvious requirements:
> - User table MUST have `name` and `image` columns
> - Account table MUST have `password` column (passwords stored in `accounts.password`, NOT `users.passwordHash`)
> - Session table MUST have `updatedAt` column
> - For UUID primary keys: use `advanced.database.generateId: "uuid"` (NOT `advanced.generateId`)
> - Default hashing is scrypt; configure bcrypt explicitly via `emailAndPassword.password.hash` and `.verify`
> - `forgetPassword` is not in client types — use direct fetch to `/api/auth/forget-password`
> - Client custom fields need `inferAdditionalFields` plugin from `better-auth/client/plugins`

---

## Node 7 — Styling

**Question:** How is the UI styled?

### Option A: Tailwind CSS + shadcn/ui -- RECOMMENDED

**Description:** Utility-first CSS with a copy-paste component library that you own and customize.

| Pros | Cons |
|------|------|
| Utility classes = fast iteration | HTML can look verbose |
| shadcn/ui components are owned code | Need Tailwind knowledge |
| Design tokens via CSS variables | Initial setup of design system takes time |
| No runtime CSS overhead | Component styling requires consistency discipline |
| Massive community | |

**Proven in Delta TMS V3** — Tailwind 4 + shadcn/ui, custom design tokens (indigo primary, midnight buttons), 30+ pages styled.

### Option B: CSS Modules

| Pros | Cons |
|------|------|
| Scoped styles by default | No utility classes — more verbose |
| No runtime overhead | Need to write more CSS |
| Works with any framework | Component library integration harder |
| Simple mental model | Design system requires more setup |

### Option C: Styled Components (CSS-in-JS)

| Pros | Cons |
|------|------|
| Dynamic styles based on props | Runtime CSS overhead |
| Scoped by default | Larger bundle size |
| Great for component libraries | Not compatible with Server Components |
| Co-located styles | Performance concerns at scale |

### Option D: Panda CSS

| Pros | Cons |
|------|------|
| Type-safe styling with tokens | Newer, smaller ecosystem |
| Build-time extraction (no runtime) | Learning curve |
| Works with Server Components | Fewer integrations |
| Good TypeScript DX | Component libraries less available |

### Recommendation: **Tailwind CSS + shadcn/ui**

The combination gives you both speed (utility classes) and quality (pre-built accessible components). shadcn/ui components are copied into your project — you own and customize them, unlike npm-installed component libraries.

### When to Deviate
- **Choose CSS Modules** if: Team strongly prefers traditional CSS, or project has unusual styling requirements
- **Choose Styled Components** if: Heavy dynamic styling needs, building a standalone component library (not an app)
- **Choose Panda CSS** if: You want Tailwind-like DX with type safety and build-time extraction

### Lesson Learned
> In Delta TMS V3, the design system uses CSS custom properties (design tokens) layered on top of shadcn/ui defaults. This means changing the primary color from `blue` to `indigo` was a single CSS variable change, not a find-and-replace across 30+ files. Always set up your design tokens BEFORE building pages.

---

## Node 8 — Real-Time

**Question:** Does the app need real-time updates, and if so, how?

### Option A: SSE (Server-Sent Events) -- RECOMMENDED

**Description:** One-way server-to-client event stream. Server pushes updates; client listens. Simple HTTP-based protocol.

| Pros | Cons |
|------|------|
| Simple implementation | Server-to-client only (one-way) |
| Works over standard HTTP | No client-to-server messages |
| Auto-reconnection built into browser API | Limited to ~6 connections per domain |
| Low server resource usage | Not for bidirectional communication |
| No WebSocket upgrade needed | |

**Proven in Delta TMS V3** — SSE for dispatch board live updates, trip status changes, dashboard refresh.

### Option B: WebSocket

| Pros | Cons |
|------|------|
| Bidirectional communication | More complex server setup |
| Low latency | Connection management overhead |
| Great for chat, collaboration | Need heartbeat/reconnection logic |
| Socket.io adds convenience | Higher server memory per connection |

### Option C: Polling

| Pros | Cons |
|------|------|
| Simplest to implement | Higher latency (interval-based) |
| Works everywhere | Wasted requests when nothing changes |
| No special server setup | Higher server load at scale |
| Easy to understand | Not truly "real-time" |

### Option D: None

Skip real-time entirely. Users manually refresh or navigate to see updates.

### Recommendation: **SSE (Server-Sent Events)**

For 90% of applications (dashboards, notifications, status updates), SSE is sufficient and dramatically simpler than WebSocket. The browser's `EventSource` API handles reconnection automatically.

### When to Deviate
- **Choose WebSocket** if: Chat functionality, collaborative document editing, multiplayer features, or any bidirectional real-time need
- **Choose Polling** if: Updates needed every 30+ seconds, simplicity is paramount, or you're prototyping
- **Choose None** if: Static content, no collaborative features, users accept manual refresh

### Lesson Learned
> SSE connections count against the browser's per-domain connection limit (~6 in most browsers). If your app has multiple SSE streams, consider multiplexing events into a single stream with event type discrimination. In Delta TMS V3, one SSE endpoint serves dispatch updates, trip changes, and dashboard refreshes using event types.

---

## Node 9 — Testing

**Question:** What testing tools and strategy?

### Option A: Vitest + Playwright -- RECOMMENDED

**Description:** Vitest for unit/integration tests (fast, Vite-native), Playwright for cross-browser E2E tests.

| Pros | Cons |
|------|------|
| Vitest is extremely fast | Two tools to learn |
| Playwright tests all browsers | E2E tests are slower to run |
| Compatible with Vite/Next.js | Playwright setup requires browsers installed |
| Watch mode is excellent | |

**Proven in Delta TMS V3** — Vitest for API/logic tests, Playwright for E2E flows.

### Option B: Jest + Cypress

| Pros | Cons |
|------|------|
| Most documented testing stack | Jest is slower than Vitest |
| Cypress has great DX and dashboard | Cypress limited to Chromium by default |
| Huge community | Cypress paid features for CI dashboard |
| Many examples available | Configuration can be complex |

### Option C: Bun Test + Playwright

| Pros | Cons |
|------|------|
| Fastest test runner (Bun) | Bun test is less mature |
| Built-in to Bun runtime | Fewer plugins/integrations |
| Compatible with Jest syntax | Edge cases with Node.js compatibility |
| Great for new projects | |

### Recommendation: **Vitest + Playwright**

Vitest's speed advantage over Jest is significant (2-5x faster in practice), and Playwright's cross-browser support is essential for production apps. The combination covers unit, integration, and E2E testing comprehensively.

### When to Deviate
- **Choose Jest + Cypress** if: Team already uses this stack, or you need Cypress Dashboard for CI visibility
- **Choose Bun Test** if: Already using Bun runtime, or want the absolute fastest unit test runner

### Lesson Learned
> Write E2E tests for critical user flows FIRST (login, main CRUD operations, payment). Unit tests for business logic. Skip testing UI rendering — it changes too often and breaks tests constantly. In Delta TMS V3, the most valuable tests were the trip lifecycle E2E test (create -> assign -> dispatch -> complete -> invoice) and the auth flow tests.

---

## Node 10 — Deployment

**Question:** Where and how is the application deployed?

### Option A: Vercel -- RECOMMENDED

**Description:** Zero-config deployment platform with automatic deployments from Git, preview URLs per PR, and serverless functions.

| Pros | Cons |
|------|------|
| Zero-config for Next.js | Vendor lock-in to Vercel platform |
| Automatic preview deployments | Serverless function limits (10s default) |
| Built-in analytics and monitoring | Cost increases with traffic |
| Edge functions available | Cold starts on serverless |
| Great DX (push to deploy) | |

**Proven in production** — Vercel deployment, auto-deploy on push, custom domain setup verified.

### Option B: AWS (SST / CDK)

| Pros | Cons |
|------|------|
| Full infrastructure control | Significant complexity |
| Any stack, any configuration | AWS learning curve is steep |
| Cost-effective at scale | Infrastructure-as-code required |
| Enterprise-grade reliability | Deployment pipelines need setup |

### Option C: Docker + Any Host

| Pros | Cons |
|------|------|
| Portable across any provider | Need to manage Docker, orchestration |
| Full control over environment | More operational overhead |
| Self-hosted option | Need to handle SSL, scaling, monitoring |
| Predictable resource costs | |

### Option D: Cloudflare Pages

| Pros | Cons |
|------|------|
| Edge-first deployment | Limited server-side rendering support |
| Workers for server logic | Not native Next.js support (improving) |
| Generous free tier | Smaller ecosystem for full-stack |
| Global CDN built-in | Workers have execution limits |

### Recommendation: **Vercel**

For Next.js applications, Vercel is the path of least resistance. Push to Git, it deploys. Preview URLs per PR. Automatic HTTPS. The DX advantage is worth the vendor coupling for most projects.

### When to Deviate
- **Choose AWS** if: Enterprise requirements, need full infrastructure control, or Vercel costs become prohibitive at scale
- **Choose Docker** if: Self-hosted requirement, air-gapped environments, or you need custom infrastructure
- **Choose Cloudflare** if: Edge-first architecture, using Cloudflare Workers, or want the cheapest option at scale

### Lesson Learned
> Vercel deployment from a monorepo: set the "Root Directory" in Vercel project settings to your app folder (e.g., `V3/`), then use `buildCommand: "pnpm --filter @delta/web build"` in `vercel.json`. Deploy from the repo root, NOT the app folder. Also: environment variable corruption is real — `vercel env pull` and verify values don't have trailing `\n` characters, which break auth secrets silently.

---

## Decision Summary Template

After walking all 10 nodes, record your selections:

```markdown
## Tech Stack Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project Structure | {choice} | {why} |
| Frontend Framework | {choice} | {why} |
| API Layer | {choice} | {why} |
| ORM | {choice} | {why} |
| Database | {choice} | {why} |
| Authentication | {choice} | {why} |
| Styling | {choice} | {why} |
| Real-Time | {choice} | {why} |
| Testing | {choice} | {why} |
| Deployment | {choice} | {why} |
```

Transfer this summary to `decisions-log.template.md` with full rationale for each choice.
