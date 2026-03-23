# TypeScript Gotchas

TypeScript catches bugs at compile time — but only if configured correctly. These gotchas are about configuration traps and type system edge cases.

---

## noUncheckedIndexedAccess

When enabled in tsconfig.json, bracket-notation access returns `T | undefined` instead of `T`.

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true
  }
}
```

```typescript
const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

// Without noUncheckedIndexedAccess:
const label = statusLabels["ACTIVE"];  // type: string

// With noUncheckedIndexedAccess:
const label = statusLabels["ACTIVE"];  // type: string | undefined
```

**When you KNOW the key exists:**
```typescript
// Use non-null assertion
const label = statusLabels["ACTIVE"]!;  // type: string

// Or use nullish coalescing for safety
const label = statusLabels["ACTIVE"] ?? "Unknown";  // type: string
```

**Should you enable it?** Yes. Always. The false positives (needing `!` on safe lookups) are a small price for catching real bugs (accessing keys that might not exist).

---

## Enum String Literals: as const

TypeScript widens string literals in arrays. This breaks typed enum columns in Drizzle.

```typescript
// WRONG — TypeScript infers string[] instead of ("ACTIVE" | "INACTIVE")[]
const statuses = ["ACTIVE", "INACTIVE"];
// type: string[]

// CORRECT — as const preserves literal types
const statuses = ["ACTIVE", "INACTIVE"] as const;
// type: readonly ["ACTIVE", "INACTIVE"]

// WRONG — insert array with enum column
await db.insert(trips).values([
  { status: "ACTIVE" },     // TS2769: No overload matches
  { status: "INACTIVE" },
]);

// CORRECT — explicit const assertion
await db.insert(trips).values([
  { status: "ACTIVE" as const },
  { status: "INACTIVE" as const },
]);
```

**Symptom:** TS2769 error: "No overload matches this call" when inserting arrays with enum columns.
**Root cause:** TypeScript widens `"ACTIVE"` to `string` in array context, which does not match the enum type `"ACTIVE" | "INACTIVE" | "COMPLETED"`.
**Fix:** Add `as const` to the literal value, or type the entire array explicitly.

---

## moduleResolution: "bundler"

For Next.js with Turbopack, use `"bundler"` module resolution.

```jsonc
{
  "compilerOptions": {
    "moduleResolution": "bundler"    // Required for Turbopack
    // NOT "node" or "node16" or "nodenext"
  }
}
```

**Symptom:** Import resolution failures, especially for packages that use `exports` field in package.json.
**Fix:** Set `moduleResolution` to `"bundler"` in all tsconfig files in the monorepo.

---

## Package Main: Source Imports for Development

In a monorepo, internal packages can point `main` directly at TypeScript source for development:

```jsonc
// packages/api/package.json
{
  "name": "@{project}/api",
  "main": "./src/index.ts",     // Points to source, not compiled output
  "types": "./src/index.ts"
}
```

**Why:** No build step needed for internal packages during development. The consuming app (Next.js) compiles the TypeScript directly via Turbopack.

**Gotcha:** This only works when the consumer has a TypeScript-aware bundler. If you publish the package to npm, you need a proper build step with compiled JS output.

---

## paths: Configure for Monorepo Imports

```jsonc
// tsconfig.json (root)
{
  "compilerOptions": {
    "paths": {
      "@{project}/*": ["./packages/*/src"],
      "@/*": ["./apps/web/src/*"]
    }
  }
}
```

**Gotcha:** `paths` in tsconfig is for TypeScript resolution only. The bundler (Turbopack/webpack) may need separate alias configuration. In Next.js, the `@/` alias is configured automatically via `next.config.ts`.

---

## Strict Mode: Always Enable

```jsonc
{
  "compilerOptions": {
    "strict": true    // Enables ALL strict checks
  }
}
```

What `strict: true` enables:
- `strictNullChecks` — null/undefined are distinct types
- `strictFunctionTypes` — function parameter types are checked
- `strictBindCallApply` — bind/call/apply parameter types are checked
- `noImplicitAny` — no implicit `any` types allowed
- `noImplicitThis` — `this` must be typed
- `alwaysStrict` — emit `"use strict"` in JavaScript

**Rule:** Never disable strict mode. Every strict check exists because a real category of bugs motivated its creation.

---

## isolatedModules: Required for Bundlers

```jsonc
{
  "compilerOptions": {
    "isolatedModules": true    // Required for Turbopack, esbuild, SWC
  }
}
```

**What it prevents:**
```typescript
// WRONG with isolatedModules — const enum cannot be inlined across modules
const enum Direction {
  Up, Down, Left, Right
}

// CORRECT — use regular enum
enum Direction {
  Up, Down, Left, Right
}

// WRONG with isolatedModules — re-exporting a type as a value
export { MyType } from "./types";

// CORRECT — use type-only export
export type { MyType } from "./types";
```

**Symptom:** Compilation errors about "cannot be compiled under isolatedModules."
**Fix:** Use regular enums (not const enums) and type-only imports/exports.

---

## skipLibCheck: Speed vs Safety

```jsonc
{
  "compilerOptions": {
    "skipLibCheck": true    // Skips type checking of .d.ts files in node_modules
  }
}
```

**Should you enable it?** Yes, for most projects. It significantly speeds up type checking (sometimes 2-3x faster) and avoids false positives from conflicting type definitions in node_modules.

**When to disable it:** When you are writing a library that will be consumed by others and you need to verify your .d.ts output is correct.

---

## Generic Type Inference in React Components

```typescript
// WRONG — TypeScript cannot infer T from JSX props alone
function DataTable<T>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  // ...
}

// Usage — TypeScript may not infer T correctly
<DataTable data={trips} columns={tripColumns} />
// Error: Type 'Trip[]' is not assignable to type 'unknown[]'

// CORRECT — use explicit generic parameter
<DataTable<Trip> data={trips} columns={tripColumns} />

// OR — use a factory function that captures the type
function createColumns<T>(columns: Column<T>[]): Column<T>[] {
  return columns;
}
const tripColumns = createColumns<Trip>([/* ... */]);
```

---

## Discriminated Unions for API Responses

```typescript
// WRONG — both data and error can be undefined
type ApiResponse = {
  data?: Trip[];
  error?: string;
  isLoading: boolean;
};

// CORRECT — discriminated union makes impossible states impossible
type ApiResponse =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: Trip[] };

// TypeScript narrows the type automatically
function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case "loading":
      return <Skeleton />;
    case "error":
      return <Alert>{response.error}</Alert>;  // error is string, guaranteed
    case "success":
      return <Table data={response.data} />;   // data is Trip[], guaranteed
  }
}
```

---

## Type Assertion vs Type Guard

```typescript
// Type assertion (tells TypeScript "trust me") — use sparingly
const user = data as User;  // No runtime check

// Type guard (proves the type at runtime) — prefer this
function isUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "email" in data
  );
}

if (isUser(data)) {
  // TypeScript knows data is User here
  console.log(data.email);
}
```

**Rule:** Use type assertions (`as`) only when you have external proof the type is correct (e.g., Zod validation already ran). Use type guards for untrusted data.
