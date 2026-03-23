# Post-Completion Audit Checklist

> **Used by:** Step 29 (Post-Completion Audit)
> **Purpose:** Master checklist of every expected output from all orchestrator steps. Cross-reference against actual `dev_docs/` contents.

---

## How to Use

For each completed step in the `COMPLETED` array, verify the expected outputs exist and meet quality thresholds. Mark each item as:
- **PASS** — File exists, has all required sections, meets depth threshold
- **MISSING** — File does not exist (CRITICAL)
- **STUB** — File exists but is <50 words or contains only placeholder text (WARNING)
- **INCOMPLETE** — File exists but is missing required sections (WARNING)

---

## Step 0: Ecosystem Setup

| Expected Output | Location | Status |
|----------------|----------|--------|
| CLAUDE.md configured | `.claude/CLAUDE.md` or project root | |
| Commands installed | `.claude/commands/` | |

## Step 1: Intake

| Expected Output | Location | Status |
|----------------|----------|--------|
| Project Brief | `dev_docs/project-brief.md` | |
| Domain Rules | `dev_docs/domain-rules.md` | |
| Features List | `dev_docs/features-list.md` | |
| Integrations Map | `dev_docs/integrations-map.md` | |
| Data Sensitivity | `dev_docs/data-sensitivity.md` | |
| User Roles | `dev_docs/user-roles.md` | |

## Step 2: AI Config

| Expected Output | Location | Status |
|----------------|----------|--------|
| Project CLAUDE.md | Project root `CLAUDE.md` | |

## Step 3: Tribunal

| Expected Output | Location | Status |
|----------------|----------|--------|
| Tribunal research files (60-100) | `dev_docs/tribunal/` | |
| Final verdict | `dev_docs/tribunal/VERDICT.md` | |
| Competitor analysis | `dev_docs/tribunal/competitors/` | |
| Persona definitions | `dev_docs/tribunal/personas/` | |

## Step 4: Foundation Documents

| Expected Output | Location | Status |
|----------------|----------|--------|
| Project Overview | `dev_docs/project-overview.md` | |
| Project Vision | `dev_docs/project-vision.md` | |
| Project Phases | `dev_docs/project-phases.md` | |
| User Personas | `dev_docs/user-personas.md` | |
| System Architecture | `dev_docs/system-architecture.md` | |
| Tech Stack | `dev_docs/tech-stack.md` | |

## Step 4.5: Service Completeness Matrix

| Expected Output | Location | Status |
|----------------|----------|--------|
| Service matrix | `dev_docs/completeness/service-matrix.md` | |

## Step 5: Service Specs

| Expected Output | Location | Status |
|----------------|----------|--------|
| One spec per service | `dev_docs/specs/{{SERVICE_SLUG}}-spec.md` | |
| One hub per service | `dev_docs/services/{{SERVICE_SLUG}}-hub.md` | |
| All specs score ≥8/10 depth | (verify via depth scorer) | |

## Step 6: Screen Specs

| Expected Output | Location | Status |
|----------------|----------|--------|
| Screen catalog | `dev_docs/specs/screen-catalog.md` | |
| One spec per screen | `dev_docs/specs/screens/{{SCREEN_SLUG}}-spec.md` | |
| All specs score ≥7/10 depth | (verify via depth scorer) | |

## Step 6.5: Screen Completeness Matrix

| Expected Output | Location | Status |
|----------------|----------|--------|
| Screen matrix | `dev_docs/completeness/screen-matrix.md` | |

## Step 7: Codebase Audit

| Expected Output | Location | Status |
|----------------|----------|--------|
| Audit report | `dev_docs/audit/audit-report.md` | |
<!-- Note: If greenfield, this step is skipped -->

## Step 8: Task Generation

| Expected Output | Location | Status |
|----------------|----------|--------|
| Task files per phase | `dev_docs/tasks/phase-{N}/` | |
| ≥6/8 task layers per feature | (verify via depth scorer) | |

## Step 8.5: Phase Coverage

| Expected Output | Location | Status |
|----------------|----------|--------|
| Phase coverage matrix | `dev_docs/completeness/phase-coverage.md` | |

## Step 9: Dashboard

| Expected Output | Location | Status |
|----------------|----------|--------|
| STATUS.md | `dev_docs/STATUS.md` | |

## Step 10: API Contracts

| Expected Output | Location | Status |
|----------------|----------|--------|
| API registry | `dev_docs/specs/api-registry.md` | |
| Contract files | `dev_docs/specs/contracts/` | |

## Step 11: Infrastructure

| Expected Output | Location | Status |
|----------------|----------|--------|
| Docker config | `docker-compose.yml` or equivalent | |
| ESLint config | `.eslintrc.*` or `eslint.config.*` | |
| CI/CD config | `.github/workflows/` or equivalent | |

## Step 12: Testing Setup

| Expected Output | Location | Status |
|----------------|----------|--------|
| Test config | `vitest.config.*` or equivalent | |
| Test utilities | `tests/` or `__tests__/` | |

## Step 13: Design System

| Expected Output | Location | Status |
|----------------|----------|--------|
| Design tokens | `dev_docs/foundations/design-tokens.md` | |
| Component catalog | `dev_docs/components/component-catalog.md` | |

## Step 14: Security

| Expected Output | Location | Status |
|----------------|----------|--------|
| Security framework | `dev_docs/security/` | |

## Step 15: Observability

| Expected Output | Location | Status |
|----------------|----------|--------|
| Monitoring setup | `dev_docs/observability/` or equivalent | |

## Step 16: Handoff

| Expected Output | Location | Status |
|----------------|----------|--------|
| HANDOFF.md | `dev_docs/HANDOFF.md` | |
| SUMMARY-CARD.md | `dev_docs/SUMMARY-CARD.md` | |
| Completeness dashboard | `dev_docs/completeness/dashboard.md` | |

## Steps 16.1-16.5: Quality Baselines

| Expected Output | Location | Status |
|----------------|----------|--------|
| Anti-pattern registry | `dev_docs/quality/anti-patterns.md` | |
| Prevention checklist | `dev_docs/quality/prevention-checklist.md` | |
| Security audit checklist | `dev_docs/security/security-audit-checklist.md` | |
| Performance targets | `dev_docs/performance/targets.md` | |
| Protection list | `dev_docs/PROTECTION-LIST.md` | |

## Steps 17-18.8: Operational Setup

| Expected Output | Location | Status |
|----------------|----------|--------|
| Capabilities plan | `dev_docs/capabilities/` | |
| Onboarding guide | `dev_docs/onboarding/` | |
| Team ceremonies | `dev_docs/ceremonies/` | |
| Incident response | `dev_docs/incident-response/` | |

## Steps 19-28.5: Marketing (if applicable)

| Expected Output | Location | Status |
|----------------|----------|--------|
| Marketing research | `marketing/research/` | |
| Brand & pricing | `marketing/brand/` | |
| Marketing strategy | `marketing/strategy/` | |
| Content & social | `marketing/content/` | |
| Launch plan | `marketing/launch/` | |
| MARKETING-HANDOFF.md | `MARKETING-HANDOFF.md` | |
| Competitive intelligence | `marketing/competitive-intelligence/` | |

## Step 1.7: Stakeholder Communications

| Expected Output | Location | Status |
|----------------|----------|--------|
| Communication plan | `dev_docs/comms/communication-plan.md` | |
| Audience matrix | `dev_docs/comms/audience-matrix.md` | |
| Kickoff communications | `dev_docs/comms/01-kickoff/` | |
| Miro exports | `dev_docs/comms/miro/` | |
| Phase-gated reports generated at each gate | `dev_docs/comms/{phase}/` | |
| Recurring update templates | `dev_docs/comms/recurring/` | |

## Step 14.9: Integration Strategy (if integrations exist)

| Expected Output | Location | Status |
|----------------|----------|--------|
| Integration strategy | `dev_docs/specs/integrations/integration-strategy.md` | |
| Category-specific integration specs | `dev_docs/specs/integrations/` | |
| Integration implementation tasks | `dev_docs/tasks/` (added to phase files) | |

## Step 18.7.5: Customer Experience Operations (if applicable)

| Expected Output | Location | Status |
|----------------|----------|--------|
| CX operations plans | `dev_docs/cx-operations/` | |
| AI chatbot blueprint | `dev_docs/cx-operations/ai-chatbot-blueprint.md` | |
| Self-service knowledge center plan | `dev_docs/cx-operations/self-service-knowledge-center.md` | |
| Customer health scoring model | `dev_docs/cx-operations/customer-health-scoring.md` | |
| CX team operations plan | `dev_docs/cx-operations/cx-team-operations.md` | |

### Step 28.7: Business Intelligence (skip if `BI_ENABLED == "false"`)

| Expected Output | Path | Status |
|----------------|----------|--------|
| BI artifacts directory | `dev_docs/bi/` | |
| Unified metrics registry (≥30 metrics) | `dev_docs/bi/metrics-registry.md` | |
| Warehouse architecture (if maturity ≥ tool-native) | `dev_docs/bi/warehouse-architecture.md` | |
| ETL pipeline design (if maturity ≥ tool-native) | `dev_docs/bi/etl-pipeline.md` | |
| Transformation layer (if maturity ≥ tool-native) | `dev_docs/bi/transformation-layer.md` | |
| Data governance plan (if maturity ≥ tool-native) | `dev_docs/bi/data-governance.md` | |
| Data lineage catalog (if maturity ≥ tool-native) | `dev_docs/bi/data-lineage.md` | |
| Alert threshold registry (if maturity ≥ tool-native) | `dev_docs/bi/alert-thresholds.md` | |
| Board deck template (if maturity ≥ governed) | `dev_docs/bi/executive-reporting/board-deck.md` | |
| MRR waterfall (if maturity ≥ governed) | `dev_docs/bi/executive-reporting/mrr-waterfall.md` | |
| Cohort analysis (if maturity ≥ governed) | `dev_docs/bi/executive-reporting/cohort-analysis.md` | |
| Departmental dashboards (if maturity ≥ governed) | `dev_docs/bi/executive-reporting/departmental-dashboards.md` | |
| Stakeholder communication | `dev_docs/comms/step-28.7-bi-setup.md` | |

---

## Summary

```
AUDIT RESULTS:
  Total expected outputs: {TOTAL}
  PASS: {PASS_COUNT}
  MISSING (critical): {MISSING_COUNT}
  STUB (warning): {STUB_COUNT}
  INCOMPLETE (warning): {INCOMPLETE_COUNT}

  Overall: {PASS_COUNT}/{TOTAL} ({PERCENTAGE}%)
```
