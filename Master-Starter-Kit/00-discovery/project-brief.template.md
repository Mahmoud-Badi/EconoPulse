# PROJECT BRIEF: {{PROJECT_NAME}}

> Generated from Phase 0 Discovery Interview on {{DATE}}
> Status: {{DRAFT_OR_APPROVED}}
> Last updated: {{DATE}}

---

## 1. What It Does

**One-sentence summary:** {{ONE_SENTENCE_PRODUCT_DESCRIPTION}}

**Expanded description:**
{{PRODUCT_DESCRIPTION_EXPANDED}}

**Core loop (the ONE thing users do every day):**
{{CORE_DAILY_ACTION}}

---

## 2. Business Model

**Customer type:** {{CUSTOMER_TYPE}}

**Revenue model:** {{REVENUE_MODEL}}

**Pricing notes:**
{{PRICING_DETAILS_OR_TBD}}

---

## 3. Current State

**Existing system:** {{EXISTING_SYSTEM}}

**What's broken about the current approach:**
- {{PAIN_POINT_1}}
- {{PAIN_POINT_2}}
- {{PAIN_POINT_3}}

**What works well and must be preserved:**
- {{KEEP_1}}
- {{KEEP_2}}

---

## 4. User Types

| Role | Description | Key Daily Workflow | Biggest Frustration | Platform |
|------|-------------|-------------------|---------------------|----------|
| {{ROLE_1}} | {{DESCRIPTION}} | {{WORKFLOW}} | {{FRUSTRATION}} | {{PLATFORM}} |
| {{ROLE_2}} | {{DESCRIPTION}} | {{WORKFLOW}} | {{FRUSTRATION}} | {{PLATFORM}} |
| {{ROLE_3}} | {{DESCRIPTION}} | {{WORKFLOW}} | {{FRUSTRATION}} | {{PLATFORM}} |
| {{ROLE_4}} | {{DESCRIPTION}} | {{WORKFLOW}} | {{FRUSTRATION}} | {{PLATFORM}} |

**Critical user type for day one:** {{ROLE_NAME}} — {{REASON}}

**Total user types:** {{COUNT}}

**Accessibility requirements:** {{WCAG_LEVEL_AND_SPECIFIC_NEEDS}}

**User count targets:**
- Launch: {{COUNT}}
- Year 1: {{COUNT}}

---

## 5. Service Inventory (from Phase 2)

**Expected services:** {{EXPECTED_SERVICE_COUNT}}
**Enumerated services:** {{ACTUAL_SERVICE_COUNT}}

| # | Service Name | Description | Entities | User Types | Screens | Endpoints | Priority |
|---|-------------|-------------|----------|------------|---------|-----------|----------|
| {{N}} | {{SERVICE_NAME}} | {{DESCRIPTION}} | {{ENTITIES}} | {{ROLES}} | {{SCREEN_COUNT}} | {{ENDPOINT_COUNT}} | {{PRIORITY}} |

**P0 services (MVP):** {{P0_LIST}}
**P1 services (fast-follow):** {{P1_LIST}}
**P2+ services (deferred):** {{P2_LIST}}

---

## 6. Screen Inventory (from Phase 3)

**Total unique screens:** {{SCREEN_COUNT}}
**Screens per role:**

| Role | Screen Count | Landing Screen |
|------|-------------|---------------|
| {{ROLE}} | {{COUNT}} | {{LANDING_SCREEN}} ({{ROUTE}}) |

**Master Screen List:**

| # | Screen Name | Route | Roles | Service | Priority |
|---|------------|-------|-------|---------|----------|
| {{N}} | {{SCREEN_NAME}} | {{ROUTE}} | {{ROLES}} | {{SERVICE}} | {{PRIORITY}} |

---

## 7. Workflow Summary (from Phase 3)

| # | Workflow Name | Role | Steps | Service | Edge Cases |
|---|-------------|------|-------|---------|------------|
| {{N}} | {{WORKFLOW}} | {{ROLE}} | {{STEP_COUNT}} | {{SERVICE}} | {{EDGE_CASE_COUNT}} |

---

## 8. Permission Matrix (from Phase 3)

| Entity | {{ROLE_1}} | {{ROLE_2}} | {{ROLE_3}} | {{ROLE_4}} |
|--------|-----------|-----------|-----------|-----------|
| {{ENTITY}} | {{PERMISSION}} | {{PERMISSION}} | {{PERMISSION}} | {{PERMISSION}} |

---

## 9. Notification Matrix (from Phase 3)

| Trigger Event | Recipient | Channel | Urgency |
|--------------|-----------|---------|---------|
| {{TRIGGER}} | {{RECIPIENT}} | {{CHANNEL}} | {{URGENCY}} |

**Total notification event types:** {{COUNT}}
**Channels used:** {{CHANNELS}}

---

## 10. Competitors

| Competitor | What They Do Well | What They Do Poorly | Key Feature to Steal |
|------------|-------------------|---------------------|---------------------|
| {{COMPETITOR_1}} | {{STRENGTH}} | {{WEAKNESS}} | {{FEATURE}} |
| {{COMPETITOR_2}} | {{STRENGTH}} | {{WEAKNESS}} | {{FEATURE}} |
| {{COMPETITOR_3}} | {{STRENGTH}} | {{WEAKNESS}} | {{FEATURE}} |

**Competitive positioning:** {{HOW_THIS_PRODUCT_DIFFERS_FROM_COMPETITORS}}

---

## 11. Tech Stack (Finalized)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Monorepo | {{MONOREPO_TOOL}} | {{REASON}} |
| Frontend | {{FRAMEWORK}} | {{REASON}} |
| API | {{API_STYLE}} | {{REASON}} |
| Database | {{ORM}} + {{DATABASE}} | {{REASON}} |
| Auth | {{AUTH_PROVIDER}} | {{REASON}} |
| Styling | {{COMPONENT_LIB}} | {{REASON}} |
| Testing | {{TEST_FRAMEWORK}} | {{REASON}} |
| Linting | {{LINTER}} | {{REASON}} |
| Real-time | {{REALTIME_STRATEGY}} | {{REASON}} |
| File Storage | {{FILE_STORAGE}} | {{REASON}} |

**Stack source:** {{STACK_SOURCE}}

**Non-default choices and rationale:**
{{ANY_DEVIATIONS_FROM_THE_DEFAULT_STACK_AND_WHY}}

---

## 12. Integrations Required

| Service | Purpose | Phase | Mock Strategy |
|---------|---------|-------|---------------|
| {{SERVICE_1}} | {{PURPOSE}} | {{PHASE_NUMBER}} | {{HOW_TO_DEV_WITHOUT_IT}} |
| {{SERVICE_2}} | {{PURPOSE}} | {{PHASE_NUMBER}} | {{HOW_TO_DEV_WITHOUT_IT}} |
| {{SERVICE_3}} | {{PURPOSE}} | {{PHASE_NUMBER}} | {{HOW_TO_DEV_WITHOUT_IT}} |

**Total integrations:** {{COUNT}}
**MVP integrations (Phase 0-2):** {{LIST}}
**Post-MVP integrations:** {{LIST}}

---

## 13. Compliance Requirements

| Regulation | Applicable? | Impact |
|------------|-------------|--------|
| HIPAA | {{YES_OR_NO}} | {{IMPACT_ON_ARCHITECTURE}} |
| PCI DSS | {{YES_OR_NO}} | {{IMPACT_ON_ARCHITECTURE}} |
| SOC 2 | {{YES_OR_NO}} | {{IMPACT_ON_ARCHITECTURE}} |
| GDPR | {{YES_OR_NO}} | {{IMPACT_ON_ARCHITECTURE}} |
| Other: {{NAME}} | {{YES_OR_NO}} | {{IMPACT_ON_ARCHITECTURE}} |

**Compliance summary:** {{ONE_PARAGRAPH_SUMMARY}}

---

## 14. Deployment & Infrastructure

**Deployment target:** {{DEPLOY_TARGET}}

**Database hosting:** {{DB_HOST}}

**Multi-tenancy:** {{MULTI_TENANCY_STRATEGY}}

**Environment strategy:**
- Development: {{LOCAL_OR_HOSTED}}
- Staging: {{URL_OR_TBD}}
- Production: {{URL_OR_TBD}}

**CI/CD:** {{CI_CD}}

---

## 15. Scale Targets

| Metric | Launch | 6 Months | 1 Year |
|--------|--------|----------|--------|
| Users | {{COUNT}} | {{COUNT}} | {{COUNT}} |
| Concurrent users | {{COUNT}} | {{COUNT}} | {{COUNT}} |
| Data volume | {{SIZE}} | {{SIZE}} | {{SIZE}} |
| API requests/day | {{COUNT}} | {{COUNT}} | {{COUNT}} |

**Scale-driven architecture decisions:**
{{ANY_DECISIONS_MADE_SPECIFICALLY_BECAUSE_OF_SCALE_TARGETS}}

---

## 16. Team

| Member | Role | Availability | Experience Level |
|--------|------|-------------|-----------------|
| {{NAME_1}} | {{ROLE}} | {{AVAILABILITY}} | {{EXPERIENCE_LEVEL}} |
| {{NAME_2}} | {{ROLE}} | {{AVAILABILITY}} | {{EXPERIENCE_LEVEL}} |

**QA strategy:** {{QA_STRATEGY}}

**Estimated feature velocity:** {{N}} features per week

---

## 17. Timeline

| Milestone | Target Date | Scope |
|-----------|------------|-------|
| MVP | {{DATE}} | {{FEATURE_COUNT}} core features |
| Beta | {{DATE}} | {{FEATURE_COUNT}} features + polish |
| Launch | {{DATE}} | Full feature set |

**Available development time:** {{WEEKS}} weeks to MVP

**Feasibility check:**
- Features requested: {{COUNT}}
- Max features achievable: {{DEVELOPERS}} devs x {{VELOCITY}} features/week x {{WEEKS}} weeks = {{MAX}}
- Assessment: {{FEASIBILITY_ASSESSMENT}}

{{IF_NEEDS_SCOPE_CUT}}

---

## 18. Tribunal Notes

> Anything that came up during the interview that doesn't fit neatly into the categories above. Domain-specific constraints, political considerations, technical debt from previous versions, user quotes, etc.

- {{NOTE_1}}
- {{NOTE_2}}
- {{NOTE_3}}

---

## 19. Open Questions

> Questions that came up during the interview but couldn't be answered yet. These need resolution before Phase 2 (Architecture).

- [ ] {{QUESTION_1}}
- [ ] {{QUESTION_2}}
- [ ] {{QUESTION_3}}

---

## 20. Next Steps

1. [ ] User reviews and approves this brief
2. [ ] Resolve all Open Questions above
3. [ ] Proceed to **01-research/** for competitor analysis and persona development
4. [ ] Proceed to **02-architecture/** for technical design

---

*This brief was generated by Claude during Phase 0: Discovery.*
*All placeholders marked with {{BRACES}} must be filled before approval.*
*Items marked "(default — confirm later)" used smart defaults from the intake questions.*
