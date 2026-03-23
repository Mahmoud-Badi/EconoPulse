# Decision Journal

> Captures ALL important decisions across the project lifecycle — not just architecture (that's the ADR log), but also product, scope, pricing, vendor, and process decisions. Lighter weight than ADRs. Add entries continuously during development, not just during planning.

---

## Project

- **Name:** {{PROJECT_NAME}}
- **Started:** {{START_DATE}}
- **Last Reviewed:** YYYY-MM-DD

---

## Decision Log

| Date | Decision | Category | Rationale | Decided By | Revisit Date |
|------|----------|----------|-----------|------------|--------------|
| {{START_DATE}} | Use {{FRONTEND_FRAMEWORK}} + {{BACKEND_FRAMEWORK}} stack | Technical | {{STACK_RATIONALE}} | {{PROJECT_OWNER}} | — |
| {{START_DATE}} | Target {{TARGET_MARKET}} as primary market | Product | {{MARKET_RATIONALE}} | {{PROJECT_OWNER}} | +90 days |
| | | | | | |

---

## Category Definitions

| Category | What belongs here | Examples |
|----------|-------------------|----------|
| **Technical** | Stack, infrastructure, library choices | "Use Redis for session storage", "Switch from REST to GraphQL for mobile" |
| **Product** | Features, UX direction, user-facing behavior | "Add onboarding wizard", "Remove social login — low usage" |
| **Scope** | What's in/out of MVP, phase boundaries | "Defer reporting to Phase 2", "Cut admin dashboard from MVP" |
| **Pricing** | Monetization, tier structure, trial length | "Free tier limited to 3 projects", "Annual discount at 20%" |
| **Vendor** | Third-party tools, services, partnerships | "Use Resend over SendGrid — better DX", "Switch from Vercel to Railway" |
| **Process** | Team workflow, review cadence, communication | "Daily standups replaced with async updates", "PR reviews within 4 hours" |

---

## How to Add Entries

1. **When:** Any time a decision is made that affects the project direction, cost, timeline, or user experience.
2. **Who:** Anyone on the team. Capture the decision-maker in the "Decided By" column.
3. **Revisit Date:** Set a date if the decision might need re-evaluation (pricing experiments, vendor trials, scope deferrals). Use "—" for permanent decisions.
4. **Rationale:** Be specific. "Seemed right" is not a rationale. "Reduces API calls by 60% based on load test" is.

**Quick-add format** (paste and fill):
```
| YYYY-MM-DD | [What was decided] | [Category] | [Why] | [Who] | [Revisit date or —] |
```

---

## Relationship to ADR Decision Log

This journal **supplements** the ADR-style `decision-log.md` created in Step 8.2:

| | Decision Journal (this file) | ADR Decision Log |
|---|---|---|
| **Scope** | All decisions | Architecture decisions only |
| **Depth** | One-line rationale | Full context, alternatives considered, consequences |
| **When to use** | Quick capture during any meeting or session | When the decision is complex and needs detailed analysis |
| **Format** | Table row | Structured document per decision |

**Rule of thumb:** If you need more than 2 sentences to explain the rationale, write an ADR instead and link to it from this journal.

---

## Monthly Review Protocol

**Cadence:** First working day of each month (add to team calendar).

### Review Checklist

- [ ] Scan all entries with a **Revisit Date** in the past — do they still hold?
- [ ] Flag decisions where the original rationale no longer applies (market changed, usage data contradicts, team grew)
- [ ] Mark reversed decisions with ~~strikethrough~~ and add a new entry explaining the reversal
- [ ] Check for implicit decisions — things the team "just started doing" without recording. Capture them.
- [ ] Archive decisions older than 6 months that are fully settled (move to "Archived Decisions" section below)

### Review Summary

| Review Date | Decisions Reviewed | Reversed | New Entries Added | Notes |
|-------------|-------------------|----------|-------------------|-------|
| | | | | |

---

## Archived Decisions

<!-- Move fully settled decisions here after 6+ months to keep the active log scannable. -->

| Date | Decision | Category | Rationale | Decided By | Archived On |
|------|----------|----------|-----------|------------|-------------|
| | | | | | |

---

## Getting Started

1. Pre-populate with decisions made during intake (Step 1) and tribunal (Steps 2-4)
2. Add a calendar reminder for monthly reviews
3. Bookmark this file — it should be open during every planning session
4. When in doubt about whether to log something: log it. A 30-second entry now saves a 30-minute "why did we do this?" conversation later.
