# Enhancement Backlog — EconoPulse

> **Date:** 2026-03-23
> **Composite score at intake:** 3.7/10
> **Total items:** 26 (7 Tier 1, 11 Tier 2, 8 Tier 3)
> **Estimated total effort:** 10–14 weeks (solo developer)

---

## How to Use This Backlog

1. **Tier 1 first.** Do not start new features until all Tier 1 items are resolved.
2. **Dependencies govern order.** Within each tier, complete items that other items depend on first. See the Dependency Map below.
3. **Estimate re-assessment.** After completing Tier 1, re-assess Tier 2 priorities — the app landscape changes.
4. **This backlog feeds the kit's standard planning.** After Tier 1, run Steps 5-16 to build out the full planning overlay.

---

## Tier 1 — Critical Blockers & Quick Wins

> Must be done before planning new features. Estimated: 7 items, ~1.5–2 weeks.

---

### [T1-01] Rotate Exposed API Keys and Sanitize .env.example

- **Category:** Bug Fix (Security P0)
- **Source:** Audit: E1-D Security — Blocker 1
- **Effort:** XS (<4h)
- **Impact:** Removes live security incident. API quota no longer at risk from public exposure. Demonstrates responsible credential management to any reviewer.
- **Risk if skipped:** Others using your API keys; provider account termination; billing charges on paid tiers. Disqualifying for job applications.
- **Dependencies:** None — do this first, before anything else.
- **Acceptance criteria:**
  - All 4 API keys (Finnhub, Alpha Vantage, CoinMarketCap, NewsAPI) rotated in each provider's dashboard.
  - `backend/.env.example` updated to use placeholder strings (e.g., `your_finnhub_api_key_here`).
  - New working keys added to `backend/.env` (local) and Vercel environment variables.
  - `git log --all -- backend/.env.example` confirms no real keys in git history going forward. (Note: old commits still contain the old keys — rotating them is the effective remediation.)

---

### [T1-02] Restrict CORS to Known Origin

- **Category:** Bug Fix (Security P0)
- **Source:** Audit: E1-D Security — Blocker 3
- **Effort:** XS (<4h)
- **Impact:** API no longer callable from any domain. Prevents quota exhaustion via cross-origin abuse.
- **Risk if skipped:** External sites can proxy EconoPulse's API calls, exhausting rate-limited third-party quotas.
- **Dependencies:** None.
- **Acceptance criteria:**
  - `backend/server.js` CORS config sets `origin: 'https://econopulse.live'` in production, `'http://localhost:3000'` in development.
  - Cross-origin request from an unrecognized origin returns 403.
  - Frontend on `econopulse.live` continues to work correctly.

---

### [T1-03] Install Test Infrastructure (Vitest + RTL + Supertest)

- **Category:** Gap: Missing Infra
- **Source:** Audit: E1-E Testing — Blocker 2
- **Effort:** S (1-2d)
- **Impact:** Unblocks all test writing. Establishes the foundation required for CI. Any future code change is now verifiable.
- **Risk if skipped:** 0% test coverage remains. CI pipeline cannot be added. Every deployment is unverified. Fatal signal on a job application.
- **Dependencies:** T1-01 (stable codebase before adding infrastructure).
- **Acceptance criteria:**
  - Frontend: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` installed as devDependencies.
  - Backend: `vitest`, `supertest`, `@types/supertest` installed as devDependencies.
  - `frontend/vitest.config.ts` and `backend/vitest.config.ts` created with jsdom environment and coverage config.
  - `npm test` runs in both `frontend/` and `backend/` without errors (passes even with zero test files).
  - Coverage reporting configured with `@vitest/coverage-v8`.

---

### [T1-04] Write Core Test Suite (10+ tests covering critical paths)

- **Category:** Gap: Missing Infra
- **Source:** Audit: E1-E Testing — P0 recommendations 3
- **Effort:** M (3-5d)
- **Impact:** Demonstrates test-writing ability. Protects critical data transformation logic from regressions. Brings coverage from 0% to ~40–50% on core paths.
- **Risk if skipped:** Even with test infrastructure installed, 0 tests provides no safety net or resume signal.
- **Dependencies:** T1-03 (test infrastructure must be installed first).
- **Acceptance criteria:**
  - **Backend test 1**: `GET /api/stocks/quotes` — mock Finnhub service returns valid data → response shape is `{ cached: false, data: StockQuote[] }` with all required fields.
  - **Backend test 2**: `GET /api/stocks/quotes` — second request within TTL → response shape is `{ cached: true, data: StockQuote[] }` (cache hit, no Finnhub call).
  - **Backend test 3**: `GET /api/stocks/quotes` — Finnhub service throws → response is `{ status: 500, body: { error: true } }` (does not crash server).
  - **Backend test 4**: `GET /api/health` → `{ status: 'ok' }`.
  - **Backend test 5**: `GET /api/macro/gdp` — response shape matches `{ cached: boolean, data: MacroDataPoint[] }`.
  - **Frontend test 1**: `<App />` renders without crashing (smoke test).
  - **Frontend test 2**: Clicking 'Crypto' in Sidebar renders `CryptoPanel` (navigation smoke test).
  - **Frontend test 3**: `useStocks` hook — mock API returns data → `{ isLoading: false, data: { cached: false, data: [...] } }`.
  - **Frontend test 4**: `DataCard` renders `title` and `value` props correctly.
  - **Frontend test 5**: `ChangeIndicator` renders green for positive change, red for negative change.
  - All 10 tests pass with `npm test`.

---

### [T1-05] Set Up GitHub Actions CI Pipeline

- **Category:** Gap: Missing Infra
- **Source:** Audit: E1-E Testing — P1 recommendation 4
- **Effort:** S (1-2d)
- **Impact:** Every PR and push to main runs lint + test + build automatically. Catches regressions before deployment. Essential visibility signal for a portfolio/resume repo.
- **Risk if skipped:** No automated safety net. Broken builds reach production without detection.
- **Dependencies:** T1-03, T1-04 (tests must exist before CI is meaningful).
- **Acceptance criteria:**
  - `.github/workflows/ci.yml` created.
  - On every push to `main` and every PR, the pipeline runs:
    1. `npm install` in frontend + backend
    2. `npm run build` (frontend TypeScript check + Vite build)
    3. `npm test` in backend (Vitest)
    4. `npm test` in frontend (Vitest)
  - Pipeline passes on the current main branch.
  - Failed tests block merge (branch protection rule enabled on `main`).
  - Build status badge added to `README.md`.

---

### [T1-06] Fix Macro Data Cache TTL (60s → 24h)

- **Category:** Bug Fix (Performance P1)
- **Source:** Audit: E1-C Performance — P1 recommendation 1
- **Effort:** XS (<4h)
- **Impact:** Prevents Alpha Vantage free tier exhaustion (25 calls/day). Macro data (GDP, inflation, CPI) changes monthly — 60s TTL makes no sense and can exhaust the entire daily quota in minutes of use.
- **Risk if skipped:** Alpha Vantage free tier exhausted within hours of active use. All macro panels return errors.
- **Dependencies:** None.
- **Acceptance criteria:**
  - `backend/routes/macro.js` cache TTL updated from `60` to `86400` (24 hours).
  - `backend/routes/crypto.js` TTL updated from `60` to `300` (5 minutes) — crypto changes faster.
  - `backend/routes/commodities.js` TTL updated from `60` to `900` (15 minutes).
  - Manual verification: hitting `/api/macro/gdp` twice within 24h shows `cached: true` on second call.

---

### [T1-07] Add HTTP Cache-Control Headers to API Responses

- **Category:** Quality Improvement (Performance P1)
- **Source:** Audit: E1-C Performance — P1 recommendation 3
- **Effort:** XS (<4h)
- **Impact:** Vercel's edge cache serves repeated requests without invoking the serverless function. Eliminates the multi-instance cache miss problem. Zero-cost horizontal scaling.
- **Risk if skipped:** Every Vercel cold-start instance has an empty in-memory cache. Multiple concurrent users each trigger fresh API calls to rate-limited external services.
- **Dependencies:** T1-06 (TTL values should be consistent between node-cache and Cache-Control headers).
- **Acceptance criteria:**
  - Market data endpoints (`/api/stocks/*`, `/api/forex/*`) respond with `Cache-Control: public, max-age=60`.
  - Crypto endpoints respond with `Cache-Control: public, max-age=300`.
  - Macro endpoints respond with `Cache-Control: public, max-age=86400`.
  - Health endpoint responds with `Cache-Control: no-store`.
  - Verified with `curl -I https://econopulse.live/api/stocks/quotes` showing `cache-control` header.

---

## Tier 2 — Core Enhancements

> Systematic improvements. Do after Tier 1 completes. Estimated: 11 items, ~5–7 weeks.

---

### [T2-01] Convert Backend to TypeScript

- **Category:** Refactor
- **Source:** Audit: E1-A Architecture — P1 recommendation 2
- **Effort:** M (3-5d)
- **Impact:** Type safety across the full stack. Shared types between frontend and backend. Backend errors caught at compile time. Major signal of TypeScript discipline on a resume.
- **Risk if skipped:** Silent type mismatches between backend response shapes and frontend type expectations. Every API change is a potential runtime bug.
- **Dependencies:** T1-05 (CI must catch TypeScript compile errors).
- **Acceptance criteria:**
  - `backend/tsconfig.json` created with `strict: true`.
  - All 12 `.js` backend files converted to `.ts` (server, 7 routes, 4 services).
  - `tsx` or `ts-node` added as dev dependency for `npm run dev`.
  - `tsc --noEmit` runs with zero errors.
  - CI pipeline updated to run TypeScript check on backend.
  - Shared response types (e.g., `StockQuote`, `CryptoListing`) moved to a `shared/types/` directory imported by both frontend and backend.

---

### [T2-02] Extract NodeCache Singleton + cacheOrFetch Utility

- **Category:** Refactor
- **Source:** Audit: E1-A Architecture — P1 recommendation 3
- **Effort:** S (1-2d)
- **Impact:** Eliminates 7-instance NodeCache duplication and 14-copy cache-or-fetch boilerplate. Single TTL configuration point. Prerequisite for WebSocket cache integration.
- **Risk if skipped:** Cache configuration changes require edits to 7 files. Bugs in the cache-or-fetch pattern can't be fixed in one place.
- **Dependencies:** T2-01 (do as part of TypeScript migration for cleaner result).
- **Acceptance criteria:**
  - `backend/utils/cache.ts` exports a single `NodeCache` instance.
  - `backend/utils/cacheOrFetch.ts` exports a generic `cacheOrFetch<T>(key: string, ttl: number, fetcher: () => Promise<T>)` helper.
  - All 7 route files updated to use the shared cache and helper.
  - All existing backend tests still pass.

---

### [T2-03] Add URL-Based Routing with React Router DOM

- **Category:** Gap: Missing Feature
- **Source:** Audit: E1-B UX — P1 recommendation 1
- **Effort:** S (1-2d)
- **Impact:** Users can bookmark and share panel URLs. Browser back/forward works. Page refresh returns to the same panel. Deep links to specific views work.
- **Risk if skipped:** Every user session starts at Overview. No shareable links. Feels like a prototype, not a production app.
- **Dependencies:** None (React Router DOM already installed).
- **Acceptance criteria:**
  - Each panel has a URL: `/`, `/markets`, `/crypto`, `/forex`, `/commodities`, `/macro`, `/countries`, `/news`, `/sentiment`.
  - Navigating via sidebar updates the URL.
  - Direct URL entry (e.g., `econopulse.live/crypto`) renders the correct panel.
  - Browser back/forward navigates between panels.
  - `vercel.json` fallback route already handles SPA routing (`/(.*) → /index.html`).

---

### [T2-04] Add React ErrorBoundary

- **Category:** Quality Improvement
- **Source:** Audit: E1-B UX — P1 recommendation 2
- **Effort:** XS (<4h)
- **Impact:** Prevents a single panel's render error from crashing the entire app. Shows a user-friendly error message instead of a blank screen.
- **Risk if skipped:** Any runtime error in a panel component crashes the whole SPA silently.
- **Dependencies:** None.
- **Acceptance criteria:**
  - `frontend/src/components/shared/ErrorBoundary.tsx` created as a class component.
  - Each panel is wrapped in `<ErrorBoundary>` in `App.tsx`.
  - Error state renders a fallback UI: "This panel encountered an error. Reload to try again."
  - ErrorBoundary reports to Sentry when available (or console.error as fallback).

---

### [T2-05] Add ESLint + Prettier Configuration

- **Category:** Quality Improvement
- **Source:** Audit: E1-A Architecture — P1 recommendation 4
- **Effort:** S (1-2d)
- **Impact:** Automated code style enforcement. TypeScript errors from unused locals caught as lint errors. Consistent formatting across all files.
- **Risk if skipped:** Code style diverges over time. Dead code accumulates. TypeScript's disabled `noUnusedLocals` goes unenforced.
- **Dependencies:** T2-01 (TypeScript migration makes ESLint more valuable).
- **Acceptance criteria:**
  - `eslint.config.ts` (flat config) or `.eslintrc.json` created at root.
  - `@typescript-eslint/recommended` rules enabled for both frontend and backend.
  - `prettier` and `eslint-config-prettier` configured.
  - `npm run lint` script added to both `frontend/package.json` and `backend/package.json`.
  - CI pipeline (`T1-05`) updated to run `npm run lint`.
  - No lint errors on the current codebase after initial configuration.

---

### [T2-06] Add express-rate-limit to All API Routes

- **Category:** Quality Improvement (Security P1)
- **Source:** Audit: E1-D Security — P1 recommendation 3
- **Effort:** XS (<4h)
- **Impact:** Prevents API scraping and rate-limit exhaustion. Required before auth endpoints are added (brute force protection).
- **Risk if skipped:** Any user or bot can make unlimited requests to the API, exhausting third-party API quotas.
- **Dependencies:** T1-02 (CORS fix provides first line of defense).
- **Acceptance criteria:**
  - `express-rate-limit` installed.
  - Global rate limiter applied: 100 requests per 15-minute window per IP.
  - Rate limit headers included in responses (`RateLimit-Limit`, `RateLimit-Remaining`).
  - 429 response includes `{ error: 'Too many requests' }` with `Retry-After` header.

---

### [T2-07] Add Sentry Error Tracking

- **Category:** Gap: Missing Infra (Documentation P1)
- **Source:** Audit: E1-F Docs — P1 recommendation 2
- **Effort:** S (1-2d)
- **Impact:** Production errors become visible instantly. Stack traces, request context, and error frequency available in Sentry dashboard. Signals operational maturity on resume.
- **Risk if skipped:** Production errors are invisible. Cannot debug issues without user reports.
- **Dependencies:** None.
- **Acceptance criteria:**
  - Sentry account created, project configured for both frontend (React) and backend (Node.js).
  - `@sentry/react` added to `frontend/` — `Sentry.init()` in `main.tsx`.
  - `@sentry/node` added to `backend/` — `Sentry.init()` in `server.ts` before routes.
  - `SENTRY_DSN` added to `.env.example` (as placeholder) and Vercel env vars.
  - Unhandled errors in both frontend and backend appear in Sentry dashboard.
  - Test: trigger a known 500 error and verify it appears in Sentry with full stack trace.

---

### [T2-08] Implement User Authentication (JWT + Database)

- **Category:** Gap: Missing Feature
- **Source:** Intake — top priority enhancement goal
- **Effort:** XL (2-4w)
- **Impact:** Enables user accounts, saved watchlists, and personalization. Transforms the app from a static dashboard to a personalized financial tool. The highest-impact single feature for a resume demo.
- **Risk if skipped:** No user personalization possible. App remains a read-only dashboard with no user value differentiation.
- **Dependencies:** T2-01 (backend must be TypeScript), T2-06 (rate limiting on auth endpoints), T2-05 (ESLint for code quality), T1-05 (CI to catch auth bugs).
- **Acceptance criteria:**
  - Database: Vercel Postgres or Supabase (free tier) provisioned. Schema: `users` table (id, email, password_hash, created_at).
  - Backend: `POST /api/auth/register` creates user with bcrypt-hashed password.
  - Backend: `POST /api/auth/login` validates credentials, returns short-lived JWT (15min) access token + HttpOnly cookie refresh token.
  - Backend: `POST /api/auth/refresh` rotates refresh token and issues new access token.
  - Backend: `POST /api/auth/logout` clears refresh token cookie.
  - Frontend: Login and Register screens built using existing layout components.
  - Frontend: Auth context (`AuthContext.tsx`) manages user state.
  - Frontend: Protected routes redirect unauthenticated users to Login.
  - Tests: All 4 auth endpoints have unit tests covering happy path + error cases.

---

### [T2-09] Build Watchlist Feature (Saved Stocks/Crypto)

- **Category:** Gap: Missing Feature
- **Source:** Intake — top priority enhancement goal
- **Effort:** L (1-2w)
- **Impact:** Users can save instruments to a personal watchlist and return to find their selections. Demonstrates CRUD operations, database persistence, and user-scoped data — all key portfolio signals.
- **Risk if skipped:** Auth without any user-specific data makes the auth feature feel pointless.
- **Dependencies:** T2-08 (auth must exist), T2-01 (backend TypeScript).
- **Acceptance criteria:**
  - Database: `watchlists` table (id, user_id FK, symbol, type [stock/crypto/forex], created_at).
  - Backend: `GET /api/watchlist` returns authenticated user's watchlist items.
  - Backend: `POST /api/watchlist` adds symbol to user's watchlist (validates symbol format).
  - Backend: `DELETE /api/watchlist/:id` removes item (owner check — cannot delete others' items).
  - Frontend: Watchlist panel/screen displays user's saved instruments with live price data.
  - Frontend: Add-to-watchlist button visible on StocksPanel, CryptoPanel, ForexPanel rows.
  - Frontend: Watchlist persists across browser sessions (JWT/refresh token handles re-auth).
  - Tests: All 3 watchlist endpoints tested including auth guard (401 without token) and ownership check (403 for wrong user).

---

### [T2-10] Add Structured Logging with Pino

- **Category:** Quality Improvement
- **Source:** Audit: E1-D Security P1 / E1-F Docs P2
- **Effort:** XS (<4h)
- **Impact:** Replaces `console.error` with structured JSON logs (timestamp, level, method, URL, error context). Makes production debugging feasible. Demonstrates observability awareness.
- **Risk if skipped:** Production issues remain hard to diagnose. `console.error` with just a message string is not queryable.
- **Dependencies:** T2-01 (TypeScript backend).
- **Acceptance criteria:**
  - `pino` and `pino-http` installed in backend.
  - HTTP request logging middleware added: logs method, URL, status, response time.
  - All `console.error` and `console.log` calls replaced with structured `logger.error()` / `logger.info()`.
  - Logs include `requestId` for request correlation.
  - `pino-pretty` added as devDependency for readable local development logs.

---

### [T2-11] Document API Endpoints (OpenAPI or Markdown)

- **Category:** Documentation
- **Source:** Audit: E1-F Docs — P1 recommendation 3
- **Effort:** S (1-2d)
- **Impact:** Any reviewer (hiring manager, collaborator) can understand the API without reading code. Demonstrates API design awareness. Swagger UI is an impressive portfolio addition.
- **Risk if skipped:** API surface remains discoverable only by reading source code.
- **Dependencies:** T2-01 (TypeScript backend locks in the final endpoint shapes).
- **Acceptance criteria:**
  - All 15 current API endpoints documented with: method, path, description, query params, response shape (JSON example), error responses.
  - Option A (recommended): `swagger-jsdoc` + `swagger-ui-express` serving interactive docs at `/api/docs`.
  - Option B: `docs/api.md` with clean Markdown endpoint table.
  - README updated with link to API documentation.

---

## Tier 3 — Depth & Polish

> Long-term improvements. Plan after Tier 1+2 complete. Estimated: 8 items, ~3–5 weeks.

---

### [T3-01] WebSocket Real-Time Market Data

- **Category:** Gap: Missing Feature
- **Source:** Intake — priority enhancement goal
- **Effort:** XL (2-4w)
- **Impact:** Live price updates without polling. Finnhub's WebSocket stream provides real-time trade data. Dramatically elevates the Bloomberg Terminal feel. Impressive technical demo.
- **Dependencies:** T2-01 (TypeScript backend), T2-02 (cache singleton), T2-08 (auth, for user-specific subscriptions).
- **Acceptance criteria:**
  - Backend: Finnhub WebSocket connection established on server start. Subscribes to symbols in a configurable list.
  - Backend: Price updates broadcast to connected frontend clients via `ws` or `socket.io`.
  - Frontend: `useStocks` hook enhanced to subscribe to WebSocket updates, falling back to HTTP polling if WebSocket is unavailable.
  - Price updates in StocksPanel animate smoothly (flash green/red on change).
  - WebSocket connection status shown in StatusBar.

---

### [T3-02] Shared Types Package (`shared/types/`)

- **Category:** Refactor
- **Source:** Audit: E1-A Architecture — P2 recommendation 5
- **Effort:** S (1-2d)
- **Impact:** Frontend and backend share a single source of truth for API response types. Eliminates the risk of schema drift between client and server.
- **Dependencies:** T2-01 (TypeScript backend must exist first).
- **Acceptance criteria:**
  - `shared/types/index.ts` created at project root.
  - All types currently in `frontend/src/types/index.ts` and all new backend types moved/linked here.
  - Both `frontend/tsconfig.json` and `backend/tsconfig.json` reference the shared types.
  - CI verifies both packages build without type errors.

---

### [T3-03] Add Input Validation (Zod) to Backend Routes

- **Category:** Quality Improvement (Security P2)
- **Source:** Audit: E1-D Security — P2 recommendation 7
- **Effort:** S (1-2d)
- **Impact:** All route parameters and request bodies validated with Zod schemas. Invalid inputs return 400 with clear error messages instead of propagating to service calls or crashes.
- **Dependencies:** T2-01 (TypeScript backend), T2-08 (auth routes particularly need validation).
- **Acceptance criteria:**
  - `zod` installed in backend.
  - All auth endpoints (`/register`, `/login`) have Zod schemas validating email format and password strength.
  - All watchlist endpoints validate symbol format (alphanumeric, max 10 chars).
  - Invalid input returns `{ status: 400, body: { errors: [{ field: string, message: string }] } }`.

---

### [T3-04] Playwright E2E Tests for Auth + Watchlist Flows

- **Category:** Gap: Missing Infra
- **Source:** Audit: E1-E Testing — P2 recommendation 6
- **Effort:** M (3-5d)
- **Impact:** End-to-end test coverage for the two most critical user journeys. Catches integration issues between frontend, backend, and database. Impressive portfolio signal.
- **Dependencies:** T2-08, T2-09 (auth and watchlist must be built), T1-05 (CI pipeline).
- **Acceptance criteria:**
  - Playwright installed (`@playwright/test`).
  - E2E test 1: User registers → logs in → sees empty watchlist → adds AAPL → refreshes → AAPL persists in watchlist.
  - E2E test 2: User logs out → tries to access watchlist → redirected to login.
  - Tests run in CI pipeline on every PR.

---

### [T3-05] Mobile-Responsive Layout

- **Category:** Quality Improvement (UX P2)
- **Source:** Audit: E1-B UX — P2 recommendation 6
- **Effort:** M (3-5d)
- **Impact:** App is usable on mobile. Sidebar collapses to hamburger menu on small viewports. Data panels reflow to single column.
- **Dependencies:** T2-03 (URL routing should be in place before responsive layout work).
- **Acceptance criteria:**
  - `md:` breakpoint: Sidebar hidden by default, hamburger button in TopBar reveals it as a slide-over.
  - Panel grids reflow from multi-column to single column on `sm:` breakpoint.
  - Tested at 375px (iPhone SE), 768px (iPad), 1280px (desktop).
  - No horizontal scroll on any breakpoint.

---

### [T3-06] Persistent Cache with Vercel KV (Redis)

- **Category:** Gap: Missing Infra (Performance P3)
- **Source:** Audit: E1-C Performance — P3 recommendation 7
- **Effort:** M (3-5d)
- **Impact:** Cache survives Vercel cold starts and is shared across all serverless function instances. Eliminates multi-instance cache miss problem permanently.
- **Dependencies:** T2-02 (cache singleton must be abstracted first to make this a drop-in replacement), T2-01 (TypeScript backend).
- **Acceptance criteria:**
  - Vercel KV provisioned (free tier).
  - `@vercel/kv` installed in backend.
  - `cacheOrFetch` utility updated to use Vercel KV in production, node-cache in development.
  - Cache miss rate drops to near 0% under concurrent load (verified by observing Vercel KV hit/miss stats).

---

### [T3-07] Architecture Decision Records (ADRs)

- **Category:** Documentation
- **Source:** Audit: E1-F Docs — P2 recommendation 6
- **Effort:** S (1-2d)
- **Impact:** Documents the "why" behind key technical decisions. Shows engineering maturity. Useful for onboarding contributors. Great portfolio signal.
- **Dependencies:** T2-08 (auth ADR can't be written before auth is designed).
- **Acceptance criteria:**
  - `dev_docs/decisions/` directory created.
  - ADR-001: Vercel deployment architecture (why SPA + serverless, why `api/index.js` shim).
  - ADR-002: Auth approach (why JWT + refresh tokens, why HttpOnly cookies, why not sessions).
  - ADR-003: WebSocket vs. polling for real-time data.
  - Each ADR follows the standard format: Status / Context / Decision / Consequences.

---

### [T3-08] Color-Blind Accessible ChangeIndicator

- **Category:** Quality Improvement (UX P3)
- **Source:** Audit: E1-B UX — P3 recommendation 7
- **Effort:** XS (<4h)
- **Impact:** Financial data changes communicated via arrows + color, not just color. WCAG AA compliant for color-blind users.
- **Dependencies:** None.
- **Acceptance criteria:**
  - `ChangeIndicator.tsx` updated to include `▲`/`▼` arrows alongside color coding.
  - `aria-label` added: `aria-label={`${value > 0 ? 'Up' : 'Down'} ${Math.abs(value)}%`}`.
  - Visually distinguishable without color at any of the 4 standard color-blind types.

---

## Dependency Map

```
T1-01 (rotate keys)      → [unblocks everything]
T1-02 (CORS fix)         → T2-06 (rate limiting builds on CORS fix)
T1-03 (test infra)       → T1-04 (write tests) → T1-05 (CI)
T1-06 (fix macro TTL)    → T1-07 (cache-control headers)
T1-05 (CI)               → T2-01 (TS migration needs CI to catch errors)
T2-01 (backend TS)       → T2-02 (cache singleton) → T2-10 (logging) → T2-11 (API docs)
T2-01                    → T2-08 (auth) → T2-09 (watchlist) → T3-04 (E2E tests)
T2-08                    → T3-01 (WebSocket, for auth'd subscriptions)
T2-02                    → T3-01 (shared cache needed for WS)
T2-02                    → T3-06 (Redis replaces node-cache via same interface)
T2-01                    → T3-02 (shared types need TS on both sides)
T2-01                    → T3-03 (Zod validation needs TS)
T2-03 (URL routing)      → T3-05 (mobile layout builds on router)
```

---

## Parallel Work Streams

For a solo developer, suggested session ordering:

**Sprint 1 — Security + Quick Wins** (Week 1): T1-01, T1-02, T1-06, T1-07, T2-04 (ErrorBoundary)
**Sprint 2 — Test Infrastructure** (Week 2): T1-03, T1-04, T1-05, T2-06
**Sprint 3 — TypeScript Migration** (Week 3): T2-01, T2-02, T2-05
**Sprint 4 — UX + Ops** (Week 4): T2-03, T2-07, T2-10
**Sprint 5 — Auth** (Weeks 5-6): T2-08
**Sprint 6 — Watchlist** (Week 7): T2-09, T2-11
**Sprint 7 — Real-Time** (Weeks 8-9): T3-01, T3-02, T3-03
**Sprint 8 — Polish** (Weeks 10-11): T3-04, T3-05, T3-07, T3-08

---

## Enhancement Completion Criteria

The enhancement phase is complete when:
- [ ] All 7 Tier 1 items resolved and verified with proof artifacts
- [ ] Composite score re-audit shows ≥7.5/10
- [ ] No P0 audit findings remain open
- [ ] No Critical gaps remain open
- [ ] GitHub Actions CI passes on every commit
- [ ] Auth + watchlist features are live on econopulse.live
- [ ] Backend is 100% TypeScript
- [ ] Test coverage ≥50% on core paths

---

## Next Step

Proceed to **Plan Overlay (Steps 2, 5-16)** using `Master-Starter-Kit/37-enhance/ENHANCE-PLAN-OVERLAY.md` to adapt each kit planning step for the existing codebase context.
