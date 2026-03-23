# CX Maturity Assessment

> Start here. Your maturity level determines which files in this section to prioritize, which to defer, and how deeply to implement each one. A two-person startup building an MVP and a 50-person scale-up with 10,000 active users need completely different things from this section.

---

## The Four Maturity Levels

### Level 1: Reactive

You have no formal support system. The founder or a developer answers emails when they notice them in the inbox. There is no knowledge base, no ticketing system, no SLAs, and no metrics. Customer questions are answered in Slack DMs, email threads, or Twitter replies with no tracking, no categorization, and no follow-up verification. You have no idea how many support requests you receive per week, what the most common questions are, or how long it takes to resolve them.

This is normal and acceptable for the first weeks of a product with fewer than 100 users. It becomes a liability the moment any of the following happens: you miss a customer question for more than 48 hours, you answer the same question for the fifth time, a paying customer churns because they could not get help, or you realize you have no idea what your users are struggling with. If any of these have happened, you are overdue for Level 2.

**Characteristics:**
- Support happens in the founder's personal inbox or Slack DMs
- No categorization, tagging, or tracking of support requests
- No knowledge base or FAQ page
- Response times are unpredictable and unmeasured
- Same questions get answered repeatedly with inconsistent responses
- No visibility into support volume trends or common issue patterns
- Zero automation — every interaction requires manual effort

### Level 2: Structured

You have a dedicated support platform (Zendesk, Intercom, Helpscout, or equivalent). Tickets are tracked, categorized, and assigned. You have a basic knowledge base with 10-30 articles covering the most common questions. SLAs are defined, even if they are informal. You operate primarily on one channel (usually email or in-app chat). You have basic metrics — ticket volume, response time, resolution time — even if nobody reviews them regularly.

Level 2 is where most early-stage startups should aim to stabilize before attempting anything more ambitious. The jump from Level 1 to Level 2 delivers the highest ROI of any maturity transition because it replaces chaos with structure. You go from "I think we answer most questions within a day or two" to "our median first response time is 3.2 hours and our top ticket category is billing questions at 28% of volume." That visibility alone changes how you prioritize product and documentation work.

**Characteristics:**
- Dedicated support platform with ticket tracking and assignment
- Basic knowledge base covering top 20-30 FAQs
- SLAs defined for at least one tier (even if not formally published)
- Primary support channel established (email or chat)
- Basic metrics tracked: volume, response time, resolution time
- At least one person has support as a defined responsibility
- Some canned responses exist for common questions
- Escalation path to engineering exists but may be informal

### Level 3: Proactive

You have an AI chatbot deployed that handles 30-50% of incoming questions without human intervention. A self-service knowledge center exists with search, categorization, and content lifecycle management. You support multiple channels (email, chat, and at least one additional channel) with conversations unified in a single inbox. Feedback loops are active — you collect NPS/CSAT, analyze trends, and feed insights back to product. Your support team has more than one person, with defined roles, basic onboarding, and regular QA reviews.

Level 3 is the inflection point where support stops scaling linearly with headcount and starts scaling logarithmically with infrastructure. The AI chatbot and self-service center handle the repetitive questions that consume 40-60% of agent time at Level 2, freeing human agents to focus on complex, high-value interactions that actually require judgment. The feedback loops mean you are not just responding to problems but systematically identifying and eliminating their root causes. Most B2B SaaS companies with 1,000-50,000 users should be operating at Level 3.

**Characteristics:**
- AI chatbot deployed with RAG pipeline against knowledge base
- Self-service knowledge center with search UX and content management
- Multi-channel support with unified inbox and conversation routing
- NPS/CSAT surveys deployed with event-driven triggers
- Feedback analysis feeds into product roadmap discussions
- Support team of 3+ with defined specializations
- Structured onboarding for new agents (even if informal)
- QA reviews happen at least monthly
- Proactive outreach for known issues (in-app banners, status page)
- Escalation workflows are documented and followed consistently

### Level 4: Predictive

You have a customer health scoring system that identifies at-risk accounts before they churn. Automated intervention workflows trigger when health scores drop below thresholds — account manager outreach, personalized in-app messaging, executive escalation for high-value accounts. Your CX analytics dashboard connects support data, product usage data, billing data, and feedback data into a unified view. You run A/B tests on support workflows. Your chatbot continuously improves from conversation feedback and automated evaluation pipelines. Your QA program includes calibration sessions, coaching plans, and career development paths for agents.

Level 4 is where CX becomes a genuine competitive advantage rather than a cost center. Very few companies below $10M ARR or 50,000 users need Level 4. The investment is substantial — health scoring alone requires instrumentation across product analytics, support systems, and billing — but the payoff is measurable in reduced churn, increased expansion revenue, and customer advocacy that no marketing campaign can replicate. If your company's revenue depends on retention (SaaS, subscription, marketplace), Level 4 is where you should ultimately aim.

**Characteristics:**
- Customer health scoring model with 5+ input signals
- Automated intervention workflows triggered by health score changes
- Churn prediction with at least moderate accuracy (AUC > 0.7)
- Unified CX analytics dashboard with executive reporting
- A/B testing on support workflows and chatbot responses
- Chatbot evaluation pipeline with automated quality scoring
- QA calibration sessions with inter-rater reliability tracking
- Agent coaching plans tied to QA data
- Career development framework for support team
- Cross-functional CX review cadence with product, engineering, and leadership

---

## Self-Assessment Scorecard

Score your current state across six dimensions on a 1-5 scale. Be honest — overestimating your maturity leads to attempting implementations your infrastructure cannot support.

### Dimension 1: AI & Automation

| Score | Criteria |
|-------|----------|
| 1 | No automation. Every support interaction is fully manual. |
| 2 | Basic canned responses and macros exist. Maybe an FAQ bot that matches keywords. |
| 3 | AI chatbot deployed with knowledge base retrieval. Handles simple questions. Human handoff exists but is clunky. |
| 4 | AI chatbot with RAG pipeline, confidence scoring, and graceful human escalation. Deflects 30-50% of tickets. Conversation context preserved on handoff. |
| 5 | Chatbot with continuous learning from feedback, automated evaluation pipeline, A/B testing on responses, multi-turn conversation memory, and proactive suggestions. Deflects 50%+ of tickets. |

### Dimension 2: Self-Service

| Score | Criteria |
|-------|----------|
| 1 | No knowledge base. No FAQ page. Users must contact support for everything. |
| 2 | Basic FAQ page or simple KB with <20 articles. No search. No analytics. |
| 3 | Structured knowledge center with 50+ articles, search, and categories. Basic article view tracking. |
| 4 | Full self-service portal with search UX optimization, content lifecycle management, gap analysis, and in-app contextual help (tooltips, walkthroughs). |
| 5 | Self-service ecosystem including knowledge center, community forum, developer portal, video tutorials, interactive troubleshooters, and contextual help. Content effectiveness measured and optimized continuously. |

### Dimension 3: Channel Coverage

| Score | Criteria |
|-------|----------|
| 1 | Single informal channel (founder's email or Slack DMs). |
| 2 | One dedicated support channel (email or chat) with consistent monitoring. |
| 3 | Two channels with unified inbox. Conversations can be tracked across channels. |
| 4 | Three or more channels (email, chat, social, phone) with unified routing, priority scoring, and SLA-aware queue management. |
| 5 | Full omnichannel with adaptive channel recommendations, proactive outreach, unified conversation history, and channel-specific optimization (e.g., rich media in chat, structured forms in email). |

### Dimension 4: Ticketing & Operations

| Score | Criteria |
|-------|----------|
| 1 | No ticketing system. Requests tracked in email or not tracked at all. |
| 2 | Basic ticketing with categorization and assignment. Manual priority setting. |
| 3 | Ticketing with SLA tracking, auto-assignment rules, and escalation workflows. Bug reports linked to engineering issues. |
| 4 | Advanced ticketing with skill-based routing, SLA breach alerts, automated follow-ups, and cross-team collaboration workflows. |
| 5 | Predictive ticketing with auto-classification, sentiment detection, priority prediction, automated routing based on agent expertise and availability, and proactive ticket creation from monitoring alerts. |

### Dimension 5: Feedback & Measurement

| Score | Criteria |
|-------|----------|
| 1 | No feedback collection. No metrics. You have no idea if customers are happy. |
| 2 | Basic metrics tracked (volume, response time). Maybe occasional manual CSAT surveys. |
| 3 | NPS and CSAT surveys deployed with basic automation. Support metrics dashboard exists. Reviewed monthly. |
| 4 | Event-driven survey triggers, follow-up automation for detractors, feedback aggregation with trend analysis. Customer health scoring with basic signals. |
| 5 | Full feedback ecosystem with NPS/CSAT/CES, sentiment analysis, health scoring with churn prediction, automated intervention workflows, A/B testing on survey design, and closed-loop follow-up verified by retention data. |

### Dimension 6: Team Operations

| Score | Criteria |
|-------|----------|
| 1 | No dedicated support person. Founder or developer handles support ad hoc. |
| 2 | At least one person has support as a defined responsibility. Basic response guidelines exist. |
| 3 | Support team of 2+ with role definitions. Structured onboarding exists. Informal QA reviews. |
| 4 | Support team with hiring rubrics, 30-day onboarding playbook, regular QA scoring, coaching sessions, and performance tracking. |
| 5 | Full team operations with career ladders, calibrated QA with inter-rater reliability, coaching plans tied to data, workforce management, scheduling optimization, and burnout prevention programs. |

### Scoring Interpretation

| Total Score | Maturity Level | Recommended Focus |
|-------------|---------------|-------------------|
| 6-10 | Level 1 (Reactive) | Get to Level 2 — platform, basic KB, one channel |
| 11-17 | Level 2 (Structured) | Strengthen foundations, then target Level 3 |
| 18-24 | Level 3 (Proactive) | Optimize existing systems, begin Level 4 investments |
| 25-30 | Level 4 (Predictive) | Refine and expand — you are in the top tier |

---

## Recommended Reading Order by Maturity Level

### If You Are Level 1 (Reactive)

**Priority — read and implement these first:**
1. `cx-maturity-assessment.md` (this file) — understand where you are
2. Go to Section 23 and complete `support-platform-decision-tree.md` — you need a platform before anything else
3. Go to Section 23 and complete `knowledge-base-architecture.template.md` — write your first 10 articles
4. Go to Section 23 and complete `sla-definitions.template.md` — define basic response time targets
5. `omnichannel-decision-tree.md` — choose your first channel (just one)

**Defer until Level 2:**
- AI chatbot files — you do not have enough KB content to power a chatbot yet
- Health scoring — you do not have enough data or customers for this to be meaningful
- Team hiring/onboarding/QA — you do not have a team yet
- CX analytics dashboard — you do not have enough data sources to warrant a dashboard

### If You Are Level 2 (Structured)

**Priority — read and implement these next:**
1. `self-service-knowledge-center.template.md` — upgrade your basic KB to a proper self-service center
2. `ai-support-chatbot-blueprint.template.md` — design your chatbot architecture
3. `chatbot-training-data.template.md` — prepare training data from your existing KB and ticket history
4. `contextual-in-app-help.template.md` — add in-app guidance to reduce ticket volume at the source
5. `feedback-collection-system.template.md` — start collecting structured feedback
6. `nps-csat-automation.template.md` — deploy automated satisfaction surveys
7. `unified-inbox-architecture.template.md` — if adding a second channel, set up unified routing first

**Defer until Level 3:**
- Customer health scoring — wait until you have feedback data flowing
- QA scoring — wait until you have 3+ agents
- CX analytics dashboard — wait until you have 3+ data sources

### If You Are Level 3 (Proactive)

**Priority — read and implement these next:**
1. `customer-health-scoring.template.md` — build your health score model
2. `support-team-hiring.template.md` — formalize your hiring process as the team grows
3. `agent-onboarding-playbook.template.md` — structure new agent ramp-up
4. `qa-scoring-and-coaching.template.md` — implement systematic quality assurance
5. `cx-analytics-dashboard.template.md` — connect all your CX data sources into one view
6. `community-and-developer-portal.md` — add peer-to-peer support channels
7. `ticketing-system-decision-tree.md` — evaluate whether your current ticketing setup scales

**Defer until Level 4:**
- Nothing — if you are at Level 3, you should be working through every file in this section

### If You Are Level 4 (Predictive)

**Read everything.** At this level, you are refining and optimizing, not building from scratch. Focus on:
1. `cx-ops-gotchas.md` — production lessons that prevent regression
2. Any templates you have not fully implemented — close the gaps
3. Revisit `cx-maturity-assessment.md` quarterly to verify you have not regressed

---

## Decision Tree: What to Build First

Your starting point depends on three variables: team size, ticket volume, and product type. Use this decision tree to determine your first three implementation priorities after completing the maturity assessment.

### By Team Size

**Solo or < 3 people handling support:**
1. Self-service knowledge center — highest leverage when you cannot afford response delays
2. AI chatbot — automate the questions your KB can answer
3. Contextual in-app help — prevent tickets at the source
4. Skip: team hiring, onboarding, QA (you do not have a team to manage)
5. Skip: complex omnichannel routing (stick to one or two channels)

**3-10 people handling support:**
1. Unified inbox with routing rules — your team needs workflow, not chaos
2. QA scoring and coaching — quality diverges fast with 3+ agents and no standards
3. Agent onboarding playbook — every new hire without structured onboarding costs you 2-3 months of ramp time
4. NPS/CSAT automation — you now have enough volume for feedback data to be meaningful
5. Start: support team hiring rubrics for your next hires

**10+ people handling support:**
1. CX analytics dashboard — you cannot manage at scale without unified metrics
2. Customer health scoring — your account base is large enough for predictive models
3. Workforce management and scheduling — agent utilization becomes a real cost driver
4. Career development framework — retention of experienced agents matters at this scale
5. Community and developer portal — offload volume to peer-to-peer support

### By Monthly Ticket Volume

**< 50 tickets per month:**
- Focus on prevention over response. Every ticket you eliminate through better docs, in-app help, or UX fixes is a bigger win than optimizing your response workflow.
- Priorities: self-service knowledge center, contextual in-app help, basic chatbot
- Skip: complex routing, workforce management, health scoring (not enough data)

**50-500 tickets per month:**
- Focus on automation and efficiency. You have enough volume for patterns to emerge but not enough to justify a large team.
- Priorities: AI chatbot with RAG pipeline, unified inbox with routing, NPS/CSAT automation, feedback analysis
- Start: QA scoring (even informal), basic health scoring signals

**500+ tickets per month:**
- Focus on scalability and prediction. Manual approaches break at this volume.
- Priorities: advanced chatbot with continuous learning, customer health scoring, full CX analytics, team operations (hiring, onboarding, QA, coaching)
- Everything in this section becomes relevant at this volume

### By Product Type

**B2B SaaS:**
- Account-level health scoring is critical — one churned enterprise account can equal hundreds of churned consumer users in revenue impact
- Prioritize: customer health scoring, dedicated account support workflows, executive escalation paths
- NPS should be measured at the account level, not just the individual user level
- Build relationship-based support — named account managers for top-tier accounts

**B2C / Consumer:**
- Volume is high, margins per user are low, and self-service is non-negotiable
- Prioritize: AI chatbot, self-service knowledge center, automated feedback collection
- Optimize for deflection rate — every ticket that reaches a human agent eats into thin margins
- Community support (forums, user groups) provides enormous leverage at scale

**API / Developer Tool:**
- Developers self-serve by default and actively dislike chatbots that waste their time
- Prioritize: developer documentation portal, community forum, contextual code-level help
- Your chatbot needs to understand code — generic FAQ matching will frustrate technical users
- Build a developer portal with API reference, SDKs, example code, and a status page
- Feedback collection should include developer experience (DX) surveys, not just CSAT

**Marketplace / Platform:**
- You have two (or more) customer types: buyers and sellers, riders and drivers, hosts and guests
- Prioritize: separate support workflows per user type, unified inbox that routes by user role
- Health scoring needs separate models per side of the marketplace
- Trust and safety support is a distinct function from product support — plan for both
- Feedback collection must capture both sides — a 5-star buyer experience built on a 2-star seller experience is a ticking time bomb

---

## Prerequisites

Before starting any file in this section, verify the following from Section 23:

- [ ] **`23-customer-support/support-platform-decision-tree.md`** — Your support platform is chosen and provisioned. Every template in Section 33 assumes you have a platform to implement against. If you skip this, you will be designing workflows for a system you have not selected.
- [ ] **`23-customer-support/knowledge-base-architecture.template.md`** — Your KB structure is designed and your first batch of articles exists. The AI chatbot and self-service knowledge center in this section build on top of your KB content. No content, no chatbot.
- [ ] **`23-customer-support/sla-definitions.template.md`** — Your SLA targets are defined by tier. The routing rules, QA scoring criteria, and analytics dashboards in this section reference your SLA targets. Undefined SLAs mean your automation has no targets to enforce.
- [ ] **`23-customer-support/support-escalation-workflow.md`** — Your escalation model (L1/L2/L3) is defined. The unified inbox routing, agent onboarding, and QA scoring in this section assume a tiered support model. If your escalation paths are undefined, your routing rules will have nowhere to route to.

If you have not completed these prerequisites, go to Section 23 first. Attempting to operationalize a support system that has not been strategically planned is how teams end up rebuilding everything six months later.
