# Architecture Decision Records (ADR) System — {{PROJECT_NAME}}

> **Purpose:** Capture the "why" behind architectural decisions so future developers (including your future self) understand the tradeoffs that were made and don't reverse good decisions by accident.

**ADR Location:** `dev_docs/decisions/`
**Naming Convention:** `ADR-{NNN}-{kebab-case-title}.md`
**Index File:** `dev_docs/decisions/INDEX.md`
**Total ADRs:** {{ADR_COUNT}}

---

## 1. When to Write an ADR

Write an ADR when you make a decision that:

| Trigger | Example | Why It Needs an ADR |
|---------|---------|-------------------|
| **Technology choice** | "We'll use PostgreSQL instead of MongoDB" | Someone will ask "why not Mongo?" in 6 months |
| **Pattern choice** | "We'll use server actions instead of tRPC" | The team needs to know why and stay consistent |
| **Constraint acceptance** | "We'll accept eventual consistency for notifications" | Without documenting this, someone will file a bug |
| **Tradeoff decision** | "We'll use SSR despite slower initial dev velocity" | The tradeoff rationale will be forgotten |
| **Build vs. buy** | "We'll use Auth0 instead of building auth" | Cost and capability reasoning needs to be preserved |
| **Convention establishment** | "All IDs will be ULIDs, not UUIDs or auto-increment" | Consistency requires everyone to know the rule and its reason |

**Do NOT write an ADR for:**
- Minor implementation details (which CSS class naming convention)
- Decisions that are trivially reversible (which icon library)
- Decisions imposed by the client with no room for discussion (document those in the project brief instead)

---

## 2. ADR Template

```markdown
# ADR-{{NNN}}: {{TITLE}}

**Status:** {{STATUS}}
<!-- Proposed | Accepted | Deprecated | Superseded by ADR-XXX -->

**Date:** {{DATE}}
**Author:** {{AUTHOR}}
**Reviewers:** {{REVIEWERS}}

## Context

<!-- What is the problem or situation that requires a decision?
     Include relevant constraints, requirements, and forces at play.
     Be specific about what prompted this decision NOW. -->

{{CONTEXT}}

## Decision

<!-- State the decision clearly and concisely.
     Use active voice: "We will..." not "It was decided that..." -->

{{DECISION}}

## Alternatives Considered

### Alternative 1: {{ALT_1_NAME}}

{{ALT_1_DESCRIPTION}}

- **Pros:** {{ALT_1_PROS}}
- **Cons:** {{ALT_1_CONS}}
- **Rejected because:** {{ALT_1_REJECTION_REASON}}

### Alternative 2: {{ALT_2_NAME}}

{{ALT_2_DESCRIPTION}}

- **Pros:** {{ALT_2_PROS}}
- **Cons:** {{ALT_2_CONS}}
- **Rejected because:** {{ALT_2_REJECTION_REASON}}

## Consequences

### Positive

- {{POSITIVE_1}}
- {{POSITIVE_2}}

### Negative

- {{NEGATIVE_1}}
- {{NEGATIVE_2}}

### Risks

- {{RISK_1}}
- {{RISK_2}}

## Related ADRs

- {{RELATED_ADR}} — {{RELATIONSHIP}}

## References

- {{REFERENCE_1}}
- {{REFERENCE_2}}
```

---

## 3. ADR Lifecycle Rules

| Rule | Detail |
|------|--------|
| **Immutable once accepted** | Never edit the Context, Decision, or Alternatives of an accepted ADR. If the decision changes, create a new ADR that supersedes the old one. |
| **Status transitions** | `Proposed` → `Accepted` (approved by reviewers) → optionally `Deprecated` (no longer relevant) or `Superseded by ADR-XXX` (replaced by a new decision) |
| **Numbering** | Sequential, zero-padded to three digits: ADR-001, ADR-002, etc. Never reuse numbers. |
| **Review requirement** | Every ADR should be reviewed by at least one other engineer before moving to `Accepted`. For major decisions (database, auth, hosting), the tech lead must review. |
| **Retrospective updates** | You may add a `## Retrospective` section to an accepted ADR to note how the decision played out, but never alter the original decision text. |

> **Gotcha:** The most common ADR mistake is writing them after the fact as documentation. ADRs are most valuable when written during the decision process — they force you to articulate alternatives and tradeoffs before committing.

---

## 4. Index Template

Create this file at `dev_docs/decisions/INDEX.md`:

```markdown
# Architecture Decision Records

| # | Title | Status | Date | Summary |
|---|-------|--------|------|---------|
| [ADR-001](ADR-001-database-selection.md) | Database Selection | Accepted | {{DATE}} | PostgreSQL for relational data |
| [ADR-002](ADR-002-auth-strategy.md) | Authentication Strategy | Accepted | {{DATE}} | Third-party auth provider with JWT sessions |
| [ADR-003](ADR-003-api-style.md) | API Style | Accepted | {{DATE}} | tRPC for type-safe internal API |
| [ADR-{{NNN}}](ADR-{{NNN}}-{{KEBAB_TITLE}}.md) | {{TITLE}} | {{STATUS}} | {{DATE}} | {{SUMMARY}} |

## Status Legend

- **Proposed** — Under discussion, not yet approved
- **Accepted** — Approved and in effect
- **Deprecated** — No longer relevant (project evolved past it)
- **Superseded** — Replaced by a newer ADR (linked in the original)

## How to Add a New ADR

1. Copy the template from `02-architecture/adr-template.md`
2. Number it sequentially (next: ADR-{{NEXT_NUMBER}})
3. Fill in all sections — especially Alternatives Considered
4. Submit for review
5. Once accepted, add it to this index
```

---

## 5. Example ADRs

### Example 1: Database Selection

```markdown
# ADR-001: Database Selection

**Status:** Accepted
**Date:** 2024-11-15
**Author:** Sarah Chen
**Reviewers:** Mike Johnson, Alex Rivera

## Context

We need a primary database for our B2B SaaS project management tool.
Expected data characteristics:
- Highly relational data (users belong to organizations, projects have tasks, tasks have comments, etc.)
- Multi-tenant with shared database, row-level isolation via organization_id
- Expected scale: 100K rows in year 1, 10M rows in year 2
- Complex queries needed: filtered lists with sorting, cross-entity reporting, full-text search on tasks
- Team has strong SQL experience, limited NoSQL experience

## Decision

We will use **PostgreSQL 16** hosted on **Supabase** (managed Postgres).

For the ORM layer, we will use **Drizzle ORM** with raw SQL fallback for complex queries.

## Alternatives Considered

### Alternative 1: MongoDB Atlas

Document database with flexible schema.

- **Pros:** Flexible schema speeds up early development. Native JSON storage. Good horizontal scaling story.
- **Cons:** No real JOINs (requires application-level joins or denormalization). Multi-document transactions are slower and more complex. Team has no MongoDB experience. Reporting queries are painful without an aggregation pipeline.
- **Rejected because:** Our data is fundamentally relational. Denormalizing for MongoDB would create data consistency problems (e.g., updating an organization name requires updating it in every embedded document). The team would spend more time fighting MongoDB than building features.

### Alternative 2: PlanetScale (MySQL)

Managed MySQL with branching and non-blocking schema changes.

- **Pros:** Database branching is excellent for CI/CD. Non-blocking schema changes. Generous free tier.
- **Cons:** No foreign key enforcement (by design — they use Vitess). JSON support is weaker than PostgreSQL. No native full-text search (need external service). Less rich extension ecosystem.
- **Rejected because:** Foreign key enforcement is important for data integrity in a multi-tenant system. We'd need to add an external search service (Meilisearch/Algolia) immediately, increasing complexity.

### Alternative 3: Self-hosted PostgreSQL on AWS RDS

Same database engine, but managed by us via AWS.

- **Pros:** Full control over configuration. Potentially cheaper at scale. No vendor lock-in beyond AWS.
- **Cons:** More DevOps overhead (backups, upgrades, monitoring, connection pooling). No built-in auth/storage like Supabase. Slower to get started.
- **Rejected because:** We're a small team and don't want to spend time on database operations. Supabase provides managed Postgres with connection pooling, auth, and storage included. We can migrate to self-hosted later if costs become a concern.

## Consequences

### Positive
- Strong data integrity with foreign keys and constraints
- Rich query capabilities for reporting features
- Team can leverage existing SQL knowledge
- Supabase provides auth, storage, and realtime out of the box
- pg_trgm extension gives us basic full-text search without external services

### Negative
- Vertical scaling limits (Supabase's largest plan handles most use cases, but extreme scale needs sharding)
- Vendor dependency on Supabase (mitigated: it's standard Postgres, we can migrate)
- Drizzle ORM is newer than Prisma, smaller community for troubleshooting

### Risks
- Supabase is a startup — risk of service changes or shutdown (mitigated: data is standard Postgres, exportable anytime)
- If we outgrow Supabase's connection limits, we'll need to migrate or add PgBouncer

## Related ADRs
- ADR-003 (API Style) — database choice influences ORM integration with API layer

## References
- Supabase pricing: https://supabase.com/pricing
- Drizzle vs Prisma comparison: https://orm.drizzle.team/docs/prisma
- PostgreSQL 16 release notes: https://www.postgresql.org/docs/16/release-16.html
```

---

### Example 2: Authentication Strategy

```markdown
# ADR-002: Authentication Strategy

**Status:** Accepted
**Date:** 2024-11-16
**Author:** Mike Johnson
**Reviewers:** Sarah Chen, Alex Rivera

## Context

We need authentication for our multi-tenant SaaS application. Requirements:
- Email/password login
- Social login (Google, GitHub) for developer-facing product
- Organization-based access control (users belong to orgs with roles)
- Session management with reasonable security
- Must support future addition of SSO/SAML for enterprise customers
- Small team (3 developers) — cannot afford to maintain auth infrastructure

## Decision

We will use **Supabase Auth** (GoTrue) for authentication, with **JWT access tokens** stored in httpOnly cookies. Authorization (role checking, org membership) will be handled in our API middleware layer using custom RBAC.

We will NOT use Supabase's Row Level Security for authorization — we'll handle it in the application layer for better testability and portability.

## Alternatives Considered

### Alternative 1: Auth0

Dedicated authentication-as-a-service provider.

- **Pros:** Mature product. Built-in SSO/SAML. Extensive documentation. SOC 2 certified.
- **Cons:** Expensive at scale ($23/1K MAU on paid plans). Separate vendor from our database. Complex configuration for organizations/multi-tenancy. Cold-start latency on serverless.
- **Rejected because:** Since we're already using Supabase for the database, adding Auth0 introduces a second vendor dependency and additional latency for auth checks. Supabase Auth covers our current needs and is included in our existing Supabase plan.

### Alternative 2: Build custom auth with bcrypt + JWT

Roll our own authentication system.

- **Pros:** Full control. No vendor dependency. No per-user pricing.
- **Cons:** Security risk (auth is hard to get right). Need to build: password hashing, email verification, password reset, session management, OAuth flows, rate limiting on login, brute force protection. Estimated 3-4 weeks of development time.
- **Rejected because:** Building auth is a well-known trap for small teams. The development time and ongoing security maintenance outweigh any benefits. We'd rather spend those 3-4 weeks on product features.

### Alternative 3: Clerk

Modern auth provider with pre-built UI components.

- **Pros:** Beautiful pre-built components. Organizations/multi-tenancy built in. Great DX.
- **Cons:** Expensive ($25/1K MAU). Another vendor dependency alongside Supabase. Opinionated UI that may not match our design system. Clerk manages user data in their system, creating data fragmentation.
- **Rejected because:** User data split between Clerk (profiles) and Supabase (application data) creates complexity. We'd need to sync user records between systems. The pre-built UI components, while nice, don't match our design system.

## Consequences

### Positive
- Zero additional cost (included in Supabase plan)
- Single vendor for database + auth simplifies architecture
- Auth state is co-located with application data
- Google and GitHub OAuth supported out of the box
- Future SSO/SAML possible via Supabase Enterprise or migration to Auth0

### Negative
- Supabase Auth is less feature-rich than Auth0/Clerk for advanced scenarios
- No pre-built UI components — we need to build login/signup forms ourselves
- SSO/SAML requires Supabase Enterprise plan or migration to a different auth provider
- Custom RBAC means we own the authorization logic (more code to maintain and test)

### Risks
- If enterprise customers require SSO before Supabase Enterprise is cost-effective, we may need to migrate auth providers (estimated 2-week migration)
- Custom RBAC bugs could create authorization vulnerabilities — needs thorough testing

## Related ADRs
- ADR-001 (Database Selection) — auth provider chosen to align with database vendor
- ADR-003 (API Style) — auth middleware integrates with API layer

## References
- Supabase Auth docs: https://supabase.com/docs/guides/auth
- OWASP Authentication Cheatsheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
```

---

### Example 3: API Style

```markdown
# ADR-003: API Style

**Status:** Accepted
**Date:** 2024-11-17
**Author:** Alex Rivera
**Reviewers:** Sarah Chen, Mike Johnson

## Context

We need to choose an API paradigm for communication between our Next.js frontend and our backend services. Requirements:
- Type safety between client and server (we're a TypeScript-only codebase)
- Support for both queries (data fetching) and mutations (data changes)
- Real-time subscriptions for notifications and live updates
- Must work with React Server Components and client components
- Must support file uploads
- Team has experience with REST and some GraphQL

## Decision

We will use **tRPC v11** for our internal API (frontend-to-backend communication within our monorepo).

For any future public API (third-party integrations), we will build a separate **REST API** with OpenAPI documentation. The public REST API will call the same service layer as tRPC procedures.

## Alternatives Considered

### Alternative 1: REST API (Express/Hono)

Traditional REST endpoints.

- **Pros:** Universal standard. Easy to understand. Cacheable with HTTP semantics. Good tooling (Postman, curl). Can serve as both internal and public API.
- **Cons:** No built-in type safety between client and server. Need to maintain API client code or use code generation (OpenAPI → TypeScript). Over-fetching and under-fetching problems. Versioning complexity.
- **Rejected because:** Without type safety, we'd spend significant time debugging mismatches between what the client sends and what the server expects. In a TypeScript monorepo, tRPC eliminates this entire class of bugs.

### Alternative 2: GraphQL (Apollo/Urql)

Graph-based query language.

- **Pros:** Clients fetch exactly what they need (no over-fetching). Strong type system via schema. Great for complex data graphs. Subscriptions built in.
- **Cons:** Complexity overhead for a small team (schema definition, resolvers, code generation). N+1 query problems require DataLoader. Caching is harder than REST. File uploads are non-standard. Learning curve for the team.
- **Rejected because:** GraphQL shines for public APIs with diverse clients. For a single frontend talking to a single backend in the same monorepo, it's over-engineered. The schema definition and resolver boilerplate slow us down without proportional benefit.

### Alternative 3: Next.js Server Actions only

Use React Server Components and Server Actions for all data operations.

- **Pros:** Zero API layer to maintain. Deeply integrated with Next.js. Automatic code splitting. Progressive enhancement.
- **Cons:** Tightly couples business logic to Next.js (hard to reuse with a mobile app or public API later). Limited to form-based mutations (no real-time). Testing server actions is less mature than testing API endpoints. No clear pattern for complex authorization middleware.
- **Rejected because:** We want our business logic in a framework-agnostic service layer. Server Actions for forms are fine, but we need proper middleware for auth, rate limiting, and input validation that tRPC provides.

## Consequences

### Positive
- End-to-end type safety with zero code generation
- Procedure calls feel like function calls — excellent DX
- Built-in input validation via Zod schemas
- Middleware system for auth, rate limiting, logging
- React Query integration for caching, optimistic updates, infinite scroll
- Can add a REST wrapper later for public API without rewriting business logic

### Negative
- tRPC is TypeScript-only — can't be consumed by non-TS clients without a REST adapter
- Smaller ecosystem than REST or GraphQL
- Not a standard protocol — new hires need to learn tRPC
- Tight coupling to React Query on the frontend (acceptable tradeoff)

### Risks
- If we need a mobile app (React Native), tRPC works. If we need a non-JS mobile app (Swift/Kotlin), we'll need the REST wrapper sooner.
- tRPC v11 is relatively new — potential for breaking changes in minor versions

## Related ADRs
- ADR-001 (Database Selection) — Drizzle ORM integrates cleanly with tRPC procedures
- ADR-002 (Auth Strategy) — Auth middleware plugs into tRPC context

## References
- tRPC docs: https://trpc.io/docs
- tRPC vs REST vs GraphQL: https://trpc.io/docs/concepts
- Next.js App Router + tRPC setup: https://trpc.io/docs/client/nextjs/setup
```

---

## 6. Common ADR Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Writing ADRs after implementation** | You've already forgotten the alternatives and why you rejected them | Write the ADR as part of the decision process, before coding |
| **ADRs with no alternatives** | If there were no alternatives, it wasn't a decision worth documenting | Always list at least 2 alternatives, even if one is "do nothing" |
| **Editing accepted ADRs** | Destroys the historical record of what was decided and why | Create a new ADR that supersedes the old one |
| **ADRs that are too long** | Nobody reads a 5-page ADR | Keep it to 1-2 pages. The Context section should be 1-2 paragraphs, not a novel |
| **ADRs without consequences** | Decisions without tradeoff acknowledgment are incomplete | Every decision has downsides. Document them. |
| **Using ADRs for project management** | "ADR-047: Move standup to 10am" is not an architecture decision | Reserve ADRs for technical architecture decisions only |
