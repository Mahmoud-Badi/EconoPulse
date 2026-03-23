# Component Integration Tests

## What It Is

Component integration tests verify that multiple React components work correctly together — parent-child prop passing, shared context providers, router integration, form library bindings, and user interactions that span component boundaries. Where a unit test renders a single component in isolation with mocked props, a component integration test renders a realistic composition: a form component inside a provider, connected to a router, with user events that trigger state changes across multiple components. These tests use React Testing Library's philosophy of testing from the user's perspective — you do not inspect component internals, you simulate what a real user would do (click, type, navigate) and verify what they would see.

## What It Catches

- **Context not provided** — A component that reads from `ThemeContext` renders with defaults instead of the actual theme because a parent forgot to wrap it in `<ThemeProvider>`
- **Prop drilling breakage** — A parent passes `onSubmit` to a form, which passes it to a button, but an intermediate component forgets to forward the prop, so clicking submit does nothing
- **Router integration failures** — A navigation link renders correctly but clicking it does not navigate because the component is not wrapped in a `<Router>` in the test, or the route path does not match
- **Form library state desync** — A react-hook-form field registers correctly but the submit handler receives `undefined` for that field because the `name` prop does not match the schema key
- **Conditional rendering timing** — A loading spinner should disappear when data arrives, but the test passes too early because the assertion ran before the async state update completed
- **Accessibility interaction gaps** — A dropdown opens on click but cannot be operated with keyboard (Enter to open, arrow keys to navigate, Escape to close) — testing the full composition reveals this
- **Cross-component state management** — Adding an item to a cart in one component should update the cart count in the header component; testing them together proves the shared state works
- **Error boundary behavior** — A child component throws during render, and the error boundary should catch it and render a fallback — but only when tested as a composition do you verify the boundary actually works

## When It's Required

Component integration tests are required for:

| Scenario | What to Test |
|----------|-------------|
| Forms (react-hook-form, Formik) | Full form lifecycle: fill fields → validate → submit → handle success/error |
| Multi-step wizards | Step navigation, data persistence between steps, final submission with all steps' data |
| Components with context dependencies | Component renders correctly when wrapped in the actual provider, not a mock |
| Page-level compositions | The page assembles header, sidebar, content, and modal — they interact correctly |
| Data tables with actions | Sort, filter, paginate, select rows, perform bulk actions — all in one test |
| Modal/dialog flows | Open trigger → modal renders → form inside modal → submit → modal closes → parent updates |
| Auth-gated UI | Authenticated user sees admin panel, unauthenticated user sees login prompt |

**Skip component integration tests for:** Leaf components with no children or context dependencies (test with unit tests), pure display components that only render props (test with unit tests), third-party component libraries (they have their own tests).

## Setup Guide

### Dependencies

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### Test utilities — wrapper with providers

Most component integration tests need the same providers: router, theme, auth context, query client. Create a custom render function that wraps components in all required providers:

```tsx
// test/render.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

type CustomRenderOptions = RenderOptions & {
  initialRoute?: string;
  user?: { id: string; role: string } | null;
};

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialRoute = '/', user = null, ...renderOptions } = options;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={user}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// For tests that need routing
export function renderWithRouter(
  routes: Parameters<typeof createMemoryRouter>[0],
  options: CustomRenderOptions & { initialEntries?: string[] } = {}
) {
  const { initialEntries = ['/'], ...rest } = options;
  const router = createMemoryRouter(routes, { initialEntries });

  return renderWithProviders(<RouterProvider router={router} />, rest);
}
```

### MSW for API mocking in component tests

```bash
pnpm add -D msw
```

```ts
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/me', () => {
    return HttpResponse.json({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member',
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'new-user', ...body }, { status: 201 });
  }),
];
```

```ts
// test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

## Template

### Form integration test

```tsx
// src/features/users/CreateUserForm.integration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/render';
import { server } from '../../../test/setup';
import { http, HttpResponse } from 'msw';
import { CreateUserForm } from './CreateUserForm';

describe('CreateUserForm integration', () => {
  it('submits the form with valid data and shows success message', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    renderWithProviders(
      <CreateUserForm onSuccess={onSuccess} />,
      { user: { id: 'admin-1', role: 'admin' } }
    );

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText(/role/i), 'member');

    // Submit
    await user.click(screen.getByRole('button', { name: /create user/i }));

    // Verify success
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'new-user', name: 'Jane Doe' })
      );
    });

    expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
  });

  it('displays field-level validation errors without submitting', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CreateUserForm onSuccess={vi.fn()} />);

    // Submit without filling anything
    await user.click(screen.getByRole('button', { name: /create user/i }));

    // Validation errors should appear
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('displays server-side errors from the API', async () => {
    const user = userEvent.setup();

    // Override the handler for this test
    server.use(
      http.post('/api/users', () => {
        return HttpResponse.json(
          { error: 'Conflict', message: 'Email already exists' },
          { status: 409 }
        );
      })
    );

    renderWithProviders(<CreateUserForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.selectOptions(screen.getByLabelText(/role/i), 'member');
    await user.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('disables the submit button while submitting and re-enables on failure', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/users', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
      })
    );

    renderWithProviders(<CreateUserForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText(/role/i), 'member');

    const submitButton = screen.getByRole('button', { name: /create user/i });
    await user.click(submitButton);

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();

    // After failure, button should be re-enabled
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });
});
```

### Multi-component composition test

```tsx
// src/features/dashboard/Dashboard.integration.test.tsx
import { describe, it, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../test/render';
import { DashboardLayout } from './DashboardLayout';
import { Sidebar } from './Sidebar';
import { UserList } from '../users/UserList';

describe('Dashboard integration', () => {
  const routes = [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <div>Home</div> },
        { path: 'users', element: <UserList /> },
      ],
    },
  ];

  it('navigates from sidebar to user list', async () => {
    const user = userEvent.setup();
    renderWithRouter(routes, {
      initialEntries: ['/'],
      user: { id: 'admin-1', role: 'admin' },
    });

    // Sidebar should be visible
    const sidebar = screen.getByRole('navigation', { name: /sidebar/i });
    expect(sidebar).toBeInTheDocument();

    // Click Users link in sidebar
    await user.click(within(sidebar).getByRole('link', { name: /users/i }));

    // User list should render
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('shows admin-only sidebar items for admin users', () => {
    renderWithRouter(routes, {
      initialEntries: ['/'],
      user: { id: 'admin-1', role: 'admin' },
    });

    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /audit log/i })).toBeInTheDocument();
  });

  it('hides admin-only sidebar items for non-admin users', () => {
    renderWithRouter(routes, {
      initialEntries: ['/'],
      user: { id: 'user-1', role: 'member' },
    });

    expect(screen.queryByRole('link', { name: /settings/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /audit log/i })).not.toBeInTheDocument();
  });
});
```

### Modal flow test

```tsx
// src/features/users/DeleteUserModal.integration.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/render';
import { UserRow } from './UserRow';

describe('Delete user modal flow', () => {
  it('opens modal → confirms → deletes → closes modal → removes row', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <table>
        <tbody>
          <UserRow user={{ id: 'user-1', name: 'Jane Doe', email: 'jane@example.com', role: 'member' }} />
        </tbody>
      </table>
    );

    // Click delete button on the row
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Modal should appear
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText(/are you sure/i)).toBeInTheDocument();
    expect(within(modal).getByText(/jane doe/i)).toBeInTheDocument();

    // Confirm deletion
    await user.click(within(modal).getByRole('button', { name: /confirm/i }));

    // Modal should close
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

    // Success notification should appear
    expect(screen.getByText(/user deleted/i)).toBeInTheDocument();
  });

  it('closes modal on cancel without deleting', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <table>
        <tbody>
          <UserRow user={{ id: 'user-1', name: 'Jane Doe', email: 'jane@example.com', role: 'member' }} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));
    const modal = await screen.findByRole('dialog');

    // Cancel
    await user.click(within(modal).getByRole('button', { name: /cancel/i }));

    // Modal closes, row still exists
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('closes modal on Escape key', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <table>
        <tbody>
          <UserRow user={{ id: 'user-1', name: 'Jane Doe', email: 'jane@example.com', role: 'member' }} />
        </tbody>
      </table>
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });
});
```

## Common Pitfalls

### 1. Missing provider wrappers causing cryptic errors

"Cannot read property 'subscribe' of undefined" or "useContext must be used within a Provider" — these errors mean the component needs a context provider that the test did not include. Always use a custom render function that wraps with all required providers. When you add a new context to the app, add it to the test wrapper immediately.

### 2. Using `getBy` for async content instead of `findBy`

`getBy` queries throw immediately if the element is not in the DOM. If the content appears after an async operation (API call, state update), use `findBy` which polls until the element appears or times out. Common pattern: `const heading = await screen.findByText('Dashboard');`

### 3. Testing implementation details instead of user behavior

Do not assert on component state, hook return values, or internal function calls. Assert on what the user sees and can interact with. Instead of `expect(component.state.isSubmitting).toBe(true)`, check `expect(screen.getByRole('button')).toBeDisabled()`. Testing Library's guiding principle: "The more your tests resemble the way your software is used, the more confidence they can give you."

### 4. Not cleaning up MSW handlers between tests

If Test A overrides an MSW handler to return an error, and Test B expects the default success handler, Test B will fail if handlers are not reset. Always call `server.resetHandlers()` in `afterEach` (included in the setup template above).

### 5. Forgetting to test keyboard interactions

A dropdown that opens on click but not on Enter is an accessibility failure. Component integration tests should verify keyboard interactions for all interactive elements: Tab to focus, Enter/Space to activate, Escape to dismiss, Arrow keys for navigation. Use `userEvent.keyboard('{Enter}')` and `userEvent.tab()`.

### 6. Over-mocking that turns integration tests into unit tests

If your component integration test mocks the form library, mocks the router, and mocks the context provider, you are testing nothing except that your mocks are configured correctly. The whole point is to use real providers. Mock only external boundaries (API calls via MSW), not internal module interactions.

## Proof Artifact

The enforcement system accepts the following as evidence that component integration tests ran and passed:

| Artifact | How to Generate | What It Shows |
|----------|----------------|---------------|
| **Test results (JSON)** | `vitest run --reporter=json > test-results.json` (filter for `.integration.test.tsx` files) | All component integration tests passed |
| **Coverage** | `vitest run --coverage` — check coverage for page-level and feature-level components | Multi-component compositions are tested |
| **CI status check** | GitHub Actions test job | Green checkmark = all passed |

**Minimum passing criteria:**

- All component integration tests pass (0 failures)
- Every form has a full lifecycle test (fill → validate → submit → success/error)
- Every modal/dialog has open, close, and keyboard dismiss tests
- Auth-gated UI is tested for both authenticated and unauthenticated states
- No `fireEvent` usage — use `userEvent` exclusively (it simulates real user behavior including focus, hover, and event ordering)
- Provider wrapper includes all context providers the app uses
