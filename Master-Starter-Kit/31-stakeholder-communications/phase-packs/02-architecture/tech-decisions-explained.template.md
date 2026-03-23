# {{PROJECT_NAME}} — Tech Decisions Explained

> **Audience:** Non-technical stakeholders | **Date:** {{DATE}} | **Version:** {{VERSION}}
> **Purpose:** Translate every major technology decision into plain English so you understand what was chosen, why, and how it affects you.

---

## Why This Section Matters

**These choices affect the speed, cost, and quality of what we build.** You do not need to understand the technology itself — you need to understand what each choice means for the project's timeline, budget, and user experience.

---

## Status

| Area                  | Status              | Notes                          |
|-----------------------|---------------------|--------------------------------|
| Tech Stack Finalized  | [GREEN] On track    | {{TECH_STACK_STATUS_NOTES}}    |
| Cost Estimates        | [GREEN] On track    | {{COST_STATUS_NOTES}}          |
| Risk Assessment       | [GREEN] On track    | {{RISK_STATUS_NOTES}}          |

**Status legend:** [GREEN] On track | [YELLOW] At risk | [RED] Blocked

---

## Technology Decisions

### Overview Table

| # | Decision Area        | What We Chose              | What It Means For You                              | Why Not the Alternative                         |
|---|----------------------|----------------------------|----------------------------------------------------|-------------------------------------------------|
| 1 | Frontend Framework   | {{FRONTEND_CHOICE}}        | {{FRONTEND_BUSINESS_MEANING}}                      | {{FRONTEND_ALT_REASON}}                         |
| 2 | Backend Framework    | {{BACKEND_CHOICE}}         | {{BACKEND_BUSINESS_MEANING}}                       | {{BACKEND_ALT_REASON}}                          |
| 3 | Database             | {{DATABASE_CHOICE}}        | {{DATABASE_BUSINESS_MEANING}}                      | {{DATABASE_ALT_REASON}}                         |
| 4 | Hosting / Cloud      | {{HOSTING_CHOICE}}         | {{HOSTING_BUSINESS_MEANING}}                       | {{HOSTING_ALT_REASON}}                          |
| 5 | Authentication       | {{AUTH_CHOICE}}            | {{AUTH_BUSINESS_MEANING}}                          | {{AUTH_ALT_REASON}}                             |
| 6 | {{DECISION_6_AREA}}  | {{DECISION_6_CHOICE}}      | {{DECISION_6_BUSINESS_MEANING}}                    | {{DECISION_6_ALT_REASON}}                       |
| 7 | {{DECISION_7_AREA}}  | {{DECISION_7_CHOICE}}      | {{DECISION_7_BUSINESS_MEANING}}                    | {{DECISION_7_ALT_REASON}}                       |

---

### Decision Details — Plain English

#### Frontend Framework → {{FRONTEND_CHOICE}}

> **What this is:** The frontend framework determines how fast and smooth the app feels when users click buttons, navigate pages, and interact with the product.

- **What we chose:** {{FRONTEND_CHOICE}}
- **What this means for you:** {{FRONTEND_BUSINESS_MEANING}}
- **Why this over alternatives:** {{FRONTEND_ALT_DETAIL}}
- **Risk level:** {{FRONTEND_RISK_LEVEL}}

#### Database → {{DATABASE_CHOICE}}

> **What this is:** The database is where all your data lives. It is chosen for reliability, speed, and how well it handles growth.

- **What we chose:** {{DATABASE_CHOICE}}
- **What this means for you:** {{DATABASE_BUSINESS_MEANING}}
- **Why this over alternatives:** {{DATABASE_ALT_DETAIL}}
- **Risk level:** {{DATABASE_RISK_LEVEL}}

#### Hosting → {{HOSTING_CHOICE}}

> **What this is:** Hosting is where the app runs — the computers that keep it available 24/7. It is chosen for cost, reliability, and the ability to handle more users over time.

- **What we chose:** {{HOSTING_CHOICE}}
- **What this means for you:** {{HOSTING_BUSINESS_MEANING}}
- **Why this over alternatives:** {{HOSTING_ALT_DETAIL}}
- **Risk level:** {{HOSTING_RISK_LEVEL}}

#### Authentication → {{AUTH_CHOICE}}

> **What this is:** Authentication is how users log in and prove they are who they say they are. It is chosen for security and ease of use.

- **What we chose:** {{AUTH_CHOICE}}
- **What this means for you:** {{AUTH_BUSINESS_MEANING}}
- **Why this over alternatives:** {{AUTH_ALT_DETAIL}}
- **Risk level:** {{AUTH_RISK_LEVEL}}

---

## Cost Implications

> What these technology choices mean for ongoing costs.

| Cost Category            | Estimated Monthly Cost         | What Drives This Cost                    | How It Scales                  |
|--------------------------|--------------------------------|------------------------------------------|--------------------------------|
| Hosting                  | {{HOSTING_MONTHLY_COST}}       | {{HOSTING_COST_DRIVER}}                  | {{HOSTING_SCALE_NOTE}}         |
| Database                 | {{DB_MONTHLY_COST}}            | {{DB_COST_DRIVER}}                       | {{DB_SCALE_NOTE}}              |
| Third-party services     | {{THIRDPARTY_MONTHLY_COST}}    | {{THIRDPARTY_COST_DRIVER}}               | {{THIRDPARTY_SCALE_NOTE}}      |
| Maintenance / DevOps     | {{DEVOPS_MONTHLY_COST}}        | {{DEVOPS_COST_DRIVER}}                   | {{DEVOPS_SCALE_NOTE}}          |
| **Total estimated**      | **{{TOTAL_MONTHLY_COST}}**     | —                                        | —                              |

> **Plain-English summary:** {{COST_PLAIN_ENGLISH_SUMMARY}}

---

## Risk Factors

> Known challenges with these technology choices and how we plan to handle them.

| # | Risk                               | Likelihood   | Impact       | What We Are Doing About It                   |
|---|------------------------------------|--------------|--------------|----------------------------------------------|
| 1 | {{TECH_RISK_1}}                    | {{RISK_1_L}} | {{RISK_1_I}} | {{RISK_1_MITIGATION}}                        |
| 2 | {{TECH_RISK_2}}                    | {{RISK_2_L}} | {{RISK_2_I}} | {{RISK_2_MITIGATION}}                        |
| 3 | {{TECH_RISK_3}}                    | {{RISK_3_L}} | {{RISK_3_I}} | {{RISK_3_MITIGATION}}                        |
| 4 | {{TECH_RISK_4}}                    | {{RISK_4_L}} | {{RISK_4_I}} | {{RISK_4_MITIGATION}}                        |

**Likelihood:** Low / Medium / High | **Impact:** Low / Medium / High

---

> **Questions about technology decisions?** Contact {{TECH_LEAD_NAME}} at {{TECH_LEAD_CONTACT}}.
> **Document owner:** {{PROJECT_LEAD_NAME}} | **Last updated:** {{DATE}}
