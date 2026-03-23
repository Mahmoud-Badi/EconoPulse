# Permission Catalog

> **Purpose:** Single source of truth for every permission in {{PROJECT_NAME}}.
> Every action that requires authorization is registered here with its permission key, roles, and gates.
> If a permission is not in this catalog, it cannot be enforced.
>
> **Target:** 50-80 permissions across all services.

---

## How to Use This Catalog

1. **During spec writing:** When a service spec defines role-based access, register each permission here.
2. **During implementation:** Backend guards and frontend route protection reference these permission keys exactly.
3. **During testing:** Permission tests verify that each gate correctly enforces its permission key.
4. **Cross-reference:** Every permission in auth matrices within service specs must appear here. The CROSS-REFERENCE-VALIDATOR checks this.

---

## Permission Key Convention

Format: `{service}.{resource}.{action}`

- `service`: Lowercase service name (e.g., `auth`, `billing`, `orders`)
- `resource`: Lowercase resource name (e.g., `user`, `invoice`, `report`)
- `action`: Lowercase action verb (e.g., `create`, `read`, `update`, `delete`, `export`, `approve`)

Examples:
- `auth.user.create` — Create a new user
- `billing.invoice.export` — Export invoices to CSV/PDF
- `orders.order.approve` — Approve a pending order

---

## Role Definitions

| Role | Description | Level | Inherits From |
|------|-------------|-------|---------------|
| `{{ROLE_SUPER_ADMIN}}` | Full system access, cross-tenant | 0 | None (root) |
| `{{ROLE_ADMIN}}` | Tenant-level full access | 1 | None |
| `{{ROLE_MANAGER}}` | Department/team management | 2 | `{{ROLE_MEMBER}}` |
| `{{ROLE_MEMBER}}` | Standard user access | 3 | `{{ROLE_VIEWER}}` |
| `{{ROLE_VIEWER}}` | Read-only access | 4 | None |
<!-- Add project-specific roles. Most projects have 4-7 roles. -->

---

## Permission Registry

| Permission Key | Description | Roles | Gate Type | Gate Location | Service |
|---------------|-------------|-------|-----------|---------------|---------|
| `auth.user.create` | {{PERMISSION_DESCRIPTION}} | {{ALLOWED_ROLES}} | {{GATE_TYPE}} | {{GATE_LOCATION}} | {{SERVICE_NAME}} |
| `auth.user.read` | {{PERMISSION_DESCRIPTION}} | {{ALLOWED_ROLES}} | {{GATE_TYPE}} | {{GATE_LOCATION}} | {{SERVICE_NAME}} |
| `auth.user.update` | {{PERMISSION_DESCRIPTION}} | {{ALLOWED_ROLES}} | {{GATE_TYPE}} | {{GATE_LOCATION}} | {{SERVICE_NAME}} |
| `auth.user.delete` | {{PERMISSION_DESCRIPTION}} | {{ALLOWED_ROLES}} | {{GATE_TYPE}} | {{GATE_LOCATION}} | {{SERVICE_NAME}} |
| `auth.role.assign` | {{PERMISSION_DESCRIPTION}} | {{ALLOWED_ROLES}} | {{GATE_TYPE}} | {{GATE_LOCATION}} | {{SERVICE_NAME}} |
<!-- Repeat for every permission. Target: 50-80 rows. -->
<!-- Group by service. Include CRUD + special actions (approve, export, bulk-delete, impersonate, etc.) -->

### Gate Type Key

| Gate Type | Description | Implementation |
|-----------|-------------|----------------|
| `endpoint` | Backend API route guard | `@RequirePermission('key')` decorator or middleware |
| `screen` | Frontend route protection | Route guard redirects to 403 page |
| `ui-element` | Frontend component visibility | Conditional rendering based on `hasPermission('key')` |
| `field` | Field-level access control | Specific fields hidden/readonly based on permission |
| `data-filter` | Row-level data filtering | Query scoped to user's accessible records |

---

## Permission Inheritance / Hierarchy

### Inheritance Rules

| Rule | Description |
|------|-------------|
| Role inheritance | Higher-level roles inherit ALL permissions of lower-level roles they extend |
| Resource wildcard | `{service}.{resource}.*` grants all actions on a resource — used sparingly, only for admin roles |
| Service wildcard | `{service}.*.*` grants full service access — reserved for `{{ROLE_SUPER_ADMIN}}` only |
| Explicit deny | An explicit deny overrides any inherited grant. Deny rules are documented in the exceptions table below |
| Tenant scoping | All permissions are scoped to the user's tenant unless the role has `cross-tenant` flag |

### Inheritance Matrix

| Role | Inherits Permissions From | Additional Grants | Explicit Denies |
|------|---------------------------|-------------------|-----------------|
| `{{ROLE_SUPER_ADMIN}}` | All | Cross-tenant access, system config | None |
| `{{ROLE_ADMIN}}` | `{{ROLE_MANAGER}}` | User management, billing, audit logs | Cross-tenant access |
| `{{ROLE_MANAGER}}` | `{{ROLE_MEMBER}}` | Team management, reports, approvals | Billing access |
| `{{ROLE_MEMBER}}` | `{{ROLE_VIEWER}}` | Create, update, delete own resources | Admin screens |
| `{{ROLE_VIEWER}}` | None | Read-only access to assigned resources | All write operations |

### Permission Exceptions

| Exception | Overrides | Reason |
|-----------|-----------|--------|
| {{EXCEPTION_DESCRIPTION}} | {{OVERRIDDEN_PERMISSION}} | {{BUSINESS_REASON}} |
<!-- Document any cases where the inheritance model is overridden. E.g., "Managers cannot delete billing records even though they inherit Member permissions" -->

---

## Permission Testing Verification

### Test Matrix

For each permission key, the following tests must exist:

| Test Type | Description | Assertion |
|-----------|-------------|-----------|
| Positive access | Authorized role accesses the gate | Returns 200 / renders element |
| Negative access | Unauthorized role accesses the gate | Returns 403 / element not rendered |
| Unauthenticated | No auth token provided | Returns 401 / redirects to login |
| Cross-tenant | User from Tenant A tries to access Tenant B resource | Returns 403 (not 404) |
| Role escalation | User manipulates role claim in token | Returns 403 (token revalidated server-side) |

### Test Coverage Requirements

| Metric | Target |
|--------|--------|
| Permission keys with positive tests | 100% |
| Permission keys with negative tests | 100% |
| Cross-tenant isolation tests | All data-scoped permissions |
| Role escalation tests | All admin-level permissions |

### Test File Locations

| Test Type | Path Pattern |
|-----------|-------------|
| Backend permission guards | `{{BACKEND_SRC}}/auth/__tests__/permissions.test.{{FILE_EXT}}` |
| Frontend route guards | `{{FRONTEND_SRC}}/__tests__/route-guards.test.{{FILE_EXT}}` |
| E2E permission flows | `{{E2E_TEST_PATH}}/permissions/` |

---

## Completeness Checklist

- [ ] Every service spec auth matrix entry has a matching permission key here
- [ ] Every role in role definitions is used by at least one permission
- [ ] Every screen in the screen catalog has its required permissions documented
- [ ] Every API endpoint in the API catalog has its permission guard documented
- [ ] Inheritance chain is acyclic (no circular inheritance)
- [ ] Test matrix has 100% coverage for positive and negative tests
- [ ] Cross-tenant isolation verified for all data-scoped permissions
- [ ] Permission keys follow the naming convention consistently
