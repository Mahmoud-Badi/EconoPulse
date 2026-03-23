# Anti-Patterns Registry — TaskFlow

> **Last Updated:** 2026-03-10
> **Maintainer:** Platform Engineering
> **Total Patterns:** 10
> **Enforcement:** ESLint custom rules + PR review checklist

---

## Registry

### AP-001: API Envelope Not Unwrapped

**Severity:** HIGH | **Frequency:** Very Common | **Category:** Data Access

**Description:**
The API returns all responses in a standard envelope `{ data: T }` for single items or `{ data: T[], pagination: {...} }` for lists. Axios wraps this in its own `data` property. Developers forget to double-unwrap, leading to components receiving the envelope object instead of the actual payload.

**Symptoms:**
- Component renders `[object Object]` instead of values
- `TypeError: Cannot read property 'name' of undefined` in components that look correct
- Data appears nested one level too deep in React DevTools

**Wrong Code:**

```typescript
// The response from axios is { data: { data: carrier, ... } }
const response = await api.get(`/carriers/${id}`);
const carrier = response.data; // BUG: this is { data: {...}, meta: {...} }
return carrier.name; // undefined!
```

**Correct Code:**

```typescript
const response = await api.get(`/carriers/${id}`);
const carrier = response.data.data; // Unwrap axios envelope, then API envelope
return carrier.name; // "Acme Trucking"
```

**Detection:**

```bash
# Find potential violations: response.data used without .data.data
grep -rn "response\.data\b" apps/web/lib/hooks/ --include="*.ts" | grep -v "response\.data\.data"
```

**ESLint Rule:** Custom rule `no-single-unwrap` — flags `response.data.` not followed by `data`.

---

### AP-002: Stub Buttons with Empty onClick Handlers

**Severity:** MEDIUM | **Frequency:** Common | **Category:** UX

**Description:**
Buttons rendered with `onClick={() => {}}` or no handler at all. The user clicks and nothing happens — no feedback, no error, no toast. This creates a broken-feeling UI and generates support tickets.

**Symptoms:**
- User reports "button doesn't work"
- Button has hover/active styles but no visible effect on click
- No network requests fired on click (visible in DevTools Network tab)

**Wrong Code:**

```tsx
<Button onClick={() => {}}>Export PDF</Button>
<Button>Delete Load</Button> {/* No onClick at all */}
```

**Correct Code:**

```tsx
// Option A: Implement the feature
<Button onClick={handleExportPDF}>Export PDF</Button>

// Option B: Disable with tooltip explaining why
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled>Export PDF</Button>
    </TooltipTrigger>
    <TooltipContent>Coming soon — available in v2.2</TooltipContent>
  </Tooltip>
</TooltipProvider>

// Option C: Show toast for features in development
<Button onClick={() => toast.info('PDF export is coming in Sprint 14')}>
  Export PDF
</Button>
```

**Detection:**

```bash
# Find empty onClick handlers
grep -rn "onClick={() => {}}" apps/web/ --include="*.tsx"
grep -rn "onClick={() => null}" apps/web/ --include="*.tsx"
```

---

### AP-003: Missing Loading States

**Severity:** HIGH | **Frequency:** Very Common | **Category:** UX

**Description:**
Pages or sections that show nothing (blank white space) while data is loading. Users perceive this as broken. Every data-fetching component must show a skeleton, spinner, or placeholder during load.

**Symptoms:**
- White flash between navigation and content appearing
- Layout shift when data loads (content pops in)
- Users refresh the page thinking it's frozen

**Wrong Code:**

```tsx
function CarrierList() {
  const { data, isLoading } = useCarriers();

  // BUG: shows nothing while loading
  if (!data) return null;

  return <Table data={data} />;
}
```

**Correct Code:**

```tsx
function CarrierList() {
  const { data, isLoading, error } = useCarriers();

  if (error) return <ErrorState message="Failed to load carriers" retry={refetch} />;
  if (isLoading) return <TableSkeleton rows={10} columns={5} />;
  if (!data?.length) return <EmptyState icon={Truck} message="No carriers found" />;

  return <Table data={data} />;
}
```

**Detection:**

```bash
# Find components that return null on loading
grep -rn "return null" apps/web/app/ --include="*.tsx" -B 2 | grep -i "loading\|isLoading\|!data"
```

---

### AP-004: Hardcoded Tenant IDs

**Severity:** CRITICAL | **Frequency:** Uncommon (but catastrophic) | **Category:** Security

**Description:**
Tenant ID hardcoded in queries, seed data leaking into production, or tenant filtering bypassed for "convenience" during development. This is a data isolation violation — tenants can see each other's data.

**Symptoms:**
- Customer reports seeing another company's loads/carriers
- Data counts don't match between admin panel and tenant view
- Queries work in dev but return wrong data in multi-tenant staging

**Wrong Code:**

```typescript
// Hardcoded tenant ID from development
const loads = await prisma.load.findMany({
  where: { tenantId: 'clx1234567890' }, // NEVER hardcode
});

// Missing tenant filter entirely
const carriers = await prisma.carrier.findMany({
  where: { status: 'ACTIVE' }, // BUG: returns ALL tenants' carriers
});
```

**Correct Code:**

```typescript
// Use tenant from authenticated context
const loads = await prisma.load.findMany({
  where: {
    tenantId: req.user.tenantId, // From JWT/session
    status: 'ACTIVE',
  },
});

// Better: Use Prisma Client Extension for automatic tenant filtering
// See: prisma-tenant-extension.ts
const tenantPrisma = prisma.$extends(tenantExtension(req.user.tenantId));
const carriers = await tenantPrisma.carrier.findMany({
  where: { status: 'ACTIVE' }, // tenantId injected automatically
});
```

**Detection:**

```bash
# Find hardcoded UUIDs or CUID strings in query files
grep -rn "tenantId: '[a-z0-9]" apps/api/src/ --include="*.ts"
# Find queries missing tenantId in where clause
grep -rn "findMany\|findFirst\|findUnique" apps/api/src/ --include="*.ts" -A 5 | grep -v tenantId
```

---

### AP-005: localStorage for Sensitive Tokens

**Severity:** CRITICAL | **Frequency:** Common in early codebases | **Category:** Security

**Description:**
Storing JWT access tokens or refresh tokens in `localStorage`. Any XSS vulnerability allows an attacker to steal tokens and impersonate users. Tokens must be stored in httpOnly cookies that JavaScript cannot access.

**Symptoms:**
- `localStorage.getItem('token')` visible in application code
- Tokens visible in browser DevTools > Application > Local Storage
- Auth works but security audit flags XSS token theft risk

**Wrong Code:**

```typescript
// Login handler
const { token } = await api.post('/auth/login', credentials);
localStorage.setItem('token', token); // XSS can steal this

// API client
const token = localStorage.getItem('token');
api.defaults.headers.Authorization = `Bearer ${token}`;
```

**Correct Code:**

```typescript
// Login handler — server sets httpOnly cookie
await api.post('/auth/login', credentials);
// Token is now in httpOnly cookie — JS cannot access it

// API client — cookie sent automatically
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies with requests
});
// No manual token management needed
```

**Detection:**

```bash
# Find localStorage token usage
grep -rn "localStorage\.\(get\|set\)Item.*token" apps/web/ --include="*.ts" --include="*.tsx"
```

---

### AP-006: Missing Error Boundaries

**Severity:** HIGH | **Frequency:** Common | **Category:** Resilience

**Description:**
React components that throw during render crash the entire page (white screen of death). Error boundaries catch render errors and display a fallback UI, keeping the rest of the application functional.

**Symptoms:**
- Entire page goes white after a data format change
- Console shows "Uncaught Error" with React component stack
- Users cannot navigate away (the layout itself crashed)

**Wrong Code:**

```tsx
// No error boundary — if CarrierDetail throws, entire page dies
export default function CarrierPage() {
  return (
    <Layout>
      <CarrierDetail /> {/* If this throws, white screen */}
    </Layout>
  );
}
```

**Correct Code:**

```tsx
// error.tsx (Next.js App Router convention)
'use client';

export default function CarrierError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**Detection:**

```bash
# Find route segments missing error.tsx
find apps/web/app -type d | while read dir; do
  if [ -f "$dir/page.tsx" ] && [ ! -f "$dir/error.tsx" ]; then
    echo "MISSING error.tsx: $dir"
  fi
done
```

---

### AP-007: No Debounce on Search Inputs

**Severity:** MEDIUM | **Frequency:** Common | **Category:** Performance

**Description:**
Search inputs that fire an API request on every keystroke. A user typing "truck" sends 5 requests. This wastes bandwidth, overloads the API, and causes UI flickering as results change rapidly.

**Symptoms:**
- Network tab shows dozens of requests while typing
- Search results flicker between each keystroke
- API rate limiter triggers for fast typists
- Server CPU spikes correlated with search usage

**Wrong Code:**

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const { data } = useSearch(query); // Fires on every keystroke

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**Correct Code:**

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300); // 300ms delay
  const { data } = useSearch(debouncedQuery); // Fires after user stops typing

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Hook: useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Detection:**

```bash
# Find search-related hooks without debounce
grep -rn "useSearch\|useQuery.*search" apps/web/ --include="*.ts" --include="*.tsx" -l | \
  xargs grep -L "debounce\|useDebounce"
```

---

### AP-008: Raw SQL Without Parameterization

**Severity:** CRITICAL | **Frequency:** Uncommon (but devastating) | **Category:** Security

**Description:**
Building SQL queries by concatenating user input directly into the query string. This enables SQL injection — an attacker can read, modify, or delete arbitrary data. Always use parameterized queries or an ORM.

**Symptoms:**
- String interpolation inside `$queryRaw` or `$executeRaw`
- Query strings built with template literals containing user input
- Security scanner flags SQL injection vulnerability

**Wrong Code:**

```typescript
// SQL INJECTION: user input directly in query
const results = await prisma.$queryRaw`
  SELECT * FROM loads WHERE reference_number = '${userInput}'
`;

// Also dangerous: string concatenation
const query = `SELECT * FROM loads WHERE status = '${req.query.status}'`;
await prisma.$queryRawUnsafe(query);
```

**Correct Code:**

```typescript
// Parameterized query — safe from injection
const results = await prisma.$queryRaw`
  SELECT * FROM loads WHERE reference_number = ${userInput}
`;
// Prisma's tagged template literal auto-parameterizes

// Even better: use the ORM
const results = await prisma.load.findMany({
  where: { referenceNumber: userInput },
});
```

**Detection:**

```bash
# Find potential SQL injection: $queryRawUnsafe or string interpolation in raw queries
grep -rn "queryRawUnsafe\|executeRawUnsafe" apps/api/src/ --include="*.ts"
grep -rn '\$queryRaw.*\${' apps/api/src/ --include="*.ts"
```

---

### AP-009: Console.log Left in Production Code

**Severity:** LOW | **Frequency:** Very Common | **Category:** Code Quality

**Description:**
`console.log` statements left in production code. They clutter the browser console, can leak sensitive data (tokens, user info, API responses), and indicate incomplete development work.

**Symptoms:**
- Browser console filled with debug output on production site
- Sensitive data visible in console (API keys, user emails, tokens)
- Log statements reference developer names or TODOs

**Wrong Code:**

```typescript
async function fetchLoads() {
  console.log('fetching loads...'); // Debug noise
  const response = await api.get('/loads');
  console.log('response:', response.data); // May contain PII
  console.log('TODO: add pagination'); // Unfinished work marker
  return response.data.data;
}
```

**Correct Code:**

```typescript
import { logger } from '@/lib/logger';

async function fetchLoads() {
  logger.debug('Fetching loads'); // Only appears in development
  const response = await api.get('/loads');
  return response.data.data;
}

// logger.ts
export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[TaskFlow]', ...args);
    }
  },
  error: (message: string, error?: unknown) => {
    console.error('[TaskFlow]', message, error);
    // In production, also send to Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error);
    }
  },
};
```

**Detection:**

```bash
# Count console.log statements (excluding test files and node_modules)
grep -rn "console\.log" apps/ --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir="*.test.*" | wc -l
```

**ESLint Rule:** `no-console: ["warn", { allow: ["warn", "error"] }]`

---

### AP-010: Missing Pagination on List Endpoints

**Severity:** HIGH | **Frequency:** Common | **Category:** Performance / Scalability

**Description:**
List endpoints that return all records without pagination. Works fine with 50 records in development, crashes or times out with 50,000 records in production. Every list endpoint must support `page`/`limit` parameters with sensible defaults.

**Symptoms:**
- Page loads slowly as data grows over months of use
- Browser tab crashes on large datasets (out of memory)
- API response times increase linearly with record count
- Mobile users on slow connections time out

**Wrong Code:**

```typescript
// Returns ALL loads for the tenant — could be 100,000+
@Get()
async findAll(@Req() req: AuthRequest) {
  return this.loadService.findAll(req.user.tenantId);
}

// Service
async findAll(tenantId: string) {
  return prisma.load.findMany({
    where: { tenantId },
  });
}
```

**Correct Code:**

```typescript
@Get()
async findAll(
  @Req() req: AuthRequest,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
) {
  const safeLimit = Math.min(limit, 100); // Cap at 100
  return this.loadService.findAll(req.user.tenantId, page, safeLimit);
}

// Service
async findAll(tenantId: string, page: number, limit: number) {
  const [data, total] = await Promise.all([
    prisma.load.findMany({
      where: { tenantId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.load.count({ where: { tenantId } }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

**Detection:**

```bash
# Find findMany calls without take/skip
grep -rn "findMany" apps/api/src/ --include="*.ts" -A 5 | grep -v "take\|skip" | grep "findMany"
```

---

## Prevention Checklist

Use this during PR review. Every PR touching data-fetching or API code must pass all applicable items.

### Data Access (AP-001, AP-004, AP-008, AP-010)

- [ ] API responses unwrapped correctly (`response.data.data`)
- [ ] All queries include tenant filtering (or use Prisma extension)
- [ ] No raw SQL with string interpolation
- [ ] List endpoints paginated with `page`/`limit` params

### Security (AP-004, AP-005, AP-008)

- [ ] No hardcoded tenant IDs, API keys, or credentials
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] User input parameterized in all database queries
- [ ] RBAC guards on new endpoints

### User Experience (AP-002, AP-003, AP-006, AP-007)

- [ ] All buttons have working handlers or are disabled with explanation
- [ ] Loading states shown for all async data (skeleton or spinner)
- [ ] Error boundaries present in route segments (`error.tsx`)
- [ ] Search inputs debounced (300ms minimum)

### Code Quality (AP-009, AP-010)

- [ ] No `console.log` in production code (use structured logger)
- [ ] No `eslint-disable` without justification comment
- [ ] All new list endpoints include pagination
- [ ] Test coverage for new code >= 70%

---

## Feedback Loop: Anti-Patterns to Lint Rules

When an anti-pattern is detected 3+ times across different PRs, it graduates to an automated ESLint rule:

```
Discovery (PR Review) → Document (this registry) → 3+ occurrences → ESLint Rule → CI Gate
```

### Currently Automated

| Anti-Pattern | ESLint Rule | Status |
| --- | --- | --- |
| AP-001 | `taskflow/no-single-unwrap` | Active in CI |
| AP-005 | `taskflow/no-localstorage-token` | Active in CI |
| AP-009 | `no-console` (built-in) | Warning in CI |

### Pending Automation

| Anti-Pattern | Planned Rule | Occurrences | ETA |
| --- | --- | --- | --- |
| AP-002 | `taskflow/no-empty-onclick` | 7 found | Sprint 14 |
| AP-003 | `taskflow/require-loading-state` | 12 found | Sprint 15 (complex AST) |
| AP-010 | `taskflow/require-pagination` | 4 found | Sprint 14 |

---

## Adding New Anti-Patterns

When you discover a new recurring issue:

1. Assign the next ID (`AP-011`, `AP-012`, etc.)
2. Document using the template above (Description, Symptoms, Wrong/Correct Code, Detection)
3. Add detection command (grep or lint rule)
4. Update the Prevention Checklist if applicable
5. Track frequency — after 3 occurrences, file an issue to create an ESLint rule
