# Enhancement Categories Reference

> **Used by:** Step 30 (Enhancement Rounds)
> **Purpose:** Defines all categories of improvements to scan for across the project plan.

---

## Round 1: "What Did We Miss?"

### Category E1: Missing Services
- Services that exist in similar products but weren't captured
- Supporting services implied by existing features (e.g., a booking system implies a calendar service)
- Administrative services (audit logging, system health, user management) often missed in intake
- **How to detect:** Compare service list against industry standard feature sets for the project domain

### Category E2: Missing Screens
- Screens implied by services but not in the screen catalog (e.g., settings pages, admin panels)
- Error/fallback screens (404, 500, maintenance mode, offline)
- Onboarding screens (welcome, setup wizard, tutorial)
- **How to detect:** For each service, verify CRUD screens exist. Check for admin counterparts.

### Category E3: Missing Edge Cases
- What happens when data is empty? (first-time user, no results)
- What happens when data is huge? (pagination, infinite scroll, performance)
- What happens when operations fail? (network error, timeout, conflict)
- What happens with concurrent users? (race conditions, optimistic locking)
- **How to detect:** For each service spec, check the "Edge Cases" section. Verify ≥5 edge cases per P0 service.

### Category E4: Missing Business Rules
- Validation rules not captured (field constraints, business logic)
- State transition rules (what triggers status changes, who can trigger them)
- Calculation rules (pricing formulas, tax logic, discount cascading)
- **How to detect:** For each entity with a status field, verify a state machine is documented.

### Category E5: Missing Integrations
- Third-party services implied by features but not in integrations map
- Fallback strategies for each integration (what if the API is down?)
- Rate limiting and quota management for external APIs
- **How to detect:** Cross-reference features list against integrations map.

---

## Round 2: "What Can We Do Better?"

### Category E6: Thin Spec Sections
- Service spec sections with <100 words that should have more detail
- Screen specs without all 4 states (loading, error, empty, data)
- API contracts without error response schemas
- **How to detect:** Run depth scorer. Flag any section scoring <7/10.

### Category E7: Mega-Tasks
- Task files that describe >1 day of work without sub-task breakdown
- Tasks with vague acceptance criteria ("it works", "users can do X")
- Tasks missing effort estimates
- **How to detect:** Scan task files. Flag any without sub-tasks or with >8 hour estimates.

### Category E8: Weak API Contracts
- Endpoints missing error response definitions
- Missing pagination parameters on list endpoints
- Missing rate limiting documentation
- Missing authentication/authorization requirements
- **How to detect:** For each API endpoint, verify: request schema, success response, error responses, auth requirements.

### Category E9: Incomplete Screen Specs
- Screens without responsive breakpoint specifications
- Screens without accessibility requirements
- Screens without interaction states (hover, focus, active, disabled)
- Forms without validation rules
- **How to detect:** Check each screen spec against the screen spec template sections.

---

## Round 3: "What Patterns Emerged?"

### Category E10: Cross-Cutting Standards
- If multiple services have the same gap → create a standard (e.g., error handling standard)
- If multiple screens lack the same state → add to design system (e.g., empty state pattern)
- If multiple tasks have the same missing layer → create a template (e.g., E2E test template)
- **How to detect:** Aggregate findings from Rounds 1-2. Group by category. Any group with ≥3 items = cross-cutting standard needed.

### Category E11: Consistency Issues
- Naming inconsistencies across specs (camelCase vs snake_case, plural vs singular)
- Terminology drift (same concept called different names in different specs)
- Architecture inconsistencies (REST in one service, RPC-style in another without justification)
- **How to detect:** Extract entity names, endpoint paths, and terminology from all specs. Flag conflicts.

### Category E12: Documentation Gaps
- Decision rationale missing (why was this approach chosen over alternatives?)
- Migration paths not documented (how to move from MVP to V2)
- Dependency risks not documented (what if a key library is deprecated?)
- **How to detect:** Check decision log completeness. Verify each major architectural choice has a rationale entry.

---

## Enhancement Prioritization Rubric

When multiple enhancements are found, prioritize by:

| Priority | Criteria | Action |
|----------|----------|--------|
| P0 — Critical | Missing service or screen that blocks a core user flow | Add immediately |
| P1 — High | Missing edge cases or business rules for P0 services | Add in this round |
| P2 — Medium | Thin sections, weak contracts, consistency issues | Improve in this round |
| P3 — Low | Nice-to-have improvements, documentation gaps | Log for deep dive (Step 32) |
