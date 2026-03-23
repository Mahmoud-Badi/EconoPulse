# Component Cataloger

**Purpose:** Scan all UI components in the frontend codebase and produce a structured
catalog with quality ratings, categorization, and gap analysis.

**Output:** `dev_docs/components/_index.md`

---

## When to Run

Run this generator:

- At project kickoff (baseline catalog)
- After adding a batch of new components
- Before planning a new feature (to find reusable components)

---

## Inputs Required

> **Note:** Paths below are examples for a Next.js monorepo. Adapt to your stack:
> - **Vue:** `src/components/**/*.vue`, `src/views/**/components/**/*.vue`
> - **Django:** `templates/**/*.html`, `{app}/templatetags/*.py` (template components)
> - **Rails:** `app/views/shared/**/*.html.erb`, `app/components/**/*.rb` (ViewComponent)

| Input | Location | What it provides |
| ----- | -------- | ---------------- |
| Component files | `{{COMPONENT_LIBRARY_PATH}}/**/*.tsx` | Components to catalog |
| App-local components | `{{FRONTEND_APP_PATH}}/**/components/**/*.tsx` | Page-specific components |
| Package components | `packages/ui/src/**/*.tsx` (if exists) | Shared package components |

### Exclude from Scan

- Test files: `*.test.tsx`, `*.spec.tsx`
- Story files: `*.stories.tsx`
- Index barrel files that only re-export (no component logic)
- Type-only files: `*.types.ts`, `*.d.ts`
- Utility files: `*.utils.ts`, `*.helpers.ts`

---

## Per-Component Analysis

For each component file, extract:

| Field | How to Find | Example |
| ----- | ----------- | ------- |
| **Name** | Default or named export | `Button` |
| **Path** | Relative file path from project root | `components/ui/button.tsx` |
| **Props Interface** | TypeScript interface/type for the component's props | `ButtonProps` |
| **Prop Count** | Number of props in the interface | 8 |
| **Dependencies** | Imports from other project components | `Badge`, `cn` |
| **External Deps** | Imports from npm packages | `lucide-react`, `@radix-ui/react-dialog` |
| **LOC** | Line count of the file | 45 |
| **Has Variants** | Uses `cva` or similar variant system | Yes/No |
| **Has Stories** | Matching `.stories.tsx` file exists | Yes/No |
| **Has Tests** | Matching `.test.tsx` file exists | Yes/No |
| **Category** | See categorization table below | Primitives |
| **Quality** | See quality rating below | Good |

---

## Categorization Rules

| Category | Criteria | Examples |
| -------- | -------- | ------- |
| **Primitives** | Shared UI atoms, no domain logic, highly reusable | Button, Input, Select, Badge, Card, Dialog, Tooltip |
| **Layout** | Page structure, navigation shells, persistent UI | Sidebar, Header, PageContainer, Breadcrumbs, Footer |
| **Data Display** | Present data in structured formats | DataTable, KPICard, StatusBadge, Timeline, Chart |
| **Forms** | Handle user input and validation | FormField, SearchInput, DateRangePicker, FileUpload, Combobox |
| **Feedback** | Communicate system state to user | Toast, LoadingSkeleton, ErrorState, EmptyState, ConfirmDialog, Spinner |
| **Navigation** | Move between views or sections | Tabs, Pagination, StepWizard, BreadcrumbNav, CommandPalette |
| **Domain/{Service}** | Service-specific, contains business logic | LoadCard, CarrierBadge, InvoiceRow, DispatchBoard |

### Categorization Algorithm

1. If the component is in `components/ui/` -- it is a **Primitive** (unless it is layout or feedback).
2. If the component is in `components/layout/` -- it is **Layout**.
3. If the component is in `components/{domain-prefix}/{service}/` -- it is **Domain/{Service}**.
4. If the component name includes `Table`, `Grid`, `List`, `Chart` -- it is **Data Display**.
5. If the component name includes `Form`, `Input`, `Select`, `Picker` -- it is **Forms**.
6. If the component name includes `Toast`, `Skeleton`, `Error`, `Empty`, `Loading` -- it is **Feedback**.
7. If the component name includes `Tab`, `Pagination`, `Step`, `Wizard` -- it is **Navigation**.

---

## Quality Rating

| Rating | Criteria |
| ------ | ------- |
| **Good** | All of: TypeScript typed (no `any`), handles all states (loading/error/empty if applicable), accessible (proper ARIA), uses design tokens (not hardcoded colors), reusable (reasonable props API), has stories or tests |
| **Needs Work** | Some of: Partially typed, missing states, hardcoded values, not accessible, tightly coupled to parent, no stories/tests |
| **Stub** | Any of: Minimal/placeholder implementation, returns null or hardcoded content, no real props, not functional |

### Quality Scoring Detail

For each component, check these 6 criteria (each worth 1 point):

1. **Typed:** Props interface exists, no `any` types
2. **States:** Handles loading, error, and empty states (if applicable)
3. **Accessible:** Has ARIA attributes, keyboard navigable (if interactive)
4. **Tokens:** Uses design tokens / semantic classes (no hardcoded `#hex` or `bg-blue-600`)
5. **Reusable:** Props are generic enough for multiple use cases
6. **Documented:** Has stories file or JSDoc comments

- 5-6 points = Good
- 3-4 points = Needs Work
- 0-2 points = Stub

---

## Catalog Output Format

Write the catalog to `dev_docs/components/_index.md`:

```markdown
# Component Catalog

> **Total:** {N} components
> **Good:** {n} ({percent}%) | **Needs Work:** {n} ({percent}%) | **Stubs:** {n} ({percent}%)
> **Last Updated:** {date}

---

## Summary by Category

| Category | Count | Good | Needs Work | Stubs |
| -------- | ----- | ---- | ---------- | ----- |
| Primitives | {n} | {n} | {n} | {n} |
| Layout | {n} | {n} | {n} | {n} |
| Data Display | {n} | {n} | {n} | {n} |
| Forms | {n} | {n} | {n} | {n} |
| Feedback | {n} | {n} | {n} | {n} |
| Navigation | {n} | {n} | {n} | {n} |
| Domain/{Service 1} | {n} | {n} | {n} | {n} |
| Domain/{Service 2} | {n} | {n} | {n} | {n} |
| **Total** | **{N}** | **{n}** | **{n}** | **{n}** |

---

## Full Catalog

### Primitives

| Component | Path | Props | Quality | LOC | Variants | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | -------- | ------- | ----- |
| Button | components/ui/button.tsx | ButtonProps (8) | Good | 45 | Yes | Yes | shadcn/ui base |

### Layout

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

### Data Display

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

### Forms

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

### Feedback

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

### Navigation

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

### Domain/{Service}

| Component | Path | Props | Quality | LOC | Stories | Notes |
| --------- | ---- | ----- | ------- | --- | ------- | ----- |

---

## Gap Analysis

### Missing Essential Components

Components that most applications need but were not found:

- [ ] ErrorBoundary -- catches and displays React errors
- [ ] EmptyState -- shown when a list/table has no data
- [ ] LoadingSkeleton -- shown while data is loading
- [ ] ConfirmDialog -- "Are you sure?" before destructive actions
- [ ] {other missing essentials}

### Duplicate Components

Components with overlapping functionality that should be consolidated:

| Component A | Component B | Recommendation |
| ----------- | ----------- | -------------- |
| {name} at {path} | {name} at {path} | Consolidate into {recommendation} |

### Components to Promote

Domain components that should be promoted to shared:

| Component | Current Path | Reason |
| --------- | ------------ | ------ |
| {name} | {domain path} | Used by {N} services, not domain-specific |

### Components with No Types

| Component | Path | Action Needed |
| --------- | ---- | ------------- |
| {name} | {path} | Add TypeScript props interface |
```

---

## Validation Checklist

After generation, verify:

- [ ] Every `.tsx` file in component directories is accounted for
- [ ] No test or story files are accidentally included as components
- [ ] Quality ratings are consistent (same criteria applied to all)
- [ ] Category totals sum to the total count
- [ ] Gap analysis identifies genuinely missing components (not false positives)
- [ ] Duplicate detection is accurate (similar name does not mean duplicate)
