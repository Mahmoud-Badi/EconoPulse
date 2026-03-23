# Role Definition Framework

> A vague job description attracts vague candidates. This framework forces precision on what each role does, what level it sits at, what success looks like, and where it leads — before you write a single job posting. The 30 minutes you spend here saves 30 hours of interviewing wrong-fit candidates.

---

## 1. Role Template Structure

Every role in {{PROJECT_NAME}} should be defined using this standardized template. Fill it out completely before posting a job or engaging a recruiter. Incomplete role definitions are the #1 cause of mis-hires.

### Role Definition Template

```
ROLE DEFINITION
===============
Title: ____
Department: ____
Level: ____ (see engineering/management levels below)
Reports to: ____
Location: {{WORK_LOCATION_POLICY}}
Compensation band: ____ (see compensation-framework.template.md)

MISSION (1 sentence)
What does this person exist to accomplish?
____

KEY RESPONSIBILITIES (5-8 bullet points)
What will this person do every week?
- ____
- ____
- ____
- ____
- ____

SUCCESS METRICS (3-5 measurable outcomes)
How will you know this hire is working after 6 months?
- ____
- ____
- ____

REQUIRED SKILLS (hard requirements — dealbreakers if missing)
- ____
- ____
- ____

PREFERRED SKILLS (nice to have — not dealbreakers)
- ____
- ____

ANTI-REQUIREMENTS (things that do NOT matter for this role)
List things other companies require but you do not, to signal culture:
- ____
- ____

GROWTH PATH
Where does this role lead in 18-24 months?
- Lateral: ____
- Upward: ____
- Expansion: ____

INTERVIEW FOCUS AREAS
What competencies must the interview process evaluate?
1. ____
2. ____
3. ____
4. ____
```

### Common Mistakes in Role Definition

| Mistake | Why It Hurts | Fix |
|---------|-------------|-----|
| Listing 15+ responsibilities | Signals you want one person to do three jobs | Cap at 8, prioritize ruthlessly |
| "5+ years of experience required" | Excludes strong candidates, includes weak ones | Describe the skills you need, not the time |
| No success metrics | Hire cannot tell if they are doing well | Define 3-5 measurable 6-month outcomes |
| Copy-pasting from another company | Role does not match your actual needs | Start from scratch using this template |
| Title inflation | "VP of Engineering" for a 5-person team creates expectation mismatch | Use level-appropriate titles |
| No anti-requirements | Talented candidates self-select out due to assumptions | Explicitly state what you do NOT require |

---

## 2. Engineering Levels (IC1-IC6)

Engineering levels define scope of impact, autonomy, and technical expectations. Adapt the number of levels to your company size — a 10-person startup needs 3-4 levels, not 6.

<!-- IF {{ENGINEERING_LEVELS}} == "4" -->
Use IC1, IC2, IC4, and IC5 as your four levels. Skip IC3 and IC6 until you have 25+ engineers.
<!-- ENDIF -->

<!-- IF {{ENGINEERING_LEVELS}} == "6" -->
Use all six levels. This is appropriate for companies with 50+ engineers where fine-grained leveling matters for compensation and career progression.
<!-- ENDIF -->

### IC1 — Junior Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Individual tasks within a well-defined project |
| **Autonomy** | Works with guidance. Tasks are scoped and broken down by a senior engineer or manager. |
| **Technical skills** | Proficient in primary language/framework. Can debug straightforward issues. Writes clean code that passes review. |
| **Code quality** | Follows existing patterns. Tests cover happy path. PRs need moderate review feedback. |
| **Communication** | Asks questions when stuck (within hours, not days). Updates team on progress daily. |
| **Impact** | Completes assigned tasks on time. Reduces the workload of senior engineers. |
| **Typical experience** | 0-2 years (but experience is not the criterion — skills are) |
| **Promotion criteria** | Consistently delivers tasks independently. Code quality improves over 6 months. Starts identifying issues before being told. |

### IC2 — Mid-Level Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Features or components within a project |
| **Autonomy** | Works independently on well-scoped features. Can break down a feature into tasks. |
| **Technical skills** | Deep in primary stack. Can pick up adjacent technologies. Understands system architecture well enough to make local decisions. |
| **Code quality** | Writes code that others can maintain. Tests cover edge cases. PRs need minimal review feedback. |
| **Communication** | Proactively communicates blockers, risks, and trade-offs. Provides constructive PR reviews. |
| **Impact** | Delivers complete features. Improves team processes or tools. Mentors IC1 informally. |
| **Typical experience** | 2-5 years |
| **Promotion criteria** | Owns a significant system or domain. Influences technical decisions beyond their immediate work. Other engineers seek their input. |

### IC3 — Senior Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Projects or systems that span multiple components |
| **Autonomy** | Given a problem, not a solution. Defines the approach, breaks it into milestones, and executes. |
| **Technical skills** | Expert in primary stack, competent in 2-3 adjacent areas. Can evaluate architectural trade-offs with long-term implications. |
| **Code quality** | Sets quality standards for others. Refactors systems proactively. PRs are models for the team. |
| **Communication** | Writes technical design documents. Explains complex concepts to non-technical stakeholders. Influences roadmap discussions. |
| **Impact** | Delivers projects that move business metrics. Raises the team's technical bar. Mentors IC1-IC2 intentionally. |
| **Typical experience** | 5-8 years |
| **Promotion criteria** | Leads multi-quarter projects. Shapes technical direction for their domain. Recognized as a go-to expert by the org. |

### IC4 — Staff Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Cross-team or cross-domain technical initiatives |
| **Autonomy** | Identifies the most important technical problems and proposes solutions without being asked. |
| **Technical skills** | Deep expertise in multiple domains. Can evaluate system-wide architectural decisions. Understands business context and translates it into technical strategy. |
| **Code quality** | Defines coding standards, review practices, and quality gates. May write less code but the code they write is foundational. |
| **Communication** | Writes RFCs that align multiple teams. Presents technical strategy to leadership. Translates business goals into engineering roadmaps. |
| **Impact** | Influences the trajectory of the engineering organization. Solves problems that nobody else can. Creates leverage — their work makes 5-10 other engineers more effective. |
| **Typical experience** | 8-12 years |
| **Promotion criteria** | Track record of org-wide technical impact. Other senior engineers look to them for direction. Could credibly be a CTO at a smaller company. |

### IC5 — Principal Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Company-wide or industry-level technical vision |
| **Autonomy** | Sets the technical agenda. Partners with C-level on long-term technology strategy. |
| **Technical skills** | Industry-recognized expertise. Understands multiple paradigms and can evaluate when to adopt new technologies. |
| **Code quality** | May not write production code regularly. When they do, it demonstrates new patterns the org should adopt. |
| **Communication** | External-facing (conferences, papers, open source). Internal authority on the hardest technical decisions. |
| **Impact** | Shapes the company's technical differentiation. Attracts talent through reputation. Decisions affect multi-year trajectory. |
| **Typical experience** | 12-20 years |
| **Promotion criteria** | Rare at most companies. Not a seniority milestone but a role for exceptional individual contributors. |

### IC6 — Distinguished Engineer / Fellow

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Industry-shaping contributions |
| **Autonomy** | Fully self-directed. Company creates the environment for them to work on what they believe is most impactful. |
| **Impact** | Creates technology, patterns, or systems that define the company's technical identity. Peer group is other distinguished engineers across the industry. |
| **Note** | Most companies under 1,000 engineers do not have this level. Including it here for completeness. |

---

## 3. Management Levels (M1-M3)

Management levels define scope of organizational impact, team size, and strategic responsibilities.

### M1 — Engineering Manager

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Single team (5-8 engineers) |
| **Primary responsibility** | Team health, individual growth, hiring, and delivery |
| **Technical involvement** | Reviews architecture decisions, does not write production code daily. Can debug critical issues. |
| **Hiring** | Owns the hiring funnel for their team. Conducts interviews, makes hire/no-hire decisions within approved headcount. |
| **People management** | Weekly 1:1s, career conversations, performance reviews, performance improvement plans when needed. |
| **Delivery** | Accountable for team's sprint commitments. Removes blockers, manages stakeholder expectations. |
| **Promotion criteria** | Team consistently delivers. Low attrition. Team members grow in level. Strong hiring track record. |

### M2 — Director of Engineering

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Multiple teams (2-4 EMs, 15-30 engineers) |
| **Primary responsibility** | Cross-team alignment, technical strategy, organizational design |
| **Technical involvement** | Sets technical direction at the org level. Reviews system-wide architecture decisions. |
| **Hiring** | Owns headcount planning and budget. Hires EMs. Approves senior IC hires. |
| **People management** | Manages EMs, not individual engineers. Coaches EMs on their management practice. |
| **Delivery** | Accountable for quarterly objectives across multiple teams. Manages cross-team dependencies. |
| **Promotion criteria** | Org-level impact on velocity, quality, and retention. Develops future directors from their EM pipeline. |

### M3 — VP of Engineering / CTO

| Dimension | Expectation |
|-----------|-------------|
| **Scope** | Entire engineering organization |
| **Primary responsibility** | Technology strategy, organizational health, executive alignment |
| **Technical involvement** | Makes build-vs-buy decisions, platform choices, and technical debt investment decisions. |
| **Hiring** | Owns engineering headcount plan and recruiter relationships. Final approval on all senior hires. |
| **People management** | Manages Directors. Sets culture, processes, and standards for the org. |
| **Delivery** | Accountable for engineering's contribution to company objectives. Partners with product and business leadership. |
| **Promotion criteria** | Engineering org is a competitive advantage. Attracts top talent. Ships reliably and adapts to changing priorities. |

---

## 4. Career Ladder Visualization

```
Individual Contributor Track          Management Track
═══════════════════════════          ════════════════

IC6 Distinguished Engineer ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                                                               │
IC5 Principal Engineer ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
                                                               │
IC4 Staff Engineer ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  M3 VP/CTO ← ─ ─ ─ ─ ┘
        ↑                                   ↑
IC3 Senior Engineer ← ─ ─ → ─ ─ →  M2 Director
        ↑                                   ↑
IC2 Mid-Level Engineer ─ ─ ─ → ─ ─  M1 Engineering Manager
        ↑
IC1 Junior Engineer
```

**Key principles:**
- IC and management tracks are parallel, not hierarchical. An IC4 Staff Engineer is peer-level with an M2 Director, not subordinate.
- Switching tracks is encouraged. An EM who wants to return to IC work should be able to do so without it being perceived as a demotion.
- The fork point is IC3 → M1. Senior Engineers who want to manage should try it through a tech lead rotation before committing.
- Compensation at equivalent levels should be comparable. An IC4 Staff Engineer should earn within 10% of an M2 Director.

---

## 5. Role Progression Criteria

Promotion is not a reward for time served — it is recognition that someone is already operating at the next level. Use this checklist to evaluate readiness.

### Promotion Readiness Checklist

| Criterion | IC1→IC2 | IC2→IC3 | IC3→IC4 | IC4→IC5 |
|-----------|---------|---------|---------|---------|
| **Scope expansion** | Owns features independently | Owns systems across components | Leads cross-team technical initiatives | Shapes company-wide technical direction |
| **Autonomy** | Works without task-level guidance | Defines approach for ambiguous problems | Identifies the problems worth solving | Sets the technical agenda |
| **Code quality** | Requires minimal review feedback | Sets quality examples for the team | Defines quality standards for the org | Creates foundational patterns |
| **Mentorship** | Helps onboarding peers | Actively mentors IC1-IC2 | Mentors senior engineers, develops tech leads | Develops staff engineers |
| **Communication** | Clear status updates | Writes design docs and trade-off analyses | Writes RFCs that align multiple teams | Represents engineering externally |
| **Impact evidence** | 3+ features shipped independently | 2+ systems designed and delivered | 1+ org-wide technical initiative completed | Sustained multi-year strategic impact |
| **Peer recognition** | Team trusts their code | Team seeks their technical input | Org recognizes them as a domain authority | Industry peers recognize their expertise |

### Anti-Patterns in Promotion Decisions

| Anti-Pattern | Why It Is Harmful | Better Approach |
|-------------|-------------------|-----------------|
| "They have been here 2 years, time for a promotion" | Tenure ≠ growth. Promotes stagnation. | Evaluate against level criteria, not calendar. |
| "They are our only __ expert" | Scarcity is not the same as impact. | Evaluate breadth of impact, not uniqueness of skill. |
| "They will leave if we do not promote them" | Retention-driven promotions lower the bar for everyone. | Have a compensation adjustment conversation instead. |
| "Everyone on the team is at the same level" | Forces artificial differentiation. | Levels reflect individual performance, not team quotas. |
| "They do great IC work, so they should manage" | Management requires different skills. | Offer a tech lead rotation to test management interest and aptitude. |

---

## 6. Cross-Functional Role Definitions

Not every role fits neatly into engineering or management. These cross-functional roles are common in growing startups and should be defined with equal rigor.

### Product Manager

| Dimension | Expectation |
|-----------|-------------|
| **Mission** | Maximize the value delivered to customers and the business through the product |
| **Key responsibilities** | Discovery research, roadmap prioritization, requirements definition, stakeholder alignment, launch coordination, metric tracking |
| **Success metrics** | Feature adoption rates, customer satisfaction scores, revenue impact of shipped features, roadmap predictability |
| **Reports to** | CPO, CEO, or VP Product |
| **Works with** | Engineering (daily), Design (daily), Sales (weekly), Customer Support (weekly), Marketing (bi-weekly) |

### Product Designer

| Dimension | Expectation |
|-----------|-------------|
| **Mission** | Create experiences that are useful, usable, and delightful — in that order |
| **Key responsibilities** | User research, wireframing, visual design, interaction design, prototyping, usability testing, design system maintenance |
| **Success metrics** | Task completion rates, usability test pass rates, design system adoption, time-to-design for new features |
| **Reports to** | Head of Design, CPO, or Engineering Manager |
| **Works with** | Product (daily), Engineering (daily), Customer Support (weekly for feedback), Marketing (for brand consistency) |

### Developer Experience Engineer

| Dimension | Expectation |
|-----------|-------------|
| **Mission** | Make every engineer on the team more productive by improving tools, processes, and infrastructure |
| **Key responsibilities** | CI/CD pipeline optimization, developer tooling, build system performance, testing infrastructure, documentation, onboarding automation |
| **Success metrics** | Build time, CI pipeline duration, time-to-first-commit for new hires, developer satisfaction survey scores |
| **Reports to** | Engineering Manager or CTO |
| **Works with** | All engineering teams (as an internal customer) |

### Technical Program Manager

| Dimension | Expectation |
|-----------|-------------|
| **Mission** | Ensure cross-team projects ship on time by managing dependencies, risks, and communication |
| **Key responsibilities** | Project planning, dependency tracking, risk identification, status reporting, stakeholder communication, retrospective facilitation |
| **Success metrics** | On-time delivery rate, cross-team blocker resolution time, stakeholder satisfaction |
| **Reports to** | VP Engineering, COO, or CTO |
| **Works with** | Engineering leads (daily), Product (weekly), Executives (bi-weekly) |

---

## Checklist

- [ ] Filled out the role definition template for the next role to be hired ({{FIRST_HIRE_ROLE}})
- [ ] Selected the appropriate number of engineering levels for current company size ({{ENGINEERING_LEVELS}} levels)
- [ ] Defined management levels if any management hires are planned
- [ ] Reviewed career ladder visualization with current team
- [ ] Established promotion criteria using the readiness checklist
- [ ] Identified and documented any cross-functional roles needed
- [ ] Verified role definitions align with compensation bands in compensation-framework.template.md
- [ ] Shared role definitions with existing team for feedback before posting externally
