# Documentation Site Setup Guide

How to choose and deploy a documentation site for {{PROJECT_NAME}}'s user-facing docs.

---

## Choosing a Platform

| Platform | Best For | Pros | Cons |
|----------|----------|------|------|
| **Docusaurus** | React/Next.js projects | Markdown + MDX, versioning, i18n, search built-in, free hosting | Heavier build, React dependency |
| **Nextra** | Next.js projects | Lightweight, integrates with existing Next.js app, Markdown | Fewer built-in features |
| **GitBook** | Non-technical teams | WYSIWYG editor, hosted, collaboration | Less customizable, hosted pricing |
| **Mintlify** | API-heavy products | Beautiful defaults, API playground, AI search | Hosted pricing, less control |

### Recommendation by Stack

<!-- IF {{FRONTEND_FRAMEWORK}} == "next" -->
**Recommended: Nextra** — integrates directly with your Next.js app. You can host docs at `/docs` on the same domain.

Alternative: Docusaurus if you want a standalone docs site with versioning.
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "react" -->
**Recommended: Docusaurus** — built on React, familiar ecosystem, standalone deployment.
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "vue" -->
**Recommended: VitePress** — Vue-based, lightweight, fast builds.
<!-- ENDIF -->

<!-- IF {{FRONTEND_FRAMEWORK}} == "svelte" -->
**Recommended: Docusaurus or GitBook** — no Svelte-native docs platform is mature enough yet.
<!-- ENDIF -->

---

## Setup Instructions

### Docusaurus

```bash
npx create-docusaurus@latest docs classic --typescript
```

Configure `docusaurus.config.ts`:
- Set `title` to `{{PROJECT_NAME}} Documentation`
- Set `url` to `{{DOCS_SITE_URL}}`
- Configure sidebar from `sidebar-structure.template.md`
- Enable search (Algolia or local search plugin)

### Nextra

```bash
{{PKG_MANAGER}} add nextra nextra-theme-docs
```

Add to your Next.js config and create pages in `app/docs/` or `pages/docs/`.

### GitBook / Mintlify

These are hosted platforms. Connect your Git repository and configure via their dashboard.

---

## Content Organization

Copy the generated `user_docs/` content into the docs site's content directory:

```text
docs-site/
├── docs/
│   ├── getting-started/      ← from user_docs/getting-started/
│   ├── guides/               ← from user_docs/guides/
│   ├── tutorials/            ← from user_docs/tutorials/
│   ├── faq/                  ← from user_docs/faq/
│   ├── troubleshooting/      ← from user_docs/troubleshooting/
│   └── changelog.md          ← from user_docs/changelog.md
├── static/
│   └── screenshots/          ← from user_docs/screenshots/
└── sidebar.js                ← generated from sidebar-structure.template.md
```

---

## Deployment

<!-- IF {{MONOREPO}} == "true" -->
Add the docs site as a workspace member:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "docs"  # ← add this
```
<!-- ENDIF -->

Deploy to:
- **Vercel:** Auto-deploys on push, supports Docusaurus and Nextra natively
- **Netlify:** Similar auto-deploy, good for Docusaurus
- **GitHub Pages:** Free, works with static export
- **Cloudflare Pages:** Fast CDN, free tier

---

## Search

- **Docusaurus:** Use `@docusaurus/plugin-search-local` for self-hosted, or Algolia DocSearch (free for open-source)
- **Nextra:** Built-in FlexSearch
- **GitBook / Mintlify:** Built-in search

---

## Keeping Docs in Sync

The `/document-feature` skill writes to `user_docs/`. If your docs site reads from a different directory, set up a sync script or symlink:

```bash
# Option 1: Symlink (recommended)
ln -s ../../user_docs docs-site/docs

# Option 2: Copy script in CI
cp -r user_docs/* docs-site/docs/
```
