# Compliance Cost Overlay — {{PROJECT_NAME}}

> **Purpose:** Adds compliance-related cost overhead to infrastructure estimates. Many compliance requirements (HIPAA BAAs, SOC 2 audits, PCI scanning) add significant costs that are invisible in standard infrastructure pricing.
> **When:** Step 17 (Infrastructure Sizing) — only when `{{COMPLIANCE_REQUIREMENTS}}` != "none"
> **Skip if:** No regulatory compliance requirements exist.

---

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "hipaa" -->
## HIPAA Compliance Cost Overlay

### Infrastructure Overhead

| Item | Description | Monthly Cost | Notes |
|------|------------|-------------|-------|
| BAA-eligible hosting | Cloud provider BAA (AWS, GCP, Azure) | $0 - $100/mo | Included in some plans, premium tier in others |
| BAA-eligible database | Managed DB with BAA | +$50 - $200/mo | Premium tier required for BAA |
| BAA-eligible storage | Object storage with encryption at rest | +$20 - $100/mo | S3 with SSE-KMS, GCS with CMEK |
| Audit log storage | Immutable audit logs (CloudTrail, etc.) | +$50 - $300/mo | Grows with usage; 7-year retention |
| Encryption at rest | KMS key management | +$10 - $50/mo | Per-key charges |
| Encrypted backups | Encrypted backup storage | +$30 - $150/mo | Encrypted daily backups + point-in-time recovery |
| WAF / DDoS protection | Web Application Firewall | +$20 - $200/mo | Required for web-facing PHI systems |
| VPN / private networking | Private connectivity for admin access | +$50 - $300/mo | Site-to-site VPN or private endpoints |

### Operational Overhead

| Item | Description | Annual Cost | Frequency |
|------|------------|------------|-----------|
| HIPAA Security Risk Assessment | Required annual assessment | $5,000 - $25,000 | Annual |
| Penetration testing | Third-party pen test | $3,000 - $15,000 | Annual |
| Security training | HIPAA workforce training | $500 - $2,000 | Annual |
| Incident response retainer | Optional IR firm retainer | $2,000 - $10,000 | Annual |
| Compliance scanning tools | Automated compliance checks | $100 - $500/mo | Monthly |

### Per-Tier Impact

| Tier | Base Cost (no compliance) | HIPAA Overhead | Total with HIPAA |
|------|--------------------------|----------------|------------------|
| Starter (1-10 users) | {{base}} | +$200 - $500/mo | {{total}} |
| Growth (11-100 users) | {{base}} | +$500 - $1,500/mo | {{total}} |
| Scale (101-1000 users) | {{base}} | +$1,500 - $3,000/mo | {{total}} |
| Enterprise (1000+) | {{base}} | +$3,000 - $10,000/mo | {{total}} |
<!-- ENDIF -->

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "pci" -->
## PCI DSS Compliance Cost Overlay

### Infrastructure Overhead

| Item | Description | Monthly Cost |
|------|------------|-------------|
| PCI-compliant hosting | Segmented network environment | +$100 - $500/mo |
| Tokenization service | Card data tokenization (Stripe, etc.) | Included in processing fees |
| WAF | Web Application Firewall | +$20 - $200/mo |
| Vulnerability scanning | ASV quarterly scans | +$100 - $300/quarter |
| Log management | Centralized logging with 1-year retention | +$50 - $300/mo |
| File integrity monitoring | FIM solution | +$50 - $200/mo |

### Operational Overhead

| Item | Description | Annual Cost |
|------|------------|------------|
| PCI SAQ / ROC | Self-Assessment or Report on Compliance | $1,000 - $50,000 |
| Penetration testing | Required annual pen test | $3,000 - $15,000 |
| ASV scanning | Quarterly external vulnerability scans | $400 - $1,200 |
<!-- ENDIF -->

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "gdpr" -->
## GDPR Compliance Cost Overlay

### Infrastructure Overhead

| Item | Description | Monthly Cost |
|------|------------|-------------|
| EU data residency | Hosting in EU region | +$0 - $100/mo (may be more expensive) |
| Data encryption | Encryption at rest and in transit | +$10 - $50/mo |
| Consent management | Cookie consent + preference center | +$0 - $100/mo |
| Data export/deletion | Automated DSAR tooling | +$50 - $200/mo |

### Operational Overhead

| Item | Description | Annual Cost |
|------|------------|------------|
| DPO (Data Protection Officer) | Internal or external DPO | $2,000 - $50,000 |
| DPIA (Data Protection Impact Assessment) | Required for high-risk processing | $2,000 - $10,000 |
| Privacy training | Staff awareness training | $500 - $2,000 |
<!-- ENDIF -->

<!-- IF {{COMPLIANCE_REQUIREMENTS}} == "soc2" -->
## SOC 2 Compliance Cost Overlay

### Operational Overhead

| Item | Description | Annual Cost |
|------|------------|------------|
| SOC 2 Type I audit | First-time audit | $20,000 - $50,000 |
| SOC 2 Type II audit | Ongoing annual audit | $30,000 - $100,000 |
| GRC platform | Compliance management tool (Vanta, Drata, etc.) | $5,000 - $25,000/year |
| Penetration testing | Required for SOC 2 | $3,000 - $15,000 |
| Security awareness training | Employee training program | $1,000 - $5,000 |
<!-- ENDIF -->

---

## Compliance Cost Summary

| Compliance Framework | Monthly Infrastructure Overhead | Annual Operational Overhead | Break-Even Monthly Revenue |
|---------------------|---------------------------------|----------------------------|---------------------------|
| {{framework_1}} | ${{amount}} | ${{amount}} | ${{amount}} |
| {{framework_2}} | ${{amount}} | ${{amount}} | ${{amount}} |
| **Total** | **${{amount}}** | **${{amount}}** | **${{amount}}** |

---

## Key Decision: Build vs Buy Compliance

| Approach | Cost | Time to Compliance | Ongoing Effort |
|----------|------|-------------------|----------------|
| DIY (internal team) | Lower $ but high time cost | 3-6 months | High — manual evidence collection |
| GRC Platform (Vanta, Drata) | $5K-25K/year | 1-3 months | Medium — automated evidence |
| Compliance Consultant | $10K-50K one-time | 1-2 months | Low — they guide you |

**Recommendation:** {{which approach fits this project's stage, budget, and timeline}}
