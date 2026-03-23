# Homepage Strategy for {{PROJECT_NAME}}

> Your homepage is not a landing page. It is the front door to your entire brand. This guide covers strategy, structure, copy, and design for a homepage that communicates value, builds trust, and converts visitors into users.

---

## Table of Contents

1. [Homepage vs. Landing Page](#homepage-vs-landing-page)
2. [Homepage Goal Hierarchy](#homepage-goal-hierarchy)
3. [Above-the-Fold Strategy](#above-the-fold-strategy)
4. [Navigation Strategy](#navigation-strategy)
5. [Content Prioritization Framework](#content-prioritization-framework)
6. [Scroll Behavior Optimization](#scroll-behavior-optimization)
7. [Trust-Building Elements](#trust-building-elements)
8. [Conversion Element Placement](#conversion-element-placement)
9. [Homepage for Different Visitor Types](#homepage-for-different-visitor-types)
10. [Homepage Copy Templates](#homepage-copy-templates)
11. [Common Homepage Mistakes](#common-homepage-mistakes)
12. [Homepage Audit Checklist](#homepage-audit-checklist)

---

## Homepage vs. Landing Page

Understanding the difference is critical. Building a landing page when you need a homepage (or vice versa) wastes effort and loses conversions.

| Dimension | Homepage | Landing Page |
|-----------|----------|--------------|
| **Purpose** | Introduce the brand, serve multiple audiences, provide navigation | Convert one specific audience on one specific action |
| **CTAs** | Multiple (sign up, learn more, read blog, contact sales) | One primary CTA repeated throughout |
| **Navigation** | Full navigation bar with all pages | No navigation (or minimal — logo only) |
| **Audience** | Multiple personas, new + returning visitors | One specific persona from one traffic source |
| **Content** | Broad overview of product and company | Focused pitch for one offer/use case |
| **SEO role** | Ranks for brand name, core product terms | Ranks for specific long-tail keywords or used for paid traffic |
| **Lifespan** | Permanent — evolves over time | Campaign-specific — may be temporary |

### When to Optimize Each

**Optimize your homepage when:**
- Most traffic comes from direct visits or brand searches
- You need to serve multiple customer segments
- Your product has multiple use cases
- You are building long-term brand presence

**Create dedicated landing pages when:**
- Running paid ad campaigns (each campaign gets its own landing page)
- Targeting a specific keyword/audience segment
- Promoting a specific feature, launch, or offer
- You want to test messaging without changing your homepage

---

## Homepage Goal Hierarchy

Your homepage must accomplish three things, in this order:

### Level 1: Communicate Value (0-5 seconds)

The visitor must immediately understand:
- **What** the product does
- **Who** it is for
- **Why** they should care (primary benefit)

If any of these are unclear within 5 seconds, the visitor leaves. This is your above-the-fold job.

**Test this**: Show your homepage to someone for 5 seconds. Ask them: "What does this company do?" If they cannot answer clearly, your Level 1 is failing.

### Level 2: Build Trust (5-30 seconds)

Once they understand what you do, visitors evaluate credibility:
- Social proof (logos, testimonials, user counts)
- Product quality signals (screenshots, demos, design quality)
- Company legitimacy (team, about page, media mentions)

**Test this**: Ask someone: "Would you trust this company with your data/money?" If hesitation, your Level 2 needs work.

### Level 3: Convert Visitors (30+ seconds)

Only after value and trust are established do visitors act:
- Sign up for a free trial
- Request a demo
- Subscribe to updates
- Explore deeper pages

**Test this**: Track your homepage conversion rate. If traffic is high but conversions are low, your Level 1 and 2 are working but Level 3 needs optimization.

---

## Above-the-Fold Strategy

### The Critical Viewport

"Above the fold" means everything visible without scrolling. On desktop this is roughly the top 600-700px. On mobile it is even less — roughly 500-600px. Every pixel counts.

### Elements That Must Be Above the Fold

1. **Logo** — top left (standard placement)
2. **Navigation** — horizontal top bar
3. **Headline** — clear, benefit-driven (the most important element)
4. **Sub-headline** — supporting context
5. **Primary CTA** — visible, obvious, action-oriented
6. **Visual** — product screenshot, demo, illustration, or video
7. **One trust signal** — user count, logo bar, or "no credit card required"

### Hero Section Variants

Choose the hero variant that best fits your product:

#### Variant A: Product Demo Video
```
[Headline]           [Embedded Video]
[Sub-headline]       (autoplay muted, 30-60s)
[CTA Button]
[Trust line]
```
**Best for**: Products with impressive UI/UX, complex products that need demonstration
**Example**: Loom, Notion, Linear

#### Variant B: Product Screenshot
```
[Headline]
[Sub-headline]
[CTA Button]
[Trust line]
[Full-width product screenshot with slight shadow/perspective]
```
**Best for**: Beautiful products, dashboards, design tools
**Example**: Stripe, Vercel, Figma

#### Variant C: Illustration/Animation
```
[Headline]           [Custom illustration]
[Sub-headline]       (or Lottie animation)
[CTA Button]
[Trust line]
```
**Best for**: Abstract products (APIs, infrastructure), products without visual UI
**Example**: Twilio, Auth0, Cloudflare

#### Variant D: Interactive Demo
```
[Headline]
[Sub-headline]
[Embedded interactive demo — visitor can click around]
[CTA: "Try it yourself" or "Sign up for full access"]
```
**Best for**: Products where hands-on experience is the best pitch
**Example**: CodeSandbox, Replit

### Headline Testing Framework

Your headline is the single most impactful element. Test these approaches:

| Approach | Formula | Example |
|----------|---------|---------|
| **Outcome** | "{{Outcome}} for {{Audience}}" | "Faster deployments for engineering teams" |
| **Problem** | "Stop {{Pain}}. Start {{Benefit}}." | "Stop losing customers. Start retaining them." |
| **Quantified** | "{{X}}x {{Improvement}} with {{Product}}" | "3x faster builds with zero configuration" |
| **Social** | "Join {{Count}} {{Audience}} who {{Outcome}}" | "Join 5,000 teams who ship with confidence" |
| **Direct** | "The {{Category}} that {{Differentiator}}" | "The CRM that actually helps you sell" |
| **Question** | "What if you could {{Desired_State}}?" | "What if you could deploy without fear?" |

---

## Navigation Strategy

### Primary Navigation Structure

Your navigation tells visitors what pages exist and what matters most. Structure it carefully.

**Recommended navigation structure (6-8 items maximum):**

```
[Logo]  Product  Solutions  Pricing  Docs  Blog  [Login]  [CTA Button]
```

#### Navigation Elements

| Element | Purpose | Notes |
|---------|---------|-------|
| **Product** | Feature overview, use cases | Dropdown with key features + "See all features" link |
| **Solutions** | Segment by audience or use case | "For Startups," "For Enterprise," "For Developers" |
| **Pricing** | Pricing page | Keep it simple — one link, no dropdown |
| **Docs/Resources** | Documentation, guides, API reference | Dropdown with categories |
| **Blog** | Content/thought leadership | Simple link |
| **Login** | Existing user access | Text link (not button — reduce visual weight) |
| **Primary CTA** | Main conversion action | Button style, high contrast, stands out from other nav items |

### CTA Placement in Navigation

The primary CTA should be:
- **Rightmost element** in the navigation (Western reading pattern: left to right, CTA is the destination)
- **Visually distinct** — use a button style with brand color, not a text link
- **Consistent** with page CTAs — same label as hero CTA
- **Sticky on scroll** — when the hero CTA scrolls out of view, the nav CTA is still accessible

```
Examples:
- "Start Free Trial" (button, filled, brand color)
- "Get Started Free" (button, filled)
- "Sign Up" (button, outlined) — weaker, but acceptable

Avoid: "Contact Us" as the primary CTA (too vague, low intent)
```

### Mobile Navigation

- **Hamburger menu**: Standard on mobile. Place it top-right.
- **CTA visibility**: Keep the primary CTA visible even on mobile (outside the hamburger menu)
- **Menu items**: Same hierarchy as desktop, but may need to flatten dropdowns
- **Search**: Include search if you have extensive content (docs, blog)

### Mega Menu Considerations

If your product has many features or serves multiple audiences, consider a mega menu:

```
[Product dropdown — mega menu]
├── Features
│   ├── Feature A — brief description
│   ├── Feature B — brief description
│   └── Feature C — brief description
├── Use Cases
│   ├── For Developers
│   ├── For Product Teams
│   └── For Enterprise
└── What's New
    └── Link to changelog/releases
```

---

## Content Prioritization Framework

### The Scroll Priority Stack

Organize homepage content by scroll position based on visitor intent at each stage:

```
Position 1 (above fold): WHAT you do + WHO it's for → Hero section
Position 2: WHO trusts you → Social proof bar (logos, user count)
Position 3: WHY it matters → Problem/solution overview
Position 4: HOW it works → 3-step process or key features
Position 5: PROOF it works → Testimonials, case studies, metrics
Position 6: HOW MUCH it costs → Pricing overview or CTA
Position 7: WHAT IF I have questions → FAQ or resource links
Position 8: WHAT DO I DO NEXT → Final CTA
Position 9: EVERYTHING ELSE → Footer
```

### Content Block Decision Matrix

For each potential homepage section, ask:

| Question | If YES | If NO |
|----------|--------|-------|
| Does this help the visitor understand our product? | Include it | Move to a sub-page |
| Does this build trust or reduce risk? | Include it | Move to a sub-page |
| Does this move the visitor toward conversion? | Include it | Move to a sub-page |
| Does this serve the PRIMARY audience? | Include it | Move to a sub-page |
| Can this be communicated in < 100 words? | Include on homepage | Summarize + link to detail page |

### Product-Type Content Priorities

<!-- IF {{PRODUCT_TYPE}} == "saas" -->
**SaaS Homepage Priority Stack:**
1. Value proposition (headline + visual)
2. Social proof (logos of known companies)
3. Key features (3 main features with screenshots)
4. How it works (3-step process)
5. Integration ecosystem (tool logos)
6. Testimonials (ROI-focused)
7. Pricing overview
8. Security/compliance badges
9. Final CTA
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "developer-tool" -->
**Developer Tool Homepage Priority Stack:**
1. What it does + code example
2. GitHub stars / community metrics
3. Quick start (install command)
4. Key capabilities
5. Performance benchmarks
6. Documentation quality showcase
7. Community/ecosystem
8. Enterprise features (if applicable)
9. Final CTA (get started / star on GitHub)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "mobile-app" -->
**Mobile App Homepage Priority Stack:**
1. Value proposition + app store badges
2. Phone mockup showing the app
3. Feature walkthrough (screen carousel)
4. App store ratings/reviews
5. How it works (3 steps)
6. User testimonials
7. Download CTA (with QR code for desktop visitors)
<!-- ENDIF -->

<!-- IF {{PRODUCT_TYPE}} == "ecommerce" -->
**E-Commerce Homepage Priority Stack:**
1. Hero banner (seasonal/promotional)
2. Category navigation (visual categories)
3. Featured/bestseller products
4. Value propositions (free shipping, returns, guarantee)
5. Social proof (reviews, press mentions)
6. New arrivals
7. Email signup offer
8. Trust badges (payment security, guarantees)
<!-- ENDIF -->

---

## Scroll Behavior Optimization

### Why People Stop Scrolling

Visitors stop scrolling when they:
1. Find what they need (good — if they convert)
2. Get bored or confused (bad)
3. Hit a visual dead end (bad — no reason to continue)
4. Encounter content that feels irrelevant (bad)

### Techniques to Keep People Scrolling

#### Visual Continuity
- **Alternating backgrounds**: Alternate between white and light gray sections. This creates visual rhythm and signals "new section ahead."
- **Cut-off content**: Let text or images peek from below the current viewport. This creates curiosity.
- **Scroll indicators**: Subtle arrows or "scroll to learn more" text (use sparingly).

#### Content Hooks
- **Pattern interrupts**: Break up text-heavy sections with visuals, quotes, or interactive elements.
- **Progressive disclosure**: Each section answers one question and raises the next.
  - "Here is what it does" → naturally leads to → "Here is how it works"
  - "Here is how it works" → naturally leads to → "Here is what others say about it"
- **Storytelling arc**: Problem → Solution → Proof → Offer follows a natural narrative.

#### Technical Optimization
- **Lazy loading**: Load below-fold content on demand (prevents slow initial load)
- **Smooth scroll**: Use CSS `scroll-behavior: smooth` for anchor links
- **Scroll-triggered animations**: Subtle fade-ins and slide-ins as content enters viewport (not aggressive bouncing)
- **Skeleton screens**: If content loads dynamically, show placeholder shapes while loading

### Measuring Scroll Behavior

- **Scroll depth tracking**: Set up events at 25%, 50%, 75%, 100% scroll depth
- **Heatmaps**: Use Hotjar or Microsoft Clarity (both have free tiers) to visualize where visitors focus and where they drop off
- **Average fold**: Identify the natural "drop-off line" where most visitors stop scrolling

---

## Trust-Building Elements

### Trust Element Inventory

| Trust Element | Impact Level | Placement |
|---------------|-------------|-----------|
| **Customer logos** (recognizable brands) | Very High | Below hero, pricing page |
| **Testimonials** (with names, photos, titles) | Very High | Mid-page, pricing page |
| **User/customer count** | High | Hero section, CTA sections |
| **G2/Capterra/TrustPilot badges** | High | Hero area, footer |
| **Security certifications** (SOC 2, ISO) | High (B2B) | Footer, security page, pricing |
| **Media mentions** ("As seen in...") | Medium-High | Below hero or mid-page |
| **Case studies** (with metrics) | Medium-High | Mid-page, linked from homepage |
| **Team photos/bios** | Medium | About page (link from homepage) |
| **Money-back guarantee** | Medium | Pricing section, CTA sections |
| **Uptime status** | Medium | Footer (link to status page) |
| **Open source / transparent** | Medium (tech) | Hero, footer |
| **Payment processor logos** (Stripe, PayPal) | Low-Medium | Checkout, footer |

### Placement Strategy

**Rule of thumb**: Place trust elements immediately AFTER a conversion ask. The sequence is:
1. Make the ask (CTA)
2. Reduce the risk (trust element)

```
Example flow:
[CTA: Start Free Trial]
"No credit card required. Cancel anytime."
"Trusted by 2,000+ companies including [logos]"
```

### Building Trust from Zero

If you are pre-launch or early stage with no users:

| Instead of... | Use... |
|---------------|--------|
| Customer logos | Advisor/investor logos or "backed by" |
| User count | Beta waitlist count or "500+ signups in first week" |
| Testimonials | Beta user feedback or founder credibility |
| Media mentions | Product Hunt launch, HN post, community recognition |
| Case studies | Your own usage story or hypothetical ROI calculation |
| G2 badges | "Launching soon" with waitlist CTA |

---

## Conversion Element Placement

### CTA Placement Map

Your homepage should have **3-5 CTA touchpoints** (same CTA, different locations):

```
[CTA #1] — Navigation bar (always visible)
[CTA #2] — Hero section (primary, most visible)
[CTA #3] — After features section (mid-scroll convert point)
[CTA #4] — After testimonials (post-trust convert point)
[CTA #5] — Final CTA section (bottom-of-page last chance)
```

### CTA Hierarchy

| CTA Type | Purpose | Design Treatment |
|----------|---------|-----------------|
| **Primary CTA** | Main conversion (sign up, start trial) | Filled button, brand color, prominent |
| **Secondary CTA** | Alternative action (watch demo, see pricing) | Outlined button or text link |
| **Tertiary CTA** | Low-commitment (read blog, join newsletter) | Text link, subtle |

### Form Placement

If your homepage includes a sign-up form:

**In-hero form** (aggressive but effective for simple products):
```
[Email input] [CTA Button: "Get Started Free"]
"Join {{USER_COUNT}}+ {{USER_TYPE}}. No credit card required."
```

**Separate step** (better for complex products):
```
[CTA Button: "Start Free Trial"]
→ Takes them to dedicated sign-up page
```

**General rule**: If sign-up requires only email, inline it in the hero. If it requires multiple fields, link to a separate page.

### Conversion Tracking Setup

Track these events on your homepage:

- [ ] CTA button clicks (which CTA location converts best)
- [ ] Form submissions (if inline form)
- [ ] Scroll depth (do visitors reach lower CTAs)
- [ ] Navigation clicks (what pages are most requested)
- [ ] Video plays (if demo video on homepage)
- [ ] External link clicks (social media, app stores)

---

## Homepage for Different Visitor Types

### Persona-Based Homepage Experience

Your homepage serves multiple visitor types. Design for all of them.

#### New Visitors (never heard of you)
**Their mindset**: "What is this? Is it relevant to me?"
**What they need**: Clear value proposition, credibility signals, easy-to-understand explanation
**Optimize for**: Clarity above all else

#### Returning Visitors (evaluating)
**Their mindset**: "I've been here before. Let me dig deeper."
**What they need**: Easy navigation to details (pricing, features, docs), login access
**Optimize for**: Navigation and information architecture

#### Existing Customers (need to log in or find help)
**Their mindset**: "Where is the login button? Where is support?"
**What they need**: Login link, support link, documentation link
**Optimize for**: Do NOT let your homepage obstruct logged-in users from reaching the product

#### Technical Decision-Makers
**Their mindset**: "Does this integrate with our stack? Is it secure? What is the architecture?"
**What they need**: Technical docs, architecture overview, security page, API docs
**Optimize for**: Quick links to technical resources

#### Business Decision-Makers
**Their mindset**: "What is the ROI? How does pricing work? Are similar companies using this?"
**What they need**: Case studies, pricing, testimonials from peers, ROI data
**Optimize for**: Business outcomes and social proof

### Dynamic Homepage Elements

Consider personalizing the homepage experience:

| Visitor Signal | Personalization |
|----------------|-----------------|
| **First visit** | Show onboarding-oriented content (what it is, how it works) |
| **Returning visit** | Show "Welcome back" + shortcut to login/dashboard |
| **From specific campaign** | Match headline to ad copy they clicked |
| **From documentation** | Show developer-focused features |
| **Geographic** | Show local testimonials, local pricing currency |

---

## Homepage Copy Templates

### Template: Complete Homepage Copy for {{PROJECT_NAME}}

```markdown
--- HERO SECTION ---
Headline: "{{PRIMARY_BENEFIT}} for {{TARGET_AUDIENCE}}"
Sub-headline: "{{PROJECT_NAME}} helps you {{CORE_ACTION}} so you can
{{DESIRED_OUTCOME}}. {{PROOF_METRIC}}."
CTA: "{{CTA_TEXT}}"
Trust line: "Free for {{TRIAL_PERIOD}}. No credit card required."

--- SOCIAL PROOF BAR ---
"Trusted by {{USER_COUNT}}+ {{USER_TYPE}} worldwide"
[Logo] [Logo] [Logo] [Logo] [Logo]

--- PROBLEM/SOLUTION ---
Heading: "{{PAIN_CATEGORY}} shouldn't be this hard"
Body: "You spend too much time on {{PAINFUL_TASK}} and not enough on
{{WHAT_THEY_CARE_ABOUT}}. {{PROJECT_NAME}} fixes that."

--- KEY FEATURES (3) ---
Heading: "Everything you need to {{CORE_OUTCOME}}"

Feature 1: {{FEATURE_1_HEADLINE}}
{{FEATURE_1_BENEFIT_DESCRIPTION}}

Feature 2: {{FEATURE_2_HEADLINE}}
{{FEATURE_2_BENEFIT_DESCRIPTION}}

Feature 3: {{FEATURE_3_HEADLINE}}
{{FEATURE_3_BENEFIT_DESCRIPTION}}

--- HOW IT WORKS ---
Heading: "Get started in minutes"
Step 1: {{STEP_1}} — "{{STEP_1_DESCRIPTION}}"
Step 2: {{STEP_2}} — "{{STEP_2_DESCRIPTION}}"
Step 3: {{STEP_3}} — "{{STEP_3_DESCRIPTION}}"

--- TESTIMONIALS ---
Heading: "Loved by {{TARGET_AUDIENCE}} everywhere"
[Testimonial 1 with photo, name, title, company]
[Testimonial 2 with photo, name, title, company]
[Testimonial 3 with photo, name, title, company]

--- PRICING OVERVIEW ---
Heading: "Simple pricing. No surprises."
"Start free. Upgrade when you're ready."
[Link to full pricing page]

--- FINAL CTA ---
Heading: "Ready to {{PRIMARY_OUTCOME}}?"
Sub-line: "Join {{USER_COUNT}}+ {{USER_TYPE}} who already use {{PROJECT_NAME}}."
CTA: "{{CTA_TEXT}}"
```

---

## Common Homepage Mistakes

### Mistake 1: Feature-First Instead of Benefit-First

**Wrong**: "AI-powered analytics dashboard with real-time data processing"
**Right**: "Know exactly what's working in your business — updated every second"

The visitor does not care about your technology until they understand what it does for THEM.

### Mistake 2: Too Many CTAs Competing

If your homepage has "Sign Up," "Book a Demo," "Watch Video," "Download Whitepaper," "Join Webinar," and "Subscribe to Newsletter" all above the fold, the visitor will choose none of them.

**Fix**: One primary CTA. One secondary. Everything else goes below the fold or in navigation.

### Mistake 3: No Clear Audience Signal

If your headline says "The All-in-One Platform for Everything" — it speaks to no one.

**Fix**: Name your audience explicitly. "For backend engineers who..." or "Built for marketing teams that..."

### Mistake 4: Generic Stock Photos

A stock photo of people in a meeting room with laptops tells visitors nothing about your product and actively reduces trust (it looks like every other website).

**Fix**: Use product screenshots, custom illustrations, or team photos. Anything real beats anything generic.

### Mistake 5: Hiding the Price

Visitors who cannot find pricing information leave and find a competitor who shows pricing. If your pricing is complex, at least show "Starting at $X/month" or "Free tier available."

**Fix**: Include a pricing overview on your homepage or a prominent link to a pricing page.

### Mistake 6: Slow Page Load

Every second of load time reduces conversions by approximately 7%. A homepage with uncompressed hero images, unoptimized videos, and render-blocking scripts is actively losing users.

**Fix**: Target under 2 seconds load time. Use PageSpeed Insights to diagnose issues.

### Mistake 7: No Mobile Optimization

Over 50% of web traffic is mobile. If your homepage is not responsive, you are ignoring half your visitors.

**Fix**: Design mobile-first, then scale up to desktop.

### Mistake 8: Wall of Text

Nobody reads long paragraphs on a homepage. They scan.

**Fix**: Short headlines, bullet points, visual elements, generous whitespace. Paragraphs should be 2-3 sentences maximum.

### Mistake 9: No Social Proof

A homepage without testimonials, logos, or user counts looks like a product nobody uses.

**Fix**: Even one testimonial is better than none. See the social proof playbook for strategies when starting from zero.

### Mistake 10: Outdated Content

A blog section showing posts from 18 months ago, a "Copyright 2022" footer, or a "Coming Soon" feature badge that has been there for a year all signal neglect.

**Fix**: Remove time-sensitive elements you will not maintain, or commit to keeping them current.

---

## Homepage Audit Checklist

Run this checklist quarterly or after any major homepage redesign:

### Clarity (Level 1)
- [ ] Can a stranger understand what you do within 5 seconds?
- [ ] Is the headline benefit-oriented (not feature-oriented)?
- [ ] Is the target audience clear from the headline or sub-headline?
- [ ] Is there a clear, visible CTA above the fold?
- [ ] Does the visual (screenshot/demo/illustration) help explain the product?

### Trust (Level 2)
- [ ] Are there recognizable customer logos?
- [ ] Are there testimonials with real names, titles, and photos?
- [ ] Are there specific metrics or results mentioned?
- [ ] Is there a clear link to a pricing page?
- [ ] Do security/compliance badges appear if relevant?

### Conversion (Level 3)
- [ ] Is there a CTA above the fold?
- [ ] Is there a CTA in the middle of the page?
- [ ] Is there a CTA at the bottom of the page?
- [ ] Is the CTA copy action-oriented and value-driven?
- [ ] Is there a risk-reversal statement near each CTA?

### Technical
- [ ] Page loads in under 3 seconds (desktop)
- [ ] Page loads in under 5 seconds (mobile on 3G)
- [ ] All images are optimized (WebP, compressed)
- [ ] No broken links
- [ ] Mobile responsive (test on real devices)
- [ ] Core Web Vitals pass (LCP, CLS, INP)
- [ ] Analytics tracking is working
- [ ] Heatmap tool is collecting data

### Content
- [ ] All copy is proofread (no typos, grammar errors)
- [ ] Copyright year is current
- [ ] Blog/news section shows recent content (if displayed)
- [ ] No placeholder text or "lorem ipsum" anywhere
- [ ] Social media links work and lead to active profiles
- [ ] Legal pages (privacy, terms) are linked and current
