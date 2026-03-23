# Architecture Anchor — {{PROJECT_NAME}}

**Last Updated:** {{TIMESTAMP}}
**Current Phase:** {{CURRENT_PHASE}} | **Step:** {{CURRENT_STEP}}
**Kit Version:** {{KIT_VERSION}}

---

## System Shape

{{PROJECT_NAME}} is a {{PROJECT_TYPE}} for {{TARGET_USERS}}.

**Core value proposition:** {{ONE_SENTENCE_VALUE_PROP}}

**What makes it different:** {{DIFFERENTIATOR}}

---

## Tech Stack (ground truth)

| Layer | Technology | Version | Config Location |
|-------|-----------|---------|-----------------|
| Framework | {{FRONTEND_FRAMEWORK}} | {{FE_VERSION}} | package.json |
| Backend | {{BACKEND_FRAMEWORK}} | {{BE_VERSION}} | package.json |
| Database | {{DATABASE}} | {{DB_VERSION}} | {{DB_CONFIG_PATH}} |
| ORM | {{ORM}} | {{ORM_VERSION}} | {{ORM_CONFIG_PATH}} |
| Auth | {{AUTH_LIB}} | {{AUTH_VERSION}} | {{AUTH_CONFIG_PATH}} |
| UI | {{UI_LIB}} | {{UI_VERSION}} | components/ |
| Testing | {{TEST_FRAMEWORK}} | {{TEST_VERSION}} | {{TEST_CONFIG_PATH}} |
| Package Manager | {{PKG_MANAGER}} | — | lockfile |

---

## Services (current state)

<!-- One row per service. Update status after every service-related task. -->

| Service | Status | Key Decisions | Depends On | Hub File |
|---------|--------|---------------|------------|----------|
| {{SERVICE_1}} | {{STATUS}} | {{KEY_DECISIONS}} | {{DEPS}} | dev_docs/services/{{SERVICE_1}}-hub.md |

<!-- Status values: Not Started | Spec'd | In Progress | Built | Tested | Deployed -->

---

## Data Model (current truth)

<!-- Keep this to 10-15 lines max. Link to full schema for detail. -->

```
{{ENTITY_1}} ──┐
               ├── {{RELATIONSHIP}} ── {{ENTITY_2}}
{{ENTITY_3}} ──┘
```

**Full schema:** dev_docs/specs/database/{{SCHEMA_FILE}}

**Key constraints:**
- {{CONSTRAINT_1}}
- {{CONSTRAINT_2}}

---

## Active Constraints (do not violate)

<!-- These are non-negotiable requirements that affect every decision. -->

1. {{CONSTRAINT_1}} — Reason: {{WHY}}
2. {{CONSTRAINT_2}} — Reason: {{WHY}}
3. {{CONSTRAINT_3}} — Reason: {{WHY}}

---

## Rejected Alternatives (do not re-debate)

<!-- Decisions that were considered and explicitly rejected. Include the reason so future sessions don't re-open them. -->

| What Was Considered | What We Chose Instead | Why |
|--------------------|-----------------------|-----|
| {{REJECTED_1}} | {{CHOSEN_1}} | {{REASON_1}} |
| {{REJECTED_2}} | {{CHOSEN_2}} | {{REASON_2}} |

---

## API Contract Summary

<!-- High-level API shape. Link to full specs for detail. -->

| Router/Module | Endpoints | Auth Required | Key Pattern |
|--------------|-----------|---------------|-------------|
| {{ROUTER_1}} | {{COUNT}} | {{AUTH_LEVEL}} | {{PATTERN}} |

**API standards:** dev_docs/specs/standards/error-responses.md, pagination-spec.md

---

## Current Risks

<!-- Active risks that affect implementation decisions. Remove when resolved. -->

| Risk | Impact | Mitigation | Status |
|------|--------|-----------|--------|
| {{RISK_1}} | {{IMPACT}} | {{MITIGATION}} | {{STATUS}} |

---

## Anti-Hallucination Anchors

<!-- FACTS that Claude must not contradict after compaction. Update these whenever the fact changes. These are the first things to verify after any context loss. -->

**Database:** {{DATABASE}} via {{PROVIDER}}, schema in {{SCHEMA_PATH}}
**Auth:** {{AUTH_LIB}} with {{AUTH_STRATEGY}}, config in {{AUTH_CONFIG_PATH}}
**API:** {{API_STYLE}} with {{ROUTER_COUNT}} routers ({{ROUTER_LIST}})
**UI:** {{UI_LIB}} + {{CSS_FRAMEWORK}}, design tokens in dev_docs/foundations/
**State management:** {{STATE_STRATEGY}}
**Deployment:** {{DEPLOY_TARGET}}
**Monorepo:** {{YES_NO}} {{MONOREPO_TOOL_IF_YES}}

---

## Update Rules

This file is a **living snapshot** — overwrite sections when facts change, don't append history.

**Update after:** Any task that changes architecture, data model, service boundaries, API contracts, auth flow, or infrastructure.

**Do NOT update after:** Pure UI tweaks, bug fixes, test additions, documentation-only changes.

**Maximum size:** 3000 words. If this file exceeds 3000 words, condense — link to detailed docs instead of inlining.

**Read order after context loss:**
1. This file (ARCH-ANCHOR.md) — system understanding
2. dev_docs/handoff.md — what was done, what's next
3. dev_docs/STATUS.md — progress dashboard
4. Current task file — what to build now
