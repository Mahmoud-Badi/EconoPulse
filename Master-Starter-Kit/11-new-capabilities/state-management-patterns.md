# State Management Patterns

## Purpose

Establish clear patterns for managing different kinds of state in a React application. The core principle: use the right tool for each type of state. Most applications need far less global state than developers think.

## Server State vs Client State Decision Framework

| Question                                  | If Yes                    | If No                 |
| ----------------------------------------- | ------------------------- | --------------------- |
| Does this data come from an API?          | Server state (TanStack Query) | Client state       |
| Is it shared across many components?      | Global store (Zustand)    | Local state (useState)|
| Is it derived from the URL?               | URL state (search params) | Other                 |
| Is it form input data?                    | Form state (react-hook-form) | Other              |
| Is it ephemeral UI state (modal, toast)?  | Local or lightweight global| Not global store     |

**Rule of thumb**: If the data has a source of truth on the server, it is server state. Do not duplicate it into a global store.

## TanStack Query / React Query Configuration

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```typescript
// lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,         // Consider data fresh for 60s
      gcTime: 5 * 60_000,        // Keep inactive data for 5 min
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

```typescript
// hooks/use-products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((r) => r.json()),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      fetch("/api/products", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
```

## Zustand Store Pattern

```bash
npm install zustand
```

Use Zustand for client-only global state that does not come from the server.

```typescript
// stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  toggleSidebar: () => void;
  setTheme: (theme: UIState["theme"]) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "system",
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "ui-preferences", // localStorage key
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);
```

### Zustand Best Practices

- One store per domain (UI store, auth store), not one giant store.
- Use selectors to avoid unnecessary re-renders: `const theme = useUIStore((s) => s.theme)`.
- Use the `persist` middleware for state that should survive page refreshes.
- Keep stores small. If data comes from the server, use TanStack Query instead.

## Optimistic Update Patterns

Show the expected result immediately, then roll back if the server rejects it.

```typescript
// hooks/use-update-task.ts
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: { id: string; title: string }) =>
      fetch(`/api/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(task) }).then((r) => r.json()),

    onMutate: async (updatedTask) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value for rollback
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
      );

      return { previousTasks };
    },

    onError: (_err, _task, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      // Always refetch to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
```

## Cache Invalidation After Mutations

```typescript
// Pattern 1: Invalidate related queries (triggers refetch)
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["products"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] }); // related data
};

// Pattern 2: Update cache directly with server response (avoids extra fetch)
onSuccess: (newProduct) => {
  queryClient.setQueryData<Product[]>(["products"], (old) =>
    old ? [...old, newProduct] : [newProduct]
  );
};

// Pattern 3: Invalidate by prefix (all queries starting with "products")
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["products"] }); // matches ["products"], ["products", id], etc.
};
```

## URL State

Use URL search params as state for anything that should be shareable or bookmarkable: filters, pagination, search queries, tabs.

### With nuqs (Recommended)

```bash
npm install nuqs
```

```typescript
// components/ProductFilters.tsx
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

export function ProductFilters() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [category, setCategory] = useQueryState("category", parseAsString);

  // URL: /products?q=widget&page=2&category=electronics
  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      <select value={category || ""} onChange={(e) => setCategory(e.target.value || null)}>
        <option value="">All</option>
        <option value="electronics">Electronics</option>
      </select>
      <Pagination page={page} onChange={setPage} />
    </div>
  );
}
```

### Without a Library (useSearchParams)

```typescript
import { useSearchParams } from "next/navigation";

function Filters() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }
}
```

## Form State

Use react-hook-form with Zod for type-safe, performant form handling.

```bash
npm install react-hook-form @hookform/resolvers zod
```

```typescript
// components/CreateProductForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.coerce.number().positive("Price must be positive"),
  description: z.string().max(500).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0, description: "" },
  });

  const createProduct = useCreateProduct();

  const onSubmit = (data: ProductForm) => createProduct.mutateAsync(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}

      <input type="number" step="0.01" {...register("price")} />
      {errors.price && <span>{errors.price.message}</span>}

      <textarea {...register("description")} />
      <button type="submit" disabled={isSubmitting}>Create</button>
    </form>
  );
}
```

## Global UI State Patterns

For ephemeral UI state (modals, toasts, sidebar), keep it lightweight.

```typescript
// stores/modal-store.ts
import { create } from "zustand";

interface ModalState {
  activeModal: string | null;
  modalProps: Record<string, unknown>;
  openModal: (id: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (id, props = {}) => set({ activeModal: id, modalProps: props }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));

// Usage: open
useModalStore.getState().openModal("confirm-delete", { itemId: "123" });

// Usage: render
function ModalRoot() {
  const { activeModal, modalProps, closeModal } = useModalStore();
  if (activeModal === "confirm-delete") return <ConfirmDeleteModal {...modalProps} onClose={closeModal} />;
  return null;
}
```

## Offline-First State Patterns

For apps that need to work without a network connection.

```typescript
// hooks/use-offline-mutations.ts
import { onlineManager } from "@tanstack/react-query";

// TanStack Query pauses mutations when offline and retries when back online.
// Combine with persist to survive page refreshes.

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const persister = createSyncStoragePersister({ storage: window.localStorage });

// Wrap your app
<PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 24 * 60 * 60 * 1000 }}>
  <App />
</PersistQueryClientProvider>
```

For full offline-first, combine TanStack Query persistence with optimistic updates. Mutations queue locally and sync when the connection returns.

## State Management Anti-Patterns

| Anti-Pattern                                | Problem                                      | Fix                                          |
| ------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| Putting server data in Zustand/Redux        | Duplicates source of truth, stale data bugs  | Use TanStack Query for server state          |
| Giant single global store                   | Every update re-renders too many components  | Split into domain-specific stores            |
| Derived state stored separately             | Gets out of sync with source                 | Compute derived values with `useMemo`        |
| Using global state for form inputs          | Unnecessary complexity, poor performance     | Use react-hook-form with local state         |
| Not using URL state for shareable filters   | Users cannot share or bookmark filtered views| Use search params (nuqs or useSearchParams)  |
| Prop drilling 5+ levels deep               | Fragile, hard to maintain                    | Use context or Zustand for deeply shared state|
| Storing UI state in the database            | Slow, unnecessary server calls               | Keep UI state client-side                    |
