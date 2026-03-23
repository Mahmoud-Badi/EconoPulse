# Product Roadmap

> **A living strategy document for {{PROJECT_NAME}} that communicates what you are building, why, and roughly when — without making promises you cannot keep.** A roadmap is not a feature list with dates. It is a communication tool that aligns teams around outcomes.

---

## Roadmap Philosophy

A roadmap answers three questions:

1. **What are we optimizing for?** (Strategic themes)
2. **What are we building to get there?** (Initiatives grouped by theme)
3. **In what order?** (Now / Next / Later)

A roadmap does NOT answer:

- "When exactly will feature X ship?" (That is a project plan, not a roadmap.)
- "What are all the tasks needed to build this?" (That is a backlog.)
- "What did we ship last quarter?" (That is a changelog.)

---

## Now / Next / Later Roadmap Format

This is the recommended format for {{PROJECT_NAME}}. It communicates priority and sequence without committing to specific dates (which you will miss, eroding trust).

### How It Works

| Column | Time Horizon | Certainty | Detail Level |
|--------|-------------|-----------|-------------|
| **Now** | Current quarter (in progress or starting this quarter) | High (80%+ confidence) | Detailed: specific features, user stories, success metrics |
| **Next** | Next quarter (planned, not started) | Medium (50-80% confidence) | Moderate: initiative-level descriptions, target outcomes |
| **Later** | 2+ quarters out (aspirational) | Low (< 50% confidence) | Light: themes and directional goals only |

### Template

```markdown
# {{PROJECT_NAME}} Roadmap
Last updated: [DATE]

## Strategic Themes This Year
1. [Theme 1: e.g., "Reduce time-to-value for new users"]
2. [Theme 2: e.g., "Enable team collaboration"]
3. [Theme 3: e.g., "Expand integration ecosystem"]

---

## NOW (Q[X] [YEAR]) — In Progress

### Theme: [Theme 1 Name]
| Initiative | Description | Success Metric | Status |
|-----------|-------------|---------------|--------|
| [Initiative A] | [What and why, 1-2 sentences] | [Measurable outcome] | In Progress |
| [Initiative B] | [What and why, 1-2 sentences] | [Measurable outcome] | Starting Soon |

### Theme: [Theme 2 Name]
| Initiative | Description | Success Metric | Status |
|-----------|-------------|---------------|--------|
| [Initiative C] | [What and why, 1-2 sentences] | [Measurable outcome] | In Progress |

---

## NEXT (Q[X+1] [YEAR]) — Planned

### Theme: [Theme 1 Name]
- **[Initiative D]** — [One-paragraph description of the initiative and why it matters]
- **[Initiative E]** — [One-paragraph description]

### Theme: [Theme 3 Name]
- **[Initiative F]** — [One-paragraph description]

---

## LATER ([YEAR] H2+) — Exploring

- **[Direction 1]** — [One sentence describing the aspiration]
- **[Direction 2]** — [One sentence]
- **[Direction 3]** — [One sentence]

---

## Recently Completed
| Initiative | Shipped | Outcome |
|-----------|---------|---------|
| [Initiative Z] | Q[X-1] [YEAR] | [What happened — metric result] |
```

### Example: Now / Next / Later

```markdown
## NOW (Q1 2026)

### Theme: Reduce Time-to-Value for New Users
| Initiative | Description | Success Metric | Status |
|-----------|-------------|---------------|--------|
| Guided onboarding wizard | Step-by-step setup flow replacing the current blank-slate experience | Onboarding completion rate from 34% → 60% | In Progress |
| Template library | Pre-built templates so users see value before creating from scratch | 50% of new users use a template in first session | Starting Soon |

### Theme: Enable Team Collaboration
| Initiative | Description | Success Metric | Status |
|-----------|-------------|---------------|--------|
| Real-time presence | See who is viewing/editing the same document | Reduce duplicate work reports by 40% | In Progress |

---

## NEXT (Q2 2026)

### Theme: Reduce Time-to-Value
- **Interactive tutorials** — In-app tutorials that walk users through advanced features using their own data, triggered after completing onboarding

### Theme: Expand Integration Ecosystem
- **Zapier integration** — Connect to 5,000+ apps via Zapier. Priority triggers: new item created, status changed. Priority actions: create item, update field
- **Slack notifications** — Real-time notifications in Slack channels for team activity, due dates, and mentions

---

## LATER (2026 H2+)

- **Mobile app** — Native iOS and Android apps for on-the-go access
- **API v2** — GraphQL API for advanced integrations
- **AI-assisted workflows** — Automated suggestions based on usage patterns
```

---

## Quarterly Planning Template

Use this template at the start of each quarter to set the roadmap for the next 90 days.

### Pre-Planning Inputs (Gather Before the Meeting)

| Input | Source | Owner |
|-------|--------|-------|
| User feedback themes (top 10) | `user-feedback-loops.template.md` | Product |
| Feature request RICE scores (top 20) | `feature-request-triage.md` | Product |
| Technical debt priorities | Engineering team | Engineering |
| Business goals for the quarter | Leadership / Founder | Business |
| Support ticket trends | {{SUPPORT_PLATFORM}} | Support |
| Competitor movements | Market research | Product |
| Capacity (available person-weeks) | Engineering team | Engineering |

### Planning Meeting Agenda (Half Day)

```
1. Review last quarter's outcomes (45 min)
   - What shipped vs. what was planned?
   - What were the actual metrics vs. targets?
   - What did we learn?

2. Strategic context update (30 min)
   - Business health (revenue, churn, growth)
   - Competitive landscape changes
   - User feedback themes

3. Theme selection (45 min)
   - Propose 2-4 themes for the quarter
   - Each theme must have a measurable outcome
   - Vote and select final themes

4. Initiative brainstorming (60 min)
   - For each theme, brainstorm possible initiatives
   - Rough-size each initiative (S/M/L/XL)
   - Map to capacity

5. Prioritization and sequencing (45 min)
   - Apply MoSCoW to initiatives
   - Sequence Must Haves and Should Haves
   - Identify dependencies

6. Roadmap draft and commitment (30 min)
   - Fill in Now / Next / Later
   - Agree on success metrics
   - Assign initiative owners
```

### Post-Planning Outputs

- [ ] Updated Now / Next / Later roadmap
- [ ] Quarter OKRs (Objectives and Key Results) aligned with themes
- [ ] Initiative briefs for each "Now" item
- [ ] Capacity allocation by theme
- [ ] Communication to stakeholders (see below)

---

## Theme-Based Roadmap Strategy

### Why Themes, Not Features

Features tell users WHAT you are building. Themes tell users WHY. Themes communicate intent and allow flexibility in implementation.

**Bad roadmap item:** "Add CSV export"
**Good roadmap item (theme):** "Make your data portable" (which may include CSV export, API access, and Zapier integration)

### How to Define Good Themes

A strong theme:

1. **Is user-outcome oriented** — "Faster collaboration" not "Real-time features"
2. **Is measurable** — "Reduce setup time by 50%" not "Improve onboarding"
3. **Is broad enough to contain multiple initiatives** — But not so broad it means nothing
4. **Resonates with users** — They should nod and say "yes, I want that"
5. **Has a clear end state** — You know when the theme is "done enough"

### Theme Examples

| Weak Theme | Strong Theme | Why It Is Better |
|-----------|-------------|-----------------|
| "Performance improvements" | "Sub-second response times everywhere" | Specific, measurable, user-facing |
| "Admin features" | "Give admins complete control" | Outcome-oriented, user-facing |
| "Bug fixes" | "Rock-solid reliability" | Aspirational, communicates value |
| "Mobile" | "Work from anywhere" | Outcome-oriented, platform-agnostic |
| "AI features" | "Less manual work, more insights" | User benefit, not technology label |

---

## Public vs Internal Roadmap Strategy

<!-- IF {{PUBLIC_ROADMAP}} == "yes" -->

### Public Roadmap (Enabled for {{PROJECT_NAME}})

Your public roadmap is a marketing and trust-building tool. It shows users that the product is actively developed and their feedback matters.

**What to include on the public roadmap:**

- Theme names and descriptions
- High-level initiative names (not implementation details)
- General timeframes (Now / Next / Later, NOT specific dates)
- "Recently completed" section (builds confidence)
- Voting or upvoting mechanism for user input

**What to exclude from the public roadmap:**

- Specific ship dates (you will miss them publicly)
- Internal technical initiatives (users do not care about your database migration)
- Pricing or business model changes (announce these separately)
- Features you are less than 50% confident about
- Competitive responses (do not telegraph your strategy to competitors)

**Tools:** Canny, ProductBoard, Linear public roadmap, GitHub Projects (public repo), Notion (published page)

**Update cadence:** Monthly. Stale public roadmaps are worse than no public roadmap.

<!-- ENDIF -->

<!-- IF {{PUBLIC_ROADMAP}} == "no" -->

### Internal-Only Roadmap ({{PROJECT_NAME}} Configuration)

Your roadmap is internal. This gives you more flexibility to change direction without public accountability, but you lose the trust-building benefits.

**Consider going public when:**

- You have a consistent release cadence (monthly+)
- Your roadmap is stable enough that items do not churn week-to-week
- You want to use the roadmap as a marketing differentiator
- Users are asking "what is coming next?" frequently

**Internal roadmap distribution:**

- Share with: All team members, key stakeholders, advisors
- Format: Notion page, Linear project view, or shared Google Doc
- Access: Link-based, not public
- Update cadence: Biweekly (more frequent than public because you can)

<!-- ENDIF -->

---

## Roadmap Communication Template

### For Stakeholders (Quarterly Update)

```markdown
# {{PROJECT_NAME}} Roadmap Update — Q[X] [YEAR]

## Last Quarter Results
- [Theme 1]: [Result vs. target. What shipped, what the metrics showed.]
- [Theme 2]: [Result vs. target.]
- Key learning: [One insight that changes our approach going forward]

## This Quarter Focus
We are focusing on [N] themes this quarter:

### Theme 1: [Name]
**Why:** [1-2 sentences on why this matters now]
**What:** [Key initiatives, high level]
**Success metric:** [How we will know it worked]

### Theme 2: [Name]
**Why / What / Success metric** [Same format]

## What We Are NOT Doing This Quarter
- [Item 1 and why it was deprioritized]
- [Item 2 and why]

## Key Risks
- [Risk 1]: [Mitigation plan]
- [Risk 2]: [Mitigation plan]

## Questions?
[Office hours / Slack channel / email for roadmap questions]
```

---

## Roadmap Review Cadence

| Activity | Frequency | Participants | Purpose |
|----------|-----------|-------------|---------|
| Roadmap status check | Weekly | Product owner + Eng lead | Are "Now" items on track? Any blockers? |
| Roadmap adjustment | Monthly | Product team | Should anything move between Now/Next/Later? |
| Full roadmap planning | Quarterly | All stakeholders | Set themes and initiatives for the next quarter |
| Annual strategy review | Yearly | Leadership | Set yearly themes and direction |

---

## What NOT to Put on a Roadmap

| Do Not Include | Why | Where It Belongs Instead |
|---------------|-----|------------------------|
| Bug fixes | Bugs are not features. They are defects. Users expect them to be fixed regardless of roadmap. | Bug tracker |
| Specific ship dates | You will miss them. Then you lose trust. | Internal project plans |
| Technical debt repayment | Users do not care about your database migration. Frame it as the user benefit it enables. | Engineering backlog (or reframe as user-facing theme) |
| "Research" or "Explore" items | Roadmaps communicate intent to build, not intent to think about building. | Internal exploration backlog |
| One-off customer requests | Unless it benefits >5% of users, it is not roadmap-worthy. | Feature request tracker |
| Competitor reactions | "Build X because Competitor Y did" is not a strategy. | Competitive analysis docs |
| Everything | A roadmap with 50 items is not a roadmap. It is a wish list. Target 3-5 themes, 8-15 initiatives. | Prioritize harder |

---

## Roadmap Health Checks

Ask these questions monthly:

1. **Can a new team member read the roadmap and understand our priorities in 5 minutes?** If not, simplify.
2. **Does every "Now" item have an owner?** Unowned items do not ship.
3. **Have any "Now" items been "Now" for more than one quarter?** If yes, they are either too big (break them down) or not actually a priority (move to Next/Later).
4. **Is the "Later" column growing faster than items leave it?** If yes, you are adding ideas without making decisions. Prune aggressively.
5. **Do the themes still reflect what users need?** Re-validate against recent feedback data monthly.
6. **Are you saying "no" enough?** If everything is on the roadmap, nothing is prioritized.
