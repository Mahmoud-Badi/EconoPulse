# AI Chatbot for Lead Capture and Qualification — {{PROJECT_NAME}}

> Design and implement a chatbot that engages website visitors, qualifies leads, and routes them to the right next step -- all while providing genuine value.

---

## Chatbot Use Cases

A website chatbot serves multiple functions. Define which use case is primary before building.

| Use Case | Goal | Typical Trigger | Success Metric |
|----------|------|----------------|---------------|
| **Visitor engagement** | Convert anonymous visitors into known contacts | Time on page (10-30 sec), scroll depth (50%+) | Conversation start rate |
| **Lead qualification** | Identify high-intent visitors and route to sales | Pricing page visit, demo page visit | Qualified lead rate |
| **FAQ handling** | Answer common questions without human support | Support page visit, confused behavior | Deflection rate |
| **Demo/meeting booking** | Get qualified prospects directly onto calendar | High-intent pages | Booking rate |
| **Product guidance** | Help visitors find the right product/plan | Product or pricing page | Conversion to signup |
| **Support triage** | Categorize and route support requests | Existing customer logged in | First-response time |

**Primary use case for {{PROJECT_NAME}}:** {{PRIMARY_CHATBOT_USE_CASE}}

---

## Chatbot Types

### Rule-Based (Decision Tree)

```
Pros:                              Cons:
+ Predictable behavior             - Cannot handle unexpected questions
+ Easy to build and maintain       - Feels rigid and mechanical
+ No AI costs                      - Limited to pre-defined paths
+ Fast response times              - Maintenance scales linearly with scope

Best for: Simple qualification flows, FAQ bots, booking flows
Tools: Typeform chat, Landbot, ManyChat, Chatfuel
```

### AI-Powered (LLM-Based)

```
Pros:                              Cons:
+ Handles any question naturally   - Can hallucinate or go off-script
+ Feels conversational             - Higher latency (1-3 seconds)
+ Scales to unlimited topics       - Requires careful prompt engineering
+ Learns from conversations        - Monthly API costs

Best for: Complex support, nuanced qualification, large FAQ sets
Tools: Custom (OpenAI/Claude API + UI), Intercom Fin, Drift AI
```

### Hybrid (Recommended)

```
Use decision-tree flows for structured paths (qualification, booking)
Use AI for free-form questions and FAQ handling
Route to human when confidence is low or request is complex

This gives you the best of both worlds: predictable qualification
with flexible conversation handling.
```

---

## Conversation Flow Design for Lead Capture

### Flow Diagram

```
[Visitor lands on page]
        |
        v (after 10-30 second delay)
[Greeting message appears]
        |
        v
[Visitor responds or clicks quick reply]
        |
        ├──→ "I have a question" → [FAQ / AI response]
        |                                    |
        |                          [Solved?] ├── Yes → [Offer to learn more]
        |                                    └── No  → [Route to human]
        |
        ├──→ "I want to see a demo" → [Qualification questions]
        |                                    |
        |                          [Qualified?] ├── Yes → [Book demo]
        |                                       └── No  → [Nurture content]
        |
        ├──→ "Just browsing" → [Soft engagement]
        |                           |
        |                    [Share helpful resource]
        |                           |
        |                    [Capture email for resource]
        |
        └──→ "I need support" → [Existing customer?]
                                      |
                              ├── Yes → [Support triage]
                              └── No  → [Redirect to sales flow]
```

### Conversation Scripts

**Greeting (First message)**
```
Bot: Hi! I am [BOT_NAME] from {{PROJECT_NAME}}. 👋

     How can I help you today?

     [I have a question]
     [I want to see a demo]
     [Just browsing]
     [I need support]
```

**Design notes for greeting:**
- Delay 10-30 seconds after page load (do not ambush visitors)
- On pricing/demo pages, delay only 5-10 seconds (higher intent)
- Use quick-reply buttons for common paths (reduces friction)
- Keep greeting under 2 sentences
- Make the bot name clear (visitors should know it is a bot)

### Lead Qualification Questions

When a visitor expresses interest in a demo or purchase, qualify them with 3-5 questions.

```
Bot: Great! I would love to set you up with a demo.
     Let me ask a few quick questions so I can connect you
     with the right person.

Question 1: Use Case
Bot: What are you looking to accomplish with {{PROJECT_NAME}}?
     [{{USE_CASE_1}}]
     [{{USE_CASE_2}}]
     [{{USE_CASE_3}}]
     [Something else]

Question 2: Company Size
Bot: How large is your team?
     [Just me]
     [2-10 people]
     [11-50 people]
     [51-200 people]
     [200+ people]

Question 3: Timeline
Bot: When are you looking to get started?
     [Immediately]
     [Within a month]
     [Within a quarter]
     [Just exploring]

Question 4: Current Solution
Bot: What are you using for this today?
     [Nothing — starting from scratch]
     [Spreadsheets / manual process]
     [{{COMPETITOR_1}}]
     [{{COMPETITOR_2}}]
     [Other tool]

Question 5: Contact Info
Bot: Perfect! Let me connect you with our team.
     What is the best email to reach you?
     [Email input field]

     And your name?
     [Name input field]
```

### Routing Logic

```
QUALIFICATION SCORING:

Company size:
  Just me = 1 point
  2-10 = 2 points
  11-50 = 3 points
  51-200 = 4 points
  200+ = 5 points

Timeline:
  Just exploring = 1 point
  Within a quarter = 2 points
  Within a month = 3 points
  Immediately = 4 points

Use case match:
  Core use case = 3 points
  Adjacent use case = 2 points
  Poor fit = 0 points

TOTAL SCORE → ROUTING:

10-12 points: HOT LEAD
  → Book demo immediately (show calendar)
  → Alert sales team in real-time (Slack/email)
  → Add to CRM with "hot" priority

6-9 points: WARM LEAD
  → Offer demo booking or content download
  → Add to email nurture sequence
  → Add to CRM with "warm" priority

1-5 points: COOL LEAD
  → Share relevant content (guide, case study)
  → Add to email nurture sequence (longer cadence)
  → Add to CRM with "cool" priority

0 points: NOT A FIT
  → Politely redirect to resources
  → Do not add to sales pipeline
```

### Decision Tree Template for {{PROJECT_NAME}}

```
{{PROJECT_NAME}} Chatbot Decision Tree

ENTRY POINTS:
- Homepage (general greeting, 20-second delay)
- Pricing page (demo-focused, 10-second delay)
- Blog/content (content offer, 30-second delay)
- Help/support (support routing, 5-second delay)

PATHS:
Path A: Lead qualification → Demo booking
  Trigger: {{TRIGGER_A}}
  Questions: {{QUESTIONS_A}}
  Qualified action: {{ACTION_A}}
  Unqualified action: {{FALLBACK_A}}

Path B: FAQ handling → Lead capture
  Trigger: {{TRIGGER_B}}
  AI/KB response: {{RESPONSE_SOURCE_B}}
  Capture point: {{CAPTURE_B}}

Path C: Content offer → Email capture
  Trigger: {{TRIGGER_C}}
  Offer: {{CONTENT_OFFER_C}}
  Form: {{FORM_C}}

Path D: Support routing → Triage
  Trigger: {{TRIGGER_D}}
  Routing: {{ROUTING_D}}
```

---

## Implementation Options

### No-Code Chat Widget Platforms

| Platform | Starting Price | Key Features | Best For |
|----------|---------------|-------------|----------|
| **Intercom** | $39/mo | Chat + AI (Fin), qualification, help center | Full-featured customer platform |
| **Drift** | Custom pricing | Revenue acceleration, ABM targeting | B2B sales-led growth |
| **Crisp** | Free tier, $25/mo paid | Chat, chatbot builder, shared inbox | Budget-friendly all-in-one |
| **Tidio** | Free tier, $29/mo paid | Chat + AI, visual bot builder | E-commerce and small business |
| **HubSpot Chat** | Free (with HubSpot CRM) | Chat, bots, CRM integration | HubSpot ecosystem users |
| **Tawk.to** | Free (forever) | Live chat, basic bot, ticketing | Zero-budget startups |
| **Chatwoot** | Free (open source) | Self-hosted, multi-channel | Privacy-conscious teams |

### AI-Powered Custom Implementation

Build a custom chatbot using an LLM API and a chat UI.

```
Architecture:

[Chat Widget (frontend)]
        |
        v
[Your API server]
        |
        ├── [LLM API (Claude/OpenAI)] ← System prompt + conversation history
        |
        ├── [Knowledge Base / FAQ data] ← RAG for accurate answers
        |
        ├── [CRM Integration] ← Lead data storage
        |
        └── [Calendar API] ← Demo booking
```

**Custom build considerations:**
- **Pros:** Full control, no per-seat pricing, custom data handling
- **Cons:** Development time (2-4 weeks minimum), maintenance burden
- **When to build custom:** When you need deep product integration, custom qualification logic, or want to avoid per-seat SaaS costs at scale
- **When to use a platform:** When you want to launch in days, not weeks, and can afford per-seat pricing

### Budget-Friendly Options

```
$0/month:
  Tawk.to (free live chat + basic bot)
  HubSpot free CRM + chat widget
  Chatwoot (self-hosted, open source)

$25-50/month:
  Crisp (chatbot + live chat + shared inbox)
  Tidio (AI chatbot + live chat)

$100-200/month:
  Intercom Starter (chat + basic Fin AI)
  Drift (basic plan)

$200+/month:
  Full Intercom or Drift with AI
  Custom build (hosting + API costs)
```

---

## Chat Widget Placement and Behavior

### Placement

Standard: Bottom-right corner of every page. This is where users expect to find chat. Do not deviate unless you have a strong reason.

### Trigger Timing

| Page Type | Delay | Greeting Style | Rationale |
|-----------|-------|---------------|-----------|
| Homepage | 15-20 sec | General offer to help | Let them browse first |
| Pricing page | 5-10 sec | "Questions about pricing?" | High intent, engage quickly |
| Product page | 10-15 sec | "Want to see [feature] in action?" | Feature-specific prompt |
| Blog/content | 30 sec or scroll 50% | "Enjoying this? Want more?" | Content engagement |
| Help/docs | 5 sec | "Need help? Ask me anything" | They already need assistance |
| Demo/signup page | Immediately | "Let me help you get started" | Conversion critical page |

### Behavioral Triggers

```
Open chat proactively when:
- User visits pricing page for the second time
- User has been on a page for 60+ seconds without scrolling
- User moves mouse toward browser back button (exit intent)
- User has visited 3+ pages in one session
- Returning visitor (cookie-based detection)

Do NOT open chat:
- On mobile (use a small, non-intrusive button instead)
- If user has dismissed chat in this session
- If user is already in a conversion flow (checkout, signup form)
- More than once per session (unless user initiates)
```

---

## Lead Data Collection

### Progressive Data Collection

Do not ask for everything upfront. Collect data progressively through the conversation.

```
Message 1-2: No data request. Just help them.
Message 3-4: Ask for first name (if needed for personalization).
Message 5-6: Ask for email (tied to a value exchange — "I can send you...").
Message 7+:  Ask for company, role, phone (only if qualifying for demo).

Value exchange examples:
  "Want me to email you a summary of this?" → captures email
  "I can send you a relevant case study" → captures email
  "Let me book a demo for you" → captures email + name + company
```

### Data to Collect

| Field | When to Ask | Required? | How to Use |
|-------|-----------|-----------|-----------|
| Email | After providing value | Yes (for follow-up) | CRM, email nurture |
| First name | Early in conversation | Nice to have | Personalization |
| Company name | During qualification | For B2B only | Lead scoring, research |
| Company size | During qualification | For B2B | Lead scoring, routing |
| Role/title | During qualification | Nice to have | Personalization, routing |
| Use case | During qualification | Yes | Sales prep, segmentation |
| Phone number | Only for hot leads | Never required | Sales follow-up |

---

## Handoff to Human

### When to Escalate

```
Route to live human when:
- Visitor explicitly asks for a human ("Talk to a person")
- Bot cannot answer the question after 2 attempts
- Visitor shows frustration (negative sentiment detection)
- Lead scores as "hot" and a rep is available
- Topic is sensitive (billing dispute, cancellation, legal)
- Conversation exceeds 10 messages without resolution

How to escalate:
1. "Let me connect you with a team member who can help with this."
2. If no one is available: "Our team is offline right now.
   Can I get your email so someone can follow up within [SLA]?"
3. Always pass conversation context to the human agent.
```

### Live Chat Integration

```
Handoff flow:

Bot: "I am going to connect you with {{TEAM_MEMBER_ROLE}}
      who can help with this. One moment!"

[Bot passes conversation transcript + lead data to agent]

Agent receives:
- Full conversation history
- Visitor info (email, name, company if collected)
- Pages visited on site
- Lead score
- Qualification answers

Agent: "Hi {{FIRST_NAME}}, I see you are interested in
        {{USE_CASE}}. Let me help you with that..."
```

### Notification System

```
When a qualified lead is captured, notify the team via:

- Slack: #leads channel with lead details and conversation summary
- Email: Immediate alert to assigned sales rep
- CRM: Auto-create contact/deal with all captured data
- Calendar: If demo was booked, auto-create calendar event

Notification template (Slack):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 NEW QUALIFIED LEAD
Name: {{NAME}}
Email: {{EMAIL}}
Company: {{COMPANY}} ({{COMPANY_SIZE}})
Use case: {{USE_CASE}}
Timeline: {{TIMELINE}}
Score: {{SCORE}} / 12
Page: {{CURRENT_PAGE}}
Action needed: {{NEXT_STEP}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Bot Personality and Voice

### Aligning with Brand Voice

| Brand Voice | Bot Personality | Example Greeting |
|-------------|----------------|-----------------|
| Professional | Helpful, efficient, polite | "Hello! How can I assist you today?" |
| Casual/Friendly | Warm, conversational, emoji-okay | "Hey there! What brings you here today?" |
| Technical | Precise, knowledgeable, developer-friendly | "Hi. Looking for technical docs or have a question?" |
| Playful | Fun, lighthearted, witty | "Hey! I am [Bot Name], your friendly neighborhood helper." |

### Bot Communication Rules

- **Keep responses concise:** 1-3 sentences maximum per message
- **Use quick-reply buttons:** Reduce typing, increase response rate
- **Break long responses into multiple messages:** Mimics natural chat rhythm
- **Never pretend to be human:** Be upfront about being a bot
- **Use the user's name after they share it:** Builds rapport
- **Acknowledge when you cannot help:** "That is a great question — let me get a human to help"
- **End conversations gracefully:** "Is there anything else I can help with?"

---

## Measuring Chatbot Performance

### Key Metrics

| Metric | Definition | Target | How to Measure |
|--------|-----------|--------|---------------|
| **Conversation rate** | % of visitors who engage with chatbot | 2-5% | Conversations started / page visitors |
| **Lead capture rate** | % of conversations that capture email | 15-30% | Emails captured / conversations started |
| **Qualified lead rate** | % of captured leads that meet qualification criteria | 30-50% | Qualified leads / total leads captured |
| **Demo booking rate** | % of qualified leads who book a demo | 20-40% | Demos booked / qualified leads |
| **Resolution rate** | % of questions answered without human handoff | 60-80% | Bot-resolved / total queries |
| **CSAT** | Post-conversation satisfaction rating | 4.0+/5.0 | Survey after conversation ends |
| **Average handle time** | Time from first message to resolution/handoff | <5 min | Timestamp calculation |
| **Human takeover rate** | % of conversations that escalate to human | 20-40% | Escalations / total conversations |

### Performance Dashboard

```
{{PROJECT_NAME}} Chatbot Performance — {{MONTH}} {{YEAR}}

VOLUME:
Total visitors:          ____
Conversations started:   ____ (____% conversation rate)
Messages exchanged:      ____

LEAD GENERATION:
Emails captured:         ____ (____% capture rate)
Qualified leads:         ____ (____% qualification rate)
Demos booked:            ____ (____% booking rate)
Leads to CRM:            ____

QUALITY:
CSAT score:              ____ / 5.0
Resolution rate:         ____%
Human takeover rate:     ____%
Avg conversation length: ____ messages
Avg handle time:         ____ minutes

TOP TOPICS:
1. {{TOPIC_1}} — ____% of conversations
2. {{TOPIC_2}} — ____% of conversations
3. {{TOPIC_3}} — ____% of conversations
4. {{TOPIC_4}} — ____% of conversations
5. {{TOPIC_5}} — ____% of conversations

UNRESOLVED QUESTIONS (for knowledge base improvement):
1. ________________________________
2. ________________________________
3. ________________________________
```

---

## Privacy and Compliance

### Consent for Data Collection

```
Before collecting personal data:

Bot: "I'd be happy to send you more information.
      By sharing your email, you agree to our privacy policy
      [link] and to receive communications from {{PROJECT_NAME}}.
      You can unsubscribe anytime."

[Email input field]

Requirements:
- Link to privacy policy in or near the chat widget
- Explicit consent before data collection (GDPR)
- Opt-out mechanism clearly available
- Data retention policy documented
- Do not collect sensitive personal data via chatbot
```

### GDPR/CCPA Compliance Checklist

- [ ] Privacy notice in chat widget or linked from greeting
- [ ] Consent mechanism before collecting personal data
- [ ] Data deletion process for chat transcripts (upon request)
- [ ] Cookie consent for tracking returning visitors
- [ ] Data processing agreement with chatbot platform vendor
- [ ] Document data flows: where does chat data go? (CRM, email tool, analytics)
- [ ] Retention policy: how long are chat transcripts stored?
- [ ] Right to access: can a user request their chat history?
- [ ] Cross-border data: is chat data stored in GDPR-compliant regions?

---

## Conversation Flow Diagram for {{PROJECT_NAME}}

```
{{PROJECT_NAME}} Chatbot Blueprint

Bot name: {{BOT_NAME}}
Personality: {{BOT_PERSONALITY}}
Primary goal: {{PRIMARY_CHATBOT_USE_CASE}}
Platform: {{CHATBOT_PLATFORM}}

PAGE-SPECIFIC FLOWS:

Homepage:
  Trigger: {{HOMEPAGE_TRIGGER}}
  Greeting: "{{HOMEPAGE_GREETING}}"
  Paths: [Demo interest] [FAQ] [Browse]

Pricing:
  Trigger: {{PRICING_TRIGGER}}
  Greeting: "{{PRICING_GREETING}}"
  Paths: [Book demo] [Compare plans] [Questions]

Product:
  Trigger: {{PRODUCT_TRIGGER}}
  Greeting: "{{PRODUCT_GREETING}}"
  Paths: [See feature] [Start trial] [Learn more]

QUALIFICATION FLOW:
  Q1: {{QUAL_Q1}}  Options: {{QUAL_Q1_OPTIONS}}
  Q2: {{QUAL_Q2}}  Options: {{QUAL_Q2_OPTIONS}}
  Q3: {{QUAL_Q3}}  Options: {{QUAL_Q3_OPTIONS}}
  Q4: {{QUAL_Q4}}  Options: {{QUAL_Q4_OPTIONS}}

ROUTING:
  Hot (score {{HOT_MIN}}+): {{HOT_ACTION}}
  Warm (score {{WARM_MIN}}-{{WARM_MAX}}): {{WARM_ACTION}}
  Cool (score {{COOL_MIN}}-{{COOL_MAX}}): {{COOL_ACTION}}

INTEGRATIONS:
  CRM: {{CRM_TOOL}}
  Calendar: {{CALENDAR_TOOL}}
  Notifications: {{NOTIFICATION_CHANNEL}}
  Knowledge base: {{KB_SOURCE}}

IMPLEMENTATION CHECKLIST:
- [ ] Choose chatbot platform
- [ ] Write conversation scripts for all paths
- [ ] Set up qualification scoring logic
- [ ] Configure CRM integration
- [ ] Set up calendar booking integration
- [ ] Configure notification system (Slack/email)
- [ ] Add knowledge base / FAQ data
- [ ] Set up analytics tracking
- [ ] Test all flows with internal team
- [ ] Launch to 10% of traffic (A/B test)
- [ ] Review performance after 2 weeks
- [ ] Iterate on scripts based on common unresolved questions
- [ ] Full rollout
```

---

*A chatbot is only as good as the conversations it enables. Continuously review transcripts, identify gaps, and improve. The best chatbots evolve weekly based on real user interactions.*
