# Culture Documentation

> Culture is what happens when nobody is watching. It is revealed by who gets promoted, what behavior gets tolerated, and how the team responds under pressure. This template forces you to define your culture explicitly — values with behavioral examples, operating principles, rituals, decision-making norms, and conflict resolution — so that your culture is teachable, measurable, and defensible rather than an invisible force that drifts without your knowledge.

---

## 1. Mission Statement

### Mission

{{PROJECT_NAME}} exists to: ____

**Writing guidelines:**
- One sentence. Two at most.
- Describes what you do and for whom, not how you do it.
- Specific enough that it could not describe any random company.
- Does not include jargon, buzzwords, or aspirational nonsense.

**Examples (good):**
- "Make financial infrastructure accessible to every internet business" (Stripe)
- "Give everyone the power to create and share ideas instantly" (Figma)
- "Help developers ship faster with zero-config deployments" (Vercel)

**Examples (bad):**
- "Leverage synergistic solutions to empower stakeholders" (says nothing)
- "Change the world through innovation" (could be any company)
- "Be the best at what we do" (empty tautology)

---

## 2. Core Values

Define {{CULTURE_VALUES_COUNT}} core values. Each value must have behavioral examples (what it looks like in practice) and anti-patterns (what violating this value looks like). Values without behavioral specifics are posters, not culture.

### Value 1: ____

**What it means:** ____

**Behavioral examples (what this looks like):**
- ____
- ____
- ____

**Anti-patterns (what violating this looks like):**
- ____
- ____
- ____

**Interview signal:** How do you evaluate this in candidates?
- ____

---

### Value 2: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---

### Value 3: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---

### Value 4: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---

### Value 5: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---

<!-- IF {{CULTURE_VALUES_COUNT}} >= "6" -->
### Value 6: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---
<!-- ENDIF -->

<!-- IF {{CULTURE_VALUES_COUNT}} == "7" -->
### Value 7: ____

**What it means:** ____

**Behavioral examples:**
- ____
- ____
- ____

**Anti-patterns:**
- ____
- ____
- ____

**Interview signal:**
- ____

---
<!-- ENDIF -->

### Values Prioritization

Values conflict. "Move fast" conflicts with "be thorough." "Be transparent" conflicts with "protect privacy." When two values collide, which wins?

| Scenario | Conflicting Values | Resolution |
|----------|-------------------|-----------|
| A feature is 90% ready but has a known edge case bug. Ship or fix? | Speed vs Quality | ____ |
| A team member's personal situation is affecting their work. Share with the team? | Transparency vs Privacy | ____ |
| A customer requests a feature that helps them but hurts the product for everyone else. | Customer focus vs Product vision | ____ |
| An engineer disagrees with a technical decision but the team has committed. | Individual judgment vs Team alignment | ____ |
| A deadline is tight and corners could be cut on testing. | Delivery vs Reliability | ____ |

Document these trade-offs now. In the moment, under pressure, you will not have time to deliberate.

---

## 3. Operating Principles

Operating principles are more specific than values. They are the "how we work" guidelines that govern day-to-day behavior.

### Principle 1: Write It Down

**What it means:** If a decision was made verbally and not documented, it was not made. All significant decisions, architectural choices, and process changes must be written down with rationale.

**Why:** Written documentation is searchable, permanent, and accessible to people who were not in the room. Verbal culture works for 3 people. It collapses at 10.

**In practice:**
- Meeting outcomes are posted in Slack within 1 hour
- Architecture decisions are recorded as ADRs (Section 03)
- Process changes are documented in the team handbook before they are announced
- "As we discussed" is never sufficient — link to the written record

### Principle 2: Disagree and Commit

**What it means:** Debate is encouraged before a decision. After a decision is made, everyone commits fully — even those who disagreed. Passive resistance and "I told you so" undermine the team.

**How to disagree:**
- Present your case with evidence, not just opinion
- Listen to the counter-argument genuinely
- Escalate to the decision-maker if consensus cannot be reached
- Once the decision is made, support it as if it were your idea

**When to revisit:**
- New evidence emerges that fundamentally changes the calculus
- The decision has been in effect for a reasonable trial period and results are measurably poor
- Never revisit based on "I still feel like it was wrong" without new data

### Principle 3: Default to Open

**What it means:** Information is shared by default, restricted by exception. Calendars are visible. Documents are accessible. Salary bands are published. The burden of proof is on restricting information, not on sharing it.

**Exceptions (things that remain confidential):**
- Individual compensation details (bands are public, individual positions are private)
- Personnel issues (performance problems, PIPs, investigations)
- Unannounced fundraising or M&A discussions
- Customer data and PII

### Principle 4: Seek to Understand Before Being Understood

**What it means:** When you encounter a decision, process, or codebase that confuses you, ask why it exists before proposing to change it. Most things that look wrong have a reason — it may be a bad reason, but understanding it prevents you from repeating the mistake.

**In practice:**
- Before refactoring: "Why was it built this way?" (not "This is terrible, let me rewrite it")
- Before proposing a new process: "What problem does the current process solve?" (not "Let's do it my way")
- Before criticizing a decision: "What was the context when this was decided?" (not "This makes no sense")

### Principle 5: Optimize for the Team, Not the Individual

**What it means:** Individual heroics are less valuable than team effectiveness. Code that only one person can understand is not clever — it is a liability. A feature shipped by one person in 2 weeks is worse than the same feature shipped by the team in 3 weeks if the team version is maintainable and the team learned from the process.

---

## 4. Culture Rituals

Rituals are the recurring events that reinforce culture. Without them, values remain abstract.

### All-Hands Meeting

| Parameter | Details |
|-----------|---------|
| **Frequency** | Monthly |
| **Duration** | 45 minutes |
| **Format** | Video call (recorded for absent team members) |
| **Agenda** | Company updates (15 min) → Team wins (10 min) → Customer stories (5 min) → Q&A (15 min) |
| **Owner** | CEO / Founder |
| **Cultural purpose** | Transparency, alignment, celebration |

### Demo Day

| Parameter | Details |
|-----------|---------|
| **Frequency** | Bi-weekly or monthly |
| **Duration** | 30-45 minutes |
| **Format** | Live demos of shipped work. Each demo is 5-7 minutes. |
| **Who presents** | Anyone who shipped something — engineers, designers, support, ops |
| **Cultural purpose** | Visibility, recognition, cross-team awareness |
| **Rule** | No slides. Show the working product. |

### Team Retrospective

| Parameter | Details |
|-----------|---------|
| **Frequency** | Bi-weekly (aligned with sprint cadence) |
| **Duration** | 45 minutes |
| **Format** | What went well? What did not? What will we change? |
| **Owner** | Rotating facilitator (not always the manager) |
| **Cultural purpose** | Continuous improvement, psychological safety, accountability |
| **Rule** | Action items from retros must be tracked and reviewed at the next retro |

### Social Events

| Event | Frequency | Format | Cultural Purpose |
|-------|-----------|--------|-----------------|
| Virtual coffee roulette | Weekly | Random 1:1 pairings, 15 min | Cross-team relationships |
| Game session | Monthly | Online games, trivia, etc. | Fun, informal bonding |
| Book / article club | Monthly | Shared reading + discussion | Intellectual growth, shared learning |
| Birthday / milestone celebration | As needed | Slack shoutout + small gift | Recognition, belonging |
| Volunteer day | Quarterly | Team volunteer activity (virtual or in-person) | Shared purpose beyond work |

---

## 5. Decision-Making Framework

### RAPID Decision Model

| Role | Responsibility | Who |
|------|---------------|-----|
| **R**ecommend | Proposes the decision with data and analysis | IC or team lead closest to the problem |
| **A**gree | Must agree before the decision is made (has veto) | Stakeholders with hard constraints (legal, security, financial) |
| **P**erform | Executes the decision once made | Team or individual assigned |
| **I**nput | Provides perspective and information | Subject matter experts, affected parties |
| **D**ecide | Makes the final call | Designated decision-maker (varies by scope) |

### Decision Scope by Level

| Decision Type | Who Decides | Who is Consulted | Examples |
|--------------|------------|-----------------|---------|
| **Individual** | The person doing the work | Peers (optional) | Implementation approach, code structure, variable naming |
| **Team** | Tech lead or EM | Team members | Sprint priorities, code review norms, testing approach |
| **Cross-team** | Director or VP | Affected team leads | Architecture changes, shared service design, tooling migration |
| **Company** | CEO / Leadership team | All affected parties | Product direction, pricing, hiring plan, fundraising |

### Decision Documentation

Every decision above "Individual" scope should be documented:

```
DECISION RECORD
===============
Date: ____
Decision: ____
Decider: ____
Context: Why was this decision needed?
Options considered:
  1. ____ (pros: ____, cons: ____)
  2. ____ (pros: ____, cons: ____)
  3. ____ (pros: ____, cons: ____)
Chosen option: ____
Rationale: ____
Reversibility: [easily reversible / costly to reverse / irreversible]
Review date: ____ (when will we evaluate if this was the right call?)
```

---

## 6. Conflict Resolution Process

### Escalation Ladder

| Level | Situation | Action | Timeline |
|-------|-----------|--------|----------|
| **Level 1: Direct** | Disagreement between two people | Have a direct conversation. Assume good intent. Focus on the issue, not the person. | Within 24 hours |
| **Level 2: Facilitated** | Direct conversation did not resolve it | Bring in a neutral third party (peer, another lead) to facilitate | Within 48 hours |
| **Level 3: Manager** | Facilitated conversation did not resolve it | Escalate to shared manager. Manager makes the call. | Within 1 week |
| **Level 4: Leadership** | Manager-level disagreement or cross-team conflict | Escalate to VP or CEO for final decision | Within 2 weeks |

### Conflict Resolution Guidelines

**Do:**
- Address conflicts early — they do not get better with time
- Focus on behavior and impact, not intent or character
- Use "I" statements ("I felt excluded when...") not "You" statements ("You always exclude me...")
- Seek to understand the other person's perspective before advocating your own
- Accept that you might be wrong
- Document the resolution and agreed-upon changes

**Don't:**
- Ignore conflicts hoping they will resolve themselves
- Gossip about the conflict with uninvolved parties
- Bring up past conflicts that were already resolved
- Make it personal — attack the idea, not the person
- Refuse to commit after a decision is made (see "Disagree and Commit")
- Use power dynamics to win (manager pulling rank in a technical discussion)

---

## 7. Culture Metrics & Measurement

### Quarterly Culture Survey (Anonymous)

| Question | Scale | What It Measures |
|----------|-------|-----------------|
| I feel safe sharing my opinions at work, even if they are unpopular | 1-5 | Psychological safety |
| I understand our company's values and can give examples of how they show up in daily work | 1-5 | Values clarity |
| I feel recognized for my contributions | 1-5 | Recognition |
| I trust my manager to act in my best interest | 1-5 | Manager trust |
| I would recommend this company to a friend looking for a job | 1-5 | eNPS proxy |
| I see opportunities for growth and advancement here | 1-5 | Career development |
| Conflicts on my team are resolved fairly and promptly | 1-5 | Conflict resolution |
| I feel included and valued regardless of my background | 1-5 | Inclusion |
| I believe the company's leadership is transparent with information | 1-5 | Transparency |
| I feel energized by my work more days than I feel drained | 1-5 | Engagement / burnout |

### Behavioral Metrics

| Metric | How to Measure | Target | Warning Threshold |
|--------|---------------|--------|-------------------|
| **Voluntary attrition rate** | Departures / headcount (annualized) | < 10% | > 15% |
| **eNPS** | "Would you recommend working here?" (0-10 scale) | +30 or higher | Below +10 |
| **Offer acceptance rate** | Offers accepted / offers extended | > 80% | < 60% |
| **Regretted departures** | High performers who leave / total departures | < 25% | > 50% |
| **Internal mobility** | Lateral moves and promotions / headcount | > 10% annually | < 5% |
| **Time to fill** | Days from role opening to offer acceptance | < 45 days | > 75 days |
| **Referral rate** | Referral hires / total hires | > 30% | < 15% |

### Action on Metrics

| Metric Trend | Action |
|-------------|--------|
| eNPS declining for 2+ quarters | Leadership investigation: what changed? Anonymous focus groups. |
| Attrition spike in one team | Manager effectiveness review. Skip-level 1:1s with departing team members. |
| Low psychological safety scores | Manager training on creating safe environments. Retro format review. |
| Low recognition scores | Implement or improve recognition rituals (demo day, shoutouts, bonuses). |
| Offer acceptance rate declining | Compensation benchmarking. Candidate experience audit. Interview feedback review. |

---

## Checklist

- [ ] Written mission statement (1-2 sentences, specific to {{PROJECT_NAME}})
- [ ] Defined {{CULTURE_VALUES_COUNT}} core values with behavioral examples and anti-patterns
- [ ] Documented values prioritization for common conflict scenarios
- [ ] Established 5+ operating principles with practical guidance
- [ ] Scheduled recurring culture rituals (all-hands, demo day, retros, social events)
- [ ] Documented decision-making framework with RAPID roles and scope by level
- [ ] Defined conflict resolution escalation ladder
- [ ] Created quarterly culture survey and behavioral metrics dashboard
- [ ] Shared culture documentation with all current employees
- [ ] Integrated culture evaluation into the interview process (see interview-process.template.md)
- [ ] Scheduled quarterly review of culture metrics with leadership team
