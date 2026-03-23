# Stale Document Detector

> Post-development hook that detects when planning documents have diverged from actual code. Run after each sprint or as part of CI to catch documentation drift before it causes confusion.

---

## Purpose

Planning documents (service specs, schema docs, screen catalogs) are created during Steps 5-10 of the Orchestrator. As development progresses, code diverges from these plans. This detector compares documentation against code and flags discrepancies.

**This is not a blocker** — stale docs do not prevent deployment. But stale docs mislead developers and AI agents, causing wasted effort.

---

## Comparison Rules

### 1. Service Spec Endpoints vs Actual Route Files

**Docs to check:** `04-service-specs/{{SERVICE_NAME}}/api-reference.md`
**Code to check:** `{{PROJECT_ROOT}}/src/app/api/**/*.ts`, `{{PROJECT_ROOT}}/src/routes/**/*.ts`, or framework-equivalent

| Check | How |
|-------|-----|
| Documented endpoint exists in code | For each `GET /api/...` in the spec, verify a matching route file exists |
| Code endpoint exists in docs | For each route file, verify it appears in a service spec |
| HTTP methods match | If spec says `GET`, code shouldn't only have `POST` |
| Request/response shapes | Compare documented payload shapes against actual types/validators |

### 2. Database Schema Docs vs Actual Schema/Migration Files

**Docs to check:** `04-service-specs/{{SERVICE_NAME}}/data-model.md`, `02-architecture/database-schema.md`
**Code to check:** `{{PROJECT_ROOT}}/prisma/schema.prisma`, `{{PROJECT_ROOT}}/src/db/schema.ts`, or framework-equivalent

| Check | How |
|-------|-----|
| Documented tables/models exist in schema | For each table in docs, verify a matching model in schema file |
| Schema models exist in docs | For each model in schema, verify it appears in docs |
| Column/field names match | Compare documented fields against actual model fields |
| Relationships documented | Foreign keys and relations in code should appear in docs |

### 3. Screen Catalog vs Actual Route/Page Files

**Docs to check:** `03-documentation/feature-docs/screen-catalog.md`
**Code to check:** `{{PROJECT_ROOT}}/src/app/**/page.tsx`, `{{PROJECT_ROOT}}/src/pages/**/*.tsx`, or framework-equivalent

| Check | How |
|-------|-----|
| Documented screens have corresponding page files | Each screen in the catalog should map to an actual page/route |
| Page files appear in the catalog | Each page file should have an entry in the screen catalog |
| Route paths match | Documented URL paths should match actual file-based routing paths |

### 4. Permission Catalog vs Actual Middleware/Guard Files

**Docs to check:** `02-architecture/permissions-catalog.md`, `04-service-specs/{{SERVICE_NAME}}/permissions.md`
**Code to check:** `{{PROJECT_ROOT}}/src/middleware.ts`, `{{PROJECT_ROOT}}/src/lib/auth/guards.ts`, or framework-equivalent

| Check | How |
|-------|-----|
| Documented roles exist in code | Each role in the permission catalog should appear in auth code |
| Permission checks match docs | If docs say "admin only", the route should have admin guard |
| New permissions captured | Any permission check in code should appear in the catalog |

---

## Output Format

The detector produces a report in this format:

```markdown
# Stale Document Report — {{PROJECT_NAME}}
**Generated:** YYYY-MM-DD HH:MM
**Sprint:** {{CURRENT_SPRINT}}

## Summary
- Endpoints: 2 stale (1 missing from docs, 1 missing from code)
- Schema: 1 stale (new table not in docs)
- Screens: 0 stale
- Permissions: 1 stale (new role not in catalog)

## Details

### STALE: Endpoint in code but not in docs
- **File:** `src/app/api/invitations/route.ts` (POST, DELETE)
- **Action:** Add to `04-service-specs/core/api-reference.md`
- **Severity:** Medium

### STALE: Table in docs but not in code
- **Doc:** `04-service-specs/analytics/data-model.md` references `page_views` table
- **Action:** Either implement the table or remove from docs (deferred to Phase 2?)
- **Severity:** Low

### STALE: Role in code but not in permission catalog
- **File:** `src/lib/auth/guards.ts` references role `super_admin`
- **Action:** Add to `02-architecture/permissions-catalog.md`
- **Severity:** Medium
```

---

## Severity Levels

| Severity | Meaning | Action |
|----------|---------|--------|
| **High** | Security or data-related discrepancy (permissions, sensitive data flows) | Fix before next sprint |
| **Medium** | Functional discrepancy (endpoints, screens, schema) | Fix during next sprint |
| **Low** | Cosmetic or deferred-scope discrepancy | Flag in STATUS.md, fix when convenient |

---

## Integration Instructions

### Option 1: Sprint-End Check (Recommended)

Add to your sprint-end ritual (`session-ritual.md`):

```markdown
## Sprint-End Documentation Check
1. Run the stale document detector
2. Review the report
3. Fix High-severity items immediately
4. Add Medium-severity items to next sprint's tasks
5. Log Low-severity items in STATUS.md under "Documentation Debt"
```

### Option 2: Pre-Commit Hook

Add to `.husky/pre-commit`: warn when API routes or schema files are modified without corresponding doc updates.

### Option 3: CI Pipeline Step

Add a non-blocking CI step that runs the detector and outputs warnings (does not fail the build).

---

## STATUS.md Integration

When stale documents are detected, add a section to STATUS.md:

```markdown
## Documentation Drift
- [ ] `api-reference.md` missing 2 new endpoints (Medium) — added Sprint 5
- [ ] `permissions-catalog.md` missing `super_admin` role (Medium) — added Sprint 5
- [x] `data-model.md` updated with `invitations` table — resolved Sprint 4
```

---

## Limitations

- **Cannot detect semantic drift** — if an endpoint's behavior changed but the URL stayed the same, this detector won't catch it. Rely on API tests for that.
- **Framework-specific** — detection commands must be adapted for your stack (Next.js, Express, Django, Rails, etc.).
- **Not a substitute for tests** — this catches documentation staleness, not code correctness.
