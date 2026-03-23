# Design Tokens — TaskFlow
# ============================================================
# EXAMPLE FILE — This is a filled-in design token specification
# for a fictional TaskFlow project. Your design tokens will be
# generated during ORCHESTRATOR Step 13 (Design System).
# ============================================================

> **Architecture:** 3-layer (Brand → Semantic → Tailwind)
> **Status:** Approved
> **Primary Font:** Inter | **Brand Hue:** 220 (Navy Blue)

---

## Layer 1: Brand Tokens (CSS Custom Properties)

These are the raw brand values. They never appear directly in components.

```css
/* globals.css */
:root {
  /* Brand colors */
  --brand-hue: 220;
  --brand-saturation: 60%;
  --brand-lightness: 45%;

  --brand-primary: hsl(var(--brand-hue), var(--brand-saturation), var(--brand-lightness));
  --brand-primary-light: hsl(var(--brand-hue), var(--brand-saturation), 92%);
  --brand-primary-dark: hsl(var(--brand-hue), var(--brand-saturation), 32%);

  /* Neutral palette */
  --brand-neutral-50: hsl(220, 10%, 97%);
  --brand-neutral-100: hsl(220, 10%, 93%);
  --brand-neutral-200: hsl(220, 10%, 85%);
  --brand-neutral-300: hsl(220, 10%, 70%);
  --brand-neutral-400: hsl(220, 10%, 55%);
  --brand-neutral-500: hsl(220, 10%, 42%);
  --brand-neutral-600: hsl(220, 10%, 32%);
  --brand-neutral-700: hsl(220, 10%, 22%);
  --brand-neutral-800: hsl(220, 10%, 14%);
  --brand-neutral-900: hsl(220, 10%, 8%);

  /* Border */
  --brand-border-color: hsl(220, 10%, 85%);
  --brand-border-radius: 0.5rem;

  /* Typography */
  --brand-font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --brand-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing scale (4px base) */
  --brand-space-1: 0.25rem;   /* 4px */
  --brand-space-2: 0.5rem;    /* 8px */
  --brand-space-3: 0.75rem;   /* 12px */
  --brand-space-4: 1rem;      /* 16px */
  --brand-space-6: 1.5rem;    /* 24px */
  --brand-space-8: 2rem;      /* 32px */
  --brand-space-12: 3rem;     /* 48px */
}
```

---

## Layer 2: Semantic Tokens

These map brand tokens to meaning. Components use semantic tokens, never brand tokens directly.

```css
:root {
  /* Surfaces */
  --surface-default: white;
  --surface-muted: var(--brand-neutral-50);
  --surface-elevated: white;
  --surface-overlay: white;

  /* Text */
  --text-primary: var(--brand-neutral-900);
  --text-secondary: var(--brand-neutral-500);
  --text-muted: var(--brand-neutral-400);
  --text-inverse: white;
  --text-link: var(--brand-primary);

  /* Interactive */
  --interactive-primary: var(--brand-primary);
  --interactive-primary-hover: var(--brand-primary-dark);
  --interactive-primary-active: hsl(var(--brand-hue), var(--brand-saturation), 28%);
  --interactive-muted: var(--brand-neutral-100);
  --interactive-muted-hover: var(--brand-neutral-200);

  /* Border */
  --border-default: var(--brand-border-color);
  --border-strong: var(--brand-neutral-300);
  --border-focus: var(--brand-primary);
  --border-radius: var(--brand-border-radius);

  /* Shadows */
  --shadow-sm: 0 1px 2px hsl(220, 10%, 50%, 0.05);
  --shadow-md: 0 4px 6px hsl(220, 10%, 50%, 0.07);
  --shadow-lg: 0 10px 15px hsl(220, 10%, 50%, 0.1);
}
```

---

## Status Color System

Every entity status maps to a specific color. These are used for badges, dots, and backgrounds.

| Status | Text Color | Background | Dot | Usage |
|--------|-----------|------------|-----|-------|
| Active / In Progress | `hsl(142, 60%, 35%)` | `hsl(142, 60%, 94%)` | `hsl(142, 60%, 45%)` | Projects, tasks |
| Draft / Backlog | `hsl(220, 10%, 45%)` | `hsl(220, 10%, 94%)` | `hsl(220, 10%, 55%)` | New items |
| On Hold / Blocked | `hsl(38, 90%, 40%)` | `hsl(38, 90%, 94%)` | `hsl(38, 90%, 50%)` | Paused work |
| Completed / Done | `hsl(220, 60%, 45%)` | `hsl(220, 60%, 94%)` | `hsl(220, 60%, 55%)` | Finished items |
| Archived | `hsl(220, 10%, 55%)` | `hsl(220, 10%, 96%)` | `hsl(220, 10%, 65%)` | Old items |
| Overdue / Urgent | `hsl(0, 70%, 45%)` | `hsl(0, 70%, 94%)` | `hsl(0, 70%, 55%)` | Warnings |
| In Review | `hsl(270, 50%, 45%)` | `hsl(270, 50%, 94%)` | `hsl(270, 50%, 55%)` | Pending review |

---

## Layer 3: Tailwind Integration

```typescript
// tailwind.config.ts (extending default theme)
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--interactive-primary)',
          light: 'var(--brand-primary-light)',
          dark: 'var(--interactive-primary-hover)',
        },
        surface: {
          DEFAULT: 'var(--surface-default)',
          muted: 'var(--surface-muted)',
          elevated: 'var(--surface-elevated)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
      fontFamily: {
        sans: ['var(--brand-font-sans)'],
        mono: ['var(--brand-font-mono)'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
};
```

---

## Component Customizations (Anti-Slop)

Override these shadcn defaults to avoid the "template look":

| Component | Default Problem | TaskFlow Override |
|-----------|----------------|-------------------|
| Button | Flat, no depth | Add `shadow-sm` + `active:shadow-none` + `transition-all` |
| Card | No hover feedback | Add `hover:shadow-md` + `hover:border-brand/20` + `transition-shadow` |
| Input | Generic focus ring | Focus ring uses `--border-focus` (brand navy) |
| Badge | All same size | Status badges use semantic colors from status table above |
| Table | No row hover | Add `hover:bg-surface-muted` on rows |

---

## Protection List Integration

Components that score **8/10 or higher** in a quality audit are added to the Protect List. Protected components must not be modified without explicit approval — they represent production-proven UI that has passed design review, accessibility checks, and user testing.

**Example protected components:**

| Component | Score | Location | Reason |
|-----------|-------|----------|--------|
| `KanbanBoard` | 9/10 | `apps/web/components/tasks/kanban-board.tsx` | Drag-and-drop, optimistic updates, keyboard nav — extensively tested |
| `TimerWidget` | 8/10 | `apps/web/components/time/timer-widget.tsx` | Real-time display, optimistic mutations, offline resilience |
| `RoleBadge` | 8/10 | `apps/web/components/team/role-badge.tsx` | Uses semantic status colors, accessible contrast ratios verified |
| `ProjectStatusWorkflow` | 9/10 | `apps/web/components/projects/status-workflow.tsx` | State machine transitions validated against backend rules |

> See `PROTECT-LIST.example.md` for the full protect list with modification procedures.

**What "protected" means in practice:**
- AI agents must not edit these files without explicit user permission
- Design token changes that would visually alter protected components require review
- Bug fixes within protected components are allowed but must not change external behavior

---

## Approval Audit Trail

Every design system approval is recorded for traceability:

| Date | Approved By | Version | What Was Approved | Evidence |
|------|-------------|---------|-------------------|----------|
| 2026-03-05 | Sarah (Design Lead) | v1.0 | Brand tokens (Layer 1) — colors, typography, spacing | Screenshot: `dev_docs/design/approvals/v1.0-brand-tokens.png` |
| 2026-03-08 | Sarah + Mike (PM) | v1.1 | Semantic tokens (Layer 2) — surface, text, interactive mappings | Screenshot: `dev_docs/design/approvals/v1.1-semantic-tokens.png` |
| 2026-03-10 | Sarah | v1.2 | Status color system — all 7 statuses with badge, dot, background variants | Screenshot: `dev_docs/design/approvals/v1.2-status-colors.png` |
| 2026-03-12 | Sarah + Admin | v1.3 | Component customizations (anti-slop overrides) — Button, Card, Input, Badge, Table | Storybook review session recording |

**Rule:** No token or component override ships without an entry in this table. If there is no approval row, the change is not approved.

---

## Design System Governance

### Change Request Process

1. **Request** — Developer or designer files a design system change request describing the proposed change, the reason, and the affected components
2. **Impact Assessment** — Check which protected components would be affected. If any protected component is impacted, the change requires Design Lead sign-off
3. **Review** — Design Lead reviews the change in Storybook (visual) and in code (implementation). Accessibility audit required for color or typography changes
4. **Approval** — Design Lead approves or rejects. Approval is recorded in the Audit Trail table above
5. **Implementation** — Developer applies the change to tokens, updates Tailwind config if needed, and verifies all Storybook stories still render correctly
6. **Verification** — Run visual regression tests. Any component that renders differently must be re-reviewed

### Who Can Modify Tokens

| Token Layer | Who Can Modify | Approval Required From |
|-------------|---------------|----------------------|
| Layer 1 (Brand) | Design Lead only | Stakeholder sign-off (brand identity change) |
| Layer 2 (Semantic) | Design Lead or Senior Frontend Dev | Design Lead |
| Layer 3 (Tailwind) | Any developer | Design Lead for new mappings; self-approved for bug fixes |
| Component Overrides | Any developer | Design Lead for new overrides; self-approved for existing pattern application |

### Review Cadence

- **Weekly:** Quick Storybook walkthrough during team standup (5 min) — catch visual drift early
- **Per-phase:** Full design system audit at the end of each development phase — verify token consistency, check for anti-slop violations, update approval trail
- **Quarterly:** Brand token review with stakeholders — assess if brand values still align with product direction
