# Unit Tests

## What It Is

Unit tests verify the smallest testable pieces of your application in complete isolation — a single function, a single validator, a single component render — with all external dependencies mocked or stubbed out. The goal is not to prove the system works end-to-end, but to prove that each individual brick is solid before you start stacking them. A well-written unit test runs in under 50ms, requires no network or database, and tells you exactly what broke and where when it fails. If your test needs to spin up a server or seed a database, it is not a unit test.

## What It Catches

- **Off-by-one errors in business logic** — A pricing calculator that charges $0 when quantity is exactly 1 because the loop starts at index 1 instead of 0
- **Null/undefined propagation** — A `formatUserName(user)` function that throws when `user.middleName` is undefined instead of returning "John Doe"
- **Incorrect validation boundaries** — An email validator that accepts `user@` (missing domain) or rejects `user+tag@example.com` (valid plus-addressing)
- **Wrong return types** — A function that returns `"false"` (string) instead of `false` (boolean), passing truthy checks when it should fail
- **Unhandled error paths** — A `parseJSON` wrapper that throws a raw SyntaxError instead of returning a structured error object, crashing the caller
- **State mutation bugs** — A Redux reducer that mutates the existing state object instead of returning a new one, causing React to skip re-renders
- **Incorrect date/timezone handling** — A `isExpired(date)` function that compares UTC timestamps against local time, giving wrong results for users west of GMT
- **Rounding and precision errors** — A tax calculator that returns `$10.005` instead of rounding to `$10.01`, causing display and ledger mismatches
- **Enum/constant misuse** — A status mapper that handles `"active"` and `"inactive"` but silently passes through `"ACTIVE"` (wrong casing) as valid

## When It's Required

Unit tests are required for **every feature that ships code**. There are no exceptions. The scope varies by what you are writing:

| Code Type | Minimum Test Count | What to Cover |
|-----------|-------------------|---------------|
| Validator / parser | 5+ tests | Valid input, each invalid category, boundary values, empty/null input, Unicode/special chars |
| Utility function | 3+ tests | Happy path, edge cases (empty array, zero, negative), error return |
| tRPC / API router | 5+ per procedure | Valid call, auth rejection, invalid input (Zod failures), not-found case, ownership check |
| React component | 4+ tests | Default render, user interaction, conditional rendering states, accessibility attributes |
| Redux / Zustand reducer | 3+ per action | State transition correctness, initial state handling, idempotency |
| Custom hook | 4+ tests | Initial state, state after interaction, cleanup/unmount, error state |
| Database query builder | 3+ tests | Correct SQL generation, parameterization (no injection), empty result handling |

**Skip unit tests only for:** generated code (Prisma client, GraphQL codegen), pure configuration files, and static content pages with no logic.

## Setup Guide

### Primary: Vitest (recommended for Vite/Next.js 14+)

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts` at project root:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        'src/generated/**',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Alternative: Jest (for existing Jest codebases)

```bash
pnpm add -D jest @jest/types ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Monorepo Setup

Each package gets its own `vitest.config.ts`. The root `vitest.workspace.ts` aggregates them:

```ts
export default ['packages/*/vitest.config.ts'];
```

Run all: `pnpm -r test` or `vitest --workspace vitest.workspace.ts`

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Template

### Pure function test

```ts
// src/lib/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './pricing';

describe('calculateTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('calculates single item correctly', () => {
    const items = [{ id: '1', price: 29.99, quantity: 1 }];
    expect(calculateTotal(items)).toBe(29.99);
  });

  it('multiplies by quantity', () => {
    const items = [{ id: '1', price: 10, quantity: 3 }];
    expect(calculateTotal(items)).toBe(30);
  });

  it('sums multiple items', () => {
    const items = [
      { id: '1', price: 10, quantity: 2 },
      { id: '2', price: 5.5, quantity: 1 },
    ];
    expect(calculateTotal(items)).toBe(25.5);
  });

  it('rounds to 2 decimal places', () => {
    const items = [{ id: '1', price: 33.33, quantity: 3 }];
    expect(calculateTotal(items)).toBe(99.99);
  });

  it('handles negative quantity as zero', () => {
    const items = [{ id: '1', price: 10, quantity: -1 }];
    expect(calculateTotal(items)).toBe(0);
  });
});
```

### Validator test

```ts
// src/lib/validators.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validators';

describe('validateEmail', () => {
  it.each([
    'user@example.com',
    'user+tag@example.com',
    'user.name@sub.domain.com',
    'user@123.123.123.com',
  ])('accepts valid email: %s', (email) => {
    expect(validateEmail(email)).toEqual({ valid: true });
  });

  it.each([
    ['', 'Email is required'],
    ['notanemail', 'Invalid email format'],
    ['user@', 'Missing domain'],
    ['@domain.com', 'Missing local part'],
    ['user @example.com', 'Contains spaces'],
  ])('rejects "%s" with message "%s"', (email, expectedMessage) => {
    const result = validateEmail(email);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(expectedMessage);
  });

  it('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toEqual({ valid: true });
  });
});
```

### React component test

```tsx
// src/components/StatusBadge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies correct color class for each status', () => {
    const { rerender } = render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toHaveClass('bg-green-100');

    rerender(<StatusBadge status="inactive" />);
    expect(screen.getByText('Inactive')).toHaveClass('bg-gray-100');

    rerender(<StatusBadge status="error" />);
    expect(screen.getByText('Error')).toHaveClass('bg-red-100');
  });

  it('shows tooltip on hover when description is provided', async () => {
    const user = userEvent.setup();
    render(<StatusBadge status="active" description="User is currently online" />);

    await user.hover(screen.getByText('Active'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('User is currently online');
  });

  it('has correct aria-label for screen readers', () => {
    render(<StatusBadge status="error" />);
    expect(screen.getByText('Error')).toHaveAttribute('aria-label', 'Status: Error');
  });
});
```

### Custom hook test

```tsx
// src/hooks/useDebounce.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    vi.advanceTimersByTime(499);
    expect(result.current).toBe('hello');
  });

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    vi.advanceTimersByTime(500);
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid changes, only applying the last value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    vi.advanceTimersByTime(200);
    rerender({ value: 'c' });
    vi.advanceTimersByTime(200);
    rerender({ value: 'd' });
    vi.advanceTimersByTime(500);

    expect(result.current).toBe('d');
  });
});
```

## Common Pitfalls

### 1. Testing implementation instead of behavior

**Wrong:** `expect(component.state.isOpen).toBe(true)` — this tests internal state.
**Right:** `expect(screen.getByRole('dialog')).toBeVisible()` — this tests what the user sees.

When you test implementation, every refactor breaks your tests even though the feature still works. Test the inputs and outputs, not the wiring in between.

### 2. Incomplete mocking that leaks side effects

If your "unit" test makes a real HTTP request because you forgot to mock `fetch`, it is no longer a unit test. It is slow, flaky, and will fail in CI where there is no network. Use `vi.mock()` or `msw` to intercept all external calls. If a test passes locally but fails in CI, missing mocks are the first thing to check.

### 3. Not testing error paths

Most developers write 3 happy-path tests and call it done. The bugs live in the error paths — what happens when the API returns 500? When the input is undefined? When the array is empty? For every happy-path test, write at least one sad-path test.

### 4. Brittle snapshot comparisons on frequently changing UI

Do not snapshot an entire page component. The snapshot will break every time someone changes a class name, adds a wrapper div, or updates copy. Reserve snapshots for stable, complex output like serialized data structures. See [snapshot-tests.md](./snapshot-tests.md) for when snapshots are appropriate.

### 5. Forgetting `act()` warnings in React tests

When a test triggers a state update outside of React's batch cycle, you get the "not wrapped in act(...)" warning. This is not cosmetic — it means your assertion may run before the update finishes. Use `@testing-library/react`'s `waitFor` or `findBy*` queries, which handle this automatically. Never suppress the warning with an empty `act()` wrapper.

### 6. Test pollution from shared mutable state

If Test A sets `process.env.NODE_ENV = 'production'` and does not clean it up, Test B may pass or fail depending on execution order. Always reset mocks and environment in `afterEach`. Use `vi.restoreAllMocks()` in your global setup.

## Proof Artifact

The enforcement system accepts the following as evidence that unit tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Test results (JSON)** | `vitest run --reporter=json > test-results.json` | Pass/fail count, test names, duration |
| **Coverage summary** | `vitest run --coverage` → `coverage/coverage-summary.json` | Statement/branch/function/line percentages |
| **CI badge / check** | GitHub Actions status check on the PR | Green checkmark = all passed |

**Minimum passing criteria:**

- All tests pass (0 failures)
- Coverage meets thresholds: 80% statements, 75% branches, 80% functions, 80% lines
- No skipped tests (`.skip` is not allowed in committed code — use it during development only)
- Test count meets minimums for the code type (see "When It's Required" table above)

**CI integration example (GitHub Actions):**

```yaml
- name: Run unit tests
  run: pnpm test:coverage
- name: Check coverage thresholds
  run: |
    node -e "
      const summary = require('./coverage/coverage-summary.json');
      const { statements, branches, functions, lines } = summary.total;
      const failed = [];
      if (statements.pct < 80) failed.push('statements: ' + statements.pct + '%');
      if (branches.pct < 75) failed.push('branches: ' + branches.pct + '%');
      if (functions.pct < 80) failed.push('functions: ' + functions.pct + '%');
      if (lines.pct < 80) failed.push('lines: ' + lines.pct + '%');
      if (failed.length) { console.error('Coverage below threshold:', failed); process.exit(1); }
    "
```
