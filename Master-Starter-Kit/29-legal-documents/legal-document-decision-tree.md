# Legal Document Decision Tree

## How to Use This Document

Walk through each decision node. For each "YES," add that document to your project's legal requirements. At the end, you'll have a checklist of exactly which documents to generate.

**Input required:** Your completed `00-discovery/data-sensitivity.template.md` and `00-discovery/project-brief.template.md`.

---

## Node 1 — Privacy Policy

**Question:** Does your app collect any user data (including analytics, cookies, IP addresses)?

```
Does your app collect ANY user data?
  ├── YES → Privacy Policy is REQUIRED
  │         (This includes: email addresses, names, cookies,
  │          IP addresses, analytics data, device info — basically everything)
  │
  └── NO → You are building a fully static site with zero tracking.
            Privacy Policy is still RECOMMENDED (it builds trust).
```

**Verdict:** Almost every product needs a Privacy Policy. If in doubt, create one.

---

## Node 2 — Terms of Service

**Question:** Do users create accounts, make purchases, or interact with your service?

```
Do users interact with your service in any way?
  ├── YES → Terms of Service is REQUIRED
  │         Covers: acceptable use, liability limitations,
  │         dispute resolution, account termination, IP ownership
  │
  └── NO → You are building a read-only informational site.
            Terms of Service is still RECOMMENDED.
```

**Verdict:** If users sign up, pay, or submit content — Terms of Service is mandatory.

---

## Node 3 — Cookie Policy

**Question:** Does your app use cookies or similar tracking technologies?

```
Does your app use cookies, localStorage, pixels, or tracking scripts?
  ├── YES → Cookie Policy is REQUIRED (especially for EU users)
  │
  │   Do you use third-party analytics (Google Analytics, Mixpanel, etc.)?
  │     ├── YES → Include third-party cookie disclosure
  │     └── NO → Document only your first-party cookies
  │
  │   Do you use advertising/retargeting pixels?
  │     ├── YES → Include ad tracking disclosure + opt-out mechanism
  │     └── NO → Skip advertising section
  │
  └── NO → Cookie Policy is NOT needed
            (But verify: even session cookies count)
```

**Verdict:** If you use any cookies beyond strictly necessary session cookies, create a Cookie Policy. The EU ePrivacy Directive requires it.

---

## Node 4 — Acceptable Use Policy (AUP)

**Question:** Can users create, upload, or share content on your platform?

```
Can users create or upload content?
  ├── YES → Acceptable Use Policy is REQUIRED
  │
  │   What types of content?
  │     ├── Text (comments, posts, messages) → Include content moderation rules
  │     ├── Files (documents, images, video) → Include file size/type restrictions
  │     ├── Code (plugins, integrations) → Include security and liability terms
  │     └── Financial data (invoices, reports) → Include accuracy disclaimers
  │
  └── NO → AUP is NOT needed
            (Users only consume content you create)
```

**Verdict:** Any platform with user-generated content needs an AUP to define what's allowed and protect you from liability.

---

## Node 5 — Data Processing Agreement (DPA)

**Question:** Do you process personal data on behalf of business customers (B2B)?

```
Is your product B2B SaaS?
  ├── YES →
  │   Do your customers' end-users include EU residents?
  │     ├── YES → DPA is REQUIRED (GDPR Article 28)
  │     │         You are a "data processor" for your customer (the "data controller")
  │     │
  │     └── NO →
  │         Do enterprise customers request DPAs during procurement?
  │           ├── YES → DPA is REQUIRED (practically, even if not legally)
  │           └── NO → DPA is RECOMMENDED (shows maturity, speeds up enterprise sales)
  │
  └── NO (B2C) → DPA is NOT needed
                  (You are the data controller, not a processor)
```

**Verdict:** If you sell to businesses that have EU customers, a DPA is legally required. For any B2B SaaS, having a DPA ready speeds up enterprise procurement.

---

## Node 6 — End User License Agreement (EULA)

**Question:** Is your product a downloadable or installable application?

```
Is the product distributed via app store or download?
  ├── YES (Mobile app — iOS/Android) →
  │   EULA is REQUIRED
  │   Apple App Store requires a EULA (uses Apple's default if you don't provide one)
  │   Google Play requires Terms of Service / EULA for paid apps
  │
  ├── YES (Desktop application) →
  │   EULA is REQUIRED
  │   Covers: license grant, restrictions, termination, warranty disclaimers
  │
  └── NO (Web-only SaaS) →
        EULA is NOT needed
        (Terms of Service covers the same ground for web apps)
```

**Verdict:** Mobile apps need a EULA. Web-only SaaS can rely on Terms of Service instead.

---

## Node 7 — Refund / Cancellation Policy

**Question:** Does your product accept payments?

```
Does your product accept payments?
  ├── YES →
  │   What type of payments?
  │     ├── Subscriptions → Refund + Cancellation Policy REQUIRED
  │     │   Must cover: how to cancel, when cancellation takes effect,
  │     │   pro-rata refunds vs end-of-period, trial conversions
  │     │
  │     ├── One-time purchases → Refund Policy REQUIRED
  │     │   Must cover: refund window, conditions, process
  │     │
  │     └── Marketplace/platform fees → Refund + Dispute Policy REQUIRED
  │         Must cover: who is responsible for refunds (you vs seller),
  │         dispute resolution process
  │
  └── NO → Refund Policy is NOT needed
```

**Note:** This can be a section within your Terms of Service rather than a standalone document. EU consumers have a 14-day cooling-off period for online purchases by default.

---

## Decision Summary

After walking all nodes, check off which documents you need:

```markdown
## Legal Documents Required for {{PROJECT_NAME}}

| Document | Required? | Reason | Status |
|----------|-----------|--------|--------|
| Privacy Policy | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| Terms of Service | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| Cookie Policy | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| Acceptable Use Policy | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| Data Processing Agreement | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| EULA | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
| Refund/Cancellation Policy | [ ] Yes / [ ] No | {reason} | [ ] Draft / [ ] Reviewed / [ ] Published |
```

**Next step:** Generate each required document using the corresponding template in this directory.

---

## Placeholders Used

| Placeholder | Source | Description |
|-------------|--------|-------------|
| `{{PROJECT_NAME}}` | Step 1 intake | Product name |
| `{{COMPANY_NAME}}` | Step 1 intake | Legal entity name |
| `{{COMPANY_ADDRESS}}` | Step 1 intake | Registered business address |
| `{{PRIVACY_EMAIL}}` | Step 1 intake | Privacy inquiry email |
| `{{DPO_EMAIL}}` | Step 1 intake | Data Protection Officer email (if applicable) |
| `{{APPLICABLE_REGULATIONS}}` | `data-sensitivity.template.md` | GDPR, CCPA, HIPAA, etc. |
| `{{DATA_TYPES_COLLECTED}}` | `data-sensitivity.template.md` | All data types from classification |
| `{{THIRD_PARTY_SERVICES}}` | `integrations-map.template.md` | All third-party services receiving data |
| `{{PAYMENT_PROCESSOR}}` | Step 1 intake | Stripe, Paddle, LemonSqueezy, etc. |
| `{{HAS_MOBILE_APP}}` | Step 1 intake | Whether EULA is needed |
| `{{HAS_UGC}}` | Step 1 intake | Whether AUP is needed |
| `{{TARGET_JURISDICTIONS}}` | Step 1 intake | Countries/regions served |
