# Integration Example: SaaS Landing Page

## Input Brief

```
/website-builder SaaS landing page for "Flowly" — an AI-powered project management
tool for indie developers and small dev teams (2-10 people).

Audience: developers frustrated with Jira's complexity. They want something
that "just works" without setup overhead.

Brand: modern, slightly playful, very focused. Think Linear meets Notion.
Primary color: indigo. Clean geometric sans-serif font.

Pages: Home (hero + features + pricing + testimonials + CTA), Pricing (3 tiers),
Blog (listing only — no detail pages needed), Changelog, About, Contact.

Features: newsletter signup in hero and footer, contact form,
blog with categories (no authentication).

Integrations: Plausible analytics, Crisp chat widget, Stripe pricing display only.
```

---

## How the Skill Processes This Brief

### What the Skill Infers
- "Pricing display only" → Stripe integration is a pricing table UI, no actual payment processing
- "No detail pages" for blog → uses a CMS pattern or MDX with static routes; skill flags the contradiction (listing implies detail pages) and resolves to: generate listing + a single `[slug]` detail template
- Crisp → added via `next/script` with `strategy="afterInteractive"`
- Plausible → added via `next/script` with `strategy="afterInteractive"` (privacy-first, no cookie banner needed)
- "Think Linear" → minimal nav, dark or light option, monospace accent font for product UI

---

## Expected Phase Outputs

### Phase 1: Design Specification

**UX Analyst output (page list section):**
```markdown
## Page List
| Page | Route | Type | Primary Goal |
|------|-------|------|-------------|
| Home | / | static | Understand + sign up (free trial CTA) |
| Pricing | /pricing | static | Choose a plan |
| Blog | /blog | ISR (revalidate 3600) | Discover content |
| Blog Post | /blog/[slug] | static (generateStaticParams) | Read article |
| Changelog | /changelog | ISR | See product evolution |
| About | /about | static | Trust building |
| Contact | /contact | static | Reach the team |
| 404 | — | static | Recover from bad URL |

## User Journey: Indie Dev Discovery
Entry (Google "jira alternative for small teams") → Blog post →
Home (features scan) → Pricing (free tier check) → Sign up CTA
```

**Visual Designer design decisions:**
- Primary: Indigo (`#6366f1` primary-500, `#4f46e5` primary-600, `#818cf8` primary-400)
- Background: Near-white `#fafafa` light mode, `#09090b` dark mode (Linear-style)
- Font heading: `Inter` (weight 700/800) — same as body but heavier (monolithic look)
- Font body: `Inter` (weight 400/500)
- Font mono: `JetBrains Mono` — for code snippets and product UI mockup screenshots
- Motion: Fast transitions (150ms) on interactive elements; 300ms for page-level reveals
- Component style: Sharp corners on buttons (`rounded-md` not `rounded-full`), subtle shadows

**Content Strategist tone:**
```
Pillars: Direct, Confident, Developer-aware
Spectrum: formal–casual [35% formal — it's devs talking to devs]
Voice: Like a senior engineer who built this to solve their own problem.
No marketing speak. Short sentences. Specifics over vague promises.

Avoid: "empower", "seamlessly", "robust", "cutting-edge", "revolutionary"
Use: "fast", "works", "ships", "handles", "runs"
```

---

### Phase 2: Component Architecture

**Component decisions for SaaS landing:**
```markdown
### HeroSection
Route: /
'use client': NO — server component, CTA uses next/link
Props: headline, subheadline, ctaText, ctaHref, productImageSrc
States: default only (no async data)
Notes: Newsletter email input is a separate NewsletterForm client component
       embedded inside the static HeroSection via Suspense

### PricingTable
Route: /pricing, / (embedded)
'use client': YES — plan toggle (monthly/annual) uses useState
Props: plans (Plan[]), showAnnualToggle, highlightedPlan
States: monthly, annual (toggle), loading (skeleton on initial), selected
Notes: Plan data is static (hardcoded from Stripe product config).
       Actual checkout links open Stripe Checkout URL (env var)

### FeatureGrid
Route: /
'use client': NO
Props: features (Feature[]), columns (2|3)
States: default
Responsive: 1 col → 2 col (tablet) → 3 col (desktop)

### TestimonialSlider
Route: /
'use client': YES — carousel state
Props: testimonials (Testimonial[]), autoPlay (boolean)
States: default, paused (hover/focus), reduced-motion (no animation)

### BlogCard
Route: /blog
'use client': NO
Props: post (Post), showExcerpt (boolean)
States: default, hover (subtle lift)

### NewsletterForm
Route: / (hero), / (footer), /blog
'use client': YES — form state
States: idle, loading, success ("You're in! Check your email"), error
Action: Server action → email added to Resend audience
```

---

### Phase 3: Page Scaffolding

**Home page (`app/page.tsx`) structure:**
```typescript
// Static server component — no 'use client'
export const metadata: Metadata = {
  title: 'Flowly — Project management that ships',
  description: 'The project management tool built for dev teams who hate project management tools. No setup. No Jira. Just work.',
  // ... OG, Twitter
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          headline="{PLACEHOLDER: hero headline}"
          subheadline="{PLACEHOLDER: hero subheadline}"
          ctaText="{PLACEHOLDER: CTA text}"
          ctaHref="/pricing"
        />
        <FeatureGrid features={features} columns={3} />
        <SocialProofBar />           {/* client logos, stat counter */}
        <FeatureDeepDive />          {/* alternating image+text sections */}
        <TestimonialSlider testimonials={testimonials} autoPlay />
        <PricingTable plans={plans} showAnnualToggle highlightedPlan="pro" />
        <CtaBanner />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
```

**Blog with MDX (`app/blog/[slug]/page.tsx`):**
```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', publishedTime: post.date, tags: post.tags },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  // Article schema, breadcrumb schema
  return (
    <>
      <Navbar />
      <main>
        <article>
          <header>{/* title, date, author, tags */}</header>
          <div className="prose prose-neutral max-w-2xl">
            {post.content}        {/* MDX rendered content */}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
```

**Generated file tree:**
```
src/
  app/
    page.tsx                    ← Home (7 sections)
    layout.tsx
    globals.css
    loading.tsx
    pricing/
      page.tsx                  ← Pricing with 3-tier table
    blog/
      page.tsx                  ← Blog listing with category filter
      [slug]/
        page.tsx                ← Blog post (MDX)
        loading.tsx
    changelog/
      page.tsx                  ← Changelog (newest first)
    about/
      page.tsx                  ← Team + story + values
    contact/
      page.tsx
    sitemap.ts
    robots.ts
    opengraph-image.tsx
    manifest.ts
    icon.tsx
  components/
    atoms/
      Button.tsx Badge.tsx Skeleton.tsx Spinner.tsx
    molecules/
      NavLink.tsx PricingCard.tsx BlogCard.tsx ChangelogEntry.tsx
      NewsletterForm.tsx         ← 'use client'
    organisms/
      Navbar.tsx HeroSection.tsx FeatureGrid.tsx FeatureDeepDive.tsx
      SocialProofBar.tsx TestimonialSlider.tsx PricingTable.tsx
      CtaBanner.tsx NewsletterSection.tsx ContactForm.tsx Footer.tsx
  content/
    blog/                       ← MDX post files
      getting-started.mdx
    changelog/
      2026-03.mdx
  lib/
    utils.ts
    structured-data.ts
    mdx.ts                      ← MDX parsing utilities
    data/
      plans.ts                  ← Pricing plan definitions
      testimonials.ts
      features.ts
    actions/
      newsletter.ts             ← Server action: add to Resend
      contact.ts                ← Server action: send email
```

---

### Phase 4: Content Integration

**Copy Writer output for Home hero:**
```
H1: "Ship projects, not spreadsheets"
Sub: "Flowly gives your team one place to plan, track, and ship —
     without the ceremony of enterprise tools or the chaos of Slack threads."
Primary CTA: "Start for free" → /pricing
Secondary CTA: "See how it works" → /#features
```

**Copy Writer output for Pricing page:**
```
Page H1: "Simple pricing for teams who ship"
Sub: "Start free. Upgrade when you're ready. No surprise bills."

Free tier name: "Solo"
Free tier tagline: "For lone rangers"
Free description: "Everything you need to manage your own work without a spreadsheet."

Pro tier name: "Team"
Pro tier tagline: "For teams that move fast"
Pro description: "Unlimited projects, real-time sync, and priority support for teams up to 10."

Pricing CTA: "Start building"
Pricing FAQ heading: "Questions we actually get"
```

---

### Phase 5: Optimization Highlights

**Performance:**
- `TestimonialSlider` dynamically imported: `const TestimonialSlider = dynamic(() => import(...))`
- Plausible and Crisp scripts: `strategy="afterInteractive"` via `next/script`
- Blog: `export const revalidate = 3600` for ISR
- Hero image (product screenshot): `priority={true}`, `width={1200}` `height={800}`

**SEO:**
- Blog posts: full `Article` schema with `author`, `datePublished`, `dateModified`
- Pricing page: `SoftwareApplication` schema with `offers` array
- FAQ schema on Pricing page FAQ section

**Accessibility:**
- `PricingTable`: `aria-label="Pricing plans"`, each card has `aria-describedby` linked to feature list
- `TestimonialSlider`: `role="region" aria-label="Customer testimonials"`, auto-play stopped by `prefers-reduced-motion`
- `NewsletterForm`: error messages linked via `aria-describedby`, success announced via `aria-live`
- Crisp chat widget: added `aria-label="Open customer support chat"` wrapper

---

## Annotated Phase Decisions

| Decision | Phase | Why |
|----------|-------|-----|
| MDX for blog (not a CMS) | 1 | Brief says "no auth needed" — static MDX avoids CMS setup complexity for the skill; user can add Sanity/Contentlayer later |
| ISR (revalidate 3600) for blog listing | 2 | Blog updates infrequently; ISR gives dynamic feel without server overhead |
| Inter for both heading and body | 1 | "Linear meets Notion" reference — both use Inter exclusively; single font = faster loads |
| PricingTable as client component | 2 | Monthly/annual toggle requires useState; alternative (URL param) adds complexity for no real benefit |
| No cookie banner | 1 | Plausible is cookie-free; Crisp uses essential cookies only (no consent required in most jurisdictions); brief didn't request strict compliance |
| generateStaticParams for blog | 2 | Blog posts are known at build time (MDX files); static generation is fastest; new posts require a redeploy (acceptable for this use case) |
| Stripe display only | 1 | Brief says "pricing display only" — no server-side Stripe SDK needed; CTAs link to Stripe Checkout URLs via env vars |
