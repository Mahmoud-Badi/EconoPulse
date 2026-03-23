# Sandbox Configuration for {{PROJECT_NAME}}

> **Define the seed data, mock APIs, demo user persona, and environment setup for your interactive demo.**
> This document ensures the demo feels real without connecting to production systems.

---

## Table of Contents

1. [Approach Decision](#approach-decision)
2. [Seed Data Definitions](#seed-data-definitions)
3. [Mock API Responses](#mock-api-responses)
4. [Demo User Persona](#demo-user-persona)
5. [State Management](#state-management)
6. [Reset & Replay Behavior](#reset--replay-behavior)
7. [Environment Setup](#environment-setup)
8. [Data Privacy Considerations](#data-privacy-considerations)
9. [Checklist](#checklist)

---

## Approach Decision

### Approach Options

| Approach | Description | Best For |
|----------|-----------|---------|
| **Simulated** | Purpose-built HTML/CSS/JS that looks like the product | Early-stage, complex apps, sensitive data |
| **Cloned Frontend** | Actual frontend code against mock API | Simple frontends, dev tools, "real feel" priority |
| **Hybrid** | Some screens simulated, some cloned | Mixed complexity, phased approach |

### Decision Matrix

| Criterion | Weight | Simulated | Cloned Frontend | Hybrid |
|-----------|--------|-----------|----------------|--------|
| Build speed | {{WEIGHT}} | {{SCORE, 1-5}} | {{SCORE}} | {{SCORE}} |
| Fidelity to real product | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| Maintenance burden | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| Works without backend | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| Handles product updates | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| Security / data isolation | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| Mobile support | {{WEIGHT}} | {{SCORE}} | {{SCORE}} | {{SCORE}} |
| **Weighted Total** | | **{{TOTAL}}** | **{{TOTAL}}** | **{{TOTAL}}** |

### Selected Approach

**Chosen approach:** {{SELECTED_APPROACH}}

**Rationale:** {{RATIONALE, e.g., "Simulated approach selected because the product has complex backend dependencies and we need the demo to work offline for trade shows."}}

---

## Seed Data Definitions

### Users

| Field | Value | Notes |
|-------|-------|-------|
| **Demo User Name** | {{NAME, e.g., "Alex Rivera"}} | Relatable, gender-neutral |
| **Email** | {{EMAIL, e.g., "alex@demo-company.com"}} | Clearly fake |
| **Avatar** | {{AVATAR, e.g., "Illustrated avatar, no real photo"}} | Avoid stock photos |
| **Role** | {{ROLE, e.g., "Project Manager"}} | Matches target persona |
| **Company** | {{COMPANY, e.g., "Horizon Labs"}} | Fictional company |
| **Plan/Tier** | {{PLAN, e.g., "Pro Plan"}} | Show the tier you want to sell |

### Additional Demo Users (for collaboration features)

<!-- IF {{COLLABORATION_FEATURES}} -->

| Name | Role | Avatar | Relationship to Demo User | Purpose in Demo |
|------|------|--------|--------------------------|----------------|
| {{USER_2_NAME}} | {{ROLE}} | {{AVATAR}} | {{RELATIONSHIP, e.g., "Team member"}} | {{PURPOSE, e.g., "Shows collaboration features"}} |
| {{USER_3_NAME}} | {{ROLE}} | {{AVATAR}} | {{RELATIONSHIP}} | {{PURPOSE}} |
| {{USER_4_NAME}} | {{ROLE}} | {{AVATAR}} | {{RELATIONSHIP}} | {{PURPOSE}} |

<!-- ENDIF -->

### Primary Entities

<!-- List every data entity that appears in the demo. Use realistic but obviously fake data. -->

#### {{ENTITY_1, e.g., "Projects"}}

| # | {{FIELD_1, e.g., "Name"}} | {{FIELD_2, e.g., "Status"}} | {{FIELD_3, e.g., "Created"}} | {{FIELD_4, e.g., "Members"}} | {{FIELD_5, e.g., "Progress"}} |
|---|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|
| 1 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 2 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 3 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 4 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 5 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |

#### {{ENTITY_2, e.g., "Tasks"}}

| # | {{FIELD_1}} | {{FIELD_2}} | {{FIELD_3}} | {{FIELD_4}} | {{FIELD_5}} |
|---|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|
| 1 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 2 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 3 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 4 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 5 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |

#### {{ENTITY_3, e.g., "Analytics Data"}}

| # | {{FIELD_1}} | {{FIELD_2}} | {{FIELD_3}} | {{FIELD_4}} | {{FIELD_5}} |
|---|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|{{VALUE}}|
| 1 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 2 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |
| 3 | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} | {{VALUE}} |

### Seed Data Guidelines

- [ ] All names are fictional — no real people or companies
- [ ] Data looks realistic (correct formats, plausible values)
- [ ] Numbers tell a positive story (growth trends, high completion rates)
- [ ] Dates are relative to demo viewing date or use evergreen ranges
- [ ] No offensive, controversial, or culturally insensitive content
- [ ] Data volume is enough to look populated but not overwhelming
- [ ] Entity relationships are consistent (a task's project must exist)

---

## Mock API Responses

### API Endpoint Registry

<!-- For cloned-frontend approach: every API call the frontend makes must be intercepted. -->
<!-- For simulated approach: document what data each screen renders. -->

| # | Endpoint | Method | Request Params | Response Summary | Latency (ms) | Used in Step |
|---|----------|--------|---------------|-----------------|-------------|-------------|
| 1 | {{ENDPOINT, e.g., "/api/projects"}} | {{METHOD, e.g., "GET"}} | {{PARAMS, e.g., "?limit=10"}} | {{SUMMARY, e.g., "Returns 5 projects from seed data"}} | {{LATENCY, e.g., 200}} | {{STEPS}} |
| 2 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 3 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 4 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 5 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 6 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 7 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |
| 8 | {{ENDPOINT}} | {{METHOD}} | {{PARAMS}} | {{SUMMARY}} | {{LATENCY}} | {{STEPS}} |

### Mock Response Details

#### {{ENDPOINT_1}}

```json
{{RESPONSE_JSON, e.g.:
{
  "data": [
    {
      "id": "proj_001",
      "name": "Q1 Marketing Campaign",
      "status": "active",
      "progress": 72,
      "members": 4,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1
  }
}
}}
```

#### {{ENDPOINT_2}}

```json
{{RESPONSE_JSON}}
```

#### {{ENDPOINT_3}}

```json
{{RESPONSE_JSON}}
```

### Mock Interception Strategy

| Strategy | Description | When to Use |
|----------|-----------|-------------|
| **Service Worker** | Intercepts fetch/XHR at the browser level | Cloned frontend, need real network tab |
| **MSW (Mock Service Worker)** | Popular library for request mocking | React/Vue apps, development familiar with MSW |
| **Static JSON files** | Pre-built JSON loaded by the demo engine | Simulated approach, simplest setup |
| **In-memory store** | JavaScript object acting as a fake database | When demo needs write operations to persist within session |

**Selected strategy:** {{SELECTED_STRATEGY}}

---

## Demo User Persona

### Active User Profile

| Property | Value |
|----------|-------|
| **Display Name** | {{DISPLAY_NAME}} |
| **Avatar Image** | {{AVATAR_PATH}} |
| **Email** | {{EMAIL}} |
| **Role Badge** | {{ROLE_BADGE, e.g., "Admin" / "Member" / "Owner"}} |
| **Permissions** | {{PERMISSIONS, e.g., "Full access — all features visible"}} |
| **Plan Badge** | {{PLAN_BADGE, e.g., "Pro Plan"}} |
| **Notification Count** | {{NOTIFICATION_COUNT, e.g., 3}} |
| **Last Login** | {{LAST_LOGIN, e.g., "Today"}} |

### What the User "Has Done" Before the Demo

<!-- The demo starts mid-story. What has the demo user already accomplished? -->

| Prior Action | Visible Evidence | Why This Matters |
|-------------|-----------------|-----------------|
| {{ACTION, e.g., "Created 5 projects"}} | {{EVIDENCE, e.g., "Project list shows 5 items"}} | {{REASON, e.g., "Shows the product in active use"}} |
| {{ACTION}} | {{EVIDENCE}} | {{REASON}} |
| {{ACTION}} | {{EVIDENCE}} | {{REASON}} |
| {{ACTION}} | {{EVIDENCE}} | {{REASON}} |

---

## State Management

### What Persists During Demo Session

| State Type | Persists? | Storage | Reset Trigger |
|-----------|-----------|---------|--------------|
| Current step / progress | {{YES/NO}} | {{STORAGE, e.g., "sessionStorage"}} | {{TRIGGER, e.g., "Browser close"}} |
| Mode selection (guided/free) | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |
| Feature exploration tracker | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |
| Form inputs (during demo) | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |
| Lead capture submission | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |
| CTA dismissals | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |
| Analytics session ID | {{YES/NO}} | {{STORAGE}} | {{TRIGGER}} |

### What Resets Between Sessions

| State | Reset Behavior | Reason |
|-------|---------------|--------|
| {{STATE, e.g., "Demo progress"}} | {{BEHAVIOR, e.g., "Clears on new session"}} | {{REASON, e.g., "Fresh start for return visitors"}} |
| {{STATE}} | {{BEHAVIOR}} | {{REASON}} |
| {{STATE}} | {{BEHAVIOR}} | {{REASON}} |

### State Mutations During Demo

<!-- If the demo allows "creating" or "editing" things, define what happens. -->

| User Action | Visible Result | Actual Implementation | Reverts On |
|------------|---------------|----------------------|-----------|
| {{ACTION, e.g., "Click 'Create Project'"}} | {{RESULT, e.g., "New project appears in list"}} | {{IMPLEMENTATION, e.g., "Add item to in-memory array"}} | {{REVERT, e.g., "Page refresh"}} |
| {{ACTION}} | {{RESULT}} | {{IMPLEMENTATION}} | {{REVERT}} |
| {{ACTION}} | {{RESULT}} | {{IMPLEMENTATION}} | {{REVERT}} |

---

## Reset & Replay Behavior

### Reset Triggers

| Trigger | Behavior | Confirmation Required? |
|---------|----------|----------------------|
| "Replay Tour" button | {{BEHAVIOR, e.g., "Return to welcome screen, clear progress"}} | {{YES/NO}} |
| Browser refresh | {{BEHAVIOR, e.g., "Resume from last step"}} | {{NO}} |
| "Start Over" link | {{BEHAVIOR, e.g., "Full reset — clear all state"}} | {{YES/NO}} |
| Session timeout ({{TIMEOUT}} min) | {{BEHAVIOR}} | {{NO}} |
| Direct URL with step param | {{BEHAVIOR, e.g., "Jump to specified step"}} | {{NO}} |

### Resume Behavior

| Scenario | Behavior |
|----------|---------|
| User closes tab and returns within {{RESUME_WINDOW}} | {{BEHAVIOR, e.g., "Show 'Welcome back! Resume where you left off?' prompt"}} |
| User returns after {{RESUME_WINDOW}} | {{BEHAVIOR, e.g., "Start fresh"}} |
| User shares URL with step parameter | {{BEHAVIOR, e.g., "Start from that step with context tooltip"}} |

---

## Environment Setup

### Environment Matrix

| Environment | URL | Purpose | Auth | Data Source | Deployment |
|------------|-----|---------|------|-----------|-----------|
| **Local Dev** | {{URL, e.g., "localhost:3000/demo"}} | Development & testing | None | Static JSON | {{METHOD, e.g., "npm run dev"}} |
| **Staging** | {{URL, e.g., "staging.{{DOMAIN}}/demo"}} | QA & review | {{AUTH, e.g., "Basic auth"}} | Static JSON | {{METHOD}} |
| **Production** | {{URL, e.g., "{{DOMAIN}}/demo"}} | Public-facing demo | None | Static JSON / CDN | {{METHOD}} |

### Build & Deploy

| Step | Command / Action | Notes |
|------|-----------------|-------|
| Install dependencies | {{COMMAND, e.g., "`npm install`"}} | {{NOTES}} |
| Build demo | {{COMMAND, e.g., "`npm run build:demo`"}} | {{NOTES}} |
| Run locally | {{COMMAND, e.g., "`npm run dev:demo`"}} | {{NOTES}} |
| Deploy to staging | {{COMMAND}} | {{NOTES}} |
| Deploy to production | {{COMMAND}} | {{NOTES}} |
| Update seed data | {{COMMAND, e.g., "Edit `data/seed.json` and rebuild"}} | {{NOTES}} |

### Infrastructure Requirements

| Requirement | Value | Notes |
|------------|-------|-------|
| Hosting | {{HOSTING, e.g., "Static hosting (Netlify, Vercel, S3+CloudFront)"}} | {{NOTES}} |
| CDN | {{CDN, e.g., "Included with hosting provider"}} | {{NOTES}} |
| SSL | {{SSL, e.g., "Required — auto-provisioned"}} | {{NOTES}} |
| Custom domain | {{DOMAIN, e.g., "demo.{{PROJECT_DOMAIN}}"}} | {{NOTES}} |
| Estimated monthly cost | {{COST}} | {{NOTES}} |

---

## Data Privacy Considerations

### Data Handling

| Concern | Approach | Compliance |
|---------|----------|-----------|
| **No real user data** | All seed data is fictional | GDPR / CCPA safe |
| **Lead capture emails** | {{APPROACH, e.g., "Stored in CRM, not in demo code"}} | {{COMPLIANCE}} |
| **Analytics tracking** | {{APPROACH, e.g., "Anonymized session IDs, no PII"}} | {{COMPLIANCE}} |
| **Cookies** | {{APPROACH, e.g., "Session cookie for progress only"}} | {{COMPLIANCE}} |
| **Third-party scripts** | {{APPROACH, e.g., "Analytics only, listed in privacy policy"}} | {{COMPLIANCE}} |

### Privacy Checklist

- [ ] No real customer data used in seed data
- [ ] No production API keys in demo code
- [ ] No production database connections
- [ ] Lead capture consent language reviewed by legal
- [ ] Cookie banner shown if required by jurisdiction
- [ ] Analytics provider DPA (Data Processing Agreement) in place
- [ ] Demo code repository does not contain secrets
- [ ] CORS headers restrict demo API to demo domain only

---

## Checklist

- [ ] Approach selected with rationale documented
- [ ] All seed data entities defined with realistic fake data
- [ ] Mock API endpoints documented with response shapes
- [ ] Demo user persona fully configured
- [ ] State management behavior defined (persist vs. reset)
- [ ] Reset and replay behavior specified
- [ ] All environments documented (local, staging, production)
- [ ] Build and deploy commands verified
- [ ] Data privacy concerns addressed
- [ ] No real user data, API keys, or secrets in demo code

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
