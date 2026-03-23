# {{PROJECT_NAME}}

> {{ONE_LINE_DESCRIPTION}}

## Quick Commands

```bash
pnpm dev          # Start dev server (all packages)
pnpm build        # Production build
pnpm test         # Run all tests (Vitest)
pnpm typecheck    # TypeScript type checking
pnpm lint         # Lint with {LINTER}
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed database with test data
```

## Custom Skills

### Session Management
- `/session-start` — Read state files, verify build, show current task
- `/session-end` — Update STATUS/DEVLOG/handoff, commit, push

### Scaffolding
- `/scaffold-schema {entity}` — Generate Drizzle schema + relations
- `/scaffold-router {entity}` — Generate tRPC router with CRUD
- `/scaffold-page {route}` — Generate page with loading/error/empty states
- `/scaffold-form {entity}` — Generate react-hook-form with Zod validation
- `/scaffold-component {name}` — Generate component with variants
- `/scaffold-seed {entity}` — Generate seed data file
- `/scaffold-e2e {feature}` — Generate Playwright test skeleton
- `/scaffold-migration` — Generate Drizzle migration after schema changes

### Quality
- `/verify` — Run build + typecheck + tests + lint
- `/design-verify` — Fast code-inspection design checklist
- `/design-review` — Deep Playwright visual audit
- `/feature-checklist` — Verify all layers complete before marking done

### Research & Design
- `/design-research {topic}` — Research UX/UI patterns from real sites
- `/design-generate {screen}` — Full multi-AI design pipeline

## MCP Servers

| Server | Purpose |
|--------|---------|
| {{MCP_1}} | {{PURPOSE}} |
| {{MCP_2}} | {{PURPOSE}} |
| {{MCP_3}} | {{PURPOSE}} |
| {{MCP_4}} | {{PURPOSE}} |

## Architecture

```
{PROJECT_ROOT}/
  apps/
    web/          — Next.js {VERSION} app ({FRAMEWORK_NOTES})
  packages/
    api/          — tRPC routers + procedures
    db/           — Drizzle schema + migrations + seed
    ui/           — Shared components (shadcn/ui base)
    validators/   — Zod schemas (shared between client + server)
    {PACKAGE_N}/  — {PURPOSE}
```

## Workflow

1. **Session start** → `/session-start` (reads STATUS.md, verifies build)
2. **Understand task** → Read implementation spec, check domain rules
3. **Write code (TDD)** → Write test first, then implement, use `/scaffold-*` commands
4. **Bugs** → Systematic debugging (reproduce → isolate → fix → test)
5. **After code** → `/verify` (build + typecheck + tests + lint must all pass)
6. **Before done** → `/design-verify` + `/feature-checklist`
7. **Integration** → Commit with conventional prefix, push
8. **Session end** → `/session-end` (updates STATUS/DEVLOG/handoff)

## State Files

| File | Purpose | Update When |
|------|---------|------------|
| `STATUS.md` | Phase progress, counts, active task | Every task completion |
| `DEVLOG.md` | Session history | Every session end |
| `handoff.md` | What to do next | Every session end |

## Code Rules (Mandatory)

1. **Loading states** — Every async UI shows a skeleton or spinner
2. **Error states** — Every data fetch has an error boundary or error UI
3. **Empty states** — Every list/table handles zero records with a helpful message
4. **Button handlers** — Every button click shows feedback (loading spinner, disabled state)
5. **Form validation** — Every form uses Zod schemas from `validators` package
6. **Error handling** — Every tRPC procedure wraps DB calls in try/catch with proper error codes
7. **Tests** — Every router procedure has at least one happy-path test
8. **Auth middleware** — Every non-public procedure uses `protectedProcedure` or role-specific

## Design Rules

### DO NOT
- Use default shadcn without customization
- Add gradients on section backgrounds
- Use blue-purple "AI aesthetic"
- Put "Welcome back, {name}!" on dashboards
- Use equal-width columns for unequal content
- Use hover-only interactions (must work on touch)
- Show raw database errors to users

### DO
- Use design tokens from `design-tokens.md` for all colors/spacing/shadows
- Add hover AND focus states to every interactive element
- Use real-sounding data in seed files (not Lorem ipsum)
- Show loading skeletons that match content layout
- Use 44px minimum touch targets on mobile
- Apply consistent card shadows (`--shadow-card` / `--shadow-card-hover`)

## Anti-Slop Rules

- No confirmation dialogs for non-destructive actions
- No unnecessary loading spinners (use optimistic updates where safe)
- No "Are you sure?" for reversible operations
- No empty pages without clear CTAs
- No console.log in production code
- No `any` types — use proper TypeScript
- No inline styles — use Tailwind classes or design tokens

## Roles

| Role | Access Level | Key Permissions |
|------|-------------|-----------------|
| {{ROLE_1}} | {{LEVEL}} | {{PERMISSIONS}} |
| {{ROLE_2}} | {{LEVEL}} | {{PERMISSIONS}} |
| {{ROLE_3}} | {{LEVEL}} | {{PERMISSIONS}} |

## Key Decisions

- {{DECISION_1}}: {{RATIONALE}}
- {{DECISION_2}}: {{RATIONALE}}
- {{DECISION_3}}: {{RATIONALE}}
- {{DECISION_4}}: {{RATIONALE}}
- {{DECISION_5}}: {{RATIONALE}}
