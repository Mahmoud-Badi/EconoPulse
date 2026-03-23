# Test Patterns — {{PROJECT_NAME}}

> **Test patterns are documented once, reused everywhere.** Every developer (and AI agent) writes tests the same way. This document provides copy-paste patterns for every type of test in the project.

---

## Test Stack

| Layer | Tool | Location | Runs |
|-------|------|----------|------|
| Unit (validators) | Vitest | `packages/validators/src/__tests__/` | `pnpm test` |
| Unit (routers) | Vitest | `packages/api/src/__tests__/` | `pnpm test` |
| Component | Vitest + Testing Library | `packages/ui/src/__tests__/` | `pnpm test` |
| Integration | Vitest | `packages/api/src/__tests__/integration/` | `pnpm test:integration` |
| E2E | Playwright | `apps/web/e2e/` | `pnpm test:e2e` |

---

## 1. Validator Tests (Zod Schemas)

### Pattern: Valid Input Passes

```typescript
// packages/validators/src/__tests__/{entity}.test.ts
import { describe, it, expect } from "vitest";
import { create{Entity}Schema, update{Entity}Schema } from "../{entity}";

describe("create{Entity}Schema", () => {
  it("accepts valid input", () => {
    const validInput = {
      name: "Test {Entity}",
      status: "{STATUS_1}",
      {field}: "{VALID_VALUE}",
      // ... all required fields with valid values
    };

    const result = create{Entity}Schema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Test {Entity}");
    }
  });

  it("accepts valid input with optional fields", () => {
    const input = {
      name: "Test {Entity}",
      status: "{STATUS_1}",
      {field}: "{VALID_VALUE}",
      notes: "Some notes", // optional field
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
```

### Pattern: Invalid Input Fails with Correct Path

```typescript
describe("create{Entity}Schema", () => {
  it("rejects missing required field", () => {
    const input = {
      // name is missing
      status: "{STATUS_1}",
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find(
        (issue) => issue.path[0] === "name"
      );
      expect(nameError).toBeDefined();
      expect(nameError!.message).toBe("Name is required");
    }
  });

  it("rejects name exceeding max length", () => {
    const input = {
      name: "a".repeat(101), // Over 100 char limit
      status: "{STATUS_1}",
      {field}: "{VALID_VALUE}",
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects invalid enum value", () => {
    const input = {
      name: "Test",
      status: "INVALID_STATUS",
      {field}: "{VALID_VALUE}",
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.path[0]).toBe("status");
    }
  });

  it("rejects invalid UUID", () => {
    const input = {
      name: "Test",
      status: "{STATUS_1}",
      {fkField}Id: "not-a-uuid",
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const input = {
      name: "Test",
      amount: -100,
    };

    const result = create{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
```

### Pattern: Update Schema (Partial Fields)

```typescript
describe("update{Entity}Schema", () => {
  it("accepts partial update with only ID", () => {
    const input = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Updated Name",
    };

    const result = update{Entity}Schema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("requires ID", () => {
    const input = { name: "Updated Name" };

    const result = update{Entity}Schema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
```

---

## 2. Router Tests (tRPC Procedures)

### Test Setup with Mock DB

```typescript
// packages/api/src/__tests__/{entity}.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createCaller } from "../root";
import { createTRPCContext } from "../trpc";
import { db } from "@{PROJECT}/db";

// Mock session for authenticated requests
function createMockContext(overrides?: Partial<Session>) {
  return createTRPCContext({
    session: {
      user: {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        companyId: "company-1",
        ...overrides?.user,
      },
      expires: new Date(Date.now() + 86400000).toISOString(),
      ...overrides,
    },
  });
}

function createUnauthContext() {
  return createTRPCContext({ session: null });
}

describe("{entity}Router", () => {
  let caller: ReturnType<typeof createCaller>;

  beforeEach(() => {
    const ctx = createMockContext();
    caller = createCaller(ctx);
  });
```

### Pattern: Test Auth (Unauthenticated Rejected)

```typescript
  describe("list", () => {
    it("rejects unauthenticated request", async () => {
      const ctx = createUnauthContext();
      const unauthCaller = createCaller(ctx);

      await expect(
        unauthCaller.{entity}.list({ page: 1, pageSize: 20 })
      ).rejects.toThrow("UNAUTHORIZED");
    });
  });
```

### Pattern: Test Input Validation

```typescript
  describe("create", () => {
    it("rejects invalid input", async () => {
      await expect(
        caller.{entity}.create({
          name: "", // Empty name should fail
          status: "{STATUS_1}",
        })
      ).rejects.toThrow(); // Zod validation error
    });
  });
```

### Pattern: Test Not-Found

```typescript
  describe("getById", () => {
    it("throws NOT_FOUND for non-existent entity", async () => {
      await expect(
        caller.{entity}.getById({
          id: "00000000-0000-0000-0000-000000000000", // Non-existent
        })
      ).rejects.toThrow("NOT_FOUND");
    });
  });
```

### Pattern: Test CRUD Happy Path

```typescript
  describe("create + getById", () => {
    it("creates and retrieves an entity", async () => {
      // Create
      const created = await caller.{entity}.create({
        name: "Test {Entity}",
        status: "{STATUS_1}",
        {field}: "{VALUE}",
      });

      expect(created).toBeDefined();
      expect(created.name).toBe("Test {Entity}");
      expect(created.id).toBeDefined();

      // Retrieve
      const fetched = await caller.{entity}.getById({ id: created.id });
      expect(fetched.name).toBe("Test {Entity}");
      expect(fetched.status).toBe("{STATUS_1}");
    });
  });
```

### Pattern: Test Multi-Tenant Isolation

```typescript
  describe("multi-tenant isolation", () => {
    it("cannot access other company's data", async () => {
      // Create as company-1
      const ctx1 = createMockContext({ user: { companyId: "company-1" } });
      const caller1 = createCaller(ctx1);
      const entity = await caller1.{entity}.create({ name: "Company 1 Entity", ... });

      // Try to access as company-2
      const ctx2 = createMockContext({ user: { companyId: "company-2" } });
      const caller2 = createCaller(ctx2);

      await expect(
        caller2.{entity}.getById({ id: entity.id })
      ).rejects.toThrow("NOT_FOUND");
    });
  });
```

### Pattern: Test Status Transition

```typescript
  describe("updateStatus", () => {
    it("allows valid transition", async () => {
      const entity = await caller.{entity}.create({ name: "Test", status: "{STATE_1}", ... });

      const updated = await caller.{entity}.updateStatus({
        id: entity.id,
        status: "{STATE_2}",
      });

      expect(updated.status).toBe("{STATE_2}");
    });

    it("rejects invalid transition", async () => {
      const entity = await caller.{entity}.create({ name: "Test", status: "{STATE_1}", ... });

      // Try to skip to terminal state
      await expect(
        caller.{entity}.updateStatus({
          id: entity.id,
          status: "{TERMINAL_STATE}",
        })
      ).rejects.toThrow("Cannot transition");
    });
  });
```

---

## 3. Component Tests (React)

### Test Setup

```typescript
// packages/ui/src/__tests__/{component}.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { {Component} } from "../components/{component}";

const user = userEvent.setup();
```

### Pattern: Render and Query by Role

```typescript
describe("{Component}", () => {
  it("renders with default props", () => {
    render(<{Component} title="Test Title" />);

    expect(screen.getByRole("heading", { name: "Test Title" })).toBeInTheDocument();
  });

  it("renders all required elements", () => {
    render(<{Component} items={mockItems} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(mockItems.length + 1); // +1 for header
  });
});
```

### Pattern: Test User Events

```typescript
describe("{Component} interactions", () => {
  it("calls onClick when button is clicked", async () => {
    const handleClick = vi.fn();
    render(<{Component} onClick={handleClick} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("updates input value on type", async () => {
    render(<{Component} />);

    const input = screen.getByRole("textbox", { name: "Name" });
    await user.type(input, "Test Value");

    expect(input).toHaveValue("Test Value");
  });

  it("shows dropdown options on click", async () => {
    render(<{Component} options={mockOptions} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(mockOptions.length);
  });
});
```

### Pattern: Test Loading State

```typescript
describe("{Component} states", () => {
  it("shows loading skeleton", () => {
    render(<{Component} isLoading={true} />);

    expect(screen.getByTestId("{component}-skeleton")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows error state", () => {
    render(<{Component} error="Failed to load data" />);

    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<{Component} items={[]} />);

    expect(screen.getByText(/no {entities} found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create/i })).toBeInTheDocument();
  });
});
```

### Pattern: Test Disabled State

```typescript
  it("disables submit button when form is submitting", () => {
    render(<{Component} isSubmitting={true} />);

    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeDisabled();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
```

---

## 4. Integration Tests (Real Database)

### Setup with Test Database

```typescript
// packages/api/src/__tests__/integration/setup.ts
import { db } from "@{PROJECT}/db";
import { sql } from "drizzle-orm";

/**
 * Clean the test database before each integration test suite.
 * Uses TRUNCATE CASCADE for speed.
 */
export async function cleanDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE {schema}.{table_1},
                   {schema}.{table_2},
                   {schema}.{table_3},
                   {schema}.users,
                   {schema}.companies
    CASCADE
  `);
}

/**
 * Seed minimal data needed for integration tests.
 */
export async function seedTestData() {
  // Create test company
  const [company] = await db.insert(companies).values({
    name: "Test Company",
  }).returning();

  // Create test user
  const [user] = await db.insert(users).values({
    name: "Test Admin",
    email: "admin@test.com",
    role: "admin",
    companyId: company!.id,
  }).returning();

  return { company: company!, user: user! };
}
```

### Pattern: Full Flow Integration Test

```typescript
// packages/api/src/__tests__/integration/{entity}.integration.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { cleanDatabase, seedTestData } from "./setup";
import { createCaller } from "../../root";
import { createTRPCContext } from "../../trpc";

describe("{Entity} Integration", () => {
  let testData: Awaited<ReturnType<typeof seedTestData>>;
  let caller: ReturnType<typeof createCaller>;

  beforeAll(async () => {
    await cleanDatabase();
    testData = await seedTestData();

    const ctx = createTRPCContext({
      session: {
        user: {
          id: testData.user.id,
          name: testData.user.name,
          email: testData.user.email,
          role: testData.user.role,
          companyId: testData.company.id,
        },
        expires: new Date(Date.now() + 86400000).toISOString(),
      },
    });
    caller = createCaller(ctx);
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  it("full CRUD flow: create → list → update → delete", async () => {
    // CREATE
    const created = await caller.{entity}.create({
      name: "Integration Test {Entity}",
      status: "{STATUS_1}",
      {field}: "{VALUE}",
    });
    expect(created.id).toBeDefined();
    expect(created.companyId).toBe(testData.company.id);

    // LIST — verify it appears
    const list = await caller.{entity}.list({ page: 1, pageSize: 20 });
    expect(list.items).toHaveLength(1);
    expect(list.total).toBe(1);
    expect(list.items[0]!.id).toBe(created.id);

    // UPDATE
    const updated = await caller.{entity}.update({
      id: created.id,
      name: "Updated Name",
    });
    expect(updated.name).toBe("Updated Name");

    // GET BY ID — verify update persisted
    const fetched = await caller.{entity}.getById({ id: created.id });
    expect(fetched.name).toBe("Updated Name");

    // DELETE
    await caller.{entity}.delete({ id: created.id });

    // VERIFY DELETED — should not appear in list
    const listAfterDelete = await caller.{entity}.list({ page: 1, pageSize: 20 });
    expect(listAfterDelete.items).toHaveLength(0);
  });

  it("status workflow: {STATE_1} → {STATE_2} → {STATE_3}", async () => {
    const entity = await caller.{entity}.create({
      name: "Workflow Test",
      status: "{STATE_1}",
      {field}: "{VALUE}",
    });

    // Transition to STATE_2
    const step2 = await caller.{entity}.updateStatus({
      id: entity.id,
      status: "{STATE_2}",
    });
    expect(step2.status).toBe("{STATE_2}");

    // Transition to STATE_3
    const step3 = await caller.{entity}.updateStatus({
      id: entity.id,
      status: "{STATE_3}",
    });
    expect(step3.status).toBe("{STATE_3}");
  });
});
```

---

## Test Naming Convention

```
Pattern: "should {expected behavior} when {condition}"

Examples:
- "should return paginated results when called with valid filters"
- "should throw NOT_FOUND when entity belongs to different company"
- "should reject transition when going from scheduled to completed directly"
- "should show loading skeleton when data is being fetched"
- "should disable submit button when form is submitting"
```

---

## Coverage Targets

| Package | Statement | Function | Branch | Line |
|---------|-----------|----------|--------|------|
| `validators` | 95%+ | 95%+ | 90%+ | 95%+ |
| `api` (routers) | 80%+ | 80%+ | 70%+ | 80%+ |
| `ui` (components) | 70%+ | 70%+ | 60%+ | 70%+ |
| **Overall** | **80%+** | **80%+** | **70%+** | **80%+** |

---

## Running Tests

```bash
# All unit tests
pnpm test

# Watch mode (re-runs on file change)
pnpm test -- --watch

# Specific file
pnpm test -- packages/api/src/__tests__/{entity}.test.ts

# Coverage report
pnpm test -- --coverage

# Integration tests (requires database)
pnpm test:integration

# E2E tests (requires running dev server)
pnpm test:e2e

# E2E in headed mode (see browser)
pnpm test:e2e -- --headed

# E2E specific file
pnpm test:e2e -- apps/web/e2e/{entity}.spec.ts
```
