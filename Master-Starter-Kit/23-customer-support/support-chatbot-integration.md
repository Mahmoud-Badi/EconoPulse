# Support Chatbot Integration

> **Purpose:** Evaluate AI chatbot patterns, choose a provider or build custom, and design conversation flows that resolve issues without frustrating users.
> **Used in:** Orchestrator Step 18.7 (Customer Support Infrastructure)
> **Prerequisite:** Knowledge base must exist first. A chatbot without content is a chatbot that says "I don't know" repeatedly.

---

## Why Chatbots Matter for Support

A well-implemented support chatbot resolves 30-50% of incoming queries without human intervention. That is not a futuristic promise — it is what Intercom Fin, Zendesk AI, and custom bots built on modern LLMs achieve today. The math is straightforward: if you get 100 tickets per week and a bot resolves 40 of them, that is 40 fewer tickets your human team handles. At an average cost of $5-15 per human-handled ticket, a bot that resolves 40 tickets per week saves $10,000-30,000 per year.

But a badly implemented chatbot is worse than no chatbot at all. Users who get stuck in bot loops, receive irrelevant answers, or cannot reach a human become more frustrated than if they had simply waited for a human reply. The key is designing the bot as a helpful first responder, not a gatekeeper.

---

## AI Chatbot Patterns

### Pattern 1: FAQ Bot

> Answers common questions by matching intent to pre-written responses.

**How it works:**
1. User asks a question in the chat widget
2. Bot matches the question to a predefined FAQ entry (keyword matching or ML intent classification)
3. Bot returns the pre-written answer
4. Bot asks "Was this helpful?" and offers escalation to a human if not

**Best for:** Products with a small, stable set of frequently asked questions (under 50 distinct FAQs).

**Strengths:**
- Simple to build and maintain
- Answers are 100% controlled — no hallucination risk
- Fast response time
- Works without any AI/ML infrastructure

**Weaknesses:**
- Brittle — cannot handle phrasing variations well (unless using ML intent matching)
- Scales poorly as question variety grows
- Cannot answer multi-step or follow-up questions
- Users quickly feel the limitations

**Implementation:** Most support platforms (Intercom, Crisp, Zendesk) include a no-code FAQ bot builder. No custom development required.

---

### Pattern 2: Documentation Search Bot

> Performs semantic search over your knowledge base and returns relevant article sections.

**How it works:**
1. User asks a question
2. Bot converts the question to a vector embedding
3. Bot searches your KB embeddings for the most relevant sections
4. Bot returns the top 1-3 matching article excerpts with links
5. Bot asks "Did this answer your question?" and escalates if not

**Best for:** Products with a comprehensive knowledge base (50+ articles) where most questions are covered by existing documentation.

**Strengths:**
- Handles phrasing variations naturally (semantic search, not keyword matching)
- Scales with KB size — more articles = more coverage
- Drives users to your KB, training them to self-serve
- Low hallucination risk (returns real article content, not generated answers)

**Weaknesses:**
- Quality depends entirely on KB quality — garbage in, garbage out
- Returns article links rather than direct answers (extra click for the user)
- Cannot handle questions not covered by the KB
- Requires vector embedding infrastructure

**Implementation:** Intercom Fin and Zendesk AI do this natively. For custom: embed your KB articles with OpenAI/Voyage embeddings, store in a vector DB (Pinecone, Weaviate, pgvector), and query on user input.

---

### Pattern 3: Triage Bot

> Collects structured information from the user, categorizes the issue, and routes it to the right team.

**How it works:**
1. User initiates a conversation
2. Bot greets the user and asks: "What can I help you with?" (with category buttons or free text)
3. Based on the category, bot collects required fields:
   - Bug report: steps to reproduce, expected vs. actual behavior, environment, screenshots
   - Feature request: description, use case, priority
   - Billing: account email, plan, specific question
   - Account issue: account email, description of problem
4. Bot creates a structured ticket with all collected information
5. Bot routes the ticket to the correct team/queue
6. Bot tells the user their expected response time (based on SLA)

**Best for:** Teams receiving diverse ticket types that require different handling and routing.

**Strengths:**
- Every ticket arrives with complete context — no back-and-forth
- Automatic categorization and routing saves agent time
- Users get immediate acknowledgment and SLA expectations
- Structured data enables better analytics and reporting

**Weaknesses:**
- Users sometimes find form-like conversations annoying
- Requires careful conversation design to avoid feeling robotic
- Cannot resolve issues — only collects and routes
- Maintenance burden increases as product complexity grows

**Implementation:** All major support platforms offer bot builders for triage flows. Custom implementation with a simple decision tree is also straightforward.

---

### Pattern 4: Handoff Bot

> Attempts resolution first, then gracefully escalates to a human when confidence is low or the user requests it.

**How it works:**
1. User asks a question
2. Bot attempts to answer using KB search or FAQ matching
3. If confidence is high (>80%): bot provides the answer and asks for confirmation
4. If confidence is low (<80%): bot says "I'm not confident I have the right answer — let me connect you with a team member"
5. If user says "talk to a human" at any point: bot immediately escalates
6. On escalation: bot passes full conversation context to the human agent

**Best for:** Most products. This is the most balanced pattern — it tries to help but does not trap users.

**Strengths:**
- Best user experience — helpful when it can be, transparent when it cannot
- Humans only see tickets the bot could not resolve
- Full conversation context is passed during handoff
- Users feel respected, not gatekept

**Weaknesses:**
- Requires confidence scoring (not all platforms support this well)
- Needs careful threshold tuning — too aggressive = bad answers, too conservative = too many handoffs
- More complex to implement than simpler patterns

**Implementation:** Intercom Fin does this natively. For custom: use an LLM with retrieval-augmented generation (RAG), include a confidence score in the prompt, and define handoff thresholds.

---

## Provider Options

### Platform-Native AI

| Platform | AI Feature | Resolution Rate | Cost |
|----------|-----------|-----------------|------|
| Intercom | Fin AI Agent | 30-50% (reported) | $0.99/resolution |
| Zendesk | AI Agents | 20-40% (reported) | Included in Suite plans |
| Crisp | MagicReply | 15-25% (estimated) | Included in Unlimited plan |
| HelpScout | AI Drafts | Agent-assist only (not customer-facing) | Included |

**Recommendation:** If you already use Intercom or Zendesk, use their built-in AI first. It requires zero custom development and leverages your existing KB content.

### Custom Bot (Build Your Own)

**When to build custom:**
- You need full control over the AI model and behavior
- Your use case requires multi-step reasoning beyond simple KB retrieval
- You want to integrate with internal systems (user accounts, product data, billing)
- Platform-native AI does not meet your quality standards
- You want to avoid per-resolution pricing at scale

**Architecture:**

```
User Message
    |
    v
[Intent Classification]
    |
    +--> FAQ? --> Return pre-written answer
    |
    +--> KB Question? --> Vector search over KB --> LLM generates answer --> Return with source links
    |
    +--> Account-specific? --> Fetch user data from API --> LLM generates personalized answer
    |
    +--> Bug report? --> Triage flow (collect info, create ticket)
    |
    +--> Low confidence / "talk to human" --> Handoff to agent with full context
```

**Tech Stack for Custom Bot:**

| Component | Options |
|-----------|---------|
| LLM | Claude API, OpenAI GPT-4, open-source (Llama, Mistral) |
| Embedding model | OpenAI text-embedding-3-small, Voyage, Cohere |
| Vector database | Pinecone, Weaviate, Qdrant, pgvector (PostgreSQL) |
| Orchestration | LangChain, LlamaIndex, or custom pipeline |
| Chat widget | Your support platform widget, or custom (React component) |
| Monitoring | LangSmith, Helicone, or custom logging |

**Build Steps:**

1. **Embed your KB.** Convert every KB article into vector embeddings. Store in a vector DB. Update embeddings whenever articles change.
2. **Build the retrieval pipeline.** On user query, generate an embedding, find the top 5 most similar KB chunks, pass them as context to the LLM.
3. **Prompt the LLM.** System prompt: "You are a support agent for [product]. Answer the user's question using ONLY the provided knowledge base context. If the context does not contain the answer, say 'I do not have enough information to answer that — let me connect you with our team.' Never make up information."
4. **Add confidence scoring.** Ask the LLM to rate its confidence (1-10) or use embedding similarity scores as a proxy. Define a threshold for human handoff.
5. **Implement handoff.** When confidence is below threshold or user requests a human, pass the full conversation to your support platform via API.
6. **Monitor and iterate.** Log every conversation. Review bot answers weekly. Track resolution rate, handoff rate, and user satisfaction.

---

## Conversation Design Patterns

### Greeting

```
Hi! I'm the [Your Product] support assistant. I can help with common questions,
troubleshooting, and account issues.

What can I help you with?

[Getting Started]  [I have a bug]  [Billing question]  [Something else]
```

**Design notes:**
- Set expectations immediately — the user should know they are talking to a bot
- Offer category buttons to reduce ambiguity
- Include a free-text option for users who do not fit a category

### Clarification Questions

```
User: "It's not working"

Bot: I'd like to help! Can you tell me a bit more about what's happening?
- What were you trying to do?
- What did you see instead of the expected result?
- Which browser or device are you using?
```

**Design notes:**
- Never respond to vague questions with vague answers
- Ask specific, structured questions
- Limit to 2-3 questions per turn to avoid overwhelming the user

### Answer with Confirmation

```
Bot: Based on your question, here's how to export your data:

1. Go to Settings > Data Management
2. Click "Export All Data"
3. Choose CSV or JSON format
4. Your export will be emailed to you within 5 minutes

Source: [How to export your data](link)

Did this answer your question?

[Yes, thanks!]  [No, I need more help]
```

**Design notes:**
- Always provide the source link
- Always ask for confirmation
- Make it easy to escalate with a single click

### Escalation to Human

```
Bot: I want to make sure you get the right help. Let me connect you with a team member
who can look into this.

I've shared our conversation so you won't need to repeat anything.

Expected response time: within [your SLA target].

[A support agent will be with you shortly.]
```

**Design notes:**
- Never make the user repeat themselves
- Set clear expectations for response time
- Acknowledge the transition explicitly

---

## Metrics to Track

| Metric | Target | Description |
|--------|--------|-------------|
| Bot resolution rate | >40% | % of conversations resolved by bot without human |
| Handoff rate | <60% | % of conversations escalated to human |
| User satisfaction (bot) | >75% CSAT | "Was this helpful?" rating on bot answers |
| False positive rate | <5% | % of conversations where bot gave a wrong answer |
| Time to resolution (bot) | <2 minutes | Average time for bot-resolved conversations |
| Escalation wait time | <5 minutes | Time between handoff request and human pickup |
| Conversation abandonment | <15% | % of users who leave without resolution or escalation |
| Cost per bot resolution | <$0.50 | Infrastructure cost per bot-resolved conversation |

---

## Anti-Patterns to Avoid

### 1. Bot Loops

**Symptom:** User asks the same question in different ways, bot gives the same unhelpful answer each time, neither party gives up.

**Fix:** After 2 failed attempts (user says answer was not helpful twice), automatically escalate. Never make a user ask more than twice.

### 2. No Escalation Path

**Symptom:** User wants a human, bot keeps trying to help, there is no "talk to a human" button.

**Fix:** Always include an escape hatch. "Talk to a human" should work at any point in any conversation. This is non-negotiable.

### 3. Bot Pretending to Be Human

**Symptom:** Bot uses a human name and avatar, does not disclose it is automated, user feels deceived when they find out.

**Fix:** Always identify the bot as automated in the first message. Users are fine with bots — they are not fine with deception. "I'm [Product] Support Bot" is better than "Hi, I'm Sarah!"

### 4. Answering Questions It Should Not

**Symptom:** Bot makes up billing information, promises features that do not exist, or gives incorrect technical instructions because it hallucinated.

**Fix:** Ground the bot strictly in your KB. If the answer is not in the KB, the bot must say "I don't know" and escalate. Use retrieval-augmented generation (RAG), not pure generation.

### 5. Over-Collecting Information

**Symptom:** Bot asks 8 questions before providing any help. User abandons the conversation.

**Fix:** Ask only what is necessary. For simple questions, answer immediately. For bug reports, collect info incrementally — ask the most important questions first, and let the user skip optional fields.

### 6. Ignoring Emotional Context

**Symptom:** User writes "I'm really frustrated, this has been broken for 3 days" and bot responds with a cheerful "Here are some articles that might help!"

**Fix:** Add sentiment detection. When negative sentiment is detected, acknowledge the frustration first ("I understand this is frustrating — let me help"), then offer solutions or escalate.

---

## Implementation Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| **Phase 1: KB Foundation** | Week 1-2 | Build and publish knowledge base with 20+ articles |
| **Phase 2: Basic Bot** | Week 3 | Deploy FAQ bot or platform-native AI with KB integration |
| **Phase 3: Triage** | Week 4 | Add triage flows for bug reports, billing, and account issues |
| **Phase 4: Monitor** | Week 5-8 | Track metrics, review conversations, tune confidence thresholds |
| **Phase 5: Optimize** | Ongoing | Fill KB gaps based on bot failures, improve conversation design |
| **Phase 6: Custom (if needed)** | Week 8-12 | Build custom RAG bot if platform-native AI is insufficient |
