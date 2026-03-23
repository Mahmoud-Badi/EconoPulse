# Phase 42: Data Privacy Engineering

> Privacy is not a feature you bolt on before launch. It is an architectural constraint that shapes how you collect, store, process, and delete every piece of personal data. This section turns regulatory requirements into engineering specifications.

---

## Why This Exists

Section 29 generates legal documents — privacy policies, data processing agreements, terms of service. Section 14 hardens security — encryption, access controls, vulnerability scanning. Neither answers the engineering question of HOW to build systems that actually implement privacy at the infrastructure level. A privacy policy that promises "we delete your data upon request" is meaningless if your architecture lacks a mechanism to discover, correlate, and purge a user's data across twelve microservices, three analytics pipelines, and four backup systems. This section bridges the gap between what your legal documents promise and what your code actually does.

Privacy engineering is not security engineering with a different name. Security protects data from unauthorized access. Privacy protects individuals from authorized access — it constrains what your own systems are permitted to do with data you have every right to hold. Your database administrator can access every table. Privacy engineering ensures they have no reason to, because the system enforces purpose limitation, data minimization, and retention boundaries at the application layer. Teams that treat privacy as a subset of security build secure systems that still violate GDPR because they collect more data than necessary, retain it longer than justified, and lack mechanisms for individuals to exercise their rights.

This section provides the technical architecture for privacy compliance. It covers data flow mapping, consent management, data subject request fulfillment, retention automation, privacy impact assessments, cookie consent implementation, cross-border transfer mechanisms, privacy-by-design patterns, data classification, and privacy testing. Every template produces engineering artifacts — database schemas, API endpoints, state machines, cron configurations — not legal prose. The legal prose lives in Section 29. The engineering that makes those promises real lives here.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 14.75** in the Orchestrator, after Legal Documents (Step 14.7) and before Billing (Step 14.8). Privacy engineering must follow legal document generation because the processing activities, legal bases, and data subject rights documented in Section 29 define what the engineering must implement. It must precede billing because payment processing involves sensitive financial data that requires privacy controls to be in place first.

This section always runs. Privacy is not conditional on jurisdiction, product type, or team size. Even products that only serve US customers with no GDPR obligations benefit from privacy engineering because CCPA, state-level laws, and user expectations all demand it. The decision tree in this section helps calibrate the depth of implementation, but the minimum baseline — data inventory, consent collection, deletion capability — applies universally.

**Relationship with Section 29 (Legal Documents):** Section 29 defines WHAT your privacy obligations are. Section 42 defines HOW you fulfill them in code. Your privacy policy from Section 29 lists the categories of data you collect, the purposes you collect it for, and the rights users can exercise. This section builds the processing activity register that maps those categories to actual database tables, the consent management system that enforces those purposes, and the DSR workflow that fulfills those rights. If Section 29 changes — a new processing activity, a revised legal basis — the corresponding templates in Section 42 must be updated.

**Relationship with Section 14 (Security Hardening):** Security provides the infrastructure that privacy depends on — encryption at rest, encryption in transit, access controls, audit logging. Section 42 builds on top of that infrastructure by adding purpose-bound access controls (not just role-based), consent-aware data flows, and automated retention enforcement. A system can be perfectly secure and completely non-compliant if it lacks privacy controls. Both sections are required.

**Relationship with Section 26 (Multi-Tenant SaaS):** Tenant isolation is a privacy requirement, not just an architecture preference. When one tenant's data leaks into another tenant's API response, that is both a security breach and a privacy violation. Section 26 handles tenant isolation at the infrastructure level. Section 42 adds privacy-specific concerns — per-tenant data processing agreements, tenant-specific retention policies, cross-tenant analytics that require anonymization or aggregation before combining.

**Relationship with Section 02 (Architecture):** Privacy-by-design decisions made in Section 42 feed back into the architecture defined in Section 02. Data minimization may require changing API response shapes. Purpose limitation may require splitting databases. Retention automation requires cron infrastructure. The data flow mapping template in this section produces a system inventory that should align with Section 02's architecture diagrams.

**Relationship with Section 35 (Business Intelligence):** Analytics and BI are where privacy violations most commonly occur. Raw PII flowing into data warehouses, analytics events capturing more data than necessary, dashboard access controls that expose sensitive segments. Section 35 defines the BI architecture. Section 42 constrains it — what data can flow into the warehouse, how it must be pseudonymized or aggregated, and what consent signals must gate analytics pipelines.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview and reading order for data privacy engineering | 14.75 |
| `privacy-engineering-decision-tree.md` | Guide | Adaptive decision tree for privacy architecture calibration | 14.75 |
| `records-of-processing.template.md` | Template | GDPR Article 30 processing activity register and documentation | 14.75 |
| `data-flow-mapping.template.md` | Template | System inventory, data flow diagrams, classification overlay | 14.75 |
| `consent-management.template.md` | Template | Consent collection, storage, signals, withdrawal, versioning | 14.75 |
| `dsr-workflow.template.md` | Template | Data subject request lifecycle, routing, fulfillment, erasure | 14.75 |
| `data-retention-policy.template.md` | Template | Retention schedules, automated purge architecture, litigation holds | 14.75 |
| `privacy-impact-assessment.template.md` | Template | PIA/DPIA framework, risk matrix, mitigation, DPO sign-off | 14.75 |
| `cookie-consent-implementation.template.md` | Template | Cookie audit, consent banner, TCF 2.2, server-side enforcement | 14.75 |
| `cross-border-transfers.template.md` | Template | Transfer mapping, SCCs, TIAs, supplementary measures | 14.75 |
| `privacy-by-design-patterns.md` | Guide | Reference patterns for data minimization, pseudonymization, purpose limitation | 14.75 |
| `data-classification-framework.template.md` | Template | Classification levels, handling rules, labeling standards | 14.75 |
| `privacy-testing-checklist.template.md` | Template | Privacy-specific test cases across consent, DSR, retention, transfers | 14.75 |
| `privacy-engineering-gotchas.md` | Guide | Production lessons for privacy engineering | 14.75 |

---

## Reading Order

1. **`privacy-engineering-decision-tree.md`** — Start here. Walk through the six decision nodes to calibrate your privacy architecture. Your jurisdictional scope, data sensitivity, and consent model determine which templates require deep investment and which need only baseline coverage.
2. **`data-flow-mapping.template.md`** — Map every system that touches personal data. You cannot protect what you have not inventoried. This produces the system-level view that every other template references.
3. **`data-classification-framework.template.md`** — Classify every data category by sensitivity level. Classification drives handling rules — encryption requirements, access controls, retention periods, and disposal methods.
4. **`records-of-processing.template.md`** — Build the GDPR Article 30 register. Even if GDPR does not apply to you, this register forces you to document what you collect, why, and for how long — which every privacy regulation requires in some form.
5. **`consent-management.template.md`** — Design the consent architecture. How you collect, store, version, and enforce consent determines whether your data processing is lawful.
6. **`dsr-workflow.template.md`** — Build the data subject request fulfillment system. When a user asks "delete my data," this is the engineering that makes it happen within 30 days.
7. **`data-retention-policy.template.md`** — Define retention schedules and build automated purge infrastructure. Data you no longer need is liability, not asset.
8. **`privacy-impact-assessment.template.md`** — Establish the DPIA process for high-risk processing activities. This is legally required under GDPR for certain processing types and good practice for all.
9. **`cookie-consent-implementation.template.md`** — Implement cookie consent if your product uses cookies or tracking technologies. This is the most user-visible privacy control.
10. **`cross-border-transfers.template.md`** — If you transfer data across borders, define your transfer mechanisms and conduct transfer impact assessments.
11. **`privacy-by-design-patterns.md`** — Reference guide for privacy-preserving engineering patterns. Consult this when implementing any feature that touches personal data.
12. **`privacy-testing-checklist.template.md`** — Define privacy-specific test cases. Privacy controls that are not tested are privacy controls that do not work.
13. **`privacy-engineering-gotchas.md`** — Read last. These production lessons will resonate more after you understand the full privacy engineering framework.

---

## Quick Start Checklist

- [ ] Complete the privacy engineering decision tree to determine jurisdictional scope and consent model
- [ ] Verify Section 29 legal documents are finalized (privacy policy, DPA, cookie policy)
- [ ] Inventory all systems that collect, store, or process personal data
- [ ] Classify all data categories using the data classification framework
- [ ] Build the GDPR Article 30 processing activity register
- [ ] Design consent collection points and implement the consent storage schema
- [ ] Build DSR fulfillment workflows with identity verification and cross-service discovery
- [ ] Define retention schedules for every data category and implement automated purging
- [ ] Conduct DPIAs for all high-risk processing activities
- [ ] Implement cookie consent with server-side enforcement
- [ ] If transferring data cross-border, document transfer mechanisms and conduct TIAs
- [ ] Write privacy-specific test cases and integrate into CI/CD
- [ ] Review privacy engineering gotchas and verify none apply to your architecture
- [ ] Schedule quarterly privacy review cadence

---

## Key Principles

**Privacy is an architecture constraint, not a feature.** Features are optional and additive. Privacy constraints are mandatory and subtractive — they limit what you can collect, how long you can keep it, who can access it, and what you can do with it. Treating privacy as a feature leads to bolt-on consent banners and checkbox compliance. Treating it as a constraint leads to systems that are private by construction.

**You cannot protect what you have not inventoried.** Before writing a single line of privacy code, map every system that touches personal data. Most privacy violations stem from forgotten data stores — the analytics warehouse nobody audits, the log aggregator that captures request bodies, the staging database that uses production data. The data flow map is the foundation of everything else in this section.

**Consent is not a boolean.** Users do not consent to "data processing." They consent to specific purposes, for specific data categories, with specific retention periods. A consent architecture that stores a single `has_consented: true` flag is legally insufficient under GDPR and practically useless for purpose limitation. Build granular consent from day one — retrofitting it requires re-consenting every user.

**Deletion is harder than storage.** Storing data is a single write. Deleting data requires discovery across every service, every backup, every analytics pipeline, every log aggregator, every third-party processor, and every derived dataset. Teams that design storage without designing deletion create systems that cannot fulfill erasure requests without heroic manual effort.

**Privacy debt compounds faster than technical debt.** Every new data collection point without proper consent, every new third-party integration without a DPA, every new analytics event without purpose documentation — these compound into a compliance gap that grows exponentially with your user base. A 1,000-user startup can fix privacy debt in a weekend. A 1,000,000-user company faces months of remediation and potential fines.

**Test privacy controls like you test security controls.** Privacy controls that are implemented but not tested are privacy controls that will break silently. Consent withdrawal should be tested as rigorously as authentication. DSR fulfillment should be tested as thoroughly as payment processing. Cookie consent enforcement should be verified on every deployment.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PRIVACY_JURISDICTIONS}}` | Applicable privacy jurisdictions | `gdpr`, `ccpa`, `gdpr,ccpa,lgpd` |
| `{{DATA_SENSITIVITY_LEVEL}}` | Highest data sensitivity level | `high`, `medium`, `low` |
| `{{CONSENT_MODEL}}` | Default consent model | `opt-in`, `opt-out`, `legitimate-interest` |
| `{{DPO_REQUIRED}}` | Whether a Data Protection Officer is required | `true`, `false` |
| `{{DPO_CONTACT}}` | DPO contact email | `dpo@example.com` |
| `{{DSR_SLA_DAYS}}` | Days to fulfill data subject requests | `30`, `45` |
| `{{DATA_RETENTION_DEFAULT}}` | Default data retention period | `24-months`, `36-months` |
| `{{COOKIE_CONSENT_PLATFORM}}` | Consent management platform | `onetrust`, `cookiebot`, `custom` |
| `{{CROSS_BORDER_MECHANISM}}` | Cross-border transfer mechanism | `adequacy`, `scc`, `bcr`, `none` |
| `{{PROCESSING_ACTIVITY_COUNT}}` | Number of processing activities | `8`, `15`, `30` |
| `{{SUB_PROCESSOR_COUNT}}` | Number of sub-processors | `3`, `8`, `15` |
| `{{PRIVACY_BY_DESIGN_LEVEL}}` | Privacy engineering maturity level | `basic`, `intermediate`, `advanced` |
| `{{AUTOMATED_DECISIONS}}` | Type of automated decision-making | `none`, `recommendations`, `scoring` |
| `{{DATA_CLASSIFICATION_LEVELS}}` | Number of classification tiers | `3`, `4` |
| `{{PURGE_AUTOMATION}}` | Level of purge automation | `manual`, `semi-automated`, `fully-automated` |
| `{{PRIVACY_SHIELD_REGION}}` | Primary data processing region | `eu-west-1`, `us-east-1` |
