# Code Template Index

> Spec for generating project-specific code templates for **{{PROJECT_NAME}}**. These are not the templates themselves — they define what to generate, where to place them, and what patterns each must include.

---

## Output Location

All generated templates go to: `{{PROJECT_ROOT}}/dev_docs/templates/`

Generate these during Phase A (Infrastructure) using the project's actual stack, ORM, and framework. Regenerate whenever the stack changes.

---

## Template Registry

| Template Type | Filename Pattern | Output Location | Stack |
|---------------|-----------------|-----------------|-------|
| tRPC Router | `router.template.ts` | `dev_docs/templates/` | {{BACKEND_FRAMEWORK}} |
| Drizzle Schema | `schema.template.ts` | `dev_docs/templates/` | {{ORM}} |
| React Component | `component.template.tsx` | `dev_docs/templates/` | {{FRONTEND_FRAMEWORK}} |
| React Page | `page.template.tsx` | `dev_docs/templates/` | {{FRONTEND_FRAMEWORK}} |
| Mobile Screen | `screen.template.tsx` | `dev_docs/templates/` | {{MOBILE_FRAMEWORK}} |
| Unit Test | `unit.template.test.ts` | `dev_docs/templates/` | {{TEST_FRAMEWORK}} |
| Integration Test | `integration.template.test.ts` | `dev_docs/templates/` | {{TEST_FRAMEWORK}} |
| E2E Test | `e2e.template.spec.ts` | `dev_docs/templates/` | {{E2E_FRAMEWORK}} |
| Migration | `migration.template.ts` | `dev_docs/templates/` | {{ORM}} |
| Custom Hook | `hook.template.ts` | `dev_docs/templates/` | {{FRONTEND_FRAMEWORK}} |

---

## Per-Template Requirements

Every generated template MUST include the following sections. If a section does not apply, include a comment explaining why it was omitted.

### Imports Block
- Framework imports (React, Next.js, tRPC, etc.)
- Shared utility imports (`{{PROJECT_ROOT}}/src/lib/`)
- Type imports from the project's type definitions
- No wildcard imports — explicit named imports only

### Boilerplate Structure
- File-level JSDoc comment with `@module`, `@description`, `@see` (linking to the spec that drove it)
- Named export (no default exports unless framework requires it)
- TypeScript strict mode compatible — no `any` types

### Error Handling Pattern
- tRPC routers: `TRPCError` with appropriate code (`NOT_FOUND`, `FORBIDDEN`, `BAD_REQUEST`)
- React components: Error Boundary wrapper or `ErrorFallback` prop
- Hooks: Return `{ data, error, isLoading }` shape consistently
- Migrations: Wrap in transaction with rollback on failure

### Test File Companion
- Every template generates with a co-located test file (e.g., `component.template.tsx` includes `component.template.test.tsx`)
- Test file imports the subject, mocks dependencies, and includes at least one passing skeleton test
- Test file uses `describe` / `it` blocks matching the component's public API

---

## Conditional Requirements

<!-- IF {{MULTI_TENANT}} == "true" -->
### Multi-Tenant Isolation
- Every database query template includes `WHERE tenant_id = ?` or equivalent scope filter
- tRPC routers inject `tenantId` from session context — never accept it from client input
- React components never display cross-tenant data
- Test templates include a "tenant isolation" test case verifying no data leakage
<!-- ENDIF -->

<!-- IF {{COMPLIANCE_LEVEL}} == "hipaa" -->
### HIPAA Audit Logging
- Every mutation (create, update, delete) logs to the audit table: `userId`, `action`, `resourceType`, `resourceId`, `timestamp`, `previousValue`, `newValue`
- PHI fields are never logged in plain text — use field-level references only
- Read access to PHI resources is logged with `action: "view"`
- Audit log entries are immutable — no UPDATE or DELETE on audit table
<!-- ENDIF -->

---

## Template Generation Instructions

1. **Read the stack** — Pull `{{FRONTEND_FRAMEWORK}}`, `{{BACKEND_FRAMEWORK}}`, `{{ORM}}`, `{{TEST_FRAMEWORK}}` from the resolved placeholder registry
2. **Generate each template** — Use the patterns above, substituting the project's actual imports, paths, and conventions
3. **Validate** — Each generated template must compile without errors when placed in the project
4. **Index** — Create `dev_docs/templates/INDEX.md` listing every template with a one-line description

---

## Stack-Specific Notes

| Stack | Notes |
|-------|-------|
| Next.js App Router | Pages use `export default function`, not arrow functions. Include `metadata` export. |
| tRPC v11 | Use `publicProcedure` / `protectedProcedure` pattern. Input validation via Zod. |
| Drizzle ORM | Schema files export table definitions. Use `pgTable` / `mysqlTable` per `{{DB_TYPE}}`. |
| Vitest | Use `vi.mock()` for module mocking. Configure in `vitest.config.ts`. |
| Playwright | E2E templates use `test.describe` and `page.goto` with `{{BASE_URL}}`. |
| React Native | Screen templates use `SafeAreaView` wrapper. Navigation typed via `{{NAV_LIBRARY}}`. |

---

## Maintenance

- **When to regenerate:** After adding a new framework, changing ORM, or updating auth patterns
- **Who owns this:** The developer who set up `05-dev-infrastructure`
- **Review cadence:** At the start of each new phase, verify templates match current patterns
