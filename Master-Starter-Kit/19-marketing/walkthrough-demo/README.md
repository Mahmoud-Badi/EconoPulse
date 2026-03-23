# Interactive Walkthrough Demo

> Create guided, interactive product demos that let leads experience your product before committing.
> Part of the Master Starter Kit — Marketing Section (Step 19).

---

## What This Is

A complete system for building **interactive sandbox demos** — shareable links where potential clients can explore your product with guided tours, hotspot highlights, and contextual CTAs. Think Navattic, Storylane, or Arcade — but generated specifically for your product.

## Why It Matters

- **Higher conversion:** Interactive demos convert 3-5x better than static screenshots or videos
- **Self-serve discovery:** Leads explore at their own pace without scheduling a sales call
- **Feature awareness:** Guided tours ensure leads see your strongest features
- **Lead capture:** Built-in email gates, mid-tour CTAs, and booking links
- **Analytics:** Track which features interest leads most, where they drop off

## Two Approaches

### 1. Simulated Demo (Recommended for most projects)

A purpose-built HTML/CSS/JS experience that **looks like** your product but runs independently. Content is scripted, interactions are guided, data is mock.

**Best for:** Early-stage products, complex enterprise tools, mobile apps, products with sensitive data.

**Pros:** Fast to build, no backend needed, fully controlled experience, works offline.

### 2. Cloned Frontend Demo

Your actual frontend code running against a **mock API with seed data**. Feels 100% real but sandboxed.

**Best for:** Products with simple frontends, developer tools, products where "real feel" is the selling point.

**Pros:** Highest fidelity, stays in sync with actual product UI, less content to write.

## What's Included

### Planning Templates (7 files)

| Template | Purpose | Key Inputs |
|----------|---------|------------|
| `demo-strategy.template.md` | Goals, audience, success metrics | Tribunal personas, brand messaging |
| `feature-map.template.md` | Features to showcase, priority order | Architecture service/screen list |
| `demo-script.template.md` | Tooltip text, narration, transitions | Brand voice guide |
| `sandbox-config.template.md` | Seed data, mock API responses | API contracts |
| `cta-lead-capture.template.md` | CTA placement, lead forms, gating | Conversion goals |
| `mobile-adaptation.template.md` | Platform strategy, gestures, viewport | Product type |
| `analytics-tracking.template.md` | Events, drop-offs, conversion tracking | KPIs |

### Demo Engine (starter code in `engine/`)

A framework-agnostic HTML/CSS/JS tour system with:

- **Guided mode:** Step-by-step tour with tooltips, spotlights, and narration
- **Free explore mode:** Hotspot beacons on key features, click to learn more
- **Hybrid toggle:** Switch between guided and free anytime
- **CTA module:** Entry gates, mid-tour prompts, end-screen conversion
- **Mobile support:** Responsive web + phone-frame mockup mode
- **Progress tracking:** Visual progress bar, feature exploration tracker
- **Analytics hooks:** Event emission for any analytics provider

### Generator Prompt

`WALKTHROUGH-DEMO-GENERATOR.md` — Claude uses your filled templates to customize the engine code with your brand, content, and features.

## Quick Start

1. Fill the planning templates (Claude does this during Step 19 orchestration)
2. Run the generator to customize the engine code
3. Add your demo content (screenshots, mock data, copy)
4. Deploy to any static host (GitHub Pages, Netlify, Vercel, S3)
5. Share the link with leads

## Dependencies

This section uses outputs from:

- **Step 3 (Tribunal):** User personas and competitive analysis
- **Step 4 (Architecture):** Service list, screen list, API contracts
- **Step 19 (Brand Messaging):** Brand voice, visual identity, messaging framework

## User Flow

```
Lead opens link → Entry gate (optional) → Welcome + mode choice
    → Guided tour / Free explore → Mid-tour CTAs → End screen + CTA
```

At any point, the user can toggle between guided and free-explore modes. Progress is tracked across both.

---

*This template is part of the Master Starter Kit marketing section. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
