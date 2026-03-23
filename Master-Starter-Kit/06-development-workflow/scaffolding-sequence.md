# Scaffolding Sequence

## The Correct Order

```
Schema --> Seed --> Router --> Validators --> Form --> Component --> Page --> E2E
```

This is not arbitrary. Each step depends on the output of the previous step. Building out of order creates rework, duplication, and integration bugs.

---

## Why This Order

### 1. Schema First

**Command:** `/scaffold-schema {domain}`

The schema defines the data shape that everything else depends on:
- Router input/output types derive from schema
- Form fields derive from schema columns
- Component props derive from schema types
- E2E assertions check against schema-shaped data

```typescript
// packages/db/src/schema/trips.ts
export const trips = v3Schema.table("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  passengerId: uuid("passenger_id").notNull().references(() => passengers.id),
  status: tripStatusEnum("status").notNull().default("scheduled"),
  pickupTime: timestamp("pickup_time").notNull(),
  fare: decimal("fare", { precision: 10, scale: 2 }),
  // ... every field defined once, here
});
```

**If you skip this:** You invent field names in components that don't match the database. You discover missing fields during integration. You refactor everything.

### 2. Seed Before UI

**Command:** `/scaffold-seed {domain}`

Seed data lets you see what the UI will actually look like with real data:

```typescript
// packages/db/src/seed/trips.ts
export async function seedTrips(db: Database) {
  await db.insert(trips).values([
    {
      passengerId: passengers[0].id,
      status: "scheduled",
      pickupTime: new Date("2026-02-18T09:00:00"),
      fare: "45.00",
    },
    {
      // Edge case: very long passenger name
      passengerId: passengers[1].id,
      status: "in_progress",
      pickupTime: new Date("2026-02-18T10:30:00"),
      fare: "0.00", // Edge case: zero fare
    },
    // ... 10-50 records covering all statuses
  ]);
}
```

**If you skip this:** You build UI against empty states. Everything looks fine with 0 records. Then you add data and discover the table overflows, the card layout breaks, and status badges don't have colors for all statuses.

### 3. Router Before UI

**Command:** `/scaffold-router {name}`

The router defines how the UI gets data:

```typescript
// packages/api/src/routers/trip.ts
export const tripRouter = createTRPCRouter({
  list: protectedProcedure
    .input(tripListSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.trips.findMany({
        where: buildFilters(input),
        with: { passenger: true, driver: true },
        limit: input.limit,
        offset: input.offset,
      });
    }),

  create: protectedProcedure
    .input(createTripSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(trips).values(input);
    }),
});
```

**If you skip this:** Components use hardcoded mock data. When you eventually build the router, the data shape doesn't match what the components expect. You refactor every component.

### 4. Validators With Router

Validators are the shared contract between server and client:

```typescript
// packages/validators/src/trip.ts
import { z } from "zod";

export const createTripSchema = z.object({
  passengerId: z.string().uuid(),
  pickupTime: z.coerce.date().min(new Date(), "Pickup must be in the future"),
  pickupAddress: z.string().min(1, "Pickup address is required").max(500),
  dropoffAddress: z.string().min(1, "Dropoff address is required").max(500),
  fare: z.coerce.number().min(0, "Fare cannot be negative").optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
```

**Used in router:**
```typescript
.input(createTripSchema)
```

**Used in form:**
```typescript
const form = useForm<CreateTripInput>({
  resolver: zodResolver(createTripSchema),
});
```

**If you skip this:** Validation logic is duplicated. The server validates one way, the client another. They drift apart. Users see confusing errors.

### 5. Form Uses Validators

**Command:** `/scaffold-form {entity} {mode}`

The form is wired to the shared validator:

```typescript
export function CreateTripForm() {
  const form = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      pickupAddress: "",
      dropoffAddress: "",
    },
  });

  const createTrip = api.trip.create.useMutation({
    onSuccess: () => {
      toast.success("Trip created");
      router.push("/trips");
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createTrip.mutate(data))}>
        {/* Fields here */}
      </form>
    </Form>
  );
}
```

**If you build forms before validators:** You write validation inline, duplicating logic. When requirements change, you update one place and forget the other.

### 6. Components Use Data Shapes

**Command:** `/scaffold-component {name}`

Components receive typed data from the schema:

```typescript
import type { Trip } from "@delta/db/schema";

interface TripCardProps {
  trip: Trip & { passenger: Passenger; driver?: Driver };
  onStatusChange?: (newStatus: TripStatus) => void;
}

export function TripCard({ trip, onStatusChange }: TripCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{trip.passenger.name}</CardTitle>
        <StatusBadge status={trip.status} />
      </CardHeader>
      <CardContent>
        <p>{trip.pickupAddress} &rarr; {trip.dropoffAddress}</p>
        <p>{formatTime(trip.pickupTime)}</p>
      </CardContent>
    </Card>
  );
}
```

**Key principle:** Components are pure presentation. They receive data via props. They do NOT fetch data themselves. This keeps them testable, reusable, and independent of the data-fetching layer.

### 7. Page Integrates Everything

**Command:** `/scaffold-page {portal} {path}`

The page is the integration point -- it fetches data and passes it to components:

```typescript
export default function TripsPage() {
  const { data, isLoading, error } = api.trip.list.useQuery({ limit: 50 });

  if (isLoading) return <TripsPageSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => {}} />;
  if (!data?.length) return <EmptyState title="No trips yet" action={<CreateTripButton />} />;

  return (
    <PageLayout>
      <PageHeader title="Trips" action={<CreateTripButton />} />
      <DataTable columns={tripColumns} data={data} />
    </PageLayout>
  );
}
```

**The 4-state rule:** Every page handles loading, error, empty, and data states. No exceptions.

### 8. E2E Tests the Integration

**Command:** `/scaffold-e2e {scenario}`

E2E tests exercise the full stack:

```typescript
test("create a new trip", async ({ page }) => {
  await page.goto("/trips/new");
  await page.fill('[name="pickupAddress"]', "123 Main St");
  await page.fill('[name="dropoffAddress"]', "456 Oak Ave");
  await page.fill('[name="pickupTime"]', "2026-02-18T09:00");
  await page.click('button[type="submit"]');
  await expect(page.locator(".toast-success")).toBeVisible();
  await expect(page).toHaveURL("/trips");
});
```

**Why last:** E2E requires everything to exist. Schema, seed, router, form, page -- all must work together.

---

## What Goes Wrong When You Skip

| Skipped Step | What Happens | Time Cost |
|-------------|-------------|-----------|
| Schema | Field names don't match between layers | 2-4 hours refactoring |
| Seed | UI looks fine with 0 records, breaks with real data | 1-2 hours fixing layouts |
| Router | Components have hardcoded mock data | 1-3 hours replacing mocks |
| Validators | Duplicated validation, server/client drift | 30 min per form |
| Form before validators | Inline validation duplicates logic | 30 min per form change |
| Components before router | Wrong data shapes assumed | 1-2 hours per component |
| Page before components | Monolithic page files that resist refactoring | 2-4 hours extracting components |
| E2E before integration | Tests written against imagined behavior | Tests all rewritten |

---

## Quick Reference Card

```
STEP    COMMAND                        OUTPUT
----    -------                        ------
1       /scaffold-schema {domain}      Schema + types + relations
2       /scaffold-seed {domain}        Seed file with realistic data
3       /scaffold-router {name}        tRPC router + procedures
4       (generated with router)        Zod validators in packages/validators/
5       /scaffold-form {entity} create React Hook Form + zodResolver
6       /scaffold-component {name}     Pure presentational component
7       /scaffold-page {portal} {path} Next.js page with 4 states
8       /scaffold-e2e {scenario}       Playwright test file
```

Each command generates the right files in the right locations following the project's established patterns. The scaffolds are starting points -- you'll customize them, but the structure is correct from the start.
