# Diagram Index — {{PROJECT_NAME}}

> Generated at Step 15.7 | Date: {{GENERATION_DATE}}
> Total diagrams: {{TOTAL_DIAGRAM_COUNT}} | Total nodes: {{TOTAL_NODE_COUNT}} (approx)

---

## Format Guide

All diagrams use **Mermaid syntax** and render in:

- GitHub markdown preview (automatic)
- VS Code with Mermaid extension (recommended: "Markdown Preview Mermaid Support")
- Mermaid Live Editor (paste code blocks at mermaid.live)
- Any documentation site with Mermaid plugin (Docusaurus, MkDocs, GitBook)

Diagram types used: `mindmap`, `flowchart`, `stateDiagram-v2`, `sequenceDiagram`, `erDiagram`, `gantt`, `timeline`, `quadrantChart`

---

## Category 1: System Overviews

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
| `overview-service-map.md` | All services with relationships, priorities, endpoint/table counts | mindmap | {{NODE_COUNT}} |
| `overview-phased-roadmap.md` | Phase milestones, critical path, phase gates | mindmap | {{NODE_COUNT}} |
| `MASTER-mind-map.mermaid.md` | Comprehensive system mind map — every service, feature, workflow, state machine, data flow, integration | mindmap (40-60 sections) | {{NODE_COUNT}} |

## Category 2: Service Feature Maps

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
<!-- Repeat for each service -->
| `svc-{{NN}}-{{SERVICE_NAME}}-features.md` | {{SERVICE_NAME}} feature hierarchy — features, sub-features, endpoints, entities | mindmap | {{NODE_COUNT}} |
<!-- End repeat -->

## Category 3: Workflow Diagrams

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
<!-- Repeat for each workflow -->
| `wf-{{WORKFLOW_NAME}}.md` | {{WORKFLOW_DESCRIPTION}} — cross-service flow with decision points and error branches | flowchart LR | {{NODE_COUNT}} |
<!-- End repeat -->

## Category 4: State Machine Diagrams

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
<!-- Repeat for each domain group -->
| `sm-{{DOMAIN_GROUP}}.md` | {{DOMAIN_GROUP_DESCRIPTION}} — states, transitions, triggers, guards | stateDiagram-v2 | {{NODE_COUNT}} |
<!-- End repeat -->

## Category 5: Data Flow Diagrams

| File | Description | Mermaid Type | Nodes | Status |
|------|-------------|-------------|-------|--------|
| `data-flow.md` | Top 3-5 most important data flows end-to-end | sequenceDiagram | {{NODE_COUNT}} | Generated |
| `df-value-chain.md` | Primary data transformation chain from input to output | flowchart LR | {{NODE_COUNT}} | Generated |
| `df-cross-service-dependencies.md` | Service-to-service data production/consumption map | flowchart TB | {{NODE_COUNT}} | Generated |
| `df-realtime-paths.md` | WebSocket/SSE real-time data paths with frequency and subscribers | flowchart LR | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |
| `df-mobile-offline-sync.md` | Offline queue → conflict resolution → server sync | flowchart TB | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |

## Category 6: Integration Diagrams

| File | Description | Mermaid Type | Nodes | Status |
|------|-------------|-------------|-------|--------|
| `int-phase1-mvp.md` | MVP integrations — vendor, protocol, data exchanged, auth method | flowchart LR | {{NODE_COUNT}} | Generated |
| `int-phase2-post-launch.md` | Post-launch integrations | flowchart LR | {{NODE_COUNT}} | Generated |
| `int-phase3-expansion.md` | Expansion-phase integrations with patterns | flowchart LR | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |

## Category 7: Cross-Cutting Concerns

| File | Description | Mermaid Type | Nodes | Status |
|------|-------------|-------------|-------|--------|
| `xc-multi-tenant.md` | Tenant isolation, data classification, compliance overlay | flowchart TB | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |
| `xc-auth-security.md` | Role hierarchy, permission model, auth flows, OWASP controls | flowchart TB | {{NODE_COUNT}} | Generated |
| `xc-design-system-cicd.md` | Design tokens, component library, CI/CD pipeline, quality gates | flowchart LR | {{NODE_COUNT}} | Generated |

## Category 8: Infrastructure & Operations

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
| `system-architecture-flowchart.md` | Full technical stack — client to data layer | flowchart TB | {{NODE_COUNT}} |
| `infra-deployment-topology.md` | Deployment architecture per environment (dev/staging/prod) | flowchart TB | {{NODE_COUNT}} |
| `infra-security-zones.md` | Network security zones with trust levels and firewall rules | flowchart TB | {{NODE_COUNT}} |
| `infra-cicd-pipeline.md` | CI/CD pipeline stages with timing estimates | flowchart LR | {{NODE_COUNT}} |
| `infra-monitoring-observability.md` | Monitoring, metrics, dashboards, alerting, log pipeline | flowchart TB | {{NODE_COUNT}} |
| `infra-disaster-recovery.md` | RTO/RPO targets, backup strategy, failover scenarios | flowchart TB | {{NODE_COUNT}} |
| `infra-secrets-management.md` | Secret lifecycle, rotation schedule, access control | flowchart LR | {{NODE_COUNT}} |
| `infra-api-topology.md` | API router hierarchy, middleware stack, request lifecycle | flowchart TB | {{NODE_COUNT}} |

## Category 9: Database

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
| `database-erd-visual.md` | Domain-specific ER diagrams with cross-domain relationships | erDiagram | {{NODE_COUNT}} |

## Category 10: Timeline & Milestones

| File | Description | Mermaid Type | Nodes |
|------|-------------|-------------|-------|
| `timeline-full-project.md` | Complete Gantt — all phases, sprints, tasks, parallel tracks, critical path | gantt | {{NODE_COUNT}} |
| `milestone-roadmap.md` | Executive-friendly milestone view — achievement-focused, no task IDs | timeline | {{NODE_COUNT}} |
| `roadmap-gantt.md` | Sprint-level Gantt with phase sections and milestone markers | gantt | {{NODE_COUNT}} |

## Category 11: Auth & Mobile

| File | Description | Mermaid Type | Nodes | Status |
|------|-------------|-------------|-------|--------|
| `auth-role-permission-matrix.md` | All roles × all permissions, role hierarchy, MFA requirements | flowchart TB | {{NODE_COUNT}} | Generated |
| `mobile-navigation-map.md` | Mobile navigation tree — tabs, screens, modals, deep links, offline indicators | flowchart TD | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |

## Category 12: Stakeholder Materials

| File | Description | Mermaid Type | Nodes | Status |
|------|-------------|-------------|-------|--------|
| `stakeholder-product-overview.md` | Product vision for investor decks and sales — value props, differentiation | mindmap | {{NODE_COUNT}} | Generated |
| `stakeholder-data-security.md` | Data classification, compliance mapping, incident response timeline | flowchart TB | {{NODE_COUNT}} | Generated |
| `stakeholder-competitive-landscape.md` | Market positioning matrix, feature comparison, win themes | quadrantChart | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |
| `stakeholder-roi-model.md` | ROI model — pain points, improvements, cost savings, payback timeline | flowchart LR | {{NODE_COUNT}} | {{GENERATED_OR_SKIPPED}} |

---

## Coverage Verification

### Service Coverage

Every service must appear in at least one service feature map:

| Service | Feature Map | Also Appears In |
|---------|-------------|-----------------|
| {{SERVICE_NAME}} | `svc-{{NN}}-{{SERVICE_NAME}}-features.md` | {{OTHER_DIAGRAMS}} |

### Persona Coverage

Every persona must appear in at least one diagram:

| Persona | Appears In |
|---------|-----------|
| {{PERSONA_NAME}} | {{DIAGRAM_LIST}} |

### Workflow Coverage

Every cross-service workflow must have a diagram:

| Workflow | Diagram | Services Involved |
|----------|---------|-------------------|
| {{WORKFLOW_NAME}} | `wf-{{WORKFLOW_NAME}}.md` | {{SERVICE_LIST}} |

---

## Skipped Diagrams

| Diagram | Reason Skipped |
|---------|---------------|
| {{DIAGRAM_NAME}} | {{SKIP_REASON}} |

---

## Existing Diagrams (from earlier steps)

These diagrams were generated at earlier COMMS TRIGGER points and are included in the total count:

| File | Generated At | Mermaid Type |
|------|-------------|-------------|
| `system-architecture-flowchart.md` | Step 9 COMMS TRIGGER | flowchart TB |
| `feature-mind-map.md` | Step 5 COMMS TRIGGER | mindmap |
| `dependency-graph.md` | Step 9 COMMS TRIGGER | flowchart LR |
| `roadmap-gantt.md` | Step 9 COMMS TRIGGER | gantt |
| `user-journey-flowchart.md` | Step 5 COMMS TRIGGER | journey |
| `milestone-timeline.md` | Step 5 COMMS TRIGGER | timeline |
| `interactive-mindmap.html` | Step 16 COMMS TRIGGER | Markmap HTML |
