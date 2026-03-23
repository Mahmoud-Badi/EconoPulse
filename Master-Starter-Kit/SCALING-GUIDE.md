# Scaling Guide — Large Projects, Large Teams, Large Codebases

> When your project outgrows the defaults, use these strategies.

---

## When You Need This Guide

| Signal | Threshold | Strategy |
|--------|-----------|----------|
| Total planned tasks | >40 tasks | Use `/gsd window` mode (15 tasks per window) |
| Codebase size | >500K LOC | Sampling and triage (don't audit everything) |
| Feature count | >50 features | Feature Inheritance Map management at scale |
| Team size | >5 developers | Async review cycles, ownership boundaries |
| Service count | >10 services | Service domain grouping, interface contracts |
| Phase count | >12 phases | Phase bundling, parallel track execution |

---

## 1. Large Task Counts (40+ Tasks)

### Use GSD Window Mode

Standard `/gsd` tries to execute all tasks in one session. At 40+ tasks, context degrades badly — the AI loses track of constraints, forgets earlier decisions, and makes inconsistent choices.

**Solution:** Use `/gsd window` instead.

```
/gsd window
```

**How it works:**
1. Execute 15 tasks
2. Checkpoint: update ARCH-ANCHOR.md, handoff.md, STATUS.md
3. Stop — context is fresh for next window
4. Resume: read ARCH-ANCHOR.md → handoff.md → STATUS.md → continue

**Window sizing guidance:**

| Task complexity | Window size | Rationale |
|----------------|-------------|-----------|
| Simple (config, setup, boilerplate) | 15-20 tasks | Low context load per task |
| Medium (feature implementation) | 10-15 tasks | Moderate context needed |
| Complex (architecture, integration) | 5-10 tasks | Heavy cross-referencing needed |

**Anti-pattern:** Running 40+ tasks without checkpointing. By task 30, the AI is hallucinating file paths and forgetting business rules.

### Task Prioritization at Scale

When you have 40+ tasks, prioritization matters more:

1. **Critical path first** — tasks that block other tasks
2. **Data model tasks** — everything else depends on the schema
3. **Shared infrastructure** — auth, middleware, error handling
4. **Feature tasks by phase** — one phase at a time, not scattered
5. **Polish tasks last** — UI refinement, performance optimization

---

## 2. Large Codebases (500K+ LOC)

### Sampling Strategy

Don't audit every file. Use stratified sampling:

1. **Changed files** (git diff) — 100% coverage, always
2. **Critical paths** (auth, payments, data access) — 100% coverage
3. **High-churn files** (git log --format="%H" -- file | wc -l) — top 20% by churn
4. **Random sample** — 10% of remaining files

### Triage Protocol

For enhance/repurpose paths on large codebases:

```
Phase 1: Automated scan (30 min)
  - Run linter with zero-tolerance rules
  - Run dependency audit (npm audit, license check)
  - Run dead code detection
  - Collect metrics: file count, LOC, test coverage, type coverage

Phase 2: Manual spot-check (2 hours)
  - Read 5 most-changed files in each service
  - Read all auth/security-related files
  - Read API route handlers (request validation, error handling)
  - Read database queries (N+1, missing indexes, raw SQL)

Phase 3: Focused deep dive (as needed)
  - Only dive deep on areas where Phase 2 found issues
  - Don't deep-dive clean areas — trust the sampling
```

### File Organization at Scale

When `dev_docs/` grows beyond 200 files:

```
dev_docs/
├── INDEX.md                    ← Master navigation (auto-generated)
├── by-service/                 ← Service-grouped specs and tasks
│   ├── auth/
│   │   ├── service-spec.md
│   │   ├── screen-specs/
│   │   └── tasks/
│   ├── billing/
│   └── ...
├── cross-cutting/              ← Specs that span services
├── infrastructure/             ← DevOps, CI/CD, monitoring specs
└── archive/                    ← Completed phase artifacts
```

---

## 3. Many Features (50+)

### Feature Inheritance Map Management

With 50+ features, the Feature Inheritance Map (from repurpose path) becomes unwieldy. Manage it with layers:

```
Layer 1: Feature Domains (5-8 groups)
  ├── User Management (auth, profiles, roles, permissions, SSO)
  ├── Core Workflow (the main thing your app does)
  ├── Data & Reporting (dashboards, exports, analytics)
  ├── Communication (notifications, email, chat, webhooks)
  ├── Billing (subscriptions, invoices, usage metering)
  ├── Admin (settings, config, audit logs)
  └── Integration (APIs, webhooks, third-party connectors)

Layer 2: Per-Domain Feature List (10-15 per domain)
  Each domain has its own feature list with dependencies mapped

Layer 3: Cross-Domain Dependencies
  Map which domains depend on which (auth → everything, billing → core workflow)
```

### Feature Prioritization Matrix

| Priority | Criteria | Action |
|----------|----------|--------|
| P0 — Launch Blocker | Users literally cannot use the product without it | Build in Phase 1 |
| P1 — Core Value | The main reason users pay for the product | Build in Phase 1-2 |
| P2 — Expected | Users expect it but can work around its absence temporarily | Build in Phase 2-3 |
| P3 — Nice to Have | Differentiator but not essential | Build in Phase 4+ |
| P4 — Future | Planned but not committed | Backlog |

---

## 4. Distributed Teams (5+ Developers)

### Async Review Cycles

When the team spans timezones, synchronous reviews block progress.

**Protocol:**
1. Developer completes task → updates state files → creates PR
2. PR auto-assigns reviewer based on code ownership (CODEOWNERS)
3. Reviewer has 4 business hours to review (not 4 calendar hours)
4. If no review in 4 hours, auto-escalate to secondary reviewer
5. Merge requires 1 approval + all CI checks passing

### Timezone-Aware Session Boundaries

Don't create session boundaries that split a developer's workday:

```
US Pacific developer works 9am-5pm PT
EU developer works 9am-5pm CET (midnight-8am PT)

Bad:  Session boundary at 2pm PT (splits EU developer's afternoon)
Good: Session boundary at 5pm PT / 8am CET (natural handoff)
```

### Ownership Boundaries

Assign service ownership to prevent merge conflicts:

```
# dev_docs/OWNERSHIP.md
Auth Service:       @alice
Billing Service:    @bob
Dashboard Service:  @carol, @dave (pair — timezone coverage)
API Gateway:        @eve
Infrastructure:     @frank
```

**Rule:** Only the owner modifies service specs, screen specs, and hub files for their service. Anyone can modify task files, but must notify the owner.

---

## 5. Many Services (10+)

### Service Domain Grouping

Group services into domains to manage complexity:

```
Domain: Identity (3 services)
  ├── Auth Service (login, sessions, tokens)
  ├── User Service (profiles, preferences, avatars)
  └── Permission Service (roles, ACLs, org membership)

Domain: Commerce (4 services)
  ├── Catalog Service (products, categories, search)
  ├── Order Service (cart, checkout, order lifecycle)
  ├── Payment Service (Stripe integration, invoices)
  └── Subscription Service (plans, usage metering, dunning)

Domain: Platform (3 services)
  ├── Notification Service (email, push, in-app)
  ├── File Service (uploads, processing, CDN)
  └── Analytics Service (events, dashboards, exports)
```

### Interface Contracts

At 10+ services, informal API agreements break down. Enforce contracts:

1. Every service publishes an API contract (OpenAPI spec or equivalent)
2. Contracts are versioned and stored in `dev_docs/contracts/`
3. Breaking changes require an ADR (Architecture Decision Record)
4. Contract tests run in CI — consumer tests validate producer contracts
5. Service-to-service calls use typed clients generated from contracts

---

## 6. Many Phases (12+)

### Phase Bundling

When you have 12+ phases, group them into tracks that can run in parallel:

```
Track A: Core Product (Phases 1-4)
  Sequential — each phase builds on the previous

Track B: Infrastructure (Phases 5-7)
  Can run parallel to Track A after Phase 1 completes

Track C: Growth Features (Phases 8-10)
  Depends on Track A completion

Track D: Operations (Phases 11-12)
  Can run parallel to Track C
```

### Phase Gate Compression

At 12+ phases, running full gate checks at every phase is expensive. Use tiered gates:

| Phase Type | Gate Level | Checks |
|-----------|-----------|---------|
| Foundation (1-2) | Full | All validators, full depth audit |
| Core Feature (3-6) | Standard | Depth + cross-ref + state files |
| Extension (7-10) | Light | Depth + state files only |
| Polish (11+) | Minimal | State files + smoke test |

---

## Decision Tree: When to Scale

```
Starting a new project?
├── <20 tasks → Standard /gsd, no special scaling
├── 20-40 tasks → Consider /gsd window, standard file layout
├── 40-80 tasks → Use /gsd window, service-grouped dev_docs
└── 80+ tasks → /gsd window + ownership boundaries + async reviews

Working on existing codebase?
├── <100K LOC → Full audit feasible
├── 100K-500K LOC → Sampling strategy, focus on critical paths
└── >500K LOC → Stratified sampling + triage protocol
```
