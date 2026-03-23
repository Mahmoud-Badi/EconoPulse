# Migration Support Runbook — Team Procedures & Troubleshooting

> When a customer's migration fails at 2 AM, your support team needs a playbook, not a prayer. This runbook equips agents with diagnosis steps, resolution procedures, and communication templates for every common migration failure mode.

---

## 1. Common Migration Issues

### Issue 1: File Upload Fails

**Symptoms:** Customer reports "Upload failed" or "File rejected" error. Progress never moves past Step 1.

**Diagnosis:**

```
1. Check file size:
   → If > {{MAX_IMPORT_SIZE}}: "Your file exceeds our size limit. Split it into smaller files."
   → If 0 bytes: "The file appears to be empty. Try re-exporting from your source."

2. Check file format:
   → If unsupported extension: "We support {{IMPORT_FORMATS}}. Your file is [format]."
   → If extension is correct but content is wrong (e.g., .csv that is actually Excel binary):
     "Try opening the file in a text editor. If you see garbled characters, re-export
      as CSV from your spreadsheet application."

3. Check network:
   → If timeout: "Large file uploads can time out on slow connections. Try a wired connection
      or upload during off-peak hours."
   → If CORS error in browser console: Escalate to engineering.

4. Check browser:
   → If Safari + large file: Known issue with Safari blob handling. Suggest Chrome/Firefox.
```

**Resolution:** Guide customer through re-upload with corrected file. If persistent, collect file sample (first 10 rows) and escalate.

---

### Issue 2: Column Mapping Auto-Detection Fails

**Symptoms:** Customer reports that column mapping shows "No matches found" or maps fields incorrectly.

**Diagnosis:**

```
1. Check column headers:
   → Non-English headers: Auto-detection only works with English column names.
     Customer must map manually.
   → No header row: Customer's file starts with data on row 1.
     Guide them to check "My file has no header row" option.
   → Headers with special characters: Encodings issues with header row.
     Ask customer to simplify headers to plain ASCII.

2. Check for competitor-specific format:
   → If customer exported from {{COMPETITOR_IMPORTERS}}: They should select
     the competitor in Step 1 for pre-configured mappings.
   → If unknown competitor: Manual mapping required.

3. Check for multi-sheet Excel:
   → Some customers upload multi-sheet workbooks. Only the first sheet is read.
     Guide them to move target data to the first sheet or export as CSV.
```

**Resolution:** Walk customer through manual mapping. If their source has unusual column names, suggest they rename columns to match standard names (email, phone, name, etc.) and re-upload.

---

### Issue 3: High Validation Error Rate (>30%)

**Symptoms:** Preview step shows most rows have errors. Customer reports "Almost nothing validated."

**Diagnosis:**

```
1. Wrong file uploaded:
   → Ask: "Are you sure this is the right file? What type of data does it contain?"
   → Common: Customer uploaded the wrong export, or an export from a different
     section of their source tool.

2. Wrong delimiter:
   → If all data appears in one column: Delimiter detection failed.
     Ask customer what delimiter their file uses (comma, semicolon, tab).
   → European CSV files often use semicolons. System should auto-detect,
     but edge cases exist.

3. Date format mismatch:
   → If most errors are date-related: Ask customer's locale.
     European dates (DD/MM/YYYY) may be misinterpreted as US (MM/DD/YYYY).

4. Encoding issues:
   → If errors mention "invalid characters": File encoding is not UTF-8.
     Ask customer to re-export with UTF-8 encoding.
     In Excel: Save As → CSV UTF-8 (comma delimited).

5. Schema mismatch:
   → If customer is importing data that does not match any expected entity type:
     They may need a different import template or a custom import.
```

**Resolution:** Identify root cause from the pattern of errors. Most commonly, it is a wrong file, wrong delimiter, or date format issue. Guide customer to fix and re-upload.

---

### Issue 4: Import Stuck at Processing

**Symptoms:** Progress bar stopped moving. No errors shown. Customer has been waiting 30+ minutes with no change.

**Diagnosis:**

```
1. Check job status in admin dashboard:
   → Job status = "processing": Worker may be alive but slow. Check DB latency.
   → Job status = "queued": Worker pool may be exhausted. Check worker health.
   → Job status = "failed": Job failed silently. Check worker logs for errors.
   → Job not found: Job was never enqueued. Check API logs for enqueue failure.

2. Check worker health:
   → All workers busy: Import is waiting in queue. Provide ETA based on queue position.
   → Workers crashed: Restart worker pool. Re-queue the stuck job.
   → Workers OOM killed: File may be too large for current chunk size.
     Reduce chunk size and retry.

3. Check database:
   → High write latency: Database is under pressure. Import may complete but slowly.
   → Connection pool exhausted: Other operations are consuming connections.
     May need to wait or increase pool size.
   → Lock contention: Import is blocking on database locks. Check for concurrent imports
     on the same table.
```

**Resolution:**

| Root Cause | Action | Customer Communication |
|-----------|--------|----------------------|
| Job queued (busy workers) | Wait | "Your import is in queue. Estimated start: [time]" |
| Worker crashed | Restart + re-queue | "We detected a processing issue and are retrying your import automatically" |
| DB slow | Monitor | "Your import is processing but slower than usual. We are monitoring it." |
| Job failed silently | Investigate logs, re-queue | "We are looking into a processing issue. We will update you within 1 hour." |

---

### Issue 5: Partial Import (Some Records Failed)

**Symptoms:** Import completes but error count is significant. Customer asks "Where are my missing records?"

**Diagnosis:**

```
1. Download error report:
   → Guide customer to Step 5 results → "Download Error Report"
   → Review error types: most common are validation failures and duplicate detection

2. Common error patterns:
   → "Required field missing": Source data is incomplete. Customer must add missing data.
   → "Duplicate detected": Records already exist from a previous import or manual entry.
   → "Invalid email format": Malformed email addresses in source data.
   → "Foreign key not found": Parent record (e.g., organization) was not imported.
     Check if parent entity import also had errors.

3. Reconciliation:
   → Compare source record count with: imported + skipped + errors = total
   → If numbers do not add up: escalate to engineering with import ID
```

**Resolution:** Provide error report. Walk customer through fixing errors in their source file and re-importing only the failed rows.

---

### Issue 6: Data Looks Wrong After Import

**Symptoms:** Import completed "successfully" but data appears garbled, in wrong fields, or with wrong values.

**Diagnosis:**

```
1. Encoding corruption:
   → If accented characters are wrong (ä → Ã¤): Encoding detection failed.
     Re-import with explicit UTF-8 encoding.

2. Column misalignment:
   → If data is in wrong fields: Column mapping was incorrect.
     Customer may have accepted auto-detection without verifying.
     Rollback and re-import with corrected mapping.

3. Date interpretation:
   → If dates are wrong by a month (e.g., Jan 3 instead of Mar 1):
     MM/DD vs DD/MM ambiguity. Rollback and re-import with explicit date format.

4. Currency values:
   → If amounts are 100x too large or too small: Decimal point handling.
     Source used cents, system expected dollars (or vice versa).
     Rollback and re-import with corrected currency settings.

5. HTML in text fields:
   → If notes contain <p> tags: HTML-to-markdown conversion failed or was skipped.
     Check if source exports HTML and transformation is configured.
```

**Resolution:** Rollback the import (if within {{ROLLBACK_WINDOW_HOURS}} hour window) and re-import with corrected settings. If outside rollback window, escalate to engineering for manual correction.

---

### Issue 7: API Migration OAuth Connection Fails

**Symptoms:** Customer clicks "Connect to [Competitor]" but authorization fails or returns an error.

**Diagnosis:**

```
1. Competitor API is down:
   → Check competitor's status page.
   → If down: "The [Competitor] API is currently experiencing issues.
     Please try again later. We will monitor and notify you when it is available."

2. Insufficient permissions:
   → Customer's account in competitor may not have API access (free tier, restricted role).
   → "Your [Competitor] account needs API access enabled.
     Contact [Competitor] support or upgrade your plan."

3. OAuth token expired:
   → If customer previously connected but connection stopped working:
     "Your authorization has expired. Please disconnect and reconnect your [Competitor] account."

4. Our OAuth credentials invalid:
   → If ALL customers are failing: Our OAuth app credentials may have been revoked.
     Escalate to engineering immediately (P1).
```

---

## 2. Escalation Matrix

| Severity | Criteria | Response Time | Escalation Path |
|----------|---------|---------------|-----------------|
| **P1 — Critical** | All imports failing, data loss, security incident | 15 minutes | Support Lead → Engineering On-Call → VP Engineering |
| **P2 — High** | Single large customer blocked, white-glove migration failing | 1 hour | Support Lead → Migration Engineering |
| **P3 — Medium** | Import errors affecting < 10% of records, performance degradation | 4 hours | Senior Support Agent → Migration Engineering |
| **P4 — Low** | UI glitch, documentation question, feature request | 24 hours | Support Agent (handle directly) |

### When to Escalate

- [ ] Customer has been waiting more than 2 hours with no progress
- [ ] Error rate exceeds 50% and diagnosis does not identify a customer-fixable cause
- [ ] Data corruption is suspected (imported data does not match source)
- [ ] Multiple customers report the same issue simultaneously
- [ ] API migration fails for all customers of a specific competitor
- [ ] Rollback fails or is only partially successful
- [ ] Customer is on an enterprise plan or in active sales process

---

## 3. Customer Communication Templates

### Template: Import Started

```
Subject: Your data import has started

Hi [Name],

We have received your file and started processing your import.

Import details:
- File: [filename]
- Records detected: [count]
- Estimated completion: [time]

You can track progress in real time at: [progress_url]

We will email you when the import is complete. You do not need to keep the page open.

Best,
{{PROJECT_NAME}} Team
```

### Template: Import Complete (Success)

```
Subject: Your import is complete — [count] records imported

Hi [Name],

Great news — your data import finished successfully.

Results:
- Imported: [imported_count] records
- Skipped (duplicates): [skipped_count] records
- Errors: [error_count] records

[IF errors > 0]
We were unable to import [error_count] records due to data formatting issues.
Download the error report to see what needs fixing: [error_report_url]

You can fix these records and re-import just the failed rows.
[ENDIF]

View your imported data: [dashboard_url]

If anything looks wrong, you can undo this import within the next
{{ROLLBACK_WINDOW_HOURS}} hours from Settings > Import History.

Best,
{{PROJECT_NAME}} Team
```

### Template: Import Failed

```
Subject: We need your help with your data import

Hi [Name],

Your data import was unable to complete. Here is what happened:

Error: [error_description]

What you can do:
1. [Specific fix based on error type]
2. Try re-uploading your file: [import_url]
3. Reply to this email if you need help — we are here for you.

No partial data was imported — your account is unchanged.

Best,
{{PROJECT_NAME}} Team
```

### Template: Rollback Confirmation

```
Subject: Your import has been rolled back

Hi [Name],

As requested, we have undone your data import from [date].

Summary:
- [deleted_count] records removed
- [files_count] files removed
- Your account is back to its pre-import state

You can start a new import at any time: [import_url]

If you need help preparing your data, reply to this email and we will assist.

Best,
{{PROJECT_NAME}} Team
```

### Template: White-Glove Migration Kickoff

```
Subject: Your dedicated migration — let's get started

Hi [Name],

Welcome! I am [Agent Name], your dedicated migration specialist. I will personally
handle your data migration from [Competitor] to {{PROJECT_NAME}}.

Here is what happens next:

1. We schedule a 30-minute kickoff call to understand your data and requirements
2. You provide access to your [Competitor] account (or export your data)
3. I migrate your data, validate it, and send you a preview
4. You review and approve — then you are live on {{PROJECT_NAME}}

Typical timeline: 3-5 business days from kickoff to go-live.

Can you suggest a few times that work for the kickoff call?

Best,
[Agent Name]
Migration Specialist, {{PROJECT_NAME}}
```

---

## 4. Emergency Rollback Procedure

When a migration must be rolled back urgently (data corruption discovered, wrong data imported, customer demands immediate reversal):

- [ ] Confirm the import ID with the customer
- [ ] Verify the import is within the {{ROLLBACK_WINDOW_HOURS}}-hour rollback window
- [ ] Navigate to Admin Dashboard > Imports > [Import ID] > Rollback
- [ ] Click "Initiate Rollback" — this requires admin-level permissions
- [ ] Monitor rollback progress (typically completes in under 5 minutes)
- [ ] Verify rollback success: check that record counts match pre-import state
- [ ] Send rollback confirmation email to customer
- [ ] If rollback fails or is partial: escalate to Engineering immediately (P1)

**If outside the rollback window:** The customer must contact support to request a manual data removal. Engineering will create a targeted deletion script. Expected turnaround: 1-2 business days.

---

## 5. Data Recovery Steps

When data is lost or corrupted during migration and rollback is not available:

1. **Check import staging data:** Staging tables retain source data for {{ROLLBACK_WINDOW_HOURS}} hours. If still available, data can be re-extracted from staging.

2. **Check source file:** The original uploaded file is stored in object storage for {{ROLLBACK_WINDOW_HOURS}} hours. It can be downloaded from Admin > Imports > [ID] > Source File.

3. **Check database backups:** If staging data has been purged, database point-in-time recovery may be needed. This is an Engineering operation.

4. **Customer has source:** The customer likely still has the original file they uploaded. A fresh import with corrected settings is the simplest recovery path.

---

## 6. Post-Migration Verification Checklist

After every migration (especially white-glove), walk through this checklist with the customer:

- [ ] Record counts match expectations (customer confirms approximate total)
- [ ] Sample 5-10 records and verify field values look correct
- [ ] Dates display correctly (check at least one date field)
- [ ] Phone numbers are formatted correctly
- [ ] Currency amounts are correct (no off-by-100x errors)
- [ ] Relationships are intact (e.g., contacts linked to correct organizations)
- [ ] Custom fields appear and contain data
- [ ] Attachments/files are accessible (if applicable)
- [ ] Tags/labels transferred correctly
- [ ] No obvious duplicates in the imported data
- [ ] Customer can search for and find their imported records
- [ ] Imported data appears correctly in reports/dashboards

---

## 7. FAQ for Support Agents

**Q: A customer wants to import data from a competitor we do not have a dedicated importer for.**
A: Guide them to use the generic CSV import. Most tools can export to CSV. Help them with column mapping. If multiple customers request the same competitor, log a feature request for a dedicated importer.

**Q: A customer wants to import more records than the {{IMPORT_RECORD_LIMIT}} limit.**
A: Split the file into batches under the limit. Each batch can be imported separately. The system handles deduplication across batches. If the customer is on a plan that supports higher limits, verify their plan tier.

**Q: A customer imported data twice by accident and now has duplicates.**
A: If within the rollback window, rollback the second import. If outside the window, use the deduplication tool in Admin > Data Cleanup. Match on email or external_id to identify duplicates.

**Q: A customer wants to import data with HTML formatting. Will it be preserved?**
A: HTML is converted to Markdown during import. Bold, italic, links, and lists are preserved. Tables and complex HTML may lose formatting. The customer can review converted notes post-import.

**Q: An API migration is running very slowly.**
A: API migrations are throttled by the competitor's rate limits, not ours. Check the migration progress page for rate limit warnings. Average speed: 500-2000 records per minute depending on the competitor's API. Large migrations may take several hours.

**Q: A customer requests that we permanently delete their imported data for GDPR compliance.**
A: Initiate a rollback if within the window. If outside the window, file a GDPR data deletion request following the procedure in the data privacy section. All staging data, source files, and hash tables must also be purged.

**Q: The customer's file has more columns than we have fields. What happens to the extra columns?**
A: Columns marked as "Skip" in the mapping step are not imported. If the customer wants to keep the data, suggest mapping extra columns to custom fields. Custom fields are created automatically during import.

**Q: A customer from a non-English speaking country has encoding issues with their file.**
A: The system auto-detects encoding, but it can fail with mixed-encoding files. Ask the customer to re-export using UTF-8 encoding. In Excel: File > Save As > choose "CSV UTF-8 (comma delimited)". In Google Sheets: File > Download > CSV (always UTF-8).
