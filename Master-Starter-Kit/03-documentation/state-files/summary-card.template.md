# Project Summary Card — {{PROJECT_NAME}}

> One-page snapshot of your fully planned project. Generated at the end of Step 16 (Handoff).

---

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | {{PROJECT_NAME}} |
| **Description** | {{PROJECT_DESCRIPTION}} |
| **Industry** | {{INDUSTRY}} |
| **Target Market** | {{TARGET_MARKET}} |
| **Team Size** | {{TEAM_SIZE}} developer(s) |
| **Timeline** | {{TIMELINE_WEEKS}} weeks |
| **MVP Target Date** | {{MVP_TARGET_DATE}} |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Frontend** | {{FRONTEND_FRAMEWORK}} |
| **Backend** | {{BACKEND_FRAMEWORK}} |
| **Database** | {{DATABASE}} |
| **ORM** | {{ORM}} |
| **Package Manager** | {{PKG_MANAGER}} |
| **Monorepo** | {{MONOREPO}} ({{MONOREPO_TOOL}}) |
| **Auth** | {{AUTH_METHOD}} |
<!-- IF HAS_MOBILE -->
| **Mobile** | {{MOBILE_FRAMEWORK}} |
<!-- ENDIF -->

---

## What Was Built (Document Counts)

| Category | Count | Location |
|----------|-------|----------|
| **Service specs** | {{SERVICE_COUNT}} | `dev_docs/service-hub-*.md` |
| **Screen specs** | {{SCREEN_COUNT}} | `dev_docs/screen-spec-*.md` |
| **Task files** | {{TASK_COUNT}} across {{PHASE_COUNT}} phases | `dev_docs/task-*.md` |
| **API contracts** | {{CONTRACT_COUNT}} | `dev_docs/API-CONTRACT-REGISTRY.md` |
| **Research files** | {{TRIBUNAL_FILE_COUNT}} | `dev_docs/tribunal/` |
| **Design tokens** | 1 | `dev_docs/DESIGN-TOKENS.md` |
| **Architecture doc** | 1 | `dev_docs/system-architecture.md` |
| **Database schema** | 1 | `dev_docs/database-schema.md` |
<!-- IF HAS_USER_DOCS -->
| **User doc guides** | {{USER_DOC_COUNT}} | `dev_docs/user-docs/` |
<!-- ENDIF -->

---

## Architecture Overview

### Services

<!-- Repeat for each service in MVP_SERVICES -->
- **{{SERVICE_NAME}}** — {{SERVICE_DESCRIPTION}}
<!-- End repeat -->

### Key Integrations

<!-- List any third-party integrations identified during planning -->
- {{INTEGRATION_NAME}} — {{INTEGRATION_PURPOSE}}

---

## Phase Breakdown

| Phase | Name | Tasks | Estimated Effort |
|-------|------|-------|-----------------|
| Phase 0 | Foundation | {{PHASE_0_TASK_COUNT}} tasks | {{PHASE_0_EFFORT}} |
| Phase 1 | {{PHASE_1_NAME}} | {{PHASE_1_TASK_COUNT}} tasks | {{PHASE_1_EFFORT}} |
<!-- IF PHASE_2 -->
| Phase 2 | {{PHASE_2_NAME}} | {{PHASE_2_TASK_COUNT}} tasks | {{PHASE_2_EFFORT}} |
<!-- ENDIF -->
<!-- IF PHASE_3 -->
| Phase 3 | {{PHASE_3_NAME}} | {{PHASE_3_TASK_COUNT}} tasks | {{PHASE_3_EFFORT}} |
<!-- ENDIF -->

---

## Quality Gates Configured

- [ ] Component gate (TypeScript, ESLint, a11y)
- [ ] Page gate (all states, responsive, forms)
- [ ] Module gate (CRUD flow, navigation, consistency)
- [ ] Cross-module gate (visual consistency, performance)

---

## Design System

| Token | Value |
|-------|-------|
| **Primary color** | {{PRIMARY_COLOR}} |
| **Font family** | {{FONT_FAMILY}} |
| **Border radius** | {{BORDER_RADIUS}} |
| **Spacing scale** | {{SPACING_SCALE}} |

---

## What to Do Next

1. Open `dev_docs/STATUS.md` — find your first task
2. Run `/kickoff` to start your first coding session
3. Pick task #1 from Phase 0 and start building
4. After completing each task, update STATUS.md
5. After each feature, run `/document-feature`
6. Before phase transitions, run `/doc-quality-gate`

**Start here:** `dev_docs/STATUS.md`
