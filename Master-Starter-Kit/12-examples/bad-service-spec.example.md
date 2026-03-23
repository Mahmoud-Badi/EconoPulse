# Anti-Example: Bad Service Spec

> This is a deliberately shallow service spec with annotations explaining why each section fails. Use this to understand what "not deep enough" looks like — and to calibrate your own specs against a known-bad example.

**Depth Score: 3/10**

---

## Service: Task Management Service

### Overview

> Our Task Management Service leverages cutting-edge technology to provide a seamless, end-to-end solution for managing tasks. Built with a modern microservices architecture, it enables teams to collaborate efficiently and drive productivity through innovative features and best-in-class performance.

---

**ANNOTATION — WHY THIS FAILS:**

- **Buzzword density:** "cutting-edge," "seamless," "end-to-end," "innovative," "best-in-class" — none of these words convey information. Remove them and the paragraph says nothing.
- **No specifics:** What technology? What architecture patterns? What does "collaborate efficiently" actually mean in terms of features?
- **No scope boundary:** What does this service own? What does it NOT own? Without a boundary, developers will build the wrong things or duplicate work from other services.
- **Score: 1/10**

**WHAT GOOD LOOKS LIKE:**
> The Task Service owns CRUD operations for tasks and task assignments within a workspace. It handles task state transitions (draft → active → complete → archived), deadline tracking, and assignment notifications. It does NOT own: user management (→ User Service), file attachments (→ Media Service), or real-time updates (→ WebSocket Service). Tech stack: Node.js API on Express, PostgreSQL database, Redis for caching active task counts.

---

### Data Model

```
Task
  - id
  - title
  - status
```

---

**ANNOTATION — WHY THIS FAILS:**

- **Three fields is a toy, not a data model.** A real task entity has 15-30 fields. Where is: description, assignee, creator, due date, priority, workspace/project association, created_at, updated_at, deleted_at?
- **No types specified.** Is `id` a UUID, integer, or string? Is `status` an enum? What are the enum values?
- **No relationships.** Tasks don't exist in isolation. What about: Task → User (assignee), Task → Project, Task → Comments, Task → Labels?
- **No indexes.** Which fields are queried together? Without index planning, you'll discover performance problems at 10K records.
- **No constraints.** Is title required? Max length? Is status constrained to specific values?
- **Score: 1/10**

**WHAT GOOD LOOKS LIKE:**
```
Task
  - id: UUID (PK, generated)
  - workspace_id: UUID (FK → workspaces.id, NOT NULL, indexed)
  - title: VARCHAR(500) (NOT NULL, min length 1)
  - description: TEXT (nullable, max 50,000 chars)
  - status: ENUM('draft', 'active', 'in_progress', 'review', 'complete', 'archived')
  - priority: ENUM('urgent', 'high', 'medium', 'low') (default: 'medium')
  - assignee_id: UUID (FK → users.id, nullable, indexed)
  - creator_id: UUID (FK → users.id, NOT NULL)
  - due_date: TIMESTAMP (nullable, indexed for "overdue" queries)
  - position: INTEGER (for manual ordering within a list)
  - created_at: TIMESTAMP (NOT NULL, default NOW())
  - updated_at: TIMESTAMP (NOT NULL, auto-updated)
  - deleted_at: TIMESTAMP (nullable, soft delete)

Indexes:
  - (workspace_id, status) — list tasks by status within workspace
  - (assignee_id, status) — "my tasks" query
  - (workspace_id, due_date) WHERE status != 'complete' — overdue task check

Relationships:
  - Task 1 → N TaskComments
  - Task N ← N Labels (via task_labels join table)
  - Task N → 1 Workspace
  - Task N → 1 User (assignee)
  - Task N → 1 User (creator)
```

---

### API Endpoints

```
GET    /tasks         - Get tasks
POST   /tasks         - Create task
PUT    /tasks/:id     - Update task
DELETE /tasks/:id     - Delete task
```

---

**ANNOTATION — WHY THIS FAILS:**

- **No request/response shapes.** What does the POST body look like? What does the GET response return? Without this, frontend and backend developers will build against different assumptions.
- **No query parameters.** GET /tasks returns... all tasks? For all users? For all workspaces? What about filtering, sorting, pagination?
- **No authentication/authorization noted.** Who can call these endpoints? Can any user delete any task?
- **No status codes.** What does a 404 vs 403 vs 422 look like?
- **No rate limits, no versioning.**
- **PUT vs PATCH not considered.** PUT implies full replacement. Most task updates change one field. PATCH is more appropriate.
- **Score: 2/10**

**WHAT GOOD LOOKS LIKE:**
```
GET /api/v1/workspaces/:workspace_id/tasks
  Auth: Bearer token (workspace member)
  Query params:
    - status: string (filter by status, comma-separated for multiple)
    - assignee_id: UUID (filter by assignee)
    - due_before: ISO 8601 date
    - sort: "created_at" | "due_date" | "priority" (default: "created_at")
    - order: "asc" | "desc" (default: "desc")
    - page: integer (default: 1)
    - per_page: integer (default: 20, max: 100)
  Response 200:
    {
      "data": [{ "id": "uuid", "title": "...", "status": "active", ... }],
      "meta": { "total": 142, "page": 1, "per_page": 20, "total_pages": 8 }
    }
  Response 403: { "error": "not_a_workspace_member" }

POST /api/v1/workspaces/:workspace_id/tasks
  Auth: Bearer token (workspace member)
  Body:
    {
      "title": "string (required, 1-500 chars)",
      "description": "string (optional, max 50000 chars)",
      "status": "draft | active (default: active)",
      "priority": "urgent | high | medium | low (default: medium)",
      "assignee_id": "UUID (optional)",
      "due_date": "ISO 8601 (optional)"
    }
  Response 201: { "data": { task object } }
  Response 422: { "errors": [{ "field": "title", "message": "is required" }] }
```

---

### Business Rules

> Standard validation will be applied. Tasks follow normal workflow patterns.

---

**ANNOTATION — WHY THIS FAILS:**

- **"Standard validation" means nothing.** Standard according to whom? What's being validated and what are the rules?
- **"Normal workflow patterns" is meaningless.** What state transitions are allowed? Can a task go from "complete" back to "draft"? Can you skip states?
- **No authorization rules.** Who can assign tasks? Can a non-admin delete tasks? Can you reassign someone else's task?
- **No business logic documented.** What happens when a task is completed? Does it trigger notifications? Update project progress? Archive after 30 days?
- **Score: 1/10**

**WHAT GOOD LOOKS LIKE:**

```
State Transitions:
  draft → active (any workspace member)
  active → in_progress (assignee or admin only)
  in_progress → review (assignee only)
  review → complete (reviewer or admin)
  complete → archived (auto after 90 days, or manual by admin)
  any state → draft (admin only, with audit log entry)
  INVALID: complete → in_progress (must reopen: complete → active → in_progress)

Validation Rules:
  - Title: required, 1-500 characters, trimmed, no leading/trailing whitespace
  - Assignee: must be an active member of the same workspace
  - Due date: must be in the future at creation time (existing tasks can have past due dates)
  - A user can have max 50 active (non-complete) tasks assigned to them
  - Task deletion is soft-delete (sets deleted_at, excluded from queries)
  - Hard delete after 30 days by background job

Side Effects:
  - Task assigned → notification to assignee (email + in-app)
  - Task completed → notification to creator
  - Task overdue → daily digest notification to assignee + creator
  - Task status change → audit log entry with old_status, new_status, changed_by, timestamp
```

---

### Edge Cases

> Edge cases will be handled as they arise during development.

---

**ANNOTATION — WHY THIS FAILS:**

- **This is the most dangerous line in any spec.** It means "we haven't thought about edge cases" — which means developers will discover them in production.
- **Edge cases found in production cost 10-100x more to fix** than edge cases found during design.
- **This line should trigger an immediate spec rejection.** If you can't name 5 edge cases, you haven't understood the feature deeply enough to build it.
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**

```
Edge Cases:
  1. User assigned to task is removed from workspace
     → Task remains, assignee_id set to null, creator notified

  2. Task created with due date in the past
     → Reject with 422: "Due date must be in the future"

  3. Two users update the same task simultaneously
     → Last-write-wins based on updated_at timestamp
     → Return 409 Conflict if client sends stale updated_at

  4. Workspace has 100,000+ tasks
     → Pagination mandatory, no "get all" endpoint
     → Status filter indexed for performance
     → Archive completed tasks > 90 days to cold storage

  5. Task title contains only whitespace or special characters
     → Trim whitespace, reject if empty after trim
     → Allow special characters (emoji, unicode) — don't restrict

  6. Bulk operations (assign 50 tasks to new user)
     → Batch endpoint with max 100 items per request
     → Partial success: return which succeeded and which failed
     → All-or-nothing option via transaction flag

  7. Task description contains markdown/HTML
     → Store raw, sanitize on render (never trust client-rendered HTML)
     → Max 50,000 characters — reject larger with clear error
```

---

### Error Handling

*(Section not included in original spec)*

---

**ANNOTATION — WHY THIS FAILS:**

- **No error handling section at all.** This means every developer will invent their own error format, error codes, and error messages.
- **Inconsistent error responses are the #1 source of frontend/backend integration bugs.**
- **Score: 0/10**

**WHAT GOOD LOOKS LIKE:**

```
Error Response Format (all endpoints):
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with id '123' not found in workspace 'abc'",
    "status": 404,
    "details": {}  // Optional additional context
  }
}

Error Codes:
  TASK_NOT_FOUND (404) — Task ID doesn't exist or is soft-deleted
  TASK_VALIDATION_FAILED (422) — Request body fails validation
    details: { "fields": [{ "field": "title", "rule": "required" }] }
  WORKSPACE_NOT_FOUND (404) — Workspace doesn't exist
  NOT_WORKSPACE_MEMBER (403) — User is not a member of this workspace
  ASSIGNMENT_LIMIT_REACHED (422) — Assignee has 50+ active tasks
  INVALID_STATE_TRANSITION (422) — Status change not allowed
    details: { "current": "complete", "requested": "in_progress", "allowed": ["archived", "active"] }
  RATE_LIMITED (429) — Too many requests
    headers: Retry-After: 60
  INTERNAL_ERROR (500) — Unexpected server error (logged, not exposed to client)
```

---

## Depth Score Breakdown: 3/10

| Section | Score | Weight | Weighted |
|---------|-------|--------|----------|
| Overview | 1/10 | 10% | 0.1 |
| Data Model | 1/10 | 20% | 0.2 |
| API Endpoints | 2/10 | 20% | 0.4 |
| Business Rules | 1/10 | 20% | 0.2 |
| Edge Cases | 0/10 | 15% | 0.0 |
| Error Handling | 0/10 | 15% | 0.0 |
| **Total** | | | **0.9/10 → 3/10 (generous rounding)** |

### Why This Score Is Generous

A truly honest score would be closer to 1/10. The 3/10 reflects that:
- It at least identified the four CRUD endpoints (structure is present)
- It named the core entity (Task) and its key field (status)
- The document exists at all (some projects have no spec)

### The Core Problem

This spec answers "what are we building?" at a surface level. It answers none of:
- **How** does it work? (state machine, validation, authorization)
- **What happens when** things go wrong? (errors, edge cases, conflicts)
- **Who** can do what? (authorization model)
- **How much** can it handle? (performance, limits, pagination)

A developer receiving this spec would need to make dozens of assumptions. Each assumption is a potential bug, a potential rework, and a potential production incident.
