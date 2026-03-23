/**
 * Unit Test Example — TaskFlow Projects Service
 *
 * READ ONLY — reference example showing unit test patterns.
 *
 * Patterns demonstrated:
 * - describe/it blocks with clear naming
 * - Arrange-Act-Assert structure
 * - Mocking dependencies (database, auth)
 * - Testing success paths, error paths, and edge cases
 * - Using factories for test data
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProject, getProjectsByWorkspace } from "@/services/projects";
import { db } from "@/lib/db";
import { createTestUser, createTestWorkspace } from "@test/factories";

// Mock the database module
vi.mock("@/lib/db");

describe("Projects Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── createProject ─────────────────────────────────────────────

  describe("createProject", () => {
    it("creates a project with valid input", async () => {
      // Arrange
      const user = createTestUser({ role: "admin" });
      const workspace = createTestWorkspace({ id: "ws_123" });
      const input = {
        name: "Website Redesign",
        description: "Redesign the marketing website",
        workspaceId: workspace.id,
      };

      vi.mocked(db.project.findFirst).mockResolvedValue(null); // no duplicate
      vi.mocked(db.project.create).mockResolvedValue({
        id: "proj_456",
        ...input,
        status: "active",
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await createProject(input, user);

      // Assert
      expect(result.id).toBe("proj_456");
      expect(result.name).toBe("Website Redesign");
      expect(result.status).toBe("active");
      expect(db.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Website Redesign",
          workspaceId: "ws_123",
          createdBy: user.id,
        }),
      });
    });

    it("throws PROJECT_NAME_TAKEN when duplicate name exists", async () => {
      // Arrange
      const user = createTestUser();
      const input = {
        name: "Existing Project",
        workspaceId: "ws_123",
      };

      vi.mocked(db.project.findFirst).mockResolvedValue({
        id: "proj_existing",
        name: "Existing Project",
      } as any);

      // Act & Assert
      await expect(createProject(input, user)).rejects.toThrow(
        "PROJECT_NAME_TAKEN"
      );
      expect(db.project.create).not.toHaveBeenCalled();
    });

    it("trims whitespace from project name", async () => {
      // Arrange
      const user = createTestUser();
      const input = {
        name: "  Padded Name  ",
        workspaceId: "ws_123",
      };

      vi.mocked(db.project.findFirst).mockResolvedValue(null);
      vi.mocked(db.project.create).mockResolvedValue({
        id: "proj_789",
        name: "Padded Name",
        status: "active",
      } as any);

      // Act
      const result = await createProject(input, user);

      // Assert
      expect(result.name).toBe("Padded Name");
      expect(db.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: "Padded Name" }),
      });
    });

    it("throws validation error when name is empty", async () => {
      const user = createTestUser();
      const input = { name: "", workspaceId: "ws_123" };

      await expect(createProject(input, user)).rejects.toThrow(
        "VALIDATION_FAILED"
      );
    });

    it("throws validation error when name exceeds 100 characters", async () => {
      const user = createTestUser();
      const input = { name: "A".repeat(101), workspaceId: "ws_123" };

      await expect(createProject(input, user)).rejects.toThrow(
        "VALIDATION_FAILED"
      );
    });
  });

  // ─── getProjectsByWorkspace ─────────────────────────────────────

  describe("getProjectsByWorkspace", () => {
    it("returns projects for the given workspace", async () => {
      // Arrange
      const projects = [
        { id: "proj_1", name: "Alpha", status: "active" },
        { id: "proj_2", name: "Beta", status: "active" },
      ];

      vi.mocked(db.project.findMany).mockResolvedValue(projects as any);

      // Act
      const result = await getProjectsByWorkspace("ws_123");

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Alpha");
      expect(db.project.findMany).toHaveBeenCalledWith({
        where: { workspaceId: "ws_123", status: { not: "deleted" } },
        orderBy: { updatedAt: "desc" },
      });
    });

    it("returns empty array when workspace has no projects", async () => {
      vi.mocked(db.project.findMany).mockResolvedValue([]);

      const result = await getProjectsByWorkspace("ws_empty");

      expect(result).toEqual([]);
    });

    it("excludes deleted projects", async () => {
      vi.mocked(db.project.findMany).mockResolvedValue([]);

      await getProjectsByWorkspace("ws_123");

      expect(db.project.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          status: { not: "deleted" },
        }),
      });
    });
  });
});

// ─── Test Factories ─────────────────────────────────────────────
// Typically in a separate file: test/factories.ts

function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: "user_test_001",
    email: "test@example.com",
    name: "Test User",
    role: "member",
    workspaceId: "ws_123",
    ...overrides,
  };
}

function createTestWorkspace(overrides: Partial<Workspace> = {}): Workspace {
  return {
    id: "ws_test_001",
    name: "Test Workspace",
    slug: "test-workspace",
    plan: "free",
    ...overrides,
  };
}
