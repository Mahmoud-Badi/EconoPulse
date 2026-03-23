# Privacy Policy — {{PROJECT_NAME}}

> **Last Updated:** {{CURRENT_DATE}}
> **Effective Date:** {{LAUNCH_DATE}}

> **IMPORTANT:** This template provides structure and guidance for your privacy policy. It is NOT legal advice. Have an attorney review your final privacy policy before publishing. Every `{placeholder}` must be replaced with your specific information.

---

## 1. Introduction

Welcome to {{PROJECT_NAME}} ("**Service**," "**we**," "**us**," or "**our**"). This Privacy Policy explains how {{COMPANY_NAME}}, located at {{COMPANY_ADDRESS}}, collects, uses, discloses, and protects your personal information when you use our Service.

By using {{PROJECT_NAME}}, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our Service.

---

## 2. Information We Collect

### 2.1 Information You Provide Directly

<!-- Populate from data-sensitivity.template.md — Level 4 (PII) data types -->

| Data Type | When Collected | Purpose |
|-----------|---------------|---------|
| Name and email address | Account registration | Account creation, communication |
| {{DATA_TYPE}} | {{WHEN}} | {{PURPOSE}} |
| {{DATA_TYPE}} | {{WHEN}} | {{PURPOSE}} |
| {{DATA_TYPE}} | {{WHEN}} | {{PURPOSE}} |

### 2.2 Information Collected Automatically

<!-- Populate from data-sensitivity.template.md — Level 2-3 data types -->

| Data Type | Collection Method | Purpose |
|-----------|------------------|---------|
| IP address | Server logs | Security, abuse prevention |
| Browser type and version | HTTP headers | Service optimization |
| Device information | HTTP headers | Service optimization |
| Pages visited and actions taken | Analytics | Service improvement |
| {{DATA_TYPE}} | {{METHOD}} | {{PURPOSE}} |

### 2.3 Information from Third Parties

<!-- Populate from integrations-map.template.md — services that send data TO you -->

| Source | Data Received | Purpose |
|--------|--------------|---------|
| {{OAUTH_PROVIDER}} (if social login) | Name, email, profile picture | Account creation |
| {{PAYMENT_PROCESSOR}} | Payment confirmation, subscription status | Billing |
| {{DATA_SOURCE}} | {{DATA}} | {{PURPOSE}} |

---

## 3. How We Use Your Information

We use collected information for:

1. **Service delivery** — Providing, maintaining, and improving {{PROJECT_NAME}}
2. **Account management** — Creating and managing your account, authenticating your identity
3. **Communication** — Sending service-related notices, responding to inquiries, providing support
4. **Security** — Detecting, preventing, and addressing fraud, abuse, and security issues
5. **Analytics** — Understanding how our Service is used to improve user experience
6. **Legal compliance** — Fulfilling our legal obligations

<!-- IF MARKETING_ENABLED -->
7. **Marketing** — Sending promotional communications (only with your consent, and you can opt out at any time)
<!-- ENDIF -->

---

<!-- IF GDPR_APPLIES -->
## 4. Legal Basis for Processing (GDPR)

If you are in the European Economic Area (EEA), we process your personal data under the following legal bases:

| Purpose | Legal Basis |
|---------|-------------|
| Service delivery | Performance of a contract (Article 6(1)(b)) |
| Account management | Performance of a contract (Article 6(1)(b)) |
| Security and fraud prevention | Legitimate interest (Article 6(1)(f)) |
| Analytics | Legitimate interest (Article 6(1)(f)) |
| Marketing communications | Consent (Article 6(1)(a)) |
| Legal compliance | Legal obligation (Article 6(1)(c)) |
| {{PURPOSE}} | {{LEGAL_BASIS}} |
<!-- ENDIF -->

---

## 5. How We Share Your Information

We do **not** sell your personal information. We share your information only in the following circumstances:

### 5.1 Service Providers

<!-- Populate from integrations-map.template.md — services that receive data FROM you -->

| Provider | Purpose | Data Shared |
|----------|---------|------------|
| {{HOSTING_PROVIDER}} | Hosting and infrastructure | All stored data (encrypted) |
| {{PAYMENT_PROCESSOR}} | Payment processing | Billing information |
| {{EMAIL_PROVIDER}} | Transactional email | Email address, name |
| {{ANALYTICS_PROVIDER}} | Usage analytics | Usage data, device info |
| {{ERROR_REPORTING}} | Error tracking | Device info, error context |
| {{PROVIDER}} | {{PURPOSE}} | {{DATA}} |

All service providers are contractually obligated to protect your data and process it only for the purposes we specify.

### 5.2 Legal Requirements

We may disclose your information if required by law, legal process, or government request, or to protect the rights, property, or safety of {{COMPANY_NAME}}, our users, or the public.

### 5.3 Business Transfers

If {{COMPANY_NAME}} is involved in a merger, acquisition, or sale of assets, your personal information may be transferred. We will notify you before your data is transferred and becomes subject to a different privacy policy.

<!-- IF CCPA_APPLIES -->
### 5.4 California Residents — Sale of Personal Information

We do **not** sell your personal information as defined by the California Consumer Privacy Act (CCPA). If this changes, we will update this policy and provide a "Do Not Sell or Share My Personal Information" link on our website.
<!-- ENDIF -->

---

## 6. Cookies and Tracking Technologies

<!-- IF HAS_COOKIES -->
We use cookies and similar technologies. For details, see our [Cookie Policy]({{COOKIE_POLICY_URL}}).

**Types of cookies we use:**

| Category | Purpose | Examples |
|----------|---------|---------|
| Strictly Necessary | Core functionality (login, security) | Session cookies, CSRF tokens |
| Functional | Remembering preferences | Language, theme, layout |
| Analytics | Understanding usage patterns | {{ANALYTICS_PROVIDER}} |
| {{CATEGORY}} | {{PURPOSE}} | {{EXAMPLES}} |

You can manage cookie preferences through your browser settings or our cookie consent tool.
<!-- ENDIF -->

<!-- IF NO_COOKIES -->
We use only strictly necessary cookies required for the Service to function (e.g., session cookies for authentication). We do not use tracking cookies or third-party analytics cookies.
<!-- ENDIF -->

---

## 7. Data Retention

<!-- Populate from data-sensitivity.template.md — retention policies -->

| Data Category | Retention Period | Reason |
|--------------|-----------------|--------|
| Account data | Duration of account + 30 days | Service delivery + deletion grace period |
| Transaction records | 7 years | Tax and legal compliance |
| Server logs | 90 days | Security and debugging |
| Analytics data | 26 months | Trend analysis |
| {{DATA_CATEGORY}} | {{PERIOD}} | {{REASON}} |

When data reaches the end of its retention period, it is securely deleted or anonymized.

---

## 8. Data Security

We implement industry-standard security measures to protect your information:

- Encryption in transit (TLS 1.2+)
- Encryption at rest for stored data
- Access controls and authentication for internal systems
- Regular security reviews
- {{ADDITIONAL_SECURITY_MEASURES}}

No method of electronic transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.

---

## 9. Your Rights

### 9.1 All Users

All users of {{PROJECT_NAME}} can:
- **Access** their personal data via account settings
- **Update** inaccurate personal data via account settings
- **Delete** their account and associated data by contacting {{PRIVACY_EMAIL}}
- **Opt out** of marketing communications via the unsubscribe link in any email

<!-- IF GDPR_APPLIES -->
### 9.2 European Economic Area (EEA) Residents

Under the GDPR, you have additional rights:

| Right | Description | How to Exercise |
|-------|-------------|-----------------|
| Access | Request a copy of your personal data | Email {{PRIVACY_EMAIL}} |
| Rectification | Correct inaccurate data | Account settings or email {{PRIVACY_EMAIL}} |
| Erasure | Request deletion of your data | Email {{PRIVACY_EMAIL}} |
| Restrict processing | Limit how we use your data | Email {{PRIVACY_EMAIL}} |
| Data portability | Receive your data in machine-readable format | Email {{PRIVACY_EMAIL}} |
| Object | Object to processing based on legitimate interests | Email {{PRIVACY_EMAIL}} |
| Withdraw consent | Withdraw previously given consent | Email {{PRIVACY_EMAIL}} or account settings |

We will respond to your request within **30 days**. You have the right to lodge a complaint with your local data protection authority.
<!-- ENDIF -->

<!-- IF CCPA_APPLIES -->
### 9.3 California Residents

Under the CCPA/CPRA, you have the right to:

| Right | Description | How to Exercise |
|-------|-------------|-----------------|
| Know | Request what data we collect and how it's used | Email {{PRIVACY_EMAIL}} |
| Delete | Request deletion of your data | Email {{PRIVACY_EMAIL}} |
| Opt out of sale/sharing | Opt out of data sale (we do not sell data) | N/A |
| Non-discrimination | Not be penalized for exercising your rights | Automatic |
| Correct | Correct inaccurate data | Account settings or email {{PRIVACY_EMAIL}} |

We will respond to your request within **45 days**. We will verify your identity before fulfilling any request.
<!-- ENDIF -->

---

<!-- IF INTERNATIONAL_TRANSFERS -->
## 10. International Data Transfers

Your information may be transferred to and processed in countries other than your own. Specifically:

- **Hosting:** {{HOSTING_PROVIDER}} — servers located in {{HOSTING_REGION}}
- **Service providers:** Various providers in {{PROVIDER_REGIONS}}

<!-- IF GDPR_APPLIES -->
For transfers outside the EEA, we rely on:
- Standard Contractual Clauses (SCCs) approved by the European Commission
- Adequacy decisions where applicable
- {{ADDITIONAL_TRANSFER_MECHANISMS}}
<!-- ENDIF -->
<!-- ENDIF -->

---

## 11. Children's Privacy

{{PROJECT_NAME}} is not directed to individuals under the age of {{MINIMUM_AGE}} (16 in the EU, 13 in the US). We do not knowingly collect personal information from children under this age. If we learn that we have collected data from a child, we will delete it promptly. If you believe we have collected data from a child, please contact {{PRIVACY_EMAIL}}.

---

## 12. Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. For significant changes, we will notify you via email or a prominent notice within the Service.

We encourage you to review this Privacy Policy periodically.

---

## 13. Contact Us

If you have questions about this Privacy Policy or our data practices:

- **Email:** {{PRIVACY_EMAIL}}
<!-- IF DPO_APPOINTED -->
- **Data Protection Officer:** {{DPO_EMAIL}}
<!-- ENDIF -->
- **Mail:** {{COMPANY_NAME}}, {{COMPANY_ADDRESS}}

---

*This privacy policy was generated using the Master Starter Kit legal document templates. It has been customized for {{PROJECT_NAME}} but should be reviewed by a qualified attorney before publication.*
