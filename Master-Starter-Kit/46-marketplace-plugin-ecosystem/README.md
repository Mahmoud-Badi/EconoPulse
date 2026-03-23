# Section 46 — Marketplace & Plugin Ecosystem

> A product becomes a platform when other people can build on it. This section architects the plugin system, marketplace UX, developer portal, and ecosystem governance that transforms your standalone tool into an extensible platform with compounding network effects.

---

## Purpose

This section provides the complete blueprint for designing, launching, and governing a marketplace and plugin ecosystem. It covers everything from the low-level plugin architecture and sandboxing model to the high-level marketplace UX, developer relations strategy, and monetization mechanics. When executed properly, a plugin ecosystem creates a flywheel: more plugins attract more users, more users attract more developers, and network effects compound over time.

## Orchestrator Integration

| Field | Value |
|---|---|
| **Step** | 28.6 |
| **Skip condition** | `CONFIG.HAS_MARKETPLACE == "false"` |
| **Depends on** | Section 02 (Product Requirements), Section 14 (API Design), Section 18 (Auth & Permissions) |
| **Feeds into** | Section 32 (Developer Experience), Section 36 (Scaling), Section 30 (Observability) |

## Section Map

| # | File | Type | Purpose |
|---|---|---|---|
| 1 | `README.md` | Guide | This file — section overview, relationships, workflow |
| 2 | `marketplace-decision-tree.md` | Guide | Decision tree for marketplace strategy, type, governance, monetization |
| 3 | `plugin-architecture.template.md` | Template | Extension points, Plugin API, manifest schema, lifecycle, state, events |
| 4 | `app-store-ux.template.md` | Template | Discovery UX, listing pages, install flow, ratings, management |
| 5 | `developer-portal.template.md` | Template | Portal IA, getting started, auth, API reference, community, dashboard |
| 6 | `sdk-design.template.md` | Template | SDK architecture, core modules, versioning, distribution, testing |
| 7 | `review-approval-workflow.template.md` | Template | Submission requirements, automated checks, manual review, publishing |
| 8 | `sandbox-testing.template.md` | Template | Sandbox architecture, test data, debug tools, CI/CD, prod parity |
| 9 | `marketplace-monetization.template.md` | Template | Pricing models, revenue share, payment integration, refunds, payouts |
| 10 | `plugin-security-model.template.md` | Template | Permissions, data access, sandboxing, credentials, incident response |
| 11 | `third-party-rate-limiting.template.md` | Template | Rate limit design, quota tiers, headers, abuse detection, DDoS |
| 12 | `developer-docs-generation.template.md` | Template | OpenAPI, auto-gen reference, playground, code samples, changelog |
| 13 | `marketplace-analytics.template.md` | Template | Install tracking, usage analytics, health metrics, revenue analytics |
| 14 | `plugin-lifecycle.template.md` | Template | Versioning, breaking changes, deprecation, migration, health scoring |
| 15 | `marketplace-gotchas.md` | Guide | 18 gotchas across CRITICAL/HIGH/MEDIUM/LOW severity |

## Relationships to Other Sections

### Upstream Dependencies

| Section | Relationship |
|---|---|
| **02 — Product Requirements** | Market positioning determines whether a marketplace is viable. The PRD must identify extensibility as a core product strategy, not an afterthought. |
| **14 — API Design** | The plugin API is a public API surface. All API design principles (versioning, pagination, error handling) apply with even more rigor because third parties depend on stability. |
| **18 — Auth & Permissions** | Plugin OAuth scopes, API key management, and permission boundaries depend on the core auth architecture. Plugin permissions are a *subset* of the platform permission model. |

### Downstream Consumers

| Section | Relationship |
|---|---|
| **32 — Developer Experience** | The developer portal, SDK, and documentation are the public face of your platform. DX quality directly determines ecosystem growth rate. |
| **36 — Scaling** | Third-party plugins introduce unpredictable load patterns. Rate limiting, sandboxing, and resource isolation must be designed with scaling in mind. |
| **30 — Observability** | Plugin telemetry, marketplace analytics, and developer dashboards require observability infrastructure. Health scoring depends on metrics pipelines. |

### Lateral Relationships

| Section | Relationship |
|---|---|
| **08 — Data Model** | Plugin data storage, manifest schemas, and marketplace catalog require data model extensions. |
| **22 — Testing** | Plugin SDK testing utilities, sandbox environments, and CI/CD pipelines intersect with the platform testing strategy. |
| **40 — Legal & Compliance** | Developer agreements, revenue share contracts, data processing addendums, and GDPR implications of third-party data access. |

## Workflow

### Phase 1 — Strategy (Files 2, 15)
Start with the decision tree to determine whether you need a marketplace, what type, and the governance model. Review gotchas early to avoid known pitfalls.

### Phase 2 — Architecture (Files 3, 10, 11)
Design the plugin architecture, security model, and rate limiting before writing any code. These are foundational decisions that are expensive to change later.

### Phase 3 — Developer Experience (Files 5, 6, 12)
Build the developer portal, SDK, and documentation generation pipeline. The quality of developer tooling determines ecosystem adoption velocity.

### Phase 4 — Marketplace UX (Files 4, 7, 8)
Design the app store experience, review workflow, and sandbox environment. These are the surfaces that developers and users interact with daily.

### Phase 5 — Business Model (Files 9, 13, 14)
Implement monetization, analytics, and plugin lifecycle management. These require a live ecosystem to tune properly.

## Key Placeholders

| Placeholder | Description | Example Values |
|---|---|---|
| `{{HAS_MARKETPLACE}}` | Whether the product has a marketplace | `true`, `false` |
| `{{MARKETPLACE_TYPE}}` | Type of marketplace | `app-store`, `extension-gallery`, `integration-hub`, `theme-marketplace` |
| `{{MARKETPLACE_GOVERNANCE}}` | Governance model | `open`, `curated`, `certified`, `invite-only` |
| `{{MARKETPLACE_MONETIZATION}}` | Monetization approach | `free`, `freemium`, `paid`, `subscription`, `usage-based` |
| `{{PLATFORM_REVENUE_CUT}}` | Platform revenue percentage | `15`, `20`, `30` |
| `{{PLUGIN_ARCHITECTURE}}` | Plugin runtime architecture | `iframe-sandbox`, `web-worker`, `server-side`, `wasm`, `native` |
| `{{SDK_LANGUAGES}}` | Supported SDK languages | `TypeScript`, `Python`, `Go`, `Ruby` |
| `{{DEVELOPER_PROGRAM_SIZE}}` | Target developer program size | `small (<100)`, `medium (100-1000)`, `large (1000+)` |
| `{{EXTENSION_POINT_COUNT}}` | Number of extension points | `5`, `15`, `50+` |
| `{{PLUGIN_REVIEW_SLA_DAYS}}` | Review SLA in days | `3`, `5`, `7`, `14` |
| `{{PLUGIN_SANDBOX_TYPE}}` | Sandbox isolation model | `iframe`, `web-worker`, `container`, `vm`, `wasm` |
| `{{DEVELOPER_PORTAL_URL}}` | Developer portal URL | `https://developers.example.com` |
| `{{PLUGIN_API_VERSION}}` | Current plugin API version | `v1`, `v2`, `2024-01` |
| `{{PLUGIN_RATE_LIMIT_DEFAULT}}` | Default rate limit | `100/min`, `1000/hr`, `10000/day` |
| `{{MAX_PLUGIN_PERMISSIONS}}` | Max permissions per plugin | `5`, `10`, `20` |
| `{{DEVELOPER_SANDBOX_URL}}` | Sandbox environment URL | `https://sandbox.example.com` |
| `{{PROJECT_NAME}}` | Project name | — |

## Completion Checklist

- [ ] Decision tree completed — marketplace type, governance, and monetization chosen
- [ ] Plugin architecture designed with extension points documented
- [ ] App store UX wireframed and responsive across breakpoints
- [ ] Developer portal IA defined with getting-started flow
- [ ] SDK designed with core modules, versioning, and distribution plan
- [ ] Review/approval workflow implemented with automated checks
- [ ] Sandbox environment provisioned with test data and debug tools
- [ ] Monetization model implemented (if applicable) with payment integration
- [ ] Security model enforced — permissions, sandboxing, credential management
- [ ] Rate limiting deployed with quota tiers and abuse detection
- [ ] Developer documentation auto-generated from OpenAPI specs
- [ ] Analytics pipeline tracking installs, usage, revenue, and health
- [ ] Plugin lifecycle management — versioning, deprecation, migration guides
- [ ] Gotchas reviewed and mitigations planned for all CRITICAL/HIGH items
- [ ] End-to-end flow tested: developer signup → plugin submission → review → publish → user install → usage → uninstall
