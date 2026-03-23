# Privacy Policy Guide

> A comprehensive guide for creating privacy policies that comply with GDPR, CCPA, and other global privacy regulations. Use this as a reference when drafting or auditing your product's privacy policy.

---

## Table of Contents

1. [Why Privacy Policies Matter](#why-privacy-policies-matter)
2. [Key Regulations Overview](#key-regulations-overview)
3. [When Each Regulation Applies](#when-each-regulation-applies)
4. [Required Privacy Policy Sections](#required-privacy-policy-sections)
5. [Data Collection Types](#data-collection-types)
6. [Third-Party Data Sharing](#third-party-data-sharing)
7. [Cookie Policies](#cookie-policies)
8. [Data Retention](#data-retention)
9. [User Rights](#user-rights)
10. [Children's Privacy (COPPA)](#childrens-privacy-coppa)
11. [International Considerations](#international-considerations)
12. [Privacy Policy Template Structure](#privacy-policy-template-structure)
13. [Privacy Policy Generators and Tools](#privacy-policy-generators-and-tools)
14. [Compliance Checklist](#compliance-checklist)

---

## Why Privacy Policies Matter

A privacy policy is not optional. It is a legal requirement for virtually any website or application that collects user data. Beyond legal compliance, it builds trust with users and protects your business from lawsuits, fines, and reputational damage.

**Consequences of non-compliance:**

| Regulation | Maximum Fine |
|------------|-------------|
| GDPR | EUR 20 million or 4% of global annual revenue (whichever is higher) |
| CCPA/CPRA | $7,500 per intentional violation, $2,500 per unintentional violation |
| COPPA | $50,120 per violation |
| PIPEDA (Canada) | CAD 100,000 per violation |

---

## Key Regulations Overview

### GDPR (General Data Protection Regulation)

- **Jurisdiction:** European Union and European Economic Area
- **Effective:** May 25, 2018
- **Applies to:** Any organization that processes personal data of EU/EEA residents, regardless of where the organization is located
- **Key principles:** Lawfulness, fairness, transparency; purpose limitation; data minimization; accuracy; storage limitation; integrity and confidentiality; accountability
- **Legal bases for processing:** Consent, contract, legal obligation, vital interests, public task, legitimate interests

### CCPA/CPRA (California Consumer Privacy Act / California Privacy Rights Act)

- **Jurisdiction:** California, USA
- **Effective:** CCPA January 1, 2020; CPRA January 1, 2023
- **Applies to:** For-profit businesses that collect California residents' personal information AND meet at least one threshold:
  - Annual gross revenue exceeding $25 million
  - Buy, sell, or share personal information of 100,000+ consumers/households
  - Derive 50%+ of annual revenue from selling/sharing personal information
- **Key rights:** Right to know, right to delete, right to opt out of sale/sharing, right to non-discrimination, right to correct, right to limit use of sensitive personal information

### PIPEDA (Personal Information Protection and Electronic Documents Act)

- **Jurisdiction:** Canada
- **Applies to:** Private-sector organizations that collect, use, or disclose personal information in the course of commercial activity

### LGPD (Lei Geral de Protecao de Dados)

- **Jurisdiction:** Brazil
- **Effective:** September 18, 2020
- **Similar to GDPR** with some distinct requirements around legal bases and data protection officer appointment

### POPIA (Protection of Personal Information Act)

- **Jurisdiction:** South Africa
- **Effective:** July 1, 2021
- **Similar framework** to GDPR with local enforcement through the Information Regulator

---

## When Each Regulation Applies

Use this decision matrix to determine which regulations apply to your product:

| Question | If Yes |
|----------|--------|
| Do you have users in the EU/EEA? | GDPR applies |
| Do you target or monitor EU/EEA residents? | GDPR applies |
| Do you have California users AND meet revenue/data thresholds? | CCPA/CPRA applies |
| Do you collect data from children under 13? | COPPA applies (US) |
| Do you have Canadian users? | PIPEDA likely applies |
| Do you have Brazilian users? | LGPD applies |
| Do you use cookies or tracking technologies? | ePrivacy Directive applies (EU) |

**Rule of thumb:** If your product is accessible on the internet, assume at minimum GDPR and CCPA apply. It is safer and simpler to build for the strictest standard.

---

## Required Privacy Policy Sections

Every privacy policy should include the following sections, regardless of which regulations apply:

### 1. Identity and Contact Information
- Legal name of the data controller/business
- Physical address
- Email address for privacy inquiries
- Data Protection Officer contact (required under GDPR if applicable)

### 2. What Data You Collect
- Explicitly list every category of personal data collected
- Distinguish between data provided directly by users and data collected automatically

### 3. How You Collect Data
- Through forms and account registration
- Automatically via cookies, pixels, and tracking technologies
- From third-party sources (data brokers, social login providers, analytics)

### 4. Why You Collect Data (Purpose)
- Each category of data must have a stated purpose
- Under GDPR, each purpose must have a legal basis

### 5. How You Use Data
- Service delivery
- Communication
- Marketing
- Analytics and improvement
- Legal compliance

### 6. Who You Share Data With
- Categories of third-party recipients
- Purpose of sharing
- Whether data is sold (CCPA definition of "sale")

### 7. Data Retention
- How long each category of data is kept
- Criteria used to determine retention periods

### 8. User Rights
- List all applicable rights based on jurisdiction
- How users can exercise those rights
- Expected response time

### 9. Security Measures
- General description of security practices (do not reveal specific infrastructure details)

### 10. International Transfers
- Whether data is transferred outside the user's jurisdiction
- Safeguards in place (Standard Contractual Clauses, adequacy decisions)

### 11. Updates to the Policy
- How users will be notified of changes
- Effective date of current policy

---

## Data Collection Types

Be specific about what you collect. Here are common categories:

### Data Provided by Users
- Name, email address, phone number
- Billing/payment information (credit card, billing address)
- Profile information (username, avatar, bio)
- User-generated content (posts, comments, files)
- Survey responses and feedback
- Support ticket content

### Data Collected Automatically
- IP address
- Browser type and version
- Operating system
- Device identifiers (device ID, advertising ID)
- Referring URLs
- Pages visited and time spent
- Click patterns and interactions
- Location data (GPS, IP-based geolocation)
- Log data (access times, error logs)

### Data from Third Parties
- Social media profile data (via OAuth/social login)
- Payment processor data
- Analytics provider data
- Advertising network data
- Public databases and data brokers

---

## Third-Party Data Sharing

You must disclose all third parties that receive user data. Common categories include:

| Third-Party Category | Examples | Typical Data Shared |
|---------------------|----------|-------------------|
| Analytics | Google Analytics, Mixpanel, Amplitude | Usage data, device info, IP |
| Payment Processing | Stripe, PayPal, Braintree | Payment info, billing address |
| Email Services | SendGrid, Mailchimp, ConvertKit | Email address, name |
| Advertising | Google Ads, Facebook Ads, Twitter Ads | Device ID, browsing behavior |
| Cloud Hosting | AWS, Google Cloud, Azure | All stored data |
| Customer Support | Zendesk, Intercom, Freshdesk | Name, email, support content |
| Error Tracking | Sentry, Bugsnag, Datadog | Device info, error context |

**CCPA "Sale" of data:** Under CCPA, "sale" has a broad definition that includes sharing data for monetary OR other valuable consideration. If you use advertising pixels that send user data to ad networks, this may constitute a "sale" and requires a "Do Not Sell My Personal Information" link.

---

## Cookie Policies

See the separate [Cookie Consent Guide](./cookie-consent-guide.md) for detailed implementation guidance.

Key points for your privacy policy:
- List all cookies used, their purpose, and their duration
- Classify cookies: strictly necessary, performance, functionality, targeting
- Explain how users can manage cookie preferences
- Reference your cookie consent mechanism

---

## Data Retention

Establish clear retention periods for each data category:

| Data Category | Suggested Retention | Rationale |
|--------------|-------------------|-----------|
| Account data | Duration of account + 30 days | Service delivery |
| Transaction records | 7 years | Tax and legal compliance |
| Support tickets | 3 years after resolution | Quality and legal protection |
| Analytics data | 26 months | Trend analysis |
| Marketing consent records | Duration of consent + 3 years | Proof of consent |
| Server logs | 90 days | Security and debugging |
| Deleted account data | 30 days (grace period) then permanent deletion | User recovery window |

**GDPR principle:** Data should not be kept longer than necessary for the purpose for which it was collected. If you cannot justify retention, delete it.

---

## User Rights

### GDPR User Rights

| Right | Description | Response Deadline |
|-------|-------------|------------------|
| Right of Access | Users can request a copy of their personal data | 30 days |
| Right to Rectification | Users can correct inaccurate data | 30 days |
| Right to Erasure ("Right to be Forgotten") | Users can request deletion of their data | 30 days |
| Right to Restrict Processing | Users can limit how their data is used | 30 days |
| Right to Data Portability | Users can receive their data in a machine-readable format | 30 days |
| Right to Object | Users can object to processing based on legitimate interests | 30 days |
| Rights Related to Automated Decision-Making | Users can request human review of automated decisions | 30 days |

### CCPA/CPRA User Rights

| Right | Description | Response Deadline |
|-------|-------------|------------------|
| Right to Know | Users can request what data is collected and how it is used | 45 days |
| Right to Delete | Users can request deletion | 45 days |
| Right to Opt Out | Users can opt out of sale/sharing of personal information | 15 business days |
| Right to Non-Discrimination | Users cannot be penalized for exercising rights | Immediate |
| Right to Correct | Users can correct inaccurate data | 45 days |
| Right to Limit | Users can limit use of sensitive personal information | 15 business days |

### Implementing Rights Requests

- Provide clear instructions for submitting requests (email, web form, in-app)
- Verify the identity of the requester before fulfilling requests
- Track all requests and maintain records of responses
- Respond within the required timeframe, even if only to acknowledge receipt
- Provide responses free of charge (GDPR allows reasonable fee for manifestly unfounded/excessive requests)

---

## Children's Privacy (COPPA)

The Children's Online Privacy Protection Act (COPPA) applies to websites and online services directed at children under 13, or that knowingly collect information from children under 13.

### COPPA Requirements

- **Verifiable parental consent** before collecting personal information from children
- **Clear privacy notice** directed at parents describing data practices
- **Parental rights:** Parents can review, delete, and refuse further collection of their child's data
- **Data minimization:** Collect only what is reasonably necessary
- **Security:** Reasonable procedures to protect children's data
- **No conditioning:** Cannot condition a child's participation on disclosing more data than necessary

### If Your Product Is NOT for Children

Include a statement in your privacy policy:
> "Our service is not directed to individuals under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information as soon as possible."

### If Your Product MAY Be Used by Children

- Implement age-gating mechanisms
- Obtain verifiable parental consent
- Provide a separate, child-friendly privacy notice
- Limit data collection for child users
- Disable targeted advertising for child users
- Consider engaging a COPPA compliance service (e.g., kidSAFE, PRIVO)

### GDPR and Children

Under GDPR, the age of consent for data processing varies by member state (13 to 16 years). In many EU countries it is 16. Below that age, parental consent is required.

---

## International Considerations

### Data Transfer Mechanisms

If you transfer personal data across borders, you need legal mechanisms in place:

**EU to Non-EU Transfers:**
- **Adequacy decisions:** The European Commission has recognized certain countries as providing adequate protection (e.g., Canada, Japan, South Korea, UK, Switzerland)
- **Standard Contractual Clauses (SCCs):** Pre-approved contract terms for data transfers
- **Binding Corporate Rules (BCRs):** For intra-group international transfers
- **EU-US Data Privacy Framework:** For transfers to certified US organizations (post-2023)

**Key considerations:**
- Identify where your data is stored and processed
- Identify where your service providers are located
- Implement appropriate transfer mechanisms
- Document your data transfer impact assessments

### Multi-Jurisdictional Compliance

When your product serves users in multiple jurisdictions:
- Build to the strictest standard (usually GDPR)
- Layer additional requirements on top (CCPA opt-out, COPPA age-gating)
- Maintain a mapping of which regulations apply to which user segments
- Consider region-specific privacy policy addenda

---

## Privacy Policy Template Structure

Use this structure as a starting point for your privacy policy:

```
1. Introduction
   - Who we are
   - What this policy covers
   - Effective date and last updated date

2. Information We Collect
   2.1 Information You Provide
   2.2 Information Collected Automatically
   2.3 Information from Third Parties

3. How We Use Your Information
   3.1 Service Delivery
   3.2 Communication
   3.3 Marketing (with opt-out reference)
   3.4 Analytics and Improvement
   3.5 Legal Compliance

4. Legal Basis for Processing (GDPR)
   4.1 Consent
   4.2 Contract Performance
   4.3 Legitimate Interests
   4.4 Legal Obligations

5. How We Share Your Information
   5.1 Service Providers
   5.2 Business Transfers
   5.3 Legal Requirements
   5.4 With Your Consent

6. Cookies and Tracking Technologies
   (Reference to Cookie Policy)

7. Data Retention

8. Data Security

9. Your Rights
   9.1 Rights for EU/EEA Residents (GDPR)
   9.2 Rights for California Residents (CCPA/CPRA)
   9.3 Rights for Canadian Residents (PIPEDA)
   9.4 How to Exercise Your Rights

10. International Data Transfers

11. Children's Privacy

12. Changes to This Policy

13. Contact Us
```

---

## Privacy Policy Generators and Tools

### Free Generators
- **Termly** (termly.io) -- Free basic privacy policy generator
- **PrivacyPolicies.com** -- Free generator with paid upgrade options
- **FreePrivacyPolicy.com** -- Simple generator for basic needs

### Paid/Premium Tools
- **Iubenda** (iubenda.com) -- Comprehensive privacy management, auto-updating policies, cookie solution
- **Termageddon** (termageddon.com) -- Auto-updating privacy policies that track law changes
- **Enzuzo** (enzuzo.com) -- Privacy compliance platform with policy generation

### Consent Management Platforms (CMPs)
- **Cookiebot** (cookiebot.com) -- Cookie consent and privacy compliance
- **OneTrust** (onetrust.com) -- Enterprise privacy management
- **Osano** (osano.com) -- Consent management and data privacy

### Legal Review
Even when using generators, have your privacy policy reviewed by a qualified attorney, especially if:
- You handle sensitive personal data (health, financial, biometric)
- You target children or vulnerable populations
- You operate in highly regulated industries
- You transfer data internationally
- Your business exceeds CCPA thresholds

---

## Compliance Checklist

### General Requirements
- [ ] Privacy policy is publicly accessible and easy to find (footer link on every page)
- [ ] Written in clear, plain language (not legalese)
- [ ] Available in all languages your product supports
- [ ] Includes effective date and last-updated date
- [ ] Contact information for privacy inquiries is provided
- [ ] Policy covers all data collection, use, and sharing practices

### GDPR Compliance
- [ ] Legal basis identified for each processing activity
- [ ] Data Protection Officer appointed (if required)
- [ ] Records of Processing Activities (ROPA) maintained
- [ ] Data Processing Agreements with all processors
- [ ] Data Protection Impact Assessment conducted (if high-risk processing)
- [ ] Breach notification procedures in place (72-hour requirement)
- [ ] User rights request procedures established
- [ ] Consent is freely given, specific, informed, and unambiguous
- [ ] International data transfer mechanisms documented

### CCPA/CPRA Compliance
- [ ] "Do Not Sell or Share My Personal Information" link on homepage
- [ ] Two or more methods for consumers to submit requests
- [ ] Verification process for consumer requests
- [ ] Financial incentive notices (if offering incentives for data)
- [ ] Service provider contracts include CCPA-required terms
- [ ] Privacy policy updated at least annually
- [ ] Employee/job applicant privacy notice (if applicable)
- [ ] Sensitive personal information handling procedures

### COPPA Compliance (if applicable)
- [ ] Age-gating mechanism implemented
- [ ] Parental consent mechanism in place
- [ ] Parental notice provided
- [ ] Data minimization for children's data
- [ ] No behavioral advertising to children
- [ ] Parental review and deletion capabilities

### Ongoing Maintenance
- [ ] Review privacy policy at least quarterly
- [ ] Update policy when new data practices are introduced
- [ ] Monitor regulatory changes in applicable jurisdictions
- [ ] Conduct annual data mapping exercise
- [ ] Test user rights request fulfillment procedures
- [ ] Maintain records of all privacy impact assessments
- [ ] Train team members on privacy obligations

---

## Key Takeaways

1. **Start with the strictest standard** (GDPR) and layer additional requirements on top
2. **Be transparent** -- users should never be surprised by how their data is used
3. **Keep it updated** -- a stale privacy policy is a liability
4. **Implement, do not just document** -- your practices must match your policy
5. **Get legal review** -- generators are a starting point, not a substitute for legal counsel
6. **Privacy by design** -- build privacy considerations into your product from the start, not as an afterthought

---

*This guide is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for advice specific to your situation and jurisdiction.*
