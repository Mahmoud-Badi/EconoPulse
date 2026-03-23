# Feature Inventory

> Every feature the product needs, prioritized, estimated, and assigned to a development phase.
> This document is the single source of truth for "what are we building and in what order?"

---

## How to Use This Template

### Step 1: Brain Dump
List every feature anyone has mentioned — don't filter yet. Even bad ideas go on the list. You'll prioritize in Step 2.

### Step 2: MoSCoW Classification
Classify each feature using MoSCoW priority:

| Priority | Label | Definition | Decision Criteria |
|----------|-------|-----------|-------------------|
| **P0** | Must Have | Launch blocker. The product literally cannot function without this. | "If we don't have this, we don't have a product." |
| **P1** | Should Have | Important and expected. Users will notice if it's missing, but can work around it. | "Users can survive without it for the first month, but they'll complain." |
| **P2** | Could Have | Nice-to-have. Improves experience but doesn't block core workflows. | "Users won't miss it if they never had it, but they'll love it if it appears." |
| **P3** | Won't Have (this version) | Explicitly deferred to a future version. Documented so it's not forgotten. | "Good idea, but not now. Parked for V2." |

### Step 3: Effort Estimation
Estimate each feature using t-shirt sizes:

| Size | Definition | Typical Duration (solo dev) | Includes |
|------|-----------|---------------------------|----------|
| **S** | Small | 0.5-1 day | Single component, simple CRUD, minor UI change |
| **M** | Medium | 2-3 days | Full page with form/table, API endpoint + validation, moderate logic |
| **L** | Large | 4-7 days | Multi-page workflow, complex state management, integration work |
| **XL** | Extra Large | 1-2 weeks | Major subsystem (auth, billing, real-time), architectural work |

### Step 4: Phase Assignment
Assign each feature to a development phase. Phases are worked sequentially. Features within a phase can be worked in any order.

### Step 5: Dependency Mapping
Identify features that block other features. A feature with dependencies cannot be started until its dependencies are complete.

---

## Feature Categories

Organize features into logical categories. Common categories include:

- **Auth & Users** — Sign up, login, roles, permissions, profile management
- **Core Workflow** — The primary use case (the "core loop" from the project brief)
- **Data Management** — CRUD for all major entities
- **Search & Filtering** — Find and filter data across the app
- **Dashboard & Analytics** — KPIs, charts, reports
- **Communication** — Notifications, email, SMS, in-app messaging
- **Billing & Payments** — Invoicing, payment processing, subscriptions
- **Settings & Config** — App configuration, user preferences, system settings
- **Admin & Ops** — User management, audit logs, system health
- **Integrations** — Third-party service connections
- **Mobile & Responsive** — Mobile-specific features and optimizations
- **Performance & Scale** — Caching, optimization, monitoring

---

## Feature Inventory Table

### Auth & Users

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 1 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 2 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 3 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 4 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 5 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Core Workflow

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 6 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 7 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 8 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 9 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 10 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Data Management

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 11 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 12 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 13 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 14 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 15 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Search & Filtering

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 16 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 17 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 18 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Dashboard & Analytics

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 19 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 20 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 21 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 22 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Communication

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 23 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 24 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 25 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Billing & Payments

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 26 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 27 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 28 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Settings & Config

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 29 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 30 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 31 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 32 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Admin & Ops

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 33 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 34 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 35 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Integrations

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 36 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 37 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 38 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Mobile & Responsive

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 39 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 40 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Performance & Scale

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 41 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 42 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 43 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

### Additional Features

| # | Feature Name | Priority | Role(s) | Phase | Effort | Dependencies | Status | Notes |
|---|-------------|----------|---------|-------|--------|-------------|--------|-------|
| 44 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 45 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 46 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 47 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 48 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 49 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |
| 50 | {{FEATURE_NAME}} | {P0-P3} | {{ROLES}} | {{PHASE}} | {S/M/L/XL} | {{DEPS}} | {Not Started/In Progress/Done} | {{NOTES}} |

*(Add more rows as needed. 50+ features is normal for a full product.)*

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total features** | {{COUNT}} |
| **P0 (Must Have)** | {{COUNT}} |
| **P1 (Should Have)** | {{COUNT}} |
| **P2 (Could Have)** | {{COUNT}} |
| **P3 (Won't Have V1)** | {{COUNT}} |

| Metric | Effort |
|--------|--------|
| **Total effort (S=0.5, M=2, L=5, XL=10 days)** | {{TOTAL}} dev-days |
| **P0 effort** | {{TOTAL}} dev-days |
| **P1 effort** | {{TOTAL}} dev-days |
| **MVP effort (P0 + critical P1)** | {{TOTAL}} dev-days |

---

## Feasibility Check

```
Available developers:         {N}
Features per dev per week:    ~2-3 (including tests)
Weeks to MVP:                 {N}
Max features achievable:      {DEVS} x {VELOCITY} x {WEEKS} = {MAX}

P0 features requested:        {COUNT}
P0 effort:                    {DAYS} dev-days = {WEEKS} dev-weeks

Verdict:                       {FEASIBLE / TIGHT / NEEDS_SCOPE_CUT}
```

**If NEEDS_SCOPE_CUT**, recommend moving these features from P0 to P1:
1. {{FEATURE_NAME}} — Reason: {{WHY_IT_CAN_WAIT}}
2. {{FEATURE_NAME}} — Reason: {{WHY_IT_CAN_WAIT}}
3. {{FEATURE_NAME}} — Reason: {{WHY_IT_CAN_WAIT}}

---

## Dependency Graph

List features that block other features. This determines build order within phases.

```
{FEATURE_A} ──► {FEATURE_B} ──► {FEATURE_C}
                                      │
{FEATURE_D} ──► {FEATURE_E} ─────────┘
                     │
                     └──► {FEATURE_F}
```

**Critical path (longest dependency chain):**
{{FEATURE_X}} → {{FEATURE_Y}} → {{FEATURE_Z}} → {{FEATURE_W}}
Total: {N} features, estimated {M} days

---

## Phase Assignment Summary

| Phase | Name | Features | P0 Count | Effort | Target Completion |
|-------|------|----------|----------|--------|------------------|
| 0 | Foundation (auth, DB, deploy) | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 1 | Core Workflow | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 2 | Data Management | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 3 | Dashboard & Reports | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 4 | Communication | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 5 | Billing & Payments | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 6 | Integrations | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |
| 7 | Polish & Hardening | #{{NUMBERS}} | {{COUNT}} | {{DAYS}}d | {{DATE}} |

---

## Deferred Features (P3 — V2 Backlog)

Features explicitly decided NOT to build in V1. Kept here so they're not forgotten.

| # | Feature Name | Why Deferred | When to Reconsider |
|---|-------------|-------------|-------------------|
| {N} | {{FEATURE_NAME}} | {{REASON}} | {{TRIGGER_TO_REVISIT}} |
| {N} | {{FEATURE_NAME}} | {{REASON}} | {{TRIGGER_TO_REVISIT}} |
| {N} | {{FEATURE_NAME}} | {{REASON}} | {{TRIGGER_TO_REVISIT}} |

---

## Change Log

| Date | Change | Reason | Approved By |
|------|--------|--------|-------------|
| {{DATE}} | Initial feature list created | Phase 0 Discovery | {{NAME}} |
| {{DATE}} | {{CHANGE_DESCRIPTION}} | {{REASON}} | {{NAME}} |
