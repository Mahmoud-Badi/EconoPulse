# Unit Test Templates

Reusable test patterns for the three most common test targets: validators, routers, and components. Copy, adapt, ship.

---

## Validator Test (Zod Schema)

**Rule:** At least 5 tests per schema — valid input, missing required, invalid type, invalid enum, edge case.

```typescript
import { describe, it, expect } from "vitest";
import { createEntitySchema, updateEntitySchema } from "@{project}/validators";

describe("createEntitySchema", () => {
  const validInput = {
    name: "Test Entity",
    status: "ACTIVE",
    email: "test@example.com",
    amount: 150,
  };

  it("accepts valid input", () => {
    const result = createEntitySchema.parse(validInput);
    expect(result).toEqual(validInput);
  });

  it("rejects missing required fields", () => {
    expect(() => createEntitySchema.parse({})).toThrow();
  });

  it("rejects empty string for required name", () => {
    expect(() =>
      createEntitySchema.parse({ ...validInput, name: "" })
    ).toThrow();
  });

  it("rejects invalid enum value", () => {
    expect(() =>
      createEntitySchema.parse({ ...validInput, status: "INVALID" })
    ).toThrow();
  });

  it("rejects invalid email format", () => {
    expect(() =>
      createEntitySchema.parse({ ...validInput, email: "not-an-email" })
    ).toThrow();
  });

  it("rejects negative amount", () => {
    expect(() =>
      createEntitySchema.parse({ ...validInput, amount: -100 })
    ).toThrow();
  });

  it("trims whitespace from name", () => {
    const result = createEntitySchema.parse({
      ...validInput,
      name: "  Test Entity  ",
    });
    expect(result.name).toBe("Test Entity");
  });

  it("accepts all valid enum values", () => {
    for (const status of ["ACTIVE", "INACTIVE", "PENDING"] as const) {
      const result = createEntitySchema.parse({ ...validInput, status });
      expect(result.status).toBe(status);
    }
  });
});

describe("updateEntitySchema", () => {
  it("accepts partial update (only name)", () => {
    const result = updateEntitySchema.parse({ name: "Updated" });
    expect(result.name).toBe("Updated");
  });

  it("accepts empty object (no changes)", () => {
    const result = updateEntitySchema.parse({});
    expect(result).toEqual({});
  });

  it("still validates field types on partial update", () => {
    expect(() =>
      updateEntitySchema.parse({ amount: "not-a-number" })
    ).toThrow();
  });
});
```

---

## Router Test (tRPC with Mock DB)

**Rule:** At least 5 tests per procedure — authorized success, unauthenticated rejection, unauthorized role, filtered query, empty result.

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../root";
import { createCallerFactory } from "../trpc";

// Mock the database module
vi.mock("@{project}/db", () => ({
  db: {
    query: {
      entities: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "@{project}/db";

const createCaller = createCallerFactory(appRouter);

// Helper to create caller with session
function callerAs(role: "ADMIN" | "DISPATCHER" | "DRIVER") {
  return createCaller({
    session: {
      user: {
        id: "test-user-id",
        name: "Test User",
        email: `${role.toLowerCase()}@test.com`,
        role,
      },
      session: { id: "test-session-id", expiresAt: new Date(Date.now() + 86400000) },
    },
  });
}

function callerAnonymous() {
  return createCaller({ session: null });
}

describe("entity.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated results for authorized user", async () => {
    const mockData = [
      { id: "1", name: "Entity 1", status: "ACTIVE" },
      { id: "2", name: "Entity 2", status: "ACTIVE" },
    ];
    vi.mocked(db.query.entities.findMany).mockResolvedValue(mockData);

    const caller = callerAs("ADMIN");
    const result = await caller.entity.list({ page: 1, limit: 10 });

    expect(result.data).toEqual(mockData);
    expect(result.data).toHaveLength(2);
  });

  it("rejects unauthenticated request", async () => {
    const caller = callerAnonymous();
    await expect(caller.entity.list({ page: 1, limit: 10 })).rejects.toThrow(
      /UNAUTHORIZED/
    );
  });

  it("rejects unauthorized role", async () => {
    const caller = callerAs("DRIVER");
    await expect(caller.entity.list({ page: 1, limit: 10 })).rejects.toThrow(
      /FORBIDDEN/
    );
  });

  it("filters by status", async () => {
    vi.mocked(db.query.entities.findMany).mockResolvedValue([]);

    const caller = callerAs("ADMIN");
    await caller.entity.list({ page: 1, limit: 10, status: "ACTIVE" });

    expect(db.query.entities.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Function),
      })
    );
  });

  it("handles empty result set", async () => {
    vi.mocked(db.query.entities.findMany).mockResolvedValue([]);

    const caller = callerAs("ADMIN");
    const result = await caller.entity.list({ page: 1, limit: 10 });

    expect(result.data).toEqual([]);
    expect(result.data).toHaveLength(0);
  });
});

describe("entity.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates entity with valid input", async () => {
    const newEntity = { id: "new-id", name: "New Entity", status: "ACTIVE" };
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([newEntity]),
      }),
    } as any);

    const caller = callerAs("ADMIN");
    const result = await caller.entity.create({
      name: "New Entity",
      status: "ACTIVE",
    });

    expect(result).toEqual(newEntity);
  });

  it("rejects invalid input", async () => {
    const caller = callerAs("ADMIN");
    await expect(
      caller.entity.create({ name: "", status: "INVALID" })
    ).rejects.toThrow();
  });
});

describe("entity.getById", () => {
  it("returns entity when found", async () => {
    const mockEntity = { id: "1", name: "Entity 1", status: "ACTIVE" };
    vi.mocked(db.query.entities.findFirst).mockResolvedValue(mockEntity);

    const caller = callerAs("ADMIN");
    const result = await caller.entity.getById({ id: "1" });

    expect(result).toEqual(mockEntity);
  });

  it("throws NOT_FOUND when entity does not exist", async () => {
    vi.mocked(db.query.entities.findFirst).mockResolvedValue(undefined);

    const caller = callerAs("ADMIN");
    await expect(caller.entity.getById({ id: "nonexistent" })).rejects.toThrow(
      /NOT_FOUND/
    );
  });
});
```

---

## Component Test (React Testing Library)

**Rule:** At least 4 tests per component — renders data, loading state, error state, user interaction.

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntityCard } from "./entity-card";

// Mock tRPC hooks
vi.mock("@{project}/api/react", () => ({
  api: {
    entity: {
      getById: {
        useQuery: vi.fn(),
      },
      delete: {
        useMutation: vi.fn(),
      },
    },
  },
}));

import { api } from "@{project}/api/react";

describe("EntityCard", () => {
  it("renders entity data correctly", () => {
    vi.mocked(api.entity.getById.useQuery).mockReturnValue({
      data: { id: "1", name: "Test Entity", status: "ACTIVE" },
      isLoading: false,
      error: null,
    } as any);

    render(<EntityCard id="1" />);

    expect(screen.getByText("Test Entity")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("shows loading skeleton while fetching", () => {
    vi.mocked(api.entity.getById.useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    render(<EntityCard id="1" />);

    expect(screen.getByTestId("entity-card-skeleton")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    const refetch = vi.fn();
    vi.mocked(api.entity.getById.useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
      refetch,
    } as any);

    render(<EntityCard id="1" />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("calls refetch when retry button is clicked", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    vi.mocked(api.entity.getById.useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
      refetch,
    } as any);

    render(<EntityCard id="1" />);

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("handles delete action", async () => {
    const user = userEvent.setup();
    const deleteMutation = vi.fn();
    vi.mocked(api.entity.getById.useQuery).mockReturnValue({
      data: { id: "1", name: "Test Entity", status: "ACTIVE" },
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(api.entity.delete.useMutation).mockReturnValue({
      mutate: deleteMutation,
      isPending: false,
    } as any);

    render(<EntityCard id="1" />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    // Confirm dialog
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(deleteMutation).toHaveBeenCalledWith({ id: "1" });
  });
});
```

---

## Form Component Test

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateEntityForm } from "./create-entity-form";

describe("CreateEntityForm", () => {
  const mockOnSubmit = vi.fn();

  it("submits valid form data", async () => {
    const user = userEvent.setup();
    render(<CreateEntityForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "New Entity");
    await user.selectOptions(screen.getByLabelText(/status/i), "ACTIVE");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "New Entity",
        status: "ACTIVE",
        email: "test@example.com",
      });
    });
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<CreateEntityForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<CreateEntityForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("disables submit button while submitting", async () => {
    const user = userEvent.setup();
    render(<CreateEntityForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
  });

  it("resets form after successful submission", async () => {
    const user = userEvent.setup();
    render(<CreateEntityForm onSubmit={mockOnSubmit} submitSuccess={true} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue("");
  });
});
```

---

## Utility Function Test

```typescript
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, calculateTotal } from "./utils";

describe("formatCurrency", () => {
  it("formats cents to dollar string", () => {
    expect(formatCurrency(15099)).toBe("$150.99");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles negative amounts", () => {
    expect(formatCurrency(-5000)).toBe("-$50.00");
  });

  it("handles large amounts with comma separators", () => {
    expect(formatCurrency(1000000)).toBe("$10,000.00");
  });
});

describe("formatDate", () => {
  it("formats ISO date to display format", () => {
    expect(formatDate("2026-01-15T10:30:00Z")).toBe("Jan 15, 2026");
  });

  it("handles null/undefined gracefully", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("calculateTotal", () => {
  it("sums line item amounts", () => {
    const items = [
      { amount: 1000 },
      { amount: 2500 },
      { amount: 750 },
    ];
    expect(calculateTotal(items)).toBe(4250);
  });

  it("returns 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

---

## Tips for Writing Good Tests

1. **Test behavior, not implementation.** Test what the component does, not how it does it.
2. **Use accessible selectors.** `getByRole`, `getByLabelText`, `getByText` — not `getByTestId` (use testId only as last resort).
3. **One assertion per concept.** Multiple `expect()` calls in one test are fine if they verify the same behavior.
4. **Name tests as sentences.** "it('shows error message when email is invalid')" reads like a spec.
5. **Use `userEvent` over `fireEvent`.** `userEvent` simulates real user behavior (focus, type, blur).
6. **Mock at the boundary.** Mock the API layer, not internal functions.
7. **Clean up between tests.** Use `beforeEach(() => vi.clearAllMocks())` to prevent test pollution.
