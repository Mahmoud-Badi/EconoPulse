# Feature Request Triage

> **A framework for evaluating, prioritizing, and (often) declining feature requests without losing users or your sanity.** Feature requests are not a roadmap. They are raw signal that needs processing.

---

## The Problem

After launch, feature requests arrive from everywhere: support tickets, Twitter DMs, investor meetings, your own team, competitor launches, that one user who emails you daily. Without a triage system, you end up with one of two failure modes:

1. **You build everything** — Your product becomes a bloated mess with no coherent vision.
2. **You build nothing** — Requests pile up in a spreadsheet nobody reads, and users feel ignored.

This guide gives you the middle path: a structured, repeatable process for evaluating every request against consistent criteria, communicating decisions transparently, and keeping your roadmap aligned with strategy rather than noise.

---

## Step 1: Intake — Capture Every Request Consistently

Before you can prioritize, you need a consistent format. Every feature request, regardless of source, should be captured with these fields:

### Feature Request Intake Form

```markdown
## Feature Request: [Short Title]

**Submitted by:** [Name / User ID / Role]
**Source:** [Support ticket / In-app feedback / User interview / Internal / Competitor analysis]
**Date:** [YYYY-MM-DD]
**Status:** New | Under Review | Accepted | Declined | Deferred

### Description
[What does the user want? In their words, not yours.]

### User Problem
[What problem are they trying to solve? This is more important than the requested solution.]

### Current Workaround
[How do they handle this today? If there is no workaround, urgency is higher.]

### Requested By
- [ ] Single user
- [ ] Multiple users (count: ___)
- [ ] Internal stakeholder (who: ___)
- [ ] Paying customer (plan: ___)

### Supporting Evidence
[Screenshots, support tickets, analytics data, user quotes]

### Initial Category
- [ ] Bug (disguised as feature request)
- [ ] Feature request (net-new capability)
- [ ] UX improvement (existing feature works but is painful)
- [ ] Performance (existing feature is too slow)
- [ ] Content/copy change
- [ ] Integration request
```

**Rule:** If a request does not have a filled-out intake form, it does not enter triage. No exceptions. Informal Slack messages like "we should totally add dark mode" are not feature requests until someone fills out the form.

---

## Step 2: RICE Scoring Framework

RICE is the industry standard for prioritizing feature requests. It replaces gut feeling with a repeatable formula.

### The Formula

```
RICE Score = (Reach x Impact x Confidence) / Effort
```

### Factor Definitions

| Factor | Definition | Scale | How to Measure |
|--------|-----------|-------|----------------|
| **Reach** | How many users will this affect per quarter? | Actual number (e.g., 500, 2000, 10000) | Analytics data, user segments, support ticket counts |
| **Impact** | How much will this move the needle for each affected user? | 3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal | User research, comparable feature adoption rates |
| **Confidence** | How confident are you in your Reach and Impact estimates? | 100% = High (data-backed), 80% = Medium (some data), 50% = Low (gut feel) | Quality and quantity of supporting evidence |
| **Effort** | How many person-months will this take? | Actual number (e.g., 0.5, 1, 3, 6) | Engineering estimates (always get two opinions) |

### Scoring Examples

| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---------|-------|--------|------------|--------|------------|
| Export to CSV | 2,000 | 1 | 80% | 0.5 | **3,200** |
| Dark mode | 5,000 | 0.5 | 50% | 2 | **625** |
| SSO integration | 200 | 3 | 100% | 3 | **200** |
| Redesign onboarding | 10,000 | 2 | 80% | 4 | **4,000** |
| Mobile app | 8,000 | 2 | 50% | 12 | **667** |
| Keyboard shortcuts | 1,000 | 1 | 80% | 1 | **800** |

### How to Read RICE Scores

- **Score > 2,000** — Strong candidate. Prioritize for the current or next quarter.
- **Score 500-2,000** — Good candidate. Slot into the roadmap within 2-3 quarters.
- **Score 100-500** — Marginal. Consider only if it aligns with a strategic theme.
- **Score < 100** — Likely not worth building. Decline or defer indefinitely.

### RICE Pitfalls

- **Do not inflate Reach to justify a pet feature.** Use real data, not "everyone would want this."
- **Effort estimates are always optimistic.** Add 50% to your initial estimate.
- **Confidence below 50% means you need more research, not a decision.**
- **RICE is a sorting tool, not a decision-maker.** A high RICE score does not automatically mean "build it." Strategic alignment still matters.

---

## Step 3: MoSCoW Prioritization

Use MoSCoW when you have a fixed timebox (sprint, quarter, release) and need to decide what makes the cut.

### Categories

| Category | Definition | Rule of Thumb |
|----------|-----------|---------------|
| **Must Have** | Without this, the release is a failure. Non-negotiable. | If removing it breaks a user promise or causes churn, it is a Must. |
| **Should Have** | Important but not critical. The release works without it. | If users will be disappointed but not harmed, it is a Should. |
| **Could Have** | Nice to have. Include if time allows. | If only power users care, it is a Could. |
| **Won't Have (this time)** | Explicitly excluded from this release. May revisit later. | If it does not align with the current quarter's theme, it is a Won't. |

### MoSCoW Allocation Rule

For any given release or quarter, your effort budget should roughly follow:

- **Must Have:** 60% of available effort
- **Should Have:** 20% of available effort
- **Could Have:** 20% of available effort
- **Won't Have:** 0% (by definition)

If your Must Haves exceed 60% of capacity, you have too many Must Haves. Demote the weakest ones to Should Have.

---

## Step 4: Multi-Stakeholder Voting

When multiple stakeholders have input (product, engineering, design, sales, support), use weighted voting to prevent any single voice from dominating.

### Weighted Voting System

| Stakeholder | Weight | Rationale |
|-------------|--------|-----------|
| Product / Founder | 3x | Strategic vision alignment |
| Engineering | 2x | Technical feasibility and maintenance cost awareness |
| Design / UX | 2x | User experience and usability perspective |
| Customer Support | 2x | Direct user pain point knowledge |
| Sales | 1x | Revenue and prospect input (discounted because sales requests skew toward enterprise features) |
| Individual Users | 1x | Direct feedback (discounted because vocal minority bias) |

### Voting Process

1. Present the top 15-20 candidates (pre-filtered by RICE score > 100)
2. Each stakeholder rates each feature: +1 (support), 0 (neutral), -1 (oppose)
3. Multiply each vote by the stakeholder's weight
4. Sum weighted votes per feature
5. Rank by weighted score
6. Product owner makes final call, using weighted scores as input (not as the decision)

### Why the Product Owner Gets Final Say

Voting is advisory, not binding. Democratic feature prioritization produces mediocre products. Someone must own the vision and make hard calls. Voting ensures every perspective is heard. The product owner ensures the sum of those perspectives forms a coherent product.

---

## Step 5: The Decision Flowchart

For any feature request that reaches triage, walk through this decision tree:

```
START: New feature request received
  │
  ├─ Is it actually a bug? ─── YES ──→ Move to bug tracker. Not a feature request.
  │
  ├─ Does it align with product vision? ─── NO ──→ DECLINE. Explain why.
  │
  ├─ Does it solve a problem for >5% of users? ─── NO ──→ DEFER. Revisit in 6 months.
  │
  ├─ Can users achieve the same outcome with existing features? ─── YES ──→ IMPROVE existing feature instead.
  │
  ├─ Is it technically feasible within 1 quarter? ─── NO ──→ BREAK DOWN into smaller deliverables.
  │
  ├─ RICE score > 500? ─── NO ──→ DEFER. Add to backlog with low priority.
  │
  ├─ Does it conflict with in-progress work? ─── YES ──→ DEFER to next quarter.
  │
  └─ RICE score > 500 + aligns with vision + feasible ──→ ACCEPT. Add to roadmap.
```

---

## How to Say No

Declining feature requests is a skill. Done poorly, it alienates users. Done well, it builds trust.

### Principles

1. **Acknowledge the problem, not just the request.** "I hear that you need to export data" not "We are not adding CSV export."
2. **Explain the why.** Users accept "no" when they understand the reasoning.
3. **Offer alternatives when they exist.** Workarounds, integrations, or planned features that partially address the need.
4. **Never say "never."** Say "not right now" unless you are certain the feature will never exist.
5. **Be human.** Form letters feel dismissive. Spend 60 seconds personalizing.

### Example Responses

**Declining — Not Aligned with Vision:**
> Thanks for suggesting [feature]. I can see how that would be useful for your workflow. Right now, we are focused on [core value prop] and this feature would pull us in a different direction. We are not planning to build it in the near term, but I have added it to our tracking system in case our direction evolves. If you need this capability now, [alternative/integration] might help.

**Deferring — Good Idea, Wrong Time:**
> Great suggestion. This is actually something we have been thinking about, and your request adds another data point in its favor. Right now our engineering team is focused on [current priority], which we expect to ship by [date]. I have added your request to our backlog and will revisit it during our next quarterly planning. I will follow up if it makes the cut.

**Declining — Niche Request:**
> I appreciate you taking the time to share this. After reviewing the request, we found that this would benefit a small subset of users (roughly [X]%) while adding complexity to the product for everyone. For now, we are going to pass. If you are seeing more demand for this than we are, I would love to hear about it — that data might change the equation.

**Redirecting — Existing Feature Solves It:**
> Good news — you can actually do this today. [Feature X] supports this workflow, though the path is not obvious. Here is how: [steps]. I have also flagged the discoverability issue with our design team, because if you did not find it, others probably have not either.

---

## Feature Request Anti-Patterns

These are the patterns that lead to bad prioritization decisions. Recognize and resist them.

### 1. Loudest Voice Wins

**Pattern:** One user (often a large customer or internal executive) repeatedly requests a feature. The team builds it because the noise is unbearable, not because the data supports it.

**Prevention:** Require RICE scoring before any feature enters the roadmap. Loud voices get a 1x weight in the voting system, same as any other user.

### 2. Competitor-Driven Development

**Pattern:** A competitor ships feature X. Panic ensues. The team drops everything to build feature X. Two months later, you realize your users did not need it.

**Prevention:** Before reacting to a competitor feature, survey your users. "Would you use X?" Most of the time, the answer is "no" or "maybe someday." Build for your users, not your competitors' users.

### 3. Resume-Driven Development

**Pattern:** Engineers want to build something because the technology is interesting, not because users need it. "We should rewrite the backend in Rust" when the Node.js backend handles 10x the current load fine.

**Prevention:** Every feature must have a user problem statement. "As a [user], I need [capability] so that [outcome]." If the problem statement is "As an engineer, I want to use a cooler technology," it is not a feature request.

### 4. Feature Parity Obsession

**Pattern:** "Competitor Y has this, so we must too." This leads to building a product that is identical to competitors instead of differentiated from them.

**Prevention:** Ask: "If we build this, do we win a user who would otherwise choose the competitor? Or are we just checking a box?" Most feature parity work is box-checking.

### 5. Sunk Cost Feature Creep

**Pattern:** "We already built 60% of this feature, so we might as well finish it." No. If the remaining 40% is not worth building on its own merits, cut your losses.

**Prevention:** Evaluate every in-progress feature at each milestone as if you were starting from scratch. Would you start building this today with what you know now?

### 6. Consensus Paralysis

**Pattern:** The team cannot agree on whether to build a feature, so it sits in "under review" limbo for months. Meanwhile, users who requested it feel ignored.

**Prevention:** Set a triage SLA. Every request gets a decision (accept, decline, defer) within 14 days. No exceptions. "Defer" is a valid decision. "Under review" for more than 2 weeks is not.

---

## Triage Cadence

| Activity | Frequency | Participants | Duration |
|----------|-----------|-------------|----------|
| New request intake review | Daily | Product owner | 15 min |
| RICE scoring session | Weekly | Product + Engineering lead | 30 min |
| Triage decision meeting | Biweekly | Product + Engineering + Design | 60 min |
| Backlog grooming | Monthly | Product + Engineering | 90 min |
| Strategic roadmap review | Quarterly | All stakeholders | Half day |

---

## Metrics to Track

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Time from request to decision | < 14 days | Users should not wait months for a yes/no |
| Acceptance rate | 15-25% | Below 10% means you are not listening. Above 40% means you have no filter. |
| Implementation rate (accepted requests actually shipped) | > 80% | Accepting and then never building is worse than declining |
| Requester satisfaction (survey accepted + declined) | > 70% | Even declined requests should feel heard |
| Features shipped vs. features requested | Track ratio | Rising ratio = you are building the right things proactively |
