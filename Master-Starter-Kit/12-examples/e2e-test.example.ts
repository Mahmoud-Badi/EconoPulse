/**
 * E2E Test Example — TaskFlow Create Project Flow
 *
 * READ ONLY — reference example showing Playwright E2E test patterns.
 *
 * Patterns demonstrated:
 * - Page Object Model (POM) for reusable page interactions
 * - Auth setup with storage state
 * - Testing full user flows (navigate → fill form → submit → verify)
 * - Waiting for API responses before asserting
 * - Screenshot on failure
 * - Testing error states and edge cases
 */

import { test, expect, Page } from "@playwright/test";

// ─── Auth Setup ──────────────────────────────────────────────────
// Reuse auth state across tests (logged in as test user)

test.use({ storageState: "test/.auth/user.json" });

// ─── Page Object ─────────────────────────────────────────────────

class ProjectsPage {
  constructor(private page: Page) {}

  // Selectors
  readonly createButton = this.page.getByRole("button", {
    name: "New Project",
  });
  readonly nameInput = this.page.getByLabel("Project name");
  readonly descriptionInput = this.page.getByLabel("Description");
  readonly submitButton = this.page.getByRole("button", { name: "Create" });
  readonly projectList = this.page.getByTestId("project-list");
  readonly emptyState = this.page.getByTestId("empty-state");

  // Actions
  async goto() {
    await this.page.goto("/projects");
    await this.page.waitForLoadState("networkidle");
  }

  async createProject(name: string, description?: string) {
    await this.createButton.click();

    await this.nameInput.fill(name);
    if (description) {
      await this.descriptionInput.fill(description);
    }

    // Wait for the API call to complete when we submit
    const responsePromise = this.page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/v1/projects") && resp.request().method() === "POST"
    );

    await this.submitButton.click();
    await responsePromise;
  }

  async getProjectCount(): Promise<number> {
    return this.page.getByTestId("project-card").count();
  }
}

// ─── Tests ───────────────────────────────────────────────────────

test.describe("Projects", () => {
  let projectsPage: ProjectsPage;

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page);
    await projectsPage.goto();
  });

  test("displays project list on load", async ({ page }) => {
    // The page should show either projects or an empty state
    const hasProjects = await projectsPage.projectList.isVisible();
    const hasEmptyState = await projectsPage.emptyState.isVisible();

    expect(hasProjects || hasEmptyState).toBe(true);
  });

  test("creates a new project successfully", async ({ page }) => {
    const projectName = `Test Project ${Date.now()}`;

    // Get initial count
    const initialCount = await projectsPage.getProjectCount();

    // Create the project
    await projectsPage.createProject(
      projectName,
      "A project created by E2E test"
    );

    // Verify: project appears in the list
    await expect(page.getByText(projectName)).toBeVisible();

    // Verify: count increased
    const newCount = await projectsPage.getProjectCount();
    expect(newCount).toBe(initialCount + 1);

    // Verify: success toast shown
    await expect(page.getByText("Project created")).toBeVisible();
  });

  test("shows validation error for empty name", async ({ page }) => {
    await projectsPage.createButton.click();

    // Try to submit with empty name
    await projectsPage.submitButton.click();

    // Verify: validation message shown
    await expect(
      page.getByText("Name must be between 1 and 100 characters")
    ).toBeVisible();

    // Verify: we're still on the form (didn't navigate away)
    await expect(projectsPage.nameInput).toBeVisible();
  });

  test("shows error for duplicate project name", async ({ page }) => {
    // Create a project first
    const duplicateName = `Duplicate Test ${Date.now()}`;
    await projectsPage.createProject(duplicateName);

    // Try to create another with the same name
    await projectsPage.createProject(duplicateName);

    // Verify: error message shown
    await expect(
      page.getByText("A project with this name already exists")
    ).toBeVisible();
  });

  test("navigates to project detail on click", async ({ page }) => {
    // Click the first project card
    const firstProject = page.getByTestId("project-card").first();
    const projectName = await firstProject
      .getByTestId("project-name")
      .textContent();

    await firstProject.click();

    // Verify: navigated to project detail page
    await expect(page).toHaveURL(/\/projects\/proj_/);
    await expect(page.getByRole("heading", { name: projectName! })).toBeVisible();
  });

  test("shows empty state when no projects exist", async ({ page }) => {
    // This test uses a fresh workspace with no projects
    // (configured via test fixtures or API setup)

    await page.goto("/projects?workspace=ws_empty_test");

    await expect(projectsPage.emptyState).toBeVisible();
    await expect(
      page.getByText("Create your first project")
    ).toBeVisible();
    await expect(projectsPage.createButton).toBeVisible();
  });
});

// ─── Responsive Tests ────────────────────────────────────────────

test.describe("Projects — Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone 13

  test("project list renders correctly on mobile", async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.goto();

    // Verify: single-column layout
    const firstCard = page.getByTestId("project-card").first();
    const box = await firstCard.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);

    // Verify: create button is accessible
    await expect(projectsPage.createButton).toBeVisible();
  });
});

// ─── Auth Setup Script ───────────────────────────────────────────
// Run once before all tests: npx playwright test --project=setup
// Saves auth state to test/.auth/user.json

// File: test/auth.setup.ts
/*
import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("TestPassword123");
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL("/dashboard");

  // Save signed-in state
  await page.context().storageState({ path: "test/.auth/user.json" });
});
*/
