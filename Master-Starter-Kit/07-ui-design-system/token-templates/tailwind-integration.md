# Layer 3: Tailwind Integration Guide

How to connect the 3-layer token architecture (Brand -> Semantic -> Tailwind) so that
every Tailwind utility class automatically references the design system tokens.

---

## Architecture Overview

```
Layer 1: brand-tokens.css     (primitives: hue, saturation, grays, font)
       |
       v
Layer 2: semantic-tokens.css  (meanings: --primary, --background, --border)
       |
       v
Layer 3: tailwind.config      (utilities: bg-primary, text-muted-foreground)
```

Components ONLY use Tailwind classes. Tailwind classes reference semantic tokens.
Semantic tokens reference brand tokens. Change `--brand-hue` and everything updates.

---

## Tailwind v4 Configuration (CSS-based)

Tailwind v4 uses CSS-based configuration. Add theme extensions directly in your
global CSS file using `@theme`:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Map semantic tokens to Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Border radius */
  --radius-sm: var(--brand-radius-sm);
  --radius-md: var(--brand-radius-md);
  --radius-lg: var(--brand-radius-lg);

  /* Font families */
  --font-sans: var(--brand-font-family);
  --font-mono: var(--brand-font-mono);
}
```

### Tailwind v3 Configuration (JS-based, legacy)

If your project still uses Tailwind v3 with `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: 'var(--brand-radius-sm)',
        md: 'var(--brand-radius-md)',
        lg: 'var(--brand-radius-lg)',
      },
      fontFamily: {
        sans: ['var(--brand-font-family)'],
        mono: ['var(--brand-font-mono)'],
      },
    },
  },
};

export default config;
```

---

## Utility Class Reference

Once configured, these Tailwind classes are available:

### Backgrounds
| Class                  | Resolves to              | Use case            |
|------------------------|--------------------------|---------------------|
| `bg-background`        | `var(--background)`      | Page background     |
| `bg-card`              | `var(--card)`            | Card surfaces       |
| `bg-primary`           | `var(--primary)`         | Primary buttons     |
| `bg-secondary`         | `var(--secondary)`       | Secondary buttons   |
| `bg-muted`             | `var(--muted)`           | Disabled/subtle bg  |
| `bg-accent`            | `var(--accent)`          | Hover highlights    |
| `bg-destructive`       | `var(--destructive)`     | Delete/danger       |

### Text
| Class                       | Resolves to                   | Use case              |
|-----------------------------|-------------------------------|-----------------------|
| `text-foreground`           | `var(--foreground)`           | Body text             |
| `text-primary`              | `var(--primary)`              | Links, emphasis       |
| `text-primary-foreground`   | `var(--primary-foreground)`   | Text on primary bg    |
| `text-muted-foreground`     | `var(--muted-foreground)`     | Secondary text        |
| `text-accent-foreground`    | `var(--accent-foreground)`    | Text on accent bg     |
| `text-destructive`          | `var(--destructive)`          | Error messages        |

### Borders
| Class              | Resolves to        | Use case              |
|--------------------|--------------------|-----------------------|
| `border-border`    | `var(--border)`    | Default borders       |
| `border-input`     | `var(--input)`     | Form input borders    |
| `ring-ring`        | `var(--ring)`      | Focus rings           |

### Border Radius
| Class          | Resolves to              |
|----------------|--------------------------|
| `rounded-sm`   | `var(--brand-radius-sm)` |
| `rounded-md`   | `var(--brand-radius-md)` |
| `rounded-lg`   | `var(--brand-radius-lg)` |

---

## DO / DON'T Examples

### DO: Use semantic Tailwind classes

```tsx
// CORRECT - references semantic tokens via Tailwind
<button className="bg-primary text-primary-foreground rounded-md px-4 py-2">
  Save
</button>

<div className="bg-card border border-border rounded-lg p-4">
  <p className="text-foreground">Title</p>
  <p className="text-muted-foreground text-sm">Description</p>
</div>
```

### DON'T: Use raw colors or hex values

```tsx
// WRONG - hardcoded colors bypass the token system
<button className="bg-blue-600 text-white rounded-md px-4 py-2">
  Save
</button>

// WRONG - inline styles bypass Tailwind entirely
<div style={{ backgroundColor: '#1e40af', color: 'white' }}>
  Content
</div>
```

### DON'T: Reference Layer 1 tokens directly in components

```tsx
// WRONG - components should never use brand tokens directly
<div style={{ color: 'var(--brand-primary)' }}>Text</div>

// CORRECT - use the semantic layer
<div className="text-primary">Text</div>
```

### DO: Use status tokens for status indicators

```tsx
// CORRECT - status colors via CSS custom properties
<span
  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
  style={{
    backgroundColor: 'var(--status-success-bg)',
    color: 'var(--status-success-text)',
    borderColor: 'var(--status-success-border)',
  }}
>
  <span
    className="w-1.5 h-1.5 rounded-full"
    style={{ backgroundColor: 'var(--status-success-dot)' }}
  />
  Active
</span>
```

### DO: Support dark mode automatically

```tsx
// The token system handles dark mode automatically.
// NO need for dark: prefixes on color classes:

// CORRECT - works in both light and dark
<div className="bg-background text-foreground">Content</div>

// UNNECESSARY - the tokens already switch for dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">Content</div>
```

---

## Rebranding Checklist

To rebrand the entire application:

1. Open `brand-tokens.css`
2. Change `--brand-hue` (e.g., `220` for navy, `150` for teal, `0` for red)
3. Change `--brand-saturation` (e.g., `60%` for vivid, `30%` for muted)
4. Change `--brand-font-family` if needed
5. Done. Every component updates automatically.

No changes needed in:
- `semantic-tokens.css` (references brand tokens via var())
- `tailwind.config.ts` (references semantic tokens via var())
- Any component file (uses Tailwind classes)
