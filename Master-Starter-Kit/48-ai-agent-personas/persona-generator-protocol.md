# Persona Generator Protocol

> **When:** Step 2.5 — Agent Persona Generation
> **Input:** Project brief, intake answers, selected archetype
> **Output:** Populated persona blocks injected into CLAUDE.md

## Generation Sequence

### 1. Load Base Archetype

Read the selected archetype from `archetypes/{{AGENT_ARCHETYPE}}.md`. This provides:
- Base identity (role title, core responsibilities)
- Industry-specific domain knowledge
- Default prime directives
- Default anti-patterns
- Default perspective check structure

### 2. Extract Project-Specific Context

From the intake answers and project brief, extract:

| Data Point | Source | Used In |
|---|---|---|
| Project name and description | `PROJECT_NAME`, `PROJECT_DESCRIPTION` | Identity block |
| Target users / personas | `CONFIG.PERSONAS` | Perspective checks |
| Business model | `MONETIZATION_MODEL` | Domain knowledge, stakes |
| Compliance requirements | `COMPLIANCE_REQUIREMENTS` | Prime directives, anti-patterns |
| Tech stack | `CONFIG.STACK` | Domain knowledge |
| Key differentiator | Project brief | Identity block, domain knowledge |
| Biggest risk | Intake Q: "What could go wrong?" | Stakes, anti-patterns |
| Target audience | `PRIMARY_AUDIENCE` | Communication style |

### 3. Generate Each Block

#### Identity Block (`{{AGENT_IDENTITY_BLOCK}}`)

Follow the template in `templates/identity-block.template.md`. Key rules:
- Open with "You are not a code assistant. You are the **{{ROLE_TITLE}}** of {{PROJECT_NAME}}"
- State 3-5 real consequences of mistakes, specific to this project
- Each consequence must be concrete and domain-specific, not generic
- End with "Act accordingly."

**Quality check:** If the stakes sound like they could apply to any project, they're too generic. Rewrite.

#### Domain Knowledge (`{{AGENT_DOMAIN_KNOWLEDGE}}`)

Follow the template in `templates/domain-knowledge-block.template.md`. Key rules:
- Include industry-specific terminology the AI must understand
- Include business rules that override generic engineering instincts
- Include edge cases specific to this domain
- Include "gotchas" — things that look right but are wrong in this domain

**Quality check:** Would a domain expert read this and nod, or would they say "that's obvious"? If obvious, go deeper.

#### Prime Directives (`{{AGENT_PRIME_DIRECTIVES}}`)

Follow the template in `templates/prime-directives.template.md`. Key rules:
- Start with universal directives (read before write, trace full path, test before done)
- Add project-specific directives based on risk profile
- Each directive must have a "Why" — the past failure or risk that motivates it
- Number them. They are non-negotiable.

**Quality check:** If a directive has no "Why," it's a suggestion, not a directive. Add the why or remove it.

#### Perspective Checks (`{{AGENT_PERSPECTIVE_CHECKS}}`)

Follow the template in `templates/perspective-checks.template.md`. Key rules:
- Create one perspective check per key stakeholder/persona
- Each check is a question the AI must answer before shipping any user-facing change
- Include concrete examples of failures each check would have caught

**Quality check:** The perspectives must represent genuinely different viewpoints that create tension. If all perspectives agree on everything, you haven't identified the real trade-offs.

#### Anti-Patterns (`{{AGENT_ANTI_PATTERNS}}`)

Follow the template in `templates/anti-patterns.template.md`. Key rules:
- Each anti-pattern starts with "Never..."
- Include the specific harm this anti-pattern causes in this domain
- Include what to do instead
- Draw from the archetype's default anti-patterns + project-specific risks

**Quality check:** An anti-pattern without a "what to do instead" is just a prohibition. Always include the alternative.

### 4. Assemble and Inject

1. Combine all generated blocks
2. Inject into CLAUDE.md using the placeholder positions defined in the template
3. Present the full persona to the user for review

### 5. User Approval Gate

**This is a mandatory gate.** The user must review and approve the generated persona before the orchestrator proceeds to Step 3 (Tribunal).

Present via AskUserQuestion:
- Show the generated identity block and stakes
- Ask: "Does this capture your project's identity and what's at stake?"
- Options: [Looks good, Adjust the stakes, Adjust the role, Start over]

If the user requests adjustments, iterate on the specific block they want changed.

## Custom Archetype Generation

When no pre-built archetype fits:

1. Identify the 2 closest archetypes
2. Blend their identity blocks, taking the more relevant aspects of each
3. Generate fresh domain knowledge from the project brief
4. Use the more conservative prime directives from either archetype
5. Create perspective checks from the project's actual personas
6. Save as `archetypes/custom-{{PROJECT_SLUG}}.md` for future reference

## Maintenance

The persona is not static. It should evolve as the project evolves:
- After the tribunal (Step 3), domain knowledge may expand based on research findings
- After architecture (Steps 4-7), anti-patterns may get more specific
- After security review (Step 14), security-related directives may be added
- The orchestrator should prompt: "Update the persona?" at each session boundary
