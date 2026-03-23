# {{PROJECT_NAME}} — Slack Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Slack App Name:** {{SLACK_APP_NAME}}
> **Distribution:** Single workspace / Multi-workspace (Slack App Directory)
> **Last Updated:** {{DATE}}

---

## 1. Integration Scope

### What This Slack Integration Does

| Feature | Description | Status |
|---------|-------------|--------|
| {{FEATURE_1}} | {{DESCRIPTION_1}} | Planned / In Progress / Done |
| {{FEATURE_2}} | {{DESCRIPTION_2}} | Planned / In Progress / Done |

### Slack Platform Features Used

| Feature | Used | Purpose |
|---------|------|---------|
| Incoming Webhooks | Yes / No | Send notifications to Slack channels |
| Slash Commands | Yes / No | `/{{COMMAND}}` — trigger actions from Slack |
| Interactive Messages (Buttons, Menus) | Yes / No | User actions within Slack messages |
| Events API | Yes / No | React to Slack events (messages, reactions, channel joins) |
| Block Kit | Yes / No | Rich message formatting |
| Modals | Yes / No | Forms and dialogs within Slack |
| Home Tab | Yes / No | App home screen for users |
| Bolt Framework | Yes / No | Slack's official framework for app development |

---

## 2. Slack App Configuration

### App Credentials

| Credential | Environment Variable | Purpose |
|-----------|---------------------|---------|
| Bot Token | `SLACK_BOT_TOKEN` | Authenticate API calls as the bot |
| Signing Secret | `SLACK_SIGNING_SECRET` | Verify incoming requests from Slack |
| App Token | `SLACK_APP_TOKEN` | Socket Mode connections (if used) |
| Client ID | `SLACK_CLIENT_ID` | OAuth flow for multi-workspace distribution |
| Client Secret | `SLACK_CLIENT_SECRET` | OAuth flow for multi-workspace distribution |

### Required Scopes (Bot Token)

| Scope | Purpose | Required For |
|-------|---------|-------------|
| `chat:write` | Send messages to channels | Notifications |
| `commands` | Register slash commands | Slash commands |
| `app_mentions:read` | Read messages that mention the bot | @bot mentions |
| `channels:read` | List public channels | Channel selection UI |
| `users:read` | Read user information | User profile display |
| `reactions:write` | Add emoji reactions | Reaction-based acknowledgment |
| {{ADDITIONAL_SCOPE}} | {{PURPOSE}} | {{FEATURE}} |

### Event Subscriptions

| Event | Payload | Handler |
|-------|---------|---------|
| `app_mention` | User @mentions the bot | `handleMention` |
| `message.channels` | New message in a channel | `handleMessage` |
| `member_joined_channel` | User joins a channel | `handleMemberJoined` |
| {{CUSTOM_EVENT}} | {{DESCRIPTION}} | {{HANDLER}} |

---

## 3. Slash Commands

| Command | Description | Response Type | Parameters |
|---------|-------------|---------------|------------|
| `/{{COMMAND_1}}` | {{DESCRIPTION}} | Ephemeral / In-channel | `{{PARAMS}}` |
| `/{{COMMAND_2}}` | {{DESCRIPTION}} | Ephemeral / In-channel | `{{PARAMS}}` |

### Command Response Patterns

- **Ephemeral response:** Only visible to the user who invoked the command. Use for confirmations, status checks, and sensitive data.
- **In-channel response:** Visible to everyone in the channel. Use for shared information, reports, and actions that affect the team.
- **Deferred response:** Return 200 immediately, then use `response_url` to send the actual response within 30 minutes. Use for operations that take > 3 seconds.

---

## 4. Interactive Messages (Block Kit)

### Message Templates

Define Block Kit templates for each notification type:

| Notification | Blocks Used | Actions | Example |
|-------------|-------------|---------|---------|
| {{NOTIFICATION_1}} | Section + Actions | Approve / Reject buttons | "New deployment request from @user" |
| {{NOTIFICATION_2}} | Section + Context | View Details link | "Build #123 completed successfully" |

### Action Handling

```
User clicks button in Slack message
  → Slack sends POST to your interaction endpoint
  → Verify request signature (signing secret)
  → Parse action payload (action_id, user, value)
  → Process the action (approve deployment, assign ticket, etc.)
  → Update the original message (replace buttons with confirmation)
  → Return 200 within 3 seconds
```

---

## 5. Architecture Decisions

### Socket Mode vs. HTTP

| Factor | HTTP (Events API) | Socket Mode |
|--------|-------------------|-------------|
| Requires public URL | Yes | No |
| Firewall-friendly | No (needs inbound) | Yes (outbound only) |
| Scalability | High (stateless) | Medium (WebSocket per instance) |
| Development | Needs ngrok for local | Works locally out of the box |
| Deployment | Standard web server | Persistent connection required |

**Selected mode:** {{SLACK_CONNECTION_MODE}}

### Multi-Workspace Distribution

If distributing via Slack App Directory:
- [ ] OAuth 2.0 flow implemented for workspace installation
- [ ] Token storage per workspace (database table for workspace tokens)
- [ ] Uninstall handler (`app_uninstalled` event)
- [ ] App listing with screenshots, description, and privacy policy
- [ ] Slack security review completed

---

## 6. Rate Limits

| API Method | Rate Limit | Scope |
|-----------|-----------|-------|
| `chat.postMessage` | 1 per second per channel | Per token |
| `conversations.list` | 20 per minute | Per token |
| `users.list` | 20 per minute | Per token |
| Web API (general) | Varies by tier (Tier 1-4) | Per token |

### Handling Rate Limits

- Parse `Retry-After` header from 429 responses
- Queue outbound messages through job queue with rate limiter
- Batch operations where possible (e.g., `chat.postMessage` with multiple attachments vs. multiple messages)

---

## 7. Security & Compliance

- [ ] All incoming requests verified via signing secret
- [ ] Bot token stored securely (never in code or client-side)
- [ ] Minimum required scopes (principle of least privilege)
- [ ] Audit log for all bot actions (what the bot did, who triggered it, when)
- [ ] Data retention policy for messages/data received from Slack
- [ ] Privacy policy URL configured in Slack app settings
- [ ] No sensitive data stored from Slack messages (PII, credentials)
- [ ] Uninstall flow cleans up all stored data for that workspace
