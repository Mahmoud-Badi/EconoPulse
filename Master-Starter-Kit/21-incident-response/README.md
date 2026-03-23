# Phase 21: Incident Response & On-Call

> When production breaks at 2 AM, this section ensures you have a runbook, not a panic attack.

---

## Why This Exists

Every production application will experience incidents. Servers crash, databases fill up, third-party APIs go down, deployments introduce regressions, and traffic spikes overwhelm capacity. This is not a question of "if" but "when." The difference between a team that resolves a SEV1 in 12 minutes and one that takes 4 hours is not talent — it is preparation. Incident response is a skill that compounds: every documented runbook, every practiced escalation, every blameless postmortem makes the next incident shorter and less painful.

Unprepared teams exhibit predictable failure patterns during incidents. Engineers scramble to find credentials, nobody knows who to call, customers discover the outage before the team does, and the fix introduces a second incident. Meanwhile, prepared teams have muscle memory. Alerts fire, the on-call engineer opens the runbook, the incident commander coordinates communication, and the status page updates automatically. The difference is not heroics — it is systems.

This section gives you the complete incident response infrastructure for your project. From severity definitions to communication templates to postmortem formats, everything here is designed to be used under pressure. That means short sentences, numbered steps, and zero ambiguity. You will customize these templates once during project setup, then rely on them every time something breaks.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 18.6** in the Orchestrator, where operational readiness is validated before launch. Incident response planning is a prerequisite for production deployment — not an afterthought.

**Relationship with Section 09 (Deployment & Operations):** Section 09 defines how you deploy. This section defines what happens when a deployment goes wrong. The rollback runbook here references deployment procedures from Section 09. Your CI/CD pipeline configuration should include the rollback mechanisms documented here.

**Relationship with Observability (Step 15):** Monitoring and alerting from Step 15 feed directly into incident detection. The severity levels defined here determine alert thresholds in your monitoring configuration. If your observability setup cannot distinguish between a SEV3 and a SEV1, your incident response will always start with triage confusion.

**Relationship with Section 10 (Testing):** Game days and incident response drills should be scheduled alongside your testing strategy. A team that runs chaos engineering exercises will outperform one that only reads runbooks.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview and reading order for incident response section | 18.6 |
| `severity-levels.md` | Guide | SEV1-SEV4 definitions, SLAs, escalation triggers, decision tree | 18.6 |
| `incident-response-runbook.template.md` | Template | Step-by-step response protocol from detection through postmortem | 18.6 |
| `communication-templates.md` | Guide | Pre-written messages for internal, customer, and stakeholder comms | 18.6 |
| `postmortem-template.template.md` | Template | Blameless postmortem format with 5 Whys, action items, metrics | 18.6 |
| `on-call-rotation.template.md` | Template | Rotation schedule, handoff protocol, compensation, wellness | 18.6 |
| `status-page-strategy.md` | Guide | Provider comparison, component definitions, communication cadence | 18.6 |
| `common-runbooks/database-outage.md` | Guide | Runbook for database connectivity, timeouts, disk, replication | 18.6 |
| `common-runbooks/api-degradation.md` | Guide | Runbook for latency, error rates, memory leaks, CPU spikes | 18.6 |
| `common-runbooks/auth-failure.md` | Guide | Runbook for auth provider outages, token failures, SSO issues | 18.6 |
| `common-runbooks/third-party-outage.md` | Guide | Runbook for dependency failures and graceful degradation | 18.6 |
| `common-runbooks/deployment-rollback.md` | Guide | Runbook for rolling back bad deployments safely | 18.6 |
| `incident-metrics.template.md` | Template | MTTR/MTTD tracking, SLA compliance, cost estimation, quarterly review | 18.6 |
| `incident-response-gotchas.md` | Guide | Hard-won production lessons and anti-patterns to avoid | 18.6 |

---

## Reading Order

1. **`severity-levels.md`** — Read first. Every other document references severity levels. You need a shared vocabulary before anything else.
2. **`incident-response-runbook.template.md`** — The core playbook. Fill in the placeholders for your project. This is what the on-call engineer opens at 2 AM.
3. **`communication-templates.md`** — Pre-written messages for every stage of an incident. Customize the fill-in-the-blank fields for your stack.
4. **`on-call-rotation.template.md`** — Define who is on call, when, and how handoffs work. Do this before your first on-call shift.
5. **`status-page-strategy.md`** — Choose a status page provider and define your components. Set this up before launch.
6. **`common-runbooks/`** — Read through all five runbooks. Customize them for your specific infrastructure. These are the most-used documents during real incidents.
7. **`postmortem-template.template.md`** — Review the format so the team knows what a postmortem looks like before the first incident.
8. **`incident-metrics.template.md`** — Set up tracking from day one. You cannot improve what you do not measure.
9. **`incident-response-gotchas.md`** — Read last. These lessons will make more sense after you understand the full framework.

---

## Quick Start Checklist

- [ ] Define severity levels and get team agreement on definitions
- [ ] Fill in the incident response runbook template with your project specifics
- [ ] Set up your on-call rotation and notification tooling
- [ ] Configure your status page with all relevant components
- [ ] Customize the common runbooks for your infrastructure
- [ ] Share communication templates with all team members
- [ ] Schedule your first incident response game day
- [ ] Print (yes, print) the severity decision tree for your war room

---

## Key Principles

**Blameless culture.** Incidents are caused by systems, not people. Postmortems focus on process failures, not individual mistakes. If someone is afraid to admit they caused an outage, your incident response is already broken.

**Runbooks over heroes.** A junior engineer with a good runbook will outperform a senior engineer winging it. Document everything. Update runbooks after every incident.

**Communicate early, communicate often.** Silence during an incident breeds panic — internally and externally. Even "we are investigating" is better than nothing.

**Rollback first, debug second.** Production is not a debugging environment. Restore service first, then figure out what went wrong.

**Practice before you need it.** Run game days quarterly. Simulate failures. The first time your team uses the incident response process should not be during a real incident.
