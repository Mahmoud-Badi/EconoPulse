# Anti-Pattern Starter List

11 generalized anti-patterns extracted from production experience. Use these as a starting point — add project-specific patterns as they emerge.

---

## AP-001: API Response Envelope Mismatch

**Frequency:** EPIDEMIC | **Severity:** HIGH | **Category:** API

**Symptom:** Frontend shows `undefined` or empty data despite successful API call.

**Root Cause:** API wraps responses in an envelope (`{ data: T }`) but frontend code accesses `response.data` instead of `response.data.data`, or vice versa.

**Wrong:**
```typescript
const { data } = await api.get("/items");
setItems(data); // data is { data: [...], pagination: {...} }, not the array
```

**Correct:**
```typescript
const { data } = await api.get("/items");
setItems(data.data); // unwrap the envelope
```

**Prevention Rule:** Document your API envelope format in CLAUDE.md. Always unwrap before using.

---

## AP-002: Stub Buttons and Placeholder Actions

**Frequency:** COMMON | **Severity:** MEDIUM | **Category:** UI

**Symptom:** Buttons that look functional but do nothing (no onClick handler, or handler is `() => {}`).

**Root Cause:** UI built before backend, button added for visual completeness, never wired up.

**Wrong:**
```tsx
<Button>Export Report</Button>  // No onClick, no handler
```

**Correct:**
```tsx
<Button onClick={handleExport} disabled={!canExport}>Export Report</Button>
// OR if not ready:
<Button disabled title="Coming in Sprint 3">Export Report</Button>
```

**Prevention Rule:** Every button must have a handler OR be explicitly disabled with a tooltip explaining when it will be available.

---

## AP-003: Unstable Dependencies in Effects

**Frequency:** COMMON | **Severity:** HIGH | **Category:** State

**Symptom:** Infinite re-render loops, excessive API calls, performance degradation.

**Root Cause:** Object/array references created in render body used as useEffect dependencies.

**Wrong:**
```typescript
const filters = { status: "active", page: 1 }; // New ref every render
useEffect(() => { fetchData(filters); }, [filters]); // Infinite loop
```

**Correct:**
```typescript
const filters = useMemo(() => ({ status, page }), [status, page]);
useEffect(() => { fetchData(filters); }, [filters]);
```

**Prevention Rule:** Never use inline objects/arrays as effect dependencies. Use useMemo or extract to state.

---

## AP-004: Mock/Seed Data in Production Code

**Frequency:** OCCASIONAL | **Severity:** CRITICAL | **Category:** Data

**Symptom:** Hardcoded data displayed to users, fake names/emails in production.

**Root Cause:** Mock data added during development, never replaced with real API calls.

**Wrong:**
```typescript
const drivers = [
  { name: "John Doe", email: "john@test.com" }, // Hardcoded!
];
```

**Correct:**
```typescript
const { data: drivers } = useQuery({ queryKey: ["drivers"], queryFn: fetchDrivers });
```

**Prevention Rule:** `grep -r "test.com\|example.com\|John Doe\|Jane Doe\|TODO\|FIXME"` before every release.

---

## AP-005: Wrong HTTP Method

**Frequency:** OCCASIONAL | **Severity:** MEDIUM | **Category:** API

**Symptom:** API works but violates REST conventions, causes caching/proxy issues.

**Root Cause:** Developer uses POST for everything, or GET for mutations.

**Wrong:**
```typescript
// Using POST to fetch data (breaks caching, browser back button)
await api.post("/items/search", { query: "test" });
```

**Correct:**
```typescript
// GET with query params for reads
await api.get("/items", { params: { q: "test" } });
// POST only for creating resources
await api.post("/items", { name: "New Item" });
```

**Prevention Rule:** GET=read, POST=create, PUT/PATCH=update, DELETE=delete. No exceptions.

---

## AP-006: Doubled URL Prefix

**Frequency:** OCCASIONAL | **Severity:** MEDIUM | **Category:** API

**Symptom:** 404 errors on API calls due to `/api/api/` or `/v1/v1/` in the URL.

**Root Cause:** API client has a base URL with prefix, and individual calls also include the prefix.

**Wrong:**
```typescript
// Base URL: "https://api.example.com/api/v1"
await api.get("/api/v1/items"); // Results in /api/v1/api/v1/items
```

**Correct:**
```typescript
// Base URL: "https://api.example.com/api/v1"
await api.get("/items"); // Results in /api/v1/items
```

**Prevention Rule:** Define base URL with prefix ONCE in the API client config. Never repeat it in individual calls.

---

## AP-007: Force Reload Instead of State Update

**Frequency:** OCCASIONAL | **Severity:** MEDIUM | **Category:** State

**Symptom:** Page flashes white after mutation (full page reload instead of smooth update).

**Root Cause:** Developer uses `window.location.reload()` instead of cache invalidation.

**Wrong:**
```typescript
await api.post("/items", newItem);
window.location.reload(); // Full page reload, loses scroll position, flashes white
```

**Correct:**
```typescript
await api.post("/items", newItem);
queryClient.invalidateQueries({ queryKey: ["items"] }); // Smooth re-fetch
```

**Prevention Rule:** Never use `window.location.reload()`. Always invalidate the query cache.

---

## AP-008: Missing UI States

**Frequency:** COMMON | **Severity:** HIGH | **Category:** UI

**Symptom:** Blank pages, missing spinners, raw error text, empty tables with no guidance.

**Root Cause:** Developer only builds the "happy path" (data loaded successfully) state.

**Wrong:**
```tsx
function ItemsList() {
  const { data } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  return <Table data={data} />; // No loading, no error, no empty state
}
```

**Correct:**
```tsx
function ItemsList() {
  const { data, isLoading, error } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorAlert message={error.message} onRetry={refetch} />;
  if (!data?.length) return <EmptyState title="No items" action={<AddButton />} />;
  return <Table data={data} />;
}
```

**Prevention Rule:** Every data-fetching component MUST handle 4 states: loading, error, empty, data.

---

## AP-009: Missing TypeScript Types

**Frequency:** COMMON | **Severity:** MEDIUM | **Category:** Code Quality

**Symptom:** `any` types everywhere, runtime errors that TypeScript should have caught.

**Root Cause:** Developer bypasses TypeScript to move faster, creating tech debt.

**Wrong:**
```typescript
function processItem(item: any) { // `any` hides bugs
  return item.naem; // Typo not caught!
}
```

**Correct:**
```typescript
interface Item { name: string; status: ItemStatus; }
function processItem(item: Item) {
  return item.name; // Typo would be caught at compile time
}
```

**Prevention Rule:** Zero `any` types in production code. Use `unknown` + type guards if type is truly unknown.

---

## AP-010: Unverified Endpoints

**Frequency:** COMMON | **Severity:** HIGH | **Category:** API

**Symptom:** Frontend calls an endpoint that doesn't exist, returns 404 in production.

**Root Cause:** Frontend built from API spec/design doc without verifying the backend actually implements the endpoint.

**Wrong:**
```typescript
// Design doc says POST /api/reports/generate exists
const report = await api.post("/reports/generate", params);
// But backend hasn't implemented this endpoint yet → 404
```

**Correct:**
```bash
# BEFORE writing frontend code, verify the endpoint exists:
grep -r "reports/generate\|@Post.*generate" apps/api/src/
# If not found → don't build the frontend for it yet
```

**Prevention Rule:** `grep` for the endpoint in backend code BEFORE writing the frontend call.

---

## AP-011: Missing Context/Tenant Identifier

**Frequency:** COMMON | **Severity:** CRITICAL | **Category:** Security

**Symptom:** Users see other tenants' data, or mutations affect wrong tenant's records.

**Root Cause:** Query or mutation doesn't filter by the current user's context (tenant ID, org ID, user ID).

**Wrong:**
```typescript
// Returns ALL items across ALL tenants!
const items = await prisma.item.findMany();
```

**Correct:**
```typescript
// Filter by the authenticated user's tenant
const items = await prisma.item.findMany({
  where: { tenantId: req.user.tenantId, deletedAt: null }
});
```

**Prevention Rule:** Every database query MUST include tenant/context filter. No exceptions. Audit with `grep -r "findMany\|findFirst" | grep -v "tenantId"`.
