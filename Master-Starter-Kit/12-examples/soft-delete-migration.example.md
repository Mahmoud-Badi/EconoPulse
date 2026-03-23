# Soft Delete Migration — TaskFlow (Example)

> **READ ONLY — reference example.** This shows how to implement soft delete across a NestJS + Prisma application, including migration, query filtering, restore endpoints, and GDPR hard delete.

---

## Why Soft Delete

| Reason | Explanation |
|---|---|
| **Audit trail** | Regulatory and internal audits require knowing what was deleted, when, and by whom. Hard delete destroys this evidence. |
| **Undo / recovery** | Users accidentally delete records. Soft delete allows "undelete" without restoring from backups. |
| **Referential integrity** | A deleted carrier still needs to appear on historical loads. Hard delete breaks foreign key references or requires cascading deletes that destroy history. |
| **Compliance** | SOX, FMCSA, and DOT regulations require retention of transportation records for 3-7 years. You cannot hard delete during the retention period. |
| **Analytics** | Deleted records are still valuable for reporting (e.g., "churn rate" requires knowing how many carriers were removed). |

---

## Database Migration

### Step 1: Add `deletedAt` Column

```sql
-- migrations/20250310_add_soft_delete.sql

-- WHY nullable timestamp instead of boolean:
-- 1. Timestamp tells you WHEN it was deleted (boolean doesn't)
-- 2. NULL = active, non-NULL = deleted (efficient indexing)
-- 3. Enables "deleted within last 30 days" queries for the recycle bin UI

ALTER TABLE "Order" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Invoice" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Carrier" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Load" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Driver" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Contact" ADD COLUMN "deletedAt" TIMESTAMP;
ALTER TABLE "Document" ADD COLUMN "deletedAt" TIMESTAMP;

-- Optional: track WHO deleted (for audit)
ALTER TABLE "Order" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Carrier" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Load" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Driver" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Contact" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Document" ADD COLUMN "deletedBy" TEXT;
```

### Step 2: Partial Indexes

```sql
-- WHY partial indexes:
-- Most queries only care about active (non-deleted) records. A partial index
-- on "WHERE deletedAt IS NULL" is smaller and faster than a full index.
-- PostgreSQL can use this index for all queries that include the deletedAt IS NULL filter.

CREATE INDEX "Order_active_idx" ON "Order" ("workspaceId", "status")
  WHERE "deletedAt" IS NULL;

CREATE INDEX "Invoice_active_idx" ON "Invoice" ("workspaceId", "status")
  WHERE "deletedAt" IS NULL;

CREATE INDEX "Carrier_active_idx" ON "Carrier" ("workspaceId", "name")
  WHERE "deletedAt" IS NULL;

CREATE INDEX "Load_active_idx" ON "Load" ("workspaceId", "status")
  WHERE "deletedAt" IS NULL;

CREATE INDEX "Driver_active_idx" ON "Driver" ("workspaceId", "status")
  WHERE "deletedAt" IS NULL;

-- Index for "recycle bin" queries (recently deleted, for undo UI)
CREATE INDEX "Order_deleted_idx" ON "Order" ("workspaceId", "deletedAt")
  WHERE "deletedAt" IS NOT NULL;
```

---

## Prisma Schema Changes

```prisma
// prisma/schema.prisma (partial — showing pattern for one model)

model Order {
  id          String    @id @default(cuid())
  workspaceId String
  status      String
  // ... other fields ...

  // Soft delete fields
  deletedAt   DateTime?
  deletedBy   String?

  // Indexes
  @@index([workspaceId, status])

  // Relations
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  deletedByUser User?   @relation("OrderDeletedBy", fields: [deletedBy], references: [id])
}

model Carrier {
  id          String    @id @default(cuid())
  workspaceId String
  name        String
  mcNumber    String

  deletedAt   DateTime?
  deletedBy   String?

  @@index([workspaceId, name])
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
}
```

---

## Prisma Middleware for Auto-Filtering

### Option A: Prisma Middleware (Prisma 4.x)

```typescript
// src/lib/prisma-soft-delete.middleware.ts

import { Prisma } from '@prisma/client';

/**
 * Models that use soft delete. Every model in this list will automatically
 * exclude deleted records from all queries unless explicitly overridden.
 */
const SOFT_DELETE_MODELS = [
  'Order', 'Invoice', 'Carrier', 'Load', 'Driver', 'Contact', 'Document',
] as const;

type SoftDeleteModel = (typeof SOFT_DELETE_MODELS)[number];

function isSoftDeleteModel(model: string): model is SoftDeleteModel {
  return SOFT_DELETE_MODELS.includes(model as SoftDeleteModel);
}

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    if (!params.model || !isSoftDeleteModel(params.model)) {
      return next(params);
    }

    // ─── READ operations: filter out deleted records ──────────
    if (params.action === 'findMany' || params.action === 'findFirst' || params.action === 'count') {
      // Allow explicit "include deleted" queries
      if (params.args?.where?.deletedAt !== undefined) {
        return next(params);
      }
      params.args = params.args || {};
      params.args.where = { ...params.args.where, deletedAt: null };
      return next(params);
    }

    if (params.action === 'findUnique' || params.action === 'findUniqueOrThrow') {
      // findUnique doesn't support arbitrary where clauses,
      // so we convert to findFirst with the soft delete filter
      params.action = 'findFirst';
      params.args.where = { ...params.args.where, deletedAt: null };
      return next(params);
    }

    // ─── DELETE operations: convert to soft delete ────────────
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = {
        deletedAt: new Date(),
        // deletedBy is set by the service layer, not middleware
      };
      return next(params);
    }

    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() };
      return next(params);
    }

    // ─── UPDATE operations: prevent updating deleted records ──
    if (params.action === 'update' || params.action === 'updateMany') {
      // Don't add filter if we're doing a restore (setting deletedAt to null)
      if (params.args?.data?.deletedAt === null) {
        return next(params);
      }
      params.args.where = { ...params.args.where, deletedAt: null };
      return next(params);
    }

    return next(params);
  };
}
```

### Option B: Prisma Client Extension (Prisma 5.x+)

```typescript
// src/lib/prisma-soft-delete.extension.ts

import { Prisma, PrismaClient } from '@prisma/client';

const SOFT_DELETE_MODELS = [
  'order', 'invoice', 'carrier', 'load', 'driver', 'contact', 'document',
] as const;

/**
 * WHY extension over middleware:
 * 1. Extensions are type-safe (middleware uses `any`)
 * 2. Extensions compose (stack multiple extensions)
 * 3. Extensions are the future of Prisma (middleware is deprecated path)
 */
export function withSoftDelete(prisma: PrismaClient) {
  return prisma.$extends({
    name: 'soft-delete',

    query: {
      $allOperations({ model, operation, args, query }) {
        if (!model || !SOFT_DELETE_MODELS.includes(model.toLowerCase() as any)) {
          return query(args);
        }

        // Auto-filter reads
        if (['findMany', 'findFirst', 'count', 'aggregate', 'groupBy'].includes(operation)) {
          if (args.where?.deletedAt !== undefined) return query(args); // Explicit override
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }

        // Convert delete to soft delete
        if (operation === 'delete') {
          return (prisma as any)[model].update({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }

        if (operation === 'deleteMany') {
          return (prisma as any)[model].updateMany({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }

        // Prevent updating soft-deleted records
        if (['update', 'updateMany'].includes(operation)) {
          if (args.data?.deletedAt === null) return query(args); // Restore operation
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }

        return query(args);
      },
    },
  });
}
```

### Registration

```typescript
// src/app.module.ts or prisma provider

import { softDeleteMiddleware } from '@/lib/prisma-soft-delete.middleware';

// Option A: Middleware
const prisma = new PrismaClient();
prisma.$use(softDeleteMiddleware());

// Option B: Extension
import { withSoftDelete } from '@/lib/prisma-soft-delete.extension';
const prisma = withSoftDelete(new PrismaClient());
```

---

## Restore Endpoint

```typescript
// src/modules/orders/orders.controller.ts (partial)

@Patch(':id/restore')
@Roles('admin')
@ApiOperation({ summary: 'Restore a soft-deleted order' })
async restore(
  @Param('id') id: string,
  @Req() req: any,
) {
  // Find the deleted record (bypass soft-delete filter)
  const order = await this.prisma.order.findFirst({
    where: {
      id,
      workspaceId: req.user.workspaceId,
      deletedAt: { not: null }, // Explicitly find deleted records
    },
  });

  if (!order) {
    throw new NotFoundException('Deleted order not found');
  }

  // Restore by setting deletedAt to null
  const restored = await this.prisma.order.update({
    where: { id },
    data: {
      deletedAt: null,
      deletedBy: null,
    },
  });

  // Log the restore action
  await this.auditService.log({
    action: 'ORDER_RESTORED',
    resourceId: id,
    userId: req.user.id,
    workspaceId: req.user.workspaceId,
    metadata: { previouslyDeletedAt: order.deletedAt, previouslyDeletedBy: order.deletedBy },
  });

  return { data: restored };
}
```

### Recycle Bin Endpoint (List Deleted)

```typescript
@Get('deleted')
@Roles('admin')
@ApiOperation({ summary: 'List soft-deleted orders (recycle bin)' })
async listDeleted(
  @Query('page') page = 1,
  @Query('limit') limit = 20,
  @Req() req: any,
) {
  const [items, total] = await Promise.all([
    this.prisma.order.findMany({
      where: {
        workspaceId: req.user.workspaceId,
        deletedAt: { not: null }, // Only deleted records
      },
      orderBy: { deletedAt: 'desc' }, // Most recently deleted first
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.order.count({
      where: {
        workspaceId: req.user.workspaceId,
        deletedAt: { not: null },
      },
    }),
  ]);

  return {
    data: items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
```

---

## GDPR Hard Delete

Soft delete is not sufficient for GDPR "right to erasure." When a user requests permanent deletion, you must eventually hard delete.

### Strategy: Deferred Hard Delete

```typescript
// src/modules/admin/gdpr.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GdprService {
  private readonly logger = new Logger(GdprService.name);
  private readonly RETENTION_DAYS = 90; // Keep soft-deleted records for 90 days

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Runs nightly. Permanently deletes records that have been soft-deleted
   * for longer than the retention period.
   *
   * WHY 90 days: Gives users time to request a restore. After 90 days,
   * the record is almost certainly intentionally deleted.
   *
   * WHY cron (not immediate): Batch deletion is more efficient and can
   * run during low-traffic hours. Also provides a grace period.
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async purgeExpiredRecords() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);

    // WHY: Use raw query to bypass the soft-delete middleware,
    // which would prevent us from seeing deleted records.
    // This is one of the FEW places raw queries are acceptable.

    const models = ['Order', 'Invoice', 'Carrier', 'Load', 'Driver', 'Contact', 'Document'];

    for (const model of models) {
      const result = await this.prisma.$executeRaw`
        DELETE FROM "${Prisma.raw(model)}"
        WHERE "deletedAt" IS NOT NULL
        AND "deletedAt" < ${cutoffDate}
      `;

      if (result > 0) {
        this.logger.log(`Hard-deleted ${result} expired ${model} records (older than ${this.RETENTION_DAYS} days)`);
      }
    }
  }

  /**
   * GDPR right to erasure: immediately hard delete a specific user's data.
   * Called when a user formally requests data deletion.
   */
  async eraseUserData(userId: string, workspaceId: string) {
    // 1. Soft-delete first (sets deletedAt for audit trail)
    // 2. Then immediately hard-delete personal data fields
    // 3. Keep anonymized transaction records (required for financial compliance)

    await this.prisma.$transaction(async (tx) => {
      // Anonymize the user record (don't delete — keep for FK integrity)
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@redacted.local`,
          name: 'Deleted User',
          phone: null,
          deletedAt: new Date(),
        },
      });

      // Hard delete personal documents
      await tx.document.deleteMany({
        where: { uploadedBy: userId, workspaceId },
      });

      // Log the erasure (required by GDPR Article 17)
      await tx.auditLog.create({
        data: {
          action: 'GDPR_ERASURE',
          resourceType: 'User',
          resourceId: userId,
          workspaceId,
          metadata: { reason: 'Right to erasure request' },
        },
      });
    });
  }
}
```

---

## Common Pitfalls

### 1. Unique Constraints with Soft Delete

**Problem:** A unique constraint on `(workspaceId, email)` blocks creating a new record with the same email as a soft-deleted one.

**Solution:** Use a partial unique index that only applies to active records.

```sql
-- BAD: Unique constraint blocks re-creation after soft delete
-- ALTER TABLE "Contact" ADD CONSTRAINT "Contact_workspace_email_key"
--   UNIQUE ("workspaceId", "email");

-- GOOD: Partial unique index only on active records
CREATE UNIQUE INDEX "Contact_workspace_email_active_key"
  ON "Contact" ("workspaceId", "email")
  WHERE "deletedAt" IS NULL;
```

**Prisma schema note:** Prisma does not natively support partial unique indexes. Define them in a raw migration and add `@@ignore` or use `db.push` with manual SQL.

### 2. Cascade Soft Delete

**Problem:** Deleting a carrier should also soft-delete its associated drivers and trucks. Prisma's `onDelete: Cascade` does HARD delete.

**Solution:** Handle cascade soft delete in application code.

```typescript
async softDeleteCarrier(carrierId: string, deletedBy: string) {
  await this.prisma.$transaction(async (tx) => {
    const now = new Date();

    // Cascade: soft-delete related records first
    await tx.driver.updateMany({
      where: { carrierId, deletedAt: null },
      data: { deletedAt: now, deletedBy },
    });

    await tx.truck.updateMany({
      where: { carrierId, deletedAt: null },
      data: { deletedAt: now, deletedBy },
    });

    // Then soft-delete the carrier itself
    await tx.carrier.update({
      where: { id: carrierId },
      data: { deletedAt: now, deletedBy },
    });
  });
}
```

### 3. Count Queries

**Problem:** `SELECT COUNT(*) FROM orders` includes soft-deleted records if you forget the filter.

**Solution:** The Prisma middleware/extension handles this automatically. But always verify in custom raw queries.

### 4. Relation Loading

**Problem:** `include: { carrier: true }` on a load may load a soft-deleted carrier.

**Solution:** Add the filter in the include clause:

```typescript
const load = await prisma.load.findUnique({
  where: { id: loadId },
  include: {
    carrier: {
      // WHY: The carrier may have been soft-deleted AFTER being assigned
      // to this load. For historical accuracy, we WANT to show it.
      // But flag it so the UI can show "[Deleted]" badge.
    },
  },
});

// In the UI: show carrier name with a "[Deleted]" indicator
// Do NOT hide the carrier — the load history must be preserved.
```

### 5. Search Index Sync

**Problem:** When a record is soft-deleted, the search index (Elasticsearch/Algolia) still contains it.

**Solution:** On soft delete, remove from search index. On restore, re-index.

```typescript
async softDelete(id: string) {
  await this.prisma.order.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  // Remove from search index
  await this.searchService.remove('orders', id);
}

async restore(id: string) {
  const order = await this.prisma.order.update({
    where: { id },
    data: { deletedAt: null },
  });

  // Re-add to search index
  await this.searchService.index('orders', order);
}
```

### 6. API Response Filtering

**Problem:** Returning `deletedAt` and `deletedBy` fields to non-admin users leaks internal information.

**Solution:** Strip soft-delete fields from API responses for non-admin users.

```typescript
// In your response serializer / DTO
function toPublicResponse(record: any) {
  const { deletedAt, deletedBy, ...publicFields } = record;
  return publicFields;
}
```

---

## Migration Checklist

When adding soft delete to an existing application, follow this order:

| Step | Action | Verification |
|---|---|---|
| 1 | Add `deletedAt` and `deletedBy` columns (nullable) | All existing records have `NULL` deletedAt (active) |
| 2 | Create partial indexes | `EXPLAIN ANALYZE` shows index usage on filtered queries |
| 3 | Add Prisma middleware/extension | Existing queries automatically filter deleted records |
| 4 | Update `delete` endpoints to soft delete | `DELETE /orders/:id` sets `deletedAt` instead of removing row |
| 5 | Add `restore` endpoint | `PATCH /orders/:id/restore` clears `deletedAt` |
| 6 | Add recycle bin UI | Admin can see and restore deleted records |
| 7 | Add cascade soft delete | Deleting a parent soft-deletes children |
| 8 | Update unique constraints | Convert to partial unique indexes |
| 9 | Sync search indexes | Soft-deleted records removed from search |
| 10 | Add GDPR hard delete cron | Records purged after retention period |
| 11 | Update tests | Verify deleted records are invisible to normal queries |
| 12 | Update API docs | Document soft delete behavior in OpenAPI spec |
