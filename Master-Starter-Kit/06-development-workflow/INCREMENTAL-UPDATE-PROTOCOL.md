# Incremental Update Protocol

## Purpose

After the ORCHESTRATOR finishes and development begins, requirements change. This protocol lets you add, modify, or remove services, screens, and features without re-running the entire kit.

## Common Operations

### Add a New Service

Use `/add-service` or follow these manual steps:

1. **Mini-intake** (5 questions):
   - What does this service do?
   - What entities does it manage?
   - What services does it depend on?
   - What depends on it?
   - What screens use it?

2. **Generate artifacts:**
   - Service spec → `dev_docs/specs/services/{name}-spec.md`
   - Service hub → `dev_docs/services/{name}.hub.md`
   - API contracts → `dev_docs/specs/api/{name}/*.md`
   - Task files → `dev_docs/tasks/phase-{N}/{name}/*.md`
   - Database docs → `dev_docs/specs/database/{table}.md`

3. **Update cross-references:**
   - Add row to `dev_docs/completeness/service-matrix.md`
   - Update `dev_docs/STATUS.md` counts
   - Update dependent service hubs (dependency sections)
   - Update or create screen specs

4. **Verify:** Run `/health-check` or `bash scripts/validate-output.sh`

### Split an Existing Service

When a service grows too large and needs to become two services:

1. **Identify the split boundary** — which entities/endpoints move to the new service?
2. **Create the new service** (follow "Add a New Service" above)
3. **Update the original service:**
   - Remove migrated entities from its spec
   - Remove migrated endpoints from its API contracts
   - Add dependency on the new service
   - Update its hub file
4. **Update task files:**
   - Re-assign tasks that belong to the new service
   - Create migration tasks for the split itself
5. **Update screen specs** that reference the original service

### Add a New User Role

1. **Define the role** in `dev_docs/specs/auth/roles.md` (or equivalent)
2. **For each screen spec**, add the role to the access matrix
3. **For each API contract**, add authorization rules for the new role
4. **Create task files** for implementing role-specific features
5. **Update service hubs** that have role-based logic

### Add a New Screen

1. **Generate screen spec** → `dev_docs/specs/screens/{name}.md`
   - Use the screen spec template
   - Must score ≥ 7/10 on depth requirements
2. **Link to services** — update the services this screen calls
3. **Add to screen matrix** → `dev_docs/completeness/screen-matrix.md`
4. **Create task files** for implementation

### Change Tech Stack for a Component

1. **Document the decision** in `dev_docs/decisions/ADR-{N}.md`
2. **Update the relevant service spec(s)** with the new technology
3. **Update infrastructure templates** (Docker, CI/CD)
4. **Create migration task files** if switching mid-development
5. **Update CLAUDE.md** with the new stack information

### Remove a Service

1. **Check dependencies** — which services and screens reference this one?
2. **Update dependents** to remove or replace the dependency
3. **Archive (don't delete)** the service files:
   - Move to `dev_docs/archive/{service-name}/`
   - Keep for reference but mark as deprecated
4. **Update completeness matrices**
5. **Remove or reassign task files**

## Rules

- **Always update cross-references** — orphaned references are worse than missing docs
- **Always update STATUS.md** — counts must stay accurate
- **Use the same quality standards** — new specs must meet depth requirements
- **Document the change** — add an entry to `dev_docs/decisions/` or `dev_docs/CHANGELOG.md`
- **Run validation after changes** — `bash scripts/validate-output.sh`
