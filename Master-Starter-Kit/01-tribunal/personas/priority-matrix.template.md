# Priority Matrix: Cross-Persona Voting Synthesis

> **Date:** [YYYY-MM-DD]
> **Personas:** [N total]
> **Features Voted On:** [N total]
> **Total Votes Cast:** [N personas x 10 = total]

---

## Vote Tally

Sorted by total votes (descending). Each persona has exactly 10 votes to allocate.

| # | Feature | [Persona A] | [Persona B] | [Persona C] | [Persona D] | [Persona E] | **Total** |
|---|---------|-------------|-------------|-------------|-------------|-------------|-----------|
| 1 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 2 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 3 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 4 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 5 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 6 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 7 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 8 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 9 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 10 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 11 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 12 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 13 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 14 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |
| 15 | [Feature] | [0-5] | [0-5] | [0-5] | [0-5] | [0-5] | **[sum]** |

**Validation:** Each persona column must sum to exactly 10.

| Persona | Vote Total | Valid? |
|---------|-----------|--------|
| [Persona A] | [sum] | [Y/N] |
| [Persona B] | [sum] | [Y/N] |
| [Persona C] | [sum] | [Y/N] |
| [Persona D] | [sum] | [Y/N] |
| [Persona E] | [sum] | [Y/N] |

---

## Consensus Features

Features where **3 or more personas** allocated at least 1 vote. These have broad support across user types and are strong candidates for Must-Have classification.

| Feature | Personas Who Voted | Total Votes | Signal |
|---------|-------------------|-------------|--------|
| [Feature] | [Persona A (3), Persona C (2), Persona D (1)] | [6] | Strong consensus |
| [Feature] | [Persona B (2), Persona C (1), Persona E (1)] | [4] | Moderate consensus |
| [Feature] | [Persona A (1), Persona B (1), Persona D (1)] | [3] | Broad but shallow |

**Interpretation guide:**
- **Strong consensus (6+ votes, 3+ personas):** Almost certainly Must-Have
- **Moderate consensus (4-5 votes, 3+ personas):** Likely Must-Have or strong Should-Have
- **Broad but shallow (3 votes, 3+ personas):** Important to many but critical to none — Should-Have

---

## Contested Features

Features where there is **strong disagreement** — one persona allocated 3+ votes while another allocated 0. These tensions must be explicitly resolved in the Tribunal debate.

| Feature | Champion (votes) | Opponent (votes) | Tension |
|---------|-----------------|-----------------|---------|
| [Feature] | [Persona A (4)] | [Persona D (0)] | [Describe the conflict. Example: "Maria the dispatcher needs real-time GPS to reassign trips, but James the driver gives it 0 votes because he's concerned about privacy and battery drain. This is a workflow need vs. user resistance conflict."] |
| [Feature] | [Persona B (3)] | [Persona C (0)] | [Tension description] |
| [Feature] | [Persona E (5)] | [Persona A (0)] | [Tension description] |

**Resolution approaches:**
- **Compromise:** Build the feature but with controls (e.g., GPS tracking with driver privacy settings)
- **Prioritize the critical persona:** If one persona is the primary user, their vote wins
- **Phase it:** Build a basic version for V1, enhance based on feedback
- **Make it optional:** Build it but let users/admins toggle it off

---

## Deal-Breaker Features

Features identified as deal-breakers by any persona. Even if only one persona flags a deal-breaker, it must be addressed — losing an entire user type to a missing feature is a product failure.

| Feature | Flagged By | Why It's a Deal-Breaker | Impact If Missing |
|---------|-----------|------------------------|-------------------|
| [Feature] | [Persona A] | [Their specific reason — quote from persona doc] | [What happens: "Dispatchers refuse to adopt, stick with spreadsheets"] |
| [Feature] | [Persona B] | [Reason] | [Impact] |
| [Feature] | [Persona C, Persona D] | [Reason — shared concern] | [Impact] |
| [Feature] | [Persona E] | [Reason] | [Impact] |

**Deal-breaker audit questions:**
- Is this a real deal-breaker or a strong preference? (Test: would they literally refuse to use the product?)
- Can a simpler version of the feature satisfy the deal-breaker? (MVP of the deal-breaker)
- Does this deal-breaker align with other personas' votes? (If yes, it's doubly important)

---

## Zero-Vote Features

Features that received 0 votes from ALL personas. These are candidates for deferral or removal.

| Feature | Why Zero Votes | Recommendation |
|---------|---------------|----------------|
| [Feature] | [Possible reasons: not relevant to any persona's workflow, too niche, feature is assumed/invisible] | [Defer to V2 / Remove / Keep as infrastructure — it supports other features] |
| [Feature] | [Reason] | [Recommendation] |
| [Feature] | [Reason] | [Recommendation] |

**Note:** Zero votes doesn't always mean "don't build it." Some features are invisible infrastructure (authentication, audit logging, data backups) that no persona would vote for but are required for the product to function. These should be classified separately.

---

## Persona Power Analysis

Which persona's priorities should carry the most weight? Consider:

| Persona | Total Users Like Them | Revenue Impact | Churn Risk | Usage Frequency | Weight |
|---------|----------------------|---------------|-----------|----------------|--------|
| [Persona A] | [Estimated count] | [High/Medium/Low] | [High/Medium/Low] | [Daily/Weekly/Monthly] | [1.0-2.0x] |
| [Persona B] | [Count] | [Impact] | [Risk] | [Frequency] | [Weight] |
| [Persona C] | [Count] | [Impact] | [Risk] | [Frequency] | [Weight] |
| [Persona D] | [Count] | [Impact] | [Risk] | [Frequency] | [Weight] |
| [Persona E] | [Count] | [Impact] | [Risk] | [Frequency] | [Weight] |

**Must-Win Persona:** [Name] — [1 sentence explaining why this persona's satisfaction is most critical for product adoption]

**Weighted Vote Tally** (optional, for when raw votes need adjustment):

| Feature | Raw Total | Weighted Total | Change |
|---------|-----------|---------------|--------|
| [Feature] | [Raw] | [Weighted] | [+/- N] |

---

## Summary for Round 1

**Top 10 Features by Votes:**
1. [Feature] — [N] votes
2. [Feature] — [N] votes
3. [Feature] — [N] votes
4. [Feature] — [N] votes
5. [Feature] — [N] votes
6. [Feature] — [N] votes
7. [Feature] — [N] votes
8. [Feature] — [N] votes
9. [Feature] — [N] votes
10. [Feature] — [N] votes

**Top 3 Conflicts to Resolve:**
1. [Feature]: [Persona X] vs. [Persona Y] — [1 sentence summary of tension]
2. [Feature]: [Persona X] vs. [Persona Y] — [Summary]
3. [Feature]: [Persona X] vs. [Persona Y] — [Summary]

**Must-Win Persona:** [Name and role]

**Critical Deal-Breakers:** [Count] deal-breakers across [Count] personas

---

*This matrix feeds directly into proceedings/round-1-user-needs.template.md*
