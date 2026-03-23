# SEO Maturity Assessment

> Use this assessment to determine your SEO maturity level before working through the rest of Section 36. Your maturity level determines which templates to resolve, which infrastructure to build, and which specialized domains to invest in. A pre-launch startup with five pages does not need international hreflang configuration and crawl budget analysis — and an established site with 500 indexed pages cannot survive on a basic technical checklist and good intentions.

---

## Step 1: Self-Assessment Questionnaire

Answer these 10 questions honestly. Each "yes" scores the points indicated. Total your score at the end.

| # | Question | Yes | No |
|---|----------|-----|----|
| 1 | Is your site live and indexed by Google (at least 1 page in Google Search Console)? | +1 | — |
| 2 | Do you have more than 10 pages indexed in search engines? | +1 | — |
| 3 | Do you receive any organic search traffic (even minimal)? | +1 | — |
| 4 | Do you have an active content publishing program (at least 2 pieces per month)? | +1 | — |
| 5 | Do you have more than 100 pages indexed in search engines? | +2 | — |
| 6 | Do you track keyword rankings systematically (not just checking manually)? | +1 | — |
| 7 | Do you have at least one person spending 10+ hours/week on SEO? | +2 | — |
| 8 | Do you operate in multiple geographic markets or languages? | +1 | — |
| 9 | Does organic search represent more than 20% of your total traffic? | +2 | — |
| 10 | Do you have an e-commerce component with product listings? | +1 | — |

**Your score: ____**

---

## Step 2: Determine Your Tier

```
Score: 0–1
→ TIER 1: PRE-LAUNCH / NO SEO

Score: 2–4
→ TIER 2: FOUNDATION

Score: 5–8
→ TIER 3: GROWTH

Score: 9+
→ TIER 4: ENTERPRISE
```

If you are uncertain between two tiers, read both tier definitions below and select the one that more closely matches your situation. When in doubt, take the lower tier — under-building SEO infrastructure is cheaper to correct than over-building, because unused SEO templates cost only reading time, while premature optimization costs engineering cycles.

---

## Tier Definitions

### Tier 1: Pre-Launch / No SEO

**Profile:** Solo founder or small team, pre-MVP or just launched, no content program, fewer than 10 pages, no organic traffic to speak of. The product may not even have a public-facing marketing site yet. SEO is not yet a priority, but the technical foundation should not actively sabotage future discoverability.

**Resolve these files:**
- [ ] `technical/technical-seo-checklist.template.md` — resolve the basics only (meta tags, mobile viewport, HTTPS, page speed). This ensures your initial pages are not actively blocking crawlers or failing Core Web Vitals.
- [ ] `on-page/on-page-seo-checklist.template.md` — resolve for your existing pages. Even five pages should have proper titles, descriptions, and heading structure.
- [ ] `technical/robots-sitemap-canonical.template.md` — configure robots.txt to not block crawlers, generate a basic XML sitemap, and set canonical URLs. This takes 15 minutes and prevents the most common pre-launch SEO mistakes.

**Skip everything else.** At this stage, keyword research, link building, content SEO, AI search optimization, international SEO, and measurement infrastructure are premature. Your three resolved files ensure that when you are ready for SEO, you are not starting from a technically broken foundation.

**What this looks like in practice:** You have a landing page and maybe a few product pages. Googlebot can crawl them, they have proper meta tags, and your robots.txt is not accidentally blocking your entire site. That is sufficient.

**Time estimate:** 30–45 minutes

---

### Tier 2: Foundation

**Profile:** Live product with a public-facing site, basic pages (homepage, pricing, about, a few feature pages), starting to think about content as a growth channel. May have a blog with a handful of posts. Little to no systematic SEO work done. Organic traffic exists but is incidental rather than intentional.

**Resolve these files:**
- [ ] Everything in Tier 1
- [ ] `strategy/seo-strategy.template.md` — define your SEO goals, target audience, and competitive positioning
- [ ] `strategy/keyword-research-methodology.template.md` — build an initial keyword universe for your core product area
- [ ] `technical/structured-data-guide.template.md` — implement Organization, BreadcrumbList, and your primary content type schema
- [ ] `technical/core-web-vitals-optimization.template.md` — optimize for LCP, INP, and CLS
- [ ] `technical/url-architecture.template.md` — establish URL conventions before you have too many pages to restructure
- [ ] `on-page/image-and-media-seo.template.md` — optimize images across existing pages
- [ ] `measurement/seo-kpi-dashboard.template.md` — establish baseline metrics
- [ ] `testing/seo-regression-testing.template.md` — add basic SEO checks to your deployment pipeline
- [ ] `gotchas/seo-gotchas.md` — skim for anti-patterns relevant to your stack and framework

**Skip:** International SEO (unless you are already multi-market), e-commerce SEO (unless you have product listings), AI search optimization (focus on traditional search first), log file analysis, crawl budget optimization (irrelevant under 100 pages), link building (build content first), content decay monitoring (you need content before it can decay), site migration planning.

**What this looks like in practice:** You have keyword targets for your core pages, proper structured data, passing Core Web Vitals, SEO regression tests in CI, and a monthly check on Google Search Console. You are not yet producing content at scale, but the content you do have is technically sound and discoverable.

**Time estimate:** 1.5–2 hours

---

### Tier 3: Growth

**Profile:** Active content program producing multiple pieces per month, 10+ pages indexed with some organic traffic, beginning to invest in SEO as a deliberate growth channel. May have a content team or a marketer spending significant time on content. Keyword tracking is established or being established. Organic traffic is growing but not yet a dominant channel.

**Resolve these files:**
- [ ] Everything in Tier 2
- [ ] `strategy/search-intent-mapping.template.md` — map intent for all target keywords
- [ ] `strategy/topic-cluster-architecture.template.md` — design pillar-cluster content model
- [ ] `strategy/competitive-seo-analysis.template.md` — analyze competitor SEO positioning
- [ ] `technical/javascript-seo.template.md` — resolve if using a JavaScript framework (React, Vue, Angular, Svelte)
- [ ] `on-page/content-optimization-framework.template.md` — systematic content scoring and optimization
- [ ] `on-page/internal-linking-strategy.template.md` — design internal link architecture
- [ ] `off-page/link-building-strategy.template.md` — define link acquisition methodology
- [ ] `off-page/digital-pr-playbook.template.md` — plan data-driven PR campaigns
- [ ] `off-page/brand-mentions-and-unlinked.template.md` — set up brand mention monitoring
- [ ] `content-seo/content-gap-analysis.template.md` — identify missing keyword coverage
- [ ] `content-seo/featured-snippet-optimization.template.md` — target featured snippets for high-value queries
- [ ] `content-seo/content-decay-monitoring.template.md` — monitor existing content for performance decline
- [ ] `measurement/rank-tracking-setup.template.md` — configure systematic keyword tracking
- [ ] `measurement/seo-reporting-cadence.template.md` — establish reporting rhythm
- [ ] `testing/seo-ab-testing-framework.template.md` — begin SEO split testing
- [ ] `incident/seo-incident-response.template.md` — build your ranking drop playbook
- [ ] `audit/seo-audit-template.template.md` — conduct your first full-site SEO audit

**Skip:** International SEO (unless you are actively targeting multiple markets), advanced log file analysis (defer until 100+ pages), crawl budget optimization (not a constraint under a few hundred pages), e-commerce SEO (unless applicable), site migration planning (unless a migration is imminent).

**What this looks like in practice:** You have a documented SEO strategy, active keyword tracking, a topic cluster content model driving your editorial calendar, link building outreach running monthly, and quarterly SEO audits identifying opportunities and regressions. Organic traffic is a KPI that gets reported to leadership.

**Time estimate:** 3–4 hours

---

### Tier 4: Enterprise

**Profile:** Established domain with 100+ indexed pages, dedicated SEO resource (in-house or agency), organic search as a significant traffic and revenue channel. May operate across multiple markets, languages, or product lines. Complex technical requirements — faceted navigation, large-scale content operations, migration planning, compliance with multiple search engine guidelines.

**Resolve these files:**
- [ ] Everything in Tier 3
- [ ] `technical/crawl-budget-optimization.template.md` — optimize crawl budget allocation across a large site
- [ ] `technical/log-file-analysis.template.md` — parse server logs for Googlebot behavior analysis
- [ ] `off-page/backlink-audit-and-disavow.template.md` — audit backlink profile and manage disavow file
- [ ] `content-seo/content-pruning-strategy.template.md` — identify and handle thin, duplicate, or outdated content
- [ ] `specialized/international-seo.template.md` — resolve if operating in multiple markets or languages
- [ ] `specialized/ecommerce-seo.template.md` — resolve if you have product listings or catalog pages
- [ ] `specialized/local-seo.template.md` — resolve if you have physical locations or local service areas
- [ ] `specialized/video-seo.template.md` — resolve if video content is a significant part of your strategy
- [ ] `ai-seo/ai-search-optimization.template.md` — optimize for AI Overviews, ChatGPT, Perplexity citations
- [ ] `ai-seo/llm-content-strategy.template.md` — structure content for LLM consumption
- [ ] `ai-seo/generative-engine-optimization.template.md` — implement GEO methodology
- [ ] `incident/negative-seo-defense.template.md` — set up negative SEO detection and defense
- [ ] `migration/site-migration-seo-plan.template.md` — resolve if a migration is planned or foreseeable

**What this looks like in practice:** You have a comprehensive SEO operation — technical monitoring, content production at scale, active link building, AI search optimization, and incident response playbooks ready to deploy. SEO is embedded in your engineering workflow (regression tests block deploys that break SEO), your content workflow (every piece is optimized before publish), and your executive reporting (organic traffic and revenue are board-level metrics flowing through Section 35's BI pipeline).

**Time estimate:** 5–7 hours

---

## File Prioritization Matrix

This table shows every file in Section 36 and the recommended action at each maturity tier.

| File | Pre-Launch | Foundation | Growth | Enterprise |
|------|------------|------------|--------|------------|
| `seo-maturity-assessment.md` | Read | Read | Read | Read |
| `strategy/seo-strategy.template.md` | — | Resolve | Resolve | Resolve |
| `strategy/keyword-research-methodology.template.md` | — | Resolve | Resolve | Resolve |
| `strategy/topic-cluster-architecture.template.md` | — | — | Resolve | Resolve |
| `strategy/search-intent-mapping.template.md` | — | — | Resolve | Resolve |
| `strategy/competitive-seo-analysis.template.md` | — | — | Resolve | Resolve |
| `technical/technical-seo-checklist.template.md` | Resolve (basics) | Resolve | Resolve | Resolve |
| `technical/robots-sitemap-canonical.template.md` | Resolve | Resolve | Resolve | Resolve |
| `technical/structured-data-guide.template.md` | — | Resolve | Resolve | Resolve |
| `technical/core-web-vitals-optimization.template.md` | — | Resolve | Resolve | Resolve |
| `technical/javascript-seo.template.md` | — | — | Resolve (if JS framework) | Resolve |
| `technical/crawl-budget-optimization.template.md` | — | — | — | Resolve |
| `technical/url-architecture.template.md` | — | Resolve | Resolve | Resolve |
| `technical/log-file-analysis.template.md` | — | — | — | Resolve |
| `on-page/on-page-seo-checklist.template.md` | Resolve | Resolve | Resolve | Resolve |
| `on-page/content-optimization-framework.template.md` | — | — | Resolve | Resolve |
| `on-page/image-and-media-seo.template.md` | — | Resolve | Resolve | Resolve |
| `on-page/internal-linking-strategy.template.md` | — | — | Resolve | Resolve |
| `off-page/link-building-strategy.template.md` | — | — | Resolve | Resolve |
| `off-page/backlink-audit-and-disavow.template.md` | — | — | — | Resolve |
| `off-page/brand-mentions-and-unlinked.template.md` | — | — | Resolve | Resolve |
| `off-page/digital-pr-playbook.template.md` | — | — | Resolve | Resolve |
| `content-seo/content-gap-analysis.template.md` | — | — | Resolve | Resolve |
| `content-seo/content-decay-monitoring.template.md` | — | — | Resolve | Resolve |
| `content-seo/content-pruning-strategy.template.md` | — | — | — | Resolve |
| `content-seo/featured-snippet-optimization.template.md` | — | — | Resolve | Resolve |
| `specialized/international-seo.template.md` | — | — | — | Resolve (if multi-market) |
| `specialized/ecommerce-seo.template.md` | — | — | — | Resolve (if e-commerce) |
| `specialized/local-seo.template.md` | — | — | — | Resolve (if local) |
| `specialized/video-seo.template.md` | — | — | — | Resolve (if video) |
| `ai-seo/ai-search-optimization.template.md` | — | — | — | Resolve |
| `ai-seo/llm-content-strategy.template.md` | — | — | — | Resolve |
| `ai-seo/generative-engine-optimization.template.md` | — | — | — | Resolve |
| `measurement/seo-kpi-dashboard.template.md` | — | Resolve | Resolve | Resolve |
| `measurement/rank-tracking-setup.template.md` | — | — | Resolve | Resolve |
| `measurement/seo-reporting-cadence.template.md` | — | — | Resolve | Resolve |
| `testing/seo-ab-testing-framework.template.md` | — | — | Resolve | Resolve |
| `testing/seo-regression-testing.template.md` | — | Resolve | Resolve | Resolve |
| `incident/seo-incident-response.template.md` | — | — | Resolve | Resolve |
| `incident/negative-seo-defense.template.md` | — | — | — | Resolve |
| `migration/site-migration-seo-plan.template.md` | — | — | — | Resolve (if migration planned) |
| `audit/seo-audit-template.template.md` | — | — | Resolve | Resolve |
| `gotchas/seo-gotchas.md` | — | Skim | Read | Study |

**Legend:**
- **—** = Skip entirely at this tier
- **Read** = Read for awareness, do not resolve placeholders
- **Skim** = Scan headings and anti-patterns relevant to your stack
- **Study** = Read thoroughly and apply lessons to your implementation
- **Resolve** = Complete the full template with all placeholders and checklists
- **Resolve (basics)** = Resolve core sections only, skip advanced configurations
- **Resolve (if ...)** = Resolve only if the condition applies to your project

---

## What to Skip (and Why)

Skipping files is not laziness — it is resource allocation. Every file you resolve costs time to complete and maintain. Resolving files you do not need creates documentation debt that goes stale and erodes trust in the kit.

**Tier 1 skips and rationale:**
- **All strategy files** — You do not have enough content or traffic data to inform a strategy. Strategy without data is guessing.
- **All off-page files** — Link building requires content worth linking to. Build that first.
- **All content SEO files** — You need content before you can optimize, audit, or prune it.
- **All specialized files** — International, e-commerce, local, and video SEO are vertical extensions of a foundation you have not built yet.
- **All AI SEO files** — AI search optimization layers on top of traditional SEO fundamentals. Get the fundamentals first.
- **All measurement files** — You do not have enough traffic to generate meaningful SEO metrics. Google Search Console alone is sufficient at this stage.

**Tier 2 skips and rationale:**
- **Topic clusters and intent mapping** — These require a content program that does not exist yet. Build your keyword universe first; structure it into clusters when you have 10+ content pieces planned.
- **Link building and digital PR** — Premature without content assets to promote and earn links for.
- **Crawl budget and log analysis** — Irrelevant with fewer than 100 pages. Google will crawl your entire site daily without optimization.
- **Content decay and pruning** — You do not have enough content history for decay to be a factor.
- **Specialized verticals** — Unless your product is already multi-market, e-commerce, or local, these are future concerns.

**Tier 3 skips and rationale:**
- **Crawl budget and log analysis** — Still unlikely to be a constraint under a few hundred pages, unless you have complex faceted navigation or large parameter spaces.
- **International SEO** — Only relevant if you are actively targeting multiple markets. Planning hreflang for a single-market product is waste.
- **Content pruning** — Usually becomes relevant at 100+ pages. Before that, you are still building, not pruning.

**Tier 4 skips:**
- **None.** At enterprise scale, every file in this section is potentially relevant. Use the conditional notes in the prioritization matrix (e.g., "if e-commerce," "if migration planned") to determine which specialized files apply.

---

## Growth Triggers: When to Move to the Next Tier

### Tier 1 → Tier 2
Move up when any of the following occur:
- Your site goes live with a public-facing domain and you intend to attract organic traffic
- You publish your first blog post or content page beyond the core product pages
- You set up Google Search Console and see impressions (even if clicks are near zero)
- A competitor appears in search results for queries related to your product

### Tier 2 → Tier 3
Move up when any of the following occur:
- You commit to a regular content publishing cadence (at least 2 pieces per month)
- Organic traffic exceeds 500 sessions per month
- You have 10+ pages indexed and want to grow organic as a deliberate channel
- You hire or allocate someone to spend 10+ hours per week on content and SEO
- A competitor's content consistently outranks yours for target keywords

### Tier 3 → Tier 4
Move up when any of the following occur:
- You exceed 100 indexed pages
- Organic search represents more than 20% of total traffic or revenue
- You hire a dedicated SEO specialist or engage an SEO agency
- You plan to expand into additional markets, languages, or product lines
- A site migration (domain change, platform change, URL restructure) is planned
- Organic traffic exceeds 10,000 sessions per month
- You need to defend against negative SEO or have experienced a significant ranking drop

---

## Reassessment Triggers

Reassess your maturity level when any of the following occur:

- Organic traffic drops more than 20% in a single month without a known cause
- You launch a major site redesign, platform migration, or URL restructure
- Google announces a core algorithm update that affects your vertical
- You expand into a new geographic market or language
- You add an e-commerce component to a previously non-transactional site
- A competitor makes a significant SEO investment (visible in their content output or backlink growth)
- You receive a manual action notice in Google Search Console
- Your Core Web Vitals scores fail after a deployment
- AI search surfaces (Google AI Overviews, ChatGPT) begin answering queries in your target keyword space
- You onboard a new SEO team member or agency and need to establish a shared baseline

SEO maturity is not a one-time assessment. Review quarterly during hardening (Steps 29–34) and upgrade your tier as your organic presence grows. The cost of under-investment compounds — every month you operate without proper technical SEO foundations, the remediation effort grows as more pages inherit the same structural problems.
