# Phase 36: Search Engine Optimization

> The best SEO is invisible to users and unmistakable to crawlers. This section builds the technical foundation that makes your pages discoverable, the content architecture that makes them authoritative, the measurement framework that proves they are working, and the incident response playbook for when a rankings drop turns into a revenue crisis overnight.

---

## Why This Exists

The Master Starter Kit already touches SEO in multiple sections: content strategy and keyword intent in Section 19, code-level SEO patterns (meta tags, structured data, dynamic rendering) in Section 11, and performance benchmarks in Section 08. Each section handles a piece of SEO within its own domain. But none of them address three critical gaps:

**SEO was scattered across sections with no unified ownership.** Section 19 defined keyword strategy and content calendars. Section 11 defined the technical implementation patterns — meta tag helpers, canonical URL generation, sitemap automation, structured data components. But there was no single section that owned the full SEO lifecycle from keyword research through technical implementation through measurement through incident response. A developer looking for "how do I handle SEO for a site migration" would find nothing. A marketer looking for "how do I audit our current SEO health" would find fragments across three sections. Without a dedicated section, SEO becomes everyone's side task and nobody's responsibility — which is how you end up with a product that has excellent content and zero organic traffic because the robots.txt is blocking the entire `/app` directory.

**Critical SEO domains had no coverage at all.** The existing sections covered basics — meta tags, keywords, sitemaps. But modern SEO extends far beyond those fundamentals. AI search optimization (how your content appears in ChatGPT, Perplexity, Google AI Overviews) had no coverage. Site migration planning — one of the highest-risk SEO events, where a botched URL migration can erase years of domain authority in a weekend — had no playbook. SEO incident response (sudden ranking drops, manual penalties, algorithmic updates) had no runbook. SEO A/B testing methodology, crawl budget analysis, log file auditing, international SEO (hreflang, ccTLDs, regional content), e-commerce SEO (faceted navigation, product schema, category architecture) — none of these existed. Teams encountering these challenges had to start from scratch.

**There was no maturity model to right-size the work.** A pre-launch startup with five pages does not need international SEO, crawl budget optimization, or log file analysis. An enterprise site with 10,000 pages cannot survive on just a technical checklist and some meta tags. Without a maturity assessment, teams either under-invest (skipping technical SEO entirely because "we will do it later") or over-invest (spending weeks on hreflang implementation for a single-market product). The maturity assessment provides a clear tier system — do exactly what your current scale demands, skip what it does not, and know precisely when to level up.

This section closes all three gaps. It consolidates SEO into a single section with 13 subdirectories covering strategy, technical, on-page, off-page, content SEO, specialized verticals, AI search, measurement, testing, incident response, migration, auditing, and production gotchas.

---

## How It Integrates with the Orchestrator

This section is triggered at two points in the Orchestrator:

- **Step 22 (Website & Conversion)** triggers the SEO foundation — technical checklist, on-page basics, robots/sitemap/canonical configuration, and core structured data. These are the non-negotiable elements that must be in place before any page goes live.
- **Step 28.8 (Deep SEO Planning)** triggers the full SEO strategy — keyword research, content SEO architecture, measurement framework, link building, specialized verticals, AI search optimization, and incident response planning. This placement ensures the product, content strategy (Section 19), and competitive intelligence (Section 28) are defined before SEO strategy attempts to build on them.

**Skip condition:** `CONFIG.SEO_ENABLED == "false"`. Projects that are internal tools, B2B products with no public-facing content, or explicitly opting out of organic search skip this section entirely. The maturity assessment provides graceful degradation — even "pre-launch" projects generate a technical checklist for future reference.

**Relationship with Section 11 (New Capabilities — Code-Level SEO Patterns):** Section 11 defines the implementation primitives — the meta tag component, the canonical URL helper, the sitemap generator, the structured data renderer. Section 36 defines when and why to use those primitives, how to configure them for specific scenarios (e-commerce vs. SaaS vs. content site), and how to verify they are working correctly. Section 11 answers "how do I render a meta tag?" Section 36 answers "what should that meta tag contain, and how do I know it is helping?"

**Relationship with Section 19 (Marketing — Content Strategy):** Section 19 owns content strategy broadly — editorial calendars, content formats, distribution channels, brand voice. Section 36 owns the SEO-specific layer of content — keyword research methodology, topic cluster architecture, search intent mapping, content gap analysis, and content decay monitoring. Content strategy stays in Section 19; the SEO lens on that content lives here. When Section 19 asks "what should we write about?" Section 36 answers "what does search demand look like, and how should we structure it for crawlability and authority?"

**Relationship with Section 08 (Quality Testing — Performance):** Section 08 defines performance testing methodology and Core Web Vitals benchmarks. Section 36 consumes those benchmarks as SEO ranking factors — LCP, FID/INP, and CLS directly affect search rankings. The SEO testing framework in Section 36 references Section 08's performance baselines and adds SEO-specific performance tests (render-blocking resources, JavaScript SEO rendering, mobile usability).

**Relationship with Section 28 (Competitive Intelligence):** Section 28 defines competitive analysis frameworks. Section 36 applies those frameworks to the SEO domain — competitor keyword gap analysis, backlink profile comparison, SERP feature ownership, and content authority benchmarking. The competitive SEO data feeds directly into keyword prioritization and link building strategy.

**Relationship with Section 35 (Business Intelligence — SEO Metrics Pipeline):** Section 35 builds the data infrastructure that ingests and warehouses metrics. Section 36 defines the SEO-specific metrics (organic sessions, keyword rankings, crawl stats, backlink growth, Core Web Vitals scores) that flow into Section 35's unified metrics registry. Section 36 answers "what SEO metrics matter?" Section 35 answers "how do those metrics get into the dashboard?"

**Relationship with Section 21 (Incident Response):** Section 21 defines operational incident response — outages, security breaches, data loss. Section 36 defines SEO-specific incident patterns that mirror those operational playbooks — sudden ranking drops, Google manual actions, algorithmic penalty recovery, indexation crises, and negative SEO attacks. The incident structure (detect, triage, respond, recover, post-mortem) is borrowed from Section 21 and adapted for search-specific scenarios.

---

## Files in This Section

| File | Subdirectory | Description |
|------|--------------|-------------|
| `seo-maturity-assessment.md` | root | 4-tier maturity model and file prioritization |
| `keyword-research-methodology.md` | strategy | Keyword discovery, intent classification, difficulty assessment, prioritization scoring |
| `seo-competitive-intelligence.template.md` | strategy | Competitor keyword gaps, backlink profiles, SERP feature ownership |
| `seo-roadmap.template.md` | strategy | Quarter-by-quarter SEO execution plan with milestones and resource requirements |
| `seo-strategy.template.md` | strategy | Overall SEO strategy: goals, audience, competitive positioning |
| `topic-cluster-architecture.template.md` | strategy | Pillar-cluster content model, internal linking topology |
| `core-web-vitals-playbook.md` | technical | LCP, INP, CLS optimization playbook with performance budget allocation |
| `crawlability-indexation.md` | technical | How search engines discover, crawl, and index pages; diagnosing crawl and index failures |
| `rendering-seo.md` | technical | Rendering strategy impact on SEO: SSR, SSG, JavaScript SEO, framework-specific patterns |
| `robots-sitemap-canonical.md` | technical | robots.txt rules, XML sitemap configuration, canonical URL strategy |
| `site-architecture-for-seo.md` | technical | URL structure, hierarchy design, and site organization for crawl efficiency |
| `structured-data-cookbook.md` | technical | Schema.org markup recipes: Organization, Product, Article, FAQ, BreadcrumbList, HowTo |
| `technical-seo-checklist.md` | technical | Crawlability, indexability, site speed, mobile-first, security |
| `content-optimization-scoring.template.md` | on-page | On-page content scoring, keyword optimization, readability, E-E-A-T signals |
| `image-media-seo.md` | on-page | Image optimization, lazy loading, WebP/AVIF, video SEO, alt text strategy |
| `internal-linking-strategy.md` | on-page | Link equity distribution, orphan page detection, anchor text optimization |
| `on-page-seo-checklist.md` | on-page | Title tags, meta descriptions, headings, image alt text, internal links |
| `title-meta-optimization.md` | on-page | Title tag and meta description best practices, CTR optimization, SERP appearance |
| `brand-mentions-monitoring.md` | off-page | Brand mention monitoring, unlinked mention conversion, citation building |
| `digital-pr-strategy.template.md` | off-page | Data-driven PR campaigns, journalist outreach, linkable asset creation |
| `link-building-playbook.md` | off-page | Outreach methodology, digital PR, HARO, guest posting, resource link building |
| `content-brief.template.md` | content-seo | Structured brief grounding every content decision in SERP data and competitive analysis |
| `content-decay-refresh.md` | content-seo | Aging content detection, refresh methodology, re-promotion, and retirement decisions |
| `content-seo-scoring.md` | content-seo | Content quality signals for SEO: E-E-A-T, topical completeness, entity salience, freshness |
| `keyword-content-mapping.template.md` | content-seo | Master registry mapping every target keyword to exactly one page to prevent cannibalization |
| `ecommerce-seo.template.md` | specialized | Product schema, faceted navigation, category SEO, pagination, inventory handling |
| `international-seo.template.md` | specialized | Hreflang implementation, ccTLD vs subdirectory, regional content strategy |
| `local-seo.template.md` | specialized | Google Business Profile, local schema, NAP consistency, review management |
| `tech-stack-seo.md` | specialized | Framework-specific SEO implementation patterns: metadata, sitemaps, robots, OG images |
| `ai-search-optimization.md` | ai-seo | Optimization for AI Overviews, ChatGPT, Perplexity, Copilot citations |
| `llm-friendly-content.md` | ai-seo | Content structure for LLM consumption, entity clarity, citation-worthiness |
| `crawl-budget-log-analysis.md` | measurement | Server log parsing for Googlebot behavior, crawl efficiency, and indexation diagnostics |
| `rank-tracking-setup.md` | measurement | Keyword tracking configuration, SERP feature monitoring, competitor tracking |
| `seo-kpi-dashboard.template.md` | measurement | Core SEO metrics: organic sessions, rankings, CTR, conversions, crawl stats |
| `seo-reporting.template.md` | measurement | Monthly, quarterly, and annual reporting templates for different stakeholder audiences |
| `seo-ab-testing.md` | testing | SEO split testing methodology, statistical significance, sequential test design |
| `seo-experiment-log.template.md` | testing | Experiment tracking registry: hypotheses, results, institutional memory for SEO tests |
| `algorithm-update-playbook.md` | incident | Monitor, assess, and respond to Google algorithm updates without overreacting |
| `penalty-recovery.md` | incident | Manual action diagnosis, reconsideration requests, and penalty recovery workflows |
| `seo-incident-response.md` | incident | Ranking drop playbook, triage framework, and algorithmic update response |
| `traffic-drop-diagnosis.md` | incident | Decision tree for diagnosing organic traffic drops: measurement errors through penalties |
| `seo-migration-checklist.template.md` | migration | URL migration checklist, traffic preservation, rollback criteria |
| `url-redirect-mapping.template.md` | migration | Old-to-new URL redirect mapping for domain and path migrations |
| `monthly-audit-checklist.md` | audit | Monthly 1-2 hour SEO health check that catches problems early |
| `quarterly-deep-audit.template.md` | audit | Comprehensive quarterly SEO audit: technical, on-page, off-page, content, competitive |
| `seo-audit-generator.md` | audit | Generator that produces tailored, comprehensive SEO audit reports from project context |
| `seo-gotchas.md` | gotchas | Production anti-patterns, common mistakes, lessons learned |

---

## Reading Order

1. **`seo-maturity-assessment.md`** — Start here. Assess your SEO maturity level so you know which files to prioritize and which to defer. A pre-launch product with five pages needs a very different SEO approach than an established site with 500 pages of indexed content.
2. **`strategy/seo-strategy.template.md`** — Define your overall SEO strategy: business goals, target audience segments, competitive positioning, and resource allocation.
3. **`strategy/keyword-research-methodology.md`** — Build your keyword universe. Discovery methods, intent classification, difficulty assessment, and prioritization framework.
4. **`strategy/topic-cluster-architecture.template.md`** — Design your pillar-cluster content model and internal linking topology.
5. **`strategy/seo-competitive-intelligence.template.md`** — Analyze competitor keyword coverage, backlink profiles, and SERP feature ownership.
6. **`strategy/seo-roadmap.template.md`** — Quarter-by-quarter execution plan mapping activities and milestones to your maturity tier.
7. **`technical/technical-seo-checklist.md`** — The non-negotiable technical foundation: crawlability, indexability, mobile-first, site speed, security.
8. **`technical/robots-sitemap-canonical.md`** — Configure robots.txt, XML sitemaps, and canonical URL strategy.
9. **`technical/site-architecture-for-seo.md`** — Design your URL structure, hierarchy, and site organization for crawl efficiency.
10. **`technical/structured-data-cookbook.md`** — Implement Schema.org markup for rich results.
11. **`technical/core-web-vitals-playbook.md`** — Optimize LCP, INP, and CLS with performance budget allocation.
12. **`technical/rendering-seo.md`** — Handle rendering strategy for JavaScript-heavy applications: SSR, SSG, dynamic rendering.
13. **`technical/crawlability-indexation.md`** — Diagnose and fix crawl and indexation failures.
14. **`on-page/on-page-seo-checklist.md`** — On-page fundamentals: titles, descriptions, headings, alt text, internal links.
15. **`on-page/title-meta-optimization.md`** — Title tag and meta description best practices, CTR optimization.
16. **`on-page/content-optimization-scoring.template.md`** — Content scoring, keyword optimization, readability, and E-E-A-T signals.
17. **`on-page/image-media-seo.md`** — Image and media optimization for search performance.
18. **`on-page/internal-linking-strategy.md`** — Internal link architecture, equity distribution, and orphan page detection.
19. **`off-page/link-building-playbook.md`** — Link acquisition methodology: outreach, digital PR, resource building.
20. **`off-page/digital-pr-strategy.template.md`** — Data-driven PR campaigns and linkable asset creation.
21. **`off-page/brand-mentions-monitoring.md`** — Brand mention monitoring and unlinked mention conversion.
22. **`content-seo/keyword-content-mapping.template.md`** — Master registry mapping every target keyword to exactly one page.
23. **`content-seo/content-brief.template.md`** — Structured briefs grounding content decisions in SERP data and competitive analysis.
24. **`content-seo/content-seo-scoring.md`** — Content quality signals: E-E-A-T, topical completeness, entity salience, freshness.
25. **`content-seo/content-decay-refresh.md`** — Detect aging content and schedule refreshes before rankings erode.
26. **`specialized/international-seo.template.md`** — Hreflang, ccTLD strategy, and regional content planning.
27. **`specialized/ecommerce-seo.template.md`** — Product schema, faceted navigation, and category architecture.
28. **`specialized/local-seo.template.md`** — Google Business Profile, local schema, and NAP consistency.
29. **`specialized/tech-stack-seo.md`** — Framework-specific SEO implementation patterns and code recipes.
30. **`ai-seo/ai-search-optimization.md`** — Optimize for AI-generated search results and LLM citations.
31. **`ai-seo/llm-friendly-content.md`** — Structure content for LLM consumption and citation-worthiness.
32. **`measurement/seo-kpi-dashboard.template.md`** — Define and track core SEO metrics.
33. **`measurement/rank-tracking-setup.md`** — Configure keyword and SERP feature tracking.
34. **`measurement/seo-reporting.template.md`** — Build monthly, quarterly, and annual SEO reporting templates.
35. **`measurement/crawl-budget-log-analysis.md`** — Parse server logs to understand Googlebot behavior and optimize crawl efficiency.
36. **`testing/seo-ab-testing.md`** — Design and run SEO split tests with statistical rigor.
37. **`testing/seo-experiment-log.template.md`** — Track every SEO experiment: hypotheses, results, institutional memory.
38. **`incident/seo-incident-response.md`** — Respond to ranking drops, manual actions, and algorithmic updates.
39. **`incident/traffic-drop-diagnosis.md`** — Decision tree for diagnosing organic traffic drops systematically.
40. **`incident/algorithm-update-playbook.md`** — Monitor and respond to Google algorithm updates without overreacting.
41. **`incident/penalty-recovery.md`** — Manual action diagnosis and reconsideration request workflows.
42. **`migration/seo-migration-checklist.template.md`** — Plan and execute site migrations without losing organic traffic.
43. **`migration/url-redirect-mapping.template.md`** — Old-to-new URL redirect mapping for domain and path migrations.
44. **`audit/monthly-audit-checklist.md`** — Monthly SEO health check that catches problems early.
45. **`audit/quarterly-deep-audit.template.md`** — Conduct a comprehensive quarterly SEO audit.
46. **`audit/seo-audit-generator.md`** — Generator that produces tailored SEO audit reports from project context.
47. **`gotchas/seo-gotchas.md`** — Read last. Production anti-patterns and hard-won lessons that resonate more after you understand the full SEO framework.

---

## Quick Start Checklist

- [ ] Complete the SEO maturity self-assessment and identify your current tier
- [ ] Resolve the technical SEO checklist with your stack-specific configurations
- [ ] Configure robots.txt, XML sitemap generation, and canonical URL strategy
- [ ] Implement core structured data markup (Organization, BreadcrumbList, and your primary content type)
- [ ] Complete the on-page SEO checklist for all existing pages
- [ ] Verify Core Web Vitals pass thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Set up SEO regression testing in your CI/CD pipeline
- [ ] Define your keyword research methodology and build an initial keyword universe
- [ ] Map search intent for your top 20 target keywords
- [ ] Design your topic cluster architecture with pillar pages and supporting content
- [ ] Configure rank tracking and organic traffic monitoring
- [ ] Establish an SEO reporting cadence (weekly checks, monthly reports, quarterly strategy reviews)
- [ ] Review SEO gotchas for anti-patterns relevant to your stack

---

## Key Principles

**SEO is infrastructure, not marketing decoration.** The technical foundation — crawlability, indexability, site speed, structured data, URL architecture — is engineering work that belongs in your build process, not a marketing afterthought bolted on after launch. Teams that treat SEO as "something marketing handles" end up with a React SPA that renders beautifully for users and returns an empty `<div>` to every search crawler on the internet.

**Maturity tiers prevent overwhelm.** A five-page pre-launch site does not need crawl budget optimization, international hreflang configuration, or log file analysis. The maturity assessment exists so teams invest exactly the right amount of effort at their current scale. Doing too much too early wastes engineering cycles; doing too little too late means rebuilding foundations under a live site with traffic.

**Measure before you optimize.** SEO without measurement is superstition. Before changing a single title tag, establish your baseline: current rankings, organic traffic, crawl stats, Core Web Vitals scores, and indexation coverage. The measurement framework exists so that every SEO action can be traced to an outcome. If you cannot measure whether a change helped, you cannot justify the next one.

**Search intent outranks keyword volume.** A keyword with 50,000 monthly searches and informational intent will not convert. A keyword with 500 monthly searches and transactional intent will. The search intent mapping framework ensures every piece of content targets the right intent, in the right format, at the right stage of the buyer journey. Volume without intent is vanity; intent without volume is patience that pays compound interest.

**AI search is not replacing traditional SEO — it is adding a second game.** Google AI Overviews, ChatGPT web browsing, Perplexity citations, and Copilot answers are new surfaces where your content can appear or be invisible. The AI SEO section does not replace the technical and on-page fundamentals — it layers additional optimization for LLM consumption on top of the traditional foundation. Teams that ignore AI search will not lose overnight, but they will watch a growing share of their potential traffic answered without a click.

**SEO incidents are real incidents.** A 40% organic traffic drop after a botched migration or algorithmic update is not a "marketing problem" — it is a revenue incident with the same urgency as a production outage. The incident response playbook borrows the detect-triage-respond-recover-postmortem structure from Section 21 because SEO crises demand the same operational discipline. The difference is that recovery takes weeks or months instead of minutes, which makes prevention even more critical.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PROJECT_NAME}}` | Product or project display name | `Fleet Manager`, `Acme SaaS` |
| `{{SEO_ENABLED}}` | Whether SEO planning is active | `true`, `false` |
| `{{SEO_MATURITY_LEVEL}}` | Current SEO maturity tier | `pre-launch`, `foundation`, `growth`, `enterprise` |
| `{{DOMAIN}}` | Primary production domain | `example.com`, `app.example.com` |
| `{{RENDERING_STRATEGY}}` | Front-end rendering approach | `ssr`, `ssg`, `spa`, `hybrid`, `isr` |
| `{{FRAMEWORK}}` | Front-end framework | `next`, `nuxt`, `astro`, `remix`, `sveltekit`, `gatsby` |
| `{{CMS}}` | Content management system (if any) | `wordpress`, `contentful`, `sanity`, `strapi`, `none` |
| `{{PRIMARY_LANGUAGE}}` | Primary content language | `en`, `en-US`, `de`, `fr`, `es` |
| `{{TARGET_MARKETS}}` | Geographic markets for SEO | `["us"]`, `["us", "uk", "de"]`, `["global"]` |
| `{{SITE_TYPE}}` | Primary site classification | `saas`, `ecommerce`, `content`, `marketplace`, `documentation` |
| `{{SEO_TOOL_SUITE}}` | Primary SEO tooling platform | `ahrefs`, `semrush`, `moz`, `screaming-frog`, `sitebulb` |
| `{{RANK_TRACKER}}` | Keyword rank tracking tool | `ahrefs`, `semrush`, `accuranker`, `serpstat`, `google-search-console` |
| `{{ANALYTICS_PROVIDER}}` | Web analytics platform (from Section 11) | `google-analytics`, `posthog`, `plausible`, `fathom` |
| `{{SEARCH_CONSOLE_PROPERTY}}` | Google Search Console property type | `domain`, `url-prefix` |
| `{{SITEMAP_GENERATION}}` | How XML sitemaps are generated | `framework-builtin`, `plugin`, `custom-script`, `cms-native` |
| `{{STRUCTURED_DATA_FORMAT}}` | Structured data implementation format | `json-ld`, `microdata`, `rdfa` |
| `{{INDEXATION_STRATEGY}}` | Default page indexation approach | `index-all`, `selective`, `noindex-app-routes` |
| `{{LINK_BUILDING_APPROACH}}` | Primary link acquisition strategy | `digital-pr`, `content-marketing`, `outreach`, `product-led`, `none-yet` |
| `{{CONTENT_UPDATE_CADENCE}}` | How often content is refreshed for SEO | `weekly`, `biweekly`, `monthly`, `quarterly` |
| `{{SEO_REPORTING_CADENCE}}` | SEO reporting frequency | `weekly`, `biweekly`, `monthly` |
| `{{INTERNATIONAL_SEO}}` | Whether international SEO is needed | `true`, `false` |
| `{{ECOMMERCE_SEO}}` | Whether e-commerce SEO patterns apply | `true`, `false` |
| `{{LOCAL_SEO}}` | Whether local SEO is needed | `true`, `false` |
| `{{AI_SEARCH_OPTIMIZATION}}` | Whether to optimize for AI search surfaces | `true`, `false` |
