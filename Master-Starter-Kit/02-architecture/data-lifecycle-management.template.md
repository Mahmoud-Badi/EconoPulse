# Data Lifecycle Management — {{PROJECT_NAME}}

> How data ages, archives, exports, and gets cleaned up. Prevents unbounded database growth and ensures compliance with data portability requirements (GDPR Article 20).

---

## Data Growth Analysis

Identify which tables grow without bound:

| Table | Growth Rate | Current Size | 1-Year Projection | Action |
|-------|------------|-------------|-------------------|--------|
| `audit_logs` | ~1,000 rows/day | {{SIZE}} | {{PROJECTION}} | Archive after 1 year |
| `notifications` | ~500 rows/day | {{SIZE}} | {{PROJECTION}} | Delete read after 90 days |
| `usage_events` | ~10,000 rows/day | {{SIZE}} | {{PROJECTION}} | Aggregate + archive monthly |
| `session_logs` | ~200 rows/day | {{SIZE}} | {{PROJECTION}} | Purge after 30 days |
| {{TABLE}} | {{RATE}} | {{SIZE}} | {{PROJECTION}} | {{ACTION}} |

**Rule of thumb:** Any table growing > 1,000 rows/day needs an archival or cleanup strategy.

---

## Archival Strategy

### Tier Model

```
HOT (Primary Database)
  │ Active data — queries run here
  │ Retention: Current period + N months
  │
  ├── Time trigger or size trigger
  ▼
WARM (Archive Table / Read Replica)
  │ Queryable but not in active workflows
  │ Retention: 1-5 years
  │
  ├── Compliance period expires
  ▼
COLD (Object Storage / Backup)
  │ Compressed exports, not queryable
  │ Retention: As required by regulation
  │
  ├── Retention period expires
  ▼
DELETED
  Securely removed
```

### Implementation: Table Partitioning

For high-growth tables, use PostgreSQL time-based partitioning:

```sql
-- Create partitioned table
CREATE TABLE audit_logs (
  id          UUID DEFAULT gen_random_uuid(),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id    UUID,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  changes     JSONB,
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions
CREATE TABLE audit_logs_2026_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE audit_logs_2026_02 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Automated partition creation (scheduled job)
-- Run monthly: create next month's partition, archive old partitions
```

### Implementation: Soft Archive

For simpler cases, move old data to an archive table:

```typescript
// Scheduled job: archive old notifications
async function archiveOldNotifications() {
  const cutoff = subDays(new Date(), 90); // 90 days old

  // Move to archive
  await db.execute(sql`
    INSERT INTO notifications_archive
    SELECT * FROM notifications
    WHERE created_at < ${cutoff} AND read = true
  `);

  // Delete from primary
  await db.execute(sql`
    DELETE FROM notifications
    WHERE created_at < ${cutoff} AND read = true
  `);
}
```

---

## Data Export (GDPR Portability)

### User Data Export Endpoint

GDPR Article 20 requires providing user data in a machine-readable format.

```typescript
// POST /api/account/export
async function exportUserData(userId: string): Promise<ExportResult> {
  // Collect all user data across tables
  const userData = {
    profile: await db.query.users.findFirst({ where: eq(users.id, userId) }),
    preferences: await db.query.preferences.findMany({ where: eq(preferences.userId, userId) }),
    content: await db.query.posts.findMany({ where: eq(posts.authorId, userId) }),
    comments: await db.query.comments.findMany({ where: eq(comments.userId, userId) }),
    files: await db.query.files.findMany({ where: eq(files.userId, userId) }),
    // Add every table that contains user data
  };

  // Remove internal-only fields
  const sanitized = sanitizeExport(userData);

  // Generate downloadable archive
  const archive = await createZipArchive({
    'profile.json': JSON.stringify(sanitized.profile, null, 2),
    'content.json': JSON.stringify(sanitized.content, null, 2),
    'comments.json': JSON.stringify(sanitized.comments, null, 2),
    // Include actual files (images, documents)
    ...await collectUserFiles(sanitized.files),
  });

  // Store temporarily for download (24-hour link)
  const downloadUrl = await uploadToTempStorage(archive, '24h');

  // Notify user
  await sendEmail(userId, 'data-export-ready', { downloadUrl });

  return { downloadUrl, expiresIn: '24 hours' };
}
```

### Export Format

```
user-data-export-2026-02-20.zip
├── README.txt              (explains the contents)
├── profile.json            (user profile data)
├── preferences.json        (notification settings, etc.)
├── content/
│   ├── posts.json          (all user posts)
│   └── comments.json       (all user comments)
├── files/
│   ├── avatar.jpg          (uploaded files)
│   └── documents/
│       └── report.pdf
└── metadata.json           (export date, data categories included)
```

---

## Data Import

### Bulk Import Flow

For customer onboarding or data migration:

```
1. Upload CSV/JSON file
2. Validate format and schema
3. Preview: show parsed data with validation errors
4. Map columns: if CSV headers don't match your schema
5. Confirm: user reviews and approves
6. Process: import in background job with progress tracking
7. Report: show success/failure counts
```

### Import Validation

```typescript
async function validateImport(records: unknown[]): Promise<ValidationResult> {
  const errors: ImportError[] = [];
  const valid: ValidRecord[] = [];

  for (const [index, record] of records.entries()) {
    const result = importSchema.safeParse(record);
    if (result.success) {
      valid.push(result.data);
    } else {
      errors.push({
        row: index + 1,
        errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
      });
    }
  }

  return {
    totalRows: records.length,
    validRows: valid.length,
    errorRows: errors.length,
    errors: errors.slice(0, 100), // Show first 100 errors
    valid,
  };
}
```

---

## Staging Data Strategy

### Option A: Anonymized Production Copy (RECOMMENDED for realistic data)

```sql
-- Anonymize user data in staging copy
UPDATE users SET
  email = 'user-' || id || '@staging.test',
  name = 'Test User ' || ROW_NUMBER() OVER(),
  phone = NULL,
  avatar_url = NULL;

-- Anonymize sensitive business data
UPDATE payments SET
  stripe_customer_id = 'cus_test_' || id,
  card_last4 = '4242';

-- Truncate non-essential high-volume tables
TRUNCATE audit_logs, session_logs, notifications;
```

### Option B: Synthetic Seed Data (for clean environments)

Use Faker to generate realistic test data:

```typescript
import { faker } from '@faker-js/faker';

async function seedStagingData() {
  // Create users
  const users = Array.from({ length: 50 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'user', 'viewer']),
  }));

  await db.insert(usersTable).values(users);

  // Create realistic content
  for (const user of users) {
    const projectCount = faker.number.int({ min: 1, max: 10 });
    // ... generate projects, tasks, etc.
  }
}
```

---

## Cleanup Jobs

### Scheduled Cleanup Tasks

| Task | Schedule | Action |
|------|----------|--------|
| Expired sessions | Daily | Delete sessions older than 7 days |
| Unverified accounts | Weekly | Delete accounts not verified after 30 days |
| Read notifications | Weekly | Archive read notifications older than 90 days |
| Orphaned files | Weekly | Delete files not referenced by any entity |
| Failed job records | Monthly | Purge failed job records older than 30 days |
| Temporary uploads | Daily | Delete temp files older than 24 hours |

```typescript
// Example: Orphaned file cleanup
async function cleanupOrphanedFiles() {
  const orphans = await db.execute(sql`
    SELECT f.id, f.storage_key
    FROM files f
    LEFT JOIN products p ON p.image_id = f.id
    LEFT JOIN users u ON u.avatar_id = f.id
    -- Add all tables that reference files
    WHERE p.id IS NULL AND u.id IS NULL
    AND f.created_at < NOW() - INTERVAL '7 days'
  `);

  for (const file of orphans) {
    await s3.deleteObject({ Bucket: BUCKET, Key: file.storage_key });
    await db.delete(files).where(eq(files.id, file.id));
  }

  return { deleted: orphans.length };
}
```

---

## Checklist

- [ ] High-growth tables identified with growth projections
- [ ] Archival strategy defined per table (partition / archive table / purge)
- [ ] Data export endpoint built (GDPR portability)
- [ ] Cleanup jobs scheduled for each data category
- [ ] Staging data strategy chosen (anonymized copy or synthetic)
- [ ] Import flow built (if customer onboarding requires data migration)
- [ ] Retention periods documented and match privacy policy
- [ ] Orphaned file cleanup job running
