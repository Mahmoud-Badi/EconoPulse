# Persona Decision Tree

> **When:** Step 1 intake — after project type is identified
> **Purpose:** Map the project to the correct archetype and determine which consultant roles and phase profiles to activate

## Primary Archetype Selection

Ask during intake (AskUserQuestion):

**"What best describes the product you're building?"**

| Answer | Archetype | Key Traits |
|---|---|---|
| SaaS platform / B2B tool | `saas-cto.md` | Scalability, multi-tenancy, subscription economics, API-first |
| E-commerce / Marketplace | `ecommerce-lead.md` | Conversion optimization, trust signals, payment flows, inventory |
| Fintech / Payments / Banking | `fintech-engineer.md` | Regulatory compliance, audit trails, money handling, security-first |
| Consumer mobile/web app | `consumer-app-lead.md` | User delight, retention loops, viral mechanics, performance |
| Developer tools / API / SDK | `devtools-architect.md` | DX, documentation, SDK design, dogfooding, developer trust |
| Content / Media / Publishing | `content-platform-lead.md` | Content systems, creator tools, distribution, engagement |
| Healthcare / Medical / Biotech | `healthcare-engineer.md` | Patient safety, HIPAA/regulatory, clinical workflows, data sensitivity |
| Agency project / Client work | `agency-project-lead.md` | Delivery timelines, client communication, handoff quality, budget |

**If none fit:** Use the `persona-generator-protocol.md` to create a custom archetype from intake answers.

## Secondary Signals (Refine the Archetype)

These intake answers further customize the persona:

| Signal | Impact on Persona |
|---|---|
| `COMPLIANCE_REQUIREMENTS` contains HIPAA/SOC2/PCI | Amplify security and audit trail directives |
| `HAS_MOBILE = true` | Add mobile-specific perspective checks |
| `MONETIZATION_MODEL = marketplace` | Add supply/demand balance perspective |
| `IS_MULTI_TENANT = true` | Add tenant isolation paranoia to anti-patterns |
| `FUNDRAISING_STAGE` is seed/series-a | Add investor-readiness perspective |
| `TARGET_GEOGRAPHY` is multi-region | Add i18n/localization perspective |
| `HAS_AI = true` | Add AI safety, hallucination, and cost-awareness directives |

## Consultant Role Activation Matrix

Not all consultant roles are needed for every project. Activate based on project signals:

| Consultant Role | Always Active | Conditional Activation |
|---|---|---|
| Technical | Yes | — |
| Business | Yes | — |
| Marketing | Yes | — |
| Financial | Yes (Step 17.5 is mandatory) | — |
| Security | Yes | Amplified if compliance requirements exist |
| UX | Yes | Amplified if consumer-facing product |
| Domain | No | Generated only if project has specialized domain knowledge |

## Phase Profile Activation

All 9 phase profiles are always active — they shift the AI's behavioral mode as the orchestrator progresses through phases. No conditional logic needed.

## Custom Archetype Generation

If the project doesn't match any pre-built archetype:

1. Read the project brief and intake answers
2. Follow `persona-generator-protocol.md`
3. Generate a custom archetype that blends the closest 2 pre-built archetypes
4. Add project-specific domain knowledge, stakes, and anti-patterns
5. Save as `archetypes/custom-{{PROJECT_SLUG}}.md` for reference
