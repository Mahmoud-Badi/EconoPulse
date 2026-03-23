# Assumption Registry: {{PROJECT_NAME}}

> **Purpose:** Track every assumption the project rests on, score its risk, define how to test it, and plan what to do if it's wrong. Assumptions are the invisible foundation of every product — when they collapse, the product collapses. This registry makes them visible.
> **Owner:** {{PRODUCT_LEAD_NAME}}
> **Created:** {{DATE}}
> **Last Updated:** {{DATE}}
> **Review Schedule:** Re-evaluate at every phase gate (Phase 1 → 2, Phase 2 → 3, etc.)

---

## Review Protocol

### When to Review
- **Phase gate:** Before starting any new phase, review all ACTIVE assumptions. Mark any that have been validated or invalidated during the previous phase.
- **Discovery delta:** When a discovery delta (see `discovery-delta.template.md`) is filed, check if it invalidates any assumption here.
- **Sprint retrospective:** Quick scan — did anything we learned this sprint change our assumptions?
- **User testing:** After every user testing session, review assumptions in the USER_BEHAVIOR category.

### Priority Rule
Test the highest-risk assumptions first. Risk = Confidence (inverse) x Impact If Wrong.

| Confidence | Impact If Wrong | Risk Priority |
|-----------|----------------|---------------|
| LOW | HIGH | TEST IMMEDIATELY — before building anything that depends on it |
| LOW | MEDIUM | Test within current phase |
| MEDIUM | HIGH | Test within current phase |
| LOW | LOW | Test when convenient |
| MEDIUM | MEDIUM | Monitor — test at next phase gate |
| HIGH | any | Monitor only — likely validated |

---

## Integration with Tribunal

Each tribunal persona should review assumptions from their perspective:

- **End User persona:** Challenge USER_BEHAVIOR assumptions. "Would you actually do this?"
- **Business stakeholder persona:** Challenge MARKET and BUSINESS assumptions. "Does this revenue model work?"
- **Technical lead persona:** Challenge TECHNICAL assumptions. "Can this scale? Is this feasible?"
- **Compliance/legal persona:** Challenge REGULATORY assumptions. "Is this actually required? Are we missing requirements?"

---

## Assumption Entries

---

### ASSUME-{{NNN}}: {{ASSUMPTION_STATEMENT}}

**Category:** {{USER_BEHAVIOR | MARKET | TECHNICAL | BUSINESS | REGULATORY}}
**Confidence:** {{HIGH | MEDIUM | LOW}}
**Source:** {{WHERE_THIS_ASSUMPTION_CAME_FROM — INTAKE_INTERVIEW | TRIBUNAL | COMPETITOR_RESEARCH | TEAM_GUESS}}

**Evidence For:**
- {{SUPPORTING_EVIDENCE}}

**Evidence Against:**
- {{CONTRADICTING_EVIDENCE_OR_NONE}}

**Test Criteria:**
{{SPECIFIC_MEASURABLE_WAY_TO_VALIDATE_THIS_ASSUMPTION}}

**Risk If Wrong:**
{{CONCRETE_IMPACT_ON_THE_PRODUCT_IF_THIS_ASSUMPTION_IS_FALSE}}

**Mitigation:**
{{WHAT_TO_DO_IF_THIS_ASSUMPTION_TURNS_OUT_TO_BE_WRONG}}

**Review Date:** {{NEXT_REVIEW_DATE_OR_PHASE_GATE}}
**Status:** {{ACTIVE | VALIDATED | INVALIDATED | REPLACED_BY_ASSUME_NNN}}

---

## Examples — Filled-In Assumptions

---

### ASSUME-001: Dispatchers will adopt a digital tool to replace their spreadsheet workflow

**Category:** USER_BEHAVIOR
**Confidence:** MEDIUM
**Source:** Intake interview — owner said "dispatchers are tired of spreadsheets"

**Evidence For:**
- Owner (who is also a dispatcher) reports frustration with Excel-based scheduling
- 3 competitors exist in this space, suggesting market demand
- Dispatchers are already using computers (not paper) — lower adoption barrier

**Evidence Against:**
- Only the OWNER expressed frustration — we haven't spoken to other dispatchers
- Dispatchers have used spreadsheets for 8 years — habit inertia is strong
- Previous software adoption attempt failed (owner mentioned this in passing during intake)

**Test Criteria:**
Interview 2-3 dispatchers who are NOT the owner. Ask: "If a tool replaced your spreadsheet tomorrow, what would it need to do on day one for you to not go back to Excel?" If they can't answer, or say "nothing could replace my spreadsheet," this assumption is at risk.

**Risk If Wrong:**
Product is built for dispatchers who won't use it. Core value proposition fails. The entire trip assignment module (est. 40% of Phase 1 scope) is wasted effort.

**Mitigation:**
If dispatchers resist digital adoption: (1) Build an Excel import/export bridge so they can work in familiar tools while data lives in the system, (2) Focus on the owner as primary user and reduce multi-dispatcher features, (3) Pivot to a management-only dashboard that consumes spreadsheet data.

**Review Date:** Before Phase 1 starts — validate with actual dispatcher interviews
**Status:** ACTIVE

---

### ASSUME-002: Users will pay $50/vehicle/month for fleet management SaaS

**Category:** BUSINESS
**Confidence:** LOW
**Source:** Owner's estimate during intake. No pricing research conducted.

**Evidence For:**
- Competitor A charges $45/vehicle/month
- Competitor B charges $60/vehicle/month for a comparable feature set
- Owner said "I'd pay $50" — but he's the builder, not the buyer

**Evidence Against:**
- No actual customers have been asked about pricing
- Owner's fleet has 15 vehicles ($750/month) — this feels reasonable. A fleet with 200 vehicles ($10,000/month) may not agree.
- Competitor C offers a freemium model that could undercut

**Test Criteria:**
Create a landing page with pricing tier ($35/$50/$75 per vehicle). Run $500 in Google Ads targeting fleet managers. Measure: (1) click-through to pricing page, (2) waitlist signups with fleet size, (3) price tier selection. If 80%+ select the $35 tier, $50 is too high.

**Risk If Wrong:**
Revenue projections are based on $50/vehicle. If actual willingness-to-pay is $25/vehicle, we need 2x the customer base to hit targets, which changes marketing budget, sales strategy, and runway calculations.

**Mitigation:**
If $50 is too high: (1) Offer annual discount (20% off = $40/vehicle effective), (2) Add a "lite" tier at $25/vehicle with reduced features, (3) Switch to flat-rate pricing with vehicle tiers (1-20, 21-50, 51-200) — eliminates sticker shock for large fleets.

**Review Date:** Before spending money on development — validate pricing in first 2 weeks
**Status:** ACTIVE

---

### ASSUME-003: The existing database schema can be migrated to the new system without data loss

**Category:** TECHNICAL
**Confidence:** MEDIUM
**Source:** Developer assessed the existing MySQL database during technical discovery

**Evidence For:**
- Database schema is relatively clean — normalized, no binary blobs
- Data volume is manageable (~500K rows across all tables)
- Column types map cleanly to PostgreSQL equivalents

**Evidence Against:**
- 47 columns have NULL values where the app expects empty strings — migration script must handle this
- 3 tables have no foreign keys (data integrity is enforced only in application code) — orphaned records likely exist
- Date formats are inconsistent (some `YYYY-MM-DD`, some `MM/DD/YYYY` strings)

**Test Criteria:**
Run a test migration on a copy of production data. Validate: (1) row counts match source, (2) no truncated text fields, (3) all foreign key relationships hold, (4) date fields parse correctly, (5) application can read migrated data without errors.

**Risk If Wrong:**
Data loss during migration destroys user trust on day one. If historical trip records are corrupted, billing disputes become unresolvable. Worst case: users reject the new system and demand rollback.

**Mitigation:**
If migration has issues: (1) Run old and new systems in parallel for 30 days, (2) Build a reconciliation report that compares old DB vs. new DB nightly, (3) Keep old system read-only as reference for 90 days post-migration.

**Review Date:** Phase 1, Task 1.1 (database setup) — run test migration before writing any application code
**Status:** ACTIVE

---

### ASSUME-004: Push notifications are sufficient for driver trip alerts (no SMS needed)

**Category:** USER_BEHAVIOR
**Confidence:** MEDIUM
**Source:** Technical team assumption — "everyone has push notifications"

**Evidence For:**
- All drivers have smartphones (company-provided or BYOD)
- Push notifications are free; SMS costs $0.01-0.05 per message
- Competitor apps use push notifications

**Evidence Against:**
- Drivers may disable push notifications (common behavior — 40-60% of users disable them)
- Drivers in rural areas may have spotty data but SMS still works
- Current system uses phone calls to notify drivers — SMS would be closer to existing behavior

**Test Criteria:**
In Phase 1 beta: measure push notification delivery rate and response time. If <80% of push notifications result in driver acknowledgment within 5 minutes, push alone is insufficient.

**Risk If Wrong:**
Drivers miss trip assignments. Trips go unserviced. Clients are stranded. This is the highest-consequence failure mode in the entire system.

**Mitigation:**
If push is insufficient: (1) Add SMS fallback — if push not acknowledged in 3 minutes, send SMS, (2) Add escalation — if SMS not acknowledged in 5 minutes, alert dispatcher, (3) Budget $200-500/month for SMS via Twilio.

**Review Date:** Phase 1 beta testing — within first week of driver usage
**Status:** ACTIVE

---

### ASSUME-005: HIPAA compliance is not required for this NEMT platform

**Category:** REGULATORY
**Confidence:** LOW
**Source:** Owner said "we don't handle medical records" during intake

**Evidence For:**
- The platform manages transportation logistics, not medical treatment
- Many NEMT companies operate without HIPAA compliance
- The system doesn't store diagnoses, treatment plans, or medical records

**Evidence Against:**
- NEMT trip data includes: patient name, pickup/dropoff (often medical facilities), trip purpose (dialysis, chemotherapy), mobility equipment needs — this MAY constitute Protected Health Information (PHI)
- Some Medicaid contracts REQUIRE HIPAA compliance from all subcontractors, including transportation providers
- HHS has issued guidance that transportation providers handling PHI are covered entities

**Test Criteria:**
Consult with a healthcare compliance attorney (budget: $500-1000 for a 1-hour consultation). Ask: "Given that we store patient names, medical facility addresses, trip purposes, and mobility needs, are we a HIPAA-covered entity or business associate?"

**Risk If Wrong:**
HIPAA violations carry fines of $100-$50,000 per violation, up to $1.5M annually. A data breach affecting patient transportation records could trigger enforcement. Retroactively adding HIPAA compliance (encryption at rest, audit logging, BAAs, access controls, breach notification procedures) costs 4-8 weeks of rework.

**Mitigation:**
If HIPAA IS required: (1) Encrypt all data at rest and in transit (may already be done), (2) Add audit logging for all data access, (3) Implement role-based access controls with minimum necessary standard, (4) Sign BAAs with all infrastructure providers (hosting, database, email), (5) Create breach notification procedures. Build this into Phase 1 architecture — retrofitting is far more expensive.

**Review Date:** BEFORE Phase 1 starts — this is a blocking question
**Status:** ACTIVE

---

### ASSUME-{{NNN}}: {{ASSUMPTION_STATEMENT}}

**Category:** {{USER_BEHAVIOR | MARKET | TECHNICAL | BUSINESS | REGULATORY}}
**Confidence:** {{HIGH | MEDIUM | LOW}}
**Source:** {{SOURCE}}

**Evidence For:**
- {{SUPPORTING_EVIDENCE}}

**Evidence Against:**
- {{CONTRADICTING_EVIDENCE}}

**Test Criteria:**
{{HOW_TO_VALIDATE}}

**Risk If Wrong:**
{{IMPACT}}

**Mitigation:**
{{WHAT_TO_DO}}

**Review Date:** {{DATE_OR_PHASE_GATE}}
**Status:** {{ACTIVE | VALIDATED | INVALIDATED}}
