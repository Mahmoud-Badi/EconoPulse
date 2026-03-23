# Component Library Specification — {{PROJECT_NAME}}

> **Every component is documented before customization.** This catalog lists every UI component, its variants, states, and customizations from the shadcn/ui defaults.

---

## Component Sources

| Source | Count | Location |
|--------|-------|---------|
| shadcn/ui (customized) | {N} | `packages/ui/src/components/ui/` |
| Custom components | {N} | `packages/ui/src/components/` |
| Page-specific components | {N} | `apps/web/components/` |

---

## Core Components

### Button

**Import:** `import { Button } from "@{{PROJECT}}/ui"`
**File:** `packages/ui/src/components/ui/button.tsx`

#### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| `default` | `--color-primary-500` | White | None | Primary actions (Save, Create, Submit) |
| `destructive` | `--color-error` | White | None | Delete, Remove, Cancel with data loss |
| `outline` | Transparent | `--color-text` | `--color-border` | Secondary actions (Cancel, Back) |
| `ghost` | Transparent | `--color-text` | None | Tertiary actions, icon buttons |
| `link` | Transparent | `--color-primary-500` | None | Inline links that look like buttons |
| `secondary` | `--color-bg-muted` | `--color-text` | None | Alternative secondary actions |

#### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| `sm` | 32px | `px-3` | 13px | 14px |
| `default` | 36px | `px-4` | 14px | 16px |
| `lg` | 44px | `px-6` | 16px | 20px |
| `icon` | 36x36px | `p-2` | — | 16px |

#### States

| State | Visual Change |
|-------|--------------|
| Default | As defined by variant |
| Hover | Background darkens by one shade (500→600) |
| Focus | Focus ring: `0 0 0 3px primary-500/50` |
| Active | Background darkens by two shades (500→700) |
| Disabled | Opacity 50%, `cursor-not-allowed` |
| Loading | Spinner replaces text, button disabled |

#### Customizations from shadcn Default

- Border radius: `--radius-md` (not the shadcn default)
- Font weight: `500` (medium, not `600`)
- Transition: `--transition-fast` on background + shadow
- Focus ring: Primary color (not default gray)
- Shadow on default variant: `--shadow-xs`

#### Usage Example

```tsx
import { Button } from "@{PROJECT}/ui";
import { Loader2, Plus, Trash2 } from "lucide-react";

{/* Primary action */}
<Button>Save Changes</Button>

{/* With loading state */}
<Button disabled={isPending}>
  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Save Changes
</Button>

{/* With icon */}
<Button><Plus className="mr-2 h-4 w-4" />New Trip</Button>

{/* Destructive */}
<Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>

{/* Icon only */}
<Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
```

---

### Input

**Import:** `import { Input } from "@{{PROJECT}}/ui"`
**File:** `packages/ui/src/components/ui/input.tsx`

#### States

| State | Visual Change |
|-------|--------------|
| Default | Border: `--color-border`, background: white |
| Focus | Border: `--color-primary-500`, ring: `--shadow-focus` |
| Error | Border: `--color-error`, ring: error shadow |
| Disabled | Background: `--color-bg-muted`, opacity 50% |
| Read-only | Background: `--color-bg-muted`, normal opacity |

#### Customizations

- Height: 36px (default), 32px (sm), 44px (lg)
- Border radius: `--radius-md`
- Placeholder color: `--color-text-tertiary`
- Focus transition: `--transition-fast`

---

### Badge / Status Badge

**Import:** `import { Badge } from "@{{PROJECT}}/ui"`

#### Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| `default` | `--color-primary-100` | `--color-primary-700` | None | General labels |
| `success` | `--color-success-light` | `--color-success` | None | Completed, Active |
| `warning` | `--color-warning-light` | `--color-warning` | None | Pending, In Progress |
| `error` | `--color-error-light` | `--color-error` | None | Failed, Overdue |
| `outline` | Transparent | `--color-text-secondary` | `--color-border` | Neutral tags |

#### Status Color Mapping

```typescript
// packages/ui/src/lib/status-colors.ts
export const statusVariant: Record<string, BadgeVariant> = {
  // {Entity} statuses
  "{STATUS_1}": "default",
  "{STATUS_2}": "warning",
  "{STATUS_3}": "success",
  "{STATUS_4}": "error",
  "{STATUS_5}": "success",
  // Add all statuses from all entities
};
```

---

### Card

**Import:** `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@{{PROJECT}}/ui"`

#### Customizations

| Property | Value | shadcn Default |
|----------|-------|---------------|
| Shadow | `--shadow-card` | `shadow-sm` |
| Hover shadow | `--shadow-card-hover` | None |
| Border | `1px solid --color-border-light` | `border` |
| Border radius | `--radius-lg` | `rounded-lg` |
| Padding | `--space-6` | `p-6` |
| Background | `--color-bg-card` | `bg-card` |

---

### DataTable

**Import:** `import { DataTable } from "@{{PROJECT}}/ui"`
**Custom component** (not from shadcn — built on top of `@tanstack/react-table`)

#### Features

| Feature | Implementation |
|---------|---------------|
| Sorting | Click column header, arrow indicator |
| Filtering | Filter bar above table with chips |
| Pagination | Bottom bar: prev/next + page size selector |
| Selection | Checkbox column for bulk actions |
| Row actions | Dropdown menu on last column |
| Empty state | Centered message + CTA when no rows |
| Loading | Skeleton rows (match layout of real rows) |
| Responsive | Hides columns on mobile, or switches to card layout |

#### Column Types

| Type | Alignment | Formatting |
|------|-----------|-----------|
| Text | Left | Truncate with ellipsis at {N}px |
| Number | Right | `Intl.NumberFormat` |
| Money | Right | `$X,XXX.XX` (from cents) |
| Date | Left | `MMM dd, yyyy` or relative ("2 hours ago") |
| Status | Center | `<Badge variant={statusVariant[value]} />` |
| Boolean | Center | Checkmark icon or empty |
| Actions | Right | `<DropdownMenu>` with view/edit/delete |
| Avatar + Name | Left | 32px avatar circle + name text |
| Link | Left | Underline on hover, navigate on click |

---

### Select / Combobox

| Component | Use When |
|-----------|----------|
| `Select` | < 10 static options (enum values) |
| `Combobox` | 10+ options or needs search (FK references) |

#### Combobox Features
- Type-ahead search (debounced 300ms)
- Loading state while searching
- Empty state: "No results found"
- Creates new option inline (optional)
- Shows selected value with clear button

---

### Dialog / Modal

#### Sizes

| Size | Width | Usage |
|------|-------|-------|
| `sm` | 400px | Confirmation dialogs, simple prompts |
| `default` | 500px | Forms, detail views |
| `lg` | 640px | Complex forms, multi-step wizards |
| `xl` | 800px | Data-heavy views, previews |
| `full` | 100vw (mobile) | Mobile modals become full-screen |

#### Rules
- Always has a close button (X) in top-right
- Clicking backdrop closes non-critical modals
- Escape key closes all modals
- Focus trapped inside modal when open
- Body scroll locked when modal open

---

### Toast / Notifications

**Library:** Sonner

| Type | Icon | Duration | Position |
|------|------|----------|----------|
| Success | CheckCircle (green) | 3s auto-dismiss | Bottom-right |
| Error | AlertCircle (red) | 5s auto-dismiss | Bottom-right |
| Warning | AlertTriangle (yellow) | 4s auto-dismiss | Bottom-right |
| Info | Info (blue) | 3s auto-dismiss | Bottom-right |
| Loading | Spinner | Until resolved | Bottom-right |

---

## Custom Components

### PageHeader

```tsx
<PageHeader
  title="Trips"
  description="Manage all transportation trips" // optional
  breadcrumbs={[
    { label: "Dashboard", href: "/" },
    { label: "Trips" }, // Last item = current page, no link
  ]}
  actions={
    <Button asChild>
      <Link href="/trips/new"><Plus className="mr-2 h-4 w-4" />New Trip</Link>
    </Button>
  }
/>
```

### EmptyState

```tsx
<EmptyState
  icon={FileText}
  title="No trips yet"
  description="Create your first trip to get started."
  action={
    <Button asChild>
      <Link href="/trips/new">Create Trip</Link>
    </Button>
  }
/>
```

### LoadingSkeleton

```tsx
{/* Matches the layout of the actual content */}
<LoadingSkeleton variant="table" rows={5} columns={6} />
<LoadingSkeleton variant="card" count={4} />
<LoadingSkeleton variant="form" fields={8} />
<LoadingSkeleton variant="detail" />
```

### StatusBadge

```tsx
{/* Automatic color mapping based on status value */}
<StatusBadge status="completed" />    {/* → green badge */}
<StatusBadge status="in_progress" />  {/* → yellow badge */}
<StatusBadge status="cancelled" />    {/* → red badge */}
```

### MoneyDisplay

```tsx
<MoneyDisplay cents={12550} />  {/* → $125.50 */}
<MoneyDisplay cents={12550} trend={+15.2} />  {/* → $125.50 ↑15.2% */}
```

---

## Component Inventory

| Component | Source | Variants | Sizes | Custom? | File |
|-----------|--------|----------|-------|---------|------|
| Button | shadcn | 6 | 4 | Yes | `ui/button.tsx` |
| Input | shadcn | — | 3 | Yes | `ui/input.tsx` |
| Badge | shadcn | 5 | 2 | Yes | `ui/badge.tsx` |
| Card | shadcn | — | — | Yes | `ui/card.tsx` |
| Select | shadcn | — | — | Minor | `ui/select.tsx` |
| Dialog | shadcn | 5 sizes | — | Yes | `ui/dialog.tsx` |
| DropdownMenu | shadcn | — | — | Minor | `ui/dropdown-menu.tsx` |
| Table | shadcn | — | — | Yes | `ui/table.tsx` |
| Tabs | shadcn | — | — | Minor | `ui/tabs.tsx` |
| Form | shadcn | — | — | Minor | `ui/form.tsx` |
| Checkbox | shadcn | — | — | Minor | `ui/checkbox.tsx` |
| Switch | shadcn | — | — | Minor | `ui/switch.tsx` |
| DatePicker | Custom | — | — | Full | `date-picker.tsx` |
| Combobox | Custom | — | — | Full | `combobox.tsx` |
| DataTable | Custom | — | — | Full | `data-table.tsx` |
| PageHeader | Custom | — | — | Full | `page-header.tsx` |
| EmptyState | Custom | — | — | Full | `empty-state.tsx` |
| LoadingSkeleton | Custom | 4 | — | Full | `loading-skeleton.tsx` |
| StatusBadge | Custom | auto | — | Full | `status-badge.tsx` |
| MoneyDisplay | Custom | 2 | — | Full | `money-display.tsx` |
