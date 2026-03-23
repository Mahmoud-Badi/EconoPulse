# Privacy Engineering Gotchas

> Production lessons from teams that learned the hard way. Read this before you build, not after a regulator asks questions.

---

## Overview

Every template in this section represents careful planning. This file represents costly mistakes. These are patterns that repeat across organizations of every size — from startups that assumed privacy could wait until Series B, to enterprises that discovered their "GDPR-compliant" system had been collecting data it should not have for three years. Each gotcha includes what goes wrong, why it happens, and how to prevent it.

**When to read this:** Before starting implementation. Revisit quarterly as your privacy engineering matures.

---

## Gotcha 1: Consent Withdrawal Does Not Propagate to Third Parties

**Severity: CRITICAL**

**What happens:** A user withdraws consent for analytics. Your application stops tracking them. But Google Analytics, Mixpanel, Segment, and three other third-party tools continue processing their data because nobody built the propagation pipeline. Six months later, a DSR access request reveals that analytics providers still have the user's data despite withdrawal.

**Why it happens:** Consent withdrawal is implemented as a local state change. The frontend stops sending events, but no signal reaches the third-party systems to delete existing data or stop server-side processing. Teams forget that consent withdrawal is not just about future collection — it also requires cleanup of previously collected data.

**How to prevent it:**
- Build a consent propagation service that notifies all processors when consent changes
- Use server-side analytics (not client-side SDKs) so you control the data pipeline
- On withdrawal, send deletion requests to all processors that received data under that consent
- Test consent withdrawal end-to-end, including third-party cleanup
- Monitor third-party data stores periodically to verify withdrawal effectiveness

**Detection:** Audit third-party dashboards quarterly — search for users who withdrew consent but still appear in third-party analytics.

**Cross-ref:** `consent-management.template.md` — Consent propagation architecture

---

## Gotcha 2: Your Backups Still Contain Deleted Users

**Severity: CRITICAL**

**What happens:** You fulfill an erasure request. The user is deleted from production. Three weeks later, a database restore from backup brings the user back. Or worse — a regulator asks for proof of deletion, and you discover that your 90-day backup rotation means deleted users exist in backups for three months after erasure.

**Why it happens:** Backup systems are designed for data preservation, not data deletion. They are the opposite of privacy engineering. Most teams design backup strategies without involving the privacy team, and nobody considers how erasure requests interact with backup retention.

**How to prevent it:**
- Implement cryptographic erasure: encrypt user data with per-user keys, delete the key on erasure
- Maintain a backup exclusion list: filter out deleted user IDs during any restore operation
- Reduce backup retention to the minimum needed for DR (7-14 days ideal, 30 days maximum)
- Document your backup-aware deletion strategy in the DPIA
- Test a restore operation after an erasure to verify the user does not reappear

**Detection:** `grep -r "deleted_users" backup-restore-scripts/` — verify exclusion list is referenced in every restore procedure.

**Cross-ref:** `data-retention-policy.template.md` — Backup retention alignment

---

## Gotcha 3: Analytics Retention Outlives Your Privacy Policy

**Severity: HIGH**

**What happens:** Your privacy policy states a 24-month retention period. Your analytics warehouse retains raw event data for 36 months because "we might need it for trend analysis." A regulator compares your privacy policy to your actual retention and finds a 12-month gap. This is a documented violation.

**Why it happens:** Analytics teams set retention independently from privacy teams. Data warehouse cost is low, so there is no economic pressure to purge. Nobody compares the analytics retention configuration to the privacy policy retention statement.

**How to prevent it:**
- Treat the privacy policy retention period as a hard ceiling, not a suggestion
- Configure analytics warehouse retention to match or be shorter than the privacy policy
- Run a quarterly audit comparing actual data age distribution against stated retention
- Automate purging in the analytics warehouse with the same cadence as the primary database
- When changing retention in the privacy policy, update ALL data stores simultaneously

**Detection:** Query the analytics warehouse: `SELECT MIN(event_date) FROM events` — if it is older than your stated retention, you have a violation.

---

## Gotcha 4: Third-Party SDKs Collect More Data Than You Think

**Severity: HIGH**

**What happens:** You add an analytics SDK for page view tracking. It also fingerprints the browser, collects the full URL (which contains query parameters with PII), records scroll depth, captures form field interactions, and sends all of this to servers in a jurisdiction you did not plan for.

**Why it happens:** Third-party SDKs default to maximum data collection because that is what their customers typically want. The documentation mentions the basic features, but the default configuration enables far more. Engineers install the SDK, verify the basic feature works, and ship without auditing the full data collection behavior.

**How to prevent it:**
- Read the SDK's privacy documentation before installation, not after
- Use browser DevTools Network tab to observe ALL requests the SDK makes
- Configure SDKs to minimum collection mode before first production deployment
- Verify the SDK's data processing location matches your cross-border transfer documentation
- Prefer server-side integrations over client-side SDKs — you control what data leaves
- Review SDK changelogs for data collection changes before upgrading

**Detection:** `tcpdump` or browser DevTools Network tab — capture all outbound requests during a user session and compare to your third-party data flow register.

---

## Gotcha 5: Cookie Consent Race Condition

**Severity: HIGH**

**What happens:** The page loads. The cookie consent banner initializes. But the Google Analytics script tag was in the HTML `<head>` and started executing before the consent banner rendered. By the time the user clicks "Reject All," GA has already sent a pageview event with their client ID. You have processed data without consent.

**Why it happens:** Traditional script tags execute as soon as the browser encounters them. The consent banner is a JavaScript component that loads asynchronously. Without explicit blocking, tracking scripts race ahead of consent.

**How to prevent it:**
- Never include analytics/marketing scripts in the initial HTML
- Use `type="text/plain"` on script tags and swap to `type="text/javascript"` only after consent
- Implement server-side consent enforcement (middleware strips script tags from HTML when consent is absent)
- Use a CMP that manages script loading order (OneTrust, Cookiebot)
- Test with browser DevTools — verify zero tracking requests before consent interaction

**Detection:** Playwright test: clear cookies, load page, capture all network requests before interacting with consent banner. Any requests to analytics/marketing domains = violation.

**Cross-ref:** `cookie-consent-implementation.template.md` — Server-side consent enforcement

---

## Gotcha 6: DSR Fulfillment Across Microservices Is a Nightmare

**Severity: HIGH**

**What happens:** A user requests data access. You query the primary database and generate an export. But the user's data also lives in the support ticketing system, the email marketing platform, the analytics warehouse, the search index, the CDN access logs, the error tracking tool, and two internal tools nobody documented. The export is incomplete, and you do not know it until the user (or their lawyer) points out the gaps.

**Why it happens:** In monolith architectures, all data is in one database. In microservices, data scatters across dozens of services and third-party tools. The data discovery step of DSR fulfillment requires a complete inventory of every system that stores user data, and that inventory is never complete on the first attempt.

**How to prevent it:**
- Build and maintain a data source registry (see `dsr-workflow.template.md`)
- Run the hidden data store audit from `data-flow-mapping.template.md` quarterly
- Implement automated data discovery that queries all registered sources
- Test DSR fulfillment with a test user whose data you can verify across all systems
- Have engineering teams register new data stores before deploying features that create them

**Detection:** Submit a test DSR for a known test user. Compare the export against a manually compiled list of all data stores. Any missing source = gap.

---

## Gotcha 7: Data Broker Obligations Are Broader Than "Selling Data"

**Severity: HIGH**

**What happens:** Your product collects user behavior data and shares it with an advertising partner for targeted ad delivery. You do not consider yourself a data broker because you are not "selling" data. But CCPA defines "sale" as sharing personal information for monetary or other valuable consideration. Your ad revenue sharing arrangement qualifies. You need a "Do Not Sell" mechanism that you do not have.

**Why it happens:** The legal definition of "data sale" is broader than the common understanding. Any exchange of personal data for value — including free access to an analytics tool in exchange for sharing data — can qualify.

**How to prevent it:**
- Review every data sharing arrangement with legal counsel for "sale" classification
- If any arrangement qualifies, implement CCPA "Do Not Sell or Share" mechanisms
- Honor the Global Privacy Control signal as an automatic opt-out for data sales
- Document all data sharing arrangements in the sub-processor register with revenue/value detail

**Detection:** Review all third-party contracts: does any data flow include compensation, discounts, or in-kind benefits? If yes, assess for "sale" classification.

---

## Gotcha 8: Children's Data Requires Separate Architecture (COPPA)

**Severity: CRITICAL**

**What happens:** Your product does not target children, but some users are under 13. A parent discovers their child has an account and files a COPPA complaint. You have no age verification, no parental consent mechanism, and no ability to identify and delete children's data separately from adult data.

**Why it happens:** Teams assume "we don't target children" means COPPA does not apply. But if you have actual knowledge that children use your product (or should have known — a social media app used by teens), COPPA obligations activate.

**How to prevent it:**
- If your product could plausibly attract users under 13, implement age verification at registration
- If you determine a user is under 13, collect verifiable parental consent before processing
- Build the ability to flag accounts as child accounts with additional restrictions
- Under-13 accounts: no behavioral advertising, no data sale, no profiling, limited data collection
- Implement a separate deletion workflow for child data that is faster and more thorough

**Detection:** Check user-reported ages or estimate from usage patterns. If any users are under 13, audit your COPPA compliance immediately.

---

## Gotcha 9: Legitimate Interest Documentation Is Not Optional

**Severity: MEDIUM**

**What happens:** You use "legitimate interest" as the legal basis for fraud detection, security monitoring, and B2B marketing. A regulator asks for your Legitimate Interest Assessments. You have none. The regulator does not accept "we thought about it" — they need documented assessments with purpose tests, necessity tests, and balancing tests.

**Why it happens:** Teams treat legitimate interest as a "free pass" that avoids the burden of consent. It is not — it requires more documentation than consent, not less. Every processing activity under legitimate interest needs a formal LIA with a purpose test, necessity test, and balancing test.

**How to prevent it:**
- Complete the LIA template in `records-of-processing.template.md` for every legitimate interest activity
- Have legal counsel review each LIA before processing begins
- Store LIAs alongside processing register entries
- Review LIAs annually or when processing changes
- Implement the right to object — legitimate interest does not eliminate objection rights

**Detection:** Count processing activities using legitimate interest as legal basis. Compare against the number of completed LIAs. Any mismatch = undocumented processing.

---

## Gotcha 10: Schrems II Can Invalidate Your Transfer Mechanism Overnight

**Severity: HIGH**

**What happens:** You rely on the EU-US Data Privacy Framework for all your cross-border transfers to US processors. A new court ruling or adequacy decision review invalidates the DPF (as happened with Safe Harbor in 2015 and Privacy Shield in 2020). You have no fallback transfer mechanism. Every data flow to your US processors becomes unlawful overnight.

**Why it happens:** Teams treat adequacy decisions as permanent. They are not — they are subject to judicial review and can be invalidated with relatively short notice. If your entire transfer architecture depends on a single mechanism, you have a single point of failure.

**How to prevent it:**
- Maintain signed SCCs as a backup for ALL transfers, even those currently covered by DPF
- Have a 90-day migration plan to switch from DPF to SCCs if invalidated
- Keep Transfer Impact Assessments current so they can be activated immediately
- Consider data localization for the most sensitive data categories
- Monitor EU Commission and CJEU announcements for adequacy decision changes

**Detection:** Quarterly review: for every cross-border transfer, verify that at least two valid transfer mechanisms exist (primary + fallback).

---

## Gotcha 11: Data Breach Notification Timing Is Measured in Hours, Not Weeks

**Severity: CRITICAL**

**What happens:** You discover a data breach on Friday afternoon. The engineering team investigates over the weekend. Legal is informed on Monday. The DPA notification is prepared by Wednesday. You notify the supervisory authority on Thursday — 6 days after discovery. Under GDPR, you had 72 hours.

**Why it happens:** Breach notification timelines are measured from the moment you become "aware" of the breach, not from when you complete the investigation. 72 hours is 3 calendar days, including weekends. Most organizations' incident response processes assume weekday-only workflows.

**How to prevent it:**
- Have a breach notification template pre-prepared — fill in the blanks, do not draft from scratch
- Designate a 24/7 breach response lead (not just 9-5)
- Define "awareness" criteria clearly — when does the clock start?
- Practice breach notification drills quarterly
- Notify the DPA within 72 hours even if the investigation is incomplete — you can supplement later

**Detection:** Run a mock breach drill. Measure time from simulated discovery to completed DPA notification draft. If it exceeds 48 hours (leaving 24 hours buffer), your process is too slow.

---

## Gotcha 12: Processor vs. Controller Confusion in B2B SaaS

**Severity: MEDIUM**

**What happens:** Your B2B SaaS product processes your customers' end users' data. You consider yourself a processor (acting on behalf of your customer). But you also use that data for your own purposes — product analytics, model training, aggregate benchmarking. By using the data for your own purposes, you become a controller for those processing activities, with full controller obligations.

**Why it happens:** The controller/processor distinction is not binary per-company — it is per-processing-activity. A company can be a processor for some activities and a controller for others. Most teams assign a single role and apply it to all processing.

**How to prevent it:**
- Map every processing activity to a specific controller/processor role
- If you use customer data for your own purposes (analytics, ML, benchmarks), you are a controller for those activities
- Separate your DPA terms for processor activities from your controller activities
- Ensure your privacy policy covers your controller activities
- Get explicit consent from customers (and possibly end users) for controller activities

**Detection:** Review your processing register: for each activity, ask "who determines the purpose?" If the answer is "us" for any activity involving customer data, verify you have controller documentation for that activity.

---

## Gotcha 13: Consent Fatigue Destroys Opt-In Rates

**Severity: MEDIUM**

**What happens:** You implement granular consent with 12 separate consent purposes. Your consent banner has checkboxes for analytics, marketing email, SMS marketing, social media retargeting, personalization, A/B testing, performance monitoring, crash reporting, user research, product recommendations, third-party integrations, and location tracking. Users see 12 checkboxes, get overwhelmed, and reject everything. Your opt-in rate drops from 60% to 8%.

**Why it happens:** Privacy regulations require granular consent, but teams interpret "granular" as "maximum granularity." GDPR requires purpose-specific consent, not checkbox-per-tool consent. You can group similar purposes into categories as long as each category is clearly described and independently controllable.

**How to prevent it:**
- Group purposes into 3-5 categories (Necessary, Functional, Analytics, Marketing)
- Show categories on the banner, offer "Advanced settings" for per-purpose control
- Use progressive disclosure — simple first, detailed on demand
- A/B test consent UX to find the balance between granularity and usability
- Remember that lower opt-in rates mean less data, which means less product insight — there is a real cost

**Detection:** Monitor consent opt-in rates over time. If rates drop below 30% after a consent UX change, consider simplifying.

---

## Gotcha 14: Privacy Policy Version Control Is Not Just Legal Hygiene

**Severity: MEDIUM**

**What happens:** You update your privacy policy to add a new processing activity. But you do not version the update, do not track which users saw which version, and do not trigger re-consent for users whose consent was given under the old policy. A regulator asks to see consent records tied to a specific policy version. You cannot produce them.

**Why it happens:** Privacy policies are treated as legal documents, not software artifacts. They get updated by legal counsel in a Word document, published to the website, and nobody tracks versions or maps consent records to specific versions.

**How to prevent it:**
- Version your privacy policy like software (e.g., v2.1, v2.2, v3.0)
- Store the policy version in every consent record
- When a material change occurs, increment the major version and trigger re-consent for affected users
- Maintain an archive of all previous policy versions with effective dates
- Track which users have acknowledged each version

**Detection:** Check consent records: do they contain a `privacy_policy_version` field? If not, you cannot prove consent was informed.

**Cross-ref:** `consent-management.template.md` — Consent versioning

---

## Gotcha 15: Automated Decision-Making Transparency Is More Than a Privacy Policy Paragraph

**Severity: MEDIUM**

**What happens:** Your product uses an ML model to score users for credit risk, fraud likelihood, or feature access. Your privacy policy mentions "automated decision-making." A user asks for an explanation of why they were denied access. You cannot provide one because the model is a black box, you have no explainability infrastructure, and nobody built a human review mechanism.

**Why it happens:** Teams deploy ML models for speed and efficiency without considering GDPR Article 22 obligations: meaningful information about the logic involved, the right to human review, and the right to contest automated decisions. These are not privacy policy paragraphs — they are engineering features.

**How to prevent it:**
- Build explainability infrastructure before deploying any scoring or profiling model
- Implement a "why was this decision made?" endpoint that returns human-readable reasoning
- Build a human review queue for automated decisions that have significant effects
- Log all automated decision inputs and outputs for auditability
- Conduct bias audits on all automated decision systems quarterly
- Complete a DPIA for every automated decision system before deployment

**Detection:** For each ML model in production, verify: (1) explainability endpoint exists, (2) human review mechanism exists, (3) DPIA is completed. Any missing = compliance gap.

---

## Gotcha 16: Log Aggregators Are Accidental Data Warehouses

**Severity: HIGH**

**What happens:** Your structured logging captures request context including user IDs, email addresses (from authentication middleware), IP addresses, request bodies (which may contain PII submitted in forms), and response bodies. Your log aggregator (Datadog, ELK, Splunk) retains this data for 90 days by default. Nobody classified the log aggregator as a personal data store, so it is not in your processing register, not covered by DSR fulfillment, and not subject to retention policy enforcement.

**Why it happens:** Logs are treated as infrastructure, not data stores. Engineers add context to logs for debugging convenience without considering that "add the user email to the log context" creates a personal data processing activity.

**How to prevent it:**
- Add the log aggregator to your data flow map and processing register
- Implement PII scrubbing middleware that strips sensitive fields before they reach logs
- Configure log retention to match your stated retention period
- Never log request/response bodies in production — log only sanitized summaries
- Include the log aggregator in DSR data discovery and erasure pipelines

**Detection:** `grep -i "email\|password\|phone\|ssn\|credit.card" /var/log/application/*.log` — if any PII appears, your log sanitization is insufficient.

---

## Gotcha 17: DSAR Fulfillment Double-Counts Shared Data

**Severity: LOW**

**What happens:** A user submits an access request. Your data discovery pipeline queries 12 services. Three services return the same email address. The export shows the email address three times in different sections, confusing the user and suggesting you store redundant copies (which you do, but that is a separate problem).

**Why it happens:** Cross-service data discovery does not deduplicate. Each service returns its own view of the user's data without awareness of what other services have already contributed to the export.

**How to prevent it:**
- Build a deduplication layer in the data export generation
- Structure the export by data category, not by source system
- Include a section showing which systems store each data element (transparency)
- Consolidate redundant data storage where possible (single source of truth)

---

## Gotcha 18: Cookie Consent Does Not Cover Mobile SDKs

**Severity: MEDIUM**

**What happens:** You implement cookie consent perfectly on your website. But your mobile app uses the same analytics and marketing SDKs — and those SDKs do not check cookie consent because they are not in a browser. They use device advertising IDs, which have their own consent requirements (ATT on iOS, Android privacy changes) that are completely separate from your web cookie consent.

**Why it happens:** "Cookie consent" is a web-specific mechanism. Mobile privacy consent requires different infrastructure: iOS App Tracking Transparency prompts, Android AAID consent, and in-app privacy settings. Teams that build web consent first and add mobile later miss the entirely different consent model.

**How to prevent it:**
- Build a unified consent service that works across web and mobile
- On iOS, implement ATT prompts before any tracking
- On Android, respect the user's advertising ID settings
- Store consent decisions in your backend, not just locally on the device
- Test consent flows on mobile separately from web
