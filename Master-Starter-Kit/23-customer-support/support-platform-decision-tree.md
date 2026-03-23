# Support Platform Decision Tree

> **Purpose:** Systematically choose the right customer support platform based on your product type, budget, team size, and channel requirements.
> **Used in:** Orchestrator Step 18.7 (Customer Support Infrastructure)
> **Output:** A clear platform recommendation with rationale and migration path.

---

## How This Decision Tree Works

Do not pick a support platform because a blog post told you it was "the best." Pick one because it fits your specific constraints. The wrong platform creates friction that compounds daily — agents fighting the UI, customers stuck in broken workflows, and you paying for features you never use.

This decision tree evaluates five platforms across the dimensions that actually matter: cost, channel support, AI capability, scalability, and ease of setup. Read each profile, then use the decision matrix at the bottom to make your call.

---

## Platform Profiles

### Intercom

> Best for: SaaS products with in-app messaging, product-led growth, AI-first support

| Attribute | Details |
|-----------|---------|
| **Starting price** | $74/month (Essential plan, 1 seat) |
| **Per-seat cost** | ~$74-$135/seat/month depending on plan |
| **Free tier** | No (14-day trial only) |
| **Best channels** | In-app messenger, email, social |
| **AI capability** | Fin AI Agent — resolves questions from your KB, hands off to humans when stuck |
| **Knowledge base** | Built-in (Articles), decent search, AI-integrated |
| **Product tours** | Built-in — onboarding flows, tooltips, checklists |
| **Reporting** | Strong — conversation metrics, team performance, AI resolution rates |
| **Setup time** | 1-2 days for basic; 1-2 weeks for full configuration |
| **API/Integrations** | Excellent — REST API, webhooks, 300+ integrations |

**Pros:**

- In-app messenger is the best in class — feels native, not bolted on
- Fin AI bot is genuinely good at resolving common questions from your docs
- Product tours and onboarding flows reduce support volume proactively
- Unified inbox for all channels (chat, email, social)
- Strong reporting and conversation analytics
- Custom bots for lead qualification and ticket routing

**Cons:**

- Expensive — costs escalate quickly as team grows
- Pricing model is opaque and changes frequently
- Feature bloat — you will use 30% of what you pay for
- Lock-in risk — migrating away from Intercom is painful (conversation history, workflows)
- Support for Intercom's own product can be slow (ironic)
- Overkill for simple email-only support

**Best fit:** Funded SaaS companies ($1M+ ARR or well-funded) that want in-app messaging, AI resolution, and product tours in a single platform.

---

### Zendesk

> Best for: Multi-channel support at scale, enterprise requirements, complex workflows

| Attribute | Details |
|-----------|---------|
| **Starting price** | $19/agent/month (Support Team plan) |
| **Per-seat cost** | $19-$115/agent/month depending on plan |
| **Free tier** | No (14-day trial) |
| **Best channels** | Email, chat, phone, social, messaging apps |
| **AI capability** | Zendesk AI — automated responses, intelligent triage, agent assist |
| **Knowledge base** | Guide — robust KB with community forums option |
| **Product tours** | No (requires third-party integration) |
| **Reporting** | Enterprise-grade — Explore analytics, custom dashboards |
| **Setup time** | 2-5 days for basic; 2-4 weeks for full enterprise configuration |
| **API/Integrations** | Excellent — REST API, 1200+ marketplace apps |

**Pros:**

- Battle-tested at scale — handles millions of tickets for enterprise companies
- True omnichannel — phone, email, chat, social, WhatsApp, all in one
- Sophisticated workflow automation (triggers, automations, macros)
- Robust SLA management built into the ticketing system
- Massive integration marketplace
- Strong compliance and security certifications (SOC 2, HIPAA, GDPR)

**Cons:**

- UI feels dated compared to modern alternatives
- Configuration complexity — you need a Zendesk admin, not just a support agent
- Expensive at scale — per-agent pricing adds up fast with large teams
- Knowledge base design options are limited without custom themes
- The "Suite" pricing bundles features you may not need
- Steep learning curve for new agents

**Best fit:** Companies scaling to 10+ support agents, needing phone support, requiring enterprise compliance, or managing complex multi-team workflows.

---

### Crisp

> Best for: Bootstrapped startups, generous free tier, live chat focus

| Attribute | Details |
|-----------|---------|
| **Starting price** | Free (2 seats, basic features) |
| **Per-seat cost** | $25/seat/month (Pro) or $95/seat/month (Unlimited) |
| **Free tier** | Yes — 2 seats, live chat, basic inbox |
| **Best channels** | Live chat, email, social (Messenger, Instagram, Twitter) |
| **AI capability** | MagicReply (AI-assisted responses), MagicBrowse (co-browsing) |
| **Knowledge base** | Built-in — clean, searchable, multilingual |
| **Product tours** | No |
| **Reporting** | Basic on free; detailed on paid plans |
| **Setup time** | 30 minutes for basic; 1-2 days for full configuration |
| **API/Integrations** | Good — REST API, webhooks, 50+ integrations |

**Pros:**

- Genuinely useful free tier — 2 seats with live chat, inbox, and basic KB
- Beautiful, modern UI — both agent-side and customer-facing widget
- Fast setup — widget installed in minutes
- Co-browsing (MagicBrowse) — see what the user sees in real time
- Chatbot builder included on paid plans
- Video calls directly from the chat widget

**Cons:**

- Limited workflow automation compared to Intercom/Zendesk
- AI capabilities are newer and less mature than competitors
- Reporting is basic on lower tiers
- Smaller integration ecosystem
- No phone channel support
- Less suitable for high-volume enterprise support

**Best fit:** Early-stage startups, bootstrapped products, and solo founders who need live chat and a knowledge base without spending money upfront.

---

### HelpScout

> Best for: Email-first support, clean UX, teams that value simplicity

| Attribute | Details |
|-----------|---------|
| **Starting price** | $50/month (Standard, includes 100 contacts) |
| **Per-seat cost** | Usage-based pricing on contacts, unlimited users on all plans |
| **Free tier** | No (15-day trial) |
| **Best channels** | Email (primary), live chat (Beacon widget) |
| **AI capability** | AI Drafts (generates reply drafts), AI Summarize, AI Assist |
| **Knowledge base** | Docs — excellent, clean, SEO-friendly, customizable |
| **Product tours** | No (but Beacon widget provides in-app help) |
| **Reporting** | Solid — happiness reports, response time, volume, tag-based |
| **Setup time** | 1-2 hours for basic; 1-2 days for full configuration |
| **API/Integrations** | Good — REST API, 90+ integrations |

**Pros:**

- Cleanest, most intuitive agent experience — your team will actually enjoy using it
- Knowledge base (Docs) is beautiful and SEO-friendly out of the box
- Beacon widget provides contextual in-app help articles
- Collision detection — see when another agent is replying
- Unlimited users on all plans (pricing is contact-based, not seat-based)
- Customer satisfaction ratings built in
- Messages feature for proactive outreach

**Cons:**

- Email-centric — live chat exists but is not the primary focus
- No phone channel
- Less sophisticated automation than Zendesk
- AI features are newer and more limited
- No in-app messenger like Intercom
- Reporting is good but not enterprise-grade

**Best fit:** Small to mid-sized teams (2-20 people) where email is the primary support channel, and the team values a clean, fast, delightful agent experience over feature bloat.

---

### Self-Built (Discord + GitHub Issues)

> Best for: Open-source projects, developer tools, zero-budget operations

| Attribute | Details |
|-----------|---------|
| **Starting price** | Free |
| **Per-seat cost** | Free |
| **Free tier** | Yes — entirely free |
| **Best channels** | Discord (community chat), GitHub Issues/Discussions (async) |
| **AI capability** | DIY — build a bot using your docs + OpenAI/Claude API |
| **Knowledge base** | GitHub Wiki, docs site (Docusaurus, Nextra, etc.) |
| **Product tours** | No |
| **Reporting** | Manual — track with labels, project boards, custom scripts |
| **Setup time** | 1-3 days for Discord server + GitHub templates |
| **API/Integrations** | Unlimited — you build what you need |

**Pros:**

- Completely free
- Community members help each other (scales without hiring)
- GitHub Issues integrates directly with your development workflow
- Discord provides real-time community engagement
- Full control — no vendor lock-in, no pricing changes
- Developers prefer GitHub/Discord over traditional support widgets

**Cons:**

- No SLA tracking, no ticket prioritization, no agent assignment out of the box
- Discord conversations are ephemeral and hard to search
- No unified inbox — you monitor multiple platforms manually
- No customer context (account info, usage data) without custom tooling
- Community support quality is inconsistent
- Difficult to maintain as user base grows beyond developer audience
- No CSAT measurement without custom implementation

**Best fit:** Open-source projects, developer tools, early-stage dev-focused products where the user base is technical and expects GitHub/Discord as the support channel.

---

## Decision Matrix

### By Budget

| Monthly Budget | Recommendation |
|---------------|----------------|
| $0 | Crisp (free tier) or Self-built (Discord + GitHub) |
| $0-100 | Crisp (free tier for 2 seats) |
| $100-300 | HelpScout (Standard) or Crisp (Pro) |
| $300-1000 | Intercom (Essential) or HelpScout (Plus) |
| $1000+ | Intercom (Advanced) or Zendesk (Suite) |

### By Team Size

| Team Size | Recommendation |
|-----------|----------------|
| Solo founder | Crisp (free) or HelpScout |
| 2-3 agents | HelpScout or Crisp (Pro) |
| 4-10 agents | Intercom or Zendesk |
| 10-50 agents | Zendesk or Intercom |
| 50+ agents | Zendesk |

### By Channel Requirements

| Primary Channel | Recommendation |
|----------------|----------------|
| In-app chat only | Intercom or Crisp |
| Email only | HelpScout |
| Email + chat | HelpScout (Beacon) or Intercom |
| Email + chat + phone | Zendesk |
| Email + chat + social + WhatsApp | Zendesk |
| Discord + GitHub | Self-built |

### By Product Type

| Product Type | Recommendation |
|-------------|----------------|
| B2B SaaS (funded) | Intercom |
| B2B SaaS (bootstrapped) | Crisp or HelpScout |
| B2C app | Zendesk or Intercom |
| E-commerce | Zendesk |
| Developer tool | Self-built or Crisp |
| Open-source project | Self-built (Discord + GitHub) |
| Agency/freelancer | HelpScout |
| Marketplace | Zendesk or Intercom |

### By AI Capability Priority

| AI Priority | Recommendation |
|------------|----------------|
| AI-first, resolve without humans | Intercom (Fin) |
| AI-assisted agent replies | HelpScout (AI Drafts) or Zendesk (AI) |
| Basic AI / chatbot builder | Crisp (MagicReply) |
| Custom AI (full control) | Self-built (OpenAI/Claude + your KB) |
| No AI needed | HelpScout or Crisp (free) |

---

## Quick Recommendation Flowchart

```
START
  |
  v
Is your product open-source or a developer tool with $0 budget?
  |-- YES --> Self-built (Discord + GitHub Issues)
  |-- NO
       |
       v
     Is your primary channel email?
       |-- YES --> HelpScout
       |-- NO
            |
            v
          Do you need phone support?
            |-- YES --> Zendesk
            |-- NO
                 |
                 v
               Are you funded (or revenue > $500K ARR)?
                 |-- YES --> Intercom
                 |-- NO --> Crisp
```

**One-liner version:** If SaaS + funded, use Intercom. Bootstrapped, use Crisp. Email-heavy, use HelpScout. Dev tool, use GitHub Issues + Discord. Enterprise multi-channel, use Zendesk.

---

## Migration Considerations

When you outgrow your current platform, migration involves three things:

1. **Conversation history** — Most platforms support CSV export. Intercom and Zendesk have migration APIs. Budget 1-2 weeks for a full migration.
2. **Knowledge base content** — Export articles as markdown/HTML. Re-import into new platform. Budget 1-3 days depending on article count.
3. **Workflow reconfiguration** — Automations, macros, and routing rules do not transfer. Budget 1-2 weeks to rebuild.

**Rule of thumb:** Start with the simplest platform that meets your needs today. Migrate when you feel genuine pain, not when you anticipate hypothetical scale.

---

## Platform Comparison Summary

| Feature | Intercom | Zendesk | Crisp | HelpScout | Self-Built |
|---------|----------|---------|-------|-----------|------------|
| Starting price | $74/mo | $19/agent/mo | Free | $50/mo | Free |
| In-app messenger | Excellent | Basic | Good | Beacon | Custom |
| Email support | Good | Excellent | Good | Excellent | Basic |
| Phone support | No | Yes | No | No | No |
| AI chatbot | Fin (excellent) | Good | Basic | AI Drafts | Custom |
| Knowledge base | Good | Good | Good | Excellent | Custom |
| Product tours | Yes | No | No | No | No |
| Automation | Advanced | Enterprise | Basic | Moderate | Custom |
| Setup time | 1-2 days | 2-5 days | 30 min | 1-2 hours | 1-3 days |
| Scale ceiling | High | Very high | Medium | Medium | Unlimited |
| Learning curve | Medium | High | Low | Low | High |
