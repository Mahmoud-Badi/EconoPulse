# {{PROJECT_NAME}} — Cloud Storage Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Storage Provider:** {{STORAGE_PROVIDER}} (S3 / R2 / GCS / Azure Blob)
> **CDN:** {{CDN_PROVIDER}}
> **Last Updated:** {{DATE}}

---

## 1. Provider Selection

| Factor | AWS S3 | Cloudflare R2 | Google Cloud Storage | Azure Blob |
|--------|--------|---------------|---------------------|------------|
| **Egress cost** | $0.09/GB | **$0 (free)** | $0.12/GB | $0.087/GB |
| **Storage cost** | $0.023/GB/mo | $0.015/GB/mo | $0.020/GB/mo | $0.018/GB/mo |
| **S3 compatibility** | Native | ✅ Full | Interop mode | ❌ |
| **Free tier** | 5 GB (12 months) | 10 GB forever | 5 GB (12 months) | 5 GB (12 months) |
| **Global CDN** | CloudFront (separate) | Built-in | Cloud CDN (separate) | Azure CDN (separate) |
| **Presigned URLs** | ✅ | ✅ (S3 API) | ✅ (Signed URLs) | ✅ (SAS tokens) |
| **Lifecycle policies** | ✅ | ✅ | ✅ | ✅ |
| **Versioning** | ✅ | ❌ | ✅ | ✅ |
| **Event notifications** | ✅ (SNS/SQS/Lambda) | ❌ (use Workers) | ✅ (Pub/Sub) | ✅ (Event Grid) |

**Decision:** {{STORAGE_PROVIDER}}
**Rationale:** {{STORAGE_RATIONALE}}

---

## 2. Bucket Architecture

### Bucket Strategy

| Bucket | Purpose | Access | Lifecycle |
|--------|---------|--------|-----------|
| `{{PROJECT_SLUG}}-uploads` | User-uploaded files | Private (presigned URLs) | Permanent |
| `{{PROJECT_SLUG}}-assets` | Public static assets (images, fonts) | Public | Permanent |
| `{{PROJECT_SLUG}}-exports` | Generated reports/exports | Private (presigned URLs) | Delete after 30 days |
| `{{PROJECT_SLUG}}-backups` | Database/system backups | Private | Move to cold storage after 90 days |
| `{{PROJECT_SLUG}}-temp` | Temporary processing files | Private | Delete after 24 hours |

### File Organization

```
uploads/
  ├─ users/{user_id}/
  │   ├─ avatar/{timestamp}-{hash}.webp
  │   └─ documents/{timestamp}-{hash}.pdf
  ├─ organizations/{org_id}/
  │   └─ logos/{timestamp}-{hash}.png
  └─ products/{product_id}/
      └─ images/{timestamp}-{hash}.webp
```

**File naming:** `{timestamp}-{hash}.{extension}` — prevents collisions, enables cache busting, hides original filename (privacy).

---

## 3. Upload Patterns

### Direct Upload with Presigned URLs (Recommended)

```
Client                    Your Server                  Storage Provider
  │                            │                              │
  ├─ POST /api/upload/request ─→│                              │
  │  (filename, type, size)    │                              │
  │                            ├─ Generate presigned URL ─────→│
  │                            │  (PUT, 15 min expiry)        │
  │←─ { uploadUrl, fileKey } ──┤                              │
  │                            │                              │
  ├─ PUT {uploadUrl} ──────────────────────────────────────────→│
  │  (file binary data)       │                              │
  │←─ 200 OK ──────────────────────────────────────────────────┤
  │                            │                              │
  ├─ POST /api/upload/complete→│                              │
  │  (fileKey)                 │                              │
  │                            ├─ Verify file exists ─────────→│
  │                            ├─ Process (resize, scan)      │
  │                            ├─ Save metadata to database   │
  │←─ { fileUrl } ────────────┤                              │
```

**Benefits:** File data never passes through your server → lower bandwidth, faster uploads, no memory pressure.

### Upload Validation

| Check | When | Action |
|-------|------|--------|
| File type (MIME) | Before generating presigned URL | Reject disallowed types |
| File size | Before generating presigned URL (Content-Length header) | Reject oversized files |
| Virus/malware scan | After upload complete | Quarantine if infected |
| Image dimensions | After upload complete | Resize if oversized |
| Content verification | After upload complete | Verify MIME matches extension |

### Allowed File Types

| Category | Extensions | Max Size | MIME Types |
|----------|-----------|----------|------------|
| Images | .jpg, .png, .webp, .gif, .svg | {{MAX_IMAGE_SIZE}} | image/* |
| Documents | .pdf, .doc, .docx, .txt | {{MAX_DOC_SIZE}} | application/pdf, application/* |
| Videos | .mp4, .webm, .mov | {{MAX_VIDEO_SIZE}} | video/* |
| Archives | .zip | {{MAX_ARCHIVE_SIZE}} | application/zip |

---

## 4. Download / Access Patterns

### Presigned Download URLs

For private files, generate time-limited download URLs:

```
Configuration:
  Presigned URL expiry: 1 hour (adjust based on use case)
  Cache presigned URLs: No (they contain credentials)
  Regenerate on each request: Yes (or cache for a short period)
```

### CDN Integration

For public assets, serve through CDN:

```
Upload: Client → Presigned URL → S3/R2
Access: Client → CDN (CloudFront/Cloudflare) → S3/R2 (origin)

CDN caches files at edge locations → faster delivery, lower origin load
```

| CDN Configuration | Value |
|------------------|-------|
| Cache TTL (images) | 1 year (use unique filenames for cache busting) |
| Cache TTL (documents) | 1 hour |
| Custom domain | `cdn.{{APP_DOMAIN}}` |
| HTTPS | Required |
| CORS | Allow `{{APP_DOMAIN}}` |

### Image Optimization

| Approach | Provider | Description |
|----------|----------|-------------|
| **Build-time resize** | Sharp (Node.js) | Resize on upload, store multiple sizes |
| **On-demand resize** | Cloudflare Images, imgix, Cloudinary | Transform via URL parameters |
| **Next.js Image** | Vercel | Built-in optimization for Next.js apps |

**Recommendation:** On-demand resize (Cloudflare Images or imgix) for flexibility. Build-time resize if costs are a concern.

---

## 5. Lifecycle Policies

| Rule | Bucket | Condition | Action |
|------|--------|-----------|--------|
| Delete temp files | `*-temp` | Age > 24 hours | Delete |
| Delete exports | `*-exports` | Age > 30 days | Delete |
| Archive backups | `*-backups` | Age > 90 days | Move to Glacier/Nearline |
| Delete old backups | `*-backups` | Age > 1 year | Delete |
| Abort incomplete uploads | All | Multipart upload > 24 hours | Abort |

---

## 6. Security

### Access Control

- [ ] All buckets private by default (no public access unless intentional)
- [ ] Presigned URLs for all user-accessed files
- [ ] IAM/service account with minimum permissions (only the buckets it needs)
- [ ] Bucket policy blocks all public access except CDN origin
- [ ] CORS configured to allow only your domain
- [ ] Server-side encryption enabled (AES-256 or KMS)
- [ ] Bucket versioning enabled for important data (protects against accidental deletion)
- [ ] Access logging enabled for audit trail

### Content Security

- [ ] File type validation before upload (check MIME type AND file extension)
- [ ] Malware scanning for user uploads
- [ ] No executable files allowed (.exe, .sh, .bat, .cmd, .msi)
- [ ] Content-Disposition header set to `attachment` for downloads (prevents browser execution)
- [ ] Presigned URL expiry set appropriately (not too long)

---

## 7. Implementation Checklist

- [ ] Storage provider account and buckets created
- [ ] IAM credentials configured with minimum permissions
- [ ] Presigned URL generation implemented
- [ ] Direct upload flow working (client → presigned URL → storage)
- [ ] Upload validation (type, size, virus scan)
- [ ] CDN configured for public assets
- [ ] Image optimization pipeline set up
- [ ] Lifecycle policies configured
- [ ] Backup bucket and retention configured
- [ ] CORS configured for your domain
- [ ] Encryption enabled (at rest + in transit)
- [ ] File metadata stored in database (key, type, size, owner, created_at)
- [ ] Health check for storage access (can read/write test file)
- [ ] Cost monitoring (storage + egress alerts)
