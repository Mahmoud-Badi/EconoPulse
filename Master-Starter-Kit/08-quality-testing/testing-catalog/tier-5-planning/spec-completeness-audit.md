# Spec Completeness Audit

## What It Is

A systematic verification that every service spec and screen spec produced by the kit contains all required fields filled with real, project-specific content — not placeholders, not generic filler, not "TBD." A spec passes the completeness audit when a developer could read it cold and start building without asking a single clarifying question. If the developer would need to guess at a business rule, the spec is incomplete.

---

## What It Catches

- **Placeholder text left in delivered specs** — `{{DESCRIPTION}}` or "TODO: fill in later" still present in a spec that was marked "done"
- **Generic business rules that describe nothing** — "Validate input" instead of "Email must match RFC 5322, phone must be E.164 format with country code, name must be 2-100 characters with no consecutive spaces"
- **Missing error scenarios** — A payment spec that describes the happy path but never mentions what happens when the card is declined, the network times out, or the amount exceeds the daily limit
- **Missing edge cases** — A scheduling spec that handles normal bookings but never addresses double-booking, timezone boundaries, or daylight saving time transitions
- **Specs that describe features without user context** — "The system shall display a list of records" without explaining who sees this list, why they need it, what they do with it, and what happens when the list is empty
- **Word-count padding masquerading as depth** — A spec that is 3 pages long but repeats the same information in different phrasings, with no additional specificity per paragraph
- **Missing field definitions in data specs** — A service spec that mentions "user profile" but never enumerates the actual fields, their types, their constraints, and which are required vs. optional
- **Incomplete state definitions** — A screen spec that defines the "data loaded" state but omits loading, error, empty, and permission-denied states

---

## When It's Required

This audit runs at three points during kit execution:

| Orchestrator Step | What Gets Audited | Trigger |
|-------------------|-------------------|---------|
| After Step 4 (Service Specs) | All service specs | Before proceeding to screen specs |
| After Step 6 (Screen Specs) | All screen specs | Before proceeding to task generation |
| After Step 8 (Task Generation) | All specs referenced by tasks | Before entering development phases |

If a spec fails the audit, it gets sent back for rework. Do not proceed to the next step with incomplete specs — the cost of reworking tasks built on bad specs is 5-10x the cost of fixing the spec upfront.

---

## How To Run

### Step 1: Collect all specs for the audit scope

Gather every service spec and/or screen spec produced in the current step. Create a tracking table:

```markdown
| Spec Name | Type | Field Count | Pass/Fail | Issues |
|-----------|------|-------------|-----------|--------|
| user-auth-service | Service | 14/14 | PASS | — |
| trip-booking-service | Service | 11/14 | FAIL | Missing error scenarios, generic validation rules |
```

### Step 2: Run the field-count check

For each spec, verify against the minimum required fields:

**Service Spec Minimum Fields (14):**
1. Service name and one-sentence purpose
2. Owner/domain assignment
3. Business context (why this service exists, who uses it)
4. Entity definitions with all fields, types, and constraints
5. Relationships to other entities (with cardinality)
6. Business rules — specific, testable, enumerated (minimum 5 per service)
7. Validation rules — per-field, with exact constraints (not "validate input")
8. API endpoints — method, path, request schema, response schema
9. Authorization rules — who can do what, role-based or ownership-based
10. Error scenarios — minimum 5 per service, with error codes and user-facing messages
11. Edge cases — minimum 3 per service, with expected behavior
12. Performance expectations — response time targets, data volume assumptions
13. Dependencies — which other services this depends on and how
14. Success criteria — how to verify this service works correctly

**Screen Spec Minimum Fields (12):**
1. Screen name and purpose
2. URL route / navigation path
3. User story (who, what, why)
4. Data requirements (which API endpoints, what data shape)
5. Layout description (sections, hierarchy, responsive behavior)
6. Component inventory (every interactive element)
7. All UI states (loading, error, empty, data — with specific descriptions of each)
8. Form behavior (if applicable) — validation rules, submission flow, success/error feedback
9. User interactions — every clickable element and what it does
10. Accessibility requirements — keyboard flow, ARIA needs, screen reader behavior
11. Responsive breakpoints — what changes at mobile, tablet, desktop
12. Acceptance criteria — specific, testable conditions for "done"

### Step 3: Run the depth check on each field

A field is "filled" only if it contains project-specific, actionable content. Apply these tests:

| Test | Pass | Fail |
|------|------|------|
| **Substitution test** | Content could not apply to a different project | Content is so generic it could describe any CRUD app |
| **Build test** | A developer could implement from this field alone | A developer would need to ask "what do you mean by...?" |
| **Specificity test** | Contains exact values, ranges, or named conditions | Contains words like "appropriate," "relevant," "as needed" |
| **Enumeration test** | Lists concrete items (error codes, field names, states) | Says "various" or "multiple" or "etc." |

### Step 4: Flag and categorize issues

For each failing field, categorize the issue:

- **MISSING** — Field is completely absent
- **PLACEHOLDER** — Field contains template text (`{{...}}`, "TBD", "TODO")
- **SHALLOW** — Field exists but content is generic/non-specific
- **INCOMPLETE** — Field has some real content but is missing critical items

### Step 5: Generate the audit report

```markdown
## Spec Completeness Audit Report
**Date:** YYYY-MM-DD
**Scope:** [Step 4 / Step 6 / Step 8] specs
**Total specs audited:** X
**Passed:** X | **Failed:** X | **Pass rate:** X%

### Failed Specs
| Spec | Issue Count | Categories | Blocking? |
|------|------------|------------|-----------|
| trip-booking-service | 4 | 1 MISSING, 2 SHALLOW, 1 INCOMPLETE | YES |

### Issue Details
[Per-spec breakdown with specific fields and what's wrong]

### Remediation Required
[List of specific actions to fix each failing spec]
```

---

## Checklist

Use this checklist per spec:

### Service Spec Checklist
- [ ] All 14 required fields present and filled
- [ ] Business rules are specific and testable (not "validate input")
- [ ] Each business rule could be directly converted to a unit test assertion
- [ ] Error scenarios enumerate at least 5 failure modes with error codes
- [ ] Edge cases are identified with expected behavior (not just "handle edge cases")
- [ ] Validation rules specify exact constraints (character limits, regex patterns, range bounds)
- [ ] Entity fields include type, required/optional, default value, and constraints
- [ ] API endpoints include complete request and response schemas
- [ ] Authorization rules specify exact roles/permissions per operation
- [ ] Dependencies are named (not "other services") with interaction pattern

### Screen Spec Checklist
- [ ] All 12 required fields present and filled
- [ ] All 4 UI states described with specific content (not just "show loading spinner")
- [ ] Every interactive element has a defined behavior
- [ ] Form specs include per-field validation with exact rules
- [ ] Responsive behavior describes what changes, not just "responsive layout"
- [ ] Acceptance criteria are specific enough to write E2E tests from
- [ ] Data requirements map to specific API endpoints
- [ ] Accessibility section includes keyboard flow, not just "make it accessible"

---

## Common Failures

### 1. The "Validate Input" Trap
**What you see:** Business rule says "Validate user input before submission."
**What it should say:** "Email: RFC 5322 format, max 254 chars. Phone: E.164 format with country code, 7-15 digits. Name: 2-100 chars, letters/hyphens/apostrophes/spaces only, no consecutive spaces, no leading/trailing spaces. Address: street line 1 required (5-100 chars), line 2 optional, city required, state required (2-letter code for US), zip required (5 digits or 5+4 format for US)."
**Why it matters:** "Validate input" gives the developer zero implementation guidance. They will either guess wrong or come ask you — and neither outcome is a passing spec.

### 2. The Copy-Paste Spec
**What you see:** Two service specs with near-identical structure and suspiciously similar business rules, just with entity names swapped.
**Why it matters:** Each service has unique business logic. If `invoicing-service` and `billing-service` have the same business rules section, at least one of them is wrong. Specs generated by AI are especially prone to this when the AI is given multiple similar services to spec at once.

### 3. The "Error: Show Error Message" Pattern
**What you see:** Error scenario section says "If an error occurs, display an error message to the user."
**What it should say:** "Card declined (Stripe `card_declined`): Show 'Your card was declined. Please try a different payment method.' with a 'Try Another Card' button. Network timeout (>10s): Show 'We couldn't connect to the payment processor. Your card has not been charged.' with a 'Retry' button. Amount exceeds limit ($10,000/day): Show 'This transaction exceeds your daily limit of $10,000. Contact support to increase your limit.' with a 'Contact Support' link."

### 4. The Missing "Why"
**What you see:** "This service manages trips." Period. No context for who uses it, what business problem it solves, or why it exists as a separate service.
**What it should have:** "Trip management is the core revenue-generating workflow. Dispatchers create trips to assign loads to drivers. Drivers view their assigned trips for navigation and delivery confirmation. Billing pulls completed trips to generate invoices. The trip lifecycle (draft → dispatched → in-transit → delivered → invoiced) is the backbone of daily operations."

### 5. The Spec That Describes a Database Table
**What you see:** A service spec that is essentially a list of columns with types — and nothing else. No business rules, no error scenarios, no user context.
**Why it matters:** A database schema is not a spec. A spec describes behavior, not just structure. The schema tells you what data exists; the spec tells you what the system does with that data.

---

## Proof Artifact

The audit is proven by a completed audit report (format in Step 5 above) that shows:

| Artifact | What It Proves |
|----------|---------------|
| **Audit report with per-spec pass/fail** | Every spec was individually examined |
| **Issue details for failing specs** | Specific, actionable feedback was given (not just "needs work") |
| **Remediation completion evidence** | Failing specs were reworked and re-audited until passing |
| **100% pass rate on final audit** | All specs meet the completeness standard before proceeding |

A passing audit means: every spec was checked, every failing spec was fixed, and the final pass rate is 100%. Partial passes (e.g., "8 of 10 specs pass, we'll fix the other 2 later") are not accepted — all specs must pass before the next orchestrator step begins.
