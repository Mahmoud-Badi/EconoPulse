# Team Health Check

> A team that ships fast but burns out is not a high-performing team — it is a time bomb. The health check surfaces problems before they become resignations. Adapted from Spotify's Squad Health Check model for small development teams, this template provides a structured, repeatable way to measure how the team is actually doing — not just what they are shipping.

---

## Team Health Check -- {{QUARTER}} {{YEAR}}

**Project:** {{PROJECT_NAME}}
**Team:** {{TEAM_NAME}}
**Facilitator:** [rotate each quarter]
**Date completed:** {{DATE}}
**Previous check:** [date of last health check, or "First check"]

---

## How to Run the Health Check

### Preparation (5 min)
1. Schedule 45-60 minutes with the full team
2. Share this template in advance so people can think about their ratings
3. Prepare a private voting mechanism (anonymous form, folded paper, or digital poll)
4. Pull up the previous health check results for comparison

### Voting (10 min)
1. Read each dimension aloud, including the description
2. Each team member votes independently: Green / Yellow / Red
3. Votes are revealed simultaneously (not one at a time — prevents anchoring)
4. Record individual votes and determine consensus

### Discussion (30 min)
1. Start with the lowest-rated dimensions
2. For each Red or Yellow dimension: "What would it take to make this Green?"
3. Capture specific, actionable improvement ideas
4. Do NOT try to solve everything — focus on the 1-2 most impactful dimensions

### Commitment (10 min)
1. Select 1-2 improvement actions with owners and deadlines
2. Add actions to the next sprint as tasks
3. Set a date for the next health check

---

## Health Dimensions

Rate each dimension: **Green** (Good) / **Yellow** (Needs Attention) / **Red** (Action Required)

<!-- IF {{TEAM_SIZE}} == "2" -->
| Dimension | Description | {{MEMBER_1}} | {{MEMBER_2}} | Consensus | Trend |
|-----------|-------------|------------|------------|-----------|-------|
| **Speed** | We deliver at a sustainable pace — not too fast (burnout), not too slow (stagnation) | | | | ↑↓→ |
| **Quality** | We are proud of the code we ship. Technical debt is manageable. | | | | ↑↓→ |
| **Fun** | We enjoy working on this project. Work is engaging, not draining. | | | | ↑↓→ |
| **Learning** | We are growing our skills. We learn new things regularly. | | | | ↑↓→ |
| **Mission** | We understand the product vision and believe in what we are building. | | | | ↑↓→ |
| **Support** | We help each other when stuck. No one is left struggling alone. | | | | ↑↓→ |
| **Process** | Our ceremonies and workflows are effective, not wasteful. | | | | ↑↓→ |
| **Codebase** | The codebase is getting better over time, not worse. | | | | ↑↓→ |
| **Communication** | Information flows well. No surprises, no silos. | | | | ↑↓→ |
| **Work-Life Balance** | Work hours are sustainable. People have time for life outside work. | | | | ↑↓→ |
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "3-5" -->
| Dimension | Description | {{MEMBER_1}} | {{MEMBER_2}} | {{MEMBER_3}} | {{MEMBER_4}} | {{MEMBER_5}} | Consensus | Trend |
|-----------|-------------|------------|------------|------------|------------|------------|-----------|-------|
| **Speed** | We deliver at a sustainable pace — not too fast (burnout), not too slow (stagnation) | | | | | | | ↑↓→ |
| **Quality** | We are proud of the code we ship. Technical debt is manageable. | | | | | | | ↑↓→ |
| **Fun** | We enjoy working on this project. Work is engaging, not draining. | | | | | | | ↑↓→ |
| **Learning** | We are growing our skills. We learn new things regularly. | | | | | | | ↑↓→ |
| **Mission** | We understand the product vision and believe in what we are building. | | | | | | | ↑↓→ |
| **Support** | We help each other when stuck. No one is left struggling alone. | | | | | | | ↑↓→ |
| **Process** | Our ceremonies and workflows are effective, not wasteful. | | | | | | | ↑↓→ |
| **Codebase** | The codebase is getting better over time, not worse. | | | | | | | ↑↓→ |
| **Communication** | Information flows well. No surprises, no silos. | | | | | | | ↑↓→ |
| **Work-Life Balance** | Work hours are sustainable. People have time for life outside work. | | | | | | | ↑↓→ |
<!-- ENDIF -->

<!-- IF {{TEAM_SIZE}} == "6+" -->
| Dimension | Description | Team Average | Consensus | Trend |
|-----------|-------------|-------------|-----------|-------|
| **Speed** | We deliver at a sustainable pace — not too fast (burnout), not too slow (stagnation) | | | ↑↓→ |
| **Quality** | We are proud of the code we ship. Technical debt is manageable. | | | ↑↓→ |
| **Fun** | We enjoy working on this project. Work is engaging, not draining. | | | ↑↓→ |
| **Learning** | We are growing our skills. We learn new things regularly. | | | ↑↓→ |
| **Mission** | We understand the product vision and believe in what we are building. | | | ↑↓→ |
| **Support** | We help each other when stuck. No one is left struggling alone. | | | ↑↓→ |
| **Process** | Our ceremonies and workflows are effective, not wasteful. | | | ↑↓→ |
| **Codebase** | The codebase is getting better over time, not worse. | | | ↑↓→ |
| **Communication** | Information flows well. No surprises, no silos. | | | ↑↓→ |
| **Work-Life Balance** | Work hours are sustainable. People have time for life outside work. | | | ↑↓→ |

*For teams of 6+, use anonymous voting and report averages. Individual votes are not displayed to maintain psychological safety at scale.*
<!-- ENDIF -->

### Rating Guide

| Rating | Meaning | Indicator |
|--------|---------|-----------|
| **Green** | We are doing well here. No action needed. Protect it. | Consistent positive experience, no complaints, team mentions it as a strength |
| **Yellow** | Needs attention. Not broken, but trending in the wrong direction. | Occasional frustration, some team members are unhappy, minor issues accumulating |
| **Red** | Action required. This is actively hurting the team or the project. | Frequent complaints, people considering leaving, quality or velocity visibly degraded |

### Consensus Rules

- If all votes are the same color: that is the consensus.
- If votes are split: use the **most common** rating. If tied, use the **worse** rating (Yellow beats Green, Red beats Yellow). It is better to act on a concern than to ignore it.
- If one person votes Red and everyone else votes Green: discuss it. One Red vote is a signal — do not dismiss it as an outlier.

---

## Trend Tracking

Fill in results over time to see patterns.

| Dimension | Q1 | Q2 | Q3 | Q4 | 12-Month Trend |
|-----------|----|----|----|----|---------------|
| Speed | | | | | |
| Quality | | | | | |
| Fun | | | | | |
| Learning | | | | | |
| Mission | | | | | |
| Support | | | | | |
| Process | | | | | |
| Codebase | | | | | |
| Communication | | | | | |
| Work-Life Balance | | | | | |

### Trend Analysis

After 2+ health checks, look for patterns:

- **Improving dimension (Green for 2+ quarters):** Celebrate it. Ask what is working and reinforce it.
- **Stable Yellow:** The improvement actions are not working. Try a different approach.
- **Declining dimension (was Green, now Yellow or Red):** Urgent. Something changed. Investigate.
- **Persistent Red (2+ quarters):** Escalate to leadership. The team cannot fix this alone — it likely requires organizational change, staffing, or strategic decisions.

---

## Action Protocol

### Immediate Actions

| Condition | Action |
|-----------|--------|
| Any dimension with 2+ Red ratings | Create an improvement plan within 1 week |
| Any dimension declining for 2+ quarters | Escalate to project lead or engineering manager |
| All dimensions Green | Celebrate. Run a brief retro on what is working. |
| More than 3 dimensions Yellow/Red | Consider a dedicated process improvement sprint |

### Improvement Plan Template

```markdown
**Dimension:** [e.g., Quality]
**Current Rating:** Red
**Target Rating:** Yellow (next quarter), Green (2 quarters)

**Root Cause Analysis:**
- [Why is this dimension struggling?]
- [Contributing factors]

**Improvement Actions:**
1. [Specific action] — Owner: [name] — Due: [date]
2. [Specific action] — Owner: [name] — Due: [date]
3. [Specific action] — Owner: [name] — Due: [date]

**Success Metrics:**
- [How will we know this improved?]
- [Measurable indicator]

**Check-in:** [When to review progress — midway between health checks]
```

---

## Solo Developer Version

If you are a solo developer, the health check becomes a quarterly self-assessment. It serves as a burnout prevention tool and a growth tracker.

### Solo Health Check -- {{QUARTER}} {{YEAR}}

Answer each question honestly. Score 1-5 (1 = strongly disagree, 5 = strongly agree).

| Dimension | Question | Score (1-5) | Notes |
|-----------|----------|------------|-------|
| **Speed** | I am delivering at a pace I can sustain for 6+ months | | |
| **Quality** | I am proud of the code I wrote this quarter | | |
| **Fun** | I enjoyed working on this project most days | | |
| **Learning** | I learned at least one significant new skill or concept | | |
| **Mission** | I believe this project is worth building | | |
| **Focus** | I spent most of my time on high-impact work, not busywork | | |
| **Process** | My workflows and tools are helping, not hindering | | |
| **Codebase** | The codebase is in better shape than last quarter | | |
| **Energy** | I end most workdays with energy left for life outside work | | |
| **Progress** | Looking back, I can see clear progress toward my goals | | |

**Total Score:** [sum] / 50

### Solo Score Interpretation

| Score Range | Meaning | Action |
|-------------|---------|--------|
| 40-50 | Thriving | Keep doing what you are doing. Document what is working. |
| 30-39 | Steady | Identify the 1-2 lowest dimensions and make a small change. |
| 20-29 | Struggling | Something needs to change. Consider: scope, pace, tools, or project direction. |
| Below 20 | Burnout risk | Stop and reassess. Take time off if possible. Talk to someone. |

### Solo Journaling Prompts

After scoring, spend 15 minutes writing about:

1. **What drained me most this quarter?** — Identify the biggest energy sink. Can you eliminate, delegate, or automate it?
2. **What energized me most this quarter?** — Do more of this. Structure your weeks around it.
3. **What would I change if I could only change one thing?** — Make that change this quarter.
4. **Am I building the right thing?** — Honest answer. If no, what would you build instead?
5. **What does "good enough" look like for next quarter?** — Not perfection. Realistic, sustainable progress.

---

## Health Check Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **Social desirability bias** | Everyone votes Green because they do not want to be negative | Use anonymous voting. Normalize Yellow and Red as healthy signals. |
| **Recency bias** | Ratings reflect only the last week, not the full quarter | Ask the team to consider the full quarter before voting. Reference specific events. |
| **No follow-through** | Health check happens, action items are created, nothing changes | Make improvement actions sprint tasks. Review at next health check. |
| **Manager uses it as performance tool** | "Why did you vote Red on Speed? Are you not working hard enough?" | Health check data is team-level, not individual performance data. Never tie it to reviews. |
| **Only done when things are bad** | Skip health check when things are going well | Consistent cadence. Good quarters are worth documenting too — they show what works. |
| **Death by dimensions** | Adding 20+ dimensions makes the check exhausting | Stick to 8-10 dimensions. Add custom dimensions only if they address a specific, known concern. |

---

## Custom Dimensions

If the default dimensions do not cover your team's specific concerns, add custom ones. Keep the total under 12.

Suggested custom dimensions:

| Dimension | Description | When to Add |
|-----------|-------------|-------------|
| **Autonomy** | We have the freedom to make decisions about how we work | When micromanagement is a concern |
| **Tooling** | Our development tools and environment help us be productive | After a tooling migration or when tool complaints increase |
| **Documentation** | We can find the information we need when we need it | When onboarding new members or after knowledge loss |
| **Stakeholder Alignment** | Stakeholders and the team agree on priorities and direction | When scope changes are frequent or priorities feel unclear |
| **Diversity of Work** | We work on a healthy mix of tasks (not just bugs, not just features) | When the team feels stuck in a rut |
| **Recognition** | Our work is noticed and appreciated | When morale is low despite good output |
