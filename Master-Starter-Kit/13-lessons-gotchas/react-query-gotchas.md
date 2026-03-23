# React Query / TanStack Query Gotchas

React Query (TanStack Query v5) is the gold standard for server state management in React. But it has sharp edges that silently corrupt data, cause infinite loops, or break your UI. These are battle-tested gotchas from production codebases.

---

## 1. Not Unwrapping the API Envelope

Most APIs wrap responses in an envelope: `{ data: T, pagination: {...} }`. Axios adds its own `.data` wrapper on top.

**Problem:** You access `response.data` and get the envelope, not the actual payload.

**Symptoms:** Components render `undefined` fields. TypeScript types look correct but runtime data is one level deeper than expected. Lists show zero items despite the network tab showing data.

```typescript
// WRONG — you get the envelope, not the payload
const { data } = useQuery({
  queryKey: ['loads'],
  queryFn: () => api.get('/loads'),
});
// data = { data: Load[], pagination: { total: 50 } }
// data.map(...) crashes — data is not an array

// RIGHT — unwrap both Axios and API envelopes
const { data } = useQuery({
  queryKey: ['loads'],
  queryFn: async () => {
    const response = await api.get<{ data: Load[] }>('/loads');
    return response.data.data; // Axios .data → API envelope .data
  },
});
// data = Load[] — ready to use
```

**Prevention:** Create a typed API helper that unwraps both layers automatically:

```typescript
// lib/api/fetcher.ts
export async function apiFetch<T>(url: string): Promise<T> {
  const response = await api.get<{ data: T }>(url);
  return response.data.data;
}

// Usage — clean and type-safe
const { data } = useQuery({
  queryKey: ['loads'],
  queryFn: () => apiFetch<Load[]>('/loads'),
});
```

---

## 2. staleTime vs gcTime Confusion

TanStack Query v5 renamed `cacheTime` to `gcTime` (garbage collection time). They serve completely different purposes but are constantly confused.

**Problem:** You set `gcTime` thinking it controls when data is refetched. Or you set `staleTime` thinking it controls when data is garbage collected.

**Symptoms:** Data refetches on every focus event despite setting a "cache time." Or cached data disappears even though it was recently fetched.

```typescript
// WRONG — setting gcTime thinking it prevents refetches
const { data } = useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchDashboard,
  gcTime: 1000 * 60 * 10, // This does NOT prevent refetches
});

// RIGHT — understand both values
const { data } = useQuery({
  queryKey: ['dashboard'],
  queryFn: fetchDashboard,
  staleTime: 1000 * 60 * 5,  // Data is "fresh" for 5 min — no refetch
  gcTime: 1000 * 60 * 10,    // Keep inactive cache for 10 min before GC
});
```

**The mental model:**

| Setting | Controls | Default | When it matters |
|---------|----------|---------|-----------------|
| `staleTime` | How long until data is considered stale and eligible for refetch | `0` (always stale) | Prevents unnecessary network requests |
| `gcTime` | How long inactive cache entries survive before garbage collection | `5 min` | Memory management, offline support |

**Prevention:** Set `staleTime` in your `QueryClient` defaults based on your data's natural update frequency:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min default — most TMS data
      gcTime: 1000 * 60 * 10,
    },
  },
});
```

---

## 3. Optimistic Updates Losing Data on Error Rollback

Optimistic updates show changes instantly before the server confirms. The danger: if the mutation fails and you rollback, you can lose data the user entered in the meantime.

**Problem:** Your `onMutate` snapshots the cache, but between the snapshot and the error, the user (or another query) may have added more data to the cache.

**Symptoms:** User updates load status to "In Transit," it fails, and rollback reverts not just the status but also a note they added 2 seconds later.

```typescript
// WRONG — naive rollback overwrites everything
useMutation({
  mutationFn: updateLoadStatus,
  onMutate: async (newStatus) => {
    await queryClient.cancelQueries({ queryKey: ['load', loadId] });
    const previous = queryClient.getQueryData(['load', loadId]);
    queryClient.setQueryData(['load', loadId], (old: Load) => ({
      ...old,
      status: newStatus,
    }));
    return { previous }; // Snapshot of ENTIRE load
  },
  onError: (_err, _vars, context) => {
    // This restores the ENTIRE load to its pre-mutation state,
    // losing ANY other updates that happened in between
    queryClient.setQueryData(['load', loadId], context?.previous);
  },
});

// RIGHT — rollback only the field you changed, then refetch
useMutation({
  mutationFn: updateLoadStatus,
  onMutate: async (newStatus) => {
    await queryClient.cancelQueries({ queryKey: ['load', loadId] });
    const previous = queryClient.getQueryData<Load>(['load', loadId]);
    const previousStatus = previous?.status;

    queryClient.setQueryData(['load', loadId], (old: Load) => ({
      ...old,
      status: newStatus,
    }));
    return { previousStatus };
  },
  onError: (_err, _vars, context) => {
    // Only revert the specific field
    queryClient.setQueryData(['load', loadId], (old: Load) => ({
      ...old,
      status: context?.previousStatus,
    }));
  },
  onSettled: () => {
    // Always refetch to get the true server state
    queryClient.invalidateQueries({ queryKey: ['load', loadId] });
  },
});
```

**Prevention:** Always add `onSettled` with `invalidateQueries` to sync with the server after any mutation (success or failure). For complex entities, consider skipping optimistic updates entirely and relying on `invalidateQueries` plus a loading indicator.

---

## 4. Query Key Not Including All Dependencies

Query keys are the identity of your cached data. If the key does not include a variable that affects the fetched data, you get stale/wrong data.

**Problem:** Your query fetches data based on filters, pagination, or route params, but the query key does not include all of them.

**Symptoms:** Changing a filter does not refetch. Navigating from `/loads/1` to `/loads/2` shows load 1's data. Pagination shows the same page regardless of page number.

```typescript
// WRONG — query key does not include the filter
const { data } = useQuery({
  queryKey: ['loads'],
  queryFn: () => fetchLoads({ status: filter, page, carrierId }),
});
// Changing filter/page/carrierId does NOT trigger a refetch

// RIGHT — every variable that changes the response goes in the key
const { data } = useQuery({
  queryKey: ['loads', { status: filter, page, carrierId }],
  queryFn: () => fetchLoads({ status: filter, page, carrierId }),
});
// Changing any of these triggers a new fetch with correct params
```

**Prevention:** Use a convention — always pass the same params object to both the key and the function:

```typescript
function useLoads(params: LoadFilters) {
  return useQuery({
    queryKey: ['loads', params],
    queryFn: () => fetchLoads(params),
  });
}
```

---

## 5. Infinite Re-renders from Unstable Query Key Objects

React Query uses deep comparison for query keys, but if you create a new object reference every render, React itself may re-render your component in a loop.

**Problem:** You pass an inline object as a query key that gets recreated every render, which can interact badly with `useEffect` dependencies or state setters inside `onSuccess` callbacks.

**Symptoms:** Component re-renders hundreds of times per second. Browser tab freezes. React DevTools shows a wall of renders. Network tab shows the same request repeating.

```typescript
// WRONG — new object reference every render triggers effects
function LoadList({ filters }: { filters: LoadFilters }) {
  const params = { ...filters, page: 1 }; // New object every render

  const { data } = useQuery({
    queryKey: ['loads', params],
    queryFn: () => fetchLoads(params),
  });

  // If anything downstream sets state based on `data`, infinite loop
  useEffect(() => {
    if (data) setCount(data.length); // Re-render → new params → new query → new data → repeat
  }, [data]);

  return <div>{data?.map(renderLoad)}</div>;
}

// RIGHT — stabilize with useMemo
function LoadList({ filters }: { filters: LoadFilters }) {
  const params = useMemo(
    () => ({ ...filters, page: 1 }),
    [filters]
  );

  const { data } = useQuery({
    queryKey: ['loads', params],
    queryFn: () => fetchLoads(params),
  });

  return <div>{data?.map(renderLoad)}</div>;
}
```

**Prevention:** Stabilize query key objects with `useMemo`. For primitive values (strings, numbers), no stabilization needed. For objects, always memoize. Avoid setting state inside effects that depend on query data — use the `select` option instead:

```typescript
const { data: count } = useQuery({
  queryKey: ['loads', params],
  queryFn: () => fetchLoads(params),
  select: (data) => data.length, // Derived state without useEffect
});
```

---

## 6. Missing Error Boundaries for Query Errors

React Query can throw errors to the nearest error boundary, but only if you opt in. Without this, errors silently swallow or crash the whole app.

**Problem:** You do not handle query errors at all, or you set `throwOnError: true` without an error boundary above the component.

**Symptoms:** Component shows a loading spinner forever (error happened but nothing catches it). Or the entire app crashes with an unhandled error instead of showing a graceful fallback.

```typescript
// WRONG — no error handling at all
function LoadDetail({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['load', id],
    queryFn: () => fetchLoad(id),
  });

  if (isLoading) return <Spinner />;
  return <div>{data.referenceNumber}</div>;
  // If fetchLoad throws, data is undefined → crash
}

// ALSO WRONG — throwOnError without a boundary
function LoadDetail({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['load', id],
    queryFn: () => fetchLoad(id),
    throwOnError: true, // Throws to error boundary... if one exists
  });
  return <div>{data.referenceNumber}</div>;
}
// Without <QueryErrorResetBoundary> + <ErrorBoundary>, this crashes the app

// RIGHT — explicit error state handling
function LoadDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['load', id],
    queryFn: () => fetchLoad(id),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorCard error={error} />;
  if (!data) return null;
  return <div>{data.referenceNumber}</div>;
}

// RIGHT (alternative) — error boundary with reset
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function LoadDetailPage({ id }: { id: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => (
          <div>
            <p>Failed to load data.</p>
            <button onClick={resetErrorBoundary}>Retry</button>
          </div>
        )}>
          <LoadDetail id={id} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

**Prevention:** Establish a pattern early. Either always destructure `error` and handle it inline, or wrap route segments with `QueryErrorResetBoundary` + a React error boundary. Choose one pattern for your project and enforce it.

---

## 7. Prefetching Not Working (Wrong Query Key Format)

Prefetching loads data before the user navigates, making page transitions instant. But if the prefetch key does not match the destination query key exactly, the cache miss means it was wasted work.

**Problem:** The query key you use in `prefetchQuery` does not match the key used in the destination component's `useQuery`.

**Symptoms:** Prefetch fires (visible in network tab), but the destination page still shows a loading spinner and makes a second request.

```typescript
// WRONG — key mismatch between prefetch and destination
// In the list page (prefetch on hover):
function LoadRow({ load }: { load: Load }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['load', load.id],          // String ID
      queryFn: () => fetchLoad(load.id),
    });
  };

  return <tr onMouseEnter={handleMouseEnter}>...</tr>;
}

// In the detail page:
function LoadDetail({ id }: { id: string }) {
  const { data } = useQuery({
    queryKey: ['loads', 'detail', id],       // Different key structure!
    queryFn: () => fetchLoad(id),
  });
}
// Prefetched data sits unused under ['load', '123']
// Detail page fetches again under ['loads', 'detail', '123']

// RIGHT — extract query keys into a shared factory
// lib/queries/load-queries.ts
export const loadKeys = {
  all: ['loads'] as const,
  lists: () => [...loadKeys.all, 'list'] as const,
  list: (filters: LoadFilters) => [...loadKeys.lists(), filters] as const,
  details: () => [...loadKeys.all, 'detail'] as const,
  detail: (id: string) => [...loadKeys.details(), id] as const,
};

// Prefetch:
queryClient.prefetchQuery({
  queryKey: loadKeys.detail(load.id),
  queryFn: () => fetchLoad(load.id),
});

// Destination:
useQuery({
  queryKey: loadKeys.detail(id),
  queryFn: () => fetchLoad(id),
});
// Keys match — cache hit, no second request
```

**Prevention:** Always use query key factories. Define them once per entity. Import them everywhere. Never write a raw query key array in a component.

---

## 8. Pagination Cursor Management (Keeping vs Discarding Previous Pages)

Standard `useQuery` with pagination discards the previous page's data while loading the next, causing a flash of loading state.

**Problem:** You use `useQuery` for paginated data and the UI flashes a loading spinner every time the user changes pages.

**Symptoms:** Table flickers empty on every page change. Scroll position resets. Users see a spinner for 200ms between pages.

```typescript
// WRONG — standard useQuery discards previous data on page change
function LoadTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['loads', page],
    queryFn: () => fetchLoads({ page }),
  });

  if (isLoading) return <Spinner />; // Flashes on EVERY page change
  return <Table data={data} />;
}

// RIGHT — use placeholderData to keep previous page visible
import { keepPreviousData } from '@tanstack/react-query';

function LoadTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['loads', page],
    queryFn: () => fetchLoads({ page }),
    placeholderData: keepPreviousData, // Show old data while fetching new
  });

  if (isLoading && !data) return <Spinner />; // Only on first load

  return (
    <div className={isPlaceholderData ? 'opacity-60' : ''}>
      <Table data={data} />
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={isPlaceholderData} // Prevent rapid clicks
      >
        Next Page
      </button>
    </div>
  );
}
```

For infinite scroll, use `useInfiniteQuery` which accumulates pages:

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['loads', filters],
  queryFn: ({ pageParam }) => fetchLoads({ ...filters, cursor: pageParam }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
});

// All pages are kept — data.pages is an array of page results
const allLoads = data?.pages.flatMap((page) => page.items) ?? [];
```

**Prevention:** For traditional pagination (page 1, 2, 3), use `placeholderData: keepPreviousData`. For infinite scroll, use `useInfiniteQuery`. Never use raw `useQuery` for paginated UIs without `placeholderData`.

---

## 9. Mutation Not Invalidating Related Queries

After a mutation succeeds, stale data stays in the cache unless you explicitly invalidate it.

**Problem:** You create/update/delete an entity but forget to invalidate queries that display that entity (lists, counts, dashboards).

**Symptoms:** User creates a new load, navigates back to the list, and the new load is not there. They refresh the page and it appears. Dashboard counts are stale after operations.

```typescript
// WRONG — mutation succeeds but list still shows stale data
const createLoad = useMutation({
  mutationFn: (newLoad: CreateLoadDto) => api.post('/loads', newLoad),
  onSuccess: () => {
    toast.success('Load created');
    router.push('/loads'); // List still shows old data
  },
});

// RIGHT — invalidate all related queries
const createLoad = useMutation({
  mutationFn: (newLoad: CreateLoadDto) => api.post('/loads', newLoad),
  onSuccess: () => {
    // Invalidate the loads list (all filtered variants)
    queryClient.invalidateQueries({ queryKey: ['loads'] });
    // Also invalidate dashboard counts that include load stats
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    toast.success('Load created');
    router.push('/loads');
  },
});
```

For updates, you can also update the cache directly for instant feedback:

```typescript
const updateLoad = useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateLoadDto }) =>
    api.patch(`/loads/${id}`, data),
  onSuccess: (response, { id }) => {
    // Update the detail cache immediately
    queryClient.setQueryData(loadKeys.detail(id), response.data.data);
    // Invalidate the list so it refetches with updated data
    queryClient.invalidateQueries({ queryKey: loadKeys.lists() });
  },
});
```

**Prevention:** Create a mutation wrapper or convention that maps entity types to their related query keys. Every mutation should invalidate at minimum: the entity list, the entity detail (if updating), and any dashboards/aggregations.

---

## 10. useQuery in Conditional Rendering (Breaking Rules of Hooks)

React hooks cannot be called conditionally. This includes `useQuery`.

**Problem:** You call `useQuery` inside an `if` block or after an early return, which violates the Rules of Hooks.

**Symptoms:** React throws "Rendered more hooks than during the previous render." App crashes. The error is intermittent because it only triggers when the condition changes between renders.

```typescript
// WRONG — conditional hook call
function LoadDetail({ id }: { id: string | null }) {
  if (!id) return <p>Select a load</p>;

  // This hook is called conditionally — BREAKS RULES OF HOOKS
  const { data } = useQuery({
    queryKey: ['load', id],
    queryFn: () => fetchLoad(id),
  });

  return <div>{data?.referenceNumber}</div>;
}

// RIGHT — use the `enabled` option to conditionally fetch
function LoadDetail({ id }: { id: string | null }) {
  const { data } = useQuery({
    queryKey: ['load', id],
    queryFn: () => fetchLoad(id!), // Non-null assertion is safe — enabled guards it
    enabled: !!id, // Only fetches when id is truthy
  });

  if (!id) return <p>Select a load</p>;
  return <div>{data?.referenceNumber}</div>;
}
```

**Prevention:** Never put `useQuery` (or any hook) after a conditional return. Use the `enabled` option to control when the query fires. The `enabled: false` state gives you `isLoading: false, data: undefined, fetchStatus: 'idle'` — a safe default.

---

## 11. Server State vs Client State Confusion

React Query manages server state (data that lives on the server). It is not a replacement for client state (UI state that exists only in the browser).

**Problem:** You try to manage form state, modal open/close, selected tabs, or other ephemeral UI state with React Query.

**Symptoms:** Form inputs feel laggy because every keystroke goes through the query cache. Modal state is "refetched" on window focus. UI state resets unexpectedly.

```typescript
// WRONG — using React Query for client state
function LoadForm() {
  // Do NOT put form state in React Query
  const { data: formData } = useQuery({
    queryKey: ['loadForm'],
    queryFn: () => ({ shipper: '', weight: 0 }),
    staleTime: Infinity,
  });

  const updateField = useMutation({
    mutationFn: async (update: Partial<FormData>) => update,
    onSuccess: (data) => {
      queryClient.setQueryData(['loadForm'], (old) => ({ ...old, ...data }));
    },
  });

  return (
    <input
      value={formData?.shipper}
      onChange={(e) => updateField.mutate({ shipper: e.target.value })}
    />
  );
}

// RIGHT — React Query for server data, useState/useForm for client state
function LoadForm({ loadId }: { loadId?: string }) {
  // Server state: fetch existing load data
  const { data: load } = useQuery({
    queryKey: ['load', loadId],
    queryFn: () => fetchLoad(loadId!),
    enabled: !!loadId,
  });

  // Client state: form fields (react-hook-form, or plain useState)
  const form = useForm<CreateLoadDto>({
    defaultValues: load ?? { shipper: '', weight: 0 },
  });

  // Mutation: send client state to server
  const save = useMutation({
    mutationFn: (data: CreateLoadDto) => api.post('/loads', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['loads'] }),
  });

  return <form onSubmit={form.handleSubmit((d) => save.mutate(d))}>...</form>;
}
```

**When to use React Query vs local state:**

| Data type | Use | Example |
|-----------|-----|---------|
| Data from the server | React Query | Loads, carriers, users, dashboard stats |
| Form input values | useState / react-hook-form | Text fields, selects, checkboxes |
| UI visibility state | useState | Modal open, sidebar collapsed, active tab |
| URL-derived state | URL params (nuqs / searchParams) | Filters, pagination, selected ID |
| Global client state | Zustand / Jotai | Theme, user preferences, notification queue |

**Prevention:** Ask yourself: "Does this data exist on a server?" If yes, React Query. If no, use local state. If it is derived from server data, use the `select` option on `useQuery`.

---

## 12. DevTools Not Showing in Production

React Query DevTools are invaluable for debugging, but the default import bundles them into production or fails to load in dev.

**Problem:** You import DevTools statically so they end up in the production bundle (wasting KB), or you conditionally import them wrong so they never appear.

**Symptoms:** DevTools panel visible to end users in production. Or DevTools never appear in development despite being installed.

```typescript
// WRONG — static import, ships to production
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// ALSO WRONG — dynamic import but tree-shaking still includes it
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
  // Static import at top still bundles the code
}

// RIGHT — lazy load only in development
import { lazy, Suspense } from 'react';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-query-devtools').then((mod) => ({
          default: mod.ReactQueryDevtools,
        }))
      );

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    </QueryClientProvider>
  );
}
```

**Prevention:** Set up the lazy DevTools pattern once in your providers file and never touch it again. The production build tree-shakes the entire devtools package away because the component resolves to `() => null`.

---

## 13. Retries Hammering a Broken Endpoint

React Query retries failed queries 3 times by default with exponential backoff. On a genuinely broken endpoint, this means 4 total requests before the user sees an error.

**Problem:** Default retry behavior causes unnecessary load on your server during outages and delays error display to the user.

**Symptoms:** User sees a loading spinner for 10+ seconds on a broken endpoint (initial + 3 retries with backoff). Server logs show repeated 500 errors from the same client. Rate limiters kick in from retry storms.

```typescript
// WRONG — default retries on all errors, including 4xx
const { data } = useQuery({
  queryKey: ['load', id],
  queryFn: () => fetchLoad(id),
  // Default: retry 3 times — even for 404s and 403s
});

// RIGHT — only retry on server errors, not client errors
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Never retry 4xx errors — they won't magically succeed
        if (error instanceof AxiosError && error.response?.status) {
          const status = error.response.status;
          if (status >= 400 && status < 500) return false;
        }
        // Retry server errors up to 2 times
        return failureCount < 2;
      },
    },
  },
});
```

**Prevention:** Configure smart retry logic globally in your `QueryClient`. Never retry 401 (unauthorized), 403 (forbidden), 404 (not found), or 422 (validation) errors. Only retry 500/502/503/504 errors, and cap retries at 2. For mutations, set `retry: 0` globally — mutations should not auto-retry because they can cause duplicate side effects.

---

## 14. Forgetting to Cancel Queries on Unmount

React Query supports query cancellation via `AbortSignal`, but you have to pass it to your fetch function. Without it, abandoned requests complete and may update state on unmounted components.

**Problem:** User navigates away from a page mid-request. The request completes and tries to update cache for a component that no longer exists.

**Symptoms:** Memory leak warnings in React. Stale data from abandoned requests appearing when the user navigates back. Wasted bandwidth on requests nobody needs.

```typescript
// WRONG — ignoring the signal
const { data } = useQuery({
  queryKey: ['loads', filters],
  queryFn: () => api.get('/loads', { params: filters }),
  // AbortSignal is available but never passed to Axios
});

// RIGHT — forward the abort signal to the HTTP client
const { data } = useQuery({
  queryKey: ['loads', filters],
  queryFn: ({ signal }) =>
    api.get('/loads', { params: filters, signal }).then((r) => r.data.data),
});
// When the component unmounts or the query key changes,
// React Query calls signal.abort(), cancelling the in-flight request
```

**Prevention:** Always destructure `{ signal }` from the `queryFn` context and pass it to your HTTP client. This works with Axios, fetch, and any client that accepts an `AbortSignal`. Make it part of your API helper:

```typescript
export async function apiFetch<T>(
  url: string,
  params?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await api.get<{ data: T }>(url, { params, signal });
  return response.data.data;
}

// Usage:
queryFn: ({ signal }) => apiFetch<Load[]>('/loads', filters, signal),
```

---

## Quick Reference: Default Behaviors That Surprise People

| Behavior | Default | Surprise |
|----------|---------|----------|
| Refetch on window focus | `true` | Tab switch triggers refetch |
| Refetch on reconnect | `true` | Network restore triggers refetch |
| Retry count | `3` | 4 total requests before error shows |
| staleTime | `0` | Data is immediately stale — every mount refetches |
| gcTime | `5 minutes` | Inactive cache is garbage collected |
| Structural sharing | `true` | Same data shape = same reference (good for perf) |
| throwOnError | `false` | Errors are swallowed unless you check `error` |

Override these globally in your `QueryClient` to match your app's needs, not per-query.
