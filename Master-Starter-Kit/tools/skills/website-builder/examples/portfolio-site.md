# Integration Example: Personal Photography Portfolio

## Input Brief

```
/website-builder A portfolio site for a freelance architectural photographer based in Tokyo.
Dark, editorial aesthetic. Minimal UI — the photos should be the hero.
Target audience: architecture firms, interior designers, magazine editors.
Pages: Home (full-screen hero gallery), Work (filterable project grid), About, Contact.
Newsletter signup in footer. No blog needed.
```

---

## How the Skill Processes This Brief

### What the Skill Infers (Not Explicitly Stated)
- Mobile-first grid → masonry layout implied by photography portfolio context
- No e-commerce → contact form is the conversion goal
- Japan base → may need bilingual consideration (skill will flag as open question)
- No auth → static site with ISR for optimal performance
- "Editorial, dark" → dark mode by default, high-contrast typography

---

## Expected Phase Outputs

### Phase 1: Design Specification

**UX Analyst output (`ux-spec.md`):**
```markdown
## Site Purpose
Showcase architectural photography to attract editorial and commercial clients.

## User Personas
1. **Agency Art Director** — 35-50, seasoned eye, vetting photographers fast;
   wants: full-screen work immediately, fast load, easy contact
2. **Magazine Photo Editor** — 30-45, browsing on mobile in a meeting;
   wants: grid that shows style at a glance, high-res previews, quick bio
3. **Architecture Firm Partner** — 45-60, evaluating for a project;
   wants: proof of work type (exterior/interior/detail), process clarity, pricing signal

## Page List
| Page | Route | Type | Primary Goal |
|------|-------|------|-------------|
| Home | / | static | Immediate visual impact; one CTA: "See the Work" |
| Work | /work | static | Browse and filter projects by category |
| Project Detail | /work/[slug] | static (generateStaticParams) | Deep dive into one project |
| About | /about | static | Establish trust and personality |
| Contact | /contact | static | Submit inquiry |

## Navigation
Primary: Work, About, Contact
Secondary: (none — ultra minimal)
Mobile: full-screen overlay menu (dark bg, large links)

## User Journey: Client Discovery
Entry → Home (gallery hero, 3s impression) → Work (filter by type) →
Project Detail (scroll through, quality check) → About (bio + client logos) →
Contact (submit brief)
```

**Visual Designer output (`design-tokens.json`):**
```json
{
  "colors": {
    "primary": { "50": "#f5f0eb", "400": "#c9a87a", "500": "#b8935a", "600": "#9a7a48" },
    "neutral": {
      "50": "#f9f9f9",
      "200": "#e5e5e5",
      "400": "#6b6b6b",
      "700": "#3a3a3a",
      "900": "#0a0a0a"
    },
    "dark": {
      "bg": "#0a0a0a",
      "surface": "#141414",
      "border": "#2a2a2a",
      "text": "#f0ede8",
      "muted": "#8a8a8a"
    },
    "semantic": {
      "success": "#4a9e7b",
      "warning": "#c9954a",
      "error": "#c94a4a",
      "info": "#4a7ac9"
    }
  },
  "typography": {
    "fontHeading": "Playfair Display",
    "fontBody": "Inter",
    "scale": {
      "xs": "0.75rem", "sm": "0.875rem", "base": "1rem",
      "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem",
      "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem"
    }
  }
}
```

**Content Strategist output (`content-strategy.md` excerpt):**
```markdown
## Tone of Voice
Pillars: Precise, Contemplative, Assured
Spectrum: formal–casual [60% formal], serious–playful [80% serious]

Voice: The writing should feel like a thoughtful artist statement.
Spare. No superlatives. Trust the work to speak.

## Home Page Content Plan
H1: "Architecture through light and time"  ← real copy, not placeholder
Intro: None — let the image carry the moment
CTA: "View the work"
```

---

### Phase 2: Component Architecture

**Key component decisions (`component-catalog.md` excerpt):**
```markdown
### FullscreenGallery
Category: organism
Route(s): /
Purpose: Rotating full-viewport images with minimal overlay navigation
Props: images (array of {src, alt, project}), autoplay (boolean)
States: loading (black screen → fade in), idle (cycling), paused (on hover)
shadcn/ui base: custom
'use client': YES — browser animations and intersection observer

### ProjectGrid
Category: organism
Route(s): /work
Props: projects (array of Project), categories (string[])
States: default, filtered, empty ("No projects in this category")
Responsive: 1 col mobile, 2 col tablet, 3 col desktop (masonry on desktop)
'use client': YES — filter state managed client-side

### ProjectDetail
Category: template
Route(s): /work/[slug]
Server component: YES — all data static via generateStaticParams
Props: fetched from project data file
```

---

### Phase 3: Page Scaffolding

**Generated file tree (`phase-3/repo/`):**
```
src/
  app/
    layout.tsx                  ← RootLayout with Playfair Display + Inter
    globals.css                 ← dark mode default, CSS variables
    page.tsx                    ← Home: FullscreenGallery + minimal nav overlay
    loading.tsx                 ← Black screen (intentional for dark aesthetic)
    work/
      page.tsx                  ← ProjectGrid with CategoryFilter
      loading.tsx               ← Skeleton grid
      [slug]/
        page.tsx                ← ProjectDetail with generateStaticParams
        loading.tsx
    about/
      page.tsx                  ← Bio + client logos + process section
    contact/
      page.tsx                  ← ContactForm + studio info
    api/
      contact/
        route.ts                ← Contact form handler (Resend integration)
    sitemap.ts
    robots.ts
    opengraph-image.tsx
    manifest.ts
  components/
    atoms/
      Button.tsx
      Badge.tsx                 ← Project category tags
      Skeleton.tsx
    molecules/
      NavLink.tsx
      ProjectCard.tsx           ← Image + hover overlay with project title
      CategoryFilter.tsx        ← Filter buttons (client component)
    organisms/
      FullscreenGallery.tsx     ← Hero slideshow
      ProjectGrid.tsx           ← Masonry/grid layout
      ContactForm.tsx           ← react-hook-form + zod + server action
      Footer.tsx                ← Newsletter + social + copyright
      Navbar.tsx                ← Transparent → opaque on scroll
  lib/
    utils.ts
    structured-data.ts
    actions/
      contact.ts                ← Server action for contact form
    data/
      projects.ts               ← Static project data (typed)
package.json
tsconfig.json
next.config.ts
tailwind.config.ts
```

---

### Phase 4: Content Integration

**Copy examples written by Copy Writer:**

Home page:
```
H1: "Architecture through light and time"
Nav: Work  About  Contact
Footer tagline: "Capturing structure, shadow, and the space between."
Newsletter placeholder: "Occasional dispatches from the field →"
Contact success: "Your message has arrived. I reply within 48 hours."
```

**Structured data added by Structured Data Builder:**
- `WebSite` schema on root
- `Person` schema on `/about` (photographer bio)
- `ImageGallery` schema on `/work`
- `BreadcrumbList` on all non-home pages

---

### Phase 5: Optimization

**Performance fixes applied:**
- All project images: `next/image` with `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Hero gallery images: `priority={true}` on first image, `loading="lazy"` on subsequent
- `ProjectGrid`: used `dynamic()` import for masonry layout library
- Static generation: all routes are static via `generateStaticParams`

**SEO fixes applied:**
- Each project page gets unique title: `{Project Name} — {Location} | Studio Name`
- `alternates.canonical` set on all pages
- Image alt text pattern: `"[Building Name], [City], [Year] — architectural photography by [Name]"`

**Accessibility fixes applied:**
- Skip-to-content link added (styled to match dark aesthetic when focused)
- Gallery: `aria-roledescription="slideshow"`, previous/next buttons labeled
- `prefers-reduced-motion` stops gallery autoplay entirely
- All project cards: `<article>` element with heading inside

---

## Final Repo Structure

```
my-photography-portfolio/
├── src/
│   ├── app/                    ← Next.js App Router pages
│   ├── components/             ← Atoms, molecules, organisms
│   └── lib/                   ← Utilities, data, actions
├── public/                     ← Static assets (logo, OG image placeholder)
├── .website-builder/           ← Skill working files (gitignore this)
│   ├── state.json
│   ├── phase-1/               ← Design specs
│   ├── phase-2/               ← Component catalog
│   ├── phase-5/               ← Audit reports
│   └── handoffs/              ← Inter-phase context
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── DEPLOY.md                   ← Deployment instructions
└── README.md
```

---

## Deployment Instructions (DEPLOY.md content)

```markdown
# Deploy to Vercel

## Prerequisites
- Node.js 20+
- Vercel account

## Local Development
npm install
npm run dev
# → http://localhost:3000

## Environment Variables
Copy .env.example to .env.local:
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Studio Name
RESEND_API_KEY=re_...     ← for contact form email delivery

## Deploy
npx vercel
# Follow prompts — select Next.js framework (auto-detected)
# Add environment variables in Vercel dashboard

## Custom Domain
Vercel dashboard → Domains → Add your domain
Update NEXT_PUBLIC_SITE_URL env var to match

## After Launch
1. Submit sitemap: https://yourdomain.com/sitemap.xml to Google Search Console
2. Set up Vercel Analytics for Core Web Vitals monitoring
3. Add real project images to replace Unsplash placeholders
```

---

## Annotated Phase Decisions

| Decision | Phase | Why |
|----------|-------|-----|
| Dark mode by default (not toggled) | 1 | Brief said "dark aesthetic" — photography portfolio convention; toggling would complicate the image color strategy |
| No CMS | 1 | Brief has <20 pages of static content; Contentlayer or MDX would add complexity for no user value |
| generateStaticParams for projects | 2 | All project data is in a local data file; static generation gives best performance and no server costs |
| Playfair Display for headings | 1 | Editorial serif aligns with "architectural" and "contemplative" brand personality |
| Server action (not API route) for contact | 2 | Simpler, type-safe, no CORS complexity; React 19 + Next.js 15 best practice |
| FullscreenGallery as client component | 2 | Requires browser APIs (IntersectionObserver, requestAnimationFrame) for smooth animation |
