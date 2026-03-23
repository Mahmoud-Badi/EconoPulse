# Type Checking

## What It Is

Type checking is your first line of defense against an entire category of runtime errors — the ones where a value is not what you thought it was. TypeScript's compiler analyzes every assignment, function call, and property access in your codebase and proves, at compile time, that the types are consistent. When configured with strict options, it catches null dereferencing, missing object properties, incorrect function signatures, and API response shape mismatches before any code runs. Unlike tests that verify individual scenarios, the type checker verifies all possible code paths simultaneously. A clean `tsc --noEmit` means your code is structurally sound; a single type error means there is a path where your code could crash at runtime.

## What It Catches

- **Null/undefined access on optional data** — Accessing `user.profile.avatar.url` when `profile` could be `null`, causing "Cannot read property 'avatar' of null" in production
- **API response shape mismatches** — Backend returns `{ data: { items: [] } }` but frontend expects `{ items: [] }`, and without types the code silently reads `undefined` for weeks until someone notices the empty list
- **Enum widening to string** — A function accepts `status: "active" | "inactive"` but the caller passes `status: someVariable` where `someVariable` is typed as `string`, allowing any garbage value through
- **Missing properties after refactor** — Renaming `user.firstName` to `user.first_name` in the type but not updating all 47 call sites — the compiler finds every one instantly
- **Incorrect function return types** — A function that sometimes returns `undefined` (implicit return from an early-exit branch) when the caller expects it always returns a value
- **Index access on arrays/objects without bounds checking** — `const item = items[index]` is typed as `T` but is actually `T | undefined` when the index is out of bounds — `noUncheckedIndexedAccess` catches this
- **Optional property confusion** — `{ name?: string }` means the property might not exist, but code treats it as always-present and passes it to a function requiring `string`
- **Incorrect discriminated union handling** — A switch on `event.type` that handles `"click"` and `"keydown"` but not `"focus"`, silently falling through to `default` instead of flagging the missing case
- **Third-party library version drift** — Upgrading a library changes a function signature from `(options: Config)` to `(options: Config, context?: Context)` and all callers that spread arguments break

## When It's Required

Type checking is required for **every TypeScript project, no exceptions**. It runs:

- **On every file save** — Via the IDE's built-in TypeScript language server (immediate feedback)
- **On every commit** — Via a pre-commit hook (`lint-staged` running `tsc --noEmit`)
- **On every PR** — Via CI, blocking merge if there are any type errors
- **On every build** — Via the build tool (Next.js, Vite) which runs `tsc` as part of compilation

If your project uses JavaScript, type checking still applies — use JSDoc annotations with `// @ts-check` or migrate incrementally with `allowJs: true` and `checkJs: true`.

**There is no "we'll add types later" — types are the foundation everything else builds on.**

## Setup Guide

### Single-package project (Next.js / Vite)

`tsconfig.json` at project root:

```jsonc
{
  "compilerOptions": {
    // Strict mode — non-negotiable
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,

    // Module resolution
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,

    // Output
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "noEmit": true,
    "skipLibCheck": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "*.config.ts"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### Monorepo setup (Turborepo / pnpm workspaces)

Root `tsconfig.base.json` with shared compiler options:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "target": "ES2022",
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

Each package extends it:

```jsonc
// packages/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@api/*": ["./src/*"] }
  },
  "include": ["src/**/*.ts"],
  "references": [{ "path": "../shared" }]
}
```

Run all packages: `turbo typecheck` or `pnpm -r typecheck`

### Package.json scripts

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "typecheck:watch": "tsc --noEmit --watch"
  }
}
```

### Pre-commit hook (with lint-staged)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "bash -c 'tsc --noEmit'"
    ]
  }
}
```

Note: `tsc` does not accept individual file paths with project references — the lint-staged command runs the full project check. This is intentional. A change in one file can cause type errors in another.

## Template

### Strict type patterns for common scenarios

```ts
// ---- API Response Typing ----
// WRONG: trusting the API response shape
const data = await fetch('/api/users').then(r => r.json()); // type: any

// RIGHT: validate at the boundary with Zod
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'member', 'viewer']),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new ApiError(response.status);
  const data: unknown = await response.json();
  return UserSchema.parse(data); // throws ZodError if shape is wrong
}


// ---- Safe index access (with noUncheckedIndexedAccess) ----
// With the flag enabled, items[0] is T | undefined
const items: string[] = ['a', 'b', 'c'];

// WRONG: const first = items[0].toUpperCase(); // Error: Object is possibly 'undefined'

// RIGHT:
const first = items[0];
if (first !== undefined) {
  console.log(first.toUpperCase()); // safe
}

// Or with non-null assertion ONLY when you have a guarantee:
const definitelyExists = items[0]!; // use sparingly, document why


// ---- Discriminated unions for state machines ----
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataView data={state.data} />; // TypeScript narrows: data exists
    case 'error':
      return <ErrorBanner error={state.error} />; // TypeScript narrows: error exists
    // No default needed — TypeScript ensures all cases are handled
    // Adding a new status to the union will cause a compile error here
  }
}


// ---- exactOptionalPropertyTypes in action ----
interface Config {
  theme?: 'light' | 'dark'; // optional — might not be present
}

// WRONG with exactOptionalPropertyTypes:
// const config: Config = { theme: undefined }; // Error! undefined is not 'light' | 'dark'

// RIGHT:
const config1: Config = {}; // omit the property entirely
const config2: Config = { theme: 'dark' }; // or provide a valid value


// ---- Branded types for domain safety ----
type UserId = string & { readonly __brand: 'UserId' };
type TeamId = string & { readonly __brand: 'TeamId' };

function createUserId(id: string): UserId { return id as UserId; }
function createTeamId(id: string): TeamId { return id as TeamId; }

function getUser(id: UserId) { /* ... */ }
function getTeam(id: TeamId) { /* ... */ }

const userId = createUserId('usr_123');
const teamId = createTeamId('team_456');

getUser(userId); // OK
// getUser(teamId); // Error! TeamId is not assignable to UserId
```

### CI configuration

```yaml
# .github/workflows/typecheck.yml
name: Type Check
on: [pull_request]
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
```

## Common Pitfalls

### 1. Using `any` to silence errors instead of fixing them

Every `any` is a hole in your type safety. Once a value is `any`, the type checker stops tracking it and all downstream usage is unchecked. If you are reaching for `any`, you need `unknown` (which forces you to narrow the type before using it) or a proper generic. Track `any` count with the `@typescript-eslint/no-explicit-any` lint rule set to `error`, not `warn`.

### 2. Forgetting that `noUncheckedIndexedAccess` changes array access semantics

After enabling this flag, `array[0]` returns `T | undefined` instead of `T`. This will surface dozens or hundreds of errors in an existing codebase. Fix them in batches — start with the most critical paths (payment, auth, data persistence) and work outward. Do not disable the flag to avoid the work.

### 3. Not typing API boundaries

The most dangerous place in your app is where external data enters — API responses, URL params, form submissions, localStorage reads. If you type these as their expected shape without runtime validation, you have `any` with extra steps. Use Zod, Valibot, or ArkType at every boundary.

### 4. Overly permissive `skipLibCheck`

`skipLibCheck: true` tells TypeScript to skip checking `.d.ts` files from `node_modules`. This is almost always the right setting for build performance, but it means type errors in library definitions (or your own `.d.ts` files) will be invisible. If you write custom `.d.ts` files, validate them separately.

### 5. Inconsistent tsconfig across packages in a monorepo

If `packages/api` has `strict: true` but `packages/shared` does not, you have a false sense of safety. The shared package can export loosely typed values that the strict package consumes without complaint (the types look correct because the source was not strictly checked). Always extend from a single `tsconfig.base.json` with strict mode enabled.

### 6. Ignoring `exactOptionalPropertyTypes` because it is "too strict"

This flag distinguishes between "property is missing" and "property is explicitly `undefined`". Without it, code that sets `{ theme: undefined }` compiles fine even though the intent was to omit the property. This matters for APIs and configurations where `undefined` and "not present" have different semantics (e.g., a PATCH request where `undefined` means "don't change" vs. missing means "don't change" vs. `null` means "clear it").

## Proof Artifact

The enforcement system accepts the following as evidence that type checking passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Zero-error CLI output** | `pnpm typecheck 2>&1` (should output nothing or "Found 0 errors") | No type errors in the entire project |
| **CI status check** | GitHub Actions / Vercel build log | Type checking passed in a clean environment |
| **TSC output file** | `tsc --noEmit 2>&1 > typecheck-results.txt` | Full compiler output (should be empty on success) |

**Minimum passing criteria:**

- Zero type errors across all packages (`tsc --noEmit` exits with code 0)
- `strict: true` is enabled in every `tsconfig.json` (no package opts out)
- `noUncheckedIndexedAccess: true` is enabled
- Zero `@ts-ignore` or `@ts-expect-error` comments without a linked issue (each suppression must reference a ticket explaining why it is needed and when it will be removed)
- `any` count is tracked and does not increase between PRs (enforce via `@typescript-eslint/no-explicit-any`)
