# 02 - Architecture Planning

## Purpose

This phase transforms the tribunal's VERDICT.md into a complete technical architecture. Every technology choice, data model, API surface, auth strategy, and UI structure gets designed here — before a single line of application code is written.

**Input:** `00-discovery/VERDICT.md` (the tribunal's final decision document)
**Output:** `ARCHITECTURE/` folder containing all technical design documents

---

## How Claude Uses This Folder

After the tribunal produces a VERDICT.md, Claude reads this README and executes the architecture design pipeline. The process is deterministic:

1. **Read the VERDICT** — Extract project requirements, domain entities, user roles, scale expectations, and constraints
2. **Walk the decision tree** — Use `tech-stack-decision-tree.md` to select every technology. Log each choice in `decisions-log.template.md`
3. **Design the structure** — Fill in `monorepo-structure.template.md` based on chosen stack
4. **Design the database** — Follow `database-design.md` rules, fill one `database-schema.template.md` per domain
5. **Design the API** — Follow `api-design.md` patterns, fill one `api-router.template.md` per domain
6. **Design auth** — Use `auth-design.md` to select provider, fill `auth-roles.template.md` for all roles
7. **Plan real-time** — Evaluate `realtime-strategy.md`, decide if needed and which approach
8. **Catalog screens** — Fill `screen-catalog.template.md` with every page by role
9. **Plan components** — Fill `component-library.template.md` with foundation + domain components
10. **Plan integrations** — Fill one `integration-planning.template.md` per external service
11. **Plan seed data** — Fill `seed-data-plan.template.md` for realistic development data
12. **Finalize decisions** — Review `decisions-log.template.md` for completeness and conflicts

---

## Output Folder Structure

After this phase completes, the project should have:

```
ARCHITECTURE/
  decisions-log.md              # Every tech choice recorded (from template)
  tech-stack.md                 # Final stack selections with rationale
  monorepo-structure.md         # Package layout (from template)

  database/
    design-rules.md             # Schema conventions (from database-design.md)
    schema-{domain}.md          # One per domain (from template)
    seed-data-plan.md           # Seed strategy (from template)
    er-diagram.md               # Entity-relationship diagram (generated)

  api/
    design-rules.md             # API conventions (from api-design.md)
    router-{domain}.md          # One per domain router (from template)

  auth/
    auth-design.md              # Provider selection + config (from auth-design.md)
    roles-permissions.md        # RBAC matrix (from template)

  realtime/
    strategy.md                 # Real-time approach (from realtime-strategy.md)

  ui/
    screen-catalog.md           # All pages by role (from template)
    component-library.md        # Component inventory (from template)

  integrations/
    integration-{service}.md    # One per external service (from template)
```

---

## Rules

### Decision Finality
Every decision recorded in `decisions-log.md` is **final** for the architecture phase. If a decision needs to change later (during development), it requires a formal `DECISION-UPDATE` entry with:
- The original decision
- What changed and why
- Impact analysis on existing work
- Migration steps if code already exists

### No Premature Optimization
Choose the simplest option that meets the VERDICT requirements. The decision tree has "When to deviate" conditions — only deviate when those conditions are met.

### Template Discipline
Every template file has `{PLACEHOLDERS}` in curly braces. Claude must replace ALL placeholders with project-specific values. No placeholder should survive into the output ARCHITECTURE folder.

### Completeness Check
Before finalizing, verify:
- [ ] Every domain entity from VERDICT has a database schema
- [ ] Every domain has an API router spec
- [ ] Every user role has a screen catalog entry
- [ ] Every external service has an integration plan
- [ ] Every decision has a log entry
- [ ] Seed data covers every table
- [ ] Component library covers every screen's needs

---

## File Manifest

| # | File | Type | Purpose |
|---|------|------|---------|
| 1 | `README.md` | Guide | This file — orchestrates the architecture phase |
| 2 | `tech-stack-decision-tree.md` | Guide | 10-node decision tree for all tech choices |
| 3 | `monorepo-structure.template.md` | Template | Package topology and dependency graph |
| 4 | `database-design.md` | Guide | Schema conventions and patterns |
| 5 | `database-schema.template.md` | Template | Per-domain schema specification |
| 6 | `api-design.md` | Guide | API layer patterns and conventions |
| 7 | `api-router.template.md` | Template | Per-router procedure specification |
| 8 | `auth-design.md` | Guide | Auth provider selection and patterns |
| 9 | `auth-roles.template.md` | Template | Role hierarchy and permissions matrix |
| 10 | `realtime-strategy.md` | Guide | Real-time approach decision guide |
| 11 | `screen-catalog.template.md` | Template | All pages indexed by role |
| 12 | `component-library.template.md` | Template | Component inventory and classification |
| 13 | `integration-planning.template.md` | Template | External service integration specs |
| 14 | `seed-data-plan.template.md` | Template | Seed data design and orchestration |
| 15 | `decisions-log.template.md` | Template | Architecture Decision Records |

---

## Timing

This phase typically takes 1-2 Claude sessions for a medium-complexity project (10-20 domains, 3-5 user roles, 5-10 integrations). For simpler projects (MVP, single role), it can complete in a single session.

Do NOT skip this phase. The architecture documents become the source of truth for every development phase that follows. Changing architecture mid-development is 10x more expensive than getting it right here.
