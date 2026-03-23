# Contextual In-App Help — Design System

> {{PROJECT_NAME}} — Embed context-aware help directly in the product UI so users find answers without leaving their workflow.

**Kit context:** This template is part of the `33-customer-experience-ops/` module.
**Last validated:** 2026-03-12
**Depends on:** `18-user-documentation/`, `06-tech-stack/`, `33-customer-experience-ops/self-service-knowledge-center.template.md`

---

## Overview

For static documentation standards and FAQ templates, see `18-user-documentation/`. For the full knowledge center portal, see `self-service-knowledge-center.template.md` in this folder. This document covers **dynamic, context-aware help embedded in the product UI** — the kind that appears exactly when and where a user needs it, without forcing them to context-switch to a separate help site.

The goal is zero-hop help: the user never leaves the page they are on. Every help surface described here renders inside the product, draws from a single canonical content source, and emits analytics events that feed back into content prioritization.

**Why this matters for {{PROJECT_NAME}}:** Every support ticket that starts with "I couldn't figure out how to..." is a failure of in-app help. Contextual help done well reduces ticket volume by 20-40% (industry benchmarks from Pendo and Gainsight), increases feature adoption by surfacing guidance at the moment of need, and shortens onboarding time by replacing static documentation with interactive walkthroughs.

---

## Contextual Help Taxonomy

{{PROJECT_NAME}} should implement exactly **six** types of in-app help. Each serves a distinct purpose. Using the wrong type for a given situation creates friction rather than reducing it.

### 1. Tooltips — Short Explanations on Hover/Click

**When to use:**
- A UI label is ambiguous or uses domain-specific terminology (e.g., "MRR" needs "Monthly Recurring Revenue" for new users)
- A setting has non-obvious consequences (e.g., "Enable auto-archiving" → tooltip explains what gets archived and after how long)
- An icon has no visible label and its meaning is not universally understood

**When NOT to use:**
- The explanation requires more than 140 characters — use a contextual sidebar article instead
- The element is self-explanatory — unnecessary tooltips train users to ignore all tooltips
- For critical warnings or destructive actions — use inline hints or confirmation dialogs instead

**Implementation approach:**
- Attach `data-help-tooltip="tooltip-key"` attribute to any element needing a tooltip
- Tooltip content stored in a centralized JSON file or CMS, keyed by tooltip-key
- Component renders a small `?` icon or info icon next to the element, or triggers on hover of the element itself
- Never use title attributes — they are unstyled, inaccessible, and untrackable

**Example:**
```
Element: "Churn Rate" label on dashboard
Tooltip: "Percentage of customers who cancelled in this period divided by total customers at period start. Excludes paused accounts."
```

### 2. Coach Marks — Spotlight on Specific UI Elements

**When to use:**
- Drawing attention to a new feature added to an existing page (post-release feature announcement)
- Highlighting a specific element that users commonly miss (analytics show low interaction despite high value)
- One-time "did you know?" moments — never recurring

**When NOT to use:**
- For onboarding — use guided walkthroughs instead (coach marks are single-element, walkthroughs are multi-step)
- More than one coach mark on a single page — overwhelming and dismissible-feeling
- On mobile — coach marks with overlay dimming are hostile on small screens

**Implementation approach:**
- Render a semi-transparent overlay (backdrop) with a "cutout" around the target element
- Callout box with title (max 8 words), body (max 2 sentences), and a dismiss button
- Highlight the element with a subtle pulse animation or border glow
- Dismiss stores `coach_mark_<id>_dismissed: true` in user profile; never show again

**Example:**
```
Target: New "Export to CSV" button on reports page
Coach mark: "New: Export your reports — Download any report as CSV with one click. Filters are preserved in the export."
```

### 3. Guided Walkthroughs — Multi-Step Product Tours

**When to use:**
- First-time onboarding — walk new users through the 5-7 most critical actions
- Feature introduction — when launching a complex feature that changes existing workflows
- Configuration wizards — when setup requires multiple steps across different pages

**When NOT to use:**
- For simple features — a tooltip or coach mark is sufficient
- Walkthroughs longer than 7 steps — break into multiple focused tours
- As a substitute for good UX — if users need a walkthrough to use a basic feature, redesign the feature

**Implementation approach:** See the detailed "Guided Walkthrough Engine" section below.

**Example:**
```
Onboarding tour for {{PROJECT_NAME}}:
Step 1: "Welcome! Let's set up your workspace." → target: workspace settings
Step 2: "Invite your team" → target: team invite button
Step 3: "Create your first [core object]" → target: create button
Step 4: "Connect your tools" → target: integrations page
Step 5: "You're all set!" → summary + link to video tutorial
```

### 4. Contextual Sidebars — Slide-Out Panel with Relevant KB Articles

**When to use:**
- User clicks a "Help" or "?" button on any page — surface articles relevant to that specific page
- User is on a complex configuration page with multiple concepts to understand
- As the primary "learn more" destination from tooltips that need deeper explanation

**When NOT to use:**
- As a generic help center link — the sidebar must show contextually relevant articles, not a search box
- On pages where the sidebar would cover critical UI elements (use a modal or new tab instead)
- For urgent or blocking issues — route to live support instead

**Implementation approach:**
- Slide-out panel (right side, 400px width) with close button and search within panel
- Page-to-article mapping maintained in a configuration file (see "Contextual Article Surfacing" section)
- Articles rendered as cards: title, 2-line excerpt, estimated read time, "Was this helpful?" feedback
- Panel remembers scroll position if reopened on the same page

**Example:**
```
User is on: /settings/billing
Sidebar shows:
1. "Understanding your invoice" (3 min read)
2. "How to update payment method" (2 min read)
3. "Plan comparison and upgrading" (4 min read)
4. "Tax and VAT information" (2 min read)
```

### 5. Empty-State Help — Content When a Feature Has No Data Yet

**When to use:**
- A list, table, or dashboard widget has zero items (first use or cleared data)
- A feature requires setup before it becomes useful
- A search returns no results

**When NOT to use:**
- When the empty state is an error condition — show an error message with retry action instead
- When data is loading — show a skeleton/loading state, not empty-state help

**Implementation approach:**
- Replace blank/empty areas with: illustration (optional), headline explaining what goes here, 1-2 sentence description, primary CTA button to create/add first item, optional link to documentation
- Tone: encouraging, not apologetic. "Create your first report" not "Nothing here yet"
- Remove the empty state permanently once the user has at least one item (do not show it again even if all items are deleted — at that point the user knows what the feature does)

**Example:**
```
Feature: Reports dashboard (no reports created yet)
Empty state:
  Illustration: [chart icon]
  Headline: "Build your first report"
  Body: "Reports help you track {{KEY_METRIC}} over time. Start with a template or build from scratch."
  CTA: [Create Report] button
  Link: "See example reports →" (links to documentation)
```

### 6. Inline Hints — Persistent Helper Text Near Form Fields

**When to use:**
- Form fields that require specific formatting (e.g., "Use format: YYYY-MM-DD")
- Settings with non-obvious implications (e.g., "Enabling this will send an email to all team members")
- Fields with validation rules the user should know upfront (e.g., "Password must be 12+ characters with one number")

**When NOT to use:**
- For obvious fields (name, email) — clutters the interface
- For critical warnings — use alert banners or confirmation dialogs instead
- As a substitute for good labels — if the label is clear, the hint is redundant

**Implementation approach:**
- Render as muted, smaller text directly below the form field (not as a tooltip)
- Always visible — do not hide behind hover or click interactions
- Keep to one line (two maximum) — longer explanations should link to documentation
- Use the same text color/style across all inline hints for visual consistency

**Example:**
```
Field: "Webhook URL"
Inline hint: "Must be HTTPS. We'll send a test POST request to verify the endpoint is reachable."
```

---

## Tooltip System Design

### Trigger Types

| Trigger | Platform | Behavior |
|---------|----------|----------|
| Hover | Desktop | Show after 300ms hover delay, hide after 200ms mouse-out delay. Tooltip itself is hoverable (for links). |
| Tap | Mobile/Tablet | Show on tap, dismiss on tap outside or explicit close button. No hover on touch devices. |
| First-visit auto-show | Both | Show automatically on first visit to a page, with a subtle entrance animation. Dismiss after 5 seconds or on interaction. Limited to 1 auto-show tooltip per page per session. |
| Focus | Both (accessibility) | Show when the associated element receives keyboard focus. Essential for screen reader users. |

### Content Model

```json
{
  "tooltip_key": "billing-churn-rate",
  "element_selector": "[data-help-tooltip='billing-churn-rate']",
  "title": "Churn Rate",
  "body": "Percentage of customers who cancelled this period, divided by total customers at period start. Excludes paused accounts.",
  "max_body_length": 140,
  "link_to_article": "/help/articles/understanding-churn",
  "link_text": "Learn more",
  "dismiss_permanently": true,
  "show_on_first_visit": false,
  "priority": 3,
  "locale": "{{DEFAULT_LOCALE}}",
  "created_by": "{{CX_CONTENT_OWNER}}",
  "last_reviewed": "{{CX_LAST_REVIEW_DATE}}"
}
```

### Placement Logic

1. **Preferred position:** above the target element (default)
2. **Fallback cascade:** above → below → right → left
3. **Viewport detection:** if tooltip would overflow the viewport in the preferred direction, move to the next in the cascade
4. **Collision avoidance:** never cover the target element itself, never cover other interactive elements (buttons, links, inputs)
5. **Arrow indicator:** always point the tooltip arrow at the center of the target element
6. **Mobile override:** on viewports < 768px, always render tooltips as bottom sheets (full-width panel at bottom of screen)

### Dismissal Persistence

- **Permanent dismiss:** stored in user profile via API (`PATCH /api/users/{id}/preferences` with `dismissed_tooltips: ["tooltip-key"]`)
- **Session dismiss:** stored in sessionStorage for tooltips that should reappear next session
- **Never-dismiss:** informational tooltips that always appear on hover (no close button, no persistence)
- **Reset option:** user can reset all dismissed tooltips from Settings → Help Preferences

### Progressive Disclosure Rules

1. Show a maximum of **1 auto-show tooltip per page load** — if multiple tooltips are flagged for auto-show, pick the one with the highest priority value
2. After a user dismisses 3 auto-show tooltips in a single session, stop showing auto-show tooltips for the rest of the session (they are clearly not interested right now)
3. Tooltips linked to the current onboarding stage take priority over general tooltips
4. Never show a tooltip while a walkthrough is active — the walkthrough is already providing guided context

---

## Guided Walkthrough Engine

### Step Definition Schema

```json
{
  "walkthrough_id": "onboarding-v2",
  "name": "Getting Started with {{PROJECT_NAME}}",
  "version": 2,
  "trigger": {
    "type": "first_login",
    "conditions": {
      "user_role": ["admin", "member"],
      "account_age_hours_max": 24,
      "has_completed_walkthrough": false
    }
  },
  "steps": [
    {
      "step_id": "welcome",
      "step_number": 1,
      "target_element": null,
      "position": "center",
      "title": "Welcome to {{PROJECT_NAME}}!",
      "body": "Let's take 2 minutes to set up your workspace. You can skip this tour and come back to it anytime from the Help menu.",
      "action_required": false,
      "next_step_trigger": "button_click",
      "cta_text": "Let's go",
      "skip_text": "Skip tour"
    },
    {
      "step_id": "create-first-item",
      "step_number": 2,
      "target_element": "#create-button",
      "position": "bottom",
      "title": "Create your first {{CORE_OBJECT}}",
      "body": "Click here to create a new {{CORE_OBJECT}}. This is the core of everything you'll do in {{PROJECT_NAME}}.",
      "action_required": true,
      "next_step_trigger": "element_click",
      "highlight_style": "spotlight"
    }
  ],
  "completion": {
    "title": "You're all set!",
    "body": "You've completed the basics. Check out our video tutorials for advanced features.",
    "cta_text": "View tutorials",
    "cta_link": "/help/tutorials"
  }
}
```

### Walkthrough Types

| Type | Trigger | Steps | Purpose |
|------|---------|-------|---------|
| Onboarding tour | First login | 5-7 | Get user to first value moment |
| Feature introduction | First visit to new feature page | 3-4 | Explain new capability |
| Configuration wizard | User opens settings for first time | 4-6 | Guide through required setup |
| Recovery tour | User hasn't logged in for 30+ days | 3-4 | Re-orient returning user to what's changed |

### Progress Tracking

- Step completion persisted server-side: `POST /api/users/{id}/walkthrough-progress` with `{ walkthrough_id, step_id, status, timestamp }`
- If user closes browser mid-walkthrough, resume at the last incomplete step on next session
- Progress visible to user: "Step 3 of 5" indicator in walkthrough UI
- Progress visible to admin: analytics dashboard showing completion rates per walkthrough

### Skip / Resume Behavior

| Action | Behavior | Persistence |
|--------|----------|-------------|
| "Skip tour" | Dismisses walkthrough permanently | Stored in user profile; walkthrough never auto-triggers again |
| "Later" / closing the modal | Walkthrough re-triggers on next session | Session flag prevents re-trigger in current session |
| "Restart tour" (from Help menu) | Resets progress to step 1 | Clears all step completion records for that walkthrough |

### Completion Events & Analytics

Track these events for every walkthrough:

- **Completion rate:** percentage of users who finish all steps (target: > 60%)
- **Drop-off step:** which step has the highest abandonment (redesign that step)
- **Time per step:** steps taking > 30 seconds may be confusing (simplify content)
- **Skip rate:** if > 40% of users skip the tour, it is either too long, poorly timed, or unnecessary
- **Restart rate:** if users restart, the tour content may not be sticking (simplify or add video)

### A/B Testing Walkthroughs

- Test different **lengths** (5-step vs. 7-step onboarding) — measure completion rate and 7-day retention
- Test different **trigger timing** (immediate on first login vs. after 5 minutes of exploration)
- Test **action-required vs. passive** steps — do users learn better by doing or by reading?
- Test **with vs. without video** embedded in walkthrough steps
- Route users by `user_id % 2` for clean 50/50 split; use {{EXPERIMENTATION_TOOL}} if available

---

## Interactive Troubleshooters

### Decision-Tree Guided Problem Solving

Interactive troubleshooters replace the "search our knowledge base" experience with a guided conversation. The user answers questions, the system narrows the diagnosis, and provides a specific solution — or escalates with full context.

### Data Model

```json
{
  "troubleshooter_id": "cant-log-in",
  "title": "I can't log in to my account",
  "entry_node": "error-type",
  "nodes": {
    "error-type": {
      "type": "question",
      "text": "What happens when you try to log in?",
      "options": [
        { "label": "I see 'Incorrect password'", "next": "password-incorrect" },
        { "label": "I see 'Account locked'", "next": "account-locked" },
        { "label": "The page won't load at all", "next": "page-wont-load" },
        { "label": "I don't see my usual login page", "next": "wrong-login-page" },
        { "label": "Something else", "next": "other-login-issue" }
      ]
    },
    "password-incorrect": {
      "type": "solution",
      "text": "Let's reset your password.",
      "steps": [
        "Click 'Forgot password?' on the login page",
        "Enter the email address associated with your account",
        "Check your inbox (and spam folder) for the reset link",
        "The link expires in 1 hour — use it promptly"
      ],
      "follow_up": "Did this resolve your issue?",
      "resolved_yes_action": "close_with_thanks",
      "resolved_no_action": "escalate-login"
    },
    "account-locked": {
      "type": "solution",
      "text": "Your account locks after {{MAX_LOGIN_ATTEMPTS}} failed attempts.",
      "steps": [
        "Wait {{ACCOUNT_LOCKOUT_DURATION}} minutes — the lock is temporary",
        "After the lockout period, try logging in again with the correct password",
        "If you've forgotten your password, use 'Forgot password?' after the lockout expires"
      ],
      "follow_up": "Did this resolve your issue?",
      "resolved_yes_action": "close_with_thanks",
      "resolved_no_action": "escalate-login"
    },
    "page-wont-load": {
      "type": "question",
      "text": "Can you access other websites normally?",
      "options": [
        { "label": "Yes, other sites work fine", "next": "check-status-page" },
        { "label": "No, nothing is loading", "next": "network-issue" }
      ]
    },
    "check-status-page": {
      "type": "solution",
      "text": "There may be a service disruption.",
      "steps": [
        "Check our status page at {{STATUS_PAGE_URL}}",
        "If there's an active incident, we're already working on it — subscribe to updates",
        "If no incident is listed, try clearing your browser cache and cookies for our domain",
        "Try accessing the site in an incognito/private window"
      ],
      "follow_up": "Did this resolve your issue?",
      "resolved_yes_action": "close_with_thanks",
      "resolved_no_action": "escalate-login"
    },
    "escalate-login": {
      "type": "escalation",
      "text": "Let's get you to a human who can help.",
      "action": "open_support_ticket",
      "pre_fill": {
        "category": "Account Access",
        "subcategory": "Login Issue",
        "context": "User went through login troubleshooter. Path: {{traversed_nodes}}. Issue not resolved by self-service."
      }
    }
  }
}
```

### Outcome Tracking

| Metric | What it tells you | Action if bad |
|--------|-------------------|---------------|
| Resolution rate | % of users who click "Yes, resolved" at the end | If < 60%, the solutions are wrong or incomplete — review with support team |
| Escalation rate | % who reach the escalation node | If > 30%, the troubleshooter is missing common scenarios — add more branches |
| Drop-off rate | % who abandon mid-troubleshooter | If > 20%, questions are confusing or the flow is too long — simplify |
| Time to resolution | Seconds from start to "resolved" | If > 120 seconds, the tree is too deep — flatten it |
| Path analysis | Which branches are most/least traveled | Prune branches no one takes; add branches for common paths to escalation |

### Fallback to Support Ticket

When the troubleshooter cannot resolve the issue, it opens the support ticket form **pre-filled** with:
- The troubleshooter that was attempted
- Every question and answer the user provided (the full path through the tree)
- The user's browser, OS, and account ID (auto-detected)
- Timestamp of the attempt

This eliminates the support agent's first 3-5 questions and cuts resolution time by 30-50%.

### Authoring Interface

Support team members should be able to create and edit troubleshooters without engineering involvement:
- Visual tree editor: drag-and-drop nodes, connect with arrows
- Preview mode: walk through the troubleshooter as a user would
- Version history: every published version is saved, rollback with one click
- Analytics per node: see traffic and resolution rates overlaid on the tree visualization
- Approval workflow: new troubleshooters require {{CX_LEAD}} sign-off before publishing

---

## Contextual Article Surfacing

### Mapping UI Locations to KB Articles

Create a configuration file (`help-context-map.json` or equivalent) that maps product pages to relevant help articles:

```json
{
  "mappings": [
    {
      "page_route": "/settings/billing",
      "component_id": null,
      "articles": [
        { "article_id": "billing-101", "priority": 1 },
        { "article_id": "update-payment", "priority": 2 },
        { "article_id": "plan-comparison", "priority": 3 },
        { "article_id": "tax-vat-info", "priority": 4 }
      ]
    },
    {
      "page_route": "/reports/*",
      "component_id": "report-builder",
      "articles": [
        { "article_id": "build-custom-report", "priority": 1 },
        { "article_id": "report-filters", "priority": 2 },
        { "article_id": "export-reports", "priority": 3 }
      ]
    }
  ]
}
```

### Manual vs. Algorithmic Surfacing

| Approach | How it works | When to use |
|----------|--------------|-------------|
| **Manual mapping** | Product team assigns 3-5 articles per page/feature | Default approach. Precise, predictable, curated. Use this first. |
| **Algorithmic surfacing** | Match page metadata (title, route, visible text) against KB article tags and content via keyword/embedding search | When you have 200+ KB articles and manual mapping becomes unmaintainable |
| **Hybrid** | Manual mappings take priority; algorithmic fills gaps for unmapped pages | Best long-term approach for mature products |

### "Help" Button Behavior

The help button ({{CX_HELP_BUTTON_POSITION}} — typically bottom-right corner) should:
1. Open the contextual sidebar, not navigate to a separate help center
2. Show articles mapped to the **current page** at the top, labeled "Relevant to this page"
3. Below that, show a search bar to search the full KB without leaving the product
4. Below search results, show "Still need help? → Contact support" link
5. Track: which page the help button was clicked from, which articles were shown, which were clicked

### Relevance Feedback Loop

Every surfaced article shows a "Was this helpful? [Yes] [No]" widget at the bottom:
- "Yes" increments the article's helpfulness score for this page context
- "No" decrements the score and optionally asks "What were you looking for?" (free text, max 200 chars)
- Articles with helpfulness score < 30% for a given page context get flagged for review
- Monthly report: "Articles flagged as unhelpful in context" → content team reviews and either improves the article or fixes the mapping

### Related Articles Logic

When a user opens a specific article in the sidebar, show 3-5 related articles below it:
1. First priority: articles manually linked by the content author (most relevant)
2. Second priority: articles sharing the same tags/category
3. Third priority: articles frequently viewed in the same session (collaborative filtering)
4. Sort by: manual links first, then by helpfulness rating descending

---

## Implementation Patterns

### Component Architecture ({{FRONTEND_FRAMEWORK}})

```
<HelpProvider>                          // Context provider, wraps the entire app
  <App>
    <TooltipTrigger tooltipKey="..." >  // Wraps any element needing a tooltip
      <SomeUIElement />
    </TooltipTrigger>

    <WalkthroughOverlay />              // Modal overlay with spotlight, renders at app root
    <TroubleshooterModal />             // Decision-tree stepper, renders at app root
    <ContextualHelpSidebar />           // Slide-out panel, renders at app root
    <HelpBubble />                      // Floating help button, fixed position bottom-right
  </App>
</HelpProvider>
```

**HelpProvider responsibilities:**
- Fetch and cache help content (tooltips, walkthroughs, article mappings) on app initialization
- Track current route and update contextual article suggestions
- Manage active walkthrough state (current step, overlay visibility)
- Expose `showTooltip()`, `startWalkthrough()`, `openTroubleshooter()`, `openHelpSidebar()` methods via context
- Coordinate: only one help surface active at a time (tooltip OR walkthrough OR troubleshooter)

### State Management

| State | Storage | Sync | Reason |
|-------|---------|------|--------|
| Dismissed tooltips | User profile API | Server → client on login | Persists across devices and sessions |
| Completed walkthroughs | User profile API | Server → client on login | Must survive logout/device switch |
| Walkthrough progress (mid-tour) | sessionStorage + server | Sync to server on step completion | Resume on next session if abandoned |
| Article cache | Service worker cache (24h TTL) | Background refresh daily | Avoid re-fetching articles on every page |
| Troubleshooter state | Component state (ephemeral) | Not synced | Troubleshooters are short, restart on page leave |
| Help preferences (e.g., "never show auto-tooltips") | User profile API | Server → client on login | User's explicit choice, respect everywhere |

### Analytics Events

Every in-app help interaction emits a structured analytics event to {{ANALYTICS_TOOL}}:

```
help.tooltip.shown           → { element_id, page, trigger_type, tooltip_key }
help.tooltip.dismissed       → { element_id, permanent: boolean, tooltip_key }
help.tooltip.link_clicked    → { tooltip_key, article_id }

help.walkthrough.started     → { walkthrough_id, version, trigger }
help.walkthrough.step_viewed → { walkthrough_id, step_id, step_number }
help.walkthrough.step_completed → { walkthrough_id, step_id, time_spent_ms }
help.walkthrough.completed   → { walkthrough_id, total_time_ms, total_steps }
help.walkthrough.skipped     → { walkthrough_id, skipped_at_step, skip_type: "permanent"|"later" }

help.troubleshooter.started  → { troubleshooter_id, entry_point }
help.troubleshooter.node_reached → { troubleshooter_id, node_id, path_so_far }
help.troubleshooter.completed → { troubleshooter_id, resolution_path, resolved: boolean, time_ms }
help.troubleshooter.escalated → { troubleshooter_id, escalation_node, path_so_far }

help.sidebar.opened          → { page, trigger: "help_button"|"tooltip_link"|"keyboard_shortcut" }
help.article.surfaced        → { article_id, page, position_in_list, source: "manual"|"algorithmic" }
help.article.clicked         → { article_id, page, position_in_list }
help.article.helpful         → { article_id, page, helpful: boolean, feedback_text? }

help.empty_state.shown       → { feature, page }
help.empty_state.cta_clicked → { feature, page, cta_type }
```

---

## Content Authoring Workflow

### Ownership Matrix

| Content Type | Primary Author | Reviewer | Approval |
|--------------|---------------|----------|----------|
| Tooltips | Product designer or PM | {{CX_LEAD}} | PM sign-off |
| Walkthrough scripts | Product + support collaboration | {{CX_LEAD}} + QA | PM sign-off |
| Troubleshooters | Support team | {{CX_LEAD}} | Support lead sign-off |
| Empty-state copy | Product designer | Copywriter/brand | PM sign-off |
| Inline hints | Product designer | Copywriter/brand | PM sign-off |
| Article-to-page mappings | Support team + PM | {{CX_LEAD}} | No formal approval needed |

### Content Lifecycle

1. **Draft:** Author writes content in the help CMS or configuration file
2. **Preview:** Author uses preview mode to see content rendered in the product (staging environment) without deploying
3. **Review:** Reviewer checks for accuracy, tone consistency, and appropriate length
4. **Publish:** Content goes live (ideally via feature flag for gradual rollout)
5. **Monitor:** Watch analytics for 1 week — check engagement rates, dismissal rates, helpfulness scores
6. **Iterate:** Revise content based on data, then repeat from step 2
7. **Deprecate:** When a feature changes, mark associated help content for update; stale content is worse than no content

### Style Guide for In-App Help Content

- **Voice:** Conversational, direct, helpful. Write like a smart colleague, not a manual.
- **Length:** Tooltips: 1-2 sentences (max 140 chars body). Walkthrough steps: 1-2 sentences. Troubleshooter questions: 1 sentence.
- **Formatting:** No markdown in tooltips. Minimal markdown in walkthroughs (bold for emphasis only). Numbered lists in troubleshooter solutions.
- **Avoid:** Jargon the user wouldn't know, passive voice, apologies ("Sorry, this feature..."), exclamation marks (more than one per walkthrough).
- **Test:** Read every piece of help content aloud. If it sounds robotic, rewrite it.

### Localization

All in-app help strings must go through the same i18n pipeline as the product UI:
- Store help content with locale keys (e.g., `en-US`, `es-ES`, `ja-JP`)
- Translations managed in {{LOCALIZATION_TOOL}} alongside product strings
- Fallback: if a tooltip is not translated for the user's locale, show the `{{DEFAULT_LOCALE}}` version rather than nothing
- Do not launch a walkthrough in a locale where fewer than 80% of steps are translated

---

## Tool Decision Tree

| Situation | Recommended Tool | Why |
|-----------|-----------------|-----|
| Need full-featured tours + tooltips + analytics, budget available | {{CX_WALKTHROUGH_TOOL}} — evaluate Appcues, Userflow, Pendo, Chameleon | Purpose-built, fast to deploy, no engineering maintenance |
| Budget-constrained or simple needs (< 10 tooltips, 1-2 tours) | Shepherd.js (open-source, 8KB) or Intro.js (open-source, 10KB) | Free, lightweight, sufficient for basic needs |
| Heavy troubleshooter needs with branching logic | Custom implementation with the tree data model above | No good off-the-shelf product handles decision trees well |
| Already using Intercom for support | Intercom Product Tours | Native integration, no additional vendor, unified analytics |
| Already using Zendesk for support | Zendesk Web Widget with contextual help | Surfaces Zendesk articles in-app, unified with ticket system |
| Developer-heavy product, minimal help needs | Custom implementation with a simple JSON config | Keep it lean; developers respect lightweight solutions |

**{{PROJECT_NAME}} recommendation:** Start with {{CX_WALKTHROUGH_TOOL}} for walkthroughs and tooltips. Build troubleshooters custom. Use the contextual sidebar with your existing KB system.

---

## Performance & Accessibility Requirements

### Performance

- Help content bundle: < 50KB gzipped for initial load (tooltips + walkthrough definitions)
- Lazy-load troubleshooter trees and article content on demand
- Tooltip render time: < 16ms (must not cause frame drops)
- Walkthrough overlay: use CSS `will-change: opacity` for smooth transitions
- Article sidebar: virtualize article list if > 20 articles on a single page

### Accessibility

- All tooltips reachable via keyboard (Tab to element, Enter/Space to toggle)
- Walkthrough steps announced by screen readers (use `aria-live="polite"` for step content changes)
- Coach mark overlays: ensure the spotlight region is still focusable and operable
- Troubleshooter: fully keyboard-navigable (arrow keys for options, Enter to select)
- Help sidebar: focus trapped inside when open, Escape to close, focus returns to trigger element
- All help text meets WCAG 2.1 AA contrast requirements
- Respect `prefers-reduced-motion`: disable pulse animations, slide-in transitions become instant

---

## Implementation Checklist

- [ ] Audit product UI for tooltip opportunities — identify 20+ elements that would benefit from explanatory tooltips
- [ ] Prioritize and write tooltip content for the top 10 most-needed elements
- [ ] Design and implement the onboarding walkthrough (5-7 steps, targeting time-to-first-value)
- [ ] Create troubleshooters for the top 5 support ticket categories (by volume)
- [ ] Build the `help-context-map.json` — map KB articles to the 15 most-visited product pages
- [ ] Implement the contextual help sidebar component
- [ ] Implement analytics event tracking for all help interactions listed above
- [ ] Set up a dashboard in {{ANALYTICS_TOOL}} for in-app help metrics
- [ ] Set up A/B testing for onboarding walkthrough (test length, trigger timing, content)
- [ ] Establish content review cadence: review all in-app help content on {{CX_KB_REVIEW_CADENCE}} schedule
- [ ] Test all help surfaces for keyboard accessibility and screen reader compatibility
- [ ] Load-test: verify help content bundle stays under 50KB gzipped
- [ ] Document the authoring workflow so non-engineers can create and update help content independently
