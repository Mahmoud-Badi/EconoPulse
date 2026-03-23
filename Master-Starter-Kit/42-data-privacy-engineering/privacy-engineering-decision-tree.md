# Privacy Engineering Decision Tree

> Walk through six decision nodes to calibrate your privacy architecture. Each node narrows the engineering requirements and determines which templates need deep investment versus baseline coverage.

---

## Overview

Not every product needs the same privacy architecture. A B2B SaaS serving only US customers with no health or financial data has fundamentally different requirements than a consumer health app operating across the EU, Brazil, and Japan. This decision tree prevents both under-engineering (building a consent banner and calling it done) and over-engineering (implementing full GDPR Article 30 registers for a product that only collects email addresses).

Walk through Nodes 1-6 sequentially. Each node produces a decision that feeds into the next. The combination of all six decisions produces your **privacy engineering profile** — the specific set of templates and depth levels required for {{PROJECT_NAME}}.

**How to use this file:**
1. Read each node's description
2. Select the option that matches your situation
3. Note the downstream implications
4. After completing all six nodes, compile your privacy engineering profile

---

## Node 1 — Jurisdictional Scope

What privacy regulations apply to your product? This is determined by where your users are located, not where your company is incorporated. A US company with EU users is subject to GDPR. A Brazilian company with California users is subject to CCPA.

### Option A: EU / GDPR

| Pros | Cons |
|------|------|
| GDPR compliance covers most other jurisdictions by default | Highest implementation cost — full consent architecture, DPIA process, DPO requirement |
| Well-defined legal framework with extensive guidance | Strict requirements for lawful basis documentation |
| User trust signal — GDPR compliance is a competitive advantage | Consent fatigue risk if implemented poorly |
| Clear data subject rights framework | Cross-border transfer complexity (Schrems II) |

**Engineering implications:**
- Full Article 30 processing register required
- Granular consent architecture (purpose-specific, withdrawable)
- DSR fulfillment within 30 days (all six request types)
- DPIA required for high-risk processing
- Data Protection Officer required if core activity involves large-scale processing
- Cross-border transfer mechanisms (SCCs, adequacy decisions)

**Recommendation:** If you have or plan to have EU users, build for GDPR from day one. Retrofitting GDPR compliance costs 5-10x more than building it in.

### Option B: US / CCPA-CPRA

| Pros | Cons |
|------|------|
| Less prescriptive than GDPR — more flexibility in implementation | Patchwork of state laws creates compliance complexity |
| Opt-out model is less disruptive to user experience | Evolving landscape — new state laws every year |
| No DPO requirement | "Sale" of data definition is broader than expected |
| No mandatory DPIA process | Private right of action for data breaches |

**Engineering implications:**
- "Do Not Sell or Share My Personal Information" link required
- Opt-out mechanism for data sales/sharing
- Consumer request fulfillment within 45 days
- Data inventory required but less formal than Article 30
- No cross-border transfer restrictions (within US)
- Financial incentive disclosures if offering loyalty programs

**Recommendation:** If US-only, CCPA is the baseline. Build opt-out mechanisms and consumer request workflows. Monitor state-level laws (Virginia VCDPA, Colorado CPA, Connecticut CTDPA, etc.) as they may add requirements.

### Option C: Global / Multi-Jurisdiction

| Pros | Cons |
|------|------|
| Maximum market access | Highest complexity — must satisfy the strictest regulation in each jurisdiction |
| Future-proof against new regulations | Need jurisdiction detection and adaptive consent flows |
| Strongest user trust signal | Legal review costs increase significantly |
| Common framework can serve all jurisdictions | Some requirements conflict (GDPR right to erasure vs US data retention requirements) |

**Engineering implications:**
- Build to the strictest standard (usually GDPR) as the baseline
- Add jurisdiction-specific adaptations (CCPA opt-out, LGPD consent receipt, POPIA processing limitations)
- Implement geolocation-based consent flow selection
- Maintain per-jurisdiction processing registers
- Cross-border transfer mechanisms for all data flows
- Consider appointing EU and UK representatives

**Recommendation:** Build a GDPR-compliant core and layer jurisdiction-specific adaptations on top. Use feature flags to toggle jurisdiction-specific behaviors.

### Option D: Minimal / Pre-Regulation

| Pros | Cons |
|------|------|
| Lowest initial implementation cost | Privacy debt accumulates — will cost more to fix later |
| Faster time to market | User trust gap compared to privacy-forward competitors |
| Simpler architecture | Regulatory landscape is expanding, not contracting |
| Focus resources on product-market fit | One regulatory change can force emergency remediation |

**Engineering implications:**
- Minimum: data inventory, basic consent collection, deletion capability
- Recommended: implement privacy-by-design patterns even without regulatory pressure
- Required: cookie consent if using cookies (ePrivacy Directive applies broadly)
- Maintain the ability to upgrade privacy architecture quickly

**Recommendation:** Even with minimal regulatory exposure, implement the data flow map, basic consent, and deletion capability. These take days to build and months to retrofit.

---

## Node 2 — Data Sensitivity Level

What is the highest sensitivity level of personal data your product processes? This determines encryption requirements, access controls, retention limits, and DPIA triggers.

### Option A: High (Health Data, Financial Data, Biometrics, Genetic Data)

| Pros | Cons |
|------|------|
| Strong privacy architecture becomes a competitive moat | Sector-specific regulations layer on top (HIPAA, PCI-DSS, SOX) |
| Higher user trust when handling sensitive data well | Breach notification requirements are strictest |
| Justifies premium pricing for enterprise customers | Insurance and audit costs increase |
| Clear business case for privacy investment | Development velocity constrained by privacy reviews |

**Engineering implications:**
- Encryption at rest AND in transit (AES-256 minimum)
- Field-level encryption for the most sensitive columns
- DPIA mandatory for all processing activities involving this data
- Explicit consent required (legitimate interest rarely applies)
- Shorter retention periods — retain only as long as strictly necessary
- Breach notification within 72 hours (GDPR) or 60 days (HIPAA)
- Regular penetration testing with privacy-focused scope
- Access logging with tamper-proof audit trail

**Recommendation:** If processing high-sensitivity data, invest heavily in the privacy impact assessment template, data classification framework, and privacy-by-design patterns. Every feature involving sensitive data needs a DPIA before development begins.

### Option B: Medium (PII — Names, Emails, Phone Numbers, Addresses)

| Pros | Cons |
|------|------|
| Standard privacy architecture suffices — well-documented patterns | PII is the most commonly breached data category |
| Most privacy tools and frameworks target this level | Users increasingly expect privacy controls for basic PII |
| Reasonable balance between privacy investment and business velocity | Aggregated PII can reveal sensitive information (re-identification risk) |

**Engineering implications:**
- Encryption at rest and in transit (standard TLS + database encryption)
- Pseudonymization for analytics and development environments
- Standard consent architecture with purpose limitation
- DSR fulfillment across all services that store PII
- Retention enforcement with automated purging
- Third-party processor agreements for any service that receives PII

**Recommendation:** Most SaaS products fall here. Implement all templates at standard depth. Pay special attention to consent management and DSR workflows — these are where most compliance failures occur.

### Option C: Low (Pseudonymized Data, Aggregated Statistics, Public Data)

| Pros | Cons |
|------|------|
| Lightest privacy architecture | Pseudonymized is not anonymous — re-identification risk remains |
| Reduced DPIA requirements | Regulatory interpretation of "personal data" is expanding |
| Less restrictive retention policies | Third parties may combine your data with other sources to re-identify |
| Lower breach impact | Privacy expectations still apply to user experience |

**Engineering implications:**
- Standard encryption in transit
- Ensure pseudonymization is robust (cannot be reversed without separate key)
- Monitor for re-identification risk when combining datasets
- Basic consent for any tracking or profiling
- Lighter retention enforcement — but still document and enforce schedules

**Recommendation:** Even with low-sensitivity data, do not skip the data flow map and consent management templates. Pseudonymized data is still personal data under GDPR if re-identification is possible.

---

## Node 3 — Consent Architecture

How does your product obtain lawful basis for processing personal data? The consent model determines the UX of your privacy controls and the complexity of your consent management infrastructure.

### Option A: Opt-In (Explicit Consent Before Processing)

| Pros | Cons |
|------|------|
| Strongest legal basis — hard to challenge | Higher friction in onboarding — consent fatigue risk |
| Clearest user expectation setting | Lower opt-in rates for optional processing (analytics, marketing) |
| Required for sensitive data under GDPR | Must be granular — blanket consent is invalid |
| Withdrawal must be as easy as giving consent | Consent versioning complexity increases over time |

**Engineering implications:**
- Consent collection at every data processing touchpoint
- Granular consent categories (not a single checkbox)
- Consent storage with timestamp, version, and scope
- Withdrawal mechanism that is equally prominent to the opt-in
- Re-consent flow when purposes or processors change
- Consent gate in data pipeline — no processing without valid consent record

**Recommendation:** Required for GDPR when legitimate interest or contract necessity do not apply. Default choice for consumer-facing products with EU users.

### Option B: Opt-Out (Processing by Default, User Can Object)

| Pros | Cons |
|------|------|
| Lower friction — better conversion rates | Not valid under GDPR for most processing (only for direct marketing) |
| Simpler initial UX | "Do Not Sell" mechanisms required under CCPA |
| Standard for US-focused products | Users may not realize they need to opt out |
| Less consent management infrastructure | Regulatory trend is toward opt-in globally |

**Engineering implications:**
- Prominent opt-out mechanism (CCPA "Do Not Sell" link)
- Global Privacy Control (GPC) signal detection and honoring
- Opt-out state propagation to all processors and analytics
- Less granular consent storage — binary opt-in/opt-out per category
- Audit trail for opt-out requests

**Recommendation:** Acceptable for US-only products under CCPA. If you might expand to EU, build opt-in infrastructure now.

### Option C: Legitimate Interest

| Pros | Cons |
|------|------|
| No consent collection required | Must document legitimate interest assessment (LIA) for every activity |
| Lower UX friction | Users can object — must have objection mechanism |
| Appropriate for B2B where processing is expected | Regulators scrutinize LIA claims closely |
| Valid for fraud prevention, security, analytics | Cannot use for marketing without strong justification |

**Engineering implications:**
- Legitimate Interest Assessment documentation for each processing activity
- Objection mechanism (right to object under GDPR Article 21)
- Balancing test documentation (your interest vs. data subject rights)
- No consent collection UI required, but transparency notices are mandatory
- Must still provide privacy notice at point of collection

**Recommendation:** Appropriate for B2B SaaS where processing is necessary for the service. Document your LIA thoroughly — the assessment is the compliance artifact.

### Option D: Contract Necessity

| Pros | Cons |
|------|------|
| Strongest basis for core service processing | Only valid for data processing strictly necessary to perform the contract |
| No consent required for core features | Cannot extend to analytics, marketing, or non-essential processing |
| Users expect their data to be processed for the service they signed up for | Must still obtain consent for any processing beyond contract scope |
| Simplifies consent architecture for core flows | Terms of service must clearly describe the processing |

**Engineering implications:**
- Clearly document which processing activities fall under contract necessity
- Separate consent flow for any processing beyond contract scope
- Terms of service must describe data processing in sufficient detail
- Cannot use for analytics, marketing emails, or third-party sharing
- Hybrid approach common: contract necessity for core + consent for extras

**Recommendation:** Use contract necessity for core service data processing and layer consent on top for optional features. This is the most common hybrid approach for SaaS products.

---

## Node 4 — Data Processing Location

Where is personal data stored and processed? This determines cross-border transfer requirements, data sovereignty constraints, and infrastructure complexity.

### Option A: Single Region

| Pros | Cons |
|------|------|
| No cross-border transfer complexity | Latency for users far from the region |
| Simplest compliance posture | Single point of failure for data availability |
| Clear data sovereignty — one jurisdiction applies | May not satisfy data residency requirements for enterprise customers |
| Easier audit scope | Scaling limited to one region's capacity |

**Engineering implications:**
- Choose region based on majority user location + regulatory requirements
- Document the region in processing register
- No transfer mechanisms needed
- Backup and DR within same region or with transfer mechanism to secondary
- {{PRIVACY_SHIELD_REGION}} is your single processing region

**Recommendation:** Best for early-stage products targeting a single market. If EU-focused, choose `eu-west-1` or `eu-central-1`. If US-focused, choose `us-east-1` or `us-west-2`.

### Option B: Multi-Region (Same Jurisdiction)

| Pros | Cons |
|------|------|
| Better latency and availability | Replication means data exists in multiple locations |
| DR capabilities within jurisdiction | Must ensure all regions meet same compliance standard |
| No cross-border transfer issues | Backup and purge complexity increases |
| Enterprise customers satisfied with data residency | More infrastructure to audit |

**Engineering implications:**
- Document all regions in processing register
- Ensure purge operations propagate to all replicas
- Backup retention must align across regions
- DSR fulfillment must query all regions
- No transfer impact assessment needed (same jurisdiction)

**Recommendation:** Standard for production SaaS. Use multi-region within the same jurisdiction to avoid cross-border complexity while gaining availability.

### Option C: Cross-Border with Standard Contractual Clauses

| Pros | Cons |
|------|------|
| Enables global operations | SCCs require Transfer Impact Assessment per Schrems II |
| Well-established legal mechanism | Supplementary measures may be required |
| Template contracts available from EU Commission | Must monitor adequacy decisions — they can be invalidated |
| Works for most country combinations | Administrative overhead for maintaining SCC records |

**Engineering implications:**
- Transfer Impact Assessment for each cross-border data flow
- SCC documentation and execution with each processor
- Supplementary measures (encryption, pseudonymization) where required
- Document transfers in processing register with legal basis
- Monitor for adequacy decision changes
- Consider data localization for most sensitive categories

**Recommendation:** Required for EU-to-non-adequate-country transfers. Complete the cross-border transfers template with full TIA documentation.

### Option D: US-Only

| Pros | Cons |
|------|------|
| No cross-border transfer complexity | Limits market to US customers |
| CCPA/state laws are less restrictive than GDPR | Enterprise customers may still require data residency commitments |
| Standard US cloud regions | Cannot serve EU customers without GDPR compliance |
| Lower compliance overhead | US federal privacy law may change the landscape |

**Engineering implications:**
- No transfer mechanisms needed
- State-level privacy law compliance (CCPA, VCDPA, CPA, CTDPA, etc.)
- Data residency documentation for enterprise customers
- Standard cloud provider DPAs sufficient
- Monitor federal privacy legislation

**Recommendation:** If currently US-only but may expand internationally, build transfer mechanism abstractions now so you can activate them later.

---

## Node 5 — Third-Party Data Sharing

How much personal data flows to third parties? This determines processor agreements, data sharing documentation, and consent granularity requirements.

### Option A: None

| Pros | Cons |
|------|------|
| Simplest compliance posture | Limits analytics and marketing capabilities |
| No processor agreements needed | Even "none" may be inaccurate — audit for hidden data flows |
| Strongest privacy positioning | Cloud infrastructure providers are technically processors |
| No sub-processor risk | Payment processors are technically data processors |

**Engineering implications:**
- Audit all dependencies for hidden data sharing (analytics SDKs, error tracking, CDNs)
- Cloud infrastructure provider DPA is still required
- Payment processor DPA is still required
- Document the "no sharing" policy and enforce it in code reviews

**Recommendation:** Rare in practice. Most products share data with at least cloud providers, payment processors, and error tracking. Audit honestly.

### Option B: Analytics Only

| Pros | Cons |
|------|------|
| Limited processor scope — manageable DPA overhead | Analytics tools often collect more data than expected |
| Clear purpose limitation | Cookie consent required for analytics cookies |
| Standard DPAs available from major analytics providers | Must honor opt-out/consent withdrawal in analytics pipeline |
| Industry-standard practice | Third-party analytics SDKs may share data with fourth parties |

**Engineering implications:**
- DPA with each analytics provider
- Consent gate before analytics SDK initialization
- Honor GPC signal for analytics
- Anonymize or pseudonymize before sending to analytics
- Audit analytics SDK data collection (what fields are actually sent?)
- Consider server-side analytics to control data flow

**Recommendation:** Most common scenario. Use server-side analytics where possible to maintain control over what data leaves your infrastructure.

### Option C: Multiple Processors

| Pros | Cons |
|------|------|
| Full ecosystem of tools available | Each processor needs a DPA and security review |
| Specialized tools for each function | Sub-processor chains create compliance risk |
| Industry-standard integrations | Consent must be granular enough to cover each processor's purpose |
| Operational efficiency through specialization | Breach at any processor is your breach to report |

**Engineering implications:**
- Sub-processor register with all processors and their purposes
- DPA execution and tracking for each processor
- Consent categories aligned with processor purposes
- DSR fulfillment must extend to every processor
- Processor security assessments (SOC 2, ISO 27001)
- Breach notification agreements with each processor
- Regular sub-processor audit cadence

**Recommendation:** Build the sub-processor register template thoroughly. Most startups have 8-15 processors and undercount by 30-50% on first audit.

### Option D: Data Broker / Advertising Network

| Pros | Cons |
|------|------|
| Revenue from data monetization | CCPA classifies this as "sale" of data — requires "Do Not Sell" |
| Broad targeting capabilities | GDPR requires explicit consent for advertising purposes |
| Industry-standard for ad-supported products | Highest regulatory scrutiny |
| Network effects improve targeting | User trust risk — privacy-conscious users will leave |

**Engineering implications:**
- "Do Not Sell or Share" mechanism (CCPA)
- Explicit consent for advertising data sharing (GDPR)
- Data clean rooms for privacy-preserving advertising
- Consent withdrawal must propagate to all advertising partners
- Real-time bidding data flows need privacy assessment
- IAB TCF 2.2 implementation for programmatic advertising
- Regular audits of data broker practices

**Recommendation:** If your business model depends on data monetization, invest heavily in consent management and the cookie consent implementation template. Regulatory risk is highest in this category.

---

## Node 6 — Automated Decision-Making

Does your product make automated decisions that significantly affect users? This determines transparency requirements, explainability obligations, and the right to human review.

### Option A: None

| Pros | Cons |
|------|------|
| No additional transparency obligations | Limits product intelligence capabilities |
| No right to human review mechanism needed | Any future automation will require privacy assessment |
| Simplest compliance posture | Even rule-based systems may qualify as automated decisions |
| No explainability infrastructure required | Definition is broader than most teams assume |

**Engineering implications:**
- Audit all algorithms for automated decision-making characteristics
- Even simple rule-based systems (credit limits, feature access) may qualify
- Document the absence of automated decisions in privacy notice

**Recommendation:** Verify this genuinely applies. If your product uses any scoring, ranking, filtering, or recommendation system, evaluate whether it qualifies as automated decision-making.

### Option B: Recommendations

| Pros | Cons |
|------|------|
| Enhances user experience | Requires transparency about recommendation logic |
| Generally lower regulatory risk than scoring | Recommendation algorithms can create filter bubbles |
| Users expect and value recommendations | Must provide opt-out mechanism |
| Established UX patterns | Bias in recommendation algorithms is a growing concern |

**Engineering implications:**
- Privacy notice must describe recommendation logic ("why am I seeing this?")
- Opt-out mechanism for personalized recommendations
- Bias monitoring in recommendation outputs
- Data minimization in recommendation inputs — use only necessary signals
- Log recommendation inputs and outputs for auditability

**Recommendation:** Standard for most SaaS products. Implement "why am I seeing this?" transparency and opt-out capability.

### Option C: Scoring / Profiling

| Pros | Cons |
|------|------|
| Powerful business intelligence | GDPR Article 22 right to not be subject to profiling |
| Risk assessment automation | Must provide meaningful information about scoring logic |
| Operational efficiency | Right to human review of scoring decisions |
| Data-driven decision support | Bias risk is significant — must monitor and document |

**Engineering implications:**
- DPIA required for profiling activities
- Transparency obligation — explain scoring methodology in accessible language
- Right to human review mechanism
- Bias detection and mitigation pipeline
- Explainability infrastructure (why did this user get this score?)
- Consent required for profiling under GDPR (unless contract necessity)
- Regular fairness audits

**Recommendation:** Invest in the privacy impact assessment template. Every scoring system needs a DPIA, explainability interface, and human review mechanism.

### Option D: Legal-Effect Decisions

| Pros | Cons |
|------|------|
| Maximum automation efficiency | Highest regulatory burden — GDPR Article 22 fully applies |
| Consistent decision-making | Explicit consent required (legitimate interest insufficient) |
| Scalable operations | Right to human review is mandatory, not optional |
| Auditability of decision logic | Must provide meaningful explanation of decision logic |

**Engineering implications:**
- Explicit consent for automated decision-making
- Mandatory human review mechanism (cannot be rubber-stamp)
- Full explainability infrastructure
- DPIA mandatory
- Regular bias and fairness audits (quarterly minimum)
- Appeal process with defined SLAs
- Decision audit trail with full input/output logging
- Sector-specific requirements may add further constraints (credit, insurance, employment)

**Recommendation:** If making legal-effect decisions (credit approvals, insurance pricing, employment screening), invest maximum depth in privacy impact assessment, consent management, and build dedicated explainability and appeal infrastructure.

---

## Compiling Your Privacy Engineering Profile

After completing all six nodes, record your selections:

| Node | Your Selection | Template Depth |
|------|---------------|----------------|
| Jurisdictional Scope | {{PRIVACY_JURISDICTIONS}} | Drives overall architecture |
| Data Sensitivity | {{DATA_SENSITIVITY_LEVEL}} | Drives encryption + access controls |
| Consent Architecture | {{CONSENT_MODEL}} | Drives consent management template |
| Processing Location | {{PRIVACY_SHIELD_REGION}} | Drives cross-border template |
| Third-Party Sharing | (your selection) | Drives processor documentation |
| Automated Decisions | {{AUTOMATED_DECISIONS}} | Drives DPIA + explainability |

**Use this profile to calibrate depth in every subsequent template.** Templates that match your highest-risk nodes need deep investment. Templates that cover low-risk areas for your profile need baseline coverage only.
