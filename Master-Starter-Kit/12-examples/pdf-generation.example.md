# PDF Generation Architecture — TaskFlow (Example)

> **READ ONLY — reference example.** This shows how to implement server-side PDF generation for transactional documents (Rate Confirmations, Bills of Lading, Invoices) in a NestJS + React application.

---

## Approach Comparison

| Criteria | Puppeteer (HTML to PDF) | @react-pdf/renderer (React to PDF) |
|---|---|---|
| **How it works** | Renders HTML/CSS in headless Chrome, prints to PDF | Renders React components directly to PDF (no browser) |
| **Styling** | Full CSS support (Tailwind, flexbox, grid) | Custom stylesheet API (subset of CSS, no Tailwind) |
| **Server footprint** | Heavy (~300MB for Chromium binary) | Light (~20MB npm package) |
| **Cold start** | Slow (2-5s to launch browser) | Fast (<500ms) |
| **Per-document speed** | ~500ms-2s depending on complexity | ~100-300ms |
| **Pixel-perfect fidelity** | Excellent (it IS a browser) | Good (minor differences from browser rendering) |
| **When to use** | Complex layouts, existing HTML templates, pixel-perfect match to web version | Simple documents, serverless environments, high throughput |
| **Recommendation** | Use for Rate Confirmations (complex layout, signature areas, terms) | Use for BOLs (structured form, high volume) |

### Decision for TaskFlow

Use **Puppeteer** as the primary engine. Reasons:

1. TMS documents (Rate Cons, BOLs, invoices) must match the web preview exactly.
2. Designers work in HTML/CSS — no need to learn a second layout system.
3. The API server runs on a persistent VM (not serverless), so Chromium overhead is acceptable.
4. Template reuse: the same React components render on screen AND in PDF.

---

## Template Architecture

### Rate Confirmation Template

```
┌─────────────────────────────────────────────────────────┐
│  COMPANY LOGO          RATE CONFIRMATION                │
│                        RC-2025-001234                    │
│                        Date: March 10, 2025             │
├─────────────────────────────────────────────────────────┤
│  BROKER                │  CARRIER                       │
│  Acme Logistics LLC    │  FastFreight Inc               │
│  123 Main St           │  456 Oak Ave                   │
│  Chicago, IL 60601     │  Dallas, TX 75201              │
│  MC# 123456            │  MC# 789012                    │
│  Contact: Alice Admin  │  Contact: Bob Carrier          │
│  (312) 555-0100        │  (214) 555-0200                │
├─────────────────────────────────────────────────────────┤
│  LOAD DETAILS                                           │
│  Reference: LOAD-2025-5678                              │
│  Equipment: 53' Dry Van                                 │
│  Weight: 42,000 lbs    │  Commodity: Electronics        │
│  Temperature: N/A      │  Hazmat: No                    │
├─────────────────────────────────────────────────────────┤
│  PICKUP                │  DELIVERY                      │
│  ABC Warehouse         │  XYZ Distribution Center       │
│  789 Industrial Blvd   │  321 Commerce Dr               │
│  Memphis, TN 38118     │  Atlanta, GA 30301             │
│  Date: Mar 12, 2025    │  Date: Mar 13, 2025            │
│  Time: 08:00-12:00     │  Time: 14:00-18:00             │
│  Ref#: PU-1234         │  Ref#: DEL-5678                │
├─────────────────────────────────────────────────────────┤
│  RATE                                                   │
│  Line haul:                              $2,500.00      │
│  Fuel surcharge:                           $375.00      │
│  Detention (included 2 hrs free):            $0.00      │
│  ─────────────────────────────────────────────────      │
│  TOTAL:                                  $2,875.00      │
├─────────────────────────────────────────────────────────┤
│  TERMS & CONDITIONS                                     │
│  1. Carrier shall maintain insurance per FMCSA regs...  │
│  2. Payment terms: Net 30 from delivery date...         │
│  3. [Full terms text — typically 8-12 clauses]          │
├─────────────────────────────────────────────────────────┤
│  SIGNATURES                                             │
│                                                         │
│  Broker: ________________  Date: ___________            │
│  Carrier: _______________  Date: ___________            │
│                                                         │
│  Electronic signature accepted per E-SIGN Act           │
└─────────────────────────────────────────────────────────┘
```

### Bill of Lading (BOL) Template

```
┌─────────────────────────────────────────────────────────┐
│  STRAIGHT BILL OF LADING — SHORT FORM                   │
│  BOL#: BOL-2025-001234        Date: March 12, 2025      │
├─────────────────────────────────────────────────────────┤
│  SHIP FROM (ORIGIN)    │  SHIP TO (DESTINATION)         │
│  ABC Warehouse         │  XYZ Distribution Center       │
│  789 Industrial Blvd   │  321 Commerce Dr               │
│  Memphis, TN 38118     │  Atlanta, GA 30301             │
│  SID#: PU-1234         │  CID#: DEL-5678                │
├─────────────────────────────────────────────────────────┤
│  CARRIER               │  VEHICLE                       │
│  FastFreight Inc       │  Truck#: TRK-4521              │
│  MC# 789012            │  Trailer#: TRL-8834            │
│  Driver: John Smith    │  Seal#: SEAL-99012             │
├─────────────────────────────────────────────────────────┤
│  COMMODITY DETAILS                                      │
│  ┌──────┬──────────────┬────────┬────────┬───────────┐  │
│  │ Qty  │ Description  │ Weight │ Class  │ NMFC#     │  │
│  ├──────┼──────────────┼────────┼────────┼───────────┤  │
│  │ 24   │ Pallets -    │ 42,000 │ 70     │ 116030-2  │  │
│  │      │ Electronics  │ lbs    │        │           │  │
│  └──────┴──────────────┴────────┴────────┴───────────┘  │
├─────────────────────────────────────────────────────────┤
│  SPECIAL INSTRUCTIONS                                   │
│  - Handle with care: fragile electronics                │
│  - Keep dry — do not expose to moisture                 │
│  - Appointment required for delivery                    │
├─────────────────────────────────────────────────────────┤
│  SHIPPER SIGNATURE     │  CARRIER SIGNATURE             │
│  ____________________  │  ____________________          │
│  Date: ___________     │  Date: ___________             │
│                        │                                │
│  CONSIGNEE SIGNATURE (upon receipt)                     │
│  ____________________  Date: ___________                │
│  Received in good condition except as noted:            │
│  ________________________________________________      │
└─────────────────────────────────────────────────────────┘
```

---

## Server-Side Generation (NestJS)

### PDF Service

```typescript
// src/modules/pdf/pdf.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as puppeteer from 'puppeteer';
import { S3Service } from '@/common/services/s3.service';
import { PdfTemplateService } from './pdf-template.service';
import { PdfAuditService } from './pdf-audit.service';

export interface PdfGenerationRequest {
  templateName: 'rate-confirmation' | 'bill-of-lading' | 'invoice' | 'settlement';
  templateVersion: string; // e.g., "2.1.0"
  data: Record<string, any>;
  workspaceId: string;
  requestedBy: string;
  webhookUrl?: string; // Callback URL for async generation
}

export interface PdfGenerationResult {
  fileKey: string;
  signedUrl: string;
  expiresAt: Date;
  sizeBytes: number;
  auditId: string;
}

@Injectable()
export class PdfService {
  private browser: puppeteer.Browser | null = null;
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private readonly s3: S3Service,
    private readonly templates: PdfTemplateService,
    private readonly audit: PdfAuditService,
    @InjectQueue('pdf-generation') private readonly pdfQueue: Queue,
  ) {}

  /**
   * Synchronous generation — for single documents.
   * Returns a signed URL for immediate download.
   */
  async generateSync(request: PdfGenerationRequest): Promise<PdfGenerationResult> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      // 1. Render HTML from template + data
      const html = await this.templates.render(
        request.templateName,
        request.templateVersion,
        request.data,
      );

      // 2. Load HTML into Puppeteer
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // 3. Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.75in', left: '0.5in' },
        displayHeaderFooter: true,
        footerTemplate: `
          <div style="font-size:9px; width:100%; text-align:center; color:#666;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            &nbsp;|&nbsp; Generated ${new Date().toISOString().split('T')[0]}
            &nbsp;|&nbsp; Template v${request.templateVersion}
          </div>
        `,
      });

      // 4. Upload to S3
      const fileKey = this.buildFileKey(request);
      await this.s3.upload({
        bucket: process.env.PDF_BUCKET!,
        key: fileKey,
        body: pdfBuffer,
        contentType: 'application/pdf',
        metadata: {
          templateName: request.templateName,
          templateVersion: request.templateVersion,
          workspaceId: request.workspaceId,
          generatedBy: request.requestedBy,
        },
      });

      // 5. Create audit trail entry
      const auditId = await this.audit.record({
        templateName: request.templateName,
        templateVersion: request.templateVersion,
        dataSnapshot: request.data, // Store the exact data used
        fileKey,
        workspaceId: request.workspaceId,
        generatedBy: request.requestedBy,
        fileSizeBytes: pdfBuffer.length,
      });

      // 6. Generate signed URL (expires in 1 hour)
      const signedUrl = await this.s3.getSignedUrl(fileKey, 3600);

      return {
        fileKey,
        signedUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000),
        sizeBytes: pdfBuffer.length,
        auditId,
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Asynchronous generation — for batch operations.
   * Queues the job and calls the webhook when complete.
   */
  async generateAsync(requests: PdfGenerationRequest[]): Promise<{ jobId: string }> {
    const job = await this.pdfQueue.add('batch-generate', {
      requests,
      totalCount: requests.length,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100, // Keep last 100 completed jobs
    });

    this.logger.log(`Queued batch PDF generation: ${job.id} (${requests.length} documents)`);

    return { jobId: String(job.id) };
  }

  // ─── Private Helpers ──────────────────────────────────────────

  /**
   * Lazy-init browser. Reuse across requests to avoid cold start per PDF.
   * WHY: Launching Chromium takes 2-5 seconds. Reusing saves ~95% of that.
   */
  private async getBrowser(): Promise<puppeteer.Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Prevents crashes in Docker
          '--disable-gpu',
        ],
      });
    }
    return this.browser;
  }

  /**
   * S3 key structure: {workspaceId}/{documentType}/{year}/{month}/{filename}
   * WHY: Partitioned by workspace for tenant isolation at the storage level.
   */
  private buildFileKey(request: PdfGenerationRequest): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `${request.templateName}-${timestamp}.pdf`;

    return `${request.workspaceId}/${request.templateName}/${year}/${month}/${filename}`;
  }
}
```

### PDF Controller

```typescript
// src/modules/pdf/pdf.controller.ts

import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { TenantGuard } from '@/common/guards/tenant.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { PdfService } from './pdf.service';

@ApiTags('PDF Generation')
@Controller('api/v1/pdf')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('rate-confirmation')
  @Roles('admin', 'dispatcher')
  @ApiOperation({ summary: 'Generate Rate Confirmation PDF' })
  async generateRateConfirmation(
    @Body() body: { loadId: string },
    @Req() req: any,
  ) {
    return this.pdfService.generateSync({
      templateName: 'rate-confirmation',
      templateVersion: '2.1.0',
      data: { loadId: body.loadId },
      workspaceId: req.user.workspaceId,
      requestedBy: req.user.id,
    });
  }

  @Post('bill-of-lading')
  @Roles('admin', 'dispatcher')
  @ApiOperation({ summary: 'Generate Bill of Lading PDF' })
  async generateBOL(
    @Body() body: { loadId: string },
    @Req() req: any,
  ) {
    return this.pdfService.generateSync({
      templateName: 'bill-of-lading',
      templateVersion: '1.3.0',
      data: { loadId: body.loadId },
      workspaceId: req.user.workspaceId,
      requestedBy: req.user.id,
    });
  }

  @Post('batch')
  @Roles('admin')
  @ApiOperation({ summary: 'Generate multiple PDFs asynchronously' })
  async generateBatch(
    @Body() body: { loadIds: string[]; templateName: string },
    @Req() req: any,
  ) {
    const requests = body.loadIds.map((loadId) => ({
      templateName: body.templateName as any,
      templateVersion: 'latest',
      data: { loadId },
      workspaceId: req.user.workspaceId,
      requestedBy: req.user.id,
      webhookUrl: `${process.env.APP_URL}/api/v1/webhooks/pdf-complete`,
    }));

    return this.pdfService.generateAsync(requests);
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Check batch PDF generation status' })
  async getBatchStatus(@Param('jobId') jobId: string) {
    // Returns: { status: 'active' | 'completed' | 'failed', progress: 5, total: 20 }
    // Implementation reads from Bull queue
    return { jobId, status: 'pending' };
  }
}
```

---

## Template Versioning and Audit Trail

### Why Version Templates

1. **Legal compliance:** A Rate Confirmation generated 6 months ago must be reproducible with the EXACT template that was used at that time.
2. **Dispute resolution:** If a carrier disputes terms, you must prove what template version they signed.
3. **Rollback:** A bad template version can be reverted without losing history.

### Schema

```prisma
// prisma/schema.prisma (partial)

model PdfTemplate {
  id          String   @id @default(cuid())
  name        String   // "rate-confirmation", "bill-of-lading"
  version     String   // semver: "2.1.0"
  htmlContent String   @db.Text
  cssContent  String?  @db.Text
  isActive    Boolean  @default(true)
  changelog   String?  // What changed in this version
  createdAt   DateTime @default(now())
  createdBy   String

  // Unique: only one version of each template name
  @@unique([name, version])
  @@index([name, isActive])
}

model PdfAuditLog {
  id              String   @id @default(cuid())
  templateName    String
  templateVersion String
  dataSnapshot    Json     // Exact data used to generate the PDF
  fileKey         String   // S3 key for the generated file
  fileSizeBytes   Int
  workspaceId     String
  generatedBy     String
  generatedAt     DateTime @default(now())

  // WHY: This audit log is append-only. Never update or delete.
  // For GDPR deletion, redact the dataSnapshot but keep the record.

  @@index([workspaceId, generatedAt])
  @@index([templateName, templateVersion])
}
```

### Template Service

```typescript
// src/modules/pdf/pdf-template.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import * as Handlebars from 'handlebars';

@Injectable()
export class PdfTemplateService {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Renders a template with data. Uses Handlebars for interpolation.
   *
   * WHY Handlebars over raw string interpolation:
   * - Auto-escapes HTML (prevents XSS in generated PDFs)
   * - Supports conditionals ({{#if hazmat}}) and loops ({{#each lineItems}})
   * - Template syntax is designer-friendly
   */
  async render(
    templateName: string,
    version: string,
    data: Record<string, any>,
  ): Promise<string> {
    const cacheKey = `${templateName}:${version}`;

    if (!this.templateCache.has(cacheKey)) {
      const template = await this.prisma.pdfTemplate.findUnique({
        where: { name_version: { name: templateName, version } },
      });

      if (!template) {
        throw new NotFoundException(
          `Template "${templateName}" version "${version}" not found`,
        );
      }

      const compiled = Handlebars.compile(template.htmlContent);
      this.templateCache.set(cacheKey, compiled);
    }

    const compiledTemplate = this.templateCache.get(cacheKey)!;
    return compiledTemplate(data);
  }

  /**
   * Invalidate cache when a template is updated.
   */
  invalidateCache(templateName: string, version: string) {
    this.templateCache.delete(`${templateName}:${version}`);
  }
}
```

---

## Async Generation with Webhook

For batch operations (e.g., generating 50 Rate Confirmations for a settlement), use a queue with webhook callback.

### Queue Processor

```typescript
// src/modules/pdf/pdf.processor.ts

import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PdfService, PdfGenerationRequest } from './pdf.service';
import { HttpService } from '@nestjs/axios';

@Processor('pdf-generation')
export class PdfProcessor {
  private readonly logger = new Logger(PdfProcessor.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly http: HttpService,
  ) {}

  @Process('batch-generate')
  async handleBatchGenerate(job: Job<{ requests: PdfGenerationRequest[]; totalCount: number }>) {
    const { requests } = job.data;
    const results: any[] = [];

    for (let i = 0; i < requests.length; i++) {
      const result = await this.pdfService.generateSync(requests[i]);
      results.push(result);

      // Update job progress for status polling
      await job.progress(Math.round(((i + 1) / requests.length) * 100));
    }

    return results;
  }

  @OnQueueCompleted()
  async onCompleted(job: Job, results: any[]) {
    const webhookUrl = job.data.requests?.[0]?.webhookUrl;
    if (webhookUrl) {
      try {
        await this.http.axiosRef.post(webhookUrl, {
          jobId: job.id,
          status: 'completed',
          totalGenerated: results.length,
          results,
        });
      } catch (error) {
        this.logger.error(`Webhook callback failed for job ${job.id}`, error);
      }
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(`PDF batch job ${job.id} failed: ${error.message}`);

    const webhookUrl = job.data.requests?.[0]?.webhookUrl;
    if (webhookUrl) {
      try {
        await this.http.axiosRef.post(webhookUrl, {
          jobId: job.id,
          status: 'failed',
          error: error.message,
        });
      } catch (webhookError) {
        this.logger.error(`Webhook callback failed for job ${job.id}`, webhookError);
      }
    }
  }
}
```

---

## Storage Strategy

### S3 Bucket Structure

```
taskflow-pdfs/
  {workspaceId}/
    rate-confirmation/
      2025/
        03/
          rate-confirmation-2025-03-10T14-30-00-000Z.pdf
          rate-confirmation-2025-03-10T15-45-22-000Z.pdf
    bill-of-lading/
      2025/
        03/
          bill-of-lading-2025-03-12T08-00-00-000Z.pdf
    invoice/
      ...
```

### Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::taskflow-pdfs/*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": "arn:aws:iam::123456789:role/taskflow-api"
        }
      }
    }
  ]
}
```

**Rules:**

1. **Never serve PDFs directly from S3.** Always use signed URLs with expiration (1 hour max).
2. **Partition by workspaceId.** This enables per-tenant backup, retention, and deletion.
3. **Enable versioning.** S3 versioning prevents accidental overwrites.
4. **Set lifecycle rules.** Move PDFs older than 90 days to S3 Glacier for cost savings. Delete after 7 years (compliance).

### Signed URL Generation

```typescript
// Signed URLs prevent unauthorized access.
// WHY: Even if someone intercepts a URL, it expires in 1 hour.
const signedUrl = await this.s3.getSignedUrl(fileKey, 3600); // 1 hour

// For email links (carrier receives Rate Con via email), use longer expiry
const emailSignedUrl = await this.s3.getSignedUrl(fileKey, 86400 * 7); // 7 days
```

---

## Common Pitfalls

1. **Font rendering in Docker.** Puppeteer in Docker needs font packages installed (`fonts-liberation`, `fonts-noto`). Without them, text renders as boxes.

2. **Memory leaks.** Each `browser.newPage()` consumes ~50MB. Always `page.close()` in a `finally` block. For batch jobs, close and relaunch the browser every 50 documents.

3. **Race conditions in batch generation.** Do not open 50 Puppeteer pages in parallel. Process sequentially or with a concurrency limit of 3-5.

4. **Template data staleness.** When generating a Rate Con, snapshot the data AT generation time. Do not rely on the current database state — the load may have been edited since the PDF was requested.

5. **PDF size.** A simple Rate Con should be ~50-100KB. If PDFs are >1MB, check for embedded images that should be referenced by URL instead.

6. **Time zones.** All dates in PDFs must show the SHIPPER's local timezone, not UTC. Use `Intl.DateTimeFormat` with explicit timezone.
