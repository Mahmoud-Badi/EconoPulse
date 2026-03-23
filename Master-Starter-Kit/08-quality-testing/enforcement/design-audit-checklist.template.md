# Design Audit Checklist

> **Screen:** `{{SCREEN_NAME}}`
> **Feature:** `{{FEATURE_NAME}}`
> **Auditor:** `{{AUDITOR_NAME}}`
> **Date:** `{{AUDIT_DATE}}`
> **Verdict:** {{PASS_OR_FAIL}}

---

## Instructions

This checklist MUST be completed for every screen before it passes the Design Consistency gate (Gate 2). Every row requires evidence — a screenshot file path, a code reference (file:line), or a test result. "Checked visually" is not evidence.

Store completed checklists in: `dev_docs/enforcement-proofs/design-audit/{{SCREEN_NAME}}-audit.md`

---

## Section 1: Layout Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| L1 — No orphan screens | Screen reachable from main navigation or parent screen | | |
| L2 — Consistent page structure | Header, content area, footer follow global layout pattern | | |
| L3 — Logical content hierarchy | Primary action prominent, secondary actions subordinate | | |
| L4 — No layout shifts on load | Content does not jump/reflow after initial render | | |

## Section 2: Color Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| C1 — Brand colors only | All colors from `{{DESIGN_TOKEN_PREFIX}}` palette, no rogue hex values | | |
| C2 — Sufficient contrast | Text/background meets WCAG AA (4.5:1 normal, 3:1 large) | | |
| C3 — Consistent status colors | Success=green, Warning=amber, Error=red, Info=blue across all screens | | |
| C4 — No color-only meaning | Color is never the sole indicator of state (icons/text supplement) | | |
| C5 — Dark mode compatibility | If dark mode supported: all colors adapt, no white flashes, contrast maintained | | |

## Section 3: Component Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| K1 — Library components only | All UI elements from `{{COMPONENT_LIBRARY_NAME}}`, no custom one-offs without exception | | |
| K2 — Consistent component usage | Same component used for same purpose across screens (e.g., one card style, not three) | | |
| K3 — Component props correct | Components use documented props, no deprecated props, no prop hacks | | |
| K4 — No component misuse | Components used for intended purpose (e.g., no button styled as link, no table for layout) | | |

## Section 4: Typography Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| T1 — Type scale followed | All text sizes from defined type scale, no arbitrary font sizes | | |
| T2 — Font family consistent | Only approved font families used (body, heading, mono) | | |
| T3 — Line length readable | Body text line length between 45-75 characters on desktop | | |

## Section 5: Mobile Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| M1 — Touch targets sized | All interactive elements ≥44x44px on mobile viewports | | |
| M2 — No tiny text | Minimum font size 14px on mobile (no 10px labels) | | |
| M3 — Thumb-zone aware | Primary actions in bottom half of screen on mobile | | |

## Section 6: Spacing Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| S1 — Spacing scale used | All margins/padding use token scale (4/8/12/16/24/32/48/64px) | | |
| S2 — Consistent section gaps | Same spacing between similar sections across screens | | |

## Section 7: Animation Rules

| Rule | Check | Pass/Fail | Evidence |
|------|-------|-----------|----------|
| A1 — Purposeful animation | Every animation serves a purpose (feedback, orientation, hierarchy) — no decorative-only | | |
| A2 — Respects reduced motion | `prefers-reduced-motion` media query honored, animations disable gracefully | | |

## Section 8: Design Token Compliance

| Check | Pass/Fail | Evidence |
|-------|-----------|----------|
| No hardcoded hex color values in component files | | |
| No hardcoded `px` spacing values (margins, padding, gaps) | | |
| All components imported from `{{COMPONENT_LIBRARY_NAME}}` | | |
| No inline styles overriding design tokens | | |
| Theme variables used for all configurable values | | |

**Token audit command:**
```bash
# Run in the feature directory to detect violations
grep -rn '#[0-9a-fA-F]\{3,8\}' --include='*.tsx' --include='*.css' --include='*.scss'
grep -rn 'margin:\|padding:\|gap:' --include='*.tsx' | grep -v 'var(--'
```

## Section 9: Visual Regression

| Breakpoint | Screenshot Attached | Matches Approved Design | Differences Noted |
|------------|--------------------|-----------------------|-------------------|
| 375px (Mobile) | `{{SCREENSHOT_PATH_375}}` | | |
| 768px (Tablet) | `{{SCREENSHOT_PATH_768}}` | | |
| 1024px (Laptop) | `{{SCREENSHOT_PATH_1024}}` | | |
| 1440px (Desktop) | `{{SCREENSHOT_PATH_1440}}` | | |

---

## Summary

| Section | Rules Checked | Passed | Failed |
|---------|---------------|--------|--------|
| Layout | 4 | | |
| Color | 5 | | |
| Component | 4 | | |
| Typography | 3 | | |
| Mobile | 3 | | |
| Spacing | 2 | | |
| Animation | 2 | | |
| Token Compliance | 5 | | |
| Visual Regression | 4 | | |
| **Total** | **32** | | |

**Gate 2 Pass Requirement:** ALL 32 checks must pass. ANY failure blocks feature completion.

**Failure escalation:** If >10 failures are found on a single screen, escalate to a design review session before fixing individual items — the pattern is broken, not just individual rules.
