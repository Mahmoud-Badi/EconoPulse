# International SEO Strategy for {{PROJECT_NAME}}

> Comprehensive international search optimization — from URL structure decisions and hreflang implementation through multilingual keyword research, content localization, and market-specific SERP strategies. International SEO is not "regular SEO in another language." Different markets have different search engines, different user behaviors, different content expectations, and different technical requirements. Getting the technical foundation wrong (especially hreflang) can cause Google to serve the wrong language version to users or ignore your international pages entirely.

---

## Table of Contents

1. [URL Structure Decision Framework](#url-structure-decision-framework)
2. [Hreflang Implementation](#hreflang-implementation)
3. [Hreflang Debugging](#hreflang-debugging)
4. [Geo-Targeting in Google Search Console](#geo-targeting-in-google-search-console)
5. [Content Localization vs Translation](#content-localization-vs-translation)
6. [Multilingual Keyword Research](#multilingual-keyword-research)
7. [International Link Building](#international-link-building)
8. [CDN and Server Location](#cdn-and-server-location)
9. [Currency, Date, and Number Localization](#currency-date-and-number-localization)
10. [International SERP Differences](#international-serp-differences)

---

## URL Structure Decision Framework

The most consequential international SEO decision is how you structure URLs for different markets. There are three options, each with distinct trade-offs. This decision is difficult to reverse after implementation, so choose carefully.

### Option 1: Subdirectories (Recommended for Most)

```
{{BASE_URL}}/en/          — English
{{BASE_URL}}/es/          — Spanish
{{BASE_URL}}/de/          — German
{{BASE_URL}}/fr/          — French
{{BASE_URL}}/ja/          — Japanese
```

**Advantages:**
- All content lives under one domain — domain authority is consolidated, not split
- One hosting setup, one SSL certificate, one analytics property
- Easiest to implement and maintain technically
- Link equity flows across all language versions through internal linking
- Simplest CMS and deployment architecture

**Disadvantages:**
- Cannot be geo-targeted at the domain level in Google Search Console (subdirectory-level targeting is available)
- Slightly weaker country-association signal than ccTLDs
- URL can get long if combining language + country (e.g., `/en-gb/products/category/item`)

**Best for:** Most businesses. SaaS products, content sites, and any business that wants to manage one domain.

### Option 2: Subdomains

```
en.example.com            — English
es.example.com            — Spanish
de.example.com            — German
fr.example.com            — French
ja.example.com            — Japanese
```

**Advantages:**
- Can be independently geo-targeted in Google Search Console
- Can be hosted on different servers in different regions
- Separate analytics properties per market if desired
- Some CMS platforms handle subdomains more naturally than subdirectories

**Disadvantages:**
- Google treats subdomains as semi-separate entities — domain authority is partially split
- More complex technical setup (DNS, hosting, SSL for each subdomain)
- Link equity does not flow as naturally between subdomains
- Requires separate GSC properties per subdomain

**Best for:** Businesses with dedicated teams per market that need operational independence, or when the CMS makes subdirectories impractical.

### Option 3: Country-Code Top-Level Domains (ccTLDs)

```
example.com               — US / English
example.es                — Spain / Spanish
example.de                — Germany / German
example.fr                — France / French
example.co.jp             — Japan / Japanese
```

**Advantages:**
- Strongest possible country-targeting signal — Google and users immediately trust the local domain
- Maximum brand localization (customers in Germany prefer `.de` domains)
- Each domain is independently managed and can be hosted locally
- Required or strongly preferred in some markets (China with `.cn`, Russia with `.ru`)

**Disadvantages:**
- Domain authority is completely split — each ccTLD starts from zero and must build authority independently
- Most expensive: separate domain registration, hosting, SSL, and maintenance per market
- Most complex: separate GSC properties, separate analytics, separate CMS instances or complex multi-site
- Backlinks to one ccTLD do not benefit the others at all

**Best for:** Large enterprises with dedicated teams and budgets per country, markets where ccTLDs are culturally expected, or when legal/regulatory requirements mandate a local domain.

### Decision Matrix

| Factor | Subdirectory | Subdomain | ccTLD |
|--------|-------------|-----------|-------|
| **Setup cost** | Low | Medium | High |
| **Ongoing maintenance** | Low | Medium | High |
| **Domain authority** | Consolidated (best) | Partially split | Fully split |
| **Geo-targeting signal** | Moderate | Moderate | Strongest |
| **Server flexibility** | Low (one server, use CDN) | High | Highest |
| **Team independence** | Low | Medium | Highest |
| **CMS complexity** | Lowest | Medium | Highest |
| **Link equity sharing** | Automatic | Partial | None |
| **Recommended if markets** | 1-10 | 3-10 with dedicated teams | 2-5 high-priority countries |

### Decision Template

```
INTERNATIONAL URL STRUCTURE DECISION FOR {{PROJECT_NAME}}
──────────────────────────────────────────────────────────

Target markets: {{TARGET_MARKETS}}
Primary language: {{PRIMARY_LANGUAGE}}
Secondary languages: {{SECONDARY_LANGUAGES}}
Annual budget per market: $_________

Team structure:
  [ ] Single team manages all markets
  [ ] Dedicated teams per market
  [ ] Hybrid (central team + local contributors)

CMS constraints:
  [ ] CMS supports subdirectory-based localization natively
  [ ] CMS requires subdomains or separate instances for localization
  [ ] CMS supports multi-site/multi-domain

Decision: [ ] Subdirectory  [ ] Subdomain  [ ] ccTLD
Rationale: ________________________________________________
```

---

## Hreflang Implementation

Hreflang tags tell search engines which language and regional version of a page to show to users in different locations. They are the most technically error-prone element of international SEO — Google's own data shows that over 75% of hreflang implementations contain errors.

### Hreflang Basics

Every page that has an equivalent page in another language must declare all versions, including itself:

```
Page: {{BASE_URL}}/en/pricing
Equivalents: {{BASE_URL}}/es/pricing, {{BASE_URL}}/de/pricing, {{BASE_URL}}/fr/pricing
```

Each page must reference ALL versions (including itself). This is the **bidirectional requirement** — if Page A references Page B, Page B must reference Page A. Missing return references cause Google to ignore the hreflang entirely.

### Hreflang Attribute Format

```
hreflang="language-region"
```

| Example | Meaning |
|---------|---------|
| `en` | English (any region) |
| `en-US` | English for United States |
| `en-GB` | English for United Kingdom |
| `es` | Spanish (any region) |
| `es-MX` | Spanish for Mexico |
| `es-AR` | Spanish for Argentina |
| `de` | German (any region) |
| `de-AT` | German for Austria |
| `fr` | French (any region) |
| `fr-CA` | French for Canada |
| `zh-Hans` | Simplified Chinese |
| `zh-Hant` | Traditional Chinese |
| `x-default` | Fallback for unmatched languages/regions |

**Rules:**
- Language codes are ISO 639-1 (2-letter lowercase)
- Region codes are ISO 3166-1 Alpha-2 (2-letter uppercase)
- Language is required; region is optional
- `x-default` should point to your language selector page or primary language version

### Method 1: HTML `<head>` Tags

Place in the `<head>` of every page:

```html
<link rel="alternate" hreflang="en" href="{{BASE_URL}}/en/pricing" />
<link rel="alternate" hreflang="es" href="{{BASE_URL}}/es/pricing" />
<link rel="alternate" hreflang="de" href="{{BASE_URL}}/de/pricing" />
<link rel="alternate" hreflang="fr" href="{{BASE_URL}}/fr/pricing" />
<link rel="alternate" hreflang="x-default" href="{{BASE_URL}}/en/pricing" />
```

**When to use:** Sites with fewer than 50 pages per language. Simple to implement. Increases HTML payload size for sites with many language versions.

### Method 2: HTTP Headers

Useful for non-HTML resources (PDFs, files) or when you cannot modify the `<head>`:

```
HTTP/1.1 200 OK
Link: <{{BASE_URL}}/en/pricing>; rel="alternate"; hreflang="en",
      <{{BASE_URL}}/es/pricing>; rel="alternate"; hreflang="es",
      <{{BASE_URL}}/de/pricing>; rel="alternate"; hreflang="de",
      <{{BASE_URL}}/fr/pricing>; rel="alternate"; hreflang="fr",
      <{{BASE_URL}}/en/pricing>; rel="alternate"; hreflang="x-default"
```

**When to use:** PDF documents, non-HTML resources, or sites where modifying `<head>` is not possible.

### Method 3: XML Sitemap

The most scalable approach for large sites:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>{{BASE_URL}}/en/pricing</loc>
    <xhtml:link rel="alternate" hreflang="en" href="{{BASE_URL}}/en/pricing" />
    <xhtml:link rel="alternate" hreflang="es" href="{{BASE_URL}}/es/pricing" />
    <xhtml:link rel="alternate" hreflang="de" href="{{BASE_URL}}/de/pricing" />
    <xhtml:link rel="alternate" hreflang="fr" href="{{BASE_URL}}/fr/pricing" />
    <xhtml:link rel="alternate" hreflang="x-default" href="{{BASE_URL}}/en/pricing" />
  </url>
  <url>
    <loc>{{BASE_URL}}/es/pricing</loc>
    <xhtml:link rel="alternate" hreflang="en" href="{{BASE_URL}}/en/pricing" />
    <xhtml:link rel="alternate" hreflang="es" href="{{BASE_URL}}/es/pricing" />
    <xhtml:link rel="alternate" hreflang="de" href="{{BASE_URL}}/de/pricing" />
    <xhtml:link rel="alternate" hreflang="fr" href="{{BASE_URL}}/fr/pricing" />
    <xhtml:link rel="alternate" hreflang="x-default" href="{{BASE_URL}}/en/pricing" />
  </url>
  <!-- Repeat for /de/pricing, /fr/pricing -->
</urlset>
```

**When to use:** Sites with hundreds or thousands of pages per language. Keeps HTML clean. Easiest for CMS-driven sites where sitemap generation is automated.

### Which Method to Choose

| Factor | HTML `<head>` | HTTP Headers | XML Sitemap |
|--------|--------------|-------------|-------------|
| **Pages per language** | < 50 | Any | 50+ |
| **Content type** | HTML pages | Non-HTML files | HTML pages |
| **HTML payload impact** | Grows with language count | None | None |
| **Debugging ease** | Easy (view source) | Medium (need headers tool) | Medium (check sitemap file) |
| **CMS support** | Most CMSs | Requires server config | Most CMSs via plugins |
| **Recommended** | Small sites | PDF/file localization | Large sites |

You can combine methods — Google will consolidate the signals. But do not declare conflicting hreflang across methods.

---

## Hreflang Debugging

Hreflang errors are silent — Google does not report them in Search Console (beyond generic "no return tag" warnings). You must proactively validate.

### Common Hreflang Errors

| Error | What Happens | How to Detect | How to Fix |
|-------|-------------|---------------|------------|
| **Missing return tag** | Page A declares Page B, but Page B does not declare Page A | Crawl both pages and compare hreflang sets | Ensure every page in the set references every other page including itself |
| **Self-referencing tag missing** | Page does not include an hreflang pointing to itself | Check each page for a self-referencing hreflang | Add `<link rel="alternate" hreflang="[lang]" href="[self-URL]" />` |
| **Wrong language code** | Using non-ISO codes like `uk` instead of `en-GB` or `jp` instead of `ja` | Validate codes against ISO 639-1 / ISO 3166-1 | Replace with correct ISO codes |
| **Canonical conflict** | Hreflang points to URL A but canonical points to URL B | Compare canonical and hreflang targets | Hreflang href and canonical href should resolve to the same URL for each language |
| **Non-200 hreflang targets** | Hreflang points to a 301/302/404/410 page | Crawl all hreflang target URLs and check status codes | Update hreflang to point to final-destination URLs (status 200) |
| **Mixed protocols** | Some hreflang URLs use `http://`, others use `https://` | Compare all URLs in the set | Standardize all hreflang URLs to `https://` (or whichever is canonical) |
| **Trailing slash inconsistency** | `/en/pricing` vs `/en/pricing/` treated as different URLs | Compare URL formatting across hreflang tags | Standardize trailing slash usage and ensure consistency |
| **x-default missing** | No fallback for users whose language/region is not covered | Check for presence of `x-default` in every hreflang set | Add `x-default` pointing to your language selector or primary language version |
| **Partial sets** | Some pages have hreflang for 3 languages but others only declare 2 | Crawl entire site and compare set sizes | Ensure every page in the set declares the complete set |

### Validation Tools

| Tool | Type | What It Checks |
|------|------|----------------|
| **Ahrefs Site Audit** | Crawl-based | Hreflang errors across entire site, missing return tags, conflicts |
| **Screaming Frog** | Crawl-based | Hreflang validation, missing self-reference, non-200 targets |
| **Merkle Hreflang Tag Testing Tool** | Page-level | Validates a single page's hreflang implementation |
| **hreflang.org validator** | Sitemap-based | Validates hreflang in XML sitemaps |
| **Google Search Console** | Index-level | "No return tag" and "unknown language code" errors (limited coverage) |
| **Sitebulb** | Crawl-based | Visual hreflang cluster analysis, orphaned pages |

### Hreflang Validation Checklist

- [ ] Every page includes a self-referencing hreflang tag
- [ ] Every hreflang set is complete — all pages reference all other pages in the set
- [ ] All return tags are present (bidirectional requirement verified)
- [ ] All language codes are valid ISO 639-1 codes
- [ ] All region codes are valid ISO 3166-1 Alpha-2 codes
- [ ] `x-default` is present in every set
- [ ] All hreflang target URLs return HTTP 200
- [ ] All hreflang target URLs use the same protocol (https)
- [ ] Hreflang URLs match canonical URLs (no conflicts)
- [ ] Trailing slash usage is consistent across all hreflang URLs
- [ ] No duplicate hreflang tags on any page
- [ ] Hreflang is implemented using only one method (or consistent across methods)

---

## Geo-Targeting in Google Search Console

Google Search Console allows you to set a target country for subdomains and subdirectories (but not ccTLDs — those are automatically geo-targeted by their TLD).

### How to Set Geo-Targeting

1. Add each subdirectory or subdomain as a separate property in GSC
   - `{{BASE_URL}}/es/` as a URL-prefix property
   - `{{BASE_URL}}/de/` as a URL-prefix property
2. Go to Settings > International Targeting > Country
3. Select the target country for that property

### Geo-Targeting Guidance

| URL Structure | GSC Geo-Targeting |
|--------------|-------------------|
| `{{BASE_URL}}/en/` | Set to United States (or leave unset for global English) |
| `{{BASE_URL}}/es/` | Set to Spain (for Spain Spanish) or leave unset (for global Spanish) |
| `{{BASE_URL}}/es-mx/` | Set to Mexico |
| `{{BASE_URL}}/de/` | Set to Germany |
| `example.de` (ccTLD) | Automatic — cannot override |
| `de.example.com` (subdomain) | Set to Germany |

**Important:** If your Spanish content targets all Spanish-speaking countries (not just Spain), do NOT set a country target. Geo-targeting narrows visibility — it tells Google "this content is specifically for users in [country]." Use it only when the content is genuinely country-specific.

---

## Content Localization vs Translation

Translation converts words from one language to another. Localization adapts the entire experience — content, examples, tone, references, imagery, units, legal requirements — for a specific market. Localization is dramatically more effective for SEO because it produces content that resonates with local search behavior.

### Translation vs Localization Comparison

| Dimension | Translation | Localization |
|-----------|-------------|-------------|
| **Process** | Convert text word-by-word or sentence-by-sentence | Adapt content for cultural context, market conditions, and local preferences |
| **Keywords** | Translated from source language | Researched independently in target language |
| **Examples** | Same examples as source | Market-specific examples (local companies, local regulations, local prices) |
| **Tone** | Matches source | Adapted to local communication norms (formal vs informal varies by market) |
| **Images** | Same images | Culturally appropriate images, local people, local contexts |
| **Legal/compliance** | Not adapted | Adapted for local regulations (GDPR for EU, specific disclaimers per country) |
| **Currency/pricing** | Converted | Localized with market-appropriate pricing and local payment methods |
| **CTAs** | Translated | Adapted (different markets respond to different CTA styles) |
| **SEO impact** | Moderate (at least it is in the right language) | High (matches local search behavior, cultural expectations, and keyword patterns) |

### Localization Checklist per Market

For each target market in {{TARGET_MARKETS}}:

- [ ] Keyword research conducted in the local language by a native speaker (not translated from English)
- [ ] Content adapted for local context (examples, case studies, references)
- [ ] Tone adjusted for local communication norms
- [ ] Images reviewed for cultural appropriateness
- [ ] Currency, date format, and number format localized
- [ ] Legal disclaimers and privacy policies adapted for local regulations
- [ ] CTAs tested for local conversion effectiveness
- [ ] Local social proof included (testimonials from local customers, local awards)
- [ ] Payment methods reflect local preferences (e.g., iDEAL in Netherlands, Boleto in Brazil)
- [ ] Customer support availability and language options communicated

---

## Multilingual Keyword Research

The most critical mistake in international SEO is translating keywords instead of researching them. Direct translation fails because different languages and cultures describe concepts differently.

### Why Translation Fails

| English Keyword | Naive Translation (Spanish) | What People Actually Search (Spanish) |
|----------------|---------------------------|---------------------------------------|
| "cheap flights" | "vuelos baratos" | "vuelos baratos" (this one happens to work) |
| "cell phone" | "teléfono celular" | "móvil" (Spain), "celular" (Latin America) |
| "apartment for rent" | "apartamento en alquiler" | "piso en alquiler" (Spain), "departamento en renta" (Mexico) |
| "lawyer" | "abogado" | "abogado" (generic), "letrado" (formal Spain), "licenciado" (Mexico) |
| "sneakers" | "zapatillas de deporte" | "zapatillas" (Spain), "tenis" (Mexico), "championes" (Uruguay) |

The same language in different countries uses different words for the same concepts. Spanish in Spain, Mexico, Argentina, and Colombia are linguistically the same language but are different keyword markets.

### Multilingual Keyword Research Process

**Step 1: Start with intent, not translation**

Instead of translating "project management software," ask: "What would a German-speaking person type into Google when looking for a tool to manage their projects?" The answer might be "Projektmanagement Software" (direct translation) or it might be "Aufgabenverwaltung Tool" (task management tool) or "Projektplanung online" (project planning online).

**Step 2: Use local-language keyword tools**

| Tool | Language/Market Coverage | Approach |
|------|------------------------|----------|
| **Google Keyword Planner** | All languages, set country filter | Change location and language settings per market |
| **Ahrefs** | All languages, filter by country | Use Keywords Explorer with country filter |
| **Semrush** | All languages, filter by country | Keyword Magic Tool with country database |
| **Google Suggest** | All languages | Type seed terms in the target language with Google set to the target country |
| **Google Trends** | All languages, by country | Compare search interest across regions |
| **Answer the Public** | Limited language support | Good for question-based queries in supported languages |
| **Also Asked** | Limited language support | People Also Ask data in supported languages |

**Step 3: Validate with a native speaker**

No tool replaces a native speaker who understands both the language and the local market. Have native speakers:
- Review the keyword list for naturalness
- Identify colloquial terms that tools miss
- Flag formal vs informal register issues
- Add slang and regional variations

**Step 4: Map keyword intent per market**

The same product may have different search intent patterns in different markets. In the US, people search for "CRM software" (category). In Germany, they might search for "Kundenverwaltung" (customer management) — a functional description rather than a category name.

### Keyword Research Template per Market

```
MARKET: [Country/Language]
TARGET LANGUAGE: {{SECONDARY_LANGUAGES}} item
NATIVE SPEAKER REVIEWER: [Name]

SEED TERMS (from English strategy, for reference only — DO NOT translate):
  1. ________________
  2. ________________
  3. ________________

LOCAL KEYWORD DISCOVERY:
  Method: Google Suggest in [language] with [country] settings
  Results:
    Keyword (local language) | Monthly Volume | Difficulty | Intent | English Equivalent
    ________________________|_______________|___________|________|___________________
    ________________________|_______________|___________|________|___________________
    ________________________|_______________|___________|________|___________________

NATIVE SPEAKER NOTES:
  Regional variations: ________________
  Formal vs informal: ________________
  Terms to avoid: ________________
  Colloquial alternatives: ________________
```

---

## International Link Building

Links from websites in your target country carry more local relevance than links from other countries. A backlink from a `.de` German news site is more valuable for your German SEO than a backlink from a US tech blog, even if the US blog has higher domain authority.

### Country-Specific Link Building Strategies

| Strategy | Effort | Impact | How |
|----------|--------|--------|-----|
| **Local directories** | Low | Medium | Submit to country-specific business directories (equivalent of Yelp, Yellow Pages in each market) |
| **Local industry associations** | Medium | High | Join industry bodies in each target country. Membership directories provide localized backlinks. |
| **Local press/PR** | High | Very high | Pitch stories to journalists in each target country. Local news links are extremely valuable. |
| **Local partnerships** | Medium | High | Partner with businesses in target countries for co-marketing, guest content, and resource sharing |
| **Local content creation** | Medium | Medium | Create content specifically for local audiences (local case studies, market reports, local event coverage) |
| **Local sponsorships** | Medium | High | Sponsor events, conferences, or organizations in target markets |
| **Translated/localized linkable assets** | Medium | High | Create tools, calculators, or research reports localized for each market |
| **Guest posting on local blogs** | Medium | Medium | Write for blogs and publications in the target language |
| **Local university partnerships** | Medium | High | Academic partnerships in target countries yield .edu-equivalent links |

### Key Directories by Market

| Market | Key Directories |
|--------|----------------|
| **UK** | Yell.com, Thomson Local, Scoot, Cylex UK, 192.com |
| **Germany** | Das Telefonbuch, Gelbe Seiten, GoLocal, Branchenbuch, Meinestadt.de |
| **France** | Pages Jaunes, Yelp France, Kompass, SocieteInfo |
| **Spain** | Páginas Amarillas, QDQ, Infobel, Vulka |
| **Netherlands** | Gouden Gids, Telefoonboek, Yelp NL, Detelefoongids |
| **Japan** | iTownPage, Yahoo! Japan Local, Ekiten, Hot Pepper |
| **Brazil** | TeleListas, Apontador, Kekanto, Guia Mais |
| **Australia** | Yellow Pages AU, True Local, Hotfrog AU, StartLocal |
| **Canada** | Yellow Pages CA, Canada411, Yelp Canada, BBB Canada |
| **India** | Justdial, Sulekha, IndiaMART, TradeIndia |

---

## CDN and Server Location

Server location affects page load time for users in different regions, and page speed is a ranking factor. While modern CDNs have largely eliminated this concern, there are still considerations.

### CDN Configuration for International Sites

| Approach | When to Use | Setup |
|----------|-------------|-------|
| **Global CDN (Cloudflare, Fastly, AWS CloudFront)** | Most sites. Recommended default. | Configure edge locations in all target markets. Serves cached content from the nearest PoP. |
| **Regional hosting + CDN** | When data residency laws require content to be stored in specific countries | Host the origin server in the primary market. Use CDN for all markets. Add regional origins only where legally required. |
| **Multi-region origin** | Enterprise sites with very high traffic per market | Deploy separate origin servers per region. Route traffic via CDN or load balancer. Most complex and expensive. |

### Performance Targets by Market

Test page speed from locations in each target market using:
- Google PageSpeed Insights (change test location)
- WebPageTest.org (select test location by city)
- GTmetrix (select test location)

```
INTERNATIONAL PERFORMANCE BASELINE
─────────────────────────────────

Target: All markets should achieve LCP < 2.5s, INP < 200ms, CLS < 0.1

Market          | Test Location    | LCP    | INP    | CLS   | Status
________________|__________________|________|________|_______|________
{{TARGET_MARKETS}} item 1 |               |        |        |       |
{{TARGET_MARKETS}} item 2 |               |        |        |       |
{{TARGET_MARKETS}} item 3 |               |        |        |       |
```

---

## Currency, Date, and Number Localization

These details seem minor but they significantly impact user trust and conversion. Showing "$" to a German user or formatting dates as MM/DD/YYYY for a European audience creates friction that drives users back to search results.

### Format Differences by Region

| Region | Currency | Date Format | Number (1,234.56) | Measurement |
|--------|----------|-------------|-------------------|-------------|
| **US** | $1,234.56 | MM/DD/YYYY | 1,234.56 | Imperial (miles, pounds, Fahrenheit) |
| **UK** | £1,234.56 | DD/MM/YYYY | 1,234.56 | Mixed (miles for distance, kg for weight, Celsius) |
| **Germany** | 1.234,56 € | DD.MM.YYYY | 1.234,56 | Metric |
| **France** | 1 234,56 € | DD/MM/YYYY | 1 234,56 | Metric |
| **Japan** | ¥1,234 | YYYY/MM/DD | 1,234 | Metric |
| **Brazil** | R$ 1.234,56 | DD/MM/YYYY | 1.234,56 | Metric |
| **India** | ₹1,23,456.78 | DD/MM/YYYY | 1,23,456.78 (lakhs/crores) | Metric |
| **China** | ¥1,234.56 | YYYY-MM-DD | 1,234.56 | Metric |
| **South Korea** | ₩1,234 | YYYY.MM.DD | 1,234 | Metric |
| **Australia** | $1,234.56 | DD/MM/YYYY | 1,234.56 | Metric |

### Implementation Approach

Use the `Intl` API in JavaScript for automatic localization:

```typescript
// Format currency for different locales
function formatCurrency(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

formatCurrency(1234.56, 'en-US', 'USD');  // "$1,234.56"
formatCurrency(1234.56, 'de-DE', 'EUR');  // "1.234,56 €"
formatCurrency(1234.56, 'ja-JP', 'JPY');  // "￥1,235"

// Format dates for different locales
function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

formatDate(new Date('2025-03-15'), 'en-US');  // "March 15, 2025"
formatDate(new Date('2025-03-15'), 'de-DE');  // "15. März 2025"
formatDate(new Date('2025-03-15'), 'ja-JP');  // "2025年3月15日"
```

### Localization Audit Checklist

For each market in {{TARGET_MARKETS}}:

- [ ] Currency symbol and formatting matches local convention
- [ ] Date format matches local convention
- [ ] Number formatting (decimal separator, thousands separator) matches local convention
- [ ] Measurement units match local convention (metric vs imperial)
- [ ] Phone number format includes correct country code
- [ ] Address format matches local convention (order of fields varies by country)
- [ ] Payment methods include local options
- [ ] Legal pages (privacy, terms) reference local regulations

---

## International SERP Differences

Google dominates search in most markets, but not all. Optimizing for local search engines in certain markets is not optional — it is the only way to reach the majority of searchers.

### Search Engine Market Share by Country

| Country | Primary Search Engine | Market Share | Secondary Engines |
|---------|---------------------|-------------|-------------------|
| **US** | Google | ~88% | Bing (~7%), Yahoo (~3%) |
| **UK** | Google | ~92% | Bing (~5%) |
| **Germany** | Google | ~91% | Bing (~5%) |
| **France** | Google | ~91% | Bing (~4%) |
| **Japan** | Google | ~76% | Yahoo Japan (~15%) |
| **South Korea** | Naver | ~55% | Google (~33%), Daum (~5%) |
| **China** | Baidu | ~60% | Sogou (~15%), Bing (~10%), 360 Search (~5%) |
| **Russia** | Yandex | ~55% | Google (~42%) |
| **Czech Republic** | Google | ~80% | Seznam (~12%) |

### Optimizing for Non-Google Search Engines

#### Baidu (China)

| Factor | Baidu Requirement |
|--------|-------------------|
| **Hosting** | Must be hosted in China or Hong Kong for reasonable crawl speed. Chinese ICP license required for `.cn` hosting. |
| **Language** | Simplified Chinese only. Traditional Chinese is not the same market. |
| **Content** | Baidu heavily favors Baidu-ecosystem content (Baidu Baike, Baidu Zhidao). |
| **JavaScript** | Baidu's JavaScript rendering is significantly worse than Google's. Server-side render everything. |
| **Meta tags** | Baidu uses `<meta name="keywords">` — unlike Google, it still considers meta keywords. |
| **Backlinks** | Links from Chinese websites (.cn, .com.cn) carry outsized weight. |
| **Verification** | Submit to Baidu Webmaster Tools (ziyuan.baidu.com). |
| **Speed** | Chinese Great Firewall adds latency for non-Chinese-hosted sites. CDN alone is insufficient. |

#### Yandex (Russia)

| Factor | Yandex Requirement |
|--------|-------------------|
| **Language** | Russian content required. Yandex understands Russian morphology deeply. |
| **Regional targeting** | Yandex has a strong concept of "regionality." Set your region in Yandex Webmaster. |
| **Behavioral factors** | Yandex weighs user behavioral signals (bounce rate, time on site, CTR) more heavily than Google. |
| **Meta keywords** | Yandex still considers `<meta name="keywords">`. |
| **Verification** | Submit to Yandex Webmaster (webmaster.yandex.com). |
| **Turbo Pages** | Yandex's equivalent of AMP — fast-loading pages for mobile. |
| **Commercial intent** | Yandex classifies queries as "commercial" and applies different ranking factors. |

#### Naver (South Korea)

| Factor | Naver Requirement |
|--------|-------------------|
| **Content format** | Naver prioritizes its own ecosystem: Naver Blog, Naver Cafe (forums), Naver Knowledge iN (Q&A). |
| **Naver Blog** | Creating and maintaining a Naver Blog is essential for Korean SEO. It ranks in Naver search results. |
| **Search structure** | Naver SERP is divided into "sections" — blog section, cafe section, news section, shopping section. Each section has its own ranking algorithm. |
| **Verification** | Submit to Naver Webmaster Tools (searchadvisor.naver.com). |
| **Korean content** | Korean-language content is mandatory. Naver does not rank non-Korean content. |
| **Naver Smart Store** | For e-commerce in Korea, Naver Smart Store is the dominant marketplace. |

### International SEO Checklist Summary

For each market in {{TARGET_MARKETS}}:

- [ ] URL structure implemented (subdirectory/subdomain/ccTLD)
- [ ] Hreflang tags implemented and validated (zero errors)
- [ ] Geo-targeting set in Google Search Console (if applicable)
- [ ] Content localized (not just translated) by native speaker
- [ ] Keywords researched in target language (not translated from English)
- [ ] Local link building strategy in place
- [ ] CDN configured with edge locations in target market
- [ ] Currency, date, and number formats localized
- [ ] Non-Google search engines addressed (if applicable: Baidu, Yandex, Naver)
- [ ] Local search engine webmaster tools configured
- [ ] Performance tested from locations in target market
- [ ] Legal/privacy pages adapted for local regulations

---

## Cross-References

- **Technical SEO checklist**: `36-seo/technical/technical-seo-checklist.md`
- **Robots, sitemaps, and canonicals**: `36-seo/technical/robots-sitemap-canonical.md`
- **Structured data**: `36-seo/technical/structured-data-cookbook.md`
- **Content SEO strategy**: `36-seo/content-seo/`
- **Core Web Vitals optimization**: `36-seo/technical/core-web-vitals-playbook.md`
- **Overall SEO strategy**: `36-seo/strategy/seo-strategy.template.md`
- **Tech stack SEO (rendering strategies)**: `36-seo/specialized/tech-stack-seo.md`
