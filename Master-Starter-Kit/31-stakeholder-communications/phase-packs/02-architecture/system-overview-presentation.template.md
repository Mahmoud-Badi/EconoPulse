# {{PROJECT_NAME}} — System Overview Presentation

> **Audience:** Non-technical stakeholders | **Date:** {{DATE}} | **Version:** {{VERSION}}
> **Purpose:** Explain what the system does, how it works, and why it is built this way — in plain English.

---

## Status

| Area               | Status              | Notes                          |
|--------------------|---------------------|--------------------------------|
| Architecture       | [GREEN] On track    | {{ARCH_STATUS_NOTES}}          |
| Security           | [GREEN] On track    | {{SECURITY_STATUS_NOTES}}      |
| Integrations       | [GREEN] On track    | {{INTEGRATION_STATUS_NOTES}}   |

**Status legend:** [GREEN] On track | [YELLOW] At risk | [RED] Blocked

---

## 1. System at a Glance

{{SYSTEM_OVERVIEW_PARAGRAPH}}

> **In one sentence:** {{PROJECT_NAME}} is a {{SYSTEM_TYPE}} that allows {{PRIMARY_USERS}} to {{PRIMARY_ACTION}}, so they can {{PRIMARY_OUTCOME}}.

---

## 2. How It Works — Step by Step

> This is what a user experiences from start to finish, in plain English.

| Step | What the User Does                         | What the System Does Behind the Scenes     |
|------|--------------------------------------------|--------------------------------------------|
| 1    | {{USER_STEP_1}}                            | {{SYSTEM_STEP_1}}                          |
| 2    | {{USER_STEP_2}}                            | {{SYSTEM_STEP_2}}                          |
| 3    | {{USER_STEP_3}}                            | {{SYSTEM_STEP_3}}                          |
| 4    | {{USER_STEP_4}}                            | {{SYSTEM_STEP_4}}                          |
| 5    | {{USER_STEP_5}}                            | {{SYSTEM_STEP_5}}                          |
| 6    | {{USER_STEP_6}}                            | {{SYSTEM_STEP_6}}                          |

**The complete user journey:**

> {{USER_STEP_1}} → {{USER_STEP_2}} → {{USER_STEP_3}} → {{USER_STEP_4}} → {{USER_STEP_5}} → {{USER_STEP_6}}

---

## 3. Major System Components

> Each component is a building block of the system. Here is what each one does and why it matters to you.

| Component                  | What It Does (Plain English)               | Why It Matters to Stakeholders             |
|----------------------------|--------------------------------------------|--------------------------------------------|
| {{COMPONENT_1_NAME}}       | {{COMPONENT_1_PLAIN_ENGLISH}}              | {{COMPONENT_1_BUSINESS_VALUE}}             |
| {{COMPONENT_2_NAME}}       | {{COMPONENT_2_PLAIN_ENGLISH}}              | {{COMPONENT_2_BUSINESS_VALUE}}             |
| {{COMPONENT_3_NAME}}       | {{COMPONENT_3_PLAIN_ENGLISH}}              | {{COMPONENT_3_BUSINESS_VALUE}}             |
| {{COMPONENT_4_NAME}}       | {{COMPONENT_4_PLAIN_ENGLISH}}              | {{COMPONENT_4_BUSINESS_VALUE}}             |
| {{COMPONENT_5_NAME}}       | {{COMPONENT_5_PLAIN_ENGLISH}}              | {{COMPONENT_5_BUSINESS_VALUE}}             |
| {{COMPONENT_6_NAME}}       | {{COMPONENT_6_PLAIN_ENGLISH}}              | {{COMPONENT_6_BUSINESS_VALUE}}             |

**Technical-to-business translation key:**

| Technical Term             | What It Actually Means                     |
|----------------------------|--------------------------------------------|
| Frontend                   | The screens and buttons users see and click |
| Backend / API              | The engine behind the scenes that processes requests |
| Database                   | Where all the information is stored safely  |
| Authentication             | How the system verifies who you are         |
| Hosting / Infrastructure   | The computers that run the app 24/7         |

---

## 4. Data & Security Overview

> What data is stored, how it is protected, and who can access it.

### What Data Is Stored

| Data Type                  | Examples                                   | Sensitivity Level              |
|----------------------------|--------------------------------------------|--------------------------------|
| {{DATA_TYPE_1}}            | {{DATA_EXAMPLES_1}}                        | {{DATA_SENSITIVITY_1}}         |
| {{DATA_TYPE_2}}            | {{DATA_EXAMPLES_2}}                        | {{DATA_SENSITIVITY_2}}         |
| {{DATA_TYPE_3}}            | {{DATA_EXAMPLES_3}}                        | {{DATA_SENSITIVITY_3}}         |

### How Data Is Protected

| Protection Measure         | What It Means (Plain English)              |
|----------------------------|--------------------------------------------|
| Encryption at rest         | Data is scrambled when stored — unreadable without the key |
| Encryption in transit      | Data is scrambled while traveling between your device and our servers |
| Access controls            | Only authorized people can see or change specific data |
| Backups                    | Copies of data are saved regularly so nothing is permanently lost |
| {{ADDITIONAL_SECURITY}}    | {{ADDITIONAL_SECURITY_PLAIN_ENGLISH}}      |

### Who Can Access What

| User Role                  | What They Can See                          | What They Can Change           |
|----------------------------|--------------------------------------------|--------------------------------|
| {{ROLE_1}}                 | {{ROLE_1_CAN_SEE}}                         | {{ROLE_1_CAN_CHANGE}}          |
| {{ROLE_2}}                 | {{ROLE_2_CAN_SEE}}                         | {{ROLE_2_CAN_CHANGE}}          |
| {{ROLE_3}}                 | {{ROLE_3_CAN_SEE}}                         | {{ROLE_3_CAN_CHANGE}}          |

---

## 5. Integration Points

> These are external systems that {{PROJECT_NAME}} connects to.

| External System            | Purpose (Plain English)                    | Status              | Impact if Unavailable          |
|----------------------------|--------------------------------------------|---------------------|--------------------------------|
| {{INTEGRATION_1_NAME}}     | {{INTEGRATION_1_PURPOSE}}                  | [GREEN] On track    | {{INTEGRATION_1_IMPACT}}       |
| {{INTEGRATION_2_NAME}}     | {{INTEGRATION_2_PURPOSE}}                  | [GREEN] On track    | {{INTEGRATION_2_IMPACT}}       |
| {{INTEGRATION_3_NAME}}     | {{INTEGRATION_3_PURPOSE}}                  | [YELLOW] At risk    | {{INTEGRATION_3_IMPACT}}       |
| {{INTEGRATION_4_NAME}}     | {{INTEGRATION_4_PURPOSE}}                  | [GREEN] On track    | {{INTEGRATION_4_IMPACT}}       |

---

## 6. System Diagram

> See `dev_docs/comms/diagrams/architecture-flowchart.md` for the visual system diagram.

**Simplified text view:**

```
{{USER_LABEL}} → [ {{COMPONENT_1_NAME}} ] → [ {{COMPONENT_2_NAME}} ] → [ {{COMPONENT_3_NAME}} ]
                                                     ↕
                                          [ {{COMPONENT_4_NAME}} ]
                                                     ↕
                                    [ {{INTEGRATION_1_NAME}} ]  [ {{INTEGRATION_2_NAME}} ]
```

---

> **Questions about the system?** Contact {{TECH_LEAD_NAME}} at {{TECH_LEAD_CONTACT}}.
> **Document owner:** {{PROJECT_LEAD_NAME}} | **Last updated:** {{DATE}}
