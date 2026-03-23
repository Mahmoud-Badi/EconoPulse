# Screen Catalog — {{PROJECT_NAME}}

> **Every page in the application, documented before it's built.** Each entry specifies the route, data requirements, components, and responsive behavior. This is the UI developer's reference for every screen.

---

## Screen Count Summary

| Category | Screens | Status |
|----------|---------|--------|
| Auth | {N} | {{STATUS}} |
| Dashboard | {N} | {{STATUS}} |
| {{DOMAIN_1}} | {N} | {{STATUS}} |
| {{DOMAIN_2}} | {N} | {{STATUS}} |
| {{DOMAIN_3}} | {N} | {{STATUS}} |
| Settings | {N} | {{STATUS}} |
| Error pages | {N} | {{STATUS}} |
| **Total** | **{{TOTAL}}** | |

---

## Auth Screens

### Login Page

| Aspect | Value |
|--------|-------|
| Route | `/login` |
| Title | Sign In |
| Role | Public (unauthenticated) |
| Primary Action | Sign in (submit form) |
| tRPC Queries | None (auth handled by auth library) |
| Components | Card, Input (email), Input (password), Button, Link ("Forgot password?") |
| Loading Skeleton | None (static form) |
| Error State | Inline error below form: "Invalid email or password" |
| Empty State | N/A |
| Mobile Layout | Centered card, full-width on < 400px |

### Register Page

| Aspect | Value |
|--------|-------|
| Route | `/register` |
| Title | Create Account |
| Role | Public |
| Primary Action | Create account (submit form) |
| tRPC Queries | None |
| Components | Card, Input (name), Input (email), Input (password), Input (confirm password), Button |
| Loading Skeleton | None |
| Error State | Inline field errors + "Email already registered" |
| Empty State | N/A |
| Mobile Layout | Centered card, full-width on < 400px |

### Forgot Password Page

| Aspect | Value |
|--------|-------|
| Route | `/forgot-password` |
| Title | Forgot Password |
| Role | Public |
| Primary Action | Send reset link |
| tRPC Queries | None |
| Components | Card, Input (email), Button |
| Loading Skeleton | None |
| Error State | "Email not found" (or silent for security) |
| Empty State | N/A |
| Mobile Layout | Centered card |

---

## Dashboard

### Main Dashboard

| Aspect | Value |
|--------|-------|
| Route | `/dashboard` or `/` |
| Title | Dashboard |
| Role | Protected (all authenticated users) |
| Primary Action | None (read-only overview) |
| tRPC Queries | `dashboard.getKPIs`, `dashboard.get{Chart1}Data`, `dashboard.get{Chart2}Data`, `dashboard.getTodaySnapshot`, `dashboard.getRecentActivity` |
| Components | PageHeader, KPICard (x{N}), AreaChart/BarChart, ActivityFeed, DateRangeSelector |
| Loading Skeleton | {N} KPI skeleton cards + chart skeleton rectangle + list skeleton rows |
| Error State | Per-widget error with retry: "Unable to load {widget}. [Retry]" |
| Empty State | "No data yet. Create your first {entity} to see analytics." with CTA |
| Mobile Layout | KPI cards stack vertically (1 column), charts full-width, activity below |

#### KPI Cards

| # | Metric | Icon | Format | Trend |
|---|--------|------|--------|-------|
| 1 | {{KPI_1_NAME}} | {Icon} | {number/money/percentage} | vs last period |
| 2 | {{KPI_2_NAME}} | {Icon} | {format} | vs last period |
| 3 | {{KPI_3_NAME}} | {Icon} | {format} | vs last period |
| 4 | {{KPI_4_NAME}} | {Icon} | {format} | vs last period |

---

## {{DOMAIN_1}} Screens

### {Entity_1} List Page

| Aspect | Value |
|--------|-------|
| Route | `/{entities_1}` |
| Title | {Entity_1 Plural} |
| Role | Protected |
| Primary Action | "New {Entity_1}" button → `/{entities_1}/new` |
| tRPC Queries | `{entity_1}.list` (paginated, filtered) |
| Components | PageHeader, FilterBar (search + status filter + {filter_3}), DataTable, Pagination, EmptyState |
| Loading Skeleton | FilterBar placeholder + table skeleton (6 columns x 10 rows) |
| Error State | "Unable to load {entities}. [Retry]" centered in table area |
| Empty State | Icon + "No {entities} yet" + "Create your first {entity}" button |
| Mobile Layout | Table → card list layout. Each card: name + status badge + key metric |

#### Table Columns

| Column | Type | Width | Sortable | Mobile |
|--------|------|-------|----------|--------|
| Name | text + link | 25% | Yes | Visible |
| {{COLUMN_2}} | text | 20% | Yes | Visible |
| {{COLUMN_3}} | text/badge | 15% | Yes | Hidden |
| Status | status badge | 12% | Yes | Visible |
| {{COLUMN_5}} | date | 15% | Yes | Hidden |
| Actions | dropdown | 8% | No | Visible (icon) |

#### Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | text input | — | "" (empty) |
| Status | select | All, {{STATUS_1}}, {{STATUS_2}}, {{STATUS_3}} | All |
| {{FILTER_3}} | combobox | {{RELATED_ENTITIES}} | All |
| Date range | date picker | Any range | Last 30 days |

---

### {Entity_1} Detail Page

| Aspect | Value |
|--------|-------|
| Route | `/{entities_1}/[id]` |
| Title | {Entity_1} Detail (dynamic: shows entity name) |
| Role | Protected |
| Primary Action | "Edit" button → `/{entities_1}/[id]/edit` |
| Secondary Actions | Status change, Delete, {{CUSTOM_ACTION}} |
| tRPC Queries | `{entity_1}.getById` (with relations) |
| Components | PageHeader (with breadcrumb), InfoCard, {Relation}Card, StatusTimeline, ActionButtons |
| Loading Skeleton | Header skeleton + 2-column grid: left card skeleton + right sidebar skeleton |
| Error State | "Entity not found" with "Go back to list" link |
| Empty State | N/A (if entity exists, it has data) |
| Mobile Layout | Single column, sections stack vertically |

#### Layout

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: {Domain} > {Entities} > {Entity Name}    │
│ Title: {Entity Name}          [Edit] [Actions ▾]     │
├─────────────────────────────┬───────────────────────┤
│ Main Content (70%)           │ Sidebar (30%)         │
│                              │                       │
│ ┌──────────────────────────┐ │ ┌───────────────────┐ │
│ │ {Entity} Information     │ │ │ Quick Info         │ │
│ │ field1: value            │ │ │ Status: [badge]    │ │
│ │ field2: value            │ │ │ Created: date      │ │
│ │ field3: value            │ │ │ Updated: date      │ │
│ └──────────────────────────┘ │ │ {Relation}: link   │ │
│                              │ └───────────────────┘ │
│ ┌──────────────────────────┐ │                       │
│ │ Status Timeline          │ │ ┌───────────────────┐ │
│ │ ● Status changed to X   │ │ │ Actions            │ │
│ │ ● Created by Y          │ │ │ [Change Status]    │ │
│ └──────────────────────────┘ │ │ [Delete]           │ │
│                              │ └───────────────────┘ │
│ ┌──────────────────────────┐ │                       │
│ │ Related {Entities_2}     │ │                       │
│ │ (table or card list)     │ │                       │
│ └──────────────────────────┘ │                       │
└─────────────────────────────┴───────────────────────┘
```

---

### {Entity_1} Create Page

| Aspect | Value |
|--------|-------|
| Route | `/{entities_1}/new` |
| Title | Create {Entity_1} |
| Role | Protected |
| Primary Action | Submit form → create entity → redirect to list |
| tRPC Queries | Related entity lists for FK comboboxes: `{related_entity}.list` |
| tRPC Mutations | `{entity_1}.create` |
| Components | PageHeader (breadcrumb), {Entity_1}Form, Button (submit), Button (cancel) |
| Loading Skeleton | Form skeleton: {N} field placeholders |
| Error State | Form field errors (inline) + toast for API errors |
| Empty State | N/A |
| Mobile Layout | Full-width form, fields stack vertically |

---

### {Entity_1} Edit Page

| Aspect | Value |
|--------|-------|
| Route | `/{entities_1}/[id]/edit` |
| Title | Edit {Entity_1} |
| Role | Protected |
| Primary Action | Submit form → update entity → redirect to detail |
| tRPC Queries | `{entity_1}.getById` (prefill form) + related entity lists |
| tRPC Mutations | `{entity_1}.update` |
| Components | PageHeader (breadcrumb), {Entity_1}Form (edit mode), Button (save), Button (cancel) |
| Loading Skeleton | Form skeleton with field placeholders |
| Error State | "Entity not found" or form errors |
| Empty State | N/A |
| Mobile Layout | Same as create |

---

## {{DOMAIN_2}} Screens

> Repeat the pattern above for each domain. List → Detail → Create → Edit for each entity.

### {Entity_2} List Page

| Aspect | Value |
|--------|-------|
| Route | `/{entities_2}` |
| ... | (Same structure as Entity_1 list) |

---

## Special Screens

### {Kanban/Board} Page (if applicable)

| Aspect | Value |
|--------|-------|
| Route | `/{{ROUTE}}` |
| Title | {{PAGE_TITLE}} |
| Role | Protected ({{SPECIFIC_ROLES}}) |
| Primary Action | Drag-drop to change status |
| tRPC Queries | `{entity}.list` (grouped by status), `{related}.list` (for assignment) |
| Components | BoardColumn (per status), BoardCard, DragDropContext (dnd-kit), FilterBar |
| Loading Skeleton | {N} column skeletons with {M} card skeletons each |
| Error State | "Unable to load board. [Retry]" |
| Empty State | Empty columns with "No items" + CTA |
| Mobile Layout | Horizontal scroll between columns, or tab-based column selection |

---

## Error Pages

### 404 Not Found

| Aspect | Value |
|--------|-------|
| Route | Catch-all `not-found.tsx` |
| Components | Centered layout: large "404" text, "Page not found" message, "Go to Dashboard" button |
| Mobile Layout | Same, responsive text sizes |

### 500 Error

| Aspect | Value |
|--------|-------|
| Route | `error.tsx` (error boundary) |
| Components | Centered layout: "Something went wrong" message, "Try Again" button, "Go to Dashboard" link |
| Mobile Layout | Same |

---

## Settings Screens

### Settings Layout

| Aspect | Value |
|--------|-------|
| Route | `/settings` |
| Layout | Left sidebar with categories + right content area |
| Categories | Profile, Company, {{CATEGORY_3}}, {{CATEGORY_4}}, Danger Zone |
| Mobile Layout | Categories become a top nav or accordion |

### Profile Settings

| Aspect | Value |
|--------|-------|
| Route | `/settings/profile` |
| tRPC Queries | `user.getProfile` |
| tRPC Mutations | `user.updateProfile`, `user.changePassword` |
| Components | Avatar upload, name/email form, password change form |

### Company Settings (Admin)

| Aspect | Value |
|--------|-------|
| Route | `/settings/company` |
| Role | Admin only |
| tRPC Queries | `company.getSettings` |
| tRPC Mutations | `company.updateSettings` |
| Components | Company name, timezone selector, currency selector, logo upload |

---

## Screen Tracking

| # | Screen | Route | Category | Phase | Status |
|---|--------|-------|----------|-------|--------|
| 1 | Login | `/login` | Auth | 0 | {{STATUS}} |
| 2 | Register | `/register` | Auth | 0 | {{STATUS}} |
| 3 | Forgot Password | `/forgot-password` | Auth | 0 | {{STATUS}} |
| 4 | Dashboard | `/dashboard` | Dashboard | {N} | {{STATUS}} |
| 5 | {Entity_1} List | `/{entities_1}` | {Domain_1} | {N} | {{STATUS}} |
| 6 | {Entity_1} Detail | `/{entities_1}/[id]` | {Domain_1} | {N} | {{STATUS}} |
| 7 | {Entity_1} Create | `/{entities_1}/new` | {Domain_1} | {N} | {{STATUS}} |
| 8 | {Entity_1} Edit | `/{entities_1}/[id]/edit` | {Domain_1} | {N} | {{STATUS}} |
| 9 | {Entity_2} List | `/{entities_2}` | {Domain_2} | {N} | {{STATUS}} |
| 10 | {Entity_2} Detail | `/{entities_2}/[id]` | {Domain_2} | {N} | {{STATUS}} |
| 11 | {Entity_2} Create | `/{entities_2}/new` | {Domain_2} | {N} | {{STATUS}} |
| 12 | {Entity_2} Edit | `/{entities_2}/[id]/edit` | {Domain_2} | {N} | {{STATUS}} |
| ... | ... | ... | ... | ... | ... |
| {N} | Settings - Profile | `/settings/profile` | Settings | {N} | {{STATUS}} |
| {N+1} | Settings - Company | `/settings/company` | Settings | {N} | {{STATUS}} |
| {N+2} | 404 Page | — | Error | 0 | {{STATUS}} |
| {N+3} | 500 Page | — | Error | 0 | {{STATUS}} |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| Mobile | < 640px | Single column, stacked cards, full-width forms |
| Tablet | 640-1024px | Sidebar collapsible, 2-column where sensible |
| Desktop | 1024-1280px | Full sidebar, 2-column detail pages |
| Wide | > 1280px | Content max-width 1280px, centered |

### Per-Screen Mobile Behavior

| Screen Type | Desktop | Mobile |
|------------|---------|--------|
| List (table) | DataTable with all columns | Card list with key fields only |
| Detail | 2-column (content + sidebar) | Single column, sidebar sections below |
| Form | Max 600px width | Full-width, 100% padding |
| Dashboard | Grid of cards/charts | Single column stack |
| Kanban | Horizontal columns | Tab per column or horizontal scroll |
| Settings | Sidebar + content | Accordion or tab navigation |
