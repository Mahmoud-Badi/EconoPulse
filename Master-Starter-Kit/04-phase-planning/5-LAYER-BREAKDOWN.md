# 5-Layer Per-Service Breakdown

## Overview

Every service/module goes through 5 layers of work, in order. This prevents the common pattern of "build first, secure never, test maybe."

**Proven on:** 39 services across 24 sprints in Ultra TMS. Every service that followed this sequence shipped without critical regressions.

---

## The 5 Layers

```
Layer 1: VERIFY  →  Layer 2: SECURE  →  Layer 3: BUILD  →  Layer 4: WIRE  →  Layer 5: TEST
   ↓                   ↓                    ↓                  ↓                  ↓
What exists?       Is it safe?         Build features      Connect services    Prove it works
```

---

## Layer 1: VERIFY (VER)

**Goal:** Confirm what exists vs what's planned. Prevent building what's already done.

**Effort:** 1-3 hours per service

**Tasks:**
- [ ] Read the service hub file — understand what's claimed
- [ ] `grep` for controllers, routes, models in the codebase
- [ ] Compare: Does code match what hub says?
- [ ] Identify: What's actually built vs what's a stub vs what's missing
- [ ] Update hub with verified status (not planned status)

**Output:** Verified hub file with accurate Implementation Status matrix

**Why this matters:** Ultra TMS found that 97% of hub files written from specs were inaccurate. Verify first prevents weeks of rebuilding things that already exist.

**Task prefix:** `VER-{sprint}-{seq}` (e.g., VER-01-001)

---

## Layer 2: SECURE (SEC)

**Goal:** Harden auth, authorization, input validation, and tenant isolation BEFORE building features.

**Effort:** 2-6 hours per service

**Tasks:**
- [ ] Add auth guards to all endpoints
- [ ] Implement role-based access control (RBAC)
- [ ] Add input validation (DTOs with decorators)
- [ ] Add tenant isolation (tenantId filter on all queries)
- [ ] Add soft-delete filtering (deletedAt IS NULL)
- [ ] Encrypt sensitive fields
- [ ] Review against SECURITY-AUDIT-CHECKLIST.md

**Output:** Service passes security audit checklist

**Why this matters:** Security retrofitting is 10x harder than building it in. Adding auth guards after 50 endpoints are built means auditing each one. Adding them first means they're there from the start.

**Task prefix:** `SEC-{sprint}-{seq}` (e.g., SEC-01-001)

---

## Layer 3: BUILD (BLD)

**Goal:** Implement features — frontend screens, backend logic, data models.

**Effort:** 4-16 hours per service (varies by complexity)

**Tasks:**
- [ ] Build backend: models, DTOs, services, controllers
- [ ] Build frontend: pages, components, hooks, forms
- [ ] Implement business rules
- [ ] Handle all 4 UI states (loading, error, empty, data)
- [ ] Wire forms to API with proper validation
- [ ] Apply design system tokens

**Output:** Functional feature with all CRUD operations working

**Why this matters:** This is the core development work. It comes AFTER verify and secure because you need to know what exists (Layer 1) and have security in place (Layer 2) before building.

**Task prefix:** `BLD-{sprint}-{seq}` (e.g., BLD-01-001)

---

## Layer 4: WIRE (WIR)

**Goal:** Connect the service to other services, external APIs, real-time channels, and background jobs.

**Effort:** 2-4 hours per service

**Tasks:**
- [ ] Wire cross-service API calls (service A calls service B)
- [ ] Set up event emitters/listeners (if event-driven)
- [ ] Configure WebSocket/SSE channels (if real-time)
- [ ] Set up background jobs/crons (if applicable)
- [ ] Configure external API integrations (maps, email, payment)
- [ ] Verify the API response envelope format is consistent

**Output:** Service is connected to all dependencies and communication paths work

**Why this matters:** Integration bugs are the hardest to debug. Dedicated wiring time catches issues before they compound.

**Task prefix:** `WIR-{sprint}-{seq}` (e.g., WIR-01-001)

---

## Layer 5: TEST (TST)

**Goal:** Prove the service works correctly with automated tests.

**Effort:** 3-8 hours per service

**Tasks:**
- [ ] Write unit tests for business logic (validators, services, utilities)
- [ ] Write integration tests for API endpoints (request → response)
- [ ] Write E2E tests for critical user flows (Playwright/Cypress)
- [ ] Test tenant isolation (data doesn't leak between tenants)
- [ ] Test auth/authorization (correct roles required)
- [ ] Achieve minimum coverage target: {{COVERAGE_TARGET}}%

**Output:** Test suite passes, coverage target met

**Why this matters:** Tests are the only way to prove the service works AND to prevent regressions when other services change.

**Task prefix:** `TST-{sprint}-{seq}` (e.g., TST-01-001)

---

## Sprint Planning with 5 Layers

When planning a sprint, allocate tasks per service using this breakdown:

| Service | VER | SEC | BLD | WIR | TST | Total |
|---------|-----|-----|-----|-----|-----|-------|
| Auth | 2h | 4h | 8h | 2h | 4h | 20h |
| CRM | 1h | 2h | 12h | 3h | 6h | 24h |
| Dashboard | 1h | 2h | 6h | 2h | 3h | 14h |

**Rules:**
1. VER must complete before BLD starts (you need to know what exists)
2. SEC should complete before or alongside BLD (security from the start)
3. WIR happens after BLD (you need something to wire)
4. TST happens last (you need working code to test)
5. Exception: TDD inverts BLD and TST (write tests first, then build)

---

## Per-Service Task Template

```markdown
## {{SERVICE_NAME}} — Sprint {{SPRINT_NUMBER}}

### VER: Verify (1-3h)
- [ ] VER-{{SPRINT}}-001: Verify {{SERVICE_NAME}} hub against code
- [ ] VER-{{SPRINT}}-002: Update implementation status matrix

### SEC: Secure (2-6h)
- [ ] SEC-{{SPRINT}}-001: Add auth guards to all {{SERVICE_NAME}} endpoints
- [ ] SEC-{{SPRINT}}-002: Add tenant isolation to all {{SERVICE_NAME}} queries
- [ ] SEC-{{SPRINT}}-003: Add input validation DTOs

### BLD: Build (4-16h)
- [ ] BLD-{{SPRINT}}-001: Build {{SCREEN_1}} page
- [ ] BLD-{{SPRINT}}-002: Build {{SCREEN_2}} page
- [ ] BLD-{{SPRINT}}-003: Implement {{BUSINESS_RULE}} logic

### WIR: Wire (2-4h)
- [ ] WIR-{{SPRINT}}-001: Wire {{SERVICE_NAME}} to {{DEPENDENCY_1}}
- [ ] WIR-{{SPRINT}}-002: Configure {{REALTIME_CHANNEL}} events

### TST: Test (3-8h)
- [ ] TST-{{SPRINT}}-001: Write unit tests for {{SERVICE_NAME}} service
- [ ] TST-{{SPRINT}}-002: Write integration tests for {{SERVICE_NAME}} endpoints
- [ ] TST-{{SPRINT}}-003: Write E2E test for {{CRITICAL_FLOW}}
```
