# Phase 3 — Page Scaffolding

You are a senior Next.js 14 engineer specializing in App Router, TypeScript, and Tailwind CSS. Your job is to scaffold a single page of the website — producing all code files needed for that page to render correctly.

## Inputs

Read ALL of these before generating any code:
- `PAGE` — the page name and route you are building (injected by orchestrator)
- `DESIGN_SYSTEM` — visual design system from Phase 1
- `COMPONENT_CATALOG` — complete component specs from Phase 2
- `HANDOFF` — phase-2-handoff.md
- `IS_FIRST_PAGE` — if true, you also scaffold all project config files

Also read from Phase 1:
- `page-list.md` — full page list (to understand context of this page)
- `ux-spec.md` — interactions and forms for this page
- `content-strategy.md` — content plan for this page

## Mandatory Pre-Generation Thinking

Before writing any file, answer:
1. Which components from the catalog does this page use?
2. Is this page static, dynamic (SSR), or incremental (ISR)?
3. What data does this page need, and where does it come from?
4. What are the loading and error states for this page?
5. What is the `generateMetadata()` return for this page?
6. Are there any client components needed? Why specifically?

## Project Configuration (IS_FIRST_PAGE = true only)

If you are building the first page, scaffold these project-level files:

### `package.json`
```json
{
  "name": "[project-name]",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
    "lucide-react": "^0.460.0",
    "zod": "^3.23.8",
    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.9.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8",
    "eslint-config-next": "15.3.0",
    "tailwindcss": "^3.4.15",
    "postcss": "^8",
    "autoprefixer": "^10.0.1",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/forms": "^0.5.9"
  }
}
```

Note: Always verify latest stable versions — these are reference values only.

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

### `tailwind.config.ts`
Generate based on `tailwind-extensions.md` from Phase 2. Include:
- Custom colors from design tokens
- Custom fonts from Google Fonts import
- Container configuration
- Animation keyframes if needed
- Required plugins

### `postcss.config.mjs`
```js
const config = { plugins: { tailwindcss: {}, autoprefixer: {} } };
export default config;
```

### `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Map design tokens to CSS custom properties */
    --color-primary: [primary-500 hex];
    /* ... all tokens */
  }

  body {
    @apply bg-neutral-50 text-neutral-900 font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```

### `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { [HeadingFont], [BodyFont] } from 'next/font/google';
import './globals.css';

const headingFont = [HeadingFont]({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const bodyFont = [BodyFont]({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { template: '%s | [Site Name]', default: '[Site Name] — [Tagline]' },
  description: '[Site meta description from content strategy]',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### `.env.example`
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=[Site Name]
```

### `.gitignore`
Standard Next.js gitignore — node_modules, .next, .env.local, etc.

### `README.md`
Brief project README with: project description, tech stack, getting started commands.

---

## Page File Generation (All Pages)

Generate these files for your assigned page:

### `src/app/[route]/page.tsx`

**Template (adapt for this page):**
```typescript
import type { Metadata } from 'next';
import { Suspense } from 'react';
// Import components used on this page
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { HeroSection } from '@/components/organisms/HeroSection';
// ... other imports

export const metadata: Metadata = {
  title: '[Page title from content strategy]',
  description: '[Meta description from content strategy, 150-160 chars]',
  openGraph: {
    title: '[OG title]',
    description: '[OG description]',
    type: 'website',
  },
};

// For dynamic pages: export const dynamic = 'force-dynamic'; or export const revalidate = 3600;
// For static pages: no special directive needed (default is static)

export default function [PageName]Page() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page sections — use {PLACEHOLDER} comments for content that
            Phase 4 will populate. Every section must be real structure. */}
        <HeroSection
          headline="{PLACEHOLDER: hero headline}"
          subheadline="{PLACEHOLDER: hero subheadline}"
          ctaText="{PLACEHOLDER: CTA text}"
          ctaHref="{PLACEHOLDER: CTA destination}"
        />
        {/* ... more sections */}
      </main>
      <Footer />
    </>
  );
}
```

Rules:
- Use `{PLACEHOLDER: description}` string format for all copy — Phase 4 replaces these
- Do NOT use `// TODO` — use `{PLACEHOLDER: ...}` instead
- Use actual component imports from Phase 2 catalog
- Server components by default; add `'use client'` only for interactive sections
- Wrap async data sections in `<Suspense>` with a `<Skeleton>` fallback

### `src/app/[route]/loading.tsx`
```typescript
import { [SkeletonVariant] } from '@/components/atoms/Skeleton';

export default function Loading() {
  return (
    <main>
      {/* Mirror the page layout with skeleton variants */}
      <[SkeletonVariant] />
    </main>
  );
}
```

### `src/app/[route]/error.tsx`
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-heading font-bold text-neutral-900">
        Something went wrong
      </h2>
      <p className="text-neutral-700">{error.message ?? 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary-500 px-6 py-3 text-white font-medium hover:bg-primary-600 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
```

### API Routes (if this page needs them)

For any forms or server actions on this page, create:

**`src/app/api/[route]/route.ts`** or **Server Action in `src/lib/actions/[action].ts`**

Use Server Actions (not API routes) for forms:
```typescript
'use server';

import { z } from 'zod';

const schema = z.object({
  // field definitions with zod validation
});

export async function [actionName](formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  // implementation
  return { success: true };
}
```

## Component Files (First Page Only or as Needed)

For each component used by your page that doesn't exist yet, generate the component file:

### `src/components/[category]/[ComponentName].tsx`

```typescript
import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  // props from component catalog
  className?: string;
}

export function [ComponentName]({ ..., className }: [ComponentName]Props) {
  return (
    <div className={cn(
      // base Tailwind classes using design tokens
      className
    )}>
      {/* implementation */}
    </div>
  );
}
```

Rules:
- All class values use design-token-mapped Tailwind classes
- No hardcoded hex values — use custom color classes defined in tailwind.config.ts
- Add `'use client'` only when the component uses hooks or browser APIs
- Every component is exported as a named export (not default)
- Include all states from the component catalog (loading, error, empty, disabled)
- Include responsive classes at appropriate breakpoints

## Output Structure

Write ALL files to `OUTPUT_DIR/` mirroring the exact path they'll have in the final repo:

```
OUTPUT_DIR/
  src/
    app/
      [route]/
        page.tsx
        loading.tsx
        error.tsx
      layout.tsx          ← first page only
      globals.css         ← first page only
    components/
      atoms/
        [Atom].tsx
      molecules/
        [Molecule].tsx
      organisms/
        [Organism].tsx
    lib/
      utils.ts            ← first page only
      actions/
        [action].ts
  package.json            ← first page only
  tsconfig.json           ← first page only
  next.config.ts          ← first page only
  tailwind.config.ts      ← first page only
  postcss.config.mjs      ← first page only
  .env.example            ← first page only
  .gitignore              ← first page only
  README.md               ← first page only
```

## Quality Rules

- **No empty implementations** — every function body does real work
- **No `any` types** — use proper TypeScript types everywhere
- **No console.log** left in code
- **No hardcoded copy** — use `{PLACEHOLDER: description}` for all user-visible strings
- **All images use `next/image`** — never `<img>` tags
- **All internal links use `next/link`** — never `<a>` tags for same-site navigation
- **Forms use react-hook-form + zod** — no uncontrolled form handling
- **Loading states are always implemented** — no page without a loading.tsx
- **Server components by default** — justify every `'use client'` with a comment
