# Monorepo Integration Guide

## Purpose

This guide covers adding a mobile application to an existing Turborepo + pnpm monorepo. The goal is to share TypeScript packages (types, validators, utilities) between your web app and React Native app without duplicating code, while avoiding the many bundler and dependency resolution pitfalls that make monorepo mobile development painful.

**Prerequisite:** You already have a working monorepo following the structure in `02-architecture/monorepo-structure.template.md`.

---

## React Native + Expo in a Turborepo Monorepo

This is the recommended path. Expo and Turborepo are both JavaScript/TypeScript tools — they share the same package manager, the same module resolution, and the same dependency ecosystem.

### Step 1: Update `pnpm-workspace.yaml`

No change needed if you already have `apps/*`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

The mobile app lives at `apps/mobile/` alongside `apps/web/`.

### Step 2: Scaffold the Expo App

```bash
cd apps/
npx create-expo-app@latest mobile --template tabs
cd mobile
```

### Step 3: Configure `package.json`

```json
{
  "name": "@{{PROJECT_SLUG}}/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "dev:ios": "expo run:ios",
    "dev:android": "expo run:android",
    "build:dev": "eas build --profile development",
    "build:preview": "eas build --profile preview",
    "build:production": "eas build --profile production",
    "lint": "expo lint",
    "test": "jest"
  },
  "dependencies": {
    "@{{PROJECT_SLUG}}/types": "workspace:*",
    "@{{PROJECT_SLUG}}/validators": "workspace:*",
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

**Key detail:** `"workspace:*"` links to monorepo packages. pnpm resolves these to the local source.

### Step 4: Configure Metro for Monorepo

This is the most critical step. Metro (React Native's bundler) does not understand pnpm's symlinked `node_modules` by default.

```javascript
// apps/mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo (so changes in packages/ trigger reload)
config.watchFolders = [monorepoRoot];

// 2. Tell Metro where to find node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// 3. Prevent Metro from walking up the directory tree for resolution
config.resolver.disableHierarchicalLookup = true;

// 4. Use file-based cache scoped to the mobile app
config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, "node_modules", ".cache", "metro"),
  }),
];

module.exports = config;
```

### Step 5: Configure TypeScript Path Resolution

```json
// apps/mobile/tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@{{PROJECT_SLUG}}/types": ["../../packages/types/src"],
      "@{{PROJECT_SLUG}}/validators": ["../../packages/validators/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "../../packages/types/src/**/*.ts", "../../packages/validators/src/**/*.ts"]
}
```

### Step 6: Update `turbo.json` Tasks

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "dev:mobile": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "build:mobile": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "test:mobile": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

Add root scripts:

```json
// Root package.json — add to scripts
{
  "scripts": {
    "dev": "turbo dev",
    "dev:mobile": "turbo dev:mobile --filter=@{{PROJECT_SLUG}}/mobile",
    "build:mobile": "turbo build:mobile --filter=@{{PROJECT_SLUG}}/mobile",
    "test:mobile": "turbo test:mobile --filter=@{{PROJECT_SLUG}}/mobile"
  }
}
```

### Step 7: Verify Shared Package Resolution

```typescript
// apps/mobile/app/index.tsx — test import
import type { User } from "@{{PROJECT_SLUG}}/types";
import { loginSchema } from "@{{PROJECT_SLUG}}/validators";

// If this compiles and Metro resolves it → monorepo integration works
console.log("Types imported:", typeof User);
console.log("Validators imported:", loginSchema.parse);
```

Run `pnpm dev:mobile` and confirm no resolution errors.

---

## Shared Package Consumption: What Works, What Doesn't

### Works Perfectly

| Package Type | Example | Why It Works |
|-------------|---------|-------------|
| Pure TypeScript types | `@{{PROJECT_SLUG}}/types` | No runtime dependencies, just type definitions |
| Zod validators | `@{{PROJECT_SLUG}}/validators` | Zod is pure JS, no platform-specific code |
| Utility functions | `formatCurrency()`, `slugify()` | Pure functions, no DOM/Node imports |
| Constants/enums | Status codes, role definitions | Static values |
| API client types | tRPC router types | Type-only imports (erased at runtime) |

### Does NOT Work (Do Not Try)

| Package Type | Example | Why It Fails |
|-------------|---------|-------------|
| React web components | `@{{PROJECT_SLUG}}/ui` | Uses `<div>`, `<span>` — not available in React Native |
| Tailwind utilities | `cn()`, `cva()` | React Native has no CSS engine |
| Server-side code | `@{{PROJECT_SLUG}}/db`, `@{{PROJECT_SLUG}}/api` | Node.js runtime APIs unavailable |
| Auth package | `@{{PROJECT_SLUG}}/auth` | Typically depends on cookies/headers (web-specific) |
| Packages importing `react-dom` | Any web-specific React code | `react-dom` does not exist in React Native |

### Partially Works (With Care)

| Package Type | Notes |
|-------------|-------|
| API client (runtime) | If your API client uses `fetch` with no Node/browser-specific code, it may work. But auth token injection differs (web: cookies, mobile: secure storage). Best to create a mobile-specific API client that imports shared types. |
| Business logic with side effects | Works if side effects are injected (strategy pattern), not hardcoded to web APIs. |

---

## EAS Build with Monorepo

EAS Build needs to know about the monorepo structure to install dependencies correctly.

### `eas.json` Configuration

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "base": {
      "node": "20.11.0",
      "pnpm": "9.1.0"
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "API_URL": "{{DEV_API_URL}}"
      }
    },
    "preview": {
      "extends": "base",
      "distribution": "internal",
      "env": {
        "API_URL": "{{STAGING_API_URL}}"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "API_URL": "{{PRODUCTION_API_URL}}"
      }
    }
  }
}
```

**Critical:** EAS Build runs `pnpm install` from the monorepo root. It detects the monorepo automatically if `pnpm-workspace.yaml` exists. The `pnpm` field in the build profile ensures the correct pnpm version.

### Monorepo Detection

EAS Build detects the monorepo by walking up from `apps/mobile/` and finding `pnpm-workspace.yaml`. It:
1. Runs `pnpm install` from the monorepo root
2. Sets the working directory to `apps/mobile/`
3. Runs the native build from there

No manual configuration of `MONOREPO_ROOT` or custom install commands needed with modern EAS.

---

## Flutter in a Node Monorepo

Flutter does not share the JavaScript/TypeScript ecosystem. Putting a Flutter project in a Turborepo monorepo is possible but awkward. Here is the pragmatic approach:

### Directory Placement

```
{{PROJECT_NAME}}/
  pnpm-workspace.yaml
  turbo.json
  apps/
    web/                    # Next.js (managed by Turborepo)
    mobile_flutter/         # Flutter (NOT managed by Turborepo)
  packages/
    types/                  # TypeScript types
    validators/             # Zod validators
```

### What Turborepo Manages

Turborepo manages `apps/web/` and all `packages/*`. It does NOT manage `apps/mobile_flutter/` because:
- Flutter uses `pub` not `pnpm`
- Flutter builds with `flutter build`, not a Turbo task
- Dart cannot import TypeScript packages

### Exclude from pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/web"
  - "packages/*"
  - "tooling/*"
  # Note: apps/mobile_flutter is NOT listed (it's not a JS package)
```

### Sharing the API Contract

Since Flutter cannot import TypeScript types, share via OpenAPI:

1. Add an OpenAPI export script to the backend:
   ```json
   // packages/api/package.json
   {
     "scripts": {
       "openapi:generate": "ts-node src/openapi-export.ts > ../../apps/mobile_flutter/openapi.json"
     }
   }
   ```

2. Generate Dart client code in the Flutter project:
   ```bash
   cd apps/mobile_flutter
   dart run openapi_generator generate -i openapi.json -o lib/generated/
   ```

3. Add to CI:
   ```yaml
   # CI step: keep Flutter API client in sync
   - run: pnpm --filter @{{PROJECT_SLUG}}/api openapi:generate
   - run: cd apps/mobile_flutter && dart run openapi_generator generate
   ```

### Flutter-Specific Scripts in Root

Add convenience scripts to the root `package.json` (these bypass Turborepo):

```json
{
  "scripts": {
    "flutter:dev": "cd apps/mobile_flutter && flutter run",
    "flutter:build:ios": "cd apps/mobile_flutter && flutter build ios",
    "flutter:build:android": "cd apps/mobile_flutter && flutter build appbundle",
    "flutter:test": "cd apps/mobile_flutter && flutter test",
    "flutter:analyze": "cd apps/mobile_flutter && flutter analyze"
  }
}
```

---

## Common Pitfalls

### 1. Metro Cannot Resolve Monorepo Package

**Symptom:** `Unable to resolve module @{{PROJECT_SLUG}}/types from ...`

**Fix:** Ensure `metro.config.js` has:
- `watchFolders` including monorepo root
- `nodeModulesPaths` including both app and root `node_modules`
- `disableHierarchicalLookup: true`

Then clear the Metro cache: `npx expo start --clear`

### 2. pnpm Hoisting Issues

**Symptom:** React Native cannot find a dependency that is installed in a nested package.

**Fix:** Add to root `.npmrc`:
```ini
# .npmrc
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=*@react-native*
```

Or use `shamefully-hoist=true` as a nuclear option (not recommended — masks real dependency issues).

### 3. Expo SDK Version Conflicts

**Symptom:** Multiple versions of `react`, `react-native`, or Expo modules in the dependency tree.

**Fix:** Add overrides in the root `package.json`:
```json
{
  "pnpm": {
    "overrides": {
      "react": "18.3.1",
      "react-native": "0.76.0"
    }
  }
}
```

### 4. Metro Watches Too Many Files

**Symptom:** Metro is slow to start, watching thousands of irrelevant files.

**Fix:** Add `blockList` to Metro config:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = exclusionList([
  // Ignore other apps' node_modules
  /apps\/web\/.*/,
  // Ignore Flutter if it exists
  /apps\/mobile_flutter\/.*/,
  // Ignore test fixtures
  /.*\/__fixtures__\/.*/,
]);
```

### 5. TypeScript Errors in Shared Packages

**Symptom:** Shared package compiles fine in web but throws errors in Metro.

**Cause:** The shared package uses a TypeScript feature or import that Metro's Babel transform does not support.

**Fix:** Ensure shared packages:
- Do not use `import.meta` (not supported in Metro)
- Do not use top-level `await`
- Do not import Node.js built-in modules
- Use `export type` for type-only exports (helps tree shaking)

### 6. EAS Build Fails with "Missing Dependency"

**Symptom:** Local build works, EAS Build fails because a dependency is not found.

**Fix:** EAS Build runs `pnpm install` from the root. Ensure:
- All workspace dependencies use `"workspace:*"` not relative paths
- The `pnpm-lock.yaml` is committed and up to date
- The `node` and `pnpm` versions in `eas.json` match your local versions

### 7. Babel Config Conflicts

**Symptom:** Syntax errors or unexpected behavior from shared packages.

**Fix:** The mobile app's `babel.config.js` must include the `babel-preset-expo` preset:
```javascript
// apps/mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
```

Do NOT add a separate Babel config in shared packages — Metro uses the app's Babel config for all files it processes.

---

## Verification Checklist

After completing integration:

- [ ] `pnpm install` from root resolves all dependencies
- [ ] `pnpm dev:mobile` starts Expo with no errors
- [ ] Shared types import: `import type { User } from "@{{PROJECT_SLUG}}/types"`
- [ ] Shared validators import: `import { loginSchema } from "@{{PROJECT_SLUG}}/validators"`
- [ ] Changing a shared package file triggers Metro hot reload
- [ ] `eas build --profile development --platform ios` succeeds
- [ ] `turbo build` builds all packages (mobile does not block web)
- [ ] `turbo test` runs tests in all packages including mobile
