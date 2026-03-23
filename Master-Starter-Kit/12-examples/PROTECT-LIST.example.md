# PROTECT LIST — TaskFlow
# ============================================================
# EXAMPLE FILE — This shows a filled-in PROTECT-LIST for a
# fictional TaskFlow project. Your PROTECT-LIST.md starts empty
# and grows as stable code accumulates.
# ============================================================

> Files and routes that MUST NOT be modified without explicit user approval.

## Protected Files

| File | Reason | Protected Since |
|------|--------|-----------------|
| `packages/api/src/middleware/auth.ts` | Core auth middleware — validates JWT, injects session + workspace context. 100% test coverage. | 2026-03-05 |
| `packages/api/src/middleware/tenant.ts` | Multi-tenant isolation — enforces workspaceId on all queries. Security-critical. | 2026-03-05 |
| `packages/db/src/schema/users.ts` | User table schema — Better Auth depends on exact column structure. See LESSONS-LEARNED.md auth section. | 2026-03-05 |
| `packages/db/src/schema/workspaces.ts` | Workspace table — FK target for every other table in the system. | 2026-03-05 |
| `packages/api/src/services/email.service.ts` | Email delivery via Resend — tested in production, notification dedup logic verified. | 2026-03-26 |
| `apps/web/lib/auth-client.ts` | Auth client configuration — inferAdditionalFields plugin, session hooks. Fragile if modified. | 2026-03-05 |

## Protected Routes

| Route | Reason | Protected Since |
|-------|--------|-----------------|
| `POST /api/auth/*` | All auth endpoints — login, register, password reset. Better Auth handles these. | 2026-03-05 |
| `GET /api/v1/health` | Health check — monitoring depends on exact response shape. | 2026-03-08 |

## Protected Database Tables

| Table | Reason | Protected Since |
|-------|--------|-----------------|
| `users` | Better Auth requires exact column structure (name, image, email). Migration-only changes. | 2026-03-05 |
| `sessions` | Better Auth session management. Must have updatedAt column. | 2026-03-05 |
| `accounts` | Better Auth OAuth accounts. Must have password column (nullable). | 2026-03-05 |
| `workspaces` | Tenant isolation root. Every table FKs to this. | 2026-03-05 |
