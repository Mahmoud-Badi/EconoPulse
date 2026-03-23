# Retargeting Strategy for {{PROJECT_NAME}}

> The highest-ROI paid advertising strategy. Recapture visitors who already know you.
> Product Type: {{PRODUCT_TYPE}} | Website: {{WEBSITE_URL}}
> Monthly Retargeting Budget: {{RETARGETING_BUDGET}}

---

## Table of Contents

1. [What is Retargeting and Why It Has the Highest ROI](#what-is-retargeting)
2. [Pixel and Tag Setup](#pixel-and-tag-setup)
3. [Audience Segments to Create](#audience-segments-to-create)
4. [Retargeting Sequences by Audience](#retargeting-sequences-by-audience)
5. [Frequency Capping](#frequency-capping)
6. [Creative Rotation Strategy](#creative-rotation-strategy)
7. [Burn Pixels](#burn-pixels)
8. [Cross-Platform Retargeting](#cross-platform-retargeting)
9. [Privacy Considerations](#privacy-considerations)
10. [Measuring Retargeting Performance](#measuring-retargeting-performance)
11. [Budget Allocation](#budget-allocation)
12. [Implementation Checklist](#implementation-checklist)

---

## What is Retargeting?

Retargeting (also called remarketing) is showing ads to people who have already visited your website or interacted with your brand. Instead of reaching cold strangers, you are re-engaging warm prospects who already know {{PROJECT_NAME}} exists.

### Why Retargeting Has the Highest ROI

| Factor | Cold Prospecting | Retargeting |
|--------|-----------------|-------------|
| Audience awareness | Never heard of you | Already visited your site |
| Average CTR | 0.5-2% | 2-5% |
| Average conversion rate | 1-3% | 3-10% |
| Cost per acquisition | Baseline | 50-75% lower |
| Trust level | Zero | Some familiarity |
| Typical ROAS | 2-4x | 5-15x |

**Only 2-4% of website visitors convert on their first visit.** Retargeting brings back the other 96-98%.

The average buyer needs 5-7 touchpoints before making a purchase decision. Retargeting creates those touchpoints automatically.

### When to Start Retargeting

**Start collecting data NOW.** Even if you are not ready to run retargeting ads, install all tracking pixels today. They begin building audiences immediately. You cannot retroactively tag visitors.

**Start running retargeting ads when:**
- You have 100+ monthly website visitors (minimum viable audience)
- Ideally 1,000+ monthly visitors for meaningful results
- You have a clear conversion action to optimize for
- You have $5-20/day to invest

---

## Pixel and Tag Setup

Install these tracking tags on every page of your website. Do this immediately -- audience building starts from the moment of installation.

### Facebook/Meta Pixel

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{{META_PIXEL_ID}}');
  fbq('track', 'PageView');
</script>
```

**Standard events to track:**
```javascript
// When someone signs up
fbq('track', 'CompleteRegistration');

// When someone starts a trial
fbq('track', 'StartTrial');

// When someone views pricing
fbq('track', 'ViewContent', {content_name: 'Pricing Page'});

// When someone purchases
fbq('track', 'Purchase', {value: {{PRICE}}, currency: 'USD'});

// When someone adds to cart (e-commerce)
fbq('track', 'AddToCart', {value: {{PRICE}}, currency: 'USD'});
```

### Google Ads Tag (gtag.js)

```html
<script async src="https://www.googletagmanager.com/gtag/js?id={{GOOGLE_ADS_ID}}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{GOOGLE_ADS_ID}}');
</script>
```

### LinkedIn Insight Tag

```html
<script type="text/javascript">
_linkedin_partner_id = "{{LINKEDIN_PARTNER_ID}}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
```

### Twitter/X Pixel

```html
<script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','{{TWITTER_PIXEL_ID}}');
</script>
```

### Verification Checklist

- [ ] Meta Pixel: Use Facebook Pixel Helper Chrome extension to verify
- [ ] Google Tag: Use Google Tag Assistant Chrome extension
- [ ] LinkedIn: Use LinkedIn Insight Tag validator in Campaign Manager
- [ ] Twitter: Check Events Manager in Twitter Ads dashboard
- [ ] All pixels fire on every page load
- [ ] Conversion events fire correctly on signup/purchase/key actions
- [ ] Test with a real user journey end-to-end

---

## Audience Segments to Create

Build these segments on every platform where you have tracking installed. The more granular your segments, the more relevant your retargeting ads can be.

### Segment 1: All Website Visitors

- **Window:** 180 days
- **Who:** Anyone who visited any page on {{WEBSITE_URL}}
- **Size needed:** 100+ for Facebook, 300+ for Google, 300+ for LinkedIn
- **Use for:** Broad retargeting, lookalike audience source
- **Priority:** Essential -- create this first

### Segment 2: Pricing Page Visitors (Did Not Convert)

- **Window:** 30 days
- **Who:** Visited pricing page but did not complete signup/purchase
- **Exclude:** People who converted
- **Intent level:** Very High -- they were evaluating your product
- **Use for:** Bottom-of-funnel retargeting with social proof and testimonials
- **Priority:** Essential -- highest conversion potential

### Segment 3: Blog/Content Readers

- **Window:** 60 days
- **Who:** Visited blog posts or resource pages
- **Exclude:** People who converted
- **Intent level:** Low-Medium -- interested in the topic, not necessarily the product
- **Use for:** Top-of-funnel retargeting with educational content that introduces the product
- **Priority:** Important for content-heavy sites

### Segment 4: Trial Users (Did Not Convert to Paid)

- **Window:** 30 days
- **Who:** Started a free trial but did not upgrade to paid
- **Exclude:** Paying customers
- **Intent level:** High -- they tried the product
- **Use for:** Feature highlights, success stories, upgrade incentives
- **Priority:** Essential for freemium/trial models

### Segment 5: Feature Page Visitors

- **Window:** 30 days
- **Who:** Visited specific feature pages (e.g., /features/integrations, /features/analytics)
- **Exclude:** People who converted
- **Intent level:** Medium-High -- interested in specific capabilities
- **Use for:** Targeted ads highlighting the specific feature they explored
- **Priority:** Nice to have -- requires enough traffic per feature page

### Segment 6: Cart/Checkout Abandoners

- **Window:** 14 days
- **Who:** Added to cart or started checkout but did not complete purchase
- **Exclude:** Completed purchases
- **Intent level:** Very High -- they were about to buy
- **Use for:** Urgency-driven ads, discount offers, remove objections
- **Priority:** Essential for e-commerce

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
### E-commerce Specific Segments

- **Product viewers (by category):** Visited specific product categories
- **Repeat visitors (3+ visits, no purchase):** High interest but hesitant
- **Past purchasers (cross-sell):** Bought Product A, show them Product B
- **High-value cart abandoners:** Cart value > $100, justify more aggressive bidding
<!-- ENDIF -->

### Segment 7: Existing Customers (Upsell/Cross-sell)

- **Window:** 180 days
- **Who:** Paying customers
- **Use for:** Upsell to higher plans, cross-sell additional products, loyalty/retention
- **Priority:** Important for products with multiple tiers or add-ons

### Audience Segment Summary Table

| Segment | Window | Intent | Funnel Stage | Ad Type |
|---------|--------|--------|-------------|---------|
| All visitors | 180 days | Low | Awareness | Educational, social proof |
| Pricing visitors | 30 days | Very High | Decision | Testimonials, comparison, CTA |
| Blog readers | 60 days | Low-Medium | Awareness | Product intro, case studies |
| Trial users | 30 days | High | Consideration | Feature value, success stories |
| Feature page visitors | 30 days | Medium-High | Consideration | Feature-specific benefits |
| Cart abandoners | 14 days | Very High | Decision | Urgency, discount, trust |
| Existing customers | 180 days | N/A | Retention | Upsell, cross-sell, loyalty |

---

## Retargeting Sequences by Audience

Different audiences need different messages. Match your ad content to where the person is in their journey.

### Sequence 1: Cold Visitors (All site visitors, blog readers)

These people know your brand exists but have not shown strong buying intent.

**Week 1-2: Social Proof and Authority**
- Ad type: Testimonial video or customer quote card
- Message: "[Customer] uses {{PROJECT_NAME}} to [achieve result]"
- Goal: Build credibility and trust

**Week 3-4: Educational Value**
- Ad type: Blog post, guide, or resource promotion
- Message: "The complete guide to [topic related to your product]"
- Goal: Provide value and deepen engagement

**Week 5-6: Product Introduction**
- Ad type: Product demo video or feature highlight
- Message: "See how {{PROJECT_NAME}} makes [task] 10x easier"
- Goal: Move from awareness to consideration

### Sequence 2: Warm Visitors (Pricing page, feature pages)

These people were actively evaluating your product.

**Days 1-3: Testimonial + Social Proof**
- Ad type: Customer testimonial or case study
- Message: "[Company] switched to {{PROJECT_NAME}} and [achieved specific result]"
- Goal: Address hesitation with proof from similar users

**Days 4-7: Comparison and Differentiation**
- Ad type: Comparison content or differentiator highlight
- Message: "Why {{TARGET_AUDIENCE}} choose {{PROJECT_NAME}} over alternatives"
- Goal: Win the evaluation

**Days 8-14: Direct CTA with Incentive**
- Ad type: Strong call-to-action ad
- Message: "Start your free trial of {{PROJECT_NAME}} -- no credit card needed"
- Goal: Convert the evaluator
- Optional: Add urgency ("Limited time: extended {{TRIAL_LENGTH}}-day trial")

### Sequence 3: Hot Visitors (Trial users, cart abandoners)

These people were on the verge of converting. They need a final push.

**Days 1-3: Feature Value Reminder**
- Ad type: Key feature highlight they may have missed
- Message: "Did you know {{PROJECT_NAME}} can [powerful feature]?"
- Goal: Show value they may not have discovered

**Days 4-7: Success Story**
- Ad type: Detailed case study or user success story
- Message: "How [customer] achieved [specific, measurable result] with {{PROJECT_NAME}}"
- Goal: Help them visualize success

**Days 8-14: Direct CTA**
- Ad type: Clear conversion ad
- Message: "Your {{PROJECT_NAME}} trial is waiting. Pick up where you left off."
- Goal: Remove friction and convert

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
**Cart Abandonment Sequence:**
- Hour 1-6: "You left something behind" (show product images)
- Day 1: "Still thinking about it? Here's what others say" (reviews)
- Day 3: "Items in your cart are selling fast" (scarcity)
- Day 7: "Here's 10% off to complete your order" (discount as last resort)
<!-- ENDIF -->

---

## Frequency Capping

Showing ads too frequently annoys people and wastes budget. Not showing enough means you are invisible.

### Recommended Frequency Caps

| Audience Type | Max Impressions per Week | Max per Month |
|---------------|-------------------------|---------------|
| Cold retargeting (all visitors) | 3-5 | 12-15 |
| Warm retargeting (pricing/feature) | 5-7 | 20-25 |
| Hot retargeting (trial/cart) | 7-10 | 25-30 |
| Existing customers | 2-3 | 8-10 |

### Signs You Are Overserving

- **CTR drops below 0.3%** - People are ignoring your ads
- **Frequency exceeds 10/week** - You are annoying people
- **Negative feedback increases** - People are hiding/reporting your ads
- **CPA increases despite same audience** - Audience fatigue

### How to Set Frequency Caps by Platform

**Facebook:** Campaign level > Reach & Frequency buying (or set in ad set optimization)
**Google Display:** Campaign settings > Frequency capping > Set impressions per day/week/month
**LinkedIn:** Not directly available; control via budget limits and audience refresh
**Twitter:** Campaign settings > Frequency cap

---

## Creative Rotation Strategy

Ad fatigue is the #1 killer of retargeting performance. Rotate creative regularly to keep ads fresh.

### Rotation Schedule

| Week | Creative Theme | Format |
|------|---------------|--------|
| 1-2 | Social proof (testimonials) | Image + quote |
| 3-4 | Feature highlight | Short video or carousel |
| 5-6 | Case study / success story | Image with stats or video |
| 7-8 | Direct CTA / offer | Bold CTA image |
| 9-10 | Behind-the-scenes / brand story | Video or carousel |
| 11-12 | User-generated content | Screenshot or quote |

**Then restart the cycle with new creative assets.**

### Creative Variety Checklist

For each retargeting audience, have at least:
- [ ] 3 different image ads (different visuals, different angles)
- [ ] 1-2 video ads (testimonial, demo, or product walkthrough)
- [ ] 2 different ad copy variants (feature-focused, outcome-focused)
- [ ] Refreshed creative every 4-6 weeks

---

## Burn Pixels

A burn pixel stops showing retargeting ads to someone after they convert. This is critical for two reasons:

1. **Budget waste** - You are paying to advertise to someone who already bought
2. **User annoyance** - Nothing is more irritating than seeing ads for something you already purchased

### Implementation

**On your conversion confirmation page (thank you page, post-purchase page):**

```javascript
// Facebook: Track conversion and add to exclusion audience
fbq('track', 'Purchase', {value: {{PRICE}}, currency: 'USD'});

// Google: Track conversion
gtag('event', 'conversion', {
  'send_to': '{{GOOGLE_ADS_ID}}/{{CONVERSION_LABEL}}',
  'value': {{PRICE}},
  'currency': 'USD'
});

// LinkedIn: Track conversion
window.lintrk('track', { conversion_id: {{LINKEDIN_CONVERSION_ID}} });
```

**Then in your ad platforms:**
- Create a "Converters" audience (people who triggered the conversion event)
- Exclude this audience from ALL retargeting campaigns
- Update exclusion lists at least weekly

### Burn Pixel Checklist

- [ ] Conversion tracking fires on thank-you/confirmation page
- [ ] "Converters" audience created on each platform
- [ ] Converters audience excluded from all prospecting and retargeting campaigns
- [ ] Separate "customer retargeting" campaigns created for upsell (targeting converters intentionally)

---

## Cross-Platform Retargeting

Your visitors should see {{PROJECT_NAME}} ads wherever they go online -- Facebook, Google, LinkedIn, and Twitter. This creates the perception of ubiquity and keeps your brand top-of-mind.

### Cross-Platform Sequence Example

```
Day 1: User visits {{WEBSITE_URL}} and leaves without converting
Day 2: Sees {{PROJECT_NAME}} testimonial ad on Facebook
Day 4: Sees {{PROJECT_NAME}} feature ad on Google Display
Day 6: Sees {{PROJECT_NAME}} case study on LinkedIn
Day 8: Sees {{PROJECT_NAME}} direct CTA on Facebook
Day 10: Returns to {{WEBSITE_URL}} and converts
```

### Implementation

1. Install ALL tracking pixels on your website (not just your primary ad platform)
2. Create matching audience segments on each platform
3. Coordinate messaging across platforms (different creative, consistent positioning)
4. Use consistent exclusion lists (exclude converters everywhere)
5. Monitor cross-platform frequency to avoid over-exposure

### Platform Roles in Cross-Platform Retargeting

| Platform | Role | Ad Type |
|----------|------|---------|
| Google Display | Broadest reach, follows users across millions of sites | Visual banners, responsive display |
| Facebook/Instagram | Highest engagement, social context | Testimonial videos, carousel, stories |
| LinkedIn | Professional credibility (B2B) | Case studies, thought leadership |
| Twitter/X | Conversational, community context | Product updates, feature highlights |

---

## Privacy Considerations

Privacy regulations and platform changes are reshaping retargeting. Stay compliant and adapt.

### Cookie Consent

- **GDPR (EU):** Explicit consent required before firing tracking pixels for EU visitors
- **CCPA (California):** Must provide opt-out option
- **Implementation:** Use a consent management platform (CMP) like Cookiebot, OneTrust, or Consent Manager
- **Impact:** 30-50% of EU visitors may opt out, reducing retargeting audience size

### iOS 14.5+ Impact

- Apple's App Tracking Transparency (ATT) prompt reduced Facebook tracking effectiveness
- Only ~25% of iOS users opt in to tracking
- **Mitigation strategies:**
  - Implement Facebook Conversions API (server-side tracking)
  - Use Facebook's Aggregated Event Measurement
  - Rely more on first-party data (email lists, logged-in user data)
  - Increase focus on Google retargeting (less impacted by iOS changes)

### Server-Side Tracking

- Sends conversion data from your server directly to ad platforms
- Bypasses browser-based tracking limitations
- More reliable than client-side pixels alone
- Implement via:
  - Facebook Conversions API
  - Google Server-Side Tagging (via Google Tag Manager Server)
  - LinkedIn Conversions API

### Privacy-Safe Retargeting Alternatives

- **First-party data:** Build email lists and upload to ad platforms as Custom Audiences
- **Contextual targeting:** Target content topics rather than individual users
- **Cohort-based:** Google's Topics API (replacing third-party cookies)
- **Email-based matching:** Platforms match hashed email addresses to user profiles

---

## Measuring Retargeting Performance

### View-Through vs Click-Through Conversions

| Attribution Type | Definition | Value |
|-----------------|-----------|-------|
| **Click-through** | User clicked the ad, then converted | High confidence |
| **View-through** | User saw the ad (no click), then converted later | Lower confidence |

**Recommended attribution windows:**
- Click-through: 7-28 days (start with 7 days)
- View-through: 1 day (conservative) or 7 days (default)

**Warning:** View-through conversions can inflate results. Start with click-through only when evaluating retargeting ROI, then layer in view-through at conservative windows.

### Key Retargeting Metrics

| Metric | Target | Action if Off-Target |
|--------|--------|---------------------|
| CTR | 0.5-2% (display), 1-3% (social) | Refresh creative or adjust audience |
| Conversion rate | 3-10% (2-5x cold traffic) | Improve landing page or ad relevance |
| CPA | 50-75% of cold traffic CPA | If higher, audience or creative issue |
| ROAS | 5-15x | If below 3x, re-evaluate audience segments |
| Frequency | 3-7/week | If above 10, cap frequency or expand audience |
| Audience size | Growing over time | If shrinking, drive more top-of-funnel traffic |

### Retargeting Reporting Template

| Segment | Audience Size | Impressions | Clicks | CTR | Conversions | CPA | ROAS |
|---------|--------------|-------------|--------|-----|-------------|-----|------|
| All visitors | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Pricing page | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Blog readers | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Trial users | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Cart abandoners | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |
| Customers (upsell) | ____ | ____ | ____ | ___% | ____ | $____ | ___:1 |

---

## Budget Allocation

### Retargeting Budget as Percentage of Total Ad Spend

Retargeting should receive 20-30% of your total paid advertising budget. It delivers disproportionately high ROI because you are reaching warm audiences.

```
Total monthly ad budget:       ${{MONTHLY_AD_BUDGET}}
Retargeting allocation (25%):  ${{MONTHLY_AD_BUDGET}} × 0.25 = $____
```

### Budget Distribution Across Retargeting Segments

| Segment | % of Retargeting Budget | Rationale |
|---------|------------------------|-----------|
| Pricing page visitors | 30% | Highest intent, closest to conversion |
| Trial users / cart abandoners | 25% | Already experienced the product |
| Feature page visitors | 15% | Medium-high intent |
| All site visitors | 15% | Broad net, lower intent |
| Blog readers | 10% | Nurture play, lower immediate conversion |
| Customer upsell | 5% | Supplementary to email-based upsell |

### Minimum Viable Retargeting Budget

- $5-10/day for a single retargeting campaign on one platform
- $15-30/day for multi-segment retargeting on one platform
- $30-60/day for cross-platform retargeting (2-3 platforms)
- Scale up as your audience size grows

---

## Implementation Checklist

### Immediate Actions (Do Today)

- [ ] Install Meta Pixel on all pages of {{WEBSITE_URL}}
- [ ] Install Google Ads tag on all pages
- [ ] Install LinkedIn Insight Tag (if B2B)
- [ ] Install Twitter Pixel (if relevant audience)
- [ ] Verify all pixels fire correctly using browser extensions
- [ ] Set up conversion events for primary actions (signup, trial, purchase)

### Week 1: Audience Setup

- [ ] Create "All Visitors" audience on each platform (180-day window)
- [ ] Create "Pricing Page Visitors" audience (30-day window)
- [ ] Create "Blog Readers" audience (60-day window)
- [ ] Create "Trial Users" audience (30-day window)
- [ ] Create "Converters" audience for exclusion
- [ ] Verify audience sizes are large enough (100+ Facebook, 300+ Google/LinkedIn)

### Week 2: Campaign Launch

- [ ] Design 3-5 ad creatives for each audience segment
- [ ] Write ad copy variants for each segment
- [ ] Set up campaigns on primary platform (Facebook or Google)
- [ ] Set frequency caps
- [ ] Set budget ($5-20/day to start)
- [ ] Exclude converters from all campaigns
- [ ] Launch and monitor daily

### Week 3-4: Optimize

- [ ] Review performance data after 7 days
- [ ] Pause underperforming creative
- [ ] Adjust frequency caps if needed
- [ ] Add second platform if primary is performing well
- [ ] Set up cross-platform coordination
- [ ] Begin creative rotation cycle

### Ongoing (Monthly)

- [ ] Refresh ad creative every 4-6 weeks
- [ ] Review and update audience segments
- [ ] Verify exclusion lists are current
- [ ] Monitor privacy compliance (consent rates, opt-out rates)
- [ ] Report on retargeting ROI vs cold traffic ROI
- [ ] Adjust budget allocation based on performance
