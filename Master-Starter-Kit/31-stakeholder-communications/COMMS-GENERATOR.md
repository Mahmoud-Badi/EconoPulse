# Stakeholder Communications Generator

**Purpose:** Read current project state and auto-generate stakeholder communication artifacts for the appropriate project phase. Produces audience-targeted reports and Mermaid diagrams populated with real project data.

**Output:** `dev_docs/comms/` (organized by phase)

---

## When to Run

Run this generator:

- At each orchestrator gate checkpoint (triggered automatically)
- On-demand via `/stakeholder-report` command
- Before stakeholder meetings (to prepare presentation materials)
- At sprint boundaries (to generate sprint summary and progress report)
- When stakeholders request an update

---

## Inputs Required

| Input | Location | What it provides |
|-------|----------|-----------------|
| STATE BLOCK | `ORCHESTRATOR.md` or `dev_docs/.orchestrator-state.json` | Current step, completed steps, project config |
| Communication plan | `dev_docs/comms/communication-plan.md` | Stakeholder registry, cadence, channels |
| Audience matrix | `dev_docs/comms/audience-matrix.md` | Per-audience content mapping |
| Project status | `dev_docs/STATUS.md` | Task completion, sprint progress, phase status |
| Service specs | `dev_docs/specs/services/*.md` | Service details, feature lists |
| Screen specs | `dev_docs/specs/screens/*.md` | Screen details, user flows |
| Completeness matrices | `dev_docs/completeness/*.md` | Service matrix, screen matrix, phase coverage |
| Sprint plans | `dev_docs/sprints/*.md` | Sprint goals, tasks, velocity |
| Project overview | `dev_docs/specs/project-overview.md` | Project description, vision, personas |
| Project phases | `dev_docs/specs/project-phases.md` | Phase breakdown, timelines |
| Previous comms | `dev_docs/comms/` (existing files) | For "what changed" diff generation |

---

## Parameters

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `{{AUDIENCE}}` | `executive`, `investor`, `client`, `team`, `all` | `all` | Target audience — determines content depth and tone |
| `{{PHASE}}` | `discovery`, `architecture`, `sprint-planning`, `active-development`, `testing-qa`, `pre-launch`, `post-launch`, `auto` | `auto` | Which phase pack to generate. `auto` detects from STATE BLOCK |
| `{{INCLUDE_MIRO}}` | `true`, `false` | `false` | Deprecated — Miro exports replaced by Mermaid diagrams. Kept for backward compatibility. |
| `{{INCLUDE_DIAGRAMS}}` | `true`, `false` | `true` | Whether to generate Mermaid diagrams |
| `{{DIFF_MODE}}` | `true`, `false` | `true` | Whether to prepend "what changed" diffs to recurring reports |

---

## Phase Detection Algorithm

When `{{PHASE}}` is `auto`, detect the current phase from the STATE BLOCK:

| CURRENT_STEP | Detected Phase | Phase Pack |
|--------------|----------------|------------|
| 0-1 | Discovery | `01-discovery/` |
| 1.7-2 | Discovery (comms setup) | `01-discovery/` |
| 3-7 | Architecture | `02-architecture/` |
| 8-9 | Sprint Planning | `03-sprint-planning/` |
| 10-18.5 | Active Development | `04-active-development/` |
| QA phase (post-sprint) | Testing & QA | `05-testing-qa/` |
| Pre-launch gate | Pre-Launch | `06-pre-launch/` |
| Post-launch | Post-Launch | `07-post-launch/` |

If the project is in active development (Steps 10-18.5) and a sprint just ended, generate both `04-active-development/sprint-summary-stakeholder.md` and `04-active-development/milestone-progress-report.md`.

---

## Generation Steps

### Step 1 — Read Project State

1. Read the STATE BLOCK from `ORCHESTRATOR.md` or `dev_docs/.orchestrator-state.json`
2. Extract: `CURRENT_STEP`, `COMPLETED`, `PROJECT_NAME`, `CONFIG`
3. Read `dev_docs/STATUS.md` — parse task counts, sprint progress, phase completion
4. Read `dev_docs/comms/communication-plan.md` — get stakeholder registry
5. Read `dev_docs/comms/audience-matrix.md` — get content mapping per audience

### Step 2 — Detect Phase (if auto)

Use the Phase Detection Algorithm above to determine which phase pack to generate.

### Step 3 — Gather Phase-Specific Data

Based on detected phase, read the relevant source documents:

**Discovery phase:** Project brief, features list, intake answers
**Architecture phase:** System architecture, tech stack decisions, service specs, project phases
**Sprint planning phase:** Sprint plans, task files, dependency graph
**Active development phase:** STATUS.md (current sprint), completed tasks, velocity metrics, bug count
**Testing & QA phase:** Test results, coverage reports, bug tracker
**Pre-launch phase:** Feature completion status, quality metrics, launch checklist
**Post-launch phase:** Launch metrics, user feedback, error rates

### Step 4 — Generate Phase Pack

For each template in the detected phase pack directory (`31-stakeholder-communications/phase-packs/{phase}/`):

1. Read the template file
2. Replace all `{{PLACEHOLDER}}` variables with real project data from Step 1-3
3. Apply audience filtering:
   - If `{{AUDIENCE}}` is `executive`: Remove technical details, keep traffic-light summaries
   - If `{{AUDIENCE}}` is `investor`: Emphasize metrics, growth, financial data
   - If `{{AUDIENCE}}` is `client`: Emphasize deliverables, demos, approval gates
   - If `{{AUDIENCE}}` is `team`: Include full technical detail
   - If `{{AUDIENCE}}` is `all`: Generate full content (all audiences can read it)
4. Write output to `dev_docs/comms/{phase-number}-{phase-name}/`

### Step 5 — Generate Mermaid Diagrams (if enabled)

If `{{INCLUDE_DIAGRAMS}}` is `true`:

1. Read diagram templates from `31-stakeholder-communications/diagrams/`
2. Fill in with real project data:
   - Gantt chart: real phase dates from `project-phases.md`, real task counts from `STATUS.md`
   - Architecture flowchart: real service names, real integrations, real data stores
   - User journey: real personas, real screen flows
   - Milestone timeline: real milestones with actual completion dates
   - Dependency graph: real service/feature dependencies
   - Mind map: real feature hierarchy
3. Write output to `dev_docs/comms/diagrams/`

### Step 5.1 — Generate Interactive HTML Mind Map

If `{{INCLUDE_DIAGRAMS}}` is `true`:

1. Read the generator at `31-stakeholder-communications/diagrams/INTERACTIVE-MINDMAP-GENERATOR.md`
2. Follow its Step 1-5 to produce `dev_docs/comms/diagrams/interactive-mindmap.html`
3. This is the **primary client-facing diagram deliverable** — a single self-contained HTML file with:
   - Tabbed navigation (Full System + per-service + Data Flows + Integrations + Cross-Cutting + Roadmap)
   - Interactive Markmap rendering (zoom, pan, click-to-expand/collapse)
   - Expand All / Collapse All / Fit to Screen action buttons
   - Light-mode SaaS design with project branding
4. Add to output summary: `"Interactive mind map: 1 file → dev_docs/comms/diagrams/interactive-mindmap.html"`

### Step 6 — Generate "What Changed" Diffs (if enabled)

If `{{DIFF_MODE}}` is `true` and previous reports exist in `dev_docs/comms/`:

1. For each generated file, find its previous version (by filename match)
2. Compare key metrics, status indicators, and milestone progress
3. Generate a "What Changed Since Last Update" section:
   - New milestones completed
   - Status changes (GREEN→YELLOW, etc.)
   - Metric changes (with direction: ↑ improved, ↓ declined, → stable)
   - New risks or resolved blockers
4. Prepend this section to the top of the generated file (after the title)

### Step 7 — Output Summary

Print a summary of what was generated:

```
STAKEHOLDER COMMUNICATIONS GENERATED
=====================================
Phase: {{DETECTED_PHASE}}
Audience: {{AUDIENCE}}
Files generated: {N}
  Phase pack: {X} files → dev_docs/comms/{phase}/
  Diagrams: {Z} files → dev_docs/comms/diagrams/
  Interactive mind map: 1 file → dev_docs/comms/diagrams/interactive-mindmap.html
    Tabs: {T} | Nodes: {TOTAL_NODES} | File size: {SIZE}KB

Changes since last report:
  Milestones completed: {M}
  Status changes: {S}
  New risks: {R}
  Resolved blockers: {B}
```

---

## Audience Content Rules

### Executive Audience
- Maximum 1 page per report
- Lead with traffic-light status (GREEN/YELLOW/RED)
- Top 3 highlights, top 3 risks — no more
- No technical terms — translate everything
- Include: budget, timeline, milestones
- Exclude: code details, architecture, testing specifics

### Investor Audience
- Maximum 2 pages + appendix
- Lead with key metrics and trends
- Include: MoM/QoQ comparisons, growth indicators, runway
- Include: competitive positioning, market signals
- Exclude: operational details, bug reports, sprint mechanics

### Client Audience
- Length varies by deliverable context
- Lead with: what's ready for review, what needs approval
- Include: deliverable checklist, demo schedule, scope changes
- Include: clear action items with deadlines
- Exclude: internal team dynamics, technical debt, infrastructure

### Team Audience
- No length limit — detail is valued
- Lead with: action items, blockers, dependencies
- Include: technical specifics, file paths, API contracts
- Include: architecture decisions with rationale
- Exclude: financial data, investor-facing metrics

---

## Error Handling

| Scenario | Action |
|----------|--------|
| STATE BLOCK not found | Prompt user for current phase, proceed with manual input |
| STATUS.md missing | Generate templates with placeholder data, flag as "data pending" |
| No previous comms exist | Skip diff generation, generate fresh reports |
| Service specs not yet generated | Use data from project brief and features list instead |
| Sprint data not available | Skip sprint-specific sections, generate phase-level data only |
