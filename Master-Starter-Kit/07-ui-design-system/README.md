# 07 - UI Design System

## Purpose

This folder defines how to make your application look like a product, not a template. Every file exists because of a specific failure mode observed in AI-assisted UI development: default shadcn components that all look the same, hardcoded colors that resist theming, gradient backgrounds that scream "AI generated," and layouts that break at mobile widths.

The core principle is simple: **design before code.**

## Why This Matters

There are two ways to build UI with Claude:

**Approach A (Code First):**
1. Tell Claude to build a dashboard
2. Claude uses default shadcn components
3. Every card is the same size, every button is the same color
4. It looks like a tutorial project
5. You ask Claude to "make it look better"
6. Claude adds gradients, shadows, and animations randomly
7. It now looks like an AI-generated tutorial project
8. Demo rating: 2/10

**Approach B (Design First):**
1. Define brand identity (colors, typography, spacing)
2. Create design tokens (CSS variables + Tailwind config)
3. Research best-in-class products for your domain
4. Generate design concepts before writing code
5. Customize shadcn components to match your brand
6. Build pages following the design spec
7. Verify against anti-slop rules
8. Demo rating: 8/10

Same amount of time. Radically different results. The difference is process.

## Files in This Folder

| File | What It Covers | When to Use |
|------|---------------|-------------|
| [design-token-guide.md](./design-token-guide.md) | Creating and applying design tokens | Project setup, before any UI work |
| [brand-identity-worksheet.md](./brand-identity-worksheet.md) | Discovering your brand's visual identity | Very beginning of the project |
| [anti-slop-rulebook.md](./anti-slop-rulebook.md) | Rules that prevent AI-generated-looking UI | During every UI review |
| [component-customization.md](./component-customization.md) | Customizing shadcn/ui beyond defaults | When building components |
| [design-pipeline.md](./design-pipeline.md) | Multi-AI design workflow (research to spec) | Before building any major screen |
| [screenshot-to-code.md](./screenshot-to-code.md) | Recreate UI from screenshots/Dribbble (`/recreate`) | When matching an existing design |
| [ui-overhaul-methodology.md](./ui-overhaul-methodology.md) | Systematic token migration for existing apps | When redesigning an existing app |
| [responsive-testing.template.md](./responsive-testing.template.md) | 4-breakpoint test plan template | After building any page |
| [dashboard-admin-ui-kit.template.md](./dashboard-admin-ui-kit.template.md) | Base component catalog for dashboards & admin panels | When building any dashboard/admin/back-office UI |

## Reading Order

### For a New Project

1. **Brand identity worksheet** -- answer 5 questions to define your visual direction
2. **Design token guide** -- translate brand identity into CSS variables and Tailwind config
3. **Anti-slop rulebook** -- internalize the rules before writing any UI code
4. **Component customization** -- customize the 3 highest-impact components first
5. **Design pipeline** -- use the multi-AI pipeline for each major screen
6. **Screenshot-to-code** -- recreate existing designs with `/recreate` (reverse of design pipeline)
7. **Responsive testing** -- verify every page at 4 breakpoints

### For an Existing Project Redesign

1. **UI overhaul methodology** -- understand the phased migration approach
2. **Brand identity worksheet** -- (re)define your visual direction
3. **Design token guide** -- create the token system you'll migrate to
4. **Anti-slop rulebook** -- identify violations in the current UI
5. **Component customization** -- update the 3 highest-impact components
6. **Responsive testing** -- verify nothing broke during migration

## Key Tools

| Tool | Purpose |
|------|---------|
| `/design-research` | Research UX/UI patterns from real products |
| `/design-generate` | Full multi-AI pipeline (research to implementation spec) |
| `/recreate` | Recreate UI from screenshots/Dribbble images |
| `/design-verify` | Fast code-inspection design checklist |
| `/design-review` | Deep Playwright visual audit with screenshots |
| `/generate-asset` | Generate images with Gemini 3 Pro |
| `/scrape-reference` | Scrape any website for design reference |
| Stitch MCP | AI UI concept generation (HTML/Tailwind export) |
| Magic MCP | Curated beautiful component library |
| Gemini MCP | Design review, image generation, code analysis |
| Firecrawl MCP | Web scraping for real-world design reference |

## The Anti-Slop Promise

If you follow the process in this folder -- define tokens, research first, use the pipeline, verify with anti-slop rules -- your AI-built UI will be indistinguishable from a professionally designed product. The process takes roughly the same time as winging it. The results are in a different league.
