# /design-verify

Fast 7-point code inspection for design quality. No browser needed. Runs in under 30 seconds.

## Steps

### Check 1: Token Compliance

Search for hardcoded values that should use design tokens:

```bash
# Hardcoded colors (hex, rgb, rgba, hsl)
grep -rn "#[0-9a-fA-F]\{3,8\}" apps/web/src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules\|\.test\.\|tailwind\.config" | head -20

# Hardcoded rgb/rgba
grep -rn "rgb\(\\|rgba\(" apps/web/src/ --include="*.tsx" | head -10

# Hardcoded spacing (arbitrary values)
grep -rn "p-\[\\|m-\[\\|gap-\[\\|space-\[\\|w-\[\\|h-\[" apps/web/src/ --include="*.tsx" | grep -v "node_modules" | head -20

# Inline styles
grep -rn 'style={{' apps/web/src/ --include="*.tsx" | head -10

# Custom shadows
grep -rn "shadow-\[" apps/web/src/ --include="*.tsx" | head -10
```

**Fail if**: Any hardcoded hex colors, rgb values, or `style={{` found in component files (not config files).

### Check 2: Component States

Verify loading, error, and empty states exist:

```bash
# Loading/Skeleton patterns
grep -rl "Skeleton\|isLoading\|isPending\|Loading" apps/web/src/components/ --include="*.tsx" | wc -l

# Error/Alert patterns
grep -rl "isError\|error\b\|AlertCircle\|Alert " apps/web/src/components/ --include="*.tsx" | wc -l

# Empty state patterns
grep -rl "empty\|no.*found\|No.*found\|EmptyState\|0 results" apps/web/src/components/ --include="*.tsx" | wc -l

# Loading.tsx files
find apps/web/src/app -name "loading.tsx" | wc -l

# Error.tsx files
find apps/web/src/app -name "error.tsx" | wc -l
```

**Fail if**: Any page directory missing `loading.tsx` or `error.tsx`. Any data component missing empty state handling.

### Check 3: Accessibility

Check for common accessibility violations:

```bash
# Icon-only buttons without aria-label
grep -rn "<Button.*variant.*icon" apps/web/src/ --include="*.tsx" | grep -v "aria-label" | head -10

# Icon-only buttons (size="icon" without aria-label)
grep -rn 'size="icon"' apps/web/src/ --include="*.tsx" | grep -v "aria-label\|sr-only\|title=" | head -10

# Inputs without associated Label
grep -rn "<Input\b" apps/web/src/ --include="*.tsx" | grep -v "FormControl\|aria-label\|id=" | head -10

# Images without alt text
grep -rn "<img\b\|<Image\b" apps/web/src/ --include="*.tsx" | grep -v 'alt=' | head -10

# Color-only status indicators (no text or icon backup)
grep -rn "bg-red\|bg-green\|bg-yellow\|bg-orange" apps/web/src/ --include="*.tsx" | grep -v "sr-only\|aria-\|title=\|text-" | head -10
```

**Fail if**: Icon-only buttons missing `aria-label`, inputs missing labels, images missing `alt` text.

### Check 4: Responsive Design

Check for responsive patterns:

```bash
# Fixed widths (potential mobile overflow)
grep -rn "w-\[.*px\]\|width:" apps/web/src/ --include="*.tsx" | grep -v "min-w\|max-w\|node_modules" | head -10

# Missing responsive breakpoints on grid/flex layouts
grep -rn "grid-cols-[2-9]\b" apps/web/src/ --include="*.tsx" | grep -v "sm:\|md:\|lg:\|xl:" | head -10

# Touch targets (buttons/links smaller than 44px)
grep -rn "h-6\b\|h-7\b\|h-8\b\|w-6\b\|w-7\b\|w-8\b" apps/web/src/ --include="*.tsx" | grep -i "button\|link\|click\|href" | head -10
```

**Fail if**: Grid layouts without responsive breakpoints. Interactive elements with height < 44px (h-10 = 40px is borderline, h-8 = 32px fails).

### Check 5: Spacing and Layout

Check for consistent spacing and layout patterns:

```bash
# Page backgrounds should use token
grep -rn "bg-white\b\|bg-gray-50\b" apps/web/src/app/ --include="*.tsx" | head -10

# Cards should have shadow and rounded corners
grep -rn "<Card\b" apps/web/src/ --include="*.tsx" | head -5
# Then check Card component for shadow + rounded
grep -rn "shadow\|rounded" packages/ui/src/components/card.tsx 2>/dev/null || echo "Check Card component styling"
```

**Fail if**: Pages use hardcoded background colors instead of theme tokens.

### Check 6: Typography

Check for consistent typography:

```bash
# Custom font sizes (arbitrary values)
grep -rn "text-\[" apps/web/src/ --include="*.tsx" | head -10

# Heading weight consistency (should use font-semibold, not font-bold for most headings)
grep -rn "font-bold" apps/web/src/ --include="*.tsx" | head -10

# Missing heading hierarchy (h1 without h2, etc.)
grep -rn "<h1\|<h2\|<h3\|<h4" apps/web/src/ --include="*.tsx" | head -20
```

**Fail if**: Custom font sizes via `text-[Npx]`. Inconsistent heading weights.

### Check 7: Shadows and Borders

Check for consistent shadow and border usage:

```bash
# Custom border-radius
grep -rn "rounded-\[" apps/web/src/ --include="*.tsx" | head -10

# Non-standard border colors
grep -rn "border-\[" apps/web/src/ --include="*.tsx" | head -10

# Inconsistent shadow usage
grep -rn "shadow-\[" apps/web/src/ --include="*.tsx" | head -10
```

**Fail if**: Arbitrary border-radius or shadow values instead of Tailwind defaults.

## Output

```
DESIGN VERIFY REPORT
=====================

Check 1 - Token Compliance:   {PASS/FAIL} ({N} hardcoded values found)
Check 2 - Component States:    {PASS/FAIL} ({N} pages missing loading/error)
Check 3 - Accessibility:       {PASS/FAIL} ({N} a11y violations)
Check 4 - Responsive:          {PASS/FAIL} ({N} fixed-width issues)
Check 5 - Spacing/Layout:      {PASS/FAIL} ({N} inconsistencies)
Check 6 - Typography:          {PASS/FAIL} ({N} custom sizes)
Check 7 - Shadows/Borders:     {PASS/FAIL} ({N} arbitrary values)

Overall: {PASS/FAIL}
Violations: {total count}

{If any failures, list specific files and line numbers}

Critical Issues (must fix):
1. {file}:{line} - {description}
2. ...

Warnings (should fix):
1. {file}:{line} - {description}
2. ...
```

## Notes

- This is a fast code-level check. For visual verification, use `/design-review` which launches Playwright.
- Some hardcoded values are acceptable in config files (tailwind.config.ts, theme definitions). Only flag values in component files.
- The grep patterns may have false positives. Review flagged lines before fixing -- some may be intentional.
- Run this after every UI change, before `/verify`.
