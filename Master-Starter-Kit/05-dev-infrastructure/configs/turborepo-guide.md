# Turborepo Configuration Guide

## Overview

Turborepo orchestrates tasks across all packages in a monorepo. It handles dependency ordering, parallel execution, and intelligent caching so you never rebuild what hasn't changed.

## pnpm-workspace.yaml

Define which directories contain packages:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

Typical structure:
```
apps/
  web/          # Next.js frontend (@{project}/web)
packages/
  api/          # tRPC routers (@{project}/api)
  db/           # Drizzle schema + migrations (@{project}/db)
  ui/           # Shared UI components (@{project}/ui)
  validators/   # Zod schemas (@{project}/validators)
tooling/
  typescript/   # Shared tsconfig (@{project}/tsconfig)
  biome/        # Shared Biome config (@{project}/biome-config)
```

## turbo.json

Place at the monorepo root (same level as pnpm-workspace.yaml):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": [
    "DATABASE_URL",
    "DIRECT_URL",
    "NODE_ENV",
    "NEXT_PUBLIC_APP_URL"
  ],
  "tasks": {
    "dev": {
      "dependsOn": ["^db:generate"],
      "persistent": true,
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "db:push": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    },
    "db:studio": {
      "persistent": true,
      "cache": false
    },
    "db:seed": {
      "cache": false,
      "dependsOn": ["db:push"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Task Configuration Details

### Dependency Graph (`dependsOn`)

- `^build` means "run build in all dependency packages first." If `@project/web` depends on `@project/api`, Turbo builds `api` before `web`.
- `^db:generate` for `dev` ensures Drizzle client types are generated before the dev server starts.
- Tasks without `dependsOn` run independently in parallel.

### Caching Strategy

| Task | Cached? | Why |
|------|---------|-----|
| `build` | Yes | Deterministic output from source files |
| `typecheck` | Yes | Same types = same result |
| `lint` | Yes | Same source = same lint result |
| `test` | No | Tests should always run fresh (side effects, DB state) |
| `dev` | No | Long-running dev server, no output to cache |
| `db:push` | No | Mutates external database |
| `db:generate` | No | Generates client code that must stay in sync |
| `db:seed` | No | Mutates external database |
| `db:studio` | No | Long-running process |
| `clean` | No | Removes cached artifacts |

### Persistent Tasks

Set `persistent: true` for long-running processes (dev servers, Drizzle Studio). This tells Turbo not to wait for them to finish before running downstream tasks.

### Build Outputs

```json
"build": {
  "outputs": [".next/**", "dist/**"]
}
```

Turbo caches these output directories. On cache hit, it restores the outputs instead of rebuilding.

## globalEnv

Environment variables that affect build output across all packages. If any of these change, all caches are invalidated:

```json
"globalEnv": [
  "DATABASE_URL",
  "DIRECT_URL",
  "NODE_ENV",
  "NEXT_PUBLIC_APP_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL"
]
```

Add any `NEXT_PUBLIC_*` variable here since it gets inlined at build time.

## Root package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "lint": "turbo lint",
    "clean": "turbo clean && rm -rf node_modules",
    "db:push": "turbo db:push",
    "db:generate": "turbo db:generate",
    "db:studio": "turbo db:studio",
    "db:seed": "turbo db:seed"
  }
}
```

## Per-Package Scripts

Each package only defines the scripts it supports:

**packages/db/package.json:**
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/seed/index.ts"
  }
}
```

**packages/api/package.json:**
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "biome check ."
  }
}
```

**apps/web/package.json:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "biome check ."
  }
}
```

## Filtering

Run tasks for specific packages:

```bash
# Only build the web app
pnpm turbo build --filter=@project/web

# Only run tests in api package
pnpm turbo test --filter=@project/api

# Run everything that depends on db
pnpm turbo build --filter=...@project/db
```

## Stack Variations

### Without tRPC (REST API)

Remove `packages/api/` and `packages/validators/`. The `apps/web/` package calls API routes directly. Same turbo.json works.

### With Separate Backend

Add `apps/api/` alongside `apps/web/`. Both get `dev` and `build` tasks:

```json
{
  "tasks": {
    "dev": {
      "persistent": true,
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

### With Storybook

Add a `storybook` task:

```json
{
  "tasks": {
    "storybook": {
      "persistent": true,
      "cache": false
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```

## Common Gotchas

1. **Missing `^` prefix**: `"dependsOn": ["build"]` means "run my own build first" (circular). `"dependsOn": ["^build"]` means "run build in my dependencies first."

2. **Forgetting `persistent: true`**: Dev servers without this flag block other tasks from completing.

3. **Caching DB operations**: Never cache `db:push`, `db:generate`, `db:seed`, or `db:studio`. These interact with external state.

4. **globalEnv misses**: If a `NEXT_PUBLIC_*` var isn't in `globalEnv`, changing it won't invalidate the build cache, leading to stale builds.

5. **Package naming**: Every `package.json` needs a unique `"name"` field (e.g., `@project/web`). Turbo uses these for the dependency graph.

6. **pnpm workspace protocol**: Use `"@project/db": "workspace:*"` in dependencies to reference local packages.
