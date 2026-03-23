# State Management Strategy — {{PROJECT_NAME}}

> **Principle: Minimize client state.** Most "state" in a modern web app is actually server data. Let the server own it, and use TanStack Query to cache it.

---

## Decision Tree

Use this flowchart for every piece of state in the application:

```
Is this data from the server (DB, API)?
├── YES → TanStack Query (via tRPC hooks)
│         Examples: user profile, trip list, invoice data, driver status
│
└── NO → Is this form input?
    ├── YES → react-hook-form + Zod resolver
    │         Examples: create trip form, edit driver form, login form
    │
    └── NO → Is this shared between multiple components?
        ├── YES → Zustand store (rare — use sparingly)
        │         Examples: sidebar collapsed state, command palette open,
        │                   global notification queue, theme preference
        │
        └── NO → React useState/useReducer
                  Examples: modal open/closed, dropdown expanded,
                           local filter/sort, accordion state
```

---

## 1. Server State — TanStack Query (via tRPC)

### When to Use
- Any data that comes from the database or external API
- Data that multiple users can see/modify
- Data that needs caching, refetching, or invalidation

### Patterns

```typescript
// QUERY: Fetch data
// apps/web/app/(app)/{entities}/page.tsx
"use client";

import { api } from "~/lib/trpc";

export default function {Entities}Page() {
  const { data, isLoading, error } = api.{entity}.list.useQuery({
    page: 1,
    pageSize: 20,
    // filters...
  });

  if (isLoading) return <{Entity}ListSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.items.length) return <EmptyState entity="{entities}" />;

  return <{Entity}Table data={data.items} total={data.total} />;
}
```

```typescript
// MUTATION: Create/update/delete
const utils = api.useUtils();

const createMutation = api.{entity}.create.useMutation({
  onSuccess: () => {
    // Invalidate the list query to refetch
    utils.{entity}.list.invalidate();
    toast.success("{Entity} created");
    router.push("/{entities}");
  },
  onError: (err) => {
    toast.error(err.message);
  },
});
```

```typescript
// OPTIMISTIC UPDATE: Instant UI feedback
const toggleMutation = api.{entity}.toggleStatus.useMutation({
  onMutate: async (input) => {
    // Cancel in-flight queries
    await utils.{entity}.list.cancel();

    // Snapshot previous value
    const previous = utils.{entity}.list.getData();

    // Optimistically update
    utils.{entity}.list.setData(undefined, (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((item) =>
          item.id === input.id
            ? { ...item, status: input.status }
            : item
        ),
      };
    });

    return { previous };
  },
  onError: (_err, _input, context) => {
    // Rollback on error
    if (context?.previous) {
      utils.{entity}.list.setData(undefined, context.previous);
    }
    toast.error("Failed to update status");
  },
  onSettled: () => {
    // Always refetch to ensure consistency
    utils.{entity}.list.invalidate();
  },
});
```

### Cache Configuration

```typescript
// apps/web/lib/trpc.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute — data is "fresh" for 1 min
      gcTime: 1000 * 60 * 5, // 5 minutes — unused cache lives 5 min
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});
```

### Invalidation Rules

| Action | What to Invalidate |
|--------|-------------------|
| Create entity | `{entity}.list` |
| Update entity | `{entity}.list` + `{entity}.getById(id)` |
| Delete entity | `{entity}.list` |
| Bulk action | `{entity}.list` |
| Status change | `{entity}.list` + `{entity}.getById(id)` + related dashboard queries |
| Cross-entity | All affected entity queries (e.g., assign driver → invalidate `trip.list` + `driver.list`) |

---

## 2. Form State — react-hook-form

### When to Use
- Any user input form (create, edit, filter)
- Multi-step wizards
- Inline editing

### Pattern

```typescript
// apps/web/components/{entity}-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create{Entity}Schema, type Create{Entity}Input } from "@{PROJECT}/validators";

export function {Entity}Form({ defaultValues, onSubmit }: Props) {
  const form = useForm<Create{Entity}Input>({
    resolver: zodResolver(create{Entity}Schema),
    defaultValues: defaultValues ?? {
      name: "",
      status: "{DEFAULT_STATUS}",
      // ... other defaults
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage /> {/* Auto-displays Zod error */}
            </FormItem>
          )}
        />
        {/* ... more fields */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : "Save"}
        </Button>
      </form>
    </Form>
  );
}
```

### Form Rules

1. **Always use zodResolver** — Form validation matches API validation
2. **Always show FormMessage** — Every field gets inline error display
3. **Disable submit while submitting** — Prevent double-submit
4. **Show loading spinner on submit** — User knows something is happening
5. **Track dirty fields in edit mode** — Only send changed fields to API
6. **Reset form on success** — Prevent stale data in the form

---

## 3. Shared UI State — Zustand (Rare)

### When to Use
- State shared between components that aren't parent-child
- State that persists across page navigations
- State that doesn't belong to the server

### Example: UI Layout Store

```typescript
// apps/web/stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
    }),
    {
      name: "{project}-ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        // Don't persist commandPaletteOpen — it should always start closed
      }),
    }
  )
);
```

### Zustand Rules

1. **Keep stores tiny** — One store per concern, max 5-10 state fields
2. **Never put server data in Zustand** — That belongs in TanStack Query
3. **Use `persist` only for user preferences** — Sidebar state, theme, NOT business data
4. **Selectors for performance** — `useUIStore((s) => s.sidebarCollapsed)` not `useUIStore()`
5. **Think twice before creating a store** — `useState` in a shared layout often suffices

---

## 4. Local Component State — useState

### When to Use
- State that exists only within a single component
- UI state: modal open, dropdown expanded, accordion state
- Derived state: filtered/sorted view of server data
- Temporary state: typing in a search input before debounce

### Examples

```typescript
// Simple toggle
const [isOpen, setIsOpen] = useState(false);

// Local filter (derived from server data)
const [search, setSearch] = useState("");
const filteredItems = useMemo(
  () => items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  ),
  [items, search]
);

// Complex local state (useReducer)
const [state, dispatch] = useReducer(reducer, initialState);
```

### Rules

1. **Default to useState** — It's the simplest and usually sufficient
2. **Upgrade to useReducer** — When state transitions are complex (3+ related fields)
3. **Lift state only when necessary** — Start local, lift only if a sibling needs it
4. **Never useState for server data** — Always TanStack Query

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct Approach |
|-------------|----------------|------------------|
| Fetching in useEffect + useState | No caching, no error handling, race conditions | TanStack Query via tRPC |
| Redux for everything | Massive boilerplate for simple state | TanStack Query + useState |
| Zustand for server data | Stale data, no invalidation, no cache | TanStack Query |
| Prop drilling 5+ levels | Unmaintainable, fragile | Zustand store or React context |
| Global state for form inputs | Unnecessary complexity | react-hook-form |
| useState for data shared across pages | Lost on navigation | Zustand with persist |
