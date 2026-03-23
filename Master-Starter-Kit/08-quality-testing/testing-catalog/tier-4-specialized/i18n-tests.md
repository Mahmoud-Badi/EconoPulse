# Internationalization (i18n) Tests

## What It Is

Internationalization testing verifies that your application correctly handles multiple languages, locales, writing systems, and cultural formatting conventions. This goes far beyond "are all strings translated?" — it covers RTL (right-to-left) layout rendering for Arabic and Hebrew, date/time/currency/number formatting that changes per locale, pluralization rules that differ between languages (English has 2 forms, Arabic has 6), text expansion that breaks layouts (German text is typically 30% longer than English), bidirectional text mixing, and locale-aware sorting and searching. The goal is to ensure that a user in Tokyo, Cairo, or Berlin has the same quality experience as a user in New York.

---

## What It Catches

- **Missing translation keys** — A new feature ships with hardcoded English strings. The German, Japanese, and Arabic versions show raw keys like `dashboard.welcome.subtitle` instead of translated text.
- **Text overflow from language expansion** — A button labeled "Submit" in English becomes "Absenden" in German and "Soumettre" in French — both longer and both overflow their container, overlapping the next element.
- **Broken RTL layout** — The sidebar is on the left for English but should be on the right for Arabic. Navigation arrows point the wrong direction. Progress bars fill from the wrong side.
- **Wrong date format** — A US user sees `03/15/2024` (March 15). A UK user also sees `03/15/2024` instead of `15/03/2024`, interpreting it as the wrong date entirely.
- **Currency formatting errors** — Displaying `$1,234.56` for all locales when German users expect `1.234,56 €` (different symbol position, different thousands separator, different decimal separator).
- **Pluralization failures** — "You have 1 items in your cart" because the code uses `count + " items"` instead of locale-aware pluralization. In Russian, the pluralization rules are: 1 item, 2-4 items (different form), 5-20 items (third form), 21 items (back to first form).
- **Bidirectional text corruption** — A product name in Arabic mixed with an English brand name renders with scrambled word order because of missing `dir` attributes and Unicode bidirectional markers.
- **Locale-dependent sorting** — A user list sorted by name puts "Ö" at the end in English collation but between "O" and "P" in German collation. Swedish puts "Å", "Ä", "Ö" after "Z".
- **Number parsing failures** — User in France enters `1.500,00` (one thousand five hundred) and the system parses it as `1.5` because it assumes English number format.
- **Truncated Asian characters** — A CSS `max-width` that fits 20 English characters only fits 8 CJK characters because they're wider. The text is cut off mid-word.

---

## When It's Required

| Condition | Why |
|-----------|-----|
| Your app supports 2+ languages | Even one additional language exposes i18n bugs |
| You have users in non-English-speaking countries | Even if the UI is English-only, dates, numbers, and currencies must be locale-aware |
| You support any RTL language (Arabic, Hebrew, Farsi, Urdu) | RTL layout is a fundamentally different rendering mode |
| You display dates, times, currencies, or numbers | These all change format by locale |
| You have user-generated content that may be in multiple languages | BiDi text handling is critical |
| You're targeting app store distribution in multiple regions | App store reviews in non-English markets will flag i18n issues |
| Regulatory requirements mandate local language support | GDPR consent must be in the user's language in the EU |

**Skip when:** Internal tool used exclusively by an English-speaking team in a single timezone with no plans to expand.

---

## Setup Guide

### i18n Framework

```bash
# React/Next.js
npm install i18next react-i18next i18next-http-backend

# Vue
npm install vue-i18n

# Alternative: next-intl (Next.js specific, simpler API)
npm install next-intl
```

### Testing Tools

```bash
# Playwright (for visual RTL/layout testing)
npm install -D @playwright/test

# i18next testing utilities
# (i18next has built-in test mode — no extra package needed)

# ICU message format checking
npm install -D @formatjs/cli
```

### Project Structure

```
tests/
  i18n/
    translation-coverage.test.ts    # All keys present in all locales
    formatting.test.ts              # Date, number, currency per locale
    pluralization.test.ts           # Plural rules per language
    rtl-layout.spec.ts              # RTL rendering (Playwright)
    text-expansion.spec.ts          # Layout with longer translations
    bidi-text.spec.ts               # Bidirectional text mixing
  fixtures/
    locale-test-data.ts             # Per-locale test expectations
```

---

## Template

### Translation Key Coverage Test

```ts
// tests/i18n/translation-coverage.test.ts
import en from '../../public/locales/en/common.json';
import de from '../../public/locales/de/common.json';
import ja from '../../public/locales/ja/common.json';
import ar from '../../public/locales/ar/common.json';

// Recursively extract all keys from a nested JSON object
function extractKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return extractKeys(value, fullKey);
    }
    return [fullKey];
  });
}

const allLocales = { en, de, ja, ar };
const referenceKeys = extractKeys(en); // English is the source of truth

describe('Translation Key Coverage', () => {

  for (const [locale, translations] of Object.entries(allLocales)) {
    if (locale === 'en') continue; // Skip comparing English to itself

    test(`${locale} has all keys from English`, () => {
      const localeKeys = extractKeys(translations);
      const missingKeys = referenceKeys.filter(key => !localeKeys.includes(key));

      if (missingKeys.length > 0) {
        console.log(`Missing keys in ${locale}:`, missingKeys);
      }

      expect(missingKeys).toEqual([]);
    });

    test(`${locale} has no extra keys not in English`, () => {
      const localeKeys = extractKeys(translations);
      const extraKeys = localeKeys.filter(key => !referenceKeys.includes(key));

      if (extraKeys.length > 0) {
        console.log(`Extra keys in ${locale} (possibly stale):`, extraKeys);
      }

      // Warning, not error — extra keys might be locale-specific
      expect(extraKeys).toEqual([]);
    });

    test(`${locale} has no empty translation values`, () => {
      const localeKeys = extractKeys(translations);
      const emptyKeys = localeKeys.filter(key => {
        const value = key.split('.').reduce((obj: any, k) => obj?.[k], translations);
        return value === '' || value === null || value === undefined;
      });

      expect(emptyKeys).toEqual([]);
    });
  }

  test('no hardcoded strings in components (spot check)', () => {
    // This is a static analysis check — not exhaustive, but catches obvious ones
    // For comprehensive detection, use eslint-plugin-i18next
    const fs = require('fs');
    const glob = require('glob');

    const componentFiles = glob.sync('src/components/**/*.{tsx,jsx}');
    const violations: string[] = [];

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      // Look for common patterns of hardcoded strings
      const hardcodedPatterns = [
        />[\s]*[A-Z][a-z]+[\s]+[a-z]+[\s]*</g,  // >Submit form<
        /placeholder="[A-Za-z ]+"/g,               // placeholder="Enter name"
        /title="[A-Za-z ]+"/g,                     // title="Click here"
        /aria-label="[A-Za-z ]+"/g,                // aria-label="Close"
      ];

      for (const pattern of hardcodedPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          violations.push(`${file}: ${matches[0]}`);
        }
      }
    }

    if (violations.length > 0) {
      console.warn('Potential hardcoded strings found:', violations);
    }
    // This is a soft check — review violations manually
    // expect(violations).toEqual([]);
  });
});
```

### Date/Number/Currency Formatting Test

```ts
// tests/i18n/formatting.test.ts

describe('Locale-Specific Formatting', () => {

  // ─── Date Formatting ──────────────────────────────────────

  const testDate = new Date('2024-03-15T14:30:00Z');

  const expectedDates: Record<string, string> = {
    'en-US': '3/15/2024',       // M/D/YYYY
    'en-GB': '15/03/2024',      // DD/MM/YYYY
    'de-DE': '15.03.2024',      // DD.MM.YYYY
    'ja-JP': '2024/03/15',      // YYYY/MM/DD
    'ar-EG': '١٥/٠٣/٢٠٢٤',    // Arabic-Indic numerals, DD/MM/YYYY
  };

  for (const [locale, expected] of Object.entries(expectedDates)) {
    test(`date formats correctly for ${locale}`, () => {
      const formatted = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(testDate);
      expect(formatted).toBe(expected);
    });
  }

  // ─── Number Formatting ────────────────────────────────────

  const testNumber = 1234567.89;

  const expectedNumbers: Record<string, string> = {
    'en-US': '1,234,567.89',     // Comma thousands, dot decimal
    'de-DE': '1.234.567,89',     // Dot thousands, comma decimal
    'fr-FR': '1\u202f234\u202f567,89', // Narrow no-break space thousands, comma decimal
    'ja-JP': '1,234,567.89',     // Same as English
    'ar-EG': '١٬٢٣٤٬٥٦٧٫٨٩',  // Arabic-Indic numerals
  };

  for (const [locale, expected] of Object.entries(expectedNumbers)) {
    test(`number formats correctly for ${locale}`, () => {
      const formatted = new Intl.NumberFormat(locale).format(testNumber);
      expect(formatted).toBe(expected);
    });
  }

  // ─── Currency Formatting ──────────────────────────────────

  const testAmount = 1234.56;

  const expectedCurrencies: Record<string, { currency: string; expected: string }> = {
    'en-US': { currency: 'USD', expected: '$1,234.56' },
    'de-DE': { currency: 'EUR', expected: '1.234,56\u00a0€' },
    'ja-JP': { currency: 'JPY', expected: '￥1,235' },  // JPY has no decimals
    'en-GB': { currency: 'GBP', expected: '£1,234.56' },
  };

  for (const [locale, { currency, expected }] of Object.entries(expectedCurrencies)) {
    test(`currency formats correctly for ${locale} (${currency})`, () => {
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(testAmount);
      expect(formatted).toBe(expected);
    });
  }
});
```

### Pluralization Test

```ts
// tests/i18n/pluralization.test.ts
import i18next from 'i18next';

beforeAll(async () => {
  await i18next.init({
    lng: 'en',
    resources: {
      en: {
        translation: {
          items_one: '{{count}} item',
          items_other: '{{count}} items',
        },
      },
      ar: {
        translation: {
          items_zero: '{{count}} عنصر',        // 0
          items_one: 'عنصر واحد',              // 1
          items_two: 'عنصران',                 // 2
          items_few: '{{count}} عناصر',        // 3-10
          items_many: '{{count}} عنصرًا',      // 11-99
          items_other: '{{count}} عنصر',       // 100+
        },
      },
      ru: {
        translation: {
          items_one: '{{count}} элемент',       // 1, 21, 31...
          items_few: '{{count}} элемента',      // 2-4, 22-24...
          items_many: '{{count}} элементов',    // 5-20, 25-30...
        },
      },
    },
  });
});

describe('Pluralization Rules', () => {

  test('English: 2 plural forms', () => {
    i18next.changeLanguage('en');
    expect(i18next.t('items', { count: 0 })).toBe('0 items');
    expect(i18next.t('items', { count: 1 })).toBe('1 item');
    expect(i18next.t('items', { count: 2 })).toBe('2 items');
    expect(i18next.t('items', { count: 100 })).toBe('100 items');
  });

  test('Arabic: 6 plural forms', () => {
    i18next.changeLanguage('ar');
    expect(i18next.t('items', { count: 0 })).toBe('0 عنصر');
    expect(i18next.t('items', { count: 1 })).toBe('عنصر واحد');
    expect(i18next.t('items', { count: 2 })).toBe('عنصران');
    expect(i18next.t('items', { count: 5 })).toBe('5 عناصر');
    expect(i18next.t('items', { count: 15 })).toBe('15 عنصرًا');
    expect(i18next.t('items', { count: 100 })).toBe('100 عنصر');
  });

  test('Russian: 3 plural forms', () => {
    i18next.changeLanguage('ru');
    expect(i18next.t('items', { count: 1 })).toBe('1 элемент');
    expect(i18next.t('items', { count: 2 })).toBe('2 элемента');
    expect(i18next.t('items', { count: 5 })).toBe('5 элементов');
    expect(i18next.t('items', { count: 21 })).toBe('21 элемент');     // Back to 'one' form
    expect(i18next.t('items', { count: 22 })).toBe('22 элемента');    // Back to 'few' form
  });
});
```

### RTL Layout Test (Playwright)

```ts
// tests/i18n/rtl-layout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('RTL Layout (Arabic)', () => {

  test.beforeEach(async ({ page }) => {
    // Set locale to Arabic
    await page.goto('/dashboard?locale=ar');
    // Or: await page.evaluate(() => document.documentElement.dir = 'rtl');
  });

  test('html dir attribute is set to rtl', async ({ page }) => {
    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');
  });

  test('sidebar is on the right side', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    const box = await sidebar.boundingBox();
    const viewport = page.viewportSize();

    // Sidebar should be on the right half of the viewport
    expect(box!.x).toBeGreaterThan(viewport!.width / 2);
  });

  test('text is right-aligned', async ({ page }) => {
    const heading = page.locator('h1').first();
    const textAlign = await heading.evaluate(
      (el) => getComputedStyle(el).textAlign
    );
    expect(textAlign).toBe('right');
  });

  test('navigation arrows are mirrored', async ({ page }) => {
    // "Back" arrow should point right in RTL (←  becomes →)
    const backButton = page.locator('[data-testid="back-button"]');
    const transform = await backButton.evaluate(
      (el) => getComputedStyle(el).transform
    );
    // Check for scaleX(-1) or rotateY(180deg) applied via CSS logical properties
    // This depends on your implementation
    expect(transform).not.toBe('none');
  });

  test('form labels align correctly', async ({ page }) => {
    await page.goto('/settings?locale=ar');
    const label = page.locator('label').first();
    const input = page.locator('input').first();

    const labelBox = await label.boundingBox();
    const inputBox = await input.boundingBox();

    // Label should be to the right of the input in RTL
    expect(labelBox!.x).toBeGreaterThanOrEqual(inputBox!.x + inputBox!.width - 10);
  });

  test('no horizontal scrollbar (overflow from LTR assumptions)', async ({ page }) => {
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
```

### Text Expansion Layout Test (Playwright)

```ts
// tests/i18n/text-expansion.spec.ts
import { test, expect } from '@playwright/test';

const LOCALES_TO_TEST = ['en', 'de', 'fr', 'ja', 'ru'];

for (const locale of LOCALES_TO_TEST) {
  test.describe(`Text expansion — ${locale}`, () => {

    test(`buttons do not overflow in ${locale}`, async ({ page }) => {
      await page.goto(`/dashboard?locale=${locale}`);

      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (!box) continue;

        // Button text should not overflow its container
        const overflow = await button.evaluate((el) => {
          return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
      }
    });

    test(`navigation items do not wrap in ${locale}`, async ({ page }) => {
      await page.goto(`/dashboard?locale=${locale}`);

      const nav = page.locator('nav');
      const navBox = await nav.boundingBox();

      // Navigation should stay in a single row (or within expected height)
      expect(navBox!.height).toBeLessThan(100); // Adjust for your design
    });

    test(`table headers are not truncated in ${locale}`, async ({ page }) => {
      await page.goto(`/items?locale=${locale}`);

      const headers = await page.locator('th').all();
      for (const header of headers) {
        const isClipped = await header.evaluate((el) => {
          const style = getComputedStyle(el);
          return style.overflow === 'hidden' && el.scrollWidth > el.clientWidth;
        });
        expect(isClipped).toBe(false);
      }
    });
  });
}
```

### CI Configuration

```yaml
# .github/workflows/i18n-tests.yml
name: i18n Tests
on:
  push:
    paths:
      - 'public/locales/**'
      - 'src/i18n/**'
      - 'src/components/**'
  pull_request:
    paths:
      - 'public/locales/**'
      - 'src/i18n/**'

jobs:
  translation-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx jest tests/i18n/translation-coverage.test.ts tests/i18n/formatting.test.ts tests/i18n/pluralization.test.ts

  rtl-and-layout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build && npm run start &
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test tests/i18n/rtl-layout.spec.ts tests/i18n/text-expansion.spec.ts
```

### package.json Scripts

```json
{
  "scripts": {
    "test:i18n": "jest tests/i18n/ && playwright test tests/i18n/",
    "test:i18n:keys": "jest tests/i18n/translation-coverage.test.ts",
    "test:i18n:format": "jest tests/i18n/formatting.test.ts",
    "test:i18n:rtl": "playwright test tests/i18n/rtl-layout.spec.ts",
    "test:i18n:expansion": "playwright test tests/i18n/text-expansion.spec.ts",
    "i18n:check": "formatjs extract 'src/**/*.{ts,tsx}' --out-file extracted-messages.json && formatjs compile extracted-messages.json"
  }
}
```

---

## Common Pitfalls

### 1. Testing only translation key presence, not translation quality
**Problem:** All keys exist in the German translation file, but half of them are Google-translated gibberish that would embarrass your company in the German market.
**Fix:** Translation coverage tests catch missing keys. Translation quality requires human review or professional translation services. Use a translation management platform (Crowdin, Lokalise, Phrase) with review workflows.

### 2. Using CSS `px` widths on text containers
**Problem:** A button is `width: 120px` — perfect for "Submit" but too narrow for "Absenden" (German) or "Отправить" (Russian).
**Fix:** Use `min-width`, `padding`, or `fit-content` instead of fixed widths. Design for the longest translation, not the English one.

### 3. Assuming all languages are LTR
**Problem:** CSS uses `margin-left`, `padding-right`, `text-align: left`, `float: left`. None of these flip in RTL mode.
**Fix:** Use CSS logical properties: `margin-inline-start`, `padding-inline-end`, `text-align: start`. These automatically flip for RTL. Enable `postcss-logical` or use Tailwind CSS which supports logical properties.

### 4. Hardcoding date formats
**Problem:** `${month}/${day}/${year}` everywhere. Users outside the US see an American date format that's ambiguous or wrong.
**Fix:** Always use `Intl.DateTimeFormat` or a library like `date-fns` with locale support. Never manually construct date strings.

### 5. Testing i18n only in English + one other language
**Problem:** You test English and Spanish. The Arabic RTL layout, the Japanese character width issues, and the German text expansion problems are all missed.
**Fix:** Test at least one language from each category: Latin (German/French for expansion), CJK (Japanese/Chinese for character width), RTL (Arabic/Hebrew for layout), and Cyrillic (Russian for pluralization).

### 6. Forgetting about number input parsing
**Problem:** User in Germany enters `1.500,00` in a price field. Your JavaScript `parseFloat()` returns `1.5` because it only understands English number format.
**Fix:** Use `Intl.NumberFormat` for display and a locale-aware parser for input. Or accept numbers in a locale-neutral format with clear formatting guidance.

---

## Proof Artifact

A i18n test pass produces these artifacts:

### Test output
```
PASS  tests/i18n/translation-coverage.test.ts
  Translation Key Coverage
    ✓ de has all keys from English (12ms)
    ✓ de has no extra keys not in English (3ms)
    ✓ de has no empty translation values (4ms)
    ✓ ja has all keys from English (8ms)
    ✓ ja has no extra keys not in English (2ms)
    ✓ ja has no empty translation values (3ms)
    ✓ ar has all keys from English (7ms)
    ✓ ar has no extra keys not in English (2ms)
    ✓ ar has no empty translation values (3ms)

PASS  tests/i18n/formatting.test.ts
  Locale-Specific Formatting
    ✓ date formats correctly for en-US (3ms)
    ✓ date formats correctly for de-DE (1ms)
    ✓ date formats correctly for ja-JP (1ms)
    ✓ date formats correctly for ar-EG (2ms)
    ✓ currency formats correctly for en-US (1ms)
    ✓ currency formats correctly for de-DE (1ms)
    ✓ currency formats correctly for ja-JP (1ms)

PASS  tests/i18n/rtl-layout.spec.ts
  RTL Layout (Arabic)
    ✓ html dir attribute is set to rtl (0.8s)
    ✓ sidebar is on the right side (0.4s)
    ✓ text is right-aligned (0.3s)
    ✓ navigation arrows are mirrored (0.4s)
    ✓ no horizontal scrollbar (0.2s)

PASS  tests/i18n/text-expansion.spec.ts
  Text expansion — de
    ✓ buttons do not overflow in de (1.2s)
    ✓ navigation items do not wrap in de (0.6s)
    ✓ table headers are not truncated in de (0.8s)
  ... (all locales pass)

Test Suites: 5 passed, 5 total
Tests:       32 passed, 32 total
```

### What constitutes a pass:
1. **Zero missing translation keys** across all supported locales
2. **Zero empty translation values** in any locale file
3. **Formatting tests pass** for dates, numbers, and currencies in all target locales
4. **Pluralization correct** for languages with complex plural rules (Arabic, Russian)
5. **RTL layout renders correctly** — sidebar position, text alignment, no horizontal overflow
6. **No text overflow or truncation** across all supported languages
7. **CI pipeline** completes the i18n test jobs with exit code 0
