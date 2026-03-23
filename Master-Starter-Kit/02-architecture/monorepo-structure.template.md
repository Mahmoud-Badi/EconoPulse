# Monorepo Structure Template

## Project: {{PROJECT_NAME}}

Fill this template after completing the tech-stack-decision-tree. Replace all `{{PLACEHOLDERS}}` with project-specific values.

---

## Package Topology

```
{PROJECT_NAME}/
  pnpm-workspace.yaml
  turbo.json
  package.json              # Root — workspaces config, scripts
  biome.json                # Shared linting/formatting (or .eslintrc)
  .env.example              # Required env vars documented
  .gitignore

  apps/
    web/                    # {FRONTEND_FRAMEWORK} frontend
      package.json          # name: "@{PROJECT_SCOPE}/web"
      next.config.ts        # (or equivalent framework config)
      src/
        app/                # File-based routing
          (auth)/           # Auth route group (login, register, etc.)
          (dashboard)/      # Authenticated route group
          api/              # API route handlers (webhooks, auth)
          layout.tsx        # Root layout
        components/         # App-specific components (not shared)
          {domain}/         # Components organized by domain
        hooks/              # App-specific React hooks
        lib/                # App-specific utilities
        stores/             # Client state (Zustand, etc.)
        styles/             # Global styles, design tokens

<!-- IF {{HAS_MOBILE}} == "true" -->
<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
    mobile/                 # React Native + Expo mobile app
      package.json          # name: "@{PROJECT_SCOPE}/mobile"
      app.json              # Expo configuration
      eas.json              # EAS Build profiles
      metro.config.js       # Metro bundler (monorepo config)
      babel.config.js       # Babel configuration
      tsconfig.json         # Extends root tsconfig
      app/                  # Expo Router (file-based routing)
        (tabs)/             # Tab navigator group
          _layout.tsx       # Tab navigator definition
          index.tsx         # Home tab
        (auth)/             # Auth flow group
          login.tsx
          register.tsx
        _layout.tsx         # Root layout
      components/           # Mobile-specific components
      hooks/                # Mobile-specific hooks
      lib/                  # Utilities (api client, storage)
      stores/               # State management (Zustand)
      constants/            # Colors, layout, config
      assets/               # Images, fonts
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
    mobile_flutter/         # Flutter mobile app
      pubspec.yaml
      analysis_options.yaml
      lib/
        main.dart
        app.dart            # MaterialApp root widget
        screens/            # Screen widgets
        widgets/            # Reusable widgets
        models/             # Data classes / DTOs
        services/           # API client, storage, auth
        providers/          # Riverpod state providers
        utils/              # Helpers, formatters
        constants/          # Colors, text styles, routes
        routes/             # GoRouter configuration
      test/                 # Unit + widget tests
      integration_test/     # Integration tests
      assets/               # Images, fonts
<!-- ENDIF -->
<!-- ENDIF -->

  packages/
    db/                     # Database schema + migrations
      package.json          # name: "@{PROJECT_SCOPE}/db"
      drizzle.config.ts     # (or prisma/schema.prisma)
      src/
        index.ts            # DB client export
        schema/             # Split schema files per domain
          {domain}.ts       # e.g., users.ts, trips.ts, billing.ts
          enums.ts          # Shared enum definitions
          relations.ts      # Cross-table relationships
        migrations/         # Generated migration files
        seed/               # Seed data scripts
          index.ts          # Orchestrator (runs phases in order)
          {phase}.ts        # e.g., 01-users.ts, 02-entities.ts

    api/                    # Business logic + API routers
      package.json          # name: "@{PROJECT_SCOPE}/api"
      src/
        index.ts            # Root router export
        router.ts           # Merged app router
        trpc.ts             # tRPC initialization (or REST handler setup)
        routers/            # One file per domain
          {domain}.ts       # e.g., users.ts, trips.ts, billing.ts
        middleware/          # Auth, logging, rate-limiting
          auth.ts
        utils/              # Shared API utilities

    auth/                   # Authentication configuration
      package.json          # name: "@{PROJECT_SCOPE}/auth"
      src/
        index.ts            # Auth instance export
        config.ts           # Provider configuration
        client.ts           # Client-side auth hooks

    ui/                     # Shared component library
      package.json          # name: "@{PROJECT_SCOPE}/ui"
      src/
        components/         # shadcn/ui components (copied, customized)
          ui/               # Base components (button, input, card, etc.)
          shared/           # Project-wide shared components
        lib/
          utils.ts          # cn() helper, formatters
        index.ts            # Public API exports

    validators/             # Shared Zod schemas
      package.json          # name: "@{PROJECT_SCOPE}/validators"
      src/
        index.ts            # All schema exports
        {domain}.ts         # Per-domain validation schemas
        common.ts           # Shared schemas (pagination, date ranges)

    types/                  # Shared TypeScript types
      package.json          # name: "@{PROJECT_SCOPE}/types"
      src/
        index.ts            # All type exports
        {domain}.ts         # Per-domain type definitions
        api.ts              # API request/response types
        database.ts         # DB-inferred types

    services/               # External integration clients
      package.json          # name: "@{PROJECT_SCOPE}/services"
      src/
        index.ts            # Service exports
        {service-name}/     # e.g., stripe/, twilio/, maps/
          client.ts         # Service client initialization
          types.ts          # Service-specific types
          mock.ts           # Mock fallback for development

  tooling/                  # Shared configuration
    typescript/
      base.json             # Base tsconfig
      nextjs.json           # Next.js-specific tsconfig
      library.json          # Library package tsconfig
    tailwind/
      base.config.ts        # Shared Tailwind config + design tokens
    biome/
      biome.json            # Shared Biome config (or ESLint)
```

---

## Dependency Graph

```
                    apps/web
                   /   |    \
                  /    |     \
            packages/  |  packages/
              api      |    ui
             / | \     |
            /  |  \    |
      packages/ | packages/
        db    |  validators
              |
         packages/
           auth

  packages/types ← imported by ALL packages
  packages/services ← imported by packages/api
  tooling/* ← extended by ALL packages (tsconfig, biome, tailwind)

<!-- IF {{HAS_MOBILE}} == "true" -->
  apps/mobile ← imports from: types, validators, api (client), auth (client)
               ← does NOT import from: ui (web components), db (server-only)
<!-- ENDIF -->
```

### Dependency Rules

| Package | Can Import From | Cannot Import From |
|---------|----------------|-------------------|
| `apps/web` | All packages | — |
| `packages/api` | db, auth, validators, types, services | ui, apps/web |
| `packages/db` | types | api, auth, ui, validators, apps/web |
| `packages/auth` | db, types | api, ui, validators, apps/web |
| `packages/ui` | types | db, api, auth, validators, apps/web |
| `packages/validators` | types | db, api, auth, ui, apps/web |
| `packages/types` | (none — leaf package) | Everything |
| `packages/services` | types, validators | db, api, auth, ui, apps/web |
<!-- IF {{HAS_MOBILE}} == "true" -->
| `apps/mobile` | types, validators, api (client), auth (client), services | db (server-only), ui (web components) |
<!-- ENDIF -->

**Rule:** Dependencies flow DOWN the graph. No circular imports. `types` and `validators` are leaf packages — they import nothing from the monorepo.

---

## Package.json Patterns

### Root package.json

```json
{
  "name": "{PROJECT_NAME}",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "db:generate": "pnpm --filter @{PROJECT_SCOPE}/db generate",
    "db:migrate": "pnpm --filter @{PROJECT_SCOPE}/db migrate",
    "db:seed": "pnpm --filter @{PROJECT_SCOPE}/db seed",
    "db:studio": "pnpm --filter @{PROJECT_SCOPE}/db studio"
  },
  "devDependencies": {
    "turbo": "^2.x",
    "@biomejs/biome": "^1.x"
  },
  "packageManager": "pnpm@9.x"
}
```

### Library Package Pattern (packages/*)

```json
{
  "name": "@{PROJECT_SCOPE}/{PACKAGE_NAME}",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "biome check .",
    "test": "vitest run"
  },
  "dependencies": {
    "@{PROJECT_SCOPE}/types": "workspace:*"
  }
}
```

**Key pattern:** `"main": "./src/index.ts"` — in a monorepo, packages consume TypeScript source directly. No build step needed for internal packages. Turborepo handles build orchestration for the app.

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## When to Add a Package

Add a new package when:

| Signal | Action |
|--------|--------|
| Logic is shared by 2+ packages | Extract to `packages/{name}` |
| External service needs a client wrapper | Add to `packages/services/{name}/` |
| New app needed (admin panel, mobile API) | Add to `apps/{name}` |
| Domain-specific UI components grow past 10 | Consider `packages/ui/{domain}/` subdirectory |
| Shared config duplicated across packages | Add to `tooling/{name}` |

## When to Remove a Package

Remove a package (merge into another) when:

| Signal | Action |
|--------|--------|
| Package has only 1-2 exports | Merge into the importing package |
| Package is only used by one consumer | Inline it into that consumer |
| Package creates circular dependency | Restructure or merge |
| Package has become a "junk drawer" | Split by responsibility or inline |

---

## Example: Filled Template (Transportation Management)

```
delta-tms/
  apps/web/                       # Next.js 16 frontend
  packages/
    db/                           # Drizzle ORM, pgSchema("v3")
      src/schema/
        users.ts                  # Users, accounts, sessions
        trips.ts                  # Trips, assignments, route details
        drivers.ts                # Drivers, vehicle assignments
        vehicles.ts               # Vehicles, maintenance records
        facilities.ts             # Pickup/dropoff locations
        billing.ts                # Invoices, line items, payments
        enums.ts                  # tripStatus, driverStatus, invoiceStatus
        relations.ts              # All cross-table relationships
    api/                          # tRPC v11 routers
      src/routers/
        users.ts                  # CRUD + role management
        trips.ts                  # CRUD + lifecycle (assign, dispatch, complete)
        drivers.ts                # CRUD + availability
        vehicles.ts               # CRUD + assignment
        facilities.ts             # CRUD + geocoding
        billing.ts                # Invoice generation, payments
        dashboard.ts              # KPIs, charts, snapshots
        dispatch.ts               # Board state, drag-drop operations
    auth/                         # Better Auth config
    ui/                           # shadcn/ui + custom components
    validators/                   # Zod schemas (trip, driver, invoice, etc.)
    types/                        # Inferred DB types, API types
    services/                     # Google Maps, notification service
  tooling/
    typescript/                   # Shared tsconfig presets
    tailwind/                     # Design tokens (indigo primary)
```

---

## Checklist Before Proceeding

- [ ] All `{{PLACEHOLDERS}}` replaced with project-specific values
- [ ] Dependency graph has no circular imports
- [ ] Every domain from VERDICT has a schema file slot
- [ ] Every domain from VERDICT has a router file slot
- [ ] Package naming convention is consistent (`@{scope}/{name}`)
- [ ] Root scripts cover: dev, build, lint, test, db operations
- [ ] `.env.example` documents every required environment variable
