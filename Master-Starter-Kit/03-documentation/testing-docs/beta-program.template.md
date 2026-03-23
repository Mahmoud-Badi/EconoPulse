# Beta Program

> Structured beta program for **{{PROJECT_NAME}}** — from internal dogfooding through public beta. Each phase has clear entry criteria, feedback loops, and exit criteria so you never ship prematurely or drag the beta on indefinitely.

---

## Program Overview

| Phase | Participants | Duration | Support Level |
|-------|-------------|----------|---------------|
| Internal | {{INTERNAL_TEAM_SIZE}} team members | 2 weeks | Self-serve (team fixes own issues) |
| Alpha | {{ALPHA_CUSTOMER_COUNT}} friendly customers | {{ALPHA_DURATION}} weeks | High-touch (dedicated support contact) |
| Beta | {{BETA_CUSTOMER_COUNT}} customers | {{BETA_DURATION}} weeks | Structured (feedback channels + SLA) |

---

## Phase 1: Internal (Dogfooding)

**Goal:** Find the embarrassing bugs before anyone outside the team sees them.

### Entry Criteria

- [ ] All Phase {{INTERNAL_PREREQUISITE_PHASE}} features are complete and passing tests
- [ ] Application deploys to staging without errors
- [ ] Seed data is loaded and representative
- [ ] Monitoring and error tracking are active ({{MONITORING_TOOL}})
- [ ] Core workflows pass E2E tests: {{E2E_PASS_THRESHOLD}}% green

### Participants

| Name | Role | Focus Area |
|------|------|------------|
| {{INTERNAL_TESTER_1}} | {{INTERNAL_ROLE_1}} | {{INTERNAL_FOCUS_1}} |
| {{INTERNAL_TESTER_2}} | {{INTERNAL_ROLE_2}} | {{INTERNAL_FOCUS_2}} |
| {{INTERNAL_TESTER_3}} | {{INTERNAL_ROLE_3}} | {{INTERNAL_FOCUS_3}} |

### Feedback Collection

- **Channel:** {{INTERNAL_FEEDBACK_CHANNEL}} (e.g., dedicated Slack channel, shared doc)
- **Method:** Daily 15-min standup focused on issues found
- **Bug reporting:** File directly in {{BUG_TRACKER}} with label `internal-beta`
- **Minimum requirement:** Each participant completes all {{INTERNAL_SCENARIO_COUNT}} core workflows at least once

### Exit Criteria (Go/No-Go)

- [ ] 0 critical bugs open (any open = no-go)
- [ ] < {{INTERNAL_BUG_THRESHOLD}} major bugs open
- [ ] All core workflows completable without workarounds
- [ ] Error rate in {{MONITORING_TOOL}} < {{ERROR_RATE_THRESHOLD}}%
- [ ] Team consensus: "ready for external eyes"

---

## Phase 2: Alpha (Friendly Customers)

**Goal:** Validate the product with real users who will give honest, constructive feedback and tolerate rough edges.

### Entry Criteria

- [ ] Internal phase exit criteria met
- [ ] Alpha agreement signed by all participants
- [ ] Dedicated support contact assigned: {{ALPHA_SUPPORT_CONTACT}}
- [ ] Onboarding flow tested and documented
- [ ] Data backup and restore procedure verified

### Participant Selection

| Customer | Industry | Size | Why Selected | Contact |
|----------|----------|------|-------------|---------|
| {{ALPHA_CUSTOMER_1}} | {{ALPHA_INDUSTRY_1}} | {{ALPHA_SIZE_1}} | {{ALPHA_REASON_1}} | {{ALPHA_CONTACT_1}} |
| {{ALPHA_CUSTOMER_2}} | {{ALPHA_INDUSTRY_2}} | {{ALPHA_SIZE_2}} | {{ALPHA_REASON_2}} | {{ALPHA_CONTACT_2}} |
| {{ALPHA_CUSTOMER_3}} | {{ALPHA_INDUSTRY_3}} | {{ALPHA_SIZE_3}} | {{ALPHA_REASON_3}} | {{ALPHA_CONTACT_3}} |

### Feedback Collection

- **Channel:** {{ALPHA_FEEDBACK_CHANNEL}} (e.g., shared Slack channel, weekly call)
- **Cadence:** Weekly 30-min check-in call with each customer
- **Method:** Structured feedback form (see Feedback Survey below) + open conversation
- **Bug reporting:** Alpha customers report via {{ALPHA_BUG_CHANNEL}}; team triages within {{ALPHA_TRIAGE_SLA}} hours

### Exit Criteria (Go/No-Go)

- [ ] All customers onboarded in < {{ONBOARDING_SLA}} days
- [ ] Each customer used product for >= {{ALPHA_MIN_USAGE_WEEKS}} weeks
- [ ] NPS >= {{ALPHA_NPS_TARGET}} (no-go if below)
- [ ] 0 critical bugs open, no data loss incidents
- [ ] Feature requests documented and prioritized

---

## Phase 3: Beta (Structured Feedback)

**Goal:** Validate at scale with diverse customers, stress-test infrastructure, and build the feedback pipeline for post-launch.

### Entry Criteria

- [ ] Alpha phase exit criteria met
- [ ] Beta agreement signed by all participants
- [ ] Support documentation complete (FAQ, troubleshooting guides)
- [ ] Self-serve onboarding flow working
- [ ] Capacity planning reviewed for {{BETA_CUSTOMER_COUNT}} concurrent customers
- [ ] Feature flag infrastructure ready for controlled rollouts

### Participant Selection

| Cohort | Count | Profile | Onboarding |
|--------|-------|---------|-----------|
| Alpha graduates | {{ALPHA_CUSTOMER_COUNT}} | Continuing from alpha | Already onboarded |
| New beta customers | {{NEW_BETA_COUNT}} | {{BETA_PROFILE}} | Self-serve with support |
| Edge case customers | {{EDGE_CASE_COUNT}} | {{EDGE_CASE_PROFILE}} | Guided onboarding |

### Feedback Collection

- **Channel:** {{BETA_FEEDBACK_CHANNEL}}
- **Cadence:** Bi-weekly feedback survey + monthly group call
- **Bug reporting:** In-app feedback widget + {{BETA_BUG_CHANNEL}}
- **Triage SLA:** Critical within {{BETA_CRITICAL_SLA}} hours, Major within {{BETA_MAJOR_SLA}} hours

### Exit Criteria

- [ ] All beta customers have used the product for at least {{BETA_MIN_USAGE_WEEKS}} weeks
- [ ] NPS >= {{BETA_NPS_TARGET}}
- [ ] System uptime during beta: >= {{BETA_UPTIME_TARGET}}%
- [ ] P95 response time: < {{BETA_LATENCY_TARGET}}ms
- [ ] No data loss or security incidents
- [ ] Billing and payment flow validated (if applicable)
- [ ] Support documentation covers {{BETA_DOC_COVERAGE}}% of reported issues

---

## Beta Agreement Template

> Customize and send to each beta participant before granting access.

```
BETA PROGRAM AGREEMENT — {{PROJECT_NAME}}

Participant: {{BETA_PARTICIPANT_NAME}}
Organization: {{BETA_PARTICIPANT_ORG}}
Start Date: {{BETA_START_DATE}}
Expected Duration: {{BETA_DURATION}} weeks

Terms:
1. {{PROJECT_NAME}} is in beta and may contain bugs or incomplete features.
2. Data entered during beta will be preserved into production (unless otherwise noted).
3. Participant agrees to provide feedback via {{BETA_FEEDBACK_CHANNEL}}.
4. Participant will report bugs promptly via {{BETA_BUG_CHANNEL}}.
5. {{PROJECT_NAME}} team will respond to critical issues within {{BETA_CRITICAL_SLA}} hours.
6. Beta pricing: {{BETA_PRICING}} (e.g., free, discounted, standard).
7. Confidentiality: participant will not share screenshots or details publicly.

Signed: _______________  Date: _______________
```

---

## Feedback Survey Template

Send at the end of each feedback cycle:

1. How often did you use {{PROJECT_NAME}} this period? (Daily / Weekly / Rarely)
2. What task did you use it for most? (Open text)
3. What was the most frustrating part? (Open text)
4. What worked well? (Open text)
5. Did you encounter any bugs? (Yes/No + description)
6. How likely are you to recommend {{PROJECT_NAME}} to a colleague? (0-10 NPS)
7. What feature would you most like to see added? (Open text)
8. Would you pay for {{PROJECT_NAME}} at {{TARGET_PRICE}}? (Yes / No / Maybe + conditions)

---

## Bug Reporting Workflow

**Flow:** User reports ({{BETA_BUG_CHANNEL}}) → {{TRIAGE_OWNER}} triages ({{BETA_TRIAGE_SLA}} hr SLA, {{BUG_TRACKER}}) → Developer fixes → Deploy ({{CI_CD_TOOL}}) → Notify user ({{BETA_FEEDBACK_CHANNEL}}) → User verifies (48 hr)

## Feature Request Tracking

| Request ID | Description | Requested By | Count | Priority | Status |
|-----------|-------------|-------------|-------|----------|--------|
| FR-001 | {{FEATURE_REQUEST_1}} | {{FR_REQUESTER_1}} | {{FR_COUNT_1}} | {{FR_PRIORITY_1}} | {{FR_STATUS_1}} |

**Rule:** Features requested by 3+ beta users are automatically promoted to P2 priority.

---

## Beta-to-Paid Conversion Plan

| Stage | Action | Timeline |
|-------|--------|----------|
| 2 weeks before beta end | Email: "Beta ending soon — here is your transition plan" | Week {{BETA_DURATION - 2}} |
| 1 week before beta end | Email: "Choose your plan" with pricing options | Week {{BETA_DURATION - 1}} |
| Beta end date | Convert willing users to paid; extend {{EXTENSION_WEEKS}} weeks for undecided | Week {{BETA_DURATION}} |
| 2 weeks after beta end | Final follow-up for unconverted users | Week {{BETA_DURATION + 2}} |

### Conversion Incentives

| Incentive | Details |
|-----------|---------|
| Early adopter discount | {{EARLY_ADOPTER_DISCOUNT}}% off for {{DISCOUNT_DURATION}} |
| Grandfathered pricing | Lock in beta pricing for {{GRANDFATHER_DURATION}} |
| Feature input | Beta users get priority input on the next {{FEATURE_INPUT_COUNT}} features |
| Case study | Featured on website in exchange for extended trial |
