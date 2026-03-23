# Self-Service Knowledge Center — Portal Architecture

> **{{PROJECT_NAME}}** — Design the complete self-service experience from portal architecture to content lifecycle to analytics.
>
> Owner: {{CX_LEAD}} | Last updated: {{LAST_UPDATED}}
> Status: {{DOCUMENT_STATUS}}

---

## Overview

This document is the **end-to-end blueprint** for a self-service knowledge center that actually deflects tickets, ranks in search engines, and continuously improves. It covers the full portal experience — the container that holds your knowledge base articles — including information architecture, search UX, content lifecycle management, analytics instrumentation, SEO, internationalization, and the operational processes that keep it all alive.

**Cross-reference:** For KB article category structure, article templates, and writing style guides, see `{{KIT_ROOT}}/23-customer-support/knowledge-base-architecture.template.md`. This document covers the **portal itself** — the product that wraps those articles into a usable, measurable, search-optimized self-service experience.

**What this document covers:**

- Portal page hierarchy and URL architecture
- Navigation patterns and technology selection
- Information architecture (category taxonomy, tagging, content relationships)
- Search UX design (autocomplete, relevance tuning, zero-result handling)
- Content lifecycle management (creation workflow, review cadence, deprecation)
- Analytics dashboard specification (search analytics, article performance, content health)
- SEO strategy for help content (structured data, indexing, meta optimization)
- Mobile-responsive and in-app help center design
- Internationalization architecture and translation workflow
- Accessibility compliance for help content
- Self-service deflection measurement and optimization
- Chatbot-to-KB handoff integration
- Content governance and ownership model
- Implementation checklist with phased rollout

**What this document does NOT cover:**

- Individual article writing (see `{{KIT_ROOT}}/23-customer-support/knowledge-base-architecture.template.md`)
- AI chatbot architecture (see `{{KIT_ROOT}}/33-customer-experience-ops/ai-support-chatbot-blueprint.template.md`)
- Support platform selection (see `{{KIT_ROOT}}/23-customer-support/support-platform-decision-tree.md`)
- Support escalation workflows (see `{{KIT_ROOT}}/23-customer-support/support-escalation-workflow.md`)
- General UX patterns and design system (see `{{KIT_ROOT}}/07-ui-design-system/`)

---

## Help Center Portal Architecture

### Page Hierarchy

Every help center has exactly five core page types. Resist adding more — every additional page type increases maintenance burden and dilutes navigation clarity.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HELP CENTER HOMEPAGE                         │
│                                                                     │
│  ┌───────────────┐  ┌───────────────────────────────────────────┐  │
│  │  Search Bar    │  │  Announcements / Alerts Banner            │  │
│  │  (prominent,   │  │  (product incidents, planned maintenance) │  │
│  │   centered)    │  │                                           │  │
│  └───────────────┘  └───────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Category │ │ Category │ │ Category │ │ Category │  ...          │
│  │  Card 1  │ │  Card 2  │ │  Card 3  │ │  Card 4  │  (max 7)    │
│  │ icon +   │ │ icon +   │ │ icon +   │ │ icon +   │              │
│  │ subtitle │ │ subtitle │ │ subtitle │ │ subtitle │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                     │
│  ┌───────────────────────────┐  ┌───────────────────────────────┐  │
│  │  Popular Articles          │  │  Recently Updated              │  │
│  │  1. How to reset password  │  │  1. New billing dashboard      │  │
│  │  2. Connect integration    │  │  2. Updated API rate limits    │  │
│  │  3. Cancel subscription    │  │  3. Mobile app v3.2 changes   │  │
│  │  4. Export data             │  │  4. SSO setup guide           │  │
│  │  5. Invite team members    │  │  5. Webhook configuration     │  │
│  └───────────────────────────┘  └───────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  "Still need help? Contact Support →"  (persistent CTA)       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Homepage:** Category overview (icon + title + article count), prominent search bar, popular articles (top 5 by views this week), announcements banner (critical only — incidents, breaking changes), "Recently Updated" section.

**Category pages:** Article listing sorted by popularity (default) with toggles for alphabetical and recency. Subcategory navigation in left sidebar. Category description at top (2-3 sentences max). "Most helpful" badge on top-rated articles.

**Article pages:** Content body, table of contents (auto-generated from H2/H3 headings), "Was this article helpful?" widget, related articles sidebar (3-5 articles), breadcrumb trail, "Last updated" timestamp, "Still need help?" CTA at bottom, print-friendly styling.

**Search results page:** Relevance-sorted results, highlighted query snippets, category breadcrumb per result, faceted filters (category, date range, content type), article freshness indicator, zero-results fallback with contact CTA.

**Contact/escalation page:** The safety net when self-service fails. Short triage form, expected response time, alternative channels (chat, email, phone if available), FAQ links for common issues that might prevent the ticket.

### URL Structure

Clean, predictable, human-readable URLs are non-negotiable. They affect SEO, shareability, and debugging.

```
{{KB_URL}}/                              → Help center homepage
{{KB_URL}}/categories/:slug              → Category page
{{KB_URL}}/categories/:slug/:sub-slug    → Subcategory page (max 1 level deep)
{{KB_URL}}/articles/:slug                → Individual article
{{KB_URL}}/search?q=:query               → Search results
{{KB_URL}}/search?q=:query&cat=:slug     → Filtered search results
{{KB_URL}}/contact                       → Contact/escalation page
{{KB_URL}}/changelog                     → Product changelog
{{KB_URL}}/status                        → Service status page (or redirect to {{STATUS_PAGE_URL}})
{{KB_URL}}/sitemap.xml                   → Auto-generated sitemap
```

**URL rules:**

1. Use slugs derived from article titles, not IDs (e.g., `/articles/reset-password` not `/articles/12345`)
2. All lowercase, hyphens only (no underscores, no camelCase)
3. Maximum 5 path segments
4. Once published, URLs NEVER change — use 301 redirects if restructuring
5. Trailing slash policy: pick one (with or without) and enforce it via redirect
6. Query parameters for search only — never for content navigation

### Navigation Patterns

Navigation should make every article reachable in 3 clicks or less from the homepage, while search should surface any article in under 5 seconds.

| Element | Placement | Behavior |
|---|---|---|
| **Search bar** | Top of every page, persistent | Autocomplete on type, recent searches on focus |
| **Breadcrumb trail** | Below header, above content | Home > Category > Subcategory > Article |
| **Sidebar navigation** | Left side on category + article pages | Collapsible category tree, current page highlighted |
| **Related articles** | Right sidebar or bottom of article page | 3-5 articles, mix of algorithmic + manually curated |
| **"Still need help?" CTA** | Bottom of every article, persistent footer | Links to contact page with article context pre-filled |
| **Recently viewed** | Homepage sidebar or dropdown | Last 5 articles from user session (cookie-based) |
| **Back to top** | Floating button on long articles | Appears after 500px scroll |
| **Language selector** | Header, top-right | Persistent, remembers preference in cookie/localStorage |
| **Changelog link** | Footer or homepage section | Links to product changelog for "what's new" context |

### Technology Decision Tree

Choose your help center platform based on these criteria. Do not default to "build from scratch" — the maintenance burden of a custom help center is consistently underestimated.

| If... | Then consider... | Why |
|---|---|---|
| Using {{SUPPORT_PLATFORM}} with built-in KB | Platform's native help center (Zendesk Guide, Intercom Articles, Freshdesk KB, Help Scout Docs) | Tight integration with ticket system, agent-facing KB, built-in analytics |
| Need full design control + own the data | Static site generator (Docusaurus, Nextra, Mintlify) with headless CMS | Complete branding control, git-based workflow, fast page loads |
| Need i18n support as a first-class feature | Zendesk Guide (native i18n), Crowdin + SSG, or Phrase + custom build | Translation management is complex — use a platform that handles it natively |
| Developer documentation portal | Mintlify, ReadMe, Docusaurus, GitBook | API reference rendering, code samples, versioning |
| Budget-constrained (< $100/mo) | Notion + Super.so, GitBook free tier, or plain Docusaurus on Vercel | Good enough to start; migrate when you outgrow it |
| Enterprise with compliance requirements | Zendesk Guide, Salesforce Knowledge, ServiceNow | Audit trails, access control, compliance certifications |
| Need both customer-facing + internal KB | Separate instances (public help center + internal wiki) | Internal docs have different access patterns, search, and governance |

**The "build vs. buy" trap:** Teams consistently underestimate the effort of maintaining a custom help center. Search alone (autocomplete, relevance tuning, synonym management, typo tolerance) is a multi-month project. Start with a platform. Only build custom when you have a dedicated help center engineering team AND a specific need that no platform satisfies.

### Platform Configuration: {{SUPPORT_PLATFORM}}

If using a support platform's built-in knowledge base:

| Setting | Value | Rationale |
|---|---|---|
| Custom domain | `{{KB_URL}}` | SEO authority, brand trust |
| Theme | Custom CSS matching {{PROJECT_NAME}} brand | Consistent brand experience |
| Header/footer | Match main website navigation | Users should not feel like they left the product |
| Search | Enable autocomplete, configure synonyms | Core self-service UX |
| Community features | {{CX_COMMUNITY_ENABLED}} | Only enable if you have resources to moderate |
| Agent-facing KB | Enabled | Support agents use the same articles to answer tickets |
| Content security | {{CX_KB_AUTH_REQUIRED}} | Public by default; gated for product-specific content if needed |

---

## Information Architecture

### Category Taxonomy Design

Design categories based on **user mental models**, not product architecture. Users think in terms of "what they want to do," not "which microservice handles it." Every category taxonomy failure traces back to organizing content around internal product structure instead of user intent.

**Taxonomy design principles:**

1. **Maximum 7 top-level categories** — cognitive load research (Miller's Law) shows 7 plus or minus 2 is the limit for comfortable processing. Aim for 5-7.
2. **Maximum 3 levels of nesting** — Top > Subcategory > Article. If you need a fourth level, your taxonomy is too granular.
3. **Category names must be action-oriented** — "Getting Started" not "Introduction." "Managing Your Account" not "Account." "Integrations & Connections" not "API."
4. **Each article belongs to exactly ONE primary category** — No duplicates across categories. Use cross-linking instead.
5. **Every category must contain at least 3 articles** — If a category has fewer, merge it into a sibling category.
6. **Alphabetical order within categories is lazy** — Sort by popularity (most viewed first) or by logical workflow order (do this, then this, then this).

**Recommended starter taxonomy for {{PROJECT_NAME}}:**

```
1. Getting Started                    → Onboarding, setup, first steps
   ├── Account Setup                  → Sign up, verify email, profile
   ├── Quick Start Guide              → First meaningful action in 5 min
   └── Platform Overview              → Core concepts, navigation tour

2. {{CX_CATEGORY_2}}                  → Core feature area #1
   ├── [Sub-feature A]
   ├── [Sub-feature B]
   └── [Sub-feature C]

3. {{CX_CATEGORY_3}}                  → Core feature area #2
   ├── [Sub-feature A]
   ├── [Sub-feature B]
   └── [Sub-feature C]

4. {{CX_CATEGORY_4}}                  → Core feature area #3 (if applicable)

5. Billing & Subscription             → Plans, payments, invoices, cancellation
   ├── Plans & Pricing
   ├── Payment Methods
   ├── Invoices & Receipts
   └── Cancel / Downgrade

6. Integrations & API                 → Third-party connections, API docs
   ├── Native Integrations
   ├── API Reference
   └── Webhooks

7. Troubleshooting & FAQ              → Common issues, error messages, FAQ
   ├── Common Issues
   ├── Error Messages
   └── FAQ
```

### Tagging System

Tags supplement categories. They enable faceted search and power content recommendations. Do not over-tag — each article should have 3-6 tags total.

| Tag Type | Purpose | Examples |
|---|---|---|
| **Feature area** | Matches product navigation | `dashboard`, `reports`, `settings`, `api` |
| **User role** | Personalizes content for different users | `admin`, `member`, `developer`, `billing-admin` |
| **Difficulty level** | Helps users find appropriate content | `beginner`, `intermediate`, `advanced` |
| **Content type** | Distinguishes article formats | `how-to`, `troubleshooting`, `reference`, `tutorial`, `faq` |
| **Platform** | Filters by access method | `web`, `mobile-ios`, `mobile-android`, `api`, `desktop` |
| **Auto-tags** (system) | Generated automatically | `last-updated:2024-01`, `version:3.2`, `has-video`, `has-screenshots` |

**Tagging governance rules:**

- Maintain a controlled vocabulary — authors pick from a defined list, they do not create tags ad hoc
- Review tag usage quarterly — merge tags with < 5 articles, split tags with > 50 articles
- Never use tags to replicate category structure (if a tag matches a category name, the tag is redundant)

### Content Relationships & Linking Strategy

Articles do not exist in isolation. The linking strategy determines whether a user finds their answer in one visit or abandons after hitting a dead end.

| Link Type | When to Use | Format |
|---|---|---|
| **Prerequisite** | Article assumes knowledge from another article | "Before you start, make sure you've [set up your account](link)." — placed at the very top |
| **Related articles** | Content that supplements current article | Sidebar widget: "Related Articles" — 3-5 links, mix of auto-generated and manually curated |
| **Series/sequence** | Multi-step workflows | Sequential navigation: "← Previous: Step 2 | Step 3 of 5 | Next: Step 4 →" |
| **See also** | Cross-category connections | Inline callout: "See also: [Managing team permissions](link) for admin-specific steps." |
| **Troubleshooting** | Every how-to should link to its troubleshooting counterpart | Bottom of article: "Having issues? See [Troubleshooting: Feature X](link)." |
| **Escalation** | When self-service is insufficient | "If this doesn't resolve your issue, [contact support](link) and reference article #{{ARTICLE_ID}}." |
| **API reference** | UI articles that have an API equivalent | Callout: "You can also do this via the API. See [API: Create Widget](link)." |

**Linking rules:**

1. Every article must link to at least 2 other articles (no orphan pages)
2. Every how-to article must link to its troubleshooting counterpart (and vice versa)
3. Links must use descriptive anchor text (never "click here" or "learn more")
4. Broken link checks run weekly via automated scan
5. When an article is archived, all inbound links must be updated within 48 hours

---

## Search UX Design

Search is the most critical feature of your help center. Over 60% of users go directly to search rather than browsing categories. If search is broken, your help center is broken.

### Search Bar Specification

| Property | Specification |
|---|---|
| **Placement (homepage)** | Centered, above the fold, minimum 600px wide on desktop |
| **Placement (inner pages)** | Persistent in header, minimum 400px wide, expandable on focus |
| **Placeholder text** | "Search for help with..." (action-oriented, not "Search...") |
| **Autocomplete** | Suggest articles as user types, debounced at 200ms, show top 5 matches |
| **Recent searches** | Show user's last 5 searches on focus (stored in localStorage) |
| **Popular searches** | Show top 10 trending queries this week (below recent searches) |
| **Keyboard shortcut** | `/` or `Cmd+K` focuses search bar (developer-friendly convention) |
| **Mobile** | Full-width, sticky at top, magnifying glass icon expands to full bar |

### Search Algorithm Requirements

Do not build search from scratch. Use a proven search engine (Algolia, Elasticsearch, Meilisearch, Typesense, or your platform's built-in search) and configure it properly.

**Relevance scoring weights:**

| Match Location | Weight | Rationale |
|---|---|---|
| Title exact match | 10x | Highest signal — user searched for exactly this topic |
| Title partial match | 5x | Strong signal — topic is in the title |
| H2/H3 heading match | 3x | Section-level relevance |
| Body text match | 1x | Baseline relevance |
| Tag match | 2x | Metadata-level relevance |
| Article helpfulness score | 1.5x boost | Promote articles that users have rated helpful |
| Recency | 1.2x boost for < 30 days | Fresh content is more likely to be accurate |

**Search features (non-negotiable):**

- **Synonym expansion:** "cancel" = "unsubscribe" = "close account" = "delete account." Maintain a synonym dictionary. Seed it from support ticket language analysis.
- **Typo tolerance:** Levenshtein distance of 2 or less. "pasword" should match "password."
- **Stemming:** "connecting" should match "connect," "connection," "connected."
- **Stop word handling:** Ignore "how," "do," "I," "the," "a" in relevance scoring but keep them for phrase matching.
- **Faceted filters:** Category, content type (how-to, troubleshooting, FAQ), date range.
- **Boost/bury controls:** Manually boost specific articles for specific queries. Bury outdated content.

### Search Results Page

```
┌──────────────────────────────────────────────────────────────────┐
│  Search: "reset password"                          [Filters ▼]  │
│                                                                  │
│  3 results found (0.12 seconds)                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  How to Reset Your Password                               │  │
│  │  Getting Started > Account Setup                          │  │
│  │  "To **reset** your **password**, go to Settings >        │  │
│  │   Security > Change **Password**..."                      │  │
│  │  👍 92% helpful  ·  Updated 3 days ago                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Troubleshooting: Password Reset Email Not Received       │  │
│  │  Troubleshooting & FAQ > Common Issues                    │  │
│  │  "If you're not receiving the **password** **reset**      │  │
│  │   email, check your spam folder..."                       │  │
│  │  👍 78% helpful  ·  Updated 2 weeks ago                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Security Settings & Two-Factor Authentication            │  │
│  │  Getting Started > Account Setup                          │  │
│  │  "Manage your account security including **password**     │  │
│  │   policies and 2FA configuration..."                      │  │
│  │  👍 85% helpful  ·  Updated 1 month ago                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ────────────────────────────────────────────────────────────    │
│  Can't find what you're looking for? [Contact Support →]        │
└──────────────────────────────────────────────────────────────────┘
```

### Zero-Results Handling

Zero-result pages are the most important page in your help center. Every zero-result query is a **content gap signal** — a user came looking for help and left empty-handed. This is where ticket deflection fails.

**Zero-results page must include:**

1. Spell correction suggestion: "Did you mean: [corrected query]?"
2. Category recommendations based on partial keyword match
3. Top 5 most popular articles (fallback content)
4. Direct link to contact support with the failed query pre-filled: "Can't find what you're looking for? [Contact us about '{{query}}'](link)"
5. A hidden feedback mechanism: log the query, timestamp, and user context

**CRITICAL: Log every zero-result query.** This is your number one content gap signal. Review zero-result queries weekly and create articles for recurring queries.

**Zero-result query review process:**

| Frequency | Action |
|---|---|
| Daily (automated) | Log zero-result queries to analytics dashboard |
| Weekly | Review top 10 zero-result queries by frequency |
| Weekly | For each recurring query: either create a new article, add synonyms to existing article, or improve article titles/content |
| Monthly | Trend analysis: are zero-result rates improving? (Target: < 5%) |

---

## Content Lifecycle Management

### Article Creation Workflow

Articles are not blog posts — they require accuracy review from product/engineering, style review from the content team, and ongoing maintenance. Every article without an owner will rot.

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  TRIGGER │────▶│  DRAFT   │────▶│  REVIEW  │────▶│ PUBLISH  │────▶│ MONITOR  │
│          │     │          │     │          │     │          │     │          │
│ • New    │     │ Author   │     │ Accuracy │     │ Live w/  │     │ Track:   │
│   feature│     │ writes   │     │ review   │     │ "New"    │     │ • Views  │
│ • Ticket │     │ using    │     │ (eng) +  │     │ badge    │     │ • Rating │
│   pattern│     │ template │     │ Style    │     │ (7 days) │     │ • Tickets│
│ • Search │     │          │     │ review   │     │          │     │ • Search │
│   gap    │     │          │     │ (content)│     │          │     │   rank   │
│ • Feature│     │          │     │          │     │          │     │          │
│   change │     │          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                                         │
                                                                         ▼
                                                                    ┌──────────┐
                                                                    │ ITERATE  │
                                                                    │          │
                                                                    │ Update   │
                                                                    │ based on │
                                                                    │ feedback │
                                                                    │ data     │
                                                                    └──────────┘
```

**Stage details:**

| Stage | Owner | Duration | Exit Criteria |
|---|---|---|---|
| **Trigger** | Anyone (support agent, PM, customer, search analytics) | Immediate | Filed in content backlog with priority |
| **Draft** | {{CX_KB_AUTHOR_ROLE}} | 1-3 business days | Article follows template from `23-customer-support/knowledge-base-architecture.template.md`, screenshots current, steps verified |
| **Accuracy review** | Product/engineering SME | 1-2 business days | Technical accuracy confirmed, edge cases documented |
| **Style review** | {{CX_CONTENT_REVIEWER}} | 1 business day | Tone matches brand voice, formatting consistent, links valid |
| **Publish** | Author (self-serve after reviews pass) | Same day | Article visible, "New" badge applied, cross-links added |
| **Monitor** | Author (ongoing) | 30-day initial period | Views > {{CX_KB_MIN_VIEWS}}, helpfulness > 70%, related ticket volume decreasing |
| **Iterate** | Author | As needed | Article updated based on helpfulness feedback, support ticket patterns, search query data |

### Content Priority Matrix

Not all articles are equal. Prioritize based on impact.

| Priority | Criteria | Target Turnaround |
|---|---|---|
| **P0 — Critical** | Blocking issue, no workaround, high ticket volume (> {{CX_P0_TICKET_THRESHOLD}} tickets/week) | Same day |
| **P1 — High** | Common question (> {{CX_P1_TICKET_THRESHOLD}} tickets/week), new feature launch, pricing/billing changes | 2 business days |
| **P2 — Medium** | Moderate ticket volume, feature enhancement, integration guides | 1 week |
| **P3 — Low** | Edge cases, rarely asked questions, nice-to-have improvements | 2 weeks |
| **P4 — Backlog** | Content ideas, proactive documentation, SEO gap fills | Next sprint |

### Scheduled Review Cadence

Every article must be reviewed on a recurring schedule. Unreviewed articles become liabilities — inaccurate help content is worse than no help content because it wastes user time and erodes trust.

| Content Type | Review Frequency | Trigger for Immediate Review | Assigned Reviewer |
|---|---|---|---|
| Getting Started / Onboarding | {{CX_KB_REVIEW_CADENCE}} | Product UI changes, onboarding flow changes | {{CX_ONBOARDING_OWNER}} |
| Feature How-To articles | {{CX_KB_REVIEW_CADENCE}} | Feature update, redesign, or deprecation | Feature PM or designated author |
| Billing / Pricing | Monthly | ANY pricing change, plan restructuring, payment provider change | {{CX_BILLING_CONTENT_OWNER}} |
| API Reference | Every release cycle | API breaking changes, new endpoints, deprecation notices | {{CX_API_DOCS_OWNER}} |
| Troubleshooting guides | {{CX_KB_REVIEW_CADENCE}} | New bug patterns in support tickets, platform changes | Support lead + engineering |
| Integration guides | Quarterly | Third-party API changes, new integration launches | Integration PM |
| Legal/Compliance content | Quarterly | Policy changes, regulatory updates | Legal team |
| Product changelog | Continuous | Every release | PM team |

### Content Deprecation Process

Old content that lingers without updates does more damage than no content. Deprecation is not deletion — it is a structured transition that preserves URLs and redirects users to current information.

**Deprecation protocol:**

1. **Flag for review:** Content identified as potentially outdated (automated staleness alert, support agent report, or user feedback)
2. **Add "Under Review" banner:** Visible to readers: "This article is being reviewed for accuracy. Last verified: [date]. If you notice outdated information, [let us know](link)."
3. **Determine action:**
   - Feature still exists but article is outdated → **Update article** with current information, remove banner
   - Feature was redesigned → **Rewrite article**, keep same URL, add "Updated for [version]" note
   - Feature was removed, replacement exists → **Redirect (301)** to replacement article
   - Feature was removed, no replacement → **Archive** with message: "This feature is no longer available as of [date]. [Learn about alternatives](link)."
4. **NEVER return a 404 for a help article URL.** Users bookmark articles, support agents share links in tickets, and Google has indexed the URL. Always redirect or display a helpful archive message.
5. **Update cross-links:** Within 48 hours of deprecation, update all articles that link to the deprecated content.
6. **Notify stakeholders:** If the article was high-traffic (top 20%), notify the support team that it has been deprecated/redirected.

### Version History & Audit Trail

Every article edit must be tracked. This is not optional — it is required for content accountability, regulatory compliance (for billing/legal content), and rollback capability.

| Field | Description |
|---|---|
| **Version number** | Auto-incremented on each publish |
| **Author** | Who made the change |
| **Timestamp** | When the change was published |
| **Change summary** | Required text field: what changed and why |
| **Diff** | Machine-generated diff of content changes |
| **Review status** | Whether the change went through peer review |
| **Rollback** | One-click rollback to any previous version |

---

## Knowledge Base Analytics Dashboard

### Dashboard Architecture

Analytics is not a nice-to-have — it is the operational backbone that tells you whether your help center is actually deflecting tickets or just existing. Instrument from day one, not "when we get around to it."

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KB ANALYTICS DASHBOARD                            │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  SEARCH          │  │  ARTICLES        │  │  CONTENT HEALTH    │  │
│  │  ANALYTICS       │  │  PERFORMANCE     │  │                    │  │
│  │                  │  │                  │  │  Stale: X articles │  │
│  │  Searches: X/wk  │  │  Views: X/wk     │  │  Low-rated: X      │  │
│  │  Zero-result: X% │  │  Helpful: X%     │  │  Missing: X gaps   │  │
│  │  Top queries     │  │  Deflection: X%  │  │  Orphaned: X       │  │
│  │  Gap signals     │  │  Bounce: X%      │  │                    │  │
│  └─────────────────┘  └─────────────────┘  └────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  DEFLECTION FUNNEL                                           │    │
│  │                                                              │    │
│  │  Visited Help Center ──▶ Searched ──▶ Viewed Article ──▶     │    │
│  │  Rated Helpful ──▶ Did NOT create ticket = DEFLECTED         │    │
│  │                                                              │    │
│  │  OR                                                          │    │
│  │                                                              │    │
│  │  Visited Help Center ──▶ Searched ──▶ No results ──▶         │    │
│  │  Created ticket = FAILED DEFLECTION                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Metrics — Search Analytics

| Metric | Definition | Target | How to Measure |
|---|---|---|---|
| **Search volume** | Total searches per week | Trend tracking | Search engine analytics |
| **Zero-result rate** | % of searches returning no results | < 5% | Log zero-result events / total searches |
| **Top zero-result queries** | Most frequent failed searches | Review weekly | Ranked list from search logs |
| **Search-to-click rate** | % of searches where user clicks a result | > 60% | Click event / search event |
| **Search-to-contact rate** | % of users who searched, found nothing, and contacted support | < 15% | Session tracking: search → contact form |
| **Search refinement rate** | % of searches where user modifies query and searches again | < 30% | Sequential search events in same session |
| **Average position of clicked result** | Where in results the user clicked | Position 1-3 | Click position tracking |

### Key Metrics — Article Performance

| Metric | Definition | Target | Action if Off-Target |
|---|---|---|---|
| **Helpfulness rating** | % of "Yes" votes on "Was this helpful?" | > 70% | Rewrite articles below 50%; review articles below 70% |
| **View count** | Page views per article per month | Trend tracking | Low-view articles may need better titles, tags, or cross-links |
| **Time on page** | Average time readers spend on article | 1-5 min sweet spot | < 30 sec = not helpful or too short; > 7 min = too complex, break it up |
| **Bounce rate** | % of readers who leave after one article | < 40% | Improve related articles, add cross-links, improve navigation |
| **Ticket deflection rate** | % of KB visitors who did NOT create a ticket within 24 hours | > {{CX_DEFLECTION_TARGET}} | Audit low-deflection articles for completeness and accuracy |
| **Contact rate after viewing** | % of article viewers who then contact support | < 20% | Article may be incomplete or confusing; review urgently |
| **Helpfulness trend** | 3-month rolling average of helpfulness score | Improving or stable | Declining trend = article is getting stale or product has changed |

### Key Metrics — Content Health

| Metric | Definition | Target | Automation |
|---|---|---|---|
| **Stale article count** | Articles not reviewed in > {{CX_KB_REVIEW_CADENCE}} | 0 | Alert assigned reviewer |
| **Low-view articles** | Articles with < {{CX_KB_LOW_VIEW_THRESHOLD}} views in 90 days | Review quarterly | Flag for deprecation review |
| **Low-helpfulness articles** | Articles with < 50% helpfulness rating | 0 | Auto-alert author for immediate rewrite |
| **Missing articles** | Topics with zero-result searches + high ticket volume but no KB article | 0 | Weekly gap report to content team |
| **Orphan articles** | Articles with zero inbound links from other articles | 0 | Weekly scan, auto-report |
| **Broken links** | Internal links pointing to 404 or deprecated pages | 0 | Weekly automated scan |
| **Articles without owner** | Articles missing an assigned author/reviewer | 0 | Block publication without owner |

### Automated Staleness Detection

Build automated alerts — do not rely on humans remembering to check content freshness.

**Alert triggers:**

1. Article not updated in the last {{CX_KB_REVIEW_CADENCE}} → email assigned reviewer with article list
2. Product feature updated (detected via release notes, changelog, or feature flag changes) since last article edit → flag related KB articles for review
3. Helpfulness score declined by > 10 percentage points over 3 months → alert author
4. Article's related support ticket volume increased by > 25% over the past month → alert author (article may be incomplete)
5. Article has had zero views in 90 days → flag for deprecation review

**Auto-banners (added programmatically, no human action needed):**

- "Last verified: [date]" — added to every article that was reviewed but not changed
- "This article was last updated [X months] ago and may contain outdated information" — added when article exceeds review cadence
- "Updated for {{PROJECT_NAME}} v[X.Y]" — added after feature-triggered reviews

---

## SEO for Help Content

Help content is a significant organic traffic channel. Users search Google for "[product name] how to [action]" — your help center should rank for these queries.

### Technical SEO

| Element | Implementation | Notes |
|---|---|---|
| **Structured data** | FAQ schema (JSON-LD) for Q&A-format articles, HowTo schema for step-by-step guides | Test with Google Rich Results Test |
| **Canonical URLs** | `<link rel="canonical">` on every page; prevent duplicates across languages/versions | Canonical should point to the primary language version |
| **XML sitemap** | Auto-generated, includes all published articles, excludes drafts/archived | Submit to Google Search Console |
| **Meta descriptions** | Auto-generated from article summary (first 155 chars), manually overridable | Every article needs a unique meta description |
| **Open Graph tags** | `og:title`, `og:description`, `og:image` for social sharing | Use a branded default OG image for articles without screenshots |
| **robots.txt** | Allow all public articles, disallow search results pages and draft URLs | `Disallow: /search` to prevent search-results indexing |
| **Page speed** | Target < 2s Largest Contentful Paint (LCP) | Help pages should be FAST — no heavy JS bundles, lazy-load images |
| **Mobile-friendly** | Pass Google Mobile-Friendly Test | Critical for SEO ranking |

### Content SEO

| Element | Standard |
|---|---|
| **Title format** | "[Action verb] + [topic] \| {{PROJECT_NAME}} Help Center" |
| **H1** | Article title (exactly one H1 per page, must match `<title>`) |
| **H2/H3** | Section headers (use naturally, not keyword-stuffed) |
| **Internal linking** | Every article links to 2-5 related articles (distributes PageRank) |
| **Alt text** | Every screenshot and diagram has descriptive alt text |
| **URL slugs** | Derived from article title, lowercase, hyphenated, 3-5 words |
| **Content length** | Minimum 300 words for indexable articles (shorter content rarely ranks) |
| **Freshness signals** | Visible "Last updated" date, structured data `dateModified` |

### Indexing Strategy

| Content Type | Index? | Rationale |
|---|---|---|
| Public articles | Yes | Organic traffic acquisition, brand authority |
| Gated/authenticated articles | No (`noindex`) | Not accessible to Googlebot |
| Draft/unpublished articles | No (`noindex, nofollow`) | Not ready for users |
| Archived articles with redirect | No (301 redirect) | Pass SEO equity to replacement |
| Search results pages | No (`noindex`) | Thin content, duplicate of articles |
| Category pages | Yes | Navigation hub pages, link equity distribution |
| Contact page | Yes | Users search for "[product] contact support" |
| Multi-language content | Yes + `hreflang` tags | Each language version indexed separately |

---

## Mobile-Responsive Help Center

### Design Specifications

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Search bar** | Centered, 600px wide | Centered, full-width with padding | Full-width, sticky top |
| **Category grid** | 3-4 columns | 2 columns | 1 column, stacked cards |
| **Sidebar navigation** | Visible, left side | Collapsible, left side | Hidden, hamburger menu |
| **Article content** | Max-width 720px, centered | Max-width 720px | Full-width with 16px padding |
| **Screenshots** | Full-size | Scaled with srcset | Tap to zoom, responsive images |
| **Table of contents** | Right sidebar, sticky | Collapsible top section | Collapsible, above article |
| **"Was this helpful?"** | Inline at article bottom | Inline at article bottom | Sticky bottom bar |
| **Touch targets** | N/A | Minimum 44px | Minimum 44px (iOS HIG) |

### In-App Help vs. Web Help Center

These are not competing strategies — you need both, serving different purposes.

| Factor | In-App Help Center | Web Help Center |
|---|---|---|
| **Context** | Knows user's current screen, state, plan, account | No product context without login |
| **Authentication** | Already logged in, can show personalized content | May need login for account-specific articles |
| **SEO** | Not indexed by search engines | Indexed — drives organic traffic |
| **Maintenance** | May ship with app releases (if embedded) | Independent deployment |
| **Discoverability** | User must be in the app | Google, bookmarks, shared links |
| **Best for** | Contextual tooltips, guided walkthroughs, "?" icons next to features | Comprehensive browsing, troubleshooting, pre-purchase research |
| **Implementation** | SDK or iframe embedding (Intercom, Zendesk Web Widget) | Standalone subdomain or path |

**Recommended approach:** Deploy both. Use in-app help for contextual, screen-specific guidance (tooltip next to a confusing setting, guided walkthrough on first use). Use the web help center for comprehensive browsing, deep troubleshooting, and SEO-driven organic discovery.

**In-app integration points:**

- `?` icon next to complex UI elements → opens relevant KB article in a panel/modal
- Empty states → link to "Getting Started" articles
- Error messages → link to troubleshooting article for that specific error code
- Settings pages → link to feature configuration guides
- Onboarding checklist → each step links to its corresponding help article

**Cross-reference:** For contextual in-app help implementation details, see `contextual-in-app-help.template.md`.

---

## Internationalization (i18n)

### Translation Strategy

Translation is expensive and ongoing. Do not translate everything — translate strategically based on user language distribution and article traffic.

**Translation decision framework:**

| Criterion | Translate? | Rationale |
|---|---|---|
| Article in top 20 by views AND > 5% of users speak this language | Yes | High impact, high reach |
| Getting Started / Onboarding articles AND > 10% of users speak this language | Yes | Critical path content |
| Billing / Legal articles AND users in that locale | Yes (may be legally required) | Regulatory compliance |
| Troubleshooting for critical issues AND > 5% of users | Yes | Reduces ticket volume in that language |
| Low-traffic articles OR languages < 5% of user base | No — show English with fallback banner | Cost-benefit does not justify translation |

### Translation Workflow

```
English article          Translation            Review               Publish
reaches "stable"    ──▶  by professional   ──▶  by native speaker  ──▶  with
status (published        human translator       in-market reviewer     language
> 30 days,               (NOT machine                                  selector
helpfulness > 70%)       translation for                               update
                         customer-facing
                         content)
```

**Translation sync protocol:**

1. When English source article is updated, flag all translations as "needs review"
2. Add banner to translated versions: "The English version of this article has been updated. This translation may be slightly out of date."
3. Translation re-review must happen within {{CX_TRANSLATION_SLA}} business days
4. If translation review is not completed within SLA, automatically display English version with "translation in progress" notice

### Language-Specific Architecture

| Decision | Options | Recommendation |
|---|---|---|
| **URL structure** | Subdomain (`fr.help.example.com`) vs. path prefix (`help.example.com/fr/`) | Path prefix — simpler infrastructure, shared domain authority |
| **Language selector** | Dropdown in header | Prominent, persistent, remembers preference (cookie/localStorage) |
| **Incomplete translations** | Show nothing vs. show English fallback | Always show English fallback with banner: "This article is not yet available in [language]. Showing English version." |
| **RTL support** | CSS logical properties | Required if supporting Arabic, Hebrew, Urdu, Persian |
| **Date/number formats** | Locale-aware formatting | Use `Intl.DateTimeFormat` and `Intl.NumberFormat` |

### Supported Languages

{{CX_SUPPORTED_LANGUAGES}}

Priority order for translation:

1. {{CX_PRIMARY_LANGUAGE}} (source language — all articles authored here first)
2. {{CX_SECONDARY_LANGUAGES}} (highest user-base languages after primary)
3. Additional languages added when user base in that locale exceeds {{CX_I18N_THRESHOLD}} of total users

---

## Accessibility Compliance

Help content must be accessible to all users, including those using screen readers, keyboard navigation, or high-contrast modes. This is not optional — it is both a legal requirement (ADA, WCAG) and the right thing to do.

### WCAG 2.1 AA Requirements for Help Content

| Requirement | Implementation |
|---|---|
| **Keyboard navigation** | All interactive elements (search, filters, ratings, expandable sections) must be keyboard-accessible with visible focus indicators |
| **Screen reader compatibility** | Semantic HTML (proper heading hierarchy, `<nav>`, `<main>`, `<article>` landmarks), ARIA labels on interactive elements |
| **Color contrast** | Minimum 4.5:1 for body text, 3:1 for large text (18px+) |
| **Alt text** | Every image has descriptive alt text; decorative images use `alt=""` |
| **Link text** | Descriptive anchor text (never "click here"); links distinguish from surrounding text by more than just color |
| **Video captions** | All embedded videos have closed captions and transcripts |
| **Zoom support** | Content reflows properly up to 200% zoom without horizontal scrolling |
| **Motion** | Respect `prefers-reduced-motion` for any animations |
| **Form labels** | Search bar, feedback widgets, and contact forms have associated `<label>` elements |

---

## Chatbot-to-KB Integration

If you operate an AI support chatbot (see `ai-support-chatbot-blueprint.template.md`), it must be tightly integrated with the knowledge base.

### Integration Points

| Direction | What | How |
|---|---|---|
| **Chatbot reads KB** | Chatbot uses KB articles as its primary knowledge source (RAG retrieval) | Index articles in vector database, chunk by section, embed with article metadata |
| **Chatbot links to KB** | When chatbot answers a question, it includes a link to the source article | "Here's how to reset your password: [step summary]. For detailed instructions, see [How to Reset Your Password](link)." |
| **KB links to chatbot** | When a user's self-service search fails, offer chatbot as next step before ticket | "Can't find what you need? [Chat with our AI assistant](link) or [Contact support](link)." |
| **Chatbot feeds KB** | Questions the chatbot cannot answer become content gap signals for new articles | Log unanswered chatbot queries → weekly review → content backlog |
| **Shared analytics** | Chatbot deflection + KB deflection = total self-service deflection rate | Unified dashboard showing both channels |

### Content Synchronization

When a KB article is updated, the chatbot's knowledge must update too. Stale chatbot answers that contradict updated articles destroy user trust.

- **Sync trigger:** Article publish/update event → webhook → re-index article in vector database
- **Sync latency target:** < 15 minutes from article publish to chatbot knowledge update
- **Validation:** After re-index, run automated test queries against affected articles to verify chatbot accuracy

---

## Content Governance & Ownership Model

### RACI Matrix

| Activity | Content Team | Product/Engineering | Support Team | {{CX_KB_GOVERNANCE_OWNER}} |
|---|---|---|---|---|
| Article creation | R (Responsible) | C (Consulted) for accuracy | C (Consulted) for common issues | I (Informed) |
| Accuracy review | C | R | C | I |
| Style review | R | I | I | I |
| Publication | R | I | I | A (Accountable) |
| Staleness review | R | C | C | A |
| Deprecation | R | C | I | A |
| Taxonomy changes | C | C | C | R + A |
| Analytics review | R | I | C | A |
| Translation management | R | I | I | A |

### Content Standards Enforcement

| Standard | Enforcement Method |
|---|---|
| Article template compliance | Pre-publish checklist (automated) |
| Minimum word count (300 words) | Validation rule on publish |
| Required fields (title, category, tags, owner, summary) | Form validation |
| Screenshot freshness | Compare screenshot dates to feature update dates |
| Link validity | Weekly automated broken-link scan |
| Tone and style | Editorial review by {{CX_CONTENT_REVIEWER}} |
| Accessibility (alt text, heading hierarchy) | Automated accessibility scan on publish |

---

## Self-Service Deflection Optimization

The entire purpose of a knowledge center is to deflect tickets — enabling users to solve problems without human intervention. Measure deflection rigorously and optimize continuously.

### Deflection Measurement

**Deflection rate formula:**

```
Deflection Rate = (KB Visitors who did NOT create a ticket within 24h) / (Total KB Visitors) x 100
```

**Caveat:** Not all KB visitors came with a support question. A more accurate metric:

```
Informed Deflection Rate = (Users who searched KB AND rated article helpful AND did NOT create ticket) / (Users who searched KB) x 100
```

### Deflection Optimization Playbook

| Signal | Diagnosis | Action |
|---|---|---|
| High search volume, low click-through | Search results are not relevant | Tune relevance scoring, add synonyms, improve article titles |
| High article views, low helpfulness | Article exists but is not useful | Rewrite article, add screenshots, simplify steps, add troubleshooting section |
| High article views, high helpfulness, high ticket creation anyway | Article is helpful but incomplete — users need more | Expand article, add edge cases, add "If this doesn't work..." section |
| Zero-result queries matching ticket topics | Content gap — article does not exist | Create article immediately |
| Users viewing 3+ articles before creating ticket | Navigation/findability problem | Improve search, add cross-links, simplify taxonomy |
| High contact rate from specific categories | Entire category needs improvement | Audit all articles in category, identify patterns, rewrite |

### Deflection Targets by Maturity

| Maturity Stage | Timeline | Target Deflection Rate | Key Actions |
|---|---|---|---|
| **Launch** | Month 1-3 | 30-40% | Top 20 articles covering highest-volume ticket topics |
| **Growth** | Month 3-6 | 40-55% | Search optimization, zero-result gap filling, article quality improvements |
| **Optimization** | Month 6-12 | 55-70% | Personalization, in-app contextual help, chatbot integration |
| **Mature** | Month 12+ | {{CX_DEFLECTION_TARGET}} | Continuous improvement, proactive content, predictive gap detection |

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)

- [ ] Choose help center platform/framework using technology decision tree above
- [ ] Configure custom domain: `{{KB_URL}}`
- [ ] Design category taxonomy (5-7 categories max, 3 levels max) with {{CX_KB_GOVERNANCE_OWNER}}
- [ ] Set up article template based on `23-customer-support/knowledge-base-architecture.template.md`
- [ ] Configure tagging system with controlled vocabulary
- [ ] Set up analytics tracking (search events, page views, helpfulness ratings)

### Phase 2: Core Content (Week 2-4)

- [ ] Write first 20 articles covering top support ticket topics (prioritize by ticket volume)
- [ ] Set up "Was this helpful?" rating widget on every article
- [ ] Configure search with autocomplete, synonym dictionary, and typo tolerance
- [ ] Implement zero-result logging and alerting
- [ ] Set up breadcrumb navigation and related articles
- [ ] Create contact/escalation page with triage form
- [ ] Test all articles for accuracy with product/engineering review
- [ ] Cross-link articles (every article must link to at least 2 others)

### Phase 3: Optimization (Week 4-6)

- [ ] Configure analytics dashboard (search analytics, article performance, content health)
- [ ] Set up automated staleness detection alerts (see staleness detection section above)
- [ ] Implement SEO (structured data, XML sitemap, meta descriptions, OG tags)
- [ ] Test mobile responsiveness across devices (iOS Safari, Android Chrome, tablet)
- [ ] Run WCAG 2.1 AA accessibility audit and fix issues
- [ ] Configure content review calendar at {{CX_KB_REVIEW_CADENCE}} cadence
- [ ] Set up broken link scanner (weekly automated run)
- [ ] Train support team on article creation workflow and review process

### Phase 4: Integration (Week 6-8)

- [ ] Integrate KB with support platform ({{SUPPORT_PLATFORM}}) for agent-facing article suggestions
- [ ] Set up in-app contextual help links (see `contextual-in-app-help.template.md`)
- [ ] Connect chatbot RAG pipeline to KB articles (if applicable — see `ai-support-chatbot-blueprint.template.md`)
- [ ] Implement deflection tracking (KB visit → ticket creation correlation)
- [ ] Configure chatbot-to-KB and KB-to-chatbot handoff flows
- [ ] Set up content gap pipeline: zero-result queries + chatbot failures → content backlog

### Phase 5: Scale (Month 3+)

- [ ] Launch internationalization for top {{CX_I18N_ARTICLE_COUNT}} articles in {{CX_SECONDARY_LANGUAGES}}
- [ ] Implement personalized content recommendations (by user role, plan, usage patterns)
- [ ] Set up A/B testing for article titles, content structure, and CTA placement
- [ ] Build proactive content pipeline: create articles BEFORE features launch, not after
- [ ] Establish quarterly taxonomy review and tag governance audit
- [ ] Benchmark deflection rate against target: {{CX_DEFLECTION_TARGET}}
- [ ] Review and optimize search synonym dictionary monthly

---

## Appendix A: Placeholder Reference

| Placeholder | Description | Example Value |
|---|---|---|
| `{{PROJECT_NAME}}` | Product/company name | "Acme SaaS" |
| `{{KB_URL}}` | Help center base URL | "https://help.acme.com" |
| `{{SUPPORT_PLATFORM}}` | Support platform in use | "Zendesk" / "Intercom" / "Freshdesk" |
| `{{CX_KB_REVIEW_CADENCE}}` | How often articles are reviewed | "Quarterly" / "Every 6 weeks" |
| `{{CX_LEAD}}` | Customer experience team lead | "Jane Smith" |
| `{{CX_KB_AUTHOR_ROLE}}` | Who writes KB articles | "Support Engineers" / "Technical Writers" |
| `{{CX_CONTENT_REVIEWER}}` | Who reviews content for style | "Content Lead" |
| `{{CX_KB_GOVERNANCE_OWNER}}` | Who owns KB governance decisions | "Head of CX" |
| `{{CX_DEFLECTION_TARGET}}` | Target deflection percentage | "70%" |
| `{{CX_SUPPORTED_LANGUAGES}}` | Languages the KB supports | "English, Spanish, French, German, Japanese" |
| `{{CX_PRIMARY_LANGUAGE}}` | Source language for all content | "English" |
| `{{CX_SECONDARY_LANGUAGES}}` | Priority translation languages | "Spanish, French" |
| `{{CX_I18N_THRESHOLD}}` | User % threshold to justify new language | "5%" |
| `{{CX_I18N_ARTICLE_COUNT}}` | Number of articles to translate first | "20" |
| `{{CX_TRANSLATION_SLA}}` | Days to complete translation re-review | "5" |
| `{{CX_P0_TICKET_THRESHOLD}}` | Ticket volume for P0 priority | "50" |
| `{{CX_P1_TICKET_THRESHOLD}}` | Ticket volume for P1 priority | "20" |
| `{{CX_KB_MIN_VIEWS}}` | Minimum views expected in 30 days | "50" |
| `{{CX_KB_LOW_VIEW_THRESHOLD}}` | View count triggering deprecation review | "10" |
| `{{CX_CATEGORY_2}}` | Second top-level category name | "Dashboard & Reports" |
| `{{CX_CATEGORY_3}}` | Third top-level category name | "Team & Permissions" |
| `{{CX_CATEGORY_4}}` | Fourth top-level category name | "Automations" |
| `{{CX_KB_AUTH_REQUIRED}}` | Whether KB requires login | "No (public)" |
| `{{CX_COMMUNITY_ENABLED}}` | Whether community features are enabled | "No" |
| `{{CX_ONBOARDING_OWNER}}` | Owner of onboarding content | "Product Education Lead" |
| `{{CX_BILLING_CONTENT_OWNER}}` | Owner of billing/pricing content | "Revenue Ops Lead" |
| `{{CX_API_DOCS_OWNER}}` | Owner of API documentation | "Developer Relations Lead" |
| `{{STATUS_PAGE_URL}}` | Status page URL | "https://status.acme.com" |
| `{{KIT_ROOT}}` | Root path of the Master Starter Kit | "Master-Starter-Kit" |

---

## Appendix B: Search Synonym Dictionary Starter

Seed your search synonym dictionary with these common patterns. Expand based on actual zero-result query analysis.

| User Searches For | Should Also Match |
|---|---|
| cancel | unsubscribe, close account, delete account, end subscription, stop billing |
| password | login, sign in, credentials, can't access, locked out |
| billing | payment, invoice, charge, subscription, plan, pricing |
| delete | remove, erase, clear, destroy, get rid of |
| connect | integrate, link, sync, hook up, add |
| export | download, extract, backup, save, get data out |
| import | upload, migrate, bring in, add data |
| error | issue, problem, bug, broken, not working, doesn't work, failed |
| slow | performance, speed, loading, lag, timeout |
| team | users, members, seats, people, collaborators |
| API | developer, endpoint, webhook, REST, integration, programmatic |
| mobile | app, phone, iOS, Android, tablet |
| SSO | SAML, single sign-on, identity provider, Okta, Active Directory |
| 2FA | two-factor, MFA, multi-factor, authenticator, security code |
| upgrade | change plan, more features, premium, pro, enterprise |
| downgrade | reduce plan, fewer features, lower tier |

---

*This template is part of the {{PROJECT_NAME}} Master Starter Kit. For the full kit structure and orchestration flow, see `ORCHESTRATOR.md`.*
