# Communication Plan — {{PROJECT_NAME}}

> Master plan for stakeholder communication throughout the project lifecycle.

---

## Stakeholder Registry

| # | Name | Role | Audience Type | Preferred Channel | Update Cadence | Key Concerns |
|---|------|------|---------------|-------------------|----------------|--------------|
| 1 | {{STAKEHOLDER_1_NAME}} | {{STAKEHOLDER_1_ROLE}} | {{STAKEHOLDER_1_TYPE}} | {{STAKEHOLDER_1_CHANNEL}} | {{STAKEHOLDER_1_CADENCE}} | {{STAKEHOLDER_1_CONCERNS}} |
| 2 | {{STAKEHOLDER_2_NAME}} | {{STAKEHOLDER_2_ROLE}} | {{STAKEHOLDER_2_TYPE}} | {{STAKEHOLDER_2_CHANNEL}} | {{STAKEHOLDER_2_CADENCE}} | {{STAKEHOLDER_2_CONCERNS}} |
| 3 | {{STAKEHOLDER_3_NAME}} | {{STAKEHOLDER_3_ROLE}} | {{STAKEHOLDER_3_TYPE}} | {{STAKEHOLDER_3_CHANNEL}} | {{STAKEHOLDER_3_CADENCE}} | {{STAKEHOLDER_3_CONCERNS}} |

**Audience Types:** `executive` | `investor` | `client` | `team`
**Channels:** Email, Slack, Video Call, In-Person, Shared Doc, Miro Board
**Cadence:** Daily, Weekly, Bi-weekly, Sprint-aligned, Monthly, Quarterly, Milestone-triggered

---

## Communication Cadence

### Regular Updates

| Frequency | Audience | Format | Template | Owner |
|-----------|----------|--------|----------|-------|
| Weekly | All stakeholders | Written update | `recurring/weekly-stakeholder-update.template.md` | Project lead |
| Bi-weekly / Sprint end | Executive, Client | Sprint summary + demo | `phase-packs/04-active-development/sprint-summary-stakeholder.template.md` | Project lead |
| Monthly | Investor, Executive | Executive summary | `recurring/monthly-executive-summary.template.md` | Project lead |
| Quarterly | Investor, Board | Business review | `recurring/quarterly-business-review.template.md` | Project lead |

### Milestone-Triggered Updates

| Milestone | Audience | Format | Template |
|-----------|----------|--------|----------|
| Project kickoff | All | Kickoff deck + meeting | `phase-packs/01-discovery/` |
| Architecture approved | Executive, Client | System overview | `phase-packs/02-architecture/` |
| Sprint 1 start | All | Sprint goals + timeline | `phase-packs/03-sprint-planning/` |
| Each sprint end | All | Progress report + demo | `phase-packs/04-active-development/` |
| QA phase start | Client, Team | Quality plan | `phase-packs/05-testing-qa/` |
| Pre-launch | All | Feature showcase + go/no-go | `phase-packs/06-pre-launch/` |
| Post-launch | All | Results + next steps | `phase-packs/07-post-launch/` |

---

## Channel Matrix

When to use which channel:

| Situation | Channel | Why |
|-----------|---------|-----|
| Regular status updates | Email / Shared doc | Async, stakeholders read on their schedule |
| Blocking decisions needed | Video call + follow-up email | Urgency + paper trail |
| Demo / showcase | Video call with screen share | Visual impact, real-time Q&A |
| Architecture / roadmap overview | Miro board | Interactive, stakeholders can explore |
| Risk / blocker escalation | Direct message + email | Immediate attention + documentation |
| Celebrating milestones | Team channel + email | Visibility + morale |

---

## Escalation Protocol

| Level | Trigger | Who to Notify | Response Time | Format |
|-------|---------|---------------|---------------|--------|
| **L1 — Info** | Minor delay, workaround found | Project lead notes it | Next regular update | Mentioned in weekly update |
| **L2 — Attention** | Task blocked >2 days, scope question | Executive / Client | 24 hours | Direct message + brief |
| **L3 — Urgent** | Sprint goal at risk, budget concern | All stakeholders | 4 hours | Emergency update email |
| **L4 — Critical** | Project timeline at risk, major blocker | All stakeholders + leadership | 1 hour | Video call + written summary |

---

## Communication Rules

1. **No surprises.** Bad news travels fast — stakeholders hear about risks BEFORE they become problems.
2. **Traffic-light everything.** Every update uses [GREEN] / [YELLOW] / [RED] status indicators.
3. **Translate technical to business.** Never send raw technical jargon to non-technical stakeholders.
4. **Visual first.** Lead with diagrams, roadmaps, and progress bars. Text supports visuals, not the other way around.
5. **"What changed" diffs.** Every recurring report starts with what's new since the last update.
6. **Celebrate wins.** Don't just report status — call out milestones achieved and progress made.
7. **Action items are explicit.** Every update that needs a decision ends with a clear ask and deadline.
8. **One source of truth.** All communications are generated from `dev_docs/comms/` — no side channels.

---

## Output Directory

All generated communications go to:
```
dev_docs/comms/
├── communication-plan.md          ← This file (resolved)
├── audience-matrix.md
├── 01-kickoff/
├── 02-architecture/
├── 03-sprint-planning/
├── 04-active-development/
├── 05-testing/
├── 06-pre-launch/
├── 07-post-launch/
├── miro/
├── diagrams/
├── recurring/
│   ├── weekly/
│   ├── monthly/
│   └── quarterly/
└── handoff-package/
```
