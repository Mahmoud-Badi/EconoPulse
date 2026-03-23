# Design Reference Capture Protocol

> **Purpose:** Establish visual direction BEFORE writing any UI code. The #1 reason AI-generated UI looks generic is that the AI starts coding without a clear visual target.
> **When to use:** Step 12.9 (Design Review) or at the start of Step 13 (Design System). Before any component generation.

---

## Why References First

The difference between "AI-generated looking" and "professionally designed" is almost always:
- **With references:** The AI matches an established visual language and level of polish
- **Without references:** The AI defaults to Tailwind defaults, gray borders, and symmetric grids

A 10-minute reference capture saves hours of design iteration.

---

## Reference Capture Process

### Step 1: Gather Visual References (User + AI)

Ask the user via AskUserQuestion:

**"Show me 2-3 websites or apps that look like what you want yours to feel like."**

Options:
- **I have specific URLs** — User provides links to reference sites
- **Show me options** — AI proposes 5 reference sites based on the project's vertical
- **I have screenshots** — User provides screenshots or Dribbble/Behance links
- **Match a competitor** — Use a specific competitor's design as the baseline
- **I trust your judgment** — AI selects based on industry best practices

### Step 2: Extract Design Patterns

For each reference, document:

| Aspect | What to Extract | Example |
|---|---|---|
| **Color** | Primary accent, neutral palette, background tone | "Dark zinc-900 bg, emerald-400 accent, slate-300 secondary text" |
| **Typography** | Font family, heading weight, body size, letter spacing | "Inter, bold headings, 16px body, tight letter spacing on headings" |
| **Layout** | Content width, grid system, sidebar yes/no, spacing rhythm | "Max-w-6xl centered, 3-column grid on dashboard, 64px section gaps" |
| **Cards/Surfaces** | Border style, shadow depth, radius, background contrast | "No borders, subtle shadow-sm, rounded-xl, bg-zinc-800/50 glass effect" |
| **CTAs** | Button style, primary/secondary differentiation, hover behavior | "Solid primary with gradient, outline secondary, scale-105 on hover" |
| **Navigation** | Top bar vs sidebar, mobile pattern, active state style | "Sticky top bar, collapsible sidebar on mobile, bottom-2 active indicator" |
| **Density** | Compact vs spacious, information density per screen | "Medium density, lots of whitespace, one primary action per card" |

### Step 3: Generate Design Direction Document

Output to `dev_docs/foundations/design-direction.md`:

```markdown
# Design Direction — {{PROJECT_NAME}}

## Visual References
1. [Reference 1 URL] — What we're taking from it: [specific patterns]
2. [Reference 2 URL] — What we're taking from it: [specific patterns]
3. [Reference 3 URL] — What we're taking from it: [specific patterns]

## Design Tokens (derived from references)
- Primary accent: [color]
- Neutral scale: [palette]
- Background: [light/dark, specific value]
- Border radius: [scale]
- Shadow: [approach]
- Typography: [font family, scale]
- Spacing: [rhythm]

## Component Style Guide
- Cards: [description]
- Buttons: [description]
- Forms: [description]
- Navigation: [description]
- Tables: [description]

## What We're NOT Doing
- [Anti-pattern from references that doesn't fit our product]
- [Design trend that would age poorly]
```

### Step 4: Validation

Before proceeding to component generation:

1. Present the design direction document to the user
2. Ask via AskUserQuestion: "Does this design direction match your vision?"
3. Options: [Yes, proceed, Adjust colors, Adjust layout density, Add more references, Start over]

---

## Reference Sources by Vertical

When the user says "show me options," propose references appropriate to the project type:

| Project Type | Good References | Why |
|---|---|---|
| SaaS Dashboard | Linear, Vercel Dashboard, Notion | Clean data density, good dark mode, clear hierarchy |
| E-commerce | Shopify Polaris, Gumroad, Stripe Dashboard | Trust signals, conversion-optimized, payment flows |
| Consumer App | Spotify, Duolingo, Arc Browser | Delight, personality, engagement patterns |
| Developer Tools | Supabase, Railway, Planetscale | Developer-friendly, documentation-forward, terminal aesthetic |
| Content Platform | Medium, Substack, Ghost | Reading experience, content-first, clean typography |
| Healthcare | Oscar Health, One Medical, Headspace | Calming, accessible, trust-building, WCAG compliant |
| Fintech | Mercury, Brex, Wise | Precision, data clarity, security signals |
| Agency/Client | Webflow, Squarespace showcase | Portfolio polish, visual storytelling |

---

## Integration with Design System (Step 13)

The design direction document becomes the primary input for:
1. **Token decisions** — Colors, spacing, typography from references
2. **Component styling** — Card/button/form patterns from references
3. **Storybook** — Each component story should visually match the design direction
4. **Design Quality Checklist** — Review against the established direction, not generic rules
