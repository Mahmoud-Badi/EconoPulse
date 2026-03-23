# Affiliate Program

> Affiliates turn your product into a revenue opportunity for content creators, influencers, bloggers, and niche publishers. This template designs the affiliate architecture — commission structure, cookie tracking, UTM attribution, payout rules, fraud detection, affiliate dashboard, and terms that scale distribution without scaling headcount.

---

<!-- IF {{AFFILIATE_ENABLED}} == "true" -->

## 1. Affiliate Program Architecture

### 1.1 System Overview

```mermaid
graph TD
    A[Affiliate signs up] --> B[Affiliate approved]
    B --> C[Affiliate gets unique link + tracking code]
    C --> D[Affiliate promotes {{PROJECT_NAME}}]
    D --> E[Visitor clicks affiliate link]
    E --> F[Tracking middleware sets cookie + records click]
    F --> G[Visitor browses site]
    G --> H{Visitor converts within {{AFFILIATE_COOKIE_DAYS}} days?}
    H -->|Yes| I[Conversion attributed to affiliate]
    H -->|No| J[Cookie expires — no attribution]
    I --> K[Commission calculated]
    K --> L{Holdback period passed?}
    L -->|Yes| M[Commission becomes payable]
    L -->|No| N[Commission accrues in holdback]
    M --> O[Added to payout batch]
    O --> P[Affiliate paid]
```

### 1.2 Technology Stack

| Component | Options | Recommendation |
|-----------|---------|----------------|
| Affiliate platform | PartnerStack, Impact, Post Affiliate Pro, custom | Custom for control; PartnerStack for speed |
| Tracking | First-party cookies + server-side attribution | Server-side preferred (ad blocker resistant) |
| Payment processing | Stripe Connect, PayPal Payouts, Wise | Stripe Connect for US; Wise for international |
| Dashboard | Platform-provided or custom | Custom for brand consistency |
| Fraud detection | Custom rules + third-party signals | Custom + ClickCease/Anura for click fraud |
| Reporting | Custom analytics pipeline | Integrated with Section 30 analytics |

---

## 2. Commission Structure

### 2.1 Commission Models

| Model | Rate | Best For | Example |
|-------|------|----------|---------|
| Percentage of first payment | {{AFFILIATE_COMMISSION}}% | Self-serve products | $100 sale × {{AFFILIATE_COMMISSION}}% = ${{AFFILIATE_COMMISSION}} |
| Percentage of first year | {{AFFILIATE_COMMISSION}}% | Annual subscriptions | $1,200/yr × {{AFFILIATE_COMMISSION}}% = ${{AFFILIATE_COMMISSION}}×12 |
| Recurring percentage | {{AFFILIATE_COMMISSION}}% ongoing | High-LTV products | {{AFFILIATE_COMMISSION}}% of every payment, lifetime |
| Flat bounty | $50-$500 per conversion | Enterprise products | $200 per qualified signup |
| Tiered percentage | Scaling with volume | Volume affiliates | 10% (1-10 sales), 15% (11-50), 20% (51+) |

### 2.2 Commission Rate by Product Tier

| Product Tier | Commission Rate | Maximum Commission | Rationale |
|-------------|----------------|--------------------|-----------|
| Free trial → Paid | {{AFFILIATE_COMMISSION}}% of first payment | — | Standard conversion |
| Starter | {{AFFILIATE_COMMISSION}}% | $50/sale | Low ACV, high volume |
| Professional | {{AFFILIATE_COMMISSION}}% | $200/sale | Mid-tier, balanced |
| Enterprise | {{AFFILIATE_COMMISSION}}% or flat $500 | $1,000/sale | High ACV, lower volume |
| Annual prepaid | {{AFFILIATE_COMMISSION}}% + 5% bonus | — | Reward longer commitment |

### 2.3 Bonus Structure

| Bonus Type | Trigger | Amount |
|-----------|---------|--------|
| First sale bonus | Affiliate's first conversion | $50 one-time |
| Volume bonus | 10+ conversions in a calendar month | 5% additional on all sales that month |
| Seasonal bonus | Black Friday, annual promotion periods | 2x commission for 48 hours |
| Exclusive content bonus | Affiliate creates dedicated review/tutorial | $100-$500 one-time |
| Loyalty bonus | Active for 12+ consecutive months | 2% permanent rate increase |

---

## 3. Cookie Duration & Tracking

### 3.1 Cookie Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Cookie name | `_{{PROJECT_NAME}}_aff` | Namespaced to avoid collision |
| Cookie duration | {{AFFILIATE_COOKIE_DAYS}} days | Balance between affiliate credit and attribution accuracy |
| Cookie type | First-party, server-set | Survives ITP, ad blockers, and privacy browsers |
| Cookie domain | `.{{PROJECT_NAME}}.com` | Accessible across subdomains |
| SameSite | `Lax` | Allows cross-site navigation clicks |
| Secure | `true` | HTTPS only |
| HttpOnly | `false` | Needs JS access for client-side attribution backup |
| Overwrite policy | First-touch wins (do not overwrite existing cookie) | Rewards the affiliate who introduced the user |

### 3.2 Tracking Implementation

```typescript
// middleware/affiliate-tracking.ts — Server-side affiliate attribution
import { NextRequest, NextResponse } from 'next/server';

interface AffiliateClick {
  affiliateId: string;
  clickId: string;
  landingPage: string;
  referrer: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  ipHash: string;          // Hashed for privacy
  userAgent: string;
  timestamp: Date;
}

export async function trackAffiliateClick(
  req: NextRequest
): Promise<NextResponse> {
  const url = new URL(req.url);
  const affiliateId = url.searchParams.get('ref')
    || url.searchParams.get('aff')
    || url.searchParams.get('via');

  if (!affiliateId) return NextResponse.next();

  // Validate affiliate exists and is active
  const affiliate = await db.affiliates.findUnique({
    where: { slug: affiliateId, status: 'active' },
  });

  if (!affiliate) return NextResponse.next();

  // Check for existing cookie — first-touch wins
  const existingCookie = req.cookies.get('_{{PROJECT_NAME}}_aff');
  if (existingCookie) {
    // Already attributed — do not overwrite
    // But still record the click for analytics
    await recordClick(affiliate.id, req, false);
    return NextResponse.next();
  }

  // Generate unique click ID
  const clickId = crypto.randomUUID();

  // Record the click server-side
  await recordClick(affiliate.id, req, true, clickId);

  // Set first-party cookie
  const response = NextResponse.next();
  response.cookies.set('_{{PROJECT_NAME}}_aff', JSON.stringify({
    aid: affiliate.id,
    cid: clickId,
    ts: Date.now(),
  }), {
    maxAge: {{AFFILIATE_COOKIE_DAYS}} * 24 * 60 * 60, // days to seconds
    path: '/',
    domain: `.${process.env.COOKIE_DOMAIN}`,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
  });

  // Strip affiliate params from URL for clean analytics
  url.searchParams.delete('ref');
  url.searchParams.delete('aff');
  url.searchParams.delete('via');

  return response;
}

async function recordClick(
  affiliateId: string,
  req: NextRequest,
  isFirstTouch: boolean,
  clickId?: string
): Promise<void> {
  const url = new URL(req.url);
  const ipRaw = req.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = crypto.createHash('sha256').update(ipRaw).digest('hex').slice(0, 16);

  await db.affiliateClicks.create({
    data: {
      id: clickId || crypto.randomUUID(),
      affiliateId,
      isFirstTouch,
      landingPage: url.pathname,
      referrer: req.headers.get('referer') || '',
      utmSource: url.searchParams.get('utm_source'),
      utmMedium: url.searchParams.get('utm_medium'),
      utmCampaign: url.searchParams.get('utm_campaign'),
      ipHash,
      userAgent: req.headers.get('user-agent') || '',
      timestamp: new Date(),
    },
  });
}
```

### 3.3 Conversion Attribution

```typescript
// services/affiliate-attribution.ts — Attribute conversion to affiliate
export async function attributeConversion(
  customerId: string,
  signupContext: SignupContext
): Promise<AttributionResult | null> {
  // Strategy 1: Cookie-based attribution
  const cookieData = signupContext.cookies?.['_{{PROJECT_NAME}}_aff'];
  if (cookieData) {
    try {
      const parsed = JSON.parse(cookieData);
      const clickAge = Date.now() - parsed.ts;
      const maxAge = {{AFFILIATE_COOKIE_DAYS}} * 24 * 60 * 60 * 1000;

      if (clickAge <= maxAge) {
        return {
          affiliateId: parsed.aid,
          clickId: parsed.cid,
          method: 'cookie',
          clickAge: Math.floor(clickAge / (1000 * 60 * 60 * 24)), // days
        };
      }
    } catch { /* invalid cookie data */ }
  }

  // Strategy 2: UTM-based attribution (fallback)
  if (signupContext.utmSource && signupContext.utmMedium === 'affiliate') {
    const affiliate = await db.affiliates.findUnique({
      where: { slug: signupContext.utmSource },
    });
    if (affiliate) {
      return {
        affiliateId: affiliate.id,
        clickId: null,
        method: 'utm',
        clickAge: null,
      };
    }
  }

  // Strategy 3: Referral code at signup
  if (signupContext.referralCode) {
    const affiliate = await db.affiliates.findUnique({
      where: { referralCode: signupContext.referralCode },
    });
    if (affiliate) {
      return {
        affiliateId: affiliate.id,
        clickId: null,
        method: 'referral_code',
        clickAge: null,
      };
    }
  }

  return null; // No affiliate attribution
}
```

---

## 4. Payout Rules

### 4.1 Payout Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Minimum payout threshold | $50 | Avoid micro-payouts and processing overhead |
| Payout frequency | Monthly (1st of each month) | Predictable for affiliates |
| Holdback period | 30 days after conversion | Churn/refund protection |
| Payment methods | Stripe Connect (ACH), PayPal, Wise | Cover US and international |
| Currency | USD (default), EUR, GBP | Match affiliate's preference |
| Maximum pending balance | $10,000 | Trigger early payout if exceeded |

### 4.2 Payout Schedule

| Event | Day | Action |
|-------|-----|--------|
| Conversion occurs | Day 0 | Commission recorded, status: "pending" |
| Holdback period ends | Day 30 | Status changes to "approved" |
| Payout batch generated | 1st of month | All "approved" commissions aggregated |
| Payout processed | 1st-3rd of month | Transfer initiated |
| Funds arrive | 3rd-5th of month | Affiliate receives payment |
| Statement available | 5th of month | Downloadable in dashboard |

---

## 5. Fraud Detection

### 5.1 Fraud Types and Detection

| Fraud Type | Description | Detection Method | Action |
|-----------|-------------|-----------------|--------|
| Cookie stuffing | Affiliate drops cookies without real clicks | Monitor click-to-impression ratio; flag < 0.1% | Suspend + investigate |
| Click fraud | Automated/bot clicks to inflate metrics | IP velocity, user agent analysis, click patterns | Block IP + warn |
| Self-referral | Affiliate signs up through own link | Match affiliate email to customer email | Void commission |
| Fake conversions | Affiliate creates fake accounts | Monitor account quality: no usage after trial | Void + clawback |
| Trademark bidding | Affiliate bids on your brand keywords in PPC | Monitor SEM landscape weekly | Warning → termination |
| Misleading content | Affiliate makes false product claims | Review affiliate content quarterly | Warning → termination |
| Multi-account | Affiliate runs multiple accounts for bonus stacking | Email domain, IP, payment method matching | Merge or terminate |

### 5.2 Fraud Detection Rules Engine

```typescript
// services/affiliate-fraud.ts
interface FraudCheck {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggered: boolean;
  details: string;
}

export async function runFraudChecks(
  affiliateId: string,
  period: { start: Date; end: Date }
): Promise<FraudCheck[]> {
  const checks: FraudCheck[] = [];

  // Check 1: Click velocity — too many clicks from same IP
  const clicksByIP = await db.affiliateClicks.groupBy({
    by: ['ipHash'],
    where: {
      affiliateId,
      timestamp: { gte: period.start, lte: period.end },
    },
    _count: true,
    orderBy: { _count: { ipHash: 'desc' } },
  });

  const suspiciousIPs = clicksByIP.filter(g => g._count > 50);
  if (suspiciousIPs.length > 0) {
    checks.push({
      type: 'click_velocity',
      severity: suspiciousIPs.some(ip => ip._count > 200) ? 'critical' : 'high',
      triggered: true,
      details: `${suspiciousIPs.length} IPs with >50 clicks (max: ${suspiciousIPs[0]?._count})`,
    });
  }

  // Check 2: Conversion rate anomaly — too high is suspicious
  const clicks = await db.affiliateClicks.count({
    where: { affiliateId, timestamp: { gte: period.start, lte: period.end } },
  });
  const conversions = await db.affiliateConversions.count({
    where: { affiliateId, timestamp: { gte: period.start, lte: period.end } },
  });
  const conversionRate = clicks > 0 ? conversions / clicks : 0;

  if (conversionRate > 0.15) { // >15% conversion is suspicious
    checks.push({
      type: 'conversion_rate_anomaly',
      severity: conversionRate > 0.30 ? 'critical' : 'medium',
      triggered: true,
      details: `Conversion rate: ${(conversionRate * 100).toFixed(1)}% (normal: 2-8%)`,
    });
  }

  // Check 3: Self-referral detection
  const affiliate = await db.affiliates.findUnique({ where: { id: affiliateId } });
  const selfReferrals = await db.customers.count({
    where: {
      affiliateId,
      email: { endsWith: `@${affiliate?.email.split('@')[1]}` },
    },
  });

  if (selfReferrals > 0) {
    checks.push({
      type: 'self_referral',
      severity: 'high',
      triggered: true,
      details: `${selfReferrals} conversions share email domain with affiliate`,
    });
  }

  // Check 4: Low-quality conversions — signups that never activate
  const inactiveConversions = await db.affiliateConversions.count({
    where: {
      affiliateId,
      timestamp: { gte: period.start, lte: period.end },
      customer: { lastActiveAt: null }, // Never logged in after signup
    },
  });
  const inactiveRate = conversions > 0 ? inactiveConversions / conversions : 0;

  if (inactiveRate > 0.5) { // >50% never activated
    checks.push({
      type: 'low_quality_conversions',
      severity: inactiveRate > 0.8 ? 'critical' : 'high',
      triggered: true,
      details: `${(inactiveRate * 100).toFixed(0)}% of conversions never activated`,
    });
  }

  return checks;
}
```

### 5.3 Fraud Response Matrix

| Severity | Automated Action | Human Action | Timeline |
|----------|-----------------|--------------|----------|
| Low | Flag in dashboard | Review during monthly audit | Next audit cycle |
| Medium | Hold pending commissions | Channel manager investigates | Within 5 business days |
| High | Suspend affiliate, hold all commissions | Senior review + affiliate contacted | Within 48 hours |
| Critical | Terminate affiliate, void all pending commissions | VP review, legal notification | Within 24 hours |

---

## 6. Affiliate Dashboard

### 6.1 Dashboard Components

| Component | Data Shown | Refresh Rate |
|-----------|-----------|-------------|
| Earnings summary | Total earned, pending, paid, this month | Real-time |
| Click stats | Clicks today, this week, this month, all-time | Real-time |
| Conversion stats | Conversions, conversion rate, average order value | Daily |
| Referral link | Unique link with copy button, link builder | Static |
| Performance chart | Clicks and conversions over time (line chart) | Daily |
| Top landing pages | Which pages convert best | Weekly |
| Commission log | Individual commission entries with status | Real-time |
| Payout history | Past payouts with downloadable statements | On payout |
| Creative assets | Banners, text links, email templates | Updated as available |
| Program news | Promotions, rate changes, new features | As published |

### 6.2 Affiliate Link Builder

```
Base URL:     https://{{PROJECT_NAME}}.com/?ref={{AFFILIATE_SLUG}}
Landing page: https://{{PROJECT_NAME}}.com/[page]?ref={{AFFILIATE_SLUG}}
With UTM:     https://{{PROJECT_NAME}}.com/?ref={{AFFILIATE_SLUG}}&utm_source={{AFFILIATE_SLUG}}&utm_medium=affiliate&utm_campaign=[campaign_name]
Short link:   https://{{PROJECT_NAME}}.com/go/{{AFFILIATE_SLUG}}
```

---

## 7. Terms & Conditions

### 7.1 Key Terms

| Term | Policy |
|------|--------|
| Cookie duration | {{AFFILIATE_COOKIE_DAYS}} days from first click |
| Commission rate | {{AFFILIATE_COMMISSION}}% of qualifying purchase |
| Payment schedule | Monthly, net-30 from conversion |
| Minimum payout | $50 USD |
| Self-referral | Prohibited — will result in commission voiding |
| Trademark bidding | Prohibited — do not bid on "{{PROJECT_NAME}}" or variations in PPC |
| Coupon/deal sites | Allowed only with prior written approval |
| Email marketing | Allowed only to opt-in lists; no purchased lists; must include unsubscribe |
| Content requirements | Must accurately represent {{PROJECT_NAME}} features and pricing |
| Termination | Either party, 30-day notice; immediate for fraud or ToS violation |
| Commission on termination | Pending commissions paid within 60 days if no fraud detected |
| Liability cap | Total commissions paid in the preceding 12 months |
| Governing law | [Your jurisdiction] |

### 7.2 Prohibited Activities

- [ ] Bidding on {{PROJECT_NAME}} brand keywords or misspellings in paid search
- [ ] Using {{PROJECT_NAME}} trademark in domain names
- [ ] Making false or misleading claims about {{PROJECT_NAME}} features or pricing
- [ ] Sending unsolicited emails (spam) promoting {{PROJECT_NAME}}
- [ ] Cookie stuffing or any form of artificial click/conversion inflation
- [ ] Creating fake reviews or testimonials
- [ ] Incentivizing clicks or signups without genuine interest
- [ ] Using malware, adware, or browser extensions to inject affiliate links
- [ ] Purchasing traffic from bot networks or click farms
- [ ] Impersonating {{PROJECT_NAME}} or creating sites that could be confused with {{PROJECT_NAME}}

---

## 8. Affiliate Program Checklist

- [ ] Affiliate platform selected and configured (custom or SaaS)
- [ ] Commission structure defined (rate, model, tiers)
- [ ] Cookie tracking implemented (first-party, server-set, {{AFFILIATE_COOKIE_DAYS}}-day duration)
- [ ] Conversion attribution logic deployed (cookie + UTM + referral code)
- [ ] Payout rules configured (minimum threshold, holdback, frequency)
- [ ] Payment processing integrated (Stripe Connect / PayPal / Wise)
- [ ] Fraud detection rules engine deployed
- [ ] Fraud response matrix documented and escalation paths defined
- [ ] Affiliate dashboard built with all required components
- [ ] Affiliate link builder functional with UTM parameter support
- [ ] Creative assets (banners, text links) created and uploaded
- [ ] Terms and conditions drafted and reviewed by legal
- [ ] Prohibited activities list published and enforceable
- [ ] Affiliate application form deployed
- [ ] Affiliate approval workflow configured
- [ ] Tax document collection (W-9 / W-8BEN) integrated
- [ ] Monthly fraud audit scheduled
- [ ] Quarterly content compliance review scheduled

<!-- ENDIF -->
