# /scaffold-page $ARGUMENT

Generate a Next.js page with loading skeleton, error boundary, empty state, and data state.

## Steps

1. **Read the screen spec** (if documented):
   ```
   {DOCS_PATH}/design/SCREEN-CATALOG.md
   ```
   Find the section for `$ARGUMENT`. Extract: page type, data requirements, layout, actions.

2. **Determine page type** from the spec or route pattern:

   | Pattern | Type | Components |
   |---------|------|------------|
   | `/trips` | List | PageHeader + filters + DataTable |
   | `/trips/[id]` | Detail | PageHeader + tabs + detail sections |
   | `/trips/new` | Form | PageHeader + form component |
   | `/trips/[id]/edit` | Form | PageHeader + form with defaultValues |
   | `/dashboard` | Dashboard | KPI cards + charts + activity feed |

3. **Generate the page file** at `apps/web/src/app/(dashboard)/{path}/page.tsx`:

   **List Page Template:**
   ```tsx
   import { Suspense } from "react";
   import { PageHeader } from "~/components/layout/page-header";
   import { {Entity}Table } from "~/components/{entity}/{entity}-table";
   import { {Entity}TableSkeleton } from "~/components/{entity}/{entity}-table-skeleton";
   import { {Entity}EmptyState } from "~/components/{entity}/{entity}-empty-state";

   export default function {Entity}ListPage() {
     return (
       <div className="flex flex-col gap-6">
         <PageHeader
           title="{Entities}"
           description="Manage your {entities}"
           action={{
             label: "Create {Entity}",
             href: "/{entities}/new",
           }}
         />

         <Suspense fallback={<{Entity}TableSkeleton />}>
           <{Entity}TableContent />
         </Suspense>
       </div>
     );
   }

   function {Entity}TableContent() {
     // This is the client component that fetches data
     // Implemented as a separate component for Suspense boundary
     return <{Entity}Table />;
   }
   ```

   **Detail Page Template:**
   ```tsx
   import { notFound } from "next/navigation";
   import { PageHeader } from "~/components/layout/page-header";
   import { {Entity}Detail } from "~/components/{entity}/{entity}-detail";

   interface {Entity}DetailPageProps {
     params: Promise<{ id: string }>;
   }

   export default async function {Entity}DetailPage({ params }: {Entity}DetailPageProps) {
     const { id } = await params;

     return (
       <div className="flex flex-col gap-6">
         <PageHeader
           title="{Entity} Details"
           backHref="/{entities}"
           actions={[
             { label: "Edit", href: `/{entities}/${id}/edit`, variant: "outline" },
             { label: "Delete", variant: "destructive" },
           ]}
         />

         <{Entity}Detail id={id} />
       </div>
     );
   }
   ```

   **Form Page Template:**
   ```tsx
   import { PageHeader } from "~/components/layout/page-header";
   import { {Entity}Form } from "~/components/{entity}/{entity}-form";

   export default function Create{Entity}Page() {
     return (
       <div className="flex flex-col gap-6">
         <PageHeader
           title="Create {Entity}"
           backHref="/{entities}"
         />

         <div className="mx-auto w-full max-w-2xl">
           <{Entity}Form mode="create" />
         </div>
       </div>
     );
   }
   ```

   **Dashboard Page Template:**
   ```tsx
   import { PageHeader } from "~/components/layout/page-header";
   import { KpiCards } from "~/components/dashboard/kpi-cards";
   import { Charts } from "~/components/dashboard/charts";
   import { ActivityFeed } from "~/components/dashboard/activity-feed";

   export default function DashboardPage() {
     return (
       <div className="flex flex-col gap-6">
         <PageHeader title="Dashboard" description="Overview of your operations" />
         <KpiCards />
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
           <Charts />
           <ActivityFeed />
         </div>
       </div>
     );
   }
   ```

4. **Generate loading.tsx** at `apps/web/src/app/(dashboard)/{path}/loading.tsx`:

   ```tsx
   import { Skeleton } from "@{project}/ui/skeleton";

   export default function Loading() {
     return (
       <div className="flex flex-col gap-6">
         {/* Page header skeleton */}
         <div className="flex items-center justify-between">
           <div className="space-y-2">
             <Skeleton className="h-8 w-48" />
             <Skeleton className="h-4 w-72" />
           </div>
           <Skeleton className="h-10 w-32" />
         </div>

         {/* Content skeleton (adjust based on page type) */}
         {/* List: table rows */}
         <div className="space-y-3">
           <Skeleton className="h-10 w-full" /> {/* Table header */}
           {Array.from({ length: 5 }).map((_, i) => (
             <Skeleton key={i} className="h-14 w-full" />
           ))}
         </div>
       </div>
     );
   }
   ```

5. **Generate error.tsx** at `apps/web/src/app/(dashboard)/{path}/error.tsx`:

   ```tsx
   "use client";

   import { AlertCircle } from "lucide-react";
   import { Alert, AlertDescription, AlertTitle } from "@{project}/ui/alert";
   import { Button } from "@{project}/ui/button";

   interface ErrorProps {
     error: Error & { digest?: string };
     reset: () => void;
   }

   export default function Error({ error, reset }: ErrorProps) {
     return (
       <div className="flex flex-col items-center justify-center gap-4 py-16">
         <Alert variant="destructive" className="max-w-md">
           <AlertCircle className="h-4 w-4" />
           <AlertTitle>Something went wrong</AlertTitle>
           <AlertDescription>
             {error.message || "An unexpected error occurred. Please try again."}
           </AlertDescription>
         </Alert>
         <Button onClick={reset} variant="outline">
           Try Again
         </Button>
       </div>
     );
   }
   ```

6. **Verify 4 required states exist in the data component**:
   - **Loading**: Covered by `loading.tsx` (framework-level) and/or Suspense fallback
   - **Error**: Covered by `error.tsx` (framework-level) and/or error handling in the component
   - **Empty**: The data component must render an empty state when query returns zero items
   - **Data**: The data component renders normally with data

7. **Run typecheck**:
   ```bash
   pnpm typecheck 2>&1 | tail -20
   ```

8. **Output report**:
   ```
   PAGE GENERATED
   ===============
   Route: /{path}
   Type: {list/detail/form/dashboard}
   Files created:
   - apps/web/src/app/(dashboard)/{path}/page.tsx
   - apps/web/src/app/(dashboard)/{path}/loading.tsx
   - apps/web/src/app/(dashboard)/{path}/error.tsx
   States: loading ✓, error ✓, empty {✓/needs component}, data {✓/needs component}
   TypeScript: {PASS/FAIL}
   ```

## Rules

- **EVERY page MUST have**: `page.tsx`, `loading.tsx`, `error.tsx`. No exceptions.
- **All data via tRPC hooks**: Never use `fetch()` directly. Use `trpc.{entity}.list.useQuery()` etc.
- **All buttons and links must be functional**: No placeholder `onClick={() => {}}`. Wire up navigation, mutations, or modals.
- **Empty state with CTA**: When no data exists, show a helpful message and a "Create {Entity}" button.
- **Responsive by default**: Use responsive grid classes (`grid-cols-1 lg:grid-cols-2`). Never fixed widths.
- **`error.tsx` must be "use client"**: Next.js error boundaries are client components.
- **Loading skeletons match layout**: The skeleton in `loading.tsx` should visually approximate the real page layout.
