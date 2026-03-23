# Architecture Decisions Log: {{PROJECT_NAME}}

## Purpose

This document records every technical decision made during the architecture phase. It serves three critical functions:

1. **Prevent relitigating** — Once a decision is logged, it's final unless formally updated
2. **Provide rationale** — Future developers (or future you) understand WHY each choice was made
3. **Track changes** — If a decision changes, the original and the update are both preserved

---

## Rules

1. **Log EVERY tech choice.** If it involved choosing between two or more options, it gets an entry.
2. **Never modify an existing entry.** If a decision changes, add a new `DECISION-UPDATE` entry.
3. **Include alternatives.** Every entry must state what was considered and why it was rejected.
4. **Date everything.** Use ISO format (YYYY-MM-DD).
5. **One decision per row.** Don't combine multiple decisions into one entry.

---

## Governance Lifecycle

Every ADR moves through a governance lifecycle. This prevents decisions from being relitigated without evidence.

```
NEW → FORMALIZED → LOCKED → AFFIRMED / MODIFIED / SUPERSEDED
```

| Status | Meaning | Can Change? |
|--------|---------|------------|
| **NEW** | Just proposed, under discussion | Yes — freely |
| **FORMALIZED** | Accepted, documented with rationale | Yes — with justification |
| **LOCKED** | Battle-tested, proven in production | Only via Tribunal amendment |
| **AFFIRMED** | Tribunal reviewed, confirmed correct | Only via new Tribunal |
| **MODIFIED** | Tribunal reviewed, adjusted | Only via new Tribunal |
| **SUPERSEDED** | Replaced by a newer ADR | No — historical record |

### Locking an ADR

An ADR gets LOCKED when:
- It has been in production for 2+ sprints without issues
- No team member has requested reconsideration
- The decision has proven correct in practice

### Amending a LOCKED ADR

To change a LOCKED ADR, you must go through the Tribunal amendment process:
1. File a "Charge" — what's wrong with the current decision?
2. Present evidence — code examples, performance data, user feedback
3. Propose alternative — what should replace it?
4. Tribunal debate — adversarial review of both positions
5. Verdict — AFFIRM (keep), MODIFY (adjust), or SUPERSEDE (replace)

### Forbidden Reversions

Some ADRs include a "Forbidden Reversions" field — things that must NEVER be undone regardless of circumstances. Example: "Never store JWT tokens in localStorage" or "Never use raw SQL queries without parameterization."

---

## Decision Record

### Format

```
### ADR-{NUMBER}: {DECISION_TITLE}

**Date:** {YYYY-MM-DD}
**Category:** {Stack / Database / API / Auth / UI / Real-Time / Testing / Deployment / Integration / Other}
**Status:** {NEW / FORMALIZED / LOCKED / AFFIRMED / MODIFIED / SUPERSEDED by ADR-{N}}

**Decision:** {What was decided, stated clearly}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}
- {Alternative 2} — Rejected because {reason}

**Rationale:** {Why this option was chosen over the alternatives}

**Forbidden Reversions:** {What must NEVER be undone, even if this ADR is superseded}

**Cross-References:**
- Code: {paths to key files implementing this decision}
- Hub: {service hub files affected}
- Related ADRs: {ADR-NNN, ADR-NNN}

**Consequences:**
- {Positive consequence}
- {Negative consequence or trade-off}
- {Implication for future development}
```

---

## Decisions

### ADR-001: Project Structure

**Date:** {YYYY-MM-DD}
**Category:** Stack
**Status:** Accepted

**Decision:** {Monorepo with Turborepo + pnpm / Monolith / Microservices}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}
- {Alternative 2} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}
- {Consequence 2}

---

### ADR-002: Frontend Framework

**Date:** {YYYY-MM-DD}
**Category:** Stack
**Status:** Accepted

**Decision:** {Next.js App Router / Remix / SvelteKit / Astro}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}
- {Alternative 2} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}
- {Consequence 2}

---

### ADR-003: API Layer

**Date:** {YYYY-MM-DD}
**Category:** API
**Status:** Accepted

**Decision:** {tRPC / REST / GraphQL}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-004: ORM / Database Access

**Date:** {YYYY-MM-DD}
**Category:** Database
**Status:** Accepted

**Decision:** {Drizzle ORM / Prisma / Kysely / Raw SQL}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-005: Database Provider

**Date:** {YYYY-MM-DD}
**Category:** Database
**Status:** Accepted

**Decision:** {PostgreSQL on Supabase / Neon / MySQL on PlanetScale / SQLite on Turso}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-006: Authentication Provider

**Date:** {YYYY-MM-DD}
**Category:** Auth
**Status:** Accepted

**Decision:** {Better Auth / NextAuth / Clerk / Custom}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-007: Styling Approach

**Date:** {YYYY-MM-DD}
**Category:** UI
**Status:** Accepted

**Decision:** {Tailwind + shadcn/ui / CSS Modules / Styled Components / Panda CSS}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-008: Real-Time Strategy

**Date:** {YYYY-MM-DD}
**Category:** Real-Time
**Status:** Accepted

**Decision:** {SSE / WebSocket / Polling / None}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-009: Testing Framework

**Date:** {YYYY-MM-DD}
**Category:** Testing
**Status:** Accepted

**Decision:** {Vitest + Playwright / Jest + Cypress / Bun Test + Playwright}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

### ADR-010: Deployment Platform

**Date:** {YYYY-MM-DD}
**Category:** Deployment
**Status:** Accepted

**Decision:** {Vercel / AWS / Docker / Cloudflare}

**Alternatives Considered:**
- {Alternative 1} — Rejected because {reason}

**Rationale:** {Why}

**Consequences:**
- {Consequence 1}

---

## Additional Decisions

Add entries for decisions beyond the 10 core stack choices:

### ADR-011: {{TITLE}}

**Date:** {YYYY-MM-DD}
**Category:** {Category}
**Status:** Accepted

**Decision:** {What}

**Alternatives Considered:**
- {Alt} — Rejected because {reason}

**Rationale:** {Why}

---

### ADR-012: {{TITLE}}

*(Continue numbering sequentially for database schema conventions, API patterns, component library choices, integration selections, etc.)*

---

## Decision Updates

When a previously accepted decision needs to change, add an entry here. The original ADR keeps its `Accepted` status changed to `Superseded by ADR-{N}`.

### Format for Updates

```
### ADR-{NUMBER}: DECISION-UPDATE — {TITLE}

**Date:** {YYYY-MM-DD}
**Supersedes:** ADR-{ORIGINAL_NUMBER}
**Category:** {Category}
**Status:** Accepted

**Original Decision:** {What was decided before}
**New Decision:** {What is decided now}

**What Changed:** {What new information or requirement triggered this change}

**Impact Analysis:**
- Files affected: {list}
- Migration needed: {yes/no — describe steps if yes}
- Data migration needed: {yes/no}
- Estimated effort: {hours/days}

**Rationale:** {Why the change is necessary}
```

### Example Update

```
### ADR-015: DECISION-UPDATE — Auth Provider Change

**Date:** 2026-03-15
**Supersedes:** ADR-006
**Category:** Auth
**Status:** Accepted

**Original Decision:** Clerk for managed authentication
**New Decision:** Better Auth for self-hosted authentication

**What Changed:** Clerk costs exceeded budget at 5,000 monthly active users ($75/mo).
Client requires user data to remain on our infrastructure for compliance.

**Impact Analysis:**
- Files affected: packages/auth/*, apps/web/src/middleware.ts, all auth-related components
- Migration needed: Yes — replace Clerk SDK with Better Auth, create DB tables for sessions
- Data migration needed: Yes — export users from Clerk, import to local DB
- Estimated effort: 3-5 days

**Rationale:** Self-hosted auth eliminates per-user costs and gives full data ownership.
Better Auth is the recommended replacement per the tech stack decision tree.
```

---

## Summary Statistics

| Category | Decisions | Updates |
|----------|-----------|---------|
| Stack | {N} | {N} |
| Database | {N} | {N} |
| API | {N} | {N} |
| Auth | {N} | {N} |
| UI | {N} | {N} |
| Real-Time | {N} | {N} |
| Testing | {N} | {N} |
| Deployment | {N} | {N} |
| Integration | {N} | {N} |
| Other | {N} | {N} |
| **Total** | **{{TOTAL}}** | **{{TOTAL}}** |

---

## Checklist

- [ ] All 10 core stack decisions have entries (ADR-001 through ADR-010)
- [ ] Every decision has at least one alternative considered
- [ ] Every decision has a rationale
- [ ] Every decision has a date
- [ ] No decision entry has been modified after initial creation
- [ ] All decision updates use the `DECISION-UPDATE` format
- [ ] Integration selections have ADR entries
- [ ] Database schema conventions have an ADR entry
- [ ] API naming conventions have an ADR entry
- [ ] Summary statistics are accurate
