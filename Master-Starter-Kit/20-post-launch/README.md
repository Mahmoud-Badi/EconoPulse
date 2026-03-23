# Phase 20: Post-Launch Lifecycle

> **Launch day is not the finish line. It is the starting line.** This section gives you the systems, checklists, and frameworks to keep your product alive, growing, and healthy after it ships.

---

## Why This Exists

Most project planning frameworks stop at deployment. They treat launch as the final deliverable and hand you a deployed application with no guidance on what happens next. This is like building a house and never maintaining it — the roof leaks within a year.

Post-launch is where products succeed or fail. The first 90 days after launch determine whether your product gains traction or quietly dies. You need monitoring that actually catches problems before users report them. You need a system for processing the flood of feature requests without losing your roadmap. You need a deprecation process that does not alienate your users. You need metrics that tell you the truth about product health, not vanity numbers that make dashboards look green.

This section exists because the gap between "deployed" and "thriving" is where most products fall. The files here give you battle-tested frameworks for every post-launch concern: from the Day 1 verification checklist through quarterly roadmap planning, from handling your first feature request to sunsetting your first deprecated feature. These are not theoretical frameworks. They are operational playbooks built from the patterns that work and the mistakes that teach.

---

## How It Integrates with the Orchestrator

The Post-Launch Lifecycle section connects to **Orchestrator Step 25** (Launch Strategy) as the natural continuation after launch day execution completes. While Step 25 covers the launch event itself, Phase 20 picks up from the moment your product is live and running in production.

By the time you reach this phase, the orchestrator has already generated:

- Deployment configuration (from Phase 09 - Deployment Operations)
- Monitoring setup (from `09-deployment-operations/monitoring.template.md`)
- User documentation (from Phase 18 - User Documentation)
- Marketing launch plan (from Phase 19 - Marketing System, Step 25)
- Incident response procedures (from Phase 21 - Incident Response)

Phase 20 ties these outputs together into a cohesive post-launch operating model. The monitoring config tells you WHAT to watch; the post-launch checklist tells you WHEN to verify it is working. The marketing launch plan gets you users; the feedback loops tell you what those users actually need.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Connection |
|------|------|---------|------------------------|
| `README.md` | Guide | Section overview and reading order | -- |
| `post-launch-checklist.template.md` | Template | Day 1 through Month 3 verification checklists | Post-Step 25 |
| `feature-request-triage.md` | Guide | RICE scoring, MoSCoW, and request evaluation frameworks | Ongoing ops |
| `user-feedback-loops.template.md` | Template | Feedback collection channels, pipeline, and review cadence | Ongoing ops |
| `product-roadmap.template.md` | Template | Now/Next/Later roadmap format and quarterly planning | Ongoing ops |
| `release-cadence-strategy.md` | Guide | Semver rules, release trains, changelog standards | Ongoing ops |
| `feature-deprecation-playbook.md` | Guide | 90-day deprecation timeline with communication templates | Ongoing ops |
| `api-versioning-strategy.md` | Guide | URL vs header versioning, backward compatibility rules | Ongoing ops |
| `post-launch-metrics-dashboard.template.md` | Template | Core metrics, alerting thresholds, review templates | Post-Step 25 |
| `post-launch-gotchas.md` | Guide | 10 battle-tested lessons for surviving post-launch | Ongoing ops |

---

## Reading Order

1. **`README.md`** — You are here. Understand the section structure.
2. **`post-launch-checklist.template.md`** — Start here on launch day. Day 1, Week 1, Month 1, Month 3 checklists.
3. **`post-launch-metrics-dashboard.template.md`** — Set up your metrics dashboard within the first week.
4. **`user-feedback-loops.template.md`** — Activate feedback collection channels in Week 1.
5. **`feature-request-triage.md`** — Use this framework when feature requests start arriving.
6. **`product-roadmap.template.md`** — Build your first roadmap at the Month 1 mark.
7. **`release-cadence-strategy.md`** — Establish your release process before your second release.
8. **`feature-deprecation-playbook.md`** — Read before you ever need it. You will need it sooner than you think.
9. **`api-versioning-strategy.md`** — Read before your API has external consumers.
10. **`post-launch-gotchas.md`** — Read on launch day. Re-read monthly. These lessons compound.

---

## Key Placeholders Used

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PROJECT_NAME}}` | Product name | `FleetManager`, `TaskFlow` |
| `{{MONITORING_PROVIDER}}` | Primary monitoring tool | `Datadog`, `Grafana`, `Sentry` |
| `{{SUPPORT_CHANNELS}}` | Customer support channels | `Intercom, email, Discord` |
| `{{FEEDBACK_CHANNEL}}` | Primary feedback collection point | `Canny`, `in-app widget`, `email` |
| `{{SUPPORT_PLATFORM}}` | Support ticket system | `Zendesk`, `Intercom`, `Freshdesk` |
| `{{PUBLIC_ROADMAP}}` | Whether roadmap is public | `yes`, `no` |

---

## The Post-Launch Mindset

Pre-launch, you optimize for shipping. Post-launch, you optimize for learning. The code you wrote is now a hypothesis being tested by real users in real conditions. Your job shifts from "build what we planned" to "understand what users actually need and deliver it without breaking what already works."

This section gives you the operational frameworks to make that shift successfully.
