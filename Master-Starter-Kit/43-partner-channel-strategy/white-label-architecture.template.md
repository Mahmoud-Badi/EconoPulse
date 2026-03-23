# White-Label Architecture

> Your product, their brand. White-label architecture transforms {{PROJECT_NAME}} into a platform that partners can rebrand, customize, and sell as their own — while you maintain a single codebase, shared infrastructure, and centralized updates.

---

<!-- IF {{WHITE_LABEL_ENABLED}} == "true" -->

## 1. Theming System

White-label begins with theming. Partners must be able to apply their brand identity — colors, fonts, logos, favicons — without forking your codebase.

### 1.1 Theme Configuration Schema

```typescript
// config/theme.types.ts — Partner theme configuration
interface PartnerTheme {
  partnerId: string;
  brandName: string;

  colors: {
    primary: string;        // Main brand color
    primaryHover: string;   // Hover state
    secondary: string;      // Accent color
    secondaryHover: string;
    background: string;     // Page background
    surface: string;        // Card/panel background
    surfaceHover: string;
    text: {
      primary: string;      // Main text color
      secondary: string;    // Muted text
      inverse: string;      // Text on dark backgrounds
      link: string;         // Link color
      linkHover: string;
    };
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };

  typography: {
    fontFamily: string;           // e.g., "'Inter', sans-serif"
    headingFontFamily: string;    // e.g., "'Playfair Display', serif"
    baseFontSize: string;         // e.g., '16px'
    lineHeight: string;           // e.g., '1.6'
    fontWeights: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };

  logo: {
    primary: string;       // URL — main logo (light background)
    inverse: string;       // URL — logo for dark backgrounds
    icon: string;          // URL — icon/favicon
    width: string;         // Max width constraint
    height: string;        // Max height constraint
  };

  layout: {
    borderRadius: string;    // e.g., '8px'
    maxWidth: string;        // Content max-width
    sidebarWidth: string;    // Sidebar width
    headerHeight: string;    // Header height
  };

  emails: {
    headerLogo: string;      // Email header logo URL
    footerText: string;      // Email footer text
    replyToAddress: string;  // Custom reply-to
    fromName: string;        // "From" display name
  };

  metadata: {
    title: string;           // Browser tab title
    description: string;     // Meta description
    favicon: string;         // Favicon URL
    ogImage: string;         // Open Graph image
  };
}
```

### 1.2 CSS Variable Injection

```typescript
// lib/theme-provider.ts — Runtime CSS variable injection
export function applyPartnerTheme(theme: PartnerTheme): void {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text-primary', theme.colors.text.primary);
  root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
  root.style.setProperty('--color-text-link', theme.colors.text.link);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-error', theme.colors.error);
  root.style.setProperty('--color-success', theme.colors.success);

  // Typography
  root.style.setProperty('--font-family', theme.typography.fontFamily);
  root.style.setProperty('--font-family-heading', theme.typography.headingFontFamily);
  root.style.setProperty('--font-size-base', theme.typography.baseFontSize);
  root.style.setProperty('--line-height', theme.typography.lineHeight);

  // Layout
  root.style.setProperty('--border-radius', theme.layout.borderRadius);
  root.style.setProperty('--max-width', theme.layout.maxWidth);
  root.style.setProperty('--sidebar-width', theme.layout.sidebarWidth);
  root.style.setProperty('--header-height', theme.layout.headerHeight);

  // Favicon
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (favicon) favicon.href = theme.metadata.favicon;

  // Title
  document.title = theme.metadata.title;
}
```

### 1.3 Theme Storage

| Storage Layer | Purpose | Access Pattern |
|--------------|---------|----------------|
| Database (partner_themes table) | Source of truth for all theme configs | Write: admin portal; Read: theme resolver |
| Redis cache | Fast lookup by partner ID or domain | TTL: 1 hour, invalidate on theme update |
| CDN edge config | Logo and asset delivery | Purge on theme update |
| Build-time fallback | Default theme for unresolved partners | Compiled into application bundle |

---

## 2. Subdomain Routing

Partners access their white-labeled instance via custom subdomains or custom domains. The routing layer must resolve the partner context before any application logic runs.

### 2.1 Routing Architecture

```mermaid
graph TD
    A[Incoming Request] --> B{Custom Domain?}
    B -->|Yes| C[Lookup domain in partner_domains table]
    B -->|No| D{Subdomain pattern?}
    D -->|partner.{{PROJECT_NAME}}.com| E[Extract partner slug from subdomain]
    D -->|No match| F[Serve default/direct instance]
    C --> G{Domain found?}
    G -->|Yes| H[Load partner context]
    G -->|No| I[Return 404 or redirect to main site]
    E --> J{Partner slug valid?}
    J -->|Yes| H
    J -->|No| I
    H --> K[Inject theme + config into request context]
    K --> L[Render application with partner branding]
```

### 2.2 Domain Resolution Middleware

```typescript
// middleware/partner-resolver.ts — Resolve partner from request
import { NextRequest, NextResponse } from 'next/server';

interface PartnerContext {
  partnerId: string;
  slug: string;
  theme: PartnerTheme;
  features: Record<string, boolean>;
  customDomain: string | null;
}

export async function resolvePartner(req: NextRequest): Promise<PartnerContext | null> {
  const hostname = req.headers.get('host') || '';

  // Strategy 1: Custom domain lookup
  const customDomainPartner = await lookupByCustomDomain(hostname);
  if (customDomainPartner) return customDomainPartner;

  // Strategy 2: Subdomain extraction
  const baseDomain = process.env.BASE_DOMAIN; // e.g., 'app.example.com'
  if (hostname.endsWith(`.${baseDomain}`)) {
    const slug = hostname.replace(`.${baseDomain}`, '');
    const subdomainPartner = await lookupBySlug(slug);
    if (subdomainPartner) return subdomainPartner;
  }

  // Strategy 3: Path-based (fallback for development)
  const pathSlug = req.nextUrl.pathname.split('/')[1];
  if (pathSlug?.startsWith('p-')) {
    const partner = await lookupBySlug(pathSlug.replace('p-', ''));
    if (partner) return partner;
  }

  return null; // No partner context — serve default instance
}

async function lookupByCustomDomain(domain: string): Promise<PartnerContext | null> {
  // Check Redis cache first
  const cached = await redis.get(`partner:domain:${domain}`);
  if (cached) return JSON.parse(cached);

  // Fall back to database
  const partner = await db.partnerDomains.findUnique({
    where: { domain },
    include: { partner: { include: { theme: true, features: true } } }
  });

  if (!partner) return null;

  const context = mapToPartnerContext(partner);
  await redis.setex(`partner:domain:${domain}`, 3600, JSON.stringify(context));
  return context;
}
```

---

## 3. Custom Domain Provisioning

Partners on Gold and Platinum tiers can use their own domains (e.g., `app.partnerbrand.com`).

### 3.1 Domain Setup Workflow

| Step | Action | Owner | Duration |
|------|--------|-------|----------|
| 1 | Partner submits desired domain in portal | Partner | — |
| 2 | System validates domain format | Automated | Instant |
| 3 | System generates CNAME/A record instructions | Automated | Instant |
| 4 | Partner configures DNS records | Partner | 1-48 hours |
| 5 | System polls for DNS propagation | Automated | Polling every 5 min |
| 6 | DNS verified — provision TLS certificate (Let's Encrypt) | Automated | 1-5 minutes |
| 7 | Domain activated — traffic routed to partner instance | Automated | Instant |
| 8 | System monitors certificate renewal (auto-renew at 30 days) | Automated | Ongoing |

### 3.2 DNS Verification

```typescript
// services/domain-provisioning.ts
export async function verifyDomainDNS(domain: string): Promise<DNSVerification> {
  const expectedCname = `partners.{{PROJECT_NAME}}.com`;

  try {
    const records = await dns.resolveCname(domain);
    const isValid = records.includes(expectedCname);

    return {
      domain,
      status: isValid ? 'verified' : 'cname_mismatch',
      expectedRecord: `CNAME → ${expectedCname}`,
      actualRecords: records,
      checkedAt: new Date(),
    };
  } catch (error) {
    // Try A record fallback
    try {
      const aRecords = await dns.resolve4(domain);
      const expectedIPs = await dns.resolve4(expectedCname);
      const isValid = expectedIPs.every(ip => aRecords.includes(ip));

      return {
        domain,
        status: isValid ? 'verified' : 'a_record_mismatch',
        expectedRecord: `A → ${expectedIPs.join(', ')}`,
        actualRecords: aRecords,
        checkedAt: new Date(),
      };
    } catch {
      return {
        domain,
        status: 'dns_not_found',
        expectedRecord: `CNAME → ${expectedCname}`,
        actualRecords: [],
        checkedAt: new Date(),
      };
    }
  }
}
```

---

## 4. Email Customization

White-label partners need emails sent from their brand, not yours.

### 4.1 Email Branding Configuration

| Element | Source | Fallback |
|---------|--------|----------|
| From name | `partner.emails.fromName` | `{{PROJECT_NAME}}` |
| From address | `noreply@partner-domain.com` (verified) | `noreply@{{PROJECT_NAME}}.com` |
| Reply-to | `partner.emails.replyToAddress` | Support email from partner config |
| Header logo | `partner.emails.headerLogo` | Default product logo |
| Footer text | `partner.emails.footerText` | Default footer |
| Color scheme | Partner theme colors | Default theme |
| Unsubscribe link | Partner-branded unsubscribe page | Default unsubscribe |

### 4.2 Email Domain Verification

Partners must verify their sending domain via SPF, DKIM, and DMARC records to maintain deliverability:

```
// DNS records partner must add:
TXT  _dmarc.partner.com    → "v=DMARC1; p=quarantine; rua=mailto:dmarc@partner.com"
TXT  partner.com            → "v=spf1 include:sendgrid.net ~all"
CNAME s1._domainkey.partner.com → s1.domainkey.u12345.wl.sendgrid.net
```

---

## 5. API White-Label Headers

API responses must reflect the partner brand context when accessed through white-labeled domains.

### 5.1 Response Header Customization

```typescript
// middleware/api-branding.ts
export function applyPartnerAPIHeaders(
  response: Response,
  partner: PartnerContext
): Response {
  // Replace product name references in headers
  response.headers.set('X-Powered-By', partner.theme.brandName);
  response.headers.set('X-Partner-ID', partner.partnerId);

  // CORS — allow partner's custom domain
  if (partner.customDomain) {
    response.headers.set(
      'Access-Control-Allow-Origin',
      `https://${partner.customDomain}`
    );
  }

  // Rate limit headers — partner-specific limits
  response.headers.set('X-RateLimit-Limit', String(partner.rateLimits.perMinute));

  return response;
}
```

---

## 6. Content Customization

Partners may need to customize terminology, feature names, and help content.

### 6.1 Content Override System

| Content Type | Override Method | Storage |
|-------------|----------------|---------|
| UI labels | i18n key overrides per partner | `partner_content_overrides` table |
| Help articles | Partner-specific help center URL | Partner config |
| Onboarding copy | Template variables per partner | Partner config |
| Legal pages | Partner-provided Terms & Privacy | Partner uploads |
| Feature names | Label mapping per partner | Partner config |
| Support contact | Custom support email/phone | Partner config |

### 6.2 Content Resolution Order

1. Partner-specific content override (if exists)
2. Partner tier default content (if exists)
3. Default product content (always exists)

```typescript
// lib/content-resolver.ts
export async function resolveContent(
  key: string,
  partnerId: string | null,
  locale: string = 'en'
): Promise<string> {
  if (partnerId) {
    // Check partner-specific override
    const override = await db.contentOverrides.findUnique({
      where: { partnerId_key_locale: { partnerId, key, locale } }
    });
    if (override) return override.value;
  }

  // Fall back to default content
  return i18n.t(key, { lng: locale });
}
```

---

## 7. Billing Under Partner Brand

White-label partners may want invoices, receipts, and billing pages to reflect their brand.

### 7.1 Billing Architecture Options

| Model | Description | Complexity | Best For |
|-------|------------|------------|----------|
| Partner bills customer directly | Partner uses Stripe Connect or own billing | High | Large partners, full white-label |
| You bill, partner branding | Your billing with partner logos/names on invoices | Medium | Mid-tier partners |
| Revenue share invoice | You bill customer, share revenue with partner monthly | Low | Small partners, affiliate-like |

### 7.2 Stripe Connect Integration

```typescript
// services/partner-billing.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create a Connected Account for the partner
export async function createPartnerAccount(partner: Partner): Promise<string> {
  const account = await stripe.accounts.create({
    type: 'standard',
    country: partner.country,
    email: partner.billingEmail,
    business_type: 'company',
    company: {
      name: partner.companyName,
    },
    metadata: {
      partnerId: partner.id,
      partnerTier: partner.tier,
    },
  });

  return account.id;
}

// Create a subscription under the partner's Connected Account
export async function createPartnerCustomerSubscription(
  partnerStripeAccountId: string,
  customerEmail: string,
  priceId: string,
  applicationFeePercent: number  // Your platform fee
): Promise<Stripe.Subscription> {
  // Create customer on partner's account
  const customer = await stripe.customers.create(
    { email: customerEmail },
    { stripeAccount: partnerStripeAccountId }
  );

  // Create subscription with application fee
  const subscription = await stripe.subscriptions.create(
    {
      customer: customer.id,
      items: [{ price: priceId }],
      application_fee_percent: applicationFeePercent,
    },
    { stripeAccount: partnerStripeAccountId }
  );

  return subscription;
}
```

---

## 8. Database Schema

```sql
-- White-label partner tables
CREATE TABLE partner_themes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  colors_json     JSONB NOT NULL,
  typography_json JSONB NOT NULL,
  logo_json       JSONB NOT NULL,
  layout_json     JSONB NOT NULL,
  email_json      JSONB NOT NULL,
  metadata_json   JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id)
);

CREATE TABLE partner_domains (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  domain          VARCHAR(255) NOT NULL UNIQUE,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, verified, active, failed
  dns_verified_at TIMESTAMPTZ,
  tls_provisioned_at TIMESTAMPTZ,
  tls_expires_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (status IN ('pending', 'dns_verification', 'verified', 'tls_provisioning', 'active', 'failed', 'revoked'))
);

CREATE TABLE partner_content_overrides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  content_key     VARCHAR(255) NOT NULL,
  locale          VARCHAR(10) NOT NULL DEFAULT 'en',
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, content_key, locale)
);

CREATE INDEX idx_partner_domains_domain ON partner_domains(domain);
CREATE INDEX idx_partner_domains_status ON partner_domains(status);
CREATE INDEX idx_partner_content_key ON partner_content_overrides(partner_id, content_key);
```

---

## 9. White-Label Checklist

- [ ] Theme configuration schema defined and validated
- [ ] CSS variable injection working for all brand elements
- [ ] Subdomain routing resolves partner context correctly
- [ ] Custom domain provisioning workflow tested end-to-end
- [ ] TLS certificate auto-provisioning and renewal configured
- [ ] Email branding (from name, logo, colors) working for all transactional emails
- [ ] Email domain verification (SPF, DKIM, DMARC) documented for partners
- [ ] API responses include partner-appropriate headers
- [ ] Content override system resolves partner > tier > default correctly
- [ ] Billing integration (Stripe Connect or branded invoices) tested
- [ ] Partner theme editor in admin portal functional
- [ ] Theme preview mode available before publishing
- [ ] Default theme fallback works when partner theme is missing
- [ ] Cache invalidation triggers correctly on theme updates
- [ ] Performance: theme resolution adds < 5ms to request latency

<!-- ENDIF -->
