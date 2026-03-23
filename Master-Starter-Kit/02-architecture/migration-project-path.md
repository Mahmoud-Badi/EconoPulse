# Migration Project Path

## When to Use

This path is for projects that are **not greenfield** — you're migrating from one stack/architecture to another. Common scenarios:

- JavaScript → TypeScript conversion
- Monolith → microservices split
- Express → NestJS/Next.js migration
- REST → tRPC/GraphQL migration
- Class components → functional React
- Legacy database → modern ORM
- Self-hosted → cloud migration

## The Strangler Fig Pattern

The safest migration strategy: build new features in the new system while gradually moving existing features over, one at a time.

```
Phase 1: New feature goes to New System
         Everything else stays in Old System
         Proxy routes traffic to both

Phase 2: Migrate critical features to New System
         Less-used features stay in Old System
         Proxy handles routing

Phase 3: Migrate remaining features
         Old System handles only legacy edge cases

Phase 4: Decommission Old System
         All traffic goes to New System
```

## Migration Path Steps

### Step M1: Current-State Audit

Before planning the migration, fully understand what exists:

1. **Run the ORCHESTRATOR's Step 7 (Codebase Audit)** against the existing system
2. **Document every service/module** with its dependencies
3. **Map all database tables** and their relationships
4. **List all external integrations** (APIs, webhooks, cron jobs)
5. **Identify shared state** (sessions, caches, file storage)
6. **Count tests** and note coverage gaps

Output: `dev_docs/audit/current-state-audit.md`

### Step M2: Target-State Architecture

Define what the end state looks like:

1. **Run the standard ORCHESTRATOR Steps 1-6** for the new architecture
2. **Map old → new** for every component:
   - Which old services become which new services?
   - Which old tables map to which new tables?
   - Which old endpoints become which new endpoints?
3. **Identify breaking changes** that need data migration

Output: `dev_docs/specs/migration/target-state.md` + `dev_docs/specs/migration/mapping.md`

### Step M3: Migration Strategy

For each component, choose a strategy:

| Strategy | When | Risk |
|----------|------|------|
| **Big bang** | Small components, good test coverage | High — all at once |
| **Strangler fig** | Large components, gradual migration | Low — incremental |
| **Parallel run** | Critical components, zero downtime needed | Medium — double resources |
| **Feature flag** | UI components, A/B testable | Low — instant rollback |

### Step M4: Data Migration Plan

1. **Schema mapping:** old columns → new columns (with type conversions)
2. **Data transformation:** any computed fields, format changes, or normalization
3. **Migration script:** idempotent, resumable, with progress tracking
4. **Rollback plan:** how to reverse the migration if needed
5. **Validation queries:** how to verify data integrity after migration

### Step M5: Migration Task Files

Generate task files organized by migration wave:

- **Wave 0:** Infrastructure (new database, new CI/CD, proxy setup)
- **Wave 1:** Foundation services (auth, user management)
- **Wave 2:** Core business services (ordered by dependency graph)
- **Wave 3:** Supporting services (notifications, analytics)
- **Wave 4:** Cleanup (decommission old system, remove proxy)

Each wave should have:
- Migration tasks (move code)
- Data migration tasks (move data)
- Verification tasks (confirm correctness)
- Rollback triggers (when to abort)

### Step M6: Parallel Run (if applicable)

For critical services, run old and new in parallel:

1. Proxy sends traffic to both systems
2. Compare responses (log differences, don't fail)
3. When difference rate < 0.1% for 1 week → switch to new
4. Keep old system as fallback for 2 more weeks
5. Decommission old system

## Integration with ORCHESTRATOR

This path uses the standard ORCHESTRATOR with these modifications:

| Standard Step | Migration Modification |
|--------------|----------------------|
| Step 1 (Intake) | Add migration-specific questions (current stack, migration reason, timeline) |
| Step 3 (Tribunal) | Include "migration risk assessment" as a tribunal round |
| Step 5 (Service Specs) | Include old→new mapping in each spec |
| Step 7 (Audit) | Mandatory (not optional) — audit the existing system |
| Step 8 (Tasks) | Generate migration waves instead of standard phases |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss during migration | Medium | Critical | Backup before, validate after, keep old DB for 30 days |
| Feature regression | High | High | Parallel run + comprehensive E2E tests |
| Performance degradation | Medium | Medium | Benchmark before and after each wave |
| Extended timeline | High | Medium | Strict wave boundaries, cut scope per wave if needed |
| Team confusion (two systems) | High | Low | Clear routing rules, migration status dashboard |
