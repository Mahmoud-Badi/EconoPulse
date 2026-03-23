# Data Processing Agreement (DPA) — {{PROJECT_NAME}}

> **Last Updated:** {{CURRENT_DATE}}
> **When to use:** Required for B2B SaaS where you process personal data on behalf of business customers, especially if customers have EU end-users (GDPR Article 28).

> **IMPORTANT:** This template provides structure. A DPA is a legally binding contract — have an attorney finalize it before use.

---

## 1. Parties

This Data Processing Agreement ("**DPA**") is entered into between:

- **Data Controller:** The Customer ("**Controller**") — the entity that subscribes to {{PROJECT_NAME}}
- **Data Processor:** {{COMPANY_NAME}} ("**Processor**"), located at {{COMPANY_ADDRESS}}

This DPA supplements and is incorporated into the Terms of Service or Master Services Agreement between Controller and Processor.

---

## 2. Definitions

- **Personal Data:** Any information relating to an identified or identifiable natural person, as defined in GDPR Article 4(1)
- **Processing:** Any operation performed on Personal Data (collection, recording, storage, retrieval, use, disclosure, deletion)
- **Data Subject:** The individual whose Personal Data is processed
- **Sub-processor:** Any third party engaged by Processor to process Personal Data on behalf of Controller
- **Data Breach:** A breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to Personal Data

---

## 3. Scope and Purpose of Processing

### 3.1 Categories of Data Subjects

<!-- Populate from your product's user model -->
| Category | Description |
|----------|-------------|
| Controller's end users | Individuals who use Controller's instance of {{PROJECT_NAME}} |
| Controller's employees | Staff members with accounts in Controller's workspace |
| {{CATEGORY}} | {{DESCRIPTION}} |

### 3.2 Types of Personal Data Processed

<!-- Populate from data-sensitivity.template.md — data your product stores per-tenant -->
| Data Type | Purpose of Processing |
|-----------|----------------------|
| Name, email address | Account management, communication |
| {{DATA_TYPE}} | {{PURPOSE}} |
| {{DATA_TYPE}} | {{PURPOSE}} |

### 3.3 Nature and Purpose of Processing

Processor processes Personal Data solely for the purpose of providing the {{PROJECT_NAME}} service to Controller, including:
- Storing and organizing Controller's data
- Providing access to Controller's authorized users
- Sending service-related communications on Controller's behalf
- Providing analytics and reporting features
- {{ADDITIONAL_PURPOSES}}

### 3.4 Duration of Processing

Processing continues for the duration of the Terms of Service. Upon termination:
- Controller may export their data within {{DATA_EXPORT_WINDOW}} days
- Processor will delete all Personal Data within {{DATA_DELETION_WINDOW}} days after the export window, except as required by law

---

## 4. Processor Obligations

Processor shall:

1. **Process only on instructions** — Process Personal Data only on documented instructions from Controller, including transfers to third countries
2. **Confidentiality** — Ensure that persons authorized to process Personal Data are bound by confidentiality obligations
3. **Security measures** — Implement appropriate technical and organizational measures (see Section 6)
4. **Sub-processors** — Not engage another processor without Controller's prior written authorization (see Section 5)
5. **Data Subject rights** — Assist Controller in fulfilling Data Subject requests (access, rectification, erasure, portability, restriction, objection)
6. **Breach notification** — Notify Controller of a Data Breach without undue delay, and no later than {{BREACH_NOTIFICATION_HOURS}} hours after becoming aware
7. **Data Protection Impact Assessment** — Assist Controller with DPIAs and prior consultations with supervisory authorities where required
8. **Deletion or return** — At Controller's choice, delete or return all Personal Data upon termination of the agreement
9. **Audit rights** — Make available to Controller all information necessary to demonstrate compliance, and allow for audits (see Section 7)

---

## 5. Sub-processors

### 5.1 Current Sub-processors

Processor uses the following sub-processors:

<!-- Populate from integrations-map.template.md — infrastructure and services that touch customer data -->
| Sub-processor | Purpose | Location | Data Processed |
|---------------|---------|----------|---------------|
| {{HOSTING_PROVIDER}} | Cloud infrastructure | {{HOSTING_REGION}} | All stored data |
| {{DATABASE_PROVIDER}} | Database hosting | {{DB_REGION}} | All stored data |
| {{EMAIL_PROVIDER}} | Transactional email | {{REGION}} | Email addresses, names |
| {{PAYMENT_PROCESSOR}} | Payment processing | {{REGION}} | Billing data |
| {{ERROR_REPORTING}} | Error tracking | {{REGION}} | Device info, error context |
| {{SUB_PROCESSOR}} | {{PURPOSE}} | {{LOCATION}} | {{DATA}} |

### 5.2 Authorization

Controller provides **general written authorization** for Processor to engage sub-processors, subject to:
- Processor maintaining an up-to-date list of sub-processors
- Processor notifying Controller at least **{{SUB_PROCESSOR_NOTICE_DAYS}} days** before adding or replacing a sub-processor
- Controller having the right to object to a new sub-processor within {{OBJECTION_WINDOW}} days of notification

### 5.3 Sub-processor Obligations

Processor shall ensure that each sub-processor is bound by data protection obligations no less protective than those in this DPA.

---

## 6. Security Measures

Processor implements the following technical and organizational measures:

### 6.1 Technical Measures

| Measure | Implementation |
|---------|---------------|
| Encryption in transit | TLS 1.2+ for all data transmission |
| Encryption at rest | AES-256 for stored data |
| Access controls | Role-based access, least privilege principle |
| Authentication | Multi-factor authentication for infrastructure access |
| Network security | Firewalls, DDoS protection, private networking |
| Vulnerability management | Regular security scanning, dependency updates |
| Backup | Automated backups with {{BACKUP_FREQUENCY}} frequency |
| Monitoring | Real-time monitoring and alerting for security events |

### 6.2 Organizational Measures

| Measure | Implementation |
|---------|---------------|
| Employee training | Security awareness training for all staff |
| Access management | Access reviews every {{ACCESS_REVIEW_FREQUENCY}} |
| Incident response | Documented incident response procedures |
| Vendor management | Security assessment of all sub-processors |
| Data minimization | Collect and process only necessary data |
| Secure development | Security review in development lifecycle |

---

## 7. Audits

### 7.1 Audit Rights

Controller has the right to audit Processor's compliance with this DPA, subject to:
- Reasonable advance notice (minimum {{AUDIT_NOTICE_DAYS}} days)
- During normal business hours
- No more than {{MAX_AUDITS_PER_YEAR}} audit(s) per year (unless required by a supervisory authority or triggered by a Data Breach)
- Controller bears the cost of the audit

### 7.2 Alternative Audit Evidence

In lieu of an on-site audit, Processor may provide:
- SOC 2 Type II report (if available)
- ISO 27001 certification (if available)
- Results of third-party security assessments
- Completed security questionnaire

---

## 8. Data Breach Notification

In the event of a Data Breach, Processor shall:

1. **Notify** Controller without undue delay, and no later than {{BREACH_NOTIFICATION_HOURS}} hours after becoming aware
2. **Provide** the following information (to the extent available):
   - Nature of the breach, including categories and approximate number of affected Data Subjects
   - Name and contact details of Processor's data protection point of contact
   - Likely consequences of the breach
   - Measures taken or proposed to address the breach
3. **Cooperate** with Controller in investigating, mitigating, and remediating the breach
4. **Document** the breach, including facts, effects, and remedial action taken

---

## 9. International Transfers

<!-- IF TRANSFERS_OUTSIDE_EEA -->
If Personal Data is transferred outside the EEA, Processor ensures adequate protection through:

- **Standard Contractual Clauses (SCCs)** — Module Two (Controller to Processor) as adopted by the European Commission
- **Adequacy decisions** — For transfers to countries recognized by the European Commission
- **EU-US Data Privacy Framework** — For transfers to certified US organizations (if applicable)

The applicable SCCs are incorporated by reference and form part of this DPA.
<!-- ENDIF -->

---

## 10. Term and Termination

- This DPA is effective from the date the Terms of Service take effect and continues until termination of the Terms of Service.
- Obligations related to confidentiality, data deletion, and audit rights survive termination.
- Upon termination, Processor shall, at Controller's election, return or delete all Personal Data within {{DATA_DELETION_WINDOW}} days.

---

## 11. Liability

Processor's liability under this DPA is subject to the limitation of liability provisions in the Terms of Service, except where applicable law prohibits such limitations for data protection obligations.

---

## 12. Contact

For DPA-related inquiries:

- **Processor DPO / Privacy Contact:** {{DPO_EMAIL}}
- **Processor Address:** {{COMPANY_NAME}}, {{COMPANY_ADDRESS}}

---

*This DPA was generated using the Master Starter Kit legal document templates. It must be reviewed and finalized by a qualified attorney before execution.*
