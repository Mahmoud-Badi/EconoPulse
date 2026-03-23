# Milestone Roadmap — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

**Category:** 10 — Timeline & Roadmap

---

## Achievement Milestones by Phase

```mermaid
timeline
    title {{PROJECT_NAME}} — Milestone Roadmap

    section Phase 0 — Foundation
        {{PHASE_0_START_MONTH}} : Architecture finalized and approved
                                : Development environment fully operational
                                : Authentication system live

    section Phase 1 — Core MVP
        {{PHASE_1_START_MONTH}} : {{MILESTONE_1_ACHIEVEMENT}}
                                : {{MILESTONE_2_ACHIEVEMENT}}
        {{PHASE_1_MID_MONTH}}   : {{MILESTONE_3_ACHIEVEMENT}}
                                : Core platform operational end-to-end
        {{PHASE_1_END_MONTH}}   : {{MILESTONE_4_ACHIEVEMENT}}
                                : First internal users onboarded

    section Phase 2 — Enhanced
        {{PHASE_2_START_MONTH}} : {{MILESTONE_5_ACHIEVEMENT}}
                                : {{MILESTONE_6_ACHIEVEMENT}}
        {{PHASE_2_MID_MONTH}}   : {{MILESTONE_7_ACHIEVEMENT}}
                                : Advanced workflows operational
        {{PHASE_2_END_MONTH}}   : {{MILESTONE_8_ACHIEVEMENT}}
                                : All planned features delivered

    section Launch & Growth
        {{LAUNCH_MONTH}}        : Production environment live
                                : First customer onboarded
                                : Monitoring and alerting operational
        {{POST_LAUNCH_MONTH}}   : Performance targets validated
                                : Hypercare period complete
                                : Handoff to operations team
```

## Risk & Business Milestones

```mermaid
timeline
    title {{PROJECT_NAME}} — Risk & Business Milestones

    section External Dependencies
        {{EXT_DEP_1_MONTH}} : {{EXTERNAL_DEPENDENCY_1}} resolved
        {{EXT_DEP_2_MONTH}} : {{EXTERNAL_DEPENDENCY_2}} resolved
        {{EXT_DEP_3_MONTH}} : Third-party integrations certified

    section Regulatory & Compliance
        {{COMPLIANCE_MONTH_1}} : {{COMPLIANCE_MILESTONE_1}}
        {{COMPLIANCE_MONTH_2}} : {{COMPLIANCE_MILESTONE_2}}
        {{CERTIFICATION_MONTH}} : {{CERTIFICATION_NAME}} certification obtained

    section Business Milestones
        {{BIZ_MILESTONE_1_MONTH}} : {{REVENUE_TARGET_1}} revenue target achieved
                                  : {{USER_TARGET_1}} active users reached
        {{BIZ_MILESTONE_2_MONTH}} : {{REVENUE_TARGET_2}} revenue target achieved
                                  : {{USER_TARGET_2}} active users reached
        {{BIZ_MILESTONE_3_MONTH}} : Break-even point reached
                                  : {{USER_TARGET_3}} active users reached
```

---

## Milestone Detail

| Milestone | Phase | Target Date | Gate Criteria | Stakeholder Deliverable |
|-----------|-------|-------------|---------------|------------------------|
| Architecture finalized | Phase 0 | {{ARCH_DATE}} | All ADRs approved, tech stack confirmed | Architecture decision summary document |
| Development environment operational | Phase 0 | {{DEVENV_DATE}} | CI/CD green, all environments provisioned | Environment access credentials distributed |
| Authentication system live | Phase 0 | {{AUTH_DATE}} | Login, registration, RBAC functional | Security review sign-off |
| {{MILESTONE_1_ACHIEVEMENT}} | Phase 1 | {{MILESTONE_1_DATE}} | {{MILESTONE_1_GATE}} | {{MILESTONE_1_DELIVERABLE}} |
| {{MILESTONE_2_ACHIEVEMENT}} | Phase 1 | {{MILESTONE_2_DATE}} | {{MILESTONE_2_GATE}} | {{MILESTONE_2_DELIVERABLE}} |
| {{MILESTONE_3_ACHIEVEMENT}} | Phase 1 | {{MILESTONE_3_DATE}} | {{MILESTONE_3_GATE}} | {{MILESTONE_3_DELIVERABLE}} |
| {{MILESTONE_4_ACHIEVEMENT}} | Phase 1 | {{MILESTONE_4_DATE}} | {{MILESTONE_4_GATE}} | {{MILESTONE_4_DELIVERABLE}} |
| {{MILESTONE_5_ACHIEVEMENT}} | Phase 2 | {{MILESTONE_5_DATE}} | {{MILESTONE_5_GATE}} | {{MILESTONE_5_DELIVERABLE}} |
| {{MILESTONE_6_ACHIEVEMENT}} | Phase 2 | {{MILESTONE_6_DATE}} | {{MILESTONE_6_GATE}} | {{MILESTONE_6_DELIVERABLE}} |
| {{MILESTONE_7_ACHIEVEMENT}} | Phase 2 | {{MILESTONE_7_DATE}} | {{MILESTONE_7_GATE}} | {{MILESTONE_7_DELIVERABLE}} |
| {{MILESTONE_8_ACHIEVEMENT}} | Phase 2 | {{MILESTONE_8_DATE}} | {{MILESTONE_8_GATE}} | {{MILESTONE_8_DELIVERABLE}} |
| Production launch | Launch | {{LAUNCH_DATE}} | Go/no-go checklist passed, rollback tested | Launch announcement, customer access |
| Hypercare complete | Post-Launch | {{HYPERCARE_END_DATE}} | Error rates stable, no P0 for {{STABLE_DAYS}} days | Operations handoff report |

## Stakeholder Deliverables Matrix

| Milestone | CEO | Investors | Customers | Engineering |
|-----------|-----|-----------|-----------|-------------|
| Architecture finalized | Executive summary (1-page) | Technical capability brief | N/A | Full ADR documentation |
| Core platform operational | Demo walkthrough | Progress report with KPIs | N/A | Internal release notes |
| {{MILESTONE_1_ACHIEVEMENT}} | {{CEO_DELIV_M1}} | {{INVESTOR_DELIV_M1}} | {{CUSTOMER_DELIV_M1}} | {{ENG_DELIV_M1}} |
| {{MILESTONE_3_ACHIEVEMENT}} | {{CEO_DELIV_M3}} | {{INVESTOR_DELIV_M3}} | {{CUSTOMER_DELIV_M3}} | {{ENG_DELIV_M3}} |
| {{MILESTONE_5_ACHIEVEMENT}} | {{CEO_DELIV_M5}} | {{INVESTOR_DELIV_M5}} | {{CUSTOMER_DELIV_M5}} | {{ENG_DELIV_M5}} |
| {{MILESTONE_7_ACHIEVEMENT}} | {{CEO_DELIV_M7}} | {{INVESTOR_DELIV_M7}} | {{CUSTOMER_DELIV_M7}} | {{ENG_DELIV_M7}} |
| Production launch | Board presentation | Investor update + metrics | Welcome email + onboarding guide | Production runbook |
| Hypercare complete | Stability report | Unit economics update | Support SLA confirmation | Post-mortem + retrospective |

## Quarterly Summary

| Quarter | Key Milestones | Status | Risk Level |
|---------|---------------|--------|------------|
| {{Q1_LABEL}} | {{Q1_MILESTONES}} | {{Q1_STATUS}} | {{Q1_RISK}} |
| {{Q2_LABEL}} | {{Q2_MILESTONES}} | {{Q2_STATUS}} | {{Q2_RISK}} |
| {{Q3_LABEL}} | {{Q3_MILESTONES}} | {{Q3_STATUS}} | {{Q3_RISK}} |
| {{Q4_LABEL}} | {{Q4_MILESTONES}} | {{Q4_STATUS}} | {{Q4_RISK}} |

---

## Cross-References

- **Full Project Timeline:** `timeline-full-project.template.md` — detailed Gantt with all tasks and durations
- **Phased Roadmap:** `overview-phased-roadmap.template.md` — phase-by-phase feature breakdown
- **Stakeholder Communication Plan:** `../communication-plan.template.md` — when and how to deliver milestone updates
- **Audience Matrix:** `../audience-matrix.template.md` — stakeholder-specific communication preferences
