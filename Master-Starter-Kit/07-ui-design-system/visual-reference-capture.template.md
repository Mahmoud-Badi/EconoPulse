# Visual Reference Capture — {{PROJECT_NAME}}

> **Purpose:** Captures the current visual state before applying design system changes. Prevents "what did it look like before?" questions and provides a rebrand checklist.
> **When:** Step 13 (Design System Setup) — for existing codebases only (not greenfield).
> **Skip if:** This is a greenfield project with no existing UI.

---

## 1. "Before" Screenshot Manifest

Capture screenshots of the current UI BEFORE applying any design token or branding changes.

| Screen | URL/Route | Screenshot (375px) | Screenshot (1280px) | Notes |
|--------|----------|-------------------|---------------------|-------|
| Login | {{route}} | [capture] | [capture] | |
| Dashboard | {{route}} | [capture] | [capture] | |
| Primary list view | {{route}} | [capture] | [capture] | |
| Primary detail view | {{route}} | [capture] | [capture] | |
| Settings | {{route}} | [capture] | [capture] | |

> Minimum: 5 screens. Include every screen type (list, detail, form, dashboard, auth).

**Storage:** Save screenshots to `dev_docs/foundations/visual-reference/before/`

---

## 2. Design Token Diff

Document every token that will change from the source to the target design.

### Colors

| Token | Source Value | Target Value | Reason for Change |
|-------|------------|-------------|-------------------|
| `--primary` | {{hex}} | {{hex}} | {{brand color change}} |
| `--primary-foreground` | {{hex}} | {{hex}} | {{contrast adjustment}} |
| `--secondary` | {{hex}} | {{hex}} | |
| `--accent` | {{hex}} | {{hex}} | |
| `--destructive` | {{hex}} | {{hex}} | |
| `--muted` | {{hex}} | {{hex}} | |
| `--background` | {{hex}} | {{hex}} | |
| `--foreground` | {{hex}} | {{hex}} | |
| `--card` | {{hex}} | {{hex}} | |
| `--border` | {{hex}} | {{hex}} | |

### Typography

| Token | Source Value | Target Value | Reason |
|-------|------------|-------------|--------|
| `--font-sans` | {{font}} | {{font}} | |
| `--font-heading` | {{font}} | {{font}} | |
| `--font-mono` | {{font}} | {{font}} | |

### Spacing / Radius

| Token | Source Value | Target Value | Reason |
|-------|------------|-------------|--------|
| `--radius` | {{value}} | {{value}} | |

---

## 3. Rebrand Checklist

Every touchpoint that needs updating when changing the brand identity.

### Code Changes

- [ ] `globals.css` / `tailwind.config` — design tokens
- [ ] `layout.tsx` — metadata, title, description
- [ ] Favicon — `public/favicon.ico`, `app/icon.tsx`
- [ ] Open Graph images — `public/og-image.png`, `app/opengraph-image.tsx`
- [ ] Logo component — SVG/image swap
- [ ] Loading/splash screen — brand elements
- [ ] Error pages (404, 500) — brand styling
- [ ] Email templates — header logo, footer, colors
- [ ] PDF/print templates — letterhead, branding

### External Assets

- [ ] App icons (iOS/Android if mobile)
- [ ] Social media profile images
- [ ] Documentation site branding
- [ ] Marketing site branding
- [ ] Help center/support portal branding

### Content Changes

- [ ] Product name in all UI copy
- [ ] Legal entity name in Terms of Service
- [ ] Legal entity name in Privacy Policy
- [ ] Support email addresses
- [ ] Copyright notice in footer
- [ ] "Powered by" attributions

### Infrastructure

- [ ] Domain name / DNS
- [ ] SSL certificate (if domain changed)
- [ ] Email sending domain (SPF, DKIM)
- [ ] OAuth redirect URLs
- [ ] Webhook URLs (if domain changed)

---

## 4. "After" Screenshot Manifest

> Capture AFTER applying all design changes. Compare side-by-side with "Before" screenshots.

| Screen | Before | After | Visual Review | Notes |
|--------|--------|-------|---------------|-------|
| Login | [link] | [link] | ☐ Approved | |
| Dashboard | [link] | [link] | ☐ Approved | |
| Primary list | [link] | [link] | ☐ Approved | |
| Primary detail | [link] | [link] | ☐ Approved | |
| Settings | [link] | [link] | ☐ Approved | |

**Storage:** Save screenshots to `dev_docs/foundations/visual-reference/after/`
