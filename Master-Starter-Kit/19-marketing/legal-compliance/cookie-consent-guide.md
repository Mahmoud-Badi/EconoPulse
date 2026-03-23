# Cookie Consent Guide

> A comprehensive guide to implementing cookie consent that complies with GDPR, the ePrivacy Directive, and global privacy regulations. Covers cookie types, consent management platforms, technical implementation, and auditing.

---

## Table of Contents

1. [What Are Cookies and Why Consent Matters](#what-are-cookies-and-why-consent-matters)
2. [Cookie Types and Categories](#cookie-types-and-categories)
3. [Legal Requirements](#legal-requirements)
4. [Consent Management Platforms](#consent-management-platforms)
5. [Cookie Banner Design](#cookie-banner-design)
6. [Technical Implementation](#technical-implementation)
7. [Consent Storage and Records](#consent-storage-and-records)
8. [Cookie Auditing](#cookie-auditing)
9. [Common Mistakes](#common-mistakes)
10. [Implementation Checklist](#implementation-checklist)

---

## What Are Cookies and Why Consent Matters

Cookies are small text files stored on a user's device by their web browser. They serve many purposes, from keeping a user logged in to tracking their behavior across websites for advertising.

**Why consent matters:**
- The EU ePrivacy Directive (the "Cookie Law") requires informed consent before placing non-essential cookies
- GDPR adds requirements around how consent is obtained, stored, and withdrawn
- Fines for non-compliance can reach EUR 20 million or 4% of global annual revenue
- Browsers are increasingly blocking third-party cookies by default, making proper consent implementation even more important for first-party data strategy

**Beyond the EU:**
- Brazil (LGPD): Requires consent for cookies used for tracking
- South Africa (POPIA): Requires consent for processing personal data via cookies
- California (CCPA/CPRA): Does not require cookie consent banners per se, but cookies that "sell" or "share" personal information require opt-out mechanisms
- Many other jurisdictions are adopting similar requirements

---

## Cookie Types and Categories

Cookies are categorized by their purpose. The category determines whether consent is required.

### Strictly Necessary Cookies

**Consent required:** No (exempt from consent requirements)

These cookies are essential for the website to function. Without them, the site or requested service cannot be provided.

| Example | Purpose |
|---------|---------|
| Session cookies | Maintain user login state |
| CSRF tokens | Prevent cross-site request forgery |
| Load-balancing cookies | Distribute traffic across servers |
| Shopping cart cookies | Remember items in a shopping cart |
| Cookie consent preferences | Store the user's cookie consent choice |
| Authentication cookies | Verify user identity |

**Important:** You cannot label marketing or analytics cookies as "strictly necessary" to avoid consent requirements. Regulators actively audit these classifications.

### Functional / Preference Cookies

**Consent required:** Yes

These cookies remember user preferences and choices to provide enhanced features.

| Example | Purpose |
|---------|---------|
| Language preference | Remember the user's language choice |
| Region/location | Remember the user's location for relevant content |
| UI customization | Remember theme, layout, or display preferences |
| Username remember | Pre-fill login forms |
| Video player preferences | Remember playback quality settings |

### Analytics / Performance Cookies

**Consent required:** Yes (with some exceptions, see below)

These cookies collect information about how visitors use the website.

| Example | Purpose |
|---------|---------|
| Google Analytics (_ga, _gid) | Page views, sessions, user behavior |
| Mixpanel | Event tracking and user analytics |
| Hotjar | Heatmaps and session recordings |
| Amplitude | Product analytics |
| Plausible Analytics | Privacy-focused analytics (may be exempt in some interpretations) |

**Exception for analytics:** Some EU data protection authorities (notably France's CNIL and Germany's DSK) have indicated that strictly anonymized, first-party analytics may be exempt from consent requirements if they meet certain criteria:
- Strictly limited to audience measurement
- No cross-site tracking
- No data sharing with third parties
- Data is anonymized or aggregated
- Users are informed and can object

Privacy-focused analytics tools like Plausible, Fathom, and Simple Analytics are designed to meet these criteria, but consult local guidance for your specific jurisdiction.

### Marketing / Targeting Cookies

**Consent required:** Yes (always)

These cookies track users across websites to build profiles for targeted advertising.

| Example | Purpose |
|---------|---------|
| Facebook Pixel (_fbp) | Track conversions and build audiences for Facebook Ads |
| Google Ads (conversion tracking) | Track conversions from Google Ads campaigns |
| LinkedIn Insight Tag | Track conversions and demographics for LinkedIn Ads |
| Twitter pixel | Track conversions for Twitter Ads |
| Doubleclick cookies | Google advertising network tracking |
| Retargeting pixels | Show ads to previous visitors on other sites |

### Third-Party Cookies

Third-party cookies are set by domains other than the one the user is visiting. They are primarily used for cross-site tracking and advertising. Major browsers are restricting or eliminating third-party cookies:

- **Safari:** Blocks third-party cookies by default (since 2020)
- **Firefox:** Blocks third-party cookies by default (since 2022)
- **Chrome:** Phasing out third-party cookies (using Privacy Sandbox APIs instead)

---

## Legal Requirements

### GDPR Cookie Requirements

Under GDPR, cookies that process personal data require:

1. **Prior consent** -- Cookies must not be placed until the user gives consent (except strictly necessary cookies)
2. **Informed consent** -- Users must be told what cookies are used, their purpose, and who sets them
3. **Specific consent** -- Consent must be granular (users should be able to accept some categories and reject others)
4. **Freely given consent** -- Access to the site must not be conditional on accepting cookies (no "cookie walls" in most jurisdictions)
5. **Unambiguous consent** -- Requires a clear affirmative action. Scrolling, continuing to browse, or pre-ticked boxes do not constitute consent
6. **Easy withdrawal** -- It must be as easy to withdraw consent as it is to give it
7. **Documented consent** -- You must be able to demonstrate that consent was given

### ePrivacy Directive (EU Cookie Law)

The ePrivacy Directive (2002/58/EC, amended by 2009/136/EC) specifically addresses cookies and electronic communications:

- Requires informed consent before storing or accessing information on a user's device
- Exempts cookies that are strictly necessary
- Implemented differently in each EU member state (national transposition laws vary)
- The forthcoming ePrivacy Regulation will replace this directive and harmonize rules across the EU

### Key Regulatory Guidance

| Authority | Key Guidance |
|-----------|-------------|
| CNIL (France) | Cookie walls generally prohibited; accept/reject buttons must be equally prominent; "continue without accepting" is acceptable |
| ICO (UK) | Analytics cookies require consent; implied consent (scrolling/browsing) is not valid |
| DSK (Germany) | Strict interpretation; analytics require consent; design must not nudge toward acceptance |
| AEPD (Spain) | "Continue browsing" is not valid consent; requires granular cookie categories |
| Garante (Italy) | Specific guidelines on cookie banner design and scroll-based consent (not accepted) |

### CCPA/CPRA and Cookies

CCPA/CPRA does not require cookie consent banners, but:
- If cookies "sell" or "share" personal information, you must provide a "Do Not Sell or Share My Personal Information" link
- The Global Privacy Control (GPC) browser signal must be honored as a valid opt-out request
- You must disclose cookie-based data collection in your privacy policy

---

## Consent Management Platforms

A Consent Management Platform (CMP) handles cookie consent collection, storage, and enforcement.

### Popular CMPs

| Platform | Free Tier | Paid From | Best For |
|----------|-----------|-----------|----------|
| **Cookiebot** | Up to 1 page | ~$12/month | Small to medium sites; automatic cookie scanning |
| **OneTrust** | No free tier | Custom pricing | Enterprise; comprehensive privacy management |
| **cookie-script** | Up to 30 pages | ~$8/month | Budget-friendly; easy setup |
| **Osano** | Limited free tier | ~$99/month | Mid-market; compliance monitoring |
| **Termly** | Free basic banner | ~$10/month | Simple implementation; policy generation |
| **CookieYes** | Free up to 100 pages | ~$10/month | User-friendly; good Wordpress integration |
| **Complianz** (WordPress) | Free plugin | ~$45/year (pro) | WordPress sites; good EU compliance |
| **Klaro** | Open source (free) | N/A | Developers who want full control; self-hosted |
| **Tarteaucitron** | Open source (free) | N/A | French-developed; CNIL-compliant by design |

### CMP Selection Criteria

When choosing a CMP, evaluate:

- [ ] **Automatic cookie scanning** -- Can it detect all cookies on your site?
- [ ] **Granular consent categories** -- Can users accept/reject by category?
- [ ] **Consent storage** -- Where and how long are consent records stored?
- [ ] **TCF 2.0 support** -- IAB Transparency and Consent Framework compliance (important for ad-supported sites)
- [ ] **GPC signal support** -- Does it honor the Global Privacy Control signal?
- [ ] **Multi-language support** -- Can it display in all languages your site supports?
- [ ] **Customization** -- Can you match the banner to your site's design?
- [ ] **Performance impact** -- What is the page load impact?
- [ ] **Cookie blocking before consent** -- Does it actually prevent cookies from being set before consent, or just display a banner?
- [ ] **Integration** -- Does it integrate with your tag manager (GTM, Segment)?
- [ ] **Reporting** -- Does it provide consent analytics (acceptance rates, withdrawal rates)?
- [ ] **Pricing scalability** -- How does pricing change as your traffic grows?

---

## Cookie Banner Design

### Required Elements

Every cookie banner must include:

1. **Clear statement** that the site uses cookies
2. **Purpose categories** of cookies used (at minimum: necessary, analytics, marketing)
3. **Accept button** for consenting to all cookies
4. **Reject/Decline button** for declining non-essential cookies (must be equally prominent as Accept)
5. **Manage preferences** link to granular controls
6. **Link to cookie policy** with full details
7. **Link to privacy policy**

### Design Best Practices

**Do:**
- Make Accept and Reject buttons visually equal (same size, similar prominence)
- Use clear, plain language (not legalese)
- Show the banner on every page until the user makes a choice
- Allow users to change their preferences at any time (persistent link in footer)
- Default all non-essential cookies to "off" until consent is given
- Load the banner before any non-essential cookies fire

**Do NOT:**
- Use pre-selected checkboxes for any non-essential category
- Make the Reject button harder to find or click than Accept
- Use "dark patterns" to nudge users toward acceptance (e.g., making Reject a text link while Accept is a button)
- Block access to the entire site if cookies are rejected ("cookie walls" are prohibited in most EU jurisdictions)
- Count scrolling or continued browsing as consent
- Use confusing language like "By continuing to use this site, you consent to cookies"
- Bundle cookie consent with other consents

### Banner Layout Examples

**Pattern 1: Bottom bar (most common)**
```
[Banner at bottom of page]
We use cookies to improve your experience.
[Manage Preferences] [Reject All] [Accept All]
```

**Pattern 2: Center modal**
```
[Modal overlay]
Cookie Preferences
We use cookies for the following purposes:
☐ Analytics (understand how you use our site)
☐ Marketing (show relevant ads)
☑ Necessary (required for the site to work) [greyed out, always on]
[Reject All] [Save Preferences] [Accept All]
```

**Pattern 3: Side panel**
```
[Slide-in panel from the side]
Detailed category list with toggle switches
[Save and Close]
```

---

## Technical Implementation

### Step 1: Audit Your Cookies

Before implementing consent, identify all cookies your site uses:

1. Clear all cookies in your browser
2. Visit your site and browse through all pages
3. Check browser DevTools (Application > Cookies) for all cookies set
4. Categorize each cookie by type (necessary, functional, analytics, marketing)
5. Document: cookie name, domain, purpose, duration, category, first-party vs third-party

Tools for automated scanning:
- Cookiebot scanner (free for single scans)
- CookieMetrix
- Cookie-Script scanner
- Browser extensions (EditThisCookie, Cookie-Editor)

### Step 2: Implement Cookie Blocking

Cookies must be blocked BEFORE consent is given. There are several approaches:

**Approach 1: Tag Manager with Consent Mode**

Google Tag Manager supports consent mode. Configure triggers to only fire tags after consent is granted.

```javascript
// Initialize consent mode (before GTM loads)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted'  // Always allowed
});
```

When the user grants consent:
```javascript
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'ad_storage': 'granted'
});
```

**Approach 2: Script Blocking**

Modify script tags to prevent them from executing until consent is given:

```html
<!-- Before: Script loads immediately -->
<script src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

<!-- After: Script is blocked until consent -->
<script type="text/plain" data-cookiecategory="analytics"
        data-src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

Your CMP then changes the `type` attribute to `text/javascript` when consent is granted.

**Approach 3: Conditional Loading (Server-Side)**

For server-rendered applications, conditionally include scripts based on consent status stored in a cookie:

```javascript
// Check consent before rendering analytics script
if (getConsentStatus('analytics') === 'granted') {
  // Render analytics script
}
```

### Step 3: Implement the Consent Banner

**Using a CMP (recommended for most projects):**

Most CMPs provide a script tag to add to your site's `<head>`:

```html
<!-- Example: Cookiebot -->
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
        data-cbid="YOUR-DOMAIN-GROUP-ID"
        data-blockingmode="auto" type="text/javascript"></script>

<!-- Example: cookie-script -->
<script type="text/javascript"
        src="https://cdn.cookie-script.com/s/YOUR-ID.js"></script>
```

**Custom implementation (for developers who want full control):**

```javascript
class CookieConsent {
  constructor() {
    this.consentKey = 'cookie_consent';
    this.categories = ['necessary', 'functional', 'analytics', 'marketing'];
  }

  getConsent() {
    const stored = localStorage.getItem(this.consentKey);
    return stored ? JSON.parse(stored) : null;
  }

  setConsent(preferences) {
    const consent = {
      preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
    this.applyConsent(preferences);
  }

  applyConsent(preferences) {
    // Enable/disable cookie categories based on preferences
    if (preferences.analytics) {
      this.loadAnalytics();
    }
    if (preferences.marketing) {
      this.loadMarketing();
    }
  }

  loadAnalytics() {
    // Dynamically load analytics scripts
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_ID';
    document.head.appendChild(script);
  }

  loadMarketing() {
    // Dynamically load marketing scripts
  }

  showBanner() {
    if (!this.getConsent()) {
      // Display cookie consent banner
    }
  }
}
```

### Step 4: Handle Consent Changes

Users must be able to change their consent at any time:

```javascript
// Provide a way to reopen the consent dialog
document.getElementById('cookie-settings-link').addEventListener('click', () => {
  cookieConsent.showPreferences();
});

// When consent is withdrawn, remove the relevant cookies
function removeAnalyticsCookies() {
  const analyticsCookies = ['_ga', '_gid', '_gat', '__utma', '__utmb', '__utmc', '__utmz'];
  analyticsCookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
  });
}
```

---

## Consent Storage and Records

### What to Store

For each user's consent, store:

| Field | Description | Example |
|-------|-------------|---------|
| Consent ID | Unique identifier for this consent record | `uuid-v4` |
| Timestamp | When consent was given/updated | `2025-03-15T14:30:00Z` |
| Categories accepted | Which cookie categories were accepted | `["necessary", "analytics"]` |
| Categories rejected | Which cookie categories were rejected | `["marketing", "functional"]` |
| Consent method | How consent was given | `banner_click`, `preferences_save` |
| User agent | Browser and OS information | `Mozilla/5.0...` |
| IP address (hashed) | For geographic compliance verification | `sha256(ip)` |
| Banner version | Which version of the consent banner was shown | `v2.1` |
| Policy version | Which version of the cookie policy was in effect | `2025-03` |

### Storage Duration

- Store consent records for the duration of the consent plus at least 3 years (to demonstrate compliance if audited)
- Re-prompt for consent periodically (every 6-12 months is common practice)
- Re-prompt when your cookie policy changes significantly

### Where to Store

- **Client-side:** Cookie or localStorage for quick checking on page load
- **Server-side:** Database or CMP's cloud storage for audit trail and compliance evidence
- Both are recommended: client-side for functionality, server-side for accountability

---

## Cookie Auditing

### Regular Audit Schedule

| Frequency | Action |
|-----------|--------|
| Monthly | Spot-check that consent banner is functioning correctly |
| Quarterly | Full cookie scan to detect new or changed cookies |
| After any deployment | Verify no new unconsented cookies were introduced |
| Annually | Complete review of cookie policy, categories, and consent flows |

### Audit Process

1. **Scan your site** using an automated cookie scanner
2. **Compare results** against your documented cookie inventory
3. **Identify new cookies** -- any cookies not in your inventory are potentially non-compliant
4. **Classify new cookies** into the appropriate consent category
5. **Update your cookie policy** to reflect any changes
6. **Test consent blocking** -- verify that non-essential cookies are actually blocked until consent is given
7. **Test consent withdrawal** -- verify that cookies are removed when consent is withdrawn
8. **Document the audit** with date, findings, and actions taken

### Common Audit Findings

- Third-party scripts loading additional cookies not documented in your policy
- Cookie durations changing without notice
- New cookies introduced by CMS plugins or updates
- Analytics cookies firing before consent is granted
- Cookie consent preferences not being respected after page navigation
- Consent banner not appearing on all pages (especially newly created pages)

---

## Common Mistakes

### Mistake 1: "Cookie Wall" -- Blocking Access Without Consent
Blocking users from accessing your site entirely unless they accept cookies is prohibited in most EU jurisdictions. Users must be able to access your content even if they reject non-essential cookies.

### Mistake 2: Pre-Checked Consent Boxes
All non-essential cookie categories must be unchecked by default. The user must actively opt in. The Planet49 ruling (CJEU, 2019) explicitly confirmed that pre-ticked checkboxes do not constitute valid consent.

### Mistake 3: No Actual Cookie Blocking
Displaying a cookie banner without actually blocking cookies until consent is given is not compliant. The banner must control actual cookie behavior, not just serve as a notice.

### Mistake 4: Treating "Continue Browsing" as Consent
Scrolling, clicking a link, or continuing to browse does not constitute valid consent under GDPR. Consent must be an affirmative action specifically related to cookie acceptance.

### Mistake 5: Making Rejection Harder Than Acceptance
If accepting all cookies requires one click, rejecting all cookies should also require one click. Requiring users to go through multiple screens to reject cookies while offering a single "Accept All" button is a dark pattern and is being actively enforced against.

### Mistake 6: Ignoring Cookie Consent for SPAs
Single Page Applications (React, Vue, Angular) need special attention because page navigation does not trigger new page loads. Ensure your consent mechanism works correctly with client-side routing.

### Mistake 7: Not Re-prompting After Policy Changes
When you add new cookie categories or change your cookie usage significantly, existing consent is no longer valid for the new purposes. You must re-prompt users.

### Mistake 8: Forgetting the Footer Link
Users must be able to change their cookie preferences at any time. A "Cookie Settings" or "Manage Cookies" link in the footer is the standard approach.

---

## Implementation Checklist

### Pre-Launch

- [ ] Complete cookie audit performed
- [ ] All cookies categorized (necessary, functional, analytics, marketing)
- [ ] Cookie policy written and published
- [ ] CMP selected and configured (or custom solution built)
- [ ] Cookie blocking implemented for all non-essential categories
- [ ] Consent banner displays on first visit
- [ ] Accept and Reject buttons are equally prominent
- [ ] Granular preference controls are available
- [ ] Consent is stored (client-side and server-side)
- [ ] Consent withdrawal mechanism works (cookies are actually deleted)
- [ ] "Cookie Settings" link available in footer on all pages
- [ ] Consent banner works correctly on mobile devices
- [ ] No non-essential cookies fire before consent is given (verified in DevTools)
- [ ] Google Tag Manager consent mode configured (if using GTM)
- [ ] Privacy policy references cookie consent mechanism

### Post-Launch

- [ ] Monthly spot-checks of banner functionality
- [ ] Quarterly cookie scans for new/changed cookies
- [ ] Post-deployment cookie verification process established
- [ ] Consent analytics monitored (acceptance rates, category preferences)
- [ ] Annual full review of cookie policy and consent implementation
- [ ] Team trained on cookie compliance for new feature development
- [ ] Process for evaluating new third-party scripts for cookie impact

### Technical Verification

- [ ] Open site in incognito/private browsing mode
- [ ] Check DevTools > Application > Cookies -- only strictly necessary cookies should be present before consent
- [ ] Accept all cookies and verify analytics/marketing cookies appear
- [ ] Withdraw consent and verify non-essential cookies are removed
- [ ] Navigate between pages and verify consent persists
- [ ] Clear cookies and verify banner reappears
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify consent banner loads before any non-essential scripts

---

## Key Takeaways

1. **Consent must be real** -- displaying a banner without actually blocking cookies is not compliance
2. **Default to off** -- all non-essential cookies must be blocked until the user actively consents
3. **Make rejection easy** -- reject must be as easy as accept, with no dark patterns
4. **Audit regularly** -- new cookies can appear through third-party scripts, plugins, and deployments
5. **Use a CMP** unless you have the resources to build and maintain a custom solution
6. **Store consent records** for compliance evidence
7. **Privacy-focused analytics** (Plausible, Fathom) can reduce your consent burden significantly

---

*This guide is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for advice specific to your situation and jurisdiction.*
