# Support Team Hiring & Structure

> {{PROJECT_NAME}} — Build the right team at the right time. Hiring too early wastes money. Hiring too late burns out founders.

---

## Overview

Your support team structure should match your stage, not your ambition. A solo founder handling 30 tickets a month does not need a 3-tier support organization. A team drowning in 800 tickets a month cannot survive on founder heroics. This document helps you build the right team at the right time, hire the right people, and structure roles for growth.

**Cross-references:**
- For L1/L2/L3 escalation workflow, see `23-customer-support/support-escalation-workflow.md`
- For QA scoring and agent performance management, see `qa-scoring-and-coaching.template.md`
- For agent onboarding after hiring, see `agent-onboarding-playbook.template.md`

---

## Team Structure Models

### Stage 1: Solo Founder (0–50 tickets/month)

**Who handles support:** Founder(s) directly.

**Why this is correct:** At this stage, every ticket is product research. Founders need to feel the pain their users feel. Delegating too early means missing critical product signals.

**Setup:**
- Shared inbox ({{SUPPORT_EMAIL}}) — founder checks 3x daily
- Simple KB with top 10 articles (prevent repeat questions)
- No SLAs published (but aim for < 24-hour response internally)
- Use {{SUPPORT_PLATFORM}} free tier or just email

**Transition signal:** Founder spending > 2 hours/day on support OR response time consistently > 24 hours.

### Stage 2: First Hire (50–200 tickets/month)

**Who handles support:** 1 dedicated generalist support agent + founder as L2 escalation.

**Why one generalist:** At this volume, specialization is waste. You need someone who can handle billing, bugs, and how-tos. The founder handles edge cases and engineering escalations.

**Hiring profile:**
- Strong writer (support is primarily written communication)
- Empathetic and patient (will talk to frustrated people daily)
- Quick learner (must internalize your product rapidly)
- Self-directed (founder can't manage closely at this stage)

**Setup:**
- Agent handles L1 tickets independently
- Founder handles L2 escalations and engineering bugs
- Publish basic SLAs (24-hour first response)
- KB expanded to 30+ articles

**Transition signal:** Single agent handling > 40 tickets/day OR queue consistently growing.

### Stage 3: Small Team (200–1000 tickets/month)

**Who handles support:** 2–5 agents with emerging specialization + team lead.

**Structure:**
```
Team Lead / CX Manager
├── Agent 1 (General support)
├── Agent 2 (General support)
├── Agent 3 (Billing + account specialist) ← optional specialization
└── Agent 4 (Technical support / L2) ← optional specialization
```

**Why specialization emerges:** At 3+ agents, you see patterns — some agents are better at technical issues, others at billing. Let specialization emerge naturally, don't force it.

**Transition signal:** Team of 5+ agents OR need for 12+ hours/day coverage.

### Stage 4: Scaled Team (1000+ tickets/month)

**Who handles support:** 6+ agents, tiered structure, dedicated roles.

**Structure:**
```
CX Manager / Head of Support
├── Support Team Lead
│   ├── L1 Agents (3-5) — handle standard tickets
│   ├── L2 Specialist (1-2) — handle escalations, complex issues
│   └── L3 Support Engineer (1) — handle bugs, API issues, engineering escalation
├── Support Ops (1) — tooling, reporting, process improvement
└── KB / Content Manager (0.5-1) — knowledge base maintenance
```

---

## Role Definitions

### L1 Support Agent

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Handle standard tickets (how-tos, billing, account), write KB articles, tag and categorize tickets, meet SLA targets, escalate per workflow |
| **Required skills** | Excellent written communication, empathy under pressure, basic troubleshooting, fast typing (60+ WPM), comfort with support tools |
| **Nice-to-have** | Prior support experience, familiarity with {{SUPPORT_PLATFORM}}, basic SQL, second language |
| **Ticket load** | 25–35 tickets/day |
| **Reporting to** | Team Lead or CX Manager |

### L2 Support Specialist

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Handle escalated tickets, investigate complex issues, reproduce bugs, coordinate with engineering, mentor L1 agents |
| **Required skills** | All L1 skills + deeper product knowledge, ability to read logs/error messages, structured problem-solving |
| **Nice-to-have** | Prior L1 experience (6+ months), basic coding knowledge, API familiarity |
| **Ticket load** | 15–20 complex tickets/day |
| **Reporting to** | Team Lead or CX Manager |

### L3 Support Engineer

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Debug technical issues, read application logs, reproduce edge cases, file engineering tickets with full context, API support, write technical KB articles |
| **Required skills** | All L2 skills + coding ability (read code, write scripts), database queries, API debugging, log analysis |
| **Nice-to-have** | CS degree or equivalent, prior engineering experience, DevOps exposure |
| **Ticket load** | 5–10 deep technical cases/day |
| **Reporting to** | CX Manager (dotted line to Engineering) |

### Support Team Lead

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Queue management, agent coaching, QA reviews, schedule management, escalation point, weekly metrics review, process improvement |
| **Required skills** | 1+ year support experience, leadership ability, conflict resolution, data literacy, calm under pressure |
| **Nice-to-have** | Prior lead experience, {{SUPPORT_PLATFORM}} admin skills, training experience |
| **Direct reports** | 4–8 agents |
| **Reporting to** | CX Manager |

### CX Manager / Head of Support

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Team strategy, hiring, budget, cross-functional coordination (product, engineering, marketing), executive reporting, CX program design |
| **Required skills** | 3+ years CX/support leadership, hiring and team building, data-driven decision making, executive communication, vendor management |
| **Nice-to-have** | Experience scaling support orgs, AI/automation experience, P&L ownership |
| **Direct reports** | Team leads, support ops, KB manager |
| **Reporting to** | VP Product or COO |

### Support Ops

| Attribute | Details |
|-----------|---------|
| **Responsibilities** | Platform configuration, workflow automation, reporting and dashboards, tool evaluation, process documentation, integration management |
| **Required skills** | {{SUPPORT_PLATFORM}} admin expertise, data analysis, automation tools, SQL, basic scripting |
| **Nice-to-have** | Prior ops role, Zapier/Make experience, dashboard building (Metabase/Looker) |
| **Reporting to** | CX Manager |

---

## Job Description Templates

### Template: L1 Support Agent

```markdown
# Customer Support Agent — {{COMPANY_NAME}}

## About the Role

We're looking for a Customer Support Agent to be the front line of our user
experience at {{PROJECT_NAME}}. You'll help customers solve problems, answer
questions, and get the most out of our product. This is a high-impact role —
every conversation shapes how our users feel about {{PROJECT_NAME}}.

## What You'll Do

- Respond to customer inquiries via {{SUPPORT_CHANNELS}} within SLA targets
- Troubleshoot issues and guide users through solutions step-by-step
- Write and update knowledge base articles based on common questions
- Categorize and tag tickets to help us identify product improvement opportunities
- Escalate complex issues with full context (never make the user repeat themselves)
- Contribute to the team's canned response library
- Participate in weekly QA reviews and continuous learning

## What We're Looking For

- 1+ year of customer-facing experience (support, retail, hospitality — we value the skill, not the industry)
- Exceptional written communication — clear, warm, and concise
- Genuine empathy for people who are frustrated or confused
- Systematic problem-solving: you diagnose before you prescribe
- Comfort working in {{SUPPORT_PLATFORM}} or similar tools
- Self-directed: you can prioritize a queue and manage your time
- Reliable: you show up on time and follow through on commitments

## Nice to Have

- Experience with SaaS or technical products
- Basic SQL knowledge
- Fluency in additional languages ({{CX_SUPPORTED_LANGUAGES}})
- Familiarity with {{SUPPORT_PLATFORM}}

## What We Offer

- [Compensation range for your market]
- [Benefits]
- [Remote/hybrid/onsite]
- 30-day structured onboarding program
- Clear growth path: L1 → L2 → Team Lead → CX Manager
```

### Template: CX Manager

```markdown
# CX Manager — {{COMPANY_NAME}}

## About the Role

We're hiring our first CX Manager to build and lead the customer experience
function at {{PROJECT_NAME}}. You'll own everything from support operations
to feedback systems to customer health. This is a builder role — you'll
design the systems, hire the team, and set the standards.

## What You'll Do

- Build and lead the support team (hiring, onboarding, coaching, performance management)
- Design and implement CX operations: knowledge base, chatbot, ticketing, feedback loops
- Set and track CX KPIs: CSAT, NPS, resolution time, health scores, deflection rate
- Own the voice of the customer: aggregate feedback, identify themes, present to product team
- Manage vendor relationships ({{SUPPORT_PLATFORM}}, survey tools, analytics)
- Build reporting and dashboards for CX metrics
- Coordinate cross-functionally with Product, Engineering, and Marketing

## What We're Looking For

- 3+ years leading a support or CX team (you've hired, coached, and managed performance)
- Experience scaling support from small team to structured operation
- Data-driven: you make decisions based on metrics, not gut feel
- Strong communicator: you can present to executives and coach individual agents
- Systems thinker: you design processes that scale, not just solve today's problem
- Customer obsession: you genuinely care about user experience

## Nice to Have

- Experience with AI-powered support tools (chatbots, auto-categorization)
- {{SUPPORT_PLATFORM}} administration experience
- Experience with health scoring or churn prediction programs
- SQL proficiency for ad-hoc analysis
```

---

## Interview Rubric

Score each dimension 1–5:

| Dimension | 1 (Poor) | 2 (Below) | 3 (Meets) | 4 (Exceeds) | 5 (Exceptional) | Weight |
|-----------|----------|-----------|-----------|-------------|-----------------|--------|
| **Empathy & Communication** | Dismissive, defensive, or robotic responses | Polite but formulaic, doesn't acknowledge emotions | Acknowledges frustration, warm tone, clear explanation | De-escalates naturally, makes customer feel heard, personalized | Turns angry customer into advocate — demonstrates genuine care + solution | 30% |
| **Technical Aptitude** | Can't navigate basic product UI | Needs heavy guidance, slow to learn | Learns product features with normal ramp-up time | Picks up product quickly, asks smart questions about architecture | Self-teaches, explores edge cases, explains technical concepts simply | 20% |
| **Writing Quality** | Unclear, grammatical errors, too long/short | Understandable but generic, template-feeling | Clear, concise, professional, addresses the question | Warm, personalized, anticipates follow-up questions | Could be published as a best-practice example | 25% |
| **Problem-Solving** | Guesses without diagnosing, gives up quickly | Follows scripts but stuck when off-script | Systematic: asks clarifying questions, isolates the problem, proposes solution | Finds root cause, not just symptoms. Identifies patterns. | Diagnoses novel issues, proposes process improvements to prevent recurrence | 15% |
| **Tool Proficiency** | Uncomfortable with computers | Can use tools with guidance | Navigates support tools independently | Configures tools, creates macros, builds workflows | Automates processes, builds integrations, power user | 10% |

**Passing threshold:** Average ≥ 3.5 with no dimension below 2.

---

## Hiring Assessment Exercises

### Exercise 1: Ticket Response Test (30 minutes)

Give the candidate 3 tickets of increasing difficulty. They write responses as if they were the support agent. Evaluate using the writing quality and empathy rubric dimensions.

**Easy ticket:**
> "How do I change my password? I can't find the setting."

**Medium ticket:**
> "I was charged $49.99 but I'm on the free plan. I never upgraded. I want a refund immediately."

**Hard ticket:**
> "I've been trying to integrate your API with our system for 3 days. The documentation says to use the /v2/widgets endpoint but I keep getting 403 errors. I've attached my API key and request headers. Our launch is in 2 days and I'm considering switching to [competitor] if this isn't resolved today."

**Evaluation:** Are responses accurate? Empathetic? Do they solve the problem or just acknowledge it? Do they set appropriate expectations? For the hard ticket, do they handle the competitor threat professionally?

### Exercise 2: Prioritization Exercise (15 minutes)

Present 8 tickets and ask the candidate to rank them by priority:

1. Enterprise customer (ARR $50K): "Login page showing 500 error for all users on our account"
2. Free user: "Can you add dark mode?"
3. Pro user: "I accidentally deleted a project. Is there any way to recover it?"
4. Free user: "Your product is terrible, I want my data exported immediately"
5. Enterprise customer: "Quick question — how do we add SSO?"
6. Pro user: "Billing charged me twice this month"
7. Free user: "Getting a weird error sometimes, not sure what causes it"
8. Enterprise customer: "We're evaluating renewals next week and have some concerns"

**Expected ranking (approximate):** 1 (production down, enterprise) → 8 (churn risk, enterprise) → 6 (billing error) → 3 (data loss) → 5 (enterprise question) → 4 (data export request) → 7 (intermittent bug) → 2 (feature request)

**Evaluation:** Does the candidate consider impact, urgency, customer tier, and business risk? Can they articulate their reasoning?

### Exercise 3: KB Article Writing Test (20 minutes)

Ask the candidate to write a short KB article (300–500 words) explaining how to do something they learned about your product during the interview. Evaluate: clarity, structure, helpfulness, tone.

---

## When to Hire: Decision Signals

| Signal | Threshold | Action |
|--------|-----------|--------|
| Founder time on support | > 2 hours/day | Hire first support agent |
| Average response time | Consistently above SLA target | Add agent capacity |
| Agent daily ticket load | > 40 tickets/day sustained | Agent at capacity — hire another |
| Agent CSAT | Dropping below {{CX_CSAT_TARGET}} | Investigate (training or capacity issue) |
| Ticket backlog | Growing week-over-week for 3+ weeks | Capacity shortage — hire |
| Off-hours coverage needed | Customers in multiple timezones, tickets piling up overnight | Hire for timezone coverage |
| Specialization needed | > 20% of tickets require technical deep-dives | Hire L2 or L3 specialist |
| Team size reaches 4+ agents | Need dedicated people management | Promote or hire Team Lead |
| Multiple support programs needed (KB, chatbot, feedback) | Need process and tooling ownership | Hire Support Ops |

---

## Implementation Checklist

- [ ] Assess current stage using the team structure models above
- [ ] If hiring: write job description using templates (customize for your product and culture)
- [ ] Design interview process (phone screen → assessment exercises → team interview → offer)
- [ ] Create scoring rubric (print rubric for interviewers to score consistently)
- [ ] Source candidates (support communities, previous users of your product, LinkedIn)
- [ ] Run assessment exercises during interview (all 3 exercises)
- [ ] Check references (specifically ask about empathy under pressure and writing quality)
- [ ] Prepare onboarding (see `agent-onboarding-playbook.template.md`)
- [ ] Set 30/60/90 day expectations for new hire
- [ ] Schedule first QA review at end of Week 4
