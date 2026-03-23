# Data Security Architecture — {{PROJECT_NAME}}

Paste the Mermaid block below into any Mermaid-compatible renderer (GitHub, VS Code, Mermaid Live Editor). Replace all {{PLACEHOLDER}} values with project-specific data before rendering.

**Category:** 12 — Stakeholder Communications

---

## Data Classification & Protection Controls

```mermaid
flowchart TB
    subgraph TIER1["Tier 1 — Critical Data"]
        direction LR
        T1_DATA["PII, PHI, Payment Data<br/>{{TIER_1_EXAMPLES}}"]
        T1_CONTROLS["Encrypted at rest (AES-256)<br/>Encrypted in transit (TLS 1.3)<br/>Access logged & audited<br/>Retention: {{TIER_1_RETENTION}}<br/>Tokenized where possible"]
        T1_DATA --- T1_CONTROLS
    end

    subgraph TIER2["Tier 2 — Sensitive Data"]
        direction LR
        T2_DATA["Business data, contracts,<br/>financials<br/>{{TIER_2_EXAMPLES}}"]
        T2_CONTROLS["Encrypted at rest (AES-256)<br/>Encrypted in transit (TLS 1.3)<br/>Role-based access control<br/>Retention: {{TIER_2_RETENTION}}"]
        T2_DATA --- T2_CONTROLS
    end

    subgraph TIER3["Tier 3 — Internal Data"]
        direction LR
        T3_DATA["Operational data, logs,<br/>analytics<br/>{{TIER_3_EXAMPLES}}"]
        T3_CONTROLS["Encrypted in transit (TLS 1.3)<br/>Access controlled by role<br/>Retention: {{TIER_3_RETENTION}}<br/>Anonymized for analytics"]
        T3_DATA --- T3_CONTROLS
    end

    subgraph TIER4["Tier 4 — Public Data"]
        direction LR
        T4_DATA["Marketing content, docs,<br/>public APIs<br/>{{TIER_4_EXAMPLES}}"]
        T4_CONTROLS["Standard transport security<br/>Open access (no auth required)<br/>CDN-cached<br/>Retention: Indefinite"]
        T4_DATA --- T4_CONTROLS
    end

    TIER1 -->|"Highest protection"| TIER2
    TIER2 -->|"Standard protection"| TIER3
    TIER3 -->|"Minimal protection"| TIER4

    style TIER1 fill:#D32F2F,color:#fff
    style TIER2 fill:#F57C00,color:#fff
    style TIER3 fill:#FBC02D,color:#000
    style TIER4 fill:#388E3C,color:#fff
    style T1_DATA fill:#FFCDD2,color:#000
    style T1_CONTROLS fill:#FFCDD2,color:#000
    style T2_DATA fill:#FFE0B2,color:#000
    style T2_CONTROLS fill:#FFE0B2,color:#000
    style T3_DATA fill:#FFF9C4,color:#000
    style T3_CONTROLS fill:#FFF9C4,color:#000
    style T4_DATA fill:#C8E6C9,color:#000
    style T4_CONTROLS fill:#C8E6C9,color:#000
```

## Incident Response Timeline

```mermaid
flowchart LR
    D["Detection<br/>0–15 min"]
    A["Assessment<br/>15–30 min"]
    C["Containment<br/>30–60 min"]
    N["Notification<br/>1–4 hr"]
    R["Recovery<br/>4–24 hr"]
    PM["Post-Mortem<br/>24–72 hr"]

    D -->|"Automated alerts<br/>trigger on-call"| A
    A -->|"Severity classified<br/>scope identified"| C
    C -->|"Threat isolated<br/>evidence preserved"| N
    N -->|"Stakeholders notified<br/>per {{NOTIFICATION_POLICY}}"| R
    R -->|"Systems restored<br/>data validated"| PM
    PM -->|"Root cause documented<br/>controls improved"| DONE["Closed"]

    D ---|"SOC monitoring<br/>SIEM alerts<br/>Anomaly detection"| D_DETAIL["{{DETECTION_TOOLS}}"]
    A ---|"Impact: users affected<br/>Data: classification tier<br/>Blast radius assessment"| A_DETAIL["Severity: P0–P3"]
    C ---|"Isolate compromised systems<br/>Revoke affected credentials<br/>Block attack vectors"| C_DETAIL["Containment playbook"]
    N ---|"Internal: {{INTERNAL_NOTIFY_TIMELINE}}<br/>Customers: {{CUSTOMER_NOTIFY_TIMELINE}}<br/>Regulators: {{REGULATOR_NOTIFY_TIMELINE}}"| N_DETAIL["Notification matrix"]
    R ---|"Restore from backups<br/>Re-deploy clean systems<br/>Verify data integrity"| R_DETAIL["Recovery playbook"]
    PM ---|"Blameless retrospective<br/>Update runbooks<br/>Strengthen controls"| PM_DETAIL["Improvement plan"]

    style D fill:#4CAF50,color:#fff
    style A fill:#8BC34A,color:#000
    style C fill:#FFC107,color:#000
    style N fill:#FF9800,color:#fff
    style R fill:#FF5722,color:#fff
    style PM fill:#9C27B0,color:#fff
    style DONE fill:#607D8B,color:#fff
```

<!-- IF {{COMPLIANCE_REQUIREMENTS}} != "none" -->

## Compliance Framework Mapping

```mermaid
flowchart TB
    subgraph FRAMEWORKS["Compliance Frameworks"]
        CF1["{{COMPLIANCE_FRAMEWORK_1}}"]
        CF2["{{COMPLIANCE_FRAMEWORK_2}}"]
        CF3["{{COMPLIANCE_FRAMEWORK_3}}"]
    end

    subgraph CONTROLS["Security Controls"]
        ENC["Encryption<br/>(at rest + transit)"]
        AC["Access Control<br/>(RBAC + MFA)"]
        AL["Audit Logging<br/>(immutable)"]
        DLP["Data Loss<br/>Prevention"]
        BCP["Backup &<br/>Recovery"]
        VM["Vulnerability<br/>Management"]
        PEN["Penetration<br/>Testing"]
        IM["Incident<br/>Management"]
    end

    CF1 --> ENC
    CF1 --> AC
    CF1 --> AL
    CF1 --> IM
    CF2 --> ENC
    CF2 --> AC
    CF2 --> DLP
    CF2 --> BCP
    CF3 --> AL
    CF3 --> VM
    CF3 --> PEN
    CF3 --> IM

    style FRAMEWORKS fill:#E3F2FD,color:#000
    style CONTROLS fill:#F3E5F5,color:#000
```

<!-- END IF -->

---

## Data Classification Table

| Classification | Tier | Examples | Encryption at Rest | Encryption in Transit | Access Logging | Retention | Backup Frequency |
|---------------|------|---------|:------------------:|:---------------------:|:--------------:|-----------|-----------------|
| Critical | 1 | {{TIER_1_EXAMPLES}} | AES-256 | TLS 1.3 | Full audit trail | {{TIER_1_RETENTION}} | {{TIER_1_BACKUP_FREQ}} |
| Sensitive | 2 | {{TIER_2_EXAMPLES}} | AES-256 | TLS 1.3 | Access logged | {{TIER_2_RETENTION}} | {{TIER_2_BACKUP_FREQ}} |
| Internal | 3 | {{TIER_3_EXAMPLES}} | {{TIER_3_ENCRYPTION_AT_REST}} | TLS 1.3 | Aggregated | {{TIER_3_RETENTION}} | {{TIER_3_BACKUP_FREQ}} |
| Public | 4 | {{TIER_4_EXAMPLES}} | N/A | TLS 1.2+ | N/A | Indefinite | {{TIER_4_BACKUP_FREQ}} |

## Protection Controls

| Control | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Implementation |
|---------|:------:|:------:|:------:|:------:|---------------|
| Encryption at rest | Required | Required | {{TIER_3_EAR}} | N/A | {{ENCRYPTION_IMPLEMENTATION}} |
| Encryption in transit | TLS 1.3 | TLS 1.3 | TLS 1.3 | TLS 1.2+ | {{TLS_IMPLEMENTATION}} |
| MFA for access | Required | Required | {{TIER_3_MFA}} | N/A | {{MFA_IMPLEMENTATION}} |
| Audit logging | Full (immutable) | Full | Aggregated | N/A | {{AUDIT_IMPLEMENTATION}} |
| Data masking | Required (display) | {{TIER_2_MASKING}} | N/A | N/A | {{MASKING_IMPLEMENTATION}} |
| Tokenization | Required (storage) | {{TIER_2_TOKENIZATION}} | N/A | N/A | {{TOKENIZATION_IMPLEMENTATION}} |
| DLP scanning | Required | Required | {{TIER_3_DLP}} | N/A | {{DLP_IMPLEMENTATION}} |
| Key rotation | Every {{TIER_1_KEY_ROTATION}} | Every {{TIER_2_KEY_ROTATION}} | Every {{TIER_3_KEY_ROTATION}} | N/A | {{KEY_ROTATION_IMPLEMENTATION}} |
| Backup encryption | Required | Required | {{TIER_3_BACKUP_ENC}} | N/A | {{BACKUP_IMPLEMENTATION}} |
| Geo-restriction | {{TIER_1_GEO_RESTRICTION}} | {{TIER_2_GEO_RESTRICTION}} | None | None | {{GEO_IMPLEMENTATION}} |

## Compliance Mapping

| Requirement | Framework | Control(s) | Status | Evidence |
|------------|-----------|-----------|--------|----------|
| {{REQUIREMENT_1}} | {{COMPLIANCE_FRAMEWORK_1}} | Encryption, Access Control | {{REQ_1_STATUS}} | {{REQ_1_EVIDENCE}} |
| {{REQUIREMENT_2}} | {{COMPLIANCE_FRAMEWORK_1}} | Audit Logging, Incident Mgmt | {{REQ_2_STATUS}} | {{REQ_2_EVIDENCE}} |
| {{REQUIREMENT_3}} | {{COMPLIANCE_FRAMEWORK_2}} | DLP, Data Classification | {{REQ_3_STATUS}} | {{REQ_3_EVIDENCE}} |
| {{REQUIREMENT_4}} | {{COMPLIANCE_FRAMEWORK_2}} | Backup & Recovery | {{REQ_4_STATUS}} | {{REQ_4_EVIDENCE}} |
| {{REQUIREMENT_5}} | {{COMPLIANCE_FRAMEWORK_3}} | Vulnerability Mgmt, Pen Testing | {{REQ_5_STATUS}} | {{REQ_5_EVIDENCE}} |
| {{REQUIREMENT_6}} | {{COMPLIANCE_FRAMEWORK_3}} | Access Control, MFA | {{REQ_6_STATUS}} | {{REQ_6_EVIDENCE}} |
| Data residency | {{APPLICABLE_FRAMEWORK}} | Geo-restriction, Hosting region | {{RESIDENCY_STATUS}} | Hosting: {{HOSTING_REGION}} |
| Right to deletion | {{APPLICABLE_FRAMEWORK}} | Data lifecycle management | {{DELETION_STATUS}} | Automated purge pipeline |
| Breach notification | {{APPLICABLE_FRAMEWORK}} | Incident Management | {{BREACH_NOTIFY_STATUS}} | Notification within {{BREACH_NOTIFY_HOURS}} hours |

---

## Cross-References

- **Auth & Permissions:** `auth-role-permission-matrix.template.md` — role-based access controls referenced in Tier 1/2 protections
- **Database ERD:** `database-erd-visual.template.md` — which tables store Tier 1 vs Tier 2 data
- **System Architecture:** `system-architecture-flowchart.template.md` — where encryption and access control are enforced
- **Product Overview:** `stakeholder-product-overview.template.md` — how security is positioned as a feature for customers
