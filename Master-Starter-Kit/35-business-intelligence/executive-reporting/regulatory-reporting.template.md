# Regulatory & Compliance Reporting

> **Owner:** {{STAKEHOLDER_LEGAL}} / Chief Information Security Officer
> **Refresh cadence:** Monthly (operational metrics), Quarterly (compliance reviews), Annually (certifications)
> **Project:** {{PROJECT_NAME}}

---

## Purpose

This template provides the compliance monitoring and regulatory reporting framework for {{PROJECT_NAME}}. Regulatory compliance is not a one-time audit — it is an ongoing operational discipline. This dashboard tracks compliance posture in real-time, prepares audit-ready exports, and maintains the compliance calendar so nothing falls through the cracks. The cost of a compliance failure (fines, reputational damage, customer loss) always exceeds the cost of maintaining compliance.

---

## Table of Contents

1. [Compliance Dashboard Overview](#1-compliance-dashboard-overview)
2. [SOC 2 Reporting](#2-soc-2-reporting)
3. [GDPR Compliance](#3-gdpr-compliance)
4. [SOX Compliance](#4-sox-compliance)
5. [HIPAA Compliance](#5-hipaa-compliance)
6. [Audit-Ready Data Exports](#6-audit-ready-data-exports)
7. [Compliance Calendar](#7-compliance-calendar)
8. [Automated Compliance Monitoring](#8-automated-compliance-monitoring)
9. [Cross-References](#9-cross-references)

---

## 1. Compliance Dashboard Overview

### Compliance Posture Summary

| Framework | Applicable? | Current Status | Last Audit | Next Audit | Open Findings | Critical Findings |
|---|---|---|---|---|---|---|
| SOC 2 Type II | Yes / No | Compliant / Non-Compliant / In Progress | — | — | — | — |
| GDPR | Yes / No | Compliant / Non-Compliant / In Progress | — | — | — | — |
| CCPA/CPRA | Yes / No | Compliant / Non-Compliant / In Progress | — | — | — | — |
| SOX | Yes / No | Compliant / Non-Compliant / N/A | — | — | — | — |
| HIPAA | Yes / No | Compliant / Non-Compliant / N/A | — | — | — | — |
| PCI DSS | Yes / No | Compliant / Non-Compliant / N/A | — | — | — | — |
| ISO 27001 | Yes / No | Certified / In Progress / N/A | — | — | — | — |

### Applicability Determination

| Framework | Applicable When |
|---|---|
| SOC 2 | Processing, storing, or transmitting customer data (virtually all SaaS) |
| GDPR | Processing personal data of EU/EEA residents (regardless of company location) |
| CCPA/CPRA | > $25M revenue, or > 50K CA consumers, or > 50% revenue from selling personal data |
| SOX | US publicly traded companies (or preparing for IPO) |
| HIPAA | Processing protected health information (PHI) for US healthcare entities |
| PCI DSS | Processing, storing, or transmitting cardholder data |
| ISO 27001 | When customers require certification (common for enterprise sales) |

### Overall Compliance Health Score

```
Compliance Health = (Controls Passing / Total Controls) × 100
```

| Period | Total Controls | Passing | Failing | Not Tested | Health Score |
|---|---|---|---|---|---|
| This month | — | — | — | — | —% |
| Last month | — | — | — | — | —% |
| 3 months ago | — | — | — | — | —% |

**Target:** > 95% passing at all times. < 90% triggers a compliance improvement sprint.

---

## 2. SOC 2 Reporting

### Trust Service Criteria Dashboard

SOC 2 evaluates five trust service criteria. Track each independently.

#### Security (Common Criteria — Required)

| Control Area | Controls | Passing | Failing | Evidence |
|---|---|---|---|---|
| Access controls | — | — | — | Access logs, role matrices |
| Network security | — | — | — | Firewall configs, penetration test results |
| System monitoring | — | — | — | Alerting configs, incident logs |
| Change management | — | — | — | PR reviews, deployment logs |
| Risk management | — | — | — | Risk register, assessment reports |
| Incident response | — | — | — | Incident logs, RCA documents |
| Vendor management | — | — | — | Vendor assessments, contracts |

#### Availability

| Metric | This Month | Last Month | SLA Target | Status |
|---|---|---|---|---|
| System uptime | —% | —% | > 99.9% | — |
| Planned downtime (hours) | — | — | < 4h/month | — |
| Unplanned downtime (hours) | — | — | < 0.5h/month | — |
| Incident count (P1/P2) | — | — | 0 P1, < 3 P2 | — |
| Recovery time (avg P1) | — | — | < 1 hour | — |

#### Confidentiality

| Control | Status | Evidence |
|---|---|---|
| Data classification policy | — | Policy document |
| Encryption at rest | — | Configuration audit |
| Encryption in transit | — | TLS certificate audit |
| Data access logging | — | Access log samples |
| Data retention / destruction | — | Retention policy, destruction logs |

#### Processing Integrity

| Control | Status | Evidence |
|---|---|---|
| Input validation | — | Code review records |
| Processing completeness checks | — | Reconciliation reports |
| Error handling and correction | — | Error logs, correction records |
| Output reconciliation | — | Processing audit reports |

#### Privacy (if applicable)

| Control | Status | Evidence |
|---|---|---|
| Privacy notice published | — | URL and version |
| Consent management | — | Consent records |
| Data subject rights fulfillment | — | DSR logs (see GDPR section) |
| Data minimization | — | Data inventory audit |
| Cross-border transfer safeguards | — | Transfer impact assessments |

### Access Log Metrics

| Metric | This Month | Trend | Alert Threshold |
|---|---|---|---|
| Unique users accessing production | — | — | > XX triggers review |
| Privileged access events | — | — | > XX triggers review |
| Failed authentication attempts | — | — | > XX/hour triggers lockout |
| After-hours access events | — | — | Any triggers review |
| Access review completion rate | —% | — | Must be 100% quarterly |
| Orphaned accounts discovered | — | — | Must be 0 |

### Change Management Audit Trail

| Metric | This Month | Last Month | Target |
|---|---|---|---|
| Total production changes | — | — | — |
| Changes with approved PR | —% | —% | 100% |
| Changes with code review | —% | —% | 100% |
| Emergency changes (bypassed process) | — | — | < 5% of total |
| Changes with rollback plan documented | —% | —% | 100% |
| Changes causing incidents | — | — | < 5% |

### Incident Response Metrics

| Metric | This Month | Last Month | Target |
|---|---|---|---|
| Total incidents | — | — | — |
| P1 incidents | — | — | 0 |
| Mean time to detect (MTTD) | — | — | < 15 min |
| Mean time to respond (MTTR) | — | — | < 1 hour (P1) |
| Incidents with RCA completed | —% | —% | 100% for P1/P2 |
| RCA action items completed on time | —% | —% | > 90% |
| Customer-impacting incidents | — | — | 0 |
| Customer notifications sent on time | —% | —% | 100% |

---

## 3. GDPR Compliance

### Data Subject Request (DSR) Metrics

| Request Type | Received | Completed | Avg Response Time | Within 30-Day Deadline | Overdue |
|---|---|---|---|---|---|
| Access (Article 15) | — | — | — days | —% | — |
| Rectification (Article 16) | — | — | — days | —% | — |
| Erasure / Right to be Forgotten (Article 17) | — | — | — days | —% | — |
| Restriction (Article 18) | — | — | — days | —% | — |
| Data Portability (Article 20) | — | — | — days | —% | — |
| Objection (Article 21) | — | — | — days | —% | — |
| **Total DSRs** | **—** | **—** | **— days** | **—%** | **—** |

**SLA:** All DSRs must be completed within 30 calendar days (extendable to 60 days for complex requests with notification to the data subject).

**Alert:** Any DSR approaching day 25 without completion triggers escalation to {{STAKEHOLDER_LEGAL}}.

### DSR Trend

| Month | DSR Volume | Completion Rate | Avg Response Time | Overdue Count |
|---|---|---|---|---|
| — | — | —% | — days | — |
| — | — | —% | — days | — |
| — | — | —% | — days | — |
| — | — | —% | — days | — |
| — | — | —% | — days | — |
| — | — | —% | — days | — |

### Consent Management

| Consent Type | Active Consents | Consent Rate | Withdrawals This Month | Withdrawal Rate |
|---|---|---|---|---|
| Marketing communications | — | —% | — | —% |
| Analytics / tracking | — | —% | — | —% |
| Third-party data sharing | — | —% | — | —% |
| Functional cookies | — | —% | — | —% |

**Consent capture methodology:**
- [ ] Consent is affirmative (not pre-checked boxes)
- [ ] Consent is granular (separate for each purpose)
- [ ] Consent is documented (timestamp, version of policy, specific consent given)
- [ ] Consent withdrawal is as easy as giving consent
- [ ] Consent records are retained for audit purposes

### Data Retention Compliance

| Data Category | Retention Policy | Actual Retention | Compliant? | Records Subject to Deletion |
|---|---|---|---|---|
| User account data | Until deletion request + 30 days | — | — | — |
| Transaction records | 7 years (tax/legal) | — | — | — |
| Support tickets | 3 years after resolution | — | — | — |
| Analytics data (PII) | 26 months | — | — | — |
| Analytics data (anonymized) | Indefinite | — | — | N/A |
| Access logs | 1 year | — | — | — |
| Marketing consent records | Duration of consent + 3 years | — | — | — |

**Automated deletion check:**
- [ ] Automated jobs exist to delete data past retention period
- [ ] Deletion jobs run on schedule (verify last run date)
- [ ] Deletion is verified (spot-check that deleted data is actually gone)
- [ ] Backup systems also purge deleted data within defined window

### Cross-Border Data Transfer Tracking

| Transfer | Source | Destination | Legal Basis | Status |
|---|---|---|---|---|
| Customer data processing | EU | US (AWS us-east-1) | Standard Contractual Clauses (SCCs) | — |
| Customer support | EU | [Support location] | SCCs / Adequacy decision | — |
| Analytics processing | EU | US (analytics vendor) | SCCs + Transfer Impact Assessment | — |
| Backup / DR | EU | [DR location] | SCCs | — |

**Post-Schrems II requirements:**
- [ ] Transfer Impact Assessment (TIA) completed for each transfer
- [ ] Supplementary measures identified where needed
- [ ] TIA reviewed within past 12 months

---

## 4. SOX Compliance

> **Applicability:** Required for US publicly traded companies. Also relevant for pre-IPO companies building SOX-readiness.

### Financial Control Metrics

| Control Area | Controls | Tested | Effective | Deficient | Material Weakness |
|---|---|---|---|---|---|
| Revenue recognition | — | — | — | — | — |
| Accounts payable | — | — | — | — | — |
| Accounts receivable | — | — | — | — | — |
| Financial close process | — | — | — | — | — |
| Journal entry controls | — | — | — | — | — |
| IT general controls (ITGC) | — | — | — | — | — |
| **Total** | **—** | **—** | **—** | **—** | **—** |

### Access Review Completion

| System | Review Frequency | Last Review | Users Reviewed | Issues Found | Issues Remediated | On Time? |
|---|---|---|---|---|---|---|
| Financial system (ERP) | Quarterly | — | — | — | — | — |
| Billing system | Quarterly | — | — | — | — | — |
| Bank accounts | Quarterly | — | — | — | — | — |
| Production database | Quarterly | — | — | — | — | — |
| HR/Payroll system | Quarterly | — | — | — | — | — |

### Segregation of Duties (SoD) Compliance

| Process | Segregated Roles | SoD Violation Count | Status |
|---|---|---|---|
| Invoice approval → Payment release | Requester ≠ Approver ≠ Payer | — | — |
| Code deployment → Production access | Developer ≠ Deployer (or automated) | — | — |
| User provisioning → Access approval | Requester ≠ Approver | — | — |
| Journal entry → Posting approval | Preparer ≠ Approver | — | — |
| Revenue booking → Revenue recognition | Sales ≠ Finance | — | — |

**Target:** Zero SoD violations. Any violation requires compensating control documentation.

### Financial Close Checklist

| Step | Owner | Due Date | Status | Sign-Off |
|---|---|---|---|---|
| Revenue reconciliation | — | Month-end +3 days | — | — |
| AP reconciliation | — | Month-end +3 days | — | — |
| AR reconciliation | — | Month-end +3 days | — | — |
| Bank reconciliation | — | Month-end +5 days | — | — |
| Intercompany reconciliation | — | Month-end +5 days | — | — |
| Accruals and deferrals | — | Month-end +5 days | — | — |
| Journal entry review | — | Month-end +7 days | — | — |
| Financial statement preparation | — | Month-end +10 days | — | — |
| Management review and sign-off | — | Month-end +12 days | — | — |

---

## 5. HIPAA Compliance

> **Applicability:** Required when processing Protected Health Information (PHI) for or on behalf of US healthcare covered entities.

### Access Audit Logs

| Metric | This Month | Last Month | Target | Status |
|---|---|---|---|---|
| PHI access events (total) | — | — | — | — |
| Unique users accessing PHI | — | — | Minimum necessary | — |
| Unusual access patterns flagged | — | — | All investigated | — |
| Access by role compliance | —% | —% | 100% | — |
| Break-the-glass events | — | — | Reviewed within 24h | — |

### Encryption Compliance

| Data State | Encryption Standard | Compliance | Evidence |
|---|---|---|---|
| At rest (database) | AES-256 | — | Configuration audit |
| At rest (file storage) | AES-256 | — | Configuration audit |
| At rest (backups) | AES-256 | — | Backup encryption verification |
| In transit (external) | TLS 1.2+ | — | Certificate scan |
| In transit (internal) | TLS 1.2+ or mTLS | — | Network audit |
| In transit (email containing PHI) | TLS + encryption layer | — | Email gateway config |

### Breach Notification Readiness

| Component | Status | Last Test Date | Owner |
|---|---|---|---|
| Breach detection capability | — | — | CISO |
| Breach assessment process (is it a notifiable breach?) | — | — | Privacy Officer |
| Patient notification template | — | — | Legal |
| HHS notification process | — | — | Legal |
| Media notification process (> 500 individuals) | — | — | Communications |
| State attorney general notification (where required) | — | — | Legal |
| Business associate notification chain | — | — | Vendor Management |

**HIPAA breach notification timeline:**
- Individual notification: within 60 days of discovery.
- HHS notification: within 60 days of discovery (immediately if > 500 individuals).
- Media notification: within 60 days if > 500 individuals in a single state.

### Business Associate Agreement (BAA) Tracking

| Business Associate | Service | BAA Signed | BAA Expiry | Last Security Assessment | Status |
|---|---|---|---|---|---|
| Cloud provider (e.g., AWS) | Infrastructure | — | — | — | — |
| Email service | Communications | — | — | — | — |
| Analytics provider | Data processing | — | — | — | — |
| Backup service | Data storage | — | — | — | — |
| Support tooling | Customer support | — | — | — | — |

**Alert:** BAA expiring within 90 days triggers renewal process.

---

## 6. Audit-Ready Data Exports

### Pre-Formatted Report Templates

Maintain audit-ready exports that can be generated on demand within 24 hours. External auditors should never wait more than 2 business days for requested data.

| Report | Content | Format | Retention | Requestor |
|---|---|---|---|---|
| **Access Control Report** | All user accounts, roles, permissions, last login, provisioning/deprovisioning dates | CSV + PDF summary | 3 years | SOC 2 / ISO auditor |
| **Change Management Log** | All production changes with PR link, reviewer, approval, deployment timestamp | CSV | 3 years | SOC 2 / ISO auditor |
| **Incident Report** | All incidents with timeline, impact, RCA, remediation actions | PDF per incident + summary CSV | 5 years | SOC 2 / ISO auditor |
| **Data Subject Request Log** | All DSRs with type, receipt date, completion date, outcome | CSV | 5 years | GDPR auditor / DPA |
| **Consent Records** | Consent given/withdrawn by user, with timestamp and policy version | CSV | Duration of consent + 3 years | GDPR auditor |
| **Financial Controls Report** | Control test results, evidence, findings, remediation | PDF + supporting workpapers | 7 years | SOX auditor |
| **Access Review Report** | Quarterly access reviews with findings and remediation | PDF | 3 years | SOC 2 / SOX auditor |
| **Encryption Compliance Report** | Encryption configuration for all systems handling sensitive data | PDF with configuration screenshots | 3 years | SOC 2 / HIPAA auditor |
| **Vendor Assessment Report** | Third-party vendor risk assessments and SOC 2 report status | PDF per vendor + summary | 3 years | SOC 2 / ISO auditor |
| **Data Processing Inventory** | All systems processing personal data, legal basis, data flows | ROPA (Record of Processing Activities) format | Ongoing | GDPR auditor / DPA |

### Export Generation Process

| Step | Activity | Owner | Timeline |
|---|---|---|---|
| 1 | Auditor submits data request | Auditor | — |
| 2 | Request logged and acknowledged | Compliance team | Within 1 business day |
| 3 | Data pulled from source systems | IT / Engineering | Within 2 business days |
| 4 | Data validated and formatted | Compliance team | Within 1 business day |
| 5 | Sensitive data redacted (if applicable) | Compliance team | Same day as step 4 |
| 6 | Report delivered to auditor | Compliance team | Within 24 hours of step 5 |
| 7 | Delivery logged | Compliance team | Same day |

### Data Redaction Rules for Audit Exports

| Data Type | Redaction Rule |
|---|---|
| Customer PII (names, emails) | Pseudonymize unless auditor specifically requires real data and has appropriate NDA |
| Authentication credentials | Never export; export authentication events instead |
| Financial account numbers | Mask all but last 4 digits |
| IP addresses | Include in access logs; redact from other reports |
| Employee SSN / personal identifiers | Never include; use employee ID only |

---

## 7. Compliance Calendar

### Annual Compliance Activities

| Month | Activity | Framework | Owner | Duration |
|---|---|---|---|---|
| January | Annual risk assessment kickoff | SOC 2 / ISO | CISO | 4 weeks |
| January | GDPR annual policy review | GDPR | Privacy Officer | 2 weeks |
| February | Annual risk assessment completion | SOC 2 / ISO | CISO | — |
| February | Penetration test (annual) | SOC 2 / HIPAA | CISO | 2-3 weeks |
| March | Q1 access reviews | All | IT | 2 weeks |
| March | SOC 2 audit prep (if Type II period starts in April) | SOC 2 | Compliance | 2 weeks |
| April | SOC 2 Type II observation period begins | SOC 2 | Auditor | Ongoing (12 months) |
| June | Q2 access reviews | All | IT | 2 weeks |
| June | Mid-year compliance review | All | CISO | 1 week |
| July | GDPR Transfer Impact Assessment review | GDPR | Privacy Officer | 2 weeks |
| August | Vendor security assessment annual review | SOC 2 / ISO | Vendor Mgmt | 4 weeks |
| September | Q3 access reviews | All | IT | 2 weeks |
| October | Security awareness training (annual) | All | CISO | 2 weeks |
| October | Business continuity / DR test (annual) | SOC 2 | IT | 1 week |
| November | SOC 2 audit evidence collection | SOC 2 | Compliance | 3 weeks |
| December | Q4 access reviews | All | IT | 2 weeks |
| December | Annual compliance summary for board | All | CISO | 1 week |

### Certification Renewal Tracking

| Certification | Issue Date | Expiry Date | Renewal Lead Time | Owner | Status |
|---|---|---|---|---|---|
| SOC 2 Type II | — | — | 3 months | CISO | — |
| ISO 27001 | — | — | 6 months | CISO | — |
| PCI DSS | — | — | 3 months | CISO | — |
| Privacy Shield (if applicable) | — | — | — | Privacy Officer | — |
| Cyber insurance | — | — | 2 months | CFO | — |

### Recurring Regulatory Filing Deadlines

| Filing | Jurisdiction | Frequency | Deadline | Owner | Status |
|---|---|---|---|---|---|
| GDPR ROPA update | EU | Annual | — | Privacy Officer | — |
| CCPA annual disclosure | California | Annual | — | Privacy Officer | — |
| Data breach notification (if applicable) | Multiple | Within required timeframe | N/A (event-driven) | CISO + Legal | — |
| Tax filings (VAT, GST) | Multiple | Quarterly / Monthly | Varies | Finance | — |
| SEC filings (if public) | USA | Quarterly / Annual | 10-Q: 40-45 days; 10-K: 60-90 days | CFO | — |

---

## 8. Automated Compliance Monitoring

### Monitoring Rules

Automated rules that continuously check compliance posture and flag violations in real-time.

| Rule | Check | Frequency | Alert Target | Severity |
|---|---|---|---|---|
| Unencrypted data at rest | Scan storage configurations for encryption status | Daily | CISO | Critical |
| Expired TLS certificates | Check certificate expiry dates | Daily | DevOps | High |
| Orphaned user accounts | Compare HR termination list with active accounts | Daily | IT | High |
| Excessive privilege | Flag accounts with admin access that haven't used it in 90 days | Weekly | IT | Medium |
| Failed access attempts | > 10 failed logins from single IP in 1 hour | Real-time | Security team | High |
| Production access without ticket | Production environment access without corresponding approved change request | Real-time | Engineering Manager | High |
| Data export without approval | Bulk data export events without corresponding approved request | Real-time | CISO | Critical |
| DSR approaching deadline | DSR within 5 days of 30-day deadline | Daily | Privacy Officer | High |
| BAA approaching expiry | Business associate agreement within 90 days of expiry | Weekly | Legal | Medium |
| Security training overdue | Employee has not completed annual security training | Monthly | HR + CISO | Medium |
| Backup verification failure | Backup job failure or restore test failure | Daily | DevOps | High |
| Vulnerability SLA breach | Critical vulnerability open > 7 days, High > 30 days | Daily | CISO | High / Medium |
| Consent record gaps | New users without consent records | Daily | Product | Medium |

### Monitoring Tool Integration

| Tool Category | Examples | What It Monitors | Integration Method |
|---|---|---|---|
| Cloud security posture | AWS Config, GCP Security Command Center, Azure Security Center | Infrastructure configuration compliance | API / native alerts |
| Identity & access management | Okta, Azure AD, AWS IAM | User access, authentication events | SIEM integration |
| SIEM | Datadog, Splunk, Elastic | Aggregated security events, anomaly detection | Central log aggregation |
| Vulnerability scanning | Snyk, Qualys, Nessus | Application and infrastructure vulnerabilities | CI/CD integration + scheduled scans |
| Data loss prevention | Nightfall, Symantec DLP | Sensitive data exposure detection | API integration, email scanning |
| Compliance platform | Vanta, Drata, Secureframe | Continuous compliance monitoring | Agent-based + API |

### Compliance Violation Response Protocol

| Severity | Response Time | Action | Escalation |
|---|---|---|---|
| Critical | Immediate (< 1 hour) | Contain, investigate, notify CISO and Legal | CEO within 4 hours |
| High | Within 4 hours | Investigate, create remediation plan | CISO review |
| Medium | Within 24 hours | Investigate, schedule remediation | Include in weekly review |
| Low | Within 1 week | Log and schedule for next maintenance cycle | Monthly review |

### Compliance Metrics Dashboard

| Metric | Current | Target | Trend |
|---|---|---|---|
| Overall control effectiveness | —% | > 95% | — |
| Mean time to remediate findings | — days | < 30 days | — |
| Open audit findings | — | 0 critical, < 5 total | — |
| Overdue audit findings | — | 0 | — |
| Security training completion | —% | 100% | — |
| Access review completion | —% | 100% | — |
| DSR on-time completion | —% | 100% | — |
| Vulnerability SLA compliance | —% | > 95% | — |
| Automated monitoring coverage | —% | > 90% | — |

---

## 9. Cross-References

| Reference | Location | Relationship |
|---|---|---|
| Legal documents | Section 29 (legal documents: `privacy-policy.template.md`, `terms-of-service.template.md`) | Privacy policy, terms of service, DPA templates |
| Security audit | Section 08 `SECURITY-AUDIT-CHECKLIST.md` | Security hardening controls overlap with SOC 2 / ISO controls |
| Incident response | Section 21 `incident-response-runbook.template.md` | Incident management procedures support SOC 2 and HIPAA compliance |
| Board deck | `board-deck-templates.template.md` (this section) | Slide 9 (Risks) may include compliance risks; annual compliance summary for board |
| Geographic analysis | `geographic-segment-analysis.template.md` (this section) | Regulatory implications by geography inform compliance requirements |
| Data architecture | Section 02 (if applicable) | Data flows, storage locations, and processing activities inform GDPR ROPA |
| Vendor management | Section 34 hardening | Third-party risk assessments support SOC 2 vendor management criteria |
| Billing system | Section 30 `billing-domain-model.template.md` | PCI DSS compliance relates to payment handling |
