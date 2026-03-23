# Enhance Intake — EconoPulse

> **Date:** 2026-03-23
> **Path:** Enhance
> **Kit version:** Master Starter Kit

---

## Application Overview

| Field | Value |
|-------|-------|
| App name | EconoPulse |
| Current state rating | 5 / 10 |
| Active users | 0–10 (personal portfolio/demo) |
| Launch status | Launched — live at econopulse.live |

---

## Tech Stack (Confirmed)

| Layer | Technology | Version |
|-------|-----------|---------|
| Language (frontend) | TypeScript | ^5.5.3 |
| Language (backend) | JavaScript (CommonJS) | Node 20.x |
| Framework (frontend) | React + Vite | React ^18.3.1 / Vite ^5.3.3 |
| Framework (backend) | Express | ^4.19.2 |
| Database | None | — |
| ORM | None | — |
| Auth | None | — |
| Data fetching | TanStack Query | ^5.51.1 |
| Charts | Recharts | ^2.12.7 |
| CSS | Tailwind CSS | ^3.4.4 |
| Routing (frontend) | React Router DOM (installed, not used for navigation) | ^6.24.1 |
| HTTP client | Axios | ^1.7.2 (both frontend + backend) |
| Caching (backend) | node-cache (in-memory, per-route) | ^5.1.2 |
| Deployment | Vercel (frontend SPA + serverless backend) | — |
| CI/CD | None | — |
| Testing | None | — |
| Security middleware | Helmet | ^7.1.0 |
| Analytics | Vercel Analytics | ^2.0.1 |

---

## Pain Points

1. **No auth or persistence** — No login, no user accounts, no database. Can't save watchlists, preferences, or any user state. This is the single biggest gap for a resume-quality demo.
2. **Backend is plain JavaScript** — All 12 backend files (server.js, 7 routes, 4 services) are CommonJS JS with no TypeScript, no type safety, no validation layer. Inconsistent with the well-typed frontend.
3. **Zero tests, zero CI/CD** — No test framework installed, no test files, no GitHub Actions pipeline. Any change could silently break production with no safety net.

---

## Enhancement Goals

**North-star goal:** Upgrade the app to production-quality for resume/job applications — demonstrating auth, real-time data, TypeScript discipline, CI/CD, and tested code.

**Focus areas (priority order):**
1. User auth + saved watchlists (JWT + database + persist user state)
2. Convert backend to TypeScript (type parity with frontend, shared types)
3. WebSocket real-time market data (replace polling-only approach)
4. GitHub Actions CI/CD (lint + test + build on every PR)
5. Test coverage (Vitest unit tests + Playwright e2e for critical flows)

**Out of scope:** Mobile app, billing/payments, multi-tenancy, i18n, full marketing site.

---

## External Services Detected

| Service | Purpose | Integration type |
|---------|---------|----------------|
| Finnhub | Stocks, forex, market sentiment | REST API (backend proxy) |
| Alpha Vantage | Macroeconomic indicators, commodities | REST API (backend proxy) |
| CoinMarketCap | Crypto prices, global market stats | REST API (backend proxy) |
| NewsAPI | Financial/economic headlines | REST API (backend proxy) |

---

## Constraints

| Constraint | Value |
|-----------|-------|
| Timeline | Immediately (starting this week) |
| Team size | Solo developer |
| Infrastructure budget | Modest — minor upgrades OK (Vercel Postgres or Supabase free tier acceptable) |

---

## Existing Documentation

| Artifact | Location | Quality |
|---------|---------|---------|
| README | `README.md` | Partial — explains stack and setup, missing architecture and contributing guide |
| API docs | None | None |
| Architecture docs | None | None |
| Prior kit docs | None | — |

---

## Audit Configuration

**Proceed to:** Step E1 — Deep App Audit (6 dimensions, 3 rounds each)
**Skip:** None — run all 6 dimensions
**Special focus:** E1-D (Security) and E1-E (Testing) — both are in critical state; E1-A (Architecture) for backend TypeScript migration planning
