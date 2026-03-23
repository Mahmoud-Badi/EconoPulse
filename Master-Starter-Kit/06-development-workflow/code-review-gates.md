# Code Review Gates

## Purpose

Code review gates define when code must be reviewed before it can be merged or deployed. Not every change needs a review. But some changes are high-risk enough that a missed bug could cause data loss, security breaches, or production outages.

This document defines the gates: what triggers a review, what the review checks, and how to run it.

---

## Gate 1: Always Review (Mandatory)

These changes MUST be reviewed before merging. No exceptions.

### Triggers

| Change Type | Why Mandatory |
|------------|---------------|
| Auth/permission changes | Wrong auth = unauthorized access to data |
| Payment/billing logic | Wrong billing = financial loss or compliance violation |
| Compliance-related code (HIPAA, PCI, GDPR) | Wrong compliance = legal liability |
| Database schema changes | Wrong schema = data corruption or loss |
| Before advancing to next phase | Phase boundary = integration checkpoint |
| Before merging to main | Main branch = production path |

### How to Run

```
/review-pr
```

This runs a structured review covering:
- Security implications
- Data integrity
- Auth correctness
- Error handling
- Test coverage
- Breaking changes

---

## Gate 2: Request Review (Recommended)

These changes SHOULD be reviewed. Skip only when you're confident and the change is low-risk.

### Triggers

| Change Type | Why Recommended |
|------------|----------------|
| Major feature (10+ files changed) | Large changes have more surface area for bugs |
| Refactoring existing code | Refactors can introduce subtle regressions |
| Security-related bug fixes | The fix must actually fix the vulnerability |
| Performance-critical changes | Optimizations can break correctness |
| Shared utility/library changes | Changes cascade to all consumers |

### How to Run

```
/code-review
```

This provides:
- Code quality assessment
- Pattern consistency check
- Potential issues and suggestions
- Complexity analysis

---

## The Review Checklist

Every review (whether `/review-pr` or `/code-review`) should verify these items:

### Authentication and Authorization

- [ ] Every route that needs auth has `protectedProcedure` (not `publicProcedure`)
- [ ] Role-based routes check the correct role
- [ ] No auth bypass paths (e.g., public API that returns private data)
- [ ] Session handling is correct (no stale sessions, proper expiry)
- [ ] New pages are added to the correct auth layout (protected vs public)

### Input Validation

- [ ] All user inputs validated with Zod schemas
- [ ] Validation happens on BOTH client (UX) and server (security)
- [ ] No raw SQL or string concatenation in queries
- [ ] File uploads validated (type, size, content)
- [ ] URL parameters validated (not just trusted)

### Error Handling

- [ ] No raw error messages exposed to users (stack traces, SQL errors)
- [ ] Errors logged with enough context to debug
- [ ] User-facing errors are helpful ("Trip not found" not "null reference")
- [ ] Network errors handled gracefully (retry, fallback, offline state)
- [ ] Form errors displayed per-field (not generic "something went wrong")

### Data Integrity

- [ ] Database constraints match business rules (not-null, unique, foreign keys)
- [ ] Cascading deletes are intentional (not accidental)
- [ ] Transactions used for multi-step operations
- [ ] Optimistic updates have rollback handling
- [ ] No data loss paths (confirm before delete, soft-delete where appropriate)

### Test Coverage

- [ ] New code has unit tests
- [ ] Critical paths have E2E tests
- [ ] Edge cases tested (empty, null, max-length, special characters)
- [ ] Test coverage did NOT decrease (check before vs after)
- [ ] Tests actually assert meaningful behavior (not just "doesn't throw")

### Design Compliance

- [ ] `/design-verify` passes (no anti-slop violations)
- [ ] Design tokens used (no hardcoded colors/spacing)
- [ ] All 4 states implemented (loading, error, empty, data)
- [ ] Responsive at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] Accessibility: labels, roles, keyboard navigation, contrast

### Build and Type Safety

- [ ] `pnpm typecheck` passes (zero TypeScript errors)
- [ ] `pnpm build` succeeds (production build)
- [ ] No `any` types introduced (use `unknown` + type guards)
- [ ] No `@ts-ignore` or `@ts-expect-error` added without comment explaining why
- [ ] No unused imports or variables

---

## Review Outcomes

### Pass

All checklist items verified. Proceed to merge/deploy.

### Pass with Notes

Minor issues found but not blocking. Document the notes, create follow-up tasks if needed, proceed to merge.

Examples:
- "Consider extracting this into a shared util in the future"
- "Test coverage could be improved for edge case X"
- "Variable naming could be clearer"

### Fail

Blocking issues found. Must fix before merge.

Examples:
- "This endpoint has no auth middleware"
- "User input is passed directly to SQL query"
- "Error message exposes internal database schema"
- "No tests for the new feature"

### Fail with Rework

Fundamental design issues. Needs significant changes.

Examples:
- "This should be a server-side operation, not client-side"
- "The data model doesn't support the required queries"
- "This duplicates existing functionality in [other module]"

---

## When to Skip Review

You can skip review gates ONLY when ALL of these are true:

1. The change is cosmetic only (typo fix, comment update, CSS adjustment)
2. No logic changes
3. No auth changes
4. No data model changes
5. All tests still pass
6. Build still succeeds

**If in doubt, review.** A 5-minute review is cheaper than a production bug.

---

## Review Frequency by Phase

| Project Phase | Review Intensity |
|--------------|-----------------|
| Foundation (auth, schema, core) | Every change reviewed |
| Feature building (CRUD, UI) | Major features reviewed, small changes self-reviewed |
| Polish (design, UX) | Design review only, logic review if changed |
| Pre-launch | Every change reviewed |
| Post-launch hotfix | Every change reviewed by at least 2 |

---

## Integration with CI/CD

If your project has CI/CD (GitHub Actions, Vercel checks):

```yaml
# .github/workflows/review.yml
on:
  pull_request:
    branches: [main]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm typecheck    # Gate: type safety
      - run: pnpm test         # Gate: unit tests
      - run: pnpm build        # Gate: build succeeds
      - run: pnpm test:e2e     # Gate: E2E tests
```

Automated gates catch mechanical issues. Human review catches design issues, security gaps, and logical errors that machines miss.

---

## Anti-Patterns

| Anti-Pattern | Why It's Dangerous |
|-------------|-------------------|
| "I'll review it later" | Later never comes, bugs ship |
| Review after deploy | Too late, users already affected |
| Review only the diff, not the context | Miss how the change interacts with existing code |
| Rubber-stamp reviews | Provides false confidence, misses real issues |
| Reviewing 500+ lines at once | Attention drops after ~200 lines, bugs slip through |
| No review for "small" auth changes | The smallest auth bug has the biggest impact |
