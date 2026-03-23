# Component Customization

## Philosophy

shadcn/ui gives you excellent, accessible components. But out of the box, every shadcn project looks the same. Customization is what makes your product look like YOUR product instead of a template.

You don't need to customize everything. Customize the **3 highest-impact components first**, then add project-specific domain components as needed.

---

## The Top 3: Customize These First

These three components appear on nearly every page. Customizing them transforms the entire feel of the application.

### 1. Button

Default shadcn buttons are functional but flat. Add depth and personality:

```tsx
// components/ui/button.tsx - Enhanced version
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: add smooth transition and focus ring with primary color
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          // Add subtle shadow and hover shadow lift
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md active:bg-primary-800 active:shadow-sm",
        destructive:
          "bg-error text-white shadow-sm hover:bg-red-600 hover:shadow-md active:bg-red-700",
        outline:
          "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100",
        secondary:
          "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300",
        ghost:
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        link:
          "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
```

**What changed from default:**
- Added `shadow-sm` and `hover:shadow-md` for depth
- Added `active:` states for pressed feedback
- Added `isLoading` prop with spinner
- Used `font-semibold` instead of `font-medium`
- Used design token colors (`primary-600`, `primary-700`)
- Added `transition-all duration-150` for smooth interactions

### 2. Card

Default cards are flat rectangles. Add interactive depth:

```tsx
// components/ui/card.tsx - Enhanced version
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-6",
        "shadow-card",
        interactive && [
          "transition-shadow duration-200",
          "hover:shadow-card-hover",
          "cursor-pointer",
        ],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-neutral-900 leading-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-neutral-500", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center pt-4 border-t border-neutral-100", className)}
      {...props}
    />
  );
}
```

**What changed from default:**
- Added `shadow-card` token (defined in design tokens)
- Added `interactive` prop for hover shadow transition
- Added `border-t` to CardFooter for visual separation
- Used design token colors throughout
- Adjusted spacing for better rhythm

### 3. Input

Default inputs have no hover state and a generic focus ring. Add interaction feedback:

```tsx
// components/ui/input.tsx - Enhanced version
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        // Base
        "flex h-10 w-full rounded-md border bg-white px-3 py-2",
        "text-sm text-neutral-900 placeholder:text-neutral-400",
        // Default border
        "border-neutral-200",
        // Hover: slightly darker border
        "hover:border-neutral-300",
        // Focus: primary color ring
        "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
        // Transition
        "transition-colors duration-150",
        // Error state
        error && "border-error focus:ring-error/20 focus:border-error",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-200",
        className
      )}
      {...props}
    />
  );
}
```

**What changed from default:**
- Added `hover:border-neutral-300` for mouse-over feedback
- Focus ring uses primary color with opacity (`primary-500/20`)
- Added `error` prop for form validation states
- Added `transition-colors` for smooth state changes
- Explicit disabled state that prevents hover effect

---

## Customization Technique: CSS Custom Properties

Override via CSS variables, NOT by editing component source directly. This keeps upgrades clean:

```css
/* In your globals.css or app.css */
:root {
  /* shadcn default variables */
  --radius: 0.5rem;
  --primary: 234.5 89.5% 73.9%;  /* maps to your primary color */
  --primary-foreground: 0 0% 100%;

  /* Custom component tokens */
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.08);
  --shadow-card-hover: 0 4px 12px rgb(0 0 0 / 0.1);
  --button-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  --button-shadow-hover: 0 2px 8px rgb(0 0 0 / 0.1);
}
```

---

## Customization Technique: `cn()` Utility

All shadcn components use `cn()` (clsx + tailwind-merge) for conditional classes:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This lets you override any class from the usage site:

```tsx
// Override padding for a specific instance
<Card className="p-4">  {/* overrides default p-6 */}

// Add responsive behavior
<Button className="w-full sm:w-auto">Save</Button>
```

---

## Domain-Specific Components

After the top 3, create project-specific wrappers for domain components:

### StatusBadge (extends Badge)

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertTriangle, Loader2 } from "lucide-react";

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  no_show: {
    label: "No Show",
    icon: AlertTriangle,
    className: "bg-neutral-50 text-neutral-700 border-neutral-200",
  },
} as const;

type Status = keyof typeof statusConfig;

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        config.className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", status === "in_progress" && "animate-spin")} />
      {config.label}
    </Badge>
  );
}
```

**Why this exists:** Status badges appear everywhere (trip lists, detail pages, dispatch board). A centralized component ensures consistent color + icon + text for every status.

### PageHeader

```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="mt-3 sm:mt-0">{action}</div>}
    </div>
  );
}
```

### EmptyState

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 rounded-full bg-neutral-100 p-4 text-neutral-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

### LoadingState (Skeleton)

```tsx
export function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Page header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-neutral-200 rounded" />
        <div className="h-10 w-32 bg-neutral-200 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-neutral-200 rounded-lg" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-neutral-200 rounded" />
        ))}
      </div>
    </div>
  );
}
```

**Key principle:** Skeleton shapes should match the content they're replacing. A table skeleton has rows. A card grid skeleton has cards. This is called "content-shaped loading" and it feels faster than a generic spinner.

---

## DataTable Enhancements

The default shadcn DataTable is functional but sparse. Common enhancements:

```tsx
// Sortable column header
<TableHead
  className="cursor-pointer select-none hover:bg-neutral-50 transition-colors"
  onClick={() => handleSort("name")}
>
  <span className="inline-flex items-center gap-1">
    Name
    <SortIcon direction={sortConfig.column === "name" ? sortConfig.direction : null} />
  </span>
</TableHead>

// Row hover state
<TableRow className="hover:bg-neutral-50/50 transition-colors cursor-pointer">

// Empty state (inside table)
{data.length === 0 && (
  <TableRow>
    <TableCell colSpan={columns.length} className="h-32 text-center">
      <EmptyState
        title="No results found"
        description="Try adjusting your filters"
      />
    </TableCell>
  </TableRow>
)}
```

---

## Customization Checklist

When adding a new component to your project:

- [ ] Uses design tokens (not hardcoded colors)
- [ ] Has hover state
- [ ] Has focus state (keyboard accessible)
- [ ] Has disabled state
- [ ] Uses `cn()` for className merging
- [ ] Uses `cva` for variants (if multiple variants exist)
- [ ] Supports responsive layout
- [ ] Follows existing component patterns in the project
- [ ] Does NOT duplicate existing component functionality
