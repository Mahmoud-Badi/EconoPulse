# Demo Script for {{PROJECT_NAME}}

> **The complete narration, tooltip text, and transition copy for every step of the interactive demo.**
> Reference `feature-map.template.md` for step order and `demo-strategy.template.md` for tone.

---

## Table of Contents

1. [Tone & Voice Alignment](#tone--voice-alignment)
2. [Welcome Screen Copy](#welcome-screen-copy)
3. [Mode Selection Screen](#mode-selection-screen)
4. [Guided Tour Steps](#guided-tour-steps)
5. [Free-Explore Hotspot Labels](#free-explore-hotspot-labels)
6. [CTA Copy](#cta-copy)
7. [Error & Edge-Case Messaging](#error--edge-case-messaging)
8. [Localization Considerations](#localization-considerations)
9. [Copy Review Checklist](#copy-review-checklist)

---

## Tone & Voice Alignment

### Brand Voice Reference

<!-- Reference the brand messaging output from Step 19. -->

| Attribute | Guideline |
|-----------|-----------|
| **Brand Voice** | {{VOICE, e.g., "Professional but approachable. Confident, not salesy."}} |
| **Tone for Demo** | {{TONE, e.g., "Friendly guide — like a knowledgeable colleague showing you around"}} |
| **Reading Level** | {{LEVEL, e.g., "Grade 8 — clear, simple sentences"}} |
| **Jargon Policy** | {{POLICY, e.g., "Use industry terms the persona already knows. Avoid internal product jargon."}} |
| **Pronoun Usage** | {{PRONOUNS, e.g., "Address the user as 'you.' Refer to the product as 'we' or by name."}} |
| **Emoji Usage** | {{EMOJI_POLICY, e.g., "Minimal — one per tooltip max, only if on-brand"}} |
| **Max Tooltip Length** | {{MAX_WORDS, e.g., 25}} words per tooltip |
| **Max Description Length** | {{MAX_WORDS, e.g., 50}} words per step description |

### Voice Examples

| Do | Don't |
|----|-------|
| "{{GOOD_EXAMPLE, e.g., 'Click here to create your first project.'}}" | "{{BAD_EXAMPLE, e.g., 'Initiate a new project instance via the creation modal.'}}" |
| "{{GOOD_EXAMPLE}}" | "{{BAD_EXAMPLE}}" |
| "{{GOOD_EXAMPLE}}" | "{{BAD_EXAMPLE}}" |

---

## Welcome Screen Copy

### Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│            [{{PROJECT_LOGO}}]               │
│                                             │
│    {{WELCOME_HEADLINE}}                     │
│                                             │
│    {{WELCOME_SUBHEADLINE}}                  │
│                                             │
│    ┌─────────────┐  ┌──────────────────┐    │
│    │ Take a Tour │  │ Explore Freely   │    │
│    └─────────────┘  └──────────────────┘    │
│                                             │
│    {{WELCOME_FOOTER_TEXT}}                   │
│                                             │
└─────────────────────────────────────────────┘
```

### Welcome Copy

| Element | Copy |
|---------|------|
| **Headline** | {{WELCOME_HEADLINE, e.g., "See {{PROJECT_NAME}} in action"}} |
| **Subheadline** | {{WELCOME_SUBHEADLINE, e.g., "Take a guided tour or explore on your own — no sign-up required."}} |
| **Guided Tour Button** | {{GUIDED_BUTTON_TEXT, e.g., "Take a Tour"}} |
| **Free Explore Button** | {{FREE_BUTTON_TEXT, e.g., "Explore Freely"}} |
| **Footer Text** | {{FOOTER_TEXT, e.g., "Takes about {{DURATION}} minutes"}} |
| **Background** | {{BACKGROUND, e.g., "Product screenshot blurred at 50% opacity"}} |

---

## Mode Selection Screen

<!-- IF {{MODE_SELECTION_SEPARATE}} -->

### Guided Mode Description

| Element | Copy |
|---------|------|
| **Card Title** | {{GUIDED_TITLE, e.g., "Guided Tour"}} |
| **Card Description** | {{GUIDED_DESC, e.g., "We'll walk you through the key features step by step. Perfect if you're new to {{PROJECT_NAME}}."}} |
| **Duration Label** | {{GUIDED_DURATION, e.g., "~{{MINUTES}} minutes"}} |
| **Step Count** | {{GUIDED_STEPS, e.g., "{{COUNT}} steps"}} |
| **Icon** | {{GUIDED_ICON, e.g., "compass / map / route"}} |

### Free Explore Description

| Element | Copy |
|---------|------|
| **Card Title** | {{FREE_TITLE, e.g., "Free Explore"}} |
| **Card Description** | {{FREE_DESC, e.g., "Jump into the product and click around. Hotspots highlight key features you can learn about."}} |
| **Duration Label** | {{FREE_DURATION, e.g., "At your own pace"}} |
| **Hotspot Count** | {{FREE_HOTSPOTS, e.g., "{{COUNT}} features to discover"}} |
| **Icon** | {{FREE_ICON, e.g., "binoculars / magnifying glass / sparkle"}} |

<!-- ENDIF -->

---

## Guided Tour Steps

### Step Template

<!-- Copy this block for each step. Step order comes from feature-map.template.md. -->

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE, e.g., "Interactive — Click"}} |
| **Target Element** | {{TARGET_SELECTOR, e.g., "#create-project-btn"}} |
| **Spotlight Area** | {{SPOTLIGHT, e.g., "Top-right corner, 200x50px around the button"}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE, e.g., "Create Your First Project"}}

**Tooltip Description:**
> {{TOOLTIP_DESC, e.g., "Click here to start a new project. You'll see how quickly you can get set up."}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION, e.g., "This is where it all begins. One click and you've got a new project with everything pre-configured."}}

**Transition to Next Step:**
> {{TRANSITION_TEXT, e.g., "Great! Now let's see what your new project looks like."}}

**Fallback Behavior:**
> {{FALLBACK, e.g., "If no click after 8 seconds, pulse the button and show hint: 'Try clicking the blue button.'"}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

#### Step {{STEP_NUMBER}}: {{STEP_TITLE}}

| Property | Value |
|----------|-------|
| **Feature** | {{FEATURE_NAME}} |
| **Screen** | {{SCREEN_NAME}} |
| **Interaction Type** | {{INTERACTION_TYPE}} |
| **Target Element** | {{TARGET_SELECTOR}} |
| **Spotlight Area** | {{SPOTLIGHT}} |

**Tooltip Title:**
> {{TOOLTIP_TITLE}}

**Tooltip Description:**
> {{TOOLTIP_DESC}}

**Narration (if audio/voiceover enabled):**
> {{NARRATION}}

**Transition to Next Step:**
> {{TRANSITION_TEXT}}

**Fallback Behavior:**
> {{FALLBACK}}

---

### Adding More Steps

Copy the step template block above for each additional step. Ensure:
- Step numbers are sequential
- Every step has a tooltip title, description, and transition
- Interactive steps have a target element and fallback behavior
- Total word count stays within the time budget from `feature-map.template.md`

---

## Free-Explore Hotspot Labels

### Hotspot Inventory

<!-- In free-explore mode, hotspots are beacons placed over key features. Clicking a hotspot shows a tooltip. -->

| Hotspot # | Feature | Screen Location | Beacon Position | Hotspot Label | Tooltip Text | Category |
|-----------|---------|----------------|----------------|---------------|-------------|----------|
| 1 | {{FEATURE}} | {{SCREEN}} | {{POSITION, e.g., "Top-right of sidebar"}} | {{LABEL, e.g., "Dashboard"}} | {{TOOLTIP, e.g., "Your command center. See all projects, tasks, and metrics at a glance."}} | {{CATEGORY}} |
| 2 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 3 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 4 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 5 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 6 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 7 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 8 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 9 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |
| 10 | {{FEATURE}} | {{SCREEN}} | {{POSITION}} | {{LABEL}} | {{TOOLTIP}} | {{CATEGORY}} |

### Hotspot Discovery Tracker Text

| State | Copy |
|-------|------|
| **Progress Label** | {{PROGRESS_TEXT, e.g., "{{DISCOVERED}} of {{TOTAL}} features explored"}} |
| **All Discovered** | {{COMPLETE_TEXT, e.g., "You've explored everything! Ready to try it for real?"}} |
| **Hint Text** | {{HINT_TEXT, e.g., "Look for the pulsing dots to discover more features"}} |

---

## CTA Copy

### Entry Gate CTA

<!-- IF {{ENTRY_GATE_ENABLED}} -->

| Element | Copy |
|---------|------|
| **Headline** | {{GATE_HEADLINE, e.g., "See {{PROJECT_NAME}} in action"}} |
| **Subheadline** | {{GATE_SUBHEADLINE, e.g., "Enter your email to start the interactive demo"}} |
| **Email Field Placeholder** | {{PLACEHOLDER, e.g., "work@company.com"}} |
| **Submit Button** | {{SUBMIT_TEXT, e.g., "Start Demo"}} |
| **Skip Link** | {{SKIP_TEXT, e.g., "Skip and explore without email"}} |
| **Privacy Text** | {{PRIVACY_TEXT, e.g., "We'll only use your email to follow up on the demo. No spam."}} |

<!-- ENDIF -->

### Mid-Tour CTA

<!-- IF {{MID_TOUR_CTA_ENABLED}} -->

| Property | Value |
|----------|-------|
| **Appears After Step** | {{STEP_NUMBER}} |
| **Trigger** | {{TRIGGER, e.g., "After completing the 'Aha moment' step"}} |
| **Format** | {{FORMAT, e.g., "Slide-up banner / Modal / Inline card"}} |

| Element | Copy |
|---------|------|
| **Headline** | {{MID_CTA_HEADLINE, e.g., "Like what you see?"}} |
| **Body** | {{MID_CTA_BODY, e.g., "You've just scratched the surface. Sign up to build your own."}} |
| **Primary Button** | {{MID_CTA_PRIMARY, e.g., "Start Free Trial"}} |
| **Secondary Button** | {{MID_CTA_SECONDARY, e.g., "Keep Exploring"}} |
| **Dismiss Behavior** | {{DISMISS, e.g., "Click secondary or X to continue demo"}} |

<!-- ENDIF -->

### End-Screen CTA

| Element | Copy |
|---------|------|
| **Headline** | {{END_HEADLINE, e.g., "Ready to try {{PROJECT_NAME}} for yourself?"}} |
| **Body** | {{END_BODY, e.g., "You've seen what it can do. Now build something real."}} |
| **Primary Button** | {{END_PRIMARY, e.g., "Start Free Trial"}} |
| **Primary Button URL** | {{END_PRIMARY_URL}} |
| **Secondary Button** | {{END_SECONDARY, e.g., "Book a Demo Call"}} |
| **Secondary Button URL** | {{END_SECONDARY_URL}} |
| **Tertiary Link** | {{END_TERTIARY, e.g., "Replay Tour"}} |
| **Social Proof** | {{SOCIAL_PROOF, e.g., "Join 2,000+ teams already using {{PROJECT_NAME}}"}} |

### Persistent CTA (Bottom Bar)

<!-- IF {{PERSISTENT_CTA_ENABLED}} -->

| Element | Copy |
|---------|------|
| **Bar Text** | {{BAR_TEXT, e.g., "Ready to get started?"}} |
| **Button Text** | {{BAR_BUTTON, e.g., "Sign Up Free"}} |
| **Button URL** | {{BAR_BUTTON_URL}} |
| **Visibility** | {{VISIBILITY, e.g., "Shown after Step 3, persists through end"}} |

<!-- ENDIF -->

---

## Error & Edge-Case Messaging

| Scenario | User Sees | Recovery Action |
|----------|----------|----------------|
| Demo fails to load | {{ERROR_LOAD, e.g., "Something went wrong loading the demo. Please refresh."}} | Refresh button |
| Step asset missing | {{ERROR_ASSET, e.g., "This step is temporarily unavailable."}} | Skip to next step |
| Browser not supported | {{ERROR_BROWSER, e.g., "For the best experience, please use Chrome, Firefox, or Safari."}} | Link to supported browsers |
| Mobile viewport too small | {{ERROR_VIEWPORT, e.g., "Rotate your device to landscape for the full experience."}} | Orientation prompt |
| Session expired | {{ERROR_SESSION, e.g., "Your demo session has expired. Click to restart."}} | Restart button |
| JavaScript disabled | {{ERROR_JS, e.g., "This interactive demo requires JavaScript. Please enable it and refresh."}} | `<noscript>` fallback |

---

## Localization Considerations

### Supported Languages

| Language | Code | Status | Translator / Method |
|----------|------|--------|-------------------|
| {{PRIMARY_LANGUAGE, e.g., "English"}} | {{CODE, e.g., "en"}} | Primary | — |
| {{LANGUAGE_2}} | {{CODE}} | {{STATUS, e.g., "Planned"}} | {{METHOD, e.g., "Professional translation"}} |
| {{LANGUAGE_3}} | {{CODE}} | {{STATUS}} | {{METHOD}} |

### Localization Rules

- [ ] All tooltip text extracted into a translatable JSON file
- [ ] No text hardcoded in images — use CSS overlays instead
- [ ] Date/number formats adapt to locale
- [ ] CTA text reviewed for cultural appropriateness per market
- [ ] Right-to-left (RTL) layout tested if applicable
- [ ] Character limits account for text expansion (German ~30% longer, Japanese ~shorter)

### Text Expansion Buffer

| Element | English Length | Max Expanded Length | Notes |
|---------|--------------|--------------------|----|
| Tooltip title | {{CHARS}} chars | {{MAX_CHARS}} chars | {{NOTES}} |
| Tooltip description | {{CHARS}} chars | {{MAX_CHARS}} chars | {{NOTES}} |
| Button text | {{CHARS}} chars | {{MAX_CHARS}} chars | {{NOTES}} |
| CTA headline | {{CHARS}} chars | {{MAX_CHARS}} chars | {{NOTES}} |

---

## Copy Review Checklist

- [ ] All tooltip titles are under {{MAX_TITLE_WORDS}} words
- [ ] All tooltip descriptions are under {{MAX_DESC_WORDS}} words
- [ ] Transition text reads naturally when steps are played in sequence
- [ ] CTA copy matches brand voice guide
- [ ] No spelling or grammar errors
- [ ] No placeholder text remaining (all `{{}}` replaced)
- [ ] Narration text (if used) sounds natural when read aloud
- [ ] Free-explore hotspot labels are concise and scannable
- [ ] Error messages are helpful and non-technical
- [ ] All copy reviewed by {{REVIEWER_NAME}} on {{REVIEW_DATE}}

---

*This template is part of the Master Starter Kit walkthrough demo system. See `WALKTHROUGH-DEMO-GENERATOR.md` for the generation prompt.*
