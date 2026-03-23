# Component Library: {{PROJECT_NAME}}

## Overview

**UI Framework:** {Tailwind + shadcn/ui / CSS Modules / etc.}
**Component Count:** {{TOTAL}} ({{FOUNDATION}} foundation + {{SHARED}} domain-shared + {{FEATURE}} feature-specific)
**Design System:** {DESIGN_SYSTEM_NAME — e.g., "Bold Brand" / "Minimal Light" / custom}

Components are organized into three tiers:

1. **Foundation** — Base UI primitives from shadcn/ui. Always customize with project design tokens.
2. **Domain-Shared** — Components used across multiple domains. Built once in `packages/ui`.
3. **Feature-Specific** — Components specific to a single domain. Live in `apps/web/src/components/{domain}/`.

---

## Tier 1: Foundation Components (shadcn/ui)

These are shadcn/ui components installed into `packages/ui/src/components/ui/`. They are copied (not npm-installed), so you own and customize the code.

**Location:** `packages/ui/src/components/ui/`

| Component | File | Variants | States | Customization Notes |
|-----------|------|----------|--------|-------------------|
| Button | `button.tsx` | default, destructive, outline, ghost, link, secondary | default, hover, active, disabled, loading | Add loading spinner variant. Map to brand colors. |
| Input | `input.tsx` | default, error | default, focus, error, disabled | Add error ring color. Match border radius to design system. |
| Textarea | `textarea.tsx` | default, error | default, focus, error, disabled | Same error styling as Input. |
| Select | `select.tsx` | default | default, open, disabled | Style dropdown to match card elevation. |
| Checkbox | `checkbox.tsx` | default | checked, unchecked, indeterminate, disabled | Brand color for checked state. |
| Switch | `switch.tsx` | default | on, off, disabled | Brand color for on state. |
| Card | `card.tsx` | default, outlined, elevated | default, hover (if clickable) | Set shadow, border-radius, padding to design tokens. |
| Badge | `badge.tsx` | default, secondary, destructive, outline | — | Add custom variants for status colors. |
| Dialog | `dialog.tsx` | default | open, closed | Overlay opacity, animation timing. |
| Sheet | `sheet.tsx` | side: left, right, top, bottom | open, closed | Mobile navigation, filter panels. |
| Table | `table.tsx` | default | — | Header styling, row hover, stripe pattern. |
| Tabs | `tabs.tsx` | default, underline | active, inactive | Active tab indicator color. |
| Tooltip | `tooltip.tsx` | default | visible, hidden | Delay, offset, arrow styling. |
| Dropdown Menu | `dropdown-menu.tsx` | default | open, closed | Item hover color, separator styling. |
| Separator | `separator.tsx` | horizontal, vertical | — | Color from design tokens. |
| Skeleton | `skeleton.tsx` | default | animating | Pulse animation color. |
| Avatar | `avatar.tsx` | default | image, fallback (initials) | Size variants (sm, md, lg). |
| Alert | `alert.tsx` | default, destructive, success, warning | — | Add success and warning variants. |
| Command | `command.tsx` | default | open, closed | For command palette / search. |
| Popover | `popover.tsx` | default | open, closed | Dropdown positioning. |
| Calendar | `calendar.tsx` | default | — | Date picker support. |
| Toast | `sonner.tsx` | success, error, info, warning | visible, dismissing | Position, duration, action buttons. |
| Form | `form.tsx` | — | — | React Hook Form integration layer. |
| Label | `label.tsx` | default, error | — | Error state with red text. |
| ScrollArea | `scroll-area.tsx` | default | — | Custom scrollbar styling. |

### Customization Workflow

1. Install component: `npx shadcn@latest add button` (into `packages/ui`)
2. Customize colors: Update CSS variables in `apps/web/src/styles/globals.css`
3. Add variants: Extend the `cva` variants in the component file
4. Export: Add to `packages/ui/src/index.ts`

---

## Tier 2: Domain-Shared Components

These components are used across multiple domains and live in `packages/ui/src/components/shared/`.

**Location:** `packages/ui/src/components/shared/`

| Component | File | Props | Description | Used By |
|-----------|------|-------|-------------|---------|
| PageHeader | `page-header.tsx` | `title`, `description?`, `actions?` (ReactNode) | Page title bar with optional action buttons | Every list and detail page |
| DataTable | `data-table.tsx` | `columns`, `data`, `pagination`, `sorting`, `filters`, `onRowClick?` | Reusable sortable/filterable/paginated table | Every list page |
| StatusBadge | `status-badge.tsx` | `status`, `variant` (maps status to color) | Colored badge that maps status enums to visual styles | Trips, Drivers, Vehicles, Invoices |
| EmptyState | `empty-state.tsx` | `icon`, `title`, `description`, `action?` ({ label, href }) | Friendly placeholder when no data exists | Every list page |
| ErrorState | `error-state.tsx` | `message`, `onRetry?` | Error display with retry button | Every page with data fetching |
| LoadingSkeleton | `loading-skeleton.tsx` | `variant` (table, card, detail, form) | Pre-built skeleton layouts matching common page types | Every page |
| ConfirmDialog | `confirm-dialog.tsx` | `title`, `description`, `onConfirm`, `destructive?` | Confirmation modal for destructive actions | Delete operations |
| SearchInput | `search-input.tsx` | `value`, `onChange`, `placeholder`, `debounceMs?` | Debounced search input with clear button and search icon | List pages |
| DateRangePicker | `date-range-picker.tsx` | `value`, `onChange`, `presets?` | Date range selection with preset ranges (Today, This Week, etc.) | Reports, dashboards, filters |
| BreadcrumbNav | `breadcrumb-nav.tsx` | `items` ({ label, href }[]) | Dynamic breadcrumb navigation | Every page |
| StatCard | `stat-card.tsx` | `title`, `value`, `change?`, `icon?`, `trend?` (up/down) | KPI card with optional trend indicator | Dashboard |
| FilterBar | `filter-bar.tsx` | `filters` (config[]), `values`, `onChange`, `onClear` | Composable filter bar with chips for active filters | List pages |
| FormSection | `form-section.tsx` | `title`, `description?`, `children` | Grouped form fields with section header | Create/edit forms |
| ActionMenu | `action-menu.tsx` | `items` ({ label, icon, onClick, destructive? }[]) | Three-dot menu with action items | Table rows, detail pages |
| UserAvatar | `user-avatar.tsx` | `user` ({ name, image?, email }) | Avatar with name/email display | Headers, lists, comments |

### DataTable Architecture

The DataTable is the most complex shared component. It wraps TanStack Table with project-specific styling and features.

```typescript
// packages/ui/src/components/shared/data-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSortingChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
};
```

### StatusBadge Color Mapping

```typescript
// packages/ui/src/components/shared/status-badge.tsx
const statusColorMap: Record<string, { bg: string; text: string; dot: string }> = {
  // Green family — success/active states
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },

  // Blue family — in-progress states
  in_progress: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  assigned: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  sent: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },

  // Yellow family — pending/warning states
  scheduled: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  draft: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  partial: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },

  // Red family — error/destructive states
  cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  overdue: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  no_show: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  inactive: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },

  // Gray family — neutral states
  on_leave: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
  archived: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
};
```

---

## Tier 3: Feature-Specific Components

These components are specific to a single domain and live in `apps/web/src/components/{domain}/`.

**Location:** `apps/web/src/components/{domain}/`

### {{DOMAIN_1}}: {{DOMAIN_NAME}}

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `{Domain}Card` | `{domain}-card.tsx` | `{domain}: {Domain}Type` | Summary card for list/grid views |
| `{Domain}Form` | `{domain}-form.tsx` | `defaultValues?`, `onSubmit`, `isEditing?` | Create/edit form with validation |
| `{Domain}Detail` | `{domain}-detail.tsx` | `{domain}: {Domain}DetailType` | Full detail view with sections |
| `{Domain}StatusTimeline` | `{domain}-status-timeline.tsx` | `history: StatusChange[]` | Visual status change history |
| `{Domain}Table` | `{domain}-columns.tsx` | N/A (exports column defs) | Column definitions for DataTable |
| `{Domain}Filters` | `{domain}-filters.tsx` | `value`, `onChange` | Domain-specific filter controls |

### {{DOMAIN_2}}: {{DOMAIN_NAME}}

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `{Domain}Card` | `{domain}-card.tsx` | `{domain}: {Domain}Type` | Summary card |
| `{Domain}Form` | `{domain}-form.tsx` | `defaultValues?`, `onSubmit` | Create/edit form |
| `{Domain}Detail` | `{domain}-detail.tsx` | `{domain}: {Domain}DetailType` | Detail view |
| `{Domain}Table` | `{domain}-columns.tsx` | N/A | Column definitions |

### Pattern: Domain Column Definitions

```typescript
// apps/web/src/components/trips/trip-columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Trip } from "@project/types";
import { StatusBadge } from "@project/ui";
import { formatDate, formatCurrency } from "@/lib/formatters";

export const tripColumns: ColumnDef<Trip>[] = [
  {
    accessorKey: "scheduledAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.scheduledAt),
  },
  {
    accessorKey: "passenger.name",
    header: "Passenger",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "fareInCents",
    header: "Fare",
    cell: ({ row }) => formatCurrency(row.original.fareInCents),
  },
  {
    accessorKey: "driver.name",
    header: "Driver",
    cell: ({ row }) => row.original.driver?.name ?? "Unassigned",
  },
];
```

---

## Component Dependencies

```
Tier 3 (Feature-Specific)
  imports from ↓
Tier 2 (Domain-Shared)
  imports from ↓
Tier 1 (Foundation/shadcn)
  imports from ↓
Tailwind CSS + Design Tokens
```

**Rules:**
- Tier 1 never imports from Tier 2 or 3
- Tier 2 can import from Tier 1 only
- Tier 3 can import from Tier 1 and Tier 2
- All tiers use design tokens (CSS custom properties) for colors, spacing, radii

---

## Design Token Integration

```css
/* apps/web/src/styles/globals.css */
:root {
  /* Brand colors */
  --color-primary: {PRIMARY_HSL};
  --color-primary-foreground: {PRIMARY_FG_HSL};

  /* Semantic colors */
  --color-success: {SUCCESS_HSL};
  --color-warning: {WARNING_HSL};
  --color-destructive: {DESTRUCTIVE_HSL};

  /* Surfaces */
  --color-background: {BG_HSL};
  --color-card: {CARD_HSL};
  --color-muted: {MUTED_HSL};

  /* Spacing scale */
  --space-page: 1.5rem;   /* Page padding */
  --space-section: 1.5rem; /* Between sections */
  --space-card: 1rem;     /* Card internal padding */

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

---

## Component Inventory Checklist

- [ ] All shadcn/ui foundation components installed and customized
- [ ] All shared components built in `packages/ui`
- [ ] All shared components exported from `packages/ui/src/index.ts`
- [ ] Feature-specific components scaffolded per domain
- [ ] StatusBadge covers all enum values from database schema
- [ ] DataTable supports server-side pagination and sorting
- [ ] EmptyState has CTA for each domain's create action
- [ ] ErrorState has retry functionality wired up
- [ ] Loading skeletons match the data layout for each page type
- [ ] All components use design tokens (not hardcoded colors)
- [ ] All components have responsive behavior documented
- [ ] Form components use shared Zod schemas from `packages/validators`
