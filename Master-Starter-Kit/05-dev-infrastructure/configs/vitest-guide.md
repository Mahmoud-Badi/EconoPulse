# Vitest Unit Test Configuration Guide

## Overview

Vitest is the test runner for the monorepo. Each package that has tests gets its own `vitest.config.ts` -- there is no root-level test config. This matches Turborepo's per-package task model.

## Installation

```bash
# Add to packages that need tests
pnpm add -D vitest @vitest/coverage-v8 --filter @{project}/api
pnpm add -D vitest @vitest/coverage-v8 --filter @{project}/web

# For React component testing
pnpm add -D @testing-library/react @testing-library/jest-dom jsdom --filter @{project}/web
```

## Per-Package Configuration

### packages/api/vitest.config.ts (Node environment)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.d.ts",
        "src/index.ts",
        "src/**/__tests__/**",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
```

### apps/web/vitest.config.ts (jsdom environment for React)

```typescript
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/index.ts",
        "src/app/**/layout.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/error.tsx",
      ],
    },
  },
});
```

### packages/validators/vitest.config.ts (pure Zod schemas)

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

## Configuration Details

### `globals: true`

Makes `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` available without importing. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Environment Options

| Environment | Use For |
|-------------|---------|
| `node` | API routers, database queries, validators, utilities |
| `jsdom` | React components, hooks, DOM interactions |
| `happy-dom` | Faster alternative to jsdom (less complete) |

### Coverage Thresholds

Set realistic but enforced minimums:

```typescript
thresholds: {
  statements: 80,   // 80% of statements executed
  branches: 75,     // 75% of if/else branches covered
  functions: 80,    // 80% of functions called
  lines: 80,        // 80% of lines executed
}
```

Vitest fails the test run if coverage drops below these thresholds.

## Test Setup Files

### API Test Setup (packages/api/src/__tests__/setup.ts)

```typescript
import { beforeAll, afterAll, afterEach } from "vitest";

// Mock database connection
vi.mock("@{project}/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    query: {
      users: { findFirst: vi.fn(), findMany: vi.fn() },
      // Add more tables as needed
    },
  },
}));

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});
```

### React Test Setup (apps/web/src/__tests__/setup.ts)

```typescript
import "@testing-library/jest-dom/vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock tRPC client
vi.mock("~/lib/trpc", () => ({
  trpc: {
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  },
}));
```

## Test Patterns

### Pattern 1: Zod Validator Tests

```typescript
// packages/validators/src/trip.test.ts
import { describe, it, expect } from "vitest";
import { createTripInput, updateTripInput } from "./trip";

describe("createTripInput", () => {
  it("validates a complete valid input", () => {
    const input = {
      passengerId: "uuid-here",
      pickupAddress: "123 Main St",
      dropoffAddress: "456 Oak Ave",
      scheduledDate: "2026-03-01",
      scheduledTime: "09:00",
      tripType: "ambulatory" as const,
    };

    const result = createTripInput.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = createTripInput.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects invalid trip type", () => {
    const result = createTripInput.safeParse({
      passengerId: "uuid",
      pickupAddress: "123 Main",
      dropoffAddress: "456 Oak",
      scheduledDate: "2026-03-01",
      scheduledTime: "09:00",
      tripType: "invalid",
    });
    expect(result.success).toBe(false);
  });
});
```

### Pattern 2: tRPC Router Tests (with Mock DB)

```typescript
// packages/api/src/routers/__tests__/trip.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCaller } from "../trip";
import { db } from "@{project}/db";

// Mock the database module
vi.mock("@{project}/db");

const mockDb = vi.mocked(db);

describe("trip router", () => {
  const caller = createCaller({
    session: {
      user: { id: "user-1", role: "admin" },
    },
    db: mockDb,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns paginated trips", async () => {
      const mockTrips = [
        { id: "trip-1", status: "scheduled" },
        { id: "trip-2", status: "in_progress" },
      ];

      mockDb.query.trips.findMany.mockResolvedValue(mockTrips);

      const result = await caller.list({ page: 1, limit: 10 });
      expect(result.items).toHaveLength(2);
      expect(result.items[0]!.id).toBe("trip-1");
    });

    it("throws UNAUTHORIZED for unauthenticated users", async () => {
      const unauthCaller = createCaller({ session: null, db: mockDb });
      await expect(unauthCaller.list({ page: 1 })).rejects.toThrow(
        "UNAUTHORIZED"
      );
    });
  });

  describe("create", () => {
    it("creates a trip with valid input", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "new-trip" }]),
        }),
      });

      const result = await caller.create({
        passengerId: "passenger-1",
        pickupAddress: "123 Main",
        dropoffAddress: "456 Oak",
        scheduledDate: "2026-03-01",
        scheduledTime: "09:00",
        tripType: "ambulatory",
      });

      expect(result.id).toBe("new-trip");
    });
  });
});
```

### Pattern 3: React Component Tests

```typescript
// apps/web/src/components/trip/__tests__/trip-card.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TripCard } from "../trip-card";

const mockTrip = {
  id: "trip-1",
  passengerName: "John Doe",
  status: "scheduled",
  pickupAddress: "123 Main St",
  dropoffAddress: "456 Oak Ave",
  scheduledDate: "2026-03-01",
  scheduledTime: "09:00",
};

describe("TripCard", () => {
  it("renders trip details", () => {
    render(<TripCard trip={mockTrip} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("scheduled")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<TripCard trip={mockTrip} onClick={onClick} />);

    fireEvent.click(screen.getByRole("article"));
    expect(onClick).toHaveBeenCalledWith("trip-1");
  });

  it("shows status badge with correct color", () => {
    render(<TripCard trip={mockTrip} />);

    const badge = screen.getByText("scheduled");
    expect(badge).toHaveClass("bg-blue");
  });
});
```

## Package Scripts

Each package with tests:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Running Tests

```bash
# All packages via Turbo
pnpm test

# Specific package
pnpm test --filter @{project}/api

# Watch mode (single package only)
cd packages/api && pnpm test:watch

# With coverage
pnpm test:coverage --filter @{project}/api

# Single file
cd packages/api && npx vitest run src/routers/__tests__/trip.test.ts
```

## Common Gotchas

1. **No root vitest.config.ts**: Each package owns its config. A root config causes path resolution issues in monorepos.

2. **Missing `globals` type**: If `describe`/`it` show type errors, add `"types": ["vitest/globals"]` to the package's `tsconfig.json`.

3. **jsdom environment for components**: React components need `environment: "jsdom"`. Node environment throws `document is not defined`.

4. **Mock cleanup**: Always call `vi.restoreAllMocks()` in `afterEach` to prevent mock leakage between tests.

5. **Async test timeout**: Default timeout is 5 seconds. For slow operations, set per-test: `it("slow test", async () => { ... }, 10000)`.

6. **Coverage excluding test files**: Always exclude `*.test.*` and `__tests__/` from coverage reports to avoid inflating numbers.
