# API Router Spec: {{ROUTER_NAME}}

## Overview

**Router:** `{{ROUTER_NAME}}Router`
**File:** `packages/api/src/routers/{{ROUTER_NAME}}.ts`
**Domain:** {{DOMAIN_DESCRIPTION}}
**Procedure Count:** {{COUNT}} ({{COMPLEXITY_LEVEL}}: Simple 4-6 / Standard 8-12 / Complex 12-20)

---

## Procedures

### Queries

| # | Procedure | Auth Tier | Description | Input Schema | Output |
|---|-----------|-----------|-------------|-------------|--------|
| 1 | `list` | protected | Paginated list with filters | `list{Domain}Schema` | `{ items: {Domain}[], pagination }` |
| 2 | `getById` | protected | Single record by ID | `{ id: uuid }` | `{Domain} \| null` |
| 3 | `{{QUERY_NAME}}` | `{{AUTH_TIER}}` | {{DESCRIPTION}} | `{{INPUT_SCHEMA}}` | `{{OUTPUT_TYPE}}` |

### Mutations

| # | Procedure | Auth Tier | Description | Input Schema | Output |
|---|-----------|-----------|-------------|-------------|--------|
| 1 | `create` | protected | Create new {domain} | `create{Domain}Schema` | `{Domain}` |
| 2 | `update` | protected | Update existing {domain} | `update{Domain}Schema` | `{Domain}` |
| 3 | `delete` | protected | Soft delete {domain} | `{ id: uuid }` | `{ success: boolean }` |
| 4 | `{{MUTATION_NAME}}` | `{{AUTH_TIER}}` | {{DESCRIPTION}} | `{{INPUT_SCHEMA}}` | `{{OUTPUT_TYPE}}` |

### Domain Actions

| # | Procedure | Auth Tier | Description | Input Schema | Output | State Transition |
|---|-----------|-----------|-------------|-------------|--------|-----------------|
| 1 | `{{ACTION_NAME}}` | `{{AUTH_TIER}}` | {{DESCRIPTION}} | `{{INPUT_SCHEMA}}` | `{{OUTPUT_TYPE}}` | `{{FROM_STATUS}}` -> `{{TO_STATUS}}` |

---

## Input Schemas

### `list{Domain}Schema`

```typescript
const list{Domain}Schema = z.object({
  // Filters
  status: z.enum([{STATUS_VALUES}]).optional(),
  {FILTER_FIELD}: z.{TYPE}().optional(),

  // Date range
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),

  // Search
  search: z.string().max(100).optional(),

  // Pagination
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum([{SORTABLE_COLUMNS}]).default("{DEFAULT_SORT}"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
```

### `create{Domain}Schema`

```typescript
const create{Domain}Schema = z.object({
  {FIELD}: z.{TYPE}({CONSTRAINTS}),
  // ... all required fields for creation
});
```

### `update{Domain}Schema`

```typescript
const update{Domain}Schema = create{Domain}Schema.partial().extend({
  id: z.string().uuid(),
});
```

### Domain Action Schemas

```typescript
// {ACTION_NAME}
const {ACTION_NAME}Schema = z.object({
  id: z.string().uuid(),
  {ADDITIONAL_FIELDS},
});
```

---

## Middleware Requirements

| Middleware | Applied To | Purpose |
|-----------|-----------|---------|
| `auth` | All procedures | Session validation |
| `tenantIsolation` | All procedures | Filter by organizationId |
| `softDeleteFilter` | All queries | Exclude deletedAt records |
| `{{MIDDLEWARE_NAME}}` | `{{PROCEDURES}}` | {{PURPOSE}} |

---

## Related Schemas

| Schema File | Tables Used | Relationship |
|-------------|-------------|-------------|
| `packages/db/src/schema/{{TABLE}}.ts` | `{{TABLE_NAME}}` | Primary table |
| `packages/db/src/schema/{{RELATED}}.ts` | `{{RELATED_TABLE}}` | {{RELATIONSHIP_TYPE}} |
| `packages/validators/src/{{DOMAIN}}.ts` | — | Input validation schemas |

---

## Error Scenarios

| Scenario | Error Code | Message |
|----------|-----------|---------|
| Record not found | `NOT_FOUND` | `{Domain} not found` |
| Unauthorized access | `FORBIDDEN` | `You don't have permission to {action} this {domain}` |
| Invalid state transition | `BAD_REQUEST` | `Cannot {action} a {domain} with status "{currentStatus}"` |
| Duplicate record | `CONFLICT` | `A {domain} with this {unique_field} already exists` |
| `{{SCENARIO}}` | `{{CODE}}` | `{{MESSAGE}}` |

---

## Performance Considerations

- **List query:** Uses composite index `({{TABLE}}_org_status_idx)` for filtered queries
- **Search:** {SEARCH_STRATEGY — e.g., ILIKE on name, or pg_trgm for fuzzy}
- **Eager loading:** {WHICH_RELATIONS_TO_INCLUDE — e.g., "include driver and vehicle on list"}
- **Caching:** {CACHE_STRATEGY — e.g., "Dashboard KPIs cached for 30s via TanStack Query staleTime"}

---

## Filled Example: Trips Router

### Overview

**Router:** `tripsRouter`
**File:** `packages/api/src/routers/trips.ts`
**Domain:** Trip lifecycle management — scheduling, assignment, dispatch, completion
**Procedure Count:** 14 (Complex)

### Queries

| # | Procedure | Auth Tier | Description | Input Schema | Output |
|---|-----------|-----------|-------------|-------------|--------|
| 1 | `list` | protected | Paginated trips with filters | `listTripsSchema` | `{ items: Trip[], pagination }` |
| 2 | `getById` | protected | Single trip with all relations | `{ id: uuid }` | `TripDetail` |
| 3 | `getByDriver` | protected | Trips for a specific driver | `{ driverId: uuid, date? }` | `Trip[]` |
| 4 | `getByDate` | protected | All trips for a date range | `{ from: datetime, to: datetime }` | `Trip[]` |
| 5 | `getStats` | protected | Trip count/status breakdown | `{ dateRange? }` | `TripStats` |

### Mutations

| # | Procedure | Auth Tier | Description | Input Schema | Output |
|---|-----------|-----------|-------------|-------------|--------|
| 1 | `create` | protected | Schedule new trip | `createTripSchema` | `Trip` |
| 2 | `update` | protected | Update trip details | `updateTripSchema` | `Trip` |
| 3 | `delete` | protected | Soft delete trip | `{ id: uuid }` | `{ success: true }` |

### Domain Actions

| # | Procedure | Auth Tier | Description | Input | Output | Transition |
|---|-----------|-----------|-------------|-------|--------|-----------|
| 1 | `assign` | protected | Assign driver + vehicle | `{ id, driverId, vehicleId }` | `Trip` | `scheduled` -> `assigned` |
| 2 | `dispatch` | protected | Start the trip | `{ id }` | `Trip` | `assigned` -> `in_progress` |
| 3 | `complete` | protected | Finish the trip | `{ id, notes? }` | `Trip` | `in_progress` -> `completed` |
| 4 | `cancel` | protected | Cancel with reason | `{ id, reason }` | `Trip` | `scheduled\|assigned` -> `cancelled` |
| 5 | `noShow` | protected | Passenger no-show | `{ id, notes? }` | `Trip` | `in_progress` -> `no_show` |
| 6 | `unassign` | admin | Remove driver assignment | `{ id }` | `Trip` | `assigned` -> `scheduled` |
