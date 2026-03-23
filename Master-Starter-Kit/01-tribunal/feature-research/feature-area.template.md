# Feature Area: [NAME]

> **Date:** [YYYY-MM-DD]
> **Researched By:** [Agent name or human]
> **Cluster Size:** [N features in this cluster]
> **Complexity Estimate:** [Simple / Medium / Complex / Very Complex]

---

## Overview

[2-3 sentences describing what this feature area covers, why it matters, and which user types it primarily serves.]

## Features in This Cluster

| # | Feature | Priority (from votes) | Complexity | Status |
|---|---------|----------------------|-----------|--------|
| 1 | [Feature name] | [P0/P1/P2] | [S/M/L/XL] | [Must-Have / Should-Have / Could-Have] |
| 2 | [Feature] | [Priority] | [Complexity] | [Status] |
| 3 | [Feature] | [Priority] | [Complexity] | [Status] |
| 4 | [Feature] | [Priority] | [Complexity] | [Status] |
| 5 | [Feature] | [Priority] | [Complexity] | [Status] |

## The Core Workflow

Step-by-step user flow for the primary use case in this feature area. Include decision points and error branches.

```
1. [Trigger: What starts this workflow]
   Example: "Dispatcher receives a new trip request from a referral source"

2. [Step 2: First user action]
   Example: "Dispatcher opens the trip creation form"
   - Data entered: [fields]
   - Validation: [rules applied]
   - Error case: [what happens if validation fails]

3. [Step 3: Next action]
   Example: "System geocodes the pickup and dropoff addresses"
   - External service: [geocoding API]
   - Failure mode: [address not found — prompt for correction]

4. [Step 4: Decision point]
   Example: "Dispatcher assigns trip to a driver"
   - Option A: [Manual assignment from driver list]
   - Option B: [Auto-suggest based on proximity and availability]
   - Constraint: [Driver must be qualified for this vehicle type]

5. [Step 5: Confirmation / completion]
   Example: "Trip appears on dispatch board and driver receives notification"
   - Notification: [In-app + SMS + Push]
   - Status transition: [Pending → Assigned]

6. [Step 6: Edge case branch]
   Example: "If driver declines or doesn't respond within 10 minutes"
   - Fallback: [Auto-reassign or alert dispatcher]
```

### Alternative Flows

| Scenario | How It Differs from Core Flow | Frequency |
|----------|------------------------------|-----------|
| [Scenario 1: e.g., "Same-day urgent trip"] | [Steps that change] | [Daily / Weekly / Rare] |
| [Scenario 2: e.g., "Recurring trip (standing order)"] | [Steps that change] | [Frequency] |
| [Scenario 3: e.g., "Cancelled trip after assignment"] | [Steps that change] | [Frequency] |

## Personas Who Use This

| Persona | Role in This Feature | Frequency | Primary Action |
|---------|---------------------|-----------|----------------|
| [Persona A — e.g., Maria Dispatcher] | [Creator / Primary user] | [40+ times/day] | [Creates and assigns trips] |
| [Persona B — e.g., James Driver] | [Recipient / Secondary user] | [8-12 times/day] | [Views and completes assigned trips] |
| [Persona C — e.g., Sarah Billing] | [Consumer of output] | [Weekly] | [Uses completed trip data for invoicing] |

## Current Solutions

How do people accomplish this workflow today, without our product?

| Method | Who Uses It | Pros | Cons |
|--------|------------|------|------|
| [Spreadsheets (Google Sheets / Excel)] | [Small operators] | [Free, familiar, flexible] | [No real-time, error-prone, no mobile] |
| [Competitor A] | [Mid-size operators] | [Specific strengths] | [Specific weaknesses] |
| [Paper / Whiteboards] | [Legacy operators] | [Zero learning curve] | [Not scalable, no audit trail] |
| [Custom-built internal tool] | [Large operators] | [Tailored to workflow] | [Expensive to maintain, fragile] |

## Must-Have Features (Table Stakes)

These are features that every product in this space has. Users expect them by default. Not having these means not being taken seriously.

| Feature | Why It's Table Stakes | Minimum Viable Implementation | Competitor Coverage |
|---------|----------------------|------------------------------|-------------------|
| [Feature 1] | [Every competitor has this; users won't consider us without it] | [Simplest version that satisfies the requirement] | [5/5 competitors] |
| [Feature 2] | [Reason] | [MVP version] | [4/5 competitors] |
| [Feature 3] | [Reason] | [MVP version] | [5/5 competitors] |

## Differentiator Features

Features that would make us better than competitors. Not all competitors have these, or they implement them poorly.

| Feature | What Makes It a Differentiator | Competitors Who Have It | Our Advantage |
|---------|-------------------------------|------------------------|---------------|
| [Feature 1] | [Why doing this well matters. Example: "Address validation at entry time prevents the #1 source of dispatch errors"] | [1/5 — and their implementation is basic] | [We can do it with real-time geocoding + historical data matching] |
| [Feature 2] | [Differentiator reason] | [Coverage] | [Our approach] |
| [Feature 3] | [Differentiator reason] | [Coverage] | [Our approach] |

## Data Requirements

### Tables / Entities

| Entity | Key Fields | Relationships | Estimated Row Count (Year 1) |
|--------|-----------|--------------|------------------------------|
| [Entity 1 — e.g., Trip] | [id, status, pickup_address, dropoff_address, scheduled_time, ...] | [belongs to Driver, belongs to Patient, has many StatusUpdates] | [10,000-50,000] |
| [Entity 2] | [Key fields] | [Relationships] | [Estimate] |
| [Entity 3] | [Key fields] | [Relationships] | [Estimate] |

### Complex Queries

| Query | Purpose | Complexity | Performance Concern |
|-------|---------|-----------|-------------------|
| [e.g., "Find available drivers within 10 miles of pickup at scheduled time"] | [Trip assignment] | [High — spatial + temporal + availability] | [Needs spatial index, could be slow with 500+ drivers] |
| [Query 2] | [Purpose] | [Complexity] | [Concern] |

### Data Lifecycle

```
[Entity] Lifecycle:
  Created → [Status 1] → [Status 2] → ... → [Final Status] → Archived

Example for Trip:
  Draft → Pending → Assigned → En Route → At Pickup → In Transit →
  At Dropoff → Completed → Billed → Archived

  Branches:
  - Any status → Cancelled (with reason)
  - Assigned → No-Show (patient not at pickup)
  - En Route → Breakdown (vehicle issue → reassign)
```

## Integration Points

### Internal (Other Feature Areas)

| Feature Area | Integration | Data Flow |
|-------------|-------------|-----------|
| [e.g., Billing] | [Completed trips feed invoice generation] | [Trip → Invoice line item] |
| [e.g., Fleet Management] | [Vehicle availability affects trip assignment] | [Vehicle status → assignment constraint] |
| [e.g., Reporting] | [Trip data feeds operational reports] | [Trip aggregations → dashboard KPIs] |

### External (Third-Party Services)

| Service | Purpose | API Type | Cost | Failure Mode |
|---------|---------|----------|------|-------------|
| [e.g., Google Maps Geocoding] | [Address validation + geocoding] | [REST API] | [$5 per 1,000 requests] | [Fallback to manual entry if API down] |
| [e.g., Twilio SMS] | [Driver notifications] | [REST API] | [$0.0079 per SMS] | [Queue messages and retry; fallback to in-app only] |
| [Service 3] | [Purpose] | [Type] | [Cost] | [Failure mode] |

## Compliance Concerns

| Requirement | Regulation | Impact on This Feature | Implementation Need |
|-------------|-----------|----------------------|-------------------|
| [e.g., Patient data privacy] | [HIPAA] | [Patient names/addresses in trip data are PHI] | [Encryption at rest, role-based access, audit logging] |
| [e.g., Driver background checks] | [DOT/State regulations] | [Must verify driver certifications before assignment] | [Certification tracking, expiry alerts, assignment blocking] |
| [e.g., Record retention] | [State/Federal] | [Trip records must be kept for N years] | [Soft-delete + archival policy, not hard delete] |
| [Requirement] | [Regulation] | [Impact] | [Need] |

**Compliance checklist for this feature area:**
- [ ] Data encryption at rest and in transit
- [ ] Role-based access control (who can see/edit what)
- [ ] Audit logging (who did what, when)
- [ ] Data retention policy defined
- [ ] PII/PHI fields identified and protected
- [ ] Consent requirements documented (if applicable)
- [ ] Export/deletion requirements documented (GDPR right to erasure, if applicable)

## Technical Complexity Assessment

| Dimension | Rating | Justification |
|-----------|--------|---------------|
| **Data Model** | [Simple / Medium / Complex] | [Why: e.g., "5 tables with 3 many-to-many relationships and a status machine"] |
| **UI Complexity** | [Simple / Medium / Complex] | [Why: e.g., "Requires real-time map, drag-drop timeline, and split-pane layout"] |
| **Business Logic** | [Simple / Medium / Complex] | [Why: e.g., "Assignment algorithm considers proximity, availability, vehicle type, and certifications"] |
| **Integrations** | [None / Few / Many] | [Why: e.g., "Geocoding API + SMS API + real-time WebSocket updates"] |
| **Compliance** | [None / Light / Heavy] | [Why: e.g., "HIPAA — PHI in trip data requires encryption, access control, audit logging"] |

**Overall Complexity:** [Simple / Medium / Complex / Very Complex]

**Justification:** [1-2 sentences explaining the overall rating. Example: "Complex — the data model is straightforward but the real-time UI (map + timeline + notifications) and the assignment algorithm with multiple constraints make this a significant engineering effort."]

**Estimated Build Time:** [X-Y weeks for a single developer, including testing]

---

## Open Questions

Questions that need answers before implementation. These should be raised in Tribunal Round 2 (Feasibility).

1. [Question about scope. Example: "Should recurring trips be auto-generated weekly or should they use a template system where the dispatcher confirms each week?"]
2. [Question about integration. Example: "Which geocoding provider? Google Maps ($5/1K) vs. Mapbox ($2.50/1K) vs. self-hosted Nominatim (free but less accurate)?"]
3. [Question about compliance. Example: "Do we need to support HIPAA Business Associate Agreements (BAAs) with subprocessors?"]
4. [Question about edge cases. Example: "What happens to a trip if the assigned driver's vehicle fails inspection mid-day? Auto-reassign or alert dispatcher?"]

---

*This document feeds into the gap-matrix.template.md and proceedings/round-2-feasibility.template.md*
