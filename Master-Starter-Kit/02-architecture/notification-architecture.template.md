# Notification System Architecture — {{PROJECT_NAME}}

> Design the unified notification system that decides what to send, to whom, through which channel, with what preferences.

---

## Architecture Overview

```
Trigger Event                 Notification Service              Delivery
    │                              │                               │
    ├── user.created ─────────────►│                               │
    ├── invoice.paid ─────────────►│                               │
    ├── comment.added ────────────►│                               │
    │                              │                               │
    │                    ┌─────────┴──────────┐                    │
    │                    │  1. Route           │                    │
    │                    │  2. Check prefs     │                    │
    │                    │  3. Render template │                    │
    │                    │  4. Deliver         │                    │
    │                    └─────────┬──────────┘                    │
    │                              │                               │
    │                    ┌─────────┼──────────┐                    │
    │                    ▼         ▼          ▼                    │
    │                  Email     Push      In-App                  │
    │                (Resend)  (FCM/APNs) (Database)               │
```

---

## Decision Tree: Build vs. Buy

```
How many notification channels do you need?
  ├── 1 (email only) → Build it yourself. Just call Resend/SendGrid.
  │
  ├── 2-3 channels → Build a simple notification service (this template)
  │                   Time to build: 2-3 days
  │
  └── 4+ channels with complex routing →
      Consider a managed service:
        ├── Novu (open source, self-hostable)
        ├── Knock (managed, great DX)
        ├── Courier (enterprise features)
        └── Engagespot (in-app + push focused)
```

---

## Notification Types

Define every notification your product sends:

| ID | Type | Trigger | Channels | Priority |
|----|------|---------|----------|----------|
| `welcome` | Welcome message | `user.created` | Email | Normal |
| `invoice_paid` | Payment confirmation | `invoice.paid` | Email | Normal |
| `password_reset` | Password reset | `auth.password_reset` | Email | Urgent |
| `comment_reply` | Someone replied | `comment.created` | In-App, Email, Push | Normal |
| `mention` | User was mentioned | `mention.created` | In-App, Push | Normal |
| `task_assigned` | Task assigned to user | `task.assigned` | In-App, Email | Normal |
| `system_alert` | System notification | `system.alert` | In-App | Urgent |
| `dunning` | Payment failed | `invoice.payment_failed` | Email, In-App | Urgent |
| {{ID}} | {{TYPE}} | {{TRIGGER}} | {{CHANNELS}} | {{PRIORITY}} |

---

## User Preference Schema

```sql
CREATE TABLE notification_preferences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  category    TEXT NOT NULL,      -- 'comments', 'tasks', 'billing', 'marketing'
  channel     TEXT NOT NULL,      -- 'email', 'push', 'in_app'
  enabled     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, category, channel)
);

-- Default preferences (set on user creation)
-- Marketing: email OFF by default (opt-in)
-- Transactional: all channels ON by default (opt-out)
-- Security: email always ON, cannot be disabled
```

### Preference Categories

| Category | Default Email | Default Push | Default In-App | Can Disable? |
|----------|:---:|:---:|:---:|:---:|
| Security (password reset, login alerts) | ON | - | ON | No (required) |
| Billing (invoices, payment failures) | ON | - | ON | Email: No |
| Comments & Mentions | ON | ON | ON | Yes |
| Task Updates | ON | ON | ON | Yes |
| Product Updates | OFF | OFF | ON | Yes |
| Marketing | OFF | OFF | OFF | Yes |

---

## Notification Service Implementation

```typescript
// services/notification.ts

interface NotificationPayload {
  type: string;           // 'comment_reply', 'task_assigned', etc.
  recipientId: string;
  data: Record<string, unknown>;  // Template variables
  priority?: 'normal' | 'urgent';
}

async function sendNotification(payload: NotificationPayload): Promise<void> {
  const { type, recipientId, data, priority = 'normal' } = payload;

  // 1. Get notification config
  const config = NOTIFICATION_CONFIGS[type];
  if (!config) throw new Error(`Unknown notification type: ${type}`);

  // 2. Get user preferences
  const preferences = await getUserPreferences(recipientId, config.category);

  // 3. Deliver to each enabled channel
  for (const channel of config.channels) {
    // Skip if user disabled this channel (unless non-disablable)
    if (!config.required && !preferences[channel]) continue;

    // Skip push if user has no device tokens
    if (channel === 'push') {
      const tokens = await getDeviceTokens(recipientId);
      if (tokens.length === 0) continue;
    }

    // Queue delivery (don't deliver inline)
    await notificationQueue.add(`${type}:${channel}`, {
      type,
      channel,
      recipientId,
      data,
      priority,
    });
  }
}
```

---

## Channel Implementations

### Email (via Resend / SendGrid)

```typescript
async function deliverEmail(notification: QueuedNotification): Promise<void> {
  const user = await getUser(notification.recipientId);
  const template = getEmailTemplate(notification.type);

  await resend.emails.send({
    from: `${PROJECT_NAME} <notifications@${DOMAIN}>`,
    to: user.email,
    subject: template.subject(notification.data),
    html: template.render(notification.data),
  });
}
```

### In-App Notifications

```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB DEFAULT '{}',   -- Deep link, entity references, etc.
  read        BOOLEAN NOT NULL DEFAULT false,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
  ON notifications (user_id, created_at DESC)
  WHERE read = false;
```

```typescript
// API: Get unread notifications
const unreadNotifications = await db.query.notifications.findMany({
  where: and(
    eq(notifications.userId, ctx.user.id),
    eq(notifications.read, false),
  ),
  orderBy: desc(notifications.createdAt),
  limit: 20,
});

// API: Mark as read
await db.update(notifications)
  .set({ read: true, readAt: new Date() })
  .where(and(
    eq(notifications.userId, ctx.user.id),
    inArray(notifications.id, notificationIds),
  ));
```

### Push Notifications (via FCM / APNs)

```typescript
async function deliverPush(notification: QueuedNotification): Promise<void> {
  const tokens = await getDeviceTokens(notification.recipientId);

  for (const token of tokens) {
    await firebase.messaging().send({
      token: token.token,
      notification: {
        title: getTitle(notification.type, notification.data),
        body: getBody(notification.type, notification.data),
      },
      data: {
        type: notification.type,
        ...notification.data,
      },
    });
  }
}
```

---

## Rate Limiting & Digest

### Prevent Notification Fatigue

| Rule | Implementation |
|------|---------------|
| **Max per hour** | 10 notifications per user per hour (batch excess into digest) |
| **Quiet hours** | No push/email during user's quiet hours (default: 10PM-8AM local) |
| **Digest batching** | Group related notifications (e.g., "5 new comments" instead of 5 separate notifications) |
| **Deduplication** | Don't send "new comment" if user is currently viewing the thread |

```typescript
// Check rate limit before sending
async function shouldSend(userId: string, channel: string): Promise<boolean> {
  const recentCount = await getRecentNotificationCount(userId, channel, '1 hour');

  if (recentCount >= MAX_PER_HOUR) {
    // Queue for digest instead
    await addToDigest(userId, channel);
    return false;
  }

  return true;
}
```

---

## Notification Preferences UI

```
┌─ Notification Settings ──────────────────────────────┐
│                                                       │
│  Comments & Mentions                                  │
│    Email    [✓]    Push    [✓]    In-App   [✓]       │
│                                                       │
│  Task Updates                                         │
│    Email    [✓]    Push    [ ]    In-App   [✓]       │
│                                                       │
│  Billing                                              │
│    Email    [✓]    (required)                         │
│                                                       │
│  Product Updates                                      │
│    Email    [ ]    Push    [ ]    In-App   [✓]       │
│                                                       │
│  Marketing                                            │
│    Email    [ ]                                       │
│                                                       │
│  ─── Advanced ───                                     │
│  Quiet Hours: 10:00 PM - 8:00 AM (EST)              │
│  Digest: Send hourly summary instead of individual   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

---

## Checklist

- [ ] All notification types cataloged (type, trigger, channels, priority)
- [ ] User preference schema created
- [ ] Default preferences defined (opt-in for marketing, opt-out for transactional)
- [ ] Notification service implemented with channel routing
- [ ] Email delivery configured (Resend / SendGrid)
- [ ] In-app notification table and API created
- [ ] Push notification setup (if mobile app)
- [ ] Rate limiting implemented (max per hour, quiet hours)
- [ ] Digest batching for high-volume notification types
- [ ] Notification preferences UI built
- [ ] Unsubscribe link in all marketing emails (CAN-SPAM / GDPR)
- [ ] Security notifications cannot be disabled
