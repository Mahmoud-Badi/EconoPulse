# 31 — Stakeholder Communications

> Lifecycle-spanning communication engine for keeping stakeholders informed from day 1 through post-launch.

## What This Is

A unified communications hub with phase-gated templates, Miro-native exports, Mermaid diagrams, recurring report templates, and an auto-generator that reads your project state and produces audience-targeted artifacts.

## Why It Exists

Stakeholders (founders, investors, clients, cross-functional teams) need to understand what's being built, why, and how it's progressing. Without a system, communication is improvised, inconsistent, and always feels like an afterthought. This module makes stakeholder communication a first-class part of the planning process — starting at Step 1, not Step 18.

## When It's Used

| Orchestrator Step | What Gets Generated |
|---|---|
| Step 1 (Intake) | Kickoff deck, vision summary, initial scope |
| Step 1.7 (Comms Setup) | Communication plan, audience matrix |
| Step 3 (Tribunal) | System mind map, tech decisions in plain English |
| Step 4 (Foundation) | Roadmap overview, timeline & milestones |
| Step 5 (Services) | Miro: system mind map, service architecture |
| Step 8 (Tasks) | Sprint goals, feature priorities for stakeholders |
| Step 9 (Dashboard) | Feature status matrix, resource allocation, Gantt |
| Step 13 (Design) | User journey maps (Miro + Mermaid) |
| Step 16 (Handoff) | Full stakeholder package (all comms compiled) |
| Step 18.5 (Ceremonies) | Recurring update cadence established |
| Sprint boundaries | Sprint summary, milestone progress, risk updates |
| Pre-launch | Feature showcase, go/no-go decision |
| Post-launch | Launch results, next phase roadmap |

## Folder Structure

```
31-stakeholder-communications/
├── README.md                      ← You are here
├── communication-plan.template.md ← Master plan: who gets what, when, how
├── audience-matrix.template.md    ← Maps stakeholders to their needs
│
├── phase-packs/                   ← Templates organized by project lifecycle phase
│   ├── 01-discovery/              ← Day 1: present the plan, get buy-in
│   ├── 02-architecture/           ← After research: system overview, tech decisions
│   ├── 03-sprint-planning/        ← Sprint kickoff: goals, priorities, resources
│   ├── 04-active-development/     ← During build: progress, risks, demos
│   ├── 05-testing-qa/             ← QA phase: quality confidence, bug triage
│   ├── 06-pre-launch/             ← Final sign-off: showcase, scope, go/no-go
│   └── 07-post-launch/            ← Results: metrics, feedback, next phase
│
├── diagrams/                      ← 42 Mermaid diagram templates (12 categories)
├── recurring/                     ← Weekly, monthly, quarterly report templates
└── COMMS-GENERATOR.md             ← Generator prompt: reads project state → produces comms
```

## How to Use

### During Orchestrator Execution
The orchestrator triggers communication generation at each gate checkpoint. Templates are auto-filled with real project data and saved to `dev_docs/comms/`.

### On-Demand
Use the `/stakeholder-report` command:
```
/stakeholder-report                    # Auto-detect phase, all audiences
/stakeholder-report --audience exec    # Executive audience only
/stakeholder-report --phase kickoff    # Force specific phase
/stakeholder-report --full             # Everything for all completed phases
```

## Audiences

Every template supports 4 audience tiers:

| Audience | What They Need | Tone |
|---|---|---|
| **Executive** | High-level progress, budget, timeline, blockers | No jargon, traffic-light status, one-page max |
| **Investor** | Metrics, milestones, ROI, runway, growth | Numbers-first, trend indicators, comparisons |
| **Client** | Deliverable status, demos, approval gates | Deliverable-focused, demo schedule, sign-off points |
| **Team** | Dependencies, blockers, technical handoffs | Technical detail, action items, cross-team coordination |

## Template Conventions

- All templates use `{{PLACEHOLDER}}` syntax (resolved from CONFIG during project setup)
- Traffic-light status: `[GREEN] On track`, `[YELLOW] At risk`, `[RED] Blocked`
- Technical concepts include plain-English translations
- Recurring reports include "What changed since last update" diffs
- Visual content (diagrams, mind maps) appears before text explanations

## Output Location

All generated communications go to:
```
dev_docs/comms/
├── communication-plan.md
├── audience-matrix.md
├── 01-kickoff/
├── 02-architecture/
├── 03-sprint-planning/
├── 04-active-development/
├── 05-testing/
├── 06-pre-launch/
├── 07-post-launch/
├── miro/
├── diagrams/
├── recurring/
└── handoff-package/
```
