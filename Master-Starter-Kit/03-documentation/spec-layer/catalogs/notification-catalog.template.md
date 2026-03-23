# Notification Catalog

> **Purpose:** Consolidated catalog of ALL notifications across all services in {{PROJECT_NAME}}.
> Every notification the system can send — push, email, SMS, in-app — is registered here.
> If a notification is not in this catalog, it does not exist.
>
> **Target:** 80-120 notifications across all services.

---

## How to Use This Catalog

1. **During spec writing:** When a service spec mentions "notify the user," add the notification here with a unique ID.
2. **During implementation:** Developers reference this catalog to build notification templates and routing logic.
3. **During testing:** QA uses this catalog as a checklist — every notification must be triggerable and verified.
4. **Cross-reference:** Every notification trigger in a service spec must map to an entry here. The CROSS-REFERENCE-VALIDATOR checks this.

---

## Notification ID Convention

Format: `NOTIF-{SERVICE_CODE}-{SEQUENCE}`

- `SERVICE_CODE`: 2-4 letter abbreviation of the service (e.g., `AUTH`, `BIL`, `ORD`)
- `SEQUENCE`: 3-digit zero-padded number (e.g., `001`, `042`)

Example: `NOTIF-AUTH-001` = first notification in the Auth service.

---

## Notification Registry

| ID | Event | Recipient Roles | Channels | Template Text (Summary) | Priority | Service | Trigger Condition |
|----|-------|-----------------|----------|--------------------------|----------|---------|-------------------|
| `NOTIF-AUTH-001` | {{EVENT_NAME}} | {{RECIPIENT_ROLES}} | {{CHANNELS}} | {{TEMPLATE_SUMMARY}} | {{PRIORITY}} | {{SERVICE_NAME}} | {{TRIGGER_CONDITION}} |
| `NOTIF-AUTH-002` | {{EVENT_NAME}} | {{RECIPIENT_ROLES}} | {{CHANNELS}} | {{TEMPLATE_SUMMARY}} | {{PRIORITY}} | {{SERVICE_NAME}} | {{TRIGGER_CONDITION}} |
| `NOTIF-AUTH-003` | {{EVENT_NAME}} | {{RECIPIENT_ROLES}} | {{CHANNELS}} | {{TEMPLATE_SUMMARY}} | {{PRIORITY}} | {{SERVICE_NAME}} | {{TRIGGER_CONDITION}} |
<!-- Repeat for every notification. Target: 80-120 rows total across all services. -->
<!-- Group rows by service. Add a row-spanning header comment between service groups. -->

### Channel Key

| Code | Channel | Delivery Mechanism | Latency Target |
|------|---------|-------------------|----------------|
| `push` | Push notification | {{PUSH_PROVIDER}} (e.g., FCM, APNs) | < 5 seconds |
| `email` | Email | {{EMAIL_PROVIDER}} (e.g., SendGrid, SES) | < 2 minutes |
| `sms` | SMS | {{SMS_PROVIDER}} (e.g., Twilio) | < 30 seconds |
| `in-app` | In-app notification center | WebSocket / polling | Real-time |

### Priority Levels

| Priority | Description | Delivery Guarantee | Example |
|----------|-------------|-------------------|---------|
| `critical` | Must reach user immediately, all channels | At-least-once, retry 3x | Payment failed, account compromised |
| `high` | Important, preferred channels | At-least-once | Assignment changed, approval needed |
| `medium` | Informational, user's preferred channel | Best-effort with retry | Status update, new comment |
| `low` | Background, batched OK | Best-effort, batchable | Weekly digest, tip of the day |

---

## Notification Rules

### Deduplication

| Rule | Description |
|------|-------------|
| Same-event window | If the same notification (same ID + same recipient + same entity) fires within {{DEDUP_WINDOW_MINUTES}} minutes, suppress the duplicate |
| Batch threshold | If >{{BATCH_THRESHOLD}} notifications of the same type queue for one recipient within {{BATCH_WINDOW_MINUTES}} minutes, collapse into a single digest notification |
| Rate limit per user | Maximum {{MAX_NOTIFICATIONS_PER_HOUR}} notifications per user per hour across all channels. Overflow queued for next window |

### Quiet Hours

| Setting | Default | User-Configurable? |
|---------|---------|-------------------|
| Quiet hours start | {{QUIET_HOURS_START}} (e.g., 22:00) | Yes |
| Quiet hours end | {{QUIET_HOURS_END}} (e.g., 07:00) | Yes |
| Timezone source | User profile timezone | N/A |
| Critical override | Critical-priority notifications ignore quiet hours | No (always delivered) |
| Queue behavior | Non-critical notifications queued and delivered at quiet hours end | N/A |

### Escalation

| Trigger | Action | Timeline |
|---------|--------|----------|
| Critical notification unread after {{ESCALATION_MINUTES_1}} min | Re-send via next-priority channel (e.g., push -> SMS) | {{ESCALATION_MINUTES_1}} minutes |
| Critical notification unread after {{ESCALATION_MINUTES_2}} min | Escalate to {{ESCALATION_ROLE}} (e.g., team lead, admin) | {{ESCALATION_MINUTES_2}} minutes |
| Action-required notification unread after {{ACTION_DEADLINE_HOURS}} hours | Send reminder with "Action overdue" subject | {{ACTION_DEADLINE_HOURS}} hours |

---

## Notification Preferences (User-Configurable)

Each user can configure their notification preferences per category. Defaults shown below.

| Category | Push Default | Email Default | SMS Default | In-App Default | User Can Disable? |
|----------|-------------|---------------|-------------|----------------|-------------------|
| Account & Security | On | On | Off | On | No (security-critical) |
| {{NOTIFICATION_CATEGORY_1}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{YES_NO}} |
| {{NOTIFICATION_CATEGORY_2}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{YES_NO}} |
| {{NOTIFICATION_CATEGORY_3}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{DEFAULT}} | {{YES_NO}} |
| System Announcements | Off | On | Off | On | Yes |
<!-- Add one row per notification category. Categories group related notifications for user preference controls. -->

### Preference Storage

- Preferences stored in `{{USER_PREFERENCES_TABLE}}` table
- Default preferences applied on account creation via `{{DEFAULT_PREFS_SEED}}`
- Preference changes take effect immediately (no cache delay)
- Unsubscribe links in emails must work without authentication (tokenized)

---

## Template Variables

All notification templates can use these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{user.firstName}}` | Recipient's first name | `Sarah` |
| `{{user.email}}` | Recipient's email | `sarah@example.com` |
| `{{actor.firstName}}` | Person who triggered the action | `Mike` |
| `{{entity.type}}` | Type of entity involved | `Order` |
| `{{entity.id}}` | ID of entity involved | `ORD-2026-0042` |
| `{{entity.name}}` | Display name of entity | `Q1 Campaign` |
| `{{action.url}}` | Deep link to relevant screen | `https://app.{{PROJECT_SLUG}}.com/orders/42` |
| `{{app.name}}` | Application name | `{{PROJECT_NAME}}` |

---

## Completeness Checklist

- [ ] Every service spec notification trigger has a matching row in this catalog
- [ ] Every notification has at least one channel assigned
- [ ] Every critical notification has escalation rules defined
- [ ] Every notification category appears in the preferences table
- [ ] Template text reviewed for tone, clarity, and actionability
- [ ] SMS notifications are under 160 characters
- [ ] Email notifications have both HTML and plain-text variants specified
- [ ] Push notifications have both title (< 50 chars) and body (< 100 chars)
