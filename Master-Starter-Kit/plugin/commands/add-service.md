---
name: add-service
description: Add a new service to an existing project mid-development. Runs a mini-intake, generates spec, hub, tasks, and updates STATUS.md.
allowed_tools:
  - Agent
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
---

# /add-service — Add a Service to an Existing Project

Add a new service after the initial ORCHESTRATOR run is complete, without re-running the entire kit.

## Protocol

### 1. Read Current State (3 files)

1. **dev_docs/STATUS.md** — current phase, service count, task count
2. **dev_docs/completeness/service-matrix.md** — existing services and their status
3. **ORCHESTRATOR.md STATE BLOCK** — CONFIG object for stack details

### 2. Mini-Intake (5 questions max)

Ask these questions about the new service:

1. **What does this service do?** (one sentence)
2. **What entities does it manage?** (list the database tables/models)
3. **What other services does it depend on?** (from existing service list)
4. **What services depend on it?** (will need updating)
5. **Which screens will use this service?** (new screens needed, or existing screens to modify)

### 3. Generate Artifacts

Using the same templates and quality standards as the ORCHESTRATOR:

1. **Service spec** → `dev_docs/specs/services/{service-name}-spec.md`
   - Use `03-documentation/spec-layer/service-spec-template.md`
   - Must score ≥ 8/10 on depth requirements

2. **Service hub** → `dev_docs/services/{service-name}.hub.md`
   - Use `10-generators/SERVICE-HUB-GENERATOR.md` prompt

3. **API contracts** → `dev_docs/specs/api/{service-name}/*.md`
   - Use `10-generators/API-CATALOG-GENERATOR.md` prompt

4. **Task files** → `dev_docs/tasks/phase-{N}/{service-name}/*.md`
   - Determine correct phase placement from current sprint plan
   - Use `04-phase-planning/feature-phase.template.md`

5. **Database docs** (if new tables) → `dev_docs/specs/database/{table-name}.md`

### 4. Update Existing Files

1. **dev_docs/completeness/service-matrix.md** — add new service row
2. **dev_docs/STATUS.md** — increment service count, add new task checkboxes under the correct phase, update phase task counts and completion percentages
3. **dev_docs/specs/architecture/overview.md** — add service to architecture diagram (if exists)
4. **Dependent service hubs** — update dependency sections of services that interact with the new one
5. **Screen specs** — update or create screen specs that reference this service
6. **dev_docs/tracker/master-tracker.md** (if exists) — add subtask rows (5-15 per task) for all new tasks
7. **dev_docs/tracker/dependency-map.md** (if exists) — add dependency entries for the new service and its tasks
8. **dev_docs/tracker/timeline.md** (if exists) — assign new tasks to appropriate weeks
9. **dev_docs/handoff.md** — note the new service under "Key Decisions" with impact assessment
10. **dev_docs/DEVLOG.md** — append plan change entry: `### [TIMESTAMP] PLAN CHANGE: Added service {service-name}`

Reference: `03-documentation/state-files/PLAN-CHANGE-PROTOCOL.md`

### 5. Verify

Run a mini-completeness check:
- New service has: spec + hub + API contracts + tasks
- Cross-references are valid (screens ↔ service ↔ API contracts)
- No unresolved `{{PLACEHOLDER}}` in generated files
- Depth score ≥ 8/10

### 6. Report

```
SERVICE ADDED
=============
Service: {service-name}
Files generated: {count}
  - Service spec: {path}
  - Service hub: {path}
  - API contracts: {count} endpoints
  - Task files: {count} tasks in Phase {N}
  - Database docs: {count} tables

Updated files: {count}
  - {list of modified files}

New task count: {old} → {new} ({delta} added)
```

## Rules

- **Follow the same quality standards** as the initial ORCHESTRATOR run (depth ≥ 8/10)
- **Do not modify existing service specs** unless the user confirms (dependency updates are OK)
- **Preserve the PROTECT-LIST** — check before modifying any file
- **Update STATE BLOCK** with new service count in CONFIG
