# Backend Development Prompt Template

> Copy and fill this template when delegating backend work to an AI agent.
> The more context you provide, the better the output.

---

## Task: [TASK-ID] -- [Title]

### Context

- **Service:** [service name -- e.g., Carrier Management, Load Management]
- **Module:** [backend module path -- e.g., apps/api/src/carriers/]
- **Related:** [related files -- existing services, entities, DTOs]
- **Contract:** [path to contract file -- e.g., contracts/carriers-list.md]

### Objective

[What to build -- describe the feature, endpoint, or business logic in 2-5 sentences.
Be specific about inputs, outputs, and business rules.]

### Constraints

- **Tenant isolation:** All queries must include `tenantId` -- never leak data across tenants
- **Soft deletes:** Never hard-delete records -- set `deletedAt` timestamp instead
- **API envelope:** Wrap all responses in `{ success, data, message }` format
- **Input validation:** Use DTOs with class-validator decorators on every endpoint
- **Auth guards:** Apply `@UseGuards(JwtAuthGuard, RolesGuard)` with `@Roles(...)` decorator
- **Error handling:** Throw NestJS HTTP exceptions (BadRequestException, NotFoundException, etc.)
- **No `any` types:** Use proper TypeScript types throughout

### Existing Code to Use

> Do NOT rebuild these -- wire into them.

| What | Location | Notes |
|---|---|---|
| Service | `[path to existing service]` | [what methods exist] |
| Module | `[path to existing module]` | [already registered?] |
| Entity/Model | `[path to schema/model]` | [existing fields] |
| Existing tests | `[path to test files]` | [extend these] |

### Acceptance Criteria

[Copy from task file -- each criterion should be a checkable item]

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] Endpoint returns data in standard envelope format
- [ ] Auth guard applied with correct roles
- [ ] Validation on request body using DTOs
- [ ] Tenant isolation enforced (filter by tenantId)
- [ ] Unit tests pass
- [ ] Integration tests pass

### Do NOT

- Do not create new modules if one already exists at the path above
- Do not change the response envelope format
- Do not skip auth guards
- Do not use `any` types
- Do not leave TODO comments without resolution
- Do not hardcode IDs, URLs, or configuration values
