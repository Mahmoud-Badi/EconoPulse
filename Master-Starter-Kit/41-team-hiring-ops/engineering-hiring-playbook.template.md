# Engineering Hiring Playbook

> Hiring an engineer is a $200K-$500K decision that takes 4-8 weeks to execute and 3-6 months to validate. This playbook covers every step from sourcing to offer, with templates, rubrics, and scorecards that replace gut feeling with structured evaluation. The goal is not to find the perfect candidate — it is to consistently avoid bad hires while giving great candidates a reason to choose you.

---

## 1. Sourcing Strategy

Where you source determines who you see. Relying on a single channel creates a homogeneous pipeline. Diversify deliberately.

### Channel Mix by Effectiveness

| Channel | Quality | Volume | Cost | Time to First Candidate | Best For |
|---------|---------|--------|------|------------------------|----------|
| **Employee referrals** | Highest | Low | $2K-$10K referral bonus | 1-2 weeks | All levels. 40-60% of best hires come from referrals. |
| **Direct outreach (LinkedIn, GitHub)** | High | Medium | $0 (founder time) or $500-$2K/mo (tools) | 2-4 weeks | Senior/Staff engineers. Requires personalized messages. |
| **Job boards (Hacker News, Key Values, Wellfound)** | Medium-High | Medium | $200-$500/post | 1-3 weeks | IC2-IC4. Startup-friendly talent pools. |
| **General job boards (LinkedIn, Indeed)** | Medium | High | $300-$1000/post | 1-2 weeks | IC1-IC3. High volume but noisy. |
| **Open source communities** | High | Very Low | $0 (time) | 4-8 weeks | Staff+ engineers. Long cultivation cycle. |
| **Tech meetups / conferences** | Medium-High | Low | $500-$5000 (sponsorship) | 4-12 weeks | Brand building + passive pipeline. |
| **External recruiter / agency** | Variable | Medium | 15-25% of first-year salary | 3-6 weeks | When you need speed or lack network. |
| **University / bootcamp pipelines** | Medium | High | $0-$2K | 4-12 weeks | IC1 only. Requires investment in mentorship. |

### Sourcing Approach by Recruiter Model

<!-- IF {{RECRUITER_MODEL}} == "founder-led" -->
**Founder-led sourcing:** You are sourcing directly. Allocate 5-10 hours/week to outreach, referral mining, and candidate conversations. This is the most effective approach for your first 5 hires because candidates join early-stage startups for the founder, not the company brand. Personal outreach from the founder has 3-5x the response rate of a recruiter's templated message.
<!-- ENDIF -->

<!-- IF {{RECRUITER_MODEL}} == "external-agency" -->
**External agency sourcing:** You are using a recruiting firm. Negotiate fees (standard is 20-25% of first year salary, push for 15-18%). Require weekly pipeline reports. Define the role using `role-definition-framework.template.md` before engaging the recruiter — vague briefs produce vague candidates.
<!-- ENDIF -->

<!-- IF {{RECRUITER_MODEL}} == "internal" -->
**Internal recruiter:** You have a dedicated recruiter on staff. Ensure they have access to hiring manager for weekly alignment. Define sourcing channel mix together and review pipeline quality bi-weekly.
<!-- ENDIF -->

### Outreach Message Template (Direct Sourcing)

**Subject:** [Specific thing you noticed about their work] — {{PROJECT_NAME}}

```
Hi [Name],

I saw your [specific contribution — OSS project, blog post, conference talk, GitHub repo]
and was impressed by [specific detail that shows you actually looked].

I'm building {{PROJECT_NAME}} — [one sentence about what it does and why it matters].
We're a team of {{TEAM_SIZE}} and looking for our next engineer to [specific impact they would have].

Would you be open to a 20-minute call to explore if there's a fit? No pressure either way.

[Your name]
Founder, {{PROJECT_NAME}}
```

**What NOT to do:**
- Generic "exciting opportunity" messages (instant delete)
- Copy-paste the same message to 200 people (response rate approaches zero)
- Lead with company credentials instead of candidate's work
- Send InMail to someone who is clearly not looking (check "Open to Work" status)

---

## 2. Job Description Templates

### Template: Senior Full-Stack Engineer (IC3)

```
{{PROJECT_NAME}} — Senior Full-Stack Engineer

ABOUT THE ROLE
We're looking for a Senior Engineer to [specific impact, e.g., "build the core
billing infrastructure that handles $XM in annual transactions" or "lead the
migration from monolith to microservices"]. You will be engineer #{{TEAM_SIZE + 1}}
and will have significant influence on architecture, stack choices, and
engineering culture.

WHAT YOU WILL DO
- [Specific project or system they will own in months 1-3]
- [Specific project or system they will own in months 3-6]
- Design and implement features end-to-end (database → API → UI)
- Review code, mentor junior engineers, and raise the team's technical bar
- Participate in on-call rotation (currently 1 week per {{ON_CALL_CYCLE}})
- Contribute to technical roadmap and architectural decisions

WHAT WE ARE LOOKING FOR
- Strong fundamentals in [primary language/framework]
- Experience designing systems that handle [relevant scale]
- Comfort with ambiguity — we are a {{TEAM_SIZE}}-person team, not a 500-person company
- Ability to ship independently while maintaining quality
- Clear written communication (we are {{WORK_LOCATION_POLICY}})

WHAT WE DO NOT REQUIRE
- A CS degree (or any degree)
- Knowledge of our exact stack (you will learn it)
- Previous startup experience (though it helps)
- Contributions to open source (though we appreciate them)

COMPENSATION
- Salary: [band from compensation-framework.template.md]
- Equity: [grant from compensation-framework.template.md]
- Benefits: [summary from compensation-framework.template.md]
- Work arrangement: {{WORK_LOCATION_POLICY}}

INTERVIEW PROCESS
{{INTERVIEW_ROUNDS}} stages, completed within 2 weeks:
1. [Stage 1]
2. [Stage 2]
3. [Stage 3]
[Add more based on {{INTERVIEW_ROUNDS}}]

We respect your time. Every interview has a clear purpose, and you will receive
feedback within 48 hours of each stage regardless of outcome.
```

---

## 3. Screening Criteria

### Resume / Application Review Rubric

Score each dimension 1-3. Candidates scoring 8+ proceed to phone screen.

| Dimension | 1 (Weak) | 2 (Acceptable) | 3 (Strong) |
|-----------|----------|-----------------|------------|
| **Relevant experience** | No relevant stack or domain experience | Some relevant experience, different scale | Direct experience with our stack and scale |
| **Impact evidence** | Lists responsibilities only | Mentions outcomes vaguely | Quantifies impact (metrics, scale, results) |
| **Trajectory** | Lateral moves, no growth signal | Steady progression | Clear growth in scope and responsibility |
| **Communication quality** | Typos, generic cover letter, unclear | Adequate, standard | Tailored, specific, demonstrates research |

**Automatic pass-through (skip resume scoring):**
- Referred by current team member with strong endorsement
- Significant open source contributions in relevant technology
- Published technical writing demonstrating deep expertise

**Automatic rejection (do not score):**
- Applied to 5+ roles at your company simultaneously
- Resume is clearly generated/untailored and does not mention your company or role
- Cannot legally work in your jurisdiction without sponsorship (if you do not sponsor)

### Phone Screen Scorecard (30 minutes)

| Area | Questions | Scoring (1-5) |
|------|-----------|---------------|
| **Motivation** | Why are you interested in {{PROJECT_NAME}}? What attracted you to this role? | 1=generic/no research, 5=specific and compelling |
| **Relevant experience** | Walk me through a project you led end-to-end. What were the technical decisions and trade-offs? | 1=surface-level, 5=deep technical judgment |
| **Self-awareness** | What is a technical decision you made that you would change if you could redo it? Why? | 1=cannot identify one, 5=thoughtful reflection |
| **Collaboration** | Describe a disagreement with a colleague about a technical approach. How did you resolve it? | 1=avoided or escalated, 5=collaborative resolution |
| **Questions for us** | What questions do you have about the role, team, or company? | 1=no questions, 5=insightful questions that show depth |

**Pass threshold:** Average score 3.0+ across all areas. Any single area scoring 1 is a disqualifier.

---

## 4. Technical Assessment

Choose one approach. Do not combine them — take-home + live coding is excessive and signals distrust.

### Option A: Take-Home Project

**When to use:** Asynchronous-friendly, candidate can show their best work, evaluates real-world skills. Best for senior roles and {{WORK_LOCATION_POLICY}} == "remote-first" teams.

**Project design principles:**
- Time-boxed to 3-4 hours maximum (respect candidate's time)
- Relates to your actual product domain (not abstract puzzles)
- Has a clear specification but allows creative decisions
- Includes a README explaining their approach, trade-offs, and what they would improve with more time
- Grading rubric is defined before sending the project

**Example project brief:**
```
Build a [simplified version of a feature in your product].

Requirements:
- [3-4 specific functional requirements]
- [1 non-functional requirement — e.g., "handle 1000 concurrent users"]

Time limit: 4 hours. We mean it — we evaluate quality of decisions, not completeness.

Include:
- Working code (does not need to be production-ready)
- README with:
  - How to run it
  - Architecture decisions and why
  - What you would do differently with more time
  - What assumptions you made

Evaluation criteria:
- Code organization and readability (30%)
- Problem-solving approach and trade-offs (30%)
- Technical correctness (20%)
- Communication quality in README (20%)
```

**Grading rubric:**

| Criterion | 1 (Weak) | 3 (Meets) | 5 (Exceeds) |
|-----------|----------|-----------|-------------|
| **Code organization** | Monolithic, hard to follow | Reasonable structure, some separation | Clean architecture, well-named, maintainable |
| **Problem-solving** | Brute force, no trade-off awareness | Reasonable approach, acknowledges alternatives | Elegant solution, clear trade-off analysis |
| **Technical correctness** | Bugs in core logic | Works for happy path, some edge cases missed | Handles edge cases, defensive coding |
| **Communication** | No README or minimal | README covers basics | README demonstrates clear thinking and self-awareness |

### Option B: Live Coding Session (60-90 minutes)

**When to use:** Want to observe problem-solving process in real-time. Best for mid-level roles and when take-home completion rates are low.

**Session structure:**
1. **Warm-up (10 min):** Easy problem to settle nerves. Not scored.
2. **Core problem (40-60 min):** Medium-difficulty problem related to your domain. Scored.
3. **Discussion (10-20 min):** Discuss trade-offs, scaling, testing approach. Scored.

**Live coding evaluation rubric:**

| Criterion | 1 (Weak) | 3 (Meets) | 5 (Exceeds) |
|-----------|----------|-----------|-------------|
| **Problem decomposition** | Jumps to code immediately | Asks clarifying questions, outlines approach | Systematically decomposes, identifies edge cases upfront |
| **Code quality** | Variable naming unclear, no structure | Readable, reasonable structure | Clean, idiomatic, would pass code review |
| **Communication** | Silent coding, cannot explain decisions | Explains approach when asked | Thinks aloud naturally, explains trade-offs |
| **Debugging** | Gets stuck, cannot recover | Debugs methodically when stuck | Uses systematic debugging, tests assumptions |
| **Adaptability** | Cannot adjust when requirements change | Adjusts with some guidance | Gracefully incorporates new constraints |

---

## 5. System Design Interview (45-60 minutes)

For IC3+ candidates. Evaluates architectural thinking, not coding ability.

### Session Structure

1. **Problem statement (5 min):** Present a system design challenge relevant to your product
2. **Requirements gathering (10 min):** Candidate asks clarifying questions, defines scope
3. **High-level design (15 min):** Candidate sketches architecture
4. **Deep dive (15 min):** Interviewer probes specific components
5. **Scaling / trade-offs (10 min):** Discussion of how the design handles 10x, 100x load

### Sample Problems

| Problem | Tests | Good For Level |
|---------|-------|---------------|
| Design a notification system that sends emails, SMS, and push notifications | Queue design, rate limiting, delivery guarantees, failure handling | IC3 |
| Design the data pipeline for a real-time analytics dashboard | Streaming architecture, aggregation, storage trade-offs, query patterns | IC3-IC4 |
| Design a multi-tenant SaaS architecture with per-tenant data isolation | Isolation models, performance, migration, billing integration | IC4-IC5 |
| Design a distributed task queue with exactly-once processing | Distributed systems, idempotency, failure modes, consistency | IC4-IC5 |

### System Design Scoring

| Criterion | 1 (Weak) | 3 (Meets) | 5 (Exceeds) |
|-----------|----------|-----------|-------------|
| **Requirements gathering** | Starts designing without asking questions | Asks basic clarifying questions | Systematically identifies functional and non-functional requirements |
| **Architecture** | Missing critical components | Covers major components, some gaps | Complete, well-reasoned architecture with clear boundaries |
| **Trade-off analysis** | Cannot articulate why they chose an approach | Identifies 1-2 trade-offs | Deep analysis of multiple trade-offs with context-dependent reasoning |
| **Scale awareness** | Design works for 100 users only | Identifies scaling bottlenecks when prompted | Proactively designs for scale, discusses caching, sharding, async processing |
| **Communication** | Disorganized presentation | Logical flow, uses diagrams | Clear narrative, structured approach, effective use of diagrams |

---

## 6. Culture / Values Interview (45 minutes)

Evaluates alignment with {{PROJECT_NAME}}'s operating principles and values (see `culture-documentation.template.md`). This is not a "culture fit" check (which often means "people like me") — it is a "culture add" evaluation.

### Behavioral Question Bank

| Value / Competency | Question | Follow-Up |
|-------------------|----------|-----------|
| **Ownership** | Tell me about a time you identified a problem that was not your responsibility and fixed it anyway. | What would have happened if you had not intervened? |
| **Collaboration** | Describe a situation where you disagreed with a teammate's approach. How did you handle it? | What did you learn from their perspective? |
| **Growth mindset** | What is a skill you are actively working to improve? How are you approaching it? | What feedback have you received about this area? |
| **Resilience** | Tell me about a project that failed or was cancelled. What did you take away from it? | Would you make the same decisions with hindsight? |
| **Communication** | How do you explain a technical concept to a non-technical stakeholder? Give me a specific example. | How did you know they understood? |
| **Bias for action** | Describe a time when you had to make a decision with incomplete information. | What was the outcome? What would you do differently? |

### Culture Interview Scoring

| Dimension | 1 (Concern) | 3 (Neutral) | 5 (Strong Add) |
|-----------|-------------|-------------|-----------------|
| **Values alignment** | Responses contradict core values | Responses are consistent but surface-level | Responses demonstrate deep alignment with specific examples |
| **Self-awareness** | Cannot identify weaknesses or past mistakes | Acknowledges areas for growth | Demonstrates genuine reflection and active improvement |
| **Collaboration signals** | Blame language, lone wolf patterns | Works with others adequately | Seeks out collaboration, elevates teammates |
| **Diversity of thought** | Responses are homogeneous, predictable | Some unique perspectives | Brings genuinely different viewpoint, challenges assumptions constructively |

---

## 7. Reference Checks

Do not skip this step. 20% of candidates who pass all interviews have reference-check issues that would have changed the decision.

### Reference Check Process

1. Ask the candidate for 3 references: 1 manager, 1 peer, 1 direct report (if applicable)
2. Also conduct 1-2 back-channel references (people you know who have worked with the candidate — ask permission first)
3. Schedule 15-20 minute calls with each reference
4. Use the structured questions below — do not freestyle

### Reference Check Questions

| Question | What You Are Really Assessing |
|----------|------------------------------|
| How did you work together, and for how long? | Verify the relationship is real |
| What were [Name]'s core responsibilities? | Verify resume accuracy |
| What would you say are [Name]'s top 2-3 strengths? | Confirm strengths match role requirements |
| If you could wave a magic wand and change one thing about working with [Name], what would it be? | Surface weaknesses without putting them on the defensive |
| How does [Name] handle disagreements with teammates? | Collaboration under pressure |
| On a scale of 1-10, how likely would you be to hire [Name] again? | The single most predictive question. Anything below 8 is a concern. |
| Is there anything else I should know? | Open-ended — sometimes reveals critical information |

### Red Flags in References

- Reference hesitates on the "hire again" question
- Reference provides only generic praise with no specific examples
- Reference was clearly coached by the candidate (scripted answers)
- Reference cannot describe specific contributions the candidate made
- Manager reference mentions performance issues or interpersonal conflicts

---

## 8. Offer Process

### Compensation Calculation

1. Determine level based on interview performance (use `role-definition-framework.template.md`)
2. Look up salary band for that level (use `compensation-framework.template.md`)
3. Apply geographic adjustment if applicable
4. Calculate equity grant based on level and stage
5. Add benefits package value
6. Compare total compensation to market data

### Negotiation Boundaries

| Component | Flexibility | Notes |
|-----------|------------|-------|
| **Base salary** | +/- 10% within band | Do not exceed band maximum — it creates inequity with existing team |
| **Equity** | +/- 25% within band | Can increase equity to offset below-band salary |
| **Signing bonus** | $0 - $20K | Use to bridge gap when candidate has competing offer |
| **Start date** | 2-6 weeks | Accommodate notice periods, do not rush |
| **Title** | Flexible within level | "Senior Engineer" vs "Senior Software Engineer" — accommodate preferences |
| **Benefits** | Non-negotiable | Uniform across company to avoid inequity |

### Offer Letter Checklist

- [ ] Base salary (annual, before tax)
- [ ] Equity grant (shares, percentage, vesting schedule, cliff, exercise window)
- [ ] Start date
- [ ] Title and level
- [ ] Reporting manager
- [ ] Benefits summary
- [ ] Work arrangement ({{WORK_LOCATION_POLICY}})
- [ ] At-will employment statement (or notice period if not US)
- [ ] Confidentiality and IP assignment agreement
- [ ] Background check disclosure (if applicable)
- [ ] Offer expiration date (typically 5-7 business days)

---

## 9. Candidate Experience

Your hiring process is a product. The candidate is the user. A bad experience costs you the hire AND their network's future interest.

### Response Time SLAs

| Stage | Maximum Response Time |
|-------|----------------------|
| Application received | Auto-acknowledgment within 24 hours |
| Resume review decision | 5 business days |
| Phone screen scheduling | 3 business days after resume approval |
| Technical assessment results | 5 business days after submission |
| Final decision after onsite | 3 business days |
| Offer delivery after decision | 1 business day |
| Rejection notification | Same day as decision — never ghost |

### Rejection Templates

**After resume review:**
```
Hi [Name],

Thank you for your interest in {{PROJECT_NAME}}. After reviewing your application
for the [Role] position, we have decided not to move forward at this time.

This is not a reflection of your abilities — our current needs are very specific
and we had a strong applicant pool. We would be happy to consider you for future
roles if you are open to it.

Best,
[Your name]
```

**After interview:**
```
Hi [Name],

Thank you for taking the time to interview with us for the [Role] position at
{{PROJECT_NAME}}. We enjoyed our conversations, particularly [specific positive
moment from the interview].

After careful consideration, we have decided to move forward with another
candidate whose experience more closely matches our current needs in [specific
area — be honest but kind].

[If true:] We were genuinely impressed by your [specific strength] and would
love to stay in touch for future opportunities.

Best,
[Your name]
```

---

## Checklist

- [ ] Defined sourcing channel mix based on {{RECRUITER_MODEL}} approach
- [ ] Created job description using the template for each open role
- [ ] Set up resume review rubric with scoring criteria
- [ ] Designed phone screen scorecard with pass threshold
- [ ] Chose technical assessment approach (take-home vs live coding)
- [ ] Created technical assessment grading rubric
- [ ] Designed system design interview for IC3+ candidates
- [ ] Built culture interview question bank aligned with documented values
- [ ] Established reference check process with structured questions
- [ ] Set compensation negotiation boundaries per role
- [ ] Created offer letter template with all required components
- [ ] Defined response time SLAs for every stage of the process
- [ ] Wrote rejection templates for resume and interview stages
- [ ] Briefed all interviewers on rubrics, scoring, and bias mitigation
