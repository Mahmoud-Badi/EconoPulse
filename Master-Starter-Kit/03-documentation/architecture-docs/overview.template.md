# Architecture Overview — {{PROJECT_NAME}}

## What Is This Project?

**{{PROJECT_NAME}}** is a {{PROJECT_TYPE}} that {{ONE_SENTENCE_PURPOSE}}.

**Domain:** {{DOMAIN}} (e.g., healthcare, logistics, fintech, SaaS)
**Users:** {{PRIMARY_USERS}} and {{SECONDARY_USERS}}
**Scale:** {{EXPECTED_SCALE}} (e.g., 50 companies, 500 users, 10K daily transactions)

---

## Who It Serves

| User Type | Description | Key Needs |
|-----------|-------------|-----------|
| {{USER_TYPE_1}} | {{DESCRIPTION}} | {{NEEDS}} |
| {{USER_TYPE_2}} | {{DESCRIPTION}} | {{NEEDS}} |
| {{USER_TYPE_3}} | {{DESCRIPTION}} | {{NEEDS}} |
| {{USER_TYPE_4}} | {{DESCRIPTION}} | {{NEEDS}} |

---

## Tech Stack Summary

| Layer | Technology | Version | Why Chosen |
|-------|-----------|---------|------------|
| Framework | Next.js | {{VERSION}} | {{RATIONALE}} |
| Language | TypeScript | {{VERSION}} | Type safety, shared types client/server |
| Runtime | React | {{VERSION}} | {{RATIONALE}} |
| API | tRPC | {{VERSION}} | End-to-end type safety, no codegen |
| Database | PostgreSQL | {{VERSION}} | {{RATIONALE}} |
| ORM | Drizzle | {{VERSION}} | Type-safe, performant, migration support |
| Auth | {{AUTH_LIB}} | {{VERSION}} | {{RATIONALE}} |
| Styling | Tailwind CSS | {{VERSION}} | Utility-first, design token integration |
| Components | shadcn/ui | latest | Customizable, accessible, copy-paste |
| Forms | react-hook-form | {{VERSION}} | Performance, Zod integration |
| Validation | Zod | {{VERSION}} | Runtime + TypeScript validation |
| Server State | TanStack Query | {{VERSION}} | Caching, refetching, optimistic updates |
| Client State | Zustand | {{VERSION}} | Simple, minimal, when needed |
| Real-time | SSE / {{WEBSOCKET_LIB}} | — | {{RATIONALE}} |
| Testing | Vitest + Playwright | {{VERSIONS}} | Fast unit tests + E2E |
| Linting | {{LINTER}} | {{VERSION}} | {{RATIONALE}} |
| Monorepo | Turborepo + pnpm | {{VERSIONS}} | Parallel builds, shared packages |
| Hosting | {{PLATFORM}} | — | {{RATIONALE}} |
| Database Host | {{DB_HOST}} | — | {{RATIONALE}} |

---

## Monorepo Map

```
{PROJECT_ROOT}/
├── apps/
│   └── web/                    — Next.js application
│       ├── app/                — App Router pages and layouts
│       │   ├── (auth)/         — Auth pages (login, register, forgot-password)
│       │   ├── (app)/          — Authenticated app pages (dashboard, entities)
│       │   └── api/            — API routes (tRPC handler, auth handler, SSE)
│       ├── components/         — Page-specific components
│       ├── hooks/              — Client-side hooks
│       ├── lib/                — Utilities (auth client, tRPC client, utils)
│       └── public/             — Static assets
├── packages/
│   ├── api/                    — tRPC router definitions
│   │   ├── src/
│   │   │   ├── routers/        — One file per domain router
│   │   │   ├── trpc.ts         — tRPC initialization + middleware
│   │   │   └── root.ts         — Root router (merges all routers)
│   │   └── package.json
│   ├── db/                     — Database layer
│   │   ├── src/
│   │   │   ├── schema/         — Drizzle schema definitions
│   │   │   ├── migrations/     — Generated SQL migrations
│   │   │   ├── seed/           — Seed data files (one per domain)
│   │   │   └── index.ts        — DB client export
│   │   └── drizzle.config.ts
│   ├── ui/                     — Shared UI components
│   │   ├── src/
│   │   │   └── components/     — shadcn/ui base + custom components
│   │   └── package.json
│   ├── validators/             — Shared Zod schemas
│   │   ├── src/
│   │   │   └── {entity}.ts     — One file per domain entity
│   │   └── package.json
│   └── {PACKAGE_N}/            — {PURPOSE}
├── tooling/                    — Shared configs (tsconfig, eslint, tailwind)
├── turbo.json                  — Turborepo pipeline config
├── pnpm-workspace.yaml         — Workspace definition
└── package.json                — Root package.json
```

### Package Dependency Graph

```
web → api → db → validators
web → ui → validators
web → validators
```

> **Rule:** Packages only depend downward. `db` never imports from `api`. `ui` never imports from `db`. `validators` imports from nothing (leaf package).

---

## Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | Turborepo + pnpm | Shared types, parallel builds, single repo |
| API style | tRPC (not REST/GraphQL) | End-to-end type safety without codegen |
| DB access | Drizzle (not Prisma) | Faster, closer to SQL, better migrations |
| Auth | {{AUTH_LIB}} (not NextAuth) | {{RATIONALE}} |
| Styling | Tailwind 4 (not CSS modules) | Design tokens, utility-first, fast iteration |
| State | TanStack Query (not Redux) | Server-state focused, caching built-in |
| Schema isolation | pgSchema("{{SCHEMA_NAME}}") | {RATIONALE — e.g., share DB with other apps} |
| Testing | Vitest (not Jest) | Native ESM, faster, Vite ecosystem |
| Deployment | {{PLATFORM}} | {{RATIONALE}} |

---

## Deployment Target

| Aspect | Value |
|--------|-------|
| Platform | {{DEPLOYMENT_PLATFORM}} |
| Region | {{REGION}} |
| Build command | `{{BUILD_COMMAND}}` |
| Root directory | `{{ROOT_DIR}}` |
| Production URL | {{PRODUCTION_URL}} |
| Database | {{DB_PROVIDER}} ({{DB_REGION}}) |
| Environment variables | {{LIST_OF_ENV_VARS}} |

---

## Cross-Cutting Concerns

These are documented in separate architecture docs:

- **Error Handling** → `error-handling.md`
- **State Management** → `state-management.md`
- **Form Patterns** → `form-patterns.md`
- **Real-time** → `realtime-patterns.md`
- **Auth & Roles** → `../api-docs/middleware.md`
- **Design System** → `../design-docs/`
