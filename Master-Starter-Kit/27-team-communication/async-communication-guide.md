# Async Communication Guide

> The default in most teams is synchronous communication: tap someone on the shoulder, send a Slack message and wait for an immediate reply, schedule a meeting for every question. This default destroys deep work, punishes different timezones, and creates a culture where the fastest responder wins instead of the most thoughtful one. This guide provides the protocols, decision matrices, and templates for effective asynchronous communication.

---

## Why Async-First Matters

A developer needs 23 minutes to refocus after an interruption (University of California, Irvine research). A team of 5 developers interrupted 4 times each per day loses **460 minutes** of productive time daily — nearly 8 person-hours. That is one full person's workday lost to interruptions.

Async communication is not "slower communication." It is communication designed to:
- Respect deep work and flow states
- Give people time to think before responding (higher quality answers)
- Create a written record (searchable, shareable, onboard-friendly)
- Enable collaboration across timezones without forcing anyone into bad hours
- Reduce meeting count and total meeting time

The goal is not to eliminate synchronous communication. The goal is to use the right mode for the right situation.

---

## Async vs Sync Decision Matrix

| Situation | Recommended Format | Why |
|-----------|-------------------|-----|
| Quick question, less than 5 min to answer | Async message (Slack/Discord) | Do not interrupt someone's flow for a quick answer |
| Complex discussion, multiple viewpoints needed | Async RFC (written proposal) | Give people time to think deeply, not just react |
| Emotional or sensitive topic | Sync meeting (video call, 1-on-1) | Tone matters, text can be misread, empathy requires presence |
| Urgent blocker (production issue, deadline at risk) | Sync call (phone or video) | Speed matters more than thoughtfulness |
| Status update | Async standup post | No meeting needed. Post and move on. |
| Brainstorming / ideation | Sync meeting | Energy and spontaneity feed off each other in real-time |
| Code review feedback | Async PR comments | Reviewer needs time to read and think. No rush. |
| Architecture decision | Async RFC + sync meeting for final decision | Written analysis first, then discuss remaining disagreements |
| Onboarding questions | Async message in public channel | Answer benefits everyone, creates searchable knowledge |
| Performance feedback | Sync 1-on-1 meeting | Never deliver feedback over text. Always face-to-face. |
| Weekly alignment | Async standup + optional sync check-in | Written updates save time; sync only for blockers |
| Conflict resolution | Sync meeting (ideally in-person or video) | Text escalates conflict. Voice de-escalates. |
| Decision that affects the whole team | Async RFC with sync follow-up if no consensus | Give everyone a voice, not just the loudest or fastest |

### The 3-Message Rule

If an async conversation goes back and forth 3 times without resolution, switch to sync. Schedule a 15-minute call, resolve it, and post the outcome back in the async channel.

---

## RFC (Request for Comments) Process

An RFC is a structured proposal for any decision that affects more than one person or more than one sprint. It replaces the "quick meeting" with a thoughtful, written process.

### When to Write an RFC

- Proposing a new feature or significant feature change
- Suggesting a process change (new tool, new workflow, new ceremony)
- Making a technical decision with multiple viable options
- Any decision where you want input from 3+ people

### RFC Template

```markdown
# RFC: [Title]

**Author:** [name]
**Date:** [date]
**Status:** Draft / Open for Comments / Decided / Withdrawn
**Decision Deadline:** [date — typically 48-72 hours from posting]
**Decider:** [who makes the final call if no consensus]

---

## Summary
[2-3 sentences: What are you proposing? What problem does it solve?]

## Problem
[Describe the problem or opportunity. Include data or examples if available.
Why does this matter now?]

## Proposal
[Describe your proposed solution in detail. Be specific enough that someone
could implement it from this description.]

## Alternatives Considered
1. **[Alternative A]:** [description, pros, cons]
2. **[Alternative B]:** [description, pros, cons]
3. **Do nothing:** [what happens if we do not act]

## Trade-offs
[What are we accepting? What are the downsides of the proposal?]

## Impact
[Who is affected? What changes? What is the effort to implement?]

## Open Questions
[What are you unsure about? What input do you specifically want?]

---

## Comments
[Reviewers add comments below, threaded by topic]

### [Reviewer Name] — [Date]
[Comment]

### [Reviewer Name] — [Date]
[Comment]

---

## Decision
**Date:** [when decided]
**Outcome:** [what was decided]
**Rationale:** [why]
```

### RFC Process Steps

| Step | Who | Timeline | Action |
|------|-----|----------|--------|
| 1. Write | Author | Before sharing | Write the RFC using the template above. Spend 30-60 minutes. Quality writing leads to quality feedback. |
| 2. Share | Author | Day 0 | Post the RFC in the designated channel or shared doc. Tag all relevant reviewers. Set a comment deadline (48-72 hours). |
| 3. Comment | Reviewers | Day 0-3 | Read the RFC. Add comments. Be specific: "I agree because X" or "I disagree because Y, and suggest Z instead." |
| 4. Revise | Author | Day 3-4 | Read all comments. Revise the proposal if feedback warrants changes. Address open questions. |
| 5. Decide | Decider | Day 4-5 | If consensus: accept. If no consensus: the designated decider makes the call. Post the decision and rationale. |
| 6. Document | Author | Day 5 | Add the decision to the product decision log (PDR). Update any affected docs or plans. |

### RFC Rules

1. **No drive-by approvals.** "LGTM" is not a review. Explain why you agree or what you checked.
2. **Silence is not consent.** If you are tagged as a reviewer and do not comment by the deadline, the author will ping you once. After that, your input is forfeited.
3. **Disagreement is welcome.** A good RFC process surfaces disagreement early. It is cheaper to argue in a doc than to argue in production.
4. **The decider decides.** If consensus is not reached, the designated decider makes the call. This is not a vote — it is an informed decision by an accountable person.
5. **RFCs are archived, not deleted.** Even withdrawn RFCs are valuable — they document what was considered and why it was rejected.

---

## PR Descriptions as Documentation

Pull request descriptions are the most underused communication channel on most teams. A good PR description replaces a meeting, a Slack conversation, and a design doc.

### PR Description Template

```markdown
## What
[1-2 sentences: What does this PR do?]

## Why
[1-2 sentences: Why is this change needed? Reference task ID from STATUS.md]

## How
[Brief description of the technical approach. Not a line-by-line explanation —
just enough for a reviewer to understand the strategy before reading the code.]

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed: [describe what you tested]
- [ ] Edge cases considered: [list]

## Screenshots
[Before/after screenshots for UI changes. Screen recordings for interactive changes.]

## Checklist
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] No new warnings or lint errors
- [ ] Documentation updated (if applicable)
- [ ] Self-reviewed the diff before requesting review

## Notes for Reviewers
[Anything the reviewer should know: tricky sections, areas where you are unsure,
things you explicitly chose NOT to do and why]
```

### Why This Matters for Communication

- **Async reviewers understand context** without asking questions in Slack
- **Future developers understand history** when they git-blame a line and read the PR
- **New team members learn patterns** by reading well-described PRs
- **Stakeholders see progress** without a meeting (link PRs in standup updates)

---

## Status Update Protocol

The rule is simple: **proactive is always better than reactive.**

### Proactive Communication

| Trigger | Action | Example |
|---------|--------|---------|
| You will miss a deadline | Notify stakeholders immediately with new estimate | "Sprint goal is at risk. TASK-043 is more complex than estimated. I will need 2 more days. Options: extend sprint or cut TASK-047." |
| You are blocked | Post in the team channel with the blocker and who can unblock | "Blocked on TASK-043: need API contract for notifications. @backend-lead can you provide by EOD?" |
| You made a mistake | Own it immediately | "Heads up: I introduced a bug in the settings page with PR #42. Rolling back now. Will have a fix by EOD." |
| You learned something useful | Share it | "TIL: The Stripe API has a 100 webhook/minute rate limit. Added to our architecture notes." |
| Your task is taking longer than expected | Update STATUS.md and mention it in standup | "TASK-043 estimated at 4 hours, now at 8. Root cause: API pagination was more complex than documented." |

### Reactive Communication (Avoid)

| Bad Pattern | Better Pattern |
|-------------|---------------|
| Stakeholder asks "how is the project going?" and you respond | You send a weekly update before anyone asks |
| Manager discovers a risk in standup | You flagged the risk 2 days ago when it emerged |
| Team member finds out about a blocker after spinning their wheels | You posted the blocker in the channel as soon as you hit it |

### Response Time Expectations

Set clear expectations for response times. Different channels have different urgency.

| Channel | Expected Response Time | Escalation If No Response |
|---------|----------------------|--------------------------|
| Phone call | Immediately (if answered) or within 15 min callback | Call again, then text |
| Slack DM (urgent flag) | Within 30 minutes during work hours | Call them |
| Slack DM (normal) | Within 4 hours during work hours | Follow up message |
| Slack channel post | Within 8 hours (next business day if after hours) | DM the person |
| Email | Within 24 hours (business days) | Slack message |
| PR review request | Within 24 hours (business days) | Slack reminder |
| RFC comment request | Within 48-72 hours (by stated deadline) | Ping once, then decide without their input |

### "Do Not Disturb" Protocol

Deep work requires uninterrupted time. Establish team norms:

1. **DND hours are respected.** If someone has focus time blocked on their calendar, do not Slack them unless it is a P0 emergency.
2. **Batch async messages.** Do not send 5 messages in 5 minutes. Write one comprehensive message.
3. **Use threading.** Reply in threads to avoid flooding the main channel.
4. **Mute notifications intentionally.** It is okay to mute channels during deep work. Check them during natural breaks.

---

## Tool Recommendations by Team Context

### By Team Size

| Team Size | Recommended Stack | Notes |
|-----------|------------------|-------|
| Solo | GitHub Issues + personal notes | Minimal tooling overhead |
| 2-3 people | Slack (or Discord) + GitHub Issues + Google Docs | Free or cheap, covers all communication modes |
| 4-8 people | Slack + Linear (or Jira) + Notion (or Confluence) + Loom | Structured project management, searchable docs, async video |
| 9+ people | Slack + Linear/Jira + Notion/Confluence + Loom + dedicated wiki | Need stronger organization and discoverability |

### By Timezone Spread

| Timezone Overlap | Approach | Tools |
|-----------------|----------|-------|
| Full overlap (same timezone) | Default sync, async for status updates | Standard tooling |
| Partial overlap (4-6 hour overlap) | Async-first, sync during overlap window | Loom for async demos, shared docs for RFCs |
| Minimal overlap (1-3 hours) | Async-primary, sync only for critical decisions | Loom, detailed written updates, recorded meetings |
| No overlap | Fully async, pass-the-baton workflow | Comprehensive written handoffs, recorded video updates |

### Tool Purpose Matrix

| Need | Recommended Tool(s) | Avoid Using |
|------|---------------------|-------------|
| Quick questions | Slack DM or channel | Email (too slow) |
| Async standups | Slack channel or Geekbot | Meetings (unnecessary) |
| Long-form proposals | Google Docs, Notion, or Markdown in repo | Slack (messages get buried) |
| Code review | GitHub/GitLab PR interface | Slack or email (context is in the code) |
| Video updates | Loom | Long meetings (a 5-min Loom replaces a 30-min meeting) |
| Decision records | Markdown files in repo | Slack (unsearchable after 2 weeks) |
| Task tracking | Linear, Jira, or GitHub Issues | Slack threads (tasks get lost) |
| Knowledge base | Notion, Confluence, or docs/ folder in repo | Individual brains (bus factor) |

---

## Communication Norms Document

Every team should have a brief "how we communicate" document. Here is a template:

```markdown
# Team Communication Norms

## Our Principles
1. Async by default, sync when needed
2. Proactive over reactive
3. Written over verbal (decisions must be documented)
4. Public channels over DMs (information is shared, not siloed)

## Our Channels
| Channel | Purpose | Who |
|---------|---------|-----|
| #general | Announcements, company-wide | Everyone |
| #team-[name] | Team discussions, questions, async threads | Team members |
| #standup-[name] | Daily async standups | Team members |
| #blockers | Blockers that need attention | Team members + leads |
| #celebrations | Wins, shipped features, milestones | Everyone |

## Our Response Times
[Use the response time table above]

## Our Meeting Rules
[Reference meeting-agenda-templates.md]

## Our Focus Time
[Hours/days when DMs and meetings are discouraged]

## Last Updated
[Date — review quarterly]
```

---

## Async Communication Anti-Patterns

| Anti-Pattern | Symptom | Fix |
|-------------|---------|-----|
| **"Quick call?"** for everything | Every question becomes a 15-minute call | Default to writing. If the answer takes <5 min to type, type it. |
| **Slack as a firehose** | Important messages buried in noise | Use channels for purpose, not topics. Pin important messages. Use threads. |
| **DMs for team decisions** | Decisions made privately, team uninformed | Discuss in public channels. "Default to open." |
| **No-context messages** | "Hey, are you free?" with no topic | Include the question in the first message: "Hey, quick question about the auth flow: [question]" |
| **Expecting instant replies** | Frustration when someone does not respond in 5 minutes | Set response time expectations explicitly. Respect DND. |
| **Wall of text** | 500-word Slack messages nobody reads | If it is that long, write an RFC or doc. Slack is for short messages. |
| **No summary after sync meetings** | Verbal decisions lost, absent members uninformed | Always post a written summary of decisions and action items after every meeting. |
| **Async for everything** | Important discussion drags on for 5 days in a doc | Use the 3-message rule. If it is not converging, schedule a call. |
