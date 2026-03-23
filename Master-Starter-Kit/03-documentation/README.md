# 03-Documentation: The Architecture-First Documentation Suite

> **Philosophy: "Documentation IS the architecture. Code is just implementation."**

Delta TMS V3 created 181+ documentation files before a single line of production code was written. The result: **zero architectural pivots across 18 phases, 320+ tasks completed with near-zero rework.** This phase generates the complete documentation suite that serves as the single source of truth for the entire project lifecycle.

---

## Why Documentation First?

Most projects fail not from bad code, but from bad communication. Documentation-first development eliminates:

- **Ambiguity** — Every feature, API, and component is specified before implementation
- **Architectural drift** — Decisions are recorded with rationale, preventing "why did we do this?"
- **Context loss** — AI agents and new developers can onboard in minutes, not days
- **Scope creep** — If it's not documented, it's not in scope
- **Rework** — You catch design flaws in docs (cheap) instead of code (expensive)

## Documentation Categories

### 1. State Files (`state-files/`)
The project's living memory. Updated every session, read at every session start.

| File | Purpose | Update Frequency |
|------|---------|-----------------|
| `STATUS.md` | Phase progress, counts, active task | Every task completion |
| `DEVLOG.md` | Session history, what was built | Every session end |
| `CLAUDE.md` | AI context — how to work on this project | When workflow changes |
| `handoff.md` | Session continuity — what to do next | Every session end |

### 2. Architecture Docs (`architecture-docs/`)
System-wide patterns that apply everywhere. Write once, reference forever.

| File | Purpose |
|------|---------|
| `overview.md` | What the project is, tech stack, monorepo map |
| `error-handling.md` | Error codes, toasts, retries, boundaries |
| `state-management.md` | Decision tree: TanStack Query vs Zustand vs useState |
| `form-patterns.md` | react-hook-form + Zod, field mapping, money handling |
| `realtime-patterns.md` | SSE/WebSocket patterns with full code examples |

### 3. Database Docs (`database-docs/`)
Schema is the foundation. Document it thoroughly.

| File | Purpose |
|------|---------|
| `schema-overview.md` | Full schema map, domains, relationships, enums |
| `seed-data-spec.md` | Seed data quantities, distributions, faker patterns |
| `table-doc.md` | Per-table template (create one per table) |

### 4. API Docs (`api-docs/`)
Every procedure specified before implementation.

| File | Purpose |
|------|---------|
| `router-catalog.md` | Master index of all routers and procedures |
| `middleware.md` | Auth tiers, rate limiting, error formatting |
| `router-spec.md` | Per-router template (create one per router) |

### 5. Feature Docs (`feature-docs/`)
The most detailed specs. One per feature.

| File | Purpose |
|------|---------|
| `implementation-spec.md` | Full engineering spec: stories, data, API, UI, tests |
| `domain-rules.md` | Business rules, state machines, compliance |

### 6. Design Docs (`design-docs/`)
Visual identity and component specifications.

| File | Purpose |
|------|---------|
| `brand-guidelines.md` | Colors, typography, tone, personality |
| `design-tokens.md` | CSS custom properties + Tailwind 4 @theme tokens |
| `anti-slop-rules.md` | Design anti-patterns to avoid |
| `reference-designs.md` | Visual targets per screen type |
| `component-library-spec.md` | Component catalog with variants and states |
| `screen-catalog-spec.md` | Page specs with data requirements |

### 7. Testing Docs (`testing-docs/`)
Test strategy defined before tests are written.

| File | Purpose |
|------|---------|
| `e2e-scenarios.md` | End-to-end test inventory per feature |
| `test-patterns.md` | Unit/integration test code patterns |

---

## Creation Order

Documentation should be created in this specific order, as later docs depend on earlier ones:

```
Step 1: State Files (STATUS + DEVLOG + CLAUDE.md + handoff)
   ↓    These are the project's operating system
Step 2: Architecture Docs (overview → error handling → state → forms → realtime)
   ↓    These establish system-wide patterns
Step 3: Database Docs (schema overview → table docs → seed spec)
   ↓    Schema drives everything else
Step 4: API Docs (middleware → router catalog → router specs)
   ↓    APIs depend on schema
Step 5: Feature Docs (domain rules → implementation specs)
   ↓    Features combine schema + API + UI
Step 6: Design Docs (brand → tokens → anti-slop → reference → components → screens)
   ↓    Design applies to all features
Step 7: Testing Docs (patterns → E2E scenarios)
         Tests verify everything above
```

## How to Use These Templates

### For a New Project

1. Copy this entire `03-documentation/` folder into your project
2. For each `.template.md` file:
   - Copy it, removing the `.template` suffix
   - Replace all `{PLACEHOLDER}` markers with project-specific content
   - Use Discovery phase outputs (`00-discovery/`) for business context
   - Use Architecture phase outputs (`02-architecture/`) for technical decisions
3. For per-entity templates (`table-doc`, `router-spec`, `implementation-spec`, `domain-rules`):
   - Create one copy per entity/feature
   - Name them: `{entity-name}.md` (e.g., `trips.md`, `drivers.md`)

### For AI-Assisted Development

The documentation suite is designed to work with Claude Code and similar AI agents:

- **CLAUDE.md** tells the AI how to work on the project (commands, rules, workflow)
- **STATUS.md** tells the AI where the project stands (current phase, active task)
- **handoff.md** tells the AI what to do next (specific file + command)
- **Implementation specs** give the AI complete context for any feature

### Document Counts by Project Size

| Project Size | Tables | Routers | Features | Total Docs |
|-------------|--------|---------|----------|------------|
| Small (MVP) | 5-10 | 3-5 | 5-8 | 30-50 |
| Medium | 10-25 | 5-12 | 10-20 | 60-120 |
| Large (V3) | 25-50 | 12-25 | 20-40 | 120-200+ |

---

## Quality Checklist

Before moving to Phase Planning (`04-phase-planning/`), verify:

- [ ] All state files created and initialized
- [ ] Architecture docs cover every cross-cutting concern
- [ ] Every database table has a table doc
- [ ] Every router has a router spec
- [ ] Every feature has an implementation spec
- [ ] Domain rules documented for every stateful entity
- [ ] Design tokens defined and anti-slop rules written
- [ ] E2E scenarios cover all critical paths
- [ ] All `{PLACEHOLDER}` markers replaced with real content
- [ ] CLAUDE.md is under 120 lines (lean is better)
- [ ] STATUS.md has accurate phase/task counts

**Total templates in this folder: 22 files (1 README + 4 state + 5 architecture + 3 database + 3 API + 2 feature + 6 design + 2 testing)**
