# Auth Roles & Permissions: {{PROJECT_NAME}}

## Overview

**Auth Provider:** {{AUTH_PROVIDER}}
**RBAC Strategy:** {SIMPLE_ROLE_LEVELS / GRANULAR_PERMISSIONS}
**Total Roles:** {{COUNT}}
**Multi-Tenant:** {YES / NO}

---

## Role Hierarchy

Roles are ordered by numeric level. Higher level = more privileges. A user with level 40 automatically has all permissions of levels 10-30.

| Role | Code | Level | Dashboard Route | Description |
|------|------|-------|----------------|-------------|
| `{{ROLE_1}}` | `{{CODE}}` | `{{LEVEL}}` | `{{ROUTE}}` | {{DESCRIPTION}} |
| `{{ROLE_2}}` | `{{CODE}}` | `{{LEVEL}}` | `{{ROUTE}}` | {{DESCRIPTION}} |
| `{{ROLE_3}}` | `{{CODE}}` | `{{LEVEL}}` | `{{ROUTE}}` | {{DESCRIPTION}} |
| `{{ROLE_ADMIN}}` | `admin` | `50` | `/admin/dashboard` | Full organization access |
| `{{ROLE_SUPER}}` | `super_admin` | `100` | `/system/dashboard` | Cross-organization system access |

### Hierarchy Function

```typescript
// packages/auth/src/roles.ts
export const ROLES = {
  {ROLE_1}: { level: {LEVEL}, label: "{LABEL}", defaultRoute: "{ROUTE}" },
  {ROLE_2}: { level: {LEVEL}, label: "{LABEL}", defaultRoute: "{ROUTE}" },
  {ROLE_3}: { level: {LEVEL}, label: "{LABEL}", defaultRoute: "{ROUTE}" },
  admin: { level: 50, label: "Admin", defaultRoute: "/admin/dashboard" },
  superAdmin: { level: 100, label: "Super Admin", defaultRoute: "/system/dashboard" },
} as const;

export type RoleName = keyof typeof ROLES;

export function hasMinimumRole(userRole: RoleName, requiredRole: RoleName): boolean {
  return ROLES[userRole].level >= ROLES[requiredRole].level;
}

export function getDefaultRoute(role: RoleName): string {
  return ROLES[role].defaultRoute;
}

export function getRoleLabel(role: RoleName): string {
  return ROLES[role].label;
}

// Get all roles at or above a certain level
export function getRolesAtLevel(minLevel: number): RoleName[] {
  return (Object.entries(ROLES) as [RoleName, { level: number }][])
    .filter(([, config]) => config.level >= minLevel)
    .map(([name]) => name);
}
```

---

## Permission Matrix

### By Feature Area

Mark each cell: **C** = Create, **R** = Read, **U** = Update, **D** = Delete, **X** = Full Access, **-** = No Access

| Feature Area | {{ROLE_1}} | {{ROLE_2}} | {{ROLE_3}} | Admin | Super Admin |
|-------------|----------|----------|----------|-------|-------------|
| Dashboard | R | R | R | X | X |
| {{DOMAIN_1}} | {{CRUD}} | {{CRUD}} | {{CRUD}} | X | X |
| {{DOMAIN_2}} | {{CRUD}} | {{CRUD}} | {{CRUD}} | X | X |
| {{DOMAIN_3}} | - | R | {{CRUD}} | X | X |
| Billing | - | - | R | X | X |
| Reports | - | R | R | X | X |
| User Management | - | - | - | X | X |
| Organization Settings | - | - | - | X | X |
| System Settings | - | - | - | - | X |

### Granular Permission Definitions

If using the granular permissions pattern (recommended for complex apps with 4+ roles):

| Permission | Code | Description | Roles |
|-----------|------|-------------|-------|
| View dashboard | `dashboard:read` | Access dashboard KPIs and charts | All roles |
| View {domain} | `{domain}:read` | List and view {domain} records | {{ROLES}} |
| Create {domain} | `{domain}:create` | Create new {domain} records | {{ROLES}} |
| Edit {domain} | `{domain}:update` | Modify existing {domain} records | {{ROLES}} |
| Delete {domain} | `{domain}:delete` | Soft-delete {domain} records | {{ROLES}} |
| {Domain action} | `{domain}:{action}` | {{DESCRIPTION}} | {{ROLES}} |
| View billing | `billing:read` | Access invoices and payment info | {{ROLES}} |
| Manage billing | `billing:manage` | Create invoices, record payments | {{ROLES}} |
| View reports | `reports:read` | Access reporting dashboards | {{ROLES}} |
| Export data | `reports:export` | Download CSV/PDF exports | {{ROLES}} |
| Manage users | `users:manage` | Invite, edit, deactivate users | admin, superAdmin |
| Manage org settings | `org:manage` | Edit organization profile, billing | admin, superAdmin |
| System administration | `system:manage` | Cross-org system settings | superAdmin |

### Permission Check Implementation

```typescript
// packages/auth/src/permissions.ts
export const PERMISSIONS = {
  "dashboard:read":   { minLevel: 10 },
  "{domain}:read":    { minLevel: 10 },
  "{domain}:create":  { minLevel: 20 },
  "{domain}:update":  { minLevel: 20 },
  "{domain}:delete":  { minLevel: 50 },
  "{domain}:{action}": { minLevel: 30 },
  "billing:read":     { minLevel: 40 },
  "billing:manage":   { minLevel: 40 },
  "reports:read":     { minLevel: 20 },
  "reports:export":   { minLevel: 40 },
  "users:manage":     { minLevel: 50 },
  "org:manage":       { minLevel: 50 },
  "system:manage":    { minLevel: 100 },
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(userRole: RoleName, permission: Permission): boolean {
  const roleLevel = ROLES[userRole].level;
  const requiredLevel = PERMISSIONS[permission].minLevel;
  return roleLevel >= requiredLevel;
}

// For UI: check if a nav item should be visible
export function canAccess(userRole: RoleName, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(userRole, p));
}
```

---

## Route Protection

### Server-Side (Middleware / Layout)

```typescript
// apps/web/src/app/(dashboard)/layout.tsx
import { auth } from "@project/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth.getSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}

// For role-specific routes
// apps/web/src/app/(dashboard)/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await auth.getSession();
  if (!session) redirect("/login");
  if (!hasMinimumRole(session.user.role, "admin")) redirect("/dashboard");
  return <>{children}</>;
}
```

### Client-Side (Nav Items)

```typescript
// apps/web/src/components/sidebar.tsx
const navItems = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard:read" as const },
  { label: "{Domain}", href: "/{domain}", permission: "{domain}:read" as const },
  { label: "Billing", href: "/billing", permission: "billing:read" as const },
  { label: "Settings", href: "/settings", permission: "org:manage" as const },
];

// Filter nav items by user's role
const visibleItems = navItems.filter((item) =>
  hasPermission(session.user.role, item.permission)
);
```

---

## Role Assignment Rules

| Scenario | Who Can Assign | Constraints |
|----------|---------------|-------------|
| Self-registration | System | Default role: `{{DEFAULT_ROLE}}` |
| Admin creates user | Admin | Can assign up to their own level |
| Admin promotes user | Admin | Cannot promote above their own level |
| Super admin | Super Admin | Can assign any role |
| Role downgrade | Admin | Requires confirmation dialog |
| Self role change | Nobody | Users cannot change their own role |

---

## Filled Example: Transportation Management

### Role Hierarchy

| Role | Code | Level | Dashboard Route | Description |
|------|------|-------|----------------|-------------|
| Viewer | `viewer` | 10 | `/dashboard` | Read-only access to assigned trips |
| Driver | `driver` | 15 | `/driver/dashboard` | Mobile-first view of own trips |
| Member | `member` | 20 | `/dashboard` | Standard office user |
| Dispatcher | `dispatcher` | 30 | `/dispatch` | Manages trip assignments and board |
| Manager | `manager` | 40 | `/dashboard` | Full access except settings |
| Admin | `admin` | 50 | `/dashboard` | Full organization access |
| Super Admin | `super_admin` | 100 | `/system` | Multi-org system administration |

### Permission Matrix

| Feature | Viewer | Driver | Member | Dispatcher | Manager | Admin |
|---------|--------|--------|--------|------------|---------|-------|
| Dashboard | R | R | R | R | R | X |
| Trips | R (own) | R (own) | R | CRUD | CRUD | X |
| Dispatch Board | - | - | R | X | X | X |
| Drivers | - | R (self) | R | RU | CRUD | X |
| Vehicles | - | R (assigned) | R | R | CRUD | X |
| Facilities | - | - | R | R | CRUD | X |
| Billing | - | - | - | R | CRUD | X |
| Reports | - | - | R | R | R | X |
| Users | - | - | - | - | R | X |
| Settings | - | - | - | - | - | X |

---

## Checklist

- [ ] All roles defined with unique numeric levels
- [ ] Default role for self-registration specified
- [ ] Every page has a route protection check
- [ ] Every API procedure has an auth tier
- [ ] Nav items filtered by role permissions
- [ ] Role assignment rules documented
- [ ] Super admin has separate system-level routes
- [ ] Permission check functions implemented and tested
- [ ] Role hierarchy function handles edge cases (unknown role returns lowest level)
