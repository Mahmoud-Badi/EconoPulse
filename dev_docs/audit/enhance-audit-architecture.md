# Audit: Architecture & Code Quality

> **App:** EconoPulse
> **Dimension:** E1-A
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 5/10 — Needs Work

---

## Round 1 Findings (Surface Scan)

**1. Directory structure and pattern:**

```
frontend/src/
  api/          → 1 file (client.ts) — centralized API client
  components/
    layout/     → 3 files (TopBar, Sidebar, StatusBar)
    panels/     → 9 files (one per dashboard section)
    shared/     → 5 files (reusable UI atoms)
  context/      → 1 file (ThemeContext)
  hooks/        → 7 files (one per data domain)
  types/        → 1 file (index.ts — all interfaces)
  App.tsx       → root component
  main.tsx      → entry point

backend/
  routes/       → 7 files (one per domain: stocks, crypto, forex, etc.)
  services/     → 4 files (one per external API provider)
  server.js     → Express app setup
```

Pattern: **layer-based on frontend, domain-based on backend**. The frontend uses a clean layered architecture (API client → hooks → panels → layout). The backend uses domain routing. Both are recognizable and navigable.

**2. Files exceeding 500 LOC:** None. Largest files are `types/index.ts` (~87 LOC), panel components (~150 LOC each), and backend routes (~85 LOC each). Codebase is appropriately sized.

**3. Separation of concerns:**
- Frontend: Clear — data fetching in hooks, rendering in panels, API calls in `api/client.ts`, types in `types/index.ts`. Excellent separation.
- Backend: Clear — routes handle HTTP concerns, services handle external API calls. No business logic leak.
- Gap: **No shared types between frontend and backend.** `frontend/src/types/index.ts` defines response shapes, but the backend has no types at all. Any backend change can silently break frontend expectations.

**4. TypeScript strictness:**
- Frontend `tsconfig.json`: `"strict": true` ✓ but `"noUnusedLocals": false` and `"noUnusedParameters": false` — two safety nets disabled. No ESLint config exists in the project (no `eslint.config.*`, no `.eslintrc.*`).
- Backend: **No TypeScript at all.** All 12 backend files are `.js` (CommonJS). Zero type safety on the server side.

**5. Average file size / god files:** Average ~60 LOC. No god files. `App.tsx` is only 48 LOC — impressively lean root component.

**6. Circular imports:** None detected. The dependency graph is acyclic: `main.tsx → App.tsx → panels → hooks → api/client.ts → types`. Clean.

---

## Round 2 Findings (Deep Dive)

**7. Five most complex files reviewed:**

- **`backend/routes/stocks.js`** (84 LOC): Handles `/quotes` and `/indices`. Each creates its own `NodeCache` instance (`new NodeCache({ stdTTL: 60 })`). This pattern is duplicated across all 7 route files — **7 separate NodeCache instances** that cannot share or invalidate each other. The `STOCK_SYMBOLS` and `INDEX_MAP` constants are hardcoded in the route file rather than in a config/constants module.

- **`frontend/src/api/client.ts`** (44 LOC): All 13 API endpoint wrappers in one file. Clean, well-typed with generics (`ApiResponse<T>`). High quality. The only issue: a single 10s timeout for all endpoints — slow macro/crypto calls may time out under load while fast endpoints still have 10 seconds.

- **`frontend/src/types/index.ts`** (87 LOC): Single source of truth for all frontend types. Clean. Notably, `MacroDataPoint.value` is typed as `string` (not `number`) — likely because Alpha Vantage returns numeric strings. This leaks API-specific format choices into the shared type system.

- **`backend/services/finnhubService.js`** (55 LOC): Flat functions calling Finnhub with axios. No TypeScript, no input validation, no retry logic, no circuit breaker. If Finnhub returns an unexpected shape, the route handler will crash and propagate a 500 error.

- **`frontend/src/App.tsx`** (48 LOC): Exemplary. Simple panel registry pattern (`Record<Section, React.ComponentType>`), clean ThemeProvider wrapper, single layout composition. High quality — protect list candidate.

**8. Architectural consistency:** The frontend is architecturally consistent — every domain follows the same pattern (hook → panel → shared component). The backend follows a consistent route/service split but lacks consistency in caching (every route reinvents the cache setup).

**9. Duplicated patterns to abstract:**
- **NodeCache instantiation**: All 7 route files contain `const cache = new NodeCache({ stdTTL: 60 })`. Should be a single shared cache module: `backend/utils/cache.js`.
- **Cache-or-fetch pattern**: Every route endpoint duplicates: `const cached = cache.get(key); if (cached) return res.json({ cached: true, data: cached }); /* fetch */ cache.set(key, data); return res.json({ cached: false, data: data })`. This 8-line pattern appears in every single endpoint (~14 times across the codebase).
- **Error response shape**: `res.status(500).json({ error: true, message: error.message })` in routes vs. the global error handler using `res.status(err.status || 500).json({ error: err.message })`. Two inconsistent error shapes.

**10. Folder naming:** Consistent and predictable. `panels/`, `hooks/`, `shared/`, `context/`, `api/` are all self-explanatory. Backend `routes/` and `services/` are clear. Navigation is intuitive.

**11. Dead code / commented-out code:** None found. Codebase is clean of debris.

**12. Shared logic management:** Frontend has `components/shared/` for UI atoms — well-organized. Backend has no `utils/` directory — the repeated caching pattern and error handling have nowhere to live, leading to the duplication noted above.

---

## Recommendations

Ordered by priority:

1. **[P0]** Rotate and replace real API keys in `backend/.env.example` with placeholder strings (e.g., `your_finnhub_key_here`) — `backend/.env.example` — Real credentials committed to public GitHub repo is a live security incident; see E1-D audit for full details.

2. **[P1]** Convert backend to TypeScript — `backend/*.js`, `backend/routes/*.js`, `backend/services/*.js` — The entire backend is untyped plain JS. Adding a `tsconfig.json` + `ts-node`/`tsx` dev dependency and migrating files to `.ts` eliminates a category of silent type mismatch bugs and signals TypeScript discipline to interviewers.

3. **[P1]** Create `backend/utils/cache.ts` singleton and `backend/utils/cacheOrFetch.ts` helper — `backend/routes/*.js` — Eliminates the 7-instance NodeCache duplication and the 14-copy cache-or-fetch pattern. One change to TTL config propagates everywhere.

4. **[P1]** Add ESLint + Prettier configs — root / `frontend/` — No linting exists at all. `noUnusedLocals: false` allows dead code to accumulate. Adding `@typescript-eslint` rules with `noUnusedLocals: error` hardens code quality.

5. **[P2]** Create `shared/types/` package or a top-level `types/` directory for shared API contracts — `frontend/src/types/index.ts` → `shared/` — Currently the backend has no types and the frontend defines response shapes unilaterally. When the backend is converted to TS, types should be shared, not duplicated.

6. **[P2]** Extract `STOCK_SYMBOLS`, `INDEX_MAP`, and other hardcoded constants from route files into `backend/config/symbols.ts` — improves configurability for watchlist feature.

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `frontend/src/App.tsx` | 9/10 | Minimal, clean panel-registry pattern. Do not add complexity here. |
| `frontend/src/api/client.ts` | 8/10 | Clean typed API client with consistent `ApiResponse<T>` pattern. Extend, don't rewrite. |
| `frontend/src/types/index.ts` | 8/10 | Well-organized type definitions. Extend with new types; don't restructure. |
| `frontend/src/hooks/useStocks.ts` | 8/10 | Exemplary hook pattern — TanStack Query with correct staleTime. All hooks follow this pattern. |

---

## Summary

The frontend architecture is surprisingly strong for a solo project: clean layered separation, consistent hook/panel/type pattern, lean component sizes, and a well-typed API client. The backend is the architectural liability — 12 JavaScript files with no types, repeated caching boilerplate in every route, and no shared utilities. The top priority is backend TypeScript migration (a T1 item) and extracting the cache singleton (quick win). The frontend architecture should be protected and extended, not changed.
