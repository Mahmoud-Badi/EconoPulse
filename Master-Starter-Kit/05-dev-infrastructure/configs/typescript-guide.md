# TypeScript Configuration for Monorepos

## Overview

In a Turborepo monorepo, TypeScript configuration is layered: a shared base config defines strict defaults, and each package extends it with package-specific settings. This avoids duplication and ensures consistency.

## Directory Structure

```
tooling/
  typescript/
    package.json          # @{project}/tsconfig
    tsconfig.base.json    # Shared strict settings
    tsconfig.nextjs.json  # Next.js-specific settings
packages/
  api/
    tsconfig.json         # Extends base
  db/
    tsconfig.json         # Extends base
  ui/
    tsconfig.json         # Extends nextjs (has JSX)
  validators/
    tsconfig.json         # Extends base
apps/
  web/
    tsconfig.json         # Extends nextjs (Next.js generates this)
```

## Shared Base Config

**tooling/typescript/tsconfig.base.json:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "compilerOptions": {
    /* Type Safety */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": false,

    /* Module Resolution */
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,

    /* Emit */
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": true,

    /* Other */
    "skipLibCheck": true,
    "incremental": true
  },
  "exclude": ["node_modules", "dist", ".next", ".turbo", "coverage"]
}
```

**tooling/typescript/tsconfig.nextjs.json:**

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

**tooling/typescript/package.json:**

```json
{
  "name": "@{project}/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": ["tsconfig.base.json", "tsconfig.nextjs.json"]
}
```

## Per-Package Configs

### packages/api/tsconfig.json (no JSX)

```json
{
  "extends": "@{project}/tsconfig/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### packages/db/tsconfig.json

```json
{
  "extends": "@{project}/tsconfig/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts", "drizzle.config.ts", "env.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### packages/ui/tsconfig.json (has JSX)

```json
{
  "extends": "@{project}/tsconfig/tsconfig.nextjs.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### apps/web/tsconfig.json (Next.js)

Next.js generates this on first run, but ensure it extends your shared config:

```json
{
  "extends": "@{project}/tsconfig/tsconfig.nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Key Compiler Flags Explained

### `strict: true`

Enables all strict type-checking options: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`. Non-negotiable for production code.

### `noUncheckedIndexedAccess: true`

Makes indexed access return `T | undefined` instead of `T`:

```typescript
const arr = [1, 2, 3];
const item = arr[0]; // Type: number | undefined

// You must handle the undefined case:
if (item !== undefined) {
  console.log(item); // Type: number
}

// Or use non-null assertion when you KNOW it exists:
const record: Record<string, number> = { a: 1 };
const value = record["a"]!; // Type: number (you assert it exists)
```

**Gotcha**: This flag means you'll need `!` non-null assertions on object property lookups where you know the key exists. This is expected and correct.

### `moduleResolution: "bundler"`

The modern resolution mode for bundled applications (Next.js, Vite). Supports `package.json` `exports` field, `import` conditions, and `.ts` extension imports. Do NOT use `"node"` or `"node16"` for bundled apps.

### `isolatedModules: true`

Required by bundlers (Next.js, Vite, esbuild). Ensures each file can be independently transpiled. Forbids features that need whole-program analysis (const enums, namespace merging).

### `skipLibCheck: true`

Skips type-checking `.d.ts` files from `node_modules`. Dramatically speeds up type-checking. Always enable in monorepos.

## The "No Build Step" Pattern

For development, packages can expose raw TypeScript without a build step:

**packages/api/package.json:**
```json
{
  "name": "@{project}/api",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

The consuming app (Next.js) transpiles the TypeScript at build time via `transpilePackages` in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  transpilePackages: [
    "@{project}/api",
    "@{project}/db",
    "@{project}/ui",
    "@{project}/validators",
  ],
};
```

This eliminates the need for `tsc --build` in development. Packages just export raw `.ts` files.

## Path Aliases

Use `paths` in tsconfig for cleaner imports within a package:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

This lets you write `import { Button } from "~/components/button"` instead of `import { Button } from "../../../components/button"`.

For Next.js, this works automatically. For other packages, the bundler handles resolution.

## Common TypeScript Gotchas

### 1. Enum Literals Need `as const`

When inserting array data with Drizzle ORM, string enum values widen to `string`:

```typescript
// ERROR: Type 'string' is not assignable to type '"active" | "inactive"'
const statuses = ["active", "inactive"];

// FIX: Use as const
const statuses = ["active", "inactive"] as const;
```

This is a TypeScript 2769 error that shows up frequently with Drizzle inserts.

### 2. Non-Null Assertions with `noUncheckedIndexedAccess`

```typescript
// With noUncheckedIndexedAccess: true
const map: Record<string, User> = getUsers();

// ERROR: Object is possibly undefined
const user = map[userId].name;

// FIX: Assert when you know the key exists
const user = map[userId]!.name;

// BETTER: Guard when you don't know
const user = map[userId];
if (user) {
  console.log(user.name);
}
```

### 3. Package Resolution Errors

If TypeScript can't find a local package:

1. Check `package.json` has `"main": "./src/index.ts"`
2. Check the consuming package has it in `dependencies`
3. Check `pnpm-workspace.yaml` includes the directory
4. Run `pnpm install` to regenerate symlinks

### 4. Type-Only Imports

Always use `import type` for types that don't exist at runtime:

```typescript
// GOOD: import type for types only
import type { User, Trip } from "@{project}/db";
import { users, trips } from "@{project}/db";

// BAD: importing types as values (increases bundle)
import { User, Trip, users, trips } from "@{project}/db";
```

Biome's `useImportType` rule enforces this automatically.

### 5. `exactOptionalPropertyTypes`

Keep this `false` unless you want maximum strictness. When `true`, `undefined` is not assignable to optional properties:

```typescript
// With exactOptionalPropertyTypes: true
interface Opts { name?: string }
const opts: Opts = { name: undefined }; // ERROR!
// Must omit the property entirely or provide a string
```

This catches real bugs but creates friction with form libraries and API responses.

## Monorepo Typecheck Command

Each package defines its own typecheck script:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

Run across all packages via Turbo: `pnpm turbo typecheck`

Turbo runs them in dependency order and caches the results. A cached typecheck resolves in milliseconds.
