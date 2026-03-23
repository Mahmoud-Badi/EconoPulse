# Master Starter Kit

> **Go from idea to fully-planned, ready-to-code project in hours — not weeks.**

This kit compiles months of battle-tested patterns from real production projects into a reusable, technology-agnostic planning framework. When you start a new project, an AI agent reads the ORCHESTRATOR and runs on autopilot — researching competitors, defining architecture, generating task files, and producing hundreds of planning documents.

**New here?** Start with [QUICK-START.md](QUICK-START.md) — a plain-English guide to getting started in 5 minutes.

---

## Start Here

| Your experience level | Read this first |
|-----------------------|----------------|
| **Never built software before** | [QUICK-START.md](QUICK-START.md) → [GLOSSARY.md](GLOSSARY.md) → [PATHS.md](PATHS.md) (Guided Path) |
| **Some experience, first time with this kit** | [QUICK-START.md](QUICK-START.md) → [PATHS.md](PATHS.md) (pick your path) |
| **Experienced developer** | [PATHS.md](PATHS.md) → ORCHESTRATOR.md → go |

---

## Quick Stats

| Metric | Count |
|--------|-------|
| Sections | 39 (00-38) |
| Templates | 375+ (`.template.md`, `.template.json`, `.template.js`, `.template.yml`) |
| Example files | 49 (TaskFlow SaaS + TaskFlow Mobile + DataPulse Python + marketing + testing + CI/CD + BI + integrations) |
| Orchestrator steps | 45+ (21 build + 5 quality + 2 advanced + 10 marketing + 2 BI/SEO + 5 hardening + sub-steps) |
| Gate checkpoints | 34 (8 core + 4 mobile + 5 operational + 4 marketing + 5 hardening + 8 sub-step gates) |
| Gate modes | 3 (`manual`, `semi-auto`, `auto` — see GATE-MODE-GUIDE) |
| Placeholder variables | 390+ (documented in PLACEHOLDER-REGISTRY.md) |
| Validation scripts | 6 (`validate-kit`, `validate-output`, `depth-scorer`, `lint-docs`, `validate-env`, `dashboard`) |
| Paths | 9 (Express, Lite, Standard, Full, Migration, Library/CLI, Guided, Enhance, Repurpose) |
| Plugin commands | 12 (`/bootstrap`, `/resume`, `/add-service`, `/health-check`, `/export-tasks`, +7 more) |
| Generators | 21 (services, screens, sprints, APIs, database, OpenAPI, code scaffolds, battle cards, financial models, +12 more) |

## How It Works

1. Copy this folder into your new project
2. Open Claude Code and say: **"Read ORCHESTRATOR.md and set up this project"**
3. Claude has a natural conversation about your project idea
4. Once aligned, Claude runs 30 steps on autopilot
5. Result: fully planned project with tasks, specs, contracts, design system, and quality gates

**No YAML files. No manual config. Just a conversation.**

---

## What's Inside

```
Master-Starter-Kit/
├── QUICK-START.md                  # ⬅ START HERE if you're new
├── GLOSSARY.md                     # Plain-English definitions of all terms
├── PATHS.md                        # Choose your path (Express/Lite/Standard/Full/Migration/Library/Guided)
├── BEFORE-AFTER.md                 # See what the kit produces (before vs after)
├── TRIBUNAL-EXPLAINED.md           # The Tribunal explained in plain English
├── TROUBLESHOOTING.md              # When things go wrong — fixes & solutions
├── NOT-INCLUDED.md                 # What this kit is (and isn't)
├── PHILOSOPHY.md                   # Why documentation-first works
├── ORCHESTRATOR.md                 # The autopilot brain — AI reads this first
├── PLACEHOLDER-REGISTRY.md         # All 390+ template variables documented
├── LESSONS-LEARNED.md              # Production lessons from real projects
├── STEP-DEPENDENCY-GRAPH.md        # Which steps can run in parallel
├── TIMELINE-ESTIMATE.md            # Time estimates per step and path
├── VERSION / CHANGELOG.md          # Kit versioning
├── CLAUDE.md                       # AI agent entry point
│
├── 00-discovery/                   # Project brief, intake questions, stack detection
├── 01-tribunal/                    # 10-round adversarial research engine (60-100 files)
├── 02-architecture/                # DB design, API patterns, migrations, state management
├── 03-documentation/               # Spec layer, design docs, state files, contracts
├── 04-phase-planning/              # Phase/feature templates, task file templates
├── 05-dev-infrastructure/          # Docker, turbo, eslint, husky, CI/CD, commands, hooks
├── 06-development-workflow/        # Session rituals, dev onboarding, workflow patterns
├── 07-ui-design-system/            # Design tokens, Storybook, component system, anti-slop
├── 08-quality-testing/             # Jest, Playwright, test configs, performance budgets
├── 09-deployment-operations/       # Env vars, monitoring, environment management
├── 10-generators/                  # Auto-generation prompts (21 generators)
├── 11-new-capabilities/            # Feature flags, caching, i18n, analytics, perf budgets
├── 12-examples/                    # 49 filled-in examples (TaskFlow SaaS + testing + CI/CD + BI + integrations)
├── 13-lessons-gotchas/             # Auth, DB, Next.js, deployment, testing gotchas
├── 14-mobile-platform/             # React Native / Expo setup, navigation, offline-first
├── 15-mobile-ui-design/            # Mobile design tokens, gestures, adaptive layouts
├── 16-mobile-native-features/      # Camera, push, biometrics, maps, deep links
├── 17-mobile-deployment/           # App Store, Play Store, OTA updates, CI/CD
├── 18-user-documentation/          # Help center, onboarding flows, release notes
├── 19-marketing/                   # SEO, content, email, social, launch planning
├── 20-post-launch/                 # Post-launch lifecycle, roadmap, feedback loops
├── 21-incident-response/           # Severity levels, runbooks, postmortems, on-call
├── 22-cicd-pipeline/               # Pipeline architecture, deployment patterns, IaC
├── 23-customer-support/            # Support platform, KB, SLAs, escalation workflows
├── 24-ai-ml-integration/           # LLM patterns, RAG, vector DBs, AI safety
├── 25-financial-modeling/          # Revenue projections, unit economics, runway
├── 26-multi-tenant-saas/           # Tenant isolation, billing, rate limiting
├── 27-team-communication/          # Sprints, standups, retros, ceremonies
├── 28-competitive-intelligence/    # Battle cards, feature parity, monitoring
├── 29-legal-documents/             # Privacy policy, ToS, cookie policy, DPA, EULA
├── 30-billing-payments/            # Billing models, tax compliance, dunning, metering
├── 31-stakeholder-communications/  # Phase-gated comms, Miro exports, diagrams, reports
├── 32-integrations/               # Integration strategy, webhooks, resilience, category patterns
├── 33-customer-experience-ops/    # AI chatbots, self-service, omnichannel, CX team ops
├── 34-hardening/                   # Audit checklists, depth protocol, expansion templates
├── 35-business-intelligence/      # Data warehouse, ETL, executive reporting, metrics hub
├── 36-seo/                        # Technical SEO, on-page, off-page, content, AI search, measurement
├── 37-enhance/                    # Enhance path for existing applications (audit, scorecard, gaps)
└── 38-repurpose/                  # Repurpose path for pivoting/forking existing apps
```

---

## The Autopilot Flow

### Build Planning (Steps 0-16)

| Step | Name | What It Does |
|------|------|-------------|
| 0 | Ecosystem | Install plugins, MCP servers, commands, skills, settings |
| 1 | Intake | Conversational project discussion + auto-detect stack |
| 1.7 | Comms Setup | Stakeholder communication plan, audience matrix, kickoff deck |
| 2 | AI Config | Generate CLAUDE.md, AGENTS.md, GEMINI.md, commands, skills |
| 3 | Tribunal | Run 10 adversarial research rounds (60-100 files) |
| 3.5 | Mobile Framework | *(if mobile)* Choose React Native/Expo, configure navigation |
| 4 | Foundation | Project overview, vision, phases, personas, architecture |
| 5 | Services | Service specs + service hub files |
| 5.5 | Native Audit | *(if mobile)* Audit native API requirements |
| 6 | Screens | Screen specs + master screen catalog |
| 7 | Audit | Audit existing code (skip if greenfield) |
| 8 | Tasks | Task files organized by phase |
| 9 | Dashboard | STATUS.md with full sprint plan |
| 10 | Contracts | API contract registry |
| 11 | Infrastructure | Docker, turbo, tsconfig, eslint, husky |
| 11.5 | Mobile Setup | *(if mobile)* Base app, navigation, device testing |
| 12 | Testing | Jest/Playwright configs, test utils, mock patterns |
| 13 | Design System | Design tokens, Storybook, component system |
| 14 | Security | Auth patterns, RBAC, input validation, CSRF |
| 14.5 | Store Readiness | *(if mobile)* CI/CD, store assets, test builds |
| 14.7 | Legal Documents | Privacy policy, ToS, cookie policy, DPA, EULA |
| 14.8 | Billing Architecture | *(if monetized)* Billing model, tax compliance, dunning flows |
| 15 | Observability | Logging, monitoring, error tracking, alerting |
| 15.5 | User Docs | *(if mobile)* Help center, onboarding, release notes |
| 16 | Handoff | Build planning summary + day-1 checklist |

### Advanced Setup (Steps 17-18)

| Step | Name | What It Does |
|------|------|-------------|
| 17 | Capabilities | Wire in caching, feature flags, i18n, analytics, perf budgets |
| 17.5 | Financial Modeling | *(if monetized)* Revenue projections, unit economics, break-even, runway |
| 17.6 | Multi-Tenant Architecture | *(if multi-tenant)* Tenant isolation, billing, rate limiting, admin patterns |
| 18 | Onboarding | Generate dev onboarding docs, quick reference, team coordination |

### Operational Setup (Steps 18.5-18.8)

| Step | Name | What It Does |
|------|------|-------------|
| 18.5 | Team Ceremonies | Sprint planning, standups, retros, stakeholder updates |
| 18.6 | Incident Response | Severity levels, runbooks, postmortems, on-call rotation |
| 18.7 | Customer Support | Support platform, knowledge base, SLAs, escalation workflows |
| 18.8 | Post-Launch Lifecycle | Release cadence, feedback loops, roadmapping, metrics dashboard |

### Marketing Planning (Steps 19-28.5, optional)

| Step | Name | What It Does |
|------|------|-------------|
| 19 | Marketing Discovery & Research | Competitor marketing analysis, audience research, positioning |
| 20 | Brand, Messaging & Pricing | Brand voice, value propositions, pricing strategy |
| 21 | Marketing Strategy & Channel Plan | Channel selection, budget allocation, analytics, CRM, legal |
| 22 | Website, Landing Pages & Conversion | Landing page copy, pricing page, SEO foundation |
| 23 | Content, Social Media & Video | Blog strategy, social media calendar, video plan |
| 24 | Email Marketing System | Welcome sequences, drip campaigns, newsletters |
| 25 | Launch Strategy & Listings | Launch timeline, directories, app store marketing |
| 26 | Growth, Outreach & Referral | Outreach, partnerships, paid ads, referral programs |
| 27 | Onboarding & Retention | User onboarding flows, churn reduction, NPS |
| 28 | Marketing Dashboard & Handoff | Reporting, A/B testing, marketing summary + launch checklist |
| 28.5 | Competitive Intelligence | Battle cards, feature parity tracking, competitive monitoring |

**Gate checkpoints** pause for your approval at steps 0, 1, 3, 5, 9, 11, 16, 18.8 (core), steps 3.5, 5.5, 11.5, 14.5 (mobile), steps 11.6, 17.5, 17.6, 18.5-18.8 (operational), and steps 19, 21, 25, 28.5 (marketing).

---

## Supported Stacks

Templates include conditional sections (`<!-- IF FRAMEWORK -->`) for:

- **JavaScript/TypeScript:** Next.js, React, Vue, NestJS, Express
- **Python:** Django, FastAPI, Flask
- **Ruby:** Rails
- **Go:** Standard library, Gin, Echo
- **Mobile:** React Native, Expo

Stack is auto-detected from your codebase (package.json, requirements.txt, go.mod, Gemfile, etc.).

---

## Key Concepts

**Templates** use `{{PLACEHOLDER}}` syntax. All 270+ variables are documented in `PLACEHOLDER-REGISTRY.md` with descriptions, defaults, and which step fills them.

**State files** (`STATUS.md`, `handoff.md`, `DEVLOG.md`, `PROTECT-LIST.md`) maintain context between AI sessions. Templates are in `03-documentation/state-files/`.

**The Tribunal** is a 10-round adversarial research engine in `01-tribunal/`. It generates 60-100 files of competitor analysis, persona research, design audits, and technical feasibility studies.

**Lessons Learned** (`LESSONS-LEARNED.md` + `13-lessons-gotchas/`) contain production battle scars covering auth, databases, Next.js, tRPC, deployment, testing, design, and AI workflow patterns.

**Examples** in `12-examples/` show what every template looks like when filled in, based on a fictional TaskFlow project management SaaS and real production projects.

---

## Prerequisites

- **Claude Code** (CLI or VSCode extension)
- **Recommended MCP servers:** Firecrawl, Gemini, Sequential Thinking (fallbacks included if unavailable)
- **Git** initialized in your project

---

## Protecting the Kit

The kit includes a `.gitignore` that prevents OS files and editor artifacts from polluting the template library. Templates themselves are **not** gitignored — they are the product.

When using the kit in a project, the `PROTECT-LIST.md` state file tracks which generated files should never be modified by AI agents without explicit permission.

---

## FAQ

### For beginners

**Q: I've never built software before. Can I use this?**
A: Yes. Start with [QUICK-START.md](QUICK-START.md) and use the Guided Path in [PATHS.md](PATHS.md). Claude will explain everything in plain English and suggest smart defaults so you don't have to make technical decisions you're not ready for.

**Q: Do I need to read all 686 files?**
A: No. You only read [QUICK-START.md](QUICK-START.md) and [PATHS.md](PATHS.md). Claude reads everything else automatically. The templates are for Claude, not for you.

**Q: What's a term I don't understand?**
A: Check [GLOSSARY.md](GLOSSARY.md) for plain-English definitions of every technical term used in the kit. If it's not there, ask Claude: "What does [term] mean in simple terms?"

**Q: Is this overkill for a small project?**
A: The Lite Path in [PATHS.md](PATHS.md) runs only 6 steps and takes ~2 hours. You get specs and tasks without the research, marketing, or infrastructure setup. Perfect for small projects.

**Q: Do I need to know how to code?**
A: Not to run the planning kit — it produces documentation and specs. You will need coding ability (or an AI assistant) to build the actual project from those specs. See [NOT-INCLUDED.md](NOT-INCLUDED.md) for a full breakdown of what the kit does and doesn't do.

**Q: What is the Tribunal?**
A: The kit's most powerful feature — a structured research and debate process that analyzes your competitors, creates user personas, and produces a prioritized feature list. See [TRIBUNAL-EXPLAINED.md](TRIBUNAL-EXPLAINED.md) for a plain-English walkthrough.

**Q: What if something goes wrong?**
A: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to common problems — context resets, wrong specs, MCP issues, and more.

**Q: What does the kit actually produce?**
A: See [BEFORE-AFTER.md](BEFORE-AFTER.md) for a visual comparison of your project folder before and after running the kit, with document counts and explanations.

**Q: Why does planning before coding work?**
A: See [PHILOSOPHY.md](PHILOSOPHY.md) for the evidence and reasoning behind the documentation-first approach.

### For experienced developers

**Q: How long does the full pipeline take?**
A: Depends on project complexity. The 18 build steps run largely on autopilot — you confirm at 8 gate checkpoints. Operational setup adds 4 sub-steps (18.5-18.8) and marketing adds 11 more steps with 4 gates. See [PATHS.md](PATHS.md) for time estimates per path.

**Q: Can I skip steps?**
A: Yes. See the "Which Steps Can I Always Skip?" section in [PATHS.md](PATHS.md). The orchestrator has a resume mechanism via the STATE BLOCK at the top. You can skip the tribunal if you already have research, skip infrastructure if your project is set up, or skip marketing entirely at the Step 18.8 gate.

**Q: Does it work for existing projects?**
A: Yes. Step 7 (Audit) scans your existing codebase. The system builds on what exists rather than starting from scratch.

**Q: What if I don't have Firecrawl/Gemini MCP servers?**
A: Every research round includes WebSearch + WebFetch fallback instructions. Results may be less detailed but the process still works.

**Q: Can I use this with a non-Claude AI?**
A: The ORCHESTRATOR is plain markdown — any AI that can read files can follow it. The MCP server integrations and slash commands are Claude-specific, but the templates, architecture docs, and planning structure are universal.
