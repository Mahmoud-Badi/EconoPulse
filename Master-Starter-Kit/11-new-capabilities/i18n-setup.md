# Internationalization (i18n) Setup

## Purpose

This guide sets up internationalization for {{PROJECT_NAME}} so it can serve content in multiple languages. Even if launch is single-language, setting up i18n from the start avoids costly refactoring later. The patterns here cover translation file structure, library configuration, locale detection, formatting, and a workflow for managing translations.

---

## Translation File Structure

Organize translations by feature namespace, not by language-then-everything. This keeps files small and allows code-splitting translations per route.

```
apps/web/messages/
  en/
    common.json          # Shared strings: buttons, labels, navigation
    auth.json            # Login, register, forgot password
    dashboard.json       # Dashboard-specific
    settings.json        # Settings page
    errors.json          # Error messages
  es/
    common.json
    auth.json
    dashboard.json
    settings.json
    errors.json
  fr/
    common.json
    auth.json
    ...
```

### Translation File Format

```json
// apps/web/messages/en/common.json
{
  "app": {
    "name": "{{PROJECT_NAME}}",
    "tagline": "Your tagline here"
  },
  "nav": {
    "home": "Home",
    "dashboard": "Dashboard",
    "settings": "Settings",
    "logout": "Log out"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Are you sure?",
    "loading": "Loading..."
  }
}
```

```json
// apps/web/messages/en/auth.json
{
  "login": {
    "title": "Sign in to your account",
    "email": "Email address",
    "password": "Password",
    "submit": "Sign in",
    "forgotPassword": "Forgot your password?",
    "noAccount": "Don't have an account? {signUpLink}"
  },
  "register": {
    "title": "Create your account",
    "submit": "Create account",
    "hasAccount": "Already have an account? {signInLink}"
  },
  "errors": {
    "invalidCredentials": "Invalid email or password",
    "accountLocked": "Account locked. Try again in {minutes, plural, one {# minute} other {# minutes}}."
  }
}
```

---

## Library Setup

### Next.js: next-intl (recommended)

```bash
pnpm add next-intl --filter @{{PROJECT_NAME}}/web
```

```typescript
// apps/web/src/i18n/config.ts
export const locales = ["en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

```typescript
// apps/web/src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../../messages/${locale}/common.json`)).default,
      ...(await import(`../../messages/${locale}/auth.json`)).default,
      ...(await import(`../../messages/${locale}/errors.json`)).default,
    },
  };
});
```

```typescript
// apps/web/src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true, // Auto-detect from Accept-Language header
  localePrefix: "as-needed", // Only show /es/, /fr/ -- not /en/ for default
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

```tsx
// Usage in components
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("login");

  return (
    <form>
      <h1>{t("title")}</h1>
      <label>{t("email")}</label>
      <button type="submit">{t("submit")}</button>
    </form>
  );
}
```

### React (non-Next.js): react-i18next

```bash
pnpm add i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

```typescript
// src/i18n/init.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr"],
    ns: ["common", "auth", "dashboard"],
    defaultNS: "common",
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
```

---

## Locale Detection and Switching

### Detection Priority

1. URL path segment (`/es/dashboard`) -- most explicit
2. Cookie or localStorage (`NEXT_LOCALE=es`) -- user preference
3. `Accept-Language` header -- browser preference
4. Default locale fallback

### Language Switcher Component

```tsx
// apps/web/src/components/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { locales } from "@/i18n/config";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {languageNames[loc]}
        </option>
      ))}
    </select>
  );
}
```

---

## Date, Time, and Number Formatting

Never format dates or numbers manually. Use the `Intl` API or library helpers that respect the active locale.

```tsx
// next-intl provides useFormatter
import { useFormatter } from "next-intl";

export function OrderSummary({ date, total }: { date: Date; total: number }) {
  const format = useFormatter();

  return (
    <div>
      <p>Ordered: {format.dateTime(date, { dateStyle: "long" })}</p>
      <p>Total: {format.number(total, { style: "currency", currency: "USD" })}</p>
      <p>Items: {format.number(1234)}</p>
      {/* en: "1,234"  es: "1.234"  fr: "1 234" */}
    </div>
  );
}
```

### Relative Time

```tsx
const format = useFormatter();
// "3 days ago" / "hace 3 dias" / "il y a 3 jours"
format.relativeTime(new Date("2025-01-01"), { now: new Date("2025-01-04") });
```

---

## Pluralization Rules

ICU MessageFormat handles pluralization across languages (English has 2 forms; Arabic has 6).

```json
// messages/en/dashboard.json
{
  "items": {
    "count": "You have {count, plural, =0 {no items} one {# item} other {# items}}.",
    "selected": "{count, plural, one {# item selected} other {# items selected}}"
  }
}
```

```json
// messages/es/dashboard.json
{
  "items": {
    "count": "Tienes {count, plural, =0 {ningun elemento} one {# elemento} other {# elementos}}.",
    "selected": "{count, plural, one {# elemento seleccionado} other {# elementos seleccionados}}"
  }
}
```

```tsx
const t = useTranslations("items");
t("count", { count: 0 });  // "You have no items."
t("count", { count: 1 });  // "You have 1 item."
t("count", { count: 5 });  // "You have 5 items."
```

---

## RTL Support

If supporting Arabic, Hebrew, or other RTL languages, add `dir` attribute handling.

```tsx
// apps/web/src/app/[locale]/layout.tsx
import { getLocale } from "next-intl/server";

const rtlLocales = new Set(["ar", "he", "fa"]);

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = rtlLocales.has(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* Use logical properties instead of physical ones */
.sidebar {
  /* WRONG: margin-left: 1rem; */
  margin-inline-start: 1rem; /* Works for both LTR and RTL */
  /* WRONG: padding-right: 2rem; */
  padding-inline-end: 2rem;
  /* WRONG: text-align: left; */
  text-align: start;
}
```

---

## Type-Safe Translation Keys

Prevent typos and missing translations with TypeScript integration.

```typescript
// apps/web/src/types/i18n.d.ts
import en from "../../messages/en/common.json";
import enAuth from "../../messages/en/auth.json";
import enDashboard from "../../messages/en/dashboard.json";

type Messages = typeof en & typeof enAuth & typeof enDashboard;

declare module "next-intl" {
  interface AppMessages extends Messages {}
}
```

Now `useTranslations("login").t("titl")` will show a TypeScript error because `titl` is not a valid key.

---

## Fallback Language Strategy

```typescript
// Fallback chain: requested locale -> default locale -> key name
// next-intl handles this automatically with:
export default getRequestConfig(async ({ requestLocale }) => {
  return {
    locale,
    messages,
    onError(error) {
      // Log missing translations in development, silent in production
      if (process.env.NODE_ENV === "development") {
        console.warn("Missing translation:", error.message);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`; // Show key path as fallback
    },
  };
});
```

---

## Translation Workflow

1. **Developer** adds English strings in the relevant namespace JSON file
2. **CI** runs extraction to detect untranslated keys: `npx next-intl-lint`
3. **Translation** keys sent to translation service (Crowdin, Lokalise, or Phrase)
4. **Translators** provide translations via the service platform
5. **CI** pulls translated files back into `messages/{locale}/`
6. **Review** PR with translation changes gets merged

### Missing Translation Detection Script

```bash
# scripts/check-translations.sh
#!/bin/bash
DEFAULT_LOCALE="en"
LOCALES=("es" "fr")

for locale in "${LOCALES[@]}"; do
  for file in apps/web/messages/$DEFAULT_LOCALE/*.json; do
    filename=$(basename "$file")
    target="apps/web/messages/$locale/$filename"
    if [ ! -f "$target" ]; then
      echo "MISSING: $target"
    fi
  done
done
```

---

## Checklist

- [ ] Translation files organized by namespace per feature
- [ ] i18n library installed and configured (next-intl, react-i18next, or vue-i18n)
- [ ] Locale detection working (URL > cookie > Accept-Language > default)
- [ ] Language switcher component available in the UI
- [ ] All dates, times, and numbers formatted with locale-aware formatters
- [ ] Pluralization uses ICU MessageFormat syntax
- [ ] RTL support uses CSS logical properties and `dir` attribute
- [ ] Translation keys are type-safe (TypeScript catches typos)
- [ ] Fallback language configured so missing translations do not break the UI
- [ ] Translation workflow documented (extraction, review, deployment)
