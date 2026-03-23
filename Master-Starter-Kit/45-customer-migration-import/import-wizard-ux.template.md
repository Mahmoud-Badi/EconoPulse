# Data Import Wizard — UX Patterns & Component Architecture

> The import wizard is the first impression for every migrating customer. A confusing wizard turns a product evaluation into a product rejection. A smooth wizard turns migration into a "wow" moment.

---

## 1. Wizard Step Flow

The import wizard follows a five-step linear flow. Each step must be completable independently — the customer can leave and return without losing progress. Step state is persisted server-side against the import session ID.

```
┌──────────┐    ┌──────────────┐    ┌────────────────┐    ┌────────────┐    ┌─────────────┐
│  Step 1   │───▶│    Step 2     │───▶│     Step 3     │───▶│   Step 4   │───▶│   Step 5    │
│  Upload   │    │ Column Map   │    │   Preview &    │    │ Processing │    │  Results    │
│           │    │              │    │  Validation    │    │            │    │  Summary    │
└──────────┘    └──────────────┘    └────────────────┘    └────────────┘    └─────────────┘
     │                │                     │                    │                  │
     ▼                ▼                     ▼                    ▼                  ▼
  Drag-drop       Auto-detect          Sample rows          Progress bar       Import/Skip/
  Format detect   Manual override      Error highlight       Background job     Error counts
  Size validate   Required fields      Fix-in-place         Email notify       Error download
```

**State machine for wizard navigation:**

```
UPLOAD_PENDING → FILE_UPLOADED → MAPPING_CONFIGURED → PREVIEW_APPROVED → PROCESSING → COMPLETED
                      │                  │                    │               │
                      ▼                  ▼                    ▼               ▼
                 UPLOAD_FAILED    MAPPING_INVALID    PREVIEW_REJECTED   PROCESSING_FAILED
```

**Component hierarchy:**

```tsx
// src/migration/components/ImportWizard.tsx
<ImportWizard>
  <WizardHeader currentStep={step} totalSteps={5} />
  <WizardBody>
    {step === 1 && <FileUploadStep />}
    {step === 2 && <ColumnMappingStep />}
    {step === 3 && <PreviewValidationStep />}
    {step === 4 && <ProcessingStep />}
    {step === 5 && <ResultsSummaryStep />}
  </WizardBody>
  <WizardFooter
    onBack={handleBack}
    onNext={handleNext}
    canProceed={stepValid}
  />
</ImportWizard>
```

---

## 2. Step 1 — File Upload

### Wireframe Description

The upload step occupies the full wizard content area. A large drop zone (min 300x200px) dominates the center with a dashed border, upload icon, and text: "Drag and drop your file here, or click to browse." Below the drop zone, supported formats and size limit are displayed. If the customer is importing from a known competitor, a secondary section shows "Importing from X? Download our template" with competitor-specific formatting guides.

<!-- IF {{MIGRATION_STRATEGY}} == "self-serve" -->
The upload step is the customer's first interaction — it must work flawlessly without human assistance. Error messages must be specific and actionable ("File is 150MB, which exceeds the {{MAX_IMPORT_SIZE}} limit. Try splitting your file into smaller batches.") rather than generic ("Upload failed").
<!-- ENDIF -->

### Drag-and-Drop Upload

```tsx
// src/migration/components/FileUploadStep.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadStepProps {
  onFileAccepted: (file: File, format: ImportFormat) => void;
  maxSize: number; // bytes — derived from {{MAX_IMPORT_SIZE}}
  acceptedFormats: string[]; // derived from {{IMPORT_FORMATS}}
}

type ImportFormat = 'csv' | 'xlsx' | 'json' | 'tsv';

export function FileUploadStep({ onFileAccepted, maxSize, acceptedFormats }: FileUploadStepProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<ImportFormat | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError(
          `File is ${formatBytes(rejection.file.size)}, which exceeds the ` +
          `${formatBytes(maxSize)} limit. Try splitting your file into smaller batches.`
        );
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError(
          `${rejection.file.name} is not a supported format. ` +
          `Supported formats: ${acceptedFormats.join(', ')}`
        );
      }
      return;
    }

    const file = acceptedFiles[0];
    const format = detectFileFormat(file);
    setDetectedFormat(format);
    setUploadError(null);
    onFileAccepted(file, format);
  }, [maxSize, acceptedFormats, onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: buildAcceptMap(acceptedFormats),
    multiple: false,
  });

  return (
    <div className="file-upload-step">
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragActive ? 'drop-zone--active' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadIcon className="drop-zone__icon" />
        <p className="drop-zone__text">
          {isDragActive
            ? 'Drop your file here...'
            : 'Drag and drop your file here, or click to browse'}
        </p>
        <p className="drop-zone__formats">
          Supported formats: {acceptedFormats.join(', ')} | Max size: {formatBytes(maxSize)}
        </p>
      </div>

      {uploadError && (
        <div className="upload-error" role="alert">
          <ErrorIcon /> {uploadError}
        </div>
      )}

      {detectedFormat && (
        <div className="format-detected">
          Detected format: <strong>{detectedFormat.toUpperCase()}</strong>
        </div>
      )}

      <CompetitorImportHelper competitors={['{{COMPETITOR_IMPORTERS}}']} />
    </div>
  );
}
```

### Format Detection

```typescript
// src/migration/utils/format-detection.ts
export function detectFileFormat(file: File): ImportFormat {
  const extension = file.name.split('.').pop()?.toLowerCase();

  const formatMap: Record<string, ImportFormat> = {
    csv: 'csv',
    tsv: 'tsv',
    xlsx: 'xlsx',
    xls: 'xlsx',
    json: 'json',
    txt: 'csv', // assume CSV for .txt, validate delimiter in next step
  };

  return formatMap[extension || ''] || 'csv';
}

export function detectDelimiter(sampleLines: string[]): string {
  const delimiters = [',', ';', '\t', '|'];
  const scores = delimiters.map(d => ({
    delimiter: d,
    consistency: calculateDelimiterConsistency(sampleLines, d),
  }));

  scores.sort((a, b) => b.consistency - a.consistency);
  return scores[0].delimiter;
}

function calculateDelimiterConsistency(lines: string[], delimiter: string): number {
  if (lines.length < 2) return 0;
  const counts = lines.map(line => line.split(delimiter).length);
  const first = counts[0];
  // High consistency = same number of delimiters in every line
  const matching = counts.filter(c => c === first).length;
  return (matching / counts.length) * (first > 1 ? first : 0);
}
```

### Size Limits

| Tier | Max File Size | Max Records | Processing Model |
|------|-------------|-------------|-----------------|
| Free | 5 MB | 1,000 | Synchronous |
| Pro | {{MAX_IMPORT_SIZE}} | {{IMPORT_RECORD_LIMIT}} | Background job |
| Enterprise | 1 GB+ | Unlimited | Distributed workers |

---

## 3. Step 2 — Column Mapping

### Wireframe Description

The column mapping step shows a two-column layout. The left column displays detected source columns (from the uploaded file's header row) with a sample value below each column name. The right column shows the target fields in {{PROJECT_NAME}}'s schema. Lines connect auto-matched columns. Unmatched source columns appear at the bottom with a dropdown to select a target field or "Skip this column." Required target fields that are not yet mapped show a red indicator.

### Auto-Detection

```typescript
// src/migration/services/column-matcher.ts
interface ColumnMatch {
  sourceColumn: string;
  targetField: string;
  confidence: number; // 0-1
  matchType: 'exact' | 'fuzzy' | 'sample-based' | 'manual';
}

export function autoMatchColumns(
  sourceColumns: string[],
  targetSchema: TargetField[],
  sampleData: Record<string, string>[]
): ColumnMatch[] {
  const matches: ColumnMatch[] = [];

  for (const source of sourceColumns) {
    // Phase 1: Exact name match (case-insensitive)
    const exactMatch = targetSchema.find(
      t => t.name.toLowerCase() === source.toLowerCase() ||
           t.aliases.some(a => a.toLowerCase() === source.toLowerCase())
    );
    if (exactMatch) {
      matches.push({
        sourceColumn: source,
        targetField: exactMatch.name,
        confidence: 1.0,
        matchType: 'exact',
      });
      continue;
    }

    // Phase 2: Fuzzy name match (Levenshtein distance, contains, abbreviation)
    const fuzzyMatch = findFuzzyMatch(source, targetSchema);
    if (fuzzyMatch && fuzzyMatch.confidence > 0.7) {
      matches.push({ ...fuzzyMatch, sourceColumn: source, matchType: 'fuzzy' });
      continue;
    }

    // Phase 3: Sample-based type inference
    const sampleValues = sampleData.map(row => row[source]).filter(Boolean);
    const inferredType = inferFieldType(sampleValues);
    const typeMatch = targetSchema.find(
      t => t.type === inferredType && !matches.some(m => m.targetField === t.name)
    );
    if (typeMatch) {
      matches.push({
        sourceColumn: source,
        targetField: typeMatch.name,
        confidence: 0.5,
        matchType: 'sample-based',
      });
      continue;
    }

    // No match — will be shown as "unmapped" for manual assignment
    matches.push({
      sourceColumn: source,
      targetField: '',
      confidence: 0,
      matchType: 'manual',
    });
  }

  return matches;
}
```

### Manual Override

```tsx
// src/migration/components/ColumnMappingStep.tsx
interface ColumnMappingRowProps {
  match: ColumnMatch;
  targetFields: TargetField[];
  sampleValue: string;
  onMappingChange: (sourceColumn: string, targetField: string) => void;
}

function ColumnMappingRow({ match, targetFields, sampleValue, onMappingChange }: ColumnMappingRowProps) {
  return (
    <div className={`mapping-row ${match.confidence < 0.7 ? 'mapping-row--low-confidence' : ''}`}>
      <div className="mapping-row__source">
        <span className="column-name">{match.sourceColumn}</span>
        <span className="sample-value" title={sampleValue}>
          {truncate(sampleValue, 40)}
        </span>
      </div>

      <div className="mapping-row__arrow">
        {match.confidence >= 0.7 ? <ArrowRight /> : <QuestionMark />}
      </div>

      <div className="mapping-row__target">
        <select
          value={match.targetField}
          onChange={(e) => onMappingChange(match.sourceColumn, e.target.value)}
          className={!match.targetField ? 'select--unmapped' : ''}
        >
          <option value="">— Skip this column —</option>
          {targetFields.map(field => (
            <option key={field.name} value={field.name}>
              {field.label} {field.required ? '(required)' : ''}
            </option>
          ))}
        </select>
        {match.confidence > 0 && match.confidence < 1 && (
          <span className="confidence-badge">
            {Math.round(match.confidence * 100)}% match
          </span>
        )}
      </div>
    </div>
  );
}
```

### Required vs. Optional Fields

| Field Category | Visual Treatment | Behavior |
|---------------|-----------------|----------|
| Required, mapped | Green checkmark | Proceed allowed |
| Required, unmapped | Red indicator with label "Required" | Blocks proceed |
| Optional, mapped | Gray checkmark | Included in import |
| Optional, unmapped | No indicator | Skipped silently |
| Source column, skipped | Dimmed row | Not imported, shown in summary |

---

## 4. Step 3 — Preview & Validation

### Wireframe Description

The preview step shows a data table with the first 10-20 rows of mapped data. Column headers show the target field names. Cells with validation errors are highlighted in red with a tooltip showing the error. A summary bar above the table shows: "X rows valid, Y rows with errors, Z rows total." An inline edit button on each cell allows fix-in-place corrections. Below the table, a "Show all errors" expandable section lists every validation error grouped by type.

### Sample Row Preview

```tsx
// src/migration/components/PreviewValidationStep.tsx
interface PreviewRow {
  rowNumber: number;
  data: Record<string, string>;
  errors: ValidationError[];
  status: 'valid' | 'warning' | 'error';
}

function PreviewTable({ rows, onCellEdit }: { rows: PreviewRow[]; onCellEdit: CellEditHandler }) {
  return (
    <div className="preview-table-container">
      <div className="preview-summary" role="status">
        <span className="summary-valid">
          {rows.filter(r => r.status === 'valid').length} rows valid
        </span>
        <span className="summary-warning">
          {rows.filter(r => r.status === 'warning').length} rows with warnings
        </span>
        <span className="summary-error">
          {rows.filter(r => r.status === 'error').length} rows with errors
        </span>
      </div>

      <table className="preview-table" role="grid" aria-label="Import data preview">
        <thead>
          <tr>
            <th scope="col">Row</th>
            {Object.keys(rows[0]?.data || {}).map(col => (
              <th key={col} scope="col">{col}</th>
            ))}
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.rowNumber} className={`preview-row--${row.status}`}>
              <td>{row.rowNumber}</td>
              {Object.entries(row.data).map(([col, value]) => {
                const cellError = row.errors.find(e => e.field === col);
                return (
                  <td
                    key={col}
                    className={cellError ? 'cell--error' : ''}
                    title={cellError?.message}
                  >
                    <EditableCell
                      value={value}
                      error={cellError}
                      onEdit={(newValue) => onCellEdit(row.rowNumber, col, newValue)}
                    />
                  </td>
                );
              })}
              <td>
                <StatusBadge status={row.status} errorCount={row.errors.length} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Error Highlighting

```typescript
// src/migration/services/row-validator.ts
interface ValidationError {
  rowNumber: number;
  field: string;
  value: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export function validateRow(
  row: Record<string, string>,
  rowNumber: number,
  schema: TargetField[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of schema) {
    const value = row[field.name];

    // Required field missing
    if (field.required && (!value || value.trim() === '')) {
      errors.push({
        rowNumber,
        field: field.name,
        value: value || '',
        rule: 'required',
        message: `${field.label} is required`,
        severity: 'error',
      });
      continue;
    }

    if (!value) continue;

    // Type validation
    if (field.type === 'email' && !isValidEmail(value)) {
      errors.push({
        rowNumber, field: field.name, value,
        rule: 'email_format',
        message: `"${value}" is not a valid email address`,
        severity: 'error',
        suggestion: extractEmailSuggestion(value),
      });
    }

    if (field.type === 'date' && !isValidDate(value)) {
      errors.push({
        rowNumber, field: field.name, value,
        rule: 'date_format',
        message: `"${value}" could not be parsed as a date. Expected formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY`,
        severity: 'error',
        suggestion: attemptDateParse(value),
      });
    }

    if (field.type === 'number' && isNaN(parseFloat(value))) {
      errors.push({
        rowNumber, field: field.name, value,
        rule: 'number_format',
        message: `"${value}" is not a valid number`,
        severity: 'error',
      });
    }

    // Length validation
    if (field.maxLength && value.length > field.maxLength) {
      errors.push({
        rowNumber, field: field.name, value,
        rule: 'max_length',
        message: `Value is ${value.length} characters, max is ${field.maxLength}. Will be truncated.`,
        severity: 'warning',
        suggestion: value.substring(0, field.maxLength),
      });
    }

    // Enum validation
    if (field.allowedValues && !field.allowedValues.includes(value)) {
      errors.push({
        rowNumber, field: field.name, value,
        rule: 'enum',
        message: `"${value}" is not a valid option. Allowed: ${field.allowedValues.join(', ')}`,
        severity: 'error',
        suggestion: findClosestEnum(value, field.allowedValues),
      });
    }
  }

  return errors;
}
```

### Fix-in-Place

The fix-in-place pattern allows customers to correct validation errors directly in the preview table without re-uploading the file. When a customer clicks an error cell, it becomes editable. On blur or Enter, the new value is re-validated in real time. If the fix resolves the error, the cell changes from red to green. The corrected value is stored in the import session and used during processing.

**UX rules for fix-in-place:**
- Only cells with errors are editable in the preview (prevents accidental changes to valid data)
- Fixes apply only to the preview sample — but the same fix can be "applied to all similar errors" via a bulk action
- Auto-suggestions appear inline: "Did you mean [suggestion]? Click to apply."
- A fix counter shows: "3 of 7 errors fixed in preview"

---

## 5. Step 4 — Processing

### Wireframe Description

The processing step shows a centered progress bar with percentage, record count (e.g., "4,200 of 10,000 records"), and estimated time remaining. Below the progress bar, a live log shows the most recent processing events (e.g., "Row 4,200: imported successfully"). A "Process in background" button allows the customer to leave the wizard and receive a notification when processing completes.

### Progress Bar

```tsx
// src/migration/components/ProcessingStep.tsx
interface ImportProgress {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  processedCount: number;
  totalCount: number;
  errorCount: number;
  skippedCount: number;
  startedAt: string;
  estimatedCompletionAt: string | null;
  currentBatch: number;
  totalBatches: number;
}

function ProcessingStep({ importId }: { importId: string }) {
  const progress = useImportProgress(importId); // WebSocket or SSE

  const percentComplete = Math.round(
    (progress.processedCount / progress.totalCount) * 100
  );

  return (
    <div className="processing-step">
      <h2>Importing your data...</h2>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${percentComplete}%` }}
            role="progressbar"
            aria-valuenow={percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="progress-stats">
          <span>{percentComplete}%</span>
          <span>
            {progress.processedCount.toLocaleString()} of{' '}
            {progress.totalCount.toLocaleString()} records
          </span>
          {progress.estimatedCompletionAt && (
            <span>ETA: {formatTimeRemaining(progress.estimatedCompletionAt)}</span>
          )}
        </div>
      </div>

      {progress.errorCount > 0 && (
        <div className="processing-errors" role="alert">
          <WarningIcon />
          {progress.errorCount} records skipped due to errors.
          These will be available in the error report.
        </div>
      )}

      <button
        className="btn-secondary"
        onClick={() => enableBackgroundProcessing(importId)}
      >
        Continue in background — we will notify you when it is done
      </button>
    </div>
  );
}
```

### Background Job

```typescript
// src/migration/workers/import-worker.ts
import { Queue, Worker } from '{{MIGRATION_QUEUE}}';

interface ImportJob {
  importId: string;
  userId: string;
  fileUrl: string;
  mappings: ColumnMatch[];
  options: ImportOptions;
}

const importQueue = new Queue('import-processing', {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400 }, // keep completed jobs for 24h
  },
});

const worker = new Worker('import-processing', async (job) => {
  const { importId, fileUrl, mappings, options } = job.data as ImportJob;

  const stream = await getFileStream(fileUrl);
  const parser = createParser(stream, mappings);
  let processed = 0;
  let errors = 0;

  for await (const batch of parser.batches(BATCH_SIZE)) {
    const result = await processBatch(importId, batch, options);
    processed += result.imported;
    errors += result.errors;

    await job.updateProgress({
      processedCount: processed,
      errorCount: errors,
      totalCount: parser.estimatedTotal,
    });
  }

  return { processed, errors, importId };
}, { concurrency: {{MIGRATION_WORKER_COUNT}} });
```

### Email Notification

<!-- IF {{IMPORT_NOTIFICATION_CHANNEL}} == "email" -->
When background processing completes, send an email with:
- Import result summary (imported / skipped / error counts)
- Link to results page in {{PROJECT_NAME}}
- Error report download link (if errors exist)
- "Get started" CTA linking to the onboarding flow
<!-- ENDIF -->

<!-- IF {{IMPORT_NOTIFICATION_CHANNEL}} == "both" -->
Send both in-app notification and email. In-app notification appears as a toast/banner when the customer next visits {{PROJECT_NAME}}. Email serves as a backup if the customer does not return to the app within 1 hour.
<!-- ENDIF -->

---

## 6. Step 5 — Results Summary

### Wireframe Description

The results summary step shows three large metric cards at the top: "Imported" (green, with count), "Skipped" (yellow, with count), "Errors" (red, with count). Below the cards, a detailed breakdown table shows errors grouped by type with affected row numbers. A "Download Error Report" button exports a CSV containing only the rows that failed, with an additional column showing the error reason. A "Download Full Report" button exports the complete import log. Primary CTA: "Go to your data" — links directly to the imported records in {{PROJECT_NAME}}.

```tsx
// src/migration/components/ResultsSummaryStep.tsx
interface ImportResult {
  importId: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  duration: number; // seconds
  errors: ImportError[];
  createdAt: string;
}

function ResultsSummaryStep({ result }: { result: ImportResult }) {
  return (
    <div className="results-summary">
      <h2>Import Complete</h2>
      <p className="results-summary__duration">
        Completed in {formatDuration(result.duration)}
      </p>

      <div className="metric-cards">
        <MetricCard
          label="Imported"
          count={result.importedCount}
          variant="success"
          icon={<CheckCircle />}
        />
        <MetricCard
          label="Skipped"
          count={result.skippedCount}
          variant="warning"
          icon={<SkipIcon />}
        />
        <MetricCard
          label="Errors"
          count={result.errorCount}
          variant="error"
          icon={<ErrorIcon />}
        />
      </div>

      {result.errorCount > 0 && (
        <ErrorBreakdown errors={result.errors} />
      )}

      <div className="results-actions">
        <a href={`/dashboard/imported/${result.importId}`} className="btn-primary">
          Go to your data
        </a>
        {result.errorCount > 0 && (
          <button
            className="btn-secondary"
            onClick={() => downloadErrorReport(result.importId)}
          >
            Download Error Report (CSV)
          </button>
        )}
        <button
          className="btn-tertiary"
          onClick={() => downloadFullReport(result.importId)}
        >
          Download Full Import Log
        </button>
      </div>
    </div>
  );
}
```

---

## 7. Error Handling Patterns

### Error Categories & User Messaging

| Error Category | Example | User Message | Action |
|---------------|---------|-------------|--------|
| File format | Corrupted XLSX | "This file appears to be damaged. Try exporting it again from your source application." | Re-upload |
| File too large | Exceeds {{MAX_IMPORT_SIZE}} | "File is [size], limit is [limit]. Split your data into multiple files or upgrade your plan." | Re-upload or upgrade |
| No data rows | Empty file or only headers | "This file contains no data rows. Make sure your data starts on row 2 (row 1 should be column headers)." | Re-upload |
| Missing required columns | Required field not mapped | "The following required fields are not mapped: [list]. Map them in the column mapping step." | Return to Step 2 |
| Validation errors (< 5%) | Email format, date parse | "97 of 2,000 rows have validation errors. Review them in the preview, or import the valid rows and download an error report." | Fix or skip |
| Validation errors (> 50%) | Wrong delimiter, wrong schema | "Most rows have errors. This usually means the file format does not match what we expected. Check that you are uploading the right file." | Re-upload |
| Processing timeout | Import exceeds time limit | "This import is taking longer than expected. We are processing it in the background and will email you when it is done." | Background processing |
| Duplicate detection | Records already exist | "42 records match existing data in your account. Choose: skip duplicates, update existing, or create new." | User choice |

### Global Error Boundary

```tsx
// src/migration/components/ImportErrorBoundary.tsx
class ImportErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    trackImportError({
      step: this.props.currentStep,
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="import-error-boundary" role="alert">
          <h2>Something went wrong with the import wizard</h2>
          <p>Your file has been saved. You can safely refresh and continue from where you left off.</p>
          <button onClick={() => window.location.reload()}>Refresh and Continue</button>
          <button onClick={() => this.props.onContactSupport()}>Contact Support</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 8. Accessibility Considerations

### WCAG 2.1 AA Compliance Checklist

- [ ] **Drop zone** has keyboard activation (Enter/Space) and screen reader announcement ("File upload area. Press Enter to browse files.")
- [ ] **Progress bar** uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label`
- [ ] **Error messages** use `role="alert"` or `aria-live="assertive"` so screen readers announce them immediately
- [ ] **Preview table** uses proper `<th>` with `scope` attributes and `role="grid"` for data grid navigation
- [ ] **Column mapping** dropdowns have associated labels and are navigable with keyboard
- [ ] **Status badges** (valid/warning/error) have text labels, not just color — never rely on color alone
- [ ] **Fix-in-place** cells announce their editable state ("Row 3, Email, error: invalid format. Press Enter to edit.")
- [ ] **Processing step** announces progress updates at reasonable intervals (every 10%, not every record)
- [ ] **Focus management** moves focus to the first actionable element when navigating between steps
- [ ] **Wizard navigation** supports both button clicks and keyboard shortcuts (Ctrl+Enter for next step)

### Color & Contrast

| State | Background | Text | Border | Contrast Ratio |
|-------|-----------|------|--------|----------------|
| Valid cell | `#f0fdf4` | `#166534` | `#86efac` | 7.1:1 |
| Warning cell | `#fffbeb` | `#92400e` | `#fcd34d` | 5.2:1 |
| Error cell | `#fef2f2` | `#991b1b` | `#fca5a5` | 7.0:1 |
| Unmapped column | `#f9fafb` | `#6b7280` | `#e5e7eb` | 4.6:1 |

### Screen Reader Flow

Each wizard step announces itself when entered: "Step 2 of 5: Column Mapping. 12 source columns detected, 8 automatically matched. 4 columns need manual mapping." This orientation message prevents screen reader users from losing context during step transitions.
