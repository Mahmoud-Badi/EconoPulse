# CX Operations Gotchas

> Production lessons from teams that learned the hard way. Read this before you build, not after you ship.

---

## Overview

Every section in this folder represents months of planning. This file represents years of mistakes. These are not theoretical risks --- they are patterns that repeat across companies of every size. Each gotcha includes what goes wrong, why it happens, and how to prevent it.

**When to read this:** Before starting implementation. Revisit quarterly as your CX operations mature.

---

## Gotcha 1: Your Chatbot's First Week Will Be Embarrassing

**What happens:** You launch your AI chatbot after weeks of testing. Within 48 hours, screenshots of bizarre responses circulate on social media. A customer asks about pricing and the bot hallucinates a plan that doesn't exist. Another asks about a bug and the bot confidently provides instructions for a competitor's product.

**Why it happens:** Test datasets are clean. Real users are chaotic. They misspell, use slang, paste error messages with special characters, ask compound questions, and test boundaries deliberately. Your golden test set of 200 examples covers maybe 30% of real query patterns.

**How to prevent it:**
- Launch to 5% of traffic first (internal users, then beta users, then small segment, then full rollout)
- Set confidence threshold high initially (0.90+), lower gradually as you collect data
- Have a human review every bot response for the first 72 hours --- yes, every one
- Prepare a chatbot apology canned response for when (not if) the bot says something wrong
- Monitor social media and support channels for bot complaint spikes
- Kill switch: ability to disable the bot in under 60 seconds

**Cross-ref:** `ai-support-chatbot-blueprint.template.md` --- Graceful degradation chain, confidence thresholds

---

## Gotcha 2: Channel Proliferation Doubles Operational Complexity --- Quietly

**What happens:** Marketing adds a WhatsApp number. Sales sets up a Discord server. Product launches in-app chat. Engineering creates a status page with a comment section. Six months later, you have 7 channels, customers messaging on 3 simultaneously about the same issue, and no single view of the conversation.

**Why it happens:** Each channel decision makes sense in isolation. Nobody models the compound operational cost. Adding a channel is not just one more inbox --- it is routing rules, SLA tracking, agent training, response templates, quality monitoring, and reporting for that channel. The cost is multiplicative, not additive.

**How to prevent it:**
- Use the channel selection decision tree (`omnichannel-decision-tree.md`) before adding any channel
- Require a channel owner for every active channel (who monitors it? who is on-call?)
- Never launch a channel without unified inbox integration --- if it cannot route to the same queue, do not open it
- Quarterly channel audit: volume, CSAT, cost-per-resolution per channel --- kill channels that underperform
- Rule of thumb: if you have fewer than 3 agents, cap at 2 channels

**Cross-ref:** `omnichannel-decision-tree.md`, `unified-inbox-architecture.template.md`

---

## Gotcha 3: NPS Without Follow-Up Is a Vanity Metric

**What happens:** You implement NPS surveys. Your score is +35. Everyone celebrates. Nothing changes. Six months later it is +33. Nobody notices because nobody was tracking what actions came from the feedback. Detractors never heard back. Promoters were never asked for reviews. The survey became a scoreboard, not a tool.

**Why it happens:** NPS is easy to measure and hard to act on. The number feels like progress, but the value is in the follow-up workflows --- contacting detractors within 24 hours, routing feedback to product, converting promoters to advocates. Most teams celebrate implementing the survey and never build the response engine.

**How to prevent it:**
- Do not launch NPS until you have detractor follow-up automation built and tested
- Set a 24-hour SLA for detractor contact --- measure it like a support SLA
- Track detractor recovery rate (% of detractors who become passive/promoter after follow-up)
- Report NPS with actions taken, not just the score: "NPS: +35 | Detractors contacted: 94% | Themes routed to product: 3"
- If nobody reads the NPS report, stop sending it --- fix the process first

**Cross-ref:** `nps-csat-automation.template.md` --- Detractor follow-up automation, promoter activation

---

## Gotcha 4: Health Scores Drift --- Recalibrate Quarterly

**What happens:** You build a health scoring model. It works great for 3 months. Then product ships a major feature that changes usage patterns. Login frequency drops because users now accomplish tasks faster. The model flags 40% of customers as at-risk because it is measuring the old behavior. Your CSM team is drowning in false positives. The real at-risk customers --- the ones not using the new feature at all --- go unnoticed.

**Why it happens:** Health scores are built on assumptions about what healthy looks like. Those assumptions change when your product changes, your customer base shifts, or market conditions evolve. A static model becomes a misleading model within 1-2 quarters.

**How to prevent it:**
- Schedule quarterly health score calibration (non-negotiable, put it on the calendar)
- Compare predicted churn vs. actual churn monthly --- if prediction accuracy drops below 70%, recalibrate immediately
- When a major feature ships, review all usage signals in the health model within 2 weeks
- Keep segment-specific weights --- enterprise healthy looks different from SMB healthy
- Maintain a churn autopsy log: every churned customer gets a post-mortem of what signals the model missed

**Cross-ref:** `customer-health-scoring.template.md` --- Calibration process, segment-specific weights

---

## Gotcha 5: Self-Service Content Rots Faster Than You Think

**What happens:** You launch a beautiful help center with 100 well-written articles. Product ships 2 features per month. Six months later, 30 articles reference UI that no longer exists, 15 have outdated screenshots, and 8 describe workflows that have fundamentally changed. Customers follow the articles, get stuck, and file tickets saying your documentation told me to click a button that doesn't exist.

**Why it happens:** Nobody owns content freshness. Writing new articles is visible work. Updating existing articles is invisible work. Product teams ship features without updating docs because it's not their job. Support teams notice stale content but don't have edit access or bandwidth to fix it.

**How to prevent it:**
- Assign every article an owner and a review date (max 90 days for product articles, 180 for policy articles)
- Automate staleness detection: if an article hasn't been reviewed in longer than the review period, flag it
- Add "Was this helpful?" to every article --- articles with less than 50% helpfulness get auto-flagged for review
- Build KB updates into the feature release checklist: no feature ships without doc updates
- Track stale article ticket rate --- tickets caused by outdated documentation

**Cross-ref:** `self-service-knowledge-center.template.md` --- Content lifecycle management, KB analytics

---

## Gotcha 6: Unified Inboxes Create Chaos Without Routing Rules

**What happens:** You implement a unified inbox. All channels flow into one queue. Agents cherry-pick easy tickets. Complex tickets sit for hours. VIP customers wait alongside free-tier users. Billing questions go to agents who don't have billing access. The inbox becomes a swamp.

**Why it happens:** Unification without routing is just consolidation. You've moved the mess from 5 inboxes to 1 inbox. The volume is the same, the prioritization is worse (because now it's all mixed together), and agent efficiency drops because they're context-switching between channel types.

**How to prevent it:**
- Build routing rules BEFORE connecting channels to the unified inbox
- Minimum routing: auto-assign by category (billing to billing team), priority (P1 to senior agent), and channel (phone to phone-trained agents)
- Disable cherry-picking: agents get assigned tickets, they don't browse the queue
- Set up SLA timers per priority level --- the inbox should show time remaining not time waiting
- Start with 2 channels in the unified inbox, verify routing works, then add more

**Cross-ref:** `unified-inbox-architecture.template.md` --- Routing engine, assignment strategies

---

## Gotcha 7: QA Scoring Without Calibration Creates Resentment

**What happens:** You implement QA scoring. Reviewer A gives a ticket 92/100. Reviewer B scores an identical-quality ticket 78/100. Agents notice. They compare scores. The agent with the 78 feels targeted. Trust in the QA program evaporates. Top performers start gaming the rubric instead of writing good responses. Within 3 months, nobody takes QA seriously.

**Why it happens:** Rubric interpretation is subjective unless explicitly calibrated. "Empathetic tone" means different things to different reviewers. Without regular calibration sessions where reviewers score the same ticket and discuss differences, scores reflect reviewer personality more than response quality.

**How to prevent it:**
- Monthly calibration sessions: all reviewers score the same 5 tickets independently, then compare and discuss
- Track inter-rater reliability (Cohen's kappa) --- if it drops below 0.7, increase calibration frequency
- Maintain a scoring precedent document: edge cases and how they were scored, with rationale
- Let agents dispute scores through a defined process --- and sometimes overturn them
- New reviewers shadow experienced reviewers for 2 weeks before scoring independently

**Cross-ref:** `qa-scoring-and-coaching.template.md` --- Calibration process, inter-rater reliability

---

## Gotcha 8: Cross-Channel Context Preservation Is Technically Hard

**What happens:** A customer emails about an issue on Monday. They follow up via live chat on Wednesday, assuming the agent can see their email. The agent has no context and asks the customer to repeat everything. The customer is frustrated: "I already explained this in my email." Worse, the email and chat are tracked as separate conversations with separate SLAs.

**Why it happens:** Identity resolution across channels is a deceptively hard problem. The customer uses a different email for chat. Their phone number doesn't match any record. Their display name is a nickname. Even when you resolve identity, linking conversations across channels requires shared data models, consistent customer IDs, and real-time sync --- most integrations don't provide this out of the box.

**How to prevent it:**
- Design identity resolution before building channel integrations --- it's foundational, not an afterthought
- Require account authentication for support channels where possible (in-app chat is easiest)
- Build a customer timeline view: all interactions across all channels, sorted chronologically
- Accept that identity resolution will fail sometimes --- train agents to search by email, name, and account ID
- When resolution fails, don't ask the customer to repeat --- ask "Can you share your account email so I can pull up your history?"

**Cross-ref:** `unified-inbox-architecture.template.md` --- Identity resolution, conversation linking

---

## Gotcha 9: Chatbot A/B Tests Need Larger Sample Sizes Than You Expect

**What happens:** You A/B test two chatbot response styles. After 200 conversations, Style B has 5% higher resolution rate. You ship it. Next week, the improvement disappears. It was noise. You wasted two weeks of engineering time on a false positive and your team loses confidence in experimentation.

**Why it happens:** Chatbot conversations have high variance. Resolution depends on question complexity, user patience, time of day, and dozens of other factors. Statistical significance for chatbot metrics requires 2-5x more samples than typical web A/B tests because the signal-to-noise ratio is much lower.

**How to prevent it:**
- Calculate required sample size before starting any test (use a power analysis calculator)
- For resolution rate improvements of less than 5%, expect to need 2,000+ conversations per variant
- Run tests for a minimum of 2 full weeks (capture weekday and weekend patterns)
- Don't peek at results daily --- set a review date and stick to it
- Use sequential testing methods if you need faster results (but accept they require more total samples)
- Focus A/B tests on high-impact changes (prompt rewrites, handoff thresholds) not cosmetic ones (greeting text)

**Cross-ref:** `ai-support-chatbot-blueprint.template.md` --- A/B testing framework

---

## Gotcha 10: The Feedback-to-Roadmap Pipeline Breaks Silently

**What happens:** You build a feedback collection system. Customers submit feedback. It goes into a database. Product managers read it --- for the first month. Then they stop because it's 200 entries of unstructured text with no categorization. Customer-reported problems don't make it into sprints. Customers notice their feedback goes into a void and stop submitting it. You lose a critical product signal.

**Why it happens:** Feedback collection is easy. Feedback processing is hard. Raw feedback is noisy --- customers describe symptoms, not root causes. Without aggregation, categorization, and regular product team review, the feedback pipeline becomes write-only storage.

**How to prevent it:**
- Auto-categorize feedback on submission (even a simple keyword-based system helps)
- Generate a weekly top 5 feedback themes report for the product team --- not raw entries, themes with counts
- Close the loop: when a requested feature ships, notify the customers who asked for it
- Track feedback-to-roadmap-to-shipped conversion rate --- if it's 0%, the pipeline is broken
- Assign a single person as feedback pipeline owner --- their job is to make sure feedback reaches product

**Cross-ref:** `feedback-collection-system.template.md` --- Aggregation pipeline, LLM auto-tagging

---

## Gotcha 11: Agent Onboarding Shortcuts Create Compounding Quality Debt

**What happens:** You're drowning in tickets. You hire a new agent. Instead of the 30-day onboarding program, you give them 3 days of shadowing and throw them into the queue. They resolve tickets --- but with 40% lower accuracy than tenured agents. They learn workarounds instead of proper solutions. They teach these workarounds to the next rushed hire. Within 6 months, half your team is giving slightly wrong answers confidently.

**Why it happens:** The pressure to reduce queue depth is immediate and visible. The cost of poor onboarding is delayed and invisible --- until it shows up as CSAT decline, increased escalations, and KB articles with wrong information contributed by under-trained agents.

**How to prevent it:**
- Never compress onboarding below 14 days, even under pressure --- hire a temp contractor for queue relief instead
- Week 1 product immersion is non-negotiable --- agents who don't understand the product can't help customers
- Track onboarding cohort quality --- compare QA scores and CSAT by hire date to measure onboarding effectiveness
- If you must accelerate, cut scope (limit to Tier 1 tickets only), not depth (skip knowledge checks)
- Every agent should pass knowledge checks before handling tickets independently --- no exceptions

**Cross-ref:** `agent-onboarding-playbook.template.md` --- 30-day timeline, completion criteria

---

## Gotcha 12: Proactive Messaging Backfires When Targeting Is Wrong

**What happens:** You build a proactive outreach system. It sends "we noticed you haven't logged in this week --- need help?" messages to at-risk customers. Great idea. Except the targeting logic flags customers on vacation, customers who use the API (no login needed), and customers on annual plans who legitimately use the product seasonally. Your helpful messages come across as desperate, needy, or clueless. Enterprise customers complain to their CSM about spam.

**Why it happens:** Proactive messaging requires precise targeting. Low login frequency is a proxy signal, not a definitive one. When the targeting logic is too broad, messages reach customers who are fine --- and those customers react negatively to unsolicited outreach because it signals that you don't understand their usage pattern.

**How to prevent it:**
- Start with high-confidence triggers only: payment failure, support ticket unresolved for more than 48h, explicit downgrade inquiry
- Exclude accounts with known alternative usage patterns (API-only, seasonal, managed by CSM)
- A/B test proactive messages on a small segment before full rollout
- Include an easy opt-out in every proactive message
- Measure proactive message annoyance rate --- replies that say "stop emailing me" or "I'm fine"
- Rule: if you can't explain why THIS customer needs THIS message at THIS moment, don't send it

**Cross-ref:** `omnichannel-decision-tree.md` --- Proactive messaging playbook, anti-patterns

---

## Gotcha 13: "Build vs. Integrate" Is a Trap --- It's Usually "Integrate Then Customize"

**What happens:** Team A builds a custom ticketing system from scratch. Six months later, they've rebuilt 70% of Zendesk's features and the remaining 30% (reporting, macros, satisfaction surveys) are "coming soon" forever. Team B integrates Zendesk and immediately hits limitations: custom fields are expensive, the API rate limit breaks their sync, and the webhook format doesn't match their data model. Both teams are frustrated.

**Why it happens:** The decision is presented as binary: build or buy. In reality, almost every team ends up in a hybrid state --- integrating a platform and building custom layers on top. The question isn't "build or integrate" but "where do I draw the customization line?"

**How to prevent it:**
- Use the decision tree (`ticketing-system-decision-tree.md`) honestly --- don't let engineering enthusiasm bias toward build
- If integrating: budget 30% of implementation time for custom adapters, webhooks, and sync logic
- If building: list every feature you need, estimate honestly, then multiply by 3 --- that's your real timeline
- Start with integration for non-differentiating features (ticketing, email) and build custom for differentiating ones (chatbot, health scoring)
- Review the decision annually --- your needs at 100 tickets/month differ from 10,000 tickets/month

**Cross-ref:** `ticketing-system-decision-tree.md`, `unified-inbox-architecture.template.md`

---

## Gotcha 14: Metrics Without Context Are Dangerous

**What happens:** Your dashboard shows first response time dropped from 4 hours to 45 minutes. The team celebrates. What nobody notices: agents are sending "We received your message and will look into it" as a first response to hit the metric, then taking 6 hours for the actual substantive response. The metric improved. The customer experience got worse.

**Why it happens:** Goodhart's Law --- when a measure becomes a target, it ceases to be a good measure. Agents optimize for what's measured, and if the measurement is naive, the optimization is counterproductive. Single metrics are especially dangerous because they can always be gamed.

**How to prevent it:**
- Never track a metric without its counter-metric: first response time + first response quality, resolution time + reopen rate, tickets/day + CSAT
- Define what counts as a first response clearly --- automated acknowledgments don't count
- Review metrics with sample tickets, not just numbers: "Our FRT is 45 minutes --- here are 5 representative first responses"
- Ask agents what they think the metric misses --- they know better than dashboards
- Rotate which metrics are emphasized quarterly to prevent optimization lock-in

**Cross-ref:** `cx-analytics-dashboard.template.md`, `qa-scoring-and-coaching.template.md`

---

## Gotcha 15: Ignoring Agent Emotional Labor Causes Silent Attrition

**What happens:** Your best agent handles 35 tickets a day with a 4.8 CSAT. They deal with angry customers, frustrated users, and occasional abusive messages. They never complain. One day they resign with 2 weeks notice. In the exit interview, they say they've been burned out for 6 months. You lose institutional knowledge, a KB contributor, and a mentor for new hires. The replacement takes 3 months to reach the same quality level.

**Why it happens:** Support is emotional labor. Agents absorb negative emotions from customers all day. Most CX programs measure output (tickets, CSAT, resolution time) but not the cost to the agent. Burned-out agents don't always show it in metrics --- they show it by quietly job searching.

**How to prevent it:**
- Monitor for burnout signals: declining CSAT trend (even small), increased time-off requests, reduced Slack activity, shorter responses
- Cap difficult ticket exposure: no agent should handle more than 3 angry/abusive conversations in a row --- rotate to easy tickets
- Create a vent channel or debrief ritual after hard interactions --- this is standard practice in crisis counseling, not a luxury
- Quarterly 1:1s focused on wellbeing, not performance --- "How are you feeling about the work?" not "Your numbers look good"
- Recognize emotional labor explicitly: "Thank you for handling that difficult customer" matters more than a metrics dashboard
- Have a clear process for handling abusive customers --- agents should never feel like they have to tolerate abuse to hit metrics

**Cross-ref:** `qa-scoring-and-coaching.template.md` --- Coaching framework, `support-team-hiring.template.md` --- Role definitions

---

## Implementation Notes

- **Read before building.** Share this document with your CX team before starting any section implementation.
- **Add your own gotchas.** Every production environment surfaces new lessons. Append them here.
- **Review quarterly.** As your CX operations mature, some gotchas become irrelevant and new ones emerge.
- **Don't let these scare you into inaction.** Every gotcha has a prevention path. The goal is awareness, not avoidance.
