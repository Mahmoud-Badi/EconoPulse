# Investor CRM

> Pipeline tracking, tagging taxonomy, follow-up rules, and funnel reporting for {{PROJECT_NAME}}'s fundraising process. A disciplined CRM practice is the difference between a structured raise and a chaotic one.

---

## 1. CRM Setup

### Tool Selection

| Tool | Best For | Cost | Key Feature |
|---|---|---|---|
| **Affinity** | Relationship-driven fundraising | $$ | Automatic relationship tracking from email/calendar |
| **Attio** | Modern CRM with flexibility | $-$$ | Customizable objects and workflows |
| **Notion** | Teams already using Notion | Free-$ | Database views, templates, easy to customize |
| **Airtable** | Structured data + flexibility | Free-$ | Multiple views, automations, integrations |
| **Google Sheets** | Minimal setup, zero cost | Free | Familiar, no learning curve, limited at scale |
| **HubSpot (Free)** | Full CRM features | Free | Pipeline views, email tracking, automation |

**Selected Tool:** {{FUNDRAISING_CRM}}

### Database Setup

Create a single investor database with the fields defined in Section 2. Every investor interaction should be logged within 24 hours. Assign one person as CRM owner to maintain data quality.

---

## 2. CRM Fields

### Contact Record Fields

| Field | Type | Required | Description |
|---|---|---|---|
| **Investor Name** | Text | Yes | Full name of the individual |
| **Fund / Organization** | Text | Yes | Name of the fund or angel |
| **Title / Role** | Text | Yes | Partner, Principal, Associate, Angel |
| **Email** | Email | Yes | Primary contact email |
| **Phone** | Phone | No | If provided |
| **LinkedIn** | URL | No | Profile link |
| **Twitter/X** | URL | No | Handle for social engagement |
| **Pipeline Stage** | Select | Yes | See Stage definitions below |
| **Priority Tier** | Select | Yes | Tier 1 / Tier 2 / Tier 3 |
| **Warm Intro Path** | Text | Yes | Who can introduce you |
| **Intro Source** | Text | Yes | How you found this investor |
| **First Contact Date** | Date | Yes | When first outreach was sent |
| **Last Contact Date** | Date | Yes | Most recent interaction |
| **Next Action** | Text | Yes | What needs to happen next |
| **Next Action Date** | Date | Yes | When the next action is due |
| **Stage Focus** | Multi-Select | Yes | Pre-Seed, Seed, A, Growth |
| **Sector Focus** | Multi-Select | Yes | Relevant verticals |
| **Typical Check Size** | Currency Range | No | Min-Max investment range |
| **Fund Size** | Currency | No | AUM of the fund |
| **Portfolio Conflicts** | Text | No | Known competitive investments |
| **Notes** | Long Text | No | Running notes on interactions |
| **Decision Maker?** | Checkbox | Yes | Can this person write a check or make an investment decision? |
| **Passed Reason** | Text | No | If they passed — why? |
| **Referred By** | Text | No | Who referred them to you |
| **Materials Sent** | Multi-Select | No | Deck, One-Pager, Data Room, Financial Model |
| **Interest Level** | Select | No | Cold, Warm, Hot |

---

## 3. Pipeline View

### Stage Definitions

| Stage | Criteria | Typical Count | Action Required |
|---|---|---|---|
| **Identified** | On target list, not yet contacted | 50-100 | Research, find warm intro path |
| **Outreach Sent** | First message sent, awaiting response | 20-40 | Follow-up per cadence rules |
| **Responded** | Investor replied, meeting not yet scheduled | 10-20 | Schedule meeting within 48 hours |
| **First Meeting** | Initial meeting completed | 10-15 | Send follow-up, assess interest |
| **Deep Dive** | Multiple meetings, DD in progress | 3-8 | Provide materials, answer questions |
| **Term Sheet** | Written terms received | 1-3 | Review with counsel, negotiate |
| **Committed** | Verbal or written commitment to invest | 1-5 | Execute documents |
| **Closed** | Funds wired | — | Update cap table |
| **Passed** | Declined at any stage | — | Log reason, maintain relationship |
| **Paused** | Timing not right, may re-engage later | — | Set reminder to follow up |

### Kanban Board Layout

```
| Identified | Outreach | Responded | 1st Meeting | Deep Dive | Term Sheet | Committed | Closed |
|------------|----------|-----------|-------------|-----------|------------|-----------|--------|
| Card       | Card     | Card      | Card        | Card      | Card       | Card      | Card   |
| Card       | Card     | Card      | Card        | Card      |            |           |        |
| Card       | Card     | Card      | Card        |           |            |           |        |
| Card       | Card     |           |             |           |            |           |        |
| ...        | ...      |           |             |           |            |           |        |
```

### Priority Tiers

| Tier | Criteria | Outreach Strategy | Follow-Up Cadence |
|---|---|---|---|
| **Tier 1** | Dream investors — perfect stage, sector, and value-add fit | Warm intro only; extensive research; customized pitch | Every 3-5 days |
| **Tier 2** | Strong fit — right stage and sector, moderate value-add | Warm intro preferred; personalized cold email acceptable | Every 5-7 days |
| **Tier 3** | Acceptable fit — right stage, sector overlap | Personalized cold email | Every 7-10 days |

---

## 4. Tagging Taxonomy

### Contact Tags

| Tag Category | Tags | Purpose |
|---|---|---|
| **Investor Type** | `angel`, `micro-vc`, `institutional-vc`, `strategic`, `family-office`, `syndicate` | Filter by investor category |
| **Stage Focus** | `pre-seed`, `seed`, `series-a`, `growth` | Match to your current raise |
| **Sector** | `saas`, `fintech`, `healthtech`, `consumer`, `marketplace`, `devtools`, `climate`, `ai-ml`, `edtech`, `ecommerce` | Sector alignment |
| **Geography** | `sf-bay`, `nyc`, `la`, `boston`, `remote-ok`, `eu`, `asia` | Location relevance |
| **Relationship Warmth** | `cold`, `met-once`, `warm`, `strong-relationship` | Outreach strategy selection |
| **Value-Add** | `domain-expert`, `operator-background`, `strong-network`, `board-experience`, `technical`, `go-to-market` | What they bring beyond capital |
| **Decision Speed** | `fast-mover`, `standard`, `slow-process` | Timeline expectation setting |
| **Round Role** | `potential-lead`, `follow-on-only`, `co-lead-ok` | Round construction planning |

### Interaction Tags

| Tag | Use When |
|---|---|
| `intro-requested` | Warm intro has been requested but not yet made |
| `intro-made` | Introduction has been sent |
| `deck-sent` | Pitch deck shared |
| `data-room-access` | Data room access granted |
| `reference-call` | Investor is doing reference checks |
| `partner-meeting` | Scheduled or completed partner meeting |
| `term-sheet-received` | Term sheet has been received |
| `negotiating` | Active negotiation on terms |
| `verbal-commit` | Verbal commitment received |
| `docs-out` | Legal documents sent for signature |

---

## 5. Follow-Up Rules

### Automated Follow-Up Triggers

| Trigger | Action | Timing |
|---|---|---|
| Outreach sent, no response | Follow-up email #1 | 5 business days |
| Follow-up #1 sent, no response | Follow-up email #2 (final) | 10 business days after original |
| First meeting completed | Thank-you email + materials | Same day (within 4 hours) |
| Deep dive meeting completed | Summary + next steps email | Same day |
| Data room access granted, no activity | Check-in email | 5 business days |
| Term sheet sent, no response | Check-in call | 3 business days |
| Investor passed | Thank-you + feedback request | Same day |
| Investor paused ("not right now") | Re-engagement with traction update | 30/60/90 days (based on reason) |

### Follow-Up Escalation Matrix

| Days Since Last Contact | Stage | Action |
|---|---|---|
| 3 days | Deep Dive | Email check-in |
| 5 days | Outreach Sent | Follow-up #1 |
| 5 days | Deep Dive | Call or text |
| 7 days | First Meeting | Follow-up with new traction data |
| 10 days | Outreach Sent | Follow-up #2 (final) |
| 10 days | Deep Dive | Escalate — consider this a soft pass |
| 14 days | Any stage (no response) | Move to Passed or Paused |

### Weekly CRM Hygiene Checklist

- [ ] All interactions from the past week are logged with notes
- [ ] Every active contact has a "Next Action" and "Next Action Date"
- [ ] No "Next Action Date" is in the past (overdue items are addressed)
- [ ] Pipeline stage is accurate for every contact
- [ ] New introductions received have been added to the CRM
- [ ] Passed investors have documented reasons
- [ ] Tags are applied consistently

---

## 6. Reporting — Funnel Metrics

### Weekly Pipeline Report

| Metric | This Week | Last Week | Change |
|---|---|---|---|
| Total investors in pipeline | | | |
| New investors added | | | |
| Outreach emails sent | | | |
| Response rate | % | % | |
| First meetings held | | | |
| Second meetings held | | | |
| Term sheets received | | | |
| Committed capital | $ | $ | |
| Investors passed | | | |

### Funnel Conversion Report

| Stage Transition | Count | Conversion Rate | Avg Days in Stage |
|---|---|---|---|
| Identified → Outreach Sent | | % | |
| Outreach Sent → Responded | | % | |
| Responded → First Meeting | | % | |
| First Meeting → Deep Dive | | % | |
| Deep Dive → Term Sheet | | % | |
| Term Sheet → Committed | | % | |
| Committed → Closed | | % | |
| **Overall: Identified → Closed** | | **%** | |

### Round Progress Dashboard

| Metric | Target | Current | % Complete |
|---|---|---|---|
| Raise Amount | {{TARGET_RAISE_AMOUNT}} | $ | % |
| Lead Investor | 1 | | |
| Total Investors Committed | | | |
| Average Check Size | $ | $ | |
| Days Since Fundraising Start | | | |
| Projected Close Date | | | |

### Pass Reason Analysis

Track why investors pass to improve your pitch and targeting:

| Pass Reason | Count | % of Passes | Action |
|---|---|---|---|
| Too early / insufficient traction | | % | Build more before re-approaching |
| Sector mismatch | | % | Improve targeting criteria |
| Portfolio conflict | | % | Better pre-screening |
| Valuation concern | | % | Evaluate pricing or improve justification |
| Market size concern | | % | Strengthen market analysis |
| Team concern | | % | Address hiring gaps |
| Timing / fund deployment | | % | Re-engage in 6-12 months |
| No response (assumed pass) | | % | Improve outreach quality |

---

## CRM Best Practices

### Do

- [ ] Log every interaction within 24 hours — memory degrades fast
- [ ] Include specific quotes and concerns from investor conversations
- [ ] Tag contacts consistently so filters and reports are reliable
- [ ] Share the CRM with co-founders so anyone can pick up a conversation
- [ ] Review pipeline weekly with your co-founder or advisor
- [ ] Use the CRM to prepare for meetings — re-read notes before every call
- [ ] Track "who introduced whom" — you will want to thank them later

### Do Not

- [ ] Let the CRM become stale — a stale CRM is worse than no CRM
- [ ] Track only positive interactions — log passes and objections too
- [ ] Use the CRM as a vanity dashboard — honest data leads to better decisions
- [ ] Forget to update stage transitions — a contact in the wrong stage creates confusion
- [ ] Rely on memory instead of notes — you will meet 50+ investors and they will blur together
