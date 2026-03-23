# Service Spec: Projects Service — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in service specification for
# a fictional TaskFlow project. Your service specs will be generated
# during ORCHESTRATOR Step 5 (Service Specs & Hub Files).
# ============================================================

> **Service:** Projects | **Priority:** P0 — Critical Path | **Phase:** 1
> **Backend Status:** Not Started | **Frontend Status:** Not Started

---

## 1. Overview

The Projects service manages the lifecycle of client projects within a workspace. A project is the top-level organizing entity — tasks, time entries, and reports all belong to a project. Every revenue-generating activity flows through this service. Projects carry budgets, deadlines, team assignments, and status workflows that determine what actions are available at any given point. This is the single most-used service in TaskFlow — every session begins with a project list or project detail view.

## 2. Domain Model

```
Project
├── id: UUID (PK)
├── workspaceId: UUID (FK → workspaces)
├── name: string (required, 1-100 chars)
├── slug: string (unique within workspace, auto-generated from name)
├── description: text (optional, max 2000 chars)
├── status: enum (DRAFT, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED)
├── color: string (hex, default: workspace theme)
├── clientName: string (optional, max 100 chars)
├── budget: integer (cents, optional)
├── budgetSpent: integer (cents, computed from time entries)
├── dueDate: date (optional)
├── ownerId: UUID (FK → users, the project manager)
├── deletedAt: timestamp (nullable, soft delete)
├── createdAt: timestamp
├── updatedAt: timestamp
├── version: integer (optimistic locking counter)
│
├── tasks[] (1:N → Task)
├── members[] (N:N → User via project_members)
└── timeEntries[] (1:N → TimeEntry)

ProjectMember
├── id: UUID (PK)
├── projectId: UUID (FK → projects)
├── userId: UUID (FK → users)
├── role: enum (OWNER, EDITOR, VIEWER)
├── joinedAt: timestamp
└── invitedBy: UUID (FK → users)

AuditEntry
├── id: UUID (PK)
├── projectId: UUID (FK → projects)
├── action: string (e.g., "budget.changed", "status.changed")
├── previousValue: jsonb
├── newValue: jsonb
├── performedBy: UUID (FK → users)
└── createdAt: timestamp
```

## 3. Status Workflow

```
DRAFT → ACTIVE → ON_HOLD → ACTIVE → COMPLETED → ARCHIVED
                    ↑                     │
                    └─────────────────────┘ (reopen)
```

**Business Rules:**

1. A project cannot transition to COMPLETED if it has any tasks with status IN_PROGRESS or TODO — all tasks must be DONE or CANCELLED before the project can complete. The API returns a `TASKS_INCOMPLETE` error listing the count of blocking tasks.
2. Only the project owner or a workspace admin can change project status. Other PMs who are not the owner receive a `FORBIDDEN` error even if they have PM-level workspace permissions.
3. Soft delete sets `deletedAt` to the current timestamp and excludes the project from all list queries. After 90 days, a scheduled job hard-deletes the project and all associated data (tasks, time entries, members, audit log) in compliance with GDPR Article 17. Users receive a warning email at 7 days and 1 day before hard deletion.
4. Archived projects are read-only: no new tasks can be created, no new members can be added, no budget or due date changes are allowed. The only permitted write operation on an archived project is to reopen it (transition back to ACTIVE).
5. Project names must be unique within a workspace (case-insensitive comparison using PostgreSQL `LOWER()`). Attempting to create or rename a project to a name that already exists returns `CONFLICT` with code `DUPLICATE_PROJECT_NAME`.
6. All budget changes are logged in the project audit trail with the previous value, new value, user who made the change, and timestamp. This audit trail is immutable — entries cannot be edited or deleted, even by admins.
7. Changing the due date after the project has been in ACTIVE status triggers an automatic notification to all project members. The notification includes the old date, the new date, and the name of the person who made the change.
8. A project must have at least one member at all times — the owner. The owner cannot be removed from the project; attempting to remove the owner returns `CANNOT_REMOVE_OWNER`. Ownership can be transferred to another member via `project.transferOwnership`, which also updates the `ownerId` field.
9. When a project transitions to COMPLETED, the system records the completion timestamp, calculates total time spent (sum of all time entries), and emits the `project.completed` event. This event triggers a summary report email to the project owner.
10. Creating a new project automatically adds the creator as the owner and sole member. The project starts in DRAFT status regardless of the input — the creator must explicitly activate it.
11. Project slugs are auto-generated from the name using kebab-case (e.g., "Acme Corp Rebrand" becomes `acme-corp-rebrand`). If a slug collision occurs within the workspace, a numeric suffix is appended (e.g., `acme-corp-rebrand-2`). Slugs are immutable once created — renaming the project does not change the slug to preserve URL stability.
12. The `version` field is used for optimistic locking. Every update request must include the current `version` value. If the version on the server does not match, the update is rejected with `CONFLICT` and code `VERSION_MISMATCH`, forcing the client to re-fetch and retry.

## 4. API Procedures

| Procedure | Auth | Input | Output |
|-----------|------|-------|--------|
| `project.list` | Protected | `ProjectListInput` | Paginated project list with member count and task stats |
| `project.getById` | Protected | `{ id: UUID }` | Full project with members, recent tasks, time summary |
| `project.countByStatus` | Protected | — | `{ draft: number, active: number, onHold: number, completed: number, archived: number }` |
| `project.create` | PM+ | `ProjectCreateInput` | Created project with generated slug |
| `project.update` | PM+ (owner) | `ProjectUpdateInput` | Updated project (validates version for optimistic locking) |
| `project.updateStatus` | PM+ (owner) | `{ id: UUID, status: ProjectStatus, version: number }` | Updated project (validates transition rules) |
| `project.delete` | Admin | `{ id: UUID }` | Soft delete (sets deletedAt), returns `{ deletedAt: timestamp }` |
| `project.addMember` | PM+ (owner) | `{ projectId: UUID, userId: UUID, role: MemberRole }` | Project member record |
| `project.removeMember` | PM+ (owner) | `{ projectId: UUID, userId: UUID }` | `{ success: true }` |
| `project.listMembers` | Protected | `{ projectId: UUID }` | Member list with roles and join dates |
| `project.transferOwnership` | Owner only | `{ projectId: UUID, newOwnerId: UUID, version: number }` | Updated project with new owner |
| `project.bulkUpdateStatus` | Admin | `{ projectIds: UUID[], status: ProjectStatus }` | `{ updated: number, failed: { id: UUID, reason: string }[] }` |
| `project.export` | PM+ | `{ projectId: UUID, format: "csv" \| "json" }` | Signed download URL (expires in 15 minutes) |

### Request/Response DTO Shapes

**`ProjectCreateInput`**
```typescript
{
  name: string;           // required, 1-100 chars
  description?: string;   // optional, max 2000 chars
  clientName?: string;    // optional, max 100 chars
  budget?: number;        // optional, integer >= 0 (cents)
  dueDate?: string;       // optional, ISO 8601 date, must be in the future
  color?: string;         // optional, valid hex (#RRGGBB)
}
```

**`ProjectCreateOutput`**
```typescript
{
  id: UUID;
  workspaceId: UUID;
  name: string;
  slug: string;           // auto-generated from name
  description: string | null;
  status: "DRAFT";        // always DRAFT on creation
  color: string;          // hex, defaults to workspace theme
  clientName: string | null;
  budget: number | null;
  budgetSpent: 0;
  dueDate: string | null;
  ownerId: UUID;          // set to the creator
  version: 1;
  createdAt: string;      // ISO 8601 timestamp
  updatedAt: string;
}
```

**`ProjectUpdateInput`**
```typescript
{
  id: UUID;               // required
  version: number;        // required, optimistic locking
  name?: string;          // 1-100 chars if provided
  description?: string;   // max 2000 chars if provided
  clientName?: string;    // max 100 chars if provided
  budget?: number;        // integer >= 0 (cents) if provided
  dueDate?: string;       // ISO 8601, must be in the future if provided
  color?: string;         // valid hex (#RRGGBB) if provided
}
```

**`ProjectListInput`**
```typescript
{
  status?: ProjectStatus | ProjectStatus[];  // filter by one or more statuses
  search?: string;         // full-text search on name, description, clientName
  page: number;            // 1-indexed, default 1
  limit: number;           // 10-100, default 25
  sort: "name" | "createdAt" | "dueDate" | "budgetSpent";
  order: "asc" | "desc";  // default "desc" for createdAt, "asc" for name
}
```

**`ProjectListOutput`**
```typescript
{
  data: Array<{
    id: UUID;
    name: string;
    slug: string;
    status: ProjectStatus;
    color: string;
    clientName: string | null;
    budget: number | null;
    budgetSpent: number;
    dueDate: string | null;
    ownerId: UUID;
    ownerName: string;      // denormalized for display
    memberCount: number;
    taskStats: {
      total: number;
      completed: number;
      overdue: number;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 5. Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Required, 1-100 characters, must not be only whitespace, unique within workspace (case-insensitive). Leading/trailing whitespace is trimmed before validation. |
| `slug` | Auto-generated from name, kebab-case, unique within workspace. Not user-editable. If collision, numeric suffix appended. |
| `description` | Optional, max 2000 characters. Accepts Markdown formatting. Sanitized for XSS (HTML tags stripped). |
| `clientName` | Optional, max 100 characters. Leading/trailing whitespace trimmed. |
| `budget` | Optional, integer >= 0. Stored as cents (e.g., $500.00 = 50000). Maximum value: 999999999 (prevents integer overflow, represents $9,999,999.99). |
| `dueDate` | Optional. Must be a valid ISO 8601 date. Must be today or in the future when initially set. When updating, can be any future date. Cannot be set to a past date. Stored as UTC. |
| `color` | Optional, must match pattern `^#[0-9A-Fa-f]{6}$`. If not provided, defaults to the workspace's primary theme color. |
| `status` | Must be a valid enum value (DRAFT, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED). Must follow the status workflow transitions — invalid transitions are rejected. |
| `version` | Required on all update operations. Must be a positive integer. Must match the current server-side version or the update is rejected with VERSION_MISMATCH. |
| `projectId` | Required on member operations. Must reference an existing, non-deleted project within the user's workspace. |
| `userId` (for member ops) | Must reference an existing user who is a member of the workspace. Cannot add a user who is already a project member (returns ALREADY_MEMBER). |
| `role` (for member ops) | Must be one of OWNER, EDITOR, VIEWER. Only one member can have the OWNER role at a time. |

## 6. Authorization

| Action | Admin | PM (owner) | PM (not owner) | Team Member |
|--------|-------|-----------|----------------|-------------|
| List projects | All | All | All | Assigned only |
| View project | All | All | All | Assigned only |
| Create project | Yes | Yes | Yes | No |
| Update project | Yes | Yes | No | No |
| Change status | Yes | Yes | No | No |
| Delete project | Yes | No | No | No |
| Add/remove members | Yes | Yes | No | No |
| Transfer ownership | No | Yes | No | No |
| Bulk status update | Yes | No | No | No |
| Export project | Yes | Yes | Yes (if member) | No |
| View audit trail | Yes | Yes | No | No |

## 7. Edge Cases

1. **Project owner is removed from the workspace.** If the workspace admin removes a user who owns projects, those projects must have ownership transferred before removal is allowed. The API returns `OWNER_HAS_PROJECTS` with a list of affected project IDs. The admin must reassign ownership first using `project.transferOwnership` for each affected project.

2. **Concurrent update conflict (optimistic locking).** Two users open the same project edit form. User A saves changes (version goes from 3 to 4). User B tries to save with version 3 — the API returns `VERSION_MISMATCH` with the current version number and a diff of what changed since their fetch. The client displays: "This project was updated by [user] at [time]. Review their changes and try again."

3. **Project with 10,000+ tasks.** The `project.getById` endpoint returns only the 20 most recent tasks by default to keep response time under 200ms. The full task list is loaded separately via `task.list` with pagination. The `taskStats` aggregate (total, completed, overdue) is computed via a materialized view refreshed every 60 seconds, not a live COUNT query.

4. **Budget set to zero.** A budget of `0` (zero cents) is valid and distinct from `null` (no budget). Zero budget means the project is explicitly tracked as zero-budget (e.g., internal projects). The budget progress bar shows 0% used with a "No budget allocated" label. The `null` budget hides the budget section entirely from the UI.

5. **Attempting to remove all members.** The owner cannot be removed (returns `CANNOT_REMOVE_OWNER`). If an admin tries to remove the owner, the response explains that ownership must be transferred first. The result is that a project always has at least one member. Bulk member removal via the UI skips the owner and shows a notice: "The project owner cannot be removed."

6. **Project name with special characters or emoji.** Names can contain Unicode characters, including emoji (e.g., "Launch Day Party"). The slug generator strips non-ASCII characters and replaces spaces with hyphens: "Launch Day Party" becomes `launch-day-party`. If stripping produces an empty slug, a random 8-character alphanumeric slug is generated instead. Names are stored as UTF-8 and rendered as-is in the UI.

7. **Workspace plan downgrades and project limit is exceeded.** The Free plan allows 5 active projects. If a workspace on the Pro plan (unlimited) downgrades to Free and has 12 active projects, existing projects are preserved but no new projects can be created. The UI shows: "You've reached the 5-project limit on the Free plan. Upgrade to create more projects." Archiving or completing existing projects frees up slots.

8. **Due date timezone handling.** Due dates are stored as UTC dates (not datetimes). The API accepts ISO 8601 date strings (e.g., `2026-04-15`). The frontend displays due dates in the user's local timezone, but since they are date-only (not datetime), there is no timezone ambiguity for the date itself. The "overdue" calculation compares against the end of the due date in the workspace's configured timezone (e.g., a project due on April 15 is not overdue until April 16 00:00:00 in the workspace timezone).

9. **Slug collision on project creation.** If "Acme Corp" already exists with slug `acme-corp`, creating another project named "Acme Corp" would generate `acme-corp-2`. If `acme-corp-2` also exists, it generates `acme-corp-3`, and so on. The system queries existing slugs with a prefix match and picks the next available suffix. Maximum suffix tested: 999 (theoretical limit, never hit in practice).

10. **Soft-deleted project accessed by direct URL.** If a user navigates to `/projects/[id]` for a soft-deleted project, the API returns `410 GONE` with a message: "This project was deleted on [date]. Contact your workspace admin to restore it." Admins see an additional "Restore" button. After the 90-day retention period, the response becomes a standard `404 NOT_FOUND`.

## 8. Screens

| Screen | Route | Task ID |
|--------|-------|---------|
| Projects List | `/projects` | PROJ-001 |
| Project Detail | `/projects/[slug]` | PROJ-002 |
| New Project Form | `/projects/new` | PROJ-003 |
| Edit Project Form | `/projects/[slug]/edit` | PROJ-004 |
| Project Settings | `/projects/[slug]/settings` | PROJ-005 |
| Project Audit Log | `/projects/[slug]/audit` | PROJ-006 |

## 9. Events Emitted

| Event | Payload | Consumers |
|-------|---------|-----------|
| `project.created` | `{ projectId, workspaceId, ownerId, name }` | Notifications, Activity Log |
| `project.updated` | `{ projectId, changedFields[], changedBy }` | Activity Log |
| `project.statusChanged` | `{ projectId, oldStatus, newStatus, changedBy }` | Notifications, Dashboard |
| `project.memberAdded` | `{ projectId, userId, role, invitedBy }` | Notifications, Activity Log |
| `project.memberRemoved` | `{ projectId, userId, removedBy }` | Notifications, Activity Log |
| `project.completed` | `{ projectId, completedBy, totalTimeSpent, taskCount }` | Notifications, Reports |
| `project.deleted` | `{ projectId, deletedBy, hardDeleteDate }` | Activity Log, Scheduled Jobs |
| `project.ownershipTransferred` | `{ projectId, oldOwnerId, newOwnerId }` | Notifications |
| `project.budgetChanged` | `{ projectId, oldBudget, newBudget, changedBy }` | Notifications, Audit Log |
| `project.dueDateChanged` | `{ projectId, oldDueDate, newDueDate, changedBy }` | Notifications (all members) |

## 10. Dependencies

| Depends On | Relationship |
|-----------|-------------|
| Auth service | User identity, session validation, and role resolution |
| Team service | Workspace membership for member assignment and plan limit checks |
| Notifications service | Event-driven notifications for status changes, member additions, due date changes |
| Scheduled Jobs service | 90-day hard deletion of soft-deleted projects (GDPR compliance) |

| Depended On By | Relationship |
|----------------|-------------|
| Tasks service | Tasks belong to projects; task creation blocked for archived/deleted projects |
| Time Tracking service | Time entries scoped to projects; budget spent computed from time entries |
| Reports service | Project-level metrics, completion rates, and budget utilization reports |
| Dashboard service | Project status counts and overdue project alerts |

## 11. Database Indexes

```sql
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_workspace_status ON projects(workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_workspace_slug ON projects(workspace_id, slug) UNIQUE;
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_workspace_name ON projects(workspace_id, LOWER(name)) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_due_date ON projects(due_date) WHERE status = 'ACTIVE' AND due_date IS NOT NULL;
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_audit_project ON project_audit(project_id, created_at DESC);
```

## 12. Seed Data

| Record | Status | Owner | Members | Tasks |
|--------|--------|-------|---------|-------|
| Acme Corp Rebrand | ACTIVE | sarah@taskflow.dev | 4 | 12 |
| Widget Co App Design | ACTIVE | mike@taskflow.dev | 3 | 20 |
| Internal Tooling | DRAFT | sarah@taskflow.dev | 2 | 5 |
| Q1 Marketing Campaign | COMPLETED | sarah@taskflow.dev | 5 | 15 |
| Office Renovation | ARCHIVED | admin@taskflow.dev | 2 | 8 |
| Client Portal MVP | ON_HOLD | mike@taskflow.dev | 3 | 18 |
| Annual Report Design | DRAFT | sarah@taskflow.dev | 1 | 0 |

## 13. Error Scenarios

| Error | Code | HTTP | Message | Recovery |
|-------|------|------|---------|----------|
| Project not found | NOT_FOUND | 404 | "Project not found" | Verify project ID. If soft-deleted, admins can restore within 90 days. |
| Deleted project accessed | GONE | 410 | "This project was deleted on {date}" | Contact workspace admin to restore before the 90-day retention expires. |
| Duplicate name in workspace | DUPLICATE_PROJECT_NAME | 409 | "A project with this name already exists in this workspace" | Choose a different name or rename the existing project. |
| Invalid status transition | INVALID_STATUS_TRANSITION | 400 | "Cannot transition from {old} to {new}. Allowed transitions: {list}" | Review the status workflow diagram. Ensure the project is in the correct state first. |
| Not project owner | FORBIDDEN | 403 | "Only the project owner or a workspace admin can perform this action" | Ask the project owner or an admin to make this change. |
| Cannot complete with open tasks | TASKS_INCOMPLETE | 400 | "Cannot complete project: {count} tasks are still incomplete" | Complete or cancel all remaining tasks, then retry. |
| Cannot archive with open tasks | TASKS_INCOMPLETE | 400 | "Complete or remove all tasks before archiving" | Complete, cancel, or delete all tasks first. |
| Version conflict | VERSION_MISMATCH | 409 | "This project was modified by {user} at {time}. Your version: {yours}, current: {theirs}" | Re-fetch the project, review the changes, and retry with the current version. |
| Cannot remove project owner | CANNOT_REMOVE_OWNER | 400 | "The project owner cannot be removed. Transfer ownership first." | Use `project.transferOwnership` to assign a new owner before removing this member. |
| Member already exists | ALREADY_MEMBER | 409 | "This user is already a member of this project" | No action needed — the user already has access. |
| Workspace project limit reached | PLAN_LIMIT_EXCEEDED | 403 | "Your workspace has reached the {limit}-project limit on the {plan} plan" | Upgrade the workspace plan, or archive/complete existing projects to free up slots. |
| Budget exceeds maximum | BUDGET_OVERFLOW | 400 | "Budget cannot exceed $9,999,999.99" | Enter a budget within the allowed range. |

## 14. User Workflows

### Workflow: Monday Morning Project Kickoff

Sarah is a PM at a digital agency. She opens TaskFlow at 9:00 AM to kick off a new client engagement.

**9:00 AM — Create the project.** Sarah clicks "New Project" from the projects list. She types "Acme Corp Website Redesign" in the name field. As she types, the slug preview below shows `acme-corp-website-redesign` updating in real-time. She sets the client name to "Acme Corp", enters a budget of $50,000 (stored as 5000000 cents), and picks April 15, 2026 as the due date. She chooses a teal color from the palette. She clicks "Create Project" — the project is created in DRAFT status and she lands on the project detail page.

**9:02 AM — Invite the team.** From the project detail page, Sarah clicks the "Members" tab. She sees herself listed as Owner. She clicks "Add Member" and searches for team members by name. She adds David (Designer, role: EDITOR), Priya (Developer, role: EDITOR), and Carlos (QA, role: VIEWER). Each of them receives an email notification: "Sarah invited you to Acme Corp Website Redesign."

**9:05 AM — Activate the project.** Sarah clicks the status badge showing "DRAFT" and selects "ACTIVE" from the dropdown. A confirmation dialog asks "Activate this project? All members will be notified." She confirms. The status changes, the badge turns green, and all 3 team members receive a push notification.

**9:06 AM — Check the dashboard.** Sarah navigates to the projects list. She sees "Acme Corp Website Redesign" in the list with status ACTIVE, 4 members, 0 tasks, and a budget progress bar at 0%. The list is sorted by most recently updated, so the new project appears at the top.

### Workflow: End-of-Quarter Project Wrap-Up

Mike is closing out "Widget Co App Design" which his team has been working on for 8 weeks.

**3:00 PM — Review remaining tasks.** Mike opens the project and sees 3 tasks still marked as IN_PROGRESS. He clicks "Complete Project" from the status dropdown but receives an error: "Cannot complete project: 3 tasks are still incomplete." He coordinates with his team to close out the remaining work.

**4:30 PM — Complete the project.** With all tasks now DONE, Mike clicks "Complete Project" again. This time it succeeds. The status badge turns purple, a completion timestamp is recorded, and a summary email is sent to all 3 team members showing: total hours logged (342h), budget utilization (87%), and task completion rate (100%).

**4:32 PM — Archive for cleanup.** A week later, after the final invoice is sent, Mike archives the project. It disappears from the default project list view but remains accessible via the "Show archived" filter toggle.

## 15. What Makes This Delightful

**Instant project creation with smart defaults.** Creating a project takes under 10 seconds. The name is the only required field — everything else has intelligent defaults. The color is auto-assigned from a curated palette (cycling through 12 colors so adjacent projects in the list are visually distinct). The slug is auto-generated. The creator is auto-added as owner. The status starts as DRAFT so there is no pressure to have everything ready immediately.

**Real-time member activity feed.** The project detail page includes a live activity feed powered by WebSocket subscriptions. When David uploads a design mockup or Priya completes a task, it appears in the feed within 500ms — no page refresh needed. This creates a sense of team momentum that static dashboards cannot match.

**Budget tracking with visual progress bar.** The budget is not just a number — it is a progress bar that fills as time entries accumulate. The bar turns yellow at 75% utilization and red at 90%. Hovering over the bar shows a tooltip: "$43,250.00 of $50,000.00 used (86.5%) — $6,750.00 remaining at current burn rate: 12 days." This gives PMs instant financial awareness without opening a spreadsheet.

**Auto-generated project slug for clean URLs.** Every project gets a human-readable URL like `/projects/acme-corp-website-redesign` instead of `/projects/f47ac10b-58cc-4372-a567`. These slugs are stable — renaming the project does not break bookmarked URLs. Slugs are unique within a workspace and handle collisions gracefully with numeric suffixes.

**Keyboard-navigable project list.** Power users can navigate the project list entirely with the keyboard: `j`/`k` to move between rows, `Enter` to open a project, `n` to create a new project, `/` to focus the search bar. The currently selected row has a subtle blue highlight.

## 16. Power User Features

**Bulk status updates.** Admins can select multiple projects using checkboxes in the list view and change their status in a single operation. A floating action bar appears at the bottom: "4 selected — Change Status | Archive | Export." Bulk operations that partially fail return a detailed report: "3 updated, 1 failed (Widget Co: has incomplete tasks)."

**Keyboard shortcuts.** The following shortcuts are available on the projects list and detail pages:
- `n` — New project
- `/` — Focus search
- `j` / `k` — Navigate list
- `Enter` — Open selected project
- `e` — Edit current project
- `Esc` — Close modal / cancel editing
- `?` — Show keyboard shortcut help overlay

**CSV and JSON export.** Any project can be exported as CSV or JSON via the project settings page. The export includes all project metadata, member list, task summary, and time entry totals. The export is generated asynchronously and delivered as a signed download URL that expires in 15 minutes. For large projects (1,000+ tasks), the export runs as a background job and notifies the user via email when ready.

**Advanced filtering and saved views.** The project list supports compound filters: status, owner, date range, budget range, and member. Filters can be combined (e.g., "ACTIVE projects owned by Sarah with budget > $10k due before April"). Filter combinations can be saved as named views (e.g., "My Active Projects") and shared with the workspace.

**Quick-switch between projects.** Pressing `Cmd+K` (Mac) or `Ctrl+K` (Windows) opens a command palette that searches across all projects by name, client, or slug. Results appear as the user types with 50ms debounce. Selecting a result navigates directly to that project. Recent projects appear first when the palette is empty.

## 17. First-Time User Experience

**Empty state with guided onboarding.** When a new user opens the projects list for the first time and has no projects, they see an illustrated empty state (not a blank page). The illustration shows a simple project board. Below it: "Create your first project to start tracking work." A primary CTA button reads "Create Project" and a secondary link says "Import from CSV" for users migrating from other tools.

**Sample project option.** During workspace onboarding (first 24 hours), the empty state also offers: "Or start with a sample project to explore TaskFlow." Clicking this creates a pre-populated project called "Sample Project" with 5 example tasks, 2 members (the user and a fictional bot user), and a $10,000 budget. The sample project has a distinctive badge and can be deleted at any time.

**Contextual tooltips on first visit.** The first time a user visits the project detail page, three tooltips appear in sequence (dismissable): (1) pointing to the status badge — "Click here to change your project's status"; (2) pointing to the members tab — "Invite your team to collaborate"; (3) pointing to the budget bar — "Track spending against your budget in real-time." These tooltips are tracked per-user and never shown again once dismissed.

**Smart defaults reduce friction.** New projects default to DRAFT status (low commitment), no budget (optional), no due date (optional), and the workspace theme color. The only required field is the project name. This means a user can create their first project in under 5 seconds — just type a name and hit Enter. All other fields can be filled in later as the project takes shape.
