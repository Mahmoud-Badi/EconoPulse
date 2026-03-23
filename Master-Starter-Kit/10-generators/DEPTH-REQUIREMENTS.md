# Depth Requirements

**Purpose:** Define minimum depth thresholds, pre-generation depth prompts, and qualitative scoring for all generated documents. Used by ORCHESTRATOR Steps 5, 6, and 8.

**Why this exists:** Without enforced depth thresholds AND pre-generation thinking, the orchestrator generates specs that hit minimum word counts but lack real-world depth. Metrics catch shallow specs after the fact — but depth prompts prevent shallow thinking before generation begins. Both are required.

**Philosophy:** Meeting the minimum threshold is not the goal — it's the floor below which work is rejected. The thresholds exist to catch failures, not to define success. A service spec at exactly 2000 words is a red flag, not a pass. There is no "fast pass" or "abbreviated" mode — every generation runs full TTG questions, full depth prompts, and full scoring. Speed is never traded for depth.

---

## Depth Prompting Protocol (Use BEFORE Generation)

These prompts must be answered IN THE CONVERSATION before writing any spec or task. They force real-world thinking that produces naturally deep output. See also the Think-Then-Generate (TTG) protocol in ORCHESTRATOR.md.

### Service Spec Depth Prompts

**User Day Simulation:**
> "It's 9 AM. [PRIMARY_ROLE] opens the app to use [SERVICE]. Walk through their entire workflow until they're done. What do they click? What do they see? What frustrates them? What makes them say 'finally, an app that gets this right'?"

**Failure Mode Analysis:**
> "List 8 things that can go wrong with [SERVICE] in production. For each: what triggers it, what does the user see, how do we recover? Think: race conditions, network failures, bad data, concurrent users, timezone issues, permission edge cases, data migration scenarios, integration failures."

**Competitive Parity Check:**
> "What do the top 3 competitors do for [SERVICE]'s equivalent feature? What are their table-stakes features we MUST match? What is their 'magic feature' we should consider? What do their users complain about that we can do better?"

**Day-1 Expectations:**
> "A user signs up and uses [SERVICE] for the first time. List 10 things they would expect to work on day 1. Not 'nice to have' — things they'd file a bug report about if missing."

**Admin/Ops Perspective:**
> "You are the admin/ops person responsible for [SERVICE]. What do you need to monitor? What reports do you need? What bulk operations would save you hours? What would you audit?"

### Screen Spec Depth Prompts

**UX Narrative:**
> "A user lands on [SCREEN] for the first time. What is the first thing their eye goes to? What is the primary action? What is the most common SECOND action? What makes this screen efficient for the 100th visit, not just the 1st?"

**State Exhaustion:**
> "List EVERY possible state [SCREEN] can be in: loading, error, empty, populated, filtered-empty, searching, editing, confirming-delete, bulk-selecting, network-offline, session-expired, permission-denied, data-stale, loading-more, saving, validation-error, success-feedback..."

**Frustration Check:**
> "What would make a user say 'this is annoying' about [SCREEN]? Think: too many clicks, missing keyboard shortcuts, no bulk actions, can't find things, lost scroll position, slow search, no undo, no inline editing, poor empty states, no drag-and-drop where expected..."

### Task File Depth Prompts

**Outcome Visualization:**
> "When this task is DONE, what exactly does the user see? Not 'billing module works' — describe the exact screen, the exact interaction, the exact data displayed. If you can't describe it, the task isn't specific enough."

**Implementation Path:**
> "What files are created or modified? What existing patterns does this follow? Link to specific reference files. What is the testing strategy — unit, integration, E2E?"

---

## What Basic Looks Like vs What Great Looks Like

### Service Spec: Business Rules Section

**Basic (fails):**
> 1. The system manages user accounts
> 2. Users can create and edit profiles
> 3. Passwords must be secure
> 4. Users need to be authenticated
> 5. The system handles errors appropriately

**Great (passes):**
> 1. A user account cannot be deleted if the user has active subscriptions — must cancel all subscriptions first, with a 30-day grace period
> 2. Email changes require re-verification via a token valid for 24 hours; the old email receives a "your email was changed" notification
> 3. Failed login attempts are rate-limited: 5 attempts per 15 minutes per IP, then 30-minute lockout with CAPTCHA unlock
> 4. Password reset tokens expire after 1 hour and are single-use; generating a new token invalidates all previous tokens
> 5. Account deactivation preserves all data for 90 days (legal requirement), then triggers GDPR-compliant hard deletion
> 6. Username changes are limited to once per 30 days; previous usernames are reserved for 6 months to prevent impersonation
> 7. Two-factor authentication, once enabled, cannot be disabled without identity verification via support ticket
> 8. Bulk user import via CSV must validate all rows before importing any — partial imports are rejected with per-row error reports

### Screen Spec: States Section

**Basic (fails):**
> - Loading: Shows a spinner
> - Empty: Shows "No data"
> - Populated: Shows the data table
> - Error: Shows error message

**Great (passes):**
> - **Initial Loading:** Skeleton screen matching table layout (not a spinner) — 8 skeleton rows with pulsing column placeholders
> - **Empty (first-time user):** Illustration + "Create your first project" CTA button + 3-bullet value proposition. NOT just "No projects found"
> - **Empty (filtered):** "No projects match your filters" + active filter chips + "Clear all filters" link. Preserves search text
> - **Populated:** Data table with sortable columns, row hover actions, bulk selection checkboxes, inline status editing
> - **Searching:** Debounced search (300ms) — table shows shimmer overlay, preserves scroll position, highlights matching text
> - **Bulk Selection:** Floating action bar appears at bottom with count ("3 selected") + bulk actions (Delete, Archive, Export)
> - **Confirming Delete:** Inline confirmation within the row (not a modal for single delete). Shows "Are you sure? This will also delete 12 tasks" with entity count
> - **Network Offline:** Banner at top "You're offline — changes will sync when reconnected." Table remains readable but actions are disabled
> - **Session Expired:** Modal overlay with "Your session has expired. Sign in to continue." — preserves form state on re-auth
> - **Error (API failure):** Error banner with specific message + "Retry" button. Previous data remains visible (not replaced by error)

---

## Service Spec Depth Requirements

**Minimum total words:** 2000

**Used in:** ORCHESTRATOR Step 5 (Service Spec Generation) — depth verification substep

### Required Section Minimums

| Section | Minimum | What Counts |
|---------|---------|-------------|
| Business Rules | ≥10 rules | Each rule must be a specific constraint, not a restatement of the feature description. "Every load must have exactly one origin and one destination" is a rule. "The system manages loads" is NOT. |
| Data Model Entities | ≥3 entities | Each entity must include key fields (≥4 per entity) and relations. A single-entity service must still document 3+ related entities it depends on. |
| API Endpoints | ≥8 endpoints | Full CRUD minimum + search, filter, bulk, and status-change endpoints. Each endpoint must specify method, path, auth, request DTO, response shape, and full request/response DTOs. |
| Validation Rules | ≥8 rules | Field-level validations with specific constraints. "Name is required" counts. "Fields must be valid" does NOT. |
| Error Scenarios | ≥6 scenarios | Each must specify trigger condition, error code/message, and recovery action. |
| Edge Cases | ≥10 cases | Specific scenarios that deviate from the happy path. "What if the carrier is deleted while a load is in transit?" is an edge case. "Handle errors gracefully" is NOT. |
| Auth/Permission Matrix | Required | Which roles can perform which operations. Table format: Role x Operation. |
| Dependencies | Required | Explicit list of other services, external APIs, and shared entities this service depends on. |

### Scoring Algorithm

Score each service spec out of 10:

```
score = 0

# Section completeness (max 5 points)
if business_rules >= 10: score += 1
if data_model_entities >= 3: score += 1
if api_endpoints >= 8: score += 1
if validation_rules >= 8: score += 0.5
if error_scenarios >= 6: score += 0.25
if error_codes_with_catalog_format >= 10: score += 0.25  # codes matching SERVICE_TYPE_SPECIFIC in Section 12
if edge_cases >= 10: score += 0.5
if auth_matrix_exists: score += 0.25
if dependencies_listed: score += 0.25

# Content quality (max 3 points)
if total_words >= 2000: score += 1
if total_words >= 2500: score += 0.5
if business_rules_are_specific (not generic): score += 0.5
if edge_cases_reference_real_entities: score += 0.5
if api_endpoints_have_full_dtos: score += 0.5

# Cross-referencing (max 2 points)
if entities_match_project_brief: score += 0.5
if endpoints_cover_all_crud_for_all_entities: score += 0.5
if screen_references_match_screen_catalog: score += 0.5
if dependencies_reference_real_services: score += 0.5

# Qualitative depth (bonus 2 points — scale is now /12)
if spec_uses_real_user_scenarios (not abstract): score += 0.5
if spec_describes_what_makes_feature_delightful (not just functional): score += 0.5
if spec_addresses_power_user_needs (bulk ops, shortcuts, export, automation): score += 0.5
if spec_addresses_first_time_user_needs (empty states, onboarding, smart defaults): score += 0.5
```

**Threshold: ≥10/10 quantitative AND ≥2/2 qualitative to pass.**

A spec scoring 10/10 on metrics but 0/2 on qualitative = still SHALLOW. It means the spec describes functionality without soul — it would produce a technically correct but uninspiring product. Meeting the threshold is the floor, not the goal.

If a service spec fails:
1. Identify which sections are shallow (quantitative) or soulless (qualitative)
2. Re-generate ONLY the failing sections (do not regenerate the entire spec)
3. Re-score after expansion — max 3 attempts per spec before escalating to user
4. Do NOT proceed to Step 6 until ALL service specs pass both thresholds

---

## Screen Spec Depth Requirements

**Minimum total words:** 1200

**Used in:** ORCHESTRATOR Step 6 (Screen Spec Generation) — depth verification substep

### Required Section Minimums

| Section | Minimum | What Counts |
|---------|---------|-------------|
| States | ≥8 states | Must include: loading, error, empty, populated + at least 4 context-specific states (e.g., filtering, editing, confirming-delete, bulk-selecting, offline, saving, searching, validation-error). |
| Interactions | ≥7 interactions | User actions and their system responses. "Click save → validate form → show success toast → redirect to list" is one interaction. |
| Edge Cases | ≥5 cases | Screen-specific edge cases. "What if the user has 10,000 items?" or "What if the session expires during form fill?" |
| Accessibility | ≥3 items | Specific a11y requirements: keyboard navigation, ARIA labels, focus management, screen reader behavior, color contrast. |
| Component Tree | ≥5 components | Named components that compose the screen. Must reference actual component names from the component library or identify new ones needed. |
| Responsive Breakpoints | ≥2 breakpoints | How the layout adapts at different viewport widths. Mobile, tablet, desktop minimum. |
| Data Requirements | Required | What data the screen fetches, from which API endpoints, and how it handles loading/error states for each. |
| Field Specifications | Required (for forms) | Every form field with: label, type, validation rules, placeholder, help text, error messages. |

### Scoring Algorithm

Score each screen spec out of 10:

```
score = 0

# Section completeness (max 5 points)
if states >= 8: score += 1
if interactions >= 7: score += 0.75
if edge_cases >= 5: score += 0.75
if accessibility_items >= 3: score += 0.5
if component_tree >= 5: score += 0.5
if responsive_breakpoints >= 2: score += 0.5
if data_requirements_exist: score += 0.5
if field_specs_exist (for forms): score += 0.5

# Content quality (max 3 points)
if total_words >= 1200: score += 1
if total_words >= 1600: score += 0.5
if states_include_all_four_basics: score += 0.5
if interactions_describe_system_response: score += 0.5
if components_reference_real_names: score += 0.5

# Cross-referencing (max 2 points)
if api_endpoints_match_api_catalog: score += 0.5
if components_match_component_catalog: score += 0.5
if route_matches_screen_catalog: score += 0.5
if permissions_match_service_spec: score += 0.5

# Qualitative depth (bonus 2 points — scale is now /12)
if spec_addresses_power_user_efficiency (keyboard shortcuts, bulk ops, inline edit): score += 0.5
if spec_addresses_first_time_user_experience (empty states, onboarding, tooltips): score += 0.5
if spec_describes_what_makes_screen_delightful (not just functional): score += 0.5
if spec_considers_daily_use_patterns (100th visit efficiency, not just 1st visit): score += 0.5
```

**Threshold: ≥9/10 quantitative AND ≥2/2 qualitative to pass.**

If a screen spec fails:
1. Identify which sections are shallow (quantitative) or uninspired (qualitative)
2. Re-generate ONLY the failing sections
3. Re-score after expansion — max 3 attempts per spec before escalating to user
4. Do NOT proceed to Step 7 until ALL screen specs pass both thresholds

---

## Task File Depth Requirements

**Minimum total words:** 350

**Used in:** ORCHESTRATOR Step 8 (Task Generation) — depth verification substep

### Required Sections

| Section | Requirement | What Counts |
|---------|-------------|-------------|
| Context Header | Universal reading list + 3-6 specific file paths | Must include the universal reading list for the task type (per `04-phase-planning/pre-task-reading-lists.md`) PLUS 3-6 task-specific file paths. Must be real paths, not generic ("Read the service spec" → must be `dev_docs/specs/services/load-management.md`). Minimum total: ≥6 file references. |
| Objective | 1-3 sentences | What this task accomplishes. Must be specific and verifiable. |
| File Plan | Specific paths | Every file that will be created or modified, with the exact path. "Create the component" is NOT acceptable. "Create `apps/web/components/loads/LoadCard.tsx`" IS. |
| Acceptance Criteria | ≥5 criteria | Each criterion must be independently testable. "The feature works correctly" is NOT a criterion. "Submitting the form with a name >100 chars shows 'Name too long' validation error" IS. All criteria must be testable. |
| Sub-tasks | ≥5 sub-tasks | Discrete implementation steps. Each must be completable in 1-2 hours with concrete file paths. |
| Dependencies | Required | Task IDs that must be completed first. "None" is acceptable if truly independent. |
| Effort Estimate | Required | S (1-2h), M (2-4h), L (4-8h), XL (8-16h) |

### Task Layer Coverage

Every feature/service must have task coverage across at least **6 of 8 layers**:

| Layer | Description | Example Task |
|-------|-------------|-------------|
| 1. Validator | Input validation, DTO definitions | "Create CreateLoadDto with class-validator decorators" |
| 2. Tests | Unit tests for business logic | "Write unit tests for load status transitions" |
| 3. DB Procedure | Database model, migration, seed | "Create Load Prisma model with all fields and relations" |
| 4. Procedure Tests | Integration tests for DB operations | "Write integration tests for load CRUD operations" |
| 5. Component | UI component implementation | "Build LoadCard component with status badge and actions" |
| 6. Page | Full page/screen assembly | "Build Load List page with DataTable, filters, and pagination" |
| 7. E2E | End-to-end test scenario | "E2E: Create a load, assign carrier, mark delivered" |
| 8. Docs | User documentation for the feature | "Write Load Management feature guide for user_docs" |

**Threshold: ≥8/8 layers per feature.**

If a feature has <7 layers:
1. Identify missing layers
2. Generate additional task files for each missing layer
3. Add them to the appropriate phase in STATUS.md
4. Do NOT proceed to Step 9 until all features have ≥7/8 layers

---

## Depth Dashboard

Generated at `dev_docs/completeness/depth-dashboard.md` during Step 16 (Handoff).

### Service Spec Depth Table

| Service | Words | Rules | Endpoints | Entities | Validations | Errors | Edge Cases | Score |
|---------|-------|-------|-----------|----------|-------------|--------|------------|-------|
| {{SERVICE}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{SCORE}}/10 |

**Average score:** {{AVG}}/10
**Pass rate:** {{N}}/{{TOTAL}} ({{PCT}}%)

### Screen Spec Depth Table

| Screen | Words | States | Interactions | Edge Cases | A11y | Components | Score |
|--------|-------|--------|-------------|------------|------|------------|-------|
| {{SCREEN}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{N}} | {{SCORE}}/10 |

**Average score:** {{AVG}}/10
**Pass rate:** {{N}}/{{TOTAL}} ({{PCT}}%)

### Task Depth Table

| Feature | Validator | Tests | DB | DB Tests | Component | Page | E2E | Docs | Layers | Complete? |
|---------|-----------|-------|----|----------|-----------|------|-----|------|--------|-----------|
| {{FEATURE}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{Y/N}} | {{N}}/8 | {{Y/N}} |

**Average layers:** {{AVG}}/8
**Pass rate (≥6):** {{N}}/{{TOTAL}} ({{PCT}}%)

---

## Common Shallow Patterns (Anti-Examples)

These are the patterns that indicate a spec is too shallow. If you see these, the spec needs expansion:

### Service Spec Anti-Patterns

| Pattern | Why It's Shallow | Fix |
|---------|-----------------|-----|
| "The system manages [entity]" as a business rule | Restates the feature description | Write specific constraints: "An order cannot be modified after status changes to SHIPPED" |
| Single-entity data model | Most services involve 3+ entities | Document related entities even if they belong to other services |
| Only CRUD endpoints (4 total) | Real services have search, filter, bulk, status-change endpoints | Walk through each user workflow and identify every API call needed |
| "Validate all required fields" | Not specific enough to implement | List each field with its validation: "email must match RFC 5322 format" |
| "Handle errors appropriately" | Not actionable | Specify: "If carrier not found, return 404 with code CARRIER_NOT_FOUND" |
| "Consider edge cases" | Not specific | Name them: "What if two dispatchers assign the same carrier simultaneously?" |

### Screen Spec Anti-Patterns

| Pattern | Why It's Shallow | Fix |
|---------|-----------------|-----|
| Only "populated" state described | Screens have 4+ states | Add loading skeleton, error with retry, empty with CTA |
| "Clicking buttons performs actions" | Not specific | Describe: "Click 'Assign' → opens carrier selection modal → selecting carrier calls PATCH /api/loads/:id" |
| No responsive consideration | Mobile users exist | Define breakpoints: "Below 768px: table converts to card list" |
| "Should be accessible" | Not actionable | Specify: "DataTable has role='grid', arrow keys navigate cells, Escape exits editing mode" |

### Task File Anti-Patterns

| Pattern | Why It's Shallow | Fix |
|---------|-----------------|-----|
| "Read the relevant files" in context header | Not specific | List exact paths: "Read `dev_docs/specs/services/load-management.md` sections 3-5" |
| "Implement the feature" as objective | Not verifiable | "Implement the Load List page with server-side pagination, status filtering, and CSV export" |
| "It works correctly" as acceptance criterion | Not testable | "Entering a date before today in the pickup field shows 'Pickup date must be in the future'" |
| Generic file plan | Not actionable | List every file with its exact path |

---

## Steps 13-28 Depth Requirements

**Purpose:** Enforce minimum output depth for the 16+ planning areas covered by Steps 13-28. Without these requirements, these steps produce skeleton files that fail to guide implementation.

**Why this exists:** In real-world runs, Steps 13-28 were batched into 3 large agent calls, producing surface-level files (500-2000 words each) with correct structure but insufficient granularity. Developers cannot implement from skeleton strategy docs.

### Agent Call Rule

**Steps 13-28 MUST NOT be batched into fewer than 6 agent calls.** Each call may cover at most 3 adjacent steps. This prevents the AI from optimizing for speed over depth.

### Depth Table

| Step | Area | Min Files | Min Words/File | Key Quality Check |
|------|------|-----------|---------------|-------------------|
| 13 | Design System | 5 | 300 | Token values must be project-specific, not generic |
| 14 | Security | 4 | 400 | OWASP checklist must reference project's specific tech stack |
| 14.5 | Store Readiness | 3 | 200 | Checklists must have real app IDs/bundle IDs |
| 14.6 | AI/ML Features | 3 | 500 | Model selection must include cost projections |
| 14.7 | Legal Documents | 2 | 800 | Must reference project's data sensitivity classification |
| 14.75 | Privacy Engineering | 6 | 400 | Data flow map must cover all services; DSR workflow must include timeline enforcement |
| 14.8 | Billing | 3 | 400 | Must include specific webhook event handling |
| 14.9 | Integrations | 4 | 400 | Each integration must have error handling + fallback |
| 15 | Observability | 3 | 300 | Must include project-specific alert thresholds |
| 15.5 | User Documentation | 5 | 500 | Must reference real screens and real user workflows |
| 16 | Handoff | 3 | 300 | Completeness dashboard must have real numbers |
| 16.1-16.5 | Quality Gates | 5 | 200 | Each gate must reference project-specific patterns |
| 17 | Capabilities | 4 | 300 | Each capability must have config and test verification |
| 17.5 | Financial | 4 | 400 | Numbers must be project-specific, not template defaults |
| 17.6 | Multi-Tenant | 4 | 500 | Must include tenant isolation verification queries |
| 18 | Onboarding | 3 | 400 | Commands must be real (copy-paste-able) |
| 18.5 | Ceremonies | 3 | 200 | Sprint plan must have real tasks from STATUS.md |
| 18.6 | Incident Response | 5 | 300 | Runbooks must reference project's actual services |
| 18.7 | Customer Support | 5 | 300 | SLAs must have specific response time numbers |
| 18.7.5 | CX Operations | 5 | 400 | Playbooks must use real product scenarios |
| 18.75 | Customer Migration | 5 | 400 | Import wizard must cover full upload-to-completion flow; competitor playbooks must name real competitors |
| 18.8 | Post-Launch | 5 | 300 | Metrics must reference project's actual KPIs |
| 18.85 | Team & Hiring Ops | 6 | 300 | Compensation bands must use real market data; org chart must reflect actual team + planned hires |
| 19-28 | Marketing | 8 | 400 | All content must reference real product name and features |
| 27.5 | Product-Led Growth | 6 | 400 | PQL scoring must define ≥5 signals; growth loops must be product-specific |
| 28.5 | Competitive Intel | 5 | 500 | Battle cards must name real competitors |
| 28.6 | Marketplace & Plugin | 6 | 400 | Plugin architecture must define ≥5 extension points; security model must include permission scopes |
| 28.7 | BI | 3 | 400 | Metrics registry must have 30+ metrics |
| 28.8 | SEO | 5 | 400 | Keyword research must target real product category |
| 28.85 | Partner & Channel | 5 | 400 | Revenue sharing must define payment flow; partner tiers must have criteria and benefits |
| 28.9 | Investor & Fundraising | 6 | 400 | Pitch deck must reference real financial data; cap table must model ≥2 dilution scenarios |

### Enforcement Rules

1. **File count check:** If a step produces fewer files than its minimum → mark as INCOMPLETE. Generate missing files before proceeding to the next step.
2. **Word count check:** If any file has fewer words than its minimum → mark as SHALLOW. Expand the file before proceeding.
3. **Quality check:** The "Key Quality Check" column is the qualitative test. A file can meet word count but still fail if it uses generic/template language instead of project-specific content. Generic language indicators:
   - Uses placeholder names instead of real project entities
   - Uses "the system" or "the application" instead of the product name
   - Describes capabilities in abstract terms instead of concrete scenarios
   - Copies template structure without filling in project-specific details

### What Shallow Looks Like vs What Great Looks Like (Steps 13-28)

**Shallow security doc (fails):**
> "Implement OWASP Top 10 protections. Use rate limiting. Validate inputs. Encrypt data at rest and in transit."

**Great security doc (passes):**
> "Rate limit the `/api/v1/encounters` endpoint to 100 req/min per authenticated user, 20 req/min for search endpoints. Implement CSRF protection on all state-changing routes using double-submit cookie pattern with SameSite=Strict. ePCR data at rest uses AES-256-GCM with per-tenant encryption keys rotated every 90 days via AWS KMS. HIPAA audit log captures: who accessed what patient record, when, from which IP, and which fields were viewed."

---

## Steps 13-28 Required Sections (Structural Depth)

The Depth Table above enforces QUANTITY (file count, word count). This section enforces STRUCTURE — required sections that each file type must contain. Without structural requirements, agents produce files that hit word counts with filler instead of actionable content.

### Step 13 — Design System

Each file must contain these sections:
- **Token Architecture** — 3-layer system (primitive → semantic → component), with actual values
- **Color System** — Primary, secondary, neutral palettes with hex/oklch values, dark mode variants, accessibility contrast ratios (WCAG AA minimum)
- **Typography Scale** — Font families, size scale (at least 8 sizes), line heights, letter spacing, responsive adjustments
- **Spacing System** — Base unit, scale (4px/8px grid), named tokens (xs through 3xl)
- **Component Inventory** — List of all design system components with variant counts and usage locations

### Step 14 — Security Hardening

Each file must contain these sections:
- **Threat Model** — STRIDE analysis or equivalent for the project's specific attack surface
- **Authentication Flows** — Sequence diagrams for: login, registration, password reset, session refresh, logout, MFA (if applicable)
- **Authorization Matrix** — Complete role × resource × operation matrix (not just "admin can do everything")
- **Input Validation Rules** — Per-endpoint validation strategy referencing validators from service specs
- **Encryption Configuration** — At-rest (algorithm, key management) and in-transit (TLS version, certificate strategy)
- **OWASP Checklist** — Top 10 mapped to the project's specific tech stack with mitigation for each
- **Rate Limiting Configuration** — Per-endpoint limits with burst allowances, by auth tier
- **Audit Logging** — What events to log, structured log format, retention period, PII redaction rules

### Step 14.9 — Integration Strategy

Each integration file must contain:
- **Failure Modes** — What can go wrong (timeout, 5xx, rate limit, auth failure, data format change)
- **Retry Configuration** — Count, backoff strategy, jitter, idempotency requirements
- **Circuit Breaker Configuration** — Threshold, cooldown, half-open behavior
- **Fallback Behavior** — Specific to this integration (cached data, degraded UX, queue, hard block)
- **Monitoring** — Health check endpoint, alert thresholds, dashboard panel

### Step 15 — Observability & Error Handling

Each file must contain:
- **Structured Logging Configuration** — Log format (JSON), required fields per log entry, log levels by environment
- **Log Level Strategy** — What goes at each level (error, warn, info, debug), with examples from the project
- **Correlation ID Design** — How request IDs propagate across services, header names, middleware implementation
- **Alert Rules** — Specific thresholds (not "monitor errors"), with escalation levels (warning → alert → page)
- **Health Check Endpoints** — Per-service health check that verifies database, cache, and external dependencies
- **Dashboard Layout** — Panels for: error rate, latency p50/p95/p99, throughput, active users, queue depth

### Step 15.5 — User Documentation

Each feature guide must contain:
- **Per-Feature User Guide** — Step-by-step with real screen references (not "click the button")
- **Getting Started** — First-use walkthrough for new users
- **FAQ** — Minimum 5 questions per major feature, based on real user confusion points
- **Troubleshooting** — Common errors with solutions, referencing actual error codes from error-catalog.md

### Step 17 — Advanced Capabilities

Each capability file must contain:
- **Configuration Schema** — Exact config shape (TypeScript interface or JSON schema)
- **Toggle Mechanism** — How to enable/disable (feature flag, env var, admin panel), with code example
- **Test Verification** — How to verify the capability works (specific test commands or manual steps)

### Step 18 — Developer Onboarding

The onboarding guide must contain:
- **Setup Script** — Copy-paste-able commands from clone to running dev server (no "install dependencies" — show `pnpm install`)
- **Architecture Walkthrough** — File tree with annotations explaining what each directory contains
- **Contributing Guide** — Branch naming, commit message format, PR template, review process

### Enforcement

For each step, after generating output files:
1. Check that every required section header exists in the output
2. If a section is present but contains fewer than 3 sentences, flag as SHALLOW
3. If a section is missing entirely, flag as INCOMPLETE
4. Regenerate flagged sections before proceeding to the next step

---

## Integration with Orchestrator

This file is referenced by:

- **Step 5** (Service Specs): After generating each spec, run the service spec scoring algorithm. Re-generate shallow sections until all pass ≥10/10. Full TTG and all depth prompts are mandatory — no abbreviation.
- **Step 6** (Screen Specs): After generating each spec, run the screen spec scoring algorithm. Re-generate shallow sections until all pass ≥9/10. Full TTG and all depth prompts are mandatory — no abbreviation.
- **Step 8** (Task Generation): After generating tasks, verify layer coverage per feature. Generate missing layer tasks until all features have ≥8/8.
- **Steps 13-28** (Planning Areas): After generating each step's output, verify file count, word count, and quality check against the Steps 13-28 Depth Table above. Re-generate before proceeding.
- **Step 16** (Handoff): Generate the depth dashboard as part of the completeness report.
