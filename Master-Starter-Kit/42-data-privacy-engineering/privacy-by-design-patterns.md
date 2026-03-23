# Privacy-by-Design Engineering Patterns

> Reference guide for implementing privacy-preserving patterns in application code. No placeholders — this is a pattern library for engineers building privacy-compliant systems.

---

## Overview

Privacy by design means building privacy into the architecture from the start, not retrofitting it after launch. These patterns are not theoretical — they are implementation recipes that you can apply directly to your codebase. Each pattern includes the privacy principle it enforces, when to use it, and a code example.

**How to use this file:** Consult it whenever implementing a feature that touches personal data. The patterns are organized by the GDPR privacy principle they enforce.

---

## Data Minimization Patterns

**Principle:** Collect only the personal data that is strictly necessary for the stated purpose. Every additional field you collect increases breach impact, storage cost, and compliance burden.

### Pattern 1: Selective Field Projection

Never return full database rows to the API layer. Project only the fields the consumer needs.

```typescript
// src/privacy/patterns/selective-projection.ts

// BAD: Returns entire user row including fields the frontend doesn't need
async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
  // Returns: id, email, passwordHash, phone, mfaSecret, internalNotes, ...
}

// GOOD: Return only what the consumer needs
async function getUserProfile(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
      // passwordHash, mfaSecret, internalNotes are NEVER projected
    },
  });
}

// BETTER: Purpose-specific projections
const USER_PROJECTIONS = {
  profile: { id: true, displayName: true, avatarUrl: true, bio: true },
  billing: { id: true, email: true, billingAddress: true },
  support: { id: true, displayName: true, email: true, plan: true },
  analytics: { id: true, createdAt: true, plan: true }, // No PII
} as const;

async function getUserFor(id: string, purpose: keyof typeof USER_PROJECTIONS) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: USER_PROJECTIONS[purpose],
  });
}
```

### Pattern 2: Collection-Point Validation

Reject unnecessary fields at the API boundary. If a registration form only needs email and password, reject requests that include phone, birthday, or address.

```typescript
// src/privacy/patterns/collection-validation.ts

import { z } from 'zod';

// Schema enforces data minimization at the collection point
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  displayName: z.string().min(1).max(100),
}).strict(); // .strict() rejects any additional fields

// Requests with phone, birthday, address, etc. are rejected with 400
// This prevents accidental over-collection even if the frontend sends extra fields

router.post('/api/v1/auth/register', async (req, res) => {
  const parsed = registrationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request',
      details: parsed.error.issues,
    });
  }
  // Only email, password, displayName reach the handler
  await createUser(parsed.data);
});
```

### Pattern 3: Analytics Data Stripping

Strip PII from analytics events before they enter the analytics pipeline.

```typescript
// src/privacy/patterns/analytics-stripping.ts

interface RawEvent {
  userId: string;
  email: string; // PII — should not enter analytics
  name: string;  // PII — should not enter analytics
  eventType: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

interface AnalyticsEvent {
  anonymousId: string; // Pseudonymized ID
  eventType: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

function stripPII(event: RawEvent): AnalyticsEvent {
  // Hash the user ID — analytics can still group by user without knowing who they are
  const anonymousId = createHash('sha256')
    .update(event.userId + ANALYTICS_SALT)
    .digest('hex');

  // Strip known PII fields from properties
  const PII_FIELDS = ['email', 'name', 'phone', 'address', 'ip', 'userAgent'];
  const cleanProperties = Object.fromEntries(
    Object.entries(event.properties).filter(
      ([key]) => !PII_FIELDS.includes(key)
    )
  );

  return {
    anonymousId,
    eventType: event.eventType,
    properties: cleanProperties,
    timestamp: event.timestamp,
  };
}
```

---

## Pseudonymization Techniques

**Principle:** Replace directly identifying information with pseudonyms so data can be used for secondary purposes (analytics, testing, development) without exposing real identities.

### Pattern 4: Deterministic Pseudonymization

Replace identifiers with consistent pseudonyms so relationships between records are preserved without revealing identity.

```typescript
// src/privacy/patterns/pseudonymization.ts

import { createHmac } from 'crypto';

class Pseudonymizer {
  private secret: string;

  constructor(secret: string) {
    // Secret stored in key management system, NOT in code
    this.secret = secret;
  }

  pseudonymize(value: string, domain: string): string {
    // HMAC ensures consistent pseudonym for same input
    // Domain separation prevents cross-dataset correlation
    return createHmac('sha256', this.secret)
      .update(`${domain}:${value}`)
      .digest('hex')
      .substring(0, 16);
  }

  pseudonymizeRecord(record: Record<string, unknown>, piiFields: string[]): Record<string, unknown> {
    const result = { ...record };
    for (const field of piiFields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = this.pseudonymize(result[field] as string, field);
      }
    }
    return result;
  }
}

// Usage: pseudonymize before sending to analytics warehouse
const pseudonymizer = new Pseudonymizer(process.env.PSEUDONYM_SECRET!);

const warehouseRecord = pseudonymizer.pseudonymizeRecord(
  userRecord,
  ['email', 'name', 'phone', 'ip_address']
);
```

### Pattern 5: Synthetic Data for Development

Never use production data in development or staging environments. Generate synthetic data that has the same statistical properties.

```typescript
// src/privacy/patterns/synthetic-data.ts

import { faker } from '@faker-js/faker';

function generateSyntheticUser(seed?: number): SyntheticUser {
  if (seed) faker.seed(seed); // Reproducible for testing

  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
    },
    createdAt: faker.date.past({ years: 2 }),
    plan: faker.helpers.arrayElement(['free', 'pro', 'enterprise']),
    // Preserve statistical distribution of real data
    loginCount: faker.number.int({ min: 1, max: 500 }),
    lastActive: faker.date.recent({ days: 30 }),
  };
}

// Generate a development dataset
function seedDevelopmentDatabase(count: number = 1000): SyntheticUser[] {
  return Array.from({ length: count }, (_, i) => generateSyntheticUser(i));
}
```

---

## Encryption at Rest & Transit

**Principle:** Protect personal data from unauthorized access through encryption, making data unreadable to anyone without the decryption key.

### Pattern 6: Field-Level Encryption

Encrypt sensitive fields individually so a database compromise does not expose all PII. Only decrypt when the specific field is needed by an authorized service.

```typescript
// src/privacy/patterns/field-encryption.ts

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

class FieldEncryptor {
  private keyId: string;
  private key: Buffer;

  constructor(keyId: string, key: Buffer) {
    this.keyId = keyId;
    this.key = key; // 256-bit key from KMS
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Format: keyId:iv:authTag:ciphertext (all base64)
    return [
      this.keyId,
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  decrypt(encryptedValue: string): string {
    const [keyId, ivB64, authTagB64, ciphertextB64] = encryptedValue.split(':');
    if (keyId !== this.keyId) {
      throw new Error(`Key rotation: encrypted with ${keyId}, current key is ${this.keyId}`);
    }

    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const ciphertext = Buffer.from(ciphertextB64, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString('utf8');
  }
}

// Usage in a repository layer
class UserRepository {
  private encryptor: FieldEncryptor;

  async createUser(data: CreateUserInput): Promise<User> {
    return db.insert(users).values({
      ...data,
      email: this.encryptor.encrypt(data.email),
      phone: data.phone ? this.encryptor.encrypt(data.phone) : null,
      // displayName is NOT encrypted — it is not sensitive
    });
  }

  async getUserEmail(userId: string): Promise<string> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true },
    });
    return this.encryptor.decrypt(user!.email);
  }
}
```

---

## Purpose Limitation Enforcement

**Principle:** Data collected for one purpose must not be used for a different purpose without additional consent.

### Pattern 7: Purpose-Tagged Data Access

Enforce purpose limitation at the data access layer by requiring a purpose declaration for every query.

```typescript
// src/privacy/patterns/purpose-limitation.ts

type DataPurpose =
  | 'service_delivery'
  | 'billing'
  | 'support'
  | 'analytics'
  | 'marketing'
  | 'security_monitoring';

interface PurposePolicy {
  allowedFields: string[];
  requiresConsent: boolean;
  consentCategory?: string;
  auditRequired: boolean;
}

const PURPOSE_POLICIES: Record<DataPurpose, PurposePolicy> = {
  service_delivery: {
    allowedFields: ['id', 'email', 'displayName', 'preferences', 'plan'],
    requiresConsent: false, // Contract basis
    auditRequired: false,
  },
  billing: {
    allowedFields: ['id', 'email', 'billingAddress', 'plan', 'paymentMethodLast4'],
    requiresConsent: false, // Contract basis
    auditRequired: true,
  },
  support: {
    allowedFields: ['id', 'email', 'displayName', 'plan', 'createdAt'],
    requiresConsent: false, // Contract basis
    auditRequired: true,
  },
  analytics: {
    allowedFields: ['id', 'createdAt', 'plan', 'lastActive', 'loginCount'],
    requiresConsent: true,
    consentCategory: 'analytics',
    auditRequired: false,
  },
  marketing: {
    allowedFields: ['id', 'email', 'displayName'],
    requiresConsent: true,
    consentCategory: 'marketing_emails',
    auditRequired: true,
  },
  security_monitoring: {
    allowedFields: ['id', 'email', 'lastLogin', 'ipAddress', 'userAgent'],
    requiresConsent: false, // Legitimate interest
    auditRequired: true,
  },
};

async function queryUserData(
  userId: string,
  purpose: DataPurpose,
  requesterId: string
): Promise<Record<string, unknown>> {
  const policy = PURPOSE_POLICIES[purpose];

  // Check consent if required
  if (policy.requiresConsent) {
    const consent = await consentService.checkConsent(userId, policy.consentCategory!);
    if (!consent.allowed) {
      throw new PrivacyError(`No consent for purpose: ${purpose}`);
    }
  }

  // Query only allowed fields
  const data = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: Object.fromEntries(policy.allowedFields.map((f) => [f, true])),
  });

  // Audit log if required
  if (policy.auditRequired) {
    await auditLog.record({
      action: 'data_access',
      userId,
      requesterId,
      purpose,
      fieldsAccessed: policy.allowedFields,
      timestamp: new Date(),
    });
  }

  return data;
}
```

---

## Storage Limitation Patterns

**Principle:** Do not store personal data longer than necessary for the purpose it was collected.

### Pattern 8: TTL-Based Automatic Expiry

Use database-level or cache-level TTL to enforce retention limits automatically.

```typescript
// src/privacy/patterns/ttl-expiry.ts

// Redis: session data with automatic expiry
async function createSession(userId: string, data: SessionData): Promise<string> {
  const sessionId = generateSessionId();
  await redis.setex(
    `session:${sessionId}`,
    24 * 60 * 60, // 24 hours TTL — auto-deleted
    JSON.stringify({ userId, ...data })
  );
  return sessionId;
}

// PostgreSQL: partitioned tables with time-based drops
// Partition analytics events by month — drop entire partitions for retention
/*
  CREATE TABLE analytics_events (
    id UUID DEFAULT gen_random_uuid(),
    event_type VARCHAR(100),
    user_hash VARCHAR(64),
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  ) PARTITION BY RANGE (created_at);

  -- Monthly partitions — drop old ones for instant retention enforcement
  CREATE TABLE analytics_events_2024_01
    PARTITION OF analytics_events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

  -- Drop partition = instant deletion of all data in that month
  -- ALTER TABLE analytics_events DETACH PARTITION analytics_events_2024_01;
  -- DROP TABLE analytics_events_2024_01;
*/
```

---

## Access Control by Purpose

**Principle:** Access to personal data should be limited to the minimum necessary for the accessor's purpose.

### Pattern 9: Attribute-Based Access Control (ABAC)

Go beyond role-based access by considering the purpose, data sensitivity, and context of the access request.

```typescript
// src/privacy/patterns/abac.ts

interface AccessRequest {
  requesterId: string;
  requesterRole: string;
  requesterDepartment: string;
  targetUserId: string;
  dataFields: string[];
  purpose: DataPurpose;
  accessContext: 'production' | 'debugging' | 'support_ticket' | 'audit';
}

interface AccessDecision {
  allowed: boolean;
  allowedFields: string[];
  deniedFields: string[];
  conditions: string[];
  reason: string;
}

function evaluateAccess(request: AccessRequest): AccessDecision {
  const deniedFields: string[] = [];
  const conditions: string[] = [];

  // Rule 1: Support agents cannot access payment data
  if (request.requesterRole === 'support_agent') {
    const paymentFields = request.dataFields.filter((f) =>
      ['paymentMethod', 'billingAddress', 'ssn', 'bankAccount'].includes(f)
    );
    deniedFields.push(...paymentFields);
  }

  // Rule 2: Debugging access requires justification and is logged
  if (request.accessContext === 'debugging') {
    conditions.push('Access logged with ticket reference');
    conditions.push('Auto-expires in 4 hours');
  }

  // Rule 3: No one accesses another user's data without a support ticket
  if (request.accessContext !== 'support_ticket' && request.accessContext !== 'audit') {
    if (request.requesterId !== request.targetUserId) {
      return {
        allowed: false,
        allowedFields: [],
        deniedFields: request.dataFields,
        conditions: [],
        reason: 'Cross-user access requires active support ticket or audit context',
      };
    }
  }

  const allowedFields = request.dataFields.filter((f) => !deniedFields.includes(f));

  return {
    allowed: allowedFields.length > 0,
    allowedFields,
    deniedFields,
    conditions,
    reason: deniedFields.length > 0
      ? `${deniedFields.length} fields denied based on role and purpose`
      : 'Access granted',
  };
}
```

---

## Privacy-Preserving Analytics

**Principle:** Derive insights from data without exposing individual user information.

### Pattern 10: K-Anonymity for Exports

Ensure that any data export or report cannot identify individuals by requiring that each combination of quasi-identifiers appears at least k times.

```typescript
// src/privacy/patterns/k-anonymity.ts

interface AggregatedRow {
  segment: string;
  count: number;
  avgValue: number;
}

function enforceKAnonymity(
  data: AggregatedRow[],
  k: number = 5
): AggregatedRow[] {
  // Remove any row where the count is less than k
  // These rows could potentially identify individuals
  return data.filter((row) => {
    if (row.count < k) {
      console.warn(
        `K-anonymity violation: segment "${row.segment}" has only ${row.count} records (k=${k}). Suppressed.`
      );
      return false;
    }
    return true;
  });
}

// Usage: before any data export or dashboard query
const reportData = await generateSegmentReport();
const safeData = enforceKAnonymity(reportData, 5);
// Any segment with < 5 users is suppressed from the report
```

### Pattern 11: Differential Privacy for Aggregate Queries

Add calibrated noise to aggregate queries so that the presence or absence of any individual cannot be determined from the output.

```typescript
// src/privacy/patterns/differential-privacy.ts

function addLaplaceNoise(trueValue: number, sensitivity: number, epsilon: number): number {
  // Laplace mechanism: noise scale = sensitivity / epsilon
  // Lower epsilon = more privacy, more noise
  // Higher epsilon = less privacy, less noise
  const scale = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  const noise = -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  return Math.round(trueValue + noise);
}

// Usage: noisy count of users in a segment
const trueCount = await db.select({ count: count() })
  .from(users)
  .where(eq(users.plan, 'enterprise'));

const noisyCount = addLaplaceNoise(
  trueCount[0].count,
  1,    // sensitivity: adding/removing one person changes count by 1
  0.1   // epsilon: privacy budget (lower = more private)
);

// Report noisyCount instead of trueCount
// Individual user's membership in the segment cannot be inferred
```

### Pattern 12: IP Address Truncation

Reduce IP address precision to prevent individual identification while preserving geographic analytics.

```typescript
// src/privacy/patterns/ip-truncation.ts

function truncateIP(ip: string): string {
  if (ip.includes(':')) {
    // IPv6: keep first 3 segments (48 bits)
    const segments = ip.split(':');
    return segments.slice(0, 3).join(':') + '::';
  } else {
    // IPv4: zero the last octet
    const octets = ip.split('.');
    octets[3] = '0';
    return octets.join('.');
  }
}

// 192.168.1.42 → 192.168.1.0 (preserves ISP/region, hides individual)
// 2001:0db8:85a3:0000:0000:8a2e:0370:7334 → 2001:0db8:85a3::

// Apply in analytics middleware before events reach the pipeline
function sanitizeAnalyticsEvent(event: RawEvent): SanitizedEvent {
  return {
    ...event,
    ipAddress: truncateIP(event.ipAddress),
    userAgent: generalizeUserAgent(event.userAgent), // Optional: reduce fingerprint surface
  };
}
```

---

## Reference Checklist

When implementing any feature that touches personal data, verify against this checklist:

- [ ] **Minimization:** Am I collecting only the data I need for this specific purpose?
- [ ] **Projection:** Am I returning only the fields the consumer needs from the database?
- [ ] **Pseudonymization:** Is PII pseudonymized before entering analytics or development environments?
- [ ] **Encryption:** Are sensitive fields encrypted at rest and in transit?
- [ ] **Purpose limitation:** Is data access gated by declared purpose?
- [ ] **Storage limitation:** Is there a defined retention period and automated deletion?
- [ ] **Access control:** Is access limited to the minimum necessary for the role and purpose?
- [ ] **Analytics privacy:** Are aggregate queries protected against individual inference?
- [ ] **Synthetic data:** Is development using synthetic data instead of production PII?
- [ ] **Audit trail:** Are accesses to sensitive data logged with purpose and requester?
