# Choose Your Path

> **Auto-routing:** Step 0.5 of the ORCHESTRATOR automatically detects your project's maturity level (using `00-discovery/PROJECT-MATURITY-DETECTOR.md`) and recommends the correct path. You only need to manually choose a path if you want to override the recommendation. Similarly, `/kit-upgrade` and `/master-kit-upgrade` now auto-detect non-kit projects and bridge them via the Enhance path — no more "No dev_docs/ found" dead ends.

> Not every project needs all 42 steps. Pick the path that fits your project size. All paths include the mandatory Hardening phase (Steps 29-33).

---

## Quick Decision

| If you are... | Use... |
|---------------|--------|
| Shipping a micro-SaaS this weekend | **Express Path** |
| Solo dev, small app, just want to start coding | **Lite Path** |
| Building a SaaS/product with a team | **Standard Path** |
| Enterprise, multi-tenant, or need marketing/legal | **Full Path** |
| Migrating from one stack/architecture to another | **Migration Path** |
| Building a CLI tool, npm package, or library | **Library/CLI Path** |
| Completely new to building software | **Guided Path** |
| **You have an existing app and want the full kit applied to it** | **Enhance Path** |
| **You have an existing app and want to adapt it for a new industry/vertical** | **Repurpose Path** |

---

## Interactive Decision Tree

Not sure which path? Answer these questions:

```
Do you have an existing codebase?
│
├── YES
│   ├── Does the codebase need quality improvement?
│   │   ├── YES → Enhance Path
│   │   └── NO → Do you want to pivot to a new vertical/industry?
│   │       ├── YES → Repurpose Path
│   │       └── NO → Do you need to change the tech stack?
│   │           ├── YES → Migration Path
│   │           └── NO → You may not need the kit (or use Enhance for audit)
│   │
│   └── Is it a CLI tool or library?
│       └── YES → Library/CLI Path
│
└── NO (Starting fresh)
    ├── Are you new to building software?
    │   └── YES → Guided Path
    │
    ├── What's your timeline?
    │   ├── This weekend → Express Path
    │   ├── 1-2 weeks (solo) → Lite Path
    │   ├── 1-3 months (team) → Standard Path
    │   └── 3+ months (enterprise) → Full Path
    │
    └── Is it a CLI tool, npm package, or library?
        └── YES → Library/CLI Path
```

**Still unsure?** Start with the **Lite Path** — it covers the essentials and you can always expand later by running additional steps.

> **Kit Feedback Loop (all paths):** Every path includes access to `/kit-feedback` — a skill that captures cross-project improvements (gotchas, template fixes, process discoveries) and exports them back to the Master Kit. When you discover something that would help future projects, run `/kit-feedback` to capture it. See `47-kit-feedback/` for details.

---

## Express Path (Micro-SaaS / Weekend Build)

**Time:** ~4 hours | **Steps:** 3 + 5 hardening | **Output:** Condensed spec + task list + .env.example — 10 files + hardening reports

Best for: solo founders shipping a micro-SaaS in a weekend, hackathon projects, MVPs with 1-3 features, anything where you need structure but not 181 documents.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1 (express) | Quick Intake | 10 essential questions (not 47) |
| Express | Combined | Single step: condensed spec, database schema, task list, .env.example |
| 29-33 | Hardening | Post-completion audit, enhancement, depth verification, deep dive, expansion |

**What you get (10 files + hardening reports):**
1. `dev_docs/SPEC.md` — single combined spec (services + screens + API in one doc)
2. `dev_docs/SCHEMA.md` — database tables and relationships
3. `dev_docs/TASKS.md` — flat task list (no phases, just a checklist)
4. `dev_docs/STATUS.md` — simple progress tracker
5. `dev_docs/DECISIONS.md` — tech stack decisions
6. `.env.example` — all required environment variables
7. `CLAUDE.md` — AI instructions for your project
8. `dev_docs/AUTH.md` — auth setup (if applicable)
9. `dev_docs/API.md` — endpoint list with request/response shapes
10. `dev_docs/DEPLOY.md` — deployment checklist

**The 10 Express Questions:**
1. What does your app do? (one sentence)
2. Who uses it? (one user type is fine)
3. What's the ONE thing users do every day?
4. What entities does the system manage? (e.g., users, posts, payments)
5. Do users log in? (yes/no + method)
6. Do you charge money? (yes/no + Stripe?)
7. What's your stack? (or "you decide")
8. Where will you deploy? (Vercel/Railway/Fly.io?)
9. What's your database? (or "you decide")
10. Any must-have integrations? (email, file upload, etc.)

**Tell Claude:**
```
Read ORCHESTRATOR.md. I want the Express Path —
I'm shipping a micro-SaaS this weekend. 10 questions, 10 files, 30 minutes.
```

---

## Lite Path (Solo Dev / Small Project)

**Time:** ~5.5 hours | **Steps:** 6 + 5 hardening | **Output:** Specs + tasks + hardening reports, ready to code

Best for: personal projects, simple web apps, portfolios, small client work, prototypes.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1 | Intake | Describe your project in a conversation |
| 2 | AI Config | Generate your project's CLAUDE.md |
| 5 | Services | Define your backend services |
| 6 | Screens | Define your screens/pages |
| 8 | Tasks | Generate task files (your to-do list for coding) |
| 29-33 | Hardening | Post-completion audit, enhancement, depth verification, deep dive, expansion |

**Skip:** Tribunal (research), Infrastructure (Docker, CI/CD), Design System, Security deep-dive, Marketing, Legal, Financial modeling.

**Tell Claude:**
```
Read ORCHESTRATOR.md. I want to use the Lite Path —
run steps 0, 1, 2, 5, 6, and 8 only. Skip everything else.
```

---

## Standard Path (Team / SaaS Product)

**Time:** ~9.5 hours | **Steps:** 30 + 5 hardening | **Output:** Full project plan with architecture, catalogs, code templates, tasks, design system, quality gates, master tracker, consistency audit, and hardening reports

Best for: SaaS products, team projects, apps with user accounts, anything you plan to launch publicly.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1 | Intake | Describe your project in a conversation |
| 2 | AI Config | Generate your project's CLAUDE.md |
| 3 | Tribunal | Adversarial research — competitors, personas, feasibility |
| 4 | Foundation | Project overview, vision, phases |
| 5 | Services | Define backend services |
| 6 | Screens | Define all screens/pages |
| 7 | Audit | *(skip if new project)* Audit existing code |
| 3.6 | Spike Planning | Identify and plan technical spikes |
| 5.1 | Module Hubs | Break services into 8-15 modules each |
| 8 | Tasks | Generate task files |
| 8.1 | Components | Component catalog from screen specs |
| 8.2 | Decisions | Architecture decision log + decision journal |
| 8.4 | Catalogs | Notification, permission, event, error, integration catalogs |
| 9 | Dashboard | Create STATUS.md sprint plan |
| 8.3 | Sprint Plans | Populate sprint directories |
| 8.6 | Consistency Audit | Cross-reference validator (10 checks) |
| 9.5 | Master Tracker | 500+ subtask atomic tracker |
| 10 | Contracts | API contract registry |
| 11 | Infrastructure | Docker, configs, git hooks |
| 12 | Testing | Test configs and patterns |
| 13 | Design System | Design tokens, components |
| 14 | Security | Auth, RBAC, validation |
| 10.5 | Code Templates | Stack-specific code templates |
| 10.6 | Mock Server | API mock server for parallel dev |
| 15 | Observability | Logging, monitoring, errors |
| 16 | Handoff | Build planning summary + governance docs |
| 16.6 | Seed Data | Plan realistic dev/demo seed data |
| 16.7 | Dir Audit | Verify all directories populated |
| 18 | Onboarding | Dev onboarding docs |
| 29-33 | Hardening | Post-completion audit, enhancement, depth verification, deep dive, expansion |

**Skip:** Mobile steps (3.5, 5.5, 11.5, 14.5), Advanced setup (17), Financial modeling (17.5), Multi-tenant (17.6), Operational steps (18.5-18.8), CX Operations (18.7.5), Marketing (19-28.5), Legal (14.7), Billing (14.8), Integrations (14.9 — use Section 00 inventory only).

**Tell Claude:**
```
Read ORCHESTRATOR.md and set up this project using the Standard Path.
Skip mobile, marketing, legal, billing, and operational steps.
```

---

## Full Path (Enterprise / Multi-tenant / Marketing)

**Time:** ~13-15 hours | **Steps:** 50+ (including 5 hardening) | **Output:** Everything — architecture, catalogs, code templates, mock server, legal, marketing, financial models, incident response, master tracker, seed data, governance, hardening reports, expansion plan

Best for: funded startups, multi-tenant SaaS, apps that need marketing plans, products requiring legal compliance.

**Run all steps.** Tell Claude:
```
Read ORCHESTRATOR.md and set up this project. Run the full pipeline including
marketing, legal, and operational steps.
```

Add-on modules (include only what applies):

| Module | Steps | Include if... |
|--------|-------|--------------|
| Mobile | 3.5, 5.5, 11.5, 14.5, 15.5 | Building iOS/Android app |
| Mobile Full Parity | 5.6-5.9 | Full mobile architecture, offline, screens, deploy planning |
| Module Hubs | 5.1 | 10+ services or complex sub-domains needing module-level breakdown |
| Domain Specs | 5.2 | Repurpose path — per-domain specs from Feature Inheritance Map |
| Master Tracker | 9.5 | Multi-team projects needing atomic subtask tracking |
| Seed Data | 16.6 | Database-heavy apps, demo-driven sales |
| Mock Server | 10.6 | Frontend/mobile developing in parallel with backend |
| Code Templates | 10.5 | Accelerate development with stack-specific templates |
| Legal | 14.7 | Need privacy policy, ToS, EULA |
| Billing | 14.8 | Charging users money |
| Integrations | 14.9 | 4+ third-party integrations needing resilience/webhook/fallback architecture |
| Financial modeling | 17.5 | Need revenue projections, runway |
| Multi-tenant | 17.6 | Multiple companies using same app |
| Operational | 18.5-18.8 | Team ceremonies, incident response, support |
| CX Operations | 18.7.5 | AI chatbot, self-service, health scoring, CX team ops |
| Marketing | 19-28.5 | Need go-to-market strategy |
| Battle Cards | 28.5 enhanced | Competitive market, sales-driven GTM, per-competitor battle cards |

---

## Guided Path (Complete Beginners)

**Time:** ~6.5 hours | **Steps:** 8 + 5 hardening | **Extra:** Claude explains everything as it goes

If you've never built software before, use this path. It runs the same steps as Lite but asks Claude to explain every decision in simple terms.

**Tell Claude:**
```
Read ORCHESTRATOR.md. I'm completely new to building software.
Run the Lite Path (steps 0, 1, 2, 5, 6, 8) but explain every
decision in plain English. If you use a technical term, define it.
Ask me simple yes/no questions instead of open-ended ones.
Also read GLOSSARY.md so you know which terms need explaining.
```

**What's different:**
- Claude asks simpler questions ("Do you want users to log in?" instead of "What auth strategy?")
- Claude explains why each step matters before doing it
- Claude suggests defaults more aggressively (less "what do you want?" and more "I recommend X because...")
- Claude links to [GLOSSARY.md](GLOSSARY.md) definitions when using technical terms

---

## Migration Path (Stack/Architecture Migration)

**Time:** ~9-10 hours | **Steps:** 18 + migration-specific + 5 hardening | **Output:** Current-state audit, target architecture, migration waves, rollback plan, hardening reports

Best for: JavaScript → TypeScript, monolith → microservices, Express → NestJS, legacy → modern stack, self-hosted → cloud.

Uses the Standard Path with these modifications:

| Standard Step | Migration Modification |
|--------------|----------------------|
| Step 1 (Intake) | Adds migration-specific questions (current stack, migration reason, timeline) |
| Step 3 (Tribunal) | Includes "migration risk assessment" as a round |
| Step 5 (Services) | Includes old → new mapping in each spec |
| Step 7 (Audit) | **Mandatory** — full audit of existing system |
| Step 8 (Tasks) | Generates migration waves instead of standard phases |

**Additional outputs:**
- `dev_docs/audit/current-state-audit.md` — what exists today
- `dev_docs/specs/migration/target-state.md` — what you're building toward
- `dev_docs/specs/migration/mapping.md` — old component → new component
- Migration wave task files (Wave 0: infra, Wave 1: foundation, Wave 2: core, Wave 3: supporting, Wave 4: cleanup)

**See:** `02-architecture/migration-project-path.md` for the full protocol.

**Tell Claude:**
```
Read ORCHESTRATOR.md. I'm migrating from [current stack] to [new stack].
Use the Migration Path — run the Standard Path but audit my existing codebase first
and generate migration waves instead of standard phases.
```

---

## Library/CLI Path (Packages, CLI Tools, Extensions)

**Time:** ~5.5 hours | **Steps:** 6 + 5 hardening | **Output:** Module specs, API surface docs, distribution plan, hardening reports

Best for: npm packages, CLI tools, VS Code extensions, libraries, SDKs, developer tools — anything without a frontend UI.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1 (adapted) | Intake | Library-specific questions (API surface, distribution, versioning) |
| 2 | AI Config | Generate your project's CLAUDE.md |
| 5 (adapted) | Modules | Define your library's modules (replaces "services") |
| 7 | Audit | *(skip if new)* Audit existing code |
| 8 | Tasks | Generate task files |

**What's different from Lite:**
- **No screen specs** — libraries don't have UI screens
- **Module specs replace service specs** — focuses on exports, public API surface, and type definitions
- **API surface doc** instead of API contracts — documents the public functions/classes users will call
- **Distribution plan** — npm publish config, versioning strategy, changelog automation
- **Adapted intake questions:**
  1. What does this library do?
  2. Who uses it? (developers, specific framework users, etc.)
  3. What's the public API surface? (functions, classes, hooks, CLI commands)
  4. What are the peer dependencies?
  5. What environments must it support? (Node, browser, edge, all)
  6. How is it distributed? (npm, GitHub Packages, bundled)
  7. Versioning strategy? (semver, calver)
  8. Does it have a CLI? What commands?

**Tell Claude:**
```
Read ORCHESTRATOR.md. I'm building a [CLI tool / npm package / library].
Use the Library/CLI Path — skip screens, use module specs instead of service specs,
and focus on API surface and distribution.
```

---

## Enhance Path (Existing App — Full Kit Treatment)

**Time:** ~6-8 hours | **Steps:** 4 new audit steps + kit Steps 2, 5-16 + 5 hardening | **Output:** Deep audit, quality scorecard, gap analysis, enhancement backlog, full planning overlay

Best for: apps that are live or in active development that need documentation, gap-filling, quality improvement, and a full kit planning overlay applied to existing code.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1-E | Enhance Intake | Auto-scans codebase, pre-fills tech stack, asks targeted enhancement questions |
| 1.5 | Version Verification | Reads from package.json/lock files — no web lookups for installed packages |
| E1 | Deep App Audit | 6-dimension audit (architecture, UX, performance, security, testing, docs) — 3 rounds each |
| E2 | Quality Scorecard | Composite 0-10 score, identifies critical blockers |
| E3 | Gap Analyzer | Compares app against kit standards — finds what's entirely missing |
| E4 | Enhancement Backlog | Prioritized backlog: Tier 1 blockers, Tier 2 core, Tier 3 depth |
| 2 | AI Config | CLAUDE.md generation adapted for existing codebase |
| 5-16 | Standard Planning | All steps run, but guided by ENHANCE-PLAN-OVERLAY.md — extend what exists, don't replace what works |
| 29-33 | Hardening | Post-completion audit, enhancement, depth verification, deep dive, expansion |

**What's different from Standard Path:**

- Starts with an audit, not a blank-slate intake
- Step 7 is skipped — the E1-E4 deep audit sequence replaces it with far more depth
- Steps 5-16 run in "overlay mode" — audit findings pre-populate specs, not guesses
- Enhancement Backlog is the primary deliverable before planning begins

**References:** `37-enhance/` — all 6 generator files for this path

**Tell Claude:**
```
Read ORCHESTRATOR.md and 37-enhance/ENHANCE-INTAKE.md.
I have an existing app I want the full kit applied to.
Use the Enhance Path — run the enhance intake first, then the full E1-E4 audit,
then the standard planning steps adapted via the Enhance Plan Overlay.
```

---

## Repurpose Path (Existing App — New Industry/Vertical)

**Time:** ~7-9 hours | **Steps:** 4 new repurpose steps + variable kit steps + 5 hardening | **Output:** Pivot depth score, feature inheritance map, market fit analysis, vertical differentiation plan (and fork architecture for deep pivots)

Best for: using an existing application as the foundation for a new industry or vertical market. Kit detects pivot depth (Shallow/Medium/Deep) and generates the appropriate plan.

| Step | Name | What Happens |
|------|------|-------------|
| 0 | Ecosystem | Set up Claude Code plugins and tools |
| 1-R | Repurpose Intake | Source app + target vertical questions |
| R1 | Pivot Depth Detector | Scores pivot across 5 dimensions → classifies as Shallow/Medium/Deep |
| R2 | Feature Inheritance Map | For every feature: Carry Over / Adapt / Replace / Deprecate / New |
| R3 | Market Fit Analyzer | Buyer delta, terminology map, compliance, competitive landscape |
| R4 | Vertical Differentiation Plan | The concrete pivot plan (scope depends on depth) |
| — | *(then routes by depth)* | See below |
| 29-33 | Hardening | Post-completion audit, enhancement, depth verification, deep dive, expansion |

**Routing by pivot depth:**

| Classification | Score | What follows R4 |
|----------------|-------|----------------|
| **Shallow** (rebrand + config) | 0-3 | Config layer plan → Steps 29-33 |
| **Medium** (vertical wrapper) | 4-6 | Steps 5-6, 8 adapted for vertical → Steps 29-33 |
| **Deep** (product fork) | 7-10 | Fork Architecture → Steps 5-16 (full planning for new product) → Steps 29-33 |

**References:** `38-repurpose/` — all 6 generator files for this path

**Tell Claude:**
```
Read ORCHESTRATOR.md and 38-repurpose/REPURPOSE-INTAKE.md.
I have an existing app I want to adapt for [target vertical].
Use the Repurpose Path — run the repurpose intake, score the pivot depth,
then route to the appropriate planning track based on the score.
```

---

## Can I Switch Paths?

Yes. If you start with Lite and realize you need more:

```
Run step [number] from the ORCHESTRATOR. I want to add [feature] to my project plan.
```

The kit is modular — each step reads the state from previous steps and builds on top. You can always add more later.

---

## Hardening Phase (Mandatory for All Paths)

Steps 29-33 run after all other steps complete. They are **mandatory for every path** — no exceptions. These steps audit, enhance, deepen, and expand your project plan before coding begins.

| Step | Name | Time | What Happens |
|------|------|------|-------------|
| 29 | Post-Completion Audit | ~30 min | 3-round existence, section, and cross-reference audit |
| 30 | Enhancement Rounds | ~45 min | 3-round gap analysis and spec improvement |
| 31 | Depth Verification | ~60 min | 5-round progressive deepening with elevated thresholds |
| 32 | Deep Dive Audit | ~60 min | 3-round per-service, per-phase, per-feature deep dive |
| 33 | Expansion Planning | ~30 min | Post-MVP roadmap, verticals, growth strategies |

**Total hardening time: ~3.5-4 hours**

Each step uses multi-round protocol with early exit when a round finds zero new issues.

---

## Which Steps Can I Always Skip?

| Step | Safe to skip if... |
|------|--------------------|
| 3 (Tribunal) | You already know your market and competitors |
| 7 (Audit) | This is a brand-new project (no existing code) |
| 3.5, 5.5, 11.5, 14.5, 15.5 | Not building a mobile app |
| 14.7 (Legal) | Not launching publicly yet |
| 14.8 (Billing) | Not charging money yet |
| 14.9 (Integrations) | 0-3 integrations (strategy only — covered by Section 00 inventory) |
| 17 (Capabilities) | Don't need feature flags, caching, i18n yet |
| 17.5 (Financial) | Not doing revenue projections |
| 17.6 (Multi-tenant) | Only one company uses the app |
| 18.5-18.8 (Operational) | Solo dev or small team without formal processes |
| 19-28.5 (Marketing) | Not ready for go-to-market planning |
