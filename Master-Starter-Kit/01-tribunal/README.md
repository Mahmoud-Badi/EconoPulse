# 01-Research: The Tribunal Process

## What Is a Tribunal?

A Tribunal is a structured adversarial debate between **user personas** and **technical experts** designed to surface every conflict, assumption, and risk **before a single line of code is written**. The core insight is simple: discovering that your dispatcher needs a timeline view costs 30 minutes in a markdown debate but 3 weeks of refactoring after Phase 6.

Instead of one person writing a spec and hoping it covers everything, the Tribunal creates N user-persona agents (one per user type) and 5 technical-expert agents, then orchestrates them through 4 rounds of structured debate. Each persona votes on features, experts reality-check feasibility, and the process produces a scored, prioritized, phase-allocated feature list with every conflict explicitly resolved.

**Surfacing conflicts in markdown is 100x cheaper than fixing them in code.**

## Why Run a Tribunal?

Traditional requirements gathering has three failure modes:

1. **The loudest voice wins.** One stakeholder dominates, and quieter user types get ignored. The Tribunal gives every persona exactly 10 votes — no more, no less.
2. **Technical debt hides in optimism.** "We'll figure it out later" becomes "we need to rewrite the data layer." The Tribunal forces expert assessments before any feature is approved.
3. **Design debt compounds silently.** Nobody argues about visual direction until the app looks like three different products stitched together. Round 3 locks down design language early.

## The Delta TMS Story

During the Delta TMS V3 Tribunal, five personas were created: the Dispatcher, the Driver, the Billing Clerk, the Fleet Manager, and the Compliance Officer. During Round 1 (User Needs), the Dispatcher persona allocated 4 of their 10 votes to "real-time trip visibility" and explicitly stated that a Kanban board alone would not satisfy their workflow — they needed a timeline/Gantt view to see overlapping trips across drivers.

Without the Tribunal, the Kanban board would have been built in Phase 4, shipped, and declared "done." By Phase 8, as the dispatcher onboarded, the timeline requirement would have surfaced as a critical gap — requiring a painful refactor of the dispatch board's data model, state management, and UI layout. The Tribunal caught this in Round 1, before any dispatch code existed, and the timeline view was designed into the architecture from day one.

This single catch saved an estimated 2-3 weeks of development time and prevented a risky mid-project refactor.

## When to Use Each Mode

### Full Tribunal (60-100 output files)

Run the full process when:
- Project timeline exceeds **3 months** of development
- There are **5+ distinct user types** (roles with meaningfully different workflows)
- The domain has **regulatory or compliance requirements** (HIPAA, PCI, GDPR, SOX)
- There are **8+ direct competitors** to research
- You're building a **platform** (not a tool) — something with multiple interconnected modules
- Budget exists for **2-5 days of pre-development research**

Full Tribunal produces:
- 5-20 persona documents
- 5-10 competitor analyses + competition matrix
- 5-15 feature area deep-dives + gap matrix
- 1 design brief + UX patterns catalog
- 3-6 technical feasibility assessments
- 4 debate round proceedings
- 1 verdict document with approved feature list and phase plan

### Abbreviated Tribunal (15-25 output files)

Run the abbreviated process when:
- Project timeline is **1-3 months**
- There are **1-3 user types**
- The domain is well-understood (no novel compliance requirements)
- There are **fewer than 5 competitors** (or the competitive landscape is obvious)
- You're building a **focused tool** (not a platform)

Abbreviated Tribunal skips:
- Competitor deep dives (just do a quick feature matrix)
- Feature area deep dives (fold into persona documents)
- Design research scraping (use 2-3 reference products instead)
- Technical feasibility documents (fold into Round 2 proceedings)

Abbreviated Tribunal runs only Round 1 (User Needs) and Round 4 (Prioritization), producing a verdict in about half the time.

## Teams

### User Persona Agents (N agents, one per user type)

Each persona agent embodies a specific user type. They are generated from the PROJECT-BRIEF.md user descriptions and fleshed out using the `persona.template.md`. Each persona agent:

- Writes their persona document (background, workflow, pain points, deal-breakers)
- Allocates exactly **10 feature votes** across the feature list
- Participates in Round 1 (User Needs) with an opening statement
- Participates in Round 4 (Final Prioritization) with a final vote
- Flags deal-breakers — features without which they would refuse to use the product

### Technical Expert Agents (5 agents, always present)

| Agent | Role | Focus Areas |
|-------|------|-------------|
| **UX Researcher** | Validates workflows match real user behavior | Task flows, cognitive load, error recovery, accessibility |
| **UI Designer** | Defines visual language and component patterns | Layout, typography, color, density, responsiveness |
| **Frontend Developer** | Assesses client-side implementation complexity | State management, performance, bundle size, component architecture |
| **Backend Developer** | Assesses server-side implementation complexity | Data modeling, API design, migrations, scaling, external integrations |
| **Feature Researcher** | Benchmarks features against market leaders | Competitor analysis, table-stakes identification, differentiation opportunities |

## What This Folder Contains

```
01-research/
  README.md                          # This file
  tribunal-guide.md                  # Complete step-by-step process
  competitors/
    README.md                        # How to research competitors
    competitor.template.md           # Per-competitor analysis template
    competition-matrix.template.md   # Feature comparison grid
  personas/
    README.md                        # How to generate personas
    persona.template.md              # Per-persona deep dive template
    priority-matrix.template.md      # Cross-persona voting synthesis
  feature-research/
    README.md                        # Feature deep-dive instructions
    feature-area.template.md         # Per-feature research template
    gap-matrix.template.md           # Table stakes vs differentiators
  design-research/
    README.md                        # UI/UX research instructions
    design-brief.template.md         # Design direction output
    ux-patterns.template.md          # UX patterns by screen type
  technical-feasibility/
    README.md                        # Technical reality-check instructions
    frontend-feasibility.template.md # Frontend complexity assessment
    backend-feasibility.template.md  # Backend complexity assessment
  proceedings/
    round-1-user-needs.template.md       # Persona debate + voting
    round-2-feasibility.template.md      # Expert reality-check
    round-3-design.template.md           # Visual direction debate
    round-4-prioritization.template.md   # Final MoSCoW vote
    verdict.template.md                  # Executive summary + approved plan
```

## Quick Start

1. Complete `00-discovery/PROJECT-BRIEF.md` first — the Tribunal reads from it
2. Read `tribunal-guide.md` for the full process
3. Decide: full or abbreviated Tribunal
4. Generate personas in parallel (one agent per user type)
5. Run research phases (competitors, features, design, feasibility)
6. Execute debate rounds 1-4
7. Produce the verdict — your approved, prioritized, phase-allocated feature list

The verdict feeds directly into `04-phase-planning/` where features become phases with week-level timelines.
