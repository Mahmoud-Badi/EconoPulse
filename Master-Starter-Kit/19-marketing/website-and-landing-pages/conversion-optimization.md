# Conversion Rate Optimization (CRO) Guide

> A comprehensive framework and checklist for systematically improving the percentage of website visitors who take a desired action. Covers auditing, testing, analyzing, and iterating on every element that impacts conversion.

---

## Table of Contents

1. [CRO Fundamentals](#cro-fundamentals)
2. [CRO Audit Checklist (50+ Items)](#cro-audit-checklist)
3. [Heatmap Analysis Guide](#heatmap-analysis-guide)
4. [A/B Testing Framework](#ab-testing-framework)
5. [Form Optimization](#form-optimization)
6. [Page Speed Optimization](#page-speed-optimization)
7. [Mobile Conversion Optimization](#mobile-conversion-optimization)
8. [Exit Intent Strategy](#exit-intent-strategy)
9. [Micro-Conversion Tracking](#micro-conversion-tracking)
10. [Conversion Rate Benchmarks](#conversion-rate-benchmarks)

---

## CRO Fundamentals

### What Is Conversion Rate Optimization?

CRO is the systematic process of increasing the percentage of visitors who complete a desired action on your website. The "desired action" depends on your page:

| Page Type | Primary Conversion | Secondary Conversion |
|-----------|-------------------|---------------------|
| Landing page | Sign up / Purchase | Email capture |
| Homepage | Start trial / Create account | Visit pricing page |
| Pricing page | Start trial / Purchase | Contact sales |
| Blog post | Email subscribe | Visit product page |
| Documentation | Start building / Sign up | Share the page |

### The CRO Formula

```
Conversion Rate = (Conversions / Total Visitors) x 100

Example: 50 sign-ups from 2,000 visitors = 2.5% conversion rate
```

### The CRO Process

```
1. MEASURE  → Establish baseline conversion rates
2. ANALYZE  → Identify where and why visitors drop off
3. HYPOTHESIZE → Form a theory about what change will improve conversion
4. TEST     → Run an A/B test to validate the hypothesis
5. IMPLEMENT → Roll out the winning variant
6. REPEAT   → Move to the next highest-impact opportunity
```

### Priority Framework: ICE Scoring

For every optimization idea, score it on three dimensions (1-10 each):

| Dimension | Question |
|-----------|----------|
| **Impact** | How much will this improve conversion if it works? |
| **Confidence** | How confident am I that this will work? (based on data, best practices, past tests) |
| **Ease** | How easy is this to implement? |

**ICE Score = (Impact + Confidence + Ease) / 3**

Sort all ideas by ICE score. Work on the highest-scoring ideas first.

---

## CRO Audit Checklist

Run this audit on every key page. Check each item and note issues to fix.

### Page Load & Performance (8 items)

- [ ] Page loads in under 3 seconds on desktop (test with PageSpeed Insights)
- [ ] Page loads in under 5 seconds on mobile 3G (test with PageSpeed Insights)
- [ ] Largest Contentful Paint (LCP) under 2.5 seconds
- [ ] Cumulative Layout Shift (CLS) under 0.1
- [ ] Interaction to Next Paint (INP) under 200ms
- [ ] Images are optimized (WebP format, compressed, properly sized)
- [ ] No render-blocking JavaScript in the critical path
- [ ] CDN is configured for static assets

### Mobile Experience (8 items)

- [ ] Page is fully responsive (no horizontal scrolling)
- [ ] Text is readable without zooming (minimum 16px body text)
- [ ] CTA buttons are large enough to tap (minimum 44x44px)
- [ ] Tap targets have adequate spacing (minimum 8px between targets)
- [ ] Forms use appropriate mobile input types (email, tel, number)
- [ ] No pop-ups that cover the entire mobile screen (Google penalizes this)
- [ ] Navigation is accessible via hamburger menu
- [ ] Images load at appropriate sizes (srcset / responsive images)

### CTA Clarity (7 items)

- [ ] Primary CTA is visible above the fold
- [ ] CTA button uses a contrasting color (stands out from page background)
- [ ] CTA copy is action-oriented and value-driven (not "Submit" or "Click Here")
- [ ] Only one primary CTA per viewport (no competing actions)
- [ ] CTA is repeated at logical points down the page (after features, after testimonials, at bottom)
- [ ] Secondary CTAs are visually subordinate to the primary CTA
- [ ] CTA button is large enough (minimum 48px height, 200px width on desktop)

### Copy & Messaging (9 items)

- [ ] Headline communicates the primary benefit (not a feature)
- [ ] Sub-headline supports the headline with additional context
- [ ] Copy uses "you/your" language (not "we/our")
- [ ] Benefits are stated before features
- [ ] Paragraphs are short (2-3 sentences maximum)
- [ ] Bullet points are used for lists (not long paragraphs)
- [ ] Technical jargon is minimized or explained
- [ ] Readability is at 8th grade level or below (test with Hemingway App)
- [ ] There is a clear value proposition visible within 5 seconds

### Trust Elements (8 items)

- [ ] Customer logos are displayed (recognizable brands if possible)
- [ ] Testimonials include real names, titles, companies, and photos
- [ ] Testimonials mention specific results or outcomes
- [ ] Security badges are visible near forms and payment areas
- [ ] Privacy policy is linked
- [ ] Contact information is accessible (not hidden)
- [ ] Company information is verifiable (about page, team, address)
- [ ] Third-party review badges are displayed (G2, Capterra, TrustPilot)

### Social Proof (6 items)

- [ ] User/customer count is displayed ("Join 10,000+ teams")
- [ ] Social proof appears within the first scroll
- [ ] Case studies or success stories are linked
- [ ] Ratings/reviews from third-party platforms are shown
- [ ] Media mentions ("As seen in...") are displayed if available
- [ ] Community metrics are shown (GitHub stars, Discord members, etc.)

### Form Optimization (8 items)

- [ ] Forms ask only for essential information
- [ ] Form fields have clear labels (not just placeholder text)
- [ ] Error messages are specific and helpful ("Please enter a valid email" not "Invalid input")
- [ ] Form validation happens in real-time (not only on submit)
- [ ] Password requirements are shown upfront (not after failed submit)
- [ ] Social login options are available (Google, GitHub — reduces friction)
- [ ] Auto-fill is supported (proper input `name` and `autocomplete` attributes)
- [ ] Submit button copy is value-oriented ("Create My Account" not "Submit")

### Navigation & Layout (6 items)

- [ ] Navigation is clean (6-8 items maximum)
- [ ] Most important pages are accessible from the primary navigation
- [ ] Breadcrumbs are present on sub-pages
- [ ] Internal links keep visitors on the site (external links open in new tabs)
- [ ] Footer includes links to key pages (legal, support, contact)
- [ ] No dead ends — every page has a clear next action

### Visual Design (5 items)

- [ ] Visual hierarchy is clear (headings, subheadings, body text are distinct sizes)
- [ ] White space is generous (content is not cramped)
- [ ] Color contrast meets WCAG AA standards (minimum 4.5:1 for text)
- [ ] Consistent design language across all pages
- [ ] Images and illustrations support the message (not decoration)

**Total checklist items: 65**

---

## Heatmap Analysis Guide

### What Are Heatmaps?

Heatmaps visualize where visitors click, scroll, and move their mouse on your pages. They reveal what visitors actually do (versus what you assume they do).

### Free Heatmap Tools

| Tool | Free Tier | Features |
|------|-----------|----------|
| **Microsoft Clarity** | Unlimited | Heatmaps, session recordings, insights dashboard |
| **Hotjar** | 35 sessions/day | Heatmaps, recordings, surveys, feedback widgets |
| **PostHog** | 1M events/month | Session recordings, feature flags, analytics |

**Recommendation**: Start with Microsoft Clarity — it is completely free with no session limits.

### Types of Heatmaps

#### Click Maps
**What they show**: Where visitors click on a page.
**What to look for**:
- Are visitors clicking your CTA? If not, it may not be visible or compelling enough.
- Are visitors clicking non-clickable elements? Those elements look interactive — either make them clickable or redesign them.
- Are visitors clicking navigation items more than the CTA? Your CTA may not be prominent enough.

#### Scroll Maps
**What they show**: How far down the page visitors scroll.
**What to look for**:
- Where is the major drop-off point? Content below that point is seen by few visitors.
- Does the drop-off happen before your CTA? Move the CTA higher.
- Is there a section where scroll depth drops sharply? That section may be boring or confusing.

#### Move Maps (Mouse Tracking)
**What they show**: Where visitors move their cursor (correlates with eye movement on desktop).
**What to look for**:
- Are visitors reading your headline? If cursor does not hover over it, they may be skipping it.
- Which sections get the most attention?
- Are visitors hovering over elements they want to interact with?

### Session Recordings

Beyond heatmaps, watch actual session recordings to see individual visitor behavior:

**What to watch for:**
- Rage clicks (rapid clicking on the same element — indicates frustration)
- U-turns (scrolling down then back up — indicates confusion)
- Form abandonment (starting a form but not completing it — indicates friction)
- Dead clicks (clicking elements that do nothing — indicates UI confusion)

**How many to watch**: Review at least 20-30 sessions per page to identify patterns. Do not draw conclusions from 2-3 sessions.

### Heatmap Analysis Process

1. **Install tool**: Add the tracking script to your site (one line of JavaScript)
2. **Collect data**: Wait for at least 1,000 page views per page (minimum for meaningful patterns)
3. **Generate heatmaps**: View click, scroll, and move maps for key pages
4. **Identify patterns**: Look for the signals described above
5. **Form hypotheses**: "Visitors are clicking the hero image expecting it to be a video. Adding a video may increase engagement."
6. **Test**: Run an A/B test based on the hypothesis
7. **Repeat**: Regenerate heatmaps after changes to verify improvement

---

## A/B Testing Framework

### What Is A/B Testing?

A/B testing (split testing) shows two versions of a page element to different visitors and measures which performs better. It replaces guessing with data.

### What to Test (Priority Order)

Test high-impact elements first. This is the recommended priority order:

| Priority | Element | Why |
|----------|---------|-----|
| 1 | **Headline** | Single biggest impact on first impression and engagement |
| 2 | **CTA copy** | Directly affects click-through rate |
| 3 | **CTA placement** | Visibility determines whether visitors even see the CTA |
| 4 | **Hero image/video** | Major impact on page perception and engagement |
| 5 | **Social proof type** | Logos vs. testimonials vs. metrics — which resonates? |
| 6 | **Page layout** | Long-form vs. short-form, section order changes |
| 7 | **Form length** | Fewer fields vs. more fields (quality vs. quantity trade-off) |
| 8 | **Pricing display** | Monthly vs. annual default, price point, tier count |
| 9 | **Color scheme** | CTA button color, page background, section colors |
| 10 | **Copy length** | Short punchy copy vs. detailed explanatory copy |

### Sample Size Requirements

Do NOT end tests early based on gut feeling. Use statistical significance.

**Minimum sample size calculator** (simplified):

| Baseline CR | Desired Improvement | Required Visitors per Variant |
|-------------|--------------------|-----------------------------|
| 1% | 20% relative (to 1.2%) | ~65,000 |
| 2% | 20% relative (to 2.4%) | ~32,000 |
| 5% | 20% relative (to 6%) | ~12,500 |
| 10% | 20% relative (to 12%) | ~6,000 |
| 20% | 20% relative (to 24%) | ~2,800 |

**Rule of thumb**: If you get fewer than 1,000 conversions per month, focus on large changes (headline, layout, offer) rather than micro-optimizations (button color).

### Test Duration

- **Minimum**: 2 weeks (to account for day-of-week variations)
- **Maximum**: 8 weeks (after that, external factors contaminate results)
- **Required**: Reach statistical significance (95% confidence minimum)
- **Never**: End a test early because one variant "looks like it's winning" after 2 days

### A/B Testing Tools

| Tool | Free Tier | Notes |
|------|-----------|-------|
| **Google Optimize** | Sunset (no longer available) | — |
| **PostHog** | 1M events/month | Open source, self-hostable |
| **VWO** | Limited free trial | Full-featured, visual editor |
| **Optimizely** | No free tier | Enterprise-grade |
| **GrowthBook** | Free (open source) | Self-hosted, developer-friendly |
| **Statsig** | Free tier available | Feature flags + experiments |

### Test Documentation Template

For every test, document:

```
Test Name: [Descriptive name]
Page: [URL being tested]
Hypothesis: "If we [change], then [metric] will [improve/increase] because [reason]."
Control: [Description of current version]
Variant: [Description of changed version]
Primary metric: [Conversion rate, click-through rate, etc.]
Secondary metrics: [Other metrics to monitor]
Traffic split: [50/50 is standard]
Minimum duration: [2 weeks]
Required sample size: [Calculate before starting]
Results: [Fill in after test concludes]
Winner: [Control / Variant / Inconclusive]
Next action: [Implement winner / Run follow-up test / Discard]
```

---

## Form Optimization

### The Field Count Rule

Every additional form field reduces completion rates by approximately 5-10%. Ask yourself: "Do I NEED this information right now, or can I collect it later?"

| Fields | Typical Completion Rate |
|--------|------------------------|
| 1 (email only) | 25-30% |
| 2-3 fields | 20-25% |
| 4-5 fields | 15-20% |
| 6-7 fields | 10-15% |
| 8+ fields | Below 10% |

### Multi-Step Forms

If you must collect many fields, use multi-step (wizard) forms:

```
Step 1: Email address [Continue →]
Step 2: Name and company [Continue →]
Step 3: Team size and use case [Create Account]
```

**Why multi-step works**:
- Commitment & consistency: Once someone completes Step 1, they are more likely to complete Step 2
- Progress bars: "Step 2 of 3" motivates completion
- Reduced visual overwhelm: 2 fields feel easier than 8 fields

### Progressive Disclosure

Collect only what you need at each stage:

| Stage | What to Ask | Why |
|-------|-------------|-----|
| **Sign-up** | Email (+ password or magic link) | Minimum to create account |
| **Onboarding** | Name, role, company | Personalize the experience |
| **First action** | Use case, team size | Recommend features |
| **Upgrade** | Payment information | Process payment |

### Form UX Best Practices

1. **Labels above fields** (not inside as placeholders — placeholders disappear on focus)
2. **Real-time validation** (show green check on valid, red error on invalid — immediately)
3. **Specific error messages** ("Email must include @" not "Invalid input")
4. **Auto-focus first field** on page load
5. **Tab order** is logical (top to bottom, left to right)
6. **Password visibility toggle** (eye icon to show/hide password)
7. **Auto-fill support**: Use proper `name` and `autocomplete` attributes
   ```html
   <input type="email" name="email" autocomplete="email">
   <input type="text" name="fname" autocomplete="given-name">
   <input type="text" name="lname" autocomplete="family-name">
   <input type="text" name="organization" autocomplete="organization">
   ```
8. **Social login options**: Reduce form fill entirely with Google/GitHub OAuth
9. **Submit button state**: Disabled until form is valid, loading state on submit
10. **Success feedback**: Clear confirmation message or redirect after submission

---

## Page Speed Optimization

### Why Speed Matters for Conversion

| Load Time | Bounce Probability Increase |
|-----------|---------------------------|
| 1s → 3s | 32% |
| 1s → 5s | 90% |
| 1s → 6s | 106% |
| 1s → 10s | 123% |

Every 100ms of improvement can increase conversions by up to 1%.

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

### Speed Optimization Checklist

#### Images (biggest impact)
- [ ] Convert images to WebP or AVIF format
- [ ] Compress images (use TinyPNG, Squoosh, or ImageOptim)
- [ ] Use responsive images with `srcset` and `sizes` attributes
- [ ] Lazy load below-fold images (`loading="lazy"`)
- [ ] Set explicit `width` and `height` on images (prevents CLS)
- [ ] Use CSS for decorative elements instead of images where possible

#### JavaScript
- [ ] Defer non-critical JavaScript (`defer` or `async` attributes)
- [ ] Code-split by route (only load JS needed for current page)
- [ ] Remove unused JavaScript (tree shaking)
- [ ] Minimize third-party scripts (analytics, chat widgets, tracking)
- [ ] Load third-party scripts after page load

#### CSS
- [ ] Inline critical CSS (above-fold styles)
- [ ] Load non-critical CSS asynchronously
- [ ] Remove unused CSS (PurgeCSS or similar)
- [ ] Minimize CSS file size (minification)

#### Server & Delivery
- [ ] Use a CDN (Cloudflare, Fastly, CloudFront)
- [ ] Enable gzip or Brotli compression
- [ ] Set appropriate cache headers (static assets: 1 year, HTML: short)
- [ ] Use HTTP/2 or HTTP/3
- [ ] Optimize server response time (TTFB under 200ms)

#### Fonts
- [ ] Use `font-display: swap` to prevent invisible text during load
- [ ] Subset fonts to include only needed characters
- [ ] Preload critical fonts with `<link rel="preload">`
- [ ] Limit font weights/styles to what you actually use
- [ ] Consider system font stack for body text (zero load time)

### Testing Tools

| Tool | Purpose | Cost |
|------|---------|------|
| **Google PageSpeed Insights** | Core Web Vitals, performance score | Free |
| **Google Lighthouse** (Chrome DevTools) | Detailed performance audit | Free |
| **WebPageTest** | Multi-location, multi-device testing | Free |
| **GTmetrix** | Performance + recommendations | Free tier |
| **Chrome DevTools Network tab** | Waterfall analysis, blocking requests | Free |

---

## Mobile Conversion Optimization

### Mobile-Specific Conversion Factors

Mobile visitors behave differently from desktop visitors:
- Shorter attention span (smaller screen = less patience)
- Thumb-based interaction (limited precision)
- Interrupted sessions (on-the-go usage)
- Slower connections (especially on cellular data)

### Thumb Zone Optimization

The "thumb zone" refers to the areas of a mobile screen easily reachable by thumb:

```
┌─────────────────┐
│    Hard to       │
│    reach         │
│                  │
│   Easy to        │
│   reach          │
│                  │
│   Natural        │
│   thumb zone     │  ← Place primary CTAs here
└─────────────────┘
```

**Primary CTAs should be in the bottom-center of the screen** — the natural thumb resting zone.

### Touch Target Sizing

| Element | Minimum Size | Recommended Size |
|---------|-------------|-----------------|
| CTA buttons | 44x44px | 48x48px or larger |
| Text links | 44x44px tap area | 48px vertical tap area |
| Form inputs | 44px height | 48px height |
| Navigation items | 44px height | 48px height |
| Spacing between targets | 8px | 12px |

### Mobile-Specific CTAs

Consider these mobile-specific conversion elements:

- **Click-to-call button**: `<a href="tel:+1234567890">Call Us</a>` — instant contact
- **SMS/text CTA**: For products that support SMS onboarding
- **App store buttons**: Direct links to download apps
- **QR code**: For bridging desktop-to-mobile experiences
- **Sticky bottom CTA bar**: Persistent CTA that scrolls with the page

```
┌──────────────────────────────┐
│                              │
│  [Page content scrolls]     │
│                              │
│                              │
├──────────────────────────────┤
│  [Start Free Trial →]       │  ← Sticky bottom CTA bar
└──────────────────────────────┘
```

### Mobile Form Optimization

- Use appropriate input types: `type="email"`, `type="tel"`, `type="number"`
- These trigger the correct mobile keyboard, reducing friction
- Enable autocomplete for all fields
- Use large, clearly labeled fields
- Single-column layout only (never side-by-side fields on mobile)
- Show validation inline (not in a pop-up that may be hard to dismiss)

---

## Exit Intent Strategy

### What Is Exit Intent?

Exit intent technology detects when a visitor is about to leave the page (mouse moves toward browser close/back button on desktop, or specific scroll/tap patterns on mobile) and triggers an intervention.

### Exit Intent Options

| Strategy | Implementation | Effectiveness |
|----------|---------------|---------------|
| **Email capture popup** | Offer valuable content in exchange for email | High for content sites |
| **Discount/offer popup** | "Wait! Here's 10% off" | High for e-commerce |
| **Survey popup** | "What stopped you from signing up today?" | High for data collection |
| **Content recommendation** | "Before you go, check out this guide" | Medium for content sites |
| **Simplified offer** | "Not ready for paid? Try our free plan" | Medium for SaaS |
| **Live chat trigger** | "Have questions? Chat with us now" | Medium-High for B2B |

### Exit Intent Best Practices

1. **Show only once per session** — repeated pop-ups annoy visitors
2. **Easy to dismiss** — large, visible close button. Do not make the "No thanks" text tiny.
3. **Mobile-friendly** — Google penalizes intrusive mobile interstitials. Use banners, not full-screen pop-ups on mobile.
4. **Offer genuine value** — a 10% discount or a free PDF, not just "Subscribe to our newsletter"
5. **A/B test the offer** — test different incentives to find what works
6. **Set frequency caps** — do not show to returning visitors who already dismissed it
7. **Exclude converted users** — if they already signed up, do not show them a sign-up popup

### Exit Intent Template

```
Heading: "Wait — before you go!"
OR: "One more thing..."
OR: "Don't miss this"

Body: "Get our [free resource/discount/guide] and [benefit]."
OR: "Still deciding? Here's a [incentive] to help."

CTA: "[Get the Guide]" or "[Claim My Discount]"
Dismiss: "No thanks, I don't need [benefit]" (use reverse psychology carefully)

[Email input field] [CTA button]
```

### Tools for Exit Intent

| Tool | Free Tier | Notes |
|------|-----------|-------|
| **OptinMonster** | No free tier ($16/mo) | Industry standard, many templates |
| **Sumo** | Free tier available | Basic pop-ups and email capture |
| **Hello Bar** | Free tier available | Top-bar notifications |
| **Custom JavaScript** | Free | `mouseleave` event on `document` (desktop only) |

---

## Micro-Conversion Tracking

### What Are Micro-Conversions?

Micro-conversions are small actions that indicate visitor engagement and intent. They are stepping stones toward the primary conversion (macro-conversion).

### Micro-Conversion Map

| Micro-Conversion | What It Indicates | How to Track |
|-------------------|-------------------|--------------|
| **Scroll depth (50%+)** | Content engagement | GA4 scroll event or custom event |
| **Time on page (60s+)** | Content consumption | GA4 engagement time |
| **CTA hover** | Consideration | Custom JS event on mouseover |
| **Pricing page visit** | Purchase intent | GA4 page view event |
| **Documentation visit** | Technical evaluation | GA4 page view event |
| **Video play** | Content engagement | Video player event callback |
| **Video completion (75%+)** | High engagement | Video player event callback |
| **FAQ expansion** | Objection resolution | Custom JS click event |
| **Feature comparison click** | Evaluating options | Custom JS click event |
| **Blog post share** | Content advocacy | Share button click event |
| **Email open** | Continued interest | Email platform tracking |
| **Return visit** | Ongoing consideration | GA4 returning user segment |

### Setting Up Micro-Conversion Tracking

#### Google Analytics 4 (GA4) Custom Events

```javascript
// Scroll depth tracking (already built into GA4 — enable enhanced measurement)

// CTA click tracking
document.querySelectorAll('[data-cta]').forEach(button => {
  button.addEventListener('click', () => {
    gtag('event', 'cta_click', {
      cta_location: button.dataset.ctaLocation,
      cta_text: button.textContent
    });
  });
});

// Video engagement
video.addEventListener('ended', () => {
  gtag('event', 'video_complete', {
    video_title: 'product_demo'
  });
});
```

### Building a Conversion Funnel

Map your micro-conversions into a funnel to identify where visitors drop off:

```
Homepage Visit (100%)
  ↓
Scroll past hero (70%)
  ↓
Click feature section (40%)
  ↓
Visit pricing page (15%)
  ↓
Start trial form (8%)
  ↓
Complete trial sign-up (5%)    ← Macro-conversion
```

**The biggest drop-off in the funnel is your biggest optimization opportunity.**

---

## Conversion Rate Benchmarks

### By Industry

| Industry | Average Landing Page CR | Good | Excellent |
|----------|------------------------|------|-----------|
| SaaS / Software | 3-5% | 5-7% | 10%+ |
| E-commerce | 2-3% | 3-5% | 5%+ |
| B2B Services | 2-4% | 4-6% | 8%+ |
| Media / Publishing | 1-3% | 3-5% | 7%+ |
| Finance | 2-4% | 4-6% | 10%+ |
| Education | 3-5% | 5-8% | 12%+ |
| Healthcare | 2-4% | 4-6% | 8%+ |

### By Page Type

| Page Type | Average CR | Good | Excellent |
|-----------|-----------|------|-----------|
| Landing page (paid traffic) | 2-5% | 5-8% | 10%+ |
| Landing page (organic traffic) | 3-7% | 7-10% | 15%+ |
| Homepage | 1-3% | 3-5% | 5%+ |
| Pricing page | 5-10% | 10-15% | 20%+ |
| Blog post (to email) | 1-3% | 3-5% | 5%+ |
| Free trial sign-up | 3-7% | 7-10% | 15%+ |
| E-commerce product page | 2-4% | 4-6% | 8%+ |
| Checkout page | 40-60% | 60-70% | 75%+ |

### By Traffic Source

| Traffic Source | Typical CR | Notes |
|---------------|-----------|-------|
| **Organic search** | 3-5% | High intent, visitor searched for solution |
| **Direct** | 2-4% | Mix of intents, includes returning visitors |
| **Referral** | 2-5% | Depends on referral source quality |
| **Email** | 3-6% | Warm audience, already engaged |
| **Paid search (Google Ads)** | 3-6% | High intent, keyword-targeted |
| **Paid social (Facebook/IG)** | 1-3% | Lower intent, interruption-based |
| **Social organic** | 1-2% | Casual browsing, low intent |
| **Display ads** | 0.5-1% | Awareness-level, very low intent |

### Important Notes on Benchmarks

- **Benchmarks are guidelines, not targets.** Your specific conversion rate depends on your product, audience, pricing, and market.
- **Compare against yourself.** Your month-over-month improvement matters more than industry averages.
- **Context matters.** A 1% conversion rate on a $10,000 product is excellent. A 1% conversion rate on a free trial is poor.
- **Traffic quality affects conversion rates.** A page with highly targeted traffic will always convert better than one with broad traffic.

---

## Quick-Start CRO Checklist

If you are just getting started with CRO, do these things first (in this order):

1. [ ] Install Google Analytics 4 (or privacy-friendly alternative)
2. [ ] Install Microsoft Clarity (free heatmaps and recordings)
3. [ ] Measure your current conversion rate (establish baseline)
4. [ ] Run a PageSpeed Insights audit and fix critical issues
5. [ ] Test your page on a real mobile device
6. [ ] Do a 5-second test with a stranger (can they understand your value prop?)
7. [ ] Review 20 session recordings in Clarity (identify friction)
8. [ ] Optimize your CTA copy and placement based on findings
9. [ ] Reduce your sign-up form to the minimum viable fields
10. [ ] Set up scroll depth and CTA click tracking
11. [ ] Run your first A/B test (start with the headline)
12. [ ] Review and iterate monthly
