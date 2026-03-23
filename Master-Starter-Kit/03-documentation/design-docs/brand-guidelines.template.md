# Brand Guidelines — {{PROJECT_NAME}}

> **The brand is the first thing users feel.** Before they read a word or click a button, they absorb the visual identity. These guidelines ensure every pixel reinforces the same personality.

---

## Brand Personality

### Adjectives (Pick 3-5)

The {{PROJECT_NAME}} brand is:

1. **{{ADJECTIVE_1}}** — {How this manifests in the UI. Example: "Professional — Clean layouts, neutral colors, no playful illustrations"}
2. **{{ADJECTIVE_2}}** — {How this manifests. Example: "Efficient — Dense data tables, minimal clicks, keyboard shortcuts"}
3. **{{ADJECTIVE_3}}** — {How this manifests. Example: "Trustworthy — Consistent patterns, clear feedback, no surprises"}
4. **{{ADJECTIVE_4}}** — {How this manifests. Optional.}
5. **{{ADJECTIVE_5}}** — {How this manifests. Optional.}

### Tone of Voice

| Context | Tone | Example |
|---------|------|---------|
| Success messages | Brief, warm | "Trip created successfully" |
| Error messages | Clear, helpful | "Unable to save changes. Please try again." |
| Empty states | Encouraging, actionable | "No trips yet. Create your first trip to get started." |
| Labels/headings | Professional, concise | "Active Drivers" not "Your Amazing Driver Team!" |
| Tooltips | Informative, neutral | "Total revenue for the selected date range" |

### What We Are NOT

- Not playful or whimsical (no emojis in UI, no cartoon illustrations)
- Not aggressive or salesy (no "Buy Now!" energy)
- Not overly minimal (we show useful data, not empty white space)
- Not corporate-dull (we have personality through color and motion, not clip art)

---

## Color System

### Primary Color

The primary color is the brand's signature. Used for: primary buttons, active navigation, focus rings, links.

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `{#HEX}` | Lightest tint — backgrounds, subtle highlights |
| 100 | `{#HEX}` | Light backgrounds, hover states |
| 200 | `{#HEX}` | Borders, dividers |
| 300 | `{#HEX}` | Secondary elements |
| 400 | `{#HEX}` | Icons, secondary text |
| 500 | `{#HEX}` | **Default** — buttons, links, active states |
| 600 | `{#HEX}` | Hover state for buttons |
| 700 | `{#HEX}` | Active/pressed state |
| 800 | `{#HEX}` | Dark variant |
| 900 | `{#HEX}` | Darkest — text on light backgrounds |
| 950 | `{#HEX}` | Near-black — headings, high-contrast text |

### Secondary Color (Optional)

| Shade | Hex | Usage |
|-------|-----|-------|
| 500 | `{#HEX}` | Accent elements, secondary actions |

### Semantic Colors

| Purpose | Color | Hex | Usage |
|---------|-------|-----|-------|
| Success | Green | `{#HEX}` | Completed status, success toasts, positive metrics |
| Warning | Amber/Yellow | `{#HEX}` | Warnings, pending actions, caution states |
| Error/Destructive | Red | `{#HEX}` | Errors, delete actions, overdue items |
| Info | Blue | `{#HEX}` | Information toasts, help text, links |

### Neutral System

| Shade | Hex | Usage |
|-------|-----|-------|
| 50 | `{#HEX}` | Page background |
| 100 | `{#HEX}` | Card background, alternating rows |
| 200 | `{#HEX}` | Borders, dividers |
| 300 | `{#HEX}` | Disabled elements |
| 400 | `{#HEX}` | Placeholder text |
| 500 | `{#HEX}` | Secondary text |
| 600 | `{#HEX}` | Icons |
| 700 | `{#HEX}` | Body text |
| 800 | `{#HEX}` | Headings |
| 900 | `{#HEX}` | High-contrast text |
| 950 | `{#HEX}` | Near-black |

**Neutral family:** {gray / slate / zinc / stone} — Choose one and use it consistently.

---

## Typography

### Font Family

| Usage | Font | Fallback | Weight |
|-------|------|----------|--------|
| Headings | {{HEADING_FONT}} | {{FALLBACK_STACK}} | 600-700 (semibold-bold) |
| Body | {{BODY_FONT}} | {{FALLBACK_STACK}} | 400-500 (normal-medium) |
| Monospace | {{MONO_FONT}} | monospace | 400 |

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| `text-xs` | 12px / 0.75rem | 16px | 400 | Badges, captions, metadata |
| `text-sm` | 14px / 0.875rem | 20px | 400-500 | Table cells, form labels, secondary text |
| `text-base` | 16px / 1rem | 24px | 400 | Body text, inputs |
| `text-lg` | 18px / 1.125rem | 28px | 500-600 | Section headers, card titles |
| `text-xl` | 20px / 1.25rem | 28px | 600 | Page section titles |
| `text-2xl` | 24px / 1.5rem | 32px | 600-700 | Page titles |
| `text-3xl` | 30px / 1.875rem | 36px | 700 | Hero/dashboard headlines |

### Typography Rules

1. **Max 2 font families** — One for headings, one for body (or same family, different weights)
2. **No font size below 12px** — Accessibility minimum
3. **Line height ≥ 1.4 for body text** — Readability
4. **Bold sparingly** — Headings and emphasis only, not entire paragraphs
5. **Left-aligned** — Never justify. Center only for hero text.

---

## Logo Usage

### Placement

| Context | Logo Type | Size |
|---------|-----------|------|
| Sidebar (collapsed) | Icon only | 32x32px |
| Sidebar (expanded) | Wordmark | 120xAuto |
| Login page | Full logo | 160xAuto |
| Favicon | Icon only | 16x16, 32x32 |
| Email header | Wordmark | 120xAuto |

### Logo Rules

1. **Minimum clear space** — Logo width / 4 on all sides
2. **Minimum size** — Never below 24px height
3. **Background** — Use on `{{BACKGROUND_COLOR}}` only. No busy backgrounds.
4. **Never stretch** — Maintain aspect ratio always
5. **Color variants** — Primary brand color, white (for dark backgrounds), black (for print)

---

## Spacing

All spacing follows a consistent scale based on 4px (0.25rem) increments:

| Token | Value | Common Usage |
|-------|-------|-------------|
| `space-1` | 4px / 0.25rem | Tight gaps (icon + text) |
| `space-2` | 8px / 0.5rem | Related elements within a group |
| `space-3` | 12px / 0.75rem | Standard padding within cards |
| `space-4` | 16px / 1rem | Standard gap between elements |
| `space-5` | 20px / 1.25rem | Between form fields |
| `space-6` | 24px / 1.5rem | Card padding, section gaps |
| `space-8` | 32px / 2rem | Between sections |
| `space-10` | 40px / 2.5rem | Between major sections |
| `space-12` | 48px / 3rem | Page padding |
| `space-16` | 64px / 4rem | Large section separators |

---

## Iconography

| Aspect | Standard |
|--------|----------|
| Icon library | {Lucide Icons / Heroicons / Phosphor} |
| Default size | 16px (in text), 20px (in buttons), 24px (standalone) |
| Stroke width | 2px (default), 1.5px for dense UIs |
| Color | Inherit from parent text color |
| Style | Outline only (no filled icons in standard UI) |

---

## Motion & Animation

| Aspect | Standard |
|--------|----------|
| Duration | 150ms (micro), 200ms (standard), 300ms (complex) |
| Easing | `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for morphs |
| When to animate | Page transitions, modal open/close, toast appear/dismiss, hover states |
| When NOT to animate | Data loading, table sorting, filter changes (instant feedback preferred) |

---

## Dos and Don'ts Summary

| DO | DON'T |
|----|-------|
| Use the primary color for CTAs | Use more than 3 colors in one view |
| Keep consistent spacing (4px grid) | Mix spacing values randomly |
| Use semantic colors for status | Use red/green for non-status purposes |
| Follow type scale exactly | Invent new font sizes |
| Use the chosen icon library | Mix icon libraries |
| Keep animations subtle and fast | Add decorative animations |
| Test all colors for WCAG AA contrast | Use low-contrast text (< 4.5:1) |
