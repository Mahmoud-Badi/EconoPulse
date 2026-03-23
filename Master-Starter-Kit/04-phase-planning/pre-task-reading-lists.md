# Pre-Task Mandatory Reading Lists

> **Purpose:** Connect AI agents to the right reference documents before each task type. Without this, agents skip specs they don't know exist and re-invent patterns that are already defined.
>
> **How to use:** Task generators (Step 8) MUST prepend the matching reading list paths to every task's Context Header. These paths are IN ADDITION TO the 3-6 task-specific file paths already required by depth requirements.
>
> **Post-task:** After completing any task, verify against the Post-Task Verification Checklist at the bottom of this document.

---

## Universal Reading List (ALL Tasks)

Every task, regardless of type, requires reading these before starting:

| # | Document | Path | Why |
|---|----------|------|-----|
| 1 | Error Response Spec | `dev_docs/specs/standards/error-responses.md` | Ensures consistent error format across all code |
| 2 | Error Catalog | `dev_docs/specs/catalogs/error-catalog.md` | Maps error codes to messages and recovery actions |
| 3 | Anti-Patterns Registry | `dev_docs/foundations/anti-patterns.md` | Prevents known bad patterns from being re-introduced |
| 4 | Technical Debt Registry | `dev_docs/debt-registry.md` | Check for related active debt before starting |

---

## Backend Task Reading List

For tasks that create or modify: routers, services, repositories, middleware, validators, DTOs, database queries.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Pagination Spec | `dev_docs/specs/standards/pagination-spec.md` | Standard pagination input/output shapes |
| 6 | Soft-Delete Spec | `dev_docs/specs/standards/soft-delete-spec.md` | Cascade rules, query filters, restore logic |
| 7 | External API Failure Modes | `dev_docs/specs/reference/external-api-failure-modes.md` | Timeout/retry/fallback for external calls |
| 8 | Service Hub (target service) | `dev_docs/services/{{service-name}}-hub.md` | Single source of truth for the service |
| 9 | Auth/RBAC Pattern | `dev_docs/specs/standards/auth-patterns.md` | Role checks, tenant isolation, permission model |
| 10 | Database Conventions | `dev_docs/specs/database/naming-conventions.md` | Table/column naming, index naming, migration patterns |

---

## Frontend Task Reading List

For tasks that create or modify: pages, components, layouts, forms, data-fetching hooks.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Screen State Matrix | `dev_docs/completeness/ui-state-matrix.md` | Which loading/error/empty pattern for this screen |
| 6 | Component Contracts | `dev_docs/components/contracts/` | TypeScript interfaces for complex components |
| 7 | Design Tokens | `dev_docs/foundations/design-tokens.md` | Colors, spacing, typography — no hardcoded values |
| 8 | Component Catalog | `dev_docs/components/component-catalog.md` | Existing components to reuse |
| 9 | Accessibility Requirements | `dev_docs/foundations/accessibility.md` | Keyboard nav, ARIA, focus management |
| 10 | Responsive Design Spec | `dev_docs/specs/ui/responsive-design-spec.md` | Breakpoints, layout rules per viewport |

---

## Database Task Reading List

For tasks that create or modify: schemas, migrations, seeds, indexes, stored procedures.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Database Schema Overview | `dev_docs/specs/database/schema-overview.md` | Full ERD and table relationships |
| 6 | Seed Data Reference | `dev_docs/specs/database/seed-data/` | Existing seed data format and cross-references |
| 7 | Migration Conventions | `dev_docs/specs/database/migration-conventions.md` | Naming, ordering, rollback patterns |
| 8 | Naming Conventions | `dev_docs/specs/database/naming-conventions.md` | Table, column, index, constraint naming |
| 9 | Soft-Delete Spec | `dev_docs/specs/standards/soft-delete-spec.md` | All tables need deletedAt handling |

---

## Integration Task Reading List

For tasks that connect to external APIs, webhooks, or third-party services.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Integration Strategy | `dev_docs/specs/integrations/integration-strategy.md` | Architecture-level integration decisions |
| 6 | Relevant Failure Spec | `dev_docs/specs/integrations/failure-specs/{{integration}}.md` | Timeout, retry, fallback for this specific API |
| 7 | Resilience Patterns | `dev_docs/specs/integrations/resilience-patterns.md` | Circuit breaker, bulkhead, retry implementations |
| 8 | Error Catalog | `dev_docs/specs/catalogs/error-catalog.md` | Register new integration error codes here |
| 9 | Monitoring Setup | `dev_docs/specs/integrations/monitoring.md` | Alert thresholds, health check registration |

---

## E2E Test Task Reading List

For tasks that create or modify: Playwright tests, Cypress tests, integration test suites.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Test Configuration | `dev_docs/foundations/test-config.md` | Framework setup, environment variables, fixtures |
| 6 | Mock Patterns | `dev_docs/specs/standards/mock-patterns.md` | How to mock external APIs in tests |
| 7 | Seed Data JSON | `dev_docs/specs/database/seed-data/json/` | Test data files for consistent test state |
| 8 | Relevant Screen Specs | `dev_docs/specs/screens/{{screen}}.md` | Expected states, interactions, edge cases |
| 9 | E2E Critical Paths | `dev_docs/foundations/e2e-critical-paths.md` | Priority workflows that must always have coverage |

---

## Mobile Task Reading List

For tasks specific to React Native, Flutter, or native mobile development.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Mobile Design Spec | `dev_docs/specs/ui/mobile-design-spec.md` | Touch targets, gestures, offline-first rules |
| 6 | Platform Gotchas | `dev_docs/specs/mobile/platform-gotchas.md` | iOS vs Android differences that affect implementation |
| 7 | Navigation Patterns | `dev_docs/specs/mobile/navigation.md` | Stack/tab/drawer navigation rules |
| 8 | Offline Sync Strategy | `dev_docs/specs/mobile/offline-sync.md` | Mutation queue, conflict resolution, sync indicators |
| 9 | Push Notification Spec | `dev_docs/specs/mobile/push-notifications.md` | Notification categories, deep links, permissions |

---

## Domain-Specific Task Reading List

For tasks that implement business rules referencing external standards or regulations.

| # | Document | Path | Why |
|---|----------|------|-----|
| 5 | Relevant Reference Tables | `dev_docs/specs/catalogs/business-rules/{{domain}}.md` | Enumerated rules for the specific domain |
| 6 | Domain Rules Overview | `dev_docs/specs/reference/domain-rules.md` | Cross-cutting domain logic |

> **Note:** Step 10.6 (Domain Reference Tables) generates these files. If they don't exist yet, flag the task as blocked until reference tables are generated.

---

## Post-Task Verification Checklist

After completing ANY task, verify these items before marking done:

### Automated Checks (must all pass)
- [ ] Lint — 0 errors in changed files
- [ ] Type check — 0 errors
- [ ] Tests — all pass (new + existing)
- [ ] Build — succeeds

### Code Quality
- [ ] No `any` types in new code
- [ ] No hardcoded colors, spacing, or strings (use design tokens / constants)
- [ ] No `console.log` in production code
- [ ] Every TODO has a task ID reference

### Backend Tasks
- [ ] Error responses use canonical format from error-responses.md
- [ ] Error codes registered in error-catalog.md
- [ ] All database queries include tenant isolation filter
- [ ] All queries filter `deletedAt IS NULL` (soft-delete)
- [ ] Pagination follows standard spec
- [ ] Soft-delete cascade rules followed

### Frontend Tasks
- [ ] All 4 UI states implemented (loading, error, empty, populated)
- [ ] State patterns match screen state matrix
- [ ] Component contracts followed (for contracted components)
- [ ] Responsive at 3 breakpoints (mobile, tablet, desktop)
- [ ] Accessibility basics: keyboard nav, ARIA labels, color contrast

### Testing
- [ ] New code has ≥80% test coverage
- [ ] New API routes have integration tests
- [ ] New screens have ≥1 E2E test

### Documentation
- [ ] Technical debt registry updated (if stubs/TODOs created)
- [ ] DEVLOG.md updated with task completion
- [ ] handoff.md updated with next action

---

## How Task Generators Use This

During Step 8 (Task Generation), the task generator MUST:

1. Determine the task type (backend, frontend, database, integration, E2E, mobile, domain-specific)
2. Look up the matching reading list above
3. Prepend ALL paths from the Universal list + the matching type-specific list to the task's Context Header
4. Add 3-6 task-specific file paths AFTER the reading list paths

Example Context Header for a backend task:
```
Context Files:
- dev_docs/specs/standards/error-responses.md (universal)
- dev_docs/specs/catalogs/error-catalog.md (universal)
- dev_docs/foundations/anti-patterns.md (universal)
- dev_docs/debt-registry.md (universal)
- dev_docs/specs/standards/pagination-spec.md (backend)
- dev_docs/specs/standards/soft-delete-spec.md (backend)
- dev_docs/services/billing-hub.md (task-specific)
- dev_docs/specs/services/billing-service.md (task-specific)
- dev_docs/specs/screens/invoice-list.md (task-specific)
```
