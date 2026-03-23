# State Management Decision Tree

> **Purpose:** Choose the right state management approach for each piece of state in your application. The goal is to use the simplest tool that works — not the most powerful.

---

## The Decision Flowchart

```
Does the data come from an API/server?
├── YES → Use a server state library (TanStack Query / SWR / RTK Query)
│         Do NOT duplicate into a global store.
│
└── NO → Is it URL-derived? (filters, pagination, search, tab selection)
    ├── YES → Use URL state (searchParams / useSearchParams)
    │         Users can bookmark and share the exact view.
    │
    └── NO → Is it form input data?
        ├── YES → Use a form library (react-hook-form / Formik)
        │         Do NOT sync form state to a global store.
        │
        └── NO → Is it shared across multiple routes/pages?
            ├── YES → Use a lightweight global store (Zustand / Jotai)
            │         Keep the store small — only truly global state.
            │
            └── NO → Is it shared across sibling components?
                ├── YES → Lift state up or use React Context (small scope)
                │
                └── NO → Use local state (useState / useReducer)
                          This is the right answer more often than you think.
```

---

## Quick Reference

| State Type | Tool | Example |
|-----------|------|---------|
| Server data (lists, details, counts) | TanStack Query | User list, project details, dashboard stats |
| URL-derived (filters, pagination, tabs) | `useSearchParams` | `?status=active&page=2&sort=name` |
| Form input | react-hook-form | Create project form, settings page |
| Auth session / user identity | Auth library + Context | Current user, permissions, role |
| Theme / preferences | Zustand (persisted) | Dark mode, sidebar collapsed, locale |
| Ephemeral UI (modals, toasts, dropdowns) | `useState` or Zustand | Modal open/close, toast queue |
| Complex local logic | `useReducer` | Multi-step wizard, drag-and-drop state |
| Cross-cutting global | Zustand | Shopping cart, notification count, feature flags |

---

## Comparison Table

| Criteria | useState | useReducer | Context | Zustand | Jotai | Redux Toolkit | TanStack Query |
|----------|---------|-----------|---------|---------|-------|---------------|---------------|
| Learning curve | Trivial | Low | Low | Low | Low | Medium | Medium |
| Boilerplate | None | Some | Some | Minimal | Minimal | Significant | Some |
| DevTools | React DevTools | React DevTools | React DevTools | Dedicated | Dedicated | Dedicated | Dedicated |
| Re-render scope | Component | Component | All consumers | Selector-based | Atom-based | Selector-based | Query-based |
| Persistence | Manual | Manual | Manual | Built-in middleware | Built-in | Built-in | Built-in cache |
| Server state | No | No | No | No | No | With RTK Query | Yes (primary use) |
| Best for | Local UI | Complex local logic | Small shared state | Global client state | Fine-grained atoms | Large complex state | Server data |

---

## When NOT to Use a Global Store

These are the most common mistakes:

**Do not put server data in a global store.**
If it came from an API, it belongs in TanStack Query. The query cache IS your store for server data. Duplicating it into Zustand/Redux means you now have two sources of truth that can get out of sync.

**Do not put form data in a global store.**
Form state belongs in the form library. If you need to persist form data across navigation (multi-step wizard), use URL state or sessionStorage — not a global store.

**Do not put ephemeral UI state in a global store.**
Whether a modal is open, which dropdown is expanded, whether a tooltip is visible — these are local concerns. Use `useState`. The only exception is a global toast/notification system.

**Do not use Context for frequently-updating state.**
React Context causes every consumer to re-render on any change. If state updates more than a few times per second (drag position, scroll offset, animation frame), use Zustand or a ref.

---

<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
## Next.js-Specific Patterns

### Server Components vs Client State

Server Components have no state. They fetch data at request time:

```tsx
// app/projects/page.tsx (Server Component — no state needed)
export default async function ProjectsPage() {
  const projects = await getProjects(); // Direct DB/API call
  return <ProjectList projects={projects} />;
}
```

Client Components use hooks for interactivity:

```tsx
// components/project-filter.tsx
"use client";
import { useSearchParams } from "next/navigation";

export function ProjectFilter() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";
  // Filter state lives in the URL
}
```

### State Location Priority (Next.js)

1. **Server Component props** — data fetched at request time
2. **URL searchParams** — filters, pagination, tabs
3. **TanStack Query** — client-side data that needs refetching, optimistic updates
4. **Zustand** — truly global client state (auth context is from your auth library, not Zustand)
5. **useState** — component-local interactivity
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "vue" -->
## Vue-Specific Patterns

### Pinia (Recommended)

Pinia is the standard state management for Vue 3:

```typescript
// stores/useProjectStore.ts
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('projects', {
  state: () => ({
    selectedFilter: 'all',
    sidebarCollapsed: false,
  }),
  actions: {
    setFilter(filter: string) {
      this.selectedFilter = filter;
    },
  },
});
```

### State Location Priority (Vue)

1. **Component props** — data passed from parent
2. **Route query params** — `useRoute().query` for filters, pagination
3. **Composables** — shared logic via `use*` functions
4. **Pinia stores** — truly global state
5. **`ref()` / `reactive()`** — component-local state
<!-- ENDIF -->

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad | What to Do Instead |
|-------------|-------------|-------------------|
| God store (everything in one store) | Hard to debug, unnecessary re-renders | Split into domain-specific stores |
| Duplicating server state in store | Two sources of truth, stale data | Use TanStack Query / SWR |
| Prop drilling > 3 levels deep | Fragile, hard to refactor | Use Context or Zustand for that subtree |
| Context for high-frequency updates | Every consumer re-renders | Use Zustand with selectors |
| Global state for form validation | Couples form to global state | Use react-hook-form |
| Derived state stored as state | Gets out of sync | Compute it (useMemo, computed) |

---

## Implementation Cross-Reference

For detailed implementation patterns, code examples, and configuration guides, see:
- `11-new-capabilities/state-management-patterns.md` — TanStack Query setup, Zustand patterns, form state patterns
- `03-documentation/architecture-docs/state-management.template.md` — Project-specific state management documentation template

---

*Generated by the Master Starter Kit. This is an architecture decision guide — choose your approach early and document it in the Architecture Decision Log.*
