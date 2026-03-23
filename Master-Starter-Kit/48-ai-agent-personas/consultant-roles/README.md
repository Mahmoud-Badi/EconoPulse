# Consultant Roles

Injectable expert personas that add specialist depth at specific orchestrator steps. Each consultant brings deep domain knowledge, clear reasoning frameworks, calibrated confidence thresholds, and explicit scope boundaries.

## Role Inventory

| File | Role | Inject At | Primary Focus |
|------|------|-----------|---------------|
| `technical-consultant.template.md` | Technical Consultant | Steps 4-7, 11, 12 | Systems architecture, scalability, performance, API design, testing |
| `business-consultant.template.md` | Business Consultant | Steps 1, 17.5, 28.9 | Product-market fit, unit economics, competitive positioning, prioritization |
| `marketing-consultant.template.md` | Marketing Consultant | Steps 19-28, 28.5 | Brand positioning, community growth, content strategy, GTM sequencing |
| `financial-consultant.template.md` | Financial Consultant | Steps 17.5, 28.9, 40 | SaaS metrics, financial modeling, runway planning, investor readiness |
| `security-consultant.template.md` | Security Consultant | Steps 14, 16, 50 | OWASP, auth patterns, compliance frameworks, threat modeling |
| `ux-consultant.template.md` | UX Consultant | Steps 6, 13, 39 | Interaction design, accessibility, design systems, usability heuristics |
| `domain-consultant.template.md` | Domain Consultant (Generator) | All steps (domain-dependent) | Industry-specific jargon, regulations, competitive dynamics, customer psychology |

## How Injection Works

1. **Orchestrator reaches an injection step** — The orchestrator checks which consultant roles are mapped to the current step.
2. **Persona is loaded** — The consultant role file is loaded into the agent's context, shifting its expertise and behavioral mode.
3. **Consultant operates within scope** — The consultant provides specialist recommendations within its domain and explicitly redirects out-of-scope questions to other consultants.
4. **Multiple consultants can be active** — Some steps inject multiple consultants (e.g., Step 17.5 loads both Business and Financial consultants).

## Scope Boundary Protocol

Every consultant has explicit scope boundaries. When a question crosses a consultant's boundary:

1. The active consultant states the constraint from its domain ("The security requirement is X")
2. It explicitly names which consultant should handle the implementation ("Bring in the UX Consultant for the login flow design")
3. It provides the domain-specific context the other consultant needs

This prevents consultants from giving shallow advice outside their expertise.

## Domain Consultant Generation

The Domain Consultant is a generator template, not a ready-to-use persona. During Step 1 (Discovery), the orchestrator:

1. Identifies the project's industry from intake answers
2. Fills the `{{DOMAIN_*}}` placeholders with industry-specific content
3. Saves the generated file as `domain-consultant-{{DOMAIN_SLUG}}.md`
4. Validates the generated persona passes the "10-year veteran" depth check

## Design Principles

These roles follow the TBK Labs multi-role system pattern:

- **Deep, not broad** — Each consultant knows their domain at expert depth rather than covering everything at surface level.
- **Explicit trade-offs** — Recommendations always include what you gain and what you lose.
- **Calibrated confidence** — Clear thresholds for when to state definitively vs recommend vs flag uncertainty.
- **Scope discipline** — Consultants that stay in their lane produce better advice than generalists.
