# Screen Catalog: {{PROJECT_NAME}}

## Overview

**Total Pages:** {{COUNT}}
**User Roles:** {{ROLE_LIST}}
**Auth Required:** {YES_FOR_ALL / MIXED}

This document catalogs every page in the application, organized by user role and portal. Every route must have:
- An explicit auth requirement
- A list of data dependencies (tRPC queries or REST endpoints)
- Defined states (loading, error, empty, data)
- A responsive strategy

---

## Route Structure

```
/                           → Redirect to /login or /dashboard
├── (auth)/                 → Public auth pages (no sidebar)
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /reset-password
├── (dashboard)/            → Authenticated pages (with sidebar)
│   ├── /dashboard          → Default landing page
│   ├── /{domain}/          → Domain list page
│   │   ├── /new            → Create form
│   │   └── /[id]           → Detail/edit page
│   ├── /{domain-2}/
│   │   ├── /new
│   │   └── /[id]
│   ├── /dispatch           → Specialized page (not CRUD)
│   ├── /reports/
│   │   ├── /{report-type}
│   │   └── /{report-type}
│   ├── /settings/
│   │   ├── /profile
│   │   ├── /organization
│   │   └── /users
│   └── /admin/             → Admin-only section
│       ├── /system
│       └── /audit-log
└── /api/                   → API routes (no UI)
    ├── /auth/*             → Auth endpoints
    ├── /trpc/*             → tRPC handler
    ├── /events             → SSE stream
    └── /webhooks/*         → External webhooks
```

---

## Auth Pages (Public)

| Route | Title | Auth | Primary Action | Data Queries | Key Components | Responsive |
|-------|-------|------|---------------|-------------|----------------|------------|
| `/login` | Sign In | Public | Email/password login | None | LoginForm, OAuthButtons | Centered card, full-width on mobile |
| `/register` | Create Account | Public | Create account | None | RegisterForm, OAuthButtons | Centered card, full-width on mobile |
| `/forgot-password` | Forgot Password | Public | Send reset email | None | ForgotPasswordForm | Centered card |
| `/reset-password` | Reset Password | Public | Set new password | None | ResetPasswordForm | Centered card |

---

## Portal: {{PORTAL_NAME}} (Roles: {{ROLE_LIST}})

### Dashboard

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/dashboard` | Dashboard | All | Protected | View KPIs | `dashboard.getSnapshot`, `dashboard.getCharts` | KPICards, ChartGrid, RecentActivity | Loading: skeleton cards; Error: error banner; Empty: "No data yet" prompt; Data: full dashboard | 1-col on mobile, 2-col tablet, 3-col desktop |

### {{DOMAIN_1}}: {{DOMAIN_NAME}}

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/{domain}` | {Domain} List | {{ROLES}} | Protected | View/filter list | `{domain}.list` | DataTable, StatusFilter, SearchInput, PageHeader | Loading: table skeleton; Error: error state; Empty: EmptyState with CTA; Data: paginated table | Table scrolls horizontally on mobile |
| `/{domain}/new` | New {Domain} | {{ROLES}} | Protected | Create {domain} | None (form only) | {Domain}Form, PageHeader, BreadcrumbNav | Loading: N/A; Error: form validation errors; Data: empty form | Single column form, full-width inputs |
| `/{domain}/[id]` | {Domain} Detail | {{ROLES}} | Protected | View/edit {domain} | `{domain}.getById` | {Domain}Detail, StatusBadge, ActionButtons, TabNav | Loading: detail skeleton; Error: not found state; Data: detail view with tabs | Stacked sections on mobile |
| `/{domain}/[id]/edit` | Edit {Domain} | {{ROLES}} | Protected | Update {domain} | `{domain}.getById` | {Domain}Form (prefilled), PageHeader | Loading: form skeleton; Error: not found; Data: prefilled form | Same as new form |

### {{DOMAIN_2}}: {{DOMAIN_NAME}}

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/{domain-2}` | {Domain} List | {{ROLES}} | Protected | View/filter list | `{domain-2}.list` | DataTable, Filters, PageHeader | Loading/Error/Empty/Data | Horizontal scroll on mobile |
| `/{domain-2}/new` | New {Domain} | {{ROLES}} | Protected | Create | None | {Domain}Form | Standard form states | Single column |
| `/{domain-2}/[id]` | {Domain} Detail | {{ROLES}} | Protected | View/edit | `{domain-2}.getById` | Detail layout | Standard detail states | Stacked on mobile |

### Specialized Pages

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/dispatch` | Dispatch Board | dispatcher+ | Protected | Drag-drop assignments | `dispatch.getBoardState`, `drivers.list` | KanbanBoard, DriverCards, TripCards, AlertBanner | Loading: column skeletons; Empty: "No trips today"; Data: full board | Not supported on mobile (show message); tablet: 2 columns |
| `/reports/{type}` | {Report Type} | manager+ | Protected | View/export report | `reports.get{Type}` | ChartContainer, DataTable, DateRangePicker, ExportButton | Loading: chart skeleton; Empty: "No data for range"; Data: charts + tables | Charts stack on mobile |

### Settings

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/settings/profile` | My Profile | All | Protected | Update profile | `users.getProfile` | ProfileForm, AvatarUpload, PasswordChangeForm | Standard form states | Single column |
| `/settings/organization` | Organization | admin+ | Admin | Update org settings | `org.getSettings` | OrgSettingsForm, LogoUpload | Standard form states | Single column |
| `/settings/users` | User Management | admin+ | Admin | Manage users | `users.list` | UserTable, InviteDialog, RoleSelect | Standard table states | Horizontal scroll |

### Admin Pages

| Route | Title | Roles | Auth | Primary Action | Data Queries | Key Components | States | Responsive |
|-------|-------|-------|------|---------------|-------------|----------------|--------|------------|
| `/admin/system` | System Settings | super_admin | Super Admin | Manage system | `system.getConfig` | SystemConfigForm | Standard form states | Single column |
| `/admin/audit-log` | Audit Log | admin+ | Admin | View audit trail | `audit.list` | AuditTable, UserFilter, DateFilter | Standard table states | Horizontal scroll |

---

## State Definitions

Every page must handle these four states:

### Loading State
- Show skeleton placeholders matching the final layout
- Never show a blank page or full-page spinner
- Skeleton should be responsive (same layout as data state)

```typescript
// Pattern
if (query.isLoading) return <PageSkeleton />;
```

### Error State
- Show a user-friendly error message
- Provide a retry button
- Log the full error to console/monitoring
- Never show raw error messages or stack traces

```typescript
if (query.isError) return <ErrorState message="Failed to load trips" onRetry={query.refetch} />;
```

### Empty State
- Show a helpful message explaining what would appear here
- Provide a CTA to create the first record (if the user has permission)
- Include an icon or illustration

```typescript
if (query.data?.items.length === 0) {
  return <EmptyState
    icon={TruckIcon}
    title="No trips yet"
    description="Create your first trip to get started"
    action={{ label: "New Trip", href: "/trips/new" }}
  />;
}
```

### Data State
- The normal rendered state with real data
- Must handle edge cases: long text truncation, missing optional fields, date formatting

---

## Responsive Strategy Reference

| Breakpoint | Width | Layout Strategy |
|-----------|-------|----------------|
| Mobile | < 640px | Single column, stacked sections, hamburger nav |
| Tablet | 640-1024px | 2-column where possible, collapsible sidebar |
| Desktop | 1024-1440px | Full sidebar, 2-3 column grids, side-by-side panels |
| Wide | > 1440px | Max-width container (1440px), centered with padding |

### Component Responsive Rules

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Hidden (hamburger) | Collapsible icon rail | Full expanded |
| DataTable | Card view or horizontal scroll | Horizontal scroll | Full table |
| Forms | Single column, full-width inputs | Single column | 2-column for related fields |
| KPI Cards | 1 per row | 2 per row | 4 per row |
| Charts | Full width, stacked | 2 per row | 2-3 per row |
| Detail Pages | Stacked tabs | Side tab navigation | Side tab navigation |
| Modals/Dialogs | Full screen | Centered, max 90% width | Centered, max 600px |
| Action Buttons | Bottom fixed bar | Inline | Inline or top-right |

---

## Filled Example: Transportation Management

### Page Count Summary

| Portal | Pages | Roles |
|--------|-------|-------|
| Auth | 4 | Public |
| Dashboard | 1 | All authenticated |
| Trips | 4 | member+ |
| Drivers | 4 | member+ |
| Vehicles | 4 | member+ |
| Facilities | 4 | member+ |
| Passengers | 4 | member+ |
| Dispatch | 1 | dispatcher+ |
| Billing | 4 | manager+ |
| Reports | 3 | manager+ |
| Settings | 3 | Varies |
| Admin | 2 | admin+ |
| **Total** | **38** | |

---

<!-- IF {{HAS_MOBILE}} == "true" -->

## Mobile Screens

### Mobile Route Structure

<!-- IF {{MOBILE_FRAMEWORK}} == "react-native" -->
```
apps/mobile/app/
├── (auth)/                    → Auth screens (no tab bar)
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (tabs)/                    → Main tab screens
│   ├── _layout.tsx            → Tab bar configuration
│   ├── index.tsx              → Home / Dashboard
│   ├── {domain}.tsx           → Domain list
│   └── settings.tsx           → Settings
├── {domain}/
│   ├── [id].tsx               → Detail screen
│   └── new.tsx                → Create form
└── _layout.tsx                → Root layout (auth guard)
```
<!-- ENDIF -->
<!-- IF {{MOBILE_FRAMEWORK}} == "flutter" -->
```
apps/mobile_flutter/lib/screens/
├── auth/
│   ├── login_screen.dart
│   ├── register_screen.dart
│   └── forgot_password_screen.dart
├── home/
│   └── home_screen.dart
├── {domain}/
│   ├── {domain}_list_screen.dart
│   ├── {domain}_detail_screen.dart
│   └── {domain}_form_screen.dart
└── settings/
    └── settings_screen.dart
```
<!-- ENDIF -->

### Mobile Screen Catalog

| Screen | Platform | Type | Navigation | Auth | Data Queries | States | Offline |
|--------|----------|------|-----------|------|-------------|--------|---------|
| Login | Both | Form | Stack (auth) | Public | None | Form validation | N/A |
| Register | Both | Form | Stack (auth) | Public | None | Form validation | N/A |
| Home / Dashboard | Both | Dashboard | Tab | Protected | `dashboard.getSnapshot` | L/E/Empty/Data | Cached |
| {Domain} List | Both | List | Tab | Protected | `{domain}.list` | L/E/Empty/Data | Cached |
| {Domain} Detail | Both | Detail | Stack (push) | Protected | `{domain}.getById` | L/E/Data | Cached |
| {Domain} Create | Both | Form | Stack (modal) | Protected | None | Form states | Queue offline |
| Settings | Both | Settings | Tab | Protected | `users.getProfile` | L/Data | Cached |
| Notifications | Both | List | Stack | Protected | `notifications.list` | L/E/Empty/Data | Cached |

**Platform column values:** iOS / Android / Both / Web Only

### Web-to-Mobile Screen Mapping

| Web Screen | Mobile Equivalent | Differences |
|-----------|-------------------|-------------|
| `/dashboard` | Home Tab | Simplified KPIs, no wide charts |
| `/{domain}` (data table) | {Domain} List (FlatList) | Card layout instead of table rows |
| `/{domain}/[id]` (detail + tabs) | {Domain} Detail (scrollable sections) | Stacked sections instead of side tabs |
| `/{domain}/new` (multi-column form) | {Domain} Form (single column) | Stepped form if >6 fields |
| `/dispatch` (Kanban board) | Dispatch List | Simplified list view, no drag-drop |
| `/reports` (charts + tables) | Reports (charts only) | Export via share sheet, not download |
| `/admin/*` | Not on mobile | Admin functions are web-only |

### Deep Link Registry

| Route | Deep Link | When Used |
|-------|-----------|-----------|
| Home | `{{PROJECT_SLUG}}://home` | Push notification: general |
| {Domain} Detail | `{{PROJECT_SLUG}}://{domain}/{id}` | Push notification: status change |
| {Domain} Create | `{{PROJECT_SLUG}}://{domain}/new` | Quick action shortcut |
| Settings | `{{PROJECT_SLUG}}://settings` | App settings link |

<!-- ENDIF -->

---

## Checklist

- [ ] Every page from wireframes/VERDICT has a catalog entry
- [ ] Every page has explicit auth requirement
- [ ] Every page lists its data queries
- [ ] Every page has all four states defined (loading/error/empty/data)
- [ ] Every page has a responsive strategy
- [ ] Role restrictions match the auth-roles permission matrix
- [ ] Route structure follows Next.js App Router conventions
- [ ] API routes documented (auth, tRPC, SSE, webhooks)
- [ ] No orphan pages (every page reachable from navigation)
<!-- IF {{HAS_MOBILE}} == "true" -->
- [ ] Every mobile screen has a catalog entry with platform, navigation type, and offline strategy
- [ ] Web-to-mobile screen mapping is complete — every web screen has a mobile equivalent or is marked "Web Only"
- [ ] Deep link registry covers all push notification entry points
- [ ] Mobile screens that differ significantly from web have their own spec in `03-documentation/feature-docs/`
<!-- ENDIF -->
