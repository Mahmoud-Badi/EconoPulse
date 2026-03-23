# Unified Inbox Architecture

> {{PROJECT_NAME}} — One inbox for every channel. No conversation left behind, no context lost.

---

## Overview

Choose your channels first using `omnichannel-decision-tree.md`. This document designs the system that unifies those channels into a single agent workspace.

A unified inbox aggregates conversations from all channels (**{{CX_CHANNEL_MIX}}**) into a single interface where agents can view, respond to, and manage conversations regardless of the originating channel. The customer contacts you on chat, follows up via email, and calls about the same issue — the agent sees one continuous conversation thread with full context.

Without a unified inbox, agents waste 20-40% of their time asking customers to repeat information, searching across tools, and manually correlating conversations. This document provides the data model, routing engine, integration architecture, and monitoring framework to eliminate that waste.

### Architectural Principles

1. **Channel-agnostic data model:** conversations and messages are stored in a normalized format. Channel-specific metadata is preserved but does not dictate the schema.
2. **Identity-first design:** a customer is one entity regardless of how many channels they use. Identity resolution is the foundation, not an afterthought.
3. **Routing is policy, not code:** routing rules are expressed as configuration (YAML/JSON), not hardcoded logic. Business teams can adjust routing without engineering deployments.
4. **Audit everything:** every state change (assignment, status, priority, merge) is recorded as an event. This enables analytics, debugging, and compliance.
5. **SLA-aware by default:** every conversation has a computed SLA deadline. Routing, queue ordering, and alerting all reference this deadline.

---

## Build vs. Integrate Decision

This is the most important decision in your CX infrastructure. Getting it wrong wastes months of engineering time or locks you into a platform that cannot scale with your needs.

### Use Your Platform's Native Inbox When:

- You are using **Intercom**, **Zendesk**, **Front**, **HelpScout**, or **Freshdesk** — all have built-in unified inboxes with competent routing
- Your channel mix is standard: email + chat + social (no custom channels)
- You do not need custom routing logic beyond what the platform provides (round-robin, skill-based, basic rules)
- Team size is under 20 agents
- You do not need deep real-time integration with internal systems (custom CRM, product database, billing)
- Your support volume is under 5,000 conversations/month

**Estimated setup time:** 1-4 weeks
**Estimated cost:** $50-300/agent/month (platform subscription)

### Build Custom Unified Inbox When:

- You need **deep integration with internal systems** — agents need to see billing history, feature flags, usage data, health scores inline without switching tabs
- You need **custom routing logic** — ML-based categorization, customer health score routing, revenue-weighted prioritization
- Your channel mix includes **non-standard channels** — Discord, custom in-app messaging protocol, IoT device notifications, partner portals
- You need **real-time operational dashboards** beyond what platforms provide — custom SLA calculations, predictive staffing, cross-channel funnel analysis
- Team size exceeds 20 agents and you are hitting **platform limitations** — API rate limits, customization ceilings, per-agent pricing makes cost prohibitive
- You are in a **regulated industry** and need full control over data residency, encryption, and audit trails

**Estimated build time:** 3-6 months (MVP), 6-12 months (production-grade)
**Estimated cost:** $50,000-200,000 initial build + $5,000-20,000/month ongoing

### Hybrid Approach (Most Common at Scale)

Use a platform as the agent-facing inbox but build custom middleware for:
- Identity resolution and customer context enrichment
- Custom routing logic (runs before conversations hit the platform)
- Analytics and reporting (pull data from platform API into your data warehouse)
- Channel integrations for non-standard channels (Discord bot → platform API)

**Estimated setup time:** 4-8 weeks
**Estimated cost:** platform subscription + $10,000-50,000 middleware build

---

## Data Model

The following schema supports the unified inbox regardless of whether you build custom or extend a platform. If using a platform, map these entities to the platform's data model for your analytics layer.

### Core Entities

```sql
-- =============================================================================
-- CUSTOMERS — the unified identity across all channels
-- =============================================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255), -- ID in your product database ({{USER_TABLE}}.id)
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255), -- primary email (may be NULL if only known via social/phone)
  phone VARCHAR(50), -- primary phone (E.164 format: +1234567890)
  avatar_url TEXT,
  plan VARCHAR(50), -- current subscription plan (synced from billing)
  mrr_cents INTEGER DEFAULT 0, -- monthly recurring revenue in cents (for VIP routing)
  health_score SMALLINT, -- 0-100, synced from {{HEALTH_SCORE_SOURCE}}
  language VARCHAR(10) DEFAULT 'en', -- ISO 639-1
  timezone VARCHAR(50), -- IANA timezone (e.g., 'America/New_York')
  tags TEXT[] DEFAULT '{}',
  custom_attributes JSONB DEFAULT '{}', -- extensible attributes from product DB
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_external_id ON customers(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_customers_health ON customers(health_score) WHERE health_score IS NOT NULL;

-- =============================================================================
-- CUSTOMER IDENTITIES — maps channel-specific identifiers to unified customer
-- =============================================================================
CREATE TABLE customer_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL, -- 'email', 'chat', 'whatsapp', 'twitter', 'discord', 'phone', 'sms', 'facebook', 'instagram'
  channel_identifier VARCHAR(255) NOT NULL, -- email address, phone number, social handle, Discord user ID, in-app user ID
  display_name VARCHAR(255), -- name as shown on this channel (may differ from customer.display_name)
  verified BOOLEAN DEFAULT false, -- true if identity is confirmed (e.g., authenticated in-app user)
  metadata JSONB DEFAULT '{}', -- channel-specific profile data (avatar, bio, follower count)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(channel, channel_identifier)
);

CREATE INDEX idx_identities_customer ON customer_identities(customer_id);
CREATE INDEX idx_identities_lookup ON customer_identities(channel, channel_identifier);

-- =============================================================================
-- AGENTS — support team members
-- =============================================================================
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255), -- ID in your auth system
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'agent', -- 'agent', 'senior_agent', 'team_lead', 'admin'
  teams TEXT[] DEFAULT '{}', -- teams this agent belongs to
  skills TEXT[] DEFAULT '{}', -- skills for skill-based routing (e.g., 'billing', 'technical', 'spanish')
  max_concurrent_conversations INTEGER DEFAULT 5, -- capacity limit
  status VARCHAR(20) NOT NULL DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  status_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_status ON agents(status) WHERE status = 'online';
CREATE INDEX idx_agents_skills ON agents USING GIN(skills);
CREATE INDEX idx_agents_teams ON agents USING GIN(teams);

-- =============================================================================
-- CONVERSATIONS — the core entity, aggregates messages across channels
-- =============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  channel VARCHAR(50) NOT NULL, -- originating channel
  current_channel VARCHAR(50) NOT NULL, -- channel of most recent message (may differ if customer switched)
  status VARCHAR(30) NOT NULL DEFAULT 'open',
    -- 'open': awaiting agent response
    -- 'pending': awaiting customer response
    -- 'snoozed': temporarily paused, will reopen at snooze_until
    -- 'resolved': agent marked as resolved, pending CSAT
    -- 'closed': fully closed (auto-close after 7 days resolved or customer confirms)
  priority VARCHAR(20) NOT NULL DEFAULT 'normal', -- 'urgent', 'high', 'normal', 'low'
  category VARCHAR(100), -- auto or manually assigned (e.g., 'billing', 'bug_report', 'feature_request', 'account', 'technical')
  subcategory VARCHAR(100), -- finer granularity (e.g., 'payment_failed', 'refund_request')
  sentiment VARCHAR(20), -- 'positive', 'neutral', 'negative', 'angry' (ML-detected)
  intent VARCHAR(100), -- ML-detected intent (e.g., 'cancel_subscription', 'reset_password')
  assigned_team VARCHAR(100), -- team/queue assignment
  assigned_agent_id UUID REFERENCES agents(id),
  subject TEXT, -- conversation subject (from email subject, chat topic, or auto-generated)
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}', -- extensible per-org fields

  -- SLA tracking
  sla_policy_id UUID REFERENCES sla_policies(id),
  sla_first_response_deadline TIMESTAMPTZ, -- when first response SLA will breach
  sla_resolution_deadline TIMESTAMPTZ, -- when resolution SLA will breach
  sla_breached BOOLEAN DEFAULT false,

  -- Timestamps
  first_response_at TIMESTAMPTZ, -- when agent first responded
  last_customer_message_at TIMESTAMPTZ,
  last_agent_message_at TIMESTAMPTZ,
  snooze_until TIMESTAMPTZ, -- when to auto-reopen (if snoozed)
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,

  -- Satisfaction
  csat_score SMALLINT, -- 1-5 (collected post-resolution)
  csat_comment TEXT,
  nps_score SMALLINT, -- 0-10 (if collected in this conversation context)

  -- Metadata
  source VARCHAR(50), -- 'inbound', 'outbound', 'proactive', 'bot_escalation'
  bot_handled BOOLEAN DEFAULT false, -- true if bot attempted to handle before agent
  bot_deflected BOOLEAN DEFAULT false, -- true if bot resolved without agent
  message_count INTEGER DEFAULT 0,
  agent_message_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance-critical indexes
CREATE INDEX idx_conversations_status ON conversations(status) WHERE status NOT IN ('closed');
CREATE INDEX idx_conversations_agent ON conversations(assigned_agent_id, status) WHERE status IN ('open', 'pending');
CREATE INDEX idx_conversations_team ON conversations(assigned_team, status) WHERE status IN ('open', 'pending');
CREATE INDEX idx_conversations_sla ON conversations(sla_first_response_deadline) WHERE status = 'open' AND first_response_at IS NULL;
CREATE INDEX idx_conversations_sla_resolution ON conversations(sla_resolution_deadline) WHERE status IN ('open', 'pending') AND resolved_at IS NULL;
CREATE INDEX idx_conversations_customer ON conversations(customer_id, created_at DESC);
CREATE INDEX idx_conversations_snooze ON conversations(snooze_until) WHERE status = 'snoozed';
CREATE INDEX idx_conversations_category ON conversations(category) WHERE category IS NOT NULL;
CREATE INDEX idx_conversations_tags ON conversations USING GIN(tags);

-- =============================================================================
-- MESSAGES — individual messages within a conversation
-- =============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL, -- 'customer', 'agent', 'bot', 'system'
  sender_id UUID, -- customer_id or agent_id (NULL for system messages)
  channel VARCHAR(50) NOT NULL, -- originating channel for THIS specific message
  content_type VARCHAR(30) NOT NULL DEFAULT 'text',
    -- 'text': plain text
    -- 'html': rich HTML (email bodies)
    -- 'markdown': markdown formatted
    -- 'image': image attachment
    -- 'file': file attachment
    -- 'audio': voice message or call recording
    -- 'video': video attachment
    -- 'location': geographic coordinates
    -- 'template': structured template message (WhatsApp)
    -- 'interactive': buttons/list (WhatsApp, Messenger)
  content TEXT NOT NULL, -- message body (plain text or HTML depending on content_type)
  content_plain TEXT, -- stripped plain text version (for search, always populated)

  -- Attachments (stored separately, referenced here)
  attachments JSONB DEFAULT '[]',
    -- Array of: { "filename": "...", "url": "...", "content_type": "...", "size_bytes": 12345 }

  -- Channel-specific metadata
  metadata JSONB DEFAULT '{}',
    -- Email: { "message_id": "...", "in_reply_to": "...", "references": [...], "cc": [...], "bcc": [...] }
    -- Chat: { "session_id": "...", "page_url": "...", "user_agent": "..." }
    -- WhatsApp: { "wa_message_id": "...", "template_name": "...", "template_params": [...] }
    -- Phone: { "call_id": "...", "duration_seconds": 180, "recording_url": "...", "transcript": "..." }
    -- Social: { "platform_message_id": "...", "is_public": true, "parent_post_id": "..." }

  -- Delivery tracking
  delivery_status VARCHAR(20) DEFAULT 'sent', -- 'queued', 'sent', 'delivered', 'read', 'failed'
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_reason TEXT,

  -- Internal notes (visible to agents only, never sent to customer)
  is_internal_note BOOLEAN DEFAULT false,

  -- Idempotency
  idempotency_key VARCHAR(255), -- channel + channel_message_id for dedup

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_idempotency ON messages(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_messages_search ON messages USING GIN(to_tsvector('english', content_plain)) WHERE content_plain IS NOT NULL;

-- =============================================================================
-- CONVERSATION EVENTS — audit log of all state changes
-- =============================================================================
CREATE TABLE conversation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
    -- 'created', 'assigned', 'reassigned', 'unassigned'
    -- 'status_changed', 'priority_changed', 'category_changed'
    -- 'tagged', 'untagged'
    -- 'merged', 'split'
    -- 'sla_warning', 'sla_breached'
    -- 'snoozed', 'unsnoozed'
    -- 'customer_replied', 'agent_replied', 'bot_replied'
    -- 'escalated', 'deescalated'
    -- 'csat_received'
  actor_type VARCHAR(20) NOT NULL, -- 'agent', 'bot', 'system', 'customer', 'rule'
  actor_id UUID, -- agent_id or NULL for system/bot/rule
  old_value TEXT, -- previous state (for changes)
  new_value TEXT, -- new state (for changes)
  metadata JSONB DEFAULT '{}', -- additional context
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_conversation ON conversation_events(conversation_id, created_at);
CREATE INDEX idx_events_type ON conversation_events(event_type, created_at);

-- =============================================================================
-- SLA POLICIES — define response and resolution time targets
-- =============================================================================
CREATE TABLE sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- e.g., 'Enterprise SLA', 'Standard SLA', 'Free Tier SLA'
  description TEXT,
  priority_overrides JSONB DEFAULT '{}',
    -- { "urgent": { "first_response_minutes": 15, "resolution_minutes": 120 },
    --   "high": { "first_response_minutes": 60, "resolution_minutes": 480 },
    --   "normal": { "first_response_minutes": 240, "resolution_minutes": 1440 },
    --   "low": { "first_response_minutes": 480, "resolution_minutes": 2880 } }
  business_hours_only BOOLEAN DEFAULT true, -- SLA clock pauses outside business hours
  business_hours JSONB DEFAULT '{}',
    -- { "timezone": "America/New_York", "schedule": { "mon": ["09:00", "18:00"], "tue": ["09:00", "18:00"], ... } }
  applies_to JSONB DEFAULT '{}',
    -- { "plans": ["enterprise", "business"], "channels": ["email", "chat"], "categories": ["billing"] }
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- CANNED RESPONSES — pre-written responses searchable by category/tag
-- =============================================================================
CREATE TABLE canned_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL, -- searchable title
  shortcut VARCHAR(50), -- keyboard shortcut (e.g., '/refund', '/password-reset')
  category VARCHAR(100), -- grouping (e.g., 'billing', 'technical', 'onboarding')
  content_text TEXT NOT NULL, -- plain text version
  content_html TEXT, -- rich HTML version (for email)
  content_markdown TEXT, -- markdown version (for chat)
  variables TEXT[] DEFAULT '{}', -- placeholders within the response (e.g., '{{CUSTOMER_NAME}}', '{{PLAN_NAME}}')
  channels TEXT[] DEFAULT '{}', -- which channels this response is appropriate for
  language VARCHAR(10) DEFAULT 'en',
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES agents(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_canned_search ON canned_responses USING GIN(to_tsvector('english', title || ' ' || content_text));
CREATE INDEX idx_canned_category ON canned_responses(category);
CREATE INDEX idx_canned_shortcut ON canned_responses(shortcut) WHERE shortcut IS NOT NULL;
```

### Entity Relationship Summary

```
customers 1 ←→ N customer_identities
customers 1 ←→ N conversations
conversations 1 ←→ N messages
conversations 1 ←→ N conversation_events
conversations N ←→ 1 agents (assigned_agent)
conversations N ←→ 1 sla_policies
agents ←→ canned_responses (created_by)
```

---

## Channel Integration Architecture

### Inbound Message Flow

Every inbound message — regardless of channel — follows this pipeline:

```
[Channel Source] → [Webhook/API Receiver] → [Signature Verification] → [Idempotency Check]
     → [Message Normalizer] → [Attachment Processor] → [Identity Resolver]
     → [Auto-Categorizer (ML)] → [Router] → [Unified Inbox]
```

#### Stage 1: Webhook/API Receiver

Each channel delivers messages differently. Normalize the entry point.

| Channel | Inbound Mechanism | Authentication | Payload Format |
|---|---|---|---|
| **Email** | SendGrid Inbound Parse / Mailgun Routes / AWS SES | SPF/DKIM verification | Multipart form (headers, body, attachments) |
| **In-app chat** | WebSocket connection from your app | JWT token (authenticated user) | JSON (your schema) |
| **WhatsApp** | Meta Cloud API webhook / Twilio webhook | Webhook signature verification (HMAC) | JSON (WhatsApp format) |
| **SMS** | Twilio webhook | Request signature verification | Form-encoded (Twilio format) |
| **Twitter/X** | Account Activity API webhook | CRC challenge + HMAC signature | JSON (Twitter format) |
| **Facebook Messenger** | Messenger Platform webhook | Verify token + HMAC signature | JSON (Messenger format) |
| **Instagram** | Instagram Messaging API webhook | HMAC signature | JSON (Instagram format) |
| **Discord** | Discord Gateway (WebSocket) or Interactions endpoint | Bot token / interaction verification | JSON (Discord format) |
| **Phone** | VoIP provider webhook (call events) + recording delivery | Webhook signature | JSON + audio file URL |

**Implementation requirements:**
- Each webhook endpoint must verify the sender's signature before processing. Never trust unsigned webhooks.
- Return 200 OK immediately and process asynchronously (queue the message for processing). Webhook providers will retry on non-2xx responses, causing duplicates.
- Rate limiting: implement per-channel rate limits to handle webhook storms (e.g., a customer spamming chat). Queue excess messages rather than dropping them.
- Health check endpoint: each webhook receiver should have a `/health` endpoint that monitoring can ping.

#### Stage 2: Idempotency Check

Prevent duplicate message processing caused by webhook retries, network issues, or provider bugs.

```python
# Pseudocode for idempotency check
def process_inbound_message(channel: str, channel_message_id: str, payload: dict):
    idempotency_key = f"{channel}:{channel_message_id}"

    # Check if already processed
    existing = db.query("SELECT id FROM messages WHERE idempotency_key = %s", idempotency_key)
    if existing:
        logger.info(f"Duplicate message ignored: {idempotency_key}")
        return  # Already processed, skip

    # Process the message
    normalized = normalize_message(channel, payload)
    customer = resolve_identity(channel, normalized.sender_identifier)
    conversation = find_or_create_conversation(customer, channel, normalized)
    message = store_message(conversation, normalized, idempotency_key)
    route_conversation(conversation, message)
```

#### Stage 3: Message Normalizer

Convert channel-specific formats to the unified `messages` schema.

```python
# Normalization contract — every channel adapter must produce this
@dataclass
class NormalizedMessage:
    channel: str                    # 'email', 'chat', 'whatsapp', etc.
    channel_message_id: str         # unique ID from the channel provider
    sender_identifier: str          # email address, phone number, social handle, user ID
    sender_display_name: str        # human-readable name
    content_type: str               # 'text', 'html', 'image', 'file', etc.
    content: str                    # message body
    content_plain: str              # stripped plain text (for search)
    attachments: list[Attachment]   # normalized attachment list
    metadata: dict                  # channel-specific data preserved for context
    timestamp: datetime             # when the message was sent (channel's timestamp)
    is_reply: bool                  # true if this is a reply to an existing conversation
    reply_to_id: str | None         # channel-specific ID of the message being replied to
    thread_id: str | None           # channel-specific thread/conversation ID
```

**Channel-specific normalization notes:**

- **Email:** parse MIME, extract text/html parts, decode attachments, extract In-Reply-To header for threading. Handle multipart/alternative (prefer HTML, keep plain text for content_plain). Strip email signatures if possible (use `talon` or similar library).
- **Chat (WebSocket):** messages arrive in your format, minimal normalization needed. Capture session context (page URL, user agent, referrer).
- **WhatsApp:** handle message types: text, image, document, audio, video, location, contacts, interactive (buttons/lists). Download media from WhatsApp CDN (URLs expire after 5 minutes — download and re-upload to your storage immediately).
- **SMS:** plain text only, 160-character segments may arrive as multiple webhooks. Concatenate multi-part messages using `SmsSid` and segment headers.
- **Social (Twitter/X, Instagram, Facebook):** handle text, images, videos, stories. Distinguish public mentions from DMs. Capture parent post context for public replies.
- **Discord:** handle text, embeds, attachments, reactions. Capture channel context and server info.
- **Phone:** the "message" is a call event (started, ended, voicemail). Content is the call transcript (async, arrives after call ends) or voicemail recording.

#### Stage 4: Attachment Processor

All attachments are downloaded from the source, uploaded to your object storage, and referenced by URL.

```python
def process_attachments(channel: str, raw_attachments: list) -> list[Attachment]:
    processed = []
    for raw in raw_attachments:
        # Download from source (channel CDN, email attachment, etc.)
        file_data = download_from_source(channel, raw)

        # Virus scan (required — never store unscanned attachments)
        if not virus_scan(file_data):
            logger.warning(f"Attachment failed virus scan: {raw.filename}")
            continue

        # Upload to object storage
        storage_url = upload_to_storage(
            bucket="{{ATTACHMENT_BUCKET}}",
            path=f"conversations/{conversation_id}/{uuid4()}/{raw.filename}",
            data=file_data,
            content_type=raw.content_type
        )

        processed.append(Attachment(
            filename=raw.filename,
            url=storage_url,
            content_type=raw.content_type,
            size_bytes=len(file_data)
        ))

    return processed
```

**Storage requirements:**
- Bucket: `{{ATTACHMENT_BUCKET}}` in {{CLOUD_PROVIDER}} (S3, GCS, or Azure Blob)
- Retention: {{ATTACHMENT_RETENTION_DAYS}} days (default: 365). Auto-expire via lifecycle policy.
- Access: pre-signed URLs with 1-hour expiry for agent access. Never expose direct bucket URLs.
- Size limit: 25 MB per attachment, 50 MB total per message. Reject oversized attachments with a clear error message.

#### Stage 5: Identity Resolution

Map the channel-specific sender identifier to a unified `customer_id`. This is the most critical step — incorrect identity resolution creates fragmented customer histories.

```python
def resolve_identity(channel: str, identifier: str) -> Customer:
    # Step 1: Exact match on channel + identifier
    identity = db.query("""
        SELECT customer_id FROM customer_identities
        WHERE channel = %s AND channel_identifier = %s
    """, channel, identifier)

    if identity:
        customer = db.get_customer(identity.customer_id)
        customer.last_seen_at = now()
        return customer

    # Step 2: Cross-channel match (email or phone appears on another channel)
    if looks_like_email(identifier):
        customer = db.query("SELECT * FROM customers WHERE email = %s", identifier)
        if customer:
            create_identity(customer.id, channel, identifier, verified=True)
            return customer

    if looks_like_phone(identifier):
        customer = db.query("SELECT * FROM customers WHERE phone = %s", normalize_phone(identifier))
        if customer:
            create_identity(customer.id, channel, identifier, verified=True)
            return customer

    # Step 3: Product database match (for authenticated in-app users)
    if channel in ('chat', 'in_app') and identifier.startswith('user_'):
        product_user = product_db.get_user(identifier)
        if product_user:
            customer = find_or_create_customer_from_product_user(product_user)
            create_identity(customer.id, channel, identifier, verified=True)
            return customer

    # Step 4: Create new customer (unknown contact)
    customer = create_customer(
        display_name=extract_display_name(channel, identifier),
        email=identifier if looks_like_email(identifier) else None,
        phone=identifier if looks_like_phone(identifier) else None
    )
    create_identity(customer.id, channel, identifier, verified=False)
    return customer
```

**Identity resolution edge cases:**
- **Shared email addresses** (info@company.com, support@partner.com): do not auto-merge. Create separate customer records and let agents merge manually.
- **Phone number format variations**: always normalize to E.164 format (+1234567890) before matching.
- **Social handle changes**: customer changes their Twitter handle — the old identity record becomes orphaned. Run monthly reconciliation job.
- **Multiple accounts**: one person has two accounts (personal email + work email). Agent can manually merge profiles. Merge is destructive — archive the secondary profile, move all conversations to primary.

### Outbound Message Flow

When an agent (or bot) sends a response, it flows through this pipeline:

```
[Agent Response] → [Channel Selector] → [Content Formatter] → [Channel-Specific API]
     → [Delivery Tracking] → [Update Conversation State]
```

#### Content Formatting per Channel

The agent writes a response once (in markdown or rich text). The system formats it for the destination channel.

| Destination Channel | Input Format | Output Format | Constraints |
|---|---|---|---|
| **Email** | Markdown/HTML | Full HTML email (with template) | No hard limit, but keep under 100 KB |
| **In-app chat** | Markdown | Rendered markdown or plain text | No hard limit |
| **WhatsApp** | Markdown | WhatsApp markup (*bold*, _italic_, ~strikethrough~) | 4,096 characters |
| **SMS** | Plain text | Plain text | 160 characters per segment |
| **Twitter DM** | Plain text | Plain text | 10,000 characters |
| **Facebook Messenger** | Markdown | Messenger text + quick replies | 2,000 characters |
| **Discord** | Markdown | Discord markdown | 2,000 characters |
| **Push notification** | Title + Body | Platform-specific payload | Title: 50 chars, Body: 100 chars |

#### Delivery Tracking

Track delivery status for every outbound message:

```python
def track_delivery(message_id: str, channel: str):
    # Status progression: queued → sent → delivered → read
    # Not all channels support all statuses

    channel_tracking = {
        'email': ['queued', 'sent', 'delivered', 'opened'],  # via SendGrid/Mailgun webhooks
        'whatsapp': ['queued', 'sent', 'delivered', 'read'],   # via WhatsApp status webhooks
        'sms': ['queued', 'sent', 'delivered'],                 # via Twilio status callbacks
        'chat': ['sent', 'delivered', 'read'],                  # via WebSocket acknowledgments
        'social': ['sent'],                                      # limited tracking on most platforms
    }
```

#### Retry Logic

Failed outbound messages are retried with exponential backoff:

```python
RETRY_CONFIG = {
    'max_retries': 5,
    'initial_delay_seconds': 1,
    'backoff_multiplier': 2,
    'max_delay_seconds': 60,
    'retryable_errors': [429, 500, 502, 503, 504, 'TIMEOUT', 'CONNECTION_ERROR'],
    'non_retryable_errors': [400, 401, 403, 404],  # do not retry client errors
}

# After max retries exhausted:
# 1. Mark message as 'failed' with reason
# 2. Create conversation_event (event_type='send_failed')
# 3. Notify agent in inbox ("Message failed to send on WhatsApp. Retry or try another channel.")
# 4. Add to dead letter queue for manual review
```

---

## Conversation Routing Engine

The routing engine determines which team and agent handles each conversation. Routing runs when a conversation is created and can re-run on reassignment, escalation, or SLA breach.

### Routing Strategies

Each strategy is implemented as a pluggable module. You can combine strategies (e.g., skill-based first, then load-balanced within the matching skill group).

**1. Round-Robin**
- Distribute evenly across available agents in the target team.
- Track assignment count per agent per shift. Assign to agent with lowest count.
- Skip agents who are offline, away, or at max concurrent conversation limit.

**2. Skill-Based**
- Route to agents whose `skills` array matches the conversation's `category` or required skill.
- Example: conversation categorized as "billing" → route to agents with "billing" skill.
- Fallback: if no skilled agent is available, route to general queue.

**3. Load-Balanced**
- Route to the agent with the fewest open conversations (status = 'open' or 'pending').
- Weighted variant: weight by conversation complexity (urgent conversations count as 2).

**4. VIP / Revenue-Based**
- Route based on `customer.mrr_cents` or `customer.plan`.
- Enterprise customers (${{ENTERPRISE_THRESHOLD}}+/month) → enterprise support team.
- High-revenue customers → senior agents.

**5. Language-Based**
- Detect customer language from message content (or `customer.language`).
- Route to agents with matching language skill.
- Fallback: route to any agent + attach auto-translation.

**6. Timezone-Based**
- Route to agents in the customer's timezone (or closest available timezone).
- Useful for global teams with follow-the-sun coverage.

**7. AI-Assisted**
- Auto-categorize the conversation using ML (intent, sentiment, priority prediction).
- Use the predicted category + priority to feed into skill-based or VIP routing.
- Confidence threshold: auto-route at > 0.85 confidence, suggest at 0.6-0.85, manual routing below 0.6.
- Cross-ref: `chatbot-training-data.template.md` for model training approach.

### Routing Configuration

Express routing rules as configuration, not code. This allows business teams to adjust routing without engineering deployments.

```yaml
routing:
  default_strategy: "{{CX_ROUTING_STRATEGY}}"  # 'round_robin', 'skill_based', 'load_balanced'

  # Rules evaluated in order. First match wins.
  rules:
    # Enterprise customers get dedicated team
    - name: "Enterprise routing"
      condition: "customer.plan == 'enterprise' OR customer.mrr_cents >= {{ENTERPRISE_MRR_THRESHOLD_CENTS}}"
      action:
        assign_team: "enterprise-support"
        priority_override: "high"
        sla_policy: "enterprise-sla"

    # Billing issues to billing team
    - name: "Billing routing"
      condition: "category == 'billing' OR intent IN ('refund', 'cancel_subscription', 'payment_failed')"
      action:
        assign_team: "billing"

    # Non-English to language-matched agents
    - name: "Language routing"
      condition: "customer.language != 'en'"
      action:
        strategy: "language_based"
        fallback_team: "general-support"

    # Angry high-value customers to retention
    - name: "Retention routing"
      condition: "sentiment == 'angry' AND customer.mrr_cents >= 10000"
      action:
        assign_team: "retention"
        priority_override: "urgent"
        alert:
          channel: "slack"
          target: "#cx-escalations"
          message: "High-value at-risk customer: {{customer.display_name}} (MRR: ${{customer.mrr_cents / 100}})"

    # Bug reports to technical support
    - name: "Bug routing"
      condition: "category == 'bug_report' OR intent == 'report_bug'"
      action:
        assign_team: "technical-support"

    # Bot escalations get priority boost
    - name: "Bot escalation routing"
      condition: "source == 'bot_escalation'"
      action:
        assign_team: "general-support"
        priority_override: "high"  # customer already waited through bot interaction

  # Fallback when no rule matches
  fallback:
    strategy: "round_robin"
    team: "general-support"
    sla_policy: "standard-sla"

  # Business hours configuration
  business_hours:
    timezone: "{{TIMEZONE}}"
    schedule:
      mon: ["09:00", "18:00"]
      tue: ["09:00", "18:00"]
      wed: ["09:00", "18:00"]
      thu: ["09:00", "18:00"]
      fri: ["09:00", "18:00"]
      sat: null  # closed
      sun: null  # closed
    holidays: "{{HOLIDAY_CALENDAR_URL}}"
    after_hours_action: "queue_with_autoresponder"
    autoresponder_message: "Thanks for reaching out! Our team is currently offline. We'll respond within {{SLA_NEXT_BUSINESS_DAY}} hours when we're back. For urgent issues, check our status page at {{STATUS_PAGE_URL}}."

  # Agent assignment within the routed team
  assignment:
    strategy: "load_balanced"  # how to pick an agent within the target team
    respect_capacity: true      # never assign beyond agent.max_concurrent_conversations
    prefer_previous_agent: true  # if customer had a recent conversation with an agent, prefer that agent
    previous_agent_window_hours: 72  # "recent" = within last 72 hours
    auto_assign: true            # false = conversations go to team queue, agents pick manually
```

### Escalation Rules

Define when and how conversations escalate from one tier to the next.

```yaml
escalation:
  # Auto-escalate on SLA breach risk
  - trigger: "sla_breach_risk"
    condition: "time_to_sla_breach_minutes < 15 AND first_response_at IS NULL"
    action:
      reassign_to: "team_lead"
      alert:
        channel: "slack"
        target: "#cx-sla-alerts"
        message: "SLA breach in {{time_to_sla_breach_minutes}} minutes: conversation #{{conversation.id}}"

  # Auto-escalate on customer anger
  - trigger: "sentiment_change"
    condition: "sentiment == 'angry' AND previous_sentiment != 'angry'"
    action:
      priority_override: "high"
      notify: "assigned_agent.team_lead"

  # Agent-initiated escalation to engineering
  - trigger: "manual_escalation"
    tag: "needs-engineering"
    action:
      create_linear_issue:
        team: "{{ENGINEERING_TEAM}}"
        title: "CX Escalation: {{conversation.subject}}"
        description: "Customer: {{customer.display_name}}\nConversation: {{conversation.url}}\n\nContext: {{escalation_notes}}"
        priority: "{{conversation.priority}}"
      notify_agent: "Linear issue created: {{linear_issue.url}}"

  # Time-based escalation
  - trigger: "no_response"
    condition: "status == 'open' AND last_agent_message_at IS NULL AND age_minutes > 60"
    action:
      reassign_to: "next_available_senior_agent"
      priority_override: "high"
```

---

## Cross-Channel Context Preservation

Context loss across channels is the single biggest driver of customer frustration. Solving it requires both technical infrastructure (identity resolution, conversation linking) and agent training.

### Conversation Linking

When a customer switches channels mid-issue, the system should recognize this and link the conversations.

**Automatic linking triggers:**
1. Same customer creates new conversation within 24 hours on a different channel → system suggests "Link to existing conversation?"
2. Customer references a ticket number in their message (regex: `#\d{4,}` or `ticket \d+`) → auto-link to referenced conversation
3. Email reply-to matches an existing conversation's email thread → auto-link (via In-Reply-To header)

**Manual linking:**
- Agent can search for and link related conversations from the conversation panel
- Linked conversations display inline in the conversation timeline with a "Continued from [channel]" marker
- Agent can merge two conversations into one (destructive — the secondary conversation is archived)

**Context display:**
```
When viewing a conversation, the agent sidebar shows:
├── Customer Profile
│   ├── Name, email, phone, plan, MRR
│   ├── Health score: {{health_score}}/100
│   ├── Account age, last login, key product metrics
│   └── Tags and custom attributes
├── Recent Conversations (last 90 days)
│   ├── [Resolved] "Payment failed" — Email — 3 days ago — Agent: Sarah
│   ├── [Resolved] "Can't export CSV" — Chat — 2 weeks ago — Agent: Mike
│   └── [Open] Current conversation
├── Key Events
│   ├── Plan upgraded to Business — 1 month ago
│   ├── Feature request: dark mode — 2 months ago
│   └── Onboarding completed — 3 months ago
└── Internal Notes (from any conversation)
    └── "Prefers email for follow-ups. Timezone: PST." — Sarah, 3 days ago
```

### Customer Profile Enrichment

The unified inbox should display enriched customer data pulled from your product database and third-party sources.

```yaml
customer_context:
  # Synced from product database ({{PRODUCT_DB}})
  product_data:
    - field: "plan"
      source: "{{USER_TABLE}}.subscription_plan"
      sync_frequency: "real_time"  # via webhook on plan change
    - field: "mrr_cents"
      source: "{{BILLING_TABLE}}.mrr_cents"
      sync_frequency: "daily"
    - field: "last_login"
      source: "{{USER_TABLE}}.last_login_at"
      sync_frequency: "hourly"
    - field: "feature_usage"
      source: "{{ANALYTICS_TABLE}}"
      sync_frequency: "daily"
      format: "top 5 features by usage count"

  # Computed metrics
  computed:
    - field: "health_score"
      source: "{{HEALTH_SCORE_SERVICE}}"
      inputs: ["login_frequency", "feature_adoption", "support_ticket_frequency", "nps_score"]
    - field: "lifetime_value"
      source: "SUM({{BILLING_TABLE}}.amount) WHERE customer_id = ?"
    - field: "days_since_last_ticket"
      source: "NOW() - MAX(conversations.created_at) WHERE customer_id = ?"

  # Third-party enrichment (optional)
  enrichment:
    - provider: "Clearbit"  # or similar
      fields: ["company_name", "company_size", "industry", "funding"]
      trigger: "on_customer_create"
```

---

## Smart Routing with Auto-Categorization

Use ML to automatically categorize, prioritize, and route conversations. This reduces manual triage time and ensures consistent routing.

### ML-Based Categorization Pipeline

```
[New Message] → [Text Preprocessing] → [Category Classifier] → [Priority Predictor]
     → [Sentiment Analyzer] → [Intent Extractor] → [Routing Decision]
```

**Implementation options (in order of recommendation):**

1. **LLM with structured output (recommended for most teams)**
   - Use GPT-4o-mini, Claude Haiku, or similar fast/cheap model
   - Prompt with category definitions + examples
   - Structured output: `{ category, subcategory, priority, sentiment, intent, confidence }`
   - Cost: $0.001-0.01 per classification
   - Accuracy: 85-95% (improves with good prompt engineering and few-shot examples)

2. **Fine-tuned classifier (higher volume / lower cost)**
   - Train on historical tickets with agent-assigned categories
   - Minimum training data: 500+ labeled examples per category
   - Models: fine-tuned BERT, DistilBERT, or SetFit (few-shot)
   - Cost: $0.0001 per classification (self-hosted) or $0.001 (API)
   - Accuracy: 80-90%

3. **Rule-based fallback (always needed as a safety net)**
   - Keyword matching for obvious categories (e.g., "refund" → billing, "password" → account)
   - Used when ML confidence is below threshold or ML service is unavailable
   - Accuracy: 60-70%

**Confidence thresholds:**

| Confidence | Action |
|---|---|
| > 0.85 | Auto-route. No human review needed. |
| 0.60 - 0.85 | Suggest category and route to the suggested team, but flag for agent confirmation. |
| < 0.60 | No auto-categorization. Route to triage queue for manual categorization. |

**Retraining cadence:**
- Monitor category accuracy weekly (compare ML assignment vs. agent-corrected assignment)
- Retrain when accuracy drops below 85% for any category
- Add new categories when agents create ad-hoc tags that reach 50+ conversations
- Cross-ref: `chatbot-training-data.template.md` for training data management

### SLA-Aware Routing

SLA awareness is built into every routing decision. The routing engine considers time-to-SLA-breach when prioritizing conversations.

```python
def calculate_sla_deadline(conversation, sla_policy):
    """Calculate when SLA will be breached, accounting for business hours."""

    priority = conversation.priority
    target_minutes = sla_policy.priority_overrides[priority]['first_response_minutes']

    if sla_policy.business_hours_only:
        # Only count minutes during business hours
        deadline = add_business_minutes(
            start=conversation.created_at,
            minutes=target_minutes,
            schedule=sla_policy.business_hours
        )
    else:
        deadline = conversation.created_at + timedelta(minutes=target_minutes)

    return deadline


def prioritize_queue(conversations):
    """Sort conversation queue by SLA urgency."""

    for conv in conversations:
        if conv.first_response_at is not None:
            conv.sla_urgency = 0  # already responded, lower priority
        else:
            minutes_remaining = (conv.sla_first_response_deadline - now()).total_seconds() / 60
            if minutes_remaining <= 0:
                conv.sla_urgency = 100  # BREACHED — highest priority
            elif minutes_remaining <= 15:
                conv.sla_urgency = 90   # critical risk
            elif minutes_remaining <= 30:
                conv.sla_urgency = 70   # high risk
            else:
                conv.sla_urgency = max(0, 50 - minutes_remaining)

    # Sort by SLA urgency (descending), then by priority, then by age
    return sorted(conversations, key=lambda c: (-c.sla_urgency, -PRIORITY_WEIGHT[c.priority], c.created_at))
```

**SLA breach handling:**
1. At 80% of SLA window: `sla_warning` event → Slack notification to team lead
2. At 100% (breach): `sla_breached` event → conversation marked `sla_breached = true` → auto-reassign to next available senior agent → Slack alert to CX manager
3. Post-breach: conversation gets permanent "SLA breached" flag for reporting. Root cause analysis required for any breach.

Cross-ref: for SLA definitions by tier, see `23-customer-support/sla-definitions.template.md`.

---

## Agent Workspace Design

The agent workspace is where agents spend 95% of their time. Every second of friction — slow loading, missing context, extra clicks — multiplies across thousands of conversations.

### Inbox Views

Agents need multiple views of their work. Each view is a filtered, sorted list of conversations.

| View | Filter | Sort | Purpose |
|---|---|---|---|
| **My Conversations** | `assigned_agent_id = current_agent` AND `status IN ('open', 'pending')` | SLA urgency → priority → oldest | Agent's active workload |
| **Unassigned** | `assigned_agent_id IS NULL` AND `status = 'open'` AND `assigned_team IN (agent.teams)` | SLA urgency → priority → oldest | Queue for agents to pick from |
| **Team Inbox** | `assigned_team IN (agent.teams)` AND `status IN ('open', 'pending')` | SLA urgency → priority → oldest | Team-wide visibility |
| **SLA At Risk** | `sla_urgency > 50` AND `status = 'open'` | SLA urgency (descending) | Triage dashboard for team leads |
| **Snoozed** | `status = 'snoozed'` AND `assigned_agent_id = current_agent` | `snooze_until` (ascending) | Scheduled follow-ups |
| **Resolved** | `status = 'resolved'` AND `assigned_agent_id = current_agent` AND `resolved_at > NOW() - 7 days` | `resolved_at` (descending) | Review recent resolutions, check CSAT |
| **All Conversations** | `status != 'closed'` | Various (user-selectable) | Admin/manager oversight |

**View auto-refresh:** real-time updates via WebSocket. Agent should never need to manually refresh. New conversations appear at the top with a subtle animation, not a jarring page reload.

### Conversation Panel

The conversation panel is the primary workspace when handling a conversation.

**Layout (left to right):**
```
┌──────────────┬──────────────────────────────┬────────────────────┐
│              │                              │                    │
│  Inbox List  │  Conversation Thread         │  Customer Sidebar  │
│  (filtered)  │  ┌──────────────────────┐    │                    │
│              │  │ Customer message      │    │  Profile           │
│  • Conv 1    │  │ [via WhatsApp]        │    │  Plan / MRR        │
│  • Conv 2 ←  │  ├──────────────────────┤    │  Health Score      │
│  • Conv 3    │  │ Agent response        │    │  Recent Convos     │
│  • Conv 4    │  │ [via email]           │    │  Key Events        │
│              │  ├──────────────────────┤    │  Internal Notes    │
│              │  │ System: channel       │    │                    │
│              │  │ switched to chat      │    │  ─────────────     │
│              │  ├──────────────────────┤    │                    │
│              │  │ Internal note (yellow)│    │  Quick Actions     │
│              │  ├──────────────────────┤    │  • Assign          │
│              │  │ Customer message      │    │  • Snooze          │
│              │  │ [via chat]            │    │  • Priority        │
│              │  └──────────────────────┘    │  • Tags            │
│              │                              │  • Merge           │
│              │  ┌──────────────────────┐    │  • Escalate        │
│              │  │ Reply composer        │    │                    │
│              │  │ Channel: [dropdown]   │    │  ─────────────     │
│              │  │ [Canned] [Note] [AI]  │    │                    │
│              │  └──────────────────────┘    │  AI Suggestions    │
│              │                              │                    │
└──────────────┴──────────────────────────────┴────────────────────┘
```

**Key interactions:**
- **Reply composer:** agent types response, selects reply channel (defaults to customer's most recent channel). Supports markdown, attachments, and canned response insertion.
- **Channel selector:** dropdown showing available channels for this customer. Only channels where we have a valid identity are shown.
- **Canned responses:** searchable by title or shortcut (`/refund`, `/password-reset`). Auto-populate variables ({{CUSTOMER_NAME}}, {{PLAN_NAME}}).
- **Internal notes:** toggle to "note" mode — message is saved but never sent to customer. Displayed with yellow background.
- **AI suggestions:** based on conversation context, suggest a response or relevant KB article (cross-ref `ai-support-chatbot-blueprint.template.md`).
- **Snooze:** set a date/time to auto-reopen the conversation (e.g., "Snooze for 3 days" for follow-up).
- **Keyboard shortcuts:** `Cmd+Enter` to send, `Cmd+Shift+N` for internal note, `Cmd+K` for canned response search, `Cmd+E` for escalate.

---

## Integration Patterns

### Webhook Architecture (Inbound and Outbound)

**Inbound webhooks** (channel → unified inbox):
```yaml
webhook_endpoints:
  email:
    url: "{{API_BASE_URL}}/webhooks/email/inbound"
    provider: "{{EMAIL_PROVIDER}}"  # SendGrid, Mailgun, AWS SES
    authentication: "signature_verification"

  whatsapp:
    url: "{{API_BASE_URL}}/webhooks/whatsapp/inbound"
    provider: "twilio"  # or Meta Cloud API
    authentication: "hmac_signature"

  sms:
    url: "{{API_BASE_URL}}/webhooks/sms/inbound"
    provider: "twilio"
    authentication: "request_signature"

  social:
    twitter:
      url: "{{API_BASE_URL}}/webhooks/twitter/events"
      authentication: "crc_challenge + hmac"
    facebook:
      url: "{{API_BASE_URL}}/webhooks/facebook/events"
      authentication: "verify_token + hmac"
    instagram:
      url: "{{API_BASE_URL}}/webhooks/instagram/events"
      authentication: "verify_token + hmac"
```

**Outbound webhooks** (unified inbox → external systems):
```yaml
outbound_webhooks:
  # Notify Slack on new high-priority conversations
  - event: "conversation.created"
    condition: "priority IN ('urgent', 'high')"
    target: "{{SLACK_WEBHOOK_URL}}"
    payload:
      text: "New {{priority}} conversation from {{customer.display_name}}: {{subject}}"

  # Sync resolved conversations to CRM
  - event: "conversation.resolved"
    target: "{{CRM_WEBHOOK_URL}}"
    payload:
      customer_id: "{{customer.external_id}}"
      conversation_id: "{{conversation.id}}"
      category: "{{conversation.category}}"
      csat_score: "{{conversation.csat_score}}"
      resolution_time_minutes: "{{resolution_time}}"

  # Alert PagerDuty on SLA breach
  - event: "conversation.sla_breached"
    target: "{{PAGERDUTY_WEBHOOK_URL}}"
    payload:
      summary: "SLA breach: conversation #{{conversation.id}} — {{customer.display_name}}"
      severity: "warning"
      source: "cx-unified-inbox"
```

**Webhook reliability:**
- Retry failed deliveries with exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 retries)
- Dead letter queue: failed deliveries after max retries are stored for manual inspection
- Idempotency: include `X-Webhook-ID` header so receivers can dedup
- Monitoring: alert if webhook failure rate exceeds 5% over any 15-minute window

### Platform API Integration

If using a platform (Zendesk, Intercom, etc.) as your inbox, integrate via their APIs for custom workflows.

| Platform | Key APIs | Use Cases |
|---|---|---|
| **Zendesk** | Tickets API, Users API, Organizations API, Webhooks, Sunshine Custom Objects | Custom data in ticket sidebar, automated ticket creation from internal tools |
| **Intercom** | Conversations API, Contacts API, Companies API, Data Events API, Webhooks | Enrich contacts with product usage, trigger messages based on events |
| **Front** | Conversations API, Messages API, Contacts API, Tags API, Rules API | Custom routing rules, CRM sync, analytics export |
| **HelpScout** | Conversations API, Customers API, Mailboxes API, Webhooks | Custom sidebar app, workflow automation |
| **HubSpot** | Conversations Inbox API, Tickets API, Contacts API, CRM API | Unified CRM + support view |
| **Linear** | Issues API, Webhooks | Engineering escalation, bug tracking sync |

**Rate limit handling:**
- All platform APIs have rate limits (typically 100-700 requests/minute)
- Implement client-side rate limiting with token bucket algorithm
- Cache frequently accessed data (customer profiles, canned responses) — TTL: 5 minutes
- Use bulk APIs where available (batch customer lookups, batch ticket updates)
- Monitor API usage and alert at 80% of rate limit

---

## Monitoring & Analytics

### Real-Time Operational Dashboard

Display on a wall-mounted monitor in the support area (or as a persistent browser tab for remote teams).

**Key real-time metrics:**

| Metric | Calculation | Target | Alert Threshold |
|---|---|---|---|
| **Open conversations** | `COUNT(status = 'open')` | Trend-aware | > 2x normal for time of day |
| **Unassigned conversations** | `COUNT(assigned_agent_id IS NULL AND status = 'open')` | < 5 | > 10 |
| **Average wait time** | `AVG(NOW() - created_at) WHERE first_response_at IS NULL` | < 5 min (chat), < 2 hr (email) | > 2x target |
| **SLA compliance (rolling 4hr)** | `COUNT(NOT sla_breached) / COUNT(*) WHERE created_at > NOW() - 4hr` | > 95% | < 90% |
| **Agent utilization** | `COUNT(agent open convos) / agent.max_concurrent` per agent | 60-80% | > 90% or < 30% |
| **Online agents** | `COUNT(agent.status = 'online')` | Staffing plan | Below minimum staffing |
| **Conversations by channel** | `GROUP BY current_channel` | N/A | Spike on any channel |
| **CSAT (rolling 24hr)** | `AVG(csat_score) WHERE csat_score IS NOT NULL AND resolved_at > NOW() - 24hr` | > 4.2/5 | < 3.8/5 |

**Dashboard technology:** Grafana (with PostgreSQL data source) or Metabase for self-hosted. Platform-native dashboards for SaaS inbox tools. Refresh interval: 30 seconds.

### Historical Analytics (Weekly/Monthly Reporting)

| Report | Metrics | Audience | Frequency |
|---|---|---|---|
| **Channel Performance** | Volume, response time, resolution time, CSAT by channel | CX Manager | Weekly |
| **Agent Performance** | Conversations handled, avg resolution time, CSAT, SLA compliance per agent | CX Manager / Team Lead | Weekly |
| **Category Distribution** | Conversation volume by category, trending categories, new emerging categories | CX Manager + Product | Weekly |
| **SLA Compliance** | Breach count, breach rate by priority/team/channel, root cause of breaches | CX Manager + VP | Weekly |
| **Cross-Channel Behavior** | % of customers using multiple channels, channel switch patterns, context preservation score | CX Manager | Monthly |
| **Cost per Contact** | Total CX cost / total conversations, broken down by channel | CX Manager + Finance | Monthly |
| **Customer Effort Score** | Avg replies to resolution, avg channels per issue, reopened ticket rate | CX Manager + Product | Monthly |
| **Bot Deflection Rate** | % of conversations resolved by bot without agent, bot → agent escalation rate | CX Manager | Weekly |

**Data pipeline:**
```
[Unified Inbox DB] → [ETL (daily)] → [Analytics Data Warehouse ({{DATA_WAREHOUSE}})]
     → [BI Tool (Metabase/Looker/Tableau)] → [Scheduled Reports (email)]
```

Export conversation data daily to your data warehouse for cross-referencing with product analytics, revenue data, and customer health scores. This enables analyses like "Do customers who contact support in their first week have higher retention?" and "Which product features generate the most support tickets?"

### Alerting Rules

```yaml
alerts:
  - name: "Unassigned queue growing"
    condition: "unassigned_count > 10 AND time_of_day BETWEEN '09:00' AND '18:00'"
    channel: "slack"
    target: "#cx-alerts"
    cooldown_minutes: 15

  - name: "SLA breach rate spike"
    condition: "sla_breach_rate_4hr > 0.10"
    channel: "slack + pagerduty"
    target: "#cx-alerts"
    severity: "warning"
    cooldown_minutes: 30

  - name: "Agent capacity exceeded"
    condition: "ANY(agent.open_conversations > agent.max_concurrent * 1.2)"
    channel: "slack"
    target: "#cx-team-leads"
    cooldown_minutes: 30

  - name: "Channel integration down"
    condition: "webhook_failure_rate > 0.05 over 15 minutes"
    channel: "pagerduty"
    severity: "critical"
    cooldown_minutes: 5

  - name: "CSAT drop"
    condition: "avg_csat_24hr < 3.8"
    channel: "slack"
    target: "#cx-leadership"
    cooldown_minutes: 60
```

---

## Security & Compliance Considerations

- **Data residency:** customer conversation data must be stored in {{DATA_RESIDENCY_REGION}}. If using a SaaS platform, verify their data residency options.
- **Encryption:** data at rest (AES-256) and in transit (TLS 1.2+). Attachments encrypted in object storage.
- **Access control:** agents can only view conversations assigned to their team (unless admin). Implement row-level security in the database or application layer.
- **PII handling:** customer PII (email, phone, name) is stored in the customers table. Implement data retention policies (auto-delete conversations after {{DATA_RETENTION_MONTHS}} months). Support GDPR right-to-erasure requests.
- **Audit trail:** `conversation_events` table provides complete audit trail. Retain for {{AUDIT_RETENTION_YEARS}} years.
- **Agent authentication:** SSO via {{SSO_PROVIDER}} (SAML 2.0 or OIDC). MFA required for all agent accounts.

---

## Implementation Checklist

- [ ] **Decision:** choose build custom, use platform native, or hybrid approach
- [ ] **Platform setup:** if using platform, configure {{SUPPORT_PLATFORM}} with all channels from {{CX_CHANNEL_MIX}}
- [ ] **Data model:** if building custom, create database schema (tables, indexes, seed SLA policies)
- [ ] **Identity resolution:** implement customer identity mapping across all active channels
- [ ] **Channel integrations:** set up inbound webhook receivers for each channel
- [ ] **Message normalization:** implement normalizer for each channel's message format
- [ ] **Attachment processing:** configure object storage ({{ATTACHMENT_BUCKET}}), implement virus scanning and upload pipeline
- [ ] **Outbound formatting:** implement response formatters for each channel (markdown → HTML, plain text, WhatsApp markup)
- [ ] **Routing engine:** implement routing configuration parser and strategy modules
- [ ] **Routing rules:** define and test routing rules using the YAML configuration above
- [ ] **SLA tracking:** implement SLA deadline calculation with business hours awareness
- [ ] **SLA alerting:** configure alerts for SLA breach risk (80% warning, 100% breach)
- [ ] **Auto-categorization:** set up ML categorization pipeline (LLM or fine-tuned classifier)
- [ ] **Agent workspace:** build or configure inbox views, conversation panel, and customer sidebar
- [ ] **Canned responses:** populate initial canned responses (cross-ref `23-customer-support/canned-responses.template.md`)
- [ ] **Real-time dashboard:** set up operational dashboard with key metrics
- [ ] **Historical analytics:** configure data pipeline to {{DATA_WAREHOUSE}} and build weekly reports
- [ ] **Alerting:** configure alert rules for queue growth, SLA breaches, channel outages, CSAT drops
- [ ] **Security:** verify data residency, encryption, access control, PII handling, audit trail
- [ ] **Testing:** end-to-end test — send message on channel A, verify it appears in unified inbox, respond via channel B, verify customer receives on channel B
- [ ] **Cross-channel test:** customer contacts via email, then chat about the same issue — verify agent sees full context
- [ ] **Agent training:** train agents on unified inbox workflow, keyboard shortcuts, canned responses, escalation procedures
- [ ] **Go-live monitoring:** monitor for 2 weeks post-launch with heightened alerting thresholds

---

*Cross-references: `omnichannel-decision-tree.md`, `ai-support-chatbot-blueprint.template.md`, `chatbot-training-data.template.md`, `cx-maturity-assessment.md`, `23-customer-support/sla-definitions.template.md`, `23-customer-support/canned-responses.template.md`, `21-incident-response/`*
