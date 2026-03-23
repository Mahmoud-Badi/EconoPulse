# Implementation Specification: {{FEATURE_NAME}}

> **The most detailed template in the documentation suite.** Every feature gets one of these before implementation begins. If a question arises during coding, the answer should be here.

---

## Feature Metadata

| Field | Value |
|-------|-------|
| Feature ID | `F-{{NNN}}` |
| Feature Name | {{FEATURE_NAME}} |
| Priority | {P0/P1/P2/P3} (P0=critical, P3=nice-to-have) |
| Effort | {S/M/L/XL} (S=1-2h, M=3-5h, L=6-12h, XL=12h+) |
| Phase | Phase {N} — {{PHASE_NAME}} |
| Status | {Not Started / In Progress / Complete} |
| Depends On | {F-XXX, F-YYY} or "None" |
| Assigned To | {DEVELOPER/AI_AGENT} |

---

## Feature Overview

### What
{2-3 sentences describing what this feature does. Be specific — "Users can create, view, edit, and delete trips with passenger, route, and fare information" not "Trip management."}

### Why
{Why this feature matters to the business. What user pain does it solve? What workflow does it enable?}

### Where
{Where in the app this feature lives. Page routes, sidebar location, how users navigate to it.}

- **Primary page:** `/{{ROUTE}}`
- **Detail page:** `/{{ROUTE}}/[id]`
- **Create page:** `/{{ROUTE}}/new`
- **Edit page:** `/{{ROUTE}}/[id]/edit`
- **Sidebar location:** {{SECTION}} → {{ITEM}}

### Priority Justification
{Why this priority level? What depends on this feature? What breaks without it?}

---

## User Stories

### Story 1: {{ACTION}}

**As a** {{ROLE}},
**I want to** {{ACTION}},
**So that** {{BENEFIT}}.

**Acceptance Criteria:**
- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}
- [ ] {{CRITERION_4}}

### Story 2: {{ACTION}}

**As a** {{ROLE}},
**I want to** {{ACTION}},
**So that** {{BENEFIT}}.

**Acceptance Criteria:**
- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}

### Story 3: {{ACTION}}

**As a** {{ROLE}},
**I want to** {{ACTION}},
**So that** {{BENEFIT}}.

**Acceptance Criteria:**
- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}

> Add as many stories as needed. Each story should represent a distinct user capability.

---

## Data Model Changes

### New Tables

| Table | Purpose | Columns (key) | Spec |
|-------|---------|--------------|------|
| `{table_1}` | {{PURPOSE}} | id, name, status, companyId | [table doc](../database-docs/{table_1}.md) |
| `{table_2}` | {{PURPOSE}} | id, {table_1}Id, type | [table doc](../database-docs/{table_2}.md) |

### Modified Tables

| Table | Change | Reason |
|-------|--------|--------|
| `{existing_table}` | Add column `{new_column}` ({type}) | {{REASON}} |

### New Enums

| Enum | Values | Used By |
|------|--------|---------|
| `{entity}StatusEnum` | {{STATUS_1}}, {{STATUS_2}}, {{STATUS_3}} | `{table_1}.status` |

---

## API Specification

### New Router: `{entity}Router`

Full spec: [router-spec.md](../api-docs/{entity}.md)

| Procedure | Type | Auth | Input Summary | Output Summary |
|-----------|------|------|--------------|---------------|
| `list` | query | protected | filters, pagination | `{ items, total }` |
| `getById` | query | protected | `{ id }` | Entity + relations |
| `create` | mutation | protected | Create schema | Created entity |
| `update` | mutation | protected | ID + partial schema | Updated entity |
| `delete` | mutation | {role} | `{ id }` | `{ success }` |
| `updateStatus` | mutation | protected | `{ id, status }` | Updated entity |

### Input Schemas

```typescript
// packages/validators/src/{entity}.ts

export const create{Entity}Schema = z.object({
  {field_1}: z.string().min(1, "{Field1} is required").max(100),
  {field_2}: z.string().uuid("{Field2} must be selected"),
  {field_3}: z.enum(["{OPTION_1}", "{OPTION_2}", "{OPTION_3}"]),
  {field_4}: z.number().min(0, "Cannot be negative"),
  {field_5}: z.string().max(1000).optional(),
});

export const update{Entity}Schema = create{Entity}Schema.partial().extend({
  id: z.string().uuid(),
});

export const {entity}FilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["{STATUS_1}", "{STATUS_2}", "{STATUS_3}"]).optional(),
  {filterField}: z.string().uuid().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "createdAt", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
```

### Output Types

```typescript
// Inferred from Drizzle select + joins
type {Entity}ListItem = {
  id: string;
  {field_1}: string;
  {field_2}: string;
  status: "{STATUS_1}" | "{STATUS_2}" | "{STATUS_3}";
  {relation}: { id: string; name: string }; // Joined
  createdAt: Date;
  updatedAt: Date;
};

type {Entity}Detail = {Entity}ListItem & {
  {relation_detail}: {RelatedEntity}; // Full related entity
  {children}: {ChildEntity}[]; // Has-many
  statusHistory: StatusHistoryEntry[]; // Audit trail
};
```

---

## UI Components

### Component Tree

```
{Entity}ListPage
├── PageHeader (title + "New {Entity}" button)
├── {Entity}Filters (search, status dropdown, date range)
├── {Entity}Table (DataTable with columns)
│   ├── StatusBadge (colored status indicator)
│   ├── {Relation}Cell (linked name)
│   └── ActionsDropdown (view, edit, delete)
├── Pagination
└── EmptyState (when no records)

{Entity}DetailPage
├── PageHeader (title + breadcrumb + action buttons)
├── {Entity}InfoCard (main details)
├── {Relation}Card (related entity info)
├── StatusTimeline (chronological status changes)
├── {Entity}Actions (status change buttons, edit, delete)
└── NotesSection (view/edit notes)

{Entity}FormPage
├── PageHeader (title + breadcrumb)
└── {Entity}Form
    ├── TextInput (name)
    ├── Combobox (related entity FK)
    ├── Select (status/type)
    ├── DatePicker (date fields)
    ├── MoneyInput (amount fields)
    ├── Textarea (notes)
    └── FormActions (cancel + submit)
```

### State Management

| Component | State Source | Cache Strategy |
|-----------|-------------|---------------|
| {Entity}ListPage | `api.{entity}.list.useQuery()` | 1min stale, refetch on focus |
| {Entity}DetailPage | `api.{entity}.getById.useQuery()` | 1min stale |
| {Entity}Form | `react-hook-form` + `zodResolver` | N/A (local form state) |
| {Entity}Filters | `useState` + URL search params | Persist in URL |
| StatusBadge | Props (pure component) | N/A |

### Interaction Specification

| User Action | System Response | Feedback |
|-------------|----------------|----------|
| Click "New {Entity}" | Navigate to `/{entities}/new` | Button shows loading briefly |
| Submit create form | POST mutation → redirect to list | Loading spinner → success toast |
| Click row in table | Navigate to `/{entities}/{id}` | Row highlights on hover |
| Click edit button | Navigate to `/{entities}/{id}/edit` | |
| Click delete button | Confirmation dialog → soft delete | Dialog → success toast |
| Change status | Status modal → mutation | Optimistic badge update → toast |
| Search/filter | Debounce 300ms → refetch list | Loading skeleton during refetch |
| Sort column | Instant URL param update → refetch | Arrow indicator changes |

---

## Testing Requirements

### Unit Tests (`packages/api/src/__tests__/{entity}.test.ts`)

| Test | Category | Priority |
|------|----------|----------|
| `list` returns paginated results | Query | P0 |
| `list` filters by status | Query | P0 |
| `list` excludes other companies' data | Security | P0 |
| `getById` returns entity with relations | Query | P0 |
| `getById` throws NOT_FOUND for wrong company | Security | P0 |
| `create` saves valid input | Mutation | P0 |
| `create` rejects invalid input | Validation | P0 |
| `create` sets companyId from session | Security | P0 |
| `update` only changes dirty fields | Mutation | P1 |
| `delete` soft deletes | Mutation | P1 |
| `delete` rejects if dependencies exist | Business logic | P1 |
| `updateStatus` enforces transitions | Business logic | P0 |
| `updateStatus` creates history entry | Audit | P1 |

### Integration Tests

| Test | Scenario |
|------|----------|
| Full CRUD flow | Create → Read → Update → Delete |
| Status workflow | {{STATUS_1}} → {{STATUS_2}} → {{STATUS_3}} |
| Multi-tenant isolation | Company A can't see Company B's data |

### E2E Tests (`apps/web/e2e/{entity}.spec.ts`)

| Test | Steps |
|------|-------|
| Create {entity} | Login → Navigate → Fill form → Submit → Verify in list |
| View {entity} detail | Login → Navigate to list → Click row → Verify detail page |
| Edit {entity} | Navigate to detail → Click edit → Change fields → Save → Verify |
| Delete {entity} | Navigate to detail → Click delete → Confirm → Verify removed |
| Filter list | Navigate to list → Apply filter → Verify filtered results |

---

## Edge Cases

> **Every feature must handle at least 10 edge cases.** Think about what can go wrong.

1. **Empty state** — User has no {entities} yet. Show helpful empty state with CTA.
2. **Long names** — {Entity} name exceeds display width. Truncate with ellipsis, show full on hover.
3. **Concurrent edits** — Two users edit same {entity}. Last write wins, show "Updated by someone else" if stale.
4. **Rapid clicks** — User double-clicks submit. Disable button on first click, prevent duplicate creation.
5. **Network failure during save** — Save fails mid-request. Show error toast, keep form data, allow retry.
6. **FK reference deleted** — Related entity deleted after {entity} created. Show "Unknown" or "(deleted)" in display.
7. **Pagination boundary** — Exactly {pageSize} records. Verify pagination shows correct total, no off-by-one.
8. **Special characters** — Name contains quotes, ampersands, HTML entities. Must escape properly.
9. **Maximum records** — 10,000+ {entities}. List performance must stay under 200ms. Test with large dataset.
10. **Browser back button** — User hits back during create. Form data lost (acceptable) or preserved (ideal).
11. **Mobile viewport** — All pages must be usable on 375px width. Table becomes card layout.
12. **Timezone handling** — Dates stored UTC, displayed in user's company timezone.

---

## Rollback Plan

If this feature causes issues in production:

1. **Feature flag** — {{FEATURE_FLAG_NAME}} can disable the entire feature without deployment
2. **Database** — Schema changes are additive only (no column removals). Rollback = deploy previous code
3. **API** — Router can be removed from root router without affecting other routers
4. **UI** — Pages are isolated, removing the route has no side effects

---

## Dependencies

### Must Exist Before This Feature

| Dependency | Why | Status |
|-----------|------|--------|
| Auth system | Need session for company-scoped queries | {{STATUS}} |
| {{RELATED_ENTITY}} CRUD | FK reference in create form | {{STATUS}} |
| DataTable component | List page uses shared table | {{STATUS}} |
| Form components | Create/edit forms | {{STATUS}} |

### This Feature Enables

| Dependent Feature | How |
|------------------|-----|
| {{FUTURE_FEATURE_1}} | References {entity} data |
| {{FUTURE_FEATURE_2}} | Aggregates {entity} for reports |
| Dashboard | Shows {entity} counts/stats |

---

## Implementation Checklist

- [ ] Zod schemas in `packages/validators/src/{entity}.ts`
- [ ] Drizzle schema in `packages/db/src/schema/{entity}.ts`
- [ ] Relations in `packages/db/src/schema/relations.ts`
- [ ] Migration generated and applied
- [ ] Seed data in `packages/db/src/seed/{{NN}}-{entity}.ts`
- [ ] tRPC router in `packages/api/src/routers/{entity}.ts`
- [ ] Router added to root router
- [ ] List page at `apps/web/app/(app)/{entities}/page.tsx`
- [ ] Detail page at `apps/web/app/(app)/{entities}/[id]/page.tsx`
- [ ] Create page at `apps/web/app/(app)/{entities}/new/page.tsx`
- [ ] Edit page at `apps/web/app/(app)/{entities}/[id]/edit/page.tsx`
- [ ] Loading states (skeletons) for all pages
- [ ] Error states for all pages
- [ ] Empty state for list page
- [ ] Unit tests (all procedures)
- [ ] E2E test (critical path)
- [ ] Sidebar nav item added
- [ ] `/design-verify` passed
- [ ] STATUS.md counts updated
