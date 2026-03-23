# Phase 26: Multi-Tenant / SaaS Architecture Patterns

> Multi-tenancy affects every layer of your stack — database, API, auth, billing, rate limiting, and admin. Getting it wrong causes data leaks between tenants (catastrophic), performance interference (noisy neighbor), and billing errors. This section prevents those issues.

---

## Why This Exists

Multi-tenancy is the architectural decision that separates a single-user application from a SaaS business. Every table, every API endpoint, every background job, every cache key, every file upload, every search query, every email — all of it must be scoped to a tenant. Miss one spot and you have a data leak. Miss the performance isolation and one customer degrades the experience for every other customer. Miss the billing integration and you either lose revenue or overcharge.

The challenge is that multi-tenancy is not a feature you bolt on later. It is a foundational architectural pattern that touches every layer of the stack. The database schema, the ORM configuration, the API middleware, the authentication flow, the authorization layer, the file storage paths, the cache keys, the job queues, the cron schedules, the admin panel, the onboarding flow, the billing integration — all of it changes when you go multi-tenant. Retrofitting multi-tenancy onto an existing single-tenant codebase is one of the most expensive refactors in software engineering.

This section provides the patterns, decision trees, code examples, and checklists needed to build multi-tenancy correctly from day one — or to retrofit it with minimal risk. It covers the three isolation strategies (row-level, schema-level, database-level), billing provider integration, usage metering, rate limiting, white-labeling, admin panels, tenant onboarding, security hardening, and the production gotchas that every SaaS team discovers the hard way.

---

## Conditional Activation

This section is activated when `{{MULTI_TENANT}} == "true"` during Orchestrator Step 1.

If the project is a single-tenant application, internal tool, CLI, library, or static site — skip this section entirely. If the project serves multiple customers from a single deployment (even if you call them "organizations" or "workspaces" instead of "tenants") — you need this section.

---

## How It Integrates with the Orchestrator

This section connects to **Orchestrator Step 17.6** (Multi-Tenant / SaaS Architecture). It runs after:

- **Step 2** (Architecture) — you know your stack, database, and ORM via `02-architecture`
- **Step 5** (Service Specs) — you know what services exist and their boundaries
- **Step 14** (Auth & Security) — you know your authentication strategy

It feeds into:

- **Step 17.5** (Financial Modeling) — tenant tiers and billing models feed into revenue projections via `25-financial-modeling`
- **Step 19** (Marketing) — pricing tiers and feature gating inform marketing positioning
- **Step 20** (Post-Launch) — tenant health monitoring and churn tracking

### Data Flow

```
02-architecture (stack, DB, ORM)
        │
        ▼
14-auth-security (auth strategy)
        │
        ▼
26-multi-tenant-saas ◄── 05-service-specs (service boundaries)
        │
        ├──► 25-financial-modeling (tier pricing → revenue model)
        ├──► 19-marketing (pricing tiers → landing page)
        └──► 20-post-launch (tenant health monitoring)
```

### Key Dependencies

| Dependency | Source | What It Provides |
|------------|--------|------------------|
| Database choice | `02-architecture` | PostgreSQL (RLS), MySQL, MongoDB — isolation strategy depends on this |
| ORM | `02-architecture` | Drizzle, Prisma, TypeORM — tenant filtering patterns differ per ORM |
| Auth strategy | `14-auth-security` | JWT claims, session structure — tenant context injection point |
| Service specs | `05-service-specs` | Which services are tenant-scoped vs global |
| Cost model | `25-financial-modeling` | Infrastructure cost per tenant for tier pricing |

---

## Files in This Section

| # | File | Type | Purpose | Orchestrator Step |
|---|------|------|---------|-------------------|
| 1 | `README.md` | Guide | Section overview and integration map | 17.6 |
| 2 | `tenant-isolation-decision-tree.md` | Guide | Choose between row-level, schema-level, and database-level isolation | 17.6.1 |
| 3 | `row-level-tenant-patterns.template.md` | Template | Implementation patterns for row-level tenancy with RLS, ORM filters, indexes | 17.6.2 |
| 4 | `billing-subscription-integration.template.md` | Template | Stripe / LemonSqueezy / Paddle integration with webhook handling and dunning | 17.6.3 |
| 5 | `usage-metering-rate-limiting.template.md` | Template | Per-tenant rate limiting, usage tracking, overage handling | 17.6.4 |
| 6 | `white-labeling-custom-domains.md` | Guide | Custom domains, branding, theme injection, asset isolation | 17.6.5 |
| 7 | `admin-super-admin-patterns.template.md` | Template | Two-level admin architecture with impersonation and audit logging | 17.6.6 |
| 8 | `tenant-onboarding-flows.template.md` | Template | Self-service, assisted, and enterprise onboarding paths | 17.6.7 |
| 9 | `saas-database-patterns.md` | Guide | tenant_id everywhere rule, shared tables, migrations, archival, connection pooling | 17.6.8 |
| 10 | `saas-security-checklist.md` | Guide | Cross-tenant access prevention checklist with 20+ verification items | 17.6.9 |
| 11 | `saas-architecture-decision-tree.md` | Guide | Monolith vs services, cache isolation, multi-region, job processing decisions | 17.6.10 |
| 12 | `saas-gotchas.md` | Guide | Production lessons from real SaaS deployments — data leaks, noisy neighbors, deletion | 17.6.11 |

---

## Reading Order

1. **README.md** — You are here. Understand scope and integration.
2. **saas-architecture-decision-tree.md** — High-level architecture decisions first.
3. **tenant-isolation-decision-tree.md** — Choose your isolation strategy.
4. **row-level-tenant-patterns.template.md** — Implement the chosen strategy (most teams choose row-level).
5. **saas-database-patterns.md** — Database-level patterns, migrations, and connection pooling.
6. **billing-subscription-integration.template.md** — Connect billing provider.
7. **usage-metering-rate-limiting.template.md** — Rate limiting and usage tracking.
8. **admin-super-admin-patterns.template.md** — Build the admin panel.
9. **tenant-onboarding-flows.template.md** — Design onboarding per tenant type.
10. **white-labeling-custom-domains.md** — Add if customers demand custom branding.
11. **saas-security-checklist.md** — Verify every cross-tenant boundary.
12. **saas-gotchas.md** — Learn from others' production mistakes.

---

## Key Placeholders Used in This Section

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{PROJECT_NAME}}` | Display name of the project | `Fleet Manager` |
| `{{DATABASE}}` | Primary database | `postgresql` |
| `{{ORM}}` | ORM or query builder | `drizzle` / `prisma` |
| `{{TENANT_ID_FIELD}}` | Column name for tenant identifier | `tenant_id` |
| `{{TENANT_STRATEGY}}` | Isolation strategy | `row-level` / `schema-level` / `database-level` |
| `{{BILLING_PROVIDER}}` | Payment processor | `stripe` / `lemonsqueezy` / `paddle` |
| `{{MULTI_TENANT}}` | Whether multi-tenancy is enabled | `true` / `false` |
| `{{FREE_TIER_RATE_LIMIT}}` | API requests per hour for free tier | `100` |

---

## Quick Validation

After completing this section, verify:

- [ ] Isolation strategy chosen and documented
- [ ] Every tenant-scoped table has `tenant_id` column
- [ ] RLS policies enabled (if using PostgreSQL row-level)
- [ ] Billing provider integrated with webhook handlers
- [ ] Rate limiting configured per tier
- [ ] Admin panel supports tenant CRUD and impersonation
- [ ] Onboarding flow tested end-to-end
- [ ] Security checklist passed with 2-tenant integration tests
- [ ] Production gotchas reviewed and mitigations applied
