# EconoPulse — AI Agent Instructions

## What This Project Is

Bloomberg Terminal-style financial dashboard. Live at [econopulse.live](https://econopulse.live). Currently being enhanced for resume/job applications.

**Enhancement status:** Phase 0 in progress. Composite audit score: 3.7/10 → target ≥7.5/10.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + TypeScript + Vite | `frontend/` |
| Data fetching | TanStack Query v5 | All API calls go through hooks |
| Charts | Recharts | Used in panel components |
| CSS | Tailwind CSS v3 | No custom CSS — Tailwind only |
| HTTP client | Axios | Centralized in `frontend/src/api/client.ts` |
| Backend | Express 4 + Node 20 | `backend/` — currently JavaScript, being migrated to TypeScript |
| Caching | node-cache (in-memory) | Backend only; being consolidated to singleton |
| Deployment | Vercel | `api/index.js` → `backend/server.js` shim for serverless |
| Testing | Vitest + React Testing Library + Supertest | Being set up in Phase 0 |
| CI/CD | GitHub Actions | Being set up in Phase 0 |

---

## Current Enhancement Phase

**Phase 0 — Enhancement Foundation.** All work in this session should be from the Tier 1 backlog unless explicitly told otherwise. See `dev_docs/STATUS.md` for task status.

**Do not add new features until Phase 0 (Tier 1) is complete.**

---

## Protect List

These files are high quality. Do not modify them unless explicitly asked:

- `frontend/src/App.tsx` — minimal panel-registry pattern, do not add complexity
- `frontend/src/api/client.ts` — clean typed API client, only extend with new endpoints
- `frontend/src/types/index.ts` — single source of truth for types, only add new types
- `frontend/src/hooks/useStocks.ts` — exemplary TanStack Query pattern, replicate for new hooks
- `frontend/src/components/shared/DataCard.tsx` — core display primitive
- `frontend/src/components/shared/LoadingSkeleton.tsx` — consistent loading pattern
- `frontend/src/components/layout/Sidebar.tsx` — Bloomberg sidebar pattern is intentional

---

## Existing Patterns — Follow These

**Frontend data hook pattern** (all 7 hooks follow this, new ones should too):
```ts
export function useX() {
  return useQuery({
    queryKey: ['domain', 'sub'],
    queryFn: domainApi.getX,
    staleTime: N * 1000,  // match backend cache TTL
  })
}
```

**API client pattern** (`api/client.ts`):
```ts
export const xApi = {
  getY: () => api.get<ApiResponse<YType>>('/x/y').then(r => r.data),
}
```

**Backend route pattern** (being migrated to TypeScript, but follow the structure):
- Route files in `backend/routes/` — one per domain
- Service files in `backend/services/` — one per external API provider
- Routes call services; services call external APIs
- All responses: `{ cached: boolean, data: T }`

**Error response shape** (use consistently):
```json
{ "error": true, "message": "Description" }
```

---

## Critical Context

1. **Real API keys were committed to `.env.example`** — T1-01 is the first task. Rotate before doing anything else.
2. **Backend is currently JavaScript** — When reading backend files, treat them as TypeScript migration targets. T2-01 converts all to `.ts`.
3. **No tests exist yet** — T1-03 + T1-04 add test infrastructure. Don't write tests until the framework is installed.
4. **CORS is wide open** — T1-02 fixes this. Don't add auth endpoints before CORS is restricted.

---

## File Locations

```
dev_docs/
  intake/enhance-intake.md     → confirmed tech stack and goals
  audit/                       → 6 dimension audit reports + quality scorecard
  enhancement-backlog.md       → 26-item prioritized backlog (Tier 1/2/3)
  STATUS.md                    → task dashboard (update when completing tasks)
```

---

## Conventions

- TypeScript strict mode on frontend. Match this on backend during migration.
- No `any` types. No `@ts-ignore`.
- Tailwind only for styling — no inline styles, no CSS modules.
- All API calls go through `api/client.ts` functions — never call `axios` directly in components.
- Test files co-located next to source files: `foo.ts` → `foo.test.ts`.
