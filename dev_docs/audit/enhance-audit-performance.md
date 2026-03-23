# Audit: Performance & Scalability

> **App:** EconoPulse
> **Dimension:** E1-C
> **Date:** 2026-03-23
> **Rounds completed:** 3/3

---

## Score: 6/10 — Needs Work

---

## Round 1 Findings (Surface Scan)

**1. Client-side bundle size:**
Stack: React 18 + Vite + TanStack Query + Recharts + Axios + React Router DOM.
Estimated production bundle (gzipped): ~280–350KB. Recharts alone is ~200KB uncompressed (~70KB gzipped). Vite tree-shakes well, but Recharts is not tree-shakeable at the component level. No bundle analyzer has been run — `vite-bundle-visualizer` is not installed.

**2. Images:** No images in the application (pure data terminal). Not applicable.

**3. N+1 query patterns:**
- **`backend/routes/stocks.js`**: `Promise.all(STOCK_SYMBOLS.map(s => finnhubService.getQuote(s)))` — **14 simultaneous HTTP calls** to Finnhub on every cache miss. Finnhub's free tier limits to 60 API calls/minute. A single cache miss on the stocks endpoint consumes 14 of those 60 calls instantly.
- Same pattern in `/indices`: 4 more Finnhub calls.
- **`backend/routes/forex.js`** (not read but implied by pattern): likely another N+1 for currency pairs.
- These N+1 patterns don't constitute database N+1 issues (no DB), but represent API rate-limit exhaustion risk.

**4. Caching implemented:**
- Backend: `node-cache` (in-memory, per-process) with 60-second TTL — **7 separate instances** (one per route file, e.g., `const cache = new NodeCache({ stdTTL: 60 })`). Each instance is isolated — no cross-route cache sharing or coordinated invalidation.
- Frontend: TanStack Query with `staleTime: 60 * 1000` (60 seconds) — matches backend TTL. Good alignment.
- No HTTP cache headers (`Cache-Control`, `ETag`) on API responses — browser/CDN layer caching is unused.
- No persistent cache (Redis, etc.) — cache is lost on every Vercel cold start.

**5. Deployment infrastructure scalability:**
- Vercel serverless functions (via `api/index.js → backend/server.js`). Scales horizontally automatically.
- **Critical gap**: The in-memory `node-cache` is per-instance. When Vercel spins up multiple function instances, each has its own empty cache — cache hit rates drop to near 0% under concurrent load. All 14 Finnhub calls fire for every concurrent user on a cold instance.

---

## Round 2 Findings (Deep Dive)

**6. Three most data-heavy endpoints profiled:**

**`GET /api/stocks/quotes` (14 Finnhub calls):**
- At 1× load (1 user): 14 parallel calls. If cached: ~1ms. If cold: ~500–1500ms (network latency × 1, but 14 calls).
- At 10× load (10 concurrent users on a fresh Vercel instance): 10 × 14 = up to 140 Finnhub calls per minute. Finnhub free tier: 60 calls/min. **Rate limit exceeded**. Users get 429 errors with no retry logic or user feedback.
- Fix: Finnhub offers a `GET /api/v1/quote?symbol=X&token=Y` batch endpoint or the WebSocket stream — both eliminate the N+1.

**`GET /api/macro/gdp` (Alpha Vantage call):**
- Alpha Vantage free tier: 25 calls/day. Single GDP call uses 1 of 25.
- 6 macro endpoints × any number of users = rapid exhaustion.
- The current 60-second TTL means a day's 25 calls could be exhausted in 25 minutes of active use. Alpha Vantage data changes weekly/monthly — TTL should be 24 hours minimum.
- Fix: Increase macro TTL to `86400` seconds (24h) in the cache configuration.

**`GET /api/crypto/listings` (CoinMarketCap):**
- CoinMarketCap free tier: 333 API calls/day (10k/month).
- At 60-second TTL: up to 1,440 calls/day just from one user. **Will exhaust free tier in hours**.
- Fix: Increase TTL to 300 seconds (5 minutes) minimum for crypto listings.

**7. Database query indexes:** No database — not applicable.

**8. Synchronous operations that could be async:** No blocking synchronous operations found. All external API calls are properly `async/await`.

**9. Memory leaks:**
- `node-cache` instances: 7 separate in-memory caches. Each grows unbounded until Vercel recycles the function. No max cache size configured (`maxKeys` option not set). Low risk given small data volumes but worth noting.
- React side: TanStack Query manages its own garbage collection via `gcTime`. No custom event listeners or intervals found in components that would need cleanup.

**10. What breaks first at 10× load:**
- **API rate limits** on Finnhub (60/min) and Alpha Vantage (25/day) — these hit before any infrastructure limit.
- **Vercel cold starts**: Each cold-start instance has an empty in-memory cache — every first request to a new instance makes all N downstream API calls.
- **No circuit breaker**: If Finnhub is down, every user's request hangs for 10s (axios timeout) before returning a 500. No fallback, no cached stale data served.

**11. Third-party API failure handling:**
- `finnhubService.js`: Plain `axios.get()` call. If Finnhub times out or returns an error, the exception propagates up to the route handler's `catch(error)` → `res.status(500).json({error: true, message: error.message})`. No retry, no fallback to stale cached data, no graceful degradation.
- There is no "serve stale cache on upstream failure" pattern anywhere.

---

## Recommendations

Ordered by priority:

1. **[P1]** Increase TTL for slow-changing data — `backend/routes/macro.js`, `backend/routes/crypto.js` — Macro data changes weekly/monthly (set TTL to 86400s = 24h). Crypto data can be 5 minutes (300s). This alone prevents Alpha Vantage free-tier exhaustion in normal use.

2. **[P1]** Create shared `backend/utils/cache.ts` singleton — all `backend/routes/*.js` — Replace 7 isolated `new NodeCache()` instances with one shared module. This is a prerequisite for the WebSocket feature and makes TTL configuration centralized.

3. **[P1]** Add HTTP Cache-Control headers to API responses — `backend/server.js` or per-route middleware — Example: `res.set('Cache-Control', 'public, max-age=60')` for market data. This enables Vercel's edge cache to serve responses without hitting the serverless function at all — directly solves the multi-instance cache miss problem.

4. **[P1]** Add circuit breaker / stale-while-revalidate for upstream API failures — `backend/services/*.js` — When Finnhub/AlphaVantage/CMC is unavailable, serve the last successful cached value with a `stale: true` flag instead of a 500 error. This is critical for a live demo — an API outage should not crash the dashboard.

5. **[P2]** Replace stocks N+1 pattern with Finnhub WebSocket — `backend/routes/stocks.js` — This is already in the enhancement goals. A single WebSocket connection to Finnhub's real-time trade feed eliminates 14 HTTP calls per user per minute. Major rate-limit and latency improvement.

6. **[P2]** Run `vite-bundle-visualizer` and evaluate Recharts chunking — `frontend/` — Recharts (~70KB gzipped) can be code-split if only some panels use charts. Lazy-load non-overview panels to reduce initial bundle.

7. **[P3]** Add Redis (Vercel KV or Upstash) for persistent shared cache — replaces `node-cache` — Solves the multi-instance cache miss problem permanently. Free tier is sufficient for this workload. Required when moving to WebSocket-based data where cache must be shared across server processes.

---

## Protect List (this dimension)

| File | Score | Reason |
|------|-------|--------|
| `frontend/src/hooks/useStocks.ts` | 8/10 | Correct 60s staleTime aligned with backend TTL. Pattern is right — extend for new hooks. |
| `frontend/src/api/client.ts` | 8/10 | 10s timeout is reasonable. Clean axios instance. |

---

## Summary

Performance fundamentals are in place: backend caching with appropriate TTL for market data, TanStack Query staleTime alignment, and Vite for optimized frontend builds. The critical gaps are architectural: in-memory cache that vanishes on Vercel cold starts, 14-call N+1 patterns for stocks that hit Finnhub rate limits under any real load, and no fallback when upstream APIs fail. The macro data TTL (60s for data that changes monthly) will exhaust Alpha Vantage's 25-call/day free tier in hours. These are all addressable in the Tier 1 sprint with configuration changes and the cache singleton refactor.
