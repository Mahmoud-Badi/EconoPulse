# Team Scaling Decision Tree

> Every hiring decision is a $150K-$400K annual commitment with 3-6 month lag before ROI. This decision tree ensures you exhaust cheaper, faster alternatives before committing to a full-time hire — and when you do hire, you hire the right role in the right structure at the right compensation.

---

## How to Use This Tree

Walk through Nodes 1-5 sequentially. Each node produces a decision that feeds into the next. Do not skip nodes — the order matters because upstream decisions constrain downstream options. If you are a solo founder ({{TEAM_SIZE}} == 1), Node 1 is where you will spend the most time. If you already have a team and are planning the next hire, start at Node 2.

Record your decisions as you go. By the time you reach Node 5, you will have a complete hiring specification: whether to hire at all, what role, what employment structure, what compensation model, and what work arrangement.

---

## Node 1 — Do You Need to Hire?

The most expensive hire is one you did not need to make. Before opening a role, validate that you have exhausted the three alternatives: contracting, automating, and deferring.

### Option A: Hire (Full-Time Employee)

**Choose when:**
- The work is core to your product or business and will exist for 12+ months
- You need someone to grow into the role and accumulate institutional knowledge
- The domain requires deep context that takes months to build (architecture, customer relationships, product strategy)
- You have validated product-market fit and have revenue or funding to sustain the hire for at least 12 months

| Pros | Cons |
|------|------|
| Deep context and institutional knowledge | $150K-$400K+ annual commitment (salary + benefits + equity + overhead) |
| Aligned incentives through equity | 2-6 month ramp time before full productivity |
| Cultural integration and team cohesion | Termination is expensive and emotionally costly |
| Available for ad-hoc collaboration and mentorship | Benefits, payroll tax, equipment, and management overhead |
| Career growth and retention through advancement | Legal obligations (employment law, benefits, severance) |

**Signals you are ready:**
- [ ] The work has been consistent for 3+ months and shows no signs of decreasing
- [ ] You or a team member are spending 20+ hours/week on tasks outside your core competency
- [ ] A contractor has been doing this work and you want to bring it in-house
- [ ] The role requires access to sensitive systems, customer data, or strategic decisions
- [ ] You have 12+ months of runway at current burn rate plus this hire's cost

### Option B: Contract (Freelancer or Consultant)

**Choose when:**
- The work is well-scoped with a clear deliverable and timeline
- You need specialized expertise for a bounded period (3-6 months)
- You are testing whether a role is needed before committing to a full-time hire
- The work does not require deep institutional knowledge or ongoing context
- You need to move fast and cannot wait for a 4-8 week hiring cycle

| Pros | Cons |
|------|------|
| Fast to engage (days vs. weeks/months) | No institutional knowledge accumulation |
| No long-term commitment or benefits overhead | Higher hourly rate (but lower total cost for bounded work) |
| Access to specialized expertise on demand | Limited availability and competing priorities |
| Easy to scale up or down | IP ownership requires explicit contracts |
| Test-drive the role before committing to FTE | No cultural integration or team cohesion |

**Signals contracting is right:**
- [ ] You can define the deliverable in a 1-page SOW
- [ ] The work will take less than 6 months
- [ ] The expertise needed is highly specialized and you will not need it continuously
- [ ] You are pre-product-market-fit and need to stay lean
- [ ] You want to validate the role before hiring full-time

### Option C: Automate

**Choose when:**
- The work is repetitive, rule-based, and does not require human judgment
- AI tools, scripts, or existing software can handle 80%+ of the work
- The cost of automation is less than 6 months of a contractor's hourly rate
- The work volume is growing and will eventually require hiring anyway — automation buys time

| Pros | Cons |
|------|------|
| One-time investment with recurring returns | Upfront development time |
| Scales infinitely without additional cost | Cannot handle ambiguous or novel situations |
| Consistent quality (no human error variance) | Requires maintenance and monitoring |
| Available 24/7 | May miss edge cases that a human would catch |
| Compounds — each automation frees capacity for the next | Over-automating can create brittleness |

**Common automatable tasks:**
- Customer support FAQ responses (AI chatbot — see Section 33)
- Social media scheduling and basic engagement
- Invoice generation and payment follow-ups
- Deployment and infrastructure monitoring (see Section 09)
- Data entry, report generation, and metrics dashboards
- Email sequences and drip campaigns (see Section 19)
- Code linting, formatting, and basic PR reviews (see Section 22)

### Option D: Defer

**Choose when:**
- You are pre-product-market-fit and every dollar extends runway
- The pain is real but survivable for another 3-6 months
- You are about to raise funding and hiring now would be at worse terms
- The role depends on decisions that have not been made yet (platform choice, market segment, business model)
- Deferring forces creative constraints that may lead to better solutions

| Pros | Cons |
|------|------|
| Preserves runway and optionality | Founder burnout risk increases |
| Forces creative problem-solving | Opportunity cost of slower execution |
| Avoids premature organizational complexity | Key person risk (everything depends on founder) |
| Keeps decision space open for pivots | Quality and speed may suffer |

**Warning signs you have deferred too long:**
- You are working 80+ hour weeks for more than 2 consecutive months
- Customer response times have degraded noticeably
- You are making critical decisions while exhausted
- A key opportunity requires capabilities you do not have and cannot learn fast enough
- Your health or relationships are materially suffering

---

## Node 2 — What Role First?

If Node 1 led to "Hire," the next question is which role creates the most leverage. Your answer depends on your current bottleneck, not your aspiration. Hire for the constraint, not the vision.

### Option A: Engineering

**Hire first when:**
- You are a technical founder who has validated the product but cannot build fast enough
- Feature velocity is the binding constraint on growth
- Technical debt is accumulating faster than you can pay it down
- You need a specific technical skill you lack (mobile, ML, infrastructure)

| Pros | Cons |
|------|------|
| Directly increases feature velocity | Longest ramp time (2-4 months for meaningful contribution) |
| Reduces technical debt and improves reliability | Highest salary band in most markets |
| Enables parallel workstreams | Requires technical interview capability (can you evaluate them?) |
| Strong talent pool on standard job boards | Senior engineers are the most competitive market |

**Typical first engineering hire:** Senior full-stack engineer with 5-8 years of experience in your primary stack. Avoid hiring junior engineers first — you need someone who can be autonomous while you handle everything else.

### Option B: Design

**Hire first when:**
- You are a technical founder shipping functional but ugly or confusing products
- User research is a gap and you are building based on assumptions
- Your conversion rates or retention suggest UX problems, not feature gaps
- You need someone to own the entire design process (research → wireframes → visual → interaction)

| Pros | Cons |
|------|------|
| Dramatically improves user experience and conversion | Hard to evaluate without design portfolio review |
| Reduces engineering rework from unclear specs | Designers who can also do research are rare |
| Brings user empathy into product decisions | May feel like a luxury hire before PMF |
| Can create marketing assets in addition to product design | Needs development partnership to ship |

**Typical first design hire:** Product designer with strong interaction design skills and basic user research capability. Not a visual-only designer — you need someone who can run a usability test and translate findings into wireframes.

### Option C: Product

**Hire first when:**
- You have engineers and designers but no one owns the roadmap
- Customer feedback is plentiful but unstructured and not driving decisions
- You are spending 50%+ of your time on product decisions instead of business development
- You need someone to own discovery, prioritization, and cross-functional coordination

| Pros | Cons |
|------|------|
| Frees founder time for business development | Premature before 5-8 person team |
| Brings structured discovery and prioritization | Risk of process overhead in small team |
| Improves cross-functional communication | Hard to evaluate — PM success is context-dependent |
| Owns metrics and experiments | May conflict with founder's product vision |

**Warning:** Hiring a product manager before you have 3+ engineers is almost always premature. The coordination cost they manage does not exist yet.

### Option D: Operations

**Hire first when:**
- You are a technical founder drowning in non-technical work (accounting, legal, HR, office)
- Customer onboarding is manual and time-consuming
- You need someone to manage vendor relationships, contracts, and compliance
- Administrative burden is preventing you from focusing on product or customers

| Pros | Cons |
|------|------|
| Immediately frees founder time | Lower leverage than engineering hires |
| Handles the work nobody else wants to do | Difficult to define scope clearly |
| Often the most cost-effective first hire | Risk of becoming a catch-all role |
| Can grow into COO or head of operations | Requires trust with financial and legal access |

**Typical first ops hire:** Operations generalist who can handle bookkeeping, vendor management, basic HR, and customer operations. Look for someone who has been employee #5-15 at a previous startup.

### Option E: Sales / Marketing

**Hire first when:**
- You have a working product but no systematic way to acquire customers
- You are a technical founder with no sales or marketing experience
- Inbound leads exist but nobody is following up consistently
- Your growth is word-of-mouth only and you need to add a scalable channel

| Pros | Cons |
|------|------|
| Directly drives revenue growth | Expensive if product-market fit is not proven |
| Brings market intelligence and customer insights | Sales hires need leads to work — marketing infrastructure first |
| Tests pricing and positioning with real prospects | Long sales cycles mean delayed ROI signal |
| Reduces founder's time on sales calls | Misaligned incentives if comp is pure commission |

**Warning:** Do not hire sales before you can articulate your ICP, value proposition, and pricing. A sales hire without positioning is an expensive experiment.

---

## Node 3 — FTE vs Contractor vs Agency?

You have decided to bring someone on. Now determine the employment structure. This decision has legal, financial, and operational implications that differ by jurisdiction.

### Option A: Full-Time Employee (FTE)

**Best for:**
- Core roles that require deep institutional knowledge
- Roles where you need 40+ hours/week of dedicated capacity
- Positions requiring access to sensitive data, systems, or strategic discussions
- Roles where career growth and retention matter

| Pros | Cons |
|------|------|
| Full dedication and availability | Benefits, payroll tax, equipment (30-40% on top of salary) |
| Equity alignment | Employment law obligations |
| Deep context accumulation over time | Termination process and potential severance |
| Team culture integration | Slower to hire (4-8 weeks typical) |

### Option B: Contractor (1099 / Freelancer)

**Best for:**
- Project-based work with defined scope and timeline
- Specialized skills needed for 3-6 months
- Testing a role before committing to FTE
- Supplementing team capacity during peak periods

| Pros | Cons |
|------|------|
| No benefits overhead | Higher hourly rate |
| Flexible engagement terms | Limited availability (they have other clients) |
| Fast to engage | Misclassification risk (IRS/tax authority scrutiny) |
| No termination process | No equity alignment |

**Misclassification warning:** If a contractor works full-time hours, uses your equipment, follows your schedule, and has no other clients, tax authorities may reclassify them as an employee. This creates back-tax liability, penalties, and legal risk. See `contractor-vendor-management.template.md` for compliance guidelines.

### Option C: Agency

**Best for:**
- Functions where you need a team, not an individual (design agency, dev shop, marketing agency)
- Work that requires tools, processes, and infrastructure you do not have
- Burst capacity needs that exceed what a single contractor can deliver
- Domains where you cannot evaluate individual quality (you need the agency's QA layer)

| Pros | Cons |
|------|------|
| Managed team with built-in QA | Highest cost per hour |
| Access to diverse skill sets | Less control over who does the work |
| Established processes and tools | Communication overhead and context loss |
| Scalable capacity | IP ownership requires careful contracting |

---

## Node 4 — Compensation Model?

How you compensate determines who you attract. Each model selects for a different candidate profile.

### Option A: Market-Rate Salary + Standard Equity

**Choose when:**
- You have funding and can compete on cash compensation
- You want to attract experienced professionals who have options
- Your equity story is solid but not exceptional
- You are hiring for roles where market benchmarks are well-established

| Pros | Cons |
|------|------|
| Attracts a broad candidate pool | Higher cash burn |
| Straightforward benchmarking | Equity dilution adds up |
| Candidates evaluate offer on face value | May attract candidates who optimize for cash |
| Standard negotiation dynamics | Less differentiation from larger companies |

**Typical structure:** 50th-75th percentile salary + 0.05%-0.5% equity (4-year vest, 1-year cliff)

### Option B: Below-Market Salary + Heavy Equity

**Choose when:**
- You are pre-Series A and need to conserve cash
- Your equity story is compelling (large market, strong traction, credible team)
- You are hiring believers — people who join for the upside, not the salary
- The role is senior enough that the candidate can evaluate equity value

| Pros | Cons |
|------|------|
| Preserves runway | Smaller candidate pool (filters out risk-averse) |
| Selects for mission-aligned candidates | May create financial stress for employees |
| Higher equity grants create stronger alignment | Equity is illiquid — creates resentment if exit is distant |
| Lower cash burn during critical growth phase | Difficult to hire mid-career with family obligations |

**Typical structure:** 25th-40th percentile salary + 0.25%-2% equity (4-year vest, 1-year cliff)

### Option C: Above-Market Salary + No/Minimal Equity

**Choose when:**
- Your equity story is weak or non-existent (bootstrapped, lifestyle business, consultancy)
- You are competing against big tech for talent and need to match cash
- The role is operational (not core product) and equity alignment is less important
- You want to attract candidates who value stability over risk

| Pros | Cons |
|------|------|
| Attracts candidates from big tech | Highest cash burn |
| Simple compensation structure | No long-term retention mechanism |
| Candidates join for the role, not the bet | May attract candidates who will leave for 10% more |
| No cap table complexity | Less alignment with company outcomes |

**Typical structure:** 75th-90th percentile salary + 0-0.01% equity or profit sharing

### Option D: Contractor Hourly / Project Rate

**Choose when:**
- Engagement is temporary or project-based
- You want to pay for output, not time
- The contractor sets their own rate and you evaluate ROI per deliverable
- Benefits and equity are not part of the arrangement

| Pros | Cons |
|------|------|
| Pay for what you get | No long-term cost predictability |
| No benefits overhead | Contractor may increase rates |
| Simple invoicing | No retention mechanism |
| Market sets the rate | Premium for flexibility |

**Market rates (US, 2025-2026):**
- Junior developer: $50-$80/hr
- Senior developer: $100-$175/hr
- Staff/Principal developer: $175-$300/hr
- Product designer: $75-$150/hr
- Technical writer: $60-$120/hr
- DevOps/SRE: $120-$200/hr

---

## Node 5 — Remote vs Hybrid vs On-Site?

Your work arrangement policy determines your talent pool radius, communication overhead, and culture formation. This is not a perk decision — it is a strategic decision with long-term consequences.

### Option A: Remote-First

**Choose when:**
- You want access to the global talent pool (or at least national)
- Your product and workflows are already digital and asynchronous
- You value output over presence
- You are competing for talent against companies with offices in expensive cities

| Pros | Cons |
|------|------|
| Global talent pool | Culture formation requires deliberate effort |
| No office cost | Timezone management complexity |
| Attractive to senior engineers who value autonomy | Onboarding is harder (no hallway conversations) |
| Lower cost-of-living hires possible | Collaboration on ambiguous problems is slower |
| Higher reported job satisfaction | Social isolation risk for employees |

**Timezone constraint:** Require minimum {{TIMEZONE_OVERLAP_HOURS}} hours of overlap for synchronous communication. Teams with less than 4 hours of overlap report 2x more coordination failures.

**Essential infrastructure:**
- Async communication norms (see Section 27)
- Written decision logs (not just Slack conversations)
- Video-first meetings with cameras on
- Annual or semi-annual in-person gatherings (budget $3K-$5K per person)
- Home office stipend ($1K-$2.5K one-time + $100-$200/month)

### Option B: Hybrid (2-3 days in office)

**Choose when:**
- You have an office and want the benefits of in-person collaboration
- Your team is primarily in one metro area
- You want structured in-person time for planning, design reviews, and team building
- You are hiring from the local talent pool and hybrid is the market expectation

| Pros | Cons |
|------|------|
| Best of both worlds (in theory) | Worst of both worlds (in practice, if poorly managed) |
| In-person collaboration for complex work | Creates two classes of employees (in-office vs. remote days) |
| Office culture and spontaneous interaction | Requires both office and remote infrastructure |
| Easier onboarding than full remote | Coordination overhead (which days? which meetings?) |
| Local talent pool is sufficient | "Hybrid" means different things to everyone |

**Critical rule:** Define specific in-office days and make them consistent. "Come in when you want" is not hybrid — it is chaos. Tuesday-Wednesday-Thursday is the most common pattern. Monday and Friday are the most common remote days.

### Option C: On-Site (Full-Time in Office)

**Choose when:**
- Your work requires physical presence (hardware, lab equipment, classified environments)
- You are building a culture that depends on high-bandwidth, spontaneous collaboration
- Your entire team is in one location and you are not planning to hire remotely
- You are an early-stage startup where the intensity of in-person collaboration accelerates product development

| Pros | Cons |
|------|------|
| Highest bandwidth communication | Talent pool limited to commute radius |
| Strongest culture formation | Office costs ($500-$1500/month per person) |
| Easiest onboarding and mentorship | Less attractive to senior talent who value flexibility |
| Spontaneous collaboration and problem-solving | No geographic salary arbitrage |
| Clear work-life separation (for some people) | Commute costs and time |

**Reality check:** Post-2020, requiring full on-site for software roles reduces your candidate pool by 50-70% and increases salary expectations by 10-15% (to compensate for commute and flexibility loss). Only mandate on-site if the collaboration benefits clearly outweigh the talent pool cost.

---

## Decision Summary Template

After walking through all 5 nodes, record your decisions:

```
TEAM SCALING DECISIONS
======================
Date: ____
Current team size: {{TEAM_SIZE}}
Target team size (12 months): {{TEAM_GROWTH_PLAN}}

Node 1 — Hire / Contract / Automate / Defer: ____
  Rationale: ____

Node 2 — First Role: {{FIRST_HIRE_ROLE}}
  Bottleneck this solves: ____
  Expected impact: ____

Node 3 — Structure: FTE / Contractor / Agency
  Rationale: ____
  If contractor: expected duration ____

Node 4 — Compensation Model: {{COMPENSATION_MODEL}}
  Budget range: ____
  Equity grant range: ____

Node 5 — Work Arrangement: {{WORK_LOCATION_POLICY}}
  Timezone requirement: {{TIMEZONE_OVERLAP_HOURS}} hours overlap
  Location constraints: ____

Next steps:
- [ ] Complete role definition (role-definition-framework.template.md)
- [ ] Set compensation bands (compensation-framework.template.md)
- [ ] Design interview pipeline (interview-process.template.md)
- [ ] Build onboarding plan (employee-onboarding.template.md)
```
