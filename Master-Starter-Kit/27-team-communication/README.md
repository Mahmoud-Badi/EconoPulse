# Phase 27: Team Communication & Agile Ceremonies

> Once team size exceeds one person, communication overhead is the primary productivity killer. Bad standups waste time, missing retrospectives prevent learning, and unclear decision processes cause relitigating. This section provides the ceremony infrastructure.

---

## Why This Exists

Communication overhead grows quadratically with team size. Two people have one communication path. Five people have ten. Ten people have forty-five. Without deliberate ceremony design, teams default to ad-hoc interruptions (constant Slack messages, tap-on-the-shoulder questions, unstructured meetings that run long). Every interruption costs 23 minutes of refocus time. A team of five with no communication structure can lose 30-40% of productive time to context-switching, repeated status questions, and relitigated decisions.

The solution is not more meetings. The solution is the right meetings, at the right cadence, with the right format, producing the right artifacts. A well-run standup takes 10 minutes and replaces 15 ad-hoc interruptions. A well-run retrospective takes 60 minutes and prevents the same mistakes from recurring every sprint. A decision log takes 5 minutes to write and prevents 3 hours of re-debating the same choice next month.

This section provides production-ready templates for every ceremony a development team needs, scaled by team size. Solo developers get lightweight self-review processes. Two-person teams get async standups and weekly planning. Full teams get the complete sprint cycle. Every template is designed to be copy-pasted, filled in, and used immediately — no ceremony theater, no process for the sake of process, only communication infrastructure that directly reduces waste and improves delivery.

---

## Conditional Activation

Most files in this section activate when `{{TEAM_SIZE}} > 1`. However, several files provide value for solo developers:

- **Product Decision Log** — solo developers still make product decisions that need documenting for future reference (or for when the team grows)
- **Team Health Check** — the solo developer version doubles as a quarterly self-assessment and burnout prevention tool
- **Ceremony Cadence Planner** — provides a lightweight weekly self-review framework for solo developers
- **Meeting Agenda Templates** — the incident postmortem format is useful regardless of team size

If `{{TEAM_SIZE}} == 1`, use the solo developer variants documented in each file. When the team grows, upgrade to the full ceremony set.

---

## How It Integrates with the Orchestrator

This section connects to **Orchestrator Step 18.5** (Team Communication & Agile Ceremonies). It runs after:

- **Step 6** (Development Workflow) — you have STATUS.md, branching strategy, and PR templates from `06-development-workflow`
- **Step 8** (Quality & Testing) — you know your testing strategy and quality gates
- **Step 4** (Phase Planning) — you have your project phases and milestones from `04-phase-planning`

It feeds into:

- **Step 20** (Post-Launch) — retrospective action items and team health trends inform post-launch process improvements
- **Step 21** (Incident Response) — postmortem meeting format feeds directly into incident response ceremonies via `21-incident-response`
- **Step 23** (Customer Support) — stakeholder update cadence aligns with customer communication rhythms via `23-customer-support`

### Data Flow

```
04-phase-planning (milestones, sprint boundaries)
        |
        v
06-development-workflow (STATUS.md, PR templates, branching)
        |
        v
27-team-communication <-- 08-quality-testing (quality gates)
        |
        |---> 20-post-launch (retro actions, health trends)
        |---> 21-incident-response (postmortem format)
        |---> 23-customer-support (stakeholder cadence)
        '---> 25-financial-modeling (sprint velocity --> delivery projections)
```

### Key Dependencies

| Dependency | Source | What It Provides |
|------------|--------|------------------|
| STATUS.md | `06-development-workflow` | Task IDs, backlog, sprint board — standups reference this |
| Sprint structure | `04-phase-planning` | Phase durations and milestones define sprint boundaries |
| PR templates | `06-development-workflow` | PR descriptions serve as async communication artifacts |
| Quality gates | `08-quality-testing` | Definition of done for sprint reviews and demos |
| Architecture decisions | `02-architecture` | ADR format extends into product decision log |

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Section overview, integration map, reading order | 18.5 |
| `standup-templates.md` | Guide | Three standup formats: sync, async, weekly | 18.5 |
| `sprint-planning.template.md` | Template | Sprint planning meeting structure with capacity calculation | 18.5 |
| `retrospective-formats.md` | Guide | Five retro formats with full facilitation instructions | 18.5 |
| `demo-showcase.template.md` | Template | Sprint demo meeting structure with feedback capture | 18.5 |
| `stakeholder-update-cadence.template.md` | Template | Stakeholder mapping, update templates, escalation protocol | 18.5 |
| `product-decision-log.template.md` | Template | Product decision records (PDR) with categorization | 18.5 |
| `team-health-check.template.md` | Template | Spotify-model health check adapted for small teams | 18.5 |
| `meeting-agenda-templates.md` | Guide | Ready-to-use agendas for 1-on-1s, design reviews, postmortems | 18.5 |
| `async-communication-guide.md` | Guide | Async vs sync decision matrix, RFC process, PR-as-docs | 18.5 |
| `ceremony-cadence-planner.md` | Guide | Decision tree by team size with time budgets | 18.5 |

---

## Reading Order

1. **README.md** — you are here; understand the section structure
2. **ceremony-cadence-planner.md** — determine which ceremonies your team size needs
3. **standup-templates.md** — set up daily communication first (highest frequency)
4. **sprint-planning.template.md** — structure your sprint cycle
5. **demo-showcase.template.md** — define how you show work at sprint end
6. **retrospective-formats.md** — pick a retro format and commit to it
7. **stakeholder-update-cadence.template.md** — map stakeholders and set expectations
8. **product-decision-log.template.md** — start logging decisions immediately
9. **team-health-check.template.md** — schedule your first health check
10. **meeting-agenda-templates.md** — reference as needed for specific meeting types
11. **async-communication-guide.md** — establish async norms and RFC process

---

## Quick Start

If you are short on time, do these three things:

1. **Pick a standup format** from `standup-templates.md` and start tomorrow
2. **Create your first product decision log entry** using `product-decision-log.template.md`
3. **Schedule a retrospective** using the Start/Stop/Continue format from `retrospective-formats.md`

Everything else can be adopted incrementally as pain points emerge.

---

## Anti-Patterns This Section Prevents

| Anti-Pattern | Symptom | File That Fixes It |
|-------------|---------|-------------------|
| Status meetings disguised as standups | Standups run 30+ minutes, people report to manager | `standup-templates.md` |
| No retrospectives | Same mistakes repeat every sprint | `retrospective-formats.md` |
| Decisions made in hallway conversations | Team relitigates decisions weekly | `product-decision-log.template.md` |
| Stakeholders surprised by delays | Escalations come too late | `stakeholder-update-cadence.template.md` |
| Too many meetings | Ceremony time exceeds 15% of work hours | `ceremony-cadence-planner.md` |
| Async teams blocked by timezone gaps | Messages unanswered for 24+ hours | `async-communication-guide.md` |
| No team pulse check | Burnout goes undetected until someone quits | `team-health-check.template.md` |
| Demos with no structure | Sprint reviews are rambling and miss key feedback | `demo-showcase.template.md` |
