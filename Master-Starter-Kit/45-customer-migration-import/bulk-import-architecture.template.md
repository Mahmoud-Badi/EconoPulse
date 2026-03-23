# Bulk Import Architecture — Large-Scale Data Processing

> When imports exceed what a single request can handle, you need a distributed pipeline. This template architects the queue-based system that processes millions of records reliably, with progress tracking, backpressure, and graceful failure recovery.

---

## 1. Architecture Overview

The bulk import architecture separates concerns into four layers: upload reception, job queuing, distributed processing, and database loading. Each layer scales independently and fails independently — a worker crash does not lose the upload, a database slowdown does not crash the workers.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER)                                │
│  Upload file → Receive import ID → Poll/subscribe for progress           │
└──────────────────────┬──────────────────────────────┬────────────────────┘
                       │ Upload                       │ Progress (WS/SSE)
                       ▼                              ▼
┌──────────────────────────────────┐  ┌────────────────────────────────────┐
│  API SERVER                      │  │  PROGRESS SERVICE                  │
│                                  │  │                                    │
│  POST /api/imports               │  │  GET /api/imports/:id/progress     │
│  - Validate upload               │  │  WS  /api/imports/:id/stream      │
│  - Store file to object storage  │  │  - Read from Redis                 │
│  - Create import record          │  │  - Push updates via WebSocket      │
│  - Enqueue master job            │  │                                    │
└──────────┬───────────────────────┘  └──────────────┬─────────────────────┘
           │                                          │
           ▼                                          │ Read
┌──────────────────────────────────┐  ┌───────────────▼────────────────────┐
│  JOB QUEUE                       │  │  PROGRESS STORE (Redis)            │
│  ({{MIGRATION_QUEUE}})           │  │                                    │
│                                  │  │  import:{id}:progress              │
│  Master Job                      │  │  import:{id}:errors                │
│  ├── Chunk Job 1 (rows 1-1000)  │  │  import:{id}:status                │
│  ├── Chunk Job 2 (rows 1001-2000)│  │                                    │
│  ├── Chunk Job 3 (rows 2001-3000)│  └────────────────────────────────────┘
│  └── ... Chunk Job N            │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  WORKER POOL ({{MIGRATION_WORKER_COUNT}} workers)                        │
│                                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ Worker 1 │  │ Worker 2 │  │ Worker 3 │  │ Worker N │                │
│  │          │  │          │  │          │  │          │                │
│  │ Parse    │  │ Parse    │  │ Parse    │  │ Parse    │                │
│  │ Validate │  │ Validate │  │ Validate │  │ Validate │                │
│  │ Transform│  │ Transform│  │ Transform│  │ Transform│                │
│  │ Load     │  │ Load     │  │ Load     │  │ Load     │                │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘                │
│       │              │              │              │                     │
│       └──────────────┼──────────────┼──────────────┘                     │
│                      ▼              ▼                                    │
│              ┌──────────────────────────────┐                            │
│              │  TARGET DATABASE              │                            │
│              │  (Batch INSERT/UPSERT)        │                            │
│              └──────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Queue Design

### Job Definition

```typescript
// src/migration/queue/job-definitions.ts
interface MasterImportJob {
  type: 'master';
  importId: string;
  userId: string;
  fileStorageKey: string;
  mappings: FieldMapping[];
  options: ImportOptions;
  totalRows: number;
  chunkSize: number;
}

interface ChunkImportJob {
  type: 'chunk';
  importId: string;
  chunkIndex: number;
  totalChunks: number;
  startRow: number;
  endRow: number;
  fileStorageKey: string;
  mappings: FieldMapping[];
  options: ImportOptions;
}

interface ImportOptions {
  duplicateStrategy: 'skip' | 'update' | 'merge' | 'create' | 'flag';
  duplicateKeyField?: string;
  batchSize: number;
  validateOnly: boolean; // Dry run — validate without loading
  historicalDataPolicy: 'full' | 'rolling-12-months' | 'summary-only';
  cleansing: '{{DATA_CLEANSING_LEVEL}}';
  notificationChannel: '{{IMPORT_NOTIFICATION_CHANNEL}}';
}
```

### Queue Configuration

```typescript
// src/migration/queue/queue-setup.ts
import { Queue, QueueScheduler, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Master queue — one job per import
export const masterQueue = new Queue('import-master', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { age: 86400 * 7 }, // Keep completed for 7 days
    removeOnFail: { age: 86400 * 30 }, // Keep failed for 30 days
  },
});

// Chunk queue — one job per data chunk
export const chunkQueue = new Queue('import-chunks', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400 },
    removeOnFail: { age: 86400 * 7 },
  },
});

// Scheduler for delayed/retry jobs
const scheduler = new QueueScheduler('import-chunks', { connection });
```

### Priority Levels

| Priority | Value | Use Case |
|----------|-------|----------|
| Critical | 1 | Enterprise customer, white-glove migration |
| High | 5 | Paid customer, first import |
| Normal | 10 | Standard import |
| Low | 20 | Re-import, error correction batch |
| Background | 50 | Scheduled/automated sync |

```typescript
// Priority assignment
await masterQueue.add('import', jobData, {
  priority: calculatePriority(userId, importType),
  jobId: `import-${importId}`, // Idempotency — prevent duplicate jobs
});
```

### Retry Configuration

| Failure Type | Max Retries | Backoff | Example |
|-------------|-------------|---------|---------|
| Database connection error | 5 | Exponential (5s, 10s, 20s, 40s, 80s) | Connection pool exhausted |
| Database constraint violation | 0 | None | Unique key conflict — not retryable |
| File read error | 3 | Fixed 5s | S3 temporary unavailability |
| Memory limit exceeded | 2 | Fixed 30s | Reduce chunk size on retry |
| Worker crash | 3 | Exponential (10s base) | OOM kill, process exit |
| Timeout | 2 | Fixed 60s | Slow database, increase timeout |

---

## 3. Worker Configuration

### Worker Setup

```typescript
// src/migration/queue/workers/master-worker.ts
import { Worker, Job } from 'bullmq';

const masterWorker = new Worker(
  'import-master',
  async (job: Job<MasterImportJob>) => {
    const { importId, fileStorageKey, totalRows, chunkSize } = job.data;

    await updateImportStatus(importId, 'processing');

    // Calculate chunks
    const totalChunks = Math.ceil(totalRows / chunkSize);
    const chunkJobs: ChunkImportJob[] = [];

    for (let i = 0; i < totalChunks; i++) {
      chunkJobs.push({
        type: 'chunk',
        importId,
        chunkIndex: i,
        totalChunks,
        startRow: i * chunkSize,
        endRow: Math.min((i + 1) * chunkSize, totalRows),
        fileStorageKey,
        mappings: job.data.mappings,
        options: job.data.options,
      });
    }

    // Enqueue all chunks
    await chunkQueue.addBulk(
      chunkJobs.map((data, index) => ({
        name: `chunk-${index}`,
        data,
        opts: {
          jobId: `${importId}-chunk-${index}`,
          parent: { id: job.id!, queue: masterQueue.qualifiedName },
        },
      }))
    );

    // Wait for all chunks to complete
    await waitForChunks(importId, totalChunks);

    // Run post-migration validation
    const report = await generateComparisonReport(importId);
    await storeReport(importId, report);

    await updateImportStatus(importId, 'completed');
    await sendNotification(job.data.userId, importId, 'completed');

    return { importId, status: 'completed', report: report.summary };
  },
  {
    connection,
    concurrency: 2, // Max 2 master jobs at a time
    limiter: { max: 5, duration: 60000 }, // Max 5 master jobs per minute
  }
);
```

```typescript
// src/migration/queue/workers/chunk-worker.ts
const chunkWorker = new Worker(
  'import-chunks',
  async (job: Job<ChunkImportJob>) => {
    const { importId, chunkIndex, startRow, endRow, fileStorageKey, mappings, options } = job.data;

    // Read the specific chunk from the file
    const fileStream = await getFileStream(fileStorageKey, startRow, endRow);
    const parser = createStreamingParser(fileStream, { delimiter: ',' });

    let processed = 0;
    let errors = 0;
    let batch: any[] = [];
    const BATCH_SIZE = options.batchSize || 500;

    for await (const row of parser) {
      // Validate
      const validationErrors = validateRow(row, mappings);
      if (validationErrors.some(e => e.severity === 'error')) {
        errors++;
        await recordErrors(importId, validationErrors);
        continue;
      }

      // Transform
      const transformed = await transformRow(row, mappings, options);
      batch.push(transformed);

      if (batch.length >= BATCH_SIZE) {
        await bulkInsert(importId, batch, options);
        processed += batch.length;
        batch = [];

        // Update progress
        await updateChunkProgress(importId, chunkIndex, {
          processedRows: processed,
          errorRows: errors,
          totalRows: endRow - startRow,
        });
      }
    }

    // Process remaining
    if (batch.length > 0) {
      await bulkInsert(importId, batch, options);
      processed += batch.length;
    }

    return { chunkIndex, processed, errors };
  },
  {
    connection,
    concurrency: {{MIGRATION_WORKER_COUNT}},
    limiter: { max: {{MIGRATION_WORKER_COUNT}} * 2, duration: 1000 },
  }
);
```

### Resource Limits

| Resource | Per Worker | Total ({{MIGRATION_WORKER_COUNT}} workers) | Monitoring |
|----------|-----------|---------------------------------------------|------------|
| Memory | 512 MB max | {{MIGRATION_WORKER_COUNT}} * 512 MB | RSS monitoring, OOM kill threshold |
| CPU | 1 core | {{MIGRATION_WORKER_COUNT}} cores | CPU usage alerts at 80% |
| DB connections | 5 from pool | {{MIGRATION_WORKER_COUNT}} * 5 | Pool exhaustion alerts |
| File handles | 10 | {{MIGRATION_WORKER_COUNT}} * 10 | ulimit configuration |
| Job timeout | 300s per chunk | — | Timeout alerts |

---

## 4. Database Write Strategy

### Bulk Insert

```typescript
// src/migration/database/bulk-writer.ts
export async function bulkInsert(
  importId: string,
  records: TransformedRecord[],
  options: ImportOptions
): Promise<BulkInsertResult> {
  if (records.length === 0) return { insertedCount: 0, updatedCount: 0, errorCount: 0 };

  const table = records[0].__entityType;
  const columns = Object.keys(records[0]).filter(k => !k.startsWith('__'));

  if (options.duplicateStrategy === 'skip') {
    // INSERT with ON CONFLICT DO NOTHING
    return await insertWithConflictSkip(table, columns, records, importId);
  }

  if (options.duplicateStrategy === 'update') {
    // UPSERT — INSERT with ON CONFLICT DO UPDATE
    return await upsertRecords(table, columns, records, importId, options.duplicateKeyField!);
  }

  // Default: simple insert
  return await simpleInsert(table, columns, records, importId);
}

async function simpleInsert(
  table: string,
  columns: string[],
  records: TransformedRecord[],
  importId: string
): Promise<BulkInsertResult> {
  const allColumns = [...columns, 'import_batch_id', 'created_at'];

  // Build parameterized multi-row INSERT
  const values: any[] = [];
  const placeholders: string[] = [];
  let paramIndex = 1;

  for (const record of records) {
    const rowPlaceholders: string[] = [];
    for (const col of columns) {
      rowPlaceholders.push(`$${paramIndex++}`);
      values.push(record[col]);
    }
    rowPlaceholders.push(`$${paramIndex++}`); // import_batch_id
    values.push(importId);
    rowPlaceholders.push('NOW()'); // created_at
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
  }

  const query = `
    INSERT INTO ${table} (${allColumns.join(', ')})
    VALUES ${placeholders.join(', ')}
    RETURNING id
  `;

  const result = await db.query(query, values);
  return { insertedCount: result.rowCount, updatedCount: 0, errorCount: 0 };
}

async function upsertRecords(
  table: string,
  columns: string[],
  records: TransformedRecord[],
  importId: string,
  conflictKey: string
): Promise<BulkInsertResult> {
  const allColumns = [...columns, 'import_batch_id', 'updated_at'];
  const updateColumns = columns
    .filter(c => c !== conflictKey)
    .map(c => `${c} = EXCLUDED.${c}`)
    .join(', ');

  const values: any[] = [];
  const placeholders: string[] = [];
  let paramIndex = 1;

  for (const record of records) {
    const rowPlaceholders: string[] = [];
    for (const col of columns) {
      rowPlaceholders.push(`$${paramIndex++}`);
      values.push(record[col]);
    }
    rowPlaceholders.push(`$${paramIndex++}`);
    values.push(importId);
    rowPlaceholders.push('NOW()');
    placeholders.push(`(${rowPlaceholders.join(', ')})`);
  }

  const query = `
    INSERT INTO ${table} (${allColumns.join(', ')})
    VALUES ${placeholders.join(', ')}
    ON CONFLICT (${conflictKey}) DO UPDATE SET
      ${updateColumns},
      import_batch_id = EXCLUDED.import_batch_id,
      updated_at = NOW()
    RETURNING id, (xmax = 0) AS is_insert
  `;

  const result = await db.query(query, values);
  const inserted = result.rows.filter((r: any) => r.is_insert).length;
  return {
    insertedCount: inserted,
    updatedCount: result.rowCount - inserted,
    errorCount: 0,
  };
}
```

### Transaction Strategy

| Volume | Strategy | Rationale |
|--------|----------|-----------|
| < 100 records | Single transaction | Atomic — all or nothing |
| 100-10,000 | Transaction per batch (500 rows) | Balance atomicity and lock duration |
| 10,000+ | Transaction per batch + savepoints | Partial rollback without losing entire batch |
| 1M+ | COPY command (PostgreSQL) | 10x faster than INSERT for bulk loads |

---

## 5. Progress Tracking

### Progress Aggregation

```typescript
// src/migration/progress/progress-aggregator.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function updateChunkProgress(
  importId: string,
  chunkIndex: number,
  progress: ChunkProgress
): Promise<void> {
  const key = `import:${importId}:chunks:${chunkIndex}`;
  await redis.hset(key, {
    processedRows: progress.processedRows,
    errorRows: progress.errorRows,
    totalRows: progress.totalRows,
    updatedAt: Date.now(),
  });

  // Aggregate across all chunks
  await aggregateProgress(importId);
}

async function aggregateProgress(importId: string): Promise<void> {
  const keys = await redis.keys(`import:${importId}:chunks:*`);
  let totalProcessed = 0;
  let totalErrors = 0;
  let totalRows = 0;

  for (const key of keys) {
    const chunk = await redis.hgetall(key);
    totalProcessed += parseInt(chunk.processedRows || '0');
    totalErrors += parseInt(chunk.errorRows || '0');
    totalRows += parseInt(chunk.totalRows || '0');
  }

  const percentComplete = totalRows > 0 ? Math.round((totalProcessed / totalRows) * 100) : 0;
  const eta = calculateEta(importId, totalProcessed, totalRows);

  await redis.hset(`import:${importId}:progress`, {
    processedCount: totalProcessed,
    errorCount: totalErrors,
    totalCount: totalRows,
    percentComplete,
    estimatedCompletionAt: eta?.toISOString() || '',
    updatedAt: Date.now(),
  });

  // Publish progress event for WebSocket subscribers
  await redis.publish(`import:${importId}:events`, JSON.stringify({
    type: 'progress',
    data: { processedCount: totalProcessed, errorCount: totalErrors, totalCount: totalRows, percentComplete },
  }));
}
```

### ETA Calculation

```typescript
// src/migration/progress/eta-calculator.ts
interface EtaState {
  samples: Array<{ timestamp: number; processed: number }>;
}

const etaStates = new Map<string, EtaState>();

function calculateEta(importId: string, currentProcessed: number, totalRows: number): Date | null {
  let state = etaStates.get(importId);
  if (!state) {
    state = { samples: [] };
    etaStates.set(importId, state);
  }

  state.samples.push({ timestamp: Date.now(), processed: currentProcessed });

  // Keep last 20 samples for moving average
  if (state.samples.length > 20) state.samples.shift();
  if (state.samples.length < 3) return null; // Not enough data

  // Calculate rate from recent samples (rows per millisecond)
  const recent = state.samples.slice(-10);
  const timeDelta = recent[recent.length - 1].timestamp - recent[0].timestamp;
  const rowsDelta = recent[recent.length - 1].processed - recent[0].processed;

  if (timeDelta === 0 || rowsDelta === 0) return null;

  const rate = rowsDelta / timeDelta; // rows per ms
  const remaining = totalRows - currentProcessed;
  const msRemaining = remaining / rate;

  return new Date(Date.now() + msRemaining);
}
```

---

## 6. Rate Limiting & Backpressure

### Database Backpressure

When the database is slow (high query latency, connection pool near capacity), workers must slow down to prevent cascading failures.

```typescript
// src/migration/queue/backpressure.ts
interface BackpressureState {
  dbLatencyMs: number;
  poolUtilization: number; // 0-1
  queueDepth: number;
  workerUtilization: number; // 0-1
}

export function calculateBackpressure(state: BackpressureState): BackpressureAction {
  // Critical: database is overwhelmed
  if (state.dbLatencyMs > 5000 || state.poolUtilization > 0.95) {
    return {
      action: 'pause',
      pauseDurationMs: 30000,
      reason: `Database under pressure (latency: ${state.dbLatencyMs}ms, pool: ${Math.round(state.poolUtilization * 100)}%)`,
    };
  }

  // Warning: database is getting slow
  if (state.dbLatencyMs > 2000 || state.poolUtilization > 0.8) {
    return {
      action: 'throttle',
      delayBetweenBatchesMs: 1000,
      reduceBatchSizeTo: 250,
      reason: `Database slowing (latency: ${state.dbLatencyMs}ms)`,
    };
  }

  // Healthy: full speed
  return { action: 'continue' };
}
```

---

## 7. Monitoring & Alerting

### Key Metrics

| Metric | Collection Method | Alert Threshold | Dashboard |
|--------|------------------|----------------|-----------|
| Jobs in queue | Queue length query | > 100 | Queue depth chart |
| Processing rate (rows/sec) | Progress events | < 100 rows/sec sustained | Rate chart |
| Error rate | Error counter / total | > 10% | Error rate gauge |
| Worker utilization | Active/total workers | > 90% for 5 min | Utilization heatmap |
| DB write latency (p95) | Query timing | > 500ms | Latency histogram |
| Memory per worker | Process RSS | > 450MB (of 512 limit) | Memory chart |
| Failed jobs | Failed job counter | Any | Failed job list |
| Stale jobs | No progress for 5 min | Any | Stale job alert |
| Import completion time | Start to finish | > 2x estimated | Duration chart |

### Alerting Rules

```yaml
# monitoring/import-alerts.yml
alerts:
  - name: import_high_error_rate
    condition: import_errors / import_total > 0.1
    duration: 5m
    severity: warning
    notification: slack-engineering

  - name: import_stale_job
    condition: time_since_last_progress > 300s
    severity: critical
    notification: pagerduty

  - name: import_worker_oom
    condition: worker_memory_rss > 480_000_000
    severity: warning
    notification: slack-engineering

  - name: import_queue_backup
    condition: queue_depth > 100
    duration: 10m
    severity: warning
    notification: slack-engineering

  - name: import_db_pressure
    condition: db_write_latency_p95 > 1000
    duration: 2m
    severity: critical
    notification: pagerduty
```
