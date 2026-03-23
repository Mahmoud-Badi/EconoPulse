# Developer Onboarding Guide — {{PROJECT_NAME}}

> **Purpose:** Get a new developer from zero to productive in one day. Follow this guide sequentially — every step depends on the previous one.

---

## 1. Prerequisites Checklist

Before cloning the repo, verify these are installed:

| Tool | Required Version | Check Command |
|------|-----------------|---------------|
| Git | 2.40+ | `git --version` |
| Node.js | 20+ | `node --version` |
<!-- IF {{STACK}} == "javascript" -->
| {{PKG_MANAGER}} | Latest | `{{PKG_MANAGER}} --version` |
<!-- ENDIF -->
<!-- IF {{STACK}} == "python" -->
| Python | 3.11+ | `python --version` |
| Poetry / pip | Latest | `poetry --version` or `pip --version` |
<!-- ENDIF -->
<!-- IF {{STACK}} == "ruby" -->
| Ruby | 3.2+ | `ruby --version` |
| Bundler | Latest | `bundle --version` |
<!-- ENDIF -->
<!-- IF {{STACK}} == "go" -->
| Go | 1.21+ | `go version` |
<!-- ENDIF -->
| Docker | 24+ | `docker --version` |
| Docker Compose | 2.20+ | `docker compose version` |

### Access Requests

- [ ] GitHub repository access (push permissions)
- [ ] Database credentials (or local Docker setup)
- [ ] Third-party API keys (copy from `.env.example`)
- [ ] Vercel / hosting platform access (if deploying)
- [ ] Communication channels (Slack, Discord, etc.)

---

## 2. Repository Setup

```bash
# Clone
git clone {{REPO_URL}}
cd {{PROJECT_SLUG}}

# Install dependencies
{{PKG_MANAGER}} install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your local values (database URL, API keys, etc.)

# Start database
docker compose up -d

# Run migrations
{{MIGRATE_CMD}}

# Seed the database with test data
{{SEED_CMD}}

# Verify the build
{{BUILD_CMD}}

# Run tests to confirm everything works
{{TEST_CMD}}
```

### Verify Setup

After all commands succeed, confirm:

- [ ] `{{DEV_CMD}}` starts the dev server without errors
- [ ] Frontend loads at `http://localhost:{{FRONTEND_PORT}}`
<!-- IF {{BACKEND_FRAMEWORK}} != "none" -->
- [ ] Backend responds at `http://localhost:{{BACKEND_PORT}}{{API_PREFIX}}/health`
<!-- ENDIF -->
- [ ] You can log in with a seeded test user
- [ ] Tests pass: `{{TEST_CMD}}`

---

## 3. Architecture Overview

### Folder Structure

<!-- IF {{MONOREPO}} == "true" -->
```
{{PROJECT_SLUG}}/
├── apps/
│   ├── web/              # Frontend ({{FRONTEND_FRAMEWORK}})
│   └── api/              # Backend ({{BACKEND_FRAMEWORK}})
├── packages/
│   ├── ui/               # Shared UI components
│   ├── validators/       # Shared Zod/validation schemas
│   ├── types/            # Shared TypeScript types
│   └── auth/             # Auth configuration
├── dev_docs/             # Development documentation
├── user_docs/            # User-facing documentation
└── CLAUDE.md             # AI agent context
```
<!-- ENDIF -->

<!-- IF {{MONOREPO}} == "false" -->
```
{{PROJECT_SLUG}}/
├── src/                  # Application source
├── tests/                # Test files
├── dev_docs/             # Development documentation
├── user_docs/            # User-facing documentation
└── CLAUDE.md             # AI agent context
```
<!-- ENDIF -->

### Key Abstractions

| Concept | Location | Purpose |
|---------|----------|---------|
| Services | `{{BACKEND_SRC}}/services/` | Business logic, one file per domain |
| Routers/Controllers | `{{BACKEND_SRC}}/routers/` | HTTP layer, input validation, response formatting |
| Components | `{{COMPONENT_LIBRARY_PATH}}/` | Reusable UI components |
| Pages/Routes | `{{FRONTEND_APP_PATH}}/` | Page-level components with data fetching |
| Validators | `{{SHARED_PACKAGES_PATH}}/validators/` | Shared validation schemas (Zod) |

### Naming Conventions

- Files: `kebab-case.ts` (e.g., `project-list.tsx`, `create-task.ts`)
- Components: `PascalCase` (e.g., `ProjectCard`, `TaskForm`)
- Functions: `camelCase` (e.g., `getProjectById`, `createTask`)
- Database tables: `snake_case` (e.g., `user_profiles`, `task_comments`)
- API routes: `kebab-case` (e.g., `/api/v1/project-tasks`)

---

## 4. Development Workflow

### Branching Strategy

```
main ← production-ready code
  └── feature/TASK-ID-short-description  ← your work branch
```

1. Pull latest: `git pull origin main`
2. Create branch: `git checkout -b feature/TASK-042-add-project-filter`
3. Make changes, commit often with descriptive messages
4. Push: `git push -u origin feature/TASK-042-add-project-filter`
5. Open a Pull Request against `main`
6. Address review feedback
7. Merge after approval + CI passes

### Commit Message Format

```
type(scope): short description

[optional body explaining why]
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`

Examples:
- `feat(projects): add filtering by status and assignee`
- `fix(auth): handle expired session redirect correctly`
- `test(tasks): add unit tests for task validation`

---

## 5. Key Files to Read First

Read these in order — they give you the full project context in under 30 minutes:

| Priority | File | What You'll Learn |
|----------|------|-------------------|
| 1 | `CLAUDE.md` | Architecture, patterns, rules, workflow |
| 2 | `{{STATUS_FILE_PATH}}` | Current phase, active tasks, progress |
| 3 | `dev_docs/foundations/session-kickoff.md` | How sessions work |
| 4 | `dev_docs/project-overview.md` | What the project is, who it's for |
| 5 | `dev_docs/system-architecture.md` | Technical architecture decisions |

---

## 6. Running the Application

### Essential Commands

| Command | What It Does |
|---------|-------------|
| `{{DEV_CMD}}` | Start all dev servers |
| `{{BUILD_CMD}}` | Production build |
| `{{TEST_CMD}}` | Run all tests |
| `{{LINT_CMD}}` | Lint the codebase |
| `{{TYPE_CHECK_CMD}}` | TypeScript type checking |
| `{{MIGRATE_CMD}}` | Run database migrations |
| `{{SEED_CMD}}` | Reset and seed database |
| `{{E2E_CMD}}` | Run end-to-end tests |

### Common Development Scenarios

**Reset your local database:**
```bash
docker compose down -v && docker compose up -d
{{MIGRATE_CMD}}
{{SEED_CMD}}
```

**Update dependencies after pulling:**
```bash
git pull origin main
{{PKG_MANAGER}} install
{{MIGRATE_CMD}}
```

---

## 7. Common Tasks Walkthrough

### Add a New API Endpoint

1. Read the service spec in `dev_docs/services/`
2. Add validation schema in `{{SHARED_PACKAGES_PATH}}/validators/`
3. Add the database query in `{{BACKEND_SRC}}/services/`
4. Add the route handler in `{{BACKEND_SRC}}/routers/`
5. Add tests for the validator and route
6. Run `{{TEST_CMD}}` to verify

### Add a New Page

1. Read the screen spec in `dev_docs/screens/`
2. Create the page file in `{{FRONTEND_APP_PATH}}/`
3. Add data fetching (API calls or server components)
4. Build the UI using components from `{{COMPONENT_LIBRARY_PATH}}/`
5. Add navigation link if applicable
6. Run `{{E2E_CMD}}` for the new page

### Add a New Component

1. Create the component file in `{{COMPONENT_LIBRARY_PATH}}/`
2. Follow existing component patterns (props interface, default export)
3. Add to Storybook if it's a reusable component
4. Write unit tests for interaction and rendering

---

## 8. AI Agent Integration

This project uses Claude Code for AI-assisted development.

### Session Workflow

```
/session-start     → Reads STATUS.md + handoff.md, reports current state
/phase-check       → Shows remaining tasks and health status
[do your work]
/session-end       → Updates STATUS.md, handoff.md, DEVLOG.md
```

### Useful Commands

| Command | When to Use |
|---------|------------|
| `/kickoff` | Start of every coding session |
| `/scaffold-api` | Creating a new API endpoint |
| `/scaffold-component` | Creating a new UI component |
| `/scaffold-page` | Creating a new page |
| `/scaffold-test` | Creating test files |
| `/quality-gate` | Before finishing a phase |
| `/document-feature` | After completing a feature |
| `/preflight` | Before committing code |

### Important Rules for AI Sessions

- One feature at a time, fully complete before starting the next
- Always run `/preflight` before committing
- Never manually edit STATUS.md or handoff.md — use the commands
- When Claude suggests code changes, review them before accepting

---

## 9. Troubleshooting

### Build Fails After Pull

```bash
# Clear caches and reinstall
rm -rf node_modules .next .turbo
{{PKG_MANAGER}} install
{{BUILD_CMD}}
```

### Database Connection Refused

```bash
# Check Docker is running
docker compose ps
# Restart if needed
docker compose down && docker compose up -d
# Wait 5 seconds for DB to initialize, then retry
```

### Tests Failing on Fresh Clone

```bash
# Ensure database is seeded
{{SEED_CMD}}
# Ensure env vars are set
cp .env.example .env.local
# Run tests
{{TEST_CMD}}
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :{{FRONTEND_PORT}}
# Kill the process or change the port in .env.local
```

### Type Errors After Dependency Update

```bash
# Regenerate types
{{TYPE_GEN_CMD}}
# Then check
{{TYPE_CHECK_CMD}}
```

---

## 10. Team Contacts & Resources

| Resource | Location |
|----------|----------|
| Project documentation | `dev_docs/` |
| Task board | `{{STATUS_FILE_PATH}}` |
| API documentation | `http://localhost:{{BACKEND_PORT}}{{API_DOCS_URL}}` |
| Design specs | `{{DESIGN_SPECS_PATH}}/` |
| User documentation | `user_docs/` |

### Getting Help

1. Check the gotcha guides in `13-lessons-gotchas/` for your specific technology
2. Search existing DEVLOG entries for similar issues
3. Ask the team in the project's communication channel
4. Check the project's CLAUDE.md for architecture decisions and patterns

---

*Generated by the Master Starter Kit. Last updated: {{START_DATE}}.*
