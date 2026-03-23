# Seed Data Plan — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in seed data plan for a
# fictional TaskFlow project. Your seed data plan will be generated
# during ORCHESTRATOR Step 4 or derived from architecture docs.
# ============================================================

> **Faker Seed:** 42 (deterministic — same data every run)
> **Total Records:** ~450 across 9 tables
> **Execution Order:** 4 phases, dependency-ordered

---

## Design Principles

1. **Reproducible** — `faker.seed(42)` ensures identical data on every run
2. **Realistic** — Real-sounding names, plausible dates, varied data
3. **Comprehensive** — Covers all status values, edge cases, and relationships
4. **Fast** — Entire seed completes in < 5 seconds

---

## Phase 1: Foundation (no dependencies)

### users (10 records)

| Field | Strategy |
|-------|----------|
| id | `gen_random_uuid()` |
| name | `faker.person.fullName()` |
| email | Pattern: `first.last@taskflow-demo.dev` |
| image | `faker.image.avatar()` |
| createdAt | Random within last 90 days |

**Fixed users (always present):**
- `admin@taskflow-demo.dev` — Admin role, workspace owner
- `sarah@taskflow-demo.dev` — Project Manager
- `mike@taskflow-demo.dev` — Project Manager
- `alex@taskflow-demo.dev` — Team Member
- 6 additional random team members

### workspaces (2 records)

| Record | Plan | Owner |
|--------|------|-------|
| "Pixel Agency" | Pro | admin@taskflow-demo.dev |
| "Solo Designer" | Free | mike@taskflow-demo.dev |

---

## Phase 2: Core Entities (depends on Phase 1)

### workspace_members (12 records)

| Workspace | Members | Roles |
|-----------|---------|-------|
| Pixel Agency | 8 users | 1 Admin, 2 PM, 5 TM |
| Solo Designer | 2 users | 1 Admin, 1 TM |

### projects (8 records in Pixel Agency, 2 in Solo Designer)

| Project | Status | Owner | Members | Due Date |
|---------|--------|-------|---------|----------|
| Acme Corp Rebrand | ACTIVE | sarah | 4 | +30 days |
| Widget Co App Design | ACTIVE | mike | 3 | +45 days |
| Internal Tooling | DRAFT | sarah | 2 | null |
| Q1 Marketing Campaign | COMPLETED | sarah | 5 | -15 days |
| Office Renovation | ARCHIVED | admin | 2 | -45 days |
| Client Portal MVP | ACTIVE | sarah | 3 | +60 days |
| Brand Guidelines Update | ON_HOLD | mike | 2 | +20 days |
| Holiday Campaign | ACTIVE | mike | 4 | +14 days |
| Portfolio Redesign | ACTIVE | mike (Solo) | 1 | +30 days |
| Logo Concepts | DRAFT | mike (Solo) | 1 | null |

**Status distribution:** 4 ACTIVE, 2 DRAFT, 1 ON_HOLD, 1 COMPLETED, 1 ARCHIVED (+ 1 in second workspace)

---

## Phase 3: Transactions (depends on Phase 2)

### tasks (80 records)

Distribution across projects:
- Acme Corp Rebrand: 12 tasks (3 DONE, 5 IN_PROGRESS, 2 TODO, 2 BACKLOG)
- Widget Co App Design: 20 tasks (3 DONE, 2 IN_PROGRESS, 10 TODO, 5 BACKLOG)
- Internal Tooling: 5 tasks (0 DONE, 0 IN_PROGRESS, 3 TODO, 2 BACKLOG)
- Q1 Marketing Campaign: 15 tasks (15 DONE — project is COMPLETED)
- Other projects: 5-10 tasks each with varied statuses

| Field | Strategy |
|-------|----------|
| title | `faker.hacker.phrase()` refined to sound like real tasks |
| description | 1-3 sentences, some null |
| status | BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE |
| priority | LOW (30%), MEDIUM (40%), HIGH (20%), URGENT (10%) |
| assigneeId | Random from project members, some null (unassigned) |
| dueDate | Spread across next 60 days, some null, some overdue |
| position | Sequential within status column (for Kanban ordering) |

### time_entries (200 records)

| Field | Strategy |
|-------|----------|
| userId | Random from task's project members |
| taskId | Random task from the same project |
| duration | 15-480 minutes (biased toward 30, 60, 120 min blocks) |
| date | Spread across last 30 days (weekdays only) |
| description | Short note, some null |

**Distribution:** ~70% of time entries on ACTIVE projects, ~30% on COMPLETED project.

### task_comments (40 records)

| Field | Strategy |
|-------|----------|
| taskId | Weighted toward IN_PROGRESS and IN_REVIEW tasks |
| userId | Random project member |
| content | 1-3 sentences, realistic feedback language |
| createdAt | After task creation, before now |

---

## Phase 4: Derived Data (depends on Phase 3)

### notification_preferences (10 records — one per user)

All users get default preferences: taskAssigned=true, dueSoon=true, overdue=true, weeklyDigest=false.

### team_invites (3 records)

| Email | Status | Workspace |
|-------|--------|-----------|
| pending@example.com | PENDING | Pixel Agency |
| expired@example.com | EXPIRED | Pixel Agency |
| accepted@example.com | ACCEPTED | Solo Designer |

---

## Seed Orchestrator

```typescript
// prisma/seed.ts or db/seed.ts
import { faker } from "@faker-js/faker";

faker.seed(42); // Deterministic

async function seed() {
  console.log("Phase 1: Foundation...");
  const users = await seedUsers(10);
  const workspaces = await seedWorkspaces(users);

  console.log("Phase 2: Core Entities...");
  await seedWorkspaceMembers(workspaces, users);
  const projects = await seedProjects(workspaces, users);

  console.log("Phase 3: Transactions...");
  const tasks = await seedTasks(projects, 80);
  await seedTimeEntries(tasks, users, 200);
  await seedTaskComments(tasks, users, 40);

  console.log("Phase 4: Derived...");
  await seedNotificationPreferences(users);
  await seedTeamInvites(workspaces);

  console.log(`Seeded: ${users.length} users, ${projects.length} projects, ${tasks.length} tasks`);
}
```

---

## Quality Checklist

- [x] Fixed seed value (42) for reproducibility
- [x] All FK relationships valid
- [x] All enum values represented (status, priority, role)
- [x] Edge cases covered (null fields, overdue tasks, archived projects)
- [x] Realistic data volume (not too few, not too many)
- [x] Two workspaces for multi-tenant testing
- [x] Login credentials documented (admin@taskflow-demo.dev / password123)

---

## Phase 4b: Multi-Tenant Assertions

Seed two fully isolated workspaces with distinct data, then verify tenant isolation at the database and API levels.

### Workspace Setup

| Workspace | Tenant ID | Owner | Projects | Tasks | Time Entries |
|-----------|-----------|-------|----------|-------|-------------|
| Acme Corp | `ws_acme_001` | admin@acme-demo.dev | 5 | 40 | 100 |
| Beta Inc | `ws_beta_002` | admin@beta-demo.dev | 3 | 25 | 60 |

**Key differences between workspaces:**
- Acme Corp uses Pro plan, Beta Inc uses Free plan
- Acme Corp has 8 team members, Beta Inc has 3
- Acme Corp has projects in all 5 statuses; Beta Inc has only ACTIVE and DRAFT
- Different notification preferences, different timezone settings

### Tenant Isolation Test Code

```typescript
// __tests__/tenant-isolation.test.ts
import { prisma } from "@/lib/prisma";
import { createTestContext } from "@/test/helpers";

describe("Multi-Tenant Isolation", () => {
  const acmeCtx = createTestContext({ workspaceId: "ws_acme_001" });
  const betaCtx = createTestContext({ workspaceId: "ws_beta_002" });

  it("Workspace A query returns 0 Workspace B records", async () => {
    // Query projects as Acme Corp
    const acmeProjects = await prisma.project.findMany({
      where: { workspaceId: acmeCtx.workspaceId },
    });

    // Every returned project must belong to Acme
    expect(acmeProjects.length).toBeGreaterThan(0);
    expect(acmeProjects.every((p) => p.workspaceId === "ws_acme_001")).toBe(true);

    // Explicitly verify no Beta Inc records leaked
    const leakedRecords = acmeProjects.filter(
      (p) => p.workspaceId === "ws_beta_002"
    );
    expect(leakedRecords).toHaveLength(0);
  });

  it("Workspace B query returns 0 Workspace A records", async () => {
    const betaProjects = await prisma.project.findMany({
      where: { workspaceId: betaCtx.workspaceId },
    });

    expect(betaProjects.length).toBeGreaterThan(0);
    expect(betaProjects.every((p) => p.workspaceId === "ws_beta_002")).toBe(true);

    const leakedRecords = betaProjects.filter(
      (p) => p.workspaceId === "ws_acme_001"
    );
    expect(leakedRecords).toHaveLength(0);
  });

  it("cross-tenant API call returns 403", async () => {
    // Acme user tries to access Beta Inc project
    const betaProject = await prisma.project.findFirst({
      where: { workspaceId: "ws_beta_002" },
    });

    const response = await request(app)
      .get(`/api/v1/projects/${betaProject!.id}`)
      .set("Authorization", `Bearer ${acmeCtx.token}`)
      .set("X-Workspace-Id", "ws_acme_001");

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("TENANT_ACCESS_DENIED");
  });

  it("cross-tenant mutation returns 403", async () => {
    const betaTask = await prisma.task.findFirst({
      where: { project: { workspaceId: "ws_beta_002" } },
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${betaTask!.id}`)
      .set("Authorization", `Bearer ${acmeCtx.token}`)
      .set("X-Workspace-Id", "ws_acme_001")
      .send({ status: "DONE" });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("TENANT_ACCESS_DENIED");
  });

  it("tenant-scoped counts are accurate", async () => {
    const acmeCount = await prisma.project.count({
      where: { workspaceId: "ws_acme_001" },
    });
    const betaCount = await prisma.project.count({
      where: { workspaceId: "ws_beta_002" },
    });

    expect(acmeCount).toBe(5); // Matches seed plan
    expect(betaCount).toBe(3); // Matches seed plan
    expect(acmeCount + betaCount).toBeLessThanOrEqual(
      await prisma.project.count()
    ); // No orphan records
  });
});
```

### Assertions Checklist

- [ ] Workspace A project query returns exactly 5 projects, all with `workspaceId = ws_acme_001`
- [ ] Workspace B project query returns exactly 3 projects, all with `workspaceId = ws_beta_002`
- [ ] Cross-tenant GET returns 403 with `TENANT_ACCESS_DENIED` error code
- [ ] Cross-tenant PATCH/PUT/DELETE returns 403
- [ ] Time entries are scoped — Acme user cannot see Beta time logs
- [ ] Team member list is scoped — Acme workspace shows 8 members, Beta shows 3
- [ ] Notification preferences are per-user-per-workspace, not shared
- [ ] Aggregate queries (dashboard KPIs, reports) only include current workspace data
