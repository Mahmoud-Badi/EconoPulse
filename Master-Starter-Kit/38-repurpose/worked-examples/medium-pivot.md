# Worked Example: Medium Pivot (Vertical Wrapper)

> **Scenario:** A generic CRM → Healthcare Patient Relationship Management (PRM)

---

## What Makes This a Medium Pivot

- Same core architecture (contacts, communications, pipelines, tasks)
- Significant data model extensions (medical records, compliance fields, consent tracking)
- New domain-specific features (appointment scheduling, HIPAA compliance, patient portal)
- New regulatory requirements (HIPAA, state health regulations)
- Reuse: **50-70%**

---

## Feature Inheritance Map

### Direct Transfer (Reuse >80%)

| CRM Feature | PRM Equivalent | Changes Needed |
|-------------|---------------|----------------|
| Contact management | Patient management | Add medical fields, rename labels |
| Email campaigns | Patient communications | Add consent checks, restrict PHI in emails |
| Task management | Care team tasks | Add clinical task types |
| Notes & activity log | Patient encounter notes | Add structured clinical note templates |
| File attachments | Document management | Add HIPAA-compliant storage, audit logging |
| Search & filtering | Patient lookup | Add medical ID search, DOB search |
| Team management | Practice/clinic management | Add provider credentials, NPI numbers |
| Reporting engine | Clinical & business reporting | Add HEDIS measures, patient outcome reports |

### Requires Adaptation (Reuse 30-80%)

| CRM Feature | PRM Requirement | Adaptation |
|-------------|----------------|-----------|
| Sales pipeline | Care pathway | Different stages (Intake → Assessment → Treatment → Follow-up → Discharge) |
| Deal tracking | Treatment plan tracking | Medical-specific fields (diagnosis codes, procedure codes, insurance) |
| Lead scoring | Risk stratification | Clinical risk algorithms instead of sales probability |
| Customer segments | Patient cohorts | Medical criteria (diagnosis, age, risk level) instead of firmographic |
| Workflow automation | Clinical workflows | Must include compliance checks, consent verification at each step |
| API integrations | Health system integrations | HL7 FHIR, EHR integration, pharmacy systems, lab results |

### Must Build New

| Feature | Why CRM Doesn't Have It | Effort | Priority |
|---------|------------------------|--------|----------|
| Appointment scheduling | CRM has "meetings" but not medical scheduling with provider availability, room booking, insurance verification | XL | P0 |
| Patient portal | CRM has no self-service portal concept | L | P0 |
| HIPAA compliance layer | Audit logging, encryption, access controls, BAA management | XL | P0 |
| Insurance/billing integration | CRM has payment tracking but not insurance claims, EOBs, eligibility checks | XL | P1 |
| Clinical forms engine | CRM forms don't support medical intake forms, consent forms, assessment tools | L | P1 |
| Prescription/medication tracking | No CRM equivalent | M | P2 |
| Lab result integration | No CRM equivalent | M | P2 |
| Telemedicine integration | CRM has video calls but not HIPAA-compliant telehealth | M | P2 |

---

## Data Model Changes

### Extended Entities

```
Contact → Patient
  + date_of_birth (required)
  + medical_record_number (unique)
  + insurance_provider_id (FK)
  + insurance_policy_number
  + primary_care_provider_id (FK to Provider)
  + emergency_contact_name
  + emergency_contact_phone
  + preferred_pharmacy_id
  + consent_status (enum: granted, revoked, expired)
  + consent_date
  + hipaa_authorization_signed (boolean)
  + last_visit_date
  + risk_score (computed)

Deal → Treatment Plan
  + diagnosis_codes (ICD-10 array)
  + procedure_codes (CPT array)
  + referring_provider
  + authorization_number
  + authorization_expiry
  + treatment_start_date
  + treatment_end_date
  + outcome_status (enum)

Activity → Encounter
  + encounter_type (office_visit, telehealth, phone, message)
  + provider_id (FK)
  + clinical_notes (encrypted text)
  + vitals (JSON: BP, HR, temp, weight, height)
  + diagnosis_codes (ICD-10 array)
  + follow_up_date
  + referral_id (FK, nullable)
```

### New Entities

```
Provider (not in CRM)
  + npi_number (unique, validated)
  + credentials (MD, DO, NP, PA, etc.)
  + specialty
  + license_state
  + license_expiry
  + accepting_new_patients (boolean)

Appointment (not in CRM)
  + patient_id (FK)
  + provider_id (FK)
  + appointment_type
  + start_time, end_time
  + status (scheduled, checked_in, in_progress, completed, no_show, cancelled)
  + room_id (nullable)
  + insurance_verified (boolean)
  + copay_collected (boolean)

AuditLog (HIPAA requirement)
  + user_id
  + action (view, create, update, delete, export, print)
  + resource_type
  + resource_id
  + phi_accessed (boolean)
  + ip_address
  + timestamp
  + details (JSON)
```

---

## Compliance Implementation

### HIPAA Requirements

| Requirement | Implementation | CRM Reuse |
|------------|---------------|-----------|
| Encryption at rest | Database-level encryption (already have) + field-level for PHI | 60% — need field-level |
| Encryption in transit | TLS 1.3 (already have) | 100% |
| Access controls | Role-based (already have) + minimum necessary principle + break-glass | 70% — need MNP layer |
| Audit logging | Activity log (already have) + HIPAA-specific audit trail | 40% — need dedicated audit |
| BAA management | New feature — track Business Associate Agreements | 0% — new build |
| Patient rights | New feature — data access, amendment, restriction requests | 0% — new build |
| Breach notification | New workflow — 60-day notification requirement | 0% — new build |

### Compliance Cost

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| HIPAA-compliant hosting (AWS GovCloud or equivalent) | +$500-2000/mo | Cannot use standard shared hosting |
| Compliance officer time (fractional) | +$1000-3000/mo | Required for ongoing compliance |
| Annual HIPAA risk assessment | ~$5000-15000/yr | Third-party assessment |
| Cyber insurance (with HIPAA rider) | +$200-500/mo | Required |
| BAA with all vendors | $0 (contract term) | Must negotiate with every vendor |

---

## Implementation Plan

### Phase 1: Compliance Foundation (3-4 weeks)
- HIPAA-compliant infrastructure setup
- Audit logging system
- Field-level encryption for PHI
- Access control refinements (minimum necessary principle)
- BAA template and vendor inventory

### Phase 2: Data Model Extension (2-3 weeks)
- Patient entity (extend Contact)
- Provider entity (new)
- Treatment Plan (extend Deal)
- Encounter (extend Activity)
- Database migrations with data preservation

### Phase 3: Core Clinical Features (4-6 weeks)
- Appointment scheduling with provider availability
- Patient intake forms and consent management
- Clinical note templates
- Care pathway (adapted pipeline)
- Patient portal (self-service)

### Phase 4: Integrations (3-4 weeks)
- Insurance eligibility verification API
- HL7 FHIR interface (EHR data exchange)
- E-prescribing integration
- Lab result import

### Phase 5: Reporting & Compliance (2-3 weeks)
- Clinical outcome reports
- HEDIS quality measures
- HIPAA compliance dashboard
- Patient satisfaction surveys

**Total estimated effort: 14-20 weeks**
**Reuse percentage: ~55%**

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fork or configure? | Fork | Too many structural differences for feature flags |
| Separate databases? | Yes | HIPAA requires isolation; different schema needs |
| Shared services? | Auth + notification (with PHI filtering) | Minimize surface area for compliance |
| Pricing change? | Higher price point ($99-299/provider/mo vs $29-79/user/mo) | Healthcare willingness to pay is higher; compliance costs must be covered |

---

## Pitfalls to Watch

1. **HIPAA is not optional** — a single PHI breach can cost $100K-$1.5M per violation. Budget compliance work as P0, not P2.
2. **Healthcare sales cycles are 6-18 months** — enterprise healthcare buying involves security reviews, compliance audits, and committee decisions. Plan runway accordingly.
3. **Clinical workflows are NOT business workflows with different labels** — a doctor's mental model is fundamentally different from a salesperson's. Spend time with actual clinicians.
4. **Insurance integration is a project unto itself** — eligibility verification, claims submission, and EOB processing each have their own complexity. Consider a clearinghouse partner (e.g., Availity, Change Healthcare) rather than building direct.
5. **State regulations vary** — HIPAA is federal, but state laws can be stricter (California CMIA, New York SHIELD Act). Research per-state requirements for your launch states.
