# Analytics & Tracking for {{PROJECT_NAME}}

> **Define every event, funnel, dashboard, and alert for measuring your interactive demo's performance.**
> Data-driven iteration is the difference between a demo that converts and one that collects dust.

---

## Table of Contents

1. [Event Taxonomy](#event-taxonomy)
2. [Core Events to Track](#core-events-to-track)
3. [Drop-Off Analysis](#drop-off-analysis)
4. [CTA Conversion Funnel](#cta-conversion-funnel)
5. [Feature Interest Heatmap](#feature-interest-heatmap)
6. [Session Analysis](#session-analysis)
7. [Analytics Provider Setup](#analytics-provider-setup)
8. [Dashboard & Reporting Template](#dashboard--reporting-template)
9. [Alerting & Notifications](#alerting--notifications)
10. [Privacy-Compliant Tracking](#privacy-compliant-tracking)
11. [Checklist](#checklist)

---

## Event Taxonomy

### Naming Convention

| Component | Format | Example |
|-----------|--------|---------|
| **Category** | `demo_{{category}}` | `demo_tour`, `demo_cta`, `demo_gate` |
| **Action** | `{{verb}}_{{noun}}` | `view_step`, `click_cta`, `submit_form` |
| **Full Event Name** | `demo_{{category}}_{{action}}` | `demo_tour_view_step`, `demo_cta_click_primary` |

### Event Categories

| Category | Prefix | Description |
|----------|--------|-------------|
| **Session** | `demo_session_` | Session-level events (start, end, resume) |
| **Gate** | `demo_gate_` | Entry gate interactions |
| **Tour** | `demo_tour_` | Guided tour step events |
| **Explore** | `demo_explore_` | Free-explore mode events |
| **CTA** | `demo_cta_` | Call-to-action interactions |
| **Mode** | `demo_mode_` | Mode switches |
| **Error** | `demo_error_` | Error occurrences |
| **Engagement** | `demo_engagement_` | Time-based and scroll engagement |

### Standard Properties (Attached to Every Event)

| Property | Type | Description | Example |
|----------|------|-----------|---------|
| `demo_version` | string | Demo build version | `"1.2.3"` |
| `session_id` | string | Unique session identifier | `"sess_abc123"` |
| `demo_mode` | string | Current mode | `"guided"` / `"free_explore"` |
| `device_type` | string | Device category | `"desktop"` / `"tablet"` / `"mobile"` |
| `viewport_width` | number | Browser viewport width | `1440` |
| `viewport_height` | number | Browser viewport height | `900` |
| `referrer` | string | Referring URL | `"https://{{DOMAIN}}/pricing"` |
| `utm_source` | string | UTM source parameter | `"email"` |
| `utm_medium` | string | UTM medium parameter | `"campaign"` |
| `utm_campaign` | string | UTM campaign parameter | `"spring_launch"` |
| `timestamp` | ISO 8601 | Event timestamp | `"2026-03-13T14:30:00Z"` |

---

## Core Events to Track

### Session Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_session_start` | Demo page loaded | `{ entry_point, has_utm }` | Critical |
| `demo_session_end` | Tab closed / navigated away | `{ duration_seconds, steps_completed, total_steps, mode_at_end }` | Critical |
| `demo_session_resume` | Returning visitor resumes | `{ resume_step, gap_minutes }` | Medium |
| `demo_session_timeout` | Session inactive for {{TIMEOUT_MINUTES}} min | `{ last_active_step, duration_before_timeout }` | Medium |

### Gate Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_gate_view` | Entry gate displayed | `{ gate_type }` | Critical |
| `demo_gate_submit` | User submits gate form | `{ fields_submitted, gate_type }` | Critical |
| `demo_gate_skip` | User clicks "Skip" | `{ gate_type }` | Critical |
| `demo_gate_field_focus` | User focuses a form field | `{ field_name }` | Low |
| `demo_gate_field_error` | Validation error shown | `{ field_name, error_type }` | Medium |

### Tour Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_tour_start` | User begins guided tour | `{ total_steps }` | Critical |
| `demo_tour_view_step` | Step becomes visible | `{ step_number, step_title, feature_name }` | Critical |
| `demo_tour_interact_step` | User completes step interaction | `{ step_number, interaction_type, time_on_step_seconds }` | Critical |
| `demo_tour_skip_step` | User skips a step | `{ step_number, step_title }` | High |
| `demo_tour_back_step` | User navigates backward | `{ from_step, to_step }` | Medium |
| `demo_tour_complete` | User reaches final step | `{ total_time_seconds, steps_skipped }` | Critical |
| `demo_tour_abandon` | User leaves mid-tour | `{ last_step, steps_completed, total_time_seconds }` | Critical |

### Explore Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_explore_start` | User enters free-explore mode | `{ entry_point }` | High |
| `demo_explore_hotspot_click` | User clicks a hotspot | `{ hotspot_id, feature_name, category }` | Critical |
| `demo_explore_hotspot_dismiss` | User closes hotspot tooltip | `{ hotspot_id, time_viewed_seconds }` | Medium |
| `demo_explore_discovery` | User discovers N of total features | `{ discovered_count, total_count, percent_discovered }` | High |
| `demo_explore_complete` | User discovers all features | `{ total_time_seconds }` | High |

### CTA Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_cta_view` | CTA becomes visible | `{ cta_type, cta_location, cta_text }` | Critical |
| `demo_cta_click_primary` | Primary CTA clicked | `{ cta_type, cta_location, cta_text, destination_url }` | Critical |
| `demo_cta_click_secondary` | Secondary CTA clicked | `{ cta_type, cta_location, cta_text }` | High |
| `demo_cta_dismiss` | CTA dismissed | `{ cta_type, cta_location }` | High |
| `demo_cta_persistent_click` | Persistent bottom bar CTA clicked | `{ current_step }` | High |

### Mode Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_mode_switch` | User toggles between modes | `{ from_mode, to_mode, current_step }` | High |
| `demo_mode_initial_choice` | User selects mode on welcome screen | `{ selected_mode }` | Critical |

### Error Events

| Event Name | Trigger | Properties | Priority |
|-----------|---------|-----------|----------|
| `demo_error_load_failure` | Demo fails to load | `{ error_type, error_message }` | Critical |
| `demo_error_asset_missing` | Step asset fails to load | `{ step_number, asset_type, asset_url }` | High |
| `demo_error_submission_failed` | Form submission fails | `{ endpoint, error_code }` | Critical |

---

## Drop-Off Analysis

### Funnel Definition

```
Page Visit → Demo Start → Step 1 → Step 2 → ... → Step N → End Screen → CTA Click
```

### Drop-Off Tracking Table

| Funnel Stage | Event | Expected Rate | Alert If Below | Investigation Steps |
|-------------|-------|--------------|----------------|-------------------|
| Page Visit → Demo Start | `demo_session_start` | {{RATE, e.g., "40%"}} | {{THRESHOLD, e.g., "<25%"}} | Check page load time, CTA visibility, copy |
| Demo Start → Step 1 | `demo_tour_view_step (step=1)` | {{RATE, e.g., "90%"}} | {{THRESHOLD}} | Check gate friction, welcome screen clarity |
| Step 1 → Step 2 | `demo_tour_view_step (step=2)` | {{RATE, e.g., "85%"}} | {{THRESHOLD}} | Check Step 1 interaction difficulty |
| Step 2 → Step 3 | `demo_tour_view_step (step=3)` | {{RATE}} | {{THRESHOLD}} | {{INVESTIGATION}} |
| Step 3 → Step 4 | `demo_tour_view_step (step=4)` | {{RATE}} | {{THRESHOLD}} | {{INVESTIGATION}} |
| Step 4 → Step 5 | `demo_tour_view_step (step=5)` | {{RATE}} | {{THRESHOLD}} | {{INVESTIGATION}} |
| Step {{N-1}} → Step {{N}} | `demo_tour_view_step (step={{N}})` | {{RATE}} | {{THRESHOLD}} | {{INVESTIGATION}} |
| Final Step → End Screen | `demo_tour_complete` | {{RATE, e.g., "60%"}} | {{THRESHOLD}} | Check final step engagement |
| End Screen → CTA Click | `demo_cta_click_primary` | {{RATE, e.g., "15%"}} | {{THRESHOLD}} | Check CTA copy, placement, offer |

### Drop-Off Remediation Playbook

| Drop-Off Location | Likely Cause | Fix to Try | Expected Improvement |
|-------------------|------------|-----------|---------------------|
| Before demo starts | Slow load, unclear value prop | Optimize load time, sharpen headline | {{IMPROVEMENT, e.g., "+10-20% start rate"}} |
| First 2 steps | Confusing onboarding, unclear instructions | Simplify first interaction, better tooltip copy | {{IMPROVEMENT}} |
| Mid-tour (Steps 3-6) | Too long, lost interest, confusion | Shorten tour, improve transitions, add engagement hooks | {{IMPROVEMENT}} |
| Before end screen | "Seen enough" syndrome | Move CTA earlier, add mid-tour hook | {{IMPROVEMENT}} |
| End screen without CTA click | Weak CTA, unclear next step | Stronger copy, better offer, social proof | {{IMPROVEMENT}} |

---

## CTA Conversion Funnel

### Primary Conversion Funnel

| Stage | Event | Count | Rate | Target |
|-------|-------|-------|------|--------|
| 1. Page visitors | `pageview` | {{COUNT}} | 100% | — |
| 2. Demo started | `demo_session_start` | {{COUNT}} | {{RATE}} | {{TARGET}} |
| 3. Gate submitted (if applicable) | `demo_gate_submit` | {{COUNT}} | {{RATE}} | {{TARGET}} |
| 4. Tour completed | `demo_tour_complete` | {{COUNT}} | {{RATE}} | {{TARGET}} |
| 5. CTA clicked | `demo_cta_click_primary` | {{COUNT}} | {{RATE}} | {{TARGET}} |
| 6. Sign-up / trial started | `signup_completed` | {{COUNT}} | {{RATE}} | {{TARGET}} |

### Secondary Conversion Paths

| Path | Events | Target Rate |
|------|--------|------------|
| Mid-tour CTA → Sign-up | `demo_cta_click_primary (location=mid_tour)` → `signup_completed` | {{TARGET}} |
| Free-explore → CTA | `demo_explore_start` → `demo_cta_click_primary` | {{TARGET}} |
| Return visit → CTA | `demo_session_resume` → `demo_cta_click_primary` | {{TARGET}} |
| Persistent CTA click | `demo_cta_persistent_click` → `signup_completed` | {{TARGET}} |

### Attribution

| Attribution Model | Description | When to Use |
|------------------|-----------|-------------|
| Last touch | Credit to last CTA clicked | Default, simplest |
| First touch | Credit to initial demo view | Understanding top-of-funnel |
| Linear | Equal credit to all touchpoints | Multi-session visitors |
| Time decay | More credit to recent touchpoints | Long sales cycles |

**Selected model:** {{SELECTED_MODEL}}

---

## Feature Interest Heatmap

### Feature Engagement Tracking

| Feature | Step # | Avg Time Spent (s) | Interaction Rate | Hotspot Click Rate | Interest Score |
|---------|--------|--------------------|-----------------|--------------------|---------------|
| {{FEATURE_1}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE, e.g., HIGH/MEDIUM/LOW}} |
| {{FEATURE_2}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_3}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_4}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_5}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_6}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_7}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |
| {{FEATURE_8}} | {{STEP}} | {{TIME}} | {{RATE}} | {{RATE}} | {{SCORE}} |

### Interest Score Calculation

```
Interest Score = (Avg Time on Step / Avg Time Across All Steps)
              + (Interaction Rate * 2)
              + (Hotspot Click Rate * 1.5)
              - (Skip Rate * 3)
```

| Score Range | Label | Interpretation |
|------------|-------|---------------|
| > {{HIGH_THRESHOLD}} | HIGH | Feature resonates strongly — highlight in marketing |
| {{MED_THRESHOLD}} - {{HIGH_THRESHOLD}} | MEDIUM | Feature is appreciated — maintain in demo |
| < {{MED_THRESHOLD}} | LOW | Feature may not resonate — consider removing or repositioning |

### Insights to Extract

- [ ] Top 3 features by interest score
- [ ] Feature most likely to precede CTA click
- [ ] Feature most associated with drop-off
- [ ] Feature interest differences by persona / UTM source
- [ ] Feature interest differences by device type

---

## Session Analysis

### Session Segments

| Segment | Definition | Events to Filter |
|---------|-----------|-----------------|
| **Guided completers** | Finished full guided tour | `demo_tour_complete = true` |
| **Guided abandoners** | Started guided, did not finish | `demo_tour_start = true AND demo_tour_complete = false` |
| **Free explorers** | Used free-explore mode | `demo_explore_start = true` |
| **Mode switchers** | Changed modes at least once | `demo_mode_switch count >= 1` |
| **Converters** | Clicked a CTA | `demo_cta_click_primary = true` |
| **Return visitors** | Resumed a previous session | `demo_session_resume = true` |
| **Gate submitters** | Submitted entry gate | `demo_gate_submit = true` |
| **Gate skippers** | Skipped entry gate | `demo_gate_skip = true` |

### Guided vs Free-Explore Comparison

| Metric | Guided Mode | Free-Explore Mode | Delta |
|--------|------------|-------------------|-------|
| Avg session duration | {{TIME}} | {{TIME}} | {{DELTA}} |
| Features explored | {{COUNT}} | {{COUNT}} | {{DELTA}} |
| CTA click rate | {{RATE}} | {{RATE}} | {{DELTA}} |
| Completion rate | {{RATE}} | {{RATE}} | {{DELTA}} |
| Return rate | {{RATE}} | {{RATE}} | {{DELTA}} |

### Device Breakdown

| Metric | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| % of sessions | {{PERCENT}} | {{PERCENT}} | {{PERCENT}} |
| Avg session duration | {{TIME}} | {{TIME}} | {{TIME}} |
| Completion rate | {{RATE}} | {{RATE}} | {{RATE}} |
| CTA click rate | {{RATE}} | {{RATE}} | {{RATE}} |
| Drop-off step (most common) | {{STEP}} | {{STEP}} | {{STEP}} |

### Geographic & Temporal Analysis

| Dimension | Tracked? | Segmentation |
|-----------|----------|-------------|
| Country / Region | {{YES/NO}} | {{SEGMENTATION, e.g., "Top 10 countries by volume"}} |
| Time zone | {{YES/NO}} | {{SEGMENTATION}} |
| Day of week | {{YES/NO}} | {{SEGMENTATION, e.g., "Weekday vs weekend"}} |
| Hour of day | {{YES/NO}} | {{SEGMENTATION, e.g., "Peak hours"}} |
| Browser language | {{YES/NO}} | {{SEGMENTATION}} |

---

## Analytics Provider Setup

### Provider Selection

| Provider | Free Tier | Event Limits | Real-Time? | Funnel Analysis? | Selected? |
|----------|----------|-------------|-----------|-----------------|-----------|
| **Google Analytics 4** | Yes | Unlimited events, 500 event types | Yes | Yes | {{YES/NO}} |
| **Mixpanel** | Yes (up to 20M events/mo) | 20M/month free | Yes | Yes | {{YES/NO}} |
| **Amplitude** | Yes (up to 10M events/mo) | 10M/month free | Yes | Yes | {{YES/NO}} |
| **PostHog** | Yes (self-hosted unlimited) | 1M/month cloud free | Yes | Yes | {{YES/NO}} |
| **Plausible** | No (paid only) | Unlimited | Yes | No | {{YES/NO}} |
| **Custom (own backend)** | Yes | Unlimited | {{DEPENDS}} | {{DEPENDS}} | {{YES/NO}} |

**Selected provider(s):** {{SELECTED_PROVIDERS}}

### Implementation

| Step | Action | Owner | Status |
|------|--------|-------|--------|
| 1 | Create account / project | {{OWNER}} | {{STATUS}} |
| 2 | Install SDK / tracking script | {{OWNER}} | {{STATUS}} |
| 3 | Configure events (from taxonomy above) | {{OWNER}} | {{STATUS}} |
| 4 | Set up user properties | {{OWNER}} | {{STATUS}} |
| 5 | Build funnels | {{OWNER}} | {{STATUS}} |
| 6 | Create dashboards | {{OWNER}} | {{STATUS}} |
| 7 | Configure alerts | {{OWNER}} | {{STATUS}} |
| 8 | Verify data accuracy (QA) | {{OWNER}} | {{STATUS}} |

### SDK Integration Code Pattern

```javascript
// {{PROVIDER}} integration pattern
// Initialize
{{INIT_CODE, e.g.:
// analytics.init('{{PROJECT_ID}}');
}}

// Track event pattern
function trackDemoEvent(eventName, properties) {
  const baseProperties = {
    demo_version: '{{DEMO_VERSION}}',
    session_id: getSessionId(),
    demo_mode: getCurrentMode(),
    device_type: getDeviceType(),
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    referrer: document.referrer,
    ...getUTMParams(),
    timestamp: new Date().toISOString()
  };

  {{TRACK_CALL, e.g.:
  // analytics.track(eventName, { ...baseProperties, ...properties });
  }}
}
```

---

## Dashboard & Reporting Template

### Executive Dashboard (Weekly)

| Widget | Metric | Visualization | Data Source |
|--------|--------|-------------|-----------|
| **Demo Starts** | Total sessions this week | Number + trend arrow | `demo_session_start` count |
| **Completion Rate** | % of starters who complete | Gauge chart | `demo_tour_complete / demo_session_start` |
| **Leads Captured** | Gate submissions this week | Number + trend arrow | `demo_gate_submit` count |
| **CTA Conversion** | % end-screen CTA clicks | Gauge chart | `demo_cta_click_primary / demo_tour_complete` |
| **Top Feature** | Most-engaged feature | Bar chart | Interest score ranking |
| **Drop-Off Funnel** | Step-by-step funnel | Funnel chart | Step view events |
| **Device Split** | Desktop / tablet / mobile | Pie chart | `device_type` property |
| **Traffic Sources** | UTM source breakdown | Bar chart | `utm_source` property |

### Operational Dashboard (Daily)

| Widget | Metric | Alert Threshold |
|--------|--------|----------------|
| **Error Rate** | % of sessions with errors | > {{THRESHOLD, e.g., 2%}} |
| **Load Time (P95)** | 95th percentile load time | > {{THRESHOLD, e.g., 3s}} |
| **Active Sessions** | Real-time session count | — (informational) |
| **Gate Skip Rate** | % of gate views that skip | > {{THRESHOLD, e.g., 80%}} |
| **Abandoned Steps** | Steps with >50% drop-off | Any step > {{THRESHOLD}} |

### Monthly Report Template

| Section | Content |
|---------|---------|
| **Summary** | Total sessions, leads, conversions, trends |
| **Funnel Analysis** | Full funnel with rates and month-over-month change |
| **Feature Insights** | Top features, interest changes, new patterns |
| **A/B Test Results** | Active tests, winners, next tests planned |
| **Device & Source** | Breakdown changes, emerging traffic sources |
| **Recommendations** | Data-backed suggestions for next month |

---

## Alerting & Notifications

### Alert Configuration

| Alert Name | Condition | Severity | Channel | Recipients |
|-----------|-----------|----------|---------|-----------|
| **Demo Down** | Error rate > {{THRESHOLD, e.g., 10%}} for 5 minutes | Critical | {{CHANNEL, e.g., "Slack #demo-alerts + PagerDuty"}} | {{RECIPIENTS}} |
| **Completion Rate Drop** | Completion rate drops > {{THRESHOLD, e.g., 20%}} from 7-day avg | Warning | {{CHANNEL, e.g., "Slack #demo-alerts"}} | {{RECIPIENTS}} |
| **Lead Spike** | Gate submissions > {{THRESHOLD, e.g., 50}} in 1 hour | Info | {{CHANNEL, e.g., "Slack #demo-leads"}} | {{RECIPIENTS}} |
| **High-Value Lead** | Enterprise company detected | Info | {{CHANNEL, e.g., "Slack #sales"}} | {{RECIPIENTS}} |
| **Submission Failure** | Webhook fails 3x consecutively | Critical | {{CHANNEL}} | {{RECIPIENTS}} |
| **New Drop-Off Pattern** | Any step drops below {{THRESHOLD, e.g., 50%}} retention | Warning | {{CHANNEL}} | {{RECIPIENTS}} |

### Alert Response Procedures

| Alert | First Response | Escalation |
|-------|---------------|-----------|
| Demo Down | {{RESPONSE, e.g., "Check CDN status, review error logs"}} | {{ESCALATION, e.g., "Page engineering on-call after 15 min"}} |
| Completion Rate Drop | {{RESPONSE, e.g., "Check for broken steps, review recent changes"}} | {{ESCALATION}} |
| Submission Failure | {{RESPONSE, e.g., "Check webhook endpoint, verify CRM is up"}} | {{ESCALATION}} |

---

## Privacy-Compliant Tracking

### Data Classification

| Data Point | Category | Stored Where | Retention | PII? |
|-----------|----------|------------|-----------|------|
| Session ID | Pseudonymous | Analytics provider | {{RETENTION, e.g., "90 days"}} | No |
| Device type / viewport | Technical | Analytics provider | {{RETENTION}} | No |
| Step interactions | Behavioral | Analytics provider | {{RETENTION}} | No |
| UTM parameters | Marketing | Analytics provider | {{RETENTION}} | No |
| IP address | Network | {{STORAGE, e.g., "Not stored / anonymized"}} | {{RETENTION}} | {{YES/NO}} |
| Email (gate submission) | PII | CRM only | {{RETENTION}} | Yes |
| Geolocation (country) | Derived | Analytics provider | {{RETENTION}} | No |

### Consent Management

| Tracking Level | Requires Consent? | What's Tracked | Consent Mechanism |
|---------------|-------------------|---------------|-------------------|
| **Essential** | No | Session ID, error tracking | — |
| **Functional** | {{YES/NO}} | Progress state, mode preference | {{MECHANISM}} |
| **Analytics** | Yes (in EU) | All behavioral events | {{MECHANISM, e.g., "Cookie banner opt-in"}} |
| **Marketing** | Yes | UTM attribution, lead scoring | {{MECHANISM, e.g., "Explicit checkbox"}} |

### Consent-Gated Event Firing

```
IF user has NOT consented to analytics:
  → Track only essential events (errors, load failures)
  → Do NOT set analytics cookies
  → Do NOT send events to third-party providers

IF user HAS consented to analytics:
  → Track all events per taxonomy
  → Set session cookie
  → Send events to configured providers

IF user consents to marketing:
  → Enable UTM tracking
  → Enable lead scoring enrichment
  → Enable remarketing pixels (if configured)
```

### Do Not Track (DNT) Handling

| DNT Header Value | Behavior |
|-----------------|---------|
| `1` (enabled) | {{BEHAVIOR, e.g., "Respect DNT — essential tracking only"}} |
| `0` (disabled) | {{BEHAVIOR, e.g., "Show consent banner as normal"}} |
| Not set | {{BEHAVIOR, e.g., "Show consent banner as normal"}} |

### Data Deletion Procedure

| Request Type | Process | SLA |
|-------------|---------|-----|
| User requests email deletion | {{PROCESS, e.g., "Delete from CRM, confirm via email"}} | {{SLA, e.g., "30 days"}} |
| User requests all data deletion | {{PROCESS, e.g., "Delete from CRM + request analytics provider deletion"}} | {{SLA}} |
| Automated retention expiry | {{PROCESS, e.g., "Analytics provider auto-deletes after retention period"}} | Automatic |

---

## Checklist

- [ ] Event taxonomy defined with consistent naming convention
- [ ] All core events documented with properties and priority
- [ ] Drop-off funnel stages identified with investigation steps
- [ ] CTA conversion funnel defined with targets
- [ ] Feature interest scoring method established
- [ ] Session segments defined for analysis
- [ ] Analytics provider selected and integration planned
- [ ] Executive and operational dashboards designed
- [ ] Alerts configured with response procedures
- [ ] Privacy compliance verified (consent, DNT, data retention)
- [ ] QA plan to verify event accuracy before launch

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
