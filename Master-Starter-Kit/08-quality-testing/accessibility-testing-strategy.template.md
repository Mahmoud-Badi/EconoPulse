# Accessibility Testing Strategy — {{PROJECT_NAME}}

> How to verify WCAG 2.1 AA compliance through automated scanning, manual testing, and assistive technology verification.

---

## Testing Pyramid for Accessibility

```
                    ┌─────────────────┐
                    │  User Testing   │  ← Real users with disabilities
                    │  (annual/major) │     Most valuable, least frequent
                    ├─────────────────┤
                    │  Manual Testing │  ← Developer + screen reader
                    │  (per feature)  │     Catches ~40% of issues
                    ├─────────────────┤
                    │  Automated Scan │  ← axe-core in CI pipeline
                    │  (every build)  │     Catches ~30% of issues
                    └─────────────────┘
```

**Important:** Automated tools catch only ~30% of accessibility issues. Manual testing is essential.

---

## Layer 1: Automated Testing (CI Pipeline)

### axe-core with Playwright

Add accessibility scanning to your E2E tests:

```typescript
// e2e/helpers/a11y.ts
import AxeBuilder from '@axe-core/playwright';

export async function checkAccessibility(page: Page, context?: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])  // WCAG 2.1 AA
    .analyze();

  const violations = results.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  if (violations.length > 0) {
    const report = violations.map(v =>
      `[${v.impact}] ${v.id}: ${v.description}\n` +
      v.nodes.map(n => `  → ${n.html}\n    Fix: ${n.failureSummary}`).join('\n')
    ).join('\n\n');

    throw new Error(
      `Accessibility violations${context ? ` on ${context}` : ''}:\n\n${report}`
    );
  }
}

// Usage in E2E tests
test('dashboard is accessible', async ({ page }) => {
  await page.goto('/dashboard');
  await checkAccessibility(page, 'Dashboard');
});

test('create form is accessible', async ({ page }) => {
  await page.goto('/projects/new');
  await checkAccessibility(page, 'Create Project Form');
});
```

### Playwright Config for Accessibility

```typescript
// playwright.config.ts — add accessibility test project
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    {
      name: 'accessibility',
      use: {
        ...devices['Desktop Chrome'],
        // Reduced motion to test animation handling
        reducedMotion: 'reduce',
      },
    },
  ],
});
```

### ESLint Plugin

Catch issues at development time:

```bash
pnpm add -D eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

---

## Layer 2: Manual Testing Protocol

### Keyboard Navigation Test

Run this test for every new screen or feature:

| Step | Action | Expected Result | Pass? |
|------|--------|-----------------|-------|
| 1 | Press `Tab` from top of page | Focus moves through all interactive elements in logical order | [ ] |
| 2 | Press `Shift+Tab` | Focus moves backwards through elements | [ ] |
| 3 | Press `Enter` on buttons | Button action triggers | [ ] |
| 4 | Press `Space` on checkboxes/toggles | Checkbox/toggle toggles state | [ ] |
| 5 | Press `Escape` on open modals | Modal closes, focus returns to trigger | [ ] |
| 6 | Press `Arrow keys` in dropdowns/menus | Selection moves up/down through options | [ ] |
| 7 | Try to use entire feature without mouse | All functionality accessible via keyboard | [ ] |
| 8 | Check focus is always visible | Focus ring visible on every focused element | [ ] |

### Screen Reader Test

Test with at least one screen reader:

| Platform | Recommended Screen Reader | Browser |
|----------|--------------------------|---------|
| macOS | VoiceOver (built-in) | Safari |
| Windows | NVDA (free) | Chrome or Firefox |
| iOS | VoiceOver (built-in) | Safari |
| Android | TalkBack (built-in) | Chrome |

#### VoiceOver Quick Reference (macOS)

| Action | Shortcut |
|--------|----------|
| Turn on/off | `Cmd + F5` |
| Read next item | `Ctrl + Option + Right Arrow` |
| Read previous item | `Ctrl + Option + Left Arrow` |
| Activate element | `Ctrl + Option + Space` |
| Open rotor (navigate by headings, links, etc.) | `Ctrl + Option + U` |
| Read entire page | `Ctrl + Option + A` |

#### Screen Reader Checklist

| Check | Expected | Pass? |
|-------|----------|-------|
| Page title is announced on load | Screen reader says page name | [ ] |
| Headings form a logical outline | Navigate by headings (rotor) — hierarchy makes sense | [ ] |
| Images are described | Descriptive alt text is read; decorative images are skipped | [ ] |
| Forms are labeled | Each input announces its label and purpose | [ ] |
| Errors are announced | Error messages are read when they appear | [ ] |
| Buttons describe their action | "Submit", "Delete project", not just "Click here" | [ ] |
| Status changes are announced | Toast messages, loading states read via aria-live | [ ] |
| Tables are navigable | Headers are associated with data cells | [ ] |
| Dynamic content updates are announced | New content from AJAX/SPA navigation is read | [ ] |

### Color and Visual Test

| Check | Tool | Pass? |
|-------|------|-------|
| Text contrast ratio ≥ 4.5:1 | Chrome DevTools > Accessibility | [ ] |
| Large text contrast ≥ 3:1 | Chrome DevTools > Accessibility | [ ] |
| UI component contrast ≥ 3:1 | Manual check with contrast checker | [ ] |
| Page is usable at 200% zoom | Browser zoom to 200% | [ ] |
| No horizontal scrolling at 320px width | Resize browser window | [ ] |
| Content is readable without CSS | Disable CSS in browser | [ ] |
| Animations respect `prefers-reduced-motion` | macOS: System Preferences > Accessibility > Display | [ ] |

---

## Layer 3: Assistive Technology Compatibility

### Test Matrix (for launch)

| Combination | Priority | Pass? |
|-------------|----------|-------|
| VoiceOver + Safari (macOS) | Must pass | [ ] |
| NVDA + Chrome (Windows) | Must pass | [ ] |
| VoiceOver + Safari (iOS) | Must pass (if mobile) | [ ] |
| TalkBack + Chrome (Android) | Must pass (if mobile) | [ ] |
| Keyboard only (no screen reader) | Must pass | [ ] |
| High contrast mode (Windows) | Should pass | [ ] |
| Browser zoom 200% | Must pass | [ ] |

---

## Common Accessibility Issues & Fixes

| Issue | Impact | Fix |
|-------|--------|-----|
| Missing `alt` on images | Critical | Add descriptive `alt` or `alt=""` for decorative |
| Missing form labels | Critical | Add `<label htmlFor="id">` or `aria-label` |
| Low color contrast | Serious | Increase contrast ratio to meet WCAG AA |
| Missing focus indicator | Serious | Use `focus-visible` CSS, never `outline: none` without replacement |
| Non-descriptive links ("click here") | Moderate | Use descriptive link text ("View project details") |
| Auto-playing media | Moderate | Add pause/stop controls, or don't auto-play |
| Missing language attribute | Moderate | Add `lang="en"` to `<html>` element |
| Keyboard trap | Critical | Ensure focus can always leave any component |
| Missing heading hierarchy | Moderate | Use `h1` → `h2` → `h3` in order, don't skip levels |
| ARIA misuse | Serious | Follow WAI-ARIA Authoring Practices |

---

## Accessibility in CI/CD

### Gate Criteria

| Severity | CI Behavior |
|----------|-------------|
| Critical | Block deployment — must fix before merge |
| Serious | Block deployment — must fix before merge |
| Moderate | Warning — should fix, don't block |
| Minor | Info — track in backlog |

### Lighthouse Accessibility Score

```typescript
// Add to performance test config
{
  accessibility: {
    minScore: 90,  // Minimum Lighthouse accessibility score
    failOnViolation: true,
  }
}
```

---

## Reporting & Compliance

### VPAT (Voluntary Product Accessibility Template)

For enterprise sales, customers may request a VPAT / Accessibility Conformance Report.

See `29-legal-documents/vpat-template.md` for the template.

### Accessibility Statement

Publish an accessibility statement on your website:

```
/accessibility or /accessibility-statement
```

Include:
- WCAG conformance level claimed (e.g., "WCAG 2.1 Level AA")
- Known limitations and planned improvements
- Contact information for accessibility feedback
- Date of last accessibility review

---

## Testing Schedule

| Activity | Frequency | Responsible |
|----------|-----------|-------------|
| Automated axe-core scan | Every CI build | Automated |
| Keyboard navigation test | Per feature | Developer |
| Screen reader test | Per feature | Developer |
| Full accessibility audit | Quarterly | Dedicated tester |
| User testing with disabled users | Annually or before major releases | External |
| VPAT update | Annually | Product team |

---

## Checklist

- [ ] axe-core integrated into Playwright E2E tests
- [ ] eslint-plugin-jsx-a11y configured
- [ ] Keyboard navigation tested for all screens
- [ ] Screen reader tested with VoiceOver or NVDA
- [ ] Color contrast verified for all text and UI components
- [ ] Reduced motion preference respected
- [ ] Accessibility CI gate configured (block on critical/serious)
- [ ] Accessibility statement published
- [ ] VPAT created (if enterprise product)
