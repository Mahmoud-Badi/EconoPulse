# Data Privacy Impact Assessment (DPIA)

> Privacy impact assessment for {{PROJECT_NAME}}. Required when processing sensitive personal data at scale (GDPR Article 35) or handling protected health information (HIPAA). Review and update when data flows change.

---

## Project

- **Name:** {{PROJECT_NAME}}
- **Description:** {{PROJECT_DESCRIPTION}}
- **Data Controller:** {{PROJECT_OWNER}} / {{COMPANY_NAME}}
- **DPO Contact:** <!-- Data Protection Officer email, if applicable -->
- **Assessment Date:** YYYY-MM-DD
- **Next Review:** <!-- +12 months or after significant system changes -->
- **Regulatory Scope:** {{AUDIT_REQUIREMENTS}} <!-- e.g., "gdpr", "hipaa", "gdpr,hipaa", "ccpa" -->

---

## 1. Data Flow Mapping

| # | Data Category | Data Elements | Entry Point | Processing | Storage | Transmission | Retention | Deletion Method |
|---|--------------|---------------|-------------|------------|---------|-------------|-----------|-----------------|
| 1 | User Identity | Name, email, password hash | Registration form | Auth service | {{DATABASE}} (encrypted at rest) | TLS 1.3 | Account lifetime + 30 days | Hard delete on account deletion |
| 2 | <!-- e.g., "Payment" --> | <!-- e.g., "Card token, billing address" --> | <!-- e.g., "Checkout flow" --> | <!-- e.g., "Stripe API — no raw card data stored" --> | <!-- e.g., "Stripe (PCI DSS compliant)" --> | <!-- e.g., "TLS to Stripe" --> | <!-- e.g., "Per Stripe retention policy" --> | <!-- e.g., "Stripe handles deletion" --> |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
| 5 | | | | | | | | |

**Data flow diagram:** <!-- Link to visual diagram or describe the flow: User -> Frontend -> API -> Database, User -> Frontend -> Third-Party API -->

---

## 2. Risk Assessment

| # | Data Flow | Risk Description | Likelihood (1-5) | Impact (1-5) | Risk Level | Mitigation | Residual Risk |
|---|-----------|-----------------|-------------------|--------------|------------|------------|---------------|
| 1 | User registration | Credential stuffing / brute force | 4 | 4 | High | Rate limiting, bcrypt hashing, account lockout | Low |
| 2 | Data at rest | Database breach exposes PII | 2 | 5 | High | Encryption at rest (AES-256), minimal data collection | Medium |
| 3 | Third-party transmission | Vendor data breach | 2 | 4 | Medium | Vendor due diligence, BAA/DPA in place, minimal data shared | Medium |
| 4 | | | | | | | |

**Risk Level Formula:** `Likelihood x Impact` -> 1-8: Low, 9-15: Medium, 16-25: High

---

## 3. Necessity Assessment

For each data category collected, justify why it is necessary.

| Data Category | Purpose | Necessary? | Justification | Could We Collect Less? |
|--------------|---------|------------|---------------|----------------------|
| User Identity | Account creation, authentication | Yes | Cannot provide the service without identifying the user | Could allow pseudonymous accounts for non-paying users |
| | | | | |
| | | | | |

**Principle:** Collect the minimum data required for the stated purpose. If you cannot justify a data point, do not collect it.

---

## 4. Proportionality Assessment

| Processing Activity | Is It Proportionate? | Justification | Less Invasive Alternative Considered? |
|---------------------|---------------------|---------------|--------------------------------------|
| <!-- e.g., "Storing full address" --> | <!-- Yes/No --> | <!-- e.g., "Required for shipping physical goods" --> | <!-- e.g., "Considered zip-code-only but need full address for delivery" --> |
| <!-- e.g., "Analytics tracking" --> | <!-- Yes/No --> | <!-- e.g., "Product improvement" --> | <!-- e.g., "Using privacy-respecting analytics (Plausible) instead of Google Analytics" --> |
| | | | |

---

## 5. Data Subject Rights

How does {{PROJECT_NAME}} support each right?

| Right | GDPR Article | Supported? | Implementation | Response Time |
|-------|-------------|------------|----------------|---------------|
| Right of Access | Art. 15 | <!-- Yes/Partial/No --> | <!-- e.g., "Settings > Download My Data — exports JSON" --> | <!-- e.g., "Automated, immediate" --> |
| Right to Rectification | Art. 16 | <!-- Yes/Partial/No --> | <!-- e.g., "Users can edit profile fields directly" --> | |
| Right to Erasure | Art. 17 | <!-- Yes/Partial/No --> | <!-- e.g., "Settings > Delete Account — hard deletes after 30-day grace period" --> | |
| Right to Portability | Art. 20 | <!-- Yes/Partial/No --> | <!-- e.g., "Export as JSON/CSV from settings" --> | |
| Right to Restrict Processing | Art. 18 | <!-- Yes/Partial/No --> | <!-- e.g., "Account suspension feature" --> | |
| Right to Object | Art. 21 | <!-- Yes/Partial/No --> | <!-- e.g., "Opt-out of marketing in notification settings" --> | |

---

## 6. Third-Party Processors

| Vendor | Data Shared | Purpose | BAA/DPA Signed? | SOC 2 / ISO 27001? | Data Location | Sub-Processors |
|--------|------------|---------|-----------------|--------------------|--------------|--------------------|
| {{HOSTING_PROVIDER}} | Application data | Hosting | <!-- Yes/No --> | <!-- Yes/No --> | <!-- e.g., "US-East, EU-West" --> | <!-- List or link --> |
| {{DATABASE}} provider | All stored data | Database hosting | <!-- Yes/No --> | <!-- Yes/No --> | | |
| <!-- e.g., "Stripe" --> | Payment tokens | Payment processing | <!-- Yes/No --> | <!-- Yes/No --> | | |
| <!-- e.g., "Resend" --> | Email addresses, names | Transactional email | <!-- Yes/No --> | <!-- Yes/No --> | | |
| | | | | | | |

---

## 7. Breach Response

### Response Timeline

| Step | Action | Responsible | Deadline |
|------|--------|-------------|----------|
| 1 | Contain — isolate affected systems | Engineering lead | Immediately |
| 2 | Assess — scope, data affected, root cause | Security team | Within 4 hours |
| 3 | Notify authorities (GDPR: supervisory authority) | DPO / Legal | Within 72 hours |
| 4 | Notify affected users (if high risk) | DPO / Legal | Without undue delay |
| 5 | Remediate — fix, patch, rotate credentials | Engineering | Based on severity |
| 6 | Post-incident review | All | Within 2 weeks |

---

<!-- IF {{AUDIT_REQUIREMENTS}} includes "hipaa" -->

## HIPAA-Specific Requirements

### PHI Inventory

| PHI Element | Where Stored | Encrypted? | Access Controls | Minimum Necessary? |
|-------------|-------------|------------|-----------------|---------------------|
| <!-- e.g., "Patient name" --> | {{DATABASE}} | Yes (AES-256) | Role-based, audit logged | Yes — only shown to authorized providers |
| <!-- e.g., "Diagnosis codes" --> | | | | |
| | | | | |

### HIPAA Safeguards Checklist

| Safeguard | Type | Status | Implementation |
|-----------|------|--------|----------------|
| Access controls | Technical | <!-- Done/In Progress/Not Started --> | <!-- e.g., "RBAC with role-per-user, enforced at API layer" --> |
| Audit logging | Technical | | <!-- e.g., "All PHI access logged with user, timestamp, action, record ID" --> |
| Encryption at rest | Technical | | <!-- e.g., "AES-256 via database-level encryption" --> |
| Encryption in transit | Technical | | <!-- e.g., "TLS 1.3 enforced, HSTS enabled" --> |
| Integrity controls | Technical | | <!-- e.g., "Checksums on data exports, immutable audit log" --> |
| Workforce training | Administrative | | <!-- e.g., "Annual HIPAA training for all team members" --> |
| Business Associate Agreements | Administrative | | <!-- e.g., "BAAs signed with all vendors handling PHI — see section 6" --> |
| Contingency plan | Administrative | | <!-- e.g., "Automated backups, tested disaster recovery runbook" --> |
| Facility access controls | Physical | | <!-- e.g., "Cloud-hosted, no physical infrastructure managed by team" --> |

### BAA Status

| Vendor | BAA Required? | BAA Signed? | Expiry | Notes |
|--------|--------------|------------|--------|-------|
| {{HOSTING_PROVIDER}} | Yes | <!-- Yes/No --> | | |
| | | | | |

<!-- ENDIF -->

---

## Assessment Summary

| Area | Status | Key Finding |
|------|--------|-------------|
| Data Minimization | <!-- Green/Yellow/Red --> | <!-- e.g., "Collecting only essential PII" --> |
| Security Controls | <!-- Green/Yellow/Red --> | <!-- e.g., "Encryption at rest and in transit implemented" --> |
| Subject Rights | <!-- Green/Yellow/Red --> | <!-- e.g., "Access and deletion implemented; portability pending" --> |
| Third-Party Risk | <!-- Green/Yellow/Red --> | <!-- e.g., "All vendors have DPAs; 2 pending SOC 2 verification" --> |
| Breach Preparedness | <!-- Green/Yellow/Red --> | <!-- e.g., "Response plan documented; needs tabletop exercise" --> |

**Overall Assessment:** <!-- Approved / Approved with conditions / Requires remediation -->
**Approved By:** <!-- DPO or project lead -->
**Date:** YYYY-MM-DD
