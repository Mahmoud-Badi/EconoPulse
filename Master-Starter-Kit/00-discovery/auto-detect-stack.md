# Auto-Detect Stack

> Before asking the user anything, scan the codebase to auto-detect the technology stack.

## When to Use

- **Existing projects:** Always run auto-detection first. Only ask questions about what you can't detect.
- **Greenfield projects:** Skip auto-detection. Use the intake questions to determine the stack.

## Detection Process

### Step 1: Scan for Package Managers and Language Files

```
Glob for these files in the project root:
- package.json          → Node.js / JavaScript / TypeScript
- requirements.txt      → Python (pip)
- pyproject.toml        → Python (poetry/pdm)
- go.mod                → Go
- Gemfile               → Ruby
- Cargo.toml            → Rust
- pubspec.yaml          → Dart/Flutter
- composer.json         → PHP
- pom.xml / build.gradle → Java/Kotlin
```

### Step 2: Detect Frontend Framework

```
Read package.json dependencies:
- "next"                → Next.js
- "react" (no next)     → React (Vite/CRA)
- "vue"                 → Vue.js
- "nuxt"                → Nuxt
- "svelte"              → SvelteKit
- "angular"             → Angular
- "@remix-run/react"    → Remix

Check for framework-specific config files:
- next.config.*         → Next.js
- vite.config.*         → Vite
- angular.json          → Angular
- svelte.config.*       → SvelteKit
```

### Step 3: Detect Backend Framework

```
Read package.json dependencies:
- "@nestjs/core"        → NestJS
- "express"             → Express
- "fastify"             → Fastify
- "hono"                → Hono

Python:
- "fastapi"             → FastAPI
- "django"              → Django
- "flask"               → Flask

Ruby:
- "rails"               → Rails

Go:
- Check for main.go, gin/echo/fiber imports
```

### Step 4: Detect Database & ORM

```
- "prisma"              → Prisma ORM
- "drizzle-orm"         → Drizzle ORM
- "@supabase/supabase-js" → Supabase
- "typeorm"             → TypeORM
- "sequelize"           → Sequelize
- "mongoose"            → MongoDB/Mongoose
- "django.db"           → Django ORM
- "activerecord"        → ActiveRecord

Check for schema files:
- prisma/schema.prisma  → Prisma
- drizzle.config.*      → Drizzle
- src/db/schema.*       → Drizzle (custom path)
```

### Step 5: Detect Monorepo Tool

```
- turbo.json            → Turborepo
- nx.json               → Nx
- lerna.json             → Lerna
- pnpm-workspace.yaml   → pnpm workspaces
- packages/ or apps/    → Monorepo structure
```

### Step 6: Detect Package Manager

```
- pnpm-lock.yaml        → pnpm
- yarn.lock             → yarn
- bun.lockb             → bun
- package-lock.json     → npm
```

### Step 7: Detect Testing Framework

```
- vitest.config.*       → Vitest
- jest.config.*         → Jest
- playwright.config.*   → Playwright
- cypress.config.*      → Cypress
```

### Step 8: Detect Linting/Formatting

```
- biome.json            → Biome
- .eslintrc.* / eslint.config.* → ESLint
- .prettierrc.*         → Prettier
```

## Output: CONFIG Object

After detection, build the CONFIG object:

```
{{PROJECT_NAME}}        = from package.json name or folder name
{{FRONTEND_FRAMEWORK}}  = next | react | vue | svelte | angular | none
{{BACKEND_FRAMEWORK}}   = nestjs | express | fastapi | django | rails | trpc | none
{{ORM}}                 = prisma | drizzle | typeorm | sequelize | django | activerecord | none
{{DATABASE}}            = postgresql | mysql | sqlite | mongodb | supabase | none
{{PACKAGE_MANAGER}}     = pnpm | yarn | npm | bun
{{MONOREPO_TOOL}}       = turborepo | nx | lerna | none
{{TEST_FRAMEWORK}}      = vitest | jest | pytest | rspec | none
{{E2E_FRAMEWORK}}       = playwright | cypress | none
{{LINTER}}              = biome | eslint | none
{{FORMATTER}}           = biome | prettier | none
{{LANGUAGE}}            = typescript | javascript | python | ruby | go | rust
```

### Important: Version Numbers

For **existing codebases**: read exact versions from `package.json` / lock files / config files. These are authoritative.

For **greenfield projects**: do NOT guess versions from training data. Record the technology name only (e.g., "Next.js" not "Next.js 16"). Versions will be verified via live MCP lookups in **Step 1.5: Version Verification**.

## Confirmation

After auto-detection, present a summary to the user:

**For existing codebases** (versions read from lock files):

```
I've detected your stack:
- Frontend: Next.js 16.2.1 (App Router) — from package.json
- Backend: tRPC 11.0.0 — from package.json
- Database: PostgreSQL via Drizzle ORM 0.42.0 — from package.json
- Monorepo: Turborepo with pnpm
- Testing: Vitest + Playwright
- Linting: Biome

Is this correct? Any adjustments needed?
```

**For greenfield projects** (versions TBD):

```
I've identified your target stack:
- Frontend: Next.js (version TBD — verified in Step 1.5)
- Backend: tRPC (version TBD — verified in Step 1.5)
- Database: PostgreSQL via Drizzle ORM (version TBD — verified in Step 1.5)
- Monorepo: Turborepo with pnpm
- Testing: Vitest + Playwright
- Linting: Biome

Is this correct? Any adjustments needed?
Versions will be verified against live data in Step 1.5.
```

Only proceed to intake questions after the user confirms the stack detection.
