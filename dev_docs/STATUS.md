# EconoPulse — Status Dashboard

> **Last updated:** 2026-03-25
> **Phase:** Phase 1 — Foundation Improvements (Tier 2)
> **Active sprint:** Sprint 3

---

## Enhancement Progress

| Metric | Value |
|--------|-------|
| Composite score at intake | 3.7/10 |
| Tier 1 blockers remaining | 0 / 7 ✅ |
| Tier 2 items remaining | 11 / 11 |
| Tier 3 items remaining | 8 / 8 |
| Critical gaps remaining | 1 (auth) |
| High gaps remaining | 5 (TS backend, watchlist, WebSocket, ESLint, URL routing) |
| Target composite score | ≥7.5/10 |

**Phase 0 (Enhancement Foundation) must complete before feature development begins.**

---

## Phase 0 — Enhancement Foundation (Tier 1)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T1-01 | Rotate exposed API keys + sanitize .env.example | ✅ Done | S1 |
| T1-02 | Restrict CORS to known origin | ✅ Done | S1 |
| T1-06 | Fix macro data cache TTL (60s → 24h) | ✅ Done | S1 |
| T1-07 | Add HTTP Cache-Control headers | ✅ Done | S1 |
| T1-03 | Install test infrastructure (Vitest + RTL + Supertest) | ✅ Done | S2 |
| T1-04 | Write core test suite (10+ tests) | ✅ Done | S2 |
| T1-05 | Set up GitHub Actions CI pipeline | ✅ Done | S2 |

---

## Phase 1 — Foundation Improvements (Tier 2, Part 1)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T2-04 | Add React ErrorBoundary | ✅ Done | S1 |
| T2-06 | Add express-rate-limit | ✅ Done | S2 |
| T2-01 | Convert backend to TypeScript | ✅ Done | S3 |
| T2-02 | Extract NodeCache singleton + cacheOrFetch | ✅ Done | S3 |
| T2-05 | Add ESLint + Prettier | ✅ Done | S3 |
| T2-03 | Add URL-based routing (React Router) | ✅ Done | S4 |
| T2-07 | Add Sentry error tracking | ✅ Done | S4 |
| T2-10 | Add structured logging (Pino) | ✅ Done | S4 |

---

## Phase 2 — Core Features (Tier 2, Part 2)

| ID | Task | Status | Sprint |
|----|------|--------|--------|
| T2-08 | User authentication (JWT + database) | ✅ Done | S5-S6 |
| T2-09 | Watchlist feature (saved symbols) | ✅ Done | S6 |
| T2-11 | Document API endpoints (OpenAPI/Markdown) | ✅ Done | S6 |

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
