---
feature: {{FEATURE_SLUG}}
task_id: {{TASK_ID}}
generated_by: document-feature skill
generated_date: {{GENERATED_DATE}}
source_spec: {{SOURCE_SPEC_PATH}}
screenshots_pending: {{SCREENSHOTS_PENDING_COUNT}}
last_verified: null
platforms: {{PLATFORMS}}
---

# {{FEATURE_NAME}}

> {{FEATURE_SHORT_DESCRIPTION}}

---

## What This Feature Does

{{FEATURE_DESCRIPTION}}

<!-- IF {{HAS_MOBILE}} == "true" -->
**Available on:** {{PLATFORMS}}
<!-- ENDIF -->

---

## Who This Is For

{{TARGET_USER_ROLES}}

---

## Before You Start

Make sure you have:

- [ ] {{PREREQUISITE_1}}
- [ ] {{PREREQUISITE_2}}
- [ ] {{PREREQUISITE_3}}

---

## How to Use {{FEATURE_NAME}}

### Step 1: {{STEP_1_TITLE}}

{{STEP_1_INSTRUCTIONS}}

![Screenshot: {{STEP_1_SCREENSHOT_DESCRIPTION}}]({{USER_DOCS_PATH}}/screenshots/web/{{FEATURE_SLUG}}/step-1.png)
<!-- SCREENSHOT_PENDING: {{STEP_1_SCREENSHOT_INSTRUCTIONS}} -->

**What you should see:** {{STEP_1_EXPECTED_RESULT}}

### Step 2: {{STEP_2_TITLE}}

{{STEP_2_INSTRUCTIONS}}

![Screenshot: {{STEP_2_SCREENSHOT_DESCRIPTION}}]({{USER_DOCS_PATH}}/screenshots/web/{{FEATURE_SLUG}}/step-2.png)
<!-- SCREENSHOT_PENDING: {{STEP_2_SCREENSHOT_INSTRUCTIONS}} -->

**What you should see:** {{STEP_2_EXPECTED_RESULT}}

### Step 3: {{STEP_3_TITLE}}

{{STEP_3_INSTRUCTIONS}}

**What you should see:** {{STEP_3_EXPECTED_RESULT}}

<!-- IF {{HAS_MOBILE}} == "true" -->

---

## On Mobile

<!-- IF {{PLATFORM_SCOPE}} == "cross-platform" -->
This feature works the same on mobile with these differences:

### iOS

{{IOS_SPECIFIC_INSTRUCTIONS}}

![Screenshot: {{FEATURE_NAME}} on iOS]({{USER_DOCS_PATH}}/screenshots/ios/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=ios, device=iPhone 15, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen -->

### Android

{{ANDROID_SPECIFIC_INSTRUCTIONS}}

![Screenshot: {{FEATURE_NAME}} on Android]({{USER_DOCS_PATH}}/screenshots/android/{{FEATURE_SLUG}}/main.png)
<!-- SCREENSHOT_PENDING: platform=android, device=Pixel 7, navigate to {{MOBILE_SCREEN_PATH}}, capture full screen -->

### Platform Differences

| Behavior | iOS | Android |
|----------|-----|---------|
| {{DIFFERENCE_1_LABEL}} | {{IOS_BEHAVIOR_1}} | {{ANDROID_BEHAVIOR_1}} |
<!-- ENDIF -->

<!-- IF {{PLATFORM_SCOPE}} == "mobile-only" -->
This feature is only available on the mobile app.

{{MOBILE_ONLY_INSTRUCTIONS}}
<!-- ENDIF -->
<!-- ENDIF -->

---

## Tips and Best Practices

- {{TIP_1}}
- {{TIP_2}}
- {{TIP_3}}

---

## Related Features

- [{{RELATED_FEATURE_1}}]({{USER_DOCS_PATH}}/guides/{{RELATED_FEATURE_1_SLUG}}.md)
- [{{RELATED_FEATURE_2}}]({{USER_DOCS_PATH}}/guides/{{RELATED_FEATURE_2_SLUG}}.md)

---

## Frequently Asked Questions

### {{FAQ_1_QUESTION}}

{{FAQ_1_ANSWER}}

### {{FAQ_2_QUESTION}}

{{FAQ_2_ANSWER}}

### {{FAQ_3_QUESTION}}

{{FAQ_3_ANSWER}}

---

## Troubleshooting

### {{PROBLEM_1_SYMPTOM}}

**Possible cause:** {{PROBLEM_1_CAUSE}}

**Solution:** {{PROBLEM_1_SOLUTION}}

### {{PROBLEM_2_SYMPTOM}}

**Possible cause:** {{PROBLEM_2_CAUSE}}

**Solution:** {{PROBLEM_2_SOLUTION}}

---

*Last updated: {{GENERATED_DATE}} | [Report an issue]({{SUPPORT_URL}})*
