/**
 * Mock Pattern Examples — TaskFlow
 *
 * READ ONLY — reference example showing common mocking patterns.
 *
 * Patterns demonstrated:
 * 1. MSW (Mock Service Worker) API handlers
 * 2. Auth context mock provider
 * 3. Router/navigation mock
 * 4. Database mock
 * 5. Custom render wrapper combining all mocks
 */

// ═══════════════════════════════════════════════════════════════════
// 1. MSW API Handlers — Mock API responses without touching real server
// ═══════════════════════════════════════════════════════════════════

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Define mock data
const mockProjects = [
  {
    id: "proj_001",
    name: "Website Redesign",
    status: "active",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "proj_002",
    name: "Mobile App",
    status: "active",
    createdAt: "2025-01-20T14:00:00Z",
  },
];

// Define handlers
export const handlers = [
  // GET /api/v1/projects — return project list
  http.get("/api/v1/projects", () => {
    return HttpResponse.json({ data: mockProjects });
  }),

  // POST /api/v1/projects — create a project
  http.post("/api/v1/projects", async ({ request }) => {
    const body = (await request.json()) as { name: string };

    // Simulate duplicate name error
    if (body.name === "Existing Project") {
      return HttpResponse.json(
        {
          error: {
            code: "PROJECT_NAME_TAKEN",
            message: "A project with this name already exists.",
          },
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      {
        data: {
          id: `proj_${Date.now()}`,
          name: body.name,
          status: "active",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  // DELETE /api/v1/projects/:id — delete a project
  http.delete("/api/v1/projects/:id", ({ params }) => {
    return HttpResponse.json({ success: true });
  }),
];

// Create and export the mock server
export const server = setupServer(...handlers);

// Setup in test config (vitest.setup.ts):
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// ═══════════════════════════════════════════════════════════════════
// 2. Auth Context Mock — Wrap components with fake auth state
// ═══════════════════════════════════════════════════════════════════

import React from "react";
import { AuthContext, type AuthState } from "@/contexts/auth";

const defaultAuthState: AuthState = {
  user: {
    id: "user_test_001",
    email: "test@example.com",
    name: "Test User",
    role: "admin",
    workspaceId: "ws_123",
  },
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
};

export function MockAuthProvider({
  children,
  overrides = {},
}: {
  children: React.ReactNode;
  overrides?: Partial<AuthState>;
}) {
  const value = { ...defaultAuthState, ...overrides };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Usage in tests:
// render(<MockAuthProvider><MyComponent /></MockAuthProvider>)
//
// Override for specific test:
// render(
//   <MockAuthProvider overrides={{ user: { ...user, role: "viewer" } }}>
//     <AdminPanel />
//   </MockAuthProvider>
// )

// ═══════════════════════════════════════════════════════════════════
// 3. Router Mock — Fake navigation for component tests
// ═══════════════════════════════════════════════════════════════════

import { vi } from "vitest";

// Next.js App Router mock
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/projects",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ id: "proj_001" }),
}));

// Access the mock in tests:
// import { useRouter } from "next/navigation";
// const router = useRouter();
// expect(router.push).toHaveBeenCalledWith("/projects/proj_001");

// ═══════════════════════════════════════════════════════════════════
// 4. Database Mock — Fake Prisma/Drizzle for service tests
// ═══════════════════════════════════════════════════════════════════

// Prisma mock (using vitest)
vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback: Function) => callback()),
  },
}));

// Usage:
// vi.mocked(db.project.findMany).mockResolvedValue([...projects]);
// vi.mocked(db.project.create).mockResolvedValue(newProject);

// ═══════════════════════════════════════════════════════════════════
// 5. Custom Render Wrapper — Combine all providers for component tests
// ═══════════════════════════════════════════════════════════════════

import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface CustomRenderOptions extends RenderOptions {
  authOverrides?: Partial<AuthState>;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests
        gcTime: 0, // Don't cache in tests
      },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { authOverrides, queryClient = createTestQueryClient(), ...renderOptions } =
    options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MockAuthProvider overrides={authOverrides}>{children}</MockAuthProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// Usage:
//
// import { renderWithProviders } from "@test/utils";
//
// it("renders project list", async () => {
//   renderWithProviders(<ProjectList />);
//   expect(await screen.findByText("Website Redesign")).toBeInTheDocument();
// });
//
// it("shows empty state for viewer role", async () => {
//   renderWithProviders(<AdminPanel />, {
//     authOverrides: { user: { ...defaultUser, role: "viewer" } },
//   });
//   expect(screen.getByText("No permission")).toBeInTheDocument();
// });
