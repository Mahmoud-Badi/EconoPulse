# Phase 32: Integration Strategy & Patterns

> Every SaaS product is a tapestry of third-party services stitched together with your own code. This section ensures those stitches are planned, resilient, and observable — not discovered mid-sprint when a webhook silently drops events into the void.

---

## Why This Exists

The kit already handles integration inventory (Section 00), per-service client setup (Section 02), and domain-specific integrations for AI/ML (Section 24), billing (Section 30), and customer experience (Section 33). What it lacked was a unified architectural layer for the cross-cutting concerns that apply to *every* integration: resilience patterns, webhook infrastructure, health monitoring, rate limiting, failover strategies, and contract testing.

Teams that plan integrations as an afterthought end up with brittle point-to-point connections, no circuit breakers, no fallback providers, no integration health visibility, and no strategy for handling the inevitable third-party API deprecation notice that arrives on a Friday afternoon. This section exists to make integration architecture a first-class planning concern from day one.

The section also fills category gaps — integration families like OAuth/SSO, communication platforms (Slack/Discord/Teams), e-commerce (Shopify), CRM/CDP pipelines, cloud services, and scheduling/geolocation that don't have dedicated kit sections but appear in nearly every project. Each category gets its own subdirectory with templates and decision trees so you're not reinventing patterns that have well-known solutions.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 14.9** in the Orchestrator, placed between Step 14.8 (Billing & Payments) and Step 15 (Observability). By this point, all integration needs have been identified through intake (Step 1), service specs (Step 5), API contracts (Step 10), AI/ML integration (Step 14.6), legal requirements (Step 14.7), and billing architecture (Step 14.8). Step 14.9 takes that complete inventory and designs the cross-cutting architecture that makes all integrations resilient, observable, and maintainable.

**Skip condition:** `CONFIG.INTEGRATIONS_COUNT == 0` — though in practice, nearly every project has at least authentication and email.

**Relationship with Section 00 (Discovery):** Section 00's `integrations-map.template.md` creates the initial inventory of third-party services. Section 32 extends that inventory with strategic fields — criticality rating, fallback strategy, SLA requirements, cost projections, and data flow direction. Section 00 answers "what do we integrate with?" Section 32 answers "how do we architect those integrations to not wake us up at 3 AM?"

**Relationship with Section 02 (Architecture):** Section 02's `integration-planning.template.md` covers per-service client setup — environment variables, package installation, client initialization. Section 32 provides the architectural patterns that each per-service plan should follow: how to wrap clients with circuit breakers, how to structure webhook handlers, how to implement health checks. Section 02 is the implementation template; Section 32 is the pattern library.

**Relationship with Section 08 (Quality & Testing):** Section 08 covers test infrastructure and patterns. Section 32's `integration-testing-strategies.md` extends those patterns specifically for third-party API testing — contract testing with Pact, API mocking with WireMock/MSW, webhook payload fixtures, and chaos testing for integration failures.

**Relationship with Section 09 (Deployment Operations):** Section 09 manages environment variables and deployment configuration. Section 32's credential management strategy in the integration strategy template aligns with Section 09's env var patterns and adds integration-specific concerns like API key rotation schedules and per-environment sandbox configurations.

**Relationship with Section 21 (Incident Response):** Section 21's third-party outage runbook handles incidents reactively. Section 32's resilience patterns and multi-provider fallback templates handle them proactively — designing the circuit breakers, fallback providers, and graceful degradation that prevent a third-party outage from becoming your outage.

**Relationship with Section 24 (AI/ML Integration):** Section 24 covers AI-specific patterns (RAG pipelines, LLM provider selection, prompt engineering). Section 32 covers the general integration patterns that apply to AI services too — circuit breakers around LLM calls, fallback between providers (OpenAI → Anthropic), rate limiting for API quotas. The two sections are complementary: Section 24 is domain-specific, Section 32 is domain-agnostic.

**Relationship with Section 30 (Billing & Payments):** Section 30 covers Stripe architecture, billing models, and payment flows in depth. Section 32 provides the webhook infrastructure template that Stripe's event-driven architecture depends on, and the resilience patterns for handling payment API failures gracefully.

**Relationship with Section 33 (CX Operations):** Section 33 builds AI chatbots, unified inboxes, and support tool integrations. Section 32 provides the underlying integration architecture — how those tools connect to your system, how conversations route between channels, and how the health of those integrations is monitored.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview, reading order, cross-references | 14.9 |
| `integration-maturity-assessment.md` | Guide | Maturity decision tree — which templates to use based on scale | 14.9 |
| `integration-strategy.template.md` | Template | Master strategy document — inventory, priorities, timeline, costs | 14.9 |
| `webhook-architecture.template.md` | Template | Inbound/outbound webhook infrastructure design | 14.9 |
| `resilience-patterns.md` | Guide | Circuit breakers, retry/backoff, bulkhead, timeout patterns | 14.9 |
| `multi-provider-fallback.template.md` | Template | Primary/secondary provider configuration and failover logic | 14.9 |
| `integration-health-monitoring.template.md` | Template | Health check endpoints, dashboards, alerting, SLA tracking | 14.9 |
| `api-versioning-deprecation.md` | Guide | Version pinning, sunset detection, migration playbooks | 14.9 |
| `rate-limiting-strategies.md` | Guide | Client-side rate limiting, queue throttling, header parsing | 14.9 |
| `integration-testing-strategies.md` | Guide | Contract testing, API mocking, chaos testing for integrations | 14.9 |
| `graphql-integration-patterns.md` | Guide | Client setup, codegen, persisted queries, caching strategies | 14.9 |
| `realtime-integration-patterns.md` | Guide | WebSockets, SSE, polling, reconnection, state synchronization | 14.9 |
| `job-queue-patterns.template.md` | Template | Job queue architecture, worker topology, DLQ handling | 14.9 |
| `integration-gotchas.md` | Guide | Production lessons organized by failure category | 14.9 |
| `auth-sso/oauth-sso-patterns.template.md` | Template | OAuth/SSO flows, token management, PKCE implementation | 14.9 |
| `auth-sso/social-login-decision-tree.md` | Guide | Provider selection, account linking, progressive profiling | 14.9 |
| `communication-platforms/slack-bot-integration.template.md` | Template | Slack app architecture, events API, interactive messages | 14.9 |
| `communication-platforms/discord-bot-integration.template.md` | Template | Discord bot setup, gateway events, slash commands | 14.9 |
| `communication-platforms/teams-webhook-integration.template.md` | Template | Teams webhooks, adaptive cards, connector configuration | 14.9 |
| `ecommerce/shopify-integration.template.md` | Template | Storefront/Admin API, webhooks, app bridge patterns | 14.9 |
| `ecommerce/ecommerce-platform-decision-tree.md` | Guide | Shopify vs WooCommerce vs headless commerce selection | 14.9 |
| `crm-cdp/crm-deep-integration.template.md` | Template | Salesforce/HubSpot sync strategy, field mapping, conflicts | 14.9 |
| `crm-cdp/cdp-data-pipeline.template.md` | Template | Segment/RudderStack source/destination config, identity resolution | 14.9 |
| `cloud-services/cloud-storage-integration.template.md` | Template | S3/R2/GCS signed URLs, lifecycle policies, CDN integration | 14.9 |
| `cloud-services/cloud-functions-integration.template.md` | Template | Lambda/Workers/Cloud Functions invocation patterns | 14.9 |
| `cloud-services/cloud-service-decision-tree.md` | Guide | AWS vs GCP vs Cloudflare vs Vercel per concern | 14.9 |
| `scheduling-geo/calendar-scheduling-integration.template.md` | Template | Google Calendar/Calendly availability sync, booking flows | 14.9 |
| `scheduling-geo/mapping-geolocation-integration.template.md` | Template | Google Maps/Mapbox geocoding, routing, tile rendering | 14.9 |

---

## Reading Order

1. **`integration-maturity-assessment.md`** — Start here. Assess your integration maturity level so you know which files to prioritize. A weekend MVP with two integrations and an enterprise platform with fifteen need completely different things from this section.
2. **`integration-strategy.template.md`** — The master document. Maps every integration, assigns criticality ratings, plans implementation order, estimates costs, and defines credential management strategy. Every other file in this section refines decisions made here.
3. **`resilience-patterns.md`** — Learn the architectural patterns that protect your system from third-party failures. Circuit breakers, retry with backoff, bulkhead isolation, and graceful degradation. These patterns apply to every integration you build.
4. **`webhook-architecture.template.md`** — Design your webhook infrastructure. Most modern APIs are event-driven, and webhook handling is the single most common source of silent data loss in integrations.
5. **`multi-provider-fallback.template.md`** — Configure primary and secondary providers for critical integrations. When SendGrid goes down, your transactional emails should flow through SES automatically.
6. **`integration-health-monitoring.template.md`** — Build the health check endpoints and dashboards that tell you an integration is degraded before your users do.
7. **`rate-limiting-strategies.md`** — Understand client-side rate limiting so you don't get throttled or banned by providers. Especially critical for integrations with strict quotas (Shopify, social APIs, LLM providers).
8. **`api-versioning-deprecation.md`** — Plan for the inevitable: every API you consume will eventually deprecate the version you're using. Have a strategy before the sunset notice arrives.
9. **`integration-testing-strategies.md`** — Set up contract testing and API mocking so your integration tests don't depend on live third-party services being available and behaving consistently.
10. **`graphql-integration-patterns.md`** — If consuming GraphQL APIs, learn the client patterns, codegen workflow, and caching strategies that differ significantly from REST.
11. **`realtime-integration-patterns.md`** — For WebSocket, SSE, or polling-based integrations, understand reconnection strategies, state synchronization, and the tradeoffs between each approach.
12. **`job-queue-patterns.template.md`** — Design your async processing infrastructure for integration workloads that shouldn't block request/response cycles.
13. **Category subdirectories** — Work through the relevant category templates based on your project's integration inventory:
    - `auth-sso/` — OAuth/SSO provider setup and social login configuration
    - `communication-platforms/` — Slack, Discord, Teams bot and webhook integrations
    - `ecommerce/` — Shopify, WooCommerce platform integrations
    - `crm-cdp/` — CRM sync and customer data pipeline configuration
    - `cloud-services/` — Storage, compute, and cloud platform selection
    - `scheduling-geo/` — Calendar booking and mapping/geolocation services
14. **`integration-gotchas.md`** — Read last. These production war stories will resonate more after you understand the full integration architecture framework.

---

## Maturity-Gated Scope

Not every project needs every file. The `integration-maturity-assessment.md` decision tree assigns a maturity level that determines which templates to resolve:

| Level | Integration Count | Team Size | Templates to Resolve |
|-------|------------------|-----------|---------------------|
| **Basic** | 1–3 | Solo/duo | Strategy doc only |
| **Standard** | 4–8 | Small team | Strategy + resilience + webhooks + health monitoring + testing |
| **Complex** | 9–15 | Team | Standard + fallback + rate limiting + job queues + relevant categories |
| **Enterprise** | 16+ | Multiple teams | All templates, full contract testing, API versioning strategy |

---

## Path Inclusion

| Path | Scope |
|------|-------|
| **Express** | `integration-strategy.template.md` only (lightweight inventory extension) |
| **Lite** | Same as Express |
| **Standard** | Core templates + relevant category templates |
| **Full** | All templates |
| **Migration** | All templates + migration-specific integration mapping |
| **Library/CLI** | Only if library wraps or consumes external APIs |
| **Guided** | Same as Lite with additional explanations |

---

## Key Principles

***Plan integrations before you code them.*** The cheapest time to design a circuit breaker is before the first API call. The most expensive time is during the incident where you discover you needed one.

***Every integration needs a failure mode.*** If you can't answer "what happens when this service is down?" for each integration, you haven't finished planning. The answer might be "show cached data" or "display a maintenance banner" — but it cannot be "crash."

***Webhooks are infrastructure, not endpoints.*** Treat inbound webhook handling as a dedicated subsystem with its own queue, dead letter storage, replay mechanism, and monitoring. A single `/webhook` route handler is a ticking time bomb.

***Credentials are a lifecycle, not a config entry.*** API keys expire, get rotated, and differ per environment. Plan for rotation from day one — not after your production key leaks to a public repo.

***Monitor what you depend on.*** You cannot control third-party uptime, but you can detect degradation within seconds instead of hours. Integration health checks are as important as your own application health checks.

***Test the contract, not the service.*** Integration tests that hit live third-party APIs are slow, flaky, and expensive. Contract tests verify your code handles the API's response format correctly without depending on the service being available.
