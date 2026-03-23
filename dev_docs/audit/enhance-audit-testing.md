# Audit: Testing Coverage

> **App:** EconoPulse
> **Dimension:** E1-E
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 1/10 — Critical

---

## Round 1 Findings (Surface Scan)

**1. Test files:** Zero application test files exist. The only `.test.js` files found are inside `node_modules/` (third-party library tests). The application has **0% test coverage**.

**2. Test frameworks installed:**
- Frontend (`frontend/package.json`): No test framework listed in `dependencies` or `devDependencies`. No Vitest, no Jest, no Testing Library, no Playwright.
- Backend (`backend/package.json`): No test framework installed.
- Root `package.json`: No test framework installed.

**3. `npm test` behavior:** No `test` script is defined in any `package.json`. Running `npm test` in any directory will output `Error: missing script: test` and exit with code 1.

**4. CI pipeline running tests:** No CI pipeline exists (no `.github/workflows/`, no `.circleci/`, no `.gitlab-ci.yml`). Code is pushed directly to `main` with no automated checks.

**5. Test coverage percentage:** 0%.

---

## Round 2 Findings (Deep Dive)

**6. Types of tests present:** None — no unit, integration, or e2e tests.

**7. Critical user flows and their test status:**

| Flow | Test status |
|------|-------------|
| App loads and renders Overview panel | ❌ No test |
| Sidebar navigation switches panels | ❌ No test |
| Stock quotes API returns correct shape | ❌ No test |
| Crypto listings render with price data | ❌ No test |
| API error results in error state (not crash) | ❌ No test |
| Theme toggle persists across panels | ❌ No test |
| Auth login (planned) | ❌ No test |
| Watchlist save/retrieve (planned) | ❌ No test |
| WebSocket real-time update (planned) | ❌ No test |

**8. API endpoint tests:** None. No test verifies that any of the 7 backend route handlers returns the expected response shape, handles upstream API errors gracefully, or respects cache behavior.

**9. Test isolation:** Not applicable (no tests exist).

**10. Mock quality:** Not applicable (no tests exist).

**11. Most dangerous untested code paths:**
- **Backend data transformation**: `backend/routes/stocks.js` maps raw Finnhub response fields (`response.c`, `response.d`, `response.dp`, etc.) to named properties. If Finnhub changes its API response format, this mapping breaks silently and the frontend renders `undefined` values for prices. Zero test coverage on this transform.
- **Cache-or-fetch logic**: The `cache.get()` → fetch → `cache.set()` pattern in every route has no test verifying that the cache is actually populated and served on the second request. A broken cache silently hammers the rate-limited APIs.
- **Frontend type coercion**: `MacroDataPoint.value` is typed as `string` but displayed as a number. Any rendering logic that parses this string (`parseFloat(value)`) has no unit test coverage.

---

## Recommendations

Ordered by priority:

1. **[P0]** Install Vitest + React Testing Library as the frontend test stack — `frontend/package.json` — Vitest integrates natively with Vite (zero config) and is the standard choice for Vite + React projects. Add to devDependencies: `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`. Add `"test": "vitest"` and `"test:ui": "vitest --ui"` scripts.

2. **[P0]** Install Supertest + Vitest (or Jest) for backend API tests — `backend/package.json` — `supertest` allows testing Express routes without starting a real server. Add: `vitest` (or `jest`), `supertest`, `@types/supertest`. Add `"test": "vitest"` script. Note: after backend TypeScript migration, Vitest with `tsx` is the natural choice.

3. **[P1]** Write the 5 highest-value tests immediately (in this order):
   - **Test 1**: `GET /api/stocks/quotes` returns `{ cached: boolean, data: StockQuote[] }` with correct shape when Finnhub mock returns valid data.
   - **Test 2**: `GET /api/stocks/quotes` returns stale cached data (does not call Finnhub) on second request within TTL.
   - **Test 3**: `GET /api/stocks/quotes` returns 500 with `{ error: true }` when Finnhub service throws — does not crash server.
   - **Test 4**: `<App />` renders without crashing (smoke test covering the full component tree).
   - **Test 5**: `useStocks` hook returns loading state, then data state, using a mocked API client.

4. **[P1]** Set up GitHub Actions CI to run tests on every PR — `.github/workflows/ci.yml` — Even with minimal tests, a CI pipeline that runs `npm test` blocks broken builds from reaching production. This is a table-stakes signal for any engineering job application.

5. **[P1]** Configure Vitest coverage reporting with a 60% floor for new code — `vitest.config.ts` — Use `@vitest/coverage-v8`. Set `coverage.thresholds.lines: 60` for new files. This doesn't retroactively require tests on existing code but enforces coverage on every new feature added during the enhancement sprint.

6. **[P2]** Add Playwright e2e tests for two critical flows after auth is implemented:
   - User can log in and see their watchlist.
   - User can add a stock to watchlist and it persists on refresh.
   These are the flows most likely to regress during future changes and most impressive in a portfolio context.

---

## Protect List (this dimension)

*(No files scored 7+ on testing — nothing to protect.)*

---

## Summary

Testing is the most critical gap in the codebase. Zero test files, zero test frameworks installed, no CI pipeline, and no `npm test` script. This is a direct liability for job applications — any engineering hiring panel reviewing this repo will notice immediately. The good news: the codebase is small (~42 files, ~2,500 LOC), the architecture is clean (hooks and services are easily unit-testable), and Vitest integrates with Vite in minutes. A single focused day of work can establish the test infrastructure and write 10–15 meaningful tests covering the most critical paths, bringing coverage from 0% to ~40–50% on the core logic.
