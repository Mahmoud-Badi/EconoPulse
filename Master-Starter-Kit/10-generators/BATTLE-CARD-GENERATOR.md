# Battle Card Generator

**Purpose:** Generate competitive battle cards from competitor audit data and tribunal research, producing one-page quick-reference cards for each competitor.

**Output:** Per-competitor battle cards in `marketing/competitive-intelligence/battle-cards/`

---

## When to Run

Run this generator during Orchestrator Step 28.5 (Competitive Intelligence Setup), after:

1. Tribunal research exists (from Step 3) — specifically competitor analysis files
2. Competitor marketing audit exists (from Step 19) — `competitor-marketing-audit.md`
3. Feature parity matrix has been created (from `28-competitive-intelligence/feature-parity-tracking.template.md`)

Can also be re-run during quarterly competitive reassessments.

---

## Inputs Required

| Input | Location | What It Provides |
|-------|----------|-----------------|
| Tribunal Competitor Research | `dev_docs/tribunal/` | Deep competitor analysis |
| Competitor Marketing Audit | `marketing/competitor-marketing-audit.md` | Marketing positioning, messaging |
| Competitive Pricing Analysis | `marketing/competitive-pricing-analysis.md` | Pricing tiers, value comparison |
| Feature Parity Matrix | `marketing/competitive-intelligence/feature-parity-tracking.md` | Feature comparison data |
| Project Brief | `dev_docs/project-brief.md` | Your product's positioning |
| Value Propositions | `marketing/value-proposition-canvas.md` | Your unique advantages |

---

## Generation Instructions

### Step 1: Identify Competitors

Read the competitor list from:
- CONFIG.COMPETITORS (from Orchestrator STATE BLOCK)
- Tribunal competitor research files
- Competitor marketing audit

Generate one battle card per competitor (up to 5 primary competitors).

### Step 2: For Each Competitor, Extract Data

From tribunal research and marketing audit, extract:

1. **Positioning**: How they describe themselves (from their homepage/about page)
2. **Target market**: Who they sell to
3. **Pricing**: All tier names, prices, and key features per tier
4. **Strengths**: What they genuinely do well (be honest)
5. **Weaknesses**: Where they fall short or have known issues
6. **Funding/size**: Crunchbase data, team size estimates

### Step 3: Generate Battle Card

For each competitor, resolve `28-competitive-intelligence/competitive-battle-cards.template.md`:

```markdown
## Battle Card: [Competitor Name]
> Last Updated: [date] | Review: Every quarter

**Their Positioning**: [from their homepage]
**Target Market**: [who they sell to]
**Pricing**: [tier summary]
**Founded**: [year] | **Funding**: [amount] | **Team Size**: [estimate]

---

### Where WE Win
| Advantage | Proof Point | Talking Point |
|-----------|------------|---------------|
| [advantage 1] | [evidence] | "Unlike [competitor], we..." |
| [advantage 2] | [evidence] | |
| [advantage 3] | [evidence] | |

### Where THEY Win (Be Honest)
| Their Advantage | Our Response | Mitigation |
|----------------|-------------|-----------|
| [their strength] | [honest assessment] | [what we do instead] |

### Objection Handling
| They Say | We Say |
|----------|--------|
| "[competitor] has [feature]" | "[our approach and why it's better for the user]" |

### Knockout Questions
1. "Have you tried [their weak area]?"
2. "How important is [our differentiator] to your workflow?"

### Head-to-Head (Key Differences Only)
| Feature | {{PROJECT_NAME}} | [Competitor] | Winner |
|---------|-------------------|--------------|--------|
| [key diff 1] | | | |
| [key diff 2] | | | |
```

### Step 4: Generate Summary Card

Create a single comparison summary across all competitors:

```markdown
## Competitive Landscape Summary

### Quick Reference
| Factor | {{PROJECT_NAME}} | Competitor 1 | Competitor 2 | Competitor 3 |
|--------|-------------------|-------------|-------------|-------------|
| Price (starter) | | | | |
| Best for | | | | |
| Biggest strength | | | | |
| Biggest weakness | | | | |
| Threat level | — | High/Med/Low | | |

### Our Unique Position
[1-2 sentences on what makes us different from ALL competitors]
```

---

## Output Files

Generate in `marketing/competitive-intelligence/battle-cards/`:

| File | Content |
|------|---------|
| `battle-card-{competitor-slug}.md` | One per competitor (up to 5) |
| `competitive-summary.md` | Cross-competitor comparison table |
| `README.md` | Index of all battle cards with last-updated dates |

---

## Presentation

```
BATTLE CARDS GENERATED:
  Competitors analyzed: [N]
  Battle cards created: [list of competitor names]
  Summary comparison: marketing/competitive-intelligence/battle-cards/competitive-summary.md

  Key finding: [one-sentence insight about competitive position]

  Next action: Review battle cards for accuracy, then share with team.
  Update cadence: Quarterly or after major competitor changes.
```

---

## Rules

- **Be honest about competitor strengths.** Dishonest battle cards damage credibility when prospects fact-check.
- **Use evidence, not opinions.** Every "where we win" needs a proof point (data, feature, testimonial).
- **Keep it to one page per competitor.** Battle cards are quick reference — save deep analysis for teardowns.
- **Update dates matter.** A battle card with no "Last Updated" date is assumed to be outdated.
- **Objection handling must be conversational.** Write how a person would actually speak, not marketing copy.
