# AI Agent Orchestration Guide

> How to split work across multiple AI agents for parallel development on {{PROJECT_NAME}}. Covers task splitting, safety classification, merge conflict prevention, and agent prompt templates.

---

## Work Splitting Strategies

### By Track (Recommended for Most Projects)

| Track | Scope | Agent Focus | Typical Files |
|-------|-------|-------------|---------------|
| Backend | APIs, DB, auth, business logic | Endpoints, services, migrations, server tests | `src/api/`, `src/lib/`, `prisma/` |
| Frontend | UI, forms, state, client logic | Pages, components, hooks, E2E tests | `src/app/`, `src/components/`, `src/hooks/` |
| Mobile | Native screens, platform APIs | Screens, navigation, native modules | `mobile/`, `apps/mobile/` |
| Infrastructure | CI/CD, deploy, monitoring | Config files, scripts, Docker | `.github/`, `infra/`, `docker/` |

### By Service (For {{EXPECTED_SERVICE_COUNT}}+ Services)

Each agent owns one service end-to-end (DB schema, API, UI, tests). Works well when services have minimal cross-dependencies.

### By Layer (For Complex Features)

Split a single feature across layers: one agent does the DB migration + API endpoint, another builds the UI after the API contract is defined. Requires an API contract handoff.

---

## Task Safety Classification

| Risk Level | Criteria | Agent Mode | Examples |
|------------|----------|------------|---------|
| **Low** | Well-specified, isolated, reversible, has tests | Unsupervised — review output after | CRUD endpoints, unit tests, UI components with clear specs, config changes |
| **Medium** | Complex logic, touches shared code, performance-sensitive | Review after completion, before merge | Business rule implementation, state management, query optimization, refactoring |
| **High** | Security, billing, clinical data, data migrations, auth | Pair with human — review during, not just after | Payment processing, role/permission changes, PHI handling, production data migrations, auth flows |

**Rule:** When in doubt, classify one level higher. A 5-minute review is cheaper than a production incident.

---

## Merge Conflict Prevention

### Shared Files (Coordinate Before Touching)

These files are modified by multiple tracks and cause the most merge conflicts:

| File Pattern | Why It's Shared | Coordination Rule |
|-------------|-----------------|-------------------|
| `schema.prisma` / `models.py` | All tracks add models | One agent owns schema changes per sprint; others request via comments |
| `src/lib/types.ts` | Shared type definitions | Lock file during modification; use module-scoped type files when possible |
| Route definitions (`routes/`, `app/`) | Backend + frontend both touch | Backend defines routes first; frontend consumes |
| `.env.example` | New features add env vars | Append-only; never reorder |
| `package.json` | Dependency additions | One agent installs at a time; use `--save-exact` |
| Navigation config | Frontend + mobile both modify | Frontend owns; mobile syncs after |

### Coordination Rules

1. **Define API contracts first.** Backend agent writes the OpenAPI spec or type definition before frontend agent starts.
2. **Use feature branches per agent.** Never have two agents working on the same branch.
3. **Merge to a shared integration branch** (e.g., `develop`) frequently — at least daily.
4. **File locks:** If two agents need the same file, one goes first. Use STATUS.md to track who owns what.

---

## Agent Review Protocol

### Reviewing Agent Output Efficiently

1. **Start with tests.** If the agent wrote tests and they pass, the output is likely correct. Run them first.
2. **Check the diff, not the full file.** Use `git diff` to see only what changed.
3. **Verify edge cases.** Agents handle happy paths well but often miss: empty states, error handling, loading states, permission checks, pagination boundaries.
4. **Check for hallucinated imports.** Agents sometimes import functions or packages that don't exist in the project.
5. **Run the linter.** Catches style issues and unused imports without manual scanning.

### Review Checklist

- [ ] Tests pass (`{{TEST_COMMAND}}`)
- [ ] Linter passes (`{{LINT_COMMAND}}`)
- [ ] Type-check passes (`{{TYPECHECK_COMMAND}}`)
- [ ] No hallucinated imports or APIs
- [ ] Error handling present (not just happy path)
- [ ] No hardcoded values that should be env vars or constants
- [ ] No sensitive data in logs or responses

---

## Agent Prompt Templates

### Implement Endpoint

```
Context: Read these files first: [schema file], [existing similar endpoint], [relevant types].

Task: Implement a {{METHOD}} endpoint at {{PATH}} that:
- Accepts: [describe input shape]
- Returns: [describe output shape]
- Auth: [required role or public]
- Validation: [list rules]
- Error cases: [list expected errors with HTTP codes]

Write the endpoint and its unit tests. Follow the patterns in [existing endpoint file].
Do not modify any files outside of [allowed directories].
```

### Build Component

```
Context: Read: [design system file], [similar component], [API endpoint it consumes].
Task: Build {{COMPONENT_NAME}} that fetches from [endpoint], displays [UI], handles loading/empty/error states.
Follow patterns in [existing component]. Use {{CSS_FRAMEWORK}}. Don't create new utilities.
```

### Write Tests

```
Context: Read: [file to test], [existing test file], [test utilities].
Task: Write tests for [file path]. Cover: happy path, validation errors, edge cases.
Mock: [list]. Test behavior, not implementation. Use patterns from [existing test file].
```

### Fix Bug

```
Context: Read: [file with bug], [related files], [test file].
Bug: [what happens vs what should happen]. Reproduction: [steps or failing test].
Task: Write failing test, fix bug, verify test passes, grep for same pattern elsewhere.
```

---

## Parallel Execution with Worktrees

```bash
# Create isolated worktrees per agent
git worktree add ../{{PROJECT_SLUG}}-backend feat/backend-sprint-1
git worktree add ../{{PROJECT_SLUG}}-frontend feat/frontend-sprint-1
# Each agent works in its own directory — no branch conflicts
# Merge both into integration branch when done, then remove worktrees
```

---

## Good vs Bad Task Descriptions

### Bad (Vague, Unbounded)

> "Build the user management system."

- No scope boundaries, no specific files, no acceptance criteria. Agent will make assumptions about every detail.

### Good (Specific, Bounded, Contextual)

> "Implement the POST /api/users/invite endpoint. It should accept `{ email, role }`, check that the sender has admin role, create an invitation record in the `invitations` table, and return `{ id, token, expiresAt }`. Follow the pattern in `src/api/organizations/route.ts`. Write tests covering: successful invite, duplicate email, non-admin sender (403), invalid role value."

- Exact scope, input/output shapes, error cases, reference file, test requirements.
