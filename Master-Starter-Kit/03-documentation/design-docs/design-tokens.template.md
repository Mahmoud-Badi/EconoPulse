# Design Tokens — {{PROJECT_NAME}}

> **Design tokens are the single source of truth for visual properties.** Never hardcode colors, sizes, or shadows. Always reference tokens. Defined in both CSS custom properties AND Tailwind 4 @theme format.

---

## Token Architecture

```
Brand Guidelines (brand-guidelines.md)
    ↓ defines values
Design Tokens (this file)
    ↓ exported as
CSS Custom Properties (globals.css)  +  Tailwind @theme (tailwind config)
    ↓ consumed by
Components (shadcn/ui + custom)
```

---

## Format 1: CSS Custom Properties

```css
/* apps/web/app/globals.css */

@layer base {
  :root {
    /* ============================================
     * COLORS — Primary
     * ============================================ */
    --color-primary-50: {HSL_OR_HEX};    /* Lightest tint */
    --color-primary-100: {HSL_OR_HEX};
    --color-primary-200: {HSL_OR_HEX};
    --color-primary-300: {HSL_OR_HEX};
    --color-primary-400: {HSL_OR_HEX};
    --color-primary-500: {HSL_OR_HEX};   /* Default */
    --color-primary-600: {HSL_OR_HEX};   /* Hover */
    --color-primary-700: {HSL_OR_HEX};   /* Active/pressed */
    --color-primary-800: {HSL_OR_HEX};
    --color-primary-900: {HSL_OR_HEX};
    --color-primary-950: {HSL_OR_HEX};   /* Darkest */

    /* ============================================
     * COLORS — Semantic
     * ============================================ */
    --color-success: {HEX};              /* Green — completed, positive */
    --color-success-light: {HEX};        /* Green tint — backgrounds */
    --color-warning: {HEX};              /* Amber — caution, pending */
    --color-warning-light: {HEX};        /* Amber tint — backgrounds */
    --color-error: {HEX};                /* Red — errors, destructive */
    --color-error-light: {HEX};          /* Red tint — backgrounds */
    --color-info: {HEX};                 /* Blue — informational */
    --color-info-light: {HEX};           /* Blue tint — backgrounds */

    /* ============================================
     * COLORS — Neutral
     * ============================================ */
    --color-bg: {HEX};                   /* Page background */
    --color-bg-card: {HEX};              /* Card/surface background */
    --color-bg-muted: {HEX};             /* Subtle background (alternating rows) */
    --color-bg-accent: {HEX};            /* Highlighted/selected background */
    --color-text: {HEX};                 /* Primary text */
    --color-text-secondary: {HEX};       /* Secondary/muted text */
    --color-text-tertiary: {HEX};        /* Placeholder, hint text */
    --color-border: {HEX};               /* Standard borders */
    --color-border-light: {HEX};         /* Subtle borders (cards, dividers) */
    --color-ring: {HEX};                 /* Focus ring color */

    /* ============================================
     * COLORS — Sidebar (if different from main)
     * ============================================ */
    --color-sidebar-bg: {HEX};
    --color-sidebar-text: {HEX};
    --color-sidebar-text-active: {HEX};
    --color-sidebar-hover: {HEX};
    --color-sidebar-active: {HEX};
    --color-sidebar-border: {HEX};

    /* ============================================
     * SPACING
     * ============================================ */
    --space-0: 0;
    --space-0-5: 0.125rem;  /* 2px */
    --space-1: 0.25rem;     /* 4px */
    --space-1-5: 0.375rem;  /* 6px */
    --space-2: 0.5rem;      /* 8px */
    --space-2-5: 0.625rem;  /* 10px */
    --space-3: 0.75rem;     /* 12px */
    --space-3-5: 0.875rem;  /* 14px */
    --space-4: 1rem;        /* 16px */
    --space-5: 1.25rem;     /* 20px */
    --space-6: 1.5rem;      /* 24px */
    --space-8: 2rem;        /* 32px */
    --space-10: 2.5rem;     /* 40px */
    --space-12: 3rem;       /* 48px */
    --space-16: 4rem;       /* 64px */

    /* ============================================
     * SHADOWS
     * ============================================ */
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-card: {SHADOW_VALUE};         /* Default card shadow */
    --shadow-card-hover: {SHADOW_VALUE};   /* Card on hover */
    --shadow-dropdown: {SHADOW_VALUE};     /* Dropdowns, popovers */
    --shadow-modal: {SHADOW_VALUE};        /* Modals, dialogs */
    --shadow-focus: 0 0 0 3px {FOCUS_RING_COLOR};  /* Focus ring */

    /* ============================================
     * BORDER RADIUS
     * ============================================ */
    --radius-sm: 4px;    /* Small elements (badges, chips) */
    --radius-md: 6px;    /* Default (buttons, inputs) */
    --radius-lg: 8px;    /* Cards, panels */
    --radius-xl: 12px;   /* Large cards, modals */
    --radius-2xl: 16px;  /* Hero sections, large containers */
    --radius-full: 9999px; /* Pills, avatars */

    /* ============================================
     * TYPOGRAPHY
     * ============================================ */
    --font-sans: "{FONT_FAMILY}", {FALLBACK_STACK};
    --font-mono: "{MONO_FONT}", monospace;

    --font-size-xs: 0.75rem;     /* 12px */
    --font-size-sm: 0.875rem;    /* 14px */
    --font-size-base: 1rem;      /* 16px */
    --font-size-lg: 1.125rem;    /* 18px */
    --font-size-xl: 1.25rem;     /* 20px */
    --font-size-2xl: 1.5rem;     /* 24px */
    --font-size-3xl: 1.875rem;   /* 30px */

    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;

    /* ============================================
     * Z-INDEX SCALE
     * ============================================ */
    --z-dropdown: 50;
    --z-sticky: 100;
    --z-modal-backdrop: 200;
    --z-modal: 300;
    --z-popover: 400;
    --z-toast: 500;
    --z-tooltip: 600;

    /* ============================================
     * TRANSITIONS
     * ============================================ */
    --transition-fast: 150ms ease-out;
    --transition-normal: 200ms ease-out;
    --transition-slow: 300ms ease-in-out;

    /* ============================================
     * LAYOUT
     * ============================================ */
    --sidebar-width: 256px;
    --sidebar-width-collapsed: 64px;
    --header-height: 64px;
    --content-max-width: 1280px;
  }

  /* ============================================
   * DARK MODE (optional)
   * ============================================ */
  .dark {
    --color-bg: {DARK_BG};
    --color-bg-card: {DARK_CARD};
    --color-bg-muted: {DARK_MUTED};
    --color-text: {DARK_TEXT};
    --color-text-secondary: {DARK_TEXT_SECONDARY};
    --color-border: {DARK_BORDER};
    /* ... override all color tokens for dark mode */
  }
}
```

---

## Format 2: Tailwind 4 @theme

```css
/* apps/web/app/globals.css — Tailwind 4 format */

@theme {
  /* Colors */
  --color-primary-50: {VALUE};
  --color-primary-100: {VALUE};
  --color-primary-200: {VALUE};
  --color-primary-300: {VALUE};
  --color-primary-400: {VALUE};
  --color-primary-500: {VALUE};
  --color-primary-600: {VALUE};
  --color-primary-700: {VALUE};
  --color-primary-800: {VALUE};
  --color-primary-900: {VALUE};
  --color-primary-950: {VALUE};

  /* Semantic colors as Tailwind utilities */
  --color-success: {VALUE};
  --color-warning: {VALUE};
  --color-error: {VALUE};
  --color-info: {VALUE};

  /* Surfaces */
  --color-surface: {VALUE};
  --color-surface-card: {VALUE};
  --color-surface-muted: {VALUE};

  /* Custom shadows */
  --shadow-card: {VALUE};
  --shadow-card-hover: {VALUE};
  --shadow-dropdown: {VALUE};

  /* Custom radius */
  --radius-card: {VALUE};
  --radius-button: {VALUE};
  --radius-input: {VALUE};

  /* Font families */
  --font-sans: "{FONT}", {FALLBACK};
  --font-mono: "{MONO_FONT}", monospace;

  /* Breakpoints (if custom) */
  --breakpoint-xs: 475px;
}
```

### Usage in Components

```tsx
{/* Using Tailwind 4 token-based classes */}
<div className="bg-primary-500 text-white rounded-card shadow-card">
  <h2 className="text-2xl font-semibold text-primary-950">Title</h2>
  <p className="text-sm text-neutral-500">Subtitle</p>
</div>

{/* Hover/focus states */}
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50
                    shadow-card hover:shadow-card-hover transition-normal">
  Click me
</button>
```

---

## Token Usage Rules

### Mandatory Token Usage

| Property | Token Required | Never Use |
|----------|---------------|-----------|
| Background color | `--color-*` or `bg-*` | Hardcoded hex/rgb |
| Text color | `--color-text-*` or `text-*` | Hardcoded hex/rgb |
| Border color | `--color-border*` | Hardcoded hex/rgb |
| Box shadow | `--shadow-*` or `shadow-*` | Inline `box-shadow` with values |
| Border radius | `--radius-*` or `rounded-*` | Hardcoded px values |
| Spacing | `--space-*` or Tailwind spacing | Arbitrary spacing values |
| Font size | `--font-size-*` or `text-*` | Hardcoded px/rem |

### When Custom Values Are Acceptable

- One-off layout measurements (specific component widths)
- SVG path coordinates
- Animation keyframe values
- Grid template columns/rows for specific layouts

---

## Token Audit Checklist

Run this checklist after any design changes:

- [ ] All colors reference tokens (no hardcoded hex in components)
- [ ] All shadows reference tokens
- [ ] All border radii reference tokens
- [ ] Font sizes from the type scale only
- [ ] Spacing from the spacing scale only
- [ ] Focus states use `--shadow-focus` or equivalent
- [ ] Dark mode tokens override all light mode colors (if applicable)
- [ ] WCAG AA contrast ratios met (4.5:1 for text, 3:1 for large text/icons)
