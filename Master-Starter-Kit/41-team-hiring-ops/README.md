# Phase 41: Team & Hiring Ops

> The team you build builds the product. This section ensures you hire the right people, onboard them properly, compensate them fairly, and create the organizational structure that scales from 2 to 200 without breaking.

---

## Why This Exists

Every technical decision you make is downstream of a people decision. The architecture you choose depends on who is available to build it. The velocity you achieve depends on how well your team communicates. The quality you ship depends on the standards your team internalizes. The culture you create determines whether your best people stay or leave. And yet most startup founders treat hiring as an interrupt — something they do reactively when the pain of being understaffed becomes unbearable — rather than as the single highest-leverage activity available to them.

This section exists because the gap between "we need to hire someone" and "we have a high-performing team member shipping meaningful work" is 3-6 months, not 2 weeks. That gap is filled with sourcing, screening, interviewing, negotiating, onboarding, ramping, and integrating — each of which has failure modes that compound. A bad hire does not just waste the salary you paid them. They slow down every person they interact with, make decisions that create technical debt, and damage team morale in ways that persist long after they leave. The cost of a bad senior engineering hire is estimated at $500K-$1.5M when you factor in opportunity cost, management time, severance, and the productivity tax on the rest of the team.

This section also exists because the organizational decisions you make in the first 12 months create path dependencies that are extraordinarily difficult to reverse. Compensation bands set expectations. Reporting structures create power dynamics. Remote policies attract specific talent pools and exclude others. Performance review cadences signal what you value. These are not HR paperwork decisions — they are strategic decisions that determine your company's talent trajectory. Getting them wrong early means you either live with the consequences for years or endure the pain of restructuring, which is one of the most disruptive operations a growing company can undergo.

The templates and frameworks in this section are designed to be adopted incrementally. A solo founder planning their first hire needs the decision tree and the role definition framework. A 10-person team needs the compensation framework and onboarding playbook. A 50-person company needs the full suite including performance reviews, team health assessments, and org chart planning. The reading order below is calibrated to this progression.

<!-- IF {{TEAM_SIZE}} == "1" -->
**Note:** You are currently a solo founder. Most files in this section are premature for you right now. Start with the team scaling decision tree to determine *when* and *who* to hire first, then the role definition framework to write the job description. Bookmark the rest — you will need it sooner than you think.
<!-- ENDIF -->

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 18.85** in the Orchestrator, positioned after Post-Launch operations (Step 18.8) and before Marketing Discovery (Step 19). Team and hiring operations are sequenced here because you need a launched product and early traction data before making informed hiring decisions. Hiring before product-market fit risks building a team optimized for the wrong product. Hiring too long after traction arrives risks founder burnout and missed growth windows.

**Relationship with Section 27 (Team Communication):** Section 27 defines how your team communicates — channels, async norms, meeting cadence, documentation standards. Section 41 defines who is on the team, how they got there, and how they are organized. The two sections are deeply coupled: your communication architecture must evolve as your team structure changes. A flat 5-person team communicating in a single Slack channel needs a fundamentally different communication system than a 40-person team with 6 functional groups. When you add hires from Section 41, revisit Section 27's communication norms to ensure they still fit.

**Relationship with Section 06 (Dev Onboarding):** Section 06 covers the technical onboarding workflow — repository setup, development environment configuration, CI/CD pipeline access, coding standards, and PR review process. Section 41's employee onboarding template covers the broader onboarding experience — Day 1 logistics, cross-functional introductions, 30-60-90 day goals, buddy program, and feedback checkpoints. For engineering hires, both sections apply: Section 41 handles the human side, Section 06 handles the technical side. The two should be combined into a single onboarding journey for each new engineer.

**Relationship with Section 33 (CX Hiring):** Section 33 includes support-team-specific hiring templates (`support-team-hiring.template.md`, `agent-onboarding-playbook.template.md`). Section 41 provides the generalized hiring framework that applies to all roles. For CX hires, use Section 33's specialized templates for role-specific details (support-specific interview questions, ticket handling assessments) and Section 41's framework for compensation, offer process, and organizational integration.

**Relationship with Section 25 (Financial Modeling):** Every hire is a financial commitment. Section 25's financial models should be updated whenever Section 41's hiring plan changes. The compensation framework here defines salary bands and equity grants; Section 25 quantifies how those costs affect runway, burn rate, and break-even timeline. The two sections must be calibrated together — your hiring plan is only viable if your financial model can sustain it.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview, reading order, and integration map for team & hiring ops | 18.85 |
| `team-scaling-decision-tree.md` | Guide | Decision tree for when, who, and how to hire | 18.85 |
| `org-chart-planning.template.md` | Template | Org structure planning by company stage | 18.85 |
| `role-definition-framework.template.md` | Template | Job descriptions, leveling, and career ladders | 18.85 |
| `engineering-hiring-playbook.template.md` | Template | Full engineering hiring process from sourcing to offer | 18.85 |
| `compensation-framework.template.md` | Template | Salary bands, equity, benefits, and geographic adjustments | 18.85 |
| `interview-process.template.md` | Template | Interview pipeline, rubrics, and bias mitigation | 18.85 |
| `employee-onboarding.template.md` | Template | Day 1 through Day 90 onboarding program | 18.85 |
| `performance-review.template.md` | Template | Review cadence, self-assessment, calibration, and growth plans | 18.85 |
| `remote-hybrid-policy.template.md` | Template | Work arrangement policy for distributed teams | 18.85 |
| `culture-documentation.template.md` | Template | Values, operating principles, rituals, and conflict resolution | 18.85 |
| `team-health-assessment.template.md` | Template | Team health surveys, burnout detection, and intervention playbooks | 18.85 |
| `contractor-vendor-management.template.md` | Template | Contractor agreements, vendor evaluation, and transition planning | 18.85 |
| `hiring-ops-gotchas.md` | Guide | 18 production lessons for team building and hiring | 18.85 |

---

## Reading Order

1. **`team-scaling-decision-tree.md`** — Start here. Before you write a job description, answer the fundamental question: do you actually need to hire, or can you contract, automate, or defer? This decision tree prevents the most expensive mistake in startup building — hiring prematurely.
2. **`org-chart-planning.template.md`** — Map your current team structure and plan the next 2-4 hires in context. Understanding where each role fits in the org prevents the "everyone reports to the CEO" bottleneck that stalls companies at 8-12 people.
3. **`role-definition-framework.template.md`** — Define the role precisely before you source candidates. Vague job descriptions attract vague candidates. This framework forces clarity on responsibilities, level, impact scope, and progression path.
4. **`compensation-framework.template.md`** — Set salary bands and equity grants before you start interviewing. Negotiating compensation ad hoc leads to pay inequity, resentment, and legal risk. Lock the framework first.
5. **`engineering-hiring-playbook.template.md`** — If your first hire is an engineer (it usually is), this is your end-to-end playbook from sourcing channels to offer letter. Adapt the structure for non-engineering roles.
6. **`interview-process.template.md`** — Design your interview pipeline with structured rubrics before your first candidate enters it. Unstructured interviews are no better than coin flips at predicting job performance.
7. **`employee-onboarding.template.md`** — Build the onboarding program before the hire starts. Day 1 chaos signals organizational dysfunction and erodes the new hire's confidence in their decision to join.
8. **`remote-hybrid-policy.template.md`** — Define your work arrangement policy before it defines itself by accident. Ambiguity about remote expectations is the #1 source of early attrition in post-2020 hiring.
9. **`culture-documentation.template.md`** — Document your values and operating principles before they calcify informally. Culture that is not written down is culture that cannot be taught, measured, or defended.
10. **`performance-review.template.md`** — Set up the review cadence and rubrics before the first review cycle. Improvised reviews are anxiety-inducing for both parties and produce no actionable growth signal.
11. **`team-health-assessment.template.md`** — Deploy team health surveys once you have 5+ people. Below that size, direct conversation is more effective. Above it, you need systematic measurement.
12. **`contractor-vendor-management.template.md`** — Use this when engaging contractors or agencies. The legal and operational requirements differ significantly from full-time employment, and getting them wrong creates liability.
13. **`hiring-ops-gotchas.md`** — Read last. These production lessons will resonate more after you understand the frameworks they reference. Revisit quarterly as your team grows.

---

## Quick Start Checklist

- [ ] Walk through the team scaling decision tree and confirm whether you need to hire, contract, automate, or defer
- [ ] Map your current org structure and identify the next 2-4 roles to fill
- [ ] Define your first open role using the role definition framework (responsibilities, level, success criteria)
- [ ] Set compensation bands for all planned roles using market data sources listed in the compensation framework
- [ ] Decide your equity grant strategy and confirm remaining option pool with Section 25 financial models
- [ ] Design the interview pipeline with structured rubrics and a minimum of {{INTERVIEW_ROUNDS}} rounds
- [ ] Build the Day 1 through Day 90 onboarding program before your first hire starts
- [ ] Document your {{WORK_LOCATION_POLICY}} policy with timezone overlap, equipment, and communication norms
- [ ] Write down 5-7 core values with behavioral examples and anti-patterns
- [ ] Set up quarterly team health surveys once team reaches 5+ people
- [ ] Establish {{REVIEW_CADENCE}} performance review cadence with self-assessment and manager assessment templates
- [ ] Create contractor agreement templates with SOW structure, IP assignment, and NDA requirements
- [ ] Review the hiring ops gotchas and flag any that apply to your current situation

---

## Key Principles

**Hire for where you are going, not where you are.** A brilliant engineer who thrives in a 200-person company with clear processes may drown in a 5-person startup with ambiguity. Conversely, a scrappy generalist who built your MVP may struggle when you need deep specialists. Every hire should be evaluated against your 12-month team plan, not just today's pain point.

**Structure prevents bias; gut feeling amplifies it.** Unstructured interviews have near-zero predictive validity for job performance. Structured interviews with predefined rubrics, consistent questions, and independent scoring are 2-5x more predictive. The investment in building scorecards pays for itself on the first hire by reducing false positives and increasing diversity.

**Compensation transparency is a competitive advantage, not a liability.** Companies that publish salary bands attract more candidates, reduce negotiation friction, close offers faster, and have lower pay equity risk. The discomfort of transparency is temporary; the benefits compound with every hire.

**Onboarding is not orientation.** Orientation is showing someone where the bathroom is and how to set up their laptop. Onboarding is a 90-day structured program that transforms a new hire into a productive, integrated team member. The difference in ramp time between a well-onboarded engineer and a poorly onboarded one is 2-4 months — which at a senior salary is $50K-$100K in unproductive compensation.

**Culture is what you tolerate, not what you write.** Documenting values is necessary but insufficient. The real culture is revealed by who gets promoted, what behavior gets corrected, and what gets ignored. If your values say "move fast" but your promotion criteria reward "zero mistakes," your actual culture is risk aversion. Measure culture by observing behavior, not reading posters.

**Team health is a leading indicator; attrition is a lagging one.** By the time someone resigns, you have already lost them — usually 3-6 months before the resignation. Quarterly health surveys detect deterioration early enough to intervene. Ignoring team health data is the organizational equivalent of ignoring server monitoring alerts.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{TEAM_SIZE}}` | Current team size | `1`, `5`, `25` |
| `{{TEAM_GROWTH_PLAN}}` | Planned team size in 12 months | `10`, `30` |
| `{{HIRING_BUDGET_MONTHLY}}` | Monthly budget allocated to hiring activities | `0`, `2000`, `10000` |
| `{{COMPENSATION_MODEL}}` | Compensation approach | `market-rate`, `below-market-heavy-equity` |
| `{{EQUITY_POOL_AVAILABLE}}` | Remaining option pool percentage | `8`, `12` |
| `{{WORK_LOCATION_POLICY}}` | Work arrangement policy | `remote-first`, `hybrid`, `on-site` |
| `{{TIMEZONE_OVERLAP_HOURS}}` | Required timezone overlap hours | `4`, `6` |
| `{{ENGINEERING_LEVELS}}` | Number of IC engineering levels | `4`, `6` |
| `{{REVIEW_CADENCE}}` | Performance review frequency | `annual`, `semi-annual`, `quarterly` |
| `{{RECRUITER_MODEL}}` | Recruiting approach | `internal`, `external-agency`, `founder-led` |
| `{{INTERVIEW_ROUNDS}}` | Number of interview stages | `3`, `4`, `5` |
| `{{ONBOARDING_DURATION_DAYS}}` | Onboarding period length in days | `30`, `60`, `90` |
| `{{FIRST_HIRE_ROLE}}` | First planned hire role | `engineer`, `designer`, `operations` |
| `{{CULTURE_VALUES_COUNT}}` | Number of core values | `3`, `5`, `7` |
