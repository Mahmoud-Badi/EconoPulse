# API Router Catalog — {{PROJECT_NAME}}

> **Master index of all tRPC routers.** Every API procedure in the application is listed here with its auth level and estimated call frequency. Use this as the starting point for understanding the API surface.

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total routers | {{TOTAL_ROUTERS}} |
| Total procedures | {{TOTAL_PROCEDURES}} |
| Queries | {{QUERY_COUNT}} |
| Mutations | {{MUTATION_COUNT}} |
| Public procedures | {{PUBLIC_COUNT}} |
| Protected procedures | {{PROTECTED_COUNT}} |
| Role-restricted procedures | {{ROLE_RESTRICTED_COUNT}} |

---

## Auth Level Reference

| Level | Middleware | Who Can Call | Examples |
|-------|-----------|-------------|---------|
| `public` | `publicProcedure` | Anyone (no auth needed) | Login, register, forgot password |
| `protected` | `protectedProcedure` | Any authenticated user | Dashboard, profile, most CRUD |
| `{role_1}` | `{role_1}Procedure` | Users with {role_1} role | Admin settings, user management |
| `{role_2}` | `{role_2}Procedure` | Users with {role_2} role | {role_2}-specific operations |
| `companyAdmin` | `companyAdminProcedure` | Company administrators | Company settings, billing |

---

## Router Index

### Core Routers

| # | Router | Procedures | Auth Level | Spec Doc | Status |
|---|--------|-----------|-----------|----------|--------|
| 1 | `auth` | {N} | Public + Protected | [auth.md](./auth.md) | {{STATUS}} |
| 2 | `user` | {N} | Protected + Admin | [user.md](./user.md) | {{STATUS}} |
| 3 | `company` | {N} | Protected + Admin | [company.md](./company.md) | {{STATUS}} |

### Domain Routers

| # | Router | Procedures | Auth Level | Spec Doc | Status |
|---|--------|-----------|-----------|----------|--------|
| 4 | `{entity_1}` | {N} | Protected | [{entity_1}.md](./{entity_1}.md) | {{STATUS}} |
| 5 | `{entity_2}` | {N} | Protected | [{entity_2}.md](./{entity_2}.md) | {{STATUS}} |
| 6 | `{entity_3}` | {N} | Protected | [{entity_3}.md](./{entity_3}.md) | {{STATUS}} |
| 7 | `{entity_4}` | {N} | Protected | [{entity_4}.md](./{entity_4}.md) | {{STATUS}} |
| 8 | `{entity_5}` | {N} | Protected + {Role} | [{entity_5}.md](./{entity_5}.md) | {{STATUS}} |
| 9 | `{entity_6}` | {N} | Protected | [{entity_6}.md](./{entity_6}.md) | {{STATUS}} |

### Utility Routers

| # | Router | Procedures | Auth Level | Spec Doc | Status |
|---|--------|-----------|-----------|----------|--------|
| 10 | `dashboard` | {N} | Protected | [dashboard.md](./dashboard.md) | {{STATUS}} |
| 11 | `report` | {N} | Protected + {Role} | [report.md](./report.md) | {{STATUS}} |
| 12 | `notification` | {N} | Protected | [notification.md](./notification.md) | {{STATUS}} |
| 13 | `search` | {N} | Protected | [search.md](./search.md) | {{STATUS}} |
| 14 | `settings` | {N} | Admin | [settings.md](./settings.md) | {{STATUS}} |

---

## Procedure Inventory

### auth Router ({N} procedures)

| Procedure | Type | Auth | Input | Call Frequency |
|-----------|------|------|-------|---------------|
| `login` | mutation | public | email, password | High |
| `register` | mutation | public | name, email, password | Low |
| `logout` | mutation | protected | — | Medium |
| `forgotPassword` | mutation | public | email | Low |
| `resetPassword` | mutation | public | token, newPassword | Low |
| `getSession` | query | protected | — | High (every page) |

### {entity_1} Router ({N} procedures)

| Procedure | Type | Auth | Input | Call Frequency |
|-----------|------|------|-------|---------------|
| `list` | query | protected | filters, pagination | High |
| `getById` | query | protected | id | High |
| `create` | mutation | protected | create schema | Medium |
| `update` | mutation | protected | id + partial schema | Medium |
| `delete` | mutation | {role} | id | Low |
| `updateStatus` | mutation | protected | id, status | Medium |
| `{custom_proc_1}` | {type} | {auth} | {input} | {frequency} |
| `{custom_proc_2}` | {type} | {auth} | {input} | {frequency} |

### {entity_2} Router ({N} procedures)

| Procedure | Type | Auth | Input | Call Frequency |
|-----------|------|------|-------|---------------|
| `list` | query | protected | filters, pagination | High |
| `getById` | query | protected | id | High |
| `create` | mutation | protected | create schema | Medium |
| `update` | mutation | protected | id + partial schema | Medium |
| `delete` | mutation | {role} | id | Low |
| `{custom_proc}` | {type} | {auth} | {input} | {frequency} |

> **Continue this pattern for every router. Every procedure must be listed.**

### dashboard Router ({N} procedures)

| Procedure | Type | Auth | Input | Call Frequency |
|-----------|------|------|-------|---------------|
| `getKPIs` | query | protected | dateRange? | High (dashboard load) |
| `get{Chart1}Data` | query | protected | dateRange | Medium |
| `get{Chart2}Data` | query | protected | dateRange | Medium |
| `getTodaySnapshot` | query | protected | — | High |
| `getRecentActivity` | query | protected | limit | Medium |

---

## Root Router Definition

```typescript
// packages/api/src/root.ts
import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { companyRouter } from "./routers/company";
import { {entity1}Router } from "./routers/{entity_1}";
import { {entity2}Router } from "./routers/{entity_2}";
// ... all routers

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  company: companyRouter,
  {entity1}: {entity1}Router,
  {entity2}: {entity2}Router,
  // ... all routers
});

export type AppRouter = typeof appRouter;
```

---

## Common Procedure Patterns

Every entity router follows this standard pattern (CRUD + custom):

| Procedure | Pattern | Notes |
|-----------|---------|-------|
| `list` | Paginated query with filters, search, sort | Always includes `companyId` filter |
| `getById` | Single record with joins | Check ownership (same company) |
| `create` | Insert with Zod validation | Validate FKs exist, emit event |
| `update` | Partial update with dirty fields | Validate ownership, emit event |
| `delete` | Soft delete (set `deletedAt`) | Check for dependent records |
| `updateStatus` | Status transition with validation | Enforce state machine rules |

---

## Call Frequency Guide

| Frequency | Definition | Optimization |
|-----------|-----------|-------------|
| High | Every page load or user action | Cache with TanStack Query, index queries |
| Medium | Several times per session | Standard caching |
| Low | Rarely called | No special optimization needed |
| Background | Scheduled/automated | Can be slower, batch operations |
