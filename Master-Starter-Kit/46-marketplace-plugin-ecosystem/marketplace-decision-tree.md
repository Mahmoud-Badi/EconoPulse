# Marketplace & Plugin Ecosystem — Decision Tree

> Six decision nodes that guide you from "Do we even need a marketplace?" through type selection, governance model, monetization strategy, plugin architecture, and developer program scale. Each node includes options with pros/cons tables and downstream impact analysis.

---

## How to Use This Decision Tree

Work through the nodes sequentially. Each node's output becomes an input placeholder for downstream templates. Record your decisions in the project configuration before proceeding to the architecture templates.

**Output placeholders:**
- Node 1 → `{{HAS_MARKETPLACE}}`
- Node 2 → `{{MARKETPLACE_TYPE}}`
- Node 3 → `{{MARKETPLACE_GOVERNANCE}}`
- Node 4 → `{{MARKETPLACE_MONETIZATION}}`
- Node 5 → `{{PLUGIN_ARCHITECTURE}}`
- Node 6 → `{{DEVELOPER_PROGRAM_SIZE}}`

---

## Node 1 — Do You Need a Marketplace?

Before investing in marketplace infrastructure, validate that a plugin ecosystem is the right strategic move. Not every product benefits from third-party extensibility.

### Qualifying Questions

| Question | Yes Signal | No Signal |
|---|---|---|
| Do users frequently request integrations you cannot build? | Backlog has 20+ integration requests | Users are satisfied with built-in features |
| Is your market winner-take-all or best-of-breed? | Best-of-breed — users assemble tool stacks | Winner-take-all — users want one complete solution |
| Do you have a stable, well-documented API? | API has been stable for 6+ months | API changes every release cycle |
| Can you invest in developer relations for 18+ months? | DX team budgeted, leadership committed | No dedicated DX resources planned |
| Would third-party extensions increase switching costs? | Yes — users customize deeply | No — product is used out-of-the-box |
| Is your user base large enough to attract developers? | 10,000+ active organizations | Under 1,000 organizations |

### Decision Matrix

| Score (Yes answers) | Recommendation |
|---|---|
| 5–6 | Strong marketplace candidate — proceed to Node 2 |
| 3–4 | Conditional — build a lightweight integration hub first, revisit in 6 months |
| 1–2 | Not ready — focus on core product and API stability |
| 0 | No marketplace — extensibility is not a strategic lever for this product |

### Options

#### Option A — Build a Marketplace (`{{HAS_MARKETPLACE}}` = `true`)

**Pros:**

| Benefit | Impact |
|---|---|
| Network effects compound over time | Long-term competitive moat |
| Community-built integrations reduce engineering load | 10x more integrations than internal team can build |
| Increased switching costs | Users who install 3+ plugins rarely churn |
| Revenue diversification | Platform fee creates new revenue stream |
| Ecosystem attracts enterprise buyers | "We integrate with everything" is a sales weapon |

**Cons:**

| Cost | Impact |
|---|---|
| 18–24 month investment before ecosystem flywheel spins | Significant upfront cost with delayed ROI |
| Ongoing developer relations and support burden | Requires dedicated team (3–5 people minimum) |
| Security surface area expands dramatically | Every plugin is a potential vulnerability |
| Breaking changes become politically expensive | Third parties depend on API stability |
| Quality control is never-ending | Bad plugins reflect poorly on the platform |

#### Option B — No Marketplace (`{{HAS_MARKETPLACE}}` = `false`)

Build integrations internally or use an embedded iPaaS (Workato, Tray.io, Merge.dev) for common connectors. Skip the rest of this section.

---

## Node 2 — Marketplace Type

What kind of marketplace fits your product's extensibility model? The type determines the UX patterns, review requirements, and technical architecture.

### Options

#### Option A — App Store (`{{MARKETPLACE_TYPE}}` = `app-store`)

Full applications that extend platform functionality with their own UI, data storage, and business logic. Think: Shopify App Store, Salesforce AppExchange.

**Pros:**

| Benefit | Impact |
|---|---|
| Deep extensibility — plugins can do almost anything | Attracts ambitious developers building real businesses |
| High perceived value justifies paid plugins | Monetization works naturally |
| Strong differentiation between plugins | Users can compare and choose |

**Cons:**

| Cost | Impact |
|---|---|
| Complex review process required | Each app needs security + UX review |
| High development effort for plugin authors | Barrier to entry is steep |
| Performance risk from poorly built apps | Bad apps can degrade platform experience |

**Best for:** Horizontal platforms (CRM, project management, e-commerce) where extensibility is a core value proposition.

#### Option B — Extension Gallery (`{{MARKETPLACE_TYPE}}` = `extension-gallery`)

Lightweight extensions that modify or enhance existing UI and workflows without introducing new top-level features. Think: VS Code Extensions, Chrome Web Store.

**Pros:**

| Benefit | Impact |
|---|---|
| Low barrier to entry for developers | Faster ecosystem growth |
| Simpler review process | Extensions are scoped and predictable |
| Quick install/uninstall cycle | Users experiment freely |

**Cons:**

| Cost | Impact |
|---|---|
| Limited monetization potential | Most extensions are free |
| Extensions can conflict with each other | Load order and compatibility issues |
| Harder to differentiate — many "me too" extensions | Discovery becomes cluttered |

**Best for:** Developer tools, productivity apps, and creative tools where customization is personal.

#### Option C — Integration Hub (`{{MARKETPLACE_TYPE}}` = `integration-hub`)

Connectors that sync data between your platform and third-party services. Think: Zapier, HubSpot Marketplace, Segment Integrations.

**Pros:**

| Benefit | Impact |
|---|---|
| Solves the #1 user request — "connect to X" | Immediate user value |
| Standardized connector pattern simplifies development | Faster time-to-market per integration |
| Enterprise buyers expect integration catalogs | Shortens sales cycles |

**Cons:**

| Cost | Impact |
|---|---|
| Maintenance burden grows with each connected API | Third-party API changes break connectors |
| Limited differentiation — connectors are commoditized | Hard to charge for basic integrations |
| Data sync reliability is operationally expensive | Users expect 100% uptime on syncs |

**Best for:** Data-centric platforms, marketing tools, and any product where users maintain a tool stack.

#### Option D — Theme Marketplace (`{{MARKETPLACE_TYPE}}` = `theme-marketplace`)

Visual themes, templates, and design assets that change the look and structure of the platform. Think: WordPress Theme Directory, Webflow Templates.

**Pros:**

| Benefit | Impact |
|---|---|
| Visual differentiation attracts non-technical users | Broad audience appeal |
| High monetization potential for premium themes | Users pay for design quality |
| Low security risk — themes are primarily CSS/HTML | Simpler review process |

**Cons:**

| Cost | Impact |
|---|---|
| Quality bar is subjective and hard to enforce | Inconsistent marketplace quality |
| Themes break with platform UI updates | Ongoing compatibility maintenance |
| Limited to visual customization | Does not solve functional gaps |

**Best for:** CMS platforms, website builders, e-commerce storefronts.

---

## Node 3 — Governance Model

How much control does the platform exert over what gets published? This decision affects ecosystem growth rate, quality, and operational cost.

### Options

#### Option A — Open (`{{MARKETPLACE_GOVERNANCE}}` = `open`)

Any developer can publish. Automated checks only — no human review. Think: npm, Chrome Web Store (pre-Manifest V3).

**Pros:**

| Benefit | Impact |
|---|---|
| Maximum ecosystem growth velocity | Thousands of plugins quickly |
| Zero review bottleneck | Developers publish instantly |
| Low operational cost | No review team needed |

**Cons:**

| Cost | Impact |
|---|---|
| Quality is inconsistent — spam and low-effort plugins | Damages marketplace trust |
| Security incidents are a matter of "when, not if" | Supply-chain attacks are common |
| Discovery is polluted with noise | Users cannot find quality plugins |

#### Option B — Curated (`{{MARKETPLACE_GOVERNANCE}}` = `curated`)

All submissions go through a review process. Platform sets quality and security standards. Think: Apple App Store, Shopify App Store.

**Pros:**

| Benefit | Impact |
|---|---|
| Consistent quality builds user trust | Higher install rates |
| Security review catches vulnerabilities before publication | Fewer incidents |
| Platform controls the narrative | Brand-safe ecosystem |

**Cons:**

| Cost | Impact |
|---|---|
| Review bottleneck slows ecosystem growth | Developers wait days/weeks |
| Review team is an ongoing expense | 2–5 reviewers minimum at scale |
| Subjective rejections frustrate developers | "Why was my app rejected but that one wasn't?" |

#### Option C — Certified (`{{MARKETPLACE_GOVERNANCE}}` = `certified`)

Two tiers: anyone can publish to an "unverified" tier, but a "certified" badge requires a deeper review. Think: Atlassian Marketplace (Forge vs. Connect), Zoom App Marketplace.

**Pros:**

| Benefit | Impact |
|---|---|
| Balances growth with quality signaling | Users choose their risk tolerance |
| Certified badge is a developer marketing asset | Developers pursue certification willingly |
| Review team focuses on high-impact apps | Efficient resource allocation |

**Cons:**

| Cost | Impact |
|---|---|
| Two-tier system is more complex to operate | UX must clearly communicate trust levels |
| Unverified tier can still damage brand | "It was on your marketplace" |
| Certification criteria must be transparent and fair | Political complexity |

#### Option D — Invite-Only (`{{MARKETPLACE_GOVERNANCE}}` = `invite-only`)

Platform selects developers and co-develops plugins. Think: early-stage enterprise platforms, Stripe Apps (initial launch).

**Pros:**

| Benefit | Impact |
|---|---|
| Maximum quality control | Every plugin meets the bar |
| Deep partnerships with plugin developers | Co-marketing, co-selling |
| Controlled growth — no support overwhelm | Sustainable scaling |

**Cons:**

| Cost | Impact |
|---|---|
| Extremely slow ecosystem growth | Limited selection for users |
| Gatekeeping perception | Developer community resentment |
| High per-plugin investment from platform team | Does not scale beyond 50–100 plugins |

---

## Node 4 — Monetization Strategy

How do developers and the platform make money from plugins? This decision affects developer incentives, user expectations, and platform revenue.

### Options

#### Option A — Free (`{{MARKETPLACE_MONETIZATION}}` = `free`)

All plugins are free. Platform benefits indirectly through increased retention and expansion revenue.

| Scenario | Recommendation |
|---|---|
| Early-stage ecosystem (<50 plugins) | Start free to attract developers |
| Integration hub (connectors) | Connectors are table stakes — hard to charge |
| Open-source product | Community expects free extensions |

#### Option B — Freemium (`{{MARKETPLACE_MONETIZATION}}` = `freemium`)

Plugins offer a free tier with paid upgrades. Platform may or may not take a cut.

| Scenario | Recommendation |
|---|---|
| App store with business-grade plugins | Developers monetize premium features |
| Mid-stage ecosystem (50–500 plugins) | Freemium reduces install friction |

#### Option C — Paid (`{{MARKETPLACE_MONETIZATION}}` = `paid`)

Plugins have a price tag. Platform takes a revenue cut (`{{PLATFORM_REVENUE_CUT}}`%).

| Revenue Cut | Precedent |
|---|---|
| 15% | Shopify, Epic Games Store |
| 20% | Atlassian Marketplace |
| 30% | Apple App Store, Google Play |

#### Option D — Subscription (`{{MARKETPLACE_MONETIZATION}}` = `subscription`)

Plugins charge recurring subscriptions. Platform takes a cut of each billing cycle.

| Scenario | Recommendation |
|---|---|
| SaaS plugins with ongoing value delivery | Subscription aligns with SaaS model |
| Enterprise marketplace | Per-seat or per-org subscription |

#### Option E — Usage-Based (`{{MARKETPLACE_MONETIZATION}}` = `usage-based`)

Plugins charge based on consumption (API calls, data processed, active users).

| Scenario | Recommendation |
|---|---|
| Infrastructure/data plugins | Costs scale with usage naturally |
| AI/ML plugins | Token-based or inference-based billing |

---

## Node 5 — Plugin Architecture

How do plugins execute? This is the most consequential technical decision — it determines security boundaries, performance characteristics, and developer experience.

### Options

#### Option A — iframe Sandbox (`{{PLUGIN_ARCHITECTURE}}` = `iframe-sandbox`)

Plugins render in sandboxed iframes with postMessage communication.

**Pros:**

| Benefit | Impact |
|---|---|
| Strong browser-native isolation | Plugins cannot access host DOM |
| Well-understood security model | Battle-tested in browsers for decades |
| Plugins can use any frontend framework | Maximum developer flexibility |

**Cons:**

| Cost | Impact |
|---|---|
| Cross-frame communication is async and slow | UI feels disjointed |
| Styling consistency is difficult | Plugins look "foreign" |
| Limited access to host UI primitives | Cannot extend native UI deeply |

#### Option B — Web Worker (`{{PLUGIN_ARCHITECTURE}}` = `web-worker`)

Plugin logic runs in Web Workers with a messaging bridge to the main thread.

**Pros:**

| Benefit | Impact |
|---|---|
| No DOM access — strong isolation | Plugins cannot break host UI |
| Off-main-thread execution | Plugin bugs do not freeze host |
| Shared memory possible via SharedArrayBuffer | High-performance data exchange |

**Cons:**

| Cost | Impact |
|---|---|
| No direct UI rendering | UI must be declarative (host renders) |
| Debugging is more complex | Worker DevTools are less mature |
| Limited browser API access | No fetch, no localStorage in some contexts |

#### Option C — Server-Side (`{{PLUGIN_ARCHITECTURE}}` = `server-side`)

Plugins run on their own infrastructure. Platform communicates via webhooks and API calls.

**Pros:**

| Benefit | Impact |
|---|---|
| Maximum isolation — plugins run on developer infra | Zero platform performance risk |
| Any language, any framework | Maximum developer flexibility |
| Scales independently | Platform does not bear plugin compute costs |

**Cons:**

| Cost | Impact |
|---|---|
| Latency for real-time interactions | Webhook round-trips add 100–500ms |
| Developer must host and operate infrastructure | Higher barrier to entry |
| Harder to provide consistent UX | UI must be embedded or proxied |

#### Option D — WebAssembly (`{{PLUGIN_ARCHITECTURE}}` = `wasm`)

Plugins compile to WASM and run in a sandboxed runtime.

**Pros:**

| Benefit | Impact |
|---|---|
| Near-native performance | Ideal for compute-heavy plugins |
| Strong sandboxing via WASM spec | Memory-safe by default |
| Language-agnostic (Rust, C, Go, etc.) | Developer choice |

**Cons:**

| Cost | Impact |
|---|---|
| Limited DOM/browser API access | UI integration requires bridging |
| WASM toolchains are still maturing | Developer experience is rough |
| Binary distribution is opaque | Harder to review for security |

#### Option E — Native Host (`{{PLUGIN_ARCHITECTURE}}` = `native`)

Plugins run in the host process with direct access to platform internals (with permission checks).

**Pros:**

| Benefit | Impact |
|---|---|
| Maximum integration depth | Plugins feel native |
| Lowest latency | No serialization overhead |
| Full access to platform APIs | Most powerful extensibility |

**Cons:**

| Cost | Impact |
|---|---|
| Least isolation — bugs crash the host | High risk |
| Security depends entirely on permission system | One exploit compromises everything |
| Breaking changes affect all plugins simultaneously | Tight coupling |

---

## Node 6 — Developer Program Scale

How large is your target developer ecosystem? This determines investment in tooling, support, and community infrastructure.

### Options

#### Option A — Small (`{{DEVELOPER_PROGRAM_SIZE}}` = `small (<100)`)

Hand-selected partners. High-touch onboarding. Co-development model.

| Investment | Level |
|---|---|
| Developer relations | 1 person, part-time |
| Documentation | Basic getting-started guide |
| Support | Direct Slack channel |
| SDK | Minimal — API + examples |
| Review process | Manual, relationship-based |

**Best for:** Early-stage marketplace, enterprise-focused platforms, invite-only governance.

#### Option B — Medium (`{{DEVELOPER_PROGRAM_SIZE}}` = `medium (100-1000)`)

Self-serve onboarding with curated support. Scalable documentation and tooling.

| Investment | Level |
|---|---|
| Developer relations | 2–3 full-time |
| Documentation | Full portal with tutorials, API reference, guides |
| Support | Forum + office hours + dedicated support tier |
| SDK | Full SDK with testing utilities |
| Review process | Semi-automated with human reviewers |

**Best for:** Growth-stage marketplace, curated governance, mid-market platforms.

#### Option C — Large (`{{DEVELOPER_PROGRAM_SIZE}}` = `large (1000+)`)

Fully self-serve. Automated everything. Community-driven support.

| Investment | Level |
|---|---|
| Developer relations | 5–10+ full-time |
| Documentation | Auto-generated reference + community tutorials + video content |
| Support | Community forum + Stack Overflow tag + premium support tier |
| SDK | Multi-language SDKs with IDE plugins |
| Review process | Fully automated with exception-based human review |

**Best for:** Platform-scale marketplace, open governance, horizontal SaaS.

---

## Decision Summary Template

Record your decisions below and propagate to the project configuration:

```
{{HAS_MARKETPLACE}}         = _______________
{{MARKETPLACE_TYPE}}        = _______________
{{MARKETPLACE_GOVERNANCE}}  = _______________
{{MARKETPLACE_MONETIZATION}}= _______________
{{PLUGIN_ARCHITECTURE}}     = _______________
{{DEVELOPER_PROGRAM_SIZE}}  = _______________
{{PLATFORM_REVENUE_CUT}}    = _______________
```

Once all six nodes are decided, proceed to `plugin-architecture.template.md` to begin the technical design.
