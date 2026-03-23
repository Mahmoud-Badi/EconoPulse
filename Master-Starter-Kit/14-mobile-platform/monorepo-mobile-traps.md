# Monorepo + Mobile Integration Traps

> Every trap in this guide has been discovered the hard way. These are the errors you'll hit when adding React Native to a monorepo — with the exact error messages and fixes.

---

## Trap 1: Metro Bundler Caching Conflicts with Turborepo

### The Problem

Turborepo caches build outputs by hashing inputs. Metro has its own cache in a temp directory. These two caching systems don't know about each other, leading to:

- Turborepo says "cache hit, skip build" but Metro's cache is stale
- You change shared code, Turborepo detects the change, but Metro serves the old bundle
- CI builds pass with cached output that doesn't reflect actual changes

### Error Symptoms

```
Error: Unable to resolve module '@myapp/shared' from 'src/screens/Home.tsx'

# Or worse — no error, but the app runs OLD code from shared package
# You change shared/utils.ts, rebuild, and the change doesn't appear
```

### The Fix

**1. Tell Turborepo to never cache Metro bundler output:**

```json
// turbo.json
{
  "pipeline": {
    "mobile#start": {
      "cache": false,
      "persistent": true
    },
    "mobile#build:ios": {
      "dependsOn": ["shared#build"],
      "cache": false
    },
    "mobile#build:android": {
      "dependsOn": ["shared#build"],
      "cache": false
    }
  }
}
```

**2. Reset Metro cache in development scripts:**

```json
// apps/mobile/package.json
{
  "scripts": {
    "start": "react-native start --reset-cache",
    "start:clean": "watchman watch-del-all && react-native start --reset-cache"
  }
}
```

**3. Add Metro temp directories to .gitignore and Turborepo's global ignore:**

```
# .gitignore
**/metro-cache/
**/haste-map-*/
```

### When You'll Hit This

- After updating any shared package code
- After switching branches
- After pulling changes that touch shared dependencies
- In CI when build runs after a Turborepo cache restore

---

## Trap 2: pnpm Hoisting Issues with React Native

### The Problem

pnpm uses a content-addressable store with symlinks. React Native's Metro bundler does not follow symlinks correctly by default. Additionally, pnpm's strict dependency isolation causes "phantom dependency" issues where packages that worked with npm/yarn suddenly can't find their dependencies.

### Error Messages You'll See

```
Error: Unable to resolve module 'react-native-screens'
from 'node_modules/@react-navigation/native-stack/...'

# Or:
FAILURE: Build failed with an exception.
  > Could not resolve all files for configuration ':app:debugRuntimeClasspath'
  > Could not find react-native-vector-icons-xxx.aar

# Or:
error: Error: Unable to resolve module `@babel/runtime/helpers/interopRequireDefault`
```

### The Fix

**1. Configure pnpm hoisting for React Native compatibility:**

```yaml
# .npmrc (project root)
node-linker=hoisted
# OR if you want to keep strict mode for web packages:
public-hoist-pattern[]=*react-native*
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*expo*
public-hoist-pattern[]=@react-navigation/*
public-hoist-pattern[]=@react-native-community/*
```

**2. Configure Metro to resolve from the monorepo root:**

```javascript
// apps/mobile/metro.config.js
const path = require('path');
const { getDefaultConfig } = require('metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

module.exports = (async () => {
  const config = await getDefaultConfig(projectRoot);
  return {
    ...config,
    watchFolders: [monorepoRoot],
    resolver: {
      ...config.resolver,
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(monorepoRoot, 'node_modules'),
      ],
      // Block packages that should come from mobile's own node_modules
      blockList: [
        // Prevent loading react from root (version conflicts)
        new RegExp(`^${escape(monorepoRoot)}/node_modules/react/.*$`),
      ],
    },
  };
})();

function escape(str) {
  return str.replace(/[/\\]/g, '[/\\\\]');
}
```

**3. Pin React versions across the monorepo:**

```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "react": "18.2.0",
      "react-native": "0.73.x"
    }
  }
}
```

---

## Trap 3: Module Resolution Differences — Metro vs Webpack/Turbopack

### The Problem

Your shared package works perfectly in the web app (bundled by Webpack/Turbopack) but crashes in the mobile app (bundled by Metro). This happens because:

- Metro does not support `exports` field in package.json (as of Metro 0.80)
- Metro resolves `main` field, Webpack resolves `module` or `exports`
- Metro does not support barrel files well (re-exports cause circular dependency issues)
- Metro has a different algorithm for resolving `.js` vs `.ts` vs `.tsx` files

### Error Messages

```
error: Error: Unable to resolve module './utils' from 'packages/shared/src/index.ts'
# (Metro can't resolve because it's looking for utils.js, not utils.ts)

# Or:
TypeError: undefined is not an object (evaluating '_shared.formatDate')
# (Module resolved but exports are wrong due to exports field mismatch)
```

### The Fix

**1. Use `main` field for shared packages (not just `exports`):**

```json
// packages/shared/package.json
{
  "name": "@myapp/shared",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    }
  }
}
```

**2. Configure Metro to resolve TypeScript directly:**

```javascript
// metro.config.js
module.exports = {
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
  },
};
```

**3. Avoid barrel file re-exports in shared packages:**

```typescript
// BAD — causes circular dependency issues in Metro
// packages/shared/src/index.ts
export * from './utils';
export * from './types';
export * from './constants';

// GOOD — explicit named exports
// packages/shared/src/index.ts
export { formatDate, parseDate } from './utils/date';
export { validateEmail } from './utils/validation';
export type { User, Task } from './types';
```

---

## Trap 4: Platform-Specific Imports Gone Wrong

### The Problem

You have shared code that needs different implementations for web and mobile:

```
utils/
  storage.ts        ← default (web)
  storage.native.ts ← React Native
  storage.web.ts    ← explicit web
```

Metro resolves `.native.ts` → `.ts` (fallback). Webpack resolves `.web.ts` → `.ts` (fallback). When this isn't set up correctly, you get the wrong implementation on the wrong platform, or no resolution at all.

### Common Mistakes

**Mistake 1: Importing with extension**
```typescript
// WRONG — bypasses platform resolution
import { storage } from './storage.native';

// RIGHT — let the bundler resolve the platform
import { storage } from './storage';
```

**Mistake 2: Different export shapes between platform files**
```typescript
// storage.ts (web)
export const storage = { get: async (key) => localStorage.getItem(key) };

// storage.native.ts
export default { get: async (key) => AsyncStorage.getItem(key) };
// ❌ One uses named export, other uses default — import breaks on one platform
```

**Mistake 3: Tree-shaking pulling in platform-specific deps**
```typescript
// shared/index.ts
export { WebOnlyComponent } from './WebOnlyComponent'; // imports 'window', 'document'
// ❌ Metro tries to resolve this and fails because 'document' doesn't exist
```

### The Fix

- Always use identical export shapes across `.ts`, `.native.ts`, `.web.ts`
- Never import with platform extension explicitly
- Use `Platform.OS` for small differences, separate files for large differences
- For shared packages used by both web and mobile: never import browser-only or RN-only APIs at the top level

---

## Trap 5: Workspace Dependency Version Mismatches

### The Problem

```
packages/
  shared/       ← depends on react@18.2.0
  web-app/      ← depends on react@18.2.0
  mobile-app/   ← depends on react@18.2.0 (but RN peer dep wants 18.2.0 exactly)
```

Multiple copies of React loaded simultaneously causes the dreaded "Invalid hook call" error.

### Error Messages

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
# This means two copies of React are loaded

# Or:
Warning: React.createElement: type is invalid -- expected a string or a class/function but got: undefined
```

### The Fix

**1. Enforce single React version across monorepo:**

```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "react": "18.2.0",
      "react-dom": "18.2.0"
    }
  }
}

// If using yarn workspaces:
{
  "resolutions": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

**2. Add a check script to CI:**

```bash
#!/bin/bash
# scripts/check-react-versions.sh
REACT_VERSIONS=$(find . -name "package.json" -not -path "*/node_modules/*" \
  -exec grep -l '"react"' {} \; \
  | xargs grep '"react":' | grep -oP '\d+\.\d+\.\d+' | sort -u)

VERSION_COUNT=$(echo "$REACT_VERSIONS" | wc -l)
if [ "$VERSION_COUNT" -gt 1 ]; then
  echo "ERROR: Multiple React versions detected:"
  echo "$REACT_VERSIONS"
  exit 1
fi
```

**3. Shared packages should use `peerDependencies`, not `dependencies`:**

```json
// packages/shared/package.json
{
  "peerDependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "react": "18.2.0"
  }
}
```

---

## Trap 6: Build Order Dependencies

### The Problem

Your mobile app imports from `@myapp/shared`. If `shared` hasn't been built (compiled from TypeScript), Metro either:
- Can't find the module
- Finds source TypeScript but can't parse it (if not configured for TS)
- Finds stale compiled output from a previous build

### The Fix

**Option A: Point Metro at source TypeScript directly (recommended for dev):**

No build step needed for shared packages. Configure Metro to resolve and transpile TypeScript from source:

```javascript
// metro.config.js
const path = require('path');
const monorepoRoot = path.resolve(__dirname, '../..');

module.exports = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: true },
    }),
  },
};
```

**Option B: Build shared packages first (required for production builds):**

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    },
    "mobile#build:ios": {
      "dependsOn": ["shared#build"]
    }
  }
}
```

**Gotcha:** If using Option A for dev and Option B for production, test the production flow regularly. "Works in dev" !== "works in production build."

---

## Trap 7: CI/CD — Separate Mobile Build Pipelines

### The Problem

Mobile builds are fundamentally different from web builds:
- iOS builds require macOS runners (GitHub Actions: `runs-on: macos-latest`)
- Android builds need Java/Gradle and Android SDK
- Build times are 10-30 minutes (vs 1-2 minutes for web)
- Code signing and provisioning profiles add complexity
- You don't want to rebuild mobile on every web-only change

### CI Configuration Gotchas

**Gotcha 1: Running mobile builds on every PR**
```yaml
# BAD — builds mobile even for web-only changes (wastes 20 min + macOS runner costs)
on:
  pull_request:
    branches: [main]

# GOOD — only build mobile when relevant files change
on:
  pull_request:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - 'packages/shared/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
```

**Gotcha 2: Fastlane + monorepo working directory**
```yaml
# BAD — Fastlane can't find the Fastfile
- run: fastlane ios build

# GOOD — set working directory
- run: fastlane ios build
  working-directory: apps/mobile
  env:
    FASTLANE_XCODEBUILD_SETTINGS_RETRIES: 5  # Xcode can be flaky
```

**Gotcha 3: node_modules caching for mobile CI**
```yaml
# Cache must include the monorepo root node_modules AND the mobile app's
- uses: actions/cache@v4
  with:
    path: |
      node_modules
      apps/mobile/node_modules
      ~/.gradle/caches
      ~/Library/Caches/CocoaPods
    key: mobile-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
```

**Gotcha 4: CocoaPods + monorepo**
```bash
# After installing npm dependencies, you MUST run pod install
cd apps/mobile/ios && pod install

# If pods fail with "Unable to find a specification":
# Delete Podfile.lock and re-run pod install
cd apps/mobile/ios && rm -f Podfile.lock && pod install --repo-update
```

---

## Trap 8: Specific Error Messages and Fixes

### Quick Reference Table

| Error | Cause | Fix |
|-------|-------|-----|
| `Unable to resolve module` from shared package | Metro can't find workspace package | Add monorepo root to `watchFolders` in metro.config.js |
| `Invalid hook call` | Multiple React copies loaded | Pin React version with `overrides`/`resolutions` |
| `Cannot read property 'call' of undefined` | Circular dependency in barrel exports | Replace `export *` with explicit named exports |
| `Invariant Violation: Native module cannot be null` | Native module not linked | `cd ios && pod install` or rebuild the app |
| `ENOSPC: System limit for number of file watchers reached` | Metro + Turbo both watching files | Increase limit: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf` |
| `SHA-1 for file is not computed` | Metro cache corruption | `npx react-native start --reset-cache` |
| `jest-haste-map: Haste module naming collision` | Duplicate package names in monorepo | Ensure every package.json has a unique `name` field |
| `TypeError: Cannot read properties of undefined (reading 'transformFile')` | Metro config incompatibility | Check metro.config.js returns a valid config (not a Promise without await) |
| `Error: EMFILE: too many open files` | Monorepo has too many files for Metro to watch | Add `blockList` patterns for directories Metro shouldn't watch (e.g., web app, docs) |

### Nuclear Reset Script

When nothing works and you need to start clean:

```bash
#!/bin/bash
# scripts/nuclear-reset.sh
echo "Cleaning all build artifacts and caches..."

# Node modules
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null

# Package manager caches
rm -rf .turbo
pnpm store prune

# Metro cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
watchman watch-del-all 2>/dev/null

# iOS
cd apps/mobile/ios && rm -rf Pods Podfile.lock build DerivedData && cd ../../..

# Android
cd apps/mobile/android && ./gradlew clean 2>/dev/null && cd ../../..

# Reinstall
pnpm install
cd apps/mobile/ios && pod install && cd ../../..

echo "Reset complete. Try building again."
```

---

## Prevention Checklist

Before adding mobile to your monorepo, verify:

- [ ] Metro config points `watchFolders` at monorepo root
- [ ] Metro config lists monorepo root `node_modules` in `nodeModulesPaths`
- [ ] Metro `blockList` excludes web app directories and other non-mobile packages
- [ ] React version pinned identically across all packages
- [ ] Shared packages use `peerDependencies` for React, not `dependencies`
- [ ] pnpm `.npmrc` has correct `public-hoist-pattern` entries
- [ ] Shared packages export explicitly (no `export *` barrel files)
- [ ] Platform-specific files (`.native.ts`, `.web.ts`) have identical export shapes
- [ ] CI pipeline only triggers mobile build on relevant file changes
- [ ] `turbo.json` sets `cache: false` for Metro dev server
- [ ] Nuclear reset script exists and is documented
- [ ] Every team member has tested a clean build from scratch
