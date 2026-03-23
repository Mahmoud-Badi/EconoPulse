# Data Sensitivity & Compliance Classification

> Classify every type of data your app handles by sensitivity level.
> This document determines: encryption requirements, audit logging, retention policies, access controls, and regulatory compliance.
> Get this wrong and you risk data breaches, regulatory fines, and user trust destruction.

---

## Compliance Decision Tree

Answer these questions to determine which regulations apply to your project:

```
Does your app store or process health-related data?
  ├── YES → HIPAA applies
  │         (Protected Health Information: diagnoses, medications,
  │          treatment records, insurance info, medical appointments)
  │         Requirements: encryption at rest + in transit, audit logs,
  │         BAA with hosting provider, access controls, breach notification
  │
  └── NO → Continue ↓

Does your app process credit card numbers directly?
  ├── YES → PCI DSS applies
  │         (You handle raw card numbers, CVVs, etc.)
  │         Requirements: PCI-compliant infrastructure, tokenization,
  │         quarterly vulnerability scans, annual compliance audit
  │         RECOMMENDATION: Use Stripe/PayPal to avoid PCI scope entirely.
  │         If you never see raw card numbers, PCI is Stripe's problem.
  │
  └── NO (using Stripe/PayPal) → PCI does NOT apply to you. Continue ↓

Does your app have users in the European Union?
  ├── YES → GDPR applies
  │         Requirements: consent management, data export (right of portability),
  │         data deletion (right to be forgotten), privacy policy,
  │         DPA with data processors, breach notification within 72 hours
  │
  └── NO → Continue ↓

Does your app have users in California?
  ├── YES → CCPA may apply (if >50K users or >$25M revenue)
  │         Requirements: privacy policy, opt-out of data sale,
  │         data deletion upon request
  │
  └── NO → Continue ↓

Does your app sell to enterprise customers?
  ├── YES → SOC 2 Type II may be required
  │         Requirements: security controls, access management,
  │         change management, incident response, annual audit
  │
  └── NO → Standard security best practices are sufficient
```

**Your compliance profile:** {{LIST_APPLICABLE_REGULATIONS}}

---

## Sensitivity Levels

| Level | Label | Definition | Access Controls | Encryption | Audit Log | Retention |
|-------|-------|-----------|----------------|------------|-----------|-----------|
| **1** | Public | Available to anyone, including unauthenticated users | None | None required | Not required | Indefinite |
| **2** | Internal | Available to all authenticated users of the app | Auth required | In transit (TLS) | Optional | Indefinite |
| **3** | Confidential | Available only to specific roles | Role-based access | In transit + at rest | Required | Per policy |
| **4** | PII | Personally Identifiable Information — can identify a specific person | Strict role-based + purpose limitation | In transit + at rest | Required | Minimum necessary |
| **5** | PHI | Protected Health Information — HIPAA regulated | Need-to-know + audit trail | In transit + at rest + field-level | Required (immutable) | Per HIPAA (6 years minimum) |
| **6** | Financial | Payment and financial data — PCI regulated | Strict role-based + tokenization | In transit + at rest + tokenized | Required (immutable) | Per PCI (1 year minimum) |

---

## Data Classification Matrix

### Pre-filled Common Data Types

| # | Data Type | Examples | Sensitivity | Encryption | Audit Log | Retention | GDPR | HIPAA | PCI |
|---|-----------|----------|-------------|------------|-----------|-----------|------|-------|-----|
| 1 | User profile | Name, email, phone, profile photo | **4 - PII** | At rest + transit | Yes | Until account deletion + 30 days | Yes (right to deletion) | N/A unless healthcare | N/A |
| 2 | Passwords | Hashed passwords in accounts table | **6 - Financial** (treat as highest) | Bcrypt/scrypt hash (never plaintext) | Yes (changes only) | Until account deletion | Yes | Yes if applicable | N/A |
| 3 | Session tokens | JWT, session IDs, refresh tokens | **3 - Confidential** | In transit (TLS) | Yes (creation + revocation) | Short-lived (15min-7 days) | N/A | N/A | N/A |
| 4 | Payment card data | Card number, CVV, expiry | **6 - Financial** | Tokenize via Stripe (never store raw) | Yes (immutable) | Never store raw — Stripe stores it | N/A | N/A | **YES** |
| 5 | Bank account info | Account numbers, routing numbers | **6 - Financial** | At rest + transit, masked display | Yes (immutable) | Per regulation (varies) | Yes | N/A | Related |
| 6 | Medical records | Diagnoses, medications, treatment plans | **5 - PHI** | At rest + transit + field-level | Yes (immutable, all access) | 6 years minimum (HIPAA) | Yes | **YES** | N/A |
| 7 | Insurance info | Insurance ID, plan details, copay amounts | **5 - PHI** | At rest + transit | Yes (immutable) | 6 years minimum (HIPAA) | Yes | **YES** | N/A |
| 8 | Addresses | Street address, city, zip, geolocation | **4 - PII** | At rest + transit | Yes (changes) | Until account deletion | Yes (right to deletion) | Yes if patient address | N/A |
| 9 | IP addresses | Login IPs, request IPs | **4 - PII** (under GDPR) | At rest + transit | Yes (login events) | 90 days (security), then anonymize | Yes (considered PII) | N/A | N/A |
| 10 | Audit logs | Who did what, when, from where | **3 - Confidential** | At rest + transit | N/A (they ARE the audit log) | 1 year minimum, 6 years if HIPAA | N/A | Yes (immutable) | Yes (1 year) |
| 11 | System logs | Error logs, performance metrics | **2 - Internal** | In transit | Not required | 30-90 days | N/A | N/A | N/A |
| 12 | App settings | Feature flags, config values | **2 - Internal** | In transit | Yes (changes) | Indefinite | N/A | N/A | N/A |
| 13 | Public content | Marketing pages, help docs, pricing | **1 - Public** | In transit (TLS) | Not required | Indefinite | N/A | N/A | N/A |
| 14 | API keys | Third-party service credentials | **6 - Financial** (treat as highest) | Env vars only (never in DB or code) | Yes (rotation events) | Until rotated | N/A | N/A | N/A |
| 15 | File uploads | Documents, images, CSVs | **Varies** (see notes) | At rest + transit | Yes (upload + access) | Per content type | Depends | Depends | N/A |

### Project-Specific Data Types

| # | Data Type | Examples | Sensitivity | Encryption | Audit Log | Retention | GDPR | HIPAA | PCI |
|---|-----------|----------|-------------|------------|-----------|-----------|------|-------|-----|
| 16 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 17 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 18 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 19 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 20 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 21 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 22 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 23 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 24 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |
| 25 | {{DATA_TYPE}} | {{EXAMPLES}} | {{LEVEL}} | {{REQUIREMENTS}} | {Y/N} | {{POLICY}} | {Y/N} | {Y/N} | {Y/N} |

*(Add rows for every data type your app handles)*

---

## Encryption Strategy

### In Transit
- **All traffic:** TLS 1.2+ enforced (Vercel/Cloudflare handles this automatically)
- **API calls:** HTTPS only, HTTP redirects to HTTPS
- **WebSocket/SSE:** WSS (encrypted WebSocket) / HTTPS for SSE
- **Internal service-to-service:** TLS even within the same VPC

### At Rest
- **Database:** {Supabase provides encryption at rest by default | RDS encryption | Manual setup}
- **File storage:** {Vercel Blob encrypted by default | S3 server-side encryption | Manual}
- **Backups:** Encrypted at rest (same level as primary data)

### Field-Level Encryption (for PHI/Financial)
Only needed if your compliance requirements demand it:
- SSN, medical record numbers, financial account numbers
- Use AES-256-GCM encryption with per-record keys
- Key management via environment variables or KMS (AWS KMS, Google Cloud KMS)

```typescript
// Example: field-level encryption for PHI
import { encrypt, decrypt } from '@/lib/crypto';

// Storing
const encryptedSSN = encrypt(patient.ssn, env.ENCRYPTION_KEY);
await db.insert(patients).values({ ssn: encryptedSSN });

// Reading
const patient = await db.query.patients.findFirst({ where: ... });
const decryptedSSN = decrypt(patient.ssn, env.ENCRYPTION_KEY);
```

---

## Audit Log Requirements

### What to Log

| Event Category | Events | Required By |
|----------------|--------|-------------|
| Authentication | Login, logout, failed login, password change, MFA events | All (security baseline) |
| Authorization | Permission denied, role change, access escalation | All (security baseline) |
| Data access | PHI/PII viewed, exported, or printed | HIPAA, GDPR |
| Data modification | Create, update, delete of sensitive records | HIPAA, PCI, SOC2 |
| Admin actions | User creation, role assignment, setting changes | All (security baseline) |
| System events | Deployment, config change, integration key rotation | SOC2 |

### Audit Log Schema

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id    UUID REFERENCES users(id),
  actor_email TEXT NOT NULL,
  actor_role  TEXT NOT NULL,
  action      TEXT NOT NULL,           -- 'create', 'read', 'update', 'delete', 'login', etc.
  entity_type TEXT NOT NULL,           -- 'trip', 'patient', 'invoice', etc.
  entity_id   UUID,
  changes     JSONB,                   -- { field: { old: x, new: y } }
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB                    -- Additional context
);

-- IMPORTANT: Audit logs are APPEND-ONLY. Never update or delete.
-- No UPDATE or DELETE permissions on this table for any role.
```

### Audit Log Rules
1. **Immutable** — Audit logs are append-only. No updates, no deletes, ever.
2. **Tamper-evident** — Consider hashing each entry with the previous entry's hash (blockchain-lite)
3. **Complete** — Every access to PHI/PII must be logged, even read-only views
4. **Retained** — HIPAA: 6 years. PCI: 1 year. SOC2: 1 year. Default: 1 year.
5. **Queryable** — Must be able to answer "who accessed patient X's records in the last 90 days?"

---

## Data Retention & Deletion

### Retention Policies

| Data Type | Active Retention | Archive Retention | Deletion Method | Legal Hold |
|-----------|-----------------|-------------------|-----------------|------------|
| User accounts | While active | 30 days after deletion request | Soft delete, then hard delete | Preserve if litigation hold |
| Transaction records | Indefinite | 7 years (tax/legal) | Never delete | Always preserved |
| Audit logs | 1 year online | 5 years archived | Never delete | Always preserved |
| Session data | Until expiry | 90 days | Auto-purge | N/A |
| System logs | 90 days | None | Auto-purge | Preserve if incident |
| File uploads | While active | 30 days after deletion | Soft delete, then purge from storage | Preserve if litigation hold |
| PHI records | While active | 6 years (HIPAA) | Certified destruction | Always preserved during hold |

### GDPR Right to Deletion ("Right to Be Forgotten")

When a user requests data deletion:

1. **Identify** all data associated with the user across all tables
2. **Classify** each data point: can it be deleted, or must it be retained (legal, tax, audit)?
3. **Delete** deletable data (PII, profile info, preferences, uploaded files)
4. **Anonymize** data that must be retained (replace name with "Deleted User", email with hash)
5. **Preserve** audit logs (required for compliance — but anonymize the actor name)
6. **Confirm** deletion to the user within 30 days
7. **Document** what was deleted, what was anonymized, and what was retained (with legal basis)

```typescript
// Example: GDPR deletion handler
async function handleDeletionRequest(userId: string) {
  // 1. Soft-delete user profile
  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, userId));

  // 2. Anonymize user in audit logs
  await db.update(auditLogs)
    .set({ actorEmail: 'deleted@anonymized.com', actorName: 'Deleted User' })
    .where(eq(auditLogs.actorId, userId));

  // 3. Delete uploaded files
  await storage.deleteUserFiles(userId);

  // 4. Revoke all sessions
  await auth.revokeAllSessions(userId);

  // 5. Log the deletion itself (meta-audit)
  await auditLog('user.deletion_completed', { userId, method: 'gdpr_request' });

  // 6. Schedule hard delete in 30 days (grace period for undo)
  await queue.schedule('hard-delete-user', { userId }, { delay: '30d' });
}
```

---

## Access Control by Sensitivity Level

| Sensitivity Level | Who Can Access | How Access Is Granted | Monitoring |
|-------------------|---------------|----------------------|------------|
| 1 - Public | Anyone | No auth required | Basic analytics |
| 2 - Internal | Any authenticated user | Login | Session tracking |
| 3 - Confidential | Users with appropriate role | RBAC (role-based access) | Audit log on write |
| 4 - PII | Users with explicit need + appropriate role | RBAC + purpose justification | Audit log on all access |
| 5 - PHI | Users with explicit need + appropriate role + BAA | RBAC + need-to-know + audit | Full audit trail (all access logged) |
| 6 - Financial | System only (no direct human access to raw data) | Tokenization + API-only access | Full audit trail + anomaly detection |

---

## Data Flow Diagram

Map where sensitive data flows through your system:

```
User Browser
    │
    │ [TLS 1.2+]
    ▼
┌──────────────┐
│  Next.js App │──── [TLS] ────► Third-party APIs (Stripe, Twilio, etc.)
│  (Vercel)    │                  (Data leaves your system — ensure DPA/BAA)
└──────┬───────┘
       │
       │ [TLS + connection pooler]
       ▼
┌──────────────┐
│  PostgreSQL  │──── [encrypted backup] ────► Backup storage
│  (Supabase)  │
│  [AES-256    │
│   at rest]   │
└──────────────┘
```

**Data boundary checkpoints:**
- [ ] All data in transit is encrypted (TLS)
- [ ] All data at rest is encrypted (database + file storage)
- [ ] PHI/Financial data has field-level encryption where required
- [ ] Third-party services that receive PII/PHI have DPAs (GDPR) or BAAs (HIPAA)
- [ ] No sensitive data in URL parameters (use POST body or headers)
- [ ] No sensitive data in client-side logs or error messages
- [ ] No sensitive data in git repositories (use environment variables)

---

## Breach Response Plan

If a data breach is detected:

| Step | Action | Timeframe | Responsible |
|------|--------|-----------|-------------|
| 1 | Contain the breach (revoke access, rotate keys) | Immediately | Engineering lead |
| 2 | Assess scope (what data, how many users affected) | Within 4 hours | Engineering + Security |
| 3 | Notify regulators (GDPR: 72 hours, HIPAA: 60 days) | Per regulation | Legal + Compliance |
| 4 | Notify affected users | Per regulation | Legal + Communications |
| 5 | Remediate (fix vulnerability, update controls) | Within 1 week | Engineering |
| 6 | Post-mortem (document root cause and prevention) | Within 2 weeks | Full team |

---

## Classification Checklist

Before marking data classification as complete, verify:

- [ ] Every data type in the app is listed and classified
- [ ] Sensitivity levels are assigned based on regulatory requirements, not convenience
- [ ] Encryption requirements are specific (not just "encrypted")
- [ ] Audit log requirements specify which events to log for each data type
- [ ] Retention policies have specific timeframes (not "as needed")
- [ ] GDPR deletion procedure is documented if applicable
- [ ] HIPAA requirements are mapped to specific technical controls if applicable
- [ ] PCI scope is minimized (use Stripe/PayPal to avoid handling raw card data)
- [ ] Data flow diagram shows all sensitive data paths
- [ ] Third-party data processors have appropriate agreements (DPA/BAA)
- [ ] Breach response plan exists and has specific timeframes
- [ ] No sensitive data types are classified below their required level
