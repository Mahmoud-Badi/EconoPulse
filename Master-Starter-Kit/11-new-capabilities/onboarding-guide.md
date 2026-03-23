# Developer Onboarding Guide

> Everything a new developer needs to go from zero to productive on {{PROJECT_NAME}}. Target: first meaningful commit within the first day.

---

## Onboarding Checklist

### Day 1 — Environment and Access
- [ ] Clone the repository: `git clone {{REPO_URL}}`
- [ ] Install prerequisites (see Environment Setup below)
- [ ] Get access to: GitHub org, deployment dashboard, error monitoring, communication channels
- [ ] Copy `.env.example` to `.env.local` and fill in values (ask {{ONBOARDING_CONTACT}} for secrets)
- [ ] Run the project locally and verify the home page loads
- [ ] Run the test suite and verify it passes
- [ ] Read this onboarding guide fully

### Day 2 — Codebase Orientation
- [ ] Complete the codebase tour (see below)
- [ ] Read the architecture overview in `docs/architecture.md`
- [ ] Read `CONVENTIONS.md` for coding standards
- [ ] Review the last 10 merged PRs to understand team patterns
- [ ] Pick your first task from the "First 5 Tasks" list

### Days 3-5 — First Contributions
- [ ] Complete your first task and open a PR
- [ ] Participate in at least one code review (as reviewer)
- [ ] Pair with {{PAIR_PARTNER}} on a feature or bug
- [ ] Ask at least 3 questions — there are no silly questions during onboarding

---

## Development Environment Setup

### Prerequisites
| Tool | Version | Install |
|------|---------|---------|
| Node.js | {{NODE_VERSION, e.g., 20.x LTS}} | `nvm install {{NODE_VERSION}}` or download from nodejs.org |
| npm/pnpm | {{PACKAGE_MANAGER_VERSION}} | Comes with Node / `npm install -g pnpm` |
| Git | 2.40+ | `git --version` to check |
| {{DATABASE}} | {{DB_VERSION}} | Docker recommended: see below |
| {{OTHER_TOOL}} | {{VERSION}} | {{INSTALL_INSTRUCTIONS}} |

### Setup Steps

```bash
# 1. Clone and enter the project
git clone {{REPO_URL}}
cd {{PROJECT_NAME}}

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local — ask the team for any secret values

# 4. Set up the database (if applicable)
docker compose up -d          # Start local database
npm run db:migrate             # Run migrations
npm run db:seed                # Load seed data

# 5. Start the dev server
npm run dev
# Open http://localhost:{{PORT}} — you should see the home page

# 6. Verify tests pass
npm test
```

If any step fails, check the Common Gotchas section below before asking for help.

---

## Codebase Tour

Walk through the project in this order. Spend 5-10 minutes on each section.

| Order | Location | What to Look At |
|-------|----------|----------------|
| 1 | `package.json` | Scripts, dependencies, project metadata |
| 2 | `{{CONFIG_FILES, e.g., next.config.ts, tsconfig.json}}` | Framework and compiler configuration |
| 3 | `src/app/` (or `src/pages/`) | Route structure — how URLs map to files |
| 4 | `src/components/` | Shared UI components — pick 2-3 and read them |
| 5 | `src/lib/` or `src/utils/` | Shared utilities, API clients, database connections |
| 6 | `src/hooks/` | Custom React hooks — read the most-used one |
| 7 | `{{API_DIRECTORY, e.g., src/app/api/}}` | API routes — trace one request end-to-end |
| 8 | `tests/` or `__tests__/` | Test structure, fixtures, helpers |
| 9 | `docs/` | Architecture docs, ADRs, conventions |
| 10 | `.github/` or CI config | CI/CD pipeline, PR templates, workflows |

---

## First 5 Tasks

These are intentionally small, designed to build familiarity with different parts of the codebase:

1. **Documentation fix** — Find a typo, outdated instruction, or missing detail in any doc and fix it. Teaches: git workflow, PR process.
2. **Add a test** — Find an untested utility function and write a test for it. Teaches: test framework, project conventions.
3. **Small UI tweak** — Adjust spacing, fix a color, or improve a label. Teaches: component structure, styling approach.
4. **Bug fix** — Pick a small bug from the issue tracker labeled `good-first-issue`. Teaches: debugging, issue workflow.
5. **Small feature** — Add a minor enhancement (tooltip, loading state, form validation). Teaches: feature development end-to-end.

---

## Key Contacts

| Role | Person | Contact | Ask About |
|------|--------|---------|-----------|
| Onboarding buddy | {{NAME}} | {{CONTACT}} | Anything during your first week |
| Tech lead | {{NAME}} | {{CONTACT}} | Architecture decisions, PR reviews |
| Product owner | {{NAME}} | {{CONTACT}} | Requirements, priorities, user context |
| DevOps/Infrastructure | {{NAME}} | {{CONTACT}} | Deployment, environments, CI/CD |

**Escalation path:** Onboarding buddy -> Tech lead -> {{ESCALATION_CONTACT}}

---

## Communication Norms

- **PR reviews:** Expected response within {{REVIEW_SLA, e.g., 4 business hours}}
- **Questions:** Post in {{CHANNEL, e.g., #dev-questions}} — no DMs for technical questions (others benefit from the answer)
- **Standups:** {{STANDUP_SCHEDULE, e.g., async in Slack by 10am, or daily sync at 9:30am}}
- **Blockers:** Raise immediately, do not wait for standup
- **Code review etiquette:** Comment on the code, not the person. Prefix suggestions with "nit:" if non-blocking

---

## Architecture Overview (Simplified)

```
{{ARCHITECTURE_SUMMARY}}

Example:
User Browser
    |
    v
Next.js App (Vercel) ---- API Routes ---- PostgreSQL (Supabase)
    |                                          |
    v                                          v
React Components                         Row Level Security
    |
    v
Tailwind CSS + shadcn/ui
```

**Key architectural decisions:**
- {{DECISION_1, e.g., "Server Components by default, Client Components only when interactivity needed"}}
- {{DECISION_2, e.g., "All data fetching through server actions, no client-side API calls"}}
- {{DECISION_3, e.g., "Feature-based folder structure inside src/features/"}}

For the full architecture spec, see `docs/architecture.md`.

---

## Common Gotchas

| Problem | Cause | Fix |
|---------|-------|-----|
| `npm install` fails | Wrong Node version | Run `nvm use` or install the version in `.nvmrc` |
| `.env.local` missing variables | Template may be outdated | Compare `.env.example` with what the app actually reads in `src/lib/env.ts` |
| Database connection refused | Docker not running | `docker compose up -d`, then wait 5 seconds |
| Tests fail on fresh clone | Missing seed data | Run `npm run db:seed` |
| Hot reload not working | File outside `src/` | Only files inside `src/` trigger hot reload |
| TypeScript errors in IDE | Stale types | Restart TS server: Cmd+Shift+P > "TypeScript: Restart TS Server" |
| Port already in use | Previous dev server running | Kill it: `lsof -ti:{{PORT}} \| xargs kill` or change port in `.env.local` |

---

## Reading List (In Order)

1. This onboarding guide (you are here)
2. `CONVENTIONS.md` — coding standards and patterns
3. `docs/architecture.md` — full system architecture
4. `docs/adr/` — key architectural decisions and their rationale
5. Framework documentation: {{FRAMEWORK_DOCS_URL}}
6. {{ADDITIONAL_READING}}

---

## First-Week Pair Programming

Schedule 2-3 pair sessions during your first week:

| Session | Topic | Partner | Duration |
|---------|-------|---------|----------|
| 1 | Walk through a recent feature PR | {{PARTNER}} | 45 min |
| 2 | Debug a real issue together | {{PARTNER}} | 60 min |
| 3 | Build a small feature together | {{PARTNER}} | 90 min |

The goal is knowledge transfer, not speed. Ask "why" liberally.
