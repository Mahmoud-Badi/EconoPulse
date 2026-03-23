# Social Media Advertising Playbook for {{PROJECT_NAME}}

> Comprehensive guide to running paid social campaigns across Facebook, Instagram, LinkedIn, Twitter/X, and Reddit.
> Product Type: {{PRODUCT_TYPE}} | Target Audience: {{TARGET_AUDIENCE}}
> Monthly Social Ad Budget: {{SOCIAL_AD_BUDGET}}

---

## Table of Contents

1. [Platform Selection Matrix](#platform-selection-matrix)
2. [Facebook and Instagram Ads](#facebook-and-instagram-ads)
3. [LinkedIn Ads](#linkedin-ads)
4. [Twitter/X Ads](#twitterx-ads)
5. [Reddit Ads](#reddit-ads)
6. [Cross-Platform Strategy](#cross-platform-strategy)
7. [Creative Best Practices](#creative-best-practices)
8. [Budget and Scaling](#budget-and-scaling)

---

## Platform Selection Matrix

Choose the right platform for {{PROJECT_NAME}} based on where {{TARGET_AUDIENCE}} spends time and the nature of your product.

| Factor | Facebook/IG | LinkedIn | Twitter/X | Reddit |
|--------|------------|----------|-----------|--------|
| **Audience size** | Largest (3B+) | 900M professionals | 500M+ | 50M+ daily |
| **B2C products** | Excellent | Poor | Good | Good (niche) |
| **B2B products** | Good | Excellent | Good | Moderate |
| **Dev tools** | Moderate | Good | Excellent | Excellent |
| **Visual products** | Excellent | Moderate | Good | Moderate |
| **Min budget to test** | $300/month | $1,000/month | $300/month | $300/month |
| **Average CPC** | $0.50-3.00 | $5-15 | $0.50-3.00 | $0.50-5.00 |
| **Targeting precision** | Very High | Very High (job data) | Moderate | Moderate |
| **Conversion intent** | Medium | Medium-High | Low-Medium | Medium |
| **Learning curve** | Medium | Medium | Low | Low |

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
### Recommended Platform Priority for SaaS:
1. **Facebook/Instagram** for retargeting and lookalike audiences based on current users
2. **LinkedIn** if average deal value exceeds $500/year (to justify high CPC)
3. **Twitter/X** if your users are active on Twitter (tech, developer, startup audiences)
4. **Reddit** for niche targeting in relevant subreddits
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile_app" -->
### Recommended Platform Priority for Mobile Apps:
1. **Facebook/Instagram** for app install campaigns (Meta's algorithm is best-in-class for this)
2. **TikTok** if your audience is 18-35 (not covered in this playbook but consider it)
3. **Twitter/X** for awareness and engagement
4. **Reddit** for niche communities related to your app category
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
### Recommended Platform Priority for Developer Tools:
1. **Twitter/X** where developers congregate and share tool recommendations
2. **Reddit** in programming and technology subreddits (authentic engagement required)
3. **LinkedIn** for reaching engineering leaders and decision-makers
4. **Facebook/Instagram** primarily for retargeting only
<!-- ENDIF -->

---

## Facebook and Instagram Ads

Facebook and Instagram share the same advertising platform (Meta Ads Manager). They offer the most sophisticated targeting and the largest audience.

### Account Setup

**1. Create a Business Manager Account**
- Go to business.facebook.com
- Create your business account
- Add your Facebook Page and Instagram account
- Add team members with appropriate permissions

**2. Install the Meta Pixel**
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

**3. Set Up Conversions API (Server-Side)**
- Server-side tracking is essential post-iOS 14.5
- Improves attribution accuracy by 20-30%
- Implement via your web framework or use a partner integration

**4. Create Custom Audiences**
- Website visitors (all, by page, by time on site)
- Customer list upload (email addresses)
- App activity (if applicable)
- Video viewers (people who watched your video ads)
- Engagement audiences (people who interacted with your posts/ads)

### Campaign Objectives

| Objective | When to Use | Optimization Target |
|-----------|-------------|-------------------|
| **Awareness** | Brand building, reaching new audiences | Impressions, reach |
| **Traffic** | Driving visits to content or landing pages | Link clicks, landing page views |
| **Engagement** | Building social proof on posts | Post engagement |
| **Leads** | Collecting information via Lead Forms | Form submissions |
| **Conversions** | Driving sign-ups, purchases, trials | Conversion events |
| **App Installs** | Mobile app promotion | App installs |

**For {{PROJECT_NAME}}, start with:** Conversions objective optimizing for your primary conversion event (sign-up, trial, or purchase).

### Audience Targeting

**Interest-Based Targeting:**
- Target interests related to your product category
- Layer interests with demographics for precision
- Example for a project management SaaS: Interest in "Project Management" + Job Title contains "Manager"

**Lookalike Audiences:**
- Upload your customer list (minimum 100 customers, ideally 1000+)
- Create 1% lookalike (closest match, highest quality)
- Create 1-3% lookalike (broader, more volume)
- Create 3-5% lookalike (broadest, lowest quality per person)
- Test 1% first, then expand

**Custom Audiences (Retargeting):**
- All website visitors (last 30 days) -- exclude converters
- Pricing page visitors (last 14 days) -- high intent
- Blog readers (last 60 days) -- nurture with product content
- Video viewers (watched 50%+) -- engaged audience
- Email list non-openers -- re-engage via different channel

**Broad Targeting (Advantage+ Audiences):**
- Let Meta's algorithm find your audience with minimal targeting input
- Works best when you have 50+ conversions/week
- Provide audience suggestions but do not restrict

### Ad Formats

**Single Image Ads:**
- Best for clear, simple messages
- Image specs: 1080x1080 (square) or 1200x628 (landscape)
- Keep text on image under 20% for best delivery
- Strong visual with clear value proposition

**Video Ads:**
- Best performing format across Facebook and Instagram
- 15-30 seconds optimal length
- Square (1:1) for feed, vertical (9:16) for Stories/Reels
- Captions required (85% of Facebook video is watched without sound)
- Hook in first 3 seconds

**Carousel Ads:**
- 2-10 cards, each with its own image, headline, and link
- Great for showcasing multiple features or a step-by-step story
- First card must hook attention; last card should be CTA
- Use for: feature highlights, customer stories, product walkthrough

**Collection Ads:**
- Full-screen mobile experience
- Best for e-commerce or products with multiple offerings
- Combines a cover image/video with product catalog

**Stories/Reels Ads:**
- Full-screen vertical (9:16)
- 15-second optimal length
- Native, casual aesthetic performs best
- Include text overlays and stickers for engagement

### Ad Copy Best Practices

**Short Copy (Feed -- 1-2 lines + CTA):**
```
Stop spending hours on [task]. {{PROJECT_NAME}} does it in minutes.

Try free: {{WEBSITE_URL}}
```

**Medium Copy (Feed -- 3-5 lines):**
```
[Hook that identifies the pain point]

Here's the thing: [agitate the problem].

{{PROJECT_NAME}} solves this by [brief solution description].

[Social proof or specific result]

[CTA with link]
```

**Long Copy (Feed -- story format):**
```
I used to spend 4 hours every week on [task].

It was frustrating. I tried [alternatives]. Nothing worked.

Then I discovered a better way...

[Describe the transformation]

Now I [positive outcome] in just [time].

If you're struggling with [problem], check out {{PROJECT_NAME}}.

[CTA]
```

### Budget and Optimization

**Starting Budget:** $10-50/day per ad set during testing phase

**Testing Phase (Weeks 1-2):**
- Run 3-5 ad sets with different audiences
- 2-3 ads per ad set
- $10-20/day per ad set
- Let campaigns run for 5-7 days before making changes
- Kill ad sets with CPA 2x+ above target after sufficient data (50+ clicks)

**Scaling Phase (Weeks 3+):**
- Increase budget on winning ad sets by 20% every 3-5 days
- Duplicate winning ad sets to new audiences
- Refresh creative every 2-4 weeks (ad fatigue)
- Monitor frequency -- above 3.0 means audience saturation

---

## LinkedIn Ads

LinkedIn is the premium B2B advertising platform. Expensive but unmatched for reaching professionals by job title, company, and industry.

### When to Use LinkedIn Ads

- Your buyers are professionals with specific job titles
- Average deal value exceeds $500/year (needed to justify $5-15 CPC)
- You sell to companies (B2B), not individual consumers
- You want to reach decision-makers at specific companies

### Campaign Types

**Sponsored Content:**
- Native ads in the LinkedIn feed
- Single image, video, carousel, or document formats
- Best for: content promotion, lead generation, brand awareness

**Message Ads (InMail):**
- Direct messages to LinkedIn members' inboxes
- Highly personal but use sparingly (people get annoyed by InMail spam)
- Best for: event invitations, high-value offers, personalized outreach
- $0.30-0.80 per send

**Lead Gen Forms:**
- Pre-filled forms within LinkedIn (no landing page needed)
- Users can submit without leaving LinkedIn
- Higher conversion rate but often lower lead quality
- Best for: content downloads, webinar sign-ups, demo requests

**Text Ads:**
- Small text ads in the right sidebar
- Very cheap ($2-5 CPC) but low CTR
- Good for brand awareness on a small budget

### Targeting Options

LinkedIn's targeting is its superpower. You can target by:

**Job-Based:**
- Job title (e.g., "VP of Engineering," "Product Manager")
- Job function (e.g., Engineering, Marketing, Sales)
- Seniority level (e.g., Director, VP, C-Suite)
- Years of experience

**Company-Based:**
- Company name (target specific companies -- ABM)
- Company size (1-10, 11-50, 51-200, 201-500, 500+)
- Industry (Technology, Finance, Healthcare, etc.)
- Company revenue

**Skills and Interests:**
- Member skills (e.g., "Python," "Product Management")
- Member interests
- Group membership (target members of specific LinkedIn Groups)

**Education:**
- Schools attended
- Degrees
- Fields of study

### Audience Size Guidelines

- Minimum audience: 50,000 for Sponsored Content
- Sweet spot: 100,000-500,000 for testing
- Too broad: 1,000,000+ (narrow your targeting)
- Too narrow: Under 20,000 (not enough reach)

### LinkedIn Ad Formats

**Single Image Ad:**
- Image: 1200x627 pixels
- Headline: 70 characters (gets truncated after ~55 on mobile)
- Description: 150 characters
- Introductory text: up to 600 characters (keep it under 150 for best results)

**Video Ad:**
- 15-30 seconds optimal
- Horizontal (16:9) or square (1:1)
- Captions required
- Professional tone performs better on LinkedIn

**Carousel Ad:**
- 2-10 cards
- Card image: 1080x1080
- Card headline: 45 characters
- Good for: step-by-step value props, multi-feature showcases

**Document Ad:**
- Upload a PDF that users can swipe through in-feed
- Great for: short guides, infographics, data reports
- Users engage without leaving LinkedIn

### Budget Reality Check

LinkedIn is expensive. Set expectations accordingly:

| Metric | Typical Range |
|--------|--------------|
| CPC (Sponsored Content) | $5-15 |
| CPC (Text Ads) | $2-5 |
| CPM (Sponsored Content) | $30-80 |
| Cost per Lead (Lead Gen Form) | $30-100 |
| Cost per InMail Send | $0.30-0.80 |
| Minimum daily budget | $10 |

**Minimum viable test budget:** $1,000/month for 30 days of data

**ROI math:** If your CPA target is $100, you need a customer LTV of at least $300-500 to justify LinkedIn ads. Products under $50/month per user rarely work on LinkedIn.

### LinkedIn Ad Copy

**Professional tone. Industry insight. Clear CTA.**

```
[Bold claim or statistic about the industry]

[How your product connects to that insight]

[CTA: Download the guide / Book a demo / Start free trial]
```

Example:
```
Engineering teams waste 40% of their time on manual deployments.

{{PROJECT_NAME}} automates your CI/CD pipeline so your team can ship faster.

Start your free trial: {{WEBSITE_URL}}
```

---

## Twitter/X Ads

Twitter is underrated for tech and developer products. The audience skews tech-savvy and is receptive to product discovery.

### Campaign Types

| Campaign | Objective | Best For |
|----------|-----------|----------|
| Website Traffic | Drive clicks to your site | Landing pages, blog posts |
| Engagement | Get likes, retweets, replies | Building social proof |
| Followers | Grow your Twitter following | Long-term brand building |
| Video Views | Promote video content | Product demos, announcements |
| App Installs | Drive mobile app downloads | Mobile products |
| Conversions | Drive sign-ups/purchases | Direct response |

### Audience Targeting

**Keyword Targeting:**
- Target people who tweet about or engage with specific keywords
- Example: Target people who tweet about "CI/CD," "deployment," "DevOps"
- More intent-based than interest targeting

**Follower Look-alikes:**
- Target people similar to followers of specific accounts
- Example: Target followers of @github, @vercel, @stripe (for dev tools)
- Powerful for niche tech audiences

**Interest Targeting:**
- Broad categories: Technology, Business, Gaming, etc.
- Sub-categories available for more precision
- Less precise than keyword or follower targeting

**Conversation Topics:**
- Target people who engage with specific conversation topics
- Twitter tracks trending topics and ongoing conversations
- Good for timely, relevant targeting

**Custom Audiences:**
- Upload email lists or Twitter usernames
- Retarget website visitors (Twitter Pixel required)
- Engagement retargeting (people who interacted with your tweets)

### Ad Formats

**Promoted Tweets:**
- Regular tweets promoted to a wider audience
- Can include text, images, videos, polls, or links
- Best when they look organic (not overtly "ad-like")
- 280 character limit

**Video Ads:**
- In-feed video (auto-play on mute)
- 15 seconds optimal, 2:20 max
- Square or landscape format
- Include captions

**Website Cards:**
- Rich link preview with custom image, title, and CTA button
- Higher CTR than plain link tweets
- Image: 800x418 (1.91:1) or 800x800 (1:1)
- Title: 70 characters
- CTA button: pre-set options (Learn More, Shop Now, etc.)

**Carousel Ads:**
- 2-6 cards with images or videos
- Each card can link to a different URL
- Good for feature showcases

### Twitter Ad Copy Best Practices

**Native-feeling tweets work best:**
```
We've been working on this for months.

{{PROJECT_NAME}} now lets you [new capability] in seconds.

Try it free: {{WEBSITE_URL}}
```

**Thread-style (hook → value → CTA):**
```
Card 1: "The biggest problem with [task] isn't what you think..."
Card 2: "It's that [insight about the real problem]."
Card 3: "We built {{PROJECT_NAME}} to fix exactly this."
Card 4: "Try it free. No credit card required."
```

### Budget

- Competitive with Facebook: $0.50-3.00 CPC
- Smaller audience scale than Facebook
- $300-500/month minimum for meaningful testing
- Engagement campaigns can be as low as $0.02-0.05 per engagement

---

## Reddit Ads

Reddit is a goldmine for niche audiences but requires a different approach than other platforms. Reddit users are skeptical of advertising and value authenticity.

### Targeting Options

**Subreddit Targeting:**
- Target specific subreddits relevant to your audience
- Example subreddits for tech products: r/SaaS, r/startups, r/webdev, r/programming, r/entrepreneur, r/smallbusiness
- Most powerful targeting option -- you reach people already discussing relevant topics

**Interest Targeting:**
- Broader categories: Technology, Business, Gaming, etc.
- Less precise than subreddit targeting

**Custom Audiences:**
- Retargeting website visitors
- Lookalike audiences based on your converters

### Ad Formats

**Promoted Posts:**
- Look like regular Reddit posts
- Can include text, image, video, or link
- Appear in subreddit feeds and the main feed
- Comments are enabled by default (be prepared to engage)

**Image/Video Ads:**
- Image: up to 3 MB, recommended 1200x628
- Video: up to 1 GB, 5-30 seconds recommended

### Reddit Audience Behavior

**What works on Reddit:**
- Authenticity and transparency (be honest about what you are selling)
- Providing value before asking for anything
- Engaging with comments on your ad
- Conversational tone, not corporate speak
- Acknowledging limitations of your product

**What does NOT work on Reddit:**
- Hard-sell corporate language
- Ignoring comments on your ads
- Making exaggerated claims
- Targeting irrelevant subreddits
- Ads that look like they were made by a marketing team that has never used Reddit

### Reddit Ad Copy Template

```
Title: I built [product description] because [authentic reason]. Here's what I learned.

Body: Hey r/[subreddit] -- I've been working on {{PROJECT_NAME}} for [time].
It helps with [specific problem that subreddit cares about].

What makes it different: [honest differentiator]

Would love your feedback. Free to try at {{WEBSITE_URL}}
```

### Budget

- CPC range: $0.50-5.00 depending on targeting
- Minimum campaign budget: $5/day
- $300-500/month minimum for testing
- CPMs can be very competitive ($2-8)
- Best value in niche subreddits with smaller audiences

---

## Cross-Platform Strategy

### Coordinated Messaging

If running ads on multiple platforms, maintain consistent messaging while adapting tone:

| Platform | Tone | Message Length | Visual Style |
|----------|------|---------------|-------------|
| Facebook/Instagram | Casual, visual | Short-medium | Eye-catching, colorful |
| LinkedIn | Professional, authoritative | Medium | Clean, corporate |
| Twitter/X | Conversational, direct | Very short | Bold, text-heavy |
| Reddit | Authentic, humble | Medium-long | Minimal, genuine |

### Attribution Across Platforms

- Use UTM parameters on all ad links: `?utm_source=facebook&utm_medium=paid&utm_campaign=[campaign_name]`
- Track assisted conversions (user sees ad on Twitter, converts via Google later)
- Use a UTM naming convention:
  ```
  utm_source: facebook, linkedin, twitter, reddit
  utm_medium: paid_social
  utm_campaign: [campaign_name]
  utm_content: [ad_variant]
  utm_term: [audience_segment]
  ```

---

## Creative Best Practices

### Universal Rules

1. **Stop the scroll** - You have 1-2 seconds to catch attention in a feed. Use contrast, faces, motion, or unexpected visuals.
2. **One message per ad** - Do not try to communicate everything. Pick one benefit, one feature, or one story.
3. **Clear CTA** - Tell people exactly what to do. "Start free trial" beats "Learn more."
4. **Social proof** - Numbers, logos, testimonials, and ratings build trust instantly.
5. **Mobile-first** - Design for mobile screens. Large text, simple compositions, vertical formats.

### Image Ad Specs Summary

| Platform | Feed Size | Stories Size | File Types |
|----------|-----------|-------------|------------|
| Facebook/Instagram | 1080x1080 or 1200x628 | 1080x1920 | JPG, PNG |
| LinkedIn | 1200x627 | N/A | JPG, PNG |
| Twitter/X | 800x418 or 800x800 | N/A | JPG, PNG |
| Reddit | 1200x628 | N/A | JPG, PNG |

### Video Ad Specs Summary

| Platform | Optimal Length | Aspect Ratio | File Size |
|----------|---------------|-------------|-----------|
| Facebook/Instagram Feed | 15-30 seconds | 1:1 or 4:5 | Up to 4 GB |
| Facebook/Instagram Stories | 15 seconds | 9:16 | Up to 4 GB |
| LinkedIn | 15-30 seconds | 16:9 or 1:1 | Up to 200 MB |
| Twitter/X | 15 seconds | 16:9 or 1:1 | Up to 1 GB |
| Reddit | 15-30 seconds | 16:9 | Up to 1 GB |

---

## Budget and Scaling

### Starting Budget Allocation (Multi-Platform)

If running ads on multiple platforms simultaneously, allocate based on your product type:

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS Budget Split:**
```
Facebook/Instagram (retargeting):  40%
LinkedIn (if B2B):                 30%
Twitter/X:                         20%
Reddit:                            10%
```
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "dev_tool" -->
**Developer Tool Budget Split:**
```
Twitter/X:                         35%
Reddit:                            25%
Facebook/Instagram (retargeting):  25%
LinkedIn:                          15%
```
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
**E-commerce Budget Split:**
```
Facebook/Instagram:                60%
Twitter/X:                         15%
Reddit:                            15%
LinkedIn:                          10%
```
<!-- ENDIF -->

### Scaling Checklist

Before increasing budget on any platform:

- [ ] CPA has been stable for at least 2 weeks
- [ ] You have at least 20 conversions on the campaign
- [ ] Increase budget by no more than 20-30% at a time
- [ ] Monitor CPA for 5 days after each increase
- [ ] Refresh creative when frequency exceeds 3.0
- [ ] Expand audiences (broader lookalikes, new interests) before increasing budget on saturated audiences

---

## Action Items for {{PROJECT_NAME}}

- [ ] Select primary social platform based on the selection matrix above
- [ ] Set up Business Manager / ad accounts on chosen platforms
- [ ] Install tracking pixels (Meta Pixel, LinkedIn Insight Tag, Twitter Pixel)
- [ ] Create custom audiences (website visitors, customer list)
- [ ] Design 3-5 ad creatives per platform (image + video)
- [ ] Write 3-5 ad copy variants per platform
- [ ] Set up UTM parameters and tracking
- [ ] Launch initial test campaigns with $10-20/day per ad set
- [ ] Monitor for 7 days before making changes
- [ ] Weekly optimization: kill losers, scale winners, refresh creative
