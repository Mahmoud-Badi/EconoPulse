# Analytics Platform Setup Guide for {{PROJECT_NAME}}

> **Project:** {{PROJECT_NAME}}
> **Product Type:** {{PRODUCT_TYPE}}
> **Tech Stack:** {{TECH_STACK}}
> **Date:** {{DATE}}

---

## Analytics Tool Selection

You do not need every analytics tool. You need the right one (or two) for your stage and product type. Here is how to choose.

### Option 1: Google Analytics 4 (GA4) — Free

**Best for:** Website traffic analysis, marketing channel attribution, SEO tracking, e-commerce conversion tracking.

| Aspect | Details |
|--------|---------|
| **Cost** | Free (GA4 standard); GA360 is enterprise-paid |
| **Best Use Case** | Marketing website analytics, traffic sources, content performance |
| **Strengths** | Free, massive ecosystem, Google Ads integration, SEO data via Search Console |
| **Weaknesses** | Steep learning curve, limited product analytics, data sampling on free tier at high volume |
| **Install Difficulty** | Easy (tag-based) |
| **Data Retention** | 2 months (free) or 14 months (configurable) |

**When to use GA4:** Always. Even if you use another tool for product analytics, GA4 should track your marketing website.

### Option 2: Mixpanel — Free Tier Available

**Best for:** Product analytics, user behavior tracking, funnel analysis, retention curves, A/B test analysis.

| Aspect | Details |
|--------|---------|
| **Cost** | Free up to 20M events/month; Growth plan from $28/mo |
| **Best Use Case** | Tracking user behavior inside your product |
| **Strengths** | Powerful funnel and retention analysis, user-level insights, easy segmentation |
| **Weaknesses** | Not great for general website traffic, learning curve for advanced features |
| **Install Difficulty** | Medium (SDK integration) |
| **Data Retention** | Unlimited on free tier |

### Option 3: PostHog — Free Self-Hosted

**Best for:** All-in-one product analytics with session replay, feature flags, and A/B testing built in.

| Aspect | Details |
|--------|---------|
| **Cost** | Free (self-hosted, unlimited); Cloud: free up to 1M events/month, then usage-based |
| **Best Use Case** | Teams that want analytics + session replay + feature flags in one tool |
| **Strengths** | Open-source, self-hosted option for data privacy, session replays, feature flags, experiments |
| **Weaknesses** | Self-hosted requires DevOps knowledge, UI less polished than Mixpanel |
| **Install Difficulty** | Easy (cloud) / Medium (self-hosted) |
| **Data Retention** | Unlimited (self-hosted) |

### Option 4: Plausible / Fathom — Paid

**Best for:** Privacy-first, simple website analytics. GDPR/CCPA compliant without cookie consent banners.

| Aspect | Details |
|--------|---------|
| **Cost** | Plausible: $9/mo (10K pageviews); Fathom: $14/mo (100K pageviews) |
| **Best Use Case** | Simple, clean website analytics without privacy concerns |
| **Strengths** | No cookies needed, no consent banners, lightweight script, simple dashboard |
| **Weaknesses** | No product analytics, limited segmentation, no funnels or user-level data |
| **Install Difficulty** | Very easy (single script tag) |

### Option 5: Amplitude — Free Tier Available

**Best for:** Behavioral analytics, user cohort analysis, data-driven product decisions at scale.

| Aspect | Details |
|--------|---------|
| **Cost** | Free up to 50K monthly tracked users; Growth plan custom-priced |
| **Best Use Case** | Data-heavy product teams that need behavioral cohorts and experiment analysis |
| **Strengths** | Powerful behavioral cohorts, journey mapping, predictive analytics |
| **Weaknesses** | Can be overwhelming for small teams, better suited for established products |
| **Install Difficulty** | Medium (SDK integration) |

### Decision Matrix

| Use Case | Recommended Tool |
|----------|-----------------|
| Marketing website only | GA4 (free) |
| Marketing website + privacy focus | GA4 + Plausible |
| SaaS product analytics | Mixpanel or PostHog |
| All-in-one (analytics + replay + flags) | PostHog |
| Marketing + product (two tools) | GA4 + Mixpanel |
| Budget: $0 | GA4 + PostHog (self-hosted) or GA4 + Mixpanel (free tier) |

**Recommendation for {{PROJECT_NAME}}:** GA4 for your marketing site. Add Mixpanel or PostHog for product analytics when you have users.

---

## GA4 Setup Guide

### Step 1: Property Creation

1. Go to analytics.google.com and sign in with your Google account.
2. Click "Admin" (gear icon, bottom left).
3. Click "Create Property".
4. Enter property name: "{{PROJECT_NAME}} — Production".
5. Set timezone and currency to match your business.
6. Select your industry category and business size.
7. Click "Create" — you now have a GA4 property.

### Step 2: Data Stream Setup

1. In Admin > Data Streams, click "Add stream".
2. Select "Web".
3. Enter your website URL: {{PROJECT_URL}}.
4. Enter stream name: "{{PROJECT_NAME}} Website".
5. Enable Enhanced Measurement (captures scrolls, outbound clicks, site search, video engagement, file downloads automatically).
6. Click "Create stream".
7. Copy your **Measurement ID** (format: G-XXXXXXXXXX). You will need this for installation.

### Step 3: Tag Installation

**Option A: Google Tag Manager (Recommended)**

1. Create a GTM account at tagmanager.google.com.
2. Create a container for your website.
3. Install the GTM snippet on every page of your site (in the `<head>` tag).
4. In GTM: create a new tag > Google Analytics: GA4 Configuration.
5. Enter your Measurement ID (G-XXXXXXXXXX).
6. Trigger: All Pages.
7. Submit and publish.

**Option B: Direct gtag.js (Simpler)**

Add this code to the `<head>` section of every page:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Option C: Framework-Specific (Next.js, React, etc.)**

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
For Next.js (App Router):
```jsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```
<!-- ENDIF -->

### Step 4: Key Events to Configure

Configure these events in GA4 (Admin > Events):

**Standard Events (auto-tracked with Enhanced Measurement):**

| Event | What It Tracks |
|-------|---------------|
| page_view | Every page load |
| scroll | User scrolls past 90% of page |
| click (outbound) | Clicks to external domains |
| site_search | On-site search queries |
| file_download | PDF, doc, spreadsheet downloads |
| video_start / video_progress / video_complete | Video engagement |

**Custom Events to Create for {{PROJECT_NAME}}:**

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| sign_up | User creates account | method (google, email, github) |
| login | User logs in | method |
| purchase | User completes payment | value, currency, plan_name |
| trial_started | User begins free trial | plan_name, trial_length |
| feature_used | User uses key feature | feature_name, usage_count |
| plan_selected | User clicks a pricing plan | plan_name, plan_price, billing_period |
| onboarding_completed | User finishes setup flow | steps_completed, time_to_complete |
| upgrade_clicked | User clicks upgrade CTA | current_plan, target_plan |
| form_submitted | Any form submission | form_name, form_location |
| cta_clicked | Key CTA button click | cta_text, cta_location, page_url |

**Implementation (via gtag.js):**
```javascript
// Example: Track signup
gtag('event', 'sign_up', {
  method: 'email',
  page_location: window.location.href
});

// Example: Track purchase
gtag('event', 'purchase', {
  value: 29.00,
  currency: 'USD',
  plan_name: 'pro',
  billing_period: 'monthly'
});

// Example: Track feature usage
gtag('event', 'feature_used', {
  feature_name: 'export_report',
  usage_count: 1
});
```

### Step 5: Conversion Tracking

Mark key events as conversions in GA4:

1. Go to Admin > Conversions (or Admin > Events).
2. Toggle "Mark as conversion" for these events:
   - sign_up
   - purchase
   - trial_started
   - demo_requested
   - form_submitted (for lead gen forms)

### Step 6: Audience Creation

Create these audiences for analysis and remarketing:

| Audience Name | Criteria | Use |
|--------------|----------|-----|
| Trial Users | triggered sign_up event AND plan = "trial" | Retargeting, conversion analysis |
| Pricing Page Visitors | visited /pricing AND did NOT trigger purchase | High-intent retargeting |
| Engaged Visitors | 3+ sessions in 7 days OR 5+ page views per session | Lookalike audience seed |
| Churned Users | Was "Customer" audience AND no login in 30 days | Win-back campaigns |
| Blog Readers | visited /blog/* 3+ times | Content remarketing |

### Step 7: Dashboard Setup

Create these reports in GA4 (Explore or custom reports):

1. **Traffic Overview:** Sessions, users, new users by channel (last 30 days, compare to previous period).
2. **Content Performance:** Top pages by views, engagement rate, average engagement time.
3. **Conversion Funnel:** Landing page → pricing page → sign_up → purchase.
4. **Acquisition Channels:** Organic search, direct, social, paid, referral — with conversion rates per channel.
5. **User Demographics:** Geography, device, browser (for optimization decisions).

---

## Product Analytics Setup (Mixpanel / PostHog)

### SDK Installation

**Mixpanel — JavaScript:**
```javascript
// Install: npm install mixpanel-browser
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_PROJECT_TOKEN', {
  track_pageview: true,
  persistence: 'localStorage'
});
```

**PostHog — JavaScript:**
```javascript
// Install: npm install posthog-js
import posthog from 'posthog-js';

posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com',  // or your self-hosted URL
  capture_pageview: true,
  capture_pageleave: true
});
```

**React Integration (both tools):**
```jsx
// Wrap your app with the provider
import { PostHogProvider } from 'posthog-js/react';
// or for Mixpanel, initialize in a useEffect in your root component

function App() {
  return (
    <PostHogProvider client={posthogClient}>
      <YourApp />
    </PostHogProvider>
  );
}
```

### Identity Management

**Anonymous → Identified Users:**

When a user first visits, they are anonymous (random ID). When they sign up or log in, you identify them:

```javascript
// On signup or login — Mixpanel
mixpanel.identify(userId);
mixpanel.people.set({
  $email: user.email,
  $name: user.name,
  plan: user.plan,
  signup_date: user.createdAt
});

// On signup or login — PostHog
posthog.identify(userId, {
  email: user.email,
  name: user.name,
  plan: user.plan,
  signup_date: user.createdAt
});
```

**Why This Matters:** Without identification, you see anonymous sessions. With it, you see the complete user journey: anonymous browsing → signup → product usage → conversion.

### Event Tracking Plan

Define ALL events before implementing. This prevents inconsistent naming and missing data.

| Event Name | When Fired | Properties | Category |
|------------|-----------|------------|----------|
| page_viewed | Every page load | page_url, page_title, referrer | Navigation |
| signed_up | Account created | method, referral_source, plan | Acquisition |
| logged_in | User logs in | method, time_since_last_login | Engagement |
| onboarding_started | Begins setup flow | — | Activation |
| onboarding_step_completed | Each step done | step_number, step_name | Activation |
| onboarding_completed | All steps done | time_to_complete, steps_skipped | Activation |
| feature_used | Uses a product feature | feature_name, duration, success | Engagement |
| invited_team_member | Sends invite | invite_count, role | Expansion |
| plan_upgraded | Upgrades to higher plan | from_plan, to_plan, value | Revenue |
| plan_downgraded | Downgrades plan | from_plan, to_plan, value | Revenue |
| subscription_cancelled | Cancels subscription | reason, months_active, plan | Churn |
| support_ticket_created | Submits support request | category, priority | Support |
| nps_submitted | Completes NPS survey | score, comment | Feedback |

### Funnel Creation

Create these funnels in your product analytics tool:

**Acquisition Funnel:**
```
Website Visit → Sign Up Page View → Sign Up Completed → First Login
```

**Activation Funnel:**
```
First Login → Onboarding Started → Core Feature Used → "Aha Moment" Reached
```

**Conversion Funnel:**
```
Free User → Pricing Page View → Plan Selected → Payment Completed
```

**Engagement Funnel:**
```
Login → Feature Used → Session > 5 min → Return Within 7 Days
```

---

## Tag Manager Setup

### Google Tag Manager Architecture

```
GTM Container
├── Tags
│   ├── GA4 Configuration (fires on all pages)
│   ├── GA4 Event: sign_up (fires on signup confirmation)
│   ├── GA4 Event: purchase (fires on payment confirmation)
│   ├── Meta Pixel (fires on all pages)
│   ├── Meta Conversion: Lead (fires on form submission)
│   ├── LinkedIn Insight Tag (fires on all pages)
│   └── Custom HTML: Mixpanel init (fires on all pages)
├── Triggers
│   ├── All Pages (pageview)
│   ├── Signup Confirmation (pageview: /signup/confirm)
│   ├── Payment Success (pageview: /payment/success OR dataLayer event)
│   ├── Form Submit (form submission trigger)
│   ├── CTA Click (click trigger on .cta-button class)
│   └── Scroll Depth 50% (scroll trigger)
└── Variables
    ├── GA4 Measurement ID (constant)
    ├── Meta Pixel ID (constant)
    ├── Page URL (built-in)
    ├── Click Text (built-in)
    ├── Data Layer: userId (dataLayer variable)
    ├── Data Layer: planName (dataLayer variable)
    └── Data Layer: purchaseValue (dataLayer variable)
```

### Sending Data to GTM from Your App

Push events to the GTM dataLayer so tags can fire on specific actions:

```javascript
// Push signup event to dataLayer
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'sign_up',
  method: 'email',
  userId: user.id
});

// Push purchase event to dataLayer
window.dataLayer.push({
  event: 'purchase',
  value: 29.00,
  currency: 'USD',
  plan_name: 'pro',
  userId: user.id
});
```

---

## Privacy Compliance

### Cookie Consent Integration

If you use GA4 (which sets cookies), you need cookie consent in the EU (GDPR) and California (CCPA):

**Option 1: Google Consent Mode v2**
- Install a Consent Management Platform (CMP): Cookiebot, OneTrust, or CookieYes.
- Configure GTM to use Google Consent Mode — tags only fire after consent is granted.
- Default behavior: anonymized data collection without cookies until consent is given.

**Option 2: Privacy-First Analytics**
- Use Plausible or Fathom instead of GA4 — no cookies, no consent needed.
- Combine with server-side analytics for product data.

**Option 3: Anonymous Mode**
- Configure GA4 to NOT collect IP addresses.
- Disable User-ID tracking.
- Set data retention to minimum (2 months).
- Still technically requires consent in strict GDPR interpretation.

### Data Retention Settings

| Tool | Recommended Setting | How to Configure |
|------|-------------------|-----------------|
| GA4 | 14 months | Admin > Data Settings > Data Retention |
| Mixpanel | Match your privacy policy | Project Settings > Data Management |
| PostHog | Self-hosted: unlimited; Cloud: configure per project | Project Settings |

---

## Analytics Setup Checklist for {{PROJECT_NAME}}

### Phase 1: Foundation (Before Launch)

- [ ] Select analytics tools for {{PROJECT_NAME}}: ____________________
- [ ] Create GA4 property and data stream
- [ ] Install GTM container on website
- [ ] Configure GA4 tag in GTM
- [ ] Verify pageview tracking is working (check real-time report)
- [ ] Set up Enhanced Measurement events
- [ ] Configure cookie consent (if applicable for your market)
- [ ] Set data retention period

### Phase 2: Event Tracking (Launch Week)

- [ ] Define event tracking plan (list all events with naming conventions)
- [ ] Implement custom events: sign_up, login, purchase
- [ ] Mark key events as conversions in GA4
- [ ] Set up product analytics SDK (Mixpanel/PostHog) if applicable
- [ ] Implement user identification (anonymous → known)
- [ ] Test all events with real actions (verify data appears)

### Phase 3: Audiences & Funnels (Week 2-3)

- [ ] Create key audiences in GA4 (trial users, pricing visitors, churned)
- [ ] Build conversion funnels in product analytics
- [ ] Set up UTM tracking for all campaigns (see conversion-tracking.template.md)
- [ ] Connect GA4 to Google Ads (if running ads)
- [ ] Install Meta Pixel and LinkedIn Insight Tag (if applicable)

### Phase 4: Dashboards & Reporting (Week 4)

- [ ] Build GA4 dashboard with key marketing metrics
- [ ] Build product analytics dashboard with activation and retention metrics
- [ ] Set up weekly email reports
- [ ] Schedule first analytics review meeting
- [ ] Document tracking plan for team reference

### Selected Tools for {{PROJECT_NAME}}

| Category | Tool | Status |
|----------|------|--------|
| Website Analytics | _________________ | Not started / In progress / Complete |
| Product Analytics | _________________ | Not started / In progress / Complete |
| Tag Management | _________________ | Not started / In progress / Complete |
| Privacy / Consent | _________________ | Not started / In progress / Complete |
| Ad Tracking | _________________ | Not started / In progress / Complete |

---

*This analytics setup guide is part of the {{PROJECT_NAME}} Master Starter Kit — Marketing section.*
*Last updated: {{DATE}}*
