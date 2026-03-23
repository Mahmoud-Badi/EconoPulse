# Migration Gotchas — Production Lessons

> Eighteen lessons from teams that shipped migration features and discovered the hard way that real-world data does not read the documentation. Organized by severity because some of these will corrupt your database and some will just embarrass you.

---

## Overview

Migration is where your beautiful, well-typed data model meets the chaos of the real world. Every gotcha in this file has caused production incidents, customer escalations, or silent data corruption at real companies. They are organized by severity:

- **CRITICAL** — Data loss, corruption, or security incident. Must be addressed before launch.
- **HIGH** — Significant customer impact. Will cause support escalations within the first week.
- **MEDIUM** — Noticeable issues that degrade the migration experience but do not lose data.
- **LOW** — Minor annoyances that become apparent over time.

**When to read this:** Before building your migration system. Revisit before launch. Read again after your first 50 production migrations.

---

## Gotcha 1: The BOM That Ate Your First Column

**Severity: CRITICAL**

**What happens:** Customers upload CSV files exported from Excel using "Save as CSV (UTF-8)." The import succeeds, but the first column's header is silently mangled. Instead of `email`, the header is `\uFEFFemail` — a UTF-8 Byte Order Mark (BOM) prepended to the first bytes of the file. Column auto-detection fails for the first column. Required field validation fails because `\uFEFFemail` does not match `email`. Customer sees "email is required" despite email being present in every row.

**Why it happens:** Excel on Windows adds a BOM (0xEF 0xBB 0xBF) when saving as "CSV UTF-8." The BOM is invisible in text editors and most CSV viewers. Your CSV parser reads it as part of the first column name. String comparison fails because `"\uFEFFemail" !== "email"`.

**How to prevent it:**
- Strip BOM from the first 3 bytes of every uploaded file before parsing
- Test your import with a file saved from Excel on Windows as "CSV UTF-8"
- Test with files from Excel on Mac (no BOM) and Google Sheets (no BOM) to verify both paths work
- Add BOM detection to your encoding detection pipeline — it is the strongest encoding signal

**Cross-ref:** `csv-import-architecture.template.md` — Encoding Detection & Handling

---

## Gotcha 2: The Date That Could Be Two Dates

**Severity: CRITICAL**

**What happens:** A customer imports a file with the date `01/02/2024`. Your system interprets it as January 2, 2024 (US format). The customer meant February 1, 2024 (European format). Every date in their import is wrong by up to 11 months. They discover this weeks later when a report shows deals closing in the wrong months. By then, the rollback window has expired.

**Why it happens:** The date `01/02/2024` is genuinely ambiguous. Both MM/DD/YYYY and DD/MM/YYYY are valid interpretations when both numbers are <= 12. Your system cannot tell which format was intended without additional context. Defaulting to one format and hoping for the best guarantees that some customers will get wrong dates.

**How to prevent it:**
- In the preview step, show parsed dates with explicit format: "We interpreted this as January 2, 2024 (MM/DD/YYYY). Is this correct?"
- Use the customer's locale/timezone as a hint (European customers → DD/MM/YYYY)
- If any date in the sample has a day value > 12, that resolves the ambiguity for the entire file — use it
- Store the original string alongside the parsed date during the rollback window so customers can verify
- For API migrations, always request ISO 8601 dates from the API — never accept locale-formatted dates

**Cross-ref:** `data-cleansing-rules.template.md` — Date Standardization

---

## Gotcha 3: Cascading Deletes During Rollback

**Severity: CRITICAL**

**What happens:** A customer requests a rollback. Your rollback procedure deletes imported contacts. But those contacts were already linked to deals, tasks, notes, and activities created after the migration — records the customer created manually post-import. The cascading delete removes not only the imported contacts but everything that referenced them. The customer loses both imported data and data they created after migration.

**Why it happens:** Foreign key constraints with `ON DELETE CASCADE` are convenient during development but dangerous during rollback. Rollback should only remove records from the import batch, not records that depend on imported records.

**How to prevent it:**
- Never use `ON DELETE CASCADE` on tables that hold imported data
- Rollback procedure should only delete records where `import_batch_id = [importId]`
- Before rollback, check for post-import records that reference imported records and warn the customer
- Offer "soft rollback" — mark imported records as archived rather than deleting them
- Test rollback with a realistic scenario: import records, create manual records that reference them, then rollback

**Cross-ref:** `migration-validation-rollback.template.md` — Rollback Procedure

---

## Gotcha 4: The 2GB CSV That Killed Your Server

**Severity: HIGH**

**What happens:** A customer uploads a 2GB CSV file. Your import worker loads the entire file into memory, parses it into an array of objects, and runs out of memory. The Node.js process crashes with a heap allocation failure. If you are running a single worker, all imports stop. If the worker auto-restarts, it picks up the same job and crashes again in an infinite loop.

**Why it happens:** In-memory CSV parsing (e.g., `csv-parse/sync`, `papaparse` with `complete` callback) loads the entire file before processing any rows. A 2GB CSV with 10 columns easily produces 5-8GB of parsed JavaScript objects (strings in V8 are UTF-16 = 2x the bytes, plus object overhead).

**How to prevent it:**
- Always use streaming parsers (`csv-parse` in streaming mode, not sync mode)
- Set `max_record_size` to prevent individual rows from consuming unbounded memory
- Process in fixed-size batches (500-2000 rows) and flush each batch before reading the next
- Set a memory limit per worker process and handle OOM gracefully (kill + re-queue with smaller chunk size)
- Enforce `{{MAX_IMPORT_SIZE}}` at the upload step — before the file reaches the worker
- For files approaching the size limit, use resumable uploads (tus protocol or multipart)

**Cross-ref:** `bulk-import-architecture.template.md` — Worker Configuration

---

## Gotcha 5: Referential Integrity During Partial Imports

**Severity: HIGH**

**What happens:** A customer imports contacts and deals. The contact import succeeds but the deal import fails partway through. Now you have deals referencing contacts that were imported and deals referencing contacts that were not — because the contact file had errors and some contacts were skipped. The customer's CRM shows deals with "Unknown Contact" or broken links.

**Why it happens:** Multi-entity imports create a dependency chain. If entity A (contacts) partially fails, entity B (deals) inherits orphaned references. Most import systems process entities sequentially but do not roll back earlier entities when later entities fail.

**How to prevent it:**
- Build a foreign key resolution map during import and track resolved vs. unresolved references
- When a child record references a parent that was not imported, flag it as an orphan — do not silently insert with a null reference
- Offer the customer a choice: "47 deals reference contacts that were not imported. Skip these deals, import with blank contact, or fix contacts and re-import?"
- Consider importing all entities in a single transaction (for small imports) or providing per-entity rollback controls (for large imports)

**Cross-ref:** `data-mapping-transformation.template.md` — Relationship Mapping

---

## Gotcha 6: Excel Date Serial Numbers

**Severity: HIGH**

**What happens:** A customer exports from Excel. The date column contains numbers like `45292` instead of `2024-01-01`. Your system tries to parse `45292` as a date string, fails, and reports a validation error for every row. The customer insists "the dates are correct in my spreadsheet."

**Why it happens:** Excel stores dates internally as serial numbers (days since January 1, 1900). When Excel exports to CSV, it sometimes writes the serial number instead of the formatted date, especially when the column is formatted as "General" rather than "Date" or when the export is automated.

**How to prevent it:**
- Detect Excel serial numbers: any 5-digit number in a date column between 1 and 100000
- Convert using the formula: `new Date(1899, 11, 30 + serialNumber)`
- Note the Excel 1900 leap year bug: Excel incorrectly considers 1900 a leap year. Dates before March 1, 1900 are off by one day. For modern data this is irrelevant.
- When serial numbers are detected, show the conversion in the preview: "45292 → 2024-01-01. Does this look correct?"

**Cross-ref:** `data-mapping-transformation.template.md` — Field Transformation Rules

---

## Gotcha 7: CSV Delimiter Detection Gone Wrong

**Severity: HIGH**

**What happens:** A German customer uploads a CSV file. Your delimiter detection picks comma as the delimiter. But German CSVs use semicolons as delimiters because commas are used as decimal separators in German locale (1.234,56 instead of 1,234.56). Every row is parsed as a single field containing the entire line. Column mapping shows one column with all the data concatenated.

**Why it happens:** "CSV" literally stands for "Comma-Separated Values," but in practice the delimiter varies by locale. European tools (Excel DE/FR/IT/ES, SAP, many EU enterprise systems) export with semicolons. Tab-separated files (.tsv) use tabs. Pipe-delimited files use `|`. Your delimiter detection algorithm may pick the wrong one if it only checks for commas.

**How to prevent it:**
- Test multiple delimiters against the first 5-10 rows and pick the one with the highest column-count consistency
- Give extra weight to semicolons for files with European-looking content (commas in numbers, accented characters)
- Allow the customer to override delimiter in the upload step: "Not parsing correctly? Try: Comma / Semicolon / Tab / Other"
- If delimiter detection confidence is below 80%, show the customer a preview and ask them to confirm

**Cross-ref:** `csv-import-architecture.template.md` — Encoding Detection & Handling

---

## Gotcha 8: Progress Tracking That Lies

**Severity: MEDIUM**

**What happens:** The progress bar reaches 95% in 2 minutes and then sits there for 20 minutes. The customer thinks the import is stuck, refreshes the page, starts a new import, or contacts support. In reality, the last 5% involves writing to the database (which is slower than parsing), building indexes, and running post-import validation.

**Why it happens:** Progress is measured by rows parsed, not rows written. Parsing is CPU-bound and fast. Database writes are I/O-bound and slower. The first 95% of parsing completes quickly, but the final database flush, index rebuild, and validation step take most of the total wall-clock time. The progress bar reflects work done, not time remaining.

**How to prevent it:**
- Use a multi-phase progress model: "Parsing: 100% → Writing: 45% → Validating: 0%"
- Weight phases by actual time, not row count (parsing = 30% of time, writing = 50%, validation = 20%)
- ETA calculation should use time-based rate estimation, not row-count extrapolation
- Never show a progress bar that goes backward — if you overestimate, cap at the current percentage

**Cross-ref:** `migration-progress-tracking.template.md` — ETA Calculation Algorithm

---

## Gotcha 9: Customer Expectation Mismatch

**Severity: MEDIUM**

**What happens:** A customer migrates from Competitor X. Their export contains 50,000 records. Your import wizard shows "50,000 records imported successfully." The customer opens your product and says "Where are my reports? Where are my dashboards? Where are my automation rules?" They expected migration to include not just data but also configuration, automations, and customizations.

**Why it happens:** "Migration" means different things to different people. To an engineer, it means data transfer. To a customer, it means "my entire setup moves to the new product." Configuration, automation rules, integrations, and custom workflows are not data — they cannot be imported via CSV. But customers do not make this distinction.

**How to prevent it:**
- Explicitly list what migrates and what does not in the import wizard intro screen
- Competitor switch playbooks should include a "What does not migrate" section
- Post-migration onboarding should guide the customer through re-creating configurations
- For white-glove migrations, include a configuration review step where the specialist helps re-create key automations
- Set expectations in sales conversations — never say "we will migrate everything"

**Cross-ref:** `competitor-switch-playbook.template.md` — Missing Feature Handling

---

## Gotcha 10: Timezone Handling Across Source and Target

**Severity: MEDIUM**

**What happens:** A customer in Berlin (UTC+1) imports data exported from a competitor in UTC. Activity timestamps shift by 1 hour. A meeting logged at 2:00 PM Berlin time now shows as 1:00 PM. Over a year of data, some dates even shift to the previous day (midnight + timezone offset). Reports grouped by day show different numbers than the source system.

**Why it happens:** Timestamps without timezone information are ambiguous. The source system may store in UTC but display in local time. The exported CSV contains the display time (2:00 PM) but your system interprets it as UTC (2:00 PM UTC = 3:00 PM Berlin). Or vice versa. Neither system is "wrong" — they just disagree about what the naked timestamp means.

**How to prevent it:**
- During import setup, ask the customer: "What timezone was your data exported in?"
- For API migrations, always request timestamps in UTC with explicit timezone offset
- Store all imported timestamps in UTC internally, convert for display
- In the preview step, show at least one timestamp with the detected timezone for customer verification
- If the source is a known competitor, document their timezone handling in the competitor playbook

---

## Gotcha 11: Duplicate Detection Across Multiple Imports

**Severity: MEDIUM**

**What happens:** A customer imports their contacts on Monday. On Wednesday, they export contacts again from the competitor (which now includes 50 new contacts) and import the full file again. Your system does not detect duplicates across import batches and creates 50,000 duplicate contacts plus 50 new ones. The customer now has 100,050 contacts instead of 50,050.

**Why it happens:** Most duplicate detection only checks within a single import batch, not against existing data. The deduplication logic looks for duplicates among the rows being imported, not between the imported rows and the rows already in the database.

**How to prevent it:**
- Always check for duplicates against existing database records, not just within the current batch
- Use a stable natural key (email, external_id) for duplicate detection across imports
- Default behavior should be "skip existing" rather than "create new" to prevent accidental duplication
- Show a pre-import summary: "We found 49,950 records that already exist in your account. They will be skipped. 50 new records will be imported."
- Maintain import history so the customer (and support) can see what was previously imported

---

## Gotcha 12: Migration as Onboarding Friction

**Severity: MEDIUM**

**What happens:** Your marketing says "Try it free, import your data in minutes." A customer signs up, hits the import wizard, encounters a column mapping error they do not understand, and leaves. They never experience your product because migration friction blocked onboarding. Your funnel analytics show 40% drop-off at the import step.

**Why it happens:** Migration is often the first complex interaction a new customer has with your product. If the experience is confusing, technically demanding, or error-prone, it creates a negative first impression that no amount of product quality can overcome. The customer does not blame their data — they blame your product.

**How to prevent it:**
- Make migration optional during onboarding — let customers explore the product with sample data first
- Offer a "try later" option that saves the uploaded file and lets them return to import after exploring
- For known competitors, provide one-click templates that eliminate column mapping entirely
- Track import wizard abandonment as a product metric, not just a support metric
- For customers who abandon import, trigger an email with a "Need help importing?" CTA and a link to book an assisted migration call
- Consider offering "we will do it for you" as a free service for the first 30 days — the LTV from a successfully migrated customer justifies the cost

---

## Gotcha 13: GDPR and Data Privacy During Migration

**Severity: HIGH**

**What happens:** A customer in the EU imports their CRM data into your product. The data includes names, emails, phone numbers, and notes that reference health conditions ("Client mentioned diabetes medication schedule"). Your system stores the uploaded file in an S3 bucket in us-east-1 for processing. You have now transferred EU personal data to the US without adequate safeguards. The import staging tables store PII indefinitely because nobody configured retention policies.

**Why it happens:** Migration is a data processing operation that falls under GDPR, CCPA, and other privacy regulations. Most migration implementations focus on technical correctness and ignore data residency, retention, and consent requirements.

**How to prevent it:**
- Process and store migration data in the same region as the customer's account
- Set explicit retention periods for staging data, source files, error reports, and hash tables
- Clean up all migration artifacts when the rollback window expires
- Log data processing activities for migration in your GDPR Article 30 records
- If the import file contains sensitive data categories (health, financial, biometric), flag it and apply additional protections
- Include a data processing notice in the import wizard: "Your data will be processed in [region] and temporary copies will be deleted after [hours]."
- Ensure your DPA (Data Processing Agreement) covers migration as a data processing activity

---

## Gotcha 14: Competitor API Rate Limits During Peak Migration

**Severity: MEDIUM**

**What happens:** You launch a marketing campaign: "Switch from [Competitor] this week and get 3 months free." Fifty customers start API-based migrations simultaneously. Your migration workers collectively hit the competitor's API 500 times per second. The competitor rate-limits your OAuth app. All 50 migrations fail or stall. Customers blame you, not the competitor.

**Why it happens:** Competitor APIs enforce rate limits per OAuth application, not per end-user. When multiple customers migrate simultaneously, they all share your app's rate limit quota. A rate limit that comfortably handles one migration becomes a bottleneck when 50 run concurrently.

**How to prevent it:**
- Implement a global rate limiter that tracks API usage across all concurrent migrations, not just per-migration
- Queue API migrations with concurrency limits: max 3-5 concurrent API migrations per competitor
- During marketing campaigns, pre-warn the migration team and increase worker capacity
- Have a fallback: if API migration is rate-limited, offer CSV import as an alternative
- Monitor competitor API response times and 429 rates as a system health metric

---

## Gotcha 15: Historical Data Volume Surprises

**Severity: MEDIUM**

**What happens:** A customer selects `{{HISTORICAL_DATA_POLICY}}` = "full history" for their migration. You estimate 50,000 contacts. The migration runs and discovers 50,000 contacts with 2 million activities (emails sent, calls logged, notes added over 8 years). Your import ETA was 10 minutes. Actual time: 6 hours. The customer's account storage usage spikes from 100MB to 15GB. Your per-customer storage cost calculation is suddenly wrong.

**Why it happens:** Record counts for the primary entity (contacts, deals) are poor predictors of total data volume. Related entities (activities, notes, attachments) often outnumber primary entities 10:1 to 100:1. Historical data from long-running accounts can be orders of magnitude larger than expected.

**How to prevent it:**
- During migration setup, scan the source for total record counts across all entity types before starting
- Show the customer a breakdown: "50,000 contacts, 2M activities, 500K notes. Estimated time: 6 hours. Storage: 15GB."
- Let the customer choose per-entity: "Import contacts and deals. Skip activities older than 12 months."
- Set storage alerts for post-migration usage spikes
- Price migration-related storage separately from regular usage if needed

---

## Gotcha 16: Field Truncation on Schema Mismatch

**Severity: HIGH**

**What happens:** The competitor allows 10,000 characters in their "notes" field. Your schema limits notes to 2,000 characters. During import, notes are silently truncated to fit the schema constraint. The customer discovers weeks later that detailed notes from important deals are missing their second half. The truncated data is not recoverable because the staging data was already purged.

**Why it happens:** Schema constraints differ between systems. Character limits, field sizes, and precision constraints are rarely identical. Silent truncation — inserting only the portion that fits — is the default behavior for many databases and ORMs.

**How to prevent it:**
- During mapping validation, compare source field lengths against target schema limits
- If any source field exceeds the target limit, warn the customer before import: "47 notes exceed our 2,000 character limit and will be truncated."
- Offer alternatives: split long content into multiple records, store overflow in a custom field, or increase your schema limit
- Never silently truncate — always report truncation in the error/warning report with the character count
- Consider using TEXT fields (unlimited) instead of VARCHAR(N) for free-form content fields in your schema

---

## Gotcha 17: The Import That Worked Perfectly in Staging

**Severity: LOW**

**What happens:** Your migration system works flawlessly in staging with your test data. You launch to production. The first real customer imports a file with 47 different date formats, names in Cyrillic and Arabic script, phone numbers with letters ("Call after 3pm"), email fields containing three comma-separated emails, and an "Amount" column where one row says "TBD."

**Why it happens:** Test data is clean because you created it. Real data is messy because humans created it over years with no consistency enforcement. Your test file has 100 perfectly formatted rows. The real file has 10,000 rows accumulated over 5 years by 30 different users with different conventions.

**How to prevent it:**
- Before launch, obtain real export files from 5-10 prospective customers (with their permission and PII redacted)
- Test with files from different competitors, different locales, and different Excel versions
- Include adversarial test cases: mixed encodings within a single file, BOM in the middle (from concatenated files), rows with 0 columns and rows with 100 columns
- Monkey-test your import wizard with randomly generated CSV garbage
- Plan for a "migration hardening" sprint 2 weeks after launch — you will need it

---

## Gotcha 18: Rollback Window Communication Failure

**Severity: LOW**

**What happens:** A customer discovers that imported dates are wrong 5 days after migration. They request a rollback. The rollback window is {{ROLLBACK_WINDOW_HOURS}} hours. Their window expired yesterday. They are furious because nobody told them there was a deadline for undoing the import. Support has no easy path forward — manual data correction is a multi-day engineering task.

**Why it happens:** The rollback window was communicated in a post-import email that the customer did not read, or it was mentioned in a tooltip that the customer did not hover over. Time-limited options that are not prominently communicated create time bombs.

**How to prevent it:**
- Show the rollback deadline prominently on the import results page: "You can undo this import until [date/time]"
- Send a reminder email at the 75% mark of the rollback window: "Your import rollback window expires in [hours]. If your data looks correct, no action is needed."
- After the rollback window expires, send a final notification: "Your import from [date] is now permanent. Contact support if you need changes."
- In the migration dashboard, show rollback availability status for each import: green (available), yellow (expiring soon), gray (expired)
- Consider extending the rollback window for enterprise customers — 168 hours instead of {{ROLLBACK_WINDOW_HOURS}} hours
