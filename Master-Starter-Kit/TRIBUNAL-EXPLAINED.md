# The Tribunal — Explained Simply

> The Tribunal is the kit's most powerful feature. Here's what it does and why it matters.

---

## The Simple Version

Imagine you're about to spend 3 months building an app. Before writing a single line of code, you hire 5 consultants:

1. **A user researcher** who interviews your target audience
2. **A competitor analyst** who studies every rival product
3. **A UX designer** who knows what great apps look like
4. **A backend engineer** who knows what's technically feasible
5. **A product manager** who forces everyone to prioritize

You put them in a room and say: **"Argue about what this product should be. Come back with one answer."**

That's the Tribunal. Except the "consultants" are AI personas, the "room" is a structured 4-round debate, and the "answer" is a prioritized feature list that becomes your building blueprint.

---

## Why Does This Exist?

Most projects fail for one of three reasons:

| Failure Mode | What Happens | How the Tribunal Prevents It |
|-------------|-------------|------------------------------|
| **Building the wrong features** | You guess what users want, build it, nobody uses it | Personas vote on features — if nobody votes for it, don't build it |
| **Ignoring competitors** | You build something that already exists (but worse) | Competitor analysis finds what's already out there and what's missing |
| **Underestimating complexity** | "This will take 2 days" → takes 3 weeks | Technical feasibility assessment catches hidden complexity before you commit |

**The Tribunal costs ~2-4 hours. A wrong architectural decision costs 2-4 weeks.** The math is simple.

---

## How It Works (6 Steps + 4 Rounds)

```
PRE-WORK                    DEBATE                         OUTCOME
(preparation)               (the argument)                 (the answer)

┌─────────────┐    ┌──────────────────────────┐    ┌──────────────┐
│ 1. Pre-Work  │    │ Round 1: User Needs       │    │              │
│ 2. Personas  │───▶│ Round 2: Tech Feasibility │───▶│   VERDICT    │
│ 3. Research  │    │ Round 3: Design Direction  │    │  (your plan) │
│ 4. Deep Dives│    │ Round 4: Final Priorities  │    │              │
│ 5. UX Audit  │    └──────────────────────────┘    └──────────────┘
│ 6. Feasibility│
└─────────────┘
```

### Preparation Steps

**Step 1: Pre-Work (30-60 min)**
Claude reads your project brief and extracts:
- Your domain (what industry/problem space)
- Your users (who will use this)
- Your feature ideas (what it should do)
- Your constraints (budget, timeline, team size)

**Step 2: Create Personas (15-30 min each)**
Claude creates realistic user personas — not generic "User A" types, but specific people:
- "Sarah, fleet dispatcher at a 12-van company, uses Excel spreadsheets and hates them"
- "Mike, solo driver who needs directions and proof-of-delivery on his phone"

Each persona gets exactly **10 votes** to spend on features. This forces prioritization — you can't vote for everything.

**Step 3: Research Competitors (20-40 min each)**
Claude analyzes your competitors' websites, pricing pages, feature lists, and reviews. Produces a comparison matrix showing what each competitor does well and where the gaps are.

**Step 4: Feature Deep Dives (20-30 min each)**
Features get grouped into clusters (e.g., "Scheduling," "Billing," "Notifications"). Claude researches how market leaders implement each cluster.

**Step 5: UX Research (30-60 min)**
Claude studies the best-designed products in your space and documents patterns worth following.

**Step 6: Technical Feasibility (30-45 min)**
Separate "expert agents" assess each major feature for backend complexity, frontend effort, and mobile challenges.

### The 4 Debate Rounds

**Round 1: "What Do Users Actually Need?" (45-60 min)**
Every persona presents their case. Votes are tallied. Features that get 3+ persona votes are strong candidates. Features with 0 votes get deferred. Conflicts are identified (e.g., "admins want detailed reports, drivers want simplicity").

**Round 2: "What's Actually Buildable?" (30-45 min)**
Technical experts review the top features. Each gets an effort estimate (Small/Medium/Large/XL). Hidden complexity is flagged. Features that are too expensive for the timeline get deferred.

**Round 3: "What Should It Look Like?" (30-45 min)**
Design direction is proposed based on UX research. Anti-patterns for your domain are called out. Key screens are identified. A visual language is proposed (colors, typography, density).

**Round 4: "Final Priorities" (45-60 min)**
Everything comes together. Every feature gets a final vote:
- **Must-Have**: In the MVP, non-negotiable
- **Should-Have**: Important but can wait for Phase 2
- **Could-Have**: Nice to have, Phase 3+
- **Won't-Have**: Explicitly not building (for now)

The output is a **verdict document** — a binding contract of what gets built and in what order.

---

## What the Tribunal Produces

| Output | What It Is |
|--------|-----------|
| **Verdict document** | The final prioritized feature list with MoSCoW categories |
| **Persona files** (3-5) | Detailed user profiles with vote allocations |
| **Competitor matrix** | Feature comparison across all competitors |
| **Gap analysis** | What competitors miss that you can exploit |
| **Feasibility assessments** | Effort estimates and technical flags per feature |
| **Design brief** | Visual direction and UX patterns to follow |
| **Phase allocation** | Which features go in which phase |

**Total: 60-100 files** of research you'd otherwise skip or spend weeks doing manually.

---

## Time Investment

| Mode | Time | What You Get |
|------|------|-------------|
| **Full Tribunal** | 2-5 days (mostly AI running) | Everything above — complete research package |
| **Abbreviated Tribunal** | 4-8 hours | Personas + quick competitor scan + Round 1 + Round 4 + verdict. Skips deep dives, design research, and Rounds 2-3. |
| **Skip Tribunal** | 0 hours | Nothing. You go straight to specs. |

---

## "Can I Skip the Tribunal?"

Yes. But understand what you're giving up:

| If you skip... | You lose... | Risk level |
|----------------|------------|------------|
| Personas | Knowing who your users are and what they prioritize | High — you might build for the wrong audience |
| Competitor research | Knowing what already exists | Medium — you might reinvent the wheel |
| Feasibility assessment | Knowing what's hard before you commit | High — you might promise features that take 3x longer |
| Design research | Visual direction grounded in best practices | Low — you can figure this out as you go |
| The verdict | A prioritized, debated feature list | High — you're guessing at priorities |

**When it's okay to skip:**
- You already know your market deeply (you've been in this industry for years)
- You've already done competitor research
- This is a small personal project where "wrong" features aren't costly
- You're using the Lite Path for a simple app

**When you should NOT skip:**
- This is a product you plan to sell
- You have a team and need alignment on what to build
- You're entering a competitive market
- The project will take more than 4 weeks

---

## Real Example

Here's what a Tribunal verdict looks like for a project management SaaS:

**Must-Have (MVP):**
- Project CRUD with status workflow
- Team member management with roles
- Task boards with drag-and-drop
- Basic time tracking

**Should-Have (Phase 2):**
- Client portal with read-only access
- Invoice generation from time entries
- Kanban AND list view toggle

**Could-Have (Phase 3):**
- Resource allocation heatmap
- Budget forecasting
- Custom field builder

**Won't-Have (explicitly deferred):**
- AI task suggestions (too complex for MVP)
- Video conferencing integration (competitors already do this well)
- White-label option (premature optimization)

This verdict came from 4 personas voting, 5 competitors analyzed, and 3 feasibility assessments. It took 6 hours. It saved weeks of "should we add this?" debates during development.

---

## Glossary

Not sure what a term means? See [GLOSSARY.md](GLOSSARY.md).

| Term | Quick Definition |
|------|-----------------|
| **Persona** | A fictional but realistic user profile representing a group of real users |
| **MoSCoW** | Must-have / Should-have / Could-have / Won't-have — a prioritization method |
| **MVP** | Minimum Viable Product — the smallest useful version of your app |
| **Verdict** | The final, binding output of the Tribunal — what gets built and when |
| **Deal-breaker** | A feature so critical that a persona won't use the product without it |
