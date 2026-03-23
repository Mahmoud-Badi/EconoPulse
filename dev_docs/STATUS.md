# EconoPulse — Status Dashboard

> **Last updated:** 2026-03-23
> **Phase:** Enhancement Foundation (Phase 0)
> **Active sprint:** Sprint 1 — Security + Quick Wins

---

## Enhancement Progress

| Metric | Value |
|--------|-------|
| Composite score at intake | 3.7/10 |
| Tier 1 blockers remaining | 7 / 7 |
| Tier 2 items remaining | 11 / 11 |
| Tier 3 items remaining | 8 / 8 |
| Critical gaps remaining | 3 (auth, tests, CI) |
| High gaps remaining | 5 (TS backend, watchlist, WebSocket, ESLint, URL routing) |
| Target composite score | ≥7.5/10 |

**Phase 0 (Enhancement Foundation) must complete before feature development begins.**

---

## Phase 0 — Enhancement Foundation (Tier 1)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T1-01 | Rotate exposed API keys + sanitize .env.example | ⬜ Todo | S1 |
| T1-02 | Restrict CORS to known origin | ⬜ Todo | S1 |
| T1-06 | Fix macro data cache TTL (60s → 24h) | ⬜ Todo | S1 |
| T1-07 | Add HTTP Cache-Control headers | ⬜ Todo | S1 |
| T1-03 | Install test infrastructure (Vitest + RTL + Supertest) | ⬜ Todo | S2 |
| T1-04 | Write core test suite (10+ tests) | ⬜ Todo | S2 |
| T1-05 | Set up GitHub Actions CI pipeline | ⬜ Todo | S2 |

---

## Phase 1 — Foundation Improvements (Tier 2, Part 1)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T2-04 | Add React ErrorBoundary | ⬜ Todo | S1 |
| T2-06 | Add express-rate-limit | ⬜ Todo | S2 |
| T2-01 | Convert backend to TypeScript | ⬜ Todo | S3 |
| T2-02 | Extract NodeCache singleton + cacheOrFetch | ⬜ Todo | S3 |
| T2-05 | Add ESLint + Prettier | ⬜ Todo | S3 |
| T2-03 | Add URL-based routing (React Router) | ⬜ Todo | S4 |
| T2-07 | Add Sentry error tracking | ⬜ Todo | S4 |
| T2-10 | Add structured logging (Pino) | ⬜ Todo | S4 |

---

## Phase 2 — Core Features (Tier 2, Part 2)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T2-08 | User authentication (JWT + database) | ⬜ Todo | S5-S6 |
| T2-09 | Watchlist feature (saved symbols) | ⬜ Todo | S6 |
| T2-11 | Document API endpoints (OpenAPI/Markdown) | ⬜ Todo | S6 |

---

## Phase 3 — Real-Time + Polish (Tier 3)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T3-01 | WebSocket real-time market data | ⬜ Todo | S7 |
| T3-02 | Shared types package | ⬜ Todo | S7 |
| T3-03 | Input validation (Zod) | ⬜ Todo | S7 |
| T3-04 | Playwright E2E tests | ⬜ Todo | S8 |
| T3-05 | Mobile-responsive layout | ⬜ Todo | S8 |
| T3-06 | Persistent cache (Vercel KV/Redis) | ⬜ Todo | S8 |
| T3-07 | Architecture Decision Records | ⬜ Todo | S8 |
| T3-08 | Color-blind accessible ChangeIndicator | ⬜ Todo | S8 |

---

## Audit Files

| File | Status |
|------|--------|
| `dev_docs/intake/enhance-intake.md` | ✅ Complete |
| `dev_docs/audit/enhance-audit-architecture.md` | ✅ Complete (Score: 5/10) |
| `dev_docs/audit/enhance-audit-ux.md` | ✅ Complete (Score: 6/10) |
| `dev_docs/audit/enhance-audit-performance.md` | ✅ Complete (Score: 6/10) |
| `dev_docs/audit/enhance-audit-security.md` | ✅ Complete (Score: 2/10) |
| `dev_docs/audit/enhance-audit-testing.md` | ✅ Complete (Score: 1/10) |
| `dev_docs/audit/enhance-audit-docs.md` | ✅ Complete (Score: 4/10) |
| `dev_docs/audit/quality-scorecard.md` | ✅ Complete (Composite: 3.7/10) |
| `dev_docs/enhancement-backlog.md` | ✅ Complete (26 items) |

---

## Protect List (Do Not Modify Without Permission)

- `frontend/src/App.tsx`
- `frontend/src/api/client.ts`
- `frontend/src/types/index.ts`
- `frontend/src/hooks/useStocks.ts` (and all hooks — same pattern)
- `frontend/src/components/shared/DataCard.tsx`
- `frontend/src/components/shared/LoadingSkeleton.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `backend/server.js` (extend, don't rewrite)
- `README.md` (extend, don't replace)
