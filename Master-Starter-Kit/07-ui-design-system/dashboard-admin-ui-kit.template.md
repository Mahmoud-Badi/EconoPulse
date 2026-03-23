# Dashboard & Admin UI Kit

> **Purpose:** Base component catalog for dashboard-style applications (admin panels, dispatch systems, CRMs, back-office tools).
> **Stack:** {{FRONTEND_FRAMEWORK}} + {{CSS_FRAMEWORK}} + {{DESIGN_SYSTEM_LIBRARY}}
> **Extracted from:** Battle-tested patterns across multiple production admin/dashboard applications.

---

## Template Variables

- `{{PROJECT_NAME}}` -- Project name
- `{{COMPONENT_PREFIX}}` -- Domain prefix for components (e.g., `tms`, `crm`, `erp`)
- `{{FRONTEND_FRAMEWORK}}` -- `react` | `next` | `vue` | `svelte`
- `{{CSS_FRAMEWORK}}` -- `tailwind` | `css-modules` | `styled-components`
- `{{DESIGN_SYSTEM_LIBRARY}}` -- `shadcn/ui` | `mantine` | `chakra` | `custom`
- `{{ICON_LIBRARY}}` -- `lucide-react` | `heroicons` | `phosphor`
- `{{PRIMARY_FONT}}` -- Primary font family (e.g., `Inter`)
- `{{MONO_FONT}}` -- Monospace font (e.g., `JetBrains Mono`)

---

## 1. Design Principles for Dashboard/Admin UIs

These principles are non-negotiable for any operational/admin interface:

1. **Clarity Over Cleverness** -- Staff use this under pressure (phone calls, deadlines, emergencies). Every action must be obvious. No hidden features or mystery icons.
2. **Speed of Use** -- Minimize clicks for common actions. Keyboard shortcuts for power users. Primary flows completable in under 30 seconds.
3. **Error Prevention** -- Validate before problems occur. Clear conflict warnings. Confirmation for destructive actions only (don't over-confirm).
4. **Information Density** -- Dashboards should show maximum useful data without clutter. Use progressive disclosure: summary first, details on demand.
5. **Consistent Patterns** -- Same component = same behavior everywhere. Predictable layouts. Unified visual language across all modules.

---

## 2. Color System

### 2.1 Brand Colors

```css
/* Primary -- Main actions, active states, branding */
--primary-50: {{PRIMARY_50}};
--primary-100: {{PRIMARY_100}};
--primary-200: {{PRIMARY_200}};
--primary-300: {{PRIMARY_300}};
--primary-400: {{PRIMARY_400}};
--primary-500: {{PRIMARY_500}};   /* Default */
--primary-600: {{PRIMARY_600}};   /* Hover */
--primary-700: {{PRIMARY_700}};   /* Active */
--primary-800: {{PRIMARY_800}};
--primary-900: {{PRIMARY_900}};

/* Secondary -- Secondary actions, muted UI, backgrounds */
--secondary-50: {{SECONDARY_50}};
--secondary-100: {{SECONDARY_100}};
--secondary-200: {{SECONDARY_200}};
--secondary-300: {{SECONDARY_300}};
--secondary-400: {{SECONDARY_400}};
--secondary-500: {{SECONDARY_500}};
--secondary-600: {{SECONDARY_600}};
--secondary-700: {{SECONDARY_700}};
--secondary-800: {{SECONDARY_800}};
--secondary-900: {{SECONDARY_900}};
```

### 2.2 Semantic Colors

```css
/* Success -- Completed, confirmed, online, approved */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;
--success-700: #15803d;

/* Warning -- Attention needed, pending, expiring */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;
--warning-700: #b45309;

/* Error -- Errors, cancelled, critical, destructive */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;
--error-700: #b91c1c;

/* Info -- Informational, neutral highlights */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
--info-700: #1d4ed8;
```

### 2.3 Entity Status Colors

<!-- FILL IN: Replace with your domain-specific entity statuses -->

```css
/* {{ENTITY_NAME}} Status Colors */
--status-pending: #f59e0b;      /* Amber -- waiting for action */
--status-confirmed: #3b82f6;    /* Blue -- confirmed/accepted */
--status-assigned: #8b5cf6;     /* Purple -- assigned to someone */
--status-active: #06b6d4;       /* Cyan -- actively in progress */
--status-in-progress: #22c55e;  /* Green -- work underway */
--status-completed: #16a34a;    /* Dark Green -- done */
--status-cancelled: #ef4444;    /* Red -- cancelled */
--status-on-hold: #6b7280;      /* Gray -- paused/on hold */
```

### 2.4 Surfaces & Backgrounds

```css
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-tertiary: #f1f5f9;
--bg-inverse: #0f172a;

--surface-card: #ffffff;
--surface-elevated: #ffffff;
--surface-overlay: rgba(0, 0, 0, 0.5);

--border-default: #e2e8f0;
--border-muted: #f1f5f9;
--border-strong: #cbd5e1;
--border-focus: var(--primary-500);
```

---

## 3. Typography

```css
--font-sans: '{{PRIMARY_FONT}}', system-ui, -apple-system, sans-serif;
--font-mono: '{{MONO_FONT}}', 'Fira Code', monospace;

--text-xs: 0.75rem;     /* 12px -- Labels, captions, timestamps */
--text-sm: 0.875rem;    /* 14px -- Secondary text, table cells */
--text-base: 1rem;      /* 16px -- Body text */
--text-lg: 1.125rem;    /* 18px -- Large body, card titles */
--text-xl: 1.25rem;     /* 20px -- Subheadings */
--text-2xl: 1.5rem;     /* 24px -- Section headers */
--text-3xl: 1.875rem;   /* 30px -- Page titles */
```

### Text Style Map

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| `heading-1` | 2xl-3xl | bold | Page titles |
| `heading-2` | xl-2xl | semibold | Section headers |
| `heading-3` | lg | semibold | Card titles |
| `body` | base | normal | Default body text |
| `body-sm` | sm | normal | Secondary text, table cells |
| `label` | sm | medium | Form labels, column headers |
| `caption` | xs | normal | Help text, timestamps, metadata |
| `code` | sm | mono | IDs, codes, technical values |

---

## 4. Spacing, Radius & Shadows

### Spacing (4px base unit)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.125rem;    /* 2px -- badges, inline elements */
--radius-default: 0.375rem; /* 6px -- buttons, inputs */
--radius-md: 0.5rem;      /* 8px -- cards, panels */
--radius-lg: 0.75rem;     /* 12px -- dialogs, large cards */
--radius-xl: 1rem;        /* 16px -- hero sections */
--radius-full: 9999px;    /* Pill shapes, avatars */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 5. Page Layout Templates

Every admin/dashboard application uses these 4 fundamental layouts. All pages are one of these.

### 5.1 Dashboard Layout (Home/Overview)

```
+---------------------------------------------+
| TopBar                                      |
+----------+----------------------------------+
|          |                                  |
| Sidebar  |  Stat Cards Row                  |
|          |  [Stat] [Stat] [Stat] [Stat]     |
|          |                                  |
|          |  +------------+ +----------+     |
|          |  | Chart/     | | Activity |     |
|          |  | Main Panel | | Feed     |     |
|          |  +------------+ +----------+     |
|          |                                  |
+----------+----------------------------------+
```

**Components used:** Sidebar, TopBar, StatCard, Chart, ActivityFeed

### 5.2 List Page Layout (Browse/Search)

```
+---------------------------------------------+
| Breadcrumbs                                 |
+--------------------------------------------|
| Page Title                     [+ Create]   |
+---------------------------------------------+
| [Search...          ] [Filters] [Export]    |
+---------------------------------------------+
| +=========================================+ |
| | Table / List                            | |
| |  Col1  | Col2  | Col3  | Status | Act  | |
| |--------|-------|-------|--------|------| |
| |  data  | data  | data  | Badge  | ...  | |
| +=========================================+ |
+---------------------------------------------+
| Pagination                   Showing X of Y |
+---------------------------------------------+
```

**Components used:** Breadcrumbs, DataTable, SearchInput, FilterPanel, Pagination, Badge, ActionMenu

### 5.3 Detail Page Layout (View/Inspect)

```
+---------------------------------------------+
| Breadcrumbs                                 |
+---------------------------------------------+
| <- Back    Page Title    [Edit] [Delete]    |
+--------------------------+------------------+
|                          |                  |
|  Main Info               |  Sidebar         |
|  (Description Cards)     |  (Status Badge,  |
|                          |   Timeline,      |
|  Section 1               |   Quick Actions, |
|  Section 2               |   Related Items) |
|                          |                  |
+--------------------------+------------------+
```

**Components used:** Breadcrumbs, Card, Badge, Timeline, DescriptionList, ActionMenu

### 5.4 Form Page Layout (Create/Edit)

```
+---------------------------------------------+
| Breadcrumbs                                 |
+---------------------------------------------+
| Page Title                                  |
+---------------------------------------------+
|                                             |
|  +---------------------------------------+  |
|  | Section 1: Basic Info                 |  |
|  | [Input]  [Input]                      |  |
|  | [Select] [DatePicker]                 |  |
|  +---------------------------------------+  |
|                                             |
|  +---------------------------------------+  |
|  | Section 2: Details                    |  |
|  | [Textarea]                            |  |
|  | [MultiSelect]                         |  |
|  +---------------------------------------+  |
|                                             |
+---------------------------------------------+
|                    [Cancel] [Save]          |
+---------------------------------------------+
```

**Components used:** Card (as sections), Input, Select, DatePicker, Textarea, Button, Stepper (for multi-step forms)

---

## 6. Core Components (Tier 1 -- Foundation)

These are the base primitives every admin/dashboard app needs. Use your `{{DESIGN_SYSTEM_LIBRARY}}` as the starting point and customize per your brand tokens.

### 6.1 Button

| Variant | Use Case |
|---------|----------|
| `primary` | Main actions (Save, Create, Confirm) |
| `secondary` | Secondary actions (Cancel, Back) |
| `outline` | Tertiary actions, less emphasis |
| `ghost` | Minimal style, icon-only, navigation |
| `destructive` | Dangerous actions (Delete, Remove) |
| `link` | Text-only, inline actions |

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 32px | Table row actions, compact areas |
| `default` | 40px | Standard buttons |
| `lg` | 48px | Primary page actions, CTAs |

**States:** Default, Hover, Active, Disabled, Loading (spinner + text)

### 6.2 Card

| Variant | Use Case |
|---------|----------|
| `default` | Standard card with border |
| `elevated` | Card with shadow (stat cards, featured items) |
| `interactive` | Hover state, clickable (list items) |
| `selected` | Currently selected item |

**Anatomy:** CardHeader (Title + Description) -> CardContent -> CardFooter (Actions)

### 6.3 Badge / Status Indicator

Map directly to your entity status colors (Section 2.3):

```tsx
<Badge variant="pending">Pending</Badge>
<Badge variant="confirmed">Confirmed</Badge>
<Badge variant="active">In Progress</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="cancelled">Cancelled</Badge>
```

Also provide role badges:
```tsx
<Badge variant="admin">Admin</Badge>
<Badge variant="manager">Manager</Badge>
<Badge variant="user">User</Badge>
```

### 6.4 Avatar

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 24px | Compact lists, inline mentions |
| `sm` | 32px | Table cells, sidebar |
| `md` | 40px | Cards, detail headers |
| `lg` | 48px | Profile sections |
| `xl` | 64px | Profile pages |

Supports: image, initials fallback, status indicator dot (online/offline/busy)

### 6.5 Icon System

**Library:** {{ICON_LIBRARY}} at 20px default

**Common dashboard icons:**

| Icon | Use Case |
|------|----------|
| `LayoutDashboard` | Dashboard/home |
| `Users` | People/contacts/teams |
| `Settings` | Settings/config |
| `Search` | Search |
| `Filter` | Filters |
| `Plus` | Create/add |
| `ChevronRight` | Navigation, expand |
| `MoreHorizontal` | Action menu trigger |
| `Calendar` | Date/schedule |
| `Clock` | Time, history |
| `Bell` | Notifications |
| `Download` | Export/download |
| `Upload` | Import/upload |
| `Trash2` | Delete |
| `Pencil` | Edit |
| `Eye` | View details |
| `CheckCircle` | Success |
| `AlertCircle` | Warning |
| `XCircle` | Error |
| `ArrowUpDown` | Sort |

---

## 7. Form Components (Tier 1 -- Foundation)

### Standard Form Components

| Component | Use Case |
|-----------|----------|
| `Input` | Text, email, password, number |
| `Textarea` | Multi-line text, notes, descriptions |
| `Select` | Single option from a list |
| `SearchableSelect` | Select with search/filter for long lists |
| `MultiSelect` | Multiple options with chip display |
| `Checkbox` | Boolean toggle with label |
| `RadioGroup` | Single choice from small set |
| `Switch` | On/off toggle (settings, features) |
| `DatePicker` | Single date selection |
| `DateRangePicker` | Date range with presets (Today, This Week, This Month, Custom) |
| `TimePicker` | Time selection with interval steps |
| `PhoneInput` | Phone number with country code |
| `FileUpload` | Drag-and-drop file upload area |

### Form Patterns

**Every form field follows this anatomy:**
```tsx
<div className="space-y-2">
  <Label htmlFor="fieldId">Field Label</Label>
  <Input id="fieldId" placeholder="Placeholder text" error={errors.field} />
  <FormMessage>{errors.field}</FormMessage>
</div>
```

**Form states:** Default -> Focus -> Filled -> Error -> Disabled

---

## 8. Data Display Components (Tier 1 -- Foundation)

### 8.1 DataTable

The most important component in any admin UI. Must support:

- **Column sorting** (click header to sort)
- **Column visibility toggle** (show/hide columns)
- **Row selection** (checkbox column for bulk actions)
- **Pagination** (page size selector + page navigation)
- **Row actions** (three-dot menu per row)
- **Empty state** (when no data matches filters)
- **Loading state** (skeleton rows)
- **Responsive behavior:** Full table on desktop, card view on mobile

### 8.2 StatCard

```tsx
<StatCard
  title="Today's Orders"
  value={142}
  change={+12}
  changeLabel="vs yesterday"
  icon={<ShoppingCart />}
  trend="up"
/>
```

**Variants:** Default (number), Currency ($1,234.56), Percentage (85.2%), Duration (2h 15m)

### 8.3 Timeline

For activity feeds, audit logs, status history:

```tsx
<Timeline>
  <TimelineItem status="completed" time="9:00 AM">Order created</TimelineItem>
  <TimelineItem status="completed" time="9:15 AM">Payment confirmed</TimelineItem>
  <TimelineItem status="active" time="9:45 AM">Processing</TimelineItem>
  <TimelineItem status="pending" time="Est. 10:30 AM">Shipping</TimelineItem>
</Timeline>
```

### 8.4 DescriptionList

For detail pages showing key-value information:

```tsx
<DescriptionList>
  <DescriptionItem term="Customer" detail="John Smith" />
  <DescriptionItem term="Email" detail="john@example.com" />
  <DescriptionItem term="Status" detail={<Badge variant="active">Active</Badge>} />
</DescriptionList>
```

### 8.5 EmptyState

```tsx
<EmptyState
  icon={<Inbox />}
  title="No results found"
  description="Try adjusting your search or filters."
  action={<Button>Clear Filters</Button>}
/>
```

### 8.6 Calendar

For scheduling views:

```tsx
<Calendar
  mode="day" /* day | week | month */
  events={events}
  onEventClick={handleClick}
  onSlotClick={handleCreate}
/>
```

---

## 9. Navigation Components (Tier 1 -- Foundation)

### 9.1 Sidebar

```tsx
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarNav>
    <SidebarNavItem href="/dashboard" icon={<LayoutDashboard />}>Dashboard</SidebarNavItem>
    <SidebarNavItem href="/{{ENTITY_PLURAL}}" icon={<List />}>{{ENTITY_NAME_PLURAL}}</SidebarNavItem>
    <SidebarNavItem href="/users" icon={<Users />}>Users</SidebarNavItem>
    <SidebarNavItem href="/settings" icon={<Settings />}>Settings</SidebarNavItem>
  </SidebarNav>
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
</Sidebar>
```

**Responsive:** Expanded on desktop, collapsed (icons only) on tablet, hidden (hamburger menu) on mobile.

### 9.2 TopBar

```tsx
<TopBar>
  <TopBarTitle>{{PAGE_TITLE}}</TopBarTitle>
  <TopBarActions>
    <SearchCommand /> {/* Cmd+K global search */}
    <NotificationBell count={3} />
    <UserDropdown />
  </TopBarActions>
</TopBar>
```

### 9.3 Breadcrumbs

```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/{{ENTITY_PLURAL}}">{{ENTITY_NAME_PLURAL}}</BreadcrumbItem>
  <BreadcrumbItem current>{{ENTITY_NAME}} #{{ID}}</BreadcrumbItem>
</Breadcrumbs>
```

### 9.4 Tabs

```tsx
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="details">{/* ... */}</TabsContent>
</Tabs>
```

### 9.5 Pagination

```tsx
<Pagination
  currentPage={1}
  totalPages={10}
  pageSize={25}
  totalItems={247}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

### 9.6 Command Palette (Cmd+K)

Global search + quick actions. Every admin app benefits from this:

```tsx
<CommandPalette
  onSearch={handleSearch}
  recentItems={recentItems}
  shortcuts={[
    { label: "Create {{ENTITY_NAME}}", shortcut: "C", action: () => {} },
    { label: "Go to Settings", shortcut: "S", action: () => {} },
  ]}
/>
```

---

## 10. Feedback Components (Tier 1 -- Foundation)

### 10.1 Toast / Notification

```tsx
toast.success("{{ENTITY_NAME}} created successfully!");
toast.error("Failed to save. Please try again.");
toast.warning("Unsaved changes will be lost.");
toast.info("New update available.");
```

### 10.2 Alert Banner

```tsx
<Alert variant="warning">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Conflict Detected</AlertTitle>
  <AlertDescription>This resource is already assigned elsewhere.</AlertDescription>
</Alert>
```

### 10.3 Dialog / Modal

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Assign</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assign {{ENTITY_NAME}}</DialogTitle>
      <DialogDescription>Select a user to assign this to.</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 10.4 Sheet / Drawer

For filter panels, detail sidebars, forms that don't warrant a full page:

```tsx
<Sheet>
  <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader><SheetTitle>Filter {{ENTITY_NAME_PLURAL}}</SheetTitle></SheetHeader>
    {/* Filter form */}
  </SheetContent>
</Sheet>
```

### 10.5 Skeleton Loader

```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-32" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-24 w-full" />
  </CardContent>
</Card>
```

### 10.6 Confirmation Dialog

For destructive actions:

```tsx
<ConfirmationDialog
  title="Delete {{ENTITY_NAME}}?"
  description="This action cannot be undone."
  confirmLabel="Yes, Delete"
  variant="destructive"
  onConfirm={handleDelete}
/>
```

### 10.7 Progress & Spinner

```tsx
<Progress value={65} label="Import progress" />
<Spinner size="sm" /> /* 16px */
<Spinner size="md" /> /* 24px */
```

---

## 11. Dashboard-Specific Components (Tier 2 -- Shared)

These components are common across almost all admin/dashboard applications.

### 11.1 FilterPanel

Collapsible filter sidebar used on every list page:

```tsx
<FilterPanel open={isOpen} onApply={handleApply} onReset={handleReset}>
  <FilterSection title="Status">
    <CheckboxGroup options={statusOptions} />
  </FilterSection>
  <FilterSection title="Date Range">
    <DateRangePicker presets={["Today", "This Week", "This Month"]} />
  </FilterSection>
  <FilterSection title="Assigned To">
    <SearchableSelect options={users} />
  </FilterSection>
</FilterPanel>
```

### 11.2 ActionMenu (Three-dot)

Row-level action dropdown:

```tsx
<ActionMenu
  items={[
    { label: "View Details", icon: Eye, onClick: () => {} },
    { label: "Edit", icon: Pencil, onClick: () => {} },
    { type: "separator" },
    { label: "Delete", icon: Trash2, onClick: () => {}, variant: "destructive" },
  ]}
/>
```

### 11.3 SortDropdown

```tsx
<SortDropdown
  options={[
    { value: "date_desc", label: "Newest First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "name_asc", label: "Name A-Z" },
    { value: "status", label: "Status" },
  ]}
  value={sortOption}
  onChange={setSortOption}
/>
```

### 11.4 Stepper (Multi-step)

For multi-step forms and wizards:

```tsx
<Stepper
  steps={[
    { label: "Basic Info", completed: true },
    { label: "Details", current: true },
    { label: "Review", completed: false },
  ]}
  orientation="horizontal"
/>
```

### 11.5 NotificationItem

```tsx
<NotificationItem
  title="New Assignment"
  message="Order #1234 has been assigned to you"
  timestamp="5 min ago"
  read={false}
  actionUrl="/orders/1234"
/>
```

### 11.6 ActivityFeed

```tsx
<ActivityFeed>
  <ActivityItem
    user={{ name: "Jane D.", avatar: "/jane.jpg" }}
    action="created"
    target="Order #1234"
    timestamp="2 hours ago"
  />
  <ActivityItem
    user={{ name: "System" }}
    action="auto-assigned"
    target="Driver Mike J."
    timestamp="1 hour ago"
  />
</ActivityFeed>
```

### 11.7 KPIRow

Horizontal row of key metrics, typically at top of dashboard:

```tsx
<KPIRow>
  <StatCard title="Total" value={1247} icon={<Package />} />
  <StatCard title="Active" value={89} icon={<Zap />} trend="up" change={+5} />
  <StatCard title="Completed" value={1102} icon={<CheckCircle />} />
  <StatCard title="Revenue" value="$45,230" icon={<DollarSign />} trend="up" change={+12.5} />
</KPIRow>
```

---

## 12. Admin-Specific Components (Tier 2 -- Shared)

Components specifically for admin/settings areas.

### 12.1 SettingsLayout

Two-column settings page with navigation:

```tsx
<SettingsLayout>
  <SettingsNav>
    <SettingsNavItem href="/settings/general" icon={<Settings />}>General</SettingsNavItem>
    <SettingsNavItem href="/settings/team" icon={<Users />}>Team</SettingsNavItem>
    <SettingsNavItem href="/settings/billing" icon={<CreditCard />}>Billing</SettingsNavItem>
    <SettingsNavItem href="/settings/integrations" icon={<Plug />}>Integrations</SettingsNavItem>
  </SettingsNav>
  <SettingsContent>
    {/* Settings form */}
  </SettingsContent>
</SettingsLayout>
```

### 12.2 UserManagement Table

```tsx
<UserTable
  users={users}
  columns={["Name", "Email", "Role", "Status", "Last Active", "Actions"]}
  onInvite={() => {}}
  onEdit={(user) => {}}
  onDeactivate={(user) => {}}
  roles={["Admin", "Manager", "User", "Viewer"]}
/>
```

### 12.3 AuditLogTable

```tsx
<AuditLogTable
  entries={[
    { user: "Jane D.", action: "Updated", entity: "Order #1234", field: "status", oldValue: "pending", newValue: "confirmed", timestamp: "2026-01-15 10:30" },
  ]}
  filters={["user", "action", "entity", "dateRange"]}
/>
```

### 12.4 RolePermissionMatrix

```tsx
<RolePermissionMatrix
  roles={["Admin", "Manager", "User"]}
  permissions={[
    { group: "Orders", items: ["View", "Create", "Edit", "Delete"] },
    { group: "Users", items: ["View", "Invite", "Edit Roles", "Deactivate"] },
    { group: "Settings", items: ["View", "Modify"] },
  ]}
  values={permissionMatrix}
  onChange={setPermissionMatrix}
/>
```

### 12.5 IntegrationCard

```tsx
<IntegrationCard
  integration={{
    name: "Stripe",
    description: "Payment processing",
    icon: "/stripe-logo.svg",
    connected: true,
    lastSync: "5 minutes ago",
  }}
  onConnect={() => {}}
  onDisconnect={() => {}}
  onSync={() => {}}
/>
```

### 12.6 SystemHealthCard

```tsx
<SystemHealthCard
  services={[
    { name: "API", status: "healthy", latency: "45ms" },
    { name: "Database", status: "healthy", latency: "12ms" },
    { name: "Queue", status: "degraded", latency: "250ms" },
  ]}
/>
```

---

## 13. Domain Components (Tier 3 -- Feature-Specific)

<!-- FILL IN: These are specific to your project domain. Use the patterns below as starting points. -->

### 13.1 Entity Card Pattern

Every domain entity gets a summary card:

```tsx
<{{ENTITY_NAME}}Card
  {{ENTITY_SLUG}}={{
    id: "uuid",
    {{ENTITY_PRIMARY_FIELD}}: "value",
    status: "active",
    /* ... domain fields */
  }}
  onView={() => {}}
  onEdit={() => {}}
/>
```

### 13.2 Entity Status Badge Pattern

```tsx
<{{ENTITY_NAME}}StatusBadge status={entity.status} />
```

Maps to Section 2.3 status colors.

### 13.3 Entity Detail Pattern

Detail view sidebar with quick-reference info:

```tsx
<{{ENTITY_NAME}}DetailSidebar>
  <StatusBadge status={entity.status} />
  <QuickActions actions={[...]} />
  <Timeline events={entity.history} />
  <RelatedItems items={entity.related} />
</{{ENTITY_NAME}}DetailSidebar>
```

### 13.4 Quick Action Buttons Pattern

Context-sensitive action buttons that change based on entity state:

```tsx
<QuickActions entity={entity}>
  {entity.status === "pending" && <Button>Approve</Button>}
  {entity.status === "active" && <Button>Complete</Button>}
  {entity.status !== "cancelled" && <Button variant="destructive">Cancel</Button>}
</QuickActions>
```

---

## 14. Action Components (Tier 2 -- Shared)

Reusable action patterns:

| Component | Use Case |
|-----------|----------|
| `CopyButton` | Copy ID, code, or text to clipboard |
| `ExportButton` | Export data as CSV/PDF/Excel |
| `BulkActionBar` | Appears when rows are selected (Delete Selected, Assign Selected, Export Selected) |
| `PhoneCallButton` | Click-to-call (tel: link) |
| `EmailButton` | Click-to-email (mailto: link) |
| `NavigationButton` | Open in Google Maps/Apple Maps |

### Bulk Action Bar

Appears at the top of DataTable when rows are selected:

```tsx
<BulkActionBar selectedCount={5}>
  <Button variant="outline" size="sm">Assign All</Button>
  <Button variant="outline" size="sm">Export Selected</Button>
  <Button variant="destructive" size="sm">Delete Selected</Button>
</BulkActionBar>
```

---

## 15. Responsive Breakpoints

```css
sm: 640px   /* Large phones, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Layout Changes by Breakpoint

| Component | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|-----------|-----------------|---------------------|-------------------|
| Sidebar | Hidden (hamburger) | Collapsed (icons) | Expanded |
| DataTable | Card view | Scrollable table | Full table |
| Forms | Single column | Two column | Two column |
| StatCards | Stack vertically | 2x2 grid | 4 in row |
| Modals | Full screen | Centered | Centered |
| Detail Page | Stacked (info then sidebar) | Side by side | Side by side |

---

## 16. Accessibility Requirements

### Minimum Requirements (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | 4.5:1 for normal text, 3:1 for large text |
| Focus Visible | 2px solid ring on all interactive elements |
| Keyboard Navigation | All actions accessible via keyboard |
| Screen Reader | ARIA labels on all interactive elements |
| Touch Targets | Minimum 44x44px on mobile |
| Error Messages | Associated with inputs via `aria-describedby` |
| Loading States | `aria-busy` and `aria-live` for dynamic content |
| Skip Links | Skip to main content link |
| Color Not Alone | Never convey info through color alone -- pair with text/icon |

---

## 17. Dark Mode

<!-- IF dark mode is planned -->

All tokens must have light/dark variants:

```css
:root {
  --bg-primary: #ffffff;
  --surface-card: #ffffff;
  --text-primary: #0f172a;
  --border-default: #e2e8f0;
}

.dark {
  --bg-primary: #0f172a;
  --surface-card: #1e293b;
  --text-primary: #f8fafc;
  --border-default: #334155;
}
```

**Dark mode rules:**
- Replace shadows with subtle borders (shadows invisible on dark backgrounds)
- Reduce color saturation slightly for comfort
- Ensure all semantic colors maintain contrast ratios

<!-- ENDIF -->

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Core Components (Tier 1) | 5 (Button, Card, Badge, Avatar, Icon) |
| Form Components (Tier 1) | 13 |
| Data Display (Tier 1) | 6 (DataTable, StatCard, Timeline, DescriptionList, EmptyState, Calendar) |
| Navigation (Tier 1) | 6 (Sidebar, TopBar, Breadcrumbs, Tabs, Pagination, CommandPalette) |
| Feedback (Tier 1) | 7 (Toast, Alert, Dialog, Sheet, Skeleton, Confirmation, Progress) |
| Dashboard-Specific (Tier 2) | 7 (FilterPanel, ActionMenu, SortDropdown, Stepper, NotificationItem, ActivityFeed, KPIRow) |
| Admin-Specific (Tier 2) | 6 (SettingsLayout, UserTable, AuditLog, RoleMatrix, IntegrationCard, SystemHealth) |
| Action Components (Tier 2) | 6 (CopyButton, ExportButton, BulkActionBar, PhoneCall, Email, Navigation) |
| Domain Components (Tier 3) | Project-specific -- typically 15-50+ |
| **Base Kit Total** | **~56 + domain components** |

---

## How to Use This Kit

1. **Fill in template variables** at the top (project name, stack, fonts)
2. **Define your entity status colors** in Section 2.3
3. **Customize Tier 1** components to match your brand tokens (see `design-token-guide.md`)
4. **Build Tier 2** components -- these are mostly the same across projects
5. **Design Tier 3** domain components using the patterns in Section 13
6. **Verify against** `anti-slop-rulebook.md` before shipping any page
7. **Test responsive** behavior at all breakpoints (Section 15)

---

*This UI kit is the single source of truth for all dashboard/admin UI decisions in {{PROJECT_NAME}}.*
