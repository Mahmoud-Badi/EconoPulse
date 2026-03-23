# Stakeholder Dashboard — {{PROJECT_NAME}}

> **Report Period:** {{PERIOD, e.g., Feb 3-14, 2026}}
> **Prepared by:** {{AUTHOR}}
> **Next Update:** {{NEXT_DATE}}

---

## Executive Summary

{{One paragraph summarizing the period. Example: "This sprint focused on completing the user authentication system and beginning work on the dashboard. Authentication is now fully functional including social login. The dashboard is 40% complete and on track for the March 1 milestone. No blockers currently, but we identified a risk around third-party API rate limits that we are monitoring."}}

---

## Feature Progress

| Feature | Status | Phase | Expected Completion | Notes |
|---------|--------|-------|--------------------:|-------|
| {{FEATURE_1}} | Complete | Deployed | {{DATE}} | Live in production |
| {{FEATURE_2}} | On Track | Development | {{DATE}} | 70% complete |
| {{FEATURE_3}} | At Risk | Design | {{DATE}} | Waiting on design assets |
| {{FEATURE_4}} | Not Started | Planned | {{DATE}} | Scheduled for next sprint |

**Status key:** Complete | On Track | At Risk | Blocked | Not Started

---

## Milestone Timeline

```
{{PROJECT_NAME}} Milestones

[============================] Milestone 1: Foundation        ✓ Complete ({{DATE}})
[==================          ] Milestone 2: Core Features      In Progress (target {{DATE}})
[===                         ] Milestone 3: Polish & Testing   Upcoming (target {{DATE}})
[                            ] Milestone 4: Launch             Planned (target {{DATE}})
```

| Milestone | Target Date | Status | Confidence |
|-----------|------------|--------|------------|
| {{MILESTONE_1}} | {{DATE}} | Complete | -- |
| {{MILESTONE_2}} | {{DATE}} | In Progress | High |
| {{MILESTONE_3}} | {{DATE}} | Upcoming | Medium |
| {{MILESTONE_4}} | {{DATE}} | Planned | Medium |

**Confidence levels:** High (no known risks), Medium (risks identified, mitigations in place), Low (blockers present or timeline pressure)

---

## Key Metrics

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Screens built | {{X}} / {{TOTAL}} | All by {{DATE}} | On track |
| API endpoints built | {{X}} / {{TOTAL}} | All by {{DATE}} | On track |
| Test coverage | {{X}}% | {{TARGET}}% | Improving |
| Build status | Passing | Always passing | Stable |
| Open bugs | {{COUNT}} | <{{TARGET}} | {{TREND}} |
| Average page load time | {{X}}s | <{{TARGET}}s | {{TREND}} |

---

## Risk Summary

Top risks from the project risk register, written in plain language:

| Risk | Likelihood | Impact | Mitigation | Status |
|------|-----------|--------|------------|--------|
| {{RISK_1, e.g., "Third-party API may impose rate limits that affect user experience"}} | Medium | High | Implementing caching layer | Monitoring |
| {{RISK_2, e.g., "Design assets delayed could push back dashboard delivery"}} | Medium | Medium | Using placeholder designs, will swap later | Active |
| {{RISK_3, e.g., "Performance targets may not be met on mobile devices"}} | Low | Medium | Running performance tests weekly | Monitoring |

---

## Budget Status

| Category | Budget | Spent to Date | Remaining | Status |
|----------|--------|--------------|-----------|--------|
| Infrastructure | ${{BUDGET}}/mo | ${{SPENT}} | ${{REMAINING}} | On budget |
| Third-party services | ${{BUDGET}}/mo | ${{SPENT}} | ${{REMAINING}} | On budget |
| AI/API costs | ${{BUDGET}}/mo | ${{SPENT}} | ${{REMAINING}} | {{STATUS}} |
| **Total** | **${{TOTAL_BUDGET}}** | **${{TOTAL_SPENT}}** | **${{TOTAL_REMAINING}}** | **{{STATUS}}** |

*Refer to the full cost breakdown in `docs/cost-estimation.md`.*

---

## Upcoming Deliverables

### Next 2 Weeks
- [ ] {{DELIVERABLE_1, e.g., "Dashboard main view — data visualization and filtering"}}
- [ ] {{DELIVERABLE_2, e.g., "Email notification system — welcome and password reset flows"}}
- [ ] {{DELIVERABLE_3, e.g., "Mobile responsive pass on all existing screens"}}

### Next Month
- [ ] {{DELIVERABLE_4, e.g., "User settings page with profile management"}}
- [ ] {{DELIVERABLE_5, e.g., "Export/import functionality for user data"}}
- [ ] {{DELIVERABLE_6, e.g., "Performance optimization pass targeting sub-2s load times"}}

---

## Blockers Requiring Stakeholder Input

| Blocker | Impact | Decision Needed | Needed By |
|---------|--------|----------------|-----------|
| {{BLOCKER_1, e.g., "Need final copy for onboarding screens"}} | Delays onboarding feature by {{DAYS}} days | {{DECISION, e.g., "Approve draft copy or provide final version"}} | {{DATE}} |
| {{BLOCKER_2}} | {{IMPACT}} | {{DECISION}} | {{DATE}} |

*If this section is empty, no stakeholder input is currently needed.*

---

## Demo Schedule

| Date | What Will Be Shown | Audience | Duration |
|------|-------------------|----------|----------|
| {{DATE}} | {{DEMO_DESCRIPTION, e.g., "Live walkthrough of authentication and dashboard"}} | {{AUDIENCE, e.g., "Product team"}} | {{DURATION, e.g., "30 min"}} |
| {{DATE}} | {{DEMO_DESCRIPTION}} | {{AUDIENCE}} | {{DURATION}} |

---

## How to Read This Dashboard

- **Feature Progress** tells you what is being built and where each piece stands
- **Milestone Timeline** shows whether the overall project is on schedule
- **Key Metrics** are objective measurements of build completeness and quality
- **Risk Summary** highlights anything that could affect the timeline or outcome
- **Blockers** are items where the development team needs your help to proceed

This dashboard is updated every {{CADENCE, e.g., two weeks}}. If you have questions between updates, contact {{CONTACT}}.
