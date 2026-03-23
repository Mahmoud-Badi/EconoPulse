# Omnichannel Communication — Channel Selection & Strategy

> Not every product needs every channel. Choose the right mix based on your product type, audience, scale, and budget. Getting this wrong means either over-investing in channels no one uses or under-investing in channels your customers expect.

---

## Overview

The most common CX mistake is launching every channel simultaneously. Each channel you add doubles operational complexity — routing rules, response templates, agent training, quality monitoring, and tool integration all multiply. Start with 2 channels, master them, then expand based on data.

This guide provides an adaptive decision tree for selecting communication channels for {{PROJECT_NAME}}. Walk through each step sequentially. The output is your **{{CX_CHANNEL_MIX}}** — the specific set of channels you will support, stored in the placeholder registry and referenced by every downstream CX document including `unified-inbox-architecture.template.md`, `ai-support-chatbot-blueprint.template.md`, and SLA definitions.

### Why This Matters

Channel selection is a staffing decision disguised as a technology decision. Every channel you open creates an implicit promise to customers about response time, availability, and resolution quality. Breaking that promise — a chat widget that goes unanswered, a social DM that gets a response 3 days later — is worse than never offering the channel at all.

**Rule of thumb:** if you cannot staff a channel to meet its expected response time (see Channel Profiles below), do not open it.

---

## Channel Selection Decision Tree

Work through Steps 1-4 sequentially. Each step narrows your channel set. The intersection of all four steps produces your recommended starting mix.

### Step 1: Product Type

Your product category determines which channels are natural fits. Start here to eliminate channels that rarely work for your category.

| Product Type | Primary Channels | Secondary Channels | Rarely Needed |
|---|---|---|---|
| **B2B SaaS** | Email + in-app chat | Phone (enterprise tier), Slack Connect | Social DMs, SMS, WhatsApp |
| **B2C App** | In-app messaging + email | Social DMs, push notifications | Phone, Discord, Slack |
| **Marketplace** | Email + in-app messaging (both sides) | Phone (high-value disputes), SMS (logistics) | Discord, WhatsApp |
| **Developer Tool / API** | Email + community (Discord/GitHub) | Docs-integrated chat widget, Slack | Phone, WhatsApp, SMS |
| **E-commerce** | Live chat + email | WhatsApp/SMS (transactional), phone | Discord, Slack |
| **Fintech / Banking** | Email + in-app chat + phone | SMS (2FA/alerts), WhatsApp | Discord, social DMs |
| **Healthcare / Telehealth** | Secure in-app messaging + phone | Email (non-clinical), SMS (appointments) | Social, Discord, WhatsApp |
| **Gaming** | Discord + in-app | Email (account issues), social | Phone, WhatsApp, SMS |
| **Media / Content** | Email + social DMs | In-app, community forum | Phone, WhatsApp |

**{{PRODUCT_TYPE}} maps to:** identify your row above. Your primary channels are non-negotiable starting points. Secondary channels are added based on Steps 2-4.

### Step 2: Audience Demographics

Your audience determines channel preferences. Overlay this on Step 1 results to confirm or adjust.

**Enterprise / Corporate buyers:**
- Expect: phone availability, dedicated account manager, email with fast response
- Prefer: scheduled calls over async chat, executive escalation paths
- Channel implication: phone is required for enterprise tier regardless of product type
- Slack Connect or Microsoft Teams channels for ongoing relationship management

**SMB / Startup buyers:**
- Expect: self-serve first, chat when stuck, email for complex issues
- Prefer: fast async responses over scheduled calls
- Channel implication: in-app chat + email is sufficient, phone is optional
- Knowledge base is critical (reduces ticket volume by 30-50%)

**Consumer / Gen Z (ages 16-30):**
- Expect: instant responses, social media presence, messaging apps
- Prefer: WhatsApp, Instagram DMs, iMessage over email
- Channel implication: social DMs and messaging apps are primary, not secondary
- Email is backup, not primary — use for transactional only

**Consumer / Millennials (ages 30-45):**
- Expect: chat + email, reasonable response times
- Prefer: self-serve knowledge base, in-app chat during business hours
- Channel implication: standard chat + email mix works well

**Consumer / Gen X+ (ages 45+):**
- Expect: phone availability, email, clear instructions
- Prefer: talking to a human, step-by-step guidance
- Channel implication: phone support matters more, chat is supplementary

**Developer / Technical audience:**
- Expect: community-driven support, GitHub Issues, detailed documentation
- Prefer: async communication, code examples, stack traces in responses
- Channel implication: Discord/Slack community + GitHub is primary, traditional support is secondary
- API status page and incident communication are critical

**Global / Multi-language audience:**
- Channel implication: choose channels that support translation (chat with auto-translate, multilingual email templates)
- WhatsApp has strong global penetration, especially in Latin America, India, Southeast Asia, Europe
- SMS is US/Canada-centric; other regions prefer WhatsApp or local messaging apps (WeChat, LINE, KakaoTalk)

### Step 3: Scale Tier

Your current scale determines how many channels you can realistically staff and maintain. Do not skip ahead — premature channel expansion is the #1 cause of poor CX metrics.

**Early Stage (< 100 users / pre-PMF):**
- Maximum channels: 2
- Recommended: founder email + simple chat widget (Crisp, Intercom free tier)
- Why only 2: you need every conversation to be a learning opportunity. Founders should read and respond to every message personally.
- Do not add: phone, social, SMS, WhatsApp — you cannot staff them and broken promises are worse than no channel
- Knowledge base: start writing help articles from day 1, even if only 5-10 articles. Every support conversation is a candidate for a new article.
- Tooling budget: $0-50/month

**Growth Stage (100-10K users):**
- Maximum channels: 3
- Recommended: in-app chat + email + knowledge base (self-serve)
- Add AI chatbot for FAQ deflection once you have 50+ resolved tickets as training data
- Consider adding: nothing yet — master your 3 channels first
- Hire first dedicated support person at ~500 users or ~50 tickets/week
- Tooling budget: $50-500/month

**Scale Stage (10K-100K users):**
- Maximum channels: 4-5
- Recommended: existing 3 + 1-2 channels based on audience (phone for enterprise, WhatsApp for consumer, Discord for developers)
- AI chatbot should handle 30-50% of inbound volume
- Implement routing engine (see `unified-inbox-architecture.template.md`)
- Dedicated support team of 3-10 agents
- Tooling budget: $500-5,000/month

**Enterprise Stage (100K+ users):**
- Maximum channels: 6+
- Full omnichannel with dedicated enterprise channel (Slack Connect, dedicated phone line)
- Tiered support: L1 (bot + junior agents), L2 (senior agents), L3 (engineering escalation)
- 24/7 coverage for critical channels (at minimum: email + chat)
- Dedicated support engineering team for complex technical issues
- Tooling budget: $5,000-50,000+/month

### Step 4: Budget Reality Check

Every channel has a true cost — not just the tool subscription, but agent time, training, quality monitoring, and infrastructure.

| Channel | Setup Cost | Monthly Platform Cost | Cost per Contact | Agent Complexity | Time to Launch |
|---|---|---|---|---|---|
| **Email** | Low ($0-100) | $0-50 (shared inbox) | $2-5 | Low | 1 day |
| **In-app chat** | Medium ($100-500) | $50-300 (widget + platform) | $3-8 | Medium | 1-2 weeks |
| **Knowledge base** | Medium ($200-1,000) | $50-200 | $0.10-0.50 (self-serve) | Low (writing) | 2-4 weeks |
| **AI chatbot** | High ($500-5,000) | $100-1,000 | $0.50-2 | High (training) | 4-8 weeks |
| **Phone / VoIP** | High ($500-2,000) | $200-1,000 | $8-15 | High | 2-4 weeks |
| **SMS** | Low ($50-200) | $50-200 + per-message | $0.05-0.10 per message | Low | 1-2 weeks |
| **WhatsApp Business** | Medium ($200-500) | $100-500 + per-conversation | $0.05-0.08 per conversation | Medium | 2-4 weeks |
| **Social DMs** | Low ($0-100) | $100-500 (social tool) | $3-8 (same as chat) | Medium | 1-2 weeks |
| **Discord / Slack** | Free-Low ($0-100) | $0 (community self-serve) | $0 (community) | Low | 1-2 days |
| **In-app push** | Medium ($100-500) | $50-200 | $0.001 per push | Low | 1-2 weeks |

**Budget calculation formula:**
```
Monthly channel cost = (platform_cost) + (avg_contacts_per_month × cost_per_contact) + (agents_needed × agent_hourly_rate × hours_per_month)
```

**Example:** in-app chat for a Growth-stage B2B SaaS with 200 tickets/month:
- Platform: $150/month (Intercom Starter)
- Contact cost: 200 × $5 = $1,000 (agent time)
- Agents: 1 part-time (20 hrs/week × $25/hr = $2,000/month)
- **Total: ~$3,150/month** for one channel

If your total CX budget is under $5,000/month, you can realistically support 2-3 channels. Allocate accordingly.

---

## Channel Profiles

Detailed operational specifications for each channel. Use these to set internal SLAs, write agent training materials, and configure your {{SUPPORT_PLATFORM}}.

### Live Chat (In-App Widget)

**Best for:** real-time support during business hours, pre-sales questions, quick troubleshooting, feature guidance
**Not for:** complex issues requiring investigation (transition to email), off-hours support (unless you have 24/7 staffing or a competent bot)

| Metric | Target | Unacceptable |
|---|---|---|
| First response time | < 1 minute (business hours) | > 5 minutes |
| Average handle time | 5-12 minutes | > 20 minutes |
| Resolution rate (first contact) | > 70% | < 50% |
| CSAT | > 4.2/5 | < 3.5/5 |
| Concurrent chats per agent | 2-3 | > 5 |

**Operational requirements:**
- Staff during {{BUSINESS_HOURS}} at minimum. Display "offline" indicator outside hours.
- If you cannot maintain < 2-minute response time, switch to async messaging mode (respond within hours, not minutes). Async messaging is a valid strategy — but you must set the expectation in the UI.
- Typing indicators, read receipts, and agent avatars increase perceived responsiveness.
- Pre-chat form: collect email (for follow-up if chat drops) and brief issue description.
- Post-chat: auto-send transcript to customer via email, trigger CSAT survey.

**Key tools:** Intercom, Crisp, Drift, LiveChat, Zendesk Chat, Freshdesk Messaging, HubSpot Live Chat, Tidio
**Integration notes:** widget must be configured per-page context (pass current page URL, user plan, feature area to agent). Cross-ref `ai-support-chatbot-blueprint.template.md` for bot handoff configuration.

### Email

**Best for:** complex issues requiring investigation, issues needing a paper trail, follow-ups, non-urgent requests, legal/compliance inquiries
**Not for:** urgent production issues (use in-app chat or phone), real-time troubleshooting

| Metric | Target | Unacceptable |
|---|---|---|
| First response time | < 4 hours (business hours) | > 24 hours |
| Average handle time | 15-30 minutes (includes research) | > 60 minutes |
| Resolution rate (first contact) | > 50% | < 30% |
| Replies to resolution | < 3 emails | > 6 emails |
| CSAT | > 4.0/5 | < 3.5/5 |

**Operational requirements:**
- Email is your **anchor channel** — every other channel should be able to escalate to email. Chat times out? Send transcript via email. Phone call requires follow-up? Summarize in email.
- Use a dedicated support address: {{SUPPORT_EMAIL}} (e.g., support@{{DOMAIN}}).
- Configure SPF, DKIM, and DMARC to prevent support emails landing in spam.
- Auto-acknowledgment: send immediate confirmation with ticket number and expected response time.
- Email threading: maintain conversation context via In-Reply-To and References headers.
- Signature: include agent name, role, and link to knowledge base.

**Key tools:** {{SUPPORT_PLATFORM}} built-in email, Front, Help Scout, Missive, Gmail shared inbox (early stage only)
**Integration notes:** inbound email parsing via SendGrid Inbound Parse, Mailgun Routes, or platform-native. Forward support@ to your platform.

### SMS / Text Messaging

**Best for:** transactional notifications (order confirmation, shipping updates, appointment reminders), 2FA/verification codes, time-sensitive alerts
**Not for:** complex support conversations, marketing blasts (without explicit opt-in), first-contact outreach

| Metric | Target | Unacceptable |
|---|---|---|
| Delivery rate | > 98% | < 95% |
| Response time (if 2-way) | < 15 minutes | > 1 hour |
| Opt-out rate | < 2% per month | > 5% per month |

**Operational requirements:**
- SMS is a **notification channel**, not a conversation channel. Optimize for outbound, not inbound support.
- 2-way SMS: if you enable inbound SMS, route replies to your unified inbox (see `unified-inbox-architecture.template.md`).
- Character limit: 160 characters per segment. Messages over 160 are split into multiple segments (each billed separately). Write concise messages.
- Include opt-out instructions in every message: "Reply STOP to unsubscribe."
- Sender ID: use a dedicated phone number or short code. Shared short codes are being deprecated.

**Compliance (non-negotiable):**
- **US (TCPA):** explicit written opt-in required before sending. Keep opt-in records for at least 5 years. Violations carry $500-1,500 per message in fines.
- **EU (GDPR):** explicit consent, right to withdraw, data minimization.
- **Canada (CASL):** express or implied consent, unsubscribe mechanism.
- Register with carriers via The Campaign Registry (TCR) to avoid filtering.
- Never send SMS between 9 PM - 8 AM recipient's local time (some jurisdictions mandate this).

**Key tools:** Twilio, MessageBird, Vonage, Plivo, Amazon SNS (for pure notification)
**Integration notes:** Twilio is the de facto standard. Use Twilio Messaging Service (not raw API) for automatic compliance features, sender selection, and delivery optimization.

### WhatsApp Business

**Best for:** consumer products with global audience, transactional + support hybrid, markets where WhatsApp is dominant (Latin America, India, Southeast Asia, Europe)
**Not for:** purely B2B enterprise products, US-only audience (WhatsApp penetration is lower in the US)

| Metric | Target | Unacceptable |
|---|---|---|
| First response time | < 1 hour | > 4 hours |
| Average handle time | 8-15 minutes | > 30 minutes |
| Resolution within 24-hour window | > 80% | < 60% |

**Operational requirements:**
- WhatsApp has **conversation-based pricing**: a 24-hour conversation window opens when a user messages you (user-initiated) or when you send a template message (business-initiated). All messages within that window are one billable conversation.
- Optimize for resolution within the 24-hour window. After 24 hours, you can only re-engage with pre-approved template messages (which cost more).
- Template messages must be approved by Meta before use. Approval takes 1-3 business days. Plan ahead.
- Rich media support: images, documents, location, contacts, interactive buttons, list messages.
- WhatsApp Business API (not the WhatsApp Business App) is required for any serious implementation. The app is limited to 1 device and no API access.

**Key tools:** WhatsApp Business API via Twilio, MessageBird, 360dialog, or Meta Cloud API (direct)
**Integration notes:** webhook-based inbound, REST API outbound. Messages must be end-to-end encrypted. Store message content in your system for audit but be aware of privacy implications.

### Social DMs (Twitter/X, Instagram, Facebook Messenger)

**Best for:** consumer brands, public-facing reputation management, products with strong social presence
**Not for:** B2B enterprise, sensitive account issues (move to private channel immediately), products with no social presence

| Metric | Target | Unacceptable |
|---|---|---|
| Public mention response | < 30 minutes (acknowledgment) | > 2 hours |
| DM first response | < 1 hour | > 4 hours |
| Average handle time | 5-10 minutes | > 20 minutes |

**Operational requirements:**
- **Public complaints require immediate acknowledgment.** "We hear you, sending you a DM now" — then move the conversation to a private DM. Never debug account issues in public.
- Monitor brand mentions (not just @mentions) using social listening tools.
- Social support agents need brand voice training — social responses are public and represent the brand.
- Do not delete negative comments unless they violate community guidelines. Respond publicly, resolve privately.
- Social channels are also a source of product feedback and competitive intelligence — route insights to product team.

**Key tools:** Sprout Social, Hootsuite, Buffer, Brandwatch, native platform tools, {{SUPPORT_PLATFORM}} social integrations
**Integration notes:** each platform has its own API. Use a social management tool that aggregates all platforms into one inbox. Cross-ref `unified-inbox-architecture.template.md` for how social channels feed into the unified inbox.

### Discord / Slack Community

**Best for:** developer communities, gaming, web3/crypto, open-source projects, early-stage products building a community moat
**Not for:** enterprise B2B, products with primarily non-technical users, regulated industries (HIPAA, SOX)

| Metric | Target | Unacceptable |
|---|---|---|
| Staff response time | < 1 business day | > 3 business days |
| Community response time | < 4 hours (organic) | N/A (can't control) |
| Unanswered questions | < 10% | > 25% |

**Operational requirements:**
- Discord/Slack is a **community**, not a support channel. Set expectations accordingly: "This is a community forum. For urgent issues, email {{SUPPORT_EMAIL}}."
- Designate community moderators (power users, not staff) to handle routine questions.
- Staff members should be identified with roles/badges but should not be the primary responders.
- Create structured channels: #general, #help, #bugs, #feature-requests, #announcements. Pin channel rules.
- Use bots for FAQ responses, ticket creation from Discord messages, and community analytics.
- Archive and index community conversations for knowledge base content.

**Key tools:** Discord (free, unlimited), Slack (free tier limited, paid for full history), Discourse (forum alternative)
**Integration notes:** Discord bots via Discord.js or Discordeno. Slack apps via Bolt SDK. Route actionable issues from community to your support inbox via bot commands (e.g., `/ticket create`).

### Phone / VoIP

**Best for:** enterprise accounts ($10K+ ACV), complex or emotional issues, accessibility compliance, industries where phone is expected (healthcare, finance, insurance)
**Not for:** early-stage startups (unless mandated by industry), simple questions that could be answered via chat or KB, high-volume consumer support (cost-prohibitive)

| Metric | Target | Unacceptable |
|---|---|---|
| Time to answer | < 2 minutes | > 5 minutes |
| Average handle time | 8-20 minutes | > 30 minutes |
| First call resolution | > 70% | < 50% |
| Abandonment rate | < 5% | > 15% |
| CSAT | > 4.3/5 | < 3.8/5 |

**Operational requirements:**
- Phone is the **most expensive channel**. Reserve for high-value accounts and issues that require real-time voice conversation.
- IVR (Interactive Voice Response): keep it simple. Max 3 levels, max 5 options per level. "Press 1 for billing, 2 for technical support, 0 for a human."
- Callback option: if wait time > 3 minutes, offer callback. Customers prefer callbacks 75% of the time.
- Call recording: record all calls for quality assurance (with consent). Auto-transcribe for searchability and training.
- After-call work: agents need 2-5 minutes after each call to log notes and update the ticket. Build this into scheduling.
- Voicemail: if after hours, route to voicemail with callback commitment ("We'll return your call within 1 business day").

**Key tools:** Aircall, Dialpad, RingCentral, Twilio Voice, Amazon Connect, Genesys (enterprise)
**Integration notes:** CTI (Computer Telephony Integration) with your CRM/support platform. Screen pop: show customer profile when call connects. Call logging: auto-create ticket from inbound call.

### In-App Messaging / Push Notifications

**Best for:** proactive communication, product updates, re-engagement, transactional notifications, onboarding nudges
**Not for:** inbound support (users cannot easily reply to push notifications), time-sensitive support communications

| Metric | Target | Unacceptable |
|---|---|---|
| Push opt-in rate | > 50% (mobile), > 30% (web) | < 20% |
| Push open rate | > 5% | < 1% |
| In-app message view rate | > 20% | < 5% |
| Unsubscribe rate per push | < 0.5% | > 2% |

**Operational requirements:**
- Every push notification must have a **clear action** and be **relevant to the recipient**. Irrelevant pushes erode trust and increase opt-out rates.
- Timing: respect user timezone. No push notifications between 10 PM - 8 AM local time.
- Frequency cap: maximum 3 push notifications per day, maximum 7 per week. If you're hitting these limits, you're sending too many.
- Personalization: segment by user behavior, plan, lifecycle stage. "One-size-fits-all" push campaigns have 80% lower engagement.
- Deep links: every push notification should deep-link to the relevant screen in the app.
- In-app messages (banners, modals, tooltips) are less intrusive than push. Prefer in-app for non-urgent communications.

**Key tools:** OneSignal, Firebase Cloud Messaging (FCM), Intercom, Braze, Customer.io, Knock
**Integration notes:** push requires device token registration (mobile) or service worker (web). In-app messaging is typically SDK-based. Both require event tracking for targeting and segmentation.

---

## Channel Mix Recommendations

Based on the decision tree, here are proven channel mixes by product type and stage.

| Product Type | Stage 1: Launch (2 channels) | Stage 2: Growth (3-4 channels) | Stage 3: Scale (5+ channels) |
|---|---|---|---|
| **B2B SaaS** | Email + in-app chat | + KB + AI chatbot | + Phone (enterprise tier) + Slack Connect |
| **B2C App** | In-app messaging + email | + Push notifications + KB | + WhatsApp + social DMs + SMS |
| **Marketplace** | Email + in-app (both sides) | + Chat + KB | + Phone (high-value disputes) + SMS (logistics) |
| **Developer Tool** | Email + Discord/GitHub | + Docs chat widget + KB | + Community forum + Office hours (video) |
| **E-commerce** | Live chat + email | + WhatsApp/SMS (transactional) + KB | + Phone + social + AI chatbot |
| **Fintech** | In-app chat + email | + Phone + KB | + SMS (alerts) + AI chatbot |

**Set {{CX_CHANNEL_MIX}} to your selected channels.** This value is referenced by `unified-inbox-architecture.template.md`, `ai-support-chatbot-blueprint.template.md`, and routing configurations throughout the CX ops section.

---

## Notification Strategy Framework

Once channels are selected, define how each channel is used for outbound communication.

### Urgency-Frequency Matrix

Map every notification type to the appropriate channel based on urgency and frequency.

| | Low Frequency (< 1/month) | Medium Frequency (1-4/month) | High Frequency (> 1/week) |
|---|---|---|---|
| **Urgent** (action required, time-sensitive) | Push + email + SMS | Push + email | Push only (with suppress logic to avoid fatigue) |
| **Important** (should see, not urgent) | Email | In-app banner + email | In-app banner only |
| **Informational** (nice to know) | Email digest (weekly/monthly) | In-app feed | In-app feed only (never email or push) |

**Examples mapped to this matrix:**
- Password reset request → Urgent, Low Frequency → Push + Email + SMS
- New feature announcement → Important, Low Frequency → Email
- Weekly usage summary → Informational, Medium Frequency → In-app feed + email digest
- Daily activity notification → Informational, High Frequency → In-app feed only
- Payment failed → Urgent, Low Frequency → Push + Email + SMS
- Teammate invited you → Important, Medium Frequency → In-app + email
- Changelog update → Informational, Low Frequency → Email digest

### User Preference Management

Respecting user preferences is not optional — it is legally required in most jurisdictions and practically required for retention.

**Implementation requirements:**
- Allow users to choose their preferred channel per notification **category** (not per individual notification — too granular).
- Categories: Security & Account, Billing & Payments, Product Updates, Team Activity, Marketing & Tips.
- Default to least-intrusive channel (in-app) unless urgency requires escalation.
- Security notifications (password changes, new login, 2FA) are **always on** and cannot be disabled.
- Transactional notifications (receipts, confirmations) are always on per CAN-SPAM/GDPR.
- Respect quiet hours: no push/SMS between 10 PM - 8 AM user's local time (use timezone from user profile or IP geolocation).
- Frequency capping: max 3 push notifications per day, max 1 marketing email per day (excluding transactional).
- Unsubscribe: one-click unsubscribe for all non-transactional communications. Include unsubscribe link in every email footer.
- Preference sync: if a user changes preferences on mobile, reflect on web (and vice versa).

### Notification Payload Standards

Define consistent payload structure across all channels:

```yaml
notification:
  id: "{{NOTIFICATION_ID}}"
  category: "product_update | billing | security | team | marketing"
  urgency: "urgent | important | informational"
  channels:
    email:
      subject: "{{SUBJECT_LINE}}"
      body_html: "{{HTML_TEMPLATE}}"
      body_text: "{{PLAINTEXT_FALLBACK}}"
    push:
      title: "Max 50 characters for readability"
      body: "Max 100 characters — one clear sentence"
      deep_link: "{{APP_SCHEME}}://{{SCREEN_PATH}}"
      image_url: "optional, 1024x512 recommended"
    sms:
      body: "Max 160 characters. Include opt-out: Reply STOP to unsubscribe."
    in_app:
      type: "banner | modal | tooltip | feed_item"
      title: "{{TITLE}}"
      body: "{{BODY}}"
      action_url: "{{RELATIVE_PATH}}"
      dismissible: true
      expires_at: "{{EXPIRY_TIMESTAMP}}"
```

---

## Proactive Messaging Playbook

Proactive messaging is outbound communication initiated by your team (not in response to a customer request). Done well, it reduces inbound support volume by 15-30%. Done poorly, it annoys users and increases churn.

### Use Cases with Implementation Details

**1. Onboarding Drip Sequence**
- Trigger: new user signup
- Channels: email (primary), in-app tooltips (secondary), push (optional)
- Sequence:
  - Immediate: welcome email with quick-start guide link
  - Day 2: first feature highlight ("Did you know you can...") — email + in-app tooltip
  - Day 5: key integration prompt ("Connect {{INTEGRATION_NAME}} to unlock...") — email
  - Day 7: check-in ("How's it going? Need help?") — email with reply-to-support
  - Day 14: value reinforcement ("You've already accomplished X") — email
  - Day 30: feedback request (NPS survey) — email
- Exit conditions: user completes onboarding milestones, user churns, user requests no more emails

**2. Usage Milestone Celebrations**
- Trigger: user reaches a predefined usage milestone
- Channels: in-app modal + optional email
- Examples: "You've completed 100 tasks!", "Your team has saved 50 hours this month", "You've been with us for 1 year"
- Include: next-step suggestion, upgrade prompt (if appropriate), share/referral CTA

**3. At-Risk User Outreach**
- Trigger: usage drops below baseline (e.g., no login for 7 days, 50% drop in weekly activity)
- Channels: email only — never push for at-risk users (push feels intrusive when disengaged)
- Message: "We noticed you haven't logged in recently. Anything we can help with?" — with direct reply-to-support
- Frequency: maximum 1 at-risk email per quarter per user. More than that becomes spam.
- Escalation: if no response after 14 days, flag for CSM outreach (phone/LinkedIn for B2B)

**4. Renewal & Billing Reminders**
- Trigger: subscription renewal approaching
- Channels: email + in-app banner
- Sequence: 30 days before → 7 days → 1 day → renewal day confirmation
- Include: current plan details, usage summary, any pricing changes, easy upgrade/downgrade path
- Payment failure: immediate email + in-app banner + SMS (if opted in). Retry payment at day 1, 3, 5, 7. Suspend account at day 14 with 48-hour warning.

**5. Incident Notification**
- Trigger: service incident affecting users
- Channels: email + in-app banner + status page (cross-ref `21-incident-response/`)
- Scope: affected users only — do not notify users who are not impacted
- Cadence: initial notification → updates every 30 minutes during incident → resolution notification → post-mortem summary
- Tone: factual, no corporate speak. "Our API is currently returning errors for 15% of requests. We've identified the cause and expect resolution within 2 hours."

**6. Feature Announcements**
- Trigger: new feature shipped
- Channels: in-app banner + changelog, optional email for major features
- Minor features: in-app tooltip or changelog entry only
- Major features: email announcement + in-app modal with guided tour
- Never announce features that aren't ready. "Coming soon" announcements erode trust when timelines slip.

**7. Feedback Requests**
- Post-interaction CSAT: in-app survey immediately after ticket resolution (1-5 scale + optional comment)
- Periodic NPS: email every 90 days (0-10 scale + "What's the primary reason for your score?")
- Feature-specific feedback: in-app micro-survey when user uses a specific feature 3+ times
- Survey fatigue: never show more than 1 survey per user per week

### Anti-Patterns — What NOT to Do

These patterns actively damage customer relationships. Enforce these as rules, not guidelines.

1. **Channel exhaustion:** sending the same message on every channel simultaneously. Pick the single best channel per message.
2. **Push notification abuse:** pushing non-urgent content. Every unnecessary push trains users to disable notifications.
3. **Support-to-marketing pipeline:** adding users to marketing emails from support conversations. This violates trust and possibly GDPR.
4. **Requiring opt-in for support notifications:** support notifications (ticket updates, resolution confirmations) should be default-on. Marketing is opt-in. Do not conflate them.
5. **"We miss you" harassment:** sending more than one re-engagement email per quarter. If they didn't respond the first time, sending five more will not help.
6. **Dark patterns in notifications:** using urgent styling (red badges, alarm icons) for non-urgent content. Users learn to ignore all notifications, including actually urgent ones.
7. **Unsubscribe friction:** requiring login to unsubscribe, multi-step unsubscribe flows, "Are you sure?" confirmations. One click. Done.

---

## Channel-Specific Message Templates

Adapt core messages to each channel's constraints and conventions.

### Welcome Message

**Email:**
```
Subject: Welcome to {{PROJECT_NAME}} — here's how to get started
Body: [Full HTML welcome email with quick-start steps, key links, and reply-to-support CTA]
```

**In-app chat:**
```
Hi! Welcome to {{PROJECT_NAME}}. I'm here if you need help getting started.
Quick tip: check out our [Getting Started Guide]({{KB_URL}}/getting-started) — it covers the basics in 5 minutes.
```

**SMS (if opted in):**
```
Welcome to {{PROJECT_NAME}}! Get started: {{SHORT_LINK}}. Reply HELP for support, STOP to opt out.
```

**Push notification:**
```
Title: Welcome to {{PROJECT_NAME}}
Body: Tap to complete your setup and unlock all features.
```

### Ticket Acknowledgment

**Email:**
```
Subject: Re: {{TICKET_SUBJECT}} [#{{TICKET_ID}}]
Body: We've received your message and a team member will respond within {{SLA_RESPONSE_TIME}}. In the meantime, you might find help in our [Knowledge Base]({{KB_URL}}).
```

**In-app chat:**
```
Thanks for reaching out! A team member will be with you within {{SLA_RESPONSE_TIME}}. Your ticket number is #{{TICKET_ID}}.
```

### Resolution Confirmation

**Email:**
```
Subject: Resolved: {{TICKET_SUBJECT}} [#{{TICKET_ID}}]
Body: Your issue has been resolved. [Summary of resolution]. If this doesn't fully address your concern, simply reply to this email to reopen the conversation. We'd also appreciate your feedback: [CSAT survey link].
```

**In-app chat:**
```
This issue has been resolved: [brief summary]. If you need anything else, feel free to reach out anytime. Would you mind rating your experience? [1-5 stars]
```

---

## Implementation Checklist

- [ ] Complete channel selection using Steps 1-4 of the decision tree above
- [ ] Set **{{CX_CHANNEL_MIX}}** in the placeholder registry (`PLACEHOLDER-REGISTRY.md`)
- [ ] Configure chosen channels in **{{SUPPORT_PLATFORM}}**
- [ ] Set up unified inbox (see `unified-inbox-architecture.template.md`)
- [ ] Write response templates for each active channel (adapt templates above)
- [ ] Define notification strategy using the urgency-frequency matrix
- [ ] Build notification payload schemas per the standards above
- [ ] Set up user preference management for channel preferences and quiet hours
- [ ] Implement proactive messaging for your top 3 use cases (start with onboarding drip)
- [ ] Configure compliance requirements per channel (TCPA for SMS, GDPR for all)
- [ ] Train team on channel-specific response expectations and SLA targets
- [ ] Set up channel-specific CSAT tracking
- [ ] Schedule quarterly channel mix review — examine per-channel CSAT, cost-per-contact, and volume trends
- [ ] Document channel selection rationale for future team members

---

*Cross-references: `unified-inbox-architecture.template.md`, `ai-support-chatbot-blueprint.template.md`, `chatbot-training-data.template.md`, `cx-maturity-assessment.md`, `23-customer-support/sla-definitions.template.md`, `21-incident-response/`*
