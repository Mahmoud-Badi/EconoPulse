# Tribunal Verdict: {{PROJECT_NAME}}

> **Date:** {YYYY-MM-DD}
> **Status:** **{APPROVED / REQUIRES REVISION}**
> **Tribunal Duration:** {N days from start to verdict}
> **Participants:** {N persona agents + 5 expert agents}
> **Documents Produced:** {N total documents across all folders}

---

## Executive Summary

{3-5 sentences summarizing the Tribunal outcome. Cover: what the product is, how many features were evaluated, how many made it to Must-Have, total estimated timeline, and the most significant decision or conflict resolution.

Example: "The Delta TMS V3 Tribunal evaluated 42 features across 7 feature areas for a wheelchair transportation management system. Five personas (Dispatcher, Driver, Billing Clerk, Fleet Manager, Compliance Officer) allocated 50 total votes, and 5 technical experts assessed feasibility. The Tribunal approved 18 Must-Have features, 10 Should-Have features, and deferred 14 features to V2+. The total approved scope is 18 phases over approximately 24 weeks. The most significant decision was resolving the GPS tracking conflict between the Dispatcher (who needs it for operations) and the Driver (who resists it for privacy), resulting in an opt-in tracking model with clear privacy boundaries."}

---

## Vote Summary

| Metric | Value |
|--------|-------|
| **Total features evaluated** | {N} |
| **Must-Have (approved)** | {N} features, {N} developer-days |
| **Should-Have (approved)** | {N} features, {N} developer-days |
| **Could-Have** | {N} features, {N} developer-days |
| **Won't Have (deferred to V2+)** | {N} features |
| **Total V1 scope** | {Must + Should + Could} features |
| **Total V1 effort** | {N} developer-days ({N} weeks at 5 days/week) |
| **Phases** | {N} phases |
| **Estimated timeline** | {N} weeks (+ {N}% buffer = {N} weeks) |

---

## Approved Feature List

### Must Have (Launch Blockers)

These features are required for launch. The product cannot ship without them.

| # | Feature | Phase | Effort (days) | Persona Votes | Expert Approval |
|---|---------|-------|--------------|---------------|-----------------|
| 1 | {Feature} | {0} | {N} | {N/N} | {Unanimous / Majority} |
| 2 | {Feature} | {1} | {N} | {N/N} | {Approval} |
| 3 | {Feature} | {1} | {N} | {N/N} | {Approval} |
| 4 | {Feature} | {1} | {N} | {N/N} | {Approval} |
| 5 | {Feature} | {2} | {N} | {N/N} | {Approval} |
| 6 | {Feature} | {2} | {N} | {N/N} | {Approval} |
| 7 | {Feature} | {2} | {N} | {N/N} | {Approval} |
| 8 | {Feature} | {3} | {N} | {N/N} | {Approval} |
| 9 | {Feature} | {3} | {N} | {N/N} | {Approval} |
| 10 | {Feature} | {3} | {N} | {N/N} | {Approval} |

**Total Must-Have effort:** {N} developer-days

### Should Have (Important, Deferrable)

Target for V1 but can slip to post-launch update.

| # | Feature | Target Phase | Effort (days) | Risk if Deferred |
|---|---------|-------------|--------------|-----------------|
| 1 | {Feature} | {4} | {N} | {Low/Med/High} |
| 2 | {Feature} | {4} | {N} | {Risk} |
| 3 | {Feature} | {5} | {N} | {Risk} |
| 4 | {Feature} | {5} | {N} | {Risk} |
| 5 | {Feature} | {5} | {N} | {Risk} |

**Total Should-Have effort:** {N} developer-days

### Deferred to V2+

| # | Feature | Reason Deferred | Revisit Trigger |
|---|---------|----------------|----------------|
| 1 | {Feature} | {Reason} | {When to revisit} |
| 2 | {Feature} | {Reason} | {Trigger} |
| 3 | {Feature} | {Reason} | {Trigger} |
| 4 | {Feature} | {Reason} | {Trigger} |
| 5 | {Feature} | {Reason} | {Trigger} |

---

## Approved Tech Stack

Confirmed from the project brief, validated by technical experts in Round 2.

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Monorepo** | {e.g., Turborepo + pnpm} | {Latest} | {Why} |
| **Framework** | {e.g., Next.js} | {16} | {Why} |
| **UI Library** | {e.g., React} | {19} | {Why} |
| **Styling** | {e.g., Tailwind CSS} | {4} | {Why} |
| **Components** | {e.g., shadcn/ui} | {Latest} | {Why} |
| **API** | {e.g., tRPC} | {v11} | {Why} |
| **ORM** | {e.g., Drizzle} | {Latest} | {Why} |
| **Database** | {e.g., PostgreSQL} | {16} | {Why} |
| **Auth** | {e.g., Better Auth} | {Latest} | {Why} |
| **State** | {e.g., TanStack Query + Zustand} | {Latest} | {Why} |
| **Real-time** | {e.g., SSE} | {Native} | {Why} |
| **Testing** | {e.g., Vitest + Playwright} | {Latest} | {Why} |
| **Linting** | {e.g., Biome} | {Latest} | {Why} |
| **Deployment** | {e.g., Vercel} | {N/A} | {Why} |

**Tech stack concerns raised in Round 2:**
- {e.g., "SSE is sufficient for V1 but WebSocket may be needed for V2 bidirectional features (chat). Architecture should allow easy upgrade."}
- {Concern and resolution}

---

## Approved Design Direction

From Round 3:

| Decision | Approved Value |
|----------|---------------|
| **Brand personality** | {3-5 adjectives} |
| **Primary color** | {Color name + hex} |
| **Font** | {Font family + base size} |
| **Navigation** | {Pattern description} |
| **Data density** | {Strategy — dense for operations, comfortable for management} |
| **Mobile strategy** | {Responsive / Adaptive / etc.} |
| **Icon library** | {Name} |
| **Component base** | {Library name} |

**Design tokens to implement in Phase 0:**
- Color palette ({N} tokens)
- Typography scale ({N} tokens)
- Spacing scale ({N} tokens)
- Border radius, shadows, borders

**Anti-patterns encoded:**
1. {Rule 1}
2. {Rule 2}
3. {Rule 3}
4. {Rule 4}
5. {Rule 5}

---

## Approved Phase Plan

| Phase | Name | Goal | Features | Weeks | Cumulative |
|-------|------|------|----------|-------|-----------|
| 0 | Foundation | {Auth, DB, design system, project structure} | {N} | {N} | {N} |
| 1 | {Name} | {Goal} | {N} | {N} | {N} |
| 2 | {Name} | {Goal} | {N} | {N} | {N} |
| 3 | {Name} | {Goal} | {N} | {N} | {N} |
| 4 | {Name} | {Goal} | {N} | {N} | {N} |
| 5+ | {Name} | {Goal} | {N} | {N} | {N} |
| | **Total** | | **{N}** | **{N}** | |
| | **With 25% buffer** | | | **{N}** | |

**Phase dependencies:**
```
Phase 0 ──→ Phase 1 ──→ Phase 2
                    └──→ Phase 3
                              └──→ Phase 4
                                        └──→ Phase 5+
```

---

## Key Conflicts Resolved

Every significant conflict surfaced during the Tribunal, along with how it was resolved.

### Conflict 1: {Title}

**Between:** {Persona X} vs. {Persona Y / Expert Z}
**The Tension:** {2-3 sentences describing the disagreement}
**Resolution:** {How it was resolved}
**Implemented As:** {Specific feature/design decision}
**Phase:** {When this resolution is implemented}

### Conflict 2: {Title}

**Between:** {Parties}
**The Tension:** {Description}
**Resolution:** {Resolution}
**Implemented As:** {Feature/decision}
**Phase:** {Phase}

### Conflict 3: {Title}

**Between:** {Parties}
**The Tension:** {Description}
**Resolution:** {Resolution}
**Implemented As:** {Feature/decision}
**Phase:** {Phase}

---

## Critical Warnings

Risks, compliance requirements, and dependencies that the development team must be aware of throughout the project.

### Warning 1: {Title}

**Category:** {Compliance / Performance / Dependency / Security / Timeline}
**Description:** {What the risk is and why it matters}
**Mitigation:** {What the team should do about it}
**Owner:** {Who is responsible for monitoring this}
**Review Cadence:** {When to reassess — per-phase, monthly, etc.}

### Warning 2: {Title}

**Category:** {Category}
**Description:** {Description}
**Mitigation:** {Mitigation}
**Owner:** {Owner}
**Review Cadence:** {Cadence}

### Warning 3: {Title}

**Category:** {Category}
**Description:** {Description}
**Mitigation:** {Mitigation}
**Owner:** {Owner}
**Review Cadence:** {Cadence}

---

## Deal-Breakers Addressed

Every deal-breaker raised by any persona, with confirmation that it's addressed in the approved plan.

| Deal-Breaker | Raised By | Addressed In | Phase | Satisfied? |
|-------------|-----------|-------------|-------|-----------|
| {e.g., Sub-2s trip assignment} | {Persona A} | {Performance budget for dispatch board} | {1} | {Yes — performance target in exit criteria} |
| {Deal-breaker} | {Persona} | {Solution} | {Phase} | {Yes/Partially — with note} |
| {Deal-breaker} | {Persona} | {Solution} | {Phase} | {Yes/Partially} |
| {Deal-breaker} | {Persona} | {Solution} | {Phase} | {Yes/Partially} |

---

## What Happens Next

This verdict document feeds into:

| Destination | What It Receives | Action |
|-------------|-----------------|--------|
| `04-phase-planning/` | Phase plan + feature allocation | Break each phase into week-level tasks with story points |
| `02-architecture/` | Tech stack + data model decisions | Finalize system architecture, define API contracts |
| `03-documentation/` | Approved feature list | Write detailed feature specs for each Must-Have feature |
| `07-ui-design-system/` | Design direction + tokens | Implement design system in code (colors, typography, components) |
| `05-dev-infrastructure/` | Tech stack decisions | Set up monorepo, CI/CD, linting, testing framework |

---

## Tribunal Metadata

| Field | Value |
|-------|-------|
| **Tribunal initiated** | {YYYY-MM-DD} |
| **Tribunal completed** | {YYYY-MM-DD} |
| **Total elapsed time** | {N days} |
| **Personas generated** | {N} |
| **Competitors analyzed** | {N} |
| **Feature areas researched** | {N} |
| **Total documents produced** | {N} |
| **Debate rounds conducted** | {4 / 2 (abbreviated)} |
| **Conflicts surfaced** | {N} |
| **Conflicts resolved** | {N} |
| **Deal-breakers identified** | {N} |
| **Deal-breakers addressed** | {N} |

---

## Approval

This verdict was produced by the Tribunal process and represents the consensus of {N} persona agents and 5 technical expert agents.

**Status:** **{APPROVED / REQUIRES REVISION}**

If REQUIRES REVISION, the following must be addressed before approval:

1. {Issue requiring revision}
2. {Issue}
3. {Issue}

---

*This is the final output of the 01-research Tribunal process. Development begins with Phase 0 as defined above.*
