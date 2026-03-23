# {{PROJECT_NAME}} — Team Roles & Responsibilities

> **Audience:** All stakeholders | **Date:** {{DATE}} | **Version:** {{VERSION}}
> **Purpose:** Define who does what, who decides what, and how communication flows.

---

## Status

| Area                    | Status              | Notes                          |
|-------------------------|---------------------|--------------------------------|
| Team Staffing           | [GREEN] On track    | {{STAFFING_STATUS_NOTES}}      |
| Role Clarity            | [GREEN] On track    | {{ROLE_CLARITY_NOTES}}         |
| Communication Flow      | [GREEN] On track    | {{COMMS_FLOW_NOTES}}           |

**Status legend:** [GREEN] On track | [YELLOW] At risk | [RED] Blocked

---

## 1. Team Overview

| Name                     | Role                               | Responsibility (Plain English)           | Availability         | Contact              |
|--------------------------|-------------------------------------|------------------------------------------|----------------------|----------------------|
| {{MEMBER_1_NAME}}        | {{MEMBER_1_ROLE}}                   | {{MEMBER_1_RESPONSIBILITY}}              | {{MEMBER_1_AVAIL}}   | {{MEMBER_1_CONTACT}} |
| {{MEMBER_2_NAME}}        | {{MEMBER_2_ROLE}}                   | {{MEMBER_2_RESPONSIBILITY}}              | {{MEMBER_2_AVAIL}}   | {{MEMBER_2_CONTACT}} |
| {{MEMBER_3_NAME}}        | {{MEMBER_3_ROLE}}                   | {{MEMBER_3_RESPONSIBILITY}}              | {{MEMBER_3_AVAIL}}   | {{MEMBER_3_CONTACT}} |
| {{MEMBER_4_NAME}}        | {{MEMBER_4_ROLE}}                   | {{MEMBER_4_RESPONSIBILITY}}              | {{MEMBER_4_AVAIL}}   | {{MEMBER_4_CONTACT}} |
| {{MEMBER_5_NAME}}        | {{MEMBER_5_ROLE}}                   | {{MEMBER_5_RESPONSIBILITY}}              | {{MEMBER_5_AVAIL}}   | {{MEMBER_5_CONTACT}} |
| {{MEMBER_6_NAME}}        | {{MEMBER_6_ROLE}}                   | {{MEMBER_6_RESPONSIBILITY}}              | {{MEMBER_6_AVAIL}}   | {{MEMBER_6_CONTACT}} |

> **Team size:** {{TEAM_SIZE}} people | **Working hours:** {{WORKING_HOURS}} | **Time zone:** {{TIME_ZONE}}

---

## 2. RACI Matrix

> **R** = Responsible (does the work) | **A** = Accountable (final decision-maker) | **C** = Consulted (asked for input) | **I** = Informed (kept in the loop)

| Activity                           | {{MEMBER_1_ROLE}} | {{MEMBER_2_ROLE}} | {{MEMBER_3_ROLE}} | {{MEMBER_4_ROLE}} | {{MEMBER_5_ROLE}} | {{MEMBER_6_ROLE}} |
|------------------------------------|:------------------:|:------------------:|:------------------:|:------------------:|:------------------:|:------------------:|
| Architecture decisions             | {{RACI_ARCH_1}}    | {{RACI_ARCH_2}}    | {{RACI_ARCH_3}}    | {{RACI_ARCH_4}}    | {{RACI_ARCH_5}}    | {{RACI_ARCH_6}}    |
| Feature development                | {{RACI_FEAT_1}}    | {{RACI_FEAT_2}}    | {{RACI_FEAT_3}}    | {{RACI_FEAT_4}}    | {{RACI_FEAT_5}}    | {{RACI_FEAT_6}}    |
| Testing & QA                       | {{RACI_TEST_1}}    | {{RACI_TEST_2}}    | {{RACI_TEST_3}}    | {{RACI_TEST_4}}    | {{RACI_TEST_5}}    | {{RACI_TEST_6}}    |
| Deployment                         | {{RACI_DEPL_1}}    | {{RACI_DEPL_2}}    | {{RACI_DEPL_3}}    | {{RACI_DEPL_4}}    | {{RACI_DEPL_5}}    | {{RACI_DEPL_6}}    |
| Stakeholder updates                | {{RACI_STKH_1}}    | {{RACI_STKH_2}}    | {{RACI_STKH_3}}    | {{RACI_STKH_4}}    | {{RACI_STKH_5}}    | {{RACI_STKH_6}}    |
| Budget management                  | {{RACI_BUDG_1}}    | {{RACI_BUDG_2}}    | {{RACI_BUDG_3}}    | {{RACI_BUDG_4}}    | {{RACI_BUDG_5}}    | {{RACI_BUDG_6}}    |
| Scope change evaluation            | {{RACI_SCOP_1}}    | {{RACI_SCOP_2}}    | {{RACI_SCOP_3}}    | {{RACI_SCOP_4}}    | {{RACI_SCOP_5}}    | {{RACI_SCOP_6}}    |
| User acceptance testing            | {{RACI_UAT_1}}     | {{RACI_UAT_2}}     | {{RACI_UAT_3}}     | {{RACI_UAT_4}}     | {{RACI_UAT_5}}     | {{RACI_UAT_6}}     |

> **How to read this:** For each activity, look across the row. The person marked **R** does the work. The person marked **A** has final say. Every activity must have exactly one **A**.

---

## 3. Decision Authority

> Who can approve changes to scope, timeline, and budget.

| Decision Type                      | Who Can Approve                    | Escalation If Disagreement         | Turnaround Time      |
|------------------------------------|------------------------------------|------------------------------------|----------------------|
| **Scope changes (minor)**          | {{MINOR_SCOPE_APPROVER}}           | {{MINOR_SCOPE_ESCALATION}}         | {{MINOR_SCOPE_TAT}}  |
| **Scope changes (major)**          | {{MAJOR_SCOPE_APPROVER}}           | {{MAJOR_SCOPE_ESCALATION}}         | {{MAJOR_SCOPE_TAT}}  |
| **Timeline changes (< 1 week)**    | {{MINOR_TIMELINE_APPROVER}}        | {{MINOR_TIMELINE_ESCALATION}}      | {{MINOR_TIMELINE_TAT}}|
| **Timeline changes (> 1 week)**    | {{MAJOR_TIMELINE_APPROVER}}        | {{MAJOR_TIMELINE_ESCALATION}}      | {{MAJOR_TIMELINE_TAT}}|
| **Budget changes**                 | {{BUDGET_APPROVER}}                | {{BUDGET_ESCALATION}}              | {{BUDGET_TAT}}       |
| **Technology changes**             | {{TECH_APPROVER}}                  | {{TECH_ESCALATION}}                | {{TECH_TAT}}         |
| **Go / No-go for launch**          | {{LAUNCH_APPROVER}}                | {{LAUNCH_ESCALATION}}              | {{LAUNCH_TAT}}       |

> **Plain-English rule:** Small changes are decided quickly by the project team. Large changes require stakeholder approval. If people disagree, the decision escalates up.

---

## 4. Communication Flow

### Who Reports to Whom

```
{{EXECUTIVE_SPONSOR}}
        |
{{PROJECT_SPONSOR}}
        |
{{PROJECT_LEAD_NAME}} (Project Lead)
        |
   ┌────┼────────────┐
   |    |             |
{{MEMBER_2_ROLE}}  {{MEMBER_3_ROLE}}  {{MEMBER_4_ROLE}}
```

### Regular Communication Cadence

| Meeting / Update               | Frequency          | Attendees                          | Owner                |
|--------------------------------|--------------------|------------------------------------|----------------------|
| Daily standup                  | Daily              | Development team                   | {{STANDUP_OWNER}}    |
| Sprint review / demo           | {{SPRINT_FREQ}}    | Team + stakeholders                | {{DEMO_OWNER}}       |
| Stakeholder status update      | {{STATUS_FREQ}}    | All stakeholders                   | {{STATUS_OWNER}}     |
| Executive summary              | Monthly            | Executive sponsors                 | {{EXEC_OWNER}}       |
| Risk review                    | {{RISK_FREQ}}      | Project lead + tech lead           | {{RISK_OWNER}}       |

### Escalation Path

> When something goes wrong, here is how it gets escalated:

| Level   | Who Handles It               | When to Escalate                           | Response Time        |
|---------|------------------------------|--------------------------------------------|----------------------|
| Level 1 | {{LEVEL_1_HANDLER}}          | Issue can be resolved within the team       | Same day             |
| Level 2 | {{LEVEL_2_HANDLER}}          | Issue affects timeline or scope             | Within 24 hours      |
| Level 3 | {{LEVEL_3_HANDLER}}          | Issue affects budget, major timeline shift, or launch date | Within 48 hours |
| Level 4 | {{LEVEL_4_HANDLER}}          | Project viability is in question            | Immediate meeting    |

---

> **Questions about roles or responsibilities?** Contact {{PROJECT_LEAD_NAME}} at {{PROJECT_LEAD_CONTACT}}.
> **Document owner:** {{PROJECT_LEAD_NAME}} | **Last updated:** {{DATE}}
