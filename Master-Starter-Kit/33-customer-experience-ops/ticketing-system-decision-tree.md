# Ticketing System — Build vs. Integrate Decision Tree

> Every support operation needs a ticketing system. The question is whether to build your own or integrate with an existing platform. This decision has downstream consequences for staffing, maintenance burden, feature velocity, and customer experience quality. Get it wrong and you either over-engineer a commodity or under-invest in a competitive differentiator.

---

## Overview

A ticketing system is the spine of customer support. It manages the lifecycle of every customer issue from creation through resolution, tracks SLA compliance, distributes work across agents, and generates the data you need to improve support quality over time.

**Cross-references:**

- For SLA definitions and tracking, see `23-customer-support/sla-definitions.template.md`.
- For escalation workflows between support tiers, see `23-customer-support/support-escalation-workflow.md`.
- For knowledge base strategy that deflects tickets before they are created, see `23-customer-support/knowledge-base-strategy.md`.
- For incident management that generates bulk tickets, see `09-deployment-operations/incident-response-playbook.md`.

This document covers the ticketing system itself — the infrastructure that manages ticket lifecycle, assignment, priority, and reporting. It is opinionated: most teams should integrate, not build. The custom build path exists for teams with genuine complexity that platforms cannot accommodate.

---

## Build vs. Integrate Decision Tree

### The Core Principle

**Integrate unless you have a specific, validated reason to build.** Ticketing systems are a solved problem. The total cost of ownership for a custom ticketing system — including ongoing maintenance, security patches, feature development, and the opportunity cost of engineering time — almost always exceeds platform licensing costs until you hit enterprise scale with genuinely unusual requirements.

### Decision Factors (Flowchart)

Work through these in order. The first match is your answer.

```
START
  │
  ├─ Ticket volume < 500/month AND no custom workflows needed?
  │   └─ YES → INTEGRATE. Use {{SUPPORT_PLATFORM}} native ticketing.
  │            Do not overthink this. A spreadsheet could handle this volume.
  │
  ├─ Your product IS a support/CX platform (you are building a competitor)?
  │   └─ YES → BUILD. Obviously.
  │
  ├─ Need custom status workflows with 5+ statuses and conditional transitions
  │   that cannot be configured in any major platform?
  │   └─ YES → Validate this claim. Most platforms support custom statuses.
  │            If truly unsupported → BUILD CUSTOM.
  │            If platform-configurable → INTEGRATE.
  │
  ├─ Need deep, real-time integration with internal product database
  │   (show live user account state, subscription details, feature flags
  │   directly inside the ticket view with sub-second freshness)?
  │   └─ YES → Can a platform sidebar app + API integration meet the need?
  │            If yes → INTEGRATE with custom sidebar app.
  │            If no (latency, data sensitivity, complexity) → BUILD CUSTOM.
  │
  ├─ Regulatory/compliance requirement that customer data cannot leave
  │   your infrastructure (HIPAA, SOC2 with strict data residency)?
  │   └─ YES → Can a self-hosted or single-tenant platform option work?
  │            If yes → INTEGRATE (self-hosted).
  │            If no → BUILD CUSTOM.
  │
  ├─ Engineering capacity to maintain a ticketing system indefinitely?
  │   └─ NO → INTEGRATE. Period. A ticketing system you cannot maintain
  │           is worse than a platform you pay for.
  │
  └─ None of the above?
      └─ INTEGRATE. You do not have a reason to build.
```

### Recommendation Matrix

| Factor | Integrate | Build Custom | Notes |
|---|---|---|---|
| Team size < 10 agents | **Yes** | Rarely justified | Platform onboarding takes hours, not weeks |
| Standard workflow (open, pending, resolved) | **Yes** | Overkill | Every platform handles this natively |
| Need custom fields per ticket type | Platform-dependent | Yes | Zendesk/Freshdesk support this; simpler platforms may not |
| Deep product integration | API + sidebar app | Yes | Evaluate API quality of candidate platforms first |
| Custom SLA engine with business-hours calc | Platform-dependent | Yes | Zendesk/Freshdesk have SLA engines; check if they meet your rules |
| Multi-product support (separate queues, branding) | Platform-dependent | Yes | Enterprise-tier platforms handle this well |
| Ticket volume > 50k/month | Negotiate enterprise pricing | Consider it | At this scale, platform costs are significant but so is build cost |
| Need offline/air-gapped operation | No | Yes | Rare but real for defense/government contracts |

### Cost Comparison Framework

Before deciding, run this calculation:

**Integration path annual cost:**
- Platform licensing: agents x per-seat cost x 12 months
- API integration development: one-time engineering cost (typically 2-4 weeks)
- Ongoing integration maintenance: ~5% of initial build per year
- Platform training: minimal (most agents know Zendesk/Intercom)

**Custom build annual cost:**
- Initial development: 3-6 months of engineering time (2+ engineers)
- Ongoing maintenance: 20-30% of initial build cost per year (bugs, security, features)
- Infrastructure: hosting, database, file storage, monitoring
- Opportunity cost: what else could those engineers build?

**The math almost always favors integration** unless you are at 50+ agents or have genuine platform-breaking requirements.

---

## Integration Path

### Platform Comparison

#### Zendesk

- **Best for:** Teams that need maximum configurability without building custom. Mid-market to enterprise.
- **API quality:** Excellent. REST and GraphQL APIs, well-documented, high rate limits on enterprise plans.
- **Automation:** Triggers (event-based) and automations (time-based). Powerful but complex rule engine.
- **Reporting:** Built-in Explore analytics. Good for standard metrics, limited for custom analysis.
- **Pricing:** Starts at $55/agent/month (Suite Team). Enterprise at $150+/agent/month.
- **Strengths:** Marketplace of 1,500+ integrations, mature product, handles scale well.
- **Weaknesses:** Complex admin UI, expensive at scale, can feel bloated for small teams.
- **Pick when:** You need a battle-tested platform with extensive customization and do not mind the price.

#### Intercom

- **Best for:** Product-led companies that want support integrated with in-app messaging and product tours.
- **API quality:** Good REST API. Webhook support is solid. GraphQL API is newer and less mature.
- **Automation:** Workflows (visual builder), bots, custom bot flows. Strong for automated resolution.
- **Reporting:** Decent built-in reporting. Better for conversation metrics than traditional ticket metrics.
- **Pricing:** Starts at $74/seat/month. Usage-based pricing for some features (resolutions).
- **Strengths:** Beautiful UI, strong in-app messaging, AI features (Fin) for automated resolution.
- **Weaknesses:** Not a traditional ticketing system — "conversations" model can feel awkward for complex multi-touch issues. Pricing can spike with usage-based components.
- **Pick when:** Your support is primarily in-app, conversational, and you value automated resolution over traditional ticket management.

#### Freshdesk

- **Best for:** Cost-conscious teams that need solid ticketing without enterprise pricing.
- **API quality:** Good REST API. Well-documented. Rate limits are reasonable.
- **Automation:** Scenario automations, SLA policies, agent collision detection. Solid but less flexible than Zendesk.
- **Reporting:** Built-in analytics with custom report builder. Adequate for most needs.
- **Pricing:** Free tier (up to 10 agents, limited features). Paid starts at $15/agent/month. Enterprise at $79/agent/month.
- **Strengths:** Aggressive pricing, free tier for startups, good feature set for the price.
- **Weaknesses:** Less mature marketplace, UI is functional but not polished, some features feel bolted-on.
- **Pick when:** Budget matters and you need traditional ticketing with good-enough features.

#### HubSpot Service Hub

- **Best for:** Teams already using HubSpot CRM/Marketing that want unified customer data.
- **API quality:** Good REST API, well-documented. Part of the broader HubSpot API ecosystem.
- **Automation:** Workflows shared with CRM/Marketing. Powerful if you are already in the HubSpot ecosystem.
- **Reporting:** Strong, especially for cross-functional reporting (support + sales + marketing).
- **Pricing:** Free tools available. Starter at $20/month/seat. Professional at $100/month/seat.
- **Strengths:** Unified customer view across sales/marketing/support, strong automation.
- **Weaknesses:** Ticketing is not the primary product — less depth than dedicated platforms. Can feel like an add-on.
- **Pick when:** You are already a HubSpot shop and want one platform for everything.

#### Linear (for Engineering Tickets)

- **Best for:** Engineering-facing tickets (bug reports escalated from support, internal tooling requests).
- **API quality:** Excellent GraphQL API. Fast, well-designed.
- **Automation:** Workflow automations, SLA tracking, triage workflows.
- **Reporting:** Cycle analytics, throughput metrics. Engineering-focused.
- **Pricing:** Free for small teams. Standard at $8/user/month.
- **Strengths:** Best-in-class UX for engineering workflows, fast, great keyboard shortcuts.
- **Weaknesses:** Not designed for customer-facing support. No customer portal. No multi-channel inbox.
- **Pick when:** You need a system for engineering tickets that are escalated from your customer-facing support platform. Use alongside (not instead of) a customer support platform.

### Webhook Architecture

Webhooks are the backbone of platform integration. Get this right or suffer silent data drift.

#### Inbound Webhooks (Platform to Your App)

Subscribe to these events at minimum:

- **ticket.created** — Log in your analytics, trigger internal notifications, sync to your database if needed.
- **ticket.updated** — Status changes, priority changes, assignment changes. Filter for the fields you care about.
- **ticket.resolved / ticket.closed** — Trigger CSAT survey, update customer health score, close related internal tasks.
- **ticket.reopened** — Critical signal. Update SLA timers, re-alert assigned agent, log reopen reason.
- **comment.added** — Sync agent responses to your internal tools if needed. Usually not required.

#### Outbound Webhooks (Your App to Platform)

Common triggers from your product:

- **User action triggers ticket creation** — e.g., user clicks "Report a bug" in your app, ticket created via API with pre-populated context (user ID, account plan, browser info, recent actions).
- **System event triggers ticket update** — e.g., deployment completes, auto-comment on related tickets: "Fix deployed in v2.4.1."
- **Customer status change triggers ticket update** — e.g., customer upgrades plan, update priority on open tickets.

#### Reliability Requirements

```
Webhook Processing Checklist:
─────────────────────────────
[ ] Idempotency: Process each webhook event exactly once.
    Use event ID or delivery ID as idempotency key.
    Store processed event IDs for at least 72 hours.

[ ] Retry handling: Your endpoint MUST return 2xx within 5 seconds.
    If processing takes longer, accept the webhook, queue it,
    process async, return 200 immediately.

[ ] Signature verification: Validate webhook signatures (HMAC)
    to prevent spoofed events. Every major platform supports this.

[ ] Ordering: Do NOT assume webhooks arrive in order.
    Use timestamps on the event payload, not arrival order.

[ ] Failure alerting: Monitor webhook processing failures.
    If your endpoint is down, you are missing customer events silently.

[ ] Dead letter queue: Failed webhook payloads go to a DLQ
    for manual inspection and replay.
```

### API Integration Patterns

#### Create Ticket from Your App

Regardless of platform, the pattern is the same:

1. User triggers ticket creation in your product (bug report button, contact form, automated alert).
2. Your backend collects context: user ID, account details, browser/device info, recent actions, error logs.
3. API call to ticketing platform with pre-populated fields.
4. Store the external ticket ID in your database for cross-reference.
5. Return ticket URL/ID to user for tracking.

**Critical: always include customer context.** The number-one complaint from support agents is tickets with no context. Auto-populate everything you can: account plan, last login, feature flags, recent errors, subscription status. This alone can cut resolution time by 30%.

#### Sync Ticket Status Bidirectionally

- **Direction 1 (Platform to App):** Webhook on status change updates your internal records. Use this for customer-facing status displays ("Your issue is being worked on").
- **Direction 2 (App to Platform):** When your system resolves an issue automatically (e.g., auto-scaling fixes a performance ticket), update the ticket via API with a resolution comment.
- **Conflict resolution:** The ticketing platform is the source of truth for ticket status. Your app is the source of truth for customer/product data. Do not fight this.

#### Pull Ticket Data for Analytics

- **Batch export:** Schedule nightly/weekly data pulls for analytics warehouse. Most platforms support CSV export or paginated API endpoints.
- **Real-time metrics:** Use webhooks to maintain a real-time metrics cache (open ticket count, avg response time today, SLA breach count).
- **Do not:** Hit the platform API on every dashboard page load. Cache aggressively. Platform rate limits will punish you.

### Data Sync Strategies

| Strategy | Latency | Complexity | Best For |
|---|---|---|---|
| Real-time (webhooks) | < 1 minute | Medium | Status sync, notifications, SLA tracking |
| Near-real-time (polling every 1-5 min) | 1-5 minutes | Low | Dashboard metrics, non-critical sync |
| Batch (nightly export) | Up to 24 hours | Low | Analytics warehouse, reporting |
| Event-driven + batch hybrid | < 1 minute for critical, daily for bulk | Medium-High | Best of both — recommended approach |

**Recommended approach:** Use webhooks for critical events (ticket created, status changed, SLA breached) and batch sync for analytics data. This gives you real-time responsiveness where it matters and avoids the complexity of making every data point real-time.

---

## Custom Build Path

Only proceed here if you have validated through the decision tree that integration genuinely does not work. What follows is a production-grade specification.

### Data Model

```sql
-- Core ticket table
CREATE TABLE tickets (
    id                  BIGSERIAL PRIMARY KEY,
    external_id         UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    customer_id         BIGINT NOT NULL REFERENCES customers(id),
    subject             VARCHAR(500) NOT NULL,
    description         TEXT NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'open',
    priority            VARCHAR(20) NOT NULL DEFAULT 'normal',
    category            VARCHAR(100),
    subcategory         VARCHAR(100),
    assigned_agent_id   BIGINT REFERENCES agents(id),
    assigned_team       VARCHAR(100),
    tags                TEXT[] DEFAULT '{}',
    custom_fields       JSONB DEFAULT '{}',
    sla_policy_id       BIGINT REFERENCES sla_policies(id),
    channel             VARCHAR(50) NOT NULL,           -- email, chat, web, api, phone
    first_response_at   TIMESTAMPTZ,
    resolved_at         TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    reopened_count       INT NOT NULL DEFAULT 0,
    satisfaction_rating  SMALLINT,                      -- 1-5, null until rated
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'pending', 'on_hold', 'resolved', 'closed')),
    CONSTRAINT valid_priority CHECK (priority IN ('critical', 'high', 'normal', 'low'))
);

CREATE INDEX idx_tickets_status ON tickets(status) WHERE status NOT IN ('resolved', 'closed');
CREATE INDEX idx_tickets_assigned_agent ON tickets(assigned_agent_id) WHERE status NOT IN ('resolved', 'closed');
CREATE INDEX idx_tickets_customer ON tickets(customer_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_sla_policy ON tickets(sla_policy_id) WHERE status NOT IN ('resolved', 'closed');

-- Ticket comments (agent replies, customer replies, internal notes)
CREATE TABLE ticket_comments (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    author_type     VARCHAR(20) NOT NULL,              -- 'agent', 'customer', 'system'
    author_id       BIGINT NOT NULL,
    content         TEXT NOT NULL,
    content_html    TEXT,                               -- rendered HTML for rich content
    is_internal     BOOLEAN NOT NULL DEFAULT FALSE,     -- internal notes not visible to customer
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_author_type CHECK (author_type IN ('agent', 'customer', 'system'))
);

CREATE INDEX idx_comments_ticket ON ticket_comments(ticket_id, created_at);

-- File attachments
CREATE TABLE ticket_attachments (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    comment_id      BIGINT REFERENCES ticket_comments(id) ON DELETE SET NULL,
    filename        VARCHAR(500) NOT NULL,
    mime_type       VARCHAR(200) NOT NULL,
    size_bytes      BIGINT NOT NULL,
    storage_url     TEXT NOT NULL,                      -- S3/GCS URL
    uploaded_by     BIGINT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT max_file_size CHECK (size_bytes <= 26214400)   -- 25 MB max
);

-- Tags (normalized for querying)
CREATE TABLE ticket_tags (
    ticket_id       BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    tag             VARCHAR(100) NOT NULL,
    PRIMARY KEY (ticket_id, tag)
);

CREATE INDEX idx_tags_tag ON ticket_tags(tag);

-- Custom field definitions (per-category or global)
CREATE TABLE ticket_custom_field_definitions (
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(100) NOT NULL UNIQUE,
    display_name            VARCHAR(200) NOT NULL,
    field_type              VARCHAR(50) NOT NULL,        -- text, number, dropdown, checkbox, date
    options                 JSONB,                       -- for dropdown: ["option1", "option2"]
    required                BOOLEAN NOT NULL DEFAULT FALSE,
    applies_to_categories   TEXT[],                      -- null = all categories
    sort_order              INT NOT NULL DEFAULT 0,

    CONSTRAINT valid_field_type CHECK (field_type IN ('text', 'number', 'dropdown', 'checkbox', 'date', 'multiselect'))
);

-- Full audit trail — every field change on every ticket
CREATE TABLE ticket_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    field_changed   VARCHAR(100) NOT NULL,
    old_value       TEXT,
    new_value       TEXT,
    changed_by      BIGINT NOT NULL,
    changed_by_type VARCHAR(20) NOT NULL,               -- 'agent', 'customer', 'system', 'automation'
    change_reason   TEXT,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_ticket ON ticket_audit_log(ticket_id, changed_at);

-- SLA policies
CREATE TABLE sla_policies (
    id                              SERIAL PRIMARY KEY,
    name                            VARCHAR(100) NOT NULL,
    priority                        VARCHAR(20) NOT NULL,
    first_response_target_minutes   INT NOT NULL,
    next_response_target_minutes    INT,                 -- time between agent replies
    resolution_target_minutes       INT NOT NULL,
    business_hours_only             BOOLEAN NOT NULL DEFAULT TRUE,
    business_hours_start            TIME DEFAULT '09:00',
    business_hours_end              TIME DEFAULT '17:00',
    business_days                   INT[] DEFAULT '{1,2,3,4,5}',  -- Monday=1 through Friday=5
    timezone                        VARCHAR(50) DEFAULT 'UTC',

    CONSTRAINT valid_sla_priority CHECK (priority IN ('critical', 'high', 'normal', 'low'))
);

-- SLA timers (active tracking per ticket)
CREATE TABLE sla_timers (
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sla_policy_id   INT NOT NULL REFERENCES sla_policies(id),
    timer_type      VARCHAR(50) NOT NULL,               -- 'first_response', 'next_response', 'resolution'
    target_minutes  INT NOT NULL,
    elapsed_minutes INT NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ NOT NULL,
    paused_at       TIMESTAMPTZ,                        -- paused when ticket is pending/on_hold
    breached        BOOLEAN NOT NULL DEFAULT FALSE,
    breached_at     TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,

    CONSTRAINT valid_timer_type CHECK (timer_type IN ('first_response', 'next_response', 'resolution'))
);

CREATE INDEX idx_sla_timers_active ON sla_timers(ticket_id) WHERE completed_at IS NULL AND breached = FALSE;
```

**Design decisions baked in:**

- `external_id` as UUID for public-facing references — never expose sequential IDs to customers.
- `custom_fields` as JSONB for flexibility without schema migrations per field. Validate against `ticket_custom_field_definitions` in application code.
- `is_internal` on comments for agent-to-agent notes that customers must never see. Get this wrong and you leak internal discussions.
- Audit log captures every change. This is non-negotiable for compliance and debugging.
- SLA timers track elapsed business minutes, pausing when tickets are in waiting states. This is the hardest part to implement correctly — business-hours calculation with timezone awareness is full of edge cases.

### Status Workflow Engine

Build a configurable state machine. Hard-coding status transitions will haunt you within months.

```
Allowed Transitions (Default Workflow):
────────────────────────────────────────

  open ──────────► in_progress ──────────► resolved ──────────► closed
   │                    │                      │                   │
   │                    ▼                      │                   │
   │               pending ◄──────────────────┘                   │
   │               (waiting on customer)                          │
   │                    │                                         │
   │                    ▼                                         │
   │               on_hold                                        │
   │               (waiting on third party)                       │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘
                    (reopen: closed → open)

Auto-Transitions:
  - pending → auto-close after {{TICKET_AUTO_CLOSE_DAYS}} days (default: 7)
    of no customer response. Send warning email at day 5.
  - resolved → closed after {{TICKET_RESOLVE_TO_CLOSE_DAYS}} days (default: 3)
    if customer does not reopen.
  - Customer reply on "pending" → auto-transition to "open" (re-enters queue).
  - Customer reply on "resolved" → auto-transition to "open" (reopen).
    Increment reopened_count. Alert assigned agent.
```

**Implementation guidance:**

- Store transitions as a configuration table, not code. Each row: `from_status`, `to_status`, `allowed_roles` (agent, customer, system), `side_effects` (list of hook names).
- Side effects on transition: update SLA timers (pause on pending/on_hold, resume on open/in_progress), send customer notification, log to audit trail, trigger webhooks to external systems.
- Time-based transitions run as a scheduled job (every 5 minutes). Query tickets in `pending` or `resolved` status where the time threshold has passed.
- Every auto-transition adds a system comment explaining why the status changed. Customers seeing a ticket silently close is a terrible experience.

### Assignment and Priority Logic

#### Auto-Assignment Rules

Configure per-team. Common strategies:

1. **Round-robin:** Distribute tickets evenly across available agents. Track last-assigned agent per team. Skip agents who are offline, on break, or at capacity.

2. **Skill-based:** Match ticket category/tags to agent skills. A billing ticket goes to an agent tagged with "billing" skill. Fallback to round-robin within the skill group.

3. **Load-balanced:** Assign to the agent with the fewest open tickets. Weight by ticket priority (a P1 counts as 3 tickets, P2 as 2, etc.) to avoid giving one agent all the hard tickets.

4. **Hybrid (recommended):** Filter by skill first, then load-balance within the skill group. This ensures the right person gets the ticket AND workload stays even.

**Capacity limits:** Set a max open ticket count per agent. When all agents in a skill group are at capacity, ticket enters an unassigned queue and triggers an alert to the team lead.

#### Priority Matrix

Urgency x Impact = Priority. This is not optional — without a defined matrix, every ticket becomes "urgent."

| | Low Impact (cosmetic, single user) | Medium Impact (feature degraded, workaround exists) | High Impact (feature broken, no workaround) | Critical Impact (production down, data loss) |
|---|---|---|---|---|
| **Low Urgency** (can wait) | P4 | P4 | P3 | P2 |
| **Medium Urgency** (business impacted) | P4 | P3 | P2 | P1 |
| **High Urgency** (time-sensitive) | P3 | P2 | P1 | P1 |

**SLA targets by priority:**

| Priority | First Response | Next Response | Resolution | Escalation |
|---|---|---|---|---|
| P1 (Critical) | 15 minutes | 1 hour | 4 hours | Immediate to engineering lead |
| P2 (High) | 1 hour | 4 hours | 8 business hours | After 4 hours unresolved |
| P3 (Normal) | 4 business hours | 8 business hours | 3 business days | After 2 days unresolved |
| P4 (Low) | 1 business day | 2 business days | 5 business days | After 4 days unresolved |

#### Auto-Priority Detection

Infer priority from signals when the customer does not set it (most customers either set everything to "urgent" or do not set priority at all):

- **Keyword detection:** "can't access", "data missing", "data loss", "production", "down", "outage", "security", "breach" → boost to P2 minimum.
- **Customer plan:** Enterprise customers → boost by one level (P3 becomes P2). Configurable per plan via `{{PRIORITY_BOOST_PLANS}}`.
- **Repeated contacts:** Customer has submitted 3+ tickets in 24 hours on the same topic → boost to P2.
- **Sentiment analysis (optional):** Negative sentiment score above threshold → boost by one level. Only if you have an ML pipeline; do not build one just for this.
- **System-generated tickets:** Automated monitoring alerts → set priority based on alert severity mapping.

### Customer-Facing Ticket Portal

If you build custom, you must build a portal. Customers who cannot see their ticket status will email you asking for updates, creating more tickets.

#### Required Features

1. **Ticket list:** Filterable by status (open, resolved, all). Show subject, status badge, priority, last updated timestamp, assigned agent name. Paginated. Default sort: last updated descending.

2. **Create ticket form:**
   - Category dropdown (drives which custom fields appear).
   - Subject (required, 10-500 chars).
   - Description (required, rich text editor with markdown support).
   - Priority (optional — if omitted, auto-detect).
   - Attachments (drag-and-drop, max 5 files, max 25 MB each).
   - Pre-populated context: inject user ID, account plan, browser info, and recent error logs automatically. Do not make the customer provide information you already have.

3. **Ticket detail view:**
   - Full conversation thread (customer and agent messages, excluding internal notes).
   - Status timeline ("Created → Assigned to Agent Name → In Progress → ...").
   - Reply box with rich text and attachment support.
   - SLA commitment display: "Expected response within X hours" based on active SLA timer.

4. **Authentication:**
   - Primary: SSO with your product. Customer logs into your app, portal is a section within it.
   - Secondary: Magic link via email for customers who cannot log in (their issue may be that login is broken).
   - Tertiary: Ticket ID + email verification for non-user reporters (e.g., someone reported a bug via a public form).

5. **Notifications:**
   - Email notification on every agent reply (with reply-by-email support — customer replies to the email, it becomes a ticket comment).
   - Email notification on status change (with human-readable explanation, not just "Status changed to resolved").
   - Optional: in-app notification badge showing open ticket count.

---

## Advanced Ticket Operations

These operations are table stakes for any ticketing system at scale. If you are on the integration path, verify your chosen platform supports all of them.

### Merge Tickets

**When:** Duplicate tickets from the same customer about the same issue. Common when customers email and also submit a web form, or when they follow up by creating a new ticket instead of replying.

**Process:**
1. Agent selects the primary ticket (usually the older one with more context).
2. Agent selects one or more secondary tickets to merge into it.
3. System appends all comments from secondary tickets into the primary, with timestamps preserved and a system note: "Merged from ticket #XYZ."
4. Secondary tickets are closed with status "merged" and a link to the primary.
5. Customer is notified: "Your tickets have been combined for faster resolution. Track your issue at [primary ticket link]."
6. SLA timer: use the earliest creation time across all merged tickets. The customer should not be penalized for your system creating duplicates.

**Guardrails:**
- Cannot merge tickets from different customers (data leak risk).
- Merge is irreversible — log everything to audit trail.
- Merged ticket inherits the highest priority among all merged tickets.

### Link Tickets

**When:** Related but separate issues. Most common: same bug reported by multiple customers.

**Link types:**
- **related-to:** Informational. "These tickets are about similar topics."
- **blocked-by:** This ticket cannot be resolved until the linked ticket is resolved.
- **duplicate-of:** Same as merge but without combining — useful when different customers report the same issue and each needs individual communication.
- **parent-child:** A bulk issue (parent) with individual customer tickets (children).

**Parent-child pattern for incidents:**
1. Engineering creates a parent ticket for the incident (or it is auto-created from monitoring).
2. Individual customer tickets reporting the same issue are linked as children.
3. Agents respond to children with templated update: "We are aware of this issue and our engineering team is working on it. Follow-up ETA: [time]."
4. When the parent is resolved (fix deployed), all children auto-transition to resolved with a system comment: "The underlying issue has been resolved. [Link to status page update]."
5. Each child customer receives individual notification.

### Split Tickets

**When:** Customer reports multiple unrelated issues in one ticket. The billing question and the bug report need to go to different teams.

**Process:**
1. Agent selects specific comments that relate to the new issue.
2. System creates a new ticket with those comments, linked to the original as "split-from."
3. New ticket gets its own category, priority, and assignment.
4. Original ticket gets a system note: "Part of this ticket was split into #XYZ for separate handling."
5. Customer is notified about the new ticket.

**When NOT to split:** If the issues are related or the customer will be confused by tracking two tickets. Use judgment.

### Bulk Operations

**Use cases:**
- Incident affects 50 customers: bulk-create linked child tickets from a customer list.
- Incident resolved: bulk-resolve all child tickets with a resolution comment.
- Organizational change: bulk-reassign one agent's tickets to another (agent leaving, team restructure).
- Cleanup: bulk-close stale tickets older than 90 days with no activity.
- Tagging: bulk-add a tag to tickets matching a search query.

**Safety requirements:**
- Preview before execute: show the list of affected tickets and the action that will be taken. Require explicit confirmation.
- Maximum batch size: 500 tickets per bulk operation. Larger batches must be split and processed sequentially to avoid overwhelming the system and notification pipeline.
- Audit trail: log the bulk operation as a single audit event with the list of affected ticket IDs.
- Undo window: 5-minute undo window for bulk operations. Queue customer notifications with a 5-minute delay so they can be cancelled if the bulk action is undone.
- Role restriction: bulk operations require team lead or admin role. Individual agents should not be able to bulk-modify tickets outside their assignment.

---

## Ticket Lifecycle Analytics

You cannot improve what you do not measure. These metrics are non-negotiable for any support operation, regardless of whether you integrate or build custom.

### Key Metrics

#### Response Metrics
- **Time to first response** (by priority, team, agent): The single most important support metric. Measures how long a customer waits before hearing from a human. Target: within SLA for each priority level.
- **Time between responses** (next response time): How long between each agent reply in an ongoing conversation. Long gaps signal agent overload or deprioritization.

#### Resolution Metrics
- **Time to resolution** (by priority, team, category): Total elapsed time from creation to resolution. Break down by category to identify which issue types take longest.
- **First contact resolution rate:** Percentage of tickets resolved in a single agent response without follow-up. Target: 40-60% depending on product complexity. Higher is better but do not sacrifice quality for speed.
- **Reopen rate:** Tickets resolved then reopened by the customer. Target: < 10%. Above 15% signals resolution quality problems.

#### Volume Metrics
- **Tickets created vs. resolved trend:** Plot daily/weekly. If created consistently exceeds resolved, your backlog is growing. This is a staffing or efficiency problem.
- **Category distribution:** What types of issues dominate? Use this to prioritize product fixes (if 30% of tickets are about the same bug, fix the bug) and KB article creation.
- **Channel distribution:** Where are tickets coming from? Email, chat, web form, API? Optimize the channels your customers actually use.

#### Agent Metrics
- **Agent workload distribution:** Are tickets evenly distributed or are some agents overloaded? Uneven distribution causes burnout and inconsistent response times.
- **Agent handle time:** Average time an agent spends actively working on a ticket (not wall-clock time, but active engagement time). Use for capacity planning.
- **Agent satisfaction ratings:** Per-agent CSAT scores. Identify coaching opportunities but do not use as a punitive metric without context.

#### Status Metrics
- **Time in each status:** How long do tickets spend in each status? Identifies bottleneck stages in your workflow.
- **Status transition frequency:** How often do tickets move between statuses? Excessive back-and-forth (open to pending to open to pending) signals process problems.

### Bottleneck Detection

Set up automated alerts for these patterns:

| Signal | Threshold | Root Cause | Action |
|---|---|---|---|
| Avg time in "Pending" > 48 hours | 48h | Customers not responding to agent questions | Improve follow-up automation, clarify agent questions, add self-service options |
| Avg time in "In Progress" > SLA target | Varies by priority | Agents overloaded or issues too complex | Hire, redistribute workload, improve tooling/documentation |
| Reopen rate > 15% | 15% | Incomplete resolutions | Agent training, require resolution notes, QA review process |
| First contact resolution < 40% | 40% | KB gaps, complex product, agent training needs | Invest in KB, improve agent onboarding, simplify product |
| Tickets created/day growing > 10% month-over-month | 10% MoM | Product quality issues, growth without scaling support | Product fixes, more self-service, hire agents |
| SLA breach rate > 5% for any priority | 5% | Capacity, routing, or priority issues | Review assignment rules, adjust SLA targets, add capacity |
| Unassigned ticket age > 30 minutes | 30 min | Assignment rules not working or all agents at capacity | Fix routing, increase capacity limits, add overflow team |

### Dashboard Requirements

Build (or configure, if on a platform) these dashboards:

1. **Real-time operations dashboard** (wall display in support area):
   - Open ticket count by priority
   - SLA timers approaching breach (countdown)
   - Unassigned tickets
   - Agent availability status
   - Tickets created in last hour vs. resolved in last hour

2. **Weekly review dashboard** (for team leads):
   - All key metrics with week-over-week trends
   - Top 10 ticket categories
   - Agent leaderboard (handle carefully — focus on team performance, not individual ranking)
   - SLA compliance percentage by priority

3. **Monthly executive dashboard** (for leadership):
   - Customer satisfaction trend
   - Support cost per ticket
   - Ticket volume vs. revenue (is support scaling linearly with growth?)
   - Top product areas generating tickets (input for product roadmap)

---

## Implementation Checklist

Use this checklist to track your ticketing system implementation. Items apply to both integration and custom build paths unless noted.

- [ ] Complete build vs. integrate decision tree — document the decision and rationale
- [ ] Set `{{CX_TICKETING_STRATEGY}}` to "integrate" or "build-custom" in placeholder registry
- [ ] Set `{{SUPPORT_PLATFORM}}` to chosen platform name (integration path) or "custom" (build path)

**Integration Path:**
- [ ] Choose platform based on comparison matrix and team needs
- [ ] Negotiate contract (annual commitment for better pricing, ensure API access tier)
- [ ] Configure ticket statuses, categories, custom fields, and SLA policies in platform
- [ ] Build webhook receiver endpoint with idempotency, signature verification, and DLQ
- [ ] Build API integration for ticket creation from your product (with auto-populated context)
- [ ] Build customer context sidebar app for agents (show account details in ticket view)
- [ ] Configure auto-assignment rules (skill-based + load-balanced)
- [ ] Set up reporting dashboards in platform
- [ ] Test end-to-end: ticket creation, assignment, response, resolution, reopening
- [ ] Train agents on platform workflow and keyboard shortcuts

**Custom Build Path:**
- [ ] Implement database schema (tickets, comments, attachments, audit log, SLA tables)
- [ ] Build status workflow engine with configurable state machine
- [ ] Implement SLA timer with business-hours calculation and timezone support
- [ ] Build auto-assignment engine (skill-based + load-balanced)
- [ ] Build agent UI: ticket list, ticket detail, reply, internal notes, merge/link/split
- [ ] Build customer-facing portal: ticket list, create, detail, reply
- [ ] Implement email integration: inbound (email creates ticket) and outbound (notifications)
- [ ] Build analytics pipeline and dashboards
- [ ] Load test: verify system handles 10x expected ticket volume
- [ ] Security review: ensure internal notes never leak to customers, audit trail is tamper-resistant

**Both Paths:**
- [ ] Define priority matrix (P1-P4) with SLA targets — get stakeholder sign-off
- [ ] Configure auto-priority detection rules
- [ ] Set up customer-facing ticket portal (or verify platform portal meets requirements)
- [ ] Implement ticket lifecycle analytics dashboard
- [ ] Test merge, link, and split operations
- [ ] Train agents on ticket management workflow and priority definitions
- [ ] Document runbook for SLA breach escalation
- [ ] Set up monitoring alerts for bottleneck detection thresholds
- [ ] Establish weekly metrics review cadence with team leads

---

*This decision tree is part of the Master Starter Kit. The ticketing system is infrastructure — it should be invisible to customers when working correctly and immediately obvious when broken. Invest accordingly: enough to be reliable, not so much that it distracts from your actual product.*
