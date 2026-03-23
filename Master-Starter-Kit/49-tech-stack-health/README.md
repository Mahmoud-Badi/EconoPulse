# Phase 49: Tech Stack Health Monitoring

> Your tech stack is not a decision you make once. It is a living system that ages, accumulates vulnerabilities, drifts from community support, and shifts in cost profile as you scale. This section provides the framework for ongoing stack health evaluation throughout your project's lifecycle.

---

## Why This Exists

Section 02 (Architecture) helps you choose your initial stack. Section 05 (Dev Infrastructure) sets up your tooling. Neither answers the question that haunts every production system six months after launch: is our stack still the right choice, and is it healthy?

Tech stack health degrades silently. A dependency you chose eighteen months ago stops receiving security patches. Your database performs beautifully at 10,000 rows but buckles at 10 million. The hosting provider that cost $50/month at launch now costs $2,000/month because their pricing scales non-linearly. The CSS framework you adopted gets abandoned by its maintainer. A critical library changes its license from MIT to SSPL, invalidating your commercial use. None of these problems announce themselves. They compound until a crisis forces a reckoning — usually at the worst possible time, like the week before a fundraise or during a traffic spike.

This section turns reactive panic into proactive monitoring. It provides audit templates, trigger schedules, upgrade assessment frameworks, and cost impact analysis tools that keep your stack healthy across the entire project lifecycle. The goal is never to chase the latest framework. The goal is to ensure your current stack remains secure, performant, cost-effective, and actively maintained — and to catch problems early enough that you have options other than emergency migration.

---

## How It Integrates with the Orchestrator

This section is introduced at **Step 17.7** as a baseline audit — once your initial stack is deployed and running, you establish the first health snapshot. From there, it operates on a recurring basis rather than as a one-time orchestrator step.

**Recurring triggers:** End of each development phase, before major releases, quarterly for ongoing projects, when major dependency updates are released, when security advisories are published, before fundraising rounds, and when performance issues surface at scale. See `audit-triggers.md` for the complete trigger matrix.

**Relationship with Section 02 (Architecture):** Section 02 defines the initial stack. Section 49 monitors its ongoing health. When a Section 49 audit recommends a pivot, the resulting architecture changes feed back into Section 02's architecture documentation.

**Relationship with Section 05 (Dev Infrastructure):** Dev tooling health — CI/CD pipeline versions, linter configurations, build tool updates — falls under Section 49's monitoring scope. When your build tool releases a major version with breaking changes, Section 49 flags it.

**Relationship with Section 25 (Financial Modeling):** Infrastructure costs identified in Section 49 audits feed directly into `25-financial-modeling/infrastructure-cost-model.template.md`. The cost-impact-analysis template in this section produces the delta calculations that update your financial projections. Every stack change has a cost dimension, and Section 25 is where that cost lives in the broader model.

**Relationship with Section 40 (Investor Fundraising):** Investors ask about tech debt. A recent Section 49 audit with green indicators across the board is due diligence ammunition. A stack riddled with EOL dependencies and unpatched CVEs is a fundraising liability. Run a deep audit before any fundraising round.

**Relationship with Section 14 (Security Hardening):** Security audits in Section 14 focus on your application's security posture. Section 49's security column focuses specifically on dependency-level vulnerabilities — known CVEs in your dependency tree, outdated packages with unpatched exploits, and supply chain risks.

---

## Files in This Section

| File | Type | Purpose | When to Use |
|------|------|---------|-------------|
| `README.md` | Guide | Overview, integration points, reading order | First read |
| `stack-health-audit.template.md` | Template | Full audit report across 7 health dimensions | Every audit cycle |
| `stack-health-decision-tree.md` | Guide | What to check and when — quick, standard, or deep | Before starting any audit |
| `audit-triggers.md` | Guide | Milestone-based triggers for when to run audits | Scheduling and planning |
| `upgrade-assessment.template.md` | Template | GO/NO-GO framework for upgrade or pivot decisions | When audit finds issues |
| `cost-impact-analysis.template.md` | Template | Financial impact analysis for stack changes | Before any stack change |
| `stack-audit-gotchas.md` | Guide | False alarms vs real warnings — calibrate your reactions | After completing first audit |

---

## Reading Order

1. **`stack-health-decision-tree.md`** — Start here. Determine whether you need a quick check, standard audit, or deep audit based on your current situation.
2. **`audit-triggers.md`** — Understand what events should trigger an audit and at what priority level.
3. **`stack-health-audit.template.md`** — Run the audit. Fill in every applicable section for your audit depth level.
4. **`upgrade-assessment.template.md`** — For any dependency flagged as UPGRADE or PIVOT, complete this assessment before acting.
5. **`cost-impact-analysis.template.md`** — For any change with financial implications, quantify the impact before committing.
6. **`stack-audit-gotchas.md`** — Read last. Calibrate your audit findings against common false alarms and real warnings.

---

## Quick Start Checklist

- [ ] Complete the decision tree to determine audit depth
- [ ] Review audit triggers to establish your monitoring cadence
- [ ] Run initial baseline audit using the stack-health-audit template
- [ ] Flag any dependency rated UPGRADE or PIVOT
- [ ] Complete upgrade assessments for flagged dependencies
- [ ] Run cost impact analysis for any proposed changes
- [ ] Cross-reference infrastructure costs with Section 25 financial model
- [ ] Review gotchas to calibrate severity of findings
- [ ] Schedule next audit based on trigger matrix
- [ ] Archive completed audit for historical comparison

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{FRONTEND_FRAMEWORK}}` | Primary frontend framework | `next.js`, `nuxt`, `sveltekit`, `remix` |
| `{{FRONTEND_VERSION}}` | Current frontend framework version | `14.1.0`, `3.8.2` |
| `{{BACKEND_FRAMEWORK}}` | Primary backend framework | `express`, `fastify`, `django`, `rails` |
| `{{BACKEND_VERSION}}` | Current backend framework version | `4.18.2`, `4.25.0` |
| `{{DATABASE}}` | Primary database | `postgresql`, `mysql`, `mongodb`, `supabase` |
| `{{DATABASE_VERSION}}` | Current database version | `16.1`, `8.0.35` |
| `{{HOSTING_PROVIDER}}` | Primary hosting provider | `vercel`, `aws`, `gcp`, `railway` |
| `{{CSS_FRAMEWORK}}` | CSS framework or library | `tailwind`, `chakra-ui`, `shadcn` |
| `{{AUTH_PROVIDER}}` | Authentication provider | `clerk`, `auth0`, `supabase-auth`, `custom` |
| `{{MONTHLY_INFRA_COST}}` | Current monthly infrastructure cost | `$150`, `$2,400`, `$15,000` |
| `{{ACTIVE_USERS}}` | Current monthly active users | `500`, `10,000`, `250,000` |
| `{{LAST_AUDIT_DATE}}` | Date of last stack health audit | `2025-01-15`, `never` |
| `{{AUDIT_DEPTH}}` | Current audit depth level | `quick`, `standard`, `deep` |
