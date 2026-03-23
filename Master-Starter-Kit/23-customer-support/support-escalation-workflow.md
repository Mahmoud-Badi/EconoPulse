# Support Escalation Workflow

> **Purpose:** Define the tiered support model, escalation criteria, handoff protocols, and de-escalation procedures so every issue reaches the right person with full context.
> **Used in:** Orchestrator Step 18.7 (Customer Support Infrastructure)
> **Principle:** The user should never have to repeat themselves. Context travels with the ticket, not with the user's patience.

---

## Tiered Support Model

Support is organized into three tiers. Each tier has a clear scope, escalation criteria, and resolution target. Issues flow upward only when necessary — the goal is to resolve as much as possible at the lowest tier.

```
              +-------------------+
              |  L1: Self-Serve   |
              |    / AI Bot       |  Resolve 70%+ of queries
              +--------+----------+
                       |
              (Unresolved or complex)
                       |
                       v
              +-------------------+
              |  L2: Support      |
              |     Agent         |  Resolve 90%+ of remaining queries
              +--------+----------+
                       |
              (Bug, infra issue, or data problem)
                       |
                       v
              +-------------------+
              |  L3: Engineering  |
              |                   |  Resolve all remaining issues
              +-------------------+
```

---

## L1 — Self-Serve / AI Bot

### Scope

L1 handles the first line of defense. The goal is to resolve 70%+ of all support queries without a human ever being involved.

**L1 includes:**
- Knowledge base articles
- AI chatbot (FAQ, documentation search, guided troubleshooting)
- In-app help tooltips and contextual guidance
- Status page (for known incidents)
- Community forums / Discord (peer support)
- Onboarding guides and product tours
- FAQ page on the website

### What L1 Resolves

| Query Type | L1 Resolution Method |
|-----------|----------------------|
| "How do I [basic task]?" | KB article or bot answer |
| "What does [feature] do?" | KB article or in-app tooltip |
| "Is [product] down?" | Status page |
| "How much does it cost?" | Pricing page / FAQ |
| "How do I reset my password?" | Self-serve password reset flow |
| "What browsers are supported?" | KB article |
| "Can I cancel my subscription?" | KB article or self-serve cancellation |

### Escalation Criteria (L1 to L2)

Escalate to L2 when:

- [ ] The AI bot cannot answer the question (confidence below threshold)
- [ ] The user explicitly asks to speak with a human
- [ ] The issue is account-specific (requires looking up user data, logs, or admin panel)
- [ ] The user has tried the KB article and it did not resolve their issue
- [ ] The question involves billing disputes, refunds, or payment failures
- [ ] The user reports a bug (needs reproduction and triage)
- [ ] The issue requires changing something in the user's account
- [ ] The user is emotionally frustrated (sentiment detection or explicit language)

### L1 Metrics

| Metric | Target |
|--------|--------|
| Self-serve resolution rate | >70% |
| Bot resolution rate | >40% |
| Average time to self-resolution | <3 minutes |
| L1 to L2 escalation rate | <30% |
| KB article coverage | >90% of common questions |

---

## L2 — Support Agent

### Scope

L2 is where human support agents handle issues that self-serve could not resolve. Agents have access to the user's account, admin panel, internal logs, and the ability to take action on behalf of the user.

**L2 includes:**
- Email support
- Live chat support
- Phone support (if applicable by tier)
- Dedicated Slack channels (Enterprise)

### What L2 Resolves

| Query Type | L2 Resolution Method |
|-----------|----------------------|
| "I'm locked out of my account" | Account recovery via admin panel |
| "I was charged incorrectly" | Billing investigation, refund processing |
| "This feature is not working for me" | Account-specific troubleshooting, log analysis |
| "I need to export my data in a specific format" | Manual data export or guided workaround |
| "I'm confused about how to set up [complex feature]" | Walkthrough via screen share or detailed email |
| "I got an error: [specific message]" | Log lookup, reproduction attempt, troubleshooting |
| "I want to change my plan/account settings" | Admin panel changes |
| Feature requests | Log, acknowledge, and feed to product team |

### L2 Agent Toolset

Every L2 agent must have access to:

| Tool | Purpose |
|------|---------|
| Support platform (inbox, chat) | Communication with users |
| Admin panel | View/modify user accounts, subscriptions, data |
| Internal logs (application, error tracking) | Investigate errors and issues |
| Session replay tool (LogRocket, FullStory) | See what the user experienced |
| Issue tracker (Linear, Jira, GitHub Issues) | Create engineering tickets |
| Internal KB / runbooks | Agent-facing documentation for common procedures |
| Team communication (Slack) | Consult with other agents or engineering |

### Escalation Criteria (L2 to L3)

Escalate to L3 (Engineering) when:

- [ ] The issue is confirmed as a software bug (reproducible, not user error)
- [ ] The issue requires a code change to resolve (not a configuration or account fix)
- [ ] The issue involves data corruption, data loss, or data inconsistency
- [ ] The issue requires database-level investigation or changes
- [ ] The issue is infrastructure-related (server errors, performance degradation, outages)
- [ ] The issue involves a security vulnerability or potential data breach
- [ ] The agent has exhausted all troubleshooting steps in the runbook without resolution
- [ ] The issue requires API-level debugging that agents cannot perform

**Do NOT escalate to L3 when:**
- The user is asking a "how-to" question (L2 resolves with documentation or walkthrough)
- The issue is a known bug that already has an engineering ticket (update the user on status)
- The issue is a feature request (log it, do not create an engineering escalation)
- The issue is resolved by an account configuration change

### L2 Metrics

| Metric | Target |
|--------|--------|
| First response time | Per SLA (tier-dependent) |
| Average resolution time | <24 hours |
| CSAT score | >90% |
| L2 to L3 escalation rate | <10% of L2 tickets |
| One-touch resolution rate | >60% (resolved in first reply) |
| Tickets per agent per day | 15-25 (depends on complexity) |

---

## L3 — Engineering

### Scope

L3 handles issues that require code changes, infrastructure access, or database-level operations. These are bugs, performance issues, data problems, and security incidents.

**L3 includes:**
- Bug fixes
- Infrastructure troubleshooting and resolution
- Database investigations and data recovery
- Security incident response
- Performance optimization for user-reported latency issues

### What L3 Resolves

| Query Type | L3 Resolution Method |
|-----------|----------------------|
| Confirmed software bug | Code fix via bug report pipeline |
| Server errors (500s, timeouts) | Infrastructure investigation, fix, deploy |
| Data corruption/loss | Database investigation, data recovery |
| Security vulnerability | Patch, deploy, incident response (Section 21) |
| Performance degradation | Profiling, optimization, infrastructure scaling |
| Integration failures | API debugging, partner coordination |

### L3 Response Protocol

1. **Receive escalation** from L2 with full context (see handoff template below)
2. **Acknowledge** within the priority's target response time
3. **Investigate** — reproduce, check logs, identify root cause
4. **Communicate** status updates to L2 (who relays to the user)
5. **Fix** — implement, test, deploy
6. **Verify** — confirm fix resolves the original issue
7. **Close loop** — notify L2, who notifies the user

### L3 Metrics

| Metric | Target |
|--------|--------|
| Time to acknowledge escalation | P0: <15 min, P1: <1 hour, P2: <4 hours |
| Time to root cause | P0: <2 hours, P1: <1 day, P2: <3 days |
| Time to fix deployed | Per bug pipeline priority targets |
| Escalation rejection rate | <5% (L2 should not escalate prematurely) |

---

## Handoff Templates

### L1 to L2 Handoff (Bot to Agent)

When the AI bot escalates to a human agent, the following context is passed automatically:

```
## Escalation from Bot to Agent

**User:** [Name] ([Email])
**Account Tier:** [Free / Pro / Business / Enterprise]
**Channel:** [Chat / Email]
**Timestamp:** [When user initiated conversation]

**Conversation Summary:**
[Full bot conversation transcript]

**Bot Assessment:**
- Category: [Bug / How-to / Billing / Account / Feature Request]
- Attempted resolution: [What the bot tried]
- Reason for escalation: [Low confidence / User requested human / Could not resolve]

**User Sentiment:** [Neutral / Frustrated / Urgent]
```

### L2 to L3 Handoff (Agent to Engineering)

When a support agent escalates to engineering, they must fill out this template:

```
## Engineering Escalation

**Support Ticket:** #[TICKET_ID]
**User:** [Name] ([Email]) — [Tier]
**Agent:** [Agent Name]
**Date:** [YYYY-MM-DD]

### Issue Summary
[2-3 sentences: What is the problem? Who is affected? What is the user impact?]

### Reproduction Steps
1. [Step-by-step, verified by the agent]
2. [Include account ID if needed for reproduction]

### What the Agent Already Tried
- [List every troubleshooting step taken]
- [Include results of each step]

### Evidence
- Screenshots: [Links]
- Error logs: [Links or pasted text]
- Session replay: [Link]
- Sentry/error tracking: [Link]

### User Communication History
- [Date]: [Summary of what was communicated to the user]
- [Date]: [Summary of user's latest response]

### Requested Priority
- [ ] P0 — Production down, affects all/most users
- [ ] P1 — Core feature broken, high impact
- [ ] P2 — Feature degraded, workaround exists
- [ ] P3 — Minor issue, low impact
```

### L3 to L2 Handoff (Engineering to Agent — Resolution)

When engineering resolves the issue, they pass back to support:

```
## Resolution Report

**Engineering Ticket:** [TICKET_ID]
**Support Ticket:** #[TICKET_ID]
**Resolved By:** [Engineer Name]
**Date:** [YYYY-MM-DD]

### Root Cause
[Technical explanation in 1-2 sentences]

### User-Friendly Explanation
[Non-technical explanation that the agent can send to the user]

### Fix Details
- PR/Commit: [Link]
- Deployed to production: [Date/Time]
- Regression test added: [Yes/No]

### Verification Steps
[Steps the user can take to verify the fix works]

### Anything Else the User Should Know
[e.g., "They may need to clear their browser cache" or "The fix will take effect within 1 hour"]
```

---

## Context Preservation Requirements

The single most common support failure is making the user repeat themselves. Every handoff must include full context. Here are the non-negotiable rules:

1. **Full conversation history travels with every escalation.** No exceptions.
2. **Agent notes are required before escalation.** What you tried, what happened, what you think the issue is.
3. **The user is never asked to re-explain their problem.** If the user has to say "I already explained this to the other person," your process is broken.
4. **Internal discussion happens in internal notes, not in the user-facing thread.** The user should see a seamless experience, not your internal back-and-forth.
5. **When a new agent picks up a ticket, they read the full history before responding.** This takes 2-3 minutes and saves 10 minutes of re-gathering context.

---

## De-Escalation Protocol

### When Users Are Angry

Angry users are not the problem — they are the signal. An angry user cared enough about your product to be upset when it failed them. Handle them well and they become your most loyal advocates. Handle them poorly and they become your most vocal detractors.

### De-Escalation Steps

**Step 1: Acknowledge the Emotion**
Do not jump to solutions. First, acknowledge that the user is frustrated.

- "I completely understand your frustration — this is not the experience you should be having."
- "I hear you, and I am sorry this has been so difficult."
- "You are right to be frustrated — let me make this right."

**What NOT to say:**
- "I understand" (without specifics — feels hollow)
- "Let me look into that" (without acknowledging the emotion)
- "That's by design" (never say this — see support-gotchas.md)
- "Per our policy..." (legalistic language escalates anger)

**Step 2: Take Ownership**
Even if it is not your fault personally, own the situation on behalf of the team.

- "I take full responsibility for getting this resolved for you."
- "I am going to personally make sure this gets fixed."
- "This is our problem to solve, and I am on it."

**Step 3: Provide a Concrete Next Step**
Vague promises make angry users angrier. Be specific.

- "I am escalating this to our engineering team right now. You will hear back from me within [timeframe] with an update."
- "I have identified the issue and here is exactly what we are going to do to fix it: [specific plan]."
- "I am going to [specific action] within the next [timeframe] and will update you as soon as it is done."

**Step 4: Follow Through**
The absolute worst thing you can do after de-escalation is fail to follow up. If you promised an update in 2 hours, send an update in 2 hours — even if the update is "still investigating, will update again in 2 hours."

**Step 5: Close the Loop**
After resolution, send a personal follow-up:
- "I wanted to follow up personally — is everything working as expected now?"
- "Thank you for your patience while we resolved this. Is there anything else I can help with?"

### When to Involve Management

Escalate to the Support Lead or Head of Support when:

- The user is threatening legal action
- The user is a high-value account (Enterprise, high MRR)
- The user has been angry across multiple interactions (not a one-time frustration)
- The user requests to speak with a manager
- The issue has been unresolved for more than double the SLA target
- The user's frustration is caused by a systemic issue (affects many users)

---

## Escalation Metrics to Track

| Metric | Target | What It Tells You |
|--------|--------|-------------------|
| % tickets resolved at L1 | >70% | KB and bot effectiveness |
| % tickets resolved at L2 | >90% of L2 tickets | Agent competency and tooling |
| % tickets escalated L1 → L2 | <30% | Content gap in KB/bot |
| % tickets escalated L2 → L3 | <10% of L2 tickets | Product quality and agent training |
| Average time at each tier | L1: <3min, L2: <4hrs, L3: varies | Bottleneck identification |
| Escalation rejection rate (L3) | <5% | L2 escalation quality |
| Context completeness score | >95% | Are handoffs including full context? |
| User re-explanation rate | 0% | Are users having to repeat themselves? |
| De-escalation success rate | >90% | How often angry users leave satisfied? |
| Resolution after de-escalation CSAT | >85% | Quality of recovery experience |

---

## Escalation Workflow: Visual Summary

```
USER CONTACTS SUPPORT
        |
        v
   [L1: Bot / KB]
        |
   Resolved? --YES--> Close (CSAT survey)
        |
       NO
        |
        v
   [L2: Support Agent]
        |
   Resolved? --YES--> Close (CSAT survey)
        |
       NO
        |
   Is it a bug / infra / data issue?
        |
       YES --> [L3: Engineering] --> Bug Pipeline --> Fix --> Verify --> Notify User --> Close
        |
       NO --> Re-investigate at L2 (consult with peers, check runbooks)
        |
   Still unresolved after 2 attempts?
        |
       YES --> Escalate to Support Lead for review
```

---

## Quarterly Escalation Review

Every quarter, review escalation patterns to identify systemic improvements:

1. **Top 10 L2 escalation reasons** — Can any be resolved at L1 with better KB content or bot training?
2. **Top 5 L3 escalation reasons** — Do these indicate recurring product quality issues?
3. **Agent training gaps** — Are certain agents escalating more than others? Do they need additional training?
4. **Tooling gaps** — Do agents need access to additional tools or dashboards to resolve issues without engineering?
5. **Process bottlenecks** — Where are tickets spending the most time? Where are handoffs dropping context?
