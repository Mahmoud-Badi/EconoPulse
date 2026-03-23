# Brand Identity Worksheet

## Purpose

Before writing a single line of CSS, answer 5 questions. These answers determine your design tokens, component styles, and overall visual personality. Skip this and you get "generic shadcn template." Do this and you get a cohesive brand.

This is a conversation between Claude and the user. Claude asks the questions, the user answers, and Claude generates the design system from the answers.

---

## The 5 Questions

### Question 1: Pick 3-5 Adjectives

> "Which adjectives describe how your product should feel to users?"

| Adjective | What It Means for Design |
|-----------|-------------------------|
| **Professional** | Restrained color use, clean typography, structured layouts |
| **Warm** | Warmer neutral tones (stone/sand), rounded corners, softer shadows |
| **Modern** | Plenty of white space, minimal borders, subtle shadows |
| **Playful** | Rounded elements, brighter colors, more visual variety |
| **Minimal** | Fewer elements per page, lots of breathing room, muted colors |
| **Bold** | Strong primary color, larger typography, high contrast |
| **Trustworthy** | Blue/green tones, conservative layout, clear information hierarchy |
| **Innovative** | Unique interactions, creative layouts, distinctive components |
| **Efficient** | Dense layouts, compact spacing, data-forward design |
| **Premium** | Subtle animations, refined typography, deliberate restraint |

**Common combinations:**
- SaaS B2B: Professional + Modern + Trustworthy
- Consumer app: Warm + Playful + Modern
- Developer tool: Minimal + Efficient + Innovative
- Healthcare/Finance: Professional + Trustworthy + Warm
- Operations/Logistics: Efficient + Professional + Bold

### Question 2: Pick a Color Family

> "Which color family best represents your brand?"

| Family | Psychology | Best For |
|--------|-----------|----------|
| **Blue** | Trust, reliability, calm | Finance, healthcare, enterprise, SaaS |
| **Green** | Growth, health, success | Health tech, sustainability, fintech |
| **Purple** | Premium, creative, unique | Design tools, luxury, creative platforms |
| **Red** | Energy, urgency, action | Marketplaces, food, social media |
| **Orange** | Friendly, energetic, warm | Communication, community, e-commerce |
| **Indigo** | Depth, intelligence, focus | Developer tools, analytics, AI products |
| **Teal** | Balance, clarity, freshness | Healthcare, productivity, modern SaaS |
| **Amber** | Warmth, caution, attention | Operations, logistics, construction |

**After choosing:** Claude selects the specific shade (typically 600) and generates the full 50-950 scale.

### Question 3: Pick Density Preference

> "How information-dense should the interface be?"

| Density | Character | Metrics |
|---------|-----------|---------|
| **Spacious** | Consumer-friendly, breathing room | 32px section gaps, 24px card padding, 16px element spacing |
| **Balanced** | Most apps, comfortable | 24px section gaps, 16-20px card padding, 12px element spacing |
| **Dense** | Data-heavy, operations | 16px section gaps, 12px card padding, 8px element spacing |

**Guidelines:**
- If users scan many records daily: Dense
- If users make considered decisions: Balanced
- If users are non-technical: Spacious
- If users are power users: Dense
- If it's a marketing site: Spacious

### Question 4: Pick Component Style

> "What shape personality should components have?"

| Style | Radius Values | Character |
|-------|--------------|-----------|
| **Sharp** | 2px / 4px / 6px / 8px | Corporate, serious, structured |
| **Softly rounded** | 4px / 6px / 8px / 12px | Friendly, approachable, modern |
| **Very rounded** | 8px / 12px / 16px / 24px | Playful, casual, consumer |

**Rule:** Pick one and commit. Mixing sharp buttons with very rounded cards looks incoherent.

### Question 5: Pick a Reference Product

> "Name a product whose visual style you admire. It doesn't need to be in your industry."

| Reference | What You Get |
|-----------|-------------|
| **Stripe** | Clean lines, subtle gradients, dense but readable, indigo/blue palette |
| **Linear** | Minimal, dark-mode-first, sharp typography, purple accents |
| **Notion** | Ultra-clean, lots of whitespace, system fonts, minimal color |
| **Vercel** | Black/white dominant, sharp contrast, monospace accents |
| **Figma** | Colorful but controlled, playful radius, clear hierarchy |
| **Slack** | Friendly, warm colors, rounded corners, accessible |
| **GitHub** | Information-dense, blue accents, functional over decorative |
| **Shopify** | Green accents, balanced density, professional but approachable |
| **Airtable** | Colorful, grid-based, data-forward, rounded components |
| **Mercury** | Premium banking feel, subtle animations, restrained palette |

**After answering:** Claude uses `/scrape-reference` or Firecrawl to pull design patterns from the reference product.

---

## From Answers to Tokens

Once the user answers all 5 questions, Claude generates the design system:

### Example: NEMT Operations Platform

**Answers:**
1. Adjectives: Professional, Efficient, Trustworthy
2. Color family: Indigo
3. Density: Balanced (dispatchers + admins, mixed technical ability)
4. Component style: Softly rounded
5. Reference: Linear (clean, minimal, professional)

**Generated tokens:**

```css
@theme {
  /* Primary: Indigo (trustworthy + professional) */
  --color-primary-50: #eef2ff;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-900: #312e81;

  /* Neutrals: Slate (cool, professional) */
  --color-neutral-50: #f8fafc;
  --color-neutral-200: #e2e8f0;
  --color-neutral-500: #64748b;
  --color-neutral-900: #0f172a;

  /* Density: Balanced */
  --space-section: 1.5rem;
  --space-card: 1.25rem;
  --space-stack: 0.75rem;

  /* Style: Softly rounded */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows: Subtle (professional, not dramatic) */
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.08);
  --shadow-card-hover: 0 4px 12px rgb(0 0 0 / 0.1);

  /* Typography: Inter (clean, universal) */
  --font-sans: "Inter", system-ui, sans-serif;
}
```

### Example: Consumer Health App

**Answers:**
1. Adjectives: Warm, Modern, Playful
2. Color family: Teal
3. Density: Spacious
4. Component style: Very rounded
5. Reference: Slack

**Generated tokens:**

```css
@theme {
  /* Primary: Teal (health + freshness) */
  --color-primary-50: #f0fdfa;
  --color-primary-600: #0d9488;
  --color-primary-700: #0f766e;
  --color-primary-900: #134e4a;

  /* Neutrals: Stone (warm, approachable) */
  --color-neutral-50: #fafaf9;
  --color-neutral-200: #e7e5e4;
  --color-neutral-500: #78716c;
  --color-neutral-900: #1c1917;

  /* Density: Spacious */
  --space-section: 2rem;
  --space-card: 1.5rem;
  --space-stack: 1rem;

  /* Style: Very rounded */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;

  /* Shadows: Soft (warm, inviting) */
  --shadow-card: 0 2px 8px rgb(0 0 0 / 0.06);
  --shadow-card-hover: 0 8px 24px rgb(0 0 0 / 0.08);

  /* Typography: DM Sans (friendly, geometric) */
  --font-sans: "DM Sans", system-ui, sans-serif;
}
```

---

## Claude's Workflow After Answers

1. **Generate token file** (see `design-token-guide.md` for format)
2. **Apply tokens to Tailwind 4** `@theme` block in `app.css`
3. **Customize top-3 components** (see `component-customization.md`)
4. **Set anti-slop rules** in CLAUDE.md (see `anti-slop-rulebook.md`)
5. **Run `/design-verify`** to confirm token compliance
6. **Proceed to first screen** using `/design-generate`

---

## If the User Can't Decide

Default to:
- **Adjectives:** Professional, Modern, Trustworthy
- **Color:** Blue-600 (#2563eb)
- **Density:** Balanced
- **Style:** Softly rounded
- **Reference:** Stripe

This is a safe, professional default that works for 80% of B2B applications. It can be refined later, but it's better than starting with no system at all.
