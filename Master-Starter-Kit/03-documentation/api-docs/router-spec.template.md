# Router Specification: `{{ROUTER_NAME}}`

> **Domain:** {{DOMAIN_NAME}}
> **File:** `packages/api/src/routers/{router_name}.ts`
> **Procedures:** {{PROCEDURE_COUNT}}
> **Phase:** {{PHASE_NUMBER}}

---

## Overview

{2-3 sentences explaining what this router handles, what entity it manages, and its role in the application.}

---

## Procedures

### `{router}.list` — List {Entities}

| Aspect | Value |
|--------|-------|
| Type | Query |
| Auth | `protectedProcedure` (company-scoped) |
| Estimated frequency | High (every page load) |

**Input Schema:**

```typescript
z.object({
  search: z.string().optional(),
  status: z.enum(["{STATUS_1}", "{STATUS_2}", "{STATUS_3}"]).optional(),
  {filterField}: z.string().uuid().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "createdAt", "status", "{FIELD}"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})
```

**Output:**

```typescript
{
  items: {Entity}[],     // Array of entities with relations
  total: number,         // Total matching records (for pagination)
  page: number,          // Current page
  pageSize: number,      // Items per page
}
```

**Business Logic Notes:**
- Filter by `companyId` automatically (multi-tenant)
- Exclude soft-deleted records (`deletedAt IS NULL`)
- Search matches against `name` and `{{SEARCH_FIELD}}` (case-insensitive)
- Include related data: `{{RELATION_1}}`, `{{RELATION_2}}` (via joins)

---

### `{router}.getById` — Get {Entity} Detail

| Aspect | Value |
|--------|-------|
| Type | Query |
| Auth | `protectedProcedure` (company-scoped) |
| Estimated frequency | High |

**Input Schema:**

```typescript
z.object({
  id: z.string().uuid(),
})
```

**Output:**

```typescript
{
  ...{Entity},
  {relation1}: {RelatedEntity},        // Joined data
  {relation2}: {RelatedEntity}[],      // Has-many relation
  statusHistory: StatusHistoryEntry[], // Audit trail
}
```

**Business Logic Notes:**
- Verify entity belongs to user's company
- Include all related data (eager load via joins)
- Include status history (chronological)
- Throw `NOT_FOUND` if entity doesn't exist or is soft-deleted

---

### `{router}.create` — Create {Entity}

| Aspect | Value |
|--------|-------|
| Type | Mutation |
| Auth | `protectedProcedure` |
| Estimated frequency | Medium |

**Input Schema:**

```typescript
// From @{PROJECT}/validators
create{Entity}Schema = z.object({
  {field_1}: z.string().min(1, "Required").max(100),
  {field_2}: z.string().uuid(), // FK to related entity
  {field_3}: z.enum(["{OPTION_1}", "{OPTION_2}"]),
  {field_4}: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
})
```

**Output:** `{Entity}` (the created record)

**Business Logic Notes:**
- Set `companyId` from session (never from client input)
- Validate FK references exist and belong to same company
- Set initial status to `"{{INITIAL_STATUS}}"`
- Emit SSE event: `{entity}:created`
- Log to audit trail

---

### `{router}.update` — Update {Entity}

| Aspect | Value |
|--------|-------|
| Type | Mutation |
| Auth | `protectedProcedure` |
| Estimated frequency | Medium |

**Input Schema:**

```typescript
update{Entity}Schema = create{Entity}Schema.partial().extend({
  id: z.string().uuid(),
})
```

**Output:** `{Entity}` (the updated record)

**Business Logic Notes:**
- Verify entity exists and belongs to user's company
- Only update provided fields (partial update)
- Update `updatedAt` timestamp
- Validate FK references if changed
- Emit SSE event: `{entity}:updated`
- Log changed fields to audit trail

---

### `{router}.delete` — Delete {Entity}

| Aspect | Value |
|--------|-------|
| Type | Mutation |
| Auth | `{{REQUIRED_ROLE}}Procedure` |
| Estimated frequency | Low |

**Input Schema:**

```typescript
z.object({
  id: z.string().uuid(),
})
```

**Output:** `{ success: true }`

**Business Logic Notes:**
- Soft delete: set `deletedAt` and `deletedBy`, don't actually remove
- Check for dependent records (e.g., active {{CHILD_ENTITIES}})
  - If dependencies exist: throw `CONFLICT` with message "{Entity} has active {children} and cannot be deleted"
- Emit SSE event: `{entity}:deleted`
- Log to audit trail

---

### `{router}.updateStatus` — Change {Entity} Status

| Aspect | Value |
|--------|-------|
| Type | Mutation |
| Auth | `protectedProcedure` (with role check per transition) |
| Estimated frequency | Medium |

**Input Schema:**

```typescript
z.object({
  id: z.string().uuid(),
  status: z.enum(["{STATUS_1}", "{STATUS_2}", "{STATUS_3}"]),
  reason: z.string().max(500).optional(), // Required for certain transitions
})
```

**Output:** `{Entity}` (with updated status)

**Business Logic Notes:**
- Enforce state machine transitions (see domain rules doc)
- Some transitions require specific roles
- Some transitions require a `reason` (e.g., cancellation)
- Create entry in `{entity}_status_history` table
- Emit SSE event: `{entity}:statusChanged`
- May trigger side effects (see transition table below)

**Transition Side Effects:**

| From → To | Side Effect |
|-----------|-------------|
| {{STATUS_1}} → {{STATUS_2}} | {{SIDE_EFFECT}} |
| {{STATUS_2}} → {{STATUS_3}} | {{SIDE_EFFECT}} |
| {{STATUS_2}} → {{STATUS_4}} | {{SIDE_EFFECT}} |

---

### `{router}.{customProcedure}` — {Custom Action}

| Aspect | Value |
|--------|-------|
| Type | {Query/Mutation} |
| Auth | `{{AUTH_LEVEL}}Procedure` |
| Estimated frequency | {{FREQUENCY}} |

**Input Schema:**

```typescript
z.object({
  {CUSTOM_INPUT}: {ZOD_TYPE},
})
```

**Output:** `{{CUSTOM_OUTPUT_TYPE}}`

**Business Logic Notes:**
- {{CUSTOM_LOGIC_1}}
- {{CUSTOM_LOGIC_2}}

---

## Related Zod Schemas

All schemas are defined in `packages/validators/src/{entity}.ts`:

```typescript
// Create schema (used by create mutation)
export const create{Entity}Schema = z.object({ ... });
export type Create{Entity}Input = z.infer<typeof create{Entity}Schema>;

// Update schema (used by update mutation)
export const update{Entity}Schema = create{Entity}Schema.partial().extend({
  id: z.string().uuid(),
});
export type Update{Entity}Input = z.infer<typeof update{Entity}Schema>;

// Filter schema (used by list query)
export const {entity}FilterSchema = z.object({ ... });
export type {Entity}FilterInput = z.infer<typeof {entity}FilterSchema>;
```

---

## Unit Test Scenarios

> Each scenario should become a test in `packages/api/src/__tests__/{router}.test.ts`

### list
- [ ] Returns paginated results for authenticated user
- [ ] Filters by status correctly
- [ ] Search matches name (case-insensitive)
- [ ] Excludes soft-deleted records
- [ ] Only returns records for user's company (multi-tenant)
- [ ] Returns empty list with correct total=0

### getById
- [ ] Returns entity with all relations
- [ ] Throws NOT_FOUND for non-existent ID
- [ ] Throws NOT_FOUND for different company's entity
- [ ] Throws NOT_FOUND for soft-deleted entity

### create
- [ ] Creates entity with valid input
- [ ] Rejects invalid input (Zod validation)
- [ ] Sets companyId from session (not input)
- [ ] Validates FK references exist
- [ ] Sets initial status correctly
- [ ] Rejects unauthenticated request

### update
- [ ] Updates only provided fields
- [ ] Rejects update to different company's entity
- [ ] Validates FK references if changed
- [ ] Updates `updatedAt` timestamp

### delete
- [ ] Soft deletes (sets deletedAt, doesn't remove)
- [ ] Rejects delete with active dependencies
- [ ] Requires {{REQUIRED_ROLE}} role
- [ ] Rejects delete of different company's entity

### updateStatus
- [ ] Allows valid status transition
- [ ] Rejects invalid status transition
- [ ] Requires reason for {{TRANSITION}} transition
- [ ] Creates status history entry
- [ ] Triggers correct side effects

---

## Related Documentation

- **Table doc:** `../database-docs/{table_name}.md`
- **Domain rules:** `../feature-docs/{entity}-domain-rules.md`
- **Implementation spec:** `../feature-docs/{feature}-spec.md`
- **Router catalog:** `router-catalog.md`
