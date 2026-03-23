# Accessibility Guide

## Purpose

This guide defines how {{PROJECT_NAME}} achieves WCAG 2.1 AA compliance. Accessibility is not a final polish step -- these patterns should be applied from the first component. Every interactive element, every page, every flow must be usable by keyboard-only users and screen reader users.

---

## WCAG 2.1 AA Compliance Checklist

### Perceivable

- [ ] All images have descriptive `alt` text (or `alt=""` for decorative images)
- [ ] Color is not the sole means of conveying information (add icons, text, patterns)
- [ ] Text color contrast ratio is at least 4.5:1 (3:1 for large text 18px+ bold or 24px+)
- [ ] UI component contrast ratio is at least 3:1 against background
- [ ] Video content has captions; audio has transcripts
- [ ] Page is usable at 200% zoom without horizontal scrolling
- [ ] Text spacing can be increased without loss of content

### Operable

- [ ] All functionality is available via keyboard
- [ ] No keyboard traps (user can always Tab away from any element)
- [ ] Skip-to-content link is the first focusable element
- [ ] Focus order follows a logical reading sequence
- [ ] Focus indicator is visible (never `outline: none` without a replacement)
- [ ] No content flashes more than 3 times per second
- [ ] Page has descriptive `<title>` that updates on navigation

### Understandable

- [ ] `<html lang="{{DEFAULT_LOCALE}}">` is set
- [ ] Form inputs have visible labels (not just placeholders)
- [ ] Error messages identify the field and describe how to fix
- [ ] Navigation is consistent across pages

### Robust

- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] ARIA attributes are correct and complete
- [ ] Custom components expose correct roles, states, and properties

---

## Automated Testing: axe-core in CI

### With Playwright

```bash
pnpm add -D @axe-core/playwright --filter @{{PROJECT_NAME}}/web
```

```typescript
// apps/web/tests/a11y/accessibility.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "Home", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Settings", path: "/settings" },
];

for (const { name, path } of pages) {
  test(`${name} page has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .exclude(".third-party-widget") // Exclude elements you cannot control
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
```

### With Jest + jsdom

```bash
pnpm add -D jest-axe --filter @{{PROJECT_NAME}}/web
```

```typescript
// apps/web/src/components/__tests__/button.a11y.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "../button";

expect.extend(toHaveNoViolations);

test("Button component has no accessibility violations", async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Keyboard Navigation Patterns

### Skip Link

```tsx
// apps/web/src/components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

// In layout:
// <SkipLink />
// <nav>...</nav>
// <main id="main-content" tabIndex={-1}>...</main>
```

### Focus Trap (for modals/dialogs)

```bash
pnpm add focus-trap-react --filter @{{PROJECT_NAME}}/web
```

```tsx
import FocusTrap from "focus-trap-react";

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <FocusTrap focusTrapOptions={{ onDeactivate: onClose, clickOutsideDeactivates: true }}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Dialog Title</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </FocusTrap>
  );
}
```

### Roving Tabindex (for toolbars, tab lists, menus)

```tsx
// Only one item in the group is tabbable at a time.
// Arrow keys move focus within the group.
export function TabList({ tabs, activeTab, onSelect }: TabListProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    if (e.key === "ArrowRight") newIndex = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft") newIndex = (index - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") newIndex = 0;
    if (e.key === "End") newIndex = tabs.length - 1;

    if (newIndex !== index) {
      e.preventDefault();
      onSelect(tabs[newIndex].id);
      document.getElementById(`tab-${tabs[newIndex].id}`)?.focus();
    }
  };

  return (
    <div role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

## ARIA Reference for Common Components

| Component | Role | Key ARIA Attributes |
|-----------|------|-------------------|
| Modal | `dialog` | `aria-modal="true"`, `aria-labelledby` |
| Dropdown Menu | `menu` | `aria-expanded`, `aria-haspopup="true"` |
| Menu Item | `menuitem` | `aria-disabled` if inactive |
| Tab List | `tablist` | -- |
| Tab | `tab` | `aria-selected`, `aria-controls` |
| Tab Panel | `tabpanel` | `aria-labelledby` |
| Accordion Header | `button` | `aria-expanded`, `aria-controls` |
| Accordion Panel | `region` | `aria-labelledby` |
| Toast/Alert | `alert` or `status` | `aria-live="polite"` or `"assertive"` |
| Combobox | `combobox` | `aria-expanded`, `aria-activedescendant`, `aria-autocomplete` |
| Progress Bar | `progressbar` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| Toggle | `switch` | `aria-checked` |

### Toast/Notification Pattern

```tsx
// Use aria-live region so screen readers announce dynamic content
export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div aria-live="polite" aria-atomic="false" className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} role={toast.type === "error" ? "alert" : "status"}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```

---

## Color Contrast Automation

### CI Check with axe-core

The Playwright axe tests above catch contrast issues automatically. For design-time checking:

```bash
# Install contrast checking CLI
npx color-contrast-checker "#1a1a1a" "#ffffff"
# Output: Ratio: 17.15:1 -- PASS (AAA)
```

### Tailwind CSS Contrast-Safe Palette

When defining your Tailwind theme, verify contrast ratios for all text/background combinations:

```typescript
// tailwind.config.ts
// Rule: body text uses shades 700+ on white backgrounds
// Rule: large headings can use shade 600+
// Rule: never use shades below 500 for text on white
```

---

## Screen Reader Testing Guide

### VoiceOver (macOS) Basics

1. Turn on: `Cmd + F5`
2. Navigate by heading: `VO + Cmd + H`
3. Navigate by landmark: `VO + Cmd + L`
4. Read next element: `VO + Right Arrow`
5. Interact with group: `VO + Shift + Down Arrow`
6. Stop reading: `Ctrl`

### NVDA (Windows) Basics

1. Start NVDA: `Ctrl + Alt + N`
2. Navigate by heading: `H`
3. Navigate by landmark: `D`
4. Read next line: `Down Arrow`
5. Enter forms mode: `Enter` on a form field
6. Exit forms mode: `Escape`

### What to Test

- [ ] Page title is announced on navigation
- [ ] Headings form a logical outline (h1 > h2 > h3, no skipped levels)
- [ ] Form labels are read with their inputs
- [ ] Error messages are announced when they appear
- [ ] Modal focus moves into dialog and announces title
- [ ] Dynamic content changes are announced (toasts, live regions)

---

## Focus Management Patterns

### After Route Changes (SPA)

```tsx
// apps/web/src/hooks/use-route-focus.ts
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useRouteFocus() {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Move focus to main content after route change
    mainRef.current?.focus();
  }, [pathname]);

  return mainRef;
}

// Usage in layout:
// const mainRef = useRouteFocus();
// <main ref={mainRef} tabIndex={-1} id="main-content">
```

### After Modal Close

```tsx
// Store the element that opened the modal, restore focus when closing
const triggerRef = useRef<HTMLElement | null>(null);

function openModal(event: React.MouseEvent<HTMLButtonElement>) {
  triggerRef.current = event.currentTarget;
  setIsOpen(true);
}

function closeModal() {
  setIsOpen(false);
  // Return focus to the trigger button
  triggerRef.current?.focus();
}
```

---

## Reduced Motion

Respect users who have enabled "reduce motion" in their OS settings.

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// In JS, check the preference before triggering animations
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
}
```

---

## Common Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | Fix |
|-------------|-------------|-----|
| `<div onClick={...}>` as a button | Not focusable, no keyboard support | Use `<button>` |
| Placeholder as label | Disappears on input, low contrast | Use visible `<label>` |
| `outline: none` without replacement | Invisible focus indicator | Replace with custom visible focus style |
| Color-only error indicators | Invisible to colorblind users | Add icon + text alongside color |
| Auto-playing video/audio | Disruptive, violates WCAG | Require user action to play |
| Removing content at certain zoom levels | Content hidden at 200% zoom | Use responsive design, test at 200% |
| `tabindex="5"` (positive tabindex) | Breaks natural tab order | Use `tabindex="0"` or `-1` only |
| ARIA attributes on elements that already have semantics | Confusing to screen readers | Use native HTML elements first |

---

## Checklist

- [ ] axe-core tests run in CI for all key pages
- [ ] Skip-to-content link is first focusable element
- [ ] All modals trap focus and return focus on close
- [ ] Tab lists, menus, and toolbars use roving tabindex
- [ ] ARIA attributes follow WAI-ARIA patterns for every custom component
- [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text
- [ ] Screen reader testing done on at least one screen reader
- [ ] Focus is managed after route changes and modal close
- [ ] `prefers-reduced-motion` is respected for all animations
- [ ] No positive tabindex values in the codebase
- [ ] All form inputs have visible, associated labels
