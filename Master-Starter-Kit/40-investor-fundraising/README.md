# Section 40 — Investor & Fundraising

> Money is a tool, not a milestone. This section helps you raise capital efficiently — if and when you need it — with investor-ready artifacts, a structured process, and the financial literacy to negotiate from a position of strength.

---

## Purpose

Section 40 provides a complete fundraising toolkit for founders who have decided — or are deciding — whether external capital is the right move for **{{PROJECT_NAME}}**. It covers the entire lifecycle from "should we raise?" through closing a round, managing investor relationships, and maintaining good governance post-investment.

This is not a "raise money because that's what startups do" section. The decision tree starts with whether you should raise at all. Every template is designed to keep founders informed, prepared, and in control of their cap table, board, and company trajectory.

---

## Orchestrator Step

| Field | Value |
|---|---|
| **Step** | 28.9 |
| **Skip Condition** | `CONFIG.FUNDRAISING_ENABLED == "false"` |
| **Gate** | Section 25 (Financial Model) should be substantially complete before fundraising artifacts are built |

---

## Section Relationships

| Section | Relationship | Why It Matters |
|---|---|---|
| **25 — Financial Model** | Upstream dependency | Your financial projections feed directly into pitch decks, valuation models, and investor conversations |
| **29 — Pricing & Monetization** | Peer input | Revenue model and unit economics are core to investor due diligence |
| **31 — Metrics & KPIs** | Peer input | Traction metrics, dashboards, and KPI targets appear in pitch decks and board updates |
| **35 — Legal & Compliance** | Downstream consumer | Term sheets, SAFE agreements, corporate governance, and IP protection all intersect with legal |

---

## File Inventory

| # | File | Type | Purpose |
|---|---|---|---|
| 1 | `README.md` | Guide | This file — section overview, relationships, and usage instructions |
| 2 | `fundraising-decision-tree.md` | Guide | Structured decision framework: raise or not, stage, capital type, amount, investor type |
| 3 | `pitch-deck-framework.template.md` | Template | 12-slide pitch deck structure with per-slide guidance and common mistakes |
| 4 | `cap-table-planning.template.md` | Template | Ownership modeling, option pools, dilution scenarios, SAFE conversions |
| 5 | `fundraising-process.template.md` | Template | End-to-end fundraising process from preparation through closing |
| 6 | `investor-crm.template.md` | Template | Pipeline tracking, tagging, follow-up rules, and funnel reporting |
| 7 | `due-diligence-prep.template.md` | Template | Data room structure, document checklists, and common DD Q&A |
| 8 | `term-sheet-analysis.template.md` | Template | Economic and control term analysis, red flags, negotiation playbook |
| 9 | `board-deck.template.md` | Template | Board meeting presentation template with metrics and discussion framework |
| 10 | `investor-update-cadence.template.md` | Template | Monthly/quarterly investor update emails, metrics tables, ask framework |
| 11 | `fundraising-timeline.template.md` | Template | 16-week fundraising timeline with phase gates and weekly checklists |
| 12 | `valuation-modeling.template.md` | Template | Comparable analysis, DCF, revenue multiples, negotiation range calculator |
| 13 | `fundraising-gotchas.md` | Guide | 16 common fundraising mistakes ranked by severity with mitigations |

---

## Key Placeholders

All placeholders used across this section's files:

| Placeholder | Description | Example Value |
|---|---|---|
| `{{FUNDRAISING_ENABLED}}` | Whether fundraising section is active | `true` / `false` |
| `{{FUNDRAISING_STAGE}}` | Current or target fundraising stage | `pre-seed`, `seed`, `series-a`, `growth` |
| `{{TARGET_RAISE_AMOUNT}}` | Dollar amount targeted for the round | `$2,000,000` |
| `{{CURRENT_RUNWAY_MONTHS}}` | Months of cash remaining at current burn | `8` |
| `{{PRE_MONEY_VALUATION}}` | Pre-money valuation for current/target round | `$10,000,000` |
| `{{FOUNDER_COUNT}}` | Number of co-founders | `2` |
| `{{OPTION_POOL_SIZE}}` | Size of employee option pool (%) | `10%` |
| `{{INVESTOR_TYPE}}` | Primary investor type being targeted | `angel`, `micro-vc`, `institutional`, `strategic` |
| `{{BOARD_SIZE}}` | Number of board seats | `3` |
| `{{BOARD_MEETING_CADENCE}}` | How often the board meets | `quarterly` |
| `{{INVESTOR_UPDATE_CADENCE}}` | How often investor updates are sent | `monthly` |
| `{{DATA_ROOM_TOOL}}` | Tool used for the data room | `Google Drive`, `DocSend`, `Notion` |
| `{{CAP_TABLE_TOOL}}` | Tool used for cap table management | `Carta`, `Pulley`, `Spreadsheet` |
| `{{FUNDRAISING_CRM}}` | Tool used for investor pipeline tracking | `Affinity`, `Attio`, `Notion`, `Spreadsheet` |
| `{{SAFE_OR_PRICED}}` | Instrument type for the round | `SAFE`, `priced-round` |
| `{{PROJECT_NAME}}` | Name of the project/company | `Acme Corp` |

---

## Usage Instructions

### First-Time Setup

1. **Start with the decision tree** (`fundraising-decision-tree.md`) — even if you think you want to raise, walk through the nodes to validate that assumption and clarify your parameters.
2. **Fill in placeholders** — once you know your stage, amount, and investor type, populate the placeholders across all templates.
3. **Build your pitch deck** (`pitch-deck-framework.template.md`) — this forces you to articulate the story before you talk to anyone.
4. **Prepare your data room** (`due-diligence-prep.template.md`) — do this before outreach, not after a VC asks for it.
5. **Set up your CRM** (`investor-crm.template.md`) — track every interaction from day one.
6. **Run the process** (`fundraising-process.template.md` + `fundraising-timeline.template.md`) — follow the phased timeline.

### During the Raise

7. **Evaluate term sheets** (`term-sheet-analysis.template.md`) — never sign without running through the red flags checklist.
8. **Model your cap table** (`cap-table-planning.template.md`) — understand dilution impact before accepting terms.
9. **Check valuation** (`valuation-modeling.template.md`) — ensure your ask is defensible with comparable data.

### Post-Close

10. **Set up board cadence** (`board-deck.template.md`) — prepare your first board deck before the first meeting.
11. **Start investor updates** (`investor-update-cadence.template.md`) — begin monthly updates immediately after closing.

### Ongoing Reference

12. **Review gotchas** (`fundraising-gotchas.md`) — revisit before each major fundraising decision.

---

## Conditional Logic

<!-- IF {{FUNDRAISING_ENABLED}} == "false" -->
**This section is disabled.** Set `FUNDRAISING_ENABLED` to `true` in your project configuration to activate fundraising templates.
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "pre-seed" -->
**Pre-Seed Focus:** Prioritize the pitch deck, SAFE terms, and angel investor outreach. Cap table modeling should focus on SAFE conversion scenarios. Board governance is typically informal at this stage.
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "seed" -->
**Seed Focus:** Full pitch deck, data room, and CRM are essential. Begin thinking about board structure. Term sheet analysis becomes critical if priced rounds are on the table.
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "series-a" -->
**Series A Focus:** All templates are in play. Board governance, detailed financial due diligence, and valuation modeling are front and center. Expect 3-6 month process timelines.
<!-- ENDIF -->

<!-- IF {{FUNDRAISING_STAGE}} == "growth" -->
**Growth Stage Focus:** Emphasis shifts to financial metrics, competitive positioning, and institutional investor relationships. Board deck quality and investor update consistency are table stakes.
<!-- ENDIF -->

---

## Quality Checklist

Before considering this section complete, verify:

- [ ] Decision tree has been walked through and fundraising decision is documented
- [ ] All placeholders are populated with real values (no `{{...}}` remaining in working copies)
- [ ] Pitch deck framework has been adapted to {{PROJECT_NAME}}'s specific story
- [ ] Cap table reflects current ownership and models at least 2 future dilution scenarios
- [ ] Data room is organized and all required documents are uploaded to {{DATA_ROOM_TOOL}}
- [ ] Investor CRM is set up in {{FUNDRAISING_CRM}} with initial target list
- [ ] Term sheet red flags checklist has been reviewed with legal counsel
- [ ] Board deck template is ready for first post-close board meeting
- [ ] Investor update template is drafted and distribution list is populated
- [ ] Fundraising timeline has been adapted with real dates
- [ ] Valuation model uses current comparable data, not placeholder benchmarks
- [ ] Gotchas document has been reviewed by all founders

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | {{CURRENT_DATE}} | Initial creation — full 13-file section |
