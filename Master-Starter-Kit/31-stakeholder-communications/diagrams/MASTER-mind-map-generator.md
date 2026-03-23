# MASTER Mind Map Generator

**Purpose:** Generate a comprehensive, multi-section Mermaid mindmap document that covers the ENTIRE project in 40-60 numbered sections, each small enough to render individually. This is the exhaustive reference mind map -- every service, feature, workflow, state machine, data flow, and integration captured in a single navigable document.

**Trigger:** Called after service specs, screen specs, and workflow definitions are complete (typically after Step 8 or later). Can be re-run whenever significant project scope changes occur.

**Output:** `dev_docs/comms/diagrams/MASTER-mind-map.mermaid.md`

---

## Why a MASTER Mind Map

Individual diagram templates (`svc-feature-map`, `wf-workflow`, `sm-state-machine`) capture one service, workflow, or domain at a time. The MASTER mind map stitches them ALL into a single navigable document with a Table of Contents, cross-references between sections, and consistent node-counting. It is the definitive "how big is this project?" artifact.

**Target scope:** 1,500-2,000+ total nodes across all sections.

---

## Generation Instructions

### Step 1 — Gather All Source Material

Read these sources and extract the full project hierarchy:

| Source | What to extract |
|--------|----------------|
| `dev_docs/specs/services/*.md` | Service names, features, sub-features, capabilities, endpoints, tables |
| `dev_docs/services/*.md` | Service hub files -- canonical endpoint lists, table lists, business rules |
| `dev_docs/services/modules/*.md` | Module-level breakdowns (features, sub-features, validation rules) |
| `dev_docs/specs/screen-specs/*.md` | Screen names, components, user interactions, data bindings |
| `dev_docs/specs/project-phases.md` | Phase names, timelines, milestones, deliverables |
| `dev_docs/specs/system-architecture.md` | Architecture layers, tech stack, integration points |
| `dev_docs/specs/contracts/*.md` | API contracts, request/response shapes |
| `dev_docs/completeness/service-matrix.md` | Service-to-feature-to-screen mapping |
| `dev_docs/tasks/*.md` | Task structure, workflow coverage, business rules |
| `dev_docs/tracker/master-tracker.md` | Subtask counts, dependency chains |

### Step 2 — Plan Section Layout

Organize the output into numbered sections following this structure:

```
Section 01: System Overview (services, personas, tech stack)
Section 02: Service N — Features (one section per service, 2-3 mindmaps each)
Section 03: Service N — Endpoints & Data Model
  ...repeat for each service...
Section NN: Workflow Summary — {{WORKFLOW_NAME}} (one section per major workflow)
  ...repeat for each workflow...
Section NN: State Machine Summary — {{DOMAIN_GROUP}} (one section per domain group)
  ...repeat for each domain group...
Section NN: Data Flow Summary
Section NN: Integration Map
Section NN: Cross-Cutting Concerns
Section NN: Phased Roadmap
Section NN: Service Dependency Map
Section NN: Scale Metrics & Non-Functional Requirements
```

**Section count guidance:**
- 1 System Overview section
- 2-3 sections per service (features + endpoints/data model + optionally modules)
- 1 section per major workflow (typically 3-8 workflows)
- 1 section per domain group for state machines (typically 2-5 groups)
- 5-6 summary sections (data flows, integrations, cross-cutting, roadmap, dependencies, scale)
- **Total: 40-60 sections** for a typical 5-10 service project

### Step 3 — Generate Each Section

Each section follows this format:

```markdown
---

## Section NN: {{Section Title}}

{{1-2 sentence description of what this section covers and why it matters.}}

**Related sections:** Section XX, Section YY

` ` `mermaid
mindmap
  root(({{Section Root Label}}))
    {{Branch 1}}
      {{Leaf 1a}}
      {{Leaf 1b}}
    {{Branch 2}}
      {{Leaf 2a}}
        {{Sub-leaf 2a-i}}
        {{Sub-leaf 2a-ii}}
      {{Leaf 2b}}
` ` `

**Node count:** NN nodes
```

**Rules for each section's mindmap:**
- Keep each individual mindmap to 30-80 nodes (ensures it renders without Mermaid choking)
- Use 3-5 levels of depth (root -> branch -> leaf -> sub-leaf -> detail)
- Service feature sections should show: feature areas -> features -> sub-features -> business rules / validations
- Endpoint sections should show: route groups -> individual routes -> HTTP method + auth level
- Data model sections should show: tables -> columns (key ones only) -> relationships
- Workflow sections should show: trigger -> steps -> decision points -> outcomes
- State machine sections should show: states -> transitions -> guards -> side effects
- Every leaf node should be a concrete, actionable item (not generic filler)

### Step 4 — Generate the Table of Contents

Place this at the very top of the output file, above all sections:

```markdown
# MASTER Mind Map — {{PROJECT_NAME}}

> Auto-generated comprehensive mind map covering all services, workflows, state machines, data flows, and integrations.
> **Total sections:** {{SECTION_COUNT}} | **Total nodes:** {{TOTAL_NODE_COUNT}}
>
> Each section contains a self-contained Mermaid mindmap small enough to render independently.
> Paste any section into a Mermaid renderer to visualize it.

## Table of Contents

- [Section 01: System Overview](#section-01-system-overview)
- [Section 02: {{SERVICE_1_NAME}} — Features](#section-02-service-1-name--features)
- [Section 03: {{SERVICE_1_NAME}} — Endpoints & Data](#section-03-service-1-name--endpoints--data)
  ...
- [Section NN: Scale Metrics](#section-nn-scale-metrics)
```

### Step 5 — Node Count & Quality Check

After generating all sections:

1. Count total nodes across all mindmaps. Target: 1,500-2,000+.
2. Verify every service from the service matrix has at least 2 sections.
3. Verify every major workflow has a Workflow Summary section.
4. Verify every entity with state transitions has a State Machine Summary section.
5. Verify no individual mindmap exceeds 80 nodes (split if necessary).
6. Verify cross-references between sections are accurate (section numbers match).

**If total node count is below 1,500:**
- Add deeper feature breakdowns (business rules, validation logic, edge cases)
- Add module-level sections for larger services
- Add screen-level branches showing component hierarchies
- Add more granular endpoint details (query params, response shapes)

### Step 6 — Write the Output File

Write the complete document to: `dev_docs/comms/diagrams/MASTER-mind-map.mermaid.md`

---

## Section Templates

### System Overview Section

```mermaid
mindmap
  root(({{PROJECT_NAME}}))
    Services
      {{SERVICE_1_NAME}}
        {{SERVICE_1_ENDPOINT_COUNT}} endpoints
        {{SERVICE_1_TABLE_COUNT}} tables
      {{SERVICE_2_NAME}}
        {{SERVICE_2_ENDPOINT_COUNT}} endpoints
        {{SERVICE_2_TABLE_COUNT}} tables
      {{SERVICE_3_NAME}}
        {{SERVICE_3_ENDPOINT_COUNT}} endpoints
        {{SERVICE_3_TABLE_COUNT}} tables
      {{SERVICE_4_NAME}}
        {{SERVICE_4_ENDPOINT_COUNT}} endpoints
        {{SERVICE_4_TABLE_COUNT}} tables
      {{SERVICE_5_NAME}}
        {{SERVICE_5_ENDPOINT_COUNT}} endpoints
        {{SERVICE_5_TABLE_COUNT}} tables
    Personas
      {{PERSONA_1}}
        {{PERSONA_1_ROLE}}
      {{PERSONA_2}}
        {{PERSONA_2_ROLE}}
      {{PERSONA_3}}
        {{PERSONA_3_ROLE}}
    Tech Stack
      Frontend: {{FRONTEND_FRAMEWORK}}
      Backend: {{BACKEND_FRAMEWORK}}
      Database: {{PRIMARY_DATABASE}}
      Auth: {{AUTH_PROVIDER}}
      Hosting: {{HOSTING_PROVIDER}}
    Scale Targets
      {{TARGET_CONCURRENT_USERS}} concurrent users
      {{TARGET_RESPONSE_TIME}} response time
      {{TARGET_UPTIME}} uptime
```

### Per-Service Feature Section

```mermaid
mindmap
  root(({{SERVICE_NAME}} — Features))
    {{FEATURE_AREA_1}}
      {{FEATURE_1_1}}
        {{FEATURE_1_1_RULE_1}}
        {{FEATURE_1_1_RULE_2}}
      {{FEATURE_1_2}}
        {{FEATURE_1_2_RULE_1}}
    {{FEATURE_AREA_2}}
      {{FEATURE_2_1}}
        {{FEATURE_2_1_RULE_1}}
        {{FEATURE_2_1_RULE_2}}
      {{FEATURE_2_2}}
    {{FEATURE_AREA_3}}
      {{FEATURE_3_1}}
      {{FEATURE_3_2}}
```

### Per-Service Endpoints & Data Section

```mermaid
mindmap
  root(({{SERVICE_NAME}} — API & Data))
    Endpoints
      {{ROUTE_GROUP_1}}
        GET {{ENDPOINT_1_1}}
        POST {{ENDPOINT_1_2}}
        PUT {{ENDPOINT_1_3}}
      {{ROUTE_GROUP_2}}
        GET {{ENDPOINT_2_1}}
        POST {{ENDPOINT_2_2}}
        DELETE {{ENDPOINT_2_3}}
    Tables
      {{TABLE_1}}
        {{TABLE_1_KEY_COLUMN_1}}
        {{TABLE_1_KEY_COLUMN_2}}
        FK: {{TABLE_1_RELATION}}
      {{TABLE_2}}
        {{TABLE_2_KEY_COLUMN_1}}
        {{TABLE_2_KEY_COLUMN_2}}
    Business Rules
      {{RULE_1}}
      {{RULE_2}}
      {{RULE_3}}
```

### Workflow Summary Section

```mermaid
mindmap
  root(({{WORKFLOW_NAME}}))
    Trigger
      {{TRIGGER_EVENT}}
      Actor: {{TRIGGER_ACTOR}}
    Steps
      {{STEP_1}}
        Service: {{STEP_1_SERVICE}}
        Screen: {{STEP_1_SCREEN}}
      {{STEP_2}}
        Service: {{STEP_2_SERVICE}}
        Decision: {{STEP_2_CONDITION}}
      {{STEP_3}}
        Service: {{STEP_3_SERVICE}}
    Outcomes
      Success: {{SUCCESS_OUTCOME}}
      Failure: {{FAILURE_OUTCOME}}
      Abandonment: {{ABANDON_OUTCOME}}
    Data Changes
      {{DATA_CHANGE_1}}
      {{DATA_CHANGE_2}}
```

### State Machine Summary Section

```mermaid
mindmap
  root(({{DOMAIN_GROUP}} States))
    {{ENTITY_1_NAME}}
      {{ENTITY_1_STATE_1}} --> {{ENTITY_1_STATE_2}}
        Event: {{TRANSITION_EVENT}}
        Guard: {{TRANSITION_GUARD}}
      {{ENTITY_1_STATE_2}} --> {{ENTITY_1_STATE_3}}
        Event: {{TRANSITION_EVENT}}
      {{ENTITY_1_STATE_3}} terminal
    {{ENTITY_2_NAME}}
      {{ENTITY_2_STATE_1}} --> {{ENTITY_2_STATE_2}}
        Event: {{TRANSITION_EVENT}}
      {{ENTITY_2_STATE_2}} --> {{ENTITY_2_STATE_3}}
        Event: {{TRANSITION_EVENT}}
```

---

## Quality Metrics

| Metric | Minimum | Target |
|--------|---------|--------|
| Total sections | 40 | 60+ |
| Total nodes | 1,500 | 2,000+ |
| Nodes per section | 15 | 30-80 |
| Depth levels | 3 | 4-5 |
| Services covered | All MVP services | All services |
| Workflows covered | All major workflows | All workflows |
| State machines covered | All entities with state | All state machines |
| Cross-references per section | 1 | 2-3 |

---

## Example Output Summary

```
MASTER MIND MAP GENERATED
================================
File: dev_docs/comms/diagrams/MASTER-mind-map.mermaid.md
Sections: 47
Total nodes: 1,823
Services covered: 8/8
Workflows covered: 6/6
State machines covered: 4/4
Summary sections: 6

Sections breakdown:
  - System Overview: 1
  - Service Features: 8
  - Service Endpoints & Data: 8
  - Service Modules: 16
  - Workflow Summaries: 6
  - State Machine Summaries: 4
  - Data Flows: 1
  - Integration Map: 1
  - Cross-Cutting: 1
  - Roadmap: 1
  - Dependencies: 1
  - Scale Metrics: 1
```

---

## Cross-References

- **Interactive HTML version:** `INTERACTIVE-MINDMAP-GENERATOR.md` (generates the Markmap HTML)
- **Individual service maps:** `svc-feature-map.template.md`
- **Workflow diagrams:** `wf-workflow.template.md`
- **State machine diagrams:** `sm-state-machine.template.md`
- **Service overview:** `overview-service-map.template.md`
- **Phased roadmap:** `overview-phased-roadmap.template.md`
- **Diagram index:** `_diagram-index.template.md`
