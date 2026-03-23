# Tribunal Verdict — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in tribunal verdict for a fictional
# project management SaaS. Your tribunal verdict will be generated
# during ORCHESTRATOR Step 3 (Run the Tribunal).
# ============================================================

> **Date:** 2026-03-01
> **Rounds completed:** 10/10
> **Personas voted:** Admin, Project Manager, Team Member
> **Expert panel:** UX Researcher, UI Designer, Frontend Dev, Backend Dev, Feature Researcher

---

## Binding Feature List

### Must-Have (MVP)

| # | Feature | Persona Votes | Expert Consensus | Phase |
|---|---------|--------------|-----------------|-------|
| 1 | Project CRUD with status workflow | Admin: 5, PM: 5, TM: 2 | Unanimous | 1 |
| 2 | Task board (Kanban + list views) | PM: 5, TM: 5, Admin: 1 | Unanimous | 1 |
| 3 | Time tracking (start/stop + manual) | TM: 5, PM: 4, Admin: 3 | Unanimous | 2 |
| 4 | Team management + role assignment | Admin: 5, PM: 3 | Unanimous | 1 |
| 5 | Dashboard with project KPIs | PM: 4, Admin: 4, TM: 1 | Unanimous | 2 |
| 6 | Email notifications (task assigned, due soon, overdue) | PM: 3, TM: 3, Admin: 1 | Majority (4/5) | 2 |
| 7 | Weekly status report generation | PM: 5, Admin: 3 | Unanimous | 3 |
| 8 | Auth (login, register, password reset, invite) | All: mandatory | Unanimous | 0 |
| 9 | Multi-tenant workspace isolation | Admin: mandatory | Unanimous | 0 |
| 10 | Settings (workspace, profile, notifications) | Admin: 2, PM: 1, TM: 1 | Unanimous | 3 |

### Should-Have (Post-MVP)

| # | Feature | Persona Votes | Target Phase |
|---|---------|--------------|-------------|
| 11 | Client portal (read-only project view) | PM: 3, Admin: 2 | 4 |
| 12 | File attachments on tasks | TM: 3, PM: 2 | 4 |
| 13 | Recurring tasks | PM: 2, TM: 2 | 4 |
| 14 | Project templates | PM: 3, Admin: 1 | 5 |
| 15 | Calendar view for tasks | PM: 2, TM: 2 | 5 |

### Nice-to-Have (Deferred)

| # | Feature | Notes |
|---|---------|-------|
| 16 | Gantt chart | Complex UI, low persona votes, defer to v2 |
| 17 | Resource allocation / capacity planning | Requires time tracking maturity, defer |
| 18 | Import from Asana / Monday.com | Post-launch growth feature |
| 19 | Mobile native app | Responsive web covers 80% of mobile use cases |
| 20 | AI task suggestions | Novel feature, high risk, defer |

---

## Persona Vote Distribution

Each persona had 10 votes to distribute (max 5 per feature):

| Feature | Admin (10) | PM (10) | TM (10) | Total |
|---------|-----------|---------|---------|-------|
| Project CRUD | 5 | 5 | 2 | 12 |
| Task board | 1 | 5 | 5 | 11 |
| Time tracking | 3 | 4 | 5 | 12 |
| Team management | 5 | 3 | 0 | 8 |
| Dashboard | 4 | 4 | 1 | 9 |
| Notifications | 1 | 3 | 3 | 7 |
| Reports | 3 | 5 | 0 | 8 |
| Settings | 2 | 1 | 1 | 4 |

---

## Expert Deal-Breakers

| Expert | Deal-Breaker | Resolution |
|--------|-------------|------------|
| UX Researcher | Task board must support both Kanban and list view — teams are split | Include both views, default to Kanban |
| UI Designer | Dashboard must not use default shadcn — needs custom data viz | Design tokens + custom chart components in Phase 1 |
| Backend Dev | Multi-tenancy must use row-level security, not schema isolation | Row-level with `workspaceId` FK on all tables |
| Frontend Dev | Time tracking needs optimistic updates — can't wait for server round-trip | Use TanStack Query with optimistic mutation |
| Feature Researcher | Competitors all have weak mobile — responsive web is sufficient for MVP | Confirmed: no native app needed for MVP |

---

## Phase Allocation

| Phase | Focus | Features | Weeks |
|-------|-------|----------|-------|
| 0 | Foundation | Auth (#8), multi-tenancy (#9), design system | 1 |
| 1 | Core | Projects (#1), Tasks (#2), Team (#4) | 2-3 |
| 2 | Productivity | Time tracking (#3), Dashboard (#5), Notifications (#6) | 4-6 |
| 3 | Polish | Reports (#7), Settings (#10), E2E tests | 7-9 |
| 4 | Growth | Client portal (#11), Attachments (#12), Recurring (#13) | 10-12 |

---

## Verdict

This feature list is a **binding contract**. Features do not change without running a mini-Tribunal. The MVP (Phases 0-3) delivers a complete project management tool with time tracking and reporting — enough to replace spreadsheet workflows for small agencies. Post-MVP (Phase 4) adds client-facing features that justify the Agency pricing tier.

**Total MVP scope:** 10 features, 22 screens, 7 services, ~9 weeks of development.

---

## Enforcement Protocol

Once a tribunal verdict is issued, the binding feature list is **locked**. No feature may be added, removed, or materially changed without running a mini-tribunal. This prevents scope creep and ensures that changes receive the same adversarial scrutiny as the original plan.

**What counts as a material change:**
- Adding a new feature to any tier (Must-Have, Should-Have, Nice-to-Have)
- Removing a feature from Must-Have
- Changing the phase allocation of a Must-Have feature
- Altering an expert deal-breaker resolution

**What does NOT require a mini-tribunal:**
- Bug fixes within an approved feature
- UI refinements that don't change functionality
- Moving a Should-Have feature to a later phase (deferral is always allowed)
- Implementation detail changes (e.g., switching from Resend to SendGrid for email)

---

## Mini-Tribunal Procedure

When a locked feature needs modification, run a 3-round abbreviated tribunal instead of the full 10-round process.

### Format

| Round | Activity | Output |
|-------|----------|--------|
| **1 — Charge** | State the proposed change, the reason, and the impact on scope/timeline. Present evidence (user feedback, technical constraint, data). | Written charge document (1 page max) |
| **2 — Debate** | Each affected persona votes on the change. Each expert states support/oppose with rationale. Raise deal-breakers if any. | Vote tally + expert opinions |
| **3 — Verdict** | Majority vote decides. If any expert raises a deal-breaker, it must be resolved before the change is accepted. Update the binding feature list. | Updated verdict with change log appended |

### When to Use
- A stakeholder requests a feature change to a locked item
- A technical constraint makes an approved feature infeasible as specified
- User research invalidates an assumption baked into the feature list

### Who Participates
- All original personas who voted on the affected feature
- All experts whose domain is impacted by the change
- The project lead (tiebreaker vote if needed)

### Turnaround
- **48-hour maximum** from charge submission to verdict
- If the change is blocking active development, an emergency mini-tribunal can be completed in a single synchronous session

---

## Verdict Lifecycle

Every tribunal verdict progresses through a defined set of states:

```
NEW → FORMALIZED → LOCKED → AFFIRMED / MODIFIED / SUPERSEDED
```

| State | Meaning | Transition Trigger |
|-------|---------|-------------------|
| **NEW** | Verdict has been drafted but not yet reviewed by all participants | Initial creation |
| **FORMALIZED** | All personas and experts have signed off on the verdict | All participants confirm |
| **LOCKED** | Verdict is in effect — features are frozen, development proceeds against this contract | Project lead locks after formalization |
| **AFFIRMED** | A mini-tribunal reviewed a challenge and upheld the original verdict without changes | Mini-tribunal Round 3 vote: no change |
| **MODIFIED** | A mini-tribunal approved a change — the verdict is updated with an appended change log | Mini-tribunal Round 3 vote: change accepted |
| **SUPERSEDED** | A full re-tribunal replaced this verdict entirely (rare — usually triggered by pivot or major scope change) | New full 10-round tribunal completed |

**Audit trail:** Every state transition is logged with date, trigger, and participants. The change log is appended to the bottom of the verdict file, never edited inline.
