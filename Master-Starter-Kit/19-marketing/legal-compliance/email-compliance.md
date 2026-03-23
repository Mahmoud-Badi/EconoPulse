# Email Marketing Compliance Guide

> A comprehensive reference for complying with email marketing laws across the US, EU, and Canada. Covers CAN-SPAM, GDPR, and CASL requirements, consent models, and practical implementation.

---

## Table of Contents

1. [Overview of Email Marketing Laws](#overview-of-email-marketing-laws)
2. [CAN-SPAM Act (United States)](#can-spam-act-united-states)
3. [GDPR Email Requirements (European Union)](#gdpr-email-requirements-european-union)
4. [CASL (Canada)](#casl-canada)
5. [Consent Models: Double Opt-In vs Single Opt-In](#consent-models)
6. [Transactional vs Marketing Emails](#transactional-vs-marketing-emails)
7. [Unsubscribe Requirements](#unsubscribe-requirements)
8. [Sender Identification and Physical Address](#sender-identification-and-physical-address)
9. [Subject Line Rules](#subject-line-rules)
10. [Penalties for Violations](#penalties-for-violations)
11. [Email Compliance Checklist](#email-compliance-checklist)
12. [Implementation Guide](#implementation-guide)

---

## Overview of Email Marketing Laws

Three primary regulations govern email marketing for most digital products:

| Regulation | Jurisdiction | Consent Model | Key Requirement |
|-----------|-------------|---------------|-----------------|
| CAN-SPAM | United States | Opt-out | Must honor unsubscribe within 10 business days |
| GDPR | European Union / EEA | Opt-in (explicit consent) | Prior consent required before sending marketing emails |
| CASL | Canada | Opt-in (express or implied consent) | Express or implied consent required with strict record-keeping |

**Critical distinction:** CAN-SPAM is an opt-out law (you can send until someone unsubscribes), while GDPR and CASL are opt-in laws (you need permission before sending). Always build for the strictest standard.

---

## CAN-SPAM Act (United States)

The Controlling the Assault of Non-Solicited Pornography And Marketing Act of 2003 establishes requirements for commercial email messages.

### Core Requirements

1. **No false or misleading header information** -- The "From," "To," "Reply-To," and routing information must be accurate and identify the person or business sending the message.

2. **No deceptive subject lines** -- The subject line must accurately reflect the content of the message.

3. **Identify the message as an ad** -- The law gives you flexibility in how to do this, but you must disclose clearly and conspicuously that the message is an advertisement.

4. **Include your physical postal address** -- Every email must include a valid physical postal address. This can be:
   - A current street address
   - A post office box registered with the US Postal Service
   - A private mailbox registered with a commercial mail receiving agency

5. **Tell recipients how to opt out** -- Every email must include a clear and conspicuous explanation of how the recipient can opt out of future emails.

6. **Honor opt-out requests promptly** -- You must process unsubscribe requests within 10 business days. You cannot charge a fee, require any information beyond an email address, or make the recipient take any step other than sending a reply email or visiting a single page to unsubscribe.

7. **Monitor what others do on your behalf** -- If you hire a company to handle your email marketing, you are still legally responsible for compliance.

### What CAN-SPAM Does NOT Require
- CAN-SPAM does **not** require prior consent to send commercial email
- CAN-SPAM does **not** require double opt-in
- CAN-SPAM does **not** create a private right of action (only the FTC and state attorneys general can enforce it)

### Common CAN-SPAM Misconceptions

| Misconception | Reality |
|--------------|---------|
| "I only send to people who signed up" | Good practice, but CAN-SPAM itself does not require prior consent |
| "Transactional emails are exempt" | Partially true -- transactional emails have fewer requirements but must not be misleading |
| "I can charge for unsubscribing" | Absolutely not -- unsubscribe must be free and easy |
| "I have 30 days to process unsubscribes" | No -- you have 10 business days |

---

## GDPR Email Requirements (European Union)

GDPR imposes significantly stricter requirements than CAN-SPAM. If you have any EU/EEA subscribers, these rules apply.

### Consent Requirements

Under GDPR, consent for marketing emails must be:

- **Freely given** -- Not bundled with other terms or conditions. No pre-checked boxes. Consent cannot be a condition of service (unless the email is necessary for the service).
- **Specific** -- Consent must be for a specific purpose. "We may contact you for marketing purposes" is sufficient, but vague blanket consent is not.
- **Informed** -- The person must know what they are consenting to, who is collecting the data, and how it will be used.
- **Unambiguous** -- Requires a clear affirmative action (checking a box, clicking a button). Silence, pre-ticked boxes, or inactivity do not constitute consent.

### Legitimate Interest Exception

In some cases, you may be able to send marketing emails based on "legitimate interest" rather than explicit consent:

- The recipient is an existing customer
- You are marketing similar products or services to what they purchased
- You gave them a clear opportunity to opt out at the time of data collection
- You offer an opt-out in every email

This is sometimes called the "soft opt-in" and is recognized under the UK Privacy and Electronic Communications Regulations (PECR) and similar implementations in other EU member states. However, this exception is narrow and must be used carefully.

### Record-Keeping

Under GDPR, you must be able to demonstrate that consent was given. Maintain records of:

- When consent was given (timestamp)
- How consent was given (which form, which page)
- What the person was told at the time of consent
- Whether consent has been withdrawn

### Double Opt-In Under GDPR

While GDPR does not explicitly require double opt-in, it is considered best practice and is effectively required in some EU member states (notably Germany). Double opt-in provides clear evidence that:
- The email address belongs to the person who signed up
- The person actively confirmed their desire to receive emails

---

## CASL (Canada)

Canada's Anti-Spam Legislation is one of the strictest email marketing laws in the world.

### Consent Types Under CASL

**Express Consent:**
- Obtained through a clear, affirmative opt-in
- Does not expire (remains valid until withdrawn)
- Required for most marketing communications
- Must clearly state: who is seeking consent, why consent is sought, and that consent can be withdrawn

**Implied Consent:**
- Exists in specific situations:
  - Existing business relationship (within 2 years of last purchase or within 6 months of an inquiry)
  - Existing non-business relationship (within 2 years, e.g., donations, memberships)
  - Conspicuously published email addresses (with no statement that the person does not wish to receive commercial emails)
- Time-limited -- you must convert implied consent to express consent before it expires

### CASL Unique Requirements

- **Unsubscribe mechanism must remain functional for 60 days** after the message is sent
- **Unsubscribe requests must be processed within 10 business days**
- **Consent records must be maintained** -- the burden of proof is on the sender
- **Installation of software requires separate consent** (relevant for apps and browser extensions)
- **Private right of action** -- individuals can sue for CASL violations (unlike CAN-SPAM)

---

## Consent Models

### Single Opt-In

**How it works:** A user enters their email address and is immediately added to the mailing list. No confirmation email is sent.

**Pros:**
- Lower friction -- more signups
- Faster list growth
- Simpler implementation

**Cons:**
- Higher risk of invalid/mistyped email addresses
- Higher spam complaint rates
- Higher bounce rates
- Harder to prove consent under GDPR/CASL
- Risk of bot signups
- May not satisfy strict GDPR interpretations in some countries

**When to use:** Only when operating exclusively under CAN-SPAM (US-only audience) and list quality is less critical than list size.

### Double Opt-In (Confirmed Opt-In)

**How it works:** A user enters their email address, then receives a confirmation email with a link they must click to verify their subscription.

**Pros:**
- Verifies the email address is real and belongs to the subscriber
- Provides strong evidence of consent (GDPR compliance)
- Lower bounce rates and spam complaints
- Higher engagement rates
- Cleaner email list
- Required or strongly recommended under GDPR and CASL

**Cons:**
- Some subscribers will not complete the confirmation step (10-30% drop-off typical)
- Adds friction to the signup process
- Requires additional email infrastructure

**When to use:** Always, unless you have a compelling reason not to. This is the industry standard and the safest approach for global compliance.

### Recommendation by Product Type

| Product Type | Recommended Consent Model | Rationale |
|-------------|--------------------------|-----------|
| SaaS | Double opt-in | Global user base, GDPR compliance |
| Mobile App | Double opt-in | App store policies reinforce privacy |
| Marketplace | Double opt-in | Multiple user types, complex consent |
| Developer Tool | Double opt-in | Developer audience values privacy |
| Client Site | Depends on jurisdiction | Match to the client's user base |

---

## Transactional vs Marketing Emails

Understanding the distinction is critical because transactional emails have different (typically fewer) compliance requirements.

### Transactional Emails (also called "Relationship" emails)

Emails whose primary purpose is to facilitate an agreed-upon transaction or update the customer about an ongoing transaction:

- Order confirmations and receipts
- Shipping notifications
- Password resets
- Account verification emails
- Security alerts
- Payment failure notifications
- Service disruption notices
- Legal/policy update notifications
- Subscription renewal reminders (without upselling)

**Compliance:** Transactional emails do not need an unsubscribe link under CAN-SPAM (though it is good practice). They must still not contain false headers or misleading information. Under GDPR, transactional emails are typically sent under "contractual necessity" rather than consent.

### Marketing Emails (also called "Commercial" emails)

Emails whose primary purpose is commercial -- advertising, promoting a product, or driving a sale:

- Newsletters
- Promotional offers and discounts
- Product announcements
- Event invitations
- Re-engagement campaigns
- Cross-sell and upsell emails
- Content marketing (blog posts, guides)
- Survey requests (if tied to marketing goals)

**Compliance:** Full compliance requirements apply. Unsubscribe link required. Consent required under GDPR and CASL.

### The Gray Area

Some emails blur the line. Under CAN-SPAM, if an email contains both transactional and commercial content, the "primary purpose" test applies:

- If the subject line would lead a reasonable person to conclude the message is commercial, it is commercial
- If the transactional content appears first and the commercial content is secondary, it may be classified as transactional
- When in doubt, treat it as a marketing email and apply full compliance requirements

**Best practice:** Keep transactional and marketing emails separate. Do not sneak promotional content into order confirmation emails.

---

## Unsubscribe Requirements

### Universal Requirements (All Jurisdictions)

- Every marketing email must include an unsubscribe mechanism
- Unsubscribe must be free of charge
- Unsubscribe must not require login or account access
- Unsubscribe should be processed as quickly as possible (maximum periods vary by jurisdiction)

### CAN-SPAM Unsubscribe Rules
- Must be clearly and conspicuously displayed
- Can be a reply-to mechanism or a link to a web page
- The opt-out mechanism must be able to process requests for at least 30 days after the email is sent
- Must be processed within 10 business days
- Cannot require the recipient to provide any information beyond their email address
- Cannot require the recipient to pay, visit more than one page, or take any step other than a single reply or page visit

### GDPR Unsubscribe Rules
- Withdrawal of consent must be as easy as giving consent
- Should be a one-click process
- Must be processed without undue delay
- Should not require login or account creation
- Consider implementing list-unsubscribe headers for email clients that support them

### CASL Unsubscribe Rules
- Must be functional for at least 60 days after the email is sent
- Must be processed within 10 business days
- Must include contact information (name, mailing address, phone number, email, or web address)

### Best Practices for Unsubscribe Implementation

- **One-click unsubscribe** -- Do not force users through multiple pages
- **Preference center** -- Offer options to reduce frequency or change email types, but always include a "unsubscribe from all" option
- **List-Unsubscribe header** -- Implement RFC 8058 one-click unsubscribe header (Gmail and other providers now require this)
- **Confirmation page** -- Show a simple confirmation that unsubscribe was successful
- **Do not re-subscribe** -- Once someone unsubscribes, do not add them back without explicit new consent
- **Suppression list** -- Maintain a suppression list of unsubscribed addresses and check against it before every send

---

## Sender Identification and Physical Address

### Requirements by Jurisdiction

**CAN-SPAM:**
- Clear identification of the sender in the "From" line
- Valid physical postal address in the email body
- Acceptable: street address, PO Box, or registered commercial mail receiving agency address

**GDPR:**
- Identity and contact details of the data controller
- Contact details of the Data Protection Officer (if applicable)
- These can be in the privacy policy linked from the email rather than in every email body

**CASL:**
- Name of the person/organization sending the message
- Mailing address and either a phone number, email address, or web address
- If sending on behalf of another organization, identify both parties

### Practical Solutions for Physical Address

For solo developers, freelancers, or remote teams who do not want to use a home address:

| Solution | Approximate Cost | Notes |
|----------|-----------------|-------|
| PO Box | $100-350/year (US) | Acceptable under CAN-SPAM |
| Virtual mailbox (e.g., Earth Class Mail, Anytime Mailbox) | $100-300/year | Provides a real street address |
| Coworking space address | Varies | Check if mail forwarding is included |
| Registered agent address | $50-300/year | Often used for LLC registration |

---

## Subject Line Rules

### Legal Requirements

**CAN-SPAM:**
- Subject lines must not be deceptive or misleading
- The subject line must accurately reflect the content of the email
- "Re:" or "Fwd:" prefixes should not be used unless the email is actually a reply or forward

**GDPR:**
- No specific subject line rules, but the principle of transparency applies
- Misleading subject lines could undermine the validity of consent

**CASL:**
- Subject lines must not be misleading about the content or purpose of the email

### Subject Line Best Practices for Compliance

- Do not use "Re:" or "Fwd:" to fake prior conversation
- Do not use misleading urgency ("Your account has been compromised" for a marketing email)
- Do not impersonate other companies or individuals
- Do not use "Invoice" or "Receipt" for marketing emails
- Clearly indicate if the email is an advertisement where required
- Avoid all-caps subject lines (not illegal, but triggers spam filters and is considered deceptive by some regulators)

---

## Penalties for Violations

### CAN-SPAM Penalties
- **Up to $51,744 per email** in violation
- Only enforceable by the FTC and state attorneys general (no private right of action)
- ISPs can also sue under CAN-SPAM
- Real-world example: Expedia was fined $200,000 for CAN-SPAM violations in 2017

### GDPR Penalties
- **Up to EUR 20 million or 4% of global annual turnover** (whichever is higher)
- Individual data subjects can also seek compensation for damages
- Real-world example: Austrian Post was fined EUR 18 million for direct marketing violations in 2019

### CASL Penalties
- **Up to CAD 10 million per violation** for organizations
- **Up to CAD 1 million per violation** for individuals
- Private right of action allows individuals to sue
- Real-world example: Compu-Finder was fined CAD 1.1 million for sending commercial emails without consent in 2015

### Beyond Fines

Non-compliance also leads to:
- **Deliverability damage** -- ISPs track complaint rates and will throttle or block your sending domain
- **Blacklisting** -- Your domain or IP can be added to email blacklists (Spamhaus, Barracuda)
- **Reputation damage** -- Public enforcement actions generate negative press
- **Loss of email service provider access** -- ESPs (Mailchimp, SendGrid, etc.) will terminate your account for high complaint rates or compliance violations

---

## Email Compliance Checklist

### Before Sending Any Campaign

- [ ] Consent was obtained for all recipients (explicit consent for GDPR/CASL)
- [ ] Consent records are stored with timestamps and context
- [ ] The "From" name and email address are accurate and recognizable
- [ ] A valid physical mailing address is included in the email
- [ ] The subject line accurately reflects the email content
- [ ] The email is identified as an advertisement (where required)
- [ ] A clear, conspicuous, and functional unsubscribe link is present
- [ ] The unsubscribe mechanism works and has been tested
- [ ] The email has been checked against your suppression/unsubscribe list
- [ ] List-Unsubscribe header is implemented (RFC 8058)

### Ongoing Compliance

- [ ] Unsubscribe requests are processed within 10 business days (or faster)
- [ ] Suppression list is maintained and checked before every send
- [ ] Consent records are backed up and accessible
- [ ] Bounce management is active (remove hard bounces immediately)
- [ ] Complaint rates are monitored (keep below 0.1%)
- [ ] List hygiene is performed regularly (remove inactive subscribers)
- [ ] Privacy policy is linked in emails and kept up to date
- [ ] Email sending practices are documented and team members are trained
- [ ] Third-party email processors have appropriate data processing agreements

### List Acquisition

- [ ] Lists are never purchased or rented
- [ ] Co-registration partnerships clearly identify all parties
- [ ] Signup forms clearly describe what the subscriber will receive
- [ ] Pre-checked boxes are never used for email consent (GDPR)
- [ ] Consent for email marketing is separate from Terms of Service acceptance (GDPR)

---

## Implementation Guide

### Setting Up Compliant Email Collection

**Step 1: Design the signup form**
- Clear description of what subscribers will receive
- Separate checkbox for marketing consent (not bundled with terms)
- No pre-checked boxes
- Link to privacy policy

**Step 2: Implement double opt-in flow**
1. User submits email via signup form
2. System sends confirmation email with unique verification link
3. User clicks verification link
4. System records: email, timestamp, IP address, form URL, consent text shown
5. User is added to mailing list

**Step 3: Store consent records**
Store the following for every subscriber:
- Email address
- Consent timestamp (UTC)
- Consent method (form URL, API, import)
- IP address at time of consent
- Exact consent text that was displayed
- Confirmation timestamp (for double opt-in)

**Step 4: Implement unsubscribe**
- One-click unsubscribe link in every email
- List-Unsubscribe header in email headers
- Preference center (optional but recommended)
- Suppression list that persists even if the subscriber is deleted from the main list

**Step 5: Set up monitoring**
- Track bounce rates (remove hard bounces automatically)
- Track complaint rates (investigate any spike above 0.05%)
- Track unsubscribe rates (normal is 0.1-0.5% per campaign)
- Set up alerts for blacklist appearances (use tools like MXToolbox)

### Recommended Email Infrastructure

| Component | Options |
|-----------|---------|
| Email Service Provider | SendGrid, Postmark, Amazon SES, Mailgun |
| Marketing Automation | ConvertKit, Mailchimp, ActiveCampaign, Drip |
| Transactional Email | Postmark, SendGrid, Amazon SES |
| List Management | Built into ESP or CRM |
| Consent Storage | Database with audit log, or CRM |
| Deliverability Monitoring | GlockApps, MXToolbox, Sender Score |

---

## Key Takeaways

1. **Build for GDPR** even if you think your audience is US-only -- you will likely have international users
2. **Double opt-in is the safest approach** for any product with a global audience
3. **Keep transactional and marketing emails separate** in both infrastructure and content
4. **Store consent records** with timestamps, context, and the exact text shown to the user
5. **Never purchase email lists** -- it violates GDPR, CASL, and almost every ESP's terms of service
6. **Test your unsubscribe flow** regularly and make it genuinely easy
7. **Monitor deliverability metrics** -- compliance failures show up in bounce and complaint rates before they show up in lawsuits

---

*This guide is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for advice specific to your situation and jurisdiction.*
