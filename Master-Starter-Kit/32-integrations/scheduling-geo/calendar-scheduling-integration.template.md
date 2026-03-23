# {{PROJECT_NAME}} — Calendar & Scheduling Integration

> **Owner:** {{LEAD_DEVELOPER}}
> **Calendar Provider:** {{CALENDAR_PROVIDER}} (Google Calendar / Outlook Calendar / Calendly / Cal.com)
> **Last Updated:** {{DATE}}

---

## 1. Integration Scope

| Feature | Description | Priority |
|---------|-------------|----------|
| Read user availability | Query free/busy slots | P{{PRIORITY}} |
| Create events | Book meetings/appointments | P{{PRIORITY}} |
| Sync events bidirectionally | Keep calendar and app in sync | P{{PRIORITY}} |
| Send invitations | Calendar invites with RSVP | P{{PRIORITY}} |
| Booking page | Self-service scheduling link | P{{PRIORITY}} |
| Reminders | Pre-event notifications | P{{PRIORITY}} |

---

## 2. Provider Selection

### Direct Calendar API vs. Scheduling Platform

| Approach | Examples | Best For | Complexity |
|----------|---------|----------|------------|
| **Direct calendar API** | Google Calendar API, Microsoft Graph | Full control, deep integration | High |
| **Scheduling platform** | Calendly, Cal.com, SavvyCal | Booking pages, availability management | Low |
| **Hybrid** | Cal.com API + Google Calendar sync | Booking UX + calendar sync | Medium |

### Provider Comparison

| Feature | Google Calendar API | Microsoft Graph (Outlook) | Calendly API | Cal.com |
|---------|-------------------|--------------------------|-------------|---------|
| Free/busy query | ✅ | ✅ | Via API (paid plan) | ✅ |
| Create events | ✅ | ✅ | Create bookings | ✅ |
| Webhooks (push notifications) | ✅ (watch) | ✅ (subscriptions) | ✅ | ✅ |
| OAuth required | ✅ | ✅ | API key | API key or OAuth |
| Multi-calendar support | ✅ | ✅ | ✅ | ✅ |
| Booking page | ❌ (build custom) | ❌ (build custom) | ✅ (core feature) | ✅ (core feature) |
| Self-hosted option | ❌ | ❌ | ❌ | ✅ |
| Pricing | Free (quota-based) | Free (quota-based) | $10+/user/month | Free (self-hosted) |

---

## 3. Google Calendar Integration

### Authentication

```
OAuth 2.0 Scopes:
  - calendar.readonly      (read events, free/busy)
  - calendar.events        (create/modify events)
  - calendar.settings.readonly (user timezone)

Flow:
  1. User clicks "Connect Google Calendar"
  2. OAuth consent screen → user grants calendar access
  3. Receive access_token + refresh_token
  4. Store refresh_token (encrypted) for ongoing access
```

### Key Operations

| Operation | API Call | Rate Limit | Notes |
|-----------|---------|-----------|-------|
| List events | `GET /calendars/{id}/events` | 100 req/100s per user | Supports time range filter |
| Create event | `POST /calendars/{id}/events` | 100 req/100s per user | Returns event ID |
| Free/busy query | `POST /freeBusy` | Shared quota | Query multiple calendars at once |
| Watch for changes | `POST /calendars/{id}/events/watch` | — | Push notifications via webhook |
| Get event | `GET /calendars/{id}/events/{eventId}` | 100 req/100s per user | — |

### Push Notifications (Watch)

```
1. Register watch: POST /calendars/{calendarId}/events/watch
   Body: { id, type: "web_hook", address: "https://your-api.com/webhooks/gcal" }

2. Google sends sync notifications to your webhook URL when events change

3. On notification:
   - Fetch changed events since last sync token
   - Update your database
   - Acknowledge with 200

4. Watch expires after ~7 days → re-register automatically
```

### Timezone Handling

- Always work in UTC internally
- Use the user's calendar timezone for display
- Specify timezone in event creation (don't rely on server timezone)
- Handle daylight saving time transitions (events near DST boundary)

---

## 4. Scheduling Platform Integration (Calendly / Cal.com)

### Calendly API

| Operation | Endpoint | Purpose |
|-----------|---------|---------|
| List event types | `GET /event_types` | Available booking types |
| Get availability | `GET /user_availability_schedules` | Available time slots |
| List scheduled events | `GET /scheduled_events` | Booked events |
| Cancel event | `POST /scheduled_events/{id}/cancellation` | Cancel a booking |

### Webhooks

| Event | Trigger | Use Case |
|-------|---------|----------|
| `invitee.created` | New booking | Create appointment in your system |
| `invitee.canceled` | Booking canceled | Update appointment status |
| `routing_form_submission.created` | Form submitted | Process intake data |

### Embedding

| Method | Description | Customization |
|--------|-------------|---------------|
| **Inline embed** | Calendar widget in your page | Colors, size |
| **Popup widget** | Button opens overlay | Trigger text, colors |
| **Full-page redirect** | Link to Calendly page | Branding (paid plan) |
| **API booking** | Build custom UI, use API for availability + booking | Full control |

---

## 5. Availability Management

### Calculating Available Slots

```
Available slots = Working hours
                  - Existing calendar events (free/busy query)
                  - Buffer time between meetings
                  - Minimum notice period
                  - Blocked dates/hours
```

### Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Working hours | {{WORKING_HOURS}} | e.g., Mon-Fri 9am-5pm |
| Meeting duration | {{MEETING_DURATION}} | e.g., 30 min, 60 min |
| Buffer between meetings | {{BUFFER_MINUTES}} min | e.g., 15 min |
| Minimum notice | {{MIN_NOTICE_HOURS}} hours | e.g., 4 hours ahead |
| Maximum advance booking | {{MAX_ADVANCE_DAYS}} days | e.g., 30 days |
| Slot granularity | {{SLOT_GRANULARITY}} min | e.g., 15 min increments |

---

## 6. Reminders & Notifications

| Reminder | Timing | Channel | Content |
|----------|--------|---------|---------|
| Booking confirmation | Immediately | Email | Event details, calendar invite (.ics) |
| Pre-event reminder | {{REMINDER_HOURS}} hours before | Email + in-app | Meeting link, preparation notes |
| Pre-event SMS | {{REMINDER_MINUTES}} min before | SMS (optional) | Time + join link |
| Follow-up | {{FOLLOWUP_HOURS}} hours after | Email | Thank you + next steps |
| No-show notification | 10 min after start | Email to organizer | Attendee didn't join |

---

## 7. Implementation Checklist

- [ ] Calendar provider selected and account configured
- [ ] OAuth flow implemented for user calendar connection
- [ ] Refresh token stored securely (encrypted at rest)
- [ ] Free/busy query working for availability display
- [ ] Event creation with proper timezone handling
- [ ] Push notifications / webhooks configured for real-time sync
- [ ] Reminder system configured (email + optional SMS)
- [ ] Cancellation and rescheduling flows working
- [ ] Conflict detection (prevent double-booking)
- [ ] Rate limiting respected (especially Google Calendar quotas)
- [ ] Token refresh handling (auto-refresh expired access tokens)
- [ ] Error handling for revoked calendar access (user disconnects)
