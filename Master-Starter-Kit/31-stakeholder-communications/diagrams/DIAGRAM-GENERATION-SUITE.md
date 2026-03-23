# Diagram Generation Suite

**Purpose:** Generate the complete visual documentation library for a project — infrastructure diagrams, ERDs, timelines, auth matrices, stakeholder materials, and the MASTER mind map. All diagrams use Mermaid syntax for universal rendering (GitHub, VS Code, documentation sites).

**Triggered at:** ORCHESTRATOR Step 15.7
**Output directory:** `dev_docs/comms/diagrams/`
**Expected output:** 40-60+ diagram files, 3,000+ total Mermaid nodes

---

## Inputs Required

| Input | Location | What It Provides |
|-------|----------|-----------------|
| Service specs | `dev_docs/specs/services/*.md` | Service details, features, data models, endpoints |
| Service hubs | `dev_docs/services/*.md` | Endpoint counts, table counts, quality scores |
| Screen specs | `dev_docs/specs/screens/*.md` | Screen details, user flows, personas |
| API contracts | `dev_docs/specs/contracts/screen-api-contract-registry.md` | Endpoint definitions, request/response contracts |
| Database schemas | `dev_docs/specs/database/*.md` | Table definitions, relationships, constraints |
| Phase plans | `dev_docs/tasks/phase-*.md` | Task breakdown by phase, effort estimates |
| Master tracker | `dev_docs/tracker/master-tracker.md` | Subtasks, timeline, milestones |
| Timeline | `dev_docs/tracker/timeline.md` | Week-by-week schedule, phase dates |
| Milestones | `dev_docs/tracker/milestones.md` | Milestone definitions, gate criteria |
| Infrastructure docs | Step 11 output | Hosting, database, cache, CDN setup |
| Security docs | Step 14 output | Auth config, security hardening, compliance |
| Observability docs | Step 15 output | Monitoring, logging, alerting setup |
| Tribunal output | `dev_docs/tribunal/` | Competitor research, feature research, feasibility |
| Project overview | `dev_docs/specs/project-overview.md` | Vision, personas, features |
| Project phases | `dev_docs/specs/project-phases.md` | Phase breakdown, timelines |
| STATE BLOCK CONFIG | `ORCHESTRATOR.md` | `HAS_MOBILE`, `IS_MULTI_TENANT`, `COMPLIANCE_REQUIREMENTS`, etc. |

---

## Generation Order

Generate diagrams in this exact order. Later categories reference earlier ones.

### Phase 1 — Foundation Diagrams (generate first)

1. **Category 1: System Overviews** (3 files) — establishes the system-level view
2. **Category 2: Service Feature Maps** (N files) — one per service, deep feature detail
3. **Category 9: Database ERD** (1 file) — data model visualization

### Phase 2 — Behavioral Diagrams

4. **Category 3: Workflow Diagrams** (N files) — cross-service workflows
5. **Category 4: State Machine Diagrams** (N files) — domain state transitions
6. **Category 5: Data Flow Diagrams** (3-5 files) — data movement patterns

### Phase 3 — Operational Diagrams

7. **Category 6: Integration Diagrams** (2-3 files) — external system connections
8. **Category 7: Cross-Cutting Concerns** (2-3 files) — auth, tenancy, CI/CD
9. **Category 8: Infrastructure & Operations** (7-8 files) — deployment, security, monitoring

### Phase 4 — Planning & Stakeholder Diagrams

10. **Category 10: Timeline & Milestones** (2-3 files) — project schedule visualization
11. **Category 11: Auth & Mobile** (1-2 files) — permission matrix, mobile navigation
12. **Category 12: Stakeholder Materials** (2-4 files) — investor/executive artifacts

### Phase 5 — Master Mind Map (generate last)

13. **MASTER Mind Map** — the comprehensive system mind map that references ALL prior diagrams

---

## Category Details

### Category 1: System Overviews (3 files) — ALWAYS generate

Read template: `overview-service-map.template.md`
- Output: `dev_docs/comms/diagrams/overview-service-map.md`
- Content: Mermaid mindmap showing all services with relationships, priorities, endpoint counts, table counts
- Data source: Service hubs, service matrix

Read template: `overview-phased-roadmap.template.md`
- Output: `dev_docs/comms/diagrams/overview-phased-roadmap.md`
- Content: Mermaid mindmap showing phase milestones, critical path, phase gates
- Data source: Phase plans, milestones, timeline

Read generator: `MASTER-mind-map-generator.md`
- Output: `dev_docs/comms/diagrams/MASTER-mind-map.mermaid.md`
- Content: 40-60 numbered Mermaid mindmap sections, 1,500-2,000+ nodes
- **Generate this LAST** — it references all other diagrams
- Data source: ALL project documentation

### Category 2: Service Feature Maps (1 per service) — ALWAYS generate

Read template: `svc-feature-map.template.md`
- Output: `dev_docs/comms/diagrams/svc-{NN}-{service-name}-features.md` (one per service)
- Content: Mermaid mindmap per service — root = service, branches = feature areas, leaves = sub-features/endpoints/entities
- Node target: 50-120 per service
- Data source: Service specs, service hubs

### Category 3: Workflow Diagrams (1 per major workflow) — ALWAYS generate

Read template: `wf-workflow.template.md`
- Output: `dev_docs/comms/diagrams/wf-{workflow-name}.md` (one per workflow)
- Identify every end-to-end workflow crossing 2+ services (typically 5-10 per project)
- Content: Mermaid flowchart LR — trigger → actor → screen → API → data change → next step
- Include decision points, error branches, abandonment paths
- Node target: 25-60 per workflow
- Data source: Service specs (workflow sections), screen specs (user flows)

### Category 4: State Machine Diagrams (1 per domain group) — ALWAYS generate

Read template: `sm-state-machine.template.md`
- Output: `dev_docs/comms/diagrams/sm-{domain-group}.md` (one per group)
- Group related state machines by domain similarity (typically 3-6 groups)
- Content: Mermaid stateDiagram-v2 — states → transitions → triggers → guards
- Node target: 40-75 per group
- Data source: Service specs (state machine sections)

### Category 5: Data Flow Diagrams (3-5 files) — 2 conditional

Read templates and generate:

| Template | Output | Condition |
|----------|--------|-----------|
| `data-flow.template.md` | `data-flow.md` | Always |
| `df-value-chain.template.md` | `df-value-chain.md` | Always |
| `df-cross-service-dependencies.template.md` | `df-cross-service-dependencies.md` | Always |
| `df-realtime-paths.template.md` | `df-realtime-paths.md` | `{{HAS_REALTIME}} == "true"` |
| `df-mobile-offline-sync.template.md` | `df-mobile-offline-sync.md` | `{{HAS_MOBILE}} == "true"` AND `{{HAS_OFFLINE}} == "true"` |

Data source: Service specs (data flow sections), API contracts, infrastructure docs

### Category 6: Integration Diagrams (2-3 files) — 1 conditional

| Template | Output | Condition |
|----------|--------|-----------|
| `int-phase1-mvp.template.md` | `int-phase1-mvp.md` | Always |
| `int-phase2-post-launch.template.md` | `int-phase2-post-launch.md` | Always |
| `int-phase3-expansion.template.md` | `int-phase3-expansion.md` | `{{INTEGRATION_PHASE_COUNT}} >= 3` |

Data source: Integration strategy docs, tribunal feasibility research

### Category 7: Cross-Cutting Concerns (2-3 files) — 1 conditional

| Template | Output | Condition |
|----------|--------|-----------|
| `xc-multi-tenant.template.md` | `xc-multi-tenant.md` | `{{IS_MULTI_TENANT}} == "true"` |
| `xc-auth-security.template.md` | `xc-auth-security.md` | Always |
| `xc-design-system-cicd.template.md` | `xc-design-system-cicd.md` | Always |

Data source: Security docs, design system, CI/CD pipeline docs

### Category 8: Infrastructure & Operations (7 new + 1 existing) — ALWAYS generate

Verify `system-architecture-flowchart.md` exists from Step 9. If missing, generate from `system-architecture-flowchart.template.md`.

| Template | Output |
|----------|--------|
| `infra-deployment-topology.template.md` | `infra-deployment-topology.md` |
| `infra-security-zones.template.md` | `infra-security-zones.md` |
| `infra-cicd-pipeline.template.md` | `infra-cicd-pipeline.md` |
| `infra-monitoring-observability.template.md` | `infra-monitoring-observability.md` |
| `infra-disaster-recovery.template.md` | `infra-disaster-recovery.md` |
| `infra-secrets-management.template.md` | `infra-secrets-management.md` |
| `infra-api-topology.template.md` | `infra-api-topology.md` |

Conditional enhancement: If `{{COMPLIANCE_REQUIREMENTS}} != "none"`, add compliance annotations to deployment topology and security zones (HIPAA Security Rule, PCI-DSS, SOC 2 mapping).

Data source: Infrastructure docs, security docs, observability docs, API contracts

### Category 9: Database (1 file) — ALWAYS generate

Read template: `database-erd-visual.template.md`
- Output: `dev_docs/comms/diagrams/database-erd-visual.md`
- Content: Mermaid erDiagram split by domain (core/auth, then one per service domain)
- Each domain: tables with key columns, relationships with cardinality
- Final section: cross-domain relationship diagram
- Data source: Database schemas, service specs (data model sections)

### Category 10: Timeline & Milestones (2 new + existing) — ALWAYS generate

Verify `roadmap-gantt.md` exists from Step 9. If missing, generate from `roadmap-gantt.template.md`.

| Template | Output |
|----------|--------|
| `timeline-full-project.template.md` | `timeline-full-project.md` |
| `milestone-roadmap.template.md` | `milestone-roadmap.md` |

Data source: Master tracker, timeline, milestones, STATUS.md

### Category 11: Auth & Mobile (1-2 files) — 1 conditional

| Template | Output | Condition |
|----------|--------|-----------|
| `auth-role-permission-matrix.template.md` | `auth-role-permission-matrix.md` | Always |
| `mobile-navigation-map.template.md` | `mobile-navigation-map.md` | `{{HAS_MOBILE}} == "true"` |

Data source: Security docs, service specs (auth sections), mobile architecture docs

### Category 12: Stakeholder Materials (2-4 files) — 2 conditional

| Template | Output | Condition |
|----------|--------|-----------|
| `stakeholder-product-overview.template.md` | `stakeholder-product-overview.md` | Always |
| `stakeholder-data-security.template.md` | `stakeholder-data-security.md` | Always |
| `stakeholder-competitive-landscape.template.md` | `stakeholder-competitive-landscape.md` | `{{HAS_COMPETITORS}} == "true"` |
| `stakeholder-roi-model.template.md` | `stakeholder-roi-model.md` | `{{IS_B2B}} == "true"` |

Data source: Project overview, tribunal output, security docs, financial model (if exists)

---

## Quality Gate Checklist

After generating ALL diagrams, verify every item:

- [ ] **File existence:** All required diagram files exist. Conditional diagrams are either generated or explicitly skipped with documented reason in `_index.md`.
- [ ] **Service coverage:** Every service in `dev_docs/completeness/service-matrix.md` appears in at least one service feature map (`svc-*-features.md`).
- [ ] **Persona coverage:** Every persona from project overview appears in at least one diagram (auth role matrix, mobile navigation, or stakeholder material).
- [ ] **Workflow coverage:** Every major workflow crossing 2+ services has a workflow diagram (`wf-*.md`).
- [ ] **Database coverage:** Every database domain has an ERD section in `database-erd-visual.md`.
- [ ] **MASTER mind map completeness:** The MASTER mind map covers all services, all major workflows, all state machines, all integrations, and all cross-cutting concerns.
- [ ] **Timeline accuracy:** The full project Gantt matches master-tracker task counts and sprint dates.
- [ ] **Milestone accuracy:** The milestone roadmap matches STATUS.md milestone definitions.
- [ ] **Mermaid syntax validity:** All Mermaid diagrams have valid syntax — no unclosed subgraphs, no duplicate node IDs, no missing arrow targets.
- [ ] **Index completeness:** `_index.md` has accurate file list, descriptions, node counts, and format indicators for every generated diagram.

**If any check fails:** Fix the issue before proceeding to Step 16 (Handoff).

---

## Diagram File Structure

Every generated diagram file must include:

```markdown
# [Diagram Title] — {{PROJECT_NAME}}

> Generated at Step 15.7 | Date: {{GENERATION_DATE}}
> Purpose: [one-sentence description of what this diagram shows]

[Mermaid diagram block(s)]

## Supporting Notes

[Tables, legends, cross-references as appropriate]

## Cross-References

- Source: [links to the specs/docs this diagram was derived from]
- Related diagrams: [links to other diagrams in this suite]
```

---

## Output Summary

After generation, present to the user:

```
DIAGRAM GENERATION COMPLETE

Category                      | Files | Nodes (approx)
------------------------------|-------|---------------
System Overviews              |     3 | XXX
Service Feature Maps          |     N | XXX
Workflow Diagrams             |     N | XXX
State Machine Diagrams        |     N | XXX
Data Flow Diagrams            |   3-5 | XXX
Integration Diagrams          |   2-3 | XXX
Cross-Cutting Concerns        |   2-3 | XXX
Infrastructure & Operations   |   7-8 | XXX
Database ERD                  |     1 | XXX
Timeline & Milestones         |   2-3 | XXX
Auth & Mobile                 |   1-2 | XXX
Stakeholder Materials         |   2-4 | XXX
------------------------------|-------|---------------
TOTAL                         |    XX | X,XXX

Skipped (with reason): [list any conditional diagrams that were skipped]
Quality gate: PASS / FAIL
```
