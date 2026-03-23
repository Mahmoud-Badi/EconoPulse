# Onboarding Wizard — Component Spec

Specification for the first-run onboarding experience that guides new users through initial setup.

---

## When It Appears

- **First login** after account creation
- **Re-triggered** from Settings → "Take the Tour Again"
- **Role-based:** Different flows for different user roles (from `{{USER_ROLES}}`)

---

## Behavior

- **Type:** Multi-step wizard with progress indicator
- **Skip:** "Skip" button always visible (do not force completion)
- **Remember:** Store completion state in user preferences (don't show again on next login)
- **Responsive:** Works on desktop and tablet. On mobile, use the carousel pattern from `mobile-help-patterns.md` instead.

---

## Wizard Layout (Desktop/Tablet)

```text
┌────────────────────────────────────────────────┐
│                                                │
│           Welcome to {{PROJECT_NAME}}!         │
│                                                │
│    ┌──────────────────────────────────────┐    │
│    │                                      │    │
│    │         [Illustration/Screenshot]     │    │
│    │                                      │    │
│    └──────────────────────────────────────┘    │
│                                                │
│    Step Title                                  │
│    Step description explaining what this       │
│    feature does and why it matters.             │
│                                                │
│    ● ○ ○ ○ ○                                   │
│                                                │
│    [Skip]                        [Next →]      │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Steps

### Step 1: Welcome

- Title: "Welcome to {{PROJECT_NAME}}"
- Content: Brief value proposition (1-2 sentences)
- Visual: App logo or hero illustration
- Action: "Let's Get Started →"

### Step 2: Core Concept

- Title: Explain the primary concept the user needs to understand
- Content: What the app does in plain language
- Visual: Screenshot of the main dashboard/screen
- Action: "Next →"

### Step 3: Primary Action

- Title: "Your First {{PRIMARY_WORKFLOW_NAME}}"
- Content: Walk through the most common action
- Visual: Screenshot or animated GIF of the workflow
- Action: "Next →"

### Step 4: Key Navigation

- Title: "Finding Your Way Around"
- Content: Point out sidebar, key menu items, search
- Visual: Annotated screenshot of the navigation
- Action: "Next →"

### Step 5: Get Help

- Title: "Need Help?"
- Content: Point out the `?` help button, link to docs, support contact
- Visual: Screenshot showing help button location
- Action: "Start Using {{PROJECT_NAME}} →"

---

## Role-Based Variations

<!-- IF {{HAS_ADMIN_ROLE}} == "true" -->
### Admin-Only Steps (inserted after Step 2)

- **Team Setup:** "Invite your team" — explain how to add team members
- **Configuration:** "Set up your workspace" — key settings to configure first
<!-- ENDIF -->

---

## Technical Notes

- Store wizard completion in user preferences table, not localStorage (survives device changes)
- Each step can include a `screenshot` field — the AI populates these via `/capture-screenshots`
- Wizard should not block the application — user can dismiss and use the app at any point
- Track wizard completion rate in analytics (how many users complete vs skip)
- If the app has significant updates, consider a "What's New" mini-wizard (2-3 steps max) for returning users
