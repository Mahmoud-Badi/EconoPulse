# 48 — AI Agent Personas

> **Purpose:** Transform the AI agent from a generic code assistant into a domain-expert co-founder with project-specific identity, knowledge, behavioral rules, and quality standards.

## Why This Exists

Without role prompting, AI agents take the path of least resistance — producing generic, shallow output that misses domain nuance and business context. A well-crafted persona system makes the AI:

- **Think in domain terms** — not just code, but business impact
- **Apply perspective checks** — would both the end user AND the business stakeholder approve this?
- **Resist lazy shortcuts** — prime directives enforce thoroughness over speed
- **Adapt by phase** — architecture thinking vs. marketing thinking vs. security thinking
- **Sound like an expert** — not a generic assistant regurgitating documentation

## Architecture

```
48-ai-agent-personas/
├── templates/                    # Composable persona blocks
│   ├── identity-block.template.md
│   ├── domain-knowledge-block.template.md
│   ├── prime-directives.template.md
│   ├── perspective-checks.template.md
│   ├── anti-patterns.template.md
│   ├── communication-style.template.md
│   └── quality-gates.template.md
│
├── archetypes/                   # Pre-built personas by project type
│   ├── saas-cto.md
│   ├── ecommerce-lead.md
│   ├── fintech-engineer.md
│   ├── consumer-app-lead.md
│   ├── devtools-architect.md
│   ├── content-platform-lead.md
│   ├── healthcare-engineer.md
│   └── agency-project-lead.md
│
├── consultant-roles/             # Injectable expert personas
│   ├── technical-consultant.template.md
│   ├── business-consultant.template.md
│   ├── marketing-consultant.template.md
│   ├── financial-consultant.template.md
│   ├── security-consultant.template.md
│   ├── ux-consultant.template.md
│   └── domain-consultant.template.md
│
├── phase-profiles/               # Phase-specific behavioral modes
│   ├── intake-profile.md
│   ├── research-profile.md
│   ├── architecture-profile.md
│   ├── planning-profile.md
│   ├── design-profile.md
│   ├── financial-profile.md
│   ├── marketing-profile.md
│   ├── security-profile.md
│   └── hardening-profile.md
│
└── examples/                     # Reference implementations
    ├── tbk-labs-claude-md.example.md
    └── saas-project-claude-md.example.md
```

## How It Works

### Step 1: Archetype Selection (During Intake — Step 1)

The orchestrator asks: "What type of product are you building?" and maps the answer to an archetype:

| Product Type | Archetype | Core Identity |
|---|---|---|
| SaaS / Platform | `saas-cto.md` | Technical co-founder building a scalable platform |
| E-commerce / Marketplace | `ecommerce-lead.md` | Commerce engineer obsessed with conversion and trust |
| Fintech / Regulated | `fintech-engineer.md` | Compliance-first engineer where bugs cost money |
| Consumer App | `consumer-app-lead.md` | Product-obsessed builder focused on delight and retention |
| Developer Tools / APIs | `devtools-architect.md` | Developer experience architect who eats their own dogfood |
| Content / Media | `content-platform-lead.md` | Content systems architect balancing creator and consumer needs |
| Healthcare / Compliance | `healthcare-engineer.md` | Patient-safety-first engineer in a regulated environment |
| Agency / Client Work | `agency-project-lead.md` | Delivery-focused lead balancing quality with client timelines |

### Step 2: Persona Generation (Step 2.5 — Agent Persona Generation)

1. Load the selected archetype as a base
2. Read the project brief and intake answers
3. Customize each template block with project-specific details:
   - **Identity**: Role title, project name, real consequences of mistakes
   - **Domain Knowledge**: Industry terms, business rules, edge cases from intake
   - **Prime Directives**: Behavioral rules tailored to the project's risk profile
   - **Perspective Checks**: Multi-stakeholder viewpoints from the project's personas
   - **Anti-Patterns**: Domain-specific "never do this" rules
4. Inject all blocks into CLAUDE.md (at the top, before project context)
5. User reviews and approves the persona

### Step 3: Phase Profiles (Throughout Orchestrator)

Each orchestrator phase loads a behavioral profile that shifts the AI's mindset:

| Phase | Profile | Mindset |
|---|---|---|
| Intake (Steps 1-2) | `intake-profile.md` | Curious interviewer — probe, clarify, never assume |
| Research (Step 3) | `research-profile.md` | Adversarial researcher — challenge, verify, stress-test |
| Architecture (Steps 4-7) | `architecture-profile.md` | Principal engineer — systems thinking, scalability, trade-offs |
| Planning (Steps 8-12) | `planning-profile.md` | Project manager — detail-oriented, dependency-aware, realistic |
| Design (Step 13) | `design-profile.md` | Design leader — user-centric, quality-obsessed, anti-generic |
| Financial (Step 17.5) | `financial-profile.md` | CFO — conservative estimates, investor-aware, data-driven |
| Marketing (Steps 19-28) | `marketing-profile.md` | Growth strategist — audience-first, credibility-focused |
| Security (Step 14) | `security-profile.md` | Security engineer — paranoid, compliance-driven, thorough |
| Hardening (Steps 29-33) | `hardening-profile.md` | QA lead — nothing ships without proof |

### Step 4: Consultant Roles (On-Demand)

Consultant personas are injected at specific orchestrator steps for expert-level depth:

- **Tribunal (Step 3)**: Technical + Business + Marketing consultants debate
- **Architecture (Steps 4-7)**: Technical consultant leads
- **Financial Modeling (Step 17.5)**: Financial consultant leads
- **Security Hardening (Step 14)**: Security consultant leads
- **Marketing Suite (Steps 19-28)**: Marketing consultant leads
- **Design System (Step 13)**: UX consultant leads

## Integration with CLAUDE.md

The generated CLAUDE.md follows this structure:

```markdown
# {{PROJECT_NAME}}

## IDENTITY
{{AGENT_IDENTITY_BLOCK}}

## DOMAIN KNOWLEDGE
{{AGENT_DOMAIN_KNOWLEDGE}}

## PRIME DIRECTIVES
{{AGENT_PRIME_DIRECTIVES}}

## PERSPECTIVE CHECKS
{{AGENT_PERSPECTIVE_CHECKS}}

## ANTI-PATTERNS
{{AGENT_ANTI_PATTERNS}}

---

## PROJECT CONTEXT
[... existing CLAUDE.md template content ...]
```

## Design Principles

1. **Archetypes are starting points, not straitjackets** — they provide a strong base that gets customized with project-specific details from intake
2. **Personas compound** — identity + domain knowledge + prime directives + perspective checks create behavioral depth no single prompt can achieve
3. **Phase profiles shift mindset** — the same AI should think differently during architecture vs. marketing
4. **Consultant roles add expertise** — injectable specialist knowledge for phases that need it
5. **Everything is project-specific** — generic "be thorough" rules are useless; "a false CRITICAL finding causes someone to waste $2,000 on parts they don't need" is powerful
