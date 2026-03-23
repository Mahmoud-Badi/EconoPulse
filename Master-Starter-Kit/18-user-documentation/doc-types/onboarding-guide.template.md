---
role: {{USER_ROLE}}
generated_date: {{GENERATED_DATE}}
platforms: {{PLATFORMS}}
---

# Getting Started with {{PROJECT_NAME}}

Welcome to {{PROJECT_NAME}}! This guide will walk you through everything you need to get started.

<!-- IF {{USER_ROLE}} == "admin" -->
> You're setting up {{PROJECT_NAME}} as an **Administrator**. This guide covers initial configuration, team setup, and your first workflow.
<!-- ENDIF -->

<!-- IF {{USER_ROLE}} == "standard" -->
> You're getting started as a **{{USER_ROLE_DISPLAY_NAME}}**. This guide covers account setup and your core daily workflow.
<!-- ENDIF -->

---

## Step 1: Create Your Account

{{ACCOUNT_CREATION_INSTRUCTIONS}}

![Screenshot: Sign up page]({{USER_DOCS_PATH}}/screenshots/web/onboarding/signup.png)
<!-- SCREENSHOT_PENDING: Navigate to /signup, fill in sample data, capture before submit -->

**What you should see:** {{ACCOUNT_CREATION_EXPECTED_RESULT}}

---

## Step 2: Complete Your Profile

{{PROFILE_SETUP_INSTRUCTIONS}}

---

## Step 3: First-Time Configuration

<!-- IF {{USER_ROLE}} == "admin" -->
As an administrator, you'll need to configure:

1. **Organization settings** — {{ORG_SETTINGS_INSTRUCTIONS}}
2. **Team members** — {{TEAM_SETUP_INSTRUCTIONS}}
3. **Permissions** — {{PERMISSIONS_INSTRUCTIONS}}
<!-- ENDIF -->

<!-- IF {{USER_ROLE}} != "admin" -->
Your administrator has already configured the basics. You may want to:

1. **Set your preferences** — {{PREFERENCES_INSTRUCTIONS}}
2. **Connect your integrations** — {{INTEGRATIONS_INSTRUCTIONS}}
<!-- ENDIF -->

---

## Step 4: Your First {{PRIMARY_WORKFLOW_NAME}}

Now let's walk through the core workflow you'll use every day:

{{PRIMARY_WORKFLOW_DESCRIPTION}}

1. {{WORKFLOW_STEP_1}}
2. {{WORKFLOW_STEP_2}}
3. {{WORKFLOW_STEP_3}}

![Screenshot: {{PRIMARY_WORKFLOW_NAME}} completed]({{USER_DOCS_PATH}}/screenshots/web/onboarding/first-workflow.png)
<!-- SCREENSHOT_PENDING: Complete the primary workflow with seed data, capture the success state -->

---

<!-- IF {{HAS_MOBILE}} == "true" -->
## Getting Started on Mobile

### Download the App

- **iOS:** [Download from App Store]({{APP_STORE_URL}})
- **Android:** [Download from Google Play]({{PLAY_STORE_URL}})

### First Launch

When you open the app for the first time:

1. **Sign in** with your existing account (or create one)
2. **Allow permissions** — the app will ask for:
   - {{PERMISSION_1_NAME}}: {{PERMISSION_1_WHY}}
   - {{PERMISSION_2_NAME}}: {{PERMISSION_2_WHY}}
3. **Enable notifications** (recommended) — {{NOTIFICATIONS_WHY}}

<!-- IF {{MOBILE_OFFLINE}} == "true" -->
4. **Wait for initial sync** — the app will download your data for offline access. This may take a moment on first launch.
<!-- ENDIF -->

### Mobile Onboarding Tour

The app will walk you through key features with a guided tour. You can:
- Swipe through to learn the basics
- Tap "Skip" to jump straight in
- Access the tour again later from Settings → "Take a Tour"

![Screenshot: Mobile onboarding carousel]({{USER_DOCS_PATH}}/screenshots/ios/onboarding/carousel.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, first launch state, capture onboarding carousel screen 1 -->

<!-- ENDIF -->

---

## What's Next?

Now that you're set up, explore these guides:

- [{{GUIDE_1_TITLE}}]({{USER_DOCS_PATH}}/guides/{{GUIDE_1_SLUG}}.md) — {{GUIDE_1_DESCRIPTION}}
- [{{GUIDE_2_TITLE}}]({{USER_DOCS_PATH}}/guides/{{GUIDE_2_SLUG}}.md) — {{GUIDE_2_DESCRIPTION}}
- [{{GUIDE_3_TITLE}}]({{USER_DOCS_PATH}}/guides/{{GUIDE_3_SLUG}}.md) — {{GUIDE_3_DESCRIPTION}}

---

## Need Help?

- Browse our [FAQ]({{USER_DOCS_PATH}}/faq/)
- Check [Troubleshooting]({{USER_DOCS_PATH}}/troubleshooting/)
- [Contact Support]({{SUPPORT_URL}})

---

*Last updated: {{GENERATED_DATE}}*
