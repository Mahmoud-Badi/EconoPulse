# Privacy Impact Assessment Framework

> {{PROJECT_NAME}} — DPIA process, risk assessment matrix, mitigation measures, DPO sign-off, and DPIA register for high-risk data processing activities.

---

## 1. When a DPIA Is Required

Under GDPR Article 35, a Data Protection Impact Assessment is mandatory when processing is "likely to result in a high risk to the rights and freedoms of natural persons." The following triggers require a DPIA:

### Mandatory DPIA Triggers

| Trigger | Description | Examples |
|---------|-------------|---------|
| **Systematic and extensive profiling** | Automated processing including profiling with legal or significant effects | Credit scoring, insurance pricing, employment screening |
| **Large-scale processing of sensitive data** | Processing special categories (Art. 9) or criminal data (Art. 10) at scale | Health records platform, biometric access system |
| **Systematic monitoring of public areas** | Large-scale monitoring of publicly accessible areas | CCTV with facial recognition, public Wi-Fi tracking |
| **New technologies** | Processing using new or innovative technologies | AI/ML-based decisions, IoT data collection, blockchain identity |
| **Automated decision-making with legal effects** | Decisions that produce legal or similarly significant effects | Loan approvals, automated hiring, insurance claims |
| **Large-scale processing** | Processing personal data of a large number of data subjects | Nationwide service, social network, public health system |
| **Matching or combining datasets** | Combining data from multiple sources in unexpected ways | Cross-referencing customer data with third-party data |
| **Vulnerable data subjects** | Processing data of children, employees, patients | EdTech platform, HR system, patient portal |
| **Preventing data subjects from exercising rights** | Processing that could limit data subject rights | Mandatory biometric access, non-optional tracking |

### Two-or-More Rule

The European Data Protection Board recommends a DPIA when two or more of the following criteria apply:

- [ ] Evaluation or scoring (profiling, predicting)
- [ ] Automated decision-making with legal or significant effect
- [ ] Systematic monitoring
- [ ] Sensitive data or data of a highly personal nature
- [ ] Data processed on a large scale
- [ ] Matching or combining datasets
- [ ] Data concerning vulnerable data subjects
- [ ] Innovative use or application of new technologies
- [ ] Processing that prevents data subjects from exercising a right or using a service

**If two or more boxes are checked, a DPIA is required.**

### DPIA Screening for {{PROJECT_NAME}}

| Processing Activity | Triggers Met | DPIA Required? | Priority |
|--------------------|-------------|---------------|---------|
| *(List each processing activity from your register)* | *(List matching triggers)* | Yes / No | High / Medium / Low |

---

## 2. DPIA Process Steps

### Step 1: Describe the Processing

| Field | Detail |
|-------|--------|
| **Processing activity name** | *(name from register)* |
| **Description** | *(detailed description of what happens with the data)* |
| **Purpose** | *(why this processing is necessary)* |
| **Legal basis** | *(consent / contract / legitimate interest / etc.)* |
| **Data categories** | *(what personal data is involved)* |
| **Data subjects** | *(whose data — users, employees, patients, etc.)* |
| **Data volume** | *(approximate number of data subjects and records)* |
| **Data flow** | *(how data moves — reference data-flow-mapping.template.md)* |
| **Retention period** | *(how long data is kept)* |
| **Third parties** | *(who receives the data)* |
| **Cross-border transfers** | *(any transfers outside the jurisdiction)* |
| **Technology used** | *(relevant technology — AI/ML, biometrics, IoT, etc.)* |

### Step 2: Assess Necessity and Proportionality

- [ ] Is this processing necessary to achieve the stated purpose?
- [ ] Could the purpose be achieved with less data? (data minimization)
- [ ] Could the purpose be achieved without identifying individuals? (pseudonymization/anonymization)
- [ ] Is the data quality sufficient for the purpose?
- [ ] Are data subjects adequately informed? (transparency)
- [ ] Can data subjects exercise their rights effectively?
- [ ] Is there a mechanism for data subjects to complain or seek redress?
- [ ] Is the retention period the minimum necessary?

### Step 3: Identify Risks

For each risk, assess both the **likelihood** and the **impact** on data subjects.

**Risk categories to evaluate:**

| Risk Category | Description | Example Risks |
|--------------|-------------|---------------|
| **Unauthorized access** | Data accessed by unauthorized parties | Breach, insider threat, misconfigured access |
| **Unauthorized modification** | Data altered without authorization | Data corruption, injection attack |
| **Data loss** | Data destroyed or unavailable | Accidental deletion, ransomware, hardware failure |
| **Excessive collection** | More data collected than necessary | Feature creep, analytics over-collection |
| **Purpose creep** | Data used for purposes beyond original consent | Marketing use of support data, profiling from billing |
| **Re-identification** | Pseudonymized data linked back to individuals | Combining datasets, insufficient anonymization |
| **Discrimination** | Processing leads to unfair treatment | Biased algorithms, discriminatory profiling |
| **Physical harm** | Processing could lead to physical harm | Location tracking misuse, health data exposure |
| **Financial harm** | Processing could cause financial loss | Payment data breach, credit score impact |
| **Reputational harm** | Processing could damage reputation | Sensitive data exposure, embarrassing profiling |
| **Loss of autonomy** | Processing limits individual choice | Manipulative personalization, dark patterns |
| **Chilling effect** | Processing deters lawful behavior | Surveillance, activity monitoring |

---

## 3. Risk Assessment Matrix

### Likelihood Scale

| Level | Score | Definition | Indicators |
|-------|-------|-----------|-----------|
| **Rare** | 1 | Highly unlikely to occur | No known precedent, strong controls in place |
| **Unlikely** | 2 | Could occur but not expected | Precedent exists but with different systems |
| **Possible** | 3 | Might occur at some point | Has occurred in similar systems |
| **Likely** | 4 | Expected to occur | Has occurred in this system or regularly in similar ones |
| **Almost certain** | 5 | Expected to occur frequently | Active exploitation or known vulnerability |

### Impact Scale

| Level | Score | Definition | Data Subject Impact |
|-------|-------|-----------|-------------------|
| **Negligible** | 1 | Minimal inconvenience | Minor annoyance, no lasting effect |
| **Limited** | 2 | Significant inconvenience | Temporary loss of access, minor financial impact |
| **Significant** | 3 | Serious consequences | Financial loss, reputational damage, distress |
| **Maximum** | 4 | Severe or irreversible consequences | Major financial loss, long-term harm, discrimination |
| **Critical** | 5 | Life-threatening or catastrophic | Physical danger, identity theft, fundamental rights violation |

### Risk Score Matrix

| | Negligible (1) | Limited (2) | Significant (3) | Maximum (4) | Critical (5) |
|---|---|---|---|---|---|
| **Almost certain (5)** | 5 - Medium | 10 - High | 15 - Critical | 20 - Critical | 25 - Critical |
| **Likely (4)** | 4 - Low | 8 - Medium | 12 - High | 16 - Critical | 20 - Critical |
| **Possible (3)** | 3 - Low | 6 - Medium | 9 - High | 12 - High | 15 - Critical |
| **Unlikely (2)** | 2 - Low | 4 - Low | 6 - Medium | 8 - Medium | 10 - High |
| **Rare (1)** | 1 - Low | 2 - Low | 3 - Low | 4 - Low | 5 - Medium |

### Risk Response Thresholds

| Risk Level | Score Range | Required Response |
|-----------|------------|------------------|
| **Critical** | 15-25 | Processing must NOT proceed without DPO and supervisory authority consultation. Implement all possible mitigations. |
| **High** | 9-14 | Processing may proceed only with documented mitigations and DPO approval. Review quarterly. |
| **Medium** | 5-8 | Processing may proceed with standard mitigations. Review semi-annually. |
| **Low** | 1-4 | Processing may proceed. Document acceptance. Review annually. |

### Risk Register Template

| Risk ID | Risk Description | Category | Likelihood | Impact | Score | Level | Mitigation | Residual Score | Owner |
|---------|-----------------|----------|-----------|--------|-------|-------|-----------|----------------|-------|
| R-001 | Unauthorized access to user profiles via API vulnerability | Unauthorized access | 3 | 3 | 9 | High | API auth, rate limiting, input validation | 4 | Security lead |
| R-002 | Analytics data re-identification through combining datasets | Re-identification | 2 | 3 | 6 | Medium | k-anonymity enforcement, differential privacy | 3 | Data team |
| R-003 | Excessive PII in application logs | Excessive collection | 4 | 2 | 8 | Medium | PII scrubbing middleware, log review | 3 | DevOps lead |
| R-004 | *(Add risks specific to each processing activity)* | | | | | | | | |

---

## 4. Mitigation Measures

### Standard Mitigation Catalog

| Mitigation | Addresses Risk Category | Implementation Effort | Effectiveness |
|-----------|----------------------|---------------------|---------------|
| **Encryption at rest** | Unauthorized access | Low | High |
| **Encryption in transit (TLS 1.3)** | Unauthorized access | Low | High |
| **Field-level encryption** | Unauthorized access, breach impact | Medium | Very high |
| **Pseudonymization** | Re-identification, breach impact | Medium | High |
| **Data minimization** | Excessive collection, breach impact | Low | High |
| **Purpose limitation (consent gates)** | Purpose creep | Medium | High |
| **Access control (RBAC/ABAC)** | Unauthorized access | Medium | High |
| **Audit logging** | Unauthorized access, modification | Low | Medium (detective) |
| **Automated purge** | Excessive retention | Medium | High |
| **Differential privacy** | Re-identification | High | Very high |
| **Anonymization** | Re-identification | Medium | Very high (if done correctly) |
| **Bias auditing** | Discrimination | High | Medium (ongoing effort) |
| **Explainability infrastructure** | Discrimination, loss of autonomy | High | Medium |
| **Consent management** | Purpose creep, loss of autonomy | Medium | High |
| **Human review mechanism** | Discrimination, automated decisions | Medium | High |
| **Breach response plan** | All categories | Medium | High (response speed) |
| **Penetration testing** | Unauthorized access | Medium | High (point-in-time) |
| **Security awareness training** | Unauthorized access, social engineering | Low | Medium |

---

## 5. DPO Sign-Off Checklist

<!-- IF {{DPO_REQUIRED}} == "true" -->
The Data Protection Officer must sign off on every completed DPIA before processing begins.
<!-- ENDIF -->
<!-- IF {{DPO_REQUIRED}} == "false" -->
Even without a mandatory DPO, designate a privacy lead to review and approve DPIAs.
<!-- ENDIF -->

### Sign-Off Checklist

- [ ] Processing description is complete and accurate
- [ ] All applicable DPIA triggers have been identified
- [ ] Necessity and proportionality assessment is documented
- [ ] All risks have been identified and scored
- [ ] Mitigations are defined for all High and Critical risks
- [ ] Residual risk after mitigation is acceptable (no Critical residual risks)
- [ ] Data subjects are adequately informed about the processing
- [ ] Data subject rights mechanisms are functional
- [ ] Retention periods are defined and justified
- [ ] Third-party processors have signed DPAs
- [ ] Cross-border transfers have documented legal mechanisms
- [ ] Consent mechanisms (where applicable) are implemented
- [ ] Privacy notice has been updated to reflect this processing
- [ ] Review schedule has been defined

### Approval Record

| Field | Value |
|-------|-------|
| DPIA conducted by | *(name and role)* |
| DPIA reviewed by | {{DPO_CONTACT}} |
| Review date | *(date)* |
| Decision | Approved / Approved with conditions / Rejected / Escalated to supervisory authority |
| Conditions (if any) | *(list conditions)* |
| Next review date | *(date — maximum 12 months)* |
| Supervisory authority consulted? | Yes / No |

---

## 6. DPIA Register

Maintain a register of all completed DPIAs for regulatory audits and internal tracking.

### DPIA Register Template

| DPIA ID | Processing Activity | Trigger(s) | Status | Risk Level (Pre-Mitigation) | Risk Level (Post-Mitigation) | DPO Approved | Last Reviewed | Next Review |
|---------|--------------------|-----------| -------|---------------------------|----------------------------|--------------| -------------|-------------|
| DPIA-001 | *(activity name)* | *(trigger list)* | Approved | High | Medium | Yes (date) | YYYY-MM-DD | YYYY-MM-DD |
| DPIA-002 | | | | | | | | |

### DPIA Review Cadence

| Event | Action Required |
|-------|----------------|
| New processing activity with DPIA trigger | Conduct DPIA before processing begins |
| Significant change to existing processing | Review and update existing DPIA |
| New technology adopted | Assess whether DPIA is needed |
| Data breach involving DPIA-covered processing | Review DPIA, update risk assessment |
| Regulatory guidance change | Review all affected DPIAs |
| Scheduled review date reached | Full DPIA review (minimum annually) |
| Sub-processor change for DPIA-covered processing | Review transfer and processor sections |

### DPIA Implementation Checklist

- [ ] DPIA triggers are documented and socialized with engineering teams
- [ ] DPIA template is accessible to all product and engineering teams
- [ ] DPIA screening is part of the feature development process (before coding begins)
- [ ] Risk assessment matrix is calibrated to the organization's context
- [ ] Mitigation catalog is maintained and updated
- [ ] DPO or privacy lead is available for DPIA reviews
- [ ] DPIA register is maintained and auditable
- [ ] Review schedule is enforced with calendar reminders
- [ ] Supervisory authority consultation process is documented (for Critical risks)
- [ ] DPIA outcomes feed back into the processing activity register
