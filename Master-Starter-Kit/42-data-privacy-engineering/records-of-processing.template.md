# Records of Processing Activities

> {{PROJECT_NAME}} — GDPR Article 30 processing activity register, controller/processor determination, sub-processor documentation, and legal basis records.

---

## 1. Processing Activity Register

Every organization that processes personal data must maintain a record of processing activities. Under GDPR Article 30, this is a legal requirement for controllers with 250+ employees, controllers processing sensitive data, or controllers whose processing is not occasional. In practice, every organization should maintain one because regulators expect it and it is the foundation of all other privacy compliance.

This register is a living document. Update it whenever you add a new data collection point, integrate a new third-party service, change a retention period, or modify the purpose of existing processing.

### Register Template

| Activity Name | Purpose | Legal Basis | Data Categories | Data Subjects | Recipients | Retention Period | Transfers | Technical Measures |
|--------------|---------|-------------|-----------------|---------------|------------|-----------------|-----------|-------------------|
| User registration | Account creation and authentication | Contract necessity | Name, email, hashed password | Registered users | Auth service, email provider | Account lifetime + {{DATA_RETENTION_DEFAULT}} | {{CROSS_BORDER_MECHANISM}} | TLS, bcrypt hashing, encrypted at rest |
| Payment processing | Subscription billing | Contract necessity | Payment method, billing address, transaction history | Paying customers | {{PAYMENT_PROCESSOR}} | 7 years (tax obligation) | {{CROSS_BORDER_MECHANISM}} | PCI-DSS, tokenization, encrypted at rest |
| Analytics tracking | Product improvement | {{CONSENT_MODEL}} | Page views, clicks, session duration, device type | All users (with consent) | {{ANALYTICS_PROVIDER}} | {{DATA_RETENTION_DEFAULT}} | {{CROSS_BORDER_MECHANISM}} | Pseudonymization, IP truncation |
| Customer support | Issue resolution | Contract necessity | Name, email, conversation history, attachments | Users who contact support | {{SUPPORT_PLATFORM}} | 24 months after resolution | {{CROSS_BORDER_MECHANISM}} | Encrypted at rest, access-controlled |
| Email marketing | Product updates, promotions | Consent (opt-in) | Email, name, preferences | Subscribed users | {{EMAIL_PROVIDER}} | Until unsubscribe + 30 days | {{CROSS_BORDER_MECHANISM}} | Encrypted in transit, list hygiene |
| Error tracking | Application stability | Legitimate interest | IP address, user agent, stack traces, user ID | All users | {{ERROR_TRACKING_TOOL}} | 90 days | {{CROSS_BORDER_MECHANISM}} | Scrubbing PII from stack traces |
| *(Add rows for each processing activity — target {{PROCESSING_ACTIVITY_COUNT}} activities)* | | | | | | | | |

### Register SQL Schema

```sql
-- src/privacy/schema/processing_activities.sql

CREATE TABLE processing_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    purpose TEXT NOT NULL,
    legal_basis VARCHAR(50) NOT NULL CHECK (legal_basis IN (
        'consent', 'contract', 'legal_obligation',
        'vital_interest', 'public_interest', 'legitimate_interest'
    )),
    data_categories JSONB NOT NULL DEFAULT '[]',
    -- e.g., ["name", "email", "ip_address", "payment_info"]
    data_subjects VARCHAR(255) NOT NULL,
    -- e.g., "registered_users", "website_visitors", "employees"
    recipients JSONB NOT NULL DEFAULT '[]',
    -- e.g., [{"name": "Stripe", "purpose": "payment processing", "dpa_signed": true}]
    retention_period VARCHAR(100) NOT NULL,
    retention_justification TEXT,
    cross_border_transfers JSONB DEFAULT '[]',
    -- e.g., [{"destination": "US", "mechanism": "scc", "tia_completed": true}]
    technical_measures JSONB NOT NULL DEFAULT '[]',
    -- e.g., ["encryption_at_rest", "access_control", "pseudonymization"]
    organizational_measures JSONB DEFAULT '[]',
    -- e.g., ["staff_training", "access_reviews", "incident_response"]
    dpia_required BOOLEAN DEFAULT FALSE,
    dpia_reference VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review')),
    owner VARCHAR(255) NOT NULL,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    review_frequency VARCHAR(50) DEFAULT 'quarterly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_processing_activities_status ON processing_activities(status);
CREATE INDEX idx_processing_activities_legal_basis ON processing_activities(legal_basis);
CREATE INDEX idx_processing_activities_dpia ON processing_activities(dpia_required);

-- Audit trail for register changes
CREATE TABLE processing_activities_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES processing_activities(id),
    changed_by VARCHAR(255) NOT NULL,
    change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('created', 'updated', 'deactivated')),
    previous_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Controller vs. Processor Determination

Misidentifying your role as controller or processor is one of the most common privacy compliance failures. The distinction determines your obligations, liability, and required documentation.

### Determination Criteria

| Criterion | Controller | Processor |
|-----------|-----------|-----------|
| **Who determines the purpose?** | You decide WHY data is processed | Client decides WHY — you follow instructions |
| **Who determines the means?** | You decide HOW data is processed | Client decides HOW (you may choose technical details) |
| **Who has the relationship with data subjects?** | Users are YOUR users | Users are YOUR CLIENT'S users |
| **Who is liable to data subjects?** | You are directly liable | Client is primarily liable; you have limited direct liability |
| **What documentation is required?** | Full Article 30(1) register | Article 30(2) register (lighter) + DPA |
| **DSR fulfillment?** | You fulfill DSRs directly | You assist your client in fulfilling DSRs |

### Determination for {{PROJECT_NAME}}

For each data processing relationship, determine your role:

| Relationship | Your Role | Their Role | Justification |
|-------------|-----------|------------|---------------|
| End users using {{PROJECT_NAME}} | Controller | Data subject | You determine purposes and means |
| Cloud infrastructure (AWS/GCP/Azure) | Controller | Processor | They process on your instructions |
| Payment processor (Stripe/etc.) | Controller | Processor | They process payments on your behalf |
| Analytics provider | Controller | Processor | They analyze data per your configuration |
| Email service provider | Controller | Processor | They send emails on your behalf |
<!-- IF {{PRODUCT_TYPE}} == "b2b-saas" -->
| Enterprise client using your platform | Joint controller OR Processor | Controller OR Joint controller | Depends on who determines processing purposes — document carefully |
<!-- ENDIF -->

### Joint Controller Considerations

Joint controllership arises when two or more parties jointly determine the purposes and means of processing. This requires a Joint Controller Agreement (Article 26 GDPR) that defines:

- [ ] Each party's responsibilities for privacy notice obligations
- [ ] Each party's responsibilities for DSR fulfillment
- [ ] Contact point for data subjects
- [ ] Allocation of liability
- [ ] Internal arrangement documentation

---

## 3. Sub-Processor Register

Every third-party service that processes personal data on your behalf is a sub-processor. Most organizations significantly undercount their sub-processors on first audit.

### Sub-Processor Audit Checklist

- [ ] List every SaaS tool that receives user data (CRM, analytics, email, support, monitoring)
- [ ] List every cloud infrastructure component (databases, CDN, object storage, serverless)
- [ ] List every SDK that sends data to external servers (error tracking, analytics, A/B testing)
- [ ] List every API integration that receives personal data
- [ ] Check each tool's own sub-processor list (they often share data downstream)
- [ ] Verify DPA is signed with each sub-processor
- [ ] Verify each sub-processor's security posture (SOC 2, ISO 27001)

### Sub-Processor Register Template

| Processor Name | Purpose | Data Categories Shared | Processing Location | DPA Status | Security Certification | Sub-Processor List URL | Last Reviewed |
|---------------|---------|----------------------|---------------------|------------|----------------------|----------------------|---------------|
| AWS | Cloud infrastructure | All data categories | {{PRIVACY_SHIELD_REGION}} | Signed | SOC 2, ISO 27001 | aws.amazon.com/compliance/sub-processors | YYYY-MM-DD |
| Stripe | Payment processing | Payment data, billing address | US (with SCC) | Signed | PCI-DSS Level 1, SOC 2 | stripe.com/legal/service-providers | YYYY-MM-DD |
| SendGrid | Transactional email | Email address, name | US (with SCC) | Signed | SOC 2 | sendgrid.com/policies/subprocessors | YYYY-MM-DD |
| Sentry | Error tracking | IP, user agent, user ID, stack traces | US (with SCC) | Signed | SOC 2 | sentry.io/legal/subprocessors | YYYY-MM-DD |
| *(Add rows — target {{SUB_PROCESSOR_COUNT}} sub-processors)* | | | | | | | |

### Sub-Processor Change Notification

Under GDPR, you must notify your customers (if you are a processor) of sub-processor changes. Implement a notification mechanism:

```typescript
// src/privacy/sub-processor-notification.ts

interface SubProcessorChange {
  type: 'addition' | 'removal' | 'replacement';
  processorName: string;
  purpose: string;
  effectiveDate: Date;
  dataCategories: string[];
  processingLocation: string;
  objectionDeadline: Date; // Usually 30 days from notification
}

async function notifySubProcessorChange(change: SubProcessorChange): Promise<void> {
  // 1. Update the sub-processor register in the database
  await updateSubProcessorRegister(change);

  // 2. Notify all customers with active DPAs
  const affectedCustomers = await getCustomersWithDPA();

  for (const customer of affectedCustomers) {
    await sendNotification({
      to: customer.dpaContactEmail,
      template: 'sub-processor-change',
      data: {
        changeType: change.type,
        processorName: change.processorName,
        purpose: change.purpose,
        effectiveDate: change.effectiveDate,
        objectionDeadline: change.objectionDeadline,
        dataCategories: change.dataCategories,
        processingLocation: change.processingLocation,
      },
    });
  }

  // 3. Log the notification for compliance records
  await logComplianceEvent({
    type: 'sub_processor_change_notification',
    details: change,
    notifiedCount: affectedCustomers.length,
    timestamp: new Date(),
  });
}
```

---

## 4. Legal Basis Documentation

Every processing activity must have a documented legal basis. Under GDPR, there are six legal bases. You must select and document one for each processing activity BEFORE processing begins.

### Legal Basis Selection Guide

| Legal Basis | When to Use | Documentation Required | Can User Object? |
|------------|------------|----------------------|-----------------|
| **Consent** | Optional features, marketing, analytics, cookies | Consent record with timestamp, scope, version | Yes — withdrawal must be as easy as giving consent |
| **Contract** | Core service delivery, account management | Terms of service describing processing | No (but only for processing strictly necessary for the contract) |
| **Legal Obligation** | Tax records, fraud prevention, law enforcement requests | Citation of specific legal requirement | No |
| **Vital Interest** | Emergency situations (rare in SaaS) | Documentation of emergency circumstance | No |
| **Public Interest** | Government services (rare in commercial SaaS) | Legal mandate documentation | Yes |
| **Legitimate Interest** | Security monitoring, fraud detection, B2B marketing | Legitimate Interest Assessment (LIA) | Yes — must stop processing if objection is valid |

### Legitimate Interest Assessment Template

For each processing activity relying on legitimate interest, complete this assessment:

**Processing Activity:** *(name)*

**Step 1 — Purpose Test**
- What is the legitimate interest being pursued? *(describe specifically)*
- Is the processing necessary to achieve this interest? *(yes/no with justification)*
- Could the interest be achieved without this processing? *(describe alternatives considered)*

**Step 2 — Necessity Test**
- Is this processing proportionate to the interest pursued? *(yes/no with justification)*
- Is there a less privacy-invasive way to achieve the same purpose? *(describe alternatives)*
- What data is processed and is it the minimum necessary? *(list data elements and justify each)*

**Step 3 — Balancing Test**
- What is the impact on the data subject? *(describe)*
- Would data subjects reasonably expect this processing? *(yes/no with justification)*
- Are data subjects in a vulnerable position (children, employees, patients)? *(yes/no)*
- What safeguards are in place to mitigate impact? *(list)*
- Does the legitimate interest override the data subject's rights and freedoms? *(conclusion with justification)*

**Step 4 — Outcome**
- [ ] Legitimate interest is valid — processing may proceed with documented safeguards
- [ ] Legitimate interest is not valid — select alternative legal basis or do not process

---

## 5. Register Maintenance Cadence

A processing register that is not maintained becomes a compliance liability. Outdated registers give regulators evidence that you are not taking privacy seriously.

### Maintenance Schedule

| Activity | Frequency | Owner | Trigger |
|----------|-----------|-------|---------|
| Full register review | Quarterly | {{DPO_CONTACT}} or privacy lead | Calendar |
| New processing activity addition | As needed | Feature owner + privacy reviewer | New feature development, new integration |
| Sub-processor audit | Quarterly | Engineering lead | Calendar + sub-processor change notifications |
| Legal basis review | Annually | Legal + privacy lead | Calendar + regulatory changes |
| Retention period verification | Quarterly | Engineering lead | Calendar |
| Cross-border transfer review | Semi-annually | Privacy lead | Calendar + adequacy decision changes |
| DPA status verification | Annually | Legal | Calendar |
| Register accuracy spot-check | Monthly | Privacy lead | Calendar |

### Automated Register Monitoring

```typescript
// src/privacy/register-monitor.ts

interface RegisterHealthCheck {
  totalActivities: number;
  activitiesWithoutReview: number;
  expiredDPAs: number;
  missingLegalBasis: number;
  overdueReviews: number;
  processingWithoutDPIA: number;
}

async function checkRegisterHealth(): Promise<RegisterHealthCheck> {
  const activities = await db.query.processingActivities.findMany({
    where: eq(processingActivities.status, 'active'),
  });

  const now = new Date();
  const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  return {
    totalActivities: activities.length,
    activitiesWithoutReview: activities.filter(
      (a) => !a.lastReviewedAt || a.lastReviewedAt < quarterAgo
    ).length,
    expiredDPAs: await countExpiredDPAs(),
    missingLegalBasis: activities.filter((a) => !a.legalBasis).length,
    overdueReviews: activities.filter(
      (a) => a.lastReviewedAt && isOverdue(a.lastReviewedAt, a.reviewFrequency)
    ).length,
    processingWithoutDPIA: activities.filter(
      (a) => a.dpiaRequired && !a.dpiaReference
    ).length,
  };
}

// Run weekly — alert if any metric is non-zero
// Integrate with your monitoring stack (PagerDuty, Slack, etc.)
```

### Register Completeness Checklist

- [ ] Every data collection point in the application has a corresponding register entry
- [ ] Every third-party integration has a corresponding sub-processor entry
- [ ] Every register entry has a documented legal basis
- [ ] Every register entry has a defined retention period with justification
- [ ] Every register entry with cross-border transfers has a documented transfer mechanism
- [ ] Every register entry flagged for DPIA has a completed or scheduled DPIA
- [ ] All DPAs are signed and current
- [ ] Register was reviewed within the last 90 days
- [ ] Register owner is assigned and active
- [ ] Audit trail captures all register modifications
