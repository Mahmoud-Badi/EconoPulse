# CSV Import Architecture — File Parsing Pipeline & Validation

> Every migration starts with a file. CSV is the lingua franca of data portability — universally supported, universally inconsistent. This template builds the parsing pipeline that handles real-world CSV chaos without losing data or patience.

---

## 1. File Parsing Pipeline

The CSV import pipeline follows a five-stage linear architecture. Each stage has a single responsibility, clear input/output contracts, and independent error handling. Failures at any stage produce actionable error reports without corrupting downstream stages.

```
┌──────────┐    ┌──────────┐    ┌────────────┐    ┌─────────────┐    ┌──────────┐
│  Upload   │───▶│  Parse   │───▶│  Validate  │───▶│  Transform  │───▶│   Load   │
│           │    │          │    │            │    │             │    │          │
│ Receive   │    │ Decode   │    │ Type check │    │ Map fields  │    │ Batch    │
│ file,     │    │ encoding,│    │ constraints│    │ normalize   │    │ insert   │
│ detect    │    │ detect   │    │ referential│    │ convert     │    │ upsert   │
│ format    │    │ delimiter│    │ integrity  │    │ enrich      │    │ commit   │
└──────────┘    └──────────┘    └────────────┘    └─────────────┘    └──────────┘
     │               │                │                  │                │
     ▼               ▼                ▼                  ▼                ▼
  file_meta      raw_rows[]     validated_rows[]   transformed_rows[]  import_result
  + encoding     + errors[]     + errors[]         + warnings[]        + summary
```

### Pipeline Orchestrator

```typescript
// src/migration/pipeline/csv-pipeline.ts
import { Readable } from 'stream';

interface PipelineResult {
  importId: string;
  totalRows: number;
  importedRows: number;
  skippedRows: number;
  errorRows: number;
  errors: PipelineError[];
  duration: number;
}

export async function executeCsvPipeline(
  importId: string,
  fileStream: Readable,
  mappings: ColumnMapping[],
  options: ImportOptions
): Promise<PipelineResult> {
  const startTime = Date.now();
  const errors: PipelineError[] = [];
  let totalRows = 0;
  let importedRows = 0;
  let skippedRows = 0;

  // Stage 1: Detect encoding and decode
  const { decodedStream, encoding } = await detectAndDecode(fileStream);

  // Stage 2: Parse CSV with detected delimiter
  const { delimiter } = await detectDelimiter(decodedStream);
  const parser = createStreamingParser(decodedStream, { delimiter });

  // Stage 3-5: Process in batches
  const BATCH_SIZE = options.batchSize || 500;
  let batch: RawRow[] = [];

  for await (const row of parser) {
    totalRows++;
    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      const result = await processBatch(importId, batch, mappings, options, totalRows);
      importedRows += result.imported;
      skippedRows += result.skipped;
      errors.push(...result.errors);
      batch = [];

      // Report progress
      await updateProgress(importId, {
        processedCount: totalRows,
        errorCount: errors.length,
      });
    }
  }

  // Process remaining rows
  if (batch.length > 0) {
    const result = await processBatch(importId, batch, mappings, options, totalRows);
    importedRows += result.imported;
    skippedRows += result.skipped;
    errors.push(...result.errors);
  }

  return {
    importId,
    totalRows,
    importedRows,
    skippedRows,
    errorRows: errors.filter(e => e.severity === 'error').length,
    errors,
    duration: Date.now() - startTime,
  };
}

async function processBatch(
  importId: string,
  batch: RawRow[],
  mappings: ColumnMapping[],
  options: ImportOptions,
  currentOffset: number
): Promise<BatchResult> {
  // Stage 3: Validate
  const validated = batch.map((row, i) => ({
    row,
    errors: validateRow(row, mappings, currentOffset - batch.length + i + 1),
  }));

  const validRows = validated.filter(v => v.errors.filter(e => e.severity === 'error').length === 0);
  const invalidRows = validated.filter(v => v.errors.filter(e => e.severity === 'error').length > 0);

  // Stage 4: Transform valid rows
  const transformed = validRows.map(v => transformRow(v.row, mappings, options));

  // Stage 5: Load into database
  const loadResult = await bulkInsert(importId, transformed, options);

  return {
    imported: loadResult.insertedCount,
    skipped: invalidRows.length,
    errors: invalidRows.flatMap(v => v.errors),
  };
}
```

---

## 2. Encoding Detection & Handling

Encoding issues are the single most common cause of "garbled data" migration failures. Real-world CSV files arrive in dozens of encodings, and most tools do not declare encoding in metadata.

### Detection Strategy

```typescript
// src/migration/utils/encoding-detector.ts
import { detect as detectCharset } from 'jschardet';
import iconv from 'iconv-lite';

interface EncodingResult {
  encoding: string;
  confidence: number;
  hasBom: boolean;
  decodedStream: Readable;
}

export async function detectAndDecode(stream: Readable): Promise<EncodingResult> {
  // Read first 64KB for detection
  const sampleBuffer = await readBytes(stream, 65536);

  // Step 1: Check for BOM (Byte Order Mark)
  const bom = detectBom(sampleBuffer);
  if (bom) {
    const stripped = stripBom(sampleBuffer, bom);
    return {
      encoding: bom,
      confidence: 1.0,
      hasBom: true,
      decodedStream: createDecodingStream(stream, sampleBuffer, bom),
    };
  }

  // Step 2: Statistical detection
  const detection = detectCharset(sampleBuffer);

  // Step 3: Fallback chain
  const encoding = resolveEncoding(detection);

  return {
    encoding,
    confidence: detection.confidence || 0.5,
    hasBom: false,
    decodedStream: createDecodingStream(stream, sampleBuffer, encoding),
  };
}

function detectBom(buffer: Buffer): string | null {
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) return 'UTF-8';
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) return 'UTF-16LE';
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) return 'UTF-16BE';
  return null;
}

function resolveEncoding(detection: { encoding: string; confidence: number }): string {
  // High confidence — trust detection
  if (detection.confidence > 0.8) return normalizeEncodingName(detection.encoding);

  // Medium confidence — check if it decodes cleanly as UTF-8
  // UTF-8 is the safe default for modern exports
  return 'UTF-8';
}

function normalizeEncodingName(name: string): string {
  const map: Record<string, string> = {
    'ascii': 'UTF-8',
    'ISO-8859-1': 'ISO-8859-1',
    'windows-1252': 'Windows-1252',
    'UTF-8': 'UTF-8',
    'utf-8': 'UTF-8',
    'SHIFT_JIS': 'Shift_JIS',
    'EUC-JP': 'EUC-JP',
    'GB2312': 'GB2312',
    'Big5': 'Big5',
  };
  return map[name] || 'UTF-8';
}
```

### Supported Encodings

| Encoding | Common Sources | Detection Signal | Handling |
|----------|---------------|-----------------|----------|
| UTF-8 | Modern apps, Google Sheets | BOM or clean decode | Direct parse |
| UTF-8 with BOM | Excel "Save as CSV (UTF-8)" | 3-byte BOM prefix | Strip BOM before parse |
| ISO-8859-1 (Latin-1) | European legacy systems | Bytes 0x80-0xFF present | Transcode to UTF-8 |
| Windows-1252 | Excel on Windows (default) | Smart quotes (0x93, 0x94) | Transcode to UTF-8 |
| UTF-16LE | Rare, some Windows exports | 2-byte BOM (FF FE) | Transcode to UTF-8 |
| Shift_JIS | Japanese systems | Multi-byte Kanji sequences | Transcode to UTF-8 |
| GB2312 | Chinese systems | Multi-byte CJK sequences | Transcode to UTF-8 |

---

## 3. Column Type Inference

When column mappings are not pre-configured (generic CSV import rather than competitor-specific), the system infers column types from sample data to suggest mappings.

```typescript
// src/migration/utils/type-inference.ts
type InferredType = 'email' | 'phone' | 'date' | 'url' | 'currency' | 'number' |
  'boolean' | 'country' | 'state' | 'zip' | 'address' | 'name' | 'text';

interface TypeInferenceResult {
  column: string;
  inferredType: InferredType;
  confidence: number;
  sampleMatches: number;
  totalSamples: number;
}

export function inferColumnType(
  columnName: string,
  sampleValues: string[]
): TypeInferenceResult {
  const nonEmpty = sampleValues.filter(v => v && v.trim() !== '');
  if (nonEmpty.length === 0) {
    return { column: columnName, inferredType: 'text', confidence: 0, sampleMatches: 0, totalSamples: 0 };
  }

  // Check name-based hints first
  const nameHint = inferFromColumnName(columnName);

  // Then validate with sample data
  const typeCheckers: Array<{ type: InferredType; check: (v: string) => boolean }> = [
    { type: 'email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { type: 'phone', check: v => /^[\d\s\-\+\(\)\.]{7,20}$/.test(v.replace(/\s/g, '')) },
    { type: 'url', check: v => /^https?:\/\/.+/.test(v) },
    { type: 'date', check: v => !isNaN(Date.parse(v)) && v.length > 4 },
    { type: 'currency', check: v => /^[\$\€\£\¥]?\s?[\d,]+\.?\d{0,2}$/.test(v) },
    { type: 'number', check: v => !isNaN(parseFloat(v)) && isFinite(Number(v)) },
    { type: 'boolean', check: v => ['true', 'false', 'yes', 'no', '0', '1'].includes(v.toLowerCase()) },
    { type: 'zip', check: v => /^\d{5}(-\d{4})?$/.test(v) || /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(v) },
  ];

  for (const { type, check } of typeCheckers) {
    const matches = nonEmpty.filter(check).length;
    const ratio = matches / nonEmpty.length;
    if (ratio > 0.8) {
      const confidence = nameHint === type ? 0.95 : ratio * 0.8;
      return { column: columnName, inferredType: type, confidence, sampleMatches: matches, totalSamples: nonEmpty.length };
    }
  }

  // Fallback to name hint or text
  return {
    column: columnName,
    inferredType: nameHint || 'text',
    confidence: nameHint ? 0.6 : 0.3,
    sampleMatches: 0,
    totalSamples: nonEmpty.length,
  };
}

function inferFromColumnName(name: string): InferredType | null {
  const lower = name.toLowerCase().replace(/[_\-\s]/g, '');
  const hints: Record<string, InferredType> = {
    email: 'email', emailaddress: 'email', mail: 'email',
    phone: 'phone', phonenumber: 'phone', mobile: 'phone', tel: 'phone', telephone: 'phone',
    date: 'date', createdat: 'date', updatedat: 'date', birthday: 'date', dob: 'date',
    url: 'url', website: 'url', link: 'url', homepage: 'url',
    price: 'currency', amount: 'currency', cost: 'currency', revenue: 'currency',
    count: 'number', quantity: 'number', age: 'number', score: 'number',
    active: 'boolean', enabled: 'boolean', verified: 'boolean',
    zip: 'zip', zipcode: 'zip', postalcode: 'zip', postcode: 'zip',
    country: 'country', countrycode: 'country',
    state: 'state', province: 'state', region: 'state',
    firstname: 'name', lastname: 'name', fullname: 'name', name: 'name',
    address: 'address', street: 'address', city: 'address',
  };
  return hints[lower] || null;
}
```

---

## 4. Validation Rules by Field Type

| Field Type | Validation Rules | Error Message | Auto-Fix |
|-----------|-----------------|---------------|----------|
| `email` | RFC 5322 format, no spaces, single @ | "Invalid email format" | Trim spaces, suggest domain typos |
| `phone` | 7-20 chars after stripping formatting | "Invalid phone number" | Strip non-numeric, add country code |
| `date` | Parseable date, not in future (if applicable) | "Cannot parse as date" | Try multiple formats, ask user |
| `url` | Valid URL with protocol | "Invalid URL" | Prepend https:// if missing |
| `currency` | Numeric with optional currency symbol | "Invalid currency value" | Strip currency symbols, normalize decimal |
| `number` | Numeric, within min/max bounds | "Not a valid number" | Strip thousands separators |
| `boolean` | Maps to true/false | "Expected yes/no or true/false" | Map common variants (y/n, 1/0) |
| `enum` | Value in allowed set | "Not a valid option" | Fuzzy match to closest option |
| `text` | Length within bounds, no null bytes | "Text too long (max N chars)" | Truncate with warning |
| `required` | Non-empty after trimming | "Required field is empty" | No auto-fix — manual resolution |

### Validation Implementation

```typescript
// src/migration/services/field-validators.ts
interface ValidationResult {
  valid: boolean;
  sanitizedValue?: string;
  error?: string;
  warning?: string;
  autoFixed?: boolean;
}

const validators: Record<string, (value: string, field: FieldDef) => ValidationResult> = {
  email: (value, field) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed && !field.required) return { valid: true, sanitizedValue: '' };
    if (!trimmed && field.required) return { valid: false, error: `${field.label} is required` };

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: `"${value}" is not a valid email address` };
    }
    return { valid: true, sanitizedValue: trimmed, autoFixed: trimmed !== value };
  },

  date: (value, field) => {
    const trimmed = value.trim();
    if (!trimmed && !field.required) return { valid: true, sanitizedValue: '' };

    // Try multiple formats in priority order
    const formats = [
      { regex: /^\d{4}-\d{2}-\d{2}$/, parse: (v: string) => new Date(v) }, // ISO
      { regex: /^\d{2}\/\d{2}\/\d{4}$/, parse: parseMDY }, // US
      { regex: /^\d{2}\.\d{2}\.\d{4}$/, parse: parseDMY_dot }, // European
      { regex: /^\d{2}-\d{2}-\d{4}$/, parse: parseDMY_dash }, // European alt
      { regex: /^\d{1,2}\s\w+\s\d{4}$/, parse: (v: string) => new Date(v) }, // "1 Jan 2024"
    ];

    for (const fmt of formats) {
      if (fmt.regex.test(trimmed)) {
        const parsed = fmt.parse(trimmed);
        if (!isNaN(parsed.getTime())) {
          return { valid: true, sanitizedValue: parsed.toISOString(), autoFixed: true };
        }
      }
    }

    // Last resort: native Date.parse
    const fallback = new Date(trimmed);
    if (!isNaN(fallback.getTime())) {
      return {
        valid: true,
        sanitizedValue: fallback.toISOString(),
        autoFixed: true,
        warning: `Interpreted "${value}" as ${fallback.toISOString().split('T')[0]}. Verify this is correct.`,
      };
    }

    return { valid: false, error: `Cannot parse "${value}" as a date. Expected YYYY-MM-DD or MM/DD/YYYY.` };
  },

  phone: (value, field) => {
    const trimmed = value.trim();
    if (!trimmed && !field.required) return { valid: true, sanitizedValue: '' };

    const digitsOnly = trimmed.replace(/[\s\-\(\)\.\+]/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return { valid: false, error: `"${value}" does not appear to be a valid phone number` };
    }

    // Normalize to E.164 format if possible
    const normalized = normalizePhone(trimmed);
    return { valid: true, sanitizedValue: normalized, autoFixed: normalized !== trimmed };
  },
};
```

---

## 5. Batch Processing Architecture

### Chunk Size Configuration

| Record Count | Chunk Size | Rationale |
|-------------|-----------|-----------|
| < 1,000 | 100 | Small enough for fast preview, large enough to avoid overhead |
| 1,000 - 10,000 | 500 | Balance between memory and database round trips |
| 10,000 - 100,000 | 1,000 | Larger chunks reduce total DB operations |
| 100,000+ | 2,000 | Max chunk size — beyond this, memory pressure increases |

### Memory Management

```typescript
// src/migration/pipeline/streaming-parser.ts
import { parse } from 'csv-parse';
import { Transform } from 'stream';

export function createStreamingParser(
  input: Readable,
  options: { delimiter: string; encoding?: string }
): AsyncIterable<RawRow> {
  const parser = input.pipe(
    parse({
      delimiter: options.delimiter,
      columns: true, // Use first row as header
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true, // Handle rows with too few/many columns
      max_record_size: 1024 * 1024, // 1MB per record max
      on_record: (record, context) => {
        // Attach row number for error reporting
        return { ...record, __rowNumber: context.lines };
      },
    })
  );

  // Backpressure-aware: parser pauses when consumer is slow
  return parser;
}
```

**Memory budget calculation:**
- Each CSV row consumes ~2-5KB in memory (parsed object with string values)
- A batch of 1,000 rows: ~2-5MB
- Streaming parser holds at most 2 batches in memory: ~10MB
- Total memory budget per import worker: ~50MB (including overhead)
- This supports concurrent processing of {{MIGRATION_WORKER_COUNT}} imports safely

---

## 6. Error Collection & Reporting

### Error Accumulator

```typescript
// src/migration/services/error-collector.ts
interface ImportError {
  rowNumber: number;
  column: string;
  originalValue: string;
  errorType: 'validation' | 'transformation' | 'load' | 'duplicate';
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export class ErrorCollector {
  private errors: ImportError[] = [];
  private errorCountByType: Map<string, number> = new Map();
  private maxErrorsStored: number = 10000;

  add(error: ImportError): void {
    if (this.errors.length < this.maxErrorsStored) {
      this.errors.push(error);
    }
    const key = `${error.errorType}:${error.column}:${error.message}`;
    this.errorCountByType.set(key, (this.errorCountByType.get(key) || 0) + 1);
  }

  getErrorReport(): ErrorReport {
    return {
      totalErrors: this.getTotalErrorCount(),
      errorsByType: Object.fromEntries(this.errorCountByType),
      sampleErrors: this.errors.slice(0, 100),
      truncated: this.errors.length >= this.maxErrorsStored,
    };
  }

  getTotalErrorCount(): number {
    let total = 0;
    for (const count of this.errorCountByType.values()) {
      total += count;
    }
    return total;
  }

  generateErrorCsv(): string {
    const headers = ['Row', 'Column', 'Original Value', 'Error Type', 'Message', 'Suggestion'];
    const rows = this.errors.map(e => [
      e.rowNumber, e.column, e.originalValue, e.errorType, e.message, e.suggestion || '',
    ]);
    return [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  }

  shouldAbort(threshold: number = 0.5, totalRows: number): boolean {
    // Abort if more than 50% of rows have errors — likely wrong file/format
    return this.getTotalErrorCount() / totalRows > threshold;
  }
}
```

### Error Report Download Format

The error report is a CSV file with the following columns:

| Column | Description |
|--------|-------------|
| Row | Original row number in the source file |
| Column | The field that failed validation |
| Original Value | The raw value from the source file |
| Error Type | validation, transformation, load, or duplicate |
| Message | Human-readable error description |
| Suggestion | Auto-fix suggestion if available |

Customers download this file, fix the errors in their source data, and re-upload only the failed rows. The import wizard detects re-imports of error reports and processes them as corrections to the original import.

---

## 7. Idempotency & Duplicate Detection

### Duplicate Detection Strategies

| Strategy | How It Works | Best For | Trade-offs |
|----------|-------------|----------|------------|
| **Natural key** | Match on business-meaningful fields (email, SKU, external ID) | Data with stable unique identifiers | Requires customer to identify the key |
| **Content hash** | SHA-256 of all field values concatenated | Exact duplicate detection | Any field change creates a "new" record |
| **Fuzzy match** | Similarity score on name + email + phone | Contact/person deduplication | False positives require manual review |
| **Import batch** | Track import batch ID, prevent re-processing same file | Re-upload protection | Does not catch duplicates across imports |

### Implementation

```typescript
// src/migration/services/duplicate-detector.ts
import crypto from 'crypto';

interface DuplicateCheck {
  isDuplicate: boolean;
  existingId?: string;
  matchType?: 'natural_key' | 'content_hash' | 'fuzzy';
  confidence?: number;
}

export async function checkDuplicate(
  row: TransformedRow,
  strategy: DuplicateStrategy,
  importId: string
): Promise<DuplicateCheck> {
  switch (strategy.type) {
    case 'natural_key': {
      const keyValue = row[strategy.keyField];
      if (!keyValue) return { isDuplicate: false };

      const existing = await db.query(
        `SELECT id FROM ${strategy.table} WHERE ${strategy.keyField} = $1`,
        [keyValue]
      );
      if (existing.rows.length > 0) {
        return { isDuplicate: true, existingId: existing.rows[0].id, matchType: 'natural_key', confidence: 1.0 };
      }
      return { isDuplicate: false };
    }

    case 'content_hash': {
      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(row))
        .digest('hex');

      const existing = await db.query(
        `SELECT id FROM import_hashes WHERE content_hash = $1 AND import_id != $2`,
        [hash, importId]
      );
      if (existing.rows.length > 0) {
        return { isDuplicate: true, existingId: existing.rows[0].id, matchType: 'content_hash', confidence: 1.0 };
      }

      // Store hash for future checks
      await db.query(
        `INSERT INTO import_hashes (import_id, content_hash, row_id) VALUES ($1, $2, $3)
         ON CONFLICT (content_hash) DO NOTHING`,
        [importId, hash, row.id]
      );
      return { isDuplicate: false };
    }

    case 'fuzzy': {
      const candidates = await db.query(
        `SELECT id, name, email FROM ${strategy.table}
         WHERE similarity(name, $1) > 0.6 OR email = $2
         LIMIT 5`,
        [row.name, row.email]
      );
      if (candidates.rows.length > 0) {
        const best = candidates.rows[0];
        const score = calculateSimilarity(row, best);
        if (score > 0.85) {
          return { isDuplicate: true, existingId: best.id, matchType: 'fuzzy', confidence: score };
        }
      }
      return { isDuplicate: false };
    }

    default:
      return { isDuplicate: false };
  }
}
```

### Duplicate Resolution Options

When duplicates are detected, the customer chooses a resolution strategy:

| Option | Behavior | When to Use |
|--------|----------|-------------|
| **Skip duplicates** | Ignore the imported row, keep existing | Safe default — preserves existing data |
| **Update existing** | Overwrite existing fields with imported values | Customer wants to refresh data from source |
| **Merge (non-empty wins)** | Only overwrite fields that are empty in the target | Best of both — fills gaps without overwriting |
| **Create new** | Import as a new record regardless | When "duplicates" are actually distinct records |
| **Flag for review** | Import with a `needs_review` flag | When confidence is low and manual verification is needed |

```typescript
// src/migration/services/duplicate-resolver.ts
export async function resolveDuplicate(
  importedRow: TransformedRow,
  existingId: string,
  strategy: 'skip' | 'update' | 'merge' | 'create' | 'flag'
): Promise<ResolveResult> {
  switch (strategy) {
    case 'skip':
      return { action: 'skipped', rowId: existingId };

    case 'update':
      await db.query(
        `UPDATE ${table} SET ${buildUpdateSet(importedRow)} WHERE id = $1`,
        [existingId, ...Object.values(importedRow)]
      );
      return { action: 'updated', rowId: existingId };

    case 'merge':
      const existing = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [existingId]);
      const merged = mergeNonEmpty(existing.rows[0], importedRow);
      await db.query(
        `UPDATE ${table} SET ${buildUpdateSet(merged)} WHERE id = $1`,
        [existingId, ...Object.values(merged)]
      );
      return { action: 'merged', rowId: existingId };

    case 'create':
      const newId = await insertRow(importedRow);
      return { action: 'created', rowId: newId };

    case 'flag':
      const flaggedId = await insertRow({ ...importedRow, needs_review: true, potential_duplicate_of: existingId });
      return { action: 'flagged', rowId: flaggedId };
  }
}
```

---

## Architecture Diagram

```
                              ┌─────────────────────┐
                              │    Client Browser    │
                              │  (Import Wizard UI)  │
                              └──────────┬──────────┘
                                         │ Upload (multipart)
                                         ▼
                              ┌─────────────────────┐
                              │    API Gateway       │
                              │  POST /api/imports   │
                              └──────────┬──────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                   ┌────────────┐ ┌────────────┐ ┌────────────┐
                   │  File      │ │  Import    │ │  Progress  │
                   │  Storage   │ │  Session   │ │  Store     │
                   │  (S3/GCS)  │ │  (DB)      │ │  (Redis)   │
                   └────────────┘ └─────┬──────┘ └────────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │  Job Queue           │
                              │  ({{MIGRATION_QUEUE}})│
                              └──────────┬──────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                   ┌────────────┐ ┌────────────┐ ┌────────────┐
                   │  Worker 1  │ │  Worker 2  │ │  Worker N  │
                   │  Parse     │ │  Parse     │ │  Parse     │
                   │  Validate  │ │  Validate  │ │  Validate  │
                   │  Transform │ │  Transform │ │  Transform │
                   │  Load      │ │  Load      │ │  Load      │
                   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
                         │              │              │
                         └──────────────┼──────────────┘
                                        ▼
                              ┌─────────────────────┐
                              │  Target Database     │
                              │  ({{PROJECT_NAME}})  │
                              └─────────────────────┘
```
