# Employee Onboarding

> The first 90 days determine whether a new hire becomes a high performer or a regretful departure. This template covers every step from the moment they sign the offer to the day they are fully autonomous — pre-start logistics, Day 1 orientation, Week 1 immersion, Month 1 milestones, and the full 30-60-90 day plan that transforms a stranger into a teammate.

---

## 1. Pre-Start Checklist

Complete these items between offer acceptance and Day 1. Nothing on this list should be improvised on the new hire's first morning.

### Administrative Setup

- [ ] Employment paperwork signed (offer letter, NDA, IP assignment, I-9/W-4 or local equivalent)
- [ ] Payroll configured (bank details, tax withholding, benefits enrollment)
- [ ] Benefits enrollment initiated (health insurance, 401k, etc.) — provide enrollment guide
- [ ] Emergency contact information collected
- [ ] Background check completed (if applicable)
- [ ] Equipment ordered and shipped/staged
  - [ ] Laptop (spec: {{LAPTOP_SPEC}})
  - [ ] Monitor (if {{WORK_LOCATION_POLICY}} == "remote-first")
  - [ ] Keyboard, mouse, headset
  - [ ] Webcam (if laptop webcam is insufficient)
- [ ] Home office stipend instructions sent (if remote)

### Account Provisioning

- [ ] Email account created (firstname@{{PROJECT_DOMAIN}})
- [ ] Slack / communication platform account created
- [ ] GitHub / GitLab repository access granted (read-only initially)
- [ ] Project management tool access (Linear, Jira, Asana, etc.)
- [ ] Documentation platform access (Notion, Confluence, Google Docs, etc.)
- [ ] Cloud platform access (AWS, GCP, Vercel — read-only initially, escalate after onboarding)
- [ ] Password manager account created (1Password, Bitwarden)
- [ ] Calendar invitations sent for Week 1 meetings
- [ ] VPN / network access configured (if applicable)
- [ ] Added to relevant Slack channels (team, general, social, announcements)

### Welcome Package

- [ ] Welcome email sent from hiring manager (personal, not templated — mention something specific from the interview)
- [ ] Onboarding buddy assigned and notified
- [ ] Onboarding schedule shared (Day 1 through Week 2)
- [ ] Reading list prepared (company docs, product docs, architecture overview)
- [ ] First project identified (small, well-scoped, achievable in Week 2-3)
- [ ] Swag / welcome kit shipped (if applicable)

### Welcome Email Template

```
Subject: Welcome to {{PROJECT_NAME}} — We're Excited You're Joining

Hi [Name],

We are thrilled that you are joining us on [start date]. I wanted to make sure
your first day is smooth, so here is what to expect:

TIME AND PLACE
- Start time: [time] [timezone]
- [If remote:] Join this video link: [link]
- [If on-site:] Come to [address], ask for [person] at reception

YOUR FIRST DAY
- 9:00-9:30 — Welcome and laptop setup with [buddy name]
- 9:30-10:30 — Company overview and product walkthrough with me
- 10:30-11:00 — Engineering team introduction
- 11:00-12:00 — Development environment setup
- 12:00-1:00 — Lunch with the team [or virtual coffee]
- 1:00-3:00 — Codebase tour and first PR walkthrough
- 3:00-3:30 — 1:1 with me — questions, expectations, anything on your mind

YOUR ONBOARDING BUDDY
[Buddy name] will be your go-to person for questions, context, and navigating the
team. They will reach out before your start date to say hello.

BEFORE YOUR START DATE
- Set up your laptop and install the tools in this guide: [link to Section 06]
- Skim the product documentation: [link]
- No pressure to deep-dive — we will walk through everything together

If you have any questions before [start date], text or email me anytime.

Looking forward to working with you.

[Your name]
```

---

## 2. Day 1 Agenda

Day 1 is about belonging, not productivity. The new hire should leave Day 1 feeling welcomed, oriented, and confident they made the right decision — not overwhelmed by information dumps.

### Morning (9:00 - 12:00)

| Time | Activity | Owner | Goal |
|------|----------|-------|------|
| 9:00 - 9:30 | Welcome + equipment setup | Onboarding buddy | Laptop works, accounts accessible, Slack connected |
| 9:30 - 10:00 | CEO / Founder welcome | CEO | Why the company exists, mission, where we are going. Personal, not a pitch deck. |
| 10:00 - 10:30 | Team introductions | Hiring manager | Meet everyone on the immediate team. Quick round of names, roles, fun facts. |
| 10:30 - 11:00 | Product demo | Product owner or founder | See the product through a customer's eyes. Not the code — the experience. |
| 11:00 - 12:00 | Development environment setup | Onboarding buddy | Follow Section 06 dev onboarding. Target: can clone, build, and run locally. |

### Afternoon (12:00 - 5:00)

| Time | Activity | Owner | Goal |
|------|----------|-------|------|
| 12:00 - 1:00 | Team lunch (or virtual coffee) | Hiring manager | Informal social time. No work talk required. |
| 1:00 - 2:00 | Codebase overview | Senior engineer | Architecture walkthrough: what lives where, how data flows, key systems. |
| 2:00 - 3:00 | First PR walkthrough | Onboarding buddy | Walk through a recent PR together. Explain code review norms, commit conventions. |
| 3:00 - 3:30 | 1:1 with hiring manager | Hiring manager | Check in. Answer questions. Set expectations for Week 1. |
| 3:30 - 4:00 | Reading time | Self | Review documentation, product docs, team norms document |
| 4:00 - 4:30 | End-of-day check-in with buddy | Onboarding buddy | What went well? What is confusing? What do you need for tomorrow? |

### Day 1 Success Criteria

- [ ] New hire can access all required tools and platforms
- [ ] Development environment runs locally (can build and serve the app)
- [ ] New hire has met every member of their immediate team
- [ ] New hire understands the product from a user perspective
- [ ] New hire knows who their onboarding buddy is and how to reach them
- [ ] New hire has no unresolved logistics questions (payroll, benefits, equipment)

---

## 3. Week 1 Goals

Week 1 transitions from orientation (Day 1) to immersion. By Friday, the new hire should have shipped their first contribution — even if it is a one-line change.

### Daily Structure (Week 1)

| Day | Theme | Key Activity |
|-----|-------|-------------|
| **Day 1** | Welcome & Setup | Orientation, environment setup, team introductions |
| **Day 2** | Product Deep Dive | Use the product as a customer would. File UX observations. Review product roadmap. |
| **Day 3** | Codebase Immersion | Read code in 3 key areas. Write questions. Pair with a senior engineer on a task. |
| **Day 4** | First Contribution | Pick a small issue (typo fix, test addition, doc update). Open a PR. Go through review. |
| **Day 5** | Reflection & Planning | 1:1 with manager. Review Week 1. Set Month 1 goals. Buddy check-in. |

### Week 1 Checklist

- [ ] Used the product end-to-end as a new user would
- [ ] Read the architecture decision records (ADRs) or architecture documentation
- [ ] Paired with at least one engineer on a real task
- [ ] Opened and merged first PR (any size — the process matters, not the scope)
- [ ] Attended a team standup and understood the current sprint
- [ ] Had a 1:1 with hiring manager to set Month 1 expectations
- [ ] Had an informal conversation with at least 2 people outside the immediate team
- [ ] Documented at least 1 question or observation about the codebase or product

---

## 4. Month 1 Milestones

By the end of Month 1, the new hire should be contributing independently on well-scoped tasks. They are not yet fully autonomous but should not need hand-holding for routine work.

### Technical Milestones

- [ ] Completed 3-5 PRs of increasing complexity
- [ ] Can navigate the codebase without constant guidance (knows where to find things)
- [ ] Understands the deployment pipeline and has deployed at least once (with supervision)
- [ ] Has participated in on-call shadowing (observed, not primary)
- [ ] Can debug common issues independently using logs, monitoring, and documentation
- [ ] Has reviewed at least 3 PRs from other team members

### Organizational Milestones

- [ ] Understands team norms, communication patterns, and decision-making processes
- [ ] Has had 1:1s with all cross-functional partners (PM, designer, etc.)
- [ ] Knows who to ask for help on different types of questions
- [ ] Has attended and contributed to at least one planning or retro meeting
- [ ] Understands the product roadmap and can articulate current priorities

### Social Milestones

- [ ] Has had informal conversations with people across the company (not just their team)
- [ ] Feels comfortable asking questions in public channels (not just DMs)
- [ ] Has participated in at least one social or cultural activity (team lunch, game, etc.)

---

## 5. 30-60-90 Day Plan Template

### Days 1-30: Learn

**Objective:** Absorb context. Understand the product, codebase, team, and processes.

| Week | Focus Area | Deliverables |
|------|-----------|-------------|
| 1 | Orientation and setup | Environment running, first PR merged, team met |
| 2 | Product and codebase immersion | 2-3 small PRs, architecture understood, first pairing sessions |
| 3 | Independent contribution | Own a small feature end-to-end (design → code → test → deploy) |
| 4 | Process integration | Participate fully in sprint ceremonies, review others' code, shadow on-call |

**30-Day Check-In Questions:**
- What has surprised you (positively or negatively) about the team/product/codebase?
- What do you wish you had known on Day 1?
- Are there tools, processes, or information gaps slowing you down?
- How is your relationship with your onboarding buddy?
- On a scale of 1-10, how confident do you feel about your decision to join?

### Days 31-60: Contribute

**Objective:** Deliver meaningful work. Take ownership of a system or feature area.

| Week | Focus Area | Deliverables |
|------|-----------|-------------|
| 5-6 | Own a medium-complexity project | Design doc, implementation, tests, deployed |
| 7-8 | Cross-functional collaboration | Work directly with PM/designer on feature scoping. Participate in a customer feedback review. |

**60-Day Check-In Questions:**
- What are you most proud of shipping so far?
- Where do you feel you need more support or mentorship?
- Are there areas of the product or codebase you want to explore?
- How effective is your working relationship with your manager?
- What would make this role a 10/10 for you?

### Days 61-90: Own

**Objective:** Operate at full capacity. Be the go-to person for your area.

| Week | Focus Area | Deliverables |
|------|-----------|-------------|
| 9-10 | Lead a project or initiative | Own a project from problem definition through delivery |
| 11-12 | Mentor and scale | Help onboard the next hire (if applicable). Document what you learned. Propose an improvement to a process or system. |

**90-Day Check-In Questions:**
- Do you feel like a full member of the team? What would change that?
- What is one thing you would change about how we work?
- Are your growth goals aligned with the work you are doing?
- Are you ready to participate in on-call as a primary (if applicable)?
- What does the next 6 months look like for you in this role?

---

## 6. Onboarding Buddy Program

### Buddy Responsibilities

The onboarding buddy is not a manager — they are a peer who makes the new hire's first months less confusing and less lonely.

| Responsibility | Frequency | Duration |
|---------------|-----------|----------|
| Daily check-in (async or sync) | Daily for first 2 weeks | 10-15 min |
| Weekly check-in | Weekly for weeks 3-{{ONBOARDING_DURATION_DAYS_DIV_7}} | 15-30 min |
| Answer questions in DM | As needed | Varies |
| Introduce to people across the company | Week 1-2 | Ad hoc |
| Explain unwritten norms and culture | Ongoing | Ad hoc |
| Pair on first few PRs | Week 1-2 | 30-60 min each |
| Flag concerns to hiring manager | As needed | Private |

### Buddy Selection Criteria

- [ ] On the same team or an adjacent team (understands the work context)
- [ ] Has been at the company at least 6 months (knows the landscape)
- [ ] Volunteered for the role (not conscripted)
- [ ] Good communicator — patient, approachable, responsive
- [ ] Not the new hire's manager (buddy relationship needs psychological safety)
- [ ] Capacity — not in a crunch period with competing deadlines

### Buddy Preparation

Before the new hire starts, the buddy should:
- [ ] Review the new hire's background and role description
- [ ] Send a personal welcome message before Day 1
- [ ] Block time on their calendar for Daily 1-2 check-ins
- [ ] Prepare a "things I wish someone told me" list
- [ ] Identify 3-5 people the new hire should meet in their first week

---

## 7. Cross-Functional Introductions

### Introduction Schedule

| Week | Who | Purpose | Format |
|------|-----|---------|--------|
| 1 | Immediate team (all members) | Get to know direct collaborators | Group introduction + 1:1 coffee chats |
| 1 | Onboarding buddy | Establish primary support relationship | 1:1 (30 min) |
| 1-2 | Product Manager | Understand product priorities and roadmap | 1:1 (30 min) |
| 1-2 | Designer (if applicable) | Understand design process and current initiatives | 1:1 (30 min) |
| 2 | CEO / Founder | Company vision, culture, and expectations | 1:1 (20 min) or small group |
| 2-3 | Customer Support lead | Understand common customer issues and feedback loops | 1:1 (30 min) |
| 2-3 | Marketing / Sales lead (if applicable) | Understand go-to-market and customer acquisition | 1:1 (20 min) |
| 3-4 | Engineers from other teams | Build cross-team relationships | Informal 1:1 coffee chats (15 min each) |

### Introduction Conversation Guide

Provide this to the new hire so introductions are productive, not awkward:

```
Questions to ask in every cross-functional introduction:
1. What does your team/role focus on right now?
2. How does your work connect to what I will be doing?
3. What is the best way to communicate with you (Slack, email, scheduled call)?
4. What is one thing you wish every new person understood about your area?
5. Is there anything I can help with as I get up to speed?
```

---

## 8. Feedback Checkpoints

### Structured Feedback Schedule

| Timing | Type | Participants | Focus |
|--------|------|-------------|-------|
| **End of Day 1** | Quick check-in | Buddy + new hire | Logistics, comfort level, immediate questions |
| **End of Week 1** | 1:1 with manager | Manager + new hire | First impressions, surprises, concerns, Week 2 plan |
| **Day 14** | Buddy check-in | Buddy + new hire | Productivity, social integration, unresolved questions |
| **Day 30** | Formal 30-day review | Manager + new hire | Against 30-day plan milestones. Adjust 60-day plan if needed. |
| **Day 45** | Informal pulse check | Manager + new hire | Quick sync on trajectory. Early warning detection. |
| **Day 60** | Formal 60-day review | Manager + new hire | Against 60-day plan milestones. Adjust 90-day plan if needed. |
| **Day 90** | Comprehensive review | Manager + new hire | Full assessment. End of onboarding determination. Growth plan. |

### 90-Day Onboarding Completion Assessment

| Criterion | Not Met | Partially Met | Fully Met |
|-----------|---------|---------------|-----------|
| **Technical competence** | Cannot work independently on routine tasks | Can work independently with occasional guidance | Fully autonomous on tasks at their level |
| **Codebase knowledge** | Lost without guidance in most areas | Comfortable in their primary area, some gaps | Navigates confidently, contributes to unfamiliar areas |
| **Process adherence** | Frequently misses steps or requires reminders | Follows most processes, occasional misses | Follows all processes, suggests improvements |
| **Team integration** | Isolated, does not participate in discussions | Participates when invited, some initiative | Active contributor, seeks out collaboration |
| **Cultural alignment** | Misaligned behaviors observed | Generally aligned, some adjustment areas | Strong alignment, models values |
| **Productivity** | Significantly below level expectations | Approaching level expectations | Meeting or exceeding level expectations |

**Outcome:**
- **All criteria "Fully Met":** Onboarding complete. Transition to regular performance cadence.
- **Some criteria "Partially Met":** Extend onboarding by 30 days with specific goals for gaps.
- **Any criteria "Not Met":** Serious conversation needed. May indicate mis-hire or role mismatch.

---

## 9. Onboarding Completion Criteria

Onboarding is complete when all of the following are true:

- [ ] New hire can take on tasks at their level without manager pre-scoping the approach
- [ ] New hire has shipped a meaningful feature or project independently
- [ ] New hire can deploy code to production following team procedures
- [ ] New hire participates actively in code reviews, planning, and retros
- [ ] New hire knows who to contact for different types of questions across the org
- [ ] New hire's manager is confident they would re-hire this person
- [ ] New hire reports feeling integrated, productive, and positive about their decision

**Expected timeline:** {{ONBOARDING_DURATION_DAYS}} days. Typical range: 30 days (junior, small codebase) to 90 days (senior, large codebase).

---

## Checklist

- [ ] Completed all pre-start administrative setup items
- [ ] Provisioned all accounts before Day 1
- [ ] Sent welcome email with Day 1 agenda
- [ ] Assigned and prepared onboarding buddy
- [ ] Executed Day 1 agenda without improvisation
- [ ] Set Week 1 goals and tracked completion
- [ ] Defined 30-60-90 day plan with measurable milestones
- [ ] Scheduled all cross-functional introductions
- [ ] Conducted feedback checkpoints at Day 1, Week 1, Day 14, Day 30, Day 60, Day 90
- [ ] Completed 90-day onboarding assessment
- [ ] Transitioned to regular performance review cadence
