# Next.js Gotchas

Next.js is powerful but opinionated. The App Router in particular has several non-obvious behaviors that will trip you up.

---

## Next.js 16: proxy.ts Replaces middleware.ts

```typescript
// WRONG — Next.js 16 does not use middleware.ts
// middleware.ts
export function middleware(request) { /* ... */ }

// CORRECT — Next.js 16 uses proxy.ts
// proxy.ts
export function proxy(request) { /* ... */ }
```

**Symptom:** Your middleware code does not execute. No errors — it just does not run.
**Root cause:** Next.js 16 changed the API. The file must be named `proxy.ts` and export a named `proxy` function (not `middleware`).
**Fix:** Rename `middleware.ts` to `proxy.ts` and rename the export from `middleware` to `proxy`.

---

## Turbopack: CSS Source Hint for tw-animate-css

When using Turbopack (Next.js dev server default), tw-animate-css may not load correctly without a source hint.

```css
/* globals.css — add source comment for Turbopack */
/* @source "../../../node_modules/tw-animate-css"; */
@import "tw-animate-css";
```

**Symptom:** Animations do not work in development but work in production build.
**Fix:** Add the `@source` comment hint for Turbopack to resolve the CSS module.

---

## lucide-react Must Be a Direct Dependency

In a monorepo, `lucide-react` must be a direct dependency of `apps/web`, not just re-exported from `packages/ui`.

```jsonc
// apps/web/package.json
{
  "dependencies": {
    "lucide-react": "^0.400.0"   // MUST be here, not just in packages/ui
  }
}
```

**Symptom:** Icons render as empty space or throw "module not found" in production build.
**Root cause:** Tree-shaking removes the transitive dependency. Direct dependency ensures the icons are bundled.
**Fix:** Add `lucide-react` to `apps/web/package.json` dependencies.

---

## shadcn Monorepo: Dual components.json

In a monorepo, shadcn needs `components.json` in BOTH `packages/ui` AND `apps/web`.

```
packages/ui/components.json      # For adding components: npx shadcn@latest add button
apps/web/components.json         # For Next.js to resolve component paths
```

**Symptom:** `npx shadcn@latest add` fails or puts components in the wrong location.
**Fix:** Create `components.json` in both locations with appropriate paths.

---

## App Router: loading.tsx and error.tsx Per Route

Every route segment that fetches data should have its own `loading.tsx` and `error.tsx`:

```
app/(dashboard)/trips/
  page.tsx          # The page
  loading.tsx       # Shows while page.tsx is loading (Suspense boundary)
  error.tsx         # Shows if page.tsx throws (Error boundary)
  [id]/
    page.tsx
    loading.tsx     # Each nested segment needs its own
    error.tsx
```

**Symptom:** White flash while data loads (no loading skeleton). Or: entire page crashes instead of showing error UI for one section.
**Fix:** Add `loading.tsx` and `error.tsx` to every route segment. The loading file must export a default component (can be a skeleton).

---

## Server Components vs Client Components

### Server Components (Default)

```typescript
// app/(dashboard)/trips/page.tsx
// This is a Server Component by default (no "use client")
import { db } from "@{project}/db";

export default async function TripsPage() {
  const trips = await db.query.trips.findMany();  // Direct DB access
  return <TripTable trips={trips} />;
}
```

**Cannot use:** hooks (`useState`, `useEffect`), browser APIs (`window`, `document`), event handlers (`onClick`).

### Client Components

```typescript
// components/trip-filter.tsx
"use client";  // MUST be the first line

import { useState } from "react";

export function TripFilter() {
  const [status, setStatus] = useState("all");
  return <select onChange={(e) => setStatus(e.target.value)}>...</select>;
}
```

**Must add `"use client"`** when using: hooks, state, effects, browser APIs, event handlers, context providers.

### The Boundary Rule

A Server Component can import and render a Client Component. A Client Component CANNOT import a Server Component (but can accept one as `children` prop).

```typescript
// CORRECT — Server Component renders Client Component
// app/page.tsx (server)
import { TripFilter } from "@/components/trip-filter";  // client
export default function Page() {
  return <TripFilter />;  // OK
}

// WRONG — Client Component imports Server Component
// components/trip-filter.tsx ("use client")
import { ServerOnlyThing } from "@/components/server-thing";  // ERROR
```

---

## API Routes: Route Handlers, Not Pages API

In the App Router, API endpoints use Route Handlers (`route.ts`), not the Pages Router API Routes (`pages/api/`).

```typescript
// CORRECT — App Router
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok" });
}

// WRONG — Pages Router (deprecated in App Router projects)
// pages/api/health.ts
export default function handler(req, res) { /* ... */ }
```

---

## Dynamic Routes: Params Are Async in Next.js 15+

```typescript
// Next.js 15+: params is a Promise
export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // use id
}

// Next.js 14 and earlier: params was synchronous
export default function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
}
```

**Symptom:** "params.id is undefined" or "Cannot read property 'id' of [object Promise]".
**Fix:** Await the params in Next.js 15+.

---

## Image Optimization

```typescript
// CORRECT — use next/image for optimization
import Image from "next/image";
<Image src="/logo.png" width={200} height={50} alt="Logo" />

// WRONG — raw img tag, no optimization
<img src="/logo.png" alt="Logo" />
```

**Gotcha:** External images require `remotePatterns` in `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};
```

---

## Environment Variables in Client Code

```typescript
// WRONG — server-only variable, will be undefined in browser
const apiKey = process.env.STRIPE_SECRET_KEY;

// CORRECT — public variable, available in browser
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

**Rule:** Only `NEXT_PUBLIC_*` variables are available in client-side code. Server-only variables are stripped from the client bundle at build time.

**Gotcha:** Public variables are replaced at BUILD TIME, not at runtime. Changing a `NEXT_PUBLIC_*` variable in Vercel requires a new deployment.
