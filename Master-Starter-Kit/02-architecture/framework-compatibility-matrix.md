# Framework Compatibility Matrix — {{PROJECT_NAME}}

> **Purpose:** The Master Kit's architectural decisions are framework-agnostic, but the implementation details change significantly between frameworks. This matrix maps each architectural concern to concrete library/tool recommendations per framework, so you're never guessing.

**Selected Framework:** {{FRAMEWORK}}
**Selected Meta-Framework:** {{META_FRAMEWORK}}

---

## 1. Compatibility Matrix

### API Layer

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Type-safe internal API** | tRPC + React Query | tRPC + @tanstack/vue-query | tRPC + @tanstack/svelte-query | tRPC (in API routes, consumed by islands) | Loaders/Actions (built-in, no extra library) |
| **REST API** | Next.js Route Handlers (`app/api/`) | Nuxt Server Routes (`server/api/`) | SvelteKit API routes (`+server.ts`) | Astro API routes (`src/pages/api/`) | Resource Routes (`.ts` files without default export) |
| **GraphQL** | Apollo Client or urql + Yoga/Apollo Server | Apollo Client + Yoga/Apollo Server | urql or Houdini (Svelte-native) | Any client in islands | Apollo Client + Yoga |
| **Server Functions** | Server Actions (Next.js 14+, built-in) | Nuxt server utils (`server/utils/`) | SvelteKit form actions (`+page.server.ts`) | Astro Actions (experimental) | Actions (built-in, primary pattern) |
| **Gotcha** | Server Actions serialize everything — no Dates, Maps, or Sets. Use `superjson` if needed. | Nuxt's `useFetch` and `$fetch` have different caching behaviors — read the docs carefully. | SvelteKit form actions don't support JSON responses by default — use `+server.ts` for JSON APIs. | Astro is MPA-first — API routes are for data, not SPA-style interactions. | Remix loaders run on every navigation — cache aggressively or you'll hit your DB hard. |

### State Management

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Server state** | TanStack Query (React Query) | TanStack Query (Vue Query) or Pinia + fetch | TanStack Query (Svelte Query) or built-in `load` | Nanostores (shared across frameworks) | Built-in loaders (no extra library needed) |
| **Client state (simple)** | Zustand (small, fast) or Jotai (atomic) | Pinia (official, Vuex successor) | Svelte stores (`writable`, `derived`) — built-in | Nanostores (framework-agnostic) | Zustand or Jotai (same as React) |
| **Client state (complex)** | Zustand with slices or XState | Pinia with plugins | Svelte stores compose naturally — rarely need more | N/A (Astro minimal client state) | Zustand or XState |
| **Form state** | React Hook Form or Conform | VeeValidate or FormKit | Superforms (SvelteKit-native, excellent) | N/A (forms submit to API routes) | Conform (built for Remix) |
| **URL state** | nuqs (type-safe URL state) | vue-router query params | SvelteKit `$page.url.searchParams` | Vanilla URL params | URLSearchParams in loaders (built-in) |
| **Gotcha** | Don't mix React Query and global state (Zustand) for the same data. Pick one source of truth per piece of state. | Pinia stores are singletons in SSR — be careful with user-specific state leaking between requests. | Svelte stores are simple but don't persist across page navigations by default — use `$page` data from `load`. | Astro islands are isolated — state doesn't naturally share between them. Use Nanostores. | Remix discourages client state — the URL IS your state. Fight the urge to add Zustand for things the URL handles. |

### Authentication

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Auth library** | NextAuth.js (Auth.js) v5 or Lucia Auth | Nuxt Auth Utils or Lucia Auth | Lucia Auth (first-class SvelteKit support) | Lucia Auth or Auth.js | Remix Auth (Passport-style strategies) |
| **Session storage** | Database sessions (recommended) or JWT in httpOnly cookies | Database sessions or JWT in httpOnly cookies | Database sessions (Lucia default) | Database sessions | Database sessions |
| **OAuth providers** | Auth.js has 80+ built-in providers | Nuxt Auth Utils wraps Auth.js providers | Lucia + Arctic (OAuth helper) | Lucia + Arctic | Remix Auth strategies per provider |
| **Middleware auth check** | `middleware.ts` (Edge Runtime) | `server/middleware/` | `hooks.server.ts` | `middleware.ts` | Root loader pattern (not traditional middleware) |
| **Gotcha** | NextAuth v5 migration from v4 has breaking changes — check the migration guide. Edge middleware can't access the database directly — only JWT sessions work in Edge. | Nuxt's auth ecosystem is fragmented — sidebase/nuxt-auth, @auth/nuxt, custom solutions all exist. Pick one and commit. | Lucia Auth is excellent for SvelteKit but is low-level — you implement the auth flows yourself. No pre-built UI. | Astro middleware runs on every request including static pages — guard only API/protected routes. | Remix has no built-in auth middleware — use a root loader that checks auth and passes user to child routes via context. |

### Real-Time

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **WebSocket** | Socket.io or Ably/Pusher (managed) | Socket.io or Ably/Pusher | Socket.io or SvelteKit + custom WebSocket handler | Not well-suited (MPA architecture) | Socket.io or Ably/Pusher (outside Remix request cycle) |
| **Server-Sent Events** | Route Handler with `ReadableStream` | Nuxt Server Route with `eventStream` | SvelteKit `+server.ts` with `ReadableStream` | API route with `ReadableStream` | Resource route with `ReadableStream` |
| **Supabase Realtime** | `@supabase/supabase-js` + React hooks | `@supabase/supabase-js` + Vue composables | `@supabase/supabase-js` + Svelte stores | `@supabase/supabase-js` in islands | `@supabase/supabase-js` + client-side subscription |
| **Gotcha** | Next.js serverless functions time out — WebSocket connections need a persistent server (Railway, Fly.io) or a managed service (Pusher, Ably). Vercel does NOT support WebSockets. | Same serverless limitation. Nuxt on Vercel/Netlify needs managed WebSocket services. | SvelteKit can handle WebSockets natively when self-hosted (Node adapter). On serverless, use managed services. | Astro is MPA — realtime requires client-side islands. Architecture mismatch for realtime-heavy apps. | Same as Next.js — serverless doesn't support persistent connections. Use managed services. |

### Rendering Strategy

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **SSR** | Default in App Router | Default (universal rendering) | Default with `+page.server.ts` | Opt-in per page (`output: 'server'`) | Always SSR (primary pattern) |
| **SSG** | `generateStaticParams` + `force-static` | `routeRules: { '/blog/**': { prerender: true } }` | `export const prerender = true` per page | Default mode (MPA static) | Not supported natively (use `headers` for CDN caching) |
| **ISR** | `revalidate` in fetch options or route segment config | `routeRules: { '/blog/**': { isr: 3600 } }` | Not built-in (use CDN cache headers) | Not built-in (use CDN cache headers) | Not built-in (use `Cache-Control` headers) |
| **CSR/SPA** | `'use client'` components, SPA-like with `react-router` | `ssr: false` in nuxt.config or per-page | `export const ssr = false` per page | Client-side islands with `client:*` directives | Not recommended (Remix is SSR-first) |
| **Streaming** | React Suspense + `loading.tsx` | `<Suspense>` component (Vue 3) | Streaming SSR in SvelteKit 2+ | Not applicable (static-first) | `defer` + `<Await>` components |
| **Gotcha** | RSC (React Server Components) are not the same as SSR. RSC renders on the server but sends a serialized component tree, not HTML. Understanding the difference matters for data fetching. | Nuxt's hybrid rendering (`routeRules`) is powerful but complex — mixing SSR, SSG, and ISR in one app can confuse caching. | SvelteKit's `load` functions run on both server and client during navigation — use `+page.server.ts` for server-only data. | Astro's islands architecture means JavaScript only loads for interactive components. Perfect for content sites, awkward for app-like UIs. | Remix loaders re-run on every client navigation — this is by design. Don't fight it — embrace the fresh data model. |

### Forms & Validation

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Form library** | React Hook Form or Conform | FormKit or VeeValidate | Superforms (SvelteKit-specific, excellent) | None needed (use native forms → API routes) | Conform (built for web platform forms) |
| **Schema validation** | Zod (de facto standard) | Zod or Valibot | Zod with Superforms | Zod | Zod |
| **Server validation** | Server Actions with Zod `.parse()` | Nuxt server routes with Zod | SvelteKit form actions with Superforms validation | API routes with Zod | Action functions with Zod |
| **Progressive enhancement** | Conform supports no-JS forms; React Hook Form does not | FormKit supports progressive enhancement | Superforms works without JavaScript by default | Native forms work without JS | Core design — Remix forms work without JavaScript |
| **Gotcha** | React Hook Form doesn't work with Server Actions — use Conform for Server Actions, RHF for client-only forms. | VeeValidate and FormKit solve the same problem differently — VeeValidate is composition-API-based, FormKit is schema-driven. Don't mix them. | Superforms is the clear winner for SvelteKit — it handles validation, loading states, errors, and progressive enhancement. Don't DIY. | Astro forms submit to API routes — keep it simple, no form library needed. | Remix forms are progressively enhanced by default — `<Form>` works without JS. Don't bypass this with `fetch` unless you have a reason. |

### Testing

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Unit testing** | Vitest + React Testing Library | Vitest + Vue Test Utils | Vitest + Svelte Testing Library | Vitest | Vitest + React Testing Library (for React components) |
| **Integration testing** | Vitest + MSW (mock API) | Vitest + MSW | Vitest + MSW | Vitest + MSW | Vitest + MSW or `createRemixStub` |
| **E2E testing** | Playwright (recommended) or Cypress | Playwright or Cypress | Playwright (recommended) | Playwright | Playwright or Cypress |
| **Component testing** | Storybook + Chromatic | Storybook + Chromatic or Histoire | Storybook or Histoire (Svelte-native) | Storybook (for framework islands) | Storybook |
| **Gotcha** | Testing Server Components and Server Actions requires special setup — use `next/jest` config or Playwright for full-stack tests. Unit tests can't easily test RSC. | Nuxt's `@nuxt/test-utils` provides `renderSuspended` for testing components that use Nuxt composables (`useAsyncData`, etc.). Don't skip it. | SvelteKit `load` functions are just functions — test them directly with Vitest. No need for E2E for data loading logic. | Astro components render to HTML strings — test with `astro.build` container API for unit tests. | Remix's `createRemixStub` is powerful for integration testing loaders, actions, and components together. Use it. |

### Deployment

| Concern | React / Next.js | Vue / Nuxt | Svelte / SvelteKit | Astro | Remix |
|---------|----------------|------------|-------------------|-------|-------|
| **Primary platform** | Vercel (native), also AWS Amplify, Netlify, Cloudflare, self-hosted | Vercel, Netlify, Cloudflare, Nuxt Hub, self-hosted | Vercel, Netlify, Cloudflare, self-hosted (Node adapter) | Vercel, Netlify, Cloudflare, AWS, self-hosted | Vercel, Fly.io, Cloudflare Workers, AWS, self-hosted |
| **Serverless** | Vercel Serverless Functions (default) | Nitro engine (multi-platform presets) | Adapter-based (`adapter-vercel`, `adapter-netlify`, etc.) | Adapter-based | Built-in adapters |
| **Edge runtime** | Middleware + Edge Runtime | Nitro with edge presets | `adapter-cloudflare` or `adapter-vercel` with edge | Cloudflare adapter | Cloudflare Workers adapter |
| **Docker** | `next build && next start` in Dockerfile | `nuxt build && node .output/server/index.mjs` | `node build/index.js` (Node adapter) | `node dist/server/entry.mjs` (Node adapter) | `remix-serve build/server/index.js` |
| **Gotcha** | Next.js on non-Vercel platforms loses some features (ISR, image optimization). Use `sharp` for images, `@vercel/blob` alternatives for storage. | Nuxt's Nitro engine makes deployment easy but masks platform differences. Test on your target platform, not just `nuxt dev`. | SvelteKit adapter choice affects what features work. `adapter-static` can't do SSR. `adapter-node` can't deploy to Cloudflare. Choose early. | Astro's static output is the simplest to deploy anywhere. SSR mode requires an adapter and limits platform choices. | Remix is the most platform-flexible. Same code runs on Node, Cloudflare Workers, Deno, and Bun with minimal changes. |

---

## 2. Conditional Template Sections

When using the Master Kit for a specific framework, activate the relevant conditional sections in templates.

### Syntax

```markdown
<!-- IF {{FRAMEWORK}} == "nextjs" -->
This content only applies to Next.js projects.
<!-- ENDIF -->

<!-- IF {{FRAMEWORK}} == "nuxt" -->
This content only applies to Nuxt projects.
<!-- ENDIF -->

<!-- IF {{FRAMEWORK}} == "sveltekit" -->
This content only applies to SvelteKit projects.
<!-- ENDIF -->

<!-- IF {{FRAMEWORK}} == "astro" -->
This content only applies to Astro projects.
<!-- ENDIF -->

<!-- IF {{FRAMEWORK}} == "remix" -->
This content only applies to Remix projects.
<!-- ENDIF -->
```

### Validation Rules

1. Every `<!-- IF -->` must have a matching `<!-- ENDIF -->`
2. No nesting of conditional sections (keep it flat for readability)
3. Content outside conditionals applies to ALL frameworks
4. When processing templates, remove conditional blocks for other frameworks entirely (don't leave empty HTML comments)

---

## 3. Migration Path Notes

If you need to change frameworks mid-project, here's what transfers and what doesn't.

### What Transfers Between Frameworks

| Asset | Portability | Notes |
|-------|------------|-------|
| **Zod schemas** | 100% portable | Validation logic is framework-agnostic |
| **Database schema + ORM** | 100% portable | Drizzle/Prisma schemas work everywhere |
| **Business logic (services)** | 100% portable | If you kept business logic out of framework-specific code |
| **API contracts** | 90% portable | tRPC works in all frameworks; REST is universal |
| **CSS / Tailwind** | 95% portable | Class names transfer; framework integration may differ |
| **UI components** | 0% portable | React ≠ Vue ≠ Svelte components. Must rewrite. |
| **Auth logic** | 50% portable | Auth strategy transfers; library integration is framework-specific |
| **Routing structure** | 0% portable | File-based routing differs between every framework |
| **Data fetching patterns** | 20% portable | `load` vs `getServerSideProps` vs `useAsyncData` — all different |

### Estimated Migration Effort

| From → To | Effort | Time (for a mid-size app, 50 routes) | Main Work |
|-----------|--------|--------------------------------------|-----------|
| Next.js → Remix | Medium | 4-6 weeks | Rewrite data fetching (loaders/actions), routing, remove RSC |
| Next.js → Nuxt | High | 6-10 weeks | Rewrite all components (React → Vue), routing, data fetching |
| Next.js → SvelteKit | High | 6-10 weeks | Rewrite all components (React → Svelte), routing, data fetching |
| Next.js → Astro | Medium-High | 4-8 weeks | Good for content-heavy sites. Complex for app-like features. |
| Any → Any | High | 6-12 weeks | Assume full rewrite of UI layer. Only business logic and data layer survive. |

> **Recommendation:** Don't plan for a framework migration. Choose your framework based on current needs and team skills. The architectural decisions in this kit (database design, API contracts, business logic separation) are designed to survive a framework change, but the UI layer never does.

---

## 4. Stack-Specific Gotchas

### Next.js

1. **App Router vs Pages Router:** Don't mix them in new projects. App Router is the future. Pages Router is legacy.
2. **Server Components can't use hooks or browser APIs.** Add `'use client'` at the top of components that need interactivity.
3. **Caching is aggressive and confusing.** Next.js caches fetch requests, full routes, and React Server Component payloads. When data seems stale, it's probably cached. Read the caching docs thoroughly.
4. **`next/image` optimization doesn't work on all platforms.** On non-Vercel platforms, configure a custom image loader or use `sharp`.
5. **Middleware runs at the Edge.** You can't use Node.js APIs (fs, crypto with some algorithms) or most npm packages in middleware.

### Vue / Nuxt

1. **Reactivity gotcha:** Adding new properties to reactive objects requires `reactive()` or `ref()`. Plain object property addition is not reactive in Vue 3.
2. **`useFetch` vs `$fetch`:** `useFetch` is a composable with caching and SSR deduplication. `$fetch` is a raw fetch wrapper. Use `useFetch` in components, `$fetch` in server routes and event handlers.
3. **Auto-imports can confuse IDE and new developers.** Nuxt auto-imports Vue APIs and composables. Explicitly importing is optional but recommended for clarity in larger codebases.
4. **Vue's template syntax:** `v-if` removes elements from DOM; `v-show` hides with CSS. Use `v-show` for frequently toggled elements, `v-if` for rarely changed conditions.

### Svelte / SvelteKit

1. **Svelte 5 runes (`$state`, `$derived`, `$effect`) replace stores for component state.** Stores still work but runes are the idiomatic Svelte 5 approach.
2. **SvelteKit `load` functions run on BOTH server and client** during client-side navigation. Use `+page.server.ts` for server-only data (database queries, secrets).
3. **No virtual DOM.** Svelte compiles to imperative DOM updates. This is faster but means React/Vue mental models don't fully apply.
4. **Smaller ecosystem.** Fewer UI component libraries than React/Vue. You'll build more from scratch or adapt headless libraries (Melt UI, Bits UI).

### Astro

1. **Islands architecture:** JavaScript only ships for interactive components. Static content is zero-JS HTML. This is excellent for content sites but awkward for app-like UIs.
2. **Client directives matter:** `client:load` (immediate), `client:idle` (after page load), `client:visible` (when scrolled into view), `client:media` (responsive). Choose the right one.
3. **You can use React, Vue, AND Svelte components in the same Astro project.** This is powerful for migration but confusing if overused. Pick one framework for interactive islands.
4. **Astro is not a SPA framework.** Page transitions cause full reloads by default. Use View Transitions API for SPA-like feel.

### Remix

1. **Remix loaders re-run on every client-side navigation.** This keeps data fresh but means your database gets hit on every page transition. Use HTTP caching headers.
2. **No built-in file-based API routes.** API endpoints are "resource routes" — regular route files without a default component export.
3. **Remix prefers web platform APIs.** `Request`, `Response`, `FormData`, `URLSearchParams` — if you know the web platform, you know Remix.
4. **Nested routing is central.** Every route is a layout that composes with parent/child routes. Design your route hierarchy carefully — refactoring it later is painful.
5. **Remix is merging into React Router v7.** Future versions may rebrand. The concepts stay the same.
