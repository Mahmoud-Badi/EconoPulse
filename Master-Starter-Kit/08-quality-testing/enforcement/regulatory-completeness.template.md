# Regulatory Completeness Check — Gate 15 Proof Artifact

> **Purpose:** Verifies that every regulatory requirement has a corresponding implementation plan (task, config, process, or vendor).
> **Gate:** 15 (Regulatory Completeness) — Conditional
> **Trigger:** After Step 14 (Security Hardening) — only when `{{COMPLIANCE_REQUIREMENTS}}` != "none"
> **Skip if:** No regulatory compliance requirements exist.

---

## Instructions

1. List every applicable regulation and its specific requirements
2. Map each requirement to an implementation: code task, configuration, process, or vendor
3. Classify each as "MVP required" vs "post-MVP"
4. Verify 100% coverage — no requirement can be unmapped

---

## Regulatory Requirement Matrix

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "hipaa" -->
### HIPAA Requirements

| # | Requirement | Category | Implementation | Task ID | MVP Required? | Status |
|---|------------|----------|----------------|---------|---------------|--------|
| H1 | Access controls (unique user ID) | Security Rule §164.312(a) | Auth service — role-based access | {{task_id}} | ☐ Yes | ☐ Mapped |
| H2 | Audit controls (activity logging) | Security Rule §164.312(b) | Audit log service | {{task_id}} | ☐ Yes | ☐ Mapped |
| H3 | Integrity controls (data validation) | Security Rule §164.312(c) | Input validation + checksums | {{task_id}} | ☐ Yes | ☐ Mapped |
| H4 | Transmission security (encryption in transit) | Security Rule §164.312(e) | TLS 1.3 + certificate pinning | {{task_id}} | ☐ Yes | ☐ Mapped |
| H5 | Encryption at rest | Security Rule §164.312(a)(2)(iv) | Database encryption + KMS | {{task_id}} | ☐ Yes | ☐ Mapped |
| H6 | Automatic logoff | Security Rule §164.312(a)(2)(iii) | Session timeout (15 min) | {{task_id}} | ☐ Yes | ☐ Mapped |
| H7 | Emergency access procedure | Security Rule §164.312(a)(2)(ii) | Break-glass admin access | {{task_id}} | ☐ No — post-MVP | ☐ Mapped |
| H8 | BAA with hosting provider | Administrative §164.314 | Vendor agreement | N/A — vendor | ☐ Yes | ☐ Mapped |
| H9 | BAA with all subprocessors | Administrative §164.314 | Vendor agreements | N/A — vendor | ☐ Yes | ☐ Mapped |
| H10 | Risk assessment | Administrative §164.308(a)(1) | Annual assessment process | N/A — process | ☐ Yes | ☐ Mapped |
| H11 | Workforce training | Administrative §164.308(a)(5) | Training program | N/A — process | ☐ Yes | ☐ Mapped |
| H12 | Incident response plan | Administrative §164.308(a)(6) | IR documentation | {{task_id}} | ☐ Yes | ☐ Mapped |
| H13 | Backup and recovery | Administrative §164.308(a)(7) | DR playbooks | {{task_id}} | ☐ Yes | ☐ Mapped |
| H14 | Minimum necessary access | Privacy Rule §164.502(b) | Role-based permissions | {{task_id}} | ☐ Yes | ☐ Mapped |
| H15 | Patient right to access records | Privacy Rule §164.524 | Data export API | {{task_id}} | ☐ Yes | ☐ Mapped |
<!-- ENDIF -->

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "pci" -->
### PCI DSS Requirements

| # | Requirement | PCI DSS Ref | Implementation | Task ID | MVP Required? | Status |
|---|------------|-------------|----------------|---------|---------------|--------|
| P1 | Install and maintain firewall | Req 1 | Cloud security groups + WAF | {{task_id}} | ☐ Yes | ☐ Mapped |
| P2 | No vendor-supplied defaults | Req 2 | Configuration hardening | {{task_id}} | ☐ Yes | ☐ Mapped |
| P3 | Protect stored cardholder data | Req 3 | Tokenization (Stripe) | {{task_id}} | ☐ Yes | ☐ Mapped |
| P4 | Encrypt transmission | Req 4 | TLS 1.2+ everywhere | {{task_id}} | ☐ Yes | ☐ Mapped |
| P5 | Anti-virus/malware protection | Req 5 | Server hardening | {{task_id}} | ☐ Yes | ☐ Mapped |
| P6 | Secure systems and applications | Req 6 | Secure SDLC, code review | {{task_id}} | ☐ Yes | ☐ Mapped |
| P7 | Restrict access by need-to-know | Req 7 | RBAC | {{task_id}} | ☐ Yes | ☐ Mapped |
| P8 | Unique IDs for each user | Req 8 | Auth service | {{task_id}} | ☐ Yes | ☐ Mapped |
| P9 | Restrict physical access | Req 9 | Cloud provider (N/A for SaaS) | N/A | ☐ Yes | ☐ Mapped |
| P10 | Track and monitor access | Req 10 | Audit logging | {{task_id}} | ☐ Yes | ☐ Mapped |
| P11 | Test security systems regularly | Req 11 | Pen testing + ASV scans | N/A — process | ☐ Yes | ☐ Mapped |
| P12 | Maintain security policy | Req 12 | Security documentation | {{task_id}} | ☐ Yes | ☐ Mapped |
<!-- ENDIF -->

---

## Industry-Specific Requirements

<!-- IF {{DOMAIN}} == "ems" OR {{DOMAIN}} == "healthcare" -->
### NEMSIS / State EMS Requirements

| # | Requirement | Authority | Implementation | Task ID | MVP Required? | Status |
|---|------------|-----------|----------------|---------|---------------|--------|
| N1 | NEMSIS v3.5 data format | NHTSA | ePCR data export | {{task_id}} | ☐ Yes — can't sell without | ☐ Mapped |
| N2 | State reporting format | State EMS Office | State-specific export adapter | {{task_id}} | ☐ Yes — per state | ☐ Mapped |
| N3 | Vendor certification | State EMS Board | Certification application + testing | N/A — process | ☐ Yes — legal requirement | ☐ Mapped |
<!-- ENDIF -->

---

## MVP vs Post-MVP Classification

### Legally Required at Launch (Cannot ship without these)

| # | Requirement | Why It's Blocking |
|---|------------|-------------------|
| {{req}} | {{explanation — e.g., "Can't process payments without PCI compliance"}} |

### Nice to Have at Launch (Can ship without, but should plan)

| # | Requirement | When to Implement | Risk of Deferral |
|---|------------|-------------------|------------------|
| {{req}} | {{timeline}} | {{what could go wrong}} |

---

## Pass Criteria

- [ ] Every applicable regulation is listed
- [ ] Every requirement has an implementation mapping (code, config, process, or vendor)
- [ ] Every "MVP Required" item has a task ID
- [ ] Zero unmapped requirements
- [ ] MVP-blocking requirements are clearly separated from post-MVP
- [ ] Any deferred requirements have documented risk assessment

**If any requirement is unmapped:** Create the missing task or process documentation before proceeding.
