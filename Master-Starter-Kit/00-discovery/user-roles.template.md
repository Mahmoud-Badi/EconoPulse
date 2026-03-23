# User Roles & Permissions Matrix

> Define every user role in the system, their permission level, default routes, and key workflows.
> This document drives: RBAC implementation, sidebar navigation per role, seed data generation, and E2E test personas.

---

## How to Use This Template

1. **List every role** from the project brief (Section 4: User Types)
2. **Assign numeric levels** using the scale below
3. **Define the dashboard route** each role sees after login
4. **Map key workflows** — the 3-5 things each role does daily
5. **Summarize permissions** — what each role can Create, Read, Update, Delete

---

## Numeric Level Scale

Numeric levels provide a simple, flexible way to implement RBAC. Higher numbers = more access. The system checks `user.role.level >= requiredLevel` for permission gates.

| Range | Tier | Description |
|-------|------|-------------|
| **100** | Super Admin | God mode. Can do anything. System configuration, user management, data export. Usually only 1-2 people. |
| **80-99** | Admin | Full operational access. Can manage users, view all data, configure settings. Cannot modify system-level config. |
| **60-79** | Manager | Can oversee a team or department. Read access to most data. Write access to their domain. |
| **40-59** | Operator | Primary daily users. Full CRUD on their assigned entities. Limited cross-domain access. |
| **20-39** | Contributor | Can create and edit their own data. Limited read access to others' data. |
| **10-19** | Viewer | Read-only access to assigned data. Cannot create, edit, or delete. |
| **1-9** | Guest | Minimal access. Public-facing or pre-approval users. |

**Rules for assigning levels:**
- Leave gaps between roles (10, 40, 60, 80, 100) so you can insert new roles later without renumbering
- Two roles with the same level have identical access — differentiate by specific permissions, not level
- The level system is for coarse-grained access; fine-grained permissions (e.g., "can edit trip but not delete trip") are handled by a separate permissions array

---

## Role Definition Matrix

| Role Name | Description | Level | Dashboard Route | Key Workflows | Permissions Summary |
|-----------|-------------|-------|----------------|---------------|-------------------|
| {{ROLE_1}} | {{DESCRIPTION}} | {{LEVEL}} | {/dashboard/...} | {WORKFLOW_1, WORKFLOW_2, WORKFLOW_3} | {C/R/U/D summary} |
| {{ROLE_2}} | {{DESCRIPTION}} | {{LEVEL}} | {/dashboard/...} | {WORKFLOW_1, WORKFLOW_2, WORKFLOW_3} | {C/R/U/D summary} |
| {{ROLE_3}} | {{DESCRIPTION}} | {{LEVEL}} | {/dashboard/...} | {WORKFLOW_1, WORKFLOW_2, WORKFLOW_3} | {C/R/U/D summary} |
| {{ROLE_4}} | {{DESCRIPTION}} | {{LEVEL}} | {/dashboard/...} | {WORKFLOW_1, WORKFLOW_2, WORKFLOW_3} | {C/R/U/D summary} |
| {{ROLE_5}} | {{DESCRIPTION}} | {{LEVEL}} | {/dashboard/...} | {WORKFLOW_1, WORKFLOW_2, WORKFLOW_3} | {C/R/U/D summary} |

---

## Detailed Permission Breakdown

For each role, define specific CRUD permissions per entity. Use this table to generate your permission middleware.

### {{ROLE_1}}: {{ROLE_NAME}} (Level {{LEVEL}})

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| Users | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| {{ENTITY_2}} | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| {{ENTITY_3}} | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| Settings | {Y/N} | {All/Own/None} | {All/Own/None} | {Y/N} | {{NOTES}} |

### {{ROLE_2}}: {{ROLE_NAME}} (Level {{LEVEL}})

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| Users | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| {{ENTITY_2}} | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| {{ENTITY_3}} | {Y/N} | {All/Own/Team/None} | {All/Own/Team/None} | {Y/N} | {{NOTES}} |
| Settings | {Y/N} | {All/Own/None} | {All/Own/None} | {Y/N} | {{NOTES}} |

*(Copy the table above for each additional role)*

---

## Navigation Per Role

Define what each role sees in the sidebar. This drives the `sidebarConfig` object in your app.

### {{ROLE_1}}: {{ROLE_NAME}}

```
Sidebar:
  - Dashboard (home)
  - {NAV_ITEM_2}
  - {NAV_ITEM_3}
  - {NAV_ITEM_4}
  - Settings
    - {SUB_1}
    - {SUB_2}
```

### {{ROLE_2}}: {{ROLE_NAME}}

```
Sidebar:
  - Dashboard (home)
  - {NAV_ITEM_2}
  - {NAV_ITEM_3}
  - Settings (read-only)
```

*(Copy for each additional role)*

---

## Seed Data Personas

For each role, define a test persona used in seed data and E2E tests. These should be memorable and consistent across all environments.

| Role | Persona Name | Email | Password (dev only) | Notes |
|------|-------------|-------|---------------------|-------|
| {{ROLE_1}} | {{NAME}} | {{EMAIL}}@{{DOMAIN}} | {{SEED_PASSWORD}} | Primary test account for this role |
| {{ROLE_2}} | {{NAME}} | {{EMAIL}}@{{DOMAIN}} | {{SEED_PASSWORD}} | Primary test account for this role |
| {{ROLE_3}} | {{NAME}} | {{EMAIL}}@{{DOMAIN}} | {{SEED_PASSWORD}} | Primary test account for this role |

**Password policy:** All seed data users use `{{SEED_PASSWORD}}` (e.g., `Password123!`) in development. Production passwords are set by users during onboarding.

---

## Role Escalation Rules

Define how users change roles. This prevents accidental privilege escalation.

| Action | Who Can Do It | Constraints |
|--------|--------------|-------------|
| Promote user to higher role | {ROLE with level >= target level} | Cannot promote above own level |
| Demote user to lower role | {ROLE with level >= current level} | Cannot demote self |
| Create new user with role | {ROLE with level >= target level} | Must have "user:create" permission |
| Deactivate user | {ROLE with level >= target level} | Cannot deactivate self or higher-level users |

---

## Reference Example: Delta TMS V3 (8-Role System)

This is a production example from a wheelchair transportation management system. Use it as a reference for structure, not content.

| Role Name | Description | Level | Dashboard Route | Key Workflows | Permissions Summary |
|-----------|-------------|-------|----------------|---------------|-------------------|
| Super Admin | System owner, full platform access | 100 | /dashboard | All operations, system config, user management | Full CRUD on everything |
| Admin | Company administrator | 90 | /dashboard | User management, reports, settings, billing | Full CRUD except system config |
| Operations Manager | Oversees daily operations | 80 | /dashboard | Trip oversight, driver management, facility management | CRUD on trips, drivers, facilities, vehicles |
| Dispatcher | Assigns and manages trips | 60 | /dispatch | Trip assignment, schedule management, driver coordination | CRUD on trips, Read drivers/vehicles |
| Billing Clerk | Handles invoicing and payments | 50 | /billing | Invoice creation, payment tracking, AR management | CRUD on invoices, Read trips/facilities |
| Driver | Performs transport | 30 | /driver | View assigned trips, update trip status, navigation | Read own trips, Update trip status |
| Facility Staff | Healthcare facility contact | 20 | /facility | Request trips, view trip status, manage patients | Create trip requests, Read own facility trips |
| Read-Only | Auditor or observer | 10 | /dashboard | View dashboards and reports | Read-only on all entities |

**Key design decisions in this example:**
- Gaps between levels (10, 20, 30, 50, 60, 80, 90, 100) allow inserting new roles
- Dispatcher (60) and Billing Clerk (50) are at similar levels but have completely different entity access
- Driver (30) has very limited scope — only their own assigned trips
- Facility Staff (20) is external — they can request trips but not manage the system

---

## Implementation Notes

### Database Schema

```
roles table:
  - id: uuid
  - name: string (unique)
  - level: integer (1-100)
  - description: string
  - permissions: jsonb (array of permission strings)
  - created_at: timestamp
  - updated_at: timestamp

users table:
  - role_id: uuid (FK to roles)
```

### Permission String Format

Use a consistent format for fine-grained permissions:

```
{entity}:{action}
{entity}:{action}:{scope}

Examples:
  trips:create          -- Can create trips
  trips:read:all        -- Can read all trips
  trips:read:own        -- Can only read own trips
  trips:read:team       -- Can read team's trips
  invoices:delete       -- Can delete invoices
  settings:update       -- Can update settings
```

### Middleware Pattern

```typescript
// Route-level: check numeric level
requireLevel(60)  // Only dispatchers and above

// Action-level: check specific permission
requirePermission("trips:create")

// Scope-level: filter data by ownership
filterByScope("trips:read")  // Returns "all", "own", or "team"
```
