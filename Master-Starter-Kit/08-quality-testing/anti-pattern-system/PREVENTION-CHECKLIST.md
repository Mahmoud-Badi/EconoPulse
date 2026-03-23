# Anti-Pattern Prevention Checklist

Run this 16-item checklist before committing any feature work. Each item maps to one or more anti-patterns.

---

## Pre-Commit Checklist

### API Layer (AP-001, AP-005, AP-006, AP-010)

- [ ] **1. Endpoints exist** — Every API call in frontend has a corresponding backend endpoint (verified with `grep`)
- [ ] **2. Envelope unwrapped** — API response envelope is unwrapped correctly (`response.data.data` not `response.data`)
- [ ] **3. HTTP methods correct** — GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes
- [ ] **4. No doubled prefixes** — API calls don't duplicate the base URL prefix

### UI Layer (AP-002, AP-007, AP-008)

- [ ] **5. No stub buttons** — Every button has a handler OR is explicitly disabled with explanation
- [ ] **6. All 4 states present** — Loading, error, empty, and data states implemented for every data component
- [ ] **7. No force reload** — No `window.location.reload()` — use cache invalidation instead
- [ ] **8. Responsive** — Tested at desktop (1440px), tablet (768px), and mobile (375px)

### Data Layer (AP-004, AP-011)

- [ ] **9. No mock data** — No hardcoded test data in production code (`grep "test.com\|John Doe\|TODO"`)
- [ ] **10. Tenant filtered** — Every database query includes tenant/context filter
- [ ] **11. Soft-delete filtered** — Queries filter out `deletedAt IS NOT NULL` records
- [ ] **12. Validation present** — DTOs have validation decorators, forms have client-side validation

### Code Quality (AP-003, AP-009)

- [ ] **13. No unstable deps** — No inline objects/arrays as useEffect dependencies
- [ ] **14. No `any` types** — Zero `any` types in production code (use `unknown` + type guards)
- [ ] **15. TypeScript strict** — `pnpm typecheck` passes with zero errors
- [ ] **16. Tests exist** — Unit tests for business logic, E2E for critical user paths

---

## Quick Command Summary

```bash
# Run all automated checks:
pnpm typecheck          # Check 13, 14, 15
pnpm lint               # Check 13, 14
pnpm test               # Check 16

# Manual checks (run these grep commands):
grep -r "window.location.reload" --include="*.ts" --include="*.tsx"   # Check 7
grep -r "test.com\|example.com\|John Doe" --include="*.ts"            # Check 9
grep -r "findMany\|findFirst" --include="*.ts" | grep -v "tenantId"   # Check 10
grep -rn ": any" --include="*.ts" --include="*.tsx"                    # Check 14
```

---

## When to Run This Checklist

| Trigger | Scope |
|---------|-------|
| Before every commit | Changed files only |
| Before every PR | All files in the PR |
| Before sprint review | All files changed in the sprint |
| Before release | Full codebase scan |
| After tribunal MODIFY verdict | Affected service's files |

---

## Tracking Anti-Pattern Occurrences

When you find a violation during this checklist:

1. Fix the violation immediately
2. Check: Is this anti-pattern documented in ANTI-PATTERN-STARTER.md?
   - YES → Increment the occurrence count
   - NO → Create a new anti-pattern entry using ANTI-PATTERN-TEMPLATE.md
3. If found in 3+ services → Promote to Cross-Cutting Finding (CCF)
