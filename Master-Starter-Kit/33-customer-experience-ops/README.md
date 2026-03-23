# Phase 33: Customer Experience Operations

> Strategy without execution is a hallucination. This section turns the support strategy from Section 23 into running infrastructure — AI chatbots, self-service portals, omnichannel routing, health scoring, and the team that operates all of it.

---

## Why This Exists

Section 23 answers "what should our support system look like?" Section 33 answers "how do we actually build and run it." The distinction matters because planning and operations require fundamentally different thinking. Section 23 helps you choose Zendesk vs. Intercom, define SLA targets, and design escalation tiers. Section 33 helps you build the RAG pipeline that powers your AI chatbot, architect the self-service knowledge center UX, configure omnichannel conversation routing, and hire the team that keeps all of it running at 2 AM when a P0 incident spikes ticket volume by 400%. Teams that conflate planning with operations end up with beautiful strategy documents and broken customer experiences. This section exists to close that gap.

The operational layer is where CX complexity actually lives. Choosing to deploy an AI chatbot is a one-paragraph decision. Building one that does not hallucinate your pricing, gracefully escalates to humans when confidence drops below threshold, and continuously improves from conversation feedback is a multi-month engineering effort with dozens of failure modes. Deciding to offer multi-channel support is a checkbox. Routing conversations from email, chat, social, and in-app into a unified inbox with priority scoring, agent skill matching, and SLA-aware queue management is an architecture problem. Defining a CSAT target is easy. Building the survey trigger logic, follow-up automation, and closed-loop alerting that actually moves the number requires careful instrumentation. This section covers the hard part — the implementation details that strategy documents skip.

Customer experience operations is also where the team dimension becomes critical. Section 23 assumes someone is handling support. Section 33 addresses who that someone is, how you find them, how you train them, how you measure their performance, and how you prevent burnout in a role with one of the highest turnover rates in tech. A support agent who has been through a structured 30-day onboarding program with shadowing, live mentoring, and graduated ticket difficulty resolves tickets 3x faster and stays 2x longer than one who was handed a login and told to figure it out. The team operations files in this section are not HR paperwork — they are the operational backbone that determines whether your CX investment compounds or collapses.

---

## How It Integrates with the Orchestrator

This section is triggered by **Step 18.7.5** in the Orchestrator, where customer experience operations are built on top of the strategic decisions made in Step 18.7. Operational implementation happens after support strategy (Section 23) is finalized, because you need platform decisions, SLA definitions, and escalation models locked before you can build the systems that enforce them.

**Relationship with Section 23 (Customer Support Infrastructure):** Section 23 is the strategic layer. Section 33 is the operational layer. Section 23 helps you choose a support platform and define SLA targets. Section 33 helps you configure the routing rules inside that platform, build the AI chatbot that deflects 40% of tickets before they reach an agent, and set up the QA scoring rubric that ensures your agents actually meet those SLA targets. Every template in Section 33 assumes the corresponding strategic decision from Section 23 has already been made. If you skip Section 23, you will be making implementation decisions without a strategy — which is how teams end up rebuilding their entire support stack six months after launch.

**Relationship with Section 24 (AI/ML Integration):** Section 24 covers generic RAG pipeline architecture, LLM provider selection, embedding strategies, and prompt engineering patterns. Section 33 applies those patterns specifically to customer support — building the retrieval layer against your knowledge base, tuning confidence thresholds for human escalation, designing conversation memory for multi-turn support interactions, and structuring training data evaluation. If Section 24 is the AI toolbox, Section 33 is the AI toolbox applied to the specific problem of answering customer questions accurately without hallucinating your refund policy.

**Relationship with Section 18 (User Documentation):** Your documentation standards from Section 18 directly feed into the self-service knowledge center designed here. The content structure, writing style, and information architecture of your docs determine the quality of your help center. The knowledge center template in this section references Section 18's documentation framework and extends it with search UX, content lifecycle management, and gap analysis instrumentation.

**Relationship with Section 19 (Marketing & Growth):** CRM data from Section 19 overlaps with the customer health scoring system defined here. Marketing communication preferences, lifecycle stage, and engagement data are inputs to the health score model. The feedback collection system here also generates insights that inform marketing messaging — when customers consistently praise or complain about specific features, marketing should know.

**Relationship with Section 20 (Post-Launch Operations):** Post-launch feedback loops from Section 20 connect directly to the customer health scoring and feedback collection systems in this section. Recurring support themes identified here should feed into the post-launch iteration roadmap. The CX analytics dashboard defined here provides the support-specific KPIs that roll up into Section 20's operational dashboard.

**Relationship with Section 25 (Financial Modeling):** Churn has a dollar value. The customer health scoring system in this section identifies at-risk accounts and triggers intervention workflows. Section 25's financial models quantify the revenue impact of churn, which informs how aggressively you invest in retention automation. The two sections should be calibrated together — your health score thresholds should reflect the financial cost of losing customers at each tier.

---

## Files in This Section

| File | Type | Purpose | Orchestrator Step |
|------|------|---------|-------------------|
| `README.md` | Guide | Overview and reading order for customer experience operations | 18.7.5 |
| `cx-maturity-assessment.md` | Guide | CX maturity model and prioritization decision tree | 18.7.5 |
| `ai-support-chatbot-blueprint.template.md` | Template | Full AI chatbot implementation blueprint with RAG pipeline | 18.7.5 |
| `chatbot-training-data.template.md` | Template | Training data preparation, curation, and evaluation | 18.7.5 |
| `self-service-knowledge-center.template.md` | Template | Help center portal architecture, search UX, content lifecycle | 18.7.5 |
| `contextual-in-app-help.template.md` | Template | Tooltips, walkthroughs, interactive troubleshooters | 18.7.5 |
| `community-and-developer-portal.md` | Guide | Community forum, video tutorials, developer docs portal | 18.7.5 |
| `omnichannel-decision-tree.md` | Guide | Adaptive channel selection and notification strategy | 18.7.5 |
| `unified-inbox-architecture.template.md` | Template | Unified conversation routing and channel integration | 18.7.5 |
| `ticketing-system-decision-tree.md` | Guide | Build-custom vs. integrate-existing ticketing system | 18.7.5 |
| `feedback-collection-system.template.md` | Template | Survey design, trigger logic, feedback aggregation | 18.7.5 |
| `nps-csat-automation.template.md` | Template | NPS/CSAT/CES automation, follow-up flows, alerting | 18.7.5 |
| `customer-health-scoring.template.md` | Template | Health score model, churn prediction, intervention workflows | 18.7.5 |
| `support-team-hiring.template.md` | Template | Role definitions, job descriptions, interview rubrics | 18.7.5 |
| `agent-onboarding-playbook.template.md` | Template | 30-day structured onboarding program | 18.7.5 |
| `qa-scoring-and-coaching.template.md` | Template | QA rubrics, coaching, performance management, scheduling | 18.7.5 |
| `cx-analytics-dashboard.template.md` | Template | Unified CX analytics, funnel metrics, executive reporting | 18.7.5 |
| `cx-ops-gotchas.md` | Guide | Production lessons for customer experience operations | 18.7.5 |

---

## Reading Order

1. **`cx-maturity-assessment.md`** — Start here. Assess your current CX maturity level so you know which files to prioritize and which to defer. A two-person startup and a 50-person scale-up need completely different things from this section.
2. **`ai-support-chatbot-blueprint.template.md`** — Design your AI chatbot architecture. This is the highest-leverage CX investment — a well-built chatbot deflects 30-50% of tickets from day one and improves continuously.
3. **`chatbot-training-data.template.md`** — Prepare and curate the training data that powers your chatbot. Garbage in, hallucinations out. This file determines whether your chatbot helps or harms.
4. **`self-service-knowledge-center.template.md`** — Architect your help center. This is the content layer your chatbot retrieves from and the destination for users who prefer to self-serve.
5. **`contextual-in-app-help.template.md`** — Design in-app guidance that intercepts confusion before it becomes a ticket. Tooltips, walkthroughs, and embedded troubleshooters reduce support volume at the source.
6. **`community-and-developer-portal.md`** — Plan peer-to-peer support channels and developer resources. Community scales support horizontally without adding headcount.
7. **`omnichannel-decision-tree.md`** — Decide which channels to support and how to route between them. Adding a channel you cannot staff is worse than not offering it.
8. **`unified-inbox-architecture.template.md`** — Configure your conversation routing engine. This determines how tickets flow from channels to agents with the right context attached.
9. **`ticketing-system-decision-tree.md`** — Decide whether to build custom ticketing or integrate an existing system. Most teams should integrate; this file helps you confirm that.
10. **`feedback-collection-system.template.md`** — Set up the instrumentation that captures customer sentiment. You cannot improve CX without systematic feedback collection.
11. **`nps-csat-automation.template.md`** — Automate your satisfaction surveys with smart trigger logic. Manual survey sends have abysmal response rates; event-driven triggers get 5-10x more data.
12. **`customer-health-scoring.template.md`** — Build the predictive model that identifies at-risk accounts before they churn. This connects usage data, support data, and billing data into a single health signal.
13. **`support-team-hiring.template.md`** — Define roles, write job descriptions, and build interview rubrics. Hiring the wrong support agent costs you 3-6 months of ramp time and damages customer relationships.
14. **`agent-onboarding-playbook.template.md`** — Structure the first 30 days for new support agents. Unstructured onboarding is the primary driver of early attrition in support roles.
15. **`qa-scoring-and-coaching.template.md`** — Build the quality assurance system that keeps your team sharp. Without QA, response quality drifts silently until a customer escalation forces you to notice.
16. **`cx-analytics-dashboard.template.md`** — Configure the unified dashboard that connects all CX metrics. This is your operational cockpit for identifying trends, spotting regressions, and reporting to leadership.
17. **`cx-ops-gotchas.md`** — Read last. These production lessons will resonate more after you understand the full CX operations framework.

---

## Quick Start Checklist

- [ ] Complete the CX maturity self-assessment and identify your current level
- [ ] Verify Section 23 strategic decisions are finalized (platform, SLAs, escalation model)
- [ ] Design your AI chatbot RAG pipeline and define confidence thresholds for human handoff
- [ ] Prepare initial chatbot training data from existing documentation and historical tickets
- [ ] Architect the self-service knowledge center with search, categories, and content lifecycle
- [ ] Choose which support channels to offer based on team capacity and user preferences
- [ ] Configure unified inbox routing rules with priority scoring and skill-based assignment
- [ ] Deploy NPS/CSAT surveys with event-driven triggers on key support interactions
- [ ] Build your customer health score model with at least 5 input signals
- [ ] Define support team roles and publish job descriptions with interview rubrics
- [ ] Create a 30-day onboarding playbook for new support agents
- [ ] Set up QA scoring rubrics and schedule weekly calibration sessions
- [ ] Configure the CX analytics dashboard with real-time alerting on critical thresholds
- [ ] Establish a monthly CX review cadence with cross-functional stakeholders

---

## Key Principles

**Strategy is cheap; operations is where you earn it.** Section 23 gives you the plan. This section gives you the implementation. A brilliant support strategy with poor operational execution delivers worse CX than a mediocre strategy with excellent execution. Prioritize running systems over polished documents.

**Automate before you hire.** Every support interaction that can be resolved by a chatbot, a KB article, or an in-app tooltip is an interaction that does not require a human. Build your automation layer first, then hire agents to handle the cases that genuinely require human judgment. The inverse approach — hiring agents first and automating later — creates organizational resistance to automation because agents perceive it as a threat.

**Instrument everything from day one.** You cannot improve what you do not measure, and you cannot measure what you did not instrument. Every channel, every survey, every chatbot interaction, every agent response should emit structured events that feed into your analytics pipeline. Retrofitting instrumentation into a running support system is 10x harder than building it in from the start.

**Customer health is a leading indicator; churn is a lagging one.** By the time a customer churns, you have already lost. Health scoring exists to identify at-risk accounts weeks or months before cancellation, giving you time to intervene. If your health score does not predict churn with at least moderate accuracy, your input signals are wrong.

**QA is not punishment; it is coaching.** Support agents who feel surveilled perform worse, not better. Frame QA as a growth tool — identify strengths to reinforce and gaps to close. The best QA programs make agents want feedback because they see it improving their skills and reducing their stress on difficult tickets.

**Omnichannel means unified, not fragmented.** Offering five support channels with five separate conversation histories is worse than offering one channel well. Every channel should feed into a single unified inbox with full context. If a customer emails, then chats, then tweets, the agent handling the tweet should see the entire conversation history without asking the customer to repeat anything.

---

## Placeholder Variables Used in This Section

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{PROJECT_NAME}}` | Product or project display name | `Fleet Manager`, `Acme SaaS` |
| `{{CX_MATURITY_LEVEL}}` | Current CX maturity level | `reactive`, `structured`, `proactive`, `predictive` |
| `{{CX_TEAM_SIZE}}` | Number of support team members | `2`, `8`, `25` |
| `{{CX_CHANNELS}}` | Active support channels | `email, chat`, `email, chat, phone, social` |
| `{{CX_CHATBOT_PROVIDER}}` | AI chatbot platform or framework | `openai-assistants`, `custom-rag`, `intercom-fin` |
| `{{CX_LLM_MODEL}}` | LLM model used for chatbot | `gpt-4o`, `claude-3-sonnet`, `gemini-pro` |
| `{{CX_EMBEDDING_MODEL}}` | Embedding model for RAG retrieval | `text-embedding-3-small`, `voyage-3` |
| `{{CX_VECTOR_STORE}}` | Vector database for chatbot retrieval | `pinecone`, `weaviate`, `pgvector` |
| `{{CX_CONFIDENCE_THRESHOLD}}` | Chatbot confidence threshold for human handoff | `0.75`, `0.85` |
| `{{CX_KNOWLEDGE_CENTER_URL}}` | Self-service help center URL | `https://help.example.com` |
| `{{CX_COMMUNITY_URL}}` | Community forum URL | `https://community.example.com` |
| `{{CX_TICKETING_SYSTEM}}` | Ticketing system in use | `zendesk`, `linear`, `custom` |
| `{{CX_UNIFIED_INBOX}}` | Unified inbox platform | `intercom`, `front`, `missive` |
| `{{CX_NPS_TOOL}}` | NPS/CSAT survey tool | `delighted`, `typeform`, `custom` |
| `{{CX_NPS_FREQUENCY}}` | NPS survey send frequency | `quarterly`, `post-resolution`, `30-day` |
| `{{CX_CSAT_TARGET}}` | CSAT target score | `4.5/5`, `90%` |
| `{{CX_HEALTH_SCORE_SIGNALS}}` | Inputs to customer health score | `usage, tickets, nps, billing, engagement` |
| `{{CX_CHURN_THRESHOLD}}` | Health score threshold triggering intervention | `40`, `30` |
| `{{CX_QA_FREQUENCY}}` | QA review frequency | `weekly`, `bi-weekly` |
| `{{CX_QA_SAMPLE_SIZE}}` | Number of tickets reviewed per QA cycle | `5 per agent`, `10%` |
| `{{CX_ONBOARDING_DURATION}}` | New agent onboarding period | `30 days`, `6 weeks` |
| `{{CX_FIRST_RESPONSE_SLA}}` | First response time target | `1 hour`, `4 hours` |
| `{{CX_RESOLUTION_SLA}}` | Full resolution time target | `24 hours`, `48 hours` |
| `{{CX_SELF_SERVE_TARGET}}` | Target self-service resolution rate | `60%`, `75%` |
| `{{CX_ANALYTICS_TOOL}}` | CX analytics/dashboard platform | `metabase`, `looker`, `custom` |
