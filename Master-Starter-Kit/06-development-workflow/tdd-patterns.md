# TDD Patterns

## Philosophy

Test-driven development in this stack means: write the test first, watch it fail, implement until it passes. Not "write tests after" (that's just testing). Not "write tests sometimes" (that's gambling).

TDD works layer by layer. Each layer has a different test pattern. This document covers the pattern for each.

**Tools:**
- Unit tests: **Vitest** (fast, native ESM, compatible with our stack)
- E2E tests: **Playwright** (real browser, multi-breakpoint, network interception)

---

## Pattern 1: Validators (Zod Schemas)

Validators are the easiest to TDD because they're pure functions with no side effects.

### Test First

```typescript
// packages/validators/src/__tests__/trip.test.ts
import { describe, it, expect } from "vitest";
import { createTripSchema } from "../trip";

describe("createTripSchema", () => {
  const validInput = {
    passengerId: "550e8400-e29b-41d4-a716-446655440000",
    pickupTime: new Date("2026-03-01T09:00:00"),
    pickupAddress: "123 Main St, Springfield",
    dropoffAddress: "456 Oak Ave, Springfield",
  };

  it("accepts valid input", () => {
    const result = createTripSchema.parse(validInput);
    expect(result.passengerId).toBe(validInput.passengerId);
    expect(result.pickupAddress).toBe(validInput.pickupAddress);
  });

  it("rejects missing pickup address", () => {
    const { pickupAddress, ...missing } = validInput;
    expect(() => createTripSchema.parse(missing)).toThrow();
  });

  it("rejects empty pickup address", () => {
    expect(() =>
      createTripSchema.parse({ ...validInput, pickupAddress: "" })
    ).toThrow("Pickup address is required");
  });

  it("rejects non-UUID passenger ID", () => {
    expect(() =>
      createTripSchema.parse({ ...validInput, passengerId: "not-a-uuid" })
    ).toThrow();
  });

  it("coerces string dates to Date objects", () => {
    const result = createTripSchema.parse({
      ...validInput,
      pickupTime: "2026-03-01T09:00:00",
    });
    expect(result.pickupTime).toBeInstanceOf(Date);
  });

  it("accepts optional fare", () => {
    const result = createTripSchema.parse({ ...validInput, fare: 45.5 });
    expect(result.fare).toBe(45.5);
  });

  it("rejects negative fare", () => {
    expect(() =>
      createTripSchema.parse({ ...validInput, fare: -10 })
    ).toThrow("Fare cannot be negative");
  });
});
```

### Then Implement

```typescript
// packages/validators/src/trip.ts
import { z } from "zod";

export const createTripSchema = z.object({
  passengerId: z.string().uuid(),
  pickupTime: z.coerce.date(),
  pickupAddress: z.string().min(1, "Pickup address is required").max(500),
  dropoffAddress: z.string().min(1, "Dropoff address is required").max(500),
  fare: z.coerce.number().min(0, "Fare cannot be negative").optional(),
  notes: z.string().max(2000).optional(),
});
```

### What to Test

- Valid input passes
- Each required field, when missing, fails
- Each field with format constraints (uuid, email, min/max) rejects invalid values
- Optional fields work when present and when absent
- Coercion works (string to date, string to number)
- Custom error messages appear

---

## Pattern 2: Routers (tRPC Procedures)

Router tests require mocking the database and auth context.

### Test First

```typescript
// packages/api/src/routers/__tests__/trip.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCallerFactory } from "../../trpc";
import { tripRouter } from "../trip";

// Mock database
const mockDb = {
  query: {
    trips: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
  insert: vi.fn().mockReturnThis(),
  values: vi.fn(),
};

// Mock authenticated context
const mockAuthCtx = {
  db: mockDb,
  session: {
    user: { id: "user-1", role: "admin" },
  },
};

// Mock unauthenticated context
const mockUnauthCtx = {
  db: mockDb,
  session: null,
};

const createCaller = createCallerFactory(tripRouter);

describe("tripRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns trips for authenticated user", async () => {
      const mockTrips = [
        { id: "trip-1", status: "scheduled" },
        { id: "trip-2", status: "completed" },
      ];
      mockDb.query.trips.findMany.mockResolvedValue(mockTrips);

      const caller = createCaller(mockAuthCtx);
      const result = await caller.list({ limit: 50 });

      expect(result).toEqual(mockTrips);
      expect(mockDb.query.trips.findMany).toHaveBeenCalled();
    });

    it("rejects unauthenticated requests", async () => {
      const caller = createCaller(mockUnauthCtx);
      await expect(caller.list({ limit: 50 })).rejects.toThrow("UNAUTHORIZED");
    });
  });

  describe("create", () => {
    it("creates a trip with valid input", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue({ id: "new-trip" }),
      });

      const caller = createCaller(mockAuthCtx);
      const result = await caller.create({
        passengerId: "550e8400-e29b-41d4-a716-446655440000",
        pickupTime: new Date("2026-03-01T09:00:00"),
        pickupAddress: "123 Main St",
        dropoffAddress: "456 Oak Ave",
      });

      expect(result).toBeDefined();
    });

    it("rejects invalid input", async () => {
      const caller = createCaller(mockAuthCtx);
      await expect(
        caller.create({
          passengerId: "not-a-uuid",
          pickupTime: new Date(),
          pickupAddress: "",
          dropoffAddress: "",
        })
      ).rejects.toThrow();
    });
  });
});
```

### What to Test

- Authenticated access works
- Unauthenticated access is rejected (UNAUTHORIZED)
- Valid input produces correct output shape
- Invalid input is rejected (BAD_REQUEST)
- Role-based access (admin-only procedures reject non-admins)
- Pagination works (limit, offset, cursor)
- Filters work (status filter, date range, search)

---

## Pattern 3: Components (React)

Component tests verify rendering and interaction using Vitest + React Testing Library.

### Test First

```typescript
// apps/web/src/components/__tests__/trip-card.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TripCard } from "../trip-card";

const mockTrip = {
  id: "trip-1",
  status: "scheduled" as const,
  pickupAddress: "123 Main St",
  dropoffAddress: "456 Oak Ave",
  pickupTime: new Date("2026-03-01T09:00:00"),
  passenger: { id: "p-1", name: "John Smith" },
  fare: "45.00",
};

describe("TripCard", () => {
  it("renders passenger name", () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText("John Smith")).toBeVisible();
  });

  it("renders pickup and dropoff addresses", () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText(/123 Main St/)).toBeVisible();
    expect(screen.getByText(/456 Oak Ave/)).toBeVisible();
  });

  it("renders status badge", () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText("Scheduled")).toBeVisible();
  });

  it("calls onStatusChange when action clicked", () => {
    const onStatusChange = vi.fn();
    render(<TripCard trip={mockTrip} onStatusChange={onStatusChange} />);

    fireEvent.click(screen.getByRole("button", { name: /start trip/i }));
    expect(onStatusChange).toHaveBeenCalledWith("in_progress");
  });

  it("displays fare when present", () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText("$45.00")).toBeVisible();
  });

  it("handles missing fare gracefully", () => {
    const tripNoFare = { ...mockTrip, fare: null };
    render(<TripCard trip={tripNoFare} />);
    expect(screen.queryByText("$")).not.toBeInTheDocument();
  });
});
```

### What to Test

- Content renders (text, images, badges)
- Interactive elements trigger callbacks
- All states render correctly (loading, error, empty, data)
- Edge cases (null values, long strings, special characters)
- Accessibility (roles, labels, keyboard navigation)

### What NOT to Test

- CSS styles (that's visual regression testing, not unit testing)
- Third-party component internals (test your wrapper, not shadcn)
- Implementation details (don't test state variables directly)

---

## Pattern 4: E2E Tests (Playwright)

E2E tests exercise the full stack through a real browser.

### Test First

```typescript
// apps/web/e2e/trips.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Trip Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/auth/login");
    await page.fill('[name="email"]', "admin@example.com");
    await page.fill('[name="password"]', process.env.TEST_PASSWORD ?? "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("displays trip list with data", async ({ page }) => {
    await page.goto("/trips");
    await expect(page.locator("table tbody tr")).toHaveCount.greaterThan(0);
    await expect(page.getByText("Scheduled")).toBeVisible();
  });

  test("creates a new trip", async ({ page }) => {
    await page.goto("/trips/new");

    await page.fill('[name="pickupAddress"]', "123 Main St, Springfield");
    await page.fill('[name="dropoffAddress"]', "456 Oak Ave, Springfield");
    await page.fill('[name="pickupTime"]', "2026-03-01T09:00");
    await page.selectOption('[name="passengerId"]', { index: 1 });

    await page.click('button[type="submit"]');

    await expect(page.locator(".toast-success")).toBeVisible();
    await expect(page).toHaveURL("/trips");
  });

  test("shows validation errors for empty form", async ({ page }) => {
    await page.goto("/trips/new");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Pickup address is required")).toBeVisible();
    await expect(page.getByText("Dropoff address is required")).toBeVisible();
  });

  test("trip detail page shows all information", async ({ page }) => {
    await page.goto("/trips");
    await page.click("table tbody tr:first-child");

    await expect(page.getByText("Pickup")).toBeVisible();
    await expect(page.getByText("Dropoff")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
  });
});
```

### What to Test

- Happy path: full user flow (navigate, fill, submit, verify)
- Error path: invalid input shows appropriate errors
- Auth: protected pages redirect to login
- Navigation: links and buttons go to correct pages
- Data persistence: created items appear in lists

### What NOT to Test

- Unit-level logic (use Vitest for that)
- Third-party service behavior (mock external APIs)
- Visual appearance (use `/design-review` for that)

---

## Running Tests

```bash
# All unit tests
pnpm test

# Unit tests in watch mode (during development)
pnpm test -- --watch

# Specific test file
pnpm test -- packages/validators/src/__tests__/trip.test.ts

# E2E tests (requires running dev server)
pnpm test:e2e

# E2E with headed browser (see what's happening)
pnpm test:e2e -- --headed

# E2E specific test
pnpm test:e2e -- trips.spec.ts
```

---

## TDD Rhythm

1. Write one test
2. Run it (should fail -- red)
3. Write the minimum code to make it pass (green)
4. Run it (should pass)
5. Refactor if needed (keep tests green)
6. Write the next test
7. Repeat

**Do not write all tests first.** Write one, implement, repeat. This keeps the feedback loop tight and prevents writing tests against an incorrect mental model.
