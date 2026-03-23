# Audience Matrix — {{PROJECT_NAME}}

> Maps each stakeholder type to what they need, how they need it, and when.

---

## Executive Stakeholders

**Who:** Non-technical founders, CEOs, C-suite, department heads
**Primary concern:** Is the project on track, on budget, and delivering value?

### What They Need

| Information | Format | Frequency | Template |
|-------------|--------|-----------|----------|
| Project status (traffic-light) | One-page summary | Weekly | `weekly-stakeholder-update` |
| Budget burn rate | Table: budget vs. spent vs. remaining | Bi-weekly | `budget-burn-report` |
| Milestone timeline | Visual roadmap / Gantt | Monthly | `roadmap-gantt` diagram |
| Risk summary | Table: risk, likelihood, impact, mitigation | When risks change | `risk-and-blockers-update` |
| Feature scope | In-scope vs. out-of-scope table | At gates | `scope-in-out-summary` |
| Demo of progress | Live walkthrough with script | Sprint end | `demo-script` |

### Communication Style
- **Max length:** 1 page / 5 minutes reading time
- **Lead with:** Traffic-light status, then top 3 highlights, then risks
- **Avoid:** Technical jargon, implementation details, code references
- **Translation examples:**
  - "Microservices" → "Independent system modules that can be updated separately"
  - "CI/CD pipeline" → "Automated quality checks that run before every release"
  - "Database migration" → "Restructuring how data is stored to support new features"
  - "API contract" → "The agreement between system components about how they share data"

---

## Investor / Board Stakeholders

**Who:** Investors, board members, advisors, potential acquirers
**Primary concern:** Is this a good investment? What's the growth trajectory?

### What They Need

| Information | Format | Frequency | Template |
|-------------|--------|-----------|----------|
| Executive summary | Narrative + key metrics | Monthly | `monthly-executive-summary` |
| Milestone achievement | Timeline with completion markers | Monthly | `milestone-timeline` diagram |
| Key metrics | Table: metric, current, target, trend | Monthly | `investor-update` |
| Burn rate & runway | Financial table | Monthly | `budget-burn-report` |
| Growth indicators | Charts / trend lines | Quarterly | `quarterly-business-review` |
| Competitive position | Battle card summary | Quarterly | `quarterly-business-review` |

### Communication Style
- **Max length:** 2 pages + appendix
- **Lead with:** Key metrics and trends, then milestones, then strategic updates
- **Avoid:** Operational details, technical architecture, day-to-day issues
- **Include:** Comparisons to plan, industry benchmarks, growth projections
- **Translation examples:**
  - "Sprint velocity" → "Development speed — we're completing X features per 2-week cycle"
  - "Test coverage" → "Quality assurance — X% of the system is automatically verified"
  - "Tech debt" → "Maintenance backlog — planned improvements to keep development speed high"

---

## Client Stakeholders

**Who:** External clients, product owners, business sponsors (when building for someone else)
**Primary concern:** Am I getting what I paid for? When can I see it? When do I need to approve something?

### What They Need

| Information | Format | Frequency | Template |
|-------------|--------|-----------|----------|
| Deliverable checklist | Table: deliverable, status, date | Weekly | `feature-status-matrix` |
| Demo schedule | Calendar of upcoming demos | Sprint start | `sprint-goals-stakeholder` |
| Approval gates | What needs sign-off and when | At gates | `go-no-go-decision` |
| Scope changes | What's in, what's out, what moved | When scope changes | `scope-in-out-summary` |
| Feature showcase | Interactive demo with script | Pre-launch | `feature-showcase` |
| UAT results | Test results, feedback summary | QA phase | `uat-feedback-summary` |

### Communication Style
- **Max length:** Varies by deliverable — keep status updates to 1 page
- **Lead with:** What's ready for review, what needs their input, what's next
- **Avoid:** Internal team dynamics, technical debt discussions, infrastructure details
- **Include:** Clear action items with deadlines, approval checkboxes, demo links
- **Translation examples:**
  - "Deployment" → "Your new features going live to users"
  - "Staging environment" → "A preview version where you can test before it goes live"
  - "Regression testing" → "Making sure the new changes didn't break anything that was already working"

---

## Team Stakeholders

**Who:** Designers, marketers, QA, support, other dev teams
**Primary concern:** What do I need to do? What's blocking me? What changed that affects my work?

### What They Need

| Information | Format | Frequency | Template |
|-------------|--------|-----------|----------|
| Sprint goals & tasks | Task breakdown by team | Sprint start | `sprint-goals-stakeholder` |
| Dependencies | Dependency map: who's waiting on whom | Sprint start | `dependency-map-explained` |
| Blockers | Blocker list with owners and ETA | Daily (if blocked) | `risk-and-blockers-update` |
| Handoff specs | What to build, acceptance criteria | Per feature | Service/screen specs |
| Architecture decisions | What was decided and why | When decisions made | `tech-decisions-explained` |
| Resource allocation | Who's working on what | Sprint start | `resource-allocation-summary` |

### Communication Style
- **Max length:** No limit — detail is valued
- **Lead with:** Action items, then context, then rationale
- **Avoid:** Sugarcoating — be direct about blockers and risks
- **Include:** Technical specifics, file paths, API contracts, design specs
- **Translation examples:** (reverse — translate business to technical)
  - "The client wants faster load times" → "Target LCP < 2.5s, optimize critical render path"
  - "Users are confused by the flow" → "Redesign the onboarding wizard, reduce steps from 7 to 4"

---

## Audience Decision Matrix

For each communication, use this matrix to decide what to include:

| Content | Executive | Investor | Client | Team |
|---------|-----------|----------|--------|------|
| Traffic-light status | YES | YES | YES | Optional |
| Budget / burn rate | YES | YES | If contracted | No |
| Technical architecture | No | No | No | YES |
| Feature list / scope | Summary | Summary | Detailed | Detailed |
| Risk register | Top 3 only | Top 3 only | Relevant risks | All risks |
| Timeline / roadmap | Milestone view | Milestone view | Deliverable view | Task view |
| Demo / screenshots | Highlights | Highlights | Full walkthrough | Implementation details |
| Action items | Decisions needed | None (info only) | Approvals needed | Tasks assigned |
| Metrics / KPIs | Business metrics | Growth metrics | Deliverable metrics | Quality metrics |
| Miro exports | System overview | Roadmap | User journey | Architecture |
