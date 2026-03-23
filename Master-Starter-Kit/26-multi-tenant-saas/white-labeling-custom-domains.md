# White-Labeling & Custom Domains

> White-labeling lets customers present your product as their own. It ranges from simple logo swaps to full custom domains with branded emails. Each level adds significant complexity. This guide maps the full spectrum so you can ship the right level of customization without overengineering.

---

## Feature Spectrum (Ordered by Complexity)

| Level | Feature | Complexity | When to Build |
|-------|---------|-----------|---------------|
| 1 | Logo & color customization | Easy | Always (day 1) |
| 2 | Custom subdomain | Moderate | When customers ask |
| 3 | Custom email sender name | Moderate | When customers care about branding |
| 4 | Custom domain | Complex | When enterprise customers demand it |
| 5 | Full rebrand (emails, error pages, docs) | Very complex | Enterprise tier only |
| 6 | Embedded / OEM (iframe or API-only) | Hardest | When partners resell your product |

**Recommendation:** Start with Level 1 (logo/colors). Add Level 2 (subdomains) only when customers request it. Add Level 4 (custom domains) only for enterprise customers paying enough to justify the engineering and operational cost.

---

## Level 1: Logo & Color Customization

The simplest and most impactful form of white-labeling. Store per-tenant branding settings and inject them as CSS variables.

### Database Schema

```sql
-- Branding stored as JSONB on the tenants table
-- (or as a separate tenant_branding table if complex)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS branding JSONB NOT NULL DEFAULT '{}';

-- Example branding object:
-- {
--   "logoUrl": "https://cdn.example.com/tenants/abc/logo.png",
--   "faviconUrl": "https://cdn.example.com/tenants/abc/favicon.ico",
--   "primaryColor": "#2563eb",
--   "primaryColorLight": "#dbeafe",
--   "accentColor": "#f59e0b",
--   "headerBg": "#ffffff",
--   "headerText": "#111827",
--   "fontFamily": "Inter, sans-serif",
--   "borderRadius": "8px",
--   "companyName": "Acme Corp"
-- }
```

### CSS Variable Injection

```typescript
// src/lib/branding.ts

interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  primaryColorLight?: string;
  accentColor?: string;
  headerBg?: string;
  headerText?: string;
  fontFamily?: string;
  borderRadius?: string;
  companyName?: string;
}

const DEFAULT_BRANDING: TenantBranding = {
  primaryColor: "#2563eb",
  primaryColorLight: "#dbeafe",
  accentColor: "#f59e0b",
  headerBg: "#ffffff",
  headerText: "#111827",
  fontFamily: "Inter, sans-serif",
  borderRadius: "8px",
};

export function getBrandingCSSVars(branding: TenantBranding): Record<string, string> {
  const merged = { ...DEFAULT_BRANDING, ...branding };
  return {
    "--brand-primary": merged.primaryColor!,
    "--brand-primary-light": merged.primaryColorLight!,
    "--brand-accent": merged.accentColor!,
    "--header-bg": merged.headerBg!,
    "--header-text": merged.headerText!,
    "--font-family": merged.fontFamily!,
    "--border-radius": merged.borderRadius!,
  };
}
```

```tsx
// React component: inject CSS vars at app root
function AppShell({ children }: { children: React.ReactNode }) {
  const tenant = useTenant(); // from context/hook

  const cssVars = getBrandingCSSVars(tenant.branding);

  return (
    <div style={cssVars as React.CSSProperties}>
      <header style={{ background: "var(--header-bg)", color: "var(--header-text)" }}>
        {tenant.branding.logoUrl ? (
          <img src={tenant.branding.logoUrl} alt={tenant.name} height={32} />
        ) : (
          <span>{tenant.name}</span>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
```

```css
/* globals.css — use CSS variables everywhere */
.btn-primary {
  background-color: var(--brand-primary);
  border-radius: var(--border-radius);
}

.btn-primary:hover {
  background-color: var(--brand-primary-light);
}

body {
  font-family: var(--font-family);
}
```

### Branding Settings API

```typescript
// PATCH /api/settings/branding
export async function updateBranding(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  requireTenantAdmin(req); // Only tenant admins can update branding

  const { logoUrl, primaryColor, accentColor, faviconUrl, companyName } = req.body;

  // Validate colors are valid hex
  if (primaryColor && !/^#[0-9a-fA-F]{6}$/.test(primaryColor)) {
    return res.status(400).json({ error: "Invalid color format" });
  }

  // Validate logo URL (must be from your CDN or allowed domains)
  if (logoUrl && !isAllowedAssetUrl(logoUrl)) {
    return res.status(400).json({ error: "Logo must be uploaded via the file upload endpoint" });
  }

  await db.update(tenants)
    .set({
      branding: sql`branding || ${JSON.stringify({ logoUrl, primaryColor, accentColor, faviconUrl, companyName })}::jsonb`,
    })
    .where(eq(tenants.id, tenantId));

  // Invalidate cached tenant
  await invalidateTenantCache(tenantId);

  res.json({ success: true });
}
```

---

## Level 2: Custom Subdomains

Each tenant gets `their-company.yourapp.com` instead of `yourapp.com/org/their-company`.

### DNS Setup

```
# Wildcard DNS record
*.yourapp.com  →  CNAME  →  yourapp.com  (or your load balancer IP)
```

### Tenant Resolution Middleware

```typescript
// src/middleware/tenant-resolver.ts

export async function resolveTenantFromHost(req: Request, res: Response, next: NextFunction) {
  const host = req.hostname; // e.g., "acme.yourapp.com"

  // Skip for main domain
  if (host === "yourapp.com" || host === "www.yourapp.com") {
    return next(); // Public marketing site
  }

  // Check for custom domain first
  let tenant = await getTenantByCustomDomain(host);

  if (!tenant) {
    // Check for subdomain
    const subdomain = extractSubdomain(host, "yourapp.com");
    if (subdomain) {
      tenant = await getTenantBySlug(subdomain);
    }
  }

  if (!tenant) {
    return res.status(404).json({ error: "Workspace not found" });
  }

  if (tenant.status !== "active") {
    return res.status(403).json({ error: "This workspace is suspended" });
  }

  // Set tenant context
  req.tenantId = tenant.id;
  req.tenant = tenant;
  next();
}

function extractSubdomain(host: string, baseDomain: string): string | null {
  if (!host.endsWith(baseDomain)) return null;
  const sub = host.slice(0, -(baseDomain.length + 1)); // Remove ".yourapp.com"
  if (!sub || sub.includes(".")) return null; // No nested subdomains
  return sub;
}
```

### Subdomain Provisioning

```typescript
// POST /api/settings/subdomain
export async function setSubdomain(req: Request, res: Response) {
  const tenantId = getCurrentTenantId();
  const { slug } = req.body;

  // Validate slug format
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(slug)) {
    return res.status(400).json({ error: "Invalid subdomain format" });
  }

  // Check reserved slugs
  const RESERVED = ["www", "api", "app", "admin", "mail", "smtp", "blog", "docs", "help", "support", "status"];
  if (RESERVED.includes(slug)) {
    return res.status(400).json({ error: "This subdomain is reserved" });
  }

  // Check availability
  const existing = await getTenantBySlug(slug);
  if (existing && existing.id !== tenantId) {
    return res.status(409).json({ error: "This subdomain is already taken" });
  }

  await db.update(tenants).set({ slug }).where(eq(tenants.id, tenantId));
  res.json({ subdomain: `${slug}.yourapp.com` });
}
```

---

## Level 3: Custom Email Sender Name

Emails appear from "Acme Corp via YourApp" instead of "YourApp".

```typescript
// src/email/branded-sender.ts
export function getBrandedSender(tenant: Tenant) {
  const companyName = tenant.branding.companyName || tenant.name;

  return {
    from: `${companyName} via YourApp <notifications@yourapp.com>`,
    replyTo: tenant.supportEmail || "support@yourapp.com",
  };
}

// For enterprise tenants with verified custom domains:
export function getCustomDomainSender(tenant: Tenant) {
  if (tenant.verifiedEmailDomain) {
    return {
      from: `${tenant.name} <notifications@${tenant.verifiedEmailDomain}>`,
      replyTo: `support@${tenant.verifiedEmailDomain}`,
    };
  }
  return getBrandedSender(tenant);
}
```

---

## Level 4: Custom Domains

Customers access your product at `app.their-company.com`. This requires DNS verification, SSL automation, and tenant routing.

### Domain Verification Flow

```
1. Customer enters their desired domain: "app.acme.com"
2. Your system generates a verification record:
   - CNAME: app.acme.com → proxy.yourapp.com
   - OR TXT: _verify.app.acme.com → "yourapp-verify=abc123"
3. Customer adds DNS record at their registrar
4. Your system polls for verification (cron or webhook)
5. Once verified: provision SSL, activate routing
```

### Database Schema

```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL UNIQUE,
  verification_token VARCHAR(100) NOT NULL,
  verification_method VARCHAR(10) NOT NULL DEFAULT 'cname', -- 'cname' or 'txt'
  verified_at TIMESTAMP,
  ssl_provisioned_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending | dns_configured | verified | ssl_provisioning | active | failed
  last_checked_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_tenant ON custom_domains(tenant_id);
CREATE UNIQUE INDEX idx_custom_domains_domain ON custom_domains(domain);
```

### DNS Verification Worker

```typescript
// src/domains/verify-dns.ts
import { resolve } from "node:dns/promises";

export async function verifyCustomDomain(domainRecord: CustomDomain): Promise<boolean> {
  try {
    if (domainRecord.verificationMethod === "cname") {
      const records = await resolve(domainRecord.domain, "CNAME");
      return records.some((r) => r === "proxy.yourapp.com" || r === "proxy.yourapp.com.");
    }

    if (domainRecord.verificationMethod === "txt") {
      const txtHost = `_verify.${domainRecord.domain}`;
      const records = await resolve(txtHost, "TXT");
      const expected = `yourapp-verify=${domainRecord.verificationToken}`;
      return records.flat().some((r) => r === expected);
    }

    return false;
  } catch (err) {
    return false; // DNS not configured yet
  }
}

// Cron: check unverified domains every 5 minutes
export async function checkPendingDomains() {
  const pending = await db.select()
    .from(customDomains)
    .where(
      and(
        isNull(customDomains.verifiedAt),
        ne(customDomains.status, "failed")
      )
    );

  for (const domain of pending) {
    const verified = await verifyCustomDomain(domain);

    if (verified) {
      await db.update(customDomains)
        .set({
          status: "verified",
          verifiedAt: new Date(),
          lastCheckedAt: new Date(),
        })
        .where(eq(customDomains.id, domain.id));

      // Trigger SSL provisioning
      await provisionSSL(domain);
    } else {
      await db.update(customDomains)
        .set({ lastCheckedAt: new Date() })
        .where(eq(customDomains.id, domain.id));
    }
  }
}
```

### SSL Automation Options

| Option | How It Works | Complexity | Best For |
|--------|-------------|-----------|---------|
| **Caddy** | Auto-HTTPS for any domain via ACME | Low | Self-hosted, small-medium scale |
| **Cloudflare for SaaS** | Custom hostname API, instant SSL | Low-Medium | Cloudflare users, any scale |
| **Let's Encrypt + Nginx** | certbot or ACME client | Medium | Self-managed infrastructure |
| **AWS ACM + ALB** | Certificate Manager with Load Balancer | Medium | AWS deployments |
| **Vercel** | Wildcard + custom domain API | Low | Vercel-hosted apps |

### Caddy Configuration (Simplest)

```
# Caddyfile — auto-HTTPS for all incoming domains
{
  on_demand_tls {
    ask http://localhost:5555/api/verify-domain
    interval 5m
    burst 10
  }
}

:443 {
  tls {
    on_demand
  }

  reverse_proxy localhost:3000
}
```

```typescript
// GET /api/verify-domain — Caddy asks this before provisioning SSL
export async function verifyDomainForCaddy(req: Request, res: Response) {
  const domain = req.query.domain as string;

  const record = await db.select()
    .from(customDomains)
    .where(
      and(
        eq(customDomains.domain, domain),
        eq(customDomains.status, "verified")
      )
    )
    .then((r) => r[0]);

  if (record) {
    return res.status(200).send(); // Allow SSL
  }

  return res.status(404).send(); // Deny SSL
}
```

### Cloudflare for SaaS

```typescript
// src/domains/cloudflare-ssl.ts
const CF_API = "https://api.cloudflare.com/client/v4";
const CF_ZONE_ID = process.env.CF_ZONE_ID!;
const CF_API_TOKEN = process.env.CF_API_TOKEN!;

export async function provisionCloudflareCustomHostname(domain: string) {
  const response = await fetch(`${CF_API}/zones/${CF_ZONE_ID}/custom_hostnames`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hostname: domain,
      ssl: {
        method: "http",
        type: "dv",
        settings: {
          min_tls_version: "1.2",
        },
      },
    }),
  });

  return response.json();
}
```

---

## Level 5: Full Rebrand

Enterprise tenants see zero trace of your brand. This means:

- Custom logo, colors, favicon (Level 1)
- Custom domain (Level 4)
- Custom email templates with their branding
- Custom error pages (404, 500, maintenance)
- Custom terms of service / privacy policy URLs
- Custom help center / documentation links
- Custom login page with their branding
- No "Powered by YourApp" footer (or optional)

### Implementation Pattern

```typescript
// src/lib/tenant-config.ts
interface TenantConfig {
  // Branding (Level 1)
  branding: TenantBranding;

  // Links
  helpUrl: string;
  termsUrl: string;
  privacyUrl: string;
  supportEmail: string;

  // Display
  showPoweredBy: boolean;  // "Powered by YourApp" footer
  customLoginPage: boolean;
  customErrorPages: boolean;

  // Email
  emailSenderName: string;
  emailSenderDomain: string | null;
}

export function getTenantConfig(tenant: Tenant): TenantConfig {
  const isEnterprise = tenant.plan === "enterprise";
  const branding = tenant.branding as TenantBranding;

  return {
    branding,
    helpUrl: tenant.settings.helpUrl || "https://docs.yourapp.com",
    termsUrl: tenant.settings.termsUrl || "https://yourapp.com/terms",
    privacyUrl: tenant.settings.privacyUrl || "https://yourapp.com/privacy",
    supportEmail: tenant.settings.supportEmail || "support@yourapp.com",
    showPoweredBy: !isEnterprise,
    customLoginPage: isEnterprise && !!branding.logoUrl,
    customErrorPages: isEnterprise,
    emailSenderName: branding.companyName || tenant.name,
    emailSenderDomain: isEnterprise ? tenant.verifiedEmailDomain : null,
  };
}
```

---

## Level 6: Embedded / OEM Mode

Partners embed your product inside their own application. Two approaches:

### iFrame Embedding

```html
<!-- Partner's page -->
<iframe
  src="https://embed.yourapp.com/widget?tenant=abc123&token=jwt-token"
  style="width: 100%; height: 600px; border: none;"
></iframe>
```

```typescript
// Your embed endpoint strips all chrome (headers, nav, footers)
// and applies partner's branding
app.get("/widget", (req, res) => {
  const { tenant, token } = req.query;
  // Verify embed token
  // Render minimal UI with tenant branding
  // Set X-Frame-Options to allow embedding from partner's domain only
  res.setHeader("Content-Security-Policy", `frame-ancestors ${partner.allowedDomains.join(" ")}`);
});
```

### API-Only Mode

Partner builds their own UI, uses your API as the backend.

```typescript
// Partner authenticates via API key (not user JWT)
// API key is scoped to their tenant
app.use("/api/v1", apiKeyAuth, tenantFromApiKey, rateLimitMiddleware("api"));
```

---

## Multi-Tenant Asset Storage

Tenant-uploaded files (logos, documents, images) must be scoped to prevent cross-tenant access.

### S3/R2 Path Convention

```
bucket-name/
├── tenants/
│   ├── {tenant-id}/
│   │   ├── branding/
│   │   │   ├── logo.png
│   │   │   └── favicon.ico
│   │   ├── uploads/
│   │   │   ├── {year}/{month}/
│   │   │   │   ├── {file-id}.pdf
│   │   │   │   └── {file-id}.png
│   │   └── exports/
│   │       └── {export-id}.csv
│   └── {other-tenant-id}/
│       └── ...
└── shared/
    ├── plan-icons/
    └── default-avatars/
```

```typescript
// src/storage/tenant-scoped.ts
export function getTenantStoragePath(tenantId: string, subpath: string): string {
  // CRITICAL: Validate subpath to prevent path traversal
  const sanitized = subpath.replace(/\.\./g, "").replace(/^\//, "");
  return `tenants/${tenantId}/${sanitized}`;
}

// S3 pre-signed URL for upload — scoped to tenant prefix
export async function getUploadUrl(tenantId: string, filename: string) {
  const key = getTenantStoragePath(tenantId, `uploads/${formatYearMonth()}/${randomId()}-${filename}`);

  const url = await s3.getSignedUrl("putObject", {
    Bucket: BUCKET,
    Key: key,
    Expires: 3600,
    Conditions: [["content-length-range", 0, MAX_UPLOAD_SIZE]],
  });

  return { url, key };
}
```

---

## Checklist

- [ ] Logo/color customization implemented (Level 1) — store in `branding` JSONB
- [ ] CSS variables injected from tenant branding config
- [ ] Branding settings page available to tenant admins
- [ ] Subdomain routing tested with wildcard DNS (Level 2, if needed)
- [ ] Custom domain verification flow working (Level 4, if needed)
- [ ] SSL automated for custom domains (Caddy, Cloudflare, or ACME)
- [ ] Tenant resolution middleware handles subdomain + custom domain + main domain
- [ ] File uploads scoped to tenant path prefix
- [ ] Path traversal attacks prevented in storage paths
- [ ] No cross-tenant asset access possible
- [ ] "Powered by" branding removable for enterprise tier
- [ ] Email sender name branded per tenant
