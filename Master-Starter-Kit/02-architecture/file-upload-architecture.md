# File Upload & Media Processing Architecture

> Design the file upload pipeline: how files get from the user's device to storage, with validation, processing, and delivery.

---

## Decision Tree

```
What types of files does your app handle?
  │
  ├── User avatars / profile photos only →
  │   Use Vercel Blob or Cloudinary. Simple, no custom pipeline needed.
  │
  ├── Document uploads (PDFs, spreadsheets, etc.) →
  │   Presigned URL upload to S3/R2 + metadata in your database.
  │
  ├── Image-heavy (gallery, e-commerce, social) →
  │   Presigned URL + image processing pipeline (Sharp / Cloudinary / Imgix)
  │
  └── Video / large files →
      Multipart upload + transcoding service (Mux / Cloudflare Stream)
```

---

## Upload Patterns

### Pattern A: Presigned URL Upload (RECOMMENDED)

Files upload directly from the browser to object storage, bypassing your server.

```
Browser                    Your API                   Object Storage (S3/R2)
   │                          │                              │
   ├── Request upload URL ───►│                              │
   │                          ├── Generate presigned URL ───►│
   │                          │◄── Return URL + fields ──────┤
   │◄── Return upload URL ───┤                              │
   │                          │                              │
   ├── Upload file directly ─────────────────────────────────►│
   │   (browser → S3, no server middleman)                   │
   │                          │                              │
   ├── Confirm upload ────────►│                              │
   │                          ├── Verify file exists ────────►│
   │                          ├── Process (resize, scan) ───►│
   │                          ├── Save metadata to DB        │
   │◄── Return file record ──┤                              │
```

**Why presigned URLs?**
- Files don't pass through your server (saves bandwidth and CPU)
- Supports files of any size
- No server timeout issues on large uploads
- Object storage handles the heavy lifting

```typescript
// API: Generate presigned upload URL
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function getUploadUrl(params: {
  fileName: string;
  fileType: string;
  maxSize: number;
}) {
  // Validate file type
  if (!ALLOWED_TYPES.includes(params.fileType)) {
    throw new Error(`File type not allowed: ${params.fileType}`);
  }

  const key = `uploads/${crypto.randomUUID()}/${sanitizeFilename(params.fileName)}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: params.fileType,
    ContentLength: params.maxSize,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 }); // 10 min

  return { uploadUrl, key, expiresAt: Date.now() + 600_000 };
}
```

### Pattern B: Server-Side Upload (Small Files Only)

For simple cases (avatars, small documents) where the file passes through your server.

```typescript
// Next.js Route Handler
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Validate
  if (file.size > MAX_FILE_SIZE) throw new Error('File too large');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type');

  // Upload to storage
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${crypto.randomUUID()}.${getExtension(file.name)}`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  }));

  return Response.json({ key, url: `${CDN_URL}/${key}` });
}
```

---

## Storage Providers

| Provider | Best For | Pricing |
|----------|----------|---------|
| **Vercel Blob** | Simple file storage for Vercel apps | Included in Vercel plans |
| **Cloudflare R2** | S3-compatible with zero egress fees | $0.015/GB storage, $0 egress |
| **AWS S3** | Full-featured, enterprise | $0.023/GB + egress fees |
| **Supabase Storage** | If already using Supabase | Included in plans |
| **Uploadthing** | TypeScript-first upload service | Free tier + paid plans |

**Recommendation:** Use **Cloudflare R2** for cost (zero egress) or **Vercel Blob** for simplicity. Use **S3** if you need advanced features (lifecycle policies, cross-region replication).

---

## File Validation & Security

### Client-Side Validation (UX only, NOT security)

```typescript
// Pre-upload check for fast feedback
function validateFile(file: File): string | null {
  if (file.size > MAX_SIZE) return `File too large (max ${formatBytes(MAX_SIZE)})`;
  if (!ALLOWED_EXTENSIONS.includes(getExtension(file.name))) return 'File type not allowed';
  return null; // Valid
}
```

### Server-Side Validation (SECURITY)

```typescript
import { fileTypeFromBuffer } from 'file-type';

async function validateUpload(buffer: Buffer, declaredType: string): Promise<void> {
  // 1. Check magic bytes (actual file type, not just extension)
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
    throw new Error(`Invalid file type: ${detected?.mime ?? 'unknown'}`);
  }

  // 2. Verify declared type matches actual type
  if (detected.mime !== declaredType) {
    throw new Error('File type mismatch — possible file disguise');
  }

  // 3. Check file size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('File exceeds maximum size');
  }

  // 4. Strip EXIF metadata from images (prevents location leakage)
  if (detected.mime.startsWith('image/')) {
    await stripExifData(buffer);
  }
}
```

### Security Rules

| Rule | Why |
|------|-----|
| **Validate magic bytes, not just extension** | `.exe` renamed to `.jpg` bypasses extension checks |
| **Strip EXIF data from images** | Prevents leaking GPS coordinates, device info |
| **Serve from a separate domain** | Prevents XSS via uploaded HTML/SVG files |
| **Set Content-Disposition: attachment** | Prevents browsers from executing uploaded files |
| **Scan for malware** (if critical) | Use ClamAV or a cloud scanning service |
| **Generate new filenames** | Never use user-provided filenames (path traversal risk) |

---

## Image Processing

### Pattern: Process on Upload (Queue-Based)

```typescript
// After successful upload, queue processing
await imageProcessingQueue.add('process', {
  key: uploadedKey,
  variants: [
    { name: 'thumbnail', width: 150, height: 150, fit: 'cover' },
    { name: 'medium', width: 600, height: 400, fit: 'inside' },
    { name: 'large', width: 1200, height: 800, fit: 'inside' },
  ],
});

// Worker: generate image variants
import sharp from 'sharp';

const worker = new Worker('image-processing', async (job) => {
  const { key, variants } = job.data;
  const original = await s3.getObject({ Bucket: BUCKET, Key: key });
  const buffer = await streamToBuffer(original.Body);

  for (const variant of variants) {
    const processed = await sharp(buffer)
      .resize(variant.width, variant.height, { fit: variant.fit })
      .webp({ quality: 80 })    // Convert to WebP for smaller size
      .toBuffer();

    const variantKey = key.replace(/\.[^.]+$/, `-${variant.name}.webp`);
    await s3.putObject({
      Bucket: BUCKET,
      Key: variantKey,
      Body: processed,
      ContentType: 'image/webp',
    });
  }
});
```

### Alternative: On-Demand Processing (Cloudinary / Imgix)

Use URL-based transformations — no processing pipeline needed:

```
Original:  https://cdn.example.com/uploads/photo.jpg
Thumbnail: https://cdn.example.com/uploads/photo.jpg?w=150&h=150&fit=cover
WebP:      https://cdn.example.com/uploads/photo.jpg?format=webp&quality=80
```

---

## File Metadata Schema

```sql
CREATE TABLE files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  storage_key   TEXT NOT NULL UNIQUE,        -- S3/R2 key
  original_name TEXT NOT NULL,                -- User's filename (display only)
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  width         INTEGER,                      -- For images
  height        INTEGER,                      -- For images
  variants      JSONB DEFAULT '{}',           -- { "thumbnail": "key", "medium": "key" }
  entity_type   TEXT,                         -- 'product', 'message', 'profile'
  entity_id     UUID,                         -- FK to the owning entity
  is_public     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Checklist

- [ ] Storage provider chosen (S3 / R2 / Vercel Blob)
- [ ] Upload pattern chosen (presigned URL / server-side)
- [ ] File type whitelist defined
- [ ] Magic byte validation implemented (not just extension)
- [ ] EXIF stripping enabled for images
- [ ] Files served from separate domain or with `Content-Disposition`
- [ ] Image processing pipeline configured (if needed)
- [ ] File metadata schema created
- [ ] Upload size limits configured per file type
- [ ] Orphaned file cleanup job scheduled
- [ ] CDN configured for file delivery
