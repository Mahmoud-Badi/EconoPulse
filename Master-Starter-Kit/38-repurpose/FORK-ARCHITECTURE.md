# Fork Architecture

**Purpose:** Define the monorepo structure, code sharing boundaries, and infrastructure strategy for a Deep pivot (score 7-10). Produces an architectural blueprint that both verticals can evolve from without creating maintenance chaos.

**Output:** `dev_docs/repurpose/fork-architecture.md`

**Path:** Repurpose — Deep pivots only (score 7-10)

**Prerequisite:** `dev_docs/repurpose/vertical-differentiation-plan.md` — Section 10 (Forking Strategy) must be complete.

---

## When to Run

Run this as Step R4-FORK only for Deep pivot classifications. Shallow and Medium pivots do not produce a fork architecture.

---

## Think-Then-Generate Protocol

Before generating the fork architecture, answer in the conversation:

1. What is the smallest possible shared core that both vertical products would share? (List the exact feature areas)
2. Are there areas of the existing codebase that are so tightly coupled to the source vertical that extracting them would be disruptive? What are they?
3. What's the risk of a shared database vs. separate databases for each vertical? (data isolation, schema coupling, migration risk)
4. How likely is it that a third vertical will emerge in the next 2 years? (affects how generic the shared core interface should be)
5. What's the team structure? (one team maintaining both products, or separate teams?)

---

## Architecture Decision 1 — Repository Structure

Choose one of three structures based on team size and independence requirements:

### Option A — Monorepo with Packages (Recommended for most cases)

```
{root}/
├── packages/
│   ├── core/                    ← Shared: auth, billing, base UI, common utils
│   ├── {source-vertical}/       ← Source vertical features
│   └── {target-vertical}/       ← New vertical features
├── apps/
│   ├── {source-app}/            ← Source product entry point
│   └── {target-app}/            ← New vertical product entry point
├── tooling/
│   ├── eslint/                  ← Shared eslint config
│   ├── tsconfig/                ← Shared tsconfig
│   └── jest/                    ← Shared jest config
├── turbo.json                   ← Turborepo pipeline (if using Turborepo)
└── package.json                 ← Workspace root
```

**Best for:** Shared team, frequent cross-vertical changes, wanting a single CI/CD pipeline

**Trade-offs:**
- Pro: Single place to update shared code, atomic commits across packages, shared tooling
- Con: Builds can be slower, PR scope can be harder to review, git history is shared

### Option B — Core Library + Separate Repos

```
Repo 1: {name}-core              ← Shared library (published to private npm or path-linked)
Repo 2: {source-app}             ← Source vertical product
Repo 3: {target-app}             ← New vertical product
```

**Best for:** Separate teams owning each vertical, strong independence requirements

**Trade-offs:**
- Pro: Clean team ownership, independent release cycles, simpler per-repo CI
- Con: Cross-cutting changes require PRs in multiple repos, core library versioning complexity

### Option C — Feature-Flagged Single Codebase (Not recommended for Deep pivots)

```
{root}/
├── src/
│   ├── core/                    ← Shared logic
│   ├── verticals/
│   │   ├── {source}/            ← Source vertical feature modules
│   │   └── {target}/            ← Target vertical feature modules
│   └── config/
│       ├── {source}.config.ts   ← Source vertical config
│       └── {target}.config.ts   ← Target vertical config
```

**When to consider:** Only if vertical differences are manageable and team is small

**Why not recommended for Deep pivots:** Feature flags become unmanageable at 7+ pivot score. Growing complexity will eventually force a split.

---

## Architecture Decision 2 — Shared Core Boundary

Define exactly what lives in `packages/core/` (or the shared library).

### Core Inclusion Criteria

Include in shared core:
1. **Auth & session management** — user identity is shared unless verticals have truly separate user bases
2. **Base UI components** — only truly generic components with zero vertical-specific logic (Button, Input, Modal, Table)
3. **Common utilities** — date formatting, number formatting, string utils
4. **Design tokens** — base token values (spacing scale, typography scale) — vertical-specific tokens are NOT in core
5. **API client** — base HTTP client with auth header injection
6. **Error handling primitives** — base error classes, error boundary component
7. **Multi-tenant base** — if both verticals share an org/account structure

Exclude from shared core:
- Any feature with vertical-specific business logic
- Vertical-specific UI components (even if they look similar)
- Vertical-specific data models
- Vertical-specific API endpoints
- Compliance-specific implementations

### Core Package Structure

```
packages/core/
├── src/
│   ├── auth/                    ← Authentication primitives
│   │   ├── AuthProvider.tsx
│   │   ├── useAuth.ts
│   │   └── types.ts
│   ├── ui/                      ← Generic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── api/                     ← Base API client
│   │   ├── client.ts
│   │   └── types.ts
│   ├── utils/                   ← Shared utilities
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── types/                   ← Shared TypeScript types
│       ├── user.ts
│       └── common.ts
└── package.json
```

---

## Architecture Decision 3 — Database Strategy

Choose a database approach:

| Strategy | Description | Best For |
|----------|-------------|---------|
| **Shared database, separate schemas** | Single DB instance, each vertical has its own schema/namespace | Cost efficiency, shared user base |
| **Shared database, row-level isolation** | Single schema with `vertical_id` discriminator column | Shared tables with vertical filtering |
| **Separate databases** | One DB instance per vertical | Full isolation, compliance requirements (HIPAA), max independence |
| **Hybrid** | Shared for some tables (users, billing), separate for vertical-specific data | Balance of efficiency and isolation |

### Recommended for {target vertical} pivot:

{Based on compliance requirements from market fit analysis and data model delta from inheritance map}

**Recommendation:** {strategy} — **Reason:** {specific reason tied to compliance or data model delta}

### Migration Strategy

If extracting from a single existing database:

**Phase 1 — Namespace:**
1. Add `vertical_id` column to all shared tables
2. Backfill existing records with source vertical ID
3. Add query filters at the data access layer

**Phase 2 — Schema split (if using separate schemas):**
4. Create target vertical schema
5. Migrate vertical-specific tables to new schema
6. Update queries for vertical-specific data

**Phase 3 — Extract (if using separate databases):**
7. Replicate data to target vertical database
8. Cut over reads to new database
9. Decommission shared tables after migration period

---

## Architecture Decision 4 — Shared Infrastructure

For each infrastructure component, decide: shared or per-vertical.

| Component | Share or Separate | Rationale |
|-----------|-----------------|-----------|
| **Auth service** | {Share / Separate} | {reason — shared if same user base, separate if different identity providers or strict isolation} |
| **Database** | {Share / Separate} | {reason — from Decision 3} |
| **File storage** | {Share / Separate} | {reason — compliance usually requires separation for regulated verticals} |
| **Email delivery** | {Share / Separate} | {reason — typically shared, different from/reply-to addresses per vertical} |
| **Billing / payments** | {Share / Separate} | {reason — separate if different pricing models, shared if same Stripe account} |
| **Background jobs** | {Share / Separate} | {reason — shared queue with vertical routing is usually fine} |
| **CDN / static assets** | {Share / Separate} | {reason — separate is cleaner for branding, shared is cheaper} |
| **Monitoring / error tracking** | {Share / Separate} | {reason — separate projects in Sentry/Datadog for cleaner alerting} |
| **CI/CD** | {Share / Separate} | {reason — shared pipeline in monorepo; separate for separate repos} |

---

## Architecture Decision 5 — Shared Interface Contracts

Define the TypeScript interfaces (or equivalent) that both vertical products must implement:

```typescript
// packages/core/src/types/user.ts
export interface CoreUser {
  id: string;
  email: string;
  createdAt: Date;
  // Verticals extend this — they do not replace it
}

// packages/core/src/types/tenant.ts
export interface CoreTenant {
  id: string;
  verticalId: VerticalId;
  name: string;
  plan: string;
  createdAt: Date;
}

// packages/core/src/types/vertical.ts
export type VerticalId = '{source-vertical-slug}' | '{target-vertical-slug}';

// Each vertical extends core types:
// packages/{target-vertical}/src/types/user.ts
export interface {TargetVertical}User extends CoreUser {
  {verticalSpecificField}: {type};
  {verticalSpecificField}: {type};
}
```

---

## Architecture Decision 6 — Development Workflow

How do developers work across the fork?

### Branch Strategy

```
main              ← Stable, deploys to production for both apps
feat/{feature}    ← Feature branches, always specify which vertical in PR title
fix/{fix}         ← Bug fixes, tag PRs with vertical labels
core/{change}     ← Core package changes (highest review bar — affects both verticals)
```

### PR Review Requirements

| PR Type | Required Reviews |
|---------|----------------|
| Core package change | {N} reviews — both vertical leads must approve |
| Single vertical feature | {N} reviews — vertical lead + one other |
| Hotfix | {N} review |

### Deployment Separation

Each vertical should have independent deployment:
```
{source-app}/    → Deploys independently (merge to main doesn't auto-deploy {target-app})
{target-app}/    → Deploys independently
```

Configure separate environments per vertical:
- `{source-vertical}.yourdomain.com` or custom domain
- `{target-vertical}.yourdomain.com` or custom domain

---

## Fork Architecture Output Format

Write to `dev_docs/repurpose/fork-architecture.md`:

```markdown
# Fork Architecture — {Source App} → {Target Vertical}

> **Date:** {date}
> **Pivot depth:** Deep ({N}/10)
> **Repository structure:** {Option A / B / C}

---

## Repository Structure
{Actual directory tree for this specific fork}

---

## Shared Core Boundary

### In shared core:
{List with justification}

### Not in shared core:
{List with justification}

---

## Database Strategy
{Decision + migration plan from Decision 3}

---

## Shared Infrastructure
{Full table from Decision 4}

---

## Shared Interface Contracts
{TypeScript interfaces from Decision 5}

---

## Development Workflow
{Branch strategy + PR requirements + deployment from Decision 6}

---

## Extraction Plan

How to get from the current single codebase to the fork structure:

**Step 1 — {Action}:** {specific task}
**Step 2 — {Action}:** {specific task}
...

**Risk:** {what could go wrong during extraction}
**Mitigation:** {how to reduce risk}

---

## Next Step

Proceed to **Steps 5-16** in `ORCHESTRATOR.md`, running the full planning sequence for the **{target vertical} product**. Use the Feature Inheritance Map to pre-populate service specs and screen specs based on Carry Over / Adapt / Replace / New classifications.
```

---

## Quality Rules

1. **Extraction plan is mandatory.** The architecture doesn't exist yet — you need to document how to get from the current state to the fork. Don't skip this.
2. **Shared core must be minimal.** The instinct is to share too much. Shared code that encodes vertical-specific assumptions is worse than duplicated code. When in doubt, duplicate and refactor later.
3. **Database strategy must address compliance.** HIPAA, GDPR, and SOC 2 all have data isolation implications. Address them explicitly.
4. **Interface contracts are the API between verticals.** Define them carefully. Changing a shared interface affects both products.
5. **Two verticals means two deployment pipelines.** Don't assume deploying one deploys both — that's how one vertical breaks the other.
