# Compliance Impact Matrix — {{PROJECT_NAME}}

> **Purpose:** Understand which regulations apply to your project, what each one demands from your architecture, and what it costs to comply. This is not legal advice — it's an engineering impact map.

**Applicable Regulations:** {{APPLICABLE_REGULATIONS}}
**Data Classification:** {{DATA_CLASSIFICATION}}
**Last Compliance Review:** {{LAST_REVIEW_DATE}}
**Compliance Owner:** {{COMPLIANCE_OWNER}}

---

## 1. When Does Each Regulation Apply?

Before implementing anything, determine which regulations actually affect your project. Many teams over-engineer compliance for regulations that don't apply, or under-engineer for ones that do.

| Regulation | Applies When | Does NOT Apply When | Geographic Scope |
|-----------|-------------|-------------------|-----------------|
| **GDPR** | You process personal data of EU/EEA residents, regardless of where your company is based | You have zero EU users AND don't market to EU AND don't monitor EU behavior | EU/EEA + any company processing EU resident data |
| **CCPA/CPRA** | You do business in California AND (>$25M revenue OR >100K consumers' data OR >50% revenue from selling data) | You're below all three thresholds | California, USA |
| **HIPAA** | You handle Protected Health Information (PHI) as a covered entity or business associate | You're a wellness/fitness app that doesn't integrate with healthcare providers | USA |
| **PCI-DSS** | You store, process, or transmit credit card numbers | You use Stripe/PayPal hosted checkout and never see card numbers (you're still partially in scope) | Global |
| **SOC 2** | Your enterprise customers require it (B2B SaaS, especially selling to companies >500 employees) | You're B2C only, no enterprise sales | Global (primarily US-driven) |

> **Gotcha:** "We use Stripe so PCI doesn't apply to us" is wrong. Using Stripe's hosted checkout reduces your PCI scope dramatically (SAQ-A), but you still need to fill out the Self-Assessment Questionnaire and maintain certain controls. You're never fully out of scope if you accept card payments.

---

## 2. Impact Matrix: GDPR

**Full Name:** General Data Protection Regulation
**Penalty:** Up to 4% of global annual revenue or 20M EUR, whichever is higher

### Architecture Impact

| Area | Impact | Implementation Requirements |
|------|--------|-----------------------------|
| **Database** | HIGH | Soft-delete with purge capability. Every table with personal data needs a `deleted_at` column AND a scheduled hard-delete job. Store consent records with timestamps. Separate PII into dedicated tables for easier deletion. |
| **API** | HIGH | Data export endpoint (Article 15 — right of access). Data deletion endpoint (Article 17 — right to erasure). Consent management endpoints. All must complete within 30 days. |
| **Auth** | MEDIUM | Explicit consent at signup (no pre-checked boxes). Record what was consented to and when. Age verification if your service targets under-16s. |
| **Testing** | HIGH | Never use production data in test/staging. Use synthetic data or properly anonymized datasets. Test data deletion actually works (cascade deletes, backup purging). |
| **Monitoring** | MEDIUM | Audit log of who accessed personal data and when. Log retention policies (don't store logs with PII indefinitely). Data Processing Records (Article 30). |
| **Infrastructure** | MEDIUM | Data residency — know which region your data is stored in. Document all sub-processors (hosting, email, analytics). Cross-border transfer mechanisms (SCCs, adequacy decisions). |

### Implementation Checklist

```markdown
## GDPR Compliance Checklist

### Data Mapping
- [ ] Inventory all personal data fields in the database
- [ ] Document data flows (where does PII enter, move, and exit your system?)
- [ ] Identify and document all sub-processors (AWS, Stripe, SendGrid, etc.)
- [ ] Classify data by sensitivity (basic PII, sensitive PII, special categories)

### Consent Management
- [ ] Consent collection UI with granular options (not a single "I agree" checkbox)
- [ ] Consent records stored with: user_id, consent_type, granted_at, ip_address, version
- [ ] Consent withdrawal mechanism that's as easy as granting consent
- [ ] Cookie consent banner (if using cookies beyond strictly necessary)

### Data Subject Rights
- [ ] Right of Access: API endpoint to export all user data as JSON/CSV
- [ ] Right to Erasure: Deletion endpoint that cascades through all tables + backups
- [ ] Right to Rectification: Users can update their personal data
- [ ] Right to Portability: Export in machine-readable format
- [ ] Right to Object: Opt-out of profiling/automated decision-making
- [ ] All rights requests handled within 30 calendar days

### Technical Measures
- [ ] Encryption at rest (database, backups, file storage)
- [ ] Encryption in transit (TLS 1.2+ everywhere)
- [ ] PII access logging (who queried what, when)
- [ ] Automated PII purge job for deleted accounts (including backups)
- [ ] Data anonymization for analytics (strip identifiers)

### Documentation
- [ ] Privacy Policy published and accessible
- [ ] Data Processing Agreement (DPA) template for B2B customers
- [ ] Record of Processing Activities (ROPA) — Article 30 document
- [ ] Data Protection Impact Assessment (DPIA) for high-risk processing
- [ ] Breach notification procedure (72-hour window to supervisory authority)
```

### Common GDPR Mistakes

1. **Storing consent as a boolean.** You need to know WHAT was consented to, WHEN, and WHICH version of your privacy policy. A `consent: true` column is insufficient.
2. **Soft-delete without hard-delete follow-up.** "Right to erasure" means actual deletion, not a `deleted_at` timestamp that still returns data in admin queries.
3. **Forgetting backups.** If a user requests deletion and their data exists in last month's database backup, you have a problem. Document your backup retention and purge strategy.
4. **Logging PII in application logs.** Your structured logs probably contain email addresses, names, IPs. Set up PII scrubbing in your logging pipeline.
5. **Third-party pixel/analytics without consent.** Google Analytics, Facebook Pixel, Hotjar — all require explicit opt-in consent in the EU.

---

## 3. Impact Matrix: PCI-DSS

**Full Name:** Payment Card Industry Data Security Standard
**Version:** 4.0 (mandatory March 2025)
**Penalty:** Fines from card networks ($5K-$100K/month), loss of card processing ability

### Scope Reduction Strategy

| Approach | PCI Scope | Effort | Recommended When |
|----------|-----------|--------|-----------------|
| **Stripe Checkout / Hosted Fields** | SAQ-A (minimal) | Low | Almost always. Default choice. |
| **Stripe Elements (client-side tokenization)** | SAQ-A-EP | Medium | Need custom payment UI but want reduced scope |
| **Direct API (card data hits your server)** | SAQ-D (full) | Very High | Almost never. Avoid unless you're a payment processor. |

### Architecture Impact (SAQ-A — Using Hosted Checkout)

| Area | Impact | Implementation Requirements |
|------|--------|-----------------------------|
| **Database** | LOW | Never store card numbers, CVVs, or full track data. Store only Stripe customer/payment IDs. |
| **API** | LOW | Payment endpoints delegate to Stripe. Never proxy raw card data. Log payment events without card details. |
| **Auth** | LOW | Standard auth requirements. No additional PCI-specific auth needed for SAQ-A. |
| **Testing** | LOW | Use Stripe test mode cards. Never use real card numbers in tests. |
| **Monitoring** | MEDIUM | Quarterly scan by ASV (Approved Scanning Vendor). Annual SAQ completion. Log payment events for audit trail. |
| **Infrastructure** | LOW | TLS everywhere (you should already have this). Keep Stripe SDK updated. |

### Common PCI Mistakes

1. **Logging card numbers in server logs.** Even if you use Stripe, a misconfigured logging middleware can capture the raw POST body from your checkout page.
2. **Storing card data "temporarily" in Redis/session.** Temporary storage is still storage. Even 10 seconds in memory counts.
3. **Not completing the annual SAQ.** Even SAQ-A requires annual self-assessment. Many startups skip this and get caught during enterprise sales.
4. **Running payment pages on shared hosting without TLS.** Every page that leads to payment must be HTTPS.

---

## 4. Impact Matrix: HIPAA

**Full Name:** Health Insurance Portability and Accountability Act
**Penalty:** $100 to $50,000 per violation, up to $1.5M per year per violation category. Criminal penalties possible.

### Architecture Impact

| Area | Impact | Implementation Requirements |
|------|--------|-----------------------------|
| **Database** | CRITICAL | Encryption at rest (AES-256). Access controls on every PHI table. Audit logging of all PHI access. Separate PHI from non-PHI data where possible. |
| **API** | HIGH | All PHI endpoints require authentication + authorization. No PHI in URL parameters (they end up in server logs). Minimum necessary standard — return only the PHI needed. |
| **Auth** | CRITICAL | Unique user IDs (no shared accounts). Automatic session timeout (15 minutes recommended). Emergency access procedure. Password policies (complexity + rotation). |
| **Testing** | CRITICAL | Never use real PHI in test environments. Use synthetic data generators. De-identification must follow HIPAA Safe Harbor or Expert Determination method. |
| **Monitoring** | CRITICAL | Audit trail of all PHI access (who, what, when, from where). 6-year log retention minimum. Tamper-evident logging (write-once, append-only). |
| **Infrastructure** | CRITICAL | BAA (Business Associate Agreement) with every vendor that touches PHI. AWS, GCP, Azure all offer BAAs — you must sign them. Your hosting, email, and backup providers must all have BAAs. |

### Implementation Checklist

```markdown
## HIPAA Compliance Checklist

### Administrative
- [ ] HIPAA Security Officer designated: {{SECURITY_OFFICER}}
- [ ] Risk assessment completed and documented
- [ ] Workforce training on HIPAA requirements
- [ ] Business Associate Agreements signed with all vendors
- [ ] Incident response plan for PHI breaches
- [ ] Sanction policy for workforce violations

### Technical Safeguards
- [ ] Encryption at rest: AES-256 for database, backups, file storage
- [ ] Encryption in transit: TLS 1.2+ for all PHI transmission
- [ ] Access controls: Role-based access to PHI with minimum necessary
- [ ] Audit logging: Every PHI access logged with user, timestamp, data accessed
- [ ] Automatic logoff: Session timeout after {{SESSION_TIMEOUT}} minutes of inactivity
- [ ] Unique user identification: No shared accounts, no generic logins
- [ ] Emergency access procedure: Break-glass access documented and audited

### Physical Safeguards (Cloud)
- [ ] Cloud provider BAA signed (AWS/GCP/Azure)
- [ ] Data center security delegated to cloud provider (document this)
- [ ] Workstation security: Full-disk encryption on all dev machines
- [ ] Device management: Remote wipe capability for mobile devices accessing PHI

### Breach Notification
- [ ] Breach detection process documented
- [ ] 60-day notification window to affected individuals (for breaches >500 records: also notify HHS and media)
- [ ] Breach log maintained
```

### Common HIPAA Mistakes

1. **Using consumer-grade email (Gmail, Outlook.com) for PHI.** You need a HIPAA-compliant email provider or encrypted email for PHI transmission.
2. **Forgetting BAAs.** Every SaaS tool that could touch PHI needs a BAA: hosting, logging, error tracking, email, SMS, chat, analytics. Sentry without a BAA? Non-compliant.
3. **PHI in error messages.** Stack traces that include patient names or health data in your error tracking tool violate HIPAA.
4. **Assuming de-identification is simple.** HIPAA defines 18 specific identifiers that must be removed. Zip codes, dates of birth, and ages over 89 are all identifiers.

---

## 5. Impact Matrix: SOC 2

**Full Name:** Service Organization Control 2
**Type:** Type I (point-in-time) or Type II (over a period, usually 6-12 months)
**Cost:** $20K-$100K+ for the audit itself, plus implementation costs

### Architecture Impact

| Area | Impact | Implementation Requirements |
|------|--------|-----------------------------|
| **Database** | MEDIUM | Encryption at rest. Access controls documented. Change management for schema changes. Backup and recovery testing. |
| **API** | MEDIUM | Authentication on all endpoints. Rate limiting. Input validation. Error handling that doesn't leak internals. |
| **Auth** | HIGH | MFA for all production access. Password policies. Account lockout. Session management. Access reviews (quarterly). |
| **Testing** | MEDIUM | Documented testing procedures. Evidence of test execution. Vulnerability scanning. Penetration testing (annual). |
| **Monitoring** | HIGH | Centralized logging. Alerting on security events. Uptime monitoring. Incident response procedures with evidence. |
| **Infrastructure** | HIGH | Change management process (PRs, approvals, deploy logs). Vulnerability management (patching cadence). Network segmentation. Disaster recovery plan tested annually. |

### Trust Service Criteria (What the Auditor Checks)

| Criteria | Key Question | Evidence Needed |
|----------|-------------|-----------------|
| **Security** (required) | Are systems protected against unauthorized access? | Access controls, encryption, firewalls, MFA, vulnerability scans |
| **Availability** | Is the system available as committed? | SLOs, uptime monitoring, incident response, DR testing |
| **Processing Integrity** | Does the system process data accurately? | Input validation, reconciliation, error handling |
| **Confidentiality** | Is confidential data protected? | Encryption, access controls, data classification |
| **Privacy** | Is personal info handled per the privacy notice? | Privacy policy, consent management, data handling procedures |

### Common SOC 2 Mistakes

1. **Starting the audit before you have 6 months of evidence.** SOC 2 Type II requires evidence over a period. Start implementing controls at least 6 months before you want the report.
2. **Not automating evidence collection.** Auditors want proof: deploy logs, PR approval screenshots, access review records. If these are manual, you'll spend weeks gathering evidence. Use Vanta, Drata, or Secureframe.
3. **Treating it as a one-time project.** SOC 2 is annual. Build the controls into your development process, not as a parallel project.
4. **Over-scoping.** Only Security is required. Don't add Availability, Confidentiality, Privacy, and Processing Integrity unless your customers specifically ask for them.

---

## 6. Impact Matrix: CCPA/CPRA

**Full Name:** California Consumer Privacy Act / California Privacy Rights Act
**Penalty:** $2,500 per unintentional violation, $7,500 per intentional violation. Private right of action for data breaches.

### Architecture Impact

| Area | Impact | Implementation Requirements |
|------|--------|-----------------------------|
| **Database** | MEDIUM | Track what personal info you collect, from where, and for what purpose. Support data deletion requests. 12-month lookback window for data access requests. |
| **API** | MEDIUM | "Do Not Sell/Share My Personal Information" endpoint. Data access endpoint (all personal info collected in last 12 months). Data deletion endpoint. |
| **Auth** | LOW | Identity verification for data requests (can't just let anyone request another user's data). |
| **Testing** | LOW | Test deletion cascades. Test data export completeness. |
| **Monitoring** | LOW | Track data request fulfillment (45-day window). Log opt-outs from sale/sharing. |

### Key Differences from GDPR

| Aspect | GDPR | CCPA/CPRA |
|--------|------|-----------|
| Legal basis | Requires a legal basis to process (consent, legitimate interest, etc.) | Requires opt-out for sale/sharing; no consent needed to collect |
| Right to delete | Must delete + inform processors | Must delete + direct service providers to delete |
| Response time | 30 days | 45 days (can extend by 45 more) |
| Scope | Any company processing EU data | Companies meeting revenue/data thresholds in California |
| Private lawsuits | Generally no (except data breaches) | Yes, for data breaches (statutory damages $100-$750/consumer) |

---

## 7. Cost Overlay: What Compliance Adds

Compliance is not free. Budget for these costs or you'll be surprised.

| Cost Category | GDPR | PCI (SAQ-A) | HIPAA | SOC 2 | CCPA |
|--------------|------|-------------|-------|-------|------|
| **Legal review** | $5K-$20K | $2K-$5K | $10K-$30K | $5K-$15K | $3K-$10K |
| **Implementation** (eng time) | 2-4 weeks | 1-2 days | 4-8 weeks | 4-8 weeks | 1-2 weeks |
| **Tooling** (annual) | $0-$5K (consent mgmt) | $0 (Stripe handles most) | $5K-$20K (HIPAA hosting, logging) | $10K-$30K (Vanta/Drata + pen test) | $0-$2K |
| **Audit/Assessment** (annual) | DPIA: $5K-$15K if needed | ASV scan: $200-$1K | Risk assessment: $10K-$30K | Audit: $20K-$100K+ | Self-assessment: $0 |
| **Ongoing maintenance** | 2-4 hrs/month | 1 hr/quarter | 4-8 hrs/month | 4-8 hrs/month | 1-2 hrs/month |
| **Total Year 1** | $10K-$40K | $2K-$6K | $40K-$120K | $40K-$150K | $5K-$15K |

> **Gotcha:** These are estimates for a small-to-medium SaaS. Enterprise scale multiplies everything. The biggest hidden cost is engineer time — compliance work is boring and your best engineers will resist it. Budget accordingly.

---

## 8. Project-Specific Compliance Requirements

| Regulation | Applicable? | Justification | Implementation Phase | Owner |
|-----------|-------------|---------------|---------------------|-------|
| GDPR | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |
| PCI-DSS | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |
| HIPAA | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |
| SOC 2 | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |
| CCPA/CPRA | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |
| {{OTHER_REGULATION}} | {{YES_NO}} | {{JUSTIFICATION}} | {{PHASE}} | {{OWNER}} |

### Data Classification for {{PROJECT_NAME}}

| Data Category | Examples | Classification | Regulations Affected | Storage Requirements |
|--------------|----------|---------------|---------------------|---------------------|
| {{CATEGORY_1}} | {{EXAMPLES}} | {{PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED}} | {{REGULATIONS}} | {{REQUIREMENTS}} |
| {{CATEGORY_2}} | {{EXAMPLES}} | {{PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED}} | {{REGULATIONS}} | {{REQUIREMENTS}} |
| {{CATEGORY_3}} | {{EXAMPLES}} | {{PUBLIC/INTERNAL/CONFIDENTIAL/RESTRICTED}} | {{REGULATIONS}} | {{REQUIREMENTS}} |
