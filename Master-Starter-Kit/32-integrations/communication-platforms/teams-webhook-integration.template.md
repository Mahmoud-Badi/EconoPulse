# {{PROJECT_NAME}} — Microsoft Teams Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Integration Type:** Incoming Webhooks / Bot Framework / Both
> **Last Updated:** {{DATE}}

---

## 1. Integration Scope

| Feature | Description | Approach |
|---------|-------------|----------|
| Send notifications to Teams channel | Alerts, status updates, reports | Incoming Webhook |
| Interactive messages with buttons | Approve/reject, acknowledge actions | Adaptive Cards |
| Respond to user messages | Conversational bot | Bot Framework |
| Tab/app integration | Embedded web app in Teams | Teams App (iframe) |

---

## 2. Incoming Webhooks (Simplest Approach)

### Setup

1. In Teams, go to the target channel → Manage Channel → Connectors
2. Add "Incoming Webhook" connector
3. Name it, upload an icon, click Create
4. Copy the webhook URL → store as `TEAMS_WEBHOOK_URL`

### Sending Messages

Send a POST request to the webhook URL with a JSON payload:

```
POST {{TEAMS_WEBHOOK_URL}}
Content-Type: application/json

{
  "@type": "MessageCard",
  "summary": "Deployment Notification",
  "themeColor": "0076D7",
  "title": "Deployment to Production",
  "sections": [{
    "activityTitle": "{{PROJECT_NAME}} v1.2.3",
    "facts": [
      { "name": "Environment", "value": "Production" },
      { "name": "Status", "value": "Success" },
      { "name": "Deployed by", "value": "@user" }
    ]
  }]
}
```

### Message Card vs. Adaptive Card

| Format | Support | Interactivity | Complexity |
|--------|---------|---------------|------------|
| **MessageCard** (O365 Connector) | Incoming Webhooks | Links only | Low |
| **Adaptive Card** | Bot Framework, Workflows | Buttons, forms, inputs | Medium |

**Note:** Incoming webhooks support MessageCard format. For Adaptive Cards with interactivity, you need Bot Framework or Power Automate/Workflows.

---

## 3. Adaptive Cards

### Card Templates

Define Adaptive Card templates for each notification type:

| Notification | Card Elements | Actions |
|-------------|---------------|---------|
| {{NOTIFICATION_1}} | TextBlock + FactSet | OpenUrl + Submit |
| {{NOTIFICATION_2}} | TextBlock + Image | OpenUrl |

### Adaptive Card Designer

Use the Adaptive Card Designer to build and preview cards: adaptivecards.io/designer

### Version Compatibility

| Teams Platform | Adaptive Card Version |
|---------------|----------------------|
| Desktop | 1.5 |
| Web | 1.5 |
| Mobile | 1.3 |
| Outlook | 1.2 |

**Target version 1.3** for broadest compatibility.

---

## 4. Notification Templates

### Alert Notification

```json
{
  "type": "message",
  "attachments": [{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.3",
      "body": [
        {
          "type": "TextBlock",
          "text": "🔴 {{ALERT_TITLE}}",
          "weight": "Bolder",
          "size": "Medium"
        },
        {
          "type": "FactSet",
          "facts": [
            { "title": "Severity", "value": "{{SEVERITY}}" },
            { "title": "Service", "value": "{{SERVICE}}" },
            { "title": "Time", "value": "{{TIMESTAMP}}" }
          ]
        }
      ],
      "actions": [
        {
          "type": "Action.OpenUrl",
          "title": "View Details",
          "url": "{{DETAILS_URL}}"
        }
      ]
    }
  }]
}
```

---

## 5. Power Automate / Workflows Integration

For more complex Teams integrations without building a full bot:

| Trigger | Action | Use Case |
|---------|--------|----------|
| HTTP request received | Post Adaptive Card to channel | Webhook-triggered notifications |
| Scheduled | Fetch data from API → post summary | Daily reports |
| Teams message | Call external API → respond | Simple conversational flows |

### Workflow Webhook

Power Automate Workflows can expose HTTP endpoints that accept JSON and post to Teams channels with full Adaptive Card support — a middle ground between simple incoming webhooks and full Bot Framework.

---

## 6. Rate Limits & Constraints

| Constraint | Limit |
|-----------|-------|
| Incoming webhook payload size | 28 KB |
| Messages per second (webhook) | ~4 messages per second |
| Adaptive Card version | 1.5 (desktop), 1.3 (mobile) |
| Bot messages per conversation | 3 per second |
| Bot messages across conversations | 30 per minute |

---

## 7. Security

- [ ] Webhook URLs stored securely (treat as secrets — anyone with the URL can post)
- [ ] Webhook URLs rotated if compromised (delete and recreate connector)
- [ ] Bot Framework: validate incoming requests via Bot Framework authentication
- [ ] No sensitive data in card payloads (cards may be forwarded or screenshotted)
- [ ] Audit log for all messages sent to Teams
