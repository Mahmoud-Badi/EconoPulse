# Enhance Intake

**Purpose:** Replace standard Step 1 intake for existing applications. Auto-scans the codebase first to pre-fill known answers, then asks targeted questions about what's broken, missing, or needs improving. Produces a confirmed intake document that drives the full E1-E4 audit sequence.

**Output:** `dev_docs/intake/enhance-intake.md`

**Path:** Enhance only

---

## When to Run

Run this instead of the standard Step 1 Discovery intake when:

- You have a working application and want the full kit treatment applied to it
- You want to audit, document, and improve an existing codebase
- The app is live or in active development — not greenfield

---

## Phase 1 — Auto-Scan (Run Before Asking a Single Question)

> **Think-Then-Generate (TTG) required.** Before generating the intake document, complete this entire scan protocol in the conversation. Answer every question you find. Do not skip or abbreviate.

Scan the following files in order:

### Priority 1 — Core project files
- `README.md` / `README.rst` — project description, setup instructions, tech stack
- `package.json` / `requirements.txt` / `Gemfile` / `go.mod` / `Cargo.toml` — dependencies, scripts, framework
- Lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`) — exact versions
- `.env.example` / `.env.sample` — environment variables, external services used

### Priority 2 — Architecture signals
- `docker-compose.yml` / `Dockerfile` — infrastructure, services
- CI config (`.github/workflows/`, `.gitlab-ci.yml`, `.circleci/`) — what pipelines exist
- `tsconfig.json` / `eslint.config.*` / `.eslintrc.*` — code quality config
- `jest.config.*` / `vitest.config.*` / `playwright.config.*` — test infrastructure

### Priority 3 — Existing documentation
- `docs/` directory — any existing documentation
- `dev_docs/` directory — any prior kit work
- `CHANGELOG.md` / `HISTORY.md` — feature history
- `ARCHITECTURE.md` / `ADR/` — architecture decisions

### Priority 4 — Code structure
- Top-level directory listing (`ls -la` or equivalent)
- `src/` or `app/` structure (2 levels deep)
- Database schema files (`schema.prisma`, `schema.sql`, `models/`, `migrations/`)

---

## Phase 1 — Pre-Fill from Scan

After scanning, fill in this pre-fill table in the conversation:

| Field | Detected Value | Confidence |
|-------|---------------|------------|
| Application name | {name from package.json/README} | High / Medium / Low |
| Primary language | {JS/TS/Python/Ruby/Go/etc.} | High / Medium / Low |
| Framework(s) | {Next.js, NestJS, Django, Rails, etc.} | High / Medium / Low |
| Database | {PostgreSQL, MySQL, MongoDB, SQLite, etc.} | High / Medium / Low |
| ORM / Query layer | {Prisma, Drizzle, SQLAlchemy, ActiveRecord, etc.} | High / Medium / Low |
| Auth approach | {NextAuth, Passport, Devise, JWT custom, etc.} | High / Medium / Low |
| Frontend framework | {React, Vue, Angular, HTMX, etc.} | High / Medium / Low |
| CSS approach | {Tailwind, CSS Modules, styled-components, etc.} | High / Medium / Low |
| Deployment target | {Vercel, AWS, Railway, Heroku, self-hosted, etc.} | High / Medium / Low |
| CI/CD | {GitHub Actions, GitLab CI, CircleCI, none, etc.} | High / Medium / Low |
| Test frameworks | {Jest, Playwright, Vitest, pytest, RSpec, etc.} | High / Medium / Low |
| External services | {Stripe, SendGrid, Twilio, S3, etc.} | High / Medium / Low |
| Monorepo structure | {Yes (Turborepo/Nx/pnpm workspaces) / No} | High / Medium / Low |
| Existing docs quality | {None / Minimal / Partial / Comprehensive} | High / Medium / Low |
| Estimated codebase size | {~N files, ~N LOC} | Estimate |
| Test coverage signal | {No tests / Few tests / Partial / Good} | Estimate |

Announce the pre-fill before asking any questions: *"I've scanned the codebase and here's what I found. I'll confirm these with you in the questions below."*

---

## Phase 2 — Intake Questions

Ask these questions one section at a time. Confirm pre-filled answers as you go — don't re-ask what you already know.

### Section A — The Problem (Why You're Here)

1. **What prompted you to enhance this app now?**
   - It has bugs or reliability issues
   - It's missing key features users need
   - The codebase has grown messy and needs cleanup
   - You want full documentation and planning before scaling
   - You're preparing it for a team handoff
   - Other: ___

2. **What are the top 3 pain points with the app right now?** (open-ended — be specific)

3. **On a scale of 1-10, how would you rate the app's current state?**
   - 1-3: Prototype, lots of technical debt
   - 4-6: Working but rough, missing important things
   - 7-8: Solid but gaps to fill
   - 9-10: Good shape, just needs documentation and polish

### Section B — Users and Usage

4. **Who are the primary users of this app?**
   - Internal team only
   - External users (customers/clients)
   - Both internal and external
   - Not launched yet

5. **How many active users does it have today?** (ballpark)
   - 0 (not launched)
   - 1-10 (early/internal)
   - 10-100
   - 100-1,000
   - 1,000+

6. **What does a typical user session look like?** (open-ended — describe the main user journey)

### Section C — Goals for Enhancement

7. **What's the north-star goal of this enhancement effort?**
   - Get it production-ready and launch
   - Scale it to handle 10× the current load
   - Hand it off to a team
   - Document and plan before adding major features
   - Reduce technical debt before it bites us
   - Other: ___

8. **Which areas do you most want the kit to focus on?** (select all that apply)
   - Architecture and code quality
   - Missing features / functionality gaps
   - Testing coverage
   - Documentation
   - Security hardening
   - Performance optimization
   - UX and screen coverage
   - Infrastructure and deployment
   - All of the above — comprehensive treatment

9. **What is explicitly out of scope for this enhancement effort?** (open-ended — what should the kit NOT touch or plan)

### Section D — Constraints

10. **Timeline:** What's the realistic timeline for acting on the enhancement plan?
    - Immediately (starting this week)
    - 1 month
    - 1 quarter
    - Longer-term planning only

11. **Team size:** Who will be implementing the improvements?
    - Solo developer
    - 2-3 person team
    - 4-10 person team
    - Larger team

12. **Budget for infrastructure/tooling changes:** (if relevant)
    - None — must use what exists
    - Modest — minor upgrades OK
    - Open — best tools for the job

### Section E — Confirm Tech Stack

Review the pre-filled tech stack with the user:

*"Based on my scan, here's the tech stack I detected. Please correct anything wrong:"*

Present the pre-fill table. For each row with Medium or Low confidence, ask for confirmation.

---

## Phase 3 — Output

Write `dev_docs/intake/enhance-intake.md` using this template:

```markdown
# Enhance Intake — {App Name}

> **Date:** {date}
> **Path:** Enhance
> **Kit version:** Master Starter Kit

---

## Application Overview

| Field | Value |
|-------|-------|
| App name | {name} |
| Current state rating | {1-10} / 10 |
| Active users | {count} |
| Launch status | {Launched / Not launched} |

---

## Tech Stack (Confirmed)

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | {language} | {version} |
| Framework | {framework} | {version} |
| Database | {database} | {version} |
| ORM | {orm} | {version} |
| Auth | {auth} | {version} |
| Frontend | {frontend} | {version} |
| CSS | {css approach} | {version} |
| Deployment | {platform} | {version} |
| CI/CD | {ci/cd} | {version or none} |
| Testing | {test frameworks} | {versions} |

---

## Pain Points

1. {pain point 1}
2. {pain point 2}
3. {pain point 3}

---

## Enhancement Goals

**North-star goal:** {goal}

**Focus areas (priority order):**
1. {area 1}
2. {area 2}
3. {area 3}

**Out of scope:** {what not to touch}

---

## External Services Detected

| Service | Purpose | Integration type |
|---------|---------|----------------|
| {service} | {purpose} | {REST API / SDK / webhook} |

---

## Constraints

| Constraint | Value |
|-----------|-------|
| Timeline | {timeline} |
| Team size | {team size} |
| Infrastructure budget | {none / modest / open} |

---

## Existing Documentation

| Artifact | Location | Quality |
|---------|---------|---------|
| README | {path} | {None / Poor / Partial / Good} |
| API docs | {path or none} | {None / Poor / Partial / Good} |
| Architecture docs | {path or none} | {None / Poor / Partial / Good} |
| Prior kit docs | {path or none} | {None / exists} |

---

## Audit Configuration

**Proceed to:** Step E1 — Deep App Audit (6 dimensions, 3 rounds each)
**Skip:** {list any audit dimensions to skip based on scope — typically none}
**Special focus:** {dimensions the user flagged as priorities}
```

---

## Quality Rules

1. **Scan before asking.** Never start with questions — scan first, pre-fill, then ask only what's unknown or uncertain.
2. **Don't re-ask known answers.** If package.json clearly shows Next.js 14, don't ask "what framework are you using?"
3. **Confirm, don't interrogate.** Present pre-filled findings and ask for corrections, not fresh answers.
4. **Pain points must be specific.** "It's slow" is not a pain point. "The dashboard query takes 8s on a 10k row dataset" is.
5. **Record confidence levels.** Low-confidence pre-fills must be explicitly confirmed in the intake session.
