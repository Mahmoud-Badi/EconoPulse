# Lessons Learned Register

> A living document that grows during development. Captures project-specific lessons — what worked, what didn't, and what to do differently. Different from the kit's `13-lessons-gotchas/` which contains generic, cross-project lessons.

---

## Project

- **Name:** {{PROJECT_NAME}}
- **Industry:** {{INDUSTRY}}
- **Stack:** {{FRONTEND_FRAMEWORK}} + {{BACKEND_FRAMEWORK}} + {{DATABASE}}
- **Last Updated:** YYYY-MM-DD

---

## Tribunal Insights (Pre-Development)

<!-- Populated during Steps 2-4. What competitors got wrong, what users hate, what the market punishes. -->

### What Competitors Got Wrong

| Competitor | Mistake | How {{PROJECT_NAME}} Avoids It | Source |
|------------|---------|-------------------------------|--------|
| {{COMPETITOR_1}} | | | Tribunal Round 1 |
| {{COMPETITOR_2}} | | | Tribunal Round 1 |
| {{COMPETITOR_3}} | | | Tribunal Round 1 |

### What Users Hate (Top Frustrations)

| Persona | Frustration | Our Mitigation | Validated? |
|---------|-------------|----------------|------------|
| {{PERSONA_1}} | {{PERSONA_1_FRUSTRATION}} | | Not yet |
| {{PERSONA_2}} | {{PERSONA_2_FRUSTRATION}} | | Not yet |

### Market Anti-Patterns

<!-- Things the market consistently gets wrong that {{PROJECT_NAME}} can exploit. -->

1. <!-- e.g., "Every competitor requires a phone call to get pricing — we show it on the website." -->
2. <!-- e.g., "Onboarding takes 5+ steps everywhere — we target 2 steps to first value." -->

---

## Development Lessons

<!-- Add entries as you learn them. Do not wait until the end of a sprint. -->

| Date | Lesson | Category | Impact | Action Taken |
|------|--------|----------|--------|--------------|
| | | | | |

### Category Definitions

| Category | Scope | Examples |
|----------|-------|----------|
| **Technical** | Code, architecture, infrastructure | "Prisma migrations break if you rename + add a column in one step" |
| **Process** | Workflow, communication, tooling | "Code reviews take 2x longer without a PR template" |
| **Product** | Features, UX, user behavior | "Users ignored the tutorial — inline hints work better" |
| **Customer** | Feedback, support patterns, sales | "Enterprise prospects always ask about SSO in the first call" |
| **Vendor** | Third-party services, APIs, tools | "Stripe webhook retries can cause duplicate processing without idempotency keys" |

### Impact Levels

| Impact | Meaning | Example |
|--------|---------|---------|
| **Critical** | Cost us significant time, money, or users | Data loss incident, missed launch deadline by weeks |
| **High** | Slowed the team or degraded quality noticeably | Wrong abstraction forced 3-day refactor |
| **Medium** | Caused friction but was recoverable | Dependency upgrade broke tests, fixed in half a day |
| **Low** | Minor inconvenience, good to know | Config file naming convention was confusing |

### Quick-Add Format

```
| YYYY-MM-DD | [What we learned] | [Category] | [Impact] | [What we did about it] |
```

---

## Patterns and Themes

<!-- Updated during monthly reviews. Group recurring lessons into themes. -->

### Recurring Technical Lessons

- <!-- e.g., "We keep underestimating migration complexity — add 50% buffer to DB tasks" -->

### Recurring Process Lessons

- <!-- e.g., "Async communication works for status updates, but design decisions need synchronous discussion" -->

### Recurring Product Lessons

- <!-- e.g., "Users don't read documentation — every error message must be self-explanatory" -->

---

## Monthly Review Protocol

**Cadence:** End of each month, or end of each sprint (whichever is shorter).

### Review Checklist

- [ ] Review all new entries from the past month
- [ ] Identify patterns — are we making the same type of mistake repeatedly?
- [ ] Update "Patterns and Themes" section above
- [ ] Check if any lesson should become a permanent process change (add to team docs or linting rules)
- [ ] Validate tribunal insights — did our mitigations work? Update "Validated?" column.
- [ ] Share top 3 lessons with the team (Slack post, retro, or standup)

### Retrospective Integration

Use this register as **input** to sprint retrospectives:

1. Pull all entries from the sprint period
2. Group by category
3. For each High/Critical item, ask: "Is this systemic or one-off?"
4. Systemic items become process changes; one-off items stay as documentation

### Review Log

| Review Date | Entries Reviewed | Patterns Found | Process Changes Made |
|-------------|-----------------|----------------|---------------------|
| | | | |

---

## Graduation Rules

When a lesson becomes **permanent knowledge**, promote it:

| Destination | When | Example |
|-------------|------|---------|
| Team onboarding docs | New team members need to know | "Always run migrations in a transaction" |
| Linting rules / CI checks | Can be automated | "No `any` types in API response handlers" |
| Kit feedback loop (`/kit-feedback`) | Applies to all projects, not just this one | "Webhook handlers must be idempotent" — run `/kit-feedback` to capture, sanitize, and export back to the kit |
| ADR decision log | Changes an architectural decision | "Switch from polling to SSE for real-time updates" |
| This register (archived) | Fully resolved, no longer relevant | Move to bottom of this file |

---

## Getting Started

1. Pre-populate the Tribunal Insights section during Steps 2-4
2. Add your first development lesson after the first coding session
3. Set a calendar reminder for monthly reviews
4. Keep this file open alongside STATUS.md during development
